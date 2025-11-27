var __await = undefined && undefined.__await || function (v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
};
var shell_stream_asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};
var __asyncGenerator = undefined && undefined.__asyncGenerator || function (thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
    i,
    q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;
  function awaitReturn(f) {
    return function (v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function (v) {
        return new Promise(function (a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
};
const shell_stream_roundDurationMs = value => Math.round(value * 1000) / 1000;
/**
 * Wraps a ShellStreamExecutor to apply hooks before and after shell command execution.
 */
class shell_stream_ShellStreamExecutorWithHooks {
  constructor(innerExecutor, hookExecutor, baseHookRequestExtractor) {
    this.innerExecutor = innerExecutor;
    this.hookExecutor = hookExecutor;
    this.baseHookRequestExtractor = baseHookRequestExtractor;
  }
  execute(ctx, args, options) {
    return __asyncGenerator(this, arguments, function* execute_1() {
      var _a, e_1, _b, _c;
      // Execute beforeShellExecution hook
      const baseHookRequest = this.baseHookRequestExtractor(ctx);
      const beforeHookRequest = Object.assign(Object.assign({}, baseHookRequest), {
        command: args.command,
        cwd: args.workingDirectory || process.cwd()
      });
      const beforeHookResponse = yield __await(this.hookExecutor.executeHookForStep(HookStep.beforeShellExecution, beforeHookRequest));
      // Check if the hook blocked execution
      if ((beforeHookResponse === null || beforeHookResponse === void 0 ? void 0 : beforeHookResponse.permission) === "deny") {
        // Yield a rejected result
        yield yield __await(new shell_exec_pb /* ShellStream */.FI({
          event: {
            case: "rejected",
            value: new shell_exec_pb /* ShellRejected */.pZ({
              command: args.command,
              workingDirectory: args.workingDirectory || process.cwd(),
              reason: beforeHookResponse.user_message || "Command blocked by hook"
            })
          }
        }));
        return yield __await(void 0);
      }
      // Execute the actual command and collect output
      const executionStartTimeMs = external_node_perf_hooks_.performance.now();
      let output = "";
      try {
        for (var _d = true, _e = shell_stream_asyncValues(this.innerExecutor.execute(ctx, args, options)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const stream = _c;
          // Collect output for the after hook
          if (stream.event.case === "stdout") {
            output += stream.event.value.data;
          } else if (stream.event.case === "stderr") {
            output += stream.event.value.data;
          }
          yield yield __await(stream);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      // Execute afterShellExecution hook
      const executionDurationMs = shell_stream_roundDurationMs(external_node_perf_hooks_.performance.now() - executionStartTimeMs);
      const afterHookRequest = Object.assign(Object.assign({}, baseHookRequest), {
        command: args.command,
        output,
        duration: executionDurationMs
      });
      yield __await(this.hookExecutor.executeHookForStep(HookStep.afterShellExecution, afterHookRequest));
    });
  }
}