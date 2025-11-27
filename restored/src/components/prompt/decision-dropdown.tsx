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
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/context/theme-context.tsx");
    /* harmony import */
    var _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/utils/color-mixing.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const DecisionDropdown = ({
      title,
      highlightColor,
      options,
      selectedIndex,
      subtitle
    }) => {
      const isLightTheme = (0, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_4__ /* .useIsLightTheme */.pW)();
      const colorMode = (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_5__ /* .getColorMode */.PT)();
      // Compute active background color per color mode
      const activeBgHex = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        var _a, _b;
        if (colorMode === "ansi256") return undefined; // will use SGR background instead
        // In truecolor or basic/none, prefer mixed tint for subtle background
        const base = (_a = (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_5__ /* .hexToRgb */.E2)((isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_MIX_BASE_LIGHT_HEX */.bd : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_MIX_BASE_DARK_HEX */.Ts)) !== null && _a !== void 0 ? _a : (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? {
          r: 255,
          g: 255,
          b: 255
        } : {
          r: 30,
          g: 30,
          b: 30
        };
        const tint = (_b = (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_5__ /* .hexToRgb */.E2)((isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_TINT_LIGHT_HEX */.Kp : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_TINT_DARK_HEX */.Wn)) !== null && _b !== void 0 ? _b : (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? {
          r: 255,
          g: 243,
          b: 223
        } : {
          r: 245,
          g: 217,
          b: 159
        };
        const ratio = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_MIX_RATIO_LIGHT */.FL : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_MIX_RATIO_DARK */.Rg;
        return (0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_5__ /* .rgbToHex */.Ob)((0, _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_5__ /* .mixColors */.Lh)(base, tint, ratio));
      }, [isLightTheme, colorMode]);
      const activeBgAnsiIdx = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        if (colorMode !== "ansi256") return undefined;
        return (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_ANSI256_LIGHT */.tg.activeBg : _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .DECISION_DROPDOWN_ANSI256_DARK */.Lo.activeBg;
      }, [colorMode, isLightTheme]);
      // Choose a readable foreground over the active background without parsing ANSI/truecolor strings
      // Heuristic: on light themes, prefer black; on dark themes, prefer white.
      const activeFg = (isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false) ? "black" : "white";
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        marginTop: 0,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: highlightColor,
            children: title
          })
        }), subtitle ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: subtitle
          })
        }) : null, options.map((opt, idx) => {
          const active = idx === selectedIndex;
          const disabled = !!opt.disabled;
          const rowBg = active ? activeBgHex : undefined;
          const labelColor = active ? activeFg : disabled ? "gray" : "gray";
          const hintColor = active ? isLightTheme ? "black" : "white" : "gray";
          const finalHint = active && !disabled ? opt.hint ? `${opt.hint} (enter)` : "(enter)" : opt.hint;
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: rowBg,
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              width: active ? 1 : 0,
              backgroundColor: active ? highlightColor : undefined
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              paddingLeft: active ? 0 : 1,
              paddingY: 0,
              children: active && activeBgAnsiIdx != null ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                children: [`\x1b[48;5;${activeBgAnsiIdx}m`, (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: labelColor,
                  children: "→ "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: labelColor,
                  bold: true,
                  children: opt.label
                }), finalHint ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: hintColor,
                  children: [" ", finalHint]
                }) : null, "\x1b[49m"]
              }) : (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: labelColor,
                  children: active ? "→ " : "  "
                }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: labelColor,
                  bold: active,
                  children: opt.label
                }), finalHint ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                  color: hintColor,
                  children: [" ", finalHint]
                }) : null]
              })
            })]
          }, `${opt.label}-${idx}`);
        })]
      });
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = DecisionDropdown;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/