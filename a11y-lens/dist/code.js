"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // src/accessibility/interactive.ts
  var PATTERNS = [
    { kind: "date-picker", re: /\b(date\s*picker|datepicker|calendar)\b/i },
    { kind: "dropdown", re: /\b(dropdown|select menu|combobox|combo box)\b/i },
    { kind: "select", re: /\b(select|picker)\b/i },
    { kind: "textarea", re: /\b(textarea|text area|multiline)\b/i },
    { kind: "input", re: /\b(input|text field|textfield|search field|email field|password)\b/i },
    { kind: "checkbox", re: /\b(checkbox|check box)\b/i },
    { kind: "radio", re: /\b(radio)\b/i },
    { kind: "tab", re: /\b(tab item|tab)\b/i },
    { kind: "icon-button", re: /\b(icon button|iconbtn|icon-btn)\b/i },
    { kind: "button", re: /\b(button|btn|cta)\b/i },
    { kind: "link", re: /\b(link|anchor|hyperlink)\b/i },
    { kind: "card", re: /\b(card|tile)\b/i }
  ];
  function detectInteractiveKind(node) {
    var _a;
    const hay = `${node.name} ${(_a = node.componentName) != null ? _a : ""} ${node.type}`;
    for (const { kind, re } of PATTERNS) {
      if (re.test(hay)) return kind;
    }
    if (node.variantProperties) {
      const keys = Object.keys(node.variantProperties).join(" ").toLowerCase();
      if (/\b(state|status|interaction)\b/.test(keys)) {
        const w = node.width;
        const h = node.height;
        if (w <= 48 && h <= 48) return "icon-button";
        return "button";
      }
    }
    return null;
  }
  function isFormControl(kind) {
    return kind === "input" || kind === "textarea" || kind === "checkbox" || kind === "radio" || kind === "select" || kind === "date-picker";
  }
  function looksPlaceholderOnly(node) {
    var _a;
    const text = ((_a = node.characters) != null ? _a : "").trim().toLowerCase();
    const name = node.name.toLowerCase();
    if (!text && !name.includes("placeholder")) return false;
    if (name.includes("placeholder")) return true;
    if (/^(enter |type |search|email|password|your )/.test(text)) return true;
    return false;
  }
  function hasVisibleLabelSignal(node, siblings) {
    if (node.hasVisibleTextChild) return true;
    const nearby = siblings.filter(
      (s) => {
        var _a;
        return s.id !== node.id && s.type === "TEXT" && ((_a = s.characters) != null ? _a : "").trim().length > 0;
      }
    );
    return nearby.length > 0;
  }
  var FOCUS_KEYS = ["focus", "focused", "keyboard focus", ":focus"];
  var HOVER_KEYS = ["hover", "hovered"];
  var DEFAULT_KEYS = ["default", "enabled", "rest"];
  function variantStates(node) {
    var _a, _b, _c;
    const labels = [
      ...(_a = node.componentSetVariants) != null ? _a : [],
      ...Object.values((_b = node.variantProperties) != null ? _b : {}),
      ...Object.keys((_c = node.variantProperties) != null ? _c : {})
    ].map((s) => s.toLowerCase());
    const has = (keys) => labels.some((l) => keys.some((k) => l.includes(k)));
    return {
      hasDefault: has(DEFAULT_KEYS) || labels.length === 0,
      hasHover: has(HOVER_KEYS),
      hasFocus: has(FOCUS_KEYS),
      hasPressed: labels.some((l) => l.includes("press") || l.includes("active")),
      hasDisabled: labels.some((l) => l.includes("disabled")),
      hasSelected: labels.some((l) => l.includes("selected") || l.includes("checked")),
      labels
    };
  }

  // src/constants/wcag.ts
  var PLUGIN_DATA_NAMESPACE = "a11y-lens";
  var HIGHLIGHT_FLAG = "highlight";
  var HIGHLIGHT_GROUP_NAME = "A11y Lens \u2014 temporary highlights";
  var TARGET_SIZE_MIN_PX = 24;
  var WCAG_CONTRAST = {
    AA: {
      normal: 4.5,
      large: 3,
      ui: 3
    },
    AAA: {
      normal: 7,
      large: 4.5,
      ui: 3
    }
  };
  var LARGE_TEXT_PX = 24;
  var LARGE_TEXT_BOLD_PX = 18.66;
  var BOLD_WEIGHT = 700;
  var W3 = "https://www.w3.org/WAI/WCAG22/Understanding";
  var WCAG_CRITERIA = {
    "1.1.1": {
      id: "1.1.1",
      title: "Non-text Content",
      level: "A",
      url: `${W3}/non-text-content`,
      summary: "Non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for specific situations such as decorative images."
    },
    "1.3.1": {
      id: "1.3.1",
      title: "Info and Relationships",
      level: "A",
      url: `${W3}/info-and-relationships`,
      summary: "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text."
    },
    "1.4.1": {
      id: "1.4.1",
      title: "Use of Color",
      level: "A",
      url: `${W3}/use-of-color`,
      summary: "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
    },
    "1.4.3": {
      id: "1.4.3",
      title: "Contrast (Minimum)",
      level: "AA",
      url: `${W3}/contrast-minimum`,
      summary: "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large text (3:1) and incidental/logotype text."
    },
    "1.4.4": {
      id: "1.4.4",
      title: "Resize Text",
      level: "AA",
      url: `${W3}/resize-text`,
      summary: "Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality."
    },
    "1.4.6": {
      id: "1.4.6",
      title: "Contrast (Enhanced)",
      level: "AAA",
      url: `${W3}/contrast-enhanced`,
      summary: "The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for large text (4.5:1) and incidental/logotype text."
    },
    "1.4.10": {
      id: "1.4.10",
      title: "Reflow",
      level: "AA",
      url: `${W3}/reflow`,
      summary: "Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions at a width equivalent to 320 CSS pixels."
    },
    "1.4.11": {
      id: "1.4.11",
      title: "Non-text Contrast",
      level: "AA",
      url: `${W3}/non-text-contrast`,
      summary: "Visual information required to identify UI components and states, and graphical objects required to understand content, have a contrast ratio of at least 3:1 against adjacent colors."
    },
    "1.4.12": {
      id: "1.4.12",
      title: "Text Spacing",
      level: "AA",
      url: `${W3}/text-spacing`,
      summary: "No loss of content or functionality occurs when users override line height, paragraph spacing, letter spacing, and word spacing to specified values."
    },
    "2.4.6": {
      id: "2.4.6",
      title: "Headings and Labels",
      level: "AA",
      url: `${W3}/headings-and-labels`,
      summary: "Headings and labels describe topic or purpose."
    },
    "2.4.7": {
      id: "2.4.7",
      title: "Focus Visible",
      level: "AA",
      url: `${W3}/focus-visible`,
      summary: "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible."
    },
    "2.4.11": {
      id: "2.4.11",
      title: "Focus Not Obscured (Minimum)",
      level: "AA",
      url: `${W3}/focus-not-obscured-minimum`,
      summary: "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content."
    },
    "2.4.12": {
      id: "2.4.12",
      title: "Focus Not Obscured (Enhanced)",
      level: "AAA",
      url: `${W3}/focus-not-obscured-enhanced`,
      summary: "When a user interface component receives keyboard focus, no part of the focus indicator is hidden by author-created content."
    },
    "2.5.8": {
      id: "2.5.8",
      title: "Target Size (Minimum)",
      level: "AA",
      url: `${W3}/target-size-minimum`,
      summary: "The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where an exception applies (spacing, equivalent, inline, user-agent, essential)."
    },
    "3.2.4": {
      id: "3.2.4",
      title: "Consistent Identification",
      level: "AA",
      url: `${W3}/consistent-identification`,
      summary: "Components that have the same functionality within a set of web pages are identified consistently."
    },
    "3.3.1": {
      id: "3.3.1",
      title: "Error Identification",
      level: "A",
      url: `${W3}/error-identification`,
      summary: "If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text."
    },
    "3.3.2": {
      id: "3.3.2",
      title: "Labels or Instructions",
      level: "A",
      url: `${W3}/labels-or-instructions`,
      summary: "Labels or instructions are provided when content requires user input."
    },
    "3.3.3": {
      id: "3.3.3",
      title: "Error Suggestion",
      level: "AA",
      url: `${W3}/error-suggestion`,
      summary: "If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user."
    }
  };

  // src/accessibility/issueFactory.ts
  var seq = 0;
  function resetIssueSeq() {
    seq = 0;
  }
  function makeIssue(input) {
    var _a, _b, _c, _d;
    const meta = WCAG_CRITERIA[input.wcagCriterion];
    seq += 1;
    return {
      id: `${input.ruleId}:${input.nodeId}:${seq}`,
      ruleId: input.ruleId,
      name: input.name,
      description: input.description,
      wcagCriterion: input.wcagCriterion,
      wcagTitle: (_a = meta == null ? void 0 : meta.title) != null ? _a : input.name,
      wcagUrl: (_b = meta == null ? void 0 : meta.url) != null ? _b : "https://www.w3.org/TR/WCAG22/",
      level: (_d = (_c = input.levelOverride) != null ? _c : meta == null ? void 0 : meta.level) != null ? _d : "AA",
      severity: input.severity,
      status: input.status,
      nodeId: input.nodeId,
      nodeName: input.nodeName,
      category: input.category,
      recommendation: input.recommendation,
      automated: input.automated,
      manualReview: input.manualReview,
      details: input.details,
      fix: input.fix,
      ignored: input.ignored
    };
  }

  // src/accessibility/consistency.ts
  function findInconsistentButtons(nodes) {
    const buttons = nodes.filter((n) => detectInteractiveKind(n) === "button" && n.visible);
    if (buttons.length < 3) return [];
    const heights = buttons.map((b) => Math.round(b.height));
    const median = [...heights].sort((a, b) => a - b)[Math.floor(heights.length / 2)];
    const outliers = buttons.filter((b) => Math.abs(b.height - median) >= 12);
    return outliers.slice(0, 8).map(
      (node) => makeIssue({
        ruleId: "component-consistency",
        name: "Inconsistent button height",
        description: `This button is ${Math.round(node.height)}px tall while similar buttons cluster around ${median}px. WCAG 3.2.4 is about consistent identification in the product, not identical Figma sizes \u2014 treat this as a design-system review signal.`,
        wcagCriterion: "3.2.4",
        severity: "warning",
        status: "needs-review",
        nodeId: node.id,
        nodeName: node.name,
        category: "components",
        recommendation: "Align interactive patterns (height, label style, iconography) so the same action looks the same across frames.",
        automated: true,
        manualReview: true,
        details: { height: node.height, median }
      })
    );
  }

  // src/accessibility/apca.ts
  function linearizeSrgb(c) {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }
  function srgbY({ r, g, b }) {
    return 0.2126729 * linearizeSrgb(r) + 0.7151522 * linearizeSrgb(g) + 0.072175 * linearizeSrgb(b);
  }
  var Nrm = 0.14;
  var BgClip = 0.022;
  var Wscale = 1.14;
  var Woffset = 0.027;
  var Rscale = 1.414;
  function clampY(y) {
    if (y >= 0) {
      if (y < BgClip) {
        y += Math.pow(BgClip - y, 1.414);
      }
      return Math.max(y, 0);
    }
    return 0;
  }
  function apcaLc(text, background) {
    let yTxt = clampY(srgbY(text));
    let yBg = clampY(srgbY(background));
    let sapc = 0;
    let lc = 0;
    if (Math.abs(yBg - yTxt) < 5e-4) {
      return 0;
    }
    if (yBg > yTxt) {
      sapc = (Math.pow(yBg, Nrm) - Math.pow(yTxt, Nrm)) * Wscale;
      lc = sapc < 0.1 ? 0 : sapc * 100 - Woffset * 100;
    } else {
      sapc = (Math.pow(yBg, Nrm) - Math.pow(yTxt, Nrm)) * Wscale;
      lc = sapc > -0.1 ? 0 : sapc * 100 + Woffset * 100;
    }
    return Math.round(lc * 10) / 10;
  }
  function apcaNote(lc) {
    const abs = Math.abs(lc);
    if (abs >= 75) return "APCA Lc suggests strong contrast for body text (experimental).";
    if (abs >= 60) return "APCA Lc may be acceptable for body text (experimental).";
    if (abs >= 45) return "APCA Lc may be limited to large text (experimental).";
    return "APCA Lc suggests insufficient perceptual contrast (experimental).";
  }

  // src/utils/color.ts
  var HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
  function parseHex(hex) {
    const raw = hex.trim();
    const match = HEX.exec(raw);
    if (!match) {
      throw new Error(`Invalid hex color: ${hex}`);
    }
    let h = match[1];
    if (h.length === 3) {
      h = h.split("").map((c) => c + c).join("");
    }
    if (h.length === 8) {
      h = h.slice(0, 6);
    }
    const n = parseInt(h, 16);
    return {
      r: n >> 16 & 255,
      g: n >> 8 & 255,
      b: n & 255
    };
  }
  function tryParseHex(hex) {
    try {
      return parseHex(hex);
    } catch (e) {
      return null;
    }
  }
  function rgbToHex({ r, g, b }) {
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return "#" + [clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  }
  function figmaRgbToRgb(color) {
    return {
      r: Math.round(color.r * 255),
      g: Math.round(color.g * 255),
      b: Math.round(color.b * 255)
    };
  }
  function rgbToFigma(rgb) {
    return {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255
    };
  }
  function relativeLuminance(rgb) {
    const channel = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const R = channel(rgb.r);
    const G = channel(rgb.g);
    const B = channel(rgb.b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  function contrastRatio(fg, bg) {
    const L1 = relativeLuminance(fg);
    const L2 = relativeLuminance(bg);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  function formatRatio(ratio, digits = 2) {
    return `${ratio.toFixed(digits)}:1`;
  }
  function compositeOver(src, srcA, dst) {
    const a = Math.max(0, Math.min(1, srcA));
    return {
      r: src.r * a + dst.r * (1 - a),
      g: src.g * a + dst.g * (1 - a),
      b: src.b * a + dst.b * (1 - a)
    };
  }
  function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = (h % 360 + 360) % 360 / 60;
    const x = c * (1 - Math.abs(hp % 2 - 1));
    let r1 = 0, g1 = 0, b1 = 0;
    if (hp >= 0 && hp < 1) {
      r1 = c;
      g1 = x;
    } else if (hp < 2) {
      r1 = x;
      g1 = c;
    } else if (hp < 3) {
      g1 = c;
      b1 = x;
    } else if (hp < 4) {
      g1 = x;
      b1 = c;
    } else if (hp < 5) {
      r1 = x;
      b1 = c;
    } else {
      r1 = c;
      b1 = x;
    }
    const m = l - c / 2;
    return {
      r: (r1 + m) * 255,
      g: (g1 + m) * 255,
      b: (b1 + m) * 255
    };
  }
  function rgbToHsl({ r, g, b }) {
    const R = r / 255;
    const G = g / 255;
    const B = b / 255;
    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);
    const l = (max + min) / 2;
    if (max === min) {
      return { h: 0, s: 0, l };
    }
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) * 60;
    else if (max === G) h = ((B - R) / d + 2) * 60;
    else h = ((R - G) / d + 4) * 60;
    return { h, s, l };
  }
  function suggestAccessibleColor(fg, bg, required) {
    if (contrastRatio(fg, bg) >= required - 5e-3) {
      return fg;
    }
    const { h, s } = rgbToHsl(fg);
    const bgL = relativeLuminance(bg);
    const preferLighter = bgL < 0.5;
    const sample = (l) => hslToRgb(h, s, l);
    let best = null;
    const step = 2e-3;
    if (preferLighter) {
      for (let l = rgbToHsl(fg).l; l <= 1; l += step) {
        const rgb = sample(Math.min(1, l));
        const ratio = contrastRatio(rgb, bg);
        if (ratio >= required) {
          return rgb;
        }
        if (!best || ratio > best.ratio) best = { rgb, l, ratio };
      }
    } else {
      for (let l = rgbToHsl(fg).l; l >= 0; l -= step) {
        const rgb = sample(Math.max(0, l));
        const ratio = contrastRatio(rgb, bg);
        if (ratio >= required) {
          return rgb;
        }
        if (!best || ratio > best.ratio) best = { rgb, l, ratio };
      }
    }
    for (let l = 0; l <= 1; l += step) {
      const rgb = sample(l);
      const ratio = contrastRatio(rgb, bg);
      if (ratio >= required) {
        return rgb;
      }
    }
    return best ? best.rgb : null;
  }

  // src/accessibility/typography.ts
  function isLargeText(fontSizePx, fontWeight) {
    if (fontSizePx >= LARGE_TEXT_PX) return true;
    if (fontSizePx >= LARGE_TEXT_BOLD_PX && fontWeight >= BOLD_WEIGHT) return true;
    return false;
  }
  function inferWeight(style, numeric) {
    if (typeof numeric === "number" && Number.isFinite(numeric)) {
      return numeric;
    }
    const s = (style != null ? style : "").toLowerCase();
    if (s.includes("thin") || s.includes("hairline")) return 100;
    if (s.includes("extralight") || s.includes("ultralight")) return 200;
    if (s.includes("light")) return 300;
    if (s.includes("medium")) return 500;
    if (s.includes("semibold") || s.includes("demibold") || s.includes("semi bold")) {
      return 600;
    }
    if (s.includes("extrabold") || s.includes("ultrabold") || s.includes("heavy") || s.includes("black")) {
      return 800;
    }
    if (s.includes("bold")) return 700;
    if (s.includes("regular") || s.includes("book") || s.includes("normal")) return 400;
    return 400;
  }
  function inferHeadingLevel(fontSizePx, fontWeight, name) {
    const n = name.toLowerCase();
    if (/\bh1\b/.test(n) || n.includes("heading 1") || n.includes("headline")) return "h1";
    if (/\bh2\b/.test(n) || n.includes("heading 2") || n.includes("title")) return "h2";
    if (/\bh3\b/.test(n) || n.includes("heading 3") || n.includes("subtitle")) return "h3";
    if (/\bh4\b/.test(n) || n.includes("heading 4")) return "h4";
    if (n.includes("caption") || n.includes("legal") || n.includes("fine print")) {
      return "caption";
    }
    if (fontSizePx >= 32 && fontWeight >= 600) return "h1";
    if (fontSizePx >= 24 && fontWeight >= 600) return "h2";
    if (fontSizePx >= 20 && fontWeight >= 600) return "h3";
    if (fontSizePx >= 16 && fontWeight >= 600) return "h4";
    if (fontSizePx < 12) return "caption";
    return "body";
  }
  function lineHeightRatio(lineHeightPx, fontSizePx) {
    if (!lineHeightPx || fontSizePx <= 0) return null;
    return lineHeightPx / fontSizePx;
  }

  // src/accessibility/contrast.ts
  function requiredContrast(context, level) {
    const table = level === "AAA" ? WCAG_CONTRAST.AAA : WCAG_CONTRAST.AA;
    if (context === "large-text") return table.large;
    if (context === "ui" || context === "graphical") return table.ui;
    return table.normal;
  }
  function evaluateTextContrast(input) {
    const fg = parseHex(input.fgHex);
    const bg = parseHex(input.bgHex);
    const largeText = isLargeText(input.fontSizePx, input.fontWeight);
    const context = largeText ? "large-text" : "normal-text";
    const required = requiredContrast(context, input.settings.wcagLevel);
    const ratio = contrastRatio(fg, bg);
    return {
      ratio,
      required,
      context,
      passes: ratio + 1e-9 >= required,
      largeText
    };
  }
  function evaluateUiContrast(fg, bg, level) {
    const required = requiredContrast("ui", level);
    const ratio = contrastRatio(fg, bg);
    return { ratio, required, passes: ratio + 1e-9 >= required };
  }
  function contrastSuggestion(fgHex, bgHex, required) {
    const fg = parseHex(fgHex);
    const bg = parseHex(bgHex);
    const suggestedRgb = suggestAccessibleColor(fg, bg, required);
    if (!suggestedRgb) {
      return { current: normalizeHex(fgHex), suggested: null, afterRatio: null };
    }
    const suggested = rgbToHex(suggestedRgb);
    return {
      current: normalizeHex(fgHex),
      suggested,
      afterRatio: contrastRatio(suggestedRgb, bg)
    };
  }
  function normalizeHex(hex) {
    const parsed = parseHex(hex);
    return rgbToHex(parsed);
  }

  // src/accessibility/score.ts
  var WEIGHT = {
    contrast: 0.3,
    typography: 0.15,
    touch: 0.2,
    forms: 0.15,
    components: 0.2,
    images: 0,
    structure: 0,
    color: 0,
    manual: 0
  };
  function issuePenalty(issue) {
    if (issue.ignored || issue.status === "passed" || issue.status === "manual") {
      return 0;
    }
    if (issue.status === "failed" && issue.severity === "critical") return 1;
    if (issue.status === "failed") return 0.7;
    if (issue.status === "needs-review") return 0.25;
    return 0;
  }
  function categoryScore(issues, category) {
    const relevant = issues.filter((i) => i.category === category && !i.ignored);
    const automated = relevant.filter((i) => i.automated);
    if (automated.length === 0) return 100;
    const penalties = automated.reduce((sum, i) => sum + issuePenalty(i), 0);
    const raw = 1 - penalties / automated.length;
    return Math.round(Math.max(0, Math.min(1, raw)) * 100);
  }
  function computeScore(issues) {
    const breakdown = {
      contrast: categoryScore(issues, "contrast"),
      typography: categoryScore(issues, "typography"),
      touch: categoryScore(issues, "touch"),
      forms: categoryScore(issues, "forms"),
      components: categoryScore(issues, "components")
    };
    const weighted = breakdown.contrast * WEIGHT.contrast + breakdown.typography * WEIGHT.typography + breakdown.touch * WEIGHT.touch + breakdown.forms * WEIGHT.forms + breakdown.components * WEIGHT.components;
    return { score: Math.round(weighted), breakdown };
  }
  function countByStatus(issues) {
    const visible = issues.filter((i) => !i.ignored);
    return {
      passed: visible.filter((i) => i.status === "passed").length,
      failed: visible.filter((i) => i.status === "failed").length,
      warning: visible.filter((i) => i.status === "needs-review").length,
      manual: visible.filter((i) => i.status === "manual").length,
      ignored: issues.filter((i) => i.ignored).length,
      critical: visible.filter((i) => i.severity === "critical" && i.status === "failed").length
    };
  }

  // src/accessibility/targetSize.ts
  function evaluateTargetSize(width, height, kind) {
    const min = TARGET_SIZE_MIN_PX;
    const passes = width + 1e-6 >= min && height + 1e-6 >= min;
    return {
      width,
      height,
      min,
      passes,
      maybeInlineException: kind === "link",
      maybeSpacingException: !passes && kind === "icon-button",
      approximationNote: "Figma dimensions are a design-time approximation of CSS pixels and do not guarantee implemented target size."
    };
  }
  function wouldPassWithResize(width, height, min = TARGET_SIZE_MIN_PX) {
    return {
      width: Math.max(width, min),
      height: Math.max(height, min)
    };
  }

  // src/accessibility/engine.ts
  function firstSolid(paints) {
    const solid = paints.find((p) => p.visible && p.type === "SOLID" && p.hex);
    return (solid == null ? void 0 : solid.hex) ? { hex: solid.hex } : null;
  }
  function hasComplexPaint(paints) {
    return paints.some(
      (p) => p.visible && (p.type === "GRADIENT" || p.type === "IMAGE" || p.type === "VIDEO" || p.type === "PATTERN")
    );
  }
  function applyIgnore(node, issue) {
    if (node.ignoredIssueIds.includes(issue.ruleId) || node.ignoredIssueIds.includes(issue.id)) {
      return __spreadProps(__spreadValues({}, issue), { ignored: true });
    }
    return issue;
  }
  function analyzeDocument(input) {
    var _a, _b;
    resetIssueSeq();
    const { nodes, settings } = input;
    const issues = [];
    const byParent = /* @__PURE__ */ new Map();
    for (const n of nodes) {
      const list = (_a = byParent.get(n.parentId)) != null ? _a : [];
      list.push(n);
      byParent.set(n.parentId, list);
    }
    const textNodes = nodes.filter((n) => n.type === "TEXT" && n.visible);
    const imageLike = nodes.filter(
      (n) => n.visible && (n.type === "RECTANGLE" || n.type === "ELLIPSE" || n.type === "FRAME" || n.type === "COMPONENT" || n.type === "INSTANCE") && n.fills.some((f) => f.visible && f.type === "IMAGE")
    );
    for (const node of textNodes) {
      issues.push(...analyzeTextNode(node, settings));
    }
    for (const node of nodes) {
      if (!node.visible) continue;
      const kind = detectInteractiveKind(node);
      const siblings = (_b = byParent.get(node.parentId)) != null ? _b : [];
      if (kind) {
        issues.push(...analyzeInteractive(node, kind, siblings, settings));
      }
      if (kind && (node.isComponent || node.isInstance || node.isComponentSet)) {
        issues.push(...analyzeFocusVariants(node));
      }
    }
    issues.push(...analyzeColorOnly(nodes));
    issues.push(...analyzeImages(imageLike));
    issues.push(...analyzeHeadingStructure(textNodes));
    issues.push(...analyzeComponentConsistency(nodes));
    const scored = computeScore(issues);
    const counts = countByStatus(issues);
    return {
      scope: input.scope,
      fileName: input.fileName,
      pageName: input.pageName,
      analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
      nodeCount: nodes.length,
      issues,
      passedCount: counts.passed,
      failedCount: counts.failed,
      warningCount: counts.warning,
      manualCount: counts.manual,
      ignoredCount: counts.ignored,
      score: scored.score,
      breakdown: scored.breakdown,
      progress: {
        stage: "complete",
        complete: true,
        message: "Analysis complete.",
        steps: [
          { id: "structure", label: "Structure", done: true },
          { id: "typography", label: "Typography", done: true },
          { id: "colors", label: "Colors", done: true },
          { id: "components", label: "Components", done: true },
          { id: "touch", label: "Touch targets", done: true },
          { id: "rules", label: "Accessibility rules", done: true }
        ]
      }
    };
  }
  function analyzeTextNode(node, settings) {
    var _a, _b, _c, _d, _e;
    const out = [];
    const weight = inferWeight(node.fontStyle, node.fontWeight);
    const size = (_a = node.fontSize) != null ? _a : 16;
    const fg = firstSolid(node.fills);
    const bgReliable = ((_b = node.background) == null ? void 0 : _b.reliable) && node.background.hex;
    const ignored = (issue) => applyIgnore(node, issue);
    if (!fg || hasComplexPaint(node.fills)) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "contrast-normal-text",
            name: "Text fill not a solid color",
            description: "This text uses a missing, mixed, gradient, or image fill, so contrast cannot be computed reliably.",
            wcagCriterion: "1.4.3",
            severity: "info",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "contrast",
            recommendation: "Use a solid text color, or manually verify contrast against the real background in context.",
            automated: true,
            manualReview: true
          })
        )
      );
    } else if (!bgReliable) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "contrast-normal-text",
            name: "Background cannot be determined",
            description: (_d = (_c = node.background) == null ? void 0 : _c.reason) != null ? _d : "The background is transparent, a gradient, an image, or otherwise too complex for a reliable automated contrast check.",
            wcagCriterion: "1.4.3",
            severity: "warning",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "contrast",
            recommendation: "Place the text on a solid background, or manually measure contrast including overlays, photos, and reduced opacity.",
            automated: true,
            manualReview: true,
            details: {
              foreground: fg.hex,
              background: "complex / unknown",
              result: "NEEDS REVIEW"
            }
          })
        )
      );
    } else {
      const result = evaluateTextContrast({
        fgHex: fg.hex,
        bgHex: node.background.hex,
        fontSizePx: size,
        fontWeight: weight,
        settings
      });
      const suggestion = contrastSuggestion(fg.hex, node.background.hex, result.required);
      const details = {
        foreground: fg.hex,
        background: node.background.hex,
        contrast: formatRatio(result.ratio),
        required: formatRatio(result.required),
        result: result.passes ? "PASS" : "FAIL",
        largeText: result.largeText,
        fontSize: size,
        fontWeight: weight
      };
      if (settings.includeExperimental) {
        const lc = apcaLc(parseHex(fg.hex), parseHex(node.background.hex));
        details.apcaLc = lc;
        details.apcaNote = apcaNote(lc);
      }
      const criterion = settings.wcagLevel === "AAA" ? "1.4.6" : "1.4.3";
      if (result.passes) {
        out.push(
          ignored(
            makeIssue({
              ruleId: result.largeText ? "contrast-large-text" : "contrast-normal-text",
              name: result.largeText ? "Large text contrast" : "Normal text contrast",
              description: `Text meets WCAG ${settings.wcagLevel} contrast (${formatRatio(result.ratio)} \u2265 ${formatRatio(result.required)}).`,
              wcagCriterion: criterion,
              severity: "passed",
              status: "passed",
              nodeId: node.id,
              nodeName: node.name,
              category: "contrast",
              recommendation: "No contrast change required for this pair, assuming the resolved background is correct.",
              automated: true,
              manualReview: false,
              details
            })
          )
        );
      } else {
        out.push(
          ignored(
            makeIssue({
              ruleId: result.largeText ? "contrast-large-text" : "contrast-normal-text",
              name: result.largeText ? "Large text contrast" : "Normal text contrast",
              description: `Contrast ${formatRatio(result.ratio)} is below the ${settings.wcagLevel} requirement of ${formatRatio(result.required)} for ${result.largeText ? "large" : "normal"} text.`,
              wcagCriterion: criterion,
              severity: "critical",
              status: "failed",
              nodeId: node.id,
              nodeName: node.name,
              category: "contrast",
              recommendation: `Increase contrast between the text and background. Suggested text color: ${(_e = suggestion.suggested) != null ? _e : "adjust lightness until the ratio is met"}.`,
              automated: true,
              manualReview: false,
              details,
              fix: settings.enableSuggestedFixes && suggestion.suggested ? {
                kind: "text-color",
                label: "Apply suggested text color",
                before: suggestion.current,
                after: suggestion.suggested,
                payload: { hex: suggestion.suggested, nodeId: node.id }
              } : void 0
            })
          )
        );
      }
    }
    if (size + 1e-6 < settings.smallTextPx) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "text-size-readability",
            name: "Very small text",
            description: `Text size is ${size}px. WCAG does not define a universal minimum font size, but very small type often fails real-world readability and can conflict with resize/reflow in implementation.`,
            wcagCriterion: "1.4.4",
            severity: "warning",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "typography",
            recommendation: `Consider at least ${settings.smallTextPx}px for UI body copy. Verify 200% zoom (1.4.4) and reflow at 320 CSS pixels (1.4.10) in the implemented UI.`,
            automated: true,
            manualReview: true,
            details: { fontSize: size, wcagMinimum: "none (no universal WCAG min size)" }
          })
        )
      );
    } else {
      out.push(
        ignored(
          makeIssue({
            ruleId: "text-size-readability",
            name: "Text size",
            description: `Text size ${size}px is at or above the plugin readability threshold (${settings.smallTextPx}px). This is not a WCAG pass/fail.`,
            wcagCriterion: "1.4.4",
            severity: "passed",
            status: "passed",
            nodeId: node.id,
            nodeName: node.name,
            category: "typography",
            recommendation: "Still verify resize text and reflow in the browser or native app.",
            automated: true,
            manualReview: true,
            details: { fontSize: size }
          })
        )
      );
    }
    const lh = lineHeightRatio(node.lineHeightPx, size);
    if (lh !== null && lh < 1.35) {
      out.push(
        ignored(
          makeIssue({
            ruleId: "text-spacing-risk",
            name: "Tight line height",
            description: `Line height is about ${lh.toFixed(2)}\xD7 font size. WCAG 1.4.12 requires that users can apply 1.5\xD7 line height without loss of content. Tight Figma leading is a risk signal, not a failure.`,
            wcagCriterion: "1.4.12",
            severity: "warning",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "typography",
            recommendation: "Leave enough vertical room in components so text can grow to 1.5\xD7 line height, 2\xD7 paragraph spacing, 0.12\xD7 letter spacing, and 0.16\xD7 word spacing.",
            automated: true,
            manualReview: true,
            details: { lineHeightRatio: lh }
          })
        )
      );
    }
    const inferred = inferHeadingLevel(size, weight, node.name);
    if (node.semanticRole && node.semanticRole !== "unspecified") {
      out.push(
        ignored(
          makeIssue({
            ruleId: "semantic-role",
            name: "Designer-assigned semantic role",
            description: `This layer is tagged as ${node.semanticRole}. Visual hierarchy in Figma does not automatically produce a correct HTML heading structure.`,
            wcagCriterion: "1.3.1",
            severity: "info",
            status: "manual",
            nodeId: node.id,
            nodeName: node.name,
            category: "structure",
            recommendation: "Confirm the implemented markup uses the intended heading level and that heading ranks are not skipped incorrectly.",
            automated: false,
            manualReview: true,
            details: { semanticRole: node.semanticRole, inferred }
          })
        )
      );
    }
    return out;
  }
  function analyzeInteractive(node, kind, siblings, settings) {
    var _a, _b, _c, _d;
    const out = [];
    const ignored = (issue) => applyIgnore(node, issue);
    const size = evaluateTargetSize(node.width, node.height, kind);
    const isTarget = kind !== "card" && kind !== "unknown";
    if (isTarget) {
      if (size.passes) {
        out.push(
          ignored(
            makeIssue({
              ruleId: "target-size-minimum",
              name: "Target size (minimum)",
              description: `${Math.round(node.width)} \xD7 ${Math.round(node.height)} meets the 24 \xD7 24 CSS-pixel approximation for WCAG 2.2 2.5.8.`,
              wcagCriterion: "2.5.8",
              severity: "passed",
              status: "passed",
              nodeId: node.id,
              nodeName: node.name,
              category: "touch",
              recommendation: size.approximationNote,
              automated: true,
              manualReview: false,
              details: { width: node.width, height: node.height, min: TARGET_SIZE_MIN_PX }
            })
          )
        );
      } else {
        const next = wouldPassWithResize(node.width, node.height);
        const exception = size.maybeInlineException ? " Inline links may qualify for the 2.5.8 inline exception \u2014 confirm in implementation." : size.maybeSpacingException ? " A spacing exception may apply if the undersized target has a 24px circle that does not intersect other targets." : "";
        out.push(
          ignored(
            makeIssue({
              ruleId: "target-size-minimum",
              name: "Target size (minimum)",
              description: `${Math.round(node.width)} \xD7 ${Math.round(node.height)} is below the 24 \xD7 24 CSS-pixel approximation for WCAG 2.2 Target Size (Minimum).${exception}`,
              wcagCriterion: "2.5.8",
              severity: size.maybeInlineException ? "warning" : "critical",
              status: size.maybeInlineException ? "needs-review" : "failed",
              nodeId: node.id,
              nodeName: node.name,
              category: "touch",
              recommendation: `Increase the interactive target to at least 24 \xD7 24 CSS pixels (design-time approximation), or document a valid 2.5.8 exception. ${size.approximationNote}`,
              automated: true,
              manualReview: size.maybeInlineException || size.maybeSpacingException,
              details: { width: node.width, height: node.height, kind },
              fix: settings.enableSuggestedFixes ? {
                kind: "resize",
                label: "Resize to 24\xD724 minimum",
                before: `${Math.round(node.width)} \xD7 ${Math.round(node.height)}`,
                after: `${next.width} \xD7 ${next.height}`,
                payload: { nodeId: node.id, width: next.width, height: next.height }
              } : void 0
            })
          )
        );
      }
    }
    if (isFormControl(kind)) {
      const placeholderOnly = looksPlaceholderOnly(node) && !hasVisibleLabelSignal(node, siblings);
      if (placeholderOnly) {
        out.push(
          ignored(
            makeIssue({
              ruleId: "form-visible-label",
              name: "Placeholder may be the only label",
              description: "This field looks like it uses placeholder (or placeholder-like) copy without a persistent visible label. Placeholder-only labels often fail 3.3.2 when implemented.",
              wcagCriterion: "3.3.2",
              severity: "critical",
              status: "failed",
              nodeId: node.id,
              nodeName: node.name,
              category: "forms",
              recommendation: "Provide a visible label that remains available when the field is filled. Placeholder is not a substitute for a label.",
              automated: true,
              manualReview: true,
              details: { kind, characters: (_a = node.characters) != null ? _a : "" }
            })
          )
        );
      } else if (!hasVisibleLabelSignal(node, siblings) && !node.hasVisibleTextChild) {
        out.push(
          ignored(
            makeIssue({
              ruleId: "form-visible-label",
              name: "Form control may lack a visible label",
              description: `No nearby text layer was detected for this ${kind}. Semantic labels cannot be confirmed from Figma alone.`,
              wcagCriterion: "3.3.2",
              severity: "warning",
              status: "needs-review",
              nodeId: node.id,
              nodeName: node.name,
              category: "forms",
              recommendation: "Add a visible label (or confirm the control has an accessible name via a wrapping component). Verify error text (3.3.1) and error suggestions (3.3.3) in implementation.",
              automated: true,
              manualReview: true,
              details: { kind }
            })
          )
        );
      } else {
        out.push(
          ignored(
            makeIssue({
              ruleId: "form-visible-label",
              name: "Visible label signal present",
              description: "Nearby or nested text was found. This is not proof that the implemented control has a programmatic name.",
              wcagCriterion: "3.3.2",
              severity: "passed",
              status: "passed",
              nodeId: node.id,
              nodeName: node.name,
              category: "forms",
              recommendation: "Confirm the accessible name is not placeholder-only in the product.",
              automated: true,
              manualReview: true,
              details: { kind }
            })
          )
        );
      }
      const hay = `${node.name} ${Object.values((_b = node.variantProperties) != null ? _b : {}).join(" ")}`.toLowerCase();
      if (hay.includes("error") || hay.includes("invalid")) {
        out.push(
          ignored(
            makeIssue({
              ruleId: "form-error-identification",
              name: "Error state present \u2014 verify text",
              description: "An error-looking variant or name was found. WCAG 3.3.1 requires identifying the field and describing the error in text \u2014 color or icon alone is not enough.",
              wcagCriterion: "3.3.1",
              severity: "info",
              status: "manual",
              nodeId: node.id,
              nodeName: node.name,
              category: "forms",
              recommendation: "Include error message text, not only a red border. Where the suggestion is known, provide it (3.3.3).",
              automated: false,
              manualReview: true
            })
          )
        );
      }
    }
    if (kind === "button" || kind === "icon-button" || kind === "link") {
      const fg = firstSolid(node.fills);
      if (fg && ((_c = node.background) == null ? void 0 : _c.reliable) && node.background.hex) {
        const ui = evaluateUiContrast(
          parseHex(fg.hex),
          parseHex(node.background.hex),
          settings.wcagLevel === "A" ? "AA" : settings.wcagLevel
        );
        if (!ui.passes) {
          out.push(
            ignored(
              makeIssue({
                ruleId: "non-text-contrast",
                name: "UI component contrast",
                description: `Component fill ${fg.hex} against adjacent background ${node.background.hex} is ${formatRatio(ui.ratio)} (need ${formatRatio(ui.required)} for 1.4.11).`,
                wcagCriterion: "1.4.11",
                severity: "critical",
                status: "failed",
                nodeId: node.id,
                nodeName: node.name,
                category: "contrast",
                recommendation: "Increase contrast of the visual boundary or icon against adjacent colors. Incidental decoration is exempt.",
                automated: true,
                manualReview: false,
                details: {
                  foreground: fg.hex,
                  background: node.background.hex,
                  contrast: formatRatio(ui.ratio),
                  required: formatRatio(ui.required),
                  result: "FAIL"
                }
              })
            )
          );
        }
      } else if (hasComplexPaint(node.fills) || !((_d = node.background) == null ? void 0 : _d.reliable)) {
        out.push(
          ignored(
            makeIssue({
              ruleId: "non-text-contrast",
              name: "UI contrast needs review",
              description: "Component or adjacent color could not be resolved to solid fills. Non-text contrast cannot be certified automatically.",
              wcagCriterion: "1.4.11",
              severity: "info",
              status: "needs-review",
              nodeId: node.id,
              nodeName: node.name,
              category: "contrast",
              recommendation: "Manually check icon, border, and focus indicator contrast at 3:1.",
              automated: true,
              manualReview: true
            })
          )
        );
      }
    }
    out.push(
      ignored(
        makeIssue({
          ruleId: "interaction-behavior",
          name: "Interaction behavior (static file)",
          description: `Detected as a likely ${kind}. Keyboard behavior, hover vs focus, and disabled states cannot be fully validated from Figma.`,
          wcagCriterion: "2.4.7",
          severity: "info",
          status: "manual",
          nodeId: node.id,
          nodeName: node.name,
          category: "components",
          recommendation: "Prototype and implement visible focus, pointer and keyboard parity, and consistent identification (3.2.4).",
          automated: false,
          manualReview: true,
          details: { kind }
        })
      )
    );
    return out;
  }
  function analyzeFocusVariants(node) {
    const states = variantStates(node);
    const ignored = (issue) => applyIgnore(node, issue);
    if (states.hasHover && !states.hasFocus) {
      return [
        ignored(
          makeIssue({
            ruleId: "focus-visible-variant",
            name: "Focus state may be missing",
            description: "This component has a hover-like variant but no focus-like variant. WCAG 2.4.7 requires a visible keyboard focus indicator. A static Figma file cannot prove keyboard behavior.",
            wcagCriterion: "2.4.7",
            severity: "warning",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "components",
            recommendation: "Add a Focus variant (not only Hover). Confirm the indicator is not fully covered (2.4.11) and consider 2.4.12 at AAA.",
            automated: true,
            manualReview: true,
            details: { variants: states.labels },
            fix: {
              kind: "create-focus-variant",
              label: "Create Focus variant from current component",
              before: "Hover without Focus",
              after: "Focus variant (cloned from default/hover)",
              payload: { nodeId: node.id }
            }
          })
        )
      ];
    }
    if (states.hasFocus) {
      return [
        ignored(
          makeIssue({
            ruleId: "focus-visible-variant",
            name: "Focus variant present",
            description: "A focus-like variant was found. This does not prove the implemented product shows a keyboard focus indicator or that it remains unobscured.",
            wcagCriterion: "2.4.7",
            severity: "passed",
            status: "passed",
            nodeId: node.id,
            nodeName: node.name,
            category: "components",
            recommendation: "Manually test keyboard focus, contrast of the ring (1.4.11), and occlusion (2.4.11 / 2.4.12).",
            automated: true,
            manualReview: true,
            details: { variants: states.labels }
          })
        )
      ];
    }
    return [];
  }
  function analyzeColorOnly(nodes) {
    const out = [];
    const statusLike = nodes.filter((n) => {
      const hay = n.name.toLowerCase();
      return n.visible && (hay.includes("error") || hay.includes("success") || hay.includes("warning") || hay.includes("status") || hay.includes("legend") || hay.includes("chart") || hay.includes("selected"));
    });
    for (const node of statusLike) {
      const solids = node.fills.filter((f) => f.visible && f.type === "SOLID" && f.hex);
      const redGreen = solids.some((s) => {
        const rgb = parseHex(s.hex);
        return rgb.r > 140 && rgb.g < 100 || rgb.g > 140 && rgb.r < 100;
      });
      out.push(
        applyIgnore(
          node,
          makeIssue({
            ruleId: "use-of-color",
            name: "Information may rely on color",
            description: "This layer looks like a status, chart, or selection indicator. Color-blindness cannot be detected automatically. If hue is the only difference between states, it likely fails 1.4.1.",
            wcagCriterion: "1.4.1",
            severity: "warning",
            status: "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "color",
            recommendation: "Pair color with an icon, label, pattern, or shape difference. Do not use red vs green as the only signal.",
            automated: true,
            manualReview: true,
            details: { redGreenHeuristic: redGreen }
          })
        )
      );
    }
    return out;
  }
  function analyzeImages(nodes) {
    return nodes.map(
      (node) => {
        var _a;
        return applyIgnore(
          node,
          makeIssue({
            ruleId: "non-text-content",
            name: "Image detected",
            description: node.imageIntent === "informative" ? "Marked informative \u2014 a text alternative will be required in implementation. The Figma layer name is not automatically equivalent to alt text." : node.imageIntent === "decorative" ? "Marked decorative \u2014 implementation should use empty alt (or CSS background) so assistive tech ignores it. Confirm this is purely decorative." : "An image fill was found. This plugin cannot tell whether the image is informative or decorative.",
            wcagCriterion: "1.1.1",
            severity: node.imageIntent === "unknown" || !node.imageIntent ? "info" : "info",
            status: node.imageIntent === "informative" || node.imageIntent === "decorative" ? "manual" : "needs-review",
            nodeId: node.id,
            nodeName: node.name,
            category: "images",
            recommendation: node.imageIntent === "decorative" ? "Keep empty alt in code. Do not copy the layer name into alt unless it is meaningful." : "Classify as Informative or Decorative in the Issues panel. Provide equivalent alt text only when informative.",
            automated: true,
            manualReview: true,
            details: { imageIntent: (_a = node.imageIntent) != null ? _a : "unknown" }
          })
        );
      }
    );
  }
  function analyzeHeadingStructure(textNodes) {
    if (textNodes.length === 0) return [];
    const inferred = textNodes.map((n) => {
      var _a;
      return {
        node: n,
        level: inferHeadingLevel((_a = n.fontSize) != null ? _a : 16, inferWeight(n.fontStyle, n.fontWeight), n.name)
      };
    });
    const h1 = inferred.filter((x) => x.level === "h1" || x.node.semanticRole === "h1");
    const issues = [];
    if (h1.length > 1) {
      for (const item of h1) {
        issues.push(
          applyIgnore(
            item.node,
            makeIssue({
              ruleId: "heading-structure",
              name: "Multiple visual H1-sized titles",
              description: "More than one text layer looks like a top-level heading. Visual size is not HTML rank. Multiple H1s can be valid, but often indicate a hierarchy problem.",
              wcagCriterion: "1.3.1",
              severity: "warning",
              status: "needs-review",
              nodeId: item.node.id,
              nodeName: item.node.name,
              category: "structure",
              recommendation: "Assign semantic roles in the plugin, then map a single page title to H1 unless the document outline intentionally uses multiple.",
              automated: true,
              manualReview: true
            })
          )
        );
      }
    }
    return issues;
  }
  function analyzeComponentConsistency(nodes) {
    return findInconsistentButtons(nodes);
  }
  var ANALYSIS_STEPS = [
    { id: "structure", label: "Structure" },
    { id: "typography", label: "Typography" },
    { id: "colors", label: "Colors" },
    { id: "components", label: "Components" },
    { id: "touch", label: "Touch targets" },
    { id: "rules", label: "Accessibility rules" }
  ];

  // src/types/index.ts
  var DEFAULT_SETTINGS = {
    wcagLevel: "AA",
    includeExperimental: false,
    showManualChecks: true,
    autoHighlight: true,
    showWcagReferences: true,
    enableSuggestedFixes: true,
    theme: "system",
    smallTextPx: 12
  };

  // src/utils/debounce.ts
  function yieldToMain() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  // src/services/figmaSerialize.ts
  var META_KEY = `${PLUGIN_DATA_NAMESPACE}-meta`;
  function readMeta(node) {
    try {
      const raw = node.getPluginData(META_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }
  function writeMeta(node, patch) {
    const current = readMeta(node);
    node.setPluginData(META_KEY, JSON.stringify(__spreadValues(__spreadValues({}, current), patch)));
  }
  function paintType(type) {
    if (type === "SOLID") return "SOLID";
    if (type === "IMAGE") return "IMAGE";
    if (type === "VIDEO") return "VIDEO";
    if (type.startsWith("GRADIENT")) return "GRADIENT";
    if (type === "PATTERN") return "PATTERN";
    return "OTHER";
  }
  function serializePaints(paints) {
    if (paints === figma.mixed) {
      return [{ type: "OTHER", opacity: 1, visible: true }];
    }
    return paints.map((p) => {
      var _a, _b;
      if (p.type === "SOLID") {
        const rgb = figmaRgbToRgb(p.color);
        return {
          type: "SOLID",
          hex: rgbToHex(rgb),
          rgb,
          opacity: (_a = p.opacity) != null ? _a : 1,
          visible: p.visible !== false
        };
      }
      return {
        type: paintType(p.type),
        opacity: (_b = p.opacity) != null ? _b : 1,
        visible: p.visible !== false
      };
    });
  }
  function firstVisibleSolid(paints) {
    for (const p of paints) {
      if (p.visible && p.type === "SOLID" && p.rgb && p.hex) {
        return { rgb: p.rgb, hex: p.hex, opacity: p.opacity };
      }
    }
    return null;
  }
  function paintsAreComplex(paints) {
    return paints.some(
      (p) => p.visible && (p.type === "GRADIENT" || p.type === "IMAGE" || p.type === "VIDEO" || p.type === "PATTERN")
    );
  }
  function resolveBackground(node) {
    let acc = null;
    let accA = 0;
    let parent = node.parent;
    while (parent && parent.type !== "DOCUMENT" && parent.type !== "PAGE") {
      if ("opacity" in parent && parent.opacity === 0) {
        parent = parent.parent;
        continue;
      }
      if ("fills" in parent) {
        const fills = serializePaints(parent.fills);
        if (paintsAreComplex(fills)) {
          return {
            hex: "#FFFFFF",
            rgb: { r: 255, g: 255, b: 255 },
            reliable: false,
            reason: "An ancestor uses a gradient, image, or pattern fill. Contrast cannot be certified automatically."
          };
        }
        const solid = firstVisibleSolid(fills);
        if (solid) {
          const nodeOpacity = "opacity" in parent ? parent.opacity : 1;
          const a = solid.opacity * nodeOpacity;
          if (!acc) {
            acc = solid.rgb;
            accA = a;
          } else {
            acc = compositeOver(acc, accA, solid.rgb);
            accA = accA + a * (1 - accA);
          }
          if (accA >= 0.95) {
            return { hex: rgbToHex(acc), rgb: acc, reliable: true };
          }
        }
      }
      parent = parent.parent;
    }
    if (acc && accA >= 0.6) {
      return {
        hex: rgbToHex(acc),
        rgb: acc,
        reliable: false,
        reason: "Background is only partially opaque; remaining canvas color is unknown."
      };
    }
    return {
      hex: "#FFFFFF",
      rgb: { r: 255, g: 255, b: 255 },
      reliable: false,
      reason: "No solid ancestor fill. The Figma canvas color is not a guaranteed published background."
    };
  }
  function collectAncestorFills(node) {
    const out = [];
    let parent = node.parent;
    while (parent && parent.type !== "DOCUMENT") {
      if ("fills" in parent) {
        out.push(serializePaints(parent.fills));
      }
      parent = parent.parent;
    }
    return out;
  }
  function textMetrics(node) {
    const size = node.fontSize === figma.mixed ? mixedFontSize(node) : node.fontSize;
    const fontName = node.fontName === figma.mixed ? mixedFontName(node) : node.fontName;
    const style = fontName ? fontName.style : void 0;
    const weight = inferWeight(style);
    let lineHeightPx;
    if (node.lineHeight !== figma.mixed) {
      if (node.lineHeight.unit === "PIXELS") lineHeightPx = node.lineHeight.value;
      if (node.lineHeight.unit === "PERCENT" && typeof size === "number") {
        lineHeightPx = node.lineHeight.value / 100 * size;
      }
    }
    let letterSpacingPx;
    if (node.letterSpacing !== figma.mixed) {
      if (node.letterSpacing.unit === "PIXELS") letterSpacingPx = node.letterSpacing.value;
      if (node.letterSpacing.unit === "PERCENT" && typeof size === "number") {
        letterSpacingPx = node.letterSpacing.value / 100 * size;
      }
    }
    return {
      fontSize: typeof size === "number" ? size : void 0,
      fontWeight: weight,
      fontStyle: style,
      lineHeightPx,
      letterSpacingPx,
      characters: node.characters
    };
  }
  function mixedFontSize(node) {
    var _a;
    const segs = node.getStyledTextSegments(["fontSize"]);
    return (_a = segs[0]) == null ? void 0 : _a.fontSize;
  }
  function mixedFontName(node) {
    var _a;
    const segs = node.getStyledTextSegments(["fontName"]);
    return (_a = segs[0]) == null ? void 0 : _a.fontName;
  }
  function hasVisibleTextChild(node) {
    if (!("children" in node)) return false;
    return node.findAll((n) => n.type === "TEXT" && n.visible && n.characters.trim().length > 0).length > 0;
  }
  function serializeNode(node) {
    var _a, _b, _c, _d, _e, _f, _g;
    const meta = readMeta(node);
    const fills = "fills" in node ? serializePaints(node.fills) : [];
    const strokes = "strokes" in node ? serializePaints(node.strokes) : [];
    let variantProperties;
    let componentName;
    let componentSetVariants;
    let isComponent = node.type === "COMPONENT";
    let isInstance = node.type === "INSTANCE";
    let isComponentSet = node.type === "COMPONENT_SET";
    if (node.type === "INSTANCE") {
      componentName = (_b = (_a = node.mainComponent) == null ? void 0 : _a.name) != null ? _b : node.name;
      variantProperties = (_c = node.variantProperties) != null ? _c : void 0;
      const main = node.mainComponent;
      if ((main == null ? void 0 : main.parent) && main.parent.type === "COMPONENT_SET") {
        componentSetVariants = main.parent.children.map((c) => c.name);
        componentName = main.parent.name;
      }
    }
    if (node.type === "COMPONENT") {
      componentName = node.name;
      variantProperties = (_d = node.variantProperties) != null ? _d : void 0;
      if (((_e = node.parent) == null ? void 0 : _e.type) === "COMPONENT_SET") {
        componentSetVariants = node.parent.children.map((c) => c.name);
        componentName = node.parent.name;
      }
    }
    if (node.type === "COMPONENT_SET") {
      componentName = node.name;
      componentSetVariants = node.children.map((c) => c.name);
    }
    const metrics = node.type === "TEXT" ? textMetrics(node) : {};
    return __spreadValues({
      id: node.id,
      name: node.name,
      type: node.type,
      width: "width" in node ? node.width : 0,
      height: "height" in node ? node.height : 0,
      opacity: "opacity" in node ? node.opacity : 1,
      visible: node.visible,
      fills,
      strokes,
      strokeWeight: "strokeWeight" in node && node.strokeWeight !== figma.mixed ? Number(node.strokeWeight) : 0,
      parentId: node.parent && "id" in node.parent ? node.parent.id : null,
      ancestorFills: collectAncestorFills(node),
      background: resolveBackground(node),
      componentName,
      variantProperties,
      componentSetVariants,
      isComponent,
      isInstance,
      isComponentSet,
      effects: "effects" in node ? node.effects.map((e) => ({ type: e.type, visible: e.visible })) : [],
      semanticRole: meta.semanticRole,
      imageIntent: (_f = meta.imageIntent) != null ? _f : "unknown",
      ignoredIssueIds: (_g = meta.ignoredIssueIds) != null ? _g : [],
      hasVisibleTextChild: hasVisibleTextChild(node),
      childCount: "children" in node ? node.children.length : 0
    }, metrics);
  }
  function isHighlightNode(node) {
    if (node.name === HIGHLIGHT_GROUP_NAME) return true;
    let p = node.parent;
    while (p) {
      if (p.name === HIGHLIGHT_GROUP_NAME) return true;
      p = p.parent;
    }
    return false;
  }

  // src/services/figmaHighlight.ts
  function clearHighlights() {
    const page = figma.currentPage;
    const existing = page.findAll((n) => n.getPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`) === "1");
    for (const n of existing) n.remove();
    const group = page.findOne((n) => n.name === HIGHLIGHT_GROUP_NAME);
    if (group) group.remove();
  }
  async function highlightNode(nodeId, label, auto) {
    var _a;
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
      return "The referenced layer is no longer in this file.";
    }
    const scene = node;
    figma.currentPage.selection = [scene];
    figma.viewport.scrollAndZoomIntoView([scene]);
    if (!auto) {
      clearHighlights();
      return null;
    }
    clearHighlights();
    const bounds = scene.absoluteBoundingBox;
    if (!bounds) return null;
    const rect = figma.createRectangle();
    rect.name = label.slice(0, 90);
    rect.x = bounds.x - 2;
    rect.y = bounds.y - 2;
    rect.resize(Math.max(1, bounds.width + 4), Math.max(1, bounds.height + 4));
    rect.fills = [];
    rect.strokes = [
      {
        type: "SOLID",
        color: { r: 0.86, g: 0.15, b: 0.15 }
      }
    ];
    rect.strokeWeight = 2;
    rect.dashPattern = [6, 4];
    rect.setPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`, "1");
    const caption = figma.createText();
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      caption.fontName = { family: "Inter", style: "Medium" };
    } catch (e) {
      const fonts = await figma.listAvailableFontsAsync();
      const fallback = (_a = fonts.find((f) => f.fontName.style === "Regular")) != null ? _a : fonts[0];
      if (fallback) {
        await figma.loadFontAsync(fallback.fontName);
        caption.fontName = fallback.fontName;
      }
    }
    caption.characters = label.slice(0, 80);
    caption.fontSize = 11;
    caption.fills = [{ type: "SOLID", color: { r: 0.86, g: 0.15, b: 0.15 } }];
    caption.x = bounds.x;
    caption.y = bounds.y - 18;
    caption.setPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`, "1");
    const group = figma.group([rect, caption], figma.currentPage);
    group.name = HIGHLIGHT_GROUP_NAME;
    group.locked = true;
    group.setPluginData(`${PLUGIN_DATA_NAMESPACE}:${HIGHLIGHT_FLAG}`, "1");
    return null;
  }

  // src/services/figmaFixes.ts
  async function applySuggestedFix(fix) {
    var _a, _b, _c;
    const nodeId = String((_a = fix.payload.nodeId) != null ? _a : "");
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) return "Layer not found. It may have been deleted.";
    if (fix.kind === "text-color") {
      if (node.type !== "TEXT") return "Color fix only applies to text layers.";
      const hex = String((_b = fix.payload.hex) != null ? _b : "");
      const rgb = tryParseHex(hex);
      if (!rgb) return "Invalid color.";
      const color = rgbToFigma(rgb);
      node.fills = [{ type: "SOLID", color, opacity: 1 }];
      return `Updated text color to ${hex}. Use Figma undo (\u2318Z / Ctrl+Z) if this was not intended.`;
    }
    if (fix.kind === "resize") {
      if (!("resize" in node)) return "This layer cannot be resized.";
      const width = Number(fix.payload.width);
      const height = Number(fix.payload.height);
      node.resize(width, height);
      return `Resized to ${Math.round(width)} \xD7 ${Math.round(height)}. Undo in Figma if needed.`;
    }
    if (fix.kind === "rename-metadata") {
      const name = String((_c = fix.payload.name) != null ? _c : node.name);
      node.name = name;
      return `Renamed layer to \u201C${name}\u201D.`;
    }
    if (fix.kind === "create-focus-variant") {
      return await createFocusVariant(node);
    }
    return "Unknown fix type.";
  }
  async function createFocusVariant(node) {
    var _a, _b;
    let component = null;
    if (node.type === "COMPONENT") component = node;
    if (node.type === "INSTANCE") {
      component = node.mainComponent;
    }
    if (!component) {
      return "Select a component or instance. Focus variants can only be added to a component set.";
    }
    const parent = component.parent;
    if (!parent || parent.type !== "COMPONENT_SET") {
      return "This component is not in a variant set. Convert it to a component set in Figma, then retry.";
    }
    const existing = parent.children.some((c) => c.name.toLowerCase().includes("focus"));
    if (existing) return "A Focus variant already exists on this set.";
    const clone = component.clone();
    const keys = Object.keys((_a = component.variantProperties) != null ? _a : {});
    if (keys.length > 0) {
      const key = (_b = keys.find((k) => /state|status|type/i.test(k))) != null ? _b : keys[0];
      const others = keys.filter((k) => k !== key).map((k) => `${k}=${component.variantProperties[k]}`);
      clone.name = [`${key}=Focus`, ...others].join(", ");
    } else {
      clone.name = "State=Focus";
    }
    clone.x = component.x + component.width + 24;
    clone.y = component.y;
    return `Created variant \u201C${clone.name}\u201D. Style the focus ring manually \u2014 the plugin will not invent a visual language.`;
  }

  // src/code.ts
  var SETTINGS_KEY = "a11y-lens-settings";
  var MANUAL_KEY = "a11y-lens-manual-checks";
  var YIELD_EVERY = 200;
  var MAX_NODES = 12e3;
  figma.showUI(__html__, { width: 420, height: 680, themeColors: true });
  function post(type, payload) {
    figma.ui.postMessage({ type, payload });
  }
  async function loadSettings() {
    const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
    return __spreadValues(__spreadValues({}, DEFAULT_SETTINGS), stored);
  }
  figma.ui.onmessage = async (msg) => {
    var _a;
    try {
      switch (msg.type) {
        case "UI_READY": {
          post("SETTINGS", await loadSettings());
          post("MANUAL_CHECKS", (_a = await figma.clientStorage.getAsync(MANUAL_KEY)) != null ? _a : []);
          post("READY", { fileName: figma.root.name, pageName: figma.currentPage.name });
          break;
        }
        case "SAVE_SETTINGS": {
          const settings = msg.payload;
          await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
          post("SETTINGS", settings);
          break;
        }
        case "SAVE_MANUAL_CHECKS": {
          await figma.clientStorage.setAsync(MANUAL_KEY, msg.payload);
          post("MANUAL_CHECKS", msg.payload);
          break;
        }
        case "ANALYZE": {
          const { scope } = msg.payload;
          await runAnalysis(scope);
          break;
        }
        case "HIGHLIGHT": {
          const settings = await loadSettings();
          const { nodeId, label } = msg.payload;
          const err = await highlightNode(nodeId, label, settings.autoHighlight);
          if (err) post("ANALYSIS_ERROR", { message: err });
          break;
        }
        case "CLEAR_HIGHLIGHTS": {
          clearHighlights();
          break;
        }
        case "APPLY_FIX": {
          const result = await applySuggestedFix(msg.payload);
          post("FIX_APPLIED", { message: result });
          break;
        }
        case "IGNORE_ISSUE": {
          const { nodeId, ruleId } = msg.payload;
          await patchIgnored(nodeId, ruleId, true);
          break;
        }
        case "UNIGNORE_ISSUE": {
          const { nodeId, ruleId } = msg.payload;
          await patchIgnored(nodeId, ruleId, false);
          break;
        }
        case "SET_SEMANTIC_ROLE": {
          const { nodeId, role } = msg.payload;
          const node = await figma.getNodeByIdAsync(nodeId);
          if (node) writeMeta(node, { semanticRole: role });
          break;
        }
        case "SET_IMAGE_INTENT": {
          const { nodeId, intent } = msg.payload;
          const node = await figma.getNodeByIdAsync(nodeId);
          if (node) writeMeta(node, { imageIntent: intent });
          break;
        }
        case "RESIZE_UI": {
          const { width, height } = msg.payload;
          figma.ui.resize(width, height);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      post("ANALYSIS_ERROR", {
        message: error instanceof Error ? error.message : "Something went wrong while talking to Figma."
      });
    }
  };
  async function patchIgnored(nodeId, ruleId, ignore) {
    var _a;
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) return;
    const meta = readMeta(node);
    const set = new Set((_a = meta.ignoredIssueIds) != null ? _a : []);
    if (ignore) set.add(ruleId);
    else set.delete(ruleId);
    writeMeta(node, { ignoredIssueIds: [...set] });
  }
  async function runAnalysis(scope) {
    const settings = await loadSettings();
    const steps = ANALYSIS_STEPS.map((s, i) => ({
      id: s.id,
      label: s.label,
      done: false,
      index: i
    }));
    const tick = (index, message) => {
      var _a, _b;
      post("ANALYSIS_PROGRESS", {
        stage: (_b = (_a = steps[index]) == null ? void 0 : _a.id) != null ? _b : "scan",
        complete: false,
        message,
        steps: steps.map((s, i) => ({ id: s.id, label: s.label, done: i < index }))
      });
    };
    tick(0, "Analyzing design...");
    const roots = await collectRoots(scope);
    if (roots.length === 0) {
      const message = scope === "selection" ? "No frame selected. Select a frame or component and click Analyze Selection." : "Nothing to analyze on this page.";
      post("ANALYSIS_ERROR", { message });
      return;
    }
    tick(1, "Scanning structure...");
    const serialized = [];
    let visited = 0;
    const walk = async (node) => {
      if (isHighlightNode(node)) return;
      if (!node.visible) return;
      serialized.push(serializeNode(node));
      visited += 1;
      if (visited % YIELD_EVERY === 0) {
        await yieldToMain();
        tick(1, `Scanning structure\u2026 ${visited} layers`);
      }
      if (serialized.length >= MAX_NODES) return;
      if ("children" in node) {
        for (const child of node.children) {
          if (serialized.length >= MAX_NODES) return;
          await walk(child);
        }
      }
    };
    for (const root of roots) {
      await walk(root);
    }
    if (serialized.length >= MAX_NODES) {
      post("ANALYSIS_PROGRESS", {
        stage: "structure",
        complete: false,
        message: `Reached the ${MAX_NODES} layer safety cap. Results cover a subset of the file.`,
        steps: steps.map((s, i) => ({ id: s.id, label: s.label, done: i < 1 }))
      });
    }
    tick(2, "Evaluating typography and colors...");
    await yieldToMain();
    const result = analyzeDocument({
      nodes: serialized,
      scope,
      fileName: figma.root.name,
      pageName: figma.currentPage.name,
      settings
    });
    tick(6, "Analysis complete.");
    post("ANALYSIS_COMPLETE", result);
  }
  async function collectRoots(scope) {
    if (scope === "selection") {
      const sel = figma.currentPage.selection.filter((n) => !isHighlightNode(n));
      return sel;
    }
    if (scope === "page") {
      return figma.currentPage.children.filter((n) => !isHighlightNode(n));
    }
    if (typeof figma.loadAllPagesAsync === "function") {
      await figma.loadAllPagesAsync();
    }
    const roots = [];
    for (const page of figma.root.children) {
      for (const child of page.children) {
        if (!isHighlightNode(child)) roots.push(child);
      }
    }
    return roots;
  }
})();
