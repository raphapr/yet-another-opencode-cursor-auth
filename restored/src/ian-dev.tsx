/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runIanDev: () => (/* binding */ runIanDev)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */ var _anysphere_ink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */ var _components_anysphere_static_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/anysphere-static.tsx");
/* harmony import */ var _components_text_input_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/text-input.tsx");
/* harmony import */ var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/context/vim-mode-context.tsx");
/* harmony import */ var _hooks_use_buffered_static_items_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/hooks/use-buffered-static-items.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_text_input_js__WEBPACK_IMPORTED_MODULE_5__]);
([_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_text_input_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/*
Smooth dynamic → static promotion (Ink + React)

Goals
- No visual gap when a dynamic line becomes static.
- No flicker/remount from unstable keys.
- Avoid large clumped jumps in Static output.

Principles
- Remove from dynamic only after Static has actually flushed the item.
  • Drive removal via the buffer's onFlush(batch) callback.
- Stabilize identity across regions: use content-derived keys for both dynamic and static.
  • Avoid index-based keys; they trigger remount flicker on reordering.
- Pace promotion intentionally.
  • Small batches on a short cadence feel continuous. For streaming, use maxBatch: 1 and 50–150ms interval jitter.
  • If immediate removal is required, pair it with an immediate flush (leading) to prevent a gap.

Implementation in this demo
- useBufferedStaticItems controls cadence (intervalMs, maxBatch).
- onFlush(batch) filters dynamicLines to drop only the newly flushed items, keeping dynamic visible until Static renders them.
- Keys derive from the line label in both regions.
- Items are streamed into the live region one-by-one; each newly mounted item is also enqueued for Static immediately, mimicking ui.tsx's freeze-on-flush handoff.

Result
- Seamless handoff: no blank frame between dynamic removal and static render.
- Stable rendering: no flicker from key changes.
- Smooth pacing: no 2→10 style clumped jumps; items advance one-by-one at ~50–150ms.
*/



// Keep this demo minimal: use Ink's Static directly to exercise internal flush




// Instance-scoped guards (Refs) to prevent StrictMode double-start duplication
const StaticSpeedDemo = () => {
    const [dynamicLines, setDynamicLines] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)([]);
    const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)("");
    const { items, enqueue } = (0,_hooks_use_buffered_static_items_js__WEBPACK_IMPORTED_MODULE_7__/* .useBufferedStaticItems */ .l)({
        intervalMs: 100,
        maxBatch: 5,
        leading: true,
        smoothMaxPerTick: 1,
        jitterRangeMs: [60, 150],
        onFlush: (batch) => {
            setDynamicLines(prev => prev.filter(l => !batch.includes(l)));
        },
    });
    const baseLinesRef = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(Array.from({ length: 30 }, (_, i) => `item-${i + 1}`));
    const demoStartedRef = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
        if (demoStartedRef.current)
            return;
        demoStartedRef.current = true;
        const timeouts = [];
        let idx = 0;
        // Stream items into the live region one-by-one; immediately enqueue to Static.
        const step = () => {
            if (idx >= baseLinesRef.current.length)
                return;
            const jitter = 60 + Math.random() * 90; // ~60–150ms cadence
            const t = setTimeout(() => {
                const label = baseLinesRef.current[idx];
                setDynamicLines(prev => [...prev, label]);
                const promoteDelay = 30 + Math.random() * 90; // mount → promote delay
                const promoteTimeout = setTimeout(() => {
                    enqueue(label);
                }, promoteDelay);
                timeouts.push(promoteTimeout);
                idx += 1;
                step();
            }, jitter);
            timeouts.push(t);
        };
        // Warm-up pause so the first Static flush won't clump
        const t0 = setTimeout(() => step(), 250);
        timeouts.push(t0);
        return () => {
            for (const t of timeouts)
                clearTimeout(t);
            demoStartedRef.current = false;
        };
    }, [enqueue]);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_anysphere_static_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, { items: items, children: (item) => {
                    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { backgroundColor: "blue", children: item }) }, `s-${item}`));
                } }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { children: "===STATIC ABOVE===" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { flexDirection: "column", children: dynamicLines.map(line => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { children: line }, `dyn-${line}`))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { marginTop: 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { children: ["Static items: ", items.length, " \u00B7 Live items: ", dynamicLines.length] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { marginTop: 1, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { children: "Type to keep app alive: " }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_text_input_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A, { value: input, onChange: setInput, placeholder: "your input...", showCursor: true })] })] }));
};
const Example = () => {
    const { items: tests, enqueue } = (0,_hooks_use_buffered_static_items_js__WEBPACK_IMPORTED_MODULE_7__/* .useBufferedStaticItems */ .l)({
        intervalMs: 100,
        maxBatch: 5,
        leading: true,
        smoothMaxPerTick: 1,
        jitterRangeMs: [60, 150],
    });
    react__WEBPACK_IMPORTED_MODULE_3__.useEffect(() => {
        let completedTests = 0;
        let timer;
        const run = () => {
            if (completedTests++ < 50) {
                const next = {
                    id: completedTests - 1,
                    title: `Test #${completedTests}`,
                };
                enqueue(next);
                timer = setTimeout(run, 300 * Math.random());
            }
        };
        run();
        return () => {
            if (timer)
                clearTimeout(timer);
        };
    }, [enqueue]);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Static */ .jC, { items: tests, children: test => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { color: "green", children: ["\u2714 ", test.title] }) }, test.id)) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { children: "===STATIC ABOVE===" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Box */ .az, { marginTop: 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .Text */ .EY, { dimColor: true, children: ["Completed tests: ", tests.length] }) })] }));
};
(0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .render */ .XX)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Example, {}));
function runIanDev() {
    return __awaiter(this, void 0, void 0, function* () {
        // const session = getDebugSession();
        // if (session) {
        //   console.log(
        //     "\n\x1b[32mDebug server:\x1b[0m \x1b[36m%s\x1b[0m\n",
        //     session.serverUrl
        //   );
        // }
        const { waitUntilExit } = (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__/* .render */ .XX)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_6__/* .VimModeProvider */ .l, { configProvider: new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_1__/* .DefaultConfigProvider */ .LV(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(StaticSpeedDemo, {}) }));
        yield waitUntilExit();
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;