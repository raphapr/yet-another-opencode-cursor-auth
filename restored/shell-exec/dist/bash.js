var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
function getBashPath(userTerminalHint) {
  // NB: On Windows, there is a "bash.exe" that will connect to WSL, and there
  // may be other bash.exe's such as Cygwin, MSYS2, etc, but we *only* support
  // Git Bash, so make sure we find that and if it doesn't exist, we toss it.
  if (false)
    // removed by dead control flow
    {}
  const bashPath = (0, dist /* findActualExecutable */.Ef)("bash", []).cmd;
  return bashPath;
}
function windowsPathToGitBash(windowsPath) {
  if (true) {
    return windowsPath;
  }
  // Convert Windows path (e.g., C:\Users\...\Temp\...) to Git Bash format
  // Git Bash on Windows can handle Windows paths directly, but we convert to Unix-style
  // for consistency. Try using cygpath if available, otherwise convert manually.
  // removed by dead control flow
  {}
  // Git Bash typically maps C:\ to /c/, but the exact format can vary
  // Try the standard MSYS2/Git Bash format: /c/Users/...
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // Fallback: just replace backslashes with forward slashes
  // removed by dead control flow
  {}
}
class BashState {
  cwd;
  state;
  userTerminalHint;
  useFileStateTransport;
  constructor(cwd, state, userTerminalHint, useFileStateTransport = false) {
    this.cwd = cwd;
    this.state = state;
    this.userTerminalHint = userTerminalHint;
    this.useFileStateTransport = useFileStateTransport;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new BashState(workingDirectory ?? this.cwd, this.state, this.userTerminalHint, this.useFileStateTransport);
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = __addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("BashState.execute")), false);
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
      const useFileTransport = this.useFileStateTransport;
      let tempDir;
      let stateInputPath;
      let stateOutputPath;
      if (useFileTransport) {
        tempDir = await (0, promises_.mkdtemp)(external_node_path_.join(external_node_os_.tmpdir(), "cursor-bash-state-"));
        const dirname = external_node_path_.basename(tempDir);
        stateInputPath = external_node_path_.join(tempDir, "state-in");
        stateOutputPath = external_node_path_.join(tempDir, "state-out");
        await (0, promises_.writeFile)(stateInputPath, this.state, "utf8");
        // Ensure the output file exists (empty) so Git Bash can write to it
        await (0, promises_.writeFile)(stateOutputPath, "", "utf8").catch(() => {
          // Best effort - if it fails, continue anyway
        });
        // NB: We need to pass this path in Git Bash format, not Windows format
        // Git Bash maps Windows paths: C:\Users\... becomes /c/Users/...
        // Use cygpath if available to ensure correct path conversion, otherwise convert manually
        const gitBashInputPath = windowsPathToGitBash(stateInputPath);
        const gitBashOutputPath = windowsPathToGitBash(stateOutputPath);
        // Set environment variables - Git Bash will use cygpath internally if needed
        env.CURSOR_STATE_INPUT_FILE = gitBashInputPath;
        env.CURSOR_STATE_OUTPUT_FILE = gitBashOutputPath;
      }
      const stateLoader = useFileTransport ? 'snap=$(command cat "$CURSOR_STATE_INPUT_FILE")' : "snap=$(command cat <&3)";
      // Ensure the output directory exists and file is writable
      const stateWriter = useFileTransport ? 'mkdir -p "$(dirname "$CURSOR_STATE_OUTPUT_FILE")" 2>/dev/null; dump_bash_state > "$CURSOR_STATE_OUTPUT_FILE"' : "dump_bash_state >&4";
      const c = `${stateLoader} && builtin shopt -s extglob && builtin eval -- "$snap" && ` + `{ builtin set +u 2>/dev/null || true; builtin export PWD="$(builtin pwd)"; ${core}; }; ` + `COMMAND_EXIT_CODE=$?; ${stateWriter}; builtin exit $COMMAND_EXIT_CODE`;
      const args = ["-O", "extglob", "-c", c, "--",
      // This separates options from positional arguments
      command];
      const bashPath = getBashPath(this.userTerminalHint);
      if (!bashPath) {
        throw new Error("Can't find Bash");
      }
      let newState = "";
      const readStateFromTransport = async () => {
        if (useFileTransport) {
          if (!stateOutputPath) {
            newState = this.state;
            return;
          }
          try {
            newState = await (0, promises_.readFile)(stateOutputPath, "utf8");
          } catch (error) {
            console.warn("[shell-exec] Failed to read bash state file", error);
            newState = this.state;
          }
        }
      };
      const cleanupStateFiles = async () => {
        if (tempDir) {
          try {
            await (0, promises_.rm)(tempDir, {
              recursive: true,
              force: true
            });
          } catch {
            // best effort cleanup
          }
        }
      };
      let child;
      try {
        child = spawnWithSignal(bashPath, args, {
          env,
          // Use 'ignore' for stdin (unless interactive) to prevent background processes
          // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
          stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe", "pipe", "pipe"],
          cwd
        }, options?.sandboxPolicy ?? {
          type: "insecure_none"
        }, options?.signal);
      } catch (error) {
        await cleanupStateFiles();
        throw error;
      }
      // Handle stdout data
      child.stdout?.on("data", async data => {
        try {
          await iterable.write({
            type: "stdout",
            data: data.toString()
          });
        } catch {
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
        } catch {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle process exit and errors
      child.on("error", async error => {
        await cleanupStateFiles();
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
          await readStateFromTransport();
          const {
            cwd: nextCwd,
            rest
          } = splitPwdAndState(newState);
          // On Windows, Git Bash returns Unix-style paths which don't work with Node.js spawn,
          // so we skip updating CWD on Windows
          this.state = rest;
          if (true && nextCwd?.startsWith("/")) {
            this.cwd = nextCwd;
          }
        }
        // Attempt to capture sandbox deny events (best-effort)
        if (options?.sandboxPolicy?.captureDenies) {
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
        } catch {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
        await cleanupStateFiles();
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
      if (!useFileTransport) {
        inFd?.write(this.state);
        inFd?.end();
        outFd?.on("data", data => {
          newState += data.toString();
        });
      }
      yield* iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources(env_1);
    }
  }
}
async function initBashState(options) {
  const env = {
    ...process.env,
    ...types_SHELL_ENV_OVERRIDES,
    ...options?.env
  };
  const STATE_MARKER = "__CURSOR_STATE_MARKER__";
  const args = ["-O", "extglob", "-ilc", dump_bash_state + " " + `builtin printf '${STATE_MARKER}\\n'; dump_bash_state`];
  const bashPath = getBashPath(options?.userTerminalHint);
  if (!bashPath) {
    throw new Error("Can't find Bash");
  }
  const child = spawnWithSignal(bashPath, args, {
    env,
    detached: true,
    // Use 'ignore' for stdin so it's connected to /dev/null from the start
    // This prevents background processes (like ssh-agent) started during
    // initialization from inheriting an open stdin pipe
    stdio: ["ignore", "pipe", "pipe"]
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
  const useFileStateTransport = "darwin" === "win32";
  // On Windows, Git Bash returns Unix-style paths which don't work with Node.js spawn,
  // so we use process.cwd() instead
  const initialCwd = false ? 0 : cwd;
  return new BashState(initialCwd, rest, options?.userTerminalHint, useFileStateTransport);
}

//# sourceMappingURL=bash.js.map