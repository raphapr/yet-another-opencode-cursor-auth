var agent_store_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function createAgentStoreForSession(ctx, sessionId, options, deps, modelManager) {
  return agent_store_awaiter(this, void 0, void 0, function* () {
    const {
      resumeChatId,
      force = false
    } = options;
    const chatsRoot = (0, state /* getChatsRootDir */.r)();
    const resumeId = resumeChatId;
    const agentId = resumeId || sessionId;
    const agentDir = (0, external_node_path_.join)(chatsRoot, agentId);
    const dbPath = (0, external_node_path_.join)(agentDir, "store.db");
    let sqliteStore;
    if (resumeId) {
      sqliteStore = yield sqlite_blob_store /* SQLiteBlobStoreWithMetadata */.M.initAndLoad(dbPath);
    } else {
      sqliteStore = new sqlite_blob_store /* SQLiteBlobStoreWithMetadata */.M(dbPath);
    }
    const agentStore = new agent_kv_dist /* AgentStore */.pH(sqliteStore, sqliteStore);
    if (resumeId) {
      try {
        yield agentStore.resetFromDb(ctx);
        const lastUsedModel = agentStore.getMetadata("lastUsedModel");
        yield modelManager.setModelFromStoredId(lastUsedModel, deps.configProvider);
      } catch (e) {
        (0, console_io /* exitWithMessage */.uQ)(1, `Failed to resume chat "${resumeId}": ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (force) {
      agentStore.setMetadata("mode", "auto-run");
    }
    return agentStore;
  });
}