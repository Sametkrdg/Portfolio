import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="experience" className="y2-section">
      <div className="y2-head">
        <span className="y2-tag">03</span>
        <h2 className="y2-h2">{t("nav.experience")}</h2>
        <span className="y2-rule" aria-hidden />
      </div>

      <ol className="y2-jobs">
        {content.experience.map((job, i) => (
          <li key={job.company} className="y2-job">
            <div className="y2-job-when">
              <span className="y2-job-log">
                LOG {String(content.experience.length - i).padStart(2, "0")}
              </span>
              <span className="y2-job-period">{job.period[locale]}</span>
              <span className="y2-job-duration">{job.duration[locale]}</span>
            </div>

            <div className="y2-job-body">
              <div>
                <h3 className="y2-job-role">{job.role[locale]}</h3>
                <p className="y2-job-company">{job.company}</p>
              </div>

              <ul className="y2-bullets">
                {job.bullets[locale].map((point) => (
                  <li key={point}>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="y2-stack">
                {job.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
