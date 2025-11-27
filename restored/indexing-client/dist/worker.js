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