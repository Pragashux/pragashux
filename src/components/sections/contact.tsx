"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BehanceIcon,
  DribbbleIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/social-icons";
import { siteConfig } from "@/lib/data";

const socials = [
  { href: siteConfig.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  { href: siteConfig.behance, label: "Behance", icon: BehanceIcon },
  { href: siteConfig.dribbble, label: "Dribbble", icon: DribbbleIcon },
  { href: siteConfig.github, label: "GitHub", icon: GitHubIcon },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Contact"
            title="Let’s design something meaningful together"
            description="Open to collaborations, consulting engagements, and conversations about human-centered product design."
          />
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <FadeIn delay={0.08}>
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border/60 bg-background/55 p-6 backdrop-blur-md sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project, challenge, or opportunity..."
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg">
                  Send Message
                  <Send className="h-4 w-4" />
                </Button>
                {submitted && (
                  <p className="text-sm text-secondary">
                    Thanks — your message is ready. Connect via LinkedIn to
                    continue the conversation.
                  </p>
                )}
              </div>
            </form>
          </FadeIn>

          <FadeIn delay={0.16}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 via-background/40 to-secondary/15 p-6 backdrop-blur-md sm:p-8">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  Prefer a direct channel?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Reach out on LinkedIn or explore selected work across design
                  communities. Always happy to discuss UX strategy, healthcare
                  experiences, and product transformation.
                </p>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  {siteConfig.linkedin.replace("https://", "")}
                </a>
              </div>

              <div className="mt-10">
                <p className="text-sm font-semibold text-foreground">
                  Social links
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socials.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                    >
                      <Icon />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
