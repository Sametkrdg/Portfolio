import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Projects({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="projects" className="sp-section">
      <div className="sp-inner">
        <p className="sp-eyebrow">{t("nav.projects")}</p>
        <h2 className="sp-h2">
          <em>{t("nav.projects")}</em>
        </h2>

        <div className="sp-projects">
          {content.projects.map((project) => (
            <article key={project.id} className="sp-card sp-project">
              <div className="sp-project-head">
                <span className="sp-project-status">
                  {t(`status.${project.status}`)}
                </span>
                <span className="sp-project-links">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t(`projectLink.${link.kind}`)} ↗
                    </a>
                  ))}
                </span>
              </div>

              <h3 className="sp-project-title">{project.name[locale]}</h3>

              <div>
                <p className="sp-field-label">{t("labels.problem")}</p>
                <p>{project.problem[locale]}</p>
              </div>

              <div>
                <p className="sp-field-label">{t("labels.architecture")}</p>
                <p>{project.architecture[locale]}</p>
              </div>

              <div className="sp-metrics">
                {project.metrics[locale].map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>

              <div className="sp-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
