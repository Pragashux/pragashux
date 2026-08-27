import { describe, expect, it } from "vitest";
import { contrastRatio, parseHex, rgbToHex, suggestAccessibleColor } from "../src/utils/color";
import { evaluateTextContrast, requiredContrast } from "../src/accessibility/contrast";
import { isLargeText } from "../src/accessibility/typography";
import { evaluateTargetSize } from "../src/accessibility/targetSize";
import { analyzeDocument } from "../src/accessibility/engine";
import { computeScore, countByStatus } from "../src/accessibility/score";
import { DEFAULT_SETTINGS } from "../src/types";
import { sampleNodes } from "../src/ui/sampleNodes";

describe("color parsing", () => {
  it("parses 6-digit hex", () => {
    expect(parseHex("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex("000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHex("#777")).toEqual(parseHex("#777777"));
  });

  it("round-trips rgb to hex", () => {
    expect(rgbToHex({ r: 119, g: 119, b: 119 })).toBe("#777777");
  });
});

describe("contrast calculation", () => {
  it("is 21:1 for white on black", () => {
    const ratio = contrastRatio(parseHex("#FFFFFF"), parseHex("#000000"));
    expect(ratio).toBeCloseTo(21, 5);
  });

  it("is approximately 4.48:1 for #777777 on #FFFFFF", () => {
    const ratio = contrastRatio(parseHex("#777777"), parseHex("#FFFFFF"));
    expect(ratio).toBeCloseTo(4.48, 2);
  });

  it("fails AA for 16px normal text at 4.4:1", () => {
    const result = evaluateTextContrast({
      fgHex: "#777777",
      bgHex: "#FFFFFF",
      fontSizePx: 18,
      fontWeight: 400,
      settings: { wcagLevel: "AA" },
    });
    expect(result.largeText).toBe(false);
    expect(result.required).toBe(4.5);
    expect(result.ratio).toBeLessThan(4.5);
    expect(result.passes).toBe(false);
  });

  it("uses 3:1 for large text at AA", () => {
    expect(requiredContrast("large-text", "AA")).toBe(3);
    const result = evaluateTextContrast({
      fgHex: "#767676",
      bgHex: "#FFFFFF",
      fontSizePx: 24,
      fontWeight: 400,
      settings: { wcagLevel: "AA" },
    });
    expect(result.largeText).toBe(true);
    expect(result.required).toBe(3);
  });
});

describe("large text detection", () => {
  it("treats 24px as large", () => {
    expect(isLargeText(24, 400)).toBe(true);
  });
  it("treats 18.66px bold as large", () => {
    expect(isLargeText(18.66, 700)).toBe(true);
  });
  it("does not treat 18px regular as large", () => {
    expect(isLargeText(18, 400)).toBe(false);
  });
});

describe("target size", () => {
  it("passes 24×24", () => {
    const r = evaluateTargetSize(24, 24, "button");
    expect(r.passes).toBe(true);
  });
  it("fails 18×18 icon buttons", () => {
    const r = evaluateTargetSize(18, 18, "icon-button");
    expect(r.passes).toBe(false);
  });
});

describe("rule evaluation + score", () => {
  it("flags sample #777777 text as a contrast failure", () => {
    const result = analyzeDocument({
      nodes: sampleNodes,
      scope: "selection",
      fileName: "test",
      pageName: "page",
      settings: DEFAULT_SETTINGS,
    });
    const contrastFail = result.issues.find(
      (i) => i.nodeId === "2:1" && i.status === "failed" && i.ruleId === "contrast-normal-text",
    );
    expect(contrastFail).toBeTruthy();
    expect(contrastFail?.wcagCriterion).toBe("1.4.3");
    const icon = result.issues.find((i) => i.nodeId === "3:1" && i.ruleId === "target-size-minimum");
    expect(icon?.status).toBe("failed");
    const counts = countByStatus(result.issues);
    expect(counts.failed).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("does not treat a perfect contrast set as a failing score", () => {
    const result = analyzeDocument({
      nodes: [
        {
          ...sampleNodes[1],
          id: "t1",
          fills: [
            {
              type: "SOLID",
              hex: "#000000",
              rgb: { r: 0, g: 0, b: 0 },
              opacity: 1,
              visible: true,
            },
          ],
          fontSize: 16,
          fontWeight: 400,
        },
      ],
      scope: "selection",
      fileName: "t",
      pageName: "p",
      settings: DEFAULT_SETTINGS,
    });
    const contrast = result.issues.find((i) => i.ruleId === "contrast-normal-text");
    expect(contrast?.status).toBe("passed");
    const score = computeScore(result.issues);
    expect(score.breakdown.contrast).toBe(100);
  });

  it("marks complex backgrounds as needs-review, not pass", () => {
    const result = analyzeDocument({
      nodes: [sampleNodes.find((n) => n.id === "7:1")!],
      scope: "selection",
      fileName: "t",
      pageName: "p",
      settings: DEFAULT_SETTINGS,
    });
    const contrast = result.issues.find((i) => i.ruleId === "contrast-normal-text");
    expect(contrast?.status).toBe("needs-review");
  });
});

describe("suggested colors", () => {
  it("suggests a darker gray that meets 4.5:1 on white", () => {
    const suggested = suggestAccessibleColor(parseHex("#777777"), parseHex("#FFFFFF"), 4.5);
    expect(suggested).toBeTruthy();
    expect(contrastRatio(suggested!, parseHex("#FFFFFF"))).toBeGreaterThanOrEqual(4.5);
  });
});
