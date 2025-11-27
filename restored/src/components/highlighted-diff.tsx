__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export HighlightedDiff */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
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
    const hexToRgb = hex => {
      const cleanHex = hex.replace("#", "");
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return {
        r,
        g,
        b
      };
    };
    const rgbToHex = rgb => {
      const toHex = n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
      return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    };
    const mixColors = (baseColor, tintColor, tintStrength) => {
      try {
        const base = hexToRgb(baseColor);
        const tint = hexToRgb(tintColor);
        const mixed = {
          r: base.r * (1 - tintStrength) + tint.r * tintStrength,
          g: base.g * (1 - tintStrength) + tint.g * tintStrength,
          b: base.b * (1 - tintStrength) + tint.b * tintStrength
        };
        return rgbToHex(mixed);
      } catch (_a) {
        // Fallback to original color if mixing fails
        return baseColor;
      }
    };
    const DiffLineComponent = ({
      children,
      showLineNumbers,
      lineNumberMode,
      type,
      beforeLineNumber,
      afterLineNumber,
      addedColor,
      removedColor,
      lineNumberWidth
    }) => {
      const getLineColor = () => {
        switch (type) {
          case "added":
            return addedColor;
          case "removed":
            return removedColor;
          default:
            return "white";
        }
      };
      const getPrefix = () => {
        switch (type) {
          case "added":
            return "+";
          case "removed":
            return "-";
          default:
            return " ";
        }
      };
      const formatLineNumbers = () => {
        if (!showLineNumbers || lineNumberMode === "none") return null;
        switch (lineNumberMode) {
          case "after":
            {
              // Show only after line numbers
              const afterNum = afterLineNumber ? afterLineNumber.toString().padStart(lineNumberWidth - 1, " ") : " ".repeat(lineNumberWidth - 1);
              return afterNum;
            }
          default:
            {
              // Show both before and after line numbers (original behavior)
              const padWidth = Math.floor(lineNumberWidth / 2);
              const beforeNum = beforeLineNumber ? beforeLineNumber.toString().padStart(padWidth, " ") : " ".repeat(padWidth);
              const afterLineNumBoth = afterLineNumber ? afterLineNumber.toString().padStart(padWidth, " ") : " ".repeat(padWidth);
              return `${beforeNum} ${afterLineNumBoth}`;
            }
        }
      };
      const getLineNumberBoxWidth = () => {
        if (lineNumberMode === "after") {
          return lineNumberWidth + 1; // Narrower for single column
        }
        return lineNumberWidth + 2; // Original width for both columns
      };
      return _jsxs(Box, {
        flexDirection: "row",
        children: [showLineNumbers && lineNumberMode !== "none" && _jsx(Box, {
          width: getLineNumberBoxWidth(),
          flexShrink: 0,
          borderRight: true,
          borderLeft: false,
          borderTop: false,
          borderBottom: false,
          borderColor: "gray",
          borderStyle: "single",
          justifyContent: "flex-end",
          children: _jsx(Text, {
            dimColor: true,
            children: formatLineNumbers()
          })
        }), _jsx(Box, {
          width: 1,
          flexShrink: 0,
          children: _jsx(Text, {
            color: getLineColor(),
            children: getPrefix()
          })
        }), _jsx(Box, {
          paddingLeft: 1,
          children: children
        })]
      });
    };
    const createDiffLines = (beforeContent, afterContent) => {
      const beforeLines = beforeContent.split("\n");
      const afterLines = afterContent.split("\n");
      const diffLines = [];
      let beforeIndex = 0;
      let afterIndex = 0;
      const isCommon = (aIndex, bIndex) => {
        return beforeLines[aIndex] === afterLines[bIndex];
      };
      const foundSubsequence = (nCommon, aCommon, bCommon) => {
        // Add removed lines
        for (let i = beforeIndex; i < aCommon; i++) {
          diffLines.push({
            type: "removed",
            content: beforeLines[i],
            lineNumber: null,
            beforeLineNumber: i + 1
          });
        }
        // Add added lines
        for (let i = afterIndex; i < bCommon; i++) {
          diffLines.push({
            type: "added",
            content: afterLines[i],
            lineNumber: null,
            afterLineNumber: i + 1
          });
        }
        // Add common lines
        for (let i = 0; i < nCommon; i++) {
          diffLines.push({
            type: "common",
            content: beforeLines[aCommon + i],
            lineNumber: aCommon + i + 1,
            beforeLineNumber: aCommon + i + 1,
            afterLineNumber: bCommon + i + 1
          });
        }
        beforeIndex = aCommon + nCommon;
        afterIndex = bCommon + nCommon;
      };
      diffSequences(beforeLines.length, afterLines.length, isCommon, foundSubsequence);
      // Handle remaining lines
      for (let i = beforeIndex; i < beforeLines.length; i++) {
        diffLines.push({
          type: "removed",
          content: beforeLines[i],
          lineNumber: null,
          beforeLineNumber: i + 1
        });
      }
      for (let i = afterIndex; i < afterLines.length; i++) {
        diffLines.push({
          type: "added",
          content: afterLines[i],
          lineNumber: null,
          afterLineNumber: i + 1
        });
      }
      return diffLines;
    };
    /**
     * Filter diff lines to show only hunks with context
     */
    const filterDiffLinesWithContext = (diffLines, contextLines) => {
      const result = [];
      const changeIndices = [];
      // Find all indices of changed lines
      diffLines.forEach((line, index) => {
        if (line.type !== "common") {
          changeIndices.push(index);
        }
      });
      if (changeIndices.length === 0) {
        return [];
      }
      // Group consecutive changes into hunks
      const hunks = [];
      let currentHunk = null;
      changeIndices.forEach(index => {
        if (!currentHunk) {
          currentHunk = {
            start: index,
            end: index
          };
        } else if (index <= currentHunk.end + contextLines * 2 + 1) {
          // Extend current hunk if the change is close enough
          currentHunk.end = index;
        } else {
          // Start a new hunk
          hunks.push(currentHunk);
          currentHunk = {
            start: index,
            end: index
          };
        }
      });
      if (currentHunk) {
        hunks.push(currentHunk);
      }
      // Add lines for each hunk with context
      let lastEndIndex = -1;
      hunks.forEach((hunk, hunkIndex) => {
        const startIndex = Math.max(0, hunk.start - contextLines);
        const endIndex = Math.min(diffLines.length - 1, hunk.end + contextLines);
        // Add separator between hunks with hidden line count
        if (hunkIndex > 0 && lastEndIndex !== -1) {
          const hiddenCount = startIndex - lastEndIndex - 1;
          if (hiddenCount > 0) {
            result.push({
              type: "separator",
              hiddenLines: hiddenCount
            });
          }
        }
        // Add lines for this hunk
        for (let i = startIndex; i <= endIndex; i++) {
          result.push(diffLines[i]);
        }
        lastEndIndex = endIndex;
      });
      return result;
    };
    /**
     * A syntax-highlighted diff viewer component that shows differences between two pieces of code
     * with customizable colors and tinting options.
     */
    const HighlightedDiff = ({
      beforeContent,
      afterContent,
      language,
      showLineNumbers = true,
      lineNumberMode = "both",
      enableBackgroundTint = false,
      addedColor = "#22c55e",
      removedColor = "#ef4444",
      backgroundColorTintAmount = 0.2,
      colorTintAmount = 0.1,
      lineNumberWidth = 8,
      compactMode = false,
      contextLines = 3
    }) => {
      const [diffLines, setDiffLines] = useState([]);
      const [beforeTokens, setBeforeTokens] = useState(null);
      const [afterTokens, setAfterTokens] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      useEffect(() => {
        const generateDiff = () => __awaiter(void 0, void 0, void 0, function* () {
          try {
            setLoading(true);
            setError(null);
            // Generate syntax highlighted tokens for both files
            const [beforeResult, afterResult] = yield Promise.all([codeToTokens(beforeContent, {
              lang: language,
              theme: "dark-plus"
            }), codeToTokens(afterContent, {
              lang: language,
              theme: "dark-plus"
            })]);
            setBeforeTokens(beforeResult);
            setAfterTokens(afterResult);
            // Generate diff lines
            const lines = createDiffLines(beforeContent, afterContent);
            setDiffLines(lines);
          } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
          } finally {
            setLoading(false);
          }
        });
        generateDiff();
      }, [beforeContent, afterContent, language]);
      const getBackgroundTintColor = lineType => {
        if (!enableBackgroundTint) return undefined;
        switch (lineType) {
          case "added":
            return mixColors("#000000", addedColor, backgroundColorTintAmount);
          case "removed":
            return mixColors("#000000", removedColor, backgroundColorTintAmount);
          default:
            return undefined;
        }
      };
      const renderTokensForLine = line => {
        if (!beforeTokens || !afterTokens) {
          return _jsx(Text, {
            children: line.content
          });
        }
        let tokensToRender;
        if (line.type === "common" && line.afterLineNumber) {
          tokensToRender = afterTokens.tokens[line.afterLineNumber - 1];
        } else if (line.type === "removed" && line.beforeLineNumber) {
          tokensToRender = beforeTokens.tokens[line.beforeLineNumber - 1];
        } else if (line.type === "added" && line.afterLineNumber) {
          tokensToRender = afterTokens.tokens[line.afterLineNumber - 1];
        }
        if (!tokensToRender) {
          return _jsx(Text, {
            children: line.content
          });
        }
        const backgroundTint = getBackgroundTintColor(line.type);
        return _jsx(_Fragment, {
          children: tokensToRender.map((token, tokenIndex) => {
            let tokenColor = token.color || "#ffffff";
            let backgroundColor = token.bgColor;
            // Apply color tinting for added/removed lines
            if (enableBackgroundTint && line.type !== "common") {
              const tintColor = line.type === "added" ? addedColor : removedColor;
              // Tint the token color
              tokenColor = mixColors(tokenColor, tintColor, colorTintAmount);
              // Use the background tint
              backgroundColor = backgroundTint || backgroundColor;
            }
            return _jsx(Text, {
              color: tokenColor,
              backgroundColor: backgroundColor,
              italic: token.fontStyle === 1,
              bold: token.fontStyle === 2,
              underline: token.fontStyle === 4,
              children: token.content
            }, `${token.content}-${tokenIndex}`);
          })
        });
      };
      if (loading) {
        return _jsx(Text, {
          children: "Loading diff..."
        });
      }
      if (error) {
        return _jsxs(Text, {
          color: "red",
          children: ["Error: ", error]
        });
      }
      // Filter lines if in compact mode
      const linesToRender = compactMode ? filterDiffLinesWithContext(diffLines, contextLines) : diffLines;
      return _jsx(Box, {
        flexDirection: "column",
        children: linesToRender.map((item, index) => {
          var _a, _b, _c;
          // Handle separator
          if ("type" in item && item.type === "separator") {
            const hiddenText = item.hiddenLines ? `··· ${item.hiddenLines} line${item.hiddenLines === 1 ? "" : "s"} hidden ···` : "···";
            return _jsx(Box, {
              paddingY: 0,
              paddingX: 3,
              justifyContent: "flex-start",
              children: _jsx(Text, {
                dimColor: true,
                children: hiddenText
              })
            }, `separator-${(_a = item.hiddenLines) !== null && _a !== void 0 ? _a : 0}-${index}`);
          }
          // Handle regular diff line
          const line = item;
          return _jsx(DiffLineComponent, {
            type: line.type,
            beforeLineNumber: line.beforeLineNumber,
            afterLineNumber: line.afterLineNumber,
            showLineNumbers: showLineNumbers,
            lineNumberMode: lineNumberMode,
            addedColor: addedColor,
            removedColor: removedColor,
            lineNumberWidth: lineNumberWidth,
            children: renderTokensForLine(line)
          }, `${(_b = line.beforeLineNumber) !== null && _b !== void 0 ? _b : "none"}-${(_c = line.afterLineNumber) !== null && _c !== void 0 ? _c : "none"}-${index}`);
        })
      });
    };
    /* unused harmony default export */
    var __WEBPACK_DEFAULT_EXPORT__ = /* unused pure expression or super */null && HighlightedDiff;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/