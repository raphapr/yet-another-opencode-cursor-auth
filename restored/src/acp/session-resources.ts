var session_resources_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function createSessionResources(connection, sessionId, sharedServices, _agentStore, options) {
  return session_resources_awaiter(this, void 0, void 0, function* () {
    var _a;
    const {
      force = false
    } = options;
    const decisionProvider = force ? new always_approve_decision_provider /* AlwaysApproveDecisionProvider */.I() : new AcpDecisionProvider(connection, sessionId);
    const permissionsService = new local_exec_dist.InteractivePermissionsService(sharedServices.ignoreService, decisionProvider, sharedServices.permissionsProvider, sharedServices.teamSettingsService);
    const workspacePath = process.cwd();
    const projectDir = (_a = yield Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "../local-exec/dist/index.js")).then(m => m.findGitRoot(workspacePath))) !== null && _a !== void 0 ? _a : workspacePath;
    const skillsService = new local_exec_dist.LocalSkillsService((0, context_dist /* createContext */.q6)(), workspacePath, undefined);
    const baseResources = new local_exec_dist.LocalResourceProvider({
      pendingDecisionStore: decisionProvider,
      fileChangeTracker: sharedServices.fileChangeTracker,
      ignoreService: sharedServices.ignoreService,
      grepProvider: sharedServices.grepProvider,
      permissionsService,
      workspacePath,
      diagnosticsProvider: sharedServices.diagnosticsProvider,
      mcpLease: sharedServices.mcpLease,
      cursorRulesService: sharedServices.cursorRulesService,
      repositoryProvider: sharedServices.codebaseReferenceProvider,
      projectDir,
      skillsService
    });
    // Load hooks configuration
    const hooksConfigPaths = {
      userConfigPath: external_node_path_default().join((0, external_node_os_.homedir)(), ".cursor", "hooks.json"),
      projectConfigPath: external_node_path_default().join(projectDir, ".cursor", "hooks.json")
    };
    const fileReader = new hooks_exec_dist /* NodeFileReader */.IF();
    const configLoader = new hooks_exec_dist /* HooksConfigLoader */.gY(fileReader, hooksConfigPaths);
    const hooksConfig = yield configLoader.load();
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
        conversation_id: sessionId,
        generation_id: sessionId,
        // Use sessionId as generation_id for ACP
        model: "unknown"
      }));
    }
    return baseResources;
  });
}