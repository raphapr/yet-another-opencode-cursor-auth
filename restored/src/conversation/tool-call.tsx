__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */S: () => (/* binding */ToolCallComponent)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/create-plan-tool-ui.tsx");
    /* harmony import */
    var _components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/delete-tool-ui.tsx");
    /* harmony import */
    var _components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/edit-tool-ui.tsx");
    /* harmony import */
    var _components_glob_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/glob-tool-ui.tsx");
    /* harmony import */
    var _components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/grep-tool-ui.tsx");
    /* harmony import */
    var _components_ls_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/components/ls-tool-ui.tsx");
    /* harmony import */
    var _components_mcp_tool_ui_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/mcp-tool-ui.tsx");
    /* harmony import */
    var _components_read_lints_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/components/read-lints-tool-ui.tsx");
    /* harmony import */
    var _components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/components/read-todos-tool-ui.tsx");
    /* harmony import */
    var _components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/components/read-tool-ui.tsx");
    /* harmony import */
    var _components_sem_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/components/sem-search-tool-ui.tsx");
    /* harmony import */
    var _components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/components/shell-tool-ui.tsx");
    /* harmony import */
    var _components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/components/update-todos-tool-ui.tsx");
    /* harmony import */
    var _components_web_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/components/web-search-tool-ui.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_2__, _components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__, _components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_4__, _components_glob_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__, _components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__, _components_ls_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__, _components_mcp_tool_ui_js__WEBPACK_IMPORTED_MODULE_8__, _components_read_lints_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__, _components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_10__, _components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_11__, _components_sem_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_12__, _components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_13__, _components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_14__, _components_web_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_15__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_2__, _components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__, _components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_4__, _components_glob_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__, _components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__, _components_ls_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__, _components_mcp_tool_ui_js__WEBPACK_IMPORTED_MODULE_8__, _components_read_lints_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__, _components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_10__, _components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_11__, _components_sem_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_12__, _components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_13__, _components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_14__, _components_web_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_15__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const ToolCallComponent = ({
      call: {
        call,
        aborted
      },
      isLastStepOfTurn,
      isLastTurn,
      options: {
        isCompact,
        isSuggestingPlan,
        isGenerating,
        planDecisionIndex,
        shellManager
      }
    }) => {
      switch (call.tool.case) {
        case "shellToolCall":
          {
            // Expand only for items belonging to the last (pending) turn when compact mode is off.
            const expandShell = !isCompact && !!isLastTurn;
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_13__ /* .ShellToolUI */.f, {
              tool: call.tool.value,
              expand: expandShell,
              aborted: aborted,
              shellManager: shellManager
            });
          }
        case "deleteToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .DeleteToolUI */.Y, {
            tool: call.tool.value
          });
        case "grepToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__ /* .GrepToolUI */.h, {
            tool: call.tool.value
          });
        case "semSearchToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_sem_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_12__ /* .SemSearchToolUI */.S, {
            tool: call.tool.value
          });
        case "globToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_glob_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .GlobToolUI */.P, {
            tool: call.tool.value
          });
        case "editToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .EditToolUI */.N, {
            tool: call.tool.value,
            aborted: aborted
          });
        case "readToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_11__ /* .ReadToolUI */.B, {
            tool: call.tool.value
          });
        case "readLintsToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_read_lints_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__ /* ["default"] */.A, {
            tool: call.tool.value
          });
        case "updateTodosToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_14__ /* .UpdateTodosToolUI */.v, {
            tool: call.tool.value,
            aborted: aborted
          });
        case "readTodosToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_10__ /* .ReadTodosToolUI */.w, {
            tool: call.tool.value,
            aborted: aborted
          });
        case "lsToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ls_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__ /* .LsToolUI */.U, {
            tool: call.tool.value
          });
        case "mcpToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_tool_ui_js__WEBPACK_IMPORTED_MODULE_8__ /* .McpToolUI */.v, {
            tool: call.tool.value
          });
        case "webSearchToolCall":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_web_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_15__ /* .WebSearchToolUI */.F, {
            tool: call.tool.value
          });
        case "createPlanToolCall":
          {
            const state = isLastStepOfTurn && isLastTurn ? isSuggestingPlan ? "pending" : isGenerating ? "accepted" : "rejected" : isLastStepOfTurn ? "rejected" : "accepted";
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .CreatePlanToolUI */.U, {
              tool: call.tool.value,
              isSuggestingPlan: isSuggestingPlan,
              planDecisionIndex: planDecisionIndex,
              state: state
            });
          }
        default:
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "red",
              children: ["Unknown tool type: ", JSON.stringify(call.tool.case)]
            })
          });
      }
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/