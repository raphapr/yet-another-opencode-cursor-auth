__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */N: () => (/* binding */EditToolUI)
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
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/highlighted-code.tsx");
    /* harmony import */
    var _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/inline-delta.tsx");
    /* harmony import */
    var _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/tool-row-box.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__, _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__, _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const EditToolUI = ({
      tool,
      aborted
    }) => {
      var _a, _b, _c;
      const args = tool.args;
      const result = tool.result;
      if (!args || !args.path) {
        return null;
      }
      const pathDisplay = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)(args.path);
      if (!result || !result.result) {
        const headerName = (0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .resolveToolVerbByCase */.F_)("editToolCall", false) || "Editing";
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__ /* .ToolRowBox */.Y, {
          flexDirection: "column",
          paddingRight: 2,
          paddingLeft: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                bold: true,
                children: headerName
              }), " ", pathDisplay, aborted ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  children: " "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "gray",
                  children: "Aborted"
                })]
              }) : null]
            })
          })
        });
      }
      const rr = result.result;
      let note;
      let color = "gray";
      let diffString;
      if (aborted) {
        note = "Aborted";
        color = "gray";
      } else {
        switch (rr.case) {
          case "success":
            {
              const linesRemoved = (_a = rr.value.linesRemoved) !== null && _a !== void 0 ? _a : 0;
              const linesAdded = (_b = rr.value.linesAdded) !== null && _b !== void 0 ? _b : 0;
              note = (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_inline_delta_js__WEBPACK_IMPORTED_MODULE_5__ /* .InlineDelta */._, {
                removed: linesRemoved,
                added: linesAdded
              });
              diffString = rr.value.diffString;
              break;
            }
          case "fileNotFound":
            note = "File not found";
            color = "gray";
            break;
          case "readPermissionDenied":
            note = "Permission denied reading";
            color = "gray";
            break;
          case "writePermissionDenied":
            note = String(rr.value.error) || "Permission denied writing";
            color = "gray";
            break;
          case "rejected":
            note = "Edit rejected";
            color = "yellow";
            break;
          case "error":
            note = rr.value.error || "Edit error";
            color = "gray";
            break;
          default:
            {
              const _exhaustiveCheck = rr.case;
              void _exhaustiveCheck;
              note = "Unknown edit result";
              color = "gray";
              break;
            }
        }
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__ /* .ToolRowBox */.Y, {
        flexDirection: "column",
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "row",
          gap: 1,
          paddingX: 1,
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexShrink: 0,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              children: pathDisplay
            })
          }), typeof note === "string" ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: color,
            wrap: "truncate",
            children: note
          }) : note ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            children: note
          }) : null]
        }), diffString ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ /* .HighlightedCode */.d, {
          content: diffString,
          language: (_c = (0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .inferLanguageFromPath */.Ak)(args.path)) !== null && _c !== void 0 ? _c : "diff",
          isDiff: true,
          showLineNumbers: false,
          maxLines: 12,
          truncationHint: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .REVIEW_MODE_ENABLED */.hD ? "ctrl+r to review" : undefined,
          paddingX: 1
        }) : null]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/