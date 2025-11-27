__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _hooks_use_shared_animation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/hooks/use-shared-animation.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    function HexagonLoader({
      customInterval,
      activeColor = "white",
      inactiveColor = undefined
    }) {
      const period = customInterval !== null && customInterval !== void 0 ? customInterval : _hooks_use_shared_animation_js__WEBPACK_IMPORTED_MODULE_3__ /* .DEFAULT_HEXAGON_INTERVAL_MS */.q;
      const tick = (0, _hooks_use_shared_animation_js__WEBPACK_IMPORTED_MODULE_3__ /* .useSharedTick */.e)(period);
      const frame = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => tick % 2 === 0 ? "⬡" : "⬢", [tick]);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
        color: tick % 2 === 1 ? activeColor : inactiveColor,
        children: frame
      });
    }
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = (0, react__WEBPACK_IMPORTED_MODULE_2__.memo)(HexagonLoader);
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/