import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function About({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { meta, about } = content;

  const facts = [
    { key: t("labels.education"), value: meta.education[locale] },
    { key: t("labels.languages"), value: meta.languages[locale] },
    { key: t("labels.availability"), value: meta.availability[locale] },
  ];

  return (
    <section id="about" className="sp-section">
      <div className="sp-inner">
        <p className="sp-eyebrow">{t("nav.about")}</p>
        <h2 className="sp-h2">
          {meta.role[locale]} <em>{meta.location[locale]}</em>
        </h2>
        <div className="sp-divider" aria-hidden />

        <div className="sp-about-grid">
          <div className="sp-prose">
            {about.paragraphs[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="sp-card sp-facts">
            {facts.map((fact) => (
              <div key={fact.key}>
                <span className="sp-fact-key">{fact.key}</span>
                <span className="sp-fact-value">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-stats">
          {about.stats.map((stat) => (
            <div key={stat.value[locale]} className="sp-card sp-stat">
              <p className="sp-stat-value">{stat.value[locale]}</p>
              <p className="sp-stat-label">{stat.label[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
