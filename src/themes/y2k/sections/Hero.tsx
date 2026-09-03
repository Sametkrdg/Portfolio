import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
      <path d="M3 5h18v14H3z" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
      <path d="M4 15v5h16v-5" />
      <path d="m7 11 5 5 5-5" />
      <path d="M12 16V3" />
    </svg>
  );
}

export default async function Hero({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { hero, about, meta } = content;

  return (
    <section id="hero" className="y2-hero">
      <p className="y2-hero-eyebrow">{hero.eyebrow[locale]}</p>
      <h1 className="y2-hero-title">{hero.headline[locale]}</h1>

      <div className="y2-hero-grid">
        <div>
          <p className="y2-hero-body">{hero.body[locale]}</p>

          <div className="y2-cta-row">
            <a href="#contact" className="y2-cta" data-variant="primary">
              <MailIcon />
              <span>{t("cta.contact")}</span>
            </a>
            <a href={meta.cv} download className="y2-cta" data-variant="secondary">
              <DownloadIcon />
              <span>{t("cta.downloadCv")}</span>
            </a>
          </div>
        </div>

        <div className="y2-panel">
          <div className="y2-panel-head">
            <span>{meta.role[locale]}</span>
            <span>{meta.location[locale]}</span>
          </div>
          {about.stats.map((stat) => (
            <div key={stat.value[locale]} className="y2-stat">
              <span className="y2-stat-value">{stat.value[locale]}</span>
              <span className="y2-stat-label">{stat.label[locale]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
