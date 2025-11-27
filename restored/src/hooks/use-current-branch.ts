/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */h: () => (/* binding */useCurrentBranch)
  /* harmony export */
});
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/debug.ts");
/* harmony import */
var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/utils/path-utils.ts");
function useCurrentBranch(baseFolderInfo) {
  return (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    try {
      const gitDir = (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_4__ /* .findGitDir */.rR)(baseFolderInfo.root);
      if (!gitDir) {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_3__.debugLog)(`No .git directory found starting from: ${baseFolderInfo.root}`);
        return null;
      }
      const headPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(gitDir, "HEAD");
      if (!node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(headPath)) return null;
      const headContent = node_fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(headPath, "utf8").trim();
      // Typical HEAD: "ref: refs/heads/main"
      const match = headContent.match(/^ref: refs\/heads\/(.+)$/);
      if (match) {
        return match[1];
      }
      // Detached HEAD (commit hash)
      if (/^[0-9a-f]{40}$/.test(headContent)) {
        return headContent.slice(0, 7); // short hash
      }
      return null;
    } catch (_a) {
      return null;
    }
  }, [baseFolderInfo.root]);
}

/***/