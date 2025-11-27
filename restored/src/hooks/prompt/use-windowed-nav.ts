/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */m: () => (/* binding */useWindowedNav)
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
function useWindowedNav(windowSize = 6) {
  const [index, setIndex] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [windowStart, setWindowStart] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [length, setLengthState] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const clampWindowStart = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((start, len) => {
    const maxStart = Math.max(0, len - windowSize);
    if (start > maxStart) return maxStart;
    if (start < 0) return 0;
    return start;
  }, [windowSize]);
  const setLength = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(len => {
    setLengthState(prevLen => {
      if (len === prevLen) return prevLen;
      setIndex(prev => len === 0 ? 0 : Math.min(prev, len - 1));
      setWindowStart(prev => clampWindowStart(prev, len));
      return len;
    });
  }, [clampWindowStart]);
  const next = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (length === 0) return;
    setIndex(prev => {
      const nextIdx = (prev + 1) % length;
      setWindowStart(start => {
        if (length <= windowSize) return 0;
        let s = start;
        if (nextIdx < prev) {
          s = 0; // wrap to top
        } else if (nextIdx - s >= windowSize - 1) {
          s = nextIdx - (windowSize - 2);
        }
        return clampWindowStart(s, length);
      });
      return nextIdx;
    });
  }, [length, windowSize, clampWindowStart]);
  const prev = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (length === 0) return;
    setIndex(prevIdx => {
      const nextIdx = (prevIdx - 1 + length) % length;
      setWindowStart(start => {
        if (length <= windowSize) return 0;
        let s = start;
        if (nextIdx > prevIdx) {
          s = Math.max(0, length - windowSize); // wrap to bottom
        } else if (nextIdx - s <= 0) {
          s = Math.max(0, nextIdx - 1);
        }
        return clampWindowStart(s, length);
      });
      return nextIdx;
    });
  }, [length, windowSize, clampWindowStart]);
  const reset = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setIndex(0);
    setWindowStart(0);
  }, []);
  const page = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((_pageSize = windowSize) => {
    return {
      visibleStart: windowStart,
      highlight: index - windowStart
    };
  }, [index, windowStart, windowSize]);
  return (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    index,
    windowStart,
    setLength,
    next,
    prev,
    reset,
    page
  }), [index, windowStart, setLength, next, prev, reset, page]);
}

/***/