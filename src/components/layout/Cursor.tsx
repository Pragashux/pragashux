"use client";

import { useEffect, useState } from "react";

export function Cursor() {
  const [pos, setPos] = useState({ x: -40, y: -40 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none)");
    if (motion.matches || coarse.matches) return;

    const move = (event: PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
      const target = event.target as HTMLElement | null;
      setHover(Boolean(target?.closest("a, button")));
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      className={`cursor${hover ? " is-hover" : ""}`}
      style={{ left: pos.x, top: pos.y }}
      aria-hidden
    />
  );
}
