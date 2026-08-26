import type { Rgb } from "../types";

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function parseHex(hex: string): Rgb {
  const raw = hex.trim();
  const match = HEX.exec(raw);
  if (!match) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  let h = match[1];
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length === 8) {
    h = h.slice(0, 6);
  }
  const n = parseInt(h, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

export function tryParseHex(hex: string): Rgb | null {
  try {
    return parseHex(hex);
  } catch {
    return null;
  }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** Figma Plugin API stores RGB channels in 0–1. */
export function figmaRgbToRgb(color: { r: number; g: number; b: number }): Rgb {
  return {
    r: Math.round(color.r * 255),
    g: Math.round(color.g * 255),
    b: Math.round(color.b * 255),
  };
}

export function rgbToFigma(rgb: Rgb): { r: number; g: number; b: number } {
  return {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  };
}

export function relativeLuminance(rgb: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = channel(rgb.r);
  const G = channel(rgb.g);
  const B = channel(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function formatRatio(ratio: number, digits = 2): string {
  return `${ratio.toFixed(digits)}:1`;
}

/** Alpha-composite `src` over `dst`. Alpha is 0–1. */
export function compositeOver(src: Rgb, srcA: number, dst: Rgb): Rgb {
  const a = Math.max(0, Math.min(1, srcA));
  return {
    r: src.r * a + dst.r * (1 - a),
    g: src.g * a + dst.g * (1 - a),
    b: src.b * a + dst.b * (1 - a),
  };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (hp >= 0 && hp < 1) {
    r1 = c;
    g1 = x;
  } else if (hp < 2) {
    r1 = x;
    g1 = c;
  } else if (hp < 3) {
    g1 = c;
    b1 = x;
  } else if (hp < 4) {
    g1 = x;
    b1 = c;
  } else if (hp < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  const m = l - c / 2;
  return {
    r: (r1 + m) * 255,
    g: (g1 + m) * 255,
    b: (b1 + m) * 255,
  };
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) * 60;
  else if (max === G) h = ((B - R) / d + 2) * 60;
  else h = ((R - G) / d + 4) * 60;
  return { h, s, l };
}

/**
 * Search lightness (preserving hue/saturation) until WCAG contrast meets `required`.
 * Prefers darkening on light backgrounds and lightening on dark backgrounds.
 */
export function suggestAccessibleColor(
  fg: Rgb,
  bg: Rgb,
  required: number,
): Rgb | null {
  if (contrastRatio(fg, bg) >= required - 0.005) {
    return fg;
  }
  const { h, s } = rgbToHsl(fg);
  const bgL = relativeLuminance(bg);
  const preferLighter = bgL < 0.5;

  const sample = (l: number) => hslToRgb(h, s, l);

  let best: { rgb: Rgb; l: number; ratio: number } | null = null;
  const step = 0.002;
  if (preferLighter) {
    for (let l = rgbToHsl(fg).l; l <= 1; l += step) {
      const rgb = sample(Math.min(1, l));
      const ratio = contrastRatio(rgb, bg);
      if (ratio >= required) {
        return rgb;
      }
      if (!best || ratio > best.ratio) best = { rgb, l, ratio };
    }
  } else {
    for (let l = rgbToHsl(fg).l; l >= 0; l -= step) {
      const rgb = sample(Math.max(0, l));
      const ratio = contrastRatio(rgb, bg);
      if (ratio >= required) {
        return rgb;
      }
      if (!best || ratio > best.ratio) best = { rgb, l, ratio };
    }
  }

  // Opposite direction if first pass failed (e.g. mid-gray on mid-gray).
  for (let l = 0; l <= 1; l += step) {
    const rgb = sample(l);
    const ratio = contrastRatio(rgb, bg);
    if (ratio >= required) {
      return rgb;
    }
  }
  return best ? best.rgb : null;
}

export function isLikelyRed(rgb: Rgb): boolean {
  return rgb.r > 140 && rgb.r > rgb.g + 40 && rgb.r > rgb.b + 40;
}

export function isLikelyGreen(rgb: Rgb): boolean {
  return rgb.g > 120 && rgb.g > rgb.r + 25 && rgb.g > rgb.b + 15;
}

export function isLikelyStatusPair(a: Rgb, b: Rgb): boolean {
  return (isLikelyRed(a) && isLikelyGreen(b)) || (isLikelyRed(b) && isLikelyGreen(a));
}
