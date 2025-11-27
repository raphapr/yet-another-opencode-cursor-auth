/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runMarkdownTest: () => (/* binding */ runMarkdownTest)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../agent-kv/dist/index.js");
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */ var _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../ink/build/index.js");
/* harmony import */ var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../local-exec/dist/index.js");
/* harmony import */ var _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */ var _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/alt-screen.tsx");
/* harmony import */ var _components_markdown_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/components/markdown.tsx");
/* harmony import */ var _components_text_input_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/components/text-input.tsx");
/* harmony import */ var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/context/agent-state-context.tsx");
/* harmony import */ var _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/context/terminal-state-context.tsx");
/* harmony import */ var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/context/theme-context.tsx");
/* harmony import */ var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/context/vim-mode-context.tsx");
/* harmony import */ var _models_index_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/models/index.ts");
/* harmony import */ var _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/pending-decision-store.ts");
/* harmony import */ var _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/state/sqlite-blob-store.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_8__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_9__, _components_text_input_js__WEBPACK_IMPORTED_MODULE_10__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_12__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_13__]);
([_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_8__, _components_markdown_js__WEBPACK_IMPORTED_MODULE_9__, _components_text_input_js__WEBPACK_IMPORTED_MODULE_10__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_12__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_13__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


















const SAMPLE_MD = `# Markdown Test

Type below to live-update. Supports headings, lists (unordered and ordered), blockquotes, inline code, bold and italic, and fenced code blocks.

## Unordered list

- Item 1 with **bold** and *italic*
- Item 2 with \`inline code\`
  - Nested bullet one
  - Nested bullet two with a long sentence that should wrap to the next line while keeping the bullet in its own column.

## Ordered list

1. First item short
2. Second item is intentionally very long to test wrapping behavior. The wrapped text should align under the first character of the content and not under the number column.
10. Tenth item checks multi-digit number alignment
    1. Nested ordered sub-item
    2. Another nested ordered sub-item with even longer text that should wrap across multiple lines to confirm number-column alignment is preserved.

## Mixed nesting

1. Top-level ordered
   - Nested bullet under ordered
     1. Double-nested ordered under bullet

## Blockquote

> A blockquote with *style* and a longer text that should wrap nicely as well.

## Code

\`\`\`typescript
function greet(name: string) {
  console.log("Hello, " + name);
}
\`\`\`
`;
const MarkdownSandbox = () => {
    const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(SAMPLE_MD);
    const [cursorToEndSignal, setCursorToEndSignal] = (0,react__WEBPACK_IMPORTED_MODULE_7__.useState)(0);
    // Small UX: Ctrl-L clears to sample
    (0,react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
        const onKey = (chunk) => {
            const s = chunk.toString("utf8");
            if (s === "\u000c") {
                // Ctrl-L
                setInput(SAMPLE_MD);
                setCursorToEndSignal(c => c + 1);
            }
        };
        process.stdin.on("data", onKey);
        return () => {
            process.stdin.off("data", onKey);
        };
    }, []);
    // Sticky right-hint for discoverability
    const rightHint = (0,react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(() => "Ctrl-L: reset • Shift-Enter: newline", []);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_alt_screen_js__WEBPACK_IMPORTED_MODULE_8__/* .AltScreen */ .I, { clearOnMount: true, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__/* .Box */ .az, { flexDirection: "column", paddingX: 1, gap: 1, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__/* .Text */ .EY, { bold: true, children: "Markdown Renderer Test" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__/* .Box */ .az, { borderLeft: true, paddingLeft: 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_markdown_js__WEBPACK_IMPORTED_MODULE_9__/* .Markdown */ .oz, { content: input }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__/* .Box */ .az, { marginTop: 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__/* .Text */ .EY, { dimColor: true, children: "Input (live):" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_text_input_js__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .A, { value: input, onChange: setInput, placeholder: "Type markdown here...", rightPlaceholder: rightHint, showCursor: true, cursorToEndSignal: cursorToEndSignal, onCtrlC: () => {
                        /* allow exit */
                    } })] }) }));
};
const MarkdownSandboxApp = () => {
    const dummyModel = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .ModelDetails */ .Gm({
        modelId: "gpt-5",
        displayModelId: "gpt-5",
        displayName: "Markdown Test",
    });
    const modelManager = _models_index_js__WEBPACK_IMPORTED_MODULE_15__/* .ModelManager */ .P3.createForTesting();
    modelManager.setCurrentModelWithoutPersistence(dummyModel);
    // Create a minimal AgentStore backed by SQLite to tolerate unknown metadata keys
    const sqlite = new _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_17__/* .SQLiteBlobStoreWithMetadata */ .M(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), ".md-test", "store.db"));
    const agentStore = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .AgentStore */ .pH(sqlite, sqlite);
    try {
        agentStore.setMetadata("mode", "default");
    }
    catch (_a) { }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_14__/* .VimModeProvider */ .l, { configProvider: new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_3__/* .DefaultConfigProvider */ .LV(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_12__/* .TerminalStateProvider */ .rs, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_11__/* .AgentStateProvider */ .oG, { fileChangeTracker: new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.FileChangeTracker(process.cwd()), pendingDecisionStore: new _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_16__/* .PendingDecisionStore */ .$(), initialViewMode: "chat", initialAgentStore: agentStore, modelManager: modelManager, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_theme_context_js__WEBPACK_IMPORTED_MODULE_13__/* .ThemeProvider */ .NP, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MarkdownSandbox, {}) }) }) }) }));
};
function runMarkdownTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const { waitUntilExit } = (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__/* .render */ .XX)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MarkdownSandboxApp, {}), {
            exitOnCtrlC: true,
        });
        yield waitUntilExit();
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;