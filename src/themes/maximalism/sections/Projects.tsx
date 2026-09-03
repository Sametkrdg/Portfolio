import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Projects({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="projects" className="mx-section" data-accent="pink">
      <div className="mx-head">
        <span className="mx-tag">04 / {t("nav.projects")}</span>
        <h2 className="mx-h2">{t("nav.projects")}</h2>
        <span className="mx-rule" aria-hidden />
      </div>

      <div className="mx-projects">
        {content.projects.map((project, i) => (
          <article key={project.id} className="mx-project">
            <div className="mx-project-head">
              <span>~/projects/{project.id}</span>
              <span className="mx-project-status">
                {t(`status.${project.status}`)}
              </span>
            </div>

            <h3 className="mx-project-title">
              {String(i + 1).padStart(2, "0")} {project.name[locale]}
            </h3>

            <div>
              <p className="mx-field-label">{t("labels.problem")}</p>
              <p>{project.problem[locale]}</p>
            </div>

            <div>
              <p className="mx-field-label">{t("labels.architecture")}</p>
              <p>{project.architecture[locale]}</p>
            </div>

            <div className="mx-metrics">
              {project.metrics[locale].map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>

            <div className="mx-stack">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="mx-project-links">
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
