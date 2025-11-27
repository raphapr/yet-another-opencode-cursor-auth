// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BaseShellCoreExecutor: () => (/* reexport */BaseShellCoreExecutor),
  ConnectServerConfigService: () => (/* reexport */ConnectServerConfigService),
  ConnectTeamSettingsService: () => (/* reexport */ConnectTeamSettingsService),
  ExecutableMcpToolSet: () => (/* reexport */ExecutableMcpToolSet),
  FileChangeTracker: () => (/* reexport */FileChangeTracker),
  IgnoreService: () => (/* reexport */LocalIgnoreService),
  InteractivePermissionsService: () => (/* reexport */InteractivePermissionsService),
  LazyIgnoreService: () => (/* reexport */LazyIgnoreService),
  LazyMcpToolSetLease: () => (/* reexport */LazyMcpToolSetLease),
  LineEnding: () => (/* reexport */LineEnding),
  LocalBackgroundShellExecutor: () => (/* reexport */LocalBackgroundShellExecutor),
  LocalCloudRulesService: () => (/* reexport */LocalCloudRulesService),
  LocalCursorRulesService: () => (/* reexport */LocalCursorRulesService),
  LocalDeleteExecutor: () => (/* reexport */LocalDeleteExecutor),
  LocalFetchExecutor: () => (/* reexport */LocalFetchExecutor),
  LocalGrepExecutor: () => (/* reexport */LocalGrepExecutor),
  LocalListMcpResourcesExecutor: () => (/* reexport */LocalListMcpResourcesExecutor),
  LocalLsExecutor: () => (/* reexport */LocalLsExecutor),
  LocalMcpToolExecutor: () => (/* reexport */LocalMcpToolExecutor),
  LocalReadExecutor: () => (/* reexport */LocalReadExecutor),
  LocalReadMcpResourceExecutor: () => (/* reexport */LocalReadMcpResourceExecutor),
  LocalRequestContextExecutor: () => (/* reexport */LocalRequestContextExecutor),
  LocalResourceProvider: () => (/* reexport */LocalResourceProvider),
  LocalShellExecutor: () => (/* reexport */LocalShellExecutor),
  LocalShellStreamExecutor: () => (/* reexport */LocalShellStreamExecutor),
  LocalSkillsService: () => (/* reexport */LocalSkillsService),
  LocalWriteExecutor: () => (/* reexport */LocalWriteExecutor),
  ManagerMcpLease: () => (/* reexport */ManagerMcpLease),
  McpLoaderWithCustomClients: () => (/* reexport */McpLoaderWithCustomClients),
  McpManager: () => (/* reexport */McpManager),
  McpSdkClient: () => (/* reexport */McpSdkClient),
  MergedCursorRulesService: () => (/* reexport */MergedCursorRulesService),
  MockIgnoreService: () => (/* reexport */MockIgnoreService),
  MockPendingDecisionProvider: () => (/* reexport */MockPendingDecisionProvider),
  MockPermissionsService: () => (/* reexport */MockPermissionsService),
  NoopMcpLease: () => (/* reexport */NoopMcpLease),
  OperationType: () => (/* reexport */OperationType),
  ShellEmitter: () => (/* reexport */ShellEmitter),
  ShellManager: () => (/* reexport */ShellManager),
  StaticServerConfigService: () => (/* reexport */StaticServerConfigService),
  countLines: () => (/* reexport */countLines),
  createBackgroundShellFactoryWithEventStreaming: () => (/* reexport */createBackgroundShellFactoryWithEventStreaming),
  findGitRoot: () => (/* reexport */findGitRoot),
  getBestFormatForPath: () => (/* reexport */getBestFormatForPath),
  getBufferForWrite: () => (/* reexport */getBufferForWrite),
  getFormatForBuffer: () => (/* reexport */getFormatForBuffer),
  getFormatForFile: () => (/* reexport */getFormatForFile),
  getFormatForWorkspace: () => (/* reexport */getFormatForWorkspace),
  readText: () => (/* reexport */readText),
  toHostPath: () => (/* reexport */toHostPath),
  writeText: () => (/* reexport */writeText)
});

// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__("node:fs/promises");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var dist = __webpack_require__("../context/dist/index.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/background_shell_exec_pb.js
var background_shell_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/background_shell_exec_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/shell_exec_pb.js
var shell_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/shell_exec_pb.js");
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__("node:os");
; // ../local-exec/dist/common.js

function untildify(path) {
  return path.replace(/^~(?=$|\/|\\)/, (0, external_node_os_.homedir)());
}
const resolvePath = (path, basePath) => {
  const untildified = untildify(path);
  // If a base path is provided and the path is not absolute, resolve relative to base path
  if (basePath && !(0, external_node_path_.isAbsolute)(untildified)) {
    return (0, external_node_path_.resolve)(basePath, untildified);
  }
  return (0, external_node_path_.resolve)(untildified);
};
/**
 * Resolve a path to its real path, following symlinks.
 * Falls back to the resolved path if realpath fails (e.g., broken symlink, permission denied).
 */
const resolveRealPath = async path => {
  const resolved = resolvePath(path);
  try {
    return await (0, promises_.realpath)(resolved);
  } catch {
    // If realpath fails (broken symlink, permission denied, etc.), fall back to resolved path
    return resolved;
  }
};
//# sourceMappingURL=common.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/sandbox_pb.js
var sandbox_pb = __webpack_require__("../proto/dist/generated/agent/v1/sandbox_pb.js");
; // ../local-exec/dist/sandbox-conversion.js

function convertProtoToInternalPolicy(policy) {
  if (!policy) {
    return {
      type: "insecure_none"
    };
  }
  switch (policy.type) {
    case sandbox_pb /* SandboxPolicy_Type */.v.INSECURE_NONE:
    case sandbox_pb /* SandboxPolicy_Type */.v.UNSPECIFIED:
      return {
        type: "insecure_none"
      };
    case sandbox_pb /* SandboxPolicy_Type */.v.WORKSPACE_READWRITE:
      return {
        type: "workspace_readwrite",
        network_access: !!policy.networkAccess,
        additional_readwrite_paths: policy.additionalReadwritePaths,
        additional_readonly_paths: policy.additionalReadonlyPaths,
        block_git_writes: policy.blockGitWrites
        // blocked_paths: policy.blockedPaths,
      };
    default:
      return {
        type: "insecure_none"
      };
  }
}
function convertInternalToProtoPolicy(policy) {
  if (!policy) return undefined;
  if (policy.type === "insecure_none") {
    return new sandbox_pb /* SandboxPolicy */.M({
      type: sandbox_pb /* SandboxPolicy_Type */.v.INSECURE_NONE
    });
  }
  if (policy.type === "workspace_readwrite") {
    return new sandbox_pb /* SandboxPolicy */.M({
      type: sandbox_pb /* SandboxPolicy_Type */.v.WORKSPACE_READWRITE,
      networkAccess: policy.network_access ?? false,
      additionalReadwritePaths: policy.additional_readwrite_paths ?? [],
      additionalReadonlyPaths: policy.additional_readonly_paths ?? [],
      blockGitWrites: policy.block_git_writes
      // blockedPaths: policy.blocked_paths ?? [],
    });
  }
  return new sandbox_pb /* SandboxPolicy */.M({
    type: sandbox_pb /* SandboxPolicy_Type */.v.INSECURE_NONE
  });
}
//# sourceMappingURL=sandbox-conversion.js.map
; // ../local-exec/dist/background-shell.js
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
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/delete_exec_pb.js
var delete_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/delete_exec_pb.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/iconv-lite@0.7.0/node_modules/iconv-lite/lib/index.js
var lib = __webpack_require__("../../node_modules/.pnpm/iconv-lite@0.7.0/node_modules/iconv-lite/lib/index.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/jschardet@3.1.4/node_modules/jschardet/index.js
var jschardet = __webpack_require__("../../node_modules/.pnpm/jschardet@3.1.4/node_modules/jschardet/index.js");
; // ../local-exec/dist/file-utils.js

var LineEnding;
(function (LineEnding) {
  LineEnding["CRLF"] = "CRLF";
  LineEnding["LF"] = "LF";
})(LineEnding || (LineEnding = {}));
// File extensions that indicate binary files
const BINARY_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp", ".svg", ".pdf", ".zip", ".tar", ".gz", ".exe", ".dll", ".so", ".dylib", ".bin"]);
// File extensions that indicate image files (subset of binary extensions)
const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|ico|bmp|svg)$/i;
/**
 * Gets the file extension from a file path in lowercase.
 */
function getFileExtension(filePath) {
  return filePath.toLowerCase().substring(filePath.lastIndexOf("."));
}
/**
 * Creates a ContentFormat for a binary file based on its extension.
 */
function getFormatFromFileExtension(filePath) {
  const ext = getFileExtension(filePath);
  return {
    encoding: "binary",
    lineEnding: LineEnding.LF,
    isBinaryFile: true,
    isImageFile: IMAGE_EXTENSIONS.test(ext)
  };
}
async function readText(file) {
  const buf = await (0, promises_.readFile)(file);
  const format = getFormatForBuffer(buf);
  const str = lib.decode(buf, format.encoding, {
    stripBOM: true,
    defaultEncoding: "utf8"
  });
  if (format.lineEnding === LineEnding.CRLF) {
    return str.replaceAll("\r\n", "\n");
  }
  return str;
}
async function writeText(file, content, workspaceRoot) {
  const {
    buffer
  } = await getBufferForWrite(file, content, workspaceRoot);
  await (0, promises_.writeFile)(file, buffer);
}
async function getBufferForWrite(file, content, workspaceRoot) {
  let format;
  try {
    if (workspaceRoot) {
      format = await getBestFormatForPath(file, workspaceRoot);
    } else {
      format = await getFormatForFile(file);
    }
  } catch {
    // Check if file extension indicates a binary file before falling back to default
    const ext = getFileExtension(file);
    if (BINARY_EXTENSIONS.has(ext)) {
      format = getFormatFromFileExtension(file);
    } else {
      format = getDefaultTextFormatForOS();
    }
  }
  const lines = countLines(content);
  if (format.lineEnding === LineEnding.CRLF) {
    content = content.replaceAll("\n", "\r\n");
  }
  // For binary files, check if content is base64-encoded and decode it
  // This handles cases where binary data is passed as base64 to avoid
  // corruption through protobuf string serialization (which uses UTF-8)
  // NOTE: we need this because we use protobuf string for file content,
  // which uses UTF-8 encoding. For binary files (like images), without
  // base64 decoding, the file content will be corrupted.
  if (format.encoding === "binary") {
    const buffer = decodeBinaryContent(content);
    return {
      lines,
      buffer,
      format
    };
  }
  return {
    lines,
    buffer: lib.encode(content, format.encoding, {
      defaultEncoding: "utf8"
    }),
    format
  };
}
async function getBestFormatForPath(possiblePath, workspaceRoot) {
  try {
    return await getFormatForFile(possiblePath);
  } catch {
    // Didn't work keep going
  }
  // Check if file extension indicates a binary file (images, etc.)
  const ext = getFileExtension(possiblePath);
  if (BINARY_EXTENSIONS.has(ext)) {
    return getFormatFromFileExtension(possiblePath);
  }
  try {
    return await getFormatForWorkspace(workspaceRoot);
  } catch {
    return getDefaultTextFormatForOS();
  }
}
async function getFormatForFile(file) {
  const header = await readFirstBytes(file);
  return getFormatForBuffer(header);
}
function countLines(data) {
  if (data === "") return 1;
  let lines = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === "\n") {
      lines++;
    }
  }
  return lines;
}
function getFormatForBuffer(header) {
  // Handle empty buffers explicitly
  if (header.length === 0) {
    return getDefaultTextFormatForOS();
  }
  // Detect UTF-16 encodings first (which contain null bytes as part of encoding)
  const utf16Encoding = detectUTF16Encoding(header);
  if (utf16Encoding) {
    return {
      encoding: utf16Encoding,
      lineEnding: determineLineEndingsForBuffer(header),
      isBinaryFile: false,
      isImageFile: false
    };
  }
  // Detect UTF-32 encodings which jschardet often misidentifies
  const utf32Encoding = detectUTF32Encoding(header);
  if (utf32Encoding) {
    return {
      encoding: utf32Encoding,
      lineEnding: determineLineEndingsForBuffer(header),
      isBinaryFile: false,
      isImageFile: false
    };
  }
  // Now check if it's binary (after checking for multi-byte text encodings)
  const isBinaryFile = !isBufferText(header);
  if (isBinaryFile) {
    return {
      encoding: "binary",
      lineEnding: LineEnding.LF,
      isBinaryFile: true,
      isImageFile: isBufferAnImage(header)
    };
  }
  const detect = jschardet.detect(header);
  let enc = detect.confidence > 0.7 ? detect.encoding : "utf-8";
  if (enc === "ascii") {
    enc = "utf-8";
  }
  return {
    encoding: enc ?? "utf-8",
    lineEnding: determineLineEndingsForBuffer(header),
    isBinaryFile: false,
    isImageFile: false
  };
}
async function getFormatForWorkspace(workspaceRoot) {
  // Iterate through files until we find at least three text files that have
  // the same encoding and line ending format
  // Track format combinations: key is "encoding:lineEnding", value is count
  const formatCounts = new Map();
  let filesProcessed = 0;
  const MAX_FILES_TO_CHECK = 100; // Limit to avoid spending too long
  for await (const filePath of walkDirectory(workspaceRoot)) {
    if (filesProcessed >= MAX_FILES_TO_CHECK) {
      break;
    }
    try {
      const format = await getFormatForFile(filePath);
      // Only count text files
      if (!format.isBinaryFile) {
        const key = `${format.encoding}:${format.lineEnding}`;
        const existing = formatCounts.get(key);
        if (existing) {
          existing.count++;
          if (existing.count >= 3) {
            // Found at least 3 files with the same format
            return existing.format;
          }
        } else {
          formatCounts.set(key, {
            format,
            count: 1
          });
        }
      }
      filesProcessed++;
    } catch (_error) {}
  }
  // If we didn't find 3 matching files, return the most common format
  let mostCommon;
  for (const entry of formatCounts.values()) {
    if (!mostCommon || entry.count > mostCommon.count) {
      mostCommon = entry;
    }
  }
  if (mostCommon) {
    return mostCommon.format;
  }
  // Fallback: UTF-8 with LF (most common for modern projects)
  return getDefaultTextFormatForOS();
}
function determineLineEndingsForBuffer(buffer) {
  // Use statistical analysis to determine what percentage of line endings are CRLF
  let crlfCount = 0;
  let lfOnlyCount = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0x0a) {
      // Found LF (\n)
      if (i > 0 && buffer[i - 1] === 0x0d) {
        // Preceded by CR (\r), so this is CRLF
        crlfCount++;
      } else {
        // LF without preceding CR
        lfOnlyCount++;
      }
    }
  }
  // If we have no line endings at all, default to LF
  if (crlfCount === 0 && lfOnlyCount === 0) {
    return LineEnding.LF;
  }
  // Return CRLF if at least 5% of line endings are CRLF, otherwise LF
  const totalLineEndings = crlfCount + lfOnlyCount;
  const crlfPercentage = crlfCount / totalLineEndings * 100;
  return crlfPercentage >= 5 ? LineEnding.CRLF : LineEnding.LF;
}
function isBufferText(buffer) {
  const len = Math.min(4096, buffer.length);
  // Empty buffers are treated as text
  if (len === 0) {
    return true;
  }
  // Null bytes are a strong indicator of binary content
  for (let i = 0; i < len; i++) {
    if (buffer[i] === 0x00) {
      return false;
    }
  }
  // Count non-printable characters (excluding common whitespace)
  let nonPrintableCount = 0;
  for (let i = 0; i < len; i++) {
    const byte = buffer[i];
    // Allow common whitespace: tab (0x09), LF (0x0a), CR (0x0d)
    // Allow printable ASCII: 0x20-0x7E
    // Allow extended ASCII/UTF-8: >= 0x80
    if (byte < 0x20 && byte !== 0x09 && byte !== 0x0a && byte !== 0x0d) {
      nonPrintableCount++;
    }
  }
  // If more than 5% are non-printable control characters, likely binary
  const nonPrintablePercentage = nonPrintableCount / len * 100;
  return nonPrintablePercentage < 5;
}
function isBufferAnImage(buffer) {
  // Detect WebP, JPEG, PNG header formats
  if (buffer.length < 4) {
    return false;
  }
  // Check for PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a) {
    return true;
  }
  // Check for JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }
  // Check for WebP: RIFF....WEBP
  if (buffer.length >= 12 && buffer[0] === 0x52 &&
  // R
  buffer[1] === 0x49 &&
  // I
  buffer[2] === 0x46 &&
  // F
  buffer[3] === 0x46 &&
  // F
  buffer[8] === 0x57 &&
  // W
  buffer[9] === 0x45 &&
  // E
  buffer[10] === 0x42 &&
  // B
  buffer[11] === 0x50 // P
  ) {
    return true;
  }
  // Check for GIF: GIF8
  if (buffer.length >= 6 && buffer[0] === 0x47 &&
  // G
  buffer[1] === 0x49 &&
  // I
  buffer[2] === 0x46 &&
  // F
  buffer[3] === 0x38 && (
  // 8
  buffer[4] === 0x37 || buffer[4] === 0x39) &&
  // 7 or 9
  buffer[5] === 0x61 // a
  ) {
    return true;
  }
  return false;
}
async function readFirstBytes(file) {
  const fileHandle = await (0, promises_.open)(file, "r");
  try {
    // NB: It's "unsafe" because it doesn't zero the buffer. We don't care
    // because we're about to overwrite it anyways
    const buffer = Buffer.allocUnsafe(8192);
    const {
      bytesRead
    } = await fileHandle.read(buffer, 0, 8192, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await fileHandle.close();
  }
}
async function* walkDirectory(dir) {
  // NB: This isn't Ideal but we can't guarantee that we have a git repo
  const IGNORED_DIRS = new Set(["node_modules", ".git", ".svn", ".hg", "dist", "build", "out", ".next", ".cache", "coverage", "__pycache__", ".venv", "venv", ".turbo"]);
  try {
    const entries = await (0, promises_.readdir)(dir, {
      withFileTypes: true
    });
    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".gitignore") {
        continue; // Skip hidden files/dirs except .gitignore
      }
      const fullPath = (0, external_node_path_.join)(dir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          yield* walkDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        yield fullPath;
      }
    }
  } catch (_error) {
    // Ignore permission errors or unreadable directories
    return;
  }
}
function getDefaultTextFormatForOS() {
  return {
    encoding: "utf8",
    lineEnding: false ? 0 : LineEnding.LF,
    isBinaryFile: false,
    isImageFile: false
  };
}
function detectUTF16Encoding(buffer) {
  if (buffer.length < 4) {
    return null;
  }
  // Check for UTF-16 BOM
  // UTF-16LE BOM: FF FE
  if (buffer[0] === 0xff && buffer[1] === 0xfe && !(buffer[2] === 0x00 && buffer[3] === 0x00)) {
    return "UTF-16LE";
  }
  // UTF-16BE BOM: FE FF
  if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    return "UTF-16BE";
  }
  // Check for UTF-16LE pattern: XX 00 where XX is printable ASCII
  let utf16LEMatches = 0;
  let utf16BEMatches = 0;
  const samplesToCheck = Math.min(50, Math.floor(buffer.length / 2));
  for (let i = 0; i < samplesToCheck * 2; i += 2) {
    if (i + 1 >= buffer.length) break;
    // UTF-16LE pattern: XX 00 (for basic ASCII)
    if (buffer[i + 1] === 0x00) {
      const char = buffer[i];
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf16LEMatches++;
      }
    }
    // UTF-16BE pattern: 00 XX (for basic ASCII)
    if (buffer[i] === 0x00) {
      const char = buffer[i + 1];
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf16BEMatches++;
      }
    }
  }
  // If more than 80% of the samples match UTF-16LE pattern, it's likely UTF-16LE
  if (utf16LEMatches > samplesToCheck * 0.8) {
    return "UTF-16LE";
  }
  // If more than 80% of the samples match UTF-16BE pattern, it's likely UTF-16BE
  if (utf16BEMatches > samplesToCheck * 0.8) {
    return "UTF-16BE";
  }
  return null;
}
function detectUTF32Encoding(buffer) {
  if (buffer.length < 8) {
    return null;
  }
  // Check for UTF-32 BOM
  // UTF-32BE BOM: 00 00 FE FF
  if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0xfe && buffer[3] === 0xff) {
    return "UTF-32BE";
  }
  // UTF-32LE BOM: FF FE 00 00
  if (buffer[0] === 0xff && buffer[1] === 0xfe && buffer[2] === 0x00 && buffer[3] === 0x00) {
    return "UTF-32LE";
  }
  // Check for UTF-32BE pattern: 00 00 00 XX where XX is printable ASCII
  // Count how many 4-byte sequences match the UTF-32BE pattern
  let utf32BEMatches = 0;
  let utf32LEMatches = 0;
  const samplesToCheck = Math.min(50, Math.floor(buffer.length / 4));
  for (let i = 0; i < samplesToCheck * 4; i += 4) {
    if (i + 3 >= buffer.length) break;
    // UTF-32BE pattern: 00 00 00 XX (for basic ASCII)
    if (buffer[i] === 0x00 && buffer[i + 1] === 0x00 && buffer[i + 2] === 0x00) {
      const char = buffer[i + 3];
      // Check if it's a printable ASCII or common whitespace
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf32BEMatches++;
      }
    }
    // UTF-32LE pattern: XX 00 00 00 (for basic ASCII)
    if (buffer[i + 1] === 0x00 && buffer[i + 2] === 0x00 && buffer[i + 3] === 0x00) {
      const char = buffer[i];
      // Check if it's a printable ASCII or common whitespace
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf32LEMatches++;
      }
    }
  }
  // If more than 80% of the samples match UTF-32BE pattern, it's likely UTF-32BE
  if (utf32BEMatches > samplesToCheck * 0.8) {
    return "UTF-32BE";
  }
  // If more than 80% of the samples match UTF-32LE pattern, it's likely UTF-32LE
  if (utf32LEMatches > samplesToCheck * 0.8) {
    return "UTF-32LE";
  }
  return null;
}
/**
 * Decodes binary content that may be base64-encoded or latin1-encoded.
 * This handles cases where binary data is passed as base64 to avoid
 * corruption through protobuf string serialization (which uses UTF-8).
 */
function decodeBinaryContent(content) {
  // Remove any whitespace that might have been introduced
  const cleanedContent = content.trim().replace(/\s/g, "");
  // Try base64 decoding first (most common case for binary data passed through protobuf)
  // Base64 strings contain only alphanumeric, +, /, = characters and are typically long
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  const MIN_BASE64_LENGTH = 50;
  const MIN_DECODED_RATIO = 0.5; // At least 50% of base64 length to account for padding
  if (cleanedContent.length > MIN_BASE64_LENGTH && base64Pattern.test(cleanedContent)) {
    try {
      const decoded = Buffer.from(cleanedContent, "base64");
      // Verify it decoded successfully and produced reasonable output
      // Base64 is ~4/3 the size of original, so decoded should be ~3/4 of base64 length
      if (decoded.length > 0) {
        const minExpectedLength = Math.floor(cleanedContent.length * MIN_DECODED_RATIO);
        if (decoded.length >= minExpectedLength) {
          return decoded;
        }
      }
    } catch {
      // If decoding fails, fall through to latin1 conversion
    }
  }
  // Fallback: convert latin1 string directly to buffer
  // (latin1 preserves byte values 0-255 exactly)
  // This handles cases where binary data was passed as latin1 string
  return Buffer.from(content, "latin1");
}
//# sourceMappingURL=file-utils.js.map
; // ../local-exec/dist/pending-decision-provider.js
var OperationType;
(function (OperationType) {
  OperationType["Write"] = "write";
  OperationType["Shell"] = "shell";
  OperationType["Delete"] = "delete";
  OperationType["Mcp"] = "mcp";
})(OperationType || (OperationType = {}));
//# sourceMappingURL=pending-decision-provider.js.map
; // ../local-exec/dist/utils/edit-block-handler.js
/**
 * Handles block reasons from the permissions service in a consistent way.
 * Returns a result to be returned from the executor, or null to continue with the operation.
 */
async function handleBlockReason(blockReason, callbacks) {
  switch (blockReason.type) {
    case "needsApproval":
      return callbacks.onNeedsApproval(blockReason.approvalReason, blockReason.approvalDetails);
    case "userRejected":
      return callbacks.onUserRejected(blockReason.reason);
    case "cursorIgnore":
      return callbacks.onPermissionDenied("Blocked by cursor ignore");
    case "permissionsConfig":
      return callbacks.onPermissionDenied("Blocked by permissions configuration", {
        isReadonly: blockReason.isReadonly
      });
    case "cursorFiles":
      return callbacks.onPermissionDenied("Blocked by cursor files protection");
    case "adminBlock":
      return callbacks.onPermissionDenied("Blocked by admin repository block");
    default:
      {
        const _exhaustive = blockReason;
        throw new Error(`Unhandled block reason type: ${JSON.stringify(_exhaustive)}`);
      }
  }
}
//# sourceMappingURL=edit-block-handler.js.map
; // ../local-exec/dist/delete.js
var delete_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var delete_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalDeleteExecutor {
  constructor(pendingDecisionProvider, fileChangeTracker, permissionsService, workspacePath) {
    this.pendingDecisionProvider = pendingDecisionProvider;
    this.fileChangeTracker = fileChangeTracker;
    this.permissionsService = permissionsService;
    this.workspacePath = workspacePath;
  }
  async execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = delete_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalDeleteExecutor.execute")), false);
      const path = args.path;
      const resolvedPath = resolvePath(path, this.workspacePath);
      const shouldBlock = await this.permissionsService.shouldBlockWrite(ctx, resolvedPath, "");
      if (shouldBlock) {
        const blockResult = await handleBlockReason(shouldBlock, {
          onNeedsApproval: async (_approvalReason, _approvalDetails) => {
            // We always prompt for delete approval, after this.
            return null;
          },
          onUserRejected: reason => new delete_exec_pb /* DeleteResult */.Pi({
            result: {
              case: "rejected",
              value: new delete_exec_pb /* DeleteRejected */.iq({
                path: resolvedPath,
                reason: reason || ""
              })
            }
          }),
          onPermissionDenied: (errorMessage, metadata) => new delete_exec_pb /* DeleteResult */.Pi({
            result: {
              case: "permissionDenied",
              value: new delete_exec_pb /* DeletePermissionDenied */.QG({
                path: resolvedPath,
                clientVisibleError: errorMessage,
                isReadonly: metadata?.isReadonly ?? false
              })
            }
          })
        });
        if (blockResult !== null) {
          return blockResult;
        }
      }
      const approvalResult = await this.pendingDecisionProvider.requestApproval({
        type: OperationType.Delete,
        details: {
          path: resolvedPath
        },
        toolCallId: args.toolCallId
      });
      if (!approvalResult.approved) {
        return new delete_exec_pb /* DeleteResult */.Pi({
          result: {
            case: "rejected",
            value: new delete_exec_pb /* DeleteRejected */.iq({
              path: resolvedPath,
              reason: approvalResult.reason || ""
            })
          }
        });
      }
      // Check if file exists and get stats
      let stats;
      try {
        stats = await (0, promises_.stat)(resolvedPath);
      } catch (error) {
        if (error.code === "ENOENT") {
          return new delete_exec_pb /* DeleteResult */.Pi({
            result: {
              case: "fileNotFound",
              value: new delete_exec_pb /* DeleteFileNotFound */.n0({
                path: resolvedPath
              })
            }
          });
        }
        return new delete_exec_pb /* DeleteResult */.Pi({
          result: {
            case: "error",
            value: new delete_exec_pb /* DeleteError */.GU({
              path: resolvedPath,
              error: error.message
            })
          }
        });
      }
      // Check if it's a regular file
      if (!stats.isFile()) {
        const actualType = stats.isDirectory() ? "directory" : "other";
        return new delete_exec_pb /* DeleteResult */.Pi({
          result: {
            case: "notFile",
            value: new delete_exec_pb /* DeleteNotFile */.LX({
              path: resolvedPath,
              actualType: actualType
            })
          }
        });
      }
      const fileSize = stats.size;
      // Read the file content before deletion if we have a tracker
      let fileContent;
      if (this.fileChangeTracker) {
        try {
          fileContent = await readText(resolvedPath);
        } catch {
          // If we can't read the file content, we'll still delete it
          // but won't be able to track the change for restoration
        }
      }
      // Delete the file
      try {
        await (0, promises_.unlink)(resolvedPath);
      } catch (error) {
        if (error.code === "EACCES") {
          return new delete_exec_pb /* DeleteResult */.Pi({
            result: {
              case: "permissionDenied",
              value: new delete_exec_pb /* DeletePermissionDenied */.QG({
                path: resolvedPath,
                clientVisibleError: "Permission denied"
              })
            }
          });
        }
        if (error.code === "EBUSY") {
          return new delete_exec_pb /* DeleteResult */.Pi({
            result: {
              case: "fileBusy",
              value: new delete_exec_pb /* DeleteFileBusy */.vX({
                path: resolvedPath
              })
            }
          });
        }
        return new delete_exec_pb /* DeleteResult */.Pi({
          result: {
            case: "error",
            value: new delete_exec_pb /* DeleteError */.GU({
              path: resolvedPath,
              error: error.message
            })
          }
        });
      }
      // Track the file deletion if we have a tracker and content
      if (this.fileChangeTracker && fileContent !== undefined) {
        const metadata = args.toolCallId ? {
          toolCallId: args.toolCallId
        } : undefined;
        this.fileChangeTracker.trackChange(resolvedPath, fileContent, undefined, metadata);
      }
      return new delete_exec_pb /* DeleteResult */.Pi({
        result: {
          case: "success",
          value: new delete_exec_pb /* DeleteSuccess */.fl({
            path: resolvedPath,
            deletedFile: resolvedPath,
            fileSize: BigInt(fileSize)
          })
        }
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      delete_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=delete.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/fetch_exec_pb.js
var fetch_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/fetch_exec_pb.js");
; // ../local-exec/dist/fetch.js
var fetch_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var fetch_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalFetchExecutor {
  async execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = fetch_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalFetchExecutor.execute")), false);
      const url = args.url;
      try {
        // Perform the fetch
        const response = await fetch(url);
        // Get the content as text
        const content = await response.text();
        // Get content type from headers
        const contentType = response.headers.get("content-type") || "text/plain";
        return new fetch_exec_pb /* FetchResult */.uN({
          result: {
            case: "success",
            value: new fetch_exec_pb /* FetchSuccess */.Uk({
              url: url,
              content: content,
              statusCode: response.status,
              contentType: contentType
            })
          }
        });
      } catch (error) {
        return new fetch_exec_pb /* FetchResult */.uN({
          result: {
            case: "error",
            value: new fetch_exec_pb /* FetchError */.fk({
              url: url,
              error: error.message
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      fetch_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=fetch.js.map
; // ../local-exec/dist/file-change-tracker.js

// used by the CLI
class FileChangeTracker {
  constructor(workspacePath) {
    this.workspacePath = workspacePath;
    this.changes = new Map();
    this.listeners = new Set();
  }
  /**
   * Subscribe to change notifications
   * @returns Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }
  /**
   * Notify all listeners that something changed
   */
  notify(change) {
    this.listeners.forEach(listener => {
      listener(change);
    });
  }
  /**
   * Track a file change
   * @param path The path to the file (should be normalized by the client)
   * @param before The content before the change (undefined for new files)
   * @param after The content after the change (undefined for deleted files)
   * @param metadata Optional metadata like toolCallId
   */
  trackChange(path, before, after, metadata) {
    const existingChange = this.changes.get(path);
    if (existingChange) {
      // Merge with existing change - keep original "before" state
      const originalBefore = existingChange.before;
      // Keep first metadata if not overridden
      const mergedMetadata = metadata || existingChange.metadata;
      // Check if this results in no net change
      if (originalBefore === after || originalBefore === undefined && after === undefined) {
        // No net change - remove from tracking
        this.changes.delete(path);
        this.notify();
      } else {
        // Update the change with merged state
        const change = {
          path,
          before: originalBefore,
          after,
          metadata: mergedMetadata
        };
        this.changes.set(path, change);
        this.notify(change);
      }
    } else {
      // No existing change - track as new
      const change = {
        path,
        before,
        after,
        metadata
      };
      this.changes.set(path, change);
      this.notify(change);
    }
  }
  /**
   * Get all tracked changes
   */
  getChanges() {
    return Array.from(this.changes.values());
  }
  /**
   * Get a specific change by path
   */
  getChange(path) {
    return this.changes.get(path);
  }
  /**
   * Check if a path has pending changes
   */
  hasChange(path) {
    return this.changes.has(path);
  }
  /**
   * Accept a change, removing it from the tracker
   */
  accept(path) {
    const change = this.changes.get(path);
    this.changes.delete(path);
    this.notify(change);
  }
  /**
   * Accept all changes, clearing the tracker
   */
  acceptAll() {
    this.changes.clear();
    this.notify();
  }
  /**
   * Reject a change by reverting the file to its original state
   */
  async reject(path) {
    const change = this.changes.get(path);
    if (!change) {
      return;
    }
    try {
      if (change.before === undefined && change.after !== undefined) {
        // File was created, delete it
        await (0, promises_.unlink)(path);
      } else if (change.before !== undefined && change.after === undefined) {
        // File was deleted, recreate it
        await writeText(path, change.before, this.workspacePath);
      } else if (change.before !== undefined && change.after !== undefined) {
        // File was modified, restore original content
        await writeText(path, change.before, this.workspacePath);
      }
    } catch {
      // Silently ignore errors during revert operations
    } finally {
      // Remove from tracker even if revert fails
      this.changes.delete(path);
      this.notify(change);
    }
  }
  /**
   * Reject all changes by reverting all files to their original states
   */
  async rejectAll() {
    const paths = Array.from(this.changes.keys());
    // Process all rejections in parallel
    await Promise.all(paths.map(path => this.reject(path)));
  }
  /**
   * Clear all tracked changes without reverting
   */
  clear() {
    // Get first change for notification, or undefined if none
    const change = this.changes.values().next().value;
    this.changes.clear();
    this.notify(change);
  }
  /**
   * Get the number of tracked changes
   */
  get size() {
    return this.changes.size;
  }
}
//# sourceMappingURL=file-change-tracker.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/grep_exec_pb.js
var grep_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/grep_exec_pb.js");
// EXTERNAL MODULE: ../shell-exec/dist/index.js + 19 modules
var shell_exec_dist = __webpack_require__("../shell-exec/dist/index.js");
; // ../local-exec/dist/int32.js
const INT32_MIN = -(2 ** 31);
const INT32_MAX = 2 ** 31 - 1;
/**
 * Clamps a number to the valid int32 range.
 */
function clampInt32(n) {
  if (n < INT32_MIN) {
    return INT32_MIN;
  }
  if (n > INT32_MAX) {
    return INT32_MAX;
  }
  return n;
}
//# sourceMappingURL=int32.js.map
; // ../local-exec/dist/grep.js
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
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/ls_exec_pb.js
var ls_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/ls_exec_pb.js");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var utils_dist = __webpack_require__("../utils/dist/index.js");
; // ../../node_modules/.pnpm/js-yaml@4.1.0/node_modules/js-yaml/dist/js-yaml.mjs

/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
function isNothing(subject) {
  return typeof subject === 'undefined' || subject === null;
}
function isObject(subject) {
  return typeof subject === 'object' && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = '',
    cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};

// YAML error class. http://stackoverflow.com/questions/8458984

function formatError(exception, compact) {
  var where = '',
    message = exception.reason || '(unknown reason)';
  if (!exception.mark) return message;
  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }
  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';
  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }
  return message + ' ' + where;
}
function YAMLException$1(reason, mark) {
  // Super constructor
  Error.call(this);
  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = new Error().stack || '';
  }
}

// Inherit from Error
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};
var exception = YAMLException$1;

// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}
function padStart(string, max) {
  return common.repeat(' ', max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== 'number') options.indent = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter !== 'number') options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = '',
    i,
    line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
    result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + ' | ' + line.str + '\n' + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + ' | ' + line.str + '\n';
  result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
    result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + ' | ' + line.str + '\n';
  }
  return result.replace(/\n$/, '');
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = ['kind', 'multi', 'resolve', 'construct', 'instanceOf', 'predicate', 'represent', 'representName', 'defaultStyle', 'styleAliases'];
var YAML_NODE_KINDS = ['scalar', 'sequence', 'mapping'];
function compileStyleAliases(map) {
  var result = {};
  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options = options; // keep original options in case user wants to extend this type later
  this.tag = tag;
  this.kind = options['kind'] || null;
  this.resolve = options['resolve'] || function () {
    return true;
  };
  this.construct = options['construct'] || function (data) {
    return data;
  };
  this.instanceOf = options['instanceOf'] || null;
  this.predicate = options['predicate'] || null;
  this.represent = options['represent'] || null;
  this.representName = options['representName'] || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.multi = options['multi'] || false;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;

/*eslint-disable max-len*/

function compileList(schema, name) {
  var result = [];
  schema[name].forEach(function (currentType) {
    var newIndex = result.length;
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap(/* lists... */
) {
  var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    },
    index,
    length;
  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    // Schema.extend(type)
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception('Schema.extend argument should be a Type, [ Type ], ' + 'or a schema definition ({ implicit: [...], explicit: [...] })');
  }
  implicit.forEach(function (type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
    if (type$1.loadKind && type$1.loadKind !== 'scalar') {
      throw new exception('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
    if (type$1.multi) {
      throw new exception('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });
  explicit.forEach(function (type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) {
    return data !== null ? data : '';
  }
});
var seq = new type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) {
    return data !== null ? data : [];
  }
});
var map = new type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [str, seq, map]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === '~' || max === 4 && (data === 'null' || data === 'Null' || data === 'NULL');
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () {
      return '~';
    },
    lowercase: function () {
      return 'null';
    },
    uppercase: function () {
      return 'NULL';
    },
    camelcase: function () {
      return 'Null';
    },
    empty: function () {
      return '';
    }
  },
  defaultStyle: 'lowercase'
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === 'true' || data === 'True' || data === 'TRUE') || max === 5 && (data === 'false' || data === 'False' || data === 'FALSE');
}
function constructYamlBoolean(data) {
  return data === 'true' || data === 'True' || data === 'TRUE';
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}
var bool = new type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) {
      return object ? 'true' : 'false';
    },
    uppercase: function (object) {
      return object ? 'TRUE' : 'FALSE';
    },
    camelcase: function (object) {
      return object ? 'True' : 'False';
    }
  },
  defaultStyle: 'lowercase'
});
function isHexCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */ || 0x41 /* A */ <= c && c <= 0x46 /* F */ || 0x61 /* a */ <= c && c <= 0x66 /* f */;
}
function isOctCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x37 /* 7 */;
}
function isDecCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length,
    index = 0,
    hasDigits = false,
    ch;
  if (!max) return false;
  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }
  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
    if (ch === 'x') {
      // base 16
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
    if (ch === 'o') {
      // base 8
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data,
    sign = 1,
    ch;
  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }
  ch = value[0];
  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === '0') return 0;
  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && object % 1 === 0 && !common.isNegativeZero(object);
}
var js_yaml_int = new type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function (obj) {
      return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1);
    },
    octal: function (obj) {
      return obj >= 0 ? '0o' + obj.toString(8) : '-0o' + obj.toString(8).slice(1);
    },
    decimal: function (obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function (obj) {
      return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() : '-0x' + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary: [2, 'bin'],
    octal: [8, 'oct'],
    decimal: [10, 'dec'],
    hexadecimal: [16, 'hex']
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
// 2.5e4, 2.5 and integers
'^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
// .2e4, .2
// special case, seems not from spec
'|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
// .inf
'|[-+]?\\.(?:inf|Inf|INF)' +
// .nan
'|\\.(?:nan|NaN|NAN))$');
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) ||
  // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === '_') {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, '').toLowerCase();
  sign = value[0] === '-' ? -1 : 1;
  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === '.inf') {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case 'lowercase':
        return '.nan';
      case 'uppercase':
        return '.NAN';
      case 'camelcase':
        return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '.inf';
      case 'uppercase':
        return '.INF';
      case 'camelcase':
        return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '-.inf';
      case 'uppercase':
        return '-.INF';
      case 'camelcase':
        return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }
  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && (object % 1 !== 0 || common.isNegativeZero(object));
}
var js_yaml_float = new type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});
var json = failsafe.extend({
  implicit: [_null, bool, js_yaml_int, js_yaml_float]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' +
// [1] year
'-([0-9][0-9])' +
// [2] month
'-([0-9][0-9])$'); // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' +
// [1] year
'-([0-9][0-9]?)' +
// [2] month
'-([0-9][0-9]?)' +
// [3] day
'(?:[Tt]|[ \\t]+)' +
// ...
'([0-9][0-9]?)' +
// [4] hour
':([0-9][0-9])' +
// [5] minute
':([0-9][0-9])' +
// [6] second
'(?:\\.([0-9]*))?' +
// [7] fraction
'(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' +
// [8] tz [9] tz_sign [10] tz_hour
'(?::([0-9][0-9]))?))?$'); // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match,
    year,
    month,
    day,
    hour,
    minute,
    second,
    fraction = 0,
    delta = null,
    tz_hour,
    tz_minute,
    date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +match[1];
  month = +match[2] - 1; // JS month starts with 0
  day = +match[3];
  if (!match[4]) {
    // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}
var timestamp = new type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}
var merge = new type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

/*eslint-disable no-bitwise*/

// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code,
    idx,
    bitlen = 0,
    max = data.length,
    map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;
    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx,
    tailbits,
    input = data.replace(/[\r\n=]/g, ''),
    // remove CR/LF & padding to simplify scan
    max = input.length,
    map = BASE64_MAP,
    bits = 0,
    result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 0xFF);
      result.push(bits >> 8 & 0xFF);
      result.push(bits & 0xFF);
    }
    bits = bits << 6 | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 0xFF);
    result.push(bits >> 8 & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 0xFF);
    result.push(bits >> 2 & 0xFF);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 0xFF);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object /*, style*/) {
  var result = '',
    bits = 0,
    idx,
    tail,
    max = object.length,
    map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map[bits >> 18 & 0x3F];
      result += map[bits >> 12 & 0x3F];
      result += map[bits >> 6 & 0x3F];
      result += map[bits & 0x3F];
    }
    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;
  if (tail === 0) {
    result += map[bits >> 18 & 0x3F];
    result += map[bits >> 12 & 0x3F];
    result += map[bits >> 6 & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[bits >> 10 & 0x3F];
    result += map[bits >> 4 & 0x3F];
    result += map[bits << 2 & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[bits >> 2 & 0x3F];
    result += map[bits << 4 & 0x3F];
    result += map[64];
    result += map[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === '[object Uint8Array]';
}
var binary = new type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [],
    index,
    length,
    pair,
    pairKey,
    pairHasKey,
    object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== '[object Object]') return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index,
    length,
    pair,
    keys,
    result,
    object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== '[object Object]') return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index,
    length,
    pair,
    keys,
    result,
    object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key,
    object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [timestamp, merge],
  explicit: [binary, omap, pairs, set]
});

/*eslint-disable max-len,no-use-before-define*/

var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 0x0A /* LF */ || c === 0x0D /* CR */;
}
function is_WHITE_SPACE(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */;
}
function is_WS_OR_EOL(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */ || c === 0x0A /* LF */ || c === 0x0D /* CR */;
}
function is_FLOW_INDICATOR(c) {
  return c === 0x2C /* , */ || c === 0x5B /* [ */ || c === 0x5D /* ] */ || c === 0x7B /* { */ || c === 0x7D /* } */;
}
function fromHexCode(c) {
  var lc;
  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;
  if (0x61 /* a */ <= lc && lc <= 0x66 /* f */) {
    return lc - 0x61 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 0x78 /* x */) {
    return 2;
  }
  if (c === 0x75 /* u */) {
    return 4;
  }
  if (c === 0x55 /* U */) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return c === 0x30 /* 0 */ ? '\x00' : c === 0x61 /* a */ ? '\x07' : c === 0x62 /* b */ ? '\x08' : c === 0x74 /* t */ ? '\x09' : c === 0x09 /* Tab */ ? '\x09' : c === 0x6E /* n */ ? '\x0A' : c === 0x76 /* v */ ? '\x0B' : c === 0x66 /* f */ ? '\x0C' : c === 0x72 /* r */ ? '\x0D' : c === 0x65 /* e */ ? '\x1B' : c === 0x20 /* Space */ ? ' ' : c === 0x22 /* " */ ? '\x22' : c === 0x2F /* / */ ? '/' : c === 0x5C /* \ */ ? '\x5C' : c === 0x4E /* N */ ? '\x85' : c === 0x5F /* _ */ ? '\xA0' : c === 0x4C /* L */ ? '\u2028' : c === 0x50 /* P */ ? '\u2029' : '';
}
function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode((c - 0x010000 >> 10) + 0xD800, (c - 0x010000 & 0x03FF) + 0xDC00);
}
var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function State$1(input, options) {
  this.input = input;
  this.filename = options['filename'] || null;
  this.schema = options['schema'] || _default;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy = options['legacy'] || false;
  this.json = options['json'] || false;
  this.listener = options['listener'] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;
  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }
    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 || 0x20 <= _character && _character <= 0x10FFFF)) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }
      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x0A /* LF */) {
    state.position++;
  } else if (ch === 0x0D /* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A /* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
    ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09 /* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 0x23 /* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A /* LF */ && ch !== 0x0D /* CR */ && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 0x20 /* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position,
    ch;
  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D /* - */ || ch === 0x2E /* . */) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
    following,
    captureStart,
    captureEnd,
    hasPendingContent,
    _line,
    _lineStart,
    _lineIndent,
    _kind = state.kind,
    _result = state.result,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 0x23 /* # */ || ch === 0x26 /* & */ || ch === 0x2A /* * */ || ch === 0x21 /* ! */ || ch === 0x7C /* | */ || ch === 0x3E /* > */ || ch === 0x27 /* ' */ || ch === 0x22 /* " */ || ch === 0x25 /* % */ || ch === 0x40 /* @ */ || ch === 0x60 /* ` */) {
    return false;
  }
  if (ch === 0x3F /* ? */ || ch === 0x2D /* - */) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 0x3A /* : */) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 0x23 /* # */) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x27 /* ' */) {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27 /* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 0x27 /* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x22 /* " */) {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22 /* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 0x5C /* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, 'unknown escape sequence');
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true,
    _line,
    _lineStart,
    _pos,
    _tag = state.tag,
    _result,
    _anchor = state.anchor,
    following,
    terminator,
    isPair,
    isExplicitPair,
    isMapping,
    overridableKeys = Object.create(null),
    keyNode,
    keyTag,
    valueNode,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x5B /* [ */) {
    terminator = 0x5D; /* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B /* { */) {
    terminator = 0x7D; /* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C /* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 0x3F /* ? */) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 0x3A /* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 0x2C /* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, 'unexpected end of the stream within a flow collection');
}
function readBlockScalar(state, nodeIndent) {
  var captureStart,
    folding,
    chomping = CHOMPING_CLIP,
    didReadContent = false,
    detectedIndent = false,
    textIndent = nodeIndent,
    emptyLines = 0,
    atMoreIndented = false,
    tmp,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 0x7C /* | */) {
    folding = false;
  } else if (ch === 0x3E /* > */) {
    folding = true;
  } else {
    return false;
  }
  state.kind = 'scalar';
  state.result = '';
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 0x2B /* + */ || ch === 0x2D /* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 0x2B /* + */ ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 0x23 /* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20 /* Space */) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {
      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {
      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

        // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

        // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) {
          // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

        // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

      // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = [],
    following,
    detected = false,
    ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }
    if (ch !== 0x2D /* - */) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
    allowCompact,
    _line,
    _keyLine,
    _keyLineStart,
    _keyPos,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = {},
    overridableKeys = Object.create(null),
    keyTag = null,
    keyNode = null,
    valueNode = null,
    atExplicitKey = false,
    detected = false,
    ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F /* ? */ || ch === 0x3A /* : */) && is_WS_OR_EOL(following)) {
      if (ch === 0x3F /* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }
      state.position += 1;
      ch = following;

      //
      // Implicit notation case. Flow-style node as the key first, then ":", and the value.
      //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 0x3A /* : */) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }
      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position,
    isVerbatim = false,
    isNamed = false,
    tagHandle,
    tagName,
    ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x21 /* ! */) return false;
  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 0x3C /* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 0x21 /* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = '!';
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 0x3E /* > */);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 0x21 /* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;
  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x26 /* & */) return false;
  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 0x2A /* * */) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
    allowBlockScalars,
    allowBlockCollections,
    indentStatus = 1,
    // 1: this>parent, 0: this=parent, -1: this<parent
    atNewLine = false,
    hasContent = false,
    typeIndex,
    typeQuantity,
    typeList,
    type,
    flowIndent,
    blockIndent;
  if (state.listener !== null) {
    state.listener('open', state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = '?';
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];
      if (type.resolve(state.result)) {
        // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }
    if (!type.resolve(state.result, state.tag)) {
      // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position,
    _position,
    directiveName,
    directiveArgs,
    hasDirectives = false,
    ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 0x25 /* % */) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 0x23 /* # */) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2D /* - */ && state.input.charCodeAt(state.position + 1) === 0x2D /* - */ && state.input.charCodeAt(state.position + 2) === 0x2D /* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 0x2E /* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A /* LF */ && input.charCodeAt(input.length - 1) !== 0x0D /* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf('\0');
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';
  while (state.input.charCodeAt(state.position) === 0x20 /* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== 'function') {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception('expected a single document in the stream, but found more');
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};

/*eslint-disable no-use-before-define*/

var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 0xFEFF;
var CHAR_TAB = 0x09; /* Tab */
var CHAR_LINE_FEED = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN = 0x0D; /* CR */
var CHAR_SPACE = 0x20; /* Space */
var CHAR_EXCLAMATION = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE = 0x22; /* " */
var CHAR_SHARP = 0x23; /* # */
var CHAR_PERCENT = 0x25; /* % */
var CHAR_AMPERSAND = 0x26; /* & */
var CHAR_SINGLE_QUOTE = 0x27; /* ' */
var CHAR_ASTERISK = 0x2A; /* * */
var CHAR_COMMA = 0x2C; /* , */
var CHAR_MINUS = 0x2D; /* - */
var CHAR_COLON = 0x3A; /* : */
var CHAR_EQUALS = 0x3D; /* = */
var CHAR_GREATER_THAN = 0x3E; /* > */
var CHAR_QUESTION = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET = 0x7B; /* { */
var CHAR_VERTICAL_LINE = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0x00] = '\\0';
ESCAPE_SEQUENCES[0x07] = '\\a';
ESCAPE_SEQUENCES[0x08] = '\\b';
ESCAPE_SEQUENCES[0x09] = '\\t';
ESCAPE_SEQUENCES[0x0A] = '\\n';
ESCAPE_SEQUENCES[0x0B] = '\\v';
ESCAPE_SEQUENCES[0x0C] = '\\f';
ESCAPE_SEQUENCES[0x0D] = '\\r';
ESCAPE_SEQUENCES[0x1B] = '\\e';
ESCAPE_SEQUENCES[0x22] = '\\"';
ESCAPE_SEQUENCES[0x5C] = '\\\\';
ESCAPE_SEQUENCES[0x85] = '\\N';
ESCAPE_SEQUENCES[0xA0] = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';
var DEPRECATED_BOOLEANS_SYNTAX = ['y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON', 'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;
  if (map === null) return {};
  result = {};
  keys = Object.keys(map);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);
    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];
    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new exception('code point within a string may not be greater than 0xFFFFFFFF');
  }
  return '\\' + handle + common.repeat('0', length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1,
  QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options['schema'] || _default;
  this.indent = Math.max(1, options['indent'] || 2);
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid = options['skipInvalid'] || false;
  this.flowLevel = common.isNothing(options['flowLevel']) ? -1 : options['flowLevel'];
  this.styleMap = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys = options['sortKeys'] || false;
  this.lineWidth = options['lineWidth'] || 80;
  this.noRefs = options['noRefs'] || false;
  this.noCompatMode = options['noCompatMode'] || false;
  this.condenseFlow = options['condenseFlow'] || false;
  this.quotingType = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options['forceQuotes'] || false;
  this.replacer = typeof options['replacer'] === 'function' ? options['replacer'] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = '';
  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
    position = 0,
    next = -1,
    result = '',
    line,
    length = string.length;
  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== '\n') result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}
function testImplicitResolving(state, str) {
  var index, length, type;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];
    if (type.resolve(str)) {
      return true;
    }
  }
  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return 0x00020 <= c && c <= 0x00007E || 0x000A1 <= c && c <= 0x00D7FF && c !== 0x2028 && c !== 0x2029 || 0x0E000 <= c && c <= 0x00FFFD && c !== CHAR_BOM || 0x10000 <= c && c <= 0x10FFFF;
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM
  // - b-char
  && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
  // ns-plain-safe
  inblock ?
  // c = flow-in
  cIsNsCharOrWhitespace : cIsNsCharOrWhitespace
  // - c-flow-indicator
  && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET

  // ns-plain-char
  ) && c !== CHAR_SHARP // false on '#'
  && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
  || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP // change to true on '[^ ]#'
  || prev === CHAR_COLON && cIsNsChar; // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET
  // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
  && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE
  // | “%” | “@” | “`”)
  && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos),
    second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1,
  STYLE_SINGLE = 2,
  STYLE_LITERAL = 3,
  STYLE_FOLDED = 4,
  STYLE_DOUBLE = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
          // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
    // No block styles in flow mode.
    || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }
    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception('impossible error: invalid scalar style');
    }
  }();
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip = string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : clip ? '' : '-';
  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1],
      line = match[2];
    moreIndented = line[0] === ' ';
    result += prefix + (!prevMoreIndented && !moreIndented && line !== '' ? '\n' : '') + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0,
    end,
    curr = 0,
    next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while (match = breakRe.exec(line)) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = curr > start ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1; // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = '',
    _tag = state.tag,
    index,
    length,
    value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) || typeof value === 'undefined' && writeNode(state, level, null, false, false)) {
      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = '[' + _result + ']';
}
function writeBlockSequence(state, level, object, compact) {
  var _result = '',
    _tag = state.tag,
    index,
    length,
    value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === 'undefined' && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}
function writeFlowMapping(state, level, object) {
  var _result = '',
    _tag = state.tag,
    objectKeyList = Object.keys(object),
    index,
    length,
    objectKey,
    objectValue,
    pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }
    if (state.dump.length > 1024) pairBuffer += '? ';
    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');
    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }
    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = '{' + _result + '}';
}
function writeBlockMapping(state, level, object, compact) {
  var _result = '',
    _tag = state.tag,
    objectKeyList = Object.keys(object),
    index,
    length,
    objectKey,
    objectValue,
    explicitPair,
    pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new exception('sortKeys must be a boolean or a function');
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';
    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }
    explicitPair = state.tag !== null && state.tag !== '?' || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }
    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];
    if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === 'object' && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }
      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;
        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new exception('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type === '[object Object]' || type === '[object Array]',
    duplicateIndex,
    duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== '?' || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception('unacceptable kind of an object to dump ' + type);
    }
    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(state.tag[0] === '!' ? state.tag.slice(1) : state.tag).replace(/!/g, '%21');
      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }
      state.dump = tagStr + ' ' + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [],
    duplicatesIndexes = [],
    index,
    length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({
      '': value
    }, '', value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';
  return '';
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' + 'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;

// Re-export all types in case user wants to create custom schema
var types = {
  binary: binary,
  float: js_yaml_float,
  map: map,
  null: _null,
  pairs: pairs,
  set: set,
  timestamp: timestamp,
  bool: bool,
  int: js_yaml_int,
  merge: merge,
  omap: omap,
  seq: seq,
  str: str
};

// Removed functions from JS-YAML 3.0.x
var safeLoad = renamed('safeLoad', 'load');
var safeLoadAll = renamed('safeLoadAll', 'loadAll');
var safeDump = renamed('safeDump', 'dump');
var jsYaml = {
  Type: Type,
  Schema: Schema,
  FAILSAFE_SCHEMA: FAILSAFE_SCHEMA,
  JSON_SCHEMA: JSON_SCHEMA,
  CORE_SCHEMA: CORE_SCHEMA,
  DEFAULT_SCHEMA: DEFAULT_SCHEMA,
  load: load,
  loadAll: loadAll,
  dump: dump,
  YAMLException: YAMLException,
  types: types,
  safeLoad: safeLoad,
  safeLoadAll: safeLoadAll,
  safeDump: safeDump
};

/* harmony default export */
const js_yaml = /* unused pure expression or super */null && jsYaml;

// EXTERNAL MODULE: ../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var zod_lib = __webpack_require__("../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs");
; // ../local-exec/dist/ripgrep-stream.js
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
; // ../local-exec/dist/ls.js
var ls_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var ls_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const DEFAULT_CHARACTER_BUDGET = 2_500;
/**
 * Zod schema for terminal frontmatter
 */
const FrontmatterSchema = zod_lib.z.object({
  cwd: zod_lib.z.string().optional().default(""),
  current_command: zod_lib.z.string().optional().default(""),
  last_commands: zod_lib.z.array(zod_lib.z.object({
    command: zod_lib.z.string(),
    cwd: zod_lib.z.string()
  })).optional().default([])
});
/**
 * Parse YAML frontmatter from terminal file contents
 */
function parseFrontmatter(fileContent) {
  const lines = fileContent.split("\n");
  if (lines.length < 3 || lines[0] !== "---") return undefined;
  // Find the closing ---
  const endIdx = lines.slice(1, 100).indexOf("---");
  if (endIdx === -1) return undefined;
  // Extract YAML content (endIdx is offset by 1 since we sliced from index 1)
  const yamlContent = lines.slice(1, endIdx + 1).join("\n");
  try {
    const parsed = load(yamlContent);
    const validated = FrontmatterSchema.parse(parsed);
    return validated;
  } catch {
    return undefined;
  }
}
// Check if this is an external terminal file and parse frontmatter
const maybeParseExternalTerminalFile = async (fileName, parentPath) => {
  const fullPath = (0, external_node_path_.join)(parentPath, fileName);
  const terminalInfo = (0, utils_dist /* extractTerminalId */.fg)(fullPath);
  if (!terminalInfo?.isExternal) {
    return;
  }
  let content;
  try {
    // Read first 200 lines to get frontmatter
    content = await (0, promises_.readFile)((0, external_node_path_.join)(parentPath, fileName), "utf-8");
  } catch {
    // Failed to read/parse frontmatter, continue without metadata
    return;
  }
  const lines = content.split("\n").slice(0, 200).join("\n");
  const frontmatter = parseFrontmatter(lines);
  if (!frontmatter) {
    return;
  }
  return new ls_exec_pb /* TerminalMetadata */.Y$({
    cwd: frontmatter.cwd,
    currentCommand: frontmatter.current_command ? new ls_exec_pb /* TerminalMetadata_Command */.Sf({
      command: frontmatter.current_command
    }) : undefined,
    lastCommands: frontmatter.last_commands.map(cmd => new ls_exec_pb /* TerminalMetadata_Command */.Sf({
      command: cmd.command
    }))
  });
};
class LocalLsExecutor {
  constructor(permissionsService, ignoreService, rgPath, workspacePath) {
    this.permissionsService = permissionsService;
    this.ignoreService = ignoreService;
    this.rgPath = rgPath;
    this.workspacePath = workspacePath;
  }
  async execute(parentCtx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = ls_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalLsExecutor.execute")), false);
      const ctx = span.ctx;
      const resolvedPath = resolvePath(args.path, this.workspacePath);
      try {
        // Check if path exists and is a directory
        let pathStats;
        try {
          pathStats = await (0, promises_.stat)(resolvedPath);
        } catch (_error) {
          return new ls_exec_pb /* LsResult */.fv({
            result: {
              case: "error",
              value: new ls_exec_pb /* LsError */.uj({
                path: resolvedPath,
                error: `Path does not exist: ${resolvedPath}`
              })
            }
          });
        }
        if (!pathStats.isDirectory()) {
          return new ls_exec_pb /* LsResult */.fv({
            result: {
              case: "error",
              value: new ls_exec_pb /* LsError */.uj({
                path: resolvedPath,
                error: `Path is not a directory: ${resolvedPath}`
              })
            }
          });
        }
        const sandboxPolicy = convertProtoToInternalPolicy(args.sandboxPolicy);
        const tree = await this.getDirectoryTree(ctx, resolvedPath, args.ignore, sandboxPolicy);
        return new ls_exec_pb /* LsResult */.fv({
          result: {
            case: "success",
            value: new ls_exec_pb /* LsSuccess */.PC({
              directoryTreeRoot: tree
            })
          }
        });
      } catch (error) {
        return new ls_exec_pb /* LsResult */.fv({
          result: {
            case: "error",
            value: new ls_exec_pb /* LsError */.uj({
              path: resolvedPath,
              error: error instanceof Error ? error.message : "Unknown error occurred"
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      ls_disposeResources(env_1);
    }
  }
  async getDirectoryTree(ctx, directoryPath, ignoreGlobs, sandboxPolicy) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = ls_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalLsExecutor.getDirectoryTree")), false);
      // Build tree by streaming file paths from ripgrep
      // Terminal metadata promises are set during streaming, awaited at end
      return await this.buildTreeFromRipgrepStream(ctx, directoryPath, ignoreGlobs, sandboxPolicy, DEFAULT_CHARACTER_BUDGET);
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      ls_disposeResources(env_2);
    }
  }
  /**
   * Build directory tree by streaming paths from ripgrep.
   * Process lines as they arrive - no buffering entire output.
   */
  async buildTreeFromRipgrepStream(ctx, directoryPath, ignoreGlobs, sandboxPolicy, characterBudget) {
    const normalizedRoot = (0, external_node_path_.resolve)(directoryPath);
    // Initialize tree structure
    const rootNode = new ls_exec_pb /* LsDirectoryTreeNode */.vq({
      absPath: normalizedRoot,
      childrenDirs: [],
      childrenFiles: [],
      childrenWereProcessed: true,
      fullSubtreeExtensionCounts: {}
    });
    const dirNodes = new Map();
    dirNodes.set(normalizedRoot, rootNode);
    // Track terminal metadata promises for parallel resolution
    const terminalMetadataPromises = [];
    // Mutable state for tracking budget
    const state = {
      charactersUsed: normalizedRoot.length,
      budgetExceeded: false
    };
    // Get cursor ignore files for this directory
    const cursorIgnoreFiles = await this.ignoreService.listCursorIgnoreFilesByRoot(directoryPath);
    // Stream files from ripgrep (auto-handles timeout, exit codes, stderr)
    for await (const line of ripwalk({
      rgPath: this.rgPath,
      root: directoryPath,
      excludeGlobs: ignoreGlobs,
      caseSensitive: true,
      cursorIgnoreFiles,
      sandboxPolicy
    })) {
      if (!line) continue;
      const filePath = (0, external_node_path_.resolve)(directoryPath, line);
      // Skip if not under root
      if (!filePath.startsWith(normalizedRoot)) continue;
      // Security: check blocklist and permissions in parallel
      const [repoBlocked, readBlocked] = await Promise.all([this.ignoreService.isRepoBlocked(filePath), this.permissionsService.shouldBlockRead(filePath)]);
      if (repoBlocked || readBlocked) continue;
      // Process this file path into tree
      this.addPathToTree(filePath, normalizedRoot, dirNodes, state, characterBudget, terminalMetadataPromises);
    }
    // Sort tree children for consistent output
    this.sortTreeChildren(rootNode);
    // Await all terminal metadata promises (parallel background reads)
    await Promise.all(terminalMetadataPromises);
    return rootNode;
  }
  /**
   * Add a single file path to the tree structure.
   * Called for each line streamed from ripgrep.
   */
  addPathToTree(filePath, normalizedRoot, dirNodes, state, characterBudget, terminalMetadataPromises) {
    const fileName = (0, external_node_path_.basename)(filePath);
    const dirPath = (0, external_node_path_.dirname)(filePath);
    // Ensure all ancestor directories exist
    this.ensureDirectoryPath(dirPath, normalizedRoot, dirNodes, state.budgetExceeded);
    const parentNode = dirNodes.get(dirPath);
    if (!parentNode) return;
    // Check character budget
    const fileCharCost = fileName.length;
    if (!state.budgetExceeded && state.charactersUsed + fileCharCost <= characterBudget) {
      const fileNode = new ls_exec_pb /* LsDirectoryTreeNode_File */.ur({
        name: fileName
      });
      parentNode.childrenFiles.push(fileNode);
      state.charactersUsed += fileCharCost;
      // Start terminal metadata read in parallel (background)
      const metadataPromise = maybeParseExternalTerminalFile(fileName, dirPath).then(metadata => {
        fileNode.terminalMetadata = metadata;
      });
      terminalMetadataPromises.push(metadataPromise);
    } else {
      // Budget exceeded - first time, mark all ancestors as incomplete
      if (!state.budgetExceeded) {
        state.budgetExceeded = true;
        // Mark all ancestor directories as incomplete since we won't process all their files
        let currentDir = dirPath;
        while (currentDir.startsWith(normalizedRoot)) {
          const node = dirNodes.get(currentDir);
          if (node) {
            node.childrenWereProcessed = false;
          }
          const parentDir = (0, external_node_path_.dirname)(currentDir);
          if (parentDir === currentDir) break;
          currentDir = parentDir;
        }
      }
      // Track extension counts for this file in all ancestors
      const extension = (0, external_node_path_.extname)(filePath);
      let currentDir = dirPath;
      while (currentDir.startsWith(normalizedRoot)) {
        const node = dirNodes.get(currentDir);
        if (node) {
          node.fullSubtreeExtensionCounts[extension] ??= 0;
          node.fullSubtreeExtensionCounts[extension] = clampInt32(node.fullSubtreeExtensionCounts[extension] + 1);
          node.numFiles ??= 0;
          node.numFiles = clampInt32(node.numFiles + 1);
        }
        const parentDir = (0, external_node_path_.dirname)(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
      }
    }
  }
  /**
   * Ensure directory path exists in tree, creating intermediate nodes as needed.
   */
  ensureDirectoryPath(dirPath, rootPath, dirNodes, budgetExceeded) {
    if (dirNodes.has(dirPath) || dirPath === rootPath) {
      return; // Already exists or is root
    }
    // Ensure parent exists first
    const parentPath = (0, external_node_path_.dirname)(dirPath);
    if (parentPath !== dirPath && parentPath.startsWith(rootPath)) {
      this.ensureDirectoryPath(parentPath, rootPath, dirNodes, budgetExceeded);
    }
    // Create this directory node
    const dirNode = new ls_exec_pb /* LsDirectoryTreeNode */.vq({
      absPath: dirPath,
      childrenDirs: [],
      childrenFiles: [],
      childrenWereProcessed: !budgetExceeded,
      fullSubtreeExtensionCounts: {}
    });
    dirNodes.set(dirPath, dirNode);
    // Add to parent's children
    const parentNode = dirNodes.get(parentPath);
    if (parentNode) {
      parentNode.childrenDirs.push(dirNode);
    }
  }
  /**
   * Recursively sort children directories and files by name.
   */
  sortTreeChildren(node) {
    node.childrenDirs.sort((a, b) => (0, external_node_path_.basename)(a.absPath).localeCompare((0, external_node_path_.basename)(b.absPath)));
    node.childrenFiles.sort((a, b) => a.name.localeCompare(b.name));
    // Recurse into child directories
    for (const childDir of node.childrenDirs) {
      this.sortTreeChildren(childDir);
    }
  }
}
//# sourceMappingURL=ls.js.map
// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__("node:crypto");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/mcp_exec_pb.js
var mcp_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/mcp_exec_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/mcp_pb.js
var mcp_pb = __webpack_require__("../proto/dist/generated/agent/v1/mcp_pb.js");
; // ../../node_modules/.pnpm/pkce-challenge@5.0.0/node_modules/pkce-challenge/dist/index.node.js
let index_node_crypto;
index_node_crypto = globalThis.crypto?.webcrypto ??
// Node.js [18-16] REPL
globalThis.crypto ??
// Node.js >18
Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, "node:crypto", 19)).then(m => m.webcrypto); // Node.js <18 Non-REPL
/**
 * Creates an array of length `size` of random bytes
 * @param size
 * @returns Array of random ints (0 to 255)
 */
async function getRandomValues(size) {
  return (await index_node_crypto).getRandomValues(new Uint8Array(size));
}
/** Generate cryptographically strong random string
 * @param size The desired length of the string
 * @returns The random string
 */
async function random(size) {
  const mask = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  let result = "";
  const randomUints = await getRandomValues(size);
  for (let i = 0; i < size; i++) {
    // cap the value of the randomIndex to mask.length - 1
    const randomIndex = randomUints[i] % mask.length;
    result += mask[randomIndex];
  }
  return result;
}
/** Generate a PKCE challenge verifier
 * @param length Length of the verifier
 * @returns A random verifier `length` characters long
 */
async function generateVerifier(length) {
  return await random(length);
}
/** Generate a PKCE code challenge from a code verifier
 * @param code_verifier
 * @returns The base64 url encoded code challenge
 */
async function generateChallenge(code_verifier) {
  const buffer = await (await index_node_crypto).subtle.digest("SHA-256", new TextEncoder().encode(code_verifier));
  // Generate base64url string
  // btoa is deprecated in Node.js but is used here for web browser compatibility
  // (which has no good replacement yet, see also https://github.com/whatwg/html/issues/6811)
  return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
}
/** Generate a PKCE challenge pair
 * @param length Length of the verifer (between 43-128). Defaults to 43.
 * @returns PKCE challenge pair
 */
async function pkceChallenge(length) {
  if (!length) length = 43;
  if (length < 43 || length > 128) {
    throw `Expected a length between 43 and 128. Received ${length}.`;
  }
  const verifier = await generateVerifier(length);
  const challenge = await generateChallenge(verifier);
  return {
    code_verifier: verifier,
    code_challenge: challenge
  };
}
/** Verify that a code_verifier produces the expected code challenge
 * @param code_verifier
 * @param expectedChallenge The code challenge to verify
 * @returns True if challenges are equal. False otherwise.
 */
async function verifyChallenge(code_verifier, expectedChallenge) {
  const actualChallenge = await generateChallenge(code_verifier);
  return actualChallenge === expectedChallenge;
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
var esm_types = __webpack_require__("../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/types.js");
; // ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/shared/auth.js

/**
 * RFC 9728 OAuth Protected Resource Metadata
 */
const OAuthProtectedResourceMetadataSchema = zod_lib.z.object({
  resource: zod_lib.z.string().url(),
  authorization_servers: zod_lib.z.array(zod_lib.z.string().url()).optional(),
  jwks_uri: zod_lib.z.string().url().optional(),
  scopes_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  bearer_methods_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  resource_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  resource_name: zod_lib.z.string().optional(),
  resource_documentation: zod_lib.z.string().optional(),
  resource_policy_uri: zod_lib.z.string().url().optional(),
  resource_tos_uri: zod_lib.z.string().url().optional(),
  tls_client_certificate_bound_access_tokens: zod_lib.z.boolean().optional(),
  authorization_details_types_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  dpop_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  dpop_bound_access_tokens_required: zod_lib.z.boolean().optional()
}).passthrough();
/**
 * RFC 8414 OAuth 2.0 Authorization Server Metadata
 */
const auth_OAuthMetadataSchema = zod_lib.z.object({
  issuer: zod_lib.z.string(),
  authorization_endpoint: zod_lib.z.string(),
  token_endpoint: zod_lib.z.string(),
  registration_endpoint: zod_lib.z.string().optional(),
  scopes_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  response_types_supported: zod_lib.z.array(zod_lib.z.string()),
  response_modes_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  grant_types_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  token_endpoint_auth_methods_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  token_endpoint_auth_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  service_documentation: zod_lib.z.string().optional(),
  revocation_endpoint: zod_lib.z.string().optional(),
  revocation_endpoint_auth_methods_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  revocation_endpoint_auth_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  introspection_endpoint: zod_lib.z.string().optional(),
  introspection_endpoint_auth_methods_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  introspection_endpoint_auth_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  code_challenge_methods_supported: zod_lib.z.array(zod_lib.z.string()).optional()
}).passthrough();
/**
 * OpenID Connect Discovery 1.0 Provider Metadata
 * see: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
 */
const OpenIdProviderMetadataSchema = zod_lib.z.object({
  issuer: zod_lib.z.string(),
  authorization_endpoint: zod_lib.z.string(),
  token_endpoint: zod_lib.z.string(),
  userinfo_endpoint: zod_lib.z.string().optional(),
  jwks_uri: zod_lib.z.string(),
  registration_endpoint: zod_lib.z.string().optional(),
  scopes_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  response_types_supported: zod_lib.z.array(zod_lib.z.string()),
  response_modes_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  grant_types_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  acr_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  subject_types_supported: zod_lib.z.array(zod_lib.z.string()),
  id_token_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()),
  id_token_encryption_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  id_token_encryption_enc_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  userinfo_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  userinfo_encryption_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  userinfo_encryption_enc_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  request_object_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  request_object_encryption_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  request_object_encryption_enc_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  token_endpoint_auth_methods_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  token_endpoint_auth_signing_alg_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  display_values_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  claim_types_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  claims_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  service_documentation: zod_lib.z.string().optional(),
  claims_locales_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  ui_locales_supported: zod_lib.z.array(zod_lib.z.string()).optional(),
  claims_parameter_supported: zod_lib.z.boolean().optional(),
  request_parameter_supported: zod_lib.z.boolean().optional(),
  request_uri_parameter_supported: zod_lib.z.boolean().optional(),
  require_request_uri_registration: zod_lib.z.boolean().optional(),
  op_policy_uri: zod_lib.z.string().optional(),
  op_tos_uri: zod_lib.z.string().optional()
}).passthrough();
/**
 * OpenID Connect Discovery metadata that may include OAuth 2.0 fields
 * This schema represents the real-world scenario where OIDC providers
 * return a mix of OpenID Connect and OAuth 2.0 metadata fields
 */
const OpenIdProviderDiscoveryMetadataSchema = OpenIdProviderMetadataSchema.merge(auth_OAuthMetadataSchema.pick({
  code_challenge_methods_supported: true
}));
/**
 * OAuth 2.1 token response
 */
const OAuthTokensSchema = zod_lib.z.object({
  access_token: zod_lib.z.string(),
  id_token: zod_lib.z.string().optional(),
  // Optional for OAuth 2.1, but necessary in OpenID Connect
  token_type: zod_lib.z.string(),
  expires_in: zod_lib.z.number().optional(),
  scope: zod_lib.z.string().optional(),
  refresh_token: zod_lib.z.string().optional()
}).strip();
/**
 * OAuth 2.1 error response
 */
const OAuthErrorResponseSchema = zod_lib.z.object({
  error: zod_lib.z.string(),
  error_description: zod_lib.z.string().optional(),
  error_uri: zod_lib.z.string().optional()
});
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration metadata
 */
const OAuthClientMetadataSchema = zod_lib.z.object({
  redirect_uris: zod_lib.z.array(zod_lib.z.string()).refine(uris => uris.every(uri => URL.canParse(uri)), {
    message: "redirect_uris must contain valid URLs"
  }),
  token_endpoint_auth_method: zod_lib.z.string().optional(),
  grant_types: zod_lib.z.array(zod_lib.z.string()).optional(),
  response_types: zod_lib.z.array(zod_lib.z.string()).optional(),
  client_name: zod_lib.z.string().optional(),
  client_uri: zod_lib.z.string().optional(),
  logo_uri: zod_lib.z.string().optional(),
  scope: zod_lib.z.string().optional(),
  contacts: zod_lib.z.array(zod_lib.z.string()).optional(),
  tos_uri: zod_lib.z.string().optional(),
  policy_uri: zod_lib.z.string().optional(),
  jwks_uri: zod_lib.z.string().optional(),
  jwks: zod_lib.z.any().optional(),
  software_id: zod_lib.z.string().optional(),
  software_version: zod_lib.z.string().optional(),
  software_statement: zod_lib.z.string().optional()
}).strip();
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration client information
 */
const OAuthClientInformationSchema = zod_lib.z.object({
  client_id: zod_lib.z.string(),
  client_secret: zod_lib.z.string().optional(),
  client_id_issued_at: zod_lib.z.number().optional(),
  client_secret_expires_at: zod_lib.z.number().optional()
}).strip();
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration full response (client information plus metadata)
 */
const OAuthClientInformationFullSchema = OAuthClientMetadataSchema.merge(OAuthClientInformationSchema);
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration error response
 */
const OAuthClientRegistrationErrorSchema = zod_lib.z.object({
  error: zod_lib.z.string(),
  error_description: zod_lib.z.string().optional()
}).strip();
/**
 * RFC 7009 OAuth 2.0 Token Revocation request
 */
const OAuthTokenRevocationRequestSchema = zod_lib.z.object({
  token: zod_lib.z.string(),
  token_type_hint: zod_lib.z.string().optional()
}).strip();
//# sourceMappingURL=auth.js.map
; // ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/shared/auth-utils.js
/**
 * Utilities for handling OAuth resource URIs.
 */
/**
 * Converts a server URL to a resource URL by removing the fragment.
 * RFC 8707 section 2 states that resource URIs "MUST NOT include a fragment component".
 * Keeps everything else unchanged (scheme, domain, port, path, query).
 */
function resourceUrlFromServerUrl(url) {
  const resourceURL = typeof url === "string" ? new URL(url) : new URL(url.href);
  resourceURL.hash = ''; // Remove fragment
  return resourceURL;
}
/**
 * Checks if a requested resource URL matches a configured resource URL.
 * A requested resource matches if it has the same scheme, domain, port,
 * and its path starts with the configured resource's path.
 *
 * @param requestedResource The resource URL being requested
 * @param configuredResource The resource URL that has been configured
 * @returns true if the requested resource matches the configured resource, false otherwise
 */
function checkResourceAllowed({
  requestedResource,
  configuredResource
}) {
  const requested = typeof requestedResource === "string" ? new URL(requestedResource) : new URL(requestedResource.href);
  const configured = typeof configuredResource === "string" ? new URL(configuredResource) : new URL(configuredResource.href);
  // Compare the origin (scheme, domain, and port)
  if (requested.origin !== configured.origin) {
    return false;
  }
  // Handle cases like requested=/foo and configured=/foo/
  if (requested.pathname.length < configured.pathname.length) {
    return false;
  }
  // Check if the requested path starts with the configured path
  // Ensure both paths end with / for proper comparison
  // This ensures that if we have paths like "/api" and "/api/users",
  // we properly detect that "/api/users" is a subpath of "/api"
  // By adding a trailing slash if missing, we avoid false positives
  // where paths like "/api123" would incorrectly match "/api"
  const requestedPath = requested.pathname.endsWith('/') ? requested.pathname : requested.pathname + '/';
  const configuredPath = configured.pathname.endsWith('/') ? configured.pathname : configured.pathname + '/';
  return requestedPath.startsWith(configuredPath);
}
//# sourceMappingURL=auth-utils.js.map
; // ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/server/auth/errors.js
/**
 * Base class for all OAuth errors
 */
class OAuthError extends Error {
  constructor(message, errorUri) {
    super(message);
    this.errorUri = errorUri;
    this.name = this.constructor.name;
  }
  /**
   * Converts the error to a standard OAuth error response object
   */
  toResponseObject() {
    const response = {
      error: this.errorCode,
      error_description: this.message
    };
    if (this.errorUri) {
      response.error_uri = this.errorUri;
    }
    return response;
  }
  get errorCode() {
    return this.constructor.errorCode;
  }
}
/**
 * Invalid request error - The request is missing a required parameter,
 * includes an invalid parameter value, includes a parameter more than once,
 * or is otherwise malformed.
 */
class InvalidRequestError extends OAuthError {}
InvalidRequestError.errorCode = "invalid_request";
/**
 * Invalid client error - Client authentication failed (e.g., unknown client, no client
 * authentication included, or unsupported authentication method).
 */
class InvalidClientError extends OAuthError {}
InvalidClientError.errorCode = "invalid_client";
/**
 * Invalid grant error - The provided authorization grant or refresh token is
 * invalid, expired, revoked, does not match the redirection URI used in the
 * authorization request, or was issued to another client.
 */
class InvalidGrantError extends OAuthError {}
InvalidGrantError.errorCode = "invalid_grant";
/**
 * Unauthorized client error - The authenticated client is not authorized to use
 * this authorization grant type.
 */
class UnauthorizedClientError extends OAuthError {}
UnauthorizedClientError.errorCode = "unauthorized_client";
/**
 * Unsupported grant type error - The authorization grant type is not supported
 * by the authorization server.
 */
class UnsupportedGrantTypeError extends OAuthError {}
UnsupportedGrantTypeError.errorCode = "unsupported_grant_type";
/**
 * Invalid scope error - The requested scope is invalid, unknown, malformed, or
 * exceeds the scope granted by the resource owner.
 */
class InvalidScopeError extends OAuthError {}
InvalidScopeError.errorCode = "invalid_scope";
/**
 * Access denied error - The resource owner or authorization server denied the request.
 */
class AccessDeniedError extends OAuthError {}
AccessDeniedError.errorCode = "access_denied";
/**
 * Server error - The authorization server encountered an unexpected condition
 * that prevented it from fulfilling the request.
 */
class ServerError extends OAuthError {}
ServerError.errorCode = "server_error";
/**
 * Temporarily unavailable error - The authorization server is currently unable to
 * handle the request due to a temporary overloading or maintenance of the server.
 */
class TemporarilyUnavailableError extends OAuthError {}
TemporarilyUnavailableError.errorCode = "temporarily_unavailable";
/**
 * Unsupported response type error - The authorization server does not support
 * obtaining an authorization code using this method.
 */
class UnsupportedResponseTypeError extends OAuthError {}
UnsupportedResponseTypeError.errorCode = "unsupported_response_type";
/**
 * Unsupported token type error - The authorization server does not support
 * the requested token type.
 */
class UnsupportedTokenTypeError extends OAuthError {}
UnsupportedTokenTypeError.errorCode = "unsupported_token_type";
/**
 * Invalid token error - The access token provided is expired, revoked, malformed,
 * or invalid for other reasons.
 */
class InvalidTokenError extends OAuthError {}
InvalidTokenError.errorCode = "invalid_token";
/**
 * Method not allowed error - The HTTP method used is not allowed for this endpoint.
 * (Custom, non-standard error)
 */
class MethodNotAllowedError extends OAuthError {}
MethodNotAllowedError.errorCode = "method_not_allowed";
/**
 * Too many requests error - Rate limit exceeded.
 * (Custom, non-standard error based on RFC 6585)
 */
class TooManyRequestsError extends OAuthError {}
TooManyRequestsError.errorCode = "too_many_requests";
/**
 * Invalid client metadata error - The client metadata is invalid.
 * (Custom error for dynamic client registration - RFC 7591)
 */
class InvalidClientMetadataError extends OAuthError {}
InvalidClientMetadataError.errorCode = "invalid_client_metadata";
/**
 * Insufficient scope error - The request requires higher privileges than provided by the access token.
 */
class InsufficientScopeError extends OAuthError {}
InsufficientScopeError.errorCode = "insufficient_scope";
/**
 * A utility class for defining one-off error codes
 */
class CustomOAuthError extends OAuthError {
  constructor(customErrorCode, message, errorUri) {
    super(message, errorUri);
    this.customErrorCode = customErrorCode;
  }
  get errorCode() {
    return this.customErrorCode;
  }
}
/**
 * A full list of all OAuthErrors, enabling parsing from error responses
 */
const OAUTH_ERRORS = {
  [InvalidRequestError.errorCode]: InvalidRequestError,
  [InvalidClientError.errorCode]: InvalidClientError,
  [InvalidGrantError.errorCode]: InvalidGrantError,
  [UnauthorizedClientError.errorCode]: UnauthorizedClientError,
  [UnsupportedGrantTypeError.errorCode]: UnsupportedGrantTypeError,
  [InvalidScopeError.errorCode]: InvalidScopeError,
  [AccessDeniedError.errorCode]: AccessDeniedError,
  [ServerError.errorCode]: ServerError,
  [TemporarilyUnavailableError.errorCode]: TemporarilyUnavailableError,
  [UnsupportedResponseTypeError.errorCode]: UnsupportedResponseTypeError,
  [UnsupportedTokenTypeError.errorCode]: UnsupportedTokenTypeError,
  [InvalidTokenError.errorCode]: InvalidTokenError,
  [MethodNotAllowedError.errorCode]: MethodNotAllowedError,
  [TooManyRequestsError.errorCode]: TooManyRequestsError,
  [InvalidClientMetadataError.errorCode]: InvalidClientMetadataError,
  [InsufficientScopeError.errorCode]: InsufficientScopeError
};
//# sourceMappingURL=errors.js.map
; // ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/client/auth.js

class UnauthorizedError extends Error {
  constructor(message) {
    super(message !== null && message !== void 0 ? message : "Unauthorized");
  }
}
/**
 * Determines the best client authentication method to use based on server support and client configuration.
 *
 * Priority order (highest to lowest):
 * 1. client_secret_basic (if client secret is available)
 * 2. client_secret_post (if client secret is available)
 * 3. none (for public clients)
 *
 * @param clientInformation - OAuth client information containing credentials
 * @param supportedMethods - Authentication methods supported by the authorization server
 * @returns The selected authentication method
 */
function selectClientAuthMethod(clientInformation, supportedMethods) {
  const hasClientSecret = clientInformation.client_secret !== undefined;
  // If server doesn't specify supported methods, use RFC 6749 defaults
  if (supportedMethods.length === 0) {
    return hasClientSecret ? "client_secret_post" : "none";
  }
  // Try methods in priority order (most secure first)
  if (hasClientSecret && supportedMethods.includes("client_secret_basic")) {
    return "client_secret_basic";
  }
  if (hasClientSecret && supportedMethods.includes("client_secret_post")) {
    return "client_secret_post";
  }
  if (supportedMethods.includes("none")) {
    return "none";
  }
  // Fallback: use what we have
  return hasClientSecret ? "client_secret_post" : "none";
}
/**
 * Applies client authentication to the request based on the specified method.
 *
 * Implements OAuth 2.1 client authentication methods:
 * - client_secret_basic: HTTP Basic authentication (RFC 6749 Section 2.3.1)
 * - client_secret_post: Credentials in request body (RFC 6749 Section 2.3.1)
 * - none: Public client authentication (RFC 6749 Section 2.1)
 *
 * @param method - The authentication method to use
 * @param clientInformation - OAuth client information containing credentials
 * @param headers - HTTP headers object to modify
 * @param params - URL search parameters to modify
 * @throws {Error} When required credentials are missing
 */
function applyClientAuthentication(method, clientInformation, headers, params) {
  const {
    client_id,
    client_secret
  } = clientInformation;
  switch (method) {
    case "client_secret_basic":
      applyBasicAuth(client_id, client_secret, headers);
      return;
    case "client_secret_post":
      applyPostAuth(client_id, client_secret, params);
      return;
    case "none":
      applyPublicAuth(client_id, params);
      return;
    default:
      throw new Error(`Unsupported client authentication method: ${method}`);
  }
}
/**
 * Applies HTTP Basic authentication (RFC 6749 Section 2.3.1)
 */
function applyBasicAuth(clientId, clientSecret, headers) {
  if (!clientSecret) {
    throw new Error("client_secret_basic authentication requires a client_secret");
  }
  const credentials = btoa(`${clientId}:${clientSecret}`);
  headers.set("Authorization", `Basic ${credentials}`);
}
/**
 * Applies POST body authentication (RFC 6749 Section 2.3.1)
 */
function applyPostAuth(clientId, clientSecret, params) {
  params.set("client_id", clientId);
  if (clientSecret) {
    params.set("client_secret", clientSecret);
  }
}
/**
 * Applies public client authentication (RFC 6749 Section 2.1)
 */
function applyPublicAuth(clientId, params) {
  params.set("client_id", clientId);
}
/**
 * Parses an OAuth error response from a string or Response object.
 *
 * If the input is a standard OAuth2.0 error response, it will be parsed according to the spec
 * and an instance of the appropriate OAuthError subclass will be returned.
 * If parsing fails, it falls back to a generic ServerError that includes
 * the response status (if available) and original content.
 *
 * @param input - A Response object or string containing the error response
 * @returns A Promise that resolves to an OAuthError instance
 */
async function parseErrorResponse(input) {
  const statusCode = input instanceof Response ? input.status : undefined;
  const body = input instanceof Response ? await input.text() : input;
  try {
    const result = OAuthErrorResponseSchema.parse(JSON.parse(body));
    const {
      error,
      error_description,
      error_uri
    } = result;
    const errorClass = OAUTH_ERRORS[error] || ServerError;
    return new errorClass(error_description || '', error_uri);
  } catch (error) {
    // Not a valid OAuth error response, but try to inform the user of the raw data anyway
    const errorMessage = `${statusCode ? `HTTP ${statusCode}: ` : ''}Invalid OAuth error response: ${error}. Raw body: ${body}`;
    return new ServerError(errorMessage);
  }
}
/**
 * Orchestrates the full auth flow with a server.
 *
 * This can be used as a single entry point for all authorization functionality,
 * instead of linking together the other lower-level functions in this module.
 */
async function auth(provider, options) {
  var _a, _b;
  try {
    return await authInternal(provider, options);
  } catch (error) {
    // Handle recoverable error types by invalidating credentials and retrying
    if (error instanceof InvalidClientError || error instanceof UnauthorizedClientError) {
      await ((_a = provider.invalidateCredentials) === null || _a === void 0 ? void 0 : _a.call(provider, 'all'));
      return await authInternal(provider, options);
    } else if (error instanceof InvalidGrantError) {
      await ((_b = provider.invalidateCredentials) === null || _b === void 0 ? void 0 : _b.call(provider, 'tokens'));
      return await authInternal(provider, options);
    }
    // Throw otherwise
    throw error;
  }
}
async function authInternal(provider, {
  serverUrl,
  authorizationCode,
  scope,
  resourceMetadataUrl,
  fetchFn
}) {
  let resourceMetadata;
  let authorizationServerUrl;
  try {
    resourceMetadata = await discoverOAuthProtectedResourceMetadata(serverUrl, {
      resourceMetadataUrl
    }, fetchFn);
    if (resourceMetadata.authorization_servers && resourceMetadata.authorization_servers.length > 0) {
      authorizationServerUrl = resourceMetadata.authorization_servers[0];
    }
  } catch (_a) {
    // Ignore errors and fall back to /.well-known/oauth-authorization-server
  }
  /**
   * If we don't get a valid authorization server metadata from protected resource metadata,
   * fallback to the legacy MCP spec's implementation (version 2025-03-26): MCP server acts as the Authorization server.
   */
  if (!authorizationServerUrl) {
    authorizationServerUrl = serverUrl;
  }
  const resource = await selectResourceURL(serverUrl, provider, resourceMetadata);
  const metadata = await discoverAuthorizationServerMetadata(authorizationServerUrl, {
    fetchFn
  });
  // Handle client registration if needed
  let clientInformation = await Promise.resolve(provider.clientInformation());
  if (!clientInformation) {
    if (authorizationCode !== undefined) {
      throw new Error("Existing OAuth client information is required when exchanging an authorization code");
    }
    if (!provider.saveClientInformation) {
      throw new Error("OAuth client information must be saveable for dynamic registration");
    }
    const fullInformation = await registerClient(authorizationServerUrl, {
      metadata,
      clientMetadata: provider.clientMetadata
    });
    await provider.saveClientInformation(fullInformation);
    clientInformation = fullInformation;
  }
  // Exchange authorization code for tokens
  if (authorizationCode !== undefined) {
    const codeVerifier = await provider.codeVerifier();
    const tokens = await exchangeAuthorization(authorizationServerUrl, {
      metadata,
      clientInformation,
      authorizationCode,
      codeVerifier,
      redirectUri: provider.redirectUrl,
      resource,
      addClientAuthentication: provider.addClientAuthentication,
      fetchFn: fetchFn
    });
    await provider.saveTokens(tokens);
    return "AUTHORIZED";
  }
  const tokens = await provider.tokens();
  // Handle token refresh or new authorization
  if (tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token) {
    try {
      // Attempt to refresh the token
      const newTokens = await refreshAuthorization(authorizationServerUrl, {
        metadata,
        clientInformation,
        refreshToken: tokens.refresh_token,
        resource,
        addClientAuthentication: provider.addClientAuthentication
      });
      await provider.saveTokens(newTokens);
      return "AUTHORIZED";
    } catch (error) {
      // If this is a ServerError, or an unknown type, log it out and try to continue. Otherwise, escalate so we can fix things and retry.
      if (!(error instanceof OAuthError) || error instanceof ServerError) {
        // Could not refresh OAuth tokens
      } else {
        // Refresh failed for another reason, re-throw
        throw error;
      }
    }
  }
  const state = provider.state ? await provider.state() : undefined;
  // Start new authorization flow
  const {
    authorizationUrl,
    codeVerifier
  } = await startAuthorization(authorizationServerUrl, {
    metadata,
    clientInformation,
    state,
    redirectUrl: provider.redirectUrl,
    scope: scope || provider.clientMetadata.scope,
    resource
  });
  await provider.saveCodeVerifier(codeVerifier);
  await provider.redirectToAuthorization(authorizationUrl);
  return "REDIRECT";
}
async function selectResourceURL(serverUrl, provider, resourceMetadata) {
  const defaultResource = resourceUrlFromServerUrl(serverUrl);
  // If provider has custom validation, delegate to it
  if (provider.validateResourceURL) {
    return await provider.validateResourceURL(defaultResource, resourceMetadata === null || resourceMetadata === void 0 ? void 0 : resourceMetadata.resource);
  }
  // Only include resource parameter when Protected Resource Metadata is present
  if (!resourceMetadata) {
    return undefined;
  }
  // Validate that the metadata's resource is compatible with our request
  if (!checkResourceAllowed({
    requestedResource: defaultResource,
    configuredResource: resourceMetadata.resource
  })) {
    throw new Error(`Protected resource ${resourceMetadata.resource} does not match expected ${defaultResource} (or origin)`);
  }
  // Prefer the resource from metadata since it's what the server is telling us to request
  return new URL(resourceMetadata.resource);
}
/**
 * Extract resource_metadata from response header.
 */
function extractResourceMetadataUrl(res) {
  const authenticateHeader = res.headers.get("WWW-Authenticate");
  if (!authenticateHeader) {
    return undefined;
  }
  const [type, scheme] = authenticateHeader.split(' ');
  if (type.toLowerCase() !== 'bearer' || !scheme) {
    return undefined;
  }
  const regex = /resource_metadata="([^"]*)"/;
  const match = regex.exec(authenticateHeader);
  if (!match) {
    return undefined;
  }
  try {
    return new URL(match[1]);
  } catch (_a) {
    return undefined;
  }
}
/**
 * Looks up RFC 9728 OAuth 2.0 Protected Resource Metadata.
 *
 * If the server returns a 404 for the well-known endpoint, this function will
 * return `undefined`. Any other errors will be thrown as exceptions.
 */
async function discoverOAuthProtectedResourceMetadata(serverUrl, opts, fetchFn = fetch) {
  const response = await discoverMetadataWithFallback(serverUrl, 'oauth-protected-resource', fetchFn, {
    protocolVersion: opts === null || opts === void 0 ? void 0 : opts.protocolVersion,
    metadataUrl: opts === null || opts === void 0 ? void 0 : opts.resourceMetadataUrl
  });
  if (!response || response.status === 404) {
    throw new Error(`Resource server does not implement OAuth 2.0 Protected Resource Metadata.`);
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} trying to load well-known OAuth protected resource metadata.`);
  }
  return OAuthProtectedResourceMetadataSchema.parse(await response.json());
}
/**
 * Helper function to handle fetch with CORS retry logic
 */
async function fetchWithCorsRetry(url, headers, fetchFn = fetch) {
  try {
    return await fetchFn(url, {
      headers
    });
  } catch (error) {
    if (error instanceof TypeError) {
      if (headers) {
        // CORS errors come back as TypeError, retry without headers
        return fetchWithCorsRetry(url, undefined, fetchFn);
      } else {
        // We're getting CORS errors on retry too, return undefined
        return undefined;
      }
    }
    throw error;
  }
}
/**
 * Constructs the well-known path for auth-related metadata discovery
 */
function buildWellKnownPath(wellKnownPrefix, pathname = '', options = {}) {
  // Strip trailing slash from pathname to avoid double slashes
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  return options.prependPathname ? `${pathname}/.well-known/${wellKnownPrefix}` : `/.well-known/${wellKnownPrefix}${pathname}`;
}
/**
 * Tries to discover OAuth metadata at a specific URL
 */
async function tryMetadataDiscovery(url, protocolVersion, fetchFn = fetch) {
  const headers = {
    "MCP-Protocol-Version": protocolVersion
  };
  return await fetchWithCorsRetry(url, headers, fetchFn);
}
/**
 * Determines if fallback to root discovery should be attempted
 */
function shouldAttemptFallback(response, pathname) {
  return !response || response.status === 404 && pathname !== '/';
}
/**
 * Generic function for discovering OAuth metadata with fallback support
 */
async function discoverMetadataWithFallback(serverUrl, wellKnownType, fetchFn, opts) {
  var _a, _b;
  const issuer = new URL(serverUrl);
  const protocolVersion = (_a = opts === null || opts === void 0 ? void 0 : opts.protocolVersion) !== null && _a !== void 0 ? _a : esm_types /* LATEST_PROTOCOL_VERSION */.aE;
  let url;
  if (opts === null || opts === void 0 ? void 0 : opts.metadataUrl) {
    url = new URL(opts.metadataUrl);
  } else {
    // Try path-aware discovery first
    const wellKnownPath = buildWellKnownPath(wellKnownType, issuer.pathname);
    url = new URL(wellKnownPath, (_b = opts === null || opts === void 0 ? void 0 : opts.metadataServerUrl) !== null && _b !== void 0 ? _b : issuer);
    url.search = issuer.search;
  }
  let response = await tryMetadataDiscovery(url, protocolVersion, fetchFn);
  // If path-aware discovery fails with 404 and we're not already at root, try fallback to root discovery
  if (!(opts === null || opts === void 0 ? void 0 : opts.metadataUrl) && shouldAttemptFallback(response, issuer.pathname)) {
    const rootUrl = new URL(`/.well-known/${wellKnownType}`, issuer);
    response = await tryMetadataDiscovery(rootUrl, protocolVersion, fetchFn);
  }
  return response;
}
/**
 * Looks up RFC 8414 OAuth 2.0 Authorization Server Metadata.
 *
 * If the server returns a 404 for the well-known endpoint, this function will
 * return `undefined`. Any other errors will be thrown as exceptions.
 *
 * @deprecated This function is deprecated in favor of `discoverAuthorizationServerMetadata`.
 */
async function discoverOAuthMetadata(issuer, {
  authorizationServerUrl,
  protocolVersion
} = {}, fetchFn = fetch) {
  if (typeof issuer === 'string') {
    issuer = new URL(issuer);
  }
  if (!authorizationServerUrl) {
    authorizationServerUrl = issuer;
  }
  if (typeof authorizationServerUrl === 'string') {
    authorizationServerUrl = new URL(authorizationServerUrl);
  }
  protocolVersion !== null && protocolVersion !== void 0 ? protocolVersion : protocolVersion = LATEST_PROTOCOL_VERSION;
  const response = await discoverMetadataWithFallback(authorizationServerUrl, 'oauth-authorization-server', fetchFn, {
    protocolVersion,
    metadataServerUrl: authorizationServerUrl
  });
  if (!response || response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} trying to load well-known OAuth metadata`);
  }
  return OAuthMetadataSchema.parse(await response.json());
}
/**
 * Builds a list of discovery URLs to try for authorization server metadata.
 * URLs are returned in priority order:
 * 1. OAuth metadata at the given URL
 * 2. OAuth metadata at root (if URL has path)
 * 3. OIDC metadata endpoints
 */
function buildDiscoveryUrls(authorizationServerUrl) {
  const url = typeof authorizationServerUrl === 'string' ? new URL(authorizationServerUrl) : authorizationServerUrl;
  const hasPath = url.pathname !== '/';
  const urlsToTry = [];
  if (!hasPath) {
    // Root path: https://example.com/.well-known/oauth-authorization-server
    urlsToTry.push({
      url: new URL('/.well-known/oauth-authorization-server', url.origin),
      type: 'oauth'
    });
    // OIDC: https://example.com/.well-known/openid-configuration
    urlsToTry.push({
      url: new URL(`/.well-known/openid-configuration`, url.origin),
      type: 'oidc'
    });
    return urlsToTry;
  }
  // Strip trailing slash from pathname to avoid double slashes
  let pathname = url.pathname;
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  // 1. OAuth metadata at the given URL
  // Insert well-known before the path: https://example.com/.well-known/oauth-authorization-server/tenant1
  urlsToTry.push({
    url: new URL(`/.well-known/oauth-authorization-server${pathname}`, url.origin),
    type: 'oauth'
  });
  // Root path: https://example.com/.well-known/oauth-authorization-server
  urlsToTry.push({
    url: new URL('/.well-known/oauth-authorization-server', url.origin),
    type: 'oauth'
  });
  // 3. OIDC metadata endpoints
  // RFC 8414 style: Insert /.well-known/openid-configuration before the path
  urlsToTry.push({
    url: new URL(`/.well-known/openid-configuration${pathname}`, url.origin),
    type: 'oidc'
  });
  // OIDC Discovery 1.0 style: Append /.well-known/openid-configuration after the path
  urlsToTry.push({
    url: new URL(`${pathname}/.well-known/openid-configuration`, url.origin),
    type: 'oidc'
  });
  return urlsToTry;
}
/**
 * Discovers authorization server metadata with support for RFC 8414 OAuth 2.0 Authorization Server Metadata
 * and OpenID Connect Discovery 1.0 specifications.
 *
 * This function implements a fallback strategy for authorization server discovery:
 * 1. Attempts RFC 8414 OAuth metadata discovery first
 * 2. If OAuth discovery fails, falls back to OpenID Connect Discovery
 *
 * @param authorizationServerUrl - The authorization server URL obtained from the MCP Server's
 *                                 protected resource metadata, or the MCP server's URL if the
 *                                 metadata was not found.
 * @param options - Configuration options
 * @param options.fetchFn - Optional fetch function for making HTTP requests, defaults to global fetch
 * @param options.protocolVersion - MCP protocol version to use, defaults to LATEST_PROTOCOL_VERSION
 * @returns Promise resolving to authorization server metadata, or undefined if discovery fails
 */
async function discoverAuthorizationServerMetadata(authorizationServerUrl, {
  fetchFn = fetch,
  protocolVersion = esm_types /* LATEST_PROTOCOL_VERSION */.aE
} = {}) {
  var _a;
  const headers = {
    'MCP-Protocol-Version': protocolVersion
  };
  // Get the list of URLs to try
  const urlsToTry = buildDiscoveryUrls(authorizationServerUrl);
  // Try each URL in order
  for (const {
    url: endpointUrl,
    type
  } of urlsToTry) {
    const response = await fetchWithCorsRetry(endpointUrl, headers, fetchFn);
    if (!response) {
      throw new Error(`CORS error trying to load ${type === 'oauth' ? 'OAuth' : 'OpenID provider'} metadata from ${endpointUrl}`);
    }
    if (!response.ok) {
      // Continue looking for any 4xx response code.
      if (response.status >= 400 && response.status < 500) {
        continue; // Try next URL
      }
      throw new Error(`HTTP ${response.status} trying to load ${type === 'oauth' ? 'OAuth' : 'OpenID provider'} metadata from ${endpointUrl}`);
    }
    // Parse and validate based on type
    if (type === 'oauth') {
      return auth_OAuthMetadataSchema.parse(await response.json());
    } else {
      const metadata = OpenIdProviderDiscoveryMetadataSchema.parse(await response.json());
      // MCP spec requires OIDC providers to support S256 PKCE
      if (!((_a = metadata.code_challenge_methods_supported) === null || _a === void 0 ? void 0 : _a.includes('S256'))) {
        throw new Error(`Incompatible OIDC provider at ${endpointUrl}: does not support S256 code challenge method required by MCP specification`);
      }
      return metadata;
    }
  }
  return undefined;
}
/**
 * Begins the authorization flow with the given server, by generating a PKCE challenge and constructing the authorization URL.
 */
async function startAuthorization(authorizationServerUrl, {
  metadata,
  clientInformation,
  redirectUrl,
  scope,
  state,
  resource
}) {
  const responseType = "code";
  const codeChallengeMethod = "S256";
  let authorizationUrl;
  if (metadata) {
    authorizationUrl = new URL(metadata.authorization_endpoint);
    if (!metadata.response_types_supported.includes(responseType)) {
      throw new Error(`Incompatible auth server: does not support response type ${responseType}`);
    }
    if (!metadata.code_challenge_methods_supported || !metadata.code_challenge_methods_supported.includes(codeChallengeMethod)) {
      throw new Error(`Incompatible auth server: does not support code challenge method ${codeChallengeMethod}`);
    }
  } else {
    authorizationUrl = new URL("/authorize", authorizationServerUrl);
  }
  // Generate PKCE challenge
  const challenge = await pkceChallenge();
  const codeVerifier = challenge.code_verifier;
  const codeChallenge = challenge.code_challenge;
  authorizationUrl.searchParams.set("response_type", responseType);
  authorizationUrl.searchParams.set("client_id", clientInformation.client_id);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge);
  authorizationUrl.searchParams.set("code_challenge_method", codeChallengeMethod);
  authorizationUrl.searchParams.set("redirect_uri", String(redirectUrl));
  if (state) {
    authorizationUrl.searchParams.set("state", state);
  }
  if (scope) {
    authorizationUrl.searchParams.set("scope", scope);
  }
  if (scope === null || scope === void 0 ? void 0 : scope.includes("offline_access")) {
    // if the request includes the OIDC-only "offline_access" scope,
    // we need to set the prompt to "consent" to ensure the user is prompted to grant offline access
    // https://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess
    authorizationUrl.searchParams.append("prompt", "consent");
  }
  if (resource) {
    authorizationUrl.searchParams.set("resource", resource.href);
  }
  return {
    authorizationUrl,
    codeVerifier
  };
}
/**
 * Exchanges an authorization code for an access token with the given server.
 *
 * Supports multiple client authentication methods as specified in OAuth 2.1:
 * - Automatically selects the best authentication method based on server support
 * - Falls back to appropriate defaults when server metadata is unavailable
 *
 * @param authorizationServerUrl - The authorization server's base URL
 * @param options - Configuration object containing client info, auth code, etc.
 * @returns Promise resolving to OAuth tokens
 * @throws {Error} When token exchange fails or authentication is invalid
 */
async function exchangeAuthorization(authorizationServerUrl, {
  metadata,
  clientInformation,
  authorizationCode,
  codeVerifier,
  redirectUri,
  resource,
  addClientAuthentication,
  fetchFn
}) {
  var _a;
  const grantType = "authorization_code";
  const tokenUrl = (metadata === null || metadata === void 0 ? void 0 : metadata.token_endpoint) ? new URL(metadata.token_endpoint) : new URL("/token", authorizationServerUrl);
  if ((metadata === null || metadata === void 0 ? void 0 : metadata.grant_types_supported) && !metadata.grant_types_supported.includes(grantType)) {
    throw new Error(`Incompatible auth server: does not support grant type ${grantType}`);
  }
  // Exchange code for tokens
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  });
  const params = new URLSearchParams({
    grant_type: grantType,
    code: authorizationCode,
    code_verifier: codeVerifier,
    redirect_uri: String(redirectUri)
  });
  if (addClientAuthentication) {
    addClientAuthentication(headers, params, authorizationServerUrl, metadata);
  } else {
    // Determine and apply client authentication method
    const supportedMethods = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.token_endpoint_auth_methods_supported) !== null && _a !== void 0 ? _a : [];
    const authMethod = selectClientAuthMethod(clientInformation, supportedMethods);
    applyClientAuthentication(authMethod, clientInformation, headers, params);
  }
  if (resource) {
    params.set("resource", resource.href);
  }
  const response = await (fetchFn !== null && fetchFn !== void 0 ? fetchFn : fetch)(tokenUrl, {
    method: "POST",
    headers,
    body: params
  });
  if (!response.ok) {
    throw await parseErrorResponse(response);
  }
  return OAuthTokensSchema.parse(await response.json());
}
/**
 * Exchange a refresh token for an updated access token.
 *
 * Supports multiple client authentication methods as specified in OAuth 2.1:
 * - Automatically selects the best authentication method based on server support
 * - Preserves the original refresh token if a new one is not returned
 *
 * @param authorizationServerUrl - The authorization server's base URL
 * @param options - Configuration object containing client info, refresh token, etc.
 * @returns Promise resolving to OAuth tokens (preserves original refresh_token if not replaced)
 * @throws {Error} When token refresh fails or authentication is invalid
 */
async function refreshAuthorization(authorizationServerUrl, {
  metadata,
  clientInformation,
  refreshToken,
  resource,
  addClientAuthentication,
  fetchFn
}) {
  var _a;
  const grantType = "refresh_token";
  let tokenUrl;
  if (metadata) {
    tokenUrl = new URL(metadata.token_endpoint);
    if (metadata.grant_types_supported && !metadata.grant_types_supported.includes(grantType)) {
      throw new Error(`Incompatible auth server: does not support grant type ${grantType}`);
    }
  } else {
    tokenUrl = new URL("/token", authorizationServerUrl);
  }
  // Exchange refresh token
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded"
  });
  const params = new URLSearchParams({
    grant_type: grantType,
    refresh_token: refreshToken
  });
  if (addClientAuthentication) {
    addClientAuthentication(headers, params, authorizationServerUrl, metadata);
  } else {
    // Determine and apply client authentication method
    const supportedMethods = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.token_endpoint_auth_methods_supported) !== null && _a !== void 0 ? _a : [];
    const authMethod = selectClientAuthMethod(clientInformation, supportedMethods);
    applyClientAuthentication(authMethod, clientInformation, headers, params);
  }
  if (resource) {
    params.set("resource", resource.href);
  }
  const response = await (fetchFn !== null && fetchFn !== void 0 ? fetchFn : fetch)(tokenUrl, {
    method: "POST",
    headers,
    body: params
  });
  if (!response.ok) {
    throw await parseErrorResponse(response);
  }
  return OAuthTokensSchema.parse({
    refresh_token: refreshToken,
    ...(await response.json())
  });
}
/**
 * Performs OAuth 2.0 Dynamic Client Registration according to RFC 7591.
 */
async function registerClient(authorizationServerUrl, {
  metadata,
  clientMetadata,
  fetchFn
}) {
  let registrationUrl;
  if (metadata) {
    if (!metadata.registration_endpoint) {
      throw new Error("Incompatible auth server: does not support dynamic client registration");
    }
    registrationUrl = new URL(metadata.registration_endpoint);
  } else {
    registrationUrl = new URL("/register", authorizationServerUrl);
  }
  const response = await (fetchFn !== null && fetchFn !== void 0 ? fetchFn : fetch)(registrationUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(clientMetadata)
  });
  if (!response.ok) {
    throw await parseErrorResponse(response);
  }
  return OAuthClientInformationFullSchema.parse(await response.json());
}
//# sourceMappingURL=auth.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js + 1 modules
var client = __webpack_require__("../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js
var cross_spawn = __webpack_require__("../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js");
// EXTERNAL MODULE: external "node:process"
var external_node_process_ = __webpack_require__("node:process");
// EXTERNAL MODULE: external "node:stream"
var external_node_stream_ = __webpack_require__("node:stream");
; // ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/shared/stdio.js

/**
 * Buffers a continuous stdio stream into discrete JSON-RPC messages.
 */
class ReadBuffer {
  append(chunk) {
    this._buffer = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
  }
  readMessage() {
    if (!this._buffer) {
      return null;
    }
    const index = this._buffer.indexOf("\n");
    if (index === -1) {
      return null;
    }
    const line = this._buffer.toString("utf8", 0, index).replace(/\r$/, '');
    this._buffer = this._buffer.subarray(index + 1);
    return deserializeMessage(line);
  }
  clear() {
    this._buffer = undefined;
  }
}
function deserializeMessage(line) {
  return esm_types /* JSONRPCMessageSchema */.OR.parse(JSON.parse(line));
}
function serializeMessage(message) {
  return JSON.stringify(message) + "\n";
}
//# sourceMappingURL=stdio.js.map
; // ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js

/**
 * Environment variables to inherit by default, if an environment is not explicitly given.
 */
const DEFAULT_INHERITED_ENV_VARS = false ? 0 : /* list inspired by the default env inheritance of sudo */
["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"];
/**
 * Returns a default environment object including only environment variables deemed safe to inherit.
 */
function getDefaultEnvironment() {
  const env = {};
  for (const key of DEFAULT_INHERITED_ENV_VARS) {
    const value = external_node_process_.env[key];
    if (value === undefined) {
      continue;
    }
    if (value.startsWith("()")) {
      // Skip functions, which are a security risk.
      continue;
    }
    env[key] = value;
  }
  return env;
}
/**
 * Client transport for stdio: this will connect to a server by spawning a process and communicating with it over stdin/stdout.
 *
 * This transport is only available in Node.js environments.
 */
class StdioClientTransport {
  constructor(server) {
    this._abortController = new AbortController();
    this._readBuffer = new ReadBuffer();
    this._stderrStream = null;
    this._serverParams = server;
    if (server.stderr === "pipe" || server.stderr === "overlapped") {
      this._stderrStream = new external_node_stream_.PassThrough();
    }
  }
  /**
   * Starts the server process and prepares to communicate with it.
   */
  async start() {
    if (this._process) {
      throw new Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    }
    return new Promise((resolve, reject) => {
      var _a, _b, _c, _d, _e;
      this._process = cross_spawn(this._serverParams.command, (_a = this._serverParams.args) !== null && _a !== void 0 ? _a : [], {
        // merge default env with server env because mcp server needs some env vars
        env: {
          ...getDefaultEnvironment(),
          ...this._serverParams.env
        },
        stdio: ["pipe", "pipe", (_b = this._serverParams.stderr) !== null && _b !== void 0 ? _b : "inherit"],
        shell: false,
        signal: this._abortController.signal,
        windowsHide: false && 0,
        cwd: this._serverParams.cwd
      });
      this._process.on("error", error => {
        var _a, _b;
        if (error.name === "AbortError") {
          // Expected when close() is called.
          (_a = this.onclose) === null || _a === void 0 ? void 0 : _a.call(this);
          return;
        }
        reject(error);
        (_b = this.onerror) === null || _b === void 0 ? void 0 : _b.call(this, error);
      });
      this._process.on("spawn", () => {
        resolve();
      });
      this._process.on("close", _code => {
        var _a;
        this._process = undefined;
        (_a = this.onclose) === null || _a === void 0 ? void 0 : _a.call(this);
      });
      (_c = this._process.stdin) === null || _c === void 0 ? void 0 : _c.on("error", error => {
        var _a;
        (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, error);
      });
      (_d = this._process.stdout) === null || _d === void 0 ? void 0 : _d.on("data", chunk => {
        this._readBuffer.append(chunk);
        this.processReadBuffer();
      });
      (_e = this._process.stdout) === null || _e === void 0 ? void 0 : _e.on("error", error => {
        var _a;
        (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, error);
      });
      if (this._stderrStream && this._process.stderr) {
        this._process.stderr.pipe(this._stderrStream);
      }
    });
  }
  /**
   * The stderr stream of the child process, if `StdioServerParameters.stderr` was set to "pipe" or "overlapped".
   *
   * If stderr piping was requested, a PassThrough stream is returned _immediately_, allowing callers to
   * attach listeners before the start method is invoked. This prevents loss of any early
   * error output emitted by the child process.
   */
  get stderr() {
    var _a, _b;
    if (this._stderrStream) {
      return this._stderrStream;
    }
    return (_b = (_a = this._process) === null || _a === void 0 ? void 0 : _a.stderr) !== null && _b !== void 0 ? _b : null;
  }
  /**
   * The child process pid spawned by this transport.
   *
   * This is only available after the transport has been started.
   */
  get pid() {
    var _a, _b;
    return (_b = (_a = this._process) === null || _a === void 0 ? void 0 : _a.pid) !== null && _b !== void 0 ? _b : null;
  }
  processReadBuffer() {
    var _a, _b;
    while (true) {
      try {
        const message = this._readBuffer.readMessage();
        if (message === null) {
          break;
        }
        (_a = this.onmessage) === null || _a === void 0 ? void 0 : _a.call(this, message);
      } catch (error) {
        (_b = this.onerror) === null || _b === void 0 ? void 0 : _b.call(this, error);
      }
    }
  }
  async close() {
    this._abortController.abort();
    this._process = undefined;
    this._readBuffer.clear();
  }
  send(message) {
    return new Promise(resolve => {
      var _a;
      if (!((_a = this._process) === null || _a === void 0 ? void 0 : _a.stdin)) {
        throw new Error("Not connected");
      }
      const json = serializeMessage(message);
      if (this._process.stdin.write(json)) {
        resolve();
      } else {
        this._process.stdin.once("drain", resolve);
      }
    });
  }
}
function isElectron() {
  return "type" in process;
}
//# sourceMappingURL=stdio.js.map
; // ../../node_modules/.pnpm/eventsource-parser@3.0.3/node_modules/eventsource-parser/dist/index.js
class ParseError extends Error {
  constructor(message, options) {
    super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
}
function noop(_arg) {}
function createParser(callbacks) {
  if (typeof callbacks == "function") throw new TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
  const {
    onEvent = noop,
    onError = noop,
    onRetry = noop,
    onComment
  } = callbacks;
  let incompleteLine = "",
    isFirstChunk = !0,
    id,
    data = "",
    eventType = "";
  function feed(newChunk) {
    const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk,
      [complete, incomplete] = dist_splitLines(`${incompleteLine}${chunk}`);
    for (const line of complete) parseLine(line);
    incompleteLine = incomplete, isFirstChunk = !1;
  }
  function parseLine(line) {
    if (line === "") {
      dispatchEvent();
      return;
    }
    if (line.startsWith(":")) {
      onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
      return;
    }
    const fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex !== -1) {
      const field = line.slice(0, fieldSeparatorIndex),
        offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1,
        value = line.slice(fieldSeparatorIndex + offset);
      processField(field, value, line);
      return;
    }
    processField(line, "", line);
  }
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data = `${data}${value}
`;
        break;
      case "id":
        id = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(new ParseError(`Invalid \`retry\` value: "${value}"`, {
          type: "invalid-retry",
          value,
          line
        }));
        break;
      default:
        onError(new ParseError(`Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`, {
          type: "unknown-field",
          field,
          value,
          line
        }));
        break;
    }
  }
  function dispatchEvent() {
    data.length > 0 && onEvent({
      id,
      event: eventType || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: data.endsWith(`
`) ? data.slice(0, -1) : data
    }), id = void 0, data = "", eventType = "";
  }
  function reset(options = {}) {
    incompleteLine && options.consume && parseLine(incompleteLine), isFirstChunk = !0, id = void 0, data = "", eventType = "", incompleteLine = "";
  }
  return {
    feed,
    reset
  };
}
function dist_splitLines(chunk) {
  const lines = [];
  let incompleteLine = "",
    searchIndex = 0;
  for (; searchIndex < chunk.length;) {
    const crIndex = chunk.indexOf("\r", searchIndex),
      lfIndex = chunk.indexOf(`
`, searchIndex);
    let lineEnd = -1;
    if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = Math.min(crIndex, lfIndex) : crIndex !== -1 ? lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) {
      incompleteLine = chunk.slice(searchIndex);
      break;
    } else {
      const line = chunk.slice(searchIndex, lineEnd);
      lines.push(line), searchIndex = lineEnd + 1, chunk[searchIndex - 1] === "\r" && chunk[searchIndex] === `
` && searchIndex++;
    }
  }
  return [lines, incompleteLine];
}

//# sourceMappingURL=index.js.map

; // ../../node_modules/.pnpm/eventsource-parser@3.0.3/node_modules/eventsource-parser/dist/stream.js

class EventSourceParserStream extends TransformStream {
  constructor({
    onError,
    onRetry,
    onComment
  } = {}) {
    let parser;
    super({
      start(controller) {
        parser = createParser({
          onEvent: event => {
            controller.enqueue(event);
          },
          onError(error) {
            onError === "terminate" ? controller.error(error) : typeof onError == "function" && onError(error);
          },
          onRetry,
          onComment
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      }
    });
  }
}

//# sourceMappingURL=stream.js.map

; // ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.17.1/node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.js

// Default reconnection options for StreamableHTTP connections
const DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS = {
  initialReconnectionDelay: 1000,
  maxReconnectionDelay: 30000,
  reconnectionDelayGrowFactor: 1.5,
  maxRetries: 2
};
class StreamableHTTPError extends Error {
  constructor(code, message) {
    super(`Streamable HTTP error: ${message}`);
    this.code = code;
  }
}
/**
 * Client transport for Streamable HTTP: this implements the MCP Streamable HTTP transport specification.
 * It will connect to a server using HTTP POST for sending messages and HTTP GET with Server-Sent Events
 * for receiving messages.
 */
class StreamableHTTPClientTransport {
  constructor(url, opts) {
    var _a;
    this._url = url;
    this._resourceMetadataUrl = undefined;
    this._requestInit = opts === null || opts === void 0 ? void 0 : opts.requestInit;
    this._authProvider = opts === null || opts === void 0 ? void 0 : opts.authProvider;
    this._fetch = opts === null || opts === void 0 ? void 0 : opts.fetch;
    this._sessionId = opts === null || opts === void 0 ? void 0 : opts.sessionId;
    this._reconnectionOptions = (_a = opts === null || opts === void 0 ? void 0 : opts.reconnectionOptions) !== null && _a !== void 0 ? _a : DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS;
  }
  async _authThenStart() {
    var _a;
    if (!this._authProvider) {
      throw new UnauthorizedError("No auth provider");
    }
    let result;
    try {
      result = await auth(this._authProvider, {
        serverUrl: this._url,
        resourceMetadataUrl: this._resourceMetadataUrl,
        fetchFn: this._fetch
      });
    } catch (error) {
      (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, error);
      throw error;
    }
    if (result !== "AUTHORIZED") {
      throw new UnauthorizedError();
    }
    return await this._startOrAuthSse({
      resumptionToken: undefined
    });
  }
  async _commonHeaders() {
    var _a;
    const headers = {};
    if (this._authProvider) {
      const tokens = await this._authProvider.tokens();
      if (tokens) {
        headers["Authorization"] = `Bearer ${tokens.access_token}`;
      }
    }
    if (this._sessionId) {
      headers["mcp-session-id"] = this._sessionId;
    }
    if (this._protocolVersion) {
      headers["mcp-protocol-version"] = this._protocolVersion;
    }
    const extraHeaders = this._normalizeHeaders((_a = this._requestInit) === null || _a === void 0 ? void 0 : _a.headers);
    return new Headers({
      ...headers,
      ...extraHeaders
    });
  }
  async _startOrAuthSse(options) {
    var _a, _b, _c;
    const {
      resumptionToken
    } = options;
    try {
      // Try to open an initial SSE stream with GET to listen for server messages
      // This is optional according to the spec - server may not support it
      const headers = await this._commonHeaders();
      headers.set("Accept", "text/event-stream");
      // Include Last-Event-ID header for resumable streams if provided
      if (resumptionToken) {
        headers.set("last-event-id", resumptionToken);
      }
      const response = await ((_a = this._fetch) !== null && _a !== void 0 ? _a : fetch)(this._url, {
        method: "GET",
        headers,
        signal: (_b = this._abortController) === null || _b === void 0 ? void 0 : _b.signal
      });
      if (!response.ok) {
        if (response.status === 401 && this._authProvider) {
          // Need to authenticate
          return await this._authThenStart();
        }
        // 405 indicates that the server does not offer an SSE stream at GET endpoint
        // This is an expected case that should not trigger an error
        if (response.status === 405) {
          return;
        }
        throw new StreamableHTTPError(response.status, `Failed to open SSE stream: ${response.statusText}`);
      }
      this._handleSseStream(response.body, options, true);
    } catch (error) {
      (_c = this.onerror) === null || _c === void 0 ? void 0 : _c.call(this, error);
      throw error;
    }
  }
  /**
   * Calculates the next reconnection delay using  backoff algorithm
   *
   * @param attempt Current reconnection attempt count for the specific stream
   * @returns Time to wait in milliseconds before next reconnection attempt
   */
  _getNextReconnectionDelay(attempt) {
    // Access default values directly, ensuring they're never undefined
    const initialDelay = this._reconnectionOptions.initialReconnectionDelay;
    const growFactor = this._reconnectionOptions.reconnectionDelayGrowFactor;
    const maxDelay = this._reconnectionOptions.maxReconnectionDelay;
    // Cap at maximum delay
    return Math.min(initialDelay * Math.pow(growFactor, attempt), maxDelay);
  }
  _normalizeHeaders(headers) {
    if (!headers) return {};
    if (headers instanceof Headers) {
      return Object.fromEntries(headers.entries());
    }
    if (Array.isArray(headers)) {
      return Object.fromEntries(headers);
    }
    return {
      ...headers
    };
  }
  /**
   * Schedule a reconnection attempt with exponential backoff
   *
   * @param lastEventId The ID of the last received event for resumability
   * @param attemptCount Current reconnection attempt count for this specific stream
   */
  _scheduleReconnection(options, attemptCount = 0) {
    var _a;
    // Use provided options or default options
    const maxRetries = this._reconnectionOptions.maxRetries;
    // Check if we've exceeded maximum retry attempts
    if (maxRetries > 0 && attemptCount >= maxRetries) {
      (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, new Error(`Maximum reconnection attempts (${maxRetries}) exceeded.`));
      return;
    }
    // Calculate next delay based on current attempt count
    const delay = this._getNextReconnectionDelay(attemptCount);
    // Schedule the reconnection
    setTimeout(() => {
      // Use the last event ID to resume where we left off
      this._startOrAuthSse(options).catch(error => {
        var _a;
        (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, new Error(`Failed to reconnect SSE stream: ${error instanceof Error ? error.message : String(error)}`));
        // Schedule another attempt if this one failed, incrementing the attempt counter
        this._scheduleReconnection(options, attemptCount + 1);
      });
    }, delay);
  }
  _handleSseStream(stream, options, isReconnectable) {
    if (!stream) {
      return;
    }
    const {
      onresumptiontoken,
      replayMessageId
    } = options;
    let lastEventId;
    const processStream = async () => {
      var _a, _b, _c, _d;
      // this is the closest we can get to trying to catch network errors
      // if something happens reader will throw
      try {
        // Create a pipeline: binary stream -> text decoder -> SSE parser
        const reader = stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream()).getReader();
        while (true) {
          const {
            value: event,
            done
          } = await reader.read();
          if (done) {
            break;
          }
          // Update last event ID if provided
          if (event.id) {
            lastEventId = event.id;
            onresumptiontoken === null || onresumptiontoken === void 0 ? void 0 : onresumptiontoken(event.id);
          }
          if (!event.event || event.event === "message") {
            try {
              const message = esm_types /* JSONRPCMessageSchema */.OR.parse(JSON.parse(event.data));
              if (replayMessageId !== undefined && (0, esm_types /* isJSONRPCResponse */.tG)(message)) {
                message.id = replayMessageId;
              }
              (_a = this.onmessage) === null || _a === void 0 ? void 0 : _a.call(this, message);
            } catch (error) {
              (_b = this.onerror) === null || _b === void 0 ? void 0 : _b.call(this, error);
            }
          }
        }
      } catch (error) {
        // Handle stream errors - likely a network disconnect
        (_c = this.onerror) === null || _c === void 0 ? void 0 : _c.call(this, new Error(`SSE stream disconnected: ${error}`));
        // Attempt to reconnect if the stream disconnects unexpectedly and we aren't closing
        if (isReconnectable && this._abortController && !this._abortController.signal.aborted) {
          // Use the exponential backoff reconnection strategy
          try {
            this._scheduleReconnection({
              resumptionToken: lastEventId,
              onresumptiontoken,
              replayMessageId
            }, 0);
          } catch (error) {
            (_d = this.onerror) === null || _d === void 0 ? void 0 : _d.call(this, new Error(`Failed to reconnect: ${error instanceof Error ? error.message : String(error)}`));
          }
        }
      }
    };
    processStream();
  }
  async start() {
    if (this._abortController) {
      throw new Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    }
    this._abortController = new AbortController();
  }
  /**
   * Call this method after the user has finished authorizing via their user agent and is redirected back to the MCP client application. This will exchange the authorization code for an access token, enabling the next connection attempt to successfully auth.
   */
  async finishAuth(authorizationCode) {
    if (!this._authProvider) {
      throw new UnauthorizedError("No auth provider");
    }
    const result = await auth(this._authProvider, {
      serverUrl: this._url,
      authorizationCode,
      resourceMetadataUrl: this._resourceMetadataUrl,
      fetchFn: this._fetch
    });
    if (result !== "AUTHORIZED") {
      throw new UnauthorizedError("Failed to authorize");
    }
  }
  async close() {
    var _a, _b;
    // Abort any pending requests
    (_a = this._abortController) === null || _a === void 0 ? void 0 : _a.abort();
    (_b = this.onclose) === null || _b === void 0 ? void 0 : _b.call(this);
  }
  async send(message, options) {
    var _a, _b, _c, _d;
    try {
      const {
        resumptionToken,
        onresumptiontoken
      } = options || {};
      if (resumptionToken) {
        // If we have at last event ID, we need to reconnect the SSE stream
        this._startOrAuthSse({
          resumptionToken,
          replayMessageId: (0, esm_types /* isJSONRPCRequest */.vo)(message) ? message.id : undefined
        }).catch(err => {
          var _a;
          return (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, err);
        });
        return;
      }
      const headers = await this._commonHeaders();
      headers.set("content-type", "application/json");
      headers.set("accept", "application/json, text/event-stream");
      const init = {
        ...this._requestInit,
        method: "POST",
        headers,
        body: JSON.stringify(message),
        signal: (_a = this._abortController) === null || _a === void 0 ? void 0 : _a.signal
      };
      const response = await ((_b = this._fetch) !== null && _b !== void 0 ? _b : fetch)(this._url, init);
      // Handle session ID received during initialization
      const sessionId = response.headers.get("mcp-session-id");
      if (sessionId) {
        this._sessionId = sessionId;
      }
      if (!response.ok) {
        if (response.status === 401 && this._authProvider) {
          this._resourceMetadataUrl = extractResourceMetadataUrl(response);
          const result = await auth(this._authProvider, {
            serverUrl: this._url,
            resourceMetadataUrl: this._resourceMetadataUrl,
            fetchFn: this._fetch
          });
          if (result !== "AUTHORIZED") {
            throw new UnauthorizedError();
          }
          // Purposely _not_ awaited, so we don't call onerror twice
          return this.send(message);
        }
        const text = await response.text().catch(() => null);
        throw new Error(`Error POSTing to endpoint (HTTP ${response.status}): ${text}`);
      }
      // If the response is 202 Accepted, there's no body to process
      if (response.status === 202) {
        // if the accepted notification is initialized, we start the SSE stream
        // if it's supported by the server
        if ((0, esm_types /* isInitializedNotification */.wU)(message)) {
          // Start without a lastEventId since this is a fresh connection
          this._startOrAuthSse({
            resumptionToken: undefined
          }).catch(err => {
            var _a;
            return (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, err);
          });
        }
        return;
      }
      // Get original message(s) for detecting request IDs
      const messages = Array.isArray(message) ? message : [message];
      const hasRequests = messages.filter(msg => "method" in msg && "id" in msg && msg.id !== undefined).length > 0;
      // Check the response type
      const contentType = response.headers.get("content-type");
      if (hasRequests) {
        if (contentType === null || contentType === void 0 ? void 0 : contentType.includes("text/event-stream")) {
          // Handle SSE stream responses for requests
          // We use the same handler as standalone streams, which now supports
          // reconnection with the last event ID
          this._handleSseStream(response.body, {
            onresumptiontoken
          }, false);
        } else if (contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json")) {
          // For non-streaming servers, we might get direct JSON responses
          const data = await response.json();
          const responseMessages = Array.isArray(data) ? data.map(msg => esm_types /* JSONRPCMessageSchema */.OR.parse(msg)) : [esm_types /* JSONRPCMessageSchema */.OR.parse(data)];
          for (const msg of responseMessages) {
            (_c = this.onmessage) === null || _c === void 0 ? void 0 : _c.call(this, msg);
          }
        } else {
          throw new StreamableHTTPError(-1, `Unexpected content type: ${contentType}`);
        }
      }
    } catch (error) {
      (_d = this.onerror) === null || _d === void 0 ? void 0 : _d.call(this, error);
      throw error;
    }
  }
  get sessionId() {
    return this._sessionId;
  }
  /**
   * Terminates the current session by sending a DELETE request to the server.
   *
   * Clients that no longer need a particular session
   * (e.g., because the user is leaving the client application) SHOULD send an
   * HTTP DELETE to the MCP endpoint with the Mcp-Session-Id header to explicitly
   * terminate the session.
   *
   * The server MAY respond with HTTP 405 Method Not Allowed, indicating that
   * the server does not allow clients to terminate sessions.
   */
  async terminateSession() {
    var _a, _b, _c;
    if (!this._sessionId) {
      return; // No session to terminate
    }
    try {
      const headers = await this._commonHeaders();
      const init = {
        ...this._requestInit,
        method: "DELETE",
        headers,
        signal: (_a = this._abortController) === null || _a === void 0 ? void 0 : _a.signal
      };
      const response = await ((_b = this._fetch) !== null && _b !== void 0 ? _b : fetch)(this._url, init);
      // We specifically handle 405 as a valid response according to the spec,
      // meaning the server does not support explicit session termination
      if (!response.ok && response.status !== 405) {
        throw new StreamableHTTPError(response.status, `Failed to terminate session: ${response.statusText}`);
      }
      this._sessionId = undefined;
    } catch (error) {
      (_c = this.onerror) === null || _c === void 0 ? void 0 : _c.call(this, error);
      throw error;
    }
  }
  setProtocolVersion(version) {
    this._protocolVersion = version;
  }
  get protocolVersion() {
    return this._protocolVersion;
  }
}
//# sourceMappingURL=streamableHttp.js.map
; // ../local-exec/dist/mcp.js
var mcp_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var mcp_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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

// Approx. threshold for streaming MCP text content to file in characters.
const MCP_TEXT_FILE_THRESHOLD = 40000;
// Approx maximum output file size in characters.
const MAX_OUTPUT_FILE_SIZE = 1024 * 1024 * 50;
class AsyncCache {
  constructor(ttl = 1000 * 60 * 60 * 24) {
    this.ttl = ttl;
  }
  async get(fetcher) {
    if (this.state && this.state.expiresAt > performance.now()) {
      return this.state.value;
    }
    const value = await fetcher();
    this.state = {
      expiresAt: performance.now() + this.ttl,
      value
    };
    return value;
  }
}
// OAuth constants and in-memory provider (no auto-open; stores redirect URL)
const CALLBACK_PORT = 8787;
const CALLBACK_PATH = "/callback";
const CALLBACK_URL = `http://localhost:${CALLBACK_PORT}${CALLBACK_PATH}`;
class InMemoryOAuthClientProvider {
  constructor(_redirectUrl, _clientMetadata, _tokens, _clientInformation, _saveTokens, _saveClientInformation) {
    this._redirectUrl = _redirectUrl;
    this._clientMetadata = _clientMetadata;
    this._tokens = _tokens;
    this._clientInformation = _clientInformation;
    this._saveTokens = _saveTokens;
    this._saveClientInformation = _saveClientInformation;
  }
  get redirectUrl() {
    return this._redirectUrl;
  }
  get clientMetadata() {
    return this._clientMetadata;
  }
  clientInformation() {
    return this._clientInformation;
  }
  hasClientInformation() {
    return this._clientInformation !== undefined;
  }
  async saveClientInformation(info) {
    this._clientInformation = info;
    await this._saveClientInformation(info);
  }
  tokens() {
    return this._tokens;
  }
  async saveTokens(tokens) {
    this._tokens = tokens;
    await this._saveTokens(tokens);
  }
  redirectToAuthorization(authorizationUrl) {
    // Do not auto-open. Simply save the redirect URL for later use.
    this._lastRedirectUrl = authorizationUrl;
  }
  get lastRedirectUrl() {
    return this._lastRedirectUrl;
  }
  async saveCodeVerifier(codeVerifier) {
    this._codeVerifier = codeVerifier;
  }
  codeVerifier() {
    if (!this._codeVerifier) throw new Error("No code verifier saved");
    return this._codeVerifier;
  }
}
const commandBasedMcpServer = zod_lib.z.object({
  command: zod_lib.z.string(),
  args: zod_lib.z.array(zod_lib.z.string()).optional(),
  env: zod_lib.z.record(zod_lib.z.string(), zod_lib.z.string()).optional()
});
const remoteMcpServer = zod_lib.z.object({
  url: zod_lib.z.string(),
  headers: zod_lib.z.record(zod_lib.z.string(), zod_lib.z.string()).optional()
});
const mcpServerSchema = zod_lib.z.union([commandBasedMcpServer, remoteMcpServer]);
const mcpConfigSchema = zod_lib.z.object({
  mcpServers: zod_lib.z.record(zod_lib.z.string(), mcpServerSchema)
});
class McpSdkClient {
  constructor(serverName, client, options) {
    this._callToolLock = Promise.resolve();
    this.serverName = serverName;
    this.client = client;
    this.tools = new AsyncCache();
    this.stateValue = options.initialState;
    this._authProvider = options.authProvider;
    // Always set up elicitation handler - it will dispatch to the current provider if available
    this.setupElicitationHandler();
  }
  static createClient() {
    return new client /* Client */.K({
      name: "Cursor",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: true,
        prompts: true,
        resources: true,
        logging: false,
        elicitation: {}
      }
    });
  }
  setupElicitationHandler() {
    this.client.setRequestHandler(esm_types /* ElicitRequestSchema */.$9, async request => {
      if (!this._currentElicitationProvider) {
        // No active elicitation provider, decline the request
        return {
          action: "decline"
        };
      }
      try {
        const response = await this._currentElicitationProvider.elicit({
          message: request.params.message,
          requestedSchema: request.params.requestedSchema
        });
        // Return the response matching the MCP SDK expected type
        return {
          action: response.action,
          content: response.content
        };
      } catch (_error) {
        return {
          action: "decline"
        };
      }
    });
  }
  static async fromStreamableHttp(serverName, url, tokenStorage, headers, authRedirectUrl) {
    const tokens = await tokenStorage.loadTokens();
    const clientInformation = await tokenStorage.loadClientInformation();
    authRedirectUrl = authRedirectUrl ?? CALLBACK_URL;
    const oauthProvider = new InMemoryOAuthClientProvider(authRedirectUrl, {
      redirect_uris: [authRedirectUrl],
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      client_name: "Cursor"
    }, tokens, clientInformation, newTokens => tokenStorage.saveTokens(newTokens), clientInfo => tokenStorage.saveClientInformation(clientInfo));
    const transport = new StreamableHTTPClientTransport(url, {
      authProvider: oauthProvider,
      requestInit: {
        headers: {
          "User-Agent": "Cursor/1.0.0",
          ...(headers ?? {})
        }
      }
    });
    const client = McpSdkClient.createClient();
    try {
      await client.connect(transport);
      return new McpSdkClient(serverName, client, {
        initialState: {
          kind: "ready"
        },
        authProvider: oauthProvider
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        const url = oauthProvider.lastRedirectUrl?.toString?.() ?? "";
        const mcpClient = new McpSdkClient(serverName, client, {
          initialState: {
            kind: "requires_authentication",
            url,
            callback: async code => {
              try {
                // Check if client registration has completed
                if (!oauthProvider.hasClientInformation()) {
                  throw new Error("OAuth client registration has not completed. The MCP server may not support dynamic client registration or the registration failed.");
                }
                await transport.finishAuth(code);
                // Update the client state to ready after successful authentication
                mcpClient.updateState({
                  kind: "ready"
                });
              } catch (authError) {
                // If authentication fails, provide a more specific error message
                const errorMessage = authError instanceof Error ? authError.message : "Authentication failed";
                throw new Error(`Authentication callback failed: ${errorMessage}`);
              }
            }
          },
          authProvider: oauthProvider
        });
        return mcpClient;
      }
      throw error;
    }
  }
  static async fromCommand(ctx, serverName, command, args, env) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.fromCommand")), false);
      const transport = new StdioClientTransport({
        command,
        args,
        env,
        stderr: "ignore"
      });
      const client = McpSdkClient.createClient();
      await client.connect(transport);
      return new McpSdkClient(serverName, client, {
        initialState: {
          kind: "ready"
        }
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      mcp_disposeResources(env_1);
    }
  }
  async getTools(ctx) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.getTools")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return [];
      }
      return this.tools.get(async () => {
        let cursor;
        const tools = [];
        while (true) {
          const response = await this.client.listTools({
            cursor
          });
          tools.push(...response.tools.map(tool => ({
            ...tool,
            inputSchema: tool.inputSchema,
            outputSchema: tool.outputSchema
          })));
          cursor = response.nextCursor;
          if (cursor === undefined) break;
        }
        return tools;
      });
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      mcp_disposeResources(env_2);
    }
  }
  async callTool(ctx, name, args, toolCallId, elicitationProvider) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.callTool")), false);
      span.span.setAttribute("toolName", name);
      // Acquire lock to ensure exclusive access to elicitation provider context
      const previousLock = this._callToolLock;
      let releaseLock;
      this._callToolLock = new Promise(resolve => {
        releaseLock = resolve;
      });
      try {
        // Wait for previous tool call to complete
        await previousLock;
        // Store tool call context for elicitation correlation
        this._currentToolCallId = toolCallId;
        this._currentToolName = name;
        this._currentElicitationProvider = elicitationProvider;
        try {
          const response = await this.client.callTool({
            name,
            arguments: args
          });
          return {
            content: response.content,
            isError: response.error !== undefined
          };
        } finally {
          this._currentElicitationProvider = undefined;
          this._currentToolCallId = undefined;
          this._currentToolName = undefined;
        }
      } finally {
        // Release lock for next tool call
        releaseLock();
      }
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      mcp_disposeResources(env_3);
    }
  }
  async getInstructions(ctx) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.getInstructions")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return undefined;
      }
      return await this.client.getInstructions();
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      mcp_disposeResources(env_4);
    }
  }
  async listResources(ctx) {
    const env_5 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.listResources")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return {
          resources: []
        };
      }
      let cursor;
      const resources = [];
      while (true) {
        const response = await this.client.listResources({
          cursor
        });
        resources.push(...response.resources);
        cursor = response.nextCursor;
        if (cursor === undefined) break;
      }
      return {
        resources
      };
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      mcp_disposeResources(env_5);
    }
  }
  async readResource(ctx, args) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.readResource")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return {
          contents: []
        };
      }
      const response = await this.client.readResource({
        uri: args.uri
      });
      return {
        contents: response.contents
      };
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      mcp_disposeResources(env_6);
    }
  }
  async listPrompts(ctx) {
    const env_7 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_7, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.listPrompts")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return [];
      }
      const capabilities = this.client.getServerCapabilities() ?? {
        prompts: false
      };
      if (!capabilities.prompts) {
        return [];
      }
      const response = await this.client.listPrompts();
      if (!response?.prompts) {
        return [];
      }
      return response.prompts.map(prompt => ({
        name: prompt.name,
        description: prompt.description,
        arguments: prompt.arguments?.map(arg => ({
          name: arg.name,
          description: arg.description,
          required: arg.required
        }))
      }));
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      mcp_disposeResources(env_7);
    }
  }
  async getPrompt(ctx, name, args) {
    const env_8 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_8, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.getPrompt")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return {
          messages: []
        };
      }
      const response = await this.client.getPrompt({
        name,
        arguments: args
      });
      return {
        messages: response.messages.map(msg => ({
          role: msg.role,
          content: Array.isArray(msg.content) ? msg.content.map(content => {
            if (content.type === "text") {
              return {
                type: "text",
                text: content.text
              };
            } else if (content.type === "image") {
              return {
                type: "image",
                data: content.data,
                mimeType: content.mimeType
              };
            }
            // Fallback for unknown content types
            return {
              type: "text",
              text: JSON.stringify(content)
            };
          }) : [{
            type: "text",
            text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
          }]
        }))
      };
    } catch (e_8) {
      env_8.error = e_8;
      env_8.hasError = true;
    } finally {
      mcp_disposeResources(env_8);
    }
  }
  /**
   * Get the current tool call context for debugging.
   * This shows which tool is currently being executed and can be used to correlate
   * elicitation requests with their corresponding tool calls.
   * @returns Object with current tool name and toolCallId, or undefined if no tool is executing
   */
  getCurrentToolCallContext() {
    if (this._currentToolName) {
      return {
        toolName: this._currentToolName,
        toolCallId: this._currentToolCallId
      };
    }
    return undefined;
  }
  // Observable state API
  async getState(_ctx) {
    return this.stateValue;
  }
  updateState(newState) {
    this.stateValue = newState;
  }
}
class ExecutableMcpToolSet {
  constructor(tools) {
    this.tools = tools;
  }
  async execute(name, args, toolCallId, elicitationFactory) {
    const tool = this.tools[name];
    if (!tool) {
      throw new Error(`Tool ${name} not found, available tools: ${Object.keys(this.tools).join(", ")}`);
    }
    return tool.execute(args, toolCallId, elicitationFactory);
  }
  getTools() {
    return Object.entries(this.tools).map(([name, tool]) => ({
      ...tool.definition,
      name
    }));
  }
}
class LazyMcpToolSetLease {
  constructor(toolSetPromise) {
    this.toolSetPromise = toolSetPromise;
  }
  async getToolSet(ctx) {
    const env_9 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_9, (0, dist /* createSpan */.VI)(ctx.withName("LazyMcpToolSetLease.getToolSet")), false);
      try {
        return await this.toolSetPromise;
      } catch (_error) {
        return new ExecutableMcpToolSet({});
      }
    } catch (e_9) {
      env_9.error = e_9;
      env_9.hasError = true;
    } finally {
      mcp_disposeResources(env_9);
    }
  }
  async getTools(ctx) {
    try {
      const toolSet = await this.getToolSet(ctx);
      return toolSet.getTools();
    } catch (_error) {
      return [];
    }
  }
  withTimeout(timeout) {
    let timeoutId;
    const timeoutPromise = new Promise(resolve => {
      timeoutId = setTimeout(() => {
        resolve(new ExecutableMcpToolSet({}));
      }, timeout);
    });
    const racedPromise = Promise.race([this.toolSetPromise, timeoutPromise]).finally(() => {
      clearTimeout(timeoutId);
    });
    return new LazyMcpToolSetLease(racedPromise);
  }
}
class NoopMcpLease {
  async getClients() {
    return {};
  }
  async getClient(_name) {
    return undefined;
  }
  async getInstructions(_ctx) {
    return [];
  }
  async getToolSet() {
    return new ExecutableMcpToolSet({});
  }
  async getTools(_ctx) {
    return [];
  }
}
class ManagerMcpLease {
  constructor(manager) {
    this.manager = manager;
  }
  async getClients() {
    return this.manager.getClients();
  }
  async getClient(name) {
    return this.manager.getClient(name);
  }
  async getInstructions(ctx) {
    const env_10 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_10, (0, dist /* createSpan */.VI)(ctx.withName("ManagerMcpLease.getInstructions")), false);
      return await this.manager.getInstructions(span.ctx);
    } catch (e_10) {
      env_10.error = e_10;
      env_10.hasError = true;
    } finally {
      mcp_disposeResources(env_10);
    }
  }
  async getToolSet(ctx) {
    const env_11 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_11, (0, dist /* createSpan */.VI)(ctx.withName("ManagerMcpLease.getToolSet")), false);
      return await this.manager.getToolSet(span.ctx);
    } catch (e_11) {
      env_11.error = e_11;
      env_11.hasError = true;
    } finally {
      mcp_disposeResources(env_11);
    }
  }
  async getTools(ctx) {
    const env_12 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_12, (0, dist /* createSpan */.VI)(ctx.withName("ManagerMcpLease.getTools")), false);
      const toolSet = await this.getToolSet(span.ctx);
      return toolSet.getTools();
    } catch (e_12) {
      env_12.error = e_12;
      env_12.hasError = true;
    } finally {
      mcp_disposeResources(env_12);
    }
  }
}
class McpManager {
  constructor(clients, elicitationFactory) {
    this.clients = clients;
    this.elicitationFactory = elicitationFactory;
  }
  getClients() {
    return this.clients;
  }
  getClient(name) {
    return this.clients[name];
  }
  setClient(name, client) {
    this.clients[name] = client;
  }
  deleteClient(name) {
    delete this.clients[name];
  }
  async getToolSet(ctx) {
    const env_13 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_13, (0, dist /* createSpan */.VI)(ctx.withName("McpManager.getToolSet")), false);
      const clientTools = await (0, utils_dist /* asyncMapValues */.PH)(Object.entries(this.clients), ([_, client]) => client.getTools(span.ctx).then(tools => tools.map(tool => ({
        ...tool,
        clientName: client.serverName,
        client: client
      })))
      // probably should tell the user that the mcp client errored
      .catch(() => []), {
        max: 4
      });
      const tools = Array.from(clientTools.values()).flat();
      const toolsMap = {};
      for (const tool of tools) {
        toolsMap[`${tool.clientName}-${tool.name}`] = {
          definition: {
            ...tool,
            providerIdentifier: tool.clientName,
            toolName: tool.name
          },
          execute: async (args, toolCallId, elicitationFactory) => {
            // Create elicitation provider for this specific tool call
            const elicitationProvider = elicitationFactory?.createProvider(tool.clientName, tool.name, toolCallId);
            const result = await tool.client.callTool(span.ctx, tool.name, args, toolCallId, elicitationProvider);
            return result;
          }
        };
      }
      return new ExecutableMcpToolSet(toolsMap);
    } catch (e_13) {
      env_13.error = e_13;
      env_13.hasError = true;
    } finally {
      mcp_disposeResources(env_13);
    }
  }
  async getInstructions(ctx) {
    const instructionResults = await (0, utils_dist /* asyncMapSettledValues */.up)(Object.entries(this.clients), async ([identifier, client]) => {
      const env_14 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = mcp_addDisposableResource(env_14, (0, dist /* createSpan */.VI)(ctx.withName("McpManager.getInstructions.forServer")), false);
        span.span.setAttribute("serverName", identifier);
        const state = await client.getState(span.ctx);
        if (state.kind !== "ready") {
          return null;
        }
        const instructions = await client.getInstructions(span.ctx);
        if (!instructions || instructions.trim().length === 0) {
          return null;
        }
        return new mcp_pb /* McpInstructions */.I0({
          serverName: client.serverName,
          instructions: instructions.trim()
        });
      } catch (e_14) {
        env_14.error = e_14;
        env_14.hasError = true;
      } finally {
        mcp_disposeResources(env_14);
      }
    }, {
      max: 4
    });
    return instructionResults.filter(result => result.status === "fulfilled" && result.value !== null).map(result => result.value);
  }
}
class LocalMcpToolExecutor {
  constructor(toolSet, permissionsService, pendingDecisionProvider, projectDir, fileOutputThresholdBytes = MCP_TEXT_FILE_THRESHOLD, elicitationFactory) {
    this.toolSet = toolSet;
    this.permissionsService = permissionsService;
    this.pendingDecisionProvider = pendingDecisionProvider;
    this.projectDir = projectDir;
    this.fileOutputThresholdBytes = fileOutputThresholdBytes;
    this.elicitationFactory = elicitationFactory;
  }
  async execute(parentCtx, args) {
    const env_15 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_15, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalMcpToolExecutor.execute")), false);
      const ctx = span.ctx;
      const blockReason = await this.permissionsService.shouldBlockMcp(ctx, args);
      if (blockReason) {
        const blockResult = await handleBlockReason(blockReason, {
          onNeedsApproval: async (_approvalReason, approvalDetails) => {
            if (approvalDetails.type !== "mcp") {
              // This shouldn't happen, but handle gracefully
              return new mcp_exec_pb /* McpResult */.iz({
                result: {
                  case: "error",
                  value: new mcp_exec_pb /* McpError */.Nh({
                    error: `Invalid approval details type for MCP execution`
                  })
                }
              });
            }
            const result = await this.pendingDecisionProvider.requestApproval({
              type: OperationType.Mcp,
              details: {
                name: approvalDetails.name,
                toolName: approvalDetails.toolName,
                providerIdentifier: approvalDetails.providerIdentifier,
                args: approvalDetails.args
              },
              toolCallId: args.toolCallId
            });
            if (!result.approved) {
              return new mcp_exec_pb /* McpResult */.iz({
                result: {
                  case: "rejected",
                  value: new mcp_exec_pb /* McpRejected */.xo({
                    reason: `MCP tool execution rejected by user: ${args.name} ${result.reason ? ` - ${result.reason}` : ""}`
                  })
                }
              });
            }
            // Return null to continue with execution
            return null;
          },
          onUserRejected: reason => {
            return new mcp_exec_pb /* McpResult */.iz({
              result: {
                case: "error",
                value: new mcp_exec_pb /* McpError */.Nh({
                  error: `MCP tool execution rejected by user: ${args.name}${reason ? ` - ${reason}` : ""}`
                })
              }
            });
          },
          onPermissionDenied: (errorMessage, metadata) => {
            const formattedError = `MCP tool execution blocked: ${args.name} - ${errorMessage}`;
            return new mcp_exec_pb /* McpResult */.iz({
              result: {
                case: "permissionDenied",
                value: new mcp_exec_pb /* McpPermissionDenied */.HQ({
                  error: formattedError,
                  isReadonly: metadata?.isReadonly ?? false
                })
              }
            });
          }
        });
        if (blockResult) {
          return blockResult;
        }
      }
      const toolSet = await this.toolSet.getToolSet(ctx);
      const result = await toolSet.execute(args.name, Object.fromEntries(Object.entries(args.args).map(([key, value]) => [key, value.toJson()])), args.toolCallId, this.elicitationFactory);
      // Process content items and handle streaming for large text outputs
      const contentItems = [];
      for (const item of result.content) {
        if (item.type === "text") {
          // Check if text exceeds threshold and file output is enabled (threshold > 0)
          if (this.fileOutputThresholdBytes > 0 && item.text.length > this.fileOutputThresholdBytes) {
            // Write to file in project's agent-tools directory
            const agentToolsDir = external_node_path_.join(this.projectDir, "agent-tools");
            const filePath = external_node_path_.join(agentToolsDir, `${(0, external_node_crypto_.randomUUID)()}.txt`);
            // Ensure directory exists
            await (0, promises_.mkdir)(external_node_path_.dirname(filePath), {
              recursive: true
            });
            // Prepare content and calculate metrics
            const contentToWrite = item.text.slice(0, MAX_OUTPUT_FILE_SIZE);
            const lineCount = contentToWrite.split("\n").length;
            const actualSize = Buffer.byteLength(contentToWrite, "utf8");
            // Write file
            await (0, promises_.writeFile)(filePath, contentToWrite, "utf8");
            // Add content item with output location
            contentItems.push(new mcp_exec_pb /* McpToolResultContentItem */._Z({
              content: {
                case: "text",
                value: new mcp_exec_pb /* McpTextContent */.zN({
                  text: "",
                  // Empty text when written to file
                  outputLocation: new shell_exec_pb /* OutputLocation */.pV({
                    filePath,
                    sizeBytes: BigInt(actualSize),
                    lineCount: BigInt(lineCount)
                  })
                })
              }
            }));
          } else {
            // Small text or no workspace path - use inline
            contentItems.push(new mcp_exec_pb /* McpToolResultContentItem */._Z({
              content: {
                case: "text",
                value: new mcp_exec_pb /* McpTextContent */.zN({
                  text: item.text
                })
              }
            }));
          }
        } else {
          // Handle image content
          const dataBytes = Buffer.from(item.data, "base64");
          contentItems.push(new mcp_exec_pb /* McpToolResultContentItem */._Z({
            content: {
              case: "image",
              value: new mcp_exec_pb /* McpImageContent */["do"]({
                data: dataBytes,
                mimeType: item.mimeType
              })
            }
          }));
        }
      }
      return new mcp_exec_pb /* McpResult */.iz({
        result: {
          case: "success",
          value: new mcp_exec_pb /* McpSuccess */.QW({
            content: contentItems,
            isError: result.isError
          })
        }
      });
    } catch (e_15) {
      env_15.error = e_15;
      env_15.hasError = true;
    } finally {
      mcp_disposeResources(env_15);
    }
  }
}
class LocalListMcpResourcesExecutor {
  constructor(mcpLease) {
    this.mcpLease = mcpLease;
  }
  async execute(parentCtx, args) {
    const env_16 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_16, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalListMcpResourcesExecutor.execute")), false);
      const ctx = span.ctx;
      try {
        // Get enabled servers from mcpLease
        const enabledServerNames = new Set();
        const tools = await this.mcpLease.getTools(ctx);
        for (const tool of tools) {
          // Add both with and without 'user-' prefix to handle both naming conventions
          enabledServerNames.add(tool.providerIdentifier);
          enabledServerNames.add(`user-${tool.providerIdentifier}`);
        }
        const clients = await this.mcpLease.getClients();
        const allResources = [];
        // If a specific server is requested, filter by it
        if (args.server) {
          const client = clients[args.server];
          if (!client) {
            return new mcp_exec_pb /* ListMcpResourcesExecResult */.kP({
              result: {
                case: "error",
                value: new mcp_exec_pb /* ListMcpResourcesError */.w2({
                  error: `Server "${args.server}" not found`
                })
              }
            });
          }
          const resources = await this.listResourcesFromClient(ctx, client, args.server);
          allResources.push(...resources);
        } else {
          // List resources from all enabled clients
          for (const [serverName, client] of Object.entries(clients)) {
            // Skip disabled servers
            if (enabledServerNames.size > 0 && !enabledServerNames.has(serverName)) {
              continue;
            }
            const resources = await this.listResourcesFromClient(ctx, client, serverName);
            allResources.push(...resources);
          }
        }
        return new mcp_exec_pb /* ListMcpResourcesExecResult */.kP({
          result: {
            case: "success",
            value: new mcp_exec_pb /* ListMcpResourcesSuccess */.T2({
              resources: allResources
            })
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new mcp_exec_pb /* ListMcpResourcesExecResult */.kP({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ListMcpResourcesError */.w2({
              error: `Failed to list MCP resources: ${errorMessage}`
            })
          }
        });
      }
    } catch (e_16) {
      env_16.error = e_16;
      env_16.hasError = true;
    } finally {
      mcp_disposeResources(env_16);
    }
  }
  async listResourcesFromClient(ctx, client, serverName) {
    const state = await client.getState(ctx);
    if (state.kind !== "ready") {
      return [];
    }
    const result = await client.listResources(ctx);
    if (!result || !result.resources) {
      return [];
    }
    return result.resources.map(resource => new mcp_exec_pb /* ListMcpResourcesExecResult_McpResource */.X2({
      uri: resource.uri,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
      server: serverName,
      annotations: resource.annotations
    }));
  }
}
class LocalReadMcpResourceExecutor {
  constructor(mcpLease, projectDir = ".", permissionsService) {
    this.mcpLease = mcpLease;
    this.projectDir = projectDir;
    this.permissionsService = permissionsService;
  }
  async execute(parentCtx, args) {
    const env_17 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_17, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalReadMcpResourceExecutor.execute")), false);
      const ctx = span.ctx;
      const clients = await this.mcpLease.getClients();
      const client = clients[args.server];
      if (!client) {
        return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
              uri: args.uri,
              error: `Server "${args.server}" not found`
            })
          }
        });
      }
      try {
        const state = await client.getState(ctx);
        if (state.kind !== "ready") {
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "error",
              value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
                uri: args.uri,
                error: `Server "${args.server}" is not ready`
              })
            }
          });
        }
        const result = await client.readResource(ctx, {
          uri: args.uri
        });
        if (!result || !result.contents || result.contents.length === 0) {
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "notFound",
              value: new mcp_exec_pb /* ReadMcpResourceNotFound */.ov({
                uri: args.uri
              })
            }
          });
        }
        const content = result.contents[0];
        // Handle download path if specified
        if (args.downloadPath) {
          // SECURITY NOTE: This implementation matches the old agent loop (see
          // vscode/src/vs/workbench/services/ai/browser/toolsV2/fetchMcpResourceHandler.ts:113-115)
          // but does NOT validate against path traversal attacks. A malicious downloadPath like "../../../etc/passwd"
          // will escape the project directory. The old implementation only strips leading slashes and relies on
          // URI.joinPath/path.join which resolve "../" sequences. This should be fixed to validate that the resolved
          // path stays within projectDir boundaries, similar to how other file operations use resolvePath() and
          // check for path traversal attempts.
          // Ensure downloadPath is treated as a relative path (same as old agent loop)
          const sanitized = args.downloadPath.replace(/^\/+/, "");
          const downloadFullPath = external_node_path_.join(this.projectDir, sanitized);
          await (0, promises_.mkdir)(external_node_path_.dirname(downloadFullPath), {
            recursive: true
          });
          if (content.text) {
            await (0, promises_.writeFile)(downloadFullPath, content.text, "utf8");
          } else if (content.blob) {
            const blobData = Buffer.from(content.blob, "base64");
            await (0, promises_.writeFile)(downloadFullPath, blobData);
          }
          // Return success result when downloading (content not returned)
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "success",
              value: new mcp_exec_pb /* ReadMcpResourceSuccess */.KZ({
                uri: args.uri,
                name: content.name,
                description: content.description,
                mimeType: content.mimeType
              })
            }
          });
        }
        // Return content to model
        if (content.text) {
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "success",
              value: new mcp_exec_pb /* ReadMcpResourceSuccess */.KZ({
                uri: args.uri,
                name: content.name,
                description: content.description,
                mimeType: content.mimeType,
                annotations: content.annotations,
                content: {
                  case: "text",
                  value: content.text
                }
              })
            }
          });
        } else if (content.blob) {
          const blobData = Buffer.from(content.blob, "base64");
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "success",
              value: new mcp_exec_pb /* ReadMcpResourceSuccess */.KZ({
                uri: args.uri,
                name: content.name,
                description: content.description,
                mimeType: content.mimeType,
                annotations: content.annotations,
                content: {
                  case: "blob",
                  value: blobData
                }
              })
            }
          });
        }
        return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
              uri: args.uri,
              error: "Failed to read resource"
            })
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
              uri: args.uri,
              error: `Failed to read MCP resource: ${errorMessage}`
            })
          }
        });
      }
    } catch (e_17) {
      env_17.error = e_17;
      env_17.hasError = true;
    } finally {
      mcp_disposeResources(env_17);
    }
  }
}
//# sourceMappingURL=mcp.js.map
; // ../local-exec/dist/mcp/mcp-loader-with-custom-clients.js

/**
 * A wrapper around any McpLoader that adds custom clients (like Playwright)
 */
class McpLoaderWithCustomClients {
  constructor(innerLoader, customClients) {
    this.innerLoader = innerLoader;
    this.customClients = customClients;
  }
  async load(ctx) {
    // Load the inner manager
    const innerManager = await this.innerLoader.load(ctx);
    // Get all clients from the inner manager
    const innerClients = innerManager.getClients();
    // Combine with custom clients
    const allClients = {
      ...innerClients,
      ...this.customClients
    };
    // Create a new manager with all clients
    return new McpManager(allClients);
  }
  async loadClient(ctx, identifier, ignoreTokens) {
    // Check if it's a custom client first
    const customClient = this.customClients[identifier];
    if (customClient) {
      return customClient;
    }
    // Otherwise delegate to inner loader
    return this.innerLoader.loadClient(ctx, identifier, ignoreTokens);
  }
  /**
   * Add a custom client at runtime
   */
  addCustomClient(identifier, client) {
    this.customClients[identifier] = client;
  }
  /**
   * Remove a custom client
   */
  removeCustomClient(identifier) {
    delete this.customClients[identifier];
  }
  /**
   * Get all custom clients
   */
  getCustomClients() {
    return {
      ...this.customClients
    };
  }
}
//# sourceMappingURL=mcp-loader-with-custom-clients.js.map
; // ../local-exec/dist/mcp/index.js
// MCP Loader with custom clients support

//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ../agent-exec/dist/index.js + 18 modules
var agent_exec_dist = __webpack_require__("../agent-exec/dist/index.js");
; // ../../node_modules/.pnpm/lru-cache@11.1.0/node_modules/lru-cache/dist/esm/index.js
/**
 * @module LRUCache
 */
const perf = typeof performance === 'object' && performance && typeof performance.now === 'function' ? performance : Date;
const warned = new Set();
/* c8 ignore start */
const PROCESS = typeof process === 'object' && !!process ? process : {};
/* c8 ignore start */
const emitWarning = (msg, type, code, fn) => {
  typeof PROCESS.emitWarning === 'function' ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
let AC = globalThis.AbortController;
let AS = globalThis.AbortSignal;
/* c8 ignore start */
if (typeof AC === 'undefined') {
  //@ts-ignore
  AS = class AbortSignal {
    onabort;
    _onabort = [];
    reason;
    aborted = false;
    addEventListener(_, fn) {
      this._onabort.push(fn);
    }
  };
  //@ts-ignore
  AC = class AbortController {
    constructor() {
      warnACPolyfill();
    }
    signal = new AS();
    abort(reason) {
      if (this.signal.aborted) return;
      //@ts-ignore
      this.signal.reason = reason;
      //@ts-ignore
      this.signal.aborted = true;
      //@ts-ignore
      for (const fn of this.signal._onabort) {
        fn(reason);
      }
      this.signal.onabort?.(reason);
    }
  };
  let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== '1';
  const warnACPolyfill = () => {
    if (!printACPolyfillWarning) return;
    printACPolyfillWarning = false;
    emitWarning('AbortController is not defined. If using lru-cache in ' + 'node 14, load an AbortController polyfill from the ' + '`node-abort-controller` package. A minimal polyfill is ' + 'provided for use by LRUCache.fetch(), but it should not be ' + 'relied upon in other contexts (eg, passing it to other APIs that ' + 'use AbortController/AbortSignal might have undesirable effects). ' + 'You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.', 'NO_ABORT_CONTROLLER', 'ENOTSUP', warnACPolyfill);
  };
}
/* c8 ignore stop */
const shouldWarn = code => !warned.has(code);
const TYPE = Symbol('type');
const isPosInt = n => n && n === Math.floor(n) && n > 0 && isFinite(n);
/* c8 ignore start */
// This is a little bit ridiculous, tbh.
// The maximum array length is 2^32-1 or thereabouts on most JS impls.
// And well before that point, you're caching the entire world, I mean,
// that's ~32GB of just integers for the next/prev links, plus whatever
// else to hold that many keys and values.  Just filling the memory with
// zeroes at init time is brutal when you get that big.
// But why not be complete?
// Maybe in the future, these limits will have expanded.
const getUintArray = max => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
/* c8 ignore stop */
class ZeroArray extends Array {
  constructor(size) {
    super(size);
    this.fill(0);
  }
}
class Stack {
  heap;
  length;
  // private constructor
  static #constructing = false;
  static create(max) {
    const HeapCls = getUintArray(max);
    if (!HeapCls) return [];
    Stack.#constructing = true;
    const s = new Stack(max, HeapCls);
    Stack.#constructing = false;
    return s;
  }
  constructor(max, HeapCls) {
    /* c8 ignore start */
    if (!Stack.#constructing) {
      throw new TypeError('instantiate Stack using Stack.create(n)');
    }
    /* c8 ignore stop */
    this.heap = new HeapCls(max);
    this.length = 0;
  }
  push(n) {
    this.heap[this.length++] = n;
  }
  pop() {
    return this.heap[--this.length];
  }
}
/**
 * Default export, the thing you're using this module to get.
 *
 * The `K` and `V` types define the key and value types, respectively. The
 * optional `FC` type defines the type of the `context` object passed to
 * `cache.fetch()` and `cache.memo()`.
 *
 * Keys and values **must not** be `null` or `undefined`.
 *
 * All properties from the options object (with the exception of `max`,
 * `maxSize`, `fetchMethod`, `memoMethod`, `dispose` and `disposeAfter`) are
 * added as normal public members. (The listed options are read-only getters.)
 *
 * Changing any of these will alter the defaults for subsequent method calls.
 */
class LRUCache {
  // options that cannot be changed without disaster
  #max;
  #maxSize;
  #dispose;
  #onInsert;
  #disposeAfter;
  #fetchMethod;
  #memoMethod;
  /**
   * {@link LRUCache.OptionsBase.ttl}
   */
  ttl;
  /**
   * {@link LRUCache.OptionsBase.ttlResolution}
   */
  ttlResolution;
  /**
   * {@link LRUCache.OptionsBase.ttlAutopurge}
   */
  ttlAutopurge;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnGet}
   */
  updateAgeOnGet;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnHas}
   */
  updateAgeOnHas;
  /**
   * {@link LRUCache.OptionsBase.allowStale}
   */
  allowStale;
  /**
   * {@link LRUCache.OptionsBase.noDisposeOnSet}
   */
  noDisposeOnSet;
  /**
   * {@link LRUCache.OptionsBase.noUpdateTTL}
   */
  noUpdateTTL;
  /**
   * {@link LRUCache.OptionsBase.maxEntrySize}
   */
  maxEntrySize;
  /**
   * {@link LRUCache.OptionsBase.sizeCalculation}
   */
  sizeCalculation;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
   */
  noDeleteOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
   */
  noDeleteOnStaleGet;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
   */
  allowStaleOnFetchAbort;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
   */
  allowStaleOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.ignoreFetchAbort}
   */
  ignoreFetchAbort;
  // computed properties
  #size;
  #calculatedSize;
  #keyMap;
  #keyList;
  #valList;
  #next;
  #prev;
  #head;
  #tail;
  #free;
  #disposed;
  #sizes;
  #starts;
  #ttls;
  #hasDispose;
  #hasFetchMethod;
  #hasDisposeAfter;
  #hasOnInsert;
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(c) {
    return {
      // properties
      starts: c.#starts,
      ttls: c.#ttls,
      sizes: c.#sizes,
      keyMap: c.#keyMap,
      keyList: c.#keyList,
      valList: c.#valList,
      next: c.#next,
      prev: c.#prev,
      get head() {
        return c.#head;
      },
      get tail() {
        return c.#tail;
      },
      free: c.#free,
      // methods
      isBackgroundFetch: p => c.#isBackgroundFetch(p),
      backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
      moveToTail: index => c.#moveToTail(index),
      indexes: options => c.#indexes(options),
      rindexes: options => c.#rindexes(options),
      isStale: index => c.#isStale(index)
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return this.#max;
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return this.#maxSize;
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return this.#calculatedSize;
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return this.#size;
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return this.#fetchMethod;
  }
  get memoMethod() {
    return this.#memoMethod;
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return this.#dispose;
  }
  /**
   * {@link LRUCache.OptionsBase.onInsert} (read-only)
   */
  get onInsert() {
    return this.#onInsert;
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return this.#disposeAfter;
  }
  constructor(options) {
    const {
      max = 0,
      ttl,
      ttlResolution = 1,
      ttlAutopurge,
      updateAgeOnGet,
      updateAgeOnHas,
      allowStale,
      dispose,
      onInsert,
      disposeAfter,
      noDisposeOnSet,
      noUpdateTTL,
      maxSize = 0,
      maxEntrySize = 0,
      sizeCalculation,
      fetchMethod,
      memoMethod,
      noDeleteOnFetchRejection,
      noDeleteOnStaleGet,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort
    } = options;
    if (max !== 0 && !isPosInt(max)) {
      throw new TypeError('max option must be a nonnegative integer');
    }
    const UintArray = max ? getUintArray(max) : Array;
    if (!UintArray) {
      throw new Error('invalid max value: ' + max);
    }
    this.#max = max;
    this.#maxSize = maxSize;
    this.maxEntrySize = maxEntrySize || this.#maxSize;
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!this.#maxSize && !this.maxEntrySize) {
        throw new TypeError('cannot set sizeCalculation without setting maxSize or maxEntrySize');
      }
      if (typeof this.sizeCalculation !== 'function') {
        throw new TypeError('sizeCalculation set to non-function');
      }
    }
    if (memoMethod !== undefined && typeof memoMethod !== 'function') {
      throw new TypeError('memoMethod must be a function if defined');
    }
    this.#memoMethod = memoMethod;
    if (fetchMethod !== undefined && typeof fetchMethod !== 'function') {
      throw new TypeError('fetchMethod must be a function if specified');
    }
    this.#fetchMethod = fetchMethod;
    this.#hasFetchMethod = !!fetchMethod;
    this.#keyMap = new Map();
    this.#keyList = new Array(max).fill(undefined);
    this.#valList = new Array(max).fill(undefined);
    this.#next = new UintArray(max);
    this.#prev = new UintArray(max);
    this.#head = 0;
    this.#tail = 0;
    this.#free = Stack.create(max);
    this.#size = 0;
    this.#calculatedSize = 0;
    if (typeof dispose === 'function') {
      this.#dispose = dispose;
    }
    if (typeof onInsert === 'function') {
      this.#onInsert = onInsert;
    }
    if (typeof disposeAfter === 'function') {
      this.#disposeAfter = disposeAfter;
      this.#disposed = [];
    } else {
      this.#disposeAfter = undefined;
      this.#disposed = undefined;
    }
    this.#hasDispose = !!this.#dispose;
    this.#hasOnInsert = !!this.#onInsert;
    this.#hasDisposeAfter = !!this.#disposeAfter;
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    // NB: maxEntrySize is set to maxSize if it's set
    if (this.maxEntrySize !== 0) {
      if (this.#maxSize !== 0) {
        if (!isPosInt(this.#maxSize)) {
          throw new TypeError('maxSize must be a positive integer if specified');
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError('maxEntrySize must be a positive integer if specified');
      }
      this.#initializeSizeTracking();
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError('ttl must be a positive integer if specified');
      }
      this.#initializeTTLTracking();
    }
    // do not allow completely unbounded caches
    if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
      throw new TypeError('At least one of max, maxSize, or ttl is required');
    }
    if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
      const code = 'LRU_CACHE_UNBOUNDED';
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = 'TTL caching without ttlAutopurge, max, or maxSize can ' + 'result in unbounded memory consumption.';
        emitWarning(msg, 'UnboundedCacheWarning', code, LRUCache);
      }
    }
  }
  /**
   * Return the number of ms left in the item's TTL. If item is not in cache,
   * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
   */
  getRemainingTTL(key) {
    return this.#keyMap.has(key) ? Infinity : 0;
  }
  #initializeTTLTracking() {
    const ttls = new ZeroArray(this.#max);
    const starts = new ZeroArray(this.#max);
    this.#ttls = ttls;
    this.#starts = starts;
    this.#setItemTTL = (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (this.#isStale(index)) {
            this.#delete(this.#keyList[index], 'expire');
          }
        }, ttl + 1);
        // unref() not supported on all platforms
        /* c8 ignore start */
        if (t.unref) {
          t.unref();
        }
        /* c8 ignore stop */
      }
    };
    this.#updateItemAge = index => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    };
    this.#statusTTL = (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        /* c8 ignore next */
        if (!ttl || !start) return;
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    };
    // debounce calls to perf.now() to 1s so we're not hitting
    // that costly call repeatedly.
    let cachedNow = 0;
    const getNow = () => {
      const n = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
        // not available on all platforms
        /* c8 ignore start */
        if (t.unref) {
          t.unref();
        }
        /* c8 ignore stop */
      }
      return n;
    };
    this.getRemainingTTL = key => {
      const index = this.#keyMap.get(key);
      if (index === undefined) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (!ttl || !start) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    this.#isStale = index => {
      const s = starts[index];
      const t = ttls[index];
      return !!t && !!s && (cachedNow || getNow()) - s > t;
    };
  }
  // conditionally set private methods related to TTL
  #updateItemAge = () => {};
  #statusTTL = () => {};
  #setItemTTL = () => {};
  /* c8 ignore stop */
  #isStale = () => false;
  #initializeSizeTracking() {
    const sizes = new ZeroArray(this.#max);
    this.#calculatedSize = 0;
    this.#sizes = sizes;
    this.#removeItemSize = index => {
      this.#calculatedSize -= sizes[index];
      sizes[index] = 0;
    };
    this.#requireSize = (k, v, size, sizeCalculation) => {
      // provisionally accept background fetches.
      // actual value size will be checked when they return.
      if (this.#isBackgroundFetch(v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== 'function') {
            throw new TypeError('sizeCalculation must be a function');
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError('sizeCalculation return invalid (expect positive integer)');
          }
        } else {
          throw new TypeError('invalid size value (must be positive integer). ' + 'When maxSize or maxEntrySize is used, sizeCalculation ' + 'or size must be set.');
        }
      }
      return size;
    };
    this.#addItemSize = (index, size, status) => {
      sizes[index] = size;
      if (this.#maxSize) {
        const maxSize = this.#maxSize - sizes[index];
        while (this.#calculatedSize > maxSize) {
          this.#evict(true);
        }
      }
      this.#calculatedSize += sizes[index];
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = this.#calculatedSize;
      }
    };
  }
  #removeItemSize = _i => {};
  #addItemSize = (_i, _s, _st) => {};
  #requireSize = (_k, _v, size, sizeCalculation) => {
    if (size || sizeCalculation) {
      throw new TypeError('cannot set size without setting maxSize or maxEntrySize on cache');
    }
    return 0;
  };
  *#indexes({
    allowStale = this.allowStale
  } = {}) {
    if (this.#size) {
      for (let i = this.#tail; true;) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#head) {
          break;
        } else {
          i = this.#prev[i];
        }
      }
    }
  }
  *#rindexes({
    allowStale = this.allowStale
  } = {}) {
    if (this.#size) {
      for (let i = this.#head; true;) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#tail) {
          break;
        } else {
          i = this.#next[i];
        }
      }
    }
  }
  #isValidIndex(index) {
    return index !== undefined && this.#keyMap.get(this.#keyList[index]) === index;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const i of this.#indexes()) {
      if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const i of this.#rindexes()) {
      if (this.#valList[i] !== undefined && this.#keyList[i] !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const i of this.#indexes()) {
      const k = this.#keyList[i];
      if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const i of this.#rindexes()) {
      const k = this.#keyList[i];
      if (k !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      if (v !== undefined && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * A String value that is used in the creation of the default string
   * description of an object. Called by the built-in method
   * `Object.prototype.toString`.
   */
  [Symbol.toStringTag] = 'LRUCache';
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
   */
  find(fn, getOptions = {}) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined) continue;
      if (fn(value, this.#keyList[i], this)) {
        return this.get(this.#keyList[i], getOptions);
      }
    }
  }
  /**
   * Call the supplied function on each item in the cache, in order from most
   * recently used to least recently used.
   *
   * `fn` is called as `fn(value, key, cache)`.
   *
   * If `thisp` is provided, function will be called in the `this`-context of
   * the provided object, or the cache if no `thisp` object is provided.
   *
   * Does not update age or recenty of use, or iterate over stale values.
   */
  forEach(fn, thisp = this) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined) continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(fn, thisp = this) {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined) continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let deleted = false;
    for (const i of this.#rindexes({
      allowStale: true
    })) {
      if (this.#isStale(i)) {
        this.#delete(this.#keyList[i], 'expire');
        deleted = true;
      }
    }
    return deleted;
  }
  /**
   * Get the extended info about a given entry, to get its value, size, and
   * TTL info simultaneously. Returns `undefined` if the key is not present.
   *
   * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
   * serialization, the `start` value is always the current timestamp, and the
   * `ttl` is a calculated remaining time to live (negative if expired).
   *
   * Always returns stale values, if their info is found in the cache, so be
   * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
   * if relevant.
   */
  info(key) {
    const i = this.#keyMap.get(key);
    if (i === undefined) return undefined;
    const v = this.#valList[i];
    const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    if (value === undefined) return undefined;
    const entry = {
      value
    };
    if (this.#ttls && this.#starts) {
      const ttl = this.#ttls[i];
      const start = this.#starts[i];
      if (ttl && start) {
        const remain = ttl - (perf.now() - start);
        entry.ttl = remain;
        entry.start = Date.now();
      }
    }
    if (this.#sizes) {
      entry.size = this.#sizes[i];
    }
    return entry;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to {@link LRUCache#load}.
   *
   * The `start` fields are calculated relative to a portable `Date.now()`
   * timestamp, even if `performance.now()` is available.
   *
   * Stale entries are always included in the `dump`, even if
   * {@link LRUCache.OptionsBase.allowStale} is false.
   *
   * Note: this returns an actual array, not a generator, so it can be more
   * easily passed around.
   */
  dump() {
    const arr = [];
    for (const i of this.#indexes({
      allowStale: true
    })) {
      const key = this.#keyList[i];
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === undefined || key === undefined) continue;
      const entry = {
        value
      };
      if (this.#ttls && this.#starts) {
        entry.ttl = this.#ttls[i];
        // always dump the start relative to a portable timestamp
        // it's ok for this to be a bit slow, it's a rare operation.
        const age = perf.now() - this.#starts[i];
        entry.start = Math.floor(Date.now() - age);
      }
      if (this.#sizes) {
        entry.size = this.#sizes[i];
      }
      arr.unshift([key, entry]);
    }
    return arr;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   *
   * The shape of the resulting cache may be different if the same options are
   * not used in both caches.
   *
   * The `start` fields are assumed to be calculated relative to a portable
   * `Date.now()` timestamp, even if `performance.now()` is available.
   */
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        // entry.start is a portable timestamp, but we may be using
        // node's performance.now(), so calculate the offset, so that
        // we get the intended remaining TTL, no matter how long it's
        // been on ice.
        //
        // it's ok for this to be a bit slow, it's a rare operation.
        const age = Date.now() - entry.start;
        entry.start = perf.now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  /**
   * Add a value to the cache.
   *
   * Note: if `undefined` is specified as a value, this is an alias for
   * {@link LRUCache#delete}
   *
   * Fields on the {@link LRUCache.SetOptions} options param will override
   * their corresponding values in the constructor options for the scope
   * of this single `set()` operation.
   *
   * If `start` is provided, then that will set the effective start
   * time for the TTL calculation. Note that this must be a previous
   * value of `performance.now()` if supported, or a previous value of
   * `Date.now()` if not.
   *
   * Options object may also include `size`, which will prevent
   * calling the `sizeCalculation` function and just use the specified
   * number if it is a positive integer, and `noDisposeOnSet` which
   * will prevent calling a `dispose` function in the case of
   * overwrites.
   *
   * If the `size` (or return value of `sizeCalculation`) for a given
   * entry is greater than `maxEntrySize`, then the item will not be
   * added to the cache.
   *
   * Will update the recency of the entry.
   *
   * If the value is `undefined`, then this is an alias for
   * `cache.delete(key)`. `undefined` is never stored in the cache.
   */
  set(k, v, setOptions = {}) {
    if (v === undefined) {
      this.delete(k);
      return this;
    }
    const {
      ttl = this.ttl,
      start,
      noDisposeOnSet = this.noDisposeOnSet,
      sizeCalculation = this.sizeCalculation,
      status
    } = setOptions;
    let {
      noUpdateTTL = this.noUpdateTTL
    } = setOptions;
    const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
    // if the item doesn't fit, don't do anything
    // NB: maxEntrySize set to maxSize by default
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = 'miss';
        status.maxEntrySizeExceeded = true;
      }
      // have to delete, in case something is there already.
      this.#delete(k, 'set');
      return this;
    }
    let index = this.#size === 0 ? undefined : this.#keyMap.get(k);
    if (index === undefined) {
      // addition
      index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
      this.#keyList[index] = k;
      this.#valList[index] = v;
      this.#keyMap.set(k, index);
      this.#next[this.#tail] = index;
      this.#prev[index] = this.#tail;
      this.#tail = index;
      this.#size++;
      this.#addItemSize(index, size, status);
      if (status) status.set = 'add';
      noUpdateTTL = false;
      if (this.#hasOnInsert) {
        this.#onInsert?.(v, k, 'add');
      }
    } else {
      // update
      this.#moveToTail(index);
      const oldVal = this.#valList[index];
      if (v !== oldVal) {
        if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
          oldVal.__abortController.abort(new Error('replaced'));
          const {
            __staleWhileFetching: s
          } = oldVal;
          if (s !== undefined && !noDisposeOnSet) {
            if (this.#hasDispose) {
              this.#dispose?.(s, k, 'set');
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([s, k, 'set']);
            }
          }
        } else if (!noDisposeOnSet) {
          if (this.#hasDispose) {
            this.#dispose?.(oldVal, k, 'set');
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([oldVal, k, 'set']);
          }
        }
        this.#removeItemSize(index);
        this.#addItemSize(index, size, status);
        this.#valList[index] = v;
        if (status) {
          status.set = 'replace';
          const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== undefined) status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = 'update';
      }
      if (this.#hasOnInsert) {
        this.onInsert?.(v, k, v === oldVal ? 'update' : 'replace');
      }
    }
    if (ttl !== 0 && !this.#ttls) {
      this.#initializeTTLTracking();
    }
    if (this.#ttls) {
      if (!noUpdateTTL) {
        this.#setItemTTL(index, ttl, start);
      }
      if (status) this.#statusTTL(status, index);
    }
    if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    try {
      while (this.#size) {
        const val = this.#valList[this.#head];
        this.#evict(true);
        if (this.#isBackgroundFetch(val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== undefined) {
          return val;
        }
      }
    } finally {
      if (this.#hasDisposeAfter && this.#disposed) {
        const dt = this.#disposed;
        let task;
        while (task = dt?.shift()) {
          this.#disposeAfter?.(...task);
        }
      }
    }
  }
  #evict(free) {
    const head = this.#head;
    const k = this.#keyList[head];
    const v = this.#valList[head];
    if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
      v.__abortController.abort(new Error('evicted'));
    } else if (this.#hasDispose || this.#hasDisposeAfter) {
      if (this.#hasDispose) {
        this.#dispose?.(v, k, 'evict');
      }
      if (this.#hasDisposeAfter) {
        this.#disposed?.push([v, k, 'evict']);
      }
    }
    this.#removeItemSize(head);
    // if we aren't about to use the index, then null these out
    if (free) {
      this.#keyList[head] = undefined;
      this.#valList[head] = undefined;
      this.#free.push(head);
    }
    if (this.#size === 1) {
      this.#head = this.#tail = 0;
      this.#free.length = 0;
    } else {
      this.#head = this.#next[head];
    }
    this.#keyMap.delete(k);
    this.#size--;
    return head;
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Check if a key is in the cache, without updating the recency of
   * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
   * to `true` in either the options or the constructor.
   *
   * Will return `false` if the item is stale, even though it is technically in
   * the cache. The difference can be determined (if it matters) by using a
   * `status` argument, and inspecting the `has` field.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(k, hasOptions = {}) {
    const {
      updateAgeOnHas = this.updateAgeOnHas,
      status
    } = hasOptions;
    const index = this.#keyMap.get(k);
    if (index !== undefined) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === undefined) {
        return false;
      }
      if (!this.#isStale(index)) {
        if (updateAgeOnHas) {
          this.#updateItemAge(index);
        }
        if (status) {
          status.has = 'hit';
          this.#statusTTL(status, index);
        }
        return true;
      } else if (status) {
        status.has = 'stale';
        this.#statusTTL(status, index);
      }
    } else if (status) {
      status.has = 'miss';
    }
    return false;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(k, peekOptions = {}) {
    const {
      allowStale = this.allowStale
    } = peekOptions;
    const index = this.#keyMap.get(k);
    if (index === undefined || !allowStale && this.#isStale(index)) {
      return;
    }
    const v = this.#valList[index];
    // either stale and allowed, or forcing a refresh of non-stale value
    return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
  }
  #backgroundFetch(k, index, options, context) {
    const v = index === undefined ? undefined : this.#valList[index];
    if (this.#isBackgroundFetch(v)) {
      return v;
    }
    const ac = new AC();
    const {
      signal
    } = options;
    // when/if our AC signals, then stop listening to theirs.
    signal?.addEventListener('abort', () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = (v, updateCache = false) => {
      const {
        aborted
      } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v !== undefined;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort) options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      // either we didn't abort, and are still here, or we did, and ignored
      const bf = p;
      if (this.#valList[index] === p) {
        if (v === undefined) {
          if (bf.__staleWhileFetching) {
            this.#valList[index] = bf.__staleWhileFetching;
          } else {
            this.#delete(k, 'fetch');
          }
        } else {
          if (options.status) options.status.fetchUpdated = true;
          this.set(k, v, fetchOpts.options);
        }
      }
      return v;
    };
    const eb = er => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    };
    const fetchFail = er => {
      const {
        aborted
      } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf = p;
      if (this.#valList[index] === p) {
        // if we allow stale on fetch rejections, then we need to ensure that
        // the stale value is not removed from the cache when the fetch fails.
        const del = !noDelete || bf.__staleWhileFetching === undefined;
        if (del) {
          this.#delete(k, 'fetch');
        } else if (!allowStaleAborted) {
          // still replace the *promise* with the stale value,
          // since we are done with the promise at this point.
          // leave it untouched if we're still waiting for an
          // aborted background fetch that hasn't yet returned.
          this.#valList[index] = bf.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf.__staleWhileFetching !== undefined) {
          options.status.returnedStale = true;
        }
        return bf.__staleWhileFetching;
      } else if (bf.__returned === bf) {
        throw er;
      }
    };
    const pcall = (res, rej) => {
      const fmp = this.#fetchMethod?.(k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then(v => res(v === undefined ? undefined : v), rej);
      }
      // ignored, we go until we finish, regardless.
      // defer check until we are actually aborting,
      // so fetchMethod can override.
      ac.signal.addEventListener('abort', () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res(undefined);
          // when it eventually resolves, update the cache.
          if (options.allowStaleOnFetchAbort) {
            res = v => cb(v, true);
          }
        }
      });
    };
    if (options.status) options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: undefined
    });
    if (index === undefined) {
      // internal, don't expose status.
      this.set(k, bf, {
        ...fetchOpts.options,
        status: undefined
      });
      index = this.#keyMap.get(k);
    } else {
      this.#valList[index] = bf;
    }
    return bf;
  }
  #isBackgroundFetch(p) {
    if (!this.#hasFetchMethod) return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty('__staleWhileFetching') && b.__abortController instanceof AC;
  }
  async fetch(k, fetchOptions = {}) {
    const {
      // get options
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      // set options
      ttl = this.ttl,
      noDisposeOnSet = this.noDisposeOnSet,
      size = 0,
      sizeCalculation = this.sizeCalculation,
      noUpdateTTL = this.noUpdateTTL,
      // fetch exclusive options
      noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
      ignoreFetchAbort = this.ignoreFetchAbort,
      allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
      context,
      forceRefresh = false,
      status,
      signal
    } = fetchOptions;
    if (!this.#hasFetchMethod) {
      if (status) status.fetch = 'get';
      return this.get(k, {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        status
      });
    }
    const options = {
      allowStale,
      updateAgeOnGet,
      noDeleteOnStaleGet,
      ttl,
      noDisposeOnSet,
      size,
      sizeCalculation,
      noUpdateTTL,
      noDeleteOnFetchRejection,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      status,
      signal
    };
    let index = this.#keyMap.get(k);
    if (index === undefined) {
      if (status) status.fetch = 'miss';
      const p = this.#backgroundFetch(k, index, options, context);
      return p.__returned = p;
    } else {
      // in cache, maybe already fetching
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        const stale = allowStale && v.__staleWhileFetching !== undefined;
        if (status) {
          status.fetch = 'inflight';
          if (stale) status.returnedStale = true;
        }
        return stale ? v.__staleWhileFetching : v.__returned = v;
      }
      // if we force a refresh, that means do NOT serve the cached value,
      // unless we are already in the process of refreshing the cache.
      const isStale = this.#isStale(index);
      if (!forceRefresh && !isStale) {
        if (status) status.fetch = 'hit';
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        if (status) this.#statusTTL(status, index);
        return v;
      }
      // ok, it is stale or a forced refresh, and not already fetching.
      // refresh the cache.
      const p = this.#backgroundFetch(k, index, options, context);
      const hasStale = p.__staleWhileFetching !== undefined;
      const staleVal = hasStale && allowStale;
      if (status) {
        status.fetch = isStale ? 'stale' : 'refresh';
        if (staleVal && isStale) status.returnedStale = true;
      }
      return staleVal ? p.__staleWhileFetching : p.__returned = p;
    }
  }
  async forceFetch(k, fetchOptions = {}) {
    const v = await this.fetch(k, fetchOptions);
    if (v === undefined) throw new Error('fetch() returned undefined');
    return v;
  }
  memo(k, memoOptions = {}) {
    const memoMethod = this.#memoMethod;
    if (!memoMethod) {
      throw new Error('no memoMethod provided to constructor');
    }
    const {
      context,
      forceRefresh,
      ...options
    } = memoOptions;
    const v = this.get(k, options);
    if (!forceRefresh && v !== undefined) return v;
    const vv = memoMethod(k, v, {
      options,
      context
    });
    this.set(k, vv, options);
    return vv;
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(k, getOptions = {}) {
    const {
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      status
    } = getOptions;
    const index = this.#keyMap.get(k);
    if (index !== undefined) {
      const value = this.#valList[index];
      const fetching = this.#isBackgroundFetch(value);
      if (status) this.#statusTTL(status, index);
      if (this.#isStale(index)) {
        if (status) status.get = 'stale';
        // delete only if not an in-flight background fetch
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            this.#delete(k, 'expire');
          }
          if (status && allowStale) status.returnedStale = true;
          return allowStale ? value : undefined;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== undefined) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : undefined;
        }
      } else {
        if (status) status.get = 'hit';
        // if we're currently fetching it, we don't actually have it yet
        // it's not stale, which means this isn't a staleWhileRefetching.
        // If it's not stale, and fetching, AND has a __staleWhileFetching
        // value, then that means the user fetched with {forceRefresh:true},
        // so it's safe to return that value.
        if (fetching) {
          return value.__staleWhileFetching;
        }
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        return value;
      }
    } else if (status) {
      status.get = 'miss';
    }
  }
  #connect(p, n) {
    this.#prev[n] = p;
    this.#next[p] = n;
  }
  #moveToTail(index) {
    // if tail already, nothing to do
    // if head, move head to next[index]
    // else
    //   move next[prev[index]] to next[index] (head has no prev)
    //   move prev[next[index]] to prev[index]
    // prev[index] = tail
    // next[tail] = index
    // tail = index
    if (index !== this.#tail) {
      if (index === this.#head) {
        this.#head = this.#next[index];
      } else {
        this.#connect(this.#prev[index], this.#next[index]);
      }
      this.#connect(this.#tail, index);
      this.#tail = index;
    }
  }
  /**
   * Deletes a key out of the cache.
   *
   * Returns true if the key was deleted, false otherwise.
   */
  delete(k) {
    return this.#delete(k, 'delete');
  }
  #delete(k, reason) {
    let deleted = false;
    if (this.#size !== 0) {
      const index = this.#keyMap.get(k);
      if (index !== undefined) {
        deleted = true;
        if (this.#size === 1) {
          this.#clear(reason);
        } else {
          this.#removeItemSize(index);
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error('deleted'));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v, k, reason);
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, reason]);
            }
          }
          this.#keyMap.delete(k);
          this.#keyList[index] = undefined;
          this.#valList[index] = undefined;
          if (index === this.#tail) {
            this.#tail = this.#prev[index];
          } else if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            const pi = this.#prev[index];
            this.#next[pi] = this.#next[index];
            const ni = this.#next[index];
            this.#prev[ni] = this.#prev[index];
          }
          this.#size--;
          this.#free.push(index);
        }
      }
    }
    if (this.#hasDisposeAfter && this.#disposed?.length) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return deleted;
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    return this.#clear('delete');
  }
  #clear(reason) {
    for (const index of this.#rindexes({
      allowStale: true
    })) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        v.__abortController.abort(new Error('deleted'));
      } else {
        const k = this.#keyList[index];
        if (this.#hasDispose) {
          this.#dispose?.(v, k, reason);
        }
        if (this.#hasDisposeAfter) {
          this.#disposed?.push([v, k, reason]);
        }
      }
    }
    this.#keyMap.clear();
    this.#valList.fill(undefined);
    this.#keyList.fill(undefined);
    if (this.#ttls && this.#starts) {
      this.#ttls.fill(0);
      this.#starts.fill(0);
    }
    if (this.#sizes) {
      this.#sizes.fill(0);
    }
    this.#head = 0;
    this.#tail = 0;
    this.#free.length = 0;
    this.#calculatedSize = 0;
    this.#size = 0;
    if (this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
  }
}
//# sourceMappingURL=index.js.map
; // ../local-exec/dist/caching-wrapper.js

/**
 * Creates a cached version of a stream executor that caches results based on execId.
 * Only caches when ExecOptions with execId is provided.
 */
function createCachedStreamExecutor(executor, cacheOptions) {
  const cache = new LRUCache({
    max: cacheOptions?.max ?? 10,
    ttl: cacheOptions?.ttl
  });
  return {
    async *execute(ctx, args, options) {
      // No caching if no options or no execId
      if (!options?.execId) {
        yield* executor.execute(ctx, args, options);
        return;
      }
      const cacheKey = options.execId;
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached) {
        yield* cached.fork();
        return;
      }
      // Execute and cache
      const stream = executor.execute(ctx, args, options);
      const forkable = new utils_dist /* ForkableIterable */.dV(stream);
      cache.set(cacheKey, forkable);
      yield* forkable.fork();
    }
  };
}
/**
 * Creates a cached version of a promise-based executor that caches results based on execId.
 * Only caches when ExecOptions with execId is provided.
 */
function createCachedExecutor(executor, cacheOptions) {
  const cache = new LRUCache({
    max: cacheOptions?.max ?? 10,
    ttl: cacheOptions?.ttl
  });
  return {
    async execute(ctx, args, options) {
      // No caching if no options or no execId
      if (!options?.execId) {
        return executor.execute(ctx, args, options);
      }
      const cacheKey = options.execId;
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
      // Execute and cache
      const result = await executor.execute(ctx, args, options);
      cache.set(cacheKey, result);
      return result;
    }
  };
}
//# sourceMappingURL=caching-wrapper.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/diagnostics_exec_pb.js
var diagnostics_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/diagnostics_exec_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/utils_pb.js
var utils_pb = __webpack_require__("../proto/dist/generated/agent/v1/utils_pb.js");
; // ../local-exec/dist/diagnostics.js
var diagnostics_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var diagnostics_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalDiagnosticsExecutor {
  constructor(workspacePath, diagnosticsProvider) {
    this.workspacePath = workspacePath;
    this.diagnosticsProvider = diagnosticsProvider;
  }
  async execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = diagnostics_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalDiagnosticsExecutor.execute")), false);
      // Limit all of our LSP requests to a 10-second timeout
      let cancel;
      [ctx, cancel] = ctx.withTimeoutAndCancel(10_000);
      try {
        // If workspace path is undefined, expect absolute paths
        const targetPath = resolvePath(args.path, this.workspacePath);
        // Check if file exists
        try {
          const stats = await (0, promises_.stat)(targetPath);
          if (!stats.isFile() && !stats.isDirectory()) {
            return new diagnostics_exec_pb /* DiagnosticsResult */.Ek({
              result: {
                case: "fileNotFound",
                value: new diagnostics_exec_pb /* DiagnosticsFileNotFound */.Mu({
                  path: args.path
                })
              }
            });
          }
        } catch (error) {
          if (error.code === "ENOENT") {
            return new diagnostics_exec_pb /* DiagnosticsResult */.Ek({
              result: {
                case: "fileNotFound",
                value: new diagnostics_exec_pb /* DiagnosticsFileNotFound */.Mu({
                  path: args.path
                })
              }
            });
          }
          // Check for permission errors
          if (error.code === "EACCES") {
            return new diagnostics_exec_pb /* DiagnosticsResult */.Ek({
              result: {
                case: "permissionDenied",
                value: new diagnostics_exec_pb /* DiagnosticsPermissionDenied */.RP({
                  path: args.path
                })
              }
            });
          }
          throw error;
        }
        const absolutePath = resolvePath(targetPath, this.workspacePath);
        const url = new utils_dist /* FileURL */.qA(absolutePath);
        // Open the file in the LSP
        await this.diagnosticsProvider.open(ctx, url);
        // Get diagnostics
        const lspDiagnostics = await this.diagnosticsProvider.getDiagnostics(ctx, url);
        // Convert LSP diagnostics to proto format
        const protoDiagnostics = lspDiagnostics.map(d => this.convertDiagnostic(d));
        return new diagnostics_exec_pb /* DiagnosticsResult */.Ek({
          result: {
            case: "success",
            value: new diagnostics_exec_pb /* DiagnosticsSuccess */.a1({
              path: args.path,
              diagnostics: protoDiagnostics,
              totalDiagnostics: protoDiagnostics.length
            })
          }
        });
      } catch (error) {
        // Check if the request was aborted by checking the signal state
        if (ctx.canceled) {
          return new diagnostics_exec_pb /* DiagnosticsResult */.Ek({
            result: {
              case: "error",
              value: new diagnostics_exec_pb /* DiagnosticsError */.Ho({
                path: args.path,
                error: "Request timed out after 10 seconds"
              })
            }
          });
        }
        return new diagnostics_exec_pb /* DiagnosticsResult */.Ek({
          result: {
            case: "error",
            value: new diagnostics_exec_pb /* DiagnosticsError */.Ho({
              path: args.path,
              error: error instanceof Error ? error.message : String(error)
            })
          }
        });
      } finally {
        // Clean up the timeout, if we finish early.
        cancel();
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      diagnostics_disposeResources(env_1);
    }
  }
  convertDiagnostic(lspDiagnostic) {
    return new diagnostics_exec_pb /* Diagnostic */.oQ({
      severity: this.convertSeverity(lspDiagnostic.severity),
      range: lspDiagnostic.range ? new utils_pb /* Range */.Q6({
        start: new utils_pb /* Position */.yX({
          line: lspDiagnostic.range.start.line,
          column: lspDiagnostic.range.start.character
        }),
        end: new utils_pb /* Position */.yX({
          line: lspDiagnostic.range.end.line,
          column: lspDiagnostic.range.end.character
        })
      }) : undefined,
      message: lspDiagnostic.message,
      source: lspDiagnostic.source,
      code: lspDiagnostic.code ? String(lspDiagnostic.code) : undefined
    });
  }
  convertSeverity(lspSeverity) {
    switch (lspSeverity) {
      case 1:
        // Error
        return diagnostics_exec_pb /* DiagnosticSeverity */.h_.ERROR;
      case 2:
        // Warning
        return diagnostics_exec_pb /* DiagnosticSeverity */.h_.WARNING;
      case 3:
        // Information
        return diagnostics_exec_pb /* DiagnosticSeverity */.h_.INFORMATION;
      case 4:
        // Hint
        return diagnostics_exec_pb /* DiagnosticSeverity */.h_.HINT;
      default:
        return diagnostics_exec_pb /* DiagnosticSeverity */.h_.UNSPECIFIED;
    }
  }
}
//# sourceMappingURL=diagnostics.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/read_exec_pb.js
var read_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/read_exec_pb.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/jimp@1.6.0/node_modules/jimp/dist/esm/index.js + 50 modules
var esm = __webpack_require__("../../node_modules/.pnpm/jimp@1.6.0/node_modules/jimp/dist/esm/index.js");
; // ../local-exec/dist/constants.js
/**
 * Shared constants for local execution
 */
/** Maximum buffer size for stdout/stderr output (1MiB) */
const MAX_BUFFER_SIZE = 1048576;
const MAX_TEXT_SIZE = 8388608; // 8 MiB for text files
//# sourceMappingURL=constants.js.map
; // ../local-exec/dist/read.js
var read_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var read_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const MAX_IMAGE_DIMENSION = 2000;
async function resizeImageIfNeeded(path) {
  const buf = await (0, promises_.readFile)(path);
  const image = await esm /* Jimp */.dK.read(buf);
  const width = image.width;
  const height = image.height;
  // Check if resizing is needed
  if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
    return buf;
  }
  // Calculate new dimensions while maintaining aspect ratio
  let newWidth = width;
  let newHeight = height;
  if (width > height) {
    if (width > MAX_IMAGE_DIMENSION) {
      newWidth = MAX_IMAGE_DIMENSION;
      newHeight = Math.round(height * MAX_IMAGE_DIMENSION / width);
    }
  } else {
    if (height > MAX_IMAGE_DIMENSION) {
      newHeight = MAX_IMAGE_DIMENSION;
      newWidth = Math.round(width * MAX_IMAGE_DIMENSION / height);
    }
  }
  // Resize the image
  image.resize({
    w: newWidth,
    h: newHeight
  });
  let mimeType = "image/png";
  switch (image.mime) {
    case "image/png":
      mimeType = "image/png";
      break;
    case "image/bmp":
      mimeType = "image/bmp";
      break;
    case "image/tiff":
      mimeType = "image/tiff";
      break;
    case "image/x-ms-bmp":
      mimeType = "image/x-ms-bmp";
      break;
    case "image/gif":
      mimeType = "image/gif";
      break;
    case "image/jpeg":
      mimeType = "image/jpeg";
      break;
    default:
      mimeType = "image/png";
  }
  return await image.getBuffer(mimeType);
}
class LocalReadExecutor {
  constructor(permissionsService, workspacePath) {
    this.permissionsService = permissionsService;
    this.workspacePath = workspacePath;
  }
  async execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = read_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalReadExecutor.execute")), false);
      const filePath = args.path;
      const resolvedPath = resolvePath(filePath, this.workspacePath);
      const shouldBlock = await this.permissionsService.shouldBlockRead(resolvedPath);
      if (shouldBlock) {
        let message = `Read blocked by permissions settings`;
        switch (shouldBlock.type) {
          case "permissionsConfig":
            message = "Read blocked by permissions settings";
            break;
          case "cursorIgnore":
            message = `Read blocked by cursor ignore`;
            break;
          case "adminBlock":
            message = `Read blocked by admin repository block`;
            break;
        }
        return new read_exec_pb /* ReadResult */.sV({
          result: {
            case: "rejected",
            value: new read_exec_pb /* ReadRejected */.f4({
              path: resolvedPath,
              reason: message
            })
          }
        });
      }
      try {
        const stats = await (0, promises_.stat)(resolvedPath);
        if (stats.isDirectory()) {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "error",
              value: new read_exec_pb /* ReadError */.F_({
                path: resolvedPath,
                error: "Path is a directory, not a file"
              })
            }
          });
        }
        if (!stats.isFile()) {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "error",
              value: new read_exec_pb /* ReadError */.F_({
                path: resolvedPath,
                error: "Path is neither a file nor a directory"
              })
            }
          });
        }
        const contentInfo = await getFormatForFile(resolvedPath);
        // Check if the file is an image
        const isImage = contentInfo.isImageFile;
        if (isImage) {
          // Resize image if needed
          const resizedData = await resizeImageIfNeeded(resolvedPath);
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "success",
              value: new read_exec_pb /* ReadSuccess */.mE({
                path: resolvedPath,
                output: {
                  case: "data",
                  value: resizedData
                },
                totalLines: 0,
                fileSize: BigInt(stats.size),
                truncated: false
              })
            }
          });
        } else {
          // Read file as text
          const fullContent = await readText(resolvedPath);
          let content = fullContent;
          let truncated = false;
          // Truncate if content exceeds MAX_TEXT_SIZE
          if (content.length > MAX_TEXT_SIZE) {
            content = content.substring(0, MAX_TEXT_SIZE);
            truncated = true;
          }
          const totalLines = countLines(fullContent);
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "success",
              value: new read_exec_pb /* ReadSuccess */.mE({
                path: resolvedPath,
                output: {
                  case: "content",
                  value: content
                },
                totalLines: totalLines,
                fileSize: BigInt(stats.size),
                truncated: truncated
              })
            }
          });
        }
      } catch (error) {
        const err = error;
        if (err.code === "ENOENT") {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "fileNotFound",
              value: new read_exec_pb /* ReadFileNotFound */.Ko({
                path: resolvedPath
              })
            }
          });
        }
        if (err.code === "EACCES") {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "permissionDenied",
              value: new read_exec_pb /* ReadPermissionDenied */.lW({
                path: resolvedPath
              })
            }
          });
        }
        return new read_exec_pb /* ReadResult */.sV({
          result: {
            case: "error",
            value: new read_exec_pb /* ReadError */.F_({
              path: resolvedPath,
              error: err instanceof Error ? err.message : "Unknown error occurred"
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      read_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=read.js.map
// EXTERNAL MODULE: external "node:child_process"
var external_node_child_process_ = __webpack_require__("node:child_process");
// EXTERNAL MODULE: external "node:util"
var external_node_util_ = __webpack_require__("node:util");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/record_screen_exec_pb.js
var record_screen_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/record_screen_exec_pb.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@bufbuild+protobuf@1.10.0/node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
var proto_int64 = __webpack_require__("../../node_modules/.pnpm/@bufbuild+protobuf@1.10.0/node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js");
; // ../local-exec/dist/record-screen.js
var record_screen_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var record_screen_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const execFileAsync = (0, external_node_util_.promisify)(external_node_child_process_.execFile);
const RECORDINGS_DIR = "/opt/cursor/artifacts/";
const DISPLAY = ":1.0";
class LocalRecordScreenExecutor {
  constructor() {
    // Single global recording - there can only be one active recording at a time
    this.activeRecording = null;
  }
  /**
   * Sanitize tool_call_id for use in file paths
   */
  sanitizeToolCallId(toolCallId) {
    // Replace non-alphanumeric and non-underscore/non-hyphen characters with underscore
    return toolCallId.replace(/[^a-zA-Z0-9_-]/g, "_");
  }
  /**
   * Ensure the recordings directory exists
   */
  async ensureRecordingDirectoryExists() {
    await promises_.mkdir(RECORDINGS_DIR, {
      recursive: true
    });
  }
  /**
   * Build a unique output path for a recording
   */
  buildOutputPath(toolCallId) {
    const sanitized = this.sanitizeToolCallId(toolCallId);
    const timestamp = Date.now();
    const filename = `${sanitized}-${timestamp}.mp4`;
    return external_node_path_.join(RECORDINGS_DIR, filename);
  }
  /**
   * Detect screen resolution using xrandr
   */
  async detectResolution() {
    try {
      const {
        stdout
      } = await execFileAsync("xrandr", []);
      const lines = stdout.split("\n");
      // Find the first line containing '*'
      for (const line of lines) {
        if (line.includes("*")) {
          // Extract the first whitespace-separated token (e.g., "1920x1080")
          const match = line.trim().match(/^(\S+)/);
          if (match?.[1]) {
            return match[1];
          }
        }
      }
      throw new Error("No active display found in xrandr output");
    } catch (error) {
      throw new Error(`Failed to detect screen resolution via xrandr: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /**
   * Start an ffmpeg recording process
   */
  async startFfmpegRecording(resolution, outputPath) {
    return new Promise((resolve, reject) => {
      const args = ["-video_size", resolution, "-framerate", "30", "-f", "x11grab", "-i", DISPLAY, "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", outputPath];
      const child = (0, external_node_child_process_.spawn)("ffmpeg", args, {
        stdio: ["ignore", "pipe", "pipe"]
      });
      let hasResolved = false;
      let errorOccurred = false;
      // Check for immediate errors (e.g., ffmpeg not found)
      child.once("error", error => {
        if (!hasResolved) {
          hasResolved = true;
          errorOccurred = true;
          reject(new Error(`Failed to start ffmpeg: ${error.message}`));
        }
      });
      // Wait a short time to detect immediate failures, then consider it started
      const startTimeout = setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          // Check if process is still alive
          if (child.killed || errorOccurred) {
            reject(new Error("ffmpeg process exited immediately"));
          } else {
            resolve(child);
          }
        }
      }, 500); // 500ms should be enough to detect immediate failures
      // If process exits quickly, treat it as a failure (recording should run continuously)
      child.once("exit", (code, signal) => {
        clearTimeout(startTimeout);
        if (!hasResolved) {
          hasResolved = true;
          // Any early exit is a failure - ffmpeg should keep running until we stop it
          if (code !== null && code !== 0) {
            reject(new Error(`ffmpeg exited with code ${code}${signal ? ` and signal ${signal}` : ""}`));
          } else if (signal !== null) {
            reject(new Error(`ffmpeg was killed by signal ${signal}`));
          } else {
            // code === 0 or code === null with no signal - unexpected early exit
            reject(new Error("ffmpeg exited unexpectedly"));
          }
        }
      });
    });
  }
  /**
   * Stop an ffmpeg recording process gracefully
   */
  async stopFfmpegRecording(state) {
    const {
      childProcess
    } = state;
    if (childProcess.killed || !childProcess.pid) {
      // Process already stopped
      return;
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Force kill if graceful shutdown fails
        try {
          if (childProcess.pid) {
            childProcess.kill("SIGKILL");
          }
          reject(new Error("Timeout waiting for ffmpeg to stop"));
        } catch (error) {
          reject(new Error(`Failed to force kill ffmpeg: ${error instanceof Error ? error.message : String(error)}`));
        }
      }, 5000); // 5 second timeout
      // Send SIGINT to gracefully stop ffmpeg (allows it to finalize the file)
      try {
        childProcess.kill("SIGINT");
      } catch (error) {
        clearTimeout(timeout);
        reject(new Error(`Failed to send SIGINT to ffmpeg: ${error instanceof Error ? error.message : String(error)}`));
        return;
      }
      childProcess.once("exit", (code, _signal) => {
        clearTimeout(timeout);
        // SIGINT exit is expected (ffmpeg should exit with code 0 or 255 after SIGINT)
        if (code === null) {
          // Process was killed by signal, that's fine
          resolve();
        } else {
          resolve();
        }
      });
      childProcess.once("error", error => {
        clearTimeout(timeout);
        reject(new Error(`Error stopping ffmpeg: ${error.message}`));
      });
    });
  }
  async execute(parentCtx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = record_screen_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalRecordScreenExecutor.execute")), false);
      // Ensure recordings directory exists
      await this.ensureRecordingDirectoryExists();
      // Handle UNSPECIFIED mode
      if (args.mode === record_screen_exec_pb /* RecordingMode */.$u.UNSPECIFIED) {
        return new record_screen_exec_pb /* RecordScreenResult */.Tj({
          result: {
            case: "failure",
            value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
              error: "Mode must be one of START_RECORDING, SAVE_RECORDING, DISCARD_RECORDING"
            })
          }
        });
      }
      switch (args.mode) {
        case record_screen_exec_pb /* RecordingMode */.$u.START_RECORDING:
          {
            // Cancel existing recording if one is in progress
            let wasPriorRecordingCancelled = false;
            if (this.activeRecording) {
              wasPriorRecordingCancelled = true;
              try {
                // Stop recording if still running
                if (!this.activeRecording.childProcess.killed && this.activeRecording.childProcess.pid) {
                  await this.stopFfmpegRecording(this.activeRecording);
                }
                // Delete the old file
                try {
                  await promises_.rm(this.activeRecording.outputPath, {
                    force: true
                  });
                } catch (rmError) {
                  // Ignore ENOENT errors (file already deleted)
                  const error = rmError instanceof Error ? rmError : new Error(String(rmError));
                  // @ts-expect-error - code might not exist on all errors
                  if (error.code !== "ENOENT") {
                    // Log but don't fail - we'll start a new recording anyway
                  }
                }
                // Clear active recording
                this.activeRecording = null;
              } catch (_cancelError) {
                // Log but continue - we'll try to start a new recording anyway
                // Clear state to avoid stale state
                this.activeRecording = null;
              }
            }
            try {
              // Build output path (use tool_call_id for unique filename if provided)
              const outputPath = this.buildOutputPath(args.toolCallId || "recording");
              // Detect resolution
              const resolution = await this.detectResolution();
              // Start ffmpeg
              const childProcess = await this.startFfmpegRecording(resolution, outputPath);
              // Store recording state with start time
              const startTime = Date.now();
              this.activeRecording = {
                childProcess,
                outputPath,
                startTime
              };
              // Clean up on process exit
              childProcess.once("exit", () => {
                // Optionally clear state if exited unexpectedly
                // For now, we'll leave it so SAVE/DISCARD can detect it's done
              });
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "startSuccess",
                  value: new record_screen_exec_pb /* RecordScreenStartSuccess */.T4({
                    wasPriorRecordingCancelled
                  })
                }
              });
            } catch (error) {
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: error instanceof Error ? error.message : String(error)
                  })
                }
              });
            }
          }
        case record_screen_exec_pb /* RecordingMode */.$u.SAVE_RECORDING:
          {
            if (!this.activeRecording) {
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: "No active recording to save"
                  })
                }
              });
            }
            const state = this.activeRecording;
            try {
              // Stop recording if still running
              if (!state.childProcess.killed && state.childProcess.pid) {
                await this.stopFfmpegRecording(state);
              }
              // Verify file exists and is accessible
              try {
                await promises_.access(state.outputPath, promises_.constants.R_OK);
              } catch (_accessError) {
                // File might not exist or not accessible - clear state since recording is lost
                this.activeRecording = null;
                return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                  result: {
                    case: "failure",
                    value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                      error: `Recording file not accessible at ${state.outputPath}`
                    })
                  }
                });
              }
              const outputPath = state.outputPath;
              // Calculate recording duration
              const recordingDurationMs = Date.now() - state.startTime;
              // Clear active recording
              this.activeRecording = null;
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "saveSuccess",
                  value: new record_screen_exec_pb /* RecordScreenSaveSuccess */.ol({
                    path: outputPath,
                    recordingDurationMs: proto_int64 /* protoInt64 */.M.parse(recordingDurationMs.toString())
                  })
                }
              });
            } catch (error) {
              // Clear state even on error
              this.activeRecording = null;
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: error instanceof Error ? error.message : String(error)
                  })
                }
              });
            }
          }
        case record_screen_exec_pb /* RecordingMode */.$u.DISCARD_RECORDING:
          {
            if (!this.activeRecording) {
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: "No active recording to discard"
                  })
                }
              });
            }
            const state = this.activeRecording;
            try {
              // Stop recording if still running
              if (!state.childProcess.killed && state.childProcess.pid) {
                await this.stopFfmpegRecording(state);
              }
              // Delete the file
              try {
                await promises_.rm(state.outputPath, {
                  force: true
                });
              } catch (rmError) {
                // If file doesn't exist (ENOENT), that's fine - consider it discarded
                const error = rmError instanceof Error ? rmError : new Error(String(rmError));
                // @ts-expect-error - code might not exist on all errors
                if (error.code !== "ENOENT") {
                  // Only fail if it's not a "file not found" error
                  throw error;
                }
              }
              // Clear active recording
              this.activeRecording = null;
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "discardSuccess",
                  value: new record_screen_exec_pb /* RecordScreenDiscardSuccess */.N8()
                }
              });
            } catch (error) {
              // Capture the file path before clearing state
              const filePath = state.outputPath;
              // Clear state even on error
              this.activeRecording = null;
              const errorMessage = error instanceof Error ? error.message : String(error);
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: `Failed to discard recording: ${errorMessage}.\nRecording file may not have been deleted: ${filePath}`
                  })
                }
              });
            }
          }
        default:
          {
            // Exhaustive check for TypeScript
            const _exhaustiveCheck = args.mode;
            return new record_screen_exec_pb /* RecordScreenResult */.Tj({
              result: {
                case: "failure",
                value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                  error: `Unhandled recording mode: ${_exhaustiveCheck}`
                })
              }
            });
          }
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      record_screen_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=record-screen.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/request_context_exec_pb.js + 1 modules
var request_context_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/request_context_exec_pb.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@bufbuild+protobuf@1.10.0/node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/struct_pb.js
var struct_pb = __webpack_require__("../../node_modules/.pnpm/@bufbuild+protobuf@1.10.0/node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/struct_pb.js");
; // ../local-exec/dist/notes.js

async function buildTreeStructure(dirPath) {
  const entries = await (0, promises_.readdir)(dirPath, {
    withFileTypes: true
  }).catch(() => []);
  const nodes = [];
  for (const entry of entries) {
    const fullPath = external_node_path_.join(dirPath, entry.name);
    const node = {
      name: entry.name,
      path: fullPath,
      isDirectory: entry.isDirectory()
    };
    if (entry.isDirectory()) {
      node.children = await buildTreeStructure(fullPath);
    }
    nodes.push(node);
  }
  return nodes.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });
}
function formatTreeNode(node, prefix = "", isLast = true) {
  const connector = isLast ? "└── " : "├── ";
  const displayName = node.isDirectory ? `${node.name}/` : node.name;
  const lines = [`${prefix}${connector}${displayName}`];
  const children = node.children;
  if (children?.length) {
    const childPrefix = prefix + (isLast ? "    " : "│   ");
    children.forEach((child, index) => {
      const childIsLast = index === children.length - 1;
      lines.push(...formatTreeNode(child, childPrefix, childIsLast));
    });
  }
  return lines;
}
async function generateTreeListingForPath(notesPath) {
  const exists = await (0, promises_.access)(notesPath, promises_.constants.R_OK).then(() => true, () => false);
  if (!exists) {
    return "(No notes directory yet - will be created when you write your first note)";
  }
  const tree = await buildTreeStructure(notesPath);
  if (tree.length === 0) {
    return "(Notes directory is empty)";
  }
  return tree.flatMap((node, index) => formatTreeNode(node, "", index === tree.length - 1)).join("\n");
}
async function generateConversationNotesTreeListing(projectDir, notesSessionId) {
  const notesPath = external_node_path_.join(projectDir, "agent-notes", notesSessionId);
  return generateTreeListingForPath(notesPath);
}
async function generateSharedNotesTreeListing(projectDir) {
  const notesPath = external_node_path_.join(projectDir, "agent-notes", "shared");
  return generateTreeListingForPath(notesPath);
}
//# sourceMappingURL=notes.js.map
; // ../local-exec/dist/services/common.js

const execFilePromise = (0, external_node_util_.promisify)(external_node_child_process_.execFile);
/**
 * Finds the root directory of the git repository containing the given path.
 * Returns null if not in a git repository.
 */
async function findGitRoot(startPath) {
  try {
    const {
      stdout
    } = await execFilePromise("git", ["rev-parse", "--show-toplevel"], {
      cwd: startPath
    });
    return stdout.trim();
  } catch (_error) {
    // Not in a git repository or git command failed
    return null;
  }
}
/**
 * Gets the remote origin URL for a git repository.
 * Returns undefined if no remote origin is configured.
 */
async function getGitRemoteUrl(gitRoot) {
  try {
    const {
      stdout
    } = await execFilePromise("git", ["config", "--get", "remote.origin.url"], {
      cwd: gitRoot
    });
    return stdout.trim();
  } catch (_error) {
    // No remote origin configured or git command failed
    return undefined;
  }
}
/**
 * Normalize a remote URL into a stable host/path form, e.g. github.com/owner/repo
 * Handles both URL-style and SCP-style git remotes.
 */
function toHostPath(rawUrl) {
  let url = rawUrl.trim();
  if (url.startsWith("git@")) {
    url = url.replace(/^git@/, "").replace(":", "/");
  }
  if (url.startsWith("ssh://git@")) {
    url = url.replace(/^ssh:\/\/git@/, "");
  }
  url = url.replace(/^https?:\/\//i, "");
  url = url.replace(/\.git$/i, "");
  return url;
}
// Globs to skip when scanning for .gitignore / .cursorignore files.
// Mirrors common heavy or tool-generated directories similar to DIRS_TO_SKIP in the VS Code service.
const DEFAULT_GLOB_IGNORE_DIRS = ["**/node_modules/**", "**/.git/**", "**/.turbo/**", "**/.next/**", "**/.cache/**", "**/.pnpm/**", "**/.yarn/**", "**/dist/**", "**/build/**", "**/out/**", "**/target/**", "**/.vscode/**", "**/.idea/**", "**/venv/**", "**/__pycache__/**", "**/logs/**", "**/tmp/**", "**/temp/**"];
//# sourceMappingURL=common.js.map
; // ../local-exec/dist/request-context.js
var request_context_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var request_context_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const execFile = (0, external_node_util_.promisify)(external_node_child_process_.execFile);
async function getGitRepoPathForWorkspacePath(path) {
  try {
    const {
      stdout
    } = await execFile("git", ["rev-parse", "--show-toplevel"], {
      cwd: path
    });
    return stdout.toString().trim();
  } catch {
    return undefined;
  }
}
async function getGitStatusForRepoPath(ctx, repoPath) {
  const env_1 = {
    stack: [],
    error: void 0,
    hasError: false
  };
  try {
    const _span = request_context_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.getGitStatusForRepoPath")), false);
    try {
      // Use --short for fast, compact output (agents can read it fine)
      const {
        stdout
      } = await execFile("git", ["--no-optional-locks", "status", "--short", "--branch"], {
        cwd: repoPath
      });
      return stdout.toString();
    } catch {
      return undefined;
    }
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    request_context_disposeResources(env_1);
  }
}
async function getGitBranchForRepoPath(repoPath) {
  try {
    const {
      stdout
    } = await execFile("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: repoPath
    });
    const branch = stdout.toString().trim();
    if (branch === "HEAD" || branch.length === 0) {
      return undefined;
    }
    return branch;
  } catch {
    return undefined;
  }
}
async function computeEnv(_ctx, workspacePaths, projectDir, notesSessionId, getSandboxEnabled, userTerminalHint) {
  const osVersion = `${external_node_os_.platform()} ${external_node_os_.release()}`;
  const shell = (0, shell_exec_dist /* getSuggestedShell */.G6)(userTerminalHint);
  const timeZone = (() => {
    try {
      const resolvedOptions = new Intl.DateTimeFormat().resolvedOptions();
      return resolvedOptions.timeZone ?? undefined;
    } catch {
      return undefined;
    }
  })();
  // Calculate folder paths if projectDir is available
  const projectFolder = projectDir;
  const terminalsFolder = projectDir ? `${projectDir}/terminals` : undefined;
  const agentSharedNotesFolder = projectDir ? `${projectDir}/agent-notes/shared` : undefined;
  const agentConversationNotesFolder = projectDir && notesSessionId ? `${projectDir}/agent-notes/${notesSessionId}` : undefined;
  // Determine if sandbox is enabled: check environment support and user preference
  // If getSandboxEnabled is provided, use it (it should check both environment and user preference)
  // Otherwise, default to false since we don't know the user preference
  const sandboxEnabled = getSandboxEnabled ? getSandboxEnabled() : false;
  return new request_context_exec_pb /* RequestContextEnv */.GE({
    osVersion,
    workspacePaths,
    shell,
    sandboxEnabled,
    projectFolder,
    terminalsFolder,
    agentSharedNotesFolder,
    agentConversationNotesFolder,
    timeZone
  });
}
async function computeGit(ctx, workspacePaths) {
  const env_2 = {
    stack: [],
    error: void 0,
    hasError: false
  };
  try {
    const span = request_context_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.computeGit")), false);
    // First, get all git repo paths for all workspace paths
    const repoPaths = await Promise.all(workspacePaths.map(path => getGitRepoPathForWorkspacePath(path)));
    // Dedupe repo paths (filter out undefined and duplicates)
    const uniqueRepoPaths = [...new Set(repoPaths.filter(path => path !== undefined))];
    // Now fetch git status, branch, and remote URL for each unique repo path in parallel
    const statusResults = await Promise.all(uniqueRepoPaths.map(async repoPath => ({
      repoPath,
      status: await getGitStatusForRepoPath(span.ctx, repoPath),
      branchName: await getGitBranchForRepoPath(repoPath),
      remoteUrl: await getGitRemoteUrl(repoPath)
    })));
    // Build git repos list, filtering out any repos where we couldn't get status
    const gitRepos = statusResults.filter(result => result.status !== undefined || result.branchName !== undefined).map(result => new request_context_exec_pb /* GitRepoInfo */.DS({
      path: result.repoPath,
      status: result.status,
      branchName: result.branchName,
      remoteUrl: result.remoteUrl
    }));
    return gitRepos;
  } catch (e_2) {
    env_2.error = e_2;
    env_2.hasError = true;
  } finally {
    request_context_disposeResources(env_2);
  }
}
class LocalRequestContextExecutor {
  constructor(cursorRulesService, cloudRulesService, repositoryProvider, lsExecutor, mcpLease, workspacePath, projectDir, fileWatcher, getSandboxEnabled, skillsService, userTerminalHint) {
    this.cursorRulesService = cursorRulesService;
    this.cloudRulesService = cloudRulesService;
    this.repositoryProvider = repositoryProvider;
    this.lsExecutor = lsExecutor;
    this.mcpLease = mcpLease;
    this.workspacePath = workspacePath;
    this.projectDir = projectDir;
    this.skillsService = skillsService;
    this.userTerminalHint = userTerminalHint;
    this.rebuildCacheTraceId = undefined;
    this.enableCaching = !!fileWatcher;
    this.getSandboxEnabled = getSandboxEnabled;
    // If file watcher provided, eagerly compute and cache
    if (fileWatcher) {
      // Eagerly start computing (don't wait for first request)
      this.rebuildCache();
      // Subscribe to rebuild cache on any file change
      this.unsubscribeWatcher = fileWatcher.subscribe(() => {
        this.rebuildCache();
      });
    }
  }
  rebuildCache() {
    // Clear any pending debounced rebuild
    if (this.rebuildDebounceTimeout) {
      clearTimeout(this.rebuildDebounceTimeout);
    }
    this.rebuildDebounceTimeout = setTimeout(() => {
      const env_3 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const ctx = (0, dist /* createContext */.q6)();
        const span = request_context_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.rebuild")), false);
        this.rebuildDebounceTimeout = undefined;
        this.rebuildCacheTraceId = span.span.spanContext().traceId;
        this.requestContextCache = this.computeRequestContext(span.ctx, new request_context_exec_pb /* RequestContextArgs */._K());
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        request_context_disposeResources(env_3);
      }
    }, 500);
  }
  dispose() {
    if (this.rebuildDebounceTimeout) {
      clearTimeout(this.rebuildDebounceTimeout);
      this.rebuildDebounceTimeout = undefined;
    }
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
    this.requestContextCache = undefined;
  }
  async computeRequestContext(ctx, args) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = request_context_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.computeRequestContext")), false);
      const workspacePaths = Array.isArray(this.workspacePath) ? this.workspacePath : [this.workspacePath || process.cwd()];
      const firstWorkspacePath = workspacePaths[0];
      const projectDir = this.projectDir;
      const signal = AbortSignal.timeout(1000);
      const projectLayoutPromises = workspacePaths.map(async path => {
        const env_5 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const lsSpan = request_context_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(span.ctx.withName("LocalRequestContextExecutor.computeRequestContext.projectLayoutPromises.lsExecutor.execute")), false);
          const lsResult = await this.lsExecutor.execute(lsSpan.ctx, new ls_exec_pb /* LsArgs */.xe({
            path,
            ignore: []
          }));
          return lsResult.result.case === "success" ? lsResult.result.value.directoryTreeRoot : undefined;
        } catch (e_5) {
          env_5.error = e_5;
          env_5.hasError = true;
        } finally {
          request_context_disposeResources(env_5);
        }
      });
      const [mcpInstructions, rules, cloudRule, env, gitRepos, codebaseReference, mcpTools, conversationNotesListing, sharedNotesListing, projectLayouts, skills] = await Promise.all([this.mcpLease.getInstructions(span.ctx).catch(() => []), this.cursorRulesService.getAllCursorRules(span.ctx), this.cloudRulesService ? this.cloudRulesService.getCloudRule(span.ctx) : Promise.resolve(null), computeEnv(span.ctx, workspacePaths, projectDir, args.notesSessionId, this.getSandboxEnabled, this.userTerminalHint), computeGit(span.ctx, workspacePaths), this.repositoryProvider.getCodebaseReference(span.ctx, signal).catch(() => undefined), this.mcpLease.getTools(span.ctx).catch(() => []), projectDir && args.notesSessionId ? generateConversationNotesTreeListing(projectDir, args.notesSessionId) : Promise.resolve(undefined), projectDir ? generateSharedNotesTreeListing(projectDir) : Promise.resolve(undefined), Promise.all(projectLayoutPromises).then(layouts => layouts.filter(l => l !== undefined)), this.skillsService ? this.skillsService.getSkills(span.ctx).catch(() => []) : Promise.resolve([])]);
      const requestContext = new request_context_exec_pb /* RequestContext */.bb({
        rules,
        env,
        gitRepos,
        repositoryInfo: codebaseReference ? [{
          relativeWorkspacePath: codebaseReference.relativeWorkspacePath,
          repoName: codebaseReference.repoName,
          repoOwner: codebaseReference.repoOwner,
          isTracked: codebaseReference.isTracked,
          isLocal: codebaseReference.isLocal,
          orthogonalTransformSeed: codebaseReference.orthogonalTransformSeed,
          pathEncryptionKey: codebaseReference.pathEncryptionKey
        }] : [],
        tools: mcpTools.map(tool => new mcp_pb /* McpToolDefinition */.gd({
          name: tool.name,
          providerIdentifier: tool.providerIdentifier,
          toolName: tool.toolName,
          description: tool.description,
          inputSchema: tool.inputSchema ? struct_pb /* Value */.WT.fromJson(tool.inputSchema) : undefined
        })),
        conversationNotesListing,
        sharedNotesListing,
        projectLayouts,
        mcpInstructions,
        skillOptions: skills.length > 0 ? new request_context_exec_pb /* SkillOptions */.uw({
          skillDescriptors: skills.map(skill => new request_context_exec_pb /* SkillDescriptor */.ng({
            name: skill.name,
            description: skill.description,
            folderPath: skill.folderPath
          }))
        }) : undefined
      });
      if (cloudRule !== null && cloudRule !== undefined) {
        requestContext.cloudRule = cloudRule;
      }
      return requestContext;
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      request_context_disposeResources(env_4);
    }
  }
  async execute(ctx, args) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = request_context_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.execute")), false);
      span.span.setAttribute("enableCaching", this.enableCaching);
      span.span.setAttribute("isCached", !!this.requestContextCache);
      try {
        let requestContext;
        if (this.enableCaching) {
          // If no cache (first time or invalidated), compute it
          if (!this.requestContextCache) {
            this.requestContextCache = this.computeRequestContext(span.ctx, args);
          }
          {
            const env_7 = {
              stack: [],
              error: void 0,
              hasError: false
            };
            try {
              const cacheSpan = request_context_addDisposableResource(env_7, (0, dist /* createSpan */.VI)(span.ctx.withName("LocalRequestContextExecutor.execute.computeRequestContext.requestContextCache")), false);
              if (this.rebuildCacheTraceId) {
                cacheSpan.span.setAttribute("cacheTraceId", this.rebuildCacheTraceId);
              }
              requestContext = await this.requestContextCache;
            } catch (e_6) {
              env_7.error = e_6;
              env_7.hasError = true;
            } finally {
              request_context_disposeResources(env_7);
            }
          }
          // Always reload MCP tools from the lease, even when using cache
          const mcpTools = await this.mcpLease.getTools(span.ctx).catch(() => []);
          requestContext = new request_context_exec_pb /* RequestContext */.bb({
            ...requestContext,
            tools: mcpTools.map(tool => new mcp_pb /* McpToolDefinition */.gd({
              name: tool.name,
              providerIdentifier: tool.providerIdentifier,
              toolName: tool.toolName,
              description: tool.description,
              inputSchema: tool.inputSchema ? struct_pb /* Value */.WT.fromJson(tool.inputSchema) : undefined
            }))
          });
        } else {
          // No caching - compute fresh each time
          requestContext = await this.computeRequestContext(span.ctx, args);
        }
        return new request_context_exec_pb /* RequestContextResult */._G({
          result: {
            case: "success",
            value: new request_context_exec_pb /* RequestContextSuccess */.yW({
              requestContext
            })
          }
        });
      } catch (error) {
        span.span.recordException(error);
        return new request_context_exec_pb /* RequestContextResult */._G({
          result: {
            case: "error",
            value: new request_context_exec_pb /* RequestContextError */.nf({
              error: error instanceof Error ? error.message : String(error)
            })
          }
        });
      }
    } catch (e_7) {
      env_6.error = e_7;
      env_6.hasError = true;
    } finally {
      request_context_disposeResources(env_6);
    }
  }
}
//# sourceMappingURL=request-context.js.map
; // ../local-exec/dist/shell.js
var shell_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var shell_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalShellExecutor {
  constructor(permissionsService, coreExecutor, ignoreService, _pendingDecisionProvider) {
    this.permissionsService = permissionsService;
    this.coreExecutor = coreExecutor;
    this.ignoreService = ignoreService;
  }
  // Build a standardized result from base fields and exit code
  buildResultFromExit(base) {
    if ((base.exitCode ?? -1) === 0) {
      return new shell_exec_pb /* ShellResult */.W4({
        result: {
          case: "success",
          value: new shell_exec_pb /* ShellSuccess */.QR({
            ...base,
            // If file-based, empty the inline fields; otherwise populate them
            stdout: base.outputLocation ? "" : base.stdout,
            stderr: base.outputLocation ? "" : base.stderr
          })
        },
        sandboxPolicy: convertInternalToProtoPolicy(base.sandboxPolicy)
      });
    }
    return new shell_exec_pb /* ShellResult */.W4({
      result: {
        case: "failure",
        value: new shell_exec_pb /* ShellFailure */.xC({
          ...base,
          // If file-based, empty the inline fields; otherwise populate them
          stdout: base.outputLocation ? "" : base.stdout,
          stderr: base.outputLocation ? "" : base.stderr
        })
      },
      sandboxPolicy: convertInternalToProtoPolicy(base.sandboxPolicy)
    });
  }
  async executeWithPolicy(ctx, args, workingDirectory, timeout, policy) {
    const startTime = Date.now();
    // Create an AbortController for timeout management
    const timeoutController = new AbortController();
    const combinedSignal = ctx.signal ? AbortSignal.any([ctx.signal, timeoutController.signal]) : timeoutController.signal;
    const timer = setTimeout(() => {
      timeoutController.abort();
    }, timeout);
    try {
      let stdout = "";
      let stderr = "";
      let exitCode = null;
      let outputLocation;
      for await (const event of this.coreExecutor.execute(ctx, {
        command: args.command,
        workingDirectory,
        timeout,
        signal: combinedSignal,
        toolCallId: args.toolCallId,
        sandboxPolicy: policy,
        fileOutputThresholdBytes: args.fileOutputThresholdBytes
      })) {
        if (event.type === "stdout") stdout += event.data;else if (event.type === "stderr") stderr += event.data;else if (event.type === "exit") {
          exitCode = event.code;
          outputLocation = event.outputLocation;
        }
      }
      clearTimeout(timer);
      const executionTime = Date.now() - startTime;
      const baseResult = {
        command: args.command,
        workingDirectory,
        exitCode: exitCode ?? -1,
        signal: "",
        stdout,
        stderr,
        executionTime,
        sandboxPolicy: policy,
        outputLocation
      };
      const res = this.buildResultFromExit(baseResult);
      return res;
    } catch (error) {
      clearTimeout(timer);
      if (timeoutController.signal.aborted && !ctx.signal.aborted) {
        return new shell_exec_pb /* ShellResult */.W4({
          result: {
            case: "timeout",
            value: new shell_exec_pb /* ShellTimeout */.eG({
              command: args.command,
              workingDirectory,
              timeoutMs: timeout
            })
          },
          sandboxPolicy: convertInternalToProtoPolicy(policy)
        });
      }
      if (ctx.signal.aborted) {
        return new shell_exec_pb /* ShellResult */.W4({
          result: {
            case: "rejected",
            value: new shell_exec_pb /* ShellRejected */.pZ({
              command: args.command,
              workingDirectory,
              reason: "Command aborted"
            })
          },
          sandboxPolicy: convertInternalToProtoPolicy(policy)
        });
      }
      return new shell_exec_pb /* ShellResult */.W4({
        result: {
          case: "spawnError",
          value: new shell_exec_pb /* ShellSpawnError */.mJ({
            command: args.command,
            workingDirectory,
            error: error instanceof Error ? error.message : "Unknown error"
          })
        },
        sandboxPolicy: convertInternalToProtoPolicy(policy)
      });
    }
  }
  async execute(parentCtx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = shell_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalShellExecutor.execute")), false);
      const ctx = span.ctx;
      (0, dist /* reportEvent */.HF)(ctx, "LocalShellExecutor.execute");
      const command = args.command;
      const policy = args.requestedSandboxPolicy ? convertProtoToInternalPolicy(args.requestedSandboxPolicy) : undefined;
      const workingDirectory = args.workingDirectory || (await this.coreExecutor.getCwd());
      const timeout = args.timeout || 30000;
      const resolvedWorkingDir = resolvePath(workingDirectory);
      if (!args.parsingResult) {
        // Handle spawn error
        return new shell_exec_pb /* ShellResult */.W4({
          result: {
            case: "spawnError",
            value: new shell_exec_pb /* ShellSpawnError */.mJ({
              command,
              workingDirectory: resolvedWorkingDir,
              error: "Parsing result is required"
            })
          }
        });
      }
      // Unified approval gating using requested policy (skip if skip_approval is true)
      let effectivePolicy;
      if (!args.skipApproval) {
        const decision = await this.permissionsService.shouldBlockShellCommand(ctx, command, {
          workingDirectory: resolvedWorkingDir,
          timeout,
          parsingResult: args.parsingResult,
          toolCallId: args.toolCallId
        }, policy);
        if (decision.kind === "block") {
          const isReadonlyBlock = decision.reason.type === "permissionsConfig" ? decision.reason.isReadonly ?? false : false;
          if (isReadonlyBlock) {
            return new shell_exec_pb /* ShellResult */.W4({
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
          return new shell_exec_pb /* ShellResult */.W4({
            result: {
              case: "rejected",
              value: new shell_exec_pb /* ShellRejected */.pZ({
                command,
                workingDirectory: resolvedWorkingDir,
                reason: decision.reason.type === "userRejected" ? decision.reason.reason : decision.reason.type === "needsApproval" ? "Command is not allowed" : "Command is not allowed"
              })
            }
          });
        }
        // Use the allowed policy (may be more permissive than the default if the user has allowed it)
        effectivePolicy = decision.policy;
      } else {
        // When skip_approval is true, use the requested policy directly
        effectivePolicy = policy;
      }
      // Add cursorignore mapping to the effective policy if it's a sandboxed policy
      if (effectivePolicy && effectivePolicy.type !== "insecure_none") {
        const ignoreMapping = await this.ignoreService.getCursorIgnoreMapping();
        effectivePolicy = {
          ...effectivePolicy,
          ignore_mapping: ignoreMapping
        };
      }
      return this.executeWithPolicy(ctx, args, workingDirectory, timeout, effectivePolicy);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      shell_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=shell.js.map
; // ../local-exec/dist/shell-core.js
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
; // ../local-exec/dist/shell-stream.js
var shell_stream_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var shell_stream_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalShellStreamExecutor {
  constructor(permissionsService, coreExecutor, ignoreService) {
    this.permissionsService = permissionsService;
    this.coreExecutor = coreExecutor;
    this.ignoreService = ignoreService;
  }
  async *execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = shell_stream_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalShellStreamExecutor.execute")), false);
      const command = args.command;
      let requestedPolicy = convertProtoToInternalPolicy(args.requestedSandboxPolicy);
      // Add cursorignore mapping to the policy if it's a sandboxed policy
      if (requestedPolicy && requestedPolicy.type !== "insecure_none") {
        const ignoreMapping = await this.ignoreService.getCursorIgnoreMapping();
        requestedPolicy = {
          ...requestedPolicy,
          ignore_mapping: ignoreMapping
        };
      }
      const workingDirectory = args.workingDirectory || (await this.coreExecutor.getCwd());
      const timeout = args.timeout || 30000;
      const resolvedWorkingDir = resolvePath(workingDirectory);
      if (!args.parsingResult) {
        throw new Error("Parsing result is required");
      }
      // Check if the command should be blocked (skip if skip_approval is true)
      if (!args.skipApproval) {
        const blockResult = await this.permissionsService.shouldBlockShellCommand(ctx, command, {
          workingDirectory: resolvedWorkingDir,
          timeout,
          parsingResult: args.parsingResult,
          toolCallId: args.toolCallId
        }, requestedPolicy);
        if (blockResult.kind === "block") {
          if (blockResult.reason.type === "permissionsConfig") {
            yield new shell_exec_pb /* ShellStream */.FI({
              event: {
                case: "permissionDenied",
                value: new shell_exec_pb /* ShellPermissionDenied */.jn({
                  command,
                  workingDirectory: resolvedWorkingDir,
                  error: "Command blocked by permissions configuration",
                  isReadonly: blockResult.reason.isReadonly ?? false
                })
              }
            });
            return;
          }
          const reason = blockResult.reason.type === "userRejected" ? blockResult.reason.reason : blockResult.reason.type === "needsApproval" ? "Command is not allowed" : "Command is not allowed";
          yield new shell_exec_pb /* ShellStream */.FI({
            event: {
              case: "rejected",
              value: new shell_exec_pb /* ShellRejected */.pZ({
                command,
                workingDirectory: resolvedWorkingDir,
                reason
              })
            }
          });
          return;
        }
      }
      // Use the core executor to handle the command execution
      for await (const event of this.coreExecutor.execute(ctx, {
        command,
        workingDirectory,
        timeout,
        signal: ctx.signal,
        toolCallId: args.toolCallId,
        sandboxPolicy: requestedPolicy,
        fileOutputThresholdBytes: args.fileOutputThresholdBytes
      })) {
        if (event.type === "stdout") {
          yield new shell_exec_pb /* ShellStream */.FI({
            event: {
              case: "stdout",
              value: new shell_exec_pb /* ShellStreamStdout */.o0({
                data: event.data
              })
            }
          });
        } else if (event.type === "stderr") {
          yield new shell_exec_pb /* ShellStream */.FI({
            event: {
              case: "stderr",
              value: new shell_exec_pb /* ShellStreamStderr */.Db({
                data: event.data
              })
            }
          });
        } else if (event.type === "exit") {
          yield new shell_exec_pb /* ShellStream */.FI({
            event: {
              case: "exit",
              value: new shell_exec_pb /* ShellStreamExit */.vb({
                code: event.code ?? 0,
                cwd: await this.coreExecutor.getCwd(),
                outputLocation: event.outputLocation
              })
            }
          });
        }
        // Note: stdout_trimmed and stderr_trimmed events are handled internally by core
        // and don't need to be exposed in the stream interface
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      shell_stream_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=shell-stream.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/write_exec_pb.js
var write_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/write_exec_pb.js");
; // ../local-exec/dist/write.js
var write_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var write_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalWriteExecutor {
  constructor(fileChangeTracker, permissionsService, pendingDecisionProvider, workspacePath) {
    this.fileChangeTracker = fileChangeTracker;
    this.permissionsService = permissionsService;
    this.pendingDecisionProvider = pendingDecisionProvider;
    this.workspacePath = workspacePath;
  }
  async execute(parentCtx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = write_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalWriteExecutor.execute")), false);
      const ctx = span.ctx;
      const path = args.path;
      const fileText = args.fileText;
      const fileBytes = args.fileBytes.length > 0 ? args.fileBytes : undefined;
      const resolvedPath = resolvePath(path, this.workspacePath);
      // Read existing contents if the file exists to allow proper change tracking
      // This needs to happen before shouldBlock check so it's available for approval
      let beforeContent;
      try {
        beforeContent = await readText(resolvedPath);
      } catch {
        // File doesn't exist; we'll create it.
      }
      const shouldBlock = await this.permissionsService.shouldBlockWrite(ctx, resolvedPath, fileText);
      if (shouldBlock) {
        const blockResult = await handleBlockReason(shouldBlock, {
          onNeedsApproval: async (approvalReason, approvalDetails) => {
            const isNewFile = approvalDetails?.type === "fileEdit" ? approvalDetails.isNewFile : true;
            const diffString = approvalDetails?.type === "fileEdit" ? approvalDetails.diffString : fileText;
            const blockReason = approvalDetails?.type === "fileEdit" ? approvalDetails.blockReason : undefined;
            const result = await this.pendingDecisionProvider.requestApproval({
              type: OperationType.Write,
              details: {
                path: resolvedPath,
                reason: approvalReason,
                isNewFile,
                diffString,
                before: beforeContent,
                after: fileText,
                blockReason
              },
              toolCallId: args.toolCallId
            });
            if (!result.approved) {
              return new write_exec_pb /* WriteResult */.v3({
                result: {
                  case: "rejected",
                  value: new write_exec_pb /* WriteRejected */.en({
                    path: resolvedPath,
                    reason: result.reason || ""
                  })
                }
              });
            }
            return null;
          },
          onUserRejected: reason => new write_exec_pb /* WriteResult */.v3({
            result: {
              case: "rejected",
              value: new write_exec_pb /* WriteRejected */.en({
                path: resolvedPath,
                reason: reason || ""
              })
            }
          }),
          onPermissionDenied: (errorMessage, metadata) => new write_exec_pb /* WriteResult */.v3({
            result: {
              case: "permissionDenied",
              value: new write_exec_pb /* WritePermissionDenied */.U7({
                path: resolvedPath,
                error: errorMessage,
                isReadonly: metadata?.isReadonly ?? false
              })
            }
          })
        });
        if (blockResult !== null) {
          return blockResult;
        }
      }
      // Ensure the directory exists
      const dir = (0, external_node_path_.dirname)(resolvedPath);
      try {
        await (0, promises_.mkdir)(dir, {
          recursive: true
        });
      } catch (error) {
        if (error.code === "EACCES") {
          return new write_exec_pb /* WriteResult */.v3({
            result: {
              case: "permissionDenied",
              value: new write_exec_pb /* WritePermissionDenied */.U7({
                path: resolvedPath,
                directory: dir,
                operation: "create_directory",
                error: "Permission denied"
              })
            }
          });
        }
        return new write_exec_pb /* WriteResult */.v3({
          result: {
            case: "error",
            value: new write_exec_pb /* WriteError */.QM({
              path: resolvedPath,
              error: error.message
            })
          }
        });
      }
      // Create the file with the specified content
      // If fileBytes is provided, write binary data directly without text processing
      let buffer;
      let lines;
      if (fileBytes !== undefined) {
        // Binary mode: write raw bytes directly
        buffer = fileBytes;
        lines = 0; // Line count not meaningful for binary data
      } else {
        // Text mode: apply line ending normalization
        const textResult = await getBufferForWrite(resolvedPath, fileText, this.workspacePath);
        buffer = textResult.buffer;
        lines = textResult.lines;
      }
      try {
        await (0, promises_.writeFile)(resolvedPath, buffer);
      } catch (error) {
        if (error.code === "EACCES") {
          return new write_exec_pb /* WriteResult */.v3({
            result: {
              case: "permissionDenied",
              value: new write_exec_pb /* WritePermissionDenied */.U7({
                path: resolvedPath,
                directory: "",
                operation: "create_file",
                error: "Permission denied"
              })
            }
          });
        }
        if (error.code === "ENOSPC") {
          return new write_exec_pb /* WriteResult */.v3({
            result: {
              case: "noSpace",
              value: new write_exec_pb /* WriteNoSpace */.bM({
                path: resolvedPath
              })
            }
          });
        }
        return new write_exec_pb /* WriteResult */.v3({
          result: {
            case: "error",
            value: new write_exec_pb /* WriteError */.QM({
              path: resolvedPath,
              error: error.message
            })
          }
        });
      }
      // Track the file creation or modification if we have a tracker
      // Skip tracking for binary files as change tracking is text-based
      if (this.fileChangeTracker && fileBytes === undefined) {
        const metadata = args.toolCallId ? {
          toolCallId: args.toolCallId
        } : undefined;
        this.fileChangeTracker.trackChange(resolvedPath, beforeContent, fileText, metadata);
      }
      const bytes = buffer.byteLength;
      // Read the file content after successful write if requested
      let fileContentAfterWrite;
      if (args.returnFileContentAfterWrite) {
        try {
          fileContentAfterWrite = await readText(resolvedPath);
        } catch {
          // If reading fails, we'll leave it undefined
        }
      }
      return new write_exec_pb /* WriteResult */.v3({
        result: {
          case: "success",
          value: new write_exec_pb /* WriteSuccess */.j6({
            path: resolvedPath,
            linesCreated: lines,
            fileSize: bytes,
            ...(fileContentAfterWrite !== undefined && {
              fileContentAfterWrite
            })
          })
        }
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      write_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=write.js.map
; // ../local-exec/dist/provider.js

class LocalResourceProvider extends agent_exec_dist /* RegistryResourceAccessor */.h {
  constructor(options) {
    super();
    this.pendingDecisionStore = options.pendingDecisionStore;
    this.fileChangeTracker = options.fileChangeTracker;
    this.ignoreService = options.ignoreService;
    this.grepProvider = options.grepProvider;
    this.permissionsService = options.permissionsService;
    this.workspacePath = options.workspacePath;
    this.diagnosticsProvider = options.diagnosticsProvider;
    this.mcpLease = options.mcpLease;
    this.cursorRulesService = options.cursorRulesService;
    this.cloudRulesService = options.cloudRulesService;
    this.repositoryProvider = options.repositoryProvider;
    this.projectDir = options.projectDir;
    this.shellManager = options.shellManager;
    this._sandboxPolicyResolver = options._sandboxPolicyResolver;
    this._defaultSandboxPolicy = options._defaultSandboxPolicy ?? {
      type: "insecure_none"
    };
    this.mcpFileOutputThresholdBytes = options.mcpFileOutputThresholdBytes;
    this.backgroundShellFactory = options.backgroundShellFactory;
    this.mcpElicitationFactory = options.mcpElicitationFactory;
    this.requestContextFileWatcher = options.requestContextFileWatcher;
    this.sharedRequestContextExecutor = options.sharedRequestContextExecutor;
    this.terminalExecutor = options.terminalExecutor;
    this.skillsService = options.skillsService;
    this.enableRecordScreen = options.enableRecordScreen ?? false;
    this.userTerminalHint = options.userTerminalHint;
    const ex = this.terminalExecutor ?? (0, shell_exec_dist /* createDefaultTerminalExecutor */.Fn)({
      env: {
        CURSOR_AGENT: "1"
      },
      userTerminalHint: this.userTerminalHint
    });
    // For shell, use the first workspace path
    const firstWorkspacePath = Array.isArray(this.workspacePath) ? this.workspacePath[0] : this.workspacePath;
    // For multi-workspace, don't pass workspace path to read/write/delete/ls/diagnostics
    const singleWorkspacePath = Array.isArray(this.workspacePath) && this.workspacePath.length > 1 ? undefined : firstWorkspacePath;
    // clone to avoid shared mutable state
    const baseShellCoreExecutor = new BaseShellCoreExecutor(ex, firstWorkspacePath ?? (0, external_node_os_.homedir)(), this.projectDir);
    const shellCoreExecutor = this.shellManager ? new ManagedShellCoreExecutor(baseShellCoreExecutor, this.shellManager) : baseShellCoreExecutor;
    this.register(agent_exec_dist /* shellExecutorResource */.qk, createCachedExecutor(new LocalShellExecutor(this.permissionsService, shellCoreExecutor, this.ignoreService, this.pendingDecisionStore)));
    this.register(agent_exec_dist /* writeExecutorResource */.Ln, createCachedExecutor(new LocalWriteExecutor(this.fileChangeTracker, this.permissionsService, this.pendingDecisionStore, singleWorkspacePath)));
    this.register(agent_exec_dist /* deleteExecutorResource */.Rp, createCachedExecutor(new LocalDeleteExecutor(this.pendingDecisionStore, this.fileChangeTracker, this.permissionsService, singleWorkspacePath)));
    this.register(agent_exec_dist /* fetchExecutorResource */.IG, createCachedExecutor(new LocalFetchExecutor()));
    this.register(agent_exec_dist /* grepExecutorResource */.u8, createCachedExecutor(new LocalGrepExecutor(this.ignoreService, this.grepProvider, this.workspacePath)));
    this.register(agent_exec_dist /* readExecutorResource */._A, createCachedExecutor(new LocalReadExecutor(this.permissionsService, singleWorkspacePath)));
    const lsExecutor = new LocalLsExecutor(this.permissionsService, this.ignoreService, this.grepProvider.rgPath, singleWorkspacePath);
    this.register(agent_exec_dist /* lsExecutorResource */.bL, createCachedExecutor(lsExecutor));
    this.register(agent_exec_dist /* diagnosticsExecutorResource */.w4, createCachedExecutor(new LocalDiagnosticsExecutor(singleWorkspacePath, this.diagnosticsProvider)));
    this.register(agent_exec_dist /* mcpExecutorResource */.Yi, createCachedExecutor(new LocalMcpToolExecutor(this.mcpLease, this.permissionsService, this.pendingDecisionStore, this.projectDir, this.mcpFileOutputThresholdBytes, this.mcpElicitationFactory)));
    this.register(agent_exec_dist /* listMcpResourcesExecutorResource */.rn, createCachedExecutor(new LocalListMcpResourcesExecutor(this.mcpLease)));
    this.register(agent_exec_dist /* readMcpResourceExecutorResource */.ml, createCachedExecutor(new LocalReadMcpResourceExecutor(this.mcpLease, singleWorkspacePath || this.projectDir, this.permissionsService)));
    this.register(agent_exec_dist /* requestContextExecutorResource */.MZ, createCachedExecutor(this.sharedRequestContextExecutor ?? new LocalRequestContextExecutor(this.cursorRulesService, this.cloudRulesService, this.repositoryProvider, lsExecutor, this.mcpLease, this.workspacePath, this.projectDir, this.requestContextFileWatcher, options.getSandboxEnabled, this.skillsService, this.userTerminalHint)));
    this.register(agent_exec_dist /* shellStreamExecutorResource */.wv, createCachedStreamExecutor(new LocalShellStreamExecutor(this.permissionsService, shellCoreExecutor, this.ignoreService)));
    this.backgroundShellExecutor = new LocalBackgroundShellExecutor(this.permissionsService, shellCoreExecutor, this.ignoreService, this.projectDir, this.backgroundShellFactory);
    this.register(agent_exec_dist /* backgroundShellExecutorResource */.Ok, createCachedExecutor(this.backgroundShellExecutor));
    // Register computer-use executor if provided
    if (options.computerUseExecutor) {
      this.computerUseExecutor = options.computerUseExecutor;
      this.register(agent_exec_dist /* computerUseExecutorResource */.iZ, createCachedExecutor(this.computerUseExecutor));
    }
    // Register recordScreen executor only if enabled (exec-daemon only)
    if (this.enableRecordScreen) {
      this.register(agent_exec_dist /* recordScreenExecutorResource */.pq, createCachedExecutor(new LocalRecordScreenExecutor()));
    }
  }
  /**
   * Dispose all resources including background shell instances
   * Note: If a computerUseExecutor was passed in, the caller is responsible for disposing it
   */
  dispose() {
    this.backgroundShellExecutor.dispose();
  }
}
//# sourceMappingURL=provider.js.map
; // ../local-exec/dist/services/cloud-rules-service.js
var cloud_rules_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var cloud_rules_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalCloudRulesService {
  constructor(ctx, rootDirectory, fileWatcher) {
    this.rootDirectory = rootDirectory;
    this.loadTraceId = undefined;
    this.cloudRule = this.load(ctx).catch(error => {
      (0, external_node_util_.debuglog)("Failed to load cloud rules:", error);
      return null;
    });
    if (fileWatcher) {
      const patterns = [".cursor/CLOUD.md"];
      this.unsubscribeWatcher = fileWatcher.subscribe(this.rootDirectory, patterns, changedPath => {
        const env_1 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const reloadCtx = (0, dist /* createContext */.q6)();
          const span = cloud_rules_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(reloadCtx.withName("LocalCloudRulesService.fileWatcher.subscribe")), false);
          this.reloadAtPath(span.ctx, changedPath);
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          cloud_rules_service_disposeResources(env_1);
        }
      });
    }
  }
  reload(ctx) {
    this.cloudRule = this.load(ctx).catch(error => {
      (0, external_node_util_.debuglog)("Failed to load cloud rules:", error);
      return null;
    });
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }
  reloadAtPath(ctx, _path) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cloud_rules_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalCloudRulesService.reloadAtPath")), false);
      this.cloudRule = this.load(span.ctx).catch(error => {
        (0, external_node_util_.debuglog)("Failed to load cloud rules at path:", error);
        return null;
      });
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      cloud_rules_service_disposeResources(env_2);
    }
  }
  onDidChangeRule(callback) {
    this.onChangeCallback = callback;
  }
  dispose() {
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
  }
  async getCloudRule(ctx) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cloud_rules_service_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalCloudRulesService.getCloudRule")), false);
      span.span.setAttribute("cacheTraceId", this.loadTraceId ?? "undefined");
      return await this.cloudRule;
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      cloud_rules_service_disposeResources(env_3);
    }
  }
  async load(ctx) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cloud_rules_service_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalCloudRulesService.load")), false);
      this.loadTraceId = span.span.spanContext().traceId;
      const workspaceRoot = (0, external_node_path_.resolve)(this.rootDirectory);
      const cloudRulesPath = (0, external_node_path_.join)(workspaceRoot, ".cursor", "CLOUD.md");
      try {
        const fileStats = await (0, promises_.stat)(cloudRulesPath);
        if (!fileStats.isFile()) {
          return null;
        }
      } catch {
        return null;
      }
      try {
        const content = await readText(cloudRulesPath);
        if (content.trim().length === 0) {
          return null;
        }
        const filename = (0, external_node_path_.basename)(cloudRulesPath);
        span.span.setAttribute("cloudRulesFilename", filename);
        return content;
      } catch (error) {
        (0, external_node_util_.debuglog)("Failed to read CLOUD.md:", error);
        return null;
      }
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      cloud_rules_service_disposeResources(env_4);
    }
  }
}
//# sourceMappingURL=cloud-rules-service.js.map
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/cursor_rules_pb.js
var cursor_rules_pb = __webpack_require__("../proto/dist/generated/agent/v1/cursor_rules_pb.js");
; // ../local-exec/dist/services/cursor-rules-service.js
var cursor_rules_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var cursor_rules_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class MergedCursorRulesService {
  constructor(cursorRulesServices) {
    this.cursorRulesServices = cursorRulesServices;
  }
  async getAllCursorRules(ctx) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("MergedCursorRulesService.getAllCursorRules")), false);
      // Call getAllCursorRules on all services in parallel
      const allRulesPromises = this.cursorRulesServices.map(service => service.getAllCursorRules(span.ctx).catch(err => {
        (0, external_node_util_.debuglog)("Failed to load cursor rules from service:", err);
        return [];
      }));
      const allRulesArrays = await Promise.all(allRulesPromises);
      // Flatten all rules into a single array
      const allRules = allRulesArrays.flat();
      // Dedupe by fullPath - first occurrence wins
      const seenPaths = new Set();
      const dedupedRules = [];
      for (const rule of allRules) {
        if (!seenPaths.has(rule.fullPath)) {
          seenPaths.add(rule.fullPath);
          dedupedRules.push(rule);
        }
      }
      return dedupedRules;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_1);
    }
  }
  reload(ctx) {
    for (const service of this.cursorRulesServices) {
      service.reload(ctx);
    }
  }
  onDidChangeRules(callback) {
    // Set up callback on all services and collect their dispose functions
    const disposeFunctions = [];
    for (const service of this.cursorRulesServices) {
      if (service.onDidChangeRules) {
        disposeFunctions.push(service.onDidChangeRules(callback));
      }
    }
    // Return a dispose function that calls all collected dispose functions
    return () => {
      for (const dispose of disposeFunctions) {
        dispose();
      }
    };
  }
  dispose() {
    for (const service of this.cursorRulesServices) {
      if (service.dispose) {
        service.dispose();
      }
    }
  }
}
class LocalCursorRulesService {
  constructor(ctx, rootDirectory, rgPath, loadNestedRules, getClaudeMdEnabled, fileWatcher) {
    this.rootDirectory = rootDirectory;
    this.rgPath = rgPath;
    this.loadNestedRules = loadNestedRules;
    this.getClaudeMdEnabled = getClaudeMdEnabled;
    this.loadTraceId = undefined;
    this.onChangeCallbacks = new Set();
    this._rules = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load cursor rules:", err);
      return [];
    });
    // If file watcher provided, subscribe to reload on file changes
    // NOTE: we don't need to watch for rules changes in subdirectories because we don't provide such rules in the
    // system prompt -- we tell the agent to load them as needed.
    // But also note that we won't be catching new rules files in subdirectories, so the agent might not see them.
    // TODO: add efficient file watching for rules in subdirectories.
    if (fileWatcher) {
      const patterns = [".cursor/rules/**/*.mdc", "AGENTS.md", "CLAUDE.md", "CLAUDE.local.md", ".cursorrules"];
      this.unsubscribeWatcher = fileWatcher.subscribe(this.rootDirectory, patterns, path => {
        const env_2 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const reloadCtx = (0, dist /* createContext */.q6)();
          const span = cursor_rules_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(reloadCtx.withName("LocalCursorRulesService.fileWatcher.subscribe")), false);
          this.reloadAtPath(span.ctx, path);
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          cursor_rules_service_disposeResources(env_2);
        }
      });
    }
  }
  /**
   * Reload rules (e.g., when settings change)
   */
  reload(ctx) {
    this._rules = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load cursor rules:", err);
      return [];
    });
    // Notify all callbacks that rules have changed
    for (const callback of this.onChangeCallbacks) {
      callback();
    }
  }
  reloadAtPath(ctx, path) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.reloadAtPath")), false);
      const previousRules = this._rules;
      this._rules = (async () => {
        const previousRulesAtOtherPaths = (await previousRules).filter(r => r.fullPath !== path);
        const rulesAtPath = (await this.readRulesAtPath(span.ctx, path)).map(r => this.toCursorRule(r));
        return [...previousRulesAtOtherPaths, ...rulesAtPath];
      })().catch(err => {
        (0, external_node_util_.debuglog)("Failed to load cursor rules at path:", err);
        return [];
      });
      // Notify all callbacks that rules have changed
      for (const callback of this.onChangeCallbacks) {
        callback();
      }
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_3);
    }
  }
  isRuleMarkdownFile(filename) {
    return filename === "CLAUDE.md" || filename === "CLAUDE.local.md" || filename === "AGENTS.md";
  }
  async readRulesAtPath(ctx, path) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.readRulesAtPath")), false);
      const filename = (0, external_node_path_.basename)(path);
      if (filename === ".cursorrules") {
        // .cursorrules is loaded from workspace root (git root)
        const cwd = (0, external_node_path_.resolve)(this.rootDirectory);
        const gitRoot = await findGitRoot(cwd);
        const workspaceRoot = gitRoot || cwd;
        const cursorRulesRule = await this.loadCursorRulesRule(span.ctx, workspaceRoot);
        return cursorRulesRule ? [cursorRulesRule] : [];
      } else if (filename.endsWith(".mdc")) {
        try {
          const content = await readText(path);
          const parsed = this.parseRuleFile(content);
          if (parsed) {
            return [{
              filename: (0, external_node_path_.basename)(path, ".mdc"),
              path: path,
              frontmatter: parsed.frontmatter,
              body: parsed.body
            }];
          }
        } catch {}
      } else if (this.isRuleMarkdownFile(filename)) {
        try {
          return await this.loadRulesFromMarkdownFile(span.ctx, (0, external_node_path_.dirname)(path), filename);
        } catch {}
      }
      return [];
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_4);
    }
  }
  onDidChangeRules(callback) {
    this.onChangeCallbacks.add(callback);
    return () => {
      this.onChangeCallbacks.delete(callback);
    };
  }
  dispose() {
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
  }
  async load(ctx) {
    const env_5 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.load")), false);
      this.loadTraceId = span.span.spanContext().traceId;
      const cwd = (0, external_node_path_.resolve)(this.rootDirectory);
      const gitRoot = await findGitRoot(cwd);
      const workspaceRoot = gitRoot || cwd;
      const cursorRulesRule = this.loadCursorRulesRule(span.ctx, workspaceRoot).then(r => r ? [r] : []);
      const hierarchical = this.loadRulesFromHierarchy(span.ctx, cwd);
      const fromSubdirectories = this.loadNestedRules && gitRoot ? this.loadRulesFromSubdirectories(span.ctx, cwd) : [];
      const markdownFilesFromSubdirectories = this.loadNestedRules && gitRoot ? this.loadMarkdownFilesFromSubdirectories(span.ctx, cwd) : [];
      const allRules = (await Promise.all([cursorRulesRule, hierarchical, fromSubdirectories, markdownFilesFromSubdirectories])).flat();
      const map = new Map();
      for (const r of allRules) {
        map.set(r.path, r);
      }
      return [...map.values()].map(pr => this.toCursorRule(pr));
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_5);
    }
  }
  async loadCursorRulesRule(ctx, workspaceRoot) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = cursor_rules_service_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadCursorrules")), false);
      try {
        const cursorRulesPath = (0, external_node_path_.join)(workspaceRoot, ".cursorrules");
        const st = await (0, promises_.stat)(cursorRulesPath);
        if (st.isFile()) {
          const content = await readText(cursorRulesPath);
          return {
            filename: ".cursorrules",
            path: cursorRulesPath,
            frontmatter: {
              alwaysApply: true
            },
            body: content
          };
        }
      } catch {}
      return null;
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_6);
    }
  }
  async getAllCursorRules(ctx) {
    const env_7 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_7, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.getAllCursorRules")), false);
      span.span.setAttribute("cacheTraceId", this.loadTraceId ?? "undefined");
      return await this._rules;
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_7);
    }
  }
  toCursorRule(rule) {
    let type; // oneof
    if (rule.frontmatter.alwaysApply === true) {
      type = {
        case: "global",
        value: new cursor_rules_pb /* CursorRuleTypeGlobal */.i9()
      };
    } else if (typeof rule.frontmatter.globs === "string" && rule.frontmatter.globs.trim().length > 0) {
      const globs = rule.frontmatter.globs.toString().split(",").map(g => g.trim()).filter(Boolean);
      type = {
        case: "fileGlobbed",
        value: new cursor_rules_pb /* CursorRuleTypeFileGlobs */.uT({
          globs
        })
      };
    } else if (typeof rule.frontmatter.description === "string" && rule.frontmatter.description.trim().length > 0) {
      type = {
        case: "agentFetched",
        value: new cursor_rules_pb /* CursorRuleTypeAgentFetched */.Xo({
          description: String(rule.frontmatter.description)
        })
      };
    } else {
      type = {
        case: "manuallyAttached",
        value: new cursor_rules_pb /* CursorRuleTypeManuallyAttached */._u()
      };
    }
    return new cursor_rules_pb /* CursorRule */.DX({
      fullPath: rule.path,
      content: rule.body,
      type: new cursor_rules_pb /* CursorRuleType */.f5({
        type
      })
    });
  }
  async loadRulesFromHierarchy(ctx, startPath) {
    const env_8 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_8, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromHierarchy")), false);
      const rules = [];
      let currentPath = startPath;
      // Load from .cursor/rules directory format and CLAUDE.md/AGENTS.md in hierarchy
      while (true) {
        // Check for .cursor/rules directory
        const rulesDir = (0, external_node_path_.join)(currentPath, ".cursor", "rules");
        if (await this.dirIsDirectory(span.ctx, rulesDir)) rules.push(...(await this.loadRulesFromDirectory(span.ctx, rulesDir, this.rgPath)));
        // Optionally check for CLAUDE.md and CLAUDE.local.md if enabled
        if (this.getClaudeMdEnabled()) {
          rules.push(...(await this.loadRulesFromMarkdownFile(span.ctx, currentPath, "CLAUDE.md")));
          rules.push(...(await this.loadRulesFromMarkdownFile(span.ctx, currentPath, "CLAUDE.local.md")));
        }
        // Check for AGENTS.md
        rules.push(...(await this.loadRulesFromMarkdownFile(span.ctx, currentPath, "AGENTS.md")));
        const parentPath = (0, external_node_path_.dirname)(currentPath);
        if (parentPath === currentPath) break;
        currentPath = parentPath;
      }
      span.span.setAttribute("rules", rules.length);
      return rules;
    } catch (e_8) {
      env_8.error = e_8;
      env_8.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_8);
    }
  }
  async loadRulesFromMarkdownFile(ctx, currentPath, filename) {
    const env_9 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_9, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromMarkdownFile")), false);
      span.span.setAttribute("filename", filename);
      try {
        const path = (0, external_node_path_.join)(currentPath, filename);
        const st = await (0, promises_.stat)(path);
        if (st.isFile()) {
          const content = await readText(path);
          return [{
            filename: (0, external_node_path_.basename)(path, ".md"),
            path: path,
            frontmatter: {
              alwaysApply: true
            },
            body: content
          }];
        }
      } catch {}
      return [];
    } catch (e_9) {
      env_9.error = e_9;
      env_9.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_9);
    }
  }
  async loadRulesFromSubdirectories(ctx, root) {
    const env_10 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_10, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromSubdirectories")), false);
      const acc = [];
      let fileCount = 0;
      try {
        for await (const relativePath of ripwalk({
          rgPath: this.rgPath,
          root,
          includeGlobs: ["*/**/.cursor/rules/**/*.mdc"],
          excludeGlobs: DEFAULT_GLOB_IGNORE_DIRS
        })) {
          fileCount++;
          try {
            const path = (0, external_node_path_.resolve)(root, relativePath);
            const content = await readText(path);
            const parsed = this.parseRuleFile(content);
            if (parsed) {
              acc.push({
                filename: (0, external_node_path_.basename)(path, ".mdc"),
                path,
                frontmatter: parsed.frontmatter,
                body: parsed.body
              });
            }
          } catch {}
        }
      } catch {}
      span.span.setAttribute("ruleFiles", fileCount);
      return acc;
    } catch (e_10) {
      env_10.error = e_10;
      env_10.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_10);
    }
  }
  async loadMarkdownFilesFromSubdirectories(ctx, root) {
    const env_11 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_11, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadMarkdownFilesFromSubdirectories")), false);
      const acc = [];
      let fileCount = 0;
      try {
        // Build glob patterns for markdown files (exclude root level)
        const patterns = ["*/**/AGENTS.md"];
        if (this.getClaudeMdEnabled()) {
          patterns.push("*/**/CLAUDE.md", "*/**/CLAUDE.local.md");
        }
        for await (const relativePath of ripwalk({
          rgPath: this.rgPath,
          root,
          includeGlobs: patterns,
          excludeGlobs: DEFAULT_GLOB_IGNORE_DIRS
        })) {
          fileCount++;
          try {
            const path = (0, external_node_path_.resolve)(root, relativePath);
            const filename = (0, external_node_path_.basename)(path);
            if (!this.isRuleMarkdownFile(filename)) {
              continue;
            }
            const dirPath = (0, external_node_path_.dirname)(path);
            const rules = await this.loadRulesFromMarkdownFile(span.ctx, dirPath, filename);
            acc.push(...rules);
          } catch {}
        }
      } catch {}
      span.span.setAttribute("markdownFiles", fileCount);
      return acc;
    } catch (e_11) {
      env_11.error = e_11;
      env_11.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_11);
    }
  }
  // dir is a .cursor/rules directory or a subdirectory of one
  async loadRulesFromDirectory(ctx, dir, rgPath) {
    const env_12 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_12, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromDirectory")), false);
      const rules = [];
      try {
        for await (const relativePath of ripwalk({
          rgPath,
          root: dir,
          includeGlobs: ["**/*.mdc"]
        })) {
          const fullPath = (0, external_node_path_.join)(dir, relativePath);
          rules.push(...(await this.readRulesAtPath(span.ctx, fullPath)));
        }
      } catch {}
      span.span.setAttribute("rules", rules.length);
      return rules;
    } catch (e_12) {
      env_12.error = e_12;
      env_12.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_12);
    }
  }
  async dirIsDirectory(ctx, path) {
    const env_13 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = cursor_rules_service_addDisposableResource(env_13, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.dirIsDirectory")), false);
      try {
        const st = await (0, promises_.stat)(path);
        return st.isDirectory();
      } catch {
        return false;
      }
    } catch (e_13) {
      env_13.error = e_13;
      env_13.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_13);
    }
  }
  parseRuleFile(content) {
    const parts = content.split("---").filter(Boolean);
    if (parts.length < 2) return null;
    const frontmatterText = parts[0].trim();
    const body = parts.slice(1).join("---").trim();
    const frontmatter = {};
    for (const rawLine of frontmatterText.split("\n")) {
      const line = rawLine.replace(/\r$/, "");
      const i = line.indexOf(":");
      if (i === -1) continue;
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      if (value === "true") frontmatter[key] = true;else if (value === "false") frontmatter[key] = false;else frontmatter[key] = value;
    }
    return {
      frontmatter,
      body
    };
  }
}
//# sourceMappingURL=cursor-rules-service.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/ignore@7.0.5/node_modules/ignore/index.js
var ignore = __webpack_require__("../../node_modules/.pnpm/ignore@7.0.5/node_modules/ignore/index.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/picomatch@4.0.2/node_modules/picomatch/index.js
var picomatch = __webpack_require__("../../node_modules/.pnpm/picomatch@4.0.2/node_modules/picomatch/index.js");
; // ../local-exec/dist/services/ignore-service.js

class LazyIgnoreService {
  constructor(rgPath, teamSettingsService, rootDirectories) {
    this.ignoreServicePromise = LocalIgnoreService.init(rootDirectories ?? [process.cwd()], rgPath, teamSettingsService);
  }
  isIgnoredByAny(filePath) {
    return this.ignoreServicePromise.then(x => x.isIgnoredByAny(filePath));
  }
  isGitIgnored(filePath) {
    return this.ignoreServicePromise.then(x => x.isGitIgnored(filePath));
  }
  isCursorIgnored(filePath) {
    return this.ignoreServicePromise.then(x => x.isCursorIgnored(filePath));
  }
  isRepoBlocked(filePath) {
    return this.ignoreServicePromise.then(x => x.isRepoBlocked(filePath));
  }
  listCursorIgnoreFilesByRoot(root) {
    return this.ignoreServicePromise.then(x => x.listCursorIgnoreFilesByRoot(root));
  }
  getCursorIgnoreMapping() {
    return this.ignoreServicePromise.then(x => x.getCursorIgnoreMapping());
  }
  getGitIgnoreMapping() {
    return this.ignoreServicePromise.then(x => x.getGitIgnoreMapping());
  }
}
// NB: Not exactly the best metric but it's a good approximation of
// how beefy their computer is - clamp between [1, NR_CPUS/2, 8]
const maxConcurrentSearches = Math.min(8, Math.max(1, Math.floor(external_node_os_.cpus().length / 2)));
class LocalIgnoreService {
  constructor(gitIgnoreMapping, cursorIgnoreMapping, teamSettingsService) {
    this.gitIgnoreMapping = gitIgnoreMapping;
    this.cursorIgnoreMapping = cursorIgnoreMapping;
    this.teamSettingsService = teamSettingsService;
    this.gitIgnoreCache = new utils_dist /* LRUCache */.qK({
      max: 2000
    });
    this.cursorIgnoreCache = new utils_dist /* LRUCache */.qK({
      max: 2000
    });
    this.gitRootCache = new utils_dist /* LRUCache */.qK({
      max: 1000
    });
    this.gitRemoteUrlCache = new utils_dist /* LRUCache */.qK({
      max: 200
    });
    this.hasGitDirCache = new utils_dist /* LRUCache */.qK({
      max: 1000
    });
    this.rootDirectory = process.cwd();
  }
  /**
   * Check if there are no workspace folders (indicated by empty ignore mappings).
   * When no workspace folders exist, the ignore mappings remain empty after initialization.
   */
  hasNoWorkspaceFolders() {
    return Object.keys(this.gitIgnoreMapping).length === 0 && Object.keys(this.cursorIgnoreMapping).length === 0;
  }
  static async init(rootDirectories, rgPath, teamSettingsService) {
    const gitIgnoreMapping = {};
    const cursorIgnoreMapping = {};
    // Only initialize if we're in a git repository (any parent directory has .git folder)
    const reposInGitRoots = await Promise.all(rootDirectories.map(root => findGitRoot(root))).then(roots => roots.filter(root => root !== null));
    if (reposInGitRoots.length > 0) {
      await Promise.all([teamSettingsService ? teamSettingsService.getTeamRepos() : Promise.resolve(undefined), LocalIgnoreService.initializeIgnoreMapping(reposInGitRoots, ".gitignore", gitIgnoreMapping, rgPath), LocalIgnoreService.initializeIgnoreMapping(reposInGitRoots, ".cursorignore", cursorIgnoreMapping, rgPath)]);
    }
    return new LocalIgnoreService(gitIgnoreMapping, cursorIgnoreMapping, teamSettingsService);
  }
  static async preloadHierarchy(startPath, ignoreFileName, mapping, processedDirs) {
    let currentPath = resolvePath(startPath);
    const rootPath = (0, external_node_path_.parse)(currentPath).root;
    // Walk up the directory tree from the workspace root
    while (currentPath !== rootPath) {
      // Skip if we've already processed this directory
      if (processedDirs?.has(currentPath)) {
        const parentPath = (0, external_node_path_.dirname)(currentPath);
        if (parentPath === currentPath) break; // Reached root
        currentPath = parentPath;
        continue;
      }
      if (mapping[currentPath] === undefined) {
        await LocalIgnoreService.handleHierarchyIgnore(currentPath, ignoreFileName, mapping);
      }
      // Mark as processed
      processedDirs?.add(currentPath);
      const parentPath = (0, external_node_path_.dirname)(currentPath);
      if (parentPath === currentPath) break; // Reached root
      currentPath = parentPath;
    }
  }
  static async handleHierarchyIgnore(dir, ignoreFileName, mapping) {
    const ignoreFilePath = (0, external_node_path_.join)(dir, ignoreFileName);
    try {
      await (0, promises_.access)(ignoreFilePath, promises_.constants.F_OK);
      const content = await readText(ignoreFilePath);
      const ignoreRules = LocalIgnoreService.parseIgnoreRules(content);
      mapping[dir] = ignore().add(ignoreRules);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, mark as checked so we don't check again
        mapping[dir] = {
          __noIgnore: true
        };
      } else {
        console.error(`Error reading ${ignoreFileName} file at ${ignoreFilePath}:`, error);
        mapping[dir] = {
          __noIgnore: true
        };
      }
    }
  }
  static async initializeIgnoreMapping(rootDirectories, ignoreFileName, mapping, rgPath) {
    try {
      // Dedupe root directories - remove any root that is inside another root
      const deduplicatedRoots = LocalIgnoreService.deduplicateRootDirectories(rootDirectories);
      // Find ignore files in all roots
      const ignoreFiles = await LocalIgnoreService.promiseQueue.enqueueList(deduplicatedRoots, root => LocalIgnoreService.findFilesWithRipgrep(root, ignoreFileName, rgPath));
      const allIgnoreFiles = Array.from(ignoreFiles.values()).flat();
      // Process all ignore files
      await Promise.all(allIgnoreFiles.map(async filePath => {
        try {
          const content = await readText(filePath);
          const ignoreRules = LocalIgnoreService.parseIgnoreRules(content);
          const ignorePath = (0, external_node_path_.dirname)(filePath);
          mapping[ignorePath] = ignore().add(ignoreRules);
        } catch (error) {
          console.error(`Error processing ${ignoreFileName} file at ${filePath}:`, error);
        }
      }));
      // Preload hierarchy for each root, avoiding duplicate work
      const processedDirs = new Set();
      for (const root of deduplicatedRoots) {
        await LocalIgnoreService.preloadHierarchy(root, ignoreFileName, mapping, processedDirs);
      }
    } catch (error) {
      console.error(`Error initializing ignore mapping for ${ignoreFileName}:`, error);
    }
  }
  static async findFilesWithRipgrep(rootDirectory, fileName, rgPath) {
    const files = [];
    for await (const path of ripwalk({
      rgPath,
      root: rootDirectory,
      includeGlobs: [`**/${fileName}`],
      excludeGlobs: DEFAULT_GLOB_IGNORE_DIRS
    })) {
      files.push((0, external_node_path_.join)(rootDirectory, path));
    }
    return files;
  }
  async handleManualLookupWhenNoWorkspaceDirs(absolutePath, ignoreFileName) {
    let cur = (0, external_node_path_.dirname)(absolutePath);
    while (true) {
      const ignoreFilePath = (0, external_node_path_.join)(cur, ignoreFileName);
      let ignoreRules;
      try {
        const content = await readText(ignoreFilePath);
        ignoreRules = ignore().add(LocalIgnoreService.parseIgnoreRules(content));
      } catch {}
      if (ignoreRules) {
        const testResult = ignoreRules.test((0, external_node_path_.relative)(cur, absolutePath));
        if (testResult.ignored) return true;
        if (testResult.unignored) return false;
      }
      const parentPath = (0, external_node_path_.dirname)(cur);
      if (parentPath === cur) break; // Reached root
      cur = parentPath;
    }
    return false;
  }
  async isIgnoredByAny(filePath) {
    const [gitIgnored, cursorIgnored, repoBlocked] = await Promise.all([this.isGitIgnored(filePath), this.isCursorIgnored(filePath), this.isRepoBlocked(filePath)]);
    return gitIgnored || cursorIgnored || repoBlocked;
  }
  async isGitIgnored(filePath) {
    const absolutePath = resolvePath(filePath);
    if (this.hasNoWorkspaceFolders()) {
      return this.handleManualLookupWhenNoWorkspaceDirs(absolutePath, ".gitignore");
    }
    // Check cache first
    const cached = this.gitIgnoreCache.get(absolutePath);
    if (cached !== undefined) {
      return cached;
    }
    // Check if we need to populate hierarchy for this path
    await this.populateHierarchyIfNeeded(absolutePath, ".gitignore", this.gitIgnoreMapping);
    const result = this.checkIgnored(absolutePath, this.gitIgnoreMapping);
    this.gitIgnoreCache.set(absolutePath, result);
    return result;
  }
  async isCursorIgnored(filePath) {
    const absolutePath = resolvePath(filePath);
    if (this.hasNoWorkspaceFolders()) {
      return this.handleManualLookupWhenNoWorkspaceDirs(absolutePath, ".cursorignore");
    }
    // Check cache first
    const cached = this.cursorIgnoreCache.get(absolutePath);
    if (cached !== undefined) {
      return cached;
    }
    // Check if we need to populate hierarchy for this path
    await this.populateHierarchyIfNeeded(absolutePath, ".cursorignore", this.cursorIgnoreMapping);
    const result = this.checkIgnored(absolutePath, this.cursorIgnoreMapping);
    this.cursorIgnoreCache.set(absolutePath, result);
    return result;
  }
  async populateHierarchyIfNeeded(filePath, ignoreFileName, mapping) {
    let currentPath = (0, external_node_path_.dirname)(resolvePath(filePath));
    const toAdd = [];
    const rootPath = (0, external_node_path_.parse)(currentPath).root;
    // Walk up the directory tree
    while (currentPath !== rootPath) {
      // Skip if we're still within the workspace
      if (currentPath.startsWith(this.rootDirectory)) {
        currentPath = (0, external_node_path_.dirname)(currentPath);
        continue;
      }
      // If already processed, we can stop
      if (mapping[currentPath] !== undefined) {
        break;
      }
      toAdd.push(currentPath);
      const parentPath = (0, external_node_path_.dirname)(currentPath);
      if (parentPath === currentPath) break; // Reached root
      currentPath = parentPath;
    }
    // Process any new directories we found
    if (toAdd.length > 0) {
      await LocalIgnoreService.promiseQueue.enqueueList(toAdd, dir => LocalIgnoreService.handleHierarchyIgnore(dir, ignoreFileName, mapping));
      // Clear the appropriate cache
      if (ignoreFileName === ".gitignore") {
        this.gitIgnoreCache.clear();
      } else {
        this.cursorIgnoreCache.clear();
      }
    }
  }
  checkIgnored(absolutePath, mapping) {
    // Check each ignore mapping to see if the file should be ignored
    for (const [ignorePath, ignoreInstance] of Object.entries(mapping)) {
      if (!absolutePath.startsWith(ignorePath)) {
        continue;
      }
      if (!this.isIgnoreInstance(ignoreInstance)) {
        continue;
      }
      const relativePath = (0, external_node_path_.relative)(ignorePath, absolutePath);
      // Skip if relativePath is empty (checking the directory that contains the ignore file itself)
      if (relativePath === "") {
        continue;
      }
      // The `ignore` library's test method tells us if the path is ignored
      const testResult = ignoreInstance.test(relativePath);
      if (testResult.ignored && !testResult.unignored) {
        return true;
      }
    }
    return false;
  }
  async listCursorIgnoreFilesByRoot(root) {
    const ignoreFiles = [];
    for (const [base, instance] of Object.entries(this.cursorIgnoreMapping)) {
      if (!this.isIgnoreInstance(instance)) {
        continue;
      }
      if (!base.startsWith(root)) {
        continue;
      }
      ignoreFiles.push((0, external_node_path_.join)(base, ".cursorignore"));
    }
    return ignoreFiles;
  }
  async getCursorIgnoreMapping() {
    // The mapping is already fully populated during initialization
    // since ignoreServicePromise waits for complete init() completion
    // Return a copy of the mapping to prevent external modifications
    return {
      ...this.cursorIgnoreMapping
    };
  }
  async getGitIgnoreMapping() {
    return {
      ...this.gitIgnoreMapping
    };
  }
  isIgnoreInstance(instance) {
    return "ignores" in instance && typeof instance.ignores === "function";
  }
  static deduplicateRootDirectories(roots) {
    // Resolve all paths to absolute paths
    const resolvedRoots = roots.map(root => resolvePath(root));
    // Sort by length (shorter paths first) to efficiently check containment
    const sortedRoots = [...resolvedRoots].sort((a, b) => a.length - b.length);
    const deduplicated = [];
    for (const root of sortedRoots) {
      // Check if this root is inside any already-added root
      const isContained = deduplicated.some(existing => root.startsWith(`${existing}/`) || root.startsWith(`${existing}\\`));
      if (!isContained) {
        deduplicated.push(root);
      }
    }
    return deduplicated;
  }
  static parseIgnoreRules(raw) {
    // Strip Windows line endings, leading whitespace and comment lines (starting with '#').
    return raw.split("\n").map(line => line.replace(/\r$/, "").trimStart()).filter(line => line !== "" && !line.startsWith("#"));
  }
  // Method to clear caches when files change
  clearCaches() {
    this.gitIgnoreCache.clear();
    this.cursorIgnoreCache.clear();
    this.gitRootCache.clear();
    this.gitRemoteUrlCache.clear();
    this.hasGitDirCache.clear();
  }
  async findGitRootsForFile(filePath) {
    const absolutePath = resolvePath(filePath);
    const directoryPath = (0, external_node_path_.dirname)(absolutePath);
    const cached = this.gitRootCache.get(directoryPath);
    if (cached !== undefined) {
      return cached;
    }
    const gitRoots = [];
    const pathsToCheck = [];
    const uncachedPaths = [];
    let currentPath = directoryPath;
    const rootPath = (0, external_node_path_.parse)(currentPath).root;
    while (currentPath !== rootPath) {
      pathsToCheck.push(currentPath);
      if (this.hasGitDirCache.get(currentPath) === undefined) {
        uncachedPaths.push(currentPath);
      }
      const parentPath = (0, external_node_path_.dirname)(currentPath);
      if (parentPath === currentPath) break;
      currentPath = parentPath;
    }
    if (uncachedPaths.length > 0) {
      const checkPromises = uncachedPaths.map(path => (0, promises_.access)((0, external_node_path_.join)(path, ".git"), promises_.constants.F_OK).then(() => [path, true]).catch(() => [path, false]));
      const results = await Promise.all(checkPromises);
      for (const [path, hasGit] of results) {
        this.hasGitDirCache.set(path, hasGit);
      }
    }
    for (const path of pathsToCheck) {
      const hasGit = this.hasGitDirCache.get(path);
      if (hasGit === true) {
        gitRoots.push(path);
      }
    }
    this.gitRootCache.set(directoryPath, gitRoots);
    return gitRoots;
  }
  async isRepoBlocked(filePath) {
    const absolutePath = resolvePath(filePath);
    const gitRoots = await this.findGitRootsForFile(filePath);
    if (gitRoots.length === 0) {
      return false;
    }
    // Cached for 5 mins
    const teamReposResponse = await this.teamSettingsService?.getTeamRepos();
    if (!teamReposResponse || !teamReposResponse.repos) {
      return false;
    }
    for (const gitRoot of gitRoots) {
      let repoUrl;
      if (this.gitRemoteUrlCache.has(gitRoot)) {
        repoUrl = this.gitRemoteUrlCache.get(gitRoot);
      } else {
        repoUrl = await getGitRemoteUrl(gitRoot);
        // Only cache if we got a URL (don't cache undefined)
        if (repoUrl !== undefined) {
          this.gitRemoteUrlCache.set(gitRoot, repoUrl);
        }
      }
      if (repoUrl === undefined) {
        continue;
      }
      // Find ALL matching repos (exact + glob patterns)
      const matchingBlockedRepos = teamReposResponse.repos.filter(repo => this.doesRepoUrlMatch(repo.url, repoUrl));
      if (matchingBlockedRepos.length === 0) {
        continue;
      }
      const relativePath = (0, external_node_path_.relative)(gitRoot, absolutePath);
      // Merge ALL patterns from matching repos and check if file matches any
      for (const repo of matchingBlockedRepos) {
        for (const pattern of repo.patterns || []) {
          if (this.matchGlob(pattern.pattern, relativePath)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  doesRepoUrlMatch(repoUrl1, repoUrl2) {
    // Check if repoUrl1 is a glob pattern (contains *)
    const isGlobPattern = repoUrl1.includes("*");
    if (isGlobPattern) {
      // Special case: single "*" matches all repos
      if (repoUrl1.trim() === "*") {
        return true;
      }
      // Use glob matching for pattern-based URLs
      const normalizedPattern = toHostPath(repoUrl1).toLowerCase();
      const normalizedUrl = toHostPath(repoUrl2).toLowerCase();
      return this.matchGlob(normalizedPattern, normalizedUrl);
    } else {
      // Use exact match for non-glob URLs
      return toHostPath(repoUrl1).toLowerCase() === toHostPath(repoUrl2).toLowerCase();
    }
  }
  matchGlob(pattern, value) {
    try {
      const isMatch = picomatch(pattern.trim());
      return isMatch(value);
    } catch {
      // Fallback to strict equality on invalid patterns
      return pattern.trim() === value;
    }
  }
}
LocalIgnoreService.promiseQueue = new utils_dist /* PromiseQueue */.TJ({
  max: maxConcurrentSearches
});
//# sourceMappingURL=ignore-service.js.map
; // ../../node_modules/.pnpm/diff@8.0.2/node_modules/diff/libesm/diff/base.js
class Diff {
  diff(oldStr, newStr,
  // Type below is not accurate/complete - see above for full possibilities - but it compiles
  options = {}) {
    let callback;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    } else if ('callback' in options) {
      callback = options.callback;
    }
    // Allow subclasses to massage the input prior to running
    const oldString = this.castInput(oldStr, options);
    const newString = this.castInput(newStr, options);
    const oldTokens = this.removeEmpty(this.tokenize(oldString, options));
    const newTokens = this.removeEmpty(this.tokenize(newString, options));
    return this.diffWithOptionsObj(oldTokens, newTokens, options, callback);
  }
  diffWithOptionsObj(oldTokens, newTokens, options, callback) {
    var _a;
    const done = value => {
      value = this.postProcess(value, options);
      if (callback) {
        setTimeout(function () {
          callback(value);
        }, 0);
        return undefined;
      } else {
        return value;
      }
    };
    const newLen = newTokens.length,
      oldLen = oldTokens.length;
    let editLength = 1;
    let maxEditLength = newLen + oldLen;
    if (options.maxEditLength != null) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    const maxExecutionTime = (_a = options.timeout) !== null && _a !== void 0 ? _a : Infinity;
    const abortAfterTimestamp = Date.now() + maxExecutionTime;
    const bestPath = [{
      oldPos: -1,
      lastComponent: undefined
    }];
    // Seed editLength = 0, i.e. the content starts with the same values
    let newPos = this.extractCommon(bestPath[0], newTokens, oldTokens, 0, options);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      // Identity per the equality and tokenizer
      return done(this.buildValues(bestPath[0].lastComponent, newTokens, oldTokens));
    }
    // Once we hit the right edge of the edit graph on some diagonal k, we can
    // definitely reach the end of the edit graph in no more than k edits, so
    // there's no point in considering any moves to diagonal k+1 any more (from
    // which we're guaranteed to need at least k+1 more edits).
    // Similarly, once we've reached the bottom of the edit graph, there's no
    // point considering moves to lower diagonals.
    // We record this fact by setting minDiagonalToConsider and
    // maxDiagonalToConsider to some finite value once we've hit the edge of
    // the edit graph.
    // This optimization is not faithful to the original algorithm presented in
    // Myers's paper, which instead pointlessly extends D-paths off the end of
    // the edit graph - see page 7 of Myers's paper which notes this point
    // explicitly and illustrates it with a diagram. This has major performance
    // implications for some common scenarios. For instance, to compute a diff
    // where the new text simply appends d characters on the end of the
    // original text of length n, the true Myers algorithm will take O(n+d^2)
    // time while this optimization needs only O(n+d) time.
    let minDiagonalToConsider = -Infinity,
      maxDiagonalToConsider = Infinity;
    // Main worker method. checks all permutations of a given edit length for acceptance.
    const execEditLength = () => {
      for (let diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        let basePath;
        const removePath = bestPath[diagonalPath - 1],
          addPath = bestPath[diagonalPath + 1];
        if (removePath) {
          // No one else is going to attempt to use this value, clear it
          // @ts-expect-error - perf optimisation. This type-violating value will never be read.
          bestPath[diagonalPath - 1] = undefined;
        }
        let canAdd = false;
        if (addPath) {
          // what newPos will be after we do an insertion:
          const addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }
        const canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          // @ts-expect-error - perf optimisation. This type-violating value will never be read.
          bestPath[diagonalPath] = undefined;
          continue;
        }
        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the old string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
          basePath = this.addToPath(addPath, true, false, 0, options);
        } else {
          basePath = this.addToPath(removePath, false, true, 1, options);
        }
        newPos = this.extractCommon(basePath, newTokens, oldTokens, diagonalPath, options);
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          // If we have hit the end of both strings, then we are done
          return done(this.buildValues(basePath.lastComponent, newTokens, oldTokens)) || true;
        } else {
          bestPath[diagonalPath] = basePath;
          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }
          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }
      editLength++;
    };
    // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced, or until the edit length exceeds options.maxEditLength (if given),
    // in which case it will return undefined.
    if (callback) {
      (function exec() {
        setTimeout(function () {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback(undefined);
          }
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        const ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  }
  addToPath(path, added, removed, oldPosInc, options) {
    const last = path.lastComponent;
    if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: last.count + 1,
          added: added,
          removed: removed,
          previousComponent: last.previousComponent
        }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: 1,
          added: added,
          removed: removed,
          previousComponent: last
        }
      };
    }
  }
  extractCommon(basePath, newTokens, oldTokens, diagonalPath, options) {
    const newLen = newTokens.length,
      oldLen = oldTokens.length;
    let oldPos = basePath.oldPos,
      newPos = oldPos - diagonalPath,
      commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldTokens[oldPos + 1], newTokens[newPos + 1], options)) {
      newPos++;
      oldPos++;
      commonCount++;
      if (options.oneChangePerToken) {
        basePath.lastComponent = {
          count: 1,
          previousComponent: basePath.lastComponent,
          added: false,
          removed: false
        };
      }
    }
    if (commonCount && !options.oneChangePerToken) {
      basePath.lastComponent = {
        count: commonCount,
        previousComponent: basePath.lastComponent,
        added: false,
        removed: false
      };
    }
    basePath.oldPos = oldPos;
    return newPos;
  }
  equals(left, right, options) {
    if (options.comparator) {
      return options.comparator(left, right);
    } else {
      return left === right || !!options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  }
  removeEmpty(array) {
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  castInput(value, options) {
    return value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenize(value, options) {
    return Array.from(value);
  }
  join(chars) {
    // Assumes ValueT is string, which is the case for most subclasses.
    // When it's false, e.g. in diffArrays, this method needs to be overridden (e.g. with a no-op)
    // Yes, the casts are verbose and ugly, because this pattern - of having the base class SORT OF
    // assume tokens and values are strings, but not completely - is weird and janky.
    return chars.join('');
  }
  postProcess(changeObjects,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options) {
    return changeObjects;
  }
  get useLongestToken() {
    return false;
  }
  buildValues(lastComponent, newTokens, oldTokens) {
    // First we convert our linked list of components in reverse order to an
    // array in the right order:
    const components = [];
    let nextComponent;
    while (lastComponent) {
      components.push(lastComponent);
      nextComponent = lastComponent.previousComponent;
      delete lastComponent.previousComponent;
      lastComponent = nextComponent;
    }
    components.reverse();
    const componentLen = components.length;
    let componentPos = 0,
      newPos = 0,
      oldPos = 0;
    for (; componentPos < componentLen; componentPos++) {
      const component = components[componentPos];
      if (!component.removed) {
        if (!component.added && this.useLongestToken) {
          let value = newTokens.slice(newPos, newPos + component.count);
          value = value.map(function (value, i) {
            const oldValue = oldTokens[oldPos + i];
            return oldValue.length > value.length ? oldValue : value;
          });
          component.value = this.join(value);
        } else {
          component.value = this.join(newTokens.slice(newPos, newPos + component.count));
        }
        newPos += component.count;
        // Common case
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = this.join(oldTokens.slice(oldPos, oldPos + component.count));
        oldPos += component.count;
      }
    }
    return components;
  }
}
; // ../../node_modules/.pnpm/diff@8.0.2/node_modules/diff/libesm/diff/line.js

class LineDiff extends Diff {
  constructor() {
    super(...arguments);
    this.tokenize = tokenize;
  }
  equals(left, right, options) {
    // If we're ignoring whitespace, we need to normalise lines by stripping
    // whitespace before checking equality. (This has an annoying interaction
    // with newlineIsToken that requires special handling: if newlines get their
    // own token, then we DON'T want to trim the *newline* tokens down to empty
    // strings, since this would cause us to treat whitespace-only line content
    // as equal to a separator between lines, which would be weird and
    // inconsistent with the documented behavior of the options.)
    if (options.ignoreWhitespace) {
      if (!options.newlineIsToken || !left.includes('\n')) {
        left = left.trim();
      }
      if (!options.newlineIsToken || !right.includes('\n')) {
        right = right.trim();
      }
    } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
      if (left.endsWith('\n')) {
        left = left.slice(0, -1);
      }
      if (right.endsWith('\n')) {
        right = right.slice(0, -1);
      }
    }
    return super.equals(left, right, options);
  }
}
const lineDiff = new LineDiff();
function diffLines(oldStr, newStr, options) {
  return lineDiff.diff(oldStr, newStr, options);
}
function diffTrimmedLines(oldStr, newStr, options) {
  options = generateOptions(options, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}
// Exported standalone so it can be used from jsonDiff too.
function tokenize(value, options) {
  if (options.stripTrailingCr) {
    // remove one \r before \n to match GNU diff's --strip-trailing-cr behavior
    value = value.replace(/\r\n/g, '\n');
  }
  const retLines = [],
    linesAndNewlines = value.split(/(\n|\r\n)/);
  // Ignore the final empty token that occurs if the string ends with a new line
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }
  // Merge the content and line separators into single tokens
  for (let i = 0; i < linesAndNewlines.length; i++) {
    const line = linesAndNewlines[i];
    if (i % 2 && !options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      retLines.push(line);
    }
  }
  return retLines;
}
; // ../../node_modules/.pnpm/diff@8.0.2/node_modules/diff/libesm/patch/create.js

function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  let optionsObj;
  if (!options) {
    optionsObj = {};
  } else if (typeof options === 'function') {
    optionsObj = {
      callback: options
    };
  } else {
    optionsObj = options;
  }
  if (typeof optionsObj.context === 'undefined') {
    optionsObj.context = 4;
  }
  // We copy this into its own variable to placate TypeScript, which thinks
  // optionsObj.context might be undefined in the callbacks below.
  const context = optionsObj.context;
  // @ts-expect-error (runtime check for something that is correctly a static type error)
  if (optionsObj.newlineIsToken) {
    throw new Error('newlineIsToken may not be used with patch-generation functions, only with diffing functions');
  }
  if (!optionsObj.callback) {
    return diffLinesResultToPatch(diffLines(oldStr, newStr, optionsObj));
  } else {
    const {
      callback
    } = optionsObj;
    diffLines(oldStr, newStr, Object.assign(Object.assign({}, optionsObj), {
      callback: diff => {
        const patch = diffLinesResultToPatch(diff);
        // TypeScript is unhappy without the cast because it does not understand that `patch` may
        // be undefined here only if `callback` is StructuredPatchCallbackAbortable:
        callback(patch);
      }
    }));
  }
  function diffLinesResultToPatch(diff) {
    // STEP 1: Build up the patch with no "\ No newline at end of file" lines and with the arrays
    //         of lines containing trailing newline characters. We'll tidy up later...
    if (!diff) {
      return;
    }
    diff.push({
      value: '',
      lines: []
    }); // Append an empty value to make cleanup easier
    function contextLines(lines) {
      return lines.map(function (entry) {
        return ' ' + entry;
      });
    }
    const hunks = [];
    let oldRangeStart = 0,
      newRangeStart = 0,
      curRange = [],
      oldLine = 1,
      newLine = 1;
    for (let i = 0; i < diff.length; i++) {
      const current = diff[i],
        lines = current.lines || create_splitLines(current.value);
      current.lines = lines;
      if (current.added || current.removed) {
        // If we have previous context, start with that
        if (!oldRangeStart) {
          const prev = diff[i - 1];
          oldRangeStart = oldLine;
          newRangeStart = newLine;
          if (prev) {
            curRange = context > 0 ? contextLines(prev.lines.slice(-context)) : [];
            oldRangeStart -= curRange.length;
            newRangeStart -= curRange.length;
          }
        }
        // Output our changes
        for (const line of lines) {
          curRange.push((current.added ? '+' : '-') + line);
        }
        // Track the updated file position
        if (current.added) {
          newLine += lines.length;
        } else {
          oldLine += lines.length;
        }
      } else {
        // Identical context lines. Track line changes
        if (oldRangeStart) {
          // Close out any changes that have been output (or join overlapping)
          if (lines.length <= context * 2 && i < diff.length - 2) {
            // Overlapping
            for (const line of contextLines(lines)) {
              curRange.push(line);
            }
          } else {
            // end the range and output
            const contextSize = Math.min(lines.length, context);
            for (const line of contextLines(lines.slice(0, contextSize))) {
              curRange.push(line);
            }
            const hunk = {
              oldStart: oldRangeStart,
              oldLines: oldLine - oldRangeStart + contextSize,
              newStart: newRangeStart,
              newLines: newLine - newRangeStart + contextSize,
              lines: curRange
            };
            hunks.push(hunk);
            oldRangeStart = 0;
            newRangeStart = 0;
            curRange = [];
          }
        }
        oldLine += lines.length;
        newLine += lines.length;
      }
    }
    // Step 2: eliminate the trailing `\n` from each line of each hunk, and, where needed, add
    //         "\ No newline at end of file".
    for (const hunk of hunks) {
      for (let i = 0; i < hunk.lines.length; i++) {
        if (hunk.lines[i].endsWith('\n')) {
          hunk.lines[i] = hunk.lines[i].slice(0, -1);
        } else {
          hunk.lines.splice(i + 1, 0, '\\ No newline at end of file');
          i++; // Skip the line we just added, then continue iterating
        }
      }
    }
    return {
      oldFileName: oldFileName,
      newFileName: newFileName,
      oldHeader: oldHeader,
      newHeader: newHeader,
      hunks: hunks
    };
  }
}
/**
 * creates a unified diff patch.
 * @param patch either a single structured patch object (as returned by `structuredPatch`) or an array of them (as returned by `parsePatch`)
 */
function formatPatch(patch) {
  if (Array.isArray(patch)) {
    return patch.map(formatPatch).join('\n');
  }
  const ret = [];
  if (patch.oldFileName == patch.newFileName) {
    ret.push('Index: ' + patch.oldFileName);
  }
  ret.push('===================================================================');
  ret.push('--- ' + patch.oldFileName + (typeof patch.oldHeader === 'undefined' ? '' : '\t' + patch.oldHeader));
  ret.push('+++ ' + patch.newFileName + (typeof patch.newHeader === 'undefined' ? '' : '\t' + patch.newHeader));
  for (let i = 0; i < patch.hunks.length; i++) {
    const hunk = patch.hunks[i];
    // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    for (const line of hunk.lines) {
      ret.push(line);
    }
  }
  return ret.join('\n') + '\n';
}
function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (typeof options === 'function') {
    options = {
      callback: options
    };
  }
  if (!(options === null || options === void 0 ? void 0 : options.callback)) {
    const patchObj = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
    if (!patchObj) {
      return;
    }
    return formatPatch(patchObj);
  } else {
    const {
      callback
    } = options;
    structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, Object.assign(Object.assign({}, options), {
      callback: patchObj => {
        if (!patchObj) {
          callback(undefined);
        } else {
          callback(formatPatch(patchObj));
        }
      }
    }));
  }
}
function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}
/**
 * Split `text` into an array of lines, including the trailing newline character (where present)
 */
function create_splitLines(text) {
  const hasTrailingNl = text.endsWith('\n');
  const result = text.split('\n').map(line => line + '\n');
  if (hasTrailingNl) {
    result.pop();
  } else {
    result.push(result.pop().slice(0, -1));
  }
  return result;
}
; // ../local-exec/dist/services/permissions-service.js
var permissions_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var permissions_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const PROTECTED_CONFIG_FILES = ["cli.json", "cli-config.json", "mcp.json", "mcp-approvals.json", ".workspace-trusted", ".cursorignore" // This is needed because you can negate other cursorignores in a cursorignore
];
/**
 * Checks if policy1 is stricter than or equal to policy2.
 * Returns true if policy1 can be automatically approved given policy2 as the baseline.
 * This means policy1 must not grant any permissions that policy2 doesn't grant.
 */
function isPolicyStricterOrEqual(policy1, policy2) {
  // If policy2 is insecure_none (no restrictions), any policy is stricter or equal
  if (policy2.type === "insecure_none") {
    return true;
  }
  // If policy1 is insecure_none but policy2 is not, policy1 is looser
  if (policy1.type === "insecure_none") {
    return false;
  }
  // At this point both policies are either workspace_readonly or workspace_readwrite
  // Check network access: policy1 must not have network if policy2 doesn't
  if (policy1.network_access && !policy2.network_access) {
    return false;
  }
  // Check git writes: if policy2 blocks git writes, policy1 must also block them
  // (or be even more restrictive, e.g., readonly)
  const policy2BlocksGitWrites = policy2.type === "workspace_readwrite" && policy2.block_git_writes === true;
  const policy1BlocksGitWrites = policy1.type === "workspace_readonly" || policy1.type === "workspace_readwrite" && policy1.block_git_writes === true;
  if (policy2BlocksGitWrites && !policy1BlocksGitWrites) {
    return false;
  }
  // Check read/write permissions: readonly is stricter than readwrite
  if (policy1.type === "workspace_readonly" && policy2.type === "workspace_readwrite") {
    return true;
  }
  // If both are readonly or both are readwrite, they're equal in this dimension
  if (policy1.type === policy2.type) {
    return true;
  }
  // policy1 is readwrite but policy2 is readonly - policy1 is looser
  return false;
}
/**
 * Helper to wrap a command and track its approval state.
 */
class ApprovableCommand {
  constructor(command, requestedPolicy, preapprovedPolicy) {
    this.command = command;
    this.requestedPolicy = requestedPolicy;
    // Command is preapproved if preapprovedPolicy is provided and
    // the requested policy is stricter or equal to the preapproved policy
    const preapproved = preapprovedPolicy !== undefined && isPolicyStricterOrEqual(requestedPolicy, preapprovedPolicy);
    this.state = preapproved ? "runnable" : "approvable";
  }
  approveWithPolicy(policy) {
    if (this.state === "approvable" && isPolicyStricterOrEqual(this.requestedPolicy, policy)) {
      this.state = "runnable";
    }
  }
  deny() {
    this.state = "denied";
  }
  isRunnable() {
    return this.state === "runnable";
  }
}
class InteractivePermissionsService {
  constructor(ignoreService, pendingDecisionStore, permissionsProvider, teamSettingsService, rootDirectory) {
    this.ignoreService = ignoreService;
    this.pendingDecisionStore = pendingDecisionStore;
    this.permissionsProvider = permissionsProvider;
    this.teamSettingsService = teamSettingsService;
    this.rootDirectories = Array.isArray(rootDirectory) ? rootDirectory : [rootDirectory ?? process.cwd()];
  }
  /**
   * Check if a file read should be blocked.
   * Blocks if cursor ignored or explicitly denied by permissions.
   * @returns false if allowed, BlockReason if blocked
   */
  async shouldBlockRead(filePath) {
    const absolutePath = resolvePath(filePath);
    // Check repo blocklist first
    if (await this.ignoreService.isRepoBlocked(absolutePath)) {
      return {
        type: "adminBlock",
        source: "Team repo blocklist"
      };
    }
    // Permissions explicit deny for reads
    if (await this.isPathExplicitlyDenied("Read", absolutePath)) {
      return {
        type: "permissionsConfig"
      };
    }
    // Check if cursor ignored — resolve real path first to follow symlinks
    const realAbsolutePathForIgnore = await resolveRealPath(absolutePath);
    if (await this.ignoreService.isCursorIgnored(realAbsolutePathForIgnore)) {
      return {
        type: "cursorIgnore"
      };
    }
    // Permissions explicit allow for reads => allow outright
    // this really doesn't matter since we allow reads for out of workspace and dot files
    if (await this.isPathExplicitlyAllowed("Read", absolutePath)) {
      return false;
    }
    // Allow reads for out of workspace and dot files
    return false;
  }
  /**
   * Check if a file write should be blocked.
   * Auto-blocks cursor ignored files.
   * For other cases (out of workspace, dot files), prompts the user unless explicitly allowed by permissions.
   * Explicit deny in permissions blocks immediately.
   * Respects auto-run mode to skip approvals when enabled.
   * @returns false if allowed, BlockReason if blocked
   */
  async shouldBlockWrite(parentCtx, filePath, newContents) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = permissions_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("InteractivePermissionsService.shouldBlockWrite")), false);
      const ctx = span.ctx;
      const absolutePath = resolvePath(filePath);
      // Check repo blocklist first
      if (await this.ignoreService.isRepoBlocked(absolutePath)) {
        return {
          type: "adminBlock",
          source: "Team repo blocklist"
        };
      }
      // Permissions explicit deny for writes
      if (await this.isPathExplicitlyDenied("Write", absolutePath)) {
        return {
          type: "permissionsConfig"
        };
      }
      // Check if cursor ignored - auto block
      if (await this.ignoreService.isCursorIgnored(absolutePath)) {
        return {
          type: "cursorIgnore"
        };
      }
      // Explicit allow for writes — skip prompts
      if (await this.isPathExplicitlyAllowed("Write", absolutePath)) {
        return false;
      }
      const perms = await this.getPermissions();
      if (perms.userConfiguredPolicy.type === "workspace_readonly") {
        return {
          type: "permissionsConfig",
          isReadonly: true
        };
      }
      const isAutoRun = perms.approvalMode === "unrestricted";
      if (isAutoRun) {
        return false;
      }
      const getIsNewFileAndDiffString = async () => {
        let isNewFile = false;
        let originalContents = "";
        try {
          originalContents = await readText(absolutePath);
          isNewFile = false;
        } catch {
          isNewFile = true;
        }
        let diffString = "";
        if (isNewFile) {
          diffString = newContents;
        } else {
          const ensureNL = s => s.endsWith("\n") ? s : `${s}\n`;
          const {
            hunks
          } = structuredPatch("a", "b", ensureNL(originalContents), ensureNL(newContents), "", "", {
            context: 2
          });
          diffString = hunks.map(h => h.lines
          // add a little padding to the lines so that the diff is easier to read
          .map(line => line.length > 0 ? `${line[0]} ${line.slice(1)}` : line).join("\n")).join("\n...\n");
        }
        return {
          isNewFile,
          diffString
        };
      };
      // Resolve real paths following symlinks to check workspace boundaries
      // This ensures symlinks pointing outside the workspace are properly detected
      const realAbsolutePath = await resolveRealPath(absolutePath);
      // Check if out of workspace by checking against all workspace paths
      let isInWorkspace = false;
      let matchedRootDirectory;
      for (const rootDir of this.rootDirectories) {
        const realRootDirectory = await resolveRealPath(rootDir);
        if (realAbsolutePath.startsWith(realRootDirectory)) {
          isInWorkspace = true;
          matchedRootDirectory = rootDir;
          break;
        }
      }
      if (!isInWorkspace) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: "Out of workspace",
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "outOfWorkspace"
          }
        };
      }
      // Normalize path for case-insensitive comparison
      // Some FS are case insensitive, do this for safety.
      const relativePath = (0, external_node_path_.relative)(matchedRootDirectory, absolutePath);
      let pathComponents = relativePath.split(external_node_path_.sep);
      pathComponents = pathComponents.map(c => false ? 0 : c);
      // Check if any path segment contains ~ (DOS short paths) on Windows
      // DOS short paths look like PROGRA~1 instead of Program Files
      if (false)
        // removed by dead control flow
        {}
      const normalizedComponents = pathComponents.map(component => component.toLowerCase());
      // Get last path segment (filename)
      const lastPathSegment = normalizedComponents[normalizedComponents.length - 1] ?? "";
      // Match VSCode's isRestrictedFile checks (ensure we don't miss any):
      // 1. Block ALL files in .vscode/ directory (always, not conditional)
      const isInVscodeDir = normalizedComponents.some(component => component === ".vscode");
      if (isInVscodeDir) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // 2. Block ALL files in .git/ directory (always, not conditional)
      const isInGitDir = normalizedComponents.some(component => component === ".git");
      if (isInGitDir) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // 3. Block ALL files in .cursor/ directory (always, not conditional)
      // EXCEPT .cursor/rules/*.md files
      const isInCursorDir = normalizedComponents.some(component => component === ".cursor");
      if (isInCursorDir) {
        // Check if path is in .cursor/rules/ and ends with .md
        const cursorIndex = normalizedComponents.indexOf(".cursor");
        const isCursorRulesMd = cursorIndex !== -1 && cursorIndex + 1 < normalizedComponents.length && normalizedComponents[cursorIndex + 1] === "rules" && lastPathSegment.endsWith(".md");
        if (!isCursorRulesMd) {
          const {
            isNewFile,
            diffString
          } = await getIsNewFileAndDiffString();
          return {
            type: "needsApproval",
            approvalReason: `Protected config file: ${lastPathSegment}`,
            approvalDetails: {
              type: "fileEdit",
              isNewFile,
              diffString,
              blockReason: "protectedConfig"
            }
          };
        }
      }
      // 4. Block .code-workspace files anywhere
      if (lastPathSegment.endsWith(".code-workspace")) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // Check .cursor file protection (additional check beyond VSCode)
      const cursorFileBlockReason = await this.checkCursorFileProtection(pathComponents);
      if (cursorFileBlockReason) {
        return cursorFileBlockReason;
      }
      // Check protected config files (case-insensitive comparison)
      // This includes .cursorignore (VSCode check) and additional files (more strict)
      if (PROTECTED_CONFIG_FILES.some(protectedFile => protectedFile.toLowerCase() === lastPathSegment)) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // Check if dot file
      const isDotFile = pathComponents.some(component => component.startsWith(".") && component.toLowerCase() !== ".cursor" && component.toLowerCase() !== ".vscode" && component.length > 1);
      if (isDotFile) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: "Dot file",
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "dotFile"
          }
        };
      }
      // Allow all other writes
      return false;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      permissions_service_disposeResources(env_1);
    }
  }
  /**
   * Check if a shell command should be blocked.
   *
   * This is based on a somewhat complicated dance of sandbox policies, allowlists and denylists.
   *
   * We have several allowlists that can be applied.
   * User scoped:
   * - Shell allowlist: Approves commands up to RunLevel.Unsandboxed (effectively unconditionally).
   * - User denylist: Denies a command.
   * - Baseline user sandboxing config: Not really an allowlist but sets the level at which the user is comfortable running commands without approval.
   *
   * Team scoped:
   * - Team allowlist: Approves commands
   * - Team blocklist: Denies commands
   * - Team delete file protection: Denies specifically rm commands.
   *
   * Approval modes:
   * - allowlist: Follow regular sandboxing path with user configured policy
   * - unrestricted: No sandboxing, always run (unless blocked) - applies to all operations
   * - unrestricted-shell: No sandboxing for shell commands only, always run (unless blocked) - applies only to shell commands
   *
   * Since models can issue composite commands, we need to consider each subcommand separately.
   * Commands start life as potentially preapproved based on whether the requested policy is stricter than the user's config.
   * They are then passed through the above allow and deny lists.
   *
   * If any command is hard denied, we deny the entire batch.
   * If all of them are runnable, we approve the batch without user interaction.
   *
   * If none of the above are true, some commands must be approvable so we prompt the user for approval.
   * The form of approval requested is based on the requested policy and approval mode.
   * Regardless of what commands are already runnable they're going to get run together with the requested policy.
   */
  async shouldBlockShellCommand(ctx, command, options, requestedPolicy) {
    const perms = await this.getPermissions();
    const approvalMode = perms.approvalMode;
    const userConfiguredPolicy = perms.userConfiguredPolicy;
    // Extract command information
    const executableCommands = options.parsingResult.executableCommands;
    const hasRedirects = options.parsingResult.hasRedirects;
    const parsingFailed = options.parsingResult.parsingFailed;
    // If no policy was requested, use insecure_none (no sandboxing)
    if (!requestedPolicy) {
      requestedPolicy = {
        type: "insecure_none"
      };
    }
    // Step 1: Get our current preapproved policy
    // If we're in allowlist mode and the requested policy is insecure_none,
    // don't pre-approve based on user config - require explicit allowlist
    const preapprovedPolicy = requestedPolicy.type === "insecure_none" && approvalMode === "allowlist" ? undefined // Don't pre-approve anything - require explicit allowlist
    : userConfiguredPolicy;
    // Step 2: Create a set of commands that are potentially preapproved based on our sandboxing level.
    const commands = executableCommands.map(cmd => new ApprovableCommand(cmd, requestedPolicy, preapprovedPolicy));
    // Step 3: Check our hard deny list.
    const hasHardDeny = await this.hasHardDeny(ctx, commands);
    if (hasHardDeny) {
      return {
        kind: "block",
        reason: {
          type: "permissionsConfig"
        }
      };
    }
    // --- denies past this point can be manually approved but not allowlisted ---
    // Step 4: Apply all of our allowlists.
    const autoRunControls = await this.teamSettingsService.getAutoRunControls();
    const unsandboxedPolicy = {
      type: "insecure_none"
    };
    for (const cmd of commands) {
      if (await this.isInShellAllowlist(cmd)) {
        cmd.approveWithPolicy(unsandboxedPolicy);
      }
      if (autoRunControls && this.isInTeamAllowlist(autoRunControls, cmd)) {
        cmd.approveWithPolicy(unsandboxedPolicy);
      }
    }
    // Step 5: Apply all of our denylists and potentially delete file protection.
    for (const cmd of commands) {
      if (autoRunControls && this.isInTeamBlocklist(autoRunControls, cmd)) {
        cmd.deny();
      }
    }
    const deleteProtectionEnabled = await this.teamSettingsService.getDeleteFileProtection();
    if (deleteProtectionEnabled) {
      for (const cmd of commands) {
        if (cmd.command.name === "rm") {
          cmd.deny();
        }
      }
    }
    // Step 6: Check readonly mode - only block if not all commands are approved
    // Readonly mode still respects allowlists, so if all commands are runnable, allow them
    if (userConfiguredPolicy.type === "workspace_readonly" && approvalMode !== "unrestricted" && approvalMode !== "unrestricted-shell") {
      const allRunnable = commands.every(cmd => cmd.isRunnable());
      if (!allRunnable) {
        return {
          kind: "block",
          reason: {
            type: "permissionsConfig",
            isReadonly: true
          }
        };
      }
    }
    // Step 7: Handle different approval modes
    if (approvalMode === "unrestricted" || approvalMode === "unrestricted-shell") {
      // Unrestricted/unrestricted-shell mode: Run without sandboxing unless blocked
      const allRunnable = commands.every(cmd => cmd.isRunnable());
      if (allRunnable) {
        return {
          kind: "allow",
          policy: {
            type: "insecure_none"
          }
        };
      }
      // If some commands are denied, we need approval
    } else if (approvalMode === "allowlist") {
      // Allowlist mode: Follow regular sandboxing path
      const allRunnable = commands.every(cmd => cmd.isRunnable());
      if (allRunnable) {
        return {
          kind: "allow",
          policy: userConfiguredPolicy
        };
      }
    }
    // Step 8: Issue the appropriate kind of approval.
    // We can only allowlist if team settings permit it and we're in allowlist mode.
    let canAllowlist = !hasRedirects && !parsingFailed && approvalMode === "allowlist";
    const approvalReasons = [];
    const unapprovedCommands = commands.filter(cmd => cmd.state === "approvable");
    if (unapprovedCommands.length > 0) {
      approvalReasons.push(`Not in allowlist: ${unapprovedCommands.map(cmd => cmd.command.fullText).join(", ")}`);
    }
    const deniedCommands = commands.filter(cmd => cmd.state === "denied");
    if (deniedCommands.length > 0) {
      approvalReasons.push(`In team blocklist: ${deniedCommands.map(cmd => cmd.command.fullText).join(", ")}`);
      canAllowlist = false;
    }
    if (autoRunControls?.enabled) {
      const notInTeamAllowlist = commands.filter(cmd => !this.isInTeamAllowlist(autoRunControls, cmd));
      if (notInTeamAllowlist.length > 0) {
        approvalReasons.push(`Not in team allowlist: ${notInTeamAllowlist.map(cmd => cmd.command.fullText).join(", ")}`);
        canAllowlist = false;
      }
    }
    const reason = approvalReasons.join(" • ");
    const allowlistCandidates = [];
    if (canAllowlist) {
      allowlistCandidates.push(...this.generateAllowlistPatterns(unapprovedCommands.map(cmd => cmd.command)));
    }
    const isSandboxAvailable = requestedPolicy.type !== "insecure_none" && userConfiguredPolicy.type !== "insecure_none";
    const isSandboxEnabled = requestedPolicy.type !== "insecure_none";
    const approval = {
      type: OperationType.Shell,
      toolCallId: options.toolCallId,
      details: {
        command,
        workingDirectory: options.workingDirectory,
        timeout: options.timeout,
        reason,
        isSandboxAvailable: approvalMode === "allowlist" ? isSandboxAvailable : false,
        isSandboxEnabled: approvalMode === "allowlist" ? isSandboxEnabled : false,
        canAllowlist,
        notAllowedCommands: allowlistCandidates
      }
    };
    const sandboxResult = await this.pendingDecisionStore.requestApproval(approval);
    if (!sandboxResult.approved) {
      return {
        kind: "block",
        reason: {
          type: "userRejected",
          reason: sandboxResult.reason
        }
      };
    } else {
      // In unrestricted/unrestricted-shell mode, run without sandboxing
      // In allowlist mode, use the requested policy
      const policyToUse = approvalMode === "unrestricted" || approvalMode === "unrestricted-shell" ? {
        type: "insecure_none"
      } : requestedPolicy;
      return {
        kind: "allow",
        policy: policyToUse
      };
    }
  }
  async isInShellAllowlist(command) {
    const perms = await this.getPermissions();
    return perms.allow.some(entry => this.isShellEntry(entry) && this.matchesShell(entry, command.command.fullText));
  }
  isInTeamBlocklist(autoRunControls, command) {
    return autoRunControls.blocked.some(blockedCmd => this.matchesAutoRunCommand(command.command.fullText, blockedCmd));
  }
  isInTeamAllowlist(autoRunControls, command) {
    return autoRunControls.allowed.some(allowedCmd => this.matchesAutoRunCommand(command.command.fullText, allowedCmd));
  }
  async getPermissions() {
    return await this.permissionsProvider.getPermissions();
  }
  async hasHardDeny(ctx, commands) {
    const perms = await this.getPermissions();
    return commands.some(cmd => perms.deny.some(entry => this.isShellEntry(entry) && this.matchesShell(entry, cmd.command.fullText)));
  }
  isShellEntry(entry) {
    return /^\s*(Shell|Bash)\s*\(/.test(entry);
  }
  isPathEntry(kind, entry) {
    const re = new RegExp(`^\\s*${kind}\\s*\\(`);
    return re.test(entry);
  }
  matchesShell(entry, cmd) {
    const m = entry.match(/^\s*(Shell|Bash)\s*\((.*)\)\s*$/);
    if (!m) return false;
    const pattern = m[2]?.trim() ?? "";
    const command = cmd.trim();
    const base = this.extractBaseCommand(command);
    // Support syntax like "curl:*" or "npm run test:*" => base:args
    const colonIdx = pattern.indexOf(":");
    if (colonIdx !== -1) {
      const cmdPat = pattern.slice(0, colonIdx).trim();
      const argsPat = pattern.slice(colonIdx + 1).trim();
      const argsText = command.includes(" ") ? command.slice(command.indexOf(" ") + 1).trim() : "";
      const baseOk = this.matchGlob(cmdPat, base) || this.matchGlob(cmdPat, command);
      const argsOk = this.matchGlob(argsPat, argsText);
      if (baseOk && argsOk) return true;
      // fall through to other matching modes if not matched
    }
    // Glob match against full command first, then prefix, then base command
    if (this.matchGlob(pattern, command)) return true;
    if (command.startsWith(`${pattern} `)) return true;
    if (this.matchGlob(pattern, base)) return true;
    if (base === pattern) return true;
    return false;
  }
  /**
   * Check if a file path is a cursor file and should be protected based on team settings.
   * @param pathComponents The path components relative to root directory
   * @returns BlockReason if blocked, null if not blocked
   */
  async checkCursorFileProtection(pathComponents) {
    const dotCursorProtection = await this.teamSettingsService.getDotCursorProtection();
    const isCursorFile = pathComponents.some(component => component.toLowerCase() === ".cursor" || component.toLowerCase() === ".vscode");
    if (isCursorFile && dotCursorProtection) {
      return {
        type: "permissionsConfig"
      };
    }
    return null;
  }
  /**
   * Extract the base command from a command string (the first word)
   */
  extractBaseCommand(command) {
    const trimmed = command.trim();
    const spaceIndex = trimmed.indexOf(" ");
    return spaceIndex === -1 ? trimmed : trimmed.substring(0, spaceIndex);
  }
  /**
   * Generate allowlist patterns for commands
   * Matches the processCandidatesForAllowlist logic from VSCode
   */
  generateAllowlistPatterns(commands) {
    // Composite shell commands that should include their first argument
    const compositeShellCommands = ["git", "npm", "yarn", "pnpm", "docker", "pip", "systemctl", "uv", "cargo", "bun", "bash", "npx"];
    const result = [];
    for (const cmd of commands) {
      // For composite commands, show both the command and the first argument
      // For all other commands, show only the command
      if (compositeShellCommands.includes(cmd.name) && cmd.args.length > 0 && cmd.args[0].type === "word") {
        result.push(`${cmd.name} ${cmd.args[0].value}`);
      } else {
        result.push(cmd.name);
      }
    }
    // Deduplicate the result array
    const deduplicatedResult = [...new Set(result)];
    return deduplicatedResult;
  }
  matchesPathEntry(kind, entry, absPath) {
    const re = new RegExp(`^\\s*${kind}\\s*\\((.*)\\)\\s*$`);
    const m = entry.match(re);
    if (!m) return false;
    const rawPattern = (m[1] ?? "").trim();
    const expandedPattern = this.expandTilde(rawPattern);
    return this.matchGlob(expandedPattern, absPath);
  }
  async isPathExplicitlyDenied(kind, absPath) {
    const perms = await this.getPermissions();
    return perms.deny.some(e => this.isPathEntry(kind, e) && this.matchesPathEntry(kind, e, absPath));
  }
  async isPathExplicitlyAllowed(kind, absPath) {
    const perms = await this.getPermissions();
    return perms.allow.some(e => this.isPathEntry(kind, e) && this.matchesPathEntry(kind, e, absPath));
  }
  expandTilde(p) {
    if (p === "~") return (0, external_node_os_.homedir)();
    if (p.startsWith("~/")) return (0, external_node_os_.homedir)() + p.slice(1);
    return p;
  }
  escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  matchGlob(pattern, value) {
    const escaped = this.escapeRegExp(pattern.trim());
    const reSrc = `^${escaped.replace(/\\\*/g, ".*")}$`;
    try {
      const re = new RegExp(reSrc);
      return re.test(value);
    } catch {
      // Fallback to strict equality on invalid patterns
      return pattern.trim() === value;
    }
  }
  async addToAllowList(_ctx, kind, value) {
    const entry = `${kind}(${value})`;
    await this.permissionsProvider.updatePermissions(perms => {
      const allow = perms.allow.includes(entry) ? perms.allow : [...perms.allow, entry];
      return {
        ...perms,
        allow
      };
    });
  }
  async addToDenyList(_ctx, kind, value) {
    const entry = `${kind}(${value})`;
    await this.permissionsProvider.updatePermissions(perms => {
      const deny = perms.deny.includes(entry) ? perms.deny : [...perms.deny, entry];
      return {
        ...perms,
        deny
      };
    });
  }
  /**
   * Check if MCP tool execution should be blocked.
   * Always asks for permission unless in auto-run mode (and auto-run is team-allowed).
   * @returns false if allowed, BlockReason if blocked
   */
  async shouldBlockMcp(ctx, args) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = permissions_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("InteractivePermissionsService.shouldBlockMcp")), false);
      // Parse tool name to extract provider identifier
      const {
        name,
        toolName,
        providerIdentifier,
        args: argsMap
      } = args;
      const perms = await this.getPermissions();
      // Check explicit deny list first
      if (await this.isMcpExplicitlyDenied(ctx, providerIdentifier, toolName)) {
        return {
          type: "permissionsConfig"
        };
      }
      // Check if explicitly allowed
      if (await this.isMcpExplicitlyAllowed(ctx, providerIdentifier, toolName)) {
        return false;
      }
      // Check readonly mode - only block if not explicitly allowed
      // Readonly mode still respects allowlists, so if explicitly allowed, allow it
      if (perms.userConfiguredPolicy.type === "workspace_readonly" && perms.approvalMode !== "unrestricted") {
        return {
          type: "permissionsConfig",
          isReadonly: true
        };
      }
      const isAutoRun = perms.approvalMode === "unrestricted";
      if (isAutoRun) {
        if (await this.teamSettingsService.getShouldBlockMcp()) {
          // If admin has disabled MCP in auto-run, fall through to approval
        } else {
          return false;
        }
      }
      return {
        type: "needsApproval",
        approvalReason: `MCP tool: ${toolName}`,
        approvalDetails: {
          type: "mcp",
          name,
          toolName,
          providerIdentifier,
          args: argsMap
        }
      };
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      permissions_service_disposeResources(env_2);
    }
  }
  /**
   * Matches a command against an autorun pattern using the same logic as VSCode.
   * The pattern matches if it appears at the beginning of the command followed by space or end of string.
   * This is intentionally simpler than matchesShellEntry to provide predictable behavior for team admins.
   */
  matchesAutoRunCommand(command, patternToMatch) {
    // Sanitize the command pattern by escaping regex special characters
    const escapedPattern = patternToMatch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Create a regex that matches the pattern only at the beginning of the string (^)
    // and only if followed by whitespace (\s) or end of string ($)
    return new RegExp(`^${escapedPattern}(\\s|$)`).test(command.trim());
  }
  /**
   * Check if an MCP entry matches a pattern.
   * Pattern format: [server]:[tool]
   * Supports wildcards: *:[tool], [server]:*, *:*
   */
  matchesMcpEntry(entry, providerIdentifier, toolName) {
    const m = entry.match(/^\s*Mcp\s*\((.*)\)\s*$/);
    if (!m) return false;
    const pattern = m[1]?.trim() ?? "";
    const colonIdx = pattern.indexOf(":");
    if (colonIdx === -1) {
      // No colon, invalid pattern
      return false;
    }
    const serverPattern = pattern.slice(0, colonIdx).trim();
    const toolPattern = pattern.slice(colonIdx + 1).trim();
    // Check server match
    const serverMatches = serverPattern === "*" || this.matchGlob(serverPattern, providerIdentifier);
    // Check tool match
    const toolMatches = toolPattern === "*" || this.matchGlob(toolPattern, toolName);
    return serverMatches && toolMatches;
  }
  async isMcpExplicitlyDenied(ctx, providerIdentifier, toolName) {
    const perms = await this.getPermissions();
    return perms.deny.some(e => this.matchesMcpEntry(e, providerIdentifier, toolName));
  }
  async isMcpExplicitlyAllowed(ctx, providerIdentifier, toolName) {
    const perms = await this.getPermissions();
    return perms.allow.some(e => this.matchesMcpEntry(e, providerIdentifier, toolName));
  }
}
//# sourceMappingURL=permissions-service.js.map
; // ../local-exec/dist/services/server-config-service.js
class StaticServerConfigService {
  constructor(config) {
    this.config = config;
  }
  fetchServerConfig() {
    return Promise.resolve(this.config);
  }
}
class ConnectServerConfigService {
  constructor(client) {
    this.client = client;
    this.serverConfigPromise = this.client.getServerConfig({});
  }
  fetchServerConfig() {
    return this.serverConfigPromise;
  }
}
//# sourceMappingURL=server-config-service.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/gray-matter@4.0.3/node_modules/gray-matter/index.js
var gray_matter = __webpack_require__("../../node_modules/.pnpm/gray-matter@4.0.3/node_modules/gray-matter/index.js");
; // ../local-exec/dist/services/skills-service.js
var skills_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var skills_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalSkillsService {
  constructor(ctx, rootDirectory, fileWatcher) {
    this.rootDirectory = rootDirectory;
    this.loadTraceId = undefined;
    this.onChangeCallbacks = new Set();
    this.loadSkills = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load skills:", err);
      return [];
    });
    // If file watcher provided, subscribe to reload on file changes
    if (fileWatcher && this.rootDirectory) {
      const patterns = [".cursor/skills/**/SKILL.md", ".cursor/skills/*/SKILL.md"];
      this.unsubscribeWatcher = fileWatcher.subscribe(this.rootDirectory, patterns, path => {
        const env_1 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const reloadCtx = (0, dist /* createContext */.q6)();
          const span = skills_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(reloadCtx.withName("LocalSkillsService.fileWatcher.subscribe")), false);
          this.reloadAtPath(span.ctx, path);
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          skills_service_disposeResources(env_1);
        }
      });
    }
  }
  /**
   * Reload skills (e.g., when settings change)
   */
  reload(ctx) {
    this.loadSkills = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load skills:", err);
      return [];
    });
    // Notify all callbacks that skills have changed
    for (const callback of this.onChangeCallbacks) {
      callback();
    }
  }
  reloadAtPath(ctx, path) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.reloadAtPath")), false);
      const previousSkills = this.loadSkills;
      this.loadSkills = (async () => {
        // Extract the skill directory from the path
        const skillDirMatch = path.match(/\.cursor\/skills\/([^/]+)\/SKILL\.md$/);
        if (!skillDirMatch) {
          // If path doesn't match expected pattern, just reload all
          return this.load(span.ctx);
        }
        const skillId = skillDirMatch[1];
        const previousSkillsArray = await previousSkills;
        const otherSkills = previousSkillsArray.filter(s => !s.folderPath.endsWith(`/skills/${skillId}`));
        if (!this.rootDirectory) {
          return otherSkills;
        }
        // Reload just this skill
        const skillDir = (0, external_node_path_.join)(this.rootDirectory, ".cursor", "skills", skillId);
        const parseResult = await this.parseSkillDirectory(span.ctx, skillDir, skillId);
        if (parseResult) {
          // Only include the skill if it's enabled
          return [...otherSkills, this.toSkillDescriptor(parseResult)];
        } else {
          // If parsing failed, return just the other skills
          return otherSkills;
        }
      })().catch(err => {
        (0, external_node_util_.debuglog)("Failed to load skills at path:", err);
        return [];
      });
      // Notify all callbacks that skills have changed
      for (const callback of this.onChangeCallbacks) {
        callback();
      }
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      skills_service_disposeResources(env_2);
    }
  }
  onDidChangeSkills(callback) {
    this.onChangeCallbacks.add(callback);
    return () => {
      this.onChangeCallbacks.delete(callback);
    };
  }
  dispose() {
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
  }
  async getSkills(ctx) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.getSkills")), false);
      span.span.setAttribute("cacheTraceId", this.loadTraceId ?? "undefined");
      return await this.loadSkills;
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      skills_service_disposeResources(env_3);
    }
  }
  async load(ctx) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.load")), false);
      this.loadTraceId = span.span.spanContext().traceId;
      if (!this.rootDirectory) {
        return [];
      }
      const skillsDir = (0, external_node_path_.join)(this.rootDirectory, ".cursor", "skills");
      // Read all subdirectories in the skills folder
      const skills = [];
      try {
        const dirContents = await (0, promises_.readdir)(skillsDir, {
          withFileTypes: true
        });
        const directories = dirContents.filter(dirent => dirent.isDirectory());
        const parseResults = await Promise.all(directories.map(async dirent => {
          const skillDir = (0, external_node_path_.join)(skillsDir, dirent.name);
          const parseResult = await this.parseSkillDirectory(span.ctx, skillDir, dirent.name);
          return {
            dirent,
            parseResult
          };
        }));
        for (const {
          parseResult
        } of parseResults) {
          if (parseResult) {
            skills.push(parseResult);
          }
        }
      } catch (err) {
        console.error("Failed to read skills directory:", err);
      }
      span.span.setAttribute("skills.total", skills.length);
      // Filter to only return enabled skills
      const enabledSkills = skills.filter(skill => skill.enabled);
      span.span.setAttribute("skills.enabled", enabledSkills.length);
      return enabledSkills.map(skill => this.toSkillDescriptor(skill));
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      skills_service_disposeResources(env_4);
    }
  }
  async parseSkillDirectory(ctx, skillDir, skillId) {
    const env_5 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.parseSkillDirectory")), false);
      try {
        const skillFilePath = (0, external_node_path_.join)(skillDir, "SKILL.md");
        // Parse the SKILL.md file
        return await this.parseSkillFile(span.ctx, skillFilePath, skillId);
      } catch (err) {
        (0, external_node_util_.debuglog)(`Failed to parse skill directory ${skillDir}: ${err}`);
        return undefined;
      }
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      skills_service_disposeResources(env_5);
    }
  }
  async parseSkillFile(ctx, skillFilePath, skillId) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = skills_service_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.parseSkillFile")), false);
      try {
        // Read file content
        const content = await readText(skillFilePath);
        // Parse frontmatter using gray-matter
        const parsed = gray_matter(content);
        // Check if frontmatter exists
        if (!parsed.data || Object.keys(parsed.data).length === 0) {
          (0, external_node_util_.debuglog)(`Invalid SKILL.md format: missing YAML frontmatter in ${skillFilePath}`);
          return undefined;
        }
        const yamlData = parsed.data;
        // Check for required fields
        if (!yamlData.description) {
          (0, external_node_util_.debuglog)(`Missing required "description" field in YAML frontmatter in ${skillFilePath}`);
          return undefined;
        }
        // Format skill name from ID if not provided
        const skillName = yamlData.title || yamlData.name;
        // Check if skill is enabled (default to true if not specified)
        const enabled = yamlData.enabled !== false;
        // Create skill object
        const skill = {
          id: skillId,
          name: skillName,
          description: String(yamlData.description),
          filePath: skillFilePath,
          dirPath: (0, external_node_path_.dirname)(skillFilePath),
          // Parent directory
          enabled: enabled
        };
        return skill;
      } catch (error) {
        (0, external_node_util_.debuglog)(`Failed to parse skill file ${skillFilePath}: ${error}`);
        return undefined;
      }
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      skills_service_disposeResources(env_6);
    }
  }
  toSkillDescriptor(skill) {
    return new request_context_exec_pb /* SkillDescriptor */.ng({
      name: skill.name,
      description: skill.description,
      folderPath: skill.dirPath
    });
  }
}
//# sourceMappingURL=skills-service.js.map
// EXTERNAL MODULE: ../proto/dist/generated/aiserver/v1/dashboard_pb.js
var dashboard_pb = __webpack_require__("../proto/dist/generated/aiserver/v1/dashboard_pb.js");
; // ../local-exec/dist/services/team-settings-service.js

const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
class ConnectTeamSettingsService {
  constructor(dashboardClient) {
    this.dashboardClient = dashboardClient;
    this.lastFetchTime = 0;
    this.lastReposFetchTime = 0;
    this.settingsPromise = this.fetchSettings();
  }
  async fetchSettings() {
    this.lastFetchTime = Date.now();
    try {
      const settings = await this.dashboardClient.getTeamAdminSettingsOrEmptyIfNotInTeam(new dashboard_pb /* GetTeamAdminSettingsRequest */.Byz({}));
      return settings;
    } catch (_error) {
      return undefined;
    }
  }
  async getTeamAdminSettings() {
    const now = Date.now();
    const isExpired = now - this.lastFetchTime > CACHE_EXPIRY_MS;
    if (isExpired || (await this.settingsPromise) === undefined) {
      this.settingsPromise = this.fetchSettings();
    }
    return this.settingsPromise;
  }
  async getDotCursorProtection() {
    const settings = await this.getTeamAdminSettings();
    return settings?.dotCursorProtection ?? true;
  }
  async getShouldBlockMcp() {
    const settings = await this.getTeamAdminSettings();
    if (settings?.autoRunControls?.enabled && settings?.autoRunControls?.disableMcpAutoRun) {
      return true;
    }
    return false;
  }
  async getDeleteFileProtection() {
    const settings = await this.getTeamAdminSettings();
    if (settings?.autoRunControls?.enabled && settings?.autoRunControls?.deleteFileProtection) {
      return true;
    }
    return false;
  }
  async isServerBlocked(server) {
    const settings = await this.getTeamAdminSettings();
    const allowedMCPConfig = settings?.allowedMcpConfiguration;
    if (!allowedMCPConfig) return false;
    if (allowedMCPConfig.disableAll === true) return true;
    const allowedMcpServers = allowedMCPConfig.allowedMcpServers;
    if (!allowedMcpServers || allowedMcpServers.length === 0) return false;
    const matchesWildcard = (pattern, stringToMatch) => {
      if (!pattern.includes("*")) {
        return pattern === stringToMatch;
      }
      // Escape special regex characters except *
      const escapedPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
      // Replace * with .* (matches any sequence of characters)
      const regexPattern = escapedPattern.replace(/\*/g, ".*");
      // Create regex that matches the entire string
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(stringToMatch);
    };
    return !allowedMcpServers.some(s => {
      if (s.command && server.command) {
        return matchesWildcard(s.command, server.command);
      } else if (s.serverUrl && server.url) {
        return matchesWildcard(s.serverUrl, server.url);
      }
      return false;
    });
  }
  async getAutoRunControls() {
    const settings = await this.getTeamAdminSettings();
    if (!settings?.autoRunControls) {
      return undefined;
    }
    return {
      enabled: settings.autoRunControls.enabled ?? false,
      allowed: settings.autoRunControls.allowed ?? [],
      blocked: settings.autoRunControls.blocked ?? []
    };
  }
  async getTeamRepos() {
    const now = Date.now();
    if (!this.teamReposPromise || now - this.lastReposFetchTime > CACHE_EXPIRY_MS) {
      this.teamReposPromise = this.fetchTeamRepos();
      this.lastReposFetchTime = now;
    }
    return this.teamReposPromise;
  }
  async fetchTeamRepos() {
    return this.dashboardClient.getTeamReposOrEmptyIfNotInTeam(new dashboard_pb /* GetTeamReposRequest */.aYW({})).catch(_e => {
      // this is fine, it just means the team does not have repo blocklist enabled
      return undefined;
    });
  }
}
//# sourceMappingURL=team-settings-service.js.map
; // ../local-exec/dist/shell-manager.js

class ShellEmitter {
  constructor(initialState) {
    this.listeners = new Set();
    this.currentState = initialState ? {
      ...initialState
    } : undefined;
    this.sandboxed = undefined;
  }
  addListener(listener) {
    this.listeners.add(listener);
  }
  removeListener(listener) {
    this.listeners.delete(listener);
  }
  getCurrentState() {
    return this.currentState ? {
      ...this.currentState
    } : undefined;
  }
  getSandboxed() {
    return this.sandboxed;
  }
  emit(event) {
    // Handle start metadata
    if (event.type === "start") {
      // Ensure we have a state object so listeners receive a new reference and re-render
      if (!this.currentState) {
        this.currentState = {
          output: "",
          exitCode: null
        };
      }
      this.sandboxed = event.sandboxed;
      // Notify listeners so UI can update lock icon immediately
      this.emitChange();
      return;
    }
    // Initialize state if it doesn't exist
    if (!this.currentState) {
      this.currentState = {
        output: "",
        exitCode: null
      };
    }
    const previousOutput = this.currentState.output;
    switch (event.type) {
      case "stdout":
        this.currentState.output += event.data;
        break;
      case "stderr":
        this.currentState.output += event.data;
        break;
      case "exit":
        this.currentState.exitCode = event.code;
        break;
    }
    // Only emit change event if the output actually changed
    if (this.currentState.output !== previousOutput || event.type === "exit") {
      this.emitChange();
    }
  }
  emitChange() {
    const newResult = this.getCurrentState();
    this.listeners.forEach(listener => {
      try {
        listener(newResult);
      } catch (error) {
        console.error("Error in shell change listener:", error);
      }
    });
  }
}
class ShellManager {
  constructor() {
    this.shellEmitterInstances = new utils_dist /* LRUCache */.qK({
      max: 100
    });
  }
  getOrCreateShellEmitter(toolCallId) {
    let shellEmitter = this.shellEmitterInstances.get(toolCallId);
    if (shellEmitter) return shellEmitter;
    shellEmitter = new ShellEmitter(undefined);
    this.shellEmitterInstances.set(toolCallId, shellEmitter);
    return shellEmitter;
  }
}
//# sourceMappingURL=shell-manager.js.map
; // ../local-exec/dist/tests/common.js
class MockIgnoreService {
  isCursorIgnored(_filePath) {
    return Promise.resolve(false);
  }
  isGitIgnored(_filePath) {
    return Promise.resolve(false);
  }
  isIgnoredByAny(_filePath) {
    return Promise.resolve(false);
  }
  listCursorIgnoreFilesByRoot(_root) {
    return Promise.resolve([]);
  }
  isRepoBlocked(_filePath) {
    return Promise.resolve(false);
  }
  getCursorIgnoreMapping() {
    return Promise.resolve({});
  }
  getGitIgnoreMapping() {
    return Promise.resolve({});
  }
}
class MockPendingDecisionProvider {
  requestApproval(_operation) {
    return Promise.resolve({
      approved: true
    });
  }
}
class MockPermissionsService {
  constructor() {
    this._shouldBlockShellCommandImpl = async (_ctx, _cmd, _opts, requestedPolicy) => ({
      kind: "allow",
      policy: requestedPolicy ?? {
        type: "insecure_none"
      }
    });
  }
  shouldBlockRead(_filePath) {
    return Promise.resolve(false);
  }
  shouldBlockWrite(_ctx, _filePath, _newContents) {
    return Promise.resolve(false);
  }
  shouldBlockShellCommand(ctx, command, options, requestedPolicy) {
    return this._shouldBlockShellCommandImpl(ctx, command, options, requestedPolicy);
  }
  shouldBlockMcp(_ctx, _args) {
    return Promise.resolve(false);
  }
  addToAllowList(_ctx, _kind, _value) {
    return Promise.resolve();
  }
  addToDenyList(_ctx, _kind, _value) {
    return Promise.resolve();
  }
  setShouldBlockShellCommand(impl) {
    this._shouldBlockShellCommandImpl = impl;
  }
}

//# sourceMappingURL=common.js.map
; // ../local-exec/dist/index.js

// MCP custom clients functionality

//# sourceMappingURL=index.js.map

/***/