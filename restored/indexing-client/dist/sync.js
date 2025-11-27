var sync_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:sync");
class AddChange {
  constructor(relativePath) {
    this.relativePath = relativePath;
  }
}
class DeleteChange {
  constructor(encryptedRelativePath) {
    this.encryptedRelativePath = encryptedRelativePath;
  }
}
function syncMerkleSubtree(ctx, encryptionScheme, localTreeAccessor, remoteTreeAccessor, changesQueue) {
  return sync_awaiter(this, void 0, void 0, function* () {
    logger.info(ctx, "Syncing merkle subtree", {
      path: localTreeAccessor.getRelativePath(),
      localHash: localTreeAccessor.getHash(),
      remoteHash: remoteTreeAccessor === null || remoteTreeAccessor === void 0 ? void 0 : remoteTreeAccessor.getHash()
    });
    const remoteChildMap = new Map();
    if (remoteTreeAccessor !== undefined && localTreeAccessor !== undefined) {
      const localHash = localTreeAccessor.getHash();
      const remoteHash = remoteTreeAccessor.getHash();
      if (remoteHash !== undefined && remoteHash === localHash) return [];
      const remoteNode = yield remoteTreeAccessor.diffNode(localHash);
      if (remoteNode.type === "match") return [];
      if (remoteNode.type !== "mismatch") throw new Error("Unknown response type");
      for (const child of remoteNode.children) {
        remoteChildMap.set(child.getRelativePath(), child);
      }
    }
    if (localTreeAccessor.getType() === "file") {
      changesQueue.push(new AddChange(localTreeAccessor.getRelativePath()));
      return [];
    }
    const nodes = [];
    const seenLocalChildren = new Set();
    for (const child of localTreeAccessor.getChildren()) {
      const encryptedRelativePath = encryptPath(child.getRelativePath(), encryptionScheme);
      const remoteChild = remoteChildMap.get(encryptedRelativePath);
      nodes.push([child, remoteChild]);
      seenLocalChildren.add(encryptedRelativePath);
    }
    for (const [encryptedRelativePath, _] of remoteChildMap) {
      if (!seenLocalChildren.has(encryptedRelativePath)) {
        changesQueue.push(new DeleteChange(encryptedRelativePath));
      }
    }
    return nodes;
  });
}