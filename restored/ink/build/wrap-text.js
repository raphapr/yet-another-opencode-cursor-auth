/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var wrap_ansi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/wrap-ansi@9.0.0/node_modules/wrap-ansi/index.js");
/* harmony import */ var cli_truncate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/cli-truncate@4.0.0/node_modules/cli-truncate/index.js");


const cache = {};
const wrapText = (text, maxWidth, wrapType) => {
    const cacheKey = text + String(maxWidth) + String(wrapType);
    const cachedText = cache[cacheKey];
    if (cachedText) {
        return cachedText;
    }
    let wrappedText = text;
    if (wrapType === 'no-wrap') {
        // Return text as-is, letting the terminal handle wrapping
        wrappedText = text;
    }
    else if (wrapType === 'wrap') {
        wrappedText = (0,wrap_ansi__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(text, maxWidth, {
            trim: false,
            hard: true,
        });
    }
    else if (wrapType.startsWith('truncate')) {
        let position = 'end';
        if (wrapType === 'truncate-middle') {
            position = 'middle';
        }
        if (wrapType === 'truncate-start') {
            position = 'start';
        }
        wrappedText = (0,cli_truncate__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(text, maxWidth, { position });
    }
    cache[cacheKey] = wrappedText;
    return wrappedText;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (wrapText);
//# sourceMappingURL=wrap-text.js.map

/***/ })

};
;