import { TARGET_SIZE_MIN_PX } from "../constants/wcag";
import type { InteractiveKind } from "../types";

export interface TargetSizeResult {
  width: number;
  height: number;
  min: number;
  passes: boolean;
  maybeInlineException: boolean;
  maybeSpacingException: boolean;
  approximationNote: string;
}

export function evaluateTargetSize(
  width: number,
  height: number,
  kind: InteractiveKind,
): TargetSizeResult {
  const min = TARGET_SIZE_MIN_PX;
  const passes = width + 1e-6 >= min && height + 1e-6 >= min;
  return {
    width,
    height,
    min,
    passes,
    maybeInlineException: kind === "link",
    maybeSpacingException: !passes && kind === "icon-button",
    approximationNote:
      "Figma dimensions are a design-time approximation of CSS pixels and do not guarantee implemented target size.",
  };
}

export function wouldPassWithResize(
  width: number,
  height: number,
  min = TARGET_SIZE_MIN_PX,
): { width: number; height: number } {
  return {
    width: Math.max(width, min),
    height: Math.max(height, min),
  };
}
