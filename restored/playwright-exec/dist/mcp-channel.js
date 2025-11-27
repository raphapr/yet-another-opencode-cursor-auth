/**
 * A bidirectional channel that provides separate transports for client and server
 * enabling communication between MCP client and server instances
 */
class McpChannel {
  constructor() {
    this._clientTransport = new ClientTransport(this);
    this._serverTransport = new ServerTransport(this);
  }
  get clientTransport() {
    return this._clientTransport;
  }
  get serverTransport() {
    return this._serverTransport;
  }
  async close() {
    await Promise.all([this._clientTransport.close(), this._serverTransport.close()]);
  }
  /**
   * Send message from client to server
   */
  async sendToServer(message, extra) {
    setTimeout(() => {
      this._serverTransport.onmessage(message, extra);
    }, 0);
  }
  /**
   * Send message from server to client
   */
  async sendToClient(message, extra) {
    setTimeout(() => {
      this._clientTransport.onmessage(message, extra);
    }, 0);
  }
}
/**
 * Transport implementation for the client side
 */
class ClientTransport {
  constructor(channel) {
    this.channel = channel;
    this.sessionId = (0, external_node_crypto_.randomUUID)();
    this.onmessage = () => {};
  }
  async start() {
    // No-op - transport is ready immediately
  }
  async send(message, _options) {
    // Send message to server through the channel
    await this.channel.sendToServer(message, undefined);
  }
  async close() {
    if (this.onclose) {
      this.onclose();
    }
  }
}
/**
 * Transport implementation for the server side
 */
class ServerTransport {
  constructor(channel) {
    this.channel = channel;
    this.sessionId = (0, external_node_crypto_.randomUUID)();
    this.onmessage = () => {};
  }
  async start() {
    // No-op - transport is ready immediately
  }
  async send(message, _options) {
    // Send message to client through the channel
    await this.channel.sendToClient(message, undefined);
  }
  async close() {
    if (this.onclose) {
      this.onclose();
    }
  }
}