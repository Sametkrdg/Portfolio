import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function About({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { meta } = content;

  const dossier = [
    { key: t("labels.education"), value: meta.education[locale] },
    { key: t("labels.languages"), value: meta.languages[locale] },
    { key: t("labels.availability"), value: meta.availability[locale] },
    { key: t("cta.email"), value: meta.email },
  ];

  return (
    <section id="about" className="y2-section">
      <div className="y2-head">
        <span className="y2-tag">01</span>
        <h2 className="y2-h2">{t("nav.about")}</h2>
        <span className="y2-rule" aria-hidden />
      </div>

      <div className="y2-bento">
        {content.about.paragraphs[locale].map((paragraph, i) => (
          <article key={paragraph} className="y2-card">
            <p className="y2-card-label">
              {t("nav.about")} / {String(i + 1).padStart(2, "0")}
            </p>
            <p>{paragraph}</p>
          </article>
        ))}

        <div className="y2-dossier">
          {dossier.map((row) => (
            <div key={row.key}>
              <span className="y2-dossier-key">{row.key}</span>
              <span className="y2-dossier-value">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
