import type { ComponentType, ReactNode } from "react";

/* ── Primitives ─────────────────────────────────────────────────────────── */

export type Locale = "tr" | "en";

export type ThemeSlug =
  | "space"
  | "minimal"
  | "brutalism"
  | "maximalism"
  | "y2k"
  | "editorial"
  | "blueprint";

export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

/** Every content string is bilingual. TR and EN ship together, always. */
export type Localized = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

/* ── Content shape (mirrors src/data/portfolio-context.json) ─────────────── */

export interface ContentMeta {
  name: string;
  role: Localized;
  email: string;
  location: Localized;
  availability: Localized;
  summary: Localized;
  education: Localized;
  languages: Localized;
  links: { github: string; linkedin: string; site: string };
  /** Single English PDF, served for both locales. */
  cv: string;
}

export interface HeroContent {
  eyebrow: Localized;
  headline: Localized;
  body: Localized;
}

export interface AboutStat {
  value: Localized;
  label: Localized;
}

export interface AboutContent {
  paragraphs: LocalizedList;
  stats: AboutStat[];
}

export interface SkillGroup {
  group: Localized;
  /**
   * Bilingual: pure product names ("Docker", ".NET 9") repeat identically in
   * both lists, but anything with words in it ("Layered Architecture") has a
   * real Turkish form. A single shared array would print Turkish on the
   * English page.
   */
  items: LocalizedList;
}

export interface ExperienceEntry {
  company: string;
  role: Localized;
  period: Localized;
  duration: Localized;
  bullets: LocalizedList;
  stack: string[];
}

/** Label lives in messages/*.json under `status.*` — this is the key only. */
export type ProjectStatus = "live" | "in-progress" | "completed";

export interface ProjectLink {
  /** `label` is chrome ("Live" / "Canlı"), resolved from messages. */
  kind: "live" | "code";
  href: string;
}

export interface ProjectEntry {
  id: string;
  /** Proper nouns repeat in both locales; descriptive names are translated. */
  name: Localized;
  status: ProjectStatus;
  problem: Localized;
  architecture: Localized;
  metrics: LocalizedList;
  stack: string[];
  links: ProjectLink[];
}

export interface ContactContent {
  headline: Localized;
  note: Localized;
}

export interface ChatbotContent {
  persona: Localized;
  suggestions: LocalizedList;
  do: string[];
  dont: string[];
}

export interface PortfolioContent {
  meta: ContentMeta;
  hero: HeroContent;
  about: AboutContent;
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  contact: ContactContent;
  chatbot: ChatbotContent;
}

/* ── Theme contract ─────────────────────────────────────────────────────── */

/**
 * The only props a section component ever receives. A theme presents content;
 * it never sources, filters or rewrites it.
 */
export interface SectionProps {
  content: PortfolioContent;
  locale: Locale;
}

/**
 * The active-section emphasis belongs to the theme: one scales the type,
 * another draws a box, another inverts the colours. The shell only says
 * *which* item is active.
 */
export interface NavItemProps {
  id: SectionId;
  label: string;
  href: string;
  /** 0-based position in the sidebar; themes that number their nav use it. */
  index: number;
  isActive: boolean;
  onSelect: (id: SectionId) => void;
}

export interface ThemeBarItemProps {
  slug: ThemeSlug;
  label: string;
  href: string;
  isActive: boolean;
}

/**
 * Sections are server components by default — several are `async`, which a
 * plain `ComponentType` cannot express.
 */
export type SectionComponent = (
  props: SectionProps
) => ReactNode | Promise<ReactNode>;

export interface ThemeDefinition {
  slug: ThemeSlug;
  sections: Record<SectionId, SectionComponent>;
  shell: {
    NavItem: ComponentType<NavItemProps>;
    ThemeBarItem?: ComponentType<ThemeBarItemProps>;
  };
}

/* ── Ordered section list — fixed for every theme and locale ─────────────── */

export const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
] as const satisfies readonly SectionId[];

/** Hero is a section but never appears in the sidebar. */
export const NAV_SECTION_IDS = [
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
] as const satisfies readonly SectionId[];
