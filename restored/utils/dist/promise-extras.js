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