import { experiences } from "@/content/site";

function text(value: string) {
  if (value.includes("[CONTENT NEEDED]")) {
    return <span className="placeholder">{value}</span>;
  }
  return value;
}

export function Experience() {
  return (
    <section className="experience wrap" id="resume">
      <p className="kicker">Experience</p>
      <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", margin: "8px 0 28px" }}>
        Where I&apos;ve practiced the work.
      </h2>
      {experiences.map((job) => (
        <article className="job" key={`${job.company}-${job.role}`}>
          <div>
            <h3>{job.role}</h3>
            <p className="company">{job.company}</p>
          </div>
          <p className="years">{text(job.period)}</p>
          <p>{text(job.summary)}</p>
        </article>
      ))}
      <div className="resume-actions">
        <a className="btn" href="/resume">
          View Resume
        </a>
        <a className="btn ghost" href="/resume#download">
          Download Resume
        </a>
      </div>
    </section>
  );
}
