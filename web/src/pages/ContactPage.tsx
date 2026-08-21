import { Button } from '../components/Button'
import { site } from '../data/site'
import { useEnquiry } from '../context/EnquiryContext'

export function ContactPage() {
  const { openEnquiry } = useEnquiry()

  return (
    <article className="mx-auto max-w-[860px] px-5 py-20 lg:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Contact</p>
      <h1 className="font-display mt-4 text-5xl sm:text-7xl">Talk to the academy.</h1>
      <p className="mt-6 text-muted">
        Phone:{' '}
        <a className="font-semibold text-ink" href={site.phoneHref}>
          {site.phone}
        </a>
      </p>
      <p className="mt-2 text-muted">
        Email:{' '}
        <a className="font-semibold text-ink" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </p>
      <Button className="mt-10" onClick={() => openEnquiry({ intent: 'counselling' })}>
        Book Free Counselling
      </Button>
    </article>
  )
}
