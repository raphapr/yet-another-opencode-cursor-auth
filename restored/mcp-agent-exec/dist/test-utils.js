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