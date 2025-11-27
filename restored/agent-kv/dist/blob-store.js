var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function blob_store_getBlobId(blobData) {
  return __awaiter(this, void 0, void 0, function* () {
    const hash = yield crypto.subtle.digest("SHA-256", Uint8Array.from(blobData));
    return new Uint8Array(hash);
  });
}
const inMemoryGetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.in_memory.get_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore getBlob operations in milliseconds"
});
const inMemorySetBlobLatency = (0, metrics_dist /* createHistogram */.v5)("agent_kv.in_memory.set_blob.duration_ms", {
  description: "Duration of InMemoryBlobStore setBlob operations in milliseconds"
});
class InMemoryBlobStore {
  constructor() {
    this.blobs = new Map();
  }
  getBlob(ctx, blobId) {
    const startTime = performance.now();
    try {
      const blob = this.blobs.get(serde_toHex(blobId));
      return Promise.resolve(blob);
    } finally {
      const duration = performance.now() - startTime;
      inMemoryGetBlobLatency.histogram(ctx, duration);
    }
  }
  setBlob(ctx, blobId, blobData) {
    const startTime = performance.now();
    try {
      this.blobs.set(serde_toHex(blobId), blobData);
      return Promise.resolve();
    } finally {
      const duration = performance.now() - startTime;
      inMemorySetBlobLatency.histogram(ctx, duration);
    }
  }
  flush(_ctx) {
    return Promise.resolve();
  }
}
class InMemoryTypedStore {
  constructor() {
    this.store = new Map();
  }
  set(key, value) {
    this.store.set(key, value);
  }
  subscribe(_key, _listener) {
    return () => {};
  }
  get(key) {
    const value = this.store.get(key);
    if (value === undefined) {
      throw new Error(`Key ${String(key)} not found in store`);
    }
    return value;
  }
}