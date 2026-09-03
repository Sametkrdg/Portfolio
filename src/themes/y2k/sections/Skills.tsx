import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Skills({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="skills" className="y2-section">
      <div className="y2-head">
        <span className="y2-tag">02</span>
        <h2 className="y2-h2">{t("nav.skills")}</h2>
        <span className="y2-rule" aria-hidden />
      </div>

      <div className="y2-deck">
        {content.skills.map((group, i) => (
          <article key={group.group.en} className="y2-skill-card">
            <div className="y2-skill-head">
              <h3 className="y2-skill-title">{group.group[locale]}</h3>
              <span className="y2-skill-slot">
                SLOT {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <ul className="y2-chips">
              {group.items[locale].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
