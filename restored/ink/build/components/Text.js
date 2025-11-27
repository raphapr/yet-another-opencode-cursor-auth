/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => (/* binding */Text)
  /* harmony export */
});
/* harmony import */
var chalk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/chalk@5.6.0/node_modules/chalk/source/index.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _colorize_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../ink/build/colorize.js");
/* harmony import */
var _AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/components/AccessibilityContext.js");
/* harmony import */
var _BackgroundContext_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/components/BackgroundContext.js");

/**
 * This component can display text, and change its style to make it colorful, bold, underline, italic or strikethrough.
 */
function Text({
  color,
  backgroundColor,
  dimColor = false,
  bold = false,
  italic = false,
  underline = false,
  strikethrough = false,
  inverse = false,
  wrap = 'wrap',
  children,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false
}) {
  const {
    isScreenReaderEnabled
  } = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_1__ /* .accessibilityContext */.E);
  const inheritedBackgroundColor = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_BackgroundContext_js__WEBPACK_IMPORTED_MODULE_2__ /* .backgroundContext */.U);
  const childrenOrAriaLabel = isScreenReaderEnabled && ariaLabel ? ariaLabel : children;
  if (childrenOrAriaLabel === undefined || childrenOrAriaLabel === null) {
    return null;
  }
  const transform = children => {
    if (dimColor) {
      children = chalk__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.dim(children);
    }
    if (color) {
      children = (0, _colorize_js__WEBPACK_IMPORTED_MODULE_4__ /* ["default"] */.A)(children, color, 'foreground');
    }
    // Use explicit backgroundColor if provided, otherwise use inherited from parent Box
    const effectiveBackgroundColor = backgroundColor ?? inheritedBackgroundColor;
    if (effectiveBackgroundColor) {
      children = (0, _colorize_js__WEBPACK_IMPORTED_MODULE_4__ /* ["default"] */.A)(children, effectiveBackgroundColor, 'background');
    }
    if (bold) {
      children = chalk__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.bold(children);
    }
    if (italic) {
      children = chalk__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.italic(children);
    }
    if (underline) {
      children = chalk__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.underline(children);
    }
    if (strikethrough) {
      children = chalk__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.strikethrough(children);
    }
    if (inverse) {
      children = chalk__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.inverse(children);
    }
    return children;
  };
  if (isScreenReaderEnabled && ariaHidden) {
    return null;
  }
  return react__WEBPACK_IMPORTED_MODULE_0__.createElement("ink-text", {
    style: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: 'row',
      textWrap: wrap
    },
    internal_transform: transform
  }, isScreenReaderEnabled && ariaLabel ? ariaLabel : children);
}
//# sourceMappingURL=Text.js.map

/***/