var token_store_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class FileBasedTokenStore {
  constructor(mcpAuthPath) {
    this.mcpAuthPath = mcpAuthPath;
    this.saveLock = Promise.resolve();
    this.mcpAuthPromise = this.loadMcpAuth();
  }
  loadMcpAuth() {
    return token_store_awaiter(this, void 0, void 0, function* () {
      try {
        const mcpAuth = yield (0, promises_.readFile)(this.mcpAuthPath, "utf8");
        const data = JSON.parse(mcpAuth);
        // Handle legacy format (direct token storage at root level)
        if (data && typeof data === "object") {
          // Check if it's the old format with direct token storage
          const hasDirectTokens = Object.values(data).some(value => value && typeof value === "object" && value !== null && ("access_token" in value || "refresh_token" in value) && !("tokens" in value) && !("clientInfo" in value));
          if (hasDirectTokens) {
            // Convert legacy format: { identifier: OAuthTokens } -> { identifier: { tokens: OAuthTokens } }
            const converted = {};
            for (const [key, value] of Object.entries(data)) {
              converted[key] = {
                tokens: value
              };
            }
            return converted;
          }
          // Handle new format or mixed format
          const result = {};
          for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === "object" && value !== null) {
              result[key] = {
                tokens: "tokens" in value ? value.tokens : undefined,
                clientInfo: "clientInfo" in value ? value.clientInfo : undefined
              };
            }
          }
          return result;
        }
        return {};
      } catch (e) {
        if (e instanceof Error && e.message.includes("ENOENT")) {
          return {};
        }
        throw e;
      }
    });
  }
  loadTokens(identifier) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      var _a;
      const mcpAuth = yield this.mcpAuthPromise;
      return (_a = mcpAuth[identifier]) === null || _a === void 0 ? void 0 : _a.tokens;
    });
  }
  saveTokens(identifier, tokens) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      yield this.withSaveLock(() => token_store_awaiter(this, void 0, void 0, function* () {
        const mcpAuth = yield this.mcpAuthPromise;
        if (!mcpAuth[identifier]) {
          mcpAuth[identifier] = {};
        }
        mcpAuth[identifier].tokens = tokens;
        yield this.saveMcpAuth(mcpAuth);
      }));
    });
  }
  loadClientInformation(identifier) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      var _a;
      const mcpAuth = yield this.mcpAuthPromise;
      return (_a = mcpAuth[identifier]) === null || _a === void 0 ? void 0 : _a.clientInfo;
    });
  }
  withSaveLock(fn) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      const previousLock = this.saveLock;
      let releaseLock;
      this.saveLock = new Promise(resolve => {
        releaseLock = resolve;
      });
      try {
        yield previousLock;
        return yield fn();
      } finally {
        releaseLock();
      }
    });
  }
  saveClientInformation(identifier, clientInfo) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      yield this.withSaveLock(() => token_store_awaiter(this, void 0, void 0, function* () {
        const mcpAuth = yield this.mcpAuthPromise;
        if (!mcpAuth[identifier]) {
          mcpAuth[identifier] = {};
        }
        mcpAuth[identifier].clientInfo = clientInfo;
        yield this.saveMcpAuth(mcpAuth);
      }));
    });
  }
  saveMcpAuth(data) {
    return token_store_awaiter(this, void 0, void 0, function* () {
      yield (0, promises_.mkdir)(external_node_path_.dirname(this.mcpAuthPath), {
        recursive: true
      });
      yield (0, promises_.writeFile)(this.mcpAuthPath, JSON.stringify(data, null, 2));
    });
  }
}
//# sourceMappingURL=token-store.js.map