# AGENTS.md - Samet Karadağ Portfolio Project Context

## 🎯 Role
You are an Expert Full-Stack Developer & Creative Technologist. Your goal is to build Samet's MVP portfolio with high performance and "wow" factor animations.

## 🛠 Tech Stack (Strict)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Dark Mode/Neon theme)[cite: 1]
- **3D Engine:** React Three Fiber + @react-three/drei[cite: 2]
- **Animations:** Framer Motion (UI) & GSAP (Scroll/Creative)[cite: 2]
- **AI:** Vercel AI SDK + Google Gemini 2.5 Flash[cite: 2]
- **Backend/Logic:** Vercel Edge Functions & Vercel KV[cite: 2]
- **Assets:** Cloudflare R2 URLs (No large binaries in Git)[cite: 1, 2]

## 📜 Technical Commandments
1. **Performance:** 3D animations MUST be ref-based. Never update React state 60 times per second. Use `useFrame` for all 3D mutations[cite: 2].
2. **SEO & LCP:** No 3D in the initial LCP viewport. Use lazy loading (`next/dynamic`) for all Canvas components[cite: 2].
3. **Audio-Reactive:** Use Web Audio API for frequency analysis. Map 'bass' to scale and 'mid' to rotation by default[cite: 2].
4. **AI Constraints:** Use Edge Runtime for `/api/chat`. Reference `portfolio-context.json` for all personality data[cite: 2].

## 🤖 Claude Code Specific Instructions
- Use `ls`, `cat`, and `grep` to understand the existing codebase before making changes.
- When creating 3D scenes, always check for memory leaks (dispose of geometries/materials).
- If you need to install a package, use `npm install` and explain why.

---

## 🗺 Build Roadmap

### ✅ Phase 1: Foundation & Dev Environment — **COMPLETED** (2026-05-05)
- [x] Tailwind v4 dark/neon theme in `app/globals.css` (Deep Slate bg + Cyan/Purple neons, `@theme` directive)
- [x] `src/data/portfolio-context.json` — AI chatbot persona & resume skeleton created
- [x] `next.config.ts` — webpack `splitChunks` for `vendor-3d`, `vendor-animation`, `vendor-ai` bundles + `optimizePackageImports`
- [x] Core deps installed: `framer-motion`, `gsap`, `zustand`, `ai`, `@ai-sdk/google`

### ⏭ Phase 2: Core Layout & Navigation — **NEXT**
- [ ] Root layout update: add `dark` class to `<html>`, Inter font, metadata
- [ ] Navbar component with scroll-aware glass effect (Framer Motion)
- [ ] Footer component
- [ ] Page transition wrapper

### 🔲 Phase 3: Hero Section (3D + Animations)
- [ ] Lazy-loaded R3F Canvas scene (particle field or abstract mesh)
- [ ] GSAP scroll-triggered headline entrance
- [ ] Framer Motion CTA button with neon hover

### 🔲 Phase 4: About / Skills Section
- [ ] Skills grid with animated progress/badges
- [ ] Framer Motion scroll-reveal cards

### 🔲 Phase 5: Projects Showcase
- [ ] Project cards reading from `portfolio-context.json`
- [ ] 3D card-flip or tilt effect

### 🔲 Phase 6: AI Chatbot
- [ ] `/api/chat` edge function (Gemini 2.5 Flash + portfolio-context.json system prompt)
- [ ] Chat UI component with streaming responses

### 🔲 Phase 7: Contact & Final Polish
- [ ] Contact form (Vercel KV rate-limiting)
- [ ] Performance audit (LCP, CLS, bundle sizes)
- [ ] SEO metadata & Open Graph