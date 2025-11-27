/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleInstallShellIntegration: () => (/* binding */ handleInstallShellIntegration)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _console_io_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/console-io.ts");




const INTEGRATION_LINE = 'eval "$(~/.local/bin/cursor-agent shell-integration zsh)"';
function handleInstallShellIntegration() {
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
            // File doesn't exist, create it
            if (error.code === "ENOENT") {
                zshrcContent = "";
            }
            else {
                throw error;
            }
        }
        // Check if integration is already installed
        if (zshrcContent.includes(INTEGRATION_LINE)) {
            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)("Shell integration is already installed in ~/.zshrc");
            return;
        }
        // Add the integration line at the beginning
        const newContent = `${INTEGRATION_LINE}\n${zshrcContent}`;
        (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.writeFileSync)(zshrcPath, newContent, "utf8");
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)("Shell integration installed successfully!");
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)("Please restart your terminal or run 'source ~/.zshrc' to activate.");
    }
    catch (error) {
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_3__/* .intentionallyWriteToStderr */ .p2)(`Failed to install shell integration: ${String(error)}`);
        process.exit(1);
    }
}


/***/ })

};
;