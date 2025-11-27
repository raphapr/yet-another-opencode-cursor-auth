var cursor_rules_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var cursor_rules_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class MergedCursorRulesService {
  constructor(cursorRulesServices) {
    this.cursorRulesServices = cursorRulesServices;
  }
  async getAllCursorRules(ctx) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("MergedCursorRulesService.getAllCursorRules")), false);
      // Call getAllCursorRules on all services in parallel
      const allRulesPromises = this.cursorRulesServices.map(service => service.getAllCursorRules(span.ctx).catch(err => {
        (0, external_node_util_.debuglog)("Failed to load cursor rules from service:", err);
        return [];
      }));
      const allRulesArrays = await Promise.all(allRulesPromises);
      // Flatten all rules into a single array
      const allRules = allRulesArrays.flat();
      // Dedupe by fullPath - first occurrence wins
      const seenPaths = new Set();
      const dedupedRules = [];
      for (const rule of allRules) {
        if (!seenPaths.has(rule.fullPath)) {
          seenPaths.add(rule.fullPath);
          dedupedRules.push(rule);
        }
      }
      return dedupedRules;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_1);
    }
  }
  reload(ctx) {
    for (const service of this.cursorRulesServices) {
      service.reload(ctx);
    }
  }
  onDidChangeRules(callback) {
    // Set up callback on all services and collect their dispose functions
    const disposeFunctions = [];
    for (const service of this.cursorRulesServices) {
      if (service.onDidChangeRules) {
        disposeFunctions.push(service.onDidChangeRules(callback));
      }
    }
    // Return a dispose function that calls all collected dispose functions
    return () => {
      for (const dispose of disposeFunctions) {
        dispose();
      }
    };
  }
  dispose() {
    for (const service of this.cursorRulesServices) {
      if (service.dispose) {
        service.dispose();
      }
    }
  }
}
class LocalCursorRulesService {
  constructor(ctx, rootDirectory, rgPath, loadNestedRules, getClaudeMdEnabled, fileWatcher) {
    this.rootDirectory = rootDirectory;
    this.rgPath = rgPath;
    this.loadNestedRules = loadNestedRules;
    this.getClaudeMdEnabled = getClaudeMdEnabled;
    this.loadTraceId = undefined;
    this.onChangeCallbacks = new Set();
    this._rules = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load cursor rules:", err);
      return [];
    });
    // If file watcher provided, subscribe to reload on file changes
    // NOTE: we don't need to watch for rules changes in subdirectories because we don't provide such rules in the
    // system prompt -- we tell the agent to load them as needed.
    // But also note that we won't be catching new rules files in subdirectories, so the agent might not see them.
    // TODO: add efficient file watching for rules in subdirectories.
    if (fileWatcher) {
      const patterns = [".cursor/rules/**/*.mdc", "AGENTS.md", "CLAUDE.md", "CLAUDE.local.md", ".cursorrules"];
      this.unsubscribeWatcher = fileWatcher.subscribe(this.rootDirectory, patterns, path => {
        const env_2 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const reloadCtx = (0, dist /* createContext */.q6)();
          const span = cursor_rules_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(reloadCtx.withName("LocalCursorRulesService.fileWatcher.subscribe")), false);
          this.reloadAtPath(span.ctx, path);
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          cursor_rules_service_disposeResources(env_2);
        }
      });
    }
  }
  /**
   * Reload rules (e.g., when settings change)
   */
  reload(ctx) {
    this._rules = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load cursor rules:", err);
      return [];
    });
    // Notify all callbacks that rules have changed
    for (const callback of this.onChangeCallbacks) {
      callback();
    }
  }
  reloadAtPath(ctx, path) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.reloadAtPath")), false);
      const previousRules = this._rules;
      this._rules = (async () => {
        const previousRulesAtOtherPaths = (await previousRules).filter(r => r.fullPath !== path);
        const rulesAtPath = (await this.readRulesAtPath(span.ctx, path)).map(r => this.toCursorRule(r));
        return [...previousRulesAtOtherPaths, ...rulesAtPath];
      })().catch(err => {
        (0, external_node_util_.debuglog)("Failed to load cursor rules at path:", err);
        return [];
      });
      // Notify all callbacks that rules have changed
      for (const callback of this.onChangeCallbacks) {
        callback();
      }
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_3);
    }
  }
  isRuleMarkdownFile(filename) {
    return filename === "CLAUDE.md" || filename === "CLAUDE.local.md" || filename === "AGENTS.md";
  }
  async readRulesAtPath(ctx, path) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.readRulesAtPath")), false);
      const filename = (0, external_node_path_.basename)(path);
      if (filename === ".cursorrules") {
        // .cursorrules is loaded from workspace root (git root)
        const cwd = (0, external_node_path_.resolve)(this.rootDirectory);
        const gitRoot = await findGitRoot(cwd);
        const workspaceRoot = gitRoot || cwd;
        const cursorRulesRule = await this.loadCursorRulesRule(span.ctx, workspaceRoot);
        return cursorRulesRule ? [cursorRulesRule] : [];
      } else if (filename.endsWith(".mdc")) {
        try {
          const content = await readText(path);
          const parsed = this.parseRuleFile(content);
          if (parsed) {
            return [{
              filename: (0, external_node_path_.basename)(path, ".mdc"),
              path: path,
              frontmatter: parsed.frontmatter,
              body: parsed.body
            }];
          }
        } catch {}
      } else if (this.isRuleMarkdownFile(filename)) {
        try {
          return await this.loadRulesFromMarkdownFile(span.ctx, (0, external_node_path_.dirname)(path), filename);
        } catch {}
      }
      return [];
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_4);
    }
  }
  onDidChangeRules(callback) {
    this.onChangeCallbacks.add(callback);
    return () => {
      this.onChangeCallbacks.delete(callback);
    };
  }
  dispose() {
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
  }
  async load(ctx) {
    const env_5 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.load")), false);
      this.loadTraceId = span.span.spanContext().traceId;
      const cwd = (0, external_node_path_.resolve)(this.rootDirectory);
      const gitRoot = await findGitRoot(cwd);
      const workspaceRoot = gitRoot || cwd;
      const cursorRulesRule = this.loadCursorRulesRule(span.ctx, workspaceRoot).then(r => r ? [r] : []);
      const hierarchical = this.loadRulesFromHierarchy(span.ctx, cwd);
      const fromSubdirectories = this.loadNestedRules && gitRoot ? this.loadRulesFromSubdirectories(span.ctx, cwd) : [];
      const markdownFilesFromSubdirectories = this.loadNestedRules && gitRoot ? this.loadMarkdownFilesFromSubdirectories(span.ctx, cwd) : [];
      const allRules = (await Promise.all([cursorRulesRule, hierarchical, fromSubdirectories, markdownFilesFromSubdirectories])).flat();
      const map = new Map();
      for (const r of allRules) {
        map.set(r.path, r);
      }
      return [...map.values()].map(pr => this.toCursorRule(pr));
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_5);
    }
  }
  async loadCursorRulesRule(ctx, workspaceRoot) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = cursor_rules_service_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadCursorrules")), false);
      try {
        const cursorRulesPath = (0, external_node_path_.join)(workspaceRoot, ".cursorrules");
        const st = await (0, promises_.stat)(cursorRulesPath);
        if (st.isFile()) {
          const content = await readText(cursorRulesPath);
          return {
            filename: ".cursorrules",
            path: cursorRulesPath,
            frontmatter: {
              alwaysApply: true
            },
            body: content
          };
        }
      } catch {}
      return null;
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_6);
    }
  }
  async getAllCursorRules(ctx) {
    const env_7 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_7, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.getAllCursorRules")), false);
      span.span.setAttribute("cacheTraceId", this.loadTraceId ?? "undefined");
      return await this._rules;
    } catch (e_7) {
      env_7.error = e_7;
      env_7.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_7);
    }
  }
  toCursorRule(rule) {
    let type; // oneof
    if (rule.frontmatter.alwaysApply === true) {
      type = {
        case: "global",
        value: new cursor_rules_pb /* CursorRuleTypeGlobal */.i9()
      };
    } else if (typeof rule.frontmatter.globs === "string" && rule.frontmatter.globs.trim().length > 0) {
      const globs = rule.frontmatter.globs.toString().split(",").map(g => g.trim()).filter(Boolean);
      type = {
        case: "fileGlobbed",
        value: new cursor_rules_pb /* CursorRuleTypeFileGlobs */.uT({
          globs
        })
      };
    } else if (typeof rule.frontmatter.description === "string" && rule.frontmatter.description.trim().length > 0) {
      type = {
        case: "agentFetched",
        value: new cursor_rules_pb /* CursorRuleTypeAgentFetched */.Xo({
          description: String(rule.frontmatter.description)
        })
      };
    } else {
      type = {
        case: "manuallyAttached",
        value: new cursor_rules_pb /* CursorRuleTypeManuallyAttached */._u()
      };
    }
    return new cursor_rules_pb /* CursorRule */.DX({
      fullPath: rule.path,
      content: rule.body,
      type: new cursor_rules_pb /* CursorRuleType */.f5({
        type
      })
    });
  }
  async loadRulesFromHierarchy(ctx, startPath) {
    const env_8 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_8, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromHierarchy")), false);
      const rules = [];
      let currentPath = startPath;
      // Load from .cursor/rules directory format and CLAUDE.md/AGENTS.md in hierarchy
      while (true) {
        // Check for .cursor/rules directory
        const rulesDir = (0, external_node_path_.join)(currentPath, ".cursor", "rules");
        if (await this.dirIsDirectory(span.ctx, rulesDir)) rules.push(...(await this.loadRulesFromDirectory(span.ctx, rulesDir, this.rgPath)));
        // Optionally check for CLAUDE.md and CLAUDE.local.md if enabled
        if (this.getClaudeMdEnabled()) {
          rules.push(...(await this.loadRulesFromMarkdownFile(span.ctx, currentPath, "CLAUDE.md")));
          rules.push(...(await this.loadRulesFromMarkdownFile(span.ctx, currentPath, "CLAUDE.local.md")));
        }
        // Check for AGENTS.md
        rules.push(...(await this.loadRulesFromMarkdownFile(span.ctx, currentPath, "AGENTS.md")));
        const parentPath = (0, external_node_path_.dirname)(currentPath);
        if (parentPath === currentPath) break;
        currentPath = parentPath;
      }
      span.span.setAttribute("rules", rules.length);
      return rules;
    } catch (e_8) {
      env_8.error = e_8;
      env_8.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_8);
    }
  }
  async loadRulesFromMarkdownFile(ctx, currentPath, filename) {
    const env_9 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_9, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromMarkdownFile")), false);
      span.span.setAttribute("filename", filename);
      try {
        const path = (0, external_node_path_.join)(currentPath, filename);
        const st = await (0, promises_.stat)(path);
        if (st.isFile()) {
          const content = await readText(path);
          return [{
            filename: (0, external_node_path_.basename)(path, ".md"),
            path: path,
            frontmatter: {
              alwaysApply: true
            },
            body: content
          }];
        }
      } catch {}
      return [];
    } catch (e_9) {
      env_9.error = e_9;
      env_9.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_9);
    }
  }
  async loadRulesFromSubdirectories(ctx, root) {
    const env_10 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_10, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromSubdirectories")), false);
      const acc = [];
      let fileCount = 0;
      try {
        for await (const relativePath of ripwalk({
          rgPath: this.rgPath,
          root,
          includeGlobs: ["*/**/.cursor/rules/**/*.mdc"],
          excludeGlobs: DEFAULT_GLOB_IGNORE_DIRS
        })) {
          fileCount++;
          try {
            const path = (0, external_node_path_.resolve)(root, relativePath);
            const content = await readText(path);
            const parsed = this.parseRuleFile(content);
            if (parsed) {
              acc.push({
                filename: (0, external_node_path_.basename)(path, ".mdc"),
                path,
                frontmatter: parsed.frontmatter,
                body: parsed.body
              });
            }
          } catch {}
        }
      } catch {}
      span.span.setAttribute("ruleFiles", fileCount);
      return acc;
    } catch (e_10) {
      env_10.error = e_10;
      env_10.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_10);
    }
  }
  async loadMarkdownFilesFromSubdirectories(ctx, root) {
    const env_11 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_11, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadMarkdownFilesFromSubdirectories")), false);
      const acc = [];
      let fileCount = 0;
      try {
        // Build glob patterns for markdown files (exclude root level)
        const patterns = ["*/**/AGENTS.md"];
        if (this.getClaudeMdEnabled()) {
          patterns.push("*/**/CLAUDE.md", "*/**/CLAUDE.local.md");
        }
        for await (const relativePath of ripwalk({
          rgPath: this.rgPath,
          root,
          includeGlobs: patterns,
          excludeGlobs: DEFAULT_GLOB_IGNORE_DIRS
        })) {
          fileCount++;
          try {
            const path = (0, external_node_path_.resolve)(root, relativePath);
            const filename = (0, external_node_path_.basename)(path);
            if (!this.isRuleMarkdownFile(filename)) {
              continue;
            }
            const dirPath = (0, external_node_path_.dirname)(path);
            const rules = await this.loadRulesFromMarkdownFile(span.ctx, dirPath, filename);
            acc.push(...rules);
          } catch {}
        }
      } catch {}
      span.span.setAttribute("markdownFiles", fileCount);
      return acc;
    } catch (e_11) {
      env_11.error = e_11;
      env_11.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_11);
    }
  }
  // dir is a .cursor/rules directory or a subdirectory of one
  async loadRulesFromDirectory(ctx, dir, rgPath) {
    const env_12 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cursor_rules_service_addDisposableResource(env_12, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.loadRulesFromDirectory")), false);
      const rules = [];
      try {
        for await (const relativePath of ripwalk({
          rgPath,
          root: dir,
          includeGlobs: ["**/*.mdc"]
        })) {
          const fullPath = (0, external_node_path_.join)(dir, relativePath);
          rules.push(...(await this.readRulesAtPath(span.ctx, fullPath)));
        }
      } catch {}
      span.span.setAttribute("rules", rules.length);
      return rules;
    } catch (e_12) {
      env_12.error = e_12;
      env_12.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_12);
    }
  }
  async dirIsDirectory(ctx, path) {
    const env_13 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = cursor_rules_service_addDisposableResource(env_13, (0, dist /* createSpan */.VI)(ctx.withName("LocalCursorRulesService.dirIsDirectory")), false);
      try {
        const st = await (0, promises_.stat)(path);
        return st.isDirectory();
      } catch {
        return false;
      }
    } catch (e_13) {
      env_13.error = e_13;
      env_13.hasError = true;
    } finally {
      cursor_rules_service_disposeResources(env_13);
    }
  }
  parseRuleFile(content) {
    const parts = content.split("---").filter(Boolean);
    if (parts.length < 2) return null;
    const frontmatterText = parts[0].trim();
    const body = parts.slice(1).join("---").trim();
    const frontmatter = {};
    for (const rawLine of frontmatterText.split("\n")) {
      const line = rawLine.replace(/\r$/, "");
      const i = line.indexOf(":");
      if (i === -1) continue;
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      if (value === "true") frontmatter[key] = true;else if (value === "false") frontmatter[key] = false;else frontmatter[key] = value;
    }
    return {
      frontmatter,
      body
    };
  }
}
//# sourceMappingURL=cursor-rules-service.js.map