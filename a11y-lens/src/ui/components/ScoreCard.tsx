export function ScoreCard({
  score,
  critical,
  warnings,
  passed,
}: {
  score: number;
  critical: number;
  warnings: number;
  passed: number;
}) {
  return (
    <section className="card stack" aria-labelledby="score-heading">
      <h2 id="score-heading">Design Accessibility Score</h2>
      <div className="score-num" aria-label={`${score} out of 100`}>
        {score} <span className="tiny">/ 100</span>
      </div>
      <p className="disclaimer">
        This score is an automated design-time assessment and does not guarantee WCAG
        compliance. A11y Lens is an accessibility design assistant, not a certification.
      </p>
      <div className="stats">
        <div className="stat">
          <b>{critical}</b>
          🔴 Critical
        </div>
        <div className="stat">
          <b>{warnings}</b>
          🟠 Warnings
        </div>
        <div className="stat">
          <b>{passed}</b>
          🟢 Passed
        </div>
      </div>
    </section>
  );
}
