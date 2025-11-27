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
class FileBasedRepositoryStateProvider {
  constructor(repoStatePath) {
    this.repoStatePath = repoStatePath;
    this.repoState = this.loadRepoState();
  }
  loadRepoState() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const repoState = yield (0, promises_.readFile)(this.repoStatePath, "utf8");
        return JSON.parse(repoState);
      } catch (e) {
        if (e instanceof Error && e.message.includes("ENOENT")) {
          return undefined;
        }
        throw e;
      }
    });
  }
  loadConfig() {
    return __awaiter(this, void 0, void 0, function* () {
      const repoState = yield this.repoState;
      return repoState;
    });
  }
  saveConfig(state) {
    return __awaiter(this, void 0, void 0, function* () {
      yield (0, promises_.mkdir)(external_node_path_default().dirname(this.repoStatePath), {
        recursive: true
      });
      yield (0, promises_.writeFile)(this.repoStatePath, JSON.stringify(state, null, 2));
      this.repoState = Promise.resolve(state);
    });
  }
}
const JwtPayloadSchema = lib.z.object({
  sub: lib.z.string()
});
function extractAuthId(accessToken) {
  try {
    const parts = accessToken.split(".");
    if (parts.length !== 3) {
      return undefined;
    }
    const payloadJson = Buffer.from(parts[1], "base64").toString();
    const payloadData = JSON.parse(payloadJson);
    const result = JwtPayloadSchema.safeParse(payloadData);
    if (!result.success) {
      return undefined;
    }
    return result.data.sub;
  } catch (_a) {
    return undefined;
  }
}
class UuidRepositoryIdentityProvider {
  constructor(repoStateProvider, serverConfigService, vscodeRepoKeyProvider, credentialManager) {
    this.repoStateProvider = repoStateProvider;
    this.serverConfigService = serverConfigService;
    this.vscodeRepoKeyProvider = vscodeRepoKeyProvider;
    this.credentialManager = credentialManager;
  }
  getEncryptionKey() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const vscodeRepoKeys = yield this.vscodeRepoKeyProvider.getRepoKeys();
      if (vscodeRepoKeys !== undefined) {
        return vscodeRepoKeys.pathEncryptionKey;
      }
      const serverConfig = yield this.serverConfigService.fetchServerConfig();
      const indexingConfig = serverConfig.indexingConfig;
      if (!indexingConfig) {
        return undefined;
      }
      return (_a = indexingConfig.defaultTeamPathEncryptionKey) !== null && _a !== void 0 ? _a : indexingConfig.defaultUserPathEncryptionKey;
    });
  }
  loadRepositoryIdentity() {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        accessToken
      } = yield this.credentialManager.getAllCredentials();
      if (accessToken === undefined) {
        throw new Error("No access token found");
      }
      const authId = extractAuthId(accessToken);
      if (authId === undefined) {
        throw new Error("No auth ID found");
      }
      const encryptionKey = yield this.getEncryptionKey();
      if (encryptionKey === undefined) {
        throw new Error("No encryption key found");
      }
      const vscodeRepoKeys = yield this.vscodeRepoKeyProvider.getRepoKeys();
      if (vscodeRepoKeys !== undefined) {
        return {
          repoOwner: authId,
          repoName: vscodeRepoKeys.repoName,
          encryptionScheme: new indexing_client_dist /* V1MasterKeyedEncryptionScheme */.Gv(encryptionKey)
        };
      }
      let repoState = yield this.repoStateProvider.loadConfig();
      if (!repoState) {
        const id = (0, external_node_crypto_.randomUUID)();
        yield this.repoStateProvider.saveConfig({
          id
        });
        repoState = {
          id
        };
      }
      return {
        repoOwner: authId,
        repoName: repoState.id,
        encryptionScheme: new indexing_client_dist /* V1MasterKeyedEncryptionScheme */.Gv(encryptionKey)
      };
    });
  }
}