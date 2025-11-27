/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */g: () => (/* binding */isLikelyToOpenBrowser),
  /* harmony export */p: () => (/* binding */openBrowser)
  /* harmony export */
});
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var _anysphere_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../utils/dist/index.js");
/* harmony import */
var _terminal_theme_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/terminal-theme.ts");
function isLikelyToOpenBrowser(url) {
  if (process.env.NO_OPEN_BROWSER) {
    return false;
  }
  const runningInSsh = (0, _terminal_theme_js__WEBPACK_IMPORTED_MODULE_2__ /* .isLikelySshSession */.lf)();
  if (runningInSsh) {
    return false;
  }
  // Validate that the URL is a web link (http:// or https://)
  if (!isValidWebUrl(url)) {
    return false;
  }
  try {
    getBrowserInvocation(url);
    return true;
  } catch (_a) {
    return false;
  }
}
function getBrowserInvocation(url) {
  const platform = "darwin";
  let file;
  let urlArgs;
  if (platform === "darwin") {
    file = "open";
    urlArgs = [url];
  } else if (platform === "win32") {
    file = "powershell.exe";
    const psUrl = url.replace(/'/g, "''");
    urlArgs = ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", `Start-Process '${psUrl}'`];
  } else {
    file = "xdg-open";
    urlArgs = [url];
  }
  const {
    cmd,
    args
  } = (0, _anysphere_utils__WEBPACK_IMPORTED_MODULE_1__ /* .findActualExecutable */.Ef)(file, urlArgs);
  if (cmd === file) {
    throw new Error("Can't find a way to open browser");
  }
  return {
    cmd,
    args
  };
}
function openBrowser(url) {
  // Validate that the URL is a web link (http:// or https://)
  if (!isValidWebUrl(url)) {
    return Promise.reject(new Error(`Invalid URL: Only web links (http:// and https://) are supported. Received: ${url}`));
  }
  if (process.env.NO_OPEN_BROWSER) {
    return Promise.reject(new Error("Browser opening disabled"));
  }
  const runningInSsh = (0, _terminal_theme_js__WEBPACK_IMPORTED_MODULE_2__ /* .isLikelySshSession */.lf)();
  if (runningInSsh) {
    return Promise.reject(new Error(`Cannot open browser in SSH session`));
  }
  return new Promise((resolve, reject) => {
    const {
      cmd,
      args
    } = getBrowserInvocation(url);
    const child = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)(cmd, args, {
      stdio: "ignore",
      windowsHide: true
    });
    child.once("error", err => {
      reject(new Error(`Failed to open browser: ${err.message}`));
    });
    // NB: We don't care when this process exits, only that it started
    // relatively successfully. xdg-open will block sometimes and that's Bad
    child.once("spawn", () => resolve());
  });
}
/**
 * Validates that a URL is a valid web link (http:// or https://).
 * This prevents opening potentially dangerous protocols like file://, javascript:, etc.
 */
function isValidWebUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_a) {
    // If URL parsing fails, it's not a valid URL
    return false;
  }
}

/***/