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
function buildCliResources(ctx, params) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const cwd = (_a = params.workingDirectory) !== null && _a !== void 0 ? _a : process.cwd();
    // Discover rg path or fall back to "rg"
    let rgPath = (_b = params.rgPath) !== null && _b !== void 0 ? _b : "rg";
    if (!params.rgPath) {
      try {
        const {
          execSync
        } = yield Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, "node:child_process", 23));
        rgPath = execSync("which rg", {
          encoding: "utf8"
        }).trim();
      } catch (_h) {
        // best-effort; keep default "rg"
      }
    }
    // Dashboard client + team settings
    const credentialManager = (0, cli_credentials_dist /* createCredentialManager */.jo)((_c = "cursor") !== null && _c !== void 0 ? _c : "cursor-dev");
    const dashboardClient = (0, cursor_config_dist /* createDashboardClient */.Vi)({
      credentialManager,
      endpoint: (0, api_endpoint /* getApiEndpoint */.G6)(),
      configProvider: params.configProvider
    });
    const teamSettingsService = new local_exec_dist.ConnectTeamSettingsService(dashboardClient);
    // File tracking, rules, ignores
    const fileChangeTracker = new local_exec_dist.FileChangeTracker(cwd);
    if (params.withDiffs) {
      const fileChanges = (0, git_diffs.buildFileChanges)((0, git_diffs.collectGitStatuses)());
      for (const file of fileChanges) {
        fileChangeTracker.trackChange(file.path, file.before, file.after);
      }
    }
    // Load CLAUDE.md files by default for agent-cli
    const getClaudeMdEnabled = () => true;
    const cursorRulesService = new local_exec_dist.LocalCursorRulesService(ctx, cwd, rgPath, false, getClaudeMdEnabled, undefined);
    const ignoreService = new local_exec_dist.LazyIgnoreService(rgPath, teamSettingsService);
    // Permissions providers: config + optional Claude files
    const permissionsProviders = [];
    // Wrap ConfigPermissionsAdapter to override approvalMode based on getIsAutoRun
    class AutoRunAwarePermissionsProvider {
      constructor(configProvider, getIsAutoRun) {
        this.configProvider = configProvider;
        this.getIsAutoRun = getIsAutoRun;
        this.baseProvider = new cursor_config_dist /* ConfigPermissionsAdapter */.QX(configProvider);
      }
      setGetIsAutoRun(getIsAutoRun) {
        this.getIsAutoRun = getIsAutoRun;
      }
      getPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
          var _a, _b, _c;
          const perms = yield this.baseProvider.getPermissions();
          // Override approvalMode based on getIsAutoRun
          const approvalMode = this.getIsAutoRun() ? "unrestricted" : "allowlist";
          // Determine sandbox policy from config
          const cfg = this.configProvider.get();
          const mode = (_b = (_a = cfg.sandbox) === null || _a === void 0 ? void 0 : _a.mode) !== null && _b !== void 0 ? _b : "disabled";
          const userConfiguredPolicy = mode === "disabled" ? {
            type: "insecure_none"
          } : {
            type: "workspace_readwrite",
            network_access: ((_c = cfg.sandbox) === null || _c === void 0 ? void 0 : _c.networkAccess) === "enabled"
          };
          return Object.assign(Object.assign({}, perms), {
            approvalMode,
            userConfiguredPolicy
          });
        });
      }
      updatePermissions(transformer) {
        return __awaiter(this, void 0, void 0, function* () {
          return this.baseProvider.updatePermissions(transformer);
        });
      }
    }
    const localPermissionsProvider = new AutoRunAwarePermissionsProvider(params.configProvider, params.getIsAutoRun);
    permissionsProviders.push(localPermissionsProvider);
    const gitRoot = yield (0, local_exec_dist.findGitRoot)(cwd);
    const isRepository = !!gitRoot;
    const projectDir = gitRoot !== null && gitRoot !== void 0 ? gitRoot : cwd;
    const claudeProject = yield cursor_config_dist /* ReadOnlyFileBasedPermissionsProvider */.N2.loadFromPath(external_node_path_default().join(projectDir, ".claude", "settings.json"));
    if (claudeProject) permissionsProviders.push(claudeProject);
    const claudeGlobal = yield cursor_config_dist /* ReadOnlyFileBasedPermissionsProvider */.N2.loadFromPath(external_node_path_default().join((0, external_node_os_.homedir)(), ".claude", "settings.json"));
    if (claudeGlobal) permissionsProviders.push(claudeGlobal);
    const mergedPermissionsProvider = new cursor_config_dist /* MergedPermissionsProvider */.Ol(permissionsProviders);
    const projectPath = (0, cursor_config_dist /* getProjectDir */.Xq)(cwd);
    // Create MCP loader using CursorConfigMcpLoader
    const baseMcpLoader = cursor_config_dist /* CursorConfigMcpLoader */.aK.init(teamSettingsService, cwd, projectPath, (_d = params.ignoreApproveMcps) !== null && _d !== void 0 ? _d : false);
    const mcpLoader = params.isBrowserUserEnabled ? new local_exec_dist.McpLoaderWithCustomClients(baseMcpLoader, {
      [dist /* CURSOR_PLAYWRIGHT_PROVIDER_ID */.HI]: new PlaywrightMcpClient()
    }) : baseMcpLoader;
    // Permissions service wiring to new config model
    const config = params.configProvider.get();
    const sandboxMode = (_f = (_e = config.sandbox) === null || _e === void 0 ? void 0 : _e.mode) !== null && _f !== void 0 ? _f : "disabled";
    const sandboxNetwork = (_g = config.sandbox) === null || _g === void 0 ? void 0 : _g.networkAccess; // "allowlist" | "enabled"
    const permissionsService = new local_exec_dist.InteractivePermissionsService(ignoreService, params.decisionProvider,
    // Always use merged provider so "Always" approvals persist to config allowlists
    mergedPermissionsProvider, teamSettingsService);
    const grepProvider = {
      rgPath,
      executeIndexedGrep: undefined
    };
    // Load hooks configuration
    const hooksConfigPaths = {
      userConfigPath: external_node_path_default().join((0, external_node_os_.homedir)(), ".cursor", "hooks.json"),
      projectConfigPath: external_node_path_default().join(projectDir, ".cursor", "hooks.json")
    };
    const fileReader = new hooks_exec_dist /* NodeFileReader */.IF();
    const configLoader = new hooks_exec_dist /* HooksConfigLoader */.gY(fileReader, hooksConfigPaths);
    const hooksConfig = yield configLoader.load();
    const hooksConfigLease = new hooks_exec_dist /* StaticHooksConfigLease */.HG(hooksConfig);
    return {
      permissionsService,
      grepProvider,
      fileChangeTracker,
      dashboardClient,
      teamSettingsService,
      mcpLoader,
      isRepository,
      hooksConfigLease,
      createLocalResourceProvider: ({
        diagnosticsProvider,
        mcpLease,
        codebaseReferenceProvider,
        shellManager,
        pendingDecisionProviderOverride,
        conversationId = "",
        generationId = "",
        model = "unknown"
      }) => {
        // Determine if sandbox should be enabled: check environment support and user preference
        const getSandboxEnabled = () => {
          // Check if environment supports sandboxing
          const envSupportsSandbox = (0, shell_exec_dist /* isSandboxSupported */.K3)();
          // Check if user has enabled sandboxing in config
          const userEnabledSandbox = sandboxMode === "enabled";
          // Both conditions must be true
          return envSupportsSandbox && userEnabledSandbox;
        };
        const baseResources = new local_exec_dist.LocalResourceProvider({
          pendingDecisionStore: pendingDecisionProviderOverride !== null && pendingDecisionProviderOverride !== void 0 ? pendingDecisionProviderOverride : params.decisionProvider,
          fileChangeTracker,
          ignoreService,
          grepProvider,
          permissionsService,
          workspacePath: cwd,
          diagnosticsProvider,
          mcpLease,
          cursorRulesService,
          repositoryProvider: codebaseReferenceProvider,
          projectDir: projectPath,
          shellManager,
          _sandboxPolicyResolver: undefined,
          _defaultSandboxPolicy: sandboxMode === "enabled" ? {
            type: "workspace_readwrite",
            network_access: sandboxNetwork === "enabled"
          } : {
            type: "insecure_none"
          },
          getSandboxEnabled
        });
        // Wrap with hooks support if any hooks are configured
        if (hooksConfig.userHooks || hooksConfig.projectHooks) {
          const globalContext = {
            cursor_version: "1.0.0",
            // TODO: Get actual version
            user_email: null // TODO: Get user email if available
          };
          const terminalExecutor = (0, shell_exec_dist /* createDefaultTerminalExecutor */.Fn)();
          const hookExecutor = new hooks_exec_dist /* CliHooksExecutor */.WL(hooksConfig, projectDir, globalContext, terminalExecutor);
          return new hooks_exec_dist /* ListableHooksResourceAccessor */.ae(baseResources, hookExecutor, () => ({
            conversation_id: conversationId,
            generation_id: generationId,
            model
          }));
        }
        return baseResources;
      },
      setGetIsAutoRun: getIsAutoRun => {
        // Update the wrapper's getIsAutoRun function
        localPermissionsProvider.setGetIsAutoRun(getIsAutoRun);
      }
    };
  });
}