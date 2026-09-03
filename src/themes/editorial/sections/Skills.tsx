import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Skills({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="skills" className="ed-section">
      <div className="ed-head">
        <span className="ed-kicker">02</span>
        <h2 className="ed-h2">{t("nav.skills")}</h2>
        <span className="ed-rule" aria-hidden />
      </div>

      <div className="ed-ledger">
        {content.skills.map((group, i) => (
          <div key={group.group.en} className="ed-ledger-row">
            <span className="ed-ledger-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="ed-ledger-title">{group.group[locale]}</h3>
            <ul className="ed-chips">
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
