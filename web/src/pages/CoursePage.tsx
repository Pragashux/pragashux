import { Link, useParams } from 'react-router-dom'
import { Button, buttonClass } from '../components/Button'
import { courses } from '../data/courses'
import { curriculum } from '../data/curriculum'
import { useEnquiry } from '../context/EnquiryContext'

export function CoursePage() {
  const { courseId } = useParams()
  const course = courses.find((item) => item.id === courseId)
  const { openEnquiry } = useEnquiry()

  if (!course) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24">
        <h1 className="font-display text-5xl">Course not found</h1>
        <Link to="/" className="mt-6 inline-block text-accent">
          Back home
        </Link>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-[960px] px-5 py-16 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{course.mode}</p>
      <h1 className="font-display mt-4 text-5xl leading-tight sm:text-7xl">{course.name}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{course.summary}</p>
      <p className="mt-4 font-semibold">Duration · {course.duration}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => openEnquiry({ intent: 'course', course: course.id })}>
          Book Free Counselling
        </Button>
        <a href="/#curriculum" className={buttonClass('secondary')}>
          See curriculum
        </a>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {course.outcomes.map((item) => (
          <li key={item} className="rounded-3xl bg-cream p-5 text-sm">
            {item}
          </li>
        ))}
      </ul>
      <h2 className="mt-16 font-display text-4xl">Modules you will cover</h2>
      <ol className="mt-6 grid gap-3">
        {curriculum.map((module) => (
          <li key={module.number} className="rounded-2xl border border-line px-5 py-4">
            <span className="text-accent">{module.number}</span> · {module.title}
          </li>
        ))}
      </ol>
    </article>
  )
}
