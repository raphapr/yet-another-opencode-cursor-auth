/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */Y: () => (/* binding */useDebouncedCallback)
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
const clearTimer = ref => {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
};
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked, or until the next browser frame is drawn.
 *
 * The debounced function comes with a `cancel` method to cancel delayed `func`
 * invocations and a `flush` method to immediately invoke them.
 *
 * Provide `options` to indicate whether `func` should be invoked on the leading
 * and/or trailing edge of the `wait` timeout. The `func` is invoked with the
 * last arguments provided to the debounced function.
 *
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * invocation will be deferred until the next frame is drawn (typically about
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0]
 *  The number of milliseconds to delay; if omitted, `requestAnimationFrame` is
 *  used (if available, otherwise it will be setTimeout(...,0)).
 * @param {Object} [options={}] The options object.
 *  Controls if `func` should be invoked on the leading edge of the timeout.
 * @param {boolean} [options.leading=false]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {number} [options.maxWait]
 *  Controls if `func` should be invoked the trailing edge of the timeout.
 * @param {boolean} [options.trailing=true]
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * const resizeHandler = useDebouncedCallback(calculateLayout, 150);
 * window.addEventListener('resize', resizeHandler)
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * const clickHandler = useDebouncedCallback(sendMail, 300, {
 *   leading: true,
 *   trailing: false,
 * })
 * <button onClick={clickHandler}>click me</button>
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * const debounced = useDebouncedCallback(batchLog, 250, { 'maxWait': 1000 })
 * const source = new EventSource('/stream')
 * source.addEventListener('message', debounced)
 *
 * // Cancel the trailing debounced invocation.
 * window.addEventListener('popstate', debounced.cancel)
 *
 * // Check for pending invocations.
 * const status = debounced.isPending() ? "Pending..." : "Ready"
 */
function useDebouncedCallback(func, wait, options, forceUpdate) {
  // Ensure wait is a number and set option defaults
  const waitMs = typeof wait === "number" ? wait : 0;
  const opts = options !== null && options !== void 0 ? options : {};
  const leading = !!opts.leading;
  const trailing = "trailing" in opts ? !!opts.trailing : true;
  const hasMaxWait = typeof opts.maxWait === "number" && opts.maxWait >= 0;
  const maxWaitMs = hasMaxWait ? opts.maxWait : undefined;
  // Refs to track state without re-renders
  const callbackRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(func);
  const timerRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const maxTimerRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const lastArgsRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const lastThisRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const lastInvokeTimeRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  const resultRef = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(undefined);
  // Keep the latest callback without changing the debounced identity
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    callbackRef.current = func;
  }, [func]);
  // Optional external notifier, useful for Ink re-rendering edge cases
  const notify = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (forceUpdate) forceUpdate({});
  }, [forceUpdate]);
  const invoke = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(time => {
    const args = lastArgsRef.current;
    const thisArg = lastThisRef.current;
    lastArgsRef.current = null;
    lastThisRef.current = null;
    lastInvokeTimeRef.current = time;
    if (!args) return resultRef.current;
    resultRef.current = callbackRef.current.apply(thisArg, args);
    return resultRef.current;
  }, []);
  const debounced = (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const onTrailing = () => {
      clearTimer(timerRef);
      if (trailing && lastArgsRef.current) {
        invoke(Date.now());
        notify();
      }
      // trailing flush satisfies maxWait as well
      clearTimer(maxTimerRef);
    };
    const onMaxWait = () => {
      clearTimer(maxTimerRef);
      // Force an invoke if we still have pending args
      if (lastArgsRef.current) {
        clearTimer(timerRef);
        invoke(Date.now());
        notify();
      }
    };
    const fn = function (...args) {
      const now = Date.now();
      lastArgsRef.current = args;
      lastThisRef.current = this;
      const shouldCallLeading = leading && !timerRef.current;
      if (shouldCallLeading) {
        resultRef.current = callbackRef.current.apply(this, args);
        lastInvokeTimeRef.current = now;
      }
      if (trailing) {
        clearTimer(timerRef);
        timerRef.current = setTimeout(onTrailing, waitMs);
      }
      if (maxWaitMs !== undefined && !maxTimerRef.current) {
        const sinceLastInvoke = now - lastInvokeTimeRef.current;
        const remaining = Math.max(0, maxWaitMs - sinceLastInvoke);
        maxTimerRef.current = setTimeout(onMaxWait, remaining);
      }
      return resultRef.current;
    };
    fn.cancel = () => {
      clearTimer(timerRef);
      clearTimer(maxTimerRef);
      lastArgsRef.current = null;
      lastThisRef.current = null;
    };
    fn.flush = () => {
      clearTimer(timerRef);
      clearTimer(maxTimerRef);
      return invoke(Date.now());
    };
    fn.isPending = () => {
      return !!timerRef.current;
    };
    return fn;
  }, [leading, trailing, waitMs, maxWaitMs, invoke, notify]);
  // Cleanup on unmount
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => {
      clearTimer(timerRef);
      clearTimer(maxTimerRef);
    };
  }, []);
  return debounced;
}

/***/