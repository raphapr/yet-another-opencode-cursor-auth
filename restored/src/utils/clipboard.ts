/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */w: () => (/* binding */tryReadClipboardImageToTemp)
  /* harmony export */
});
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
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/debug.ts");
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
function execFileBuffer(file, args, options = {}) {
  const {
    timeoutMs = 4000
  } = options;
  return new Promise((resolve, reject) => {
    var _a, _b;
    const child = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFile)(file, Array.from(args), {
      encoding: "buffer",
      timeout: timeoutMs,
      maxBuffer: 50 * 1024 * 1024
    });
    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", d => {
      stdout = Buffer.concat([stdout, d]);
    });
    (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", d => {
      stderr = Buffer.concat([stderr, d]);
    });
    child.on("error", err => reject(err));
    child.on("close", (code, signal) => {
      if (code === 0) return resolve(stdout);
      const err = new Error(`execFile ${file} ${args.join(" ")} failed code=${String(code)} signal=${String(signal)} stderr=${stderr.toString("utf8")}`);
      reject(err);
    });
  });
}
function tryAppleScriptWrite(filePath, utiClass) {
  return __awaiter(this, void 0, void 0, function* () {
    const script = ["try", `  set theData to the clipboard as «class ${utiClass}»`, `  set thePath to POSIX file "${filePath.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`, "  set outFile to open for access thePath with write permission", "  set eof outFile to 0", "  write theData to outFile", "  close access outFile", '  return "OK"', "on error errMsg number errNum", '  return "ERROR: " & errNum & " " & errMsg', "end try"];
    try {
      const out = yield execFileBuffer("osascript", script.flatMap(line => ["-e", line]), {
        timeoutMs: 5000
      });
      const s = out.toString("utf8").trim();
      if (s.startsWith("OK")) {
        const st = (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.statSync)(filePath, {
          throwIfNoEntry: false
        });
        return !!st && st.size > 0;
      }
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("osascript-non-ok", s);
      return false;
    } catch (e) {
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("osascript-error", String(e));
      return false;
    }
  });
}
function convertToPng(inPath) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const dir = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.dirname)(inPath);
      const base = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.basename)(inPath).replace(/\.(tif|tiff)$/i, "");
      const outPath = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.join)(dir, `${base}.png`);
      // Use sips to convert; -s format png; also cap max dimension to 2048 to be safe
      yield execFileBuffer("sips", ["-s", "format", "png", inPath, "--out", outPath], {
        timeoutMs: 8000
      });
      const st = (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.statSync)(outPath, {
        throwIfNoEntry: false
      });
      if (!st || st.size === 0) return null;
      return outPath;
    } catch (e) {
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("sips-convert-error", String(e));
      return null;
    }
  });
}
function tryReadClipboardImageToTemp() {
  return __awaiter(this, void 0, void 0, function* () {
    if (false)
      // removed by dead control flow
      {}
    const dirBase = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.join)((0, node_os__WEBPACK_IMPORTED_MODULE_2__.tmpdir)(), "cursor-agent-clipboard");
    try {
      (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync)(dirBase, {
        recursive: true
      });
    } catch (_a) {}
    const stamp = Date.now();
    const tryOne = (uti, ext, format) => __awaiter(this, void 0, void 0, function* () {
      const filePath = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.join)(dirBase, `clip-${stamp}.${ext}`);
      const ok = yield tryAppleScriptWrite(filePath, uti);
      if (!ok) return null;
      if (format === "tiff") {
        const converted = yield convertToPng(filePath);
        if (converted) {
          // Optionally remove original TIFF; keep to aid debugging if needed
          try {
            (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.rmSync)(filePath);
          } catch (_a) {}
          return {
            path: converted,
            format: "png"
          };
        }
        // Fall back to returning TIFF if conversion failed
      }
      return {
        path: filePath,
        format
      };
    });
    // Try PNG first, then JPEG, then TIFF (which we convert to PNG)
    const png = yield tryOne("PNGf", "png", "png");
    if (png) return png;
    const jpeg = yield tryOne("JPEG", "jpg", "jpeg");
    if (jpeg) return jpeg;
    const tiff = yield tryOne("TIFF", "tiff", "tiff");
    if (tiff) return tiff;
    return null;
  });
}

/***/