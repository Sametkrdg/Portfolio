import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export default async function Projects({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="projects" className="mn-section">
      <div className="mn-grid">
        <h2 className="mn-label">04 / {t("nav.projects")}</h2>

        <div className="mn-projects">
          {content.projects.map((project, i) => (
            <article key={project.id} className="mn-project">
              <div className="mn-project-head">
                <span>P/{String(i + 1).padStart(2, "0")}</span>
                <span className="mn-project-status">
                  {t(`status.${project.status}`)}
                </span>
              </div>

              <h3 className="mn-project-title">{project.name[locale]}</h3>

              <div>
                <p className="mn-field-label">{t("labels.problem")}</p>
                <p>{project.problem[locale]}</p>
              </div>

              <div>
                <p className="mn-field-label">{t("labels.architecture")}</p>
                <p>{project.architecture[locale]}</p>
              </div>

              <div className="mn-metrics">
                {project.metrics[locale].map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>

              <div className="mn-project-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className="mn-project-links">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{t(`projectLink.${link.kind}`)}</span>
                    <ArrowIcon />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
