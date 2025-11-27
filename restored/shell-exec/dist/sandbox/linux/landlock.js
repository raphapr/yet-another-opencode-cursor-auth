/**
 * Module-level logger for sandbox operations
 */
const logger = (0, context_dist /* createLogger */.h)("shell-exec:linux-sandbox");
// Module-scoped configured path for the linux sandbox helper binary.
// This must be set by the host process at startup.
let configuredLinuxSandboxBinaryPath;
function setLinuxSandboxBinaryPath(path) {
  if (configuredLinuxSandboxBinaryPath) {
    // First-set-wins to avoid late/accidental overrides
    return;
  }
  configuredLinuxSandboxBinaryPath = path;
}
function getLinuxSandboxBinary() {
  return configuredLinuxSandboxBinaryPath;
}
let binaryAvailable = null;
let binaryCheckError = null;
/**
 * Check if the Linux sandbox binary is available
 */
function checkBinaryAvailable(ctx) {
  if (binaryAvailable !== null) {
    return !!binaryAvailable;
  }
  try {
    const bin = getLinuxSandboxBinary();
    logger.error(ctx, `[checkBinaryAvailable] Resolved binary path: ${bin}`);
    if (!bin) {
      binaryCheckError = new Error("Linux sandbox binary path was not configured");
      binaryAvailable = false;
      logger.error(ctx, "[checkBinaryAvailable] Binary path not set, returning false");
      return false;
    }
    binaryAvailable = external_node_fs_.existsSync(bin);
    if (!binaryAvailable) {
      binaryCheckError = new Error(`Sandbox binary not found at ${bin}`);
      logger.error(ctx, `[checkBinaryAvailable] Binary not found at: ${bin}`);
    }
    logger.error(ctx, `[checkBinaryAvailable] Binary found at: ${bin}`);
    return !!binaryAvailable;
  } catch (e) {
    binaryCheckError = e;
    binaryAvailable = false;
    logger.error(ctx, `[checkBinaryAvailable] Exception checking binary: ${e}`);
    return false;
  }
}
/**
 * Check if Linux sandboxing is supported on this system
 */
function isLinuxSandboxSupported(ctx) {
  const effectiveCtx = ctx ?? (0, context_dist /* createContext */.q6)();
  logger.error(effectiveCtx, "[isLinuxSandboxSupported] Starting sandbox support check...");
  if (!checkBinaryAvailable(effectiveCtx)) {
    logger.error(effectiveCtx, "[isLinuxSandboxSupported] Binary not available, returning false");
    return false;
  }
  // Preflight: ask helper to apply sandbox policy without exec to detect issues like mount limit
  try {
    const cwd = process.cwd();
    const policy = {
      type: "workspace_readwrite",
      cwd,
      additional_readwrite_paths: [],
      additional_readonly_paths: [],
      network_access: false,
      disable_tmp_write: false,
      block_git_writes: false,
      ignore_mapping: undefined
    };
    const policyJson = JSON.stringify(policy);
    const binaryPath = String(getLinuxSandboxBinary());
    logger.error(effectiveCtx, `[isLinuxSandboxSupported] Running preflight with binary: ${binaryPath}`);
    logger.error(effectiveCtx, `[isLinuxSandboxSupported] CWD: ${cwd}`);
    // Use execFileSync to run preflight; exit code 2 means unsupported
    (0, external_node_child_process_.execFileSync)(binaryPath, ["--sandbox-policy-cwd", cwd, "--sandbox-policy", policyJson, "--preflight-only", "--", "/bin/true"], {
      stdio: "ignore"
    });
    logger.error(effectiveCtx, "[isLinuxSandboxSupported] Preflight succeeded, sandbox supported!");
    return true;
  } catch (e) {
    const error = e;
    logger.error(effectiveCtx, `[isLinuxSandboxSupported] Preflight failed: ${error.message}`);
    logger.error(effectiveCtx, `[isLinuxSandboxSupported] Exit status: ${error?.status}`);
    // If helper returned code 2, treat as unsupported
    if (typeof error?.status === "number" && error.status === 2) {
      return false;
    }
    // Otherwise, assume unsupported
    return false;
  }
}
/**
 * Policy-aware preflight check for Linux sandbox support.
 * Returns false if the helper reports unsupported (e.g., mount limit exceeded for this policy).
 */
function isLinuxSandboxSupportedForPolicy(sandboxPolicy, opts) {
  const ctx = createContext();
  if (!checkBinaryAvailable(ctx)) {
    return false;
  }
  if (sandboxPolicy.type !== "workspace_readwrite" && sandboxPolicy.type !== "workspace_readonly") {
    // Only workspace_readwrite and workspace_readonly are supported on Linux
    return false;
  }
  try {
    const cwd = String(opts?.cwd ?? process.cwd());
    // Convert ignore_mapping to JSON string
    let ignoreMappingJson;
    if (sandboxPolicy.ignore_mapping) {
      const additionalReadwrite = sandboxPolicy.type === "workspace_readwrite" ? sandboxPolicy.additional_readwrite_paths || [] : [];
      const additionalReadonly = sandboxPolicy.additional_readonly_paths || [];
      ignoreMappingJson = convertIgnoreMappingToJson(sandboxPolicy.ignore_mapping, cwd, additionalReadwrite, additionalReadonly);
    }
    // Build policy object matching Rust SandboxPolicy type
    const policy = sandboxPolicy.type === "workspace_readonly" ? {
      type: "workspace_readonly",
      cwd,
      additional_readonly_paths: sandboxPolicy.additional_readonly_paths || [],
      network_access: sandboxPolicy.network_access || false,
      ignore_mapping: ignoreMappingJson
    } : {
      type: "workspace_readwrite",
      cwd,
      additional_readwrite_paths: sandboxPolicy.additional_readwrite_paths || [],
      additional_readonly_paths: sandboxPolicy.additional_readonly_paths || [],
      network_access: sandboxPolicy.network_access || false,
      disable_tmp_write: sandboxPolicy.disable_tmp_write || false,
      block_git_writes: sandboxPolicy.block_git_writes || false,
      ignore_mapping: ignoreMappingJson
    };
    const policyJson = JSON.stringify(policy);
    // Run helper in preflight-only mode; exit code 2 means unsupported
    execFileSync(String(getLinuxSandboxBinary()), ["--sandbox-policy-cwd", cwd, "--sandbox-policy", policyJson, "--preflight-only", "--", "/bin/true"], {
      stdio: "ignore"
    });
    return true;
  } catch (e) {
    if (typeof e?.status === "number" && e.status === 2) {
      return false;
    }
    return false;
  }
}
/**
 * Get detailed capabilities for debugging
 */
function getLinuxCapabilities() {
  const ctx = createContext();
  if (!checkBinaryAvailable(ctx)) {
    return null;
  }
  try {
    // Check Landlock support
    const landlockSupported = fs.existsSync("/sys/kernel/security/landlock");
    // Check seccomp support
    const seccompSupported = fs.existsSync("/proc/sys/kernel/seccomp");
    // Check user namespace support
    let usernsSupported = true;
    if (fs.existsSync("/proc/sys/kernel/unprivileged_userns_clone")) {
      const content = fs.readFileSync("/proc/sys/kernel/unprivileged_userns_clone", "utf8");
      usernsSupported = content.trim() === "1";
    }
    return {
      landlock: landlockSupported,
      seccomp: seccompSupported,
      userns: usernsSupported,
      mountns: usernsSupported // Mount namespaces available with user namespaces
    };
  } catch {
    return null;
  }
}
/**
 * Spawn a process with Linux sandboxing using Landlock, seccomp, and mount namespaces
 */
function spawnWithLandlock(command, args = [], options = {}, sandboxPolicy) {
  const ctx = (0, context_dist /* createContext */.q6)();
  options.env = filterElectronEnv(options.env);
  if (!checkBinaryAvailable(ctx)) {
    throw new Error(`Linux sandbox binary not available: ${binaryCheckError?.message || `binary not configured`}. ` + `Please build the binary or use 'insecure_none' policy.`);
  }
  if (sandboxPolicy.type === "insecure_none") {
    return (0, external_node_child_process_.spawn)(command, args, options); // nosemgrep: detect-child-process
  }
  if (sandboxPolicy.type === "workspace_readwrite" || sandboxPolicy.type === "workspace_readonly") {
    return spawnWithLandlockPolicy(command, args, options, sandboxPolicy);
  }
  throw new Error(`Unsupported sandbox policy: ${String(sandboxPolicy)}`);
}
function spawnWithLandlockPolicy(command, args, options, sandboxPolicy) {
  if (sandboxPolicy.type !== "workspace_readwrite" && sandboxPolicy.type !== "workspace_readonly") {
    throw new Error("Expected workspace_readwrite or workspace_readonly policy");
  }
  const cwd = String(options.cwd ?? process.cwd());
  // Handle shell option
  let actualCommand = command;
  let actualArgs = args;
  if (options.shell) {
    const shellPath = typeof options.shell === "string" ? options.shell : "/bin/sh";
    actualCommand = shellPath;
    actualArgs = ["-c", `${command} ${args.join(" ")}`];
  }
  // Convert ignore_mapping to JSON string
  let ignoreMappingJson;
  if (sandboxPolicy.ignore_mapping) {
    const additionalReadwrite = sandboxPolicy.type === "workspace_readwrite" ? sandboxPolicy.additional_readwrite_paths || [] : [];
    const additionalReadonly = sandboxPolicy.additional_readonly_paths || [];
    ignoreMappingJson = convertIgnoreMappingToJson(sandboxPolicy.ignore_mapping, cwd, additionalReadwrite, additionalReadonly);
  }
  // Build policy object matching Rust SandboxPolicy type
  if (sandboxPolicy.type === "workspace_readonly") {
    const policy = {
      type: "workspace_readonly",
      cwd,
      additional_readonly_paths: sandboxPolicy.additional_readonly_paths || [],
      network_access: sandboxPolicy.network_access || false,
      ignore_mapping: ignoreMappingJson
    };
    // Serialize policy to JSON
    const policyJson = JSON.stringify(policy);
    // Build the command line for the sandbox helper:
    // cursor-linux-sandbox --sandbox-policy-cwd <cwd> --sandbox-policy <json> -- <command> [args...]
    const sandboxArgs = ["--sandbox-policy-cwd", cwd, "--sandbox-policy", policyJson, "--", actualCommand, ...actualArgs];
    // Merge environment
    const mergedEnv = {
      ...process.env,
      ...options.env,
      CURSOR_SANDBOX: "landlock"
    };
    // Spawn the sandbox helper binary
    const spawnOptions = {
      cwd: options.cwd || cwd,
      env: mergedEnv,
      stdio: options.stdio || ["pipe", "pipe", "pipe"]
    };
    try {
      // Use execFile to spawn the sandbox binary (safer than spawn with shell)
      const child = (0, external_node_child_process_.spawn)(String(getLinuxSandboxBinary()), sandboxArgs, spawnOptions);
      return child;
    } catch (e) {
      throw new Error(`Failed to spawn sandboxed process: ${e}`);
    }
  }
  // workspace_readwrite policy (existing code)
  const policy = {
    type: "workspace_readwrite",
    cwd,
    additional_readwrite_paths: sandboxPolicy.additional_readwrite_paths || [],
    additional_readonly_paths: sandboxPolicy.additional_readonly_paths || [],
    network_access: sandboxPolicy.network_access || false,
    disable_tmp_write: sandboxPolicy.disable_tmp_write || false,
    block_git_writes: sandboxPolicy.block_git_writes || false,
    ignore_mapping: ignoreMappingJson
  };
  // Serialize policy to JSON
  const policyJson = JSON.stringify(policy);
  // Build the command line for the sandbox helper:
  // cursor-linux-sandbox --sandbox-policy-cwd <cwd> --sandbox-policy <json> -- <command> [args...]
  const sandboxArgs = ["--sandbox-policy-cwd", cwd, "--sandbox-policy", policyJson, "--", actualCommand, ...actualArgs];
  // Merge environment
  const mergedEnv = {
    ...process.env,
    ...options.env,
    CURSOR_SANDBOX: "landlock"
  };
  // Spawn the sandbox helper binary
  const spawnOptions = {
    cwd: options.cwd || cwd,
    env: mergedEnv,
    stdio: options.stdio || ["pipe", "pipe", "pipe"]
  };
  try {
    // Use execFile to spawn the sandbox binary (safer than spawn with shell)
    const child = (0, external_node_child_process_.spawn)(String(getLinuxSandboxBinary()), sandboxArgs, spawnOptions);
    return child;
  } catch (e) {
    throw new Error(`Failed to spawn sandboxed process: ${e}`);
  }
}
/**
 * Convert IgnoreMapping to JSON format expected by native addon
 */
function convertIgnoreMappingToJson(ignoreMapping, cwd, additionalReadwrite, additionalReadonly) {
  const result = {};
  // Collect all workspace paths
  const _workspacePaths = [cwd, ...additionalReadwrite, ...additionalReadonly];
  for (const [path, ignore] of Object.entries(ignoreMapping)) {
    // Skip NoIgnore entries
    if ("__noIgnore" in ignore) {
      continue;
    }
    // Convert file:// URIs to file system paths
    const fsPath = path.startsWith("file://") ? uriToFsPath(path) : path;
    // Extract patterns from ignore instance
    const patterns = extractPatternsFromIgnore(ignore);
    result[fsPath] = patterns;
    // Also add canonical path if different
    const canonicalPath = tryRealpath(fsPath);
    if (canonicalPath !== fsPath) {
      result[canonicalPath] = patterns;
    }
  }
  return JSON.stringify(result);
}
function uriToFsPath(uri) {
  let path = uri.replace(/^file:\/\//, "");
  path = decodeURIComponent(path);
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}
function tryRealpath(p) {
  try {
    return (0, external_node_fs_.realpathSync)(p);
  } catch {
    return p;
  }
}
/**
 * Extract pattern strings from an Ignore instance
 * This accesses the internal structure of the ignore library
 */
function extractPatternsFromIgnore(ignoreInstance) {
  const patterns = [];
  let rulesArray;
  const rulesProperty = ignoreInstance._rules;
  if (Array.isArray(rulesProperty)) {
    rulesArray = rulesProperty;
  } else if (rulesProperty && Array.isArray(rulesProperty._rules)) {
    rulesArray = rulesProperty._rules;
  }
  if (!rulesArray || rulesArray.length === 0) {
    return patterns;
  }
  for (const rule of rulesArray) {
    // Keep negation prefix in the pattern
    // The ignore library stores the pattern WITH the '!' prefix for negative rules,
    // so we need to use it as-is or strip the '!' if we want just the pattern
    if (rule.negative) {
      // For negative rules, the pattern already includes '!', so we use it as-is
      // If the pattern starts with '!', use it directly, otherwise add '!'
      const pattern = rule.pattern.startsWith("!") ? rule.pattern : `!${rule.pattern}`;
      patterns.push(pattern);
    } else {
      patterns.push(rule.pattern);
    }
  }
  return patterns;
}
/**
 * Get the binary check error for debugging
 */
function getBinaryCheckError() {
  return binaryCheckError;
}
//# sourceMappingURL=landlock.js.map