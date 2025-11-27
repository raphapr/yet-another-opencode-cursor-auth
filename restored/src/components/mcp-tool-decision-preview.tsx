__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */t: () => (/* binding */McpToolDecisionPreview)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/highlighted-code.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_2__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const McpToolDecisionPreview = ({
      providerIdentifier,
      toolName,
      args
    }) => {
      const argEntries = Object.entries(args);
      const hasArgs = argEntries.length > 0;
      const isCompact = argEntries.length <= 3;
      if (!hasArgs) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            bold: true,
            children: [providerIdentifier, ":", " "]
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "foreground",
            children: [toolName, "()"]
          })]
        });
      }
      if (isCompact) {
        // Format inline for 3 or fewer params
        const inlineArgs = argEntries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(", ");
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "row",
          alignItems: "center",
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            bold: true,
            children: [providerIdentifier, ":", " "]
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A, {
            content: `${toolName}(${inlineArgs})`,
            language: "javascript",
            showLineNumbers: false
          })]
        });
      }
      // Multi-line format for more than 3 params
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            bold: true,
            children: [providerIdentifier, ":", " "]
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "foreground",
            children: [toolName, "("]
          })]
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A, {
            content: JSON.stringify(args, null, 2),
            language: "json",
            showLineNumbers: false
          })
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          color: "foreground",
          children: ")"
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/