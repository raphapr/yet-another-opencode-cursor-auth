__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Y: () => (/* binding */DeleteToolUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/utils/path-utils.ts");
    /* harmony import */
    var _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/tool-call-header.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const DeleteToolUI = ({
      tool: {
        args,
        result
      }
    }) => {
      var _a, _b;
      if (!args) {
        return null;
      }
      const pathDisplay = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_3__ /* .getPathDisplay */.Kr)(args.path);
      let status = "pending";
      let displayText;
      const rr = result === null || result === void 0 ? void 0 : result.result;
      const caseType = rr === null || rr === void 0 ? void 0 : rr.case;
      switch (caseType) {
        case undefined:
          status = "pending";
          break;
        case "success":
          status = "success";
          break;
        case "rejected":
          status = "rejected";
          break;
        case "permissionDenied":
          {
            status = "error";
            displayText = String((_b = (_a = rr === null || rr === void 0 ? void 0 : rr.value) === null || _a === void 0 ? void 0 : _a.clientVisibleError) !== null && _b !== void 0 ? _b : "") || "Permission denied";
            break;
          }
        case "fileNotFound":
        case "notFile":
        case "fileBusy":
        case "error":
          status = "error";
          break;
        default:
          {
            const _exhaustive = caseType;
            status = "pending";
            break;
          }
      }
      const headerName = (0, _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .resolveToolVerbByCase */.F_)("deleteToolCall", status === "success") || (status === "success" ? "Deleted" : "Deleting");
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        paddingRight: 2,
        children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_call_header_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolCallHeader */.C, {
          name: headerName,
          primary: pathDisplay,
          status: status
        }), caseType === "fileNotFound" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: "File not found"
          })
        }), caseType === "notFile" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: "Path is not a file"
          })
        }), caseType === "permissionDenied" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: displayText
          })
        }), caseType === "fileBusy" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: "File is busy"
          })
        }), caseType === "error" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: "Delete failed"
          })
        }), caseType === "rejected" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "yellow",
            children: "Request rejected"
          })
        }), caseType === "success" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          marginLeft: _constants_js__WEBPACK_IMPORTED_MODULE_2__ /* .TOOL_DETAIL_MARGIN_LEFT */.SK,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "gray",
            children: "Completed"
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