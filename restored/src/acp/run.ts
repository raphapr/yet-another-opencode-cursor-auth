__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */w: () => (/* binding */runAcp)
      /* harmony export */
    });
    /* harmony import */
    var _zed_industries_agent_client_protocol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/@zed-industries+agent-client-protocol@0.1.2/node_modules/@zed-industries/agent-client-protocol/dist/acp.js");
    /* harmony import */
    var _analytics_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/analytics.ts");
    /* harmony import */
    var _api_key_auth_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/api-key-auth.ts");
    /* harmony import */
    var _client_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/client.ts");
    /* harmony import */
    var _console_io_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/console-io.ts");
    /* harmony import */
    var _onboarding_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/onboarding.tsx");
    /* harmony import */
    var _tracing_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/tracing.ts");
    /* harmony import */
    var _utils_api_endpoint_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/utils/api-endpoint.ts");
    /* harmony import */
    var _cursor_acp_agent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/acp/cursor-acp-agent.ts");
    /* harmony import */
    var _shared_services_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/acp/shared-services.ts");
    /* harmony import */
    var _streams_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/acp/streams.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_onboarding_js__WEBPACK_IMPORTED_MODULE_4__]);
    _onboarding_js__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
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
    function runAcp(ctx, options, deps) {
      return __awaiter(this, void 0, void 0, function* () {
        yield (0, _tracing_js__WEBPACK_IMPORTED_MODULE_5__ /* .initTracing */.H)({
          backendUrl: (0, _utils_api_endpoint_js__WEBPACK_IMPORTED_MODULE_9__ /* .getApiEndpoint */.G6)(options.endpoint),
          credentialManager: deps.credentialManager,
          configProvider: deps.configProvider
        });
        const backendUrl = (0, _utils_api_endpoint_js__WEBPACK_IMPORTED_MODULE_9__ /* .getApiEndpoint */.G6)(options.endpoint);
        try {
          (0, _client_js__WEBPACK_IMPORTED_MODULE_3__ /* .initAnalytics */.Bu)(deps.credentialManager, {
            endpoint: backendUrl,
            insecure: options.insecure
          });
        } catch (_a) {
          // don't block on analytics init errors
        }
        const {
          isAuthenticated: isAuthTokenAuthenticated
        } = yield (0, _api_key_auth_js__WEBPACK_IMPORTED_MODULE_2__ /* .tryAuthTokenAuth */.D)(deps.credentialManager, {
          authToken: options.authToken
        });
        const {
          isAuthenticated: isApiKeyAuthenticated
        } = isAuthTokenAuthenticated ? {
          isAuthenticated: false
        } : yield (0, _api_key_auth_js__WEBPACK_IMPORTED_MODULE_2__ /* .tryApiKeyAuth */.T)(deps.credentialManager, {
          apiKey: options.apiKey,
          endpoint: backendUrl
        });
        const isAuthenticated = isAuthTokenAuthenticated || isApiKeyAuthenticated || (yield (0, _onboarding_js__WEBPACK_IMPORTED_MODULE_4__ /* .checkAuthenticationStatus */.h4)(deps.credentialManager, _onboarding_js__WEBPACK_IMPORTED_MODULE_4__ /* .AuthType */.hT.LOGIN));
        if (!isAuthenticated) {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_10__ /* .exitWithMessage */.uQ)(1, "Authentication required to use Cursor Agent. Please run 'cursor-agent login' to authenticate.");
        }
        try {
          (0, _analytics_js__WEBPACK_IMPORTED_MODULE_1__ /* .trackEvent */.sx)("cli.launch");
        } catch (_b) {
          // ignore analytics errors
        }
        const sharedServices = yield (0, _shared_services_js__WEBPACK_IMPORTED_MODULE_7__ /* .initializeAcpSharedServices */.Q)(ctx, options, deps, backendUrl);
        process.on("unhandledRejection", (_reason, _promise) => {
          // noop
        });
        const output = (0, _streams_js__WEBPACK_IMPORTED_MODULE_8__ /* .nodeToWebWritable */.W)(process.stdout);
        const input = (0, _streams_js__WEBPACK_IMPORTED_MODULE_8__ /* .nodeToWebReadable */.G)(process.stdin);
        new _zed_industries_agent_client_protocol__WEBPACK_IMPORTED_MODULE_0__ /* .AgentSideConnection */.Bi(conn => new _cursor_acp_agent_js__WEBPACK_IMPORTED_MODULE_6__ /* .CursorACPAgent */.o(conn, deps, ctx, options, sharedServices), output, input);
        process.stdin.resume();
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/