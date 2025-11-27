var cache_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var cache_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var cache_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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

/**
 * Middleware that wraps clients with caching functionality
 */
class CachingMiddleware {
  constructor(cachingService) {
    this.cachingService = cachingService;
  }
  load(ctx, serverName, server, _configPath, next) {
    return cache_awaiter(this, void 0, void 0, function* () {
      // Create a promise that will resolve to the client
      const clientPromise = next(ctx, server);
      // Wrap it with caching
      return this.cachingService.wrapWithCache(ctx, serverName, clientPromise);
    });
  }
}
class FileBasedMcpCacheStore {
  constructor(mcpCachePath) {
    this.mcpCachePath = mcpCachePath;
    this.mcpCachePromise = this.loadMcpCache();
  }
  wrapWithCache(ctx, serverName, clientPromise) {
    return new CachedMcpClient(ctx, serverName, clientPromise, undefined, this);
  }
  loadMcpCache() {
    return cache_awaiter(this, void 0, void 0, function* () {
      try {
        const mcpCache = yield (0, promises_.readFile)(this.mcpCachePath, "utf8");
        const parsed = JSON.parse(mcpCache);
        // Ensure the parsed data is actually an object
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          // Invalid format - reset to empty object
          return {};
        }
        return parsed;
      } catch (_e) {
        return {};
      }
    });
  }
  loadCache(identifier) {
    return cache_awaiter(this, void 0, void 0, function* () {
      var _a;
      const mcpCache = yield this.mcpCachePromise;
      return (_a = mcpCache[identifier]) !== null && _a !== void 0 ? _a : undefined;
    });
  }
  saveCache(identifier, definition) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const mcpCache = yield this.mcpCachePromise;
      mcpCache[identifier] = definition;
      yield (0, promises_.mkdir)(external_node_path_.dirname(this.mcpCachePath), {
        recursive: true
      });
      yield (0, promises_.writeFile)(this.mcpCachePath, JSON.stringify(mcpCache, null, 2));
    });
  }
}
function getIfReady(promise) {
  let result;
  promise.then(value => {
    result = value;
  }).catch(() => {});
  return result;
}
class CachedMcpClient {
  constructor(ctx, serverName, clientPromise, cacheEntry, cache) {
    var _a, _b;
    this.serverName = serverName;
    this.clientPromise = clientPromise;
    this.cacheEntry = cacheEntry;
    this.cache = cache;
    this.clientPromiseTraceId = (_b = (_a = (0, dist /* getSpan */.fU)(ctx)) === null || _a === void 0 ? void 0 : _a.spanContext()) === null || _b === void 0 ? void 0 : _b.traceId;
    this.toolsPromise = this.clientPromise.then(client => cache_awaiter(this, void 0, void 0, function* () {
      if (client === null) {
        return [];
      }
      const tools = yield client.getTools(ctx);
      yield this.cache.saveCache(this.serverName, {
        tools
      });
      return tools;
    }));
  }
  getTools(ctx) {
    return cache_awaiter(this, void 0, void 0, function* () {
      var _a;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.getTools")), false);
        span.span.setAttribute("serverName", this.serverName);
        span.span.setAttribute("cacheTraceId", (_a = this.clientPromiseTraceId) !== null && _a !== void 0 ? _a : "undefined");
        const currentValue = getIfReady(this.toolsPromise);
        if (currentValue !== undefined) {
          return currentValue;
        }
        if (this.cacheEntry !== undefined) {
          return this.cacheEntry.tools;
        }
        return yield this.toolsPromise;
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        cache_disposeResources(env_1);
      }
    });
  }
  callTool(ctx, name, args, toolCallId, elicitationProvider) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const env_2 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.callTool")), false);
        const inner = yield this.getClient(span.ctx);
        if (inner === null) {
          throw new Error("Client is not ready");
        }
        return inner.callTool(span.ctx, name, args, toolCallId, elicitationProvider);
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        cache_disposeResources(env_2);
      }
    });
  }
  getInstructions(ctx) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const env_3 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.getInstructions")), false);
        const inner = yield this.getClient(span.ctx);
        if (inner === null) {
          return undefined;
        }
        return yield inner.getInstructions(span.ctx);
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        cache_disposeResources(env_3);
      }
    });
  }
  getClient(ctx) {
    return cache_awaiter(this, void 0, void 0, function* () {
      var _a;
      const env_4 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.getClient")), false);
        span.span.setAttribute("serverName", this.serverName);
        span.span.setAttribute("cacheTraceId", (_a = this.clientPromiseTraceId) !== null && _a !== void 0 ? _a : "undefined");
        return yield this.clientPromise;
      } catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
      } finally {
        cache_disposeResources(env_4);
      }
    });
  }
  listResources(ctx) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const env_5 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.listResources")), false);
        const inner = yield this.getClient(span.ctx);
        if (inner === null) {
          return {
            resources: []
          };
        }
        return inner.listResources(span.ctx);
      } catch (e_5) {
        env_5.error = e_5;
        env_5.hasError = true;
      } finally {
        cache_disposeResources(env_5);
      }
    });
  }
  readResource(ctx, args) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const env_6 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.readResource")), false);
        const inner = yield this.getClient(span.ctx);
        if (inner === null) {
          return {
            contents: []
          };
        }
        return inner.readResource(span.ctx, args);
      } catch (e_6) {
        env_6.error = e_6;
        env_6.hasError = true;
      } finally {
        cache_disposeResources(env_6);
      }
    });
  }
  listPrompts(ctx) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const env_7 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_7, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.listPrompts")), false);
        const inner = yield this.getClient(span.ctx);
        if (inner === null) {
          return [];
        }
        return inner.listPrompts(span.ctx);
      } catch (e_7) {
        env_7.error = e_7;
        env_7.hasError = true;
      } finally {
        cache_disposeResources(env_7);
      }
    });
  }
  getPrompt(ctx, name, args) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const env_8 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_8, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.getPrompt")), false);
        const inner = yield this.getClient(span.ctx);
        if (inner === null) {
          return {
            messages: []
          };
        }
        return inner.getPrompt(span.ctx, name, args);
      } catch (e_8) {
        env_8.error = e_8;
        env_8.hasError = true;
      } finally {
        cache_disposeResources(env_8);
      }
    });
  }
  getState(ctx) {
    return cache_awaiter(this, void 0, void 0, function* () {
      const env_9 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = cache_addDisposableResource(env_9, (0, dist /* createSpan */.VI)(ctx.withName("CachedMcpClient.getState")), false);
        span.span.setAttribute("serverName", this.serverName);
        const inner = yield this.getClient(span.ctx);
        if (inner === null) {
          throw new Error("Client is not ready");
        }
        return yield inner.getState(span.ctx);
      } catch (e_9) {
        env_9.error = e_9;
        env_9.hasError = true;
      } finally {
        cache_disposeResources(env_9);
      }
    });
  }
}
//# sourceMappingURL=cache.js.map