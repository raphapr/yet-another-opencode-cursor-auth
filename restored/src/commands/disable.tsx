/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleMcpDisable: () => (/* binding */ handleMcpDisable)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */ var _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/index.js");
/* harmony import */ var _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../mcp-agent-exec/dist/index.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__]);
_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





function DisableView({ identifier, previousServers, currentServers, error, }) {
    if (error) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Box */ .az, { flexDirection: "column", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { color: "red", children: ["Failed to disable MCP server: ", error] }) }));
    }
    const wasEnabled = previousServers.some(s => s.startsWith(`${identifier}-`));
    const isNowDisabled = !currentServers.some(s => s.startsWith(`${identifier}-`));
    if (!wasEnabled) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Box */ .az, { flexDirection: "column", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { color: "yellow", children: ["MCP server '", identifier, "' was not enabled"] }) }));
    }
    if (isNowDisabled) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Box */ .az, { flexDirection: "column", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { color: "green", children: ["\u2713 Disabled MCP server: ", identifier] }), currentServers.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { children: " " }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { children: "Currently enabled servers:" }), Array.from(new Set(currentServers.map(s => s.split("-")[0]))).map(server => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { children: [" \u2022 ", server] }, server)))] }))] }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Box */ .az, { flexDirection: "column", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { color: "red", children: ["Failed to disable MCP server '", identifier, "'"] }) }));
}
function handleMcpDisable(_configProvider, identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { rerender } = (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .render */ .XX)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { children: ["Disabling MCP server '", identifier, "'..."] }));
        try {
            const cwd = process.cwd();
            const projectDir = (0,_anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__/* .getProjectDir */ .Xq)(cwd);
            const approvalStore = new _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_4__/* .FileBasedMcpApprovalStore */ .mF(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(projectDir, "mcp-approvals.json"), cwd);
            const previousServers = yield approvalStore.getApprovals();
            yield approvalStore.clearApprovals(approvalKey => approvalKey.startsWith(`${identifier}-`));
            const currentServers = yield approvalStore.getApprovals();
            rerender((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(DisableView, { identifier: identifier, previousServers: previousServers, currentServers: currentServers }));
            process.exit(0);
        }
        catch (err) {
            const msg = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : String(err);
            rerender((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(DisableView, { identifier: identifier, previousServers: [], currentServers: [], error: msg }));
            process.exit(1);
        }
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;