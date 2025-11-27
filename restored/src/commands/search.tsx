__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
      /* harmony export */handleSearch: () => (/* binding */handleSearch)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../context/dist/index.js");
    /* harmony import */
    var _anysphere_indexing_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../indexing-client/dist/index.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_repository_connect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../proto/dist/generated/aiserver/v1/repository_connect.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_repository_pb_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../proto/dist/generated/aiserver/v1/repository_pb.js");
    /* harmony import */
    var _connectrpc_connect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect@1.6.1_patch_hash=5qy7enogvswcu53n3mftrkxwei_@bufbuild+protobuf@1.10.0/node_modules/@connectrpc/connect/dist/esm/promise-client.js");
    /* harmony import */
    var _connectrpc_connect_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/.pnpm/@connectrpc+connect-node@1.6.1_@bufbuild+protobuf@1.10.0_@connectrpc+connect@1.6.1_patch_hash_yu5ivmw5nlvm6v3w7brw2bvqt4/node_modules/@connectrpc/connect-node/dist/esm/index.js");
    /* harmony import */
    var _components_search_results_ui_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/components/search-results-ui.tsx");
    /* harmony import */
    var _console_io_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/console-io.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _components_search_results_ui_js__WEBPACK_IMPORTED_MODULE_7__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _components_search_results_ui_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    function createAuthInterceptor(credentialManager) {
      return next => req => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const accessToken = yield credentialManager.getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found");
        }
        req.header.set("authorization", `Bearer ${accessToken}`);
        const clientVersion = (_a = "2025.11.25-d5b3271") !== null && _a !== void 0 ? _a : "unknown";
        req.header.set("x-cursor-client-version", `cli-${clientVersion}`);
        return yield next(req);
      });
    }
    // We don't need the EncryptionSchemeProvider since we build the identity with encryption scheme directly
    class LocalWorkerRepositoryIdentityProvider {
      constructor(repoName, repoOwner, pathEncryptionKey) {
        this.repoName = repoName;
        this.repoOwner = repoOwner;
        this.pathEncryptionKey = pathEncryptionKey;
      }
      loadRepositoryIdentity() {
        const encryptionScheme = new _anysphere_indexing_client__WEBPACK_IMPORTED_MODULE_2__ /* .V1MasterKeyedEncryptionScheme */.Gv(this.pathEncryptionKey);
        return Promise.resolve({
          repoName: this.repoName,
          repoOwner: this.repoOwner,
          encryptionScheme
        });
      }
    }
    function handleSearch(query, localWorkerClient, credentialManager, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const {
          rerender
        } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
          children: ["\uD83D\uDD0D Searching for \"", query, "\"..."]
        }));
        try {
          const ctx = (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_1__ /* .createContext */.q6)();
          // Get repository info from local worker
          const repositoryInfo = yield localWorkerClient.getRepositoryInfo();
          if (!repositoryInfo.repoName || !repositoryInfo.repoOwner) {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
              color: "red",
              children: "\u274C Repository not properly initialized"
            }));
            process.exit(1);
          }
          // Create repository client for search
          const repositoryTransport = (0, _connectrpc_connect_node__WEBPACK_IMPORTED_MODULE_6__ /* .createConnectTransport */.wQ)({
            baseUrl: options.repoEndpoint,
            httpVersion: options.repoHttpVersion,
            interceptors: [createAuthInterceptor(credentialManager)],
            nodeOptions: {
              rejectUnauthorized: !options.repoInsecure
            }
          });
          const repositoryClient = (0, _connectrpc_connect__WEBPACK_IMPORTED_MODULE_8__ /* .createClient */.UU)(_anysphere_proto_aiserver_v1_repository_connect_js__WEBPACK_IMPORTED_MODULE_4__ /* .RepositoryService */.B, repositoryTransport);
          const clientRepositoryInfo = new _anysphere_proto_aiserver_v1_repository_pb_js__WEBPACK_IMPORTED_MODULE_5__ /* .ClientRepositoryInfo */.Ym({});
          const repositoryIdentityProvider = new LocalWorkerRepositoryIdentityProvider(repositoryInfo.repoName, repositoryInfo.repoOwner, repositoryInfo.pathEncryptionKey || "");
          const repositoryIndexer = new _anysphere_indexing_client__WEBPACK_IMPORTED_MODULE_2__ /* .RepositoryClient */.q$(repositoryClient, clientRepositoryInfo, repositoryIdentityProvider, process.cwd());
          // Perform the search
          const results = yield repositoryIndexer.search(ctx, query);
          // Render results with nice UI
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
            children: "\u2705 Search completed"
          }));
          if (!results || results.length === 0) {
            (0, _components_search_results_ui_js__WEBPACK_IMPORTED_MODULE_7__ /* .renderSearchResults */.X)(query, []);
          } else {
            (0, _components_search_results_ui_js__WEBPACK_IMPORTED_MODULE_7__ /* .renderSearchResults */.X)(query, results);
          }
          process.exit(0);
        } catch (error) {
          (0, _console_io_js__WEBPACK_IMPORTED_MODULE_9__ /* .intentionallyWriteToStderr */.p2)(error instanceof Error ? error.message : String(error));
          process.exit(1);
        }
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/