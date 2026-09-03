import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Skills({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="skills" className="mx-section" data-accent="amber">
      <div className="mx-head">
        <span className="mx-tag">02 / {t("nav.skills")}</span>
        <h2 className="mx-h2">{t("nav.skills")}</h2>
        <span className="mx-rule" aria-hidden />
      </div>

      <div className="mx-ledger">
        {content.skills.map((group, i) => (
          <div key={group.group.en} className="mx-ledger-row">
            <span className="mx-ledger-line">
              {String((i + 1) * 10).padStart(3, "0")}
            </span>
            <h3 className="mx-ledger-title">{group.group[locale]}</h3>
            <ul className="mx-chips">
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
