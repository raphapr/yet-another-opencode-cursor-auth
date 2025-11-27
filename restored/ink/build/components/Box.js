/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/components/AccessibilityContext.js");
/* harmony import */
var _BackgroundContext_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/components/BackgroundContext.js");

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */
const Box = (0, react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({
  children,
  backgroundColor,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  'aria-role': role,
  'aria-state': ariaState,
  ...style
}, ref) => {
  const {
    isScreenReaderEnabled
  } = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_1__ /* .accessibilityContext */.E);
  const label = ariaLabel ? react__WEBPACK_IMPORTED_MODULE_0__.createElement("ink-text", null, ariaLabel) : undefined;
  if (isScreenReaderEnabled && ariaHidden) {
    return null;
  }
  const boxElement = react__WEBPACK_IMPORTED_MODULE_0__.createElement("ink-box", {
    ref: ref,
    style: {
      flexWrap: 'nowrap',
      flexDirection: 'row',
      flexGrow: 0,
      flexShrink: 1,
      ...style,
      backgroundColor,
      overflowX: style.overflowX ?? style.overflow ?? 'visible',
      overflowY: style.overflowY ?? style.overflow ?? 'visible'
    },
    internal_accessibility: {
      role,
      state: ariaState
    }
  }, isScreenReaderEnabled && label ? label : children);
  // If this Box has a background color, provide it to children via context
  if (backgroundColor) {
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BackgroundContext_js__WEBPACK_IMPORTED_MODULE_2__ /* .backgroundContext */.U.Provider, {
      value: backgroundColor
    }, boxElement);
  }
  return boxElement;
});
Box.displayName = 'Box';
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = Box;
//# sourceMappingURL=Box.js.map

/***/