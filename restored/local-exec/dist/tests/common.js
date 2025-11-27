class MockIgnoreService {
  isCursorIgnored(_filePath) {
    return Promise.resolve(false);
  }
  isGitIgnored(_filePath) {
    return Promise.resolve(false);
  }
  isIgnoredByAny(_filePath) {
    return Promise.resolve(false);
  }
  listCursorIgnoreFilesByRoot(_root) {
    return Promise.resolve([]);
  }
  isRepoBlocked(_filePath) {
    return Promise.resolve(false);
  }
  getCursorIgnoreMapping() {
    return Promise.resolve({});
  }
  getGitIgnoreMapping() {
    return Promise.resolve({});
  }
}
class MockPendingDecisionProvider {
  requestApproval(_operation) {
    return Promise.resolve({
      approved: true
    });
  }
}
class MockPermissionsService {
  constructor() {
    this._shouldBlockShellCommandImpl = async (_ctx, _cmd, _opts, requestedPolicy) => ({
      kind: "allow",
      policy: requestedPolicy ?? {
        type: "insecure_none"
      }
    });
  }
  shouldBlockRead(_filePath) {
    return Promise.resolve(false);
  }
  shouldBlockWrite(_ctx, _filePath, _newContents) {
    return Promise.resolve(false);
  }
  shouldBlockShellCommand(ctx, command, options, requestedPolicy) {
    return this._shouldBlockShellCommandImpl(ctx, command, options, requestedPolicy);
  }
  shouldBlockMcp(_ctx, _args) {
    return Promise.resolve(false);
  }
  addToAllowList(_ctx, _kind, _value) {
    return Promise.resolve();
  }
  addToDenyList(_ctx, _kind, _value) {
    return Promise.resolve();
  }
  setShouldBlockShellCommand(impl) {
    this._shouldBlockShellCommandImpl = impl;
  }
}

//# sourceMappingURL=common.js.map