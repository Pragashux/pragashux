import { Button } from '../components/Button'
import { useEnquiry } from '../context/EnquiryContext'

export function AboutPage() {
  const { openEnquiry } = useEnquiry()

  return (
    <article className="mx-auto max-w-[860px] px-5 py-20 lg:py-28">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">About</p>
      <h1 className="font-display mt-4 text-5xl leading-tight sm:text-7xl">A practical academy for people who want to design for real users.</h1>
      <p className="mt-8 text-lg leading-relaxed text-muted">
        Snailtechs Academy is an industry-focused design school for students, freshers, working professionals and career
        switchers. We teach UX/UI, product design, research, design systems, Figma, Framer and AI-powered workflows —
        through projects, mentorship and critique.
      </p>
      <p className="mt-6 leading-relaxed">
        The name is a reminder: thoughtful work is not rushed work. We still move. We just refuse to skip the thinking.
      </p>
      <p className="mt-6 leading-relaxed text-muted">
        Campuses in Chennai, Coimbatore and Pondicherry, plus live online learning. Tagline: Design your future. Build
        what matters.
      </p>
      <Button className="mt-10" onClick={() => openEnquiry({ intent: 'counselling' })}>
        Book Free Counselling
      </Button>
    </article>
  )
}
