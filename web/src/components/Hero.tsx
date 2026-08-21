import type { ReactNode } from 'react'
import { stats } from '../data/content'
import { useEnquiry } from '../context/EnquiryContext'
import { Button, buttonClass } from './Button'

function DeviceFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-white/10 bg-[#1a1916] shadow-2xl ${className}`}>
      {children}
    </div>
  )
}

export function Hero() {
  const { openEnquiry } = useEnquiry()

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Snailtechs Academy</p>
          <h1 className="font-display mt-5 text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Don&apos;t just learn design.
            <span className="mt-2 block italic text-ink-soft">Learn to think like a designer.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Master UX/UI, Product Design and AI-powered design workflows through hands-on projects, expert mentorship
            and real-world problem solving.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => openEnquiry({ intent: 'counselling' })}>Book a Free Counselling Session</Button>
            <a href="/#courses" className={buttonClass('secondary', 'w-full sm:w-auto')}>
              Explore Courses
            </a>
          </div>
        </div>

        <div className="relative mx-auto h-[460px] w-full max-w-[560px] lg:h-[540px]">
          <div className="float-slow absolute left-0 top-8 w-40 rounded-3xl bg-white p-3 shadow-xl sm:w-48">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Research notes</p>
            <ul className="mt-3 space-y-2 text-xs text-ink-soft">
              <li className="rounded-xl bg-paper-2 px-3 py-2">Users skip onboarding after step 2</li>
              <li className="rounded-xl bg-accent-soft px-3 py-2">Need clearer empty states</li>
              <li className="rounded-xl bg-paper-2 px-3 py-2">Trust lives in receipts, not banners</li>
            </ul>
          </div>
          <DeviceFrame className="float absolute right-4 top-0 w-40 sm:w-48">
            <div className="bg-[#2b4a44] p-4 text-cream">
              <p className="text-[10px] uppercase tracking-widest opacity-70">Mobile UI</p>
              <p className="mt-6 font-display text-3xl">Balance</p>
              <p className="mt-1 text-sm">₹48,200</p>
              <div className="mt-6 space-y-2">
                <div className="h-8 rounded-xl bg-white/10" />
                <div className="h-8 rounded-xl bg-white/10" />
                <div className="h-8 rounded-xl bg-accent/80" />
              </div>
            </div>
          </DeviceFrame>
          <div className="float absolute bottom-16 left-6 w-56 rounded-3xl bg-[#111] p-4 text-cream shadow-2xl sm:w-64">
            <p className="text-[10px] uppercase tracking-widest text-white/50">Wireframe</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-white/10" />
              ))}
            </div>
          </div>
          <div className="float-slow absolute bottom-4 right-0 w-52 rounded-3xl border border-line bg-white p-4 shadow-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Design system</p>
            <div className="mt-3 flex gap-2">
              {['#121110', '#d4572a', '#1f5c52', '#f4efe6'].map((color) => (
                <span key={color} className="h-8 w-8 rounded-full border border-line" style={{ background: color }} />
              ))}
            </div>
            <div className="mt-3 h-9 rounded-full bg-ink text-center text-xs leading-9 text-cream">Button / Primary</div>
          </div>
          <div className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/3 overflow-hidden rounded-3xl shadow-2xl sm:w-52">
            <img src="/images/studio-desk.png" alt="Layered design work: wireframes, notes and interface studies" className="h-56 w-full object-cover sm:h-64" />
          </div>
        </div>
      </div>
      <Stats />
    </section>
  )
}

export function Stats() {
  return (
    <div className="border-y border-line bg-cream/70">
      <ul className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label} className="bg-paper px-6 py-8">
            <p className="font-display text-4xl tracking-tight sm:text-5xl">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-muted">{stat.label}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
