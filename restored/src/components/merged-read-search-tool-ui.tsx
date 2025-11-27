__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */r: () => (/* binding */MergedReadSearchToolUI)
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
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/tool-call-header.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const MergedReadSearchToolUI = ({
      tools,
      treatAsPending = false
    }) => {
      var _a;
      const allCompleted = tools.every(tool => tool.completed);
      // Group tools by type for header counts
      const readTools = [];
      const grepTools = [];
      const semSearchTools = [];
      const globTools = [];
      const lsTools = [];
      tools.forEach(toolStep => {
        if (toolStep.call.tool.case === "readToolCall") readTools.push(toolStep.call.tool.value);else if (toolStep.call.tool.case === "grepToolCall") grepTools.push(toolStep.call.tool.value);else if (toolStep.call.tool.case === "semSearchToolCall") semSearchTools.push(toolStep.call.tool.value);else if (toolStep.call.tool.case === "globToolCall") globTools.push(toolStep.call.tool.value);else if (toolStep.call.tool.case === "lsToolCall") lsTools.push(toolStep.call.tool.value);
      });
      // Build descriptive text (ordered by first occurrence in chronological tools)
      const toolOrder = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        const seen = new Set();
        const order = [];
        for (const t of tools) {
          const k = t.call.tool.case;
          if (!k) continue;
          if (!seen.has(k)) {
            seen.add(k);
            order.push(k);
          }
        }
        return order;
      }, [tools]);
      const countByType = {
        readToolCall: readTools.length,
        grepToolCall: grepTools.length,
        semSearchToolCall: semSearchTools.length,
        globToolCall: globTools.length,
        lsToolCall: lsTools.length
      };
      const typeToCountLabel = {
        readToolCall: n => `${n} file${n === 1 ? "" : "s"}`,
        grepToolCall: n => `${n} ${n === 1 ? "grep" : "greps"}`,
        semSearchToolCall: n => `${n} ${n === 1 ? "search" : "searches"}`,
        globToolCall: n => `${n} ${n === 1 ? "glob" : "globs"}`,
        lsToolCall: n => `${n} director${n === 1 ? "y" : "ies"}`
      };
      const operationTextParts = [];
      for (const k of toolOrder) {
        const count = (_a = countByType[k]) !== null && _a !== void 0 ? _a : 0;
        const fmt = typeToCountLabel[k];
        if (count > 0 && fmt) operationTextParts.push(fmt(count));
      }
      const operationText = operationTextParts.join(", ");
      const status = allCompleted && !treatAsPending ? "success" : "pending";
      // Determine combined verb in requested phrasing, ordered by chronological tool appearance
      const nameParts = toolOrder.map(k => (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .resolveToolVerbByCase */.F_)(k, allCompleted && !treatAsPending) || undefined).filter(s => Boolean(s));
      const rawName = nameParts.join(", ") || "Read";
      const toolName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
      const chronological = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        const items = tools.map(toolStep => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j;
          const isCompleted = Boolean(toolStep.completed);
          const toolCase = toolStep.call.tool.case;
          if (toolCase === "readToolCall") {
            const args = toolStep.call.tool.value.args;
            const display = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .getPathDisplay */.Kr)((_a = args === null || args === void 0 ? void 0 : args.path) !== null && _a !== void 0 ? _a : "");
            const ln = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .formatLineNote */.me)(args === null || args === void 0 ? void 0 : args.offset, args === null || args === void 0 ? void 0 : args.limit);
            return {
              verb: (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .resolveToolVerbByCase */.F_)(toolCase, isCompleted) || (isCompleted ? "Read" : "Reading"),
              rest: `${display}${ln ? ` ${ln}` : ""}`
            };
          }
          if (toolCase === "grepToolCall") {
            const args = toolStep.call.tool.value.args;
            const pattern = (_b = args === null || args === void 0 ? void 0 : args.pattern) !== null && _b !== void 0 ? _b : "";
            const patternDisplay = pattern.length > 40 ? `...${pattern.slice(-37)}` : pattern;
            const pathDisplay = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .getPathDisplay */.Kr)((_c = args === null || args === void 0 ? void 0 : args.path) !== null && _c !== void 0 ? _c : "");
            return {
              verb: (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .resolveToolVerbByCase */.F_)(toolCase, isCompleted) || (isCompleted ? "Grepped" : "Grepping"),
              rest: `"${patternDisplay}" in ${pathDisplay}`
            };
          }
          if (toolCase === "semSearchToolCall") {
            const args = toolStep.call.tool.value.args;
            const query = (_d = args === null || args === void 0 ? void 0 : args.query) !== null && _d !== void 0 ? _d : "";
            const queryDisplay = query.length > 40 ? `...${query.slice(-37)}` : query;
            const dirs = (_e = args === null || args === void 0 ? void 0 : args.targetDirectories) !== null && _e !== void 0 ? _e : [];
            const pathDisplay = dirs.length > 0 ? (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .getPathDisplay */.Kr)(dirs[0] || ".") : "";
            const locationText = pathDisplay ? ` in ${pathDisplay}` : "";
            return {
              verb: (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .resolveToolVerbByCase */.F_)(toolCase, isCompleted) || (isCompleted ? "Searched" : "Searching"),
              rest: `"${queryDisplay}"${locationText}`
            };
          }
          if (toolCase === "globToolCall") {
            const args = toolStep.call.tool.value.args;
            const pattern = (_f = args === null || args === void 0 ? void 0 : args.globPattern) !== null && _f !== void 0 ? _f : "";
            const patternDisplay = pattern.length > 40 ? `...${pattern.slice(-37)}` : pattern;
            const pathDisplay = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .getPathDisplay */.Kr)((_g = args === null || args === void 0 ? void 0 : args.targetDirectory) !== null && _g !== void 0 ? _g : "");
            return {
              verb: (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .resolveToolVerbByCase */.F_)(toolCase, isCompleted) || (isCompleted ? "Globbed" : "Globbing"),
              rest: `"${patternDisplay}" in ${pathDisplay}`
            };
          }
          if (toolCase === "lsToolCall") {
            const p = (_j = (_h = toolStep.call.tool.value.args) === null || _h === void 0 ? void 0 : _h.path) !== null && _j !== void 0 ? _j : "";
            const display = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .getPathDisplay */.Kr)(p);
            return {
              verb: (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .resolveToolVerbByCase */.F_)(toolCase, isCompleted) || (isCompleted ? "Listed" : "Listing"),
              rest: `${display}`
            };
          }
          return null;
        }).filter(Boolean);
        const maxLines = 3;
        const total = items.length;
        // By default, show the last `maxLines` items.
        let startIndex = Math.max(0, total - maxLines);
        // If exactly one item would be hidden, show it instead of
        // rendering a "1 item hidden" label. This makes the UI less noisy.
        if (total - maxLines === 1) {
          startIndex = Math.max(0, startIndex - 1);
        }
        const visible = items.slice(startIndex);
        const collapsed = startIndex; // number of items before the start index
        const earlierHiddenLabel = collapsed > 0 ? `${collapsed} earlier ${collapsed === 1 ? "item" : "items"} hidden` : "";
        return {
          visible,
          collapsed,
          earlierHiddenLabel
        };
      }, [tools]);
      const renderChronologicalDetails = () => {
        if (chronological.visible.length === 0) return null;
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: [chronological.collapsed > 0 ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            wrap: "truncate",
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              bold: true,
              children: "\u2026"
            }), " ", chronological.earlierHiddenLabel]
          }) : null, chronological.visible.map((it, _i) => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              bold: true,
              children: it.verb
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              children: " "
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              wrap: "truncate-start",
              children: it.rest
            })]
          }, `${it.verb}-${it.rest}`))]
        });
      };
      if (tools.length === 0) {
        return null;
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        paddingLeft: 1,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__ /* .ToolCallHeader */.C, {
          name: toolName,
          primary: operationText,
          status: status
        }), renderChronologicalDetails()]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/