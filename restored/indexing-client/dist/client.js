var client_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var client_asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};
const client_logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:client");
function makeEncryptedWorkspaceUris(workspaceUris, pathEncryptionScheme) {
  return Object.values(workspaceUris).sort((a, b) => a.localeCompare(b)).map(workspaceUri => encryptPath(workspaceUri, pathEncryptionScheme)).join(",");
}
function getPathEncryptionKeySHA256Hash(pathEncryptionKey) {
  return external_node_crypto_.createHash("sha256").update(`${pathEncryptionKey}_PATH_KEY_HASH_SHA256`).digest("hex");
}
function syncCodebase(ctx, client, encryptionScheme, clientRepositoryInfo, treeStructureInfo, codebaseId, workspacePath) {
  return client_awaiter(this, void 0, void 0, function* () {
    const localTreeAccessor = new RustLocalNodeAccessor(treeStructureInfo);
    const syncWorker = new ConcurrentWorker(64);
    const changesQueue = new AsyncQueueImpl();
    const remoteTreeAccessor = new ConnectCodebaseNodeAccessor(client, codebaseId, ".");
    yield syncWorker.addTask(() => syncMerkleSubtree(ctx, encryptionScheme, localTreeAccessor, remoteTreeAccessor, changesQueue));
    const updater = createConnectUpdater(client, clientRepositoryInfo, codebaseId);
    const changeWorkers = Array.from({
      length: 8
    }, () => changeWorker(ctx, changesQueue, (ctx, changes) => applyChanges(ctx, encryptionScheme, changes, workspacePath, updater), new SimpleBatcherFactory(32)));
    const handleSync = () => client_awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        try {
          for (var _d = true, syncWorker_1 = client_asyncValues(syncWorker), syncWorker_1_1; syncWorker_1_1 = yield syncWorker_1.next(), _a = syncWorker_1_1.done, !_a; _d = true) {
            _c = syncWorker_1_1.value;
            _d = false;
            const nodes = _c;
            for (const [localNode, remoteNode] of nodes) {
              yield syncWorker.addTask(() => syncMerkleSubtree(ctx, encryptionScheme, localNode, remoteNode, changesQueue));
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = syncWorker_1.return)) yield _b.call(syncWorker_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      } finally {
        changesQueue.close();
      }
    });
    const handleChanges = () => client_awaiter(this, void 0, void 0, function* () {
      yield Promise.all(changeWorkers);
    });
    yield Promise.all([handleSync(), handleChanges()]);
  });
}
function getFirstElement(iterable) {
  return client_awaiter(this, void 0, void 0, function* () {
    var _a, iterable_1, iterable_1_1;
    var _b, e_2, _c, _d;
    try {
      for (_a = true, iterable_1 = client_asyncValues(iterable); iterable_1_1 = yield iterable_1.next(), _b = iterable_1_1.done, !_b; _a = true) {
        _d = iterable_1_1.value;
        _a = false;
        const element = _d;
        return element;
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (!_a && !_b && (_c = iterable_1.return)) yield _c.call(iterable_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    throw new Error("No element found");
  });
}
function uriFromWorkspacePath(workspacePath) {
  return `file://${workspacePath}`;
}
class RepositoryIndexer {
  constructor(client, clientRepositoryInfo, repositoryIdentityProvider, workspacePath) {
    this.client = client;
    this.clientRepositoryInfo = clientRepositoryInfo;
    this.repositoryIdentityProvider = repositoryIdentityProvider;
    this.workspacePath = workspacePath;
  }
  createRepositoryInfo(repositoryIdentity, numFiles) {
    return client_awaiter(this, void 0, void 0, function* () {
      return {
        isLocal: true,
        numFiles,
        isTracked: false,
        remoteNames: [],
        remoteUrls: [],
        // Encrypt each workspace uri separately and join them together with commas.
        workspaceUri: makeEncryptedWorkspaceUris({
          "": uriFromWorkspacePath(this.workspacePath)
        }, repositoryIdentity.encryptionScheme),
        repoName: repositoryIdentity.repoName,
        repoOwner: repositoryIdentity.repoOwner
      };
    });
  }
  index(ctx) {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const merkleClient = new merkle_tree_native.MerkleClient({
        "": this.workspacePath
      });
      yield merkleClient.build(false, {
        maxNumFiles: 10000
      });
      client_logger.info(ctx, "Getting tree structure for", {
        workspacePath: this.workspacePath
      });
      const [treeStructureInfo, simhash, numFiles] = yield Promise.all([merkleClient.getTreeStructure(), merkleClient.getSimhash(), merkleClient.getNumEmbeddableFiles()]);
      if (treeStructureInfo === null) {
        throw new Error("Tree structure is null");
      }
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      const pathKeyHash = getPathEncryptionKeySHA256Hash(encryptionScheme.exportKey());
      const request = new repository_pb /* FastRepoInitHandshakeV2Request */.lp({
        repository: yield this.createRepositoryInfo(repositoryIdentity, numFiles),
        rootHash: treeStructureInfo.hash,
        similarityMetricType: repository_pb /* SimilarityMetricType */.oC.SIMHASH,
        similarityMetric: Array.from(simhash),
        pathKeyHash,
        pathKeyHashType: repository_pb /* PathKeyHashType */.n5.SHA256,
        doCopy: false,
        returnAfterBackgroundCopyStarted: false,
        pathKey: "",
        localCodebaseRootInfo: undefined
      });
      const response = yield this.client.fastRepoInitHandshakeV2(request);
      const syncPromises = response.codebases.map(codebase => client_awaiter(this, void 0, void 0, function* () {
        if (codebase.status === repository_pb /* RepositoryCodebaseInfo_Status */.CK.UP_TO_DATE) {
          return {
            codebaseId: codebase.codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.SUCCESS,
            hasUpdates: false
          };
        }
        try {
          yield syncCodebase(ctx, this.client, encryptionScheme, this.clientRepositoryInfo, treeStructureInfo, codebase.codebaseId, this.workspacePath);
          return {
            codebaseId: codebase.codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.SUCCESS,
            hasUpdates: true
          };
        } catch (e) {
          client_logger.error(ctx, "Error syncing codebase", {
            codebaseId: codebase.codebaseId,
            error: e
          });
          return {
            codebaseId: codebase.codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.FAILURE,
            hasUpdates: false
          };
        }
      }));
      const syncResults = yield Promise.all(syncPromises);
      yield this.client.fastRepoSyncComplete({
        codebases: syncResults.map(({
          codebaseId,
          hasUpdates
        }) => {
          return {
            codebaseId,
            status: repository_pb /* RepositoryCodebaseSyncStatus_Status */.TC.SUCCESS,
            hasUpdates,
            similarityMetricType: hasUpdates ? repository_pb /* SimilarityMetricType */.oC.SIMHASH : repository_pb /* SimilarityMetricType */.oC.UNSPECIFIED,
            similarityMetric: hasUpdates ? Array.from(simhash) : [],
            pathKeyHash,
            pathKeyHashType: repository_pb /* PathKeyHashType */.n5.SHA256
          };
        })
      });
    });
  }
}
class RepositoryClient {
  constructor(client, clientRepositoryInfo, repositoryIdentityProvider, workspacePath) {
    this.client = client;
    this.clientRepositoryInfo = clientRepositoryInfo;
    this.repositoryIdentityProvider = repositoryIdentityProvider;
    this.workspacePath = workspacePath;
  }
  createIndexer() {
    return new RepositoryIndexer(this.client, this.clientRepositoryInfo, this.repositoryIdentityProvider, this.workspacePath);
  }
  createFastRepositoryInfo() {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      return {
        relativeWorkspacePath: ".",
        repoName: repositoryIdentity.repoName,
        repoOwner: repositoryIdentity.repoOwner,
        orthogonalTransformSeed: 0
      };
    });
  }
  decryptPath(_ctx, path) {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      return decryptPath(path, encryptionScheme);
    });
  }
  getPathEncryptionKey(_ctx) {
    return client_awaiter(this, void 0, void 0, function* () {
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      return encryptionScheme.exportKey();
    });
  }
  search(_ctx, query) {
    return client_awaiter(this, void 0, void 0, function* () {
      var _a;
      const repositoryIdentity = yield this.repositoryIdentityProvider.loadRepositoryIdentity();
      const encryptionScheme = repositoryIdentity.encryptionScheme;
      const requestId = (0, external_node_crypto_.randomUUID)();
      console.log(requestId);
      const response = yield this.client.semSearchFast({
        request: {
          query,
          repository: yield this.createFastRepositoryInfo(),
          topK: 16
        }
      });
      const element = yield getFirstElement(response);
      const codeResults = (_a = element.response) === null || _a === void 0 ? void 0 : _a.codeResults;
      if (codeResults === undefined) {
        return undefined;
      }
      return codeResults.map(codeResult => {
        return Object.assign(Object.assign({}, codeResult), {
          codeBlock: codeResult.codeBlock ? Object.assign(Object.assign({}, codeResult.codeBlock), {
            relativeWorkspacePath: decryptPath(codeResult.codeBlock.relativeWorkspacePath, encryptionScheme)
          }) : undefined
        });
      });
    });
  }
}