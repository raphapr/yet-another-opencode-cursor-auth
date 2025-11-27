// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  hg: () => (/* reexport */ControlledConversationActionManager),
  ym: () => (/* reexport */convertInteractionResponseToProto),
  RR: () => (/* reexport */convertProtoToInteractionQuery),
  yy: () => (/* reexport */convertProtoToInteractionUpdate)
});

// UNUSED EXPORTS: LogInteractionListener, NoopConversationActionReceiver, NoopInteractionListener, RemoteConversationActionManager, convertInteractionQueryToProto, convertInteractionUpdateToProto, convertProtoToInteractionResponse

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/agent_pb.js + 9 modules
var agent_pb = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var dist = __webpack_require__("../utils/dist/index.js");
; // ../agent-core/dist/conversation_actions/controlled.js
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
var __asyncValues = undefined && undefined.__asyncValues || function (o) {
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
class ControlledConversationActionManager {
  get signal() {
    return this.abortController.signal;
  }
  constructor() {
    this.abortCallbacks = [];
    this.abortController = new AbortController();
    this.unprocessedUserMessages = [];
    this.clientStream = (0, dist /* createWritableIterable */.Jt)();
  }
  addAbortCallback(callback) {
    this.abortCallbacks.push(callback);
  }
  abort() {
    return __awaiter(this, void 0, void 0, function* () {
      this.abortController.abort();
      for (const callback of this.abortCallbacks) {
        callback();
      }
      this.abortCallbacks.length = 0;
      this.submitConversationAction(new agent_pb /* ConversationAction */.QF({
        action: {
          case: "cancelAction",
          value: new agent_pb /* CancelAction */.TT({})
        }
      }));
    });
  }
  // Adds tracking if the action is a user message with message_id
  submitConversationAction(conversationAction) {
    return __awaiter(this, void 0, void 0, function* () {
      // Track user messages for potential resubmission
      if (conversationAction.action.case === "userMessageAction") {
        const userMessage = conversationAction.action.value.userMessage;
        if (userMessage) {
          this.unprocessedUserMessages.push(userMessage);
        }
      }
      yield this.clientStream.write(conversationAction);
    });
  }
  /**
   * Mark a user message as processed (acknowledged by backend).
   * Can be overridden by subclasses to add additional behavior.
   */
  markMessageAsProcessed(userMessage) {
    this.unprocessedUserMessages = this.unprocessedUserMessages.filter(msg => msg.messageId !== userMessage.messageId);
  }
  /**
   * Get all unprocessed user messages
   */
  getUnprocessedUserMessages() {
    return [...this.unprocessedUserMessages];
  }
  /**
   * Check if there are any unprocessed user messages
   */
  hasUnprocessedMessages() {
    return this.unprocessedUserMessages.length > 0;
  }
  close() {
    var _a;
    (_a = this.clientStream) === null || _a === void 0 ? void 0 : _a.close();
  }
  resetStream() {
    var _a;
    (_a = this.clientStream) === null || _a === void 0 ? void 0 : _a.close();
    this.clientStream = (0, dist /* createWritableIterable */.Jt)();
    this.abortController = new AbortController();
    for (const userMessage of this.unprocessedUserMessages) {
      void this.clientStream.write(new agent_pb /* ConversationAction */.QF({
        action: {
          case: "userMessageAction",
          value: new agent_pb /* UserMessageAction */.Vt({
            userMessage: userMessage
          })
        }
      }));
    }
  }
  run(outputStream) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        for (var _d = true, _e = __asyncValues(this.clientStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const action = _c;
          try {
            yield outputStream.write(action);
          } catch (error) {
            console.error("error", error);
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
  dispose() {}
}
; // ../agent-core/dist/conversation_actions/remote.js
var remote_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var remote_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
class NoopConversationActionReceiver {
  pop(_ctx) {
    return remote_awaiter(this, void 0, void 0, function* () {
      return undefined;
    });
  }
  peek(_ctx) {
    return remote_awaiter(this, void 0, void 0, function* () {
      return undefined;
    });
  }
}
class RemoteConversationActionManager {
  constructor(clientStream, cancel) {
    this.clientStream = clientStream;
    this.cancel = cancel;
    this.queue = [];
    this.startListening();
  }
  startListening() {
    return remote_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        try {
          for (var _d = true, _e = remote_asyncValues(this.clientStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const message = _c;
            yield this.handleClientMessage(message);
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      } catch (error) {
        console.error("Error in ConversationAction manager listener:", error);
      }
    });
  }
  handleClientMessage(message) {
    return remote_awaiter(this, void 0, void 0, function* () {
      if (message.action.case === "cancelAction") {
        // Abort: trip local controller; downstream execs are wired to respect abort signals
        this.queue.length = 0;
        this.cancel();
        return;
      }
      this.push(message);
    });
  }
  pop(_ctx) {
    return remote_awaiter(this, void 0, void 0, function* () {
      return this.queue.shift();
    });
  }
  peek(_ctx) {
    return remote_awaiter(this, void 0, void 0, function* () {
      return this.queue[0];
    });
  }
  push(message) {
    this.queue.push(message);
  }
}

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/exa_fetch_tool_pb.js
var exa_fetch_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/exa_fetch_tool_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/exa_search_tool_pb.js
var exa_search_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/exa_search_tool_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/switch_mode_tool_pb.js
var switch_mode_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/switch_mode_tool_pb.js");
// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/web_search_tool_pb.js
var web_search_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/web_search_tool_pb.js");
; // ../agent-core/dist/interaction-conversion.js

/**
 * Converts an InteractionUpdate to its corresponding protobuf representation
 */
function convertInteractionUpdateToProto(update) {
  switch (update.type) {
    case "text-delta":
      return new InteractionUpdateProto({
        message: {
          case: "textDelta",
          value: new TextDeltaUpdateProto({
            text: update.text
          })
        }
      });
    case "tool-call-started":
      return new InteractionUpdateProto({
        message: {
          case: "toolCallStarted",
          value: {
            callId: update.callId,
            toolCall: update.toolCall,
            modelCallId: update.modelCallId
          }
        }
      });
    case "tool-call-completed":
      return new InteractionUpdateProto({
        message: {
          case: "toolCallCompleted",
          value: {
            callId: update.callId,
            toolCall: update.toolCall,
            modelCallId: update.modelCallId
          }
        }
      });
    case "thinking-delta":
      return new InteractionUpdateProto({
        message: {
          case: "thinkingDelta",
          value: new ThinkingDeltaUpdateProto({
            text: update.text
          })
        }
      });
    case "thinking-completed":
      return new InteractionUpdateProto({
        message: {
          case: "thinkingCompleted",
          value: new ThinkingCompletedUpdateProto({
            thinkingDurationMs: update.thinkingDurationMs
          })
        }
      });
    case "user-message-appended":
      return new InteractionUpdateProto({
        message: {
          case: "userMessageAppended",
          value: new UserMessageAppendedUpdateProto({
            userMessage: update.userMessage
          })
        }
      });
    case "partial-tool-call":
      return new InteractionUpdateProto({
        message: {
          case: "partialToolCall",
          value: new PartialToolCallUpdateProto({
            callId: update.callId,
            toolCall: update.toolCall,
            modelCallId: update.modelCallId
          })
        }
      });
    case "token-delta":
      return new InteractionUpdateProto({
        message: {
          case: "tokenDelta",
          value: new TokenDeltaUpdateProto({
            tokens: update.tokens
          })
        }
      });
    case "summary":
      return new InteractionUpdateProto({
        message: {
          case: "summary",
          value: new SummaryUpdateProto({
            summary: update.summary
          })
        }
      });
    case "summary-started":
      return new InteractionUpdateProto({
        message: {
          case: "summaryStarted",
          value: new SummaryStartedUpdateProto()
        }
      });
    case "heartbeat":
      return new InteractionUpdateProto({
        message: {
          case: "heartbeat",
          value: new HeartbeatUpdateProto()
        }
      });
    case "summary-completed":
      return new InteractionUpdateProto({
        message: {
          case: "summaryCompleted",
          value: new SummaryCompletedUpdateProto()
        }
      });
    case "shell-output-delta":
      return new InteractionUpdateProto({
        message: {
          case: "shellOutputDelta",
          value: new ShellOutputDeltaUpdateProto({
            event: update.event
          })
        }
      });
    case "turn-ended":
      return new InteractionUpdateProto({
        message: {
          case: "turnEnded",
          value: new TurnEndedUpdateProto()
        }
      });
    case "tool-call-delta":
      return new InteractionUpdateProto({
        message: {
          case: "toolCallDelta",
          value: new ToolCallDeltaUpdate({
            callId: update.callId,
            toolCallDelta: update.toolCallDelta,
            modelCallId: update.modelCallId
          })
        }
      });
    case "step-started":
      return new InteractionUpdateProto({
        message: {
          case: "stepStarted",
          value: new StepStartedUpdateProto({
            stepId: BigInt(update.stepId)
          })
        }
      });
    default:
      {
        // TypeScript exhaustiveness check - this should never be reached
        const _exhaustiveCheck = update;
        throw new Error(`Unhandled update type: ${JSON.stringify(_exhaustiveCheck)}`);
      }
  }
}
/**
 * Converts a protobuf InteractionUpdate to its corresponding core representation
 */
function convertProtoToInteractionUpdate(update) {
  if (!update.message) {
    return null;
  }
  switch (update.message.case) {
    case "textDelta":
      return {
        type: "text-delta",
        text: update.message.value.text
      };
    case "toolCallStarted":
      if (!update.message.value.toolCall || !update.message.value.modelCallId) {
        return null;
      }
      return {
        type: "tool-call-started",
        callId: update.message.value.callId,
        toolCall: update.message.value.toolCall,
        modelCallId: update.message.value.modelCallId
      };
    case "toolCallCompleted":
      if (!update.message.value.toolCall || !update.message.value.modelCallId) {
        return null;
      }
      return {
        type: "tool-call-completed",
        callId: update.message.value.callId,
        toolCall: update.message.value.toolCall,
        modelCallId: update.message.value.modelCallId
      };
    case "thinkingDelta":
      return {
        type: "thinking-delta",
        text: update.message.value.text
      };
    case "thinkingCompleted":
      return {
        type: "thinking-completed",
        thinkingDurationMs: update.message.value.thinkingDurationMs
      };
    case "userMessageAppended":
      if (!update.message.value.userMessage) {
        return null;
      }
      return {
        type: "user-message-appended",
        userMessage: update.message.value.userMessage
      };
    case "partialToolCall":
      if (!update.message.value.toolCall || !update.message.value.modelCallId) {
        return null;
      }
      return {
        type: "partial-tool-call",
        callId: update.message.value.callId,
        toolCall: update.message.value.toolCall,
        modelCallId: update.message.value.modelCallId
      };
    case "tokenDelta":
      return {
        type: "token-delta",
        tokens: update.message.value.tokens
      };
    case "summary":
      return {
        type: "summary",
        summary: update.message.value.summary
      };
    case "summaryStarted":
      return {
        type: "summary-started"
      };
    case "heartbeat":
      return {
        type: "heartbeat"
      };
    case "summaryCompleted":
      return {
        type: "summary-completed"
      };
    case "shellOutputDelta":
      return {
        type: "shell-output-delta",
        event: update.message.value.event
      };
    case "turnEnded":
      return {
        type: "turn-ended"
      };
    case "toolCallDelta":
      if (!update.message.value.toolCallDelta || !update.message.value.callId || !update.message.value.modelCallId) {
        return null;
      }
      return {
        type: "tool-call-delta",
        callId: update.message.value.callId,
        toolCallDelta: update.message.value.toolCallDelta,
        modelCallId: update.message.value.modelCallId
      };
    case "stepStarted":
      return {
        type: "step-started",
        stepId: Number(update.message.value.stepId)
      };
    default:
      // Return null for unhandled update types instead of throwing
      return null;
  }
}
/**
 * Converts an InteractionQuery to its corresponding protobuf representation
 */
function convertInteractionQueryToProto(query, id) {
  switch (query.type) {
    case "web-search-request":
      return new InteractionQueryProto({
        id,
        query: {
          case: "webSearchRequestQuery",
          value: new WebSearchRequestQueryProto({
            args: query.args
          })
        }
      });
    case "ask-question-request":
      return new InteractionQueryProto({
        id,
        query: {
          case: "askQuestionInteractionQuery",
          value: new AskQuestionInteractionQueryProto({
            args: query.args,
            toolCallId: query.toolCallId
          })
        }
      });
    case "switch-mode-request":
      return new InteractionQueryProto({
        id,
        query: {
          case: "switchModeRequestQuery",
          value: new SwitchModeRequestQueryProto({
            args: query.args
          })
        }
      });
    case "exa-search-request":
      return new InteractionQueryProto({
        id,
        query: {
          case: "exaSearchRequestQuery",
          value: new ExaSearchRequestQueryProto({
            args: query.args
          })
        }
      });
    case "exa-fetch-request":
      return new InteractionQueryProto({
        id,
        query: {
          case: "exaFetchRequestQuery",
          value: new ExaFetchRequestQueryProto({
            args: query.args
          })
        }
      });
    default:
      {
        // TypeScript exhaustiveness check - this should never be reached
        const _exhaustiveCheck = query;
        throw new Error(`Unhandled interaction query type`);
      }
  }
}
/**
 * Converts a protobuf InteractionQuery to its corresponding core representation
 */
function convertProtoToInteractionQuery(proto) {
  if (!proto.query || proto.query.case === undefined) {
    throw new Error(`Failed to convert interaction query to core type: ${proto.id}`);
  }
  switch (proto.query.case) {
    case "webSearchRequestQuery":
      if (!proto.query.value.args) {
        throw new Error(`Failed to convert interaction query to core type: ${proto.id}`);
      }
      return {
        type: "web-search-request",
        args: proto.query.value.args
      };
    case "askQuestionInteractionQuery":
      if (!proto.query.value.args || !proto.query.value.toolCallId) {
        throw new Error(`Failed to convert interaction query to core type: ${proto.id}`);
      }
      return {
        type: "ask-question-request",
        args: proto.query.value.args,
        toolCallId: proto.query.value.toolCallId
      };
    case "switchModeRequestQuery":
      if (!proto.query.value.args) {
        throw new Error(`Failed to convert interaction query to core type: ${proto.id}`);
      }
      return {
        type: "switch-mode-request",
        args: proto.query.value.args,
        toolCallId: proto.query.value.args.toolCallId
      };
    case "exaSearchRequestQuery":
      if (!proto.query.value.args) {
        throw new Error(`Failed to convert interaction query to core type: ${proto.id}`);
      }
      return {
        type: "exa-search-request",
        args: proto.query.value.args
      };
    case "exaFetchRequestQuery":
      if (!proto.query.value.args) {
        throw new Error(`Failed to convert interaction query to core type: ${proto.id}`);
      }
      return {
        type: "exa-fetch-request",
        args: proto.query.value.args
      };
    default:
      {
        const _exhaustiveCheck = proto.query;
        throw new Error(`Unhandled interaction query type: ${JSON.stringify(_exhaustiveCheck)}`);
      }
  }
}
/**
 * Converts an InteractionResponse to its corresponding protobuf representation
 */
function convertInteractionResponseToProto(response, id, queryType) {
  var _a;
  const queryTypeForCheck = queryType;
  switch (queryTypeForCheck) {
    case "web-search-request":
      {
        const webSearchResponse = response;
        let resultValue;
        if (webSearchResponse.approved) {
          resultValue = {
            case: "approved",
            value: new web_search_tool_pb /* WebSearchRequestResponse_Approved */.XJ()
          };
        } else {
          resultValue = {
            case: "rejected",
            value: new web_search_tool_pb /* WebSearchRequestResponse_Rejected */.yc({
              reason: webSearchResponse.reason
            })
          };
        }
        return new agent_pb /* InteractionResponse */.Y5({
          id,
          result: {
            case: "webSearchRequestResponse",
            value: new web_search_tool_pb /* WebSearchRequestResponse */.lI({
              result: resultValue
            })
          }
        });
      }
    case "ask-question-request":
      {
        const askQuestionResponse = response;
        return new agent_pb /* InteractionResponse */.Y5({
          id,
          result: {
            case: "askQuestionInteractionResponse",
            value: new agent_pb /* AskQuestionInteractionResponse */.zT({
              result: askQuestionResponse.result
            })
          }
        });
      }
    case "switch-mode-request":
      {
        const switchModeResponse = response;
        if (switchModeResponse.approved) {
          return new agent_pb /* InteractionResponse */.Y5({
            id,
            result: {
              case: "switchModeRequestResponse",
              value: new switch_mode_tool_pb /* SwitchModeRequestResponse */.w$({
                result: {
                  case: "approved",
                  value: {}
                }
              })
            }
          });
        } else {
          return new agent_pb /* InteractionResponse */.Y5({
            id,
            result: {
              case: "switchModeRequestResponse",
              value: new switch_mode_tool_pb /* SwitchModeRequestResponse */.w$({
                result: {
                  case: "rejected",
                  value: {
                    reason: switchModeResponse.approved === false ? (_a = switchModeResponse.reason) !== null && _a !== void 0 ? _a : "" : ""
                  }
                }
              })
            }
          });
        }
      }
    case "exa-search-request":
      {
        const exaSearchResponse = response;
        let resultValue;
        if (exaSearchResponse.approved) {
          resultValue = {
            case: "approved",
            value: new exa_search_tool_pb /* ExaSearchRequestResponse_Approved */.jK()
          };
        } else {
          resultValue = {
            case: "rejected",
            value: new exa_search_tool_pb /* ExaSearchRequestResponse_Rejected */.o_({
              reason: exaSearchResponse.reason
            })
          };
        }
        return new agent_pb /* InteractionResponse */.Y5({
          id,
          result: {
            case: "exaSearchRequestResponse",
            value: new exa_search_tool_pb /* ExaSearchRequestResponse */.lH({
              result: resultValue
            })
          }
        });
      }
    case "exa-fetch-request":
      {
        const exaFetchResponse = response;
        let resultValue;
        if (exaFetchResponse.approved) {
          resultValue = {
            case: "approved",
            value: new exa_fetch_tool_pb /* ExaFetchRequestResponse_Approved */.N2()
          };
        } else {
          resultValue = {
            case: "rejected",
            value: new exa_fetch_tool_pb /* ExaFetchRequestResponse_Rejected */._C({
              reason: exaFetchResponse.reason
            })
          };
        }
        return new agent_pb /* InteractionResponse */.Y5({
          id,
          result: {
            case: "exaFetchRequestResponse",
            value: new exa_fetch_tool_pb /* ExaFetchRequestResponse */.JA({
              result: resultValue
            })
          }
        });
      }
    default:
      {
        const _exhaustiveCheck = queryTypeForCheck;
        throw new Error(`Unhandled interaction query response type: ${String(queryType)}`);
      }
  }
}
/**
 * Converts a protobuf InteractionResponse to its corresponding core representation
 */
function convertProtoToInteractionResponse(proto) {
  if (!proto.result || proto.result.case === undefined) {
    throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
  }
  switch (proto.result.case) {
    case "webSearchRequestResponse":
      {
        const webSearchResponse = proto.result.value;
        if (!webSearchResponse.result) {
          throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
        }
        if (webSearchResponse.result.case === "approved") {
          return {
            approved: true
          };
        } else if (webSearchResponse.result.case === "rejected") {
          return {
            approved: false,
            reason: webSearchResponse.result.value.reason
          };
        }
        throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
      }
    case "askQuestionInteractionResponse":
      {
        const askQuestionResponse = proto.result.value;
        if (!askQuestionResponse.result) {
          throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
        }
        return {
          result: askQuestionResponse.result
        };
      }
    case "switchModeRequestResponse":
      {
        const switchModeResponse = proto.result.value;
        if (!switchModeResponse.result) {
          throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
        }
        if (switchModeResponse.result.case === "approved") {
          return {
            approved: true
          };
        } else if (switchModeResponse.result.case === "rejected") {
          return {
            approved: false,
            reason: switchModeResponse.result.value.reason
          };
        }
        throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
      }
    case "exaSearchRequestResponse":
      {
        const exaSearchResponse = proto.result.value;
        if (!exaSearchResponse.result) {
          throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
        }
        if (exaSearchResponse.result.case === "approved") {
          return {
            approved: true
          };
        } else if (exaSearchResponse.result.case === "rejected") {
          return {
            approved: false,
            reason: exaSearchResponse.result.value.reason
          };
        }
        throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
      }
    case "exaFetchRequestResponse":
      {
        const exaFetchResponse = proto.result.value;
        if (!exaFetchResponse.result) {
          throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
        }
        if (exaFetchResponse.result.case === "approved") {
          return {
            approved: true
          };
        } else if (exaFetchResponse.result.case === "rejected") {
          return {
            approved: false,
            reason: exaFetchResponse.result.value.reason
          };
        }
        throw new Error(`Failed to convert interaction response to core type: ${proto.id}`);
      }
    default:
      {
        const _exhaustiveCheck = proto.result;
        throw new Error(`Unhandled interaction query response type: ${String(_exhaustiveCheck)}`);
      }
  }
}

// EXTERNAL MODULE: ../proto/dist/generated/agent/v1/ask_question_tool_pb.js
var ask_question_tool_pb = __webpack_require__("../proto/dist/generated/agent/v1/ask_question_tool_pb.js");
; // ../agent-core/dist/interaction-listener.js
var interaction_listener_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class NoopInteractionListener {
  sendUpdate(_ctx, _update) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      // No-op: ignore all interaction updates
    });
  }
  query(_ctx, query) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      switch (query.type) {
        case "web-search-request":
          return {
            approved: true
          };
        case "ask-question-request":
          // Auto-reject with empty answers for CLI fallback
          return {
            result: new AskQuestionResultProto({
              result: {
                case: "rejected",
                value: new AskQuestionRejected({
                  reason: "Questions skipped by user (CLI fallback)"
                })
              }
            })
          };
        case "switch-mode-request":
          // Auto-reject mode switches for CLI fallback
          return {
            approved: false,
            reason: "Mode switching not supported in CLI"
          };
        case "exa-search-request":
          return {
            approved: true
          };
        case "exa-fetch-request":
          return {
            approved: true
          };
        default:
          {
            const _exhaustiveCheck = query;
            throw new Error(`Unhandled interaction query type`);
          }
      }
    });
  }
}
class LogInteractionListener {
  constructor() {
    this.lastCharWasNewline = true;
    this.inThinking = false;
    this.inSummary = false;
  }
  writeStdout(text) {
    process.stdout.write(text);
    if (text.length > 0) {
      this.lastCharWasNewline = text[text.length - 1] === "\n";
    }
  }
  ensureNewline() {
    if (!this.lastCharWasNewline) {
      this.writeStdout("\n");
    }
  }
  logLine(message) {
    this.ensureNewline();
    console.log(message);
    this.lastCharWasNewline = true;
  }
  sendUpdate(_ctx, update) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      switch (update.type) {
        case "text-delta":
          // Ensure separation from any previous non-text streams
          if (this.inThinking || this.inSummary) {
            this.ensureNewline();
            this.inThinking = false;
            // Keep summary open but separate text nicely
            if (this.inSummary) {
              this.logLine("────────────────────────");
              this.inSummary = false;
            }
          }
          this.writeStdout(update.text);
          break;
        case "tool-call-started":
          {
            const toolCase = (_a = update.toolCall.tool.case) !== null && _a !== void 0 ? _a : "unknown";
            this.logLine(`🛠️  Tool call started: ${update.callId} (${toolCase})`);
          }
          break;
        case "tool-call-completed":
          {
            const toolCase = (_b = update.toolCall.tool.case) !== null && _b !== void 0 ? _b : "unknown";
            this.logLine(`✅ Tool call completed: ${update.callId} (${toolCase})`);
          }
          break;
        case "partial-tool-call":
          {
            const toolCase = (_c = update.toolCall.tool.case) !== null && _c !== void 0 ? _c : "unknown";
            this.logLine(`🧩 Tool call update: ${update.callId} (${toolCase})`);
          }
          break;
        case "thinking-delta":
          if (!this.inThinking) {
            this.ensureNewline();
            this.writeStdout("🧠 Thinking: ");
            this.inThinking = true;
          }
          this.writeStdout(update.text);
          break;
        case "thinking-completed":
          if (this.inThinking && !this.lastCharWasNewline) {
            this.writeStdout("\n");
          }
          this.inThinking = false;
          this.logLine("🧠 Thinking completed");
          break;
        case "summary":
          {
            if (!this.inSummary) {
              this.ensureNewline();
              this.logLine("──────────────── Summary ────────────────");
              this.inSummary = true;
            }
            // Print the summary body (ensure it ends with a newline)
            const body = update.summary.endsWith("\n") ? update.summary : `${update.summary}\n`;
            this.writeStdout(body);
            break;
          }
        case "summary-started":
          this.ensureNewline();
          this.logLine("──────────────── Summary ────────────────");
          this.inSummary = true;
          break;
        case "summary-completed":
          if (!this.lastCharWasNewline) {
            this.writeStdout("\n");
          }
          this.logLine("─────────────────────────────────────────");
          this.inSummary = false;
          break;
        case "step-started":
          this.logLine(`🪜 Step started: ${update.stepId}`);
          break;
      }
    });
  }
  query(_ctx, query) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      switch (query.type) {
        case "web-search-request":
          this.logLine("🔎 Web search requested");
          this.logLine(`Search term: ${query.args.searchTerm}`);
          return {
            approved: true
          };
        case "ask-question-request":
          this.logLine("❓ Ask question requested");
          this.logLine(`Tool call ID: ${query.toolCallId}`);
          if (query.args.title) {
            this.logLine(`Title: ${query.args.title}`);
          }
          for (const question of query.args.questions) {
            this.logLine(`Question ${question.id}: ${question.prompt}`);
          }
          // Auto-reject for CLI logging
          return {
            result: new AskQuestionResultProto({
              result: {
                case: "rejected",
                value: new AskQuestionRejected({
                  reason: "Questions skipped by user (CLI fallback)"
                })
              }
            })
          };
        case "switch-mode-request":
          this.logLine("🔄 Switch mode requested");
          this.logLine(`Tool call ID: ${query.toolCallId}`);
          this.logLine(`Target mode: ${query.args.targetModeId}`);
          if (query.args.explanation) {
            this.logLine(`Explanation: ${query.args.explanation}`);
          }
          // Auto-reject for CLI logging
          return {
            approved: false,
            reason: "Mode switching not supported in CLI"
          };
        case "exa-search-request":
          this.logLine("🔎 Exa search requested");
          this.logLine(`Query: ${query.args.query}`);
          return {
            approved: true
          };
        case "exa-fetch-request":
          this.logLine("📥 Exa fetch requested");
          this.logLine(`IDs: ${query.args.ids.join(", ")}`);
          return {
            approved: true
          };
        default:
          {
            const _exhaustiveCheck = query;
            throw new Error(`Unhandled query type`);
          }
      }
    });
  }
}
; // ../agent-core/dist/index.js

/***/