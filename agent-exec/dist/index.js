// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  HI: () => (/* reexport */CURSOR_PLAYWRIGHT_PROVIDER_ID),
  h: () => (/* reexport */RegistryResourceAccessor),
  n6: () => (/* reexport */SimpleControlledExecManager),
  Ok: () => (/* reexport */backgroundShellExecutorResource),
  iZ: () => (/* reexport */computerUseExecutorResource),
  Rp: () => (/* reexport */deleteExecutorResource),
  w4: () => (/* reexport */diagnosticsExecutorResource),
  IG: () => (/* reexport */fetchExecutorResource),
  u8: () => (/* reexport */grepExecutorResource),
  rn: () => (/* reexport */listMcpResourcesExecutorResource),
  bL: () => (/* reexport */lsExecutorResource),
  Yi: () => (/* reexport */mcpExecutorResource),
  _A: () => (/* reexport */readExecutorResource),
  ml: () => (/* reexport */readMcpResourceExecutorResource),
  pq: () => (/* reexport */recordScreenExecutorResource),
  MZ: () => (/* reexport */requestContextExecutorResource),
  qk: () => (/* reexport */shellExecutorResource),
  wv: () => (/* reexport */shellStreamExecutorResource),
  Ln: () => (/* reexport */writeExecutorResource)
});

// UNUSED EXPORTS: CURSOR_IDE_BROWSER_PROVIDER_ID, CURSOR_SELF_CONTROL_PROVIDER_ID, CombinedResourceAccessor, LazyRemoteExecManager, ListableRemoteResourceAccessor, NoHandlerFoundError, RemoteResourceAccessor, SimpleExecManager

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/exec_pb.js
var exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/exec_pb.js");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var dist = __webpack_require__("../utils/dist/index.js");
; // ../agent-exec/dist/controlled.js
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

// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var context_dist = __webpack_require__("../context/dist/index.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/agent_service_pb.js
var agent_service_pb = __webpack_require__("../proto/dist/generated/agent/v1/agent_service_pb.js");
; // ../agent-exec/dist/remote.js
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
; // ../agent-exec/dist/resource-provider.js
var resource_provider_await = undefined && undefined.__await || function (v) {
  return this instanceof resource_provider_await ? (this.v = v, this) : new resource_provider_await(v);
};
var resource_provider_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
var resource_provider_asyncGenerator = undefined && undefined.__asyncGenerator || function (thisArg, _arguments, generator) {
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
    r.value instanceof resource_provider_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
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
class LazyRemoteExecManager {
  constructor(promise) {
    this.promise = promise;
  }
  createExecInstance(ctx, argsSerializer) {
    return resource_provider_asyncGenerator(this, arguments, function* createExecInstance_1() {
      var _a, e_1, _b, _c;
      const remoteExecManager = yield resource_provider_await(this.promise);
      try {
        for (var _d = true, _e = resource_provider_asyncValues(remoteExecManager.createExecInstance(ctx, argsSerializer)), _f; _f = yield resource_provider_await(_e.next()), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const message = _c;
          yield yield resource_provider_await(message);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield resource_provider_await(_b.call(_e));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
}
function createResource(remoteImplementation, controlledImplementation) {
  return {
    symbol: Symbol(),
    remoteImplementation,
    registerControlledImplementation: controlledImplementation
  };
}
class RemoteResourceAccessor {
  constructor(remoteExecManager) {
    this.remoteExecManager = remoteExecManager;
  }
  get(resource) {
    return resource.remoteImplementation(this.remoteExecManager);
  }
}
class ListableRemoteResourceAccessor {
  constructor(remoteExecManager, resources) {
    this.resourceEntries = new Map();
    for (const resource of resources) {
      this.resourceEntries.set(resource, resource.remoteImplementation(remoteExecManager));
    }
  }
  get(resource) {
    return this.resourceEntries.get(resource);
  }
  entries() {
    return this.resourceEntries.entries();
  }
}
class ResourceDescriptor {
  constructor(resource, value) {
    this.resource = resource;
    this.value = value;
  }
}
class RegistryResourceAccessor {
  constructor() {
    this.resources = new Map();
  }
  register(resource, value) {
    this.resources.set(resource.symbol, new ResourceDescriptor(resource, value));
  }
  get(resource) {
    var _a;
    return (_a = this.resources.get(resource.symbol)) === null || _a === void 0 ? void 0 : _a.value;
  }
  entries() {
    return Array.from(this.resources.values()).map(value => [value.resource, value.value]);
  }
}
/**
 * Combines remote and local resource accessors into a single ListableResourceAccessor.
 * This allows us to have some resources implemented locally (browser-side) and others
 * implemented remotely (extension-side).
 */
class CombinedResourceAccessor {
  constructor(remoteAccessor, localResourceEntries) {
    this.remoteAccessor = remoteAccessor;
    this.localResources = new Map();
    // Register local resources
    for (const [resource, implementation] of localResourceEntries) {
      this.localResources.set(resource.symbol, {
        resource,
        implementation
      });
    }
  }
  get(resource) {
    // Check if it's a local resource first
    const localEntry = this.localResources.get(resource.symbol);
    if (localEntry) {
      return localEntry.implementation;
    }
    // Otherwise, get it from the remote accessor
    return this.remoteAccessor.get(resource);
  }
  *entries() {
    // First yield all local resources
    for (const {
      resource,
      implementation
    } of this.localResources.values()) {
      yield [resource, implementation];
    }
    // Then yield all remote resources
    for (const entry of this.remoteAccessor.entries()) {
      // Only yield remote resources that aren't overridden locally
      if (!this.localResources.has(entry[0].symbol)) {
        yield entry;
      }
    }
  }
}
; // ../agent-exec/dist/serialization.js

// Remote Ser-de
function createServerSerializer(argsKey) {
  function serialize(id, args) {
    const message = {
      case: argsKey,
      value: args
    };
    return new exec_pb /* ExecServerMessage */.Ye({
      id,
      message
    });
  }
  return serialize;
}
function createClientDeserializer(resultKey) {
  return result => {
    return result.message.case === resultKey ? result.message.value : undefined;
  };
}
// Controlled Ser-de
function createClientSerializer(resultKey) {
  function serialize(id, result) {
    const message = {
      case: resultKey,
      value: result
    };
    return new exec_pb /* ExecClientMessage */.yT({
      id,
      message
    });
  }
  return serialize;
}
function createServerDeserializer(argsKey) {
  function deserialize(result) {
    if (result.message.case !== argsKey) {
      return undefined;
    }
    return {
      id: result.id,
      args: result.message.value
    };
  }
  return deserialize;
}
; // ../agent-exec/dist/background-shell.js

const backgroundShellExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("backgroundShellSpawnArgs"), createClientDeserializer("backgroundShellSpawnResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("backgroundShellSpawnArgs"), createClientSerializer("backgroundShellSpawnResult")));
});
; // ../agent-exec/dist/computer-use.js

const computerUseExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("computerUseArgs"), createClientDeserializer("computerUseResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("computerUseArgs"), createClientSerializer("computerUseResult")));
});
; // ../agent-exec/dist/delete.js

const deleteExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("deleteArgs"), createClientDeserializer("deleteResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("deleteArgs"), createClientSerializer("deleteResult")));
});
; // ../agent-exec/dist/diagnostics.js

const diagnosticsExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("diagnosticsArgs"), createClientDeserializer("diagnosticsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("diagnosticsArgs"), createClientSerializer("diagnosticsResult")));
});
; // ../agent-exec/dist/fetch.js

const fetchExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("fetchArgs"), createClientDeserializer("fetchResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("fetchArgs"), createClientSerializer("fetchResult")));
});
; // ../agent-exec/dist/grep.js

const grepExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("grepArgs"), createClientDeserializer("grepResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("grepArgs"), createClientSerializer("grepResult")));
});
; // ../agent-exec/dist/ls.js

const lsExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("lsArgs"), createClientDeserializer("lsResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("lsArgs"), createClientSerializer("lsResult")));
});
; // ../agent-exec/dist/mcp.js

const CURSOR_PLAYWRIGHT_PROVIDER_ID = "cursor-browser-extension";
const CURSOR_IDE_BROWSER_PROVIDER_ID = "cursor-ide-browser";
const CURSOR_SELF_CONTROL_PROVIDER_ID = "cursor-dev-control";
const mcpExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("mcpArgs"), createClientDeserializer("mcpResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("mcpArgs"), createClientSerializer("mcpResult")));
});
const listMcpResourcesExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("listMcpResourcesExecArgs"), createClientDeserializer("listMcpResourcesExecResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("listMcpResourcesExecArgs"), createClientSerializer("listMcpResourcesExecResult")));
});
const readMcpResourceExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("readMcpResourceExecArgs"), createClientDeserializer("readMcpResourceExecResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("readMcpResourceExecArgs"), createClientSerializer("readMcpResourceExecResult")));
});
; // ../agent-exec/dist/read.js

const readExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("readArgs"), createClientDeserializer("readResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("readArgs"), createClientSerializer("readResult")));
});
; // ../agent-exec/dist/record-screen.js

const recordScreenExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("recordScreenArgs"), createClientDeserializer("recordScreenResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("recordScreenArgs"), createClientSerializer("recordScreenResult")));
});
; // ../agent-exec/dist/request-context.js

const requestContextExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("requestContextArgs"), createClientDeserializer("requestContextResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("requestContextArgs"), createClientSerializer("requestContextResult")));
});
; // ../agent-exec/dist/shell.js

const shellExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("shellArgs"), createClientDeserializer("shellResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("shellArgs"), createClientSerializer("shellResult")));
});
; // ../agent-exec/dist/shell-stream.js

const shellStreamExecutorResource = createResource(execManager => new StreamExecutorResource(execManager, createServerSerializer("shellStreamArgs"), createClientDeserializer("shellStream")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledStreamExecHandler(implementation, createServerDeserializer("shellStreamArgs"), createClientSerializer("shellStream")));
});
; // ../agent-exec/dist/write.js

const writeExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("writeArgs"), createClientDeserializer("writeResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("writeArgs"), createClientSerializer("writeResult")));
});
; // ../agent-exec/dist/index.js

/***/