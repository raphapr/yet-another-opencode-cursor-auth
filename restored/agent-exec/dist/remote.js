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
var remote_await = undefined && undefined.__await || function (v) {
  return this instanceof remote_await ? (this.v = v, this) : new remote_await(v);
};
var remote_asyncGenerator = undefined && undefined.__asyncGenerator || function (thisArg, _arguments, generator) {
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
    r.value instanceof remote_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
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

// Exec Manager
class SimpleExecManager {
  constructor(client, server, signal, nextId = 0, streamMap = new Map()) {
    this.client = client;
    this.server = server;
    this.signal = signal;
    this.nextId = nextId;
    this.streamMap = streamMap;
    void this.run();
    this.signal.addEventListener("abort", () => remote_awaiter(this, void 0, void 0, function* () {
      const idsToAbort = Array.from(this.streamMap.keys());
      for (const id of idsToAbort) {
        yield this.client.write(new ExecServerControlMessage({
          message: {
            case: "abort",
            value: new ExecServerAbort({
              id
            })
          }
        }));
      }
    }), {
      once: true
    });
  }
  run() {
    return remote_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        for (var _d = true, _e = remote_asyncValues(this.server), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const message = _c;
          if (message instanceof ExecClientControlMessage) {
            if (message.message.case === "streamClose") {
              const streamResolver = this.streamMap.get(message.message.value.id);
              if (streamResolver) {
                streamResolver.close();
              }
            } else if (message.message.case === "throw") {
              const streamResolver = this.streamMap.get(message.message.value.id);
              if (streamResolver) {
                streamResolver.throw(new Error(message.message.value.error));
              }
            }
          } else {
            const streamResolver = this.streamMap.get(message.id);
            if (streamResolver) {
              yield streamResolver.write(message);
            } else {
              console.error("no resolver found for message", message);
            }
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
    });
  }
  createExecInstance(ctx, argsSerializer) {
    return remote_asyncGenerator(this, arguments, function* createExecInstance_1() {
      var _a, e_2, _b, _c;
      const id = this.nextId++;
      const req = argsSerializer(id);
      const streamResolver = createWritableIterable();
      this.streamMap.set(id, streamResolver);
      if (ctx.signal) {
        if (ctx.signal.aborted) {
          streamResolver.close();
          this.streamMap.delete(id);
        } else {
          ctx.signal.addEventListener("abort", () => {
            void this.client.write(new ExecServerControlMessage({
              message: {
                case: "abort",
                value: new ExecServerAbort({
                  id
                })
              }
            }));
          }, {
            once: true
          });
        }
      }
      yield remote_await(this.client.write(req));
      try {
        try {
          for (var _d = true, streamResolver_1 = remote_asyncValues(streamResolver), streamResolver_1_1; streamResolver_1_1 = yield remote_await(streamResolver_1.next()), _a = streamResolver_1_1.done, !_a; _d = true) {
            _c = streamResolver_1_1.value;
            _d = false;
            const message = _c;
            yield yield remote_await(message);
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = streamResolver_1.return)) yield remote_await(_b.call(streamResolver_1));
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      } finally {
        this.streamMap.delete(id);
      }
    });
  }
}
// Higher level abstractions
/**
 * Extract span context from the current Context for propagation in proto messages
 */
function extractSpanContext(ctx) {
  var _a;
  try {
    const span = (0, context_dist /* getSpan */.fU)(ctx);
    if (!span) {
      return undefined;
    }
    const spanContext = span.spanContext();
    return new exec_pb /* SpanContext */.Kg({
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
      traceFlags: spanContext.traceFlags,
      traceState: (_a = spanContext.traceState) === null || _a === void 0 ? void 0 : _a.toString()
    });
  } catch (_b) {
    // Don't fail requests due to tracing issues
    return undefined;
  }
}
class ExecutorResource {
  constructor(execManager, serializeArgs, deserializeResult) {
    this.execManager = execManager;
    this.serializeArgs = serializeArgs;
    this.deserializeResult = deserializeResult;
  }
  execute(ctx, args, options) {
    return remote_awaiter(this, void 0, void 0, function* () {
      const spanContext = extractSpanContext(ctx);
      const messageStream = this.execManager.createExecInstance(ctx, id => {
        const serialized = this.serializeArgs(id, args);
        return new exec_pb /* ExecServerMessage */.Ye({
          id: serialized.id,
          message: serialized.message,
          execId: options === null || options === void 0 ? void 0 : options.execId,
          spanContext
        });
      });
      const {
        firstItem: result,
        rest
      } = yield (0, dist /* getFirstItem */.ue)(messageStream);
      // flush the rest of the stream
      void (() => remote_awaiter(this, void 0, void 0, function* () {
        var _a, e_3, _b, _c;
        try {
          for (var _d = true, rest_1 = remote_asyncValues(rest), rest_1_1; rest_1_1 = yield rest_1.next(), _a = rest_1_1.done, !_a; _d = true) {
            _c = rest_1_1.value;
            _d = false;
            const _ = _c;
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = rest_1.return)) yield _b.call(rest_1);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
      }))();
      const resultValue = this.deserializeResult(result);
      if (resultValue === undefined) {
        throw new Error("No result value");
      }
      return resultValue;
    });
  }
}
class StreamExecutorResource {
  constructor(execManager, serializeArgs, deserializeStream) {
    this.execManager = execManager;
    this.serializeArgs = serializeArgs;
    this.deserializeStream = deserializeStream;
  }
  execute(ctx, args, options) {
    return remote_asyncGenerator(this, arguments, function* execute_1() {
      var _a, e_4, _b, _c;
      const spanContext = extractSpanContext(ctx);
      const messageStream = this.execManager.createExecInstance(ctx, id => {
        const serialized = this.serializeArgs(id, args);
        return new exec_pb /* ExecServerMessage */.Ye({
          id: serialized.id,
          message: serialized.message,
          execId: options === null || options === void 0 ? void 0 : options.execId,
          spanContext
        });
      });
      try {
        for (var _d = true, messageStream_1 = remote_asyncValues(messageStream), messageStream_1_1; messageStream_1_1 = yield remote_await(messageStream_1.next()), _a = messageStream_1_1.done, !_a; _d = true) {
          _c = messageStream_1_1.value;
          _d = false;
          const message = _c;
          const streamValue = this.deserializeStream(message);
          if (streamValue !== undefined) {
            yield yield remote_await(streamValue);
          }
        }
      } catch (e_4_1) {
        e_4 = {
          error: e_4_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = messageStream_1.return)) yield remote_await(_b.call(messageStream_1));
        } finally {
          if (e_4) throw e_4.error;
        }
      }
    });
  }
}