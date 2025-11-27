/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleSandboxDisable: () => (/* binding */ handleSandboxDisable),
/* harmony export */   handleSandboxEnable: () => (/* binding */ handleSandboxEnable),
/* harmony export */   handleSandboxReset: () => (/* binding */ handleSandboxReset)
/* harmony export */ });
/* harmony import */ var _console_io_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/console-io.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

function handleSandboxEnable(configProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        yield configProvider.transform(cfg => (Object.assign(Object.assign({}, cfg), { sandbox: Object.assign(Object.assign({}, cfg.sandbox), { mode: "enabled" }) })));
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_0__/* .intentionallyWriteToStdout */ .OT)("✅ Sandbox mode enabled. Commands will now run in a sandbox environment.");
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_0__/* .intentionallyWriteToStdout */ .OT)("💡 Use 'agent sandbox disable' to switch back to allowlist mode.");
    });
}
function handleSandboxDisable(configProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        yield configProvider.transform(cfg => (Object.assign(Object.assign({}, cfg), { sandbox: Object.assign(Object.assign({}, cfg.sandbox), { mode: "disabled" }) })));
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_0__/* .intentionallyWriteToStdout */ .OT)("✅ Sandbox mode disabled. Commands will now use allowlist mode (default).");
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_0__/* .intentionallyWriteToStdout */ .OT)("💡 Use 'agent sandbox enable' to switch back to sandbox mode.");
    });
}
function handleSandboxReset(configProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        yield configProvider.transform(cfg => {
            // biome-ignore lint/correctness/noUnusedVariables: stripping out sandbox config
            const { sandbox } = cfg, rest = __rest(cfg, ["sandbox"]);
            return Object.assign(Object.assign({}, rest), { showSandboxIntro: true });
        });
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_0__/* .intentionallyWriteToStdout */ .OT)("✅ Sandbox configuration reset. All sandbox-specific settings have been removed.");
        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_0__/* .intentionallyWriteToStdout */ .OT)("💡 Use 'agent sandbox enable' to configure sandbox mode again.");
    });
}


/***/ })

};
;