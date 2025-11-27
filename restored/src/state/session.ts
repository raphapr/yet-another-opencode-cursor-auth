/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */d: () => (/* binding */session)
  /* harmony export */
});
const globalSessionState = Object.seal({
  lastRequest: null
});
const session = Object.seal({
  get lastRequest() {
    return globalSessionState.lastRequest;
  },
  recordLastRequest(id, meta) {
    const info = {
      id,
      timestamp: Date.now(),
      path: meta === null || meta === void 0 ? void 0 : meta.path
    };
    globalSessionState.lastRequest = info;
  },
  getLastRequestId() {
    var _a, _b;
    return (_b = (_a = globalSessionState.lastRequest) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
  },
  getLastRequest() {
    return globalSessionState.lastRequest;
  }
});

/***/