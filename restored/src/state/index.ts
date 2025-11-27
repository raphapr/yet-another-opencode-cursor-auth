/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */r: () => (/* binding */getChatsRootDir)
  /* harmony export */
});
/* harmony import */
var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:crypto");
/* harmony import */
var node_crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../cursor-config/dist/index.js");
function getChatsRootDir() {
  const cwdHash = (0, node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHash)("md5").update(process.cwd()).digest("hex");
  return (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)((0, _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .getConfigDir */.WI)(), "chats", cwdHash);
}

/***/