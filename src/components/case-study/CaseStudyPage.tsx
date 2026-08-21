import Link from "next/link";
import { CaseStudyHero, ProjectMeta } from "@/components/case-study/CaseStudyHero";
import { CaseStudyProgress } from "@/components/case-study/CaseStudyProgress";
import { ImageGallery } from "@/components/case-study/ImageGallery";
import { ContactCTA } from "@/components/home/ContactCTA";
import { relatedProjects, type Project } from "@/content/site";

function mark(value: string) {
  if (value.includes("[CONTENT NEEDED]")) {
    return <span className="placeholder">{value}</span>;
  }
  return value;
}

export function CaseStudyPage({ project }: { project: Project }) {
  const related = relatedProjects(project.slug);

  return (
    <>
      <CaseStudyProgress />
      <CaseStudyHero project={project} />
      <ProjectMeta project={project} />

      <section className="cs-section wrap">
        <p className="index">01 — The problem</p>
        <h2 className="display">{project.problem.heading}</h2>
        <p>{project.problem.body}</p>
        <ul>
          {project.problem.questions.map((item) => (
            <li key={item}>{mark(item)}</li>
          ))}
        </ul>
      </section>

      <section className="cs-section wrap">
        <p className="index">02 — Understanding the user</p>
        <h2 className="display">What the available evidence shows.</h2>
        <p>{project.understanding.body}</p>
        <ul>
          {project.understanding.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="cs-section wrap">
        <p className="index">03 — Defining the problem</p>
        <p className="statement">{mark(project.definition.statement)}</p>
        <p>{project.definition.body}</p>
      </section>

      <section className="cs-section wrap">
        <p className="index">04 — Exploration</p>
        <h2 className="display">The story behind the screens.</h2>
        <p>{project.exploration.body}</p>
        <ul>
          {project.exploration.notes.map((item) => (
            <li key={item}>{mark(item)}</li>
          ))}
        </ul>
      </section>

      <section className="cs-section wrap">
        <p className="index">05 — Design system</p>
        <h2 className="display">Consistency is a usability feature.</h2>
        <p>{project.system.body}</p>
        <ul className="chip-row">
          {project.system.pieces.map((item) => (
            <li key={item}>{mark(item)}</li>
          ))}
        </ul>
      </section>

      <section className="cs-section wrap">
        <p className="index">06 — Final experience</p>
        <h2 className="display">The designed product.</h2>
        <p>{project.experience.body}</p>
        <ImageGallery images={project.images} />
        <p>
          Full project on{" "}
          <a href={project.behance} target="_blank" rel="noreferrer">
            Behance →
          </a>
        </p>
      </section>

      <section className="cs-section wrap">
        <p className="index">07 — What changed</p>
        <h2 className="display">Outcome without invented numbers.</h2>
        <p>{project.outcome.body}</p>
        <ul>
          {project.outcome.qualitative.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="cs-section wrap">
        <p className="index">08 — What I learned</p>
        <h2 className="display">A note to myself after the work.</h2>
        <p className="statement" style={{ maxWidth: "22ch", fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}>
          {mark(project.learned)}
        </p>
        <div className="needs">
          <h3>Easy to replace later</h3>
          <p>
            Update this case study in <code>src/content/site.ts</code> — title, images, problem, process, outcome, tools — without rewriting the UI.
          </p>
          <ul>
            {project.contentNeeded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cs-section wrap">
        <p className="kicker">Next projects</p>
        <h2 className="display">Continue the story.</h2>
        <div className="next-projects">
          {related.map((item) => (
            <Link key={item.slug} href={`/work/${item.slug}`} className="mini-card">
              <img src={item.cover} alt="" />
              <h3>{item.title}</h3>
              <p>{item.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
