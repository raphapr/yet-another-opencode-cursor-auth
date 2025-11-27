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