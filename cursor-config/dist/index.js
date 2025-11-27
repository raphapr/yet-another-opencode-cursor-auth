// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  QX: () => (/* reexport */ConfigPermissionsAdapter),
  aK: () => (/* reexport */CursorConfigMcpLoader),
  Kr: () => (/* reexport */CursorConfigSchema),
  LV: () => (/* reexport */DefaultConfigProvider),
  FO: () => (/* reexport */FileBasedConfigProvider),
  Pl: () => (/* reexport */LoginManager),
  Ol: () => (/* reexport */MergedPermissionsProvider),
  N2: () => (/* reexport */ReadOnlyFileBasedPermissionsProvider),
  Vi: () => (/* reexport */createDashboardClient),
  WI: () => (/* reexport */getConfigDir),
  Xq: () => (/* reexport */getProjectDir),
  kL: () => (/* reexport */getProjectDirForSocketPath),
  m4: () => (/* reexport */getProjectsDir)
});

// UNUSED EXPORTS: BaseConfigSchema, MergedMcpLoader, ProjectConfigSchema, getConfigFilePath, getDataDir

// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__("node:crypto");
; // ../cursor-config/dist/auth/login.js
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

// Configuration
const CURSOR_WEBSITE_URL = "https://cursor.com";
const CURSOR_API_BASE_URL = "https://api2.cursor.sh";
const POLLING_ENDPOINT = `${CURSOR_API_BASE_URL}/auth/poll`;
/**
 * Base64 URL encode a buffer
 * @param {Buffer} buffer
 * @returns {string}
 */
function base64URLEncode(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
/**
 * Generate a SHA-256 hash of the input string
 * @param {string} data
 * @returns {Buffer}
 */
function sha256(data) {
  return external_node_crypto_.createHash("sha256").update(data).digest();
}
/**
 * Generate a UUID v4
 * @returns {string}
 */
function generateUuid() {
  return external_node_crypto_.randomUUID();
}
/**
 * Generate authentication parameters
 * @returns {Promise<AuthParams>}
 */
function generateAuthParams() {
  // Generate a 32-byte random verifier
  const verifierArray = external_node_crypto_.randomBytes(32);
  const verifier = base64URLEncode(verifierArray);
  // Generate challenge by SHA-256 hashing the verifier
  const challengeHash = sha256(verifier);
  const challenge = base64URLEncode(challengeHash);
  // Generate a UUID
  const uuid = generateUuid();
  // Construct the login URL
  const loginUrl = `${CURSOR_WEBSITE_URL}/loginDeepControl?challenge=${challenge}&uuid=${uuid}&mode=login&redirectTarget=cli`;
  return {
    uuid,
    challenge,
    verifier,
    // You'll need this for the polling endpoint
    loginUrl
  };
}
function exchangeApiKeyForTokens(apiKey, options) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    const baseUrl = (_a = options === null || options === void 0 ? void 0 : options.endpoint) !== null && _a !== void 0 ? _a : CURSOR_API_BASE_URL;
    try {
      const response = yield fetch(`${baseUrl}/auth/exchange_user_api_key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({})
      });
      if (!response.ok) return null;
      const authResult = yield response.json();
      if (typeof authResult === "object" && authResult !== null && "accessToken" in authResult && "refreshToken" in authResult) {
        return authResult;
      }
    } catch (_b) {}
    return null;
  });
}
/**
 * Poll for authentication status
 * @param {string} uuid
 * @param {string} verifier
 * @returns {Promise<AuthResult | null>}
 */
function pollAuthenticationStatus(uuid, verifier) {
  return __awaiter(this, void 0, void 0, function* () {
    const maxAttempts = 150; // Maximum number of attempts
    const baseDelay = 1000; // 1 second base delay
    const maxDelay = 10000; // 10 seconds maximum delay
    const backoffMultiplier = 1.2; // Gentle exponential backoff
    const maxConsecutiveErrors = 3; // Stop after 3 consecutive non-404 errors
    let consecutiveErrors = 0;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = yield fetch(`${POLLING_ENDPOINT}?uuid=${uuid}&verifier=${verifier}`, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        // 404 means authentication is still pending
        if (response.status === 404) {
          // Reset error counter on 404 (pending authentication is expected)
          consecutiveErrors = 0;
          // Calculate delay with exponential backoff
          const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
          yield new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        // Check for other error statuses
        if (!response.ok) {
          consecutiveErrors++;
          if (consecutiveErrors >= maxConsecutiveErrors) {
            return null; // Stop retrying after 3 consecutive non-404 errors
          }
          // Calculate delay with exponential backoff even on error
          const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
          yield new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        // Success case - reset error counter
        consecutiveErrors = 0;
        const authResult = yield response.json();
        if (typeof authResult === "object" && authResult !== null && "accessToken" in authResult && "refreshToken" in authResult) {
          return authResult;
        }
        return null;
      } catch (_error) {
        consecutiveErrors++;
        if (consecutiveErrors >= maxConsecutiveErrors) {
          return null; // Stop retrying after 3 consecutive non-404 errors
        }
        // Calculate delay with exponential backoff otherwise
        const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
        yield new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return null; // Timeout after max attempts
  });
}
class LoginManager {
  startLogin() {
    const authParams = generateAuthParams();
    return {
      metadata: {
        uuid: authParams.uuid,
        verifier: authParams.verifier
      },
      loginUrl: authParams.loginUrl
    };
  }
  waitForResult(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
      return pollAuthenticationStatus(metadata.uuid, metadata.verifier);
    });
  }
  loginWithApiKey(apiKey, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return exchangeApiKeyForTokens(apiKey, options);
    });
  }
  login(linkHandler) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        metadata,
        loginUrl
      } = this.startLogin();
      yield linkHandler.openUrl(loginUrl);
      return this.waitForResult(metadata);
    });
  }
}
; // ../cursor-config/dist/auth/index.js
function loadAuthToken() {}

// EXTERNAL MODULE: ../proto/dist/generated/aiserver/v1/dashboard_connect.js
var dashboard_connect = __webpack_require__("../proto/dist/generated/aiserver/v1/dashboard_connect.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/promise-client.js + 1 modules
var promise_client = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/promise-client.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@connectrpc+connect-node@1.6.1_@bufbuild+protobuf@1.10.0_@connectrpc+connect@1.6.1_patch_hash_yu5ivmw5nlvm6v3w7brw2bvqt4/node_modules/@connectrpc/connect-node/dist/esm/index.js + 26 modules
var esm = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect-node@1.6.1_@bufbuild+protobuf@1.10.0_@connectrpc+connect@1.6.1_patch_hash_yu5ivmw5nlvm6v3w7brw2bvqt4/node_modules/@connectrpc/connect-node/dist/esm/index.js");
; // ../cursor-config/dist/dashboard.js
var dashboard_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const isDev = "production" === "development";
const ONE_HOUR_MS = 60 * 60 * 1000;
// We don't check sig, so ONLY use for expiration check
function decodeJwt_ONLY_FOR_EXPIRATION_CHECK(token) {
  const base64Payload = token.split(".")[1];
  const payloadBuffer = Buffer.from(base64Payload, "base64");
  return JSON.parse(payloadBuffer.toString());
}
function isTokenExpiringSoon(token) {
  try {
    const decoded = decodeJwt_ONLY_FOR_EXPIRATION_CHECK(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    // Token expires in less than 5 minutes (300 seconds)
    return expirationTime - currentTime < 300;
  } catch (_a) {
    // If we can't decode the token, consider it expired
    return true;
  }
}
function refreshTokenWithApiKey(credentialManager, endpoint) {
  return dashboard_awaiter(this, void 0, void 0, function* () {
    const apiKey = yield credentialManager.getApiKey();
    if (!apiKey) {
      return null;
    }
    const loginManager = new LoginManager();
    const authResult = yield loginManager.loginWithApiKey(apiKey, {
      endpoint
    });
    if ((authResult === null || authResult === void 0 ? void 0 : authResult.accessToken) && authResult.refreshToken) {
      // Update stored tokens
      yield credentialManager.setAuthentication(authResult.accessToken, authResult.refreshToken, apiKey);
      return authResult.accessToken;
    }
    return null;
  });
}
/**
 * Gets a valid access token, refreshing if necessary.
 */
function getValidAccessToken(credentialManager, endpoint) {
  return dashboard_awaiter(this, void 0, void 0, function* () {
    const currentToken = yield credentialManager.getAccessToken();
    if (!currentToken) {
      return null;
    }
    if (!isTokenExpiringSoon(currentToken)) {
      return currentToken;
    }
    const apiKey = yield credentialManager.getApiKey();
    if (apiKey) {
      const newToken = yield refreshTokenWithApiKey(credentialManager, endpoint);
      if (newToken) {
        return newToken;
      }
    }
    return currentToken;
  });
}
// Only enabled for non-privacy or privacy with storage users
function _diagnosticTelemetryEnabled(privacyMode) {
  if (!privacyMode || privacyMode === 0 || privacyMode === 1) {
    return false;
  }
  return true;
}
function envToNumber(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
function protoPrivacyToGhostMode(privacyMode) {
  // aiserver.v1.PrivacyMode enum: UNSPECIFIED = 0, NO_STORAGE = 1, NO_TRAINING = 2
  return privacyMode === 0 || privacyMode === 1 || privacyMode === 2;
}
function getPrivacyCacheSafe(provider) {
  const c = provider.get();
  const pc = c.privacyCache;
  if (!pc) return undefined;
  return {
    ghostMode: pc.ghostMode,
    privacyMode: pc.privacyMode,
    updatedAt: pc.updatedAt
  };
}
function maybeRefreshPrivacyCacheInBackground(args) {
  try {
    const now = Date.now();
    const maxAgeMs = envToNumber("CURSOR_PRIVACY_CACHE_MAX_AGE_MS", ONE_HOUR_MS);
    const sampleEvery = envToNumber("CURSOR_PRIVACY_SAMPLE_RATE", 10);
    const current = getPrivacyCacheSafe(args.configProvider);
    const isStale = !current || now - current.updatedAt > maxAgeMs;
    const doSample = Math.floor(Math.random() * sampleEvery) === 0;
    const shouldRefresh = !current || isStale || doSample;
    if (!shouldRefresh) {
      return;
    }
    void (() => dashboard_awaiter(this, void 0, void 0, function* () {
      try {
        const authInterceptor = next => req => dashboard_awaiter(this, void 0, void 0, function* () {
          const token = yield args.credentialManager.getAccessToken();
          if (token) req.header.set("authorization", `Bearer ${token}`);
          return next(req);
        });
        // Janky but required - we need to use api2 if using cursor.sh, but localhost if localhost
        const baseUrl = args.baseUrl.endsWith("cursor.sh") ? "https://api2.cursor.sh" : args.baseUrl;
        const transport = (0, esm /* createConnectTransport */.wQ)({
          baseUrl,
          httpVersion: "1.1",
          interceptors: [authInterceptor],
          nodeOptions: {
            rejectUnauthorized: !isDev
          }
        });
        const dashboard = (0, promise_client /* createClient */.UU)(dashboard_connect /* DashboardService */.I, transport);
        const resp = yield dashboard.getUserPrivacyMode({
          inferredPrivacyMode: 0
        });
        const newGhost = protoPrivacyToGhostMode(resp.privacyMode);
        yield args.configProvider.transform(c => Object.assign(Object.assign({}, c), {
          privacyCache: {
            ghostMode: newGhost,
            privacyMode: resp.privacyMode,
            updatedAt: Date.now()
          }
        }));
      } catch (_e) {
        // Ignore failures; header logic defaults to ghost=true when unset or unreadable
      }
    }))();
  } catch (_e) {
    // Non-fatal
  }
}
/**
 * Creates a shared authorization interceptor for Cursor API requests
 */
function createAuthInterceptor(credentialManager, opts) {
  return next => req => dashboard_awaiter(this, void 0, void 0, function* () {
    var _a;
    // Non-blocking background refresh (sampled or stale)
    if ((opts === null || opts === void 0 ? void 0 : opts.baseUrl) && (opts === null || opts === void 0 ? void 0 : opts.configProvider)) {
      try {
        maybeRefreshPrivacyCacheInBackground({
          credentialManager,
          baseUrl: opts.baseUrl,
          configProvider: opts.configProvider
        });
      } catch (_b) {
        // ignore
      }
    }
    const baseUrl = (opts === null || opts === void 0 ? void 0 : opts.baseUrl) || "";
    const token = yield getValidAccessToken(credentialManager, baseUrl);
    if (token !== undefined) {
      // Add the authorization header to the request
      req.header.set("authorization", `Bearer ${token}`);
    }
    const ghostMode = (() => {
      var _a, _b;
      try {
        const configValue = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.configProvider) === null || _a === void 0 ? void 0 : _a.get().privacyCache) === null || _b === void 0 ? void 0 : _b.ghostMode;
        if (typeof configValue === "boolean") {
          return configValue;
        }
        return true; // Default to ghost mode to be safe
      } catch (_c) {
        return true; // Default to ghost mode to be safe
      }
    })();
    req.header.set("x-ghost-mode", ghostMode ? "true" : "false");
    req.header.set("x-cursor-client-version", `extension-${(_a = process.env.VSCODE_VERSION) !== null && _a !== void 0 ? _a : "unknown"}`);
    if (!req.header.get("x-request-id")) {
      req.header.set("x-request-id", crypto.randomUUID());
    }
    return next(req);
  });
}
/**
 * Creates a dashboard client with authentication and privacy handling
 */
function createDashboardClient(options) {
  const authInterceptor = createAuthInterceptor(options.credentialManager, {
    baseUrl: options.endpoint,
    configProvider: options.configProvider
  });
  const transport = (0, esm /* createConnectTransport */.wQ)({
    baseUrl: options.endpoint,
    httpVersion: "1.1",
    interceptors: [authInterceptor],
    nodeOptions: {
      rejectUnauthorized: !isDev
    }
  });
  return (0, promise_client /* createClient */.UU)(dashboard_connect /* DashboardService */.I, transport);
}

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/agent_pb.js + 9 modules
var agent_pb = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
; // ../cursor-config/dist/default-config-provider.js

const DEFAULT_CONFIG = {
  version: 1,
  editor: {
    vimMode: false
  },
  display: {
    showLineNumbers: true
  },
  permissions: {
    allow: ["Shell(ls)"
    // Example MCP allowlist entries:
    // "Mcp(*:*)" - allows all MCP tools from all servers
    // "Mcp(server-name:*)" - allows all tools from server-name
    // "Mcp(*:tool-name)" - allows tool-name from any server
    // "Mcp(server-name:tool-name)" - allows specific tool from specific server
    ],
    deny: []
  },
  hasChangedDefaultModel: false,
  model: new agent_pb /* ModelDetails */.Gm({
    modelId: "gpt-5",
    displayModelId: "gpt-5",
    displayName: "GPT-5",
    displayNameShort: "GPT-5",
    aliases: ["gpt-5"]
  }),
  network: {
    useHttp1ForAgent: false
  },
  approvalMode: "allowlist",
  sandbox: {
    mode: "disabled",
    networkAccess: "allowlist"
  }
};
// Only used for debugging
class DefaultConfigProvider {
  constructor() {
    this.config = DEFAULT_CONFIG;
  }
  get() {
    return this.config;
  }
  transform(transform) {
    this.config = transform(this.config);
    return Promise.resolve(this.config);
  }
}

// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__("node:fs/promises");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
// EXTERNAL MODULE: ../local-exec/dist/index.js + 53 modules
var dist = __webpack_require__("../local-exec/dist/index.js");
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__("node:os");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var utils_dist = __webpack_require__("../utils/dist/index.js");
; // ../cursor-config/dist/paths.js

function getConfigDir() {
  // Allow explicit override
  const override = process.env.CURSOR_CONFIG_DIR;
  if (override === null || override === void 0 ? void 0 : override.trim()) return override;
  // Respect XDG on *nix if present
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg === null || xdg === void 0 ? void 0 : xdg.trim()) return (0, external_node_path_.join)(xdg, "cursor");
  // Fallback: ~/.cursor
  return (0, external_node_path_.join)((0, external_node_os_.homedir)(), ".cursor");
}
function getDataDir() {
  // Allow explicit override
  const override = process.env.CURSOR_DATA_DIR;
  if (override === null || override === void 0 ? void 0 : override.trim()) return override;
  // Default: ~/.cursor
  return (0, external_node_path_.join)((0, external_node_os_.homedir)(), ".cursor");
}
function getProjectsDir() {
  return (0, external_node_path_.join)(getDataDir(), "projects");
}
function getProjectDir(projectPath) {
  return (0, external_node_path_.join)(getProjectsDir(), (0, utils_dist /* slugifyPath */.r_)(projectPath));
}
const HASH_LENGTH = 7; // SHA-256 first 7 characters
const MAX_SOCKET_PATH_LENGTH = 104; // max socket path length on MacOS
const WINDOWS_SOCK_LENGTH = "worker.sock".length;
const MAX_PREFIX_LENGTH_BEFORE_HASH = MAX_SOCKET_PATH_LENGTH - 1 - HASH_LENGTH - 1 - WINDOWS_SOCK_LENGTH; // full socket path = prefix + "-" + hash + "/" + "worker.sock"
const MAX_FULL_PATH_LENGTH = MAX_SOCKET_PATH_LENGTH - WINDOWS_SOCK_LENGTH - 1; // need to apped "/worker.sock" to the path
function getProjectDirForSocketPath(projectPath) {
  let projectsDir = getProjectsDir();
  if (projectsDir.length > MAX_PREFIX_LENGTH_BEFORE_HASH) {
    // Fall back to ~/.cursor so we don't truncate the project directory
    projectsDir = getDataDir();
    if (projectsDir.length > MAX_PREFIX_LENGTH_BEFORE_HASH) {
      // wtf, this person's home directory is super long!
      // Just try to write to /tmp/.cursor I guess
      // This will probably (almost) never happen
      projectsDir = "/tmp/.cursor";
    }
  }
  const fullPath = (0, external_node_path_.join)(projectsDir, (0, utils_dist /* slugifyPath */.r_)(projectPath));
  if (fullPath.length > MAX_FULL_PATH_LENGTH) {
    const hash = (0, external_node_crypto_.createHash)("sha256").update(fullPath).digest("hex").substring(0, HASH_LENGTH);
    const prefix = fullPath.substring(0, Math.min(MAX_PREFIX_LENGTH_BEFORE_HASH, fullPath.length));
    return `${prefix}-${hash}`;
  }
  return fullPath;
}
function getConfigFilePath() {
  return (0, external_node_path_.join)(getConfigDir(), "cli-config.json");
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var lib = __webpack_require__("../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs");
; // ../cursor-config/dist/schema.js

const ModelDetailsProtoSchema = lib.z.any().transform((val, ctx) => {
  if (val instanceof agent_pb /* ModelDetails */.Gm) return val;
  try {
    return agent_pb /* ModelDetails */.Gm.fromJson(val, {
      ignoreUnknownFields: false
    });
  } catch (e) {
    ctx.addIssue({
      code: lib.z.ZodIssueCode.custom,
      message: e instanceof Error ? e.message : String(e)
    });
    return val;
  }
});
const BaseConfigSchema = lib.z.object({
  permissions: lib.z.object({
    allow: lib.z.array(lib.z.string()),
    deny: lib.z.array(lib.z.string())
  })
});
const SystemConfigSchema = BaseConfigSchema.extend({
  version: lib.z.number(),
  editor: lib.z.object({
    vimMode: lib.z.boolean(),
    defaultBehavior: lib.z.enum(["ide", "agent"]).optional()
  }),
  display: lib.z.object({
    showLineNumbers: lib.z.boolean().default(true)
  }).optional(),
  channel: lib.z.literal("static").or(lib.z.literal("prod")).or(lib.z.literal("lab")).or(lib.z.literal("staging"))
  // prod-stable-internal is an internal alias for prod to avoid auto-update of devs to staging channel
  .or(lib.z.literal("prod-stable-internal")).optional(),
  model: ModelDetailsProtoSchema.optional(),
  hasChangedDefaultModel: lib.z.boolean().default(false).optional(),
  // Local, best-effort cache for privacy mode derived headering
  privacyCache: lib.z.object({
    ghostMode: lib.z.boolean(),
    privacyMode: lib.z.number().optional(),
    updatedAt: lib.z.number()
  }).optional(),
  // Network configuration
  network: lib.z.object({
    // Use HTTP/1.1 for agent connections (enables SSE-based bidirectional streaming)
    useHttp1ForAgent: lib.z.boolean().default(false)
  }).default({
    useHttp1ForAgent: false
  }),
  approvalMode: lib.z.enum(["allowlist", "unrestricted"]).default("allowlist").optional(),
  sandbox: lib.z.object({
    mode: lib.z.enum(["disabled", "enabled"]).default("disabled"),
    networkAccess: lib.z.enum(["allowlist", "enabled"]).optional(),
    networkAllowlist: lib.z.array(lib.z.string()).default([]).optional()
  }).optional(),
  showSandboxIntro: lib.z.boolean().default(false).optional()
});
const ProjectConfigSchema = BaseConfigSchema.strict().extend({});
const CursorConfigSchema = SystemConfigSchema.merge(ProjectConfigSchema);
; // ../cursor-config/dist/file-based-config-provider.js
var file_based_config_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const file_based_config_provider_DEFAULT_CONFIG = {
  version: 1,
  editor: {
    vimMode: false
  },
  hasChangedDefaultModel: false,
  permissions: {
    allow: ["Shell(ls)"],
    deny: []
  },
  approvalMode: "allowlist",
  sandbox: {
    mode: "disabled",
    networkAccess: "allowlist"
  },
  privacyCache: undefined,
  network: {
    useHttp1ForAgent: false
  }
};
class FileBasedConfigProvider {
  constructor(config, configFilePath, projectConfigFilePaths, options) {
    this.projectConfigFilePaths = [];
    this.transformLock = Promise.resolve();
    this.config = config;
    this.configFilePath = configFilePath;
    if (projectConfigFilePaths && projectConfigFilePaths.length > 0) {
      this.projectConfigFilePaths = [...projectConfigFilePaths];
    }
    this.options = options !== null && options !== void 0 ? options : {};
  }
  debugLog(...args) {
    var _a, _b;
    (_b = (_a = this.options).onDebugLog) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
  }
  exitWithError(code, message) {
    if (this.options.onError) {
      return this.options.onError(code, message);
    }
    throw new Error(message);
  }
  /**
   * Asynchronously load configuration from defaults and file system.
   * Creates a new FileBasedConfigProvider instance.
   */
  static loadFromDefaults(options) {
    return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
      var _a;
      const configFilePath = getConfigFilePath();
      const configDir = getConfigDir();
      // Determine project override files (hierarchical): <dir>/.cursor/cli.json for every dir from root->cwd
      const gitRoot = yield (0, dist.findGitRoot)(process.cwd());
      const projectRoot = gitRoot !== null && gitRoot !== void 0 ? gitRoot : process.cwd();
      const projectConfigFilePaths = collectProjectConfigPaths(projectRoot, process.cwd());
      try {
        // Ensure config directory exists
        yield (0, promises_.mkdir)(configDir, {
          recursive: true
        });
        // Try to read existing config
        if ((0, external_node_fs_.existsSync)(configFilePath)) {
          const {
            config: hydratedConfig,
            repaired
          } = yield readLatestConfigFromDisk(configFilePath);
          // If we had to repair the config, persist the repaired version
          if (repaired) {
            yield (0, promises_.writeFile)(configFilePath, `${JSON.stringify(hydratedConfig, null, 2)}\n`, "utf8");
          }
          // Merge project-level overrides if present (closer to CWD takes precedence)
          const mergedWithLocal = yield mergeWithProjectOverridesList(hydratedConfig, projectConfigFilePaths, options);
          return new FileBasedConfigProvider(mergedWithLocal, configFilePath, projectConfigFilePaths, options);
        }
        // Create default config if file doesn't exist
        yield (0, promises_.writeFile)(configFilePath, `${JSON.stringify(file_based_config_provider_DEFAULT_CONFIG, null, 2)}\n`, "utf8");
        // Merge project-level overrides if present (closer to CWD takes precedence)
        const mergedWithLocal = yield mergeWithProjectOverridesList(file_based_config_provider_DEFAULT_CONFIG, projectConfigFilePaths, options);
        return new FileBasedConfigProvider(mergedWithLocal, configFilePath, projectConfigFilePaths, options);
      } catch (error) {
        (_a = options === null || options === void 0 ? void 0 : options.onDebugLog) === null || _a === void 0 ? void 0 : _a.call(options, "FileBasedConfigProvider: failed to load, backing up and regenerating", String(error));
        // Try to backup bad config
        try {
          if ((0, external_node_fs_.existsSync)(configFilePath)) {
            const backupPath = `${configFilePath}.bad`;
            yield (0, promises_.rename)(configFilePath, backupPath);
          }
        } catch (_b) {
          /* ignore backup errors */
        }
        // Create fresh config
        try {
          yield (0, promises_.mkdir)(configDir, {
            recursive: true
          });
          yield (0, promises_.writeFile)(configFilePath, `${JSON.stringify(file_based_config_provider_DEFAULT_CONFIG, null, 2)}\n`, "utf8");
        } catch (_c) {
          /* ignore write errors, use in-memory default */
        }
        // Merge project-level overrides if present (closer to CWD takes precedence)
        const mergedWithLocal = yield mergeWithProjectOverridesList(file_based_config_provider_DEFAULT_CONFIG, projectConfigFilePaths, options);
        return new FileBasedConfigProvider(mergedWithLocal, configFilePath, projectConfigFilePaths, options);
      }
    });
  }
  /**
   * Synchronously get the current configuration.
   * This returns the in-memory cached configuration.
   */
  get() {
    return this.config;
  }
  /**
   * Asynchronously transform the configuration.
   * Applies the transformation atomically and persists to disk.
   */
  transform(transformer) {
    return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
      // Queue this transform operation behind any existing ones
      const previousLock = this.transformLock;
      let releaseLock = () => {};
      // Create a new lock for this operation
      this.transformLock = new Promise(resolve => {
        releaseLock = resolve;
      });
      try {
        // Wait for any previous transform to complete
        yield previousLock;
        // Read latest HOME config from disk and validate/repair (do not write back here)
        const {
          config: baseHomeConfig
        } = yield readLatestConfigFromDisk(this.configFilePath);
        // Apply transformation based on HOME config only to avoid persisting local overrides into HOME
        const newHomeConfig = transformer(baseHomeConfig);
        // Write atomically using a temp file
        const configDir = getConfigDir();
        yield (0, promises_.mkdir)(configDir, {
          recursive: true
        });
        const tmpPath = `${this.configFilePath}.tmp`;
        yield (0, promises_.writeFile)(tmpPath, `${JSON.stringify(newHomeConfig, null, 2)}\n`, "utf8");
        yield (0, promises_.rename)(tmpPath, this.configFilePath);
        // Update in-memory config by re-merging project overrides (if any)
        this.config = yield mergeWithProjectOverridesList(newHomeConfig, this.projectConfigFilePaths, this.options);
        return this.config;
      } catch (error) {
        this.debugLog("FileBasedConfigProvider: failed to transform config", String(error));
        throw error;
      } finally {
        // Always release the lock so next operations can proceed
        releaseLock();
      }
    });
  }
}
function readLatestConfigFromDisk(configFilePath) {
  return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
    const raw = yield (0, promises_.readFile)(configFilePath, "utf8");
    const parsed = JSON.parse(raw);
    const parsedValidation = CursorConfigSchema.safeParse(parsed);
    if (parsedValidation.success) {
      return {
        config: parsedValidation.data,
        repaired: false
      };
    }
    const merged = deepMerge(file_based_config_provider_DEFAULT_CONFIG, parsed);
    const mergedValidation = CursorConfigSchema.safeParse(merged);
    if (!mergedValidation.success) {
      throw new Error(`Invalid config: ${mergedValidation.error.message}`);
    }
    return {
      config: mergedValidation.data,
      repaired: true
    };
  });
}
function deepMerge(base, overrides) {
  const out = Object.assign({}, base);
  for (const [k, v] of Object.entries(overrides)) {
    const key = k;
    if (v && typeof v === "object" && !Array.isArray(v) && key in out && typeof out[key] === "object" && !Array.isArray(out[key])) {
      out[key] = deepMerge(out[key], v);
    } else {
      out[key] = v;
    }
  }
  return out;
}
/**
 * Read project overrides from `<projectRoot>/.cursor/cli.json` (if present)
 * and merge them over the provided base config. Validates the merged result; if
 * invalid, returns the base config unchanged.
 */
function mergeWithProjectOverridesList(baseConfig, projectConfigFilePaths, options) {
  return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
    let mergedConfig = baseConfig;
    // Apply shallower paths first (root), deepest paths last (closest to CWD wins)
    for (let i = 0; i < projectConfigFilePaths.length; i++) {
      const p = projectConfigFilePaths[i];
      try {
        if (!(0, external_node_fs_.existsSync)(p)) continue;
        const raw = yield (0, promises_.readFile)(p, "utf8");
        const json = JSON.parse(raw);
        const parsed = ProjectConfigSchema.partial().safeParse(json);
        if (!parsed.success) {
          const message = `Invalid project config at ${p}: schema validation failed. ${String(parsed.error)}`;
          if (options === null || options === void 0 ? void 0 : options.onError) {
            options.onError(1, message);
          } else {
            throw new Error(message);
          }
        }
        const localParsed = parsed.data;
        const candidate = deepMerge(mergedConfig, localParsed);
        const check = CursorConfigSchema.safeParse(candidate);
        if (check.success) {
          mergedConfig = check.data;
        } else {
          const message = `Invalid project config at ${p}: merged configuration failed validation. ${String(check.error)}`;
          if (options === null || options === void 0 ? void 0 : options.onError) {
            options.onError(1, message);
          } else {
            throw new Error(message);
          }
        }
      } catch (err) {
        const message = `Failed reading project .cursor/cli.json at ${p}: ${String(err)}`;
        if (options === null || options === void 0 ? void 0 : options.onError) {
          options.onError(1, message);
        } else {
          throw new Error(message);
        }
      }
    }
    return mergedConfig;
  });
}
function collectProjectConfigPaths(projectRoot, cwd) {
  const paths = [];
  // Build list of directories from root to cwd
  const rel = (0, external_node_path_.relative)(projectRoot, cwd);
  const segments = rel.split(external_node_path_.sep).filter(Boolean);
  let current = projectRoot;
  const dirs = [projectRoot];
  for (const seg of segments) {
    current = (0, external_node_path_.join)(current, seg);
    dirs.push(current);
  }
  // For each directory along the path, if .cursor/cli.json exists, add it.
  for (const dir of dirs) {
    const p = (0, external_node_path_.join)(dir, ".cursor", "cli.json");
    if ((0, external_node_fs_.existsSync)(p)) paths.push(p);
  }
  // paths are in root->cwd order
  return Array.from(new Set(paths));
}

// EXTERNAL MODULE: ../mcp-agent-exec/dist/index.js + 8 modules
var mcp_agent_exec_dist = __webpack_require__("../mcp-agent-exec/dist/index.js");
; // ../cursor-config/dist/mcp/loader.js
var loader_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
 * Wrapper that prefixes all identifiers before passing to underlying storage.
 * This allows multiple loaders to share storage without identifier conflicts.
 */
class PrefixedTokenStorage {
  constructor(storage, prefix) {
    this.storage = storage;
    this.prefix = prefix;
  }
  loadTokens(identifier) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.loadTokens(this.prefix + identifier);
    });
  }
  saveTokens(identifier, tokens) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.saveTokens(this.prefix + identifier, tokens);
    });
  }
  loadClientInformation(identifier) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.loadClientInformation(this.prefix + identifier);
    });
  }
  saveClientInformation(identifier, clientInfo) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.saveClientInformation(this.prefix + identifier, clientInfo);
    });
  }
}
/**
 * Wrapper that prefixes server names before passing to underlying approval service.
 * This allows multiple loaders to share approval storage without identifier conflicts.
 */
class PrefixedApprovalStorage {
  constructor(storage, prefix) {
    this.storage = storage;
    this.prefix = prefix;
  }
  isServerApproved(serverName, server, configPath) {
    return loader_awaiter(this, void 0, void 0, function* () {
      return this.storage.isServerApproved(this.prefix + serverName, server, configPath);
    });
  }
}
/**
 * MCP loader that merges multiple loaders together.
 * Loaders are checked in order, with earlier loaders taking precedence.
 */
class MergedMcpLoader {
  constructor(loaders) {
    this.loaders = loaders;
  }
  load(ctx_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, cache = true) {
      // Load all managers from each loader, passing cache parameter down
      const managers = yield Promise.all(this.loaders.map(({
        loader
      }) => loader.load(ctx, cache)));
      // Combine clients maps, with earlier loaders taking precedence
      const combinedClients = {};
      for (let i = 0; i < managers.length; i++) {
        const manager = managers[i];
        const prefix = this.loaders[i].prefix;
        const clients = manager.getClients();
        for (const [name, client] of Object.entries(clients)) {
          const prefixedName = prefix + name;
          // Only add if not already present (earlier loaders take precedence)
          if (!(prefixedName in combinedClients)) {
            combinedClients[prefixedName] = client;
          }
        }
      }
      return new dist.McpManager(combinedClients);
    });
  }
  loadClient(ctx_1, identifier_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, identifier, ignoreTokens = false) {
      // Search through loaders in order
      for (const {
        loader,
        prefix
      } of this.loaders) {
        if (!identifier.startsWith(prefix)) {
          continue;
        }
        identifier = identifier.slice(prefix.length);
        try {
          const client = yield loader.loadClient(ctx, identifier, ignoreTokens);
          return client;
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found in config")) {
            continue;
          }
          throw error;
        }
      }
      throw new Error(`MCP client "${identifier}" not found in config`);
    });
  }
}
/**
 * MCP loader that uses Cursor's config directory (~/.cursor)
 */
class CursorConfigMcpLoader {
  constructor(basePath, tokenStorage, cacheStorage, _teamSettingsService, _approvalStorage, _ignorePrefix = false, authRedirectUrlGenerator) {
    this.cacheStorage = cacheStorage;
    const basePaths = Array.isArray(basePath) ? basePath : [basePath];
    const userConfigPath = external_node_path_.join((0, external_node_os_.homedir)(), ".cursor", "mcp.json");
    const configPaths = [];
    for (let i = 0; i < basePaths.length; i++) {
      const basePath = basePaths[i];
      const configPath = external_node_path_.join(basePath, ".cursor", "mcp.json");
      const folderName = external_node_path_.basename(basePath);
      const prefix = `project-${i}-${folderName}-`;
      configPaths.push({
        path: configPath,
        prefix
      });
    }
    // Add user config
    configPaths.push({
      path: userConfigPath,
      prefix: "user-"
    });
    // Deduplicate paths, with user- taking precedence
    const uniqueConfigs = new Map();
    for (const {
      path,
      prefix
    } of configPaths) {
      if (!uniqueConfigs.has(path) || prefix === "user-") {
        uniqueConfigs.set(path, prefix);
      }
    }
    const loaders = [];
    for (const [configPath, prefix] of uniqueConfigs) {
      const effectivePrefix = _ignorePrefix ? "" : prefix;
      // Wrap token storage with prefix to avoid identifier conflicts
      const prefixedTokenStorage = new PrefixedTokenStorage(tokenStorage, effectivePrefix);
      // Wrap approval storage with prefix to avoid identifier conflicts
      const prefixedApprovalStorage = new PrefixedApprovalStorage(_approvalStorage, effectivePrefix);
      const middlewares = [new mcp_agent_exec_dist /* CachingMiddleware */.mz(cacheStorage), new mcp_agent_exec_dist /* ServerApprovalMiddleware */.$b(prefixedApprovalStorage), new mcp_agent_exec_dist /* ServerBlockingMiddleware */.XV(_teamSettingsService)];
      loaders.push({
        prefix: effectivePrefix,
        loader: new mcp_agent_exec_dist /* FileConfigMcpLoader */.gT(configPath, prefixedTokenStorage, middlewares, authRedirectUrlGenerator)
      });
    }
    this.loader = new MergedMcpLoader(loaders);
  }
  /**
   * Initialize a CursorConfigMcpLoader with file-based storage
   * @param teamSettingsService Service to check if servers are blocked
   * @param basePath Base path for MCP config resolution
   * @param projectPath Path to store MCP data (auth, cache, approvals)
   * @param ignoreApprovals If true, skip MCP approval checks (auto-approve all servers)
   */
  static init(teamSettingsService, basePath, projectPath, ignoreApprovals = false) {
    const tokenStore = new mcp_agent_exec_dist /* FileBasedTokenStore */.Q7(external_node_path_.join(projectPath, "mcp-auth.json"));
    const cacheStorage = new mcp_agent_exec_dist /* FileBasedMcpCacheStore */.nL(external_node_path_.join(projectPath, "mcp-cache.json"));
    const approvalStorage = ignoreApprovals ? {
      isServerApproved: () => Promise.resolve(true)
    } : new mcp_agent_exec_dist /* FileBasedMcpApprovalStore */.mF(external_node_path_.join(projectPath, "mcp-approvals.json"), basePath);
    return new CursorConfigMcpLoader(basePath, tokenStore, cacheStorage, teamSettingsService, approvalStorage, true);
  }
  load(ctx_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, cache = true) {
      return this.loader.load(ctx, cache);
    });
  }
  loadClient(ctx_1, identifier_1) {
    return loader_awaiter(this, arguments, void 0, function* (ctx, identifier, ignoreTokens = false) {
      return this.loader.loadClient(ctx, identifier, ignoreTokens);
    });
  }
}
; // ../cursor-config/dist/merged-permissions-provider.js
var merged_permissions_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class MergedPermissionsProvider {
  constructor(providers) {
    this.providers = providers;
    if (providers.length === 0) {
      throw new Error("MergedPermissionsProvider requires at least one provider");
    }
  }
  getPermissions() {
    return merged_permissions_provider_awaiter(this, void 0, void 0, function* () {
      const mergedAllow = new Set();
      const mergedDeny = new Set();
      let mostRestrictiveMode = "unrestricted";
      let userConfiguredPolicy = {
        type: "insecure_none"
      };
      // Collect all permissions from all providers
      for (const provider of this.providers) {
        const perms = yield provider.getPermissions();
        for (const allowed of perms.allow) {
          mergedAllow.add(allowed);
        }
        for (const denied of perms.deny) {
          mergedDeny.add(denied);
        }
        // Take the most restrictive approval mode
        if (perms.approvalMode === "allowlist") {
          mostRestrictiveMode = "allowlist";
        }
        // Take the first non-insecure_none policy, or the last policy
        if (perms.userConfiguredPolicy.type !== "insecure_none") {
          userConfiguredPolicy = perms.userConfiguredPolicy;
        }
      }
      return {
        allow: Array.from(mergedAllow),
        deny: Array.from(mergedDeny),
        approvalMode: mostRestrictiveMode,
        userConfiguredPolicy
      };
    });
  }
  updatePermissions(transformer) {
    return merged_permissions_provider_awaiter(this, void 0, void 0, function* () {
      // Apply updates to all providers in parallel
      yield Promise.all(this.providers.map(provider => provider.updatePermissions(transformer)));
    });
  }
}
; // ../cursor-config/dist/permissions-adapter.js
var permissions_adapter_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class ConfigPermissionsAdapter {
  constructor(configProvider) {
    this.configProvider = configProvider;
  }
  getPermissions() {
    return permissions_adapter_awaiter(this, void 0, void 0, function* () {
      var _a;
      const config = this.configProvider.get();
      return Object.assign(Object.assign({}, config.permissions), {
        approvalMode: (_a = config.approvalMode) !== null && _a !== void 0 ? _a : "allowlist",
        userConfiguredPolicy: {
          type: "insecure_none"
        }
      });
    });
  }
  updatePermissions(transformer) {
    return permissions_adapter_awaiter(this, void 0, void 0, function* () {
      yield this.configProvider.transform(c => Object.assign(Object.assign({}, c), {
        permissions: transformer(c.permissions)
      }));
    });
  }
}
; // ../cursor-config/dist/read-only-file-based-permissions-provider.js
var read_only_file_based_permissions_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class ReadOnlyFileBasedPermissionsProvider {
  constructor(permissions) {
    this.permissions = permissions;
  }
  /**
   * Load permissions from a file at the given path.
   * Returns undefined if the file doesn't exist or doesn't have valid permissions.
   */
  static loadFromPath(path) {
    return read_only_file_based_permissions_provider_awaiter(this, void 0, void 0, function* () {
      if (!(0, external_node_fs_.existsSync)(path)) {
        return undefined;
      }
      try {
        const raw = yield (0, promises_.readFile)(path, "utf8");
        const parsed = JSON.parse(raw);
        // We only care about the permissions field, but allow other fields
        const result = BaseConfigSchema.passthrough().safeParse(parsed);
        if (!result.success) {
          return undefined;
        }
        return new ReadOnlyFileBasedPermissionsProvider(Object.assign(Object.assign({}, result.data.permissions), {
          approvalMode: "allowlist"
        }));
      } catch (_error) {
        return undefined;
      }
    });
  }
  getPermissions() {
    return read_only_file_based_permissions_provider_awaiter(this, void 0, void 0, function* () {
      return Object.assign(Object.assign({}, this.permissions), {
        approvalMode: "unrestricted",
        userConfiguredPolicy: {
          type: "insecure_none"
        }
      });
    });
  }
  updatePermissions(transformer) {
    return read_only_file_based_permissions_provider_awaiter(this, void 0, void 0, function* () {
      // No-op for read-only provider
      void transformer;
    });
  }
}
; // ../cursor-config/dist/index.js

/***/