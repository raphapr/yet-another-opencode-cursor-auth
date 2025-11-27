/* harmony import */var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _components_AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/components/AccessibilityContext.js");

/**
 * Returns whether screen reader is enabled. This is useful when you want to
 * render a different output for screen readers.
 */
const useIsScreenReaderEnabled = () => {
  const {
    isScreenReaderEnabled
  } = useContext(accessibilityContext);
  return isScreenReaderEnabled;
};
/* unused harmony default export */
var __WEBPACK_DEFAULT_EXPORT__ = /* unused pure expression or super */null && useIsScreenReaderEnabled;
//# sourceMappingURL=use-is-screen-reader-enabled.js.map

/***/