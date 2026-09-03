import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Contact({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { meta, contact } = content;

  const rows = [
    { key: t("cta.email"), value: meta.email, href: `mailto:${meta.email}`, external: false },
    { key: t("cta.linkedin"), value: meta.links.linkedin.replace(/^https?:\/\//, ""), href: meta.links.linkedin, external: true },
    { key: t("cta.github"), value: meta.links.github.replace(/^https?:\/\//, ""), href: meta.links.github, external: true },
    { key: t("cta.downloadCv"), value: t("cta.cvNote"), href: meta.cv, external: false },
  ];

  return (
    <section id="contact" className="ed-section ed-contact">
      <div className="ed-head">
        <span className="ed-kicker">05</span>
        <h2 className="ed-h2">{t("nav.contact")}</h2>
        <span className="ed-rule" aria-hidden />
      </div>

      <h3 className="ed-contact-title">{contact.headline[locale]}</h3>
      <p className="ed-contact-note">{contact.note[locale]}</p>

      <div className="ed-contact-list">
        {rows.map((row) => (
          <a
            key={row.href}
            href={row.href}
            {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <span className="ed-contact-key">{row.key}</span>
            <span className="ed-contact-value">{row.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
