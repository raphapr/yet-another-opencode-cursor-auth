class StaticServerConfigService {
  constructor(config) {
    this.config = config;
  }
  fetchServerConfig() {
    return Promise.resolve(this.config);
  }
}
class ConnectServerConfigService {
  constructor(client) {
    this.client = client;
    this.serverConfigPromise = this.client.getServerConfig({});
  }
  fetchServerConfig() {
    return this.serverConfigPromise;
  }
}
//# sourceMappingURL=server-config-service.js.map