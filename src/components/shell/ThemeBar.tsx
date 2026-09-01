"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import type { Locale, ThemeSlug } from "@/src/lib/types";
import {
  DEFAULT_THEME,
  THEME_LABELS,
  THEME_ORDER,
  isThemeImplemented,
} from "@/src/themes/registry";
import { useRememberTheme } from "@/src/lib/useTheme";

/**
 * The theme strip: a horizontal list of every theme, top of the page on
 * desktop, pinned to the bottom on mobile.
 *
 * Each entry is a real link (`/tr/y2k`), not a button — the theme lives in the
 * URL, so a theme is shareable, bookmarkable and rendered server-side with no
 * flash. The visitor's last choice is mirrored into localStorage so a bare
 * `/tr` can restore it.
 */
export default function ThemeBar({
  active,
  locale,
}: {
  active: ThemeSlug;
  locale: Locale;
}) {
  const t = useTranslations("theme");
  useRememberTheme(active);

  return (
    <div className="theme-bar" role="group" aria-label={t("ariaLabel")}>
      <span className="theme-bar-label">{t("label")}</span>
      <ul className="theme-bar-list">
        {THEME_ORDER.map((slug) => {
          const isActive = slug === active;
          const built = isThemeImplemented(slug);
          return (
            <li key={slug}>
              <Link
                href={slug === DEFAULT_THEME ? "/" : `/${slug}`}
                locale={locale}
                aria-current={isActive ? "true" : undefined}
                data-active={isActive ? "" : undefined}
                data-unbuilt={built ? undefined : ""}
                title={built ? undefined : `${slug} — ${t("notBuilt")}`}
                className="theme-bar-item"
              >
                {THEME_LABELS[slug][locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
