import { useState } from 'react'
import { navLinks } from '../data/site'
import { useEnquiry } from '../context/EnquiryContext'
import { Button } from './Button'
import { Logo } from './Logo'

export function Navbar() {
  const { openEnquiry } = useEnquiry()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold tracking-tight text-ink-soft/80 transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button className="hidden sm:inline-flex" onClick={() => openEnquiry({ intent: 'counselling' })}>
            Book Free Counselling
          </Button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="absolute h-px w-px overflow-hidden">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={`h-0.5 w-5 bg-ink transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 bg-ink transition ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 bg-ink transition ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div id="mobile-nav" className="border-t border-line bg-cream px-5 py-6 xl:hidden">
          <nav className="grid gap-3" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl px-3 py-3 text-lg font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Button className="mt-4 w-full" onClick={() => { setMenuOpen(false); openEnquiry({ intent: 'counselling' }) }}>
            Book Free Counselling
          </Button>
        </div>
      )}
    </header>
  )
}
