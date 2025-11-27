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