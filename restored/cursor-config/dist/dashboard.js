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