function completePendingAgentTurnState(pendingState) {
  if (pendingState === undefined) {
    return [];
  }
  if (pendingState.type === "text") {
    return [{
      type: "text",
      content: pendingState.content,
      completed: true
    }];
  }
  if (pendingState.type === "plan") {
    return [{
      type: "plan",
      tool: pendingState.tool,
      status: pendingState.status
    }];
  }
  if (pendingState.type === "tool-call-segment") {
    return pendingState.groups;
  }
  return [];
}
function mergeAgentTurnToolCallCompleted(prevAgentTurn, update) {
  var _a;
  if (update.toolCall.tool.case === "createPlanToolCall") {
    return Object.assign({}, prevAgentTurn);
  }
  switch ((_a = prevAgentTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) {
    case "tool-call-segment":
      return Object.assign(Object.assign({}, prevAgentTurn), {
        pendingState: mergeSegmentToolCallCompletedUpdate(prevAgentTurn.pendingState, update)
      });
    default:
      throw new MergeError("No pending state");
  }
}
function mergeAgentTurnToolCallStarted(prevAgentTurn, update) {
  var _a;
  if (update.toolCall.tool.case === "createPlanToolCall") {
    return Object.assign(Object.assign({}, prevAgentTurn), {
      pendingState: {
        type: "plan",
        tool: update.toolCall,
        status: "accepted"
      }
    });
  }
  switch ((_a = prevAgentTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) {
    case "tool-call-segment":
      return Object.assign(Object.assign({}, prevAgentTurn), {
        pendingState: mergeSegmentStartToolCallUpdate(prevAgentTurn.pendingState, update)
      });
    case "text":
    case "plan":
    case undefined:
      return Object.assign(Object.assign({}, prevAgentTurn), {
        completedSteps: [...prevAgentTurn.completedSteps, ...completePendingAgentTurnState(prevAgentTurn.pendingState)],
        pendingState: createToolCallSegmentFromStartToolCallUpdate(update)
      });
  }
}
function mergeAgentTurnTextDelta(prevAgentTurn, update) {
  var _a;
  switch ((_a = prevAgentTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) {
    case "text":
      return Object.assign(Object.assign({}, prevAgentTurn), {
        pendingState: {
          type: "text",
          content: prevAgentTurn.pendingState.content + update.text,
          completed: false
        }
      });
    case "plan":
      return Object.assign({}, prevAgentTurn);
    case "tool-call-segment":
    case undefined:
      return Object.assign(Object.assign({}, prevAgentTurn), {
        completedSteps: [...prevAgentTurn.completedSteps, ...completePendingAgentTurnState(prevAgentTurn.pendingState)],
        pendingState: {
          type: "text",
          content: update.text,
          completed: false
        }
      });
  }
  return prevAgentTurn;
}
function createNewPendingAgentTurn(userMessage) {
  return {
    type: "agent",
    userMessage: userMessage,
    completedSteps: [],
    pendingState: undefined,
    thinkingContent: undefined
  };
}
function mergeAgentTurnToolCallDelta(prevAgentTurn, update) {
  var _a;
  switch ((_a = prevAgentTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) {
    case "tool-call-segment":
      return Object.assign(Object.assign({}, prevAgentTurn), {
        pendingState: mergeSegmentToolCallDeltaUpdate(prevAgentTurn.pendingState, update)
      });
    default:
      // Ignore deltas if we're not in a tool-call-segment state
      return prevAgentTurn;
  }
}
function abortAgentTurn(agentTurn) {
  var _a;
  if (((_a = agentTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) === "tool-call-segment") {
    return Object.assign(Object.assign({}, agentTurn), {
      pendingState: abortSegmentToolCall(agentTurn.pendingState)
    });
  }
  return agentTurn;
}
//# sourceMappingURL=agent.js.map