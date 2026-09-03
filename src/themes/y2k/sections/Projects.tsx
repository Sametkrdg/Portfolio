import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Projects({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="projects" className="y2-section">
      <div className="y2-head">
        <span className="y2-tag">04</span>
        <h2 className="y2-h2">{t("nav.projects")}</h2>
        <span className="y2-rule" aria-hidden />
      </div>

      <div className="y2-bento">
        {content.projects.map((project, i) => (
          <article key={project.id} className="y2-project">
            <div className="y2-project-head">
              <span>[{String(i + 1).padStart(2, "0")}]</span>
              <span className="y2-project-status">
                {t(`status.${project.status}`)}
              </span>
            </div>

            <h3 className="y2-project-title">{project.name[locale]}</h3>

            <div className="y2-field" data-kind="problem">
              <p className="y2-field-label">{t("labels.problem")}</p>
              <p>{project.problem[locale]}</p>
            </div>

            <div className="y2-field" data-kind="architecture">
              <p className="y2-field-label">{t("labels.architecture")}</p>
              <p>{project.architecture[locale]}</p>
            </div>

            <div className="y2-metrics">
              {project.metrics[locale].map((metric) => (
                <span key={metric}>{metric}</span>
              ))}
            </div>

            <div className="y2-project-stack">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="y2-project-links">
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
