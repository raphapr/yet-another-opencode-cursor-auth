/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */t: () => (/* binding */runHeadless)
  /* harmony export */
});
/* harmony import */
var _anysphere_agent_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../agent-core/dist/index.js");
/* harmony import */
var _anysphere_agent_exec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../agent-exec/dist/index.js");
/* harmony import */
var _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
/* harmony import */
var _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../proto/dist/generated/agent/v1/selected_context_pb.js");
/* harmony import */
var _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../proto/dist/generated/agent/v1/shell_exec_pb.js");
/* harmony import */
var _console_io_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/console-io.ts");
/* harmony import */
var _state_session_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/state/session.ts");
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
const PRINTENV_COMMAND = "printenv";
const PRINTENV_TIMEOUT_MS = 5000;
let hasLoggedPrintEnvError = false;
function isShellToolCall(toolCall) {
  return toolCall.tool.case === "shellToolCall";
}
function formatProcessEnv() {
  return Object.entries(process.env).map(([key, value]) => `${key}=${value !== null && value !== void 0 ? value : ""}`).join("\n");
}
function createPrintenvArgs() {
  return new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .ShellArgs */.a({
    command: PRINTENV_COMMAND,
    timeout: PRINTENV_TIMEOUT_MS,
    simpleCommands: [PRINTENV_COMMAND],
    skipApproval: true,
    parsingResult: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .ShellCommandParsingResult */.HO({
      parsingFailed: false,
      executableCommands: [new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .ShellCommandParsingResult_ExecutableCommand */.Pv({
        name: PRINTENV_COMMAND,
        args: [],
        fullText: PRINTENV_COMMAND
      })],
      hasRedirects: false,
      hasCommandSubstitution: false
    })
  });
}
function describeShellResult(result) {
  var _a;
  const caseName = result.result.case;
  if (!caseName) {
    return "unknown shell result";
  }
  switch (caseName) {
    case "failure":
      {
        const {
          exitCode,
          stderr
        } = result.result.value;
        const detail = stderr === null || stderr === void 0 ? void 0 : stderr.split("\n").find(Boolean);
        return `exit code ${exitCode}${detail ? ` (${detail.substring(0, 200)})` : ""}`;
      }
    case "timeout":
      return `timeout after ${result.result.value.timeoutMs}ms`;
    case "rejected":
      return `rejected: ${(_a = result.result.value.reason) !== null && _a !== void 0 ? _a : "unknown reason"}`;
    case "spawnError":
      return `spawn error: ${result.result.value.error}`;
    case "permissionDenied":
      return `permission denied: ${result.result.value.error}`;
    default:
      return caseName;
  }
}
function captureEnvironmentSnapshot(ctx, resources) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    try {
      const shellExecutor = resources.get(_anysphere_agent_exec__WEBPACK_IMPORTED_MODULE_1__ /* .shellExecutorResource */.qk);
      if (!shellExecutor) {
        throw new Error("shell executor unavailable");
      }
      const result = yield shellExecutor.execute(ctx, createPrintenvArgs());
      if (result.result.case === "success") {
        return (_a = result.result.value.stdout) !== null && _a !== void 0 ? _a : "";
      }
      if (result.result.case === "failure") {
        const stdout = result.result.value.stdout;
        if (stdout && stdout.length > 0) {
          return stdout;
        }
      }
      throw new Error(describeShellResult(result));
    } catch (error) {
      if (!hasLoggedPrintEnvError) {
        const reason = error instanceof Error ? error.message : String(error);
        (0, _console_io_js__WEBPACK_IMPORTED_MODULE_6__ /* .intentionallyWriteToStderr */.p2)(`Warning: Failed to capture environment snapshot; falling back to process.env snapshot (${reason})`);
        hasLoggedPrintEnvError = true;
      }
      return formatProcessEnv();
    }
  });
}
function runHeadless(ctx, prompt, modelManager, agentClient, resources, agentStore, forceApprove, opts) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    if (!prompt.trim()) {
      (0, _console_io_js__WEBPACK_IMPORTED_MODULE_6__ /* .exitWithMessage */.uQ)(1, "Error: No prompt provided for print mode");
    }
    const abortController = new AbortController();
    const handleSigint = () => {
      (0, _console_io_js__WEBPACK_IMPORTED_MODULE_6__ /* .intentionallyWriteToStderr */.p2)("\nAborting operation...");
      abortController.abort();
    };
    process.on("SIGINT", handleSigint);
    const startedAt = Date.now();
    const isStreamPartialOutput = opts.streamPartialOutput === true;
    const isStreamJson = opts.outputFormat === "stream-json";
    const isJson = opts.outputFormat === "json";
    const isText = opts.outputFormat === "text";
    const shouldCaptureEnv = opts.captureEnv === true;
    let aggregatedText = "";
    let currentMessageText = "";
    let currentStreamJsonMessageText = "";
    const interactionListener = {
      sendUpdate(_ctx, update) {
        return __awaiter(this, void 0, void 0, function* () {
          switch (update.type) {
            case "text-delta":
              {
                aggregatedText += update.text;
                currentMessageText += update.text;
                currentStreamJsonMessageText += update.text;
                if (isStreamPartialOutput) {
                  const obj = {
                    type: "assistant",
                    message: {
                      role: "assistant",
                      content: [{
                        type: "text",
                        text: update.text
                      }]
                    },
                    session_id: opts.sessionId,
                    timestamp_ms: Date.now()
                  };
                  process.stdout.write(`${JSON.stringify(obj)}\n`);
                }
                break;
              }
            case "tool-call-started":
              {
                // For stream-json, output the accumulated message text before tool call
                if (isStreamJson && currentStreamJsonMessageText) {
                  const obj = {
                    type: "assistant",
                    message: {
                      role: "assistant",
                      content: [{
                        type: "text",
                        text: currentStreamJsonMessageText
                      }]
                    },
                    session_id: opts.sessionId,
                    model_call_id: update.modelCallId,
                    timestamp_ms: Date.now()
                  };
                  process.stdout.write(`${JSON.stringify(obj)}\n`);
                  currentStreamJsonMessageText = "";
                }
                // Reset current message text when a tool call starts (new message segment begins after tool)
                currentMessageText = "";
                if (isStreamJson || isStreamPartialOutput) {
                  const obj = {
                    type: "tool_call",
                    subtype: "started",
                    call_id: update.callId,
                    tool_call: update.toolCall,
                    model_call_id: update.modelCallId,
                    session_id: opts.sessionId,
                    timestamp_ms: Date.now()
                  };
                  process.stdout.write(`${JSON.stringify(obj)}\n`);
                }
                break;
              }
            case "tool-call-completed":
              {
                const shouldAttachEnv = shouldCaptureEnv && (isStreamJson || isStreamPartialOutput) && isShellToolCall(update.toolCall);
                const envSnapshot = shouldAttachEnv ? yield captureEnvironmentSnapshot(ctx, resources) : undefined;
                if (isStreamJson || isStreamPartialOutput) {
                  const obj = Object.assign({
                    type: "tool_call",
                    subtype: "completed",
                    call_id: update.callId,
                    tool_call: update.toolCall,
                    model_call_id: update.modelCallId,
                    session_id: opts.sessionId,
                    timestamp_ms: Date.now()
                  }, envSnapshot !== undefined ? {
                    env: envSnapshot
                  } : {});
                  process.stdout.write(`${JSON.stringify(obj)}\n`);
                }
                break;
              }
            case "thinking-delta":
              {
                // Emit thinking deltas in stream-json and stream-partial-output modes
                if (isStreamJson || isStreamPartialOutput) {
                  const obj = {
                    type: "thinking",
                    subtype: "delta",
                    text: update.text,
                    session_id: opts.sessionId,
                    timestamp_ms: Date.now()
                  };
                  process.stdout.write(`${JSON.stringify(obj)}\n`);
                }
                break;
              }
            case "thinking-completed":
              {
                // Emit thinking completion marker
                if (isStreamJson || isStreamPartialOutput) {
                  const obj = {
                    type: "thinking",
                    subtype: "completed",
                    session_id: opts.sessionId,
                    timestamp_ms: Date.now()
                  };
                  process.stdout.write(`${JSON.stringify(obj)}\n`);
                }
                break;
              }
          }
        });
      },
      query(_ctx, query) {
        return __awaiter(this, void 0, void 0, function* () {
          switch (query.type) {
            case "web-search-request":
              if (forceApprove) {
                return {
                  approved: true
                };
              }
              return {
                approved: false,
                reason: "User Rejected"
              };
            default:
              {
                // All other query types are not supported
                const _exhaustiveCheck = query.type;
                throw new Error(`Unhandled interaction query type: ${query.type}`);
              }
          }
        });
      }
    };
    try {
      const currentModel = yield modelManager.awaitCurrentModel();
      if (isStreamJson || isStreamPartialOutput) {
        const init = {
          type: "system",
          subtype: "init",
          apiKeySource: (_a = opts.apiKeySource) !== null && _a !== void 0 ? _a : "login",
          // pragma: allowlist secret
          cwd: process.cwd(),
          session_id: opts.sessionId,
          // tools: [], // TODO: add tools
          // mcp_servers: [], // TODO: add mcp servers
          model: currentModel.displayName,
          permissionMode: "default"
        };
        process.stdout.write(`${JSON.stringify(init)}\n`);
        const userMsg = {
          type: "user",
          message: {
            role: "user",
            content: [{
              type: "text",
              text: prompt
            }]
          },
          session_id: opts.sessionId
        };
        process.stdout.write(`${JSON.stringify(userMsg)}\n`);
      }
      const selectedCtx = new _anysphere_proto_agent_v1_selected_context_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .SelectedContext */.xv();
      const action = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .UserMessageAction */.Vt({
        userMessage: new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .UserMessage */.RG({
          text: prompt,
          selectedContext: selectedCtx,
          messageId: crypto.randomUUID()
        })
      });
      // Create the conversation action manager
      const conversationActionManager = new _anysphere_agent_core__WEBPACK_IMPORTED_MODULE_0__ /* .ControlledConversationActionManager */.hg();
      yield agentClient.run(ctx, agentStore.getConversationStateStructure(), new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .ConversationAction */.QF({
        action: {
          case: "userMessageAction",
          value: action
        }
      }), currentModel, interactionListener, resources, agentStore.getBlobStore(), conversationActionManager, agentStore, [],
      // Empty - tools are now provided via request context
      {
        conversationId: agentStore.getId(),
        headers: opts.headers
      });
      // Capture the last request id generated for the main agent run (if available)
      const requestId = _state_session_js__WEBPACK_IMPORTED_MODULE_5__ /* .session */.d.getLastRequestId();
      const durationMs = Date.now() - startedAt;
      if (isJson) {
        const result = Object.assign({
          type: "result",
          subtype: "success",
          is_error: false,
          duration_ms: durationMs,
          duration_api_ms: durationMs,
          result: aggregatedText || "",
          session_id: opts.sessionId
        }, requestId ? {
          request_id: requestId
        } : {});
        process.stdout.write(`${JSON.stringify(result)}\n`);
      } else if (isStreamJson) {
        // Output any remaining accumulated message text before the final result
        if (currentStreamJsonMessageText) {
          const obj = {
            type: "assistant",
            message: {
              role: "assistant",
              content: [{
                type: "text",
                text: currentStreamJsonMessageText
              }]
            },
            session_id: opts.sessionId
          };
          process.stdout.write(`${JSON.stringify(obj)}\n`);
        }
        const final = Object.assign({
          type: "result",
          subtype: "success",
          duration_ms: durationMs,
          duration_api_ms: durationMs,
          is_error: false,
          result: aggregatedText || "",
          session_id: opts.sessionId
        }, requestId ? {
          request_id: requestId
        } : {});
        process.stdout.write(`${JSON.stringify(final)}\n`);
      } else if (isStreamPartialOutput) {
        const final = Object.assign({
          type: "result",
          subtype: "success",
          duration_ms: durationMs,
          duration_api_ms: durationMs,
          is_error: false,
          result: aggregatedText || "",
          session_id: opts.sessionId
        }, requestId ? {
          request_id: requestId
        } : {});
        process.stdout.write(`${JSON.stringify(final)}\n`);
      } else if (isText) {
        // For text format, only output the final message (after last tool call)
        process.stdout.write(`${currentMessageText || ""}\n`);
      }
      // Added to solve hanging issue where process doesn't exit after runHeadless is done. Particularly reproducible when running cursor headless first time after installation
      process.exit(0);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        (0, _console_io_js__WEBPACK_IMPORTED_MODULE_6__ /* .exitWithMessage */.uQ)(130, "Operation cancelled");
      } else {
        (0, _console_io_js__WEBPACK_IMPORTED_MODULE_6__ /* .exitWithMessage */.uQ)(1, String(error));
      }
    } finally {
      process.off("SIGINT", handleSigint);
    }
  });
}

/***/