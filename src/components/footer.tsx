import {
  BehanceIcon,
  DribbbleIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/social-icons";
import { navLinks, siteConfig } from "@/lib/data";

const socials = [
  { href: siteConfig.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  { href: siteConfig.behance, label: "Behance", icon: BehanceIcon },
  { href: siteConfig.dribbble, label: "Dribbble", icon: DribbbleIcon },
  { href: siteConfig.github, label: "GitHub", icon: GitHubIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">
            {siteConfig.name}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Senior UX Designer crafting human-centered digital products across
            healthcare, enterprise platforms, and digital transformation.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:justify-self-end">
          <div>
            <p className="text-sm font-semibold text-foreground">Navigate</p>
            <ul className="mt-3 space-y-2">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">More</p>
            <ul className="mt-3 space-y-2">
              {navLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#home"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Back to top
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Designed with intention. Built for clarity.</p>
        </div>
      </div>
    </footer>
  );
}
