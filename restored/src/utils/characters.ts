/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */aJ: () => (/* binding */stripAnsi),
  /* harmony export */p3: () => (/* binding */sanitizeForHistory)
  /* harmony export */
});
/* unused harmony exports stripControlChars, stripFormattingChars, normalizeWhitespace */
/** biome-ignore-all lint/suspicious/noControlCharactersInRegex: we don't care about control characters in regex */
function stripAnsi(input) {
  const ansiPattern = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\u0007]*(?:\u0007|\x1b\\))/g;
  return input.replace(ansiPattern, "");
}
function stripControlChars(input) {
  // Preserve common whitespace used in prompts: tab (\t), newline (\n), and carriage return (\r)
  const controlPattern = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g;
  return input.replace(controlPattern, "");
}
function stripFormattingChars(input) {
  const formattingPattern = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;
  return input.replace(formattingPattern, "");
}
function normalizeWhitespace(input) {
  // Preserve spaces and tabs exactly; only normalize line endings to \n
  return input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function sanitizeForHistory(raw) {
  let value = String(raw !== null && raw !== void 0 ? raw : "");
  value = stripAnsi(value);
  value = stripControlChars(value);
  value = stripFormattingChars(value);
  value = normalizeWhitespace(value);
  const MAX_ENTRY_LENGTH = 10000;
  if (value.length > MAX_ENTRY_LENGTH) value = value.slice(0, MAX_ENTRY_LENGTH);
  return value;
}

/***/