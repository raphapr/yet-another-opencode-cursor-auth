var retry_blob_store_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var retry_blob_store_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var retry_blob_store_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const retryGetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.retry.get_blob.duration_ms", {
  description: "Duration of RetryBlobStore getBlob operations in milliseconds"
});
const retrySetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.retry.set_blob.duration_ms", {
  description: "Duration of RetryBlobStore setBlob operations in milliseconds"
});
const retryFlushLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.retry.flush.duration_ms", {
  description: "Duration of RetryBlobStore flush operations in milliseconds"
});
class RetryBlobStore {
  constructor(innerStore, options) {
    this.innerStore = innerStore;
    this.options = options;
  }
  getBlob(ctx, blobId) {
    return retry_blob_store_awaiter(this, void 0, void 0, function* () {
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = retry_blob_store_addDisposableResource(env_1, createSpan(ctx.withName("RetryBlobStore.getBlob")), false);
        const startTime = performance.now();
        try {
          return yield this.withRetry(() => retry_blob_store_awaiter(this, void 0, void 0, function* () {
            return this.innerStore.getBlob(span.ctx, blobId);
          }));
        } finally {
          const duration = performance.now() - startTime;
          retryGetBlobLatency.histogram(ctx, duration);
        }
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        retry_blob_store_disposeResources(env_1);
      }
    });
  }
  setBlob(ctx, blobId, blobData) {
    return retry_blob_store_awaiter(this, void 0, void 0, function* () {
      const env_2 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = retry_blob_store_addDisposableResource(env_2, createSpan(ctx.withName("RetryBlobStore.setBlob")), false);
        const startTime = performance.now();
        try {
          return yield this.withRetry(() => retry_blob_store_awaiter(this, void 0, void 0, function* () {
            return this.innerStore.setBlob(span.ctx, blobId, blobData);
          }));
        } finally {
          const duration = performance.now() - startTime;
          retrySetBlobLatency.histogram(ctx, duration);
        }
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        retry_blob_store_disposeResources(env_2);
      }
    });
  }
  flush(ctx) {
    return retry_blob_store_awaiter(this, void 0, void 0, function* () {
      const env_3 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = retry_blob_store_addDisposableResource(env_3, createSpan(ctx.withName("RetryBlobStore.flush")), false);
        const startTime = performance.now();
        try {
          return yield this.withRetry(() => retry_blob_store_awaiter(this, void 0, void 0, function* () {
            return this.innerStore.flush(span.ctx);
          }));
        } finally {
          const duration = performance.now() - startTime;
          retryFlushLatency.histogram(ctx, duration);
        }
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        retry_blob_store_disposeResources(env_3);
      }
    });
  }
  withRetry(operation) {
    return retry_blob_store_awaiter(this, void 0, void 0, function* () {
      let lastError;
      for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
        try {
          return yield operation();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          // Don't retry if this is the last attempt or if the error doesn't match the predicate
          if (attempt === this.options.maxRetries || !this.options.retryPredicate(lastError)) {
            throw lastError;
          }
          // Wait before retrying
          if (this.options.retryDelayMs > 0) {
            yield this.delay(this.options.retryDelayMs);
          }
        }
      }
      // This should never be reached, but TypeScript needs it
      throw lastError;
    });
  }
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}