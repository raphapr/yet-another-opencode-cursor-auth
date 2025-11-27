/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */a: () => (/* binding */formatTokenCount)
  /* harmony export */
});
/* unused harmony export estimateBufferedTokens */
function estimateBufferedTokens(chars, modelId) {
  const lower = modelId.toLowerCase();
  const charsPerToken = lower.includes("gpt-4o") || lower.includes("gpt-5") ? 3.7 : lower.includes("sonnet") || lower.includes("opus") || lower.includes("claude") ? 3.9 : 4.0;
  return Math.max(0, Math.floor(chars / charsPerToken));
}
/**
 * Format a token count with sensible defaults.
 * - Returns null for null/undefined or non-positive counts so callers can omit the label entirely
 * - Handles singular/plural automatically
 */
function formatTokenCount(count, opts) {
  var _a, _b;
  if (count == null) return null;
  const n = Math.floor(count);
  if (!(n > 0)) return null;
  const shortThreshold = (_a = opts === null || opts === void 0 ? void 0 : opts.shortThreshold) !== null && _a !== void 0 ? _a : 1000; // abbreviate at 1k
  const decimals = (_b = opts === null || opts === void 0 ? void 0 : opts.decimals) !== null && _b !== void 0 ? _b : 2;
  // Remove trailing zeros and stray decimal points: e.g., "3.40" -> "3.4", "12.00" -> "12"
  const trimZeros = s => s.replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "").replace(/\.$/, "");
  const truncateToDecimals = (value, d) => {
    if (d <= 0) return Math.floor(value);
    const factor = Math.pow(10, d);
    return Math.floor(value * factor) / factor;
  };
  let label;
  if (n >= 1000000 && n >= shortThreshold) {
    const v = truncateToDecimals(n / 1000000, decimals);
    label = `${trimZeros(v.toFixed(decimals))}M`;
  } else if (n >= 1000 && n >= shortThreshold) {
    const v = truncateToDecimals(n / 1000, decimals);
    label = `${trimZeros(v.toFixed(decimals))}k`;
  } else {
    label = String(n);
  }
  const unit = n === 1 ? "token" : "tokens";
  return `${label} ${unit}`;
}

/***/