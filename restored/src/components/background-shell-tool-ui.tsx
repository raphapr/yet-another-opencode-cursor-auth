__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */d: () => (/* binding */BackgroundShellToolUI)
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
    var _utils_characters_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/utils/characters.ts");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/highlighted-code.tsx");
    /* harmony import */
    var _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/tool-row-box.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_5__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_5__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const BackgroundShellToolUI = ({
      command,
      cwd,
      result,
      expand
    }) => {
      var _a;
      const cmd = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (command || "").trim(), [command]);
      const workingDirDisplay = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        const wd = cwd || (result === null || result === void 0 ? void 0 : result.resultingWorkingDirectory) || undefined;
        if (!wd) return undefined;
        const rel = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .toRelativePath */.fw)(wd);
        const human = rel === "." ? "current dir" : rel;
        return (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .truncatePathMiddle */.tk)(human, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .MAX_DIRECTORY_DISPLAY_LENGTH */.DN);
      }, [cwd, result === null || result === void 0 ? void 0 : result.resultingWorkingDirectory]);
      const formatDuration = ms => {
        if (!ms && ms !== 0) return null;
        const n = ms;
        if (n < 1000) return `${n}ms`;
        const secs = n / 1000;
        const s = secs.toFixed(secs >= 10 ? 0 : 1);
        return `${s}s`;
      };
      const headerNote = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        var _a;
        if (!result) return undefined;
        if (result.rejected) return "Rejected";
        const exit = (_a = result.exitCodeV2) !== null && _a !== void 0 ? _a : result.exitCode;
        if (exit != null) {
          return `exit ${exit}`;
        }
        return undefined;
      }, [result]);
      const [startAtMs, setStartAtMs] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
      const [elapsedMs, setElapsedMs] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      const isRunning = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => !result, [result]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (isRunning) {
          if (startAtMs === null) setStartAtMs(Date.now());
        } else {
          if (startAtMs !== null) setStartAtMs(null);
          setElapsedMs(0);
        }
      }, [isRunning, startAtMs]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (startAtMs === null) return;
        const id = setInterval(() => {
          setElapsedMs(Date.now() - startAtMs);
        }, 100);
        return () => clearInterval(id);
      }, [startAtMs]);
      const outputContent = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (!result) return null;
        const stripAnsi = s => (0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_7__ /* .stripAnsi */.aJ)(s);
        const insertSoftWraps = s => s.replace(/(\S{80})(?=\S)/g, "$1\u200B");
        if (result.rejected) {
          return {
            text: "Request rejected",
            color: "yellow"
          };
        }
        const textRaw = result.outputRaw || result.output || "";
        return {
          text: insertSoftWraps(stripAnsi(textRaw)),
          color: undefined
        };
      }, [result]);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_tool_row_box_js__WEBPACK_IMPORTED_MODULE_6__ /* .ToolRowBox */.Y, {
        flexDirection: "column",
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "row",
          alignItems: "flex-start",
          paddingX: 1,
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
                children: cmd
              }), headerNote ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  children: " "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "gray",
                  children: headerNote
                })]
              }) : null, isRunning ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  children: " "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "gray",
                  children: (_a = formatDuration(elapsedMs)) !== null && _a !== void 0 ? _a : undefined
                })]
              }) : null, workingDirDisplay ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  children: " "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "gray",
                  children: ["in ", workingDirDisplay]
                })]
              }) : null]
            })
          })]
        }), result ? outputContent ? outputContent.color === "yellow" ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "yellow",
            wrap: "wrap",
            children: outputContent.text
          })
        }) : outputContent.text ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_5__ /* .HighlightedCode */.d, {
            content: outputContent.text,
            language: "plaintext",
            showLineNumbers: false,
            maxLines: expand ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .SHELL_OUTPUT_EXPANDED_MAX_LINES */.U5 : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .SHELL_OUTPUT_PREVIEW_LINES */.Ok,
            truncationHint: expand ? undefined : "ctrl+o to expand"
          }), expand ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              dimColor: true,
              children: "ctrl+o to collapse"
            })
          }) : null]
        }) : null : null : null]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/