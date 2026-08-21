import { useState } from 'react'
import { curriculum } from '../data/curriculum'
import { Reveal, SectionHeading } from './Reveal'

export function Curriculum() {
  const [openId, setOpenId] = useState<string | null>(curriculum[0]?.number ?? null)

  return (
    <section id="curriculum" className="bg-paper-2/60">
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Curriculum"
            title="From beginner to industry-ready designer."
            copy="Eighteen modules. Expand any step to see what you will practise — not a list of software logos."
          />
        </Reveal>
        <ol className="mt-12 divide-y divide-line overflow-hidden rounded-[32px] border border-line bg-cream">
          {curriculum.map((module) => {
            const open = openId === module.number
            return (
              <li key={module.number}>
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-start justify-between gap-6 px-5 py-5 text-left sm:px-8"
                  onClick={() => setOpenId(open ? null : module.number)}
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-display text-2xl text-accent">{module.number}</span>
                    <span>
                      <span className="block text-lg font-semibold tracking-tight sm:text-xl">{module.title}</span>
                      <span className="mt-1 block text-sm text-muted">{module.summary}</span>
                    </span>
                  </span>
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-lg">
                    {open ? '–' : '+'}
                  </span>
                </button>
                {open && (
                  <ul className="grid gap-2 px-5 pb-6 sm:grid-cols-2 sm:px-8 sm:pl-24">
                    {module.topics.map((topic) => (
                      <li key={topic} className="rounded-2xl bg-paper px-4 py-3 text-sm">
                        {topic}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
