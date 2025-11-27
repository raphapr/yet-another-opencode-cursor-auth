__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var chalk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/context/theme-context.tsx");
    /* harmony import */
    var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/context/vim-mode-context.tsx");
    /* harmony import */
    var _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/hooks/use-text-input.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_3__, _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_5__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_3__, _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;

    // Constants for pasted text placeholder styling
    const PASTED_TEXT_LABEL = "Pasted text";
    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const LARGE_PASTE_PLACEHOLDER_RE = new RegExp(`\\[${escapeRegExp(PASTED_TEXT_LABEL)} #(\\d+)(?: \\+\\d+(?: lines)?)?\\]`, "g");
    // Function to apply styling to pasted text placeholders
    const stylePastedTextPlaceholders = (text, isLightTheme) => {
      return text.replace(LARGE_PASTE_PLACEHOLDER_RE, match => {
        // Use a dimmed gray color to make it obvious it's not literal text
        return isLightTheme ? chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.dim.gray(match) : chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.dim.cyan(match);
      });
    };
    function TextInput({
      value: originalValue,
      placeholder = "",
      rightPlaceholder,
      focus = true,
      visualFocus = false,
      mask,
      highlightPastedText = false,
      showCursor = true,
      dimmed = false,
      onChange,
      onSubmit,
      onTab,
      onCtrlC,
      onShiftTab,
      cursorToEndSignal,
      onCursorInfoChange,
      onUpAtFirstLine,
      onDownAtLastLine,
      onPaste,
      allowExplicitNewline,
      onCtrlR,
      onCtrlD
    }) {
      var _a;
      const {
        mode,
        vimEnabled
      } = (0, _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_4__ /* .useVimMode */.v)();
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdout */.t$)();
      const {
        cursorOffset,
        cursorWidth
      } = (0, _hooks_use_text_input_js__WEBPACK_IMPORTED_MODULE_5__ /* .useTextInput */.t)(originalValue, onChange, {
        focus,
        showCursor,
        highlightPastedText,
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
        onPaste,
        allowExplicitNewline
      });
      const cursorActualWidth = highlightPastedText ? cursorWidth : 0;
      const isLightTheme = (0, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_3__ /* .useIsLightTheme */.pW)();
      const value = mask ? mask.repeat(originalValue.length) : originalValue;
      let renderedValue = value;
      let renderedPlaceholder = placeholder ? chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.grey(placeholder) : undefined;
      if (showCursor && (focus || visualFocus)) {
        const isNormalMode = vimEnabled && mode === "normal";
        const cursorStyle = isNormalMode ? chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.bgGray : chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.inverse;
        renderedPlaceholder = placeholder.length > 0 ? cursorStyle(placeholder[0]) + (isLightTheme ? chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.dim(chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.grey(placeholder.slice(1))) : chalk__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.grey(placeholder.slice(1))) : cursorStyle(" ");
        renderedValue = value.length > 0 ? "" : cursorStyle(" ");
        let i = 0;
        let col = 0;
        const cols = (_a = stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _a !== void 0 ? _a : 0;
        let caretInserted = false;
        for (const char of value) {
          if (char === "\n") {
            const isCursorOnNewlineChar = i >= cursorOffset - cursorActualWidth && i < cursorOffset;
            const atEndOfLineBeforeNewline = cursorActualWidth === 0 && cursorOffset === i && (
            // avoid double-caret on empty lines (previous char is a newline)
            i === 0 || value[i - 1] !== "\n");
            if (!caretInserted && (isCursorOnNewlineChar || atEndOfLineBeforeNewline)) {
              if (!(cols > 0 && col === cols - 1)) renderedValue += cursorStyle(" ");
              caretInserted = true;
            }
            renderedValue += "\n";
            i++;
            col = 0;
            const isCaretAtStartOfNextLine = cursorActualWidth === 0 && cursorOffset === i;
            if (!caretInserted && isCaretAtStartOfNextLine) {
              const nextChar = value[i];
              if (nextChar == null || nextChar === "\n") {
                renderedValue += cursorStyle(" ");
                caretInserted = true;
              }
            }
            continue;
          }
          const hasSelection = cursorActualWidth > 0 && i >= cursorOffset - cursorActualWidth && i < cursorOffset;
          const caretOnThisChar = cursorActualWidth === 0 && i === cursorOffset;
          if (hasSelection || caretOnThisChar) {
            renderedValue += cursorStyle(char);
            if (caretOnThisChar) caretInserted = true;
          } else {
            renderedValue += char;
          }
          i += char.length;
          col++;
          if (cols > 0 && col >= cols) col = 0;
        }
        if (!caretInserted && value.length > 0 && cursorOffset === value.length) {
          renderedValue += cursorStyle(" ");
          caretInserted = true;
        }
      }
      const {
        isRawModeSupported
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdin */.mT)();
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (isRawModeSupported) process.stdin.setRawMode(true);
        return () => {
          if (isRawModeSupported) process.stdin.setRawMode(false);
        };
      }, [isRawModeSupported]);
      const text = placeholder ? value.length > 0 ? renderedValue : renderedPlaceholder : renderedValue;
      // Apply styling to pasted text placeholders
      const styledText = typeof text === "string" ? stylePastedTextPlaceholders(text, isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) : text;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexGrow: 1,
          marginRight: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            dimColor: dimmed,
            children: styledText
          })
        }), rightPlaceholder && value.length === 0 && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexShrink: 0,
          marginLeft: 1,
          marginRight: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            dimColor: isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false,
            children: rightPlaceholder
          })
        })]
      });
    }
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = react__WEBPACK_IMPORTED_MODULE_2__.memo(TextInput);
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/