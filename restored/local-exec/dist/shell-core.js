var shell_core_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var shell_core_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const logger = (0, dist /* createLogger */.h)("local-exec:shell-core");
// After this size, all stdout/stderr is dropped.
const shell_core_MAX_OUTPUT_FILE_SIZE = 1024 * 1024 * 50; // 50 MB.
/**
 * Core shell executor that wraps a terminal executor and provides
 * common functionality for both streaming and non-streaming execution.
 *
 * This class handles:
 * - Working directory resolution
 * - Output buffering with size limits
 * - Event emission for stdout, stderr, trimming, and exit
 */
class BaseShellCoreExecutor {
  constructor(executor, workspacePath, projectDir) {
    this.executor = executor;
    this.workspacePath = workspacePath;
    this.projectDir = projectDir;
  }
  /**
   * Execute a shell command and yield events for stdout, stderr, trimming, and exit
   */
  async *execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = shell_core_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("ShellCoreExecutor.execute")), false);
      const command = args.command;
      const workingDirectory = args.workingDirectory || (await this.executor.getCwd());
      const resolvedWorkingDir = resolvePath(workingDirectory, this.workspacePath);
      let stdoutSize = 0;
      let stderrSize = 0;
      let stdoutTrimmed = false;
      let stderrTrimmed = false;
      let mergedOutput;
      if (args.fileOutputThresholdBytes && this.projectDir) {
        mergedOutput = {
          buffer: "",
          lineCount: 0,
          size: 0,
          threshold: Number(args.fileOutputThresholdBytes)
        };
      }
      // Use the provided signal or fall back to the context signal
      const signal = args.signal;
      const policy = args.sandboxPolicy;
      if (policy) {
        yield {
          type: "start",
          sandboxed: policy.type === "workspace_readonly" || policy.type === "workspace_readwrite"
        };
      }
      for await (const event of this.executor.execute(ctx, command, {
        signal,
        workingDirectory: resolvedWorkingDir,
        env: {
          CURSOR_AGENT: "1"
        },
        sandboxPolicy: policy,
        interactive: false
      })) {
        let dataSize = 0;
        if (event.type === "stdout" || event.type === "stderr") {
          dataSize = Buffer.byteLength(event.data, "utf8");
          if (mergedOutput) {
            mergedOutput.size += dataSize;
            mergedOutput.lineCount += event.data.split("\n").length - 1;
            if (mergedOutput.size > shell_core_MAX_OUTPUT_FILE_SIZE) {
              // We've exceeded allowed file size, so just drop.
            } else if (mergedOutput.file) {
              mergedOutput.file.write(event.data);
            } else {
              // Not met threshold yet, so just buffer.
              mergedOutput.buffer += event.data;
              if (mergedOutput.size > mergedOutput.threshold) {
                const agentToolsDir = external_node_path_.join(this.projectDir, "agent-tools");
                mergedOutput.path = external_node_path_.join(agentToolsDir, `${(0, external_node_crypto_.randomUUID)()}.txt`);
                await (0, promises_.mkdir)(external_node_path_.dirname(mergedOutput.path), {
                  recursive: true
                });
                mergedOutput.file = (0, external_node_fs_.createWriteStream)(mergedOutput.path);
                mergedOutput.file.write(mergedOutput.buffer);
              }
            }
          }
        }
        switch (event.type) {
          case "stdout":
            {
              if (!stdoutTrimmed) {
                if (stdoutSize + dataSize > MAX_BUFFER_SIZE) {
                  stdoutTrimmed = true;
                  yield {
                    type: "stdout_trimmed"
                  };
                } else {
                  stdoutSize += dataSize;
                  yield {
                    type: "stdout",
                    data: event.data
                  };
                }
              }
              break;
            }
          case "stderr":
            {
              if (!stderrTrimmed) {
                if (stderrSize + dataSize > MAX_BUFFER_SIZE) {
                  stderrTrimmed = true;
                  yield {
                    type: "stderr_trimmed"
                  };
                } else {
                  stderrSize += dataSize;
                  yield {
                    type: "stderr",
                    data: event.data
                  };
                }
              }
              break;
            }
          case "exit":
            {
              let outputLocation;
              if (mergedOutput?.file) {
                await new Promise(resolve => mergedOutput.file.end(resolve));
                outputLocation = new shell_exec_pb /* OutputLocation */.pV({
                  filePath: mergedOutput.path,
                  sizeBytes: BigInt(mergedOutput.size),
                  lineCount: BigInt(mergedOutput.lineCount)
                });
              }
              yield {
                type: "exit",
                code: event.code,
                outputLocation
              };
              break;
            }
          case "sandbox_denies":
            {
              yield {
                type: "sandbox_denies",
                events: event.events
              };
              break;
            }
        }
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      shell_core_disposeResources(env_1);
    }
  }
  /**
   * Get the current working directory from the underlying executor
   */
  async getCwd() {
    return this.executor.getCwd();
  }
  /**
   * Get the workspace root path
   */
  getWorkspacePath() {
    if (!this.workspacePath) {
      throw new Error("Workspace path is not configured");
    }
    return this.workspacePath;
  }
}
/**
 * Shell core executor that wraps around an inner ShellCoreExecutor and integrates
 * with the ShellManager to emit events for UI updates.
 *
 * This class handles:
 * - Delegating execution to the inner executor
 * - Creating shell emitters for each execution with a toolCallId
 * - Converting ShellCoreEvents to ShellManagerEvents and emitting them
 * - Passing through all events from the inner executor unchanged
 */
class ManagedShellCoreExecutor {
  constructor(innerExecutor, shellManager) {
    this.innerExecutor = innerExecutor;
    this.shellManager = shellManager;
  }
  /**
   * Execute a shell command through the inner executor and emit events to the shell manager
   */
  async *execute(ctx, args) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = shell_core_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("ManagedShellCoreExecutor.execute")), false);
      logger.info(ctx, "Executing shell command", {
        command: args.command,
        workingDirectory: args.workingDirectory,
        toolCallId: args.toolCallId
      });
      // Create shell emitter if toolCallId is provided
      let shellEmitter = null;
      if (args.toolCallId) {
        shellEmitter = this.shellManager.getOrCreateShellEmitter(args.toolCallId);
      }
      // Execute through the inner executor and emit events
      for await (const event of this.innerExecutor.execute(ctx, args)) {
        // Emit to shell manager if we have an emitter
        if (shellEmitter) {
          switch (event.type) {
            case "start":
              shellEmitter.emit({
                type: "start",
                sandboxed: event.sandboxed
              });
              break;
            case "stdout":
              shellEmitter.emit({
                type: "stdout",
                data: event.data
              });
              break;
            case "stderr":
              shellEmitter.emit({
                type: "stderr",
                data: event.data
              });
              break;
            case "exit":
              if (event.code !== null) {
                shellEmitter.emit({
                  type: "exit",
                  code: event.code
                });
              }
              break;
            // stdout_trimmed and stderr_trimmed events don't need to be emitted to shell manager
            // as they are informational events for the caller
          }
        }
        // Always yield the original event
        yield event;
      }
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      shell_core_disposeResources(env_2);
    }
  }
  /**
   * Get the current working directory from the inner executor
   */
  async getCwd() {
    return this.innerExecutor.getCwd();
  }
  /**
   * Get the workspace root path from the inner executor
   */
  getWorkspacePath() {
    return this.innerExecutor.getWorkspacePath();
  }
}
//# sourceMappingURL=shell-core.js.map