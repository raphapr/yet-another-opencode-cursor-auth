__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony exports LoadingDisplay, ErrorDisplay, SimpleErrorDisplay, EmptyDisplay, AttachingDisplay, CompletedDisplay */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const LoadingDisplay = () => _jsx(Box, {
      flexDirection: "column",
      padding: 1,
      children: _jsx(Text, {
        color: "blue",
        children: "Loading background composers..."
      })
    });
    const ErrorDisplay = ({
      error
    }) => _jsxs(Box, {
      flexDirection: "column",
      padding: 1,
      children: [_jsx(Text, {
        color: "red",
        children: "Error loading background composers"
      }), error && _jsx(Box, {
        marginTop: 1,
        children: _jsx(Text, {
          color: "red",
          children: error
        })
      })]
    });
    const SimpleErrorDisplay = ({
      error
    }) => _jsx(Box, {
      flexDirection: "column",
      padding: 1,
      children: _jsxs(Text, {
        color: "red",
        children: ["Error: ", error]
      })
    });
    const EmptyDisplay = () => _jsxs(Box, {
      flexDirection: "column",
      padding: 1,
      children: [_jsx(Text, {
        color: "gray",
        children: "No background composers found"
      }), _jsx(Box, {
        marginTop: 1,
        children: _jsx(Text, {
          color: "gray",
          children: "Use the Cursor editor to start a new background composer."
        })
      })]
    });
    const AttachingDisplay = ({
      composerName,
      composerId,
      streamingInfo
    }) => _jsxs(Box, {
      flexDirection: "column",
      padding: 1,
      children: [_jsxs(Text, {
        color: "blue",
        children: ["Attaching to: ", composerName || composerId]
      }), _jsx(Text, {
        color: "gray",
        children: streamingInfo || "Connecting to background composer..."
      })]
    });
    const CompletedDisplay = ({
      composerName,
      composerId,
      streamingInfo
    }) => _jsxs(Box, {
      flexDirection: "column",
      padding: 1,
      children: [_jsxs(Text, {
        color: "green",
        children: ["\u2713 Successfully attached to: ", composerName || composerId]
      }), _jsx(Text, {
        color: "gray",
        children: streamingInfo || "Connection completed."
      })]
    });
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/