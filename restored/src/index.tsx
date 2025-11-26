// EXTERNAL MODULE: external "node:util"
var external_node_util_ = __webpack_require__("node:util");
// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var dist = __webpack_require__("../context/dist/index.js");
// EXTERNAL MODULE: ./src/debug.ts + 1 modules
var debug = __webpack_require__("./src/debug.ts");
; // ./src/console-shim.ts

const backend = {
  log: (ctx, entry) => {
    if (!(0, debug.isDebugEnabled)()) return;
    try {
      (0, debug.debugLog)("console.backend", {
        level: entry.level,
        message: entry.message,
        contextPath: ctx.getPath(),
        metadata: entry.metadata,
        error: entry.error
      });
    } catch (_a) {
      /* ignore */
    }
  }
};
const consoleCtx = (0, dist /* createContext */.q6)().withName("console").with(dist /* loggerKey */._O, backend);
const logger = (0, dist /* createLogger */.h)("console");
function makeHandler(level, source) {
  return (...args) => {
    try {
      let message;
      if (args.length === 0) {
        message = "";
      } else if (typeof args[0] === "string") {
        message = (0, external_node_util_.format)(args[0], ...args.slice(1));
      } else {
        message = args.map(a => (0, external_node_util_.inspect)(a, {
          depth: 6,
          breakLength: Infinity,
          compact: true
        })).join(" ");
      }
      const meta = {
        source
      };
      switch (level) {
        case "debug":
          logger.debug(consoleCtx, message, meta);
          break;
        case "info":
          logger.info(consoleCtx, message, meta);
          break;
        case "warn":
          logger.warn(consoleCtx, message, meta);
          break;
        case "error":
          logger.error(consoleCtx, message, undefined, meta);
          break;
      }
    } catch (_a) {
      /* never throw from console */
    }
  };
}
const shim = {
  log: makeHandler("info", "console.log"),
  info: makeHandler("info", "console.info"),
  warn: makeHandler("warn", "console.warn"),
  error: makeHandler("error", "console.error"),
  debug: makeHandler("debug", "console.debug"),
  trace: makeHandler("debug", "console.trace"),
  clear: () => {}
};
Object.assign(globalThis.console, shim);

// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
var external_node_path_default = /*#__PURE__*/__webpack_require__.n(external_node_path_);
// EXTERNAL MODULE: external "node:url"
var external_node_url_ = __webpack_require__("node:url");
// EXTERNAL MODULE: ../local-worker/dist/index.js + 13 modules
var local_worker_dist = __webpack_require__("../local-worker/dist/index.js");
// EXTERNAL MODULE: ../shell-exec/dist/index.js + 19 modules
var shell_exec_dist = __webpack_require__("../shell-exec/dist/index.js");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var utils_dist = __webpack_require__("../utils/dist/index.js");
// EXTERNAL MODULE: ../agent-client/dist/index.js + 7 modules
var agent_client_dist = __webpack_require__("../agent-client/dist/index.js");
// EXTERNAL MODULE: ../cli-credentials/dist/index.js + 2 modules
var cli_credentials_dist = __webpack_require__("../cli-credentials/dist/index.js");
// EXTERNAL MODULE: ../cursor-config/dist/index.js + 11 modules
var cursor_config_dist = __webpack_require__("../cursor-config/dist/index.js");
// EXTERNAL MODULE: ../local-exec/dist/index.js + 53 modules
var local_exec_dist = __webpack_require__("../local-exec/dist/index.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@commander-js+extra-typings@14.0.0_commander@14.0.0/node_modules/@commander-js/extra-typings/index.js
var extra_typings = __webpack_require__("../../node_modules/.pnpm/@commander-js+extra-typings@14.0.0_commander@14.0.0/node_modules/@commander-js/extra-typings/index.js");
; // ../../node_modules/.pnpm/@commander-js+extra-typings@14.0.0_commander@14.0.0/node_modules/@commander-js/extra-typings/esm.mjs

// wrapper to provide named exports for ESM.
const {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help
} = extra_typings;

// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/connect-error.js
var connect_error = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/connect-error.js");
// EXTERNAL MODULE: ./src/analytics.ts
var analytics = __webpack_require__("./src/analytics.ts");
// EXTERNAL MODULE: ./src/client.ts + 30 modules
var client = __webpack_require__("./src/client.ts");
// EXTERNAL MODULE: ./src/console-io.ts
var console_io = __webpack_require__("./src/console-io.ts");
// EXTERNAL MODULE: ./src/constants.ts
var constants = __webpack_require__("./src/constants.ts");
// EXTERNAL MODULE: ./src/ephemeral-bridge.ts
var ephemeral_bridge = __webpack_require__("./src/ephemeral-bridge.ts");
// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__("node:crypto");
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__("node:fs/promises");
// EXTERNAL MODULE: ../indexing-client/dist/index.js + 12 modules
var indexing_client_dist = __webpack_require__("../indexing-client/dist/index.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var lib = __webpack_require__("../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs");
; // ./src/project/repository-state-provider.ts
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

// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__("node:os");
var external_node_os_default = /*#__PURE__*/__webpack_require__.n(external_node_os_);
// EXTERNAL MODULE: ../../node_modules/.pnpm/sqlite3@5.1.7_patch_hash=wpoum7zjk6ojzyl25zadce3uda/node_modules/sqlite3/lib/sqlite3.js
var sqlite3 = __webpack_require__("../../node_modules/.pnpm/sqlite3@5.1.7_patch_hash=wpoum7zjk6ojzyl25zadce3uda/node_modules/sqlite3/lib/sqlite3.js");
var sqlite3_default = /*#__PURE__*/__webpack_require__.n(sqlite3);
; // ./src/utils/vscode.ts
var vscode_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class SqliteDatabase extends sqlite3_default().Database {}
function getUserDataPath() {
  const home = external_node_os_default().homedir();
  if (isMacintosh) {
    return (0, external_node_path_.join)(home, "Library", "Application Support", "Cursor");
  } else if (isLinux) {
    return (0, external_node_path_.join)(process.env.XDG_CONFIG_HOME || external_node_path_default().join(home, ".config"), "cursor");
  } else if (isWindows) {
    // Windows: Use APPDATA environment variable or fallback to AppData\Roaming
    const appData = process.env.APPDATA || (0, external_node_path_.join)(home, "AppData", "Roaming");
    return (0, external_node_path_.join)(appData, "Cursor");
  } else {
    return undefined;
  }
}
function getAppSettingsHome() {
  const userDataPath = getUserDataPath();
  if (!userDataPath) {
    return undefined;
  }
  return (0, external_node_path_.join)(userDataPath, "User");
}
function getWorkspaceStorageHome() {
  const appSettingsHome = getAppSettingsHome();
  if (!appSettingsHome) {
    return undefined;
  }
  return (0, external_node_path_.join)(appSettingsHome, "workspaceStorage");
}
const isLinux = external_node_os_default().platform() === "linux";
const isMacintosh = external_node_os_default().platform() === "darwin";
const isWindows = external_node_os_default().platform() === "win32";
function getFolderId(folderPath, folderStat) {
  // Local: we use the ctime as extra salt to the
  // identifier so that folders getting recreated
  // result in a different identifier. However, if
  // the stat is not provided we return `undefined`
  // to ensure identifiers are stable for the given
  // URI.
  let ctime;
  if (isLinux) {
    ctime = folderStat.ino; // Linux: birthtime is ctime, so we cannot use it! We use the ino instead!
  } else if (isMacintosh) {
    ctime = folderStat.birthtime.getTime();
  } else if (isWindows) {
    if (typeof folderStat.birthtimeMs === "number") {
      ctime = Math.floor(folderStat.birthtimeMs); // Windows: fix precision issue in node.js 8.x to get 7.x results (see https://github.com/nodejs/node/issues/19897)
    } else {
      ctime = folderStat.birthtime.getTime();
    }
  }
  const r = (0, external_node_crypto_.createHash)("md5").update(folderPath).update(ctime ? String(ctime) : "").digest("hex"); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
  return r;
}
function getWorkspaceStorage(workspaceId) {
  const workspaceStorageHome = getWorkspaceStorageHome();
  if (!workspaceStorageHome) {
    return undefined;
  }
  return (0, external_node_path_.join)(workspaceStorageHome, workspaceId);
}
function getStateVscdbPath(workspaceId) {
  const workspaceStorage = getWorkspaceStorage(workspaceId);
  if (!workspaceStorage) {
    return undefined;
  }
  return (0, external_node_path_.join)(workspaceStorage, "state.vscdb");
}
class SqliteKvStore {
  constructor(db) {
    this.db = db;
  }
  get(key) {
    return vscode_awaiter(this, void 0, void 0, function* () {
      const value = yield new Promise((resolve, reject) => {
        this.db.get("SELECT value FROM ItemTable WHERE key = ?", [key], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      return value === null || value === void 0 ? void 0 : value.value;
    });
  }
}
function getWorkspaceKvStore(workspacePath) {
  return vscode_awaiter(this, void 0, void 0, function* () {
    let workspaceStat;
    try {
      workspaceStat = yield (0, promises_.stat)(workspacePath);
    } catch (_) {
      return undefined;
    }
    const workspaceId = getFolderId(workspacePath, workspaceStat);
    const stateVscdb = getStateVscdbPath(workspaceId);
    if (!stateVscdb) {
      return undefined;
    }
    if (!(0, external_node_fs_.existsSync)(stateVscdb)) {
      return undefined;
    }
    const db = new SqliteDatabase(stateVscdb);
    const kvStore = new SqliteKvStore(db);
    return kvStore;
  });
}
function getHash(str) {
  const hash = (0, external_node_crypto_.createHash)("sha256");
  hash.update(str);
  return hash.digest("hex");
}
function getLegacyRepoName(workspaceRoots) {
  // MUST NOT CHANGE WITHOUT A MIGRATION, EVER.
  // IT CHANGES THE KEY OF THE STATE THAT WE ARE STORING....
  // this is difficult to change because we don't want to force people to re-index all at once
  const sortedUris = workspaceRoots.sort((a, b) => a.fsPath.localeCompare(b.fsPath));
  const folderNames = sortedUris.map(root => external_node_path_default().basename(root.fsPath)).join("-");
  return `${getHash(sortedUris.map(root => root.fsPath).join("-"))}-${folderNames}`;
}
; // ./src/project/vscode-repo-key-provider.ts
var vscode_repo_key_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class VscodeRepoKeyProvider {
  constructor(workspacePath) {
    this.workspacePath = workspacePath;
    this.vscodeRepoKeysPromise = VscodeRepoKeyProvider.loadRepoKeys(workspacePath);
  }
  getRepoKeys() {
    return vscode_repo_key_provider_awaiter(this, void 0, void 0, function* () {
      return yield this.vscodeRepoKeysPromise;
    });
  }
  static loadRepoKeys(workspacePath) {
    return vscode_repo_key_provider_awaiter(this, void 0, void 0, function* () {
      var _a;
      const kvStore = yield getWorkspaceKvStore(workspacePath);
      if (kvStore === undefined) {
        return undefined;
      }
      const k = "anysphere.cursor-retrieval";
      const v = JSON.parse((_a = yield kvStore.get(k)) !== null && _a !== void 0 ? _a : "{}");
      const legacyRepoName = getLegacyRepoName([new utils_dist /* FileURL */.qA(workspacePath)]);
      const itemKey = `map/${legacyRepoName}/repoKeys`;
      const repoKeys = v[itemKey];
      if (repoKeys === undefined) {
        return undefined;
      }
      return repoKeys;
    });
  }
}

// EXTERNAL MODULE: ../proto/dist/generated/aiserver/v1/dashboard_pb.js
var dashboard_pb = __webpack_require__("../proto/dist/generated/aiserver/v1/dashboard_pb.js");
// EXTERNAL MODULE: ./src/utils/api-endpoint.ts
var api_endpoint = __webpack_require__("./src/utils/api-endpoint.ts");
; // ./src/team/team-admin-settings-service.ts
var team_admin_settings_service_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function fetchTeamAdminSettings(dashboardClient) {
  return team_admin_settings_service_awaiter(this, void 0, void 0, function* () {
    try {
      const response = yield dashboardClient.getTeamAdminSettings(new GetTeamAdminSettingsRequest({}));
      return response;
    } catch (error) {
      debugLogJSON("team.fetchTeamAdminSettings.error", extractErrorInfo(error), "ERROR");
      return undefined;
    }
  });
}
function setupTeamSettingsService(credentialManager, endpoint, configProvider) {
  const backendUrl = (0, api_endpoint /* getApiEndpoint */.G6)(endpoint);
  const dashboardClient = (0, cursor_config_dist /* createDashboardClient */.Vi)({
    credentialManager,
    endpoint: backendUrl,
    configProvider
  });
  const teamSettingsService = new local_exec_dist.ConnectTeamSettingsService(dashboardClient);
  return teamSettingsService;
}
; // ./src/utils/error-display.ts

/**
 * Displays ErrorDetails to the user via ephemeral messages
 */
function displayErrorDetails(details) {
  var _a, _b, _c, _d, _e, _f;
  const errorLines = [];
  if ((_a = details.details) === null || _a === void 0 ? void 0 : _a.title) {
    errorLines.push(`Error: ${details.details.title}`);
  } else {
    errorLines.push("Error: Connection failed");
  }
  if ((_b = details.details) === null || _b === void 0 ? void 0 : _b.detail) {
    errorLines.push(details.details.detail);
  }
  if ((_c = details.details) === null || _c === void 0 ? void 0 : _c.additionalInfo) {
    for (const [key, value] of Object.entries(details.details.additionalInfo)) {
      errorLines.push(`${key}: ${value}`);
    }
  }
  (0, ephemeral_bridge /* pushEphemeral */.ET)(errorLines);
  (0, debug.debugLog)("ErrorDetails displayed", {
    error: details.error,
    title: (_d = details.details) === null || _d === void 0 ? void 0 : _d.title,
    detail: (_e = details.details) === null || _e === void 0 ? void 0 : _e.detail,
    additionalInfo: (_f = details.details) === null || _f === void 0 ? void 0 : _f.additionalInfo
  });
}
/**
 * Displays general errors to the user via ephemeral messages
 */
function displayGeneralError(error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  pushEphemeral([`Error: ${errorMessage}`]);
  debugLog("General error displayed", {
    errorMessage
  });
}
/**
 * Formats ErrorDetails into user-friendly ephemeral lines
 */
function formatErrorDetails(details) {
  var _a, _b, _c;
  const errorLines = [];
  if ((_a = details.details) === null || _a === void 0 ? void 0 : _a.title) {
    errorLines.push(`Error: ${details.details.title}`);
  } else {
    errorLines.push("Error: Connection failed");
  }
  if ((_b = details.details) === null || _b === void 0 ? void 0 : _b.detail) {
    errorLines.push(details.details.detail);
  }
  if ((_c = details.details) === null || _c === void 0 ? void 0 : _c.additionalInfo) {
    for (const [key, value] of Object.entries(details.details.additionalInfo)) {
      errorLines.push(`${key}: ${value}`);
    }
  }
  return errorLines;
}

// EXTERNAL MODULE: ./src/utils/error-info.ts
var error_info = __webpack_require__("./src/utils/error-info.ts");
// EXTERNAL MODULE: external "node:events"
var external_node_events_ = __webpack_require__("node:events");
; // ./src/utils/suppress-max-listeners-warning.ts

/**
 * Suppress MaxListenersExceededWarning for process stdio and globally.
 *
 * Sets the global default max listeners for all EventEmitters to unlimited and
 * also updates the existing stdio streams (stdout, stderr, stdin) so that
 * resize or data listeners won't trigger warnings.
 */
function suppressEventEmitterMaxListenersWarnings() {
  try {
    (0, external_node_events_.setMaxListeners)(0);
  } catch (_a) {
    // intentionally ignore
  }
  // Back-compat: some code paths still consult EventEmitter.defaultMaxListeners
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    external_node_events_.EventEmitter.defaultMaxListeners = 0;
  } catch (_b) {
    // intentionally ignore
  }
  const maybeSetUnlimited = emitter => {
    try {
      const ee = emitter;
      if (typeof (ee === null || ee === void 0 ? void 0 : ee.setMaxListeners) === "function") {
        ee.setMaxListeners(0);
      }
    } catch (_a) {
      // intentionally ignore
    }
  };
  maybeSetUnlimited(process.stdout);
  maybeSetUnlimited(process.stderr);
  maybeSetUnlimited(process.stdin);
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/global-agent@3.0.0/node_modules/global-agent/dist/index.js
var global_agent_dist = __webpack_require__("../../node_modules/.pnpm/global-agent@3.0.0/node_modules/global-agent/dist/index.js");
; // ./src/cli.ts
var cli_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

// Suppress noisy MaxListeners warnings from stdio resize listeners in TTYs ASAP
suppressEventEmitterMaxListenersWarnings();
// enable proxy support

process.env.GLOBAL_AGENT_ENVIRONMENT_VARIABLE_NAMESPACE = "";
(0, global_agent_dist /* bootstrap */.Nw)();
const restoreCursor = () => {
  if (!process.stdout.isTTY) {
    return;
  }
  try {
    process.stdout.write("\x1b[?25h");
  } catch (_a) {
    // Ignore errors when restoring cursor
  }
};
process.once("exit", restoreCursor);
process.once("SIGINT", () => {
  restoreCursor();
  process.exit(130);
});
process.once("SIGTERM", () => {
  restoreCursor();
  process.exit(143);
});
/**
 * Compare two semantic version strings
 * Returns true if currentVersion >= minVersion.
 *
 * Note that additional SemVer identifiers after a hyphen (e.g. "-<hash>", or "-beta") are ignored.
 */
function isAtLeastMinVersion(currentVersion, minVersion) {
  if (currentVersion === "unknown") {
    return true;
  }
  // Parse version strings into list of numbers (e.g., "1.2.3" -> [1, 2, 3])
  const parseVersion = version => {
    return version.split(".").map(v => parseInt(v, 10) || 0);
  };
  const versionWithoutPatch = version => {
    return version.split("-")[0];
  };
  const current = parseVersion(versionWithoutPatch(currentVersion));
  const min = parseVersion(versionWithoutPatch(minVersion));
  // Compare version parts
  const maxLength = Math.max(current.length, min.length);
  for (let i = 0; i < maxLength; i++) {
    const currentPart = current[i] || 0;
    const minPart = min[i] || 0;
    if (currentPart > minPart) {
      return true;
    } else if (currentPart < minPart) {
      return false;
    }
  }
  return true;
}
function setupCLI(_a) {
  return cli_awaiter(this, arguments, void 0, function* ({
    rgPathFactory,
    localWorkerClientFactory
  }) {
    var _b;
    const loggerBackend = {
      log: (_ctx, {
        message,
        error,
        metadata
      }) => {
        (0, debug.debugLog)("logger", {
          message,
          error,
          metadata
        });
      }
    };
    const ctx = (0, dist /* createContext */.q6)().withName("cli").with(dist /* loggerKey */._O, loggerBackend);
    (0, analytics /* trackEvent */.sx)("cli.launch");
    // rgPath is threaded through props to where it's used; no env required
    // Load configuration
    const configProvider = yield cursor_config_dist /* FileBasedConfigProvider */.FO.loadFromDefaults({
      onDebugLog: debug.debugLog,
      onError: (code, message) => {
        (0, console_io /* intentionallyWriteToStderr */.p2)(message);
        process.exit(code);
      }
    });
    // Global error handlers: surface errors in the TUI and send to debug server
    const emitGlobalError = (event, err) => cli_awaiter(this, void 0, void 0, function* () {
      (0, debug.debugLog)("Error: ", err);
      // we don't want to display user aborted request errors
      if (err instanceof agent_client_dist /* UserAbortedRequestError */._8) {
        return;
      }
      if (err instanceof connect_error /* ConnectError */.T) {
        const errorDetails = (0, agent_client_dist /* getErrorDetailFromConnectError */.mb)(err);
        if (errorDetails) {
          displayErrorDetails(errorDetails);
        }
        return;
      }
      const {
        message,
        stack
      } = (0, error_info /* extractErrorInfo */.q)(err);
      const lines = [`Error: ${message}`];
      (0, ephemeral_bridge /* pushEphemeral */.ET)(lines);
      if (!(0, ephemeral_bridge /* hasEphemeralListener */.mP)()) {
        (0, console_io /* intentionallyWriteToStderr */.p2)(`\nError (${event}): ${message}\n${stack !== null && stack !== void 0 ? stack : ""}`);
      }
    });
    process.on("uncaughtException", err => {
      void emitGlobalError("uncaughtException", err);
    });
    process.on("unhandledRejection", reason => {
      void emitGlobalError("unhandledRejection", reason);
    });
    // Create credential manager instance using a static domain baked at build time
    const staticDomain = (_b = "cursor") !== null && _b !== void 0 ? _b : "cursor-dev";
    const credentialManager = (0, cli_credentials_dist /* createCredentialManager */.jo)(staticDomain);
    const program = new Command().name(process.env.CURSOR_CLI ? "cursor agent" : "cursor-agent").description("Cursor Agent").option("-v, --version", "Output the version number").helpOption("-h, --help", "Display help for command").helpCommand("help [command]", "Display help for command").addOption(new Option("--debug", "Enable debug mode with local log server").hideHelp()).option("--api-key <key>", "API key for authentication (can also use CURSOR_API_KEY env var)").option("-H, --header <header>", "Add custom header to agent requests (format: 'Name: Value', can be used multiple times)").addOption(new Option("--auth-token <token>", "Auth token to use directly (can also use CURSOR_AUTH_TOKEN env var)").hideHelp())
    // Main API connection
    .addOption(new Option("-e, --endpoint <url>", "API endpoint URL (defaults to https://api2.cursor.sh)").default("https://api2.cursor.sh").hideHelp()).addOption(new Option("-k, --insecure", "Allow insecure HTTPS connections").default(false).hideHelp()).addOption(new Option("--http-version <version>", "HTTP version to use (1.1 or 2)").default("1.1").hideHelp())
    // Repo API connection
    .addOption(new Option("--repo-endpoint <url>", "API endpoint URL (defaults to https://repo42.cursor.sh)").default("https://repo42.cursor.sh").hideHelp()).addOption(new Option("--repo-insecure", "Allow insecure HTTPS connections").default(false).hideHelp()).addOption(new Option("--repo-http-version <version>", "HTTP version to use (1.1 or 2)").default("1.1").hideHelp())
    // Headless
    .option("-p, --print", "Print responses to console (for scripts or non-interactive use). Has access to all tools, including write and bash.", false).option("--output-format <format>", "Output format (only works with --print): text | json | stream-json", "text").option("--stream-partial-output", "Stream partial output as individual text deltas (only works with --print and stream-json format)", false).addOption(new Option("--printenv", "Capture environment snapshot after each terminal command (only available with --print/headless mode)").default(false).hideHelp()).addOption(new Option("--disable-indexing", "Disables indexing").default(false).hideHelp())
    // Other
    .option("-c, --cloud", "Start in cloud mode (open composer picker on launch)", false).addOption(new Option("-b, --background", "Start in background mode (alias for --cloud, deprecated)").default(false).hideHelp()).option("--resume [chatId]", "Resume a chat session.", false).option("--model <model>", "Model to use (e.g., gpt-5, sonnet-4, sonnet-4-thinking)").addOption(new Option("--system-prompt <file>", "Replace system prompt with contents of file (Anysphere/OpenAI team only)").hideHelp()).option("-f, --force", "Force allow commands unless explicitly denied", false).option("--approve-mcps", "Automatically approve all MCP servers (only works with --print/headless mode)", false).option("--browser", "Enable browser automation support", false).option("--workspace <path>", "Workspace directory to use (defaults to current working directory)").addOption(new Option("--min-version <version>", "Minimum version requirement for CLI compatibility, specified as a SemVer string. CLI will exit if the current version is less than the minimum version.").hideHelp() // hide --min-version from help output, this is mainly used internally for auto-update
    );
    program.on("option:version", () => {
      const version = "2025.11.25-d5b3271";
      if (version) {
        process.stdout.write(`${version}\n`);
        process.exit(0);
      } else {
        process.stdout.write("Version information not available\n");
        process.exit(0);
      }
    });
    const getLazyLocalWorkerClient = () => {
      const opts = getRootProgramOptions();
      const options = {
        enableIndexing: !opts.disableIndexing,
        repoEndpoint: opts.repoEndpoint,
        repoInsecure: opts.repoInsecure,
        repoHttpVersion: opts.repoHttpVersion,
        endpoint: opts.endpoint,
        insecure: opts.insecure,
        httpVersion: opts.httpVersion
      };
      const workspacePath = opts.workspace ? external_node_path_default().resolve(opts.workspace) : process.cwd();
      // Validate workspace path if provided
      if (opts.workspace) {
        if (!(0, external_node_fs_.existsSync)(workspacePath)) {
          (0, console_io /* intentionallyWriteToStderr */.p2)(`Error: Workspace path does not exist: ${workspacePath}\n`);
          process.exit(1);
        }
        const stat = (0, external_node_fs_.statSync)(workspacePath);
        if (!stat.isDirectory()) {
          (0, console_io /* intentionallyWriteToStderr */.p2)(`Error: Workspace path is not a directory: ${workspacePath}\n`);
          process.exit(1);
        }
      }
      return localWorkerClientFactory(options, workspacePath);
    };
    if (constants /* isDev */.Cu) {
      program.addOption(new Option("--with-diffs", "Auto-populate file changes from current git status"));
    }
    // Only register shell integration and record commands on non-Windows platforms
    if (true) {
      program.command("record", {
        hidden: true
      }).action(() => cli_awaiter(this, void 0, void 0, function* () {
        const {
          handleRecord
        } = yield __webpack_require__.e(/* import() */8453).then(__webpack_require__.bind(__webpack_require__, "./src/commands/record.ts"));
        return handleRecord();
      }));
      program.command("shell-integration <shell>", {
        hidden: true
      }).action(shell => cli_awaiter(this, void 0, void 0, function* () {
        const {
          handleShellIntegration
        } = yield __webpack_require__.e(/* import() */8871).then(__webpack_require__.bind(__webpack_require__, "./src/commands/shell-integration.ts"));
        return handleShellIntegration(shell);
      }));
      program.command("install-shell-integration").description("Install shell integration to ~/.zshrc").action(() => cli_awaiter(this, void 0, void 0, function* () {
        const {
          handleInstallShellIntegration
        } = yield __webpack_require__.e(/* import() */7469).then(__webpack_require__.bind(__webpack_require__, "./src/commands/install-shell-integration.ts"));
        return handleInstallShellIntegration();
      }));
      program.command("uninstall-shell-integration").description("Remove shell integration from ~/.zshrc").action(() => cli_awaiter(this, void 0, void 0, function* () {
        const {
          handleUninstallShellIntegration
        } = yield __webpack_require__.e(/* import() */4128).then(__webpack_require__.bind(__webpack_require__, "./src/commands/uninstall-shell-integration.ts"));
        return handleUninstallShellIntegration();
      }));
    }
    // Login subcommand
    program.command("login").description("Authenticate with Cursor. Set NO_OPEN_BROWSER to disable browser opening.").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const opts = program.opts();
      const backendUrl = (0, api_endpoint /* getApiEndpoint */.G6)(opts.endpoint);
      const dashboardClient = (0, cursor_config_dist /* createDashboardClient */.Vi)({
        credentialManager,
        endpoint: backendUrl,
        configProvider
      });
      const {
        handleLogin
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(769)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/login.tsx"));
      return handleLogin(credentialManager, configProvider, dashboardClient);
    }));
    // Dev Login subcommand (only available in dev builds)
    if (constants /* isDev */.Cu) {
      program.command("dev-login").description("authenticate with development backend (dev only)").option("-t, --trial", "login with free trial account instead of pro", false).action((_, command) => cli_awaiter(this, void 0, void 0, function* () {
        const {
          handleDevLogin
        } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(2227)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/dev-login.tsx"));
        return handleDevLogin(credentialManager, command.optsWithGlobals());
      }));
    }
    // Logout subcommand
    program.command("logout").description("Sign out and clear stored authentication").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleLogout
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(5302)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/logout.tsx"));
      return handleLogout(credentialManager, configProvider);
    }));
    // Helper function to get root program options (works around Commander.js nested command issues)
    function getRootProgramOptions() {
      // Traverse up the parent chain to find the root program
      let current = program;
      while (current === null || current === void 0 ? void 0 : current.parent) {
        current = current.parent;
      }
      return (current !== null && current !== void 0 ? current : program).opts();
    }
    // Helper function to resolve and validate workspace path
    function resolveWorkspacePath(opts) {
      const workspacePath = opts.workspace ? external_node_path_default().resolve(opts.workspace) : process.cwd();
      // Validate workspace path if provided
      if (opts.workspace) {
        if (!(0, external_node_fs_.existsSync)(workspacePath)) {
          (0, console_io /* intentionallyWriteToStderr */.p2)(`Error: Workspace path does not exist: ${workspacePath}\n`);
          process.exit(1);
        }
        const stat = (0, external_node_fs_.statSync)(workspacePath);
        if (!stat.isDirectory()) {
          (0, console_io /* intentionallyWriteToStderr */.p2)(`Error: Workspace path is not a directory: ${workspacePath}\n`);
          process.exit(1);
        }
      }
      return workspacePath;
    }
    // MCP command group
    const mcp = program.command("mcp").description("Manage MCP servers");
    // MCP Login subcommand: `mcp login <identifier>`
    mcp.command("login <identifier>").description("Authenticate with an MCP server configured in .cursor/mcp.json or ~/.cursor/mcp.json").action(identifier => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleMcpLogin
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(3442)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/mcp-login.tsx"));
      const opts = getRootProgramOptions();
      const teamSettingsService = setupTeamSettingsService(credentialManager, opts.endpoint, configProvider);
      const workspacePath = resolveWorkspacePath(opts);
      const projectPath = (0, cursor_config_dist /* getProjectDir */.Xq)(workspacePath);
      const mcpLoader = cursor_config_dist /* CursorConfigMcpLoader */.aK.init(teamSettingsService, workspacePath, projectPath);
      return handleMcpLogin(ctx, identifier, mcpLoader);
    }));
    // MCP List subcommand: `mcp list`
    mcp.command("list").description("List configured MCP servers and their status").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleMcpList
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(218)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/mcp-list.tsx"));
      const opts = getRootProgramOptions();
      const teamSettingsService = setupTeamSettingsService(credentialManager, opts.endpoint, configProvider);
      const workspacePath = resolveWorkspacePath(opts);
      const projectPath = (0, cursor_config_dist /* getProjectDir */.Xq)(workspacePath);
      const mcpLoader = cursor_config_dist /* CursorConfigMcpLoader */.aK.init(teamSettingsService, workspacePath, projectPath);
      return handleMcpList(ctx, mcpLoader);
    }));
    // MCP List Tools subcommand: `mcp list-tools <identifier>`
    mcp.command("list-tools <identifier>").description("List available tools and their argument names for a specific MCP").action(identifier => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleMcpListTools
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(1331)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/mcp-list-tools.tsx"));
      const opts = getRootProgramOptions();
      const teamSettingsService = setupTeamSettingsService(credentialManager, opts.endpoint, configProvider);
      const workspacePath = resolveWorkspacePath(opts);
      const projectPath = (0, cursor_config_dist /* getProjectDir */.Xq)(workspacePath);
      const mcpLoader = cursor_config_dist /* CursorConfigMcpLoader */.aK.init(teamSettingsService, workspacePath, projectPath);
      return handleMcpListTools(ctx, identifier, mcpLoader);
    }));
    // MCP Disable subcommand: `mcp disable <identifier>`
    mcp.command("disable <identifier>").description("Remove an MCP server from the local approved list").action(identifier => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleMcpDisable
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(9406)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/disable.tsx"));
      return handleMcpDisable(configProvider, identifier);
    }));
    // Repo subcommand group
    const repo = program.command("repo", {
      hidden: true
    }).description("Manage repository");
    repo.command("info").description("Get repository info").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleRepoInfo
      } = yield __webpack_require__.e(/* import() */7735).then(__webpack_require__.bind(__webpack_require__, "./src/commands/repo-info.tsx"));
      const localWorkerClient = getLazyLocalWorkerClient();
      return handleRepoInfo(localWorkerClient);
    }));
    repo.command("status").description("Get repository status").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleRepoStatus
      } = yield __webpack_require__.e(/* import() */945).then(__webpack_require__.bind(__webpack_require__, "./src/commands/repo-status.tsx"));
      const localWorkerClient = getLazyLocalWorkerClient();
      return handleRepoStatus(localWorkerClient);
    }));
    repo.command("search <query>", {
      hidden: true
    }).description("Search repository code using semantic search").action(query => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleSearch
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(128)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/search.tsx"));
      const localWorkerClient = getLazyLocalWorkerClient();
      const opts = getRootProgramOptions();
      return handleSearch(query, localWorkerClient, credentialManager, {
        endpoint: opts.endpoint,
        insecure: opts.insecure,
        httpVersion: opts.httpVersion,
        repoEndpoint: opts.repoEndpoint,
        repoInsecure: opts.repoInsecure,
        repoHttpVersion: opts.repoHttpVersion
      });
    }));
    // Worker subcommand group (hidden)
    const worker = program.command("worker", {
      hidden: true
    }).description("Manage local worker server");
    worker.command("ping").description("Ping the local worker server").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const localWorkerClient = getLazyLocalWorkerClient();
      try {
        const result = yield localWorkerClient.ping();
        (0, console_io /* intentionallyWriteToStderr */.p2)(result);
      } catch (error) {
        (0, console_io /* intentionallyWriteToStderr */.p2)(`Failed to ping worker: ${String(error)}`);
      }
      process.exit(1);
    }));
    worker.command("kill").description("Kill the local worker server").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const localWorkerClient = getLazyLocalWorkerClient();
      try {
        yield localWorkerClient.kill();
        (0, console_io /* intentionallyWriteToStderr */.p2)("Worker server killed");
      } catch (error) {
        (0, console_io /* intentionallyWriteToStderr */.p2)(`Failed to kill worker: ${String(error)}`);
        process.exit(1);
      }
    }));
    worker.command("sleep").description("Sleep on the local worker server").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const localWorkerClient = getLazyLocalWorkerClient();
      try {
        const signal = AbortSignal.timeout(500);
        yield localWorkerClient.sleep(1000, signal);
        (0, console_io /* intentionallyWriteToStderr */.p2)("Worker server slept");
      } catch (error) {
        (0, console_io /* intentionallyWriteToStderr */.p2)(`Failed to sleep worker: ${String(error)}`);
        process.exit(1);
      }
      process.exit(0);
    }));
    program.command("worker-server", {
      hidden: true
    }).description("Run a worker server").action(() => cli_awaiter(this, void 0, void 0, function* () {
      var _a;
      const {
        runServer
      } = yield Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "../local-worker/dist/index.js"));
      (0, console_io /* intentionallyWriteToStderr */.p2)(`running worker server`);
      const socketPath = process.env.AGENT_CLI_SOCKET_PATH;
      if (!socketPath) {
        (0, console_io /* intentionallyWriteToStderr */.p2)(`AGENT_CLI_SOCKET_PATH is not set, socketPath: ${socketPath}`);
        throw new Error("AGENT_CLI_SOCKET_PATH is not set");
      }
      const logPath = process.env.AGENT_CLI_LOG_PATH;
      if (!logPath) {
        (0, console_io /* intentionallyWriteToStderr */.p2)(`AGENT_CLI_LOG_PATH is not set, logPath: ${logPath}`);
        throw new Error("AGENT_CLI_LOG_PATH is not set");
      }
      const options = JSON.parse((_a = process.env.AGENT_CLI_WORKER_OPTIONS) !== null && _a !== void 0 ? _a : "{}");
      (0, console_io /* intentionallyWriteToStderr */.p2)(`Running worker server with options: ${JSON.stringify(options)}`);
      const repoStateProvider = new FileBasedRepositoryStateProvider(external_node_path_default().join((0, cursor_config_dist /* getProjectDir */.Xq)(process.cwd()), "repo.json"));
      const vscodeRepoKeyProvider = new VscodeRepoKeyProvider(process.cwd());
      const serverConfigServiceClient = (0, client /* createServerConfigServiceClient */.ms)(credentialManager, options.endpoint, options.insecure, configProvider);
      const serverConfigService = new local_exec_dist.ConnectServerConfigService(serverConfigServiceClient);
      const repoIdentityProvider = new UuidRepositoryIdentityProvider(repoStateProvider, serverConfigService, vscodeRepoKeyProvider, credentialManager);
      return runServer(socketPath, logPath, repoIdentityProvider, credentialManager, options);
    }));
    // Status subcommand
    program.command("status").alias("whoami").description("View authentication status").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleStatus
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(3686), __webpack_require__.e(9042)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/status.tsx"));
      const opts = program.opts();
      const backendUrl = (0, api_endpoint /* getApiEndpoint */.G6)(opts.endpoint);
      const dashboardClient = (0, cursor_config_dist /* createDashboardClient */.Vi)({
        credentialManager,
        endpoint: backendUrl,
        configProvider
      });
      return handleStatus(credentialManager, dashboardClient);
    }));
    // ACP subcommand - starts the agent as an ACP server
    program.command("acp", {
      hidden: true
    }).description("Start the Cursor Agent as an ACP (Agent Client Protocol) server").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        runAcp
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(7184), __webpack_require__.e(6624), __webpack_require__.e(3686), __webpack_require__.e(9786), __webpack_require__.e(4540), __webpack_require__.e(7414)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/acp.ts"));
      const localWorkerClient = getLazyLocalWorkerClient();
      const opts = getRootProgramOptions();
      return runAcp(ctx, opts, {
        rgPath: rgPathFactory(),
        diagnosticsProvider: localWorkerClient,
        codebaseReferenceProvider: localWorkerClient,
        configProvider,
        credentialManager
      });
    }));
    // Install subcommand
    program.command("install <version> <urlPrefix>", {
      hidden: true
    }).description("Install Cursor Agent with specified version and URL prefix").action((version, urlPrefix) => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleInstall
      } = yield __webpack_require__.e(/* import() */4761).then(__webpack_require__.bind(__webpack_require__, "./src/commands/install.ts"));
      return handleInstall(version, urlPrefix);
    }));
    // Update subcommand
    program.command("update").alias("upgrade").description("Update Cursor Agent to the latest version").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleUpdate
      } = yield __webpack_require__.e(/* import() */1517).then(__webpack_require__.bind(__webpack_require__, "./src/commands/update.ts"));
      const opts = program.opts();
      const backendUrl = (0, api_endpoint /* getApiEndpoint */.G6)(opts.endpoint);
      const dashboardClient = (0, cursor_config_dist /* createDashboardClient */.Vi)({
        credentialManager,
        endpoint: backendUrl,
        configProvider
      });
      return handleUpdate(dashboardClient, configProvider);
    }));
    program.command("set-channel <channel>", {
      hidden: true
    }).description("Set the channel for the Cursor Agent").action(channel => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleSetChannel
      } = yield __webpack_require__.e(/* import() */8972).then(__webpack_require__.bind(__webpack_require__, "./src/commands/set-channel.ts"));
      return handleSetChannel(configProvider, channel);
    }));
    program.command("get-channel", {
      hidden: true
    }).description("Get the configured channel for the Cursor Agent").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleGetChannel
      } = yield __webpack_require__.e(/* import() */9864).then(__webpack_require__.bind(__webpack_require__, "./src/commands/get-channel.ts"));
      return handleGetChannel(configProvider);
    }));
    // Create Chat subcommand
    program.command("create-chat").description("Create a new empty chat and return its ID").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleCreateChat
      } = yield __webpack_require__.e(/* import() */567).then(__webpack_require__.bind(__webpack_require__, "./src/commands/create-chat.ts"));
      return handleCreateChat();
    }));
    // Agent subcommand - always starts in agent mode
    program.command("agent").description("Start the Cursor Agent").argument("[prompt...]", "Initial prompt for the agent").action(promptArgs => cli_awaiter(this, void 0, void 0, function* () {
      const opts = getRootProgramOptions();
      return agentAction(promptArgs, opts);
    }));
    // Model shortcut helper and commands
    function registerModelShortcut(commandName, modelId, prettyName) {
      program.command(commandName, {
        hidden: true
      }).description(`Start the Cursor Agent with the ${prettyName !== null && prettyName !== void 0 ? prettyName : modelId} model`).argument("[prompt...]", "Initial prompt for the agent").action(promptArgs => cli_awaiter(this, void 0, void 0, function* () {
        const {
          runChat
        } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(9802), __webpack_require__.e(7184), __webpack_require__.e(9090), __webpack_require__.e(3686), __webpack_require__.e(9786), __webpack_require__.e(4540), __webpack_require__.e(2869), __webpack_require__.e(7434)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/chat.ts"));
        const localWorkerClient = getLazyLocalWorkerClient();
        const opts = getRootProgramOptions();
        return runChat(ctx, promptArgs, Object.assign(Object.assign({}, opts), {
          model: modelId
        }), {
          rgPath: rgPathFactory(),
          diagnosticsProvider: localWorkerClient,
          codebaseReferenceProvider: localWorkerClient,
          configProvider,
          credentialManager
        });
      }));
    }
    // Shortcuts
    registerModelShortcut("opus", "opus", "Opus");
    registerModelShortcut("sonnet", "sonnet-4", "Sonnet");
    registerModelShortcut("gpt5", "gpt-5", "GPT-5");
    registerModelShortcut("gpt-5", "gpt-5", "GPT-5");
    program.command("ls").description("Resume a chat session").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        runChat
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(9802), __webpack_require__.e(7184), __webpack_require__.e(9090), __webpack_require__.e(3686), __webpack_require__.e(9786), __webpack_require__.e(4540), __webpack_require__.e(2869), __webpack_require__.e(7434)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/chat.ts"));
      const localWorkerClient = getLazyLocalWorkerClient();
      const opts = getRootProgramOptions();
      return runChat(ctx, [], Object.assign(Object.assign({}, opts), {
        resume: true
      }), {
        rgPath: rgPathFactory(),
        diagnosticsProvider: localWorkerClient,
        codebaseReferenceProvider: localWorkerClient,
        configProvider,
        credentialManager
      });
    }));
    // Resume latest chat (alias for --resume=-1). Also support --resume=-n via flag directly.
    program.command("resume").description("Resume the latest chat session").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        runChat
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(9802), __webpack_require__.e(7184), __webpack_require__.e(9090), __webpack_require__.e(3686), __webpack_require__.e(9786), __webpack_require__.e(4540), __webpack_require__.e(2869), __webpack_require__.e(7434)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/chat.ts"));
      const localWorkerClient = getLazyLocalWorkerClient();
      const opts = getRootProgramOptions();
      return runChat(ctx, [], Object.assign(Object.assign({}, opts), {
        resume: "-1"
      }), {
        rgPath: rgPathFactory(),
        diagnosticsProvider: localWorkerClient,
        codebaseReferenceProvider: localWorkerClient,
        configProvider,
        credentialManager
      });
    }));
    // Create sandbox command with subcommands
    const sandboxCommand = program.command("sandbox", {
      hidden: true
    }).description("Sandbox configuration and execution commands");
    // Helper to attach standard sandbox run options
    const attachSandboxRunOptions = cmd => cmd.option("--allow-paths <paths>", "Comma-separated list of additional read/write paths", "").option("--readonly-paths <paths>", "Comma-separated list of additional read-only paths", "").option("--blocked-patterns <patterns>", "Comma-separated list of patterns (in gitignore format) to block", "").option("--sandbox", "Run with sandbox (workspace_readwrite policy)", true).option("--network", "Enable network access in sandbox", false).option("--sb-debug", "Write sandbox debug logs to a temp folder and print the path", false);
    // Add subcommands for configuration
    sandboxCommand.command("enable").description("Enable sandbox mode for command execution").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleSandboxEnable
      } = yield __webpack_require__.e(/* import() */1832).then(__webpack_require__.bind(__webpack_require__, "./src/commands/sandbox-config.ts"));
      return handleSandboxEnable(configProvider);
    }));
    sandboxCommand.command("disable").description("Disable sandbox mode and use allowlist mode (default)").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleSandboxDisable
      } = yield __webpack_require__.e(/* import() */1832).then(__webpack_require__.bind(__webpack_require__, "./src/commands/sandbox-config.ts"));
      return handleSandboxDisable(configProvider);
    }));
    sandboxCommand.command("reset").description("Reset sandbox configuration to defaults").action(() => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleSandboxReset
      } = yield __webpack_require__.e(/* import() */1832).then(__webpack_require__.bind(__webpack_require__, "./src/commands/sandbox-config.ts"));
      return handleSandboxReset(configProvider);
    }));
    // Sandbox run command
    attachSandboxRunOptions(sandboxCommand.command("run").description("Run a command in a sandbox (defaults to workspace read/write)").allowExcessArguments(true)).argument("<cmd>", "Command to run (e.g., ls)").argument("[args...]").action((cmd, args, options) => cli_awaiter(this, void 0, void 0, function* () {
      const {
        handleSandboxDebug
      } = yield Promise.all(/* import() */[__webpack_require__.e(9802), __webpack_require__.e(9786), __webpack_require__.e(2869), __webpack_require__.e(4467)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/sandbox-debug.ts"));
      const opts = {
        allowPaths: options.allowPaths || "",
        readonlyPaths: options.readonlyPaths || "",
        sandbox: Boolean(options.sandbox),
        network: Boolean(options.network),
        sbDebug: Boolean(options.sbDebug),
        blockedPatterns: options.blockedPatterns || ""
      };
      return handleSandboxDebug(ctx, cmd, args, opts);
    }));
    const agentAction = (args, opts) => cli_awaiter(this, void 0, void 0, function* () {
      const {
        runChat
      } = yield Promise.all(/* import() */[__webpack_require__.e(7439), __webpack_require__.e(9802), __webpack_require__.e(7184), __webpack_require__.e(9090), __webpack_require__.e(3686), __webpack_require__.e(9786), __webpack_require__.e(4540), __webpack_require__.e(2869), __webpack_require__.e(7434)]).then(__webpack_require__.bind(__webpack_require__, "./src/commands/chat.ts"));
      const localWorkerClient = getLazyLocalWorkerClient();
      return runChat(ctx, args, opts, {
        rgPath: rgPathFactory(),
        diagnosticsProvider: localWorkerClient,
        codebaseReferenceProvider: localWorkerClient,
        configProvider,
        credentialManager
      });
    });
    if (process.env.CURSOR_CLI) {
      // Check if first argument is 'agent' - if so, route to agent
      const firstArg = process.argv[2];
      if (firstArg === "agent") {
        // Remove 'agent' from argv and continue with agent program
        process.argv.splice(2, 1);
      }
    }
    // Chat subcommand (default behavior for cursor-agent)
    const chatCommand = program.description("Start the Cursor Agent").argument("[prompt...]", "Initial prompt for the agent").action((args, options) => cli_awaiter(this, void 0, void 0, function* () {
      yield agentAction(args, options);
    }));
    if (constants /* isDev */.Cu) {
      chatCommand.option("--ian-dev", "Dev-only: run Ian's Ink component demos", false);
      chatCommand.option("--markdown-test", "Dev-only: run Markdown renderer test UI", false);
      chatCommand.option("--tool-gallery", "Dev-only: render a gallery of tool UIs with dummy data", false);
      chatCommand.option("--color-gallery", "Dev-only: run interactive ANSI-256 color gallery", false);
    }
    // Add a pre-action hook to check minimum version before any command executes
    program.hook("preAction", (_command, _action) => {
      var _a;
      const opts = program.opts();
      if (opts.minVersion) {
        const currentVersion = (_a = "2025.11.25-d5b3271") !== null && _a !== void 0 ? _a : "unknown";
        if (!isAtLeastMinVersion(currentVersion, opts.minVersion)) {
          (0, console_io /* intentionallyWriteToStderr */.p2)(`Error: Current CLI version (${currentVersion}) is less than required minimum version (${opts.minVersion})`);
          process.exit(2);
        }
      }
    });
    yield program.parseAsync(process.argv);
  });
}

// EXTERNAL MODULE: ./src/utils/git.ts
var git = __webpack_require__("./src/utils/git.ts");
// EXTERNAL MODULE: external "node:child_process"
var external_node_child_process_ = __webpack_require__("node:child_process");
; // ./src/worker-manager.ts

function getProjectSocketPathForWorkspace(workspaceDir) {
  const projectDir = (0, cursor_config_dist /* getProjectDirForSocketPath */.kL)(workspaceDir);
  return (0, local_worker_dist.getProjectSocketPath)(projectDir);
}
function getProjectLogPath(workspacePath) {
  return (0, external_node_path_.join)((0, cursor_config_dist /* getProjectDir */.Xq)(workspacePath), "worker.log");
}
function spawnLocalWorker(workspacePath, socketPath, logPath, options) {
  return () => {
    const entryArg = process.argv[1];
    const args = entryArg.endsWith(".tsx") || entryArg.endsWith(".js") ? [entryArg, "worker-server"] : ["worker-server"];
    const child = (0, external_node_child_process_.spawn)(process.execPath, args, {
      // The worker will become a daemon and index the codebase in the background
      stdio: "ignore",
      detached: true,
      cwd: workspacePath,
      env: Object.assign(Object.assign({}, process.env), {
        AGENT_CLI_SOCKET_PATH: socketPath,
        AGENT_CLI_LOG_PATH: logPath,
        AGENT_CLI_WORKER_OPTIONS: JSON.stringify(options)
      })
    });
    child.unref();
  };
}
; // ./src/index.tsx
var src_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
// V V V V DO NOT REORDER THIS IMPORT, IT MUST BE FIRST

// ^ ^ ^ ^ DO NOT REORDER THIS IMPORT, IT MUST BE FIRST

function src_extractErrorInfo(err) {
  if (err instanceof Error) return {
    message: err.message || String(err),
    stack: err.stack
  };
  if (typeof err === "string") return {
    message: err
  };
  try {
    return {
      message: JSON.stringify(err)
    };
  } catch (_a) {
    return {
      message: String(err)
    };
  }
}
const src_isWindows = "darwin" === "win32";
function configureLinuxSandboxHelper() {
  if (true) {
    return;
  }
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
}
configureLinuxSandboxHelper();
function logToDebug(event, err) {
  return src_awaiter(this, void 0, void 0, function* () {
    try {
      const {
        message,
        stack
      } = src_extractErrorInfo(err);
      (0, debug.debugLogJSON)(event, {
        message,
        stack
      }, "ERROR");
      (0, debug.debugTrace)(event, {
        message,
        stack
      });
    } catch (_a) {}
  });
}
function main() {
  return src_awaiter(this, void 0, void 0, function* () {
    console.log("🚀 Agent CLI starting up...");
    // Suppress EventEmitter MaxListeners warnings globally and for stdio
    suppressEventEmitterMaxListenersWarnings();
    // Resolve ripgrep path preferring a binary co-located with the entry script
    function rgPathFactory() {
      const scriptPath = process.argv[1];
      const colocatedRg = (0, external_node_path_.join)((0, external_node_path_.dirname)(scriptPath), "rg");
      if ((0, external_node_fs_.existsSync)(colocatedRg)) {
        return colocatedRg;
      }
      if (false)
        // removed by dead control flow
        {}
      try {
        const cmd = (0, utils_dist /* findActualExecutable */.Ef)("rg", []).cmd;
        if (cmd === "rg") {
          throw new Error("rg is not installed");
        }
        return cmd;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        (0, debug.debugLogJSON)("rg.missing", {
          message: "Could not find ripgrep (rg) binary. Please install ripgrep."
        }, "ERROR");
        (0, console_io /* exitWithMessage */.uQ)(1, "Could not find ripgrep (rg) binary. Please install ripgrep. Error: " + errorMessage);
      }
    }
    const localWorkerClientFactory = (options, workspacePath) => {
      const repoRoot = (0, git /* findGitRoot */.k)(workspacePath);
      const socketPath = getProjectSocketPathForWorkspace(repoRoot);
      if (!src_isWindows) {
        (0, external_node_fs_.mkdirSync)((0, external_node_path_.dirname)(socketPath), {
          recursive: true
        });
      }
      return (0, local_worker_dist.createClient)(spawnLocalWorker(repoRoot, socketPath, getProjectLogPath(repoRoot), options), socketPath);
    };
    yield setupCLI({
      rgPathFactory,
      localWorkerClientFactory
    });
  });
}
main().catch(error => src_awaiter(void 0, void 0, void 0, function* () {
  // We only every initialize Sentry if the user is not in ghost mode
  //Sentry.captureException(error);
  yield logToDebug("global.main.promiseCatch", error);
  process.exit(1);
}));

/***/