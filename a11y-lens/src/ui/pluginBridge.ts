import type { AnalysisResult, PluginToUiMessage, UiToPluginMessage } from "../types";
import { DEFAULT_SETTINGS, type ManualCheckState, type PluginSettings } from "../types";
import { analyzeDocument } from "../accessibility/engine";
import { sampleNodes } from "./sampleNodes";

export function postToPlugin(msg: UiToPluginMessage): void {
  parent.postMessage({ pluginMessage: msg }, "*");
}

export function isPluginHost(): boolean {
  return typeof parent !== "undefined" && parent !== window;
}

export function runPreviewAnalysis(
  scope: "selection" | "page" | "file",
  settings: PluginSettings,
): AnalysisResult {
  return analyzeDocument({
    nodes: sampleNodes,
    scope,
    fileName: "Preview file",
    pageName: "Checkout",
    settings,
  });
}

export { DEFAULT_SETTINGS };
export type { ManualCheckState, PluginToUiMessage };
