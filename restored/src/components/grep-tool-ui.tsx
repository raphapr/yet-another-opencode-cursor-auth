__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */h: () => (/* binding */GrepToolUI)
      /* harmony export */
    });
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
    const GrepToolUI = ({
      tool: {
        args,
        result
      }
    }) => {
      var _a, _b;
      if (!args || !args.pattern) {
        return null;
      }
      const patternDisplay = ((_a = args.pattern) === null || _a === void 0 ? void 0 : _a.length) > 40 ? `...${args.pattern.slice(-37)}` : args.pattern || "";
      const pathDisplay = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)(args.path || "");
      let status = "pending";
      const caseType = (_b = result === null || result === void 0 ? void 0 : result.result) === null || _b === void 0 ? void 0 : _b.case;
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
      const headerName = (0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .resolveToolVerbByCase */.F_)("grepToolCall", status === "success") || (status === "success" ? "Grepped" : "Grepping");
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolCallHeader */.C, {
          name: headerName,
          primary: `"${patternDisplay}"`,
          status: status,
          note: `in ${pathDisplay}`
        }), (() => {
          const rr = result === null || result === void 0 ? void 0 : result.result;
          if ((rr === null || rr === void 0 ? void 0 : rr.case) === "error") {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: ["Error: ", rr.value.error]
              })
            });
          }
          return null;
        })(), (() => {
          const rr = result === null || result === void 0 ? void 0 : result.result;
          if ((rr === null || rr === void 0 ? void 0 : rr.case) === "success") {
            let totalMatches = 0;
            const value = Object.values(rr.value.workspaceResults).at(0);
            if (!value) {
              return null;
            }
            const {
              result
            } = value;
            if (!result.value) {
              return null;
            }
            const truncated = result.value.ripgrepTruncated || result.value.clientTruncated;
            switch (result.case) {
              case "count":
                totalMatches = result.value.totalMatches;
                break;
              case "files":
                totalMatches = result.value.totalFiles;
                break;
              case "content":
                totalMatches = result.value.totalMatchedLines;
                break;
            }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: ["Found ", totalMatches, " matches ", truncated ? " (truncated)" : ""]
              })
            });
          }
          return null;
        })()]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/