export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress" role="group" aria-label={label}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-bar" aria-hidden="true">
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
