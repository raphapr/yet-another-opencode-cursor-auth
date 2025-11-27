var request_context_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var request_context_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const execFile = (0, external_node_util_.promisify)(external_node_child_process_.execFile);
async function getGitRepoPathForWorkspacePath(path) {
  try {
    const {
      stdout
    } = await execFile("git", ["rev-parse", "--show-toplevel"], {
      cwd: path
    });
    return stdout.toString().trim();
  } catch {
    return undefined;
  }
}
async function getGitStatusForRepoPath(ctx, repoPath) {
  const env_1 = {
    stack: [],
    error: void 0,
    hasError: false
  };
  try {
    const _span = request_context_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.getGitStatusForRepoPath")), false);
    try {
      // Use --short for fast, compact output (agents can read it fine)
      const {
        stdout
      } = await execFile("git", ["--no-optional-locks", "status", "--short", "--branch"], {
        cwd: repoPath
      });
      return stdout.toString();
    } catch {
      return undefined;
    }
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    request_context_disposeResources(env_1);
  }
}
async function getGitBranchForRepoPath(repoPath) {
  try {
    const {
      stdout
    } = await execFile("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: repoPath
    });
    const branch = stdout.toString().trim();
    if (branch === "HEAD" || branch.length === 0) {
      return undefined;
    }
    return branch;
  } catch {
    return undefined;
  }
}
async function computeEnv(_ctx, workspacePaths, projectDir, notesSessionId, getSandboxEnabled, userTerminalHint) {
  const osVersion = `${external_node_os_.platform()} ${external_node_os_.release()}`;
  const shell = (0, shell_exec_dist /* getSuggestedShell */.G6)(userTerminalHint);
  const timeZone = (() => {
    try {
      const resolvedOptions = new Intl.DateTimeFormat().resolvedOptions();
      return resolvedOptions.timeZone ?? undefined;
    } catch {
      return undefined;
    }
  })();
  // Calculate folder paths if projectDir is available
  const projectFolder = projectDir;
  const terminalsFolder = projectDir ? `${projectDir}/terminals` : undefined;
  const agentSharedNotesFolder = projectDir ? `${projectDir}/agent-notes/shared` : undefined;
  const agentConversationNotesFolder = projectDir && notesSessionId ? `${projectDir}/agent-notes/${notesSessionId}` : undefined;
  // Determine if sandbox is enabled: check environment support and user preference
  // If getSandboxEnabled is provided, use it (it should check both environment and user preference)
  // Otherwise, default to false since we don't know the user preference
  const sandboxEnabled = getSandboxEnabled ? getSandboxEnabled() : false;
  return new request_context_exec_pb /* RequestContextEnv */.GE({
    osVersion,
    workspacePaths,
    shell,
    sandboxEnabled,
    projectFolder,
    terminalsFolder,
    agentSharedNotesFolder,
    agentConversationNotesFolder,
    timeZone
  });
}
async function computeGit(ctx, workspacePaths) {
  const env_2 = {
    stack: [],
    error: void 0,
    hasError: false
  };
  try {
    const span = request_context_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.computeGit")), false);
    // First, get all git repo paths for all workspace paths
    const repoPaths = await Promise.all(workspacePaths.map(path => getGitRepoPathForWorkspacePath(path)));
    // Dedupe repo paths (filter out undefined and duplicates)
    const uniqueRepoPaths = [...new Set(repoPaths.filter(path => path !== undefined))];
    // Now fetch git status, branch, and remote URL for each unique repo path in parallel
    const statusResults = await Promise.all(uniqueRepoPaths.map(async repoPath => ({
      repoPath,
      status: await getGitStatusForRepoPath(span.ctx, repoPath),
      branchName: await getGitBranchForRepoPath(repoPath),
      remoteUrl: await getGitRemoteUrl(repoPath)
    })));
    // Build git repos list, filtering out any repos where we couldn't get status
    const gitRepos = statusResults.filter(result => result.status !== undefined || result.branchName !== undefined).map(result => new request_context_exec_pb /* GitRepoInfo */.DS({
      path: result.repoPath,
      status: result.status,
      branchName: result.branchName,
      remoteUrl: result.remoteUrl
    }));
    return gitRepos;
  } catch (e_2) {
    env_2.error = e_2;
    env_2.hasError = true;
  } finally {
    request_context_disposeResources(env_2);
  }
}
class LocalRequestContextExecutor {
  constructor(cursorRulesService, cloudRulesService, repositoryProvider, lsExecutor, mcpLease, workspacePath, projectDir, fileWatcher, getSandboxEnabled, skillsService, userTerminalHint) {
    this.cursorRulesService = cursorRulesService;
    this.cloudRulesService = cloudRulesService;
    this.repositoryProvider = repositoryProvider;
    this.lsExecutor = lsExecutor;
    this.mcpLease = mcpLease;
    this.workspacePath = workspacePath;
    this.projectDir = projectDir;
    this.skillsService = skillsService;
    this.userTerminalHint = userTerminalHint;
    this.rebuildCacheTraceId = undefined;
    this.enableCaching = !!fileWatcher;
    this.getSandboxEnabled = getSandboxEnabled;
    // If file watcher provided, eagerly compute and cache
    if (fileWatcher) {
      // Eagerly start computing (don't wait for first request)
      this.rebuildCache();
      // Subscribe to rebuild cache on any file change
      this.unsubscribeWatcher = fileWatcher.subscribe(() => {
        this.rebuildCache();
      });
    }
  }
  rebuildCache() {
    // Clear any pending debounced rebuild
    if (this.rebuildDebounceTimeout) {
      clearTimeout(this.rebuildDebounceTimeout);
    }
    this.rebuildDebounceTimeout = setTimeout(() => {
      const env_3 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const ctx = (0, dist /* createContext */.q6)();
        const span = request_context_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.rebuild")), false);
        this.rebuildDebounceTimeout = undefined;
        this.rebuildCacheTraceId = span.span.spanContext().traceId;
        this.requestContextCache = this.computeRequestContext(span.ctx, new request_context_exec_pb /* RequestContextArgs */._K());
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        request_context_disposeResources(env_3);
      }
    }, 500);
  }
  dispose() {
    if (this.rebuildDebounceTimeout) {
      clearTimeout(this.rebuildDebounceTimeout);
      this.rebuildDebounceTimeout = undefined;
    }
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
    this.requestContextCache = undefined;
  }
  async computeRequestContext(ctx, args) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = request_context_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.computeRequestContext")), false);
      const workspacePaths = Array.isArray(this.workspacePath) ? this.workspacePath : [this.workspacePath || process.cwd()];
      const firstWorkspacePath = workspacePaths[0];
      const projectDir = this.projectDir;
      const signal = AbortSignal.timeout(1000);
      const projectLayoutPromises = workspacePaths.map(async path => {
        const env_5 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const lsSpan = request_context_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(span.ctx.withName("LocalRequestContextExecutor.computeRequestContext.projectLayoutPromises.lsExecutor.execute")), false);
          const lsResult = await this.lsExecutor.execute(lsSpan.ctx, new ls_exec_pb /* LsArgs */.xe({
            path,
            ignore: []
          }));
          return lsResult.result.case === "success" ? lsResult.result.value.directoryTreeRoot : undefined;
        } catch (e_5) {
          env_5.error = e_5;
          env_5.hasError = true;
        } finally {
          request_context_disposeResources(env_5);
        }
      });
      const [mcpInstructions, rules, cloudRule, env, gitRepos, codebaseReference, mcpTools, conversationNotesListing, sharedNotesListing, projectLayouts, skills] = await Promise.all([this.mcpLease.getInstructions(span.ctx).catch(() => []), this.cursorRulesService.getAllCursorRules(span.ctx), this.cloudRulesService ? this.cloudRulesService.getCloudRule(span.ctx) : Promise.resolve(null), computeEnv(span.ctx, workspacePaths, projectDir, args.notesSessionId, this.getSandboxEnabled, this.userTerminalHint), computeGit(span.ctx, workspacePaths), this.repositoryProvider.getCodebaseReference(span.ctx, signal).catch(() => undefined), this.mcpLease.getTools(span.ctx).catch(() => []), projectDir && args.notesSessionId ? generateConversationNotesTreeListing(projectDir, args.notesSessionId) : Promise.resolve(undefined), projectDir ? generateSharedNotesTreeListing(projectDir) : Promise.resolve(undefined), Promise.all(projectLayoutPromises).then(layouts => layouts.filter(l => l !== undefined)), this.skillsService ? this.skillsService.getSkills(span.ctx).catch(() => []) : Promise.resolve([])]);
      const requestContext = new request_context_exec_pb /* RequestContext */.bb({
        rules,
        env,
        gitRepos,
        repositoryInfo: codebaseReference ? [{
          relativeWorkspacePath: codebaseReference.relativeWorkspacePath,
          repoName: codebaseReference.repoName,
          repoOwner: codebaseReference.repoOwner,
          isTracked: codebaseReference.isTracked,
          isLocal: codebaseReference.isLocal,
          orthogonalTransformSeed: codebaseReference.orthogonalTransformSeed,
          pathEncryptionKey: codebaseReference.pathEncryptionKey
        }] : [],
        tools: mcpTools.map(tool => new mcp_pb /* McpToolDefinition */.gd({
          name: tool.name,
          providerIdentifier: tool.providerIdentifier,
          toolName: tool.toolName,
          description: tool.description,
          inputSchema: tool.inputSchema ? struct_pb /* Value */.WT.fromJson(tool.inputSchema) : undefined
        })),
        conversationNotesListing,
        sharedNotesListing,
        projectLayouts,
        mcpInstructions,
        skillOptions: skills.length > 0 ? new request_context_exec_pb /* SkillOptions */.uw({
          skillDescriptors: skills.map(skill => new request_context_exec_pb /* SkillDescriptor */.ng({
            name: skill.name,
            description: skill.description,
            folderPath: skill.folderPath
          }))
        }) : undefined
      });
      if (cloudRule !== null && cloudRule !== undefined) {
        requestContext.cloudRule = cloudRule;
      }
      return requestContext;
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      request_context_disposeResources(env_4);
    }
  }
  async execute(ctx, args) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = request_context_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("LocalRequestContextExecutor.execute")), false);
      span.span.setAttribute("enableCaching", this.enableCaching);
      span.span.setAttribute("isCached", !!this.requestContextCache);
      try {
        let requestContext;
        if (this.enableCaching) {
          // If no cache (first time or invalidated), compute it
          if (!this.requestContextCache) {
            this.requestContextCache = this.computeRequestContext(span.ctx, args);
          }
          {
            const env_7 = {
              stack: [],
              error: void 0,
              hasError: false
            };
            try {
              const cacheSpan = request_context_addDisposableResource(env_7, (0, dist /* createSpan */.VI)(span.ctx.withName("LocalRequestContextExecutor.execute.computeRequestContext.requestContextCache")), false);
              if (this.rebuildCacheTraceId) {
                cacheSpan.span.setAttribute("cacheTraceId", this.rebuildCacheTraceId);
              }
              requestContext = await this.requestContextCache;
            } catch (e_6) {
              env_7.error = e_6;
              env_7.hasError = true;
            } finally {
              request_context_disposeResources(env_7);
            }
          }
          // Always reload MCP tools from the lease, even when using cache
          const mcpTools = await this.mcpLease.getTools(span.ctx).catch(() => []);
          requestContext = new request_context_exec_pb /* RequestContext */.bb({
            ...requestContext,
            tools: mcpTools.map(tool => new mcp_pb /* McpToolDefinition */.gd({
              name: tool.name,
              providerIdentifier: tool.providerIdentifier,
              toolName: tool.toolName,
              description: tool.description,
              inputSchema: tool.inputSchema ? struct_pb /* Value */.WT.fromJson(tool.inputSchema) : undefined
            }))
          });
        } else {
          // No caching - compute fresh each time
          requestContext = await this.computeRequestContext(span.ctx, args);
        }
        return new request_context_exec_pb /* RequestContextResult */._G({
          result: {
            case: "success",
            value: new request_context_exec_pb /* RequestContextSuccess */.yW({
              requestContext
            })
          }
        });
      } catch (error) {
        span.span.recordException(error);
        return new request_context_exec_pb /* RequestContextResult */._G({
          result: {
            case: "error",
            value: new request_context_exec_pb /* RequestContextError */.nf({
              error: error instanceof Error ? error.message : String(error)
            })
          }
        });
      }
    } catch (e_7) {
      env_6.error = e_7;
      env_6.hasError = true;
    } finally {
      request_context_disposeResources(env_6);
    }
  }
}
//# sourceMappingURL=request-context.js.map