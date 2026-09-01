import raw from "@/src/data/portfolio-context.json";
import type { Locale, Localized, LocalizedList, PortfolioContent } from "./types";

/*
 * The JSON is bundled at build time and validated against PortfolioContent
 * here — a shape drift breaks the build rather than a page at runtime.
 */
export const content = raw as PortfolioContent;

/** Pick one locale out of a bilingual field. */
export function t(field: Localized, locale: Locale): string {
  return field[locale];
}

/** Pick one locale out of a bilingual list field. */
export function tList(field: LocalizedList, locale: Locale): string[] {
  return field[locale];
}

/**
 * Flattens the bilingual content down to a single locale.
 *
 * The chatbot prompt only ever needs the language the visitor is reading in:
 * sending both doubles the input tokens for no gain, and leaves the model to
 * guess which language to answer in.
 */
export function flattenForLocale(locale: Locale): unknown {
  function walk(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      /* A bilingual leaf is exactly { tr, en } — collapse it. */
      const keys = Object.keys(obj);
      if (keys.length === 2 && keys.includes("tr") && keys.includes("en")) {
        return obj[locale];
      }
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, walk(v)])
      );
    }
    return value;
  }
  return walk(content);
}
