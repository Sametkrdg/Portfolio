import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="experience" className="sp-section">
      <div className="sp-inner">
        <p className="sp-eyebrow">{t("nav.experience")}</p>
        <h2 className="sp-h2">
          <em>{t("nav.experience")}</em>
        </h2>

        <ol className="sp-jobs">
          {content.experience.map((job) => (
            <li key={job.company} className="sp-card sp-job">
              <div className="sp-job-when">
                <span className="sp-job-period">{job.period[locale]}</span>
                <span className="sp-job-duration">{job.duration[locale]}</span>
              </div>

              <div className="sp-job-body">
                <div>
                  <h3 className="sp-job-role">{job.role[locale]}</h3>
                  <p className="sp-job-company">{job.company}</p>
                </div>

                <ul className="sp-bullets">
                  {job.bullets[locale].map((point) => (
                    <li key={point}>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="sp-stack">
                  {job.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
