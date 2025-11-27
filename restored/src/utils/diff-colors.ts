/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */U: () => (/* binding */classifyDiffLine),
  /* harmony export */a: () => (/* binding */computeDiffRowHexes)
  /* harmony export */
});
/* harmony import */
var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/constants.ts");
/* harmony import */
var _color_mixing_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/utils/color-mixing.ts");

/**
 * Compute subtle mixed background hex colors for added/removed diff rows.
 * We mix a small amount of tint into the base (white for light themes,
 * black for dark themes) to avoid overly bright, chunky backgrounds.
 */
function computeDiffRowHexes(isLightTheme) {
  const colorMode = (0, _color_mixing_js__WEBPACK_IMPORTED_MODULE_1__ /* .getColorMode */.PT)();
  if (colorMode === "truecolor") {
    return isLightTheme ? _constants_js__WEBPACK_IMPORTED_MODULE_0__ /* .DIFF_ROW_TRUECOLOR_LIGHT */.iP : _constants_js__WEBPACK_IMPORTED_MODULE_0__ /* .DIFF_ROW_TRUECOLOR_DARK */.eh;
  }
  const palette = isLightTheme ? _constants_js__WEBPACK_IMPORTED_MODULE_0__ /* .DIFF_ROW_ANSI256_LIGHT */.Xh : _constants_js__WEBPACK_IMPORTED_MODULE_0__ /* .DIFF_ROW_ANSI256_DARK */.XM;
  return {
    addHex: (0, _color_mixing_js__WEBPACK_IMPORTED_MODULE_1__ /* .ansi256IndexToHex */.LR)(palette.add),
    removeHex: (0, _color_mixing_js__WEBPACK_IMPORTED_MODULE_1__ /* .ansi256IndexToHex */.LR)(palette.remove)
  };
}
/**
 * Detects whether a raw diff line is an addition or removal, excluding header lines like '+++', '---'.
 */
function classifyDiffLine(rawLine) {
  if (!rawLine || rawLine.length === 0) return "other";
  if (rawLine[0] === "+" && !rawLine.startsWith("+++")) return "added";
  if (rawLine[0] === "-" && !rawLine.startsWith("---")) return "removed";
  return "other";
}

/***/