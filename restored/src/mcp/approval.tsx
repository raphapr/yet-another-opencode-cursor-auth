__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Cz: () => (/* binding */approveMcpServers),
      /* harmony export */Ny: () => (/* binding */runMcpApproval),
      /* harmony export */Vh: () => (/* binding */getUnapprovedMcpServers)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var node_os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:os");
    /* harmony import */
    var node_os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */
    var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../cursor-config/dist/index.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../mcp-agent-exec/dist/index.js");
    /* harmony import */
    var _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/approval-dialog.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_6__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__, _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    function getUnapprovedMcpServers(cwd, projectDir) {
      return __awaiter(this, void 0, void 0, function* () {
        const unapprovedServers = {
          mcpServers: {}
        };
        // Combine servers with project-level overriding user-level on name collision
        const globalConfigDir = node_path__WEBPACK_IMPORTED_MODULE_2___default().join((0, node_os__WEBPACK_IMPORTED_MODULE_1__.homedir)(), ".cursor", "mcp.json");
        const cwdConfigPath = node_path__WEBPACK_IMPORTED_MODULE_2___default().join(cwd, ".cursor", "mcp.json");
        const globalConfig = yield (0, _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_5__ /* .getMcpConfig */.h1)(globalConfigDir);
        const cwdConfig = yield (0, _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_5__ /* .getMcpConfig */.h1)(cwdConfigPath);
        const approvalStore = new _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_5__ /* .FileBasedMcpApprovalStore */.mF(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(projectDir, "mcp-approvals.json"), cwd);
        const approvals = yield approvalStore.getApprovals();
        for (const [name, server] of [...Object.entries(globalConfig.mcpServers), ...Object.entries(cwdConfig.mcpServers)]) {
          const approvalKey = (0, _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_5__ /* .generateApprovalKey */.Ko)(name, server, cwd);
          if (!approvals.includes(approvalKey)) {
            unapprovedServers.mcpServers[name] = server;
          }
        }
        return unapprovedServers;
      });
    }
    function approveMcpServers(servers, cwd, projectDir) {
      return __awaiter(this, void 0, void 0, function* () {
        const approvalStore = new _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_5__ /* .FileBasedMcpApprovalStore */.mF(node_path__WEBPACK_IMPORTED_MODULE_2___default().join(projectDir, "mcp-approvals.json"), cwd);
        const approvalKeys = Object.entries(servers.mcpServers).map(([name, server]) => (0, _anysphere_mcp_agent_exec__WEBPACK_IMPORTED_MODULE_5__ /* .generateApprovalKey */.Ko)(name, server, cwd));
        yield approvalStore.addApprovals(approvalKeys);
      });
    }
    function runMcpApproval(workspace) {
      return __awaiter(this, void 0, void 0, function* () {
        const cwd = workspace !== null && workspace !== void 0 ? workspace : process.cwd();
        const projectDir = (0, _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_3__ /* .getProjectDir */.Xq)(cwd);
        const unapprovedServers = yield getUnapprovedMcpServers(cwd, projectDir);
        if (Object.keys(unapprovedServers.mcpServers).length === 0) {
          return true;
        }
        const options = [{
          key: "a",
          label: "Approve all servers",
          value: "approved"
        }, {
          key: "c",
          label: "Continue without approval",
          value: "continued"
        }, {
          key: "q",
          label: "Quit",
          value: "quit"
        }];
        const result = yield (0, _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_6__ /* .runApprovalDialog */.b)({
          title: "MCP Server Approval Required",
          description: ["Some MCP servers can execute code and read your data. Learn more at docs.cursor.com/context/mcp", "The following MCP servers need to be approved:"],
          content: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
            children: Object.entries(unapprovedServers.mcpServers).map(([name, server]) => (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Text */.EY, {
              color: "cyan",
              children: ["\u2022 ", name, "command" in server && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Text */.EY, {
                color: "gray",
                children: [" (command: ", server.command, ")"]
              }), "url" in server && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_4__ /* .Text */.EY, {
                color: "gray",
                children: [" (url: ", server.url, ")"]
              })]
            }, name))
          }),
          options,
          onAction: action => __awaiter(this, void 0, void 0, function* () {
            if (action === "approved") {
              yield approveMcpServers(unapprovedServers, cwd, projectDir);
            }
          })
        });
        return result;
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/