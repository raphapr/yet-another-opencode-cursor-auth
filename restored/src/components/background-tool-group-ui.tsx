__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */i: () => (/* binding */BackgroundToolGroupUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../proto/dist/generated/aiserver/v1/tools_pb.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/tool-call-header.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    function enumName(tool) {
      if (tool === undefined || tool === null) return "UNKNOWN";
      // Enum has reverse mapping: number -> name
      const name = _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .ClientSideToolV2 */.XaY[tool];
      return typeof name === "string" ? name : `TOOL_${String(tool)}`;
    }
    function classifyVerb(name, completed) {
      const upper = name.toUpperCase();
      // Try to map common tool names to our unified verb map
      if (upper.includes("SEMSEARCH") || upper.includes("SEMANTIC_SEARCH")) return (0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .resolveToolVerbByCase */.F_)("semSearchToolCall", completed) || (completed ? "Searched" : "Searching");
      if (upper.includes("GREP")) return (0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .resolveToolVerbByCase */.F_)("grepToolCall", completed) || (completed ? "Grepped" : "Grepping");
      if (upper.includes("READ")) return (0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .resolveToolVerbByCase */.F_)("readToolCall", completed) || (completed ? "Read" : "Reading");
      if (upper.includes("GLOB")) return (0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .resolveToolVerbByCase */.F_)("globToolCall", completed) || (completed ? "Globbed" : "Globbing");
      if (upper.includes("LIST")) return (0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .resolveToolVerbByCase */.F_)("lsToolCall", completed) || (completed ? "Listed" : "Listing");
      if (upper.includes("EDIT")) return (0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .resolveToolVerbByCase */.F_)("editToolCall", completed) || (completed ? "Edited" : "Editing");
      if (upper.includes("SHELL") || upper.includes("TERMINAL")) return (0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .resolveToolVerbByCase */.F_)("shellToolCall", completed) || (completed ? "Ran" : "Running");
      // Fallback
      return completed ? name : `${name}…`;
    }
    const BackgroundToolGroupUI = ({
      toolCalls,
      forceCompleted
    }) => {
      const allCompleted = toolCalls.every(t => !!t.result);
      // Order of first appearance for type summary and name construction
      const typeOrder = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        const seen = new Set();
        const order = [];
        for (const t of toolCalls) {
          const ty = t.call.tool;
          if (!seen.has(ty)) {
            seen.add(ty);
            order.push(ty);
          }
        }
        return order;
      }, [toolCalls]);
      // Counts per type
      const countByType = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        var _a;
        const map = {};
        for (const t of toolCalls) {
          const ty = t.call.tool;
          map[ty] = ((_a = map[ty]) !== null && _a !== void 0 ? _a : 0) + 1;
        }
        return map;
      }, [toolCalls]);
      // Completion status per type (true if all calls of that type completed)
      const completedByType = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        const completionMap = {};
        for (const t of toolCalls) {
          const ty = t.call.tool;
          const isCompletedForCall = !!t.result;
          if (completionMap[ty] === undefined) {
            completionMap[ty] = isCompletedForCall;
          } else {
            completionMap[ty] = completionMap[ty] && isCompletedForCall;
          }
        }
        return completionMap;
      }, [toolCalls]);
      // Primary summary like: "2 edits, 1 shell"
      const primary = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        var _a;
        const parts = [];
        for (const ty of typeOrder) {
          const n = (_a = countByType[ty]) !== null && _a !== void 0 ? _a : 0;
          if (n <= 0) continue;
          const name = enumName(ty).toUpperCase();
          const label = (() => {
            if (name.includes("EDIT")) return `${n} edit${n === 1 ? "" : "s"}`;
            if (name.includes("SHELL") || name.includes("TERMINAL")) return `${n} shell${n === 1 ? "" : "s"}`;
            if (name.includes("SEMSEARCH") || name.includes("SEMANTIC_SEARCH")) return `${n} search${n === 1 ? "" : "es"}`;
            if (name.includes("GREP")) return `${n} grep${n === 1 ? "" : "s"}`;
            if (name.includes("READ")) return `${n} file${n === 1 ? "" : "s"}`;
            if (name.includes("GLOB")) return `${n} glob${n === 1 ? "" : "s"}`;
            if (name.includes("LIST")) return `${n} director${n === 1 ? "y" : "ies"}`;
            return `${n} call${n === 1 ? "" : "s"}`;
          })();
          parts.push(label);
        }
        return parts.join(", ");
      }, [typeOrder, countByType]);
      // Name from verbs in chronological order: e.g. "Edited, Ran"
      const headerName = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        var _a;
        const parts = [];
        const seen = new Set();
        for (const t of toolCalls) {
          const ty = t.call.tool;
          if (seen.has(ty)) continue;
          seen.add(ty);
          const n = enumName(ty);
          const completedForType = forceCompleted ? true : (_a = completedByType[ty]) !== null && _a !== void 0 ? _a : false;
          parts.push(classifyVerb(n, completedForType));
        }
        const raw = parts.join(", ");
        return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Tools";
      }, [toolCalls, completedByType, forceCompleted]);
      const status = allCompleted || !!forceCompleted ? "success" : "pending";
      if (!toolCalls || toolCalls.length === 0) return null;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_5__ /* .ToolCallHeader */.C, {
          name: headerName,
          primary: primary,
          status: status
        })
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/