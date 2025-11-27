__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */q: () => (/* binding */PromptBar)
      /* harmony export */
    });
    /* unused harmony export buildDecisionOptions */
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs");
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */
    var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../agent-kv/dist/index.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../local-exec/dist/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _analytics_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/analytics.ts");
    /* harmony import */
    var _console_io_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("./src/console-io.ts");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/context/agent-state-context.tsx");
    /* harmony import */
    var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/context/vim-mode-context.tsx");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _ephemeral_bridge_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/ephemeral-bridge.ts");
    /* harmony import */
    var _hooks_prompt_use_at_palette_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/hooks/prompt/use-at-palette.ts");
    /* harmony import */
    var _hooks_prompt_use_ephemeral_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/hooks/prompt/use-ephemeral.ts");
    /* harmony import */
    var _hooks_prompt_use_prompt_history_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/hooks/prompt/use-prompt-history.ts");
    /* harmony import */
    var _hooks_prompt_use_slash_palette_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/hooks/prompt/use-slash-palette.ts");
    /* harmony import */
    var _utils_clipboard_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/utils/clipboard.ts");
    /* harmony import */
    var _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("./src/utils/cursor-navigation.ts");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./src/components/prompt/decision-dropdown.tsx");
    /* harmony import */
    var _prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./src/components/prompt/ephemeral-lines-view.tsx");
    /* harmony import */
    var _prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./src/components/prompt/palette-at-list.tsx");
    /* harmony import */
    var _prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("./src/components/prompt/palette-slash-list.tsx");
    /* harmony import */
    var _prompt_pending_decisions_banner_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("./src/components/prompt/pending-decisions-banner.tsx");
    /* harmony import */
    var _prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("./src/components/prompt/prompt-footer.tsx");
    /* harmony import */
    var _text_input_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("./src/components/text-input.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_19__, _prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_20__, _prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_21__, _prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_22__, _prompt_pending_decisions_banner_js__WEBPACK_IMPORTED_MODULE_23__, _prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_24__, _text_input_js__WEBPACK_IMPORTED_MODULE_25__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_19__, _prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_20__, _prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_21__, _prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_22__, _prompt_pending_decisions_banner_js__WEBPACK_IMPORTED_MODULE_23__, _prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_24__, _text_input_js__WEBPACK_IMPORTED_MODULE_25__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    /** biome-ignore-all lint/suspicious/noControlCharactersInRegex: we don't care about control characters in regex */

    const TAB_DEBOUNCE_MS = 200;
    const maybeAddAllowlistAction = (options, kind, decision) => {
      var _a, _b, _c;
      const details = (_b = (_a = decision === null || decision === void 0 ? void 0 : decision.operation) === null || _a === void 0 ? void 0 : _a.details) !== null && _b !== void 0 ? _b : {};
      const notAllowed = (_c = details.notAllowedCommands) !== null && _c !== void 0 ? _c : [];
      if (details.canAllowlist !== false && notAllowed.length > 0) {
        const label = `Add ${notAllowed.map(p => `${kind}(${p})`).join(", ")} to allowlist?`;
        options.push({
          label,
          hint: "(tab)",
          action: "allowlistApprove"
        });
      }
    };
    const buildDecisionOptions = decision => {
      var _a, _b;
      const options = [];
      switch ((_a = decision === null || decision === void 0 ? void 0 : decision.operation) === null || _a === void 0 ? void 0 : _a.type) {
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Shell:
          {
            const operation = decision.operation;
            if (operation.details.isSandboxAvailable) {
              options.push({
                label: "Run outside sandbox (once)",
                hint: "(y)",
                action: "approve"
              });
            } else {
              options.push({
                label: "Run (once)",
                hint: "(y)",
                action: "approve"
              });
            }
            maybeAddAllowlistAction(options, "Shell", decision);
            options.push({
              label: "Turn on auto-run",
              hint: "(shift+tab)",
              action: "autoRunApprove"
            });
            options.push({
              label: "Skip",
              hint: "(esc or n)",
              action: "propose"
            });
            break;
          }
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Mcp:
          options.push({
            label: "Run (once)",
            hint: "(y)",
            action: "approve"
          });
          options.push({
            label: "Turn on auto-run",
            hint: "(shift+tab)",
            action: "autoRunApprove"
          });
          options.push({
            label: "Skip",
            hint: "(esc or p)",
            action: "reject"
          });
          break;
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Delete:
          options.push({
            label: "Delete",
            hint: "(y)",
            action: "approve"
          });
          options.push({
            label: "Keep",
            hint: "(n)",
            action: "reject"
          });
          break;
        case _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Write:
          {
            const details = (_b = decision === null || decision === void 0 ? void 0 : decision.operation) === null || _b === void 0 ? void 0 : _b.details;
            const pathStr = typeof (details === null || details === void 0 ? void 0 : details.path) === "string" ? details.path : undefined;
            options.push({
              label: "Proceed",
              hint: "(y)",
              action: "approve"
            });
            options.push({
              label: "Reject & propose changes",
              hint: "(esc or n or p)",
              action: "propose"
            });
            if (typeof pathStr === "string" && pathStr.length > 0) {
              options.push({
                label: `Add Write(${(0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_18__ /* .truncatePathMiddle */.tk)(pathStr, 30)}) to allowlist?`,
                hint: "(tab)",
                action: "allowlistApprove"
              });
            } else {
              options.push({
                label: "Add to allowlist",
                hint: "(tab)",
                action: "allowlistApprove"
              });
            }
            options.push({
              label: "Turn on auto-run",
              hint: "(shift+tab)",
              action: "autoRunApprove"
            });
            break;
          }
      }
      return options;
    };
    const titleForOperation = {
      [_anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Shell]: "Run this command?",
      [_anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Mcp]: "Run this MCP tool?",
      [_anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Delete]: "Delete this file?",
      [_anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Write]: "Write to this file?"
    };
    const PromptInput = react__WEBPACK_IMPORTED_MODULE_6__.memo(function PromptInput({
      prompt,
      setPrompt,
      placeholder,
      rightPlaceholder,
      isDisabled,
      onSubmit,
      onTab,
      onShiftTab,
      onCtrlC,
      onCtrlD,
      onCtrlR,
      cursorToEndSignal,
      onCursorInfoChange,
      onDownAtLastLine,
      onUpAtFirstLine,
      onPaste,
      focus = true,
      visualFocus = false,
      allowExplicitNewline
    }) {
      // Not needed inside TextInput wrapper
      if (isDisabled) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text_input_js__WEBPACK_IMPORTED_MODULE_25__ /* ["default"] */.A, {
            value: prompt,
            onChange: () => {},
            onSubmit: () => {},
            placeholder: placeholder,
            rightPlaceholder: rightPlaceholder,
            onTab: () => {},
            onShiftTab: () => {},
            onCtrlC: () => {},
            onCtrlD: () => {},
            onCtrlR: () => {},
            showCursor: false,
            visualFocus: false,
            focus: false,
            cursorToEndSignal: cursorToEndSignal,
            onCursorInfoChange: () => {},
            onUpAtFirstLine: () => {},
            onDownAtLastLine: () => {},
            allowExplicitNewline: false,
            dimmed: true
          })
        });
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text_input_js__WEBPACK_IMPORTED_MODULE_25__ /* ["default"] */.A, {
          value: prompt,
          onChange: setPrompt,
          onSubmit: onSubmit,
          placeholder: placeholder,
          rightPlaceholder: rightPlaceholder,
          onTab: onTab,
          onShiftTab: onShiftTab,
          onCtrlC: onCtrlC,
          onCtrlD: onCtrlD,
          onCtrlR: onCtrlR,
          showCursor: true,
          visualFocus: visualFocus,
          cursorToEndSignal: cursorToEndSignal,
          onCursorInfoChange: onCursorInfoChange,
          onUpAtFirstLine: onUpAtFirstLine,
          onDownAtLastLine: onDownAtLastLine,
          focus: focus,
          onPaste: onPaste,
          allowExplicitNewline: allowExplicitNewline
        })
      });
    });
    // When a user pastes a large block (>800 chars), we insert a compact placeholder
    // like `[Pasted text #3 +42 lines]` instead of the full content. On submit, these
    // placeholders are expanded back into the original text via the regex below.
    // Keep the label and regex in sync if you change the format.
    const PASTED_TEXT_LABEL = "Pasted text";
    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const LARGE_PASTE_PLACEHOLDER_RE = new RegExp(`\\[${escapeRegExp(PASTED_TEXT_LABEL)} #(\\d+)(?: \\+\\d+(?: lines)?)?\\]`, "g");
    const countLines = s => {
      var _a, _b;
      return ((_b = (_a = s.match(/\n/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + 1;
    };
    const buildLargePastePlaceholder = (id, content) => `[${PASTED_TEXT_LABEL} #${id} +${countLines(content)} lines]`;
    const PromptBar = ({
      value,
      onChange,
      onSubmit,
      onSubmitShell,
      topStatus,
      topStatusMarginTop,
      inputMode = "message",
      isDisabled = false,
      isProcessing = false,
      isSendingToBackground = false,
      onCtrlC,
      borderColorFocused,
      borderColorBlurred,
      promptSymbol = "→",
      isEmptyChat = false,
      onRequestReview,
      onNoReviewAvailable,
      slashCommands,
      onBeginRejection,
      onResumeChat,
      getChatId,
      onSkipRejectionReason,
      onCancelRejectionReason,
      onAddToAllowList,
      onImagesUpdated,
      onLogout,
      onNewChat,
      onSummarize,
      rgPath,
      disableModeSwitch = false,
      isRepository = true,
      externalCursorToEndSignal,
      isSuggestingPlan = false,
      onExecutePlan,
      onRejectPlan,
      onDiscardPlan,
      planDecisionIndex = 0,
      onPlanDecisionIndexChange: setPlanDecisionIndex
    }) => {
      const {
        currentModel,
        mode,
        pendingDecisions,
        setCurrentModel,
        changedFiles,
        rejectPendingDecision,
        approvePendingDecision,
        agentStore,
        modelManager,
        queuedMessage,
        setQueuedMessage,
        setIsCompact,
        conversationTokenPercent
      } = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_9__ /* .useAgentState */.C9)();
      const {
        mode: vimMode,
        vimEnabled
      } = (0, _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_10__ /* .useVimMode */.v)();
      // Background/foreground run modes removed
      const {
        isFocused
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .useFocus */.iQ)({
        autoFocus: true
      });
      const {
        exit
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .useApp */.nm)();
      const [exitMode, setExitMode] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
      const [quitting, setQuitting] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
      const [shouldRender, setShouldRender] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(true);
      // Ephemeral bash mode triggered by leading '!'
      const [bashModeActive, setBashModeActive] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
      const cachedMessageRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
      const wasInDecisionRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(false);
      (0, react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        if (!exitMode) return;
        const t = setTimeout(() => setExitMode(false), 1500);
        return () => clearTimeout(t);
      }, [exitMode]);
      const handleExit = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)((isLogout = false) => {
        setShouldRender(false);
        setTimeout(() => {
          (() => __awaiter(void 0, void 0, void 0, function* () {
            const chatId = agentStore.getId();
            const rootBlobId = agentStore.getMetadata("latestRootBlobId");
            yield agentStore.dispose();
            if (chatId && rootBlobId.length > 0) {
              if (isLogout) {
                (0, _console_io_js__WEBPACK_IMPORTED_MODULE_26__ /* .intentionallyWriteToStderr */.p2)("\n  \x1b[32m✓ Logout successful\x1b[0m");
                (0, _console_io_js__WEBPACK_IMPORTED_MODULE_26__ /* .intentionallyWriteToStderr */.p2)("\n  \x1b[90mAuthentication tokens removed.\x1b[0m");
              }
              (0, _console_io_js__WEBPACK_IMPORTED_MODULE_26__ /* .intentionallyWriteToStderr */.p2)(`\n  \x1b[90mTo resume this session:\x1b[0m \x1b[1m\x1b[36mcursor-agent --resume=${chatId}\x1b[0m`);
            }
            // clean exit
            exit();
            process.exit(0);
          }))();
        }, 100);
      }, [agentStore, exit]);
      const [cursorToEndSignal, setCursorToEndSignal] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(0);
      const [_cursorAtLastLine, setCursorAtLastLine] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(true);
      const [cursorOffset, setCursorOffset] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(0);
      const suppressNextReviewRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(false);
      const ephemeral = (0, _hooks_prompt_use_ephemeral_js__WEBPACK_IMPORTED_MODULE_14__ /* .useEphemeral */.N)();
      const history = (0, _hooks_prompt_use_prompt_history_js__WEBPACK_IMPORTED_MODULE_15__ /* .usePromptHistory */.a)();
      const lastChangeTimeRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(0);
      const lastValueRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(value);
      const ephemeralLinesCountRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(0);
      (0, react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        const handler = lines => {
          ephemeral.set(lines);
        };
        (0, _ephemeral_bridge_js__WEBPACK_IMPORTED_MODULE_12__ /* .setEphemeralListener */.al)(handler);
        return () => (0, _ephemeral_bridge_js__WEBPACK_IMPORTED_MODULE_12__ /* .setEphemeralListener */.al)(null);
      }, [ephemeral]);
      (0, react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        ephemeralLinesCountRef.current = ephemeral.lines.length;
      }, [ephemeral.lines.length]);
      const ensureTrailingSpace = s => s.length > 0 && !s.endsWith(" ") ? `${s} ` : s;
      let paletteMode = "none";
      const beginHistoryIfNeeded = () => {
        const next = history.begin(value);
        if (next == null) return false;
        const withSpace = ensureTrailingSpace(next);
        ephemeral.preserveNextClear();
        handleProgrammaticChange(withSpace);
        setCursorToEndSignal(s => s + 1);
        return true;
      };
      const handleHistoryUp = () => {
        if (paletteMode !== "none") return;
        if (queuedMessage) {
          const merged = value.length > 0 ? `${queuedMessage}\n${value}` : queuedMessage;
          setQueuedMessage("");
          handleProgrammaticChange(merged);
          setCursorToEndSignal(s => s + 1);
          return;
        }
        if (beginHistoryIfNeeded()) return;
        const next = history.up();
        if (next != null) {
          const withSpace = ensureTrailingSpace(next);
          ephemeral.preserveNextClear();
          handleProgrammaticChange(withSpace);
          setCursorToEndSignal(s => s + 1);
        }
      };
      const handleHistoryDown = () => {
        if (paletteMode !== "none") return;
        const res = history.down(value);
        if (!res) return;
        const withSpace = ensureTrailingSpace(res.value);
        ephemeral.preserveNextClear();
        handleProgrammaticChange(withSpace);
        setCursorToEndSignal(s => s + 1);
        if (res.exited) suppressNextReviewRef.current = true;
      };
      const handleDownAction = () => {
        if (paletteMode !== "none") return;
        if (history.inHistory) {
          handleHistoryDown();
          return;
        }
      };
      const maybeRequestReview = () => {
        const hasChanges = changedFiles.length > 0;
        if (hasChanges) onRequestReview === null || onRequestReview === void 0 ? void 0 : onRequestReview();else {
          // Do not show any ephemeral message; silently ignore and notify via callback
          onNoReviewAvailable === null || onNoReviewAvailable === void 0 ? void 0 : onNoReviewAvailable();
        }
      };
      const handleCtrlR = () => {
        // Allow ctrl+r anywhere to request review (Message/Decision modes)
        if (_constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .REVIEW_MODE_ENABLED */.hD) {
          maybeRequestReview();
        }
      };
      const at = (0, _hooks_prompt_use_at_palette_js__WEBPACK_IMPORTED_MODULE_13__ /* .useAtPalette */.g)(value, {
        rgPath
      });
      const syncImageRefsWithValueRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(() => {});
      const replaceImagePathsWithTokensRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(input => input);
      const convertAtImageMentionsInChangedSpanRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)((_prev, next) => next);
      const applyPromptChange = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(next => {
        if (ephemeralLinesCountRef.current > 0 && !next.startsWith("/") && next.trim().length > 0) {
          ephemeral.clear();
        }
        onChange(next);
        syncImageRefsWithValueRef.current(next);
      }, [ephemeral.clear, onChange]);
      // Only convert image-like paths to @image-N when the change originated from a paste/drag event.
      const pendingPasteReplacementRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(false);
      const handleUserChange = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(next => {
        // Enter bash mode when typing '!' as the very first input
        if (!value && next === "!") {
          setBashModeActive(true);
          // Do not insert the '!'; switch prompt symbol instead
          applyPromptChange("");
          setCursorToEndSignal(s => s + 1);
          return;
        }
        // Filter control characters like Unit Separator (\x1F) that some terminals send for Ctrl-/
        if (next.includes("\x1f")) {
          next = next.replace(/\x1f/g, "");
        }
        const now = Date.now();
        const prevVal = lastValueRef.current;
        // Only replace on explicit paste/drag signal captured by onPaste.
        const wantsAggressiveReplace = pendingPasteReplacementRef.current;
        // Compute caret-sensitive changed span between prev and next (indices in next)
        const computeChangedSpan = (a, b) => {
          if (a === b) return null;
          let i = 0;
          const minLen = Math.min(a.length, b.length);
          while (i < minLen && a[i] === b[i]) i++;
          let ai = a.length - 1;
          let bi = b.length - 1;
          while (ai >= i && bi >= i && a[ai] === b[bi]) {
            ai--;
            bi--;
          }
          const start = i;
          const end = bi + 1;
          if (start > end) return null;
          return {
            start,
            end
          };
        };
        const changedSpan = computeChangedSpan(prevVal, next);
        const shouldReplace = wantsAggressiveReplace && changedSpan != null;
        const produced = shouldReplace ? replaceImagePathsWithTokensRef.current(next, changedSpan !== null && changedSpan !== void 0 ? changedSpan : undefined) : next;
        applyPromptChange(produced);
        // Reset the paste flag after the first change post-paste so we never
        // convert proactively during normal typing.
        if (wantsAggressiveReplace) pendingPasteReplacementRef.current = false;
        lastChangeTimeRef.current = now;
        lastValueRef.current = produced;
        if (history.inHistory) {
          history.down(next); // will exit on next if at -1; noop here
        }
        suppressNextReviewRef.current = false;
      }, [applyPromptChange, history, value]);
      const handleProgrammaticChange = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(next => {
        applyPromptChange(next);
      }, [applyPromptChange]);
      const handleResumeChat = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(folder => __awaiter(void 0, void 0, void 0, function* () {
        if (onResumeChat) yield onResumeChat(folder);else ephemeral.set([[{
          text: `Resuming chat ${folder}...`,
          color: "cyan"
        }]]);
      }), [onResumeChat, ephemeral]);
      const slashHelpers = (0, react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => ({
        onModelChange: setCurrentModel,
        insertText: txt => handleProgrammaticChange(txt),
        print: (lines, options) => {
          ephemeral.set(lines, options);
        },
        onHistoryCleared: () => history.clearAllLocal(),
        exit: isLogout => handleExit(isLogout),
        onResumeChat: handleResumeChat,
        getChatId,
        logout: onLogout,
        onNewChat,
        onSummarize
      }), [setCurrentModel, handleProgrammaticChange, ephemeral, history, handleExit, handleResumeChat, getChatId, onLogout, onNewChat, onSummarize]);
      const slash = (0, _hooks_prompt_use_slash_palette_js__WEBPACK_IMPORTED_MODULE_16__ /* .useSlashPalette */.e)(value, slashCommands, slashHelpers);
      const getPlaceholder = () => {
        var _a;
        switch (inputMode) {
          case "decision":
            return "Waiting for decision (y/n/p)...";
          case "rejection-reason":
            return "Reason for rejection: Enter to submit, Ctrl+C to skip";
          case "plan-revision":
            return "Describe how to revise the plan (Enter to submit)";
          default:
            {
              if (bashModeActive) {
                const columns = typeof ((_a = process.stdout) === null || _a === void 0 ? void 0 : _a.columns) === "number" ? process.stdout.columns : 80;
                const example = isRepository ? "git status" : false ? 0 : "ls";
                if (columns >= 50) return `Run a command — e.g., ${example}`;
                return "Run a command";
              }
              return isEmptyChat ? "Plan, search, build anything" : "Add a follow-up";
            }
        }
      };
      const effectiveBorderColor = (() => {
        var _a;
        // Gray border only after quit is actually triggered (via state we set when executing /quit) or Ctrl+C exit confirmation, not merely typing /quit.
        if (exitMode || quitting) {
          return "gray";
        }
        // Bash mode uses a gold/yellow border
        if (bashModeActive) {
          return "yellow";
        }
        if (borderColorFocused || borderColorBlurred) {
          return (_a = borderColorFocused !== null && borderColorFocused !== void 0 ? borderColorFocused : borderColorBlurred) !== null && _a !== void 0 ? _a : "foreground";
        }
        switch (inputMode) {
          case "decision":
            return "yellow";
          case "rejection-reason":
            return "red";
          case "plan-revision":
            return "cyan";
          default:
            return "foreground";
        }
      })();
      const buildSlashEnv = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(() => ({
        onModelChange: setCurrentModel,
        insertText: txt => {
          if (txt === "") ephemeral.preserveNextClear();
          handleProgrammaticChange(txt);
        },
        enterShellMode: () => {
          setBashModeActive(true);
          // Ensure input is empty and caret ready
          handleProgrammaticChange("");
          setCursorToEndSignal(s => s + 1);
        },
        clearInput: () => {
          ephemeral.preserveNextClear();
          handleProgrammaticChange("");
        },
        print: (lines, options) => ephemeral.set(lines, options),
        exit: isLogout => handleExit(isLogout),
        onHistoryCleared: () => history.clearAllLocal(),
        onResumeChat: handleResumeChat,
        getChatId,
        logout: onLogout,
        onNewChat,
        onSummarize,
        submitMessage: (message, meta) => {
          // Clear the input and submit the message
          handleProgrammaticChange("");
          onSubmit(message, meta);
        }
      }), [handleProgrammaticChange, handleExit, handleResumeChat, onSubmit, ephemeral, history, setCurrentModel, onLogout, onNewChat, onSummarize, getChatId]);
      const handleUnknownCmd = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(unknown => {
        setTimeout(() => {
          ephemeral.set([`Unknown command: /${unknown}`, "Type / and start typing to see suggestions."]);
        }, 0);
      }, [ephemeral]);
      const parseSlashInput = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(input => {
        if (!input.startsWith("/")) return null;
        const term = input.slice(1);
        const parts = term.split(/\s+/).filter(Boolean);
        const cmdId = parts[0] || "";
        const args = parts.slice(1);
        const cmd = slashCommands.find(c => c.id.toLowerCase() === cmdId.toLowerCase());
        const required = ((cmd === null || cmd === void 0 ? void 0 : cmd.args) || []).filter(a => a.required !== false).length;
        return {
          cmdId,
          args,
          required,
          hasCmd: !!cmd
        };
      }, [slashCommands]);
      const isSlashReady = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(input => {
        const parsed = parseSlashInput(input);
        return Boolean((parsed === null || parsed === void 0 ? void 0 : parsed.hasCmd) && parsed.args.length >= parsed.required);
      }, [parseSlashInput]);
      const runSlashInput = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(input => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield slash.runIfExecutable(input, slashCommands, buildSlashEnv(), q => setQuitting(q), handleUnknownCmd);
        if (result === "unknown") {
          return true;
        }
        return result !== "not-a-command";
      }), [slash, slashCommands, buildSlashEnv, handleUnknownCmd]);
      const handleSubmit = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(inputValue => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // In Shell Mode, ignore empty submits (do nothing)
        if (bashModeActive && inputValue.trim().length === 0) {
          return;
        }
        const expandLargePastedPlaceholders = text => {
          if (largePastedTextRef.current.size === 0) return text;
          return text.replace(LARGE_PASTE_PLACEHOLDER_RE, (match, idStr) => {
            const id = Number(idStr);
            const replacement = largePastedTextRef.current.get(id);
            return replacement != null ? replacement : match;
          });
        };
        // AT palette acceptance
        if (at.active) {
          const expanded = at.acceptExpansion(inputValue);
          if (expanded != null) {
            const converted = convertAtImageMentionsInChangedSpanRef.current(inputValue, expanded);
            handleProgrammaticChange(converted);
            setCursorToEndSignal(s => s + 1);
            return;
          }
        }
        // Slash palette: try accepting current selection first (works for leading and inline)
        if (slash.active) {
          const expanded = slash.acceptExpansion(inputValue);
          if (expanded != null && expanded !== inputValue) {
            handleProgrammaticChange(expanded);
            setCursorToEndSignal(s => s + 1);
            return;
          }
        }
        // Slash palette expansion or execution (leading '/...')
        if (inputValue.startsWith("/")) {
          if (slash.active) {
            // already attempted generic accept above
          }
          if (isSlashReady(inputValue)) {
            const parsed = parseSlashInput(inputValue);
            const deferHelp = parsed && parsed.cmdId.toLowerCase() === "help" && parsed.args.length === 0;
            if (!deferHelp) {
              // If the selection is visible and exactly matches the last token, prefer filling over immediate run.
              const selectionMatches = slash.active && ((_a = slash.items[slash.index]) === null || _a === void 0 ? void 0 : _a.identifier) && inputValue.trimEnd().endsWith(slash.items[slash.index].identifier);
              if (!selectionMatches) {
                if (yield runSlashInput(inputValue)) return;
              }
            }
          }
          {
            const parsed = parseSlashInput(inputValue);
            const deferHelp = parsed && parsed.cmdId.toLowerCase() === "help" && parsed.args.length === 0;
            if (!deferHelp) {
              if (yield runSlashInput(inputValue)) return;
            }
            if ((parsed === null || parsed === void 0 ? void 0 : parsed.hasCmd) && parsed.cmdId.toLowerCase() === "help" && parsed.args.length === 0 && !inputValue.endsWith(" ")) {
              handleProgrammaticChange(`${inputValue} `);
              setCursorToEndSignal(s => s + 1);
              return;
            }
          }
          // If '/unknown', keep the text so user can edit after seeing ephemeral
          // For partial '/cmd' without required args, insert a trailing space to guide typing
          const parsed = parseSlashInput(inputValue);
          if ((parsed === null || parsed === void 0 ? void 0 : parsed.hasCmd) && parsed.args.length < parsed.required && !inputValue.endsWith(" ")) {
            handleProgrammaticChange(`${inputValue} `);
            setCursorToEndSignal(s => s + 1);
            return;
          }
        }
        // Inline trailing '/cmd' handling, e.g., "hello world /shell"
        {
          const inlineMatch = /^(.*?)(\s+)\/(\S.*)$/.exec(inputValue);
          if (inlineMatch) {
            // Try to execute inline command
            const result = yield runSlashInput(inputValue);
            if (result) return;
          }
        }
        // Check for quit/exit as regular input (not just slash commands)
        const trimmedInput = inputValue.trim();
        if (trimmedInput === "quit" || trimmedInput === "exit") {
          handleExit(false);
          return;
        }
        const finalValue = expandLargePastedPlaceholders(inputValue);
        // Don't record plan revision in history
        if (inputMode !== "plan-revision") {
          yield history.record(finalValue);
        }
        let clearedEarly = false;
        if (bashModeActive) {
          if (!onSubmitShell) {
            // Shell mode active but no handler available – do not submit as a message.
            // Inform the user and keep shell mode/input intact.
            ephemeral.set(["Shell mode isn't available in this context.", "Press Esc to exit shell mode or submit a normal message."]);
            return;
          }
          // Clear input immediately on bash submit and exit bash mode
          setBashModeActive(false);
          handleProgrammaticChange("");
          setCursorToEndSignal(s => s + 1);
          clearedEarly = true;
          yield onSubmitShell(finalValue);
        } else {
          // Non-shell submissions: delegate clearing to the parent handler to avoid double-clear
          onSubmit(finalValue, {
            display: inputValue
          });
        }
        ephemeral.clear();
        // Defer palette/ephemeral cleanup
        setTimeout(() => {
          at.hide();
          slash.hide();
          // Clear image references only if we cleared input locally (shell path)
          if (clearedEarly && imageTokenMapRef.current.size > 0) {
            imageTokenMapRef.current.clear();
            tokenOrderRef.current = [];
            onImagesUpdated === null || onImagesUpdated === void 0 ? void 0 : onImagesUpdated([]);
          }
        }, 0);
        // For non-shell submissions, do not clear here (parent decides when to clear).
      }), [at, slash, ephemeral, onImagesUpdated, history, onSubmit, onSubmitShell, bashModeActive, handleExit, handleProgrammaticChange, inputMode, isSlashReady, parseSlashInput, runSlashInput]);
      const handleSubmitVoid = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(inputValue => {
        void handleSubmit(inputValue);
      }, [handleSubmit]);
      // Debounce window to avoid double-accept during rapid Tab auto-repeat
      // when an expansion just applied
      const lastTabAcceptTs = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(0);
      const onTab = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(() => {
        const now = Date.now();
        // Palette acceptance takes precedence over mode toggle
        if (paletteMode === "at" && at.active) {
          // Drop extremely rapid repeated Tabs within 200ms of a previous accept
          // If we drop below this debounce threshold we can see weird behavior
          // with accepting @-mention suggestions.
          if (now - lastTabAcceptTs.current < TAB_DEBOUNCE_MS) {
            return;
          }
          const rebuilt = at.acceptExpansion(value);
          if (rebuilt != null) {
            const converted = convertAtImageMentionsInChangedSpanRef.current(value, rebuilt);
            handleProgrammaticChange(converted);
            setCursorToEndSignal(s => s + 1);
            lastTabAcceptTs.current = Date.now();
            return;
          }
        }
        if (paletteMode === "slash" && slash.active) {
          if (now - lastTabAcceptTs.current < TAB_DEBOUNCE_MS) {
            return;
          }
          const rebuilt = slash.acceptExpansion(value);
          if (rebuilt != null) {
            handleProgrammaticChange(rebuilt);
            setCursorToEndSignal(s => s + 1);
            lastTabAcceptTs.current = Date.now();
            return;
          }
        }
        // Fallbacks for '/': if lone '/', accept top suggestion; if '/cmd' and args pending, insert space
        if (value === "/" && slash.active && slash.items.length > 0) {
          const rebuilt = slash.acceptExpansion(value);
          if (rebuilt != null) {
            handleProgrammaticChange(rebuilt);
            setCursorToEndSignal(s => s + 1);
            return;
          }
        }
        if (value.startsWith("/") && !value.endsWith(" ") && !isSlashReady(value)) {
          handleProgrammaticChange(`${value} `);
          setCursorToEndSignal(s => s + 1);
          return;
        }
        // No-op: background toggle removed
      }, [at, value, slash, handleProgrammaticChange, isSlashReady, paletteMode]);
      const handleCtrlC = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(() => {
        if (exitMode) {
          // Clear the input so we do not leave a partially typed command on screen, but retain exitMode so border stays gray.
          handleProgrammaticChange("");
          onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC();
          handleExit();
          return;
        }
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("handleCtrlC", inputMode);
        // Decision mode Ctrl+C is handled exclusively in the decision-mode useInput below
        if (inputMode === "decision") return;
        // In plan decision/revision modes, return to normal message input
        if (inputMode === "plan-revision") {
          // Switch back to message mode and clear transient UI state
          onDiscardPlan === null || onDiscardPlan === void 0 ? void 0 : onDiscardPlan();
          onChange("");
          at.hide();
          slash.hide();
          history.reset();
          return;
        }
        // In plan suggestion mode, Ctrl+C rejects the plan and returns to normal input
        if (isSuggestingPlan) {
          onChange("");
          onRejectPlan === null || onRejectPlan === void 0 ? void 0 : onRejectPlan();
          // Abort the stream when rejecting
          onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC();
          return;
        }
        // If Shell Mode is active, exit Shell Mode instead of triggering exit flow
        if (bashModeActive) {
          setBashModeActive(false);
          // Clear any input and related UI state
          handleProgrammaticChange("");
          at.hide();
          slash.hide();
          history.reset();
          return;
        }
        // In rejection reason mode, Ctrl+C should skip providing a reason (no exit)
        if (inputMode === "rejection-reason") {
          onSkipRejectionReason === null || onSkipRejectionReason === void 0 ? void 0 : onSkipRejectionReason();
          onChange("");
          // Ensure any palette/history state is reset when clearing
          at.hide();
          slash.hide();
          history.reset();
          return;
        }
        // Clear input first if there's any text; do not abort yet
        if (value.length > 0) {
          ephemeral.preserveNextClear();
          handleProgrammaticChange("");
          // Also reset related UI state immediately
          at.hide();
          slash.hide();
          history.reset();
          // Set exit mode so the footer shows "Press Ctrl+C again to exit"
          setExitMode(true);
          (0, _analytics_js__WEBPACK_IMPORTED_MODULE_7__ /* .trackCancelAndFlush */.B5)();
          return;
        }
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("handleCtrlC isProcessing", isProcessing);
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("handleCtrlC exitMode", exitMode);
        // If we're processing (generating), abort the run
        if (isProcessing) {
          onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC();
          setExitMode(true);
          (0, _analytics_js__WEBPACK_IMPORTED_MODULE_7__ /* .trackCancelAndFlush */.B5)();
          return;
        }
        // If we reach here, prompt is empty and we're not processing or in special modes
        // Exit immediately instead of requiring a second Ctrl-C
        handleExit();
      }, [inputMode, isSuggestingPlan, bashModeActive, value.length, isProcessing, exitMode, onDiscardPlan, onRejectPlan, onChange, at, slash, history, onCtrlC, handleProgrammaticChange, onSkipRejectionReason, ephemeral, handleExit]);
      const handleCtrlD = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(() => {
        // Immediate quit, regardless of state
        // Clear any input and exit cleanly
        handleProgrammaticChange("");
        onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC(); // propagate any cancellation hooks (e.g., stop processing)
        handleExit();
      }, [handleExit, handleProgrammaticChange, onCtrlC]);
      paletteMode = at.active ? "at" : slash.active ? "slash" : "none";
      // When input is cleared, ensure palettes are not intercepting navigation
      (0, react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        if (value.length === 0) {
          at.hide();
          slash.hide();
          history.reset();
        }
      }, [value, at, slash, history]);
      const isPaletteTriggering = slash.active || _hooks_prompt_use_at_palette_js__WEBPACK_IMPORTED_MODULE_13__ /* .AT_REGEX */.q.test(value) && at.active;
      const _canEnterReviewOnDown = inputMode === "message" && paletteMode === "none" && !isPaletteTriggering;
      const inDecision = inputMode === "decision" && pendingDecisions.length > 0;
      const [decisionIndex, setDecisionIndex] = (0, react__WEBPACK_IMPORTED_MODULE_6__.useState)(0);
      (0, react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        if (inDecision && !wasInDecisionRef.current) {
          if (cachedMessageRef.current == null && value.length > 0) {
            cachedMessageRef.current = value;
            onChange("");
          }
        }
        if (!inDecision && wasInDecisionRef.current) {
          if (inputMode === "message" && value.length === 0 && cachedMessageRef.current != null) {
            onChange(cachedMessageRef.current);
            cachedMessageRef.current = null;
          }
        }
        wasInDecisionRef.current = inDecision;
      }, [inDecision, inputMode, value, onChange]);
      (0, react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        if (inputMode === "message" && !inDecision && value.length === 0 && cachedMessageRef.current != null) {
          onChange(cachedMessageRef.current);
          cachedMessageRef.current = null;
        }
      }, [inputMode, inDecision, value, onChange]);
      // --- Image paste / drag-and-drop handling ---
      const imageTokenMapRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(new Map()); // path -> token
      const tokenOrderRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)([]); // preserve order for stable numbering
      const _imageGlobalCounterRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(0); // global counter for stable, session-unique tokens
      // Local store for large pasted text blocks
      const largePastedTextRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(new Map());
      const nextLargePasteIdRef = (0, react__WEBPACK_IMPORTED_MODULE_6__.useRef)(1);
      (0, react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        if (value.length === 0) {
          if (imageTokenMapRef.current.size > 0) {
            imageTokenMapRef.current.clear();
            tokenOrderRef.current = [];
            onImagesUpdated === null || onImagesUpdated === void 0 ? void 0 : onImagesUpdated([]);
          }
        }
      }, [value.length, onImagesUpdated]);
      const buildTokenForPath = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(p => {
        const existing = imageTokenMapRef.current.get(p);
        if (existing) return existing;
        const rawBase = node_path__WEBPACK_IMPORTED_MODULE_2___default().basename(p);
        const safeBase = rawBase.replace(/\s+/g, "_").replace(/[^A-Za-z0-9._-]/g, "");
        const token = `@image[${safeBase}]`;
        imageTokenMapRef.current.set(p, token);
        tokenOrderRef.current.push(p);
        onImagesUpdated === null || onImagesUpdated === void 0 ? void 0 : onImagesUpdated(tokenOrderRef.current.map(path => ({
          token: imageTokenMapRef.current.get(path),
          path
        })));
        return token;
      }, [onImagesUpdated]);
      const syncImageRefsWithValue = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)(input => {
        // Build the set of tokens present in the current input
        const tokensInInput = new Set();
        for (const m of input.matchAll(/@image\[[^\]]+\]/g)) {
          tokensInInput.add(m[0]);
        }
        // Compute which paths remain based on tokens still present, preserving order
        const prevMap = imageTokenMapRef.current;
        const keptPaths = [];
        for (const p of tokenOrderRef.current) {
          const tok = prevMap.get(p);
          if (tok && tokensInInput.has(tok)) keptPaths.push(p);
        }
        // Rebuild map from kept paths, preserving original tokens
        const nextMap = new Map();
        for (const p of keptPaths) {
          const tok = prevMap.get(p);
          nextMap.set(p, tok);
        }
        imageTokenMapRef.current = nextMap;
        tokenOrderRef.current = keptPaths.slice();
        // Publish update
        onImagesUpdated === null || onImagesUpdated === void 0 ? void 0 : onImagesUpdated(tokenOrderRef.current.map(path => ({
          token: imageTokenMapRef.current.get(path),
          path
        })));
      }, [onImagesUpdated]);
      syncImageRefsWithValueRef.current = syncImageRefsWithValue;
      const replaceImagePathsWithTokens = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)((input, changedSpan) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (!hasLikelyImageExt(input)) return input;
        let replacedCount = 0;
        const MAX_REPLACEMENTS = 64;
        const replaceOne = rawPath => {
          if (replacedCount >= MAX_REPLACEMENTS) return rawPath;
          const norm0 = normalizePotentialPath(rawPath);
          const candidatesSet = new Set([norm0]);
          candidatesSet.add(norm0.replace(/\u00A0/g, " "));
          candidatesSet.add(norm0.replace(/\u202F/g, " "));
          if (norm0.includes(" ")) {
            candidatesSet.add(norm0.replace(/ /g, "\u00A0"));
            candidatesSet.add(norm0.replace(/ /g, "\u202F"));
          }
          let existing = null;
          for (const cand of candidatesSet) {
            try {
              if (node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(cand)) {
                existing = cand;
                break;
              }
            } catch (_a) {
              /* ignore */
            }
          }
          if (!existing) {
            if (isLikelyTempPath(norm0)) existing = norm0;else return rawPath;
          }
          const token = buildTokenForPath(existing);
          replacedCount++;
          return token;
        };
        const matches = [];
        const overlapsChanged = (start, end) => {
          if (!changedSpan) return true;
          return end > changedSpan.start && start < changedSpan.end;
        };
        for (const m of input.matchAll(reUnquotedWithQuotedSpaces)) {
          const idx = (_a = m.index) !== null && _a !== void 0 ? _a : 0;
          const prefix = (_b = m[1]) !== null && _b !== void 0 ? _b : "";
          const joinedSeq = (_c = m[2]) !== null && _c !== void 0 ? _c : "";
          const pathStart = idx + prefix.length;
          const pathEnd = pathStart + joinedSeq.length;
          if (!overlapsChanged(pathStart, pathEnd)) continue;
          matches.push({
            start: pathStart,
            end: pathEnd,
            path: joinedSeq.replace(/'\s'/g, " ")
          });
        }
        for (const m of input.matchAll(reQuotedDouble)) {
          const idx = (_d = m.index) !== null && _d !== void 0 ? _d : 0;
          const full = (_e = m[0]) !== null && _e !== void 0 ? _e : "";
          const p1 = (_f = m[1]) !== null && _f !== void 0 ? _f : "";
          const start = idx;
          const end = idx + full.length;
          if (!overlapsChanged(start, end)) continue;
          matches.push({
            start,
            end,
            path: p1
          });
        }
        for (const m of input.matchAll(reQuotedSingle)) {
          const idx = (_g = m.index) !== null && _g !== void 0 ? _g : 0;
          const full = (_h = m[0]) !== null && _h !== void 0 ? _h : "";
          const p1 = (_j = m[1]) !== null && _j !== void 0 ? _j : "";
          const start = idx;
          const end = idx + full.length;
          if (!overlapsChanged(start, end)) continue;
          matches.push({
            start,
            end,
            path: p1
          });
        }
        for (const m of input.matchAll(reUnquoted)) {
          const idx = (_k = m.index) !== null && _k !== void 0 ? _k : 0;
          const prefix = (_l = m[1]) !== null && _l !== void 0 ? _l : "";
          const p = (_m = m[2]) !== null && _m !== void 0 ? _m : "";
          const start = idx + prefix.length;
          const end = start + p.length;
          if (!overlapsChanged(start, end)) continue;
          matches.push({
            start,
            end,
            path: p
          });
        }
        for (const m of input.matchAll(reAbsWithSpaces)) {
          const idx = (_o = m.index) !== null && _o !== void 0 ? _o : 0;
          const prefix = (_p = m[1]) !== null && _p !== void 0 ? _p : "";
          const p = (_q = m[2]) !== null && _q !== void 0 ? _q : "";
          const start = idx + prefix.length;
          const end = start + p.length;
          if (!overlapsChanged(start, end)) continue;
          matches.push({
            start,
            end,
            path: p
          });
        }
        if (matches.length === 0) return input;
        matches.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
        const filtered = [];
        let lastEnd = -1;
        for (const m of matches) {
          if (m.start < lastEnd) continue;
          filtered.push(m);
          lastEnd = m.end;
        }
        let out = "";
        let cursor = 0;
        for (const m of filtered) {
          if (cursor < m.start) out += input.slice(cursor, m.start);
          const tokenOrPath = replaceOne(m.path);
          out += tokenOrPath;
          cursor = m.end;
        }
        out += input.slice(cursor);
        out = out.replace(/(@image\[[^\]]+\])(?!\s)/g, "$1 ");
        return out;
      }, [buildTokenForPath]);
      replaceImagePathsWithTokensRef.current = replaceImagePathsWithTokens;
      // Convert accepted @-mentions of image paths into @image-N tokens and update selection map
      const convertAtImageMentionsInChangedSpan = (0, react__WEBPACK_IMPORTED_MODULE_6__.useCallback)((prevValue, nextValue) => {
        var _a, _b, _c;
        // Reuse the same changed span computation from handleUserChange
        const computeChangedSpan = (a, b) => {
          if (a === b) return null;
          let i = 0;
          const minLen = Math.min(a.length, b.length);
          while (i < minLen && a[i] === b[i]) i++;
          let ai = a.length - 1;
          let bi = b.length - 1;
          while (ai >= i && bi >= i && a[ai] === b[bi]) {
            ai--;
            bi--;
          }
          const start = i;
          const end = bi + 1;
          if (start > end) return null;
          return {
            start,
            end
          };
        };
        const changed = computeChangedSpan(prevValue, nextValue);
        if (changed == null) return nextValue;
        // Match @<path> where <path> looks like an image file
        const reAtImage = new RegExp(String.raw`@((?:file://)?[^\s'"()]+?\.(${IMAGE_EXTS.join("|")}))`, "gi");
        const matches = [];
        for (const m of nextValue.matchAll(reAtImage)) {
          const idx = (_a = m.index) !== null && _a !== void 0 ? _a : 0;
          const full = (_b = m[0]) !== null && _b !== void 0 ? _b : ""; // includes leading '@'
          const p1 = (_c = m[1]) !== null && _c !== void 0 ? _c : ""; // path after '@'
          const start = idx;
          const end = idx + full.length;
          // Only transform if overlap with the changed span
          if (!(end > changed.start && start < changed.end)) continue;
          matches.push({
            start,
            end,
            path: p1
          });
        }
        if (matches.length === 0) return nextValue;
        // Build output by replacing from left to right without overlapping
        matches.sort((a, b) => a.start - b.start || b.end - a.end);
        const filtered = [];
        let lastEnd = -1;
        for (const m of matches) {
          if (m.start < lastEnd) continue;
          filtered.push(m);
          lastEnd = m.end;
        }
        let out = "";
        let cursor = 0;
        for (const m of filtered) {
          if (cursor < m.start) out += nextValue.slice(cursor, m.start);
          // Normalize and verify path existence (or temp), then generate token
          const norm0 = normalizePotentialPath(m.path);
          let existing = null;
          const candidatesSet = new Set([norm0]);
          candidatesSet.add(norm0.replace(/\u00A0/g, " "));
          candidatesSet.add(norm0.replace(/\u202F/g, " "));
          try {
            for (const cand of candidatesSet) {
              if (node_fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(cand)) {
                existing = cand;
                break;
              }
            }
          } catch (_d) {
            /* ignore */
          }
          if (!existing && isLikelyTempPath(norm0)) existing = norm0;
          if (existing) {
            const token = buildTokenForPath(existing);
            out += token;
          } else {
            // Fallback: keep original text if path is not valid
            out += nextValue.slice(m.start, m.end);
          }
          cursor = m.end;
        }
        out += nextValue.slice(cursor);
        // Ensure a space after tokens if missing
        out = out.replace(/(@image\[[^\]]+\])(?!\s)/g, "$1 ");
        return out;
      }, [buildTokenForPath]);
      convertAtImageMentionsInChangedSpanRef.current = convertAtImageMentionsInChangedSpan;
      const extractCandidateImagePaths = content => {
        if (!hasLikelyImageExt(content)) return [];
        const candidates = [];
        // double-quoted
        for (const m of content.matchAll(reQuotedDouble)) {
          if (m[1]) candidates.push(m[1]);
        }
        // single-quoted
        for (const m of content.matchAll(reQuotedSingle)) {
          if (m[1]) candidates.push(m[1]);
        }
        // unquoted with prefix capture in group 1 and path in group 2
        for (const m of content.matchAll(reUnquoted)) {
          if (m[2]) candidates.push(m[2]);
        }
        // absolute with spaces
        for (const m of content.matchAll(reAbsWithSpaces)) {
          if (m[2]) candidates.push(m[2]);
        }
        // unquoted sequences split by "' '"
        for (const m of content.matchAll(reUnquotedWithQuotedSpaces)) {
          if (m[2]) candidates.push(m[2].replace(/'\s'/g, " "));
        }
        return candidates;
      };
      // Single input handler for both decision and message modes
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .useInput */.Ge)((inp, key) => {
        var _a, _b;
        // ========================================
        // PLAN SUGGESTION MODE HANDLING
        // ========================================
        if (isSuggestingPlan) {
          // Plan decision navigation (up/down arrows to select options)
          if (key.upArrow) {
            setPlanDecisionIndex === null || setPlanDecisionIndex === void 0 ? void 0 : setPlanDecisionIndex(Math.max(0, (planDecisionIndex !== null && planDecisionIndex !== void 0 ? planDecisionIndex : 0) - 1));
            return;
          }
          if (key.downArrow) {
            setPlanDecisionIndex === null || setPlanDecisionIndex === void 0 ? void 0 : setPlanDecisionIndex(Math.min(1, (planDecisionIndex !== null && planDecisionIndex !== void 0 ? planDecisionIndex : 0) + 1));
            return;
          }
          // Enter key: execute the selected option
          if (key.return) {
            if (planDecisionIndex === 0) {
              // Accept and proceed
              onChange("");
              void (onExecutePlan === null || onExecutePlan === void 0 ? void 0 : onExecutePlan());
            } else {
              // Reject and propose changes
              onChange("");
              onRejectPlan === null || onRejectPlan === void 0 ? void 0 : onRejectPlan();
              // Abort the stream when rejecting
              onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC();
            }
            return;
          }
          // Direct accept shortcuts (bypass selection)
          if (inp === "y" || inp === "Y") {
            onChange("");
            void (onExecutePlan === null || onExecutePlan === void 0 ? void 0 : onExecutePlan());
            return;
          }
          // Direct reject shortcuts (bypass selection)
          const isEscapeKey = key.escape || key.ctrl && inp === "c" || key.ctrl && inp === "C";
          if (inp === "n" || inp === "N" || isEscapeKey) {
            onChange("");
            onRejectPlan === null || onRejectPlan === void 0 ? void 0 : onRejectPlan();
            // Abort the stream when rejecting
            onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC();
            return;
          }
          // Ignore all other input while in plan mode
          return;
        }
        // Immediate quit on Ctrl+D while in decision mode
        const isCtrlD = key.ctrl && (inp === "d" || inp === "D") || inp === "\u0004";
        if (isCtrlD && inputMode === "decision") {
          handleExit();
          return;
        }
        // First-class action: Cmd+/ or Ctrl+/ cycles through available models
        // Note: Many terminals send Ctrl+/ as ASCII 0x1F (Unit Separator, '\x1f').
        // Cmd is typically not delivered to TTY apps; key.meta represents Alt/Meta.
        const isUnitSep = inp === "\x1f"; // common Ctrl-/ mapping
        const isCtrlSlash = key.ctrl && inp === "/";
        const isMetaSlash = key.meta && inp === "/"; // Alt/Meta, not true Command
        if (isUnitSep || isCtrlSlash || isMetaSlash) {
          // Prevent the control character from being inserted into the prompt
          if (value.includes("\x1f")) {
            handleProgrammaticChange(value.replace(/\x1f/g, ""));
          }
          void (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
              const list = yield modelManager.awaitAvailableModels();
              const currentModel = yield modelManager.awaitCurrentModel();
              if (list.length === 0) return;
              const curId = currentModel.modelId;
              const idx = Math.max(0, list.findIndex(m => m.modelId === curId));
              const next = list[(idx + 1) % list.length];
              if (!next || next.modelId === curId) return;
              setCurrentModel(next);
            } catch (_a) {
              /* ignore */
            }
          }))();
          return;
        }
        // Global unified list picker: Ctrl+Y opens the same as '/list'
        // Handle both the control character (\u0019) and explicit ctrl-modified 'y'
        const isCtrlYChar = inp === "\u0019"; // ^Y
        if (isCtrlYChar || key.ctrl && (inp === "y" || inp === "Y")) {
          // Prevent the control character from being inserted into the prompt, if any
          if (value.includes("\u0019")) {
            handleProgrammaticChange(value.replace(/\u0019/g, ""));
          }
          void runSlashInput("/list");
          return;
        }
        // Global compact toggle: Ctrl+O
        const isCtrlOChar = inp === "\u000f"; // ^O control character
        if (isCtrlOChar || key.ctrl && (inp === "o" || inp === "O")) {
          // Prevent the control character from being inserted into the prompt
          if (value.includes("\u000f")) {
            handleProgrammaticChange(value.replace(/\u000f/g, ""));
          }
          setIsCompact(prev => !prev);
          return;
        }
        // ========================================
        // REGULAR DECISION MODE HANDLING
        // (for shell commands, file writes, etc.)
        // ========================================
        switch (inputMode) {
          case "decision":
            {
              if (pendingDecisions.length === 0) return;
              const first = pendingDecisions[0];
              // ----------------------------------------
              // Decision dropdown navigation (j/k or arrows)
              // ----------------------------------------
              const isDownKey = inp === "j" || inp === "J" || inp.endsWith("j") || inp.endsWith("J");
              const isUpKey = inp === "k" || inp === "K" || inp.endsWith("k") || inp.endsWith("K");
              const optionsForSelection = buildDecisionOptions(first);
              const optionCount = optionsForSelection.length;
              if (key.downArrow || isDownKey) {
                setDecisionIndex(i => Math.min(i + 1, optionCount - 1));
                return;
              }
              if (key.upArrow || isUpKey) {
                setDecisionIndex(i => Math.max(i - 1, 0));
                return;
              }
              // ----------------------------------------
              // Decision action shortcuts
              // ----------------------------------------
              // Esc maps to propose changes
              if (key.escape) {
                onBeginRejection === null || onBeginRejection === void 0 ? void 0 : onBeginRejection(first.id);
                onChange("");
                setDecisionIndex(0);
                return;
              }
              // Review changed files shortcut (Ctrl+R only)
              if (_constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .REVIEW_MODE_ENABLED */.hD && (key.ctrl && (inp === "r" || inp === "R") || inp === "\u0012") && changedFiles.length > 0) {
                maybeRequestReview();
                return;
              }
              // Handle Ctrl+C (both explicit and control character)
              const isCtrlCChar = inp === "\u0003"; // ^C control character
              if (key.ctrl && inp === "c" || isCtrlCChar) {
                rejectPendingDecision(first.id, undefined);
                onChange("");
                setDecisionIndex(0);
                return;
              }
              if (inp === "q" || inp === "Q") {
                rejectPendingDecision(first.id, undefined);
                onChange("");
                setDecisionIndex(0);
                return;
              }
              if (inp === "y" || inp === "Y") {
                approvePendingDecision(first.id);
                onChange("");
                setDecisionIndex(0);
                return;
              }
              if (inp === "n" || inp === "N") {
                onBeginRejection === null || onBeginRejection === void 0 ? void 0 : onBeginRejection(first.id);
                onChange("");
                setDecisionIndex(0);
                return;
              }
              if (inp === "p" || inp === "P") {
                // Explicit propose shortcut
                onBeginRejection === null || onBeginRejection === void 0 ? void 0 : onBeginRejection(first.id);
                onChange("");
                setDecisionIndex(0);
                return;
              }
              // Shift+Tab: enable auto-run and accept all pending decisions
              if (key.tab && key.shift) {
                // Block cycling if mode switching is disabled
                if (disableModeSwitch) {
                  return;
                }
                agentStore.setMetadata("mode", "auto-run");
                // Approve all pending decisions
                for (const decision of pendingDecisions) {
                  approvePendingDecision(decision.id);
                }
                onChange("");
                setDecisionIndex(0);
                return;
              }
              // ----------------------------------------
              // Allowlist and auto-run shortcuts
              // ----------------------------------------
              // Tab: add the first pending decision to the allowlist (if applicable) and approve only that one
              if (key.tab && !key.shift) {
                const opType = first.operation.type;
                if (opType === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Shell) {
                  // Use the patterns already calculated by permissions-service
                  const details = first.operation.details;
                  const patterns = (_a = details.notAllowedCommands) !== null && _a !== void 0 ? _a : [];
                  for (const p of patterns) {
                    void (onAddToAllowList === null || onAddToAllowList === void 0 ? void 0 : onAddToAllowList("Shell", p));
                  }
                  (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("allowlist-requested", Object.assign(Object.assign({}, first.operation), {
                    patterns
                  }));
                } else if (opType === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Write) {
                  const p = first.operation.details.path;
                  void (onAddToAllowList === null || onAddToAllowList === void 0 ? void 0 : onAddToAllowList("Write", p));
                  (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("allowlist-requested", first.operation);
                }
                approvePendingDecision(first.id);
                onChange("");
                setDecisionIndex(0);
                return;
              }
              // ----------------------------------------
              // Enter key: execute selected option
              // ----------------------------------------
              if (key.return) {
                const selected = optionsForSelection[decisionIndex];
                if (!selected) return;
                switch (selected.action) {
                  case "approve":
                    {
                      approvePendingDecision(first.id);
                      onChange("");
                      setDecisionIndex(0);
                      return;
                    }
                  case "reject":
                    {
                      rejectPendingDecision(first.id, undefined);
                      onChange("");
                      setDecisionIndex(0);
                      return;
                    }
                  case "propose":
                    {
                      onBeginRejection === null || onBeginRejection === void 0 ? void 0 : onBeginRejection(first.id);
                      onChange("");
                      setDecisionIndex(0);
                      return;
                    }
                  case "allowlistApprove":
                    {
                      if (first.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Shell) {
                        // Use the patterns already calculated by permissions-service
                        const details = first.operation.details;
                        const patterns = (_b = details.notAllowedCommands) !== null && _b !== void 0 ? _b : [];
                        for (const p of patterns) {
                          void (onAddToAllowList === null || onAddToAllowList === void 0 ? void 0 : onAddToAllowList("Shell", p));
                        }
                        (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("allowlist-requested", Object.assign(Object.assign({}, first.operation), {
                          patterns
                        }));
                      }
                      approvePendingDecision(first.id);
                      onChange("");
                      setDecisionIndex(0);
                      return;
                    }
                  case "autoRunApprove":
                    {
                      agentStore.setMetadata("mode", "auto-run");
                      // Approve all pending decisions
                      for (const decision of pendingDecisions) {
                        approvePendingDecision(decision.id);
                      }
                      onChange("");
                      setDecisionIndex(0);
                      return;
                    }
                  default:
                    return;
                }
              }
              return;
            }
          case "message":
            {
              // ESC: exit Shell Mode when active and input empty
              if (bashModeActive && value.length === 0 && key.escape) {
                setBashModeActive(false);
                return;
              }
              // Backspace/Delete on empty exits bash mode
              if (bashModeActive && value.length === 0 && (key.backspace || key.delete)) {
                setBashModeActive(false);
                return;
              }
              switch (paletteMode) {
                case "slash":
                  {
                    if (!slash.active || slash.items.length === 0) return;
                    const isVimDown = vimEnabled && vimMode === "normal" && inp === "j";
                    const isVimUp = vimEnabled && vimMode === "normal" && inp === "k";
                    if (_constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .REVIEW_MODE_ENABLED */.hD && (key.ctrl && (inp === "r" || inp === "R") || inp === "\u0012")) {
                      handleCtrlR();
                      return;
                    }
                    if (key.downArrow || isVimDown) {
                      slash.next();
                      return;
                    }
                    if (key.upArrow || isVimUp) {
                      slash.prev();
                      return;
                    }
                    if (key.escape) {
                      if (value === "/") handleProgrammaticChange("");
                      slash.hide();
                      return;
                    }
                    return;
                  }
                case "at":
                  {
                    if (!at.active || at.suggestions.length === 0) return;
                    const isVimDown = vimEnabled && vimMode === "normal" && inp === "j";
                    const isVimUp = vimEnabled && vimMode === "normal" && inp === "k";
                    if (_constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .REVIEW_MODE_ENABLED */.hD && (key.ctrl && (inp === "r" || inp === "R") || inp === "\u0012")) {
                      handleCtrlR();
                      return;
                    }
                    if (key.downArrow || isVimDown) {
                      at.next();
                      return;
                    }
                    if (key.upArrow || isVimUp) {
                      at.prev();
                      return;
                    }
                    if (key.escape) {
                      at.suppress();
                      return;
                    }
                    return;
                  }
                default:
                  break;
              }
              if (_constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .REVIEW_MODE_ENABLED */.hD && (key.ctrl && (inp === "r" || inp === "R") || inp === "\u0012")) {
                handleCtrlR();
                return;
              }
              const isUpEquivalent = key.upArrow || vimEnabled && vimMode === "normal" && inp === "k";
              if (isUpEquivalent && paletteMode === "none") {
                const isAtFirstLine = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_27__ /* .getLineStart */.Jh)(value, cursorOffset) === 0;
                if (isAtFirstLine) {
                  handleHistoryUp();
                }
                return;
              }
              const isDownEquivalent = key.downArrow || vimEnabled && vimMode === "normal" && inp === "j";
              if (isDownEquivalent) {
                handleDownAction();
                return;
              }
              return;
            }
          case "rejection-reason":
            // Backspace/Delete on empty input returns to pending decision state (without rejecting)
            if ((key.backspace || key.delete) && value.length === 0) {
              onCancelRejectionReason === null || onCancelRejectionReason === void 0 ? void 0 : onCancelRejectionReason();
              onChange("");
              return;
            }
            return;
          default:
            return;
        }
      }, {
        isActive: isFocused || inputMode === "decision" || paletteMode !== "none" || !!isSuggestingPlan
      });
      const paletteVisible = paletteMode !== "none";
      const deferredChangedFilesCount = (0, react__WEBPACK_IMPORTED_MODULE_6__.useDeferredValue)(changedFiles.length);
      // Defer token percent updates to reduce frequent re-renders/flicker
      const deferredTokenPercent = (0, react__WEBPACK_IMPORTED_MODULE_6__.useDeferredValue)(conversationTokenPercent);
      const tokenPercentLabel = (0, react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => {
        if (deferredTokenPercent == null) return undefined;
        const asFixed = deferredTokenPercent.toFixed(1);
        return asFixed.endsWith(".0") ? `${Math.round(deferredTokenPercent)}%` : `${asFixed}%`;
      }, [deferredTokenPercent]);
      if (!shouldRender) {
        return null;
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
          marginTop: topStatusMarginTop !== null && topStatusMarginTop !== void 0 ? topStatusMarginTop : 0,
          marginBottom: 0,
          marginX: 1,
          paddingLeft: 1,
          children: topStatus !== null && topStatus !== void 0 ? topStatus : (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Text */.EY, {
            children: " "
          })
        }), pendingDecisions.length > 0 && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_pending_decisions_banner_js__WEBPACK_IMPORTED_MODULE_23__ /* ["default"] */.A, {
          decisions: pendingDecisions
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
          display: process.env.AGENT_CLI_HIDE_PROMPT_BAR === "true" && pendingDecisions.length === 0 || isSuggestingPlan ? "none" : "flex",
          flexDirection: "column",
          borderColor: effectiveBorderColor,
          borderTop: true,
          borderStyle: "single",
          paddingLeft: 1,
          marginX: 1,
          children: [inDecision ? (() => {
            var _a;
            const d = pendingDecisions[0];
            const decisionType = d.operation.type;
            const optsForRender = buildDecisionOptions(d).map(o => ({
              label: o.label,
              hint: o.hint,
              disabled: o.disabled
            }));
            let title = (_a = titleForOperation[decisionType]) !== null && _a !== void 0 ? _a : "Proceed with this edit?";
            if (d.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Shell) {
              const operation = d.operation;
              if (operation.details.isSandboxAvailable) {
                title = "Run this command outside the sandbox?";
              } else {
                title = "Run this command?";
              }
            }
            const subtitle = d.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Shell ? String(d.operation.details.reason) : d.operation.type === _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.OperationType.Write ? `in ${String(d.operation.details.path)}` : undefined;
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_19__ /* ["default"] */.A, {
              title: title,
              highlightColor: effectiveBorderColor,
              options: optsForRender,
              selectedIndex: decisionIndex,
              subtitle: subtitle
            });
          })() : null, (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
            flexDirection: "row",
            display: inDecision || isSuggestingPlan ? "none" : "flex",
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Text */.EY, {
              color: bashModeActive ? "yellow" : "foreground",
              dimColor: !bashModeActive && value.length === 0,
              children: [bashModeActive ? "!" : promptSymbol, " "]
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
              flexGrow: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PromptInput, {
                prompt: value,
                setPrompt: handleUserChange,
                placeholder: getPlaceholder(),
                rightPlaceholder: isProcessing ? "ctrl+c to stop" : vimEnabled ? vimMode === "insert" ? "INSERT" : "NORMAL" : undefined,
                isDisabled: isDisabled,
                onSubmit: handleSubmitVoid,
                onTab: onTab,
                onShiftTab: inputMode === "decision" || disableModeSwitch ? undefined : () => {
                  const modes = _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_3__ /* .AgentModes */.yj.slice();
                  const isBackgroundEnabled = isEmptyChat && _constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .BACKGROUND_ENABLED */.xZ && isRepository;
                  if (!isBackgroundEnabled) {
                    modes.splice(modes.indexOf("background"), 1);
                  }
                  if (!_constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .PLAN_ENABLED */.S8) {
                    modes.splice(modes.indexOf("plan"), 1);
                  }
                  // Cycle through execution modes: default -> auto-run -> background -> default
                  const currentMode = agentStore.getMetadata("mode");
                  const currentIndex = modes.indexOf(currentMode);
                  const nextIndex = (currentIndex + 1) % modes.length;
                  const nextMode = modes[nextIndex];
                  agentStore.setMetadata("mode", nextMode);
                },
                onCtrlC: handleCtrlC,
                onCtrlD: handleCtrlD,
                onCtrlR: handleCtrlR,
                visualFocus: inputMode === "decision" && pendingDecisions.length > 0,
                cursorToEndSignal: cursorToEndSignal + (externalCursorToEndSignal !== null && externalCursorToEndSignal !== void 0 ? externalCursorToEndSignal : 0),
                onCursorInfoChange: ({
                  offset,
                  isAtLastLine
                }) => {
                  setCursorOffset(offset);
                  setCursorAtLastLine(isAtLastLine);
                },
                onUpAtFirstLine: () => {
                  // Avoid double-handling ArrowUp when palette is active; outer handler manages palette nav
                  if (paletteMode !== "none") return;
                  handleHistoryUp();
                },
                onDownAtLastLine: handleDownAction,
                onPaste: ({
                  kind,
                  content
                }) => {
                  try {
                    const original = content;
                    // Tabs break our inputs. Spaces do not.
                    const sanitized = original.includes("\t") ? original.replace(/\t/g, "  ") : original;
                    const sample = sanitized.slice(0, 64);
                    const hex = Array.from(sample).map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
                    (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("paste-event", {
                      kind,
                      length: sanitized.length,
                      preview: sample,
                      hexSample: hex
                    });
                    // Intercept large text pastes: > 800 chars (same as CC)
                    if (sanitized.length > 800) {
                      const id = nextLargePasteIdRef.current++;
                      largePastedTextRef.current.set(id, sanitized);
                      const placeholder = buildLargePastePlaceholder(id, sanitized);
                      // Return replacement to suppress original paste
                      return placeholder;
                    }
                    if (sanitized.length === 0 && "darwin" === "darwin") {
                      void (() => __awaiter(void 0, void 0, void 0, function* () {
                        const img = yield (0, _utils_clipboard_js__WEBPACK_IMPORTED_MODULE_17__ /* .tryReadClipboardImageToTemp */.w)();
                        if (img) {
                          (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("paste-event-macos-image", img);
                          const token = buildTokenForPath(img.path);
                          const base = value.length === 0 ? token : `${value}${value.endsWith(" ") ? "" : " "}${token}`;
                          const next = ensureTrailingSpace(base);
                          handleProgrammaticChange(next);
                          setCursorToEndSignal(s => s + 1);
                        } else {
                          (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("paste-event-macos-image-miss");
                        }
                      }))();
                    }
                    // For bracketed or aggregated pastes that look like image paths,
                    // set a flag so the subsequent onChange call performs path->token replacement.
                    if (sanitized.length > 0) {
                      const candidates = extractCandidateImagePaths(sanitized);
                      if (candidates.length > 0) {
                        pendingPasteReplacementRef.current = true;
                      }
                    }
                  } catch (e) {
                    (0, _debug_js__WEBPACK_IMPORTED_MODULE_11__.debugLog)("paste-event-error", String(e));
                  }
                  // If tabs were present, return sanitized content to replace them with two spaces
                  if (content.includes("\t")) return content.replace(/\t/g, "  ");
                  return null;
                },
                allowExplicitNewline: true,
                focus: inputMode !== "decision" && !isSuggestingPlan
              })
            })]
          })]
        }), _constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .REVIEW_MODE_ENABLED */.hD && inDecision && changedFiles.length > 0 ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
          marginTop: 0,
          marginX: 2,
          justifyContent: "flex-end",
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Text */.EY, {
            color: "gray",
            dimColor: true,
            children: "ctrl+r to review changed files"
          })
        }) : null, inputMode === "message" && paletteMode === "none" && !isSuggestingPlan && process.env.AGENT_CLI_HIDE_PROMPT_BAR !== "true" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_24__ /* ["default"] */.A, {
          show: true,
          hasText: value.length > 0,
          exitMode: exitMode,
          modelLabel: (currentModel === null || currentModel === void 0 ? void 0 : currentModel.displayName) || "Starting...",
          tokenPercentLabel: tokenPercentLabel,
          changedFilesCount: deferredChangedFilesCount,
          showReviewHint: !history.inHistory,
          headlineLabel: (() => {
            // Keep concise to avoid wrapping; no Shell Mode hint here
            if (isSendingToBackground) {
              return "Sending to background";
            }
            if (mode === "auto-run") {
              return isEmptyChat ? "▶︎ Auto-run all commands (shift+tab to cycle)" : "▶︎ Auto-run all commands (shift+tab to turn off)";
            }
            if (mode === "background") {
              if (isRepository) {
                return process.stdout.columns > 60 ? "◎ Send to background (shift+tab to cycle)" : "◎ Background (shift+tab to cycle)";
              }
              return undefined;
            }
            if (mode === "plan") {
              return "◎ Plan (shift+tab to cycle)";
            }
            return undefined;
          })(),
          headlineColor: (() => {
            if (isSendingToBackground) return "green";
            if (mode === "background" && isRepository) return "magenta";
            if (mode === "auto-run") return "yellow";
            if (mode === "plan") return "cyan";
            return undefined;
          })()
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Box */.az, {
          height: paletteVisible ? Math.min(at.active ? Math.min(at.suggestions.length, _constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .PALETTE_PAGE_SIZE */.kQ) : Math.min(slash.items.length, _constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .PALETTE_PAGE_SIZE */.kQ), _constants_js__WEBPACK_IMPORTED_MODULE_8__ /* .PALETTE_PAGE_SIZE */.kQ) : 0,
          flexDirection: "column",
          marginTop: 0,
          children: paletteVisible && (at.active ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_21__ /* ["default"] */.A, {
            suggestions: at.suggestions,
            activeIndex: at.index,
            windowStart: at.windowStart,
            highlightColor: effectiveBorderColor
          }) : (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_22__ /* ["default"] */.A, {
            items: slash.items,
            activeIndex: slash.index,
            windowStart: slash.windowStart,
            highlightColor: effectiveBorderColor
          }))
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_20__ /* ["default"] */.A, {
          lines: ephemeral.lines
        })]
      });
    };
    // Precompiled image path detection helpers (perf-sensitive)
    const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tif", "tiff", "heic", "heif"];
    const hasLikelyImageExt = s => {
      const low = s.toLowerCase();
      for (const ext of IMAGE_EXTS) {
        if (low.includes(`.${ext}`)) return true;
      }
      return low.includes("file://");
    };
    // "...path.ext" (double-quoted)
    const reQuotedDouble = new RegExp(String.raw`"((?:file://)?[^"\n]+?\.(${IMAGE_EXTS.join("|")}))"`, "gi");
    // '...path.ext' (single-quoted)
    const reQuotedSingle = new RegExp(String.raw`'((?:file://)?[^'\n]+?\.(${IMAGE_EXTS.join("|")}))'`, "gi");
    // Unquoted path with a simple left-boundary capture to avoid lookbehind
    // Matches: (<start>|non-word and not @ or -) + (path.ext)
    const reUnquoted = new RegExp(String.raw`(^|[^\w@-])((?:file://)?[^\s'"()]+?\.(${IMAGE_EXTS.join("|")}))`, "gi");
    // Absolute POSIX path allowing spaces until newline (for drag/drop that yields a full path with spaces)
    const reAbsWithSpaces = new RegExp(String.raw`(^|[^\w@-])((?:file://)?(?:/|~)[^\n]+?\.(${IMAGE_EXTS.join("|")}))`, "gi");
    // Unquoted path split by repeated "' '" segments used by macOS Terminal drag-drop
    // Example: /path/Screenshot' '2025-08-05' 'at' '6.47.38PM.png
    const reUnquotedWithQuotedSpaces = /(^|[^\w@-])((?:file:\/\/)?[^\s'"()]+(?:'\s'[^\s'"()]+)+)/gi;
    const isAbsolutePath = p => {
      // POSIX absolute or file:// root
      if (/^(?:file:\/\/)?\//.test(p)) return true;
      // Windows drive letter or UNC
      if (/^[A-Za-z]:[\\/]/.test(p) || /^\\\\/.test(p)) return true;
      // Home shortcuts like ~/
      if (/^~\//.test(p)) return true;
      return false;
    };
    const getLikelyTempRoots = () => {
      const roots = [];
      const envCandidates = [process.env.TMPDIR, process.env.TEMP, process.env.TMP];
      for (const e of envCandidates) if (e && typeof e === "string") roots.push(e);
      // Common POSIX/mac temp roots
      roots.push("/tmp", "/var/tmp", "/private/tmp", "/var/folders", "/private/var/folders");
      // Windows temp patterns (approximate)
      if (false)
        // removed by dead control flow
        {}
      // Normalize slashes for matching
      return Array.from(new Set(roots.map(r => r.replace(/\\/g, "/"))));
    };
    const isLikelyTempPath = p => {
      if (!isAbsolutePath(p)) return false;
      const norm = p.replace(/\\/g, "/");
      for (const root of getLikelyTempRoots()) {
        if (norm.startsWith(root.endsWith("/") ? root : `${root}/`)) return true;
      }
      return false;
    };
    const normalizePotentialPath = raw => {
      let s = raw.trim();
      if (s.startsWith('"') && s.endsWith('"') || s.startsWith("'") && s.endsWith("'")) {
        s = s.slice(1, -1);
      }
      if (s.startsWith("file://")) {
        try {
          const u = new URL(s);
          s = decodeURI(u.pathname);
        } catch (_a) {
          s = s.replace(/^file:\/\//, "");
        }
      }
      const isWindowsPath = /^[A-Za-z]:[\\/]/.test(s) || /\\\\/.test(s);
      if (!isWindowsPath) {
        s = s.replace(/\\([\s()])/g, "$1");
        s = s.replace(/'\s'/g, " ");
      }
      // no-op debug removal
      return s;
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/