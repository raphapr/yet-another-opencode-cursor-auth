/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */C: () => (/* binding */formatReviewPrompt)
  /* harmony export */
});
/* harmony import */
var _path_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/utils/path-utils.ts");
function formatReviewPrompt(path, message, context) {
  const v = message.trim();
  if (!v) return "";
  const rel = (0, _path_utils_js__WEBPACK_IMPORTED_MODULE_0__ /* .toRelativePath */.fw)(path);
  const range = context && context.startLine != null && context.endLine != null ? ` (lines ${context.startLine}-${context.endLine})` : "";
  return `For ${rel}${range}:\n${v}`;
}

/***/