import { experiences, site } from "@/content/site";

export const metadata = {
  title: "Resume",
  description: `Experience snapshot for ${site.name}.`,
};

export default function ResumePage() {
  return (
    <article className="wrap" style={{ padding: "48px 0 80px" }}>
      <p className="kicker">Resume</p>
      <h1 className="display" style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}>
        {site.name}
      </h1>
      <p>
        {site.title} · {site.location}
      </p>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        {" · "}
        <a href={site.linkedin}>LinkedIn</a>
        {" · "}
        <a href={site.behance}>Behance</a>
      </p>

      <h2 className="display" style={{ marginTop: 48 }}>
        Experience
      </h2>
      {experiences.map((job) => (
        <section key={job.company} style={{ padding: "20px 0", borderTop: "1px solid var(--line)" }}>
          <h3 style={{ margin: 0 }}>{job.role}</h3>
          <p style={{ margin: "4px 0", color: "var(--muted)" }}>
            {job.company} · {job.period}
          </p>
          <p>{job.summary}</p>
        </section>
      ))}

      <div className="needs" id="download" style={{ marginTop: 40 }}>
        <h3>Download Resume</h3>
        <p>
          A PDF resume is not in this repository yet. Replace this note by adding{" "}
          <code>public/resume.pdf</code> and pointing the Download button to it.
        </p>
        <p className="placeholder">[CONTENT NEEDED] Upload the latest resume PDF.</p>
      </div>
    </article>
  );
}
