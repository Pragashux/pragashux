import type { Project } from "@/content/site";

function field(value: string) {
  if (value.includes("[CONTENT NEEDED]")) {
    return <span className="placeholder">{value}</span>;
  }
  return value;
}

export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="cs-hero wrap-wide">
      <p className="kicker">{project.industry}</p>
      <h1 className="display">{project.title}</h1>
      <p className="lede">{project.tagline}</p>
      <div className="cs-cover">
        <img src={project.cover} alt={project.images[0]?.alt || project.title} />
      </div>
    </section>
  );
}

export function ProjectMeta({ project }: { project: Project }) {
  const items = [
    ["Client / Company", project.client],
    ["Role", project.role],
    ["Duration", project.duration],
    ["Platform", project.platform],
    ["Team", project.team],
    ["My contribution", project.contribution],
  ];

  return (
    <dl className="cs-meta wrap">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{field(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
