__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */b: () => (/* binding */runApprovalDialog)
      /* harmony export */
    });
    /* unused harmony export ApprovalDialog */
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    function ApprovalDialog({
      title,
      description,
      content,
      options,
      selectedOption,
      variant = "warning"
    }) {
      const isInfo = variant === "info";
      const borderColor = isInfo ? "blue" : "yellow";
      const iconColor = isInfo ? "blue" : "yellow";
      const icon = isInfo ? "ℹ " : "⚠ ";
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        flexDirection: "column",
        marginTop: 1,
        marginX: 2,
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          flexDirection: "column",
          borderStyle: "round",
          borderColor: borderColor,
          paddingX: 2,
          paddingY: 1,
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: iconColor,
                bold: true,
                children: icon
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "foreground",
                bold: true,
                children: title
              })]
            })
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            marginTop: 1,
            flexDirection: "column",
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              flexDirection: "column",
              gap: 1,
              children: description.map(line => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: "foreground",
                children: line
              }, line))
            }), content && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
              marginTop: 1,
              marginLeft: 2,
              flexDirection: "column",
              children: content
            })]
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            marginTop: 2,
            flexDirection: "column",
            children: options.map((option, index) => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: selectedOption === index ? "green" : "gray",
                children: selectedOption === index ? "▶ " : "  "
              }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
                color: selectedOption === index ? "foreground" : "gray",
                bold: selectedOption === index,
                children: ["[", option.key, "] ", option.label]
              })]
            }, option.value))
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
            marginTop: 1,
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: "gray",
              dimColor: true,
              children: "Use arrow keys to navigate, Enter to select, or press the key shown"
            })
          })]
        })
      });
    }
    function runApprovalDialog(_a) {
      return __awaiter(this, arguments, void 0, function* ({
        title,
        description,
        content,
        options,
        onAction,
        variant
      }) {
        return new Promise(resolve => {
          let selectedOption = 0;
          const {
            rerender,
            waitUntilExit
          } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ApprovalDialog, {
            title: title,
            description: description,
            content: content,
            options: options,
            selectedOption: selectedOption,
            variant: variant
          }), {
            exitOnCtrlC: false
          });
          const handleInput = action => __awaiter(this, void 0, void 0, function* () {
            yield onAction(action);
            resolve(action);
          });
          process.stdin.setRawMode(true);
          process.stdin.resume();
          const dataHandler = data => {
            const input = data.toString();
            const key = data[0];
            // Arrow key navigation
            if (data.length === 3 && data[0] === 0x1b && data[1] === 0x5b) {
              if (data[2] === 0x42) {
                // Down arrow
                selectedOption = (selectedOption + 1) % options.length;
                rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ApprovalDialog, {
                  title: title,
                  description: description,
                  content: content,
                  options: options,
                  selectedOption: selectedOption,
                  variant: variant
                }));
                return;
              }
              if (data[2] === 0x41) {
                // Up arrow
                selectedOption = (selectedOption - 1 + options.length) % options.length;
                rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ApprovalDialog, {
                  title: title,
                  description: description,
                  content: content,
                  options: options,
                  selectedOption: selectedOption,
                  variant: variant
                }));
                return;
              }
            }
            // Enter key
            if (key === 0x0d) {
              process.stdin.removeListener("data", dataHandler);
              process.stdin.setRawMode(false);
              process.stdin.pause();
              void handleInput(options[selectedOption].value);
              return;
            }
            // Direct key press
            const lowerInput = input.toLowerCase();
            const matchingOption = options.find(opt => opt.key.toLowerCase() === lowerInput);
            if (matchingOption) {
              process.stdin.removeListener("data", dataHandler);
              process.stdin.setRawMode(false);
              process.stdin.pause();
              void handleInput(matchingOption.value);
              return;
            }
            // Escape or Ctrl+C - default to last option (usually "quit")
            if (key === 0x1b || key === 0x03) {
              process.stdin.removeListener("data", dataHandler);
              process.stdin.setRawMode(false);
              process.stdin.pause();
              void handleInput(options[options.length - 1].value);
              return;
            }
          };
          process.stdin.on("data", dataHandler);
          // Handle UI exit
          void waitUntilExit().then(() => {
            process.stdin.removeListener("data", dataHandler);
            process.stdin.setRawMode(false);
            process.stdin.pause();
            // Default to last option (usually "quit") on UI exit
            resolve(options[options.length - 1].value);
          }).catch(() => {
            process.stdin.removeListener("data", dataHandler);
            process.stdin.setRawMode(false);
            process.stdin.pause();
            resolve(options[options.length - 1].value);
          });
        });
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/