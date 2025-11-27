var shell_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const roundDurationMs = value => Math.round(value * 1000) / 1000;
/**
 * Wraps a ShellExecutor to apply hooks before and after shell command execution.
 */
class shell_ShellExecutorWithHooks {
  constructor(innerExecutor, hookExecutor, baseHookRequestExtractor) {
    this.innerExecutor = innerExecutor;
    this.hookExecutor = hookExecutor;
    this.baseHookRequestExtractor = baseHookRequestExtractor;
  }
  execute(ctx, args, options) {
    return shell_awaiter(this, void 0, void 0, function* () {
      // Execute beforeShellExecution hook
      const baseHookRequest = this.baseHookRequestExtractor(ctx);
      const beforeHookRequest = Object.assign(Object.assign({}, baseHookRequest), {
        command: args.command,
        cwd: args.workingDirectory || process.cwd()
      });
      const beforeHookResponse = yield this.hookExecutor.executeHookForStep(HookStep.beforeShellExecution, beforeHookRequest);
      // Check if the hook blocked execution
      if ((beforeHookResponse === null || beforeHookResponse === void 0 ? void 0 : beforeHookResponse.permission) === "deny") {
        // Return a rejected result
        return new shell_exec_pb /* ShellResult */.W4({
          result: {
            case: "rejected",
            value: new shell_exec_pb /* ShellRejected */.pZ({
              command: args.command,
              workingDirectory: args.workingDirectory || process.cwd(),
              reason: beforeHookResponse.user_message || "Command blocked by hook"
            })
          }
        });
      }
      // Execute the actual command
      const executionStartTimeMs = external_node_perf_hooks_.performance.now();
      const result = yield this.innerExecutor.execute(ctx, args, options);
      const executionDurationMs = roundDurationMs(external_node_perf_hooks_.performance.now() - executionStartTimeMs);
      // Execute afterShellExecution hook
      let output = "";
      if (result.result.case === "success") {
        output = result.result.value.stdout + result.result.value.stderr;
      } else if (result.result.case === "failure") {
        output = result.result.value.stdout + result.result.value.stderr;
      }
      const afterHookRequest = Object.assign(Object.assign({}, baseHookRequest), {
        command: args.command,
        output,
        duration: executionDurationMs
      });
      yield this.hookExecutor.executeHookForStep(HookStep.afterShellExecution, afterHookRequest);
      return result;
    });
  }
}