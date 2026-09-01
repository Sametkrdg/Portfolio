"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChatStore } from "@/src/store/chatStore";
import { content } from "@/src/lib/content";
import type { Locale } from "@/src/lib/types";

/* AI SDK v6 delivers messages as part arrays — flatten to text for display. */
function messageText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => (p as { type: string }).type === "text")
    .map((p) => (p as { type: string; text: string }).text)
    .join("");
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

/**
 * The chat widget lives once, in the shell. No animation: a plain launcher
 * button and a plain panel, both styled per theme through `[data-theme]`.
 *
 * On mobile the panel sits above the bottom theme bar rather than going full
 * screen, so the theme strip stays reachable while chatting.
 */
export default function ChatWidget({ locale }: { locale: Locale }) {
  const t = useTranslations("chat");
  const { isOpen, toggle, close } = useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      /* The server flattens the bilingual content down to this locale. */
      body: { locale },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const suggestions = content.chatbot.suggestions[locale];

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isStreaming, isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage({ text });
  }

  function errorMessage(message: string): string {
    if (message.includes("429")) return t("errorRateLimit");
    if (message.includes("502") || message.toLowerCase().includes("gemini")) {
      return t("errorService");
    }
    return t("errorGeneric", { email: content.meta.email });
  }

  return (
    <>
      {isOpen && (
        <div className="chat-panel" role="dialog" aria-label={t("title")}>
          <div className="chat-header">
            <div>
              <p className="chat-title">{t("title")}</p>
              <p className="chat-status">{t("status")}</p>
            </div>
            <button type="button" onClick={close} aria-label={t("close")} className="chat-close">
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-suggestions">
                <p className="chat-suggestions-label">{t("suggestionsLabel")}</p>
                {suggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => !isStreaming && sendMessage({ text: q })}
                    disabled={isStreaming}
                    className="chat-suggestion"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => {
              const text = messageText(m);
              if (!text) return null;
              return (
                <div
                  key={m.id}
                  className="chat-message"
                  data-role={m.role === "user" ? "user" : "assistant"}
                >
                  {text}
                </div>
              );
            })}

            {isStreaming && (
              <p className="chat-pending" aria-live="polite">
                …
              </p>
            )}

            {error && (
              <p role="alert" className="chat-error">
                {errorMessage(error.message)}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-form">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              disabled={isStreaming}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              aria-label={t("send")}
              className="chat-send"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? t("close") : t("open")}
        aria-expanded={isOpen}
        className="chat-launcher"
      >
        <ChatIcon />
      </button>
    </>
  );
}
