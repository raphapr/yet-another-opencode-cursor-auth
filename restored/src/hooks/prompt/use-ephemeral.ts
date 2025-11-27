/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */N: () => (/* binding */useEphemeral)
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/constants.ts");
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/debug.ts");
function useEphemeral() {
  const [lines, setLines] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const timeoutRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const preserveRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const holdUntilInputRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const normalize = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(input => {
    if (Array.isArray(input)) {
      const first = input[0];
      if (first && typeof first === "object" && !Array.isArray(first) && "text" in first) {
        return [input];
      }
      return input;
    }
    return [input];
  }, []);
  const clearTimeoutIfAny = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  const clear = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    clearTimeoutIfAny();
    setLines([]);
  }, [clearTimeoutIfAny]);
  const set = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((input, options) => {
    const normalized = normalize(input);
    clearTimeoutIfAny();
    setLines(normalized);
    if ((options === null || options === void 0 ? void 0 : options.persistUntilInput) === true) {
      holdUntilInputRef.current = true; // persist across subsequent sets until user input
    }
    const requestedLinger = options === null || options === void 0 ? void 0 : options.minLingerMs;
    if (normalized.length > 0) {
      const duration = requestedLinger !== null && requestedLinger !== void 0 ? requestedLinger : holdUntilInputRef.current ? undefined : _constants_js__WEBPACK_IMPORTED_MODULE_1__ /* .EPHEMERAL_MESSAGE_TIMEOUT_MS */.fj;
      if (duration !== undefined) {
        timeoutRef.current = setTimeout(() => {
          setLines([]);
          timeoutRef.current = null;
          _debug_js__WEBPACK_IMPORTED_MODULE_2__.debugLog === null || _debug_js__WEBPACK_IMPORTED_MODULE_2__.debugLog === void 0 ? void 0 : (0, _debug_js__WEBPACK_IMPORTED_MODULE_2__.debugLog)("ephemeral.timeout.clear");
        }, duration);
      }
    }
  }, [clearTimeoutIfAny, normalize]);
  const preserveNextClear = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    preserveRef.current = true;
  }, []);
  // On unmount ensure timeout is cleared
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => {
      clearTimeoutIfAny();
    };
  }, [clearTimeoutIfAny]);
  const onUserInput = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (holdUntilInputRef.current) {
      holdUntilInputRef.current = false;
      clearTimeoutIfAny();
      setLines([]);
    }
  }, [clearTimeoutIfAny]);
  const linger = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(ms => {
    clearTimeoutIfAny();
    if (lines.length === 0) return;
    timeoutRef.current = setTimeout(() => {
      setLines([]);
      timeoutRef.current = null;
      _debug_js__WEBPACK_IMPORTED_MODULE_2__.debugLog === null || _debug_js__WEBPACK_IMPORTED_MODULE_2__.debugLog === void 0 ? void 0 : (0, _debug_js__WEBPACK_IMPORTED_MODULE_2__.debugLog)("ephemeral.linger.clear");
    }, Math.max(0, ms | 0));
  }, [clearTimeoutIfAny, lines.length]);
  // Public API aligns with orchestrator semantics
  return (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    lines,
    set,
    clear,
    preserveNextClear,
    normalize,
    onUserInput,
    linger
  }), [lines, set, clear, preserveNextClear, normalize, onUserInput, linger]);
}

/***/