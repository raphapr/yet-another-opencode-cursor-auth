/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildFileChanges: () => (/* binding */ buildFileChanges),
/* harmony export */   buildUnifiedDiff: () => (/* binding */ buildUnifiedDiff),
/* harmony export */   collectGitStatuses: () => (/* binding */ collectGitStatuses)
/* harmony export */ });
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_3__);




const buildUnifiedDiff = (changes) => {
    const tmpRoot = node_fs__WEBPACK_IMPORTED_MODULE_1___default().mkdtempSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().join(node_os__WEBPACK_IMPORTED_MODULE_2___default().tmpdir(), "delta-full-"));
    const beforeRoot = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(tmpRoot, "before");
    const afterRoot = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(tmpRoot, "after");
    node_fs__WEBPACK_IMPORTED_MODULE_1___default().mkdirSync(beforeRoot, { recursive: true });
    node_fs__WEBPACK_IMPORTED_MODULE_1___default().mkdirSync(afterRoot, { recursive: true });
    const writeOut = (base, rel, content) => {
        const dest = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(base, rel);
        node_fs__WEBPACK_IMPORTED_MODULE_1___default().mkdirSync(node_path__WEBPACK_IMPORTED_MODULE_3___default().dirname(dest), { recursive: true });
        node_fs__WEBPACK_IMPORTED_MODULE_1___default().writeFileSync(dest, content);
    };
    for (const ch of changes) {
        const rel = node_path__WEBPACK_IMPORTED_MODULE_3___default().isAbsolute(ch.path)
            ? node_path__WEBPACK_IMPORTED_MODULE_3___default().relative(process.cwd(), ch.path)
            : ch.path;
        if (ch.before !== undefined)
            writeOut(beforeRoot, rel, ch.before);
        if (ch.after !== undefined)
            writeOut(afterRoot, rel, ch.after);
    }
    const args = [
        "diff",
        "--no-index",
        "--no-prefix",
        "--diff-algorithm=patience",
        "--unified=3",
        "--",
        "before",
        "after",
    ];
    let diffOutput = "";
    try {
        diffOutput = (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", args, { encoding: "utf8", cwd: tmpRoot });
    }
    catch (err) {
        const anyErr = err;
        if (anyErr === null || anyErr === void 0 ? void 0 : anyErr.stdout)
            diffOutput = anyErr.stdout;
        else
            throw err;
    }
    const sanitizePaths = (text) => {
        const beforeAbs = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(beforeRoot, "");
        const afterAbs = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(afterRoot, "");
        // Absolute tmp paths
        let out = text.split(beforeAbs).join("").split(afterAbs).join("");
        // Relative dir names (when using cwd) - use path.sep for cross-platform compatibility
        const beforeRel = node_path__WEBPACK_IMPORTED_MODULE_3___default().join("before", "");
        const afterRel = node_path__WEBPACK_IMPORTED_MODULE_3___default().join("after", "");
        out = out.split(beforeRel).join("").split(afterRel).join("");
        return out;
    };
    const cleaned = sanitizePaths(diffOutput);
    node_fs__WEBPACK_IMPORTED_MODULE_1___default().rmSync(tmpRoot, { recursive: true, force: true });
    return cleaned;
};
function execGit(args) {
    return (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", args, { encoding: "utf8" }).trim();
}
function readHeadFile(filePath) {
    try {
        return (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", ["show", `HEAD:${filePath}`], {
            encoding: "utf8",
        });
    }
    catch (_a) {
        return undefined;
    }
}
let repoRootCache = null;
function getRepoRoot() {
    if (repoRootCache)
        return repoRootCache;
    repoRootCache = execGit(["rev-parse", "--show-toplevel"]);
    return repoRootCache;
}
function readWorkingFile(filePath) {
    const root = getRepoRoot();
    const absPath = node_path__WEBPACK_IMPORTED_MODULE_3___default().isAbsolute(filePath)
        ? filePath
        : node_path__WEBPACK_IMPORTED_MODULE_3___default().join(root, filePath);
    try {
        return (0,node_fs__WEBPACK_IMPORTED_MODULE_1__.readFileSync)(absPath, "utf8");
    }
    catch (_a) {
        return "";
    }
}
function collectGitStatuses() {
    const diffOut = execGit(["diff", "--name-status", "HEAD"]);
    const lines = diffOut === "" ? [] : diffOut.split("\n");
    const parsed = lines.filter(Boolean).map(line => {
        var _a, _b, _c, _d, _e;
        const parts = line.split("\t");
        const raw = (_a = parts[0]) !== null && _a !== void 0 ? _a : "";
        const code = raw[0];
        if (code === "R" || code === "C") {
            const oldPath = (_b = parts[1]) !== null && _b !== void 0 ? _b : "";
            const newPath = (_c = parts[2]) !== null && _c !== void 0 ? _c : oldPath;
            return { code, path: newPath, oldPath };
        }
        return { code, path: (_e = (_d = parts[1]) !== null && _d !== void 0 ? _d : parts[0]) !== null && _e !== void 0 ? _e : "" };
    });
    // Add untracked files as added
    const untrackedOut = execGit([
        "ls-files",
        "--others",
        "--exclude-standard",
    ]);
    const untracked = untrackedOut === "" ? [] : untrackedOut.split("\n");
    for (const p of untracked) {
        if (p)
            parsed.push({ code: "A", path: p });
    }
    return parsed;
}
function buildFileChanges(statuses) {
    var _a, _b, _c;
    const changes = [];
    for (const s of statuses) {
        if (!s.path)
            continue;
        switch (s.code) {
            case "A": {
                const after = readWorkingFile(s.path);
                changes.push({ path: s.path, before: undefined, after });
                break;
            }
            case "M": {
                const before = (_a = readHeadFile(s.path)) !== null && _a !== void 0 ? _a : "";
                const after = readWorkingFile(s.path);
                changes.push({ path: s.path, before, after });
                break;
            }
            case "D": {
                const before = (_b = readHeadFile(s.path)) !== null && _b !== void 0 ? _b : "";
                changes.push({ path: s.path, before, after: undefined });
                break;
            }
            case "R": {
                const before = s.oldPath ? ((_c = readHeadFile(s.oldPath)) !== null && _c !== void 0 ? _c : "") : "";
                const after = readWorkingFile(s.path);
                changes.push({ path: s.path, before, after });
                break;
            }
            default: {
                // ignore other statuses for now
                break;
            }
        }
    }
    return changes;
}
function _createDebugFileChangeTracker(changes) {
    const accepted = new Set();
    const rejected = new Set();
    const tracker = {
        accept(path) {
            accepted.add(path);
            rejected.delete(path);
        },
        reject(path) {
            rejected.add(path);
            accepted.delete(path);
        },
        acceptAll() {
            for (const c of changes) {
                accepted.add(c.path);
                rejected.delete(c.path);
            }
        },
        rejectAll() {
            for (const c of changes) {
                rejected.add(c.path);
                accepted.delete(c.path);
            }
        },
    };
    return tracker;
}


/***/ })

};
;