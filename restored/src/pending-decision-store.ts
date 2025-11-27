/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */$: () => (/* binding */PendingDecisionStore)
  /* harmony export */
});
/* harmony import */
var _analytics_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/analytics.ts");
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

/**
 * A store for pending decisions that can be used outside React
 * and observed from React components
 */
class PendingDecisionStore {
  constructor() {
    this.decisions = [];
    this.listeners = new Set();
    this.idCounter = 0;
  }
  /**
   * Get current pending decisions
   */
  getPendingDecisions() {
    return [...this.decisions];
  }
  /**
   * Subscribe to changes in pending decisions
   */
  subscribe(listener) {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.getPendingDecisions());
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }
  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    const currentDecisions = this.getPendingDecisions();
    this.listeners.forEach(listener => {
      listener(currentDecisions);
    });
  }
  /**
   * Add a new pending decision
   */
  addDecision(decision) {
    this.decisions = [...this.decisions, decision];
    this.notifyListeners();
  }
  /**
   * Remove a decision by ID
   */
  removeDecision(id) {
    this.decisions = this.decisions.filter(d => d.id !== id);
    this.notifyListeners();
  }
  /**
   * Find a decision by ID
   */
  findDecision(id) {
    return this.decisions.find(d => d.id === id);
  }
  /**
   * Approve a pending decision
   */
  approveDecision(id) {
    const decision = this.findDecision(id);
    if (decision) {
      (0, _analytics_js__WEBPACK_IMPORTED_MODULE_0__ /* .trackEvent */.sx)("cli.request.user_input.response", {
        tool: decision.operation.type || "unknown",
        response: "approved"
      });
      decision.resolve({
        approved: true
      });
      this.removeDecision(id);
    }
  }
  /**
   * Reject a pending decision with optional reason
   */
  rejectDecision(id, reason) {
    const decision = this.findDecision(id);
    if (decision) {
      decision.resolve({
        approved: false,
        reason
      });
      this.removeDecision(id);
    }
  }
  /**
   * Clear all pending decisions immediately, resolving them as not approved.
   */
  clearAll() {
    const pending = this.getPendingDecisions();
    for (const d of pending) {
      try {
        d.resolve({
          approved: false,
          reason: "cleared"
        });
      } catch (_a) {
        /* ignore */
      }
    }
    this.decisions = [];
    this.notifyListeners();
  }
  /**
   * Implementation of PendingDecisionProvider interface
   * This is called by executors to request approval
   */
  requestApproval(operation) {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve, reject) => {
        const id = `decision-${Date.now()}-${this.idCounter++}`;
        (0, _analytics_js__WEBPACK_IMPORTED_MODULE_0__ /* .trackEvent */.sx)("cli.request.user_input.requested", {
          tool: operation.type || "unknown",
          type: "approval"
        });
        const decision = {
          id,
          type: "approval",
          operation,
          timestamp: Date.now(),
          resolve,
          reject
        };
        this.addDecision(decision);
      });
    });
  }
}

/***/