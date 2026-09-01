import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/src/i18n/routing";
import type { Locale } from "@/src/lib/types";
import { content } from "@/src/lib/content";

import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import Skills from "@/src/components/sections/Skills";
import Experience from "@/src/components/sections/Experience";
import Projects from "@/src/components/sections/Projects";
import Contact from "@/src/components/sections/Contact";

type Params = { locale: string; theme?: string[] };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  /*
   * Phase 1 renders the existing section components under the new shell.
   * Phase 2 moves them into `src/themes/space/sections/` behind the
   * `SectionProps` contract, and each theme then supplies its own set.
   */
  return (
    <main id="content" className="shell-main">
      <Hero />
      <About />
      <Skills />
      <Experience content={content} locale={locale} />
      <Projects locale={locale} />
      <Contact />
    </main>
  );
}
