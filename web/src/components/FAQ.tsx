import { useState } from 'react'
import { faq } from '../data/faq'
import { Reveal, SectionHeading } from './Reveal'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="FAQ" title="Questions, answered plainly." />
      </Reveal>
      <div className="mt-10 divide-y divide-line rounded-[32px] border border-line bg-cream">
        {faq.map((item, index) => {
          const isOpen = open === index
          return (
            <div key={item.question}>
              <button
                type="button"
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8"
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className="text-base font-semibold sm:text-lg">{item.question}</span>
                <span className="text-2xl text-accent">{isOpen ? '–' : '+'}</span>
              </button>
              {isOpen && <p className="px-6 pb-6 text-sm leading-relaxed text-muted sm:px-8">{item.answer}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
