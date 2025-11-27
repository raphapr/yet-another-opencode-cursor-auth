var indexing_manager_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const indexing_manager_logger = (0, dist /* createLogger */.h)("@anysphere/local-worker:indexing-manager");
class IndexingManager {
  constructor(ctx, workspacePath, connectClient, repositoryIdentityProvider, intervalMs = 1000 * 60 * 5) {
    this.ctx = ctx;
    this.timer = null;
    this.state = {
      isRunning: false,
      totalRuns: 0,
      successfulRuns: 0
    };
    this.workspacePath = workspacePath;
    this.intervalMs = intervalMs;
    const {
      indexer,
      repositoryClient
    } = this.initializeIndexer(connectClient, repositoryIdentityProvider);
    this.indexer = indexer;
    this.repositoryClient = repositoryClient;
  }
  start() {
    // Kick off immediately, then on an interval
    void this.indexNow();
    this.stop();
    this.timer = setInterval(() => {
      void this.indexNow();
    }, this.intervalMs);
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  getIndexingState() {
    return Object.assign({}, this.state);
  }
  decryptPath(ctx, encryptedPath) {
    return indexing_manager_awaiter(this, void 0, void 0, function* () {
      const repoPath = yield this.repositoryClient.decryptPath(ctx, encryptedPath);
      const absolutePath = external_node_path_.resolve(this.workspacePath, repoPath);
      return new utils_dist /* FileURL */.qA(absolutePath);
    });
  }
  getRepositoryInfo() {
    return indexing_manager_awaiter(this, void 0, void 0, function* () {
      return yield this.repositoryClient.createFastRepositoryInfo();
    });
  }
  getPathEncryptionKey() {
    return indexing_manager_awaiter(this, void 0, void 0, function* () {
      return yield this.repositoryClient.getPathEncryptionKey();
    });
  }
  initializeIndexer(connectClient, repositoryIdentityProvider) {
    const clientRepositoryInfo = new repository_pb /* ClientRepositoryInfo */.Ym({
      orthogonalTransformSeed: 0
    });
    const repositoryClient = new indexing_client_dist /* RepositoryClient */.q$(connectClient, clientRepositoryInfo, repositoryIdentityProvider, this.workspacePath);
    return {
      repositoryClient,
      indexer: repositoryClient.createIndexer()
    };
  }
  indexNow() {
    return indexing_manager_awaiter(this, void 0, void 0, function* () {
      var _a;
      this.state.isRunning = true;
      this.state.lastRunStartedAtMs = Date.now();
      this.state.lastRunError = undefined;
      this.state.totalRuns += 1;
      try {
        indexing_manager_logger.info(this.ctx, "Indexing now");
        yield this.indexer.index(this.ctx);
        this.state.successfulRuns += 1;
      } catch (err) {
        process.stderr.write(`Indexing failed: ${err instanceof Error ? `${err.message}\n${(_a = err.stack) !== null && _a !== void 0 ? _a : ""}` : String(err)}\n`);
        indexing_manager_logger.error(this.ctx, "Indexing failed", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.state.lastRunError = errorMessage;
        // Best-effort background task; log and continue
        indexing_manager_logger.error(this.ctx, "Indexing run failed", errorMessage);
      } finally {
        indexing_manager_logger.info(this.ctx, "Indexing finished");
        this.state.lastRunFinishedAtMs = Date.now();
        this.state.isRunning = false;
      }
    });
  }
}
//# sourceMappingURL=indexing-manager.js.map