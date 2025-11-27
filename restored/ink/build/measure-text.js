/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var widest_line__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/widest-line@5.0.0/node_modules/widest-line/index.js");
const cache = new Map();
const measureText = text => {
  if (text.length === 0) {
    return {
      width: 0,
      height: 0
    };
  }
  const cachedDimensions = cache.get(text);
  if (cachedDimensions) {
    return cachedDimensions;
  }
  const width = (0, widest_line__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.A)(text);
  const height = text.split('\n').length;
  const dimensions = {
    width,
    height
  };
  cache.set(text, dimensions);
  return dimensions;
};
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = measureText;
//# sourceMappingURL=measure-text.js.map

/***/