import type { AnalysisResult, Issue } from "../types";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function issuesToCsv(result: AnalysisResult): string {
  const header = [
    "id",
    "status",
    "severity",
    "ruleId",
    "name",
    "wcag",
    "level",
    "layer",
    "nodeId",
    "category",
    "recommendation",
  ];
  const rows = result.issues
    .filter((i) => !i.ignored)
    .map((i) =>
      [
        i.id,
        i.status,
        i.severity,
        i.ruleId,
        i.name,
        i.wcagCriterion,
        i.level,
        i.nodeName,
        i.nodeId,
        i.category,
        i.recommendation,
      ]
        .map((v) => csvEscape(String(v)))
        .join(","),
    );
  return [header.join(","), ...rows].join("\n");
}

export function resultToJson(result: AnalysisResult): string {
  return JSON.stringify(
    {
      tool: "A11y Lens",
      disclaimer:
        "This is an automated design-time assessment and does not constitute WCAG certification.",
      ...result,
    },
    null,
    2,
  );
}

export function resultToHtml(result: AnalysisResult): string {
  const groups = group(result.issues.filter((i) => !i.ignored));
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>A11y Lens report — ${escapeHtml(result.fileName)}</title>
  <style>
    :root { color-scheme: light dark; }
    body { font: 14px/1.5 ui-sans-serif, system-ui, sans-serif; margin: 32px; color: #111; }
    h1 { font-size: 22px; }
    .muted { color: #555; }
    .score { font-size: 40px; font-weight: 700; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
    .failed { background: #fde8e8; }
    .needs-review { background: #fff4e0; }
    .manual { background: #e8f1ff; }
    .passed { background: #e7f6ec; }
    .disclaimer { border: 1px solid #c9a227; background: #fff8e1; padding: 12px; }
  </style>
</head>
<body>
  <h1>A11y Lens — Design Accessibility Report</h1>
  <p class="disclaimer"><strong>Not a WCAG certification.</strong> This score is an automated design-time assessment and does not guarantee WCAG compliance.</p>
  <p><strong>File:</strong> ${escapeHtml(result.fileName)}<br/>
  <strong>Page:</strong> ${escapeHtml(result.pageName)}<br/>
  <strong>Scope:</strong> ${escapeHtml(result.scope)}<br/>
  <strong>Date:</strong> ${escapeHtml(result.analyzedAt)}<br/>
  <strong>Nodes analyzed:</strong> ${result.nodeCount}</p>
  <p class="score">${result.score} / 100</p>
  <p>Critical failures: ${result.issues.filter((i) => i.severity === "critical" && i.status === "failed" && !i.ignored).length}
  · Warnings: ${result.warningCount}
  · Passed: ${result.passedCount}
  · Manual: ${result.manualCount}</p>
  <h2>Category breakdown</h2>
  <ul>
    <li>Contrast ${result.breakdown.contrast}%</li>
    <li>Typography ${result.breakdown.typography}%</li>
    <li>Touch targets ${result.breakdown.touch}%</li>
    <li>Forms ${result.breakdown.forms}%</li>
    <li>Components ${result.breakdown.components}%</li>
  </ul>
  ${Object.entries(groups)
    .map(
      ([status, list]) => `
    <h2>${escapeHtml(status)} (${list.length})</h2>
    <table>
      <thead><tr><th>Issue</th><th>WCAG</th><th>Layer</th><th>Recommendation</th></tr></thead>
      <tbody>
        ${list
          .map(
            (i) => `<tr class="${i.status}">
              <td><strong>${escapeHtml(i.name)}</strong><br/>${escapeHtml(i.description)}</td>
              <td>${i.wcagCriterion} ${escapeHtml(i.wcagTitle)} (${i.level})<br/><a href="${i.wcagUrl}">Learn more</a></td>
              <td>${escapeHtml(i.nodeName)}</td>
              <td>${escapeHtml(i.recommendation)}</td>
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>`,
    )
    .join("")}
</body>
</html>`;
}

function group(issues: Issue[]): Record<string, Issue[]> {
  const g: Record<string, Issue[]> = {
    failed: [],
    "needs-review": [],
    manual: [],
    passed: [],
  };
  for (const i of issues) {
    (g[i.status] ?? (g[i.status] = [])).push(i);
  }
  return g;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

