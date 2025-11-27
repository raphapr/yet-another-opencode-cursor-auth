__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */C: () => (/* binding */DynamicItemComponent)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/create-plan-tool-ui.tsx");
    /* harmony import */
    var _components_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/index.ts");
    /* harmony import */
    var _components_markdown_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/markdown.tsx");
    /* harmony import */
    var _components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/merged-read-search-tool-ui.tsx");
    /* harmony import */
    var _components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/components/shell-turn-ui.tsx");
    /* harmony import */
    var _tool_call_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/conversation/tool-call.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__, _components_index_js__WEBPACK_IMPORTED_MODULE_4__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_5__, _components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__, _components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_7__, _tool_call_js__WEBPACK_IMPORTED_MODULE_8__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_create_plan_tool_ui_js__WEBPACK_IMPORTED_MODULE_3__, _components_index_js__WEBPACK_IMPORTED_MODULE_4__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_5__, _components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__, _components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_7__, _tool_call_js__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const THROTTLE_DELAY = 200;
    /**
     * ThrottledMarkdown component that limits updates to a maximum of 1 update every 500ms
     * while ensuring the final content is always displayed correctly
     */
    const ThrottledMarkdown = ({
      content
    }) => {
      const [displayedContent, setDisplayedContent] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(content);
      const timeoutRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      const lastUpdateRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(0);
      const isFirstRender = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(true);
      const displayParagraphs = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        return displayedContent.split("\n\n").length;
      }, [displayedContent]);
      const liveParagraphs = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        return content.split("\n\n").length;
      }, [content]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // On first render, always update immediately
        if (isFirstRender.current || displayParagraphs < liveParagraphs) {
          setDisplayedContent(content);
          lastUpdateRef.current = performance.now();
          isFirstRender.current = false;
          return;
        }
        const now = performance.now();
        const timeSinceLastUpdate = now - lastUpdateRef.current;
        // If enough time has passed since the last update, update immediately
        if (timeSinceLastUpdate >= THROTTLE_DELAY) {
          setDisplayedContent(content);
          lastUpdateRef.current = now;
          return;
        }
        // Schedule an update for the remaining time
        const remainingTime = THROTTLE_DELAY - timeSinceLastUpdate;
        timeoutRef.current = setTimeout(() => {
          setDisplayedContent(content);
          lastUpdateRef.current = performance.now();
        }, remainingTime);
        // Cleanup function
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, [content, displayParagraphs, liveParagraphs]);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_markdown_js__WEBPACK_IMPORTED_MODULE_5__ /* ["default"] */.Ay, {
        content: displayedContent
      });
    };
    const debug = false;
    const DynamicItemComponent = ({
      item,
      options
    }) => {
      if (debug) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "red",
            children: JSON.stringify(item, null, 2)
          })
        });
      }
      if (item.type === "agent-text") {
        const text = item.completed ? item.text : item.text.slice(0, item.text.lastIndexOf("\n"));
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ThrottledMarkdown, {
            content: text
          })
        });
      }
      if (item.type === "user-message") {
        if (options.hideUserMessages) {
          return null;
        }
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_index_js__WEBPACK_IMPORTED_MODULE_4__ /* .UserMessageUI */.Hw, {
          content: item.message
        });
      }
      if (item.type === "agent-tool-calls") {
        if (item.calls.length > 1) {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_merged_read_search_tool_ui_js__WEBPACK_IMPORTED_MODULE_6__ /* .MergedReadSearchToolUI */.r, {
              tools: item.calls
            })
          });
        }
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          children: item.calls.map((call, _index) => {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              paddingX: 2,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_js__WEBPACK_IMPORTED_MODULE_8__ /* .ToolCallComponent */.S, {
                call: call,
                options: options,
                isLastStepOfTurn: item.isLastStepOfTurn,
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
            isSuggestingPlan: true,
            planDecisionIndex: item.decisionIndex,
            state: "pending"
          })
        });
      }
      if (item.type === "shell-turn") {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_turn_ui_js__WEBPACK_IMPORTED_MODULE_7__ /* .ShellTurnUI */.o, {
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