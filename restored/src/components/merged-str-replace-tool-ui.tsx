__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export MergedStrReplaceToolUI */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/path-utils.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const MergedStrReplaceToolUI = ({
      tools
    }) => {
      if (tools.length === 0) {
        return null;
      }
      // Calculate combined statistics
      let totalLinesAdded = 0;
      let totalLinesRemoved = 0;
      let fileName = "";
      tools.forEach(tool => {
        var _a, _b, _c;
        if (((_a = tool.args) === null || _a === void 0 ? void 0 : _a.path) && ((_b = tool.args) === null || _b === void 0 ? void 0 : _b.oldText) && ((_c = tool.args) === null || _c === void 0 ? void 0 : _c.newText)) {
          fileName = tool.args.path;
          const oldLines = tool.args.oldText.split("\n").length;
          const newLines = tool.args.newText.split("\n").length;
          totalLinesRemoved += oldLines;
          totalLinesAdded += newLines;
        }
      });
      const allCompleted = tools.every(tool => !!tool.result);
      // Truncate long paths like in StrReplaceToolUI
      const pathDisplay = getPathDisplay(fileName);
      return _jsx(Box, {
        flexDirection: "column",
        paddingRight: 2,
        children: _jsxs(Text, {
          color: "gray",
          children: ["Edited ", pathDisplay, " ", _jsxs(Text, {
            color: "red",
            children: ["-", totalLinesRemoved]
          }), " ", _jsxs(Text, {
            color: "green",
            children: ["+", totalLinesAdded]
          }), !allCompleted && _jsx(Text, {
            color: "gray",
            children: " (in progress...)"
          })]
        })
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/