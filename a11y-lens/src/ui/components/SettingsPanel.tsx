import type { PluginSettings, WcagLevel } from "../../types";

export function SettingsPanel({
  settings,
  onChange,
}: {
  settings: PluginSettings;
  onChange: (next: PluginSettings) => void;
}) {
  const set = (patch: Partial<PluginSettings>) => onChange({ ...settings, ...patch });
  return (
    <section className="card stack">
      <h2>Settings</h2>
      <fieldset className="stack" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend>WCAG level</legend>
        <div className="row" role="radiogroup" aria-label="WCAG level">
          {(["A", "AA", "AAA"] as WcagLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              className={`btn ${settings.wcagLevel === level ? "btn-primary" : ""}`}
              aria-pressed={settings.wcagLevel === level}
              onClick={() => set({ wcagLevel: level })}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="tiny">Default is AA. AAA uses 7:1 / 4.5:1 text contrast (1.4.6).</p>
      </fieldset>
      <Toggle
        label="Include experimental checks"
        hint="Adds APCA perceptual contrast as extra context. WCAG ratios remain the compliance metric."
        checked={settings.includeExperimental}
        onChange={(v) => set({ includeExperimental: v })}
      />
      <Toggle
        label="Show manual checks"
        checked={settings.showManualChecks}
        onChange={(v) => set({ showManualChecks: v })}
      />
      <Toggle
        label="Automatically highlight issues"
        checked={settings.autoHighlight}
        onChange={(v) => set({ autoHighlight: v })}
      />
      <Toggle
        label="Show WCAG references"
        checked={settings.showWcagReferences}
        onChange={(v) => set({ showWcagReferences: v })}
      />
      <Toggle
        label="Enable suggested fixes"
        checked={settings.enableSuggestedFixes}
        onChange={(v) => set({ enableSuggestedFixes: v })}
      />
      <label className="field">
        Readability flag threshold (px)
        <input
          type="number"
          min={8}
          max={16}
          value={settings.smallTextPx}
          onChange={(e) => set({ smallTextPx: Number(e.target.value) })}
        />
      </label>
      <label className="field">
        Theme
        <select
          value={settings.theme}
          onChange={(e) => set({ theme: e.target.value as PluginSettings["theme"] })}
        >
          <option value="system">System / Figma</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </section>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="toggle">
      <div>
        <label htmlFor={id}>{label}</label>
        {hint ? <p className="tiny">{hint}</p> : null}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}
