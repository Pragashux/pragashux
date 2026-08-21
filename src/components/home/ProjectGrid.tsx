import Link from "next/link";
import type { Project } from "@/content/site";

export function ProjectGrid({
  projects,
  heading,
}: {
  projects: Project[];
  heading: string;
}) {
  if (!projects.length) return null;

  return (
    <div style={{ marginTop: 72 }}>
      <p className="kicker">{heading}</p>
      <div className={heading.toLowerCase().includes("archive") ? "archive-grid" : "more-grid"}>
        {projects.map((project) => (
          <Link className="mini-card" href={`/work/${project.slug}`} key={project.slug}>
            <img src={project.cover} alt="" />
            <h3>{project.title}</h3>
            <p>
              {project.industry} · {project.productType}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
