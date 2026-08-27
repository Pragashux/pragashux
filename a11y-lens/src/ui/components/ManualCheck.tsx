import { MANUAL_CHECKS } from "../../constants/wcag";
import type { ManualCheckState } from "../../types";
import { CheckRow } from "./CheckRow";

export function ManualCheckList({
  states,
  onChange,
}: {
  states: ManualCheckState[];
  onChange: (next: ManualCheckState[]) => void;
}) {
  const map = new Map(states.map((s) => [s.id, s.result]));
  return (
    <section className="card">
      <h2>Manual Accessibility Checks</h2>
      <p className="muted">
        These criteria require a browser, assistive technology, or keyboard — they cannot be
        reliably determined from Figma alone.
      </p>
      {MANUAL_CHECKS.map((check) => {
        const value = map.get(check.id) ?? "unchecked";
        return (
          <CheckRow
            key={check.id}
            title={check.name}
            description={
              <>
                <p className="tiny">WCAG {check.wcag}</p>
                <p>{check.description}</p>
              </>
            }
            action={
              <label className="field">
                <span className="sr-only">Result for {check.name}</span>
                <select
                  value={value}
                  onChange={(e) => {
                    const result = e.target.value as ManualCheckState["result"];
                    const next = MANUAL_CHECKS.map((c) => ({
                      id: c.id,
                      result: c.id === check.id ? result : (map.get(c.id) ?? "unchecked"),
                    }));
                    onChange(next);
                  }}
                >
                  <option value="unchecked">Unchecked</option>
                  <option value="passed">Passed</option>
                  <option value="needs-review">Needs review</option>
                  <option value="na">Not applicable</option>
                </select>
              </label>
            }
          />
        );
      })}
    </section>
  );
}
