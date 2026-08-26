import type { Issue, IssueCategory } from "../types";

const WEIGHT: Record<IssueCategory, number> = {
  contrast: 0.3,
  typography: 0.15,
  touch: 0.2,
  forms: 0.15,
  components: 0.2,
  images: 0,
  structure: 0,
  color: 0,
  manual: 0,
};

function issuePenalty(issue: Issue): number {
  if (issue.ignored || issue.status === "passed" || issue.status === "manual") {
    return 0;
  }
  if (issue.status === "failed" && issue.severity === "critical") return 1;
  if (issue.status === "failed") return 0.7;
  if (issue.status === "needs-review") return 0.25;
  return 0;
}

export function categoryScore(issues: Issue[], category: IssueCategory): number {
  const relevant = issues.filter((i) => i.category === category && !i.ignored);
  const automated = relevant.filter((i) => i.automated);
  if (automated.length === 0) return 100;
  const penalties = automated.reduce((sum, i) => sum + issuePenalty(i), 0);
  const raw = 1 - penalties / automated.length;
  return Math.round(Math.max(0, Math.min(1, raw)) * 100);
}

export function computeScore(issues: Issue[]): {
  score: number;
  breakdown: {
    contrast: number;
    typography: number;
    touch: number;
    forms: number;
    components: number;
  };
} {
  const breakdown = {
    contrast: categoryScore(issues, "contrast"),
    typography: categoryScore(issues, "typography"),
    touch: categoryScore(issues, "touch"),
    forms: categoryScore(issues, "forms"),
    components: categoryScore(issues, "components"),
  };
  const weighted =
    breakdown.contrast * WEIGHT.contrast +
    breakdown.typography * WEIGHT.typography +
    breakdown.touch * WEIGHT.touch +
    breakdown.forms * WEIGHT.forms +
    breakdown.components * WEIGHT.components;
  return { score: Math.round(weighted), breakdown };
}

export function countByStatus(issues: Issue[]): {
  passed: number;
  failed: number;
  warning: number;
  manual: number;
  ignored: number;
  critical: number;
} {
  const visible = issues.filter((i) => !i.ignored);
  return {
    passed: visible.filter((i) => i.status === "passed").length,
    failed: visible.filter((i) => i.status === "failed").length,
    warning: visible.filter((i) => i.status === "needs-review").length,
    manual: visible.filter((i) => i.status === "manual").length,
    ignored: issues.filter((i) => i.ignored).length,
    critical: visible.filter((i) => i.severity === "critical" && i.status === "failed")
      .length,
  };
}
