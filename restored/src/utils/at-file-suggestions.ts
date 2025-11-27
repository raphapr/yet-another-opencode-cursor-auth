/*
  At-file suggestions index for the @-palette

  Why
  - Provide sub-16ms, per-keystroke path suggestions without touching disk or spawning processes.
  - This is NOT a content index; we only cache file and directory paths for fast filtering.

  How
  - One-time, concurrent enumeration of candidates scoped to process.cwd() (or options.cwd):
    1) ripgrep: rg --files [--hidden] --follow --max-depth <N>
    2) git:    git ls-files -co --exclude-standard (honors .gitignore)
    3) node:   directory walk as a last-resort fallback
  - As results stream in we normalize to POSIX-style paths, represent directories with a trailing '/',
    publish periodic snapshots to listeners, and on finalize deduplicate + sort the union across strategies.

  Usage
  - ensureFileIndex() starts indexing once per session; subsequent calls no-op while building/ready.
  - getAtFileSuggestions(fragment) filters state.paths in-memory via fuzzyScore; keystrokes do zero I/O.
  - getDefaultSuggestions() uses the index when ready, otherwise a shallow cwd read + optional git check-ignore.

  Characteristics
  - Latency: keystrokes are in-memory; indexers stream and respect AT_FILE_INDEX_TIMEOUT_MS.
  - Memory: O(#paths). With maxFiles ≈ 20k (+dirs), expect single-digit MBs in typical repos.
  - Scope: strictly to cwd to avoid surfacing files outside the active folder.

  Out of scope
  - Content search/grep: execute ripgrep on demand; do not build a content index here.
  - Live watching: we currently build once; callers can request a rebuild if needed.

  Observability
  - debugLog('atFileSuggestions.index.*'), getAtFileIndexStatus(), onAtFileIndexUpdate().
*/
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
const execFileAsync = (0, external_node_util_.promisify)(external_node_child_process_.execFile);
// Ratio of default suggestions to reserve for recent files
const RECENT_FILES_RATIO = 0.3;
const RECENT_FILES_SCORE_OFFSET = 100000;
// Helper to execute a command and return stdout
function execCommand(command_1, args_1, cwd_1) {
  return __awaiter(this, arguments, void 0, function* (command, args, cwd, timeout = 2000) {
    try {
      const {
        stdout
      } = yield execFileAsync(command, args, {
        cwd,
        timeout,
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
      });
      return stdout;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Command failed: ${message}`);
    }
  });
}
// Helper to execute a command and return success status
function execCommandStatus(command_1, args_1, cwd_1) {
  return __awaiter(this, arguments, void 0, function* (command, args, cwd, timeout = 2000) {
    try {
      yield execFileAsync(command, args, {
        cwd,
        timeout,
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
      });
      return true;
    } catch (_a) {
      return false;
    }
  });
}
// Session-scoped ripgrep path set by ensureFileIndex; default to system 'rg'
let sessionRgPath = "rg";
const state = {
  ready: false,
  paths: [],
  building: false,
  startedAt: null,
  baseDir: null,
  strategies: new Set(),
  lastReason: null,
  lastDurationMs: null,
  sessionId: null
};
let _sessionCounter = 0;
const listeners = new Set();
function onAtFileIndexUpdate(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function notifyIndexUpdate() {
  for (const l of Array.from(listeners)) {
    try {
      l();
    } catch (_a) {
      /* noop */
    }
  }
}
function getAtFileIndexStatus() {
  const totalPaths = state.paths.length;
  let totalFiles = 0;
  for (const p of state.paths) if (!p.endsWith("/")) totalFiles++;
  const elapsedMs = state.startedAt && state.building ? Date.now() - state.startedAt : null;
  return {
    building: state.building,
    ready: state.ready,
    totalPaths,
    totalFiles,
    strategies: Array.from(state.strategies),
    baseDir: state.baseDir,
    elapsedMs,
    lastReason: state.lastReason,
    lastDurationMs: state.lastDurationMs
  };
}
function resolveBaseDir(preferred) {
  // Scope indexing strictly to the caller's current working directory
  // to avoid surfacing files outside the active folder.
  return preferred !== null && preferred !== void 0 ? preferred : process.cwd();
}
function ensureFileIndex() {
  return __awaiter(this, arguments, void 0, function* (options = {}) {
    var _a, _b, _c, _d;
    if (state.ready || state.building) return;
    state.building = true;
    state.startedAt = Date.now();
    const cwd = resolveBaseDir(options.cwd);
    state.baseDir = cwd;
    const maxFiles = (_a = options.maxFiles) !== null && _a !== void 0 ? _a : 20000;
    const maxDepth = (_b = options.maxDepth) !== null && _b !== void 0 ? _b : 16;
    const includeHidden = (_c = options.includeHidden) !== null && _c !== void 0 ? _c : false;
    // Capture rgPath for this indexing session if provided
    if (options.rgPath && options.rgPath.length > 0) {
      sessionRgPath = options.rgPath;
    }
    const timeoutMs = Number((_d = process.env.AT_FILE_INDEX_TIMEOUT_MS) !== null && _d !== void 0 ? _d : "8000");
    (0, debug.debugLog)("atFileSuggestions.index.start", {
      cwd,
      maxFiles,
      maxDepth,
      includeHidden,
      timeoutMs
    });
    // Session-scoped aggregation to avoid races and overwrites.
    const sessionId = ++_sessionCounter;
    state.sessionId = sessionId;
    const aggFiles = new Set();
    const aggDirs = new Set();
    const childProcs = [];
    const timers = [];
    const sessionDeadline = Date.now() + timeoutMs;
    let finalized = false;
    let lastPublishCount = 0;
    const registerProc = p => {
      childProcs.push(p);
    };
    const publishAggregator = () => {
      if (finalized || state.sessionId !== sessionId) return;
      const count = aggFiles.size + aggDirs.size;
      if (count <= 64 || count - lastPublishCount >= 256) {
        state.paths = Array.from(aggFiles).concat(Array.from(aggDirs));
        lastPublishCount = count;
        notifyIndexUpdate();
      }
    };
    const addToAggregator = (files, dirs) => {
      if (finalized || state.sessionId !== sessionId) return;
      for (const f of files) aggFiles.add(f);
      for (const d of dirs) aggDirs.add(d);
      publishAggregator();
    };
    const finalize = reason => {
      if (finalized) return;
      finalized = true;
      for (const t of timers) clearTimeout(t);
      for (const p of childProcs) {
        try {
          p.kill();
        } catch (_a) {
          /* ignore */
        }
      }
      // Recompute directory hierarchy from files to ensure all parent folders exist
      const allFiles = Array.from(aggFiles);
      const dirSet = new Set();
      for (const file of allFiles) {
        let dir = (0, external_node_path_.dirname)(file);
        while (dir && dir !== ".") {
          dirSet.add(`${dir}/`);
          dir = (0, external_node_path_.dirname)(dir);
        }
      }
      const existing = new Set(state.paths);
      for (const p of allFiles) existing.add(p);
      for (const d of dirSet) existing.add(d);
      const allPaths = Array.from(existing);
      state.paths = allPaths.sort((a, b) => {
        const aDir = a.endsWith("/");
        const bDir = b.endsWith("/");
        if (aDir !== bDir) {
          const aBase = aDir ? a.slice(0, -1) : a;
          const bBase = bDir ? b.slice(0, -1) : b;
          if (aBase === bBase || aBase.startsWith(`${bBase}/`) || bBase.startsWith(`${aBase}/`)) {
            return aDir ? -1 : 1;
          }
        }
        return a.localeCompare(b, undefined, {
          sensitivity: "base"
        });
      });
      state.ready = true;
      state.building = false;
      const duration = state.startedAt ? Date.now() - state.startedAt : undefined;
      state.lastReason = reason;
      state.lastDurationMs = duration !== null && duration !== void 0 ? duration : null;
      state.strategies.clear();
      (0, debug.debugLog)("atFileSuggestions.index.done", {
        reason,
        durationMs: duration,
        total: state.paths.length
      });
      notifyIndexUpdate();
    };
    const isGitRepo = () => __awaiter(this, void 0, void 0, function* () {
      try {
        return yield execCommandStatus("git", ["rev-parse", "--is-inside-work-tree"], cwd);
      } catch (_a) {
        return false;
      }
    });
    let rgStarted = false;
    let gitStarted = false;
    let nodeStarted = false;
    const maybeFinalize = reason => {
      if (finalized) return;
      if (state.strategies.size === 0) finalize(reason);
    };
    const startRgIndexer = () => {
      if (rgStarted) return;
      rgStarted = true;
      state.strategies.add("rg");
      notifyIndexUpdate();
      const args = ["--files", "--follow", "--max-depth", String(maxDepth), "--no-messages"];
      if (includeHidden) args.push("--hidden");
      const rg = (0, external_node_child_process_.spawn)(sessionRgPath, args, {
        cwd
      });
      registerProc(rg);
      const files = [];
      const dirSet = new Set();
      let buf = "";
      let done = false;
      const publish = () => {
        addToAggregator(files, dirSet);
      };
      const onDone = why => {
        if (done) return;
        done = true;
        try {
          rg.kill();
        } catch (_a) {
          /* ignore */
        }
        // Ensure latest batch is merged
        addToAggregator(files, dirSet);
        state.strategies.delete("rg");
        maybeFinalize(`rg:${why}`);
      };
      const timer = setTimeout(() => onDone("timeout"), timeoutMs);
      timers.push(timer);
      rg.stdout.setEncoding("utf8");
      rg.stdout.on("data", chunk => {
        if (finalized || state.sessionId !== sessionId) return;
        buf += chunk;
        let idx;
        // biome-ignore lint/suspicious/noAssignInExpressions: common pattern for parsing buffers
        while ((idx = buf.indexOf("\n")) !== -1) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line) continue;
          const rel = line.split(external_node_path_.sep).join("/");
          files.push(rel);
          let d = (0, external_node_path_.dirname)(rel);
          while (d && d !== ".") {
            dirSet.add(`${d}/`);
            d = (0, external_node_path_.dirname)(d);
          }
          if (files.length <= 64 || files.length % 256 === 0) publish();
          if (files.length >= maxFiles || Date.now() > sessionDeadline) {
            clearTimeout(timer);
            onDone(files.length >= maxFiles ? "limit" : "timeout");
            return;
          }
        }
      });
      rg.on("error", err => {
        void (() => __awaiter(this, void 0, void 0, function* () {
          clearTimeout(timer);
          if (done || finalized) return;
          (0, debug.debugLog)("atFileSuggestions.rg.error", String(err));
          state.strategies.delete("rg");
          if ((yield isGitRepo()) && !gitStarted) yield startGitIndexer(true);else if (!nodeStarted) startNodeIndexer(true);
          maybeFinalize("rg:error");
        }))();
      });
      rg.on("close", code => {
        void (() => __awaiter(this, void 0, void 0, function* () {
          clearTimeout(timer);
          if (done || finalized) return;
          if (code === 0 || files.length > 0) {
            onDone("complete");
          } else {
            // Fallback only if not already running
            state.strategies.delete("rg");
            if ((yield isGitRepo()) && !gitStarted) yield startGitIndexer(true);else if (!nodeStarted) startNodeIndexer(true);
            maybeFinalize("rg:empty");
          }
        }))();
      });
    };
    const startGitIndexer = (...args_1) => __awaiter(this, [...args_1], void 0, function* (afterRg = false) {
      if (gitStarted) return;
      gitStarted = true;
      state.strategies.add("git");
      notifyIndexUpdate();
      // Restrict listing to current directory only by passing a pathspec '.'
      const args = ["ls-files", "-co", "--exclude-standard", "-z", "--", "."];
      const git = (0, external_node_child_process_.spawn)("git", args, {
        cwd
      });
      registerProc(git);
      const files = [];
      const dirSet = new Set();
      let buf = "";
      let done = false;
      const publish = () => {
        addToAggregator(files, dirSet);
      };
      const onDone = why => {
        if (done) return;
        done = true;
        try {
          git.kill();
        } catch (_a) {
          /* ignore */
        }
        addToAggregator(files, dirSet);
        state.strategies.delete("git");
        maybeFinalize(`git:${why}${afterRg ? ":fallback" : ""}`);
      };
      const timer = setTimeout(() => onDone("timeout"), timeoutMs);
      timers.push(timer);
      // Compute the path prefix from repository root to cwd so we can
      // rebase git outputs (which are repo-root relative) to cwd-relative.
      let gitPrefix = "";
      try {
        const pfx = yield execCommand("git", ["rev-parse", "--show-prefix"], cwd);
        gitPrefix = pfx.trim().split(external_node_path_.sep).join("/");
      } catch (_a) {
        /* ignore */
      }
      git.stdout.setEncoding("utf8");
      git.stdout.on("data", chunk => {
        if (finalized || state.sessionId !== sessionId) return;
        buf += chunk;
        let idx;
        // biome-ignore lint/suspicious/noAssignInExpressions: common pattern for parsing buffers
        while ((idx = buf.indexOf("\u0000")) !== -1) {
          const line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (!line) continue;
          let rel = line.split(external_node_path_.sep).join("/");
          if (gitPrefix && rel.startsWith(gitPrefix)) {
            rel = rel.slice(gitPrefix.length);
          }
          // Guard against paths escaping the cwd scope
          if (rel.startsWith("../")) continue;
          files.push(rel);
          let d = (0, external_node_path_.dirname)(rel);
          while (d && d !== ".") {
            dirSet.add(`${d}/`);
            d = (0, external_node_path_.dirname)(d);
          }
          if (files.length <= 64 || files.length % 256 === 0) publish();
          if (files.length >= maxFiles || Date.now() > sessionDeadline) {
            clearTimeout(timer);
            onDone(files.length >= maxFiles ? "limit" : "timeout");
            return;
          }
        }
      });
      git.on("error", err => {
        clearTimeout(timer);
        if (done || finalized) return;
        done = true;
        (0, debug.debugLog)("atFileSuggestions.git.error", String(err));
        state.strategies.delete("git");
        if (!nodeStarted) startNodeIndexer(afterRg);
        maybeFinalize("git:error");
      });
      git.on("close", code => {
        clearTimeout(timer);
        if (done || finalized) return;
        if (code === 0 || files.length > 0) {
          onDone("complete");
        } else {
          state.strategies.delete("git");
          if (!nodeStarted) startNodeIndexer(afterRg);
          maybeFinalize("git:empty");
        }
      });
    });
    const startNodeIndexer = (afterPrev = false) => {
      if (nodeStarted) return;
      nodeStarted = true;
      state.strategies.add("node");
      notifyIndexUpdate();
      const ignore = new Set([".git", "node_modules", "out", "dist", "build", "target", ".next", ".cache", "venv", ".venv"]);
      const queue = [""];
      let aborted = false;
      const maxConcurrent = 8;
      const worker = () => __awaiter(this, void 0, void 0, function* () {
        while (!finalized) {
          const relDir = queue.shift();
          if (relDir === undefined) break;
          const depth = relDir ? relDir.split("/").filter(Boolean).length : 0;
          if (depth > maxDepth) continue;
          const abs = relDir ? (0, external_node_path_.join)(cwd, relDir) : cwd;
          let entries;
          try {
            entries = yield external_node_fs_.promises.readdir(abs, {
              withFileTypes: true
            });
          } catch (_a) {
            continue;
          }
          const batch = [];
          const dirSet = new Set();
          for (const entry of entries) {
            if (finalized) {
              aborted = true;
              break;
            }
            const name = entry.name;
            if (!includeHidden && name.startsWith(".")) continue;
            if (ignore.has(name)) continue;
            const pathRel = relDir ? (0, external_node_path_.join)(relDir, name) : name;
            if (entry.isDirectory()) {
              queue.push(pathRel + external_node_path_.sep);
            } else {
              batch.push(pathRel);
              let d = (0, external_node_path_.dirname)(pathRel);
              while (d && d !== ".") {
                dirSet.add(`${d}/`);
                d = (0, external_node_path_.dirname)(d);
              }
              if (aggFiles.size + batch.length >= maxFiles) {
                aborted = true;
                break;
              }
            }
          }
          if (batch.length > 0) addToAggregator(batch, dirSet);
          if (Date.now() > sessionDeadline || aggFiles.size >= maxFiles) {
            aborted = true;
            break;
          }
        }
      });
      Promise.all(Array.from({
        length: maxConcurrent
      }, () => worker())).then(() => {
        state.strategies.delete("node");
        maybeFinalize(`node:${aborted ? "timeout" : "complete"}${afterPrev ? ":fallback" : ""}`);
      }).catch(() => {
        state.strategies.delete("node");
        maybeFinalize(`node:error${afterPrev ? ":fallback" : ""}`);
      });
    };
    try {
      // Run rg for broad coverage (includes nested repos), and git for speed/honor .gitignore
      startRgIndexer();
      if (yield isGitRepo()) {
        yield startGitIndexer(true);
      }
    } catch (err) {
      (0, debug.debugLog)("atFileSuggestions.index.start.error", String(err));
      startNodeIndexer();
    }
  });
}
function score(candidate, needle) {
  // Directories have trailing '/'; strip for matching but bias them slightly (+5) so they appear before sibling files when equal.
  const isDir = candidate.endsWith("/");
  const base = isDir ? candidate.slice(0, -1) : candidate;
  if (!needle) return 1 + (isDir ? 5 : 0); // neutral base score
  // Fuzzy score using shared util
  const s = (0, fuzzy /* fuzzyScore */.dt)(base, needle);
  if (s <= 0) return 0;
  return s + (isDir ? 5 : 0);
}
// Load recent files from ~/.cursor/ide_state.json and promote matching ones that exist under current cwd
function getRecentFiles() {
  try {
    const home = external_node_os_default().homedir();
    const filePath = (0, external_node_path_.join)(home, ".cursor", "ide_state.json");
    const raw = (0, external_node_fs_.readFileSync)(filePath, "utf8");
    const ideState = agent_service_pb /* IdeEditorsStateLite */.m_.fromJsonString(raw);
    return ideState.recentlyViewedFiles.filter(f => f.relativePath && f.absolutePath && f.absolutePath.startsWith(process.cwd())).map(f => f.relativePath);
  } catch (_a) {
    return [];
  }
}
function getAtFileSuggestions(fragment_1) {
  return __awaiter(this, arguments, void 0, function* (fragment, limit = 50) {
    const clean = fragment.trim().replace(/^[.[/\\]+/, "");
    if (!clean) return getDefaultSuggestions(limit);
    yield ensureFileIndex();
    const suggestions = [];
    const paths = state.paths.length > 0 ? state.paths : [];
    // Track all paths we've added to avoid duplicates (case-insensitive)
    const seenPaths = new Set();
    try {
      const recent = [];
      for (const f of getRecentFiles()) {
        const s = score(f, clean);
        if (s > 0) recent.push(f);
        if (recent.length >= limit) break;
      }
      // Add recent files first (with deduplication)
      for (const r of recent) {
        const lowerPath = r.toLowerCase();
        if (seenPaths.has(lowerPath)) continue;
        seenPaths.add(lowerPath);
        suggestions.push({
          path: r,
          score: score(r, clean) + RECENT_FILES_SCORE_OFFSET
        });
      }
    } catch (_a) {
      /* ignore missing or invalid file */
    }
    // Add index files (with deduplication against recent files)
    for (const f of paths) {
      const lowerPath = f.toLowerCase();
      if (seenPaths.has(lowerPath)) continue;
      const s = score(f, clean);
      if (s > 0) {
        seenPaths.add(lowerPath);
        suggestions.push({
          path: f,
          score: s
        });
      }
    }
    // Add extra files from focused search (with deduplication against all previous)
    if (suggestions.length < limit && clean.length >= 3) {
      try {
        const extra = yield focusedFileNameSearch(clean, limit * 4);
        for (const p of extra) {
          const lowerPath = p.toLowerCase();
          if (seenPaths.has(lowerPath)) continue;
          const s = score(p, clean);
          if (s > 0) {
            seenPaths.add(lowerPath);
            suggestions.push({
              path: p,
              score: s
            });
          }
        }
      } catch (_b) {
        /* ignore */
      }
    }
    suggestions.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path, undefined, {
      sensitivity: "base"
    }));
    return suggestions.slice(0, limit);
  });
}
function toRelativeFromCwd(absPath) {
  return relative(process.cwd(), absPath).split(sep).join("/");
}
function getDefaultSuggestions(limit) {
  // Get recent files first
  const recentFiles = getRecentFiles();
  const suggestions = [];
  // Track all paths we've added to avoid duplicates (case-insensitive)
  const seenPaths = new Set();
  // Add recent files with higher priority
  const recentLimit = Math.floor(limit * RECENT_FILES_RATIO); // Reserve portion of limit for recent files
  for (const file of recentFiles.slice(0, recentLimit)) {
    const lowerPath = file.toLowerCase();
    if (!seenPaths.has(lowerPath)) {
      seenPaths.add(lowerPath);
      suggestions.push({
        path: file,
        score: RECENT_FILES_SCORE_OFFSET + score(file, "") // Higher base score for recent files
      });
    }
  }
  // Prefer using existing index if available to avoid I/O
  if (state.ready && state.paths.length > 0) {
    const top = [];
    for (const p of state.paths) {
      if (p.endsWith("/")) {
        const segs = p.split("/").filter(Boolean);
        const topDir = segs.length > 0 ? `${segs[0]}/` : p;
        const lowerTopDir = topDir.toLowerCase();
        if (!seenPaths.has(lowerTopDir)) {
          seenPaths.add(lowerTopDir);
          top.push(topDir);
        }
      } else {
        const idx = p.indexOf("/");
        if (idx === -1) {
          const lowerP = p.toLowerCase();
          if (!seenPaths.has(lowerP)) {
            seenPaths.add(lowerP);
            top.push(p);
          }
        } else {
          const topDir = `${p.slice(0, idx)}/`;
          const lowerTopDir = topDir.toLowerCase();
          if (!seenPaths.has(lowerTopDir)) {
            seenPaths.add(lowerTopDir);
            top.push(topDir);
          }
        }
      }
      if (top.length >= limit * 2) break;
    }
    // Add top-level items to suggestions
    for (const path of top) {
      suggestions.push({
        path,
        score: score(path, "")
      });
    }
    const out = suggestions.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path, undefined, {
      sensitivity: "base"
    })).slice(0, limit);
    (0, debug.debugLog)("atFileSuggestions.default.index", {
      count: out.length,
      recentCount: recentFiles.length
    });
    return out;
  }
  // Fallback: read immediate entries in root and filter via .gitignore when available
  try {
    const cwd = process.cwd();
    const entries = (0, external_node_fs_.readdirSync)(cwd, {
      withFileTypes: true
    });
    // Filter hidden by default for signal clarity; allow showing hidden if users type '.' later
    const includeHidden = false;
    const candidates = entries.filter(e => includeHidden || !e.name.startsWith(".")).map(e => ({
      name: e.name,
      path: e.isDirectory() ? `${e.name}${external_node_path_.sep}` : e.name,
      isDir: e.isDirectory()
    }));
    // If inside a git repo, filter out ignored entries using git check-ignore
    let filtered = candidates;
    try {
      const res = (0, external_node_child_process_.spawnSync)("git", ["rev-parse", "--is-inside-work-tree"], {
        cwd,
        stdio: "ignore"
      });
      const insideRepo = res.status === 0;
      if (insideRepo && candidates.length > 0) {
        const input = candidates.map(c => c.path).join("\u0000");
        const out = (0, external_node_child_process_.spawnSync)("git", ["check-ignore", "-z", "--stdin"], {
          cwd,
          encoding: "utf8",
          input
        });
        const ignoredSet = new Set((out.stdout || "").split("\u0000").filter(Boolean));
        filtered = candidates.filter(c => !ignoredSet.has(c.path));
        (0, debug.debugLog)("atFileSuggestions.default.gitFilter", {
          total: candidates.length,
          ignored: candidates.length - filtered.length
        });
      }
    } catch (_a) {
      // ignore git failures
    }
    // Add filtered entries to existing suggestions (with deduplication)
    for (const {
      path
    } of filtered) {
      const lowerPath = path.toLowerCase();
      if (!seenPaths.has(lowerPath)) {
        seenPaths.add(lowerPath);
        suggestions.push({
          path,
          score: score(path, "")
        });
      }
    }
    const finalSuggestions = suggestions.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path, undefined, {
      sensitivity: "base"
    })).slice(0, limit);
    (0, debug.debugLog)("atFileSuggestions.default.readdir", {
      count: finalSuggestions.length,
      recentCount: recentFiles.length
    });
    return finalSuggestions;
  } catch (_b) {
    return [];
  }
}
function buildNeedleGlob(needle) {
  // Convert to fuzzy-like glob: *u*n*i*f*i*e*d*d*r*o*p*d*o*w*n*
  // Only allow alphanumerics, dot, underscore, and hyphen (hyphen does not need to be escaped outside of a character class range)
  const safe = needle.replace(/[^A-Za-z0-9._-]/g, "");
  const parts = safe.split("").map(c => `*${c}`);
  return `${parts.join("")}*`;
}
function focusedFileNameSearch(needle, max) {
  return __awaiter(this, void 0, void 0, function* () {
    const cwd = state.baseDir || process.cwd();
    const outPaths = new Set();
    // Prefer git pathspec search when available; honors .gitignore and is fast
    try {
      // Restrict search to current directory by prefixing the repo-relative
      // path of cwd in the pathspec.
      let prefix = "";
      try {
        const prefixOutput = yield execCommand("git", ["rev-parse", "--show-prefix"], cwd);
        prefix = prefixOutput.trim().split(external_node_path_.sep).join("/");
      } catch (_a) {
        /* ignore */
      }
      // Always enable glob semantics and search across subdirectories
      // to keep behavior consistent whether at repo root or a subdirectory.
      const spec = `:(icase,glob)${prefix}**/${buildNeedleGlob(needle)}`;
      const stdout = yield execCommand("git", ["ls-files", "-co", "--exclude-standard", "-z", "--", spec], cwd);
      const arr = stdout.split("\u0000").filter(Boolean).map(p => p.split(external_node_path_.sep).join("/")).map(p => prefix && p.startsWith(prefix) ? p.slice(prefix.length) : p).filter(p => !p.startsWith("../"));
      for (const p of arr) {
        outPaths.add(p);
        if (outPaths.size >= max) break;
      }
    } catch (_b) {
      /* ignore */
    }
    if (outPaths.size < Math.max(8, Math.floor(max / 4))) {
      // Fallback to ripgrep filename glob if available
      try {
        // Limit ripgrep file listing to current directory by running in cwd
        // with a glob anchored under cwd.
        const glob = `**/${buildNeedleGlob(needle)}`;
        const stdout = yield execCommand(sessionRgPath, ["--files", "--iglob", glob], cwd);
        const arr = stdout.split("\n").filter(Boolean).map(p => p.split(external_node_path_.sep).join("/"));
        for (const p of arr) {
          outPaths.add(p);
          if (outPaths.size >= max) break;
        }
      } catch (_c) {
        /* ignore */
      }
    }
    return Array.from(outPaths);
  });
}