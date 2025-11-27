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
class AgentSession {
  constructor(connection, sessionId, sharedServices, ctx, agentStore, resources) {
    this.connection = connection;
    this.sessionId = sessionId;
    this.pendingPrompt = null;
    this.sharedServices = sharedServices;
    this.ctx = ctx;
    this.agentStore = agentStore;
    this.resources = resources;
  }
  sendSessionUpdate(update) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.connection.sessionUpdate({
        sessionId: this.sessionId,
        update
      });
    });
  }
  sendAgentMessageChunk(text) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.sendSessionUpdate({
        sessionUpdate: "agent_message_chunk",
        content: {
          type: "text",
          text
        }
      });
    });
  }
  sendToolCall(toolCallId, title, kind, rawInput) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.sendSessionUpdate({
        sessionUpdate: "tool_call",
        toolCallId,
        title,
        kind,
        status: "pending",
        rawInput
      });
    });
  }
  sendToolCallUpdate(toolCallId, status, content, rawOutput) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.sendSessionUpdate({
        sessionUpdate: "tool_call_update",
        toolCallId,
        status,
        content,
        rawOutput
      });
    });
  }
  handlePrompt(params) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      (_a = this.pendingPrompt) === null || _a === void 0 ? void 0 : _a.abort();
      this.pendingPrompt = new AbortController();
      try {
        yield this.processPrompt(params, this.pendingPrompt.signal);
      } catch (err) {
        if (this.pendingPrompt.signal.aborted) {
          return {
            stopReason: "cancelled"
          };
        }
        throw err;
      }
      this.pendingPrompt = null;
      return {
        stopReason: "end_turn"
      };
    });
  }
  processPrompt(params, abortSignal) {
    return __awaiter(this, void 0, void 0, function* () {
      const promptParts = params.prompt || [];
      const promptText = promptParts.filter(c => c.type === "text").map(c => c.text).join("\n") || "";
      if (!promptText.trim()) {
        yield this.sendAgentMessageChunk("No prompt text provided.");
        return;
      }
      const interactionListener = {
        sendUpdate: (_ctx, update) => __awaiter(this, void 0, void 0, function* () {
          var _a;
          switch (update.type) {
            case "text-delta":
              {
                yield this.sendAgentMessageChunk(update.text);
                break;
              }
            case "tool-call-started":
              {
                const summary = this.summarizeToolCall(update.toolCall);
                if (summary) {
                  const kind = this.getToolKind((_a = update.toolCall.tool.case) !== null && _a !== void 0 ? _a : "");
                  yield this.sendToolCall(update.callId, summary, kind, this.extractToolCallInput(update.toolCall));
                }
                break;
              }
            case "tool-call-completed":
              {
                const summary = this.summarizeToolCall(update.toolCall);
                if (summary) {
                  const content = this.extractToolCallContent(update.toolCall);
                  const rawOutput = this.extractToolCallOutput(update.toolCall);
                  yield this.sendToolCallUpdate(update.callId, "completed", content, rawOutput);
                }
                break;
              }
            case "thinking-delta":
            case "thinking-completed":
              break;
            default:
              break;
          }
        }),
        query: (_ctx, query) => __awaiter(this, void 0, void 0, function* () {
          switch (query.type) {
            case "web-search-request":
              return {
                approved: true
              };
            default:
              {
                throw new Error(`Unhandled interaction query type: ${query.type}`);
              }
          }
        })
      };
      try {
        const currentModel = yield this.sharedServices.modelManager.awaitCurrentModel();
        const selectedCtx = new selected_context_pb /* SelectedContext */.xv();
        const action = new agent_pb /* UserMessageAction */.Vt({
          userMessage: new agent_pb /* UserMessage */.RG({
            text: promptText,
            selectedContext: selectedCtx,
            messageId: crypto.randomUUID()
          })
        });
        const conversationActionManager = new dist /* ControlledConversationActionManager */.hg();
        yield this.sharedServices.agentClient.run(this.ctx, this.agentStore.getConversationStateStructure(), new agent_pb /* ConversationAction */.QF({
          action: {
            case: "userMessageAction",
            value: action
          }
        }), currentModel, interactionListener, this.resources, this.agentStore.getBlobStore(), conversationActionManager, this.agentStore, [], {
          conversationId: this.agentStore.getId()
        });
      } catch (error) {
        if (abortSignal.aborted) {
          yield this.sendAgentMessageChunk("\n\nOperation cancelled.");
        } else {
          yield this.sendAgentMessageChunk(`\n\nError: ${String(error)}`);
        }
      }
    });
  }
  makePathRelativeIfPossible(path) {
    if (!(0, external_node_path_.isAbsolute)(path)) {
      return path;
    }
    const cwd = process.cwd();
    const absolutePath = (0, external_node_path_.resolve)(path);
    const relativePath = (0, external_node_path_.relative)(cwd, absolutePath);
    // Only use relative path if it doesn't start with '..' (i.e., it's under cwd)
    if (!relativePath.startsWith("..") && !(0, external_node_path_.isAbsolute)(relativePath)) {
      return relativePath;
    }
    return path;
  }
  getToolKind(toolCase) {
    switch (toolCase) {
      case "shellToolCall":
        return "execute";
      case "readToolCall":
        return "read";
      case "editToolCall":
        return "edit";
      case "lsToolCall":
      case "globToolCall":
      case "grepToolCall":
      case "semSearchToolCall":
        return "search";
      case "updateTodosToolCall":
      case "readTodosToolCall":
        return "think";
      case "deleteToolCall":
        return "edit";
      default:
        return "other";
    }
  }
  summarizeToolCall(toolCall) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const t = toolCall.tool;
    switch (t.case) {
      case "shellToolCall":
        {
          const command = (_b = (_a = t.value.args) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : "";
          if (command) {
            // Escape backticks in command for display
            const displayCommand = command.replaceAll("`", "\\`");
            return `\`${displayCommand}\``;
          }
          return "Terminal";
        }
      case "grepToolCall":
        {
          const args = t.value.args;
          if (!args) return "grep";
          let label = "grep";
          if (args.i) label += " -i";
          if (args.n) label += " -n";
          if (args.A !== undefined) label += ` -A ${args.A}`;
          if (args.B !== undefined) label += ` -B ${args.B}`;
          if (args.C !== undefined) label += ` -C ${args.C}`;
          if (args.outputMode) {
            switch (args.outputMode) {
              case "files_with_matches":
                label += " -l";
                break;
              case "count":
                label += " -c";
                break;
            }
          }
          if (args.headLimit !== undefined) {
            label += ` | head -${args.headLimit}`;
          }
          if (args.glob) {
            label += ` --include="${args.glob}"`;
          }
          if (args.type) {
            label += ` --type=${args.type}`;
          }
          if (args.multiline) {
            label += " -P";
          }
          if (args.pattern) {
            label += ` "${args.pattern}"`;
          }
          return label;
        }
      case "semSearchToolCall":
        {
          const query = (_c = t.value.args) === null || _c === void 0 ? void 0 : _c.query;
          return query ? `Search: "${query}"` : "Codebase Search";
        }
      case "editToolCall":
        {
          const path = (_d = t.value.args) === null || _d === void 0 ? void 0 : _d.path;
          return path ? `Edit \`${path}\`` : "Edit File";
        }
      case "readToolCall":
        {
          const args = t.value.args;
          if (!(args === null || args === void 0 ? void 0 : args.path)) return "Read File";
          const displayPath = this.makePathRelativeIfPossible(args.path);
          let limitInfo = "";
          if (args.limit) {
            const start = ((_e = args.offset) !== null && _e !== void 0 ? _e : 0) + 1;
            const end = ((_f = args.offset) !== null && _f !== void 0 ? _f : 0) + args.limit;
            limitInfo = ` (${start} - ${end})`;
          } else if (args.offset) {
            limitInfo = ` (from line ${args.offset + 1})`;
          }
          return `Read ${displayPath}${limitInfo}`;
        }
      case "deleteToolCall":
        {
          const path = (_g = t.value.args) === null || _g === void 0 ? void 0 : _g.path;
          return path ? `Delete \`${path}\`` : "Delete File";
        }
      case "lsToolCall":
        {
          const path = (_h = t.value.args) === null || _h === void 0 ? void 0 : _h.path;
          if (!path) {
            return "List the current directory's contents";
          }
          const displayPath = this.makePathRelativeIfPossible(path);
          return `List the \`${displayPath}\` directory's contents`;
        }
      case "globToolCall":
        {
          const args = t.value.args;
          const pattern = (_j = args === null || args === void 0 ? void 0 : args.pattern) !== null && _j !== void 0 ? _j : args === null || args === void 0 ? void 0 : args.globPattern;
          let label = "Find";
          if (args === null || args === void 0 ? void 0 : args.path) {
            label += ` \`${args.path}\``;
          }
          if (pattern) {
            label += ` \`${pattern}\``;
          }
          return label;
        }
      case "updateTodosToolCall":
        {
          const args = t.value.args;
          if (Array.isArray(args === null || args === void 0 ? void 0 : args.todos) && args.todos.length > 0) {
            const todoContents = args.todos.map(todo => todo.content).filter(Boolean).join(", ");
            return todoContents ? `Update TODOs: ${todoContents}` : "Update TODOs";
          }
          return "Update TODOs";
        }
      case "readTodosToolCall":
        {
          return "Read TODOs";
        }
      default:
        return null;
    }
  }
  extractToolCallInput(toolCall) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const t = toolCall.tool;
    switch (t.case) {
      case "shellToolCall":
        return {
          command: (_a = t.value.args) === null || _a === void 0 ? void 0 : _a.command
        };
      case "grepToolCall":
        return {
          pattern: (_b = t.value.args) === null || _b === void 0 ? void 0 : _b.pattern,
          path: (_c = t.value.args) === null || _c === void 0 ? void 0 : _c.path
        };
      case "semSearchToolCall":
        return {
          query: (_d = t.value.args) === null || _d === void 0 ? void 0 : _d.query
        };
      case "editToolCall":
        return {
          path: (_e = t.value.args) === null || _e === void 0 ? void 0 : _e.path
        };
      case "readToolCall":
        return {
          path: (_f = t.value.args) === null || _f === void 0 ? void 0 : _f.path
        };
      case "deleteToolCall":
        return {
          path: (_g = t.value.args) === null || _g === void 0 ? void 0 : _g.path
        };
      case "lsToolCall":
        return {
          path: (_h = t.value.args) === null || _h === void 0 ? void 0 : _h.path
        };
      case "globToolCall":
        {
          const args = t.value.args;
          return {
            pattern: (_j = args === null || args === void 0 ? void 0 : args.pattern) !== null && _j !== void 0 ? _j : args === null || args === void 0 ? void 0 : args.globPattern
          };
        }
      default:
        return undefined;
    }
  }
  extractToolCallContent(toolCall) {
    var _a, _b, _c;
    const t = toolCall.tool;
    switch (t.case) {
      case "editToolCall":
        {
          const result = (_a = t.value.result) === null || _a === void 0 ? void 0 : _a.result;
          if ((result === null || result === void 0 ? void 0 : result.case) === "success") {
            const path = result.value.path;
            const oldText = (_b = result.value.beforeFullFileContent) !== null && _b !== void 0 ? _b : null;
            const newText = result.value.afterFullFileContent;
            return [{
              type: "diff",
              path,
              oldText,
              newText
            }];
          }
          break;
        }
      case "deleteToolCall":
        {
          const result = (_c = t.value.result) === null || _c === void 0 ? void 0 : _c.result;
          if ((result === null || result === void 0 ? void 0 : result.case) === "success") {
            const path = result.value.path;
            const oldText = result.value.deletedFile;
            const newText = "";
            return [{
              type: "diff",
              path,
              oldText,
              newText
            }];
          }
          break;
        }
      default:
        return undefined;
    }
    return undefined;
  }
  extractToolCallOutput(toolCall) {
    var _a, _b;
    const t = toolCall.tool;
    switch (t.case) {
      case "shellToolCall":
        {
          const result = (_a = t.value.result) === null || _a === void 0 ? void 0 : _a.result;
          if ((result === null || result === void 0 ? void 0 : result.case) === "success") {
            return {
              exitCode: result.value.exitCode,
              stdout: result.value.stdout,
              stderr: result.value.stderr
            };
          } else if ((result === null || result === void 0 ? void 0 : result.case) === "failure") {
            return {
              exitCode: result.value.exitCode,
              stdout: result.value.stdout,
              stderr: result.value.stderr
            };
          }
          break;
        }
      case "readToolCall":
        {
          const result = (_b = t.value.result) === null || _b === void 0 ? void 0 : _b.result;
          if ((result === null || result === void 0 ? void 0 : result.case) === "success") {
            const output = result.value.output;
            if (output.case === "content") {
              return {
                content: output.value
              };
            }
          }
          break;
        }
      default:
        return undefined;
    }
    return undefined;
  }
}