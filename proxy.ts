import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/src/i18n/routing";
import { DEFAULT_THEME, THEME_ORDER } from "@/src/themes/registry";

const handleI18n = createMiddleware(routing);

/** Written by the theme bar; read here. */
export const THEME_COOKIE = "theme";

const BARE_LOCALE = new RegExp(`^/(${routing.locales.join("|")})/?$`);

/**
 * Theme memory, done on the server.
 *
 * A visitor who last chose a non-default theme and then opens the bare `/tr`
 * is redirected to `/tr/<theme>` before any HTML is sent — no inline script,
 * no second document load, and nothing to flash.
 */
export default function proxy(request: NextRequest) {
  const match = BARE_LOCALE.exec(request.nextUrl.pathname);

  if (match) {
    const remembered = request.cookies.get(THEME_COOKIE)?.value;
    const isKnown =
      remembered !== undefined &&
      remembered !== DEFAULT_THEME &&
      (THEME_ORDER as readonly string[]).includes(remembered);

    if (isKnown) {
      const url = request.nextUrl.clone();
      url.pathname = `/${match[1]}/${remembered}`;
      return NextResponse.redirect(url);
    }
  }

  return handleI18n(request);
}

export const config = {
  /*
   * Run on every path except API routes, Next internals and anything with a
   * file extension (PDFs, images, fonts, the sitemap).
   */
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
