/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleMcpListTools: () => (/* binding */ handleMcpListTools)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */ var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function extractArgNames(inputSchema) {
    try {
        if (!inputSchema || typeof inputSchema !== "object")
            return [];
        const schema = inputSchema;
        const props = schema === null || schema === void 0 ? void 0 : schema.properties;
        if (props && typeof props === "object") {
            return Object.keys(props);
        }
        return [];
    }
    catch (_a) {
        return [];
    }
}
function ToolsListView({ identifier, rows, }) {
    if (rows.length === 0) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Box */ .az, { flexDirection: "column", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { children: ["No tools available for '", identifier, "'."] }) }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Box */ .az, { flexDirection: "column", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { children: ["Tools for ", identifier, " (", rows.length, "):"] }), rows.map(t => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Box */ .az, { gap: 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { children: ["- ", t.name, " "] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { color: "gray", children: ["(", t.args.join(", "), ")"] })] }) }, t.name)))] }));
}
function handleMcpListTools(ctx, identifier, loader) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { rerender } = (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .render */ .XX)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { children: ["Loading tools for MCP '", identifier, "'\u2026"] }));
        try {
            const client = yield loader.loadClient(ctx, identifier);
            const state = yield client.getState(ctx);
            if (state.kind !== "ready") {
                rerender((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Box */ .az, { flexDirection: "column", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { color: "yellow", children: ["MCP '", identifier, "' requires authentication."] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { children: ["Please run: cursor-agent mcp login ", identifier] })] }));
                process.exit(1);
            }
            const tools = yield client.getTools(ctx);
            const rows = tools
                .map(tool => ({
                name: tool.name,
                args: extractArgNames(tool.inputSchema),
            }))
                .sort((a, b) => a.name.localeCompare(b.name));
            rerender((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToolsListView, { identifier: identifier, rows: rows }));
            process.exit(0);
        }
        catch (err) {
            const msg = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : String(err);
            rerender((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Box */ .az, { flexDirection: "column", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__/* .Text */ .EY, { color: "red", children: ["Failed to list tools: ", msg] }) }));
            process.exit(1);
        }
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;