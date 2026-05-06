"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { label: "About",      href: "#about"      },
  { label: "Skills",     href: "#skills"     },
  { label: "Projects",   href: "#projects"   },
  { label: "Algorithms", href: "#algorithms" },
  { label: "Contact",    href: "#contact"    },
] as const;

/* ─── Single nav link with animated neon underline ─── */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative py-1 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-cyan-neon)]"
    >
      {label}
      {/* Neon underline slides in from left on hover */}
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-[var(--color-cyan-neon)]"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
    </Link>
  );
}

/* ─── Main Navbar ─── */
export default function Navbar() {
  const { scrollY } = useScroll();

  /*
   * All transitions are driven by MotionValues — no useState, no re-renders.
   * At scroll = 0   → fully transparent, no blur
   * At scroll = 80px → dark glass + 16px blur + faint cyan border
   */
  const bgOpacity     = useTransform(scrollY, [0, 80], [0,    0.85]);
  const blurPx        = useTransform(scrollY, [0, 80], [0,    16  ]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0,    0.12]);

  const backgroundColor  = useMotionTemplate`rgba(5, 8, 15, ${bgOpacity})`;
  const backdropFilter   = useMotionTemplate`blur(${blurPx}px) saturate(180%)`;
  const borderBottomColor = useMotionTemplate`rgba(0, 217, 255, ${borderOpacity})`;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        backgroundColor,
        backdropFilter,
        /* eslint-disable @typescript-eslint/no-explicit-any */
        WebkitBackdropFilter: backdropFilter as any,
        borderBottomColor,
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[var(--color-cyan-neon)]"
          style={{ textShadow: "0 0 10px rgba(0, 217, 255, 0.55)" }}
        >
          SK.
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          {/* Hire Me — neon cyan ghost button */}
          <motion.a
            href="#contact"
            className="rounded-full border border-[var(--color-cyan-neon)] px-5 py-1.5 text-sm font-semibold text-[var(--color-cyan-neon)]"
            whileHover={{
              backgroundColor: "rgba(0, 217, 255, 0.08)",
              boxShadow: "0 0 18px rgba(0, 217, 255, 0.35)",
            }}
            transition={{ duration: 0.2 }}
          >
            Hire Me
          </motion.a>
        </div>

        {/* ── Mobile hamburger (visual placeholder — menu wired in Phase 3) ── */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Open navigation menu"
        >
          <span className="block h-px w-6 bg-[var(--color-text-secondary)] transition-colors" />
          <span className="block h-px w-6 bg-[var(--color-text-secondary)] transition-colors" />
          <span className="block h-px w-4 bg-[var(--color-text-secondary)] transition-colors" />
        </button>
      </nav>
    </motion.header>
  );
}
