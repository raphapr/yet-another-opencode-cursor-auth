__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
      /* harmony export */runChat: () => (/* binding */runChat)
      /* harmony export */
    });
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../cursor-config/dist/index.js");
    /* harmony import */
    var _anysphere_shell_exec__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../shell-exec/dist/index.js");
    /* harmony import */
    var _analytics_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/analytics.ts");
    /* harmony import */
    var _api_key_auth_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/api-key-auth.ts");
    /* harmony import */
    var _client_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/client.ts");
    /* harmony import */
    var _console_io_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/console-io.ts");
    /* harmony import */
    var _execution_mode_approval_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/execution-mode/approval.tsx");
    /* harmony import */
    var _mcp_approval_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/mcp/approval.tsx");
    /* harmony import */
    var _onboarding_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/onboarding.tsx");
    /* harmony import */
    var _run_agent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/run-agent.tsx");
    /* harmony import */
    var _tracing_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/tracing.ts");
    /* harmony import */
    var _utils_api_endpoint_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/utils/api-endpoint.ts");
    /* harmony import */
    var _utils_output_format_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/utils/output-format.ts");
    /* harmony import */
    var _workspace_approval_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/workspace/approval.tsx");
    /* harmony import */
    var _resume_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/commands/resume.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_execution_mode_approval_js__WEBPACK_IMPORTED_MODULE_7__, _mcp_approval_js__WEBPACK_IMPORTED_MODULE_8__, _onboarding_js__WEBPACK_IMPORTED_MODULE_9__, _run_agent_js__WEBPACK_IMPORTED_MODULE_10__, _workspace_approval_js__WEBPACK_IMPORTED_MODULE_12__, _resume_js__WEBPACK_IMPORTED_MODULE_13__]);
    [_execution_mode_approval_js__WEBPACK_IMPORTED_MODULE_7__, _mcp_approval_js__WEBPACK_IMPORTED_MODULE_8__, _onboarding_js__WEBPACK_IMPORTED_MODULE_9__, _run_agent_js__WEBPACK_IMPORTED_MODULE_10__, _workspace_approval_js__WEBPACK_IMPORTED_MODULE_12__, _resume_js__WEBPACK_IMPORTED_MODULE_13__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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

    /**
     * Parse curl-style headers from CLI arguments.
     * Accepts headers in the format "Header-Name: Header-Value"
     * Can be a single string or an array of strings.
     */
    function parseHeaders(headerOption) {
      if (!headerOption) {
        return undefined;
      }
      const headers = {};
      const headerArray = Array.isArray(headerOption) ? headerOption : [headerOption];
      for (const header of headerArray) {
        const colonIndex = header.indexOf(":");
        if (colonIndex === -1) {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, `Error: Invalid header format "${header}". Expected format: "Header-Name: Header-Value"`);
        }
        const name = header.substring(0, colonIndex).trim();
        const value = header.substring(colonIndex + 1).trim();
        if (!name) {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, `Error: Invalid header format "${header}". Header name cannot be empty.`);
        }
        headers[name] = value;
      }
      return Object.keys(headers).length > 0 ? headers : undefined;
    }
    function runChat(ctx_1, promptArgs_1, options_1, _a) {
      return __awaiter(this, arguments, void 0, function* (ctx, promptArgs, options, {
        rgPath,
        diagnosticsProvider,
        codebaseReferenceProvider,
        configProvider,
        credentialManager
      }) {
        var _b, _c, _d;
        yield (0, _tracing_js__WEBPACK_IMPORTED_MODULE_11__ /* .initTracing */.H)({
          backendUrl: (0, _utils_api_endpoint_js__WEBPACK_IMPORTED_MODULE_15__ /* .getApiEndpoint */.G6)(options.endpoint),
          credentialManager,
          configProvider
        });
        const backendUrl = (0, _utils_api_endpoint_js__WEBPACK_IMPORTED_MODULE_15__ /* .getApiEndpoint */.G6)(options.endpoint);
        // Initialize analytics.
        try {
          (0, _client_js__WEBPACK_IMPORTED_MODULE_6__ /* .initAnalytics */.Bu)(credentialManager, {
            endpoint: backendUrl,
            insecure: options.insecure
          });
        } catch (_f) {
          // don't block anything on analytics init errors
        }
        const printEnvRequested = options.printenv === true;
        let resumeChatId;
        let resumeBackgroundId;
        if (options.resume !== false) {
          if (options.resume === true) {
            const backgroundClient = (0, _client_js__WEBPACK_IMPORTED_MODULE_6__ /* .createBackgroundComposerClient */.c3)(credentialManager, backendUrl, configProvider);
            const selection = yield (0, _resume_js__WEBPACK_IMPORTED_MODULE_13__ /* .handleResume */.oh)(backgroundClient);
            if (!selection) {
              process.exit(0);
            }
            if (selection.kind === "chat") {
              resumeChatId = selection.id;
            } else if (selection.kind === "background") {
              resumeBackgroundId = selection.id;
            }
          } else if (typeof options.resume === "string") {
            // Support --resume=-n where n is a positive integer (1 = latest)
            const m = options.resume.match(/^-(\d+)$/);
            if (m) {
              const nRaw = Number(m[1]);
              const n = Number.isFinite(nRaw) && nRaw > 0 ? nRaw : 1;
              const id = yield (0, _resume_js__WEBPACK_IMPORTED_MODULE_13__ /* .getNthRecentChatId */.xT)(n);
              if (!id) {
                (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "No previous chats found.");
              }
              resumeChatId = id || undefined;
            } else if (options.resume === "-1") {
              // Back-compat: treat -1 as latest
              const latestChat = yield (0, _resume_js__WEBPACK_IMPORTED_MODULE_13__ /* .getLatestChatId */.$0)();
              if (!latestChat) {
                (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "No previous chats found.");
              }
              resumeChatId = latestChat;
            } else {
              resumeChatId = options.resume;
            }
          }
        }
        // Detect redirected stdin/stdout early to determine if we're in headless mode
        const stdinIsPiped = !process.stdin.isTTY;
        const stdoutIsTTY = Boolean(process.stdout.isTTY);
        // Determine if we should run in print mode (auto when redirected)
        // Note: Commander sets boolean options to false by default, which would
        // make `??` pick false even when stdin is piped. We want piping or
        // non-TTY stdout to force print mode regardless of the default value.
        const inferredPrint = options.print === true || !stdoutIsTTY || stdinIsPiped;
        if (printEnvRequested && !inferredPrint) {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "Error: --printenv can only be used with --print/headless mode");
        }
        // If the user provided an auth token, use it directly
        const {
          isAuthenticated: isAuthTokenAuthenticated,
          usingAuthTokenFromEnv
        } = yield (0, _api_key_auth_js__WEBPACK_IMPORTED_MODULE_5__ /* .tryAuthTokenAuth */.D)(credentialManager, {
          authToken: options.authToken
        });
        // If the user provided an API key or has an env var, we will exit and show the user a warning if it cannot be used.
        const {
          isAuthenticated: isApiKeyAuthenticated,
          usingApiKeyFromEnv
        } = isAuthTokenAuthenticated ? {
          isAuthenticated: false,
          usingApiKeyFromEnv: false
        } : yield (0, _api_key_auth_js__WEBPACK_IMPORTED_MODULE_5__ /* .tryApiKeyAuth */.T)(credentialManager, {
          apiKey: options.apiKey,
          endpoint: backendUrl
        });
        const isAuthenticated = isAuthTokenAuthenticated || isApiKeyAuthenticated || (yield (0, _onboarding_js__WEBPACK_IMPORTED_MODULE_9__ /* .checkAuthenticationStatus */.h4)(credentialManager, _onboarding_js__WEBPACK_IMPORTED_MODULE_9__ /* .AuthType */.hT.LOGIN));
        if (!isAuthenticated) {
          // In headless mode, exit immediately with a clear error instead of prompting
          if (inferredPrint) {
            (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "Error: Authentication required. Please run 'cursor-agent login' first, or set CURSOR_API_KEY environment variable.");
          }
          // In interactive mode, run onboarding flow
          const dashboardClient = (0, _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ /* .createDashboardClient */.Vi)({
            credentialManager,
            endpoint: backendUrl,
            configProvider
          });
          const onboardingSuccess = yield (0, _onboarding_js__WEBPACK_IMPORTED_MODULE_9__ /* .runOnboarding */.f4)(credentialManager, configProvider, dashboardClient);
          if (!onboardingSuccess) {
            (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "Authentication required to use Cursor Agent. Please run 'cursor-agent login' to authenticate.");
          }
        }
        // Prefer stdin when piped; fall back to args
        let prompt = promptArgs.join(" ");
        if (stdinIsPiped) {
          const stdinData = yield new Promise(resolve => {
            let buf = "";
            try {
              process.stdin.setEncoding("utf8");
            } catch (_a) {
              /* ignore */
            }
            process.stdin.on("data", chunk => {
              buf += String(chunk);
            });
            process.stdin.on("end", () => resolve(buf));
            process.stdin.on("error", () => resolve(buf));
          });
          const fromStdin = stdinData.trim();
          if (fromStdin.length > 0) {
            prompt = fromStdin;
          }
        }
        if (options.toolGallery) {
          const {
            runToolGallery
          } = yield __webpack_require__.e(/* import() */9722).then(__webpack_require__.bind(__webpack_require__, "./src/tool-gallery.tsx"));
          yield runToolGallery();
          return;
        }
        if (options.ianDev) {
          const {
            runIanDev
          } = yield __webpack_require__.e(/* import() */3743).then(__webpack_require__.bind(__webpack_require__, "./src/ian-dev.tsx"));
          if (options.debug) {
            const {
              initDebug
            } = yield Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, "./src/debug.ts"));
            yield initDebug();
          }
          yield runIanDev();
          return;
        }
        if (options.markdownTest) {
          const {
            runMarkdownTest
          } = yield __webpack_require__.e(/* import() */6309).then(__webpack_require__.bind(__webpack_require__, "./src/markdown-test.tsx"));
          yield runMarkdownTest();
          return;
        }
        if (options.colorGallery) {
          const {
            runColorGallery
          } = yield __webpack_require__.e(/* import() */6549).then(__webpack_require__.bind(__webpack_require__, "./src/color-gallery.tsx"));
          yield runColorGallery();
          return;
        }
        // Determine apiKeySource for stream init message
        const apiKeySource = usingApiKeyFromEnv || usingAuthTokenFromEnv // pragma: allowlist secret
        ? "env" : options.apiKey || options.authToken ? "flag" : "login";
        // Validate that --output-format is only used with --print
        // Note: text is the default, so we only error if user explicitly set a different format
        const isExplicitOutputFormat = process.argv.some(arg => arg.startsWith("--output-format"));
        if (isExplicitOutputFormat && !inferredPrint) {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "Error: --output-format can only be used with --print");
        }
        // Validate that --stream-partial-output is only used with --print and stream-json
        const isExplicitStreamPartialOutput = process.argv.some(arg => arg.startsWith("--stream-partial-output"));
        if (isExplicitStreamPartialOutput && !inferredPrint) {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "Error: --stream-partial-output can only be used with --print");
        }
        // Validate output format eagerly so invalid flags fail fast
        let validatedOutputFormat;
        try {
          validatedOutputFormat = inferredPrint ? (0, _utils_output_format_js__WEBPACK_IMPORTED_MODULE_16__ /* .validateOutputFormat */.nt)(options.outputFormat) : undefined;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, msg);
        }
        // Validate that --stream-partial-output is only used with stream-json format
        if (options.streamPartialOutput && validatedOutputFormat !== "stream-json") {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, "Error: --stream-partial-output requires --output-format stream-json");
        }
        // Track run mode/flags for analytics
        try {
          (0, _analytics_js__WEBPACK_IMPORTED_MODULE_4__ /* .trackEvent */.sx)("cli.run.mode", {
            headless: inferredPrint || !stdoutIsTTY || stdinIsPiped,
            print_flag: options.print === true,
            output_text: validatedOutputFormat === "text",
            output_json: validatedOutputFormat === "json",
            output_stream_json: validatedOutputFormat === "stream-json",
            stream_partial_output: options.streamPartialOutput === true,
            api_key_env: usingApiKeyFromEnv
          });
        } catch (_g) {}
        if (!inferredPrint) {
          // Resolve workspace path if provided
          const workspacePath = options.workspace ? (0, node_path__WEBPACK_IMPORTED_MODULE_1__.resolve)(options.workspace) : process.cwd();
          // Has the user trusted this workspace (or a parent that is not too close to root)?
          const workspaceApprovalResult = yield (0, _workspace_approval_js__WEBPACK_IMPORTED_MODULE_12__ /* .runWorkspaceApproval */.c)(workspacePath);
          if (workspaceApprovalResult === "quit") {
            process.exit(0);
          }
          // Has the user trusted all MCPs that are used in this workspace?
          // If we've just approved the workspace, it means we've already confirmed MCPs
          if (workspaceApprovalResult === "already_approved") {
            const mcpApprovalResult = yield (0, _mcp_approval_js__WEBPACK_IMPORTED_MODULE_8__ /* .runMcpApproval */.Ny)(workspacePath);
            if (mcpApprovalResult === "quit") {
              process.exit(0);
            }
          }
          // Check execution mode configuration
          const shouldQuit = yield (0, _execution_mode_approval_js__WEBPACK_IMPORTED_MODULE_7__ /* .runExecutionModeApproval */.K)(configProvider);
          if (shouldQuit) {
            // User quit during execution mode approval
            process.exit(0);
          }
          // Show TUI banner if sandbox configured but unsupported on this OS
          const cfg = configProvider.get();
          const sandboxMode = (_c = (_b = cfg.sandbox) === null || _b === void 0 ? void 0 : _b.mode) !== null && _c !== void 0 ? _c : "disabled";
          if (sandboxMode === "enabled") {
            const supported = _anysphere_shell_exec__WEBPACK_IMPORTED_MODULE_3__ /* .SandboxInternal.isSandboxSupported */.pe.isSandboxSupported();
            if (!supported) {
              process.env.AGENT_CLI_SESSION_WARNING_SANDBOX_UNSUPPORTED = "1";
            }
          }
        }
        yield (0, _run_agent_js__WEBPACK_IMPORTED_MODULE_10__ /* .runAgent */.J)(ctx, prompt, {
          backendUrl,
          endpoint: options.endpoint,
          insecure: (_d = options.insecure) !== null && _d !== void 0 ? _d : false,
          print: inferredPrint,
          outputFormat: validatedOutputFormat,
          streamPartialOutput: options.streamPartialOutput,
          debug: Boolean(options.debug),
          withDiffs: Boolean(options.withDiffs),
          resumeChatId,
          resumeBcId: resumeBackgroundId,
          rgPath,
          configProvider,
          diagnosticsProvider,
          codebaseReferenceProvider,
          model: options.model,
          usingApiKeyFromEnv,
          apiKeySource,
          isBrowserUseEnabled: Boolean(options.browser),
          force: Boolean(options.force),
          approveMcps: inferredPrint && Boolean(options.approveMcps),
          mode: options.cloud || options.background ? "background" : options.mode,
          workspace: options.workspace,
          headers: parseHeaders(options.header),
          systemPromptPathEnvVar: (() => {
            const p = options.systemPrompt;
            if (typeof p === "string" && p.trim().length > 0) {
              const abs = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.resolve)(p);
              if (!(0, node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(abs)) {
                (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, `Error: --system-prompt file not found: ${abs}`);
              }
              try {
                // Quick sanity check read; actual content is read in transport
                const content = (0, node_fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync)(abs, "utf8");
                if (!content || content.trim().length === 0) {
                  (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, `Error: --system-prompt file is empty: ${abs}`);
                }
              } catch (_e) {
                (0, _console_io_js__WEBPACK_IMPORTED_MODULE_14__ /* .exitWithMessage */.uQ)(1, `Error: failed to read --system-prompt file: ${abs}`);
              }
              return abs;
            }
            return undefined;
          })(),
          printEnv: printEnvRequested
        }, credentialManager);
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/