/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */Q: () => (/* binding */initializeAcpSharedServices)
  /* harmony export */
});
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:os");
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */
var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../local-exec/dist/index.js");
/* harmony import */
var _client_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/client.ts");
/* harmony import */
var _models_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/models/index.ts");
/* harmony import */
var _state_session_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/state/session.ts");
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
function initializeAcpSharedServices(ctx, options, deps, backendUrl) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c;
    const {
      rgPath
    } = deps;
    const {
      withDiffs = false,
      model
    } = options;
    const cwd = process.cwd();
    const fileChangeTracker = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__.FileChangeTracker(cwd);
    if (withDiffs) {
      const {
        buildFileChanges,
        collectGitStatuses
      } = yield __webpack_require__.e(/* import() */9156).then(__webpack_require__.bind(__webpack_require__, "./src/utils/git-diffs.ts"));
      const fileChanges = buildFileChanges(collectGitStatuses());
      for (const file of fileChanges) {
        fileChangeTracker.trackChange(file.path, file.before, file.after);
      }
    }
    const aiServerClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_4__ /* .createAiServerClient */.t9)(deps.credentialManager, {
      backendUrl,
      insecure: options.insecure,
      configProvider: deps.configProvider
    });
    const dashboardClient = (0, _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .createDashboardClient */.Vi)({
      credentialManager: deps.credentialManager,
      endpoint: backendUrl,
      configProvider: deps.configProvider
    });
    // Fetch server config to get feature flags
    const serverConfigServiceClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_4__ /* .createServerConfigServiceClient */.ms)(deps.credentialManager, backendUrl, (_a = options.insecure) !== null && _a !== void 0 ? _a : false, deps.configProvider);
    const serverConfigService = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__.ConnectServerConfigService(serverConfigServiceClient);
    const serverConfig = yield serverConfigService.fetchServerConfig();
    const useNlbForNal = (_b = serverConfig.useNlbForNal) !== null && _b !== void 0 ? _b : false;
    const middleware = (req, next) => {
      _state_session_js__WEBPACK_IMPORTED_MODULE_6__ /* .session */.d.recordLastRequest(req.requestId, {
        path: req.inner.url
      });
      return next(req);
    };
    const agentClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_4__ /* .createAgentClient */.hO)(deps.credentialManager, {
      backendUrl,
      insecure: options.insecure,
      requestMiddleware: middleware,
      configProvider: deps.configProvider,
      useNlbForNal
    });
    const projectDir = (_c = yield (0, _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__.findGitRoot)(cwd)) !== null && _c !== void 0 ? _c : cwd;
    // Load CLAUDE.md files by default for agent-cli
    const getClaudeMdEnabled = () => true;
    const cursorRulesService = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__.LocalCursorRulesService(ctx, cwd, rgPath, false, getClaudeMdEnabled, undefined);
    const teamSettingsService = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__.ConnectTeamSettingsService(dashboardClient);
    const mcpLoader = _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .CursorConfigMcpLoader */.aK.init(teamSettingsService, cwd, projectDir);
    const ignoreService = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__.LazyIgnoreService(rgPath, teamSettingsService);
    const modelManager = yield _models_index_js__WEBPACK_IMPORTED_MODULE_5__ /* .ModelManager */.P3.init(aiServerClient, {
      configProvider: deps.configProvider,
      initialModel: model
    });
    const mcpManager = yield mcpLoader.load(ctx);
    const mcpLease = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_3__.ManagerMcpLease(mcpManager);
    const permissionsProviders = [];
    const localPermissionsProvider = new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .ConfigPermissionsAdapter */.QX(deps.configProvider);
    permissionsProviders.push(localPermissionsProvider);
    const claudeProjectPermissionsProvider = yield _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .ReadOnlyFileBasedPermissionsProvider */.N2.loadFromPath(node_path__WEBPACK_IMPORTED_MODULE_1___default().join(projectDir, ".claude", "settings.json"));
    if (claudeProjectPermissionsProvider) {
      permissionsProviders.push(claudeProjectPermissionsProvider);
    }
    const claudeGlobalPermissionsProvider = yield _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .ReadOnlyFileBasedPermissionsProvider */.N2.loadFromPath(node_path__WEBPACK_IMPORTED_MODULE_1___default().join((0, node_os__WEBPACK_IMPORTED_MODULE_0__.homedir)(), ".claude", "settings.json"));
    if (claudeGlobalPermissionsProvider) {
      permissionsProviders.push(claudeGlobalPermissionsProvider);
    }
    const permissionsProvider = new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .MergedPermissionsProvider */.Ol(permissionsProviders);
    const grepProvider = {
      rgPath,
      // TODO: indexedGrep is not available in agent-cli yet because we don't run the cursor-retrieval extension here
      executeIndexedGrep: undefined
    };
    return {
      modelManager,
      agentClient,
      mcpLease,
      fileChangeTracker,
      ignoreService,
      permissionsProvider,
      teamSettingsService,
      cursorRulesService,
      diagnosticsProvider: deps.diagnosticsProvider,
      codebaseReferenceProvider: deps.codebaseReferenceProvider,
      grepProvider
    };
  });
}

/***/