"use client";

import { useState, useRef, useEffect, useLayoutEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useChatStore } from "@/src/store/chatStore";

/*
 * Lazy-loaded Robot canvas. We isolate the R3F <Canvas> import behind
 * dynamic+ssr:false because three.js can't be imported in a server bundle,
 * and we want this widget hot on every page (it's in the root layout).
 */
const RobotMiniScene = dynamic(() => import("./RobotMiniScene"), { ssr: false });

const SUGGESTIONS = [
  "What is Samet's tech stack?",
  "Tell me about the Tersan internship.",
  "What projects has Samet built?",
  "Is Samet available for freelance?",
] as const;

const GREETING = "Welcome to Samet's page! 👋 Tap me to chat.";

/* AI SDK v6: messages are part-arrays — flatten to plain text for display */
function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => (p as { type: string }).type === "text")
    .map((p) => (p as { type: string; text: string }).text)
    .join("");
}

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

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function RobotChatbot() {
  const { isOpen, toggle, close } = useChatStore();
  const [input, setInput] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /*
   * Welcome-message logic:
   *   - On mount, check sessionStorage for "hasSeenGreeting".
   *   - If empty/null, schedule a 1800 ms timeout that flips showGreeting=true
   *     AND writes the flag, so subsequent client-side navigations within the
   *     same browser tab won't replay the greeting.
   *   - If the flag is already set, do nothing.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("hasSeenGreeting");
    if (seen) return;

    const t = window.setTimeout(() => {
      setShowGreeting(true);
      sessionStorage.setItem("hasSeenGreeting", "true");
    }, 1800);

    return () => window.clearTimeout(t);
  }, []);

  function dismissGreeting() {
    setShowGreeting(false);
    /* Flag is already written when the greeting first appeared; this
     * function only hides the bubble locally if the user clicks ✕. */
  }

  const { messages, sendMessage, status, error } = useChat();
  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage({ text });
  }

  function sendSuggestion(text: string) {
    if (isStreaming) return;
    sendMessage({ text });
  }

  function handleRobotClick() {
    dismissGreeting();
    toggle();
  }

  /*
   * Y-offset (in px) the robot translates upward when the chat opens.
   *
   * The chat panel is ~460 px tall on desktop, but on phones that can
   * exceed the viewport height. Clamp the lift to ~60% of the viewport
   * height so the robot stays on-screen on small/short devices.
   */
  const reducedMotion = useReducedMotion();
  const [robotLift, setRobotLift] = useState(-440);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const compute = () => {
      const vh = window.innerHeight;
      /* Desktop: full 440 px lift. Mobile: clamp to 60% of viewport so
       * the robot never escapes the screen. */
      const lift = Math.min(440, Math.round(vh * 0.6));
      setRobotLift(-lift);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    /*
     * Two independent fixed-position siblings:
     *   1. The chat panel — anchored at bottom-right of the viewport,
     *      shown only when isOpen.
     *   2. The robot wrapper — also at bottom-right, but a <motion.div>
     *      that translates UP by ROBOT_LIFT when isOpen, so the robot
     *      visually "jumps" onto the chat window's top-right shoulder.
     *
     * Splitting them avoids the previous overlap (where the absolute-
     * positioned bubble would always cover the robot) and gives a
     * clean state-driven layout shift.
     */
    <>
      {/* ── 1. Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            /*
             * Comic speech-bubble pointing UP at the robot:
             *   - rounded-3xl on three corners → soft balloon
             *   - rounded-tr-none → sharp top-right corner is the tail,
             *     pointing up-right at the robot perched above
             *   - z-50 sits above page content; robot uses z-[55] to perch
             *     above this panel
             */
            className="pointer-events-auto fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl rounded-tr-none border sm:bottom-6 sm:right-6 sm:w-96"
            style={{
              background: "rgba(5, 8, 15, 0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(0, 217, 255, 0.18)",
              boxShadow: "0 0 80px rgba(0,217,255,0.07), 0 32px 80px rgba(0,0,0,0.65)",
            }}
          >

            {/* Header */}
            <div
              className="flex items-center gap-3 border-b border-[var(--color-bg-muted)] px-4 py-3"
              style={{ background: "linear-gradient(135deg, rgba(0,217,255,0.07), rgba(180,77,255,0.04))" }}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-cyan-neon)] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-cyan-neon)]" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Samet&apos;s AI Robot
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Gemini 2.5 Flash · 5 messages/min
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close chat"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex h-80 flex-col gap-2 overflow-y-auto p-4">
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
                      whileHover={{ borderColor: "rgba(0,217,255,0.4)", color: "var(--color-cyan-neon)" }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

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

              {isStreaming && (
                <div className="flex justify-start">
                  <div
                    style={{
                      background:  "rgba(180,77,255,0.07)",
                      border:      "1px solid rgba(180,77,255,0.15)",
                      borderRadius:"12px 12px 12px 2px",
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mt-1 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-[11px] text-red-200/90"
                >
                  {error.message.includes("429")
                    ? "🛑 Rate limit reached — please wait about a minute before sending another message."
                    : error.message.includes("502") || error.message.toLowerCase().includes("gemini")
                      ? "⚠️ The AI service is temporarily unavailable. Please try again shortly — or email Samet directly."
                      : "Something went wrong sending your message. Try again, or reach Samet at sametkrdg80@gmail.com."}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-[var(--color-bg-muted)] p-3">
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

      {/* ── 2. Robot wrapper ──
       *
       * Stays at bottom-right of the viewport; framer-motion animates `y`
       * based on isOpen, lifting the robot up by ROBOT_LIFT px so it
       * appears to perch on top of the chat panel's top-right corner
       * (where the sharp tail is). When closed, y=0 puts it back in the
       * corner.
       *
       * z-[55] is one layer above the chat panel (z-50) so the dance
       * peaks never get clipped by the bubble below.
       *
       * pointer-events: the wrapper itself stays "none" (so the greeting
       * bubble doesn't block scroll on the page area beside it); only the
       * inner button captures clicks.
       */}
      <motion.div
        className="pointer-events-none fixed bottom-4 right-4 z-[55] sm:bottom-6 sm:right-6"
        animate={{ y: isOpen ? robotLift : 0 }}
        /* Reduced-motion users get an instant transition (duration 0)
         * so the robot doesn't appear to fly across the screen. */
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 280, damping: 26 }
        }
      >
        <div className="relative">

          {/* Greeting bubble: floats above the robot when chat is closed.
              Tail points DOWN at the robot below → rounded-br-none. */}
          <AnimatePresence>
            {!isOpen && showGreeting && (
              <motion.button
                key="greeting-bubble"
                initial={{ opacity: 0, y: 8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1   }}
                exit={{    opacity: 0, y: 8, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                onClick={handleRobotClick}
                className="pointer-events-auto absolute bottom-[78%] right-[20%] max-w-[240px] rounded-3xl rounded-br-none border px-4 py-3 text-left text-[12px] font-medium text-[var(--color-text-primary)]"
                style={{
                  background:    "rgba(5, 8, 15, 0.97)",
                  borderColor:   "rgba(0, 217, 255, 0.3)",
                  boxShadow:     "0 0 28px rgba(0,217,255,0.18), 0 8px 28px rgba(0,0,0,0.5)",
                  backdropFilter:"blur(18px)",
                }}
              >
                {GREETING}
                <span
                  onClick={(e) => { e.stopPropagation(); dismissGreeting(); }}
                  className="ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  aria-label="Dismiss greeting"
                >
                  ✕
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* The robot itself — clickable, audio-reactive 3D */}
          <motion.button
            onClick={handleRobotClick}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
            className="pointer-events-auto relative h-44 w-44 overflow-visible bg-transparent sm:h-52 sm:w-52"
          >
            <Suspense fallback={null}>
              <RobotMiniScene />
            </Suspense>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
