import { processSteps } from '../data/content'
import { Reveal, SectionHeading } from './Reveal'

export function DesignProcess() {
  return (
    <section id="process" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="How it works" title="How we turn beginners into designers" />
      </Reveal>
      <div className="mt-12 hidden gap-4 lg:grid lg:grid-cols-8">
        {processSteps.map((step, index) => (
          <Reveal key={step.number} delay={index * 70} className="h-full">
            <article className="flex h-64 flex-col justify-between rounded-[28px] bg-cream p-5 shadow-sm">
              <p className="text-xs font-semibold text-accent">{step.number}</p>
              <h3 className="font-display text-2xl leading-tight">{step.title}</h3>
            </article>
          </Reveal>
        ))}
      </div>
      <ol className="mt-10 grid gap-3 lg:hidden">
        {processSteps.map((step) => (
          <li key={step.number} className="flex items-center gap-4 rounded-3xl bg-cream px-5 py-5">
            <span className="font-display text-2xl text-accent">{step.number}</span>
            <span className="text-lg font-semibold">{step.title}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
