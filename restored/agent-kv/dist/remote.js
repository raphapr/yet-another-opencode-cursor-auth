var remote_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var remote_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var remote_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
var remote_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
const getBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.remote.get_blob.duration_ms", {
  description: "Duration of getBlob operations in milliseconds"
});
const setBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.remote.set_blob.duration_ms", {
  description: "Duration of setBlob operations in milliseconds"
});
class RemoteKvManager {
  constructor(serverStream, clientStream, nextId = 0) {
    this.serverStream = serverStream;
    this.clientStream = clientStream;
    this.nextId = nextId;
    this.pendingRequests = new Map();
    this.startListening();
  }
  startListening() {
    return remote_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        try {
          for (var _d = true, _e = remote_asyncValues(this.clientStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const message = _c;
            yield this.handleClientMessage(message);
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
      } catch (error) {
        console.error("Error in KV manager listener:", error);
        // Reject all pending requests
        for (const [_id, {
          reject
        }] of this.pendingRequests) {
          reject(new Error("KV stream closed"));
        }
        this.pendingRequests.clear();
      }
    });
  }
  handleClientMessage(message) {
    return remote_awaiter(this, void 0, void 0, function* () {
      const id = message.id;
      const pending = this.pendingRequests.get(id);
      if (!pending) {
        console.warn(`Received KV response for unknown request ID: ${id}`);
        return;
      }
      this.pendingRequests.delete(id);
      pending.resolve(message);
    });
  }
  getBlob(ctx, blobId) {
    return remote_awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = remote_addDisposableResource(env_1, createSpan(ctx.withName("RemoteKvManager.getBlob")), false);
        const startTime = performance.now();
        try {
          const id = this.nextId++;
          let resolve;
          let reject;
          const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
          });
          this.pendingRequests.set(id, {
            resolve: resolve,
            reject: reject
          });
          yield this.serverStream.write(new KvServerMessage({
            id,
            message: {
              case: "getBlobArgs",
              value: {
                blobId: new Uint8Array(blobId)
              }
            }
          }));
          const response = yield promise;
          if (response.message.case !== "getBlobResult") {
            throw new Error(`Unexpected response type: ${response.message.case}`);
          }
          span.span.setAttribute("blobLength", (_b = (_a = response.message.value.blobData) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0);
          return response.message.value.blobData;
        } finally {
          const duration = performance.now() - startTime;
          getBlobLatency.histogram(ctx, duration);
        }
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        remote_disposeResources(env_1);
      }
    });
  }
  setBlob(ctx, blobId, blobData) {
    return remote_awaiter(this, void 0, void 0, function* () {
      const env_2 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = remote_addDisposableResource(env_2, createSpan(ctx.withName("RemoteKvManager.setBlob")), false);
        span.span.setAttribute("blobLength", blobData.length);
        const startTime = performance.now();
        try {
          const id = this.nextId++;
          let resolve;
          let reject;
          const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
          });
          this.pendingRequests.set(id, {
            resolve: resolve,
            reject: reject
          });
          yield this.serverStream.write(new KvServerMessage({
            id,
            message: {
              case: "setBlobArgs",
              value: {
                blobId: new Uint8Array(blobId),
                blobData: new Uint8Array(blobData)
              }
            }
          }));
          const response = yield promise;
          if (response.message.case !== "setBlobResult") {
            throw new Error(`Unexpected response type: ${response.message.case}`);
          }
          if (response.message.value.error) {
            throw new Error(response.message.value.error.message);
          }
        } finally {
          const duration = performance.now() - startTime;
          setBlobLatency.histogram(ctx, duration);
        }
      } catch (e_3) {
        env_2.error = e_3;
        env_2.hasError = true;
      } finally {
        remote_disposeResources(env_2);
      }
    });
  }
  flush(_ctx) {
    return Promise.resolve();
  }
}