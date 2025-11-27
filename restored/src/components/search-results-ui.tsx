__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */X: () => (/* binding */renderSearchResults)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _path_display_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/path-display.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _path_display_js__WEBPACK_IMPORTED_MODULE_2__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _path_display_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const SearchResultItem = ({
      result,
      index
    }) => {
      var _a, _b, _c, _d;
      const codeBlock = result.codeBlock;
      if (!codeBlock) {
        return null;
      }
      const fileName = codeBlock.relativeWorkspacePath;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "row",
          gap: 1,
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            bold: true,
            children: [(index + 1).toString().padStart(3, " "), "."]
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_path_display_js__WEBPACK_IMPORTED_MODULE_2__ /* .PathDisplay */.g, {
            path: fileName
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: ["(L", (_b = (_a = codeBlock.range) === null || _a === void 0 ? void 0 : _a.startPosition) === null || _b === void 0 ? void 0 : _b.line, " - L", (_d = (_c = codeBlock.range) === null || _c === void 0 ? void 0 : _c.endPosition) === null || _d === void 0 ? void 0 : _d.line, ")"]
          })]
        })
      });
    };
    const SearchResultsView = ({
      query,
      results
    }) => {
      if (results.length === 0) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "yellow",
            children: ["No results found for \"", query, "\""]
          })
        });
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          color: "green",
          bold: true,
          children: ["Found ", results.length, " result", results.length !== 1 ? "s" : "", " for \"", query, "\""]
        }), results.map((result, index) => {
          var _a, _b, _c;
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SearchResultItem, {
            result: result,
            index: index
          }, `${(_b = (_a = result.codeBlock) === null || _a === void 0 ? void 0 : _a.relativeWorkspacePath) !== null && _b !== void 0 ? _b : ""}-${(_c = result.score) !== null && _c !== void 0 ? _c : 0}-${index}`);
        })]
      });
    };
    function renderSearchResults(query, results) {
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SearchResultsView, {
        query: query,
        results: results
      }));
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/