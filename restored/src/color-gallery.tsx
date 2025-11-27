/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runColorGallery: () => (/* binding */ runColorGallery)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */ var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../agent-kv/dist/index.js");
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */ var _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/index.js");
/* harmony import */ var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../local-exec/dist/index.js");
/* harmony import */ var _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/constants.ts");
/* harmony import */ var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/context/agent-state-context.tsx");
/* harmony import */ var _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/context/terminal-state-context.tsx");
/* harmony import */ var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/context/theme-context.tsx");
/* harmony import */ var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/context/vim-mode-context.tsx");
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/debug.ts");
/* harmony import */ var _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/hooks/use-screen-size.ts");
/* harmony import */ var _models_index_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/models/index.ts");
/* harmony import */ var _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/pending-decision-store.ts");
/* harmony import */ var _utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/utils/color-mixing.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_9__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_10__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_13__]);
([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_9__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_10__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_13__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

















const buildAnsi256Palette = () => {
    const entries = [];
    for (let i = 0; i <= 255; i += 1) {
        entries.push({ index: i, hex: (0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .ansi256IndexToHex */ .LR)(i) });
    }
    return entries;
};
const sampleDiff = `- old line here\n+ new line here\n  context no-change line\n+ another addition with tabs\tand\tcolumns\n- removal item`;
const K_COLS = 8;
const ColorGalleryInner = () => {
    var _a;
    const { stdout } = (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .useStdout */ .t$)();
    const screen = (0,_hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_13__/* .useScreenSize */ .l)();
    // Track if the user has manually adjusted indices, so we don't clobber choices
    const [addIdx, setAddIdx] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(() => {
        const modeStr = (0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .getColorMode */ .PT)();
        const isLight = false; // initial guess; refined after detection
        return computeDefaultIndices(modeStr, isLight).add;
    });
    const [removeIdx, setRemoveIdx] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(() => {
        const modeStr = (0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .getColorMode */ .PT)();
        const isLight = false; // initial guess; refined after detection
        return computeDefaultIndices(modeStr, isLight).remove;
    });
    const [mode, setMode] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)("add");
    const [forceLight, setForceLight] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(null);
    const detectedTheme = (0,_context_theme_context_js__WEBPACK_IMPORTED_MODULE_10__/* .useIsLightTheme */ .pW)();
    const isLightTheme = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => {
        if (forceLight != null)
            return forceLight;
        return detectedTheme !== null && detectedTheme !== void 0 ? detectedTheme : false;
    }, [detectedTheme, forceLight]);
    const palette = (0,react__WEBPACK_IMPORTED_MODULE_6__.useMemo)(buildAnsi256Palette, []);
    const totalRows = Math.ceil(palette.length / K_COLS);
    const headerLines = 2;
    const previewLines = 7;
    const footerLines = 2;
    const gridAreaRows = Math.max(3, ((_a = screen === null || screen === void 0 ? void 0 : screen.height) !== null && _a !== void 0 ? _a : 24) - headerLines - previewLines - footerLines - 1);
    const visibleGridRows = Math.max(1, Math.floor(gridAreaRows / 3)); // top, content, bottom per grid row
    const [topRow, setTopRow] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(0);
    // Pager terminal modes
    (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        if (stdout) {
            try {
                stdout.write("\x1b[?1049h\x1b[?7l\x1b[?1h\x1b=");
            }
            catch (_a) { }
        }
        return () => {
            if (stdout) {
                try {
                    stdout.write("\x1b[?1l\x1b>\x1b[?7h\x1b[?1049l");
                }
                catch (_a) { }
            }
        };
    }, [stdout]);
    // Theme detection is gated by isOsc11SafeTerminal internally, so let it run when safe
    const ensureVisible = (0,react__WEBPACK_IMPORTED_MODULE_6__.useCallback)((index) => {
        const row = Math.floor(index / K_COLS);
        if (row < topRow)
            setTopRow(row);
        else if (row >= topRow + visibleGridRows)
            setTopRow(Math.max(0, row - visibleGridRows + 1));
    }, [visibleGridRows, topRow]);
    // Recompute defaults when theme or color mode changes, unless user edited
    const [userEdited, setUserEdited] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(false);
    (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        if (userEdited)
            return;
        const modeStr = (0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .getColorMode */ .PT)();
        const defaults = computeDefaultIndices(modeStr, isLightTheme);
        setAddIdx(defaults.add);
        setRemoveIdx(defaults.remove);
        ensureVisible(defaults.add);
    }, [isLightTheme, ensureVisible, userEdited]);
    (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .useInput */ .Ge)((input, key) => {
        if (key.escape || input === "q" || input === "Q") {
            try {
                stdout === null || stdout === void 0 ? void 0 : stdout.write("\x1b[2J\x1b[H");
            }
            catch (_a) { }
            process.exit(0);
        }
        if (key.return || key.tab || input === " ") {
            setMode(m => (m === "add" ? "remove" : "add"));
            return;
        }
        if (input === "+" || input === "A" || input === "a") {
            setMode("add");
            return;
        }
        if (input === "-" || input === "D" || input === "d") {
            setMode("remove");
            return;
        }
        if (input === "t" || input === "T") {
            setForceLight(prev => (prev == null ? !detectedTheme : !prev));
            return;
        }
        if (input === "r" || input === "R") {
            // Reset to per-color-mode defaults (based on detected/forced theme)
            const modeStr = (0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .getColorMode */ .PT)();
            const light = forceLight != null ? forceLight : Boolean(detectedTheme);
            const d = computeDefaultIndices(modeStr, light);
            setAddIdx(d.add);
            setRemoveIdx(d.remove);
            ensureVisible(d.add);
            return;
        }
        const cols = K_COLS; // fixed grid columns
        if (key.leftArrow) {
            setUserEdited(true);
            if (mode === "add")
                setAddIdx(i => {
                    const nn = Math.max(0, i - 1);
                    ensureVisible(nn);
                    return nn;
                });
            else
                setRemoveIdx(i => {
                    const nn = Math.max(0, i - 1);
                    ensureVisible(nn);
                    return nn;
                });
            return;
        }
        if (key.rightArrow) {
            setUserEdited(true);
            if (mode === "add")
                setAddIdx(i => {
                    const nn = Math.min(255, i + 1);
                    ensureVisible(nn);
                    return nn;
                });
            else
                setRemoveIdx(i => {
                    const nn = Math.min(255, i + 1);
                    ensureVisible(nn);
                    return nn;
                });
            return;
        }
        if (key.upArrow) {
            setUserEdited(true);
            if (mode === "add")
                setAddIdx(i => {
                    const nn = Math.max(0, i - cols);
                    ensureVisible(nn);
                    return nn;
                });
            else
                setRemoveIdx(i => {
                    const nn = Math.max(0, i - cols);
                    ensureVisible(nn);
                    return nn;
                });
            return;
        }
        if (key.downArrow) {
            setUserEdited(true);
            if (mode === "add")
                setAddIdx(i => {
                    const nn = Math.min(255, i + cols);
                    ensureVisible(nn);
                    return nn;
                });
            else
                setRemoveIdx(i => {
                    const nn = Math.min(255, i + cols);
                    ensureVisible(nn);
                    return nn;
                });
            return;
        }
        // Page up/down
        const anyKey = key;
        if (anyKey.pageDown) {
            setUserEdited(true);
            setTopRow(r => Math.min(Math.max(0, totalRows - visibleGridRows), r + visibleGridRows));
            if (mode === "add")
                setAddIdx(i => {
                    const row = Math.floor(i / cols);
                    const newRow = Math.min(totalRows - 1, row + visibleGridRows);
                    const col = i % cols;
                    const nn = Math.min(palette.length - 1, newRow * cols + col);
                    ensureVisible(nn);
                    return nn;
                });
            else
                setRemoveIdx(i => {
                    const row = Math.floor(i / cols);
                    const newRow = Math.min(totalRows - 1, row + visibleGridRows);
                    const col = i % cols;
                    const nn = Math.min(palette.length - 1, newRow * cols + col);
                    ensureVisible(nn);
                    return nn;
                });
            return;
        }
        if (anyKey.pageUp) {
            setUserEdited(true);
            setTopRow(r => Math.max(0, r - visibleGridRows));
            if (mode === "add")
                setAddIdx(i => {
                    const row = Math.floor(i / cols);
                    const newRow = Math.max(0, row - visibleGridRows);
                    const col = i % cols;
                    const nn = Math.min(palette.length - 1, newRow * cols + col);
                    ensureVisible(nn);
                    return nn;
                });
            else
                setRemoveIdx(i => {
                    const row = Math.floor(i / cols);
                    const newRow = Math.max(0, row - visibleGridRows);
                    const col = i % cols;
                    const nn = Math.min(palette.length - 1, newRow * cols + col);
                    ensureVisible(nn);
                    return nn;
                });
            return;
        }
    });
    (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        var _a, _b, _c;
        if (!stdout)
            return;
        const _width = (_a = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _a !== void 0 ? _a : 80;
        const height = (_b = screen === null || screen === void 0 ? void 0 : screen.height) !== null && _b !== void 0 ? _b : 24;
        const write = (s) => {
            try {
                stdout.write(s);
            }
            catch (_a) { }
        };
        const move = (r, c) => write(`\x1b[${r};${c}H`);
        const clearLine = () => write("\x1b[2K");
        const reset = () => write("\x1b[0m");
        const bg256 = (idx) => `\x1b[48;5;${idx}m`;
        const bold = "\x1b[1m";
        // Hide cursor during redraw to reduce flicker
        write("\x1b[?25l");
        // Header
        move(1, 1);
        clearLine();
        write(`${bold}ANSI-256 Color Gallery\x1b[22m`);
        move(2, 1);
        clearLine();
        const themeStr = forceLight != null
            ? forceLight
                ? "forced light"
                : "forced dark"
            : detectedTheme == null
                ? "detected dark"
                : detectedTheme
                    ? "detected light"
                    : "detected dark";
        const _modeStr = mode === "add" ? "ADD" : "REMOVE";
        const modeColored = mode === "add" ? "\x1b[1;92mADD\x1b[0m" : "\x1b[1;91mREMOVE\x1b[0m";
        write(`Theme: ${themeStr}  •  Color mode: ${(0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .getColorMode */ .PT)()}  •  Mode: ${modeColored}  •  Arrows: move • Space/Enter/Tab: toggle add/remove • [+]/A: ADD • [-]/D: REMOVE • T: toggle theme • R: reset • Q/Esc: exit`);
        // Grid
        const innerWidth = 9; // interior width; room for swatch + label
        const BORDER_GRAY = "\x1b[90m";
        const BORDER_YELLOW = "\x1b[1;93m"; // bold bright yellow
        const startRow = 3;
        for (let r = 0; r < visibleGridRows; r++) {
            const rowIndex = topRow + r;
            if (rowIndex >= totalRows)
                break;
            // Top border line for this grid row
            move(startRow + r * 3, 1);
            clearLine();
            let topLine = "";
            for (let c = 0; c < K_COLS; c++) {
                const idx = rowIndex * K_COLS + c;
                if (idx >= palette.length)
                    break;
                const isActive = (mode === "add" && idx === addIdx) ||
                    (mode === "remove" && idx === removeIdx);
                const isOtherSelected = (mode === "add" && idx === removeIdx) ||
                    (mode === "remove" && idx === addIdx);
                const border = isActive
                    ? BORDER_YELLOW
                    : isOtherSelected
                        ? "\x1b[1;96m"
                        : BORDER_GRAY;
                topLine += `${border}┌${"─".repeat(innerWidth)}┐\x1b[0m `;
            }
            write(topLine);
            // Content line with vertical borders
            move(startRow + r * 3 + 1, 1);
            clearLine();
            let line = "";
            for (let c = 0; c < K_COLS; c++) {
                const idx = rowIndex * K_COLS + c;
                if (idx >= palette.length)
                    break;
                const isActive = (mode === "add" && idx === addIdx) ||
                    (mode === "remove" && idx === removeIdx);
                const isOtherSelected = (mode === "add" && idx === removeIdx) ||
                    (mode === "remove" && idx === addIdx);
                const label = String(idx).padStart(3, " ");
                const swatchWidth = Math.max(2, innerWidth - 4); // keep 1 space + 3-digit label
                const border = isActive
                    ? BORDER_YELLOW
                    : isOtherSelected
                        ? "\x1b[1;96m"
                        : BORDER_GRAY;
                // Left border
                line += `${border}│\x1b[0m`;
                // Inner colored swatch + label on default background
                line += `${bg256(idx)}${" ".repeat(swatchWidth)}\x1b[0m ${label}`;
                // Right border and spacer
                line += `${border}│\x1b[0m `;
            }
            write(line);
            // Bottom border line for this grid row
            move(startRow + r * 3 + 2, 1);
            clearLine();
            let bottomLine = "";
            for (let c = 0; c < K_COLS; c++) {
                const idx = rowIndex * K_COLS + c;
                if (idx >= palette.length)
                    break;
                const isActive = (mode === "add" && idx === addIdx) ||
                    (mode === "remove" && idx === removeIdx);
                const isOtherSelected = (mode === "add" && idx === removeIdx) ||
                    (mode === "remove" && idx === addIdx);
                const border = isActive
                    ? BORDER_YELLOW
                    : isOtherSelected
                        ? "\x1b[1;96m"
                        : BORDER_GRAY;
                bottomLine += `${border}└${"─".repeat(innerWidth)}┘\x1b[0m `;
            }
            write(bottomLine);
        }
        // Preview title
        const previewStart = startRow + visibleGridRows * 3 + 1;
        move(previewStart, 1);
        clearLine();
        const previewTitle = "Preview (ANSI-256, using selected color)";
        write(`${bold}${previewTitle}\x1b[22m`);
        const previewLinesArr = sampleDiff.split("\n");
        for (let i = 0; i < Math.min(previewLinesArr.length, previewLines); i++) {
            const y = previewStart + 1 + i;
            move(y, 1);
            clearLine();
            const raw = previewLinesArr[i];
            const kind = raw.startsWith("+")
                ? "add"
                : raw.startsWith("-")
                    ? "remove"
                    : "other";
            if (kind === "add") {
                write(`${bg256(addIdx)} ${raw}\x1b[0m`);
            }
            else if (kind === "remove") {
                write(`${bg256(removeIdx)} ${raw}\x1b[0m`);
            }
            else
                write(` ${raw}`);
        }
        // Footer
        move(height - 1, 1);
        clearLine();
        const addDispHex = (0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .ansi256IndexToHex */ .LR)(addIdx);
        const rmDispHex = (0,_utils_color_mixing_js__WEBPACK_IMPORTED_MODULE_16__/* .ansi256IndexToHex */ .LR)(removeIdx);
        write(`Picked — Add: #${String(addIdx).padStart(3, " ")} ${addDispHex}   ·   Remove: #${String(removeIdx).padStart(3, " ")} ${rmDispHex}`);
        move(height, 1);
        clearLine();
        const dbg = (_c = _debug_js__WEBPACK_IMPORTED_MODULE_12__.getDebugSession === null || _debug_js__WEBPACK_IMPORTED_MODULE_12__.getDebugSession === void 0 ? void 0 : (0,_debug_js__WEBPACK_IMPORTED_MODULE_12__.getDebugSession)()) === null || _c === void 0 ? void 0 : _c.serverUrl;
        if (dbg) {
            write(`q/esc: exit   ·   Debug: ${dbg}  (log: ${dbg}/log)`);
        }
        else {
            write(`q/esc: exit`);
        }
        reset();
        // Show cursor again
        write("\x1b[?25h");
    }, [
        stdout,
        screen === null || screen === void 0 ? void 0 : screen.width,
        screen === null || screen === void 0 ? void 0 : screen.height,
        addIdx,
        removeIdx,
        mode,
        topRow,
        visibleGridRows,
        totalRows,
        detectedTheme,
        forceLight,
        palette.length,
    ]);
    return null;
};
function computeDefaultIndices(_colorMode, isLight) {
    // Use unified ANSI-256 indices regardless of terminal mode
    return isLight
        ? { add: _constants_js__WEBPACK_IMPORTED_MODULE_7__/* .DIFF_ROW_ANSI256_LIGHT */ .Xh.add, remove: _constants_js__WEBPACK_IMPORTED_MODULE_7__/* .DIFF_ROW_ANSI256_LIGHT */ .Xh.remove }
        : { add: _constants_js__WEBPACK_IMPORTED_MODULE_7__/* .DIFF_ROW_ANSI256_DARK */ .XM.add, remove: _constants_js__WEBPACK_IMPORTED_MODULE_7__/* .DIFF_ROW_ANSI256_DARK */ .XM.remove };
}
const ColorGalleryApp = () => {
    const dummyModel = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_5__/* .ModelDetails */ .Gm({
        modelId: "gpt-5",
        displayModelId: "gpt-5",
        displayName: "Color Gallery",
    });
    const modelManager = _models_index_js__WEBPACK_IMPORTED_MODULE_14__/* .ModelManager */ .P3.createForTesting();
    modelManager.setCurrentModelWithoutPersistence(dummyModel);
    const initialAgentStore = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__/* .AgentStore */ .pH(new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__/* .InMemoryBlobStore */ .ve(), new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__/* .InMemoryTypedStore */ .We());
    try {
        initialAgentStore.setMetadata("mode", "default");
    }
    catch (_a) { }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_11__/* .VimModeProvider */ .l, { configProvider: new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__/* .DefaultConfigProvider */ .LV(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_9__/* .TerminalStateProvider */ .rs, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_theme_context_js__WEBPACK_IMPORTED_MODULE_10__/* .ThemeProvider */ .NP, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_8__/* .AgentStateProvider */ .oG, { fileChangeTracker: new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_4__.FileChangeTracker(process.cwd()), pendingDecisionStore: new _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_15__/* .PendingDecisionStore */ .$(), initialViewMode: "chat", initialAgentStore: initialAgentStore, modelManager: modelManager, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ColorGalleryInner, {}) }) }) }) }));
};
function runColorGallery() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Optional debug server
        const enableDebug = process.argv.includes("--debug");
        if (enableDebug) {
            try {
                const _session = yield (0,_debug_js__WEBPACK_IMPORTED_MODULE_12__.initDebug)();
                const url = (_b = (_a = (0,_debug_js__WEBPACK_IMPORTED_MODULE_12__.getDebugSession)()) === null || _a === void 0 ? void 0 : _a.serverUrl) !== null && _b !== void 0 ? _b : "";
                // Print URLs so the user can open the debug page or tail logs
                try {
                    process.stdout.write(`Debug enabled. Server: ${url}  log: ${url}/log  events: ${url}/events\n`);
                }
                catch (_c) { }
                (0,_debug_js__WEBPACK_IMPORTED_MODULE_12__.debugLog)("color-gallery.debug.start", {
                    argv: process.argv,
                    url,
                    pid: process.pid,
                });
            }
            catch (_d) { }
        }
        const { waitUntilExit } = (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .render */ .XX)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ColorGalleryApp, {}), { exitOnCtrlC: true });
        yield waitUntilExit();
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;