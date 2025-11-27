var write_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/**
 * Wraps a WriteExecutor to apply hooks after file write operations.
 */
class write_WriteExecutorWithHooks {
  constructor(innerExecutor, hookExecutor, baseHookRequestExtractor) {
    this.innerExecutor = innerExecutor;
    this.hookExecutor = hookExecutor;
    this.baseHookRequestExtractor = baseHookRequestExtractor;
  }
  execute(ctx, args, options) {
    return write_awaiter(this, void 0, void 0, function* () {
      // Execute the actual write operation
      const result = yield this.innerExecutor.execute(ctx, args, options);
      // Only execute afterFileEdit hook if the write was successful
      if (result.result.case === "success") {
        const baseHookRequest = this.baseHookRequestExtractor(ctx);
        const afterHookRequest = Object.assign(Object.assign({}, baseHookRequest), {
          file_path: args.path,
          edits: [{
            old_string: "",
            // For a full file write, we don't have the old string
            new_string: args.fileText
          }]
        });
        const afterHookResponse = yield this.hookExecutor.executeHookForStep(HookStep.afterFileEdit, afterHookRequest);
        // After the hook executes, read the file again to get the updated content if requested
        // Hooks might have changed the file, so we need to return the current state
        if (args.returnFileContentAfterWrite && afterHookResponse !== undefined) {
          const resolvedPath = result.result.value.path;
          try {
            const fileContentAfterHook = yield (0, local_exec_dist.readText)(resolvedPath);
            const updatedLines = (0, local_exec_dist.countLines)(fileContentAfterHook);
            const updatedSize = Buffer.byteLength(fileContentAfterHook, "utf8");
            // Update the result with the new file content and metadata
            return new write_exec_pb /* WriteResult */.v3({
              result: {
                case: "success",
                value: new write_exec_pb /* WriteSuccess */.j6(Object.assign(Object.assign({}, result.result.value), {
                  fileContentAfterWrite: fileContentAfterHook,
                  linesCreated: updatedLines,
                  fileSize: updatedSize
                }))
              }
            });
          } catch (_error) {
            // If reading fails after the hook, return the original result
            // This maintains the original behavior in case of errors
            return result;
          }
        }
      }
      return result;
    });
  }
}