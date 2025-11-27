function renderCompletedStep(key, step, isLastTurn) {
  if (step.type === "text") {
    return [{
      type: "agent-text",
      text: step.content,
      key
    }];
  } else if (step.type === "plan") {
    return [{
      type: "plan",
      call: step.tool,
      decisionIndex: step.status === "accepted" ? 0 : 1,
      key
    }];
  } else {
    return [{
      type: "agent-tool-calls",
      calls: step.calls,
      key,
      isLastTurn
    }];
  }
}
function renderCompletedTurn(key, turn, isLastTurn) {
  if (turn.type === "agent") {
    return [{
      type: "user-message",
      message: turn.userMessage,
      key
    }, ...turn.steps.flatMap(step => {
      return renderCompletedStep(key, step, isLastTurn);
    })];
  }
  if (turn.type === "shell") {
    return [{
      type: "shell-turn",
      command: turn.shellCommand,
      key,
      stdout: turn.stdout,
      stderr: turn.stderr,
      exitCode: turn.exitCode
    }];
  }
  return [];
}
function renderAgentPendingState(key, state) {
  if (state.type === "text") {
    return [{
      type: "agent-text",
      text: state.content,
      completed: state.completed,
      key
    }];
  }
  if (state.type === "plan") {
    return [{
      type: "plan",
      call: state.tool,
      decisionIndex: state.status === "accepted" ? 0 : 1,
      key
    }];
  }
  return state.groups.flatMap((group, index) => {
    return {
      type: "agent-tool-calls",
      calls: group.calls,
      isLastStepOfTurn: true,
      key: `${key}-pending-state-${index}`,
      isLastTurn: true // Pending states are always part of the last turn
    };
  });
}
function renderPendingAgentTurn(key, turn) {
  var _a;
  if (turn.pendingState === undefined && turn.completedSteps.length === 0) {
    return {
      static: [],
      dynamic: [{
        type: "user-message",
        message: turn.userMessage,
        key: `${key}-user-message`
      }]
    };
  }
  if (((_a = turn.pendingState) === null || _a === void 0 ? void 0 : _a.type) === "text" && turn.completedSteps.length === 0) {
    return {
      static: [],
      dynamic: [{
        type: "user-message",
        message: turn.userMessage,
        key: `${key}-user-message`
      }, ...(turn.pendingState !== undefined ? renderAgentPendingState(key, turn.pendingState) : [])]
    };
  }
  return {
    static: [{
      type: "user-message",
      message: turn.userMessage,
      key: `${key}-user-message`
    }, ...turn.completedSteps.flatMap(step => {
      return renderCompletedStep(key, step, true); // Pending turns are always the last turn
    })],
    dynamic: turn.pendingState !== undefined ? renderAgentPendingState(key, turn.pendingState) : []
  };
}
function renderPendingShellTurn(key, turn) {
  return {
    static: [],
    dynamic: [{
      type: "shell-turn",
      command: turn.shellCommand,
      key: `${key}-shell-turn`,
      stdout: turn.stdout,
      stderr: turn.stderr,
      exitCode: turn.exitCode
    }]
  };
}
function renderPendingTurn(key, turn) {
  if (turn.type === "agent") {
    return renderPendingAgentTurn(key, turn);
  }
  if (turn.type === "shell") {
    return renderPendingShellTurn(key, turn);
  }
  return {
    static: [],
    dynamic: []
  };
}
function partitionConversationState(conversationState, debugInfo, headerProps) {
  var _a, _b;
  const staticItems = [{
    type: "header",
    key: "header",
    isRepository: (_a = headerProps === null || headerProps === void 0 ? void 0 : headerProps.isRepository) !== null && _a !== void 0 ? _a : false,
    folderMode: (_b = headerProps === null || headerProps === void 0 ? void 0 : headerProps.folderMode) !== null && _b !== void 0 ? _b : "cwd"
  }];
  if (debugInfo) {
    staticItems.push({
      type: "debug-info",
      serverUrl: debugInfo.serverUrl,
      key: "debug-info"
    });
  }
  if (conversationState.summary) {
    staticItems.push({
      type: "summary",
      summary: conversationState.summary,
      key: "summary"
    });
  }
  const dynamicItems = [];
  let index = 0;
  for (const turn of conversationState.completedTurns) {
    // A completed turn is the last turn only if there's no pending turn and it's the last completed turn
    const isLastTurn = !conversationState.pendingTurn && index === conversationState.completedTurns.length - 1;
    staticItems.push(...renderCompletedTurn(`turn-${index}`, turn, isLastTurn));
    index++;
  }
  if (conversationState.pendingTurn) {
    const {
      static: pendingStatic,
      dynamic: pendingDynamic
    } = renderPendingTurn(`turn-${index}`, conversationState.pendingTurn);
    staticItems.push(...pendingStatic);
    dynamicItems.push(...pendingDynamic);
  }
  return {
    staticItems,
    dynamicItems
  };
}
//# sourceMappingURL=static.js.map