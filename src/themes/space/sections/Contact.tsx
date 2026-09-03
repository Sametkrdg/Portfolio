import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Contact({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });
  const { meta, contact } = content;

  const rows = [
    {
      key: t("cta.email"),
      value: meta.email,
      href: `mailto:${meta.email}`,
      external: false,
    },
    {
      key: t("cta.linkedin"),
      value: meta.links.linkedin.replace(/^https?:\/\//, ""),
      href: meta.links.linkedin,
      external: true,
    },
    {
      key: t("cta.github"),
      value: meta.links.github.replace(/^https?:\/\//, ""),
      href: meta.links.github,
      external: true,
    },
    {
      key: t("cta.downloadCv"),
      value: t("cta.cvNote"),
      href: meta.cv,
      external: false,
    },
  ];

  return (
    <section id="contact" className="sp-section sp-contact">
      <div className="sp-inner">
        <p className="sp-eyebrow">{t("nav.contact")}</p>
        <h3 className="sp-contact-title">{contact.headline[locale]}</h3>
        <p className="sp-contact-note">{contact.note[locale]}</p>

        <div className="sp-contact-list">
          {rows.map((row) => (
            <a
              key={row.href}
              href={row.href}
              className="sp-card"
              {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className="sp-contact-key">{row.key}</span>
              <span className="sp-contact-value">{row.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
