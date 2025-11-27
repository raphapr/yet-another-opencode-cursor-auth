__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */H: () => (/* binding */UserMessageUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/hooks/use-screen-size.ts");
    /* harmony import */
    var _utils_text_wrapping_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/utils/text-wrapping.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const UserMessageUI = ({
      content,
      overrideBorderColor
    }) => {
      const size = (0, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__ /* .useScreenSize */.l)();
      const innerWidth = Math.max(1, size.width - 10);
      const clampedContent = (0, _utils_text_wrapping_js__WEBPACK_IMPORTED_MODULE_4__ /* .clampTextToLines */.F)(content, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .USER_MESSAGE_MAX_LINES */.p9, innerWidth);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        borderStyle: "single",
        borderColor: overrideBorderColor !== null && overrideBorderColor !== void 0 ? overrideBorderColor : "foreground",
        borderDimColor: true,
        paddingLeft: 1,
        paddingRight: 5,
        marginX: 1,
        width: size.width - 2,
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          color: "foreground",
          wrap: "wrap",
          children: clampedContent
        })
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/