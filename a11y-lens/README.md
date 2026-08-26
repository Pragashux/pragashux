# A11y Lens

**A11y Lens** is a Figma plugin that audits frames, components, and pages against **WCAG 2.2** at design time. It is an **automated accessibility design assistant**, not a WCAG certification.

It analyzes the current selection, the current page, or the entire file, then reports:

- Color contrast (WCAG 2 ratios; optional experimental APCA)
- Typography and readability risks
- Touch / pointer target size (2.5.8 approximation)
- Likely buttons, links, inputs, and other interactive components
- Focus-variant coverage in component sets
- Form labeling heuristics
- Images that still need informative vs decorative classification
- Heading / structure hints
- A dedicated **manual check** list for criteria Figma cannot prove

Statuses are explicit:

| Status | Meaning |
| --- | --- |
| Passed | Automated check met the configured WCAG level |
| Failed | Automated check did not meet the criterion |
| Needs Review | Heuristic risk or unreliable geometry/color |
| Manual Check Required | Requires browser, keyboard, or AT testing |

## Installation (Figma)

1. `cd a11y-lens && npm install && npm run build`
2. In Figma Desktop: **Plugins → Development → Import plugin from manifest…**
3. Select `a11y-lens/manifest.json`
4. Run **A11y Lens** from the development plugins menu
5. Select a frame and click **Analyze Selection**

The plugin UI also runs in a browser for UI development:

```bash
cd a11y-lens
npm install
npm run preview
```

Open `http://127.0.0.1:5173/` — preview mode uses a sample checkout frame (no Figma API).

## Development

```bash
cd a11y-lens
npm install
npm run build      # typecheck + UI bundle + plugin sandbox bundle
npm test           # vitest unit tests
npm run typecheck
```

Watch (rebuild `dist/` as you edit):

```bash
npm run dev
```

Then reload the plugin in Figma.

## Build outputs

| File | Role |
| --- | --- |
| `manifest.json` | Figma plugin manifest |
| `dist/code.js` | Main-thread plugin (`src/code.ts`) |
| `dist/index.html` | Inlined React UI |

## Architecture

```
a11y-lens/
├── manifest.json
├── src/
│   ├── code.ts                 # Figma sandbox: walk nodes, highlight, apply fixes
│   ├── types/                  # Shared types
│   ├── constants/wcag.ts       # WCAG 2.2 metadata + manual checklist
│   ├── accessibility/          # Pure rules engine (testable without Figma)
│   ├── services/               # Serialize, highlight, fixes, reports
│   ├── utils/                  # Color math, debounce
│   └── ui/                     # React plugin UI
└── tests/
```

The Figma main thread **serializes** visible nodes (fills, typography, variants, plugin metadata) and the **pure engine** evaluates rules. That split keeps contrast/target-size tests fast and hermetic.

Only documented Figma Plugin APIs are used (`figma.showUI`, `getNodeByIdAsync`, `clientStorage`, `viewport.scrollAndZoomIntoView`, component `clone`, `setPluginData`, etc.).

## WCAG rules

See [WCAG_RULES.md](./WCAG_RULES.md) for every automated, semi-automated, and manual rule.

## Limitations (read this)

- Figma pixels are a **design-time approximation** of CSS pixels.
- Visual hierarchy is **not** HTML heading structure.
- Layer names are **not** alt text.
- Hover variants are **not** keyboard focus.
- Gradients, photos, and glass overlays cannot be certified automatically — they are **Needs Review**.
- The numeric **Design Accessibility Score** is a weighted heuristic, not a conformance claim.

## Testing

```bash
npm test
```

Coverage includes contrast (#FFF/#000 = 21:1, #777/#FFF ≈ 4.48:1), large-text detection, target-size 24×24, and sample-document rule evaluation.

## Future roadmap

- Component-library specific mappings (e.g. named “Focus” tokens)
- Reading-order overlay using auto-layout flow
- Team-shared ignore lists
- CI export hooked to design-lint bots

## License

Private / portfolio plugin unless otherwise specified.
