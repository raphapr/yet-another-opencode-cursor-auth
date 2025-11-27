/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var _colorize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../ink/build/colorize.js");
const renderBackground = (x, y, node, output) => {
  if (!node.style.backgroundColor) {
    return;
  }
  const width = node.yogaNode.getComputedWidth();
  const height = node.yogaNode.getComputedHeight();
  // Calculate the actual content area considering borders
  const leftBorderWidth = node.style.borderStyle && node.style.borderLeft !== false ? 1 : 0;
  const rightBorderWidth = node.style.borderStyle && node.style.borderRight !== false ? 1 : 0;
  const topBorderHeight = node.style.borderStyle && node.style.borderTop !== false ? 1 : 0;
  const bottomBorderHeight = node.style.borderStyle && node.style.borderBottom !== false ? 1 : 0;
  const contentWidth = width - leftBorderWidth - rightBorderWidth;
  const contentHeight = height - topBorderHeight - bottomBorderHeight;
  if (!(contentWidth > 0 && contentHeight > 0)) {
    return;
  }
  // Create background fill for each row
  const backgroundLine = (0, _colorize_js__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.A)(' '.repeat(contentWidth), node.style.backgroundColor, 'background');
  for (let row = 0; row < contentHeight; row++) {
    output.write(x + leftBorderWidth, y + topBorderHeight + row, backgroundLine, {
      transformers: []
    });
  }
};
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = renderBackground;
//# sourceMappingURL=render-background.js.map

/***/