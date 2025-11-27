/**
 * Handles block reasons from the permissions service in a consistent way.
 * Returns a result to be returned from the executor, or null to continue with the operation.
 */
async function handleBlockReason(blockReason, callbacks) {
  switch (blockReason.type) {
    case "needsApproval":
      return callbacks.onNeedsApproval(blockReason.approvalReason, blockReason.approvalDetails);
    case "userRejected":
      return callbacks.onUserRejected(blockReason.reason);
    case "cursorIgnore":
      return callbacks.onPermissionDenied("Blocked by cursor ignore");
    case "permissionsConfig":
      return callbacks.onPermissionDenied("Blocked by permissions configuration", {
        isReadonly: blockReason.isReadonly
      });
    case "cursorFiles":
      return callbacks.onPermissionDenied("Blocked by cursor files protection");
    case "adminBlock":
      return callbacks.onPermissionDenied("Blocked by admin repository block");
    default:
      {
        const _exhaustive = blockReason;
        throw new Error(`Unhandled block reason type: ${JSON.stringify(_exhaustive)}`);
      }
  }
}
//# sourceMappingURL=edit-block-handler.js.map