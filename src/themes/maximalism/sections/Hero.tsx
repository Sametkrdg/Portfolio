import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
    <section id="hero" className="mx-hero" data-accent="lime">
      <p className="mx-hero-eyebrow">{hero.eyebrow[locale]}</p>

      <h1 className="mx-hero-title">
        {hero.headline[locale]}
        <span className="mx-caret" aria-hidden>
          _
        </span>
      </h1>

      <div className="mx-hero-grid">
        <div>
          <div className="mx-cols">
            <p className="mx-hero-body">{hero.body[locale]}</p>
          </div>

          <div className="mx-cta-row">
            <a href="#contact" className="mx-cta" data-variant="primary">
              <MailIcon />
              <span>{t("cta.contact")}</span>
            </a>
            <a href={meta.cv} download className="mx-cta" data-variant="secondary">
              <DownloadIcon />
              <span>{t("cta.downloadCv")}</span>
            </a>
          </div>
        </div>

        <div className="mx-panel">
          <div className="mx-panel-head">
            <span>{meta.availability[locale]}</span>
          </div>
          <div className="mx-panel-body">
            {about.stats.map((stat) => (
              <div key={stat.value[locale]} className="mx-stat">
                <span className="mx-stat-value">{stat.value[locale]}</span>
                <span className="mx-stat-label">{stat.label[locale]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
