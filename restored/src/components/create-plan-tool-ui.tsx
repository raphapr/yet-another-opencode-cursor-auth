__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */U: () => (/* binding */CreatePlanToolUI)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _markdown_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/markdown.tsx");
    /* harmony import */
    var _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/prompt/decision-dropdown.tsx");
    /* harmony import */
    var _tool_row_box_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/tool-row-box.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _markdown_js__WEBPACK_IMPORTED_MODULE_2__, _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_3__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _markdown_js__WEBPACK_IMPORTED_MODULE_2__, _prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_3__, _tool_row_box_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const CreatePlanToolUI = ({
      tool: {
        args,
        result
      },
      isSuggestingPlan = false,
      planDecisionIndex = 0,
      state
    }) => {
      var _a;
      const isSuccess = ((_a = result === null || result === void 0 ? void 0 : result.result) === null || _a === void 0 ? void 0 : _a.case) === "success";
      // Only show if we have a plan
      if (!(args === null || args === void 0 ? void 0 : args.plan)) {
        return null;
      }
      const isRejected = state === "rejected";
      const isAccepted = state === "accepted";
      // Rejected plan - show dimmed static version
      if (isRejected) {
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_row_box_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolRowBox */.Y, {
          flexDirection: "column",
          borderColor: "gray",
          borderDimColor: true,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            paddingX: 1,
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              paddingLeft: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                dimColor: true,
                children: "Plan (rejected)"
              })
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              borderStyle: "single",
              borderColor: "gray",
              borderDimColor: true,
              paddingX: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_markdown_js__WEBPACK_IMPORTED_MODULE_2__ /* .Markdown */.oz, {
                content: args.plan
              })
            })]
          })
        });
      }
      // Active suggestion mode
      if (isSuggestingPlan && isSuccess) {
        const options = [{
          label: "Accept and proceed",
          hint: "(y)"
        }, {
          label: "Reject and propose changes",
          hint: "(n or esc)"
        }];
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_row_box_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolRowBox */.Y, {
          flexDirection: "column",
          borderColor: "yellow",
          borderDimColor: false,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            flexDirection: "column",
            paddingX: 1,
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              paddingLeft: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                bold: true,
                color: "yellow",
                children: "Suggested Plan"
              })
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              borderStyle: "single",
              borderColor: "gray",
              borderDimColor: true,
              paddingX: 1,
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_markdown_js__WEBPACK_IMPORTED_MODULE_2__ /* .Markdown */.oz, {
                content: args.plan
              })
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A, {
              title: "",
              highlightColor: "yellow",
              options: options,
              selectedIndex: planDecisionIndex
            })]
          })
        });
      }
      // Default display (not actively suggesting)
      const getTitle = () => {
        if (isRejected) return "Rejected Plan";
        if (isAccepted) return "Plan (accepted)";
        return "Suggested Plan";
      };
      const getTitleColor = () => {
        if (isRejected) return "gray";
        if (isAccepted) return "green";
        return "yellow";
      };
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_tool_row_box_js__WEBPACK_IMPORTED_MODULE_4__ /* .ToolRowBox */.Y, {
        flexDirection: "column",
        borderColor: "gray",
        borderDimColor: true,
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          paddingX: 1,
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            paddingLeft: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: getTitleColor(),
              dimColor: isRejected,
              children: getTitle()
            })
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            borderStyle: "single",
            borderColor: "gray",
            borderDimColor: true,
            paddingX: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_markdown_js__WEBPACK_IMPORTED_MODULE_2__ /* .Markdown */.oz, {
              content: args.plan
            })
          })]
        })
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/