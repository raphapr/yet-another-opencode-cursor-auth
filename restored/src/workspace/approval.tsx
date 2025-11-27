/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ runWorkspaceApproval)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:fs/promises");
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs_promises__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */ var _anysphere_ink__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../ink/build/index.js");
/* harmony import */ var _anysphere_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../utils/dist/index.js");
/* harmony import */ var _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/components/approval-dialog.tsx");
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/debug.ts");
/* harmony import */ var _mcp_approval_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/mcp/approval.tsx");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_6__, _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_8__, _mcp_approval_js__WEBPACK_IMPORTED_MODULE_10__]);
([_anysphere_ink__WEBPACK_IMPORTED_MODULE_6__, _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_8__, _mcp_approval_js__WEBPACK_IMPORTED_MODULE_10__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











const WORKSPACE_TRUST_MARKER = ".workspace-trusted";
function isTooHighLevelForInheritance(path) {
    const normalizedPath = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.resolve)(path);
    const home = (0,node_os__WEBPACK_IMPORTED_MODULE_3__.homedir)();
    const pathSegments = normalizedPath.split(node_path__WEBPACK_IMPORTED_MODULE_4__.sep).filter(s => s.length > 0);
    // Check if this is the home directory or a parent of it
    if (normalizedPath === home || home.startsWith(normalizedPath + node_path__WEBPACK_IMPORTED_MODULE_4__.sep)) {
        return true;
    }
    // On Windows, also check if it's just a drive root
    if (false) // removed by dead control flow
{}
    // Check depth from root - paths with less than 3 segments are too high
    // e.g., on Unix: "/" (0), "/Users" (1), "/Users/name" (2) are all too high
    // but "/Users/name/projects" (3) is OK
    if (pathSegments.length < 3) {
        return true;
    }
    return false;
}
function isAnyParentApproved(workspacePath) {
    try {
        const projectsDir = (0,_anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_5__/* .getProjectsDir */ .m4)();
        if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(projectsDir)) {
            return false;
        }
        const existingProjects = new Set((0,node_fs__WEBPACK_IMPORTED_MODULE_1__.readdirSync)(projectsDir));
        let currentPath = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.resolve)(workspacePath);
        let parentPath = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.dirname)(currentPath);
        while (parentPath !== currentPath) {
            const parentSlug = (0,_anysphere_utils__WEBPACK_IMPORTED_MODULE_7__/* .slugifyPath */ .r_)(parentPath);
            if (existingProjects.has(parentSlug)) {
                const parentProjectDir = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)(projectsDir, parentSlug);
                const markerPath = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)(parentProjectDir, WORKSPACE_TRUST_MARKER);
                if ((0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(markerPath) &&
                    !isTooHighLevelForInheritance(parentPath)) {
                    return true;
                }
            }
            currentPath = parentPath;
            parentPath = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.dirname)(currentPath);
        }
        return false;
    }
    catch (error) {
        (0,_debug_js__WEBPACK_IMPORTED_MODULE_9__.debugLogJSON)("Failed to check parent approvals:", error instanceof Error ? error.message : String(error));
        return false;
    }
}
function runWorkspaceApproval(workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspacePath = workspace !== null && workspace !== void 0 ? workspace : process.cwd();
        const project = (0,_anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_5__/* .getProjectDir */ .Xq)(workspacePath);
        const markerPath = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)(project, WORKSPACE_TRUST_MARKER);
        if ((0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(markerPath)) {
            return "already_approved";
        }
        if (isAnyParentApproved(workspacePath)) {
            return "already_approved";
        }
        const unapprovedServers = yield (0,_mcp_approval_js__WEBPACK_IMPORTED_MODULE_10__/* .getUnapprovedMcpServers */ .Vh)(workspacePath, project);
        const hasUnapprovedMcpServers = Object.keys(unapprovedServers.mcpServers).length > 0;
        const options = [];
        const description = [
            hasUnapprovedMcpServers
                ? "Cursor Agent can execute code and access files in your workspace. You will also trust the MCP servers this workspace has enabled."
                : "Cursor Agent can execute code and access files in your workspace.",
            "Do you want to mark this workspace as trusted?",
        ];
        options.push({
            key: "a",
            label: "Trust this workspace",
            value: hasUnapprovedMcpServers ? "approved_with_mcp" : "approved",
        });
        if (hasUnapprovedMcpServers) {
            options.push({
                key: "w",
                label: "Trust this workspace, but don't enable all MCP servers",
                value: "approved",
            });
        }
        options.push({ key: "q", label: "Quit", value: "quit" });
        const result = yield (0,_components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_8__/* .runApprovalDialog */ .b)({
            title: "Workspace Trust Required",
            description,
            content: ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_6__/* .Text */ .EY, { color: "cyan", bold: true, children: workspacePath })),
            options,
            onAction: (action) => __awaiter(this, void 0, void 0, function* () {
                if (action === "approved" || action === "approved_with_mcp") {
                    try {
                        yield (0,node_fs_promises__WEBPACK_IMPORTED_MODULE_2__.mkdir)(project, { recursive: true });
                        const markerPath = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)(project, WORKSPACE_TRUST_MARKER);
                        yield (0,node_fs_promises__WEBPACK_IMPORTED_MODULE_2__.writeFile)(markerPath, JSON.stringify({
                            trustedAt: new Date().toISOString(),
                            workspacePath: workspacePath,
                        }, null, 2));
                    }
                    catch (error) {
                        (0,_debug_js__WEBPACK_IMPORTED_MODULE_9__.debugLogJSON)("Failed to create project directory or trust marker:", error instanceof Error ? error.message : String(error));
                    }
                    if (action === "approved_with_mcp" && hasUnapprovedMcpServers) {
                        try {
                            yield (0,_mcp_approval_js__WEBPACK_IMPORTED_MODULE_10__/* .approveMcpServers */ .Cz)(unapprovedServers, workspacePath, project);
                        }
                        catch (error) {
                            (0,_debug_js__WEBPACK_IMPORTED_MODULE_9__.debugLogJSON)("Failed to approve MCP servers:", error instanceof Error ? error.message : String(error));
                        }
                    }
                }
            }),
        });
        return result;
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;