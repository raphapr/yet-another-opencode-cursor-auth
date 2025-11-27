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