/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */nt: () => (/* binding */validateOutputFormat)
  /* harmony export */
});
/* unused harmony exports OUTPUT_FORMATS, isOutputFormat */
const OUTPUT_FORMATS = ["text", "json", "stream-json"];
function isOutputFormat(value) {
  return typeof value === "string" && OUTPUT_FORMATS.includes(value);
}
function validateOutputFormat(value) {
  if (value == null) return "text";
  if (isOutputFormat(value)) return value;
  const allowed = OUTPUT_FORMATS.join(", ");
  throw new Error(`Invalid --output-format. Allowed values: ${allowed}`);
}

/***/