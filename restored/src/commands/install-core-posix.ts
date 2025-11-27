/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */BV: () => (/* binding */installCursorAgent)
  /* harmony export */
});
/* unused harmony exports detectSystemInfo, updateSymlink, updateCursorShim, updateAgentShim */
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs");
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:os");
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_3__);
/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: we're bashin' here */
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function detectSystemInfo() {
  const platform = node_os__WEBPACK_IMPORTED_MODULE_2__.platform();
  const arch = node_os__WEBPACK_IMPORTED_MODULE_2__.arch();
  // Map platform
  let osName;
  switch (platform) {
    case "linux":
      osName = "linux";
      break;
    case "darwin":
      osName = "darwin";
      break;
    default:
      throw new Error(`Unsupported operating system: ${platform}`);
  }
  // Map architecture
  let archName;
  switch (arch) {
    case "x64":
      archName = "x64";
      break;
    case "arm64":
      archName = "arm64";
      break;
    default:
      throw new Error(`Unsupported architecture: ${arch}`);
  }
  return {
    os: osName,
    arch: archName
  };
}
function updateSymlink(installDir) {
  const binDir = node_path__WEBPACK_IMPORTED_MODULE_3__.join(node_os__WEBPACK_IMPORTED_MODULE_2__.homedir(), ".local", "bin");
  node_fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(binDir, {
    recursive: true
  });
  const sourcePath = node_path__WEBPACK_IMPORTED_MODULE_3__.join(installDir, "cursor-agent");
  const symlinkPath = node_path__WEBPACK_IMPORTED_MODULE_3__.join(binDir, "cursor-agent");
  // Remove existing symlink if it exists
  try {
    node_fs__WEBPACK_IMPORTED_MODULE_1__.unlinkSync(symlinkPath);
  } catch (_a) {
    // Ignore error if file doesn't exist
  }
  // Create symlink
  node_fs__WEBPACK_IMPORTED_MODULE_1__.symlinkSync(sourcePath, symlinkPath);
}
function updateCursorShim() {
  const binDir = node_path__WEBPACK_IMPORTED_MODULE_3__.join(node_os__WEBPACK_IMPORTED_MODULE_2__.homedir(), ".local", "bin");
  node_fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(binDir, {
    recursive: true
  });
  const shimPath = node_path__WEBPACK_IMPORTED_MODULE_3__.join(binDir, "cursor");
  const script = ["#!/bin/sh", "set -eu", "", "# Find cursor executable in PATH, excluding the current shim", "find_cursor() {", '  old_IFS="$IFS"', "  IFS=:", "  for dir in $PATH; do", '    [ -n "$dir" ] || continue', '    cursor_path="$dir/cursor"', '    if [ "$cursor_path" != "$HOME/.local/bin/cursor" ] && [ -x "$cursor_path" ]; then', '      IFS="$old_IFS"', '      echo "$cursor_path"', "      return 0", "    fi", "  done", '  IFS="$old_IFS"', "  return 1", "}", "", "OTHER_CURSOR=$(find_cursor || true)", "", 'if [ -n "${OTHER_CURSOR:-}" ]; then', '  exec "$OTHER_CURSOR" "$@"', "else", '  if [ "$1" != "agent" ]; then', "    echo \"Error: No Cursor IDE installation found. Use 'cursor agent' or 'agent' to run the agent.\" 1>&2", '    echo "Or, install Cursor at https://cursor.com/download" 1>&2', "    exit 1", "  fi", '  exec "$HOME/.local/bin/cursor-agent" "$@"', "fi", ""].join("\n");
  // Install `cursor` keyword shortcut for `cursor-agent`
  node_fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync(shimPath, script, {
    mode: 0o755
  });
  try {
    node_fs__WEBPACK_IMPORTED_MODULE_1__.chmodSync(shimPath, 0o755);
  } catch (_a) {
    /* ignore */
  }
}
function updateAgentShim() {
  const binDir = node_path__WEBPACK_IMPORTED_MODULE_3__.join(node_os__WEBPACK_IMPORTED_MODULE_2__.homedir(), ".local", "bin");
  node_fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(binDir, {
    recursive: true
  });
  const shimPath = node_path__WEBPACK_IMPORTED_MODULE_3__.join(binDir, "agent");
  const script = ["#!/bin/sh", "set -eu", "", "# agent alias just calls cursor-agent", 'exec "$HOME/.local/bin/cursor-agent" "$@"', ""].join("\n");
  // Install `agent` alias for `cursor-agent`
  node_fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync(shimPath, script, {
    mode: 0o755
  });
  try {
    node_fs__WEBPACK_IMPORTED_MODULE_1__.chmodSync(shimPath, 0o755);
  } catch (_a) {
    /* ignore */
  }
}
function installCursorAgent(options) {
  return __awaiter(this, void 0, void 0, function* () {
    const {
      version,
      urlPrefix,
      showProgress = false
    } = options;
    // Detect system
    const {
      os: osName,
      arch: archName
    } = detectSystemInfo();
    // Create installation paths
    const versionsDir = node_path__WEBPACK_IMPORTED_MODULE_3__.join(node_os__WEBPACK_IMPORTED_MODULE_2__.homedir(), ".local", "share", "cursor-agent", "versions");
    const finalInstallDir = node_path__WEBPACK_IMPORTED_MODULE_3__.join(versionsDir, version);
    const tempInstallDir = node_path__WEBPACK_IMPORTED_MODULE_3__.join(versionsDir, `.${version}`);
    // Check if the target directory already exists
    if (node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync(finalInstallDir)) {
      // Directory already exists, just update the symlink
      updateSymlink(finalInstallDir);
      updateCursorShim();
      updateAgentShim();
      return;
    }
    // Clean up any existing temp directory
    try {
      node_fs__WEBPACK_IMPORTED_MODULE_1__.rmSync(tempInstallDir, {
        recursive: true,
        force: true
      });
    } catch (_a) {
      /* ignore */
    }
    // Create temp directory
    node_fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync(tempInstallDir, {
      recursive: true
    });
    // Download and extract package
    const urlPrefixWithSlash = urlPrefix.endsWith("/") ? urlPrefix : `${urlPrefix}/`;
    const downloadUrl = `${urlPrefixWithSlash}${osName}/${archName}/agent-cli-package.tar.gz`;
    try {
      const curlArgs = showProgress ? ["-fSL", "--progress-bar", downloadUrl] : ["-fSL", "-s", downloadUrl];
      yield new Promise((resolve, reject) => {
        const stderrMode = options.showProgress ? "inherit" : "ignore";
        // Start tar first so we can pipe into its stdin
        const tarProc = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)("tar", ["--strip-components=1", "-xzf", "-", "-C", tempInstallDir], {
          stdio: ["pipe", "ignore", stderrMode]
        });
        const curlProc = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)("curl", curlArgs, {
          stdio: ["ignore", "pipe", stderrMode]
        });
        curlProc.stdout.pipe(tarProc.stdin);
        let curlExitCode = null;
        let tarExitCode = null;
        let settled = false;
        const trySettle = () => {
          if (curlExitCode === null || tarExitCode === null || settled) return;
          settled = true;
          if (curlExitCode !== 0) {
            reject(new Error(`Download failed (curl exit ${curlExitCode})`));
            return;
          }
          if (tarExitCode !== 0) {
            reject(new Error(`Extraction failed (tar exit ${tarExitCode})`));
            return;
          }
          resolve();
        };
        curlProc.on("error", err => {
          if (settled) return;
          settled = true;
          // Ensure tar is not left hanging
          try {
            tarProc.kill("SIGTERM");
          } catch (_a) {
            /* ignore */
          }
          reject(err);
        });
        tarProc.on("error", err => {
          if (settled) return;
          settled = true;
          try {
            curlProc.kill("SIGTERM");
          } catch (_a) {
            /* ignore */
          }
          reject(err);
        });
        curlProc.on("close", code => {
          var _a;
          curlExitCode = code !== null && code !== void 0 ? code : 1;
          // Close tar stdin when curl finishes
          try {
            (_a = tarProc.stdin) === null || _a === void 0 ? void 0 : _a.end();
          } catch (_b) {
            /* ignore */
          }
          if (curlExitCode !== 0) {
            // If curl failed, terminate tar to unblock quickly
            try {
              tarProc.kill("SIGTERM");
            } catch (_c) {
              /* ignore */
            }
          }
          trySettle();
        });
        tarProc.on("close", code => {
          tarExitCode = code !== null && code !== void 0 ? code : 1;
          if (tarExitCode !== 0) {
            // If extraction failed, stop curl
            try {
              curlProc.kill("SIGTERM");
            } catch (_a) {
              /* ignore */
            }
          }
          trySettle();
        });
      });
      // If final directory exists, remove it first
      try {
        node_fs__WEBPACK_IMPORTED_MODULE_1__.rmSync(finalInstallDir, {
          recursive: true,
          force: true
        });
      } catch (_b) {
        /* ignore */
      }
      // Atomically rename temp directory to final directory
      node_fs__WEBPACK_IMPORTED_MODULE_1__.renameSync(tempInstallDir, finalInstallDir);
    } catch (error) {
      // Clean up temp directory on failure
      try {
        node_fs__WEBPACK_IMPORTED_MODULE_1__.rmSync(tempInstallDir, {
          recursive: true,
          force: true
        });
      } catch (_c) {
        /* ignore */
      }
      throw new Error(`Download failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    // Update symlink
    updateSymlink(finalInstallDir);
    updateCursorShim();
    updateAgentShim();
  });
}

/***/