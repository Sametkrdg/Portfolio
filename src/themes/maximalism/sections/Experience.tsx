import { getTranslations } from "next-intl/server";
import type { SectionProps } from "@/src/lib/types";

/* A stable pseudo-sha per row — presentation only, derived from the company. */
function sha(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, "0").slice(0, 7);
}

export default async function Experience({ content, locale }: SectionProps) {
  const t = await getTranslations({ locale });

  return (
    <section id="experience" className="mx-section" data-accent="violet">
      <div className="mx-head">
        <span className="mx-tag">03 / {t("nav.experience")}</span>
        <h2 className="mx-h2">{t("nav.experience")}</h2>
        <span className="mx-rule" aria-hidden />
      </div>

      <ol className="mx-jobs">
        {content.experience.map((job) => (
          <li key={job.company} className="mx-job">
            <div className="mx-job-when">
              <span className="mx-job-period">{job.period[locale]}</span>
              <span className="mx-job-duration">{job.duration[locale]}</span>
              <span className="mx-job-sha">commit {sha(job.company)}</span>
            </div>

            <div className="mx-job-body">
              <div>
                <h3 className="mx-job-role">{job.role[locale]}</h3>
                <p className="mx-job-company">{job.company}</p>
              </div>

              <ul className="mx-bullets">
                {job.bullets[locale].map((point) => (
                  <li key={point}>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mx-stack">
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
