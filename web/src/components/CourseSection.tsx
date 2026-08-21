import { Link } from 'react-router-dom'
import { featuredCourses, courses } from '../data/courses'
import { CourseCard } from './CourseCard'
import { Reveal, SectionHeading } from './Reveal'

export function CourseSection() {
  const rest = courses.filter((course) => !course.featured)

  return (
    <section id="courses" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="Programmes" title="Choose your design path." />
      </Reveal>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {featuredCourses.map((course, index) => (
          <Reveal key={course.id} delay={index * 80}>
            <CourseCard course={course} />
          </Reveal>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {rest.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="rounded-3xl border border-line bg-white px-5 py-5 transition hover:border-ink"
          >
            <p className="text-sm font-semibold">{course.name}</p>
            <p className="mt-2 text-xs text-muted">{course.duration}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
