import { useMemo, useState } from 'react'
import { batches } from '../data/batches'
import { courses } from '../data/courses'
import { locations, type LocationId } from '../data/locations'
import { useEnquiry } from '../context/EnquiryContext'
import { Button } from './Button'
import { Reveal, SectionHeading } from './Reveal'

const filters: { id: LocationId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'chennai', label: 'Chennai' },
  { id: 'coimbatore', label: 'Coimbatore' },
  { id: 'pondicherry', label: 'Pondicherry' },
  { id: 'online', label: 'Online' },
]

export function Batches() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const { openEnquiry } = useEnquiry()

  const visible = useMemo(
    () => batches.filter((batch) => filter === 'all' || batch.locationId === filter),
    [filter],
  )

  return (
    <section id="batches" className="bg-cream/60">
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Calendar"
            title="Upcoming Batches"
            copy="Start dates are placeholders until the academy publishes a live calendar. Filter by city or online."
          />
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Batch location">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === item.id ? 'bg-ink text-cream' : 'bg-white text-ink border border-line'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((batch) => {
            const location = locations.find((item) => item.id === batch.locationId)
            const course = courses.find((item) => item.id === batch.courseId)
            return (
              <article key={batch.id} className="rounded-[28px] border border-line bg-paper p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{location?.city}</p>
                <h3 className="mt-3 text-2xl font-semibold">{course?.name}</h3>
                <p className="mt-2 text-sm text-muted">{batch.schedule} batch</p>
                <p className="mt-5 text-sm">Starts: {batch.startDate}</p>
                <p className="text-sm">{batch.time}</p>
                <p className="mt-2 text-sm text-muted">{batch.availability}</p>
                <Button
                  className="mt-6 w-full"
                  onClick={() =>
                    openEnquiry({
                      intent: 'batch',
                      location: batch.locationId,
                      course: batch.courseId,
                      batch: `${batch.schedule} ${batch.startDate}`,
                    })
                  }
                >
                  Reserve Your Seat
                </Button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
