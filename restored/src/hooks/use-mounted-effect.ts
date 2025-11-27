/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */H: () => (/* binding */useMountedEffect)
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
function useMountedEffect(callback, deps) {
  const mountedRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: sigh
  const cb = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(callback, deps !== null && deps !== void 0 ? deps : []);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    cb();
  }, [cb]);
}

/***/