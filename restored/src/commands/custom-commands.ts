/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */F: () => (/* binding */CustomCommandsLoader)
  /* harmony export */
});
/* harmony import */
var node_fs_promises__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs/promises");
/* harmony import */
var node_fs_promises__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs_promises__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:os");
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */
var _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../proto/dist/generated/aiserver/v1/dashboard_pb.js");
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/debug.ts");
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

/**
 * This loader is responsible for loading and storing custom Cursor slash commands from:
 * 1. Personal commands in ~/.cursor/commands and ~/.claude/commands
 * 2. Workspace-specific commands in .cursor/commands and .claude/commands directories
 * 3. Team-specific commands from the backend
 * It follows the same priority order as the VSCode CursorCommandsService.
 */
class CustomCommandsLoader {
  constructor(dashboardClient) {
    this.commands = new Map();
    this.dashboardClient = dashboardClient;
  }
  loadCommands(projectRoot) {
    return __awaiter(this, void 0, void 0, function* () {
      this.commands.clear();
      // Load commands in priority order (later sources override earlier ones)
      // 1. Load team commands (lowest priority)
      yield this.loadTeamCommands();
      // 2. Load workspace claude commands
      yield this.loadCommandsFromDirectory((0, node_path__WEBPACK_IMPORTED_MODULE_2__.join)(projectRoot, ".claude", "commands"), "claude-workspace");
      // 3. Load workspace cursor commands (override claude commands if same name)
      yield this.loadCommandsFromDirectory((0, node_path__WEBPACK_IMPORTED_MODULE_2__.join)(projectRoot, ".cursor", "commands"), "workspace");
      // 4. Load personal claude commands (override workspace commands)
      yield this.loadCommandsFromDirectory((0, node_path__WEBPACK_IMPORTED_MODULE_2__.join)((0, node_os__WEBPACK_IMPORTED_MODULE_1__.homedir)(), ".claude", "commands"), "claude-user");
      // 5. Load personal cursor commands last (highest priority, override claude commands if same name)
      yield this.loadCommandsFromDirectory((0, node_path__WEBPACK_IMPORTED_MODULE_2__.join)((0, node_os__WEBPACK_IMPORTED_MODULE_1__.homedir)(), ".cursor", "commands"), "user");
      // Convert to SlashCommand format
      return Array.from(this.commands.values()).map(command => this.convertToSlashCommand(command));
    });
  }
  loadCommandsFromDirectory(dirPath, source) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!(yield this.exists(dirPath))) {
        return;
      }
      const files = yield this.readDirectory(dirPath);
      const markdownFiles = files.filter(file => !file.isDirectory && file.name.endsWith(".md"));
      for (const file of markdownFiles) {
        const content = yield this.readTextFile(file.path);
        if (!content) continue;
        const command = this.parseMarkdownCommand(file.name, content, source);
        if (command) {
          this.commands.set(command.id, command);
        }
      }
    });
  }
  parseMarkdownCommand(filename, content, source) {
    const id = filename.replace(/\.md$/, "");
    if (!id.trim()) return null;
    const lines = content.split("\n");
    const title = this.extractTitle(lines[0]) || id;
    return {
      id,
      title,
      description: title,
      content: content.trim(),
      source,
      filename
    };
  }
  extractTitle(firstLine) {
    if (!firstLine) return null;
    // Extract title from markdown heading
    const match = firstLine.match(/^#+\s*(.+)$/);
    if (match) {
      return match[1].trim();
    }
    // If no heading, use the first line if it's not empty
    const trimmed = firstLine.trim();
    return trimmed ? trimmed : null;
  }
  convertToSlashCommand(command) {
    // Add scope indicator to the title
    const scopeIndicator = this.getScopeIndicator(command.source);
    return {
      id: command.id,
      title: command.title,
      description: `${command.description} ${scopeIndicator}`,
      run: (_ctx, _args, slashCommandCtx) => {
        var _a, _b;
        // Submit the command content directly
        if (slashCommandCtx.submitMessage) {
          (_a = slashCommandCtx.clearInput) === null || _a === void 0 ? void 0 : _a.call(slashCommandCtx);
          slashCommandCtx.submitMessage(command.content, {
            display: `/${command.id}`
          });
        } else {
          // Fallback: clear input and insert the content for user to review and submit
          (_b = slashCommandCtx.clearInput) === null || _b === void 0 ? void 0 : _b.call(slashCommandCtx);
          slashCommandCtx.insertText(command.content);
        }
      }
    };
  }
  getScopeIndicator(source) {
    switch (source) {
      case "team":
        return "(team)";
      case "workspace":
        return "(workspace)";
      case "user":
        return "(user)";
      case "claude-workspace":
        return "(workspace)";
      case "claude-user":
        return "(user)";
      default:
        return "";
    }
  }
  // File system utilities (inlined to avoid creating separate file)
  exists(path) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield (0, node_fs_promises__WEBPACK_IMPORTED_MODULE_0__.stat)(path);
        return true;
      } catch (_a) {
        return false;
      }
    });
  }
  readDirectory(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const entries = yield (0, node_fs_promises__WEBPACK_IMPORTED_MODULE_0__.readdir)(dirPath, {
          withFileTypes: true
        });
        return entries.map(entry => ({
          path: (0, node_path__WEBPACK_IMPORTED_MODULE_2__.join)(dirPath, entry.name),
          name: entry.name,
          isDirectory: entry.isDirectory()
        }));
      } catch (_a) {
        return [];
      }
    });
  }
  readTextFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const content = yield (0, node_fs_promises__WEBPACK_IMPORTED_MODULE_0__.readFile)(filePath, "utf-8");
        return content;
      } catch (_a) {
        return null;
      }
    });
  }
  getLoadedCommands() {
    return Array.from(this.commands.values());
  }
  getCommandById(id) {
    return this.commands.get(id);
  }
  slugify(text) {
    return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  }
  loadTeamCommands() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        // First check if user belongs to a team
        const userResponse = yield this.dashboardClient.getMe(new _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .GetMeRequest */.Ewt({}));
        // Only load team commands if user has a teamId
        if (!userResponse.teamId) {
          (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("User does not belong to a team, skipping team commands");
          return;
        }
        // Fetch active team commands from backend
        const response = yield this.dashboardClient.getTeamCommands(new _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .GetTeamCommandsRequest */.XDt({
          activeOnly: true
        }));
        // Convert protobuf response to our command format
        for (const cmd of response.commands) {
          if (!cmd.isActive) continue; // Skip inactive commands
          const command = {
            id: this.slugify(cmd.name),
            title: cmd.name,
            description: cmd.description || cmd.content.trim(),
            content: cmd.content,
            source: "team",
            filename: cmd.name
          };
          // Only add if not already present (allows overriding by local commands)
          if (!this.commands.has(command.id)) {
            this.commands.set(command.id, command);
          }
        }
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("Loaded team commands:", response.commands.length);
      } catch (error) {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_4__.debugLog)("Failed to load team commands:", error);
        // Don't throw - team commands are optional
      }
    });
  }
}

/***/