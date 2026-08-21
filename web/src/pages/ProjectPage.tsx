import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { projects } from '../data/projects'
import { useEnquiry } from '../context/EnquiryContext'

export function ProjectPage() {
  const { projectId } = useParams()
  const project = projects.find((item) => item.id === projectId)
  const { openEnquiry } = useEnquiry()

  if (!project) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24">
        <h1 className="font-display text-5xl">Case study not found</h1>
        <Link to="/#projects" className="mt-6 inline-block text-accent">
          Back to projects
        </Link>
      </section>
    )
  }

  return (
    <article>
      <div className="h-[48vh] min-h-[280px] overflow-hidden bg-ink">
        <img src={project.image} alt="" className="h-full w-full object-cover opacity-90" />
      </div>
      <div className="mx-auto max-w-[860px] px-5 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{project.category}</p>
        <h1 className="font-display mt-3 text-5xl sm:text-7xl">{project.name}</h1>
        <p className="mt-4 text-muted">Student: {project.studentName}</p>
        <p className="mt-8 text-lg leading-relaxed">{project.description}</p>
        <p className="mt-6 text-sm text-muted">
          Full case study narrative, process images and outcomes will be published when the academy shares student work.
          This page holds the structure so real projects can drop in without redesigning the site.
        </p>
        <Button className="mt-10" onClick={() => openEnquiry({ intent: 'counselling' })}>
          Build work like this
        </Button>
      </div>
    </article>
  )
}
