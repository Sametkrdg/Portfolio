import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Skills({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="skills" className="sp-section">
      <div className="sp-inner">
        <p className="sp-eyebrow">{t("nav.skills")}</p>
        <h2 className="sp-h2">
          <em>{t("nav.skills")}</em>
        </h2>

        <div className="sp-skill-groups">
          {content.skills.map((group) => (
            <article key={group.group.en} className="sp-card sp-skill-card">
              <h3 className="sp-skill-title">{group.group[locale]}</h3>
              <ul className="sp-chips">
                {group.items[locale].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
