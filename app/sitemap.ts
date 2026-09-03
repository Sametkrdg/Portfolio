import type { MetadataRoute } from "next";
import { routing } from "@/src/i18n/routing";
import { DEFAULT_THEME, THEME_ORDER } from "@/src/themes/registry";

const SITE_URL = "https://sametkaradag.com";

/**
 * One entry per theme per locale — the same 14 pages `generateStaticParams`
 * builds. Each carries `alternates.languages` so a crawler that finds the
 * Turkish page knows where the English one is.
 *
 * The default theme lives at the bare `/tr`; it has no `/tr/minimal` twin, so
 * nothing here is a duplicate.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...THEME_ORDER.filter((slug) => slug !== DEFAULT_THEME).map(
      (slug) => `/${slug}`
    ),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      /* The default theme is the entry point; the rest are alternates of it. */
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
        ),
      },
    }))
  );
}
