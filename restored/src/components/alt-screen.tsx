__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */I: () => (/* binding */AltScreen),
      /* harmony export */m: () => (/* binding */clearScreen)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/context/terminal-state-context.tsx");
    /* harmony import */
    var _hooks_use_debounced_callback_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/hooks/use-debounced-callback.ts");
    /* harmony import */
    var _hooks_use_mounted_effect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/hooks/use-mounted-effect.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const clearScreen = stdout => {
      // Use full clear only once per cycle to avoid flicker on resize bursts.
      stdout.write("\x1b[H\x1b[2J\x1b[3J");
    };
    const AltScreen = ({
      children,
      clearScreenTrigger,
      clearOnMount = true
    }) => {
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdout */.t$)();
      // Only react to width changes to prevent unnecessary clears on vertical overflow
      const terminalEpoch = (0, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_4__ /* .useWidthEpoch */.PH)();
      const [isClearing, setIsClearing] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
      const debouncedClearScreenRerenderingChild = (0, _hooks_use_debounced_callback_js__WEBPACK_IMPORTED_MODULE_5__ /* .useDebouncedCallback */.Y)(() => {
        setIsClearing(true);
        clearScreen(stdout);
        setImmediate(() => {
          setIsClearing(false);
        });
      }, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .CLEAR_SCREEN_ON_RESIZE_DEBOUNCE_MS */.Zo, {
        leading: true,
        trailing: true
      });
      // Debounce all clearScreen calls (tail: only the last call in a burst is executed)
      const debouncedClearScreen = (0, _hooks_use_debounced_callback_js__WEBPACK_IMPORTED_MODULE_5__ /* .useDebouncedCallback */.Y)(() => {
        clearScreen(stdout);
      }, _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .CLEAR_SCREEN_ON_RESIZE_DEBOUNCE_MS */.Zo, {
        leading: true,
        trailing: true
      });
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (!clearOnMount) return;
        clearScreen(stdout);
      }, [clearOnMount, stdout]);
      (0, _hooks_use_mounted_effect_js__WEBPACK_IMPORTED_MODULE_6__ /* .useMountedEffect */.H)(() => {
        if (!stdout) return;
        // Only trigger when size actually changes, not every epoch cause
        debouncedClearScreenRerenderingChild();
      }, [stdout, terminalEpoch, debouncedClearScreenRerenderingChild]);
      (0, _hooks_use_mounted_effect_js__WEBPACK_IMPORTED_MODULE_6__ /* .useMountedEffect */.H)(() => {
        if (!stdout) return;
        debouncedClearScreen();
      }, [clearScreenTrigger, stdout, debouncedClearScreen]);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: isClearing ? null : children
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/