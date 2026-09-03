import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export default async function Projects({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="projects" className="bp-section">
      <div className="bp-head">
        <span className="bp-tag">P / 04</span>
        <h2 className="bp-h2">{t("nav.projects")}</h2>
        <span className="bp-rule" aria-hidden />
      </div>

      <div className="bp-projects">
        {content.projects.map((project, i) => (
          <article key={project.id} className="bp-project">
            <div className="bp-project-head">
              <span>DWG P/{String(i + 1).padStart(2, "0")}</span>
              <span className="bp-project-status">
                {t(`status.${project.status}`)}
              </span>
            </div>

            <div className="bp-project-body">
              <h3 className="bp-project-title">{project.name[locale]}</h3>

              <div className="bp-field" data-kind="problem">
                <div>
                  <p className="bp-field-label">{t("labels.problem")}</p>
                  <p>{project.problem[locale]}</p>
                </div>
              </div>

              <div className="bp-field" data-kind="architecture">
                <div>
                  <p className="bp-field-label">{t("labels.architecture")}</p>
                  <p>{project.architecture[locale]}</p>
                </div>
              </div>

              <div className="bp-metrics">
                {project.metrics[locale].map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>

              <div className="bp-project-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className="bp-project-links">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    <span>{t(`projectLink.${link.kind}`)}</span>
                    <ArrowIcon />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
