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

/**
 * Wrapper that prefixes all identifiers before passing to underlying storage.
 * This allows multiple loaders to share storage without identifier conflicts.
 */
class PrefixedTokenStorage {
  constructor(storage, prefix) {
    this.storage = storage;
    this.prefix = prefix;
  }
  loadTokens(identifier) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.loadTokens(this.prefix + identifier);
    });
  }
  saveTokens(identifier, tokens) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.saveTokens(this.prefix + identifier, tokens);
    });
  }
  loadClientInformation(identifier) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.loadClientInformation(this.prefix + identifier);
    });
  }
  saveClientInformation(identifier, clientInfo) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.saveClientInformation(this.prefix + identifier, clientInfo);
    });
  }
}
/**
 * Wrapper that prefixes server names before passing to underlying approval service.
 * This allows multiple loaders to share approval storage without identifier conflicts.
 */
class PrefixedApprovalStorage {
  constructor(storage, prefix) {
    this.storage = storage;
    this.prefix = prefix;
  }
  isServerApproved(serverName, server, configPath) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.isServerApproved(this.prefix + serverName, server, configPath);
    });
  }
}
/**
 * MCP loader that merges multiple loaders together.
 * Loaders are checked in order, with earlier loaders taking precedence.
 */
class MergedMcpLoader {
  constructor(loaders) {
    this.loaders = loaders;
  }
  load(ctx_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, cache = true) {
      // Load all managers from each loader, passing cache parameter down
      const managers = yield Promise.all(this.loaders.map(({
        loader
      }) => loader.load(ctx, cache)));
      // Combine clients maps, with earlier loaders taking precedence
      const combinedClients = {};
      for (let i = 0; i < managers.length; i++) {
        const manager = managers[i];
        const prefix = this.loaders[i].prefix;
        const clients = manager.getClients();
        for (const [name, client] of Object.entries(clients)) {
          const prefixedName = prefix + name;
          // Only add if not already present (earlier loaders take precedence)
          if (!(prefixedName in combinedClients)) {
            combinedClients[prefixedName] = client;
          }
        }
      }
      return new dist.McpManager(combinedClients);
    });
  }
  loadClient(ctx_1, identifier_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, identifier, ignoreTokens = false) {
      // Search through loaders in order
      for (const {
        loader,
        prefix
      } of this.loaders) {
        if (!identifier.startsWith(prefix)) {
          continue;
        }
        identifier = identifier.slice(prefix.length);
        try {
          const client = yield loader.loadClient(ctx, identifier, ignoreTokens);
          return client;
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found in config")) {
            continue;
          }
          throw error;
        }
      }
      throw new Error(`MCP client "${identifier}" not found in config`);
    });
  }
}
/**
 * MCP loader that uses Cursor's config directory (~/.cursor)
 */
class CursorConfigMcpLoader {
  constructor(basePath, tokenStorage, cacheStorage, _teamSettingsService, _approvalStorage, _ignorePrefix = false, authRedirectUrlGenerator) {
    this.cacheStorage = cacheStorage;
    const basePaths = Array.isArray(basePath) ? basePath : [basePath];
    const userConfigPath = external_node_path_.join((0, external_node_os_.homedir)(), ".cursor", "mcp.json");
    const configPaths = [];
    for (let i = 0; i < basePaths.length; i++) {
      const basePath = basePaths[i];
      const configPath = external_node_path_.join(basePath, ".cursor", "mcp.json");
      const folderName = external_node_path_.basename(basePath);
      const prefix = `project-${i}-${folderName}-`;
      configPaths.push({
        path: configPath,
        prefix
      });
    }
    // Add user config
    configPaths.push({
      path: userConfigPath,
      prefix: "user-"
    });
    // Deduplicate paths, with user- taking precedence
    const uniqueConfigs = new Map();
    for (const {
      path,
      prefix
    } of configPaths) {
      if (!uniqueConfigs.has(path) || prefix === "user-") {
        uniqueConfigs.set(path, prefix);
      }
    }
    const loaders = [];
    for (const [configPath, prefix] of uniqueConfigs) {
      const effectivePrefix = _ignorePrefix ? "" : prefix;
      // Wrap token storage with prefix to avoid identifier conflicts
      const prefixedTokenStorage = new PrefixedTokenStorage(tokenStorage, effectivePrefix);
      // Wrap approval storage with prefix to avoid identifier conflicts
      const prefixedApprovalStorage = new PrefixedApprovalStorage(_approvalStorage, effectivePrefix);
      const middlewares = [new mcp_agent_exec_dist /* CachingMiddleware */.mz(cacheStorage), new mcp_agent_exec_dist /* ServerApprovalMiddleware */.$b(prefixedApprovalStorage), new mcp_agent_exec_dist /* ServerBlockingMiddleware */.XV(_teamSettingsService)];
      loaders.push({
        prefix: effectivePrefix,
        loader: new mcp_agent_exec_dist /* FileConfigMcpLoader */.gT(configPath, prefixedTokenStorage, middlewares, authRedirectUrlGenerator)
      });
    }
    this.loader = new MergedMcpLoader(loaders);
  }
  /**
   * Initialize a CursorConfigMcpLoader with file-based storage
   * @param teamSettingsService Service to check if servers are blocked
   * @param basePath Base path for MCP config resolution
   * @param projectPath Path to store MCP data (auth, cache, approvals)
   * @param ignoreApprovals If true, skip MCP approval checks (auto-approve all servers)
   */
  static init(teamSettingsService, basePath, projectPath, ignoreApprovals = false) {
    const tokenStore = new mcp_agent_exec_dist /* FileBasedTokenStore */.Q7(external_node_path_.join(projectPath, "mcp-auth.json"));
    const cacheStorage = new mcp_agent_exec_dist /* FileBasedMcpCacheStore */.nL(external_node_path_.join(projectPath, "mcp-cache.json"));
    const approvalStorage = ignoreApprovals ? {
      isServerApproved: () => Promise.resolve(true)
    } : new mcp_agent_exec_dist /* FileBasedMcpApprovalStore */.mF(external_node_path_.join(projectPath, "mcp-approvals.json"), basePath);
    return new CursorConfigMcpLoader(basePath, tokenStore, cacheStorage, teamSettingsService, approvalStorage, true);
  }
  load(ctx_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, cache = true) {
      return this.loader.load(ctx, cache);
    });
  }
  loadClient(ctx_1, identifier_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, identifier, ignoreTokens = false) {
      return this.loader.loadClient(ctx, identifier, ignoreTokens);
    });
  }
}