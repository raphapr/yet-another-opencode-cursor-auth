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