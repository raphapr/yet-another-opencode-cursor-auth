__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */y: () => (/* binding */BackgroundApp)
      /* harmony export */
    });
    /* unused harmony export runBackground */
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../proto/dist/generated/aiserver/v1/background_composer_pb.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../proto/dist/generated/aiserver/v1/tools_pb.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _components_animated_dots_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/animated-dots.tsx");
    /* harmony import */
    var _components_app_header_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/app-header.tsx");
    /* harmony import */
    var _components_background_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/components/background-edit-tool-ui.tsx");
    /* harmony import */
    var _components_background_prompt_bar_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/background-prompt-bar.tsx");
    /* harmony import */
    var _components_background_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/components/background-shell-tool-ui.tsx");
    /* harmony import */
    var _components_background_tool_group_ui_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/components/background-tool-group-ui.tsx");
    /* harmony import */
    var _components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/components/hexagon-loader.tsx");
    /* harmony import */
    var _components_markdown_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/components/markdown.tsx");
    /* harmony import */
    var _components_prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/components/prompt/ephemeral-lines-view.tsx");
    /* harmony import */
    var _components_step_container_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/components/step-container.tsx");
    /* harmony import */
    var _components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/components/user-message-ui.tsx");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _hooks_prompt_use_ephemeral_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./src/hooks/prompt/use-ephemeral.ts");
    /* harmony import */
    var _hooks_use_send_to_background_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./src/hooks/use-send-to-background.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_animated_dots_js__WEBPACK_IMPORTED_MODULE_5__, _components_app_header_js__WEBPACK_IMPORTED_MODULE_6__, _components_background_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__, _components_background_prompt_bar_js__WEBPACK_IMPORTED_MODULE_8__, _components_background_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__, _components_background_tool_group_ui_js__WEBPACK_IMPORTED_MODULE_10__, _components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_11__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_12__, _components_prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_13__, _components_step_container_js__WEBPACK_IMPORTED_MODULE_14__, _components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_15__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_animated_dots_js__WEBPACK_IMPORTED_MODULE_5__, _components_app_header_js__WEBPACK_IMPORTED_MODULE_6__, _components_background_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__, _components_background_prompt_bar_js__WEBPACK_IMPORTED_MODULE_8__, _components_background_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__, _components_background_tool_group_ui_js__WEBPACK_IMPORTED_MODULE_10__, _components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_11__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_12__, _components_prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_13__, _components_step_container_js__WEBPACK_IMPORTED_MODULE_14__, _components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_15__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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

    // import { estimateBufferedTokens, formatTokenCount } from "./utils/tokens.js";
    const mergeBackgroundItems = bubbles => {
      const computed = [];
      const toolsToIsolate = new Set([_anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .ClientSideToolV2 */.XaY.EDIT_FILE, _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .ClientSideToolV2 */.XaY.EDIT_FILE_V2]);
      const accumulatedToolCalls = [];
      const flushAccumulatedToolCalls = () => {
        if (accumulatedToolCalls.length === 0) return;
        computed.push({
          type: "tool-group",
          // Clone to avoid later mutations clearing previously pushed groups
          toolCalls: [...accumulatedToolCalls],
          index: computed.length
        });
        accumulatedToolCalls.length = 0;
      };
      for (let c = 0; c < bubbles.length; c++) {
        const bubble = bubbles[c];
        if (bubble.type === "text") {
          // we do not want to include streaming-in text
          if (!bubble.isDone) continue;
          flushAccumulatedToolCalls();
          computed.push({
            type: "markdown",
            text: bubble.text,
            index: c
          });
        } else if (bubble.type === "tool") {
          if (toolsToIsolate.has(bubble.toolCall.tool)) {
            if (accumulatedToolCalls.length > 0) {
              flushAccumulatedToolCalls();
            }
            computed.push({
              type: "individual-tool",
              call: bubble.toolCall,
              result: bubble.toolResult,
              index: c
            });
          } else {
            accumulatedToolCalls.push({
              call: bubble.toolCall,
              result: bubble.toolResult
            });
          }
        } else if (bubble.type === "user") {
          flushAccumulatedToolCalls();
          computed.push({
            type: "user-message",
            content: bubble.text,
            index: c
          });
        }
      }
      flushAccumulatedToolCalls();
      return computed;
    };
    const BackgroundApp = ({
      bcId,
      isAttached,
      backgroundComposerClient,
      isRepository,
      debugInfo,
      modelManager,
      modelDetails,
      responses,
      status,
      isLoadingConversation,
      addOptimisticFollowup,
      removeOptimisticFollowup,
      repoUrl,
      branchName,
      onRequestReview,
      onOpenComposerPicker,
      onSwitchComposer,
      changes: reviewChanges,
      isLoadingDiffs
    }) => {
      const {
        sendFollowupToBackground,
        isSubmittingFollowup
      } = (0, _hooks_use_send_to_background_js__WEBPACK_IMPORTED_MODULE_19__ /* .useSendToBackground */.$)(backgroundComposerClient);
      // TODO: potentially model wouldn't exist in cli but exists outside
      const normalizedModelLabel = (0, react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
        var _a, _b;
        if (!modelDetails || !modelDetails.modelName) return undefined;
        return (_b = (_a = modelManager.normalizeModelId(modelDetails.modelName)) === null || _a === void 0 ? void 0 : _a.displayName) !== null && _b !== void 0 ? _b : modelDetails.modelName;
      }, [modelDetails, modelManager]);
      const [inputValue, setInputValue] = (0, react__WEBPACK_IMPORTED_MODULE_4__.useState)("");
      const ephemeral = (0, _hooks_prompt_use_ephemeral_js__WEBPACK_IMPORTED_MODULE_18__ /* .useEphemeral */.N)();
      // Nudge server to wake any hibernating background agent session for this bcId
      (0, react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
        if (!bcId) return;
        try {
          void backgroundComposerClient.notifyBackgroundComposerShown({
            bcId
          }, {
            timeoutMs: 10000
          }).catch(() => {});
        } catch (_a) {
          // ignore
        }
      }, [bcId, backgroundComposerClient]);
      // Minimal slash commands for background mode (temporary)
      const slashCommands = (0, react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
        const cmds = [];
        cmds.push({
          id: "list",
          title: "List Sessions",
          description: "Open the picker or switch by id with '/list <id>'",
          args: [{
            id: "id",
            required: false
          }],
          run: (_ctx, args) => {
            const targetId = (args[0] || "").trim();
            if (targetId) {
              onSwitchComposer === null || onSwitchComposer === void 0 ? void 0 : onSwitchComposer(targetId);
            } else {
              onOpenComposerPicker === null || onOpenComposerPicker === void 0 ? void 0 : onOpenComposerPicker();
            }
            setInputValue("");
          }
        });
        cmds.push({
          id: "switch",
          title: "Switch Background",
          description: "Switch to a background agent by id",
          args: [{
            id: "id",
            required: true
          }],
          run: (_ctx, args) => {
            const targetId = (args[0] || "").trim();
            if (!targetId) return;
            onSwitchComposer === null || onSwitchComposer === void 0 ? void 0 : onSwitchComposer(targetId);
            setInputValue("");
          }
        });
        return cmds;
      }, [onOpenComposerPicker, onSwitchComposer]);
      const {
        itemsToDisplay,
        firstLiveStepIndex
      } = (0, react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
        const merged = mergeBackgroundItems(responses.bubbles);
        const computed = [{
          type: "header",
          debugInfo: debugInfo,
          index: 1
        }];
        for (let i = 0; i < merged.length; i++) {
          computed.push(Object.assign(Object.assign({}, merged[i]), {
            index: computed.length
          }));
        }
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_17__.debugLogJSON)("computed", computed);
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_17__.debugLogJSON)("responses", responses);
        // Avoid printing any static content before attachment; otherwise when
        // attachment flips and we freeze items, previously printed static items
        // (like the banner) will be duplicated by Ink's Static.
        let firstIdx = 0;
        if (isAttached) {
          for (let i = 0; i < computed.length; i++) {
            const item = computed[i];
            switch (item.type) {
              case "header":
              case "markdown":
              case "user-message":
              case "individual-tool":
                break;
              case "tool-group":
                // we don't want to include this if we're the last item
                if (i === computed.length - 1) {
                  firstIdx = i;
                  break;
                }
                break;
              default:
                throw new Error(`Unhandled UIBackgroundItem`);
            }
            if (firstIdx !== -1) {
              break;
            }
          }
          // If nothing requires live rendering, freeze the entire list
          firstIdx = computed.length;
        }
        return {
          itemsToDisplay: computed,
          firstLiveStepIndex: firstIdx
        };
      }, [responses, debugInfo, isAttached]);
      const renderBackgroundItem = item => {
        var _a, _b, _c, _d, _e, _f, _g;
        const shouldPadTop = item.index > 0 && (((_a = itemsToDisplay[item.index - 1]) === null || _a === void 0 ? void 0 : _a.type) === "individual-tool" || ((_b = itemsToDisplay[item.index - 1]) === null || _b === void 0 ? void 0 : _b.type) === "tool-group" || ((_c = itemsToDisplay[item.index - 1]) === null || _c === void 0 ? void 0 : _c.type) === "markdown");
        switch (item.type) {
          case "header":
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_app_header_js__WEBPACK_IMPORTED_MODULE_6__ /* .AppHeader */.j, {
              isBackground: true,
              debugInfo: item.debugInfo || undefined,
              isRepository: isRepository,
              folderMode: "git",
              locationDisplayOverride: repoUrl,
              branchDisplayOverride: branchName
            });
          case "markdown":
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_step_container_js__WEBPACK_IMPORTED_MODULE_14__ /* .StepContainer */.C, {
              shouldPadTop: shouldPadTop,
              paddingRight: 4,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_markdown_js__WEBPACK_IMPORTED_MODULE_12__ /* .Markdown */.oz, {
                content: item.text
              })
            });
          case "user-message":
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              paddingLeft: _constants_js__WEBPACK_IMPORTED_MODULE_16__ /* .AGENT_CONVERSATION_MARGIN_LEFT */.rd,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_user_message_ui_js__WEBPACK_IMPORTED_MODULE_15__ /* .UserMessageUI */.H, {
                content: item.content
              })
            });
          case "individual-tool":
            {
              const tool = item.call.tool;
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_17__.debugLog)("tool", _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .ClientSideToolV2 */.XaY[tool]);
              if (tool === _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .ClientSideToolV2 */.XaY.EDIT_FILE || tool === _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .ClientSideToolV2 */.XaY.EDIT_FILE_V2) {
                let result;
                if (((_d = item.result) === null || _d === void 0 ? void 0 : _d.result.case) === "editFileResult") {
                  result = item.result.result.value;
                }
                const itemParams = item.call.params;
                let rawPath;
                if (itemParams.case === "editFileParams") {
                  rawPath = itemParams.value.relativeWorkspacePath;
                } else {
                  rawPath = itemParams.value.relativeWorkspacePath;
                }
                const stripWorkspacePath = rawPath.startsWith("/workspace/") ? rawPath.slice("/workspace/".length) : rawPath;
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                  paddingLeft: _constants_js__WEBPACK_IMPORTED_MODULE_16__ /* .AGENT_CONVERSATION_MARGIN_LEFT */.rd,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_step_container_js__WEBPACK_IMPORTED_MODULE_14__ /* .StepContainer */.C, {
                    shouldPadTop: shouldPadTop,
                    children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_background_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_7__ /* .BackgroundEditToolUI */.l, {
                      path: stripWorkspacePath,
                      result: result
                    })
                  })
                });
              }
              if (tool === _anysphere_proto_aiserver_v1_tools_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .ClientSideToolV2 */.XaY.RUN_TERMINAL_COMMAND_V2) {
                const paramsOneof = item.call.params;
                const callParams = paramsOneof.case === "runTerminalCommandV2Params" ? paramsOneof.value : undefined;
                const cmd = (_e = callParams === null || callParams === void 0 ? void 0 : callParams.command) !== null && _e !== void 0 ? _e : "";
                const cwd = (_f = callParams === null || callParams === void 0 ? void 0 : callParams.cwd) !== null && _f !== void 0 ? _f : undefined;
                let runResult;
                if (((_g = item.result) === null || _g === void 0 ? void 0 : _g.result.case) === "runTerminalCommandV2Result") {
                  runResult = item.result.result.value;
                }
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                  paddingLeft: _constants_js__WEBPACK_IMPORTED_MODULE_16__ /* .AGENT_CONVERSATION_MARGIN_LEFT */.rd,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_step_container_js__WEBPACK_IMPORTED_MODULE_14__ /* .StepContainer */.C, {
                    shouldPadTop: shouldPadTop,
                    children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_background_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_9__ /* .BackgroundShellToolUI */.d, {
                      command: cmd,
                      cwd: cwd,
                      result: runResult
                    })
                  })
                });
              }
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                paddingLeft: _constants_js__WEBPACK_IMPORTED_MODULE_16__ /* .AGENT_CONVERSATION_MARGIN_LEFT */.rd,
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_step_container_js__WEBPACK_IMPORTED_MODULE_14__ /* .StepContainer */.C, {
                  shouldPadTop: shouldPadTop,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                    children: ["Tool: ", item.call.tool]
                  })
                })
              });
            }
          case "tool-group":
            {
              const isLastItem = item.index === itemsToDisplay.length - 1;
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                paddingLeft: _constants_js__WEBPACK_IMPORTED_MODULE_16__ /* .AGENT_CONVERSATION_MARGIN_LEFT */.rd,
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_step_container_js__WEBPACK_IMPORTED_MODULE_14__ /* .StepContainer */.C, {
                  shouldPadTop: shouldPadTop,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_background_tool_group_ui_js__WEBPACK_IMPORTED_MODULE_10__ /* .BackgroundToolGroupUI */.i, {
                    toolCalls: item.toolCalls,
                    forceCompleted: !isLastItem
                  })
                })
              });
            }
          default:
            throw new Error(`Unhandled UIBackgroundItem`);
        }
      };
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Static */.jC, {
          items: itemsToDisplay.slice(0, firstLiveStepIndex),
          children: item => {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              children: renderBackgroundItem(item)
            }, `static-bg-item-${item.index}`);
          }
        }), firstLiveStepIndex < itemsToDisplay.length && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          children: itemsToDisplay.slice(firstLiveStepIndex).map(item => {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              children: renderBackgroundItem(item)
            }, `live-bg-item-${item.index}`);
          })
        }), (isLoadingConversation || isLoadingDiffs && status !== _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .BackgroundComposerStatus */.R6.CREATING) && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "row",
            gap: 1,
            paddingTop: isLoadingConversation ? 2 : 0,
            paddingLeft: 2,
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              width: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_11__ /* ["default"] */.A, {
                customInterval: 210,
                activeColor: "cyan"
              }, "bg-load-hex")
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexDirection: "row",
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                bold: true,
                children: isLoadingConversation ? "Loading conversation" : "Loading diffs"
              })
            })]
          })
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_background_prompt_bar_js__WEBPACK_IMPORTED_MODULE_8__ /* .BackgroundPromptBar */.m, {
            prompt: inputValue,
            setPrompt: setInputValue,
            onSubmit: value => {
              const raw = value.trim();
              if (!raw) return;
              if (!bcId) return;
              const toSend = raw;
              const optimisticId = addOptimisticFollowup(toSend);
              void sendFollowupToBackground(bcId, toSend, {
                synchronous: true,
                bubbleId: optimisticId
              }).then(result => {
                if (result.type === "error") {
                  removeOptimisticFollowup(optimisticId);
                }
              }).catch(() => {
                removeOptimisticFollowup(optimisticId);
              });
              setInputValue("");
            },
            isDisabled: !bcId,
            isProcessing: false,
            topStatusMarginTop: itemsToDisplay.length > 0 ? 3 : 1,
            topStatus: (() => {
              const hasActiveThinking = (() => {
                const b = responses.bubbles;
                for (let i = b.length - 1; i >= 0; i--) {
                  const bb = b[i];
                  if (bb.type === "thinking") return !bb.isDone;
                }
                return false;
              })();
              const isGeneratingLike = hasActiveThinking || status === _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .BackgroundComposerStatus */.R6.RUNNING || status === _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .BackgroundComposerStatus */.R6.CREATING;
              if (isSubmittingFollowup || isGeneratingLike) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                  flexDirection: "row",
                  gap: 1,
                  children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                    width: 1,
                    children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_hexagon_loader_js__WEBPACK_IMPORTED_MODULE_11__ /* ["default"] */.A, {
                      customInterval: 210,
                      activeColor: "green"
                    }, "bg-gen-hex")
                  }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                    flexDirection: "row",
                    children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                      bold: true,
                      children: isSubmittingFollowup ? "Pending" : hasActiveThinking ? "Thinking" : status === _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .BackgroundComposerStatus */.R6.RUNNING ? "Generating" : "Starting VM"
                    }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                      bold: true,
                      children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_animated_dots_js__WEBPACK_IMPORTED_MODULE_5__ /* .AnimatedDots */.U, {})
                    })]
                  })]
                });
              }
              return null;
            })(),
            modelLabel: normalizedModelLabel,
            branchName: branchName,
            repoUrl: repoUrl,
            onRequestReview: onRequestReview,
            bcId: bcId,
            changes: reviewChanges,
            isLoadingDiffs: isLoadingDiffs,
            slashCommands: slashCommands,
            backgroundComposerClient: backgroundComposerClient,
            printEphemeral: (lines, options) => ephemeral.set(lines, options)
          })
        }, "prompt"), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_prompt_ephemeral_lines_view_js__WEBPACK_IMPORTED_MODULE_13__ /* ["default"] */.A, {
          lines: ephemeral.lines
        })]
      });
    };
    function runBackground(_opts) {
      return __awaiter(this, void 0, void 0, function* () {
        const {
          waitUntilExit
        } = render(_jsx(Box, {
          children: _jsx(Text, {
            children: "Hello"
          })
        }));
        yield waitUntilExit();
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/