import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Skills({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="skills" className="bp-section">
      <div className="bp-head">
        <span className="bp-tag">S / 02</span>
        <h2 className="bp-h2">{t("nav.skills")}</h2>
        <span className="bp-rule" aria-hidden />
      </div>

      <div className="bp-table">
        {content.skills.map((group, i) => (
          <div key={group.group.en} className="bp-table-row">
            <span className="bp-table-ref">
              S/{String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="bp-table-title">{group.group[locale]}</h3>
            <ul className="bp-chips">
              {group.items[locale].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
