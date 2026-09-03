import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

/**
 * mailto + LinkedIn + GitHub + CV, and nothing else. The source design has a
 * contact form; the decision is that it does not ship.
 */
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
    <section id="contact" className="mn-section">
      <div className="mn-grid">
        <h2 className="mn-label">05 / {t("nav.contact")}</h2>

        <div>
          <h3 className="mn-contact-title">{contact.headline[locale]}</h3>
          <p className="mn-contact-note">{contact.note[locale]}</p>

          <div className="mn-contact-list">
            {rows.map((row) => (
              <a
                key={row.href}
                href={row.href}
                {...(row.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <span className="mn-contact-key">{row.key}</span>
                <span className="mn-contact-value">{row.value}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
