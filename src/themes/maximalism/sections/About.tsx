import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function About({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="about" className="mx-section" data-accent="cyan">
      <div className="mx-head">
        <span className="mx-tag">01 / {t("nav.about")}</span>
        <h2 className="mx-h2">{t("nav.about")}</h2>
        <span className="mx-rule" aria-hidden />
      </div>

      <div className="mx-ledger">
        {content.about.paragraphs[locale].map((paragraph, i) => (
          <div key={paragraph} className="mx-ledger-row mx-about-row">
            <span className="mx-ledger-line">
              {String((i + 1) * 10).padStart(3, "0")}
            </span>
            <h3 className="mx-ledger-title">
              {t("nav.about")}[{i}]
            </h3>
            <p>{paragraph}</p>
          </div>
        ))}
      </div>

      <div className="mx-notes">
        <div>
          <span className="mx-note-key">{t("labels.education")}</span>
          <span className="mx-note-value">{content.meta.education[locale]}</span>
        </div>
        <div>
          <span className="mx-note-key">{t("labels.languages")}</span>
          <span className="mx-note-value">{content.meta.languages[locale]}</span>
        </div>
      </div>
    </section>
  );
}
