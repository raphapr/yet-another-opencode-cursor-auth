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