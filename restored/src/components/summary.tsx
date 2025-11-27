__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */B: () => (/* binding */Summary)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/hooks/use-screen-size.ts");
    /* harmony import */
    var _markdown_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/markdown.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__, _markdown_js__WEBPACK_IMPORTED_MODULE_3__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__, _markdown_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    function Summary({
      summary
    }) {
      const size = (0, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_2__ /* .useScreenSize */.l)();
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        borderStyle: "single",
        borderColor: "cyan",
        borderDimColor: true,
        paddingLeft: 1,
        paddingRight: 4,
        marginTop: 1,
        marginBottom: 1,
        marginX: 1,
        width: size.width - 2,
        flexDirection: "column",
        gap: 1,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            bold: true,
            children: "Summary"
          })
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_markdown_js__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay, {
          content: summary
        })]
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/