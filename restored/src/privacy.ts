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
const ONE_HOUR_MS = 60 * 60 * 1000;
// Only enabled for non-privacy or privacy with storage users
function diagnosticTelemetryEnabled(privacyMode) {
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
  (0, debug.debugLog)("protoPrivacyToGhostMode", {
    privacyMode
  });
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
      if (diagnosticTelemetryEnabled(current === null || current === void 0 ? void 0 : current.privacyMode)) {
        initSentry();
      }
      return;
    }
    void (() => __awaiter(this, void 0, void 0, function* () {
      try {
        (0, debug.debugLog)("privacy.refresh.start", {
          isStale,
          sampleEvery
        });
        const authInterceptor = next => req => __awaiter(this, void 0, void 0, function* () {
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
            rejectUnauthorized: !constants /* isDev */.Cu
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
        if (diagnosticTelemetryEnabled(resp.privacyMode)) {
          initSentry();
        }
        (0, debug.debugLog)("privacy.refresh.updated", {
          ghost: newGhost
        });
      } catch (e) {
        // Ignore failures; header logic defaults to ghost=true when unset or unreadable
        (0, debug.debugLog)("privacy.refresh.error", String(e), args.baseUrl);
      }
    }))();
  } catch (e) {
    // Non-fatal
    (0, debug.debugLog)("privacy.refresh.setup_error", String(e));
  }
}