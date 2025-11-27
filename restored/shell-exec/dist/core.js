function spawnWithSignal(command, args = [], options = {}, sandboxPolicy, signal) {
  // Check if signal is already aborted
  if (signal?.aborted) {
    const error = new Error("Operation was aborted");
    error.name = "AbortError";
    // Create a mock child process that immediately emits an error
    const mockChild = new (require("node:events").EventEmitter)();
    process.nextTick(() => {
      mockChild.emit("error", error);
    });
    return mockChild;
  }
  const child = spawnInSandbox(command, args, options, sandboxPolicy);
  if (signal) {
    const abortHandler = () => {
      if (child.pid) {
        try {
          // Send SIGTERM to the process group to gracefully terminate
          if (options.detached) {
            process.kill(-child.pid, "SIGTERM");
          } else {
            child.kill("SIGTERM");
          }
          // Set up force kill after 1 second
          const forceKillTimeout = setTimeout(() => {
            if (!child.killed && child.pid) {
              try {
                if (options.detached) {
                  process.kill(-child.pid, "SIGKILL");
                } else {
                  child.kill("SIGKILL");
                }
              } catch (_killError) {
                // Process might already be dead
              }
            }
          }, 1000);
          // Clean up timeout if process exits gracefully
          child.once("exit", () => {
            clearTimeout(forceKillTimeout);
          });
        } catch (_error) {
          // Process might already be dead, ignore errors
        }
      }
    };
    signal.addEventListener("abort", abortHandler, {
      once: true
    });
    // Clean up event listener when child process exits
    child.once("exit", () => {
      signal.removeEventListener("abort", abortHandler);
    });
  }
  return child;
}
function shellExec(command, args = [], options = {}, sandboxPolicy) {
  return new Promise((resolve, reject) => {
    const {
      signal,
      ...spawnOptions
    } = options;
    // Set environment variables to disable color output
    const env = {
      ...process.env,
      ...SHELL_ENV_OVERRIDES,
      ...spawnOptions.env
    };
    const child = spawnWithSignal(command, args, {
      ...spawnOptions,
      env,
      stdio: ["pipe", "pipe", "pipe"]
    }, sandboxPolicy, signal);
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", data => {
      stdout += data.toString();
    });
    child.stderr?.on("data", data => {
      stderr += data.toString();
    });
    child.on("error", error => {
      reject(error);
    });
    child.on("exit", code => {
      if (code === 0) {
        resolve({
          stdout,
          stderr,
          code
        });
      } else {
        const error = new Error(`Process exited with code ${code}`);
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}
function readPipe(child, pipe) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    pipe.on("data", chunk => {
      chunks.push(chunk);
    });
    pipe.on("end", () => {
      resolve(Buffer.concat(chunks).toString());
    });
    pipe.on("error", reject);
    child.on("error", reject);
    child.on("exit", () => {
      resolve(Buffer.concat(chunks).toString());
    });
  });
}
/**
 * Splits shell state output into working directory and state snapshot.
 * The first line is expected to be the current working directory (PWD),
 * and the rest is the shell state (environment vars, functions, etc.).
 */
function splitPwdAndState(state) {
  const firstLineIndex = state.indexOf("\n");
  const cwd = state.substring(0, firstLineIndex);
  const rest = state.substring(firstLineIndex);
  return {
    cwd,
    rest
  };
}
/**
 * Extracts shell state after a marker to filter out MOTD and other
 * shell initialization output. If the marker is not found, returns
 * the full output as a fallback.
 */
function parseShellStateOutput(fullOutput, marker) {
  const markerWithNewline = `${marker}\n`;
  const markerIndex = fullOutput.indexOf(markerWithNewline);
  return markerIndex >= 0 ? fullOutput.slice(markerIndex + markerWithNewline.length) : fullOutput;
}
//# sourceMappingURL=core.js.map