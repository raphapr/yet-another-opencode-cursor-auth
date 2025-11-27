/**
 * Converts a single agent conversation turn to a completed agent turn
 */
function loadAgentTurn(agentTurn, turnIndex) {
  var _a, _b;
  const userMessage = (_b = (_a = agentTurn.userMessage) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
  const steps = [];
  let currentToolCallGroup;
  // Process steps and group tool calls using merge logic
  for (let stepIndex = 0; stepIndex < agentTurn.steps.length; stepIndex++) {
    const step = agentTurn.steps[stepIndex];
    switch (step.message.case) {
      case "assistantMessage":
        // If we have a pending tool call group, add it as a step first
        if (currentToolCallGroup) {
          steps.push(currentToolCallGroup);
          currentToolCallGroup = undefined;
        }
        // Add text step
        steps.push({
          type: "text",
          content: step.message.value.text,
          completed: true
        });
        break;
      case "toolCall":
        {
          const newToolCall = {
            id: `loaded-${turnIndex}-${stepIndex}`,
            call: step.message.value,
            completed: true,
            aborted: false
          };
          // Try to merge into the current group, or create a new one
          if (currentToolCallGroup && canMergeToolCallIntoGroup(currentToolCallGroup, newToolCall)) {
            // Merge into existing group
            currentToolCallGroup.calls.push(newToolCall);
          } else {
            // Finalize the previous group if it exists
            if (currentToolCallGroup) {
              steps.push(currentToolCallGroup);
            }
            // Create new group
            currentToolCallGroup = {
              type: "tool-call-group",
              calls: [newToolCall]
            };
          }
          break;
        }
    }
  }
  // Add any remaining tool call group as final step
  if (currentToolCallGroup) {
    steps.push(currentToolCallGroup);
  }
  return {
    type: "agent",
    userMessage,
    steps
  };
}
/**
 * Converts a single shell conversation turn to a completed shell turn
 */
function loadShellTurn(shellTurn) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  return {
    type: "shell",
    shellCommand: (_b = (_a = shellTurn.shellCommand) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : "",
    stdout: (_d = (_c = shellTurn.shellOutput) === null || _c === void 0 ? void 0 : _c.stdout) !== null && _d !== void 0 ? _d : "",
    stderr: (_f = (_e = shellTurn.shellOutput) === null || _e === void 0 ? void 0 : _e.stderr) !== null && _f !== void 0 ? _f : "",
    exitCode: (_h = (_g = shellTurn.shellOutput) === null || _g === void 0 ? void 0 : _g.exitCode) !== null && _h !== void 0 ? _h : 0
  };
}
/**
 * Converts a single conversation turn to a completed UI turn
 */
function loadTurn(turn, turnIndex) {
  switch (turn.turn.case) {
    case "agentConversationTurn":
      return loadAgentTurn(turn.turn.value, turnIndex);
    case "shellConversationTurn":
      return loadShellTurn(turn.turn.value);
    default:
      throw new Error(`Unknown turn type: ${turn.turn.case}`);
  }
}
/**
 * Converts all conversation turns to completed UI turns
 */
function loadCompletedTurns(conversationState) {
  return conversationState.turns.map((turn, index) => loadTurn(turn, index));
}
/**
 * Creates initial UI conversation state with default values
 */
function createInitialUIConversationState() {
  return {
    summary: undefined,
    completedTurns: [],
    pendingTurn: undefined,
    summarizing: false,
    liveTokens: 0,
    rejectedPlan: false
  };
}
/**
 * Main loader function that converts ConversationState to UIConversationState
 */
function loadConversationState(conversationState) {
  var _a, _b;
  const initialState = createInitialUIConversationState();
  const completedTurns = loadCompletedTurns(conversationState);
  return Object.assign(Object.assign({}, initialState), {
    summary: (_b = (_a = conversationState.summary) === null || _a === void 0 ? void 0 : _a.summary) !== null && _b !== void 0 ? _b : undefined,
    completedTurns
  });
}
//# sourceMappingURL=loader.js.map