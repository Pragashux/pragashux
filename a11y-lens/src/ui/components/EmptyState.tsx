import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="empty card">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export function LoadingState({
  message,
  steps,
}: {
  message: string;
  steps: Array<{ id: string; label: string; done: boolean }>;
}) {
  return (
    <section className="card stack" aria-live="polite" aria-busy="true">
      <h2>Analyzing design…</h2>
      <p>{message}</p>
      <ul className="stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {steps.map((s) => (
          <li key={s.id}>
            {s.done ? "✓" : "…"} {s.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
