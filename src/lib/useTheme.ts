"use client";

import { useEffect } from "react";
import type { ThemeSlug } from "./types";

const THEME_COOKIE = "theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * The URL is the source of truth for the active theme — `/tr/y2k` renders y2k
 * server-side, with `data-theme` already correct in the HTML. There is no
 * client-side theme state and therefore no flash.
 *
 * This only *remembers* the choice, in a cookie rather than localStorage, so
 * `proxy.ts` can read it and redirect a bare `/tr` to the remembered theme
 * server-side. localStorage would have needed a blocking inline script and a
 * second document load to do the same job.
 */
export function useRememberTheme(slug: ThemeSlug) {
  useEffect(() => {
    document.cookie = `${THEME_COOKIE}=${slug}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }, [slug]);
}
