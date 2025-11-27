var controlled_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var controlled_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var controlled_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
var __asyncValues = undefined && undefined.__asyncValues || function (o) {
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
const controlledGetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.controlled.get_blob.duration_ms", {
  description: "Duration of ControlledKvManager getBlob operations in milliseconds"
});
const controlledSetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.controlled.set_blob.duration_ms", {
  description: "Duration of ControlledKvManager setBlob operations in milliseconds"
});
class ControlledKvManager {
  constructor(serverStream, clientStream, blobStore, ctx = (0, context_dist /* createContext */.q6)()) {
    this.serverStream = serverStream;
    this.clientStream = clientStream;
    this.blobStore = blobStore;
    this.ctx = ctx;
  }
  run() {
    return controlled_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const runSpan = controlled_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(this.ctx.withName("ControlledKvManager.run")), false);
        const ctx = runSpan.ctx;
        try {
          for (var _d = true, _e = __asyncValues(this.serverStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const message = _c;
            try {
              switch (message.message.case) {
                case "getBlobArgs":
                  {
                    const startTime = performance.now();
                    try {
                      const response = yield this.blobStore.getBlob(ctx, message.message.value.blobId);
                      yield this.clientStream.write(new kv_pb /* KvClientMessage */.gm({
                        id: message.id,
                        message: {
                          case: "getBlobResult",
                          value: {
                            blobData: response ? new Uint8Array(response) : undefined
                          }
                        }
                      }));
                    } finally {
                      const duration = performance.now() - startTime;
                      controlledGetBlobLatency.histogram(ctx, duration);
                    }
                    break;
                  }
                case "setBlobArgs":
                  {
                    const startTime = performance.now();
                    try {
                      try {
                        yield this.blobStore.setBlob(ctx, message.message.value.blobId, message.message.value.blobData);
                        yield this.clientStream.write(new kv_pb /* KvClientMessage */.gm({
                          id: message.id,
                          message: {
                            case: "setBlobResult",
                            value: {
                              error: undefined
                            }
                          }
                        }));
                      } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        yield this.clientStream.write(new kv_pb /* KvClientMessage */.gm({
                          id: message.id,
                          message: {
                            case: "setBlobResult",
                            value: {
                              error: {
                                message: errorMessage
                              }
                            }
                          }
                        }));
                      }
                    } finally {
                      const duration = performance.now() - startTime;
                      controlledSetBlobLatency.histogram(ctx, duration);
                    }
                    break;
                  }
              }
            } catch (error) {
              console.error("error", error);
            }
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
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        controlled_disposeResources(env_1);
      }
    });
  }
}