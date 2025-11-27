// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  PW: () => (/* reexport */AgentConnectClient),
  _8: () => (/* reexport */UserAbortedRequestError),
  mb: () => (/* reexport */getErrorDetailFromConnectError),
  Oe: () => (/* reexport */hydrateRequestContext)
});

// UNUSED EXPORTS: CheckpointController, ClientExecController, ClientInteractionController, LostConnection, MockAgentTransport, agentStreamMetadata, splitStream

// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var dist = __webpack_require__("../context/dist/index.js");
; // ../agent-client/dist/checkpoint-controller.js
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
var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
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
class CheckpointController {
  constructor(checkpointStream, checkpointHandler, ctx) {
    this.checkpointStream = checkpointStream;
    this.checkpointHandler = checkpointHandler;
    this.ctx = ctx;
  }
  run() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const runSpan = __addDisposableResource(env_1, (0, dist /* createSpan */.VI)(this.ctx.withName("CheckpointController.run")), false);
        const ctx = runSpan.ctx;
        try {
          for (var _d = true, _e = __asyncValues(this.checkpointStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const checkpoint = _c;
            yield this.checkpointHandler.handleCheckpoint(ctx, checkpoint);
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
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        __disposeResources(env_1);
      }
    });
  }
}

// EXTERNAL MODULE: ../agent-exec/dist/index.js + 18 modules
var agent_exec_dist = __webpack_require__("../agent-exec/dist/index.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/request_context_exec_pb.js + 1 modules
var request_context_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/request_context_exec_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/aiserver/v1/utils_pb.js
var utils_pb = __webpack_require__("../proto/dist/generated/aiserver/v1/utils_pb.js");
; // ../agent-client/dist/common.js
var common_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

// Parses ErrorDetails out of a ConnectError (mirrors VSCode getErrorDetail)
function getErrorDetailFromConnectError(error) {
  // Restore details values to Uint8Array when they were serialized differently
  const restoreUInt8ArrayNess = err => {
    err.details = err.details.map(detail => {
      const valueIsUInt8Array = "value" in detail && detail.value instanceof Uint8Array;
      if ("value" in detail && valueIsUInt8Array === false) {
        const values = Object.values(detail.value);
        detail.value = Uint8Array.from(values);
      }
      return detail;
    });
  };
  restoreUInt8ArrayNess(error);
  // biome-ignore lint/suspicious/noExplicitAny: findDetails is a method on ConnectError
  const errorDetails = error.findDetails(utils_pb /* ErrorDetails */.vj);
  if (!errorDetails || errorDetails.length === 0) return undefined;
  return errorDetails[0];
}
const ACTIONS_WITH_REQUEST_CONTEXT = ["userMessageAction", "resumeAction"];
function includesTyped(arr, el) {
  return arr.includes(el);
}
const hydrateRequestContext = (parentCtx, action, resources, notesSessionId) => common_awaiter(void 0, void 0, void 0, function* () {
  var _a;
  const actionCase = action.action.case;
  if (includesTyped(ACTIONS_WITH_REQUEST_CONTEXT, actionCase)) {
    const hydratedAction = action.action.value;
    const rcExecutor = resources.get(agent_exec_dist /* requestContextExecutorResource */.MZ);
    const requestContextResult = yield rcExecutor.execute(parentCtx, new request_context_exec_pb /* RequestContextArgs */._K({
      notesSessionId
    }));
    if (requestContextResult.result.case !== "success" || requestContextResult.result.value.requestContext === undefined) {
      throw new Error(`Failed to compute request context: ${JSON.stringify((_a = requestContextResult.result.value) === null || _a === void 0 ? void 0 : _a.toJson())}`);
    }
    hydratedAction.requestContext = requestContextResult.result.value.requestContext;
  }
});
class UserAbortedRequestError extends Error {
  constructor() {
    super("User aborted request");
  }
}

// EXTERNAL MODULE: ../agent-kv/dist/index.js + 8 modules
var agent_kv_dist = __webpack_require__("../agent-kv/dist/index.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/agent_pb.js + 9 modules
var agent_pb = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/agent_service_pb.js
var agent_service_pb = __webpack_require__("../proto/dist/generated/agent/v1/agent_service_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/exec_pb.js
var exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/exec_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/mcp_pb.js
var mcp_pb = __webpack_require__("../proto/dist/generated/agent/v1/mcp_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/shell_exec_pb.js
var shell_exec_pb = __webpack_require__("../proto/dist/generated/agent/v1/shell_exec_pb.js");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var utils_dist = __webpack_require__("../utils/dist/index.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@bufbuild+protobuf@1.10.0/node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/struct_pb.js
var struct_pb = __webpack_require__("../../node_modules/.pnpm/@bufbuild+protobuf@1.10.0/node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/struct_pb.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/connect-error.js
var connect_error = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/connect-error.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/protocol/async-iterable.js + 2 modules
var async_iterable = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/protocol/async-iterable.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/code.js
var code = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/code.js");
; // ../agent-client/dist/exec-controller.js
var exec_controller_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var exec_controller_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var exec_controller_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var exec_controller_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
class LostConnection extends Error {
  constructor(message) {
    super(message);
    this.name = "LostConnection";
  }
}
class ClientExecController {
  constructor(serverStream, clientStream, controlledExecManager) {
    this.serverStream = serverStream;
    this.clientStream = clientStream;
    this.controlledExecManager = controlledExecManager;
  }
  run(ctx) {
    return exec_controller_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const runSpan = exec_controller_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("ClientExecController.run")), false);
        const pendingPromises = [];
        try {
          try {
            for (var _d = true, _e = exec_controller_asyncValues(this.serverStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
              _c = _f.value;
              _d = false;
              const message = _c;
              if (message instanceof agent_service_pb /* ExecServerControlMessage */.Nv) {
                this.controlledExecManager.handleControlMessage(message);
                continue;
              }
              const promise = (() => exec_controller_awaiter(this, void 0, void 0, function* () {
                var _a, e_3, _b, _c;
                var _d;
                const env_2 = {
                  stack: [],
                  error: void 0,
                  hasError: false
                };
                try {
                  // Create context, potentially with parent span context from the message
                  let execCtx;
                  let span;
                  if (message.spanContext) {
                    // If span context is present, create a context with it as the parent
                    const spanCtx = message.spanContext;
                    execCtx = (0, dist /* createContextFromSpanContext */.V5)({
                      traceId: spanCtx.traceId,
                      spanId: spanCtx.spanId,
                      traceFlags: (_d = spanCtx.traceFlags) !== null && _d !== void 0 ? _d : 1
                    }, "exec.handle", ctx);
                    // Get the span so we can end it later
                    span = (0, dist /* getSpan */.fU)(execCtx);
                  } else {
                    // No span context, use the parent context
                    execCtx = ctx;
                  }
                  const _disposableSpan = exec_controller_addDisposableResource(env_2, span ? new dist /* DisposableSpan */.r2(execCtx, span) : undefined, false);
                  const stream = this.controlledExecManager.handle(execCtx, message);
                  try {
                    for (var _e = true, stream_1 = exec_controller_asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _e = true) {
                      _c = stream_1_1.value;
                      _e = false;
                      const result = _c;
                      yield this.clientStream.write(result);
                    }
                  } catch (e_3_1) {
                    e_3 = {
                      error: e_3_1
                    };
                  } finally {
                    try {
                      if (!_e && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                    } finally {
                      if (e_3) throw e_3.error;
                    }
                  }
                } catch (e_4) {
                  env_2.error = e_4;
                  env_2.hasError = true;
                } finally {
                  exec_controller_disposeResources(env_2);
                }
              }))();
              pendingPromises.push(promise);
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
          yield Promise.all(pendingPromises);
        } catch (error) {
          if (error instanceof connect_error /* ConnectError */.T && error.rawMessage === "protocol error: missing EndStreamResponse") {
            throw new LostConnection(error.message);
          }
          // not sure if these are necessary...
          else if (error instanceof connect_error /* ConnectError */.T && error.code === code /* Code */.C.Aborted) {
            const cause = error.cause;
            if (cause instanceof Error && "code" in cause && typeof cause.code === "string" && cause.code.includes("ERR_STREAM_WRITE_AFTER_END")) {
              throw new LostConnection(error.message);
            }
          } else if (error instanceof utils_dist /* WriteIterableClosedError */.W2) {
            throw new LostConnection(error.message);
          } else if (error instanceof connect_error /* ConnectError */.T && error.code === code /* Code */.C.Internal) {
            const cause = error.cause;
            if (cause instanceof Error && cause.message.includes("NGHTTP2_PROTOCOL_ERROR")) {
              throw new LostConnection(error.message);
            }
          }
        }
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        exec_controller_disposeResources(env_1);
      }
    });
  }
}

// EXTERNAL MODULE: ../agent-core/dist/index.js + 4 modules
var agent_core_dist = __webpack_require__("../agent-core/dist/index.js");
; // ../agent-client/dist/interaction-controller.js
var interaction_controller_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var interaction_controller_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var interaction_controller_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var interaction_controller_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
class ClientInteractionController {
  constructor(interactionStream, interactionListener, queryResponseStream) {
    this.interactionStream = interactionStream;
    this.interactionListener = interactionListener;
    this.queryResponseStream = queryResponseStream;
  }
  run(ctx) {
    return interaction_controller_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const runSpan = interaction_controller_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("ClientInteractionController.run")), false);
        ctx = runSpan.ctx;
        try {
          for (var _d = true, _e = interaction_controller_asyncValues(this.interactionStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const message = _c;
            if (message.case === "interactionQuery") {
              yield this.handleInteractionQuery(ctx, message.value);
            } else if (message.case === "interactionUpdate") {
              yield this.handleInteractionUpdate(ctx, message.value);
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
      } catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
      } finally {
        interaction_controller_disposeResources(env_1);
      }
    });
  }
  handleInteractionUpdate(ctx, update) {
    return interaction_controller_awaiter(this, void 0, void 0, function* () {
      const coreUpdate = (0, agent_core_dist /* convertProtoToInteractionUpdate */.yy)(update);
      if (coreUpdate) {
        yield this.interactionListener.sendUpdate(ctx, coreUpdate);
      }
    });
  }
  handleInteractionQuery(ctx, queryProto) {
    return interaction_controller_awaiter(this, void 0, void 0, function* () {
      const coreQuery = (0, agent_core_dist /* convertProtoToInteractionQuery */.RR)(queryProto);
      const response = yield this.interactionListener.query(ctx, coreQuery);
      const responseProto = (0, agent_core_dist /* convertInteractionResponseToProto */.ym)(response, queryProto.id, coreQuery.type);
      yield this.queryResponseStream.write(responseProto);
    });
  }
}

// EXTERNAL MODULE: ../metrics/dist/index.js
var metrics_dist = __webpack_require__("../metrics/dist/index.js");
; // ../agent-client/dist/stall-detector.js

const logger = (0, dist /* createLogger */.h)("@anysphere/agent-client:stall-detector");
const streamStallCount = (0, metrics_dist /* createCounter */.Pu)("agent_client.stream.stall.count", {
  description: "Number of bidirectional stream stalls detected",
  labelNames: ["activity_type", "message_type"]
});
const streamStallDuration = (0, metrics_dist /* createHistogram */.v5)("agent_client.stream.stall.duration_ms", {
  description: "Duration of stream stalls in milliseconds",
  labelNames: ["activity_type"]
});
const streamDidStall = (0, metrics_dist /* createCounter */.Pu)("agent_client.stream.did_stall", {
  description: "Number of streams that experienced at least one stall"
});
const streamTotal = (0, metrics_dist /* createCounter */.Pu)("agent_client.stream.total", {
  description: "Total number of streams monitored"
});
/**
 * Detects when a bidirectional stream has no activity for a specified threshold.
 * Implements Disposable for automatic cleanup with the 'using' keyword.
 *
 * The detector uses a single timer that resets on ANY stream activity (inbound or outbound),
 * detecting true "stream stall" rather than directional issues.
 */
class StallDetector {
  constructor(ctx, thresholdMs) {
    this.ctx = ctx;
    this.thresholdMs = thresholdMs;
    this.hasLogged = false;
    this.hasEverStalled = false;
    this.activities = [];
    this.lastActivityTime = Date.now();
    this.startTimer();
    // Track that we started monitoring a stream
    streamTotal.increment(this.ctx, 1);
    ctx.signal.addEventListener("abort", () => {
      this.trackActivity("ctx.signal", "abort");
      this.abortedAt = Date.now();
    });
  }
  trackActivity(activityType, messageType) {
    var _a;
    const last = this.activities.at(-1);
    if ((last === null || last === void 0 ? void 0 : last.type) === activityType && last.messageType === messageType) {
      last.times = ((_a = last.times) !== null && _a !== void 0 ? _a : 1) + 1;
    } else {
      this.activities.push({
        type: activityType,
        messageType
      });
    }
  }
  /**
   * Reset the stall timer. Call this on ANY stream activity.
   * @param activityType Type of activity for debugging
   * @param messageType Message type (e.g., "interactionUpdate" for inbound, "runRequest" for outbound)
   */
  reset(activityType = "inbound_message", messageType) {
    const now = Date.now();
    const wasStalled = this.hasLogged;
    // Calculate stall duration before updating lastActivityTime
    const stallDurationMs = wasStalled ? now - this.lastActivityTime : 0;
    this.lastActivityTime = now;
    this.trackActivity(activityType, messageType);
    // If we had logged a stall and now have activity, log recovery
    if (wasStalled) {
      this.hasLogged = false;
      this.logRecovery(activityType, stallDurationMs);
    }
    // Restart the timer
    this.startTimer();
  }
  startTimer() {
    // Clear existing timer
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    // Start new timer
    this.timer = setTimeout(() => {
      this.onStallDetected();
    }, this.thresholdMs);
  }
  buildLogMetadata(stallFields) {
    var _a;
    const metadata = this.ctx.get(agentStreamMetadata);
    const stall = Object.assign({}, stallFields);
    if ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.modelDetails) === null || _a === void 0 ? void 0 : _a.displayName) {
      stall.model_name = metadata.modelDetails.displayName;
    }
    if (this.abortedAt) {
      stall.aborted_ago_ms = Date.now() - this.abortedAt;
    }
    const activitiesLines = [];
    let lastType;
    for (const {
      type,
      messageType,
      times
    } of this.activities.splice(0).reverse()) {
      if (lastType !== type) {
        if (!lastType) {
          activitiesLines.push(`[${type}] (MOST RECENT)`);
        } else {
          activitiesLines.push(`[${type}]`);
        }
        lastType = type;
      }
      activitiesLines.push(`${messageType}${times ? ` (x${times})` : ""}`);
    }
    stall.activities = activitiesLines.join("\n");
    return {
      reqId: metadata === null || metadata === void 0 ? void 0 : metadata.requestId,
      stall
    };
  }
  onStallDetected() {
    var _a, _b;
    // Only log once per stall period
    if (this.hasLogged) {
      return;
    }
    this.hasLogged = true;
    // Get before buildLogMetadata splices.
    const lastActivity = this.activities.at(-1);
    try {
      const now = Date.now();
      const durationMs = now - this.lastActivityTime;
      const logMetadata = this.buildLogMetadata({
        duration_ms: durationMs,
        threshold_ms: this.thresholdMs
      });
      // Structured logging
      logger.warn(this.ctx, "[NAL client stall detector] Bidirectional stream stall detected - no activity for threshold period", logMetadata);
      // Emit counter metric on detection with labels
      // Note: histogram is emitted on recovery to capture actual stall duration
      streamStallCount.increment(this.ctx, 1, {
        activity_type: (_a = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.type) !== null && _a !== void 0 ? _a : "unknown",
        message_type: (_b = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.messageType) !== null && _b !== void 0 ? _b : "unknown"
      });
      // Track if this is the first stall for this stream
      if (!this.hasEverStalled) {
        this.hasEverStalled = true;
        streamDidStall.increment(this.ctx, 1);
      }
    } catch (error) {
      // Stall detection should never crash the stream
      console.error("Error in stall detection:", error);
    }
  }
  logRecovery(activityType, stallDurationMs) {
    try {
      const logMetadata = this.buildLogMetadata({
        duration_ms: stallDurationMs
      });
      // Structured logging for recovery
      logger.info(this.ctx, "[NAL client stall detector] Stream activity resumed after stall", logMetadata);
      // Emit histogram metric with actual stall duration and activity type label
      streamStallDuration.histogram(this.ctx, stallDurationMs, {
        activity_type: activityType
      });
    } catch (error) {
      // Recovery logging should never crash the stream
      console.error("Error logging stream recovery:", error);
    }
  }
  /**
   * Cleanup - called automatically when using 'using' keyword
   */
  [Symbol.dispose]() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
; // ../agent-client/dist/connect.js
var connect_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var connect_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var connect_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var connect_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
const agentStreamMetadata = (0, dist /* createKey */.cF)(Symbol("agentStreamMetadata"), undefined);
const getMessageTypeLabelForStallDetector = message => {
  var _a, _b;
  const parts = [];
  parts.push(message.message.case);
  switch (message.message.case) {
    case "conversationAction":
      parts.push(message.message.value.action.case);
      break;
    case "execClientMessage":
      parts.push(message.message.value.message.case);
      break;
    case "execClientControlMessage":
      parts.push(message.message.value.message.case);
      break;
    case "kvClientMessage":
      parts.push(message.message.value.message.case);
      break;
    case "interactionResponse":
      parts.push(message.message.value.result.case);
      break;
    case "interactionUpdate":
      parts.push(message.message.value.message.case);
      switch (message.message.value.message.case) {
        case "partialToolCall":
        case "toolCallCompleted":
        case "toolCallStarted":
          parts.push((_a = message.message.value.message.value.toolCall) === null || _a === void 0 ? void 0 : _a.tool.case);
          break;
        case "toolCallDelta":
          parts.push((_b = message.message.value.message.value.toolCallDelta) === null || _b === void 0 ? void 0 : _b.delta.case);
          break;
      }
      break;
    case "interactionQuery":
      parts.push(message.message.value.query.case);
      break;
    case "execServerMessage":
      parts.push(message.message.value.message.case);
      break;
    case "execServerControlMessage":
      parts.push(message.message.value.message.case);
      break;
  }
  return parts.filter(p => p !== undefined).join(":");
};
function splitStream(stream, detector) {
  const interactionStream = (0, async_iterable /* createWritableIterable */.Jt)();
  const execStream = (0, async_iterable /* createWritableIterable */.Jt)();
  const checkpointStream = (0, async_iterable /* createWritableIterable */.Jt)();
  const kvStream = (0, async_iterable /* createWritableIterable */.Jt)();
  function run() {
    return connect_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        try {
          for (var _d = true, stream_1 = connect_asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
            _c = stream_1_1.value;
            _d = false;
            const message = _c;
            // Filter out heartbeats - they should not reset the stall timer
            if (!(message.message.case === "interactionUpdate" && message.message.value.message.case === "heartbeat")) {
              // Reset stall detector on any meaningful inbound message
              detector.reset("inbound_message", getMessageTypeLabelForStallDetector(message));
            }
            if (message.message.case === "interactionUpdate" || message.message.case === "interactionQuery") {
              // Avoid unhandled rejections if the interaction stream was closed
              // (e.g., due to client-side abort/cleanup racing with server writes)
              interactionStream.write(message.message).catch(() => {});
            }
            if (message.message.case === "execServerMessage" || message.message.case === "execServerControlMessage") {
              yield execStream.write(message.message.value);
            }
            if (message.message.case === "conversationCheckpointUpdate") {
              yield checkpointStream.write(message.message.value);
            }
            if (message.message.case === "kvServerMessage") {
              yield kvStream.write(message.message.value);
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      } finally {
        interactionStream.close();
        execStream.close();
        checkpointStream.close();
        kvStream.close();
      }
    });
  }
  return {
    interactionStream,
    execStream,
    checkpointStream,
    kvStream,
    done: run()
  };
}
function handleShellStream(ctx, shellStream, interactionListener) {
  return connect_awaiter(this, void 0, void 0, function* () {
    var _a, shellStream_1, shellStream_1_1;
    var _b, e_2, _c, _d;
    try {
      for (_a = true, shellStream_1 = connect_asyncValues(shellStream); shellStream_1_1 = yield shellStream_1.next(), _b = shellStream_1_1.done, !_b; _a = true) {
        _d = shellStream_1_1.value;
        _a = false;
        const message = _d;
        switch (message.event.case) {
          case "stdout":
            yield interactionListener.sendUpdate(ctx, {
              type: "shell-output-delta",
              event: {
                case: "stdout",
                value: new shell_exec_pb /* ShellStreamStdout */.o0({
                  data: message.event.value.data
                })
              }
            });
            break;
          case "stderr":
            yield interactionListener.sendUpdate(ctx, {
              type: "shell-output-delta",
              event: {
                case: "stderr",
                value: new shell_exec_pb /* ShellStreamStderr */.Db({
                  data: message.event.value.data
                })
              }
            });
            break;
          case "exit":
            yield interactionListener.sendUpdate(ctx, {
              type: "shell-output-delta",
              event: {
                case: "exit",
                value: new shell_exec_pb /* ShellStreamExit */.vb({
                  code: message.event.value.code
                })
              }
            });
            break;
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (!_a && !_b && (_c = shellStream_1.return)) yield _c.call(shellStream_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  });
}
class AgentConnectClient {
  constructor(client) {
    this.client = client;
  }
  run(ctx, conversationState, action, modelDetails, interactionListener, resources, blobStore, conversationActionManager, checkpointHandler, mcpTools, options) {
    return connect_awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const runSpan = connect_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("AgentConnectClient.run")), false);
        ctx = runSpan.ctx;
        const requestId = (_a = options.generationUUID) !== null && _a !== void 0 ? _a : crypto.randomUUID();
        // Populate the context with agent stream metadata
        ctx = ctx.with(agentStreamMetadata, {
          requestId,
          modelDetails
        });
        // Create a soft cancel context that listens to the manager's signal
        const [softCancelCtx, softCancelCurrentRun] = ctx.withCancel();
        // When the manager's signal is aborted, cancel the soft cancel context
        if (!((_b = conversationActionManager.signal) === null || _b === void 0 ? void 0 : _b.aborted)) {
          (_c = conversationActionManager.signal) === null || _c === void 0 ? void 0 : _c.addEventListener("abort", () => softCancelCurrentRun(), {
            once: true
          });
        } else {
          softCancelCurrentRun();
        }
        if (ctx.canceled || softCancelCtx.canceled) {
          throw new UserAbortedRequestError();
        }
        try {
          const env_2 = {
            stack: [],
            error: void 0,
            hasError: false
          };
          try {
            const execManagerSpan = (0, dist /* createSpan */.VI)(ctx.withName("createControlledExecManager"));
            const controlledExecManager = agent_exec_dist /* SimpleControlledExecManager */.n6.fromResources(resources);
            execManagerSpan[Symbol.dispose]();
            // Create stall detector with automatic cleanup
            const stallDetector = connect_addDisposableResource(env_2, new StallDetector(ctx, 10000), false);
            const requestStream = (0, async_iterable /* createWritableIterable */.Jt)();
            // Wrap request stream to reset stall detector on writes
            const monitoredRequestStream = new utils_dist /* MapWritable */.F8(requestStream, msg => {
              stallDetector.reset("outbound_write", getMessageTypeLabelForStallDetector(msg));
              return msg;
            });
            // Convert McpToolDefinition to proto format
            const protoMcpTools = mcpTools.map(tool => ({
              name: tool.name,
              providerIdentifier: tool.providerIdentifier,
              toolName: tool.toolName,
              description: tool.description,
              inputSchema: tool.inputSchema ? struct_pb /* Value */.WT.fromJson(tool.inputSchema) : undefined
            }));
            const writeRequestSpan = (0, dist /* createSpan */.VI)(ctx.withName("writeInitialRequest"));
            const promise = monitoredRequestStream.write(new agent_service_pb /* AgentClientMessage */.KS({
              message: {
                case: "runRequest",
                value: new agent_pb /* AgentRunRequest */.Mp({
                  conversationState,
                  action,
                  modelDetails,
                  mcpTools: new mcp_pb /* McpTools */.Or({
                    mcpTools: protoMcpTools
                  }),
                  conversationId: options.conversationId,
                  mcpFileSystemOptions: options.mcpFileSystemOptions
                })
              }
            }));
            writeRequestSpan[Symbol.dispose]();
            // means the user cancelled in between processing the request
            if (softCancelCtx.canceled) {
              throw new UserAbortedRequestError();
            }
            const headers = Object.assign({
              "x-request-id": requestId
            }, (_d = options.headers) !== null && _d !== void 0 ? _d : {});
            const connectSpan = (0, dist /* createSpan */.VI)(ctx.withName("connectToBackend"));
            const response = this.client.run(ctx, requestStream, {
              signal: ctx.signal,
              headers
            });
            const {
              interactionStream,
              execStream,
              checkpointStream,
              kvStream,
              done
            } = splitStream(response, stallDetector);
            connectSpan[Symbol.dispose]();
            let interactionHandler;
            // Handle preemptive exec for shell commands with execId
            if (action.action.case === "shellCommandAction" && action.action.value.execId) {
              const shellAction = action.action.value;
              const shellArgs = new shell_exec_pb /* ShellArgs */.a({
                command: ((_e = shellAction.shellCommand) === null || _e === void 0 ? void 0 : _e.command) || "",
                parsingResult: new shell_exec_pb /* ShellCommandParsingResult */.HO()
              });
              const shellStreamExec = resources.get(agent_exec_dist /* shellStreamExecutorResource */.wv);
              const shellStream = shellStreamExec.execute(ctx, shellArgs, {
                execId: shellAction.execId
              });
              interactionHandler = {
                run: ctx => handleShellStream(ctx, shellStream, interactionListener)
              };
            } else {
              interactionHandler = new ClientInteractionController(interactionStream, interactionListener, new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => new agent_service_pb /* AgentClientMessage */.KS({
                message: {
                  case: "interactionResponse",
                  value: message
                }
              })));
            }
            yield promise;
            const execOutputStream = new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => {
              if (message instanceof exec_pb /* ExecClientMessage */.yT) {
                return new agent_service_pb /* AgentClientMessage */.KS({
                  message: {
                    case: "execClientMessage",
                    value: message
                  }
                });
              } else if (message instanceof exec_pb /* ExecClientControlMessage */.$Y) {
                return new agent_service_pb /* AgentClientMessage */.KS({
                  message: {
                    case: "execClientControlMessage",
                    value: message
                  }
                });
              }
              throw new Error("Unknown exec message");
            });
            const execHandler = new ClientExecController(execStream, execOutputStream, controlledExecManager);
            const kvHandler = new agent_kv_dist /* ControlledKvManager */.hC(kvStream, new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => new agent_service_pb /* AgentClientMessage */.KS({
              message: {
                case: "kvClientMessage",
                value: message
              }
            })), blobStore);
            const checkpointController = new CheckpointController(checkpointStream, checkpointHandler, ctx);
            let execResolve;
            let execReject;
            const execPromise = new Promise((resolve, reject) => {
              execResolve = resolve;
              execReject = reject;
            });
            const execResolvers = {
              promise: execPromise,
              resolve: execResolve,
              reject: execReject
            };
            // we force exit execResolvers in case any exec hangs, we want to make sure to exit out
            if (softCancelCtx.canceled) {
              execResolvers.resolve();
              interactionStream.close();
            } else {
              softCancelCtx.signal.addEventListener("abort", () => {
                execResolvers.resolve();
                interactionStream.close();
              }, {
                once: true
              });
            }
            // run it with the soft cancel so that on ctrl + c, the local execs are aborted
            execHandler.run(softCancelCtx).then(execResolvers.resolve).catch(execResolvers.reject);
            const allSettledPromise = Promise.allSettled([done.finally(() => {
              conversationActionManager.close();
              execOutputStream.close();
            }), execResolvers.promise, interactionHandler.run(ctx), checkpointController.run(), kvHandler.run(), conversationActionManager.run(new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => new agent_service_pb /* AgentClientMessage */.KS({
              message: {
                case: "conversationAction",
                value: message
              }
            })))]);
            let overallResolve;
            let overallReject;
            const overallPromise = new Promise((resolve, reject) => {
              overallResolve = resolve;
              overallReject = reject;
            });
            const overallResolver = {
              promise: overallPromise,
              resolve: overallResolve,
              reject: overallReject
            };
            allSettledPromise.then(overallResolver.resolve).catch(overallResolver.reject);
            if (ctx.canceled) {
              overallResolver.reject(new UserAbortedRequestError());
            } else {
              ctx.signal.addEventListener("abort", () => overallResolver.reject(new UserAbortedRequestError()), {
                once: true
              });
            }
            const results = yield overallResolver.promise;
            const execResult = results[1];
            if (execResult.status === "rejected" && execResult.reason instanceof LostConnection && !softCancelCtx.canceled) {
              const latestConversationState = checkpointHandler.getLatestCheckpoint();
              if (!latestConversationState) {
                throw new Error("No latest conversation state found");
              }
              const resumeActionMessage = new agent_pb /* ConversationAction */.QF({
                action: {
                  case: "resumeAction",
                  value: new agent_pb /* ResumeAction */.qK()
                }
              });
              conversationActionManager.resetStream();
              // Dispose detector before recursive call to prevent multiple active detectors
              stallDetector[Symbol.dispose]();
              yield this.run(ctx, latestConversationState, resumeActionMessage, modelDetails, interactionListener, resources, blobStore, conversationActionManager, checkpointHandler, mcpTools, options);
            } else {
              // If the top-level stream (done) rejected with a ConnectError, capture details
              const doneResult = results[0];
              if (doneResult.status === "rejected") {
                throw doneResult.reason;
              }
              // After the agent loop completes successfully, check if there are unprocessed messages and resubmit
              if (conversationActionManager.hasUnprocessedMessages() && !softCancelCtx.canceled) {
                const unprocessedMessages = conversationActionManager.getUnprocessedUserMessages();
                const latestCheckpoint = checkpointHandler.getLatestCheckpoint();
                if (latestCheckpoint && unprocessedMessages.length > 0) {
                  const unprocessedMessage = unprocessedMessages[0];
                  conversationActionManager.markMessageAsProcessed(unprocessedMessage);
                  conversationActionManager.resetStream();
                  // Dispose detector before recursive call to prevent multiple active detectors
                  stallDetector[Symbol.dispose]();
                  yield this.run(ctx, latestCheckpoint, new agent_pb /* ConversationAction */.QF({
                    action: {
                      case: "userMessageAction",
                      value: new agent_pb /* UserMessageAction */.Vt({
                        userMessage: unprocessedMessage
                      })
                    }
                  }), modelDetails, interactionListener, resources, blobStore, conversationActionManager, checkpointHandler, mcpTools, options);
                }
              }
            }
          } catch (e_3) {
            env_2.error = e_3;
            env_2.hasError = true;
          } finally {
            connect_disposeResources(env_2);
          }
        } catch (error) {
          if (error instanceof connect_error /* ConnectError */.T) {
            const details = getErrorDetailFromConnectError(error);
            if (details && ((_f = details.details) === null || _f === void 0 ? void 0 : _f.detail) === "User aborted request") {
              throw new UserAbortedRequestError();
            }
          }
          throw error;
        }
      } catch (e_4) {
        env_1.error = e_4;
        env_1.hasError = true;
      } finally {
        connect_disposeResources(env_1);
      }
    });
  }
}

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/delete_tool_pb.js
var delete_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/delete_tool_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/grep_tool_pb.js
var grep_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/grep_tool_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/ls_tool_pb.js
var ls_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/ls_tool_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/read_tool_pb.js
var read_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/read_tool_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/shell_tool_pb.js
var shell_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/shell_tool_pb.js");
; // ../agent-client/dist/mock-transport.js
var mock_transport_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var mock_transport_asyncValues = undefined && undefined.__asyncValues || function (o) {
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

/**
 * MockAgentTransport is a test-only transport for AgentConnectClient that
 * allows scripting AgentServerMessage streams without a real backend.
 *
 * It reads the first runRequest from the client stream, extracts conversationId
 * and requestId, and delegates to a provider callback to get a mock stream.
 *
 * This transport is only intended for use in smoke tests when enableSmokeTestDriver
 * is true. It should never be used in production.
 *
 * Key behaviors:
 * - If the provider returns a mock stream, it yields from that stream
 * - If the provider returns undefined, it throws a clear error (no silent fallback to real backend)
 * - This ensures all agent runs in smoke tests are explicitly mocked or fail fast
 */
class MockAgentTransport {
  constructor(provider) {
    this.provider = provider;
  }
  run(_ctx, req, options) {
    return __asyncGenerator(this, arguments, function* run_1() {
      // Read the first message to extract conversationId and requestId
      let firstMessage;
      const reqIterator = req[Symbol.asyncIterator]();
      const firstResult = yield __await(reqIterator.next());
      if (firstResult.done) {
        throw new Error("[MockAgentTransport] No messages received from client stream");
      }
      firstMessage = firstResult.value;
      if (firstMessage.message.case !== "runRequest") {
        throw new Error(`[MockAgentTransport] Expected first message to be runRequest, got ${firstMessage.message.case}`);
      }
      const runRequest = firstMessage.message.value;
      const conversationIdRaw = runRequest.conversationId;
      const requestIdHeader = options.headers["x-request-id"];
      if (!conversationIdRaw) {
        throw new Error("[MockAgentTransport] conversationId is required in runRequest");
      }
      if (!requestIdHeader) {
        throw new Error("[MockAgentTransport] x-request-id header is required");
      }
      const conversationId = conversationIdRaw;
      const requestId = requestIdHeader;
      // Ask the provider for a mock stream
      const mockStream = this.provider({
        conversationId,
        requestId,
        runRequest,
        signal: options.signal
      });
      if (!mockStream) {
        throw new Error(`[MockAgentTransport] No mock stream configured for conversationId=${conversationId}; requestId=${requestId}`);
      }
      // Track pending exec results with promises
      const pendingExecs = new Map();
      // Consume the request stream to detect exec results and resolve pending promises
      const execResults = createWritableIterable();
      const consumeRequestStream = () => mock_transport_awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          // Manually iterate using .next() since reqIterator is AsyncIterator not AsyncIterable
          while (true) {
            const result = yield reqIterator.next();
            if (result.done) {
              break;
            }
            const message = result.value;
            // When we receive an ExecClientMessage, find the matching pending exec
            if (message.message.case === "execClientMessage") {
              const execMessage = message.message.value;
              const resultCase = (_a = execMessage.message) === null || _a === void 0 ? void 0 : _a.case;
              // Find the matching tool call by checking exec result types and populate the result
              let matchingCallId;
              let matchingToolCall;
              for (const [callId, pending] of pendingExecs.entries()) {
                const toolCase = pending.toolCall.tool.case;
                // Match exec results to tool types and convert exec result to tool result
                if (toolCase === "readToolCall" && resultCase === "readResult") {
                  matchingCallId = callId;
                  // Convert ReadResult (exec) to ReadToolResult (tool)
                  // The backend converts all error cases to a single "error" case
                  const readExecResult = execMessage.message.value;
                  let toolResult;
                  if (readExecResult.result.case === "success") {
                    // Success case - convert exec result to tool result
                    const readSuccess = readExecResult.result.value;
                    toolResult = new ReadToolResult({
                      result: {
                        case: "success",
                        value: {
                          output: readSuccess.output,
                          isEmpty: false,
                          exceededLimit: readSuccess.truncated,
                          totalLines: readSuccess.totalLines,
                          fileSize: Number(readSuccess.fileSize),
                          path: readSuccess.path
                        }
                      }
                    });
                  } else {
                    // Convert all error cases (fileNotFound, permissionDenied, rejected, error) to tool error
                    let errorMessage;
                    switch (readExecResult.result.case) {
                      case "error":
                        errorMessage = readExecResult.result.value.error;
                        break;
                      case "fileNotFound":
                        errorMessage = "File not found";
                        break;
                      case "permissionDenied":
                        errorMessage = "Permission denied";
                        break;
                      case "rejected":
                        errorMessage = readExecResult.result.value.reason || "Read operation rejected";
                        break;
                      default:
                        errorMessage = "Unknown error";
                    }
                    toolResult = new ReadToolResult({
                      result: {
                        case: "error",
                        value: new ReadToolError({
                          errorMessage
                        })
                      }
                    });
                  }
                  const updatedReadToolCall = new ReadToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: toolResult
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "readToolCall",
                      value: updatedReadToolCall
                    }
                  });
                  break;
                } else if (toolCase === "lsToolCall" && resultCase === "lsResult") {
                  matchingCallId = callId;
                  const updatedLsToolCall = new LsToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "lsToolCall",
                      value: updatedLsToolCall
                    }
                  });
                  break;
                } else if (toolCase === "grepToolCall" && resultCase === "grepResult") {
                  matchingCallId = callId;
                  const updatedGrepToolCall = new GrepToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "grepToolCall",
                      value: updatedGrepToolCall
                    }
                  });
                  break;
                } else if (toolCase === "deleteToolCall" && resultCase === "deleteResult") {
                  matchingCallId = callId;
                  const updatedDeleteToolCall = new DeleteToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "deleteToolCall",
                      value: updatedDeleteToolCall
                    }
                  });
                  break;
                } else if (toolCase === "shellToolCall" && resultCase === "shellResult") {
                  matchingCallId = callId;
                  const updatedShellToolCall = new ShellToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "shellToolCall",
                      value: updatedShellToolCall
                    }
                  });
                  break;
                }
              }
              if (matchingCallId && matchingToolCall) {
                yield execResults.write({
                  callId: matchingCallId,
                  toolCall: matchingToolCall
                });
              }
            }
          }
        } catch (_error) {
          // Request stream closed or errored
        } finally {
          execResults.close();
        }
      });
      // Start consuming request stream in background
      consumeRequestStream().catch(() => {});
      const _execResultsIterator = execResults[Symbol.asyncIterator]();
      // Process exec results in a background task and yield them as tool-call-completed events
      const processExecResults = function () {
        return __asyncGenerator(this, arguments, function* () {
          var _a, e_1, _b, _c;
          try {
            try {
              for (var _d = true, execResults_1 = mock_transport_asyncValues(execResults), execResults_1_1; execResults_1_1 = yield __await(execResults_1.next()), _a = execResults_1_1.done, !_a; _d = true) {
                _c = execResults_1_1.value;
                _d = false;
                const result = _c;
                const pending = pendingExecs.get(result.callId);
                if (pending) {
                  // Emit tool-call-completed update
                  const completedUpdate = new ToolCallCompletedUpdate({
                    callId: result.callId,
                    toolCall: result.toolCall,
                    modelCallId: pending.modelCallId
                  });
                  const interactionUpdate = new InteractionUpdate({
                    message: {
                      case: "toolCallCompleted",
                      value: completedUpdate
                    }
                  });
                  yield yield __await(new AgentServerMessage({
                    message: {
                      case: "interactionUpdate",
                      value: interactionUpdate
                    }
                  }));
                  pendingExecs.delete(result.callId);
                }
              }
            } catch (e_1_1) {
              e_1 = {
                error: e_1_1
              };
            } finally {
              try {
                if (!_d && !_a && (_b = execResults_1.return)) yield __await(_b.call(execResults_1));
              } finally {
                if (e_1) throw e_1.error;
              }
            }
          } catch (_err) {
            // Exec results stream closed
          }
        });
      }();
      // Merge mockStream and execResults - yield from both without blocking
      const mockStreamIterator = mockStream[Symbol.asyncIterator]();
      const execResultsGen = processExecResults[Symbol.asyncIterator]();
      let mockDone = false;
      let execDone = false;
      let pendingExecCount = 0; // Track how many execs we're waiting for
      let bufferedTurnEnded = null; // Buffer turn-ended until execs complete
      // Pending promises that haven't resolved yet
      let mockPromise = null;
      let execPromise = null;
      while (!mockDone || !execDone) {
        // Start both iterators if not already started and not done
        if (!mockDone && !mockPromise) {
          mockPromise = mockStreamIterator.next().then(result => ({
            source: "mock",
            result
          }));
        }
        if (!execDone && !execPromise) {
          execPromise = execResultsGen.next().then(result => ({
            source: "exec",
            result
          }));
        }
        // Wait for whichever completes first
        const promises = [];
        if (mockPromise) promises.push(mockPromise);
        if (execPromise) promises.push(execPromise);
        if (promises.length === 0) break;
        const {
          source,
          result
        } = yield __await(Promise.race(promises));
        // Clear the resolved promise so we can start a new one
        if (source === "mock") mockPromise = null;
        if (source === "exec") execPromise = null;
        if (result.done) {
          if (source === "mock") mockDone = true;
          if (source === "exec") execDone = true;
          continue;
        }
        // Track tool calls from mock stream
        if (source === "mock" && result.value.message.case === "interactionUpdate") {
          const update = result.value.message.value;
          if (update.message.case === "toolCallStarted") {
            const startedUpdate = update.message.value;
            if (startedUpdate.toolCall) {
              pendingExecs.set(startedUpdate.callId, {
                resolve: () => {},
                reject: () => {},
                toolCall: startedUpdate.toolCall,
                modelCallId: startedUpdate.modelCallId
              });
            }
          } else if (update.message.case === "partialToolCall") {
            const partialUpdate = update.message.value;
            if (partialUpdate.toolCall) {
              pendingExecs.set(partialUpdate.callId, {
                resolve: () => {},
                reject: () => {},
                toolCall: partialUpdate.toolCall,
                modelCallId: partialUpdate.modelCallId
              });
            }
          }
        } else if (source === "mock" && result.value.message.case === "execServerMessage") {
          // Track that we're expecting an exec result
          pendingExecCount++;
        } else if (source === "exec" && result.value.message.case === "interactionUpdate") {
          const update = result.value.message.value;
          if (update.message.case === "toolCallCompleted") {
            // We got a completion, decrement counter
            pendingExecCount--;
            // If mock is done and no more pending execs, close execResults to signal completion
            if (mockDone && pendingExecCount === 0) {
              execResults.close();
            }
            // If we have a buffered turn-ended and all execs are done, yield it now
            if (bufferedTurnEnded && pendingExecCount === 0) {
              yield yield __await(bufferedTurnEnded);
              bufferedTurnEnded = null;
            }
          }
        }
        // Check if this is a turn-ended message and we have pending execs
        if (source === "mock" && result.value.message.case === "interactionUpdate") {
          const update = result.value.message.value;
          if (update.message.case === "turnEnded" && pendingExecCount > 0) {
            // Buffer turn-ended until all execs complete
            bufferedTurnEnded = result.value;
          } else {
            yield yield __await(result.value);
          }
        } else {
          yield yield __await(result.value);
        }
      }
      // If we still have a buffered turn-ended, yield it now (shouldn't happen, but safety net)
      if (bufferedTurnEnded) {
        yield yield __await(bufferedTurnEnded);
      }
    });
  }
}
; // ../agent-client/dist/index.js

/***/