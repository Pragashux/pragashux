import { analyzeDocument, ANALYSIS_STEPS } from "./accessibility/engine";
import { DEFAULT_SETTINGS, type AnalysisScope, type ManualCheckState, type PluginSettings, type SuggestedFix, type UiToPluginMessage } from "./types";
import { yieldToMain } from "./utils/debounce";
import { isHighlightNode, serializeNode, writeMeta, readMeta } from "./services/figmaSerialize";
import { clearHighlights, highlightNode } from "./services/figmaHighlight";
import { applySuggestedFix } from "./services/figmaFixes";
import type { ImageIntent, SemanticRole, SerializedNode } from "./types";

const SETTINGS_KEY = "a11y-lens-settings";
const MANUAL_KEY = "a11y-lens-manual-checks";
const YIELD_EVERY = 200;
const MAX_NODES = 12000;

figma.showUI(__html__, { width: 420, height: 680, themeColors: true });

function post(type: string, payload?: unknown): void {
  figma.ui.postMessage({ type, payload });
}

async function loadSettings(): Promise<PluginSettings> {
  const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(stored as Partial<PluginSettings> | undefined) };
}

figma.ui.onmessage = async (msg: UiToPluginMessage) => {
  try {
    switch (msg.type) {
      case "UI_READY": {
        post("SETTINGS", await loadSettings());
        post("MANUAL_CHECKS", (await figma.clientStorage.getAsync(MANUAL_KEY)) ?? []);
        post("READY", { fileName: figma.root.name, pageName: figma.currentPage.name });
        break;
      }
      case "SAVE_SETTINGS": {
        const settings = msg.payload as PluginSettings;
        await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
        post("SETTINGS", settings);
        break;
      }
      case "SAVE_MANUAL_CHECKS": {
        await figma.clientStorage.setAsync(MANUAL_KEY, msg.payload as ManualCheckState[]);
        post("MANUAL_CHECKS", msg.payload);
        break;
      }
      case "ANALYZE": {
        const { scope } = msg.payload as { scope: AnalysisScope };
        await runAnalysis(scope);
        break;
      }
      case "HIGHLIGHT": {
        const settings = await loadSettings();
        const { nodeId, label } = msg.payload as { nodeId: string; label: string };
        const err = await highlightNode(nodeId, label, settings.autoHighlight);
        if (err) post("ANALYSIS_ERROR", { message: err });
        break;
      }
      case "CLEAR_HIGHLIGHTS": {
        clearHighlights();
        break;
      }
      case "APPLY_FIX": {
        const result = await applySuggestedFix(msg.payload as SuggestedFix);
        post("FIX_APPLIED", { message: result });
        break;
      }
      case "IGNORE_ISSUE": {
        const { nodeId, ruleId } = msg.payload as { nodeId: string; ruleId: string };
        await patchIgnored(nodeId, ruleId, true);
        break;
      }
      case "UNIGNORE_ISSUE": {
        const { nodeId, ruleId } = msg.payload as { nodeId: string; ruleId: string };
        await patchIgnored(nodeId, ruleId, false);
        break;
      }
      case "SET_SEMANTIC_ROLE": {
        const { nodeId, role } = msg.payload as { nodeId: string; role: SemanticRole };
        const node = await figma.getNodeByIdAsync(nodeId);
        if (node) writeMeta(node, { semanticRole: role });
        break;
      }
      case "SET_IMAGE_INTENT": {
        const { nodeId, intent } = msg.payload as { nodeId: string; intent: ImageIntent };
        const node = await figma.getNodeByIdAsync(nodeId);
        if (node) writeMeta(node, { imageIntent: intent });
        break;
      }
      case "RESIZE_UI": {
        const { width, height } = msg.payload as { width: number; height: number };
        figma.ui.resize(width, height);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    post("ANALYSIS_ERROR", {
      message: error instanceof Error ? error.message : "Something went wrong while talking to Figma.",
    });
  }
};

async function patchIgnored(nodeId: string, ruleId: string, ignore: boolean): Promise<void> {
  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) return;
  const meta = readMeta(node);
  const set = new Set(meta.ignoredIssueIds ?? []);
  if (ignore) set.add(ruleId);
  else set.delete(ruleId);
  writeMeta(node, { ignoredIssueIds: [...set] });
}

async function runAnalysis(scope: AnalysisScope): Promise<void> {
  const settings = await loadSettings();
  const steps = ANALYSIS_STEPS.map((s, i) => ({
    id: s.id,
    label: s.label,
    done: false,
    index: i,
  }));

  const tick = (index: number, message: string) => {
    post("ANALYSIS_PROGRESS", {
      stage: steps[index]?.id ?? "scan",
      complete: false,
      message,
      steps: steps.map((s, i) => ({ id: s.id, label: s.label, done: i < index })),
    });
  };

  tick(0, "Analyzing design...");

  const roots = await collectRoots(scope);
  if (roots.length === 0) {
    const message =
      scope === "selection"
        ? "No frame selected. Select a frame or component and click Analyze Selection."
        : "Nothing to analyze on this page.";
    post("ANALYSIS_ERROR", { message });
    return;
  }

  tick(1, "Scanning structure...");
  const serialized: SerializedNode[] = [];
  let visited = 0;
  const walk = async (node: SceneNode) => {
    if (isHighlightNode(node)) return;
    if (!node.visible) return;
    serialized.push(serializeNode(node));
    visited += 1;
    if (visited % YIELD_EVERY === 0) {
      await yieldToMain();
      tick(1, `Scanning structure… ${visited} layers`);
    }
    if (serialized.length >= MAX_NODES) return;
    if ("children" in node) {
      for (const child of node.children) {
        if (serialized.length >= MAX_NODES) return;
        await walk(child);
      }
    }
  };

  for (const root of roots) {
    await walk(root);
  }

  if (serialized.length >= MAX_NODES) {
    post("ANALYSIS_PROGRESS", {
      stage: "structure",
      complete: false,
      message: `Reached the ${MAX_NODES} layer safety cap. Results cover a subset of the file.`,
      steps: steps.map((s, i) => ({ id: s.id, label: s.label, done: i < 1 })),
    });
  }

  tick(2, "Evaluating typography and colors...");
  await yieldToMain();
  const result = analyzeDocument({
    nodes: serialized,
    scope,
    fileName: figma.root.name,
    pageName: figma.currentPage.name,
    settings,
  });
  tick(6, "Analysis complete.");
  post("ANALYSIS_COMPLETE", result);
}

async function collectRoots(scope: AnalysisScope): Promise<SceneNode[]> {
  if (scope === "selection") {
    const sel = figma.currentPage.selection.filter((n) => !isHighlightNode(n));
    return sel;
  }
  if (scope === "page") {
    return figma.currentPage.children.filter((n) => !isHighlightNode(n));
  }
  if (typeof figma.loadAllPagesAsync === "function") {
    await figma.loadAllPagesAsync();
  }
  const roots: SceneNode[] = [];
  for (const page of figma.root.children) {
    for (const child of page.children) {
      if (!isHighlightNode(child)) roots.push(child);
    }
  }
  return roots;
}
