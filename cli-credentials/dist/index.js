// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  jo: () => (/* binding */createCredentialManager)
});

// UNUSED EXPORTS: FileCredentialManager, KeychainCredentialManager

// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__("node:os");
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
; // ../cli-credentials/dist/file.js
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class FileCredentialManager {
  constructor(domain) {
    this.cachedAccessToken = null;
    this.cachedRefreshToken = null;
    this.cachedApiKey = null;
    // Use platform-appropriate directories, influenced by domain
    this.authFilePath = this.getAuthFilePath(domain);
  }
  toWindowsTitleCase(domain) {
    if (domain.length === 0) return domain;
    return domain.charAt(0).toUpperCase() + domain.slice(1).toLowerCase();
  }
  getAuthFilePath(domain) {
    const currentPlatform = (0, external_node_os_.platform)();
    switch (currentPlatform) {
      case "win32":
        {
          // Windows: Use %APPDATA%\<TitleCase(domain)>\auth.json
          const appData = process.env.APPDATA || (0, external_node_path_.join)((0, external_node_os_.homedir)(), "AppData", "Roaming");
          const folder = this.toWindowsTitleCase(domain);
          return (0, external_node_path_.join)(appData, folder, "auth.json");
        }
      case "darwin":
        // macOS: Use ~/.<domain>/auth.json
        return (0, external_node_path_.join)((0, external_node_os_.homedir)(), `.${domain}`, "auth.json");
      default:
        {
          // Linux and others: Use ~/.config/<domain>/auth.json (XDG spec)
          const configDir = process.env.XDG_CONFIG_HOME || (0, external_node_path_.join)((0, external_node_os_.homedir)(), ".config");
          return (0, external_node_path_.join)(configDir, domain, "auth.json");
        }
    }
  }
  ensureDirectoryExists() {
    return __awaiter(this, void 0, void 0, function* () {
      const dir = (0, external_node_path_.dirname)(this.authFilePath);
      try {
        yield external_node_fs_.promises.mkdir(dir, {
          recursive: true
        });
      } catch (error) {
        // Directory might already exist, which is fine
        if (error.code !== "EEXIST") {
          throw error;
        }
      }
    });
  }
  readAuthData() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield external_node_fs_.promises.readFile(this.authFilePath, "utf-8");
        return JSON.parse(data);
      } catch (error) {
        // File doesn't exist or is invalid
        if (error.code === "ENOENT") {
          return null;
        }
        // For JSON parse errors or other issues, return null
        return null;
      }
    });
  }
  writeAuthData(data) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.ensureDirectoryExists();
      yield external_node_fs_.promises.writeFile(this.authFilePath, JSON.stringify(data, null, 2), "utf-8");
    });
  }
  setAuthentication(accessToken, refreshToken, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
      const authData = {
        accessToken,
        refreshToken,
        apiKey
      };
      // Write to file
      yield this.writeAuthData(authData);
      // Update cache
      this.cachedAccessToken = accessToken;
      this.cachedRefreshToken = refreshToken;
      this.cachedApiKey = apiKey !== null && apiKey !== void 0 ? apiKey : null;
    });
  }
  getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
      // Return from cache if available
      if (this.cachedAccessToken) {
        return this.cachedAccessToken;
      }
      // Otherwise load from file and cache
      const authData = yield this.readAuthData();
      if (authData === null || authData === void 0 ? void 0 : authData.accessToken) {
        this.cachedAccessToken = authData.accessToken;
        this.cachedRefreshToken = authData.refreshToken;
        return authData.accessToken;
      }
      return undefined;
    });
  }
  getRefreshToken() {
    return __awaiter(this, void 0, void 0, function* () {
      // Return from cache if available
      if (this.cachedRefreshToken) {
        return this.cachedRefreshToken;
      }
      // Otherwise load from file and cache
      const authData = yield this.readAuthData();
      if (authData === null || authData === void 0 ? void 0 : authData.refreshToken) {
        this.cachedAccessToken = authData.accessToken;
        this.cachedRefreshToken = authData.refreshToken;
        return authData.refreshToken;
      }
      return undefined;
    });
  }
  clearAuthentication() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        // Delete the auth file
        yield external_node_fs_.promises.unlink(this.authFilePath);
      } catch (error) {
        // Ignore if file doesn't exist
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
      // Clear cache
      this.cachedAccessToken = null;
      this.cachedRefreshToken = null;
      this.cachedApiKey = null;
    });
  }
  getApiKey() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.cachedApiKey) {
        return this.cachedApiKey;
      }
      const authData = yield this.readAuthData();
      if (authData === null || authData === void 0 ? void 0 : authData.apiKey) {
        this.cachedApiKey = authData.apiKey;
        return authData.apiKey;
      }
      return undefined;
    });
  }
  getAllCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.cachedAccessToken !== null && this.cachedRefreshToken !== null) {
        return {
          accessToken: this.cachedAccessToken || undefined,
          refreshToken: this.cachedRefreshToken || undefined,
          apiKey: this.cachedApiKey || undefined
        };
      }
      const authData = yield this.readAuthData();
      if (authData) {
        this.cachedAccessToken = authData.accessToken || null;
        this.cachedRefreshToken = authData.refreshToken || null;
        this.cachedApiKey = authData.apiKey || null;
        return {
          accessToken: authData.accessToken || undefined,
          refreshToken: authData.refreshToken || undefined,
          apiKey: authData.apiKey || undefined
        };
      }
      return {
        accessToken: undefined,
        refreshToken: undefined,
        apiKey: undefined
      };
    });
  }
}

// EXTERNAL MODULE: ../keychain/dist/index.js + 2 modules
var dist = __webpack_require__("../keychain/dist/index.js");
; // ../cli-credentials/dist/keychain.js
var keychain_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function getAuthConstants(domain) {
  const prefix = domain.trim();
  return {
    account: `${prefix}-user`,
    accessTokenService: `${prefix}-access-token`,
    refreshTokenService: `${prefix}-refresh-token`,
    apiKeyService: `${prefix}-api-key` // pragma: allowlist secret
  };
}
class KeychainCredentialManager {
  constructor(domain) {
    this.cachedAccessToken = null;
    this.cachedRefreshToken = null;
    this.cachedApiKey = null;
    this.keychain = new dist /* KeychainAccess */.T2();
    const constants = getAuthConstants(domain);
    this.account = constants.account;
    this.accessTokenService = constants.accessTokenService;
    this.refreshTokenService = constants.refreshTokenService;
    this.apiKeyService = constants.apiKeyService;
  }
  setSecret(service, password) {
    return keychain_awaiter(this, void 0, void 0, function* () {
      yield this.keychain.setPassword({
        account: this.account,
        service,
        password
      });
    });
  }
  getSecret(service) {
    return keychain_awaiter(this, void 0, void 0, function* () {
      try {
        const value = yield this.keychain.getPassword({
          account: this.account,
          service
        });
        return value !== null && value !== void 0 ? value : undefined;
      } catch (error) {
        if (error instanceof dist /* PasswordNotFoundError */.fI) {
          return undefined;
        }
        throw error;
      }
    });
  }
  deleteSecret(service) {
    return keychain_awaiter(this, void 0, void 0, function* () {
      try {
        yield this.keychain.deletePassword({
          account: this.account,
          service
        });
      } catch (error) {
        if (!(error instanceof dist /* PasswordNotFoundError */.fI)) {
          throw error;
        }
      }
    });
  }
  setAuthentication(accessToken, refreshToken, apiKey) {
    return keychain_awaiter(this, void 0, void 0, function* () {
      yield this.setSecret(this.accessTokenService, accessToken);
      yield this.setSecret(this.refreshTokenService, refreshToken);
      if (apiKey) yield this.setSecret(this.apiKeyService, apiKey);
      // Update cache
      this.cachedAccessToken = accessToken;
      this.cachedRefreshToken = refreshToken;
      this.cachedApiKey = apiKey !== null && apiKey !== void 0 ? apiKey : null;
    });
  }
  getAccessToken() {
    return keychain_awaiter(this, void 0, void 0, function* () {
      // Return from cache if available
      if (this.cachedAccessToken) {
        return this.cachedAccessToken;
      }
      // Otherwise load from keychain and cache
      const accessToken = yield this.getSecret(this.accessTokenService);
      if (accessToken) {
        this.cachedAccessToken = accessToken;
        return accessToken;
      }
      return undefined;
    });
  }
  clearAuthentication() {
    return keychain_awaiter(this, void 0, void 0, function* () {
      yield this.deleteSecret(this.accessTokenService);
      yield this.deleteSecret(this.refreshTokenService);
      yield this.deleteSecret(this.apiKeyService);
      // Clear cache
      this.cachedAccessToken = null;
      this.cachedRefreshToken = null;
      this.cachedApiKey = null;
    });
  }
  getRefreshToken() {
    return keychain_awaiter(this, void 0, void 0, function* () {
      // Return from cache if available
      if (this.cachedRefreshToken) {
        return this.cachedRefreshToken;
      }
      const refreshToken = yield this.getSecret(this.refreshTokenService);
      if (refreshToken) {
        this.cachedRefreshToken = refreshToken;
        return refreshToken;
      }
      return undefined;
    });
  }
  getApiKey() {
    return keychain_awaiter(this, void 0, void 0, function* () {
      if (this.cachedApiKey) {
        return this.cachedApiKey;
      }
      const apiKey = yield this.getSecret(this.apiKeyService);
      if (apiKey) {
        this.cachedApiKey = apiKey;
        return apiKey;
      }
      return undefined;
    });
  }
  getAllCredentials() {
    return keychain_awaiter(this, void 0, void 0, function* () {
      if (this.cachedAccessToken !== null && this.cachedRefreshToken !== null) {
        return {
          accessToken: this.cachedAccessToken || undefined,
          refreshToken: this.cachedRefreshToken || undefined,
          apiKey: this.cachedApiKey || undefined
        };
      }
      const [accessToken, refreshToken, apiKey] = yield Promise.all([this.cachedAccessToken !== null ? Promise.resolve(this.cachedAccessToken || undefined) : this.getSecret(this.accessTokenService), this.cachedRefreshToken !== null ? Promise.resolve(this.cachedRefreshToken || undefined) : this.getSecret(this.refreshTokenService), this.cachedApiKey !== null ? Promise.resolve(this.cachedApiKey || undefined) : this.getSecret(this.apiKeyService)]);
      this.cachedAccessToken = accessToken || null;
      this.cachedRefreshToken = refreshToken || null;
      this.cachedApiKey = apiKey || null;
      return {
        accessToken,
        refreshToken,
        apiKey
      };
    });
  }
}
; // ../cli-credentials/dist/index.js

function createCredentialManager(domain) {
  // Use keychain on macOS, file-based storage on other platforms
  if ((0, external_node_os_.platform)() === "darwin") {
    return new KeychainCredentialManager(domain);
  }
  return new FileCredentialManager(domain);
}

/***/