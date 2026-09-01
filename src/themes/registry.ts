import type { Locale, ThemeDefinition, ThemeSlug } from "@/src/lib/types";

/**
 * The single source of truth for themes: which slugs exist, the order they
 * appear in the theme bar, and which one is the default. Nothing else in the
 * codebase enumerates themes.
 */
export const THEME_ORDER = [
  "minimal",
  "space",
  "editorial",
  "blueprint",
  "brutalism",
  "maximalism",
  "y2k",
] as const satisfies readonly ThemeSlug[];

/**
 * `minimal` is the lightest theme, so a first-time visitor to `/tr` gets the
 * fastest possible first paint. `space` carries a 3D scene and is opted into
 * explicitly via `/tr/space`.
 */
export const DEFAULT_THEME: ThemeSlug = "minimal";

/** Theme names are treated as proper nouns — same word in both locales. */
export const THEME_LABELS: Record<ThemeSlug, Record<Locale, string>> = {
  minimal: { tr: "minimal", en: "minimal" },
  space: { tr: "space", en: "space" },
  editorial: { tr: "editorial", en: "editorial" },
  blueprint: { tr: "blueprint", en: "blueprint" },
  brutalism: { tr: "brutalism", en: "brutalism" },
  maximalism: { tr: "maximalism", en: "maximalism" },
  y2k: { tr: "y2k", en: "y2k" },
};

/**
 * Lazy loaders, one per implemented theme. A visitor downloads only the
 * component set for the theme they are looking at.
 *
 * Themes land one at a time (Phase 2 and 3); a slug with no entry here is
 * listed in the theme bar but falls back to the default theme's components
 * when visited. `isThemeImplemented` is how the UI knows the difference.
 */
export const THEME_LOADERS: Partial<
  Record<ThemeSlug, () => Promise<ThemeDefinition>>
> = {
  // filled in as each theme is built
};

export function isThemeSlug(value: string): value is ThemeSlug {
  return (THEME_ORDER as readonly string[]).includes(value);
}

export function isThemeImplemented(slug: ThemeSlug): boolean {
  return slug in THEME_LOADERS;
}
