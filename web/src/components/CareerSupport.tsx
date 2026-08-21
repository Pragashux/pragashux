import { careerPillars } from '../data/content'
import { useEnquiry } from '../context/EnquiryContext'
import { Button } from './Button'
import { Reveal, SectionHeading } from './Reveal'

export function CareerSupport() {
  const { openEnquiry } = useEnquiry()

  return (
    <section id="career" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid items-end gap-10 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Career support"
            title="Your portfolio should open doors."
            copy="We help you move beyond course completion and build the confidence, portfolio and communication skills required to enter the design industry."
          />
        </Reveal>
        <Reveal>
          <p className="max-w-md text-sm text-muted">
            We offer structured career support — not guaranteed placement, salary claims or hiring partnerships we have
            not verified.
          </p>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {careerPillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 50}>
            <article className="h-full rounded-[28px] border border-line bg-cream p-6">
              <p className="font-display text-5xl text-accent/40">0{index + 1}</p>
              <h3 className="mt-6 text-xl font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted">{pillar.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Button className="mt-10" onClick={() => openEnquiry({ intent: 'counselling' })}>
        Start Your Design Journey
      </Button>
    </section>
  )
}
