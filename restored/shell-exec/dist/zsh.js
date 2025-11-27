var zsh_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var zsh_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
function getZshPath() {
  const shell = process.env.SHELL;
  if (shell?.includes("zsh")) {
    return shell;
  }
  return (0, dist /* findActualExecutable */.Ef)("zsh", []).cmd;
}
class ZshState {
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
    return new ZshState(workingDirectory ?? this.cwd, this.state);
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = zsh_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("ZshState.execute")), false);
      const interactive = options?.interactive ?? false;
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const cwd = options?.workingDirectory ?? this.cwd;
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      let core = `builtin eval "$1"`;
      if (!interactive) {
        core += " < /dev/null";
      }
      const c = `snap=$(command cat <&3); builtin unsetopt aliases 2>/dev/null; builtin unalias -m '*' 2>/dev/null || true; ` + `builtin setopt extendedglob; ` + `builtin eval "$snap" && { builtin unsetopt nounset 2>/dev/null || true; builtin export PWD="$(builtin pwd)"; builtin setopt aliases 2>/dev/null; ${core}; }; ` + `COMMAND_EXIT_CODE=$?; dump_zsh_state >&4; builtin exit $COMMAND_EXIT_CODE`;
      const args = ["-o", "extendedglob", "-c", c, "--",
      // This separates options from positional arguments
      command];
      const child = spawnWithSignal(getZshPath(), args, {
        env,
        // Use 'ignore' for stdin (unless interactive) to prevent background processes
        // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
        stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe", "pipe", "pipe"],
        cwd
      }, options?.sandboxPolicy ?? {
        type: "insecure_none"
      }, options?.signal);
      let newState = "";
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
        if (!options?.signal?.aborted) {
          const {
            cwd: nextCwd,
            rest
          } = splitPwdAndState(newState);
          if (nextCwd?.startsWith("/")) {
            this.state = rest;
            this.cwd = nextCwd;
          }
        }
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
            code: exitCode,
            data: ""
          });
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
      const inFd = child.stdio[3];
      const outFd = child.stdio[4];
      inFd?.write(this.state);
      inFd?.end();
      outFd?.on("data", data => {
        newState += data.toString();
      });
      yield* iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      zsh_disposeResources(env_1);
    }
  }
}
async function initZshState(options) {
  const env = {
    ...process.env,
    ...types_SHELL_ENV_OVERRIDES,
    ...options?.env
  };
  const STATE_MARKER = "__CURSOR_STATE_MARKER__";
  const args = ["-o", "extendedglob", "-ilc", `${dump_zsh_state} builtin printf '${STATE_MARKER}\\n'; dump_zsh_state`];
  const child = spawnWithSignal(getZshPath(), args, {
    env,
    // Only provide stdio for 0/1/2 to avoid extra FDs being inherited by
    // background processes (e.g., ssh-agent). Write dump to stdout.
    stdio: ["ignore", "pipe", "pipe"],
    detached: true
  }, {
    type: "insecure_none"
  }, options?.signal);
  let fullOutput = "";
  child.stdout?.on("data", data => {
    fullOutput += data.toString();
  });
  await new Promise(resolve => {
    child.on("close", () => {
      resolve(undefined);
    });
  });
  const snapshot = parseShellStateOutput(fullOutput, STATE_MARKER);
  const {
    cwd,
    rest
  } = splitPwdAndState(snapshot);
  return new ZshState(cwd, rest);
}

//# sourceMappingURL=zsh.js.map