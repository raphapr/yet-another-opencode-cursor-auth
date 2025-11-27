// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  mz: () => (/* reexport */CachingMiddleware),
  mF: () => (/* reexport */FileBasedMcpApprovalStore),
  nL: () => (/* reexport */FileBasedMcpCacheStore),
  Q7: () => (/* reexport */FileBasedTokenStore),
  gT: () => (/* reexport */FileConfigMcpLoader),
  $b: () => (/* reexport */ServerApprovalMiddleware),
  XV: () => (/* reexport */ServerBlockingMiddleware),
  Ko: () => (/* reexport */generateApprovalKey),
  h1: () => (/* reexport */getMcpConfig)
});

// UNUSED EXPORTS: CachedMcpClient, InMemoryTokenStorage, MockElicitationProvider, MockElicitationProviderFactory, NoopElicitationProvider, NoopElicitationProviderFactory, NoopMcpApprovalService, combineMcpConfigs

// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__("node:crypto");
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__("node:fs/promises");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var dist = __webpack_require__("../context/dist/index.js");
; // ../mcp-agent-exec/dist/approval-store.js
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
function generateApprovalKey(serverName, server, cwd) {
  const hashInput = {
    path: cwd,
    server: server
  };
  const hash = (0, external_node_crypto_.createHash)("sha256").update(JSON.stringify(hashInput)).digest("hex").substring(0, 16);
  return `${serverName}-${hash}`;
}
/**
 * Noop approval service that always approves everything.
 * This replaces the previous VsCodeMcpApprovalService to remove the dependency
 * on the browser-side MCP service for approval checking.
 */
class NoopMcpApprovalService {
  isServerApproved(_serverName, _server, _configPath) {
    return __awaiter(this, void 0, void 0, function* () {
      // Always approve everything
      return true;
    });
  }
}
/**
 * Middleware that requires approval for servers
 */
class ServerApprovalMiddleware {
  constructor(approvalService) {
    this.approvalService = approvalService;
  }
  load(ctx, serverName, server, configPath, next) {
    return __awaiter(this, void 0, void 0, function* () {
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const _span = __addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("ServerApprovalMiddleware.load")), false);
        const isApproved = yield this.approvalService.isServerApproved(serverName, server, configPath);
        if (!isApproved) {
          throw new Error(`MCP server "${serverName}" has not been approved. Please approve it before loading.`);
        }
        return yield next(ctx, server);
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources(env_1);
      }
    });
  }
}
class FileBasedMcpApprovalStore {
  constructor(approvalsPath, cwd) {
    this.approvalsPath = approvalsPath;
    this.cwd = cwd;
    this.approvalsPromise = this.loadApprovals();
  }
  isServerApproved(serverName, server, _configPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvalKey = generateApprovalKey(serverName, server, this.cwd);
      const approvals = yield this.getApprovals();
      return approvals.includes(approvalKey);
    });
  }
  loadApprovals() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const approvalsContent = yield (0, promises_.readFile)(this.approvalsPath, "utf8");
        const parsed = JSON.parse(approvalsContent);
        // Ensure the parsed data is actually an array
        if (!Array.isArray(parsed)) {
          // Invalid format - reset approvals to empty array
          yield this.saveApprovalsToFile([]); // Clear invalid format in the file
          return [];
        }
        return parsed;
      } catch (e) {
        if (e instanceof Error && e.message.includes("ENOENT")) {
          // File doesn't exist yet, return empty array
          return [];
        }
        throw e;
      }
    });
  }
  getApprovals() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.approvalsPromise;
    });
  }
  addApproval(approvalKey) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      if (!approvals.includes(approvalKey)) {
        approvals.push(approvalKey);
        yield this.saveApprovals(approvals);
      }
    });
  }
  addApprovals(approvalKeys) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      const newKeys = approvalKeys.filter(key => !approvals.includes(key));
      if (newKeys.length > 0) {
        approvals.push(...newKeys);
        yield this.saveApprovals(approvals);
      }
    });
  }
  removeApproval(approvalKey) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      const filtered = approvals.filter(key => key !== approvalKey);
      if (filtered.length !== approvals.length) {
        yield this.saveApprovals(filtered);
      }
    });
  }
  clearApprovals(filter) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      const filtered = filter ? approvals.filter(key => !filter(key)) : [];
      if (filtered.length !== approvals.length) {
        yield this.saveApprovals(filtered);
      }
    });
  }
  saveApprovalsToFile(approvals) {
    return __awaiter(this, void 0, void 0, function* () {
      yield (0, promises_.mkdir)(external_node_path_.dirname(this.approvalsPath), {
        recursive: true
      });
      yield (0, promises_.writeFile)(this.approvalsPath, JSON.stringify(approvals, null, 2));
    });
  }
  saveApprovals(approvals) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.saveApprovalsToFile(approvals);
      this.approvalsPromise = Promise.resolve(approvals);
    });
  }
}
//# sourceMappingURL=approval-store.js.map
; // ../mcp-agent-exec/dist/cache.js
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
// EXTERNAL MODULE: ../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var lib = __webpack_require__("../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs");
; // ../mcp-agent-exec/dist/config.js
var config_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

// Local schema definitions for parsing .cursor/mcp.json
const commandBasedMcpServer = lib.z.object({
  command: lib.z.string(),
  args: lib.z.array(lib.z.string()).optional(),
  env: lib.z.record(lib.z.string(), lib.z.string()).optional()
});
const remoteMcpServer = lib.z.object({
  url: lib.z.string(),
  headers: lib.z.record(lib.z.string(), lib.z.string()).optional()
});
const mcpServerSchema = lib.z.union([commandBasedMcpServer, remoteMcpServer]);
const mcpConfigSchema = lib.z.object({
  mcpServers: lib.z.record(lib.z.string(), mcpServerSchema)
});
/**
 * Combine two MCP configs into one object.
 * - Entries from userConfig are included first
 * - Entries from projectConfig override user entries on name collisions
 */
function combineMcpConfigs(userConfig, projectConfig) {
  const combinedServers = {};
  if (userConfig) {
    for (const [serverName, serverConfig] of Object.entries(userConfig.mcpServers)) {
      combinedServers[serverName] = serverConfig;
    }
  }
  if (projectConfig) {
    for (const [serverName, serverConfig] of Object.entries(projectConfig.mcpServers)) {
      combinedServers[serverName] = serverConfig;
    }
  }
  return {
    mcpServers: combinedServers
  };
}
/**
 * Convenience helper specifically for our McpServerConfig shape.
 */
function getMcpConfig(configPath) {
  return config_awaiter(this, void 0, void 0, function* () {
    try {
      const configString = yield (0, promises_.readFile)(configPath, "utf8");
      return mcpConfigSchema.parse(JSON.parse(configString));
    } catch (_a) {
      // Return empty config if file doesn't exist or is invalid
      return {
        mcpServers: {}
      };
    }
  });
}
//# sourceMappingURL=config.js.map
; // ../mcp-agent-exec/dist/elicitation.js
/**
 * Types for MCP elicitation support.
 * Elicitation allows MCP tools to request additional information from users during execution.
 */
var elicitation_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
 * No-op elicitation provider that always declines requests.
 * Useful for testing or when elicitation is not supported.
 */
class NoopElicitationProvider {
  elicit(_request) {
    return elicitation_awaiter(this, void 0, void 0, function* () {
      return {
        action: "decline"
      };
    });
  }
}
/**
 * No-op elicitation provider factory that creates providers that always decline.
 */
class NoopElicitationProviderFactory {
  createProvider(_serverName, _toolName, _toolCallId) {
    return new NoopElicitationProvider();
  }
}
//# sourceMappingURL=elicitation.js.map
// EXTERNAL MODULE: ../local-exec/dist/index.js + 53 modules
var local_exec_dist = __webpack_require__("../local-exec/dist/index.js");
; // ../../node_modules/.pnpm/string-argv@0.3.2/node_modules/string-argv/index.js

function string_argv_parseArgsStringToArgv(value, env, file) {
  // ([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*) Matches nested quotes until the first space outside of quotes
  // [^\s'"]+ or Match if not a space ' or "
  // (['"])([^\5]*?)\5 or Match "quoted text" without quotes
  // `\3` and `\5` are a backreference to the quote style (' or ") captured
  var myRegexp = /([^\s'"]([^\s'"]*(['"])([^\3]*?)\3)+[^\s'"]*)|[^\s'"]+|(['"])([^\5]*?)\5/gi;
  var myString = value;
  var myArray = [];
  if (env) {
    myArray.push(env);
  }
  if (file) {
    myArray.push(file);
  }
  var match;
  do {
    // Each call to exec returns the next regex match as an array
    match = myRegexp.exec(myString);
    if (match !== null) {
      // Index 1 in the array is the captured group if it exists
      // Index 0 is the matched text, which we use if no captured group exists
      myArray.push(firstString(match[1], match[6], match[0]));
    }
  } while (match !== null);
  return myArray;
}
// Accepts any number of arguments, and returns the first one that is a string
// (even an empty string)
function firstString() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (typeof arg === "string") {
      return arg;
    }
  }
}
; // ../mcp-agent-exec/dist/loader.js
var loader_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var loader_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var loader_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
function _loadCommandBasedServer(ctx, serverName, commandBasedServer) {
  return loader_awaiter(this, void 0, void 0, function* () {
    var _a;
    // Handle separate args if provided, otherwise parse from command for legacy support
    let command;
    let args;
    if (commandBasedServer.args && commandBasedServer.args.length > 0) {
      // New format with separate command and args
      command = commandBasedServer.command;
      args = commandBasedServer.args;
    } else {
      // Legacy format - parse command string to extract args
      const parts = parseArgsStringToArgv(commandBasedServer.command);
      command = parts[0];
      args = parts.slice(1);
    }
    return McpSdkClient.fromCommand(ctx, serverName, command, args, (_a = commandBasedServer.env) !== null && _a !== void 0 ? _a : {}
    // elicitationFactory will be added here
    );
  });
}
function loadCommandBasedServerWithElicitation(ctx, serverName, commandBasedServer) {
  return loader_awaiter(this, void 0, void 0, function* () {
    var _a;
    // Handle separate args if provided, otherwise parse from command for legacy support
    let command;
    let args;
    if (commandBasedServer.args && commandBasedServer.args.length > 0) {
      // New format with separate command and args
      command = commandBasedServer.command;
      args = commandBasedServer.args;
    } else {
      // Legacy format - parse command string to extract args
      const parts = string_argv_parseArgsStringToArgv(commandBasedServer.command);
      command = parts[0];
      args = parts.slice(1);
    }
    return local_exec_dist.McpSdkClient.fromCommand(ctx, serverName, command, args, (_a = commandBasedServer.env) !== null && _a !== void 0 ? _a : {});
  });
}
function loadHttpServer(_ctx, serverName, remoteServer, tokenStorage, authRedirectUrl) {
  return loader_awaiter(this, void 0, void 0, function* () {
    return local_exec_dist.McpSdkClient.fromStreamableHttp(serverName, new URL(remoteServer.url), tokenStorage, remoteServer.headers, authRedirectUrl);
  });
}
function loadServer(ctx, serverName, server, configPath, tokenStorage, middlewares, authRedirectUrlGenerator) {
  return loader_awaiter(this, void 0, void 0, function* () {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = loader_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("mcp-agent-exec.loadServer")), false);
      span.span.setAttribute("serverName", serverName);
      let next = (previousCtx, server) => loader_awaiter(this, void 0, void 0, function* () {
        const env_2 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const nextSpan = loader_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(previousCtx.withName("loadServer.next")), false);
          nextSpan.span.setAttribute("serverName", serverName);
          const ctx = nextSpan.ctx;
          if ("command" in server) {
            nextSpan.span.setAttribute("kind", "command");
            return yield loadCommandBasedServerWithElicitation(ctx, serverName, server);
          } else if ("url" in server) {
            nextSpan.span.setAttribute("kind", "url");
            const authRedirectUrl = authRedirectUrlGenerator === null || authRedirectUrlGenerator === void 0 ? void 0 : authRedirectUrlGenerator(serverName);
            return yield loadHttpServer(ctx, serverName, server, tokenStorage, authRedirectUrl);
          } else {
            throw new Error(`Invalid server: ${JSON.stringify(server)}`);
          }
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          loader_disposeResources(env_2);
        }
      });
      for (const middleware of middlewares) {
        const previousNext = next;
        next = (ctx, server) => loader_awaiter(this, void 0, void 0, function* () {
          return yield middleware.load(ctx, serverName, server, configPath, previousNext);
        });
      }
      return yield next(span.ctx, server);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      loader_disposeResources(env_1);
    }
  });
}
class NoOpTokenStorage {
  constructor(inner) {
    this.inner = inner;
  }
  loadTokens() {
    return loader_awaiter(this, void 0, void 0, function* () {
      return undefined;
    });
  }
  loadClientInformation() {
    return loader_awaiter(this, void 0, void 0, function* () {
      return undefined;
    });
  }
  saveTokens(tokens) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.inner.saveTokens(tokens);
    });
  }
  saveClientInformation(clientInfo) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.inner.saveClientInformation(clientInfo);
    });
  }
}
// Adapter to scope global token storage to a specific identifier
class IdentifierScopedTokenStorage {
  constructor(storage, identifier) {
    this.storage = storage;
    this.identifier = identifier;
  }
  loadTokens() {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.loadTokens(this.identifier);
    });
  }
  saveTokens(tokens) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.saveTokens(this.identifier, tokens);
    });
  }
  loadClientInformation() {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.loadClientInformation(this.identifier);
    });
  }
  saveClientInformation(clientInfo) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.saveClientInformation(this.identifier, clientInfo);
    });
  }
}
/**
 * Middleware that blocks servers based on a denylist
 */
class ServerBlockingMiddleware {
  constructor(blockingService) {
    this.blockingService = blockingService;
  }
  load(ctx, serverName, server, _configPath, next) {
    return loader_awaiter(this, void 0, void 0, function* () {
      const isBlocked = yield this.blockingService.isServerBlocked({
        command: "command" in server ? server.command : undefined,
        url: "url" in server ? server.url : undefined
      });
      if (isBlocked) {
        throw new Error(`MCP server "${serverName}" is blocked by team policy or denylist`);
      }
      return next(ctx, server);
    });
  }
}
class FileConfigMcpLoader {
  constructor(configPath, tokenStorage, middlewares = [], authRedirectUrlGenerator, elicitationFactory) {
    this.configPath = configPath;
    this.tokenStorage = tokenStorage;
    this.middlewares = middlewares;
    this.authRedirectUrlGenerator = authRedirectUrlGenerator;
    this.elicitationFactory = elicitationFactory;
    const configPromise = getMcpConfig(configPath);
    this.configPromise = configPromise;
  }
  static init(tokenStorage, configPath, middlewares = []) {
    return new FileConfigMcpLoader(configPath, tokenStorage, middlewares);
  }
  load(ctx_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, cache = true) {
      const env_3 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const _span = loader_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("FileConfigMcpLoader.load")), false);
        // If cache is false, reload the config instead of using the cached promise
        const config = cache ? yield this.configPromise : yield getMcpConfig(this.configPath);
        const clients = {};
        // Load all servers from the config
        yield Promise.all(Object.entries(config.mcpServers).map(_a => loader_awaiter(this, [_a], void 0, function* ([identifier, serverConfig]) {
          try {
            // Create scoped token storage for this server
            const scopedTokenStorage = new IdentifierScopedTokenStorage(this.tokenStorage, identifier);
            const client = yield loadServer(ctx, identifier, serverConfig, this.configPath, scopedTokenStorage, this.middlewares, this.authRedirectUrlGenerator);
            clients[identifier] = client;
          } catch (error) {
            console.error(`Failed to load MCP server "${identifier}":`, error);
            // Continue loading other servers even if one fails
          }
        })));
        return new local_exec_dist.McpManager(clients, this.elicitationFactory);
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        loader_disposeResources(env_3);
      }
    });
  }
  loadClient(ctx, identifier, ignoreTokens) {
    return loader_awaiter(this, void 0, void 0, function* () {
      const env_4 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const _span = loader_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("FileConfigMcpLoader.loadClient")), false);
        const config = yield this.configPromise;
        const serverConfig = config.mcpServers[identifier];
        if (!serverConfig) {
          throw new Error(`MCP server "${identifier}" not found in config`);
        }
        const inner = new IdentifierScopedTokenStorage(this.tokenStorage, identifier);
        // Create scoped token storage or no-op storage
        const tokenStorage = ignoreTokens ? new NoOpTokenStorage(inner) : inner;
        return yield loadServer(ctx, identifier, serverConfig, this.configPath, tokenStorage, this.middlewares, this.authRedirectUrlGenerator);
      } catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
      } finally {
        loader_disposeResources(env_4);
      }
    });
  }
}
//# sourceMappingURL=loader.js.map
; // ../mcp-agent-exec/dist/test-utils.js
var test_utils_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
 * Simple in-memory token storage implementation for testing purposes.
 * Stores OAuth tokens and client information in memory without persistence.
 */
class InMemoryTokenStorage {
  constructor() {
    this.tokens = new Map();
    this.clientInfo = new Map();
  }
  loadTokens(identifier) {
    return test_utils_awaiter(this, void 0, void 0, function* () {
      return this.tokens.get(identifier);
    });
  }
  saveTokens(identifier, tokens) {
    return test_utils_awaiter(this, void 0, void 0, function* () {
      this.tokens.set(identifier, tokens);
    });
  }
  loadClientInformation(identifier) {
    return test_utils_awaiter(this, void 0, void 0, function* () {
      return this.clientInfo.get(identifier);
    });
  }
  saveClientInformation(identifier, clientInfo) {
    return test_utils_awaiter(this, void 0, void 0, function* () {
      this.clientInfo.set(identifier, clientInfo);
    });
  }
}
/**
 * Mock elicitation provider for testing.
 * Allows setting up pre-defined responses for elicitation requests.
 * Tracks the correlation between tool calls and elicitation requests.
 */
class MockElicitationProvider {
  constructor(serverName, toolName, toolCallId) {
    this.serverName = serverName;
    this.toolName = toolName;
    this.toolCallId = toolCallId;
    this.responses = [];
    this.requests = [];
    console.info(`[MockElicitationProvider] Created for server '${serverName}', tool '${toolName}', toolCallId: ${toolCallId || "none"}`);
  }
  /**
   * Add a response that will be returned on the next elicit call
   */
  addResponse(response) {
    this.responses.push(response);
  }
  elicit(request) {
    return test_utils_awaiter(this, void 0, void 0, function* () {
      console.info(`[MockElicitationProvider] Elicitation request for tool '${this.toolName}' (toolCallId: ${this.toolCallId || "none"}): ${request.message}`);
      this.requests.push(request);
      if (this.responses.length === 0) {
        // Default: decline if no response is configured
        console.info(`[MockElicitationProvider] No pre-configured response, declining for tool '${this.toolName}' (toolCallId: ${this.toolCallId || "none"})`);
        return {
          action: "decline"
        };
      }
      const response = this.responses.shift();
      console.info(`[MockElicitationProvider] Returning ${response.action} response for tool '${this.toolName}' (toolCallId: ${this.toolCallId || "none"})`);
      return response;
    });
  }
}
/**
 * Mock elicitation provider factory for testing.
 * Tracks all created providers and allows pre-configuring responses.
 */
class MockElicitationProviderFactory {
  constructor() {
    this.providers = [];
    this.responseQueue = [];
  }
  /**
   * Add a response that will be used by the next created provider
   */
  addResponse(response) {
    this.responseQueue.push(response);
  }
  createProvider(serverName, toolName, toolCallId) {
    const provider = new MockElicitationProvider(serverName, toolName, toolCallId);
    // Transfer all queued responses to this provider
    while (this.responseQueue.length > 0) {
      provider.addResponse(this.responseQueue.shift());
    }
    this.providers.push(provider);
    return provider;
  }
}
//# sourceMappingURL=test-utils.js.map
; // ../mcp-agent-exec/dist/token-store.js
var token_store_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class FileBasedTokenStore {
  constructor(mcpAuthPath) {
    this.mcpAuthPath = mcpAuthPath;
    this.saveLock = Promise.resolve();
    this.mcpAuthPromise = this.loadMcpAuth();
  }
  loadMcpAuth() {
    return token_store_awaiter(this, void 0, void 0, function* () {
      try {
        const mcpAuth = yield (0, promises_.readFile)(this.mcpAuthPath, "utf8");
        const data = JSON.parse(mcpAuth);
        // Handle legacy format (direct token storage at root level)
        if (data && typeof data === "object") {
          // Check if it's the old format with direct token storage
          const hasDirectTokens = Object.values(data).some(value => value && typeof value === "object" && value !== null && ("access_token" in value || "refresh_token" in value) && !("tokens" in value) && !("clientInfo" in value));
          if (hasDirectTokens) {
            // Convert legacy format: { identifier: OAuthTokens } -> { identifier: { tokens: OAuthTokens } }
            const converted = {};
            for (const [key, value] of Object.entries(data)) {
              converted[key] = {
                tokens: value
              };
            }
            return converted;
          }
          // Handle new format or mixed format
          const result = {};
          for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === "object" && value !== null) {
              result[key] = {
                tokens: "tokens" in value ? value.tokens : undefined,
                clientInfo: "clientInfo" in value ? value.clientInfo : undefined
              };
            }
          }
          return result;
        }
        return {};
      } catch (e) {
        if (e instanceof Error && e.message.includes("ENOENT")) {
          return {};
        }
        throw e;
      }
    });
  }
  loadTokens(identifier) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      var _a;
      const mcpAuth = yield this.mcpAuthPromise;
      return (_a = mcpAuth[identifier]) === null || _a === void 0 ? void 0 : _a.tokens;
    });
  }
  saveTokens(identifier, tokens) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      yield this.withSaveLock(() => token_store_awaiter(this, void 0, void 0, function* () {
        const mcpAuth = yield this.mcpAuthPromise;
        if (!mcpAuth[identifier]) {
          mcpAuth[identifier] = {};
        }
        mcpAuth[identifier].tokens = tokens;
        yield this.saveMcpAuth(mcpAuth);
      }));
    });
  }
  loadClientInformation(identifier) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      var _a;
      const mcpAuth = yield this.mcpAuthPromise;
      return (_a = mcpAuth[identifier]) === null || _a === void 0 ? void 0 : _a.clientInfo;
    });
  }
  withSaveLock(fn) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      const previousLock = this.saveLock;
      let releaseLock;
      this.saveLock = new Promise(resolve => {
        releaseLock = resolve;
      });
      try {
        yield previousLock;
        return yield fn();
      } finally {
        releaseLock();
      }
    });
  }
  saveClientInformation(identifier, clientInfo) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      yield this.withSaveLock(() => token_store_awaiter(this, void 0, void 0, function* () {
        const mcpAuth = yield this.mcpAuthPromise;
        if (!mcpAuth[identifier]) {
          mcpAuth[identifier] = {};
        }
        mcpAuth[identifier].clientInfo = clientInfo;
        yield this.saveMcpAuth(mcpAuth);
      }));
    });
  }
  saveMcpAuth(data) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      yield (0, promises_.mkdir)(external_node_path_.dirname(this.mcpAuthPath), {
        recursive: true
      });
      yield (0, promises_.writeFile)(this.mcpAuthPath, JSON.stringify(data, null, 2));
    });
  }
}
//# sourceMappingURL=token-store.js.map
; // ../mcp-agent-exec/dist/index.js

//# sourceMappingURL=index.js.map

/***/