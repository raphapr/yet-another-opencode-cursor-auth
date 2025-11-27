/**
 * Truncates the UIConversationState to keep only the last n completed turns.
 * If there's a pending turn, it's preserved.
 *
 * @param state - The current conversation state
 * @param maxTurns - Maximum number of completed turns to keep
 * @returns Truncated conversation state
 */
function truncateUIConversationState(state, maxTurns) {
  if (maxTurns < 0) {
    throw new Error("maxTurns must be non-negative");
  }
  if (maxTurns === 0) {
    return Object.assign(Object.assign({}, state), {
      completedTurns: [],
      pendingTurn: undefined
    });
  }
  if (maxTurns > state.completedTurns.length + (state.pendingTurn ? 1 : 0)) {
    return state;
  }
  const truncatedCompletedTurns = state.completedTurns.slice(-maxTurns);
  return Object.assign(Object.assign({}, state), {
    completedTurns: truncatedCompletedTurns,
    pendingTurn: undefined
  });
}
//# sourceMappingURL=truncate.js.map