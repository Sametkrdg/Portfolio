import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Projects({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="projects" className="br-section">
      <div className="br-head">
        <span className="br-tag">§04</span>
        <h2 className="br-h2">{t("nav.projects")}</h2>
        <span className="br-rule" aria-hidden />
      </div>

      <div className="br-bento">
        {content.projects.map((project, i) => (
          <article key={project.id} className="br-box br-project">
            <div className="br-project-head">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span className="br-project-status">
                {t(`status.${project.status}`)}
              </span>
            </div>

            <h3 className="br-project-title">{project.name[locale]}</h3>

            <div>
              <p className="br-field-label">{t("labels.problem")}</p>
              <p>{project.problem[locale]}</p>
            </div>

            <div>
              <p className="br-field-label">{t("labels.architecture")}</p>
              <p>{project.architecture[locale]}</p>
            </div>

            <div className="br-metrics">
              {project.metrics[locale].map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>

            <div className="br-stack">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="br-project-links">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {t(`projectLink.${link.kind}`)} ↗
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
