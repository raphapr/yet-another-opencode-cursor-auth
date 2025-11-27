__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */j: () => (/* binding */StaticItemComponent)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _components_app_header_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/app-header.tsx");
    /* harmony import */
    var _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/create-plan-tool-ui.tsx");
    /* harmony import */
    var _components_markdown_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/markdown.tsx");
    /* harmony import */
    var _components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/merged-read-search-tool-ui.tsx");
    /* harmony import */
    var _components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/shell-turn-ui.tsx");
    /* harmony import */
    var _components_summary_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/components/summary.tsx");
    /* harmony import */
    var _components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/user-message-ui.tsx");
    /* harmony import */
    var _tool_call_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/conversation/tool-call.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_app_header_js__WEBPACK_IMPORTED_MODULE_2__, _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_4__, _components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__, _components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_6__, _components_summary_js__WEBPACK_IMPORTED_MODULE_7__, _components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_8__, _tool_call_js__WEBPACK_IMPORTED_MODULE_9__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_app_header_js__WEBPACK_IMPORTED_MODULE_2__, _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_4__, _components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__, _components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_6__, _components_summary_js__WEBPACK_IMPORTED_MODULE_7__, _components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_8__, _tool_call_js__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const debug = false;
    const StaticItemComponent = ({
      item,
      options
    }) => {
      if (debug) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            children: JSON.stringify(item, null, 2)
          })
        });
      }
      if (item.type === "summary") {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_summary_js__WEBPACK_IMPORTED_MODULE_7__ /* .Summary */.B, {
          summary: item.summary
        });
      }
      if (item.type === "agent-text") {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_markdown_js__WEBPACK_IMPORTED_MODULE_4__ /* ["default"] */.Ay, {
            content: item.text
          })
        });
      }
      if (item.type === "debug-info") {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            children: ["Debug info: ", item.serverUrl]
          })
        });
      }
      if (item.type === "header") {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_app_header_js__WEBPACK_IMPORTED_MODULE_2__ /* .AppHeader */.j, {
          isRepository: item.isRepository,
          folderMode: item.folderMode
        });
      }
      if (item.type === "user-message") {
        if (options.hideUserMessages) {
          return null;
        }
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_8__ /* .UserMessageUI */.H, {
          content: item.message
        });
      }
      if (item.type === "agent-tool-calls") {
        if (item.calls.length > 1) {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .MergedReadSearchToolUI */.r, {
              tools: item.calls
            })
          });
        }
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          children: item.calls.map((call, _index) => {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              paddingX: 2,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_js__WEBPACK_IMPORTED_MODULE_9__ /* .ToolCallComponent */.S, {
                call: call,
                options: options,
                isLastStepOfTurn: false,
                isLastTurn: item.isLastTurn
              })
            }, call.id);
          })
        });
      }
      if (item.type === "plan") {
        if (item.call.tool.case !== "createPlanToolCall") {
          return null;
        }
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .CreatePlanToolUI */.U, {
            tool: item.call.tool.value,
            isSuggestingPlan: false,
            planDecisionIndex: item.decisionIndex,
            state: item.decisionIndex === 0 ? "accepted" : "rejected"
          })
        });
      }
      if (item.type === "shell-turn") {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_6__ /* .ShellTurnUI */.o, {
            command: item.command,
            output: item.stdout,
            exitCode: item.exitCode
          })
        });
      }
      return null;
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/