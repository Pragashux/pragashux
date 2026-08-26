import type { InteractiveKind } from "../types";
import { detectInteractiveKind } from "./interactive";
import { makeIssue } from "./issueFactory";
import type { Issue, SerializedNode } from "../types";

export function findInconsistentButtons(nodes: SerializedNode[]): Issue[] {
  const buttons = nodes.filter((n) => detectInteractiveKind(n) === ("button" as InteractiveKind) && n.visible);
  if (buttons.length < 3) return [];
  const heights = buttons.map((b) => Math.round(b.height));
  const median = [...heights].sort((a, b) => a - b)[Math.floor(heights.length / 2)];
  const outliers = buttons.filter((b) => Math.abs(b.height - median) >= 12);
  return outliers.slice(0, 8).map((node) =>
    makeIssue({
      ruleId: "component-consistency",
      name: "Inconsistent button height",
      description: `This button is ${Math.round(node.height)}px tall while similar buttons cluster around ${median}px. WCAG 3.2.4 is about consistent identification in the product, not identical Figma sizes — treat this as a design-system review signal.`,
      wcagCriterion: "3.2.4",
      severity: "warning",
      status: "needs-review",
      nodeId: node.id,
      nodeName: node.name,
      category: "components",
      recommendation:
        "Align interactive patterns (height, label style, iconography) so the same action looks the same across frames.",
      automated: true,
      manualReview: true,
      details: { height: node.height, median },
    }),
  );
}
