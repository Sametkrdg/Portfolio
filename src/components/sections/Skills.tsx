"use client";

import { motion, useReducedMotion } from "framer-motion";

type Accent = "cyan" | "purple";

type Skill = {
  name: string;
  category: string;
  accent: Accent;
};

/* Sourced from portfolio-context.json — curated for visual impact */
const SKILLS: Skill[] = [
  // Backend
  { name: ".NET 9",            category: "Backend",  accent: "cyan"   },
  { name: "EF Core",           category: "Backend",  accent: "cyan"   },
  { name: "Clean Architecture",category: "Backend",  accent: "cyan"   },
  { name: "Hangfire",          category: "Backend",  accent: "cyan"   },
  { name: "REST APIs",         category: "Backend",  accent: "cyan"   },
  { name: "JWT Auth",          category: "Backend",  accent: "cyan"   },
  // Frontend
  { name: "React 19",          category: "Frontend", accent: "purple" },
  { name: "Next.js 16",        category: "Frontend", accent: "purple" },
  { name: "TypeScript",        category: "Frontend", accent: "purple" },
  { name: "Tailwind CSS v4",   category: "Frontend", accent: "purple" },
  { name: "Three.js / R3F",    category: "Frontend", accent: "purple" },
  { name: "Framer Motion",     category: "Frontend", accent: "purple" },
  // Database
  { name: "PostgreSQL",        category: "Database", accent: "cyan"   },
  { name: "Redis",             category: "Database", accent: "cyan"   },
  { name: "Firebase",          category: "Database", accent: "cyan"   },
  // DevOps / Cloud
  { name: "Docker",            category: "DevOps",   accent: "purple" },
  { name: "AWS S3",            category: "DevOps",   accent: "purple" },
  { name: "Azure Key Vault",   category: "DevOps",   accent: "purple" },
  { name: "GitHub Actions",    category: "DevOps",   accent: "purple" },
  // QA
  { name: "xUnit",             category: "Testing",  accent: "cyan"   },
  { name: "Integration Tests", category: "Testing",  accent: "cyan"   },
];

/* ─── Framer Motion variants ─── */

/*
 * Full animation: staggered cascade with y-slide + scale.
 * Reduced-motion alternative: instant appearance, opacity only — no spatial movement.
 * useReducedMotion() reads the OS/browser `prefers-reduced-motion` media query
 * and returns true when the user has requested minimised motion.
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};
const containerVariantsReduced = {
  hidden: {},
  visible: {},          // no stagger — all cards appear simultaneously
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};
const cardVariantsReduced = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/* ─── Individual skill card ─── */
function SkillCard({ name, category, accent }: Skill) {
  const prefersReduced = useReducedMotion();
  const isCyan  = accent === "cyan";
  const rgb     = isCyan ? "rgba(0, 217, 255" : "rgba(180, 77, 255";
  const neonVar = isCyan ? "var(--color-cyan-neon)" : "var(--color-purple-neon)";

  return (
    <motion.div
      variants={prefersReduced ? cardVariantsReduced : cardVariants}
      /* whileHover scale is vestibular-triggering — suppress it for reduced-motion users */
      whileHover={prefersReduced ? undefined : {
        scale: 1.05,
        boxShadow: `0 0 26px ${rgb}, 0.28)`,
        borderColor: `${rgb}, 0.5)`,
        transition: { type: "spring", stiffness: 380, damping: 22 },
      }}
      className="relative flex flex-col gap-3 overflow-hidden rounded-xl border p-5"
      style={{
        background: "rgba(13, 17, 23, 0.65)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        /* Concrete initial color so Framer Motion can animate borderColor smoothly */
        borderColor: "rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Top neon accent line — fades in from centre */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${rgb}, 0.65), transparent)`,
        }}
      />

      {/* Category badge */}
      <span
        className="self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
        style={{
          color: neonVar,
          background: `${rgb}, 0.08)`,
          border: `1px solid ${rgb}, 0.2)`,
        }}
      >
        {category}
      </span>

      {/* Skill name */}
      <p className="text-[15px] font-semibold leading-snug text-[var(--color-text-primary)]">
        {name}
      </p>
    </motion.div>
  );
}

/* ─── Section ─── */
export default function Skills() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="skills"
      className="border-t border-[var(--color-bg-muted)] py-28 px-6"
    >
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="mb-3 block text-[11px] font-semibold tracking-[0.35em] uppercase text-[var(--color-cyan-neon)]">
            Tech Stack
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Skills &amp;{" "}
            <span
              className="text-[var(--color-purple-neon)]"
              style={{ textShadow: "0 0 32px rgba(180,77,255,0.35)" }}
            >
              Expertise
            </span>
          </h2>
        </div>

        {/*
         * whileInView triggers once the container crosses the viewport threshold.
         * viewport.once = true means the animation fires only on first entry —
         * no re-playing when the user scrolls back up.
         * margin="-80px" delays the trigger slightly so cards animate in
         * *after* the user has clearly seen the section, not right at the edge.
         */}
        <motion.div
          variants={prefersReduced ? containerVariantsReduced : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {SKILLS.map((skill) => (
            <SkillCard key={skill.name} {...skill} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
