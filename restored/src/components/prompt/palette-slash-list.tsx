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
    const PaletteSlashList = ({
      items,
      activeIndex,
      windowStart,
      pageSize = _constants_js__WEBPACK_IMPORTED_MODULE_1__ /* .PALETTE_PAGE_SIZE */.kQ,
      highlightColor
    }) => {
      const buildLabel = command => {
        const isArg = command.isArgSuggestion && command.parentCommandId;
        const argsPart = command.args.length > 0 ? " " + command.args.map(a => a.required === false ? `[${a.identifier}]` : `<${a.identifier}>`).join(" ") : "";
        const base = isArg ? `${command.parentCommandId} ${command.identifier}` : command.identifier;
        return `/${base}${argsPart}`;
      };
      const listItems = items.map((command, idx) => {
        var _a;
        return {
          key: `${command.identifier}-${command.parentCommandId || "root"}-${idx}`,
          label: buildLabel(command),
          description: (_a = command.description) !== null && _a !== void 0 ? _a : ""
        };
      });
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_palette_aligned_list_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A, {
        items: listItems,
        activeIndex: activeIndex,
        windowStart: windowStart,
        pageSize: pageSize,
        highlightColor: highlightColor,
        maxLabelCols: 40
      });
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = PaletteSlashList;
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/