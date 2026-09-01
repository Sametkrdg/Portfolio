"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/routing";
import { routing } from "@/src/i18n/routing";
import type { Locale } from "@/src/lib/types";

/**
 * TR / EN switch. `usePathname()` from next-intl returns the path *without*
 * the locale prefix, so switching keeps the visitor on the same theme and the
 * same page; the hash survives because it never reaches the server.
 */
export default function LocaleSwitch({ active }: { active: Locale }) {
  const t = useTranslations("locale");
  const pathname = usePathname();

  return (
    <div className="locale-switch" role="group" aria-label={t("ariaLabel")}>
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            data-active={isActive ? "" : undefined}
            className="locale-switch-item"
          >
            {t(locale)}
          </Link>
        );
      })}
    </div>
  );
}
