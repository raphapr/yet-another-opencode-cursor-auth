__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Ay: () => __WEBPACK_DEFAULT_EXPORT__,
      /* harmony export */oz: () => (/* binding */Markdown)
      /* harmony export */
    });
    /* unused harmony exports parseMarkdown, tokenizeInline */
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_config_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/context/config-context.tsx");
    /* harmony import */
    var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/context/theme-context.tsx");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/utils/color-mixing.ts");
    /* harmony import */
    var _highlighted_code_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/highlighted-code.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_8__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__, _highlighted_code_js__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;

    /**
     * Simple markdown parser that extracts common elements
     */
    function parseMarkdown(content) {
      var _a, _b;
      const lines = content.split(/\r?\n/);
      const elements = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        // Code blocks (```language) or (```start:end:path)
        if (line.trim().startsWith("```")) {
          const info = line.trim().slice(3).trim();
          let language = info || "text";
          let startLineNumber;
          let path;
          // Recognize code citation fences of the form: ```start:end:path
          // Example: ```1:10:fizzbuzz.py
          const citeMatch = info.match(/^(\d+):(\d+):(.+)$/);
          if (citeMatch) {
            startLineNumber = Number.parseInt(citeMatch[1], 10);
            path = citeMatch[3].trim();
            const inferred = inferLanguageFromPath(path);
            language = inferred !== null && inferred !== void 0 ? inferred : "text";
          } else if (info && /[/\\.]/.test(info) && !/\s/.test(info)) {
            // If info looks like a filename or path, infer language from its extension
            path = info;
            const inferred = inferLanguageFromPath(info);
            language = inferred !== null && inferred !== void 0 ? inferred : language;
          }
          const codeLines = [];
          i++;
          // Check if the first line contains a file path (e.g., "⬢ Read src/components/PromptBar.tsx")
          // and extract the path if no path was already found in the opening line
          if (!path && i < lines.length && !lines[i].trim().startsWith("```")) {
            const firstLine = lines[i].trim();
            // Match patterns like "⬢ Read path/to/file.ext" or "Read path/to/file.ext"
            const readMatch = firstLine.match(/^(?:⬢\s+)?Read\s+(.+)$/);
            if (readMatch) {
              const extractedPath = readMatch[1].trim();
              // Verify it looks like a file path
              if (/[/\\.]/.test(extractedPath) && !/\s/.test(extractedPath)) {
                path = extractedPath;
                const inferred = inferLanguageFromPath(extractedPath);
                language = inferred !== null && inferred !== void 0 ? inferred : language;
                // Skip this line since it's not actual code content
                i++;
              }
            }
          }
          // Collect code block content
          while (i < lines.length && !lines[i].trim().startsWith("```")) {
            codeLines.push(lines[i]);
            i++;
          }
          elements.push({
            type: "code-block",
            content: codeLines.join("\n"),
            language,
            startLineNumber,
            path
          });
          i++; // Skip closing ```
          continue;
        }
        // Headings
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          elements.push({
            type: "heading",
            content: headingMatch[2],
            level: headingMatch[1].length
          });
          i++;
          continue;
        }
        // Ordered list items: e.g., "1. Item" or "1) Item" with indentation-derived nesting level
        const orderedListMatch = line.match(/^(\s*)(\d+)[.)]\s+/);
        if (orderedListMatch) {
          const rawIndent = (_a = orderedListMatch[1]) !== null && _a !== void 0 ? _a : "";
          let visualWidth = 0;
          for (const ch of rawIndent) visualWidth += ch === "\t" ? 2 : 1;
          const level = Math.max(0, Math.floor(visualWidth / 2));
          const indexNum = Number.parseInt(orderedListMatch[2], 10);
          elements.push({
            type: "list-item",
            content: line.replace(/^(\s*)(\d+)[.)]\s+/, ""),
            level,
            ordered: true,
            index: Number.isFinite(indexNum) ? indexNum : 1
          });
          i++;
          continue;
        }
        // Unordered list items with indentation level derived from leading whitespace
        const unorderedListMatch = line.match(/^(\s*)[-*+]\s+/);
        if (unorderedListMatch) {
          const rawIndent = (_b = unorderedListMatch[1]) !== null && _b !== void 0 ? _b : "";
          let visualWidth = 0;
          for (const ch of rawIndent) visualWidth += ch === "\t" ? 2 : 1;
          const level = Math.max(0, Math.floor(visualWidth / 2));
          elements.push({
            type: "list-item",
            content: line.replace(/^(\s*)[-*+]\s+/, ""),
            level,
            ordered: false
          });
          i++;
          continue;
        }
        // Blockquotes
        if (line.trim().startsWith("> ")) {
          elements.push({
            type: "blockquote",
            content: line.replace(/^\s*>\s?/, "")
          });
          i++;
          continue;
        }
        // Regular text (handle inline formatting)
        if (line.trim()) {
          elements.push({
            type: "text",
            content: line
          });
        }
        i++;
      }
      return elements;
    }
    function inferLanguageFromPath(p) {
      var _a;
      const filename = (_a = p.split(/[\\/]/).pop()) !== null && _a !== void 0 ? _a : p;
      const dotIdx = filename.lastIndexOf(".");
      if (dotIdx <= 0 || dotIdx === filename.length - 1) return null;
      const ext = filename.slice(dotIdx + 1).toLowerCase();
      switch (ext) {
        case "ts":
          return "typescript";
        case "tsx":
          return "tsx";
        case "js":
          return "javascript";
        case "jsx":
          return "jsx";
        case "py":
          return "python";
        case "java":
          return "java";
        case "c":
          return "c";
        case "cc":
        case "cpp":
        case "cxx":
          return "cpp";
        case "cs":
        case "csharp":
          return "csharp";
        case "go":
          return "go";
        case "rs":
          return "rust";
        case "php":
          return "php";
        case "rb":
          return "ruby";
        case "swift":
          return "swift";
        case "kt":
        case "kts":
          return "kotlin";
        case "scala":
          return "scala";
        case "html":
        case "htm":
          return "html";
        case "css":
          return "css";
        case "scss":
          return "scss";
        case "json":
          return "json";
        case "yml":
        case "yaml":
          return "yaml";
        case "xml":
          return "xml";
        case "md":
        case "markdown":
          return "markdown";
        case "sh":
        case "bash":
          return "bash";
        case "sql":
          return "sql";
        case "dockerfile":
        case "docker":
          return "dockerfile";
        case "vue":
          return "vue";
        case "svelte":
          return "svelte";
        case "txt":
        case "text":
          return "text";
        default:
          return null;
      }
    }
    function findNextItalicEnd(text, start) {
      let i = text.indexOf("*", start);
      while (i !== -1) {
        if (text[i + 1] === "*") {
          i = text.indexOf("*", i + 2);
          continue;
        }
        return i;
      }
      return -1;
    }
    /**
     * Tokenize inline markdown with precedence that respects earliest delimiter and favors bold over italic.
     */
    function tokenizeInline(text) {
      const tokens = [];
      let i = 0;
      const pushText = s => {
        if (s.length > 0) tokens.push({
          type: "text",
          content: s
        });
      };
      while (i < text.length) {
        const idxBack = text.indexOf("`", i);
        const idxStar = text.indexOf("*", i);
        let next = -1;
        let kind = null;
        if (idxBack !== -1) {
          next = idxBack;
          kind = "back";
        }
        if (idxStar !== -1 && (next === -1 || idxStar < next)) {
          if (text.startsWith("**", idxStar)) {
            next = idxStar;
            kind = "bold";
          } else {
            next = idxStar;
            kind = "italic";
          }
        } else if (idxStar !== -1 && idxStar === next && text.startsWith("**", idxStar)) {
          kind = "bold";
        }
        if (next === -1 || kind === null) {
          pushText(text.slice(i));
          break;
        }
        if (next > i) pushText(text.slice(i, next));
        if (kind === "back") {
          const end = text.indexOf("`", next + 1);
          if (end !== -1) {
            tokens.push({
              type: "code",
              content: text.slice(next + 1, end)
            });
            i = end + 1;
            continue;
          }
          pushText("`");
          i = next + 1;
          continue;
        }
        if (kind === "bold") {
          const end = text.indexOf("**", next + 2);
          if (end !== -1) {
            const inner = text.slice(next + 2, end);
            if (inner.length > 0) tokens.push({
              type: "bold",
              content: inner
            });
            i = end + 2;
            continue;
          }
          pushText("*");
          i = next + 1;
          continue;
        }
        const end = findNextItalicEnd(text, next + 1);
        if (end !== -1) {
          const inner = text.slice(next + 1, end);
          const trimmed = inner.trim();
          if (trimmed.length > 0) tokens.push({
            type: "italic",
            content: inner
          });else pushText(`*${inner}*`);
          i = end + 1;
          continue;
        }
        pushText("*");
        i = next + 1;
      }
      return tokens;
    }
    /**
     * Renders inline markdown formatting (bold, italic, inline code)
     */
    function renderInlineFormatting(text, black, white) {
      const parts = [];
      let key = 0;
      const tokens = tokenizeInline(text);
      for (const t of tokens) {
        if (t.type === "text") parts.push((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          children: t.content
        }, key++));else if (t.type === "code") parts.push((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          wrap: "wrap",
          color: white,
          backgroundColor: black,
          children: t.content
        }, key++));else if (t.type === "bold") parts.push((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          bold: true,
          wrap: "wrap",
          children: t.content
        }, key++));else if (t.type === "italic") parts.push((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          italic: true,
          wrap: "wrap",
          children: t.content
        }, key++));
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: parts
      });
    }
    /**
     * A markdown renderer component that supports syntax highlighting for code blocks
     */
    const MarkdownCodeBlock = react__WEBPACK_IMPORTED_MODULE_2__.memo(({
      content,
      language,
      startLineNumber,
      path
    }) => {
      const showLineNumbers = (0, _context_config_context_js__WEBPACK_IMPORTED_MODULE_4__ /* .useShowLineNumbers */.$i)();
      const shouldShowLineNumbers = showLineNumbers && content.split("\n").length > 1;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        children: [path && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginBottom: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            bold: true,
            children: [" ", path, " ", startLineNumber ? `lines ${startLineNumber}-${startLineNumber + content.split("\n").length - 1}` : ""]
          })
        }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_highlighted_code_js__WEBPACK_IMPORTED_MODULE_8__ /* .HighlightedCode */.d, {
          content: content,
          language: language,
          startLineNumber: startLineNumber !== null && startLineNumber !== void 0 ? startLineNumber : 1,
          showLineNumbers: shouldShowLineNumbers
        })]
      });
    });
    const Markdown = react__WEBPACK_IMPORTED_MODULE_2__.memo(({
      content
    }) => {
      const elements = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => parseMarkdown(content), [content]);
      const isLightTheme = (0, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_5__ /* .useIsLightTheme */.pW)();
      const colorMode = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_7__ /* .getColorMode */.PT)(), []);
      const black = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_6__.debugLog)("colorMode", colorMode);
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_6__.debugLog)("isLightTheme", isLightTheme);
        if (colorMode === "truecolor") {
          return isLightTheme ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_TRUECOLOR_LIGHT */.dU.backgroundHex : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_TRUECOLOR_DARK */.F3.backgroundHex;
        }
        const background = isLightTheme ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_ANSI256_LIGHT */.i1.background : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_ANSI256_DARK */.sg.background;
        return (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_7__ /* .ansi256IndexToHex */.LR)(background);
      }, [isLightTheme, colorMode]);
      const white = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (colorMode === "truecolor") {
          return isLightTheme ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_TRUECOLOR_LIGHT */.dU.foregroundHex : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_TRUECOLOR_DARK */.F3.foregroundHex;
        }
        const foreground = isLightTheme ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_ANSI256_LIGHT */.i1.foreground : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .INLINE_DIFF_ANSI256_DARK */.sg.foreground;
        return (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_7__ /* .ansi256IndexToHex */.LR)(foreground);
      }, [isLightTheme, colorMode]);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: elements.map((element, index) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j;
          switch (element.type) {
            case "code-block":
              {
                const language = element.language;
                const supportedLanguages = ["javascript", "typescript", "python", "java", "c", "cpp", "csharp", "go", "rust", "php", "ruby", "swift", "kotlin", "scala", "html", "css", "scss", "json", "yaml", "xml", "markdown", "bash", "shell", "sql", "dockerfile", "tsx", "jsx", "vue", "svelte", "text"];
                const isSupported = supportedLanguages.includes(language);
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                  marginY: 1,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MarkdownCodeBlock, {
                    content: element.content,
                    language: isSupported ? language : "text",
                    startLineNumber: element.startLineNumber,
                    path: element.path
                  })
                }, `code-${(_a = element.path) !== null && _a !== void 0 ? _a : ""}-${(_b = element.startLineNumber) !== null && _b !== void 0 ? _b : 0}`);
              }
            case "heading":
              {
                const isLight = isLightTheme;
                const mode = colorMode;
                const headingHex = (() => {
                  if (mode === "truecolor") {
                    if (element.level === 1) return isLight ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_TRUECOLOR_LIGHT */.cM.h1Hex : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_TRUECOLOR_DARK */.CV.h1Hex;
                    if (element.level === 2) return isLight ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_TRUECOLOR_LIGHT */.cM.h2Hex : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_TRUECOLOR_DARK */.CV.h2Hex;
                    return isLight ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_TRUECOLOR_LIGHT */.cM.hnHex : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_TRUECOLOR_DARK */.CV.hnHex;
                  }
                  return null;
                })();
                const headingAnsiHex = (() => {
                  if (mode !== "truecolor") {
                    const idx = element.level === 1 ? isLight ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_ANSI256_LIGHT */.bR.h1 : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_ANSI256_DARK */.XQ.h1 : element.level === 2 ? isLight ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_ANSI256_LIGHT */.bR.h2 : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_ANSI256_DARK */.XQ.h2 : isLight ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_ANSI256_LIGHT */.bR.hn : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .HEADING_ANSI256_DARK */.XQ.hn;
                    return (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_7__ /* .ansi256IndexToHex */.LR)(idx);
                  }
                  return null;
                })();
                const headingColor = (_c = headingHex !== null && headingHex !== void 0 ? headingHex : headingAnsiHex) !== null && _c !== void 0 ? _c : undefined;
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                  marginBottom: 1,
                  marginTop: 1,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, Object.assign({
                    bold: true
                  }, headingColor ? {
                    color: headingColor
                  } : {}, {
                    wrap: "wrap",
                    children: element.content
                  }))
                }, `heading-${element.level}-${element.content}`);
              }
            case "list-item":
              {
                const isEndOfList = ((_e = (_d = elements[index + 1]) === null || _d === void 0 ? void 0 : _d.type) !== null && _e !== void 0 ? _e : null) !== "list-item";
                const indent = Math.max(0, (_f = element.level) !== null && _f !== void 0 ? _f : 0);
                const indentWidth = indent * 2;
                const isOrdered = element.ordered === true;
                const marker = isOrdered ? `${((_g = element.index) !== null && _g !== void 0 ? _g : 1).toString()}.` : "•";
                const markerColumnWidth = isOrdered ? Math.max(marker.length + 1, 3) : 2;
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                  flexDirection: "row",
                  marginBottom: isEndOfList ? 1 : 0,
                  children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                    width: indentWidth
                  }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                    width: markerColumnWidth,
                    children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                      color: "gray",
                      children: marker
                    })
                  }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                    flexGrow: 1,
                    paddingRight: 2,
                    children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                      wrap: "wrap",
                      children: renderInlineFormatting(element.content, black, white)
                    })
                  })]
                }, `list-item-${(_h = element.index) !== null && _h !== void 0 ? _h : index}-${(_j = element.level) !== null && _j !== void 0 ? _j : 0}-${element.content}`);
              }
            case "blockquote":
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                paddingLeft: 2,
                borderLeft: true,
                borderColor: "gray",
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: "gray",
                  italic: true,
                  wrap: "wrap",
                  children: renderInlineFormatting(element.content, black, white)
                })
              }, `blockquote-${element.content}`);
            default:
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  wrap: "wrap",
                  children: renderInlineFormatting(element.content, black, white)
                })
              }, `${element.type}-${element.content}`);
          }
        })
      });
    });
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = Markdown;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/