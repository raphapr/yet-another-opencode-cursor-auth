__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Hk: () => (/* binding */AnimatedAscii),
      /* harmony export */W7: () => (/* binding */computeAsciiHeight),
      /* harmony export */Wv: () => (/* binding */computeLeftTrimColumns),
      /* harmony export */oz: () => (/* binding */OnboardingScreen),
      /* harmony export */vY: () => (/* binding */computeAsciiWidth)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _assets_ascii_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/assets/ascii.json");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const CURSOR_ASCII_BASE = `
                   (.
               ((((*  .,,,
           ((((((/**   ..,,,,,
      /((((((////**,    ..,,,,,,,,.
     ,*#@@@@@@@@@@@@@@@@@@@@@@@@@@&,
     ,,,****@@@@@@@@@@@@@@@@@&&&&&,,
     ,,,,,,***,,@@@@@@@@@&&&&&&&....
     ,,,,,,,,,,,,,,,&&&&&&&&&&&.....
     *,,,,,,,,,,////%&&&&&&&&. .....
     *,,,,,,////////%&&&&&&&/   ....
     **////////////(%&&&&&%####((,..
      /%####(((((((#%&&&&%%%%%&&&&*
           %%#######%&&&%%&&&&
               %%###%&%&&&
                   (%.
`;
    // Normalize potentially double-width glyphs to ASCII to avoid wrapping/jitter
    const normalizeFrame = frame => frame.replaceAll("↗", "^").replaceAll("⭢", ">").replaceAll("↑", "^");
    const normalizeFrames = frames => frames.map(normalizeFrame);
    const AnimatedAscii = ({
      frames,
      intervalMs = 80,
      verticalScale = 0.6,
      horizontalScale = 1,
      offsetColumns = 0,
      trimLeftColumns = 0
    }) => {
      var _a, _b;
      const normalizedFrames = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => normalizeFrames(frames), [frames]);
      const [index, setIndex] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      const timerRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
          setIndex(prev => (prev + 1) % frames.length);
        }, intervalMs);
        return () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        };
      }, [frames, intervalMs]);
      const currentFrame = (_b = (_a = normalizedFrames[index]) !== null && _a !== void 0 ? _a : normalizedFrames[0]) !== null && _b !== void 0 ? _b : "";
      // Pre-compute a stable displayed line count across all frames to avoid vertical jitter
      const maxDisplayedLineCount = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        const linesToDrop = 4;
        const scaled = Math.max(0.05, verticalScale);
        return normalizedFrames.reduce((max, frame) => {
          const sourceLines = Math.max(0, frame.split("\n").length - linesToDrop);
          const displayed = Math.max(1, Math.floor(sourceLines * scaled));
          return Math.max(max, displayed);
        }, 0);
      }, [normalizedFrames, verticalScale]);
      // Grayscale palette from darkest to brightest
      const grayscalePalette = ["#303030",
      // dark gray (ANSI-256 safe; avoids mapping to pure black on limited terminals)
      "#767676",
      // gray
      "#a8a8a8",
      // light gray
      "#ffffff" // white
      ];
      // Use same ordering that animation uses (light to dense)
      const densityOrder = ANIMATION_CHARSET;
      const getColorForChar = (ch, col, row, forceWhite) => {
        // Map character density to a grayscale bucket
        const idx = densityOrder.indexOf(ch);
        if (idx >= 0) {
          const t = densityOrder.length > 1 ? idx / (densityOrder.length - 1) : 0;
          const bucket = Math.min(grayscalePalette.length - 1, Math.floor(t * grayscalePalette.length));
          if (row === 8 && forceWhite && col > 3 && col < 25 && grayscalePalette[bucket] !== "#ffffff") {
            return "#b0b0b0";
          }
          return grayscalePalette[bucket];
        }
        // Fallbacks for common chars not in densityOrder
        if (ch === "\n") return grayscalePalette[0];
        if (ch === " ") return grayscalePalette[0];
        // Assume medium-light for unknowns
        return grayscalePalette[2];
      };
      // Render the frame as lines, grouping runs by color to reduce element count
      const renderColoredFrame = frame => {
        const originalLines = frame.split("\n");
        // Remove the last 4 rows from the ASCII frame (crop bottom)
        const linesToDrop = Math.min(4, originalLines.length);
        const sourceLines = originalLines.slice(0, originalLines.length - linesToDrop);
        // Use a fixed displayed line count across frames to prevent height changes
        const displayedLineCount = Math.max(1, maxDisplayedLineCount);
        const mapDisplayedToSourceIndex = displayedIndex => {
          // Inverse mapping from displayed space to source space
          const sourceIndex = Math.floor(displayedIndex / Math.max(0.05, verticalScale));
          return Math.min(sourceLines.length - 1, Math.max(0, sourceIndex));
        };
        const repeatChars = (text, times) => {
          if (times <= 1) return text;
          let out = "";
          for (let i = 0; i < text.length; i += 1) {
            const ch = text[i];
            out += ch.repeat(times);
          }
          return out;
        };
        // Compute once per frame whether displayed row 11 contains 'q'
        const forceWhite = (() => {
          var _a;
          const row11SourceIdx = mapDisplayedToSourceIndex(11);
          const row11Line = (_a = sourceLines[row11SourceIdx]) !== null && _a !== void 0 ? _a : "";
          // row11Line has at least 3 qs
          return row11Line.split("q").length >= 3;
        })();
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          marginLeft: offsetColumns,
          children: Array.from({
            length: displayedLineCount
          }, (_, displayIdx) => {
            var _a;
            const sourceIdx = mapDisplayedToSourceIndex(displayIdx);
            const rawLine = (_a = sourceLines[sourceIdx]) !== null && _a !== void 0 ? _a : "";
            const line = trimLeftColumns > 0 ? rawLine.slice(Math.min(trimLeftColumns, rawLine.length)) : rawLine;
            const runs = [];
            let currentColor = null;
            let currentText = "";
            for (let i = 0; i < line.length; i += 1) {
              const ch = line[i];
              const row = displayIdx;
              const col = i;
              const color = getColorForChar(ch, col, row, forceWhite);
              const displayChar = row === 8 && forceWhite && col > 3 && col < 25 && ch !== " " ? col > 20 ? "↗" : Math.random() < 2 / 3 ? "↗" : "↗" : ch;
              if (currentColor === null) {
                currentColor = color;
                currentText = displayChar;
              } else if (color === currentColor) {
                currentText += displayChar;
              } else {
                runs.push({
                  color: currentColor,
                  text: currentText
                });
                currentColor = color;
                currentText = displayChar;
              }
            }
            if (currentColor !== null) {
              runs.push({
                color: currentColor,
                text: currentText
              });
            }
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: Display position matters for visual consistency
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                wrap: "truncate",
                children: runs.map((run, i) => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: run.color,
                  wrap: "truncate",
                  children: repeatChars(run.text, Math.max(1, Math.floor(horizontalScale)))
                }, `${run.color}-${run.text}-${i}`))
              }, `line-${line}-${displayIdx}`)
            );
          })
        });
      };
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: renderColoredFrame(currentFrame)
      });
    };
    // Character set to use for animation, ordered from light to dense
    const ANIMATION_CHARSET = ` .'\`^",:;Il!i><~+_-?][}{1)(|\\/tf↗⭢↑jrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`;
    // Generate a subtle shimmer animation by cycling through ANIMATION_CHARSET while preserving shape.
    const CURSOR_ASCII_FRAMES = (() => {
      const baseChars = CURSOR_ASCII_BASE.split("");
      const nonSpacePositions = baseChars.map((ch, idx) => ch === " " || ch === "\n" ? -1 : idx).filter(idx => idx >= 0);
      const frameCount = ANIMATION_CHARSET.length;
      const frames = Array.from({
        length: frameCount
      }, (_, frameIndex) => {
        const out = [...baseChars];
        for (let i = 0; i < nonSpacePositions.length; i++) {
          const pos = nonSpacePositions[i];
          const ch = baseChars[pos];
          if (ch === "\n") continue;
          const replacementIndex = (i + frameIndex) % ANIMATION_CHARSET.length;
          const replacement = ANIMATION_CHARSET.charAt(replacementIndex);
          out[pos] = replacement;
        }
        return out.join("");
      });
      return frames.length > 0 ? frames : [CURSOR_ASCII_BASE];
    })();
    // Prefer explicit typing for imported JSON frames
    const ASCII_JSON_FRAMES = _assets_ascii_json__WEBPACK_IMPORTED_MODULE_3__;
    // Compute a stable column width for the ASCII animation so the text on the right
    // doesn't shift as frames change
    const computeAsciiWidth = (frames, horizontalScale, offsetColumns, trimLeftColumns) => {
      const maxLineLength = frames.reduce((max, frame) => {
        const frameMax = frame.split("\n").reduce((m, line) => {
          const effectiveLength = Math.max(0, line.length - Math.max(0, trimLeftColumns));
          return Math.max(m, effectiveLength);
        }, 0);
        return Math.max(max, frameMax);
      }, 0);
      const scale = Math.max(1, Math.floor(horizontalScale));
      return offsetColumns + maxLineLength * scale;
    };
    // Find the minimum number of common leading spaces across all non-empty lines
    // of all frames (after bottom cropping) so we can trim unnecessary left padding.
    const computeLeftTrimColumns = frames => {
      const normalized = normalizeFrames(frames);
      const linesToDrop = 4;
      let minLeadingSpaces = Number.POSITIVE_INFINITY;
      for (const frame of normalized) {
        const originalLines = frame.split("\n");
        const sourceLines = originalLines.slice(0, Math.max(0, originalLines.length - Math.min(4, originalLines.length, linesToDrop)));
        for (const line of sourceLines) {
          if (line.trim().length === 0) continue;
          const match = line.match(/^ */);
          const leading = match ? match[0].length : 0;
          if (leading < minLeadingSpaces) minLeadingSpaces = leading;
          if (minLeadingSpaces === 0) return 0;
        }
      }
      return Number.isFinite(minLeadingSpaces) ? Math.max(0, minLeadingSpaces) : 0;
    };
    // Compute a stable row count for the ASCII animation to avoid vertical jitter
    const computeAsciiHeight = (frames, verticalScale) => {
      const linesToDrop = 4;
      const scaled = Math.max(0.05, verticalScale);
      const maxDisplayed = frames.reduce((max, frame) => {
        const sourceLines = Math.max(0, frame.split("\n").length - linesToDrop);
        const displayed = Math.max(1, Math.floor(sourceLines * scaled));
        return Math.max(max, displayed);
      }, 0);
      return maxDisplayed;
    };
    const OnboardingScreen = props => {
      switch (props.type) {
        case "welcome":
          {
            const usedFrames = ASCII_JSON_FRAMES.length > 0 ? normalizeFrames(ASCII_JSON_FRAMES) : normalizeFrames(CURSOR_ASCII_FRAMES);
            const horizontalScale = 1;
            const verticalScale = 0.6;
            const offsetColumns = 0; // prevent inner margin pushing content to wrap
            const trimLeftColumns = computeLeftTrimColumns(usedFrames);
            const asciiWidth = computeAsciiWidth(usedFrames, horizontalScale, offsetColumns, trimLeftColumns);
            const asciiHeight = computeAsciiHeight(usedFrames, verticalScale);
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexDirection: "row",
              marginLeft: 1,
              gap: 2,
              alignItems: "flex-start",
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                width: asciiWidth,
                height: asciiHeight,
                children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AnimatedAscii, {
                  frames: usedFrames,
                  intervalMs: 50,
                  verticalScale: verticalScale,
                  offsetColumns: offsetColumns,
                  horizontalScale: horizontalScale,
                  trimLeftColumns: trimLeftColumns
                })
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                flexDirection: "column",
                marginTop: 8,
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  bold: true,
                  color: "foreground",
                  children: props.message
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
                  marginTop: 1,
                  children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                    color: "green",
                    children: "Press any key to sign in..."
                  })
                })]
              })]
            });
          }
        case "browser":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexDirection: "column",
              marginLeft: 1,
              marginBottom: 1,
              gap: 0,
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                bold: true,
                color: "foreground",
                children: props.message
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: "If your browser didn't open, click this link to sign in:"
              })]
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              wrap: "no-wrap",
              children: props.loginUrl
            })]
          });
        case "waiting":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            marginLeft: 1,
            marginBottom: 1,
            gap: 0,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              bold: true,
              color: "foreground",
              children: props.message
            })
          });
        case "error":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            marginLeft: 1,
            marginBottom: 1,
            gap: 0,
            children: [props.type === "error" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginTop: 1,
              marginBottom: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "red",
                children: "\u2717 Login failed"
              })
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              bold: true,
              color: "foreground",
              children: props.message
            })]
          });
        case "success":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            marginLeft: 1,
            marginBottom: 1,
            gap: 0,
            children: [props.type === "success" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginTop: 1,
              marginBottom: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "green",
                children: "\u2713 Login successful!"
              })
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              bold: true,
              color: "foreground",
              children: props.message
            })]
          });
      }
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/