"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { content } from "@/src/lib/content";
import type { Locale, ProjectEntry } from "@/src/lib/types";

/* ─── Entrance variants ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 44, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/* ─── Status colours (the label itself comes from messages/*.json) ─── */
const STATUS_COLOR = {
  "live":        { rgb: "rgba(0, 217, 255",  neon: "var(--color-cyan-neon)"   },
  "in-progress": { rgb: "rgba(180, 77, 255", neon: "var(--color-purple-neon)" },
  "completed":   { rgb: "rgba(0, 217, 255",  neon: "var(--color-cyan-neon)"   },
} as const;

/* ─── Project card with 3D tilt + mouse-tracking spotlight ─── */
function ProjectCard({ project, locale }: { project: ProjectEntry; locale: Locale }) {
  const tStatus = useTranslations("status");
  const tLink = useTranslations("projectLink");
  const cardRef = useRef<HTMLDivElement>(null);

  /*
   * Raw mouse-position motion values in [-0.5, 0.5] normalized range.
   * Wrapped in useSpring so the tilt physically glides back to 0 on mouse-leave
   * without needing any requestAnimationFrame loop in React state.
   */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 260, damping: 28 });
  const smoothY = useSpring(rawY, { stiffness: 260, damping: 28 });

  /* Map smooth position → CSS rotate values (max ±8°) */
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  /* Map smooth position → spotlight position (0–100%) */
  const spotX = useTransform(smoothX, [-0.5, 0.5], [0, 100]);
  const spotY = useTransform(smoothY, [-0.5, 0.5], [0, 100]);

  const status = STATUS_COLOR[project.status];

  /*
   * Reactive gradient string — recomputed by Framer Motion on every frame
   * when the mouse moves. Never triggers a React render.
   */
  const spotlight = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, ${status.rgb}, 0.12) 0%, transparent 62%)`;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const live = project.links.find((l) => l.kind === "live");
  const code = project.links.find((l) => l.kind === "code");

  return (
    /*
     * Outer div owns the stagger variant — no visual properties here.
     * perspective set here so the inner div's rotateX/Y renders in 3D space.
     */
    <motion.div variants={cardVariants} style={{ perspective: "1000px" }}>

      {/*
       * Inner div owns the tilt + hover glow.
       * rotateX/Y come from MotionValues (spring-driven) — independent of the
       * whileHover spring, so both run simultaneously without fighting.
       * borderColor initialised as a concrete rgba so Framer Motion can
       * interpolate it smoothly on hover (can't tween from a CSS variable).
       */}
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
          borderColor: "rgba(255, 255, 255, 0.07)",
          background: "rgba(13, 17, 23, 0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: `0 0 44px ${status.rgb}, 0.18), 0 24px 64px rgba(0,0,0,0.45)`,
          borderColor: `${status.rgb}, 0.45)`,
          transition: { type: "spring", stiffness: 300, damping: 28 },
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative flex h-full min-h-[380px] cursor-default flex-col overflow-hidden rounded-2xl border p-8"
      >

        {/* Mouse-tracking spotlight — pointer-events off so it doesn't block hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: spotlight }}
        />

        {/* Top accent line in status colour */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${status.rgb}, 0.7), transparent)`,
          }}
        />

        {/* Content — sits above the spotlight layer */}
        <div className="relative z-10 flex flex-1 flex-col gap-5">

          {/* Row: status badge + year */}
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
              style={{
                color: status.neon,
                background: `${status.rgb}, 0.09)`,
                border: `1px solid ${status.rgb}, 0.22)`,
              }}
            >
              {tStatus(project.status)}
            </span>

            {(live || code) && (
              <div className="flex items-center gap-3">
                {live && (
                  <a
                    href={live.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-cyan-neon)]"
                  >
                    {tLink("live")} ↗
                  </a>
                )}
                {code && (
                  <a
                    href={code.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-purple-neon)]"
                  >
                    {tLink("code")} ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-2xl font-black leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl"
            style={{ textShadow: `0 0 32px ${status.rgb}, 0.18)` }}
          >
            {project.name}
          </h3>

          {/* Description */}
          <p className="flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {project.problem[locale]}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.stack.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--color-text-muted)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Section ─── */
export default function Projects({ locale }: { locale: Locale }) {
  return (
    <section
      id="projects"
      className="border-t border-[var(--color-bg-muted)] py-28 px-6"
    >
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="mb-3 block text-[11px] font-semibold tracking-[0.35em] uppercase text-[var(--color-cyan-neon)]">
            Work
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Selected{" "}
            <span
              className="text-[var(--color-purple-neon)]"
              style={{ textShadow: "0 0 32px rgba(180,77,255,0.35)" }}
            >
              Projects
            </span>
          </h2>
        </div>

        {/*
         * Container fires once when it enters the viewport.
         * margin="-80px" ensures cards start animating before the section
         * edge reaches the viewport bottom — not right at the seam.
         */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {content.projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
