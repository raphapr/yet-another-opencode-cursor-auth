/**
 * WeakMap to store sandbox metadata for child processes without affecting the type.
 */
const sandboxMetadataMap = new WeakMap();
// macOS seatbelt executable path - only use /usr/bin to prevent PATH injection
const MACOS_SEATBELT_EXECUTABLE = "/usr/bin/sandbox-exec";
/**
 * Captures sandbox denial logs for a sandboxed process.
 * Returns structured deny events.
 */
async function captureSandboxDenies(child) {
  const metadata = sandboxMetadataMap.get(child);
  if (!metadata) {
    console.log("No sandbox metadata found on child process");
    return [];
  }
  return captureSandboxDeniesInternal(metadata.pid, metadata.startTime, metadata.unrelatedPids);
}
function spawnWithSeatbelt(command, args = [], options = {}, sandboxPolicy) {
  options.env = filterElectronEnv(options.env);
  if (sandboxPolicy.type === "insecure_none") {
    return spawnUnsafe(command, args, options);
  }
  if (sandboxPolicy.type === "workspace_readwrite") {
    return spawnWithSeatbeltPolicy(command, args, options, sandboxPolicy);
  }
  throw new Error(`Unsupported sandbox policy: ${String(sandboxPolicy?.type)}`);
}
function spawnUnsafe(command, args, options) {
  return (0, external_node_child_process_.spawn)(command, args, options); // nosemgrep: detect-child-process
}
function spawnWithSeatbeltPolicy(command, args, options, sandboxPolicy) {
  if (sandboxPolicy.type !== "workspace_readwrite") {
    throw new Error("Expected workspace_readwrite policy");
  }
  const cwd = String(options.cwd ?? process.cwd());
  // Handle shell option - adjust command and args if shell is enabled
  let actualCommand = command;
  let actualArgs = args;
  if (options.shell) {
    const shellPath = typeof options.shell === "string" ? options.shell : "/bin/sh";
    actualCommand = shellPath;
    actualArgs = ["-c", `${command} ${args.join(" ")}`];
  }
  const seatbeltArgs = createSeatbeltCommandArgs(actualCommand, actualArgs, sandboxPolicy, cwd);
  // Generate debug file if debugOutputDir is specified
  if (sandboxPolicy.debugOutputDir) {
    generateDebugFile(command, args, seatbeltArgs, sandboxPolicy.debugOutputDir);
  }
  // Add sandbox environment variable
  const env = {
    ...process.env,
    ...options.env,
    CURSOR_SANDBOX: "seatbelt"
  };
  // Always capture start time for potential sandbox deny capture
  const startTime = new Date();
  // Capture PIDs before execution if debug output is enabled
  let unrelatedPids;
  if (sandboxPolicy.debugOutputDir) {
    unrelatedPids = captureAllPids();
  }
  const child = (0, external_node_child_process_.spawn)(MACOS_SEATBELT_EXECUTABLE, seatbeltArgs, {
    ...options,
    env,
    shell: false // We handle shell manually above
  });
  // Store sandbox metadata in WeakMap for later deny capture
  if (child.pid) {
    sandboxMetadataMap.set(child, {
      startTime,
      pid: child.pid,
      unrelatedPids
    });
    // Add exit hook to capture PIDs after command execution if debug output is enabled
    if (sandboxPolicy.debugOutputDir) {
      child.on("exit", () => {
        const postExecutionPids = captureAllPids();
        const metadata = sandboxMetadataMap.get(child);
        if (metadata?.unrelatedPids) {
          // Combine pre and post execution PIDs into the same set
          for (const pid of postExecutionPids) {
            metadata.unrelatedPids.add(pid);
          }
        }
      });
    }
  }
  return child;
}
function createSeatbeltCommandArgs(command, args, sandboxPolicy, cwd) {
  if (sandboxPolicy.type !== "workspace_readwrite") {
    throw new Error("Expected workspace_readwrite policy");
  }
  // Build policy and CLI args with a synchronized builder
  const builder = new SeatbeltPolicyBuilder();
  // CWD is writable root 0
  builder.addWritableCwd(cwd, {
    read: true,
    mapExec: true,
    write: true
  });
  // Additional readwrite paths
  for (const p of sandboxPolicy.additional_readwrite_paths ?? []) {
    builder.addWritablePath(p, {
      read: true,
      mapExec: true,
      write: true
    });
  }
  // Default writable paths (e.g., /tmp and /private/tmp)
  // Skip these if disable_tmp_write is true
  if (!sandboxPolicy.disable_tmp_write) {
    for (const p of MACOS_TMP_READWRITE_PATHS) {
      builder.addWritablePath(p, {
        read: true,
        mapExec: true,
        write: true
      });
    }
  }
  // Readonly paths
  for (const p of sandboxPolicy.additional_readonly_paths ?? []) {
    builder.addReadonlyPath(p, {
      read: true,
      mapExec: true
    });
  }
  // Handle ignore mapping for blocked paths
  if (sandboxPolicy.ignore_mapping) {
    builder.addIgnoreMapping(sandboxPolicy.ignore_mapping, sandboxPolicy.debugOutputDir !== undefined);
  }
  // Block git writes if requested
  if (sandboxPolicy.block_git_writes) {
    builder.addGitWriteBlocking();
  }
  // Generate file read policy (includes deny rules if present)
  const fileReadPolicy = builder.renderFileReadPolicy();
  const fileWritePolicy = builder.renderWritePolicy();
  const networkPolicy = sandboxPolicy.network_access ? "(allow network-outbound)\n(allow network-inbound)\n(allow system-socket)" : "";
  // Build the full policy
  // Seatbelt evaluates rules in declaration order and the LAST matching
  // rule wins for identical operations. We rely on that behavior intentionally:
  // 1. Base allows (file-read*, file-write* for writable paths)
  // 2. Deny rules (block specific paths)
  // 3. Allow rules (negations that should override earlier denies)
  // 4. Suffix rules (always-deny paths like .vscode)
  //
  // NOTE: Specific operation denies (e.g., file-read-data) are not overridden by
  // later wildcard allows (e.g., file-read*). Wildcards only affect operations
  // not explicitly mentioned.
  //
  // The suffix rules (.vscode, etc.) must come last to ensure they continue to block
  // even if an earlier rule would otherwise allow them. User ignore rules (possible
  // negations) come right before the suffix rules so they can intentionally override
  // the deny list except for the hard-coded suffix set.
  const denyRulesContent = builder.renderDenyRules();
  const allowRulesFromIgnore = builder.renderAllowRules();
  const fullPolicy = `${MACOS_SEATBELT_BASE_POLICY}
${fileReadPolicy}
${fileWritePolicy}
${networkPolicy}
${denyRulesContent}${allowRulesFromIgnore}
${MACOS_SEATBELT_POLICY_SUFFIX}`;
  const seatbeltArgs = [];
  seatbeltArgs.push("-p", fullPolicy);
  seatbeltArgs.push(...builder.getCliArgs());
  seatbeltArgs.push("--", command, ...args);
  return seatbeltArgs;
}
class SeatbeltPolicyBuilder {
  readSubpaths = [];
  mapExecSubpaths = [];
  writeSubpaths = [];
  cliArgs = [];
  writableIndexByCanonical = new Map();
  readonlyIndexByCanonical = new Map();
  writableOriginalPaths = new Map();
  readonlyOriginalPaths = new Map();
  nextWritableIndex = 1;
  nextReadonlyIndex = 0;
  denyRules = [];
  allowRules = [];
  addWritableCwd(cwd, sections) {
    const canonicalCwd = seatbelt_tryRealpath(cwd);
    this.cliArgs.push(`-DWRITABLE_ROOT_0=${canonicalCwd}`);
    if (cwd !== canonicalCwd) {
      this.cliArgs.push(`-DWRITABLE_ROOT_0_ORIG=${cwd}`);
      this.writableOriginalPaths.set(canonicalCwd, cwd);
    }
    if (sections.read) this.readSubpaths.push(`  (subpath (param "WRITABLE_ROOT_0"))`);
    if (sections.mapExec) this.mapExecSubpaths.push(`  (subpath (param "WRITABLE_ROOT_0"))`);
    if (sections.write) this.writeSubpaths.push(`(require-all (subpath (param "WRITABLE_ROOT_0")) (require-not (literal (param "WRITABLE_ROOT_0"))))`);
    // Explicitly deny writes to the workspace root directory entry itself
    this.addDenyRule(`(deny file-write* (literal (param "WRITABLE_ROOT_0")))`);
    if (cwd !== canonicalCwd) {
      if (sections.read) this.readSubpaths.push(`  (subpath (param "WRITABLE_ROOT_0_ORIG"))`);
      if (sections.mapExec) this.mapExecSubpaths.push(`  (subpath (param "WRITABLE_ROOT_0_ORIG"))`);
      if (sections.write) this.writeSubpaths.push(`(require-all (subpath (param "WRITABLE_ROOT_0_ORIG")) (require-not (literal (param "WRITABLE_ROOT_0_ORIG"))))`);
      // Also deny writes to the non-canonical workspace root if present
      this.addDenyRule(`(deny file-write* (literal (param "WRITABLE_ROOT_0_ORIG")))`);
    }
    this.writableIndexByCanonical.set(canonicalCwd, 0);
  }
  addWritablePath(originalPath, sections) {
    const canonicalPath = seatbelt_tryRealpath(originalPath);
    let index = this.writableIndexByCanonical.get(canonicalPath);
    if (index === undefined) {
      index = this.nextWritableIndex++;
      this.writableIndexByCanonical.set(canonicalPath, index);
      this.cliArgs.push(`-DWRITABLE_ROOT_${index}=${canonicalPath}`);
    }
    if (originalPath !== canonicalPath) {
      this.cliArgs.push(`-DWRITABLE_ROOT_${index}_ORIG=${originalPath}`);
      this.writableOriginalPaths.set(canonicalPath, originalPath);
    }
    if (sections.read) this.readSubpaths.push(`  (subpath (param "WRITABLE_ROOT_${index}"))`);
    if (sections.mapExec) this.mapExecSubpaths.push(`  (subpath (param "WRITABLE_ROOT_${index}"))`);
    if (sections.write) this.writeSubpaths.push(`(require-all (subpath (param "WRITABLE_ROOT_${index}")) (require-not (literal (param "WRITABLE_ROOT_${index}"))))`);
    // Explicitly deny writes to this writable root's directory entry
    this.addDenyRule(`(deny file-write* (literal (param "WRITABLE_ROOT_${index}")))`);
    if (originalPath !== canonicalPath) {
      if (sections.read) this.readSubpaths.push(`  (subpath (param "WRITABLE_ROOT_${index}_ORIG"))`);
      if (sections.mapExec) this.mapExecSubpaths.push(`  (subpath (param "WRITABLE_ROOT_${index}_ORIG"))`);
      if (sections.write) this.writeSubpaths.push(`(require-all (subpath (param "WRITABLE_ROOT_${index}_ORIG")) (require-not (literal (param "WRITABLE_ROOT_${index}_ORIG"))))`);
      // Also deny writes to the original path if different
      this.addDenyRule(`(deny file-write* (literal (param "WRITABLE_ROOT_${index}_ORIG")))`);
    }
  }
  addReadonlyPath(originalPath, sections) {
    const canonicalPath = seatbelt_tryRealpath(originalPath);
    let index = this.readonlyIndexByCanonical.get(canonicalPath);
    if (index === undefined) {
      index = this.nextReadonlyIndex++;
      this.readonlyIndexByCanonical.set(canonicalPath, index);
      this.cliArgs.push(`-DREADONLY_ROOT_${index}=${canonicalPath}`);
    }
    if (originalPath !== canonicalPath) {
      this.cliArgs.push(`-DREADONLY_ROOT_${index}_ORIG=${originalPath}`);
      this.readonlyOriginalPaths.set(canonicalPath, originalPath);
    }
    if (sections.read) this.readSubpaths.push(`  (subpath (param "READONLY_ROOT_${index}"))`);
    if (sections.mapExec) this.mapExecSubpaths.push(`  (subpath (param "READONLY_ROOT_${index}"))`);
    if (originalPath !== canonicalPath) {
      if (sections.read) this.readSubpaths.push(`  (subpath (param "READONLY_ROOT_${index}_ORIG"))`);
      if (sections.mapExec) this.mapExecSubpaths.push(`  (subpath (param "READONLY_ROOT_${index}_ORIG"))`);
    }
  }
  addIgnoreMapping(ignoreMapping, emitComments) {
    // Collect all allowed workspace paths to scope the allow rules
    const workspacePaths = [];
    // Add writable paths (both canonical and original if different)
    for (const [canonicalPath, _] of this.writableIndexByCanonical) {
      workspacePaths.push(canonicalPath);
      const originalPath = this.writableOriginalPaths.get(canonicalPath);
      if (originalPath && originalPath !== canonicalPath) {
        workspacePaths.push(originalPath);
      }
    }
    // Add readonly paths (both canonical and original if different)
    for (const [canonicalPath, _] of this.readonlyIndexByCanonical) {
      workspacePaths.push(canonicalPath);
      const originalPath = this.readonlyOriginalPaths.get(canonicalPath);
      if (originalPath && originalPath !== canonicalPath) {
        workspacePaths.push(originalPath);
      }
    }
    // Convert ignore mapping to Seatbelt deny/allow rules with workspace scoping
    const {
      allowRules,
      denyRules
    } = convertCursorIgnoreToBlockedPathsList(ignoreMapping, workspacePaths, emitComments);
    // Add deny rules first so they appear before any explicit allow overrides.
    // Seatbelt applies the last matching rule, so any negating allow we add below
    // will intentionally win when needed.
    for (const denyRule of denyRules) {
      this.addDenyRule(denyRule);
    }
    // Add allow rules for negations. Because these appear after the deny block,
    // they override only when explicitly requested by the ignore mapping and stay
    // scoped to the workspace paths discovered above.
    for (const allowRule of allowRules) {
      this.addAllowRule(allowRule);
    }
  }
  addDenyRule(rule) {
    this.denyRules.push(rule);
  }
  addAllowRule(rule) {
    this.allowRules.push(rule);
  }
  addGitWriteBlocking() {
    // Block writes to .git directories (e.g., /path/to/.git/config)
    this.addDenyRule(`(deny file-write* (regex #"/\\.git/"))`);
    // Block writes to .git files (worktree scenario where .git is a file, e.g., /path/to/.git)
    // This regex matches paths ending with /.git
    this.addDenyRule(`(deny file-write* (regex #"/\\.git$"))`);
  }
  renderReadSubpaths() {
    return this.readSubpaths.join("\n");
  }
  renderMapExecSubpaths() {
    return this.mapExecSubpaths.join("\n");
  }
  renderWritePolicy() {
    if (this.writeSubpaths.length === 0) return "";
    return `(allow file-write*\n${this.writeSubpaths.join("\n")}\n)`;
  }
  renderDenyRules() {
    if (this.denyRules.length === 0) return "";
    return `${this.denyRules.join("\n")}\n`;
  }
  renderAllowRules() {
    if (this.allowRules.length === 0) return "";
    return `${this.allowRules.join("\n")}\n`;
  }
  renderFileReadPolicy() {
    return `; allow read-only file operations and mapping executables
(allow file-read*
${this.renderReadSubpaths()}
)
(allow file-map-executable
${this.renderMapExecSubpaths()}
)`;
  }
  getCliArgs() {
    return this.cliArgs.slice();
  }
}
function seatbelt_tryRealpath(p) {
  try {
    return (0, external_node_fs_.realpathSync)(p);
  } catch {
    return p;
  }
}
/**
 * Captures all current process IDs using ps command.
 * Returns a Set of PIDs as numbers.
 */
function captureAllPids() {
  try {
    const result = (0, external_node_child_process_.spawnSync)("/bin/ps", ["-e", "-o", "pid="], {
      encoding: "utf8"
    });
    if (result.error) {
      console.warn("Failed to capture PIDs:", result.error.message);
      return new Set();
    }
    const pids = new Set();
    const lines = result.stdout.split(/\r?\n/).filter(l => l.trim().length > 0);
    for (const line of lines) {
      const pid = Number(line.trim());
      if (!Number.isNaN(pid) && pid > 0) {
        pids.add(pid);
      }
    }
    return pids;
  } catch (error) {
    console.warn("Failed to capture PIDs:", error);
    return new Set();
  }
}
function generateDebugFile(_command, _args, seatbeltArgs, debugOutputDir) {
  try {
    if (!debugOutputDir) return;
    (0, external_node_fs_.mkdirSync)(debugOutputDir, {
      recursive: true
    });
    const debugFilePath = (0, external_node_path_.join)(debugOutputDir, "seatbelt-debug.sh");
    const scriptContent = `#!/bin/bash\nset -euo pipefail\n/usr/bin/sandbox-exec ${seatbeltArgs.map(a => `'${a.replace(/'/g, `'"'"'`)}'`).join(" ")}\n`;
    (0, external_node_fs_.writeFileSync)(debugFilePath, scriptContent, {
      encoding: "utf8"
    });
  } catch (_e) {
    // ignore errors creating debug script
  }
}
/**
 * Determines the relationship of a process to the sandboxed process based on PID.
 */
function determineRelationship(eventPid, rootPid, unrelatedPids) {
  if (eventPid === rootPid) {
    return "related";
  }
  if (unrelatedPids?.has(eventPid)) {
    return "probably_unrelated";
  }
  return "maybe_related";
}
function captureSandboxDeniesInternal(pid, startTime, unrelatedPids) {
  return new Promise(resolve => {
    try {
      // Calculate how long ago the process started (in seconds)
      const now = new Date();
      const secondsAgo = Math.ceil((now.getTime() - startTime.getTime()) / 1000);
      // Use execFile instead of exec - split command and arguments
      // Remove PID filter to capture all sandbox events
      const logArgs = ["show", "--style", "ndjson", "--predicate", `process=="kernel" AND eventMessage CONTAINS "Sandbox:" AND eventMessage contains "deny"`, "--last", secondsAgo.toString()];
      (0, external_node_child_process_.execFile)("/usr/bin/log", logArgs, (error, stdout, _stderr) => {
        // nosemgrep: detect-child-process
        if (error) {
          resolve([{
            raw: error.message
          }]);
          return;
        }
        const lines = stdout.split(/\r?\n/).filter(l => l.trim().length > 0);
        const out = [];
        for (const line of lines) {
          try {
            const obj = JSON.parse(line);
            const msg = obj?.eventMessage ?? "";
            if (!msg || typeof msg !== "string") continue;
            // Example deny: "Sandbox: zsh(79712) deny(1) mach-lookup com.apple.logd"
            const deny = /^Sandbox:\s+([^(]+)\((\d+)\)\s+([a-zA-Z-]+)\((\d+)\)\s+([^\s]+)\s+(.+)$/.exec(msg);
            if (deny) {
              const [, processName, pidStr, decision, decisionCodeStr, operation, targetRest] = deny;
              const eventPid = Number(pidStr);
              out.push({
                timestamp: obj.timestamp,
                processName: processName.trim(),
                pid: eventPid,
                decision: decision.toLowerCase(),
                decisionCode: Number(decisionCodeStr),
                operation,
                target: targetRest,
                duplicateCount: 1,
                raw: msg,
                relationship: determineRelationship(eventPid, pid, unrelatedPids)
              });
              continue;
            }
            // Example duplicate: "1 duplicate report for Sandbox: zsh(95877) deny(1) file-read-data /usr/..."
            const dup = /^(\d+) duplicate report for Sandbox: (.+)$/.exec(msg);
            if (dup) {
              const count = Number(dup[1]);
              const inner = dup[2];
              const dm = /^([^(]+)\((\d+)\)\s+([a-zA-Z-]+)\((\d+)\)\s+([^\s]+)\s+(.+)$/.exec(inner);
              if (dm) {
                const [, processName, pidStr, decision, decisionCodeStr, operation, targetRest] = dm;
                const eventPid = Number(pidStr);
                out.push({
                  timestamp: obj.timestamp,
                  processName: processName.trim(),
                  pid: eventPid,
                  decision: decision.toLowerCase(),
                  decisionCode: Number(decisionCodeStr),
                  operation,
                  target: targetRest,
                  duplicateCount: count,
                  raw: msg,
                  relationship: determineRelationship(eventPid, pid, unrelatedPids)
                });
              } else {
                out.push({
                  timestamp: obj.timestamp,
                  duplicateCount: count,
                  raw: msg
                });
              }
              continue;
            }
            // Fallback: emit raw
            out.push({
              timestamp: obj.timestamp,
              raw: msg
            });
          } catch {}
        }
        resolve(out);
      });
    } catch (error) {
      resolve([{
        raw: String(error)
      }]);
    }
  });
}
//# sourceMappingURL=seatbelt.js.map