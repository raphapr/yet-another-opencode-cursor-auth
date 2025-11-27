/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:process");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");

/**
 * `StdoutContext` is a React context, which exposes stdout stream, where Ink renders your app.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const StdoutContext = (0, react__WEBPACK_IMPORTED_MODULE_1__.createContext)({
  stdout: node_process__WEBPACK_IMPORTED_MODULE_0__.stdout,
  write() {}
});
StdoutContext.displayName = 'InternalStdoutContext';
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = StdoutContext;
//# sourceMappingURL=StdoutContext.js.map

/***/