const DEFAULT_CONFIG = {
  version: 1,
  editor: {
    vimMode: false
  },
  display: {
    showLineNumbers: true
  },
  permissions: {
    allow: ["Shell(ls)"
    // Example MCP allowlist entries:
    // "Mcp(*:*)" - allows all MCP tools from all servers
    // "Mcp(server-name:*)" - allows all tools from server-name
    // "Mcp(*:tool-name)" - allows tool-name from any server
    // "Mcp(server-name:tool-name)" - allows specific tool from specific server
    ],
    deny: []
  },
  hasChangedDefaultModel: false,
  model: new agent_pb /* ModelDetails */.Gm({
    modelId: "gpt-5",
    displayModelId: "gpt-5",
    displayName: "GPT-5",
    displayNameShort: "GPT-5",
    aliases: ["gpt-5"]
  }),
  network: {
    useHttp1ForAgent: false
  },
  approvalMode: "allowlist",
  sandbox: {
    mode: "disabled",
    networkAccess: "allowlist"
  }
};
// Only used for debugging
class DefaultConfigProvider {
  constructor() {
    this.config = DEFAULT_CONFIG;
  }
  get() {
    return this.config;
  }
  transform(transform) {
    this.config = transform(this.config);
    return Promise.resolve(this.config);
  }
}