export type WcagLevel = "A" | "AA" | "AAA";
export type IssueStatus = "passed" | "failed" | "needs-review" | "manual";
export type Severity = "critical" | "warning" | "passed" | "info";
export type AnalysisScope = "selection" | "page" | "file";
export type NavTab =
  | "overview"
  | "issues"
  | "contrast"
  | "typography"
  | "touch"
  | "manual"
  | "settings";

export type SemanticRole =
  | "unspecified"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "paragraph"
  | "caption"
  | "label"
  | "button"
  | "link"
  | "decorative";

export type ImageIntent = "unknown" | "informative" | "decorative";

export type InteractiveKind =
  | "button"
  | "icon-button"
  | "link"
  | "input"
  | "textarea"
  | "checkbox"
  | "radio"
  | "select"
  | "tab"
  | "dropdown"
  | "card"
  | "date-picker"
  | "unknown";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface SerializedPaint {
  type: "SOLID" | "GRADIENT" | "IMAGE" | "VIDEO" | "PATTERN" | "OTHER";
  hex?: string;
  rgb?: Rgb;
  opacity: number;
  visible: boolean;
}

export interface SerializedNode {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  opacity: number;
  visible: boolean;
  fills: SerializedPaint[];
  strokes: SerializedPaint[];
  strokeWeight: number;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: string;
  lineHeightPx?: number;
  letterSpacingPx?: number;
  characters?: string;
  parentId: string | null;
  ancestorFills: SerializedPaint[][];
  background?: {
    hex: string;
    rgb: Rgb;
    reliable: boolean;
    reason?: string;
  };
  componentName?: string;
  variantProperties?: Record<string, string>;
  componentSetVariants?: string[];
  isComponent: boolean;
  isInstance: boolean;
  isComponentSet: boolean;
  effects: Array<{ type: string; visible: boolean }>;
  semanticRole?: SemanticRole;
  imageIntent?: ImageIntent;
  ignoredIssueIds: string[];
  hasVisibleTextChild: boolean;
  childCount: number;
}

export interface SuggestedFix {
  kind: "text-color" | "resize" | "rename-metadata" | "create-focus-variant";
  label: string;
  before: string;
  after: string;
  payload: Record<string, unknown>;
}

export interface Issue {
  id: string;
  ruleId: string;
  name: string;
  description: string;
  wcagCriterion: string;
  wcagTitle: string;
  wcagUrl: string;
  level: WcagLevel;
  severity: Severity;
  status: IssueStatus;
  nodeId: string;
  nodeName: string;
  category: IssueCategory;
  recommendation: string;
  automated: boolean;
  manualReview: boolean;
  details?: Record<string, unknown>;
  fix?: SuggestedFix;
  ignored?: boolean;
}

export type IssueCategory =
  | "contrast"
  | "typography"
  | "touch"
  | "forms"
  | "components"
  | "images"
  | "structure"
  | "color"
  | "manual";

export interface PluginSettings {
  wcagLevel: WcagLevel;
  includeExperimental: boolean;
  showManualChecks: boolean;
  autoHighlight: boolean;
  showWcagReferences: boolean;
  enableSuggestedFixes: boolean;
  theme: "system" | "light" | "dark";
  smallTextPx: number;
}

export interface ScoreBreakdown {
  contrast: number;
  typography: number;
  touch: number;
  forms: number;
  components: number;
}

export interface AnalysisResult {
  scope: AnalysisScope;
  fileName: string;
  pageName: string;
  analyzedAt: string;
  nodeCount: number;
  issues: Issue[];
  passedCount: number;
  failedCount: number;
  warningCount: number;
  manualCount: number;
  ignoredCount: number;
  score: number;
  breakdown: ScoreBreakdown;
  progress: AnalysisProgress;
}

export interface AnalysisProgress {
  stage: string;
  steps: Array<{ id: string; label: string; done: boolean }>;
  complete: boolean;
  message: string;
}

export interface ManualCheckState {
  id: string;
  result: "unchecked" | "passed" | "needs-review" | "na";
}

export interface PluginToUiMessage {
  type:
    | "ANALYSIS_PROGRESS"
    | "ANALYSIS_COMPLETE"
    | "ANALYSIS_ERROR"
    | "SETTINGS"
    | "MANUAL_CHECKS"
    | "FIX_APPLIED"
    | "FIX_ERROR"
    | "READY";
  payload?: unknown;
}

export interface UiToPluginMessage {
  type:
    | "UI_READY"
    | "ANALYZE"
    | "HIGHLIGHT"
    | "APPLY_FIX"
    | "IGNORE_ISSUE"
    | "UNIGNORE_ISSUE"
    | "SAVE_SETTINGS"
    | "SET_SEMANTIC_ROLE"
    | "SET_IMAGE_INTENT"
    | "SAVE_MANUAL_CHECKS"
    | "CLEAR_HIGHLIGHTS"
    | "RESIZE_UI";
  payload?: unknown;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  wcagLevel: "AA",
  includeExperimental: false,
  showManualChecks: true,
  autoHighlight: true,
  showWcagReferences: true,
  enableSuggestedFixes: true,
  theme: "system",
  smallTextPx: 12,
};
