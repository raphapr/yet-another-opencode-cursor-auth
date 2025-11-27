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