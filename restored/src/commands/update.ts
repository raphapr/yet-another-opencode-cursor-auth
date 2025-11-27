/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleUpdate: () => (/* binding */ handleUpdate)
/* harmony export */ });
/* harmony import */ var _update_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/commands/update-core.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function handleUpdate(dashboardClient, configProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = configProvider.get();
            if (config.channel === "static") {
                process.stdout.write("Skipping update check for static channel\n");
                return;
            }
            yield (0,_update_core_js__WEBPACK_IMPORTED_MODULE_0__/* .updateCursorAgent */ .N)({
                dashboardClient,
                showProgress: true,
                channel: config.channel,
            });
        }
        catch (error) {
            throw new Error(`Update failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}


/***/ })

};
;