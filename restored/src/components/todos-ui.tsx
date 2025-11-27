__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */S: () => (/* binding */TodosUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../proto/dist/generated/agent/v1/todo_tool_pb.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/tool-call-header.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const TodosUI = ({
      todos,
      totalCount: _totalCount,
      loading,
      error,
      mode,
      filters,
      showHeader = true,
      isCreating = false
    }) => {
      const action = mode === "read" ? "Reading" : isCreating ? "Creating" : "Updating";
      if (loading) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolCallHeader */.C, {
          name: "To-do",
          primary: `${action} to-dos${filters ? ` ${filters}` : ""}...`,
          status: "pending"
        });
      }
      if (error) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingLeft: 1,
          paddingRight: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "red",
            children: ["Error", " ", mode === "read" ? "reading" : isCreating ? "creating" : "updating", " ", "to-dos: ", error]
          })
        });
      }
      if (todos.length === 0) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingLeft: 1,
          paddingRight: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: ["No to-dos found", filters ? ` ${filters}` : ""]
          })
        });
      }
      const completed = todos.filter(t => t.status === _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .TodoStatus */.Vj.COMPLETED);
      const inProgress = todos.filter(t => t.status === _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .TodoStatus */.Vj.IN_PROGRESS);
      const pending = todos.filter(t => t.status === _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .TodoStatus */.Vj.PENDING);
      const workingCount = inProgress.length + pending.length;
      const doneCount = completed.length;
      const lines = [];
      for (const t of completed) lines.push({
        icon: "☒",
        text: t.content
      });
      for (const t of inProgress) lines.push({
        icon: "☐",
        text: t.content
      });
      for (const t of pending) lines.push({
        icon: "☐",
        text: t.content
      });
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: [showHeader && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolCallHeader */.C, {
          name: "To-do",
          primary: (() => {
            const noun = workingCount === 1 ? "to-do" : "to-dos";
            const donePart = workingCount > 0 && doneCount > 0 ? ` • ${doneCount} done` : "";
            if (workingCount > 0) return `Working on ${workingCount} ${noun}${donePart}`;
            return "All done";
          })(),
          status: "success"
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: lines.map((l, i) => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "row",
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              children: [l.icon, " "]
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              wrap: "wrap",
              children: l.text
            })]
          }, `${l.icon}-${l.text}-${i}`))
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/