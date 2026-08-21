import { Link } from 'react-router-dom'
import type { Course } from '../data/courses'
import { buttonClass } from './Button'

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group flex h-full flex-col rounded-[32px] border border-line bg-cream p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{course.mode}</p>
      <h3 className="mt-5 font-display text-4xl tracking-tight">{course.name}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{course.summary}</p>
      <p className="mt-6 text-sm font-semibold">Duration · {course.duration}</p>
      <ul className="mt-4 space-y-2 text-sm text-ink-soft">
        {course.outcomes.map((item) => (
          <li key={item}>— {item}</li>
        ))}
      </ul>
      <Link to={`/courses/${course.id}`} className={buttonClass('dark', 'mt-8 w-full group-hover:bg-accent')}>
        View Course
      </Link>
    </article>
  )
}
