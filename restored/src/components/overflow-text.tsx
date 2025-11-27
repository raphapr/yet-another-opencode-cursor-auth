__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Y: () => (/* binding */OverflowText)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

    /**
     * Simple word wrapping function that respects word boundaries
     */
    function wrapText(text, maxWidth) {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";
      for (const word of words) {
        // Handle words that are longer than maxWidth
        if (word.length > maxWidth) {
          if (currentLine) {
            lines.push(currentLine.trim());
            currentLine = "";
          }
          // Break long words at maxWidth
          let remainingWord = word;
          while (remainingWord.length > maxWidth) {
            lines.push(remainingWord.slice(0, maxWidth));
            remainingWord = remainingWord.slice(maxWidth);
          }
          currentLine = `${remainingWord} `;
          continue;
        }
        // Check if adding this word would exceed maxWidth
        if (currentLine.length + word.length + 1 > maxWidth) {
          if (currentLine) {
            lines.push(currentLine.trim());
            currentLine = `${word} `;
          } else {
            currentLine = `${word} `;
          }
        } else {
          currentLine += `${word} `;
        }
      }
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      return lines.join("\n");
    }
    /**
     * OverflowText component that displays the last n display lines of text
     * with proper word-boundary respecting line wrapping.
     */
    const OverflowText = ({
      content,
      maxLines,
      color = "white",
      showHiddenIndicator = true,
      width
    }) => {
      var _a;
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdout */.t$)();
      // Get terminal width or use provided width
      const terminalWidth = ((_a = width !== null && width !== void 0 ? width : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _a !== void 0 ? _a : 80) - 4;
      // Handle existing newlines by processing each paragraph separately
      const paragraphs = content.split("\n");
      const wrappedParagraphs = paragraphs.map(paragraph => paragraph.trim() === "" ? "" : wrapText(paragraph, terminalWidth));
      const wrappedText = wrappedParagraphs.join("\n");
      // Split into display lines
      const displayLines = wrappedText.split("\n");
      // Get the last maxLines lines
      const hiddenCount = Math.max(0, displayLines.length - maxLines);
      // If only 1 line would be hidden, show it instead of the indicator
      const effectiveMaxLines = hiddenCount === 1 ? maxLines + 1 : maxLines;
      const visibleLines = displayLines.slice(-effectiveMaxLines);
      const adjustedHiddenCount = Math.max(0, displayLines.length - effectiveMaxLines);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        children: [showHiddenIndicator && adjustedHiddenCount > 0 && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          dimColor: true,
          children: ["... (", adjustedHiddenCount, " lines hidden)"]
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          color: color,
          children: visibleLines.join("\n")
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/