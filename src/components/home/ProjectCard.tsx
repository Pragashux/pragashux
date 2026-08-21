import Link from "next/link";
import type { Project } from "@/content/site";

function maybePlaceholder(value: string) {
  if (value.includes("[CONTENT NEEDED]")) {
    return <span className="placeholder">{value}</span>;
  }
  return value;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div>
        <p className="kicker">Selected work</p>
        <h3 className="display">{project.title}</h3>
        <p>{project.problemStatement}</p>
        <div className="meta-row">
          <span>
            <strong>Role</strong>
            {maybePlaceholder(project.role)}
          </span>
          <span>
            <strong>Type</strong>
            {project.productType}
          </span>
          <span>
            <strong>Industry</strong>
            {project.industry}
          </span>
          <span>
            <strong>Year</strong>
            {maybePlaceholder(project.year)}
          </span>
        </div>
        <Link className="link-arrow" href={`/work/${project.slug}`}>
          View case study →
        </Link>
      </div>
      <Link className="project-visual" href={`/work/${project.slug}`}>
        <img src={project.cover} alt="" />
      </Link>
    </article>
  );
}
