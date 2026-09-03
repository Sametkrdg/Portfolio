import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
      <path d="M3 5h18v14H3z" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
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
    <section id="hero" className="br-hero">
      <p className="br-hero-eyebrow">{hero.eyebrow[locale]}</p>
      <h1 className="br-hero-title">{hero.headline[locale]}</h1>

      <div className="br-hero-meta">
        <p className="br-hero-body">{hero.body[locale]}</p>

        <div className="br-cta-row">
          <a href="#contact" className="br-cta" data-variant="primary">
            <MailIcon />
            <span>{t("cta.contact")}</span>
          </a>
          <a href={meta.cv} download className="br-cta" data-variant="secondary">
            <DownloadIcon />
            <span>{t("cta.downloadCv")}</span>
          </a>
        </div>
      </div>

      <div className="br-stats">
        {about.stats.map((stat) => (
          <div key={stat.value[locale]} className="br-box br-stat">
            <p className="br-stat-value">{stat.value[locale]}</p>
            <p className="br-stat-label">{stat.label[locale]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
