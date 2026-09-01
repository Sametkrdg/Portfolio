import type { ThemeSlug } from "./types";

export const THEME_STORAGE_KEY = "theme";

/**
 * Blocking <head> script: on a bare `/tr` or `/en`, if the visitor previously
 * chose a non-default theme, replace the URL with it before anything paints.
 *
 * Kept deliberately tiny and dependency-free — it runs on every page load, and
 * it is the only reason theme memory does not cause a flash: the URL, not
 * client state, decides what renders.
 */
export function themeMemoryScript(
  locales: readonly string[],
  slugs: readonly ThemeSlug[],
  defaultTheme: ThemeSlug
): string {
  return `(function(){try{
var p=location.pathname.replace(/\\/+$/,"");
var L=${JSON.stringify(locales)};
if(L.indexOf(p.slice(1))===-1)return;
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(!t||t===${JSON.stringify(defaultTheme)})return;
if(${JSON.stringify(slugs)}.indexOf(t)===-1)return;
location.replace(p+"/"+t+location.search+location.hash);
}catch(e){}})();`;
}
