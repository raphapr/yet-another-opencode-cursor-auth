/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _components_FocusContext_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/components/FocusContext.js");
/* harmony import */
var _use_stdin_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/hooks/use-stdin.js");

/**
 * Component that uses `useFocus` hook becomes "focusable" to Ink,
 * so when user presses <kbd>Tab</kbd>, Ink will switch focus to this component.
 * If there are multiple components that execute `useFocus` hook, focus will be
 * given to them in the order that these components are rendered in.
 * This hook returns an object with `isFocused` boolean property, which
 * determines if this component is focused or not.
 */
const useFocus = ({
  isActive = true,
  autoFocus = false,
  id: customId
} = {}) => {
  const {
    isRawModeSupported,
    setRawMode
  } = (0, _use_stdin_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A)();
  const {
    activeId,
    add,
    remove,
    activate,
    deactivate,
    focus
  } = (0, react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_components_FocusContext_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A);
  const id = (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return customId ?? Math.random().toString().slice(2, 7);
  }, [customId]);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    add(id, {
      autoFocus
    });
    return () => {
      remove(id);
    };
  }, [id, autoFocus]);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isActive) {
      activate(id);
    } else {
      deactivate(id);
    }
  }, [isActive, id]);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isRawModeSupported || !isActive) {
      return;
    }
    setRawMode(true);
    return () => {
      setRawMode(false);
    };
  }, [isActive]);
  return {
    isFocused: Boolean(id) && activeId === id,
    focus
  };
};
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = useFocus;
//# sourceMappingURL=use-focus.js.map

/***/