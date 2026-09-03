# AGENTS.md

The rules for working in this repository live in **`CLAUDE.md`**. Read that
first. `PLAN.md` records how the current architecture was arrived at and what
was decided along the way.

---

This file used to carry the technical brief for the original build — a
3D, animation-forward MVP. That brief was reversed by the multi-theme rewrite,
and following it now would actively break the codebase:

| The old brief said | What is true now |
|---|---|
| Framer Motion (UI) and GSAP (scroll) | Both removed from `package.json`; motion is smooth scroll and the active-nav emphasis, nothing else |
| "Wow factor" animations | Deliberately minimal motion, `prefers-reduced-motion` honoured |
| Vercel KV | Upstash Redis |
| Tailwind dark/neon theme | Seven themes, each owning its own palette under `:root[data-theme="<slug>"]` |

Two things from it are still true and still matter, both in the `space` theme,
the only place three.js survives:

- **3D mutation is ref-based.** Never set React state inside `useFrame`.
- **No 3D in the initial server render.** The canvas is behind
  `next/dynamic` with `ssr: false`, so it never reaches the server and never
  reaches the other six themes.
