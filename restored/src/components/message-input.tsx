__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export MessageInput */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _text_input_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/text-input.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _text_input_js__WEBPACK_IMPORTED_MODULE_2__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _text_input_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const MessageInput = ({
      value,
      onChange,
      onSubmit,
      inputMode = "message",
      isDisabled = false
    }) => {
      const getPlaceholder = () => {
        switch (inputMode) {
          case "decision":
            return "Waiting for decision (y/n)...";
          case "rejection-reason":
            return "Enter reason for rejection and press Enter (or leave empty)...";
          default:
            return "Type your message and press Enter...";
        }
      };
      const getBorderColor = () => {
        switch (inputMode) {
          case "decision":
            return "yellow";
          case "rejection-reason":
            return "red";
          default:
            return "blue";
        }
      };
      return _jsx(Box, {
        borderStyle: "single",
        borderColor: isDisabled ? "gray" : getBorderColor(),
        paddingX: 1,
        borderLeft: true,
        borderRight: false,
        borderTop: false,
        borderBottom: false,
        children: isDisabled ? _jsx(Text, {
          color: "gray",
          children: "Input disabled"
        }) : _jsx(TextInput, {
          value: value,
          onChange: onChange,
          onSubmit: onSubmit,
          placeholder: getPlaceholder()
        })
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/