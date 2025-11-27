__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */l: () => (/* binding */BackgroundEditToolUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/highlighted-code.tsx");
    /* harmony import */
    var _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/inline-delta.tsx");
    /* harmony import */
    var _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/tool-row-box.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__, _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__, _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const BackgroundEditToolUI = ({
      path,
      result
    }) => {
      var _a;
      const diff = result === null || result === void 0 ? void 0 : result.diff;
      const linesAdded = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (!(diff === null || diff === void 0 ? void 0 : diff.chunks) || diff.chunks.length === 0) return 0;
        return diff.chunks.map(c => {
          var _a;
          return (_a = c.linesAdded) !== null && _a !== void 0 ? _a : 0;
        }).reduce((a, b) => a + b, 0);
      }, [diff === null || diff === void 0 ? void 0 : diff.chunks]);
      const linesRemoved = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (!(diff === null || diff === void 0 ? void 0 : diff.chunks) || diff.chunks.length === 0) return 0;
        return diff.chunks.map(c => {
          var _a;
          return (_a = c.linesRemoved) !== null && _a !== void 0 ? _a : 0;
        }).reduce((a, b) => a + b, 0);
      }, [diff === null || diff === void 0 ? void 0 : diff.chunks]);
      const diffString = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        var _a, _b, _c, _d, _e;
        const d = diff;
        if (!d || !d.chunks || d.chunks.length === 0) return undefined;
        let out = "";
        for (const chunk of d.chunks) {
          const oldStart = (_a = chunk.oldStart) !== null && _a !== void 0 ? _a : 0;
          const oldLines = (_b = chunk.oldLines) !== null && _b !== void 0 ? _b : 0;
          const newStart = (_c = chunk.newStart) !== null && _c !== void 0 ? _c : 0;
          const newLines = (_d = chunk.newLines) !== null && _d !== void 0 ? _d : 0;
          out += `@@ -${oldStart},${oldLines} +${newStart},${newLines} @@\n`;
          const content = (_e = chunk.diffString) !== null && _e !== void 0 ? _e : "";
          if (content) {
            for (const line of content.split("\n")) {
              if (!line) {
                out += "\n";
                continue;
              }
              if (line.startsWith("@@")) continue; // avoid duplicate headers inside chunk
              out += `${line}\n`;
            }
          }
        }
        return out.trimEnd();
      }, [diff]);
      const note = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        var _a;
        if (!result) return undefined;
        if (result.rejected) return "Edit rejected";
        if ((_a = result.recoverableError) === null || _a === void 0 ? void 0 : _a.modelMessage) return result.recoverableError.modelMessage;
        if (linesAdded > 0 || linesRemoved > 0) return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_inline_delta_js__WEBPACK_IMPORTED_MODULE_5__ /* .InlineDelta */._, {
          added: linesAdded,
          removed: linesRemoved
        });
        return undefined;
      }, [result, linesAdded, linesRemoved]);
      const noteColor = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        return (result === null || result === void 0 ? void 0 : result.rejected) ? "yellow" : "gray";
      }, [result === null || result === void 0 ? void 0 : result.rejected]);
      if (!path) return null;
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
              children: path
            })
          }), typeof note === "string" ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: noteColor,
            wrap: "truncate",
            children: note
          }) : note ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            children: note
          }) : null]
        }), diffString ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ /* .HighlightedCode */.d, {
          content: diffString,
          language: (_a = (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .inferLanguageFromPath */.Ak)(path)) !== null && _a !== void 0 ? _a : "diff",
          isDiff: true,
          showLineNumbers: false,
          maxLines: 12,
          truncationHint: _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .REVIEW_MODE_ENABLED */.hD ? "ctrl+r to review" : undefined,
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