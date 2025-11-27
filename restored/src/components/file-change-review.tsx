__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Z: () => (/* binding */FileChangeReview)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var chalk__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("../../node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/context/agent-state-context.tsx");
    /* harmony import */
    var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/context/theme-context.tsx");
    /* harmony import */
    var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/context/vim-mode-context.tsx");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/hooks/use-screen-size.ts");
    /* harmony import */
    var _hooks_use_shared_animation_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/hooks/use-shared-animation.ts");
    /* harmony import */
    var _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/hooks/use-text-input.ts");
    /* harmony import */
    var _utils_characters_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/utils/characters.ts");
    /* harmony import */
    var _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/utils/color-mixing.ts");
    /* harmony import */
    var _utils_diff_colors_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/utils/diff-colors.ts");
    /* harmony import */
    var _utils_diff_sequences_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/utils/diff-sequences.ts");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _utils_prompt_utils_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/utils/prompt-utils.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_8__, _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_10__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_8__, _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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

    /** biome-ignore-all lint/suspicious/noControlCharactersInRegex: used for diff sequences */

    const FileChangeReview = ({
      // biome-ignore lint/correctness/noUnusedFunctionParameters: not used for now, but can use to accept/reject changes
      fileChangeTracker,
      changes,
      onExit,
      onSubmitPrompt,
      initialSelectedIndex,
      wrapLines = true,
      isGenerating: isGeneratingProp
    }) => {
      var _a, _b, _c;
      const {
        isGenerating: isGeneratingFromContext
      } = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_4__ /* .useAgentState */.C9)();
      const isGenerating = isGeneratingProp !== null && isGeneratingProp !== void 0 ? isGeneratingProp : isGeneratingFromContext;
      const gatePatterns = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => [/(^|\/)yarn\.lock$/, /(^|\/)pnpm-lock\.yaml$/, /(^|\/)package-lock\.json$/, /(^|\/)bun\.lockb$/, /(^|\/)Cargo\.lock$/, /(^|\/)Gemfile\.lock$/, /(^|\/)poetry\.lock$/, /(^|\/)Pipfile\.lock$/, /(^|\/)composer\.lock$/, /(^|\/)go\.sum$/, /(^|\/)Podfile\.lock$/, /(^|\/)gradle\.lockfile$/, /\.(png|jpe?g|gif|bmp|webp|ico|pdf|zip|tar|tgz|gz|rar|7z|jar|wasm|woff2?|ttf|otf)$/i, /\.min\.js$/], []);
      const gateForChange = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(c => {
        var _a, _b, _c, _d;
        if (_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .TEST_FILE_REVIEW_FORCE_GATED_PATHS */.ye.has(c.path)) return {
          gated: true,
          reason: "Forced gated for testing"
        };
        const p = c.path;
        for (const re of gatePatterns) if (re.test(p)) return {
          gated: true,
          reason: "Lock file diff hidden"
        };
        const bl = (_b = (_a = c.before) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        const al = (_d = (_c = c.after) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
        if (c.before && c.before.indexOf("\x00") !== -1 || c.after && c.after.indexOf("\x00") !== -1) return {
          gated: true,
          reason: "Binary file diff hidden"
        };
        if (bl + al > _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .FILE_REVIEW_MAX_CHARS */.Le || bl > _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .FILE_REVIEW_MAX_CHARS */.Le || al > _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .FILE_REVIEW_MAX_CHARS */.Le) return {
          gated: true,
          reason: "File too large to render diff"
        };
        return {
          gated: false,
          reason: ""
        };
      }, [gatePatterns]);
      const gatedMessageLines = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(reason => {
        return ["", `   ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim(`${reason} — not shown`)}`, `   ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("You can still keep or undo this change.")}`, ""];
      }, []);
      const [selectedIndex, setSelectedIndex] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(initialSelectedIndex !== null && initialSelectedIndex !== void 0 ? initialSelectedIndex : 0);
      const [commandBuffer, setCommandBuffer] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(""); // kept for help toggle only at parent; actual scrolling handled in child
      const [showHelp, setShowHelp] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      const [promptActive, setPromptActive] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      const [promptValue, setPromptValue] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)("");
      const [staged, _setStaged] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)({});
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdout */.t$)();
      const screen = (0, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_8__ /* .useScreenSize */.l)();
      const {
        setReviewSelectedIndex,
        pendingDecisions,
        rejectPendingDecision
      } = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_4__ /* .useAgentState */.C9)();
      const {
        vimEnabled,
        mode,
        setMode
      } = (0, _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_6__ /* .useVimMode */.v)();
      const shouldSpin = _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .TEST_FILE_REVIEW_GENERATING */.Eo || isGenerating || pendingDecisions.length > 0;
      const hexTick = (0, _hooks_use_shared_animation_js__WEBPACK_IMPORTED_MODULE_9__ /* .useSharedTick */.e)(_hooks_use_shared_animation_js__WEBPACK_IMPORTED_MODULE_9__ /* .DEFAULT_HEXAGON_INTERVAL_MS */.q, !shouldSpin);
      const [feedback, setFeedback] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
      const feedbackTimerRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      const perfEventsRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)([]);
      const perf = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((name, data) => {
        perfEventsRef.current.push({
          name,
          data,
          ts: Date.now()
        });
      }, []);
      const shikiImportRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      const getCodeToTokens = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!shikiImportRef.current) shikiImportRef.current = __webpack_require__.e(/* import() */4541).then(__webpack_require__.bind(__webpack_require__, "../../node_modules/.pnpm/shiki@3.7.0/node_modules/shiki/dist/index.mjs"));
        const mod = yield shikiImportRef.current;
        return mod.codeToTokens;
      }), []);
      const highlightPendingRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(new Map());
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        const flush = () => {
          var _a, _b, _c;
          const evs = perfEventsRef.current.splice(0);
          if (evs.length === 0) return;
          const summary = {};
          for (const e of evs) {
            const d = (_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.durMs;
            if (typeof d === "number" && Number.isFinite(d)) {
              const k = (_b = e === null || e === void 0 ? void 0 : e.name) !== null && _b !== void 0 ? _b : "unknown";
              summary[k] = ((_c = summary[k]) !== null && _c !== void 0 ? _c : 0) + d;
            }
          }
          if (Object.keys(summary).length > 0) (0, _debug_js__WEBPACK_IMPORTED_MODULE_7__.debugLogJSON)("perf.summary", summary);
        };
        const id = setTimeout(flush, 800);
        return () => {
          clearTimeout(id);
          flush();
        };
      }, []);
      const colorMode = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_11__ /* .getColorMode */.PT)(), []);
      const fg = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(hex => {
        if (!hex) return "";
        const rgb = (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_11__ /* .hexToRgb */.E2)(hex);
        if (!rgb) return "";
        if (colorMode === "truecolor") return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
        if (colorMode === "ansi256") return `\x1b[38;5;${(0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_11__ /* .rgbToAnsi256 */.LQ)(rgb.r, rgb.g, rgb.b)}m`;
        return "";
      }, [colorMode]);
      const bg = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(hex => {
        if (!hex) return "";
        const rgb = (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_11__ /* .hexToRgb */.E2)(hex);
        if (!rgb) return "";
        if (colorMode === "truecolor") return `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m`;
        if (colorMode === "ansi256") return `\x1b[48;5;${(0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_11__ /* .rgbToAnsi256 */.LQ)(rgb.r, rgb.g, rgb.b)}m`;
        return "";
      }, [colorMode]);
      // Diff sign (+/-) foreground sequences by color mode
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (!stdout) return;
        try {
          // Enter alt screen, disable line wrap, enable application cursor keys
          // Also hide cursor to reduce redraw flicker during manual rendering
          stdout.write("\x1b[?1049h\x1b[?7l\x1b[?1h\x1b=\x1b[?25l");
        } catch (_a) {}
        return () => {
          try {
            stdout.write("\x1b[?1l\x1b>\x1b[?7h\x1b[?1049l");
          } catch (_a) {}
        };
      }, [stdout]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (initialSelectedIndex != null) setReviewSelectedIndex(initialSelectedIndex);
      }, [initialSelectedIndex, setReviewSelectedIndex]);
      // Exit review mode automatically if there are no changes
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (changes.length === 0) onExit();
      }, [changes.length, onExit]);
      const createDiffLines = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((beforeContent, afterContent) => {
        const beforeLines = beforeContent.split(/\r?\n/);
        const afterLines = afterContent.split(/\r?\n/);
        const diffLines = [];
        let beforeIndex = 0;
        let afterIndex = 0;
        const isCommon = (aIndex, bIndex) => beforeLines[aIndex] === afterLines[bIndex];
        const foundSubsequence = (nCommon, aCommon, bCommon) => {
          for (let i = beforeIndex; i < aCommon; i++) diffLines.push({
            type: "removed",
            content: beforeLines[i],
            beforeLineNumber: i + 1
          });
          for (let i = afterIndex; i < bCommon; i++) diffLines.push({
            type: "added",
            content: afterLines[i],
            afterLineNumber: i + 1
          });
          for (let i = 0; i < nCommon; i++) diffLines.push({
            type: "common",
            content: beforeLines[aCommon + i],
            beforeLineNumber: aCommon + i + 1,
            afterLineNumber: bCommon + i + 1
          });
          beforeIndex = aCommon + nCommon;
          afterIndex = bCommon + nCommon;
        };
        try {
          const diffImpl = _utils_diff_sequences_js__WEBPACK_IMPORTED_MODULE_16__ /* ["default"] */.A;
          diffImpl(beforeLines.length, afterLines.length, isCommon, foundSubsequence);
        } catch (_a) {
          // Fallback: if diff lib not available, treat entire after file as added
          return afterLines.map(l => ({
            type: "added",
            content: l
          }));
        }
        for (let i = beforeIndex; i < beforeLines.length; i++) diffLines.push({
          type: "removed",
          content: beforeLines[i],
          beforeLineNumber: i + 1
        });
        for (let i = afterIndex; i < afterLines.length; i++) diffLines.push({
          type: "added",
          content: afterLines[i],
          afterLineNumber: i + 1
        });
        return diffLines;
      }, []);
      const filterDiffLinesWithContext = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((lines, contextLines) => {
        const changeIndices = [];
        lines.forEach((line, index) => {
          if (line.type !== "common") changeIndices.push(index);
        });
        if (changeIndices.length === 0) return [];
        const hunks = [];
        let currentHunk = null;
        changeIndices.forEach(index => {
          if (!currentHunk) currentHunk = {
            start: index,
            end: index
          };else if (index <= currentHunk.end + contextLines * 2 + 1) currentHunk.end = index;else {
            hunks.push(currentHunk);
            currentHunk = {
              start: index,
              end: index
            };
          }
        });
        if (currentHunk) hunks.push(currentHunk);
        const result = [];
        for (let hi = 0; hi < hunks.length; hi++) {
          const hunk = hunks[hi];
          const startIndex = Math.max(0, hunk.start - contextLines);
          const endIndex = Math.min(lines.length - 1, hunk.end + contextLines);
          for (let i = startIndex; i <= endIndex; i++) result.push(lines[i]);
          if (hi < hunks.length - 1) {
            const nextStartIndex = Math.max(0, hunks[hi + 1].start - contextLines);
            const omitted = Math.max(0, nextStartIndex - endIndex - 1);
            if (omitted > 0) result.push({
              type: "gap",
              content: "",
              gapCount: omitted
            });
          }
        }
        return result;
      }, []);
      // Dynamically increase context lines when diff is short/small.
      const computeContextLines = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(diffLines => {
        const changeCount = diffLines.reduce((acc, l) => l.type !== "common" ? acc + 1 : acc, 0);
        if (changeCount <= 10 && diffLines.length <= 400) return 10; // expanded context
        return _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .FILE_REVIEW_DEFAULT_CONTEXT_LINES */.oy; // default compact context
      }, []);
      const [precomputed, setPrecomputed] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)({});
      const precomputeRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(new Set());
      const precomputedStateRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(precomputed);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        precomputedStateRef.current = precomputed;
      }, [precomputed]);
      const computePrecomputed = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(c => {
        var _a;
        const t0 = Date.now();
        const gate = gateForChange(c);
        if (gate.gated) {
          const gl = gatedMessageLines(gate.reason);
          const res = {
            lines: gl,
            kinds: new Array(gl.length).fill("other"),
            total: 2,
            added: 0,
            removed: 0
          };
          const dur = Date.now() - t0;
          perf("computePrecomputed", {
            path: c.path,
            gated: true,
            durMs: dur
          });
          return res;
        }
        if (c.after === undefined) {
          const beforeLines = ((_a = c.before) !== null && _a !== void 0 ? _a : "").split(/\r?\n/);
          const res = {
            lines: ["[deleted]"],
            kinds: ["removed"],
            total: 1,
            added: 0,
            removed: Math.max(0, beforeLines.length)
          };
          const dur = Date.now() - t0;
          perf("computePrecomputed", {
            path: c.path,
            type: "deleted",
            durMs: dur
          });
          return res;
        }
        if (c.before === undefined) {
          const rawLines = c.after.split(/\r?\n/);
          const lines = rawLines.map((l, idx) => `${(idx + 1).toString().padStart(4, " ")} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m \x1b[0m ${l}`);
          const kinds = new Array(lines.length).fill("added");
          const res = {
            lines,
            kinds,
            total: lines.length,
            added: rawLines.length,
            removed: 0
          };
          const dur = Date.now() - t0;
          perf("computePrecomputed", {
            path: c.path,
            type: "created",
            lines: lines.length,
            durMs: dur
          });
          return res;
        }
        let diffEntry = diffCacheRef.current.get(c.path);
        if (!diffEntry) {
          const diffLines = createDiffLines(c.before, c.after);
          const contextLines = computeContextLines(diffLines);
          const filtered = filterDiffLinesWithContext(diffLines, contextLines);
          diffEntry = {
            diffLines,
            filtered,
            contextLines
          };
          diffCacheRef.current.set(c.path, diffEntry);
        }
        const {
          diffLines,
          filtered
        } = diffEntry;
        let addedCount = 0;
        let removedCount = 0;
        for (const dl of diffLines) {
          if (dl.type === "added") addedCount++;else if (dl.type === "removed") removedCount++;
        }
        const kinds = new Array(filtered.length);
        const lines = filtered.map((l, idx) => {
          var _a;
          const beforeNum = l.beforeLineNumber ? l.beforeLineNumber.toString().padStart(4, " ") : "    ";
          const afterNum = l.afterLineNumber ? l.afterLineNumber.toString().padStart(4, " ") : "    ";
          switch (l.type) {
            case "added":
              kinds[idx] = "added";
              return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[32m+\x1b[39m ${l.content}\x1b[0m`;
            case "removed":
              kinds[idx] = "removed";
              return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[31m-\x1b[39m ${l.content}\x1b[0m`;
            case "gap":
              kinds[idx] = "other";
              return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m⋯ ${(_a = l.gapCount) !== null && _a !== void 0 ? _a : 0} lines truncated ⋯\x1b[0m`;
            default:
              kinds[idx] = "other";
              return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m \x1b[0m ${l.content}`;
          }
        });
        const res = {
          lines,
          kinds,
          total: lines.length,
          added: addedCount,
          removed: removedCount
        };
        const dur = Date.now() - t0;
        perf("computePrecomputed", {
          path: c.path,
          type: "modified",
          total: lines.length,
          added: addedCount,
          removed: removedCount,
          durMs: dur
        });
        return res;
      }, [gateForChange, gatedMessageLines, createDiffLines, computeContextLines, filterDiffLinesWithContext, perf]);
      const [highlightCache, setHighlightCache] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)({});
      const computingRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(new Set());
      const MAX_CACHE_ENTRIES = 60;
      const highlightOrderRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)([]);
      const precomputedOrderRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)([]);
      const diffCacheRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(new Map());
      const scheduleIdle = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(fn => {
        const ric = globalThis.requestIdleCallback;
        if (ric) ric(fn);else setTimeout(fn, 0);
      }, []);
      const idle = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => new Promise(res => {
        const ric = globalThis.requestIdleCallback;
        if (ric) ric(() => res());else setTimeout(() => res(), 0);
      }), []);
      const ensurePrecomputed = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(c => {
        const path = c.path;
        if (precomputedStateRef.current[path] || precomputeRef.current.has(path)) return;
        precomputeRef.current.add(path);
        const t0 = Date.now();
        scheduleIdle(() => {
          const res = computePrecomputed(c);
          setPrecomputed(prev => Object.assign(Object.assign({}, prev), {
            [path]: res
          }));
          precomputedOrderRef.current.push(path);
          if (precomputedOrderRef.current.length > MAX_CACHE_ENTRIES) {
            const victim = precomputedOrderRef.current.shift();
            if (victim) setPrecomputed(prev => {
              const next = Object.assign({}, prev);
              delete next[victim];
              return next;
            });
          }
          precomputeRef.current.delete(path);
          const dur = Date.now() - t0;
          perf("ensurePrecomputed", {
            path,
            durMs: dur
          });
        });
      }, [computePrecomputed, perf, scheduleIdle]);
      // Type wrappers removed; theme is now provided by context
      // Defer expensive syntax highlighting until after first paint / interaction
      const [highlightReady, setHighlightReady] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      const setHighlightEntry = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((path, entry) => {
        const safeEntry = (() => {
          const lineLen = entry.lines.length;
          const kindLen = entry.kinds.length;
          if (lineLen !== kindLen) {
            let fixedKinds = entry.kinds.slice(0, lineLen);
            if (fixedKinds.length < lineLen) {
              fixedKinds = fixedKinds.concat(new Array(lineLen - fixedKinds.length).fill("other"));
            }
            fixedKinds = fixedKinds.map(k => k === "added" || k === "removed" || k === "other" ? k : "other");
            _debug_js__WEBPACK_IMPORTED_MODULE_7__.debugLogJSON === null || _debug_js__WEBPACK_IMPORTED_MODULE_7__.debugLogJSON === void 0 ? void 0 : (0, _debug_js__WEBPACK_IMPORTED_MODULE_7__.debugLogJSON)("highlight.kinds_mismatch", {
              path,
              lines: lineLen,
              kinds: kindLen
            });
            return {
              lines: entry.lines,
              kinds: fixedKinds,
              total: entry.total
            };
          }
          // Also coerce any unexpected values to a safe default
          const coercedKinds = entry.kinds.map(k => k === "added" || k === "removed" || k === "other" ? k : "other");
          return {
            lines: entry.lines,
            kinds: coercedKinds,
            total: entry.total
          };
        })();
        setHighlightCache(prev => {
          const next = Object.assign(Object.assign({}, prev), {
            [path]: safeEntry
          });
          highlightOrderRef.current.push(path);
          while (highlightOrderRef.current.length > MAX_CACHE_ENTRIES) {
            const victim = highlightOrderRef.current.shift();
            if (victim && victim in next) delete next[victim];
          }
          return next;
        });
      }, []);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        const t = setTimeout(() => setHighlightReady(true), 250);
        return () => clearTimeout(t);
      }, []);
      const isLightTheme = (0, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__ /* .useIsLightTheme */.pW)();
      // Diff sign (+/-) foreground sequences by color mode
      const signFgAdd = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (colorMode === "truecolor") {
          const hex = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_TRUECOLOR_LIGHT */.B0.addHex : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_TRUECOLOR_DARK */.Fv.addHex;
          return fg(hex);
        }
        if (colorMode === "ansi256") {
          const idx = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_ANSI256_LIGHT */.Kj.add : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_ANSI256_DARK */.yp.add;
          return `\x1b[38;5;${idx}m`;
        }
        return _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_GREEN */.ki;
      }, [colorMode, isLightTheme, fg]);
      const signFgRemove = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (colorMode === "truecolor") {
          const hex = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_TRUECOLOR_LIGHT */.B0.removeHex : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_TRUECOLOR_DARK */.Fv.removeHex;
          return fg(hex);
        }
        if (colorMode === "ansi256") {
          const idx = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_ANSI256_LIGHT */.Kj.remove : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SIGN_ANSI256_DARK */.yp.remove;
          return `\x1b[38;5;${idx}m`;
        }
        return _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RED */.s0;
      }, [colorMode, isLightTheme, fg]);
      // When theme changes, invalidate syntax-highlight cache so lines redraw with new tints
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        setHighlightCache({});
        computingRef.current.clear();
      }, []);
      const formatFollowUpFeedback = (_full, vv) => {
        if (vv.length > 10) {
          return `Sent a new follow-up: ${vv.slice(0, 10)}...`;
        }
        return `Sent a new follow-up: ${vv}`;
      };
      // Row-wide background for added/removed lines
      // Use the same mixing as token backgrounds to avoid brighter non-token areas
      const rowBgAdd = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (colorMode === "basic") return "\x1b[42m"; // native green background
        if (colorMode === "ansi256") {
          const idx = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_ROW_ANSI256_LIGHT */.Xh.add : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_ROW_ANSI256_DARK */.XM.add;
          return `\x1b[48;5;${idx}m`;
        }
        const {
          addHex
        } = (0, _utils_diff_colors_js__WEBPACK_IMPORTED_MODULE_12__ /* .computeDiffRowHexes */.a)(isLightTheme);
        return bg(addHex);
      }, [colorMode, isLightTheme, bg]);
      const rowBgRemove = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (colorMode === "basic") return "\x1b[41m"; // native red background
        if (colorMode === "ansi256") {
          const idx = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_ROW_ANSI256_LIGHT */.Xh.remove : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_ROW_ANSI256_DARK */.XM.remove;
          return `\x1b[48;5;${idx}m`;
        }
        const {
          removeHex
        } = (0, _utils_diff_colors_js__WEBPACK_IMPORTED_MODULE_12__ /* .computeDiffRowHexes */.a)(isLightTheme);
        return bg(removeHex);
      }, [colorMode, isLightTheme, bg]);
      // Hexagon loader frames (outline/filled)
      const hexagonFrame = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => hexTick % 2 === 0 ? "⬡" : pendingDecisions.length > 0 ? chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("⬢") : chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.green("⬢"), [hexTick, pendingDecisions.length]);
      const stripAnsi = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(s => (0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_17__ /* .stripAnsi */.aJ)(s), []);
      const helpModalLines = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        return [`${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.white.bold("↑/↓")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("scroll ·")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.white.bold("←/→")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("switch file")}`, `${changes.length > 1 ? "←/→ switch file, " : ""}q exit`, "j/k scroll, Space/f page, b back", "Ctrl-d/u half, Ctrl-e/y line, g/G top/bot", "", chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("Press q, Esc, Ctrl-C, or Ctrl-R to close")];
      }, [changes.length]);
      // Render all bodies in one pass for deterministic row-wide tinting
      const [deferBodies, setDeferBodies] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      const [, startTransition] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useTransition)();
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        setDeferBodies(false);
      }, []);
      const [wrapReady, setWrapReady] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        setWrapReady(false);
        startTransition(() => setWrapReady(true));
      }, []);
      // Kick off precompute for current file immediately
      const currentChange = changes[selectedIndex];
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (!currentChange) return;
        ensurePrecomputed(currentChange);
      }, [currentChange, ensurePrecomputed]);
      // const currentPath: string | undefined = currentChange?.path; // unused
      const concat = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        var _a, _b, _c, _d, _e;
        const lines = [];
        const kinds = [];
        const sections = [];
        for (let i = 0; i < changes.length; i++) {
          const lazy = i !== selectedIndex && deferBodies;
          const c = changes[i];
          const start = lines.length;
          const width = Math.max(10, (_b = (_a = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _a !== void 0 ? _a : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _b !== void 0 ? _b : 80);
          const innerWidth = Math.max(0, width - 2);
          const rawRel = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_13__ /* .toRelativePath */.fw)(c.path);
          const isNew = c.before === undefined;
          const isDeleted = c.after === undefined;
          const d = precomputed[c.path] || {
            lines: [],
            total: 0,
            added: 0,
            removed: 0
          };
          const headerChip = staged[c.path] === "reject" ? ` ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RED */.s0}✖${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj}` : staged[c.path] === "accept" ? ` ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_GREEN */.ki}✔${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj}` : "";
          const chipRightPad = headerChip ? " " : "";
          const delta = (() => {
            const segs = [];
            if (d.added > 0) segs.push(`${signFgAdd}+${d.added}${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj}`);
            if (d.removed > 0) segs.push(`${signFgRemove}-${d.removed}${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj}`);
            return segs.length ? `\x1b[2m${segs.join(" ")}\x1b[0m` : "";
          })();
          const leftPrefix = `${i + 1}/${changes.length} `;
          const leftSuffix = isNew ? ` ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_GREEN */.ki}[new]${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj}` : "";
          const relStyledEmpty = staged[c.path] === "reject" ? `\x1b[9m\x1b[29m` : "";
          const headerMainWithoutRel = `\x1b[1m ${leftPrefix}${relStyledEmpty}${leftSuffix}${headerChip}${chipRightPad} \x1b[0m`;
          const headerLineWithoutRel = delta ? `${headerMainWithoutRel} ${delta}` : headerMainWithoutRel;
          const baseVisibleLen = stripAnsi(headerLineWithoutRel).length;
          const relMax = Math.max(0, innerWidth - baseVisibleLen);
          const relContent = rawRel.length <= relMax ? rawRel : (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_13__ /* .truncatePathByFoldersLeft */.RZ)(rawRel, Math.max(0, relMax));
          const relStyled = staged[c.path] === "reject" ? `\x1b[9m${relContent}\x1b[29m` : relContent;
          const left = `${leftPrefix}${relStyled}${leftSuffix}`;
          const headerMain = `\x1b[1m ${left}${headerChip}${chipRightPad} \x1b[0m`;
          const headerLine = delta ? `${headerMain} ${delta}` : headerMain;
          lines.push(headerLine);
          kinds.push("other");
          // Ensure a visual gap between header and body
          lines.push("");
          kinds.push("other");
          let body = [];
          let bodyKinds = [];
          if (!lazy) body = ((_c = highlightCache[c.path] || precomputed[c.path]) === null || _c === void 0 ? void 0 : _c.lines) || [];
          if (!lazy) bodyKinds = ((_d = highlightCache[c.path] || precomputed[c.path]) === null || _d === void 0 ? void 0 : _d.kinds) || new Array(body.length).fill("other");
          if (!lazy && (!body || body.length === 0)) ensurePrecomputed(c);
          if (staged[c.path] === "reject") {
            body = body.map(bl => chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim(bl));
          }
          for (let bi = 0; bi < body.length; bi++) {
            lines.push(body[bi]);
            kinds.push((_e = bodyKinds[bi]) !== null && _e !== void 0 ? _e : "other");
          }
          // single blank line after each section body for 1px margin
          lines.push("");
          kinds.push("other");
          const end = lines.length;
          sections.push({
            path: c.path,
            start,
            end,
            defaultKind: isNew ? "added" : isDeleted ? "removed" : "other",
            isNew
          });
          if (i < changes.length - 1) {
            lines.push("");
            kinds.push("other");
          }
        }
        return {
          lines,
          kinds,
          sections
        };
      }, [changes, precomputed, highlightCache, screen === null || screen === void 0 ? void 0 : screen.width, stdout === null || stdout === void 0 ? void 0 : stdout.columns, staged, deferBodies, selectedIndex, ensurePrecomputed, signFgAdd, signFgRemove, stripAnsi]);
      const lastViewportTopRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(0);
      const currentTotalLines = concat.lines.length;
      const usingOverlayHelp = showHelp;
      const caretStyleFn = () => vimEnabled && mode === "normal" ? chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.bgGray : chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.inverse;
      const promptLineRightFn = () => {
        const caretStyle = caretStyleFn();
        if (promptActive) {
          if (promptValue.length > 0) {
            let rv = "";
            let i = 0;
            let col = 0;
            let usedFirst = false;
            const cursorActualWidth = 0; // highlightPastedText is false here
            const baseFirst = Math.max(0, innerWidthCells - rightFixedPadCols - arrowCols - (showRightPlaceholder ? rightPlaceholderLen + rightPlaceholderPad : 0));
            const baseOther = Math.max(0, innerWidthCells - rightFixedPadCols - arrowCols);
            for (const ch of promptValue) {
              const capNow = usedFirst ? baseOther : baseFirst;
              const eolCursorOnLastChar = cursorActualWidth === 0 && promptCursorOffset === promptValue.length && capNow > 0 && col === capNow - 1 && i === promptValue.length - 1;
              const isCursorRange = i >= promptCursorOffset - cursorActualWidth && i <= promptCursorOffset;
              rv += eolCursorOnLastChar || isCursorRange ? caretStyle(ch) : ch;
              i++;
              col++;
              if (capNow > 0 && col >= capNow) {
                usedFirst = true;
                col = 0;
              }
            }
            if (promptCursorOffset === promptValue.length) {
              // Always render a visible caret cell even when exactly at a wrapped
              // boundary (col === 0). In that case, show the caret at the start of
              // the next wrapped line so it doesn't disappear.
              rv += caretStyle(" ");
            }
            return rv;
          } else {
            const fileLabel = (currentChange === null || currentChange === void 0 ? void 0 : currentChange.path) ? currentChange.path.split("/").pop() || "this file" : "this file";
            const escHint = !vimEnabled || mode === "normal" ? " (Esc cancel)" : "";
            const placeholderRaw = `For ${fileLabel}${escHint}`;
            const first = placeholderRaw.slice(0, 1);
            const rest = placeholderRaw.slice(1);
            return `${caretStyle(first)}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.grey(rest)}`;
          }
        } else {
          return commandBuffer.length > 0 ? commandBuffer : (() => {
            return chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.grey("Add a follow-up");
          })();
        }
      };
      // Dynamically compute how many lines the bottom input box occupies
      const widthCells = Math.max(10, (_b = (_a = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _a !== void 0 ? _a : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _b !== void 0 ? _b : 80);
      const innerWidthCells = Math.max(0, widthCells - 2);
      const showRightPlaceholder = !promptActive && promptValue.length === 0;
      const rightPlaceholderLabel = chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.grey("i to insert");
      const rightPlaceholderLen = stripAnsi(rightPlaceholderLabel).length;
      const rightPlaceholderPad = 1;
      // Helper to count how many wrapped lines the current input would take inside the box
      const countWrappedInputLines = (text, firstLineAvail, otherAvail) => {
        const ESC = 0x1b;
        let i = 0;
        let col = 0;
        let usedFirst = false;
        let lines = 1; // at least one line
        const capacityForCurrent = () => usedFirst ? otherAvail : firstLineAvail;
        while (i < text.length) {
          const ch = text.charCodeAt(i);
          if (ch === ESC && text[i + 1] === "[") {
            let j = i + 2;
            while (j < text.length && text[j] !== "m") j++;
            i = Math.min(text.length, j + 1);
            continue;
          }
          // treat everything (except ANSI) as width 1 for counting; good enough for input
          i++;
          col++;
          const cap = capacityForCurrent();
          if (cap <= 0) {
            // No room at all, spill entirely to next line
            lines++;
            usedFirst = true;
            col = 1; // current char consumed
            continue;
          }
          if (col > cap) {
            lines++;
            usedFirst = true;
            col = 1; // current char starts next line
          }
        }
        return Math.max(1, lines);
      };
      const _availFirst = showRightPlaceholder ? Math.max(0, innerWidthCells - rightPlaceholderLen - rightPlaceholderPad) : innerWidthCells;
      const measureExitLineRight = (() => {
        if (promptActive) {
          if (promptValue.length > 0) return `${promptValue} `; // caret occupies a cell
          const fileLabel = (currentChange === null || currentChange === void 0 ? void 0 : currentChange.path) ? currentChange.path.split("/").pop() || "this file" : "this file";
          const escHint = !vimEnabled || mode === "normal" ? " (Esc cancel)" : "";
          return `For ${fileLabel}${escHint}`;
        }
        return commandBuffer.length > 0 ? commandBuffer : "Add a follow-up";
      })();
      const measureLeftContent = measureExitLineRight;
      const rightFixedPadCols = 2;
      const arrowCols = 3; // " → "
      const contentAreaWidth = Math.max(0, innerWidthCells - rightFixedPadCols - arrowCols);
      const inputLineCount = countWrappedInputLines(measureLeftContent,
      // First line may reserve space for right placeholder
      showRightPlaceholder ? Math.max(0, contentAreaWidth - rightPlaceholderLen - rightPlaceholderPad + 2) : contentAreaWidth, contentAreaWidth);
      // Reserve space for: input lines, top+bottom borders, footer info, and optional feedback line
      const bottomReservedLines = inputLineCount + 4 + (feedback ? 1 : 0);
      const topReservedLines = 1; // static header at the top
      const reservedLines = currentChange ? bottomReservedLines : 0;
      const contentHeightRaw = (((_c = screen === null || screen === void 0 ? void 0 : screen.height) !== null && _c !== void 0 ? _c : stdout === null || stdout === void 0 ? void 0 : stdout.rows) || 24) - reservedLines - topReservedLines;
      const contentHeight = Math.max(1, contentHeightRaw);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        const c = currentChange;
        if (!c) return;
        if (!highlightReady) return; // wait until after first paint/interaction
        const path = c.path;
        const lang = (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .inferLanguageFromPath */.Ak)(path);
        const gate = gateForChange(c);
        if (gate.gated) return;
        const pendingKey = `${path}|${isLightTheme ? "L" : "D"}`;
        if (highlightCache[path] || computingRef.current.has(path) || highlightPendingRef.current.has(pendingKey)) return;
        computingRef.current.add(path);
        const p = (() => __awaiter(void 0, void 0, void 0, function* () {
          try {
            const t0 = Date.now();
            // dynamic import shiki to avoid cost if not needed
            const codeToTokens = yield getCodeToTokens();
            perf("import.shiki", {
              durMs: Date.now() - t0
            });
            if (c.after === undefined) {
              setHighlightEntry(path, {
                lines: ["[deleted]"],
                kinds: ["removed"],
                total: 1
              });
              return;
            }
            if (c.before === undefined) {
              const afterTokens = yield codeToTokens(c.after, {
                lang,
                theme: isLightTheme ? "light-plus" : "github-dark-default"
              });
              const lines = afterTokens.tokens.map((lineTokens, idx) => {
                const afterNum = `\x1b[2m${(idx + 1).toString().padStart(4, " ")}\x1b[0m`;
                const content = lineTokens.map(t => `${fg(t.color)}${bg(t.bgColor)}${t.content}\x1b[0m`).join("");
                return `${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m \x1b[0m ${content}`;
              });
              const kinds = new Array(lines.length).fill("added");
              setHighlightEntry(path, {
                lines,
                kinds,
                total: lines.length
              });
              return;
            }
            // modified file diff
            const shikiTheme = isLightTheme ? "light-plus" : "github-dark-default";
            let diffEntry = diffCacheRef.current.get(path);
            if (!diffEntry) {
              const diffLines = createDiffLines(c.before, c.after);
              const contextLines = computeContextLines(diffLines);
              const filtered = filterDiffLinesWithContext(diffLines, contextLines);
              diffEntry = {
                diffLines,
                filtered,
                contextLines
              };
              diffCacheRef.current.set(path, diffEntry);
            }
            const {
              filtered
            } = diffEntry;
            const afterIdxsRaw = [];
            const beforeIdxsRaw = [];
            for (const l of filtered) {
              if (l.afterLineNumber != null) afterIdxsRaw.push(l.afterLineNumber - 1);
              if (l.beforeLineNumber != null) beforeIdxsRaw.push(l.beforeLineNumber - 1);
            }
            const afterIdxs = [];
            const beforeIdxs = [];
            const seenA = new Set();
            const seenB = new Set();
            for (const i of afterIdxsRaw) if (!seenA.has(i)) {
              seenA.add(i);
              afterIdxs.push(i);
            }
            for (const i of beforeIdxsRaw) if (!seenB.has(i)) {
              seenB.add(i);
              beforeIdxs.push(i);
            }
            const afterLinesAll = c.after.split(/\r?\n/);
            const beforeLinesAll = c.before.split(/\r?\n/);
            const afterSlice = afterIdxs.map(i => {
              var _a;
              return (_a = afterLinesAll[i]) !== null && _a !== void 0 ? _a : "";
            }).join("\n");
            const beforeSlice = beforeIdxs.map(i => {
              var _a;
              return (_a = beforeLinesAll[i]) !== null && _a !== void 0 ? _a : "";
            }).join("\n");
            const mapAfter = new Map();
            const mapBefore = new Map();
            for (let i = 0; i < afterIdxs.length; i++) mapAfter.set(afterIdxs[i] + 1, i + 1);
            for (let i = 0; i < beforeIdxs.length; i++) mapBefore.set(beforeIdxs[i] + 1, i + 1);
            let beforeTokens = null;
            let afterTokens = null;
            let durTotal = 0;
            yield idle();
            if (afterIdxs.length > 0) {
              const tA = Date.now();
              afterTokens = yield codeToTokens(afterSlice, {
                lang,
                theme: shikiTheme
              });
              durTotal += Date.now() - tA;
            }
            yield idle();
            if (beforeIdxs.length > 0) {
              const tB = Date.now();
              beforeTokens = yield codeToTokens(beforeSlice, {
                lang,
                theme: shikiTheme
              });
              durTotal += Date.now() - tB;
            }
            perf("shiki.tokens", {
              path,
              durMs: durTotal
            });
            const kinds = new Array(filtered.length);
            const lines = filtered.map((l, idx) => {
              var _a;
              // Double line numbers (dim)
              const beforeNumRaw = l.beforeLineNumber ? l.beforeLineNumber.toString().padStart(4, " ") : "    ";
              const afterNumRaw = l.afterLineNumber ? l.afterLineNumber.toString().padStart(4, " ") : "    ";
              const beforeNum = `\x1b[2m${beforeNumRaw}\x1b[0m`;
              const afterNum = `\x1b[2m${afterNumRaw}\x1b[0m`;
              let tokensToRender;
              if (l.type === "common" && l.afterLineNumber && afterTokens) {
                const mi = mapAfter.get(l.afterLineNumber);
                if (mi && mi - 1 >= 0 && mi - 1 < afterTokens.tokens.length) tokensToRender = afterTokens.tokens[mi - 1];
              } else if (l.type === "added" && l.afterLineNumber && afterTokens) {
                const mi = mapAfter.get(l.afterLineNumber);
                if (mi && mi - 1 >= 0 && mi - 1 < afterTokens.tokens.length) tokensToRender = afterTokens.tokens[mi - 1];
              } else if (l.type === "removed" && l.beforeLineNumber && beforeTokens) {
                const mi = mapBefore.get(l.beforeLineNumber);
                if (mi && mi - 1 >= 0 && mi - 1 < beforeTokens.tokens.length) tokensToRender = beforeTokens.tokens[mi - 1];
              }
              if (!tokensToRender) tokensToRender = [{
                content: l.content
              }];
              const applyBgTint = token => {
                // For added/removed rows, avoid per-token backgrounds entirely to
                // keep the row background continuous.
                if (l.type === "added" || l.type === "removed") return "";
                return bg(token.bgColor);
              };
              const rendered = tokensToRender.map(t => `${fg(t.color)}${applyBgTint(t)}${t.content}\x1b[0m`).join("");
              switch (l.type) {
                case "added":
                  kinds[idx] = "added";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}${signFgAdd}+${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj} ${rendered}`;
                case "removed":
                  kinds[idx] = "removed";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}${signFgRemove}-${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj} ${rendered}`;
                case "gap":
                  kinds[idx] = "other";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m⋯ ${(_a = l.gapCount) !== null && _a !== void 0 ? _a : 0} lines truncated ⋯\x1b[0m`;
                default:
                  kinds[idx] = l.type === "common" ? "other" : "other";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m \x1b[0m ${rendered}`;
              }
            });
            const tSet = Date.now();
            setHighlightEntry(path, {
              lines,
              kinds,
              total: lines.length
            });
            perf("shiki.cacheSet", {
              path,
              durMs: Date.now() - tSet,
              lines: lines.length
            });
          } catch (_err) {
            // fallback to plain precomputed variant
            computingRef.current.delete(path);
          } finally {
            computingRef.current.delete(path);
          }
        }))();
        highlightPendingRef.current.set(pendingKey, p);
        p.finally(() => highlightPendingRef.current.delete(pendingKey)).catch(() => highlightPendingRef.current.delete(pendingKey));
      }, [currentChange, createDiffLines, isLightTheme, getCodeToTokens, highlightReady, highlightCache[currentChange === null || currentChange === void 0 ? void 0 : currentChange.path], bg, computeContextLines, fg, filterDiffLinesWithContext, gateForChange, idle, perf, setHighlightEntry, signFgAdd, signFgRemove]);
      const preloadHighlight = c => {
        if (!highlightReady) return;
        const path = c.path;
        const pendingKey = `${path}|${isLightTheme ? "L" : "D"}`;
        if (highlightCache[path] || computingRef.current.has(path) || highlightPendingRef.current.has(pendingKey)) return;
        const gate = gateForChange(c);
        if (gate.gated) return;
        computingRef.current.add(path);
        void (() => __awaiter(void 0, void 0, void 0, function* () {
          try {
            const t0 = Date.now();
            const codeToTokens = yield getCodeToTokens();
            perf("import.shiki.preload", {
              durMs: Date.now() - t0
            });
            const lang = (0, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .inferLanguageFromPath */.Ak)(path);
            if (c.after === undefined) {
              setHighlightEntry(path, {
                lines: ["[deleted]"],
                kinds: ["removed"],
                total: 1
              });
              return;
            }
            if (c.before === undefined) {
              const tTok0 = Date.now();
              const afterTokens = yield codeToTokens(c.after, {
                lang,
                theme: isLightTheme ? "light-plus" : "github-dark-default"
              });
              perf("shiki.tokens.preload", {
                path,
                durMs: Date.now() - tTok0
              });
              const lines = afterTokens.tokens.map((lineTokens, idx) => {
                const afterNum = (idx + 1).toString().padStart(4, " ");
                const content = lineTokens.map(t => `${fg(t.color)}${bg(t.bgColor)}${t.content}\x1b[0m`).join("");
                return `${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m \x1b[0m ${content}`;
              });
              const kinds = new Array(lines.length).fill("added");
              const tSet = Date.now();
              setHighlightEntry(path, {
                lines,
                kinds,
                total: lines.length
              });
              perf("shiki.cacheSet.preload", {
                path,
                durMs: Date.now() - tSet,
                lines: lines.length
              });
              return;
            }
            const shikiTheme = isLightTheme ? "light-plus" : "github-dark-default";
            let diffEntry = diffCacheRef.current.get(path);
            if (!diffEntry) {
              const diffLines = createDiffLines(c.before, c.after);
              const contextLines = computeContextLines(diffLines);
              const filtered = filterDiffLinesWithContext(diffLines, contextLines);
              diffEntry = {
                diffLines,
                filtered,
                contextLines
              };
              diffCacheRef.current.set(path, diffEntry);
            }
            const {
              filtered
            } = diffEntry;
            const afterIdxsRaw = [];
            const beforeIdxsRaw = [];
            for (const l of filtered) {
              if (l.afterLineNumber != null) afterIdxsRaw.push(l.afterLineNumber - 1);
              if (l.beforeLineNumber != null) beforeIdxsRaw.push(l.beforeLineNumber - 1);
            }
            const afterIdxs = [];
            const beforeIdxs = [];
            const seenA = new Set();
            const seenB = new Set();
            for (const i of afterIdxsRaw) if (!seenA.has(i)) {
              seenA.add(i);
              afterIdxs.push(i);
            }
            for (const i of beforeIdxsRaw) if (!seenB.has(i)) {
              seenB.add(i);
              beforeIdxs.push(i);
            }
            const afterLinesAll = c.after.split(/\r?\n/);
            const beforeLinesAll = c.before.split(/\r?\n/);
            const afterSlice = afterIdxs.map(i => {
              var _a;
              return (_a = afterLinesAll[i]) !== null && _a !== void 0 ? _a : "";
            }).join("\n");
            const beforeSlice = beforeIdxs.map(i => {
              var _a;
              return (_a = beforeLinesAll[i]) !== null && _a !== void 0 ? _a : "";
            }).join("\n");
            const mapAfter = new Map();
            const mapBefore = new Map();
            for (let i = 0; i < afterIdxs.length; i++) mapAfter.set(afterIdxs[i] + 1, i + 1);
            for (let i = 0; i < beforeIdxs.length; i++) mapBefore.set(beforeIdxs[i] + 1, i + 1);
            let beforeTokens = null;
            let afterTokens = null;
            let durTotal = 0;
            yield idle();
            if (afterIdxs.length > 0) {
              const tA = Date.now();
              afterTokens = yield codeToTokens(afterSlice, {
                lang,
                theme: shikiTheme
              });
              durTotal += Date.now() - tA;
            }
            yield idle();
            if (beforeIdxs.length > 0) {
              const tB = Date.now();
              beforeTokens = yield codeToTokens(beforeSlice, {
                lang,
                theme: shikiTheme
              });
              durTotal += Date.now() - tB;
            }
            perf("shiki.tokens.preload", {
              path,
              durMs: durTotal
            });
            const kinds = new Array(filtered.length);
            const lines = filtered.map((l, idx) => {
              var _a;
              const beforeNum = l.beforeLineNumber ? l.beforeLineNumber.toString().padStart(4, " ") : "    ";
              const afterNum = l.afterLineNumber ? l.afterLineNumber.toString().padStart(4, " ") : "    ";
              let tokensToRender;
              if (l.type === "common" && l.afterLineNumber && afterTokens) {
                const mi = mapAfter.get(l.afterLineNumber);
                if (mi && mi - 1 >= 0 && mi - 1 < afterTokens.tokens.length) tokensToRender = afterTokens.tokens[mi - 1];
              } else if (l.type === "added" && l.afterLineNumber && afterTokens) {
                const mi = mapAfter.get(l.afterLineNumber);
                if (mi && mi - 1 >= 0 && mi - 1 < afterTokens.tokens.length) tokensToRender = afterTokens.tokens[mi - 1];
              } else if (l.type === "removed" && l.beforeLineNumber && beforeTokens) {
                const mi = mapBefore.get(l.beforeLineNumber);
                if (mi && mi - 1 >= 0 && mi - 1 < beforeTokens.tokens.length) tokensToRender = beforeTokens.tokens[mi - 1];
              }
              if (!tokensToRender) tokensToRender = [{
                content: l.content
              }];
              const applyBgTint = token => {
                if (l.type === "added" || l.type === "removed") return "";
                return bg(token.bgColor);
              };
              const rendered = tokensToRender.map(t => `${fg(t.color)}${applyBgTint(t)}${t.content}\x1b[0m`).join("");
              switch (l.type) {
                case "added":
                  kinds[idx] = "added";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_GREEN */.ki}+${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj} ${rendered}`;
                case "removed":
                  kinds[idx] = "removed";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RED */.s0}-${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj} ${rendered}`;
                case "gap":
                  kinds[idx] = "other";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m⋯ ${(_a = l.gapCount) !== null && _a !== void 0 ? _a : 0} lines truncated ⋯\x1b[0m`;
                default:
                  kinds[idx] = "other";
                  return `${beforeNum} ${afterNum} ${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW}\x1b[2m \x1b[0m ${rendered}`;
              }
            });
            const tSet = Date.now();
            setHighlightEntry(path, {
              lines,
              kinds,
              total: lines.length
            });
            perf("shiki.cacheSet.preload", {
              path,
              durMs: Date.now() - tSet,
              lines: lines.length
            });
          } catch (_a) {} finally {
            computingRef.current.delete(path);
          }
        }))();
      };
      const {
        cursorOffset: promptCursorOffset
      } = (0, _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_10__ /* .useTextInput */.t)(promptValue, setPromptValue, {
        focus: promptActive,
        showCursor: true,
        highlightPastedText: false,
        allowExplicitNewline: false,
        onSubmit: v => {
          const vv = v.trim();
          if (vv.length > 0 && currentChange) {
            const s = concat.sections[selectedIndex];
            const top = lastViewportTopRef.current;
            if (s) {
              const visTop = Math.max(s.start, top);
              const visBot = Math.min(s.end - 1, top + contentHeight - 1);
              const startLine = Math.max(1, visTop - s.start + 1);
              const endLine = Math.max(startLine, visBot - s.start + 1);
              const msg = (0, _utils_prompt_utils_js__WEBPACK_IMPORTED_MODULE_14__ /* .formatReviewPrompt */.C)(currentChange.path, vv, {
                startLine,
                endLine
              });
              if (pendingDecisions.length > 0) {
                for (const d of pendingDecisions) rejectPendingDecision(d.id, "auto-rejected before follow-up");
              }
              onSubmitPrompt(msg);
              setFeedback(chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim(formatFollowUpFeedback(msg, vv)));
              if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
              feedbackTimerRef.current = setTimeout(() => setFeedback(null), 1800);
              setPromptValue("");
            } else {
              const msg = (0, _utils_prompt_utils_js__WEBPACK_IMPORTED_MODULE_14__ /* .formatReviewPrompt */.C)(currentChange.path, vv);
              if (pendingDecisions.length > 0) {
                for (const d of pendingDecisions) rejectPendingDecision(d.id, "auto-rejected before follow-up");
              }
              onSubmitPrompt(msg);
              setFeedback(chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim(formatFollowUpFeedback(msg, vv)));
              if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
              feedbackTimerRef.current = setTimeout(() => setFeedback(null), 1800);
              setPromptValue("");
            }
          } else {
            return;
          }
        },
        onCtrlC: () => {
          setPromptValue("");
          setPromptActive(false);
        }
      });
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        return () => {
          if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        };
      }, []);
      // keep/undo modal flow removed
      const goToFile = nextIndex => {
        const n = changes.length;
        if (n === 0) return;
        const wrapped = (nextIndex % n + n) % n;
        setSelectedIndex(wrapped);
        setReviewSelectedIndex(wrapped);
      };
      const enableCtrlCQuit = "darwin" !== "win32"; // avoid clobbering copy on Windows
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useInput */.Ge)((input, key) => {
        if (!highlightReady) setHighlightReady(true);
        if (promptActive) {
          // Ctrl+R exits review immediately even if prompt is active
          if (key.ctrl && (input === "r" || input === "R") || input === "\u0012") {
            onExit();
            return;
          }
          if (key.escape) {
            if (vimEnabled) {
              if (mode === "normal") {
                setPromptValue("");
                setPromptActive(false);
              }
            } else {
              setPromptValue("");
              setPromptActive(false);
            }
            return;
          }
          if (key.return) {
            const vv = promptValue.trim();
            if (vv.length === 0) return;
            return;
          }
          if (enableCtrlCQuit && key.ctrl && input === "c") {
            setPromptValue("");
            setPromptActive(false);
            return;
          }
          return;
        }
        // Ctrl+R exits review mode
        if (key.ctrl && (input === "r" || input === "R") || input === "\u0012") {
          onExit();
          return;
        }
        if (input === "i") {
          setCommandBuffer("");
          setPromptValue("");
          setPromptActive(true);
          setShowHelp(false);
          setMode("insert");
          return;
        }
        if (key.return) {
          setCommandBuffer("");
          setPromptValue("");
          setPromptActive(true);
          setShowHelp(false);
          setMode("insert");
          return;
        }
        if (showHelp && (input === "q" || enableCtrlCQuit && key.ctrl && input === "c" || key.escape || key.backspace)) {
          setShowHelp(false);
          return;
        }
        if (key.escape || input === "q" || enableCtrlCQuit && key.ctrl && input === "c") {
          onExit();
          return;
        }
        if (input === "?") {
          setShowHelp(prev => !prev);
          return;
        }
        if ((key.tab || input === "\t") && !promptActive) {
          const next = (selectedIndex + 1) % changes.length;
          goToFile(next);
          return;
        }
        if ((key.shift && (key.tab || input === "\t") || input === "\x1b[Z") && !promptActive) {
          const prev = selectedIndex - 1 < 0 ? changes.length - 1 : selectedIndex - 1;
          goToFile(prev);
          return;
        }
        // Vim-style file navigation
        if ((input === "h" || input === "H") && !promptActive) {
          const prev = selectedIndex - 1 < 0 ? changes.length - 1 : selectedIndex - 1;
          goToFile(prev);
          return;
        }
        if ((input === "l" || input === "L") && !promptActive) {
          const next = (selectedIndex + 1) % changes.length;
          goToFile(next);
          return;
        }
        // Disable keep/undo staging via A/Z for now
        if (key.leftArrow) {
          const prev = selectedIndex - 1 < 0 ? changes.length - 1 : selectedIndex - 1;
          goToFile(prev);
          return;
        }
        if (key.rightArrow) {
          const next = (selectedIndex + 1) % changes.length;
          goToFile(next);
          return;
        }
      });
      // promptLineRight is computed on demand to avoid ordering issues
      const pagerRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      return currentChange ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(PagerFileView, {
        ref: pagerRef,
        contentHeight: contentHeight,
        totalLines: currentTotalLines,
        topHeaderLeft: `${changes.length} ${changes.length === 1 ? "file" : "files"} edited`,
        topHeaderRight: "esc when done",
        precomputedLines: concat.lines,
        precomputedKinds: concat.kinds,
        sections: concat.sections.map(s => ({
          start: s.start,
          end: s.end,
          defaultKind: s.defaultKind
        })),
        activeSectionIndex: selectedIndex,
        commandBuffer: commandBuffer,
        onCommandBufferChange: setCommandBuffer,
        inputDisabled: false,
        wrapLines: wrapLines,
        wrapDeferRest: !wrapReady,
        overlayTitle: usingOverlayHelp ? "Help" : undefined,
        overlayLines: usingOverlayHelp ? helpModalLines : null,
        onViewportTopChange: top => {
          lastViewportTopRef.current = top;
          const bottom = top + contentHeight;
          for (let i = 0; i < concat.sections.length; i++) {
            const s = concat.sections[i];
            if (s.start < bottom + 5 && s.end > top - 5) {
              const ch = changes[i];
              const p = ch === null || ch === void 0 ? void 0 : ch.path;
              if (p) ensurePrecomputed(ch);
              if (p && !highlightCache[p] && !computingRef.current.has(p) && !highlightPendingRef.current.has(`${p}|${isLightTheme ? "L" : "D"}`)) preloadHighlight(ch);
            }
          }
        },
        onUserScroll: () => {},
        onJumpApplied: () => {
          // no-op placeholder for now; could add analytics or feedback later
        },
        bottomLines: (() => {
          var _a;
          // Middle header line is removed per design; hints move below input
          const baseHint = ` ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.white.bold("↑/↓")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("scroll ·")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.white.bold("←/→")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("switch file")}`;
          const genHint = ` ${hexagonFrame} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.bold("Generating")}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("  — ")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.white.bold("↑/↓")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("scroll")}`;
          const showGen = _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .TEST_FILE_REVIEW_GENERATING */.Eo || isGenerating;
          const pendingCount = pendingDecisions.length;
          const pendingHint = pendingCount > 0 ? ` ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow(hexagonFrame)} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow.bold("Pending decision")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow(`(${pendingCount})`)}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim("  — ")} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("ctrl-r to respond")}` : null;
          const infoLine = `${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj}` + (pendingHint ? pendingHint : showGen ? genHint : baseHint) + `${_constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .ANSI_RESET */.Sj}`;
          const exitLineRight = promptLineRightFn();
          const symbol = "→";
          // Light theme parity with PromptBar: use dark borders on light backgrounds
          const borderActiveFn = isLightTheme ? chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.black : chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.white;
          const borderInactiveFn = chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.gray;
          // Match PromptBar prompt symbol color: use foreground, dimmed when empty
          const symbolDisplay = promptValue.length === 0 ? borderActiveFn.dim(symbol) : borderActiveFn(symbol);
          const leftContent = `${exitLineRight}`;
          const strip = stripAnsi;
          const innerWidth = innerWidthCells;
          const borderFn = promptActive ? borderActiveFn : borderInactiveFn;
          const top = borderFn(`┌${"─".repeat(innerWidth)}┐`);
          const bar = borderFn("│");
          const lines = [];
          // Render feedback one line above the input box
          if (feedback) {
            lines.push(` ${feedback}`);
          }
          // Wrap the left content across available width. On the first line we may reserve space for the right placeholder.
          const wrapSegments = (() => {
            const text = leftContent;
            const segs = [];
            const ESC = 0x1b;
            let i = 0;
            let col = 0;
            let start = 0;
            let usedFirst = false;
            const capForCurrent = () => {
              const rightPad = rightFixedPadCols; // fixed right padding
              const arrow = arrowCols; // fixed left arrow area
              const base = innerWidth - rightPad - arrow;
              if (usedFirst) return Math.max(0, base);
              const firstBase = showRightPlaceholder ? Math.max(0, base - rightPlaceholderLen - rightPlaceholderPad + 2) : base;
              return Math.max(0, firstBase);
            };
            while (i < text.length) {
              const ch = text.charCodeAt(i);
              if (ch === ESC && text[i + 1] === "[") {
                let j = i + 2;
                while (j < text.length && text[j] !== "m") j++;
                i = Math.min(text.length, j + 1);
                continue;
              }
              i++;
              col++;
              const cap = capForCurrent();
              if (cap <= 0) {
                // No space for any left content on this line; push empty and continue
                segs.push("");
                usedFirst = true;
                col = 0;
                start = i; // drop previous content entirely
                continue;
              }
              if (col > cap) {
                segs.push(text.slice(start, i - 1));
                usedFirst = true;
                start = i - 1;
                col = 1;
              }
            }
            segs.push(text.slice(start));
            return segs;
          })();
          // Build the middle box rows
          lines.push(top);
          for (let idx = 0; idx < wrapSegments.length; idx++) {
            const seg = (_a = wrapSegments[idx]) !== null && _a !== void 0 ? _a : "";
            const segLen = strip(seg).length;
            const isFirst = idx === 0;
            const leftArrow = ` ${symbolDisplay} `; // 3 cols: leading space + arrow + space
            if (isFirst && showRightPlaceholder) {
              const tailPad = Math.max(0, rightPlaceholderPad + rightFixedPadCols - 2);
              const between = Math.max(0, innerWidth - arrowCols - segLen - rightPlaceholderLen - tailPad);
              const mid = `${bar}${leftArrow}${seg}\x1b[0m${" ".repeat(between)}${rightPlaceholderLabel}${" ".repeat(tailPad)}${bar}`;
              lines.push(mid);
            } else {
              const leftPrefix = isFirst ? leftArrow : " ".repeat(arrowCols);
              const padAfter = Math.max(0, innerWidth - arrowCols - segLen - rightFixedPadCols);
              const mid = `${bar}${leftPrefix}${seg}\x1b[0m${" ".repeat(padAfter + rightFixedPadCols)}${bar}`;
              lines.push(mid);
            }
          }
          const bot = borderFn(`└${"─".repeat(innerWidth)}┘`);
          const footer = infoLine;
          lines.push(bot, footer);
          return lines;
        })(),
        promptActive: promptActive,
        rowBgAdd: rowBgAdd,
        rowBgRemove: rowBgRemove
      }) : null;
    };
    const isCombining = cp => cp >= 0x0300 && cp <= 0x036f || cp >= 0xfe20 && cp <= 0xfe2f || cp === 0x200d || cp >= 0xfe0e && cp <= 0xfe0f;
    const isFullWidth = cp => {
      if (cp >= 0x1100 && (cp <= 0x115f || cp === 0x2329 || cp === 0x232a || cp >= 0x2e80 && cp <= 0xa4cf || cp >= 0xac00 && cp <= 0xd7a3 || cp >= 0xf900 && cp <= 0xfaff || cp >= 0xfe10 && cp <= 0xfe19 || cp >= 0xfe30 && cp <= 0xfe6f || cp >= 0xff01 && cp <= 0xff60 || cp >= 0xffe0 && cp <= 0xffe6)) return true;
      return false;
    };
    const PagerFileView = react__WEBPACK_IMPORTED_MODULE_2__.forwardRef(({
      contentHeight,
      totalLines,
      topHeaderLeft,
      topHeaderRight,
      precomputedLines,
      precomputedKinds,
      sections,
      activeSectionIndex,
      commandBuffer,
      onCommandBufferChange,
      inputDisabled,
      promptActive,
      bottomLines,
      wrapLines,
      wrapDeferRest,
      onViewportTopChange,
      onViewportStatsChange,
      onJumpApplied,
      onUserScroll,
      overlayTitle,
      overlayLines,
      rowBgAdd,
      rowBgRemove
    }, ref) => {
      const [scroll, setScroll] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      const wheelStepRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(3);
      const linesForRenderRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(precomputedLines);
      const kindsForRenderRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(precomputedKinds);
      // Compute display width accounting for ANSI, fullwidth, emojis, combining
      const stripAnsiRe = /\x1b\[[0-9;]*m/g;
      // Memoize the regex so its identity is stable across renders, preventing
      // downstream memo/effect churn that can trigger unnecessary redraws.
      const extendedPictographicRe = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(() => {
        try {
          return /\p{Extended_Pictographic}/u;
        } catch (_a) {
          return null;
        }
      }, []);
      const stringVisibleWidth = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(s => {
        const stripped = s.replace(stripAnsiRe, "");
        let w = 0;
        for (const ch of stripped) {
          const cp = ch.codePointAt(0);
          if (isCombining(cp)) continue;
          if (extendedPictographicRe === null || extendedPictographicRe === void 0 ? void 0 : extendedPictographicRe.test(ch)) {
            w += 2;
            continue;
          }
          w += isFullWidth(cp) ? 2 : 1;
        }
        return w;
      }, [extendedPictographicRe]);
      // biome-ignore lint/correctness/useExhaustiveDependencies: renderedMemo is assigned later
      const clampScroll = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(candidate => {
        const effectiveTotal = wrapLines ? renderedMemo.lines.length || precomputedLines.length || totalLines : totalLines;
        const maxOffset = Math.max(0, effectiveTotal - contentHeight);
        return Math.min(Math.max(0, candidate), maxOffset);
      }, [wrapLines, precomputedLines.length, totalLines, contentHeight]);
      const scrollBy = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(delta => {
        setScroll(prev => {
          const next = clampScroll(prev + delta);
          if (next !== prev) {
            onUserScroll === null || onUserScroll === void 0 ? void 0 : onUserScroll();
            return next;
          }
          return prev;
        });
      }, [clampScroll, onUserScroll]);
      // Update wheel step based on available content height
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        const step = Math.max(1, Math.floor(contentHeight / 10));
        wheelStepRef.current = step;
      }, [contentHeight]);
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useInput */.Ge)((input, key) => {
        var _a, _b;
        if (inputDisabled) {
          return;
        }
        if (promptActive) {
          if (key.upArrow) {
            scrollBy(-1);
            return;
          }
          if (key.downArrow) {
            scrollBy(1);
            return;
          }
          if (key.ctrl && input === "f") {
            scrollBy(Math.max(1, contentHeight - 1));
            return;
          }
          if (key.ctrl && input === "b") {
            scrollBy(-Math.max(1, contentHeight - 1));
            return;
          }
          if (key.ctrl && input === "d") {
            scrollBy(Math.max(1, Math.floor(contentHeight / 2)));
            return;
          }
          if (key.ctrl && input === "u") {
            scrollBy(-Math.max(1, Math.floor(contentHeight / 2)));
            return;
          }
          return;
        }
        if (/^[0-9]$/.test(input)) {
          onCommandBufferChange(commandBuffer + input);
          return;
        }
        if (key.backspace || key.delete) {
          onCommandBufferChange(commandBuffer.slice(0, -1));
          return;
        }
        // Space / f / b page navigation (less-like)
        if (input === " ") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count * Math.max(1, contentHeight - 1));
          return;
        }
        if (input === "f") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count * Math.max(1, contentHeight - 1));
          return;
        }
        if (input === "b") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(-count * Math.max(1, contentHeight - 1));
          return;
        }
        if (input === "j") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count);
          return;
        }
        if (input === "k") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(-count);
          return;
        }
        if (key.upArrow) {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(-count);
          return;
        }
        if (key.downArrow) {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count);
          return;
        }
        // Page / half-page scrolling (with optional count prefix)
        if (key.ctrl && input === "f") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count * Math.max(1, contentHeight - 1));
          return;
        }
        if (key.ctrl && input === "b") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(-count * Math.max(1, contentHeight - 1));
          return;
        }
        if (key.ctrl && input === "d") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count * Math.max(1, Math.floor(contentHeight / 2)));
          return;
        }
        if (key.ctrl && input === "u") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(-count * Math.max(1, Math.floor(contentHeight / 2)));
          return;
        }
        // Single line scroll with Ctrl-e / Ctrl-y
        if (key.ctrl && input === "e") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count);
          return;
        }
        if (key.ctrl && input === "y") {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(-count);
          return;
        }
        // PageUp/PageDown keys if available
        const kpd = key;
        if (kpd.pageDown) {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(count * Math.max(1, contentHeight - 1));
          return;
        }
        if (kpd.pageUp) {
          const count = parseInt(commandBuffer || "1", 10);
          onCommandBufferChange("");
          scrollBy(-count * Math.max(1, contentHeight - 1));
          return;
        }
        // Top / bottom navigation
        if (input === "g") {
          onCommandBufferChange("");
          setScroll(0);
          return;
        }
        if (input === "G") {
          const count = parseInt(commandBuffer || "0", 10);
          onCommandBufferChange("");
          if (count > 0) {
            const targetTop = count - 1;
            setScroll(clampScroll(targetTop));
          } else {
            const effectiveTotal = wrapLines ? (_b = (_a = linesForRenderRef.current) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : totalLines : totalLines;
            setScroll(clampScroll(effectiveTotal));
          }
          return;
        }
      });
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdout */.t$)();
      const screen = (0, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_8__ /* .useScreenSize */.l)();
      const mappingRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)({
        start: [],
        count: []
      });
      // Cache of visible widths for each rendered line (wrapped or unwrapped)
      const visibleWidthsRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)([]);
      const renderedMemo = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        var _a, _b, _c, _d, _e, _f;
        if (!wrapLines) {
          const n = precomputedLines.length;
          const start = new Array(n);
          const count = new Array(n);
          for (let i = 0; i < n; i++) {
            start[i] = i;
            count[i] = 1;
          }
          return {
            lines: precomputedLines,
            kinds: precomputedKinds,
            start,
            count
          };
        }
        const width = Math.max(1, ((_b = (_a = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _a !== void 0 ? _a : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _b !== void 0 ? _b : 80) - 4); // account for borders + inner margins
        const out = [];
        const outKinds = [];
        const start = new Array(precomputedLines.length);
        const count = new Array(precomputedLines.length);
        let renderedIndex = 0;
        const activeSection = sections[activeSectionIndex] || {
          start: 0,
          end: 0
        };
        // Hoist helpers/regexes used inside the per-line loop
        const stripAnsiFn = s => s.replace(/\x1b\[[0-9;]*m/g, "");
        const gapCount = Math.max(1, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DIFF_SPACER */.rW.length);
        const reModified = new RegExp(`^\\s*\\d{4}\\s\\d{4}\\s{${gapCount}}(?:[+-]\\s)?`);
        const reCreated = new RegExp(`^\\s{5}\\d{4}\\s{${gapCount}}`);
        // We need index while iterating, so use classic for
        for (let li = 0; li < precomputedLines.length; li++) {
          const line = precomputedLines[li];
          start[li] = renderedIndex;
          let produced = 0;
          const inActive = li >= activeSection.start && li < activeSection.end;
          if (wrapDeferRest && !inActive) {
            out.push(line);
            outKinds.push((_c = precomputedKinds[li]) !== null && _c !== void 0 ? _c : "other");
            produced++;
            renderedIndex++;
            count[li] = produced;
            continue;
          }
          if (line.length === 0) {
            out.push("");
            outKinds.push((_d = precomputedKinds[li]) !== null && _d !== void 0 ? _d : "other");
            produced++;
            renderedIndex++;
            count[li] = produced;
            continue;
          }
          // Compute visible column where content starts, based on our line format:
          // "bbbb aaaa  [+/- ] content" or for created: "     aaaa  content"
          // Respect the DIFF_SPACER width instead of hard-coding gaps
          const visible = stripAnsiFn(line);
          let contentStartCol = null;
          const m1 = visible.match(reModified);
          if (m1) contentStartCol = m1[0].length;
          if (contentStartCol == null) {
            const m2 = visible.match(reCreated); // created file format
            if (m2) contentStartCol = m2[0].length;
          }
          if (contentStartCol == null) contentStartCol = 12; // conservative fallback
          const extraWrapPad = 2; // additional padding for wrapped lines
          const indentPrefix = " ".repeat(contentStartCol + extraWrapPad);
          const indentWidth = contentStartCol + extraWrapPad;
          const contentWidthAfterIndent = Math.max(1, width - indentWidth);
          let i = 0;
          let segStart = 0;
          let col = 0;
          let active = "";
          let segPrefix = "";
          let usedIndent = false;
          let lastSpaceRaw = -1;
          let lastSpaceCol = -1;
          // Helper to compute width at code unit offset i while preserving raw indices
          const charWidthAt = (src, idx) => {
            const ch1 = src.charCodeAt(idx);
            if (Number.isNaN(ch1)) return {
              advance: 1,
              w: 0,
              isSpace: false
            };
            // ANSI CSI start
            if (ch1 === 0x1b && src.charCodeAt(idx + 1) === 0x5b) {
              let j = idx + 2;
              while (j < src.length && src[j] !== "m") j++;
              return {
                advance: Math.min(src.length - idx, j - idx + 1),
                w: 0,
                isSpace: false
              };
            }
            // Surrogate pair
            const isHigh = ch1 >= 0xd800 && ch1 <= 0xdbff;
            let advance = 1;
            let cp = ch1;
            if (isHigh && idx + 1 < src.length) {
              const low = src.charCodeAt(idx + 1);
              if (low >= 0xdc00 && low <= 0xdfff) {
                advance = 2;
                cp = 0x10000 + (ch1 - 0xd800 << 10) + (low - 0xdc00);
              }
            }
            if (cp === 0x20) return {
              advance,
              w: 1,
              isSpace: true
            };
            if (isCombining(cp) || cp === 0x200d) return {
              advance,
              w: 0,
              isSpace: false
            };
            if (isFullWidth(cp)) return {
              advance,
              w: 2,
              isSpace: false
            };
            const charStr = src.slice(idx, idx + advance);
            if (extendedPictographicRe === null || extendedPictographicRe === void 0 ? void 0 : extendedPictographicRe.test(charStr)) return {
              advance,
              w: 2,
              isSpace: false
            };
            return {
              advance,
              w: 1,
              isSpace: false
            };
          };
          while (i < line.length) {
            if (line[i] === "\x1b" && line[i + 1] === "[") {
              let j = i + 2;
              while (j < line.length && line[j] !== "m") j++;
              if (j < line.length) {
                const code = line.slice(i, j + 1);
                if (code === "\x1b[0m") active = "";else active += code;
                i = j + 1;
                continue;
              } else {
                break;
              }
            }
            const {
              advance,
              w: wch,
              isSpace
            } = charWidthAt(line, i);
            i += advance;
            col += wch;
            if (isSpace) {
              lastSpaceRaw = i;
              lastSpaceCol = col;
            }
            const currentWidth = usedIndent ? contentWidthAfterIndent : width;
            if (col >= currentWidth) {
              const cutRaw = lastSpaceRaw > segStart ? lastSpaceRaw : i;
              const consumed = lastSpaceRaw > segStart ? lastSpaceCol : currentWidth;
              out.push(`${segPrefix + line.slice(segStart, cutRaw)}\x1b[0m`);
              outKinds.push((_e = precomputedKinds[li]) !== null && _e !== void 0 ? _e : "other");
              produced++;
              segStart = cutRaw;
              col -= consumed;
              segPrefix = indentPrefix + active;
              usedIndent = true;
              lastSpaceRaw = -1;
              lastSpaceCol = -1;
              renderedIndex++;
            }
          }
          if (segStart < line.length) {
            out.push(`${segPrefix + line.slice(segStart)}\x1b[0m`);
            outKinds.push((_f = precomputedKinds[li]) !== null && _f !== void 0 ? _f : "other");
            produced++;
            renderedIndex++;
          }
          count[li] = produced;
        }
        return {
          lines: out,
          kinds: outKinds,
          start,
          count
        };
      }, [precomputedLines, precomputedKinds, wrapLines, wrapDeferRest, activeSectionIndex, sections, screen === null || screen === void 0 ? void 0 : screen.width, stdout === null || stdout === void 0 ? void 0 : stdout.columns, extendedPictographicRe]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        mappingRef.current = {
          start: renderedMemo.start,
          count: renderedMemo.count
        };
      }, [renderedMemo]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        var _a;
        linesForRenderRef.current = wrapLines ? renderedMemo.lines : precomputedLines;
        kindsForRenderRef.current = wrapLines ? (_a = renderedMemo.kinds) !== null && _a !== void 0 ? _a : [] : precomputedKinds;
        // Only clamp scroll if it's actually out of bounds to prevent jittering
        setScroll(s => {
          const clamped = clampScroll(s);
          return clamped !== s ? clamped : s;
        });
      }, [renderedMemo, precomputedLines, precomputedKinds, wrapLines, clampScroll]);
      // Precompute visible widths for all lines once per render-set so scroll doesn't recompute them
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        var _a;
        const lines = wrapLines ? renderedMemo.lines : precomputedLines;
        const widths = new Array(lines.length);
        for (let i = 0; i < lines.length; i++) {
          widths[i] = stringVisibleWidth((_a = lines[i]) !== null && _a !== void 0 ? _a : "");
        }
        visibleWidthsRef.current = widths;
      }, [renderedMemo, precomputedLines, wrapLines, stringVisibleWidth]);
      const sectionWrappedBounds = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        var _a, _b, _c;
        const start = new Array(sections.length);
        const end = new Array(sections.length);
        if (wrapLines) {
          for (let i = 0; i < sections.length; i++) {
            const s = sections[i];
            start[i] = (_a = renderedMemo.start[s.start]) !== null && _a !== void 0 ? _a : 0;
            end[i] = ((_b = renderedMemo.start[s.end - 1]) !== null && _b !== void 0 ? _b : 0) + ((_c = renderedMemo.count[s.end - 1]) !== null && _c !== void 0 ? _c : 1);
          }
        } else {
          for (let i = 0; i < sections.length; i++) {
            const s = sections[i];
            start[i] = s.start;
            end[i] = s.end;
          }
        }
        const total = wrapLines ? renderedMemo.lines.length : precomputedLines.length;
        return {
          start,
          end,
          total
        };
      }, [sections, wrapLines, renderedMemo, precomputedLines]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        onViewportTopChange === null || onViewportTopChange === void 0 ? void 0 : onViewportTopChange(scroll);
        const total = sectionWrappedBounds.total;
        const startWrapped = sectionWrappedBounds.start;
        const endWrapped = sectionWrappedBounds.end;
        const top = scroll;
        const bottom = Math.min(top + contentHeight, total);
        const vis = new Array(sections.length).fill(0);
        for (let i = 0; i < sections.length; i++) {
          const ov = Math.max(0, Math.min(endWrapped[i], bottom) - Math.max(startWrapped[i], top));
          vis[i] = ov;
        }
        let dominantIndex = 0;
        let maxVal = -1;
        const center = top + contentHeight / 2;
        for (let i = 0; i < vis.length; i++) {
          const v = vis[i];
          if (v > maxVal) {
            maxVal = v;
            dominantIndex = i;
          } else if (v === maxVal && v > 0) {
            const ac = (startWrapped[i] + endWrapped[i]) / 2;
            const bc = (startWrapped[dominantIndex] + endWrapped[dominantIndex]) / 2;
            if (Math.abs(ac - center) < Math.abs(bc - center)) dominantIndex = i;
          }
        }
        onViewportStatsChange === null || onViewportStatsChange === void 0 ? void 0 : onViewportStatsChange({
          top,
          vis,
          dominantIndex
        });
      }, [scroll, onViewportTopChange, onViewportStatsChange, sections, contentHeight, sectionWrappedBounds.end, sectionWrappedBounds.start, sectionWrappedBounds.total]);
      // Expose imperative scroll controls to the parent for precise navigation
      const scrollToSectionStart = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(idx => {
        var _a;
        if (idx < 0 || idx >= sections.length) return;
        const sStart = (_a = sectionWrappedBounds.start[idx]) !== null && _a !== void 0 ? _a : 0;
        setScroll(clampScroll(sStart));
        onJumpApplied === null || onJumpApplied === void 0 ? void 0 : onJumpApplied();
      }, [sections, sectionWrappedBounds, clampScroll, onJumpApplied]);
      const scrollToSectionCenter = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(idx => {
        var _a, _b;
        if (idx < 0 || idx >= sections.length) return;
        const sStart = (_a = sectionWrappedBounds.start[idx]) !== null && _a !== void 0 ? _a : 0;
        const sEnd = (_b = sectionWrappedBounds.end[idx]) !== null && _b !== void 0 ? _b : sStart;
        const sLen = Math.max(1, sEnd - sStart);
        const targetTop = Math.max(0, Math.floor(sStart + sLen / 2 - contentHeight / 2));
        setScroll(clampScroll(targetTop));
        onJumpApplied === null || onJumpApplied === void 0 ? void 0 : onJumpApplied();
      }, [sections, sectionWrappedBounds, contentHeight, clampScroll, onJumpApplied]);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useImperativeHandle)(ref, () => ({
        scrollToSectionStart,
        scrollToSectionCenter
      }), [scrollToSectionStart, scrollToSectionCenter]);
      // Snap to newly active section after layout updates to avoid stale bounds
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        var _a;
        if (activeSectionIndex < 0 || activeSectionIndex >= sections.length) return;
        const sStart = (_a = sectionWrappedBounds.start[activeSectionIndex]) !== null && _a !== void 0 ? _a : 0;
        const effectiveTotal = wrapLines ? renderedMemo.lines.length || precomputedLines.length || totalLines : totalLines;
        const maxOffset = Math.max(0, effectiveTotal - contentHeight);
        const targetTop = Math.min(Math.max(0, sStart), maxOffset);
        setScroll(targetTop);
        onJumpApplied === null || onJumpApplied === void 0 ? void 0 : onJumpApplied();
      }, [activeSectionIndex, contentHeight, onJumpApplied, precomputedLines.length, renderedMemo.lines.length, sectionWrappedBounds.start[activeSectionIndex], sections.length, totalLines, wrapLines]);
      // Manual pager rendering (content only). Keep this effect free of frequently-changing
      // state (spinner, prompt input, bottom lines) to avoid flicker while scrolling.
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        if (!stdout) return;
        const lines = wrapLines ? renderedMemo.lines : precomputedLines;
        const headerRows = topHeaderLeft ? 1 : 0;
        let out = "";
        // Start synchronized output block to reduce intermediate paints on slow terminals
        // Support: iTerm2, Apple Terminal, xterm (ignored if unsupported)
        out += "\x1b[?2026h"; // begin sync updates
        // Render static top header if requested
        if (headerRows === 1) {
          const width = Math.max(10, (_b = (_a = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _a !== void 0 ? _a : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _b !== void 0 ? _b : 80);
          const strip = s => s.replace(/\x1b\[[0-9;]*m/g, "");
          const left = topHeaderLeft !== null && topHeaderLeft !== void 0 ? topHeaderLeft : "";
          const right = topHeaderRight !== null && topHeaderRight !== void 0 ? topHeaderRight : "";
          const leftLen = strip(left).length;
          const rightLen = strip(right).length;
          const innerWidth = Math.max(0, width - 2);
          const padBetween = Math.max(0, innerWidth - leftLen - rightLen);
          const leftStyled = chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim(left);
          let rightStyled;
          if (/^esc(\s|$)/.test(right)) {
            const rest = right.slice(3);
            rightStyled = chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.white("esc") + chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim(rest);
          } else {
            rightStyled = chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.dim(right);
          }
          const line = ` ${leftStyled}${" ".repeat(padBetween)}${rightStyled} \x1b[0m`;
          out += `\x1b[1;1H\x1b[2K${line}`;
        }
        const start = scroll;
        const end = Math.min(lines.length, start + contentHeight);
        const slice = lines.slice(start, end);
        const sliceKinds = kindsForRenderRef.current.slice(start, end);
        // Hoist constant computations outside the per-row loop
        const termWidthRow = Math.max(10, (_d = (_c = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _c !== void 0 ? _c : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _d !== void 0 ? _d : 80);
        const stripBgRe = /\x1b\[(?:49|48;5;\d{1,3}|48;2;\d{1,3};\d{1,3};\d{1,3})m/g;
        const sgrRe = /\x1b\[[0-9;]*m/g;
        // Compute sticky header for the section currently at the top
        let stickyHeaderLine = null;
        let stickySectionIndex = null;
        for (let si = 0; si < sections.length; si++) {
          const sTop = (_e = sectionWrappedBounds.start[si]) !== null && _e !== void 0 ? _e : 0;
          const sBot = (_f = sectionWrappedBounds.end[si]) !== null && _f !== void 0 ? _f : 0; // exclusive
          if (start >= sTop && start < sBot) {
            const headerLogical = sections[si].start;
            const headerWrappedStart = (_g = mappingRef.current.start[headerLogical]) !== null && _g !== void 0 ? _g : headerLogical;
            const headerWrappedCount = (_h = mappingRef.current.count[headerLogical]) !== null && _h !== void 0 ? _h : 1;
            const _headerWrappedEndExclusive = headerWrappedStart + Math.max(1, headerWrappedCount);
            if (start > headerWrappedStart && start < sBot) {
              stickyHeaderLine = (_j = lines[headerWrappedStart]) !== null && _j !== void 0 ? _j : null;
              stickySectionIndex = si;
            }
            break;
          }
        }
        // Render content lines with simple 1px section margins (no borders)
        // Optimize section lookup by advancing a pointer as rows increase
        let curSectionPtr = (() => {
          var _a, _b, _c;
          // Find the first section that could contain the starting row
          let idx = 0;
          while (idx < sections.length && !(start >= ((_a = sectionWrappedBounds.start[idx]) !== null && _a !== void 0 ? _a : 0) && start < ((_b = sectionWrappedBounds.end[idx]) !== null && _b !== void 0 ? _b : 0)) && start >= ((_c = sectionWrappedBounds.end[idx]) !== null && _c !== void 0 ? _c : 0)) {
            idx++;
          }
          return idx;
        })();
        for (let i = 0; i < contentHeight; i++) {
          const absIndex = start + i;
          const row = headerRows + i + 1;
          // Advance pointer while current section ends before this row
          while (curSectionPtr < sections.length && absIndex >= ((_k = sectionWrappedBounds.end[curSectionPtr]) !== null && _k !== void 0 ? _k : 0)) {
            curSectionPtr++;
          }
          const sectionIndex = curSectionPtr < sections.length && absIndex >= ((_l = sectionWrappedBounds.start[curSectionPtr]) !== null && _l !== void 0 ? _l : 0) && absIndex < ((_m = sectionWrappedBounds.end[curSectionPtr]) !== null && _m !== void 0 ? _m : 0) ? curSectionPtr : -1;
          out += `\x1b[${row};1H\x1b[2K`;
          const content = (_o = slice[i]) !== null && _o !== void 0 ? _o : "";
          let kind = (_p = sliceKinds[i]) !== null && _p !== void 0 ? _p : "other";
          // If sticky applies, render header at the very top row
          if (i === 0 && stickyHeaderLine != null && sectionIndex === stickySectionIndex) {
            out += stickyHeaderLine;
            out += `\x1b[${row + 1};1H\x1b[2K`;
            continue;
          }
          if (sectionIndex === -1) {
            out += content;
            continue;
          }
          // Determine if this wrapped row is part of the header block; if so, just render header
          const headerLogicalIndex = sections[sectionIndex].start;
          const hdrStartWrapped = (_q = mappingRef.current.start[headerLogicalIndex]) !== null && _q !== void 0 ? _q : headerLogicalIndex;
          const hdrCountWrapped = (_r = mappingRef.current.count[headerLogicalIndex]) !== null && _r !== void 0 ? _r : 1;
          const hdrEndWrappedExclusive = hdrStartWrapped + Math.max(1, hdrCountWrapped);
          const isHeaderRow = absIndex >= hdrStartWrapped && absIndex < hdrEndWrappedExclusive;
          if (isHeaderRow) {
            const relOffset = Math.max(0, absIndex - hdrStartWrapped);
            const headerLineContent = (_t = (_s = lines[hdrStartWrapped + relOffset]) !== null && _s !== void 0 ? _s : lines[hdrStartWrapped]) !== null && _t !== void 0 ? _t : content;
            out += headerLineContent;
            continue;
          }
          // Normal content row
          if ((kind === "other" || kind == null) && sectionIndex >= 0) {
            const sec = sections[sectionIndex];
            if ((sec === null || sec === void 0 ? void 0 : sec.defaultKind) === "added" || (sec === null || sec === void 0 ? void 0 : sec.defaultKind) === "removed") {
              kind = sec.defaultKind;
            }
          }
          if ((kind === "added" || kind === "removed") && !(((_u = sections[sectionIndex]) === null || _u === void 0 ? void 0 : _u.defaultKind) === "added")) {
            const bgSeq = kind === "added" ? rowBgAdd : rowBgRemove;
            if (!bgSeq) {
              // Theme not resolved yet or no background available; render as-is to avoid flash
              out += content;
            } else {
              const visibleLen = (_v = visibleWidthsRef.current[absIndex]) !== null && _v !== void 0 ? _v : stringVisibleWidth(content);
              const pad = Math.max(0, termWidthRow - visibleLen);
              const sanitized = content.replace(stripBgRe, "");
              const inner = sanitized.replace(sgrRe, m => `${m}${bgSeq}`);
              const rendered = `${bgSeq}${inner}${" ".repeat(pad)}\x1b[0m`;
              out += rendered;
            }
          } else {
            out += content;
          }
        }
        // End synchronized output block
        out += "\x1b[?2026l";
        // Use stream cork/uncork when available to minimize flushes
        try {
          (_w = stdout.cork) === null || _w === void 0 ? void 0 : _w.call(stdout);
        } catch (_y) {}
        stdout.write(out);
        try {
          (_x = stdout.uncork) === null || _x === void 0 ? void 0 : _x.call(stdout);
        } catch (_z) {}
      }, [stdout, renderedMemo, precomputedLines, scroll, contentHeight, screen, topHeaderLeft, topHeaderRight, rowBgAdd, rowBgRemove, sections, sectionWrappedBounds, stringVisibleWidth, wrapLines]);
      // Overlay and bottom UI rendering, updated frequently (spinner, prompt text, etc.).
      // This effect draws on top of the content without forcing a content redraw.
      const ovLines = overlayLines !== null && overlayLines !== void 0 ? overlayLines : [];
      const overlayVisible = ovLines.length > 0;
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!stdout) return;
        const leftBorder = "";
        const headerRows = topHeaderLeft ? 1 : 0;
        let ovOut = "\x1b[?2026h"; // begin sync updates
        // Draw overlay if present
        if (overlayVisible) {
          const width = Math.max(10, (_b = (_a = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _a !== void 0 ? _a : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _b !== void 0 ? _b : 80);
          const strip = s => s.replace(/\x1b\[[0-9;]*m/g, "");
          const innerWidth = Math.max(24, Math.min(Math.floor(width * 0.6), 80));
          const boxHeight = ovLines.length + 3;
          const topRow = Math.max(1, Math.floor((contentHeight - boxHeight) / 2));
          const leftCol = Math.max(1, Math.floor((width - (innerWidth + 2)) / 2));
          const titleText = overlayTitle ? ` ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.bold(overlayTitle)} ` : "";
          const titleLen = strip(titleText).length;
          const titlePad = Math.max(0, innerWidth - titleLen);
          // Square corners and yellow border color
          const topBorder = `${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("┌")}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow(titleText)}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("─".repeat(titlePad))}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("┐")}`;
          const modalBottom = topRow + (ovLines.length + 3) - 1;
          for (let rr = topRow; rr <= modalBottom; rr++) {
            if (leftCol > 1) ovOut += `\x1b[${headerRows + rr};${leftCol - 1}H `;
            const rightCol = leftCol + innerWidth + 2;
            const termWidth = (_d = (_c = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _c !== void 0 ? _c : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _d !== void 0 ? _d : 80;
            if (rightCol <= termWidth) ovOut += `\x1b[${headerRows + rr};${rightCol}H `;
          }
          ovOut += `\x1b[${headerRows + topRow};${leftCol}H${topBorder}`;
          const emptyLine = `${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("│")} ${" ".repeat(Math.max(0, innerWidth - 2))} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("│")}`;
          ovOut += `\x1b[${headerRows + topRow + 1};${leftCol}H${emptyLine}`;
          let r = topRow + 2;
          for (const raw of ovLines) {
            const displayLen = strip(raw).length;
            const pad = Math.max(0, innerWidth - displayLen - 2);
            const line = `${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("│")} ${raw}${" ".repeat(pad)} ${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("│")}`;
            ovOut += `\x1b[${headerRows + r};${leftCol}H${line}`;
            r++;
          }
          const bot = `${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("└")}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("─").repeat(innerWidth)}${chalk__WEBPACK_IMPORTED_MODULE_15__ /* ["default"] */.Ay.yellow("┘")}`;
          ovOut += `\x1b[${headerRows + r};${leftCol}H${bot}`;
        }
        // Bottom lines (prompt area, hints, spinner, etc.)
        let cursorRow = headerRows + contentHeight + 1;
        for (const bl of bottomLines) {
          ovOut += `\x1b[${cursorRow};1H\x1b[2K${leftBorder}${bl}`;
          cursorRow++;
        }
        const termRows = (_f = (_e = screen === null || screen === void 0 ? void 0 : screen.height) !== null && _e !== void 0 ? _e : stdout.rows) !== null && _f !== void 0 ? _f : 24;
        for (let row = cursorRow; row <= termRows; row++) {
          ovOut += `\x1b[${row};1H\x1b[2K`;
        }
        const finalCursor = Math.min(cursorRow, termRows);
        ovOut += `\x1b[${finalCursor};1H`;
        ovOut += "\x1b[?2026l"; // end sync updates
        try {
          (_g = stdout.cork) === null || _g === void 0 ? void 0 : _g.call(stdout);
        } catch (_j) {}
        stdout.write(ovOut);
        try {
          (_h = stdout.uncork) === null || _h === void 0 ? void 0 : _h.call(stdout);
        } catch (_k) {}
      }, [stdout,
      // Frequently changing deps stay here to avoid touching the content area
      bottomLines, overlayTitle, screen, contentHeight, topHeaderLeft, overlayVisible, ovLines]);
      return null;
    });
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/