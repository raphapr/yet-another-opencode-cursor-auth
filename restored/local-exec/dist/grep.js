var grep_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var grep_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
const SORT_MODES = /* unused pure expression or super */null && ["none", "path", "modified", "accessed", "created"];
function splitLines(s) {
  return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}
// files_with_matches parser
function parseFilesOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines) {
  const trimmed = stdout.trim();
  const lines = trimmed !== "" ? splitLines(trimmed) : [];
  const sliced = lines.slice(0, clientLimitLines);
  return {
    files: sliced,
    totalFiles: clampInt32(lines.length),
    clientTruncated: lines.length > sliced.length,
    ripgrepTruncated: lines.length >= ripgrepHardCuttoffLines
  };
}
// count parser: expects lines like "path:count"; split from rightmost ':'
function parseCountOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines) {
  const trimmed = stdout.trim();
  const lines = trimmed !== "" ? splitLines(trimmed) : [];
  const counts = [];
  for (const line of lines) {
    if (line === "" || line === undefined) {
      continue;
    }
    const colonIndex = line.lastIndexOf(":");
    if (colonIndex <= 0) {
      continue;
    }
    const countString = line.substring(colonIndex + 1).trim();
    const parsedCount = parseInt(countString, 10);
    if (!Number.isFinite(parsedCount)) {
      continue;
    }
    const filePath = line.substring(0, colonIndex);
    counts.push({
      file: filePath,
      count: parsedCount
    });
  }
  const sliced = counts.slice(0, clientLimitLines);
  return {
    counts: sliced,
    totalFiles: clampInt32(counts.length),
    totalMatches: clampInt32(counts.reduce((acc, count) => acc + count.count, 0)),
    clientTruncated: counts.length > sliced.length,
    ripgrepTruncated: counts.length >= ripgrepHardCuttoffLines
  };
}
// content parser (grouped): expects blocks like
// file_path\n
//   <number>-<content> (context) or <number>:<content> (match)\n
// ... then a blank line between files
function parseContentOutput(stdout, clientLimitLines, ripgrepHardCuttoffLines, ctx) {
  const env_1 = {
    stack: [],
    error: void 0,
    hasError: false
  };
  try {
    const _span = grep_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("parseContentOutput")), false);
    // Only trim if stdout is empty or only whitespace to avoid counting as 0 lines
    // Preserve empty lines that are part of ripgrep's --heading format, so we don't miscount the number
    // of lines produced by ripgrep.
    const lines = stdout.trim() === "" ? [] : splitLines(stdout);
    // Remove final empty line that results from ripgrep stdout always ending with newline
    if (lines.length > 0 && lines[lines.length - 1] === "") {
      lines.pop();
    }
    const byFile = new Map();
    let currentFile;
    let totalMatchedLines = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === undefined) {
        continue;
      }
      // Ripgrep prints "--" between non-contiguous context chunks; these are not content
      if (line === "--") {
        continue;
      }
      if (line === "") {
        // Blank line separates file groups
        currentFile = undefined;
        continue;
      }
      if (!currentFile) {
        // Treat as a file heading line
        currentFile = line;
        continue;
      }
      const match = /^(\d+)([:-])(.*)$/.exec(line);
      if (!match) {
        // Unexpected format; skip
        continue;
      }
      const lineNumberRaw = match[1];
      const separator = match[2];
      const content = match[3] ?? "";
      const lineNumber = parseInt(lineNumberRaw, 10);
      if (!Number.isFinite(lineNumber)) {
        continue;
      }
      const isContextLine = separator === "-";
      if (isContextLine === false) {
        totalMatchedLines++;
      }
      // We want to keep counting the total matched lines, but we don't want to add them to the byFile map
      if (i >= clientLimitLines) {
        continue;
      }
      const fileResults = byFile.get(currentFile) ?? {
        file: currentFile,
        matches: []
      };
      fileResults.matches.push({
        lineNumber,
        content,
        isContextLine
      });
      byFile.set(currentFile, fileResults);
    }
    const result = {
      byFile,
      totalLines: clampInt32(lines.length),
      totalMatchedLines: clampInt32(totalMatchedLines),
      clientTruncated: lines.length > clientLimitLines,
      ripgrepTruncated: lines.length >= ripgrepHardCuttoffLines
    };
    return result;
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    grep_disposeResources(env_1);
  }
}
class LocalGrepExecutor {
  constructor(ignoreService, grepProvider, workspacePath) {
    this.ignoreService = ignoreService;
    this.grepProvider = grepProvider;
    this.workspacePath = workspacePath;
    const firstWorkspacePath = Array.isArray(this.workspacePath) ? this.workspacePath[0] : this.workspacePath;
    this.singleWorkspacePath = Array.isArray(this.workspacePath) && this.workspacePath.length > 1 ? undefined : firstWorkspacePath;
  }
  computeRelativeTarget(path, root) {
    const resolvedPath = resolvePath(path, this.singleWorkspacePath);
    if (resolvedPath === root) {
      return ".";
    }
    const result = (0, external_node_path_.relative)(root, resolvedPath);
    return result;
  }
  async buildArgs(root, params, mode) {
    const args = [];
    // Use the custom --cursor-ignore flag from our ripgrep fork
    // This ensures ignore rules cannot be overridden by glob patterns
    const ignoreFiles = await this.ignoreService.listCursorIgnoreFilesByRoot(root);
    for (const ignoreFile of ignoreFiles) {
      args.push("--cursor-ignore", ignoreFile);
    }
    if (mode === "content") {
      // --heading is used to get the file name and line number in the output we need to parse for the content mode
      args.push("-n", "--heading");
      if (params.contextBefore !== undefined) {
        args.push("--before-context", String(params.contextBefore));
      }
      if (params.contextAfter !== undefined) {
        args.push("--after-context", String(params.contextAfter));
      }
      if (params.context !== undefined && params.contextBefore === undefined && params.contextAfter === undefined) {
        args.push("--before-context", String(params.context), "--after-context", String(params.context));
      }
    } else if (mode === "files_with_matches") {
      args.push("-l");
    } else if (mode === "count") {
      // Force path:count format even for one file, as otherwise our parser breaks when single file.
      args.push("-c", "--with-filename");
    } else {
      const _exhaustive = mode;
      throw new Error(`Unknown output mode: ${mode}`);
    }
    // Default to case sensitive
    if (params.caseInsensitive === true) {
      args.push("--ignore-case");
    } else {
      args.push("--case-sensitive");
    }
    if (params.type) {
      args.push("--type", params.type);
    }
    if (params.glob) {
      args.push("-g", params.glob);
    }
    if (params.multiline) {
      args.push("--multiline", "--multiline-dotall");
    }
    const sortMode = params.sort ?? "modified";
    if (sortMode !== "none") {
      // Default to sort descending (e.g. last modified)
      const flag = params.sortAscending === true ? "--sort" : "--sortr";
      args.push(flag, sortMode);
    }
    // Don't use ripgrep config files that the user may have set, and ensure color text is disabled
    args.push("--no-config", "--color=never");
    // Include hidden files and folders so that the agent can find files in e.g. `.cursor/rules`
    args.push("--hidden");
    args.push("--regexp", params.pattern);
    args.push("--"); // Separator for pattern and target
    args.push(params.path ? this.computeRelativeTarget(params.path, root) : ".");
    return args;
  }
  computeContentMaxResults(params) {
    return params.headLimit && params.headLimit > 0 ? params.headLimit : LocalGrepExecutor.HARD_MAX_OUTPUT_LINES;
  }
  async filterBlockedFiles(items) {
    const filtered = [];
    for (const item of items) {
      const isBlocked = await this.ignoreService.isRepoBlocked(item.file);
      if (!isBlocked) {
        filtered.push(item);
      }
    }
    return filtered;
  }
  async runFilesMode(ctx, root, params, sandboxPolicy) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = grep_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalGrepExecutor.runFilesMode")), false);
      const args = await this.buildArgs(root, params, "files_with_matches");
      const res = await this.executeRg(_span.ctx, root, args, this.computeContentMaxResults(params), sandboxPolicy);
      if (res.stderr !== "") {
        throw new Error(res.stderr);
      }
      const {
        files,
        clientTruncated,
        ripgrepTruncated
      } = parseFilesOutput(res.stdout, LocalGrepExecutor.CLIENT_LIMIT_LINES, LocalGrepExecutor.HARD_MAX_OUTPUT_LINES);
      // Filter out files blocked by admin repo rules
      const filteredFiles = [];
      for (const file of files) {
        const isBlocked = await this.ignoreService.isRepoBlocked(file);
        if (!isBlocked) {
          filteredFiles.push(file);
        }
      }
      const filesResult = new grep_exec_pb /* GrepFilesResult */.T7({
        files: filteredFiles,
        totalFiles: clampInt32(filteredFiles.length),
        clientTruncated,
        ripgrepTruncated
      });
      return new grep_exec_pb /* GrepUnionResult */.vD({
        result: {
          case: "files",
          value: filesResult
        }
      });
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      grep_disposeResources(env_2);
    }
  }
  async runCountMode(ctx, root, params, sandboxPolicy) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = grep_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalGrepExecutor.runCountMode")), false);
      const args = await this.buildArgs(root, params, "count");
      const res = await this.executeRg(_span.ctx, root, args, this.computeContentMaxResults(params), sandboxPolicy);
      if (res.stderr !== "") {
        throw new Error(res.stderr);
      }
      const {
        counts,
        clientTruncated,
        ripgrepTruncated
      } = parseCountOutput(res.stdout, LocalGrepExecutor.CLIENT_LIMIT_LINES, LocalGrepExecutor.HARD_MAX_OUTPUT_LINES);
      // Filter out files blocked by admin repo rules
      const filteredCounts = await this.filterBlockedFiles(counts);
      const filteredTotalMatches = filteredCounts.reduce((sum, c) => sum + c.count, 0);
      const countResult = new grep_exec_pb /* GrepCountResult */.xA({
        counts: filteredCounts.map(c => new grep_exec_pb /* GrepFileCount */.sS({
          file: c.file,
          count: clampInt32(c.count)
        })),
        totalFiles: clampInt32(filteredCounts.length),
        totalMatches: clampInt32(filteredTotalMatches),
        clientTruncated,
        ripgrepTruncated
      });
      return new grep_exec_pb /* GrepUnionResult */.vD({
        result: {
          case: "count",
          value: countResult
        }
      });
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      grep_disposeResources(env_3);
    }
  }
  async runContentMode(ctx, root, params, sandboxPolicy) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = grep_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalGrepExecutor.runContentMode")), false);
      const args = await this.buildArgs(root, params, "content");
      const res = await this.executeRg(_span.ctx, root, args, this.computeContentMaxResults(params), sandboxPolicy);
      if (res.stderr !== "") {
        throw new Error(res.stderr);
      }
      const {
        byFile,
        clientTruncated,
        ripgrepTruncated
      } = parseContentOutput(res.stdout, LocalGrepExecutor.CLIENT_LIMIT_LINES, LocalGrepExecutor.HARD_MAX_OUTPUT_LINES, _span.ctx);
      // Filter out files blocked by admin repo rules
      const entries = Array.from(byFile.values());
      const filteredEntries = await this.filterBlockedFiles(entries);
      // Recalculate totals based on filtered results
      let filteredTotalLines = 0;
      let filteredTotalMatchedLines = 0;
      for (const entry of filteredEntries) {
        filteredTotalLines += entry.matches.length;
        filteredTotalMatchedLines += entry.matches.filter(m => !m.isContextLine).length;
      }
      const contentRes = new grep_exec_pb /* GrepContentResult */.Zp({
        matches: filteredEntries.map(f => new grep_exec_pb /* GrepFileMatch */.uI({
          file: f.file,
          matches: f.matches.map(m => new grep_exec_pb /* GrepContentMatch */.dx({
            lineNumber: m.lineNumber,
            content: m.content,
            isContextLine: m.isContextLine
          }))
        })),
        totalLines: clampInt32(filteredTotalLines),
        totalMatchedLines: clampInt32(filteredTotalMatchedLines),
        clientTruncated,
        ripgrepTruncated
      });
      return new grep_exec_pb /* GrepUnionResult */.vD({
        result: {
          case: "content",
          value: contentRes
        }
      });
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      grep_disposeResources(env_4);
    }
  }
  async executeRg(ctx, cwd, args, lineBudget, sandboxPolicy) {
    // Create span without 'using' so it doesn't auto-dispose when function returns
    // We'll manually end it when the Promise resolves/rejects
    const span = (0, dist /* createSpan */.VI)(ctx.withName("LocalGrepExecutor.executeRg"));
    const enc = "utf8";
    const maxBytes = 8 * 1024 * 1024; // 8MB cap by default
    lineBudget = lineBudget ?? LocalGrepExecutor.HARD_MAX_OUTPUT_LINES;
    return new Promise((resolve, reject) => {
      let exited = false;
      let spanEnded = false;
      const endSpan = () => {
        if (!spanEnded) {
          spanEnded = true;
          span.span.end();
        }
      };
      let proc;
      let timeoutId;
      try {
        const p = sandboxPolicy;
        proc = (0, shell_exec_dist /* spawnInSandbox */.ep)(this.grepProvider.rgPath, args, {
          cwd
        }, p);
      } catch (e) {
        endSpan();
        return reject(e);
      }
      const chunksStdout = [];
      const chunksStderr = [];
      let totalStdout = 0;
      let totalStderr = 0;
      let seenLines = 0;
      let lineBudgetExceeded = false;
      timeoutId = setTimeout(() => {
        if (!exited) {
          try {
            endSpan();
            reject(new Error(`Timed out after ${LocalGrepExecutor.MAIN_TIMEOUT_MS / 1000}s`));
            proc.kill();
          } catch {
            /* ignore */
          }
        }
      }, LocalGrepExecutor.MAIN_TIMEOUT_MS);
      proc.stdout?.on("data", d => {
        totalStdout += d.length;
        if (lineBudget !== undefined && lineBudgetExceeded !== true) {
          // Count '\n' in this chunk and find where to truncate
          let truncateIndex = -1;
          let linesInChunk = 0;
          for (let i = 0; i < d.length; i++) {
            if (d[i] === 0x0a) {
              // '\n'
              linesInChunk++;
              if (seenLines + linesInChunk >= lineBudget) {
                // Include this newline and stop
                truncateIndex = i + 1;
                lineBudgetExceeded = true;
                try {
                  proc.kill();
                } catch {
                  /* ignore */
                }
                break;
              }
            }
          }
          seenLines += linesInChunk;
          const bufferToAdd = truncateIndex >= 0 ? d.subarray(0, truncateIndex) : d;
          if (totalStdout <= maxBytes) {
            chunksStdout.push(bufferToAdd);
          }
        } else if (lineBudgetExceeded !== true && totalStdout <= maxBytes) {
          chunksStdout.push(d);
        }
      });
      proc.stderr?.on("data", d => {
        totalStderr += d.length;
        if (totalStderr <= maxBytes) {
          chunksStderr.push(d);
        }
      });
      proc.on("error", err => {
        clearTimeout(timeoutId);
        endSpan();
        reject(err);
      });
      proc.on("close", code => {
        exited = true;
        clearTimeout(timeoutId);
        const stdout = Buffer.concat(chunksStdout).toString(enc);
        const stderr = Buffer.concat(chunksStderr).toString(enc);
        endSpan();
        resolve({
          stdout,
          stderr,
          exitCode: code ?? 0
        });
      });
    });
  }
  async execute(ctx, args) {
    const env_5 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = grep_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("LocalGrepExecutor.execute")), false);
      const workspacePaths = Array.isArray(this.workspacePath) ? this.workspacePath : [this.workspacePath ?? process.cwd()];
      const mode = args.outputMode ?? "content";
      const sandboxPolicy = convertProtoToInternalPolicy(args.sandboxPolicy);
      try {
        // Run grep on each workspace path
        let workspaceResults = {};
        const indexedResults = await this.grepProvider.executeIndexedGrep?.(ctx, workspacePaths, args);
        if (indexedResults !== undefined) {
          workspaceResults = indexedResults;
        } else {
          for (const root of workspacePaths) {
            let results;
            if (mode === "content") {
              results = await this.runContentMode(_span.ctx, root, args, sandboxPolicy);
            } else if (mode === "files_with_matches") {
              results = await this.runFilesMode(_span.ctx, root, args, sandboxPolicy);
            } else if (mode === "count") {
              results = await this.runCountMode(_span.ctx, root, args, sandboxPolicy);
            } else {
              const _exhaustive = mode;
              throw new Error(`Unknown output mode: ${mode}`);
            }
            workspaceResults[root] = results;
          }
        }
        const success = new grep_exec_pb /* GrepSuccess */._0({
          pattern: args.pattern,
          path: args.path,
          outputMode: mode,
          workspaceResults
        });
        return new grep_exec_pb /* GrepResult */.Ud({
          result: {
            case: "success",
            value: success
          }
        });
      } catch (e) {
        return new grep_exec_pb /* GrepResult */.Ud({
          result: {
            case: "error",
            value: new grep_exec_pb /* GrepError */.ts({
              error: e instanceof Error ? e.message : String(e)
            })
          }
        });
      }
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      grep_disposeResources(env_5);
    }
  }
}
LocalGrepExecutor.MAIN_TIMEOUT_MS = 25_000;
LocalGrepExecutor.HARD_MAX_OUTPUT_LINES = 10_000;
// Maximum number of lines for the client to store on disk and send to the server
LocalGrepExecutor.CLIENT_LIMIT_LINES = 2_000;
//# sourceMappingURL=grep.js.map