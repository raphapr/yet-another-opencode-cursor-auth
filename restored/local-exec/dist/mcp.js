var mcp_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var mcp_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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

// Approx. threshold for streaming MCP text content to file in characters.
const MCP_TEXT_FILE_THRESHOLD = 40000;
// Approx maximum output file size in characters.
const MAX_OUTPUT_FILE_SIZE = 1024 * 1024 * 50;
class AsyncCache {
  constructor(ttl = 1000 * 60 * 60 * 24) {
    this.ttl = ttl;
  }
  async get(fetcher) {
    if (this.state && this.state.expiresAt > performance.now()) {
      return this.state.value;
    }
    const value = await fetcher();
    this.state = {
      expiresAt: performance.now() + this.ttl,
      value
    };
    return value;
  }
}
// OAuth constants and in-memory provider (no auto-open; stores redirect URL)
const CALLBACK_PORT = 8787;
const CALLBACK_PATH = "/callback";
const CALLBACK_URL = `http://localhost:${CALLBACK_PORT}${CALLBACK_PATH}`;
class InMemoryOAuthClientProvider {
  constructor(_redirectUrl, _clientMetadata, _tokens, _clientInformation, _saveTokens, _saveClientInformation) {
    this._redirectUrl = _redirectUrl;
    this._clientMetadata = _clientMetadata;
    this._tokens = _tokens;
    this._clientInformation = _clientInformation;
    this._saveTokens = _saveTokens;
    this._saveClientInformation = _saveClientInformation;
  }
  get redirectUrl() {
    return this._redirectUrl;
  }
  get clientMetadata() {
    return this._clientMetadata;
  }
  clientInformation() {
    return this._clientInformation;
  }
  hasClientInformation() {
    return this._clientInformation !== undefined;
  }
  async saveClientInformation(info) {
    this._clientInformation = info;
    await this._saveClientInformation(info);
  }
  tokens() {
    return this._tokens;
  }
  async saveTokens(tokens) {
    this._tokens = tokens;
    await this._saveTokens(tokens);
  }
  redirectToAuthorization(authorizationUrl) {
    // Do not auto-open. Simply save the redirect URL for later use.
    this._lastRedirectUrl = authorizationUrl;
  }
  get lastRedirectUrl() {
    return this._lastRedirectUrl;
  }
  async saveCodeVerifier(codeVerifier) {
    this._codeVerifier = codeVerifier;
  }
  codeVerifier() {
    if (!this._codeVerifier) throw new Error("No code verifier saved");
    return this._codeVerifier;
  }
}
const commandBasedMcpServer = zod_lib.z.object({
  command: zod_lib.z.string(),
  args: zod_lib.z.array(zod_lib.z.string()).optional(),
  env: zod_lib.z.record(zod_lib.z.string(), zod_lib.z.string()).optional()
});
const remoteMcpServer = zod_lib.z.object({
  url: zod_lib.z.string(),
  headers: zod_lib.z.record(zod_lib.z.string(), zod_lib.z.string()).optional()
});
const mcpServerSchema = zod_lib.z.union([commandBasedMcpServer, remoteMcpServer]);
const mcpConfigSchema = zod_lib.z.object({
  mcpServers: zod_lib.z.record(zod_lib.z.string(), mcpServerSchema)
});
class McpSdkClient {
  constructor(serverName, client, options) {
    this._callToolLock = Promise.resolve();
    this.serverName = serverName;
    this.client = client;
    this.tools = new AsyncCache();
    this.stateValue = options.initialState;
    this._authProvider = options.authProvider;
    // Always set up elicitation handler - it will dispatch to the current provider if available
    this.setupElicitationHandler();
  }
  static createClient() {
    return new client /* Client */.K({
      name: "Cursor",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: true,
        prompts: true,
        resources: true,
        logging: false,
        elicitation: {}
      }
    });
  }
  setupElicitationHandler() {
    this.client.setRequestHandler(esm_types /* ElicitRequestSchema */.$9, async request => {
      if (!this._currentElicitationProvider) {
        // No active elicitation provider, decline the request
        return {
          action: "decline"
        };
      }
      try {
        const response = await this._currentElicitationProvider.elicit({
          message: request.params.message,
          requestedSchema: request.params.requestedSchema
        });
        // Return the response matching the MCP SDK expected type
        return {
          action: response.action,
          content: response.content
        };
      } catch (_error) {
        return {
          action: "decline"
        };
      }
    });
  }
  static async fromStreamableHttp(serverName, url, tokenStorage, headers, authRedirectUrl) {
    const tokens = await tokenStorage.loadTokens();
    const clientInformation = await tokenStorage.loadClientInformation();
    authRedirectUrl = authRedirectUrl ?? CALLBACK_URL;
    const oauthProvider = new InMemoryOAuthClientProvider(authRedirectUrl, {
      redirect_uris: [authRedirectUrl],
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      client_name: "Cursor"
    }, tokens, clientInformation, newTokens => tokenStorage.saveTokens(newTokens), clientInfo => tokenStorage.saveClientInformation(clientInfo));
    const transport = new StreamableHTTPClientTransport(url, {
      authProvider: oauthProvider,
      requestInit: {
        headers: {
          "User-Agent": "Cursor/1.0.0",
          ...(headers ?? {})
        }
      }
    });
    const client = McpSdkClient.createClient();
    try {
      await client.connect(transport);
      return new McpSdkClient(serverName, client, {
        initialState: {
          kind: "ready"
        },
        authProvider: oauthProvider
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        const url = oauthProvider.lastRedirectUrl?.toString?.() ?? "";
        const mcpClient = new McpSdkClient(serverName, client, {
          initialState: {
            kind: "requires_authentication",
            url,
            callback: async code => {
              try {
                // Check if client registration has completed
                if (!oauthProvider.hasClientInformation()) {
                  throw new Error("OAuth client registration has not completed. The MCP server may not support dynamic client registration or the registration failed.");
                }
                await transport.finishAuth(code);
                // Update the client state to ready after successful authentication
                mcpClient.updateState({
                  kind: "ready"
                });
              } catch (authError) {
                // If authentication fails, provide a more specific error message
                const errorMessage = authError instanceof Error ? authError.message : "Authentication failed";
                throw new Error(`Authentication callback failed: ${errorMessage}`);
              }
            }
          },
          authProvider: oauthProvider
        });
        return mcpClient;
      }
      throw error;
    }
  }
  static async fromCommand(ctx, serverName, command, args, env) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.fromCommand")), false);
      const transport = new StdioClientTransport({
        command,
        args,
        env,
        stderr: "ignore"
      });
      const client = McpSdkClient.createClient();
      await client.connect(transport);
      return new McpSdkClient(serverName, client, {
        initialState: {
          kind: "ready"
        }
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      mcp_disposeResources(env_1);
    }
  }
  async getTools(ctx) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.getTools")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return [];
      }
      return this.tools.get(async () => {
        let cursor;
        const tools = [];
        while (true) {
          const response = await this.client.listTools({
            cursor
          });
          tools.push(...response.tools.map(tool => ({
            ...tool,
            inputSchema: tool.inputSchema,
            outputSchema: tool.outputSchema
          })));
          cursor = response.nextCursor;
          if (cursor === undefined) break;
        }
        return tools;
      });
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      mcp_disposeResources(env_2);
    }
  }
  async callTool(ctx, name, args, toolCallId, elicitationProvider) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.callTool")), false);
      span.span.setAttribute("toolName", name);
      // Acquire lock to ensure exclusive access to elicitation provider context
      const previousLock = this._callToolLock;
      let releaseLock;
      this._callToolLock = new Promise(resolve => {
        releaseLock = resolve;
      });
      try {
        // Wait for previous tool call to complete
        await previousLock;
        // Store tool call context for elicitation correlation
        this._currentToolCallId = toolCallId;
        this._currentToolName = name;
        this._currentElicitationProvider = elicitationProvider;
        try {
          const response = await this.client.callTool({
            name,
            arguments: args
          });
          return {
            content: response.content,
            isError: response.error !== undefined
          };
        } finally {
          this._currentElicitationProvider = undefined;
          this._currentToolCallId = undefined;
          this._currentToolName = undefined;
        }
      } finally {
        // Release lock for next tool call
        releaseLock();
      }
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      mcp_disposeResources(env_3);
    }
  }
  async getInstructions(ctx) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.getInstructions")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return undefined;
      }
      return await this.client.getInstructions();
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      mcp_disposeResources(env_4);
    }
  }
  async listResources(ctx) {
    const env_5 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.listResources")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return {
          resources: []
        };
      }
      let cursor;
      const resources = [];
      while (true) {
        const response = await this.client.listResources({
          cursor
        });
        resources.push(...response.resources);
        cursor = response.nextCursor;
        if (cursor === undefined) break;
      }
      return {
        resources
      };
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      mcp_disposeResources(env_5);
    }
  }
  async readResource(ctx, args) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.readResource")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return {
          contents: []
        };
      }
      const response = await this.client.readResource({
        uri: args.uri
      });
      return {
        contents: response.contents
      };
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      mcp_disposeResources(env_6);
    }
  }
  async listPrompts(ctx) {
    const env_7 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_7, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.listPrompts")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return [];
      }
      const capabilities = this.client.getServerCapabilities() ?? {
        prompts: false
      };
      if (!capabilities.prompts) {
        return [];
      }
      const response = await this.client.listPrompts();
      if (!response?.prompts) {
        return [];
      }
      return response.prompts.map(prompt => ({
        name: prompt.name,
        description: prompt.description,
        arguments: prompt.arguments?.map(arg => ({
          name: arg.name,
          description: arg.description,
          required: arg.required
        }))
      }));
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      mcp_disposeResources(env_7);
    }
  }
  async getPrompt(ctx, name, args) {
    const env_8 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_8, (0, dist /* createSpan */.VI)(ctx.withName("McpSdkClient.getPrompt")), false);
      if (this.stateValue.kind === "requires_authentication") {
        return {
          messages: []
        };
      }
      const response = await this.client.getPrompt({
        name,
        arguments: args
      });
      return {
        messages: response.messages.map(msg => ({
          role: msg.role,
          content: Array.isArray(msg.content) ? msg.content.map(content => {
            if (content.type === "text") {
              return {
                type: "text",
                text: content.text
              };
            } else if (content.type === "image") {
              return {
                type: "image",
                data: content.data,
                mimeType: content.mimeType
              };
            }
            // Fallback for unknown content types
            return {
              type: "text",
              text: JSON.stringify(content)
            };
          }) : [{
            type: "text",
            text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
          }]
        }))
      };
    } catch (e_8) {
      env_8.error = e_8;
      env_8.hasError = true;
    } finally {
      mcp_disposeResources(env_8);
    }
  }
  /**
   * Get the current tool call context for debugging.
   * This shows which tool is currently being executed and can be used to correlate
   * elicitation requests with their corresponding tool calls.
   * @returns Object with current tool name and toolCallId, or undefined if no tool is executing
   */
  getCurrentToolCallContext() {
    if (this._currentToolName) {
      return {
        toolName: this._currentToolName,
        toolCallId: this._currentToolCallId
      };
    }
    return undefined;
  }
  // Observable state API
  async getState(_ctx) {
    return this.stateValue;
  }
  updateState(newState) {
    this.stateValue = newState;
  }
}
class ExecutableMcpToolSet {
  constructor(tools) {
    this.tools = tools;
  }
  async execute(name, args, toolCallId, elicitationFactory) {
    const tool = this.tools[name];
    if (!tool) {
      throw new Error(`Tool ${name} not found, available tools: ${Object.keys(this.tools).join(", ")}`);
    }
    return tool.execute(args, toolCallId, elicitationFactory);
  }
  getTools() {
    return Object.entries(this.tools).map(([name, tool]) => ({
      ...tool.definition,
      name
    }));
  }
}
class LazyMcpToolSetLease {
  constructor(toolSetPromise) {
    this.toolSetPromise = toolSetPromise;
  }
  async getToolSet(ctx) {
    const env_9 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = mcp_addDisposableResource(env_9, (0, dist /* createSpan */.VI)(ctx.withName("LazyMcpToolSetLease.getToolSet")), false);
      try {
        return await this.toolSetPromise;
      } catch (_error) {
        return new ExecutableMcpToolSet({});
      }
    } catch (e_9) {
      env_9.error = e_9;
      env_9.hasError = true;
    } finally {
      mcp_disposeResources(env_9);
    }
  }
  async getTools(ctx) {
    try {
      const toolSet = await this.getToolSet(ctx);
      return toolSet.getTools();
    } catch (_error) {
      return [];
    }
  }
  withTimeout(timeout) {
    let timeoutId;
    const timeoutPromise = new Promise(resolve => {
      timeoutId = setTimeout(() => {
        resolve(new ExecutableMcpToolSet({}));
      }, timeout);
    });
    const racedPromise = Promise.race([this.toolSetPromise, timeoutPromise]).finally(() => {
      clearTimeout(timeoutId);
    });
    return new LazyMcpToolSetLease(racedPromise);
  }
}
class NoopMcpLease {
  async getClients() {
    return {};
  }
  async getClient(_name) {
    return undefined;
  }
  async getInstructions(_ctx) {
    return [];
  }
  async getToolSet() {
    return new ExecutableMcpToolSet({});
  }
  async getTools(_ctx) {
    return [];
  }
}
class ManagerMcpLease {
  constructor(manager) {
    this.manager = manager;
  }
  async getClients() {
    return this.manager.getClients();
  }
  async getClient(name) {
    return this.manager.getClient(name);
  }
  async getInstructions(ctx) {
    const env_10 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_10, (0, dist /* createSpan */.VI)(ctx.withName("ManagerMcpLease.getInstructions")), false);
      return await this.manager.getInstructions(span.ctx);
    } catch (e_10) {
      env_10.error = e_10;
      env_10.hasError = true;
    } finally {
      mcp_disposeResources(env_10);
    }
  }
  async getToolSet(ctx) {
    const env_11 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_11, (0, dist /* createSpan */.VI)(ctx.withName("ManagerMcpLease.getToolSet")), false);
      return await this.manager.getToolSet(span.ctx);
    } catch (e_11) {
      env_11.error = e_11;
      env_11.hasError = true;
    } finally {
      mcp_disposeResources(env_11);
    }
  }
  async getTools(ctx) {
    const env_12 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_12, (0, dist /* createSpan */.VI)(ctx.withName("ManagerMcpLease.getTools")), false);
      const toolSet = await this.getToolSet(span.ctx);
      return toolSet.getTools();
    } catch (e_12) {
      env_12.error = e_12;
      env_12.hasError = true;
    } finally {
      mcp_disposeResources(env_12);
    }
  }
}
class McpManager {
  constructor(clients, elicitationFactory) {
    this.clients = clients;
    this.elicitationFactory = elicitationFactory;
  }
  getClients() {
    return this.clients;
  }
  getClient(name) {
    return this.clients[name];
  }
  setClient(name, client) {
    this.clients[name] = client;
  }
  deleteClient(name) {
    delete this.clients[name];
  }
  async getToolSet(ctx) {
    const env_13 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_13, (0, dist /* createSpan */.VI)(ctx.withName("McpManager.getToolSet")), false);
      const clientTools = await (0, utils_dist /* asyncMapValues */.PH)(Object.entries(this.clients), ([_, client]) => client.getTools(span.ctx).then(tools => tools.map(tool => ({
        ...tool,
        clientName: client.serverName,
        client: client
      })))
      // probably should tell the user that the mcp client errored
      .catch(() => []), {
        max: 4
      });
      const tools = Array.from(clientTools.values()).flat();
      const toolsMap = {};
      for (const tool of tools) {
        toolsMap[`${tool.clientName}-${tool.name}`] = {
          definition: {
            ...tool,
            providerIdentifier: tool.clientName,
            toolName: tool.name
          },
          execute: async (args, toolCallId, elicitationFactory) => {
            // Create elicitation provider for this specific tool call
            const elicitationProvider = elicitationFactory?.createProvider(tool.clientName, tool.name, toolCallId);
            const result = await tool.client.callTool(span.ctx, tool.name, args, toolCallId, elicitationProvider);
            return result;
          }
        };
      }
      return new ExecutableMcpToolSet(toolsMap);
    } catch (e_13) {
      env_13.error = e_13;
      env_13.hasError = true;
    } finally {
      mcp_disposeResources(env_13);
    }
  }
  async getInstructions(ctx) {
    const instructionResults = await (0, utils_dist /* asyncMapSettledValues */.up)(Object.entries(this.clients), async ([identifier, client]) => {
      const env_14 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const span = mcp_addDisposableResource(env_14, (0, dist /* createSpan */.VI)(ctx.withName("McpManager.getInstructions.forServer")), false);
        span.span.setAttribute("serverName", identifier);
        const state = await client.getState(span.ctx);
        if (state.kind !== "ready") {
          return null;
        }
        const instructions = await client.getInstructions(span.ctx);
        if (!instructions || instructions.trim().length === 0) {
          return null;
        }
        return new mcp_pb /* McpInstructions */.I0({
          serverName: client.serverName,
          instructions: instructions.trim()
        });
      } catch (e_14) {
        env_14.error = e_14;
        env_14.hasError = true;
      } finally {
        mcp_disposeResources(env_14);
      }
    }, {
      max: 4
    });
    return instructionResults.filter(result => result.status === "fulfilled" && result.value !== null).map(result => result.value);
  }
}
class LocalMcpToolExecutor {
  constructor(toolSet, permissionsService, pendingDecisionProvider, projectDir, fileOutputThresholdBytes = MCP_TEXT_FILE_THRESHOLD, elicitationFactory) {
    this.toolSet = toolSet;
    this.permissionsService = permissionsService;
    this.pendingDecisionProvider = pendingDecisionProvider;
    this.projectDir = projectDir;
    this.fileOutputThresholdBytes = fileOutputThresholdBytes;
    this.elicitationFactory = elicitationFactory;
  }
  async execute(parentCtx, args) {
    const env_15 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_15, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalMcpToolExecutor.execute")), false);
      const ctx = span.ctx;
      const blockReason = await this.permissionsService.shouldBlockMcp(ctx, args);
      if (blockReason) {
        const blockResult = await handleBlockReason(blockReason, {
          onNeedsApproval: async (_approvalReason, approvalDetails) => {
            if (approvalDetails.type !== "mcp") {
              // This shouldn't happen, but handle gracefully
              return new mcp_exec_pb /* McpResult */.iz({
                result: {
                  case: "error",
                  value: new mcp_exec_pb /* McpError */.Nh({
                    error: `Invalid approval details type for MCP execution`
                  })
                }
              });
            }
            const result = await this.pendingDecisionProvider.requestApproval({
              type: OperationType.Mcp,
              details: {
                name: approvalDetails.name,
                toolName: approvalDetails.toolName,
                providerIdentifier: approvalDetails.providerIdentifier,
                args: approvalDetails.args
              },
              toolCallId: args.toolCallId
            });
            if (!result.approved) {
              return new mcp_exec_pb /* McpResult */.iz({
                result: {
                  case: "rejected",
                  value: new mcp_exec_pb /* McpRejected */.xo({
                    reason: `MCP tool execution rejected by user: ${args.name} ${result.reason ? ` - ${result.reason}` : ""}`
                  })
                }
              });
            }
            // Return null to continue with execution
            return null;
          },
          onUserRejected: reason => {
            return new mcp_exec_pb /* McpResult */.iz({
              result: {
                case: "error",
                value: new mcp_exec_pb /* McpError */.Nh({
                  error: `MCP tool execution rejected by user: ${args.name}${reason ? ` - ${reason}` : ""}`
                })
              }
            });
          },
          onPermissionDenied: (errorMessage, metadata) => {
            const formattedError = `MCP tool execution blocked: ${args.name} - ${errorMessage}`;
            return new mcp_exec_pb /* McpResult */.iz({
              result: {
                case: "permissionDenied",
                value: new mcp_exec_pb /* McpPermissionDenied */.HQ({
                  error: formattedError,
                  isReadonly: metadata?.isReadonly ?? false
                })
              }
            });
          }
        });
        if (blockResult) {
          return blockResult;
        }
      }
      const toolSet = await this.toolSet.getToolSet(ctx);
      const result = await toolSet.execute(args.name, Object.fromEntries(Object.entries(args.args).map(([key, value]) => [key, value.toJson()])), args.toolCallId, this.elicitationFactory);
      // Process content items and handle streaming for large text outputs
      const contentItems = [];
      for (const item of result.content) {
        if (item.type === "text") {
          // Check if text exceeds threshold and file output is enabled (threshold > 0)
          if (this.fileOutputThresholdBytes > 0 && item.text.length > this.fileOutputThresholdBytes) {
            // Write to file in project's agent-tools directory
            const agentToolsDir = external_node_path_.join(this.projectDir, "agent-tools");
            const filePath = external_node_path_.join(agentToolsDir, `${(0, external_node_crypto_.randomUUID)()}.txt`);
            // Ensure directory exists
            await (0, promises_.mkdir)(external_node_path_.dirname(filePath), {
              recursive: true
            });
            // Prepare content and calculate metrics
            const contentToWrite = item.text.slice(0, MAX_OUTPUT_FILE_SIZE);
            const lineCount = contentToWrite.split("\n").length;
            const actualSize = Buffer.byteLength(contentToWrite, "utf8");
            // Write file
            await (0, promises_.writeFile)(filePath, contentToWrite, "utf8");
            // Add content item with output location
            contentItems.push(new mcp_exec_pb /* McpToolResultContentItem */._Z({
              content: {
                case: "text",
                value: new mcp_exec_pb /* McpTextContent */.zN({
                  text: "",
                  // Empty text when written to file
                  outputLocation: new shell_exec_pb /* OutputLocation */.pV({
                    filePath,
                    sizeBytes: BigInt(actualSize),
                    lineCount: BigInt(lineCount)
                  })
                })
              }
            }));
          } else {
            // Small text or no workspace path - use inline
            contentItems.push(new mcp_exec_pb /* McpToolResultContentItem */._Z({
              content: {
                case: "text",
                value: new mcp_exec_pb /* McpTextContent */.zN({
                  text: item.text
                })
              }
            }));
          }
        } else {
          // Handle image content
          const dataBytes = Buffer.from(item.data, "base64");
          contentItems.push(new mcp_exec_pb /* McpToolResultContentItem */._Z({
            content: {
              case: "image",
              value: new mcp_exec_pb /* McpImageContent */["do"]({
                data: dataBytes,
                mimeType: item.mimeType
              })
            }
          }));
        }
      }
      return new mcp_exec_pb /* McpResult */.iz({
        result: {
          case: "success",
          value: new mcp_exec_pb /* McpSuccess */.QW({
            content: contentItems,
            isError: result.isError
          })
        }
      });
    } catch (e_15) {
      env_15.error = e_15;
      env_15.hasError = true;
    } finally {
      mcp_disposeResources(env_15);
    }
  }
}
class LocalListMcpResourcesExecutor {
  constructor(mcpLease) {
    this.mcpLease = mcpLease;
  }
  async execute(parentCtx, args) {
    const env_16 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_16, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalListMcpResourcesExecutor.execute")), false);
      const ctx = span.ctx;
      try {
        // Get enabled servers from mcpLease
        const enabledServerNames = new Set();
        const tools = await this.mcpLease.getTools(ctx);
        for (const tool of tools) {
          // Add both with and without 'user-' prefix to handle both naming conventions
          enabledServerNames.add(tool.providerIdentifier);
          enabledServerNames.add(`user-${tool.providerIdentifier}`);
        }
        const clients = await this.mcpLease.getClients();
        const allResources = [];
        // If a specific server is requested, filter by it
        if (args.server) {
          const client = clients[args.server];
          if (!client) {
            return new mcp_exec_pb /* ListMcpResourcesExecResult */.kP({
              result: {
                case: "error",
                value: new mcp_exec_pb /* ListMcpResourcesError */.w2({
                  error: `Server "${args.server}" not found`
                })
              }
            });
          }
          const resources = await this.listResourcesFromClient(ctx, client, args.server);
          allResources.push(...resources);
        } else {
          // List resources from all enabled clients
          for (const [serverName, client] of Object.entries(clients)) {
            // Skip disabled servers
            if (enabledServerNames.size > 0 && !enabledServerNames.has(serverName)) {
              continue;
            }
            const resources = await this.listResourcesFromClient(ctx, client, serverName);
            allResources.push(...resources);
          }
        }
        return new mcp_exec_pb /* ListMcpResourcesExecResult */.kP({
          result: {
            case: "success",
            value: new mcp_exec_pb /* ListMcpResourcesSuccess */.T2({
              resources: allResources
            })
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new mcp_exec_pb /* ListMcpResourcesExecResult */.kP({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ListMcpResourcesError */.w2({
              error: `Failed to list MCP resources: ${errorMessage}`
            })
          }
        });
      }
    } catch (e_16) {
      env_16.error = e_16;
      env_16.hasError = true;
    } finally {
      mcp_disposeResources(env_16);
    }
  }
  async listResourcesFromClient(ctx, client, serverName) {
    const state = await client.getState(ctx);
    if (state.kind !== "ready") {
      return [];
    }
    const result = await client.listResources(ctx);
    if (!result || !result.resources) {
      return [];
    }
    return result.resources.map(resource => new mcp_exec_pb /* ListMcpResourcesExecResult_McpResource */.X2({
      uri: resource.uri,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
      server: serverName,
      annotations: resource.annotations
    }));
  }
}
class LocalReadMcpResourceExecutor {
  constructor(mcpLease, projectDir = ".", permissionsService) {
    this.mcpLease = mcpLease;
    this.projectDir = projectDir;
    this.permissionsService = permissionsService;
  }
  async execute(parentCtx, args) {
    const env_17 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = mcp_addDisposableResource(env_17, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalReadMcpResourceExecutor.execute")), false);
      const ctx = span.ctx;
      const clients = await this.mcpLease.getClients();
      const client = clients[args.server];
      if (!client) {
        return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
              uri: args.uri,
              error: `Server "${args.server}" not found`
            })
          }
        });
      }
      try {
        const state = await client.getState(ctx);
        if (state.kind !== "ready") {
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "error",
              value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
                uri: args.uri,
                error: `Server "${args.server}" is not ready`
              })
            }
          });
        }
        const result = await client.readResource(ctx, {
          uri: args.uri
        });
        if (!result || !result.contents || result.contents.length === 0) {
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "notFound",
              value: new mcp_exec_pb /* ReadMcpResourceNotFound */.ov({
                uri: args.uri
              })
            }
          });
        }
        const content = result.contents[0];
        // Handle download path if specified
        if (args.downloadPath) {
          // SECURITY NOTE: This implementation matches the old agent loop (see
          // vscode/src/vs/workbench/services/ai/browser/toolsV2/fetchMcpResourceHandler.ts:113-115)
          // but does NOT validate against path traversal attacks. A malicious downloadPath like "../../../etc/passwd"
          // will escape the project directory. The old implementation only strips leading slashes and relies on
          // URI.joinPath/path.join which resolve "../" sequences. This should be fixed to validate that the resolved
          // path stays within projectDir boundaries, similar to how other file operations use resolvePath() and
          // check for path traversal attempts.
          // Ensure downloadPath is treated as a relative path (same as old agent loop)
          const sanitized = args.downloadPath.replace(/^\/+/, "");
          const downloadFullPath = external_node_path_.join(this.projectDir, sanitized);
          await (0, promises_.mkdir)(external_node_path_.dirname(downloadFullPath), {
            recursive: true
          });
          if (content.text) {
            await (0, promises_.writeFile)(downloadFullPath, content.text, "utf8");
          } else if (content.blob) {
            const blobData = Buffer.from(content.blob, "base64");
            await (0, promises_.writeFile)(downloadFullPath, blobData);
          }
          // Return success result when downloading (content not returned)
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "success",
              value: new mcp_exec_pb /* ReadMcpResourceSuccess */.KZ({
                uri: args.uri,
                name: content.name,
                description: content.description,
                mimeType: content.mimeType
              })
            }
          });
        }
        // Return content to model
        if (content.text) {
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "success",
              value: new mcp_exec_pb /* ReadMcpResourceSuccess */.KZ({
                uri: args.uri,
                name: content.name,
                description: content.description,
                mimeType: content.mimeType,
                annotations: content.annotations,
                content: {
                  case: "text",
                  value: content.text
                }
              })
            }
          });
        } else if (content.blob) {
          const blobData = Buffer.from(content.blob, "base64");
          return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
            result: {
              case: "success",
              value: new mcp_exec_pb /* ReadMcpResourceSuccess */.KZ({
                uri: args.uri,
                name: content.name,
                description: content.description,
                mimeType: content.mimeType,
                annotations: content.annotations,
                content: {
                  case: "blob",
                  value: blobData
                }
              })
            }
          });
        }
        return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
              uri: args.uri,
              error: "Failed to read resource"
            })
          }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new mcp_exec_pb /* ReadMcpResourceExecResult */.ZD({
          result: {
            case: "error",
            value: new mcp_exec_pb /* ReadMcpResourceError */.Jx({
              uri: args.uri,
              error: `Failed to read MCP resource: ${errorMessage}`
            })
          }
        });
      }
    } catch (e_17) {
      env_17.error = e_17;
      env_17.hasError = true;
    } finally {
      mcp_disposeResources(env_17);
    }
  }
}
//# sourceMappingURL=mcp.js.map