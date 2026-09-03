import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function About({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <section id="about" className="mn-section">
      <div className="mn-grid">
        <h2 className="mn-label">01 / {t("about")}</h2>

        <div className="mn-prose">
          {content.about.paragraphs[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="mn-meta-row">
            <span>{content.meta.education[locale]}</span>
            <span>{content.meta.languages[locale]}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
