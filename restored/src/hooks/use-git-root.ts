/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */_: () => (/* binding */useGitRoot)
  /* harmony export */
});
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/path-utils.ts");
function useGitRoot(baseFolderInfo) {
  return (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    const gitDir = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_2__ /* .findGitDir */.rR)(baseFolderInfo.root);
    if (!gitDir) return null;
    // We want the repository root, not the .git directory itself
    return node_path__WEBPACK_IMPORTED_MODULE_0___default().dirname(gitDir);
  }, [baseFolderInfo.root]);
}

/***/