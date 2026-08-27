import { useEffect, useMemo, useState } from "react";
import type {
  AnalysisProgress,
  AnalysisResult,
  AnalysisScope,
  ImageIntent,
  ManualCheckState,
  NavTab,
  PluginSettings,
  SemanticRole,
} from "../types";
import { DEFAULT_SETTINGS } from "../types";
import { issuesToCsv, resultToHtml, resultToJson } from "../services/reports";
import { ScoreCard } from "./components/ScoreCard";
import { IssueCard } from "./components/IssueCard";
import { ProgressBar } from "./components/ProgressBar";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/EmptyState";
import { ManualCheckList } from "./components/ManualCheck";
import { SettingsPanel } from "./components/SettingsPanel";
import { isPluginHost, postToPlugin, runPreviewAnalysis } from "./pluginBridge";

const TABS: Array<{ id: NavTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "issues", label: "Issues" },
  { id: "contrast", label: "Contrast" },
  { id: "typography", label: "Typography" },
  { id: "touch", label: "Touch Targets" },
  { id: "manual", label: "Manual Checks" },
  { id: "settings", label: "Settings" },
];

export function App() {
  const [tab, setTab] = useState<NavTab>("overview");
  const [settings, setSettings] = useState<PluginSettings>(DEFAULT_SETTINGS);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [manual, setManual] = useState<ManualCheckState[]>([]);
  const [filter, setFilter] = useState<"all" | "failed" | "needs-review" | "manual" | "passed">("all");

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme === "system" ? "" : settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "SETTINGS") setSettings(msg.payload as PluginSettings);
      if (msg.type === "MANUAL_CHECKS") setManual((msg.payload as ManualCheckState[]) ?? []);
      if (msg.type === "ANALYSIS_PROGRESS") {
        setProgress(msg.payload as AnalysisProgress);
        setError(null);
      }
      if (msg.type === "ANALYSIS_COMPLETE") {
        setResult(msg.payload as AnalysisResult);
        setProgress(null);
        setError(null);
        setTab("overview");
      }
      if (msg.type === "ANALYSIS_ERROR") {
        setProgress(null);
        setError((msg.payload as { message: string }).message);
      }
      if (msg.type === "FIX_APPLIED") {
        setToast((msg.payload as { message: string }).message);
      }
    };
    window.addEventListener("message", onMessage);
    if (isPluginHost()) postToPlugin({ type: "UI_READY" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const analyze = (scope: AnalysisScope) => {
    setError(null);
    setProgress({
      stage: "start",
      complete: false,
      message: "Analyzing design...",
      steps: [
        { id: "structure", label: "Structure", done: false },
        { id: "typography", label: "Typography", done: false },
        { id: "colors", label: "Colors", done: false },
        { id: "components", label: "Components", done: false },
        { id: "touch", label: "Touch targets", done: false },
        { id: "rules", label: "Accessibility rules", done: false },
      ],
    });
    if (isPluginHost()) {
      postToPlugin({ type: "ANALYZE", payload: { scope } });
      return;
    }
    window.setTimeout(() => {
      setResult(runPreviewAnalysis(scope, settings));
      setProgress(null);
    }, 400);
  };

  const persistSettings = (next: PluginSettings) => {
    setSettings(next);
    if (isPluginHost()) postToPlugin({ type: "SAVE_SETTINGS", payload: next });
  };

  const persistManual = (next: ManualCheckState[]) => {
    setManual(next);
    if (isPluginHost()) postToPlugin({ type: "SAVE_MANUAL_CHECKS", payload: next });
  };

  const issues = result?.issues.filter((i) => !i.ignored) ?? [];
  const critical = issues.filter((i) => i.status === "failed" && i.severity === "critical").length;
  const visibleIssues = useMemo(() => {
    const list = result?.issues.filter((i) => !i.ignored) ?? [];
    if (tab === "contrast") return list.filter((i) => i.category === "contrast");
    if (tab === "typography") return list.filter((i) => i.category === "typography" || i.category === "structure");
    if (tab === "touch") return list.filter((i) => i.category === "touch");
    if (filter === "all") return list.filter((i) => i.status !== "passed");
    return list.filter((i) => i.status === filter);
  }, [result, tab, filter]);

  const exportReport = (kind: "html" | "json" | "csv") => {
    if (!result) return;
    const body =
      kind === "html" ? resultToHtml(result) : kind === "json" ? resultToJson(result) : issuesToCsv(result);
    const mime = kind === "html" ? "text/html" : kind === "json" ? "application/json" : "text/csv";
    const blob = new Blob([body], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `a11y-lens-report.${kind === "html" ? "html" : kind}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            AL
          </div>
          <div>
            <h1>A11y Lens</h1>
            <p className="tagline">Accessibility checker for Figma</p>
          </div>
        </div>
      </header>
      <nav className="nav" aria-label="Primary">
        {TABS.map((t) =>
          t.id === "manual" && !settings.showManualChecks ? null : (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ),
        )}
      </nav>
      <main className="main">
        <div className="stack" style={{ marginBottom: 12 }}>
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={() => analyze("selection")}>
              Analyze Selection
            </button>
            <button type="button" className="btn" onClick={() => analyze("page")}>
              Analyze Current Page
            </button>
            <button type="button" className="btn" onClick={() => analyze("file")}>
              Analyze Entire File
            </button>
          </div>
          {!isPluginHost() ? (
            <p className="tiny">Preview mode — sample checkout frame. Import the plugin in Figma to scan live files.</p>
          ) : null}
        </div>

        {progress ? <LoadingState message={progress.message} steps={progress.steps} /> : null}
        {error ? (
          <EmptyState title="Nothing to scan">{error}</EmptyState>
        ) : null}

        {!progress && !error && tab === "overview" ? (
          result ? (
            <div className="stack">
              <ScoreCard
                score={result.score}
                critical={critical}
                warnings={result.warningCount}
                passed={result.passedCount}
              />
              <section className="card stack">
                <h2>Breakdown</h2>
                <ProgressBar label="Contrast" value={result.breakdown.contrast} />
                <ProgressBar label="Typography" value={result.breakdown.typography} />
                <ProgressBar label="Touch Targets" value={result.breakdown.touch} />
                <ProgressBar label="Forms" value={result.breakdown.forms} />
                <ProgressBar label="Components" value={result.breakdown.components} />
              </section>
              <section className="card stack">
                <h2>Export report</h2>
                <div className="row">
                  <button type="button" className="btn btn-sm" onClick={() => exportReport("html")}>
                    HTML (PDF-style)
                  </button>
                  <button type="button" className="btn btn-sm" onClick={() => exportReport("json")}>
                    JSON
                  </button>
                  <button type="button" className="btn btn-sm" onClick={() => exportReport("csv")}>
                    CSV
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <EmptyState title="No analysis yet">
              Select a frame or component and click Analyze Selection. You can also scan the current
              page or the entire file.
            </EmptyState>
          )
        ) : null}

        {!progress && tab !== "overview" && tab !== "settings" && tab !== "manual" ? (
          result ? (
            <div className="stack">
              {tab === "issues" ? (
                <div className="row" role="group" aria-label="Filter issues">
                  {(["all", "failed", "needs-review", "manual", "passed"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`btn btn-sm ${filter === f ? "btn-primary" : ""}`}
                      aria-pressed={filter === f}
                      onClick={() => setFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              ) : null}
              <p className="muted">
                🔴 {critical} Critical · 🟠 {result.warningCount} Warnings · ℹ️ {result.manualCount}{" "}
                Manual checks
              </p>
              {visibleIssues.length === 0 ? (
                <EmptyState title="No matching issues">Nothing in this view for the current scan.</EmptyState>
              ) : (
                visibleIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    showWcag={settings.showWcagReferences}
                    enableFixes={settings.enableSuggestedFixes}
                    onHighlight={() =>
                      postToPlugin({
                        type: "HIGHLIGHT",
                        payload: {
                          nodeId: issue.nodeId,
                          label: `${issue.name} — WCAG ${issue.wcagCriterion}`,
                        },
                      })
                    }
                    onFix={() => issue.fix && postToPlugin({ type: "APPLY_FIX", payload: issue.fix })}
                    onIgnore={() => {
                      setResult((current) =>
                        current
                          ? {
                              ...current,
                              issues: current.issues.map((i) =>
                                i.id === issue.id ? { ...i, ignored: !i.ignored } : i,
                              ),
                            }
                          : current,
                      );
                      if (isPluginHost()) {
                        postToPlugin({
                          type: issue.ignored ? "UNIGNORE_ISSUE" : "IGNORE_ISSUE",
                          payload: { nodeId: issue.nodeId, ruleId: issue.ruleId },
                        });
                      }
                    }}
                    onIntent={
                      issue.ruleId === "non-text-content"
                        ? (intent: ImageIntent) =>
                            postToPlugin({
                              type: "SET_IMAGE_INTENT",
                              payload: { nodeId: issue.nodeId, intent },
                            })
                        : undefined
                    }
                    onRole={(role) =>
                      postToPlugin({
                        type: "SET_SEMANTIC_ROLE",
                        payload: { nodeId: issue.nodeId, role: role as SemanticRole },
                      })
                    }
                  />
                ))
              )}
            </div>
          ) : (
            <EmptyState title="Run an analysis first">Issues appear here after a scan.</EmptyState>
          )
        ) : null}

        {tab === "manual" && settings.showManualChecks ? (
          <ManualCheckList states={manual} onChange={persistManual} />
        ) : null}
        {tab === "settings" ? <SettingsPanel settings={settings} onChange={persistSettings} /> : null}
      </main>
      {toast ? (
        <div className="toast" role="status">
          {toast}{" "}
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setToast(null)}>
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
