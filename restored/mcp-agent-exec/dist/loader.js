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