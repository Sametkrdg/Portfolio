import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="experience" className="bp-section">
      <div className="bp-head">
        <span className="bp-tag">E / 03</span>
        <h2 className="bp-h2">{t("nav.experience")}</h2>
        <span className="bp-rule" aria-hidden />
      </div>

      <ol className="bp-jobs">
        {content.experience.map((job, i) => (
          <li key={job.company} className="bp-job">
            <div className="bp-job-when">
              <span className="bp-job-rev">
                REV {String(content.experience.length - i).padStart(2, "0")}
              </span>
              <span className="bp-job-period">{job.period[locale]}</span>
              <span className="bp-job-duration">{job.duration[locale]}</span>
            </div>

            <div className="bp-job-body">
              <div>
                <h3 className="bp-job-role">{job.role[locale]}</h3>
                <p className="bp-job-company">{job.company}</p>
              </div>

              <ul className="bp-bullets">
                {job.bullets[locale].map((point) => (
                  <li key={point}>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="bp-stack">
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
