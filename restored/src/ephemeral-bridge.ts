/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */ET: () => (/* binding */pushEphemeral),
  /* harmony export */al: () => (/* binding */setEphemeralListener),
  /* harmony export */mP: () => (/* binding */hasEphemeralListener)
  /* harmony export */
});
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/debug.ts");
let listener = null;
function setEphemeralListener(next) {
  listener = next;
}
function hasEphemeralListener() {
  return listener != null;
}
function normalize(input) {
  if (Array.isArray(input)) {
    const first = input[0];
    if (first && typeof first === "object" && !Array.isArray(first) && "text" in first) {
      return [input];
    }
    return input;
  }
  return [input];
}
function pushEphemeral(lines) {
  const arr = normalize(lines);
  try {
    if (listener) listener(arr);
  } catch (_a) {
    // ignore UI errors to avoid recursive crashes
  }
  try {
    (0, _debug_js__WEBPACK_IMPORTED_MODULE_0__.debugLog)("ephemeral.push", arr.map(l => typeof l === "string" ? l : l.map(s => s.text).join("")));
  } catch (_b) {
    // ignore debug logging failures
  }
}

/***/