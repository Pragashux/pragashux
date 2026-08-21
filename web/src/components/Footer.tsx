import { footerNav, site } from '../data/site'
import { locations } from '../data/locations'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 lg:grid-cols-4 lg:px-10">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">{site.footerLine}</p>
          <p className="mt-2 text-sm italic text-ink-soft">{site.tagline}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Navigation</p>
          <ul className="mt-4 grid gap-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm hover:text-accent">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Locations</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {locations.map((location) => (
              <li key={location.id}>{location.city}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Contact</p>
          <p className="mt-4 text-sm">
            Phone:{' '}
            <a className="font-semibold" href={site.phoneHref}>
              {site.phone}
            </a>
          </p>
          <p className="mt-2 text-sm">
            Email:{' '}
            <a className="font-semibold" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <a href={site.social.instagram}>Instagram</a>
            <a href={site.social.linkedin}>LinkedIn</a>
            <a href={site.social.youtube}>YouTube</a>
            <a href={site.social.behance}>Behance</a>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© {site.copyrightYear} Snailtechs Academy. All rights reserved.</p>
          <p className="flex gap-4">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms & Conditions</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
