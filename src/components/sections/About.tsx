"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATS = [
  {
    value: "40%",
    label: "Performance uplift via Redis caching & Hangfire at Tersan",
    accent: "cyan" as const,
  },
  {
    value: "5+",
    label: "Production projects successfully shipped",
    accent: "purple" as const,
  },
  {
    value: "B.Sc.",
    label: "Computer Engineering — Yalova University",
    accent: "cyan" as const,
  },
  {
    value: "2+",
    label: "Years writing production-grade .NET systems",
    accent: "purple" as const,
  },
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);

  /*
   * All GSAP work lives inside useGSAP — it scopes selectors to containerRef
   * and calls context.revert() on unmount, eliminating scroll ghost artifacts.
   */
  useGSAP(
    () => {
      const ease = "power3.out";

      // Label + heading slide up together
      gsap.from([".about-label", ".about-heading"], {
        y: 52,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease,
        scrollTrigger: {
          trigger: ".about-heading",
          start: "top 86%",
        },
      });

      // Bio paragraphs cascade in one by one
      gsap.from(".about-paragraph", {
        y: 38,
        opacity: 0,
        duration: 0.75,
        stagger: 0.18,
        ease,
        scrollTrigger: {
          trigger: ".about-paragraphs",
          start: "top 82%",
        },
      });

      // Divider line draws across
      gsap.from(".about-divider", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-divider",
          start: "top 88%",
        },
      });

      // Stat cards pop in with back.out spring feel
      gsap.from(".about-stat", {
        y: 32,
        opacity: 0,
        scale: 0.9,
        duration: 0.65,
        stagger: 0.12,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".about-stats",
          start: "top 82%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative border-t border-[var(--color-bg-muted)] py-28 px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-20 lg:grid-cols-2 lg:items-start">

        {/* ── Left: narrative ── */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="about-label text-[11px] font-semibold tracking-[0.35em] uppercase text-[var(--color-cyan-neon)]">
              About Me
            </span>

            <h2 className="about-heading text-4xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              Bridging{" "}
              <span
                className="text-[var(--color-cyan-neon)]"
                style={{ textShadow: "0 0 28px rgba(0,217,255,0.35)" }}
              >
                Backend Logic
              </span>{" "}
              with{" "}
              <span
                className="text-[var(--color-purple-neon)]"
                style={{ textShadow: "0 0 28px rgba(180,77,255,0.35)" }}
              >
                Creative Vision
              </span>
            </h2>
          </div>

          {/* Animated divider */}
          <div
            className="about-divider h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-cyan-neon), var(--color-purple-neon), transparent)",
            }}
          />

          <div className="about-paragraphs flex flex-col gap-5">
            <p className="about-paragraph text-base leading-relaxed text-[var(--color-text-secondary)]">
              I&apos;m a backend-first developer with a deep passion for scalable system design.
              I cut my teeth as a{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">
                Backend Developer intern at Tersan
              </span>
              , where I engineered .NET 9 Web APIs using Layered Architecture and Clean
              Code principles — reducing system latency by{" "}
              <span className="font-semibold text-[var(--color-cyan-neon)]">40%</span>{" "}
              through Redis caching and Hangfire background task management.
            </p>

            <p className="about-paragraph text-base leading-relaxed text-[var(--color-text-secondary)]">
              On the frontend, I bring that same engineering discipline to{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">React 19</span>{" "}
              and{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">Next.js</span> —
              crafting UIs that are not just beautiful, but precisely architected.
              From Swiss-style minimalism to immersive 3D experiences, I believe
              the bridge between server logic and client vision is where great
              products are born.
            </p>

            <p className="about-paragraph text-base leading-relaxed text-[var(--color-text-secondary)]">
              Currently pursuing a B.Sc. in Computer Engineering at{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">
                Yalova University
              </span>{" "}
              and open to full-time or freelance roles where engineering depth
              meets creative ambition.
            </p>
          </div>

          {/* ── Hobbies ── */}
          <div className="about-hobbies flex flex-col gap-3 pt-2">
            <span className="text-[11px] font-semibold tracking-[0.35em] uppercase text-[var(--color-purple-neon)]">
              Beyond Code
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Electronic Music Production",
                "Reading",
                "Drawing",
                "Fitness",
                "Marketing",
                "Graphic Design",
                "Social Media Advertising",
              ].map((hobby) => (
                <span
                  key={hobby}
                  className="rounded-full border border-[var(--color-bg-muted)] px-3 py-1 text-[11px] text-[var(--color-text-secondary)]"
                  style={{ background: "rgba(13,17,23,0.6)" }}
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          {/* Contact shortcut */}
          <a
            href="mailto:sametkrdg80@gmail.com"
            className="self-start text-sm font-semibold text-[var(--color-cyan-neon)] underline-offset-4 hover:underline"
            style={{ textShadow: "0 0 10px rgba(0,217,255,0.3)" }}
          >
            sametkrdg80@gmail.com →
          </a>
        </div>

        {/* ── Right: stat cards ── */}
        <div className="about-stats grid grid-cols-2 gap-4 lg:pt-2">
          {STATS.map((stat) => {
            const isCyan = stat.accent === "cyan";
            const rgb = isCyan ? "rgba(0, 217, 255" : "rgba(180, 77, 255";
            const neonVar = isCyan
              ? "var(--color-cyan-neon)"
              : "var(--color-purple-neon)";

            return (
              <div
                key={stat.value}
                className="about-stat flex flex-col gap-2 rounded-2xl border border-[var(--color-bg-muted)] p-6"
                style={{
                  background: "rgba(13, 17, 23, 0.7)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                {/* Top accent */}
                <div
                  className="mb-1 h-[2px] w-8 rounded-full"
                  style={{ background: neonVar, boxShadow: `0 0 8px ${rgb}, 0.5)` }}
                />

                <p
                  className="text-4xl font-black leading-none"
                  style={{ color: neonVar, textShadow: `0 0 20px ${rgb}, 0.3)` }}
                >
                  {stat.value}
                </p>

                <p className="text-[13px] leading-snug text-[var(--color-text-muted)]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
