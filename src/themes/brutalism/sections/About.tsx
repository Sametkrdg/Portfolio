import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function About({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="about" className="br-section">
      <div className="br-head">
        <span className="br-tag">§01</span>
        <h2 className="br-h2">{t("nav.about")}</h2>
        <span className="br-rule" aria-hidden />
      </div>

      <div className="br-bento">
        {content.about.paragraphs[locale].map((paragraph, i) => (
          <article key={paragraph} className="br-box br-card">
            <p className="br-card-label">
              {String(i + 1).padStart(2, "0")} / {t("nav.about")}
            </p>
            <p>{paragraph}</p>
          </article>
        ))}

        <div className="br-meta-strip">
          <span>{content.meta.education[locale]}</span>
          <span>{content.meta.languages[locale]}</span>
        </div>
      </div>
    </section>
  );
}
