import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export default async function Hero({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { hero, about, meta } = content;

  return (
    <section id="hero" className="bp-hero">
      <div className="bp-hero-meta">
        <span className="bp-hero-eyebrow">{hero.eyebrow[locale]}</span>
        <span className="bp-dashed-rule" aria-hidden />
        <span className="bp-hero-scale">SCALE 1:1</span>
      </div>

      <div className="bp-frame">
        <h1 className="bp-hero-title">
          {hero.headline[locale]}
          <span className="bp-caret" aria-hidden>
            _
          </span>
        </h1>
      </div>

      <div className="bp-hero-grid">
        <div>
          <div className="bp-bracket">
            <p>{hero.body[locale]}</p>
          </div>

          <div className="bp-cta-row">
            <a href="#contact" className="bp-cta" data-variant="primary">
              <MailIcon />
              <span>{t("cta.contact")}</span>
            </a>
            <a href={meta.cv} download className="bp-cta" data-variant="secondary">
              <DownloadIcon />
              <span>{t("cta.downloadCv")}</span>
            </a>
          </div>
        </div>

        <div className="bp-panel">
          <div className="bp-panel-head">
            <span>TELEMETRY</span>
            <span className="bp-panel-status">
              {meta.availability[locale]}
            </span>
          </div>
          {about.stats.map((stat, i) => (
            <div key={stat.value[locale]} className="bp-stat">
              <span className="bp-stat-ref">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="bp-stat-value">{stat.value[locale]}</span>
              <span className="bp-stat-label">{stat.label[locale]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
