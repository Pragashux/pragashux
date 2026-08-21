import { workshopTopics } from '../data/content'
import { useEnquiry } from '../context/EnquiryContext'
import { Button } from './Button'

export function Workshop() {
  const { openEnquiry } = useEnquiry()

  return (
    <section id="workshop" className="mx-auto max-w-[1440px] px-5 py-10 lg:px-10">
      <div className="overflow-hidden rounded-[36px] bg-accent px-6 py-12 text-white sm:px-12 lg:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Free orientation</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight sm:text-6xl">
          Not sure if UX/UI is for you?
        </h2>
        <p className="mt-4 max-w-xl text-white/85">Join a free design orientation session.</p>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {workshopTopics.map((topic) => (
            <li key={topic} className="rounded-2xl bg-black/10 px-4 py-3 text-sm">
              {topic}
            </li>
          ))}
        </ul>
        <Button variant="dark" className="mt-8 bg-ink" onClick={() => openEnquiry({ intent: 'workshop' })}>
          Book Free Session
        </Button>
      </div>
    </section>
  )
}
