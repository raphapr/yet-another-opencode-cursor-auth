__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */f: () => (/* binding */ShellToolUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../local-exec/dist/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/context/agent-state-context.tsx");
    /* harmony import */
    var _utils_characters_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/utils/characters.ts");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/components/highlighted-code.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_7__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const formatDuration = ms => {
      if (!ms && ms !== 0) return null;
      const n = ms;
      if (n < 1000) return `${n}ms`;
      const secs = n / 1000;
      const s = secs.toFixed(secs >= 10 ? 0 : 1);
      return `${s}s`;
    };
    const ShellToolUI = ({
      tool,
      expand,
      aborted,
      shellManager
    }) => {
      var _a, _b;
      const {
        pendingDecisions
      } = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_5__ /* .useAgentState */.C9)();
      const isCompact = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_5__ /* .useIsCompact */.tO)();
      const args = tool.args;
      const result = tool.result;
      const cmd = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ((args === null || args === void 0 ? void 0 : args.command) || "").trim(), [args === null || args === void 0 ? void 0 : args.command]);
      // Use the same expand logic as shell-turn-ui
      const shouldExpand = expand !== null && expand !== void 0 ? expand : !isCompact;
      const shellEmitter = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        if (!shellManager || !(args === null || args === void 0 ? void 0 : args.toolCallId)) {
          return null;
        }
        return shellManager.getOrCreateShellEmitter(args.toolCallId);
      }, [shellManager, args === null || args === void 0 ? void 0 : args.toolCallId]);
      const workingDirDisplay = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        const argWd = (args === null || args === void 0 ? void 0 : args.workingDirectory) || undefined;
        const r = result === null || result === void 0 ? void 0 : result.result;
        let wd = argWd;
        if (!wd && r) {
          switch (r.case) {
            case "success":
            case "failure":
            case "rejected":
              wd = r.value.workingDirectory || undefined;
              break;
            default:
              wd = undefined;
          }
        }
        if (!wd) return undefined;
        const rel = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_6__ /* .toRelativePath */.fw)(wd);
        const human = rel === "." ? "current dir" : rel;
        return (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_6__ /* .truncatePathMiddle */.tk)(human, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .MAX_DIRECTORY_DISPLAY_LENGTH */.DN);
      }, [args === null || args === void 0 ? void 0 : args.workingDirectory, result]);
      const isWaiting = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        return pendingDecisions.some(d => d.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_2__.OperationType.Shell && (d.operation.details.command || "").trim() === cmd);
      }, [pendingDecisions, cmd]);
      const isRunning = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => !(result === null || result === void 0 ? void 0 : result.result), [result]);
      // Optimistic shell result state
      const [optimisticResult, setOptimisticResult] = (0, react__WEBPACK_IMPORTED_MODULE_3__.useState)(undefined);
      const isSandboxed = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        // Recompute when optimisticResult changes so start events update the icon immediately
        return Boolean(shellEmitter === null || shellEmitter === void 0 ? void 0 : shellEmitter.getSandboxed());
      }, [shellEmitter]);
      const [startAtMs, setStartAtMs] = (0, react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);
      const [elapsedMs, setElapsedMs] = (0, react__WEBPACK_IMPORTED_MODULE_3__.useState)(0);
      // (moved optimisticResult state above for dependency ordering)
      // Subscribe to shell emitter for optimistic updates
      (0, react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
        if (!shellEmitter) {
          setOptimisticResult(undefined);
          return;
        }
        // Get initial state
        setOptimisticResult(shellEmitter.getCurrentState());
        // Listen for updates
        const handleShellChange = result => {
          setOptimisticResult(result);
        };
        shellEmitter.addListener(handleShellChange);
        return () => {
          shellEmitter.removeListener(handleShellChange);
        };
      }, [shellEmitter]);
      // Header note similar to edits: brief status info
      const headerNote = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        var _a, _b;
        if (aborted) return "Aborted";
        const r = result === null || result === void 0 ? void 0 : result.result;
        // Use optimistic exit code if available and command is still running
        if (!r && (optimisticResult === null || optimisticResult === void 0 ? void 0 : optimisticResult.exitCode) !== null && (optimisticResult === null || optimisticResult === void 0 ? void 0 : optimisticResult.exitCode) !== undefined) {
          const exit = optimisticResult.exitCode;
          return `exit ${exit}`;
        }
        if (!r) return undefined;
        switch (r.case) {
          case "success":
            return (_a = formatDuration(r.value.executionTime)) !== null && _a !== void 0 ? _a : undefined;
          case "failure":
            {
              const exit = (_b = r.value.exitCode) !== null && _b !== void 0 ? _b : 1;
              const sig = r.value.signal || "";
              const time = formatDuration(r.value.executionTime);
              const parts = [];
              parts.push(`exit ${exit}${sig ? ` (${sig})` : ""}`);
              if (time) parts.push(time);
              return parts.join(" • ");
            }
          case "rejected":
            return "Rejected";
          default:
            return undefined;
        }
      }, [aborted, result, optimisticResult]);
      // Manage the start timestamp so it reflects the moment execution actually begins
      (0, react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
        if (isRunning && !isWaiting) {
          if (startAtMs === null) {
            setStartAtMs(Date.now());
          }
        } else {
          if (startAtMs !== null) {
            setStartAtMs(null);
          }
          setElapsedMs(0);
        }
      }, [isRunning, isWaiting, startAtMs]);
      // Tick the elapsed timer only while we have a valid start timestamp
      (0, react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
        if (startAtMs === null) return;
        const id = setInterval(() => {
          setElapsedMs(Date.now() - startAtMs);
        }, 100);
        return () => clearInterval(id);
      }, [startAtMs]);
      const outputContent = (0, react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
        // If the tool execution was aborted, suppress body content entirely.
        if (aborted) return null;
        const stripAnsi = s => (0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_8__ /* .stripAnsi */.aJ)(s);
        const insertSoftWraps = s =>
        // Insert a zero-width space after long non-space runs to enable wrapping
        s.replace(/(\S{80})(?=\S)/g, "$1\u200B");
        const r = result === null || result === void 0 ? void 0 : result.result;
        // Use optimistic output if available and command is still running
        if (!r && (optimisticResult === null || optimisticResult === void 0 ? void 0 : optimisticResult.output)) {
          const combined = insertSoftWraps(stripAnsi(optimisticResult.output));
          if (!combined) return null;
          // Truncate output if it exceeds MAX_SHELL_OUTPUT_SIZE
          const outputSize = Buffer.byteLength(combined, "utf8");
          const isTruncated = outputSize > _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .MAX_SHELL_OUTPUT_SIZE */.qg;
          const displayOutput = isTruncated ? Buffer.from(combined, "utf8").subarray(0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .MAX_SHELL_OUTPUT_SIZE */.qg).toString("utf8") : combined;
          return {
            text: displayOutput,
            color: undefined,
            isTruncated,
            originalSize: outputSize
          };
        }
        if (!r) return null;
        switch (r.case) {
          case "success":
          case "failure":
            {
              // Always show both stdout and stderr if available
              const stdout = r.value.stdout || "";
              const stderr = r.value.stderr || "";
              const parts = [];
              if (stdout) parts.push(insertSoftWraps(stripAnsi(stdout)));
              if (stderr) parts.push(insertSoftWraps(stripAnsi(stderr)));
              const combined = parts.join("\n");
              if (!combined) return null;
              // Truncate output if it exceeds MAX_SHELL_OUTPUT_SIZE
              const outputSize = Buffer.byteLength(combined, "utf8");
              const isTruncated = outputSize > _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .MAX_SHELL_OUTPUT_SIZE */.qg;
              const displayOutput = isTruncated ? Buffer.from(combined, "utf8").subarray(0, _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .MAX_SHELL_OUTPUT_SIZE */.qg).toString("utf8") : combined;
              return {
                text: displayOutput,
                color: undefined,
                isTruncated,
                originalSize: outputSize
              };
            }
          case "rejected":
            {
              const reason = typeof r.value.reason === "string" ? r.value.reason.trim() : "";
              if (!reason) return null; // do not show second row if no reason
              return {
                text: reason,
                color: "yellow"
              };
            }
          default:
            return null;
        }
      }, [result, aborted, optimisticResult]);
      if (!args) return null;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "row",
          alignItems: "flex-start",
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            width: 2,
            flexShrink: 0,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              children: [isSandboxed ? "🔒 $" : "$", " "]
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
                  children: isWaiting ? "Waiting for approval..." : (_a = formatDuration(elapsedMs)) !== null && _a !== void 0 ? _a : undefined
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
        }), outputContent !== null ? outputContent.color === "yellow" ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingX: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "yellow",
            wrap: "wrap",
            children: outputContent.text
          })
        }) : outputContent.text ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          paddingLeft: 2,
          flexDirection: "column",
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_7__ /* .HighlightedCode */.d, {
            content: outputContent.text,
            language: "plaintext",
            showLineNumbers: false,
            maxLines: shouldExpand ? _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .SHELL_OUTPUT_EXPANDED_MAX_LINES */.U5 : _constants_js__WEBPACK_IMPORTED_MODULE_4__ /* .SHELL_OUTPUT_PREVIEW_LINES */.Ok,
            truncationHint: shouldExpand ? undefined : "ctrl+o to expand",
            dimmed: true
          }), outputContent.isTruncated && shouldExpand ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "yellow",
              dimColor: true,
              children: ["Output truncated at 1MiB limit (", Math.round(((_b = outputContent.originalSize) !== null && _b !== void 0 ? _b : 0) / 1024), " KB total)"]
            })
          }) : null, shouldExpand ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              dimColor: true,
              children: "ctrl+o to collapse"
            })
          }) : null]
        }) : null : null]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/