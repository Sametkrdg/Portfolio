import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Skills({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <section id="skills" className="mn-section">
      <div className="mn-grid">
        <h2 className="mn-label">02 / {t("skills")}</h2>

        <div>
          {content.skills.map((group) => (
            <div key={group.group.en} className="mn-row mn-skill-row">
              <h3 className="mn-skill-group">{group.group[locale]}</h3>
              <ul className="mn-skill-items">
                {group.items[locale].map((item) => (
                  <li key={item} className="mn-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
