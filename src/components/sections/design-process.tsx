"use client";

import {
  Compass,
  Focus,
  Lightbulb,
  PenTool,
  FlaskConical,
  Rocket,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { processSteps } from "@/lib/data";

const icons = [Compass, Focus, Lightbulb, PenTool, FlaskConical, Rocket];

export function DesignProcessSection() {
  return (
    <section id="process" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Design Process"
            title="A clear path from discovery to delivery"
            description="An elegant, repeatable process that keeps teams aligned and users at the center."
          />
        </FadeIn>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {processSteps.map((step, index) => {
              const Icon = icons[index];
              return (
                <FadeIn key={step.title} delay={index * 0.06}>
                  <div className="group relative h-full rounded-2xl border border-border/60 bg-background/50 p-5 text-center backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/30">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      0{index + 1}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                    {index < processSteps.length - 1 && (
                      <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-muted-foreground/50 lg:block">
                        →
                      </span>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
