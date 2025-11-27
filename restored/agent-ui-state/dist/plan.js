function isSuggestingPlan(state) {
  var _a;
  const pendingTurn = state.pendingTurn;
  if ((pendingTurn === null || pendingTurn === void 0 ? void 0 : pendingTurn.type) === "agent") {
    return ((_a = pendingTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) === "plan";
  }
  return false;
}
function getPlanDecisionIndex(state) {
  var _a;
  const pendingTurn = state.pendingTurn;
  if ((pendingTurn === null || pendingTurn === void 0 ? void 0 : pendingTurn.type) === "agent") {
    if (((_a = pendingTurn.pendingState) === null || _a === void 0 ? void 0 : _a.type) === "plan") {
      return pendingTurn.pendingState.status === "accepted" ? 0 : 1;
    }
  }
  return 0;
}
function mergePlanDecisionIndexChange(prevState, decisionIndex) {
  var _a, _b;
  if (((_a = prevState.pendingTurn) === null || _a === void 0 ? void 0 : _a.type) === "agent") {
    if (((_b = prevState.pendingTurn.pendingState) === null || _b === void 0 ? void 0 : _b.type) === "plan") {
      return Object.assign(Object.assign({}, prevState), {
        pendingTurn: Object.assign(Object.assign({}, prevState.pendingTurn), {
          pendingState: Object.assign(Object.assign({}, prevState.pendingTurn.pendingState), {
            status: decisionIndex === 0 ? "accepted" : "rejected"
          })
        })
      });
    }
  }
  return prevState;
}
function mergeRejectPlan(prevState) {
  var _a, _b;
  if (((_a = prevState.pendingTurn) === null || _a === void 0 ? void 0 : _a.type) === "agent") {
    if (((_b = prevState.pendingTurn.pendingState) === null || _b === void 0 ? void 0 : _b.type) === "plan") {
      return Object.assign(Object.assign({}, prevState), {
        completedTurns: [...prevState.completedTurns, completeTurn({
          type: "agent",
          userMessage: prevState.pendingTurn.userMessage,
          completedSteps: [...prevState.pendingTurn.completedSteps, {
            type: "plan",
            tool: prevState.pendingTurn.pendingState.tool,
            status: "rejected"
          }],
          pendingState: undefined,
          thinkingContent: undefined
        })],
        pendingTurn: undefined,
        rejectedPlan: true
      });
    }
  }
  return prevState;
}
function mergeExecutePlan(prevState) {
  var _a, _b;
  if (((_a = prevState.pendingTurn) === null || _a === void 0 ? void 0 : _a.type) === "agent") {
    if (((_b = prevState.pendingTurn.pendingState) === null || _b === void 0 ? void 0 : _b.type) === "plan") {
      return Object.assign(Object.assign({}, prevState), {
        pendingTurn: Object.assign(Object.assign({}, prevState.pendingTurn), {
          completedSteps: [...prevState.pendingTurn.completedSteps, {
            type: "plan",
            tool: prevState.pendingTurn.pendingState.tool,
            status: "accepted"
          }],
          pendingState: undefined,
          thinkingContent: undefined
        })
      });
    }
  }
  return prevState;
}
function mergeDiscardPlan(prevState) {
  return Object.assign(Object.assign({}, prevState), {
    rejectedPlan: false
  });
}
//# sourceMappingURL=plan.js.map