/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */e: () => (/* binding */useSharedTick),
  /* harmony export */q: () => (/* binding */DEFAULT_HEXAGON_INTERVAL_MS)
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
const DEFAULT_HEXAGON_INTERVAL_MS = 210;
const clocks = new Map();
function ensureClock(periodMs) {
  let clock = clocks.get(periodMs);
  if (!clock) {
    clock = {
      tick: 0,
      timer: null,
      listeners: new Set()
    };
    clock.timer = setInterval(() => {
      clock.tick = clock.tick + 1;
      for (const l of clock.listeners) l(clock.tick);
    }, periodMs);
    clocks.set(periodMs, clock);
  }
  return clock;
}
function useSharedTick(periodMs, paused) {
  const [tick, setTick] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => ensureClock(periodMs).tick);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (paused) return;
    const clock = ensureClock(periodMs);
    const listener = t => setTick(t);
    clock.listeners.add(listener);
    setTick(clock.tick);
    return () => {
      clock.listeners.delete(listener);
      if (clock.listeners.size === 0 && clock.timer) {
        clearInterval(clock.timer);
        clock.timer = null;
        clocks.delete(periodMs);
      }
    };
  }, [periodMs, paused]);
  return tick;
}

/***/