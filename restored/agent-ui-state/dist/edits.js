/**
 * Computes the latest edit index based on UIConversationState.
 * Similar to computeLatestEditIndex but works with UIConversationState instead of UITurn[].
 *
 * @param conversationState - The current UI conversation state
 * @param changedFiles - Array of file changes to find the index in
 * @param fallbackIndex - Fallback index to return if no edit is found (default: 0)
 * @returns The index of the latest edited file in changedFiles, or fallbackIndex if not found
 */
function computeLatestEditIndex(conversationState, changedFiles, fallbackIndex = 0) {
  var _a;
  let lastPath;
  // Helper function to check if a tool call is an edit tool call and extract the path
  const extractEditPath = toolCall => {
    var _a;
    const tool = toolCall.call.tool;
    if (tool.case === "editToolCall") {
      return (_a = tool.value.args) === null || _a === void 0 ? void 0 : _a.path;
    }
    return undefined;
  };
  // Helper function to search through tool call group for edit tool calls
  const searchToolCallGroup = group => {
    // Check calls in reverse order within the group
    for (let c = group.calls.length - 1; c >= 0; c--) {
      const path = extractEditPath(group.calls[c]);
      if (path) {
        return path;
      }
    }
    return undefined;
  };
  // Helper function to search through steps for edit tool calls
  const searchStepsForEditPath = steps => {
    for (let s = steps.length - 1; s >= 0; s--) {
      const step = steps[s];
      if (step.type === "tool-call-group") {
        const path = searchToolCallGroup(step);
        if (path) {
          return path;
        }
      }
    }
    return undefined;
  };
  // Helper function to search through pending state for edit tool calls
  const searchPendingState = pendingState => {
    if (pendingState.type === "tool-call-segment") {
      // Search through groups in reverse order
      for (let g = pendingState.groups.length - 1; g >= 0; g--) {
        const path = searchToolCallGroup(pendingState.groups[g]);
        if (path) {
          return path;
        }
      }
    }
    return undefined;
  };
  // First check pending turn (most recent activity)
  if (((_a = conversationState.pendingTurn) === null || _a === void 0 ? void 0 : _a.type) === "agent") {
    const pendingTurn = conversationState.pendingTurn;
    // Check pending state first (most recent)
    if (pendingTurn.pendingState) {
      const pathFromPending = searchPendingState(pendingTurn.pendingState);
      if (pathFromPending) {
        lastPath = pathFromPending;
      }
    }
    // If no path found in pending state, check completed steps in pending turn
    if (!lastPath) {
      const pathFromCompleted = searchStepsForEditPath(pendingTurn.completedSteps);
      if (pathFromCompleted) {
        lastPath = pathFromCompleted;
      }
    }
  }
  // If no path found in pending turn, search through completed turns (in reverse order)
  if (!lastPath) {
    for (let t = conversationState.completedTurns.length - 1; t >= 0; t--) {
      const turn = conversationState.completedTurns[t];
      if (turn.type === "shell") continue;
      const path = searchStepsForEditPath(turn.steps);
      if (path) {
        lastPath = path;
        break;
      }
    }
  }
  // Find the index of the last edited file in changedFiles
  const idx = lastPath ? changedFiles.findIndex(c => c.path === lastPath) : -1;
  return idx >= 0 ? idx : fallbackIndex;
}
//# sourceMappingURL=edits.js.map