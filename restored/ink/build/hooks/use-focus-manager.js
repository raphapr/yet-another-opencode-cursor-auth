/* harmony import */var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _components_FocusContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/components/FocusContext.js");

/**
 * This hook exposes methods to enable or disable focus management for all
 * components or manually switch focus to next or previous components.
 */
const useFocusManager = () => {
  const focusContext = useContext(FocusContext);
  return {
    enableFocus: focusContext.enableFocus,
    disableFocus: focusContext.disableFocus,
    focusNext: focusContext.focusNext,
    focusPrevious: focusContext.focusPrevious,
    focus: focusContext.focus
  };
};
/* unused harmony default export */
var __WEBPACK_DEFAULT_EXPORT__ = /* unused pure expression or super */null && useFocusManager;
//# sourceMappingURL=use-focus-manager.js.map

/***/