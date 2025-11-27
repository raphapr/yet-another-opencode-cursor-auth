var connect_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var connect_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var connect_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
var connect_asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};
const agentStreamMetadata = (0, dist /* createKey */.cF)(Symbol("agentStreamMetadata"), undefined);
const getMessageTypeLabelForStallDetector = message => {
  var _a, _b;
  const parts = [];
  parts.push(message.message.case);
  switch (message.message.case) {
    case "conversationAction":
      parts.push(message.message.value.action.case);
      break;
    case "execClientMessage":
      parts.push(message.message.value.message.case);
      break;
    case "execClientControlMessage":
      parts.push(message.message.value.message.case);
      break;
    case "kvClientMessage":
      parts.push(message.message.value.message.case);
      break;
    case "interactionResponse":
      parts.push(message.message.value.result.case);
      break;
    case "interactionUpdate":
      parts.push(message.message.value.message.case);
      switch (message.message.value.message.case) {
        case "partialToolCall":
        case "toolCallCompleted":
        case "toolCallStarted":
          parts.push((_a = message.message.value.message.value.toolCall) === null || _a === void 0 ? void 0 : _a.tool.case);
          break;
        case "toolCallDelta":
          parts.push((_b = message.message.value.message.value.toolCallDelta) === null || _b === void 0 ? void 0 : _b.delta.case);
          break;
      }
      break;
    case "interactionQuery":
      parts.push(message.message.value.query.case);
      break;
    case "execServerMessage":
      parts.push(message.message.value.message.case);
      break;
    case "execServerControlMessage":
      parts.push(message.message.value.message.case);
      break;
  }
  return parts.filter(p => p !== undefined).join(":");
};
function splitStream(stream, detector) {
  const interactionStream = (0, async_iterable /* createWritableIterable */.Jt)();
  const execStream = (0, async_iterable /* createWritableIterable */.Jt)();
  const checkpointStream = (0, async_iterable /* createWritableIterable */.Jt)();
  const kvStream = (0, async_iterable /* createWritableIterable */.Jt)();
  function run() {
    return connect_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        try {
          for (var _d = true, stream_1 = connect_asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
            _c = stream_1_1.value;
            _d = false;
            const message = _c;
            // Filter out heartbeats - they should not reset the stall timer
            if (!(message.message.case === "interactionUpdate" && message.message.value.message.case === "heartbeat")) {
              // Reset stall detector on any meaningful inbound message
              detector.reset("inbound_message", getMessageTypeLabelForStallDetector(message));
            }
            if (message.message.case === "interactionUpdate" || message.message.case === "interactionQuery") {
              // Avoid unhandled rejections if the interaction stream was closed
              // (e.g., due to client-side abort/cleanup racing with server writes)
              interactionStream.write(message.message).catch(() => {});
            }
            if (message.message.case === "execServerMessage" || message.message.case === "execServerControlMessage") {
              yield execStream.write(message.message.value);
            }
            if (message.message.case === "conversationCheckpointUpdate") {
              yield checkpointStream.write(message.message.value);
            }
            if (message.message.case === "kvServerMessage") {
              yield kvStream.write(message.message.value);
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      } finally {
        interactionStream.close();
        execStream.close();
        checkpointStream.close();
        kvStream.close();
      }
    });
  }
  return {
    interactionStream,
    execStream,
    checkpointStream,
    kvStream,
    done: run()
  };
}
function handleShellStream(ctx, shellStream, interactionListener) {
  return connect_awaiter(this, void 0, void 0, function* () {
    var _a, shellStream_1, shellStream_1_1;
    var _b, e_2, _c, _d;
    try {
      for (_a = true, shellStream_1 = connect_asyncValues(shellStream); shellStream_1_1 = yield shellStream_1.next(), _b = shellStream_1_1.done, !_b; _a = true) {
        _d = shellStream_1_1.value;
        _a = false;
        const message = _d;
        switch (message.event.case) {
          case "stdout":
            yield interactionListener.sendUpdate(ctx, {
              type: "shell-output-delta",
              event: {
                case: "stdout",
                value: new shell_exec_pb /* ShellStreamStdout */.o0({
                  data: message.event.value.data
                })
              }
            });
            break;
          case "stderr":
            yield interactionListener.sendUpdate(ctx, {
              type: "shell-output-delta",
              event: {
                case: "stderr",
                value: new shell_exec_pb /* ShellStreamStderr */.Db({
                  data: message.event.value.data
                })
              }
            });
            break;
          case "exit":
            yield interactionListener.sendUpdate(ctx, {
              type: "shell-output-delta",
              event: {
                case: "exit",
                value: new shell_exec_pb /* ShellStreamExit */.vb({
                  code: message.event.value.code
                })
              }
            });
            break;
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (!_a && !_b && (_c = shellStream_1.return)) yield _c.call(shellStream_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  });
}
class AgentConnectClient {
  constructor(client) {
    this.client = client;
  }
  run(ctx, conversationState, action, modelDetails, interactionListener, resources, blobStore, conversationActionManager, checkpointHandler, mcpTools, options) {
    return connect_awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f;
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const runSpan = connect_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("AgentConnectClient.run")), false);
        ctx = runSpan.ctx;
        const requestId = (_a = options.generationUUID) !== null && _a !== void 0 ? _a : crypto.randomUUID();
        // Populate the context with agent stream metadata
        ctx = ctx.with(agentStreamMetadata, {
          requestId,
          modelDetails
        });
        // Create a soft cancel context that listens to the manager's signal
        const [softCancelCtx, softCancelCurrentRun] = ctx.withCancel();
        // When the manager's signal is aborted, cancel the soft cancel context
        if (!((_b = conversationActionManager.signal) === null || _b === void 0 ? void 0 : _b.aborted)) {
          (_c = conversationActionManager.signal) === null || _c === void 0 ? void 0 : _c.addEventListener("abort", () => softCancelCurrentRun(), {
            once: true
          });
        } else {
          softCancelCurrentRun();
        }
        if (ctx.canceled || softCancelCtx.canceled) {
          throw new UserAbortedRequestError();
        }
        try {
          const env_2 = {
            stack: [],
            error: void 0,
            hasError: false
          };
          try {
            const execManagerSpan = (0, dist /* createSpan */.VI)(ctx.withName("createControlledExecManager"));
            const controlledExecManager = agent_exec_dist /* SimpleControlledExecManager */.n6.fromResources(resources);
            execManagerSpan[Symbol.dispose]();
            // Create stall detector with automatic cleanup
            const stallDetector = connect_addDisposableResource(env_2, new StallDetector(ctx, 10000), false);
            const requestStream = (0, async_iterable /* createWritableIterable */.Jt)();
            // Wrap request stream to reset stall detector on writes
            const monitoredRequestStream = new utils_dist /* MapWritable */.F8(requestStream, msg => {
              stallDetector.reset("outbound_write", getMessageTypeLabelForStallDetector(msg));
              return msg;
            });
            // Convert McpToolDefinition to proto format
            const protoMcpTools = mcpTools.map(tool => ({
              name: tool.name,
              providerIdentifier: tool.providerIdentifier,
              toolName: tool.toolName,
              description: tool.description,
              inputSchema: tool.inputSchema ? struct_pb /* Value */.WT.fromJson(tool.inputSchema) : undefined
            }));
            const writeRequestSpan = (0, dist /* createSpan */.VI)(ctx.withName("writeInitialRequest"));
            const promise = monitoredRequestStream.write(new agent_service_pb /* AgentClientMessage */.KS({
              message: {
                case: "runRequest",
                value: new agent_pb /* AgentRunRequest */.Mp({
                  conversationState,
                  action,
                  modelDetails,
                  mcpTools: new mcp_pb /* McpTools */.Or({
                    mcpTools: protoMcpTools
                  }),
                  conversationId: options.conversationId,
                  mcpFileSystemOptions: options.mcpFileSystemOptions
                })
              }
            }));
            writeRequestSpan[Symbol.dispose]();
            // means the user cancelled in between processing the request
            if (softCancelCtx.canceled) {
              throw new UserAbortedRequestError();
            }
            const headers = Object.assign({
              "x-request-id": requestId
            }, (_d = options.headers) !== null && _d !== void 0 ? _d : {});
            const connectSpan = (0, dist /* createSpan */.VI)(ctx.withName("connectToBackend"));
            const response = this.client.run(ctx, requestStream, {
              signal: ctx.signal,
              headers
            });
            const {
              interactionStream,
              execStream,
              checkpointStream,
              kvStream,
              done
            } = splitStream(response, stallDetector);
            connectSpan[Symbol.dispose]();
            let interactionHandler;
            // Handle preemptive exec for shell commands with execId
            if (action.action.case === "shellCommandAction" && action.action.value.execId) {
              const shellAction = action.action.value;
              const shellArgs = new shell_exec_pb /* ShellArgs */.a({
                command: ((_e = shellAction.shellCommand) === null || _e === void 0 ? void 0 : _e.command) || "",
                parsingResult: new shell_exec_pb /* ShellCommandParsingResult */.HO()
              });
              const shellStreamExec = resources.get(agent_exec_dist /* shellStreamExecutorResource */.wv);
              const shellStream = shellStreamExec.execute(ctx, shellArgs, {
                execId: shellAction.execId
              });
              interactionHandler = {
                run: ctx => handleShellStream(ctx, shellStream, interactionListener)
              };
            } else {
              interactionHandler = new ClientInteractionController(interactionStream, interactionListener, new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => new agent_service_pb /* AgentClientMessage */.KS({
                message: {
                  case: "interactionResponse",
                  value: message
                }
              })));
            }
            yield promise;
            const execOutputStream = new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => {
              if (message instanceof exec_pb /* ExecClientMessage */.yT) {
                return new agent_service_pb /* AgentClientMessage */.KS({
                  message: {
                    case: "execClientMessage",
                    value: message
                  }
                });
              } else if (message instanceof exec_pb /* ExecClientControlMessage */.$Y) {
                return new agent_service_pb /* AgentClientMessage */.KS({
                  message: {
                    case: "execClientControlMessage",
                    value: message
                  }
                });
              }
              throw new Error("Unknown exec message");
            });
            const execHandler = new ClientExecController(execStream, execOutputStream, controlledExecManager);
            const kvHandler = new agent_kv_dist /* ControlledKvManager */.hC(kvStream, new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => new agent_service_pb /* AgentClientMessage */.KS({
              message: {
                case: "kvClientMessage",
                value: message
              }
            })), blobStore);
            const checkpointController = new CheckpointController(checkpointStream, checkpointHandler, ctx);
            let execResolve;
            let execReject;
            const execPromise = new Promise((resolve, reject) => {
              execResolve = resolve;
              execReject = reject;
            });
            const execResolvers = {
              promise: execPromise,
              resolve: execResolve,
              reject: execReject
            };
            // we force exit execResolvers in case any exec hangs, we want to make sure to exit out
            if (softCancelCtx.canceled) {
              execResolvers.resolve();
              interactionStream.close();
            } else {
              softCancelCtx.signal.addEventListener("abort", () => {
                execResolvers.resolve();
                interactionStream.close();
              }, {
                once: true
              });
            }
            // run it with the soft cancel so that on ctrl + c, the local execs are aborted
            execHandler.run(softCancelCtx).then(execResolvers.resolve).catch(execResolvers.reject);
            const allSettledPromise = Promise.allSettled([done.finally(() => {
              conversationActionManager.close();
              execOutputStream.close();
            }), execResolvers.promise, interactionHandler.run(ctx), checkpointController.run(), kvHandler.run(), conversationActionManager.run(new utils_dist /* MapWritable */.F8(monitoredRequestStream, message => new agent_service_pb /* AgentClientMessage */.KS({
              message: {
                case: "conversationAction",
                value: message
              }
            })))]);
            let overallResolve;
            let overallReject;
            const overallPromise = new Promise((resolve, reject) => {
              overallResolve = resolve;
              overallReject = reject;
            });
            const overallResolver = {
              promise: overallPromise,
              resolve: overallResolve,
              reject: overallReject
            };
            allSettledPromise.then(overallResolver.resolve).catch(overallResolver.reject);
            if (ctx.canceled) {
              overallResolver.reject(new UserAbortedRequestError());
            } else {
              ctx.signal.addEventListener("abort", () => overallResolver.reject(new UserAbortedRequestError()), {
                once: true
              });
            }
            const results = yield overallResolver.promise;
            const execResult = results[1];
            if (execResult.status === "rejected" && execResult.reason instanceof LostConnection && !softCancelCtx.canceled) {
              const latestConversationState = checkpointHandler.getLatestCheckpoint();
              if (!latestConversationState) {
                throw new Error("No latest conversation state found");
              }
              const resumeActionMessage = new agent_pb /* ConversationAction */.QF({
                action: {
                  case: "resumeAction",
                  value: new agent_pb /* ResumeAction */.qK()
                }
              });
              conversationActionManager.resetStream();
              // Dispose detector before recursive call to prevent multiple active detectors
              stallDetector[Symbol.dispose]();
              yield this.run(ctx, latestConversationState, resumeActionMessage, modelDetails, interactionListener, resources, blobStore, conversationActionManager, checkpointHandler, mcpTools, options);
            } else {
              // If the top-level stream (done) rejected with a ConnectError, capture details
              const doneResult = results[0];
              if (doneResult.status === "rejected") {
                throw doneResult.reason;
              }
              // After the agent loop completes successfully, check if there are unprocessed messages and resubmit
              if (conversationActionManager.hasUnprocessedMessages() && !softCancelCtx.canceled) {
                const unprocessedMessages = conversationActionManager.getUnprocessedUserMessages();
                const latestCheckpoint = checkpointHandler.getLatestCheckpoint();
                if (latestCheckpoint && unprocessedMessages.length > 0) {
                  const unprocessedMessage = unprocessedMessages[0];
                  conversationActionManager.markMessageAsProcessed(unprocessedMessage);
                  conversationActionManager.resetStream();
                  // Dispose detector before recursive call to prevent multiple active detectors
                  stallDetector[Symbol.dispose]();
                  yield this.run(ctx, latestCheckpoint, new agent_pb /* ConversationAction */.QF({
                    action: {
                      case: "userMessageAction",
                      value: new agent_pb /* UserMessageAction */.Vt({
                        userMessage: unprocessedMessage
                      })
                    }
                  }), modelDetails, interactionListener, resources, blobStore, conversationActionManager, checkpointHandler, mcpTools, options);
                }
              }
            }
          } catch (e_3) {
            env_2.error = e_3;
            env_2.hasError = true;
          } finally {
            connect_disposeResources(env_2);
          }
        } catch (error) {
          if (error instanceof connect_error /* ConnectError */.T) {
            const details = getErrorDetailFromConnectError(error);
            if (details && ((_f = details.details) === null || _f === void 0 ? void 0 : _f.detail) === "User aborted request") {
              throw new UserAbortedRequestError();
            }
          }
          throw error;
        }
      } catch (e_4) {
        env_1.error = e_4;
        env_1.hasError = true;
      } finally {
        connect_disposeResources(env_1);
      }
    });
  }
}