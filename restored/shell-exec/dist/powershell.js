var powershell_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var powershell_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
 * Detects which PowerShell executable to use.
 * Returns 'pwsh' for PowerShell Core (cross-platform) or 'powershell' for Windows PowerShell.
 */
function getPowerShellExecutable() {
  let pwsh = (0, dist /* findActualExecutable */.Ef)("pwsh", []).cmd;
  if (pwsh !== "pwsh") {
    return pwsh;
  }
  pwsh = (0, dist /* findActualExecutable */.Ef)("powershell", []).cmd;
  if (pwsh !== "powershell") {
    return pwsh;
  }
  if (false)
    // removed by dead control flow
    {}
  throw new Error("Neither 'pwsh' (PowerShell Core) nor 'powershell' (Windows PowerShell) found in PATH");
}
class PowerShellState {
  cwd;
  state;
  constructor(cwd, state) {
    this.cwd = cwd;
    this.state = state;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new PowerShellState(workingDirectory ?? this.cwd, this.state);
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = powershell_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("PowerShellState.execute")), false);
      const interactive = options?.interactive ?? false;
      const cwd = options?.workingDirectory ?? this.cwd;
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      // Create temporary files for state transfer
      const tempDir = external_node_os_.tmpdir();
      const stateOutFile = external_node_path_.join(tempDir, `ps-state-out-${(0, external_node_crypto_.randomUUID)()}.txt`);
      const commandScript = dump_powershell_state(this.state, cwd, command, stateOutFile);
      // Write the command script to a temporary file and execute with -File
      const scriptFile = external_node_path_.join(tempDir, `ps-script-${(0, external_node_crypto_.randomUUID)()}.ps1`);
      await promises_.writeFile(scriptFile, commandScript, {
        encoding: "utf8"
      });
      const args = ["-ExecutionPolicy", "Bypass", "-File", scriptFile];
      if (!interactive) {
        args.push("-NonInteractive");
      }
      const pwsh = getPowerShellExecutable();
      const child = spawnWithSignal(pwsh, args, {
        env,
        // Use 'ignore' for stdin (unless interactive) to prevent background processes
        // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
        stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe"],
        cwd
      }, options?.sandboxPolicy ?? {
        type: "insecure_none"
      }, options?.signal);
      // Handle stdout data
      child.stdout?.on("data", async data => {
        const s = data.toString();
        try {
          await iterable.write({
            type: "stdout",
            data: s
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle stderr data
      child.stderr?.on("data", async data => {
        const s = data.toString();
        try {
          await iterable.write({
            type: "stderr",
            data: s
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      const cleanup = async () => {
        try {
          const newState = await promises_.readFile(stateOutFile, "utf8");
          const {
            cwd: newCwd,
            rest
          } = splitPwdAndState(newState);
          this.state = rest;
          // PowerShell paths may have extra whitespace, trim it
          this.cwd = newCwd.trim();
          await (0, promises_.rm)(stateOutFile).catch(() => {
            /* ignore */
          });
        } catch (_error) {
          // If we can't read the state file, the command likely failed
          // Keep the current state
        }
        // Cleanup temporary script file
        await (0, promises_.rm)(scriptFile).catch(() => {
          /* ignore */
        });
      };
      // NB: This is extremely Tricky. Data from stdio can come in after 'exit',
      // so instead of emitting 'exit' immediately, we store off the exit code
      // and emit it once 'close' is called.
      let exitCode = null;
      let closeTimeoutId = null;
      let hasEmittedExit = false;
      const emitExitAndClose = async () => {
        if (hasEmittedExit) return;
        hasEmittedExit = true;
        if (closeTimeoutId) {
          clearTimeout(closeTimeoutId);
          closeTimeoutId = null;
        }
        (0, context_dist /* reportEvent */.HF)(span.ctx, "exit");
        try {
          await iterable.write({
            type: "exit",
            code: exitCode,
            data: ""
          });
          await cleanup();
          iterable.close();
        } catch (_error) {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
      };
      child.on("exit", (code, _signal) => {
        exitCode = code;
        // Start timeout to prevent hanging if 'close' never fires
        const timeout = options?.closeTimeout ?? 5000;
        if (timeout > 0) {
          closeTimeoutId = setTimeout(() => {
            console.warn(`[shell-exec] Close event did not fire within ${timeout}ms after exit. ` + `This may indicate a background process is holding file descriptors open. ` + `Proceeding anyway to prevent hang.`);
            emitExitAndClose();
          }, timeout);
        }
      });
      child.on("close", async () => {
        await emitExitAndClose();
      });
      // Handle process exit and errors
      child.on("error", error => {
        cleanup().catch(() => {
          /* ignore */
        });
        iterable.throw(error);
      });
      yield* iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      powershell_disposeResources(env_1);
    }
  }
}
async function initPowerShellState() {
  return new PowerShellState(process.cwd(), "");
}
//# sourceMappingURL=powershell.js.map