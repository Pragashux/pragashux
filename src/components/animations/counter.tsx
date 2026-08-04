"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  display?: string;
  duration?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  display,
  duration = 1.6,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    duration: duration * 1000,
  });
  const rounded = useTransform(spring, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView && !display) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value, display]);

  useEffect(() => {
    if (display) return;
    const unsubscribe = rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest}${suffix}`;
      }
    });
    return unsubscribe;
  }, [rounded, suffix, display]);

  if (display) {
    return <span ref={ref}>{display}</span>;
  }

  return <motion.span ref={ref}>0{suffix}</motion.span>;
}
