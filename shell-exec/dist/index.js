// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  pe: () => (/* reexport */sandbox_namespaceObject),
  Fn: () => (/* binding */createDefaultTerminalExecutor),
  nq: () => (/* reexport */createIgnoreMapping),
  G6: () => (/* binding */getSuggestedShell),
  K3: () => (/* reexport */isSandboxSupported),
  ep: () => (/* reexport */spawnInSandbox)
});

// UNUSED EXPORTS: BashState, KnownShellExecutor, LazyTerminalExecutor, NaiveTerminalExecutor, PowerShellState, ZshLightState, ZshState, captureSandboxDenies, createNaiveTerminalExecutor, initBashState, initPowerShellState, initZshLightState, initZshState, parseShellStateOutput, shellExec, spawnWithSignal, splitPwdAndState

// NAMESPACE OBJECT: ../shell-exec/dist/sandbox/sandbox.js
var sandbox_namespaceObject = {};
__webpack_require__.r(sandbox_namespaceObject);
__webpack_require__.d(sandbox_namespaceObject, {
  captureSandboxDenies: () => sandbox_captureSandboxDenies,
  isSandboxSupported: () => isSandboxSupported,
  setLinuxSandboxBinaryPath: () => sandbox_setLinuxSandboxBinaryPath,
  spawnInSandbox: () => spawnInSandbox
});

// EXTERNAL MODULE: ../utils/dist/index.js + 10 modules
var dist = __webpack_require__("../utils/dist/index.js");
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__("node:fs/promises");
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__("node:os");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
// EXTERNAL MODULE: ../context/dist/index.js + 4 modules
var context_dist = __webpack_require__("../context/dist/index.js");
// EXTERNAL MODULE: external "node:child_process"
var external_node_child_process_ = __webpack_require__("node:child_process");
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
; // ../shell-exec/dist/env-filter.js
/**
 * Filters out ELECTRON_RUN_AS_NODE from the environment to prevent issues with dependencies like Cypress.
 * This environment variable is set by Electron/VSCode and can break tools that detect if they're
 * running under Node.js vs Electron (e.g., Cypress tests fail when this is set).
 *
 * @param env - The environment object to filter. If undefined, uses process.env
 * @returns A new environment object without ELECTRON_RUN_AS_NODE
 */
function filterElectronEnv(env) {
  const sourceEnv = env || process.env;
  // biome-ignore lint/correctness/noUnusedVariables: We're destructuring to strip this env var
  const {
    ELECTRON_RUN_AS_NODE,
    ...filteredEnv
  } = sourceEnv;
  return filteredEnv;
}
//# sourceMappingURL=env-filter.js.map
; // ../shell-exec/dist/sandbox/linux/landlock.js

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
; // ../shell-exec/dist/sandbox/macos/ignore.js
/**
 * Converts ignore patterns to Apple Seatbelt policy rules.
 *
 * This module extracts regex patterns from the `ignore` library and converts them
 * to Seatbelt policy format for macOS sandboxing.
 *
 * Key features:
 * - Handles negation correctly: !pattern becomes allow rules, pattern becomes deny rules
 * - Converts JavaScript regex syntax to Seatbelt regex syntax
 * - Supports common gitignore patterns like *, **, ?, etc.
 *
 * Example:
 * ```typescript
 * import ignore from 'ignore';
 * const ig = (ignore as any)().add(['*.js', 'node_modules/', '!important.js']);
 * const rules = convertIgnoreToSeatbeltRule('/path/to/repo', ig);
 * // Results in:
 * // (deny file-read-data (regex "^.*\.js$"))
 * // (deny file-read-data (regex "^.*node_modules/.*$"))
 * // (allow file-read-data (regex "^.*important\.js$"))
 * ```
 */
// Serialize a cursorignore mapping to a list of blocked paths
// workspacePaths: allowed workspace directories to scope allow rules for security
function convertCursorIgnoreToBlockedPathsList(cursorIgnoreMapping, workspacePaths = [], emitComments = false) {
  const allAllowRules = [];
  const allDenyRules = [];
  for (const [path, ignore] of Object.entries(cursorIgnoreMapping)) {
    // Skip NoIgnore entries
    if ("__noIgnore" in ignore) {
      continue;
    }
    // Convert file:// URIs to file system paths
    const fsPath = path.startsWith("file://") ? ignore_uriToFsPath(path) : path;
    const {
      allowRules,
      denyRules
    } = convertIgnoreToSeatbeltRule(fsPath, ignore, workspacePaths, emitComments);
    allAllowRules.push(...allowRules);
    allDenyRules.push(...denyRules);
    // For root-relative patterns, also add rules for the canonical path if different
    const canonicalPath = tryGetCanonicalPath(fsPath);
    if (canonicalPath !== fsPath) {
      const {
        allowRules: canonicalAllowRules,
        denyRules: canonicalDenyRules
      } = convertIgnoreToSeatbeltRule(canonicalPath, ignore, workspacePaths, emitComments);
      allAllowRules.push(...canonicalAllowRules);
      allDenyRules.push(...canonicalDenyRules);
    }
  }
  return {
    allowRules: allAllowRules,
    denyRules: allDenyRules
  };
}
function tryGetCanonicalPath(p) {
  try {
    const {
      realpathSync
    } = require("node:fs");
    return realpathSync(p);
  } catch {
    return p;
  }
}
// Convert file:// URI to file system path
function ignore_uriToFsPath(uri) {
  // Remove file:// prefix
  let path = uri.replace(/^file:\/\//, "");
  // Decode URI encoding (e.g., %20 -> space)
  path = decodeURIComponent(path);
  // Remove trailing slash if present (except for root)
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}
// Converts a single ignore rule to a form ready to be added to a seatbelt policy.
// This is the difference between gitignore format and either path or regex format used by seatbelt.
// workspacePaths: allowed workspace directories to scope allow rules for security
function convertIgnoreToSeatbeltRule(dirPath, ignoreInstance, workspacePaths = [], emitComments = false) {
  const rules = extractRegexesFromIgnore(ignoreInstance);
  const allowRules = [];
  const denyRules = [];
  for (const rule of rules) {
    // Convert the regex to Seatbelt format (relative paths -> absolute paths)
    const seatbeltRegex = convertRegexToSeatbeltFormat(rule.ignoreRegexString, dirPath);
    // Skip degenerate transforms that yield no meaningful path pattern
    if (!seatbeltRegex) {
      if (emitComments) {
        const invalidComment = `; invalid ignore: ${rule.originalPattern}`;
        const action = rule.isNegative ? "allow" : "deny";
        if (action === "allow") {
          allowRules.push(invalidComment);
        } else {
          denyRules.push(invalidComment);
        }
      }
      continue;
    }
    // Handle negation: negative rules become allow rules, positive rules become deny rules
    const action = rule.isNegative ? "allow" : "deny";
    const comment = emitComments ? `; ignore: ${rule.originalPattern}` : "";
    if (action === "allow") {
      // SECURITY: Scope allow rules to workspace paths only
      // This prevents negation patterns like "!important.js" from allowing writes outside workspace
      if (workspacePaths.length > 0) {
        // Create workspace path conditions (using OR to match any workspace)
        const workspaceConditions = workspacePaths.map(wsPath => {
          // Escape special regex characters in the path
          const escapedPath = wsPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return `(regex "^${escapedPath}(/.*)?$")`;
        }).join("\n    ");
        // Wrap allow rules with require-all to ensure they only apply within workspace
        const readRule = `${comment ? `${comment}\n` : ""}(allow file-read-data\n  (require-all\n    (regex "${seatbeltRegex}")\n    (require-any\n    ${workspaceConditions}\n    )\n  )\n)`;
        const writeRule = `${comment ? `${comment}\n` : ""}(allow file-write*\n  (require-all\n    (regex "${seatbeltRegex}")\n    (require-any\n    ${workspaceConditions}\n    )\n  )\n)`;
        allowRules.push(readRule);
        allowRules.push(writeRule);
      } else {
        // No workspace paths provided - fallback to unscoped (for backward compatibility in tests)
        const readRule = `${comment ? `${comment}\n` : ""}(allow file-read-data (regex "${seatbeltRegex}"))`;
        const writeRule = `${comment ? `${comment}\n` : ""}(allow file-write* (regex "${seatbeltRegex}"))`;
        allowRules.push(readRule);
        allowRules.push(writeRule);
      }
    } else {
      // Deny rules don't need workspace scoping - denying outside workspace is fine
      const readRule = `${comment ? `${comment}\n` : ""}(deny file-read-data (regex "${seatbeltRegex}"))`;
      const writeRule = `${comment ? `${comment}\n` : ""}(deny file-write* (regex "${seatbeltRegex}"))`;
      denyRules.push(readRule);
      denyRules.push(writeRule);
    }
  }
  return {
    allowRules,
    denyRules
  };
}
// Extract regexes from an Ignore instance by accessing its internal structure
function extractRegexesFromIgnore(ignoreInstance) {
  const results = [];
  let rulesArray;
  // Need to use any here because of differences in the ignore library's internal structure
  // between different versions.
  // biome-ignore lint/suspicious/noExplicitAny: We're accessing the internal rules array
  const rulesProperty = ignoreInstance._rules;
  if (Array.isArray(rulesProperty)) {
    // New structure: _rules is the array directly
    rulesArray = rulesProperty;
  } else if (rulesProperty && Array.isArray(rulesProperty._rules)) {
    // Old structure: _rules is an object with a _rules property that is the array
    rulesArray = rulesProperty._rules;
  }
  if (!rulesArray || rulesArray.length === 0) {
    return results;
  }
  // Get all rules
  // This is somewhat an abuse of the ignore library's API,
  // so be careful when upgrading the ignore library.
  // biome-ignore lint/suspicious/noExplicitAny: We're accessing the internal rules array
  rulesArray.forEach((rule, _index) => {
    const regex = rule.regex;
    results.push({
      originalPattern: rule.pattern,
      patternBody: rule.body,
      isNegative: rule.negative,
      ignoreRegexString: regex.source
    });
  });
  return results;
}
// Convert ignore library regex (for relative paths) to Seatbelt regex (for absolute paths)
function convertRegexToSeatbeltFormat(regexString, baseDir) {
  // Check for invalid empty character class which sandbox-exec rejects
  if (containsEmptyCharacterClass(regexString)) {
    return null;
  }
  // Escape the base directory for regex
  const escapedBaseDir = baseDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Handle directory patterns: (?:^|\/)dirname\/$
  // These should match the directory and everything inside it
  // Note: In gitignore, trailing slash means "only match directories"
  if (regexString.startsWith("(?:^|\\/)") && regexString.endsWith("\\/$")) {
    // Extract the directory name
    const pattern = regexString.substring("(?:^|\\/)".length, regexString.length - "\\/$".length);
    if (pattern.length === 0) return null;
    // Use the suffix-style pattern to match the directory and its contents
    // Pattern: /dirname($ or /anything) to match both the directory itself and its contents
    // The $ allows matching "dirname" as a directory, while /.* matches contents
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Handle directory patterns that start with ^: ^path/to/dir\/$
  // These are nested directory patterns (e.g., blocked/nested/)
  if (regexString.startsWith("^") && regexString.endsWith("\\/$")) {
    // Extract the directory path
    const pattern = regexString.substring(1, regexString.length - "\\/$".length);
    if (pattern.length === 0) return null;
    // Use the suffix-style pattern to match the directory and its contents
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Handle globstar patterns: ^(?:.*\/)?pattern...(?=$|\/$)
  // These are patterns like **/src/**/*.tsx or **/*.key or **/cache/**
  if (regexString.startsWith("^(?:") && regexString.includes("(?=$|\\/$)")) {
    // Remove the anchor and lookahead, keep the core pattern
    let pattern = regexString;
    // Remove ^(?:.*\/)? prefix if present - this allows matching at any depth
    if (pattern.startsWith("^(?:.*\\/)?")) {
      pattern = pattern.substring("^(?:.*\\/)?".length);
    } else if (pattern.startsWith("^")) {
      pattern = pattern.substring(1);
    }
    // Remove (?=$|\/$) suffix
    const suffix = "(?=$|\\/$)";
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // For complex patterns like src(?:\/[^\/]+)*\/[^\/]*\.tsx, simplify to src\/.*\.tsx
    // This converts "src" + "zero or more dirs" + "file.tsx" to just "src/...any path.../file.tsx"
    // The regex (?:\/[^\/]+)* means "zero or more directory segments", which we can replace with \/.*
    pattern = pattern.replace(/\(\?:\\\/\[\^\\\/\]\+\)\*/g, "\\/.*");
    // Use the suffix-style pattern: ^.*/ prefix to match anywhere, with ($|/.*) suffix for files/dirs
    if (pattern.length === 0) return null;
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Handle patterns that start with ^ but contain globstar: ^a(?:\/[^\/]+)*\/pattern
  // These are patterns like a/**/b.txt
  if (regexString.startsWith("^") && regexString.includes("(?:\\/[^\\/]+)*") && regexString.includes("(?=$|\\/$)")) {
    // This is a globstar pattern anchored to the base directory
    let pattern = regexString.substring(1); // Remove ^
    const suffix = "(?=$|\\/$)";
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // Simplify the globstar pattern: (?:\/[^\/]+)*\/
    // This means zero or more "/dirname" followed by "/"
    // We need to convert it to something Seatbelt can handle
    // Using alternation: (\/.*\/|\/) means either "/stuff/" or just "/"
    // This avoids the optional group with nested greedy quantifier which might not backtrack well
    pattern = pattern.replace(/\(\?:\\\/\[\^\\\/\]\+\)\*\\\//g, "(\\/.*\\/|\\/)");
    // Anchor to base directory with simplified globstar
    if (pattern.length === 0) return null;
    const result = `^${escapedBaseDir}/${pattern}$`;
    return result;
  }
  // Handle root-relative patterns: ^pattern(?=$|\/$) (without (?:^|\/) or (?:.*\/)? prefix or globstar)
  // These are patterns like /hello.txt that should only match at the base directory root
  if (regexString.startsWith("^") && !regexString.startsWith("^(?:") && regexString.includes("(?=$|\\/$)")) {
    // Remove the anchor and lookahead
    let pattern = regexString.substring(1); // Remove ^
    const suffix = "(?=$|\\/$)";
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // For root-relative patterns, anchor to the base directory
    if (pattern.length === 0) return null;
    const result = `^${escapedBaseDir}/${pattern}$`;
    return result;
  }
  // For patterns that result in (?:^|/)pattern(?=$|/$)
  // Convert this to match the suffix pattern style: ^.*/pattern...
  // This matches the working .vscode pattern: ^.*/\.vscode($|/.*)
  if (regexString.startsWith("(?:^|\\/)") && regexString.includes("(?=$|\\/$)")) {
    // Remove the prefix and suffix
    let pattern = regexString;
    const prefix = "(?:^|\\/)";
    const suffix = "(?=$|\\/$)";
    if (pattern.startsWith(prefix)) {
      pattern = pattern.substring(prefix.length);
    }
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // Use the suffix-style pattern: ^.*/ prefix to match anywhere, with ($|/.*) suffix for files/dirs
    // This ensures the pattern works the same way as the verified-working .vscode blocking
    if (pattern.length === 0) return null;
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Fallback: just make sure it's anchored and prefix with base directory
  let seatbeltRegex = regexString;
  if (!seatbeltRegex.startsWith("^")) {
    seatbeltRegex = `^${escapedBaseDir}/${seatbeltRegex}`;
  } else {
    seatbeltRegex = `^${escapedBaseDir}/${seatbeltRegex.substring(1)}`;
  }
  if (!seatbeltRegex.endsWith("$")) {
    seatbeltRegex = `${seatbeltRegex}$`;
  }
  // Check final pattern for empty character class before returning
  if (containsEmptyCharacterClass(seatbeltRegex)) {
    return null;
  }
  // Fallback result
  return seatbeltRegex;
}
// Detect empty character class [] which is invalid for sandbox-exec regex engine
function containsEmptyCharacterClass(pattern) {
  // Scan for occurrences of [] and ensure '[' is not escaped by an odd number of backslashes
  // Examples that should match: [] , \\[] , \\\\[]
  // Examples that should NOT match: \[] , \\\[]
  for (let i = 0; i < pattern.length - 1; i++) {
    if (pattern.charCodeAt(i) === 91 /* '[' */ && pattern.charCodeAt(i + 1) === 93 /* ']' */) {
      let backslashCount = 0;
      for (let j = i - 1; j >= 0 && pattern.charCodeAt(j) === 92 /* '\\' */; j--) {
        backslashCount++;
      }
      if (backslashCount % 2 === 0) {
        return true;
      }
    }
  }
  return false;
}
//# sourceMappingURL=ignore.js.map
; // ../shell-exec/dist/sandbox/macos/policy.js
/**
 * macOS seatbelt base policy for workspace read/write operations.
 * This policy is based on Codex's sandbox policy and Chrome's sandbox policy.
 *
 * Sources:
 * - Codex: https://github.com/openai/codex/blob/ac8a3155d64bfb502249be5666dd6c87a190510d/codex-rs/core/src/seatbelt_base_policy.sbpl
 * - Chrome: https://source.chromium.org/chromium/chromium/src/+/main:sandbox/policy/mac/common.sb;l=273-319;drc=7b3962fe2e5fc9e2ee58000dc8fbf3429d84d3bd
 */
const MACOS_SEATBELT_BASE_POLICY = `(version 1)
; start with closed-by-default
(deny default)

; child processes inherit the policy of their parent
(allow process-exec)
(allow process-fork)
(allow signal (target self))

(allow file-write-data
  (require-all
    (path "/dev/null")
    (vnode-type CHARACTER-DEVICE)))

(allow file-write-data
  (require-all
    (path "/dev/tty")
    (vnode-type CHARACTER-DEVICE)))

; allow reading from /dev/null (used for stdin redirection)
(allow file-read-data
  (require-all
    (path "/dev/null")
    (vnode-type CHARACTER-DEVICE)))

; required for directory listing and traversal
(allow file-read-data (literal "/"))

; allow stat and read of all paths
(allow file-read-data (subpath "/"))
(allow file-read-metadata (subpath "/"))

; sysctls permitted.
(allow sysctl-read
  (sysctl-name "hw.activecpu")
  (sysctl-name "hw.busfrequency_compat")
  (sysctl-name "hw.byteorder")
  (sysctl-name "hw.cacheconfig")
  (sysctl-name "hw.cachelinesize_compat")
  (sysctl-name "hw.cpufamily")
  (sysctl-name "hw.cpufrequency_compat")
  (sysctl-name "hw.cputype")
  (sysctl-name "hw.l1dcachesize_compat")
  (sysctl-name "hw.l1icachesize_compat")
  (sysctl-name "hw.l2cachesize_compat")
  (sysctl-name "hw.l3cachesize_compat")
  (sysctl-name "hw.logicalcpu_max")
  (sysctl-name "hw.machine")
  (sysctl-name "hw.ncpu")
  (sysctl-name "hw.nperflevels")
  (sysctl-name "hw.optional.arm.FEAT_BF16")
  (sysctl-name "hw.optional.arm.FEAT_DotProd")
  (sysctl-name "hw.optional.arm.FEAT_FCMA")
  (sysctl-name "hw.optional.arm.FEAT_FHM")
  (sysctl-name "hw.optional.arm.FEAT_FP16")
  (sysctl-name "hw.optional.arm.FEAT_I8MM")
  (sysctl-name "hw.optional.arm.FEAT_JSCVT")
  (sysctl-name "hw.optional.arm.FEAT_LSE")
  (sysctl-name "hw.optional.arm.FEAT_RDM")
  (sysctl-name "hw.optional.arm.FEAT_SHA512")
  (sysctl-name "hw.optional.armv8_2_sha512")
  (sysctl-name "hw.memsize")
  (sysctl-name "hw.pagesize")
  (sysctl-name "hw.packages")
  (sysctl-name "hw.pagesize_compat")
  (sysctl-name "hw.physicalcpu_max")
  (sysctl-name "hw.tbfrequency_compat")
  (sysctl-name "hw.vectorunit")
  (sysctl-name "kern.bootargs")
  (sysctl-name "kern.hostname")
  (sysctl-name "kern.maxfilesperproc")
  (sysctl-name "kern.osproductversion")
  (sysctl-name "kern.osrelease")
  (sysctl-name "kern.ostype")
  (sysctl-name "kern.osvariant_status")
  (sysctl-name "kern.osversion")
  (sysctl-name "kern.secure_kernel")
  (sysctl-name "kern.usrstack64")
  (sysctl-name "kern.version")
  (sysctl-name "security.mac.lockdown_mode_state")
  (sysctl-name "sysctl.proc_cputype")
  (sysctl-name-prefix "hw.perflevel")
)

; Added on top of Chrome profile
; Needed for python multiprocessing on MacOS for the SemLock
(allow ipc-posix-sem)

; needed to look up user info, see https://crbug.com/792228
(allow mach-lookup
  (global-name "com.apple.system.opendirectoryd.libinfo")
)`;
const MACOS_TMP_READWRITE_PATHS = ["/tmp/", "/private/tmp/", "/var/folders/", "/private/var/folders/"];
// Contains denies that must always be added, regardless of user additions.
// Intent is to block WRITE operations only for:
// everything in .vscode/ or .vscode itself
// everything in .cursor/ or .cursor itself
//    EXCEPT .cursor/rules/* and .cursor/commands/* and .cursor/worktrees/*
// any file with .code-workspace extension
// any file called .cursorignore
// .git/config files (security: prevent git config manipulation even when git writes are allowed)
// Note that denies must be at least as specific as the allow that they countermand.
// READ operations are allowed to enable tool discovery and configuration access.
const MACOS_SEATBELT_POLICY_SUFFIX = `
(deny file-write* (regex "^.*/\\.vscode($|/.*)"))
(deny file-write* (require-all
  (regex "^.*/\\.cursor($|/.*)")
  (require-not (regex "^.*/\\.cursor/(rules|commands|worktrees)($|/.*)"))
))
(deny file-write* (regex "^.*\\.code-workspace$"))
(deny file-write* (regex "^.*/\\.cursorignore$"))
(deny file-write* (regex "^.*/\\.git/config$"))
`;
//# sourceMappingURL=policy.js.map
; // ../shell-exec/dist/sandbox/macos/seatbelt.js

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
; // ../shell-exec/dist/sandbox/sandbox.js

// Platform detection
const isMacOS = "darwin" === "darwin";
const isLinux = "darwin" === "linux";
const isWindows = "darwin" === "win32";
/**
 * Hosts should call this at startup on Linux to configure the sandbox helper path.
 * No-op on non-Linux platforms.
 */
function sandbox_setLinuxSandboxBinaryPath(path) {
  if (!isLinux) return;
  setLinuxSandboxBinaryPath(path);
}
/**
 * Spawns a child process with sandboxing based on the provided policy.
 * This is the main entry point that delegates to platform-specific implementations.
 *
 * @param command - The command to execute
 * @param args - Command arguments
 * @param options - Spawn options
 * @param sandboxPolicy - The sandbox policy to apply
 * @returns ChildProcess instance
 */
function spawnInSandbox(command, args = [], options = {}, sandboxPolicy) {
  options.env = filterElectronEnv(options.env);
  if (isMacOS) {
    return spawnWithSeatbelt(command, args, options, sandboxPolicy);
  } else if (isLinux) {
    // Use a lightweight capability check to avoid expensive policy-aware preflight
    if (sandboxPolicy.type !== "insecure_none") {
      // Note: logger not available in spawnInSandbox context, use default console.error
      if (isLinuxSandboxSupported()) {
        return spawnWithLandlock(command, args, options, sandboxPolicy);
      }
      throw new Error(`Sandbox policy '${sandboxPolicy.type}' is not supported on this Linux system. ` + `Ensure kernel >= 5.13 with Landlock and unprivileged user/mount namespaces enabled, or use 'insecure_none'.`);
    }
    return sandbox_spawnUnsafe(command, args, options);
  } else if (isWindows) {
    if (sandboxPolicy.type !== "insecure_none") {
      throw new Error(`Sandbox policy '${sandboxPolicy.type}' is not supported on ${"darwin"}. Only 'insecure_none' is allowed.`);
    }
    return sandbox_spawnUnsafe(command, args, options);
  } else {
    throw new Error(`Unsupported platform: ${"darwin"}`);
  }
}
function sandbox_spawnUnsafe(command, args, options) {
  return (0, external_node_child_process_.spawn)(command, args, options); // nosemgrep: detect-child-process
}
/**
 * Captures sandbox denial logs for a sandboxed process.
 * Call this function after a sandboxed process exits to see any sandbox violations.
 * Only works on macOS with seatbelt sandboxing.
 *
 * @param child - The ChildProcess returned from spawnInSandbox
 * @returns Promise that resolves with an array of deny events
 */
function sandbox_captureSandboxDenies(child) {
  if (isMacOS) {
    return captureSandboxDenies(child);
  } else {
    return Promise.resolve([]);
  }
}
/**
 * Returns true if sandboxing is supported on this platform/runtime.
 * - macOS: requires the system seatbelt executable to be available
 * - Linux: requires kernel >= 5.13 with Landlock, unprivileged user/mount namespaces
 * - Windows: currently unsupported
 */
function isSandboxSupported(_policy, _options) {
  if (isMacOS) {
    try {
      (0, external_node_fs_.accessSync)("/usr/bin/sandbox-exec", external_node_fs_.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }
  if (isLinux) {
    // Lightweight system capability check only; avoid expensive policy-aware preflight
    return isLinuxSandboxSupported(_options?.ctx);
  }
  return false;
}
//# sourceMappingURL=sandbox.js.map
; // ../shell-exec/dist/types.js
var KnownShellExecutor;
(function (KnownShellExecutor) {
  KnownShellExecutor["Zsh"] = "zsh";
  KnownShellExecutor["ZshLight"] = "zsh-light";
  KnownShellExecutor["Bash"] = "bash";
  KnownShellExecutor["PowerShell"] = "powershell";
  KnownShellExecutor["Naive"] = "naive";
})(KnownShellExecutor || (KnownShellExecutor = {}));
/**
 * Standard environment overrides for shell execution to ensure consistent behavior:
 * - TERM=dumb: Prevents ANSI color codes and interactive features, also prevents SSH MOTD
 * - NO_COLOR=1: Explicitly disables color output in tools that respect this standard
 * - FORCE_COLOR=0: Disables color for tools that use this convention (like some npm packages)
 */
const types_SHELL_ENV_OVERRIDES = {
  TERM: "dumb",
  NO_COLOR: "1",
  FORCE_COLOR: "0",
  _ZO_DOCTOR: "0"
};
//# sourceMappingURL=types.js.map
; // ../shell-exec/dist/core.js

function spawnWithSignal(command, args = [], options = {}, sandboxPolicy, signal) {
  // Check if signal is already aborted
  if (signal?.aborted) {
    const error = new Error("Operation was aborted");
    error.name = "AbortError";
    // Create a mock child process that immediately emits an error
    const mockChild = new (require("node:events").EventEmitter)();
    process.nextTick(() => {
      mockChild.emit("error", error);
    });
    return mockChild;
  }
  const child = spawnInSandbox(command, args, options, sandboxPolicy);
  if (signal) {
    const abortHandler = () => {
      if (child.pid) {
        try {
          // Send SIGTERM to the process group to gracefully terminate
          if (options.detached) {
            process.kill(-child.pid, "SIGTERM");
          } else {
            child.kill("SIGTERM");
          }
          // Set up force kill after 1 second
          const forceKillTimeout = setTimeout(() => {
            if (!child.killed && child.pid) {
              try {
                if (options.detached) {
                  process.kill(-child.pid, "SIGKILL");
                } else {
                  child.kill("SIGKILL");
                }
              } catch (_killError) {
                // Process might already be dead
              }
            }
          }, 1000);
          // Clean up timeout if process exits gracefully
          child.once("exit", () => {
            clearTimeout(forceKillTimeout);
          });
        } catch (_error) {
          // Process might already be dead, ignore errors
        }
      }
    };
    signal.addEventListener("abort", abortHandler, {
      once: true
    });
    // Clean up event listener when child process exits
    child.once("exit", () => {
      signal.removeEventListener("abort", abortHandler);
    });
  }
  return child;
}
function shellExec(command, args = [], options = {}, sandboxPolicy) {
  return new Promise((resolve, reject) => {
    const {
      signal,
      ...spawnOptions
    } = options;
    // Set environment variables to disable color output
    const env = {
      ...process.env,
      ...SHELL_ENV_OVERRIDES,
      ...spawnOptions.env
    };
    const child = spawnWithSignal(command, args, {
      ...spawnOptions,
      env,
      stdio: ["pipe", "pipe", "pipe"]
    }, sandboxPolicy, signal);
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", data => {
      stdout += data.toString();
    });
    child.stderr?.on("data", data => {
      stderr += data.toString();
    });
    child.on("error", error => {
      reject(error);
    });
    child.on("exit", code => {
      if (code === 0) {
        resolve({
          stdout,
          stderr,
          code
        });
      } else {
        const error = new Error(`Process exited with code ${code}`);
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}
function readPipe(child, pipe) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    pipe.on("data", chunk => {
      chunks.push(chunk);
    });
    pipe.on("end", () => {
      resolve(Buffer.concat(chunks).toString());
    });
    pipe.on("error", reject);
    child.on("error", reject);
    child.on("exit", () => {
      resolve(Buffer.concat(chunks).toString());
    });
  });
}
/**
 * Splits shell state output into working directory and state snapshot.
 * The first line is expected to be the current working directory (PWD),
 * and the rest is the shell state (environment vars, functions, etc.).
 */
function splitPwdAndState(state) {
  const firstLineIndex = state.indexOf("\n");
  const cwd = state.substring(0, firstLineIndex);
  const rest = state.substring(firstLineIndex);
  return {
    cwd,
    rest
  };
}
/**
 * Extracts shell state after a marker to filter out MOTD and other
 * shell initialization output. If the marker is not found, returns
 * the full output as a fallback.
 */
function parseShellStateOutput(fullOutput, marker) {
  const markerWithNewline = `${marker}\n`;
  const markerIndex = fullOutput.indexOf(markerWithNewline);
  return markerIndex >= 0 ? fullOutput.slice(markerIndex + markerWithNewline.length) : fullOutput;
}
//# sourceMappingURL=core.js.map
; // ../shell-exec/dist/dump_bash_state.js
const bashScript = `#!/usr/bin/env bash

# Usage:
#   source dump_bash_state.bash
#   dump_bash_state OUTPUT_FILE
# Or execute directly (captures a subshell's state):
#   ./dump_bash_state.bash OUTPUT_FILE

dump_bash_state() {
  set -euo pipefail

  # Require base64 for safe encoding of emitted sections
  if ! command -v base64 >/dev/null 2>&1; then
    echo "Error: base64 command is required" >&2
    return 1
  fi

  # Helper to log timing, only if DUMP_BASH_STATE_TIMING is set
  if [[ -n "\${DUMP_BASH_STATE_TIMING:-}" ]]; then
    # Timing setup
    if [[ "\${BASH_VERSION%%.*}" -ge 5 ]]; then
      # Use EPOCHREALTIME if available (bash 5+)
      local start_time=\${EPOCHREALTIME}
      local step_start=\${EPOCHREALTIME}
      _log_timing() {
        local step_name="$1"
        local now=\${EPOCHREALTIME}
        local step_duration=$(command awk "BEGIN {printf "%.3f", $now - $step_start}")
        local total_duration=$(command awk "BEGIN {printf "%.3f", $now - $start_time}")
        builtin printf "[TIMING] %-20s: %6.3fs (total: %6.3fs)\n" "$step_name" "$step_duration" "$total_duration" >&2
        step_start=$now
      }
    else
      # Fallback for older bash versions
      local start_time=$(command date +%s.%N)
      local step_start=$(command date +%s.%N)
      _log_timing() {
        local step_name="$1"
        local now=$(command date +%s.%N)
        local step_duration=$(command awk "BEGIN {printf "%.3f", $now - $step_start}")
        local total_duration=$(command awk "BEGIN {printf "%.3f", $now - $start_time}")
        builtin printf "[TIMING] %-20s: %6.3fs (total: %6.3fs)\n" "$step_name" "$step_duration" "$total_duration" >&2
        step_start=$now
      }
    fi
  else
    _log_timing() { :; }
  fi

  # Helper to append a line to output file
  _emit() {
    builtin printf '%s\n' "$1"
  }

  # Helper to safely encode and emit unsafe values
  _emit_encoded() {
    local content="$1"
    local var_name="$2"
    if [[ -n "$content" ]]; then
      builtin printf 'cursor_snap_%s=$(command base64 -d <<'''CURSOR_SNAP_EOF_%s'''\n' "$var_name" "$var_name"
      command base64 <<<"$content" | command tr -d '\n'
      builtin printf '\nCURSOR_SNAP_EOF_%s\n' "$var_name"
      builtin printf ')\n'
      builtin printf 'eval "$cursor_snap_%s"\n' "$var_name"
    fi
  }

  # Start fresh
  _log_timing "file_init"

  # Working directory
  _emit "$PWD"
  _log_timing "working_dir"

  # Environment variables (export statements)
  local env_vars
  env_vars=$(builtin export -p 2>/dev/null || true)
  _emit_encoded "$env_vars" "ENV_VARS_B64"
  _log_timing "environment"

  # POSIX shell options (replayable as set +/-o lines; exclude nounset which we enable locally)
  local posix_opts
  posix_opts=$(builtin shopt -po 2>/dev/null | command grep -v '^set -o nounset$' | command grep -v '^set +o nounset$' || true)
  _emit_encoded "$posix_opts" "POSIX_OPTS_B64"
  _log_timing "posix_options"

  # Bash shopt options (replayable as shopt -s/-u lines)
  local bash_opts
  bash_opts=$(builtin shopt -p 2>/dev/null || true)
  _emit_encoded "$bash_opts" "BASH_OPTS_B64"
  _log_timing "bash_options"

  # Functions: capture all functions
  local all_functions
  all_functions=$(builtin declare -f 2>/dev/null || true)
  _emit_encoded "$all_functions" "FUNCTIONS_B64"
  _log_timing "functions"

  # Aliases
  local aliases
  aliases=$(builtin alias -p 2>/dev/null || true)
  _emit_encoded "$aliases" "ALIASES_B64"
  _log_timing "aliases"


  # Done
  _log_timing "finalize"
}
`;
/* harmony default export */
const dump_bash_state = bashScript;
//# sourceMappingURL=dump_bash_state.js.map
; // ../shell-exec/dist/bash.js
var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
function getBashPath(userTerminalHint) {
  // NB: On Windows, there is a "bash.exe" that will connect to WSL, and there
  // may be other bash.exe's such as Cygwin, MSYS2, etc, but we *only* support
  // Git Bash, so make sure we find that and if it doesn't exist, we toss it.
  if (false)
    // removed by dead control flow
    {}
  const bashPath = (0, dist /* findActualExecutable */.Ef)("bash", []).cmd;
  return bashPath;
}
function windowsPathToGitBash(windowsPath) {
  if (true) {
    return windowsPath;
  }
  // Convert Windows path (e.g., C:\Users\...\Temp\...) to Git Bash format
  // Git Bash on Windows can handle Windows paths directly, but we convert to Unix-style
  // for consistency. Try using cygpath if available, otherwise convert manually.
  // removed by dead control flow
  {}
  // Git Bash typically maps C:\ to /c/, but the exact format can vary
  // Try the standard MSYS2/Git Bash format: /c/Users/...
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // Fallback: just replace backslashes with forward slashes
  // removed by dead control flow
  {}
}
class BashState {
  cwd;
  state;
  userTerminalHint;
  useFileStateTransport;
  constructor(cwd, state, userTerminalHint, useFileStateTransport = false) {
    this.cwd = cwd;
    this.state = state;
    this.userTerminalHint = userTerminalHint;
    this.useFileStateTransport = useFileStateTransport;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new BashState(workingDirectory ?? this.cwd, this.state, this.userTerminalHint, this.useFileStateTransport);
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = __addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("BashState.execute")), false);
      const interactive = options?.interactive ?? false;
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const cwd = options?.workingDirectory ?? this.cwd;
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      let core = `builtin eval "$1"`;
      if (!interactive) {
        core += " < /dev/null";
      }
      const useFileTransport = this.useFileStateTransport;
      let tempDir;
      let stateInputPath;
      let stateOutputPath;
      if (useFileTransport) {
        tempDir = await (0, promises_.mkdtemp)(external_node_path_.join(external_node_os_.tmpdir(), "cursor-bash-state-"));
        const dirname = external_node_path_.basename(tempDir);
        stateInputPath = external_node_path_.join(tempDir, "state-in");
        stateOutputPath = external_node_path_.join(tempDir, "state-out");
        await (0, promises_.writeFile)(stateInputPath, this.state, "utf8");
        // Ensure the output file exists (empty) so Git Bash can write to it
        await (0, promises_.writeFile)(stateOutputPath, "", "utf8").catch(() => {
          // Best effort - if it fails, continue anyway
        });
        // NB: We need to pass this path in Git Bash format, not Windows format
        // Git Bash maps Windows paths: C:\Users\... becomes /c/Users/...
        // Use cygpath if available to ensure correct path conversion, otherwise convert manually
        const gitBashInputPath = windowsPathToGitBash(stateInputPath);
        const gitBashOutputPath = windowsPathToGitBash(stateOutputPath);
        // Set environment variables - Git Bash will use cygpath internally if needed
        env.CURSOR_STATE_INPUT_FILE = gitBashInputPath;
        env.CURSOR_STATE_OUTPUT_FILE = gitBashOutputPath;
      }
      const stateLoader = useFileTransport ? 'snap=$(command cat "$CURSOR_STATE_INPUT_FILE")' : "snap=$(command cat <&3)";
      // Ensure the output directory exists and file is writable
      const stateWriter = useFileTransport ? 'mkdir -p "$(dirname "$CURSOR_STATE_OUTPUT_FILE")" 2>/dev/null; dump_bash_state > "$CURSOR_STATE_OUTPUT_FILE"' : "dump_bash_state >&4";
      const c = `${stateLoader} && builtin shopt -s extglob && builtin eval -- "$snap" && ` + `{ builtin set +u 2>/dev/null || true; builtin export PWD="$(builtin pwd)"; ${core}; }; ` + `COMMAND_EXIT_CODE=$?; ${stateWriter}; builtin exit $COMMAND_EXIT_CODE`;
      const args = ["-O", "extglob", "-c", c, "--",
      // This separates options from positional arguments
      command];
      const bashPath = getBashPath(this.userTerminalHint);
      if (!bashPath) {
        throw new Error("Can't find Bash");
      }
      let newState = "";
      const readStateFromTransport = async () => {
        if (useFileTransport) {
          if (!stateOutputPath) {
            newState = this.state;
            return;
          }
          try {
            newState = await (0, promises_.readFile)(stateOutputPath, "utf8");
          } catch (error) {
            console.warn("[shell-exec] Failed to read bash state file", error);
            newState = this.state;
          }
        }
      };
      const cleanupStateFiles = async () => {
        if (tempDir) {
          try {
            await (0, promises_.rm)(tempDir, {
              recursive: true,
              force: true
            });
          } catch {
            // best effort cleanup
          }
        }
      };
      let child;
      try {
        child = spawnWithSignal(bashPath, args, {
          env,
          // Use 'ignore' for stdin (unless interactive) to prevent background processes
          // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
          stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe", "pipe", "pipe"],
          cwd
        }, options?.sandboxPolicy ?? {
          type: "insecure_none"
        }, options?.signal);
      } catch (error) {
        await cleanupStateFiles();
        throw error;
      }
      // Handle stdout data
      child.stdout?.on("data", async data => {
        try {
          await iterable.write({
            type: "stdout",
            data: data.toString()
          });
        } catch {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle stderr data
      child.stderr?.on("data", async data => {
        try {
          await iterable.write({
            type: "stderr",
            data: data.toString()
          });
        } catch {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle process exit and errors
      child.on("error", async error => {
        await cleanupStateFiles();
        iterable.throw(error);
      });
      // NB: This is extremely Tricky. Data from stdio can come in after 'exit',
      // so instead of emitting 'exit' immediately, we store off the exit code
      // and emit it once 'close' is called.
      let exitCode = null;
      let closeTimeoutId = null;
      let hasEmittedExit = false;
      const emitExitAndClose = async () => {
        if (hasEmittedExit) return;
        hasEmittedExit = true;
        if (closeTimeoutId) {
          clearTimeout(closeTimeoutId);
          closeTimeoutId = null;
        }
        (0, context_dist /* reportEvent */.HF)(span.ctx, "exit");
        if (!options?.signal?.aborted) {
          await readStateFromTransport();
          const {
            cwd: nextCwd,
            rest
          } = splitPwdAndState(newState);
          // On Windows, Git Bash returns Unix-style paths which don't work with Node.js spawn,
          // so we skip updating CWD on Windows
          this.state = rest;
          if (true && nextCwd?.startsWith("/")) {
            this.cwd = nextCwd;
          }
        }
        // Attempt to capture sandbox deny events (best-effort)
        if (options?.sandboxPolicy?.captureDenies) {
          try {
            const denyEvents = await sandbox_captureSandboxDenies(child);
            if (denyEvents && denyEvents.length > 0) {
              await iterable.write({
                type: "sandbox_denies",
                events: denyEvents
              });
            }
          } catch {}
        }
        try {
          await iterable.write({
            type: "exit",
            code: exitCode,
            data: ""
          });
          iterable.close();
        } catch {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
        await cleanupStateFiles();
      };
      child.on("exit", (code, _signal) => {
        exitCode = code;
        // Start timeout to prevent hanging if 'close' never fires
        const timeout = options?.closeTimeout ?? 5000;
        if (timeout > 0) {
          closeTimeoutId = setTimeout(() => {
            console.warn(`[shell-exec] Close event did not fire within ${timeout}ms after exit. ` + `This may indicate a background process is holding file descriptors open. ` + `Proceeding anyway to prevent hang.`);
            emitExitAndClose();
          }, timeout);
        }
      });
      child.on("close", async () => {
        await emitExitAndClose();
      });
      const inFd = child.stdio[3];
      const outFd = child.stdio[4];
      if (!useFileTransport) {
        inFd?.write(this.state);
        inFd?.end();
        outFd?.on("data", data => {
          newState += data.toString();
        });
      }
      yield* iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources(env_1);
    }
  }
}
async function initBashState(options) {
  const env = {
    ...process.env,
    ...types_SHELL_ENV_OVERRIDES,
    ...options?.env
  };
  const STATE_MARKER = "__CURSOR_STATE_MARKER__";
  const args = ["-O", "extglob", "-ilc", dump_bash_state + " " + `builtin printf '${STATE_MARKER}\\n'; dump_bash_state`];
  const bashPath = getBashPath(options?.userTerminalHint);
  if (!bashPath) {
    throw new Error("Can't find Bash");
  }
  const child = spawnWithSignal(bashPath, args, {
    env,
    detached: true,
    // Use 'ignore' for stdin so it's connected to /dev/null from the start
    // This prevents background processes (like ssh-agent) started during
    // initialization from inheriting an open stdin pipe
    stdio: ["ignore", "pipe", "pipe"]
  }, {
    type: "insecure_none"
  }, options?.signal);
  let fullOutput = "";
  child.stdout?.on("data", data => {
    fullOutput += data.toString();
  });
  await new Promise(resolve => {
    child.on("close", () => {
      resolve(undefined);
    });
  });
  const snapshot = parseShellStateOutput(fullOutput, STATE_MARKER);
  const {
    cwd,
    rest
  } = splitPwdAndState(snapshot);
  const useFileStateTransport = "darwin" === "win32";
  // On Windows, Git Bash returns Unix-style paths which don't work with Node.js spawn,
  // so we use process.cwd() instead
  const initialCwd = false ? 0 : cwd;
  return new BashState(initialCwd, rest, options?.userTerminalHint, useFileStateTransport);
}

//# sourceMappingURL=bash.js.map
; // ../shell-exec/dist/lazy.js
var lazy_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var lazy_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LazyTerminalExecutor {
  promise;
  constructor(promise) {
    this.promise = promise;
  }
  async getCwd() {
    const executor = await this.promise;
    return executor.getCwd();
  }
  clone(workingDirectory) {
    // Clone the underlying executor when it's ready
    return new LazyTerminalExecutor(this.promise.then(executor => executor.clone(workingDirectory)));
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = lazy_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("LazyTerminalExecutor.execute")), false);
      const executor = await this.promise;
      for await (const event of executor.execute(ctx, command, options)) {
        yield event;
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      lazy_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=lazy.js.map
; // ../shell-exec/dist/naive.js
var naive_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var naive_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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

/**
 * A naive TerminalExecutor implementation that simply executes commands
 * using the default shell without any state preservation between commands.
 */
class NaiveTerminalExecutor {
  cwd;
  options;
  constructor(cwd, options) {
    this.cwd = cwd;
    this.options = options;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new NaiveTerminalExecutor(workingDirectory ?? this.cwd, this.options);
  }
  execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = naive_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("NaiveTerminalExecutor.execute")), false);
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const interactive = options?.interactive ?? false;
      // Set environment variables to disable color output
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      const child = spawnWithSignal(this.options?.shell || process.env.SHELL || "/bin/sh", ["-c", command], {
        env,
        cwd: options?.workingDirectory,
        // Use 'ignore' for stdin unless interactive, to prevent background
        // processes from inheriting an open stdin pipe
        stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe"]
      }, options?.sandboxPolicy ?? {
        type: "insecure_none"
      }, options?.signal);
      // Handle stdout data
      child.stdout?.on("data", async data => {
        try {
          await iterable.write({
            type: "stdout",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle stderr data
      child.stderr?.on("data", async data => {
        try {
          await iterable.write({
            type: "stderr",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle process exit and errors
      child.on("error", error => {
        iterable.throw(error);
      });
      // NB: This naive implementation uses 'exit' instead of 'close' for simplicity
      // and speed. It accepts the risk of potentially missing some buffered output
      // in exchange for not hanging on background processes.
      child.on("exit", async code => {
        (0, context_dist /* reportEvent */.HF)(span.ctx, "exit");
        // Attempt to capture sandbox deny events (best-effort)
        if (options?.sandboxPolicy?.captureDenies ?? false) {
          try {
            const denyEvents = await sandbox_captureSandboxDenies(child);
            if (denyEvents && denyEvents.length > 0) {
              await iterable.write({
                type: "sandbox_denies",
                events: denyEvents
              });
            }
          } catch {}
        }
        try {
          await iterable.write({
            type: "exit",
            code,
            data: ""
          });
          iterable.close();
        } catch (_error) {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
      });
      return iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      naive_disposeResources(env_1);
    }
  }
}
/**
 * Create a new NaiveTerminalExecutor instance
 * @param options - Optional options to use (shell defaults to process.env.SHELL or /bin/sh)
 * @returns A new NaiveTerminalExecutor instance
 */
function createNaiveTerminalExecutor(options) {
  const cwd = process.cwd();
  return new NaiveTerminalExecutor(cwd, options);
}
//# sourceMappingURL=naive.js.map
// EXTERNAL MODULE: external "node:crypto"
var external_node_crypto_ = __webpack_require__("node:crypto");
; // ../shell-exec/dist/dump_powershell_state.js
const powershellScript = `
function Dump-PowerShellState {
    param(
        [Parameter(Mandatory = $true)]
        [string]$OutputFile
    )

    function Emit {
        param([string]$Content)
        Add-Content -Path $OutputFile -Value $Content -Encoding UTF8
    }

    if (Test-Path $OutputFile) {
        Remove-Item $OutputFile -Force
    }
    New-Item -Path $OutputFile -ItemType File -Force | Out-Null
    #Log-Timing "file_init"

    Emit $PWD.Path
    #Log-Timing "working_dir"

    $envVars = Get-ChildItem Env: | Sort-Object Name
    foreach ($var in $envVars) {
        $encoded = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([string]$var.Value))
        Emit ('Set-Item -LiteralPath ''Env:{0}'' -Value ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(''{1}'')))' -f $var.Name, $encoded)
    }
    #Log-Timing "environment"

    $aliases = Get-Alias | Sort-Object Name
    foreach ($alias in $aliases) {
        $definition = $alias.Definition

        if ($alias.Options -band [System.Management.Automation.ScopedItemOptions]::ReadOnly) {
        }
        elseif ($alias.Options -band [System.Management.Automation.ScopedItemOptions]::Constant) {
        }
        elseif ($alias.Options -band [System.Management.Automation.ScopedItemOptions]::AllScope) {
        }
        else {
            Emit ('Set-Alias -Name "{0}" -Value "{1}"' -f $alias.Name, $definition)
        }
    }

    #Log-Timing "finalize"
}
`;
const powershellWrapperScript = (state, cwd, cmd, stateOutFile) => `
${state}

Set-Location '${cwd}'

# Execute user command
${cmd}
$COMMAND_EXIT_CODE = $LASTEXITCODE

${powershellScript}
Dump-PowerShellState -OutputFile "${stateOutFile}"

exit $COMMAND_EXIT_CODE
`;
/* harmony default export */
const dump_powershell_state = powershellWrapperScript;
//# sourceMappingURL=dump_powershell_state.js.map
; // ../shell-exec/dist/powershell.js
var powershell_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var powershell_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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

/**
 * Detects which PowerShell executable to use.
 * Returns 'pwsh' for PowerShell Core (cross-platform) or 'powershell' for Windows PowerShell.
 */
function getPowerShellExecutable() {
  let pwsh = (0, dist /* findActualExecutable */.Ef)("pwsh", []).cmd;
  if (pwsh !== "pwsh") {
    return pwsh;
  }
  pwsh = (0, dist /* findActualExecutable */.Ef)("powershell", []).cmd;
  if (pwsh !== "powershell") {
    return pwsh;
  }
  if (false)
    // removed by dead control flow
    {}
  throw new Error("Neither 'pwsh' (PowerShell Core) nor 'powershell' (Windows PowerShell) found in PATH");
}
class PowerShellState {
  cwd;
  state;
  constructor(cwd, state) {
    this.cwd = cwd;
    this.state = state;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new PowerShellState(workingDirectory ?? this.cwd, this.state);
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = powershell_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("PowerShellState.execute")), false);
      const interactive = options?.interactive ?? false;
      const cwd = options?.workingDirectory ?? this.cwd;
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      // Create temporary files for state transfer
      const tempDir = external_node_os_.tmpdir();
      const stateOutFile = external_node_path_.join(tempDir, `ps-state-out-${(0, external_node_crypto_.randomUUID)()}.txt`);
      const commandScript = dump_powershell_state(this.state, cwd, command, stateOutFile);
      // Write the command script to a temporary file and execute with -File
      const scriptFile = external_node_path_.join(tempDir, `ps-script-${(0, external_node_crypto_.randomUUID)()}.ps1`);
      await promises_.writeFile(scriptFile, commandScript, {
        encoding: "utf8"
      });
      const args = ["-ExecutionPolicy", "Bypass", "-File", scriptFile];
      if (!interactive) {
        args.push("-NonInteractive");
      }
      const pwsh = getPowerShellExecutable();
      const child = spawnWithSignal(pwsh, args, {
        env,
        // Use 'ignore' for stdin (unless interactive) to prevent background processes
        // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
        stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe"],
        cwd
      }, options?.sandboxPolicy ?? {
        type: "insecure_none"
      }, options?.signal);
      // Handle stdout data
      child.stdout?.on("data", async data => {
        const s = data.toString();
        try {
          await iterable.write({
            type: "stdout",
            data: s
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle stderr data
      child.stderr?.on("data", async data => {
        const s = data.toString();
        try {
          await iterable.write({
            type: "stderr",
            data: s
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      const cleanup = async () => {
        try {
          const newState = await promises_.readFile(stateOutFile, "utf8");
          const {
            cwd: newCwd,
            rest
          } = splitPwdAndState(newState);
          this.state = rest;
          // PowerShell paths may have extra whitespace, trim it
          this.cwd = newCwd.trim();
          await (0, promises_.rm)(stateOutFile).catch(() => {
            /* ignore */
          });
        } catch (_error) {
          // If we can't read the state file, the command likely failed
          // Keep the current state
        }
        // Cleanup temporary script file
        await (0, promises_.rm)(scriptFile).catch(() => {
          /* ignore */
        });
      };
      // NB: This is extremely Tricky. Data from stdio can come in after 'exit',
      // so instead of emitting 'exit' immediately, we store off the exit code
      // and emit it once 'close' is called.
      let exitCode = null;
      let closeTimeoutId = null;
      let hasEmittedExit = false;
      const emitExitAndClose = async () => {
        if (hasEmittedExit) return;
        hasEmittedExit = true;
        if (closeTimeoutId) {
          clearTimeout(closeTimeoutId);
          closeTimeoutId = null;
        }
        (0, context_dist /* reportEvent */.HF)(span.ctx, "exit");
        try {
          await iterable.write({
            type: "exit",
            code: exitCode,
            data: ""
          });
          await cleanup();
          iterable.close();
        } catch (_error) {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
      };
      child.on("exit", (code, _signal) => {
        exitCode = code;
        // Start timeout to prevent hanging if 'close' never fires
        const timeout = options?.closeTimeout ?? 5000;
        if (timeout > 0) {
          closeTimeoutId = setTimeout(() => {
            console.warn(`[shell-exec] Close event did not fire within ${timeout}ms after exit. ` + `This may indicate a background process is holding file descriptors open. ` + `Proceeding anyway to prevent hang.`);
            emitExitAndClose();
          }, timeout);
        }
      });
      child.on("close", async () => {
        await emitExitAndClose();
      });
      // Handle process exit and errors
      child.on("error", error => {
        cleanup().catch(() => {
          /* ignore */
        });
        iterable.throw(error);
      });
      yield* iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      powershell_disposeResources(env_1);
    }
  }
}
async function initPowerShellState() {
  return new PowerShellState(process.cwd(), "");
}
//# sourceMappingURL=powershell.js.map
; // ../shell-exec/dist/dump_zsh_state.js
const zshScript = `#!/usr/bin/env zsh

# Usage:
#   source dump_zsh_state.zsh
#   dump_zsh_state
# Or execute directly (captures a subshell's state):
#   ./dump_zsh_state.zsh

# Define a function so sourcing won't alter caller state; emulate locally inside
function dump_zsh_state() {
  emulate -L zsh -o errreturn -o pipefail
  set -u


  # Helper to log timing, only if DUMP_ZSH_STATE_TIMING is set
  if [[ -n "\${DUMP_ZSH_STATE_TIMING:-}" ]]; then
    # Timing setup
    typeset start_time=\${EPOCHREALTIME}
    typeset step_start=\${EPOCHREALTIME}
    _log_timing() {
      typeset step_name="$1"
      typeset now=\${EPOCHREALTIME}
      typeset step_duration=$((now - step_start))
      typeset total_duration=$((now - start_time))
      builtin printf "[TIMING] %-20s: %6.3fs (total: %6.3fs)\n" "$step_name" "$step_duration" "$total_duration" >&2
      step_start=$now
    }
  else
    _log_timing() { :; }
  fi

  # Ensure parameter arrays are available
  builtin zmodload -F zsh/parameter p:parameters p:options p:functions p:aliases p:galiases p:saliases 2>/dev/null || true
  _log_timing "zmodload"

  # Helper to print a line to stdout
  _emit() {
    builtin print -r -- "$1"
  }

  # Helper to safely encode and emit unsafe values
  _emit_encoded() {
    local content="$1"
    local var_name="$2"
    if [[ -n "$content" ]]; then
      # Use here-document to avoid argument list length limits entirely
      builtin printf 'cursor_snap_%s=$(command base64 -d <<'''CURSOR_SNAP_EOF_%s'''\n' "$var_name" "$var_name"
      command base64 <<<"$content" | command tr -d '\n'
      builtin printf '\nCURSOR_SNAP_EOF_%s\n' "$var_name"
      builtin printf ')\n'
      builtin printf 'eval "$cursor_snap_%s"\n' "$var_name"
    fi
  }

  _log_timing "init"

  # Header
  _emit "$PWD"

  _emit "# zsh state dump generated on $(command date +'%Y-%m-%d %H:%M:%S %z')"
  _log_timing "header"

  # Working directory
  _log_timing "working_dir"

  # Environment variables (exported)
  local env_vars
  env_vars=$(builtin typeset -xp 2>/dev/null || true)
  _emit_encoded "$env_vars" "ENV_VARS_B64"
  _log_timing "env_variables"

  # Options (replayable as setopt lines; exclude nounset which we enable locally)
  local zsh_opts
  zsh_opts=$(setopt 2>/dev/null | command grep -v '^nounset$' | command awk '{printf "builtin setopt %s 2>/dev/null || true\\n", $0}' || true)
  _emit_encoded "$zsh_opts" "ZSH_OPTS_B64"
  _log_timing "options"

  # Functions: dump all functions at once (much faster than individual processing)
  local all_functions
  all_functions=$(builtin typeset -f 2>/dev/null || true)
  _emit_encoded "$all_functions" "FUNCTIONS_B64"
  _log_timing "functions"

  # Aliases (regular, global, and suffix)
  {
    builtin alias -L 2>/dev/null || true
    builtin alias -gL 2>/dev/null || true
    builtin alias -sL 2>/dev/null || true
  }
  _log_timing "aliases"

  # Done
  _emit "# end of zsh state dump"
  _log_timing "finalize"
}
`;
/* harmony default export */
const dump_zsh_state = zshScript;
//# sourceMappingURL=dump_zsh_state.js.map
; // ../shell-exec/dist/zsh.js
var zsh_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var zsh_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
function getZshPath() {
  const shell = process.env.SHELL;
  if (shell?.includes("zsh")) {
    return shell;
  }
  return (0, dist /* findActualExecutable */.Ef)("zsh", []).cmd;
}
class ZshState {
  cwd;
  state;
  constructor(cwd, state) {
    this.cwd = cwd;
    this.state = state;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new ZshState(workingDirectory ?? this.cwd, this.state);
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = zsh_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("ZshState.execute")), false);
      const interactive = options?.interactive ?? false;
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const cwd = options?.workingDirectory ?? this.cwd;
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      let core = `builtin eval "$1"`;
      if (!interactive) {
        core += " < /dev/null";
      }
      const c = `snap=$(command cat <&3); builtin unsetopt aliases 2>/dev/null; builtin unalias -m '*' 2>/dev/null || true; ` + `builtin setopt extendedglob; ` + `builtin eval "$snap" && { builtin unsetopt nounset 2>/dev/null || true; builtin export PWD="$(builtin pwd)"; builtin setopt aliases 2>/dev/null; ${core}; }; ` + `COMMAND_EXIT_CODE=$?; dump_zsh_state >&4; builtin exit $COMMAND_EXIT_CODE`;
      const args = ["-o", "extendedglob", "-c", c, "--",
      // This separates options from positional arguments
      command];
      const child = spawnWithSignal(getZshPath(), args, {
        env,
        // Use 'ignore' for stdin (unless interactive) to prevent background processes
        // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
        stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe", "pipe", "pipe"],
        cwd
      }, options?.sandboxPolicy ?? {
        type: "insecure_none"
      }, options?.signal);
      let newState = "";
      // Handle stdout data
      child.stdout?.on("data", async data => {
        try {
          await iterable.write({
            type: "stdout",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle stderr data
      child.stderr?.on("data", async data => {
        try {
          await iterable.write({
            type: "stderr",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle process exit and errors
      child.on("error", error => {
        iterable.throw(error);
      });
      // NB: This is extremely Tricky. Data from stdio can come in after 'exit',
      // so instead of emitting 'exit' immediately, we store off the exit code
      // and emit it once 'close' is called.
      let exitCode = null;
      let closeTimeoutId = null;
      let hasEmittedExit = false;
      const emitExitAndClose = async () => {
        if (hasEmittedExit) return;
        hasEmittedExit = true;
        if (closeTimeoutId) {
          clearTimeout(closeTimeoutId);
          closeTimeoutId = null;
        }
        (0, context_dist /* reportEvent */.HF)(span.ctx, "exit");
        if (!options?.signal?.aborted) {
          const {
            cwd: nextCwd,
            rest
          } = splitPwdAndState(newState);
          if (nextCwd?.startsWith("/")) {
            this.state = rest;
            this.cwd = nextCwd;
          }
        }
        // Attempt to capture sandbox deny events (best-effort)
        if (options?.sandboxPolicy?.captureDenies ?? false) {
          try {
            const denyEvents = await sandbox_captureSandboxDenies(child);
            if (denyEvents && denyEvents.length > 0) {
              await iterable.write({
                type: "sandbox_denies",
                events: denyEvents
              });
            }
          } catch {}
        }
        try {
          await iterable.write({
            type: "exit",
            code: exitCode,
            data: ""
          });
          iterable.close();
        } catch (_error) {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
      };
      child.on("exit", (code, _signal) => {
        exitCode = code;
        // Start timeout to prevent hanging if 'close' never fires
        const timeout = options?.closeTimeout ?? 5000;
        if (timeout > 0) {
          closeTimeoutId = setTimeout(() => {
            console.warn(`[shell-exec] Close event did not fire within ${timeout}ms after exit. ` + `This may indicate a background process is holding file descriptors open. ` + `Proceeding anyway to prevent hang.`);
            emitExitAndClose();
          }, timeout);
        }
      });
      child.on("close", async () => {
        await emitExitAndClose();
      });
      const inFd = child.stdio[3];
      const outFd = child.stdio[4];
      inFd?.write(this.state);
      inFd?.end();
      outFd?.on("data", data => {
        newState += data.toString();
      });
      yield* iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      zsh_disposeResources(env_1);
    }
  }
}
async function initZshState(options) {
  const env = {
    ...process.env,
    ...types_SHELL_ENV_OVERRIDES,
    ...options?.env
  };
  const STATE_MARKER = "__CURSOR_STATE_MARKER__";
  const args = ["-o", "extendedglob", "-ilc", `${dump_zsh_state} builtin printf '${STATE_MARKER}\\n'; dump_zsh_state`];
  const child = spawnWithSignal(getZshPath(), args, {
    env,
    // Only provide stdio for 0/1/2 to avoid extra FDs being inherited by
    // background processes (e.g., ssh-agent). Write dump to stdout.
    stdio: ["ignore", "pipe", "pipe"],
    detached: true
  }, {
    type: "insecure_none"
  }, options?.signal);
  let fullOutput = "";
  child.stdout?.on("data", data => {
    fullOutput += data.toString();
  });
  await new Promise(resolve => {
    child.on("close", () => {
      resolve(undefined);
    });
  });
  const snapshot = parseShellStateOutput(fullOutput, STATE_MARKER);
  const {
    cwd,
    rest
  } = splitPwdAndState(snapshot);
  return new ZshState(cwd, rest);
}

//# sourceMappingURL=zsh.js.map
; // ../shell-exec/dist/dump_zsh_state_light.js
const dump_zsh_state_light_zshScript = `#!/usr/bin/env zsh

# Usage:
#   source dump_zsh_state_light.zsh
#   dump_zsh_state_light
# Or execute directly (captures a subshell's state):
#   ./dump_zsh_state_light.zsh

# Lightweight version that skips function tracking for better performance

# Define a function so sourcing won't alter caller state; emulate locally inside
function dump_zsh_state_light() {
  emulate -L zsh -o errreturn -o pipefail
  set -u


  # Helper to log timing, only if DUMP_ZSH_STATE_TIMING is set
  if [[ -n "\${DUMP_ZSH_STATE_TIMING:-}" ]]; then
    # Timing setup
    typeset start_time=\${EPOCHREALTIME}
    typeset step_start=\${EPOCHREALTIME}
    _log_timing() {
      typeset step_name="$1"
      typeset now=\${EPOCHREALTIME}
      typeset step_duration=$((now - step_start))
      typeset total_duration=$((now - start_time))
      builtin printf "[TIMING] %-20s: %6.3fs (total: %6.3fs)\n" "$step_name" "$step_duration" "$total_duration" >&2
      step_start=$now
    }
  else
    _log_timing() { :; }
  fi

  # Ensure parameter arrays are available
  builtin zmodload -F zsh/parameter p:parameters p:options p:aliases p:galiases p:saliases 2>/dev/null || true
  _log_timing "zmodload"

  # Helper to print a line to stdout
  _emit() {
    builtin print -r -- "$1"
  }

  # Helper to safely encode and emit unsafe values
  _emit_encoded() {
    local content="$1"
    local var_name="$2"
    if [[ -n "$content" ]]; then
      # Use here-document to avoid argument list length limits entirely
      builtin printf 'cursor_snap_%s=$(command base64 -d <<'''CURSOR_SNAP_EOF_%s'''\n' "$var_name" "$var_name"
      command base64 <<<"$content" | command tr -d '\n'
      builtin printf '\nCURSOR_SNAP_EOF_%s\n' "$var_name"
      builtin printf ')\n'
      builtin printf 'eval "$cursor_snap_%s"\n' "$var_name"
    fi
  }

  _log_timing "init"

  # Header
  _emit "$PWD"

  _emit "# zsh state dump (light) generated on $(command date +'%Y-%m-%d %H:%M:%S %z')"
  _log_timing "header"

  # Working directory
  _log_timing "working_dir"

  # Environment variables (exported)
  local env_vars
  env_vars=$(builtin typeset -xp 2>/dev/null || true)
  _emit_encoded "$env_vars" "ENV_VARS_B64"
  _log_timing "env_variables"

  # Options (replayable as setopt lines; exclude nounset which we enable locally)
  local zsh_opts
  zsh_opts=$(setopt 2>/dev/null | command grep -v '^nounset$' | command awk '{printf "builtin setopt %s 2>/dev/null || true\\n", $0}' || true)
  _emit_encoded "$zsh_opts" "ZSH_OPTS_B64"
  _log_timing "options"

  # SKIP FUNCTIONS - this is the key difference for performance

  # Aliases (regular, global, and suffix)
  {
    builtin alias -L 2>/dev/null || true
    builtin alias -gL 2>/dev/null || true
    builtin alias -sL 2>/dev/null || true
  }
  _log_timing "aliases"

  # Done
  _emit "# end of zsh state dump (light)"
  _log_timing "finalize"
}
`;
/* harmony default export */
const dump_zsh_state_light = dump_zsh_state_light_zshScript;
//# sourceMappingURL=dump_zsh_state_light.js.map
; // ../shell-exec/dist/zsh-light.js
var zsh_light_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var zsh_light_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
function zsh_light_getZshPath() {
  const shell = process.env.SHELL;
  if (shell?.includes("zsh")) {
    return shell;
  }
  return (0, dist /* findActualExecutable */.Ef)("zsh", []).cmd;
}
class ZshLightState {
  cwd;
  state;
  constructor(cwd, state) {
    this.cwd = cwd;
    this.state = state;
  }
  async getCwd() {
    return this.cwd;
  }
  clone(workingDirectory) {
    return new ZshLightState(workingDirectory ?? this.cwd, this.state);
  }
  async *execute(ctx, command, options) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = zsh_light_addDisposableResource(env_1, (0, context_dist /* createSpan */.VI)(ctx.withName("ZshLightState.execute")), false);
      const interactive = options?.interactive ?? false;
      const iterable = (0, dist /* createWritableIterable */.Jt)();
      const cwd = options?.workingDirectory ?? this.cwd;
      const env = {
        ...process.env,
        ...types_SHELL_ENV_OVERRIDES,
        ...options?.env
      };
      let core = `builtin eval "$1"`;
      if (!interactive) {
        core += " < /dev/null";
      }
      // Inject the dump_zsh_state_light function definition before each command
      // since we don't serialize functions, we need to redefine it every time
      const c = `snap=$(command cat <&3); builtin unsetopt aliases 2>/dev/null; builtin unalias -m '*' 2>/dev/null || true; ` + `builtin setopt extendedglob; ` + `${dump_zsh_state_light} ` + `builtin eval "$snap" && { builtin unsetopt nounset 2>/dev/null || true; builtin export PWD="$(builtin pwd)"; builtin setopt aliases 2>/dev/null; ${core}; }; ` + `COMMAND_EXIT_CODE=$?; dump_zsh_state_light >&4; builtin exit $COMMAND_EXIT_CODE`;
      const args = ["-o", "extendedglob", "-c", c, "--",
      // This separates options from positional arguments
      command];
      const child = spawnWithSignal(zsh_light_getZshPath(), args, {
        env,
        // Use 'ignore' for stdin (unless interactive) to prevent background processes
        // from inheriting an open stdin pipe, which would prevent the 'close' event from firing
        stdio: [interactive ? "pipe" : "ignore", "pipe", "pipe", "pipe", "pipe"],
        cwd
      }, options?.sandboxPolicy ?? {
        type: "insecure_none"
      }, options?.signal);
      let newState = "";
      // Handle stdout data
      child.stdout?.on("data", async data => {
        try {
          await iterable.write({
            type: "stdout",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle stderr data
      child.stderr?.on("data", async data => {
        try {
          await iterable.write({
            type: "stderr",
            data: data.toString()
          });
        } catch (_error) {
          // Iterable might be closed, ignore write errors
        }
      });
      // Handle process exit and errors
      child.on("error", error => {
        iterable.throw(error);
      });
      // NB: This is extremely Tricky. Data from stdio can come in after 'exit',
      // so instead of emitting 'exit' immediately, we store off the exit code
      // and emit it once 'close' is called.
      let exitCode = null;
      let closeTimeoutId = null;
      let hasEmittedExit = false;
      const emitExitAndClose = async () => {
        if (hasEmittedExit) return;
        hasEmittedExit = true;
        if (closeTimeoutId) {
          clearTimeout(closeTimeoutId);
          closeTimeoutId = null;
        }
        (0, context_dist /* reportEvent */.HF)(span.ctx, "exit");
        if (!options?.signal?.aborted) {
          const {
            cwd: nextCwd,
            rest
          } = splitPwdAndState(newState);
          if (nextCwd?.startsWith("/")) {
            this.state = rest;
            this.cwd = nextCwd;
          }
        }
        // Attempt to capture sandbox deny events (best-effort)
        if (options?.sandboxPolicy?.captureDenies ?? false) {
          try {
            const denyEvents = await sandbox_captureSandboxDenies(child);
            if (denyEvents && denyEvents.length > 0) {
              await iterable.write({
                type: "sandbox_denies",
                events: denyEvents
              });
            }
          } catch {}
        }
        try {
          await iterable.write({
            type: "exit",
            code: exitCode,
            data: ""
          });
          iterable.close();
        } catch (_error) {
          // Iterable might be closed, ignore write errors
          iterable.close();
        }
      };
      child.on("exit", (code, _signal) => {
        exitCode = code;
        // Start timeout to prevent hanging if 'close' never fires
        const timeout = options?.closeTimeout ?? 5000;
        if (timeout > 0) {
          closeTimeoutId = setTimeout(() => {
            console.warn(`[shell-exec] Close event did not fire within ${timeout}ms after exit. ` + `This may indicate a background process is holding file descriptors open. ` + `Proceeding anyway to prevent hang.`);
            emitExitAndClose();
          }, timeout);
        }
      });
      child.on("close", async () => {
        await emitExitAndClose();
      });
      const inFd = child.stdio[3];
      const outFd = child.stdio[4];
      inFd?.write(this.state);
      inFd?.end();
      outFd?.on("data", data => {
        newState += data.toString();
      });
      yield* iterable;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      zsh_light_disposeResources(env_1);
    }
  }
}
async function initZshLightState(options) {
  const env = {
    ...process.env,
    ...types_SHELL_ENV_OVERRIDES,
    ...options?.env
  };
  const STATE_MARKER = "__CURSOR_STATE_MARKER__";
  const args = ["-o", "extendedglob", "-ilc", `${dump_zsh_state_light} builtin printf '${STATE_MARKER}\\n'; dump_zsh_state_light`];
  const child = spawnWithSignal(zsh_light_getZshPath(), args, {
    env,
    // Only provide stdio for 0/1/2 to avoid extra FDs being inherited by
    // background processes (e.g., ssh-agent). Write dump to stdout.
    stdio: ["ignore", "pipe", "pipe"],
    detached: true
  }, {
    type: "insecure_none"
  }, options?.signal);
  let fullOutput = "";
  child.stdout?.on("data", data => {
    fullOutput += data.toString();
  });
  await new Promise(resolve => {
    child.on("close", () => {
      resolve(undefined);
    });
  });
  const snapshot = parseShellStateOutput(fullOutput, STATE_MARKER);
  const {
    cwd,
    rest
  } = splitPwdAndState(snapshot);
  return new ZshLightState(cwd, rest);
}

//# sourceMappingURL=zsh-light.js.map
// EXTERNAL MODULE: ../../node_modules/.pnpm/ignore@7.0.5/node_modules/ignore/index.js
var ignore = __webpack_require__("../../node_modules/.pnpm/ignore@7.0.5/node_modules/ignore/index.js");
; // ../shell-exec/dist/test-utils.js

// Type assertion to help TypeScript understand the ignore module
const test_utils_ignore = ignore;
// Helper function to collect all events from an async iterable
async function collectEvents(iterable) {
  const events = [];
  for await (const event of iterable) {
    events.push(event);
  }
  return events;
}
// Helper function to check if a shell is available
function isShellAvailable(shell) {
  try {
    const {
      execFileSync
    } = require("node:child_process");
    execFileSync("which", [shell], {
      stdio: "ignore"
    });
    return true;
  } catch {
    return false;
  }
}
// Helper to skip test if shell is not available
function skipIfShellUnavailable(shell) {
  if (!isShellAvailable(shell)) {
    console.log(`Skipping test - ${shell} not available`);
    return;
  }
}
/**
 * Helper function to create an IgnoreMapping from gitignore-style patterns
 * @param patterns Array of gitignore-style patterns
 * @param baseDir Base directory to apply the patterns to
 * @returns IgnoreMapping with the patterns applied to the base directory
 */
function createIgnoreMapping(patterns, baseDir) {
  if (!patterns || patterns.length === 0) {
    return {};
  }
  // Filter out empty strings, whitespace-only strings, and comments
  const validPatterns = patterns.map(pattern => pattern.trim()).filter(pattern => pattern !== "" && !pattern.startsWith("#"));
  if (validPatterns.length === 0) {
    return {};
  }
  // Create an ignore instance with the patterns
  const ignoreInstance = test_utils_ignore().add(validPatterns);
  return {
    [baseDir]: ignoreInstance
  };
}
//# sourceMappingURL=test-utils.js.map
; // ../shell-exec/dist/index.js

// Re-export core functionality

/**
 * Checks if a command exists in the PATH.
 */
function commandExists(command) {
  try {
    return (0, dist /* findActualExecutable */.Ef)(command, []).cmd !== command;
  } catch (_e) {
    return false;
  }
}
function getSuggestedShell(userTerminalHint) {
  if (userTerminalHint === KnownShellExecutor.ZshLight) {
    return KnownShellExecutor.ZshLight;
  }
  const shell = userTerminalHint || process.env.SHELL || "";
  const isWindows = "darwin" === "win32";
  // NB: We normally would not want to support this, but Git Bash is quite popular
  // so we'll try to make it work anyways. We don't support more obscure
  // variants of Bash like Cygwin.
  const isGitBash = /git.*bash\.exe$/i.test(shell) || /program.*git.*bin.*bash\.exe$/i.test(shell);
  const bashIsOkay = !isWindows || isGitBash;
  // Check if user's shell is a specific type
  if (shell.includes("zsh")) {
    return KnownShellExecutor.Zsh;
  } else if (shell.includes("bash") && bashIsOkay) {
    return KnownShellExecutor.Bash;
  } else if (shell.includes("pwsh") || shell.includes("powershell")) {
    return KnownShellExecutor.PowerShell;
  } else {
    // On Windows, prefer PowerShell
    if (isWindows) {
      if (commandExists("pwsh") || commandExists("powershell")) {
        return KnownShellExecutor.PowerShell;
      }
    }
    // Check if shells are available in PATH
    if (commandExists("zsh")) {
      return KnownShellExecutor.Zsh;
    } else if (commandExists("bash") && bashIsOkay) {
      return KnownShellExecutor.Bash;
    } else if (commandExists("pwsh") || commandExists("powershell")) {
      return KnownShellExecutor.PowerShell;
    } else {
      // Fall back to naive executor
      return KnownShellExecutor.Naive;
    }
  }
}
/**
 * Creates a default terminal executor based on the user's shell.
 * If the user's shell is zsh, returns a LazyTerminalExecutor with zsh state.
 * If the user's shell is bash, returns a LazyTerminalExecutor with bash state.
 * Otherwise, checks if zsh or bash are available in PATH before falling back to NaiveTerminalExecutor.
 *
 * Policies are provided per-execution via options; the default executor is policy-agnostic.
 */
function createDefaultTerminalExecutor(options) {
  const suggestedShell = getSuggestedShell(options?.userTerminalHint ?? "");
  switch (suggestedShell) {
    case KnownShellExecutor.Zsh:
      return new LazyTerminalExecutor(initZshState(options));
    case KnownShellExecutor.Bash:
      return new LazyTerminalExecutor(initBashState(options));
    case KnownShellExecutor.PowerShell:
      return new LazyTerminalExecutor(initPowerShellState());
    case KnownShellExecutor.ZshLight:
      return new LazyTerminalExecutor(initZshLightState(options));
    default:
      return createNaiveTerminalExecutor(options);
  }
}
//# sourceMappingURL=index.js.map

/***/