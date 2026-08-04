"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/lib/data";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Experience"
            title="Building clarity inside complex product environments"
            description="A timeline of impact across strategy, design systems, and healthcare modernization."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-secondary to-accent/60 sm:left-1/2 sm:-translate-x-px" />

            <article className="relative pl-12 sm:pl-0">
              <div className="absolute left-2.5 top-8 h-3 w-3 rounded-full border-2 border-background bg-primary shadow-[0_0_0_4px_rgba(108,99,255,0.2)] sm:left-1/2 sm:-translate-x-1/2" />

              <div className="rounded-2xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-md sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="border-primary/30 bg-primary/10 text-primary">
                    {experience.period}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {experience.company}
                  </p>
                </div>

                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                  {experience.role}
                </h3>

                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Responsibilities
                    </p>
                    <ul className="mt-3 space-y-2">
                      {experience.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Highlights
                    </p>
                    <ul className="mt-3 space-y-2">
                      {experience.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
