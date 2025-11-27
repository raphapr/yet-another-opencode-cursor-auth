__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */X: () => (/* binding */AnysphereAgentUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var node_crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:crypto");
    /* harmony import */
    var node_crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */
    var _anysphere_agent_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../agent-client/dist/index.js");
    /* harmony import */
    var _anysphere_agent_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../agent-core/dist/index.js");
    /* harmony import */
    var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../agent-kv/dist/index.js");
    /* harmony import */
    var _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../agent-ui-state/dist/index.js");
    /* harmony import */
    var _anysphere_context__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../context/dist/index.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
    /* harmony import */
    var _anysphere_proto_agent_v1_agent_service_pb_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../proto/dist/generated/agent/v1/agent_service_pb.js");
    /* harmony import */
    var _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../proto/dist/generated/agent/v1/selected_context_pb.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../proto/dist/generated/aiserver/v1/background_composer_pb.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _analytics_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/analytics.ts");
    /* harmony import */
    var _background_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/background.tsx");
    /* harmony import */
    var _commands_logout_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/commands/logout.tsx");
    /* harmony import */
    var _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/components/alt-screen.tsx");
    /* harmony import */
    var _components_animated_dots_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./src/components/animated-dots.tsx");
    /* harmony import */
    var _components_cube_overlay_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./src/components/cube-overlay.tsx");
    /* harmony import */
    var _components_file_change_review_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./src/components/file-change-review.tsx");
    /* harmony import */
    var _components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./src/components/hexagon-loader.tsx");
    /* harmony import */
    var _components_index_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("./src/components/index.ts");
    /* harmony import */
    var _components_last_n_lines_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("./src/components/last-n-lines.tsx");
    /* harmony import */
    var _components_prompt_bar_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("./src/components/prompt-bar.tsx");
    /* harmony import */
    var _components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("./src/components/unified-list-pager.tsx");
    /* harmony import */
    var _console_io_js__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__("./src/console-io.ts");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("./src/context/agent-state-context.tsx");
    /* harmony import */
    var _context_config_context_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("./src/context/config-context.tsx");
    /* harmony import */
    var _context_slash_command_context_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__("./src/context/slash-command-context.tsx");
    /* harmony import */
    var _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__("./src/context/terminal-state-context.tsx");
    /* harmony import */
    var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__("./src/context/theme-context.tsx");
    /* harmony import */
    var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__("./src/context/vim-mode-context.tsx");
    /* harmony import */
    var _conversation_dynamic_item_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__("./src/conversation/dynamic-item.tsx");
    /* harmony import */
    var _conversation_static_item_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__("./src/conversation/static-item.tsx");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _hooks_use_attach_background_composer_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__("./src/hooks/use-attach-background-composer.ts");
    /* harmony import */
    var _hooks_use_mounted_effect_js__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__("./src/hooks/use-mounted-effect.ts");
    /* harmony import */
    var _hooks_use_send_to_background_js__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__("./src/hooks/use-send-to-background.ts");
    /* harmony import */
    var _hooks_use_slash_commands_js__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__("./src/hooks/use-slash-commands.ts");
    /* harmony import */
    var _image_processing_js__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__("./src/image-processing.ts");
    /* harmony import */
    var _state_index_js__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__("./src/state/index.ts");
    /* harmony import */
    var _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__("./src/state/sqlite-blob-store.ts");
    /* harmony import */
    var _utils_tokens_js__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__("./src/utils/tokens.ts");
    /* harmony import */
    var _utils_turn_file_tracker_js__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__("./src/utils/turn-file-tracker.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__, _background_js__WEBPACK_IMPORTED_MODULE_15__, _commands_logout_js__WEBPACK_IMPORTED_MODULE_16__, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__, _components_animated_dots_js__WEBPACK_IMPORTED_MODULE_18__, _components_cube_overlay_js__WEBPACK_IMPORTED_MODULE_19__, _components_file_change_review_js__WEBPACK_IMPORTED_MODULE_20__, _components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_21__, _components_index_js__WEBPACK_IMPORTED_MODULE_22__, _components_last_n_lines_js__WEBPACK_IMPORTED_MODULE_23__, _components_prompt_bar_js__WEBPACK_IMPORTED_MODULE_24__, _components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_25__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_30__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_31__, _conversation_dynamic_item_js__WEBPACK_IMPORTED_MODULE_33__, _conversation_static_item_js__WEBPACK_IMPORTED_MODULE_34__, _hooks_use_slash_commands_js__WEBPACK_IMPORTED_MODULE_39__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__, _background_js__WEBPACK_IMPORTED_MODULE_15__, _commands_logout_js__WEBPACK_IMPORTED_MODULE_16__, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__, _components_animated_dots_js__WEBPACK_IMPORTED_MODULE_18__, _components_cube_overlay_js__WEBPACK_IMPORTED_MODULE_19__, _components_file_change_review_js__WEBPACK_IMPORTED_MODULE_20__, _components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_21__, _components_index_js__WEBPACK_IMPORTED_MODULE_22__, _components_last_n_lines_js__WEBPACK_IMPORTED_MODULE_23__, _components_prompt_bar_js__WEBPACK_IMPORTED_MODULE_24__, _components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_25__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_30__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_31__, _conversation_dynamic_item_js__WEBPACK_IMPORTED_MODULE_33__, _conversation_static_item_js__WEBPACK_IMPORTED_MODULE_34__, _hooks_use_slash_commands_js__WEBPACK_IMPORTED_MODULE_39__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
      if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
          if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
          dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
          if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
          dispose = value[Symbol.dispose];
          if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function () {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
        env.stack.push({
          value: value,
          dispose: dispose,
          async: async
        });
      } else if (async) {
        env.stack.push({
          async: true
        });
      }
      return value;
    };
    var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
      return function (env) {
        function fail(e) {
          env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
          env.hasError = true;
        }
        var r,
          s = 0;
        function next() {
          while (r = env.stack.pop()) {
            try {
              if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
              if (r.dispose) {
                var result = r.dispose.call(r.value);
                if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
                  fail(e);
                  return next();
                });
              } else s |= 1;
            } catch (e) {
              fail(e);
            }
          }
          if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
          if (env.hasError) throw env.error;
        }
        return next();
      };
    }(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    });

    // Dev-only visual divider between Static and live regions
    const StaticAboveDivider = () => {
      var _a;
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .useStdout */.t$)();
      const columns = Math.max(20, (_a = stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _a !== void 0 ? _a : 80);
      const label = "STATIC ABOVE";
      const sideChar = "─";
      // Compute side length leaving spaces around the label
      const sideLength = Math.max(2, Math.floor((columns - label.length - 2) / 2));
      const left = sideChar.repeat(sideLength);
      const right = sideChar.repeat(sideLength);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
        marginY: 1,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
          dimColor: true,
          children: left
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
          children: " "
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
          color: "magenta",
          bold: true,
          children: label
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
          children: " "
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
          dimColor: true,
          children: right
        })]
      });
    };
    const AnysphereAgentUIInner = ({
      uiConversationState,
      onRequestReviewMode,
      onOpenBackgroundPicker,
      isProcessing,
      sendMessage,
      onAbort,
      debugInfo,
      isGenerating,
      unshownTokenEstimate,
      onResumeChat,
      onNewChat,
      getChatId,
      addToAllowList,
      onImagesUpdated,
      configProvider,
      credentialManager,
      isRepository,
      modelManager,
      rgPath,
      isResumingChat,
      isSendingToBackground,
      onSummarize,
      externalCursorToEndSignal,
      sendShellCommand,
      executePlan,
      isSuggestingPlan,
      planDecisionIndex,
      setPlanDecisionIndex,
      onRejectPlan,
      onDiscardPlan,
      mcpLoader,
      shellManager,
      dashboardClient
    }) => {
      const {
        pendingDecisions,
        rejectPendingDecision,
        inputValue,
        setInputValue,
        changedFiles,
        queuedMessage,
        isSummarizing,
        mode
      } = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_27__ /* .useAgentState */.C9)();
      const isCompact = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_27__ /* .useIsCompact */.tO)();
      const {
        registerCommand,
        unregisterCommand
      } = (0, _context_slash_command_context_js__WEBPACK_IMPORTED_MODULE_29__ /* .useSlashCommandRegistry */.x)();
      const [pendingRejectionId, setPendingRejectionId] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(null);
      const [showStaticIndicator, setShowStaticIndicator] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(false);
      const slashCommands = (0, _hooks_use_slash_commands_js__WEBPACK_IMPORTED_MODULE_39__ /* .useSlashCommands */.d)({
        credentialManager,
        configProvider,
        modelManager,
        mcpLoader,
        dashboardClient
      });
      const inputMode = (() => {
        if (uiConversationState.rejectedPlan) {
          return "plan-revision";
        }
        if (pendingRejectionId) {
          return "rejection-reason";
        }
        if (pendingDecisions.length > 0) {
          return "decision";
        }
        return "message";
      })();
      const handleInputSubmit = (value, meta) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (inputMode === "message" && value.trim()) {
          void sendMessage(value, {
            display: meta === null || meta === void 0 ? void 0 : meta.display
          });
          // Do not clear input immediately when sending to background; keep text until success
          if (mode !== "background") {
            setInputValue("");
            onImagesUpdated([]);
          }
        } else if (inputMode === "rejection-reason" && pendingRejectionId) {
          // Track the rejection
          const decision = pendingDecisions.find(d => d.id === pendingRejectionId);
          const toolName = ((_a = decision === null || decision === void 0 ? void 0 : decision.operation) === null || _a === void 0 ? void 0 : _a.type) || "unknown";
          (0, _analytics_js__WEBPACK_IMPORTED_MODULE_14__ /* .trackEvent */.sx)("cli.request.user_input.response", {
            tool: toolName,
            response: "rejected",
            reason: value.trim() || undefined
          });
          rejectPendingDecision(pendingRejectionId, value.trim() || undefined);
          setPendingRejectionId(null);
          setInputValue("");
          onImagesUpdated([]);
        } else if (inputMode === "plan-revision" && value.trim()) {
          // Send the revision request as a regular message
          void sendMessage(value.trim(), {
            display: value.trim()
          });
          setInputValue("");
          onImagesUpdated([]);
        }
      });
      // Add /review command only when there are edits to review
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        var _a;
        const hasChanges = ((_a = changedFiles === null || changedFiles === void 0 ? void 0 : changedFiles.length) !== null && _a !== void 0 ? _a : 0) > 0;
        if (!_constants_js__WEBPACK_IMPORTED_MODULE_26__ /* .REVIEW_MODE_ENABLED */.hD || !hasChanges) {
          unregisterCommand("review");
          return;
        }
        const command = {
          id: "review",
          title: "Review edits",
          description: "Enter review mode to inspect edits",
          run: (_ctx, _args, slashCommandCtx) => {
            var _a;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            onRequestReviewMode();
          }
        };
        registerCommand(command);
        return () => unregisterCommand("review");
      }, [registerCommand, unregisterCommand, onRequestReviewMode, changedFiles]);
      // Register /list command to open unified list (chats and background)
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        const description = "Open the picker for chats and background agents";
        const listCommand = {
          id: "list",
          title: "List Sessions",
          description,
          run: (_ctx, _args, slashCommandCtx) => {
            var _a;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            onOpenBackgroundPicker();
          }
        };
        const resumeCommand = {
          id: "resume",
          title: "Resume Session",
          description,
          run: (_ctx, _args, slashCommandCtx) => {
            var _a;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            onOpenBackgroundPicker();
          }
        };
        registerCommand(listCommand);
        registerCommand(resumeCommand);
        return () => {
          unregisterCommand("list");
          unregisterCommand("resume");
        };
      }, [registerCommand, unregisterCommand, onOpenBackgroundPicker]);
      // Dev-only: toggle static indicator divider and highlighting
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        if (!(0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.isDebugEnabled)()) return;
        const cmd = {
          id: "static-indicator",
          title: "Static Indicator",
          description: "Toggle static divider and highlighting (/static-indicator [on|off|toggle|status])",
          args: [{
            id: "state",
            required: false
          }],
          run: (_ctx, args, slashCommandCtx) => {
            var _a, _b, _c, _d;
            const raw = (args[0] || "").trim().toLowerCase();
            const current = showStaticIndicator;
            const usage = "Usage: /static-indicator [on|off|toggle|status]";
            if (raw === "status") {
              (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [[{
                text: "Static indicator is ",
                dim: true
              }, {
                text: current ? "ON" : "OFF",
                color: current ? "green" : "gray"
              }]]);
              slashCommandCtx.insertText("");
              return;
            }
            let next = null;
            if (raw === "" || raw === "toggle") next = !current;else if (raw === "on") next = true;else if (raw === "off") next = false;
            if (next === null) {
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: usage,
                color: "red"
              }]]);
              (_c = slashCommandCtx.clearInput) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx);
              return;
            }
            setShowStaticIndicator(next);
            (_d = slashCommandCtx.print) === null || _d === void 0 ? void 0 : _d.call(slashCommandCtx, [[{
              text: "Static indicator ",
              dim: true
            }, {
              text: next ? "enabled" : "disabled",
              color: next ? "green" : "gray"
            }]]);
            slashCommandCtx.insertText("");
          }
        };
        registerCommand(cmd);
        return () => unregisterCommand("static-indicator");
      }, [registerCommand, unregisterCommand, showStaticIndicator]);
      const isThinkingActive = (0, react__WEBPACK_IMPORTED_MODULE_13__.useMemo)(() => {
        var _a;
        if (((_a = uiConversationState.pendingTurn) === null || _a === void 0 ? void 0 : _a.type) !== "agent") return false;
        return uiConversationState.pendingTurn.thinkingContent !== undefined && uiConversationState.pendingTurn.thinkingContent.length > 0;
      }, [uiConversationState]);
      const lastStepThinkingContent = (0, react__WEBPACK_IMPORTED_MODULE_13__.useMemo)(() => {
        var _a;
        if (((_a = uiConversationState.pendingTurn) === null || _a === void 0 ? void 0 : _a.type) !== "agent") return null;
        return uiConversationState.pendingTurn.thinkingContent;
      }, [uiConversationState]);
      // Determine the latest in-flight tool's verb phrase (e.g., "Searching", "Listing", "Reading")
      const latestToolVerbRaw = (0, react__WEBPACK_IMPORTED_MODULE_13__.useMemo)(() => {
        var _a;
        if (((_a = uiConversationState.pendingTurn) === null || _a === void 0 ? void 0 : _a.type) !== "agent") return null;
        const pendingState = uiConversationState.pendingTurn.pendingState;
        if ((pendingState === null || pendingState === void 0 ? void 0 : pendingState.type) !== "tool-call-segment") return null;
        const lastGroup = pendingState.groups[pendingState.groups.length - 1];
        if ((lastGroup === null || lastGroup === void 0 ? void 0 : lastGroup.type) !== "tool-call-group") return null;
        const lastToolCall = lastGroup.calls[lastGroup.calls.length - 1];
        return (0, _constants_js__WEBPACK_IMPORTED_MODULE_26__ /* .resolveToolVerbByCase */.F_)(lastToolCall.call.tool.case, false);
      }, [uiConversationState]);
      // Debounce the tool verb to avoid flicker on very fast operations
      const [debouncedToolVerb, setDebouncedToolVerb] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(null);
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        if (!latestToolVerbRaw) {
          setDebouncedToolVerb(null);
          return;
        }
        const t = setTimeout(() => {
          setDebouncedToolVerb(latestToolVerbRaw);
        }, _constants_js__WEBPACK_IMPORTED_MODULE_26__ /* .TOOL_STATUS_VERB_DEBOUNCE_MS */.V2);
        return () => clearTimeout(t);
      }, [latestToolVerbRaw]);
      // Throttle token count display to reduce redraw churn
      const [displayedTokenEstimate, setDisplayedTokenEstimate] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(0);
      const lastTokenUpdateRef = (0, react__WEBPACK_IMPORTED_MODULE_13__.useRef)(0);
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        const now = Date.now();
        const minIntervalMs = _constants_js__WEBPACK_IMPORTED_MODULE_26__ /* .TOKEN_ESTIMATE_THROTTLE_MS */.Zx;
        const elapsed = now - lastTokenUpdateRef.current;
        if (elapsed >= minIntervalMs) {
          lastTokenUpdateRef.current = now;
          setDisplayedTokenEstimate(unshownTokenEstimate);
          return;
        }
        const id = setTimeout(() => {
          lastTokenUpdateRef.current = Date.now();
          setDisplayedTokenEstimate(unshownTokenEstimate);
        }, minIntervalMs - elapsed);
        return () => clearTimeout(id);
      }, [unshownTokenEstimate]);
      // Stable logout handler; avoid calling Hooks inline in JSX
      const handleLogoutCb = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, _commands_logout_js__WEBPACK_IMPORTED_MODULE_16__.handleLogout)(credentialManager, configProvider);
      }), [credentialManager, configProvider]);
      const {
        staticItems,
        dynamicItems
      } = (0, react__WEBPACK_IMPORTED_MODULE_13__.useMemo)(() => {
        return (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .partitionConversationState */.HE)(uiConversationState, debugInfo, {
          isRepository,
          folderMode: mode === "background" ? "git" : "cwd"
        });
      }, [uiConversationState, debugInfo, isRepository, mode]);
      const renderOptions = {
        hideUserMessages: false,
        isCompact: isCompact,
        isSuggestingPlan: isSuggestingPlan,
        isGenerating: isGenerating,
        planDecisionIndex: planDecisionIndex,
        shellManager: shellManager
      };
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Static */.jC, {
          items: staticItems,
          children: (item, _index) => {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
              marginTop: 1,
              flexDirection: "column",
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_conversation_static_item_js__WEBPACK_IMPORTED_MODULE_34__ /* .StaticItemComponent */.j, {
                item: item,
                options: renderOptions
              })
            }, `static-item-${item.key}`);
          }
        }), showStaticIndicator && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(StaticAboveDivider, {}), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
          flexDirection: "column",
          children: dynamicItems.map((item, _index) => {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
              marginTop: 1,
              flexDirection: "column",
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_conversation_dynamic_item_js__WEBPACK_IMPORTED_MODULE_33__ /* .DynamicItemComponent */.C, {
                item: item,
                options: renderOptions
              })
            }, item.key);
          })
        }), isResumingChat && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
          flexDirection: "column",
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
            flexDirection: "row",
            gap: 1,
            paddingTop: 2,
            paddingLeft: 2,
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
              width: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_21__ /* ["default"] */.A, {
                customInterval: 210,
                activeColor: "cyan"
              }, "resume-hex")
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
              flexDirection: "row",
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
                bold: true,
                children: "Loading conversation"
              })
            })]
          })
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
          flexDirection: "column",
          children: [process.env.AGENT_CLI_SESSION_WARNING_SANDBOX_UNSUPPORTED === "1" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
            marginX: 1,
            marginTop: 1,
            borderStyle: "round",
            borderColor: "yellow",
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
              color: "yellow",
              children: "Sandbox is not supported on this OS. Falling back to allowlist mode for this session."
            })
          }), lastStepThinkingContent && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
            paddingX: 2,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_index_js__WEBPACK_IMPORTED_MODULE_22__ /* .OverflowText */.Yl, {
              content: lastStepThinkingContent,
              maxLines: 5,
              padding: 4,
              color: "dim"
            })
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_prompt_bar_js__WEBPACK_IMPORTED_MODULE_24__ /* .PromptBar */.q, {
            isEmptyChat: uiConversationState.completedTurns.length === 0 && uiConversationState.pendingTurn === undefined,
            value: inputValue,
            onChange: value => {
              setInputValue(value);
            },
            onSubmit: handleInputSubmit,
            onSubmitShell: sendShellCommand,
            topStatusMarginTop: uiConversationState.pendingTurn !== undefined || uiConversationState.completedTurns.length > 0 ? inputMode === "plan-revision" ? 0 : 1 : 1,
            topStatus: isGenerating || isSummarizing ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
              flexDirection: "column",
              children: [queuedMessage && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
                marginBottom: 1,
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_last_n_lines_js__WEBPACK_IMPORTED_MODULE_23__ /* .LastNLines */.I, {
                  content: queuedMessage,
                  maxLines: 2,
                  color: "gray"
                })
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
                flexDirection: "row",
                gap: 1,
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
                  width: 1,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_21__ /* ["default"] */.A, {
                    customInterval: 210,
                    activeColor: "green"
                  }, "gen-hex")
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Box */.az, {
                  flexDirection: "row",
                  children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
                    bold: true,
                    children: (() => {
                      if (isThinkingActive) return "Thinking";
                      if (isSummarizing) return "Summarizing";
                      return debouncedToolVerb !== null && debouncedToolVerb !== void 0 ? debouncedToolVerb : "Generating";
                    })()
                  }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
                    bold: true,
                    children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_animated_dots_js__WEBPACK_IMPORTED_MODULE_18__ /* .AnimatedDots */.U, {})
                  })]
                }), (() => {
                  const label = (0, _utils_tokens_js__WEBPACK_IMPORTED_MODULE_43__ /* .formatTokenCount */.a)(displayedTokenEstimate);
                  return label ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .Text */.EY, {
                    dimColor: true,
                    children: [" ", label]
                  }) : null;
                })()]
              })]
            }) : null,
            inputMode: inputMode,
            isDisabled: isSendingToBackground,
            isProcessing: isProcessing,
            isSendingToBackground: isSendingToBackground,
            isRepository: isRepository,
            onCtrlC: onAbort,
            onRequestReview: onRequestReviewMode,
            slashCommands: slashCommands,
            externalCursorToEndSignal: externalCursorToEndSignal,
            onBeginRejection: id => {
              setPendingRejectionId(id);
              setInputValue("");
            },
            onResumeChat: onResumeChat,
            getChatId: getChatId,
            onSkipRejectionReason: () => {
              if (pendingRejectionId) {
                rejectPendingDecision(pendingRejectionId, undefined);
                setPendingRejectionId(null);
                setInputValue("");
              }
            },
            onCancelRejectionReason: () => {
              if (pendingRejectionId) {
                setPendingRejectionId(null);
                setInputValue("");
              }
            },
            onAddToAllowList: addToAllowList,
            onImagesUpdated: onImagesUpdated,
            onLogout: handleLogoutCb,
            onNewChat: onNewChat,
            onSummarize: onSummarize,
            rgPath: rgPath,
            isSuggestingPlan: isSuggestingPlan,
            planDecisionIndex: planDecisionIndex,
            onPlanDecisionIndexChange: setPlanDecisionIndex,
            onExecutePlan: executePlan,
            onDiscardPlan: onDiscardPlan,
            onRejectPlan: onRejectPlan
          })]
        }, "prompt")]
      });
    };
    const App = props => {
      var _a, _b;
      const {
        mode,
        viewMode,
        setViewMode,
        changedFiles,
        currentModel,
        pendingDecisions,
        agentStore,
        setAgentStore,
        setIsGenerating: setCtxIsGenerating,
        setIsSummarizing: setCtxIsSummarizing,
        isSummarizing,
        setInputValue,
        setQueuedMessage
      } = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_27__ /* .useAgentState */.C9)();
      const [uiConversationState, setUiConversationState] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(() => (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .createNewConversationState */.Du)());
      const [isCubeOpen, setIsCubeOpen] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(false);
      const isCompact = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_27__ /* .useIsCompact */.tO)();
      const {
        registerCommand,
        unregisterCommand
      } = (0, _context_slash_command_context_js__WEBPACK_IMPORTED_MODULE_29__ /* .useSlashCommandRegistry */.x)();
      const [uiSummary, setUiSummary] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(null);
      const isProcessingRef = (0, react__WEBPACK_IMPORTED_MODULE_13__.useRef)(false);
      const cancelCurrentRunRef = (0, react__WEBPACK_IMPORTED_MODULE_13__.useRef)(undefined);
      const conversationActionManagerRef = (0, react__WEBPACK_IMPORTED_MODULE_13__.useRef)(undefined);
      const [turnFileTracker] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(() => new _utils_turn_file_tracker_js__WEBPACK_IMPORTED_MODULE_44__ /* .TurnFileTracker */.k(props.fileChangeTracker));
      const processingType = (0, react__WEBPACK_IMPORTED_MODULE_13__.useMemo)(() => {
        var _a;
        if (isSummarizing) {
          (0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.debugLog)("processingType isSummarizing", isSummarizing);
          return "summary";
        }
        if (uiConversationState.pendingTurn === undefined) return false;
        if (uiConversationState.pendingTurn.type === "agent") {
          if (((_a = uiConversationState.pendingTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) === "plan") {
            return false;
          }
          return "agent";
        }
        if (uiConversationState.pendingTurn.type === "shell") {
          return "shell";
        }
        return false;
      }, [isSummarizing, uiConversationState.pendingTurn]);
      // Keep the ref in sync with the state
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        isProcessingRef.current = processingType;
      }, [processingType]);
      // setting this to true unmounts!
      const [hideUi, setHideUi] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(false);
      const [fullPageRefreshEpoch, _setFullPageRefreshEpoch] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(0);
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_8__ /* .useStdout */.t$)();
      const rerender = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)(runIntermediate => __awaiter(void 0, void 0, void 0, function* () {
        const {
          promise,
          resolve
        } = Promise.withResolvers();
        setHideUi(true);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
          yield runIntermediate();
          (0, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__ /* .clearScreen */.m)(stdout);
          setTimeout(() => {
            setHideUi(false);
            resolve();
          }, 10);
        }), 10);
        return promise;
      }), [stdout]);
      const setMode = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)(mode => {
        rerender(() => {
          setViewMode(mode);
        });
      }, [rerender, setViewMode]);
      // Register /sync-theme to force re-detection and full UI rerender
      const doSyncTheme = (0, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_31__ /* .useSyncTheme */.cb)();
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        const cmd = {
          id: "sync-theme",
          title: "Sync Theme",
          description: "Re-detect terminal theme and refresh UI",
          run: (_ctx, _args, slashCommandCtx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            try {
              yield doSyncTheme();
              yield rerender(() => {});
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: "Theme synced.",
                color: "green"
              }]]);
            } catch (_d) {
              (_c = slashCommandCtx.print) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx, [[{
                text: "Failed to sync theme.",
                color: "red"
              }]]);
            }
            slashCommandCtx.insertText("");
          })
        };
        registerCommand(cmd);
        return () => unregisterCommand("sync-theme");
      }, [registerCommand, unregisterCommand, doSyncTheme, rerender]);
      // Register /cube to show the full-screen spinner cube overlay
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        const cmd = {
          id: "cube",
          title: "Spinning Cube",
          description: "Show full-screen spinning cube overlay",
          run: (_ctx, _args, slashCommandCtx) => {
            var _a;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            rerender(() => setIsCubeOpen(true));
          }
        };
        registerCommand(cmd);
        return () => unregisterCommand("cube");
      }, [registerCommand, unregisterCommand, rerender]);
      // Trigger a full rerender when theme changes (skip initial mount)
      const isLightTheme = (0, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_31__ /* .useIsLightTheme */.pW)();
      const lastIsLightThemeRef = (0, react__WEBPACK_IMPORTED_MODULE_13__.useRef)(null);
      (0, _hooks_use_mounted_effect_js__WEBPACK_IMPORTED_MODULE_37__ /* .useMountedEffect */.H)(() => {
        if (lastIsLightThemeRef.current !== isLightTheme) {
          if (lastIsLightThemeRef.current !== null) {
            void rerender(() => {});
          }
          lastIsLightThemeRef.current = !!isLightTheme;
        }
      }, [isLightTheme]);
      // Force a remount when compact mode changes so layout can reflow cleanly
      (0, _hooks_use_mounted_effect_js__WEBPACK_IMPORTED_MODULE_37__ /* .useMountedEffect */.H)(() => {
        setHideUi(true);
        (0, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__ /* .clearScreen */.m)(stdout);
        setTimeout(() => {
          setHideUi(false);
        }, 10);
      }, [isCompact, stdout]);
      const [frozenCompletedTurnIds, setFrozenCompletedTurnIds] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(new Set());
      const [selectedImages, setSelectedImages] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)([]);
      const [isLoadingConversation, setIsLoadingConversation] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(false);
      const [externalCursorToEndSignal, setExternalCursorToEndSignal] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(0);
      // Background review: derive FileChange[] from background composer diffs
      const [backgroundReviewChanges, setBackgroundReviewChanges] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)([]);
      const isGenerating = processingType && uiConversationState.pendingTurn !== undefined && uiConversationState.pendingTurn.type === "agent" && ((_a = uiConversationState.pendingTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) !== "plan" && pendingDecisions.length === 0;
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        setCtxIsGenerating(isGenerating);
      }, [isGenerating, setCtxIsGenerating]);
      const [requestStartTime, setRequestStartTime] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(null);
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        const handleSigint = () => __awaiter(void 0, void 0, void 0, function* () {
          if (conversationActionManagerRef.current) {
            (0, _console_io_js__WEBPACK_IMPORTED_MODULE_45__ /* .intentionallyWriteToStderr */.p2)("\nAborting current operation...");
            yield conversationActionManagerRef.current.abort();
            return;
          }
          if (viewMode === "review") {
            setViewMode("chat");
            return;
          }
          process.exit(0);
        });
        process.on("SIGINT", handleSigint);
        return () => {
          process.off("SIGINT", handleSigint);
        };
      }, [viewMode, setViewMode]);
      // Initialize background composer selection from one-shot metadata to avoid
      // rendering the chat UI first (which would emit a static banner) before
      // switching to background view. This prevents duplicate banners.
      const [bcIdToShow, setBcIdToShow] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(() => {
        const presetBcId = props.agentStore.getMetadata("resumeBcId");
        if (typeof presetBcId === "string" && presetBcId.length > 0) {
          // Set background mode immediately and clear the one-shot metadata
          props.agentStore.setMetadata("mode", "background");
          props.agentStore.setMetadata("resumeBcId", "");
          return presetBcId;
        }
        return null;
      });
      const [isBackgroundPickerOpen, setIsBackgroundPickerOpen] = (0, react__WEBPACK_IMPORTED_MODULE_13__.useState)(false);
      const {
        sendToBackground,
        sendFollowupToBackground,
        isSubmitting: isSendingToBackground
      } = (0, _hooks_use_send_to_background_js__WEBPACK_IMPORTED_MODULE_38__ /* .useSendToBackground */.$)(props.backgroundComposerClient);
      const sendBackgroundMessage = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)(message => __awaiter(void 0, void 0, void 0, function* () {
        if (isSendingToBackground) {
          return;
        }
        // if we already have a bcId to show, add followup to it
        if (bcIdToShow) {
          yield sendFollowupToBackground(bcIdToShow, message, {
            // Attribute follow-ups correctly to CLI
            source: _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_12__ /* .BackgroundComposerSource */._b.CLI
          });
          return;
        }
        const results = yield sendToBackground(message);
        if (results.type === "success") {
          // do something about submitted
          const bcId = results.bcId;
          (0, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__ /* .clearScreen */.m)(stdout);
          setBcIdToShow(bcId);
          // Clear input and any selected images on successful background creation
          setInputValue("");
          setSelectedImages([]);
        } else {
          // todo: do something about this error
        }
      }), [bcIdToShow, isSendingToBackground, sendFollowupToBackground, sendToBackground, setInputValue, stdout]);
      const onSummarize = () => __awaiter(void 0, void 0, void 0, function* () {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.debugLog)("onSummarize");
        setCtxIsSummarizing(true);
        const ctx = props.ctx.withName("chat.summarize");
        yield sendConversationAction(ctx, new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ConversationAction */.QF({
          action: {
            case: "summarizeAction",
            value: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .SummarizeAction */.Sc()
          }
        }));
      });
      const executePlan = () => __awaiter(void 0, void 0, void 0, function* () {
        const env_1 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const requestSpan = __addDisposableResource(env_1, (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_7__ /* .createSpan */.VI)(props.ctx.withName("chat.execute-plan")), false);
          const requestCtx = requestSpan.ctx;
          const newTurnId = `turn-${Date.now()}`;
          turnFileTracker.startTurn(newTurnId);
          setUiConversationState(prev => (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeExecutePlan */.ti)(prev));
          // Send ExecutePlanAction
          const action = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ConversationAction */.QF({
            action: {
              case: "executePlanAction",
              value: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ExecutePlanAction */.x2()
            }
          });
          agentStore.setMetadata("mode", "default");
          yield sendConversationAction(requestCtx, action);
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources(env_1);
        }
      });
      const stopUiConversation = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)(() => {
        const convStruct = agentStore.getConversationStateStructure();
        const numTurns = convStruct.turns.length;
        let restoredInput = null;
        setUiConversationState(prev => {
          var _a;
          // Handle completion processing first
          let stateWithCompletedTurn = prev;
          if (prev.pendingTurn) {
            // Extract analytics data before completing the turn
            const pendingTurn = prev.pendingTurn;
            // Generate a turn ID for tracking (this might need to be passed in or derived differently)
            const turnId = `turn-${Date.now()}`;
            const turnFileChanges = turnFileTracker.finalizeTurn(turnId);
            // Calculate completion metrics
            let timeElapsed = 0;
            if (requestStartTime) {
              timeElapsed = Date.now() - requestStartTime;
            }
            const linesChanged = turnFileChanges.reduce((total, change) => {
              var _a, _b;
              return total + (((_a = change.after) === null || _a === void 0 ? void 0 : _a.split("\n").length) || 0) - (((_b = change.before) === null || _b === void 0 ? void 0 : _b.split("\n").length) || 0);
            }, 0);
            const filesChanged = turnFileChanges.length;
            if (pendingTurn.type === "agent") {
              const todosCompleted = pendingTurn.completedSteps.filter(step => step.type === "tool-call-group" && step.calls.some(call => call.call.tool.case === "updateTodosToolCall")).length;
              const toolsUsed = pendingTurn.completedSteps.filter(step => step.type === "tool-call-group").length;
              // Track request completion
              (0, _analytics_js__WEBPACK_IMPORTED_MODULE_14__ /* .trackEvent */.sx)("cli.request.completed", {
                lines_changed: linesChanged,
                files_changed: filesChanged,
                todos_completed: todosCompleted,
                tools_used: toolsUsed,
                time_elapsed_ms: timeElapsed,
                estimated_tokens: prev.liveTokens
              });
            }
            // Use the existing mergeTurnCompletion function
            stateWithCompletedTurn = (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeTurnCompletion */.Gv)(prev);
          }
          // Then abort any remaining pending state
          const abortedState = (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .abortConversationState */.RN)(stateWithCompletedTurn);
          (0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.debugLog)(`stopUiConversation: numTurns: ${numTurns}, abortedState.completedTurns.length: ${abortedState.completedTurns.length}, abortedState.pendingTurn: ${abortedState.pendingTurn ? "true" : "false"}`);
          // Handle truncation if needed to sync with agent store
          if (numTurns < abortedState.completedTurns.length + (abortedState.pendingTurn ? 1 : 0)) {
            // Need to truncate - extract input from the last turn if it's an incomplete agent turn
            const lastTurn = (_a = abortedState.pendingTurn) !== null && _a !== void 0 ? _a : abortedState.completedTurns[abortedState.completedTurns.length - 1];
            if ((lastTurn === null || lastTurn === void 0 ? void 0 : lastTurn.type) === "agent") {
              restoredInput = lastTurn.userMessage;
            }
            (0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.debugLog)(`stopUiConversation: lastTurn: ${lastTurn === null || lastTurn === void 0 ? void 0 : lastTurn.type}, restoredInput: ${restoredInput}`);
            // Truncate to match the agent store structure
            return (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .truncateUIConversationState */.P4)(abortedState, numTurns);
          }
          return abortedState;
        });
        setImmediate(() => {
          if (restoredInput) {
            const ri = restoredInput;
            setInputValue(old => old ? `${ri}\n${old}` : ri);
            setExternalCursorToEndSignal(s => s + 1);
          }
        });
        setCtxIsSummarizing(false);
        // Exit with code 0 if AGENT_CLI_EXIT_ON_COMPLETION is set
        if (process.env.AGENT_CLI_EXIT_ON_COMPLETION === "true") {
          setTimeout(() => process.exit(0), 10);
        }
      }, [agentStore, requestStartTime, setInputValue, setCtxIsSummarizing, turnFileTracker.finalizeTurn]);
      const sendConversationAction = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)((requestCtx, action) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (mode === "background" && action.action.case === "userMessageAction") {
          const userMessage = action.action.value;
          const text = (_a = userMessage.userMessage) === null || _a === void 0 ? void 0 : _a.text;
          if (text) {
            yield sendBackgroundMessage(text);
          }
          return;
        }
        const startTime = Date.now();
        setRequestStartTime(startTime);
        if (currentModel) {
          agentStore.setMetadata("lastUsedModel", currentModel.modelId);
        }
        let tokenCountsMarked = false;
        const [cancelCtx, cancelCurrentRun] = requestCtx.withCancel();
        // Create the conversation action manager for this run
        const conversationActionManager = new _anysphere_agent_core__WEBPACK_IMPORTED_MODULE_4__ /* .ControlledConversationActionManager */.hg();
        // Register abort callback to handle UI cleanup
        conversationActionManager.addAbortCallback(() => {
          setQueuedMessage("");
          // We only optimistically ctrl+c for agent
          if (isProcessingRef.current === "agent") {
            stopUiConversation();
          }
        });
        try {
          const interactionListener = {
            sendUpdate: (_ctx, update) => __awaiter(void 0, void 0, void 0, function* () {
              setUiConversationState(prev => {
                try {
                  return (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeInteractionUpdate */.as)(prev, update);
                } catch (e) {
                  if (e instanceof _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .MergeError */.VX) {
                    return prev;
                  }
                  throw e;
                }
              });
              if (update.type === "summary-started") {
                setCtxIsSummarizing(true);
                return;
              }
              if (update.type === "heartbeat") {
                return;
              }
              if (update.type === "summary-completed") {
                setCtxIsSummarizing(false);
                return;
              }
              if (update.type === "text-delta") {
                return;
              }
              if (update.type === "token-delta") {
                return;
              }
              if (update.type === "user-message-appended") {
                conversationActionManager.markMessageAsProcessed(update.userMessage);
                const newTurnId = `turn-${Date.now()}`;
                turnFileTracker.startTurn(newTurnId);
                // Clear any queued preview once it has been appended
                setQueuedMessage("");
                // reset live tokens for new turn
                return;
              }
              if (update.type === "tool-call-started" || update.type === "partial-tool-call") {
                // Track tool usage
                if (update.type === "tool-call-started") {
                  (0, _analytics_js__WEBPACK_IMPORTED_MODULE_14__ /* .trackEvent */.sx)("cli.request.tools.used", {
                    tool: update.toolCall.tool.case || "unknown",
                    count: 1
                  });
                }
                return;
              }
              if (update.type === "thinking-delta" || update.type === "thinking-completed") {
                if (!tokenCountsMarked) {
                  tokenCountsMarked = true;
                  (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_7__ /* .reportEvent */.HF)(requestCtx, "token_counts_visible");
                }
                return;
              }
              if (update.type === "summary") {
                rerender(() => {});
                setCtxIsSummarizing(false);
                return;
              }
            }),
            query: (_ctx, query) => __awaiter(void 0, void 0, void 0, function* () {
              switch (query.type) {
                case "web-search-request":
                  // TODO(balta): implement accept/reject for web search requests
                  return {
                    approved: false,
                    reason: "User Rejected"
                  };
                default:
                  {
                    // All other query types are not supported
                    const _exhaustiveCheck = query.type;
                    throw new Error(`Unhandled interaction query type: ${query.type}`);
                  }
              }
            })
          };
          try {
            cancelCurrentRunRef.current = cancelCurrentRun;
            conversationActionManagerRef.current = conversationActionManager;
            yield Promise.all([(0, _anysphere_agent_client__WEBPACK_IMPORTED_MODULE_3__ /* .hydrateRequestContext */.Oe)(requestCtx, action, props.resources), (0, _image_processing_js__WEBPACK_IMPORTED_MODULE_40__ /* .hydrateSelectedContext */.w)(action)]);
            yield props.agentClient.run(cancelCtx, agentStore.getConversationStateStructure(), action, yield props.modelManager.awaitCurrentModel(), interactionListener, props.resources, agentStore.getBlobStore(), conversationActionManager, agentStore, [],
            // Empty - tools are now provided via request context
            {
              conversationId: agentStore.getId(),
              headers: props.headers
            });
          } finally {
            cancelCurrentRunRef.current = undefined;
            conversationActionManagerRef.current = undefined;
          }
          setUiConversationState(prev => (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeTurnCompletion */.Gv)(prev));
        } catch (e) {
          stopUiConversation();
          throw e;
        }
      }), [agentStore, currentModel, mode, props.resources, props.modelManager.awaitCurrentModel, props.agentClient.run, sendBackgroundMessage, rerender, setCtxIsSummarizing, setQueuedMessage, stopUiConversation, turnFileTracker.startTurn, props.headers]);
      const sendMessage = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)((message, opts) => __awaiter(void 0, void 0, void 0, function* () {
        const env_2 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const requestSpan = __addDisposableResource(env_2, (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_7__ /* .createSpan */.VI)(props.ctx.withName("chat.request")), false);
          const requestCtx = requestSpan.ctx;
          (0, _analytics_js__WEBPACK_IMPORTED_MODULE_14__ /* .trackEvent */.sx)("cli.request.create", {
            length: message.length,
            model: (currentModel === null || currentModel === void 0 ? void 0 : currentModel.modelId) || "unknown"
          });
          if (!message.trim()) return;
          if (mode === "background") {
            yield sendBackgroundMessage(message);
            return;
          }
          if (conversationActionManagerRef.current) {
            // Keep a UI hint of the queued text
            setQueuedMessage(prev => {
              var _a;
              const display = (_a = opts === null || opts === void 0 ? void 0 : opts.display) !== null && _a !== void 0 ? _a : message;
              return prev ? `${prev}\n${display}` : display;
            });
            // Build a SelectedContext from currently selected images
            const imgs = yield (0, _image_processing_js__WEBPACK_IMPORTED_MODULE_40__ /* .processImages */.U)(selectedImages.map(i => i.path));
            const selectedCtx = new _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_11__ /* .SelectedContext */.xv({
              selectedImages: imgs
            });
            const action = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ConversationAction */.QF({
              action: {
                case: "userMessageAction",
                value: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .UserMessageAction */.Vt({
                  userMessage: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .UserMessage */.RG({
                    text: message,
                    selectedContext: selectedCtx,
                    messageId: crypto.randomUUID()
                  })
                })
              }
            });
            yield (0, _anysphere_agent_client__WEBPACK_IMPORTED_MODULE_3__ /* .hydrateRequestContext */.Oe)(requestCtx, action, props.resources);
            yield conversationActionManagerRef.current.submitConversationAction(action);
            setInputValue("");
            setSelectedImages([]);
            return;
          }
          if (uiConversationState.completedTurns.length === 0) {
            props.aiServerClient.nameAgent(new _anysphere_proto_agent_v1_agent_service_pb_js__WEBPACK_IMPORTED_MODULE_10__ /* .NameAgentRequest */.Il({
              userMessage: message
            })).then(resp => {
              agentStore.setMetadata("name", resp.name);
            }).catch(e => {
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.debugLog)(e);
            });
          }
          const turnId = `turn-${Date.now()}`;
          turnFileTracker.startTurn(turnId);
          setUiConversationState(prev => {
            var _a;
            return (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeCreateNewAgentTurn */.HG)(prev, (_a = opts === null || opts === void 0 ? void 0 : opts.display) !== null && _a !== void 0 ? _a : message);
          });
          const selectedCtx = new _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_11__ /* .SelectedContext */.xv({
            selectedImages: selectedImages.map(i => new _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_11__ /* .SelectedImage */.d({
              path: i.path
            }))
          });
          let action;
          if (mode === "plan") {
            action = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ConversationAction */.QF({
              action: {
                case: "startPlanAction",
                value: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .StartPlanAction */.ru({
                  userMessage: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .UserMessage */.RG({
                    text: message,
                    selectedContext: selectedCtx,
                    messageId: crypto.randomUUID()
                  })
                })
              }
            });
          } else {
            action = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ConversationAction */.QF({
              action: {
                case: "userMessageAction",
                value: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .UserMessageAction */.Vt({
                  userMessage: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .UserMessage */.RG({
                    text: message,
                    selectedContext: selectedCtx,
                    messageId: crypto.randomUUID()
                  })
                })
              }
            });
          }
          yield sendConversationAction(requestCtx, action);
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          __disposeResources(env_2);
        }
      }), [agentStore.setMetadata, currentModel === null || currentModel === void 0 ? void 0 : currentModel.modelId, mode, props.aiServerClient.nameAgent, props.ctx.withName, props.resources, selectedImages, sendBackgroundMessage, sendConversationAction, setInputValue,
      // Keep a UI hint of the queued text
      setQueuedMessage, turnFileTracker.startTurn, uiConversationState.completedTurns.length]);
      const sendShellCommand = command => __awaiter(void 0, void 0, void 0, function* () {
        const env_3 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const requestSpan = __addDisposableResource(env_3, (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_7__ /* .createSpan */.VI)(props.ctx.withName("chat.shell")), false);
          const requestCtx = requestSpan.ctx;
          const execId = crypto.randomUUID(); // Generate unique exec ID
          const action = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ShellCommandAction */.Ku({
            shellCommand: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ShellCommand */.oI({
              command
            }),
            execId
          });
          setUiConversationState(prev => (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeCreateNewShellTurn */.Yb)(prev, command));
          yield sendConversationAction(requestCtx, new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_9__ /* .ConversationAction */.QF({
            action: {
              case: "shellCommandAction",
              value: action
            }
          }));
        } catch (e_3) {
          env_3.error = e_3;
          env_3.hasError = true;
        } finally {
          __disposeResources(env_3);
        }
      });
      const abortAndClearPending = () => __awaiter(void 0, void 0, void 0, function* () {
        if (conversationActionManagerRef.current) {
          yield conversationActionManagerRef.current.abort();
        }
        props.pendingDecisionStore.clearAll();
      });
      const replaceAgentStore = (newStore, opts) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        // Reset file tracking state when switching sessions (new or resume)
        props.fileChangeTracker.clear();
        turnFileTracker.cleanup();
        setAgentStore(newStore);
        (_a = props.onAgentStoreChanged) === null || _a === void 0 ? void 0 : _a.call(props, newStore);
        if (opts.loadFromDb) {
          try {
            const conv = yield newStore.getFullConversation(props.ctx);
            // Only display conversation history if AGENT_CLI_LOAD_HISTORY is not "false"
            if (process.env.AGENT_CLI_LOAD_HISTORY !== "false") {
              setUiConversationState((0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .loadConversationState */.N1)(conv));
              setUiSummary((_c = (_b = conv.summary) === null || _b === void 0 ? void 0 : _b.summary) !== null && _c !== void 0 ? _c : "");
            } else {
              // Keep conversation state in agent store but don't display it
              setUiConversationState((0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .createNewConversationState */.Du)());
              setUiSummary(null);
            }
          } catch (_d) {
            setUiConversationState((0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .createNewConversationState */.Du)());
          }
        } else {
          setUiConversationState((0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .createNewConversationState */.Du)());
        }
        setQueuedMessage("");
        setInputValue("");
        setFrozenCompletedTurnIds(new Set());
      });
      const handleResumeChat = folderName => __awaiter(void 0, void 0, void 0, function* () {
        try {
          setIsLoadingConversation(true);
          setUiConversationState((0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .createNewConversationState */.Du)());
          yield abortAndClearPending();
          agentStore.dispose();
          const chatDir = node_path__WEBPACK_IMPORTED_MODULE_2___default().join((0, _state_index_js__WEBPACK_IMPORTED_MODULE_41__ /* .getChatsRootDir */.r)(), folderName);
          const dbPath = node_path__WEBPACK_IMPORTED_MODULE_2___default().join(chatDir, "store.db");
          const newSqlite = yield _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_42__ /* .SQLiteBlobStoreWithMetadata */.M.initAndLoad(dbPath);
          const newAgentStore = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_5__ /* .AgentStore */.pH(newSqlite, newSqlite);
          // Always load the conversation state for the agent to have context
          yield newAgentStore.resetFromDb(props.ctx);
          yield replaceAgentStore(newAgentStore, {
            loadFromDb: true
          });
          // Ensure execution mode is valid after resuming (clear any background/auto-run)
          newAgentStore.setMetadata("mode", "default");
          const lastUsedModel = newAgentStore.getMetadata("lastUsedModel");
          if (lastUsedModel) {
            yield props.modelManager.setModelFromStoredId(lastUsedModel, props.configProvider);
          }
        } finally {
          setIsLoadingConversation(false);
        }
      });
      const handleNewChat = () => __awaiter(void 0, void 0, void 0, function* () {
        yield abortAndClearPending();
        agentStore.dispose();
        const chatsRoot = (0, _state_index_js__WEBPACK_IMPORTED_MODULE_41__ /* .getChatsRootDir */.r)();
        const newId = (0, node_crypto__WEBPACK_IMPORTED_MODULE_1__.randomUUID)();
        const chatDir = node_path__WEBPACK_IMPORTED_MODULE_2___default().join(chatsRoot, newId);
        const dbPath = node_path__WEBPACK_IMPORTED_MODULE_2___default().join(chatDir, "store.db");
        const newSqlite = new _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_42__ /* .SQLiteBlobStoreWithMetadata */.M(dbPath);
        newSqlite.set("agentId", newId);
        const newAgentStore = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_5__ /* .AgentStore */.pH(newSqlite, newSqlite);
        yield replaceAgentStore(newAgentStore, {
          loadFromDb: false
        });
        const lastUsedModel = newAgentStore.getMetadata("lastUsedModel");
        yield props.modelManager.setModelFromStoredId(lastUsedModel, props.configProvider);
        yield rerender(() => {});
        return newId;
      });
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        const loadExistingConversation = () => __awaiter(void 0, void 0, void 0, function* () {
          (0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.debugLog)("Loading existing conversation");
          try {
            const struct = agentStore.getConversationStateStructure();
            if (struct.turns.length > 0 && uiConversationState.completedTurns.length === 0) {
              setIsLoadingConversation(true);
            }
            const conv = yield agentStore.getFullConversation(props.ctx);
            // Only display conversation history if AGENT_CLI_LOAD_HISTORY is not "false"
            if (process.env.AGENT_CLI_LOAD_HISTORY !== "false") {
              if (conv.summary) {
                setUiSummary(conv.summary.summary);
              }
              if (conv.turns.length > 0) {
                setUiConversationState((0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .loadConversationState */.N1)(conv));
              }
            }
          } finally {
            setIsLoadingConversation(false);
          }
        });
        void loadExistingConversation();
      }, [agentStore, props.ctx, uiConversationState.completedTurns.length]);
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        if (props.prompt) {
          void sendMessage(props.prompt);
        }
      }, [props.prompt, sendMessage]);
      const {
        responses,
        status,
        isLoadingDiffs: isLoadingBackgroundDiffs,
        addOptimisticFollowup,
        removeOptimisticFollowup,
        modelDetails,
        isAttached,
        isLoadingConversation: isLoadingBackgroundConversation,
        repoUrl,
        branchName,
        diffs
      } = (0, _hooks_use_attach_background_composer_js__WEBPACK_IMPORTED_MODULE_36__ /* .useAttachBackgroundComposer */.n)(props.backgroundComposerClient, bcIdToShow !== null && bcIdToShow !== void 0 ? bcIdToShow : null);
      const openBackgroundPicker = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)(() => {
        // If not in a git repo, do not allow switching to background mode via picker
        if (!props.isRepository) {
          return;
        }
        setIsBackgroundPickerOpen(true);
      }, [props.isRepository]);
      const handleRequestReviewMode = (0, react__WEBPACK_IMPORTED_MODULE_13__.useCallback)(() => {
        setMode("review");
        (0, _analytics_js__WEBPACK_IMPORTED_MODULE_14__ /* .trackEvent */.sx)("cli.review.enter");
      }, [setMode]);
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        if (bcIdToShow && diffs) {
          (0, _debug_js__WEBPACK_IMPORTED_MODULE_35__.debugLogJSON)("Setting background review changes", diffs);
          setBackgroundReviewChanges(diffs);
        } else {
          setBackgroundReviewChanges([]);
        }
      }, [bcIdToShow, diffs]);
      // Calculate background generating state for FileChangeReview
      const isBackgroundGenerating = (0, react__WEBPACK_IMPORTED_MODULE_13__.useMemo)(() => {
        if (!bcIdToShow) return false;
        const hasActiveThinking = (() => {
          const b = responses.bubbles;
          for (let i = b.length - 1; i >= 0; i--) {
            const bb = b[i];
            if (bb.type === "thinking") return !bb.isDone;
          }
          return false;
        })();
        const lastText = (() => {
          const b = responses.bubbles;
          for (let i = b.length - 1; i >= 0; i--) {
            const bb = b[i];
            if (bb.type === "text") return bb;
          }
          return undefined;
        })();
        return hasActiveThinking || lastText && !lastText.isDone || status === _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_12__ /* .BackgroundComposerStatus */.R6.RUNNING || status === _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_12__ /* .BackgroundComposerStatus */.R6.CREATING;
      }, [bcIdToShow, responses.bubbles, status]);
      if (isCubeOpen) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__ /* .AltScreen */.I, {
          clearScreenTrigger: fullPageRefreshEpoch,
          clearOnMount: true,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_cube_overlay_js__WEBPACK_IMPORTED_MODULE_19__ /* .CubeOverlay */.a, {
            onClose: () => {
              rerender(() => setIsCubeOpen(false));
            }
          })
        });
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__ /* .AltScreen */.I, {
        clearScreenTrigger: fullPageRefreshEpoch,
        clearOnMount: false,
        children: [!hideUi && !isBackgroundPickerOpen && viewMode === "review" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_file_change_review_js__WEBPACK_IMPORTED_MODULE_20__ /* .FileChangeReview */.Z, {
          fileChangeTracker: props.fileChangeTracker,
          changes: bcIdToShow ? backgroundReviewChanges : changedFiles,
          onExit: () => {
            setMode("chat");
          },
          onSubmitPrompt: v => {
            void sendMessage(v);
          },
          initialSelectedIndex: (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .computeLatestEditIndex */.b)(uiConversationState, changedFiles),
          isGenerating: bcIdToShow ? isBackgroundGenerating : undefined
        }), !hideUi && isBackgroundPickerOpen && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_25__ /* .UnifiedListPager */.W, {
          client: props.backgroundComposerClient,
          onClose: () => {
            rerender(() => {
              setIsBackgroundPickerOpen(false);
            });
          },
          onSelectBackground: pickedId => {
            // Guard: only allow background selection inside a git repo
            if (!props.isRepository) {
              rerender(() => {
                setIsBackgroundPickerOpen(false);
              });
              return;
            }
            rerender(() => {
              setIsBackgroundPickerOpen(false);
              setBcIdToShow(pickedId);
              props.agentStore.setMetadata("mode", "background");
            });
          },
          onSelectChat: folderName => {
            setViewMode("chat");
            setIsBackgroundPickerOpen(false);
            setBcIdToShow(null);
            rerender(() => {}).then(() => handleResumeChat(folderName));
          }
        }), !hideUi && !isBackgroundPickerOpen && viewMode === "chat" && bcIdToShow && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_background_js__WEBPACK_IMPORTED_MODULE_15__ /* .BackgroundApp */.y, {
          bcId: bcIdToShow,
          isAttached: isAttached,
          backgroundComposerClient: props.backgroundComposerClient,
          isRepository: props.isRepository,
          debugInfo: props.debugInfo,
          modelManager: props.modelManager,
          responses: responses,
          status: status,
          isLoadingConversation: isLoadingBackgroundConversation,
          addOptimisticFollowup: addOptimisticFollowup,
          removeOptimisticFollowup: removeOptimisticFollowup,
          modelDetails: modelDetails,
          repoUrl: repoUrl,
          branchName: branchName,
          onRequestReview: () => {
            setMode("review");
            (0, _analytics_js__WEBPACK_IMPORTED_MODULE_14__ /* .trackEvent */.sx)("cli.review.enter");
          },
          changes: backgroundReviewChanges,
          isLoadingDiffs: isLoadingBackgroundDiffs,
          onOpenComposerPicker: () => setIsBackgroundPickerOpen(true),
          onSwitchComposer: newId => {
            (0, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_17__ /* .clearScreen */.m)(stdout);
            setBcIdToShow(newId);
            props.agentStore.setMetadata("mode", "background");
          }
        }), !hideUi && !isBackgroundPickerOpen && !bcIdToShow && viewMode === "chat" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AnysphereAgentUIInner, Object.assign({}, props, {
          uiConversationState: uiConversationState,
          onRequestReviewMode: handleRequestReviewMode,
          onOpenBackgroundPicker: openBackgroundPicker,
          isProcessing: !!processingType,
          isSendingToBackground: isSendingToBackground,
          sendMessage: sendMessage,
          sendShellCommand: sendShellCommand,
          executePlan: executePlan,
          isSuggestingPlan: (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .isSuggestingPlan */.OE)(uiConversationState),
          planDecisionIndex: (_b = (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .getPlanDecisionIndex */.II)(uiConversationState)) !== null && _b !== void 0 ? _b : 0,
          setPlanDecisionIndex: decisionIndex => setUiConversationState((0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergePlanDecisionIndexChange */.k4)(uiConversationState, decisionIndex)),
          onAbort: () => {
            if (conversationActionManagerRef.current) {
              void conversationActionManagerRef.current.abort();
            }
          },
          frozenCompletedTurnIds: frozenCompletedTurnIds,
          setFrozenCompletedTurnIds: setFrozenCompletedTurnIds,
          isGenerating: isGenerating,
          unshownTokenEstimate: uiConversationState.liveTokens,
          onResumeChat: handleResumeChat,
          onNewChat: handleNewChat,
          getChatId: () => agentStore.getId(),
          onImagesUpdated: images => setSelectedImages(images),
          currentModel: currentModel,
          isResumingChat: isLoadingConversation,
          onSummarize: onSummarize,
          onRejectPlan: () => setUiConversationState(prev => (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeRejectPlan */.bE)(prev)),
          onDiscardPlan: () => {
            setUiConversationState(prev => (0, _anysphere_agent_ui_state__WEBPACK_IMPORTED_MODULE_6__ /* .mergeDiscardPlan */.cp)(prev));
          },
          uiSummary: uiSummary,
          externalCursorToEndSignal: externalCursorToEndSignal,
          mcpLoader: props.mcpLoader,
          shellManager: props.shellManager
        }))]
      });
    };
    const AnysphereAgentUI = props => {
      (0, react__WEBPACK_IMPORTED_MODULE_13__.useEffect)(() => {
        return () => {
          // Show the terminal cursor on unmount
          // (ESC[?25h is the ANSI code to show the cursor)
          process.stdout.write("\x1b[?25h");
        };
      }, []);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_config_context_js__WEBPACK_IMPORTED_MODULE_28__ /* .ConfigContextProvider */.t1, {
        configProvider: props.configProvider,
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_32__ /* .VimModeProvider */.l, {
          configProvider: props.configProvider,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_30__ /* .TerminalStateProvider */.rs, {
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_slash_command_context_js__WEBPACK_IMPORTED_MODULE_29__ /* .SlashCommandProvider */.E, {
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_theme_context_js__WEBPACK_IMPORTED_MODULE_31__ /* .ThemeProvider */.NP, {
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_27__ /* .AgentStateProvider */.oG, {
                  fileChangeTracker: props.fileChangeTracker,
                  pendingDecisionStore: props.pendingDecisionStore,
                  configProvider: props.configProvider,
                  initialViewMode: "chat",
                  initialAgentStore: props.agentStore,
                  modelManager: props.modelManager,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(App, Object.assign({}, props))
                })
              })
            })
          })
        })
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/