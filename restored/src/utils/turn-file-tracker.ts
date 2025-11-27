/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */k: () => (/* binding */TurnFileTracker)
  /* harmony export */
});
/**
 * Tracks file changes per turn by taking snapshots of the FileChangeTracker
 * state at the beginning and end of each turn.
 */
class TurnFileTracker {
  constructor(fileChangeTracker) {
    this.fileChangeTracker = fileChangeTracker;
    this.turnStartSnapshots = new Map();
  }
  /**
   * Capture the current state of file changes when a turn starts
   */
  startTurn(turnId) {
    this.turnStartSnapshots.set(turnId, [...this.fileChangeTracker.getChanges()]);
  }
  /**
   * Get the file changes that occurred during a specific turn
   */
  getTurnChanges(turnId) {
    const startSnapshot = this.turnStartSnapshots.get(turnId);
    if (!startSnapshot) {
      return [];
    }
    const currentChanges = this.fileChangeTracker.getChanges();
    const _startPaths = new Set(startSnapshot.map(change => change.path));
    // Find changes that occurred during this turn:
    // 1. New files that weren't in the start snapshot
    // 2. Files that were in the start snapshot but have different content now
    const turnChanges = [];
    for (const currentChange of currentChanges) {
      const startChange = startSnapshot.find(c => c.path === currentChange.path);
      if (!startChange) {
        // This is a new change that occurred during this turn
        turnChanges.push(currentChange);
      } else if (startChange.after !== currentChange.after) {
        // This file was changed further during this turn
        // Track the change from the start of the turn to now
        turnChanges.push({
          path: currentChange.path,
          before: startChange.after,
          // Use the state at turn start as "before"
          after: currentChange.after
        });
      }
    }
    return turnChanges;
  }
  /**
   * Finalize a turn and return the file changes that occurred during it
   */
  finalizeTurn(turnId) {
    const turnChanges = this.getTurnChanges(turnId);
    this.turnStartSnapshots.delete(turnId);
    return turnChanges;
  }
  /**
   * Clean up snapshots for old turns
   */
  cleanup() {
    this.turnStartSnapshots.clear();
  }
}

/***/