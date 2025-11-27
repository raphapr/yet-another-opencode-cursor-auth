var naive_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var naive_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
 * A naive TerminalExecutor implementation that simply executes commands
 * using the default shell without any state preservation between commands.
 */
class NaiveTerminalExecutor {
  cwd;
  options;
  constructor(cwd, options) {
    this.cwd = cwd;
    this.options = options;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new NaiveTerminalExecutor(workingDirectory ?? this.cwd, this.options);
  }
  execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = naive_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("NaiveTerminalExecutor.execute")), false);
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const interactive = options?.interactive ?? false;
      // Set environment variables to disable color output
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      const child = spawnWithSignal(this.options?.shell || process.env.SHELL || "/bin/sh", ["-c", command], {
        env,
        cwd: options?.workingDirectory,
        // Use 'ignore' for stdin unless interactive, to prevent background
        // processes from inheriting an open stdin pipe
        stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe"]
      }, options?.sandboxPolicy ?? {
        type: "insecure_none"
      }, options?.signal);
      // Handle stdout data
      child.stdout?.on("data", async data => {
        try {
          await iterable.write({
            type: "stdout",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle stderr data
      child.stderr?.on("data", async data => {
        try {
          await iterable.write({
            type: "stderr",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle process exit and errors
      child.on("error", error => {
        iterable.throw(error);
      });
      // NB: This naive implementation uses 'exit' instead of 'close' for simplicity
      // and speed. It accepts the risk of potentially missing some buffered output
      // in exchange for not hanging on background processes.
      child.on("exit", async code => {
        (0, context_dist /* reportEvent */.HF)(span.ctx, "exit");
        // Attempt to capture sandbox deny events (best-effort)
        if (options?.sandboxPolicy?.captureDenies ?? false) {
          try {
            const denyEvents = await sandbox_captureSandboxDenies(child);
            if (denyEvents && denyEvents.length > 0) {
              await iterable.write({
                type: "sandbox_denies",
                events: denyEvents
              });
            }
          } catch {}
        }
        try {
          await iterable.write({
            type: "exit",
            code,
            data: ""
          });
          iterable.close();
        } catch (_error) {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
      });
      return iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      naive_disposeResources(env_1);
    }
  }
}
/**
 * Create a new NaiveTerminalExecutor instance
 * @param options - Optional options to use (shell defaults to process.env.SHELL or /bin/sh)
 * @returns A new NaiveTerminalExecutor instance
 */
function createNaiveTerminalExecutor(options) {
  const cwd = process.cwd();
  return new NaiveTerminalExecutor(cwd, options);
}
//# sourceMappingURL=naive.js.map