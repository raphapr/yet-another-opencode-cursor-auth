/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */X: () => (/* binding */getRepoUrlFilters),
  /* harmony export */k: () => (/* binding */findGitRoot)
  /* harmony export */
});
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../local-exec/dist/index.js");

/** Find the nearest ancestor directory that contains a .git folder. */
function findGitRoot(startPath) {
  try {
    const output = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", ["rev-parse", "--show-toplevel"], {
      cwd: startPath,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8"
    });
    return output.trim();
  } catch (_a) {
    return startPath;
  }
}
function execGit(args, cwd) {
  try {
    const output = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", args, {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    });
    return output.trim();
  } catch (_a) {
    return undefined;
  }
}
/**
 * Compute repo URL filters for background composer listing based on the current repo.
 * Returns the preferred origin host path and any additional fetch remotes as host paths.
 */
function getRepoUrlFilters() {
  const cwd = process.cwd();
  const repoRoot = findGitRoot(cwd);
  const originUrlRaw = execGit(["config", "--get", "remote.origin.url"], repoRoot);
  const allRemotesRaw = execGit(["remote", "-v"], repoRoot);
  const hostPaths = [];
  if (allRemotesRaw) {
    for (const line of allRemotesRaw.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3 && parts[2] === "(fetch)") {
        hostPaths.push((0, _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_1__.toHostPath)(parts[1]));
      }
    }
  }
  const uniqueHostPaths = Array.from(new Set(hostPaths.filter(p => p.length > 0)));
  const preferred = originUrlRaw ? (0, _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_1__.toHostPath)(originUrlRaw) : uniqueHostPaths[0];
  const additional = uniqueHostPaths.filter(p => p !== preferred);
  return {
    preferredRepoUrl: preferred,
    additionalRepoUrls: additional
  };
}

/***/