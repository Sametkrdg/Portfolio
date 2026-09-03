import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default async function Hero({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { hero, about, meta } = content;

  return (
    <section id="hero" className="ed-hero">
      <div className="ed-feature">
        <div>
          <p className="ed-hero-eyebrow">{hero.eyebrow[locale]}</p>
          <h1 className="ed-hero-title">{hero.headline[locale]}</h1>
          <div className="ed-cols">
            <p className="ed-hero-body">{hero.body[locale]}</p>
          </div>
        </div>

        <aside className="ed-record">
          <p className="ed-record-label">{meta.role[locale]}</p>

          <div>
            {about.stats.map((stat) => (
              <div key={stat.value[locale]} className="ed-stat">
                <span className="ed-stat-value">{stat.value[locale]}</span>
                <span className="ed-stat-label">{stat.label[locale]}</span>
              </div>
            ))}
          </div>

          <a href="#contact" className="ed-cta">
            <span>
              <span className="ed-cta-main">{t("cta.contact")}</span>
              <span className="ed-cta-sub">{meta.email}</span>
            </span>
            <ArrowIcon />
          </a>
        </aside>
      </div>
    </section>
  );
}
