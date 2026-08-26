import type { InteractiveKind, SerializedNode } from "../types";

const PATTERNS: Array<{ kind: InteractiveKind; re: RegExp }> = [
  { kind: "date-picker", re: /\b(date\s*picker|datepicker|calendar)\b/i },
  { kind: "dropdown", re: /\b(dropdown|select menu|combobox|combo box)\b/i },
  { kind: "select", re: /\b(select|picker)\b/i },
  { kind: "textarea", re: /\b(textarea|text area|multiline)\b/i },
  { kind: "input", re: /\b(input|text field|textfield|search field|email field|password)\b/i },
  { kind: "checkbox", re: /\b(checkbox|check box)\b/i },
  { kind: "radio", re: /\b(radio)\b/i },
  { kind: "tab", re: /\b(tab item|tab)\b/i },
  { kind: "icon-button", re: /\b(icon button|iconbtn|icon-btn)\b/i },
  { kind: "button", re: /\b(button|btn|cta)\b/i },
  { kind: "link", re: /\b(link|anchor|hyperlink)\b/i },
  { kind: "card", re: /\b(card|tile)\b/i },
];

export function detectInteractiveKind(node: SerializedNode): InteractiveKind | null {
  const hay = `${node.name} ${node.componentName ?? ""} ${node.type}`;
  for (const { kind, re } of PATTERNS) {
    if (re.test(hay)) return kind;
  }
  if (node.variantProperties) {
    const keys = Object.keys(node.variantProperties).join(" ").toLowerCase();
    if (/\b(state|status|interaction)\b/.test(keys)) {
      const w = node.width;
      const h = node.height;
      if (w <= 48 && h <= 48) return "icon-button";
      return "button";
    }
  }
  return null;
}

export function isFormControl(kind: InteractiveKind | null): boolean {
  return (
    kind === "input" ||
    kind === "textarea" ||
    kind === "checkbox" ||
    kind === "radio" ||
    kind === "select" ||
    kind === "date-picker"
  );
}

export function looksPlaceholderOnly(node: SerializedNode): boolean {
  const text = (node.characters ?? "").trim().toLowerCase();
  const name = node.name.toLowerCase();
  if (!text && !name.includes("placeholder")) return false;
  if (name.includes("placeholder")) return true;
  if (/^(enter |type |search|email|password|your )/.test(text)) return true;
  return false;
}

export function hasVisibleLabelSignal(node: SerializedNode, siblings: SerializedNode[]): boolean {
  if (node.hasVisibleTextChild) return true;
  const nearby = siblings.filter(
    (s) => s.id !== node.id && s.type === "TEXT" && (s.characters ?? "").trim().length > 0,
  );
  return nearby.length > 0;
}

const FOCUS_KEYS = ["focus", "focused", "keyboard focus", ":focus"];
const HOVER_KEYS = ["hover", "hovered"];
const DEFAULT_KEYS = ["default", "enabled", "rest"];

export function variantStates(node: SerializedNode): {
  hasDefault: boolean;
  hasHover: boolean;
  hasFocus: boolean;
  hasPressed: boolean;
  hasDisabled: boolean;
  hasSelected: boolean;
  labels: string[];
} {
  const labels = [
    ...(node.componentSetVariants ?? []),
    ...Object.values(node.variantProperties ?? {}),
    ...Object.keys(node.variantProperties ?? {}),
  ].map((s) => s.toLowerCase());

  const has = (keys: string[]) => labels.some((l) => keys.some((k) => l.includes(k)));
  return {
    hasDefault: has(DEFAULT_KEYS) || labels.length === 0,
    hasHover: has(HOVER_KEYS),
    hasFocus: has(FOCUS_KEYS),
    hasPressed: labels.some((l) => l.includes("press") || l.includes("active")),
    hasDisabled: labels.some((l) => l.includes("disabled")),
    hasSelected: labels.some((l) => l.includes("selected") || l.includes("checked")),
    labels,
  };
}
