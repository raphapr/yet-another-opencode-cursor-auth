__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */S: () => (/* binding */SemSearchToolUI)
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
    const SemSearchToolUI = ({
      tool: {
        args,
        result
      }
    }) => {
      var _a;
      if (!args || !args.query) return null;
      const queryDisplay = args.query.length > 40 ? `...${args.query.slice(-37)}` : args.query;
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
            void _exhaustive;
            status = "pending";
            break;
          }
      }
      const note = (() => {
        var _a;
        const dirs = (_a = args.targetDirectories) !== null && _a !== void 0 ? _a : [];
        if (!dirs || dirs.length === 0) return undefined;
        // Show up to 3 paths if the total display length stays modest; else collapse.
        const MAX_DISPLAYED = 3;
        const MAX_TOTAL_LENGTH = 100; // heuristic to avoid wrapping too much
        const displays = [];
        let totalLen = 0;
        for (let i = 0; i < Math.min(dirs.length, MAX_DISPLAYED); i++) {
          const disp = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)(dirs[i] || ".");
          if (displays.length === 0 || totalLen + 2 + disp.length <= MAX_TOTAL_LENGTH) {
            displays.push(disp);
            totalLen += disp.length + (displays.length > 1 ? 2 : 0); // account for ', '
          } else {
            break;
          }
        }
        const remaining = dirs.length - displays.length;
        const display = remaining > 0 ? `${displays.join(", ")} (+${remaining} more)` : displays.join(", ");
        return `in ${display}`;
      })();
      const headerName = (0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .resolveToolVerbByCase */.F_)("semSearchToolCall", status === "success") || (status === "success" ? "Searched" : "Searching");
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolCallHeader */.C, {
          name: headerName,
          primary: `"${queryDisplay}"`,
          status: status,
          note: note
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
            const results = rr.value.results || "";
            const matches = results.match(/<search_result\b/g);
            const total = matches ? matches.length : 0;
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: ["Found ", total, " results"]
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