import { useEnquiry } from '../context/EnquiryContext'
import { Button, buttonClass } from './Button'

export function CTA() {
  const { openEnquiry } = useEnquiry()

  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="grid-bg h-full mix-blend-overlay invert" />
        <div className="absolute left-10 top-16 h-40 w-28 rounded-2xl border border-white/15" />
        <div className="absolute right-16 top-24 h-52 w-36 rounded-[28px] border border-white/10" />
        <div className="absolute bottom-10 left-1/3 h-24 w-48 rounded-2xl bg-white/5" />
      </div>
      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center lg:py-32">
        <h2 className="font-display text-5xl leading-[0.95] sm:text-7xl">
          Your design career starts with one decision.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-cream/70">Stop collecting tutorials. Start building real design skills.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => openEnquiry({ intent: 'counselling' })}>Book Free Counselling</Button>
          <a href="/#courses" className={buttonClass('secondary', 'border-white/20 text-cream hover:bg-cream hover:text-ink')}>
            Explore Courses
          </a>
        </div>
      </div>
    </section>
  )
}
