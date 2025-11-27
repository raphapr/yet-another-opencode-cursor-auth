__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */U: () => (/* binding */LsToolUI)
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
    const LsToolUI = ({
      tool: {
        args,
        result
      }
    }) => {
      var _a, _b;
      if (!args) {
        return null;
      }
      const pathDisplay = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)(args.path || "");
      const ignoreDisplay = args.ignore && args.ignore.length > 0 ? ` (ignoring: ${args.ignore.join(", ")})` : "";
      let status = "pending";
      let note;
      // Calculate stats from the tree if successful
      let totalFiles = 0;
      let totalDirs = 0;
      if (((_a = result === null || result === void 0 ? void 0 : result.result) === null || _a === void 0 ? void 0 : _a.case) === "success" && result.result.value.directoryTreeRoot) {
        const countStats = node => {
          totalFiles += node.childrenFiles.length;
          totalDirs += node.childrenDirs.length;
          for (const dir of node.childrenDirs || []) {
            countStats(dir);
          }
        };
        countStats(result.result.value.directoryTreeRoot);
      }
      // Determine status and note based on result
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
          note = `${totalFiles} file${totalFiles === 1 ? "" : "s"}, ${totalDirs} director${totalDirs === 1 ? "y" : "ies"}${ignoreDisplay}`;
          break;
        case "rejected":
          status = "rejected";
          note = (result === null || result === void 0 ? void 0 : result.result.value.reason) || undefined;
          break;
        default:
          {
            const _exhaustive = caseType;
            status = "pending";
            break;
          }
      }
      const headerName = (0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .resolveToolVerbByCase */.F_)("lsToolCall", status === "success") || (status === "success" ? "Listed" : "Listing");
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolCallHeader */.C, {
          name: headerName,
          primary: pathDisplay,
          status: status,
          note: note
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
        })()]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/