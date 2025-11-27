//#!/usr/bin/env node
var simple_server_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const simple_server_logger = (0, dist /* createLogger */.h)("@anysphere/local-worker:simple-server");
function createAuthInterceptor(credentialManager) {
  return next => req => simple_server_awaiter(this, void 0, void 0, function* () {
    var _a;
    const accessToken = yield credentialManager.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }
    req.header.set("authorization", `Bearer ${accessToken}`);
    const requestId = (0, external_node_crypto_.randomUUID)();
    req.header.set("x-request-id", requestId);
    const clientVersion = (_a = "2025.11.25-d5b3271") !== null && _a !== void 0 ? _a : "unknown";
    req.header.set("x-cursor-client-version", `cli-${clientVersion}`);
    return yield next(req);
  });
}
class SimpleServer {
  constructor(ctx, socketPath, repositoryStateProvider, options, lspProvider, credentialManager) {
    this.ctx = ctx;
    this.socketPath = socketPath;
    this.repositoryStateProvider = repositoryStateProvider;
    this.options = options;
    this.lspProvider = lspProvider;
    this.credentialManager = credentialManager;
    this.inactivityTimer = null;
    this.INACTIVITY_TIMEOUT = 1000 * 60 * 30; // 30 minutes
    this.isWindows = (0, external_node_os_.platform)() === "win32";
    this.router = new Router();
    this.setupRoutes(ctx);
    this.server = (0, external_node_http_.createServer)(this.handleRequest.bind(this));
    const connectClient = (0, indexing_client_dist /* createRepositoryClient */.WZ)({
      endpoint: this.options.repoEndpoint,
      insecure: this.options.repoInsecure,
      httpVersion: this.options.repoHttpVersion,
      interceptors: [createAuthInterceptor(this.credentialManager)]
    });
    this.indexingManager = new IndexingManager(ctx, process.cwd(), connectClient, this.repositoryStateProvider);
  }
  setupRoutes(_ctx) {
    // GET /ping
    this.router.get("/ping", (_req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        pong: "pong"
      }));
    }));
    // POST /openFile
    this.router.post("/openFile", (req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      yield handleZodRequest(req, res, openRequestSchema, data => simple_server_awaiter(this, void 0, void 0, function* () {
        const url = new utils_dist /* FileURL */.qA(data.url);
        yield this.lspProvider.open(this.ctx, url);
        return {
          success: true
        };
      }));
    }));
    // POST /openFile
    this.router.post("/sleep", (req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      yield handleZodRequest(req, res, sleepRequestSchema, data => simple_server_awaiter(this, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, data.duration));
        return {
          success: true
        };
      }));
    }));
    // POST /getDiagnostics
    this.router.post("/getDiagnostics", (req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      yield handleZodRequest(req, res, getDiagnosticsRequestSchema, data => simple_server_awaiter(this, void 0, void 0, function* () {
        const url = new utils_dist /* FileURL */.qA(data.url);
        const diagnostics = yield this.lspProvider.getDiagnostics(this.ctx, url);
        return {
          diagnostics
        };
      }));
    }));
    // GET /indexing/status
    this.router.post("/decryptPath", (req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      yield handleZodRequest(req, res, decryptPathRequestSchema, data => simple_server_awaiter(this, void 0, void 0, function* () {
        return yield this.indexingManager.decryptPath(this.ctx, data.encryptedPath).then(url => ({
          url: url.toString()
        }));
      }));
    }));
    // GET /getIndexingStatus
    this.router.get("/getIndexingStatus", (req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      yield handleZodRequest(req, res, getIndexingStatusRequestSchema, () => simple_server_awaiter(this, void 0, void 0, function* () {
        return this.indexingManager.getIndexingState();
      }));
    }));
    // GET /getRepositoryInfo
    this.router.get("/getRepositoryInfo", (req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      yield handleZodRequest(req, res, getIndexingStatusRequestSchema, () => simple_server_awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const repositoryInfo = yield this.indexingManager.getRepositoryInfo();
        const pathEncryptionKey = yield this.indexingManager.getPathEncryptionKey();
        return {
          relativeWorkspacePath: (_a = repositoryInfo.relativeWorkspacePath) !== null && _a !== void 0 ? _a : "",
          repoName: (_b = repositoryInfo.repoName) !== null && _b !== void 0 ? _b : "",
          repoOwner: (_c = repositoryInfo.repoOwner) !== null && _c !== void 0 ? _c : "",
          isLocal: (_d = repositoryInfo.isLocal) !== null && _d !== void 0 ? _d : false,
          workspaceUri: (_e = repositoryInfo.workspaceUri) !== null && _e !== void 0 ? _e : "",
          numFiles: (_f = repositoryInfo.numFiles) !== null && _f !== void 0 ? _f : 0,
          isTracked: (_g = repositoryInfo.isTracked) !== null && _g !== void 0 ? _g : false,
          remoteNames: (_h = repositoryInfo.remoteNames) !== null && _h !== void 0 ? _h : [],
          remoteUrls: (_j = repositoryInfo.remoteUrls) !== null && _j !== void 0 ? _j : [],
          orthogonalTransformSeed: (_k = repositoryInfo.orthogonalTransformSeed) !== null && _k !== void 0 ? _k : 0,
          pathEncryptionKey
        };
      }));
    }));
    // POST /kill
    this.router.post("/kill", (_req, res) => simple_server_awaiter(this, void 0, void 0, function* () {
      try {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          success: true
        }));
      } finally {
        // Allow response to flush before shutting down
        setTimeout(() => simple_server_awaiter(this, void 0, void 0, function* () {
          try {
            yield this.stop();
          } catch (_a) {
            // ignore errors during shutdown
          } finally {
            process.exit(0);
          }
        }), 0);
      }
    }));
  }
  handleRequest(req, res) {
    this.resetInactivityTimer();
    this.router.handle(req, res);
  }
  resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => simple_server_awaiter(this, void 0, void 0, function* () {
      yield this.cleanup();
      process.exit(0);
    }), this.INACTIVITY_TIMEOUT);
  }
  cleanup() {
    return simple_server_awaiter(this, void 0, void 0, function* () {
      // On Windows, named pipes are automatically cleaned up
      // On Unix, we need to manually unlink the socket file
      if (!this.isWindows) {
        try {
          yield (0, promises_.unlink)(this.socketPath);
        } catch (_err) {
          // Ignore if file doesn't exist
        }
      }
    });
  }
  start() {
    return simple_server_awaiter(this, void 0, void 0, function* () {
      yield this.cleanup();
      return new Promise((resolve, reject) => {
        this.server.listen(this.socketPath, () => {
          this.resetInactivityTimer();
          if (this.options.enableIndexing) {
            this.indexingManager.start();
          }
          resolve();
        });
        this.server.on("error", err => {
          reject(err);
        });
      });
    });
  }
  stop() {
    return simple_server_awaiter(this, void 0, void 0, function* () {
      return new Promise(resolve => {
        this.server.close(() => {
          if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
          }
          if (this.options.enableIndexing) {
            this.indexingManager.stop();
          }
          this.cleanup().then(() => resolve());
        });
      });
    });
  }
}
function createFileLogger(logPath) {
  return {
    log: (_ctx, {
      level,
      message,
      metadata,
      error
    }) => {
      let logLine = `[${level}] ${message}`;
      if (metadata) {
        for (const [key, value] of Object.entries(metadata)) {
          logLine += ` ${key}=${value}`;
        }
      }
      if (error) {
        const errorMessage = error instanceof Error ? error.stack : String(error);
        logLine += ` ERROR: ${errorMessage}`;
      }
      (0, external_node_fs_.appendFileSync)(logPath, `${logLine}\n`);
    }
  };
}
function runServer(socketPath, logPath, repositoryStateProvider, credentialManager, options) {
  const ctx = (0, dist /* createContext */.q6)().with(dist /* loggerKey */._O, createFileLogger(logPath));
  simple_server_logger.info(ctx, "runServer", {
    socketPath
  });
  const typescriptLspProviderFactory = new TypescriptLspProviderFactory(ctx, 3000);
  const lspProvider = new LazyRuntimeLspProvider(typescriptLspProviderFactory.create(process.cwd()));
  const server = new SimpleServer(ctx, socketPath, repositoryStateProvider, options, lspProvider, credentialManager);
  return server.start();
}
//# sourceMappingURL=simple-server.js.map