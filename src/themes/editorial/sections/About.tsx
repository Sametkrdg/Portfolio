import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function About({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { meta, about, hero } = content;

  const dossier = [
    { key: t("labels.education"), value: meta.education[locale] },
    { key: t("labels.languages"), value: meta.languages[locale] },
    { key: t("nav.contact"), value: meta.location[locale] },
    { key: t("labels.availability"), value: meta.availability[locale] },
  ];

  return (
    <section id="about" className="ed-section">
      <div className="ed-head">
        <span className="ed-kicker">01</span>
        <h2 className="ed-h2">{t("nav.about")}</h2>
        <span className="ed-rule" aria-hidden />
      </div>

      <div className="ed-feature">
        <div className="ed-cols ed-prose">
          {about.paragraphs[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <aside className="ed-aside">
          {/* The pull quote is the hero line, set again — no new copy. */}
          <blockquote className="ed-quote">{hero.headline[locale]}</blockquote>

          <div className="ed-dossier">
            <p className="ed-dossier-label">{meta.name}</p>
            {dossier.map((row) => (
              <div key={row.key} className="ed-dossier-row">
                <span className="ed-dossier-key">{row.key}</span>
                <span className="ed-dossier-value">{row.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
