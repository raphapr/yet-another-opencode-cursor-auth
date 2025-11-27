class LocalResourceProvider extends agent_exec_dist /* RegistryResourceAccessor */.h {
  constructor(options) {
    super();
    this.pendingDecisionStore = options.pendingDecisionStore;
    this.fileChangeTracker = options.fileChangeTracker;
    this.ignoreService = options.ignoreService;
    this.grepProvider = options.grepProvider;
    this.permissionsService = options.permissionsService;
    this.workspacePath = options.workspacePath;
    this.diagnosticsProvider = options.diagnosticsProvider;
    this.mcpLease = options.mcpLease;
    this.cursorRulesService = options.cursorRulesService;
    this.cloudRulesService = options.cloudRulesService;
    this.repositoryProvider = options.repositoryProvider;
    this.projectDir = options.projectDir;
    this.shellManager = options.shellManager;
    this._sandboxPolicyResolver = options._sandboxPolicyResolver;
    this._defaultSandboxPolicy = options._defaultSandboxPolicy ?? {
      type: "insecure_none"
    };
    this.mcpFileOutputThresholdBytes = options.mcpFileOutputThresholdBytes;
    this.backgroundShellFactory = options.backgroundShellFactory;
    this.mcpElicitationFactory = options.mcpElicitationFactory;
    this.requestContextFileWatcher = options.requestContextFileWatcher;
    this.sharedRequestContextExecutor = options.sharedRequestContextExecutor;
    this.terminalExecutor = options.terminalExecutor;
    this.skillsService = options.skillsService;
    this.enableRecordScreen = options.enableRecordScreen ?? false;
    this.userTerminalHint = options.userTerminalHint;
    const ex = this.terminalExecutor ?? (0, shell_exec_dist /* createDefaultTerminalExecutor */.Fn)({
      env: {
        CURSOR_AGENT: "1"
      },
      userTerminalHint: this.userTerminalHint
    });
    // For shell, use the first workspace path
    const firstWorkspacePath = Array.isArray(this.workspacePath) ? this.workspacePath[0] : this.workspacePath;
    // For multi-workspace, don't pass workspace path to read/write/delete/ls/diagnostics
    const singleWorkspacePath = Array.isArray(this.workspacePath) && this.workspacePath.length > 1 ? undefined : firstWorkspacePath;
    // clone to avoid shared mutable state
    const baseShellCoreExecutor = new BaseShellCoreExecutor(ex, firstWorkspacePath ?? (0, external_node_os_.homedir)(), this.projectDir);
    const shellCoreExecutor = this.shellManager ? new ManagedShellCoreExecutor(baseShellCoreExecutor, this.shellManager) : baseShellCoreExecutor;
    this.register(agent_exec_dist /* shellExecutorResource */.qk, createCachedExecutor(new LocalShellExecutor(this.permissionsService, shellCoreExecutor, this.ignoreService, this.pendingDecisionStore)));
    this.register(agent_exec_dist /* writeExecutorResource */.Ln, createCachedExecutor(new LocalWriteExecutor(this.fileChangeTracker, this.permissionsService, this.pendingDecisionStore, singleWorkspacePath)));
    this.register(agent_exec_dist /* deleteExecutorResource */.Rp, createCachedExecutor(new LocalDeleteExecutor(this.pendingDecisionStore, this.fileChangeTracker, this.permissionsService, singleWorkspacePath)));
    this.register(agent_exec_dist /* fetchExecutorResource */.IG, createCachedExecutor(new LocalFetchExecutor()));
    this.register(agent_exec_dist /* grepExecutorResource */.u8, createCachedExecutor(new LocalGrepExecutor(this.ignoreService, this.grepProvider, this.workspacePath)));
    this.register(agent_exec_dist /* readExecutorResource */._A, createCachedExecutor(new LocalReadExecutor(this.permissionsService, singleWorkspacePath)));
    const lsExecutor = new LocalLsExecutor(this.permissionsService, this.ignoreService, this.grepProvider.rgPath, singleWorkspacePath);
    this.register(agent_exec_dist /* lsExecutorResource */.bL, createCachedExecutor(lsExecutor));
    this.register(agent_exec_dist /* diagnosticsExecutorResource */.w4, createCachedExecutor(new LocalDiagnosticsExecutor(singleWorkspacePath, this.diagnosticsProvider)));
    this.register(agent_exec_dist /* mcpExecutorResource */.Yi, createCachedExecutor(new LocalMcpToolExecutor(this.mcpLease, this.permissionsService, this.pendingDecisionStore, this.projectDir, this.mcpFileOutputThresholdBytes, this.mcpElicitationFactory)));
    this.register(agent_exec_dist /* listMcpResourcesExecutorResource */.rn, createCachedExecutor(new LocalListMcpResourcesExecutor(this.mcpLease)));
    this.register(agent_exec_dist /* readMcpResourceExecutorResource */.ml, createCachedExecutor(new LocalReadMcpResourceExecutor(this.mcpLease, singleWorkspacePath || this.projectDir, this.permissionsService)));
    this.register(agent_exec_dist /* requestContextExecutorResource */.MZ, createCachedExecutor(this.sharedRequestContextExecutor ?? new LocalRequestContextExecutor(this.cursorRulesService, this.cloudRulesService, this.repositoryProvider, lsExecutor, this.mcpLease, this.workspacePath, this.projectDir, this.requestContextFileWatcher, options.getSandboxEnabled, this.skillsService, this.userTerminalHint)));
    this.register(agent_exec_dist /* shellStreamExecutorResource */.wv, createCachedStreamExecutor(new LocalShellStreamExecutor(this.permissionsService, shellCoreExecutor, this.ignoreService)));
    this.backgroundShellExecutor = new LocalBackgroundShellExecutor(this.permissionsService, shellCoreExecutor, this.ignoreService, this.projectDir, this.backgroundShellFactory);
    this.register(agent_exec_dist /* backgroundShellExecutorResource */.Ok, createCachedExecutor(this.backgroundShellExecutor));
    // Register computer-use executor if provided
    if (options.computerUseExecutor) {
      this.computerUseExecutor = options.computerUseExecutor;
      this.register(agent_exec_dist /* computerUseExecutorResource */.iZ, createCachedExecutor(this.computerUseExecutor));
    }
    // Register recordScreen executor only if enabled (exec-daemon only)
    if (this.enableRecordScreen) {
      this.register(agent_exec_dist /* recordScreenExecutorResource */.pq, createCachedExecutor(new LocalRecordScreenExecutor()));
    }
  }
  /**
   * Dispose all resources including background shell instances
   * Note: If a computerUseExecutor was passed in, the caller is responsible for disposing it
   */
  dispose() {
    this.backgroundShellExecutor.dispose();
  }
}
//# sourceMappingURL=provider.js.map