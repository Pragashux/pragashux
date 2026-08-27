import {
  contrastRatio,
  formatRatio,
  parseHex,
  rgbToHex,
  suggestAccessibleColor,
} from "../utils/color";
import { WCAG_CONTRAST } from "../constants/wcag";
import type { PluginSettings, Rgb, WcagLevel } from "../types";
import { isLargeText } from "./typography";

export type ContrastContext = "normal-text" | "large-text" | "ui" | "graphical";

export function requiredContrast(
  context: ContrastContext,
  level: WcagLevel,
): number {
  const table = level === "AAA" ? WCAG_CONTRAST.AAA : WCAG_CONTRAST.AA;
  if (context === "large-text") return table.large;
  if (context === "ui" || context === "graphical") return table.ui;
  return table.normal;
}

export function evaluateTextContrast(input: {
  fgHex: string;
  bgHex: string;
  fontSizePx: number;
  fontWeight: number;
  settings: Pick<PluginSettings, "wcagLevel">;
}): {
  ratio: number;
  required: number;
  context: ContrastContext;
  passes: boolean;
  largeText: boolean;
} {
  const fg = parseHex(input.fgHex);
  const bg = parseHex(input.bgHex);
  const largeText = isLargeText(input.fontSizePx, input.fontWeight);
  const context: ContrastContext = largeText ? "large-text" : "normal-text";
  const required = requiredContrast(context, input.settings.wcagLevel);
  const ratio = contrastRatio(fg, bg);
  return {
    ratio,
    required,
    context,
    passes: ratio + 1e-9 >= required,
    largeText,
  };
}

export function evaluateUiContrast(
  fg: Rgb,
  bg: Rgb,
  level: WcagLevel,
): {
  ratio: number;
  required: number;
  passes: boolean;
} {
  const required = requiredContrast("ui", level);
  const ratio = contrastRatio(fg, bg);
  return { ratio, required, passes: ratio + 1e-9 >= required };
}

export function contrastSuggestion(
  fgHex: string,
  bgHex: string,
  required: number,
): { current: string; suggested: string | null; afterRatio: number | null } {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  const suggestedRgb = suggestAccessibleColor(fg, bg, required);
  if (!suggestedRgb) {
    return { current: normalizeHex(fgHex), suggested: null, afterRatio: null };
  }
  const suggested = rgbToHex(suggestedRgb);
  return {
    current: normalizeHex(fgHex),
    suggested,
    afterRatio: contrastRatio(suggestedRgb, bg),
  };
}

export function normalizeHex(hex: string): string {
  const parsed = parseHex(hex);
  return rgbToHex(parsed);
}

export function describeContrast(ratio: number, required: number): string {
  return `Contrast: ${formatRatio(ratio)} · Required: ${formatRatio(required)}`;
}
