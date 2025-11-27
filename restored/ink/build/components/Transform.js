/* unused harmony export default */
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/components/AccessibilityContext.js");

/**
 * Transform a string representation of React components before they are written to output.
 * For example, you might want to apply a gradient to text, add a clickable link or create some text effects.
 * These use cases can't accept React nodes as input, they are expecting a string.
 * That's what <Transform> component does, it gives you an output string of its child components and lets you transform it in any way.
 */
function Transform({
  children,
  transform,
  accessibilityLabel
}) {
  const {
    isScreenReaderEnabled
  } = useContext(accessibilityContext);
  if (children === undefined || children === null) {
    return null;
  }
  return React.createElement("ink-text", {
    style: {
      flexGrow: 0,
      flexShrink: 1,
      flexDirection: 'row'
    },
    internal_transform: transform
  }, isScreenReaderEnabled && accessibilityLabel ? accessibilityLabel : children);
}
//# sourceMappingURL=Transform.js.map

/***/