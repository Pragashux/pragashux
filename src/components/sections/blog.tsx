"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/data";

export function BlogSection() {
  return (
    <section id="insights" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Insights"
            title="Thought leadership for modern UX practice"
            description="Short perspectives on healthcare UX, systems thinking, accessibility, and AI."
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2">
          {blogPosts.map((post, index) => (
            <FadeIn key={post.title} delay={index * 0.07}>
              <motion.a
                href="#contact"
                whileHover={{ y: -5 }}
                className="group flex h-full flex-col rounded-2xl border border-border/60 bg-background/55 p-6 backdrop-blur-md transition-colors hover:border-primary/35"
              >
                <div className="flex items-start justify-between gap-4">
                  <Badge>{post.category}</Badge>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </motion.a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
