import { processJourney } from '../data/curriculum'
import { whyFeatures } from '../data/content'
import { Reveal, SectionHeading } from './Reveal'

export function WhySnailtechs() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <SectionHeading
            invert
            eyebrow="Why Snailtechs"
            title={
              <>
                We don&apos;t teach tools.
                <br />
                We teach design thinking.
              </>
            }
            copy="Students should not simply learn Figma and create attractive screens. They should learn to see problems, talk to people, make decisions and defend them."
          />
        </Reveal>

        <div className="mt-12 overflow-x-auto pb-2">
          <ol className="flex min-w-max items-center gap-0">
            {processJourney.map((step, index) => (
              <li key={step} className="flex items-center">
                <span className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold">{step}</span>
                {index < processJourney.length - 1 && (
                  <span className="mx-2 h-px w-8 bg-accent" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 60}>
              <article className="h-full rounded-[28px] border border-white/10 bg-white/5 p-7 transition hover:bg-white/10">
                <p className="text-xs font-semibold text-accent-soft">0{index + 1}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{feature.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
