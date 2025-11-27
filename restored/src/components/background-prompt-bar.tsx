__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */m: () => (/* binding */BackgroundPromptBar)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _console_io_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/console-io.ts");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/context/vim-mode-context.tsx");
    /* harmony import */
    var _hooks_prompt_use_at_palette_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/hooks/prompt/use-at-palette.ts");
    /* harmony import */
    var _hooks_prompt_use_slash_palette_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/hooks/prompt/use-slash-palette.ts");
    /* harmony import */
    var _hooks_use_background_actions_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/hooks/use-background-actions.ts");
    /* harmony import */
    var _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/prompt/decision-dropdown.tsx");
    /* harmony import */
    var _prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/components/prompt/palette-at-list.tsx");
    /* harmony import */
    var _prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/components/prompt/palette-slash-list.tsx");
    /* harmony import */
    var _prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/components/prompt/prompt-footer.tsx");
    /* harmony import */
    var _text_input_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/components/text-input.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_8__, _prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_9__, _prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_10__, _prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_11__, _text_input_js__WEBPACK_IMPORTED_MODULE_12__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_8__, _prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_9__, _prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_10__, _prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_11__, _text_input_js__WEBPACK_IMPORTED_MODULE_12__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    const BackgroundPromptBar = ({
      prompt,
      setPrompt,
      onSubmit: onSubmitProp,
      topStatus,
      topStatusMarginTop,
      isDisabled = false,
      isProcessing = false,
      modelLabel = "Loading...",
      placeholder = "Add a follow-up",
      promptSymbol = "→",
      branchName,
      onRequestReview,
      bcId,
      changes,
      slashCommands = [],
      backgroundComposerClient,
      printEphemeral
    }) => {
      var _a;
      const {
        exit
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useApp */.nm)();
      const [exitMode, setExitMode] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      const [shouldRender, setShouldRender] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
      const {
        vimEnabled,
        mode: vimMode
      } = (0, _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_4__ /* .useVimMode */.v)();
      const changedFilesCount = (_a = changes === null || changes === void 0 ? void 0 : changes.length) !== null && _a !== void 0 ? _a : 0;
      const [cursorToEndSignal, setCursorToEndSignal] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      // Dynamic placeholder that surfaces useful slash commands when there are diffs
      const computedPlaceholder = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => {
        if (changedFilesCount > 0) {
          const hint = "Try /apply-changes-locally or /checkout-locally";
          return placeholder ? `${placeholder} — ${hint}` : hint;
        }
        return placeholder;
      }, [placeholder, changedFilesCount]);
      // Minimal confirm state & presenter (PromptBar-styled, blocking)
      const [confirmActive, setConfirmActive] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      const [confirmTitle, setConfirmTitle] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)("");
      const [confirmDetail, setConfirmDetail] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(undefined);
      const [continueLabel, setContinueLabel] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)("Continue");
      const [cancelLabel, setCancelLabel] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)("Cancel");
      const confirmResolverRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      const [confirmIndex, setConfirmIndex] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      const askConfirm = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(opts => {
        return new Promise(resolve => {
          var _a, _b;
          setConfirmTitle(opts.title);
          setConfirmDetail(opts.detail);
          setContinueLabel((_a = opts.continueLabel) !== null && _a !== void 0 ? _a : "Continue");
          setCancelLabel((_b = opts.cancelLabel) !== null && _b !== void 0 ? _b : "Cancel");
          confirmResolverRef.current = resolve;
          setConfirmIndex(0);
          setConfirmActive(true);
        });
      }, []);
      // Expose confirmation only internally; parent does not need to manage it.
      // @ palette support (files)
      const at = (0, _hooks_prompt_use_at_palette_js__WEBPACK_IMPORTED_MODULE_5__ /* .useAtPalette */.g)(prompt);
      // / palette support (slash commands) with built-in background actions
      const backgroundActions = (0, _hooks_use_background_actions_js__WEBPACK_IMPORTED_MODULE_7__ /* .useBackgroundActions */.V)(backgroundComposerClient);
      const builtinCommands = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => {
        const diffActions = changes && changes.length > 0 ? [{
          id: "checkout-locally",
          title: "Checkout Locally",
          description: "Check out the current background agent's branch",
          run: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!bcId) {
              printEphemeral === null || printEphemeral === void 0 ? void 0 : printEphemeral([[{
                text: "error:",
                color: "red",
                bold: true
              }, {
                text: " No active background agent"
              }]]);
              return;
            }
            printEphemeral === null || printEphemeral === void 0 ? void 0 : printEphemeral([[{
              text: "⟲ ",
              color: "cyan"
            }, {
              text: "Preparing checkout…",
              dim: true
            }]]);
            setPrompt("");
            try {
              yield backgroundActions.checkoutLocally(bcId, {
                print: printEphemeral,
                confirm: askConfirm
              });
            } catch (e) {
              printEphemeral === null || printEphemeral === void 0 ? void 0 : printEphemeral([[{
                text: "error:",
                color: "red",
                bold: true
              }, {
                text: ` ${e instanceof Error ? e.message : String(e)}`
              }]]);
            }
          })
        }, {
          id: "apply-changes-locally",
          title: "Apply Changes Locally",
          description: "Apply this background agent's diffs into the working tree",
          run: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!bcId) {
              printEphemeral === null || printEphemeral === void 0 ? void 0 : printEphemeral([[{
                text: "error:",
                color: "red",
                bold: true
              }, {
                text: " No active background agent"
              }]]);
              return;
            }
            printEphemeral === null || printEphemeral === void 0 ? void 0 : printEphemeral([[{
              text: "⟲ ",
              color: "cyan"
            }, {
              text: "Merging changes… (conflicts will be shown)",
              dim: true
            }]]);
            setPrompt("");
            try {
              yield backgroundActions.applyChangesLocally(bcId, {
                print: printEphemeral,
                confirm: askConfirm
              });
            } catch (e) {
              printEphemeral === null || printEphemeral === void 0 ? void 0 : printEphemeral([[{
                text: "error:",
                color: "red",
                bold: true
              }, {
                text: ` ${e instanceof Error ? e.message : String(e)}`
              }]]);
            }
          })
        }] : [];
        return [...diffActions];
      }, [bcId, backgroundActions, askConfirm, printEphemeral, setPrompt, changes]);
      const allSlashCommands = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => [...slashCommands, ...builtinCommands], [slashCommands, builtinCommands]);
      const slash = (0, _hooks_prompt_use_slash_palette_js__WEBPACK_IMPORTED_MODULE_6__ /* .useSlashPalette */.e)(prompt, allSlashCommands, {
        insertText: setPrompt
      });
      const paletteVisible = at.active || slash.active;
      const acceptAtExpansion = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(value => {
        const rebuilt = at.acceptExpansion(value);
        if (rebuilt != null && rebuilt !== value) {
          setPrompt(rebuilt);
          setCursorToEndSignal(s => s + 1);
          return rebuilt;
        }
        return null;
      }, [at, setPrompt]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (!exitMode) return;
        const t = setTimeout(() => setExitMode(false), 1500);
        return () => clearTimeout(t);
      }, [exitMode]);
      const handleExit = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((_isLogout = false) => {
        // Hide the prompt/footer before quitting so any exit hints are cleared
        setShouldRender(false);
        setTimeout(() => {
          // Print deep link when detaching; background continues running
          if (bcId) {
            const link = `https://cursor.com/agents?selectedBcId=${bcId}`;
            (0, _console_io_js__WEBPACK_IMPORTED_MODULE_13__ /* .intentionallyWriteToStderr */.p2)(`\n  \x1b[90mOpen Background Agent in:\x1b[0m \x1b[1m\x1b[36m${link}\x1b[0m`);
          }
          // clean exit
          exit();
          process.exit(0);
        }, 100);
      }, [bcId, exit]);
      const handleCtrlC = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
        // Clear input first if there's any text; do not abort yet
        if (prompt.length > 0) {
          setPrompt("");
          return;
        }
        if (exitMode) {
          // Clear the input so we do not leave a partially typed command on screen, but retain exitMode so border stays gray.
          setPrompt("");
          handleExit();
        } else {
          setExitMode(true);
        }
      }, [prompt.length, exitMode, setPrompt, handleExit]);
      const handleCtrlR = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
        if (changedFilesCount > 0) {
          onRequestReview === null || onRequestReview === void 0 ? void 0 : onRequestReview();
        }
      }, [changedFilesCount, onRequestReview]);
      const handleCtrlD = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
        // Immediate detach/quit: clear input and exit
        setPrompt("");
        handleExit();
      }, [handleExit, setPrompt]);
      // Arrow navigation and dismiss for the @ palette, plus confirm handling
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useInput */.Ge)((input, key) => {
        if (confirmActive) {
          // Decision UI: Up/Down to choose, Enter/"y" to continue, Esc/"n"/Ctrl+C to cancel
          if (key.downArrow || input === "j" || input === "J") {
            setConfirmIndex(i => Math.min(i + 1, 1));
            return;
          }
          if (key.upArrow || input === "k" || input === "K") {
            setConfirmIndex(i => Math.max(i - 1, 0));
            return;
          }
          if (key.escape || key.ctrl && input === "c" || input === "n" || input === "N") {
            const r = confirmResolverRef.current;
            confirmResolverRef.current = null;
            setConfirmActive(false);
            r === null || r === void 0 ? void 0 : r(false);
            return;
          }
          if (key.return) {
            const r = confirmResolverRef.current;
            const accept = confirmIndex === 0;
            confirmResolverRef.current = null;
            setConfirmActive(false);
            r === null || r === void 0 ? void 0 : r(accept);
            return;
          }
          if (input === "y" || input === "Y") {
            const r = confirmResolverRef.current;
            confirmResolverRef.current = null;
            setConfirmActive(false);
            r === null || r === void 0 ? void 0 : r(true);
            return;
          }
          // Consume other keys while active
          return;
        }
        // Slash palette navigation
        if (slash.active && slash.items.length > 0) {
          if (key.downArrow) {
            slash.next();
            return;
          }
          if (key.upArrow) {
            slash.prev();
            return;
          }
          if (key.escape) {
            slash.hide();
            return;
          }
        }
        // At palette navigation
        if (at.active && at.suggestions.length > 0) {
          if (key.downArrow) {
            at.next();
            return;
          }
          if (key.upArrow) {
            at.prev();
            return;
          }
          if (key.escape) {
            at.suppress();
            return;
          }
        }
      }, {
        isActive: confirmActive || at.active || slash.active
      });
      const parseSlashInput = input => {
        if (!input.startsWith("/")) return null;
        const term = input.slice(1);
        const parts = term.split(/\s+/).filter(Boolean);
        const cmdId = parts[0] || "";
        const args = parts.slice(1);
        const cmd = allSlashCommands.find(c => c.id.toLowerCase() === cmdId.toLowerCase());
        const required = ((cmd === null || cmd === void 0 ? void 0 : cmd.args) || []).filter(a => a.required !== false).length;
        return {
          cmdId,
          args,
          required,
          hasCmd: !!cmd
        };
      };
      const isSlashReady = input => {
        const parsed = parseSlashInput(input);
        return Boolean((parsed === null || parsed === void 0 ? void 0 : parsed.hasCmd) && parsed.args.length >= parsed.required);
      };
      if (!shouldRender) {
        return null;
      }
      if (isDisabled) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          borderColor: "foreground",
          borderTop: true,
          borderStyle: "single",
          paddingLeft: 1,
          marginX: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "row",
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              children: "Input disabled"
            })
          })
        });
      }
      const shouldShowTopStatus = !confirmActive && topStatus;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginTop: topStatusMarginTop !== null && topStatusMarginTop !== void 0 ? topStatusMarginTop : 0,
          marginBottom: 0,
          marginX: 1,
          paddingLeft: 1,
          children: shouldShowTopStatus ? topStatus : null
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          borderColor: confirmActive ? "yellow" : "foreground",
          borderTop: true,
          borderStyle: "single",
          paddingLeft: 1,
          marginX: 1,
          children: [confirmActive && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            marginBottom: 0,
            flexDirection: "column",
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_8__ /* ["default"] */.A, {
              title: confirmTitle,
              highlightColor: "yellow",
              options: [{
                label: continueLabel,
                hint: "y"
              }, {
                label: cancelLabel,
                hint: "esc/n"
              }],
              selectedIndex: confirmIndex,
              subtitle: confirmDetail
            })
          }), !confirmActive && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "row",
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              dimColor: prompt.length === 0,
              children: [promptSymbol, " "]
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexGrow: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_text_input_js__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.A, {
                value: prompt,
                onChange: setPrompt,
                onSubmit: value => {
                  if (confirmActive) return; // ignore submissions during confirm
                  // Accept @ suggestion on enter if visible
                  if (at.active) {
                    const rebuilt = acceptAtExpansion(value);
                    if (rebuilt != null) return;
                  }
                  // Handle slash commands
                  if (value.startsWith("/")) {
                    if (slash.active) {
                      const expanded = slash.acceptExpansion(value);
                      if (expanded != null && expanded !== value) {
                        setPrompt(expanded);
                        setCursorToEndSignal(s => s + 1);
                        return;
                      }
                    }
                    void (() => __awaiter(void 0, void 0, void 0, function* () {
                      const res = yield slash.runIfExecutable(value, allSlashCommands, {
                        insertText: txt => setPrompt(txt),
                        clearInput: () => setPrompt("")
                      });
                      if (res !== "handled") {
                        onSubmitProp(value);
                      }
                    }))();
                    // Hide palettes post submit attempt
                    at.hide();
                    slash.hide();
                    return;
                  }
                  onSubmitProp(value);
                  // Hide palettes after submission
                  at.hide();
                  slash.hide();
                },
                placeholder: computedPlaceholder,
                rightPlaceholder: isProcessing ? "ctrl+c to stop" : prompt.length === 0 && vimEnabled ? vimMode === "insert" ? "INSERT" : "NORMAL" : undefined,
                onCtrlC: handleCtrlC,
                onCtrlD: handleCtrlD,
                onCtrlR: handleCtrlR,
                allowExplicitNewline: true,
                onTab: () => {
                  // First try slash acceptance
                  if (slash.active) {
                    const rebuiltSlash = slash.acceptExpansion(prompt);
                    if (rebuiltSlash != null) {
                      setPrompt(rebuiltSlash);
                      setCursorToEndSignal(s => s + 1);
                      return;
                    }
                  }
                  // Fallback to @ acceptance
                  const rebuiltAt = acceptAtExpansion(prompt);
                  if (rebuiltAt != null) return;
                  // If '/cmd' without required args and no trailing space, add one to guide typing
                  if (prompt.startsWith("/") && !prompt.endsWith(" ") && !isSlashReady(prompt)) {
                    setPrompt(`${prompt} `);
                    setCursorToEndSignal(s => s + 1);
                    return;
                  }
                },
                showCursor: true,
                focus: true,
                cursorToEndSignal: cursorToEndSignal
              })
            })]
          })]
        }), !confirmActive && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          height: paletteVisible ? Math.min(slash.active ? Math.min(slash.items.length, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .PALETTE_PAGE_SIZE */.kQ) : Math.min(at.suggestions.length, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .PALETTE_PAGE_SIZE */.kQ), _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .PALETTE_PAGE_SIZE */.kQ) : 0,
          flexDirection: "column",
          marginTop: 0,
          children: paletteVisible && (slash.active ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_palette_slash_list_js__WEBPACK_IMPORTED_MODULE_10__ /* ["default"] */.A, {
            items: slash.items,
            activeIndex: slash.index,
            windowStart: slash.windowStart,
            highlightColor: "foreground"
          }) : (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_palette_at_list_js__WEBPACK_IMPORTED_MODULE_9__ /* ["default"] */.A, {
            suggestions: at.suggestions,
            activeIndex: at.index,
            windowStart: at.windowStart,
            highlightColor: "foreground"
          }))
        }), !confirmActive && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_prompt_footer_js__WEBPACK_IMPORTED_MODULE_11__ /* ["default"] */.A, {
          show: !paletteVisible,
          hasText: prompt.length > 0,
          exitMode: exitMode,
          modelLabel: modelLabel,
          changedFilesCount: changedFilesCount,
          showReviewHint: changedFilesCount > 0,
          exitHintText: "Press Ctrl+C again to detach",
          // rightStatusLabel={
          //   isLoadingDiffs && !changedFilesCount ? "Loading diffs…" : undefined
          // }
          headlineLabel: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "magenta",
            children: ["◎ Background Agent", branchName ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              dimColor: true,
              children: [" ", "\u00B7 ", branchName]
            }) : null]
          }),
          headlineColor: "magenta"
        })]
      });
    };
    /* unused harmony default export */
    var __WEBPACK_DEFAULT_EXPORT__ = /* unused pure expression or super */null && BackgroundPromptBar;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/