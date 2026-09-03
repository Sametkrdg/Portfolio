import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="experience" className="ed-section">
      <div className="ed-head">
        <span className="ed-kicker">03</span>
        <h2 className="ed-h2">{t("nav.experience")}</h2>
        <span className="ed-rule" aria-hidden />
      </div>

      <ol className="ed-jobs">
        {content.experience.map((job) => (
          <li key={job.company} className="ed-job">
            <div className="ed-job-when">
              <span className="ed-job-period">{job.period[locale]}</span>
              <span className="ed-job-duration">{job.duration[locale]}</span>
            </div>

            <div className="ed-job-body">
              <div>
                <h3 className="ed-job-role">{job.role[locale]}</h3>
                <p className="ed-job-company">{job.company}</p>
              </div>

              <ul className="ed-bullets">
                {job.bullets[locale].map((point) => (
                  <li key={point}>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <p className="ed-stack">{job.stack.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
