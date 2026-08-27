import type { AnalysisResult, AnalysisScope, InteractiveKind, Issue, PluginSettings, SerializedNode } from "../types";
import { findInconsistentButtons } from "./consistency";
import { apcaLc, apcaNote } from "./apca";
import {
  contrastSuggestion,
  evaluateTextContrast,
  evaluateUiContrast,
} from "./contrast";
import { detectInteractiveKind, hasVisibleLabelSignal, isFormControl, looksPlaceholderOnly, variantStates } from "./interactive";
import { makeIssue, resetIssueSeq } from "./issueFactory";
import { countByStatus, computeScore } from "./score";
import { evaluateTargetSize, wouldPassWithResize } from "./targetSize";
import { inferHeadingLevel, inferWeight, lineHeightRatio } from "./typography";
import { formatRatio, parseHex } from "../utils/color";
import { TARGET_SIZE_MIN_PX } from "../constants/wcag";

function firstSolid(paints: SerializedNode["fills"]): { hex: string } | null {
  const solid = paints.find((p) => p.visible && p.type === "SOLID" && p.hex);
  return solid?.hex ? { hex: solid.hex } : null;
}

function hasComplexPaint(paints: SerializedNode["fills"]): boolean {
  return paints.some(
    (p) =>
      p.visible &&
      (p.type === "GRADIENT" || p.type === "IMAGE" || p.type === "VIDEO" || p.type === "PATTERN"),
  );
}

function applyIgnore(node: SerializedNode, issue: Issue): Issue {
  if (node.ignoredIssueIds.includes(issue.ruleId) || node.ignoredIssueIds.includes(issue.id)) {
    return { ...issue, ignored: true };
  }
  return issue;
}

export function analyzeDocument(input: {
  nodes: SerializedNode[];
  scope: AnalysisScope;
  fileName: string;
  pageName: string;
  settings: PluginSettings;
}): AnalysisResult {
  resetIssueSeq();
  const { nodes, settings } = input;
  const issues: Issue[] = [];
  const byParent = new Map<string | null, SerializedNode[]>();
  for (const n of nodes) {
    const list = byParent.get(n.parentId) ?? [];
    list.push(n);
    byParent.set(n.parentId, list);
  }

  const textNodes = nodes.filter((n) => n.type === "TEXT" && n.visible);
  const imageLike = nodes.filter(
    (n) =>
      n.visible &&
      (n.type === "RECTANGLE" || n.type === "ELLIPSE" || n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE") &&
      n.fills.some((f) => f.visible && f.type === "IMAGE"),
  );

  for (const node of textNodes) {
    issues.push(...analyzeTextNode(node, settings));
  }

  for (const node of nodes) {
    if (!node.visible) continue;
    const kind = detectInteractiveKind(node);
    const siblings = byParent.get(node.parentId) ?? [];
    if (kind) {
      issues.push(...analyzeInteractive(node, kind, siblings, settings));
    }
    if (kind && (node.isComponent || node.isInstance || node.isComponentSet)) {
      issues.push(...analyzeFocusVariants(node));
    }
  }

  issues.push(...analyzeColorOnly(nodes));
  issues.push(...analyzeImages(imageLike));
  issues.push(...analyzeHeadingStructure(textNodes));
  issues.push(...analyzeComponentConsistency(nodes));

  const scored = computeScore(issues);
  const counts = countByStatus(issues);

  return {
    scope: input.scope,
    fileName: input.fileName,
    pageName: input.pageName,
    analyzedAt: new Date().toISOString(),
    nodeCount: nodes.length,
    issues,
    passedCount: counts.passed,
    failedCount: counts.failed,
    warningCount: counts.warning,
    manualCount: counts.manual,
    ignoredCount: counts.ignored,
    score: scored.score,
    breakdown: scored.breakdown,
    progress: {
      stage: "complete",
      complete: true,
      message: "Analysis complete.",
      steps: [
        { id: "structure", label: "Structure", done: true },
        { id: "typography", label: "Typography", done: true },
        { id: "colors", label: "Colors", done: true },
        { id: "components", label: "Components", done: true },
        { id: "touch", label: "Touch targets", done: true },
        { id: "rules", label: "Accessibility rules", done: true },
      ],
    },
  };
}

function analyzeTextNode(node: SerializedNode, settings: PluginSettings): Issue[] {
  const out: Issue[] = [];
  const weight = inferWeight(node.fontStyle, node.fontWeight);
  const size = node.fontSize ?? 16;
  const fg = firstSolid(node.fills);
  const bgReliable = node.background?.reliable && node.background.hex;
  const ignored = (issue: Issue) => applyIgnore(node, issue);

  if (!fg || hasComplexPaint(node.fills)) {
    out.push(
      ignored(
        makeIssue({
          ruleId: "contrast-normal-text",
          name: "Text fill not a solid color",
          description:
            "This text uses a missing, mixed, gradient, or image fill, so contrast cannot be computed reliably.",
          wcagCriterion: "1.4.3",
          severity: "info",
          status: "needs-review",
          nodeId: node.id,
          nodeName: node.name,
          category: "contrast",
          recommendation:
            "Use a solid text color, or manually verify contrast against the real background in context.",
          automated: true,
          manualReview: true,
        }),
      ),
    );
  } else if (!bgReliable) {
    out.push(
      ignored(
        makeIssue({
          ruleId: "contrast-normal-text",
          name: "Background cannot be determined",
          description:
            node.background?.reason ??
            "The background is transparent, a gradient, an image, or otherwise too complex for a reliable automated contrast check.",
          wcagCriterion: "1.4.3",
          severity: "warning",
          status: "needs-review",
          nodeId: node.id,
          nodeName: node.name,
          category: "contrast",
          recommendation:
            "Place the text on a solid background, or manually measure contrast including overlays, photos, and reduced opacity.",
          automated: true,
          manualReview: true,
          details: {
            foreground: fg.hex,
            background: "complex / unknown",
            result: "NEEDS REVIEW",
          },
        }),
      ),
    );
  } else {
    const result = evaluateTextContrast({
      fgHex: fg.hex,
      bgHex: node.background!.hex,
      fontSizePx: size,
      fontWeight: weight,
      settings,
    });
    const suggestion = contrastSuggestion(fg.hex, node.background!.hex, result.required);
    const details: Record<string, unknown> = {
      foreground: fg.hex,
      background: node.background!.hex,
      contrast: formatRatio(result.ratio),
      required: formatRatio(result.required),
      result: result.passes ? "PASS" : "FAIL",
      largeText: result.largeText,
      fontSize: size,
      fontWeight: weight,
    };
    if (settings.includeExperimental) {
      const lc = apcaLc(parseHex(fg.hex), parseHex(node.background!.hex));
      details.apcaLc = lc;
      details.apcaNote = apcaNote(lc);
    }
    const criterion = settings.wcagLevel === "AAA" ? "1.4.6" : "1.4.3";
    if (result.passes) {
      out.push(
        ignored(
          makeIssue({
            ruleId: result.largeText ? "contrast-large-text" : "contrast-normal-text",
            name: result.largeText ? "Large text contrast" : "Normal text contrast",
            description: `Text meets WCAG ${settings.wcagLevel} contrast (${formatRatio(result.ratio)} ≥ ${formatRatio(result.required)}).`,
            wcagCriterion: criterion,
            severity: "passed",
            status: "passed",
            nodeId: node.id,
            nodeName: node.name,
            category: "contrast",
            recommendation: "No contrast change required for this pair, assuming the resolved background is correct.",
            automated: true,
            manualReview: false,
            details,
          }),
        ),
      );
    } else {
      out.push(
        ignored(
          makeIssue({
            ruleId: result.largeText ? "contrast-large-text" : "contrast-normal-text",
            name: result.largeText ? "Large text contrast" : "Normal text contrast",
            description: `Contrast ${formatRatio(result.ratio)} is below the ${settings.wcagLevel} requirement of ${formatRatio(result.required)} for ${result.largeText ? "large" : "normal"} text.`,
            wcagCriterion: criterion,
            severity: "critical",
            status: "failed",
            nodeId: node.id,
            nodeName: node.name,
            category: "contrast",
            recommendation: `Increase contrast between the text and background. Suggested text color: ${suggestion.suggested ?? "adjust lightness until the ratio is met"}.`,
            automated: true,
            manualReview: false,
            details,
            fix:
              settings.enableSuggestedFixes && suggestion.suggested
                ? {
                    kind: "text-color",
                    label: "Apply suggested text color",
                    before: suggestion.current,
                    after: suggestion.suggested,
                    payload: { hex: suggestion.suggested, nodeId: node.id },
                  }
                : undefined,
          }),
        ),
      );
    }
  }

  if (size + 1e-6 < settings.smallTextPx) {
    out.push(
      ignored(
        makeIssue({
          ruleId: "text-size-readability",
          name: "Very small text",
          description: `Text size is ${size}px. WCAG does not define a universal minimum font size, but very small type often fails real-world readability and can conflict with resize/reflow in implementation.`,
          wcagCriterion: "1.4.4",
          severity: "warning",
          status: "needs-review",
          nodeId: node.id,
          nodeName: node.name,
          category: "typography",
          recommendation: `Consider at least ${settings.smallTextPx}px for UI body copy. Verify 200% zoom (1.4.4) and reflow at 320 CSS pixels (1.4.10) in the implemented UI.`,
          automated: true,
          manualReview: true,
          details: { fontSize: size, wcagMinimum: "none (no universal WCAG min size)" },
        }),
      ),
    );
  } else {
    out.push(
      ignored(
        makeIssue({
          ruleId: "text-size-readability",
          name: "Text size",
          description: `Text size ${size}px is at or above the plugin readability threshold (${settings.smallTextPx}px). This is not a WCAG pass/fail.`,
          wcagCriterion: "1.4.4",
          severity: "passed",
          status: "passed",
          nodeId: node.id,
          nodeName: node.name,
          category: "typography",
          recommendation: "Still verify resize text and reflow in the browser or native app.",
          automated: true,
          manualReview: true,
          details: { fontSize: size },
        }),
      ),
    );
  }

  const lh = lineHeightRatio(node.lineHeightPx, size);
  if (lh !== null && lh < 1.35) {
    out.push(
      ignored(
        makeIssue({
          ruleId: "text-spacing-risk",
          name: "Tight line height",
          description: `Line height is about ${lh.toFixed(2)}× font size. WCAG 1.4.12 requires that users can apply 1.5× line height without loss of content. Tight Figma leading is a risk signal, not a failure.`,
          wcagCriterion: "1.4.12",
          severity: "warning",
          status: "needs-review",
          nodeId: node.id,
          nodeName: node.name,
          category: "typography",
          recommendation:
            "Leave enough vertical room in components so text can grow to 1.5× line height, 2× paragraph spacing, 0.12× letter spacing, and 0.16× word spacing.",
          automated: true,
          manualReview: true,
          details: { lineHeightRatio: lh },
        }),
      ),
    );
  }

  const inferred = inferHeadingLevel(size, weight, node.name);
  if (node.semanticRole && node.semanticRole !== "unspecified") {
    out.push(
      ignored(
        makeIssue({
          ruleId: "semantic-role",
          name: "Designer-assigned semantic role",
          description: `This layer is tagged as ${node.semanticRole}. Visual hierarchy in Figma does not automatically produce a correct HTML heading structure.`,
          wcagCriterion: "1.3.1",
          severity: "info",
          status: "manual",
          nodeId: node.id,
          nodeName: node.name,
          category: "structure",
          recommendation:
            "Confirm the implemented markup uses the intended heading level and that heading ranks are not skipped incorrectly.",
          automated: false,
          manualReview: true,
          details: { semanticRole: node.semanticRole, inferred },
        }),
      ),
    );
  }

  return out;
}

function analyzeInteractive(
  node: SerializedNode,
  kind: InteractiveKind,
  siblings: SerializedNode[],
  settings: PluginSettings,
): Issue[] {
  const out: Issue[] = [];
  const ignored = (issue: Issue) => applyIgnore(node, issue);
  const size = evaluateTargetSize(node.width, node.height, kind);

  const isTarget = kind !== "card" && kind !== "unknown";
  if (isTarget) {
    if (size.passes) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "target-size-minimum",
            name: "Target size (minimum)",
            description: `${Math.round(node.width)} × ${Math.round(node.height)} meets the 24 × 24 CSS-pixel approximation for WCAG 2.2 2.5.8.`,
            wcagCriterion: "2.5.8",
            severity: "passed",
            status: "passed",
            nodeId: node.id,
            nodeName: node.name,
            category: "touch",
            recommendation: size.approximationNote,
            automated: true,
            manualReview: false,
            details: { width: node.width, height: node.height, min: TARGET_SIZE_MIN_PX },
          }),
        ),
      );
    } else {
      const next = wouldPassWithResize(node.width, node.height);
      const exception =
        size.maybeInlineException
          ? " Inline links may qualify for the 2.5.8 inline exception — confirm in implementation."
          : size.maybeSpacingException
            ? " A spacing exception may apply if the undersized target has a 24px circle that does not intersect other targets."
            : "";
      out.push(
        ignored(
          makeIssue({
            ruleId: "target-size-minimum",
            name: "Target size (minimum)",
            description: `${Math.round(node.width)} × ${Math.round(node.height)} is below the 24 × 24 CSS-pixel approximation for WCAG 2.2 Target Size (Minimum).${exception}`,
            wcagCriterion: "2.5.8",
            severity: size.maybeInlineException ? "warning" : "critical",
            status: size.maybeInlineException ? "needs-review" : "failed",
            nodeId: node.id,
            nodeName: node.name,
            category: "touch",
            recommendation: `Increase the interactive target to at least 24 × 24 CSS pixels (design-time approximation), or document a valid 2.5.8 exception. ${size.approximationNote}`,
            automated: true,
            manualReview: size.maybeInlineException || size.maybeSpacingException,
            details: { width: node.width, height: node.height, kind },
            fix: settings.enableSuggestedFixes
              ? {
                  kind: "resize",
                  label: "Resize to 24×24 minimum",
                  before: `${Math.round(node.width)} × ${Math.round(node.height)}`,
                  after: `${next.width} × ${next.height}`,
                  payload: { nodeId: node.id, width: next.width, height: next.height },
                }
              : undefined,
          }),
        ),
      );
    }
  }

  if (isFormControl(kind)) {
    const placeholderOnly = looksPlaceholderOnly(node) && !hasVisibleLabelSignal(node, siblings);
    if (placeholderOnly) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "form-visible-label",
            name: "Placeholder may be the only label",
            description:
              "This field looks like it uses placeholder (or placeholder-like) copy without a persistent visible label. Placeholder-only labels often fail 3.3.2 when implemented.",
            wcagCriterion: "3.3.2",
            severity: "critical",
            status: "failed",
            nodeId: node.id,
            nodeName: node.name,
            category: "forms",
            recommendation:
              "Provide a visible label that remains available when the field is filled. Placeholder is not a substitute for a label.",
            automated: true,
            manualReview: true,
            details: { kind, characters: node.characters ?? "" },
          }),
        ),
      );
    } else if (!hasVisibleLabelSignal(node, siblings) && !node.hasVisibleTextChild) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "form-visible-label",
            name: "Form control may lack a visible label",
            description: `No nearby text layer was detected for this ${kind}. Semantic labels cannot be confirmed from Figma alone.`,
            wcagCriterion: "3.3.2",
            severity: "warning",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "forms",
            recommendation:
              "Add a visible label (or confirm the control has an accessible name via a wrapping component). Verify error text (3.3.1) and error suggestions (3.3.3) in implementation.",
            automated: true,
            manualReview: true,
            details: { kind },
          }),
        ),
      );
    } else {
      out.push(
        ignored(
          makeIssue({
            ruleId: "form-visible-label",
            name: "Visible label signal present",
            description: "Nearby or nested text was found. This is not proof that the implemented control has a programmatic name.",
            wcagCriterion: "3.3.2",
            severity: "passed",
            status: "passed",
            nodeId: node.id,
            nodeName: node.name,
            category: "forms",
            recommendation: "Confirm the accessible name is not placeholder-only in the product.",
            automated: true,
            manualReview: true,
            details: { kind },
          }),
        ),
      );
    }

    const hay = `${node.name} ${Object.values(node.variantProperties ?? {}).join(" ")}`.toLowerCase();
    if (hay.includes("error") || hay.includes("invalid")) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "form-error-identification",
            name: "Error state present — verify text",
            description:
              "An error-looking variant or name was found. WCAG 3.3.1 requires identifying the field and describing the error in text — color or icon alone is not enough.",
            wcagCriterion: "3.3.1",
            severity: "info",
            status: "manual",
            nodeId: node.id,
            nodeName: node.name,
            category: "forms",
            recommendation:
              "Include error message text, not only a red border. Where the suggestion is known, provide it (3.3.3).",
            automated: false,
            manualReview: true,
          }),
        ),
      );
    }
  }

  if (kind === "button" || kind === "icon-button" || kind === "link") {
    const fg = firstSolid(node.fills);
    if (fg && node.background?.reliable && node.background.hex) {
      const ui = evaluateUiContrast(
        parseHex(fg.hex),
        parseHex(node.background.hex),
        settings.wcagLevel === "A" ? "AA" : settings.wcagLevel,
      );
      if (!ui.passes) {
        out.push(
          ignored(
            makeIssue({
              ruleId: "non-text-contrast",
              name: "UI component contrast",
              description: `Component fill ${fg.hex} against adjacent background ${node.background.hex} is ${formatRatio(ui.ratio)} (need ${formatRatio(ui.required)} for 1.4.11).`,
              wcagCriterion: "1.4.11",
              severity: "critical",
              status: "failed",
              nodeId: node.id,
              nodeName: node.name,
              category: "contrast",
              recommendation:
                "Increase contrast of the visual boundary or icon against adjacent colors. Incidental decoration is exempt.",
              automated: true,
              manualReview: false,
              details: {
                foreground: fg.hex,
                background: node.background.hex,
                contrast: formatRatio(ui.ratio),
                required: formatRatio(ui.required),
                result: "FAIL",
              },
            }),
          ),
        );
      }
    } else if (hasComplexPaint(node.fills) || !node.background?.reliable) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "non-text-contrast",
            name: "UI contrast needs review",
            description:
              "Component or adjacent color could not be resolved to solid fills. Non-text contrast cannot be certified automatically.",
            wcagCriterion: "1.4.11",
            severity: "info",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "contrast",
            recommendation: "Manually check icon, border, and focus indicator contrast at 3:1.",
            automated: true,
            manualReview: true,
          }),
        ),
      );
    }
  }

  out.push(
    ignored(
      makeIssue({
        ruleId: "interaction-behavior",
        name: "Interaction behavior (static file)",
        description: `Detected as a likely ${kind}. Keyboard behavior, hover vs focus, and disabled states cannot be fully validated from Figma.`,
        wcagCriterion: "2.4.7",
        severity: "info",
        status: "manual",
        nodeId: node.id,
        nodeName: node.name,
        category: "components",
        recommendation:
          "Prototype and implement visible focus, pointer and keyboard parity, and consistent identification (3.2.4).",
        automated: false,
        manualReview: true,
        details: { kind },
      }),
    ),
  );

  return out;
}

function analyzeFocusVariants(node: SerializedNode): Issue[] {
  const states = variantStates(node);
  const ignored = (issue: Issue) => applyIgnore(node, issue);
  if (states.hasHover && !states.hasFocus) {
    return [
      ignored(
        makeIssue({
          ruleId: "focus-visible-variant",
          name: "Focus state may be missing",
          description:
            "This component has a hover-like variant but no focus-like variant. WCAG 2.4.7 requires a visible keyboard focus indicator. A static Figma file cannot prove keyboard behavior.",
          wcagCriterion: "2.4.7",
          severity: "warning",
          status: "needs-review",
          nodeId: node.id,
          nodeName: node.name,
          category: "components",
          recommendation:
            "Add a Focus variant (not only Hover). Confirm the indicator is not fully covered (2.4.11) and consider 2.4.12 at AAA.",
          automated: true,
          manualReview: true,
          details: { variants: states.labels },
          fix: {
            kind: "create-focus-variant",
            label: "Create Focus variant from current component",
            before: "Hover without Focus",
            after: "Focus variant (cloned from default/hover)",
            payload: { nodeId: node.id },
          },
        }),
      ),
    ];
  }
  if (states.hasFocus) {
    return [
      ignored(
        makeIssue({
          ruleId: "focus-visible-variant",
          name: "Focus variant present",
          description:
            "A focus-like variant was found. This does not prove the implemented product shows a keyboard focus indicator or that it remains unobscured.",
          wcagCriterion: "2.4.7",
          severity: "passed",
          status: "passed",
          nodeId: node.id,
          nodeName: node.name,
          category: "components",
          recommendation: "Manually test keyboard focus, contrast of the ring (1.4.11), and occlusion (2.4.11 / 2.4.12).",
          automated: true,
          manualReview: true,
          details: { variants: states.labels },
        }),
      ),
    ];
  }
  return [];
}

function analyzeColorOnly(nodes: SerializedNode[]): Issue[] {
  const out: Issue[] = [];
  const statusLike = nodes.filter((n) => {
    const hay = n.name.toLowerCase();
    return (
      n.visible &&
      (hay.includes("error") ||
        hay.includes("success") ||
        hay.includes("warning") ||
        hay.includes("status") ||
        hay.includes("legend") ||
        hay.includes("chart") ||
        hay.includes("selected"))
    );
  });
  for (const node of statusLike) {
    const solids = node.fills.filter((f) => f.visible && f.type === "SOLID" && f.hex);
    const redGreen = solids.some((s) => {
      const rgb = parseHex(s.hex!);
      return (rgb.r > 140 && rgb.g < 100) || (rgb.g > 140 && rgb.r < 100);
    });
    out.push(
      applyIgnore(
        node,
        makeIssue({
          ruleId: "use-of-color",
          name: "Information may rely on color",
          description:
            "This layer looks like a status, chart, or selection indicator. Color-blindness cannot be detected automatically. If hue is the only difference between states, it likely fails 1.4.1.",
          wcagCriterion: "1.4.1",
          severity: "warning",
          status: "needs-review",
          nodeId: node.id,
          nodeName: node.name,
          category: "color",
          recommendation:
            "Pair color with an icon, label, pattern, or shape difference. Do not use red vs green as the only signal.",
          automated: true,
          manualReview: true,
          details: { redGreenHeuristic: redGreen },
        }),
      ),
    );
  }
  return out;
}

function analyzeImages(nodes: SerializedNode[]): Issue[] {
  return nodes.map((node) =>
    applyIgnore(
      node,
      makeIssue({
        ruleId: "non-text-content",
        name: "Image detected",
        description:
          node.imageIntent === "informative"
            ? "Marked informative — a text alternative will be required in implementation. The Figma layer name is not automatically equivalent to alt text."
            : node.imageIntent === "decorative"
              ? "Marked decorative — implementation should use empty alt (or CSS background) so assistive tech ignores it. Confirm this is purely decorative."
              : "An image fill was found. This plugin cannot tell whether the image is informative or decorative.",
        wcagCriterion: "1.1.1",
        severity: node.imageIntent === "unknown" || !node.imageIntent ? "info" : "info",
        status: node.imageIntent === "informative" || node.imageIntent === "decorative" ? "manual" : "needs-review",
        nodeId: node.id,
        nodeName: node.name,
        category: "images",
        recommendation:
          node.imageIntent === "decorative"
            ? "Keep empty alt in code. Do not copy the layer name into alt unless it is meaningful."
            : "Classify as Informative or Decorative in the Issues panel. Provide equivalent alt text only when informative.",
        automated: true,
        manualReview: true,
        details: { imageIntent: node.imageIntent ?? "unknown" },
      }),
    ),
  );
}

function analyzeHeadingStructure(textNodes: SerializedNode[]): Issue[] {
  if (textNodes.length === 0) return [];
  const inferred = textNodes.map((n) => ({
    node: n,
    level: inferHeadingLevel(n.fontSize ?? 16, inferWeight(n.fontStyle, n.fontWeight), n.name),
  }));
  const h1 = inferred.filter((x) => x.level === "h1" || x.node.semanticRole === "h1");
  const issues: Issue[] = [];
  if (h1.length > 1) {
    for (const item of h1) {
      issues.push(
        applyIgnore(
          item.node,
          makeIssue({
            ruleId: "heading-structure",
            name: "Multiple visual H1-sized titles",
            description:
              "More than one text layer looks like a top-level heading. Visual size is not HTML rank. Multiple H1s can be valid, but often indicate a hierarchy problem.",
            wcagCriterion: "1.3.1",
            severity: "warning",
            status: "needs-review",
            nodeId: item.node.id,
            nodeName: item.node.name,
            category: "structure",
            recommendation:
              "Assign semantic roles in the plugin, then map a single page title to H1 unless the document outline intentionally uses multiple.",
            automated: true,
            manualReview: true,
          }),
        ),
      );
    }
  }
  return issues;
}

function analyzeComponentConsistency(nodes: SerializedNode[]): Issue[] {
  return findInconsistentButtons(nodes);
}

export const ANALYSIS_STEPS = [
  { id: "structure", label: "Structure" },
  { id: "typography", label: "Typography" },
  { id: "colors", label: "Colors" },
  { id: "components", label: "Components" },
  { id: "touch", label: "Touch targets" },
  { id: "rules", label: "Accessibility rules" },
] as const;
