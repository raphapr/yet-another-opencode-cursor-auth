var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
class SimpleUDSClient {
  constructor(socketPath) {
    this.socketPath = socketPath;
    this.pipePath = this.socketPath;
  }
  makeRequest(method, path, body, signal) {
    return new Promise((resolve, reject) => {
      // Check if already aborted
      if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        reject(new Error("Request aborted"));
        return;
      }
      const options = {
        socketPath: this.pipePath,
        path,
        method,
        headers: {
          "Content-Type": "application/json"
        }
      };
      const req = (0, external_node_http_.request)(options, res => {
        let responseData = "";
        res.on("data", chunk => {
          responseData += chunk.toString();
        });
        res.on("end", () => {
          try {
            const data = responseData ? JSON.parse(responseData) : null;
            resolve({
              status: res.statusCode || 500,
              data
            });
          } catch (_error) {
            reject(new Error("Failed to parse response"));
          }
        });
      });
      req.on("error", reject);
      // Handle abort signal
      const abortHandler = () => {
        req.destroy();
        reject(new Error("Request aborted"));
      };
      signal === null || signal === void 0 ? void 0 : signal.addEventListener("abort", abortHandler);
      // Clean up abort listener when request completes
      req.on("close", () => {
        signal === null || signal === void 0 ? void 0 : signal.removeEventListener("abort", abortHandler);
      });
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }
  post(path, body, signal) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.makeRequest("POST", path, body, signal);
    });
  }
  get(path, signal) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.makeRequest("GET", path, undefined, signal);
    });
  }
}
class LocalWorkerClient {
  constructor(client) {
    this.client = client;
  }
  ping(signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.get("/ping", signal);
      if (response.status !== 200) {
        throw new Error(`Failed to ping: ${response.status} ${JSON.stringify(response.data)}`);
      }
      return response.data.pong;
    });
  }
  kill(signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.post("/kill", undefined, signal);
      if (response.status !== 200) {
        throw new Error(`Failed to kill server: ${response.status} ${JSON.stringify(response.data)}`);
      }
    });
  }
  open(ctx, uri) {
    return __awaiter(this, void 0, void 0, function* () {
      const body = {
        url: uri.toString()
      };
      const response = yield this.client.post("/openFile", body, ctx.signal);
      if (response.status !== 200) {
        throw new Error(`Failed to open file (${uri.serialize()}): ${response.status} ${JSON.stringify(response.data)}`);
      }
    });
  }
  sleep(duration, signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const body = {
        duration
      };
      const response = yield this.client.post("/sleep", body, signal);
      if (response.status !== 200) {
        throw new Error(`Failed to sleep: ${response.status} ${JSON.stringify(response.data)}`);
      }
    });
  }
  getDiagnostics(ctx, uri) {
    return __awaiter(this, void 0, void 0, function* () {
      // The server expects a path but the interface doesn't provide one
      // This suggests the server should be updated to return all diagnostics
      const body = {
        url: uri.toString()
      };
      const response = yield this.client.post("/getDiagnostics", body, ctx.signal);
      if (response.status !== 200) {
        throw new Error(`Failed to get diagnostics (${uri.toString()}): ${response.status} ${JSON.stringify(response.data)}`);
      }
      return response.data.diagnostics;
    });
  }
  decryptPath(encryptedPath,
  // TODO: figure out what to do here
  signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.post("/decryptPath", {
        encryptedPath
      }, signal);
      if (response.status !== 200) {
        throw new Error(`Failed to decrypt path: ${response.status} ${JSON.stringify(response.data)}`);
      }
      return utils_dist /* FileURL */.qA.fromString(response.data.url);
    });
  }
  getIndexingStatus(signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.get("/getIndexingStatus", signal);
      if (response.status !== 200) {
        throw new Error(`Failed to get indexing status: ${response.status} ${JSON.stringify(response.data)}`);
      }
      return response.data;
    });
  }
  getRepositoryInfo(signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.get("/getRepositoryInfo", signal);
      if (response.status !== 200) {
        throw new Error(`Failed to get repository info: ${response.status} ${JSON.stringify(response.data)}`);
      }
      return response.data;
    });
  }
  getCodebaseReference(ctx, signal) {
    return __awaiter(this, void 0, void 0, function* () {
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const _span = __addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalWorkerClient.getCodebaseReference")), false);
        const response = yield this.client.get("/getRepositoryInfo", signal);
        if (response.status !== 200) {
          throw new Error(`Failed to get repository info: ${response.status} ${JSON.stringify(response.data)}`);
        }
        return {
          relativeWorkspacePath: response.data.relativeWorkspacePath,
          repoName: response.data.repoName,
          repoOwner: response.data.repoOwner,
          isTracked: response.data.isTracked,
          isLocal: response.data.isLocal,
          numFiles: response.data.numFiles,
          orthogonalTransformSeed: response.data.orthogonalTransformSeed,
          pathEncryptionKey: response.data.pathEncryptionKey
        };
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources(env_1);
      }
    });
  }
}
function createClient(startServer, socketPath) {
  let serverStarted = false;
  // SimpleUDSClient will handle Windows named pipe conversion internally
  const client = new SimpleUDSClient(socketPath);
  // Create a wrapper that retries with exponential backoff
  const retryWrapper = (method, inner) => __awaiter(this, void 0, void 0, function* () {
    const maxRetries = 10;
    const baseDelayMs = 32;
    const maxDelayMs = 512;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (method === "GET") {
          return yield inner();
        } else if (method === "POST") {
          return yield inner();
        }
        throw new Error(`Unsupported method: ${method}`);
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          if (!serverStarted) {
            startServer();
            serverStarted = true;
          }
          const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
          yield new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  });
  // Create a client proxy that uses retry logic
  const retryClient = {
    post: (path, body, signal) => retryWrapper("POST", () => client.post(path, body, signal)),
    get: (path, signal) => retryWrapper("GET", () => client.get(path, signal))
  };
  return new LocalWorkerClient(retryClient);
}
//# sourceMappingURL=simple-client.js.map