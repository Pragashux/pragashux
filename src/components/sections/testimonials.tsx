"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { testimonials } from "@/lib/data";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/25 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by product and engineering partners"
            description="Placeholder quotes reflecting collaborative impact across complex digital initiatives."
          />
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <FadeIn key={item.name} delay={index * 0.08}>
              <motion.blockquote
                whileHover={{ y: -6 }}
                className="flex h-full flex-col rounded-2xl border border-border/60 bg-background/55 p-6 backdrop-blur-md"
              >
                <Quote className="h-5 w-5 text-primary" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{item.quote}”
                </p>
                <footer className="mt-6 border-t border-border/50 pt-4">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.role}
                  </p>
                </footer>
              </motion.blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
