import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="experience" className="br-section">
      <div className="br-head">
        <span className="br-tag">§03</span>
        <h2 className="br-h2">{t("nav.experience")}</h2>
        <span className="br-rule" aria-hidden />
      </div>

      <ol className="br-jobs">
        {content.experience.map((job) => (
          <li key={job.company} className="br-job">
            <div className="br-job-when">
              <span className="br-job-period">{job.period[locale]}</span>
              <span className="br-job-duration">{job.duration[locale]}</span>
            </div>

            <div className="br-job-body">
              <div>
                <h3 className="br-job-role">{job.role[locale]}</h3>
                <p className="br-job-company">{job.company}</p>
              </div>

              <ul className="br-bullets">
                {job.bullets[locale].map((point) => (
                  <li key={point}>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="br-stack">
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
