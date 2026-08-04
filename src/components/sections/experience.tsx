"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { experiences } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Experience"
            title="A career shaped across consulting, product, and enterprise UX"
            description="From freelance consulting to Senior Technical Consultant UX at Perficient — building clarity inside complex digital environments."
          />
        </FadeIn>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-3 bottom-3 w-px bg-gradient-to-b from-primary via-secondary to-accent/50 sm:left-[1.15rem]" />

          <div className="space-y-6">
            {experiences.map((job, index) => (
              <FadeIn key={`${job.company}-${job.role}`} delay={index * 0.06}>
                <article className="relative pl-12">
                  <div
                    className={cn(
                      "absolute left-2.5 top-8 h-3 w-3 rounded-full border-2 border-background",
                      job.current
                        ? "bg-primary shadow-[0_0_0_4px_rgba(108,99,255,0.22)]"
                        : "bg-secondary/80"
                    )}
                  />

                  <div className="rounded-2xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-md sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={
                          job.current
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : undefined
                        }
                      >
                        {job.period}
                      </Badge>
                      {job.current && (
                        <Badge className="border-secondary/30 bg-secondary/10 text-secondary">
                          Current
                        </Badge>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {job.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary sm:text-base">
                      {job.company}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.location}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {job.summary}
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Focus
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {job.responsibilities.map((item) => (
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
                        <ul className="mt-2 space-y-1.5">
                          {job.highlights.map((item) => (
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
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
