__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _palette_aligned_list_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/prompt/palette-aligned-list.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_palette_aligned_list_js__WEBPACK_IMPORTED_MODULE_2__]);
    _palette_aligned_list_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const MAX_LABEL_COLS = 40;
    const splitPath = p => {
      const isDir = p.endsWith("/");
      const trimmed = isDir ? p.slice(0, -1) : p;
      const idx = trimmed.lastIndexOf("/");
      if (idx === -1) return {
        name: trimmed + (isDir ? "/" : ""),
        parent: "",
        isDir
      };
      const parent = idx === 0 ? "/" : trimmed.slice(0, idx);
      const name = trimmed.slice(idx + 1) + (isDir ? "/" : "");
      return {
        name,
        parent,
        isDir
      };
    };
    const PaletteAtList = ({
      suggestions,
      activeIndex,
      windowStart,
      pageSize = _constants_js__WEBPACK_IMPORTED_MODULE_1__ /* .PALETTE_PAGE_SIZE */.kQ,
      highlightColor
    }) => {
      const items = suggestions.map((p, idx) => {
        const {
          name,
          parent
        } = splitPath(p);
        return {
          key: `at-${p}-${idx}`,
          label: name,
          description: parent
        };
      });
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_palette_aligned_list_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A, {
        items: items,
        activeIndex: activeIndex,
        windowStart: windowStart,
        pageSize: pageSize,
        highlightColor: highlightColor,
        maxLabelCols: MAX_LABEL_COLS
      });
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = PaletteAtList;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/