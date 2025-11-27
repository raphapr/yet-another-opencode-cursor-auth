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

/**
 * Core implementation of BackgroundShell
 */
class CoreBackgroundShell {
  constructor(id, abortController) {
    this.id = id;
    this.abortController = abortController;
    this.disposed = false;
  }
  /**
   * Abort this background shell (stops execution)
   */
  abort() {
    this.abortController.abort();
  }
  /**
   * Dispose this background shell (cleanup resources)
   * This will also abort the shell if it's still running
   */
  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    // Abort if still running
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
  }
  /**
   * Get the abort signal for this shell
   */
  get signal() {
    return this.abortController.signal;
  }
  /**
   * Check if this shell has been disposed
   */
  isDisposed() {
    return this.disposed;
  }
}
/**
 * Core factory that creates background shells without any additional behavior
 */
class CoreShellFactory {
  async spawn(executionContext, coreExecutor) {
    const abortController = new AbortController();
    const shell = new CoreBackgroundShell(executionContext.shellId, abortController);
    // Run the shell in the background without awaiting
    // Explicitly attach a catch handler to prevent unhandled rejections
    const executionPromise = (async () => {
      try {
        // Execute the shell command, consuming all events
        for await (const _event of coreExecutor.execute(executionContext.ctx, {
          command: executionContext.command,
          workingDirectory: executionContext.workingDirectory,
          signal: abortController.signal,
          toolCallId: executionContext.toolCallId,
          sandboxPolicy: executionContext.sandboxPolicy
        })) {
          // Events are consumed but not processed in core factory
        }
      } catch (_error) {
        // Silently handle errors in core factory
        // Middleware can handle error logging
      }
    })();
    // Attach a rejection handler to prevent unhandled rejections
    // This is needed because errors can occur asynchronously after disposal
    executionPromise.catch(_error => {
      // Already handled in try-catch above, but this prevents
      // "Unhandled Promise Rejection" errors in tests
    });
    return shell;
  }
}
/**
 * Middleware that writes shell output to a file
 */
class FileLoggingShellFactory {
  constructor(innerFactory, projectDir) {
    this.innerFactory = innerFactory;
    this.projectDir = projectDir;
  }
  async spawn(executionContext, coreExecutor) {
    // Ensure the terminals directory exists
    const terminalsDir = external_node_path_.join(this.projectDir, "terminals");
    await (0, promises_.mkdir)(terminalsDir, {
      recursive: true
    });
    // Create a custom core executor that intercepts events for logging
    const loggingExecutor = this.createLoggingExecutor(coreExecutor, executionContext, terminalsDir);
    // Spawn the shell with the logging executor
    return this.innerFactory.spawn(executionContext, loggingExecutor);
  }
  createLoggingExecutor(coreExecutor, executionContext, terminalsDir) {
    const originalExecute = coreExecutor.execute.bind(coreExecutor);
    return {
      ...coreExecutor,
      execute: async function* (ctx, args) {
        let fileHandle;
        // Helper to safely write to file handle without unhandled rejections
        const safeWrite = async data => {
          if (!fileHandle) {
            return;
          }
          try {
            await fileHandle.write(data);
          } catch (_error) {
            // Silently ignore EPIPE and other write errors
            // These are expected when the process is aborted during disposal
          }
        };
        try {
          // Use the shell ID from the execution context
          const shellId = executionContext.shellId;
          const terminalPath = external_node_path_.join(terminalsDir, `${shellId}.txt`);
          // Create the terminal file with initial header
          const header = `=== Background Shell ${shellId} ===\n` + `Command: ${executionContext.command}\n` + `Working Directory: ${executionContext.workingDirectory}\n` + `Started: ${new Date().toISOString()}\n` + `${"=".repeat(60)}\n\n`;
          external_node_fs_.writeFileSync(terminalPath, header);
          // Open the file for appending
          fileHandle = await external_node_fs_.promises.open(terminalPath, "a");
          // Execute and intercept events
          for await (const event of originalExecute(ctx, args)) {
            // Write to file based on event type
            if (event.type === "stdout") {
              await safeWrite(event.data);
            } else if (event.type === "stderr") {
              await safeWrite(event.data);
            } else if (event.type === "exit") {
              const exitMessage = `\n${"=".repeat(60)}\n` + `Exited with code: ${event.code ?? "unknown"}\n` + `Ended: ${new Date().toISOString()}\n`;
              await safeWrite(exitMessage);
            }
            // Yield the event to the next handler
            yield event;
          }
        } catch (error) {
          // Errors due to abort are expected when shells are disposed, don't re-throw them
          const isAborted = args.signal?.aborted ?? false;
          // Write error to file if possible (but not for aborted operations)
          if (fileHandle && !isAborted) {
            const errorMessage = `\n${"=".repeat(60)}\n` + `ERROR: ${error instanceof Error ? error.message : "Unknown error"}\n` + `Ended: ${new Date().toISOString()}\n`;
            await safeWrite(errorMessage);
          }
          // Don't re-throw errors from aborted operations as they're expected during disposal
          if (!isAborted) {
            throw error;
          }
        } finally {
          // Close file handle if open
          if (fileHandle) {
            try {
              const closePromise = fileHandle.close();
              // Attach error handler to prevent unhandled rejections
              closePromise.catch(() => {
                // Ignore EPIPE and other close errors
              });
              await closePromise;
            } catch {
              // Ignore errors closing file handle (e.g., already closed, EPIPE)
            }
          }
        }
      }
    };
  }
}
/**
 * Manages the lifecycle of background shells
 */
class BackgroundShellManager {
  constructor(factory) {
    this.factory = factory;
    this.runningShells = new Map();
  }
  /**
   * Spawn a background shell and return its ID
   */
  async spawn(executionContext, coreExecutor) {
    const shell = await this.factory.spawn(executionContext, coreExecutor);
    this.runningShells.set(shell.id, shell);
    // Clean up when shell completes (signal is aborted)
    shell.signal.addEventListener("abort", () => {
      this.runningShells.delete(shell.id);
    });
    return shell.id;
  }
  /**
   * Abort a background shell by ID (stops execution but doesn't dispose)
   */
  abort(shellId) {
    const shell = this.runningShells.get(shellId);
    if (shell) {
      shell.abort();
      this.runningShells.delete(shellId);
      return true;
    }
    return false;
  }
  /**
   * Check if a shell is still running
   */
  isRunning(shellId) {
    return this.runningShells.has(shellId);
  }
  /**
   * Dispose all background shells (cleanup resources)
   * This will abort any running shells and dispose all shells
   */
  dispose() {
    for (const shell of this.runningShells.values()) {
      shell.dispose();
    }
    this.runningShells.clear();
  }
}
/**
 * Middleware that notifies an external callback when shells are created
 * and allows event handlers to be registered for streaming output
 */
class EventStreamingShellFactory {
  constructor(innerFactory, creationCallback, conversationIdExtractor) {
    this.innerFactory = innerFactory;
    this.creationCallback = creationCallback;
    this.conversationIdExtractor = conversationIdExtractor;
  }
  async spawn(executionContext, coreExecutor) {
    // Create event handler registry
    const eventHandlers = [];
    // Create a custom core executor that intercepts events
    const streamingExecutor = this.createStreamingExecutor(coreExecutor, eventHandlers);
    // Spawn the shell with the streaming executor
    const shell = await this.innerFactory.spawn(executionContext, streamingExecutor);
    // Extract conversationId from context if extractor is provided
    const conversationId = this.conversationIdExtractor?.(executionContext.ctx);
    // Notify the callback that a shell was created
    // Pass a function that allows registering event handlers
    await this.creationCallback.onShellCreated(executionContext.shellId, executionContext.command, executionContext.workingDirectory, handler => {
      eventHandlers.push(handler);
    }, conversationId);
    return shell;
  }
  createStreamingExecutor(coreExecutor, eventHandlers) {
    const originalExecute = coreExecutor.execute.bind(coreExecutor);
    return {
      ...coreExecutor,
      execute: async function* (ctx, args) {
        // Notify start
        for (const handler of eventHandlers) {
          handler.onStart?.();
        }
        try {
          // Execute and intercept events
          for await (const event of originalExecute(ctx, args)) {
            // Forward events to registered handlers
            if (event.type === "stdout") {
              for (const handler of eventHandlers) {
                handler.onStdout(event.data);
              }
            } else if (event.type === "stderr") {
              for (const handler of eventHandlers) {
                handler.onStderr(event.data);
              }
            } else if (event.type === "exit") {
              for (const handler of eventHandlers) {
                handler.onExit(event.code);
              }
            }
            // Yield the event to the next handler
            yield event;
          }
        } catch (error) {
          // Errors due to abort are expected when shells are disposed
          const isAborted = args.signal?.aborted ?? false;
          // Notify handlers of exit on error (if not aborted)
          if (!isAborted) {
            for (const handler of eventHandlers) {
              handler.onExit(-1);
            }
            throw error;
          }
        }
      }
    };
  }
}
/**
 * Create a factory with file logging middleware
 */
function createBackgroundShellFactory(projectDir) {
  const coreFactory = new CoreShellFactory();
  return new FileLoggingShellFactory(coreFactory, projectDir);
}
/**
 * Create a factory with file logging and event streaming capabilities
 * @param conversationIdExtractor Optional function to extract conversationId from the context (for UI terminal lookup)
 */
function createBackgroundShellFactoryWithEventStreaming(projectDir, creationCallback, conversationIdExtractor) {
  const coreFactory = new CoreShellFactory();
  const fileLoggingFactory = new FileLoggingShellFactory(coreFactory, projectDir);
  return new EventStreamingShellFactory(fileLoggingFactory, creationCallback, conversationIdExtractor);
}
class LocalBackgroundShellExecutor {
  constructor(permissionsService, coreExecutor, _ignoreService, projectDir, factory) {
    this.permissionsService = permissionsService;
    this.coreExecutor = coreExecutor;
    // Use provided factory or create default with file logging middleware
    const shellFactory = factory ?? createBackgroundShellFactory(projectDir);
    this.backgroundShellManager = new BackgroundShellManager(shellFactory);
  }
  /**
   * Dispose all background shells and cleanup resources
   */
  dispose() {
    this.backgroundShellManager.dispose();
  }
  generateShellId() {
    // Generate a random integer between 1000 and 999999
    return Math.floor(Math.random() * 999000) + 1000;
  }
  async execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = __addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalBackgroundShellExecutor.execute")), false);
      const command = args.command;
      const policy = args.sandboxPolicy ? convertProtoToInternalPolicy(args.sandboxPolicy) : undefined;
      const workingDirectory = args.workingDirectory || (await this.coreExecutor.getCwd());
      const resolvedWorkingDir = resolvePath(workingDirectory);
      if (!args.parsingResult) {
        return new background_shell_exec_pb /* BackgroundShellSpawnResult */.Lt({
          result: {
            case: "error",
            value: new background_shell_exec_pb /* BackgroundShellSpawnError */.Of({
              command,
              workingDirectory: resolvedWorkingDir,
              error: "Parsing result is required"
            })
          }
        });
      }
      // Check permissions before spawning
      const blockResult = await this.permissionsService.shouldBlockShellCommand(ctx, command, {
        workingDirectory: resolvedWorkingDir,
        timeout: 0,
        // No timeout for background shells
        parsingResult: args.parsingResult,
        toolCallId: args.toolCallId
      }, policy);
      if (blockResult.kind === "block") {
        const isReadonly = blockResult.reason.type === "permissionsConfig" ? blockResult.reason.isReadonly ?? false : false;
        if (isReadonly) {
          return new background_shell_exec_pb /* BackgroundShellSpawnResult */.Lt({
            result: {
              case: "permissionDenied",
              value: new shell_exec_pb /* ShellPermissionDenied */.jn({
                command,
                workingDirectory: resolvedWorkingDir,
                error: "Command blocked by permissions configuration",
                isReadonly: true
              })
            }
          });
        }
        return new background_shell_exec_pb /* BackgroundShellSpawnResult */.Lt({
          result: {
            case: "rejected",
            value: new shell_exec_pb /* ShellRejected */.pZ({
              command,
              workingDirectory: resolvedWorkingDir,
              reason: blockResult.reason.type === "userRejected" ? blockResult.reason.reason : blockResult.reason.type === "needsApproval" ? "Command is not allowed" : "Command is not allowed"
            })
          }
        });
      }
      try {
        // Generate shell ID upfront
        const shellId = this.generateShellId();
        // Spawn the background shell
        const executionContext = {
          ctx,
          command,
          workingDirectory: resolvedWorkingDir,
          toolCallId: args.toolCallId,
          sandboxPolicy: blockResult.policy,
          shellId
        };
        await this.backgroundShellManager.spawn(executionContext, this.coreExecutor);
        return new background_shell_exec_pb /* BackgroundShellSpawnResult */.Lt({
          result: {
            case: "success",
            value: new background_shell_exec_pb /* BackgroundShellSpawnSuccess */.Po({
              shellId,
              command,
              workingDirectory: resolvedWorkingDir
            })
          }
        });
      } catch (error) {
        return new background_shell_exec_pb /* BackgroundShellSpawnResult */.Lt({
          result: {
            case: "error",
            value: new background_shell_exec_pb /* BackgroundShellSpawnError */.Of({
              command,
              workingDirectory: resolvedWorkingDir,
              error: error instanceof Error ? error.message : "Unknown error"
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=background-shell.js.map