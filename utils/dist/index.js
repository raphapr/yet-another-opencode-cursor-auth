// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  jG: () => (/* reexport */Disposable),
  qA: () => (/* reexport */FileURL),
  dV: () => (/* reexport */ForkableIterable),
  qK: () => (/* reexport */LRUCache),
  F8: () => (/* reexport */MapWritable),
  TJ: () => (/* reexport */PromiseQueue),
  W2: () => (/* reexport */WriteIterableClosedError),
  up: () => (/* reexport */asyncMapSettledValues),
  PH: () => (/* reexport */asyncMapValues),
  Jt: () => (/* reexport */createWritableIterable),
  fg: () => (/* reexport */extractTerminalId),
  Ef: () => (/* reexport */findActualExecutable),
  ue: () => (/* reexport */getFirstItem),
  JD: () => (/* reexport */isAgentToolOutputFile),
  r_: () => (/* reexport */slugifyPath)
});

// UNUSED EXPORTS: CURSOR_PROJECTS_DIR, TimeoutError, asyncMap, asyncMapSettled, asyncReduce, delay, fileUrlUtils, getProjectPath, isAbsolutePath, isCursorTerminalsDirectory, isDsv3Model, retryPromise, withTimeout

; // ../utils/dist/async-iterator.js
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
function getFirstItem(iterable) {
  return __awaiter(this, void 0, void 0, function* () {
    // Take (only) one iterator from the async-iterable
    const iterator = iterable[Symbol.asyncIterator]();
    // Grab the first element
    const first = yield iterator.next();
    if (first.done) {
      throw new Error("AsyncIterable yielded no items");
    }
    // Wrap the *same* iterator so callers can iterate the remaining items exactly once
    const rest = {
      [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
          for (;;) {
            const next = yield __await(iterator.next());
            if (next.done) return yield __await(void 0);
            yield yield __await(next.value);
          }
        });
      }
    };
    return {
      firstItem: first.value,
      rest
    };
  });
}
//# sourceMappingURL=async-iterator.js.map
; // ../utils/dist/disposable.js
class Disposable {}
//# sourceMappingURL=disposable.js.map
; // ../utils/dist/file-url.js
/**
 * A wrapper around file:/// URLs that provides serialization/deserialization
 * and convenient conversion between file paths and file URLs.
 */
class FileURL {
  /**
   * Creates a FileUrl instance from a file path or file:// URL string
   */
  constructor(pathOrUrl) {
    if (pathOrUrl.startsWith("file://")) {
      // Validate that this is actually a file:// URL
      if (!this.isValidFileUrl(pathOrUrl)) {
        throw new Error(`Invalid file URL: ${pathOrUrl}`);
      }
      this.urlString = pathOrUrl;
    } else {
      // Convert file path to file:// URL
      const absolutePath = this.resolvePath(pathOrUrl);
      this.urlString = this.pathToFileUrl(absolutePath);
    }
  }
  /**
   * Validates that a string is a proper file:// URL
   */
  isValidFileUrl(str) {
    try {
      const url = new URL(str);
      return url.protocol === "file:";
    } catch (_a) {
      return false;
    }
  }
  /**
   * Resolves a relative path to an absolute path
   */
  resolvePath(path) {
    // Handle Windows paths
    if (path.includes("\\")) {
      path = path.replace(/\\/g, "/");
    }
    // If already absolute on Windows (starts with drive letter) or Unix (starts with /)
    if (/^[a-zA-Z]:\//.test(path) || /^\//.test(path)) {
      return path;
    }
    // For relative paths, we'll assume they're relative to current directory
    // This is a simplified resolution that doesn't handle complex cases
    // but avoids Node.js dependency
    const parts = path.split("/");
    const resolved = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === "..") {
        resolved.pop();
      } else if (part !== "." && part !== "") {
        resolved.push(part);
      }
    }
    if (resolved.length === 0) {
      return ".";
    }
    return `/${resolved.join("/")}`;
  }
  /**
   * Converts a file path to file:// URL
   */
  pathToFileUrl(filePath) {
    // Handle Windows paths
    if (/^[a-zA-Z]:\//.test(filePath)) {
      // Windows path like "C:/path/to/file"
      const drive = filePath.charAt(0).toLowerCase();
      const path = filePath.substring(2).replace(/\\/g, "/");
      return `file:///${drive}:${path}`;
    }
    // Unix-like path
    if (!filePath.startsWith("/")) {
      filePath = `/${filePath}`;
    }
    // Encode special characters, but keep the path structure
    const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, "/");
    return `file://${encodedPath}`;
  }
  /**
   * Converts file:// URL to file path
   */
  fileUrlToPath(urlString) {
    try {
      const url = new URL(urlString);
      // Handle Windows paths
      if (url.pathname.startsWith("/") && /^\/[a-zA-Z]:\//.test(url.pathname)) {
        // Windows path in URL like file:///c:/path/to/file
        const drive = url.pathname[1].toUpperCase();
        const pathPart = url.pathname.substring(3); // Remove "/c:" part
        return `${drive}:${pathPart}`;
      }
      // Unix-like path
      const path = decodeURIComponent(url.pathname);
      // Unix paths should already have the leading slash from pathname
      return path;
    } catch (_a) {
      throw new Error(`Invalid file URL format: ${urlString}`);
    }
  }
  get fsPath() {
    return this.toPath();
  }
  /**
   * Creates a FileUrl from a file path
   */
  static fromPath(filePath) {
    return new FileURL(filePath);
  }
  /**
   * Creates a FileUrl from a file:// URL string
   */
  static fromUrl(fileUrl) {
    if (!fileUrl.startsWith("file://")) {
      throw new Error(`Expected file:// URL, got: ${fileUrl}`);
    }
    return new FileURL(fileUrl);
  }
  /**
   * Deserializes a FileUrl from a string (same as constructor)
   */
  static fromString(str) {
    return new FileURL(str);
  }
  /**
   * Returns the file path (without file:// protocol)
   */
  toPath() {
    return this.fileUrlToPath(this.urlString);
  }
  /**
   * Returns the full file:// URL as a string
   */
  toString() {
    return this.urlString;
  }
  /**
   * Serializes to string (same as toString)
   */
  serialize() {
    return this.toString();
  }
  /**
   * Returns the underlying URL object
   */
  toURL() {
    try {
      return new URL(this.urlString);
    } catch (_a) {
      throw new Error(`Invalid URL format: ${this.urlString}`);
    }
  }
  /**
   * Returns the filename (last segment of the path)
   */
  getFilename() {
    const path = this.toPath();
    const pathSeparator = path.includes("\\") ? "\\" : "/";
    return path.split(pathSeparator).pop() || "";
  }
  /**
   * Returns the directory path
   */
  getDirectory() {
    const path = this.toPath();
    const pathSeparator = path.includes("\\") ? "\\" : "/";
    const lastSeparatorIndex = path.lastIndexOf(pathSeparator);
    if (lastSeparatorIndex === -1) {
      return path;
    }
    return path.substring(0, lastSeparatorIndex);
  }
  /**
   * Checks if two FileUrl instances are equal
   */
  equals(other) {
    return this.urlString === other.urlString;
  }
  /**
   * JSON serialization support
   */
  toJSON() {
    return this.toString();
  }
}
/**
 * Utility functions for working with file URLs
 */
const fileUrlUtils = {
  /**
   * Checks if a string is a valid file:// URL
   */
  isFileUrl(str) {
    return str.startsWith("file://");
  },
  /**
   * Converts a file path to file:// URL string
   */
  pathToUrl(filePath) {
    return new FileURL(filePath).toString();
  },
  /**
   * Converts a file:// URL string to file path
   */
  urlToPath(fileUrl) {
    return new FileURL(fileUrl).toPath();
  }
};
//# sourceMappingURL=file-url.js.map
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
; // ../utils/dist/lru-cache.js
/**
 * @module LRUCache
 */
var lru_cache_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var __classPrivateFieldSet = undefined && undefined.__classPrivateFieldSet || function (receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = undefined && undefined.__classPrivateFieldGet || function (receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _a;
var _b, _Stack_constructing, _LRUCache_instances, _LRUCache_max, _LRUCache_maxSize, _LRUCache_dispose, _LRUCache_onInsert, _LRUCache_disposeAfter, _LRUCache_fetchMethod, _LRUCache_memoMethod, _LRUCache_perf, _LRUCache_size, _LRUCache_calculatedSize, _LRUCache_keyMap, _LRUCache_keyList, _LRUCache_valList, _LRUCache_next, _LRUCache_prev, _LRUCache_head, _LRUCache_tail, _LRUCache_free, _LRUCache_disposed, _LRUCache_sizes, _LRUCache_starts, _LRUCache_ttls, _LRUCache_hasDispose, _LRUCache_hasFetchMethod, _LRUCache_hasDisposeAfter, _LRUCache_hasOnInsert, _LRUCache_initializeTTLTracking, _LRUCache_updateItemAge, _LRUCache_statusTTL, _LRUCache_setItemTTL, _LRUCache_isStale, _LRUCache_initializeSizeTracking, _LRUCache_removeItemSize, _LRUCache_addItemSize, _LRUCache_requireSize, _LRUCache_indexes, _LRUCache_rindexes, _LRUCache_isValidIndex, _LRUCache_evict, _LRUCache_backgroundFetch, _LRUCache_isBackgroundFetch, _LRUCache_connect, _LRUCache_moveToTail, _LRUCache_delete, _LRUCache_clear, _c;
const defaultPerf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
const warned = new Set();
/* c8 ignore start */
const PROCESS = typeof process === "object" && !!process ? process : {};
/* c8 ignore start */
const emitWarning = (msg, type, code, fn) => {
  typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
let AC = globalThis.AbortController;
let AS = globalThis.AbortSignal;
/* c8 ignore start */
if (typeof AC === "undefined") {
  //@ts-ignore
  AS = class AbortSignal {
    constructor() {
      this._onabort = [];
      this.aborted = false;
    }
    addEventListener(_, fn) {
      this._onabort.push(fn);
    }
  };
  //@ts-ignore
  AC = class AbortController {
    constructor() {
      this.signal = new AS();
      warnACPolyfill();
    }
    abort(reason) {
      var _a, _d;
      if (this.signal.aborted) return;
      //@ts-ignore
      this.signal.reason = reason;
      //@ts-ignore
      this.signal.aborted = true;
      //@ts-ignore
      for (const fn of this.signal._onabort) {
        fn(reason);
      }
      (_d = (_a = this.signal).onabort) === null || _d === void 0 ? void 0 : _d.call(_a, reason);
    }
  };
  let printACPolyfillWarning = ((_a = PROCESS.env) === null || _a === void 0 ? void 0 : _a.LRU_CACHE_IGNORE_AC_WARNING) !== "1";
  const warnACPolyfill = () => {
    if (!printACPolyfillWarning) return;
    printACPolyfillWarning = false;
    emitWarning("AbortController is not defined. If using lru-cache in " + "node 14, load an AbortController polyfill from the " + "`node-abort-controller` package. A minimal polyfill is " + "provided for use by LRUCache.fetch(), but it should not be " + "relied upon in other contexts (eg, passing it to other APIs that " + "use AbortController/AbortSignal might have undesirable effects). " + "You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
  };
}
/* c8 ignore stop */
const shouldWarn = code => !warned.has(code);
const TYPE = Symbol("type");
const isPosInt = n => n && n === Math.floor(n) && n > 0 && Number.isFinite(n);
/* c8 ignore start */
// This is a little bit ridiculous, tbh.
// The maximum array length is 2^32-1 or thereabouts on most JS impls.
// And well before that point, you're caching the entire world, I mean,
// that's ~32GB of just integers for the next/prev links, plus whatever
// else to hold that many keys and values.  Just filling the memory with
// zeroes at init time is brutal when you get that big.
// But why not be complete?
// Maybe in the future, these limits will have expanded.
const getUintArray = max => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
/* c8 ignore stop */
class ZeroArray extends Array {
  constructor(size) {
    super(size);
    this.fill(0);
  }
}
class Stack {
  static create(max) {
    const HeapCls = getUintArray(max);
    if (!HeapCls) return [];
    __classPrivateFieldSet(_b, _b, true, "f", _Stack_constructing);
    const s = new _b(max, HeapCls);
    __classPrivateFieldSet(_b, _b, false, "f", _Stack_constructing);
    return s;
  }
  constructor(max, HeapCls) {
    /* c8 ignore start */
    if (!__classPrivateFieldGet(_b, _b, "f", _Stack_constructing)) {
      throw new TypeError("instantiate Stack using Stack.create(n)");
    }
    /* c8 ignore stop */
    this.heap = new HeapCls(max);
    this.length = 0;
  }
  push(n) {
    this.heap[this.length++] = n;
  }
  pop() {
    return this.heap[--this.length];
  }
}
_b = Stack;
// private constructor
_Stack_constructing = {
  value: false
};
/**
 * Default export, the thing you're using this module to get.
 *
 * The `K` and `V` types define the key and value types, respectively. The
 * optional `FC` type defines the type of the `context` object passed to
 * `cache.fetch()` and `cache.memo()`.
 *
 * Keys and values **must not** be `null` or `undefined`.
 *
 * All properties from the options object (with the exception of `max`,
 * `maxSize`, `fetchMethod`, `memoMethod`, `dispose` and `disposeAfter`) are
 * added as normal public members. (The listed options are read-only getters.)
 *
 * Changing any of these will alter the defaults for subsequent method calls.
 */
class LRUCache {
  /**
   * {@link LRUCache.OptionsBase.perf}
   */
  get perf() {
    return __classPrivateFieldGet(this, _LRUCache_perf, "f");
  }
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(c) {
    return {
      // properties
      starts: __classPrivateFieldGet(c, _LRUCache_starts, "f"),
      ttls: __classPrivateFieldGet(c, _LRUCache_ttls, "f"),
      sizes: __classPrivateFieldGet(c, _LRUCache_sizes, "f"),
      keyMap: __classPrivateFieldGet(c, _LRUCache_keyMap, "f"),
      keyList: __classPrivateFieldGet(c, _LRUCache_keyList, "f"),
      valList: __classPrivateFieldGet(c, _LRUCache_valList, "f"),
      next: __classPrivateFieldGet(c, _LRUCache_next, "f"),
      prev: __classPrivateFieldGet(c, _LRUCache_prev, "f"),
      get head() {
        return __classPrivateFieldGet(c, _LRUCache_head, "f");
      },
      get tail() {
        return __classPrivateFieldGet(c, _LRUCache_tail, "f");
      },
      free: __classPrivateFieldGet(c, _LRUCache_free, "f"),
      // methods
      isBackgroundFetch: p => __classPrivateFieldGet(c, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(c, p),
      backgroundFetch: (k, index, options, context) => __classPrivateFieldGet(c, _LRUCache_instances, "m", _LRUCache_backgroundFetch).call(c, k, index, options, context),
      moveToTail: index => __classPrivateFieldGet(c, _LRUCache_instances, "m", _LRUCache_moveToTail).call(c, index),
      indexes: options => __classPrivateFieldGet(c, _LRUCache_instances, "m", _LRUCache_indexes).call(c, options),
      rindexes: options => __classPrivateFieldGet(c, _LRUCache_instances, "m", _LRUCache_rindexes).call(c, options),
      isStale: index => __classPrivateFieldGet(c, _LRUCache_isStale, "f").call(c, index)
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return __classPrivateFieldGet(this, _LRUCache_max, "f");
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return __classPrivateFieldGet(this, _LRUCache_maxSize, "f");
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return __classPrivateFieldGet(this, _LRUCache_calculatedSize, "f");
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return __classPrivateFieldGet(this, _LRUCache_size, "f");
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return __classPrivateFieldGet(this, _LRUCache_fetchMethod, "f");
  }
  get memoMethod() {
    return __classPrivateFieldGet(this, _LRUCache_memoMethod, "f");
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return __classPrivateFieldGet(this, _LRUCache_dispose, "f");
  }
  /**
   * {@link LRUCache.OptionsBase.onInsert} (read-only)
   */
  get onInsert() {
    return __classPrivateFieldGet(this, _LRUCache_onInsert, "f");
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return __classPrivateFieldGet(this, _LRUCache_disposeAfter, "f");
  }
  constructor(options) {
    _LRUCache_instances.add(this);
    // options that cannot be changed without disaster
    _LRUCache_max.set(this, void 0);
    _LRUCache_maxSize.set(this, void 0);
    _LRUCache_dispose.set(this, void 0);
    _LRUCache_onInsert.set(this, void 0);
    _LRUCache_disposeAfter.set(this, void 0);
    _LRUCache_fetchMethod.set(this, void 0);
    _LRUCache_memoMethod.set(this, void 0);
    _LRUCache_perf.set(this, void 0);
    // computed properties
    _LRUCache_size.set(this, void 0);
    _LRUCache_calculatedSize.set(this, void 0);
    _LRUCache_keyMap.set(this, void 0);
    _LRUCache_keyList.set(this, void 0);
    _LRUCache_valList.set(this, void 0);
    _LRUCache_next.set(this, void 0);
    _LRUCache_prev.set(this, void 0);
    _LRUCache_head.set(this, void 0);
    _LRUCache_tail.set(this, void 0);
    _LRUCache_free.set(this, void 0);
    _LRUCache_disposed.set(this, void 0);
    _LRUCache_sizes.set(this, void 0);
    _LRUCache_starts.set(this, void 0);
    _LRUCache_ttls.set(this, void 0);
    _LRUCache_hasDispose.set(this, void 0);
    _LRUCache_hasFetchMethod.set(this, void 0);
    _LRUCache_hasDisposeAfter.set(this, void 0);
    _LRUCache_hasOnInsert.set(this, void 0);
    // conditionally set private methods related to TTL
    _LRUCache_updateItemAge.set(this, () => {});
    _LRUCache_statusTTL.set(this, () => {});
    _LRUCache_setItemTTL.set(this, () => {});
    /* c8 ignore stop */
    _LRUCache_isStale.set(this, () => false);
    _LRUCache_removeItemSize.set(this, _i => {});
    _LRUCache_addItemSize.set(this, (_i, _s, _st) => {});
    _LRUCache_requireSize.set(this, (_k, _v, size, sizeCalculation) => {
      if (size || sizeCalculation) {
        throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
      }
      return 0;
    });
    /**
     * A String value that is used in the creation of the default string
     * description of an object. Called by the built-in method
     * `Object.prototype.toString`.
     */
    this[_c] = "LRUCache";
    const {
      max = 0,
      ttl,
      ttlResolution = 1,
      ttlAutopurge,
      updateAgeOnGet,
      updateAgeOnHas,
      allowStale,
      dispose,
      onInsert,
      disposeAfter,
      noDisposeOnSet,
      noUpdateTTL,
      maxSize = 0,
      maxEntrySize = 0,
      sizeCalculation,
      fetchMethod,
      memoMethod,
      noDeleteOnFetchRejection,
      noDeleteOnStaleGet,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      perf
    } = options;
    if (perf !== undefined) {
      if (typeof (perf === null || perf === void 0 ? void 0 : perf.now) !== "function") {
        throw new TypeError("perf option must have a now() method if specified");
      }
    }
    __classPrivateFieldSet(this, _LRUCache_perf, perf !== null && perf !== void 0 ? perf : defaultPerf, "f");
    if (max !== 0 && !isPosInt(max)) {
      throw new TypeError("max option must be a nonnegative integer");
    }
    const UintArray = max ? getUintArray(max) : Array;
    if (!UintArray) {
      throw new Error(`invalid max value: ${max}`);
    }
    __classPrivateFieldSet(this, _LRUCache_max, max, "f");
    __classPrivateFieldSet(this, _LRUCache_maxSize, maxSize, "f");
    this.maxEntrySize = maxEntrySize || __classPrivateFieldGet(this, _LRUCache_maxSize, "f");
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!__classPrivateFieldGet(this, _LRUCache_maxSize, "f") && !this.maxEntrySize) {
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      }
      if (typeof this.sizeCalculation !== "function") {
        throw new TypeError("sizeCalculation set to non-function");
      }
    }
    if (memoMethod !== undefined && typeof memoMethod !== "function") {
      throw new TypeError("memoMethod must be a function if defined");
    }
    __classPrivateFieldSet(this, _LRUCache_memoMethod, memoMethod, "f");
    if (fetchMethod !== undefined && typeof fetchMethod !== "function") {
      throw new TypeError("fetchMethod must be a function if specified");
    }
    __classPrivateFieldSet(this, _LRUCache_fetchMethod, fetchMethod, "f");
    __classPrivateFieldSet(this, _LRUCache_hasFetchMethod, !!fetchMethod, "f");
    __classPrivateFieldSet(this, _LRUCache_keyMap, new Map(), "f");
    __classPrivateFieldSet(this, _LRUCache_keyList, new Array(max).fill(undefined), "f");
    __classPrivateFieldSet(this, _LRUCache_valList, new Array(max).fill(undefined), "f");
    __classPrivateFieldSet(this, _LRUCache_next, new UintArray(max), "f");
    __classPrivateFieldSet(this, _LRUCache_prev, new UintArray(max), "f");
    __classPrivateFieldSet(this, _LRUCache_head, 0, "f");
    __classPrivateFieldSet(this, _LRUCache_tail, 0, "f");
    __classPrivateFieldSet(this, _LRUCache_free, Stack.create(max), "f");
    __classPrivateFieldSet(this, _LRUCache_size, 0, "f");
    __classPrivateFieldSet(this, _LRUCache_calculatedSize, 0, "f");
    if (typeof dispose === "function") {
      __classPrivateFieldSet(this, _LRUCache_dispose, dispose, "f");
    }
    if (typeof onInsert === "function") {
      __classPrivateFieldSet(this, _LRUCache_onInsert, onInsert, "f");
    }
    if (typeof disposeAfter === "function") {
      __classPrivateFieldSet(this, _LRUCache_disposeAfter, disposeAfter, "f");
      __classPrivateFieldSet(this, _LRUCache_disposed, [], "f");
    } else {
      __classPrivateFieldSet(this, _LRUCache_disposeAfter, undefined, "f");
      __classPrivateFieldSet(this, _LRUCache_disposed, undefined, "f");
    }
    __classPrivateFieldSet(this, _LRUCache_hasDispose, !!__classPrivateFieldGet(this, _LRUCache_dispose, "f"), "f");
    __classPrivateFieldSet(this, _LRUCache_hasOnInsert, !!__classPrivateFieldGet(this, _LRUCache_onInsert, "f"), "f");
    __classPrivateFieldSet(this, _LRUCache_hasDisposeAfter, !!__classPrivateFieldGet(this, _LRUCache_disposeAfter, "f"), "f");
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    // NB: maxEntrySize is set to maxSize if it's set
    if (this.maxEntrySize !== 0) {
      if (__classPrivateFieldGet(this, _LRUCache_maxSize, "f") !== 0) {
        if (!isPosInt(__classPrivateFieldGet(this, _LRUCache_maxSize, "f"))) {
          throw new TypeError("maxSize must be a positive integer if specified");
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      }
      __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_initializeSizeTracking).call(this);
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError("ttl must be a positive integer if specified");
      }
      __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_initializeTTLTracking).call(this);
    }
    // do not allow completely unbounded caches
    if (__classPrivateFieldGet(this, _LRUCache_max, "f") === 0 && this.ttl === 0 && __classPrivateFieldGet(this, _LRUCache_maxSize, "f") === 0) {
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    }
    if (!this.ttlAutopurge && !__classPrivateFieldGet(this, _LRUCache_max, "f") && !__classPrivateFieldGet(this, _LRUCache_maxSize, "f")) {
      const code = "LRU_CACHE_UNBOUNDED";
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = "TTL caching without ttlAutopurge, max, or maxSize can " + "result in unbounded memory consumption.";
        emitWarning(msg, "UnboundedCacheWarning", code, LRUCache);
      }
    }
  }
  /**
   * Return the number of ms left in the item's TTL. If item is not in cache,
   * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
   */
  getRemainingTTL(key) {
    return __classPrivateFieldGet(this, _LRUCache_keyMap, "f").has(key) ? Infinity : 0;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_indexes).call(this)) {
      if (__classPrivateFieldGet(this, _LRUCache_valList, "f")[i] !== undefined && __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i] !== undefined && !__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, __classPrivateFieldGet(this, _LRUCache_valList, "f")[i])) {
        yield [__classPrivateFieldGet(this, _LRUCache_keyList, "f")[i], __classPrivateFieldGet(this, _LRUCache_valList, "f")[i]];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_rindexes).call(this)) {
      if (__classPrivateFieldGet(this, _LRUCache_valList, "f")[i] !== undefined && __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i] !== undefined && !__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, __classPrivateFieldGet(this, _LRUCache_valList, "f")[i])) {
        yield [__classPrivateFieldGet(this, _LRUCache_keyList, "f")[i], __classPrivateFieldGet(this, _LRUCache_valList, "f")[i]];
      }
    }
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_indexes).call(this)) {
      const k = __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i];
      if (k !== undefined && !__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, __classPrivateFieldGet(this, _LRUCache_valList, "f")[i])) {
        yield k;
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_rindexes).call(this)) {
      const k = __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i];
      if (k !== undefined && !__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, __classPrivateFieldGet(this, _LRUCache_valList, "f")[i])) {
        yield k;
      }
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_indexes).call(this)) {
      const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      if (v !== undefined && !__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, __classPrivateFieldGet(this, _LRUCache_valList, "f")[i])) {
        yield __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_rindexes).call(this)) {
      const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      if (v !== undefined && !__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, __classPrivateFieldGet(this, _LRUCache_valList, "f")[i])) {
        yield __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      }
    }
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [(_LRUCache_max = new WeakMap(), _LRUCache_maxSize = new WeakMap(), _LRUCache_dispose = new WeakMap(), _LRUCache_onInsert = new WeakMap(), _LRUCache_disposeAfter = new WeakMap(), _LRUCache_fetchMethod = new WeakMap(), _LRUCache_memoMethod = new WeakMap(), _LRUCache_perf = new WeakMap(), _LRUCache_size = new WeakMap(), _LRUCache_calculatedSize = new WeakMap(), _LRUCache_keyMap = new WeakMap(), _LRUCache_keyList = new WeakMap(), _LRUCache_valList = new WeakMap(), _LRUCache_next = new WeakMap(), _LRUCache_prev = new WeakMap(), _LRUCache_head = new WeakMap(), _LRUCache_tail = new WeakMap(), _LRUCache_free = new WeakMap(), _LRUCache_disposed = new WeakMap(), _LRUCache_sizes = new WeakMap(), _LRUCache_starts = new WeakMap(), _LRUCache_ttls = new WeakMap(), _LRUCache_hasDispose = new WeakMap(), _LRUCache_hasFetchMethod = new WeakMap(), _LRUCache_hasDisposeAfter = new WeakMap(), _LRUCache_hasOnInsert = new WeakMap(), _LRUCache_updateItemAge = new WeakMap(), _LRUCache_statusTTL = new WeakMap(), _LRUCache_setItemTTL = new WeakMap(), _LRUCache_isStale = new WeakMap(), _LRUCache_removeItemSize = new WeakMap(), _LRUCache_addItemSize = new WeakMap(), _LRUCache_requireSize = new WeakMap(), _LRUCache_instances = new WeakSet(), _LRUCache_initializeTTLTracking = function _LRUCache_initializeTTLTracking() {
    const ttls = new ZeroArray(__classPrivateFieldGet(this, _LRUCache_max, "f"));
    const starts = new ZeroArray(__classPrivateFieldGet(this, _LRUCache_max, "f"));
    __classPrivateFieldSet(this, _LRUCache_ttls, ttls, "f");
    __classPrivateFieldSet(this, _LRUCache_starts, starts, "f");
    __classPrivateFieldSet(this, _LRUCache_setItemTTL, (index, ttl, start = __classPrivateFieldGet(this, _LRUCache_perf, "f").now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (__classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, index)) {
            __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_delete).call(this, __classPrivateFieldGet(this, _LRUCache_keyList, "f")[index], "expire");
          }
        }, ttl + 1);
        // unref() not supported on all platforms
        /* c8 ignore start */
        if (t.unref) {
          t.unref();
        }
        /* c8 ignore stop */
      }
    }, "f");
    __classPrivateFieldSet(this, _LRUCache_updateItemAge, index => {
      starts[index] = ttls[index] !== 0 ? __classPrivateFieldGet(this, _LRUCache_perf, "f").now() : 0;
    }, "f");
    __classPrivateFieldSet(this, _LRUCache_statusTTL, (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        /* c8 ignore next */
        if (!ttl || !start) return;
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    }, "f");
    // debounce calls to perf.now() to 1s so we're not hitting
    // that costly call repeatedly.
    let cachedNow = 0;
    const getNow = () => {
      const n = __classPrivateFieldGet(this, _LRUCache_perf, "f").now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => {
          cachedNow = 0;
        }, this.ttlResolution);
        // not available on all platforms
        /* c8 ignore start */
        if (t.unref) {
          t.unref();
        }
        /* c8 ignore stop */
      }
      return n;
    };
    this.getRemainingTTL = key => {
      const index = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(key);
      if (index === undefined) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (!ttl || !start) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    __classPrivateFieldSet(this, _LRUCache_isStale, index => {
      const s = starts[index];
      const t = ttls[index];
      return !!t && !!s && (cachedNow || getNow()) - s > t;
    }, "f");
  }, _LRUCache_initializeSizeTracking = function _LRUCache_initializeSizeTracking() {
    const sizes = new ZeroArray(__classPrivateFieldGet(this, _LRUCache_max, "f"));
    __classPrivateFieldSet(this, _LRUCache_calculatedSize, 0, "f");
    __classPrivateFieldSet(this, _LRUCache_sizes, sizes, "f");
    __classPrivateFieldSet(this, _LRUCache_removeItemSize, index => {
      __classPrivateFieldSet(this, _LRUCache_calculatedSize, __classPrivateFieldGet(this, _LRUCache_calculatedSize, "f") - sizes[index], "f");
      sizes[index] = 0;
    }, "f");
    __classPrivateFieldSet(this, _LRUCache_requireSize, (k, v, size, sizeCalculation) => {
      // provisionally accept background fetches.
      // actual value size will be checked when they return.
      if (__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). " + "When maxSize or maxEntrySize is used, sizeCalculation " + "or size must be set.");
        }
      }
      return size;
    }, "f");
    __classPrivateFieldSet(this, _LRUCache_addItemSize, (index, size, status) => {
      sizes[index] = size;
      if (__classPrivateFieldGet(this, _LRUCache_maxSize, "f")) {
        const maxSize = __classPrivateFieldGet(this, _LRUCache_maxSize, "f") - sizes[index];
        while (__classPrivateFieldGet(this, _LRUCache_calculatedSize, "f") > maxSize) {
          __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_evict).call(this, true);
        }
      }
      __classPrivateFieldSet(this, _LRUCache_calculatedSize, __classPrivateFieldGet(this, _LRUCache_calculatedSize, "f") + sizes[index], "f");
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = __classPrivateFieldGet(this, _LRUCache_calculatedSize, "f");
      }
    }, "f");
  }, _LRUCache_indexes = function* _LRUCache_indexes({
    allowStale = this.allowStale
  } = {}) {
    if (__classPrivateFieldGet(this, _LRUCache_size, "f")) {
      // biome-ignore lint/correctness/noConstantCondition: chill
      for (let i = __classPrivateFieldGet(this, _LRUCache_tail, "f"); true;) {
        if (!__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isValidIndex).call(this, i)) {
          break;
        }
        if (allowStale || !__classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, i)) {
          yield i;
        }
        if (i === __classPrivateFieldGet(this, _LRUCache_head, "f")) {
          break;
        } else {
          i = __classPrivateFieldGet(this, _LRUCache_prev, "f")[i];
        }
      }
    }
  }, _LRUCache_rindexes = function* _LRUCache_rindexes({
    allowStale = this.allowStale
  } = {}) {
    if (__classPrivateFieldGet(this, _LRUCache_size, "f")) {
      // biome-ignore lint/correctness/noConstantCondition: chill
      for (let i = __classPrivateFieldGet(this, _LRUCache_head, "f"); true;) {
        if (!__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isValidIndex).call(this, i)) {
          break;
        }
        if (allowStale || !__classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, i)) {
          yield i;
        }
        if (i === __classPrivateFieldGet(this, _LRUCache_tail, "f")) {
          break;
        } else {
          i = __classPrivateFieldGet(this, _LRUCache_next, "f")[i];
        }
      }
    }
  }, _LRUCache_isValidIndex = function _LRUCache_isValidIndex(index) {
    return index !== undefined && __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(__classPrivateFieldGet(this, _LRUCache_keyList, "f")[index]) === index;
  }, Symbol.iterator)]() {
    return this.entries();
  }
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
   */
  find(fn, getOptions = {}) {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_indexes).call(this)) {
      const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      const value = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v) ? v.__staleWhileFetching : v;
      if (value === undefined) continue;
      if (fn(value, __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i], this)) {
        return this.get(__classPrivateFieldGet(this, _LRUCache_keyList, "f")[i], getOptions);
      }
    }
    return undefined;
  }
  /**
   * Call the supplied function on each item in the cache, in order from most
   * recently used to least recently used.
   *
   * `fn` is called as `fn(value, key, cache)`.
   *
   * If `thisp` is provided, function will be called in the `this`-context of
   * the provided object, or the cache if no `thisp` object is provided.
   *
   * Does not update age or recenty of use, or iterate over stale values.
   */
  forEach(fn, thisp = this) {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_indexes).call(this)) {
      const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      const value = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v) ? v.__staleWhileFetching : v;
      if (value === undefined) continue;
      fn.call(thisp, value, __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(fn, thisp = this) {
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_rindexes).call(this)) {
      const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      const value = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v) ? v.__staleWhileFetching : v;
      if (value === undefined) continue;
      fn.call(thisp, value, __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let deleted = false;
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_rindexes).call(this, {
      allowStale: true
    })) {
      if (__classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, i)) {
        __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_delete).call(this, __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i], "expire");
        deleted = true;
      }
    }
    return deleted;
  }
  /**
   * Get the extended info about a given entry, to get its value, size, and
   * TTL info simultaneously. Returns `undefined` if the key is not present.
   *
   * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
   * serialization, the `start` value is always the current timestamp, and the
   * `ttl` is a calculated remaining time to live (negative if expired).
   *
   * Always returns stale values, if their info is found in the cache, so be
   * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
   * if relevant.
   */
  info(key) {
    const i = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(key);
    if (i === undefined) return undefined;
    const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
    /* c8 ignore start - this isn't tested for the info function,
     * but it's the same logic as found in other places. */
    const value = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v) ? v.__staleWhileFetching : v;
    if (value === undefined) return undefined;
    /* c8 ignore end */
    const entry = {
      value
    };
    if (__classPrivateFieldGet(this, _LRUCache_ttls, "f") && __classPrivateFieldGet(this, _LRUCache_starts, "f")) {
      const ttl = __classPrivateFieldGet(this, _LRUCache_ttls, "f")[i];
      const start = __classPrivateFieldGet(this, _LRUCache_starts, "f")[i];
      if (ttl && start) {
        const remain = ttl - (__classPrivateFieldGet(this, _LRUCache_perf, "f").now() - start);
        entry.ttl = remain;
        entry.start = Date.now();
      }
    }
    if (__classPrivateFieldGet(this, _LRUCache_sizes, "f")) {
      entry.size = __classPrivateFieldGet(this, _LRUCache_sizes, "f")[i];
    }
    return entry;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to {@link LRUCache#load}.
   *
   * The `start` fields are calculated relative to a portable `Date.now()`
   * timestamp, even if `performance.now()` is available.
   *
   * Stale entries are always included in the `dump`, even if
   * {@link LRUCache.OptionsBase.allowStale} is false.
   *
   * Note: this returns an actual array, not a generator, so it can be more
   * easily passed around.
   */
  dump() {
    const arr = [];
    for (const i of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_indexes).call(this, {
      allowStale: true
    })) {
      const key = __classPrivateFieldGet(this, _LRUCache_keyList, "f")[i];
      const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[i];
      const value = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v) ? v.__staleWhileFetching : v;
      if (value === undefined || key === undefined) continue;
      const entry = {
        value
      };
      if (__classPrivateFieldGet(this, _LRUCache_ttls, "f") && __classPrivateFieldGet(this, _LRUCache_starts, "f")) {
        entry.ttl = __classPrivateFieldGet(this, _LRUCache_ttls, "f")[i];
        // always dump the start relative to a portable timestamp
        // it's ok for this to be a bit slow, it's a rare operation.
        const age = __classPrivateFieldGet(this, _LRUCache_perf, "f").now() - __classPrivateFieldGet(this, _LRUCache_starts, "f")[i];
        entry.start = Math.floor(Date.now() - age);
      }
      if (__classPrivateFieldGet(this, _LRUCache_sizes, "f")) {
        entry.size = __classPrivateFieldGet(this, _LRUCache_sizes, "f")[i];
      }
      arr.unshift([key, entry]);
    }
    return arr;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   *
   * The shape of the resulting cache may be different if the same options are
   * not used in both caches.
   *
   * The `start` fields are assumed to be calculated relative to a portable
   * `Date.now()` timestamp, even if `performance.now()` is available.
   */
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        // entry.start is a portable timestamp, but we may be using
        // node's performance.now(), so calculate the offset, so that
        // we get the intended remaining TTL, no matter how long it's
        // been on ice.
        //
        // it's ok for this to be a bit slow, it's a rare operation.
        const age = Date.now() - entry.start;
        entry.start = __classPrivateFieldGet(this, _LRUCache_perf, "f").now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  /**
   * Add a value to the cache.
   *
   * Note: if `undefined` is specified as a value, this is an alias for
   * {@link LRUCache#delete}
   *
   * Fields on the {@link LRUCache.SetOptions} options param will override
   * their corresponding values in the constructor options for the scope
   * of this single `set()` operation.
   *
   * If `start` is provided, then that will set the effective start
   * time for the TTL calculation. Note that this must be a previous
   * value of `performance.now()` if supported, or a previous value of
   * `Date.now()` if not.
   *
   * Options object may also include `size`, which will prevent
   * calling the `sizeCalculation` function and just use the specified
   * number if it is a positive integer, and `noDisposeOnSet` which
   * will prevent calling a `dispose` function in the case of
   * overwrites.
   *
   * If the `size` (or return value of `sizeCalculation`) for a given
   * entry is greater than `maxEntrySize`, then the item will not be
   * added to the cache.
   *
   * Will update the recency of the entry.
   *
   * If the value is `undefined`, then this is an alias for
   * `cache.delete(key)`. `undefined` is never stored in the cache.
   */
  set(k, v, setOptions = {}) {
    var _a, _d, _e, _f, _g, _h, _j;
    var _l;
    if (v === undefined) {
      this.delete(k);
      return this;
    }
    const {
      ttl = this.ttl,
      start,
      noDisposeOnSet = this.noDisposeOnSet,
      sizeCalculation = this.sizeCalculation,
      status
    } = setOptions;
    let {
      noUpdateTTL = this.noUpdateTTL
    } = setOptions;
    const size = __classPrivateFieldGet(this, _LRUCache_requireSize, "f").call(this, k, v, setOptions.size || 0, sizeCalculation);
    // if the item doesn't fit, don't do anything
    // NB: maxEntrySize set to maxSize by default
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = "miss";
        status.maxEntrySizeExceeded = true;
      }
      // have to delete, in case something is there already.
      __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_delete).call(this, k, "set");
      return this;
    }
    let index = __classPrivateFieldGet(this, _LRUCache_size, "f") === 0 ? undefined : __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(k);
    if (index === undefined) {
      // addition
      index = __classPrivateFieldGet(this, _LRUCache_size, "f") === 0 ? __classPrivateFieldGet(this, _LRUCache_tail, "f") : __classPrivateFieldGet(this, _LRUCache_free, "f").length !== 0 ? __classPrivateFieldGet(this, _LRUCache_free, "f").pop() : __classPrivateFieldGet(this, _LRUCache_size, "f") === __classPrivateFieldGet(this, _LRUCache_max, "f") ? __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_evict).call(this, false) : __classPrivateFieldGet(this, _LRUCache_size, "f");
      __classPrivateFieldGet(this, _LRUCache_keyList, "f")[index] = k;
      __classPrivateFieldGet(this, _LRUCache_valList, "f")[index] = v;
      __classPrivateFieldGet(this, _LRUCache_keyMap, "f").set(k, index);
      __classPrivateFieldGet(this, _LRUCache_next, "f")[__classPrivateFieldGet(this, _LRUCache_tail, "f")] = index;
      __classPrivateFieldGet(this, _LRUCache_prev, "f")[index] = __classPrivateFieldGet(this, _LRUCache_tail, "f");
      __classPrivateFieldSet(this, _LRUCache_tail, index, "f");
      __classPrivateFieldSet(this, _LRUCache_size, (_l = __classPrivateFieldGet(this, _LRUCache_size, "f"), _l++, _l), "f");
      __classPrivateFieldGet(this, _LRUCache_addItemSize, "f").call(this, index, size, status);
      if (status) status.set = "add";
      noUpdateTTL = false;
      if (__classPrivateFieldGet(this, _LRUCache_hasOnInsert, "f")) {
        (_a = __classPrivateFieldGet(this, _LRUCache_onInsert, "f")) === null || _a === void 0 ? void 0 : _a.call(this, v, k, "add");
      }
    } else {
      // update
      __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_moveToTail).call(this, index);
      const oldVal = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
      if (v !== oldVal) {
        if (__classPrivateFieldGet(this, _LRUCache_hasFetchMethod, "f") && __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, oldVal)) {
          oldVal.__abortController.abort(new Error("replaced"));
          const {
            __staleWhileFetching: s
          } = oldVal;
          if (s !== undefined && !noDisposeOnSet) {
            if (__classPrivateFieldGet(this, _LRUCache_hasDispose, "f")) {
              (_d = __classPrivateFieldGet(this, _LRUCache_dispose, "f")) === null || _d === void 0 ? void 0 : _d.call(this, s, k, "set");
            }
            if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f")) {
              (_e = __classPrivateFieldGet(this, _LRUCache_disposed, "f")) === null || _e === void 0 ? void 0 : _e.push([s, k, "set"]);
            }
          }
        } else if (!noDisposeOnSet) {
          if (__classPrivateFieldGet(this, _LRUCache_hasDispose, "f")) {
            (_f = __classPrivateFieldGet(this, _LRUCache_dispose, "f")) === null || _f === void 0 ? void 0 : _f.call(this, oldVal, k, "set");
          }
          if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f")) {
            (_g = __classPrivateFieldGet(this, _LRUCache_disposed, "f")) === null || _g === void 0 ? void 0 : _g.push([oldVal, k, "set"]);
          }
        }
        __classPrivateFieldGet(this, _LRUCache_removeItemSize, "f").call(this, index);
        __classPrivateFieldGet(this, _LRUCache_addItemSize, "f").call(this, index, size, status);
        __classPrivateFieldGet(this, _LRUCache_valList, "f")[index] = v;
        if (status) {
          status.set = "replace";
          const oldValue = oldVal && __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== undefined) status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = "update";
      }
      if (__classPrivateFieldGet(this, _LRUCache_hasOnInsert, "f")) {
        (_h = this.onInsert) === null || _h === void 0 ? void 0 : _h.call(this, v, k, v === oldVal ? "update" : "replace");
      }
    }
    if (ttl !== 0 && !__classPrivateFieldGet(this, _LRUCache_ttls, "f")) {
      __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_initializeTTLTracking).call(this);
    }
    if (__classPrivateFieldGet(this, _LRUCache_ttls, "f")) {
      if (!noUpdateTTL) {
        __classPrivateFieldGet(this, _LRUCache_setItemTTL, "f").call(this, index, ttl, start);
      }
      if (status) __classPrivateFieldGet(this, _LRUCache_statusTTL, "f").call(this, status, index);
    }
    if (!noDisposeOnSet && __classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f") && __classPrivateFieldGet(this, _LRUCache_disposed, "f")) {
      const dt = __classPrivateFieldGet(this, _LRUCache_disposed, "f");
      let task;
      while (task = dt === null || dt === void 0 ? void 0 : dt.shift()) {
        (_j = __classPrivateFieldGet(this, _LRUCache_disposeAfter, "f")) === null || _j === void 0 ? void 0 : _j.call(this, ...task);
      }
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    var _a;
    try {
      while (__classPrivateFieldGet(this, _LRUCache_size, "f")) {
        const val = __classPrivateFieldGet(this, _LRUCache_valList, "f")[__classPrivateFieldGet(this, _LRUCache_head, "f")];
        __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_evict).call(this, true);
        if (__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== undefined) {
          return val;
        }
      }
      return undefined;
    } finally {
      if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f") && __classPrivateFieldGet(this, _LRUCache_disposed, "f")) {
        const dt = __classPrivateFieldGet(this, _LRUCache_disposed, "f");
        let task;
        while (task = dt === null || dt === void 0 ? void 0 : dt.shift()) {
          (_a = __classPrivateFieldGet(this, _LRUCache_disposeAfter, "f")) === null || _a === void 0 ? void 0 : _a.call(this, ...task);
        }
      }
    }
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Check if a key is in the cache, without updating the recency of
   * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
   * to `true` in either the options or the constructor.
   *
   * Will return `false` if the item is stale, even though it is technically in
   * the cache. The difference can be determined (if it matters) by using a
   * `status` argument, and inspecting the `has` field.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(k, hasOptions = {}) {
    const {
      updateAgeOnHas = this.updateAgeOnHas,
      status
    } = hasOptions;
    const index = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(k);
    if (index !== undefined) {
      const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
      if (__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v) && v.__staleWhileFetching === undefined) {
        return false;
      }
      if (!__classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, index)) {
        if (updateAgeOnHas) {
          __classPrivateFieldGet(this, _LRUCache_updateItemAge, "f").call(this, index);
        }
        if (status) {
          status.has = "hit";
          __classPrivateFieldGet(this, _LRUCache_statusTTL, "f").call(this, status, index);
        }
        return true;
      } else if (status) {
        status.has = "stale";
        __classPrivateFieldGet(this, _LRUCache_statusTTL, "f").call(this, status, index);
      }
    } else if (status) {
      status.has = "miss";
    }
    return false;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(k, peekOptions = {}) {
    const {
      allowStale = this.allowStale
    } = peekOptions;
    const index = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(k);
    if (index === undefined || !allowStale && __classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, index)) {
      return;
    }
    const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
    // either stale and allowed, or forcing a refresh of non-stale value
    return __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v) ? v.__staleWhileFetching : v;
  }
  fetch(k_1) {
    return lru_cache_awaiter(this, arguments, void 0, function* (k, fetchOptions = {}) {
      const {
        // get options
        allowStale = this.allowStale,
        updateAgeOnGet = this.updateAgeOnGet,
        noDeleteOnStaleGet = this.noDeleteOnStaleGet,
        // set options
        ttl = this.ttl,
        noDisposeOnSet = this.noDisposeOnSet,
        size = 0,
        sizeCalculation = this.sizeCalculation,
        noUpdateTTL = this.noUpdateTTL,
        // fetch exclusive options
        noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
        allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
        ignoreFetchAbort = this.ignoreFetchAbort,
        allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
        context,
        forceRefresh = false,
        status,
        signal
      } = fetchOptions;
      if (!__classPrivateFieldGet(this, _LRUCache_hasFetchMethod, "f")) {
        if (status) status.fetch = "get";
        return this.get(k, {
          allowStale,
          updateAgeOnGet,
          noDeleteOnStaleGet,
          status
        });
      }
      const options = {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        ttl,
        noDisposeOnSet,
        size,
        sizeCalculation,
        noUpdateTTL,
        noDeleteOnFetchRejection,
        allowStaleOnFetchRejection,
        allowStaleOnFetchAbort,
        ignoreFetchAbort,
        status,
        signal
      };
      const index = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(k);
      if (index === undefined) {
        if (status) status.fetch = "miss";
        const p = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_backgroundFetch).call(this, k, index, options, context);
        return p.__returned = p;
      } else {
        // in cache, maybe already fetching
        const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
        if (__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v)) {
          const stale = allowStale && v.__staleWhileFetching !== undefined;
          if (status) {
            status.fetch = "inflight";
            if (stale) status.returnedStale = true;
          }
          return stale ? v.__staleWhileFetching : v.__returned = v;
        }
        // if we force a refresh, that means do NOT serve the cached value,
        // unless we are already in the process of refreshing the cache.
        const isStale = __classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, index);
        if (!forceRefresh && !isStale) {
          if (status) status.fetch = "hit";
          __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_moveToTail).call(this, index);
          if (updateAgeOnGet) {
            __classPrivateFieldGet(this, _LRUCache_updateItemAge, "f").call(this, index);
          }
          if (status) __classPrivateFieldGet(this, _LRUCache_statusTTL, "f").call(this, status, index);
          return v;
        }
        // ok, it is stale or a forced refresh, and not already fetching.
        // refresh the cache.
        const p = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_backgroundFetch).call(this, k, index, options, context);
        const hasStale = p.__staleWhileFetching !== undefined;
        const staleVal = hasStale && allowStale;
        if (status) {
          status.fetch = isStale ? "stale" : "refresh";
          if (staleVal && isStale) status.returnedStale = true;
        }
        return staleVal ? p.__staleWhileFetching : p.__returned = p;
      }
    });
  }
  forceFetch(k_1) {
    return lru_cache_awaiter(this, arguments, void 0, function* (k, fetchOptions = {}) {
      const v = yield this.fetch(k, fetchOptions);
      if (v === undefined) throw new Error("fetch() returned undefined");
      return v;
    });
  }
  memo(k, memoOptions = {}) {
    const memoMethod = __classPrivateFieldGet(this, _LRUCache_memoMethod, "f");
    if (!memoMethod) {
      throw new Error("no memoMethod provided to constructor");
    }
    const {
        context,
        forceRefresh
      } = memoOptions,
      options = __rest(memoOptions, ["context", "forceRefresh"]);
    const v = this.get(k, options);
    if (!forceRefresh && v !== undefined) return v;
    const vv = memoMethod(k, v, {
      options,
      context
    });
    this.set(k, vv, options);
    return vv;
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(k, getOptions = {}) {
    const {
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      status
    } = getOptions;
    const index = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(k);
    if (index !== undefined) {
      const value = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
      const fetching = __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, value);
      if (status) __classPrivateFieldGet(this, _LRUCache_statusTTL, "f").call(this, status, index);
      if (__classPrivateFieldGet(this, _LRUCache_isStale, "f").call(this, index)) {
        if (status) status.get = "stale";
        // delete only if not an in-flight background fetch
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_delete).call(this, k, "expire");
          }
          if (status && allowStale) status.returnedStale = true;
          return allowStale ? value : undefined;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== undefined) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : undefined;
        }
      } else {
        if (status) status.get = "hit";
        // if we're currently fetching it, we don't actually have it yet
        // it's not stale, which means this isn't a staleWhileRefetching.
        // If it's not stale, and fetching, AND has a __staleWhileFetching
        // value, then that means the user fetched with {forceRefresh:true},
        // so it's safe to return that value.
        if (fetching) {
          return value.__staleWhileFetching;
        }
        __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_moveToTail).call(this, index);
        if (updateAgeOnGet) {
          __classPrivateFieldGet(this, _LRUCache_updateItemAge, "f").call(this, index);
        }
        return value;
      }
    } else if (status) {
      status.get = "miss";
    }
    return undefined;
  }
  /**
   * Deletes a key out of the cache.
   *
   * Returns true if the key was deleted, false otherwise.
   */
  delete(k) {
    return __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_delete).call(this, k, "delete");
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    return __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_clear).call(this, "delete");
  }
}
_c = Symbol.toStringTag, _LRUCache_evict = function _LRUCache_evict(free) {
  var _a, _d;
  var _e;
  const head = __classPrivateFieldGet(this, _LRUCache_head, "f");
  const k = __classPrivateFieldGet(this, _LRUCache_keyList, "f")[head];
  const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[head];
  if (__classPrivateFieldGet(this, _LRUCache_hasFetchMethod, "f") && __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v)) {
    v.__abortController.abort(new Error("evicted"));
  } else if (__classPrivateFieldGet(this, _LRUCache_hasDispose, "f") || __classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f")) {
    if (__classPrivateFieldGet(this, _LRUCache_hasDispose, "f")) {
      (_a = __classPrivateFieldGet(this, _LRUCache_dispose, "f")) === null || _a === void 0 ? void 0 : _a.call(this, v, k, "evict");
    }
    if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f")) {
      (_d = __classPrivateFieldGet(this, _LRUCache_disposed, "f")) === null || _d === void 0 ? void 0 : _d.push([v, k, "evict"]);
    }
  }
  __classPrivateFieldGet(this, _LRUCache_removeItemSize, "f").call(this, head);
  // if we aren't about to use the index, then null these out
  if (free) {
    __classPrivateFieldGet(this, _LRUCache_keyList, "f")[head] = undefined;
    __classPrivateFieldGet(this, _LRUCache_valList, "f")[head] = undefined;
    __classPrivateFieldGet(this, _LRUCache_free, "f").push(head);
  }
  if (__classPrivateFieldGet(this, _LRUCache_size, "f") === 1) {
    __classPrivateFieldSet(this, _LRUCache_head, __classPrivateFieldSet(this, _LRUCache_tail, 0, "f"), "f");
    __classPrivateFieldGet(this, _LRUCache_free, "f").length = 0;
  } else {
    __classPrivateFieldSet(this, _LRUCache_head, __classPrivateFieldGet(this, _LRUCache_next, "f")[head], "f");
  }
  __classPrivateFieldGet(this, _LRUCache_keyMap, "f").delete(k);
  __classPrivateFieldSet(this, _LRUCache_size, (_e = __classPrivateFieldGet(this, _LRUCache_size, "f"), _e--, _e), "f");
  return head;
}, _LRUCache_backgroundFetch = function _LRUCache_backgroundFetch(k, index, options, context) {
  const v = index === undefined ? undefined : __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
  if (__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v)) {
    return v;
  }
  const ac = new AC();
  const {
    signal
  } = options;
  // when/if our AC signals, then stop listening to theirs.
  signal === null || signal === void 0 ? void 0 : signal.addEventListener("abort", () => ac.abort(signal.reason), {
    signal: ac.signal
  });
  const fetchOpts = {
    signal: ac.signal,
    options,
    context
  };
  const cb = (v, updateCache = false) => {
    const {
      aborted
    } = ac.signal;
    const ignoreAbort = options.ignoreFetchAbort && v !== undefined;
    if (options.status) {
      if (aborted && !updateCache) {
        options.status.fetchAborted = true;
        options.status.fetchError = ac.signal.reason;
        if (ignoreAbort) options.status.fetchAbortIgnored = true;
      } else {
        options.status.fetchResolved = true;
      }
    }
    if (aborted && !ignoreAbort && !updateCache) {
      return fetchFail(ac.signal.reason);
    }
    // either we didn't abort, and are still here, or we did, and ignored
    const bf = p;
    // if nothing else has been written there but we're set to update the
    // cache and ignore the abort, or if it's still pending on this specific
    // background request, then write it to the cache.
    const vl = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
    if (vl === p || ignoreAbort && updateCache && vl === undefined) {
      if (v === undefined) {
        if (bf.__staleWhileFetching !== undefined) {
          __classPrivateFieldGet(this, _LRUCache_valList, "f")[index] = bf.__staleWhileFetching;
        } else {
          __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_delete).call(this, k, "fetch");
        }
      } else {
        if (options.status) options.status.fetchUpdated = true;
        this.set(k, v, fetchOpts.options);
      }
    }
    return v;
  };
  const eb = er => {
    if (options.status) {
      options.status.fetchRejected = true;
      options.status.fetchError = er;
    }
    return fetchFail(er);
  };
  const fetchFail = er => {
    const {
      aborted
    } = ac.signal;
    const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
    const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
    const noDelete = allowStale || options.noDeleteOnFetchRejection;
    const bf = p;
    if (__classPrivateFieldGet(this, _LRUCache_valList, "f")[index] === p) {
      // if we allow stale on fetch rejections, then we need to ensure that
      // the stale value is not removed from the cache when the fetch fails.
      const del = !noDelete || bf.__staleWhileFetching === undefined;
      if (del) {
        __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_delete).call(this, k, "fetch");
      } else if (!allowStaleAborted) {
        // still replace the *promise* with the stale value,
        // since we are done with the promise at this point.
        // leave it untouched if we're still waiting for an
        // aborted background fetch that hasn't yet returned.
        __classPrivateFieldGet(this, _LRUCache_valList, "f")[index] = bf.__staleWhileFetching;
      }
    }
    if (allowStale) {
      if (options.status && bf.__staleWhileFetching !== undefined) {
        options.status.returnedStale = true;
      }
      return bf.__staleWhileFetching;
    } else if (bf.__returned === bf) {
      throw er;
    }
    return undefined;
  };
  const pcall = (res, rej) => {
    var _a;
    const fmp = (_a = __classPrivateFieldGet(this, _LRUCache_fetchMethod, "f")) === null || _a === void 0 ? void 0 : _a.call(this, k, v, fetchOpts);
    if (fmp && fmp instanceof Promise) {
      fmp.then(v => res(v === undefined ? undefined : v), rej);
    }
    // ignored, we go until we finish, regardless.
    // defer check until we are actually aborting,
    // so fetchMethod can override.
    ac.signal.addEventListener("abort", () => {
      if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
        res(undefined);
        // when it eventually resolves, update the cache.
        if (options.allowStaleOnFetchAbort) {
          res = v => cb(v, true);
        }
      }
    });
  };
  if (options.status) options.status.fetchDispatched = true;
  const p = new Promise(pcall).then(cb, eb);
  const bf = Object.assign(p, {
    __abortController: ac,
    __staleWhileFetching: v,
    __returned: undefined
  });
  if (index === undefined) {
    // internal, don't expose status.
    this.set(k, bf, Object.assign(Object.assign({}, fetchOpts.options), {
      status: undefined
    }));
    index = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(k);
  } else {
    __classPrivateFieldGet(this, _LRUCache_valList, "f")[index] = bf;
  }
  return bf;
}, _LRUCache_isBackgroundFetch = function _LRUCache_isBackgroundFetch(p) {
  if (!__classPrivateFieldGet(this, _LRUCache_hasFetchMethod, "f")) return false;
  const b = p;
  return !!b && b instanceof Promise &&
  // biome-ignore lint/suspicious/noPrototypeBuiltins: alternative not supported in all envs
  b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
}, _LRUCache_connect = function _LRUCache_connect(p, n) {
  __classPrivateFieldGet(this, _LRUCache_prev, "f")[n] = p;
  __classPrivateFieldGet(this, _LRUCache_next, "f")[p] = n;
}, _LRUCache_moveToTail = function _LRUCache_moveToTail(index) {
  // if tail already, nothing to do
  // if head, move head to next[index]
  // else
  //   move next[prev[index]] to next[index] (head has no prev)
  //   move prev[next[index]] to prev[index]
  // prev[index] = tail
  // next[tail] = index
  // tail = index
  if (index !== __classPrivateFieldGet(this, _LRUCache_tail, "f")) {
    if (index === __classPrivateFieldGet(this, _LRUCache_head, "f")) {
      __classPrivateFieldSet(this, _LRUCache_head, __classPrivateFieldGet(this, _LRUCache_next, "f")[index], "f");
    } else {
      __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_connect).call(this, __classPrivateFieldGet(this, _LRUCache_prev, "f")[index], __classPrivateFieldGet(this, _LRUCache_next, "f")[index]);
    }
    __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_connect).call(this, __classPrivateFieldGet(this, _LRUCache_tail, "f"), index);
    __classPrivateFieldSet(this, _LRUCache_tail, index, "f");
  }
}, _LRUCache_delete = function _LRUCache_delete(k, reason) {
  var _a, _d, _e, _f;
  var _g;
  let deleted = false;
  if (__classPrivateFieldGet(this, _LRUCache_size, "f") !== 0) {
    const index = __classPrivateFieldGet(this, _LRUCache_keyMap, "f").get(k);
    if (index !== undefined) {
      deleted = true;
      if (__classPrivateFieldGet(this, _LRUCache_size, "f") === 1) {
        __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_clear).call(this, reason);
      } else {
        __classPrivateFieldGet(this, _LRUCache_removeItemSize, "f").call(this, index);
        const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
        if (__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v)) {
          v.__abortController.abort(new Error("deleted"));
        } else if (__classPrivateFieldGet(this, _LRUCache_hasDispose, "f") || __classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f")) {
          if (__classPrivateFieldGet(this, _LRUCache_hasDispose, "f")) {
            (_a = __classPrivateFieldGet(this, _LRUCache_dispose, "f")) === null || _a === void 0 ? void 0 : _a.call(this, v, k, reason);
          }
          if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f")) {
            (_d = __classPrivateFieldGet(this, _LRUCache_disposed, "f")) === null || _d === void 0 ? void 0 : _d.push([v, k, reason]);
          }
        }
        __classPrivateFieldGet(this, _LRUCache_keyMap, "f").delete(k);
        __classPrivateFieldGet(this, _LRUCache_keyList, "f")[index] = undefined;
        __classPrivateFieldGet(this, _LRUCache_valList, "f")[index] = undefined;
        if (index === __classPrivateFieldGet(this, _LRUCache_tail, "f")) {
          __classPrivateFieldSet(this, _LRUCache_tail, __classPrivateFieldGet(this, _LRUCache_prev, "f")[index], "f");
        } else if (index === __classPrivateFieldGet(this, _LRUCache_head, "f")) {
          __classPrivateFieldSet(this, _LRUCache_head, __classPrivateFieldGet(this, _LRUCache_next, "f")[index], "f");
        } else {
          const pi = __classPrivateFieldGet(this, _LRUCache_prev, "f")[index];
          __classPrivateFieldGet(this, _LRUCache_next, "f")[pi] = __classPrivateFieldGet(this, _LRUCache_next, "f")[index];
          const ni = __classPrivateFieldGet(this, _LRUCache_next, "f")[index];
          __classPrivateFieldGet(this, _LRUCache_prev, "f")[ni] = __classPrivateFieldGet(this, _LRUCache_prev, "f")[index];
        }
        __classPrivateFieldSet(this, _LRUCache_size, (_g = __classPrivateFieldGet(this, _LRUCache_size, "f"), _g--, _g), "f");
        __classPrivateFieldGet(this, _LRUCache_free, "f").push(index);
      }
    }
  }
  if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f") && ((_e = __classPrivateFieldGet(this, _LRUCache_disposed, "f")) === null || _e === void 0 ? void 0 : _e.length)) {
    const dt = __classPrivateFieldGet(this, _LRUCache_disposed, "f");
    let task;
    while (task = dt === null || dt === void 0 ? void 0 : dt.shift()) {
      (_f = __classPrivateFieldGet(this, _LRUCache_disposeAfter, "f")) === null || _f === void 0 ? void 0 : _f.call(this, ...task);
    }
  }
  return deleted;
}, _LRUCache_clear = function _LRUCache_clear(reason) {
  var _a, _d, _e;
  for (const index of __classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_rindexes).call(this, {
    allowStale: true
  })) {
    const v = __classPrivateFieldGet(this, _LRUCache_valList, "f")[index];
    if (__classPrivateFieldGet(this, _LRUCache_instances, "m", _LRUCache_isBackgroundFetch).call(this, v)) {
      v.__abortController.abort(new Error("deleted"));
    } else {
      const k = __classPrivateFieldGet(this, _LRUCache_keyList, "f")[index];
      if (__classPrivateFieldGet(this, _LRUCache_hasDispose, "f")) {
        (_a = __classPrivateFieldGet(this, _LRUCache_dispose, "f")) === null || _a === void 0 ? void 0 : _a.call(this, v, k, reason);
      }
      if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f")) {
        (_d = __classPrivateFieldGet(this, _LRUCache_disposed, "f")) === null || _d === void 0 ? void 0 : _d.push([v, k, reason]);
      }
    }
  }
  __classPrivateFieldGet(this, _LRUCache_keyMap, "f").clear();
  __classPrivateFieldGet(this, _LRUCache_valList, "f").fill(undefined);
  __classPrivateFieldGet(this, _LRUCache_keyList, "f").fill(undefined);
  if (__classPrivateFieldGet(this, _LRUCache_ttls, "f") && __classPrivateFieldGet(this, _LRUCache_starts, "f")) {
    __classPrivateFieldGet(this, _LRUCache_ttls, "f").fill(0);
    __classPrivateFieldGet(this, _LRUCache_starts, "f").fill(0);
  }
  if (__classPrivateFieldGet(this, _LRUCache_sizes, "f")) {
    __classPrivateFieldGet(this, _LRUCache_sizes, "f").fill(0);
  }
  __classPrivateFieldSet(this, _LRUCache_head, 0, "f");
  __classPrivateFieldSet(this, _LRUCache_tail, 0, "f");
  __classPrivateFieldGet(this, _LRUCache_free, "f").length = 0;
  __classPrivateFieldSet(this, _LRUCache_calculatedSize, 0, "f");
  __classPrivateFieldSet(this, _LRUCache_size, 0, "f");
  if (__classPrivateFieldGet(this, _LRUCache_hasDisposeAfter, "f") && __classPrivateFieldGet(this, _LRUCache_disposed, "f")) {
    const dt = __classPrivateFieldGet(this, _LRUCache_disposed, "f");
    let task;
    while (task = dt === null || dt === void 0 ? void 0 : dt.shift()) {
      (_e = __classPrivateFieldGet(this, _LRUCache_disposeAfter, "f")) === null || _e === void 0 ? void 0 : _e.call(this, ...task);
    }
  }
};
//# sourceMappingURL=lru-cache.js.map
; // ../utils/dist/find-executable.js

const isWindows = "darwin" === "win32";
const runDownPathCache = new LRUCache({
  max: 512
});
/**
 * stat a file but don't throw if it doesn't exist
 *
 * @param  {string} file The path to a file
 * @return {Stats}       The stats structure
 *
 * @private
 */
function statSyncNoException(file) {
  try {
    return external_node_fs_.statSync(file);
  } catch (_a) {
    return null;
  }
}
/**
 * Search PATH to see if a file exists in any of the path folders.
 *
 * @param  {string} exe The file to search for
 * @return {string}     A fully qualified path, or the original path if nothing
 *                      is found
 *
 * @private
 */
function runDownPath(exe, pathMustMatch) {
  // NB: Windows won't search PATH looking for executables in spawn like
  // Posix does
  // Files with any directory path don't get this applied
  if (exe.match(/[\\/]/)) {
    return exe;
  }
  const cacheKey = pathMustMatch ? `${exe}\0${pathMustMatch.source}\0${pathMustMatch.flags}` : exe;
  const cached = runDownPathCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }
  const target = external_node_path_.join(".", exe);
  if (statSyncNoException(target)) {
    // XXX: Some very Odd programs decide to use args[0] as a parameter
    // to determine what to do, and also symlink themselves, so we can't
    // use realpathSync here like we used to
    runDownPathCache.set(cacheKey, target);
    return target;
  }
  const haystack = process.env.PATH.split(isWindows ? ";" : ":");
  for (const p of haystack) {
    const needle = external_node_path_.join(p, exe);
    if (statSyncNoException(needle) && (!pathMustMatch || pathMustMatch.test(needle))) {
      // NB: Same deal as above
      runDownPathCache.set(cacheKey, needle);
      return needle;
    }
  }
  runDownPathCache.set(cacheKey, exe);
  return exe;
}
/**
 * Finds the actual executable and parameters to run on Windows. This method
 * mimics the POSIX behavior of being able to run scripts as executables by
 * replacing the passed-in executable with the script runner, for PowerShell,
 * CMD, and node scripts.
 *
 * This method also does the work of running down PATH, which spawn on Windows
 * also doesn't do, unlike on POSIX.
 *
 * @param  {string} exe           The executable to run
 * @param  {string[]} args   The arguments to run
 *
 * @return {Object}               The cmd and args to run
 * @property {string} cmd         The command to pass to spawn
 * @property {string[]} args The arguments to pass to spawn
 */
function findActualExecutable(exe, args, pathMustMatch) {
  // POSIX can just execute scripts directly, no need for silly goosery
  if (true) {
    return {
      cmd: runDownPath(exe),
      args: args
    };
  }
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // Dunno lol
  // removed by dead control flow
  {}
}
//# sourceMappingURL=find-executable.js.map
; // ../utils/dist/writable-iterable.js
var writable_iterable_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class WriteIterableClosedError extends Error {
  constructor(message) {
    super(message);
    this.name = "WriteIterableClosedError";
  }
}
class MapWritable {
  constructor(writable, map) {
    this.writable = writable;
    this.map = map;
    this.closed = false;
  }
  write(item) {
    return writable_iterable_awaiter(this, void 0, void 0, function* () {
      if (this.closed) {
        throw new WriteIterableClosedError("WritableIterable is closed");
      }
      const mapped = this.map(item);
      yield this.writable.write(mapped);
    });
  }
  close() {
    if (this.closed) return;
    this.closed = true;
  }
}
/**
 * Create a new WritableIterable that allows writing values, throwing errors, and closing.
 *
 * Example usage:
 * ```typescript
 * const iterable = createWritableIterable<string>();
 *
 * // Writer side
 * await iterable.write("hello");
 * await iterable.write("world");
 * iterable.throw(new Error("Something went wrong")); // or iterable.close() for normal completion
 *
 * // Reader side
 * try {
 *   for await (const value of iterable) {
 *     console.log(value); // prints "hello", "world"
 *   }
 * } catch (error) {
 *   console.error(error); // catches the thrown error
 * }
 * ```
 */
function createWritableIterable() {
  // Queues to manage async read/write operations
  const readQueue = [];
  const writeQueue = [];
  // State management
  let closed = false;
  let error;
  // Track write promises for proper backpressure
  let nextResolve = () => {};
  let nextReject = () => {};
  const createNextPromise = () => {
    const promise = new Promise((resolve, reject) => {
      nextResolve = resolve;
      nextReject = reject;
    });
    promise.catch(() => {}); // Prevent unhandled rejection
    return promise;
  };
  let nextPromise = createNextPromise();
  // Drain the read queue when closing or throwing
  function drainReads(result, err) {
    while (readQueue.length > 0) {
      const reader = readQueue.shift();
      if (err) {
        reader.reject(err);
      } else {
        reader.resolve(result);
      }
    }
  }
  // Reject all pending writes
  function rejectPendingWrites(err) {
    writeQueue.length = 0;
    nextReject(err);
    // Create a new rejected promise for future writes
    nextPromise = Promise.reject(err);
    nextPromise.catch(() => {}); // Prevent unhandled rejection
  }
  return {
    write(value) {
      return writable_iterable_awaiter(this, void 0, void 0, function* () {
        if (closed) {
          throw error !== null && error !== void 0 ? error : new WriteIterableClosedError("WritableIterable is closed");
        }
        // Check if there's a pending reader
        const reader = readQueue.shift();
        if (reader) {
          // Deliver the value directly to the waiting reader
          reader.resolve({
            done: false,
            value
          });
          // If there are more readers waiting, we can return immediately
          if (readQueue.length > 0) {
            return;
          }
        } else {
          // No reader available, queue the value
          writeQueue.push(value);
        }
        // Wait for readers to consume the values
        // We need to wait for as many reads as there are queued writes + 1
        const waitCount = writeQueue.length + 1;
        for (let i = 0; i < waitCount; i++) {
          yield nextPromise;
        }
      });
    },
    throw(err) {
      if (closed) return;
      closed = true;
      error = err;
      // Clear write queue and reject pending writes
      rejectPendingWrites(err);
      // Reject all pending reads
      drainReads({
        done: true,
        value: undefined
      }, err);
    },
    close() {
      if (closed) return;
      closed = true;
      // Clear write queue
      writeQueue.length = 0;
      // Resolve the next promise for any pending writes
      nextResolve();
      // Future writes should fail
      nextPromise = Promise.reject(new Error("WritableIterable is closed"));
      nextPromise.catch(() => {}); // Prevent unhandled rejection
      // Complete all pending reads
      drainReads({
        done: true,
        value: undefined
      });
    },
    [Symbol.asyncIterator]() {
      return {
        next() {
          // Signal that a read has been attempted
          nextResolve();
          nextPromise = createNextPromise();
          // Check if there's a queued write
          const value = writeQueue.shift();
          if (value !== undefined) {
            return Promise.resolve({
              done: false,
              value
            });
          }
          // Check if we're closed or errored
          if (closed) {
            if (error) {
              return Promise.reject(error);
            }
            return Promise.resolve({
              done: true,
              value: undefined
            });
          }
          // No value available, queue the read
          return new Promise((resolve, reject) => {
            readQueue.push({
              resolve,
              reject
            });
          });
        },
        throw(err) {
          // Iterator protocol: throwing on the iterator closes it
          closed = true;
          error = err;
          // Clear queues
          writeQueue.length = 0;
          rejectPendingWrites(err);
          drainReads({
            done: true,
            value: undefined
          }, err);
          return Promise.resolve({
            done: true,
            value: undefined
          });
        },
        return() {
          // Iterator protocol: returning closes the iterator
          closed = true;
          // Clear queues
          writeQueue.length = 0;
          nextResolve(); // Resolve once for any pending write
          // Future writes should fail
          nextPromise = Promise.reject(new Error("Iterator was closed"));
          nextPromise.catch(() => {}); // Prevent unhandled rejection
          drainReads({
            done: true,
            value: undefined
          });
          return Promise.resolve({
            done: true,
            value: undefined
          });
        }
      };
    }
  };
}
//# sourceMappingURL=writable-iterable.js.map
; // ../utils/dist/forkable-iterable.js
var forkable_iterable_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var forkable_iterable_await = undefined && undefined.__await || function (v) {
  return this instanceof forkable_iterable_await ? (this.v = v, this) : new forkable_iterable_await(v);
};
var forkable_iterable_asyncGenerator = undefined && undefined.__asyncGenerator || function (thisArg, _arguments, generator) {
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
    r.value instanceof forkable_iterable_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
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

/**
 * A ForkableIterable wraps an AsyncIterable and allows creating forks that
 * will yield all past elements followed by any future elements.
 */
class ForkableIterable {
  constructor(source) {
    this.source = source;
    this.pastElements = [];
    this.closed = false;
    this.forks = new Set();
    void this.consume();
  }
  consume() {
    return forkable_iterable_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        try {
          for (var _d = true, _e = __asyncValues(this.source), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const element = _c;
            this.pastElements.push(element);
            // Collect all write promises to await them before closing
            const writePromises = [];
            for (const fork of this.forks) {
              writePromises.push(fork.write(element).catch(() => {
                // Ignore write errors - they're expected if the fork consumer
                // has stopped reading or the fork was closed
              }));
            }
            // Wait for all writes to complete (or fail) before processing next element
            yield Promise.allSettled(writePromises);
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
      } finally {
        this.closed = true;
        for (const fork of this.forks) {
          fork.close();
        }
        this.forks.clear();
      }
    });
  }
  /**
   * Fork creates a new AsyncIterable that yields all past elements
   * and then continues to yield future elements until the source closes.
   */
  fork() {
    if (this.closed) {
      const pastElements = this.pastElements;
      return function () {
        return forkable_iterable_asyncGenerator(this, arguments, function* () {
          for (const element of pastElements) {
            yield yield forkable_iterable_await(element);
          }
        });
      }();
    }
    const fork = createWritableIterable();
    const pastElements = this.pastElements.slice();
    this.forks.add(fork);
    const self = this;
    return function () {
      return forkable_iterable_asyncGenerator(this, arguments, function* () {
        var _a, e_2, _b, _c;
        for (const element of pastElements) {
          yield yield forkable_iterable_await(element);
        }
        try {
          try {
            for (var _d = true, fork_1 = __asyncValues(fork), fork_1_1; fork_1_1 = yield forkable_iterable_await(fork_1.next()), _a = fork_1_1.done, !_a; _d = true) {
              _c = fork_1_1.value;
              _d = false;
              const element = _c;
              yield yield forkable_iterable_await(element);
            }
          } catch (e_2_1) {
            e_2 = {
              error: e_2_1
            };
          } finally {
            try {
              if (!_d && !_a && (_b = fork_1.return)) yield forkable_iterable_await(_b.call(fork_1));
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        } finally {
          self.forks.delete(fork);
        }
      });
    }();
  }
}
//# sourceMappingURL=forkable-iterable.js.map
; // ../utils/dist/path-matchers.js
/**
 * Path matching utilities for checking "is this a X file?" patterns.
 * All functions handle both Windows and Unix paths by operating on path component arrays.
 *
 * New structure: ~/.cursor/projects/{workspaceId}/terminals|agent-tools|agent-notes/
 */
/**
 * Check if a path is absolute on any platform.
 * Handles Windows drive letters even when running on macOS/Linux (e.g., SSH to Windows).
 *
 * @param filePath - Path to check
 * @returns true if the path is absolute on any platform
 *
 * Examples:
 * - `/usr/local` -> true (Unix)
 * - `C:/Users/file.txt` -> true (Windows)
 * - `c:\Windows\System32` -> true (Windows)
 * - `\\server\share` -> true (Windows UNC)
 * - `./relative/path` -> false
 * - `C:` -> false (no slash, not absolute)
 */
function isAbsolutePath(filePath) {
  // Unix absolute paths: start with /
  if (filePath.startsWith("/")) {
    return true;
  }
  // Windows absolute paths: single drive letter + colon + slash
  if (/^[a-zA-Z]:[\\/]/.test(filePath)) {
    return true;
  }
  // Windows UNC paths: \\server\share
  if (filePath.startsWith("\\\\")) {
    return true;
  }
  return false;
}
/**
 * Split a path into components, handling both / and \ separators.
 * Removes empty components (from leading/trailing slashes or double slashes).
 */
function splitPath(path) {
  return path.split(/[/\\]/).filter(c => c);
}
/**
 * Check if path contains the pattern: .cursor/projects/{workspaceId}/targetDir
 * Returns match info including workspace ID and remaining path, or null if not found.
 */
function matchProjectSubdir(path, targetDir) {
  const parts = splitPath(path);
  // Look for .cursor/projects/{workspaceId}/targetDir pattern
  for (let i = 0; i < parts.length - 2; i++) {
    if (parts[i] === ".cursor" && parts[i + 1] === "projects" && parts[i + 3] === targetDir) {
      return {
        workspaceId: parts[i + 2],
        remainingPath: parts.slice(i + 4)
      };
    }
  }
  return null;
}
/**
 * Check if path is within a Cursor project terminals directory.
 * Path must end with ~/.cursor/projects/{workspaceId}/terminals/
 */
function isCursorTerminalsDirectory(path) {
  const match = matchProjectSubdir(path, "terminals");
  return match !== null && match.remainingPath.length === 0;
}
/**
 * Check if this is an agent tool output file.
 * Must be a .txt file directly in ~/.cursor/projects/{workspaceId}/agent-tools/ directory.
 */
function isAgentToolOutputFile(filePath) {
  const match = matchProjectSubdir(filePath, "agent-tools");
  // Must be direct child (only one component after agent-tools) and end with .txt
  return match !== null && match.remainingPath.length === 1 && match.remainingPath[0].endsWith(".txt");
}
/**
 * Extract the terminal ID from any terminal file path (internal or external).
 * Returns an object with the ID, isExternal, and isInternal flags.
 * Returns null if the path is not a valid terminal file.
 *
 * Example:
 * - `~/.cursor/projects/{workspaceId}/terminals/123.txt` → { id: 123, isExternal: false, isInternal: true }
 * - `~/.cursor/projects/{workspaceId}/terminals/ext-456.txt` → { id: 456, isExternal: true, isInternal: false }
 * - `other/file.txt` → null
 */
function extractTerminalId(filePath) {
  const match = matchProjectSubdir(filePath, "terminals");
  // Must be direct child of terminals directory
  if (!match || match.remainingPath.length !== 1) {
    return null;
  }
  const fileName = match.remainingPath[0];
  // Match: (ext-)?(\d+).txt
  const fileMatch = /^(ext-)?(\d+)\.txt$/.exec(fileName);
  if (!fileMatch) return null;
  const isExternal = fileMatch[1] !== undefined;
  const id = Number.parseInt(fileMatch[2], 10);
  if (Number.isNaN(id)) return null;
  return {
    id,
    isExternal,
    isInternal: !isExternal
  };
}
//# sourceMappingURL=path-matchers.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/rxjs@8.0.0-alpha.14/node_modules/rxjs/dist/cjs/index.js
var cjs = __webpack_require__("../../node_modules/.pnpm/rxjs@8.0.0-alpha.14/node_modules/rxjs/dist/cjs/index.js");
; // ../utils/dist/promise-extras.js
var promise_extras_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

/**
 * Map over an array with a promise-returning function, and return a map of the results.
 *
 * @param array - The array to map over
 * @param selector - The function to map over the array
 * @param options - Options for the operation
 * @param options.max - The maximum number of concurrent operations
 * @returns A map of the array with the results of the selector
 */
function asyncMap(array, selector, options) {
  const {
    max = 4
  } = options !== null && options !== void 0 ? options : {};
  const promiseSelToObs = k => defer(() => from(selector(k)).pipe(map(v => ({
    k,
    v
  }))));
  const ret = from(array).pipe(map(promiseSelToObs), mergeAll(max), reduce((acc, kvp) => {
    acc.set(kvp.k, kvp.v);
    return acc;
  }, new Map()));
  return firstValueFrom(ret);
}
/**
 * Map over an array with a promise-returning function, and return an array of the values,
 * maintaining the order of the original array. This is most useful when replacing Promise.all,
 * since it guarantees the order of the results.
 *
 * @param array - The array to map over
 * @param selector - The function to map over the array
 * @param options - Options for the operation
 * @param options.max - The maximum number of concurrent operations
 * @returns An array of the results of the selector
 */
function asyncMapValues(array, selector, options) {
  return promise_extras_awaiter(this, void 0, void 0, function* () {
    const {
      max = 4
    } = options !== null && options !== void 0 ? options : {};
    const promiseSelToObs = idx => (0, cjs.defer)(() => (0, cjs.from)(selector(array[idx])).pipe((0, cjs.map)(v => ({
      idx,
      v
    }))));
    const ret = (0, cjs.from)(array.map((_, idx) => idx)).pipe((0, cjs.map)(promiseSelToObs), (0, cjs.mergeAll)(max), (0, cjs.reduce)((acc, kvp) => {
      acc[kvp.idx] = kvp.v;
      return acc;
    }, []));
    return (0, cjs.firstValueFrom)(ret);
  });
}
/**
 * Map over an array with a promise-returning function, and return a map of settled results.
 * Similar to Promise.allSettled, but with concurrency control and returns a Map.
 *
 * @param array - The array to map over
 * @param selector - The function to map over the array
 * @param options - Options for the operation
 * @param options.max - The maximum number of concurrent operations
 * @returns A map of the array with settled results (fulfilled or rejected)
 */
function asyncMapSettled(array, selector, options) {
  const {
    max = 4
  } = options !== null && options !== void 0 ? options : {};
  const promiseSelToObs = k => defer(() => from(selector(k)).pipe(map(v => ({
    k,
    result: {
      status: "fulfilled",
      value: v
    }
  })), catchError(reason => of({
    k,
    result: {
      status: "rejected",
      reason
    }
  }))));
  const ret = from(array).pipe(map(promiseSelToObs), mergeAll(max), reduce((acc, kvp) => {
    acc.set(kvp.k, kvp.result);
    return acc;
  }, new Map()));
  return firstValueFrom(ret);
}
/**
 * Map over an array with a promise-returning function, and return an array of settled results.
 * Similar to Promise.allSettled, but with concurrency control
 *
 * @param array - The array to map over
 * @param selector - The function to map over the array
 * @param options - Options for the operation
 * @param options.max - The maximum number of concurrent operations
 * @returns An array of settled results (fulfilled or rejected)
 */
function asyncMapSettledValues(array, selector, options) {
  const {
    max = 4
  } = options !== null && options !== void 0 ? options : {};
  const promiseSelToObs = idx => (0, cjs.defer)(() => (0, cjs.from)(selector(array[idx])).pipe((0, cjs.map)(v => ({
    idx,
    result: {
      status: "fulfilled",
      value: v
    }
  })), (0, cjs.catchError)(reason => (0, cjs.of)({
    idx,
    result: {
      status: "rejected",
      reason
    }
  }))));
  const ret = (0, cjs.from)(array.map((_, idx) => idx)).pipe((0, cjs.map)(promiseSelToObs), (0, cjs.mergeAll)(max), (0, cjs.reduce)((acc, kvp) => {
    acc[kvp.idx] = kvp.result;
    return acc;
  }, []));
  return (0, cjs.firstValueFrom)(ret);
}
/**
 * Reduce over an array with a promise-returning function, and return the reduced value.
 *
 * @param array - The array to reduce over
 * @param selector - The function to reduce over the array
 * @param seed - The initial value of the reduction
 * @returns The reduced value
 */
function asyncReduce(array, selector, seed) {
  return promise_extras_awaiter(this, void 0, void 0, function* () {
    let acc = seed;
    for (const x of array) {
      acc = yield selector(acc, x);
    }
    return acc;
  });
}
/**
 * Delay for a given number of milliseconds.
 *
 * @param ms - The number of milliseconds to delay
 * @returns A promise that resolves after the given number of milliseconds
 */
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within the specified timeout,
 * the returned promise will reject with a TimeoutError.
 *
 * @param promise The promise to wrap with a timeout
 * @param timeoutMs The timeout duration in milliseconds
 * @param errorMessage Optional custom error message
 * @returns A new promise that will resolve with the original promise's result or reject with a TimeoutError
 */
class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
}
/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within the specified timeout,
 * the returned promise will reject with a TimeoutError.
 *
 * @param promise The promise to wrap with a timeout
 * @param timeoutMs The timeout duration in milliseconds
 * @param errorMessage Optional custom error message
 * @returns A new promise that will resolve with the original promise's result or reject with a TimeoutError
 */
function withTimeout(promise, timeoutMs, message) {
  return firstValueFrom(from(promise).pipe(timeout({
    first: timeoutMs,
    with: () => throwError(() => new TimeoutError(message !== null && message !== void 0 ? message : `Promise timed out after ${timeoutMs}ms`))
  })));
}
/**
 * Retry a promise-returning function a given number of times.
 *
 * @param func The function to retry
 * @param retries The number of times to retry
 * @returns A promise that will resolve with the result of the function
 */
function retryPromise(func, retries = 3) {
  const ret = defer(() => from(func())).pipe(retry(retries));
  return firstValueFrom(ret);
}
/**
 * A queue that limits the number of concurrent operations.
 *
 * @param T - The type of the result of the operations
 */
class PromiseQueue {
  /**
   * Creates a new PromiseQueue.
   *
   * @param options - Options for the operation
   * @param options.max - The maximum number of concurrent operations
   */
  constructor(options) {
    this.opQueue = new cjs.Subject();
    this.nextOperation = 1;
    const {
      max = 4
    } = options !== null && options !== void 0 ? options : {};
    this.opResultStream = this.opQueue.pipe((0, cjs.mergeAll)(max) /* NB: Debugging this? uncomment: , tap({
                                                                   next: (op) => {
                                                                   console.log("next", op);
                                                                   },
                                                                   error: (e) => {
                                                                   console.error("error", e);
                                                                   },
                                                                   complete: () => {
                                                                   console.log("complete");
                                                                   },
                                                                   })*/, (0, cjs.share)());
    this.dispose = this.opResultStream.subscribe();
  }
  /**
   * Enqueue a new operation.
   *
   * @param block - The function to enqueue
   * @returns A promise that will resolve with the result of the operation
   */
  enqueue(block) {
    const id = this.nextOperation++;
    const op = (0, cjs.defer)(() => (0, cjs.from)(block()).pipe((0, cjs.map)(v => ({
      id,
      result: v
    })), (0, cjs.catchError)(e => (0, cjs.of)({
      id,
      error: e
    }))));
    const ret = (0, cjs.firstValueFrom)(this.opResultStream.pipe((0, cjs.filter)(op => op.id === id))).then(e => {
      if (e.error) {
        return Promise.reject(e.error);
      } else {
        return Promise.resolve(e.result);
      }
    });
    this.opQueue.next(op);
    return ret;
  }
  /**
   * Enqueue a list of operations.
   *
   * @param list - The list of items to enqueue
   * @param block - The function to enqueue
   * @returns A promise that will resolve with the result of the operation
   */
  enqueueList(list, block) {
    if (list.length === 0) {
      return Promise.resolve(new Map());
    }
    return (0, cjs.firstValueFrom)((0, cjs.from)(list).pipe((0, cjs.mergeMap)(x => this.enqueue(() => block(x)).then(v => ({
      key: x,
      value: v
    }))), (0, cjs.reduce)((acc, kvp) => {
      acc.set(kvp.key, kvp.value);
      return acc;
    }, new Map())));
  }
  /**
   * Close the queue and wait for all operations to complete. Once this is called,
   * the object is no longer usable.
   *
   * @returns A promise that will resolve when the queue is closed
   */
  close() {
    this.opQueue.complete();
    const ret = (0, cjs.lastValueFrom)(this.opResultStream.pipe((0, cjs.materialize)(), (0, cjs.map)(() => undefined)));
    this.dispose.unsubscribe();
    return ret;
  }
}
//# sourceMappingURL=promise-extras.js.map
; // ../utils/dist/workspace-paths.js
/** Base directory for project-specific files: .cursor/projects */
const CURSOR_PROJECTS_DIR = ".cursor/projects";
/** Slugify a path: /Users/wilson/my-project -> Users-wilson-my-project */
function slugifyPath(path) {
  return path.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
/** Get full project directory path: ~/.cursor/projects/{slug}/ */
function getProjectPath(homeDir, workspacePath) {
  const dirName = slugifyPath(workspacePath);
  return `${homeDir}/${CURSOR_PROJECTS_DIR}/${dirName}`;
}
//# sourceMappingURL=workspace-paths.js.map
; // ../utils/dist/index.js
// Async iterator utilities

// Disposable pattern

// FileUrl abstraction

// Model utilities

// Path matching utilities

// Workspace path utilities

// Writable iterable functionality

//# sourceMappingURL=index.js.map

/***/