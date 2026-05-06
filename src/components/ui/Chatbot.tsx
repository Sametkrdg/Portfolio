"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/src/store/chatStore";

/* ─── Suggested starter questions ─── */
const SUGGESTIONS = [
  "What is Samet's tech stack?",
  "Tell me about the Tersan experience.",
  "What projects has Samet built?",
  "Is Samet available for freelance?",
  "What makes his .NET architecture stand out?",
] as const;

/* ─── Extract plain text from AI SDK v6 UIMessage parts ─── */
function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => (p as { type: string }).type === "text")
    .map((p) => (p as { type: string; text: string }).text)
    .join("");
}

/* ─── Typing indicator — 3 staggered bouncing dots ─── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {([0, 0.18, 0.36] as const).map((delay, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]"
          style={{ animation: `bounce 1s ${delay}s infinite` }}
        />
      ))}
    </div>
  );
}

/* ─── SVG icons ─── */
function ChatIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ─── Main component ─── */
export default function Chatbot() {
  const { isOpen, toggle } = useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  /*
   * AI SDK v6 useChat — no args needed.
   * Chat class defaults to DefaultChatTransport({ api: '/api/chat' }).
   *
   * New API surface vs SDK v3/v4:
   *   sendMessage({ text })  ← replaces append()
   *   status                 ← replaces isLoading boolean
   *   messages[].parts       ← replaces messages[].content string
   */
  const { messages, sendMessage, status, error } = useChat();

  const isStreaming = status === "streaming" || status === "submitted";

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  /* Submit typed message */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage({ text });
  }

  /* Submit a suggestion chip directly */
  function sendSuggestion(text: string) {
    if (isStreaming) return;
    sendMessage({ text });
  }

  return (
    <>
      {/* ── Floating Action Button ── */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-[var(--color-bg-base)]"
        style={{
          background:
            "linear-gradient(135deg, var(--color-cyan-neon), var(--color-purple-neon))",
          boxShadow: "0 0 24px rgba(0,217,255,0.35), 0 4px 24px rgba(0,0,0,0.5)",
        }}
        onClick={toggle}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 42px rgba(0,217,255,0.6), 0 4px 24px rgba(0,0,0,0.5)",
        }}
        whileTap={{ scale: 0.93 }}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="text-lg font-bold leading-none"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="fixed bottom-24 right-6 z-40 flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border sm:w-96"
            style={{
              background: "rgba(5, 8, 15, 0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(0, 217, 255, 0.14)",
              boxShadow:
                "0 0 80px rgba(0,217,255,0.07), 0 32px 80px rgba(0,0,0,0.65)",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center gap-3 border-b border-[var(--color-bg-muted)] px-4 py-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,217,255,0.07), rgba(180,77,255,0.04))",
              }}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-cyan-neon)] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-cyan-neon)]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Ask Samet&apos;s AI
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Gemini 2.5 Flash · 5 messages/min
                </p>
              </div>
            </div>

            {/* ── Messages area ── */}
            <div className="flex h-80 flex-col gap-2 overflow-y-auto p-4">

              {/* Empty state — suggestion chips */}
              {messages.length === 0 && (
                <div className="flex flex-1 flex-col gap-2">
                  <p className="mb-1 text-[11px] font-medium text-[var(--color-text-muted)]">
                    Ask me anything about Samet:
                  </p>
                  {SUGGESTIONS.map((q) => (
                    <motion.button
                      key={q}
                      onClick={() => sendSuggestion(q)}
                      disabled={isStreaming}
                      className="rounded-lg border border-[var(--color-bg-muted)] px-3 py-2 text-left text-[12px] text-[var(--color-text-secondary)] transition-colors disabled:opacity-50"
                      whileHover={{
                        borderColor: "rgba(0,217,255,0.4)",
                        color: "var(--color-cyan-neon)",
                      }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Message bubbles */}
              {messages.map((m) => {
                const isUser = m.role === "user";
                const text = getMessageText(m);
                if (!text) return null;

                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[85%] text-[13px] leading-relaxed"
                      style={
                        isUser
                          ? {
                              background: "rgba(0,217,255,0.12)",
                              border: "1px solid rgba(0,217,255,0.25)",
                              color: "var(--color-text-primary)",
                              borderRadius: "12px 12px 2px 12px",
                              padding: "8px 12px",
                            }
                          : {
                              background: "rgba(180,77,255,0.07)",
                              border: "1px solid rgba(180,77,255,0.15)",
                              color: "var(--color-text-secondary)",
                              borderRadius: "12px 12px 12px 2px",
                              padding: "8px 12px",
                            }
                      }
                    >
                      {text}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator while streaming */}
              {isStreaming && (
                <div className="flex justify-start">
                  <div
                    style={{
                      background: "rgba(180,77,255,0.07)",
                      border: "1px solid rgba(180,77,255,0.15)",
                      borderRadius: "12px 12px 12px 2px",
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <p className="text-center text-[11px] text-red-400/80">
                  {error.message.includes("429")
                    ? "Rate limit reached — wait a moment."
                    : "Something went wrong. Please try again."}
                </p>
              )}

              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </div>

            {/* ── Input form ── */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-[var(--color-bg-muted)] p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something…"
                  disabled={isStreaming}
                  className="flex-1 rounded-lg border border-[var(--color-bg-muted)] bg-[var(--color-bg-surface)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-cyan-neon)] disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-bg-base)] disabled:opacity-40"
                  style={{
                    background: input.trim() && !isStreaming
                      ? "var(--color-cyan-neon)"
                      : "var(--color-bg-muted)",
                  }}
                  whileHover={input.trim() && !isStreaming ? { scale: 1.08 } : {}}
                  whileTap={input.trim() && !isStreaming ? { scale: 0.93 } : {}}
                >
                  <SendIcon />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
