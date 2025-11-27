/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */H: () => (/* binding */initTracing)
  /* harmony export */
});
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:os");
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var _opentelemetry_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag-api.js");
/* harmony import */
var _opentelemetry_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag/types.js");
/* harmony import */
var _opentelemetry_exporter_trace_otlp_proto__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+exporter-trace-otlp-proto@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/exporter-trace-otlp-proto/build/esm/platform/node/OTLPTraceExporter.js");
/* harmony import */
var _opentelemetry_resources__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+resources@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js");
/* harmony import */
var _opentelemetry_sdk_node__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+sdk-node@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/sdk-node/build/src/index.js");
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/debug.ts");
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

// Avoid re-initialising if some caller imported this twice.
let initialized = false;
function initTracing(options) {
  return __awaiter(this, void 0, void 0, function* () {
    if (initialized) return;
    // Route OpenTelemetry diagnostics to debugLog, never to console
    const otelDiagLogger = {
      verbose: (...args) => {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("otel.verbose", ...args);
      },
      debug: (...args) => {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("otel.debug", ...args);
      },
      info: (...args) => {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("otel.info", ...args);
      },
      warn: (...args) => {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("otel.warn", ...args);
      },
      error: (...args) => {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("otel.error", ...args);
      }
    };
    _opentelemetry_api__WEBPACK_IMPORTED_MODULE_2__ /* .diag */.s.setLogger(otelDiagLogger, _opentelemetry_api__WEBPACK_IMPORTED_MODULE_3__ /* .DiagLogLevel */.u.ERROR);
    // Build exporter only when options are provided (so we can attach auth metadata)
    let exporter;
    try {
      exporter = options ? yield createExporter(options) : undefined;
    } catch (e) {
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("Failed to create OpenTelemetry exporter", e);
      return;
    }
    // Build a resource with client and environment attributes that apply to all spans
    const resource = options ? buildResource(options) : undefined;
    const sdk = new _opentelemetry_sdk_node__WEBPACK_IMPORTED_MODULE_4__ /* .NodeSDK */.P({
      autoDetectResources: false,
      traceExporter: exporter,
      resource
    });
    try {
      sdk.start();
    } catch (err) {
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("Failed to start OpenTelemetry SDK", err);
    }
    // Ensure we flush/shutdown on process exit
    const gracefulShutdown = () => {
      void sdk.shutdown().catch(err => {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("Error shutting down OpenTelemetry SDK", err);
      });
    };
    process.once("beforeExit", gracefulShutdown);
    process.once("SIGTERM", gracefulShutdown);
    process.once("SIGINT", gracefulShutdown);
    initialized = true;
  });
}
function buildResource(options) {
  var _a, _b, _c;
  const platform = node_os__WEBPACK_IMPORTED_MODULE_0___default().platform();
  const arch = node_os__WEBPACK_IMPORTED_MODULE_0___default().arch();
  const osRelease = node_os__WEBPACK_IMPORTED_MODULE_0___default().release();
  const nodeVersion = process.version;
  const cliVersion = (_a = "2025.11.25-d5b3271") !== null && _a !== void 0 ? _a : "unknown";
  const hostname = node_os__WEBPACK_IMPORTED_MODULE_0___default().hostname();
  // Build semantic resource attributes plus custom client.* ones
  const resource = (0, _opentelemetry_resources__WEBPACK_IMPORTED_MODULE_5__ /* .resourceFromAttributes */.QZ)({
    "service.name": (_b = options.serviceName) !== null && _b !== void 0 ? _b : "cursor-agent-cli",
    "service.version": (_c = options.serviceVersion) !== null && _c !== void 0 ? _c : cliVersion,
    "host.name": hostname,
    "os.type": platform,
    "os.version": osRelease,
    "process.runtime.name": "node",
    "process.runtime.version": nodeVersion,
    "client.os.platform": platform,
    "client.os.release": osRelease,
    "client.arch": arch,
    "client.node.version": nodeVersion,
    "client.cli.version": cliVersion
  });
  return resource;
}
function createExporter(options) {
  return __awaiter(this, void 0, void 0, function* () {
    const backendUrl = options.backendUrl;
    const tokenMaybe = yield options.credentialManager.getAccessToken();
    if (!tokenMaybe) {
      throw new Error("No access token found for tracing exporter");
    }
    const token = tokenMaybe;
    const ghostMode = (() => {
      var _a, _b;
      try {
        const value = (_b = (_a = options.configProvider) === null || _a === void 0 ? void 0 : _a.get().privacyCache) === null || _b === void 0 ? void 0 : _b.ghostMode;
        if (typeof value === "boolean") return value;
        return true;
      } catch (_c) {
        return true;
      }
    })();
    // Build HTTP headers for authentication and content type
    const headers = {
      authorization: `Bearer ${token}`,
      "x-ghost-mode": ghostMode ? "true" : "false",
      "x-cursor-client-version": "agent-cli"
    };
    // Construct the complete URL with /v1/traces path for OTLP HTTP
    const traceUrl = `${backendUrl}/v1/traces`;
    return new _opentelemetry_exporter_trace_otlp_proto__WEBPACK_IMPORTED_MODULE_6__ /* .OTLPTraceExporter */.Q({
      url: traceUrl,
      headers
    });
  });
}

/***/