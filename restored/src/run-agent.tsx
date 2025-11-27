__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */J: () => (/* binding */runAgent)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../agent-kv/dist/index.js");
    /* harmony import */
    var _anysphere_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../context/dist/index.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../local-exec/dist/index.js");
    /* harmony import */
    var _always_approve_decision_provider_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./src/always-approve-decision-provider.ts");
    /* harmony import */
    var _always_deny_decision_provider_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./src/always-deny-decision-provider.ts");
    /* harmony import */
    var _client_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/client.ts");
    /* harmony import */
    var _commands_update_core_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/commands/update-core.ts");
    /* harmony import */
    var _console_io_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/console-io.ts");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _headless_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/headless.ts");
    /* harmony import */
    var _models_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/models/index.ts");
    /* harmony import */
    var _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/pending-decision-store.ts");
    /* harmony import */
    var _shared_resources_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/shared/resources.ts");
    /* harmony import */
    var _state_index_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/state/index.ts");
    /* harmony import */
    var _state_session_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/state/session.ts");
    /* harmony import */
    var _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/state/sqlite-blob-store.ts");
    /* harmony import */
    var _ui_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/ui.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _ui_js__WEBPACK_IMPORTED_MODULE_16__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _ui_js__WEBPACK_IMPORTED_MODULE_16__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
      if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
          if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
          dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
          if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
          dispose = value[Symbol.dispose];
          if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function () {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
        env.stack.push({
          value: value,
          dispose: dispose,
          async: async
        });
      } else if (async) {
        env.stack.push({
          async: true
        });
      }
      return value;
    };
    var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
      return function (env) {
        function fail(e) {
          env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
          env.hasError = true;
        }
        var r,
          s = 0;
        function next() {
          while (r = env.stack.pop()) {
            try {
              if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
              if (r.dispose) {
                var result = r.dispose.call(r.value);
                if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
                  fail(e);
                  return next();
                });
              } else s |= 1;
            } catch (e) {
              fail(e);
            }
          }
          if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
          if (env.hasError) throw env.error;
        }
        return next();
      };
    }(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    });
    function runAgent(ctx, prompt, options, credentialManager) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const env_1 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const span = __addDisposableResource(env_1, (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_3__ /* .createSpan */.VI)(ctx.withName("runAgent")), false);
          void span;
          const {
            backendUrl,
            insecure: allowInsecure,
            print,
            debug = false,
            withDiffs = false,
            resumeChatId,
            resumeBcId,
            rgPath,
            diagnosticsProvider,
            codebaseReferenceProvider,
            model,
            workspace
          } = options;
          if (debug) {
            yield (0, _debug_js__WEBPACK_IMPORTED_MODULE_8__.initDebug)();
          }
          try {
            new URL(backendUrl);
          } catch (_g) {
            (0, _console_io_js__WEBPACK_IMPORTED_MODULE_17__ /* .exitWithMessage */.uQ)(1, `Error: Invalid backend URL "${backendUrl}"`);
          }
          // Create per-agent SQLite store under config dir; folder name = agentId
          const chatsRoot = (0, _state_index_js__WEBPACK_IMPORTED_MODULE_13__ /* .getChatsRootDir */.r)();
          const resumeId = resumeChatId;
          const agentId = resumeId || crypto.randomUUID();
          const agentDir = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)(chatsRoot, agentId);
          const dbPath = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)(agentDir, "store.db");
          let sqliteStore;
          if (resumeId) {
            sqliteStore = yield _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_15__ /* .SQLiteBlobStoreWithMetadata */.M.initAndLoad(dbPath);
          } else {
            sqliteStore = new _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_15__ /* .SQLiteBlobStoreWithMetadata */.M(dbPath);
          }
          const agentStore = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ /* .AgentStore */.pH(sqliteStore, sqliteStore);
          // Helper function to determine if we should auto-approve based on force flag and sandbox settings
          const shouldAutoApprove = () => {
            var _a;
            if (options.force) return true;
            const config = options.configProvider.get();
            const approvalMode = (_a = config.approvalMode) !== null && _a !== void 0 ? _a : "allowlist";
            // Only auto-approve in unrestricted mode; 'allowlist' still prompts for fallbacks
            return approvalMode === "unrestricted";
          };
          const pendingDecisionStore = new _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_11__ /* .PendingDecisionStore */.$();
          // When --force is provided, bypass all approval prompts for executors/tools
          // by supplying an approval provider that always approves. Keep the UI store
          // so the TUI can still function (it will simply have no pending items).
          // Also check sandbox approval mode for auto/unrestricted modes
          const decisionProvider = shouldAutoApprove() ? new _always_approve_decision_provider_js__WEBPACK_IMPORTED_MODULE_18__ /* .AlwaysApproveDecisionProvider */.I() : print ? new _always_deny_decision_provider_js__WEBPACK_IMPORTED_MODULE_19__ /* .AlwaysDenyDecisionProvider */.N() : pendingDecisionStore;
          const {
            createLocalResourceProvider,
            permissionsService,
            fileChangeTracker,
            dashboardClient,
            teamSettingsService,
            mcpLoader,
            isRepository,
            setGetIsAutoRun
          } = yield (0, _shared_resources_js__WEBPACK_IMPORTED_MODULE_12__ /* .buildCliResources */._)(span.ctx, {
            configProvider: options.configProvider,
            decisionProvider,
            workingDirectory: workspace ? (0, node_path__WEBPACK_IMPORTED_MODULE_1__.resolve)(workspace) : process.cwd(),
            rgPath,
            withDiffs,
            getIsAutoRun: () => agentStore.getMetadata("mode") === "auto-run",
            isBrowserUserEnabled: options.isBrowserUseEnabled,
            ignoreApproveMcps: (_a = options.approveMcps) !== null && _a !== void 0 ? _a : false
          });
          // Check if --force is forbidden by team admin settings
          if (options.force) {
            try {
              const teamAdminSettings = yield teamSettingsService.getTeamAdminSettings();
              const autoRunControls = teamAdminSettings === null || teamAdminSettings === void 0 ? void 0 : teamAdminSettings.autoRunControls;
              if ((autoRunControls === null || autoRunControls === void 0 ? void 0 : autoRunControls.enabled) && !autoRunControls.enableRunEverything) {
                (0, _console_io_js__WEBPACK_IMPORTED_MODULE_17__ /* .exitWithMessage */.uQ)(1, "Error: Your team administrator has disabled the 'Run Everything' option.\n" + "Please run without '--force' to approve commands individually, or contact your administrator to enable this feature.");
              }
            } catch (error) {
              // If we can't fetch team settings, we'll allow --force to proceed
              // This ensures the CLI doesn't break if there are network issues
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_8__.debugLogJSON)("Warning: Could not fetch team admin settings, allowing --force to proceed:", error);
            }
          }
          const aiServerClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_6__ /* .createAiServerClient */.t9)(credentialManager, {
            backendUrl,
            insecure: allowInsecure,
            configProvider: options.configProvider
          });
          // Instantiate Background Composer client for reuse in UI when needed
          const backgroundComposerClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_6__ /* .createBackgroundComposerClient */.c3)(credentialManager, backendUrl, options.configProvider);
          const modelManager = yield _models_index_js__WEBPACK_IMPORTED_MODULE_10__ /* .ModelManager */.P3.init(aiServerClient, {
            configProvider: options.configProvider,
            initialModel: model
          });
          const mcpManager = yield mcpLoader.load(ctx);
          const mcpLease = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.ManagerMcpLease(mcpManager);
          if (resumeId) {
            try {
              yield agentStore.resetFromDb(ctx);
              const lastUsedModel = agentStore.getMetadata("lastUsedModel");
              yield modelManager.setModelFromStoredId(lastUsedModel, options.configProvider);
            } catch (e) {
              (0, _console_io_js__WEBPACK_IMPORTED_MODULE_17__ /* .exitWithMessage */.uQ)(1, `Failed to resume chat "${resumeId}": ${e instanceof Error ? e.message : String(e)}`);
            }
          }
          if (options.force) {
            agentStore.setMetadata("mode", "auto-run");
          }
          // Respect explicit mode from CLI (e.g., --background)
          if (options.mode === "background") {
            agentStore.setMetadata("mode", "background");
          }
          if (resumeBcId) {
            agentStore.setMetadata("mode", "background");
            agentStore.setMetadata("resumeBcId", resumeBcId);
          }
          const middleware = (req, next) => {
            _state_session_js__WEBPACK_IMPORTED_MODULE_14__ /* .session */.d.recordLastRequest(req.requestId, {
              path: req.inner.url
            });
            return next(req);
          };
          // If the CLI caller passed --system-prompt, surface it to client transport via env BEFORE creating transport
          if (options.systemPromptPathEnvVar) {
            process.env.CURSOR_AGENT_SYSTEM_PROMPT_PATH = options.systemPromptPathEnvVar;
          }
          // Fetch server config to get feature flags
          const serverConfigServiceClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_6__ /* .createServerConfigServiceClient */.ms)(credentialManager, backendUrl, allowInsecure, options.configProvider);
          const serverConfigService = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.ConnectServerConfigService(serverConfigServiceClient);
          const serverConfig = yield serverConfigService.fetchServerConfig();
          const useNlbForNal = (_b = serverConfig.useNlbForNal) !== null && _b !== void 0 ? _b : false;
          const agentClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_6__ /* .createAgentClient */.hO)(credentialManager, {
            backendUrl,
            insecure: allowInsecure,
            requestMiddleware: middleware,
            configProvider: options.configProvider,
            useNlbForNal
          });
          const config = options.configProvider.get();
          if (true && config.channel !== "static") {
            // Start update check in background - don't await
            (0, _commands_update_core_js__WEBPACK_IMPORTED_MODULE_7__ /* .updateCursorAgent */.N)({
              dashboardClient,
              showProgress: false,
              channel: config.channel
            }).catch(error => {
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_8__.debugLogJSON)("backgroundUpdateCheckFailed", error);
            });
          }
          try {
            if (print) {
              if (debug) {
                const session = (0, _debug_js__WEBPACK_IMPORTED_MODULE_8__.getDebugSession)();
                if (session) {
                  (0, _console_io_js__WEBPACK_IMPORTED_MODULE_17__ /* .intentionallyWriteToStderr */.p2)(`Debug server: ${session.serverUrl} (log: ${session.logFile})`);
                }
              }
              const resources = createLocalResourceProvider({
                diagnosticsProvider,
                mcpLease,
                codebaseReferenceProvider
              });
              yield (0, _headless_js__WEBPACK_IMPORTED_MODULE_9__ /* .runHeadless */.t)(ctx, prompt, modelManager, agentClient, resources, agentStore, (_c = options.force) !== null && _c !== void 0 ? _c : false, {
                outputFormat: (_d = options.outputFormat) !== null && _d !== void 0 ? _d : "text",
                streamPartialOutput: options.streamPartialOutput,
                sessionId: agentId,
                apiKeySource: (_e = options.apiKeySource) !== null && _e !== void 0 ? _e : "login",
                headers: options.headers,
                captureEnv: (_f = options.printEnv) !== null && _f !== void 0 ? _f : false
              });
              // NOTE: the above call to runHeadless will exit the process upon completion with process.exit(0), so no code will execute after this point.
            } else {
              const debugSession = debug ? (0, _debug_js__WEBPACK_IMPORTED_MODULE_8__.getDebugSession)() : null;
              const shellManager = new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_5__.ShellManager();
              const resources = createLocalResourceProvider({
                diagnosticsProvider,
                mcpLease,
                codebaseReferenceProvider,
                shellManager
              });
              // Ensure stdin is not paused before rendering
              if (process.stdin.isTTY) {
                try {
                  process.stdin.resume();
                } catch (e) {
                  (0, _debug_js__WEBPACK_IMPORTED_MODULE_8__.debugLog)("Failed to resume stdin", {
                    error: e
                  });
                }
              }
              const {
                waitUntilExit
              } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_js__WEBPACK_IMPORTED_MODULE_16__ /* .AnysphereAgentUI */.X, {
                ctx: ctx,
                prompt: prompt,
                agentClient: agentClient,
                aiServerClient: aiServerClient,
                resources: resources,
                agentStore: agentStore,
                pendingDecisionStore: pendingDecisionStore,
                fileChangeTracker: fileChangeTracker,
                configProvider: options.configProvider,
                credentialManager: credentialManager,
                dashboardClient: dashboardClient,
                mcpLease: mcpLease,
                mcpLoader: mcpLoader,
                addToAllowList: (kind, value) => permissionsService.addToAllowList(ctx, kind, value),
                addToDenyList: (kind, value) => permissionsService.addToDenyList(ctx, kind, value),
                modelManager: modelManager,
                endpoint: options.endpoint,
                headers: options.headers,
                // New: update permissions service when agentStore changes (resume)
                onAgentStoreChanged: newStore => setGetIsAutoRun(() => newStore.getMetadata("mode") === "auto-run"),
                debugInfo: debugSession ? {
                  serverUrl: debugSession.serverUrl,
                  logFile: debugSession.logFile
                } : undefined,
                isRepository: isRepository,
                rgPath: rgPath,
                backgroundComposerClient: backgroundComposerClient,
                shellManager: shellManager
              }), {
                exitOnCtrlC: false,
                // We manually redirect the console to our debug web UI - we don't want to send it to
                // the console, even if it's clean.
                patchConsole: false
              });
              yield waitUntilExit();
            }
          } finally {
            yield agentStore.dispose();
          }
          return agentId;
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          __disposeResources(env_1);
        }
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/