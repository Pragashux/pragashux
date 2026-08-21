import { computeOneTimeTotal, emiPlans, formatMoney, pricingConfig } from '../data/pricing'
import { useEnquiry } from '../context/EnquiryContext'
import { Button } from './Button'
import { Reveal, SectionHeading } from './Reveal'

export function Pricing() {
  const { openEnquiry } = useEnquiry()
  const total = computeOneTimeTotal()

  return (
    <section id="fees" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Fees"
          title="Choose the plan that works for you."
          copy="Amounts are editable in one configuration file. Placeholder figures stay visible until the academy confirms live fees."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[32px] bg-ink p-8 text-cream sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-soft">One-time payment</p>
          <h3 className="font-display mt-4 text-4xl">Pay once. Start building.</h3>
          <dl className="mt-8 space-y-4 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <dt>Course fee</dt>
              <dd>{formatMoney(pricingConfig.COURSE_FEE)}</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <dt>GST</dt>
              <dd>{formatMoney(pricingConfig.GST)}</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <dt>Discount</dt>
              <dd>{formatMoney(pricingConfig.ONE_TIME_DISCOUNT)}</dd>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <dt>Final price</dt>
              <dd>{formatMoney(total)}</dd>
            </div>
          </dl>
          <Button className="mt-8" onClick={() => openEnquiry({ intent: 'enroll' })}>
            Enroll Now
          </Button>
        </article>
        <article className="rounded-[32px] border border-line bg-cream p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">EMI</p>
          <h3 className="font-display mt-4 text-4xl">Monthly payment</h3>
          <ul className="mt-8 space-y-3">
            {emiPlans.map((plan) => (
              <li key={plan.id} className="flex items-center justify-between rounded-2xl bg-paper px-4 py-4">
                <span className="font-semibold">{plan.label}</span>
                <span>{formatMoney(pricingConfig[plan.key])}/mo</span>
              </li>
            ))}
          </ul>
          <Button variant="dark" className="mt-8" onClick={() => openEnquiry({ intent: 'counselling' })}>
            Talk to Counsellor
          </Button>
        </article>
      </div>
      <p className="mt-6 text-sm text-muted">{pricingConfig.note}</p>
    </section>
  )
}
