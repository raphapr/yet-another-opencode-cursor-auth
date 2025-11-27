/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleSandboxDebug: () => (/* binding */ handleSandboxDebug)
/* harmony export */ });
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs/promises");
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs_promises__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _anysphere_context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../context/dist/index.js");
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */ var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../local-exec/dist/index.js");
/* harmony import */ var _anysphere_shell_exec__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../shell-exec/dist/index.js");
/* harmony import */ var _always_deny_decision_provider_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/always-deny-decision-provider.ts");
/* harmony import */ var _console_io_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/console-io.ts");
/* harmony import */ var _shared_resources_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/shared/resources.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __addDisposableResource = (undefined && undefined.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (undefined && undefined.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};











function getWorkspaceIgnoreMapping(workspaceRoot) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a LazyIgnoreService to build mapping with ripgrep; no team settings in CLI
        const rgPath = process.env.RG_PATH || "rg";
        const ignoreService = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_6__.LazyIgnoreService(rgPath, undefined, [
            workspaceRoot,
        ]);
        const cursorMapping = yield ignoreService.getCursorIgnoreMapping();
        return Object.assign({}, cursorMapping);
    });
}
function handleSandboxDebug(ctx, cmd, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const span = __addDisposableResource(env_1, (0,_anysphere_context__WEBPACK_IMPORTED_MODULE_4__/* .createSpan */ .VI)(ctx.withName("handleSandboxDebug")), false);
            const allowRw = String(options.allowPaths || "")
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            const allowRo = String(options.readonlyPaths || "")
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            const blockedPatterns = String(options.blockedPatterns || "")
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            // Load file-based ignore patterns across the entire workspace
            const cwd = process.cwd();
            const resolveWorkspaceRoot = (dir) => {
                try {
                    const out = (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", ["rev-parse", "--show-toplevel"], {
                        cwd: dir,
                        stdio: ["ignore", "pipe", "ignore"],
                    });
                    const root = out.toString("utf8").trim();
                    if (root && root.length > 0)
                        return root;
                }
                catch (_a) {
                    // ignore
                }
                return (0,_anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_5__/* .getProjectDir */ .Xq)(dir);
            };
            const projectRoot = resolveWorkspaceRoot(cwd);
            // Fetch workspace ignore mapping from LocalIgnoreService and union CLI-provided blocklist at root
            const baseMapping = yield getWorkspaceIgnoreMapping(projectRoot);
            const extra = (0,_anysphere_shell_exec__WEBPACK_IMPORTED_MODULE_7__/* .createIgnoreMapping */ .nq)(blockedPatterns, projectRoot);
            const ignoreMapping = Object.assign(Object.assign({}, baseMapping), extra);
            const debugDir = options.sbDebug
                ? `${node_os__WEBPACK_IMPORTED_MODULE_2__.tmpdir()}/cursor-sandbox-${Date.now()}`
                : undefined;
            if (debugDir && debugDir.length > 0) {
                try {
                    yield node_fs_promises__WEBPACK_IMPORTED_MODULE_1__.mkdir(debugDir, { recursive: true });
                }
                catch (_d) {
                    (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Error creating debug directory: ${debugDir}`);
                }
            }
            // Reconstruct the command string for analysis
            const command = args && args.length > 0 ? `${cmd} ${args.join(" ")}` : cmd;
            try {
                // Use shared builder to mirror CLI setup (for dry-run only)
                const configProvider = yield _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_5__/* .FileBasedConfigProvider */ .FO.loadFromDefaults();
                const dryRunDecisionProvider = new _always_deny_decision_provider_js__WEBPACK_IMPORTED_MODULE_10__/* .AlwaysDenyDecisionProvider */ .N();
                yield (0,_shared_resources_js__WEBPACK_IMPORTED_MODULE_8__/* .buildCliResources */ ._)(span.ctx, {
                    configProvider,
                    decisionProvider: dryRunDecisionProvider,
                    workingDirectory: process.cwd(),
                    getIsAutoRun: () => false,
                });
                // Now execute the command using the same path as the CLI (local-exec)
                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Executing command: ${command}`);
                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Working directory: ${process.cwd()}`);
                const policy = options.sandbox
                    ? {
                        type: "workspace_readwrite",
                        network_access: !!options.network,
                        additional_readwrite_paths: allowRw,
                        additional_readonly_paths: allowRo,
                        debugOutputDir: debugDir,
                        ignore_mapping: ignoreMapping,
                        block_git_writes: true,
                    }
                    : { type: "insecure_none", debugOutputDir: debugDir };
                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Sandbox policy: ${JSON.stringify(policy, null, 2)}\n`);
                const terminalExecutor = (0,_anysphere_shell_exec__WEBPACK_IMPORTED_MODULE_7__/* .createDefaultTerminalExecutor */ .Fn)();
                const core = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_6__.BaseShellCoreExecutor(terminalExecutor);
                let stdout = "";
                let stderr = "";
                let exitCode = null;
                let denyEventsCaptured = [];
                try {
                    for (var _e = true, _f = __asyncValues(core.execute(span.ctx, {
                        command,
                        workingDirectory: process.cwd(),
                        timeout: 30000,
                        sandboxPolicy: policy,
                        captureSandboxDenies: true,
                    })), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
                        _c = _g.value;
                        _e = false;
                        const event = _c;
                        if (event.type === "stdout")
                            stdout += event.data;
                        else if (event.type === "stderr")
                            stderr += event.data;
                        else if (event.type === "exit")
                            exitCode = event.code;
                        else if (event.type === "sandbox_denies")
                            denyEventsCaptured = event.events;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // Save full outputs to debug dir if available
                let savedStdoutPath = "";
                let savedStderrPath = "";
                if (debugDir) {
                    const ts = new Date().toISOString().replace(/[:.]/g, "-");
                    savedStdoutPath = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(debugDir, `stdout-${ts}.log`);
                    savedStderrPath = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(debugDir, `stderr-${ts}.log`);
                    try {
                        yield node_fs_promises__WEBPACK_IMPORTED_MODULE_1__.writeFile(savedStdoutPath, stdout !== null && stdout !== void 0 ? stdout : "");
                        yield node_fs_promises__WEBPACK_IMPORTED_MODULE_1__.writeFile(savedStderrPath, stderr !== null && stderr !== void 0 ? stderr : "");
                    }
                    catch (_h) {
                        // ignore
                    }
                }
                const tail = (text, n) => {
                    const lines = (text || "").split(/\r?\n/);
                    const last = lines.slice(-n).join("\n");
                    return last;
                };
                if (exitCode === 0) {
                    (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\n=== COMMAND SUCCESS ===`);
                    (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Exit code: 0`);
                    if (stdout) {
                        const t = tail(stdout, 500);
                        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\nSTDOUT (last 500 lines):\n${t}`);
                        if (debugDir && savedStdoutPath)
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Full STDOUT saved to: ${savedStdoutPath}`);
                    }
                    if (stderr) {
                        const t = tail(stderr, 500);
                        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\nSTDERR (last 500 lines):\n${t}`);
                        if (debugDir && savedStderrPath)
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Full STDERR saved to: ${savedStderrPath}`);
                    }
                }
                else {
                    (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\n=== COMMAND FAILURE ===`);
                    (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Exit code: ${exitCode !== null && exitCode !== void 0 ? exitCode : -1}`);
                    if (stdout) {
                        const t = tail(stdout, 500);
                        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\nSTDOUT (last 500 lines):\n${t}`);
                        if (debugDir && savedStdoutPath)
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Full STDOUT saved to: ${savedStdoutPath}`);
                    }
                    if (stderr) {
                        const t = tail(stderr, 500);
                        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\nSTDERR (last 500 lines):\n${t}`);
                        if (debugDir && savedStderrPath)
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Full STDERR saved to: ${savedStderrPath}`);
                    }
                }
                // Display sandbox denies if any were captured
                if (denyEventsCaptured.length > 0) {
                    try {
                        const grouped = new Map();
                        for (const ev of denyEventsCaptured) {
                            const { processName, operation, target, timestamp, relationship } = ev;
                            if (!processName || !operation || !target || !timestamp)
                                continue;
                            const key = `${processName}|||${operation}|||${target}`;
                            const existing = grouped.get(key);
                            if (!existing) {
                                grouped.set(key, {
                                    processName,
                                    timestamp,
                                    operation,
                                    target,
                                    relationship,
                                });
                            }
                            else {
                                // Keep earliest timestamp
                                if (new Date(timestamp).getTime() <
                                    new Date(existing.timestamp).getTime()) {
                                    grouped.set(key, {
                                        processName,
                                        timestamp,
                                        operation,
                                        target,
                                        relationship,
                                    });
                                }
                            }
                        }
                        // Sort events by relationship into three sections
                        const rows = Array.from(grouped.values());
                        const relatedEvents = rows.filter(r => r.relationship === "related");
                        const maybeRelatedEvents = rows.filter(r => r.relationship === "maybe_related");
                        const probablyUnrelatedEvents = rows.filter(r => r.relationship === "probably_unrelated");
                        // Sort each section
                        const sortEvents = (events) => events.sort((a, b) => a.processName.localeCompare(b.processName) ||
                            a.operation.localeCompare(b.operation) ||
                            a.target.localeCompare(b.target) ||
                            a.timestamp.localeCompare(b.timestamp));
                        const sortedRelated = sortEvents(relatedEvents);
                        const sortedMaybeRelated = sortEvents(maybeRelatedEvents);
                        const sortedProbablyUnrelated = sortEvents(probablyUnrelatedEvents);
                        const headers = ["process", "timestamp", "action", "target"];
                        // Calculate global column widths based on all data
                        const allData = [
                            ...sortedRelated.map(r => [
                                r.processName,
                                r.timestamp,
                                r.operation,
                                r.target,
                            ]),
                            ...sortedMaybeRelated.map(r => [
                                r.processName,
                                r.timestamp,
                                r.operation,
                                r.target,
                            ]),
                            ...sortedProbablyUnrelated.map(r => [
                                r.processName,
                                r.timestamp,
                                r.operation,
                                r.target,
                            ]),
                        ];
                        const widths = headers.map((h, i) => Math.max(h.length, ...allData.map(row => { var _a, _b; return (_b = (_a = row[i]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0; })));
                        const fmt = (vals) => vals.map((v, i) => (v !== null && v !== void 0 ? v : "").padEnd(widths[i])).join("  ");
                        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\n=== SANDBOX DENIES ===`);
                        // Display Related Events
                        if (sortedRelated.length > 0) {
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\n🔴 RELATED EVENTS (${sortedRelated.length}):`);
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(fmt(headers));
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(widths.map(w => "-".repeat(w)).join("  "));
                            for (const row of sortedRelated) {
                                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(fmt([row.processName, row.timestamp, row.operation, row.target]));
                            }
                        }
                        // Display Maybe Related Events
                        if (sortedMaybeRelated.length > 0) {
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\n🟡 MAYBE RELATED EVENTS (${sortedMaybeRelated.length}):`);
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(fmt(headers));
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(widths.map(w => "-".repeat(w)).join("  "));
                            for (const row of sortedMaybeRelated) {
                                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(fmt([row.processName, row.timestamp, row.operation, row.target]));
                            }
                        }
                        // Display Probably Unrelated Events
                        if (sortedProbablyUnrelated.length > 0) {
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\n🟢 PROBABLY UNRELATED EVENTS (${sortedProbablyUnrelated.length}):`);
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(fmt(headers));
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(widths.map(w => "-".repeat(w)).join("  "));
                            for (const row of sortedProbablyUnrelated) {
                                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(fmt([row.processName, row.timestamp, row.operation, row.target]));
                            }
                        }
                        if (rows.length === 0) {
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`No denies captured`);
                        }
                    }
                    catch (e) {
                        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Failed to display sandbox denies: ${e}`);
                    }
                }
                // List debug files if debug directory was created
                if (debugDir) {
                    try {
                        const files = yield node_fs_promises__WEBPACK_IMPORTED_MODULE_1__.readdir(debugDir);
                        if (files.length > 0) {
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\n=== DEBUG FILES CREATED ===`);
                            for (const file of files) {
                                const fullPath = node_path__WEBPACK_IMPORTED_MODULE_3___default().join(debugDir, file);
                                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`  ${fullPath}`);
                            }
                        }
                        else {
                            (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`\nNo debug files created in: ${debugDir}`);
                        }
                    }
                    catch (err) {
                        (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Error reading debug directory: ${err}`);
                    }
                }
            }
            catch (err) {
                (0,_console_io_js__WEBPACK_IMPORTED_MODULE_9__/* .intentionallyWriteToStdout */ .OT)(`Failed to execute command: ${err}`);
                process.exit(1);
            }
        }
        catch (e_2) {
            env_1.error = e_2;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    });
}


/***/ })

};
;