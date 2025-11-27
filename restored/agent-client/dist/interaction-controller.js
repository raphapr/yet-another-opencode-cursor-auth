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