# A11y Lens — WCAG 2.2 rules

This catalog is the source of truth for what the plugin **claims**. Accuracy over volume.

Official spec: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Understanding docs are linked from each issue in the UI.

## Automated

These run on serialized Figma nodes when data is reliable (solid fills, measurable bounds).

| Rule ID | Name | Criterion | Level | Pass / fail logic |
| --- | --- | --- | --- | --- |
| `contrast-normal-text` | Normal text contrast | 1.4.3 or 1.4.6 | AA / AAA | Solid text on a **reliably resolved** solid background. AA 4.5:1, AAA 7:1. |
| `contrast-large-text` | Large text contrast | 1.4.3 or 1.4.6 | AA / AAA | Large text = ≥24px or ≥18.66px and weight ≥700. AA 3:1, AAA 4.5:1. |
| `non-text-contrast` | UI component contrast | 1.4.11 | AA | Solid component fill vs adjacent solid background, 3:1. |
| `target-size-minimum` | Target size (minimum) | 2.5.8 | AA | Likely interactive control ≥24×24 Figma units (CSS-px **approximation**). Inline links → Needs Review (exception). |

## Semi-automated (Needs Review)

Heuristics that can be wrong. Never reported as certified passes when data is missing.

| Rule ID | Name | Criterion | Why review |
| --- | --- | --- | --- |
| `contrast-normal-text` (complex bg) | Background cannot be determined | 1.4.3 / 1.4.6 | Gradient, image, pattern, or incomplete opacity stack. |
| `text-size-readability` | Very small text | 1.4.4 | WCAG has **no universal minimum font size**. Flag is a readability heuristic (default 12px). |
| `text-spacing-risk` | Tight line height | 1.4.12 | Line height &lt; 1.35× font size may break user text-spacing overrides. |
| `use-of-color` | Information may rely on color | 1.4.1 | Status/chart/selection naming + red/green fills. Color blindness is **not** detected. |
| `form-visible-label` | Missing / placeholder label | 3.3.2 | Name and sibling text heuristics. |
| `focus-visible-variant` | Focus state may be missing | 2.4.7 | Hover variant without Focus. Does not prove keyboard behavior. |
| `heading-structure` | Multiple visual H1s | 1.3.1 | Size/name inference only. |
| `component-consistency` | Inconsistent button height | 3.2.4 | Design-system signal, not page-set identification in HTML. |
| `non-text-content` | Image detected | 1.1.1 | Designer must mark Informative vs Decorative. Layer name ≠ alt. |

## Manual only

Shown in **Manual Checks** and/or as ℹ️ issues. The plugin cannot pass or fail these from a static file.

| Check | Typical criteria | Why Figma is insufficient |
| --- | --- | --- |
| Keyboard navigation | 2.1.1 | No real focus ring or key events |
| Logical focus order | 2.4.3 | Layer order ≠ tab order |
| Screen reader semantics | 4.1.2 | No accessibility tree |
| Meaningful alt text | 1.1.1 | Intent is human |
| Motion / animation | 2.2.2, 2.3.3 | Prototypes are incomplete |
| Dynamic announcements | 4.1.3 | Runtime only |
| Keyboard traps | 2.1.2 | Runtime only |
| Reading order | 1.3.2 | Auto-layout is a hint, not DOM |
| Content clarity | 3.1.x | Copy review |
| Interaction behavior | 3.2.1, 3.2.2 | Runtime only |
| Focus not obscured | 2.4.11, 2.4.12 | Sticky headers exist only in product |
| Error identification / suggestion | 3.3.1, 3.3.3 | Need working validation |
| Reflow at 320 CSS px | 1.4.10 | Need implemented UI |
| Resize text 200% | 1.4.4 | Need implemented UI |

## Experimental (opt-in)

| Metric | Use |
| --- | --- |
| APCA Lc | Extra perceptual contrast context on contrast cards. **Not** used as a WCAG pass/fail. |

## Scoring

**Design Accessibility Score** = weighted average of Contrast (30%), Touch (20%), Components (20%), Typography (15%), Forms (15%). Failed critical checks penalize more than Needs Review. Manual items do not inflate the score. The UI states this is **not** a conformance certificate.
