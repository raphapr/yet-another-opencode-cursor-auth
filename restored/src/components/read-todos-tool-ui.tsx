__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */w: () => (/* binding */ReadTodosToolUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _todos_ui_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/todos-ui.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _todos_ui_js__WEBPACK_IMPORTED_MODULE_2__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _todos_ui_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const ReadTodosToolUI = ({
      tool,
      aborted
    }) => {
      const formatFilters = () => {
        var _a, _b, _c, _d;
        const filters = [];
        if (((_b = (_a = tool.args) === null || _a === void 0 ? void 0 : _a.statusFilter) === null || _b === void 0 ? void 0 : _b.length) && tool.args.statusFilter.length > 0) {
          const statusTexts = tool.args.statusFilter.map(status => {
            switch (status) {
              case 1:
                return "pending";
              case 2:
                return "in_progress";
              case 3:
                return "completed";
              case 4:
                return "cancelled";
              default:
                return "unknown";
            }
          });
          filters.push(`status: ${statusTexts.join(", ")}`);
        }
        if (((_d = (_c = tool.args) === null || _c === void 0 ? void 0 : _c.idFilter) === null || _d === void 0 ? void 0 : _d.length) && tool.args.idFilter.length > 0) {
          filters.push(`ids: ${tool.args.idFilter.join(", ")}`);
        }
        return filters.length > 0 ? ` (${filters.join("; ")})` : "";
      };
      if (aborted) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          paddingRight: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingLeft: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "foreground",
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                bold: true,
                children: "Read to-dos"
              }), " ", (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: "Aborted"
              })]
            })
          })
        });
      }
      if (!tool.result) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          paddingRight: 2,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_todos_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .TodosUI */.S, {
            todos: [],
            mode: "read",
            loading: true,
            filters: formatFilters()
          })
        });
      }
      const result = tool.result.result;
      const successTotal = (result === null || result === void 0 ? void 0 : result.case) === "success" ? result.value.totalCount : undefined;
      const _buildNote = () => {
        const filters = formatFilters();
        if (successTotal !== undefined) {
          return filters ? `${filters} (Total: ${successTotal})` : `(Total: ${successTotal})`;
        }
        return filters;
      };
      switch (result === null || result === void 0 ? void 0 : result.case) {
        case "success":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            paddingRight: 2,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_todos_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .TodosUI */.S, {
              todos: result.value.todos,
              totalCount: result.value.totalCount,
              mode: "read",
              filters: formatFilters(),
              showHeader: true
            })
          });
        case "error":
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            paddingRight: 2,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              children: result.value.error
            })
          });
        default:
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            paddingRight: 2,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_todos_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .TodosUI */.S, {
              todos: [],
              mode: "read"
            })
          });
      }
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/