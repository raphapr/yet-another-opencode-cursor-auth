/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */l: () => (/* binding */useBufferedStaticItems)
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
function useBufferedStaticItems(optsOrMs) {
  var _a, _b, _c;
  const options = (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (typeof optsOrMs === "number") return {
      intervalMs: optsOrMs
    };
    return optsOrMs !== null && optsOrMs !== void 0 ? optsOrMs : {};
  }, [optsOrMs]);
  const intervalMsRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)((_a = options.intervalMs) !== null && _a !== void 0 ? _a : 1000);
  const maxBatchRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(options.maxBatch);
  const leadingRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!!options.leading);
  const reducerRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)((_b = options.reducer) !== null && _b !== void 0 ? _b : (p, b) => [...p, ...b]);
  const coalesceRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(options.coalesce);
  const onFlushRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(options.onFlush);
  const autoStartRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)((_c = options.autoStart) !== null && _c !== void 0 ? _c : true);
  const smoothMaxPerTickRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(options.smoothMaxPerTick);
  const jitterRangeRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(options.jitterRangeMs);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    var _a, _b, _c;
    intervalMsRef.current = (_a = options.intervalMs) !== null && _a !== void 0 ? _a : intervalMsRef.current;
    maxBatchRef.current = options.maxBatch;
    leadingRef.current = !!options.leading;
    reducerRef.current = (_b = options.reducer) !== null && _b !== void 0 ? _b : reducerRef.current;
    coalesceRef.current = options.coalesce;
    onFlushRef.current = options.onFlush;
    autoStartRef.current = (_c = options.autoStart) !== null && _c !== void 0 ? _c : autoStartRef.current;
    smoothMaxPerTickRef.current = options.smoothMaxPerTick;
    jitterRangeRef.current = options.jitterRangeMs;
  }, [options]);
  const [items, setItems] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const bufferRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  const isFlushingRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const timerRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const runningRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const [isRunning, setIsRunning] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const flushNow = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    var _a;
    const buf = bufferRef.current;
    if (buf.length === 0 || isFlushingRef.current) return;
    isFlushingRef.current = true;
    try {
      const configuredMax = maxBatchRef.current;
      const smoothCap = smoothMaxPerTickRef.current;
      let take = buf.length;
      if (typeof configuredMax === "number" && configuredMax >= 0) {
        take = Math.min(take, configuredMax);
      }
      if (typeof smoothCap === "number" && smoothCap >= 1) {
        take = Math.min(take, smoothCap);
      }
      if (take <= 0) return;
      // Splice in-place to avoid races with concurrent enqueues that push into the same array.
      const batch = buf.splice(0, take);
      const coalesced = coalesceRef.current ? coalesceRef.current(batch) : batch;
      setItems(prev => reducerRef.current(prev, coalesced));
      (_a = onFlushRef.current) === null || _a === void 0 ? void 0 : _a.call(onFlushRef, coalesced);
    } finally {
      isFlushingRef.current = false;
    }
  }, []);
  const start = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (runningRef.current) return;
    const scheduleNext = () => {
      const jitter = jitterRangeRef.current;
      let delay = intervalMsRef.current;
      if (jitter && jitter.length === 2) {
        const [min, max] = jitter;
        const span = Math.max(0, max - min);
        delay = min + Math.random() * span;
      }
      timerRef.current = setTimeout(() => {
        flushNow();
        if (runningRef.current) scheduleNext();
      }, delay);
    };
    runningRef.current = true;
    setIsRunning(true);
    scheduleNext();
  }, [flushNow]);
  const stop = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    runningRef.current = false;
    setIsRunning(false);
  }, []);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!runningRef.current) return;
    stop();
    start();
  }, [start, stop]);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (autoStartRef.current) start();
    return stop;
  }, [start, stop]);
  const enqueue = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(item => {
    const arr = Array.isArray(item) ? [...item] : [item];
    if (arr.length === 0) return;
    bufferRef.current.push(...arr);
    if (leadingRef.current && !runningRef.current) flushNow();
  }, [flushNow]);
  const clear = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    bufferRef.current = [];
    setItems([]);
  }, []);
  return {
    items,
    enqueue,
    flushNow,
    clear,
    start,
    stop,
    isRunning
  };
}

/***/