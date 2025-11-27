__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Y: () => (/* binding */ToolRowBox)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/hooks/use-screen-size.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    var __rest = undefined && undefined.__rest || function (s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    };
    const ToolRowBox = _a => {
      var {
          fullWidth,
          width,
          children
        } = _a,
        rest = __rest(_a, ["fullWidth", "width", "children"]);
      const size = (0, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__ /* .useScreenSize */.l)();
      const computedWidth = fullWidth ? "100%" : width !== null && width !== void 0 ? width : Math.max(0, size.width - 2);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, Object.assign({
        borderStyle: "single",
        borderColor: "gray",
        borderDimColor: true,
        gap: 1,
        width: computedWidth
      }, rest, {
        children: children
      }));
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/