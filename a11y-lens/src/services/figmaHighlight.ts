import { HIGHLIGHT_FLAG, HIGHLIGHT_GROUP_NAME, PLUGIN_DATA_NAMESPACE } from "../constants/wcag";

export function clearHighlights(): void {
  const page = figma.currentPage;
  const existing = page.findAll((n) => n.getPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`) === "1");
  for (const n of existing) n.remove();
  const group = page.findOne((n) => n.name === HIGHLIGHT_GROUP_NAME);
  if (group) group.remove();
}

export async function highlightNode(nodeId: string, label: string, auto: boolean): Promise<string | null> {
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
    return "The referenced layer is no longer in this file.";
  }
  const scene = node as SceneNode;
  figma.currentPage.selection = [scene];
  figma.viewport.scrollAndZoomIntoView([scene]);
  if (!auto) {
    clearHighlights();
    return null;
  }
  clearHighlights();
  const bounds = scene.absoluteBoundingBox;
  if (!bounds) return null;
  const rect = figma.createRectangle();
  rect.name = label.slice(0, 90);
  rect.x = bounds.x - 2;
  rect.y = bounds.y - 2;
  rect.resize(Math.max(1, bounds.width + 4), Math.max(1, bounds.height + 4));
  rect.fills = [];
  rect.strokes = [
    {
      type: "SOLID",
      color: { r: 0.86, g: 0.15, b: 0.15 },
    },
  ];
  rect.strokeWeight = 2;
  rect.dashPattern = [6, 4];
  rect.setPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`, "1");
  const caption = figma.createText();
  try {
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    caption.fontName = { family: "Inter", style: "Medium" };
  } catch {
    const fonts = await figma.listAvailableFontsAsync();
    const fallback = fonts.find((f) => f.fontName.style === "Regular") ?? fonts[0];
    if (fallback) {
      await figma.loadFontAsync(fallback.fontName);
      caption.fontName = fallback.fontName;
    }
  }
  caption.characters = label.slice(0, 80);
  caption.fontSize = 11;
  caption.fills = [{ type: "SOLID", color: { r: 0.86, g: 0.15, b: 0.15 } }];
  caption.x = bounds.x;
  caption.y = bounds.y - 18;
  caption.setPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`, "1");
  const group = figma.group([rect, caption], figma.currentPage);
  group.name = HIGHLIGHT_GROUP_NAME;
  group.locked = true;
  group.setPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`, "1");
  return null;
}
