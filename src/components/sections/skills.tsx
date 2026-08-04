"use client";

import { motion } from "framer-motion";
import { Boxes, Compass, Layers3 } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { skillCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

const icons = {
  "UX Design": Compass,
  "UI Design": Layers3,
  "Product Thinking": Boxes,
};

const accentStyles = {
  primary: "from-primary/20 via-primary/5 to-transparent border-primary/20",
  secondary:
    "from-secondary/20 via-secondary/5 to-transparent border-secondary/20",
  accent: "from-accent/20 via-accent/5 to-transparent border-accent/20",
};

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Skills"
            title="Capabilities that connect research, craft, and strategy"
            description="A modern toolkit for discovering opportunities and shipping experiences that scale."
          />
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => {
            const Icon = icons[category.title];
            return (
              <FadeIn key={category.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className={cn(
                    "group h-full rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-md sm:p-7",
                    accentStyles[category.accent]
                  )}
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-background/60 text-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {category.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {category.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <span className="h-1 w-1 rounded-full bg-foreground/40" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
