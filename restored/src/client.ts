var client_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function noopRequestMiddleware(req, next) {
  return next(req);
}
/**
 * Creates a shared authorization interceptor for Cursor API requests
 */
function createAuthInterceptor(credentialManager, requestMiddleware, opts) {
  return next => req => client_awaiter(this, void 0, void 0, function* () {
    var _a;
    // Non-blocking background refresh (sampled or stale)
    if ((opts === null || opts === void 0 ? void 0 : opts.baseUrl) && (opts === null || opts === void 0 ? void 0 : opts.configProvider)) {
      try {
        (0, privacy /* maybeRefreshPrivacyCacheInBackground */.H)({
          credentialManager,
          baseUrl: opts.baseUrl,
          configProvider: opts.configProvider
        });
      } catch (_b) {
        // ignore
      }
    }
    const baseUrl = (opts === null || opts === void 0 ? void 0 : opts.baseUrl) || "";
    const token = yield (0, auth_refresh /* getValidAccessToken */.uX)(credentialManager, baseUrl);
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
    const clientType = "cli";
    req.header.set("x-ghost-mode", ghostMode ? "true" : "false");
    req.header.set("x-cursor-client-version", `${clientType}-${(_a = "2025.11.25-d5b3271") !== null && _a !== void 0 ? _a : "unknown"}`);
    req.header.set("x-cursor-client-type", clientType);
    if (!req.header.get("x-request-id")) {
      req.header.set("x-request-id", crypto.randomUUID());
    }
    const anyReq = {
      requestId: req.header.get("x-request-id"),
      inner: req
    };
    const response = yield requestMiddleware(anyReq, req => next(req.inner));
    return response;
  });
}
function createServerConfigServiceClient(credentialManager, endpoint, insecure, configProvider) {
  const authInterceptor = createAuthInterceptor(credentialManager, noopRequestMiddleware, {
    baseUrl: endpoint,
    configProvider
  });
  const transport = (0, esm /* createConnectTransport */.wQ)({
    baseUrl: endpoint,
    httpVersion: "1.1",
    interceptors: [authInterceptor],
    nodeOptions: {
      rejectUnauthorized: !insecure
    }
  });
  return (0, promise_client /* createClient */.UU)(ServerConfigService, transport);
}
function createBackgroundComposerClient(credentialManager, endpoint, configProvider) {
  const authInterceptor = createAuthInterceptor(credentialManager, noopRequestMiddleware, {
    baseUrl: endpoint,
    configProvider
  });
  const transport = new FetchTransport({
    baseUrl: endpoint,
    interceptors: [authInterceptor]
  });
  return (0, promise_client /* createClient */.UU)(BackgroundComposerService, transport);
}
function createAgentClient(credentialManager, options) {
  var _a, _b, _c, _d;
  // Determine privacy mode from config
  const isPrivacyMode = (() => {
    var _a, _b;
    try {
      const configValue = (_b = (_a = options.configProvider) === null || _a === void 0 ? void 0 : _a.get().privacyCache) === null || _b === void 0 ? void 0 : _b.ghostMode;
      if (typeof configValue === "boolean") {
        return configValue;
      }
      return true; // Default to privacy mode to be safe
    } catch (_c) {
      return true; // Default to privacy mode to be safe
    }
  })();
  // Check if use_nlb_for_nal flag is enabled
  // Use the flag from ServerConfigService if provided, otherwise default to false
  const useNlbForNal = (_a = options.useNlbForNal) !== null && _a !== void 0 ? _a : false;
  // Get the agent backend URL based on flag and privacy mode
  const agentBackendUrl = (0, api_endpoint /* getAgentBackendUrl */.t2)(options.backendUrl, isPrivacyMode, useNlbForNal);
  const authInterceptor = createAuthInterceptor(credentialManager, (_b = options.requestMiddleware) !== null && _b !== void 0 ? _b : noopRequestMiddleware, {
    baseUrl: agentBackendUrl,
    configProvider: options.configProvider
  });
  const zscalerSseInterceptor = next => req => client_awaiter(this, void 0, void 0, function* () {
    req.header.set("x-cursor-streaming", "true"); // signals to backend that text/event-stream content-type is accepted
    return yield next(req);
  });
  const systemPromptInterceptor = next => req => client_awaiter(this, void 0, void 0, function* () {
    const sysPath = process.env.CURSOR_AGENT_SYSTEM_PROMPT_PATH;
    if (sysPath && external_node_fs_.existsSync(sysPath)) {
      const rawContent = external_node_fs_.readFileSync(sysPath, "utf8");
      const trimmedContent = rawContent.trim();
      if (trimmedContent.length > 0) {
        const encodedPrompt = Buffer.from(rawContent, "utf8").toString("base64");
        const headerValue = `base64:${encodedPrompt}`;
        req.header.set("x-cursor-custom-system-prompt", headerValue);
      }
    }
    return yield next(req);
  });
  const url = new URL(agentBackendUrl);
  const isHttps = url.protocol === "https:";
  // Check if HTTP/1.1 should be used based on config
  const useHttp1 = (_d = (_c = options.configProvider) === null || _c === void 0 ? void 0 : _c.get().network.useHttp1ForAgent) !== null && _d !== void 0 ? _d : false;
  let transport;
  if (useHttp1) {
    // Create HTTP/1.1 transport with SSE support for bidirectional streaming
    const baseTransport = (0, esm /* createConnectTransport */.wQ)({
      baseUrl: agentBackendUrl,
      httpVersion: "1.1",
      interceptors: [zscalerSseInterceptor, systemPromptInterceptor, authInterceptor],
      nodeOptions: isHttps ? {
        protocol: "https:",
        rejectUnauthorized: !options.insecure
      } : undefined
    });
    // Create BidiService client for handling append operations
    const bidiClient = (0, promise_client /* createClient */.UU)(BidiService, baseTransport);
    // Wrap with BidiSseTransport to enable bidirectional streaming over HTTP/1.1
    transport = new BidiSseTransport(new AgentBidiMapper(), bidiClient, baseTransport, error => (0, debug.debugLog)("bidi-error", error));
  } else {
    // Use existing HTTP/2 transport
    transport = (0, esm /* createConnectTransport */.wQ)({
      baseUrl: agentBackendUrl,
      httpVersion: "2",
      interceptors: [systemPromptInterceptor, authInterceptor],
      nodeOptions: isHttps ? {
        protocol: "https:",
        rejectUnauthorized: !options.insecure
      } : undefined
    });
  }
  const contextClient = createContextPropagatingClient(AgentService, transport);
  return new dist /* AgentConnectClient */.PW(contextClient);
}
function createAnalyticsClient(credentialManager, options) {
  const authInterceptor = createAuthInterceptor(credentialManager, noopRequestMiddleware, {
    baseUrl: options.endpoint
  });
  // If the caller explicitly requested insecure connections, disable TLS
  // certificate validation for any HTTPS fetches **for the duration of the
  // process**. This mirrors the behaviour in other CLI commands such as
  // `dev-login`.
  if (options.insecure && options.endpoint.startsWith("https:")) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  const transport = new FetchTransport({
    baseUrl: options.endpoint,
    interceptors: [authInterceptor]
  });
  return (0, promise_client /* createClient */.UU)(AnalyticsService, transport);
}
function initAnalytics(credentialManager, options) {
  const analyticsClient = createAnalyticsClient(credentialManager, options);
  (0, analytics /* initAnalytics */.Bu)(analyticsClient, credentialManager);
}
function createAiServerClient(credentialManager, options) {
  var _a;
  const authInterceptor = createAuthInterceptor(credentialManager, (_a = options.requestMiddleware) !== null && _a !== void 0 ? _a : noopRequestMiddleware, {
    baseUrl: options.backendUrl,
    configProvider: options.configProvider
  });
  const url = new URL(options.backendUrl);
  const isHttps = url.protocol === "https:";
  const transport = (0, esm /* createConnectTransport */.wQ)({
    baseUrl: options.backendUrl,
    httpVersion: "1.1",
    interceptors: [authInterceptor],
    nodeOptions: isHttps ? {
      protocol: "https:",
      rejectUnauthorized: !options.insecure
    } : undefined
  });
  return (0, promise_client /* createClient */.UU)(AiService, transport);
}