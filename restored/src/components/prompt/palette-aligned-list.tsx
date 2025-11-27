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
    var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/hooks/use-screen-size.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const truncateDescriptionByWords = (text, maxCols) => {
      const sanitized = text.trim();
      if (sanitized.length === 0 || maxCols <= 0) return "";
      if (sanitized.length <= maxCols) return sanitized;
      const words = sanitized.split(/\s+/);
      let out = "";
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const next = out.length === 0 ? word : `${out} ${word}`;
        const reserve = 1; // for ellipsis
        if (next.length + reserve > maxCols) {
          return out.length > 0 ? `${out}…` : `${word.slice(0, Math.max(0, maxCols - reserve))}…`;
        }
        out = next;
      }
      return out;
    };
    const PaletteAlignedList = ({
      items,
      activeIndex,
      windowStart,
      pageSize = _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .PALETTE_PAGE_SIZE */.kQ,
      highlightColor,
      maxLabelCols = 40
    }) => {
      const visible = items.slice(windowStart, windowStart + pageSize);
      const highlight = activeIndex - windowStart;
      const {
        width: terminalCols
      } = (0, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_3__ /* .useScreenSize */.l)();
      const labelColWidth = Math.min(visible.reduce((m, it) => Math.max(m, it.label.length), 0), maxLabelCols);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        paddingX: 2,
        flexDirection: "column",
        children: visible.map((it, idx) => {
          const active = idx === highlight;
          const arrowColor = active ? highlightColor : "gray";
          const labelColor = active ? "foreground" : "gray";
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              width: 1,
              backgroundColor: active ? highlightColor : undefined
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              width: 2,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: arrowColor,
                children: active ? "→ " : "  "
              })
            }), labelColWidth > 0 && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              width: labelColWidth,
              marginRight: 2,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: labelColor,
                bold: active,
                wrap: "truncate-end",
                children: it.label
              })
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexGrow: 1,
              children: it.description ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: labelColor,
                bold: active,
                wrap: "truncate-end",
                children: (() => {
                  const padCols = 4; // root paddingX={2}
                  const fixedCols = 1 + 2 + (labelColWidth > 0 ? labelColWidth + 2 : 0);
                  const descMaxCols = Math.max(0, terminalCols - padCols - fixedCols);
                  const truncated = truncateDescriptionByWords(it.description, descMaxCols);
                  return truncated;
                })()
              }) : null
            })]
          }, `${it.key}-${idx}`);
        })
      });
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = PaletteAlignedList;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/