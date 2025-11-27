__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* unused harmony export ReadLintsToolUI */
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/tool-call-header.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const ReadLintsToolUI = ({
      tool: {
        args,
        result
      }
    }) => {
      var _a;
      const paths = (args === null || args === void 0 ? void 0 : args.paths) || [];
      const primary = paths.length === 0 ? "workspace" : paths.length === 1 ? (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)(paths[0]) : `${(0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)(paths[0])} (+${paths.length - 1} more)`;
      let status = "pending";
      const caseType = (_a = result === null || result === void 0 ? void 0 : result.result) === null || _a === void 0 ? void 0 : _a.case;
      switch (caseType) {
        case undefined:
          status = "pending";
          break;
        case "error":
          status = "error";
          break;
        case "success":
          status = "success";
          break;
        default:
          {
            const _exhaustive = caseType;
            status = "pending";
            break;
          }
      }
      const headerName = (() => {
        const verb = (0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .resolveToolVerbByCase */.F_)("readLintsToolCall", status === "success") || (status === "success" ? "Read" : "Reading");
        return `${verb} Lints`;
      })();
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolCallHeader */.C, {
          name: headerName,
          primary: primary,
          status: status
        }), (() => {
          const rr = result === null || result === void 0 ? void 0 : result.result;
          if ((rr === null || rr === void 0 ? void 0 : rr.case) === "error") {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: ["Error: ", rr.value.errorMessage]
              })
            });
          }
          return null;
        })(), (() => {
          const rr = result === null || result === void 0 ? void 0 : result.result;
          if ((rr === null || rr === void 0 ? void 0 : rr.case) === "success") {
            const totalDiagnostics = rr.value.totalDiagnostics || 0;
            const totalFiles = rr.value.totalFiles || 0;
            // Show a concise summary, consistent with other tools' summaries
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: ["Found ", totalDiagnostics, " issue", totalDiagnostics === 1 ? "" : "s", totalFiles > 0 ? ` in ${totalFiles} file${totalFiles === 1 ? "" : "s"}` : ""]
              })
            });
          }
          return null;
        })()]
      });
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = ReadLintsToolUI;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/