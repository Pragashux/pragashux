import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type CSSProperties } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

function AnimatedChar({
  char,
  progress,
  start,
  end,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const display = char === " " ? "\u00A0" : char;

  return (
    <span className="relative inline-block">
      <span className="invisible">{display}</span>
      <motion.span
        className="absolute left-0 top-0"
        style={{ opacity }}
      >
        {display}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = Array.from(text);

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, index) => {
        const start = index / chars.length;
        const end = Math.min(1, (index + 1) / chars.length);
        return (
          <AnimatedChar
            key={`${char}-${index}`}
            char={char}
            progress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </p>
  );
}
