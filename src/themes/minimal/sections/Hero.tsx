import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export default async function Hero({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale, namespace: "cta" });
  const { hero, about, meta } = content;

  return (
    <section id="hero" className="mn-hero">
      <p className="mn-hero-eyebrow">{hero.eyebrow[locale]}</p>

      <h1 className="mn-hero-title">{hero.headline[locale]}</h1>

      <p className="mn-hero-body">{hero.body[locale]}</p>

      <div className="mn-cta-row">
        <a href="#contact" className="mn-cta" data-variant="primary">
          <MailIcon />
          <span>{t("contact")}</span>
        </a>
        <a
          href={meta.cv}
          download
          className="mn-cta"
          data-variant="secondary"
        >
          <DownloadIcon />
          <span>{t("downloadCv")}</span>
        </a>
      </div>

      <div className="mn-stats">
        {about.stats.map((stat) => (
          <div key={stat.value[locale]} className="mn-stat">
            <p className="mn-stat-value">{stat.value[locale]}</p>
            <p className="mn-stat-label">{stat.label[locale]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
