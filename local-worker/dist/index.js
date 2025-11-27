// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  LocalWorkerClient: () => (/* reexport */LocalWorkerClient),
  createClient: () => (/* reexport */createClient),
  getProjectSocketPath: () => (/* reexport */getProjectSocketPath),
  runServer: () => (/* reexport */runServer)
});

// EXTERNAL MODULE: external "node:http"
var external_node_http_ = __webpack_require__("node:http");
// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var dist = __webpack_require__("../context/dist/index.js");
// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var utils_dist = __webpack_require__("../utils/dist/index.js");
; // ../local-worker/dist/simple-client.js
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
// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__("node:crypto");
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__("node:fs/promises");
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__("node:os");
// EXTERNAL MODULE: ../indexing-client/dist/index.js + 12 modules
var indexing_client_dist = __webpack_require__("../indexing-client/dist/index.js");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
// EXTERNAL MODULE: ../../node_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node_modules/vscode-languageserver-protocol/lib/node/main.js
var main = __webpack_require__("../../node_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node_modules/vscode-languageserver-protocol/lib/node/main.js");
; // ../local-lsp/dist/language.js
const LANGUAGE_EXTENSIONS = {
  ".abap": "abap",
  ".bat": "bat",
  ".bib": "bibtex",
  ".bibtex": "bibtex",
  ".clj": "clojure",
  ".coffee": "coffeescript",
  ".c": "c",
  ".cpp": "cpp",
  ".cxx": "cpp",
  ".cc": "cpp",
  ".c++": "cpp",
  ".cs": "csharp",
  ".css": "css",
  ".d": "d",
  ".pas": "pascal",
  ".pascal": "pascal",
  ".diff": "diff",
  ".patch": "diff",
  ".dart": "dart",
  ".dockerfile": "dockerfile",
  ".ex": "elixir",
  ".exs": "elixir",
  ".erl": "erlang",
  ".hrl": "erlang",
  ".fs": "fsharp",
  ".fsi": "fsharp",
  ".fsx": "fsharp",
  ".fsscript": "fsharp",
  ".gitcommit": "git-commit",
  ".gitrebase": "git-rebase",
  ".go": "go",
  ".groovy": "groovy",
  ".hbs": "handlebars",
  ".handlebars": "handlebars",
  ".hs": "haskell",
  ".html": "html",
  ".htm": "html",
  ".ini": "ini",
  ".java": "java",
  ".js": "javascript",
  ".jsx": "javascriptreact",
  ".json": "json",
  ".tex": "latex",
  ".latex": "latex",
  ".less": "less",
  ".lua": "lua",
  ".makefile": "makefile",
  makefile: "makefile",
  ".md": "markdown",
  ".markdown": "markdown",
  ".m": "objective-c",
  ".mm": "objective-cpp",
  ".pl": "perl",
  ".pm": "perl6",
  ".php": "php",
  ".ps1": "powershell",
  ".psm1": "powershell",
  ".pug": "jade",
  ".jade": "jade",
  ".py": "python",
  ".r": "r",
  ".cshtml": "razor",
  ".razor": "razor",
  ".rb": "ruby",
  ".rake": "ruby",
  ".gemspec": "ruby",
  ".ru": "ruby",
  ".erb": "erb",
  ".html.erb": "erb",
  ".js.erb": "erb",
  ".css.erb": "erb",
  ".json.erb": "erb",
  ".rs": "rust",
  ".scss": "scss",
  ".sass": "sass",
  ".scala": "scala",
  ".shader": "shaderlab",
  ".sh": "shellscript",
  ".bash": "shellscript",
  ".zsh": "shellscript",
  ".ksh": "shellscript",
  ".sql": "sql",
  ".swift": "swift",
  ".ts": "typescript",
  ".tsx": "typescriptreact",
  ".mts": "typescript",
  ".cts": "typescript",
  ".mtsx": "typescriptreact",
  ".ctsx": "typescriptreact",
  ".xml": "xml",
  ".xsl": "xsl",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".zig": "zig",
  ".zon": "zig"
};
//# sourceMappingURL=language.js.map
; // ../local-lsp/dist/utils.js
class DebounceTimer {
  constructor(timeout, resolve) {
    this.timeout = timeout;
    this.resolve = resolve;
    this.timer = null;
  }
  delay() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.resolve();
    }, this.timeout);
  }
}
function createDebounceTimer(timeout) {
  let resolve = () => {};
  const promise = new Promise(r => {
    resolve = r;
  });
  const timer = new DebounceTimer(timeout, resolve);
  timer.delay();
  return {
    promise,
    timer
  };
}
//# sourceMappingURL=utils.js.map
; // ../local-lsp/dist/generic-lsp-provider.js
var generic_lsp_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const MAX_DIAGNOSTICS_TIMEOUT_MS = 8000;
const logger = (0, dist /* createLogger */.h)("@anysphere/local-lsp:generic-provider");
class GenericRuntimeLspProvider {
  constructor(connection, dispose, debounceTimeout = 3000) {
    this.connection = connection;
    this.dispose = dispose;
    this.debounceTimeout = debounceTimeout;
    this.diagnosticsMap = new utils_dist /* LRUCache */.qK({
      max: 500
    });
    this.connection.onNotification(main.PublishDiagnosticsNotification.type, this.onDiagnostics.bind(this));
  }
  getDiagnosticsEntry(uri) {
    const entry = this.diagnosticsMap.get(uri);
    if (entry !== undefined) {
      return entry;
    }
    const {
      promise,
      timer
    } = createDebounceTimer(this.debounceTimeout);
    timer.delay();
    const newEntry = {
      diagnostics: [],
      debounceTimer: timer,
      debouncePromise: promise
    };
    this.diagnosticsMap.set(uri, newEntry);
    return newEntry;
  }
  onDiagnostics(params) {
    const entry = this.getDiagnosticsEntry(params.uri);
    entry.diagnostics = params.diagnostics;
    entry.debounceTimer.delay();
  }
  open(ctx, uri) {
    return generic_lsp_provider_awaiter(this, void 0, void 0, function* () {
      const content = yield external_node_fs_.promises.readFile(uri.toPath(), "utf8");
      const textDocument = {
        uri: uri.toString(),
        languageId: this.getLanguageId(uri.toPath()),
        version: 1,
        text: content
      };
      yield (0, dist /* run */.eF)(ctx, () => this.connection.sendNotification(main.DidOpenTextDocumentNotification.type, {
        textDocument
      }));
    });
  }
  getDiagnostics(ctx, uri) {
    return generic_lsp_provider_awaiter(this, void 0, void 0, function* () {
      /*
      // Note: This works in LSP >= 3.17, but some packages (e.g. typescript-language-server are still on 3.15 ish)
      const result = await this.connection.sendRequest(
        lsp.DocumentDiagnosticRequest.type,
        {
          textDocument: { uri: uri.toString() },
        }
      );
      */
      let cancel;
      [ctx, cancel] = ctx.withTimeoutAndCancel(MAX_DIAGNOSTICS_TIMEOUT_MS);
      const entry = this.getDiagnosticsEntry(uri.toString());
      yield Promise.race([entry.debouncePromise, (0, dist /* wait */.uk)(ctx)]);
      cancel();
      return entry.diagnostics.slice();
    });
  }
  shutdown(ctx) {
    return generic_lsp_provider_awaiter(this, void 0, void 0, function* () {
      if (!this.connection) {
        throw new Error("No active connection to shutdown");
      }
      yield (0, dist /* run */.eF)(ctx, () => generic_lsp_provider_awaiter(this, void 0, void 0, function* () {
        yield this.connection.sendRequest(main.ShutdownRequest.type);
        yield this.connection.sendNotification(main.ExitNotification.type);
      }));
      this.dispose();
    });
  }
  /**
   * Get the language ID for a file path using the extension mapping
   */
  getLanguageId(filePath) {
    const ext = external_node_path_.extname(filePath).toLowerCase();
    const filename = external_node_path_.basename(filePath).toLowerCase();
    // Check full filename first (for files like "makefile")
    if (LANGUAGE_EXTENSIONS[filename]) {
      return LANGUAGE_EXTENSIONS[filename];
    }
    // Then check extension
    if (ext && LANGUAGE_EXTENSIONS[ext]) {
      return LANGUAGE_EXTENSIONS[ext];
    }
    // Default to plaintext if not found
    return "plaintext";
  }
  /**
   * Factory method for internal use by GenericLspProviderFactory
   */
  static createAndInitialize(ctx, workspacePath, connection, debounceTimeout) {
    return generic_lsp_provider_awaiter(this, void 0, void 0, function* () {
      connection.listen();
      // Convert file path to URI
      const rootUri = new utils_dist /* FileURL */.qA(workspacePath).toString();
      const workspaceName = external_node_path_.basename(workspacePath);
      const initializeParams = {
        processId: process.pid,
        rootUri: rootUri,
        capabilities: {
          textDocument: {
            publishDiagnostics: {
              relatedInformation: true,
              versionSupport: false,
              tagSupport: {
                valueSet: [1, 2] // Unnecessary and Deprecated
              }
            },
            diagnostic: {
              dynamicRegistration: false
            }
          },
          workspace: {
            workspaceFolders: true
          }
        },
        workspaceFolders: [{
          uri: rootUri,
          name: workspaceName
        }]
      };
      try {
        logger.debug(ctx, "Sending LSP initialize request");
        yield connection.sendRequest(main.InitializeRequest.type, initializeParams);
        logger.debug(ctx, "Sending LSP initialized notification");
        yield connection.sendNotification(main.InitializedNotification.type, {});
        // Create provider with initialized connection and server
        const provider = new GenericRuntimeLspProvider(connection, () => {
          connection.dispose();
        }, debounceTimeout);
        return provider;
      } catch (error) {
        // Clean up connection on error
        try {
          connection.dispose();
        } catch (disposeError) {
          logger.warn(ctx, "error disposing connection", {
            error: disposeError instanceof Error ? disposeError.message : "unknown error"
          });
        }
        throw error;
      }
    });
  }
}
//# sourceMappingURL=generic-lsp-provider.js.map
; // ../local-lsp/dist/types.js
var types_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

/**
 * Mock implementation of RuntimeLspProvider when none are available
 */
class MockRuntimeLspProvider {
  open(_ctx, _uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      // No-op for mock
    });
  }
  getDiagnostics(_ctx, _uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      return [];
    });
  }
  shutdown(_ctx) {
    return types_awaiter(this, void 0, void 0, function* () {
      // No-op for mock
    });
  }
}
class LazyRuntimeLspProvider {
  constructor(provider) {
    this.provider = provider;
  }
  getProvider(ctx) {
    return types_awaiter(this, void 0, void 0, function* () {
      const provider = yield (0, dist /* run */.eF)(ctx.withName("lsp-provider-init"), () => this.provider);
      if (provider !== null) {
        return provider;
      }
      return new MockRuntimeLspProvider();
    });
  }
  open(ctx, uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      return (yield this.getProvider(ctx)).open(ctx, uri);
    });
  }
  getDiagnostics(ctx, uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      return (yield this.getProvider(ctx)).getDiagnostics(ctx, uri);
    });
  }
  shutdown(ctx) {
    return types_awaiter(this, void 0, void 0, function* () {
      return (yield this.getProvider(ctx)).shutdown(ctx);
    });
  }
}
//# sourceMappingURL=types.js.map
// EXTERNAL MODULE: external "node:child_process"
var external_node_child_process_ = __webpack_require__("node:child_process");
// EXTERNAL MODULE: ../../node_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node_modules/vscode-languageserver-protocol/node.js
var node = __webpack_require__("../../node_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node_modules/vscode-languageserver-protocol/node.js");
; // ../local-lsp/dist/typescript-lsp-provider.js
var typescript_lsp_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const typescript_lsp_provider_logger = (0, dist /* createLogger */.h)("@anysphere/local-lsp:typescript-provider");
/**
 * Factory class implementing LspProviderFactory for TypeScript
 */
class TypescriptLspProviderFactory {
  constructor(ctx, debounceTimeout = 3000) {
    this.ctx = ctx;
    this.debounceTimeout = debounceTimeout;
  }
  create(workspacePath) {
    return typescript_lsp_provider_awaiter(this, void 0, void 0, function* () {
      // Check if npx is available and use it to run typescript-language-server
      let npxResult;
      try {
        // Use the established pattern from the codebase for finding executables
        npxResult = (0, utils_dist /* findActualExecutable */.Ef)("npx", []);
        if (npxResult.cmd === "npx") {
          // npx not found
          typescript_lsp_provider_logger.error(this.ctx, "npx not found in PATH", {
            cmd: npxResult.cmd
          });
          return null;
        }
      } catch (err) {
        typescript_lsp_provider_logger.error(this.ctx, "npx not found in PATH", err);
        return null;
      }
      typescript_lsp_provider_logger.debug(this.ctx, "Starting typescript-language-server", {
        npxPath: npxResult.cmd
      });
      const command = npxResult.cmd;
      const spawnArgs = ["-y", "typescript-language-server", "--stdio"];
      const spawnOptions = {
        env: process.env,
        cwd: workspacePath,
        windowsHide: true,
        detached: false
      };
      const childProcess = (0, external_node_child_process_.spawn)(command, spawnArgs, Object.assign(Object.assign({}, spawnOptions), {
        stdio: ["pipe", "pipe", "pipe"]
      }));
      typescript_lsp_provider_logger.debug(this.ctx, `Child Typescript LSP process spawned with PID: ${childProcess.pid}`);
      // Log spawn errors
      childProcess.on("error", err => {
        typescript_lsp_provider_logger.error(this.ctx, "Failed to spawn TypeScript LSP process", {
          error: err.message,
          code: err.code,
          errno: err.errno,
          syscall: err.syscall,
          path: err.path
        });
      });
      childProcess.on("exit", (code, signal) => {
        typescript_lsp_provider_logger.info(this.ctx, `Child process exited with code: ${code}, signal: ${signal}`);
      });
      // Log stderr output for debugging (only log errors, not chunks)
      if (childProcess.stderr) {
        childProcess.stderr.on("data", data => {
          const chunk = data.toString();
          typescript_lsp_provider_logger.error(this.ctx, "TypeScript Server stderr chunk:", {
            stderr: chunk
          });
        });
      }
      if (!childProcess.stdout || !childProcess.stdin) {
        throw new Error("Failed to create stdio streams");
      }
      /*
      // Note: This pattern is very useful for getting debug logs.
      // Create a transform stream for logging stdout
      const stdoutLogger = new Transform({
        transform: (chunk, _encoding, callback) => {
          logger.info(this.ctx, "TypeScript Server stdout:", {
            stdout: chunk.toString(),
          });
          callback(null, chunk);
        },
      });
      // Pipe stdout through the logger
      childProcess.stdout.pipe(stdoutLogger);
      */
      // Create protocol connection using the logged stream
      const connection = (0, node.createProtocolConnection)(new node.StreamMessageReader(childProcess.stdout), new node.StreamMessageWriter(childProcess.stdin));
      try {
        return yield GenericRuntimeLspProvider.createAndInitialize(this.ctx, workspacePath, connection, this.debounceTimeout);
      } catch (error) {
        typescript_lsp_provider_logger.debug(this.ctx, "did not initialize LSP provider", {
          error: error instanceof Error ? error.message : "unknown error"
        });
        return null;
      }
    });
  }
}
//# sourceMappingURL=typescript-lsp-provider.js.map
; // ../local-lsp/dist/index.js

//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ../proto/dist/generated/aiserver/v1/repository_pb.js
var repository_pb = __webpack_require__("../proto/dist/generated/aiserver/v1/repository_pb.js");
; // ../local-worker/dist/indexing-manager.js
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
// EXTERNAL MODULE: external "node:url"
var external_node_url_ = __webpack_require__("node:url");
; // ../local-worker/dist/router.js
var router_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class Router {
  constructor() {
    this.routes = [];
  }
  post(path, handler) {
    this.routes.push({
      method: "POST",
      path,
      handler
    });
  }
  get(path, handler) {
    this.routes.push({
      method: "GET",
      path,
      handler
    });
  }
  handle(req, res) {
    return router_awaiter(this, void 0, void 0, function* () {
      const url = new external_node_url_.URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const pathname = url.pathname;
      const method = req.method || "GET";
      // Find matching route
      const route = this.routes.find(r => r.method === method && r.path === pathname);
      if (route) {
        try {
          yield route.handler(req, res);
        } catch (error) {
          console.error("Route handler error:", error);
          if (!res.headersSent) {
            res.writeHead(500, {
              "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
              error: "Internal server error"
            }));
          }
        }
      } else {
        res.writeHead(404, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          error: `Cannot ${method} ${pathname}`
        }));
      }
    });
  }
}
//# sourceMappingURL=router.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var lib = __webpack_require__("../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs");
; // ../local-worker/dist/types.js

// openFile
const openRequestSchema = lib /* default.object */.Ay.object({
  url: lib /* default.string */.Ay.string()
});
const openResponseSchema = lib /* default.object */.Ay.object({
  success: lib /* default.boolean */.Ay.boolean()
});
// sleep
const sleepRequestSchema = lib /* default.object */.Ay.object({
  duration: lib /* default.number */.Ay.number()
});
const sleepResponseSchema = lib /* default.object */.Ay.object({
  success: lib /* default.boolean */.Ay.boolean()
});
// getDiagnostics
const getDiagnosticsRequestSchema = lib /* default.object */.Ay.object({
  url: lib /* default.string */.Ay.string()
});
const diagnosticSchema = lib /* default.object */.Ay.object({
  severity: lib /* default.union */.Ay.union([lib /* default.literal */.Ay.literal(1), lib /* default.literal */.Ay.literal(2), lib /* default.literal */.Ay.literal(3), lib /* default.literal */.Ay.literal(4)]).optional(),
  message: lib /* default.string */.Ay.string(),
  range: lib /* default.object */.Ay.object({
    start: lib /* default.object */.Ay.object({
      line: lib /* default.number */.Ay.number(),
      character: lib /* default.number */.Ay.number()
    }),
    end: lib /* default.object */.Ay.object({
      line: lib /* default.number */.Ay.number(),
      character: lib /* default.number */.Ay.number()
    })
  }),
  source: lib /* default.string */.Ay.string().optional(),
  code: lib /* default.union */.Ay.union([lib /* default.string */.Ay.string(), lib /* default.number */.Ay.number()]).optional()
});
const getDiagnosticsResponseSchema = lib /* default.object */.Ay.object({
  diagnostics: lib /* default.array */.Ay.array(diagnosticSchema)
});
// getIndexingStatus
const getIndexingStatusRequestSchema = lib /* default.object */.Ay.object({});
const getIndexingStatusResponseSchema = lib /* default.custom */.Ay.custom();
// decryptPath
const decryptPathRequestSchema = lib /* default.object */.Ay.object({
  encryptedPath: lib /* default.string */.Ay.string()
});
const decryptPathResponseSchema = lib /* default.object */.Ay.object({
  url: lib /* default.string */.Ay.string()
});
// getRepositoryInfo
const getRepositoryInfoRequestSchema = lib /* default.object */.Ay.object({});
const getRepositoryInfoResponseSchema = lib /* default.object */.Ay.object({
  relativeWorkspacePath: lib /* default.string */.Ay.string(),
  repoName: lib /* default.string */.Ay.string(),
  repoOwner: lib /* default.string */.Ay.string(),
  isLocal: lib /* default.boolean */.Ay.boolean(),
  numFiles: lib /* default.number */.Ay.number(),
  isTracked: lib /* default.boolean */.Ay.boolean(),
  remoteNames: lib /* default.array */.Ay.array(lib /* default.string */.Ay.string()),
  remoteUrls: lib /* default.array */.Ay.array(lib /* default.string */.Ay.string()),
  workspaceUri: lib /* default.string */.Ay.string(),
  orthogonalTransformSeed: lib /* default.number */.Ay.number(),
  pathEncryptionKey: lib /* default.string */.Ay.string()
});
//# sourceMappingURL=types.js.map
; // ../local-worker/dist/zod-utils.js
var zod_utils_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function parseBody(req) {
  return zod_utils_awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const trimmed = body.trim();
          // Allow empty bodies (e.g., GET requests) to be treated as empty objects
          if (trimmed.length === 0) {
            resolve({});
            return;
          }
          resolve(JSON.parse(trimmed));
        } catch (_error) {
          reject(new Error("Invalid JSON body"));
        }
      });
      req.on("error", reject);
    });
  });
}
function handleZodRequest(req, res, schema, handler) {
  return zod_utils_awaiter(this, void 0, void 0, function* () {
    try {
      const body = yield parseBody(req);
      const parsed = schema.parse(body);
      const result = yield handler(parsed);
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(error instanceof lib.z.ZodError ? 400 : 500, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }));
    }
  });
}
//# sourceMappingURL=zod-utils.js.map
; // ../local-worker/dist/simple-server.js
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
; // ../local-worker/dist/worker-utils.js

function getProjectSocketPath(projectDir) {
  if (false)
    // removed by dead control flow
    {}
  // On Unix-like systems, use a traditional socket file
  return (0, external_node_path_.join)(projectDir, "worker.sock");
}
//# sourceMappingURL=worker-utils.js.map
; // ../local-worker/dist/index.js
//#!/usr/bin/env node
// Export the simple client implementation

// Export the simple server implementation

//# sourceMappingURL=index.js.map

/***/