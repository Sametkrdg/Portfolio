import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/src/i18n/routing";
import type { Locale, ThemeSlug } from "@/src/lib/types";
import { SECTION_IDS } from "@/src/lib/types";
import { content } from "@/src/lib/content";
import { DEFAULT_THEME, isThemeSlug, loadTheme } from "@/src/themes/registry";

type Params = { locale: string; theme?: string[] };

function resolveTheme(segments: string[] | undefined): ThemeSlug {
  if (!segments || segments.length === 0) return DEFAULT_THEME;
  if (segments.length > 1) notFound();
  const [slug] = segments;
  if (!isThemeSlug(slug) || slug === DEFAULT_THEME) notFound();
  return slug;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, theme } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const { sections } = await loadTheme(resolveTheme(theme));

  /*
   * Section order is fixed for every theme; only the components change.
   * Rendering from SECTION_IDS means a theme cannot quietly drop or reorder
   * a section.
   */
  return (
    <main id="content" className="shell-main">
      {SECTION_IDS.map((id) => {
        const Section = sections[id];
        return <Section key={id} content={content} locale={locale} />;
      })}
    </main>
  );
}
