var connect_node_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class ConnectCodebaseNodeAccessor {
  constructor(client, codebaseId, path, hash = "") {
    this.client = client;
    this.codebaseId = codebaseId;
    this.path = path;
    this.hash = hash;
  }
  getHash() {
    return this.hash;
  }
  diffNode(hash) {
    return connect_node_awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.syncMerkleSubtreeV2({
        codebaseId: this.codebaseId,
        localPartialPath: {
          relativeWorkspacePath: this.path,
          hashOfNode: hash
        }
      });
      if (response.result.case === "match") {
        return {
          type: "match"
        };
      } else if (response.result.case === "mismatch") {
        return {
          type: "mismatch",
          children: response.result.value.children.map(child => {
            return new ConnectCodebaseNodeAccessor(this.client, this.codebaseId, child.relativeWorkspacePath, child.hashOfNode);
          })
        };
      } else {
        throw new Error("Unknown response type");
      }
    });
  }
  getRelativePath() {
    return this.path;
  }
}
class RustLocalNodeAccessor {
  constructor(fileInfo) {
    this.fileInfo = fileInfo;
  }
  getRelativePath() {
    const p = this.fileInfo.unencryptedRelativePath;
    if (p.length === 0) {
      return ".";
    }
    return p;
  }
  getHash() {
    return this.fileInfo.hash;
  }
  getChildren() {
    var _a, _b;
    return (_b = (_a = this.fileInfo.children) === null || _a === void 0 ? void 0 : _a.map(child => new RustLocalNodeAccessor(child))) !== null && _b !== void 0 ? _b : [];
  }
  getType() {
    return this.fileInfo.children === undefined ? "file" : "directory";
  }
}