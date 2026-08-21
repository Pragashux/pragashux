import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { Reveal, SectionHeading } from './Reveal'

export function Projects() {
  return (
    <section id="projects" className="overflow-hidden bg-ink text-cream">
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <SectionHeading
            invert
            eyebrow="Student work"
            title={
              <>
                Don&apos;t take our word for it.
                <br />
                See what our students build.
              </>
            }
            copy="These briefs show the kind of product stories learners work through. Student names will be added as case studies are published."
          />
        </Reveal>
      </div>
      <div className="flex gap-5 overflow-x-auto px-5 pb-16 lg:px-10">
        {projects.map((project) => (
          <article
            key={project.id}
            className={`group relative min-w-[280px] overflow-hidden rounded-[32px] ${project.layout === 'wide' ? 'sm:min-w-[560px]' : 'sm:min-w-[380px]'}`}
          >
            <img
              src={project.image}
              alt={`${project.name} — ${project.category}`}
              className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-soft">{project.category}</p>
              <h3 className="font-display mt-2 text-4xl">{project.name}</h3>
              <p className="mt-2 text-sm text-cream/75">{project.description}</p>
              <p className="mt-3 text-xs text-cream/55">By {project.studentName}</p>
              <Link
                to={`/projects/${project.id}`}
                className="mt-5 inline-flex text-sm font-semibold underline decoration-accent underline-offset-4"
              >
                View Case Study
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
