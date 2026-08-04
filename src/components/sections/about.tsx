"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";

const pillars = [
  "Design Thinking",
  "User Research",
  "Information Architecture",
  "Interaction Design",
  "Design Systems",
  "Accessibility",
  "Usability Testing",
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="About"
            title="A journey shaped by people, systems, and outcomes"
            description="I design experiences that help complex products feel clear, trustworthy, and useful."
            align="left"
          />
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <FadeIn delay={0.1}>
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                My path into UX began with a simple question: how do we make
                digital products feel more human? That curiosity grew into a
                career focused on healthcare platforms, enterprise applications,
                and digital transformation programs where clarity and trust
                matter most.
              </p>
              <p>
                Across these domains, I&apos;ve learned that great UX is rarely
                just a beautiful interface. It is the result of listening
                closely, framing the right problems, and aligning product,
                design, and engineering around shared outcomes.
              </p>
              <p>
                Today, I partner with cross-functional teams to modernize
                experiences—translating research into strategy, strategy into
                systems, and systems into interactions people can rely on.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-border/60 bg-background/50 p-6 backdrop-blur-md sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                Focus areas
              </p>
              <ul className="mt-5 space-y-3">
                {pillars.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-muted-foreground sm:text-base"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
