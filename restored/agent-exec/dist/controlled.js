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
class NoHandlerFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NoHandlerFoundError";
  }
}
class SimpleControlledExecHandler {
  constructor(exec, deserializeArgs, serializeResult) {
    this.exec = exec;
    this.deserializeArgs = deserializeArgs;
    this.serializeResult = serializeResult;
  }
  handle(ctx, serverMessage) {
    const r = this.deserializeArgs(serverMessage);
    if (r === undefined) {
      return undefined;
    }
    const {
      id,
      args
    } = r;
    function generator(self) {
      return __asyncGenerator(this, arguments, function* generator_1() {
        const result = yield __await(self.exec.execute(ctx, args, {
          execId: serverMessage.execId
        }));
        yield yield __await(self.serializeResult(id, result));
      });
    }
    return generator(this);
  }
}
class SimpleControlledStreamExecHandler {
  constructor(exec, deserializeArgs, serializeStream) {
    this.exec = exec;
    this.deserializeArgs = deserializeArgs;
    this.serializeStream = serializeStream;
  }
  handle(ctx, serverMessage) {
    const r = this.deserializeArgs(serverMessage);
    if (r === undefined) {
      return undefined;
    }
    const {
      id,
      args
    } = r;
    function generator(self) {
      return __asyncGenerator(this, arguments, function* generator_2() {
        var _a, e_1, _b, _c;
        const stream = self.exec.execute(ctx, args, {
          execId: serverMessage.execId
        });
        try {
          for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield __await(stream_1.next()), _a = stream_1_1.done, !_a; _d = true) {
            _c = stream_1_1.value;
            _d = false;
            const message = _c;
            yield yield __await(self.serializeStream(id, message));
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = stream_1.return)) yield __await(_b.call(stream_1));
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      });
    }
    return generator(this);
  }
}
class SimpleControlledExecManager {
  constructor() {
    this.handlers = [];
    this.runningExecs = new Map();
  }
  register(handler) {
    this.handlers.push(handler);
  }
  handleControlMessage(serverMessage) {
    if (serverMessage.message.case === "abort") {
      const id = serverMessage.message.value.id;
      const execCtxCancel = this.runningExecs.get(id);
      if (execCtxCancel) {
        execCtxCancel();
      }
    }
  }
  handle(ctx, serverMessage) {
    const [execCtx, execCtxCancel] = ctx.withCancel();
    this.runningExecs.set(serverMessage.id, execCtxCancel);
    for (const handler of this.handlers) {
      const result = handler.handle(execCtx, serverMessage);
      if (result !== undefined) {
        const resultStream = result;
        const outputStream = (0, dist /* createWritableIterable */.Jt)();
        const run = () => __awaiter(this, void 0, void 0, function* () {
          var _a, e_2, _b, _c;
          try {
            try {
              for (var _d = true, resultStream_1 = __asyncValues(resultStream), resultStream_1_1; resultStream_1_1 = yield resultStream_1.next(), _a = resultStream_1_1.done, !_a; _d = true) {
                _c = resultStream_1_1.value;
                _d = false;
                const message = _c;
                yield outputStream.write(message);
              }
            } catch (e_2_1) {
              e_2 = {
                error: e_2_1
              };
            } finally {
              try {
                if (!_d && !_a && (_b = resultStream_1.return)) yield _b.call(resultStream_1);
              } finally {
                if (e_2) throw e_2.error;
              }
            }
            yield outputStream.write(new exec_pb /* ExecClientControlMessage */.$Y({
              message: {
                case: "streamClose",
                value: new exec_pb /* ExecClientStreamClose */.D9({
                  id: serverMessage.id
                })
              }
            }));
          } catch (error) {
            if (error instanceof dist /* WriteIterableClosedError */.W2) {
              return;
            }
            yield outputStream.write(new exec_pb /* ExecClientControlMessage */.$Y({
              message: {
                case: "throw",
                value: new exec_pb /* ExecClientThrow */.Fu({
                  id: serverMessage.id,
                  error: error instanceof Error ? error.message : "Unknown error"
                })
              }
            }));
          } finally {
            outputStream.close();
            this.runningExecs.delete(serverMessage.id);
          }
        });
        void run();
        return outputStream;
      }
    }
    // Clean up if no handler found
    this.runningExecs.delete(serverMessage.id);
    throw new NoHandlerFoundError(`No handler found for server message of type ${serverMessage.message.case}`);
  }
  static fromResources(resources) {
    const execManager = new SimpleControlledExecManager();
    for (const [resource, implementation] of resources.entries()) {
      resource.registerControlledImplementation(implementation, execManager);
    }
    return execManager;
  }
}