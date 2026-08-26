import type { ReactNode } from "react";

export function CheckRow({
  title,
  description,
  action,
}: {
  title: string;
  description: ReactNode;
  action: ReactNode;
}) {
  return (
    <div className="check-row">
      <div>
        <strong>{title}</strong>
        <div className="muted">{description}</div>
      </div>
      {action}
    </div>
  );
}
