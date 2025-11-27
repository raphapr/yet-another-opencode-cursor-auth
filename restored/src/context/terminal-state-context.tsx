__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */PH: () => (/* binding */useWidthEpoch),
      /* harmony export */rs: () => (/* binding */TerminalStateProvider)
      /* harmony export */
    });
    /* unused harmony exports useTerminalState, useTerminalEpoch, useHeightEpoch */
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const TerminalStateContext = (0, react__WEBPACK_IMPORTED_MODULE_2__.createContext)(null);
    const TerminalStateProvider = ({
      children
    }) => {
      const [terminalEpoch, setTerminalEpoch] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      const [widthEpoch, setWidthEpoch] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      const [heightEpoch, setHeightEpoch] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      const [lastReason, setLastReason] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
      const stdout = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdout */.t$)();
      const stream = stdout.stdout; // use stable stream, not the changing context object
      const lastWidthRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      const lastHeightRef = (0, react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
      const bumpTerminalEpoch = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(reason => {
        setTerminalEpoch(prev => {
          const next = prev + 1;
          return next;
        });
        if (reason) setLastReason(reason);
      }, []);
      const bumpWidthEpoch = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(_reason => {
        setWidthEpoch(prev => prev + 1);
      }, []);
      const bumpHeightEpoch = (0, react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(_reason => {
        setHeightEpoch(prev => prev + 1);
      }, []);
      // Auto-bump on actual terminal resize
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        const s = stream; // stable dependency
        if (!s) return;
        const handleResize = () => {
          const currentWidth = s.columns;
          const currentHeight = s.rows;
          if (lastWidthRef.current === null) {
            lastWidthRef.current = currentWidth;
          }
          if (lastHeightRef.current === null) {
            lastHeightRef.current = currentHeight;
          }
          const didWidthChange = currentWidth !== lastWidthRef.current;
          const didHeightChange = currentHeight !== lastHeightRef.current;
          if (didWidthChange) {
            lastWidthRef.current = currentWidth;
            bumpWidthEpoch();
          }
          if (didHeightChange) {
            lastHeightRef.current = currentHeight;
            bumpHeightEpoch();
          }
          if (didWidthChange || didHeightChange) {
            bumpTerminalEpoch();
          }
        };
        s.on("resize", handleResize);
        // Fire once to establish baseline (does not bump unless changed)
        handleResize();
        return () => {
          s.off("resize", handleResize);
        };
      }, [stream, bumpWidthEpoch, bumpHeightEpoch, bumpTerminalEpoch]);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TerminalStateContext.Provider, {
        value: {
          terminalEpoch,
          widthEpoch,
          heightEpoch,
          lastReason,
          bumpTerminalEpoch,
          bumpWidthEpoch,
          bumpHeightEpoch
        },
        children: children
      });
    };
    const useTerminalState = () => {
      const ctx = (0, react__WEBPACK_IMPORTED_MODULE_2__.useContext)(TerminalStateContext);
      if (!ctx) {
        throw new Error("useTerminalState must be used within a TerminalStateProvider");
      }
      return ctx;
    };
    const useTerminalEpoch = () => {
      return useTerminalState().terminalEpoch;
    };
    const useWidthEpoch = () => {
      return useTerminalState().widthEpoch;
    };
    const useHeightEpoch = () => {
      return useTerminalState().heightEpoch;
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/