"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { AnimatedCounter } from "@/components/animations/counter";
import { SectionHeading } from "@/components/section-heading";
import { achievements } from "@/lib/data";

export function AchievementsSection() {
  return (
    <section id="achievements" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Impact"
            title="Outcomes that compound across products and teams"
            description="A snapshot of delivery, collaboration, and experience improvements."
          />
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.07}>
              <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background/40 to-secondary/10 p-6 text-center backdrop-blur-md">
                <p className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  <AnimatedCounter
                    value={item.value}
                    suffix={item.suffix}
                    display={"display" in item ? item.display : undefined}
                  />
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
