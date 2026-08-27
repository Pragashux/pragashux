import { rgbToFigma, tryParseHex } from "../utils/color";
import type { SuggestedFix } from "../types";

export async function applySuggestedFix(fix: SuggestedFix): Promise<string> {
  const nodeId = String(fix.payload.nodeId ?? "");
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) return "Layer not found. It may have been deleted.";

  if (fix.kind === "text-color") {
    if (node.type !== "TEXT") return "Color fix only applies to text layers.";
    const hex = String(fix.payload.hex ?? "");
    const rgb = tryParseHex(hex);
    if (!rgb) return "Invalid color.";
    const color = rgbToFigma(rgb);
    node.fills = [{ type: "SOLID", color, opacity: 1 }];
    return `Updated text color to ${hex}. Use Figma undo (⌘Z / Ctrl+Z) if this was not intended.`;
  }

  if (fix.kind === "resize") {
    if (!("resize" in node)) return "This layer cannot be resized.";
    const width = Number(fix.payload.width);
    const height = Number(fix.payload.height);
    (node as LayoutMixin).resize(width, height);
    return `Resized to ${Math.round(width)} × ${Math.round(height)}. Undo in Figma if needed.`;
  }

  if (fix.kind === "rename-metadata") {
    const name = String(fix.payload.name ?? node.name);
    node.name = name;
    return `Renamed layer to “${name}”.`;
  }

  if (fix.kind === "create-focus-variant") {
    return await createFocusVariant(node as SceneNode);
  }

  return "Unknown fix type.";
}

async function createFocusVariant(node: SceneNode): Promise<string> {
  let component: ComponentNode | null = null;
  if (node.type === "COMPONENT") component = node;
  if (node.type === "INSTANCE") {
    component = node.mainComponent;
  }
  if (!component) {
    return "Select a component or instance. Focus variants can only be added to a component set.";
  }
  const parent = component.parent;
  if (!parent || parent.type !== "COMPONENT_SET") {
    return "This component is not in a variant set. Convert it to a component set in Figma, then retry.";
  }
  const existing = parent.children.some((c) => c.name.toLowerCase().includes("focus"));
  if (existing) return "A Focus variant already exists on this set.";
  const clone = component.clone();
  const keys = Object.keys(component.variantProperties ?? {});
  if (keys.length > 0) {
    const key = keys.find((k) => /state|status|type/i.test(k)) ?? keys[0];
    const others = keys
      .filter((k) => k !== key)
      .map((k) => `${k}=${component!.variantProperties![k]}`);
    clone.name = [`${key}=Focus`, ...others].join(", ");
  } else {
    clone.name = "State=Focus";
  }
  clone.x = component.x + component.width + 24;
  clone.y = component.y;
  return `Created variant “${clone.name}”. Style the focus ring manually — the plugin will not invent a visual language.`;
}
