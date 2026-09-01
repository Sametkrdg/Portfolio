# CLAUDE.md

Standing rules for this repository. Read this before touching any file.
The phased roadmap lives in **`PLAN.md`** — this file holds the rules that stay true after the roadmap is done.

---

## Prime directive

**Do not assume. Ask.**
If a requirement is ambiguous, a file is missing, or a decision is not written down in this file or `PLAN.md`, stop and ask Samet. A wrong guess costs more than a question. Items marked `[SOR]` in `PLAN.md` are unanswered — never implement past one.

---

## Project

Single-page bilingual portfolio for Samet Karadağ (backend / full-stack engineer, UI/UX-aware).
Next.js + Tailwind CSS v4 + TypeScript. One page, six sections, **seven swappable design themes**, Turkish and English.

Live site: sametkaradag.com

---

## Commands

```bash
npm run dev      # local development
npm run build    # must pass before any phase is considered done
npm run lint     # must pass before any phase is considered done
```

Verify actual script names in `package.json` before relying on them. There are no automated tests — `build` + `lint` plus Samet's manual browser check are the verification gate.

---

## Architecture invariants

These are non-negotiable. If a task seems to require breaking one, stop and ask.

1. **The shell is fixed.** The top theme bar, the left sidebar nav, the locale switch and the chat widget live once in `components/shell/`. Themes restyle them; themes never re-implement or relocate them.
2. **Themes own layout, never content.** A theme provides section components and CSS. Every string, number and link comes from `portfolio-context.json`. No hardcoded copy in any component.
3. **One content file.** `portfolio-context.json` is the single source of truth for site content *and* for the chatbot. Every text field is `{ "tr": "...", "en": "..." }`. Changing its schema risks breaking the chatbot — check the chatbot's reader before any structural edit.
4. **UI strings vs content.** `messages/tr.json` and `messages/en.json` hold interface chrome only (nav labels, button text, aria-labels). Content never goes there.
5. **The registry is the source of truth for themes.** `themes/registry.ts` defines the slugs, their order in the theme bar, and the default. Nothing else enumerates themes.
6. **Every theme fills the whole token set.** Shared CSS custom property names are documented in `globals.css`; each theme defines all of them under `[data-theme="<slug>"]`. A partially defined theme is a bug.
7. **Section order is fixed:** Hero → About → Skills → Experience → Projects → Contact. IDs: `#hero #about #skills #experience #projects #contact`.
8. **Themes load lazily.** Each theme's component set is imported with `next/dynamic`. A visitor downloads only the active theme.

---

## Directory map

```
app/[locale]/[[...theme]]/   route shell, layout, page — the layout renders <html lang data-theme>
app/globals.css              Tailwind v4 entry + the shared theme token contract
proxy.ts                     next-intl locale routing (Next 16 renamed middleware → proxy)
src/i18n/                    routing.ts, request.ts
src/components/shell/        ThemeBar, SideNav, LocaleSwitch, ChatWidget
src/lib/                     types.ts, content.ts, useTheme.ts, useScrollSpy.ts, themeScript.ts
src/themes/registry.ts       slugs, order, default, lazy loaders
src/themes/<slug>/           theme.css, index.ts, sections/*, shell/NavItem.tsx
src/themes/_source/<slug>/   design.dc.html + design.standalone.html — reference only
src/messages/                tr.json, en.json (UI chrome only)
src/data/portfolio-context.json   all site content, bilingual
public/cv/samet-karadag.pdf  the CV (English, one file for both locales)
```

Themes, in theme-bar order: `minimal` (**default**) · `space` (the current 3D design) · `editorial` · `blueprint` · `brutalism` · `maximalism` · `y2k`

Design-file mapping: Terminal → `maximalism` · Retro → `y2k` · Brutalist → `brutalism` · the unnumbered Portfolio file → `minimal`.

---

## Conventions

- **Language:** code, comments, commit messages and variable names in English. Explanations written *for Samet* in Turkish.
- **TypeScript everywhere.** Section components accept exactly `SectionProps { content, locale }` — do not widen this interface to pass theme-specific data; put that in the theme's own module.
- **CSS:** Tailwind utilities plus per-theme custom properties scoped under `[data-theme="<slug>"]`. No inline style objects for theming, no CSS-in-JS.
- **Naming:** theme slugs are lowercase, no spaces, and match their folder name exactly.
- **Dependencies:** do not add a package without asking. Prefer platform APIs (`IntersectionObserver`, CSS `scroll-behavior`) over libraries.
- **When a design contradicts the plan, the plan wins.** Colour, size and font may be adjusted in a design; the left sidebar, the top theme bar and the section order are identical in all seven themes.

---

## Hard rules

**Do not:**

- Add animation beyond smooth scroll and the active-nav emphasis. Motion is deliberately minimal. No animation libraries, no scroll-triggered reveals, no parallax. **One exception, granted explicitly:** the `space` theme keeps its 3D hero canvas and the audio toggle, loaded with `next/dynamic` so no other theme pays for three.js.
- Build the contact form from the designs. The designs include one; the decision is mailto + LinkedIn + GitHub + CV link, nothing else.
- Re-add the "Hire Me" button.
- Re-add the removed **Algorithms** section, its nav link, or its assets.
- Re-add animation to the chatbot. It stays as a plain launcher icon and panel, styled per theme.
- Hardcode Turkish or English text in a component.
- Change the shape of `portfolio-context.json` without verifying the chatbot still reads it.
- Update one locale without the other. TR and EN ship together.
- Let the sidebar shift the layout when the active item grows. Reserve the widest active state's width.
- Write content into the site from the CV without Samet approving the extraction first.

---

## i18n

next-intl, URL-based: `/tr` and `/en`, default locale **TR** (`/` → `/tr`). Both locales must render every section. Canonical origin: `https://sametkaradag.com`.
Keep `hreflang` alternates, per-locale metadata, `<html lang>` and the sitemap in sync whenever routes change. Switching locale preserves the current section and the selected theme.

---

## Theme behaviour

- **The theme lives in the URL**: `/tr` is the default theme, `/tr/y2k` is y2k. 7 themes × 2 locales = 14 statically generated pages, `data-theme` server-rendered, no flash and no client theme state.
- Default theme is `minimal` — the lightest, so a first visit to `/tr` is the fastest. `space` carries the 3D scene and is opted into explicitly.
- `localStorage` only *remembers* the last choice: a blocking `<head>` script redirects a bare `/tr` to the remembered theme before first paint.
- `/tr/minimal` is a 404 on purpose — the default theme has exactly one URL.
- Switching a theme preserves scroll position; the shell stays in place.
- The active-section emphasis in the sidebar is defined by each theme's own `NavItem` component — one theme may scale the type, another may draw a box or invert the colors.
- On mobile: the sidebar nav is hidden; the theme bar is pinned to the bottom of the screen, horizontally scrollable, respecting `env(safe-area-inset-bottom)`.

---

## Accessibility & performance

- Visible focus states on every interactive element; the sidebar is keyboard-navigable; the active item carries `aria-current`.
- Respect `prefers-reduced-motion: reduce` — smooth scroll becomes an instant jump.
- Text must stay readable on every theme. `y2k`, `brutalism` and `maximalism` are the risky ones: if a design's own colors fall below WCAG AA, report it to Samet rather than silently changing the design.
- Keep the page statically renderable where possible; no unnecessary client components.

---

## Adding a theme

1. Read the raw design in `themes/_source/<slug>/`.
2. Create `themes/<slug>/` with `theme.css`, `index.ts`, `sections/*`, `shell/NavItem.tsx`.
3. Bind every piece of text and data to `portfolio-context.json` — no leftover placeholder copy from the design file.
4. Define the complete shared token set under `[data-theme="<slug>"]`.
5. Register it in `themes/registry.ts`.
6. Check both locales, desktop and mobile. Run `npm run build` and `npm run lint`.

---

## Content workflow

The CV PDF in the repo is the source for About, Skills, Experience and Projects.
Extract → produce both TR and EN fields → **show the extraction to Samet and wait for approval** → write to `portfolio-context.json`. Unverified data never reaches the site. The CV also ships as a download; keep the link working in both locales.

---

## Git

- Single feature branch: `feat/multi-theme-portfolio`.
- One commit per completed phase or per theme; English, imperative mood.
- Do not commit to `main` directly. Do not push unless asked.

---

## Before you say you are done

- `npm run build` clean.
- `npm run lint` clean.
- Both locales render every section.
- The theme you touched works on desktop and mobile.
- Anything you could not verify is stated plainly, not glossed over.