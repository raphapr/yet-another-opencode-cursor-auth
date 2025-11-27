var ripgrep_stream_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var ripgrep_stream_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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

/**
 * Spawn ripgrep with automatic timeout and cleanup.
 * Returns a disposable that kills process and clears timeout on disposal.
 */
function spawnRipgrepWithTimeout(rgPath, args, cwd, sandboxPolicy, timeoutMs) {
  const proc = (0, shell_exec_dist /* spawnInSandbox */.ep)(rgPath, args, {
    cwd
  }, sandboxPolicy);
  const stderrChunks = [];
  proc.stderr?.on("data", chunk => {
    stderrChunks.push(chunk);
  });
  const processExit = new Promise((resolve, reject) => {
    proc.on("error", reject);
    proc.on("close", code => resolve(code ?? 0));
  });
  if (!proc.stdout) {
    throw new Error("No stdout from ripgrep process");
  }
  let timeoutId;
  const timeout = new Promise(resolve => {
    timeoutId = setTimeout(() => resolve("timeout"), timeoutMs);
  });
  return {
    stdout: proc.stdout,
    processExit,
    stderr: () => Buffer.concat(stderrChunks).toString(),
    timeout,
    [Symbol.dispose]() {
      if (timeoutId) clearTimeout(timeoutId);
      proc.kill(); // Returns boolean, never throws
    }
  };
}
/**
 * Walk directory tree via ripgrep with automatic error handling.
 *
 * Streams files/paths as they're discovered with:
 * - Best-effort timeout (returns partial results, logs warning)
 * - Exit code validation (only throws if no results and bad exit)
 * - Stderr logging (warns but doesn't throw if got results)
 *
 * @example
 * ```typescript
 * // List all files
 * for await (const path of ripwalk({ rgPath: '/path/to/rg', cwd: '/workspace' })) {
 *   console.log(path);
 * }
 *
 * // Find specific files
 * for await (const path of ripwalk({
 *   rgPath: '/path/to/rg',
 *   cwd: '/workspace',
 *   includeGlobs: ['**.ts', '**.md'],
 *   excludeGlobs: ['node_modules/**'],
 * })) {
 *   console.log(path);
 * }
 * ```
 */
async function* ripwalk({
  rgPath,
  root,
  includeGlobs = [],
  excludeGlobs = [],
  caseSensitive = false,
  cursorIgnoreFiles = [],
  sandboxPolicy = {
    type: "insecure_none"
  },
  timeoutMs = 5_000
}) {
  const env_1 = {
    stack: [],
    error: void 0,
    hasError: false
  };
  try {
    // Build ripgrep args - always respect .gitignore even outside git repos
    const args = ["--files", "--hidden", "--no-require-git", "--no-config", "--color=never"];
    if (caseSensitive) {
      args.push("--case-sensitive");
    }
    // Add cursor ignore files (custom flag)
    for (const ignoreFile of cursorIgnoreFiles) {
      args.push("--cursor-ignore", ignoreFile);
    }
    // Add include globs
    for (const glob of includeGlobs) {
      args.push("-g", glob);
    }
    // Add exclude globs
    for (const glob of excludeGlobs) {
      args.push("-g", `!${glob}`);
    }
    // Spawn ripgrep with automatic cleanup via disposable
    const ripgrep = ripgrep_stream_addDisposableResource(env_1, spawnRipgrepWithTimeout(rgPath, args, root, sandboxPolicy, timeoutMs), false);
    // Stream files with timeout on each iteration
    let filesYielded = 0;
    let didTimeout = false;
    const fileIterator = lines(ripgrep.stdout)[Symbol.asyncIterator]();
    while (true) {
      const result = await Promise.race([fileIterator.next(), ripgrep.timeout]);
      if (result === "timeout") {
        didTimeout = true;
        console.warn(`Ripgrep timed out after ${timeoutMs}ms with ${filesYielded} results`);
        break;
      }
      if (result.done) break;
      filesYielded++;
      yield result.value;
    }
    // After streaming, check exit code and stderr
    if (filesYielded > 0) {
      // Got results - log warnings if any, but don't throw
      const stderr = ripgrep.stderr();
      if (stderr && !stderr.includes("No such file or directory")) {
        console.warn("Ripgrep warnings:", stderr);
      }
    } else if (!didTimeout) {
      // No results and didn't timeout - check why
      const exitCode = await ripgrep.processExit;
      // Ripgrep exit codes: 0 = matches found, 1 = no matches (success), 2+ = error
      if (exitCode !== 0 && exitCode !== 1) {
        const stderr = ripgrep.stderr();
        throw new Error(`Ripgrep failed (exit ${exitCode}) with no results${stderr ? `: ${stderr}` : ""}`);
      }
    }
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    ripgrep_stream_disposeResources(env_1);
  }
}
async function* lines(stream) {
  let buffer = "";
  for await (const chunk of stream) {
    buffer += chunk.toString();
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    yield* parts;
  }
  if (buffer) yield buffer;
}
//# sourceMappingURL=ripgrep-stream.js.map