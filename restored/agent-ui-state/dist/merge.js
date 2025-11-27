function mergeTextDeltaUpdate(prevState, update) {
  if (!prevState.pendingTurn) {
    throw new MergeError("No pending turn");
  }
  if (prevState.pendingTurn.type !== "agent") {
    throw new MergeError("Pending turn is not an agent turn");
  }
  return Object.assign(Object.assign({}, prevState), {
    pendingTurn: mergeAgentTurnTextDelta(prevState.pendingTurn, update)
  });
}
function mergeToolCallStartedUpdate(prevState, update) {
  if (!prevState.pendingTurn) {
    throw new MergeError("No pending turn");
  }
  if (prevState.pendingTurn.type !== "agent") {
    throw new MergeError("Pending turn is not an agent turn");
  }
  return Object.assign(Object.assign({}, prevState), {
    pendingTurn: mergeAgentTurnToolCallStarted(prevState.pendingTurn, update)
  });
}
function mergeToolCallCompletedUpdate(prevState, update) {
  if (!prevState.pendingTurn) {
    throw new MergeError("No pending turn");
  }
  if (prevState.pendingTurn.type !== "agent") {
    throw new MergeError("Pending turn is not an agent turn");
  }
  if (update.toolCall.tool.case === "createPlanToolCall") {
    return Object.assign(Object.assign({}, prevState), {
      pendingTurn: Object.assign(Object.assign({}, prevState.pendingTurn), {
        pendingState: {
          type: "plan",
          tool: update.toolCall,
          status: "accepted"
        }
      })
    });
  }
  return Object.assign(Object.assign({}, prevState), {
    pendingTurn: mergeAgentTurnToolCallCompleted(prevState.pendingTurn, update)
  });
}
function mergeUserMessageAppendedUpdate(prevState, update) {
  if (!prevState.pendingTurn) {
    throw new MergeError("No pending turn");
  }
  if (prevState.pendingTurn.type !== "agent") {
    throw new MergeError("Pending turn is not an agent turn");
  }
  const newTurn = createNewPendingAgentTurn(update.userMessage.text);
  return Object.assign(Object.assign({}, prevState), {
    completedTurns: [...prevState.completedTurns, completeTurn(prevState.pendingTurn)],
    pendingTurn: newTurn,
    liveTokens: 0
  });
}
function completeTurn(turn) {
  if (turn.type === "agent") {
    return {
      type: "agent",
      userMessage: turn.userMessage,
      steps: [...turn.completedSteps, ...completePendingAgentTurnState(turn.pendingState)]
    };
  }
  if (turn.type === "shell") {
    return {
      type: "shell",
      shellCommand: turn.shellCommand,
      stdout: turn.stdout,
      stderr: turn.stderr,
      exitCode: turn.exitCode
    };
  }
  throw new MergeError("Turn is not an agent turn");
}
function mergeAgentTurnThinkingDelta(prevAgentTurn, update) {
  var _a;
  return Object.assign(Object.assign({}, prevAgentTurn), {
    thinkingContent: ((_a = prevAgentTurn.thinkingContent) !== null && _a !== void 0 ? _a : "") + update.text
  });
}
function mergeThinkingDeltaUpdate(prevState, update) {
  if (!prevState.pendingTurn) {
    throw new MergeError("No pending turn");
  }
  if (prevState.pendingTurn.type !== "agent") {
    throw new MergeError("Pending turn is not an agent turn");
  }
  return Object.assign(Object.assign({}, prevState), {
    pendingTurn: mergeAgentTurnThinkingDelta(prevState.pendingTurn, update)
  });
}
function mergeAgentTurnThinkingCompleted(prevAgentTurn, _update) {
  return Object.assign(Object.assign({}, prevAgentTurn), {
    thinkingContent: ""
  });
}
function mergeThinkingCompletedUpdate(prevState, update) {
  if (!prevState.pendingTurn) {
    throw new MergeError("No pending turn");
  }
  if (prevState.pendingTurn.type !== "agent") {
    throw new MergeError("Pending turn is not an agent turn");
  }
  return Object.assign(Object.assign({}, prevState), {
    pendingTurn: mergeAgentTurnThinkingCompleted(prevState.pendingTurn, update)
  });
}
function mergeShellOutputDeltaUpdate(prevState, update) {
  if (!prevState.pendingTurn) {
    throw new MergeError("No pending turn");
  }
  if (prevState.pendingTurn.type !== "shell") {
    throw new MergeError("Pending turn is not a shell turn");
  }
  return Object.assign(Object.assign({}, prevState), {
    pendingTurn: mergeShellOutputDelta(prevState.pendingTurn, update)
  });
}
function mergeInteractionUpdate(prevState, update) {
  if (update.type === "summary") {
    return {
      summary: update.summary,
      completedTurns: [],
      pendingTurn: undefined,
      summarizing: false,
      liveTokens: 0,
      rejectedPlan: false
    };
  }
  if (update.type === "summary-started") {
    return Object.assign(Object.assign({}, prevState), {
      summarizing: true
    });
  }
  if (update.type === "summary-completed") {
    return Object.assign(Object.assign({}, prevState), {
      summarizing: false
    });
  }
  if (update.type === "token-delta") {
    return Object.assign(Object.assign({}, prevState), {
      liveTokens: prevState.liveTokens + update.tokens
    });
  }
  if (update.type === "text-delta") {
    return mergeTextDeltaUpdate(prevState, update);
  }
  if (update.type === "tool-call-started") {
    return mergeToolCallStartedUpdate(prevState, update);
  }
  if (update.type === "tool-call-completed") {
    return mergeToolCallCompletedUpdate(prevState, update);
  }
  if (update.type === "tool-call-delta") {
    if (!prevState.pendingTurn) {
      throw new MergeError("No pending turn");
    }
    if (prevState.pendingTurn.type !== "agent") {
      throw new MergeError("Pending turn is not an agent turn");
    }
    // Merge streaming deltas (e.g., shell stdout/stderr) into the tool call
    return Object.assign(Object.assign({}, prevState), {
      pendingTurn: mergeAgentTurnToolCallDelta(prevState.pendingTurn, update)
    });
  }
  if (update.type === "user-message-appended") {
    return mergeUserMessageAppendedUpdate(prevState, update);
  }
  if (update.type === "thinking-delta") {
    return mergeThinkingDeltaUpdate(prevState, update);
  }
  if (update.type === "thinking-completed") {
    return mergeThinkingCompletedUpdate(prevState, update);
  }
  if (update.type === "shell-output-delta") {
    return mergeShellOutputDeltaUpdate(prevState, update);
  }
  return prevState;
}
function mergeTurnCompletion(prevState) {
  var _a;
  const pendingTurn = prevState.pendingTurn;
  if ((pendingTurn === null || pendingTurn === void 0 ? void 0 : pendingTurn.type) === "agent") {
    if (((_a = pendingTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) === "plan") {
      return prevState;
    }
  }
  return Object.assign(Object.assign({}, prevState), {
    completedTurns: [...prevState.completedTurns, ...(prevState.pendingTurn ? [completeTurn(prevState.pendingTurn)] : [])],
    pendingTurn: undefined
  });
}
function mergeCreateNewAgentTurn(prevState, userMessage) {
  return Object.assign(Object.assign({}, prevState), {
    completedTurns: [...prevState.completedTurns, ...(prevState.pendingTurn ? [completeTurn(prevState.pendingTurn)] : [])],
    pendingTurn: createNewPendingAgentTurn(userMessage),
    liveTokens: 0,
    rejectedPlan: false
  });
}
function mergeCreateNewShellTurn(prevState, shellCommand) {
  return Object.assign(Object.assign({}, prevState), {
    completedTurns: [...prevState.completedTurns, ...(prevState.pendingTurn ? [completeTurn(prevState.pendingTurn)] : [])],
    pendingTurn: createNewPendingShellTurn(shellCommand),
    liveTokens: 0,
    rejectedPlan: false
  });
}
function mergeSummarizeStartedUpdate(prevState) {
  return Object.assign(Object.assign({}, prevState), {
    summarizing: true
  });
}
function mergeSummarizeCompletedUpdate(prevState) {
  return Object.assign(Object.assign({}, prevState), {
    summarizing: false
  });
}
function abortConversationState(prevState) {
  if (!prevState.pendingTurn) {
    return prevState;
  }
  if (prevState.pendingTurn.type === "agent") {
    return Object.assign(Object.assign({}, prevState), {
      pendingTurn: abortAgentTurn(prevState.pendingTurn),
      liveTokens: 0
    });
  }
  if (prevState.pendingTurn.type === "shell") {
    return Object.assign(Object.assign({}, prevState), {
      pendingTurn: abortShellTurn(prevState.pendingTurn),
      liveTokens: 0
    });
  }
  return prevState;
}
function createNewConversationState() {
  return {
    completedTurns: [],
    pendingTurn: undefined,
    liveTokens: 0,
    summarizing: false,
    summary: undefined,
    rejectedPlan: false
  };
}
//# sourceMappingURL=merge.js.map