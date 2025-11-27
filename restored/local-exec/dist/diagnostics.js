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