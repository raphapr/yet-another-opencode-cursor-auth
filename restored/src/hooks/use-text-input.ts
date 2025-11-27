__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */t: () => (/* binding */useTextInput)
      /* harmony export */
    });
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/context/vim-mode-context.tsx");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/utils/cursor-navigation.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_0__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    /** biome-ignore-all lint/suspicious/noControlCharactersInRegex: we don't care about control characters in regex */

    const HOME_ESC_RE = /^(?:\u001b\[H|\u001b\[1~|\u001b\[7~|\u001bOH|\u001b\[1;1H)$/u;
    const END_ESC_RE = /^(?:\u001b\[F|\u001b\[4~|\u001b\[8~|\u001bOF|\u001b\[1;1F)$/u;
    const isHomeEscSeq = s => HOME_ESC_RE.test(s);
    const isEndEscSeq = s => END_ESC_RE.test(s);
    function useTextInput(valueProp, onChange, options = {}) {
      const {
        focus = true,
        showCursor = true,
        highlightPastedText = false,
        onSubmit,
        onTab,
        onShiftTab,
        onCtrlC,
        onCtrlD,
        onCtrlR,
        cursorToEndSignal,
        onCursorInfoChange,
        onUpAtFirstLine,
        onDownAtLastLine,
        allowExplicitNewline = true,
        onPaste
      } = options;
      const [state, setState] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        cursorOffset: (valueProp || "").length,
        cursorWidth: 0
      });
      const {
        cursorOffset,
        cursorWidth
      } = state;
      const queuedValueRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(valueProp);
      const queuedCursorRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(cursorOffset);
      const pendingAppliedRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
      const lastEventTimeRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0);
      const burstCountRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0);
      const isPastingRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
      const pasteBufferRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)("");
      // Holds leftover input that arrives after a bracketed paste end marker,
      // to be processed on the next event to avoid losing keystrokes.
      const replayBufferRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)("");
      // When the raw Home/End handler consumes a sequence, suppress one corresponding
      // handling in the main input handler to avoid double-moving and stray inserts.
      const suppressHomeEndOnceRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
      const BRACKETED_START_RE = /\u001b?\[200~/;
      const BRACKETED_END_RE = /\u001b?\[201~/;
      // Swallow terminal OSC 11 background color responses if they leak into stdin
      // Match OSC 11 as well as OSC 10/12/4 style dynamic-color responses just in case
      const OSC_REPLY_RE = /\u001b?\](?:10|11|12|4);[^\\\u0007]*(?:\u0007|\u001b\\|\\)/g;
      const oscActiveRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
      const oscBufRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)("");
      const {
        mode,
        setMode,
        vimEnabled
      } = (0, _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_3__ /* .useVimMode */.v)();
      const [pendingOp, setPendingOp] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
      const [countStr, setCountStr] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
      const [pendingOpCount, setPendingOpCount] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
      // Track previous cursorToEndSignal to only move cursor when signal actually changes
      const prevCursorToEndSignalRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(cursorToEndSignal);
      // Subscribe to Ink's internal raw input events to capture raw Home/End escape sequences
      const {
        internal_eventEmitter
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ /* .useStdin */.mT)();
      const setCursorOffset = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(nextOffset => {
        const text = queuedValueRef.current;
        const clamped = Math.max(0, Math.min(text.length, nextOffset));
        queuedCursorRef.current = clamped;
        setState(prev => Object.assign(Object.assign({}, prev), {
          cursorOffset: clamped,
          cursorWidth: 0
        }));
      }, []);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!focus) return;
        const handler = chunk => {
          // Respect bracketed paste and ignore mixed raw chunks; only handle exact sequences
          if (!chunk || isPastingRef.current || BRACKETED_START_RE.test(chunk) || BRACKETED_END_RE.test(chunk)) {
            return;
          }
          // Handle Home/End using raw chunks only when chunk is exactly the escape sequence
          if (isHomeEscSeq(chunk) || isEndEscSeq(chunk)) {
            const text = queuedValueRef.current;
            const cursor = queuedCursorRef.current;
            const nextOffset = isHomeEscSeq(chunk) ? (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(text, cursor) : vimEnabled && mode === "normal" ? (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEnd */.cs)(text, cursor) : (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEndExclusive */.GD)(text, cursor);
            // Suppress the corresponding handling in the main input handler once
            suppressHomeEndOnceRef.current = true;
            setCursorOffset(nextOffset);
          }
        };
        internal_eventEmitter === null || internal_eventEmitter === void 0 ? void 0 : internal_eventEmitter.on("input", handler);
        return () => {
          var _a, _b;
          (_a = internal_eventEmitter === null || internal_eventEmitter === void 0 ? void 0 : internal_eventEmitter.off) === null || _a === void 0 ? void 0 : _a.call(internal_eventEmitter, "input", handler);
          // Fallback for older Node typings without `off`
          (_b = internal_eventEmitter === null || internal_eventEmitter === void 0 ? void 0 : internal_eventEmitter.removeListener) === null || _b === void 0 ? void 0 : _b.call(internal_eventEmitter, "input", handler);
        };
      }, [focus, internal_eventEmitter, vimEnabled, mode, setCursorOffset]);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!focus || !showCursor) return;
        const newValue = valueProp || "";
        const desired = Math.max(0, Math.min(newValue.length, queuedCursorRef.current));
        setState(prev => prev.cursorOffset !== desired || prev.cursorWidth !== 0 ? {
          cursorOffset: desired,
          cursorWidth: 0
        } : prev);
      }, [valueProp, focus, showCursor]);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
        if (cursorToEndSignal === undefined) return;
        // Only move cursor to end when the signal actually changes, not on every valueProp change
        if (prevCursorToEndSignalRef.current === cursorToEndSignal) return;
        prevCursorToEndSignalRef.current = cursorToEndSignal;
        setState({
          cursorOffset: (valueProp || "").length,
          cursorWidth: 0
        });
        queuedCursorRef.current = (valueProp || "").length;
        queuedValueRef.current = valueProp || "";
      }, [cursorToEndSignal, valueProp]);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const text = valueProp || "";
        const isAtLastLine = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .isAtLastLine */.q5)(text, cursorOffset);
        onCursorInfoChange === null || onCursorInfoChange === void 0 ? void 0 : onCursorInfoChange({
          offset: cursorOffset,
          isAtLastLine
        });
      }, [cursorOffset, valueProp, onCursorInfoChange]);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const v = valueProp || "";
        if (pendingAppliedRef.current != null && v === pendingAppliedRef.current) {
          pendingAppliedRef.current = null;
        }
        queuedValueRef.current = v;
      }, [valueProp]);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        try {
          process.stdout.write("\x1b[?2004h");
        } catch (_a) {}
        return () => {
          try {
            process.stdout.write("\x1b[?2004l");
          } catch (_a) {}
        };
      }, []);
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ /* .useInput */.Ge)((input, key) => {
        // Prepend any leftover input from a previous fragmented bracketed paste
        if (replayBufferRef.current.length > 0) {
          input = replayBufferRef.current + input;
          replayBufferRef.current = "";
        }
        const isCmdBackspace = key.backspace && key.ctrl || input === "\u0015" || input === "\u001b[127;5u" || input === "u" && key.ctrl;
        if (isCmdBackspace) {
          const baseValue = queuedValueRef.current;
          const baseCursor = queuedCursorRef.current;
          const lineStart = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(baseValue, baseCursor);
          const nextValue = baseValue.slice(0, lineStart) + baseValue.slice(baseCursor);
          const nextOffset = lineStart;
          queuedValueRef.current = nextValue;
          queuedCursorRef.current = nextOffset;
          setState({
            cursorOffset: nextOffset,
            cursorWidth: 0
          });
          if (nextValue !== valueProp) {
            pendingAppliedRef.current = nextValue;
            onChange(nextValue);
          }
          return;
        }
        const now = Date.now();
        const since = now - lastEventTimeRef.current;
        lastEventTimeRef.current = now;
        burstCountRef.current = since < 35 ? burstCountRef.current + 1 : 1;
        let baseValue = queuedValueRef.current;
        let baseCursor = queuedCursorRef.current;
        const commit = (nextValue, nextCursorOffset, nextCursorWidth = 0) => {
          const nv = nextValue;
          const no = Math.max(0, Math.min(nv.length, nextCursorOffset));
          queuedValueRef.current = nv;
          queuedCursorRef.current = no;
          setState({
            cursorOffset: no,
            cursorWidth: nextCursorWidth
          });
          if (nv !== valueProp) {
            pendingAppliedRef.current = nv;
            onChange(nv);
          }
        };
        if (isPastingRef.current || BRACKETED_START_RE.test(input) || BRACKETED_END_RE.test(input) || input.includes("[200~") || input.includes("[201~")) {
          let chunk = input;
          // Detect start of bracketed paste in this chunk
          if (!isPastingRef.current) {
            const startIdx = chunk.search(BRACKETED_START_RE);
            if (startIdx !== -1) {
              const m = chunk.match(BRACKETED_START_RE);
              const matchLen = m ? m[0].length : 0;
              isPastingRef.current = true;
              pasteBufferRef.current = "";
              if (startIdx > 0) {
                const head = chunk.slice(0, startIdx);
                const headNext = baseValue.slice(0, baseCursor) + head + baseValue.slice(baseCursor);
                baseValue = headNext;
                baseCursor = headNext.length;
                commit(headNext, baseCursor, 0);
              }
              chunk = chunk.slice(startIdx + matchLen);
            }
          }
          // Accumulate and robustly detect the end marker even if fragmented across events
          if (isPastingRef.current) {
            const combined = pasteBufferRef.current + chunk;
            const escEnd = combined.indexOf("\u001b[201~");
            const bareEnd = combined.indexOf("[201~");
            let endIdx = -1;
            let endLen = 0;
            if (escEnd !== -1 && (bareEnd === -1 || escEnd < bareEnd)) {
              endIdx = escEnd;
              endLen = 6; // \u001b + [201~
            } else if (bareEnd !== -1) {
              endIdx = bareEnd;
              endLen = 5; // [201~
            }
            if (endIdx !== -1) {
              const contentRaw = combined.slice(0, endIdx);
              const remainder = combined.slice(endIdx + endLen);
              const content = contentRaw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
              isPastingRef.current = false;
              pasteBufferRef.current = "";
              baseValue = queuedValueRef.current;
              baseCursor = queuedCursorRef.current;
              let insert = content;
              try {
                const override = onPaste === null || onPaste === void 0 ? void 0 : onPaste({
                  kind: "bracketed",
                  content
                });
                if (override != null) insert = override;
              } catch (_a) {
                /* ignore */
              }
              if (insert.includes("\t")) insert = insert.replace(/\t/g, "  ");
              const nextValue = baseValue.slice(0, baseCursor) + insert + baseValue.slice(baseCursor);
              commit(nextValue, baseCursor + insert.length, 0);
              // If there's any trailing input after the end marker, queue it for the next event
              if (remainder.length > 0) replayBufferRef.current = remainder;
              return;
            }
            // No end yet; keep buffering
            pasteBufferRef.current = combined;
            return;
          }
        }
        if (key.ctrl && input === "c") {
          if (baseValue.length > 0) {
            onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC();
            commit("", 0, 0);
            return;
          }
          onCtrlC === null || onCtrlC === void 0 ? void 0 : onCtrlC();
          return;
        }
        // Ctrl+R: trigger review without inserting "r"
        if (_constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .REVIEW_MODE_ENABLED */.hD && (key.ctrl && (input === "r" || input === "R") || input === "\u0012")) {
          onCtrlR === null || onCtrlR === void 0 ? void 0 : onCtrlR();
          return;
        }
        // Ctrl+O: global compact toggle is handled by parent; swallow input to avoid inserting "o"
        // Recognize both the control character (\u000f) and ctrl-modified 'o' that some terminals emit
        if (key.ctrl && (input === "o" || input === "O") || input === "\u000f") {
          return;
        }
        // Ctrl+K: delete from cursor to end of line (Emacs-style)
        // Common encodings: key.ctrl && input === 'k' or VT "\u000b".
        if (key.ctrl && (input === "k" || input === "K") || input === "\u000b") {
          if (baseValue.length === 0) return;
          const lineEndExclusive = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEndExclusive */.GD)(baseValue, baseCursor);
          let deleteUntil = lineEndExclusive;
          // If caret is already at end-of-line and a newline follows, also delete that newline
          if (baseCursor === lineEndExclusive && baseCursor < baseValue.length && baseValue[baseCursor] === "\n") {
            deleteUntil = baseCursor + 1;
          }
          const nextValue = baseValue.slice(0, baseCursor) + baseValue.slice(deleteUntil);
          commit(nextValue, baseCursor, 0);
          return;
        }
        // Ctrl+D: if consumer provided a handler, delegate to it (e.g., quit app). Otherwise delete char.
        if (key.ctrl && (input === "d" || input === "D") || input === "\u0004") {
          if (onCtrlD) {
            onCtrlD();
            return;
          }
          if (baseCursor >= baseValue.length) return;
          const deleteUntil = baseCursor + 1;
          const nextValue = baseValue.slice(0, baseCursor) + baseValue.slice(deleteUntil);
          commit(nextValue, baseCursor, 0);
          return;
        }
        // Ctrl+T: transpose characters around the cursor (Emacs-style)
        // Recognize either ctrl modifier with 't'/'T' or control code '\u0014'
        if (key.ctrl && (input === "t" || input === "T") || input === "\u0014") {
          const text = baseValue;
          const n = text.length;
          const i = baseCursor;
          if (n < 2) return; // nothing to transpose
          // Determine current line boundaries
          const lineStart = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(text, i);
          const lineEndExclusive = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEndExclusive */.GD)(text, i);
          // If at beginning of the line, do nothing (Emacs behavior)
          if (i === lineStart) return;
          // If the line is shorter than 2 characters, do nothing
          if (lineEndExclusive - lineStart < 2) return;
          // Choose the right index to swap with: at EOL use previous char
          const k = i === lineEndExclusive ? i - 1 : i;
          // Guard: ensure k is within the line
          if (k - 1 < lineStart || k >= lineEndExclusive) return;
          const pre = text.slice(0, k - 1);
          const a = text[k - 1];
          const b = text[k];
          const post = text.slice(k + 1);
          const swapped = pre + b + a + post;
          // Cursor moves to the right of the two transposed characters
          commit(swapped, Math.min(k + 1, swapped.length), 0);
          return;
        }
        if (key.tab) {
          if (key.shift) {
            onShiftTab === null || onShiftTab === void 0 ? void 0 : onShiftTab();
            return;
          }
          onTab === null || onTab === void 0 ? void 0 : onTab();
          return;
        }
        const isCmdLeft = key.ctrl && key.leftArrow || key.ctrl && input === "a" || input === "\u0001" || input === "\u001b[1;5D" || input === "\u001b[1;2D";
        const isCmdRight = key.ctrl && key.rightArrow || key.ctrl && input === "e" || input === "\u0005" || input === "\u001b[1;5C" || input === "\u001b[1;2C";
        const isOptionLeft = key.meta && key.leftArrow || key.meta && input === "b" || input === "\u001b[1;3D" || input === "\u001bb" || input === "\u001b[1;5D";
        const isOptionRight = key.meta && key.rightArrow || key.meta && input === "f" || input === "\u001b[1;3C" || input === "\u001bf" || input === "\u001b[1;5C";
        // Home key sequences
        const isHomeKey = input === "\u001b[H" || input === "\u001b[1~" || input === "\u001b[7~" || input === "\u001bOH" || input === "\u001b[1;1H";
        // End key sequences
        const isEndKey = input === "\u001b[F" || input === "\u001b[4~" || input === "\u001b[8~" || input === "\u001bOF" || input === "\u001b[1;1F";
        // If the raw handler already handled a Home/End, swallow the duplicate
        if (suppressHomeEndOnceRef.current && (isHomeKey || isEndKey)) {
          suppressHomeEndOnceRef.current = false;
          return;
        }
        if (isCmdLeft || isCmdRight || isOptionLeft || isOptionRight || isHomeKey || isEndKey) {
          const isWordChar = ch => /[A-Za-z0-9_]/.test(ch);
          const nextWord = (text, pos) => {
            let i = pos;
            if (i < text.length && isWordChar(text[i])) {
              while (i < text.length && isWordChar(text[i])) i++;
            }
            while (i < text.length && !isWordChar(text[i])) i++;
            return Math.min(text.length, Math.max(0, i));
          };
          const prevWord = (text, pos) => {
            let i = pos;
            if (i <= 0) return 0;
            i--;
            while (i > 0 && !isWordChar(text[i])) i--;
            while (i > 0 && isWordChar(text[i - 1])) i--;
            return i;
          };
          const moveToLineStart = (text, pos) => {
            return (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(text, pos);
          };
          const moveToLineEnd = (text, pos) => {
            // In Vim normal mode, cursor is on a character (0..length-1), so use inclusive end
            return vimEnabled && mode === "normal" ? (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEnd */.cs)(text, pos) : (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEndExclusive */.GD)(text, pos);
          };
          if (isCmdLeft || isHomeKey) {
            const newOffset = moveToLineStart(baseValue, baseCursor);
            setCursorOffset(newOffset);
          } else if (isCmdRight || isEndKey) {
            const newOffset = moveToLineEnd(baseValue, baseCursor);
            setCursorOffset(newOffset);
          } else if (isOptionLeft) {
            const newOffset = prevWord(baseValue, baseCursor);
            setCursorOffset(newOffset);
          } else {
            const newOffset = nextWord(baseValue, baseCursor);
            setCursorOffset(newOffset);
          }
          return;
        }
        // Ctrl+P / Ctrl+N: move one line up/down (emacs-style)
        const isCtrlP = key.ctrl && (input === "p" || input === "P") || input === "\u0010";
        const isCtrlN = key.ctrl && (input === "n" || input === "N") || input === "\u000e";
        if (isCtrlP) {
          const next = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .moveUpOneLine */.te)(baseValue, baseCursor);
          if (next == null) {
            onUpAtFirstLine === null || onUpAtFirstLine === void 0 ? void 0 : onUpAtFirstLine();
            return;
          }
          queuedCursorRef.current = next;
          setState(prev => Object.assign(Object.assign({}, prev), {
            cursorOffset: next,
            cursorWidth: 0
          }));
          return;
        }
        if (isCtrlN) {
          const next = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .moveDownOneLine */.kC)(baseValue, baseCursor);
          if (next == null || next === baseCursor) {
            if (baseCursor < baseValue.length) {
              const hasNextLine = baseValue.indexOf("\n", baseCursor) !== -1;
              if (hasNextLine) {
                const right = Math.min(baseValue.length, baseCursor + 1);
                queuedCursorRef.current = right;
                setState(prev => Object.assign(Object.assign({}, prev), {
                  cursorOffset: right,
                  cursorWidth: 0
                }));
                return;
              }
            }
            onDownAtLastLine === null || onDownAtLastLine === void 0 ? void 0 : onDownAtLastLine();
            return;
          }
          queuedCursorRef.current = next;
          setState(prev => Object.assign(Object.assign({}, prev), {
            cursorOffset: next,
            cursorWidth: 0
          }));
          return;
        }
        // Ctrl+B / Ctrl+F: move one character left/right
        if (key.ctrl && (input === "b" || input === "B") || input === "\u0002") {
          setCursorOffset(Math.max(0, baseCursor - 1));
          return;
        }
        if (key.ctrl && (input === "f" || input === "F") || input === "\u0006") {
          setCursorOffset(Math.min(queuedValueRef.current.length, baseCursor + 1));
          return;
        }
        if (key.upArrow) {
          const next = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .moveUpOneLine */.te)(baseValue, baseCursor);
          if (next == null) {
            onUpAtFirstLine === null || onUpAtFirstLine === void 0 ? void 0 : onUpAtFirstLine();
            return;
          }
          queuedCursorRef.current = next;
          setState(prev => Object.assign(Object.assign({}, prev), {
            cursorOffset: next,
            cursorWidth: 0
          }));
          return;
        }
        if (key.downArrow) {
          const next = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .moveDownOneLine */.kC)(baseValue, baseCursor);
          if (next == null || next === baseCursor) {
            if (baseCursor < baseValue.length) {
              const hasNextLine = baseValue.indexOf("\n", baseCursor) !== -1;
              if (hasNextLine) {
                const right = Math.min(baseValue.length, baseCursor + 1);
                queuedCursorRef.current = right;
                setState(prev => Object.assign(Object.assign({}, prev), {
                  cursorOffset: right,
                  cursorWidth: 0
                }));
                return;
              }
            }
            onDownAtLastLine === null || onDownAtLastLine === void 0 ? void 0 : onDownAtLastLine();
            return;
          }
          queuedCursorRef.current = next;
          setState(prev => Object.assign(Object.assign({}, prev), {
            cursorOffset: next,
            cursorWidth: 0
          }));
          return;
        }
        if (key.shift && key.tab) {
          return;
        }
        const shiftEnterSeqs = ["\x1b[13;2~", "\x1b[27;2;13~", "\u001b[13;2~", "\u001b[27;2;13~", "[13;2~", "[27;2;13~"];
        const isShiftEnterEsc = shiftEnterSeqs.includes(input) || /^(?:\u001b|\x1b)?\[[0-9]{1,3};2;13~$/.test(input);
        if (key.shift && key.return || isShiftEnterEsc) {
          if (!allowExplicitNewline) return;
          const nextValue = `${baseValue.slice(0, baseCursor)}\n${baseValue.slice(baseCursor)}`;
          commit(nextValue, baseCursor + 1, 0);
          return;
        }
        if (key.return) {
          const isBurst = burstCountRef.current >= 3;
          if (isBurst) {
            if (!allowExplicitNewline || baseValue.length === 0) {
              if (onSubmit) onSubmit(baseValue);
              return;
            }
            const nextValue = `${baseValue.slice(0, baseCursor)}\n${baseValue.slice(baseCursor)}`;
            commit(nextValue, nextValue.length, 0);
            return;
          }
          if (onSubmit) onSubmit(baseValue);
          return;
        }
        if (vimEnabled && mode === "normal") {
          const parseCount = (cs, fallback = 1) => cs != null && cs.length > 0 ? Math.max(0, Number(cs)) || fallback : fallback;
          const resetCounts = () => {
            setCountStr(null);
            setPendingOpCount(null);
          };
          if (key.ctrl && input === "w" || input === "\u0017") {
            const isWordChar = ch => /[A-Za-z0-9_]/.test(ch);
            const prevWord = (text, pos) => {
              let i = pos;
              if (i <= 0) return 0;
              i--;
              while (i > 0 && !isWordChar(text[i])) i--;
              while (i > 0 && isWordChar(text[i - 1])) i--;
              return i;
            };
            const wordStart = prevWord(baseValue, baseCursor);
            const nv = baseValue.slice(0, wordStart) + baseValue.slice(baseCursor);
            commit(nv, wordStart, 0);
            resetCounts();
            return;
          }
          const consumeCounts = () => {
            const op = pendingOpCount !== null && pendingOpCount !== void 0 ? pendingOpCount : 1;
            const motion = parseCount(countStr, 1);
            return {
              op,
              motion,
              total: op * motion
            };
          };
          const isWordChar = ch => /[A-Za-z0-9_]/.test(ch);
          const nextW = (text, pos) => {
            let i = pos;
            if (i < text.length && isWordChar(text[i])) {
              while (i < text.length && isWordChar(text[i])) i++;
            }
            while (i < text.length && !isWordChar(text[i])) i++;
            return Math.min(text.length, Math.max(0, i));
          };
          const nextE = (text, pos) => {
            const n = text.length;
            if (n === 0) return pos;
            let i = pos;
            if (i >= n - 1) return pos;
            const withinWord = isWordChar(text[i]) && i + 1 < n && isWordChar(text[i + 1]);
            if (withinWord) {
              while (i + 1 < n && isWordChar(text[i + 1])) i++;
            } else {
              i++;
              while (i < n && !isWordChar(text[i])) i++;
              if (i < n) {
                while (i + 1 < n && isWordChar(text[i + 1])) i++;
              }
            }
            return Math.min(Math.max(0, n - 1), i);
          };
          const prevB = (text, pos) => {
            let i = pos;
            if (i <= 0) return 0;
            i--;
            while (i > 0 && !isWordChar(text[i])) i--;
            while (i > 0 && isWordChar(text[i - 1])) i--;
            return i;
          };
          const repeatMoveDown = (text, start, count) => {
            let p = start;
            let hitEnd = false;
            for (let n = 0; n < count; n++) {
              const next = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .moveDownOneLine */.kC)(text, p);
              if (next == null) {
                hitEnd = true;
                break;
              }
              p = next;
            }
            return {
              pos: p,
              hitEnd
            };
          };
          const repeatMoveUp = (text, start, count) => {
            let p = start;
            for (let n = 0; n < count; n++) {
              const next = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .moveUpOneLine */.te)(text, p);
              if (next == null) break;
              p = next;
            }
            return p;
          };
          if (/^[1-9]$/.test(input)) {
            setCountStr(prev => prev == null ? input : prev + input);
            return;
          }
          if (input === "0") {
            if (countStr != null) {
              setCountStr(`${countStr}0`);
              return;
            }
            const dest0 = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(valueProp, baseCursor);
            setCursorOffset(dest0);
            resetCounts();
            return;
          }
          if (pendingOp === "d") {
            const text = valueProp;
            const applyDeletion = (start, end) => {
              if (end <= start) {
                setPendingOp(null);
                resetCounts();
                return;
              }
              const nextValue = text.slice(0, start) + text.slice(end);
              const newOffset = start;
              commit(nextValue, newOffset, 0);
              setPendingOp(null);
              resetCounts();
            };
            if (input === "w" || input === "b" || input === "e") {
              const {
                total
              } = consumeCounts();
              if (input === "w") {
                let dest = cursorOffset;
                for (let n = 0; n < total; n++) dest = nextW(text, dest);
                applyDeletion(cursorOffset, dest);
                return;
              }
              if (input === "b") {
                let dest = cursorOffset;
                for (let n = 0; n < total; n++) dest = prevB(text, dest);
                applyDeletion(dest, cursorOffset);
                return;
              }
              let dest = cursorOffset;
              for (let n = 0; n < total; n++) dest = nextE(text, dest);
              applyDeletion(cursorOffset, Math.min(text.length, dest + 1));
              return;
            }
            // Support big-word end motion for delete: dE
            if (input === "E") {
              const {
                total
              } = consumeCounts();
              const textBW = text;
              const nextBigE = (t, pos) => {
                const n = t.length;
                if (n === 0) return pos;
                let i = pos;
                if (i >= n - 1) return Math.min(Math.max(0, n - 1), i);
                const isSpace = ch => /\s/.test(ch);
                if (!isSpace(t[i])) {
                  while (i + 1 < n && !isSpace(t[i + 1])) i++;
                } else {
                  while (i < n && isSpace(t[i])) i++;
                  if (i < n) while (i + 1 < n && !isSpace(t[i + 1])) i++;
                }
                return Math.min(Math.max(0, n - 1), i);
              };
              let dest = cursorOffset;
              for (let n = 0; n < total; n++) dest = nextBigE(textBW, dest);
              applyDeletion(cursorOffset, Math.min(textBW.length, dest + 1));
              return;
            }
            if (input === "$") {
              const {
                total
              } = consumeCounts();
              let p = cursorOffset;
              if (total > 1) {
                const {
                  pos: np
                } = repeatMoveDown(text, cursorOffset, total - 1);
                p = np;
              }
              const newlineIndex = text.indexOf("\n", p);
              const end = newlineIndex === -1 ? text.length : newlineIndex;
              applyDeletion(cursorOffset, end);
              return;
            }
            if (input === "d") {
              const {
                total
              } = consumeCounts();
              const lineStart = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(text, cursorOffset);
              let lineEnd = cursorOffset;
              for (let n = 0; n < total; n++) {
                const nextNL = text.indexOf("\n", lineEnd);
                if (nextNL === -1) {
                  lineEnd = text.length;
                  break;
                } else {
                  lineEnd = nextNL + 1;
                }
              }
              if (lineEnd === text.length && lineStart > 0 && text[lineStart - 1] === "\n") {
                applyDeletion(lineStart - 1, lineEnd);
              } else {
                applyDeletion(lineStart, lineEnd);
              }
              return;
            }
            setPendingOp(null);
            resetCounts();
            return;
          }
          if (input === "d") {
            if (countStr != null) {
              setPendingOpCount(parseCount(countStr, 1));
              setCountStr(null);
            }
            setPendingOp("d");
            return;
          }
          if (input === "i") {
            setMode("insert");
            resetCounts();
            return;
          }
          if (input === "a") {
            setMode("insert");
            const destA = Math.min(baseCursor + 1, valueProp.length);
            setCursorOffset(destA);
            resetCounts();
            return;
          }
          if (input === "A") {
            setMode("insert");
            const text = valueProp;
            const lineStart = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(text, baseCursor);
            const nextNL = text.indexOf("\n", lineStart);
            const endExclusive = nextNL === -1 ? text.length : nextNL;
            setCursorOffset(endExclusive);
            resetCounts();
            return;
          }
          if (input === "k") {
            const {
              motion
            } = consumeCounts();
            const dest = repeatMoveUp(baseValue, baseCursor, motion);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "j") {
            const {
              motion
            } = consumeCounts();
            const {
              pos,
              hitEnd
            } = repeatMoveDown(baseValue, baseCursor, motion);
            if (hitEnd && (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .isAtLastLine */.q5)(baseValue, baseCursor)) onDownAtLastLine === null || onDownAtLastLine === void 0 ? void 0 : onDownAtLastLine();
            setCursorOffset(pos);
            resetCounts();
            return;
          }
          if (input === "o") {
            if (!allowExplicitNewline) {
              setMode("insert");
              resetCounts();
              return;
            }
            const {
              value: nextValue,
              newOffset
            } = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .insertNewlineBelow */.Vs)(baseValue, baseCursor);
            commit(nextValue, newOffset, 0);
            setMode("insert");
            resetCounts();
            return;
          }
          if (input === "O") {
            if (!allowExplicitNewline) {
              setMode("insert");
              resetCounts();
              return;
            }
            const {
              value: nextValue,
              newOffset
            } = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .insertNewlineAbove */.V)(baseValue, baseCursor);
            commit(nextValue, newOffset, 0);
            setMode("insert");
            resetCounts();
            return;
          }
          if (input === "I") {
            setMode("insert");
            const destI = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(baseValue, baseCursor);
            setCursorOffset(destI);
            resetCounts();
            return;
          }
          if (input === "h" || key.leftArrow) {
            const {
              motion
            } = consumeCounts();
            const dest = Math.max(0, baseCursor - motion);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "l" || key.rightArrow) {
            const {
              motion
            } = consumeCounts();
            const dest = Math.min(Math.max(0, baseValue.length - 1), baseCursor + motion);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "$") {
            const {
              motion
            } = consumeCounts();
            let p = baseCursor;
            if (motion > 1) {
              const {
                pos,
                hitEnd
              } = repeatMoveDown(baseValue, baseCursor, motion - 1);
              if (hitEnd && (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .isAtLastLine */.q5)(baseValue, baseCursor)) onDownAtLastLine === null || onDownAtLastLine === void 0 ? void 0 : onDownAtLastLine();
              p = pos;
            }
            const dest = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEnd */.cs)(baseValue, p);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "x") {
            const {
              motion
            } = consumeCounts();
            const delCount = Math.max(1, motion);
            if (baseCursor < baseValue.length) {
              const end = Math.min(baseValue.length, baseCursor + delCount);
              const nextValue = baseValue.slice(0, baseCursor) + baseValue.slice(end);
              const nextOffset = Math.min(baseCursor, Math.max(0, nextValue.length - 1));
              commit(nextValue, nextOffset, 0);
            }
            resetCounts();
            return;
          }
          if (input === "X") {
            const {
              motion
            } = consumeCounts();
            const delCount = Math.max(1, motion);
            if (baseCursor > 0) {
              const start = Math.max(0, baseCursor - delCount);
              const nextValue = baseValue.slice(0, start) + baseValue.slice(baseCursor);
              commit(nextValue, start, 0);
            }
            resetCounts();
            return;
          }
          if (input === "w") {
            const {
              motion
            } = consumeCounts();
            let dest = baseCursor;
            for (let n = 0; n < motion; n++) dest = nextW(baseValue, dest);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "e") {
            const {
              motion
            } = consumeCounts();
            let dest = baseCursor;
            for (let n = 0; n < motion; n++) dest = nextE(baseValue, dest);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "E") {
            const {
              motion
            } = consumeCounts();
            const text = baseValue;
            const nextBigE = (t, pos) => {
              const n = t.length;
              if (n === 0) return pos;
              let i = pos;
              if (i >= n - 1) return Math.min(Math.max(0, n - 1), i);
              const isSpace = ch => /\s/.test(ch);
              if (!isSpace(t[i])) {
                while (i + 1 < n && !isSpace(t[i + 1])) i++;
              } else {
                while (i < n && isSpace(t[i])) i++;
                if (i < n) while (i + 1 < n && !isSpace(t[i + 1])) i++;
              }
              return Math.min(Math.max(0, n - 1), i);
            };
            let dest = baseCursor;
            for (let n = 0; n < motion; n++) dest = nextBigE(text, dest);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "b") {
            const {
              motion
            } = consumeCounts();
            let dest = baseCursor;
            for (let n = 0; n < motion; n++) dest = prevB(baseValue, dest);
            setCursorOffset(dest);
            resetCounts();
            return;
          }
          if (input === "B") {
            const {
              motion
            } = consumeCounts();
            const text = baseValue;
            if (text.length > 0) {
              let i = baseCursor;
              for (let n = 0; n < motion; n++) {
                if (i <= 0) break;
                i = Math.min(i, text.length - 1);
                while (i > 0 && /\s/.test(text[i])) i--;
                while (i > 0 && !/\s/.test(text[i - 1])) i--;
              }
              setCursorOffset(i);
            }
            resetCounts();
            return;
          }
          if (input === "W") {
            const {
              motion
            } = consumeCounts();
            const text = baseValue;
            if (text.length > 0) {
              let i = baseCursor;
              for (let n = 0; n < motion; n++) {
                if (i < text.length && !/\s/.test(text[i])) {
                  while (i < text.length && !/\s/.test(text[i])) i++;
                }
                while (i < text.length && /\s/.test(text[i])) i++;
              }
              const nextOffset = Math.min(Math.max(0, text.length - 1), i);
              setCursorOffset(nextOffset);
            }
            resetCounts();
            return;
          }
          // D: delete to end-of-line (like d$), count repeats across lines
          if (input === "D") {
            const {
              motion
            } = consumeCounts();
            const text = baseValue;
            let targetPos = baseCursor;
            if (motion > 1) {
              const {
                pos
              } = repeatMoveDown(text, baseCursor, motion - 1);
              targetPos = pos;
            }
            const endExclusive = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEndExclusive */.GD)(text, targetPos);
            const nextValue = text.slice(0, baseCursor) + text.slice(endExclusive);
            commit(nextValue, baseCursor, 0);
            resetCounts();
            return;
          }
          // C: change to end-of-line (delete to EOL then enter insert)
          if (input === "C") {
            const {
              motion
            } = consumeCounts();
            const text = baseValue;
            let targetPos = baseCursor;
            if (motion > 1) {
              const {
                pos
              } = repeatMoveDown(text, baseCursor, motion - 1);
              targetPos = pos;
            }
            const endExclusive = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEndExclusive */.GD)(text, targetPos);
            const nextValue = text.slice(0, baseCursor) + text.slice(endExclusive);
            commit(nextValue, baseCursor, 0);
            setMode("insert");
            resetCounts();
            return;
          }
          // s: substitute N characters under cursor, then enter insert
          if (input === "s") {
            const {
              motion
            } = consumeCounts();
            const text = baseValue;
            const delCount = Math.max(1, motion);
            const lineEndExclusive = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineEndExclusive */.GD)(text, baseCursor);
            const endExclusive = Math.min(lineEndExclusive, baseCursor + delCount);
            const nextValue = text.slice(0, baseCursor) + text.slice(endExclusive);
            commit(nextValue, baseCursor, 0);
            setMode("insert");
            resetCounts();
            return;
          }
          // S: change whole line(s) (like cc), count changes that many lines
          if (input === "S") {
            const {
              motion
            } = consumeCounts();
            const text = baseValue;
            const count = Math.max(1, motion);
            const lineStart = (0, _utils_cursor_navigation_js__WEBPACK_IMPORTED_MODULE_5__ /* .getLineStart */.Jh)(text, baseCursor);
            let lineEnd = baseCursor;
            for (let n = 0; n < count; n++) {
              const nextNL = text.indexOf("\n", lineEnd);
              if (nextNL === -1) {
                lineEnd = text.length;
                break;
              } else {
                lineEnd = nextNL + 1;
              }
            }
            let delStart = lineStart;
            const delEnd = lineEnd;
            if (delEnd === text.length && delStart > 0 && text[delStart - 1] === "\n") {
              delStart = delStart - 1;
            }
            const nextValue = text.slice(0, delStart) + text.slice(delEnd);
            commit(nextValue, delStart, 0);
            setMode("insert");
            resetCounts();
            return;
          }
          resetCounts();
          return;
        }
        if (vimEnabled && key.escape) {
          setMode("normal");
          setCursorOffset(Math.max(0, baseCursor - 1));
          setCountStr(null);
          setPendingOpCount(null);
          return;
        }
        const normalizedInputRaw = input.length > 1 ? input.replace(/\r\n/g, "\n").replace(/\r/g, "\n") : input;
        // Strip any OSC 11 terminal replies (supports fragmented sequences across events)
        const stripOsc = src => {
          // Fast path: whole-sequence removal if contained in this chunk
          if (OSC_REPLY_RE.test(src)) {
            const cleaned = src.replace(OSC_REPLY_RE, "");
            if (cleaned.length > 0) return cleaned;
            return "";
          }
          // Streaming path: detect start without terminator and buffer until terminator appears in later events
          let out = "";
          let i = 0;
          const isStartAt = (s, j) => {
            // Returns length of start marker, or 0 if none
            if (s[j] === "\u001b" && s[j + 1] === "]" && /^(?:10|11|12|4);/.test(s.slice(j + 2))) return 2 + 2; // ESC ] + at least two digits and semicolon
            if (s[j] === "]" && /^(?:10|11|12|4);/.test(s.slice(j + 1))) return 1 + 2;
            return 0;
          };
          while (i < src.length) {
            if (!oscActiveRef.current) {
              const startLen = isStartAt(src, i);
              if (startLen > 0) {
                oscActiveRef.current = true;
                oscBufRef.current = "";
                i += startLen;
                continue;
              }
              out += src[i++];
            } else {
              // Accumulate until we see terminator: BEL, ESC \\ or plain \\
              const ch = src[i++];
              oscBufRef.current += ch;
              const n = oscBufRef.current.length;
              const last = oscBufRef.current[n - 1];
              if (last === "\u0007" || last === "\\") {
                oscActiveRef.current = false;
                oscBufRef.current = "";
                continue;
              }
              if (n >= 2 && oscBufRef.current[n - 2] === "\u001b" && last === "\\") {
                oscActiveRef.current = false;
                oscBufRef.current = "";
              }
            }
          }
          return out;
        };
        const normalizedInput = stripOsc(normalizedInputRaw);
        if (normalizedInput === "\t") {
          (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("input.tab.single", {
            mode,
            vimEnabled
          });
          if (key.shift) onShiftTab === null || onShiftTab === void 0 ? void 0 : onShiftTab();else onTab === null || onTab === void 0 ? void 0 : onTab();
          return;
        }
        const inputWasOnlyOsc = normalizedInput.length === 0 && normalizedInputRaw.length > 0;
        const hasImportantKey = key.backspace || key.delete || key.return || key.tab || key.upArrow || key.downArrow || key.leftArrow || key.rightArrow || key.ctrl || key.meta;
        if (inputWasOnlyOsc && !hasImportantKey) return; // ignore purely-OSC events without meaningful key presses
        let nextCursorOffset = baseCursor;
        let nextValue = baseValue;
        let nextCursorWidth = 0;
        if (key.leftArrow) {
          if (showCursor) nextCursorOffset--;
        } else if (key.rightArrow) {
          if (showCursor) nextCursorOffset++;
        } else if (key.backspace || key.delete) {
          if ((key.meta || key.ctrl) && (key.backspace || key.delete)) {
            (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("Modifier key event:", {
              input: JSON.stringify(input),
              inputHex: Array.from(input).map(c => `0x${c.charCodeAt(0).toString(16)}`).join(" "),
              key: {
                backspace: key.backspace,
                delete: key.delete,
                meta: key.meta,
                ctrl: key.ctrl,
                shift: key.shift
              }
            });
          }
          const isOptionBackspace = key.backspace && (key.meta || key.ctrl) || key.delete && key.meta && input === "" || input === "\u001b\u007f" || input === "\u001b\u0008" || input === "\u001b[8;3~" || input === "\u001b[127;3u";
          const isOptionDelete = key.delete && (key.meta || key.ctrl) && input !== "" || input === "\u001b[3;3~" || input === "\u001bd" || input === "\u001b[3~" && key.meta;
          if (isOptionBackspace || isOptionDelete) {
            const isWordChar = ch => /[A-Za-z0-9_]/.test(ch);
            const prevWord = (text, pos) => {
              let i = pos;
              if (i <= 0) return 0;
              i--;
              while (i > 0 && !isWordChar(text[i])) i--;
              while (i > 0 && isWordChar(text[i - 1])) i--;
              return i;
            };
            const nextWord = (text, pos) => {
              let i = pos;
              if (i < text.length && isWordChar(text[i])) {
                while (i < text.length && isWordChar(text[i])) i++;
              }
              while (i < text.length && !isWordChar(text[i])) i++;
              return Math.min(text.length, Math.max(0, i));
            };
            if (isOptionBackspace) {
              const wordStart = prevWord(baseValue, baseCursor);
              nextValue = baseValue.slice(0, wordStart) + baseValue.slice(baseCursor);
              nextCursorOffset = wordStart;
            } else {
              const wordEnd = nextWord(baseValue, baseCursor);
              nextValue = baseValue.slice(0, baseCursor) + baseValue.slice(wordEnd);
              nextCursorOffset = baseCursor;
            }
          } else if (baseCursor > 0) {
            nextValue = baseValue.slice(0, baseCursor - 1) + baseValue.slice(baseCursor, baseValue.length);
            nextCursorOffset--;
          }
        } else if ((!vimEnabled || mode !== "normal") && (key.meta && normalizedInput === "w" || normalizedInput === "\u001bw" || key.ctrl && normalizedInput === "w" || normalizedInput === "\u0017")) {
          const isWordChar = ch => /[A-Za-z0-9_]/.test(ch);
          const prevWord = (text, pos) => {
            let i = pos;
            if (i <= 0) return 0;
            i--;
            while (i > 0 && !isWordChar(text[i])) i--;
            while (i > 0 && isWordChar(text[i - 1])) i--;
            return i;
          };
          const wordStart = prevWord(baseValue, baseCursor);
          nextValue = baseValue.slice(0, wordStart) + baseValue.slice(baseCursor);
          nextCursorOffset = wordStart;
        } else if ((!vimEnabled || mode !== "normal") && (key.meta && normalizedInput === "d" || normalizedInput === "\u001bd")) {
          const isWordChar = ch => /[A-Za-z0-9_]/.test(ch);
          const nextWord = (text, pos) => {
            let i = pos;
            if (i < text.length && isWordChar(text[i])) {
              while (i < text.length && isWordChar(text[i])) i++;
            }
            while (i < text.length && !isWordChar(text[i])) i++;
            return Math.min(text.length, Math.max(0, i));
          };
          const wordEnd = nextWord(baseValue, baseCursor);
          nextValue = baseValue.slice(0, baseCursor) + baseValue.slice(wordEnd);
          nextCursorOffset = baseCursor;
        } else {
          // Allow consumer to replace or suppress aggregated multi-char input (paste-like)
          let insert = normalizedInput;
          if (normalizedInput.length > 1) {
            // Special-case: when the terminal auto-repeats Tab, some terminals batch as "\t\t\t".
            // Treat this as multiple Tab presses (invoke onTab N times) instead of inserting spaces.
            // Without this, we can get into states where holding tab during file autocomplete inserts
            // actual tabs instead of accepting autocomplete suggestions.
            if (/^\t+$/.test(normalizedInput)) {
              const count = normalizedInput.length;
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("input.tabs.aggregated", {
                count
              });
              for (let i = 0; i < count; i++) {
                try {
                  onTab === null || onTab === void 0 ? void 0 : onTab();
                } catch (_b) {
                  /* ignore */
                }
              }
              return;
            }
            // Manually coalesce a burst of delete/backspace into a single commit.
            // Otherwise we can get into weird states where delete can get stuck
            // when the user holds it down.
            const rest = normalizedInput;
            let backspaceCount = 0;
            let fwdDeleteCount = 0;
            let j = 0;
            while (j < rest.length) {
              const ch = rest[j];
              if (ch === "\u007f") {
                backspaceCount++;
                j++;
                continue;
              }
              if (ch === "\u001b") {
                fwdDeleteCount++;
                j++;
                continue;
              }
              // Unknown; stop scanning
              break;
            }
            if (backspaceCount > 0 || fwdDeleteCount > 0) {
              const removeBack = Math.min(backspaceCount, baseCursor);
              let nv = baseValue.slice(0, baseCursor - removeBack) + baseValue.slice(baseCursor);
              const newCursor = baseCursor - removeBack;
              if (fwdDeleteCount > 0) {
                const del = Math.min(fwdDeleteCount, nv.length - newCursor);
                if (del > 0) nv = nv.slice(0, newCursor) + nv.slice(newCursor + del);
              }
              commit(nv, newCursor, 0);
              return;
            }
            try {
              const override = onPaste === null || onPaste === void 0 ? void 0 : onPaste({
                kind: "aggregated",
                content: normalizedInput
              });
              if (override != null) insert = override;
            } catch (_c) {
              /* ignore */
            }
            // If input is an aggregated burst of only newlines (e.g., holding Enter),
            // treat it like an Enter submit when explicit newlines are not allowed.
            const onlyNewlines = /^\n+$/.test(insert);
            if (onlyNewlines && (!allowExplicitNewline || queuedValueRef.current.length === 0)) {
              if (onSubmit) onSubmit(baseValue);
              return;
            }
          }
          // Tabs break our inputs
          // Replace tabs from pasted/aggregated content with two spaces
          if (insert.includes("\t")) insert = insert.replace(/\t/g, "  ");
          nextValue = baseValue.slice(0, baseCursor) + insert + baseValue.slice(baseCursor, baseValue.length);
          const hasNewline = insert.includes("\n");
          if (hasNewline) {
            nextCursorOffset = baseCursor + insert.length;
            nextCursorWidth = 0;
          } else {
            nextCursorOffset = baseCursor + insert.length;
            if (insert.length > 1) {
              nextCursorWidth = 0;
            }
          }
        }
        if (nextCursorOffset < 0) nextCursorOffset = 0;
        if (nextCursorOffset > nextValue.length) nextCursorOffset = nextValue.length;
        commit(nextValue, nextCursorOffset, nextCursorWidth);
      }, {
        isActive: focus
      });
      const cursorActualWidth = highlightPastedText ? cursorWidth : 0;
      return {
        cursorOffset,
        cursorWidth: cursorActualWidth,
        setCursorOffset
      };
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/