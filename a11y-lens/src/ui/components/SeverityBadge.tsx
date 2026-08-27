import type { Issue, Severity } from "../../types";

const META: Record<
  Severity,
  { icon: string; label: string; className: string }
> = {
  critical: { icon: "🔴", label: "Critical", className: "badge-critical" },
  warning: { icon: "🟠", label: "Warning", className: "badge-warning" },
  passed: { icon: "🟢", label: "Passed", className: "badge-passed" },
  info: { icon: "🔵", label: "Information", className: "badge-info" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const m = META[severity];
  return (
    <span className={`badge ${m.className}`}>
      <span aria-hidden="true">{m.icon}</span>
      {m.label}
    </span>
  );
}

export function statusFromIssue(issue: Issue): Severity {
  if (issue.status === "passed") return "passed";
  if (issue.status === "failed") return issue.severity === "critical" ? "critical" : "warning";
  if (issue.status === "needs-review") return "warning";
  return "info";
}
