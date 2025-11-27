/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/chalk@5.6.0/node_modules/chalk/source/index.js");
const rgbRegex = /^rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/;
const ansiRegex = /^ansi256\(\s?(\d+)\s?\)$/;
const isNamedColor = color => {
  return color in chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay;
};
const colorize = (str, color, type) => {
  if (!color) {
    return str;
  }
  if (isNamedColor(color)) {
    if (type === 'foreground') {
      return chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay[color](str);
    }
    const methodName = `bg${color[0].toUpperCase() + color.slice(1)}`;
    return chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay[methodName](str);
  }
  if (color.startsWith('#')) {
    return type === 'foreground' ? chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.hex(color)(str) : chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.bgHex(color)(str);
  }
  if (color.startsWith('ansi256')) {
    const matches = ansiRegex.exec(color);
    if (!matches) {
      return str;
    }
    const value = Number(matches[1]);
    return type === 'foreground' ? chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ansi256(value)(str) : chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.bgAnsi256(value)(str);
  }
  if (color.startsWith('rgb')) {
    const matches = rgbRegex.exec(color);
    if (!matches) {
      return str;
    }
    const firstValue = Number(matches[1]);
    const secondValue = Number(matches[2]);
    const thirdValue = Number(matches[3]);
    return type === 'foreground' ? chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.rgb(firstValue, secondValue, thirdValue)(str) : chalk__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.bgRgb(firstValue, secondValue, thirdValue)(str);
  }
  return str;
};
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = colorize;
//# sourceMappingURL=colorize.js.map

/***/