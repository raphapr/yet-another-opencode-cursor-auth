/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */Ak: () => (/* binding */inferLanguageFromPath),
  /* harmony export */B0: () => (/* binding */DIFF_SIGN_TRUECOLOR_LIGHT),
  /* harmony export */CV: () => (/* binding */HEADING_TRUECOLOR_DARK),
  /* harmony export */Cu: () => (/* binding */isDev),
  /* harmony export */DN: () => (/* binding */MAX_DIRECTORY_DISPLAY_LENGTH),
  /* harmony export */Eo: () => (/* binding */TEST_FILE_REVIEW_GENERATING),
  /* harmony export */Ep: () => (/* binding */BACKGROUND_COMPOSER_DIFFS_POLL_INTERVAL_MS),
  /* harmony export */F3: () => (/* binding */INLINE_DIFF_TRUECOLOR_DARK),
  /* harmony export */FL: () => (/* binding */DECISION_DROPDOWN_MIX_RATIO_LIGHT),
  /* harmony export */F_: () => (/* binding */resolveToolVerbByCase),
  /* harmony export */Fv: () => (/* binding */DIFF_SIGN_TRUECOLOR_DARK),
  /* harmony export */KD: () => (/* binding */AT_PALETTE_ENABLED),
  /* harmony export */Kj: () => (/* binding */DIFF_SIGN_ANSI256_LIGHT),
  /* harmony export */Kp: () => (/* binding */DECISION_DROPDOWN_TINT_LIGHT_HEX),
  /* harmony export */Le: () => (/* binding */FILE_REVIEW_MAX_CHARS),
  /* harmony export */Lo: () => (/* binding */DECISION_DROPDOWN_ANSI256_DARK),
  /* harmony export */Ok: () => (/* binding */SHELL_OUTPUT_PREVIEW_LINES),
  /* harmony export */Rg: () => (/* binding */DECISION_DROPDOWN_MIX_RATIO_DARK),
  /* harmony export */S8: () => (/* binding */PLAN_ENABLED),
  /* harmony export */SK: () => (/* binding */TOOL_DETAIL_MARGIN_LEFT),
  /* harmony export */Sj: () => (/* binding */ANSI_RESET),
  /* harmony export */Ts: () => (/* binding */DECISION_DROPDOWN_MIX_BASE_DARK_HEX),
  /* harmony export */U5: () => (/* binding */SHELL_OUTPUT_EXPANDED_MAX_LINES),
  /* harmony export */V2: () => (/* binding */TOOL_STATUS_VERB_DEBOUNCE_MS),
  /* harmony export */Wn: () => (/* binding */DECISION_DROPDOWN_TINT_DARK_HEX),
  /* harmony export */XM: () => (/* binding */DIFF_ROW_ANSI256_DARK),
  /* harmony export */XQ: () => (/* binding */HEADING_ANSI256_DARK),
  /* harmony export */Xh: () => (/* binding */DIFF_ROW_ANSI256_LIGHT),
  /* harmony export */Zo: () => (/* binding */CLEAR_SCREEN_ON_RESIZE_DEBOUNCE_MS),
  /* harmony export */Zx: () => (/* binding */TOKEN_ESTIMATE_THROTTLE_MS),
  /* harmony export */a6: () => (/* binding */SHELL_TURN_OUTPUT_PREVIEW_LINES),
  /* harmony export */bR: () => (/* binding */HEADING_ANSI256_LIGHT),
  /* harmony export */bd: () => (/* binding */DECISION_DROPDOWN_MIX_BASE_LIGHT_HEX),
  /* harmony export */cM: () => (/* binding */HEADING_TRUECOLOR_LIGHT),
  /* harmony export */dU: () => (/* binding */INLINE_DIFF_TRUECOLOR_LIGHT),
  /* harmony export */eh: () => (/* binding */DIFF_ROW_TRUECOLOR_DARK),
  /* harmony export */fj: () => (/* binding */EPHEMERAL_MESSAGE_TIMEOUT_MS),
  /* harmony export */hD: () => (/* binding */REVIEW_MODE_ENABLED),
  /* harmony export */i1: () => (/* binding */INLINE_DIFF_ANSI256_LIGHT),
  /* harmony export */iP: () => (/* binding */DIFF_ROW_TRUECOLOR_LIGHT),
  /* harmony export */kQ: () => (/* binding */PALETTE_PAGE_SIZE),
  /* harmony export */kh: () => (/* binding */BACKGROUND_COMPOSER_STATUS_POLL_INTERVAL_MS),
  /* harmony export */ki: () => (/* binding */ANSI_GREEN),
  /* harmony export */oy: () => (/* binding */FILE_REVIEW_DEFAULT_CONTEXT_LINES),
  /* harmony export */p9: () => (/* binding */USER_MESSAGE_MAX_LINES),
  /* harmony export */qg: () => (/* binding */MAX_SHELL_OUTPUT_SIZE),
  /* harmony export */rW: () => (/* binding */DIFF_SPACER),
  /* harmony export */rY: () => (/* binding */PATH_DISPLAY_MAX_LENGTH),
  /* harmony export */rd: () => (/* binding */AGENT_CONVERSATION_MARGIN_LEFT),
  /* harmony export */s0: () => (/* binding */ANSI_RED),
  /* harmony export */sg: () => (/* binding */INLINE_DIFF_ANSI256_DARK),
  /* harmony export */tg: () => (/* binding */DECISION_DROPDOWN_ANSI256_LIGHT),
  /* harmony export */xZ: () => (/* binding */BACKGROUND_ENABLED),
  /* harmony export */ye: () => (/* binding */TEST_FILE_REVIEW_FORCE_GATED_PATHS),
  /* harmony export */yp: () => (/* binding */DIFF_SIGN_ANSI256_DARK)
  /* harmony export */
});
/* unused harmony exports AGENT_CONVERSATION_MARGIN_RIGHT, AGENT_WATERFALL_DELAY_MS, PENDING_DETAIL_DELAY_MS, ANSI_YELLOW, ANSI_CYAN, ANSI_MAGENTA, ANSI_WHITE, ANSI_GRAY, DIFF_SIGN_TRUECOLOR, DIFF_SIGN_ANSI256, ALIGNED_LIST_HIGHLIGHT_BASE_HEX, ALIGNED_LIST_HIGHLIGHT_TINT_HEX, ALIGNED_LIST_HIGHLIGHT_LIGHT_BASE_HEX, ALIGNED_LIST_HIGHLIGHT_LIGHT_TINT_HEX, DECISION_DROPDOWN_TRUECOLOR_LIGHT, DECISION_DROPDOWN_TRUECOLOR_DARK, HEADER_PATH_MAX_LENGTH, CTRL_O_DEBOUNCE_MS, TOOL_CASE_TO_VERB, MERGEABLE_TOOL_CASES, DIFF_AFTER_LINENUM_GAP, SECTION_BORDER_ACTIVE_COLOR, SECTION_BORDER_INACTIVE_COLOR */
var _a;
const isDev = "production" === "development";
// Feature flag to enable/disable '@' palette in the CLI
const AT_PALETTE_ENABLED = true;
// Feature flag to enable/disable 'ctrl+r' review mode in the CLI
// export const REVIEW_MODE_ENABLED: boolean = isDev ? true : false;
const REVIEW_MODE_ENABLED = true;
// Feature flag: enable Background features in the app
// When false, background functionality is disabled (e.g., mode cycling and listings)
// Enable by default in development, disable otherwise
const BACKGROUND_ENABLED = !!isDev;
const PLAN_ENABLED = true;
const AGENT_CONVERSATION_MARGIN_LEFT = 0;
const AGENT_CONVERSATION_MARGIN_RIGHT = 4;
// Interval (ms) between each item appearing in WaterfallStatic
const AGENT_WATERFALL_DELAY_MS = 6;
// Gate to avoid flicker for transient pending details (ms)
const PENDING_DETAIL_DELAY_MS = 45;
// Inference helper for mapping a file path to a Shiki BundledLanguage
// Keep this list small and focused on common cases; unknown extensions fall back to using the
// extension directly if Shiki supports it, otherwise to markdown.
const inferLanguageFromPath = path => {
  var _a;
  const ext = (_a = path.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  if (!ext) return "markdown";
  const extensionToLanguage = {
    ts: "ts",
    tsx: "tsx",
    js: "js",
    jsx: "jsx",
    mjs: "js",
    cjs: "js",
    json: "json",
    json5: "json5",
    jsonc: "jsonc",
    md: "markdown",
    mdx: "mdx",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    vue: "vue",
    svelte: "svelte",
    astro: "astro",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    ini: "ini",
    env: "dotenv",
    sh: "bash",
    bash: "bash",
    zsh: "zsh",
    fish: "fish",
    py: "python",
    rb: "ruby",
    rs: "rust",
    go: "go",
    java: "java",
    kt: "kotlin",
    kts: "kotlin",
    php: "php",
    swift: "swift",
    sql: "sql",
    pl: "perl",
    c: "c",
    h: "c",
    cc: "cpp",
    cp: "cpp",
    cpp: "cpp",
    cxx: "cpp",
    hh: "cpp",
    hpp: "cpp",
    hxx: "cpp",
    cs: "csharp",
    diff: "diff",
    dockerfile: "docker",
    docker: "docker",
    makefile: "make",
    mk: "make",
    graphql: "graphql",
    gql: "gql",
    prisma: "prisma",
    proto: "proto",
    log: "log",
    txt: "markdown"
  };
  if (extensionToLanguage[ext]) return extensionToLanguage[ext];
  return ext;
};
// ANSI color helpers shared across components
const ANSI_GREEN = "\x1b[32m";
const ANSI_RED = "\x1b[31m";
const ANSI_YELLOW = "\x1b[33m";
const ANSI_RESET = "\x1b[0m";
const ANSI_CYAN = "\x1b[36m";
const ANSI_MAGENTA = "\x1b[35m";
const ANSI_WHITE = "\x1b[37m";
const ANSI_GRAY = "\x1b[90m";
// Truecolor hex palettes used when the terminal supports 24-bit color
// Soft tints to match previous appearance
const DIFF_ROW_TRUECOLOR_LIGHT = {
  addHex: "#D0E8C5",
  // close to ANSI256 index 194
  removeHex: "#F7D1BA" // close to ANSI256 index 217
};
const DIFF_ROW_TRUECOLOR_DARK = {
  addHex: "#2b3f2b",
  // soft greenish tint on dark
  removeHex: "#402626" // soft reddish tint on dark
};
// ANSI-256 palettes for limited color terminals
const DIFF_ROW_ANSI256_LIGHT = {
  add: 149,
  remove: 215
};
const DIFF_ROW_ANSI256_DARK = {
  add: 22,
  remove: 52
};
// Truecolor hex for sign (+/-) colors
// Truecolor sign (+/-) palettes by theme for better contrast against row backgrounds
const DIFF_SIGN_TRUECOLOR_LIGHT = {
  // darker tones for readability on light backgrounds
  addHex: "#15803d",
  // green-700
  removeHex: "#b91c1c" // red-700
};
const DIFF_SIGN_TRUECOLOR_DARK = {
  // brighter tones for readability on dark backgrounds (GitHub-like)
  addHex: "#3fb950",
  removeHex: "#f85149"
};
// Back-compat default (use dark as previous behavior)
const DIFF_SIGN_TRUECOLOR = /* unused pure expression or super */null && DIFF_SIGN_TRUECOLOR_DARK;
// ANSI-256 indices for sign (+/-) colors
// ANSI-256 sign (+/-) palettes by theme
// DARK: brighter base colors; LIGHT: darker tones to contrast with pale backgrounds
const DIFF_SIGN_ANSI256_LIGHT = {
  add: 22,
  // dark green
  remove: 52 // dark red
};
const DIFF_SIGN_ANSI256_DARK = {
  add: 2,
  // bright green
  remove: 1 // bright red
};
// Back-compat default (use dark as previous behavior)
const DIFF_SIGN_ANSI256 = /* unused pure expression or super */null && DIFF_SIGN_ANSI256_DARK;
// Grayscale palette for inline diffs (truecolor)
const INLINE_DIFF_TRUECOLOR_LIGHT = {
  foregroundHex: "#222831",
  // light gray for additions
  backgroundHex: "#EEEEEE" // medium gray for removals
};
const INLINE_DIFF_TRUECOLOR_DARK = {
  foregroundHex: "#EAE4D5",
  // dark gray for additions
  backgroundHex: "#333446" // even darker gray for removals
};
const INLINE_DIFF_ANSI256_LIGHT = {
  foreground: 233,
  background: 254
};
const INLINE_DIFF_ANSI256_DARK = {
  foreground: 250,
  background: 238
};
// Decision dropdown colors
// Legacy decision highlight constants removed. Use DECISION_DROPDOWN_* instead.
// Timeout for auto-cleanup of ephemeral messages (ms)
// Allow override via environment variable EPHEMERAL_MESSAGE_TIMEOUT_MS
const parsedEphemeralTimeout = Number((_a = process.env.EPHEMERAL_MESSAGE_TIMEOUT_MS) !== null && _a !== void 0 ? _a : "");
const EPHEMERAL_MESSAGE_TIMEOUT_MS = Number.isFinite(parsedEphemeralTimeout) && parsedEphemeralTimeout > 0 ? parsedEphemeralTimeout : 3000;
const ALIGNED_LIST_HIGHLIGHT_BASE_HEX = "#888888"; // gray base color
const ALIGNED_LIST_HIGHLIGHT_TINT_HEX = "#cccccc"; // lighter gray tint
const ALIGNED_LIST_HIGHLIGHT_LIGHT_BASE_HEX = "#F0F0F0"; // lighter gray base
const ALIGNED_LIST_HIGHLIGHT_LIGHT_TINT_HEX = "#F5F5F5"; // even lighter gray tint
const DECISION_DROPDOWN_ANSI256_LIGHT = {
  activeBg: 184 // light orange-ish (approx #ffd7af)
};
const DECISION_DROPDOWN_ANSI256_DARK = {
  activeBg: 94 // muted warm brown/orange (approx #875f00)
};
const DECISION_DROPDOWN_TRUECOLOR_LIGHT = {
  // default light active background (hex)
  activeBgHex: "#FFF3DF" // previous light tint
};
const DECISION_DROPDOWN_TRUECOLOR_DARK = {
  // default dark active background (hex)
  activeBgHex: "#F5D99F" // previous dark tint
};
// Decision dropdown truecolor tint configuration (for mixed backgrounds)
// Match previous behavior: mix toward base orange (light uses a lighter base), not the fallback tint
const DECISION_DROPDOWN_TINT_LIGHT_HEX = "#FFE7B8"; // previous LIGHT_BASE
const DECISION_DROPDOWN_TINT_DARK_HEX = "#D99F26"; // previous BASE
const DECISION_DROPDOWN_MIX_BASE_LIGHT_HEX = "#FFFFFF"; // mix base on light theme
const DECISION_DROPDOWN_MIX_BASE_DARK_HEX = "#1E1E1E"; // mix base on dark theme
const DECISION_DROPDOWN_MIX_RATIO_LIGHT = 0.62; // stronger tint on light
const DECISION_DROPDOWN_MIX_RATIO_DARK = 0.68; // stronger tint on dark
// Debounce interval (ms) for clearing the screen on resize
const CLEAR_SCREEN_ON_RESIZE_DEBOUNCE_MS = 200;
// Background composer status polling interval (ms)
const BACKGROUND_COMPOSER_STATUS_POLL_INTERVAL_MS = 5000;
// Background composer diffs polling interval (ms)
const BACKGROUND_COMPOSER_DIFFS_POLL_INTERVAL_MS = 5000;
// Number of lines to show in shell stdout/stderr previews before truncation (tool rows)
const SHELL_OUTPUT_PREVIEW_LINES = 2;
// Number of lines to show in shell turn (chat message) previews before truncation
const SHELL_TURN_OUTPUT_PREVIEW_LINES = 6;
// Maximum number of lines to show when expanded
const SHELL_OUTPUT_EXPANDED_MAX_LINES = 256;
// Maximum buffer size for shell output display (1MiB)
const MAX_SHELL_OUTPUT_SIZE = 1048576;
// Left margin for tool detail sections (e.g., status lines under headers)
const TOOL_DETAIL_MARGIN_LEFT = 2;
// Maximum characters to display for directory path in header
const MAX_DIRECTORY_DISPLAY_LENGTH = 50;
// Maximum characters to display for file paths in tool UIs
const PATH_DISPLAY_MAX_LENGTH = 50;
const HEADER_PATH_MAX_LENGTH = 50;
// Debounce interval (ms) for showing transient tool status verbs
// Avoid flicker for very short-lived operations (e.g., fast "Reading")
const TOOL_STATUS_VERB_DEBOUNCE_MS = 100;
// Debounce interval (ms) for Ctrl+O compact toggle in the prompt bar.
// Leading edge should toggle immediately; repeated key auto-repeats within this window are ignored.
const CTRL_O_DEBOUNCE_MS = 100;
// Throttle interval (ms) for token estimate display in the prompt status line
// Keep moderate to reduce redraw flicker while remaining responsive
const TOKEN_ESTIMATE_THROTTLE_MS = 120;
const TOOL_CASE_TO_VERB = {
  readToolCall: {
    progressive: "Reading",
    past: "Read"
  },
  grepToolCall: {
    progressive: "Grepping",
    past: "Grepped"
  },
  semSearchToolCall: {
    progressive: "Searching",
    past: "Searched"
  },
  globToolCall: {
    progressive: "Globbing",
    past: "Globbed"
  },
  lsToolCall: {
    progressive: "Listing",
    past: "Listed"
  },
  deleteToolCall: {
    progressive: "Deleting",
    past: "Deleted"
  },
  editToolCall: {
    progressive: "Editing",
    past: "Edited"
  },
  shellToolCall: {
    progressive: "Running",
    past: "Ran"
  },
  mcpToolCall: {
    progressive: "Calling",
    past: "Called"
  },
  webSearchToolCall: {
    progressive: "Searching",
    past: "Searched"
  },
  updateTodosToolCall: {
    progressive: "Updating",
    past: "Updated"
  },
  readLintsToolCall: {
    progressive: "Reading",
    past: "Read"
  },
  readTodosToolCall: {
    progressive: "Reading",
    past: "Read"
  },
  createPlanToolCall: {
    progressive: "Planning",
    past: "Planned"
  }
};
function resolveToolVerbByCase(toolCase, completed) {
  if (!toolCase) return null;
  const forms = TOOL_CASE_TO_VERB[toolCase];
  if (!forms) return null;
  return completed ? forms.past : forms.progressive;
}
const MERGEABLE_TOOL_CASES = new Set(["readToolCall", "grepToolCall", "semSearchToolCall", "globToolCall", "lsToolCall"]);
const FILE_REVIEW_DEFAULT_CONTEXT_LINES = 8;
const TEST_FILE_REVIEW_GENERATING = false;
const FILE_REVIEW_MAX_CHARS = 500000;
// Number of spaces between line numbers and diff marker/content.
// Tweak this to adjust visual padding before + / - / │ / ⋯ markers.
const DIFF_AFTER_LINENUM_GAP = 1;
const DIFF_SPACER = " ".repeat(DIFF_AFTER_LINENUM_GAP);
// add modified relative paths in the codebase to see what it'd look like when gated
const TEST_FILE_REVIEW_FORCE_GATED_PATHS = new Set([]);
// File review section border colors
const SECTION_BORDER_ACTIVE_COLOR = /* unused pure expression or super */null && ANSI_WHITE; // selected file border
const SECTION_BORDER_INACTIVE_COLOR = /* unused pure expression or super */null && ANSI_GRAY; // non-selected files
const PALETTE_PAGE_SIZE = 6;
const HEADING_TRUECOLOR_LIGHT = {
  h1Hex: "#0E7490",
  // cyan-700
  h2Hex: "#1D4ED8",
  // blue-700
  hnHex: "#111827" // gray-900
};
const HEADING_TRUECOLOR_DARK = {
  h1Hex: "#67E8F9",
  // cyan-300
  h2Hex: "#93C5FD",
  // blue-300
  hnHex: "#E5E7EB" // gray-200
};
const HEADING_ANSI256_LIGHT = {
  h1: 30,
  // darker cyan
  h2: 26,
  // darker blue
  hn: 233 // near-black
};
const HEADING_ANSI256_DARK = {
  h1: 51,
  // bright cyan
  h2: 39,
  // bright blue
  hn: 252 // near-white
};
const USER_MESSAGE_MAX_LINES = 5;

/***/