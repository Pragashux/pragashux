import { BOLD_WEIGHT, LARGE_TEXT_BOLD_PX, LARGE_TEXT_PX } from "../constants/wcag";

export function isLargeText(fontSizePx: number, fontWeight: number): boolean {
  if (fontSizePx >= LARGE_TEXT_PX) return true;
  if (fontSizePx >= LARGE_TEXT_BOLD_PX && fontWeight >= BOLD_WEIGHT) return true;
  return false;
}

export function inferWeight(style: string | undefined, numeric?: number): number {
  if (typeof numeric === "number" && Number.isFinite(numeric)) {
    return numeric;
  }
  const s = (style ?? "").toLowerCase();
  if (s.includes("thin") || s.includes("hairline")) return 100;
  if (s.includes("extralight") || s.includes("ultralight")) return 200;
  if (s.includes("light")) return 300;
  if (s.includes("medium")) return 500;
  if (s.includes("semibold") || s.includes("demibold") || s.includes("semi bold")) {
    return 600;
  }
  if (s.includes("extrabold") || s.includes("ultrabold") || s.includes("heavy") || s.includes("black")) {
    return 800;
  }
  if (s.includes("bold")) return 700;
  if (s.includes("regular") || s.includes("book") || s.includes("normal")) return 400;
  return 400;
}

export function inferHeadingLevel(
  fontSizePx: number,
  fontWeight: number,
  name: string,
): "h1" | "h2" | "h3" | "h4" | "caption" | "body" {
  const n = name.toLowerCase();
  if (/\bh1\b/.test(n) || n.includes("heading 1") || n.includes("headline")) return "h1";
  if (/\bh2\b/.test(n) || n.includes("heading 2") || n.includes("title")) return "h2";
  if (/\bh3\b/.test(n) || n.includes("heading 3") || n.includes("subtitle")) return "h3";
  if (/\bh4\b/.test(n) || n.includes("heading 4")) return "h4";
  if (n.includes("caption") || n.includes("legal") || n.includes("fine print")) {
    return "caption";
  }
  if (fontSizePx >= 32 && fontWeight >= 600) return "h1";
  if (fontSizePx >= 24 && fontWeight >= 600) return "h2";
  if (fontSizePx >= 20 && fontWeight >= 600) return "h3";
  if (fontSizePx >= 16 && fontWeight >= 600) return "h4";
  if (fontSizePx < 12) return "caption";
  return "body";
}

export function lineHeightRatio(lineHeightPx: number | undefined, fontSizePx: number): number | null {
  if (!lineHeightPx || fontSizePx <= 0) return null;
  return lineHeightPx / fontSizePx;
}
