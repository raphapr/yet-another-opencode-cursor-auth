/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var cli_boxes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/cli-boxes@3.0.0/node_modules/cli-boxes/index.js");
/* harmony import */
var chalk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/chalk@5.6.0/node_modules/chalk/source/index.js");
/* harmony import */
var _colorize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/colorize.js");
const renderBorder = (x, y, node, output) => {
  if (node.style.borderStyle) {
    const width = node.yogaNode.getComputedWidth();
    const height = node.yogaNode.getComputedHeight();
    const box = typeof node.style.borderStyle === 'string' ? cli_boxes__WEBPACK_IMPORTED_MODULE_0__[node.style.borderStyle] : node.style.borderStyle;
    const topBorderColor = node.style.borderTopColor ?? node.style.borderColor;
    const bottomBorderColor = node.style.borderBottomColor ?? node.style.borderColor;
    const leftBorderColor = node.style.borderLeftColor ?? node.style.borderColor;
    const rightBorderColor = node.style.borderRightColor ?? node.style.borderColor;
    const dimTopBorderColor = node.style.borderTopDimColor ?? node.style.borderDimColor;
    const dimBottomBorderColor = node.style.borderBottomDimColor ?? node.style.borderDimColor;
    const dimLeftBorderColor = node.style.borderLeftDimColor ?? node.style.borderDimColor;
    const dimRightBorderColor = node.style.borderRightDimColor ?? node.style.borderDimColor;
    const showTopBorder = node.style.borderTop !== false;
    const showBottomBorder = node.style.borderBottom !== false;
    const showLeftBorder = node.style.borderLeft !== false;
    const showRightBorder = node.style.borderRight !== false;
    const contentWidth = width - (showLeftBorder ? 1 : 0) - (showRightBorder ? 1 : 0);
    let topBorder = showTopBorder ? (0, _colorize_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)((showLeftBorder ? box.topLeft : '') + box.top.repeat(contentWidth) + (showRightBorder ? box.topRight : ''), topBorderColor, 'foreground') : undefined;
    if (showTopBorder && dimTopBorderColor) {
      topBorder = chalk__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.Ay.dim(topBorder);
    }
    let verticalBorderHeight = height;
    if (showTopBorder) {
      verticalBorderHeight -= 1;
    }
    if (showBottomBorder) {
      verticalBorderHeight -= 1;
    }
    let leftBorder = ((0, _colorize_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)(box.left, leftBorderColor, 'foreground') + '\n').repeat(verticalBorderHeight);
    if (dimLeftBorderColor) {
      leftBorder = chalk__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.Ay.dim(leftBorder);
    }
    let rightBorder = ((0, _colorize_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)(box.right, rightBorderColor, 'foreground') + '\n').repeat(verticalBorderHeight);
    if (dimRightBorderColor) {
      rightBorder = chalk__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.Ay.dim(rightBorder);
    }
    let bottomBorder = showBottomBorder ? (0, _colorize_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)((showLeftBorder ? box.bottomLeft : '') + box.bottom.repeat(contentWidth) + (showRightBorder ? box.bottomRight : ''), bottomBorderColor, 'foreground') : undefined;
    if (showBottomBorder && dimBottomBorderColor) {
      bottomBorder = chalk__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.Ay.dim(bottomBorder);
    }
    const offsetY = showTopBorder ? 1 : 0;
    if (topBorder) {
      output.write(x, y, topBorder, {
        transformers: []
      });
    }
    if (showLeftBorder) {
      output.write(x, y + offsetY, leftBorder, {
        transformers: []
      });
    }
    if (showRightBorder) {
      output.write(x + width - 1, y + offsetY, rightBorder, {
        transformers: []
      });
    }
    if (bottomBorder) {
      output.write(x, y + height - 1, bottomBorder, {
        transformers: []
      });
    }
  }
};
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = renderBorder;
//# sourceMappingURL=render-border.js.map

/***/