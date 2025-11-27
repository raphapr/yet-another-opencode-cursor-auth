/**
 * A wrapper around any McpLoader that adds custom clients (like Playwright)
 */
class McpLoaderWithCustomClients {
  constructor(innerLoader, customClients) {
    this.innerLoader = innerLoader;
    this.customClients = customClients;
  }
  async load(ctx) {
    // Load the inner manager
    const innerManager = await this.innerLoader.load(ctx);
    // Get all clients from the inner manager
    const innerClients = innerManager.getClients();
    // Combine with custom clients
    const allClients = {
      ...innerClients,
      ...this.customClients
    };
    // Create a new manager with all clients
    return new McpManager(allClients);
  }
  async loadClient(ctx, identifier, ignoreTokens) {
    // Check if it's a custom client first
    const customClient = this.customClients[identifier];
    if (customClient) {
      return customClient;
    }
    // Otherwise delegate to inner loader
    return this.innerLoader.loadClient(ctx, identifier, ignoreTokens);
  }
  /**
   * Add a custom client at runtime
   */
  addCustomClient(identifier, client) {
    this.customClients[identifier] = client;
  }
  /**
   * Remove a custom client
   */
  removeCustomClient(identifier) {
    delete this.customClients[identifier];
  }
  /**
   * Get all custom clients
   */
  getCustomClients() {
    return {
      ...this.customClients
    };
  }
}
//# sourceMappingURL=mcp-loader-with-custom-clients.js.map