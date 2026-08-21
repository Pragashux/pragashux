import { mentors } from '../data/mentors'
import { Reveal, SectionHeading } from './Reveal'

export function Mentors() {
  return (
    <section id="mentors" className="bg-paper-2/50">
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Mentors"
            title="Learn from people who design for real users."
            copy="Mentor profiles are editable. We only list credentials the academy has confirmed."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <article key={mentor.id} className="overflow-hidden rounded-[32px] border border-line bg-cream">
              <div className="aspect-[4/5] bg-ink">
                {mentor.photo ? (
                  <img src={mentor.photo} alt={mentor.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-cream/40">Portrait to be added</div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold tracking-tight">{mentor.name}</h3>
                <p className="mt-1 text-sm text-muted">{mentor.role}</p>
                <p className="mt-3 text-sm">{mentor.experience}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{mentor.bio}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {mentor.expertise.join(' • ')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
