// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  q$: () => (/* reexport */RepositoryClient),
  Gv: () => (/* reexport */V1MasterKeyedEncryptionScheme),
  WZ: () => (/* reexport */createRepositoryClient)
});

// UNUSED EXPORTS: PlainTextEncryptionScheme, RepositoryIndexer, decryptPath, encryptPath, generatePathEncryptionKey, loadEncryptionScheme, negotiateEncryptionScheme, readPathKeyFromWorkspace

// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__("node:crypto");
// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var dist = __webpack_require__("../context/dist/index.js");
// EXTERNAL MODULE: ../merkle-tree/native.js
var merkle_tree_native = __webpack_require__("../merkle-tree/native.js");
// EXTERNAL MODULE: ../proto/dist/generated/aiserver/v1/repository_pb.js
var repository_pb = __webpack_require__("../proto/dist/generated/aiserver/v1/repository_pb.js");
; // ../indexing-client/dist/async-queue.js
var __await = undefined && undefined.__await || function (v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
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
class AsyncQueueClosedError extends Error {
  constructor(message = "AsyncQueue is closed") {
    super(message);
    this.name = "AsyncQueueClosedError";
  }
}
// biome-ignore lint/suspicious/noExplicitAny: yes
const noopAsyncQueueMiddleware = queue => queue;
class AsyncQueueImpl {
  constructor() {
    this.items = [];
    this.pendingPops = [];
    this.isClosed = false;
  }
  push(...items) {
    for (const item of items) {
      this.pushSingle(item);
    }
  }
  /** Adds an item to the queue. Synchronous and never blocks. */
  pushSingle(item) {
    var _a;
    if (this.isClosed) {
      throw (_a = this.closeError) !== null && _a !== void 0 ? _a : new AsyncQueueClosedError();
    }
    const pending = this.pendingPops.shift();
    if (pending !== undefined) {
      // Hand off directly to the oldest waiter (FIFO)
      if (pending.onAbort !== undefined) {
        // Best-effort cleanup of abort listener
        try {
          pending.onAbort();
        } catch (_b) {
          // ignore
        }
      }
      // No buffered items were present when this waiter was queued,
      // so resolve with a single-item batch.
      const batch = pending.batcher.createBatch(item);
      pending.resolve(batch);
      return;
    }
    this.items.push(item);
  }
  /**
   * Retrieves the next batch. If buffered items are available, constructs a batch starting
   * from the oldest item and keeps adding items while the batch accepts them.
   * If no buffered items are available, waits until one is pushed and returns a single-item batch.
   * If the queue is closed and empty, returns a rejected promise.
   */
  pop(batcher, options) {
    var _a, _b;
    if (this.items.length > 0) {
      const first = this.items.shift();
      const batch = batcher.createBatch(first);
      while (this.items.length > 0) {
        const next = this.items[0];
        const consumed = batch.add(next);
        if (consumed) {
          this.items.shift();
        } else {
          break;
        }
      }
      return Promise.resolve(batch);
    }
    if (this.isClosed) {
      return Promise.reject((_a = this.closeError) !== null && _a !== void 0 ? _a : new AsyncQueueClosedError());
    }
    const signal = options === null || options === void 0 ? void 0 : options.signal;
    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
      return Promise.reject((_b = signal.reason) !== null && _b !== void 0 ? _b : new Error("Aborted"));
    }
    return new Promise((resolve, reject) => {
      const pending = {
        resolve,
        reject,
        batcher
      };
      if (signal !== undefined) {
        const onAbort = () => {
          var _a;
          // Remove this pending pop if it still exists
          const idx = this.pendingPops.indexOf(pending);
          if (idx !== -1) {
            this.pendingPops.splice(idx, 1);
          }
          reject((_a = signal.reason) !== null && _a !== void 0 ? _a : new Error("Aborted"));
        };
        // Track a cleanup function to unregister listener once resolved
        pending.onAbort = () => {
          try {
            signal.removeEventListener("abort", onAbort);
          } catch (_a) {
            // ignore
          }
        };
        try {
          signal.addEventListener("abort", onAbort, {
            once: true
          });
        } catch (_a) {
          // If the signal is not a full EventTarget, ignore
        }
      }
      this.pendingPops.push(pending);
    });
  }
  /** Attempts to take an item immediately. Returns undefined if none available. */
  tryPop() {
    return this.items.shift();
  }
  /** Returns the total number of buffered items. */
  get size() {
    return this.items.length;
  }
  /** Returns how many consumers are currently waiting for an item. */
  get waiting() {
    return this.pendingPops.length;
  }
  /** Whether the queue has no buffered items. */
  isEmpty() {
    return this.items.length === 0;
  }
  /** Remove and return up to `max` items (or all if omitted). */
  drain(max) {
    const count = max === undefined || max >= this.items.length ? this.items.length : max;
    if (count === 0) return [];
    return this.items.splice(0, count);
  }
  /** Closes the queue. Rejects pending and future pops; push will throw. */
  close(error) {
    if (this.isClosed) return;
    this.isClosed = true;
    this.closeError = error !== null && error !== void 0 ? error : new AsyncQueueClosedError();
    // Reject all waiters
    while (this.pendingPops.length > 0) {
      const pending = this.pendingPops.shift();
      if (pending === undefined) break;
      if (pending.onAbort !== undefined) {
        try {
          pending.onAbort();
        } catch (_a) {
          // ignore
        }
      }
      pending.reject(this.closeError);
    }
  }
  /** Creates an async-iterable consumer that yields batches from this queue. */
  createConsumer(batcher) {
    return new AsyncQueueBatchIterator(this, batcher);
  }
}
class AsyncQueueBatchIterator {
  constructor(queue, batcher) {
    this.queue = queue;
    this.batcher = batcher;
  }
  [Symbol.asyncIterator]() {
    return __asyncGenerator(this, arguments, function* _a() {
      while (true) {
        try {
          const batch = yield __await(this.queue.pop(this.batcher));
          yield yield __await(batch);
        } catch (err) {
          if (err instanceof AsyncQueueClosedError) {
            return yield __await(void 0);
          }
          throw err;
        }
      }
    });
  }
}
; // ../indexing-client/dist/batcher.js
class SimpleBatchBuilder {
  constructor(maxSize, initialItems = []) {
    this.maxSize = maxSize;
    this.size = 1;
    this.items = initialItems;
  }
  add(item) {
    if (this.size >= this.maxSize) {
      return false;
    }
    this.items.push(item);
    this.size++;
    return true;
  }
}
class SimpleBatcherFactory {
  constructor(maxSize) {
    this.maxSize = maxSize;
  }
  createBatch(item) {
    return new SimpleBatchBuilder(this.maxSize, [item]);
  }
}

// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__("node:fs/promises");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
; // ../indexing-client/dist/encryption.js
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
const ENCRYPTION_ALGORITHM = "aes-256-ctr";
// we dont want to make the nonce too long because that causes long paths which is annoying for db + tpuf performance
// nonce reuse means we leak the plaintext of the reusing path segments, which is not that bad
// so we don't have to be too paranoid here
// 6 bytes gives us 1 in a 16 million chance of having any collision
// which means there will definitely be some collisions, but they are quite unlikely
const NONCE_LENGTH = 6; // 6 bytes as requested. this becomes 8 characters in base64....
const PAD_CHAR = "\0";
const SEPARATOR_REGEX = /([./\\])/;
function generatePathEncryptionKey() {
  return crypto.randomBytes(32).toString("base64url");
}
function padString(str) {
  const padLength = (4 - str.length % 4) % 4;
  return str + PAD_CHAR.repeat(padLength);
}
function unpadString(str) {
  return str.replace(new RegExp(`${PAD_CHAR}+$`), "");
}
function deriveKeys(masterKey) {
  const macKey = external_node_crypto_.createHash("sha256").update(masterKey).update(Buffer.from([0])).digest();
  const encKey = external_node_crypto_.createHash("sha256").update(masterKey).update(Buffer.from([1])).digest();
  return {
    macKey,
    encKey
  };
}
class V1MasterKeyedEncryptionScheme {
  constructor(masterKeyRaw) {
    this.masterKeyRaw = masterKeyRaw;
    const masterKey = Buffer.from(masterKeyRaw, "base64url");
    const {
      macKey,
      encKey
    } = deriveKeys(masterKey);
    this.macKey = macKey;
    this.encKey = encKey;
  }
  exportKey() {
    return this.masterKeyRaw;
  }
  encrypt(value) {
    // Create synthetic nonce
    const hmac = external_node_crypto_.createHmac("sha256", this.macKey);
    hmac.update(value);
    const nonce = hmac.digest().subarray(0, NONCE_LENGTH);
    // Expand nonce by two null bytes
    const expandedNonce = Buffer.concat([nonce, Buffer.alloc(10)]);
    // Encrypt
    const cipher = external_node_crypto_.createCipheriv(ENCRYPTION_ALGORITHM, this.encKey, expandedNonce);
    let encrypted = cipher.update(padString(value), "utf8", "base64url");
    encrypted += cipher.final("base64url");
    // Include original nonce in the ciphertext
    return Buffer.concat([nonce, Buffer.from(encrypted, "base64url")]).toString("base64url");
  }
  decrypt(value) {
    const encryptedBuffer = Buffer.from(value, "base64url");
    // Extract nonce from the ciphertext
    const nonce = encryptedBuffer.subarray(0, NONCE_LENGTH);
    // Expand nonce by two null bytes
    const expandedNonce = Buffer.concat([nonce, Buffer.alloc(10)]);
    const ciphertext = encryptedBuffer.subarray(NONCE_LENGTH).toString("base64url");
    // Decrypt
    const decipher = external_node_crypto_.createDecipheriv(ENCRYPTION_ALGORITHM, this.encKey, expandedNonce);
    let decrypted = decipher.update(ciphertext, "base64url", "utf8");
    decrypted += decipher.final("utf8");
    return unpadString(decrypted);
  }
}
class PlainTextEncryptionScheme {
  exportKey() {
    return "";
  }
  encrypt(value) {
    return value;
  }
  decrypt(value) {
    return value;
  }
}
function encryptPath(path, scheme) {
  return path.split(SEPARATOR_REGEX).map(segment => {
    if (SEPARATOR_REGEX.test(segment)) {
      return segment;
    }
    if (segment === "") {
      return segment;
    }
    return scheme.encrypt(segment);
  }).join("");
}
function decryptPath(path, scheme) {
  return path.split(SEPARATOR_REGEX).map(segment => {
    if (SEPARATOR_REGEX.test(segment)) {
      return segment;
    }
    if (segment === "") {
      return segment;
    }
    return scheme.decrypt(segment);
  }).join("");
}
function isEncryptionAvailable() {
  // try encrypting and decrypting and checking that it works
  try {
    const key = generatePathEncryptionKey();
    const path = "/home/user/Documents/myfile.txt";
    const scheme = new V1MasterKeyedEncryptionScheme(key);
    const encrypted = encryptPath(path, scheme);
    const decrypted = decryptPath(encrypted, scheme);
    return encrypted !== path && decrypted === path;
  } catch (_e) {
    return false;
  }
}
function negotiateEncryptionScheme() {
  if (isEncryptionAvailable()) {
    const key = generatePathEncryptionKey();
    return {
      schemeIdentifier: "aes-256-ctr",
      scheme: new V1MasterKeyedEncryptionScheme(key),
      key: key
    };
  }
  return {
    schemeIdentifier: "plaintext",
    scheme: new PlainTextEncryptionScheme(),
    key: ""
  };
}
function loadEncryptionScheme(encryptionScheme, key) {
  if (encryptionScheme === "aes-256-ctr") {
    return new V1MasterKeyedEncryptionScheme(key);
  }
  return new PlainTextEncryptionScheme();
}
function readPathKeyFromWorkspace(workspaceUris) {
  return __awaiter(this, void 0, void 0, function* () {
    const roots = Object.values(workspaceUris).sort((a, b) => a.localeCompare(b));
    let keyMaterial = "";
    // Combine keys in all workspaces into one single key.  If any workspace has a key,
    // we will return a custom key here.  If none of them do, we will use the default key.
    for (const root of roots) {
      try {
        const keysPath = path.join(root, ".cursor", "keys");
        const keysContent = fs.readFileSync(keysPath, "utf8");
        const keys = JSON.parse(keysContent);
        if (typeof keys.path_encryption_key === "string") {
          keyMaterial += keys.path_encryption_key;
        }
      } catch (_e) {
        // File doesn't exist or isn't valid JSON
      }
    }
    if (keyMaterial !== "") {
      return keyMaterial;
    }
    return undefined;
  });
}
; // ../indexing-client/dist/sync.js
var sync_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:sync");
class AddChange {
  constructor(relativePath) {
    this.relativePath = relativePath;
  }
}
class DeleteChange {
  constructor(encryptedRelativePath) {
    this.encryptedRelativePath = encryptedRelativePath;
  }
}
function syncMerkleSubtree(ctx, encryptionScheme, localTreeAccessor, remoteTreeAccessor, changesQueue) {
  return sync_awaiter(this, void 0, void 0, function* () {
    logger.info(ctx, "Syncing merkle subtree", {
      path: localTreeAccessor.getRelativePath(),
      localHash: localTreeAccessor.getHash(),
      remoteHash: remoteTreeAccessor === null || remoteTreeAccessor === void 0 ? void 0 : remoteTreeAccessor.getHash()
    });
    const remoteChildMap = new Map();
    if (remoteTreeAccessor !== undefined && localTreeAccessor !== undefined) {
      const localHash = localTreeAccessor.getHash();
      const remoteHash = remoteTreeAccessor.getHash();
      if (remoteHash !== undefined && remoteHash === localHash) return [];
      const remoteNode = yield remoteTreeAccessor.diffNode(localHash);
      if (remoteNode.type === "match") return [];
      if (remoteNode.type !== "mismatch") throw new Error("Unknown response type");
      for (const child of remoteNode.children) {
        remoteChildMap.set(child.getRelativePath(), child);
      }
    }
    if (localTreeAccessor.getType() === "file") {
      changesQueue.push(new AddChange(localTreeAccessor.getRelativePath()));
      return [];
    }
    const nodes = [];
    const seenLocalChildren = new Set();
    for (const child of localTreeAccessor.getChildren()) {
      const encryptedRelativePath = encryptPath(child.getRelativePath(), encryptionScheme);
      const remoteChild = remoteChildMap.get(encryptedRelativePath);
      nodes.push([child, remoteChild]);
      seenLocalChildren.add(encryptedRelativePath);
    }
    for (const [encryptedRelativePath, _] of remoteChildMap) {
      if (!seenLocalChildren.has(encryptedRelativePath)) {
        changesQueue.push(new DeleteChange(encryptedRelativePath));
      }
    }
    return nodes;
  });
}
; // ../indexing-client/dist/utils.js

function getAncestorSpline(relativePath) {
  const spline = [];
  // Normalize the path to avoid variants like './a/b' or trailing slashes
  const current = external_node_path_.normalize(relativePath);
  // Start from the parent directory of the file
  let parent = external_node_path_.dirname(current);
  // Always include at least one element (the root will be included as the last item)
  // Keep walking up until we reach the merkle tree root represented by '.'
  // The first item is the immediate parent directory of the file
  // Each subsequent item is the parent of the previous item
  // The last item must be '.' (the merkle tree root)
  // Example: a/b/c.txt -> [ 'a/b', 'a', '.' ]
  // Example: a.txt -> [ '.' ]
  // Note: path.dirname('a') === '.'
  // Build the spline by walking parents and including '.' as terminal
  // Ensure non-empty
  // Loop until we have pushed '.'
  // eslint-disable-next-line no-constant-condition
  while (true) {
    spline.push({
      relativeWorkspacePath: parent,
      hashOfNode: ""
    });
    if (parent === ".") break;
    parent = external_node_path_.dirname(parent);
  }
  return spline;
}
; // ../indexing-client/dist/change-worker.js
var change_worker_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const change_worker_logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:changeWorker");
function applyChanges(ctx, encryptionScheme, changes, basePath, updater) {
  return change_worker_awaiter(this, void 0, void 0, function* () {
    const fileUpdatePromises = [];
    for (const change of changes.items) {
      if (change instanceof AddChange) {
        change_worker_logger.info(ctx, "Applying change", {
          type: "add",
          relativePath: change.relativePath
        });
        const absolutePath = external_node_path_.join(basePath, change.relativePath);
        const contents = promises_.readFile(absolutePath, "utf-8");
        const encryptedRelativePath = encryptPath(change.relativePath, encryptionScheme);
        fileUpdatePromises.push(contents.then(contents => ({
          updateType: repository_pb /* FastUpdateFileV2Request_UpdateType */.dr.ADD,
          ancestorSpline: getAncestorSpline(encryptedRelativePath),
          partialPath: {
            case: "localFile",
            value: {
              unencryptedRelativeWorkspacePath: change.relativePath,
              hash: external_node_crypto_.createHash("sha256").update(contents).digest("hex"),
              file: {
                relativeWorkspacePath: encryptedRelativePath,
                contents
              }
            }
          }
        })));
      } else if (change instanceof DeleteChange) {
        fileUpdatePromises.push(Promise.resolve({
          updateType: repository_pb /* FastUpdateFileV2Request_UpdateType */.dr.DELETE,
          ancestorSpline: getAncestorSpline(change.encryptedRelativePath),
          partialPath: {
            case: "directory",
            value: {
              relativeWorkspacePath: change.encryptedRelativePath
            }
          }
        }));
      } else {
        throw new Error("Unknown change type");
      }
    }
    const fileUpdates = yield Promise.all(fileUpdatePromises);
    for (const fileUpdate of fileUpdates) {
      change_worker_logger.info(ctx, "Updating file", fileUpdate);
    }
    yield updater(ctx, fileUpdates);
  });
}
function changeWorker(ctx, asyncQueue, handler, batcher) {
  return change_worker_awaiter(this, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
      for (var _d = true, _e = __asyncValues(asyncQueue.createConsumer(batcher)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
        _c = _f.value;
        _d = false;
        const batch = _c;
        yield handler(ctx, batch);
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
  });
}
; // ../indexing-client/dist/connect-node.js
var connect_node_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class ConnectCodebaseNodeAccessor {
  constructor(client, codebaseId, path, hash = "") {
    this.client = client;
    this.codebaseId = codebaseId;
    this.path = path;
    this.hash = hash;
  }
  getHash() {
    return this.hash;
  }
  diffNode(hash) {
    return connect_node_awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.syncMerkleSubtreeV2({
        codebaseId: this.codebaseId,
        localPartialPath: {
          relativeWorkspacePath: this.path,
          hashOfNode: hash
        }
      });
      if (response.result.case === "match") {
        return {
          type: "match"
        };
      } else if (response.result.case === "mismatch") {
        return {
          type: "mismatch",
          children: response.result.value.children.map(child => {
            return new ConnectCodebaseNodeAccessor(this.client, this.codebaseId, child.relativeWorkspacePath, child.hashOfNode);
          })
        };
      } else {
        throw new Error("Unknown response type");
      }
    });
  }
  getRelativePath() {
    return this.path;
  }
}
class RustLocalNodeAccessor {
  constructor(fileInfo) {
    this.fileInfo = fileInfo;
  }
  getRelativePath() {
    const p = this.fileInfo.unencryptedRelativePath;
    if (p.length === 0) {
      return ".";
    }
    return p;
  }
  getHash() {
    return this.fileInfo.hash;
  }
  getChildren() {
    var _a, _b;
    return (_b = (_a = this.fileInfo.children) === null || _a === void 0 ? void 0 : _a.map(child => new RustLocalNodeAccessor(child))) !== null && _b !== void 0 ? _b : [];
  }
  getType() {
    return this.fileInfo.children === undefined ? "file" : "directory";
  }
}
; // ../indexing-client/dist/updater.js
var updater_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const updater_logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:updater");
function createConnectUpdater(client, clientRepositoryInfo, codebaseId) {
  return (ctx, changes) => updater_awaiter(this, void 0, void 0, function* () {
    const requestId = (0, external_node_crypto_.randomUUID)();
    updater_logger.info(ctx, "Updating files", {
      requestId,
      changes: changes.length
    });
    try {
      const response = yield client.fastUpdateFileV2({
        codebaseId,
        clientRepositoryInfo,
        updateType: repository_pb /* FastUpdateFileV2Request_UpdateType */.dr.BATCH,
        fileUpdates: changes
      }, {
        headers: {
          "x-request-id": requestId
        }
      });
      updater_logger.info(ctx, "Updated files", {
        requestId,
        response: response.toJson()
      });
    } catch (e) {
      updater_logger.error(ctx, "Error updating files", {
        requestId,
        error: e
      });
      throw e;
    }
  });
}
; // ../indexing-client/dist/semaphore.js
var semaphore_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class Semaphore {
  constructor(permits) {
    this.waitingResolvers = [];
    if (!Number.isInteger(permits) || permits < 0) {
      throw new Error("Semaphore requires a non-negative integer number of permits");
    }
    this.permits = permits;
  }
  acquire() {
    return semaphore_awaiter(this, void 0, void 0, function* () {
      if (this.permits > 0) {
        this.permits -= 1;
        return Promise.resolve();
      }
      return new Promise(resolve => {
        this.waitingResolvers.push(resolve);
      });
    });
  }
  release() {
    const next = this.waitingResolvers.shift();
    if (next !== undefined) {
      // Hand off the permit directly to the next waiter
      next();
    } else {
      this.permits += 1;
    }
  }
}
; // ../indexing-client/dist/worker.js
var worker_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var worker_await = undefined && undefined.__await || function (v) {
  return this instanceof worker_await ? (this.v = v, this) : new worker_await(v);
};
var worker_asyncGenerator = undefined && undefined.__asyncGenerator || function (thisArg, _arguments, generator) {
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
    r.value instanceof worker_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
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
class ConcurrentWorker {
  constructor(maxWorkers) {
    this.work = [];
    this.semaphore = new Semaphore(maxWorkers);
  }
  addTask(task) {
    return worker_awaiter(this, void 0, void 0, function* () {
      yield this.semaphore.acquire();
      const inner = () => worker_awaiter(this, void 0, void 0, function* () {
        try {
          const result = yield task();
          return result;
        } finally {
          this.semaphore.release();
        }
      });
      const promise = inner();
      this.work.push(promise);
    });
  }
  next() {
    return worker_awaiter(this, void 0, void 0, function* () {
      if (this.work.length === 0) {
        return undefined;
      }
      const [race, index] = yield Promise.race(this.work.map((p, index) => p.then(r => [r, index])));
      this.work.splice(index, 1);
      return race;
    });
  }
  [Symbol.asyncIterator]() {
    return worker_asyncGenerator(this, arguments, function* _a() {
      while (true) {
        const value = yield worker_await(this.next());
        if (value === undefined) {
          return yield worker_await(void 0);
        }
        yield yield worker_await(value);
      }
    });
  }
}
; // ../indexing-client/dist/client.js
var client_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var client_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
const client_logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:client");
function makeEncryptedWorkspaceUris(workspaceUris, pathEncryptionScheme) {
  return Object.values(workspaceUris).sort((a, b) => a.localeCompare(b)).map(workspaceUri => encryptPath(workspaceUri, pathEncryptionScheme)).join(",");
}
function getPathEncryptionKeySHA256Hash(pathEncryptionKey) {
  return external_node_crypto_.createHash("sha256").update(`${pathEncryptionKey}_PATH_KEY_HASH_SHA256`).digest("hex");
}
function syncCodebase(ctx, client, encryptionScheme, clientRepositoryInfo, treeStructureInfo, codebaseId, workspacePath) {
  return client_awaiter(this, void 0, void 0, function* () {
    const localTreeAccessor = new RustLocalNodeAccessor(treeStructureInfo);
    const syncWorker = new ConcurrentWorker(64);
    const changesQueue = new AsyncQueueImpl();
    const remoteTreeAccessor = new ConnectCodebaseNodeAccessor(client, codebaseId, ".");
    yield syncWorker.addTask(() => syncMerkleSubtree(ctx, encryptionScheme, localTreeAccessor, remoteTreeAccessor, changesQueue));
    const updater = createConnectUpdater(client, clientRepositoryInfo, codebaseId);
    const changeWorkers = Array.from({
      length: 8
    }, () => changeWorker(ctx, changesQueue, (ctx, changes) => applyChanges(ctx, encryptionScheme, changes, workspacePath, updater), new SimpleBatcherFactory(32)));
    const handleSync = () => client_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        try {
          for (var _d = true, syncWorker_1 = client_asyncValues(syncWorker), syncWorker_1_1; syncWorker_1_1 = yield syncWorker_1.next(), _a = syncWorker_1_1.done, !_a; _d = true) {
            _c = syncWorker_1_1.value;
            _d = false;
            const nodes = _c;
            for (const [localNode, remoteNode] of nodes) {
              yield syncWorker.addTask(() => syncMerkleSubtree(ctx, encryptionScheme, localNode, remoteNode, changesQueue));
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = syncWorker_1.return)) yield _b.call(syncWorker_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      } finally {
        changesQueue.close();
      }
    });
    const handleChanges = () => client_awaiter(this, void 0, void 0, function* () {
      yield Promise.all(changeWorkers);
    });
    yield Promise.all([handleSync(), handleChanges()]);
  });
}
function getFirstElement(iterable) {
  return client_awaiter(this, void 0, void 0, function* () {
    var _a, iterable_1, iterable_1_1;
    var _b, e_2, _c, _d;
    try {
      for (_a = true, iterable_1 = client_asyncValues(iterable); iterable_1_1 = yield iterable_1.next(), _b = iterable_1_1.done, !_b; _a = true) {
        _d = iterable_1_1.value;
        _a = false;
        const element = _d;
        return element;
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (!_a && !_b && (_c = iterable_1.return)) yield _c.call(iterable_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    throw new Error("No element found");
  });
}
function uriFromWorkspacePath(workspacePath) {
  return `file://${workspacePath}`;
}
class RepositoryIndexer {
  constructor(client, clientRepositoryInfo, repositoryIdentityProvider, workspacePath) {
    this.client = client;
    this.clientRepositoryInfo = clientRepositoryInfo;
    this.repositoryIdentityProvider = repositoryIdentityProvider;
    this.workspacePath = workspacePath;
  }
  createRepositoryInfo(repositoryIdentity, numFiles) {
    return client_awaiter(this, void 0, void 0, function* () {
      return {
        isLocal: true,
        numFiles,
        isTracked: false,
        remoteNames: [],
        remoteUrls: [],
        // Encrypt each workspace uri separately and join them together with commas.
        workspaceUri: makeEncryptedWorkspaceUris({
          "": uriFromWorkspacePath(this.workspacePath)
        }, repositoryIdentity.encryptionScheme),
        repoName: repositoryIdentity.repoName,
        repoOwner: repositoryIdentity.repoOwner
      };
    });
  }
  index(ctx) {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const merkleClient = new merkle_tree_native.MerkleClient({
        "": this.workspacePath
      });
      yield merkleClient.build(false, {
        maxNumFiles: 10000
      });
      client_logger.info(ctx, "Getting tree structure for", {
        workspacePath: this.workspacePath
      });
      const [treeStructureInfo, simhash, numFiles] = yield Promise.all([merkleClient.getTreeStructure(), merkleClient.getSimhash(), merkleClient.getNumEmbeddableFiles()]);
      if (treeStructureInfo === null) {
        throw new Error("Tree structure is null");
      }
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      const pathKeyHash = getPathEncryptionKeySHA256Hash(encryptionScheme.exportKey());
      const request = new repository_pb /* FastRepoInitHandshakeV2Request */.lp({
        repository: yield this.createRepositoryInfo(repositoryIdentity, numFiles),
        rootHash: treeStructureInfo.hash,
        similarityMetricType: repository_pb /* SimilarityMetricType */.oC.SIMHASH,
        similarityMetric: Array.from(simhash),
        pathKeyHash,
        pathKeyHashType: repository_pb /* PathKeyHashType */.n5.SHA256,
        doCopy: false,
        returnAfterBackgroundCopyStarted: false,
        pathKey: "",
        localCodebaseRootInfo: undefined
      });
      const response = yield this.client.fastRepoInitHandshakeV2(request);
      const syncPromises = response.codebases.map(codebase => client_awaiter(this, void 0, void 0, function* () {
        if (codebase.status === repository_pb /* RepositoryCodebaseInfo_Status */.CK.UP_TO_DATE) {
          return {
            codebaseId: codebase.codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.SUCCESS,
            hasUpdates: false
          };
        }
        try {
          yield syncCodebase(ctx, this.client, encryptionScheme, this.clientRepositoryInfo, treeStructureInfo, codebase.codebaseId, this.workspacePath);
          return {
            codebaseId: codebase.codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.SUCCESS,
            hasUpdates: true
          };
        } catch (e) {
          client_logger.error(ctx, "Error syncing codebase", {
            codebaseId: codebase.codebaseId,
            error: e
          });
          return {
            codebaseId: codebase.codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.FAILURE,
            hasUpdates: false
          };
        }
      }));
      const syncResults = yield Promise.all(syncPromises);
      yield this.client.fastRepoSyncComplete({
        codebases: syncResults.map(({
          codebaseId,
          hasUpdates
        }) => {
          return {
            codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.SUCCESS,
            hasUpdates,
            similarityMetricType: hasUpdates ? repository_pb /* SimilarityMetricType */.oC.SIMHASH : repository_pb /* SimilarityMetricType */.oC.UNSPECIFIED,
            similarityMetric: hasUpdates ? Array.from(simhash) : [],
            pathKeyHash,
            pathKeyHashType: repository_pb /* PathKeyHashType */.n5.SHA256
          };
        })
      });
    });
  }
}
class RepositoryClient {
  constructor(client, clientRepositoryInfo, repositoryIdentityProvider, workspacePath) {
    this.client = client;
    this.clientRepositoryInfo = clientRepositoryInfo;
    this.repositoryIdentityProvider = repositoryIdentityProvider;
    this.workspacePath = workspacePath;
  }
  createIndexer() {
    return new RepositoryIndexer(this.client, this.clientRepositoryInfo, this.repositoryIdentityProvider, this.workspacePath);
  }
  createFastRepositoryInfo() {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      return {
        relativeWorkspacePath: ".",
        repoName: repositoryIdentity.repoName,
        repoOwner: repositoryIdentity.repoOwner,
        orthogonalTransformSeed: 0
      };
    });
  }
  decryptPath(_ctx, path) {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      return decryptPath(path, encryptionScheme);
    });
  }
  getPathEncryptionKey(_ctx) {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      return encryptionScheme.exportKey();
    });
  }
  search(_ctx, query) {
    return client_awaiter(this, void 0, void 0, function* () {
      var _a;
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      const requestId = (0, external_node_crypto_.randomUUID)();
      console.log(requestId);
      const response = yield this.client.semSearchFast({
        request: {
          query,
          repository: yield this.createFastRepositoryInfo(),
          topK: 16
        }
      });
      const element = yield getFirstElement(response);
      const codeResults = (_a = element.response) === null || _a === void 0 ? void 0 : _a.codeResults;
      if (codeResults === undefined) {
        return undefined;
      }
      return codeResults.map(codeResult => {
        return Object.assign(Object.assign({}, codeResult), {
          codeBlock: codeResult.codeBlock ? Object.assign(Object.assign({}, codeResult.codeBlock), {
            relativeWorkspacePath: decryptPath(codeResult.codeBlock.relativeWorkspacePath, encryptionScheme)
          }) : undefined
        });
      });
    });
  }
}

// EXTERNAL MODULE: ../proto/dist/generated/aiserver/v1/repository_connect.js
var repository_connect = __webpack_require__("../proto/dist/generated/aiserver/v1/repository_connect.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/promise-client.js + 1 modules
var promise_client = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/promise-client.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect-node@1.6.1_@bufbuild+protobuf@1.10.0_@connectrpc+connect@1.6.1_patch_hash_yu5ivmw5nlvm6v3w7brw2bvqt4/node_modules/@connectrpc/connect-node/dist/esm/index.js + 26 modules
var esm = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect-node@1.6.1_@bufbuild+protobuf@1.10.0_@connectrpc+connect@1.6.1_patch_hash_yu5ivmw5nlvm6v3w7brw2bvqt4/node_modules/@connectrpc/connect-node/dist/esm/index.js");
; // ../indexing-client/dist/connect.js

class RounRobin {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }
  next() {
    const item = this.items[this.index];
    this.index = (this.index + 1) % this.items.length;
    return item;
  }
}
function createRoundRobinTransport(transports) {
  const roundRobin = new RounRobin(transports);
  return {
    unary: (request, options, signal, timeoutMs, header, input, contextValues) => {
      const transport = roundRobin.next();
      return transport.unary(request, options, signal, timeoutMs, header, input, contextValues);
    },
    stream: (request, options, signal, timeoutMs, header, input, contextValues) => {
      const transport = roundRobin.next();
      return transport.stream(request, options, signal, timeoutMs, header, input, contextValues);
    }
  };
}
function createRoundRobinTransportFromFactory(factory, numTransports) {
  const transports = [];
  for (let i = 0; i < numTransports; i++) {
    transports.push(factory());
  }
  return createRoundRobinTransport(transports);
}
function createRotatingTransport(factory, ttl) {
  let transport = factory();
  let lifetime = 0;
  return {
    unary: (request, options, signal, timeoutMs, header, input, contextValues) => {
      lifetime++;
      if (lifetime > ttl) {
        transport = factory();
        lifetime = 0;
      }
      return transport.unary(request, options, signal, timeoutMs, header, input, contextValues);
    },
    stream: (request, options, signal, timeoutMs, header, input, contextValues) => {
      lifetime++;
      if (lifetime > ttl) {
        transport = factory();
        lifetime = 0;
      }
      return transport.stream(request, options, signal, timeoutMs, header, input, contextValues);
    }
  };
}
function createRepositoryClient(options) {
  var _a;
  const baseTransportFactory = () => {
    var _a;
    return (0, esm /* createConnectTransport */.wQ)({
      baseUrl: options.endpoint,
      httpVersion: (_a = options.httpVersion) !== null && _a !== void 0 ? _a : "2",
      interceptors: options.interceptors,
      nodeOptions: options.endpoint.startsWith("https:") ? {
        protocol: "https:",
        rejectUnauthorized: !options.insecure
      } : undefined
    });
  };
  const ttl = options.ttl;
  const transportFactory = ttl ? () => createRotatingTransport(baseTransportFactory, ttl) : baseTransportFactory;
  const transport = createRoundRobinTransportFromFactory(transportFactory, (_a = options.numTransports) !== null && _a !== void 0 ? _a : 16);
  return (0, promise_client /* createClient */.UU)(repository_connect /* RepositoryService */.B, transport);
}
; // ../indexing-client/dist/index.js

/***/