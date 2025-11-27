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