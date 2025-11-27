__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */F: () => (/* binding */WebSearchToolUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _tool_call_header_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/tool-call-header.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_3__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const WebSearchToolUI = ({
      tool: {
        args,
        result
      }
    }) => {
      var _a, _b, _c, _d;
      if (!args) {
        return null;
      }
      const searchTerm = (_a = args.searchTerm) !== null && _a !== void 0 ? _a : "";
      let status = "pending";
      let note;
      let errorMessage;
      let referenceCount;
      // Determine status and extract relevant information based on result
      const caseType = (_b = result === null || result === void 0 ? void 0 : result.result) === null || _b === void 0 ? void 0 : _b.case;
      switch (caseType) {
        case undefined:
          status = "pending";
          break;
        case "error":
          status = "error";
          errorMessage = (result === null || result === void 0 ? void 0 : result.result.value.error) || "Unknown error";
          break;
        case "success":
          status = "success";
          referenceCount = (_d = (_c = result === null || result === void 0 ? void 0 : result.result.value.references) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
          break;
        case "rejected":
          status = "rejected";
          note = (result === null || result === void 0 ? void 0 : result.result.value.reason) || "Web search rejected";
          break;
        default:
          {
            const _exhaustive = caseType;
            status = "pending";
            break;
          }
      }
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_3__ /* .ToolCallHeader */.C, {
          name: "WebSearch",
          primary: searchTerm,
          status: status,
          note: note
        }), errorMessage && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          marginTop: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "red",
            children: ["Error: ", errorMessage]
          })
        }), status === "success" && referenceCount !== undefined && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          marginTop: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            dimColor: true,
            children: ["Found ", referenceCount, " reference", referenceCount !== 1 ? "s" : ""]
          })
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/