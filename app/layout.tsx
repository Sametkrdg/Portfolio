import type { ReactNode } from "react";

/*
 * Next requires a root layout, but `<html>` and `<body>` are rendered one
 * level down in `app/[locale]/[[...theme]]/layout.tsx` — that is the first
 * layout that knows the locale (for `lang`) and the theme (for `data-theme`),
 * so both land in the server-rendered HTML with no client-side correction.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
