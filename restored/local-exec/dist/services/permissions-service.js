var permissions_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var permissions_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
const PROTECTED_CONFIG_FILES = ["cli.json", "cli-config.json", "mcp.json", "mcp-approvals.json", ".workspace-trusted", ".cursorignore" // This is needed because you can negate other cursorignores in a cursorignore
];
/**
 * Checks if policy1 is stricter than or equal to policy2.
 * Returns true if policy1 can be automatically approved given policy2 as the baseline.
 * This means policy1 must not grant any permissions that policy2 doesn't grant.
 */
function isPolicyStricterOrEqual(policy1, policy2) {
  // If policy2 is insecure_none (no restrictions), any policy is stricter or equal
  if (policy2.type === "insecure_none") {
    return true;
  }
  // If policy1 is insecure_none but policy2 is not, policy1 is looser
  if (policy1.type === "insecure_none") {
    return false;
  }
  // At this point both policies are either workspace_readonly or workspace_readwrite
  // Check network access: policy1 must not have network if policy2 doesn't
  if (policy1.network_access && !policy2.network_access) {
    return false;
  }
  // Check git writes: if policy2 blocks git writes, policy1 must also block them
  // (or be even more restrictive, e.g., readonly)
  const policy2BlocksGitWrites = policy2.type === "workspace_readwrite" && policy2.block_git_writes === true;
  const policy1BlocksGitWrites = policy1.type === "workspace_readonly" || policy1.type === "workspace_readwrite" && policy1.block_git_writes === true;
  if (policy2BlocksGitWrites && !policy1BlocksGitWrites) {
    return false;
  }
  // Check read/write permissions: readonly is stricter than readwrite
  if (policy1.type === "workspace_readonly" && policy2.type === "workspace_readwrite") {
    return true;
  }
  // If both are readonly or both are readwrite, they're equal in this dimension
  if (policy1.type === policy2.type) {
    return true;
  }
  // policy1 is readwrite but policy2 is readonly - policy1 is looser
  return false;
}
/**
 * Helper to wrap a command and track its approval state.
 */
class ApprovableCommand {
  constructor(command, requestedPolicy, preapprovedPolicy) {
    this.command = command;
    this.requestedPolicy = requestedPolicy;
    // Command is preapproved if preapprovedPolicy is provided and
    // the requested policy is stricter or equal to the preapproved policy
    const preapproved = preapprovedPolicy !== undefined && isPolicyStricterOrEqual(requestedPolicy, preapprovedPolicy);
    this.state = preapproved ? "runnable" : "approvable";
  }
  approveWithPolicy(policy) {
    if (this.state === "approvable" && isPolicyStricterOrEqual(this.requestedPolicy, policy)) {
      this.state = "runnable";
    }
  }
  deny() {
    this.state = "denied";
  }
  isRunnable() {
    return this.state === "runnable";
  }
}
class InteractivePermissionsService {
  constructor(ignoreService, pendingDecisionStore, permissionsProvider, teamSettingsService, rootDirectory) {
    this.ignoreService = ignoreService;
    this.pendingDecisionStore = pendingDecisionStore;
    this.permissionsProvider = permissionsProvider;
    this.teamSettingsService = teamSettingsService;
    this.rootDirectories = Array.isArray(rootDirectory) ? rootDirectory : [rootDirectory ?? process.cwd()];
  }
  /**
   * Check if a file read should be blocked.
   * Blocks if cursor ignored or explicitly denied by permissions.
   * @returns false if allowed, BlockReason if blocked
   */
  async shouldBlockRead(filePath) {
    const absolutePath = resolvePath(filePath);
    // Check repo blocklist first
    if (await this.ignoreService.isRepoBlocked(absolutePath)) {
      return {
        type: "adminBlock",
        source: "Team repo blocklist"
      };
    }
    // Permissions explicit deny for reads
    if (await this.isPathExplicitlyDenied("Read", absolutePath)) {
      return {
        type: "permissionsConfig"
      };
    }
    // Check if cursor ignored — resolve real path first to follow symlinks
    const realAbsolutePathForIgnore = await resolveRealPath(absolutePath);
    if (await this.ignoreService.isCursorIgnored(realAbsolutePathForIgnore)) {
      return {
        type: "cursorIgnore"
      };
    }
    // Permissions explicit allow for reads => allow outright
    // this really doesn't matter since we allow reads for out of workspace and dot files
    if (await this.isPathExplicitlyAllowed("Read", absolutePath)) {
      return false;
    }
    // Allow reads for out of workspace and dot files
    return false;
  }
  /**
   * Check if a file write should be blocked.
   * Auto-blocks cursor ignored files.
   * For other cases (out of workspace, dot files), prompts the user unless explicitly allowed by permissions.
   * Explicit deny in permissions blocks immediately.
   * Respects auto-run mode to skip approvals when enabled.
   * @returns false if allowed, BlockReason if blocked
   */
  async shouldBlockWrite(parentCtx, filePath, newContents) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = permissions_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("InteractivePermissionsService.shouldBlockWrite")), false);
      const ctx = span.ctx;
      const absolutePath = resolvePath(filePath);
      // Check repo blocklist first
      if (await this.ignoreService.isRepoBlocked(absolutePath)) {
        return {
          type: "adminBlock",
          source: "Team repo blocklist"
        };
      }
      // Permissions explicit deny for writes
      if (await this.isPathExplicitlyDenied("Write", absolutePath)) {
        return {
          type: "permissionsConfig"
        };
      }
      // Check if cursor ignored - auto block
      if (await this.ignoreService.isCursorIgnored(absolutePath)) {
        return {
          type: "cursorIgnore"
        };
      }
      // Explicit allow for writes — skip prompts
      if (await this.isPathExplicitlyAllowed("Write", absolutePath)) {
        return false;
      }
      const perms = await this.getPermissions();
      if (perms.userConfiguredPolicy.type === "workspace_readonly") {
        return {
          type: "permissionsConfig",
          isReadonly: true
        };
      }
      const isAutoRun = perms.approvalMode === "unrestricted";
      if (isAutoRun) {
        return false;
      }
      const getIsNewFileAndDiffString = async () => {
        let isNewFile = false;
        let originalContents = "";
        try {
          originalContents = await readText(absolutePath);
          isNewFile = false;
        } catch {
          isNewFile = true;
        }
        let diffString = "";
        if (isNewFile) {
          diffString = newContents;
        } else {
          const ensureNL = s => s.endsWith("\n") ? s : `${s}\n`;
          const {
            hunks
          } = structuredPatch("a", "b", ensureNL(originalContents), ensureNL(newContents), "", "", {
            context: 2
          });
          diffString = hunks.map(h => h.lines
          // add a little padding to the lines so that the diff is easier to read
          .map(line => line.length > 0 ? `${line[0]} ${line.slice(1)}` : line).join("\n")).join("\n...\n");
        }
        return {
          isNewFile,
          diffString
        };
      };
      // Resolve real paths following symlinks to check workspace boundaries
      // This ensures symlinks pointing outside the workspace are properly detected
      const realAbsolutePath = await resolveRealPath(absolutePath);
      // Check if out of workspace by checking against all workspace paths
      let isInWorkspace = false;
      let matchedRootDirectory;
      for (const rootDir of this.rootDirectories) {
        const realRootDirectory = await resolveRealPath(rootDir);
        if (realAbsolutePath.startsWith(realRootDirectory)) {
          isInWorkspace = true;
          matchedRootDirectory = rootDir;
          break;
        }
      }
      if (!isInWorkspace) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: "Out of workspace",
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "outOfWorkspace"
          }
        };
      }
      // Normalize path for case-insensitive comparison
      // Some FS are case insensitive, do this for safety.
      const relativePath = (0, external_node_path_.relative)(matchedRootDirectory, absolutePath);
      let pathComponents = relativePath.split(external_node_path_.sep);
      pathComponents = pathComponents.map(c => false ? 0 : c);
      // Check if any path segment contains ~ (DOS short paths) on Windows
      // DOS short paths look like PROGRA~1 instead of Program Files
      if (false)
        // removed by dead control flow
        {}
      const normalizedComponents = pathComponents.map(component => component.toLowerCase());
      // Get last path segment (filename)
      const lastPathSegment = normalizedComponents[normalizedComponents.length - 1] ?? "";
      // Match VSCode's isRestrictedFile checks (ensure we don't miss any):
      // 1. Block ALL files in .vscode/ directory (always, not conditional)
      const isInVscodeDir = normalizedComponents.some(component => component === ".vscode");
      if (isInVscodeDir) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // 2. Block ALL files in .git/ directory (always, not conditional)
      const isInGitDir = normalizedComponents.some(component => component === ".git");
      if (isInGitDir) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // 3. Block ALL files in .cursor/ directory (always, not conditional)
      // EXCEPT .cursor/rules/*.md files
      const isInCursorDir = normalizedComponents.some(component => component === ".cursor");
      if (isInCursorDir) {
        // Check if path is in .cursor/rules/ and ends with .md
        const cursorIndex = normalizedComponents.indexOf(".cursor");
        const isCursorRulesMd = cursorIndex !== -1 && cursorIndex + 1 < normalizedComponents.length && normalizedComponents[cursorIndex + 1] === "rules" && lastPathSegment.endsWith(".md");
        if (!isCursorRulesMd) {
          const {
            isNewFile,
            diffString
          } = await getIsNewFileAndDiffString();
          return {
            type: "needsApproval",
            approvalReason: `Protected config file: ${lastPathSegment}`,
            approvalDetails: {
              type: "fileEdit",
              isNewFile,
              diffString,
              blockReason: "protectedConfig"
            }
          };
        }
      }
      // 4. Block .code-workspace files anywhere
      if (lastPathSegment.endsWith(".code-workspace")) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // Check .cursor file protection (additional check beyond VSCode)
      const cursorFileBlockReason = await this.checkCursorFileProtection(pathComponents);
      if (cursorFileBlockReason) {
        return cursorFileBlockReason;
      }
      // Check protected config files (case-insensitive comparison)
      // This includes .cursorignore (VSCode check) and additional files (more strict)
      if (PROTECTED_CONFIG_FILES.some(protectedFile => protectedFile.toLowerCase() === lastPathSegment)) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: `Protected config file: ${lastPathSegment}`,
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "protectedConfig"
          }
        };
      }
      // Check if dot file
      const isDotFile = pathComponents.some(component => component.startsWith(".") && component.toLowerCase() !== ".cursor" && component.toLowerCase() !== ".vscode" && component.length > 1);
      if (isDotFile) {
        const {
          isNewFile,
          diffString
        } = await getIsNewFileAndDiffString();
        return {
          type: "needsApproval",
          approvalReason: "Dot file",
          approvalDetails: {
            type: "fileEdit",
            isNewFile,
            diffString,
            blockReason: "dotFile"
          }
        };
      }
      // Allow all other writes
      return false;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      permissions_service_disposeResources(env_1);
    }
  }
  /**
   * Check if a shell command should be blocked.
   *
   * This is based on a somewhat complicated dance of sandbox policies, allowlists and denylists.
   *
   * We have several allowlists that can be applied.
   * User scoped:
   * - Shell allowlist: Approves commands up to RunLevel.Unsandboxed (effectively unconditionally).
   * - User denylist: Denies a command.
   * - Baseline user sandboxing config: Not really an allowlist but sets the level at which the user is comfortable running commands without approval.
   *
   * Team scoped:
   * - Team allowlist: Approves commands
   * - Team blocklist: Denies commands
   * - Team delete file protection: Denies specifically rm commands.
   *
   * Approval modes:
   * - allowlist: Follow regular sandboxing path with user configured policy
   * - unrestricted: No sandboxing, always run (unless blocked) - applies to all operations
   * - unrestricted-shell: No sandboxing for shell commands only, always run (unless blocked) - applies only to shell commands
   *
   * Since models can issue composite commands, we need to consider each subcommand separately.
   * Commands start life as potentially preapproved based on whether the requested policy is stricter than the user's config.
   * They are then passed through the above allow and deny lists.
   *
   * If any command is hard denied, we deny the entire batch.
   * If all of them are runnable, we approve the batch without user interaction.
   *
   * If none of the above are true, some commands must be approvable so we prompt the user for approval.
   * The form of approval requested is based on the requested policy and approval mode.
   * Regardless of what commands are already runnable they're going to get run together with the requested policy.
   */
  async shouldBlockShellCommand(ctx, command, options, requestedPolicy) {
    const perms = await this.getPermissions();
    const approvalMode = perms.approvalMode;
    const userConfiguredPolicy = perms.userConfiguredPolicy;
    // Extract command information
    const executableCommands = options.parsingResult.executableCommands;
    const hasRedirects = options.parsingResult.hasRedirects;
    const parsingFailed = options.parsingResult.parsingFailed;
    // If no policy was requested, use insecure_none (no sandboxing)
    if (!requestedPolicy) {
      requestedPolicy = {
        type: "insecure_none"
      };
    }
    // Step 1: Get our current preapproved policy
    // If we're in allowlist mode and the requested policy is insecure_none,
    // don't pre-approve based on user config - require explicit allowlist
    const preapprovedPolicy = requestedPolicy.type === "insecure_none" && approvalMode === "allowlist" ? undefined // Don't pre-approve anything - require explicit allowlist
    : userConfiguredPolicy;
    // Step 2: Create a set of commands that are potentially preapproved based on our sandboxing level.
    const commands = executableCommands.map(cmd => new ApprovableCommand(cmd, requestedPolicy, preapprovedPolicy));
    // Step 3: Check our hard deny list.
    const hasHardDeny = await this.hasHardDeny(ctx, commands);
    if (hasHardDeny) {
      return {
        kind: "block",
        reason: {
          type: "permissionsConfig"
        }
      };
    }
    // --- denies past this point can be manually approved but not allowlisted ---
    // Step 4: Apply all of our allowlists.
    const autoRunControls = await this.teamSettingsService.getAutoRunControls();
    const unsandboxedPolicy = {
      type: "insecure_none"
    };
    for (const cmd of commands) {
      if (await this.isInShellAllowlist(cmd)) {
        cmd.approveWithPolicy(unsandboxedPolicy);
      }
      if (autoRunControls && this.isInTeamAllowlist(autoRunControls, cmd)) {
        cmd.approveWithPolicy(unsandboxedPolicy);
      }
    }
    // Step 5: Apply all of our denylists and potentially delete file protection.
    for (const cmd of commands) {
      if (autoRunControls && this.isInTeamBlocklist(autoRunControls, cmd)) {
        cmd.deny();
      }
    }
    const deleteProtectionEnabled = await this.teamSettingsService.getDeleteFileProtection();
    if (deleteProtectionEnabled) {
      for (const cmd of commands) {
        if (cmd.command.name === "rm") {
          cmd.deny();
        }
      }
    }
    // Step 6: Check readonly mode - only block if not all commands are approved
    // Readonly mode still respects allowlists, so if all commands are runnable, allow them
    if (userConfiguredPolicy.type === "workspace_readonly" && approvalMode !== "unrestricted" && approvalMode !== "unrestricted-shell") {
      const allRunnable = commands.every(cmd => cmd.isRunnable());
      if (!allRunnable) {
        return {
          kind: "block",
          reason: {
            type: "permissionsConfig",
            isReadonly: true
          }
        };
      }
    }
    // Step 7: Handle different approval modes
    if (approvalMode === "unrestricted" || approvalMode === "unrestricted-shell") {
      // Unrestricted/unrestricted-shell mode: Run without sandboxing unless blocked
      const allRunnable = commands.every(cmd => cmd.isRunnable());
      if (allRunnable) {
        return {
          kind: "allow",
          policy: {
            type: "insecure_none"
          }
        };
      }
      // If some commands are denied, we need approval
    } else if (approvalMode === "allowlist") {
      // Allowlist mode: Follow regular sandboxing path
      const allRunnable = commands.every(cmd => cmd.isRunnable());
      if (allRunnable) {
        return {
          kind: "allow",
          policy: userConfiguredPolicy
        };
      }
    }
    // Step 8: Issue the appropriate kind of approval.
    // We can only allowlist if team settings permit it and we're in allowlist mode.
    let canAllowlist = !hasRedirects && !parsingFailed && approvalMode === "allowlist";
    const approvalReasons = [];
    const unapprovedCommands = commands.filter(cmd => cmd.state === "approvable");
    if (unapprovedCommands.length > 0) {
      approvalReasons.push(`Not in allowlist: ${unapprovedCommands.map(cmd => cmd.command.fullText).join(", ")}`);
    }
    const deniedCommands = commands.filter(cmd => cmd.state === "denied");
    if (deniedCommands.length > 0) {
      approvalReasons.push(`In team blocklist: ${deniedCommands.map(cmd => cmd.command.fullText).join(", ")}`);
      canAllowlist = false;
    }
    if (autoRunControls?.enabled) {
      const notInTeamAllowlist = commands.filter(cmd => !this.isInTeamAllowlist(autoRunControls, cmd));
      if (notInTeamAllowlist.length > 0) {
        approvalReasons.push(`Not in team allowlist: ${notInTeamAllowlist.map(cmd => cmd.command.fullText).join(", ")}`);
        canAllowlist = false;
      }
    }
    const reason = approvalReasons.join(" • ");
    const allowlistCandidates = [];
    if (canAllowlist) {
      allowlistCandidates.push(...this.generateAllowlistPatterns(unapprovedCommands.map(cmd => cmd.command)));
    }
    const isSandboxAvailable = requestedPolicy.type !== "insecure_none" && userConfiguredPolicy.type !== "insecure_none";
    const isSandboxEnabled = requestedPolicy.type !== "insecure_none";
    const approval = {
      type: OperationType.Shell,
      toolCallId: options.toolCallId,
      details: {
        command,
        workingDirectory: options.workingDirectory,
        timeout: options.timeout,
        reason,
        isSandboxAvailable: approvalMode === "allowlist" ? isSandboxAvailable : false,
        isSandboxEnabled: approvalMode === "allowlist" ? isSandboxEnabled : false,
        canAllowlist,
        notAllowedCommands: allowlistCandidates
      }
    };
    const sandboxResult = await this.pendingDecisionStore.requestApproval(approval);
    if (!sandboxResult.approved) {
      return {
        kind: "block",
        reason: {
          type: "userRejected",
          reason: sandboxResult.reason
        }
      };
    } else {
      // In unrestricted/unrestricted-shell mode, run without sandboxing
      // In allowlist mode, use the requested policy
      const policyToUse = approvalMode === "unrestricted" || approvalMode === "unrestricted-shell" ? {
        type: "insecure_none"
      } : requestedPolicy;
      return {
        kind: "allow",
        policy: policyToUse
      };
    }
  }
  async isInShellAllowlist(command) {
    const perms = await this.getPermissions();
    return perms.allow.some(entry => this.isShellEntry(entry) && this.matchesShell(entry, command.command.fullText));
  }
  isInTeamBlocklist(autoRunControls, command) {
    return autoRunControls.blocked.some(blockedCmd => this.matchesAutoRunCommand(command.command.fullText, blockedCmd));
  }
  isInTeamAllowlist(autoRunControls, command) {
    return autoRunControls.allowed.some(allowedCmd => this.matchesAutoRunCommand(command.command.fullText, allowedCmd));
  }
  async getPermissions() {
    return await this.permissionsProvider.getPermissions();
  }
  async hasHardDeny(ctx, commands) {
    const perms = await this.getPermissions();
    return commands.some(cmd => perms.deny.some(entry => this.isShellEntry(entry) && this.matchesShell(entry, cmd.command.fullText)));
  }
  isShellEntry(entry) {
    return /^\s*(Shell|Bash)\s*\(/.test(entry);
  }
  isPathEntry(kind, entry) {
    const re = new RegExp(`^\\s*${kind}\\s*\\(`);
    return re.test(entry);
  }
  matchesShell(entry, cmd) {
    const m = entry.match(/^\s*(Shell|Bash)\s*\((.*)\)\s*$/);
    if (!m) return false;
    const pattern = m[2]?.trim() ?? "";
    const command = cmd.trim();
    const base = this.extractBaseCommand(command);
    // Support syntax like "curl:*" or "npm run test:*" => base:args
    const colonIdx = pattern.indexOf(":");
    if (colonIdx !== -1) {
      const cmdPat = pattern.slice(0, colonIdx).trim();
      const argsPat = pattern.slice(colonIdx + 1).trim();
      const argsText = command.includes(" ") ? command.slice(command.indexOf(" ") + 1).trim() : "";
      const baseOk = this.matchGlob(cmdPat, base) || this.matchGlob(cmdPat, command);
      const argsOk = this.matchGlob(argsPat, argsText);
      if (baseOk && argsOk) return true;
      // fall through to other matching modes if not matched
    }
    // Glob match against full command first, then prefix, then base command
    if (this.matchGlob(pattern, command)) return true;
    if (command.startsWith(`${pattern} `)) return true;
    if (this.matchGlob(pattern, base)) return true;
    if (base === pattern) return true;
    return false;
  }
  /**
   * Check if a file path is a cursor file and should be protected based on team settings.
   * @param pathComponents The path components relative to root directory
   * @returns BlockReason if blocked, null if not blocked
   */
  async checkCursorFileProtection(pathComponents) {
    const dotCursorProtection = await this.teamSettingsService.getDotCursorProtection();
    const isCursorFile = pathComponents.some(component => component.toLowerCase() === ".cursor" || component.toLowerCase() === ".vscode");
    if (isCursorFile && dotCursorProtection) {
      return {
        type: "permissionsConfig"
      };
    }
    return null;
  }
  /**
   * Extract the base command from a command string (the first word)
   */
  extractBaseCommand(command) {
    const trimmed = command.trim();
    const spaceIndex = trimmed.indexOf(" ");
    return spaceIndex === -1 ? trimmed : trimmed.substring(0, spaceIndex);
  }
  /**
   * Generate allowlist patterns for commands
   * Matches the processCandidatesForAllowlist logic from VSCode
   */
  generateAllowlistPatterns(commands) {
    // Composite shell commands that should include their first argument
    const compositeShellCommands = ["git", "npm", "yarn", "pnpm", "docker", "pip", "systemctl", "uv", "cargo", "bun", "bash", "npx"];
    const result = [];
    for (const cmd of commands) {
      // For composite commands, show both the command and the first argument
      // For all other commands, show only the command
      if (compositeShellCommands.includes(cmd.name) && cmd.args.length > 0 && cmd.args[0].type === "word") {
        result.push(`${cmd.name} ${cmd.args[0].value}`);
      } else {
        result.push(cmd.name);
      }
    }
    // Deduplicate the result array
    const deduplicatedResult = [...new Set(result)];
    return deduplicatedResult;
  }
  matchesPathEntry(kind, entry, absPath) {
    const re = new RegExp(`^\\s*${kind}\\s*\\((.*)\\)\\s*$`);
    const m = entry.match(re);
    if (!m) return false;
    const rawPattern = (m[1] ?? "").trim();
    const expandedPattern = this.expandTilde(rawPattern);
    return this.matchGlob(expandedPattern, absPath);
  }
  async isPathExplicitlyDenied(kind, absPath) {
    const perms = await this.getPermissions();
    return perms.deny.some(e => this.isPathEntry(kind, e) && this.matchesPathEntry(kind, e, absPath));
  }
  async isPathExplicitlyAllowed(kind, absPath) {
    const perms = await this.getPermissions();
    return perms.allow.some(e => this.isPathEntry(kind, e) && this.matchesPathEntry(kind, e, absPath));
  }
  expandTilde(p) {
    if (p === "~") return (0, external_node_os_.homedir)();
    if (p.startsWith("~/")) return (0, external_node_os_.homedir)() + p.slice(1);
    return p;
  }
  escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  matchGlob(pattern, value) {
    const escaped = this.escapeRegExp(pattern.trim());
    const reSrc = `^${escaped.replace(/\\\*/g, ".*")}$`;
    try {
      const re = new RegExp(reSrc);
      return re.test(value);
    } catch {
      // Fallback to strict equality on invalid patterns
      return pattern.trim() === value;
    }
  }
  async addToAllowList(_ctx, kind, value) {
    const entry = `${kind}(${value})`;
    await this.permissionsProvider.updatePermissions(perms => {
      const allow = perms.allow.includes(entry) ? perms.allow : [...perms.allow, entry];
      return {
        ...perms,
        allow
      };
    });
  }
  async addToDenyList(_ctx, kind, value) {
    const entry = `${kind}(${value})`;
    await this.permissionsProvider.updatePermissions(perms => {
      const deny = perms.deny.includes(entry) ? perms.deny : [...perms.deny, entry];
      return {
        ...perms,
        deny
      };
    });
  }
  /**
   * Check if MCP tool execution should be blocked.
   * Always asks for permission unless in auto-run mode (and auto-run is team-allowed).
   * @returns false if allowed, BlockReason if blocked
   */
  async shouldBlockMcp(ctx, args) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = permissions_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("InteractivePermissionsService.shouldBlockMcp")), false);
      // Parse tool name to extract provider identifier
      const {
        name,
        toolName,
        providerIdentifier,
        args: argsMap
      } = args;
      const perms = await this.getPermissions();
      // Check explicit deny list first
      if (await this.isMcpExplicitlyDenied(ctx, providerIdentifier, toolName)) {
        return {
          type: "permissionsConfig"
        };
      }
      // Check if explicitly allowed
      if (await this.isMcpExplicitlyAllowed(ctx, providerIdentifier, toolName)) {
        return false;
      }
      // Check readonly mode - only block if not explicitly allowed
      // Readonly mode still respects allowlists, so if explicitly allowed, allow it
      if (perms.userConfiguredPolicy.type === "workspace_readonly" && perms.approvalMode !== "unrestricted") {
        return {
          type: "permissionsConfig",
          isReadonly: true
        };
      }
      const isAutoRun = perms.approvalMode === "unrestricted";
      if (isAutoRun) {
        if (await this.teamSettingsService.getShouldBlockMcp()) {
          // If admin has disabled MCP in auto-run, fall through to approval
        } else {
          return false;
        }
      }
      return {
        type: "needsApproval",
        approvalReason: `MCP tool: ${toolName}`,
        approvalDetails: {
          type: "mcp",
          name,
          toolName,
          providerIdentifier,
          args: argsMap
        }
      };
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      permissions_service_disposeResources(env_2);
    }
  }
  /**
   * Matches a command against an autorun pattern using the same logic as VSCode.
   * The pattern matches if it appears at the beginning of the command followed by space or end of string.
   * This is intentionally simpler than matchesShellEntry to provide predictable behavior for team admins.
   */
  matchesAutoRunCommand(command, patternToMatch) {
    // Sanitize the command pattern by escaping regex special characters
    const escapedPattern = patternToMatch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Create a regex that matches the pattern only at the beginning of the string (^)
    // and only if followed by whitespace (\s) or end of string ($)
    return new RegExp(`^${escapedPattern}(\\s|$)`).test(command.trim());
  }
  /**
   * Check if an MCP entry matches a pattern.
   * Pattern format: [server]:[tool]
   * Supports wildcards: *:[tool], [server]:*, *:*
   */
  matchesMcpEntry(entry, providerIdentifier, toolName) {
    const m = entry.match(/^\s*Mcp\s*\((.*)\)\s*$/);
    if (!m) return false;
    const pattern = m[1]?.trim() ?? "";
    const colonIdx = pattern.indexOf(":");
    if (colonIdx === -1) {
      // No colon, invalid pattern
      return false;
    }
    const serverPattern = pattern.slice(0, colonIdx).trim();
    const toolPattern = pattern.slice(colonIdx + 1).trim();
    // Check server match
    const serverMatches = serverPattern === "*" || this.matchGlob(serverPattern, providerIdentifier);
    // Check tool match
    const toolMatches = toolPattern === "*" || this.matchGlob(toolPattern, toolName);
    return serverMatches && toolMatches;
  }
  async isMcpExplicitlyDenied(ctx, providerIdentifier, toolName) {
    const perms = await this.getPermissions();
    return perms.deny.some(e => this.matchesMcpEntry(e, providerIdentifier, toolName));
  }
  async isMcpExplicitlyAllowed(ctx, providerIdentifier, toolName) {
    const perms = await this.getPermissions();
    return perms.allow.some(e => this.matchesMcpEntry(e, providerIdentifier, toolName));
  }
}
//# sourceMappingURL=permissions-service.js.map