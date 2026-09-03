import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <section id="experience" className="mn-section">
      <div className="mn-grid">
        <h2 className="mn-label">03 / {t("experience")}</h2>

        <ol className="mn-jobs">
          {content.experience.map((job) => (
            <li key={job.company} className="mn-row mn-job">
              <div className="mn-job-when">
                <span className="mn-job-period">{job.period[locale]}</span>
                <span className="mn-job-duration">{job.duration[locale]}</span>
              </div>

              <div className="mn-job-body">
                <div>
                  <h3 className="mn-job-role">{job.role[locale]}</h3>
                  <p className="mn-job-company">{job.company}</p>
                </div>

                <ul className="mn-bullets">
                  {job.bullets[locale].map((point) => (
                    <li key={point}>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mn-stack">
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
