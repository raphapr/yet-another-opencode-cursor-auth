/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleGetChannel: () => (/* binding */ handleGetChannel)
/* harmony export */ });
function handleGetChannel(configProvider) {
    const config = configProvider.get();
    if (config.channel) {
        process.stdout.write(`${config.channel}\n`);
    }
}


/***/ })

};
;