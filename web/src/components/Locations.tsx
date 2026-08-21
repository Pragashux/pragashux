import { useState } from 'react'
import { locations, type AcademyLocation } from '../data/locations'
import { useEnquiry } from '../context/EnquiryContext'
import { Button } from './Button'
import { Reveal, SectionHeading } from './Reveal'

export function Locations() {
  const [active, setActive] = useState<AcademyLocation | null>(null)
  const { openEnquiry } = useEnquiry()

  return (
    <section id="locations" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Campuses"
          title={
            <>
              Learn with Snailtechs,
              <br />
              wherever you are.
            </>
          }
        />
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {locations.map((location, index) => (
          <Reveal key={location.id} delay={index * 80}>
            <button
              type="button"
              onClick={() => setActive(location)}
              className="group flex h-full w-full flex-col rounded-[28px] border border-line bg-cream p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-xl"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">{location.kind}</span>
              <span className="font-display mt-6 text-4xl tracking-tight">{location.city}</span>
              <span className="mt-4 text-sm leading-relaxed text-muted">{location.blurb}</span>
              <span className="mt-8 text-sm font-semibold text-ink">View batch details →</span>
            </button>
          </Reveal>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close location details" onClick={() => setActive(null)} />
          <div role="dialog" aria-modal="true" className="relative z-10 m-0 w-full max-w-lg rounded-t-3xl bg-cream p-8 sm:m-6 sm:rounded-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{active.kind}</p>
            <h3 className="font-display mt-2 text-4xl">{active.city}</h3>
            <dl className="mt-8 grid gap-5 text-sm">
              <div>
                <dt className="text-muted">Upcoming batch</dt>
                <dd className="mt-1 font-semibold">{active.upcomingBatch}</dd>
              </div>
              <div>
                <dt className="text-muted">Weekday / weekend</dt>
                <dd className="mt-1 font-semibold">{active.schedule}</dd>
              </div>
              <div>
                <dt className="text-muted">Course availability</dt>
                <dd className="mt-1 font-semibold">{active.courseAvailability}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  setActive(null)
                  openEnquiry({ intent: 'location', location: active.id })
                }}
              >
                Book Free Counselling
              </Button>
              <Button variant="secondary" onClick={() => setActive(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
