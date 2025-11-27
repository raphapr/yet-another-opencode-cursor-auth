var ls_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var ls_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const DEFAULT_CHARACTER_BUDGET = 2_500;
/**
 * Zod schema for terminal frontmatter
 */
const FrontmatterSchema = zod_lib.z.object({
  cwd: zod_lib.z.string().optional().default(""),
  current_command: zod_lib.z.string().optional().default(""),
  last_commands: zod_lib.z.array(zod_lib.z.object({
    command: zod_lib.z.string(),
    cwd: zod_lib.z.string()
  })).optional().default([])
});
/**
 * Parse YAML frontmatter from terminal file contents
 */
function parseFrontmatter(fileContent) {
  const lines = fileContent.split("\n");
  if (lines.length < 3 || lines[0] !== "---") return undefined;
  // Find the closing ---
  const endIdx = lines.slice(1, 100).indexOf("---");
  if (endIdx === -1) return undefined;
  // Extract YAML content (endIdx is offset by 1 since we sliced from index 1)
  const yamlContent = lines.slice(1, endIdx + 1).join("\n");
  try {
    const parsed = load(yamlContent);
    const validated = FrontmatterSchema.parse(parsed);
    return validated;
  } catch {
    return undefined;
  }
}
// Check if this is an external terminal file and parse frontmatter
const maybeParseExternalTerminalFile = async (fileName, parentPath) => {
  const fullPath = (0, external_node_path_.join)(parentPath, fileName);
  const terminalInfo = (0, utils_dist /* extractTerminalId */.fg)(fullPath);
  if (!terminalInfo?.isExternal) {
    return;
  }
  let content;
  try {
    // Read first 200 lines to get frontmatter
    content = await (0, promises_.readFile)((0, external_node_path_.join)(parentPath, fileName), "utf-8");
  } catch {
    // Failed to read/parse frontmatter, continue without metadata
    return;
  }
  const lines = content.split("\n").slice(0, 200).join("\n");
  const frontmatter = parseFrontmatter(lines);
  if (!frontmatter) {
    return;
  }
  return new ls_exec_pb /* TerminalMetadata */.Y$({
    cwd: frontmatter.cwd,
    currentCommand: frontmatter.current_command ? new ls_exec_pb /* TerminalMetadata_Command */.Sf({
      command: frontmatter.current_command
    }) : undefined,
    lastCommands: frontmatter.last_commands.map(cmd => new ls_exec_pb /* TerminalMetadata_Command */.Sf({
      command: cmd.command
    }))
  });
};
class LocalLsExecutor {
  constructor(permissionsService, ignoreService, rgPath, workspacePath) {
    this.permissionsService = permissionsService;
    this.ignoreService = ignoreService;
    this.rgPath = rgPath;
    this.workspacePath = workspacePath;
  }
  async execute(parentCtx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = ls_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalLsExecutor.execute")), false);
      const ctx = span.ctx;
      const resolvedPath = resolvePath(args.path, this.workspacePath);
      try {
        // Check if path exists and is a directory
        let pathStats;
        try {
          pathStats = await (0, promises_.stat)(resolvedPath);
        } catch (_error) {
          return new ls_exec_pb /* LsResult */.fv({
            result: {
              case: "error",
              value: new ls_exec_pb /* LsError */.uj({
                path: resolvedPath,
                error: `Path does not exist: ${resolvedPath}`
              })
            }
          });
        }
        if (!pathStats.isDirectory()) {
          return new ls_exec_pb /* LsResult */.fv({
            result: {
              case: "error",
              value: new ls_exec_pb /* LsError */.uj({
                path: resolvedPath,
                error: `Path is not a directory: ${resolvedPath}`
              })
            }
          });
        }
        const sandboxPolicy = convertProtoToInternalPolicy(args.sandboxPolicy);
        const tree = await this.getDirectoryTree(ctx, resolvedPath, args.ignore, sandboxPolicy);
        return new ls_exec_pb /* LsResult */.fv({
          result: {
            case: "success",
            value: new ls_exec_pb /* LsSuccess */.PC({
              directoryTreeRoot: tree
            })
          }
        });
      } catch (error) {
        return new ls_exec_pb /* LsResult */.fv({
          result: {
            case: "error",
            value: new ls_exec_pb /* LsError */.uj({
              path: resolvedPath,
              error: error instanceof Error ? error.message : "Unknown error occurred"
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      ls_disposeResources(env_1);
    }
  }
  async getDirectoryTree(ctx, directoryPath, ignoreGlobs, sandboxPolicy) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = ls_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalLsExecutor.getDirectoryTree")), false);
      // Build tree by streaming file paths from ripgrep
      // Terminal metadata promises are set during streaming, awaited at end
      return await this.buildTreeFromRipgrepStream(ctx, directoryPath, ignoreGlobs, sandboxPolicy, DEFAULT_CHARACTER_BUDGET);
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      ls_disposeResources(env_2);
    }
  }
  /**
   * Build directory tree by streaming paths from ripgrep.
   * Process lines as they arrive - no buffering entire output.
   */
  async buildTreeFromRipgrepStream(ctx, directoryPath, ignoreGlobs, sandboxPolicy, characterBudget) {
    const normalizedRoot = (0, external_node_path_.resolve)(directoryPath);
    // Initialize tree structure
    const rootNode = new ls_exec_pb /* LsDirectoryTreeNode */.vq({
      absPath: normalizedRoot,
      childrenDirs: [],
      childrenFiles: [],
      childrenWereProcessed: true,
      fullSubtreeExtensionCounts: {}
    });
    const dirNodes = new Map();
    dirNodes.set(normalizedRoot, rootNode);
    // Track terminal metadata promises for parallel resolution
    const terminalMetadataPromises = [];
    // Mutable state for tracking budget
    const state = {
      charactersUsed: normalizedRoot.length,
      budgetExceeded: false
    };
    // Get cursor ignore files for this directory
    const cursorIgnoreFiles = await this.ignoreService.listCursorIgnoreFilesByRoot(directoryPath);
    // Stream files from ripgrep (auto-handles timeout, exit codes, stderr)
    for await (const line of ripwalk({
      rgPath: this.rgPath,
      root: directoryPath,
      excludeGlobs: ignoreGlobs,
      caseSensitive: true,
      cursorIgnoreFiles,
      sandboxPolicy
    })) {
      if (!line) continue;
      const filePath = (0, external_node_path_.resolve)(directoryPath, line);
      // Skip if not under root
      if (!filePath.startsWith(normalizedRoot)) continue;
      // Security: check blocklist and permissions in parallel
      const [repoBlocked, readBlocked] = await Promise.all([this.ignoreService.isRepoBlocked(filePath), this.permissionsService.shouldBlockRead(filePath)]);
      if (repoBlocked || readBlocked) continue;
      // Process this file path into tree
      this.addPathToTree(filePath, normalizedRoot, dirNodes, state, characterBudget, terminalMetadataPromises);
    }
    // Sort tree children for consistent output
    this.sortTreeChildren(rootNode);
    // Await all terminal metadata promises (parallel background reads)
    await Promise.all(terminalMetadataPromises);
    return rootNode;
  }
  /**
   * Add a single file path to the tree structure.
   * Called for each line streamed from ripgrep.
   */
  addPathToTree(filePath, normalizedRoot, dirNodes, state, characterBudget, terminalMetadataPromises) {
    const fileName = (0, external_node_path_.basename)(filePath);
    const dirPath = (0, external_node_path_.dirname)(filePath);
    // Ensure all ancestor directories exist
    this.ensureDirectoryPath(dirPath, normalizedRoot, dirNodes, state.budgetExceeded);
    const parentNode = dirNodes.get(dirPath);
    if (!parentNode) return;
    // Check character budget
    const fileCharCost = fileName.length;
    if (!state.budgetExceeded && state.charactersUsed + fileCharCost <= characterBudget) {
      const fileNode = new ls_exec_pb /* LsDirectoryTreeNode_File */.ur({
        name: fileName
      });
      parentNode.childrenFiles.push(fileNode);
      state.charactersUsed += fileCharCost;
      // Start terminal metadata read in parallel (background)
      const metadataPromise = maybeParseExternalTerminalFile(fileName, dirPath).then(metadata => {
        fileNode.terminalMetadata = metadata;
      });
      terminalMetadataPromises.push(metadataPromise);
    } else {
      // Budget exceeded - first time, mark all ancestors as incomplete
      if (!state.budgetExceeded) {
        state.budgetExceeded = true;
        // Mark all ancestor directories as incomplete since we won't process all their files
        let currentDir = dirPath;
        while (currentDir.startsWith(normalizedRoot)) {
          const node = dirNodes.get(currentDir);
          if (node) {
            node.childrenWereProcessed = false;
          }
          const parentDir = (0, external_node_path_.dirname)(currentDir);
          if (parentDir === currentDir) break;
          currentDir = parentDir;
        }
      }
      // Track extension counts for this file in all ancestors
      const extension = (0, external_node_path_.extname)(filePath);
      let currentDir = dirPath;
      while (currentDir.startsWith(normalizedRoot)) {
        const node = dirNodes.get(currentDir);
        if (node) {
          node.fullSubtreeExtensionCounts[extension] ??= 0;
          node.fullSubtreeExtensionCounts[extension] = clampInt32(node.fullSubtreeExtensionCounts[extension] + 1);
          node.numFiles ??= 0;
          node.numFiles = clampInt32(node.numFiles + 1);
        }
        const parentDir = (0, external_node_path_.dirname)(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
      }
    }
  }
  /**
   * Ensure directory path exists in tree, creating intermediate nodes as needed.
   */
  ensureDirectoryPath(dirPath, rootPath, dirNodes, budgetExceeded) {
    if (dirNodes.has(dirPath) || dirPath === rootPath) {
      return; // Already exists or is root
    }
    // Ensure parent exists first
    const parentPath = (0, external_node_path_.dirname)(dirPath);
    if (parentPath !== dirPath && parentPath.startsWith(rootPath)) {
      this.ensureDirectoryPath(parentPath, rootPath, dirNodes, budgetExceeded);
    }
    // Create this directory node
    const dirNode = new ls_exec_pb /* LsDirectoryTreeNode */.vq({
      absPath: dirPath,
      childrenDirs: [],
      childrenFiles: [],
      childrenWereProcessed: !budgetExceeded,
      fullSubtreeExtensionCounts: {}
    });
    dirNodes.set(dirPath, dirNode);
    // Add to parent's children
    const parentNode = dirNodes.get(parentPath);
    if (parentNode) {
      parentNode.childrenDirs.push(dirNode);
    }
  }
  /**
   * Recursively sort children directories and files by name.
   */
  sortTreeChildren(node) {
    node.childrenDirs.sort((a, b) => (0, external_node_path_.basename)(a.absPath).localeCompare((0, external_node_path_.basename)(b.absPath)));
    node.childrenFiles.sort((a, b) => a.name.localeCompare(b.name));
    // Recurse into child directories
    for (const childDir of node.childrenDirs) {
      this.sortTreeChildren(childDir);
    }
  }
}
//# sourceMappingURL=ls.js.map