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