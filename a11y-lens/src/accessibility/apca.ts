/**
 * APCA (Accessible Perceptual Contrast Algorithm) — experimental.
 * This is a compact implementation of the APCA W3 0.1.9 / 0.98G-4g
 * polarity-aware Lc calculation for optional reporting only.
 * WCAG 2 contrast ratios remain the compliance metric.
 *
 * Reference: https://git.apcacontrast.com/documentation/README
 */

function linearizeSrgb(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function srgbY({ r, g, b }: { r: number; g: number; b: number }): number {
  return (
    0.2126729 * linearizeSrgb(r) +
    0.7151522 * linearizeSrgb(g) +
    0.072175 * linearizeSrgb(b)
  );
}

const Nrm = 0.14;
const BgClip = 0.022;
const Wscale = 1.14;
const Woffset = 0.027;
const Rscale = 1.414;

function clampY(y: number): number {
  if (y >= 0) {
    if (y < BgClip) {
      y += Math.pow(BgClip - y, 1.414);
    }
    return Math.max(y, 0);
  }
  return 0;
}

export function apcaLc(
  text: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number },
): number {
  let yTxt = clampY(srgbY(text));
  let yBg = clampY(srgbY(background));

  let sapc = 0;
  let lc = 0;

  if (Math.abs(yBg - yTxt) < 0.0005) {
    return 0;
  }

  if (yBg > yTxt) {
    sapc = (Math.pow(yBg, Nrm) - Math.pow(yTxt, Nrm)) * Wscale;
    lc = sapc < 0.1 ? 0 : sapc * 100 - Woffset * 100;
  } else {
    sapc = (Math.pow(yBg, Nrm) - Math.pow(yTxt, Nrm)) * Wscale;
    lc = sapc > -0.1 ? 0 : sapc * 100 + Woffset * 100;
  }

  void Rscale;
  return Math.round(lc * 10) / 10;
}

export function apcaNote(lc: number): string {
  const abs = Math.abs(lc);
  if (abs >= 75) return "APCA Lc suggests strong contrast for body text (experimental).";
  if (abs >= 60) return "APCA Lc may be acceptable for body text (experimental).";
  if (abs >= 45) return "APCA Lc may be limited to large text (experimental).";
  return "APCA Lc suggests insufficient perceptual contrast (experimental).";
}
