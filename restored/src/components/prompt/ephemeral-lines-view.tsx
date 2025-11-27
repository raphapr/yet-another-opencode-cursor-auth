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
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const EphemeralLinesView = ({
      lines
    }) => {
      const renderLine = (line, idx) => {
        if (typeof line !== "string") {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            children: line.map((seg, j) => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: seg.color,
              bold: seg.bold,
              dimColor: seg.dim,
              children: seg.text
            }, `${seg.text}-${seg.color}-${j}`))
          }, idx);
        }
        if (line.trim().length === 0) return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          children: " "
        }, idx);
        const lower = line.toLowerCase();
        if (lower.startsWith("error:")) {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "red",
            children: line
          }, idx);
        }
        if (lower.startsWith("unknown command:")) {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "yellow",
            children: line
          }, idx);
        }
        if (/^available models:/i.test(line)) {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            children: line
          }, idx);
        }
        if (/^(commands:|examples:|usage:)/i.test(line)) {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            bold: true,
            children: line
          }, idx);
        }
        if (line.startsWith("/")) {
          const [cmdPart, ...rest] = line.split(" - ");
          if (rest.length > 0) {
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "cyan",
                children: cmdPart
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "gray",
                children: [" - ", rest.join(" - ")]
              })]
            }, idx);
          }
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            color: "cyan",
            children: line
          }, idx);
        }
        if (line.startsWith("  /")) {
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              children: " "
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "cyan",
              children: ["/", line.slice(3)]
            })]
          }, idx);
        }
        return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
          color: "gray",
          children: line
        }, idx);
      };
      if (lines.length === 0) return null;
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        marginTop: 1,
        paddingX: 2,
        children: lines.map(l => {
          const element = renderLine(l, 0);
          const key = typeof l === "string" ? l : JSON.stringify(l);
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: element
          }, key);
        })
      });
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = react__WEBPACK_IMPORTED_MODULE_2__.memo(EphemeralLinesView);
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/