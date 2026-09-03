import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Projects({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="projects" className="ed-section">
      <div className="ed-head">
        <span className="ed-kicker">04</span>
        <h2 className="ed-h2">{t("nav.projects")}</h2>
        <span className="ed-rule" aria-hidden />
      </div>

      <div className="ed-projects">
        {content.projects.map((project, i) => (
          <article key={project.id} className="ed-project">
            <div>
              <div className="ed-project-head">
                <span className="ed-project-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ed-project-status">
                  {t(`status.${project.status}`)}
                </span>
              </div>

              <h3 className="ed-project-title">{project.name[locale]}</h3>

              <div className="ed-cols">
                <h4 className="ed-field-label">{t("labels.problem")}</h4>
                <p>{project.problem[locale]}</p>
                <h4 className="ed-field-label">{t("labels.architecture")}</h4>
                <p>{project.architecture[locale]}</p>
              </div>
            </div>

            <aside className="ed-project-aside">
              <div className="ed-metrics">
                {project.metrics[locale].map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>

              <p className="ed-stack">{project.stack.join(" · ")}</p>

              <div className="ed-project-links">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {t(`projectLink.${link.kind}`)}
                  </a>
                ))}
              </div>
            </aside>
          </article>
        ))}
      </div>
    </section>
  );
}
