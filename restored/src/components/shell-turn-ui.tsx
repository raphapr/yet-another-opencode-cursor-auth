__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */o: () => (/* binding */ShellTurnUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/context/agent-state-context.tsx");
    /* harmony import */
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/highlighted-code.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const ShellTurnUI = ({
      command,
      output,
      exitCode
    }) => {
      command = command.trim();
      const isCompleted = exitCode !== undefined;
      const isCompact = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_3__ /* .useIsCompact */.tO)();
      const expand = !isCompact; // Ctrl+O toggles compact globally
      // Truncate output if it exceeds MAX_SHELL_OUTPUT_SIZE
      const outputSize = Buffer.byteLength(output, "utf8");
      const isTruncated = outputSize > _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .MAX_SHELL_OUTPUT_SIZE */.qg;
      const displayOutput = isTruncated ? Buffer.from(output, "utf8").subarray(0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .MAX_SHELL_OUTPUT_SIZE */.qg).toString("utf8") : output;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        marginTop: 1,
        marginBottom: 1,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "row",
          alignItems: "flex-start",
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            width: 2,
            flexShrink: 0,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              children: "$ "
            })
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexGrow: 1,
            flexShrink: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              wrap: "wrap",
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "foreground",
                children: command
              }), !isCompleted ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  children: " "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "gray",
                  children: "Running\u2026"
                })]
              }) : exitCode != null ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  children: " "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "gray",
                  children: ["exit ", exitCode]
                })]
              }) : null]
            })
          })]
        }), output ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingLeft: 1,
          flexDirection: "column",
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_4__ /* .HighlightedCode */.d, {
            content: displayOutput,
            language: "plaintext",
            showLineNumbers: false,
            maxLines: expand ? _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .SHELL_OUTPUT_EXPANDED_MAX_LINES */.U5 : _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .SHELL_TURN_OUTPUT_PREVIEW_LINES */.a6,
            truncationHint: expand ? undefined : "ctrl+o to expand",
            dimmed: true
          }), isTruncated && expand ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "yellow",
              dimColor: true,
              children: ["Output truncated at 1MiB limit (", Math.round(outputSize / 1024), " ", "KB total)"]
            })
          }) : null, expand ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              dimColor: true,
              children: "ctrl+o to collapse"
            })
          }) : null]
        }) : null]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/