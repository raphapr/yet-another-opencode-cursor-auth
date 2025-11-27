function convertProtoToInternalPolicy(policy) {
  if (!policy) {
    return {
      type: "insecure_none"
    };
  }
  switch (policy.type) {
    case sandbox_pb /* SandboxPolicy_Type */.v.INSECURE_NONE:
    case sandbox_pb /* SandboxPolicy_Type */.v.UNSPECIFIED:
      return {
        type: "insecure_none"
      };
    case sandbox_pb /* SandboxPolicy_Type */.v.WORKSPACE_READWRITE:
      return {
        type: "workspace_readwrite",
        network_access: !!policy.networkAccess,
        additional_readwrite_paths: policy.additionalReadwritePaths,
        additional_readonly_paths: policy.additionalReadonlyPaths,
        block_git_writes: policy.blockGitWrites
        // blocked_paths: policy.blockedPaths,
      };
    default:
      return {
        type: "insecure_none"
      };
  }
}
function convertInternalToProtoPolicy(policy) {
  if (!policy) return undefined;
  if (policy.type === "insecure_none") {
    return new sandbox_pb /* SandboxPolicy */.M({
      type: sandbox_pb /* SandboxPolicy_Type */.v.INSECURE_NONE
    });
  }
  if (policy.type === "workspace_readwrite") {
    return new sandbox_pb /* SandboxPolicy */.M({
      type: sandbox_pb /* SandboxPolicy_Type */.v.WORKSPACE_READWRITE,
      networkAccess: policy.network_access ?? false,
      additionalReadwritePaths: policy.additional_readwrite_paths ?? [],
      additionalReadonlyPaths: policy.additional_readonly_paths ?? [],
      blockGitWrites: policy.block_git_writes
      // blockedPaths: policy.blocked_paths ?? [],
    });
  }
  return new sandbox_pb /* SandboxPolicy */.M({
    type: sandbox_pb /* SandboxPolicy_Type */.v.INSECURE_NONE
  });
}
//# sourceMappingURL=sandbox-conversion.js.map