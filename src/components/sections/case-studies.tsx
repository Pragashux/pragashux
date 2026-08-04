"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { caseStudies, featuredProjects, siteConfig } from "@/lib/data";

export function CaseStudiesSection() {
  return (
    <section id="work" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/25 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Case Studies"
            title="Selected work from my Behance portfolio"
            description="Featured projects across ecommerce PIM, edtech LMS, UI redesign, and design systems — from pragashinnovates on Behance."
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
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative min-h-[240px] overflow-hidden bg-muted lg:min-h-full"
                  >
                    <Image
                      src={study.image}
                      alt={`${study.title} cover`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                        Case Study 0{index + 1}
                      </p>
                      <p className="mt-2 max-w-sm font-display text-xl font-semibold text-white">
                        {study.title}
                      </p>
                    </div>
                  </a>

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

                    <Button asChild variant="outline" className="mt-6">
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Behance
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-16">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
                  More work
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Additional projects
                </h3>
              </div>
              <Button asChild variant="ghost">
                <a
                  href={siteConfig.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See full Behance profile
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <motion.a
                  key={project.title}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -5 }}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-background/55 backdrop-blur-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {project.category}
                    </p>
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <h4 className="font-display text-lg font-semibold tracking-tight">
                        {project.title}
                      </h4>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
