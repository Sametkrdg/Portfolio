import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";
import { AudioToggle, HeroBackdrop } from "../canvas/HeroScene";

export default async function Hero({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { hero, meta } = content;

  return (
    <section id="hero" className="sp-hero">
      <HeroBackdrop />

      <p className="sp-hero-eyebrow">{hero.eyebrow[locale]}</p>

      <h1 className="sp-hero-title">
        <em>{meta.name}</em>
      </h1>

      <p className="sp-hero-body">{hero.headline[locale]}</p>
      <p className="sp-hero-body">{hero.body[locale]}</p>

      <div className="sp-cta-row">
        <a href="#projects" className="sp-cta" data-variant="primary">
          {t("nav.projects")}
        </a>
        <a href={meta.cv} download className="sp-cta" data-variant="secondary">
          {t("cta.downloadCv")}
        </a>
        <AudioToggle play={t("audio.play")} stop={t("audio.stop")} />
      </div>
    </section>
  );
}
