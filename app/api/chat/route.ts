import { streamText, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { content, flattenForLocale } from "@/src/lib/content";
import type { Locale } from "@/src/lib/types";

export const runtime = "edge";

/*
 * Sliding-window memory size. Gemini 2.5 Flash has a huge context window,
 * but we cap to the last 20 message parts (10 user + 10 assistant) for:
 *   - cost: each request is billed by input tokens — long histories add up
 *   - latency: less context = faster first-token
 *   - safety: prevents pathological clients from sending megabytes of fake
 *             history to exhaust our 1,500 daily Gemini quota
 */
const MAX_HISTORY_MESSAGES = 20;

const LOCALES = ["tr", "en"] as const;

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/*
 * System prompt — the JSON is bundled at build time, no file I/O per request.
 *
 * Only the visitor's own language goes into the prompt: sending both locales
 * would roughly double the input tokens and leave the model guessing which
 * language to answer in.
 */
function buildSystemPrompt(locale: Locale): string {
  const persona = content.chatbot.persona[locale];
  const dos = content.chatbot.do.map((line) => `- ${line}`).join("\n");
  const donts = content.chatbot.dont.map((line) => `- ${line}`).join("\n");

  return `${persona}

DO:
${dos}

DO NOT:
${donts}

If asked something outside the context below, say you do not have that detail and point to ${content.meta.email}.

PORTFOLIO CONTEXT:
${JSON.stringify(flattenForLocale(locale), null, 2)}`;
}

/*
 * Rate limiting via Upstash Redis. Limits: 5 requests per IP per 60 seconds.
 * If either env var is absent (local dev without Redis), requests pass through.
 */
function buildRatelimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: false,
  });
}

const ratelimit = buildRatelimiter();

/*
 * AI SDK v6: messages arrive as UIMessage[] (parts-based), not CoreMessage[].
 * Extract the plain text from each part so streamText can consume them.
 */
function toCoreMessages(uiMessages: UIMessage[]) {
  return uiMessages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.parts
        .filter((p) => (p as { type: string }).type === "text")
        .map((p) => (p as { type: string; text: string }).text)
        .join(""),
    }))
    .filter((m) => m.content.trim().length > 0);
}

export async function POST(req: Request) {
  /* ── Rate limiting ── */
  if (ratelimit) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    const { success, remaining } = await ratelimit.limit(`chat:${ip}`);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Too many messages — please wait a moment." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": String(remaining),
          },
        }
      );
    }
  }

  /* ── Parse body ── */
  const body = await req.json().catch(() => null);
  const uiMessages: UIMessage[] = body?.messages ?? [];
  const locale: Locale = isLocale(body?.locale) ? body.locale : "tr";

  if (!Array.isArray(uiMessages) || uiMessages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  /* ── Sliding-window memory: keep only the most recent N messages ── */
  const windowed = uiMessages.slice(-MAX_HISTORY_MESSAGES);

  /* ── Stream from Gemini with graceful error mapping ── */
  let result;
  try {
    result = streamText({
      model: google("gemini-2.5-flash"),
      system: buildSystemPrompt(locale),
      messages: toCoreMessages(windowed),
      maxOutputTokens: 600,
      temperature: 0.7,
    });
  } catch (err) {
    /* Surfaces upstream Gemini failures (quota, network, auth) as JSON the
     * client can match on, instead of a half-stream. */
    const message =
      err instanceof Error ? err.message : "AI service unavailable.";
    return new Response(JSON.stringify({ error: `Gemini error: ${message}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return result.toUIMessageStreamResponse();
}
