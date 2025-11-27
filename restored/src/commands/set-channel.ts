/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleSetChannel: () => (/* binding */ handleSetChannel)
/* harmony export */ });
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../cursor-config/dist/index.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function handleSetChannel(configProvider, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_0__/* .CursorConfigSchema */ .Kr.pick({ channel: true });
        const result = schema.safeParse({ channel });
        if (!result.success) {
            throw new Error(`Invalid channel: ${result.error.message}`);
        }
        yield configProvider.transform(config => (Object.assign(Object.assign({}, config), { channel: result.data.channel })));
    });
}


/***/ })

};
;