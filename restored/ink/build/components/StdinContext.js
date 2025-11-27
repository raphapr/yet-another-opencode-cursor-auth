/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var node_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:events");
/* harmony import */
var node_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:process");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");

/**
 * `StdinContext` is a React context, which exposes input stream.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const StdinContext = (0, react__WEBPACK_IMPORTED_MODULE_2__.createContext)({
  stdin: node_process__WEBPACK_IMPORTED_MODULE_1__.stdin,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  internal_eventEmitter: new node_events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter(),
  setRawMode() {},
  isRawModeSupported: false,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  internal_exitOnCtrlC: true
});
StdinContext.displayName = 'InternalStdinContext';
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = StdinContext;
//# sourceMappingURL=StdinContext.js.map

/***/