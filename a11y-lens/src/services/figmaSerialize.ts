import type { ImageIntent, SemanticRole, SerializedNode, SerializedPaint, Rgb } from "../types";
import { HIGHLIGHT_GROUP_NAME, PLUGIN_DATA_NAMESPACE } from "../constants/wcag";
import { compositeOver, figmaRgbToRgb, rgbToHex } from "../utils/color";
import { inferWeight } from "../accessibility/typography";

const META_KEY = `${PLUGIN_DATA_NAMESPACE}-meta`;

interface NodeMeta {
  semanticRole?: SemanticRole;
  imageIntent?: ImageIntent;
  ignoredIssueIds?: string[];
}

export function readMeta(node: BaseNode): NodeMeta {
  try {
    const raw = node.getPluginData(META_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as NodeMeta;
  } catch {
    return {};
  }
}

export function writeMeta(node: BaseNode, patch: Partial<NodeMeta>): void {
  const current = readMeta(node);
  node.setPluginData(META_KEY, JSON.stringify({ ...current, ...patch }));
}

function paintType(type: string): SerializedPaint["type"] {
  if (type === "SOLID") return "SOLID";
  if (type === "IMAGE") return "IMAGE";
  if (type === "VIDEO") return "VIDEO";
  if (type.startsWith("GRADIENT")) return "GRADIENT";
  if (type === "PATTERN") return "PATTERN";
  return "OTHER";
}

export function serializePaints(paints: readonly Paint[] | typeof figma.mixed): SerializedPaint[] {
  if (paints === figma.mixed) {
    return [{ type: "OTHER", opacity: 1, visible: true }];
  }
  return paints.map((p) => {
    if (p.type === "SOLID") {
      const rgb = figmaRgbToRgb(p.color);
      return {
        type: "SOLID",
        hex: rgbToHex(rgb),
        rgb,
        opacity: p.opacity ?? 1,
        visible: p.visible !== false,
      };
    }
    return {
      type: paintType(p.type),
      opacity: p.opacity ?? 1,
      visible: p.visible !== false,
    };
  });
}

function firstVisibleSolid(paints: SerializedPaint[]): { rgb: Rgb; hex: string; opacity: number } | null {
  for (const p of paints) {
    if (p.visible && p.type === "SOLID" && p.rgb && p.hex) {
      return { rgb: p.rgb, hex: p.hex, opacity: p.opacity };
    }
  }
  return null;
}

function paintsAreComplex(paints: SerializedPaint[]): boolean {
  return paints.some(
    (p) =>
      p.visible &&
      (p.type === "GRADIENT" || p.type === "IMAGE" || p.type === "VIDEO" || p.type === "PATTERN"),
  );
}

export function resolveBackground(node: SceneNode): SerializedNode["background"] {
  let acc: Rgb | null = null;
  let accA = 0;
  let parent: BaseNode | null = node.parent;
  while (parent && parent.type !== "DOCUMENT" && parent.type !== "PAGE") {
    if ("opacity" in parent && parent.opacity === 0) {
      parent = parent.parent;
      continue;
    }
    if ("fills" in parent) {
      const fills = serializePaints(parent.fills as Paint[] | typeof figma.mixed);
      if (paintsAreComplex(fills)) {
        return {
          hex: "#FFFFFF",
          rgb: { r: 255, g: 255, b: 255 },
          reliable: false,
          reason:
            "An ancestor uses a gradient, image, or pattern fill. Contrast cannot be certified automatically.",
        };
      }
      const solid = firstVisibleSolid(fills);
      if (solid) {
        const nodeOpacity = "opacity" in parent ? parent.opacity : 1;
        const a = solid.opacity * nodeOpacity;
        if (!acc) {
          acc = solid.rgb;
          accA = a;
        } else {
          acc = compositeOver(acc, accA, solid.rgb);
          accA = accA + a * (1 - accA);
        }
        if (accA >= 0.95) {
          return { hex: rgbToHex(acc), rgb: acc, reliable: true };
        }
      }
    }
    parent = parent.parent;
  }
  if (acc && accA >= 0.6) {
    return {
      hex: rgbToHex(acc),
      rgb: acc,
      reliable: false,
      reason: "Background is only partially opaque; remaining canvas color is unknown.",
    };
  }
  return {
    hex: "#FFFFFF",
    rgb: { r: 255, g: 255, b: 255 },
    reliable: false,
    reason: "No solid ancestor fill. The Figma canvas color is not a guaranteed published background.",
  };
}

function collectAncestorFills(node: SceneNode): SerializedPaint[][] {
  const out: SerializedPaint[][] = [];
  let parent: BaseNode | null = node.parent;
  while (parent && parent.type !== "DOCUMENT") {
    if ("fills" in parent) {
      out.push(serializePaints(parent.fills as Paint[] | typeof figma.mixed));
    }
    parent = parent.parent;
  }
  return out;
}

function textMetrics(node: TextNode): Pick<
  SerializedNode,
  "fontSize" | "fontWeight" | "fontStyle" | "lineHeightPx" | "letterSpacingPx" | "characters"
> {
  const size = node.fontSize === figma.mixed ? mixedFontSize(node) : node.fontSize;
  const fontName = node.fontName === figma.mixed ? mixedFontName(node) : node.fontName;
  const style = fontName ? fontName.style : undefined;
  const weight = inferWeight(style);
  let lineHeightPx: number | undefined;
  if (node.lineHeight !== figma.mixed) {
    if (node.lineHeight.unit === "PIXELS") lineHeightPx = node.lineHeight.value;
    if (node.lineHeight.unit === "PERCENT" && typeof size === "number") {
      lineHeightPx = (node.lineHeight.value / 100) * size;
    }
  }
  let letterSpacingPx: number | undefined;
  if (node.letterSpacing !== figma.mixed) {
    if (node.letterSpacing.unit === "PIXELS") letterSpacingPx = node.letterSpacing.value;
    if (node.letterSpacing.unit === "PERCENT" && typeof size === "number") {
      letterSpacingPx = (node.letterSpacing.value / 100) * size;
    }
  }
  return {
    fontSize: typeof size === "number" ? size : undefined,
    fontWeight: weight,
    fontStyle: style,
    lineHeightPx,
    letterSpacingPx,
    characters: node.characters,
  };
}

function mixedFontSize(node: TextNode): number | undefined {
  const segs = node.getStyledTextSegments(["fontSize"]);
  return segs[0]?.fontSize;
}

function mixedFontName(node: TextNode): FontName | undefined {
  const segs = node.getStyledTextSegments(["fontName"]);
  return segs[0]?.fontName;
}

function hasVisibleTextChild(node: SceneNode): boolean {
  if (!("children" in node)) return false;
  return node.findAll((n) => n.type === "TEXT" && n.visible && n.characters.trim().length > 0).length > 0;
}

export function serializeNode(node: SceneNode): SerializedNode {
  const meta = readMeta(node);
  const fills =
    "fills" in node ? serializePaints(node.fills as Paint[] | typeof figma.mixed) : [];
  const strokes =
    "strokes" in node ? serializePaints(node.strokes as Paint[] | typeof figma.mixed) : [];
  let variantProperties: Record<string, string> | undefined;
  let componentName: string | undefined;
  let componentSetVariants: string[] | undefined;
  let isComponent = node.type === "COMPONENT";
  let isInstance = node.type === "INSTANCE";
  let isComponentSet = node.type === "COMPONENT_SET";

  if (node.type === "INSTANCE") {
    componentName = node.mainComponent?.name ?? node.name;
    variantProperties = node.variantProperties ?? undefined;
    const main = node.mainComponent;
    if (main?.parent && main.parent.type === "COMPONENT_SET") {
      componentSetVariants = main.parent.children.map((c) => c.name);
      componentName = main.parent.name;
    }
  }
  if (node.type === "COMPONENT") {
    componentName = node.name;
    variantProperties = node.variantProperties ?? undefined;
    if (node.parent?.type === "COMPONENT_SET") {
      componentSetVariants = node.parent.children.map((c) => c.name);
      componentName = node.parent.name;
    }
  }
  if (node.type === "COMPONENT_SET") {
    componentName = node.name;
    componentSetVariants = node.children.map((c) => c.name);
  }

  const metrics = node.type === "TEXT" ? textMetrics(node) : {};

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    width: "width" in node ? node.width : 0,
    height: "height" in node ? node.height : 0,
    opacity: "opacity" in node ? node.opacity : 1,
    visible: node.visible,
    fills,
    strokes,
    strokeWeight: "strokeWeight" in node && node.strokeWeight !== figma.mixed ? Number(node.strokeWeight) : 0,
    parentId: node.parent && "id" in node.parent ? node.parent.id : null,
    ancestorFills: collectAncestorFills(node),
    background: resolveBackground(node),
    componentName,
    variantProperties,
    componentSetVariants,
    isComponent,
    isInstance,
    isComponentSet,
    effects: "effects" in node ? node.effects.map((e) => ({ type: e.type, visible: e.visible })) : [],
    semanticRole: meta.semanticRole,
    imageIntent: meta.imageIntent ?? "unknown",
    ignoredIssueIds: meta.ignoredIssueIds ?? [],
    hasVisibleTextChild: hasVisibleTextChild(node),
    childCount: "children" in node ? node.children.length : 0,
    ...metrics,
  };
}

export function isHighlightNode(node: BaseNode): boolean {
  if (node.name === HIGHLIGHT_GROUP_NAME) return true;
  let p: BaseNode | null = node.parent;
  while (p) {
    if (p.name === HIGHLIGHT_GROUP_NAME) return true;
    p = p.parent;
  }
  return false;
}
