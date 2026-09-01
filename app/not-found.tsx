import Link from "next/link";
import { routing } from "@/src/i18n/routing";
import messages from "@/src/messages/tr.json";

/*
 * Rendered for paths outside the `[locale]` tree, so it must supply its own
 * `<html>` — the root layout is a pass-through. Copy comes from the default
 * locale because there is no locale to read at this point.
 */
export default function NotFound() {
  const t = messages.notFound;

  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0d1117",
          color: "#f0f6ff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <main>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            {t.title}
          </h1>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>{t.body}</p>
          <Link href={`/${routing.defaultLocale}`} style={{ color: "#00d9ff" }}>
            {t.home}
          </Link>
        </main>
      </body>
    </html>
  );
}
