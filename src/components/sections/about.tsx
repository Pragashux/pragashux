"use client";

import Image from "next/image";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/data";

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
            description="Passionate about crafting seamless, user-centered digital experiences that turn complex problems into intuitive design."
            align="left"
          />
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <FadeIn delay={0.08}>
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-border/60 bg-muted/30 shadow-lg">
              <Image
                src={siteConfig.image}
                alt={`${siteConfig.name} portrait`}
                fill
                sizes="(max-width: 768px) 90vw, 360px"
                className="object-cover object-top"
              />
            </div>
          </FadeIn>

          <div className="space-y-8">
            <FadeIn delay={0.12}>
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  I am a passionate UX Designer dedicated to crafting seamless,
                  user-centered digital experiences. With a strong foundation in
                  user research, wireframing, prototyping, and usability
                  testing, I turn complex problems into intuitive designs that
                  enhance user satisfaction.
                </p>
                <p>
                  Over 12+ years, my path has spanned freelance consulting,
                  product design, and enterprise platforms — including work
                  across healthcare, edtech, ecommerce, logistics, and digital
                  transformation. Today, as Senior Technical Consultant UX at{" "}
                  <span className="font-medium text-foreground">Perficient</span>
                  {" "}in Chennai, I partner with cross-functional teams to ship
                  experiences that balance business goals and user needs.
                </p>
                <p>
                  I prioritize research and data-driven decisions, own the
                  end-to-end design process from ideation to implementation, and
                  collaborate closely with developers, product managers, and
                  stakeholders. I am also a Google UX Design Professional
                  Certificate graduate.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.18}>
              <div className="rounded-2xl border border-border/60 bg-background/50 p-6 backdrop-blur-md sm:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                  Focus areas
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
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
      </div>
    </section>
  );
}
