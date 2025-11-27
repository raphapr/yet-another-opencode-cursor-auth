var cached_blob_store_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const logger = (0, context_dist /* createLogger */.h)("@anysphere/agent-kv");
const cachedGetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.cached.get_blob.duration_ms", {
  description: "Duration of CachedBlobStore getBlob operations in milliseconds"
});
const cachedSetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.cached.set_blob.duration_ms", {
  description: "Duration of CachedBlobStore setBlob operations in milliseconds"
});
const cachedFlushLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.cached.flush.duration_ms", {
  description: "Duration of CachedBlobStore flush operations in milliseconds"
});
const encryptedGetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.encrypted.get_blob.duration_ms", {
  description: "Duration of EncryptedBlobStore getBlob operations in milliseconds"
});
const encryptedSetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.encrypted.set_blob.duration_ms", {
  description: "Duration of EncryptedBlobStore setBlob operations in milliseconds"
});
/**
 * A BlobStore that wraps a slower remote BlobStore, i.e. user's machine.
 * Results are cached in memory,
 * and also in a low-latency best-effort BlobStore (that is insecure so we need to encrypt blobs), i.e. Redis.
 *
 * As long as the remote BlobStore is never accessed directly, only through this CachedBlobStore,
 * the cache will be consistent.
 *
 * Writes are optimistic - setBlob updates the cache immediately but defers the remote write.
 * Call flush() to wait for all pending writes to complete.
 */
class CachedBlobStore {
  constructor(remoteBlobStore, nearbyInsecureBestEffortBlobStore, encryptionKeyStr) {
    this.remoteBlobStore = remoteBlobStore;
    // If we know the client's value for a blob, it is stored in `cache`.
    this.cache = new Map();
    // If we don't know the client's value for a blob, we store a promise for it in `pendingRequests`.
    // This promise might change if we receive new information.
    // INVARIANT: the key sets of `cache` and `pendingRequests` are disjoint.
    this.pendingRequests = new Map();
    // Pending write operations that haven't completed yet
    this.pendingWrites = new Set();
    if (encryptionKeyStr === null) {
      // No encryption key means we only want in-memory caching, no nearby store
      this.nearbyBestEffortBlobStore = {
        getBlob: _ => cached_blob_store_awaiter(this, void 0, void 0, function* () {
          return undefined;
        }),
        setBlob: _ => cached_blob_store_awaiter(this, void 0, void 0, function* () {}),
        flush: _ => cached_blob_store_awaiter(this, void 0, void 0, function* () {})
      };
    } else {
      this.nearbyBestEffortBlobStore = new EncryptedBlobStore(nearbyInsecureBestEffortBlobStore, encryptionKeyStr);
    }
  }
  getBlob(ctx, blobId) {
    return cached_blob_store_awaiter(this, void 0, void 0, function* () {
      var _a;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = __addDisposableResource(env_1, createSpan(ctx.withName("CachedBlobStore.getBlob")), false);
        const startTime = performance.now();
        const key = toHex(blobId);
        if (this.cache.has(key)) {
          span.span.setAttribute("cache_hit", true);
          return (_a = this.cache.get(key)) === null || _a === void 0 ? void 0 : _a.slice();
        }
        const inFlight = this.pendingRequests.get(key);
        if (inFlight !== undefined) {
          span.span.setAttribute("in_flight", true);
          return inFlight;
        }
        span.span.setAttribute("cache_miss", true);
        let requestPromise = Promise.resolve(undefined);
        requestPromise = (() => cached_blob_store_awaiter(this, void 0, void 0, function* () {
          var _a;
          const remotePromise = this.remoteBlobStore.getBlob(span.ctx, blobId).then(result => ({
            result,
            source: "remote"
          }));
          const nearbyPromise = this.nearbyBestEffortBlobStore.getBlob(span.ctx, blobId).then(result => cached_blob_store_awaiter(this, void 0, void 0, function* () {
            if (result === undefined) {
              // If missing from nearby, wait for and return the remote result
              return yield remotePromise;
            }
            return {
              result,
              source: "nearby"
            };
          })).catch(error => cached_blob_store_awaiter(this, void 0, void 0, function* () {
            // Best-effort nearby store failed (e.g., decryption error). Log and fall back to remote.
            logger.error(span.ctx, "Failed to getBlob from nearby blob store", error);
            // Wait for and return the remote result
            return yield remotePromise;
          }));
          const {
            result,
            source
          } = yield Promise.race([remotePromise, nearbyPromise]);
          if (this.pendingRequests.get(key) === requestPromise) {
            this.pendingRequests.delete(key);
            this.cache.set(key, result);
            span.span.setAttribute("result_source", source);
            if (source === "remote" && result !== undefined) {
              void this.nearbyBestEffortBlobStore.setBlob(span.ctx, blobId, result).catch(error => {
                logger.error(span.ctx, "Failed to store blob in nearby blob store", error);
              });
            }
            return result === null || result === void 0 ? void 0 : result.slice();
          } else if (this.pendingRequests.has(key)) {
            return yield this.pendingRequests.get(key);
          } else if (this.cache.has(key)) {
            return (_a = this.cache.get(key)) === null || _a === void 0 ? void 0 : _a.slice();
          } else {
            // This can happen if there was a setBlob after the getBlob started, and the setBlob failed.
            // We don't know what the client's value is, so we can't return it.
            throw new Error("setBlob raced with getBlob and failed. Try again.");
          }
        }))().finally(() => {
          if (this.pendingRequests.get(key) === requestPromise) {
            this.pendingRequests.delete(key);
          }
        });
        this.pendingRequests.set(key, requestPromise);
        try {
          return yield requestPromise;
        } finally {
          const duration = performance.now() - startTime;
          cachedGetBlobLatency.histogram(ctx, duration);
        }
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources(env_1);
      }
    });
  }
  setBlob(ctx, blobId, blobData) {
    return cached_blob_store_awaiter(this, void 0, void 0, function* () {
      const env_2 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = __addDisposableResource(env_2, createSpan(ctx.withName("CachedBlobStore.setBlob")), false);
        const startTime = performance.now();
        const dataCopy = blobData.slice();
        const key = toHex(blobId);
        const existingCachedData = this.cache.get(key);
        span.span.setAttribute("is_cached_already", existingCachedData !== undefined);
        if (existingCachedData !== undefined) {
          // If it's in the cache, it was either read by getBlob or written with a previous setBlob.
          // Since blobId is a hash of blobData, we can assume that the data is the same.
          // But we might as well check their lengths.
          if (existingCachedData.length === dataCopy.length) {
            return;
          } else {
            throw new Error(`Invalid blob data for key ${key}. Expected length ${existingCachedData.length}, got ${dataCopy.length}.`);
          }
        }
        // Optimistically update cache immediately
        this.pendingRequests.delete(key);
        this.cache.set(key, dataCopy);
        // Start the remote write but don't await it
        let writePromise = Promise.resolve();
        writePromise = (() => cached_blob_store_awaiter(this, void 0, void 0, function* () {
          void this.nearbyBestEffortBlobStore.setBlob(span.ctx, blobId, dataCopy).catch(error => {
            logger.error(span.ctx, "Failed to setBlob in nearby blob store", error);
          });
          try {
            yield this.remoteBlobStore.setBlob(span.ctx, blobId, dataCopy);
          } catch (error) {
            // On error, invalidate the cache so next read fetches from remote
            if (this.cache.get(key) === dataCopy) {
              this.cache.delete(key);
            }
            throw error;
          } finally {
            this.pendingWrites.delete(writePromise);
          }
        }))();
        this.pendingWrites.add(writePromise);
        const duration = performance.now() - startTime;
        cachedSetBlobLatency.histogram(ctx, duration);
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        __disposeResources(env_2);
      }
    });
  }
  /**
   * Wait for all pending writes to complete.
   * Should be called before sending checkpoints to ensure consistency.
   */
  flush(ctx) {
    return cached_blob_store_awaiter(this, void 0, void 0, function* () {
      const env_3 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = __addDisposableResource(env_3, createSpan(ctx.withName("CachedBlobStore.flush")), false);
        const startTime = performance.now();
        const writes = Array.from(this.pendingWrites);
        span.span.setAttribute("pending_writes_count", writes.length);
        if (writes.length === 0) {
          return;
        }
        // Wait for all writes, collecting errors
        const results = yield Promise.allSettled(writes);
        const errors = results.filter(r => r.status === "rejected").map(r => r.reason);
        span.span.setAttribute("failed_writes_count", errors.length);
        if (errors.length > 0) {
          for (const error of errors) {
            logger.error(span.ctx, "Write failed during flush", error);
          }
          throw errors[0];
        }
        const duration = performance.now() - startTime;
        cachedFlushLatency.histogram(ctx, duration);
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        __disposeResources(env_3);
      }
    });
  }
}
class EncryptedBlobStore {
  constructor(blobStore, encryptionKeyStr) {
    this.blobStore = blobStore;
    this.encryptionKeyStr = encryptionKeyStr;
  }
  getEncryptionKey() {
    return cached_blob_store_awaiter(this, void 0, void 0, function* () {
      if (this.encryptionKey === undefined) {
        // Derive a 256-bit key from the arbitrary string using SHA-256
        const encoder = new TextEncoder();
        const keyMaterial = encoder.encode(this.encryptionKeyStr);
        const keyHash = yield crypto.subtle.digest("SHA-256", keyMaterial);
        this.encryptionKey = yield crypto.subtle.importKey("raw", keyHash, {
          name: EncryptedBlobStore.ALGORITHM,
          length: 256
        }, true, ["encrypt", "decrypt"]);
      }
      return this.encryptionKey;
    });
  }
  getBlob(ctx, blobId) {
    return cached_blob_store_awaiter(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        const encryptedValue = yield this.blobStore.getBlob(ctx, blobId);
        if (encryptedValue === undefined) {
          return undefined;
        }
        // Extract IV from the beginning of the encrypted value
        const iv = encryptedValue.slice(0, EncryptedBlobStore.IV_LENGTH);
        const ciphertext = encryptedValue.slice(EncryptedBlobStore.IV_LENGTH);
        const decryptedValue = yield crypto.subtle.decrypt({
          name: EncryptedBlobStore.ALGORITHM,
          iv
        }, yield this.getEncryptionKey(), ciphertext);
        return new Uint8Array(decryptedValue);
      } finally {
        const duration = performance.now() - startTime;
        encryptedGetBlobLatency.histogram(ctx, duration);
      }
    });
  }
  setBlob(ctx, blobId, blobData) {
    return cached_blob_store_awaiter(this, void 0, void 0, function* () {
      const startTime = performance.now();
      try {
        // Generate a random IV for this encryption
        const iv = crypto.getRandomValues(new Uint8Array(EncryptedBlobStore.IV_LENGTH));
        const encryptedValue = yield crypto.subtle.encrypt({
          name: EncryptedBlobStore.ALGORITHM,
          iv
        }, yield this.getEncryptionKey(), new Uint8Array(blobData));
        // Prepend IV to the ciphertext for storage
        const combined = new Uint8Array(iv.length + encryptedValue.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encryptedValue), iv.length);
        yield this.blobStore.setBlob(ctx, blobId, combined);
      } finally {
        const duration = performance.now() - startTime;
        encryptedSetBlobLatency.histogram(ctx, duration);
      }
    });
  }
  flush(ctx) {
    return this.blobStore.flush(ctx);
  }
}
EncryptedBlobStore.ALGORITHM = "AES-GCM";
EncryptedBlobStore.IV_LENGTH = 12; // 96 bits, standard for AES-GCM