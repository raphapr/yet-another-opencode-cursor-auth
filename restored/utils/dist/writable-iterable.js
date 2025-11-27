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