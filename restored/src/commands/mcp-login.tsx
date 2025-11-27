__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
      /* harmony export */handleMcpLogin: () => (/* binding */handleMcpLogin)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var node_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:http");
    /* harmony import */
    var node_http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_http__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/mcp-login.tsx");
    /* harmony import */
    var _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/utils/open-browser.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    const CALLBACK_PORT = 8787;
    const CALLBACK_PATH = "/callback";
    const CALLBACK_URL = `http://localhost:${CALLBACK_PORT}${CALLBACK_PATH}`;
    function getErrorMessage(err) {
      if (err && typeof err === "object" && "message" in err) {
        const m = err.message;
        if (typeof m === "string" && m.length > 0) return m;
      }
      if (typeof err === "string" && err.length > 0) return err;
      try {
        return JSON.stringify(err);
      } catch (_a) {
        return "Unknown error";
      }
    }
    function waitForOAuthCallback() {
      return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
          const server = (0, node_http__WEBPACK_IMPORTED_MODULE_1__.createServer)((req, res) => {
            if (!req.url) {
              res.statusCode = 400;
              res.end("Bad request");
              return;
            }
            const url = new URL(req.url, `http://localhost:${CALLBACK_PORT}`);
            if (url.pathname !== CALLBACK_PATH) {
              res.statusCode = 404;
              res.end("Not found");
              return;
            }
            const code = url.searchParams.get("code");
            const error = url.searchParams.get("error");
            if (code) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.end("<html><body><h1>Authorized</h1>You can close this window.</body></html>");
              resolve(code);
              setTimeout(() => server.close(), 1000);
            } else {
              res.statusCode = 400;
              res.end(`Auth failed: ${error !== null && error !== void 0 ? error : "No code"}`);
              reject(new Error(error !== null && error !== void 0 ? error : "No authorization code provided"));
              setTimeout(() => server.close(), 1000);
            }
          });
          server.listen(CALLBACK_PORT, () => {
            // ready to receive callback
          });
        });
      });
    }
    function handleMcpLogin(ctx, identifier, loader) {
      return __awaiter(this, void 0, void 0, function* () {
        const {
          rerender,
          waitUntilExit
        } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_2__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
          status: "starting",
          message: `Preparing MCP login for ${identifier}...`
        }));
        try {
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
            status: "in-progress",
            message: `Loading MCP server '${identifier}' from .cursor/mcp.json or ~/.cursor/mcp.json...`
          }));
          let client;
          try {
            client = yield loader.loadClient(ctx, identifier, true);
          } catch (e) {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
              status: "error",
              message: `Failed to load MCP '${identifier}': ${getErrorMessage(e)}`
            }));
            yield waitUntilExit();
            process.exit(1);
          }
          const state = yield client.getState(ctx);
          if (state.kind === "ready") {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
              status: "success",
              message: `MCP '${identifier}' is ready.`
            }));
            process.exit(0);
          } else if (state.kind === "requires_authentication") {
            const url = state.url;
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
              status: "in-progress",
              message: `MCP '${identifier}' requires authentication. Opening your browser...\nIf it doesn't open, navigate to:\n${url}\n\nListening on ${CALLBACK_URL} for the OAuth callback...`
            }));
            if (url && (0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_4__ /* .isLikelyToOpenBrowser */.g)(url)) {
              void (0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_4__ /* .openBrowser */.p)(url);
            }
            try {
              const code = yield waitForOAuthCallback();
              yield state.callback(code);
              // We don't exchange the code here; the server flow will complete in subsequent connects.
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
                status: "success",
                message: `Received authorization code '${code.substring(0, 6)}...'. You can close the browser. Re-running the command should now complete authentication.`
              }));
            } catch (e) {
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
                status: "error",
                message: `Authentication callback failed: ${getErrorMessage(e)}`
              }));
              yield waitUntilExit();
              process.exit(1);
            }
          } else {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
              status: "error",
              message: `Unknown MCP client state for '${identifier}'.`
            }));
            yield waitUntilExit();
            process.exit(1);
          }
          yield waitUntilExit();
          process.exit(0);
        } catch (error) {
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_mcp_login_js__WEBPACK_IMPORTED_MODULE_3__ /* .McpLogin */.U, {
            status: "error",
            message: `Unexpected error during MCP login: ${getErrorMessage(error)}`
          }));
          yield waitUntilExit();
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