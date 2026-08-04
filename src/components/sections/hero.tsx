"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/animations/parallax";
import { siteConfig } from "@/lib/data";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden pt-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-6xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8 lg:pb-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-secondary"
          >
            Portfolio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 max-w-xl text-lg font-medium text-primary sm:text-xl"
          >
            {siteConfig.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {siteConfig.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
              <a href="#work">
                View My Work
                <ArrowDownRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/resume.pdf" download>
                Download Resume
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        <Parallax offset={28} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900">
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgba(108,99,255,0.35), rgba(0,194,168,0.25), rgba(245,158,11,0.2), rgba(108,99,255,0.35))",
                    backgroundSize: "200% 200%",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full border border-white/30 bg-white/20 font-display text-4xl font-semibold text-white backdrop-blur-md shadow-lg">
                    PS
                  </div>
                  <p className="font-display text-xl font-semibold text-white">
                    Pragash Santhakumar
                  </p>
                  <p className="mt-2 text-sm text-white/80">
                    Senior UX Designer
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </Parallax>
      </div>
    </section>
  );
}
