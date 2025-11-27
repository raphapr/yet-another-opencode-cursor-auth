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