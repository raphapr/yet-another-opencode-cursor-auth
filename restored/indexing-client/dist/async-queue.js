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