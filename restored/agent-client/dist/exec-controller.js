var exec_controller_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var exec_controller_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var exec_controller_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
var exec_controller_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
class LostConnection extends Error {
  constructor(message) {
    super(message);
    this.name = "LostConnection";
  }
}
class ClientExecController {
  constructor(serverStream, clientStream, controlledExecManager) {
    this.serverStream = serverStream;
    this.clientStream = clientStream;
    this.controlledExecManager = controlledExecManager;
  }
  run(ctx) {
    return exec_controller_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const runSpan = exec_controller_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("ClientExecController.run")), false);
        const pendingPromises = [];
        try {
          try {
            for (var _d = true, _e = exec_controller_asyncValues(this.serverStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
              _c = _f.value;
              _d = false;
              const message = _c;
              if (message instanceof agent_service_pb /* ExecServerControlMessage */.Nv) {
                this.controlledExecManager.handleControlMessage(message);
                continue;
              }
              const promise = (() => exec_controller_awaiter(this, void 0, void 0, function* () {
                var _a, e_3, _b, _c;
                var _d;
                const env_2 = {
                  stack: [],
                  error: void 0,
                  hasError: false
                };
                try {
                  // Create context, potentially with parent span context from the message
                  let execCtx;
                  let span;
                  if (message.spanContext) {
                    // If span context is present, create a context with it as the parent
                    const spanCtx = message.spanContext;
                    execCtx = (0, dist /* createContextFromSpanContext */.V5)({
                      traceId: spanCtx.traceId,
                      spanId: spanCtx.spanId,
                      traceFlags: (_d = spanCtx.traceFlags) !== null && _d !== void 0 ? _d : 1
                    }, "exec.handle", ctx);
                    // Get the span so we can end it later
                    span = (0, dist /* getSpan */.fU)(execCtx);
                  } else {
                    // No span context, use the parent context
                    execCtx = ctx;
                  }
                  const _disposableSpan = exec_controller_addDisposableResource(env_2, span ? new dist /* DisposableSpan */.r2(execCtx, span) : undefined, false);
                  const stream = this.controlledExecManager.handle(execCtx, message);
                  try {
                    for (var _e = true, stream_1 = exec_controller_asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _e = true) {
                      _c = stream_1_1.value;
                      _e = false;
                      const result = _c;
                      yield this.clientStream.write(result);
                    }
                  } catch (e_3_1) {
                    e_3 = {
                      error: e_3_1
                    };
                  } finally {
                    try {
                      if (!_e && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                    } finally {
                      if (e_3) throw e_3.error;
                    }
                  }
                } catch (e_4) {
                  env_2.error = e_4;
                  env_2.hasError = true;
                } finally {
                  exec_controller_disposeResources(env_2);
                }
              }))();
              pendingPromises.push(promise);
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
          yield Promise.all(pendingPromises);
        } catch (error) {
          if (error instanceof connect_error /* ConnectError */.T && error.rawMessage === "protocol error: missing EndStreamResponse") {
            throw new LostConnection(error.message);
          }
          // not sure if these are necessary...
          else if (error instanceof connect_error /* ConnectError */.T && error.code === code /* Code */.C.Aborted) {
            const cause = error.cause;
            if (cause instanceof Error && "code" in cause && typeof cause.code === "string" && cause.code.includes("ERR_STREAM_WRITE_AFTER_END")) {
              throw new LostConnection(error.message);
            }
          } else if (error instanceof utils_dist /* WriteIterableClosedError */.W2) {
            throw new LostConnection(error.message);
          } else if (error instanceof connect_error /* ConnectError */.T && error.code === code /* Code */.C.Internal) {
            const cause = error.cause;
            if (cause instanceof Error && cause.message.includes("NGHTTP2_PROTOCOL_ERROR")) {
              throw new LostConnection(error.message);
            }
          }
        }
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        exec_controller_disposeResources(env_1);
      }
    });
  }
}