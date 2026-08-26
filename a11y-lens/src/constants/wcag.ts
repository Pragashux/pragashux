import type { IssueCategory, WcagLevel } from "../types";

export const PLUGIN_DATA_NAMESPACE = "a11y-lens";
export const HIGHLIGHT_FLAG = "highlight";
export const HIGHLIGHT_GROUP_NAME = "A11y Lens — temporary highlights";

export const TARGET_SIZE_MIN_PX = 24;

export const WCAG_CONTRAST = {
  AA: {
    normal: 4.5,
    large: 3,
    ui: 3,
  },
  AAA: {
    normal: 7,
    large: 4.5,
    ui: 3,
  },
} as const;

/** WCAG large text: 18pt (~24px) or 14pt bold (~18.66px). */
export const LARGE_TEXT_PX = 24;
export const LARGE_TEXT_BOLD_PX = 18.66;
export const BOLD_WEIGHT = 700;

export interface WcagCriterionMeta {
  id: string;
  title: string;
  level: WcagLevel;
  url: string;
  summary: string;
}

const W3 = "https://www.w3.org/WAI/WCAG22/Understanding";

export const WCAG_CRITERIA: Record<string, WcagCriterionMeta> = {
  "1.1.1": {
    id: "1.1.1",
    title: "Non-text Content",
    level: "A",
    url: `${W3}/non-text-content`,
    summary:
      "Non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for specific situations such as decorative images.",
  },
  "1.3.1": {
    id: "1.3.1",
    title: "Info and Relationships",
    level: "A",
    url: `${W3}/info-and-relationships`,
    summary:
      "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.",
  },
  "1.4.1": {
    id: "1.4.1",
    title: "Use of Color",
    level: "A",
    url: `${W3}/use-of-color`,
    summary:
      "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.",
  },
  "1.4.3": {
    id: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    url: `${W3}/contrast-minimum`,
    summary:
      "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large text (3:1) and incidental/logotype text.",
  },
  "1.4.4": {
    id: "1.4.4",
    title: "Resize Text",
    level: "AA",
    url: `${W3}/resize-text`,
    summary:
      "Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality.",
  },
  "1.4.6": {
    id: "1.4.6",
    title: "Contrast (Enhanced)",
    level: "AAA",
    url: `${W3}/contrast-enhanced`,
    summary:
      "The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for large text (4.5:1) and incidental/logotype text.",
  },
  "1.4.10": {
    id: "1.4.10",
    title: "Reflow",
    level: "AA",
    url: `${W3}/reflow`,
    summary:
      "Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions at a width equivalent to 320 CSS pixels.",
  },
  "1.4.11": {
    id: "1.4.11",
    title: "Non-text Contrast",
    level: "AA",
    url: `${W3}/non-text-contrast`,
    summary:
      "Visual information required to identify UI components and states, and graphical objects required to understand content, have a contrast ratio of at least 3:1 against adjacent colors.",
  },
  "1.4.12": {
    id: "1.4.12",
    title: "Text Spacing",
    level: "AA",
    url: `${W3}/text-spacing`,
    summary:
      "No loss of content or functionality occurs when users override line height, paragraph spacing, letter spacing, and word spacing to specified values.",
  },
  "2.4.6": {
    id: "2.4.6",
    title: "Headings and Labels",
    level: "AA",
    url: `${W3}/headings-and-labels`,
    summary: "Headings and labels describe topic or purpose.",
  },
  "2.4.7": {
    id: "2.4.7",
    title: "Focus Visible",
    level: "AA",
    url: `${W3}/focus-visible`,
    summary:
      "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.",
  },
  "2.4.11": {
    id: "2.4.11",
    title: "Focus Not Obscured (Minimum)",
    level: "AA",
    url: `${W3}/focus-not-obscured-minimum`,
    summary:
      "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content.",
  },
  "2.4.12": {
    id: "2.4.12",
    title: "Focus Not Obscured (Enhanced)",
    level: "AAA",
    url: `${W3}/focus-not-obscured-enhanced`,
    summary:
      "When a user interface component receives keyboard focus, no part of the focus indicator is hidden by author-created content.",
  },
  "2.5.8": {
    id: "2.5.8",
    title: "Target Size (Minimum)",
    level: "AA",
    url: `${W3}/target-size-minimum`,
    summary:
      "The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where an exception applies (spacing, equivalent, inline, user-agent, essential).",
  },
  "3.2.4": {
    id: "3.2.4",
    title: "Consistent Identification",
    level: "AA",
    url: `${W3}/consistent-identification`,
    summary:
      "Components that have the same functionality within a set of web pages are identified consistently.",
  },
  "3.3.1": {
    id: "3.3.1",
    title: "Error Identification",
    level: "A",
    url: `${W3}/error-identification`,
    summary:
      "If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.",
  },
  "3.3.2": {
    id: "3.3.2",
    title: "Labels or Instructions",
    level: "A",
    url: `${W3}/labels-or-instructions`,
    summary:
      "Labels or instructions are provided when content requires user input.",
  },
  "3.3.3": {
    id: "3.3.3",
    title: "Error Suggestion",
    level: "AA",
    url: `${W3}/error-suggestion`,
    summary:
      "If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user.",
  },
};

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  contrast: "Contrast",
  typography: "Typography",
  touch: "Touch Targets",
  forms: "Forms",
  components: "Components",
  images: "Images",
  structure: "Structure",
  color: "Use of Color",
  manual: "Manual",
};

export const MANUAL_CHECKS = [
  {
    id: "keyboard-navigation",
    name: "Keyboard navigation",
    wcag: "2.1.1",
    description:
      "Every interactive control can be reached and operated with a keyboard alone. This cannot be verified from a static Figma file.",
  },
  {
    id: "focus-order",
    name: "Logical focus order",
    wcag: "2.4.3",
    description:
      "Tab order follows a meaningful reading and interaction sequence. Layer order in Figma is not equivalent to DOM/tab order.",
  },
  {
    id: "sr-semantics",
    name: "Screen reader semantics",
    wcag: "4.1.2",
    description:
      "Roles, names, and states are exposed correctly to assistive technology in the implemented product.",
  },
  {
    id: "meaningful-alt",
    name: "Meaningful alternative text",
    wcag: "1.1.1",
    description:
      "Informative images have equivalent text alternatives; decorative images are hidden from assistive technology.",
  },
  {
    id: "motion",
    name: "Motion and animation behavior",
    wcag: "2.3.3 / 2.2.2",
    description:
      "Motion can be paused, stopped, or hidden; vestibular and seizure risks are considered. Prototype interactions are not a complete test.",
  },
  {
    id: "live-regions",
    name: "Dynamic content announcements",
    wcag: "4.1.3",
    description:
      "Status messages can be programmatically determined and announced without receiving focus.",
  },
  {
    id: "keyboard-traps",
    name: "Keyboard traps",
    wcag: "2.1.2",
    description:
      "Keyboard focus can move away from every component using only the keyboard.",
  },
  {
    id: "reading-order",
    name: "Reading order",
    wcag: "1.3.2",
    description:
      "A correct reading sequence can be programmatically determined. Visual layout in Figma does not guarantee DOM order.",
  },
  {
    id: "content-clarity",
    name: "Content clarity",
    wcag: "3.1.5 / 3.2.4",
    description:
      "Language, headings, and labels are understandable and consistent. Requires human review of copy and IA.",
  },
  {
    id: "interaction-behavior",
    name: "Interaction behavior",
    wcag: "3.2.1 / 3.2.2",
    description:
      "Focus and input do not cause unexpected context changes. Requires a working prototype or implementation.",
  },
] as const;
