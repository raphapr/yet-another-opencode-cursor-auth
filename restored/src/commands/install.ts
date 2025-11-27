/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleInstall: () => (/* binding */ handleInstall)
/* harmony export */ });
/* harmony import */ var _console_io_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/console-io.ts");
/* harmony import */ var _install_core_posix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/commands/install-core-posix.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function handleInstall(version_1, urlPrefix_1) {
    return __awaiter(this, arguments, void 0, function* (version, urlPrefix, showProgress = false) {
        try {
            if (showProgress) {
                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_1__/* .intentionallyWriteToStderr */ .p2)(`Downloading version ${version}...`);
            }
            if (false) // removed by dead control flow
{}
            else {
                yield (0,_install_core_posix_js__WEBPACK_IMPORTED_MODULE_0__/* .installCursorAgent */ .BV)({
                    version,
                    urlPrefix,
                    showProgress,
                });
            }
            if (showProgress) {
                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_1__/* .intentionallyWriteToStderr */ .p2)(`Successfully installed version ${version}`);
            }
        }
        catch (error) {
            throw new Error(`Installation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}


/***/ })

};
;