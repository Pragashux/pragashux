import { archiveProjects, featuredProjects, moreProjects } from "@/content/site";
import { ProjectCard } from "@/components/home/ProjectCard";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SelectedWork() {
  const featured = featuredProjects();

  return (
    <section className="work wrap" id="work">
      <SectionHeading
        kicker="Selected work"
        title="A few problems I've had the opportunity to solve."
      />
      <div>
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <ProjectGrid heading="More work" projects={moreProjects()} />
      <ProjectGrid heading="Archive" projects={archiveProjects()} />
    </section>
  );
}
