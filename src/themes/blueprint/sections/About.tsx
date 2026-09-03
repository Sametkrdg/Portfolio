import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function About({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="about" className="bp-section">
      <div className="bp-head">
        <span className="bp-tag">A / 01</span>
        <h2 className="bp-h2">{t("nav.about")}</h2>
        <span className="bp-rule" aria-hidden />
      </div>

      <div className="bp-cards">
        {content.about.paragraphs[locale].map((paragraph, i) => (
          <article key={paragraph} className="bp-card">
            <div className="bp-card-head">
              <span>NOTE {String(i + 1).padStart(2, "0")}</span>
              <span className="bp-rule" aria-hidden />
              <span>A/{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p>{paragraph}</p>
          </article>
        ))}

        <div className="bp-notes">
          <div>
            <span className="bp-note-key">[{t("labels.education")}]</span>
            <span className="bp-note-value">
              {content.meta.education[locale]}
            </span>
          </div>
          <div>
            <span className="bp-note-key">[{t("labels.languages")}]</span>
            <span className="bp-note-value">
              {content.meta.languages[locale]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
