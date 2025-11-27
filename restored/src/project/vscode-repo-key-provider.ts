var vscode_repo_key_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class VscodeRepoKeyProvider {
  constructor(workspacePath) {
    this.workspacePath = workspacePath;
    this.vscodeRepoKeysPromise = VscodeRepoKeyProvider.loadRepoKeys(workspacePath);
  }
  getRepoKeys() {
    return vscode_repo_key_provider_awaiter(this, void 0, void 0, function* () {
      return yield this.vscodeRepoKeysPromise;
    });
  }
  static loadRepoKeys(workspacePath) {
    return vscode_repo_key_provider_awaiter(this, void 0, void 0, function* () {
      var _a;
      const kvStore = yield getWorkspaceKvStore(workspacePath);
      if (kvStore === undefined) {
        return undefined;
      }
      const k = "anysphere.cursor-retrieval";
      const v = JSON.parse((_a = yield kvStore.get(k)) !== null && _a !== void 0 ? _a : "{}");
      const legacyRepoName = getLegacyRepoName([new utils_dist /* FileURL */.qA(workspacePath)]);
      const itemKey = `map/${legacyRepoName}/repoKeys`;
      const repoKeys = v[itemKey];
      if (repoKeys === undefined) {
        return undefined;
      }
      return repoKeys;
    });
  }
}