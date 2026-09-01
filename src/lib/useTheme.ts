"use client";

import { useEffect } from "react";
import type { ThemeSlug } from "./types";
import { THEME_STORAGE_KEY } from "./themeScript";

/**
 * The URL is the source of truth for the active theme — `/tr/y2k` renders y2k,
 * server-side, with `data-theme` already correct in the HTML. There is no
 * client-side theme state and therefore no flash.
 *
 * localStorage only *remembers* the last choice, so a returning visitor who
 * lands on the bare `/tr` is sent to the theme they picked last time. That
 * redirect runs in a blocking script before first paint (see
 * `themeMemoryScript`), never here.
 */
export function useRememberTheme(slug: ThemeSlug) {
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, slug);
    } catch {
      /* Private mode / storage disabled — the URL still works. */
    }
  }, [slug]);
}
