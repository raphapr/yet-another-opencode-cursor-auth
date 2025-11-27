__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../local-exec/dist/index.js");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/highlighted-code.tsx");
    /* harmony import */
    var _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/inline-delta.tsx");
    /* harmony import */
    var _mcp_tool_decision_preview_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/mcp-tool-decision-preview.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__, _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__, _mcp_tool_decision_preview_js__WEBPACK_IMPORTED_MODULE_6__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__, _inline_delta_js__WEBPACK_IMPORTED_MODULE_5__, _mcp_tool_decision_preview_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    function getShellString(operation) {
      const command = operation.details.command || "";
      const base = command.length > 80 ? `${command.slice(0, 77)}...` : command;
      const rawReason = operation.details.reason;
      const reason = typeof rawReason === "string" ? rawReason : undefined;
      return reason ? `${base}\nReason: ${reason}` : base;
    }
    function getDecisionDisplayString(decision) {
      switch (decision.operation.type) {
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Shell:
          {
            return getShellString(decision.operation);
          }
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Delete:
          {
            const rel = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .toRelativePath */.fw)(decision.operation.details.path);
            return `Delete file: ${rel}`;
          }
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Write:
          {
            const rel = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .toRelativePath */.fw)(decision.operation.details.path);
            return `Write file: ${rel}. Reason: ${decision.operation.details.reason}\n\n${decision.operation.details.diffString}`;
          }
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Mcp:
          {
            const details = decision.operation.details;
            const argsStr = Object.keys(details.args).length > 0 ? `\nArgs: ${JSON.stringify(details.args, null, 2)}` : "";
            return `MCP Provider: ${details.providerIdentifier}. MCP tool: ${details.toolName}${argsStr}`;
          }
      }
    }
    const PendingDecisionsBanner = ({
      decisions
    }) => {
      if (decisions.length === 0) return null;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        borderColor: "gray",
        borderStyle: "single",
        borderDimColor: true,
        paddingX: 1,
        marginX: 1,
        children: decisions.map(decision => {
          const displayString = getDecisionDisplayString(decision);
          let displayNode;
          if (decision.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Shell) {
            const prefix = decision.operation.details.isSandboxEnabled ? "🔒 " : "$ ";
            displayNode = (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexDirection: "row",
              alignItems: "flex-start",
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                width: 3,
                flexShrink: 0,
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "foreground",
                  children: prefix
                })
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                flexGrow: 1,
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "foreground",
                  wrap: "wrap",
                  children: [decision.operation.details.command, " ", (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                    color: "gray",
                    children: ["in", " ", (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .truncatePathMiddle */.tk)((0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .toRelativePath */.fw)(decision.operation.details.workingDirectory), 50)]
                  })]
                })
              })]
            });
          } else if (decision.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Write) {
            let plus = 0;
            let minus = 0;
            for (const line of decision.operation.details.diffString.split("\n")) {
              if (line.startsWith("+")) {
                plus++;
              } else if (line.startsWith("-")) {
                minus++;
              }
            }
            const pathDisplay = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)((0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .toRelativePath */.fw)(decision.operation.details.path));
            displayNode = (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexDirection: "column",
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "foreground",
                  children: pathDisplay
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_inline_delta_js__WEBPACK_IMPORTED_MODULE_5__ /* .InlineDelta */._, {
                  added: plus,
                  removed: minus
                })]
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                borderTop: true,
                borderLeft: false,
                borderRight: false,
                borderBottom: false,
                borderColor: "gray",
                borderStyle: "single",
                borderDimColor: true,
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ /* ["default"] */.A, {
                  content: decision.operation.details.diffString,
                  language: "diff",
                  showLineNumbers: false,
                  maxLines: 40,
                  isDiff: true
                })
              })]
            });
          } else if (decision.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Mcp) {
            const details = decision.operation.details;
            displayNode = (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_mcp_tool_decision_preview_js__WEBPACK_IMPORTED_MODULE_6__ /* .McpToolDecisionPreview */.t, {
              providerIdentifier: details.providerIdentifier,
              toolName: details.toolName,
              args: details.args
            });
          } else {
            displayNode = (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              dimColor: true,
              children: displayString
            });
          }
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            children: displayNode
          }, decision.id);
        })
      });
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = PendingDecisionsBanner;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/