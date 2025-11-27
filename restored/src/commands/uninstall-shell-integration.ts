/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleUninstallShellIntegration: () => (/* binding */ handleUninstallShellIntegration)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _console_io_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/console-io.ts");




const INTEGRATION_LINE = 'eval "$(~/.local/bin/cursor-agent shell-integration zsh)"';
function handleUninstallShellIntegration() {
    // Check if running on Windows
    if (false) // removed by dead control flow
{}
    const zshrcPath = node_path__WEBPACK_IMPORTED_MODULE_2___default().join((0,node_os__WEBPACK_IMPORTED_MODULE_1__.homedir)(), ".zshrc");
    try {
        let zshrcContent = "";
        try {
            zshrcContent = (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync)(zshrcPath, "utf8");
        }
        catch (error) {
            if (error.code === "ENOENT") {
                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)("~/.zshrc file not found. Shell integration is not installed.");
                return;
            }
            else {
                throw error;
            }
        }
        // Check if integration line exists
        if (!zshrcContent.includes(INTEGRATION_LINE)) {
            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)("Shell integration is not installed in ~/.zshrc");
            return;
        }
        // Remove the integration line and any trailing newline
        const lines = zshrcContent.split("\n");
        const filteredLines = lines.filter(line => line.trim() !== INTEGRATION_LINE);
        // If the integration line was at the beginning and followed by an empty line, remove that too
        if (lines[0] === INTEGRATION_LINE && lines[1] === "") {
            filteredLines.shift(); // Remove the empty line that was after the integration line
        }
        const newContent = filteredLines.join("\n");
        (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.writeFileSync)(zshrcPath, newContent, "utf8");
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)("Shell integration uninstalled successfully!");
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)("Please restart your terminal for changes to take effect.");
    }
    catch (error) {
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)(`Failed to uninstall shell integration: ${String(error)}`);
        process.exit(1);
    }
}


/***/ })

};
;