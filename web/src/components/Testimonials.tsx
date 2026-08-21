import { testimonials } from '../data/testimonials'
import { Reveal, SectionHeading } from './Reveal'

export function Testimonials() {
  const loop = [...testimonials, ...testimonials]

  return (
    <section id="stories" className="overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Voices"
            title="What our learners say"
            copy="These cards are placeholders. Insert verified quotes, names, photos and roles when learners share them."
          />
        </Reveal>
      </div>
      <div className="mt-12 flex overflow-hidden">
        <div className="marquee flex min-w-max gap-5 pr-5">
          {loop.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="w-[320px] shrink-0 rounded-[28px] border border-line bg-cream p-6 sm:w-[380px]"
            >
              {item.placeholder && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Placeholder</p>
              )}
              <p className="mt-4 font-display text-2xl leading-snug">“{item.quote}”</p>
              <div className="mt-8 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-xs font-semibold text-cream">
                  {item.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{item.name}</span>
                  <span className="block text-xs text-muted">{item.course}</span>
                  {item.currentRole && <span className="block text-xs">{item.currentRole}</span>}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
