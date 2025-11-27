/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */e: () => (/* binding */useSlashPalette)
  /* harmony export */
});
/* harmony import */
var _anysphere_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../context/dist/index.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _utils_error_info_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/utils/error-info.ts");
/* harmony import */
var _utils_fuzzy_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/utils/fuzzy.ts");
/* harmony import */
var _use_windowed_nav_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/hooks/prompt/use-windowed-nav.ts");
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
function useSlashPalette(value, slashCommands, helpers) {
  const [items, setItems] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const [active, setActive] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [suppressed, setSuppressed] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const nav = (0, _use_windowed_nav_js__WEBPACK_IMPORTED_MODULE_2__ /* .useWindowedNav */.m)(6);
  const abortRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const lastValueRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(value);
  const [inlineMode, setInlineMode] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)({
    kind: "none"
  });
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    var _a, _b, _c, _d;
    const changed = value !== lastValueRef.current;
    lastValueRef.current = value;
    const ctx = (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_0__ /* .createContext */.q6)();
    // Detect inline trailing "/..." after normal text, e.g., "hello /shell"
    const inlineMatch = /^(.*?)(\s+)\/(\S*)$/.exec(value);
    if (inlineMatch) {
      const prefix = (_a = inlineMatch[1]) !== null && _a !== void 0 ? _a : "";
      const fragment = (_b = inlineMatch[3]) !== null && _b !== void 0 ? _b : "";
      setInlineMode({
        kind: "trailing",
        promptPrefix: prefix,
        fragment
      });
    } else {
      setInlineMode({
        kind: "none"
      });
    }
    const isInline = inlineMatch != null;
    if (!value.startsWith("/") && !isInline) {
      if (items.length !== 0) setItems([]);
      nav.setLength(0);
      setActive(prev => prev ? false : prev);
      if (suppressed) setSuppressed(false);
      return;
    }
    // If palette was suppressed (hidden), re-enable it once the input changes again
    if (suppressed) {
      if (changed) {
        setSuppressed(false);
      } else {
        if (items.length !== 0) setItems([]);
        nav.setLength(0);
        setActive(prev => prev ? false : prev);
        return;
      }
    }
    const term = isInline ? inlineMatch[3] : value.slice(1);
    const partsRaw = term.split(/\s+/);
    const parts = term.length === 0 ? [] : partsRaw.filter((p, i) => !(p === "" && i === partsRaw.length - 1 && !term.endsWith(" ")));
    const commandFragment = (_c = parts[0]) !== null && _c !== void 0 ? _c : "";
    const makeItemsForCommandList = () => __awaiter(this, void 0, void 0, function* () {
      const fragment = commandFragment;
      // If exact command, prefetch args suggestions
      const fragmentLower = fragment.toLowerCase();
      const exact = fragment ? slashCommands.find(c => c.id.toLowerCase() === fragmentLower) : undefined;
      if (exact === null || exact === void 0 ? void 0 : exact.getArgSuggestions) {
        const argSuggestions = yield exact.getArgSuggestions(ctx, [], helpers);
        if (argSuggestions && argSuggestions.length > 0) {
          return argSuggestions.map(s => ({
            identifier: s.value,
            label: s.value,
            description: s.description || "",
            args: [],
            parentCommandId: exact.id,
            isArgSuggestion: true
          }));
        }
      }
      const pool = isInline ? slashCommands.filter(c => c.inline) : slashCommands;
      const scored = pool.map((c, index) => {
        const text = `${c.id} ${c.title} ${c.description || ""}`;
        let score = fragment ? (0, _utils_fuzzy_js__WEBPACK_IMPORTED_MODULE_3__ /* .fuzzyScore */.dt)(text, fragment) : 1;
        // Heavily prioritize commands that start with the fragment
        if (fragment && c.id.toLowerCase().startsWith(fragment.toLowerCase())) {
          score += 1000; // Large bonus for prefix match
        }
        // Boost commands when users type any of their alternative names (boostedAlts)
        if (fragment && c.boostedAlts) {
          const fragmentLower = fragment.toLowerCase();
          const matchesAlt = c.boostedAlts.some(alt => fragmentLower === alt.toLowerCase() || fragmentLower.startsWith(alt.toLowerCase()) || alt.toLowerCase().includes(fragmentLower));
          if (matchesAlt) {
            score += 1500; // Higher than prefix match to ensure it appears at top
          }
        }
        return {
          c,
          score,
          originalIndex: index
        };
      }).filter(x => fragment ? x.score > 0 : true).sort((a, b) => {
        if (fragment) {
          // When searching, sort by score then alphabetically
          return b.score - a.score || a.c.id.localeCompare(b.c.id);
        } else {
          // When no search query, preserve original order
          return a.originalIndex - b.originalIndex;
        }
      });
      return scored.map(({
        c
      }) => ({
        identifier: c.id,
        label: c.title,
        description: c.description || "",
        args: (c.args || []).map(a => ({
          identifier: a.id,
          required: a.required
        })),
        inline: c.inline
      }));
    });
    const makeItemsForArgs = () => __awaiter(this, void 0, void 0, function* () {
      const target = slashCommands.find(c => c.id.toLowerCase() === commandFragment.toLowerCase());
      if (!target) return [];
      const argInput = parts.slice(1);
      if (target.getArgSuggestions) {
        const suggestions = yield target.getArgSuggestions(ctx, argInput, helpers);
        if (suggestions && suggestions.length > 0) {
          return suggestions.map(s => ({
            identifier: s.value,
            label: s.value,
            description: s.description || "",
            args: [],
            parentCommandId: target.id,
            isArgSuggestion: true
          }));
        }
      }
      // Fallback: show required/optional arg placeholders when no dynamic suggestions
      const placeholders = (target.args || []).slice(argInput.length);
      return placeholders.map(a => ({
        identifier: a.id,
        label: a.id,
        description: a.required === false ? "optional" : "required",
        args: [],
        parentCommandId: target.id,
        isArgSuggestion: true
      }));
    });
    // Abort previous async operations
    (_d = abortRef.current) === null || _d === void 0 ? void 0 : _d.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const updateItems = () => __awaiter(this, void 0, void 0, function* () {
      let nextItems = [];
      if (parts.length <= 1 || parts.length === 1 && !term.endsWith(" ")) {
        nextItems = yield makeItemsForCommandList();
      } else {
        nextItems = yield makeItemsForArgs();
      }
      // Check if the operation was aborted
      if (controller.signal.aborted) return;
      if (nextItems.length !== items.length || nextItems.some((it, i) => {
        var _a, _b;
        return it.identifier !== ((_a = items[i]) === null || _a === void 0 ? void 0 : _a.identifier) || it.parentCommandId !== ((_b = items[i]) === null || _b === void 0 ? void 0 : _b.parentCommandId);
      })) {
        setItems(nextItems);
      }
      nav.setLength(nextItems.length);
      const visible = nextItems.length > 0;
      setActive(prev => prev !== visible ? visible : prev);
      if (visible && changed) nav.reset();
    });
    updateItems();
  }, [value, slashCommands, suppressed, helpers, items, nav.reset, nav.setLength]);
  const acceptExpansion = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(input => {
    var _a, _b;
    if (!active || items.length === 0) return null;
    // Accept both inline and leading slash modes
    const trailing = inlineMode.kind === "trailing";
    const afterSlash = trailing ? inlineMode.fragment : input.startsWith("/") ? input.slice(1) : "";
    if (!trailing && !input.startsWith("/")) return null;
    const hasSpace = afterSlash.includes(" ");
    const endsWithSpace = (trailing ? input : input).endsWith(" ");
    const chosen = items[nav.index];
    if (!chosen) return null;
    if (!hasSpace) {
      if (chosen.isArgSuggestion && chosen.parentCommandId) {
        if (trailing) {
          return `${inlineMode.promptPrefix} /${chosen.parentCommandId} ${chosen.identifier} `;
        }
        return `/${chosen.parentCommandId} ${chosen.identifier} `;
      }
      const expandedCore = `/${chosen.identifier}${chosen.args.length > 0 ? " " : ""}`;
      const expanded = trailing ? `${inlineMode.promptPrefix} ${expandedCore}` : expandedCore;
      return expanded !== input ? expanded : null;
    }
    const parts = afterSlash.split(/\s+/);
    if (parts.length >= 2) {
      const nonEmptyParts = afterSlash.split(/\s+/).filter(Boolean);
      const lastNonEmpty = (_a = nonEmptyParts[nonEmptyParts.length - 1]) !== null && _a !== void 0 ? _a : "";
      const chosenId = chosen.identifier;
      if (endsWithSpace) {
        // Determine target command and whether more args are expected
        const cmdId = (_b = parts[0]) !== null && _b !== void 0 ? _b : "";
        const target = slashCommands.find(c => c.id.toLowerCase() === cmdId.toLowerCase());
        const definedArgsCount = (target === null || target === void 0 ? void 0 : target.args) ? target.args.length : undefined;
        const typedArgsCount = Math.max(0, nonEmptyParts.length - 1);
        const shouldReplace = !target || definedArgsCount == null || typedArgsCount >= definedArgsCount;
        if (shouldReplace) {
          if (trailing) {
            return `${inlineMode.promptPrefix} /${chosenId} `;
          }
          const trimmed = input.trimEnd();
          const lastSpace = trimmed.lastIndexOf(" ");
          const prefix = lastSpace >= 0 ? trimmed.slice(0, lastSpace + 1) : "";
          return `${prefix}${chosenId} `;
        } else {
          if (lastNonEmpty === chosenId) return null;
          if (trailing) {
            return `${input}${chosenId} `;
          }
          return `${input}${chosenId} `;
        }
      }
      // Replace the last token
      const lastSpace = input.lastIndexOf(" ");
      const currentLast = lastSpace >= 0 ? input.slice(lastSpace + 1) : input;
      if (currentLast === chosenId) {
        // Already selected; just ensure trailing space
        return input.endsWith(" ") ? null : `${input} `;
      }
      const prefix = lastSpace >= 0 ? input.slice(0, lastSpace + 1) : "";
      return `${prefix}${chosenId} `;
    }
    return null;
  }, [active, items, nav.index, slashCommands, inlineMode]);
  const runIfExecutable = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((input, commands, env, setQuitting, setUnknown) => __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // Support both pure slash and inline trailing slash
    let promptPrefix = "";
    let term;
    if (input.startsWith("/")) {
      term = input.slice(1);
    } else {
      const m = /^(.*?)(\s+)\/(\S.*)$/.exec(input);
      if (!m) return "not-a-command";
      promptPrefix = ((_a = m[1]) !== null && _a !== void 0 ? _a : "").trimEnd();
      term = (_b = m[3]) !== null && _b !== void 0 ? _b : "";
    }
    const parts = term.split(/\s+/).filter(Boolean);
    const cmdId = parts[0] || "";
    if (!cmdId) return "not-a-command";
    const args = parts.slice(1);
    // If inline, limit to inline-capable commands
    const pool = promptPrefix ? commands.filter(c => c.inline) : commands;
    const cmd = pool.find(c => c.id.toLowerCase() === cmdId.toLowerCase());
    if (!cmd) {
      if (promptPrefix) {
        // For inline trailing commands, let the normal message submission proceed
        return "not-a-command";
      }
      setUnknown === null || setUnknown === void 0 ? void 0 : setUnknown(cmdId);
      return "unknown";
    }
    if (!cmd.run) return "handled"; // nothing to do
    const requiredArgs = (cmd.args || []).filter(a => a.required !== false);
    if (args.length < requiredArgs.length) return "handled"; // wait for more args
    if (cmdId.toLowerCase() === "quit") setQuitting === null || setQuitting === void 0 ? void 0 : setQuitting(true);
    (_c = abortRef.current) === null || _c === void 0 ? void 0 : _c.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const [ctx, cancel] = (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_0__ /* .createContext */.q6)().withCancel();
    controller.signal.addEventListener("abort", cancel);
    try {
      yield cmd.run(ctx, args, {
        onModelChange: env.onModelChange,
        insertText: txt => {
          if (controller.signal.aborted) return;
          if (promptPrefix) {
            // For inline commands, decide what to insert:
            // - If the command provided text (e.g., /shell <cmd>), use that
            // - Otherwise, use the original prefix before the inline slash
            const content = txt && txt.length > 0 ? txt : promptPrefix;
            env.insertText(content);
          } else {
            env.insertText(txt);
          }
        },
        clearInput: () => {
          var _a;
          if (controller.signal.aborted) return;
          (_a = env.clearInput) === null || _a === void 0 ? void 0 : _a.call(env);
        },
        enterShellMode: () => {
          var _a;
          return (_a = env.enterShellMode) === null || _a === void 0 ? void 0 : _a.call(env);
        },
        print: (lines, options) => {
          var _a;
          if (controller.signal.aborted) return;
          (_a = env.print) === null || _a === void 0 ? void 0 : _a.call(env, lines, options);
        },
        exit: isLogout => {
          var _a;
          return (_a = env.exit) === null || _a === void 0 ? void 0 : _a.call(env, isLogout);
        },
        onHistoryCleared: () => {
          var _a;
          return (_a = env.onHistoryCleared) === null || _a === void 0 ? void 0 : _a.call(env);
        },
        onResumeChat: env.onResumeChat,
        getChatId: env.getChatId,
        logout: env.logout,
        onNewChat: env.onNewChat,
        onSummarize: env.onSummarize,
        submitMessage: env.submitMessage
      });
    } catch (err) {
      // Render a friendly, single-line error in the palette instead of letting
      // the rejection bubble to the global handler, which would show a stack.
      if (!controller.signal.aborted) {
        const {
          message
        } = (0, _utils_error_info_js__WEBPACK_IMPORTED_MODULE_4__ /* .extractErrorInfo */.q)(err);
        (_d = env.print) === null || _d === void 0 ? void 0 : _d.call(env, [[{
          text: `Error: ${message}`,
          color: "red"
        }]]);
        (_e = env.clearInput) === null || _e === void 0 ? void 0 : _e.call(env);
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
    return "handled";
  }), []);
  const hide = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    setSuppressed(true);
    setActive(false);
  }, []);
  // cleanup
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    return () => {
      var _a;
      (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
    };
  }, []);
  return (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => ({
    active,
    items,
    index: nav.index,
    windowStart: nav.windowStart,
    next: nav.next,
    prev: nav.prev,
    reset: nav.reset,
    acceptExpansion,
    runIfExecutable,
    hide
  }), [active, items, nav.index, nav.windowStart, nav.next, nav.prev, nav.reset, acceptExpansion, runIfExecutable, hide]);
}

/***/