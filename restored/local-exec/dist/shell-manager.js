class ShellEmitter {
  constructor(initialState) {
    this.listeners = new Set();
    this.currentState = initialState ? {
      ...initialState
    } : undefined;
    this.sandboxed = undefined;
  }
  addListener(listener) {
    this.listeners.add(listener);
  }
  removeListener(listener) {
    this.listeners.delete(listener);
  }
  getCurrentState() {
    return this.currentState ? {
      ...this.currentState
    } : undefined;
  }
  getSandboxed() {
    return this.sandboxed;
  }
  emit(event) {
    // Handle start metadata
    if (event.type === "start") {
      // Ensure we have a state object so listeners receive a new reference and re-render
      if (!this.currentState) {
        this.currentState = {
          output: "",
          exitCode: null
        };
      }
      this.sandboxed = event.sandboxed;
      // Notify listeners so UI can update lock icon immediately
      this.emitChange();
      return;
    }
    // Initialize state if it doesn't exist
    if (!this.currentState) {
      this.currentState = {
        output: "",
        exitCode: null
      };
    }
    const previousOutput = this.currentState.output;
    switch (event.type) {
      case "stdout":
        this.currentState.output += event.data;
        break;
      case "stderr":
        this.currentState.output += event.data;
        break;
      case "exit":
        this.currentState.exitCode = event.code;
        break;
    }
    // Only emit change event if the output actually changed
    if (this.currentState.output !== previousOutput || event.type === "exit") {
      this.emitChange();
    }
  }
  emitChange() {
    const newResult = this.getCurrentState();
    this.listeners.forEach(listener => {
      try {
        listener(newResult);
      } catch (error) {
        console.error("Error in shell change listener:", error);
      }
    });
  }
}
class ShellManager {
  constructor() {
    this.shellEmitterInstances = new utils_dist /* LRUCache */.qK({
      max: 100
    });
  }
  getOrCreateShellEmitter(toolCallId) {
    let shellEmitter = this.shellEmitterInstances.get(toolCallId);
    if (shellEmitter) return shellEmitter;
    shellEmitter = new ShellEmitter(undefined);
    this.shellEmitterInstances.set(toolCallId, shellEmitter);
    return shellEmitter;
  }
}
//# sourceMappingURL=shell-manager.js.map