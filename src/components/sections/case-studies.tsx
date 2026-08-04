"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { caseStudies } from "@/lib/data";

export function CaseStudiesSection() {
  return (
    <section id="work" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/25 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Case Studies"
            title="Featured work that balances people and platforms"
            description="Selected projects spanning healthcare portals, survey experiences, and enterprise transformation."
          />
        </FadeIn>

        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <FadeIn key={study.id} delay={index * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="overflow-hidden rounded-2xl border border-border/60 bg-background/55 backdrop-blur-md"
              >
                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-primary/25 via-secondary/15 to-accent/20 lg:min-h-full">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(15,23,42,0.25), transparent 40%)",
                      }}
                    />
                    <div className="absolute inset-0 flex items-end p-6">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                          Case Study 0{index + 1}
                        </p>
                        <p className="mt-2 max-w-xs font-display text-xl font-semibold text-white">
                          {study.title}
                        </p>
                      </div>
                    </div>
                    <div className="absolute right-5 top-5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/80 backdrop-blur-md">
                      Image placeholder
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap gap-2">
                      {study.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                      {study.title}
                    </h3>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      {[
                        ["Challenge", study.challenge],
                        ["Process", study.process],
                        ["Solution", study.solution],
                        ["Impact", study.impact],
                      ].map(([label, body]) => (
                        <div key={label}>
                          <p className="text-sm font-semibold text-foreground">
                            {label}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
