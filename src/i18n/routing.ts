import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  /*
   * Both locales always carry their prefix (`/tr`, `/en`) so every page has
   * exactly one canonical URL — no duplicate `/` + `/tr` pair for crawlers.
   */
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
