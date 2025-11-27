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

// Playwright tools not exposed
const PLAYWRIGHT_MCP_CLIENT_EXCLUDED_TOOLS = ["browser_close"];
// Additional playwright tools not exposed when in self control mode
const CURSOR_SELF_CONTROL_EXCLUDED_TOOLS = ["browser_close", "browser_navigate", "browser_navigate_back", "browser_install", "browser_tab"];
const CURSOR_SELF_CONTROL_TOOL_DESCRIPTION_PREFIX = `If you have previously started the Cursor Development instance, you can use this tool to interact with the Cursor Application as though it were a web browser.
This tool can be specifically used to:\n`;
class PlaywrightMcpClient {
  constructor(config = {
    connectionType: "default"
  }, serverName) {
    this.mcpChannel = null;
    this.mcpClient = null;
    this.activeBrowsers = new Set();
    this.isInitialized = false;
    this.initializationPromise = null;
    this.state = {
      kind: "loading"
    };
    // undefined == not yet initialized / could not find self cdp url
    this.selfCdpUrl = undefined;
    this.currentConfig = config;
    this.serverName = serverName ?? dist /* CURSOR_PLAYWRIGHT_PROVIDER_ID */.HI;
    this.ctx = (0, context_dist /* createContext */.q6)();
    this.logger = (0, context_dist /* createLogger */.h)("PlaywrightMcpClient");
    // Start initialization immediately
    this.ensureInitialized().catch(err => {
      this.logger.error(this.ctx, "Initialization failed", err);
      this.state = {
        kind: "ready"
      }; // Set to ready even on failure to allow retry
    });
  }
  /**
   * Determines the Chrome executable path for the current platform
   */
  async getChromeExecutablePath() {
    const platform = external_node_os_.platform();
    const possiblePaths = [];
    switch (platform) {
      case "darwin":
        // macOS
        possiblePaths.push("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary", "/Applications/Chromium.app/Contents/MacOS/Chromium");
        break;
      case "win32":
        {
          // Windows
          const programFiles = process.env.PROGRAMFILES || "C:\\Program Files";
          const programFilesX86 = process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)";
          const localAppData = process.env.LOCALAPPDATA || external_node_path_.join(external_node_os_.homedir(), "AppData", "Local");
          possiblePaths.push(external_node_path_.join(programFiles, "Google", "Chrome", "Application", "chrome.exe"), external_node_path_.join(programFilesX86, "Google", "Chrome", "Application", "chrome.exe"), external_node_path_.join(localAppData, "Google", "Chrome", "Application", "chrome.exe"), external_node_path_.join(programFiles, "Chromium", "Application", "chrome.exe"), external_node_path_.join(programFilesX86, "Chromium", "Application", "chrome.exe"));
          break;
        }
      case "linux":
        // Linux
        possiblePaths.push("/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium-browser", "/usr/bin/chromium", "/snap/bin/chromium");
        break;
      default:
        this.logger.warn(this.ctx, "Unsupported platform", {
          platform
        });
        return undefined;
    }
    // Check each possible path and return the first one that exists
    for (const executablePath of possiblePaths) {
      try {
        if (await promises_.access(executablePath).then(() => true).catch(() => false)) {
          this.logger.info(this.ctx, "Found Chrome executable", {
            executablePath
          });
          return executablePath;
        }
      } catch (_error) {}
    }
    this.logger.warn(this.ctx, "No Chrome executable found", {
      platform
    });
    return undefined;
  }
  async ensureInitialized() {
    if (this.isInitialized) {
      return;
    }
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    this.initializationPromise = this.initialize();
    return this.initializationPromise;
  }
  async initialize() {
    try {
      this.logger.info(this.ctx, "Initializing Playwright MCP client");
      // Create the bidirectional channel
      this.mcpChannel = new McpChannel();
      // Define custom context getter that returns our managed context
      const contextGetter = async () => {
        const config = this.currentConfig;
        let browser;
        if (config.connectionType === "self") {
          // Connect to Cursor's own CDP endpoint; URL should already be set by callTool
          if (this.selfCdpUrl === undefined) {
            // Re-fetch the self cdp url
            this.selfCdpUrl = await this.fetchSelfCdpUrl();
          }
          const selfUrl = this.selfCdpUrl;
          this.logger.info(this.ctx, "Connecting to self CDP", {
            selfUrl
          });
          browser = await playwright /* chromium */.B0.connectOverCDP(selfUrl);
          // Track the browser instance for proper cleanup
          this.activeBrowsers.add(browser);
          // Listen for browser close events to remove from tracking
          browser.on("disconnected", () => {
            this.activeBrowsers.delete(browser);
            this.logger.info(this.ctx, "Browser disconnected and removed from tracking");
          });
          // For self mode, try to use an existing context first, only create new if none exist
          // This is important because Cursor's browser may not allow creating new contexts
          let context;
          const existingContexts = browser.contexts();
          if (existingContexts.length > 0) {
            context = existingContexts[0];
          } else {
            try {
              context = await browser.newContext();
            } catch (error) {
              // If we can't create a new context, this might be a restricted browser
              this.logger.error(this.ctx, "Failed to create new context in self mode", error);
              throw new Error("Could not create browser context. The browser may not allow new contexts. Please ensure at least one context exists.");
            }
          }
          // Listen for context close events
          context.on("close", async () => {
            this.logger.info(this.ctx, "Browser context closed, closing browser");
            try {
              const contextBrowser = context.browser();
              if (contextBrowser) {
                await contextBrowser.close();
                this.activeBrowsers.delete(contextBrowser);
              }
            } catch (error) {
              this.logger.error(this.ctx, "Error closing browser on context close", error);
            }
          });
          return context;
        } else if (config.connectionType === "cdp") {
          // Connect to existing browser via CDP
          this.logger.info(this.ctx, "Connecting to CDP", {
            cdpUrl: config.cdpUrl
          });
          browser = await playwright /* chromium */.B0.connectOverCDP(config.cdpUrl);
          // Track the browser instance for proper cleanup
          this.activeBrowsers.add(browser);
          // Listen for browser close events to remove from tracking
          browser.on("disconnected", () => {
            this.activeBrowsers.delete(browser);
            this.logger.info(this.ctx, "Browser disconnected and removed from tracking");
          });
          // Get the specified context or create a new one
          let context;
          if (config.selectedContextId) {
            // Find the existing context by ID
            const existingContext = browser.contexts()
            // biome-ignore lint/suspicious/noExplicitAny: Accessing internal Playwright property
            .find(ctx => ctx._guid === config.selectedContextId);
            if (existingContext) {
              this.logger.info(this.ctx, "Using existing context", {
                selectedContextId: config.selectedContextId
              });
              context = existingContext;
            } else {
              this.logger.warn(this.ctx, "Context not found, using first available or creating new", {
                selectedContextId: config.selectedContextId
              });
              context = browser.contexts()[0] ?? (await browser.newContext());
            }
          } else {
            // Use first available context or create new
            context = browser.contexts()[0] ?? (await browser.newContext());
            this.logger.info(this.ctx, "Using first available context or created new");
          }
          return context;
        } else {
          // Launch new browser with executable path (custom or default)
          const executablePath = config.connectionType === "executable" ? config.executablePath : await this.getChromeExecutablePath();
          this.logger.info(this.ctx, "Launching browser with executable", {
            executablePath: executablePath || "bundled"
          });
          // biome-ignore lint/suspicious/noExplicitAny: Dynamic launch options for Playwright
          const launchOptions = {
            headless: false
          };
          if (executablePath) {
            launchOptions.channel = undefined;
            launchOptions.executablePath = executablePath;
            launchOptions.headless = true;
          }
          browser = await playwright /* chromium */.B0.launch(launchOptions);
          // Track the browser instance for proper cleanup
          this.activeBrowsers.add(browser);
          // Listen for browser close events to remove from tracking
          browser.on("disconnected", () => {
            this.activeBrowsers.delete(browser);
            this.logger.info(this.ctx, "Browser disconnected and removed from tracking");
          });
          const context = await browser.newContext();
          // Listen for context close events
          context.on("close", async () => {
            this.logger.info(this.ctx, "Browser context closed, closing browser");
            try {
              const contextBrowser = context.browser();
              if (contextBrowser) {
                await contextBrowser.close();
                this.activeBrowsers.delete(contextBrowser);
              }
            } catch (error) {
              this.logger.error(this.ctx, "Error closing browser on context close", error);
            }
          });
          return context;
        }
      };
      // Create the Playwright MCP server with custom context getter
      const mcpServer = await (0, mcp.createConnection)({
        browser: {
          isolated: true // Use isolated mode to avoid conflicts with existing Chrome
        }
      }, contextGetter);
      // Connect the MCP server to the server-side transport
      await mcpServer.connect(this.mcpChannel.serverTransport);
      // Create MCP client using the client-side transport
      this.mcpClient = new client /* Client */.K({
        name: "cursor-browser-extension-client",
        version: "1.0.0"
      }, {
        capabilities: {}
      });
      // Connect the client to the client-side transport
      await this.mcpClient.connect(this.mcpChannel.clientTransport);
      this.isInitialized = true;
      this.state = {
        kind: "ready"
      };
      this.logger.info(this.ctx, "Successfully initialized");
    } catch (error) {
      this.logger.error(this.ctx, "Failed to initialize", error);
      this.cleanup();
      this.state = {
        kind: "ready"
      }; // Set to ready to allow retry
      throw new Error(`Failed to initialize Playwright MCP client: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async getTools(ctx) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = __addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("PlaywrightMcpClient.getTools")), false);
      await this.ensureInitialized();
      if (!this.mcpClient) {
        return [];
      }
      try {
        const tools = [];
        let cursor;
        while (true) {
          const response = await this.mcpClient.listTools({
            cursor
          });
          // Filter out browser_close tool as it's handled internally
          let filteredTools = response.tools.filter(tool => !PLAYWRIGHT_MCP_CLIENT_EXCLUDED_TOOLS.includes(tool.name));
          // If in self mode, remove browser_navigate tools -- agent has to navigate in VSCode as though they were a real user
          if (this.currentConfig.connectionType === "self") {
            filteredTools = filteredTools.filter(tool => !PLAYWRIGHT_MCP_CLIENT_EXCLUDED_TOOLS.includes(tool.name) && !CURSOR_SELF_CONTROL_EXCLUDED_TOOLS.includes(tool.name));
          }
          tools.push(...filteredTools.map(tool => ({
            name: tool.name,
            description: this.currentConfig.connectionType === "self" ? `${CURSOR_SELF_CONTROL_TOOL_DESCRIPTION_PREFIX}${tool.description}` : tool.description,
            inputSchema: tool.inputSchema,
            outputSchema: tool.outputSchema
          })));
          cursor = response.nextCursor;
          if (cursor === undefined) break;
        }
        this.logger.info(this.ctx, "Loaded tools", {
          toolCount: tools.length
        });
        return tools;
      } catch (error) {
        this.logger.error(this.ctx, "Failed to get tools", error);
        return [];
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources(env_1);
    }
  }
  async callTool(ctx, name, args, _toolCallId, _elicitationProvider) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = __addDisposableResource(env_2, (0, context_dist /* createSpan */.VI)(ctx.withName("PlaywrightMcpClient.callTool")), false);
      span.span.setAttribute("toolName", name);
      await this.ensureInitialized();
      if (!this.mcpClient) {
        throw new Error("Playwright MCP client not initialized");
      }
      try {
        this.logger.info(this.ctx, "Calling tool", {
          toolName: name
        });
        // In self mode, always fetch the latest CDP URL before running the tool
        if (this.currentConfig.connectionType === "self") {
          try {
            const latestUrl = await this.fetchSelfCdpUrl();
            this.selfCdpUrl = latestUrl;
          } catch (_err) {
            const text = `Could not find a running Cursor Dev instance to control with ${name}. Please ensure the application is properly running.`;
            return {
              content: [{
                type: "text",
                text
              }],
              isError: true
            };
          }
        }
        // Validate browser_navigate tool to reject file:// URLs
        if (name === "browser_navigate" && args.url) {
          try {
            const urlString = String(args.url);
            const parsedUrl = new URL(urlString);
            if (parsedUrl.protocol === "file:") {
              const message = `Security restriction: file:// URLs are not allowed for security reasons. The browser_navigate tool can only access web URLs (http:// or https://). If you need to test with local files, consider using a local web server instead.`;
              this.logger.warn(this.ctx, "Blocked file:// URL navigation attempt", {
                url: urlString
              });
              return {
                content: [{
                  type: "text",
                  text: message
                }],
                isError: false
              };
            }
          } catch (error) {
            // If URL parsing fails, let it through - the underlying tool will handle invalid URLs
            if (error instanceof TypeError) {
              this.logger.warn(this.ctx, "Failed to parse URL for security check", {
                url: args.url
              });
            }
          }
        }
        // Extract and handle log configs if present (for compatibility with VSCode extension)
        let toolArgs = {
          ...args
        };
        if (args.__playwrightLogConfigs) {
          // Remove the config from args before passing to the actual tool
          const {
            __playwrightLogConfigs,
            ...cleanArgs
          } = toolArgs;
          toolArgs = cleanArgs;
        }
        const response = await this.mcpClient.callTool({
          name,
          arguments: toolArgs
        });
        // Convert SDK response to our format
        const content = [];
        if (response.content && Array.isArray(response.content)) {
          for (const item of response.content) {
            if (typeof item === "object" && item !== null && "type" in item) {
              if (item.type === "text" && "text" in item) {
                content.push({
                  type: "text",
                  text: String(item.text)
                });
              } else if (item.type === "image" && "data" in item) {
                content.push({
                  type: "image",
                  data: String(item.data),
                  mimeType: "mimeType" in item ? String(item.mimeType) : undefined
                });
              }
            }
          }
        }
        return {
          content,
          isError: response.error !== undefined
        };
      } catch (error) {
        this.logger.error(this.ctx, `Error calling tool ${name}`, error);
        throw new Error(`Failed to call Playwright tool ${name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources(env_2);
    }
  }
  async getInstructions(_ctx) {
    // Playwright MCP client doesn't provide instructions
    return undefined;
  }
  async listResources(_ctx) {
    // Playwright MCP client doesn't have resources
    return {
      resources: []
    };
  }
  async readResource(_ctx, _args) {
    // Playwright MCP client doesn't have resources
    return {
      contents: []
    };
  }
  async listPrompts(_ctx) {
    // Playwright MCP client doesn't have prompts
    return [];
  }
  async getPrompt(_ctx, _name, _args) {
    // Playwright MCP client doesn't have prompts
    return {
      messages: []
    };
  }
  async getState(_ctx) {
    return this.state;
  }
  cleanup() {
    // Close all active browsers first
    if (this.activeBrowsers.size > 0) {
      this.logger.info(this.ctx, "Closing active browsers", {
        browserCount: this.activeBrowsers.size
      });
      const closeBrowserPromises = Array.from(this.activeBrowsers).map(async browser => {
        try {
          await browser.close();
          this.logger.info(this.ctx, "Browser closed successfully");
        } catch (error) {
          this.logger.error(this.ctx, "Error closing browser", error);
        }
      });
      Promise.allSettled(closeBrowserPromises);
      this.activeBrowsers.clear();
    }
    if (this.mcpClient) {
      try {
        this.mcpClient.close();
      } catch (err) {
        this.logger.error(this.ctx, "Error closing MCP client", err);
      }
      this.mcpClient = null;
    }
    if (this.mcpChannel) {
      try {
        this.mcpChannel.close();
      } catch (err) {
        this.logger.error(this.ctx, "Error closing MCP channel", err);
      }
      this.mcpChannel = null;
    }
    this.isInitialized = false;
    this.initializationPromise = null;
  }
  dispose() {
    this.logger.info(this.ctx, "Disposing Playwright MCP client");
    this.cleanup();
  }
  /**
   * Resolve the self CDP URL exposed by the running Cursor application.
   */
  async fetchSelfCdpUrl(options) {
    const maxRetries = options?.maxRetries ?? 2;
    const timeoutMs = options?.timeoutMs ?? 3000;
    // Use global fetch available in supported Node.js versions
    const fetchImpl = fetch;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl("http://localhost:9222/json/version", {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch CDP version info: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (typeof data === "object" && data !== null && "webSocketDebuggerUrl" in data && typeof data.webSocketDebuggerUrl === "string") {
          return data.webSocketDebuggerUrl;
        }
        throw new Error("`webSocketDebuggerUrl` is missing or not a string in response");
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        if (isLastAttempt) {
          throw error instanceof Error ? error : new Error(String(error));
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      } finally {
        clearTimeout(timeout);
      }
    }
    // Unreachable due to returns/throws in loop
    throw new Error("Unexpected error fetching self CDP URL");
  }
}