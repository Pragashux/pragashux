import type { Issue } from "../../types";
import { SeverityBadge, statusFromIssue } from "./SeverityBadge";
import { WCAGBadge } from "./WCAGBadge";

export function IssueCard({
  issue,
  showWcag,
  enableFixes,
  onHighlight,
  onFix,
  onIgnore,
  onIntent,
  onRole,
}: {
  issue: Issue;
  showWcag: boolean;
  enableFixes: boolean;
  onHighlight: () => void;
  onFix: () => void;
  onIgnore: () => void;
  onIntent?: (intent: "informative" | "decorative") => void;
  onRole?: (role: string) => void;
}) {
  const d = issue.details ?? {};
  return (
    <article className="card issue">
      <header>
        <div>
          <h3>{issue.name}</h3>
          <WCAGBadge
            criterion={issue.wcagCriterion}
            title={issue.wcagTitle}
            level={issue.level}
            url={issue.wcagUrl}
            showLink={showWcag}
          />
        </div>
        <SeverityBadge severity={statusFromIssue(issue)} />
      </header>
      <p>{issue.description}</p>
      {typeof d.foreground === "string" && typeof d.background === "string" ? (
        <ColorContrastCard
          foreground={d.foreground}
          background={d.background}
          contrast={String(d.contrast ?? "")}
          required={String(d.required ?? "")}
          result={String(d.result ?? "")}
          apca={d.apcaLc != null ? String(d.apcaLc) : undefined}
        />
      ) : null}
      <p className="tiny">
        Affected layer: <strong>{issue.nodeName}</strong>
      </p>
      <RecommendationCard text={issue.recommendation} />
      {issue.fix && enableFixes ? (
        <p className="tiny">
          Before: {issue.fix.before} → After: {issue.fix.after}
        </p>
      ) : null}
      {issue.ruleId === "non-text-content" && onIntent ? (
        <div className="actions">
          <button type="button" className="btn btn-sm" onClick={() => onIntent("informative")}>
            Informative
          </button>
          <button type="button" className="btn btn-sm" onClick={() => onIntent("decorative")}>
            Decorative
          </button>
        </div>
      ) : null}
      {issue.category === "structure" && onRole ? (
        <label className="field">
          Semantic role
          <select
            aria-label={`Semantic role for ${issue.nodeName}`}
            defaultValue={String(d.semanticRole ?? "unspecified")}
            onChange={(e) => onRole(e.target.value)}
          >
            <option value="unspecified">Unspecified</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="paragraph">Paragraph</option>
            <option value="caption">Caption</option>
            <option value="label">Label</option>
          </select>
        </label>
      ) : null}
      <div className="actions">
        <button type="button" className="btn btn-sm btn-primary" onClick={onHighlight}>
          Highlight layer
        </button>
        {issue.fix && enableFixes ? (
          <button type="button" className="btn btn-sm" onClick={onFix}>
            Apply fix
          </button>
        ) : issue.ruleId.includes("contrast") && d.result === "FAIL" ? (
          <button type="button" className="btn btn-sm" onClick={onFix} disabled={!issue.fix}>
            Suggest fix
          </button>
        ) : null}
        <button type="button" className="btn btn-sm btn-ghost" onClick={onIgnore}>
          {issue.ignored ? "Unignore" : "Ignore"}
        </button>
      </div>
    </article>
  );
}

export function ColorContrastCard({
  foreground,
  background,
  contrast,
  required,
  result,
  apca,
}: {
  foreground: string;
  background: string;
  contrast: string;
  required: string;
  result: string;
  apca?: string;
}) {
  const fgOk = foreground.startsWith("#");
  const bgOk = background.startsWith("#");
  return (
    <div className="card" style={{ padding: 8 }}>
      <div className="color-pair">
        <div>
          <div
            className="color-chip"
            style={{ background: fgOk ? foreground : "transparent" }}
            aria-hidden="true"
          />
          <div className="tiny">Foreground {foreground}</div>
        </div>
        <div>
          <div
            className="color-chip"
            style={{ background: bgOk ? background : "transparent" }}
            aria-hidden="true"
          />
          <div className="tiny">Background {background}</div>
        </div>
      </div>
      <div className="kv" style={{ marginTop: 8 }}>
        <span>Contrast</span>
        <strong>{contrast}</strong>
        <span>Required</span>
        <strong>{required}</strong>
        <span>Result</span>
        <strong>{result}</strong>
        {apca ? (
          <>
            <span>APCA Lc</span>
            <span>{apca} (experimental)</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function RecommendationCard({ text }: { text: string }) {
  return (
    <div>
      <strong>Recommendation</strong>
      <p className="muted" style={{ margin: "4px 0 0" }}>
        {text}
      </p>
    </div>
  );
}
