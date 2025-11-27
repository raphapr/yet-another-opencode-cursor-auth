__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */d: () => (/* binding */useSlashCommands)
      /* harmony export */
    });
    /* harmony import */
    var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
    /* harmony import */
    var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
    /* harmony import */
    var node_crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:crypto");
    /* harmony import */
    var node_crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:fs");
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */
    var node_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("node:http");
    /* harmony import */
    var node_http__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_http__WEBPACK_IMPORTED_MODULE_3__);
    /* harmony import */
    var node_os__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("node:os");
    /* harmony import */
    var node_os__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_4__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_5__);
    /* harmony import */
    var _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../proto/dist/generated/aiserver/v1/dashboard_pb.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _commands_custom_commands_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/commands/custom-commands.ts");
    /* harmony import */
    var _commands_logout_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/commands/logout.tsx");
    /* harmony import */
    var _commands_set_line_numbers_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/commands/set-line-numbers.ts");
    /* harmony import */
    var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/context/agent-state-context.tsx");
    /* harmony import */
    var _context_config_context_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./src/context/config-context.tsx");
    /* harmony import */
    var _context_slash_command_context_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./src/context/slash-command-context.tsx");
    /* harmony import */
    var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./src/context/vim-mode-context.tsx");
    /* harmony import */
    var _debug_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./src/debug.ts");
    /* harmony import */
    var _state_index_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/state/index.ts");
    /* harmony import */
    var _state_session_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/state/session.ts");
    /* harmony import */
    var _utils_fuzzy_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./src/utils/fuzzy.ts");
    /* harmony import */
    var _utils_git_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./src/utils/git.ts");
    /* harmony import */
    var _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./src/utils/open-browser.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_commands_logout_js__WEBPACK_IMPORTED_MODULE_9__]);
    _commands_logout_js__WEBPACK_IMPORTED_MODULE_9__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
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
          const server = (0, node_http__WEBPACK_IMPORTED_MODULE_3__.createServer)((req, res) => {
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
    /**
     * Build the slash command list. Recomputed when relevant params change.
     */
    function useSlashCommands({
      credentialManager,
      configProvider,
      modelManager,
      mcpLoader,
      dashboardClient
    }) {
      const {
        vimEnabled,
        toggleVimEnabled
      } = (0, _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_14__ /* .useVimMode */.v)();
      const _showLineNumbers = (0, _context_config_context_js__WEBPACK_IMPORTED_MODULE_12__ /* .useShowLineNumbers */.$i)();
      const {
        dynamicCommands
      } = (0, _context_slash_command_context_js__WEBPACK_IMPORTED_MODULE_13__ /* .useSlashCommandRegistry */.x)();
      const {
        agentStore,
        setIsSummarizing
      } = (0, _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_11__ /* .useAgentState */.C9)();
      const [models, setModels] = (0, react__WEBPACK_IMPORTED_MODULE_7__.useState)(() => modelManager.getAvailableModels());
      const [cursorCommands, setCursorCommands] = (0, react__WEBPACK_IMPORTED_MODULE_7__.useState)([]);
      (0, react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
        const unsubscribe = modelManager.subscribe(() => {
          setModels(modelManager.getAvailableModels());
        });
        return unsubscribe;
      }, [modelManager]);
      // Load cursor commands from .cursor/commands directories
      (0, react__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
        const loadCursorCommands = () => __awaiter(this, void 0, void 0, function* () {
          try {
            const projectRoot = (0, _utils_git_js__WEBPACK_IMPORTED_MODULE_18__ /* .findGitRoot */.k)(process.cwd()) || process.cwd();
            const loader = new _commands_custom_commands_js__WEBPACK_IMPORTED_MODULE_8__ /* .CustomCommandsLoader */.F(dashboardClient);
            const commands = yield loader.loadCommands(projectRoot);
            setCursorCommands(commands);
          } catch (error) {
            (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("Failed to load cursor commands:", error);
            setCursorCommands([]);
          }
        });
        void loadCursorCommands();
      }, [dashboardClient]);
      return (0, react__WEBPACK_IMPORTED_MODULE_7__.useMemo)(() => {
        const cmds = [];
        // Clear: start a new chat session ---------------------------------------
        // Model alias ------------------------------------------------------------
        cmds.push({
          id: "model",
          title: "Model",
          description: "Set the current model",
          args: [{
            id: "model"
          }],
          getArgSuggestions: (_ctx, typedArgs, _slashCommandCtx) => {
            const fragment = (typedArgs[0] || "").trim();
            const base = models.map(m => ({
              value: m.displayModelId,
              description: m.displayName
            }));
            if (!fragment) return base;
            const scored = base.map(s => ({
              s,
              score: (0, _utils_fuzzy_js__WEBPACK_IMPORTED_MODULE_20__ /* .fuzzyScore */.dt)(`${s.value} ${s.description}`, fragment)
            })).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.s.value.localeCompare(b.s.value));
            return scored.map(x => x.s);
          },
          run: (_ctx, args, slashCommandCtx) => {
            var _a, _b;
            const raw = args[0];
            if (!raw) return;
            const canonical = modelManager.normalizeModelId(raw);
            if (!canonical) {
              (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
              throw new Error(`Unknown model: ${raw}.`);
            }
            (_b = slashCommandCtx.onModelChange) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, canonical);
            slashCommandCtx.insertText("");
          }
        });
        // Auto-run ---------------------------------------------------------------
        cmds.push({
          id: "auto-run",
          title: "Auto-Run",
          description: "Toggle auto-run (default) or set [on|off|status]",
          args: [{
            id: "state",
            required: false
          }],
          getArgSuggestions: (_ctx, typedArgs, _slashCommandCtx) => {
            const fragment = (typedArgs[0] || "").trim().toLowerCase();
            const options = [{
              value: "on",
              description: "Enable auto-run"
            }, {
              value: "off",
              description: "Disable auto-run"
            }, {
              value: "toggle",
              description: "Toggle auto-run"
            }, {
              value: "status",
              description: "Show current status"
            }];
            if (!fragment) return options;
            return options.filter(o => o.value.startsWith(fragment));
          },
          run: (_ctx, args, slashCommandCtx) => {
            var _a, _b, _c, _d;
            const raw = (args[0] || "").trim().toLowerCase();
            const current = agentStore.getMetadata("mode");
            if (raw === "status") {
              (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [[{
                text: "Auto-run is ",
                dim: true
              }, {
                text: current === "auto-run" ? "ON" : "OFF",
                color: current === "auto-run" ? "green" : "gray"
              }]]);
              slashCommandCtx.insertText("");
              return;
            }
            let next;
            if (raw === "" || raw === "toggle") next = current === "auto-run" ? "default" : "auto-run";else if (raw === "on") next = "auto-run";else if (raw === "off") next = "default";else {
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: "Usage: /auto-run [on|off|toggle|status]",
                color: "red"
              }]]);
              (_c = slashCommandCtx.clearInput) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx);
              return;
            }
            agentStore.setMetadata("mode", next);
            if (next === "default") {
              (_d = slashCommandCtx.print) === null || _d === void 0 ? void 0 : _d.call(slashCommandCtx, [[{
                text: "Auto-run ",
                dim: true
              }, {
                text: "disabled",
                color: "gray"
              }]]);
            }
            slashCommandCtx.insertText("");
          }
        });
        const createNewChat = slashCommandCtx => __awaiter(this, void 0, void 0, function* () {
          var _a, _b, _c, _d, _e, _f, _g;
          (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [[{
            text: "Aborting current operation...",
            color: "yellow"
          }]]);
          if (!slashCommandCtx.onNewChat) {
            (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
              text: "Restarting requires CLI reload; press Ctrl-C twice.",
              color: "yellow"
            }]]);
            (_c = slashCommandCtx.clearInput) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx);
            return;
          }
          (_d = slashCommandCtx.clearInput) === null || _d === void 0 ? void 0 : _d.call(slashCommandCtx);
          (_e = slashCommandCtx.print) === null || _e === void 0 ? void 0 : _e.call(slashCommandCtx, [[{
            text: "Creating new chat...",
            color: "cyan"
          }]]);
          const id = yield slashCommandCtx.onNewChat();
          const nextId = id || ((_f = slashCommandCtx.getChatId) === null || _f === void 0 ? void 0 : _f.call(slashCommandCtx));
          if (nextId) (_g = slashCommandCtx.print) === null || _g === void 0 ? void 0 : _g.call(slashCommandCtx, [[{
            text: `New chat: ${nextId}`,
            color: "cyan"
          }]]);
          slashCommandCtx.insertText("");
        });
        // Clear: start a new chat session ---------------------------------------------
        cmds.push({
          id: "clear",
          title: "Clear",
          description: "Start a new chat session",
          boostedAlts: ["new", "new-chat", "newchat"],
          run: (_ctx, _args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            yield createNewChat(slashCommandCtx);
          })
        });
        // Compress conversation (summarize) -------------------------------------
        cmds.push({
          id: "compress",
          title: "Compress Conversation",
          description: "Summarize the conversation to reduce context",
          run: (_ctx, _args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            const conversationStateStructure = agentStore.getConversationStateStructure();
            if (conversationStateStructure.turns.length === 0) {
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: "No active session.",
                color: "red"
              }]]);
              return;
            }
            try {
              setIsSummarizing(true);
            } catch (_d) {
              // Ignore errors setting summarizing state
            }
            yield (_c = slashCommandCtx.onSummarize) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx);
          })
        });
        // Vim toggle -------------------------------------------------------------
        cmds.push({
          id: "vim",
          title: "Vim Mode",
          description: "Toggle Vim keys",
          run: (_ctx, _args, slashCommandCtx) => {
            var _a;
            toggleVimEnabled();
            (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [`Vim mode ${!vimEnabled ? "enabled" : "disabled"}`]);
            slashCommandCtx.insertText("");
          }
        });
        // Line numbers toggle ----------------------------------------------------
        cmds.push({
          id: "line-numbers",
          title: "Line Numbers",
          description: "Toggle line numbers in code blocks",
          boostedAlts: ["lines", "numbers"],
          run: (_ctx, _args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
              const newValue = yield (0, _commands_set_line_numbers_js__WEBPACK_IMPORTED_MODULE_10__ /* .handleToggleLineNumbers */.x)(configProvider);
              (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [`Line numbers ${newValue ? "enabled" : "disabled"}`]);
              slashCommandCtx.insertText("");
            } catch (error) {
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [`Error toggling line numbers: ${String(error)}`]);
              slashCommandCtx.insertText("");
            }
          })
        });
        // Shell Mode -------------------------------------------------------------
        cmds.push({
          id: "shell",
          title: "Shell Mode",
          description: "Enter Shell Mode (hint: type ! on an empty line)",
          boostedAlts: ["sh", "run"],
          inline: true,
          args: [{
            id: "command",
            required: false
          }],
          run: (_ctx, args, slashCommandCtx) => {
            var _a;
            // Flip Shell Mode on (no ephemeral output)
            (_a = slashCommandCtx.enterShellMode) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            const inline = (args || []).join(" ").trim();
            if (inline.length > 0) {
              slashCommandCtx.insertText(inline);
            } else {
              slashCommandCtx.insertText("");
            }
          }
        });
        // Help -------------------------------------------------------------------
        const helpCmd = {
          id: "help",
          title: "Help",
          description: "Show help (/help [cmd])",
          args: [{
            id: "command",
            required: false
          }],
          getArgSuggestions: (_ctx, typedArgs, _slashCommandCtx) => {
            const fragmentRaw = ((typedArgs === null || typedArgs === void 0 ? void 0 : typedArgs[0]) || "").trim();
            const fragment = fragmentRaw.toLowerCase();
            const base = cmds.filter(c => c.id !== "help").map(c => ({
              value: c.id,
              description: c.title
            }));
            if (!fragment) return base;
            const scored = base.map(s => ({
              s,
              // Prefer prefix match heavily, then fuzzy score
              prefix: s.value.toLowerCase().startsWith(fragment) ? 1 : 0,
              score: (0, _utils_fuzzy_js__WEBPACK_IMPORTED_MODULE_20__ /* .fuzzyScore */.dt)(`${s.value} ${s.description || ""}`, fragmentRaw)
            })).filter(x => x.score > 0 || x.prefix > 0).sort((a, b) => b.prefix - a.prefix || b.score - a.score || a.s.value.localeCompare(b.s.value));
            return scored.map(x => x.s);
          },
          run: (_ctx, args, slashCommandCtx) => {
            var _a, _b, _c, _d;
            const all = cmds.filter(c => c.id !== "help");
            const targetId = args[0];
            if (!targetId) {
              const lines = [[{
                text: "Commands:",
                color: "cyan",
                bold: true
              }]];
              for (const c of all) {
                const usageArgs = (c.args || []).map(a => a.required !== false ? `<${a.id}>` : `[${a.id}]`).join(" ");
                const usage = `/${c.id}${usageArgs ? ` ${usageArgs}` : ""}`;
                lines.push([{
                  text: usage,
                  color: "cyan"
                }, ...(c.description ? [{
                  text: " - ",
                  color: "gray"
                }, {
                  text: c.description,
                  dim: true
                }] : [])]);
              }
              lines.push([]);
              lines.push([{
                text: "Hint:",
                color: "cyan",
                bold: true
              }, {
                text: " /help <command> for details",
                dim: true
              }]);
              (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, lines);
              slashCommandCtx.insertText("");
              return;
            }
            const cmd = all.find(c => c.id.toLowerCase() === targetId.toLowerCase());
            if (!cmd) {
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [`Unknown command: ${targetId}`, "Run /help to list all commands."]);
              (_c = slashCommandCtx.clearInput) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx);
              return;
            }
            const argUsage = (cmd.args || []).map(a => a.required !== false ? `<${a.id}>` : `[${a.id}]`).join(" ");
            const usage = `/${cmd.id}${argUsage ? ` ${argUsage}` : ""}`;
            const lines = [[{
              text: "Usage:",
              color: "cyan",
              bold: true
            }, {
              text: ` ${usage}`,
              color: "cyan"
            }]];
            if (cmd.description) {
              lines.push([{
                text: cmd.description,
                dim: true
              }]);
            }
            if (cmd.args && cmd.args.length > 0) {
              lines.push([{
                text: "Arguments:",
                color: "cyan",
                bold: true
              }]);
              for (const a of cmd.args) {
                lines.push([{
                  text: a.required !== false ? `<${a.id}>` : `[${a.id}]`,
                  color: "cyan"
                }]);
              }
            }
            (_d = slashCommandCtx.print) === null || _d === void 0 ? void 0 : _d.call(slashCommandCtx, lines);
            slashCommandCtx.insertText("");
          }
        };
        cmds.push(helpCmd);
        // Feedback ---------------------------------------------------------------
        cmds.push({
          id: "feedback",
          title: "Feedback",
          description: "Share feedback with the team",
          args: [{
            id: "message",
            required: true
          }],
          run: (_ctx, args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const inline = args.join(" ").trim();
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
              text: "Sending feedback...",
              color: "cyan"
            }]]);
            try {
              yield dashboardClient.submitFeedback(new _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_6__ /* .SubmitFeedbackRequest */.h5c({
                message: inline,
                version: (_c = "2025.11.25-d5b3271") !== null && _c !== void 0 ? _c : "unknown",
                lastAgentReqId: (_d = _state_session_js__WEBPACK_IMPORTED_MODULE_17__ /* .session */.d.getLastRequestId()) !== null && _d !== void 0 ? _d : undefined
              }));
              (_e = slashCommandCtx.print) === null || _e === void 0 ? void 0 : _e.call(slashCommandCtx, [[{
                text: "Feedback sent. Thank you!",
                color: "green"
              }]]);
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/feedback: success");
            } catch (e) {
              (_f = slashCommandCtx.print) === null || _f === void 0 ? void 0 : _f.call(slashCommandCtx, [[{
                text: "Failed to send feedback",
                color: "red"
              }]]);
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/feedback: error", String(e));
            } finally {
              slashCommandCtx.insertText("");
              (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/feedback: done");
            }
          })
        });
        // Open in Cursor ---------------------------------------------------------
        const runOpenInCursor = (_ctx, _args, slashCommandCtx) => {
          var _a, _b, _c;
          (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
          let dir;
          try {
            const out = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", ["rev-parse", "--show-toplevel"], {
              encoding: "utf8"
            });
            dir = out.trim();
          } catch (_d) {
            dir = process.cwd();
          }
          (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
            text: "Opening ",
            dim: true
          }, {
            text: dir,
            color: "cyan"
          }, {
            text: " in Cursor...",
            dim: true
          }]]);
          try {
            const child = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)("cursor", [dir], {
              stdio: "ignore",
              detached: true
            });
            if (typeof child.unref === "function") child.unref();
            (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/open: launched cursor", dir);
          } catch (err) {
            (_c = slashCommandCtx.print) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx, [[{
              text: "Failed to launch cursor CLI",
              color: "red"
            }]]);
            (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/open: failed to launch cursor", String(err));
          } finally {
            slashCommandCtx.insertText("");
          }
        };
        cmds.push({
          id: "open",
          title: "Open in Cursor",
          description: "Open the repository's git root in Cursor",
          boostedAlts: ["cursor"],
          run: runOpenInCursor
        });
        // Alias for /open
        cmds.push({
          id: "cursor",
          title: "Open in Cursor",
          description: "Alias for /open",
          run: runOpenInCursor
        });
        // Resume chat by folder name (avoid clashing with UI '/resume' which opens picker)
        // Note: '/resume' is dynamically registered in the UI to open the unified list picker.
        // To prevent conflicting behavior and the argument palette appearing under the prompt,
        // we expose the folder-based resume as '/resume-chat'.
        cmds.push({
          id: "resume-chat",
          title: "Resume Chat",
          description: "Resume a previous chat by folder name",
          args: [{
            id: "chat",
            required: true
          }],
          getArgSuggestions: (_ctx, _typedArgs, slashCommandCtx) => {
            const root = (0, _state_index_js__WEBPACK_IMPORTED_MODULE_16__ /* .getChatsRootDir */.r)();
            try {
              const entries = (0, node_fs__WEBPACK_IMPORTED_MODULE_2__.readdirSync)(root, {
                withFileTypes: true
              });
              const infos = entries.filter(e => {
                var _a;
                return e.isDirectory() && e.name !== ((_a = slashCommandCtx.getChatId) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx));
              }).map(e => {
                try {
                  const dirPath = (0, node_path__WEBPACK_IMPORTED_MODULE_5__.join)(root, e.name);
                  const st = (0, node_fs__WEBPACK_IMPORTED_MODULE_2__.statSync)(dirPath);
                  return {
                    name: e.name,
                    lastModified: st.mtime
                  };
                } catch (_a) {
                  return null;
                }
              }).filter(x => x !== null).sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
              const now = new Date();
              const formatWhen = d => {
                const daysAgo = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) / (1000 * 60 * 60 * 24));
                const timeStr = d.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });
                if (daysAgo <= 0) return `Today ${timeStr}`;
                if (daysAgo === 1) return `Yesterday ${timeStr}`;
                if (daysAgo < 7) return `${daysAgo} days ago ${timeStr}`;
                const dateStr = d.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                });
                return `${dateStr} ${timeStr}`;
              };
              return infos.map(i => ({
                value: i.name,
                description: formatWhen(i.lastModified)
              }));
            } catch (_a) {
              return [];
            }
          },
          run: (_ctx, args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const folder = (args[0] || "").trim();
            if (!folder) return;
            if (folder === ((_a = slashCommandCtx.getChatId) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx))) {
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: "Cannot resume current chat",
                color: "red"
              }]]);
              (_c = slashCommandCtx.clearInput) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx);
              return;
            }
            const root = (0, _state_index_js__WEBPACK_IMPORTED_MODULE_16__ /* .getChatsRootDir */.r)();
            const chatDir = (0, node_path__WEBPACK_IMPORTED_MODULE_5__.join)(root, folder);
            try {
              const stat = (0, node_fs__WEBPACK_IMPORTED_MODULE_2__.statSync)(chatDir);
              if (!stat.isDirectory()) throw new Error("Not a directory");
            } catch (_g) {
              (_d = slashCommandCtx.print) === null || _d === void 0 ? void 0 : _d.call(slashCommandCtx, [[{
                text: `Chat not found: ${folder}`,
                color: "red"
              }]]);
              (_e = slashCommandCtx.clearInput) === null || _e === void 0 ? void 0 : _e.call(slashCommandCtx);
              return;
            }
            // Delegate to UI to actually switch stores and load the conversation
            if (slashCommandCtx.onResumeChat) {
              yield slashCommandCtx.onResumeChat(folder);
              slashCommandCtx.insertText("");
            } else {
              (_f = slashCommandCtx.print) === null || _f === void 0 ? void 0 : _f.call(slashCommandCtx, [[{
                text: "Resume not supported in this context",
                color: "red"
              }]]);
            }
          })
        });
        // Copy Request ID -----------------------------------------------------------
        cmds.push({
          id: "copy-request-id",
          title: "Copy Request ID",
          description: "Copy last request ID",
          run: (_ctx, _args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const reqId = _state_session_js__WEBPACK_IMPORTED_MODULE_17__ /* .session */.d.getLastRequestId();
            if (!reqId) {
              (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [[{
                text: "No request ID found.",
                color: "red"
              }], [{
                text: "Submit a prompt first, then retry /copy-request-id.",
                dim: true
              }]]);
              slashCommandCtx.insertText("");
              return;
            }
            let copied = false;
            if ((0, node_os__WEBPACK_IMPORTED_MODULE_4__.platform)() === "darwin") {
              try {
                const cp = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)("pbcopy");
                cp.stdin.write(reqId);
                cp.stdin.end();
                yield new Promise(resolve => cp.on("close", () => resolve()));
                copied = true;
              } catch (_c) {
                copied = false;
              }
            }
            const line = [{
              text: copied ? "Copied request id " : "Request id ",
              color: copied ? "green" : "cyan"
            }, {
              text: reqId,
              color: "cyan"
            }];
            (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [line], {
              minLingerMs: 8000
            });
            slashCommandCtx.insertText("");
          })
        });
        // Copy Conversation ID --------------------------------------------------------
        cmds.push({
          id: "copy-conversation-id",
          title: "Copy Conversation ID",
          description: "Copy current conversation ID",
          run: (_ctx, _args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const chatId = (_a = slashCommandCtx.getChatId) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            const noMessagesSent = agentStore.getConversationStateStructure().turns.length === 0;
            if (!chatId || noMessagesSent) {
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: "No conversation ID found.",
                color: "red"
              }], [{
                text: "Start a conversation first, then retry /copy-conversation-id.",
                dim: true
              }]]);
              slashCommandCtx.insertText("");
              return;
            }
            let copied = false;
            if ((0, node_os__WEBPACK_IMPORTED_MODULE_4__.platform)() === "darwin") {
              try {
                const cp = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)("pbcopy");
                cp.stdin.write(chatId);
                cp.stdin.end();
                yield new Promise(resolve => cp.on("close", () => resolve()));
                copied = true;
              } catch (_d) {
                copied = false;
              }
            }
            const line = [{
              text: copied ? "Copied conversation id " : "Conversation id ",
              color: copied ? "green" : "cyan"
            }, {
              text: chatId,
              color: "cyan"
            }];
            (_c = slashCommandCtx.print) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx, [line], {
              minLingerMs: 8000
            });
            slashCommandCtx.insertText("");
          })
        });
        // Logout -----------------------------------------------------------------
        cmds.push({
          id: "logout",
          title: "Logout",
          description: "Sign out from Cursor",
          run: (_ctx, _args, _slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            yield (0, _commands_logout_js__WEBPACK_IMPORTED_MODULE_9__.handleLogout)(credentialManager, configProvider);
          })
        });
        // Quit -------------------------------------------------------------------
        cmds.push({
          id: "quit",
          title: "Quit",
          description: "Exit",
          run: (_ctx, _args, slashCommandCtx) => {
            var _a;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            setTimeout(() => {
              var _a;
              return (_a = slashCommandCtx.exit) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, false);
            }, 0);
          }
        });
        // Exit -------------------------------------------------------------------
        cmds.push({
          id: "exit",
          title: "Exit",
          description: "Exit",
          run: (_ctx, _args, slashCommandCtx) => {
            var _a;
            (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
            setTimeout(() => {
              var _a;
              return (_a = slashCommandCtx.exit) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, false);
            }, 0);
          }
        });
        // MCP List ---------------------------------------------------------------
        cmds.push({
          id: "mcp",
          title: "MCP",
          description: "Manage MCP servers (list, login)",
          args: [{
            id: "subcommand",
            required: false
          }, {
            id: "identifier",
            required: false
          }],
          getArgSuggestions: (ctx, typedArgs) => __awaiter(this, void 0, void 0, function* () {
            const subcommand = (typedArgs[0] || "").trim().toLowerCase();
            const fragment = (typedArgs[1] || "").trim().toLowerCase();
            // First argument: subcommand suggestions
            if (typedArgs.length <= 1) {
              const options = [{
                value: "list",
                description: "List MCP servers and their status"
              }, {
                value: "login",
                description: "Authenticate with an MCP server"
              }];
              if (!subcommand) return options;
              return options.filter(o => o.value.startsWith(subcommand));
            }
            // Second argument: identifier suggestions for login subcommand
            if (subcommand === "login" && typedArgs.length === 2) {
              try {
                const manager = yield mcpLoader.load(ctx);
                const clients = manager.getClients();
                const identifiers = Object.keys(clients).map(id => ({
                  value: id,
                  description: `MCP server: ${id}`
                }));
                if (!fragment) return identifiers;
                return identifiers.filter(o => o.value.toLowerCase().startsWith(fragment));
              } catch (_a) {
                return [];
              }
            }
            return [];
          }),
          run: (ctx, args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            const subcommand = (args[0] || "").trim().toLowerCase();
            if (subcommand === "" || subcommand === "list") {
              (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: "Loading MCP servers...",
                color: "cyan"
              }]]);
              try {
                const manager = yield mcpLoader.load(ctx);
                const clients = manager.getClients();
                const entries = Object.entries(clients);
                if (entries.length === 0) {
                  (_c = slashCommandCtx.print) === null || _c === void 0 ? void 0 : _c.call(slashCommandCtx, [[{
                    text: "No MCP servers configured",
                    color: "yellow"
                  }]]);
                  slashCommandCtx.insertText("");
                  return;
                }
                const rows = yield Promise.all(entries.map(_a => __awaiter(this, [_a], void 0, function* ([id, client]) {
                  try {
                    const state = yield client.getState(ctx);
                    return {
                      id,
                      status: state.kind
                    };
                  } catch (_b) {
                    return {
                      id,
                      status: "error"
                    };
                  }
                })));
                const lines = [[{
                  text: "MCP Servers:",
                  color: "cyan",
                  bold: true
                }]];
                for (const row of rows) {
                  const statusColor = row.status === "connected" ? "green" : row.status === "connecting" ? "yellow" : row.status === "disconnected" ? "gray" : "red";
                  lines.push([{
                    text: `  ${row.id}`,
                    color: "cyan"
                  }, {
                    text: " - ",
                    color: "gray"
                  }, {
                    text: row.status,
                    color: statusColor
                  }]);
                }
                (_d = slashCommandCtx.print) === null || _d === void 0 ? void 0 : _d.call(slashCommandCtx, lines);
                (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp list: success", rows);
              } catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                (_e = slashCommandCtx.print) === null || _e === void 0 ? void 0 : _e.call(slashCommandCtx, [[{
                  text: "Failed to list MCP servers: ",
                  color: "red"
                }], [{
                  text: errorMsg,
                  color: "red",
                  dim: true
                }]]);
                (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp list: error", errorMsg);
              }
            } else if (subcommand === "login") {
              const identifier = (args[1] || "").trim();
              if (!identifier) {
                (_f = slashCommandCtx.print) === null || _f === void 0 ? void 0 : _f.call(slashCommandCtx, [[{
                  text: "Usage: /mcp login <identifier>",
                  color: "red"
                }]]);
                (_g = slashCommandCtx.clearInput) === null || _g === void 0 ? void 0 : _g.call(slashCommandCtx);
                slashCommandCtx.insertText("");
                return;
              }
              (_h = slashCommandCtx.clearInput) === null || _h === void 0 ? void 0 : _h.call(slashCommandCtx);
              try {
                (_j = slashCommandCtx.print) === null || _j === void 0 ? void 0 : _j.call(slashCommandCtx, [[{
                  text: `Preparing MCP login for ${identifier}...`,
                  color: "cyan"
                }]]);
                (_k = slashCommandCtx.print) === null || _k === void 0 ? void 0 : _k.call(slashCommandCtx, [[{
                  text: `Loading MCP server '${identifier}' from .cursor/mcp.json or ~/.cursor/mcp.json...`,
                  color: "cyan"
                }]]);
                let client;
                try {
                  client = yield mcpLoader.loadClient(ctx, identifier);
                } catch (e) {
                  (_l = slashCommandCtx.print) === null || _l === void 0 ? void 0 : _l.call(slashCommandCtx, [[{
                    text: `Failed to load MCP '${identifier}': ${getErrorMessage(e)}`,
                    color: "red"
                  }]], {
                    minLingerMs: 15000
                  });
                  (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp login: load error", getErrorMessage(e));
                  slashCommandCtx.insertText("");
                  return;
                }
                const state = yield client.getState(ctx);
                if (state.kind === "ready") {
                  (_m = slashCommandCtx.print) === null || _m === void 0 ? void 0 : _m.call(slashCommandCtx, [[{
                    text: `✓ MCP '${identifier}' is ready.`,
                    color: "green"
                  }]], {
                    minLingerMs: 15000
                  });
                  (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp login: already ready", identifier);
                } else if (state.kind === "requires_authentication") {
                  const url = state.url;
                  (_o = slashCommandCtx.print) === null || _o === void 0 ? void 0 : _o.call(slashCommandCtx, [[{
                    text: `MCP '${identifier}' requires authentication. Opening your browser...`,
                    color: "cyan"
                  }], [{
                    text: `If it doesn't open, navigate to:`,
                    color: "cyan"
                  }], [{
                    text: url,
                    color: "blue"
                  }], [{
                    text: `Listening on ${CALLBACK_URL} for the OAuth callback...`,
                    color: "cyan"
                  }]], {
                    minLingerMs: 15000
                  });
                  if (url) {
                    if ((0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_19__ /* .isLikelyToOpenBrowser */.g)(url)) {
                      void (0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_19__ /* .openBrowser */.p)(url);
                    } else {
                      (_p = slashCommandCtx.print) === null || _p === void 0 ? void 0 : _p.call(slashCommandCtx, [[{
                        text: "Navigate to the following URL in your browser:",
                        color: "cyan"
                      }], [{
                        text: url
                      }]], {
                        minLingerMs: 15000
                      });
                    }
                  }
                  try {
                    const code = yield waitForOAuthCallback();
                    yield state.callback(code);
                    (_q = slashCommandCtx.print) === null || _q === void 0 ? void 0 : _q.call(slashCommandCtx, [[{
                      text: `✓ Received authorization code '${code.substring(0, 6)}...'.`,
                      color: "green"
                    }], [{
                      text: "You can close the browser. Re-running the command should now complete authentication.",
                      color: "green"
                    }]], {
                      minLingerMs: 15000
                    });
                    (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp login: success", identifier, code.substring(0, 6));
                  } catch (e) {
                    (_r = slashCommandCtx.print) === null || _r === void 0 ? void 0 : _r.call(slashCommandCtx, [[{
                      text: `Authentication callback failed: ${getErrorMessage(e)}`,
                      color: "red"
                    }]], {
                      minLingerMs: 15000
                    });
                    (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp login: callback error", getErrorMessage(e));
                  }
                } else {
                  (_s = slashCommandCtx.print) === null || _s === void 0 ? void 0 : _s.call(slashCommandCtx, [[{
                    text: `Unknown MCP client state for '${identifier}'.`,
                    color: "red"
                  }]], {
                    minLingerMs: 15000
                  });
                  (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp login: unknown state", identifier, state);
                }
              } catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                (_t = slashCommandCtx.print) === null || _t === void 0 ? void 0 : _t.call(slashCommandCtx, [[{
                  text: "MCP login failed: ",
                  color: "red"
                }], [{
                  text: errorMsg,
                  color: "red",
                  dim: true
                }]], {
                  minLingerMs: 15000
                });
                (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.debugLog)("/mcp login: error", errorMsg);
              }
            } else {
              (_u = slashCommandCtx.print) === null || _u === void 0 ? void 0 : _u.call(slashCommandCtx, [[{
                text: "Usage: /mcp [list|login <identifier>]",
                color: "red"
              }]], {
                minLingerMs: 15000
              });
              (_v = slashCommandCtx.clearInput) === null || _v === void 0 ? void 0 : _v.call(slashCommandCtx);
            }
            slashCommandCtx.insertText("");
          })
        });
        // Debug ------------------------------------------------------------------
        if ((0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.isDebugEnabled)()) {
          cmds.push({
            id: "debug-test",
            title: "Debug Test",
            description: "Emit debug log",
            visible: () => (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.isDebugEnabled)(),
            run: (_ctx, _args, slashCommandCtx) => {
              var _a;
              const id = (0, node_crypto__WEBPACK_IMPORTED_MODULE_1__.randomUUID)();
              (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [[{
                text: "Emitted debug-test ",
                dim: true
              }, {
                text: id,
                color: "cyan"
              }]]);
              slashCommandCtx.insertText("");
            }
          });
          // Dev-only: Throw an error to test global handlers ----------------------
          cmds.push({
            id: "throw",
            title: "Throw Error",
            description: "Throw test error",
            args: [{
              id: "message",
              required: false
            }],
            visible: () => (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.isDebugEnabled)(),
            run: (_ctx, args, slashCommandCtx) => {
              var _a, _b;
              const msg = ((_a = args.join(" ")) === null || _a === void 0 ? void 0 : _a.trim()) || `debug throw ${(0, node_crypto__WEBPACK_IMPORTED_MODULE_1__.randomUUID)()}`;
              // clear the input
              (_b = slashCommandCtx.clearInput) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx);
              throw new Error(msg);
            }
          });
          // Dev-only: Open in Prompt Quality -------------------------------------
          cmds.push({
            id: "pq",
            title: "Open in Prompt Quality",
            description: "Open last request dashboard",
            visible: () => (0, _debug_js__WEBPACK_IMPORTED_MODULE_15__.isDebugEnabled)(),
            run: (_ctx, _args, slashCommandCtx) => __awaiter(this, void 0, void 0, function* () {
              var _a, _b;
              const reqId = _state_session_js__WEBPACK_IMPORTED_MODULE_17__ /* .session */.d.getLastRequestId();
              if (!reqId) {
                (_a = slashCommandCtx.print) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx, [[{
                  text: "No request ID found.",
                  color: "red"
                }], [{
                  text: "Submit a prompt first, then retry /pq.",
                  dim: true
                }]]);
                slashCommandCtx.insertText("");
                return;
              }
              const url = `http://go/prompts/?requestId=${reqId}`;
              (_b = slashCommandCtx.print) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx, [[{
                text: "Opening ",
                dim: true
              }, {
                text: url,
                color: "cyan"
              }]]);
              yield (0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_19__ /* .openBrowser */.p)(url);
              slashCommandCtx.insertText("");
            })
          });
        }
        return [...cmds, ...dynamicCommands, ...cursorCommands].filter(c => !c.visible || c.visible());
      }, [vimEnabled, dynamicCommands, cursorCommands, credentialManager, configProvider, models, modelManager, mcpLoader, dashboardClient, agentStore.getConversationStateStructure, agentStore.getMetadata, agentStore.setMetadata, setIsSummarizing, toggleVimEnabled]);
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/