import type { Issue, IssueCategory, Severity, SuggestedFix, WcagLevel } from "../types";
import { WCAG_CRITERIA } from "../constants/wcag";

let seq = 0;

export function resetIssueSeq(): void {
  seq = 0;
}

export function makeIssue(input: {
  ruleId: string;
  name: string;
  description: string;
  wcagCriterion: string;
  severity: Severity;
  status: Issue["status"];
  nodeId: string;
  nodeName: string;
  category: IssueCategory;
  recommendation: string;
  automated: boolean;
  manualReview: boolean;
  details?: Record<string, unknown>;
  fix?: SuggestedFix;
  ignored?: boolean;
  levelOverride?: WcagLevel;
}): Issue {
  const meta = WCAG_CRITERIA[input.wcagCriterion];
  seq += 1;
  return {
    id: `${input.ruleId}:${input.nodeId}:${seq}`,
    ruleId: input.ruleId,
    name: input.name,
    description: input.description,
    wcagCriterion: input.wcagCriterion,
    wcagTitle: meta?.title ?? input.name,
    wcagUrl: meta?.url ?? "https://www.w3.org/TR/WCAG22/",
    level: input.levelOverride ?? meta?.level ?? "AA",
    severity: input.severity,
    status: input.status,
    nodeId: input.nodeId,
    nodeName: input.nodeName,
    category: input.category,
    recommendation: input.recommendation,
    automated: input.automated,
    manualReview: input.manualReview,
    details: input.details,
    fix: input.fix,
    ignored: input.ignored,
  };
}
