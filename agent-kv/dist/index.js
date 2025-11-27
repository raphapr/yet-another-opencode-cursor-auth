// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  aY: () => (/* reexport */AgentMetadataSerde),
  yj: () => (/* reexport */AgentModes),
  pH: () => (/* reexport */AgentStore),
  hC: () => (/* reexport */ControlledKvManager),
  ve: () => (/* reexport */InMemoryBlobStore),
  We: () => (/* reexport */InMemoryTypedStore),
  aD: () => (/* reexport */fromHex),
  sh: () => (/* reexport */getDefaultAgentMetadata),
  nj: () => (/* reexport */serde_toHex)
});

// UNUSED EXPORTS: CachedBlobStore, EagerReference, LazyReference, ProtoSerde, RemoteKvManager, RetryBlobStore, Utf8Serde, Writeable, fromBase64, getBlobId, toBase64, utf8Serde

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/agent_pb.js + 9 modules
var agent_pb = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/todo_tool_pb.js
var todo_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/todo_tool_pb.js");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var dist = __webpack_require__("../utils/dist/index.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var lib = __webpack_require__("../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs");
// EXTERNAL MODULE: ../metrics/dist/index.js
var metrics_dist = __webpack_require__("../metrics/dist/index.js");
; // ../agent-kv/dist/serde.js
const decoder = new TextDecoder();
const encoder = new TextEncoder();
class Utf8Serde {
  serialize(value) {
    return encoder.encode(value);
  }
  deserialize(blob) {
    return decoder.decode(blob);
  }
}
const utf8Serde = new Utf8Serde();
class ProtoSerde {
  constructor(proto) {
    this.proto = proto;
  }
  serialize(value) {
    return value.toBinary();
  }
  deserialize(blob) {
    return this.proto.fromBinary(blob);
  }
}
function serde_toHex(u8) {
  return Array.from(u8, b => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex) {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error("Invalid hex string length");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}
function toBase64(u8) {
  return Buffer.from(u8).toString("base64");
}
function fromBase64(base64) {
  return new Uint8Array(Buffer.from(base64, "base64"));
}
; // ../agent-kv/dist/blob-store.js
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
; // ../agent-kv/dist/agent-store.js
var agent_store_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const AgentModes = ["default", "auto-run", "plan", "background", "search"];
const AgentMetadataSchema = lib.z.object({
  agentId: lib.z.string(),
  latestRootBlobId: lib.z.instanceof(Uint8Array),
  name: lib.z.string(),
  createdAt: lib.z.number(),
  mode: lib.z.enum(AgentModes),
  lastUsedModel: lib.z.string().optional(),
  resumeBcId: lib.z.string().optional()
});
const getDefaultAgentMetadata = agentId => ({
  agentId: agentId !== null && agentId !== void 0 ? agentId : crypto.randomUUID(),
  latestRootBlobId: new Uint8Array(),
  name: "New Agent",
  mode: "default",
  createdAt: Date.now(),
  lastUsedModel: undefined,
  resumeBcId: undefined
});
class AgentMetadataSerde {
  serialize(value) {
    const serializedLatestRootBlobId = serde_toHex(value.latestRootBlobId);
    return utf8Serde.serialize(JSON.stringify(Object.assign(Object.assign({}, value), {
      latestRootBlobId: serializedLatestRootBlobId
    })));
  }
  deserialize(blob) {
    const json = JSON.parse(utf8Serde.deserialize(blob));
    const latestRootBlobId = fromHex(json.latestRootBlobId);
    // Merge with defaults so missing fields (e.g., mode) are populated
    const defaults = getDefaultAgentMetadata(json.agentId);
    // Validate mode and default to "default" if invalid
    const mode = AgentModes.includes(json.mode) ? json.mode : "default";
    return AgentMetadataSchema.parse(Object.assign(Object.assign(Object.assign({}, defaults), json), {
      mode,
      latestRootBlobId
    }));
  }
}
// Serdes reused from the structured accessor
const todoItemSerde = new ProtoSerde(todo_tool_pb /* TodoItem */.kW);
const userMessageSerde = new ProtoSerde(agent_pb /* UserMessage */.RG);
const conversationStepSerde = new ProtoSerde(agent_pb /* ConversationStep */.kJ);
const conversationTurnStructureSerde = new ProtoSerde(agent_pb /* ConversationTurnStructure */.cm);
const conversationSummarySerde = new ProtoSerde(agent_pb /* ConversationSummary */.KR);
const shellCommandSerde = new ProtoSerde(agent_pb /* ShellCommand */.oI);
const shellOutputSerde = new ProtoSerde(agent_pb /* ShellOutput */.Zm);
class AgentStore {
  constructor(blobStore, metadataStore) {
    this.blobStore = blobStore;
    this.metadataStore = metadataStore;
    this.serde = new ProtoSerde(agent_pb /* ConversationStateStructure */.Y9);
    this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
  }
  subscribeToMetadata(key, callback) {
    return this.metadataStore.subscribe(key, () => {
      callback(this.metadataStore.get(key));
    });
  }
  setMetadata(key, value) {
    this.metadataStore.set(key, value);
  }
  getMetadata(key) {
    return this.metadataStore.get(key);
  }
  getId() {
    return this.getMetadata("agentId");
  }
  getBlobStore() {
    return this.blobStore;
  }
  getConversationStateStructure() {
    return this.conversationStateStructure;
  }
  getFullConversation(ctx) {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      const newState = new agent_pb /* ConversationState */.lj();
      const turns = [];
      const turnBlobs = this.conversationStateStructure.turns;
      for (const turnBlobId of turnBlobs) {
        const turnBlob = yield this.blobStore.getBlob(ctx, turnBlobId);
        if (!turnBlob) continue;
        const turnStructure = conversationTurnStructureSerde.deserialize(turnBlob);
        let conversationTurn;
        switch (turnStructure.turn.case) {
          case "agentConversationTurn":
            {
              const agentTurnStructure = turnStructure.turn.value;
              const userMessageBlob = yield this.blobStore.getBlob(ctx, agentTurnStructure.userMessage);
              if (!userMessageBlob) continue;
              const userMessage = userMessageSerde.deserialize(userMessageBlob);
              const steps = [];
              for (const stepBlobId of agentTurnStructure.steps) {
                const stepBlob = yield this.blobStore.getBlob(ctx, stepBlobId);
                if (stepBlob) {
                  const step = conversationStepSerde.deserialize(stepBlob);
                  steps.push(step);
                }
              }
              const agentTurn = new agent_pb /* AgentConversationTurn */.i9({
                userMessage,
                steps
              });
              conversationTurn = new agent_pb /* ConversationTurn */.j9({
                turn: {
                  case: "agentConversationTurn",
                  value: agentTurn
                }
              });
              break;
            }
          case "shellConversationTurn":
            {
              const shellTurnStructure = turnStructure.turn.value;
              const shellCommandBlob = yield this.blobStore.getBlob(ctx, shellTurnStructure.shellCommand);
              if (!shellCommandBlob) continue;
              const shellCommand = shellCommandSerde.deserialize(shellCommandBlob);
              const shellOutputBlob = yield this.blobStore.getBlob(ctx, shellTurnStructure.shellOutput);
              if (!shellOutputBlob) continue;
              const shellOutput = shellOutputSerde.deserialize(shellOutputBlob);
              const shellTurn = new agent_pb /* ShellConversationTurn */.tm({
                shellCommand,
                shellOutput
              });
              conversationTurn = new agent_pb /* ConversationTurn */.j9({
                turn: {
                  case: "shellConversationTurn",
                  value: shellTurn
                }
              });
              break;
            }
        }
        if (!conversationTurn) continue;
        turns.push(conversationTurn);
      }
      newState.turns = turns;
      const todos = [];
      for (const todoBlobId of this.conversationStateStructure.todos) {
        const todoBlob = yield this.blobStore.getBlob(ctx, todoBlobId);
        if (todoBlob) {
          const todo = todoItemSerde.deserialize(todoBlob);
          todos.push(todo);
        }
      }
      newState.todos = todos;
      if (this.conversationStateStructure.summary) {
        const summaryBlob = yield this.blobStore.getBlob(ctx, this.conversationStateStructure.summary);
        if (summaryBlob) {
          const summary = conversationSummarySerde.deserialize(summaryBlob);
          newState.summary = summary;
        }
      }
      return newState;
    });
  }
  getLatestCheckpoint() {
    return this.getConversationStateStructure();
  }
  handleCheckpoint(ctx, checkpoint) {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      this.conversationStateStructure = checkpoint;
      const bytes = this.serde.serialize(checkpoint);
      const blobId = yield blob_store_getBlobId(bytes);
      yield this.blobStore.setBlob(ctx, blobId, bytes);
      this.setMetadata("latestRootBlobId", new Uint8Array(blobId));
    });
  }
  resetFromDb(ctx) {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      try {
        const rootBlobId = this.getMetadata("latestRootBlobId");
        if (!rootBlobId) {
          this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
          return;
        }
        const bytes = yield this.blobStore.getBlob(ctx, rootBlobId);
        if (!bytes) {
          this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
          return;
        }
        const structure = this.serde.deserialize(bytes);
        this.conversationStateStructure = structure;
      } catch (_e) {
        this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
      }
    });
  }
  dispose() {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      if (this.blobStore instanceof dist /* Disposable */.jG) {
        yield this.blobStore.dispose();
      }
    });
  }
}

// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var context_dist = __webpack_require__("../context/dist/index.js");
; // ../agent-kv/dist/cached-blob-store.js
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

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/kv_pb.js
var kv_pb = __webpack_require__("../proto/dist/generated/agent/v1/kv_pb.js");
; // ../agent-kv/dist/controlled.js
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
; // ../agent-kv/dist/reference.js
var reference_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class Writeable {}
class EagerReference {
  constructor(serde, blobStore, value) {
    this.serde = serde;
    this.blobStore = blobStore;
    this.lastWrittenValue = undefined;
    this.value = value;
  }
  get(_ctx) {
    return Promise.resolve(this.value);
  }
  set(value) {
    this.value = value;
  }
  writeToBlobStore(ctx) {
    return reference_awaiter(this, void 0, void 0, function* () {
      var _a;
      if (this.value instanceof Writeable) {
        return this.value.writeToBlobStore(ctx);
      }
      if (this.value === ((_a = this.lastWrittenValue) === null || _a === void 0 ? void 0 : _a.value)) {
        return this.lastWrittenValue.blobId;
      }
      const serialized = this.serde.serialize(this.value);
      const blobId = yield getBlobId(serialized);
      yield this.blobStore.setBlob(ctx, blobId, serialized);
      this.lastWrittenValue = {
        value: this.value,
        blobId
      };
      return blobId;
    });
  }
}
class LazyReference {
  constructor(serde, blobStore, blobId) {
    this.serde = serde;
    this.blobStore = blobStore;
    this.blobId = blobId;
    this.valuePromise = undefined;
    this.lastWrittenValue = undefined;
  }
  get(ctx) {
    return reference_awaiter(this, void 0, void 0, function* () {
      if (this.valuePromise === undefined) {
        this.valuePromise = this.blobStore.getBlob(ctx, this.blobId).then(blob => {
          if (blob === undefined) {
            throw new Error(`Blob not found: ${this.blobId}`);
          }
          return this.serde.deserialize(blob);
        });
        this.valuePromise.then(value => {
          this.lastWrittenValue = value;
        });
      }
      return this.valuePromise;
    });
  }
  set(value) {
    this.valuePromise = Promise.resolve(value);
  }
  writeToBlobStore(ctx) {
    return reference_awaiter(this, void 0, void 0, function* () {
      if (this.valuePromise === undefined) {
        // if it hasn't been initialized, then it hasn't changed
        return this.blobId;
      }
      const value = yield this.get(ctx);
      if (value instanceof Writeable) {
        return value.writeToBlobStore(ctx);
      }
      if (value === this.lastWrittenValue) {
        // if it hasn't changed, then it hasn't changed
        return this.blobId;
      }
      const serialized = this.serde.serialize(value);
      const blobId = yield getBlobId(serialized);
      yield this.blobStore.setBlob(ctx, blobId, serialized);
      this.lastWrittenValue = value;
      this.blobId = blobId;
      return blobId;
    });
  }
}
; // ../agent-kv/dist/remote.js
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
; // ../agent-kv/dist/retry-blob-store.js
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
; // ../agent-kv/dist/index.js

/***/