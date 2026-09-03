import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Inter,
  Geist_Mono,
  JetBrains_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Playfair_Display,
  Source_Sans_3,
  Space_Mono,
  Work_Sans,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { routing } from "@/src/i18n/routing";
import type { Locale, ThemeSlug } from "@/src/lib/types";
import {
  DEFAULT_THEME,
  THEME_ORDER,
  isThemeImplemented,
  isThemeSlug,
  loadTheme,
} from "@/src/themes/registry";
import SideNav from "@/src/components/shell/SideNav";
import ThemeBar from "@/src/components/shell/ThemeBar";
import LocaleSwitch from "@/src/components/shell/LocaleSwitch";
import ChatWidget from "@/src/components/shell/ChatWidget";
import { content } from "@/src/lib/content";
import "../../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

/*
 * Fonts are loaded per theme, not all at once: a visitor on `minimal` should
 * never download IBM Plex. TypeScript keeps this exhaustive, so a new theme
 * cannot be added without deciding what it reads in.
 */
const THEME_FONTS: Record<ThemeSlug, string> = {
  minimal: `${inter.variable} ${jetbrainsMono.variable}`,
  blueprint: `${plexSans.variable} ${plexMono.variable}`,
  space: `${inter.variable} ${geistMono.variable}`,
  editorial: `${playfair.variable} ${sourceSans.variable}`,
  brutalism: `${spaceMono.variable} ${workSans.variable}`,
  maximalism: `${inter.variable} ${jetbrainsMono.variable}`,
  y2k: `${inter.variable} ${jetbrainsMono.variable}`,
};

const SITE_URL = "https://sametkaradag.com";

type Params = { locale: string; theme?: string[] };

/**
 * Resolves the optional `[[...theme]]` segment.
 * `/tr` → default theme · `/tr/y2k` → y2k · anything else → 404.
 *
 * The default theme is only reachable at the bare `/tr`, so every theme has
 * exactly one URL and crawlers never see the same page twice.
 */
function resolveTheme(segments: string[] | undefined): ThemeSlug {
  if (!segments || segments.length === 0) return DEFAULT_THEME;
  if (segments.length > 1) notFound();
  const [slug] = segments;
  if (!isThemeSlug(slug) || slug === DEFAULT_THEME) notFound();
  return slug;
}

export function generateStaticParams() {
  const themeParams: (string[] | undefined)[] = [
    undefined,
    ...THEME_ORDER.filter((slug) => slug !== DEFAULT_THEME).map((slug) => [slug]),
  ];

  return routing.locales.flatMap((locale) =>
    themeParams.map((theme) => ({ locale, theme }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale, theme } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slug = resolveTheme(theme);

  const t = await getTranslations({ locale, namespace: "meta" });
  const path = slug === DEFAULT_THEME ? "" : `/${slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    authors: [{ name: content.meta.name, url: content.meta.links.github }],
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        tr: `/tr${path}`,
        en: `/en${path}`,
        "x-default": `/${routing.defaultLocale}${path}`,
      },
    },
    openGraph: {
      type: "website",
      locale,
      url: `${SITE_URL}/${locale}${path}`,
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleThemeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<Params>;
}) {
  const { locale: rawLocale, theme } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const slug = resolveTheme(theme);

  /* Enables static rendering for this locale. */
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const themeDef = await loadTheme(slug);

  /*
   * `data-theme` names the theme whose CSS is actually loaded. Until a slug is
   * built it renders the default theme's components, so it must carry the
   * default theme's tokens too — otherwise the page would show one theme's
   * layout with another theme's colours. The theme bar still marks the slug
   * from the URL as selected.
   */
  const styledAs = isThemeImplemented(slug) ? slug : DEFAULT_THEME;

  return (
    <html
      lang={locale}
      data-theme={styledAs}
      className={`${THEME_FONTS[styledAs]} h-full antialiased`}
    >
      <body className="app-shell">
        <NextIntlClientProvider>
          <a href="#hero" className="skip-link">
            {t("skipToContent")}
          </a>

          <header className="shell-top">
            <ThemeBar active={slug} locale={locale} />
            <LocaleSwitch active={locale} />
          </header>

          <div className="shell-body">
            <SideNav
              NavItem={themeDef.shell.NavItem}
              content={content}
              locale={locale}
            />
            {children}
          </div>

          <ChatWidget locale={locale} />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
