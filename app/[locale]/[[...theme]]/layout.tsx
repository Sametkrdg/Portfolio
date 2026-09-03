import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Geist_Mono, JetBrains_Mono } from "next/font/google";
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
import { themeMemoryScript } from "@/src/lib/themeScript";
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
      className={`${inter.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          /* Restores the visitor's last theme on a bare `/tr` before paint. */
          dangerouslySetInnerHTML={{
            __html: themeMemoryScript(
              routing.locales,
              THEME_ORDER,
              DEFAULT_THEME
            ),
          }}
        />
      </head>
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
