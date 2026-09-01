import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

/**
 * Experience — the one section the old site never had. Written straight
 * against the `SectionProps` contract and fed entirely from
 * `portfolio-context.json`, so Phase 2 only has to restyle it, not rewrite it.
 */
export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <section
      id="experience"
      className="relative border-t border-[var(--color-bg-muted)] px-6 py-28"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <h2 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          {t("experience")}
        </h2>

        <ol className="flex flex-col gap-12">
          {content.experience.map((job) => (
            <li
              key={`${job.company}-${job.period.en}`}
              className="flex flex-col gap-4 border-l border-[var(--color-bg-muted)] pl-6"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                  {job.period[locale]} · {job.duration[locale]}
                </p>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  {job.role[locale]}
                </h3>
                <p className="text-sm font-medium text-[var(--color-cyan-neon)]">
                  {job.company}
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {job.bullets[locale].map((point) => (
                  <li
                    key={point}
                    className="text-sm leading-relaxed text-[var(--color-text-secondary)]"
                  >
                    {point}
                  </li>
                ))}
              </ul>

              <ul className="flex flex-wrap gap-2">
                {job.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-[var(--color-bg-muted)] px-3 py-1 text-[11px] text-[var(--color-text-secondary)]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
