"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAudioStore } from "@/src/store/audioStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Lazy-loaded with ssr:false — Three.js / WebGL must never run on the server.
 * Wrapped in <Suspense> for proper React 19 streaming hydration support.
 */
const HeroCanvas = dynamic(
  () => import("@/src/components/canvas/HeroCanvas"),
  { ssr: false }
);

function CanvasSkeleton() {
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-base)]" aria-hidden />
  );
}

/* Waveform icon for the audio button */
function WaveIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="2"  y1="12" x2="2"  y2="12" />
      <line x1="6"  y1="8"  x2="6"  y2="16" />
      <line x1="10" y1="4"  x2="10" y2="20" />
      <line x1="14" y1="8"  x2="14" y2="16" />
      <line x1="18" y1="10" x2="18" y2="14" />
      <line x1="22" y1="12" x2="22" y2="12" />
      {active && (
        <style>{`
          @keyframes wave {
            0%,100% { transform: scaleY(1); transform-origin: center; }
            50% { transform: scaleY(1.8); transform-origin: center; }
          }
          svg line { animation: wave 0.8s ease-in-out infinite; }
          svg line:nth-child(1) { animation-delay: 0s; }
          svg line:nth-child(2) { animation-delay: 0.1s; }
          svg line:nth-child(3) { animation-delay: 0.2s; }
          svg line:nth-child(4) { animation-delay: 0.1s; }
          svg line:nth-child(5) { animation-delay: 0s; }
          svg line:nth-child(6) { animation-delay: 0.3s; }
        `}</style>
      )}
    </svg>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const isActive = useAudioStore((s) => s.isActive);
  const start    = useAudioStore((s) => s.start);

  useGSAP(
    () => {
      /*
       * gsap.matchMedia() evaluates CSS media queries and runs the matching
       * callback. GSAP automatically reverts animations from the non-matching
       * context when conditions change (e.g. OS setting toggled at runtime).
       *
       * prefers-reduced-motion: no-preference → full staggered entrance
       * prefers-reduced-motion: reduce        → single instant fade-in, no y movement
       */
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-eyebrow", { y: 28, opacity: 0, duration: 0.7 })
          .from(".hero-name",    { y: 64, opacity: 0, duration: 0.95 }, "-=0.4")
          .from(".hero-role",    { y: 40, opacity: 0, duration: 0.8  }, "-=0.55")
          .from(".hero-bio",     { y: 28, opacity: 0, duration: 0.7  }, "-=0.45")
          .from(".hero-ctas",    { y: 20, opacity: 0, duration: 0.6  }, "-=0.35");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        /* Fade everything in together — no spatial movement that could cause vestibular issues */
        gsap.from(
          [".hero-eyebrow", ".hero-name", ".hero-role", ".hero-bio", ".hero-ctas"],
          { opacity: 0, duration: 0.4, stagger: 0 }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* ── 3D canvas: absolute background, pointer-events off ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Suspense fallback={<CanvasSkeleton />}>
          <HeroCanvas />
        </Suspense>
      </div>

      {/* Radial vignette so text stays readable over the star field */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, transparent 0%, var(--color-bg-base) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-[2] flex max-w-5xl flex-col items-center gap-6">

        {/* Eyebrow */}
        <p
          className="hero-eyebrow text-[11px] font-semibold tracking-[0.35em] uppercase text-[var(--color-cyan-neon)]"
          style={{ textShadow: "0 0 14px rgba(0,217,255,0.5)" }}
        >
          Available for opportunities
        </p>

        {/* Headline */}
        <h1 className="hero-name text-6xl font-black leading-[0.95] tracking-tight text-[var(--color-text-primary)] sm:text-7xl lg:text-8xl xl:text-9xl">
          Samet{" "}
          <span
            className="text-[var(--color-cyan-neon)]"
            style={{ textShadow: "0 0 52px rgba(0,217,255,0.42)" }}
          >
            Karadağ
          </span>
        </h1>

        {/* Role */}
        <p className="hero-role text-xl font-medium text-[var(--color-text-secondary)] sm:text-2xl">
          Backend Developer &amp;{" "}
          <span className="text-[var(--color-purple-neon)]">Full-Stack Engineer</span>
        </p>

        {/* Bio */}
        <p className="hero-bio max-w-xl text-base leading-relaxed text-[var(--color-text-muted)]">
          Architecting high-scale systems with{" "}
          <span className="text-[var(--color-text-secondary)]">.NET 9</span>,{" "}
          <span className="text-[var(--color-text-secondary)]">Clean Architecture</span>, and{" "}
          <span className="text-[var(--color-text-secondary)]">React 19</span> —
          bridging complex backend logic with precision-driven UI.
        </p>

        {/* ── CTAs ── */}
        <div className="hero-ctas flex flex-wrap items-center justify-center gap-4 pt-2">

          {/* Primary — cyan fill */}
          <motion.a
            href="#projects"
            className="rounded-full bg-[var(--color-cyan-neon)] px-8 py-3 text-sm font-bold tracking-wide text-[var(--color-bg-base)]"
            whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(0,217,255,0.55)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            View Projects
          </motion.a>

          {/* Secondary — electric purple ghost */}
          <motion.a
            href="/001-Samet-Karadag.pdf"
            download
            className="rounded-full border border-[var(--color-purple-neon)] px-8 py-3 text-sm font-bold tracking-wide text-[var(--color-purple-neon)]"
            whileHover={{
              scale: 1.06,
              backgroundColor: "rgba(180,77,255,0.08)",
              boxShadow: "0 0 30px rgba(180,77,255,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Download CV
          </motion.a>

          {/* Audio experience toggle */}
          <AnimatePresence mode="wait">
            <motion.button
              key={isActive ? "stop" : "play"}
              onClick={start}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold tracking-wide transition-colors"
              style={{
                borderColor: isActive ? "rgba(0,217,255,0.5)" : "rgba(255,255,255,0.12)",
                color: isActive ? "var(--color-cyan-neon)" : "var(--color-text-muted)",
                background: isActive ? "rgba(0,217,255,0.06)" : "transparent",
              }}
              aria-label={isActive ? "Stop audio experience" : "Play audio experience"}
            >
              <WaveIcon active={isActive} />
              {isActive ? "Stop Experience" : "Play Experience"}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        <span className="text-[9px] tracking-[0.28em] text-[var(--color-text-muted)] uppercase">
          Scroll
        </span>
        <div className="h-7 w-px bg-gradient-to-b from-[var(--color-text-muted)] to-transparent" />
      </motion.div>
    </section>
  );
}
