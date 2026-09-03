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
    <section id="contact" className="bp-section bp-contact">
      <div className="bp-head">
        <span className="bp-tag">C / 05</span>
        <h2 className="bp-h2">{t("nav.contact")}</h2>
        <span className="bp-rule" aria-hidden />
      </div>

      <h3 className="bp-contact-title">{contact.headline[locale]}</h3>
      <p className="bp-contact-note">{contact.note[locale]}</p>

      <div className="bp-contact-list">
        {rows.map((row) => (
          <a
            key={row.href}
            href={row.href}
            {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <span className="bp-contact-key">{row.key}</span>
            <span className="bp-contact-value">{row.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
