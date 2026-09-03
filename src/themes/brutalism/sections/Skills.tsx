import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Skills({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="skills" className="br-section">
      <div className="br-head">
        <span className="br-tag">§02</span>
        <h2 className="br-h2">{t("nav.skills")}</h2>
        <span className="br-rule" aria-hidden />
      </div>

      <div className="br-bento">
        {content.skills.map((group) => (
          <article key={group.group.en} className="br-box br-skill-card">
            <div className="br-skill-head">
              <h3 className="br-skill-title">{group.group[locale]}</h3>
              <span className="br-skill-count">
                {String(group.items[locale].length).padStart(2, "0")}
              </span>
            </div>
            <ul className="br-chips">
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
