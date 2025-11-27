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