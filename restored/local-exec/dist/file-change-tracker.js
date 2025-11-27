// used by the CLI
class FileChangeTracker {
  constructor(workspacePath) {
    this.workspacePath = workspacePath;
    this.changes = new Map();
    this.listeners = new Set();
  }
  /**
   * Subscribe to change notifications
   * @returns Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }
  /**
   * Notify all listeners that something changed
   */
  notify(change) {
    this.listeners.forEach(listener => {
      listener(change);
    });
  }
  /**
   * Track a file change
   * @param path The path to the file (should be normalized by the client)
   * @param before The content before the change (undefined for new files)
   * @param after The content after the change (undefined for deleted files)
   * @param metadata Optional metadata like toolCallId
   */
  trackChange(path, before, after, metadata) {
    const existingChange = this.changes.get(path);
    if (existingChange) {
      // Merge with existing change - keep original "before" state
      const originalBefore = existingChange.before;
      // Keep first metadata if not overridden
      const mergedMetadata = metadata || existingChange.metadata;
      // Check if this results in no net change
      if (originalBefore === after || originalBefore === undefined && after === undefined) {
        // No net change - remove from tracking
        this.changes.delete(path);
        this.notify();
      } else {
        // Update the change with merged state
        const change = {
          path,
          before: originalBefore,
          after,
          metadata: mergedMetadata
        };
        this.changes.set(path, change);
        this.notify(change);
      }
    } else {
      // No existing change - track as new
      const change = {
        path,
        before,
        after,
        metadata
      };
      this.changes.set(path, change);
      this.notify(change);
    }
  }
  /**
   * Get all tracked changes
   */
  getChanges() {
    return Array.from(this.changes.values());
  }
  /**
   * Get a specific change by path
   */
  getChange(path) {
    return this.changes.get(path);
  }
  /**
   * Check if a path has pending changes
   */
  hasChange(path) {
    return this.changes.has(path);
  }
  /**
   * Accept a change, removing it from the tracker
   */
  accept(path) {
    const change = this.changes.get(path);
    this.changes.delete(path);
    this.notify(change);
  }
  /**
   * Accept all changes, clearing the tracker
   */
  acceptAll() {
    this.changes.clear();
    this.notify();
  }
  /**
   * Reject a change by reverting the file to its original state
   */
  async reject(path) {
    const change = this.changes.get(path);
    if (!change) {
      return;
    }
    try {
      if (change.before === undefined && change.after !== undefined) {
        // File was created, delete it
        await (0, promises_.unlink)(path);
      } else if (change.before !== undefined && change.after === undefined) {
        // File was deleted, recreate it
        await writeText(path, change.before, this.workspacePath);
      } else if (change.before !== undefined && change.after !== undefined) {
        // File was modified, restore original content
        await writeText(path, change.before, this.workspacePath);
      }
    } catch {
      // Silently ignore errors during revert operations
    } finally {
      // Remove from tracker even if revert fails
      this.changes.delete(path);
      this.notify(change);
    }
  }
  /**
   * Reject all changes by reverting all files to their original states
   */
  async rejectAll() {
    const paths = Array.from(this.changes.keys());
    // Process all rejections in parallel
    await Promise.all(paths.map(path => this.reject(path)));
  }
  /**
   * Clear all tracked changes without reverting
   */
  clear() {
    // Get first change for notification, or undefined if none
    const change = this.changes.values().next().value;
    this.changes.clear();
    this.notify(change);
  }
  /**
   * Get the number of tracked changes
   */
  get size() {
    return this.changes.size;
  }
}
//# sourceMappingURL=file-change-tracker.js.map