function getConfigDir() {
  // Allow explicit override
  const override = process.env.CURSOR_CONFIG_DIR;
  if (override === null || override === void 0 ? void 0 : override.trim()) return override;
  // Respect XDG on *nix if present
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg === null || xdg === void 0 ? void 0 : xdg.trim()) return (0, external_node_path_.join)(xdg, "cursor");
  // Fallback: ~/.cursor
  return (0, external_node_path_.join)((0, external_node_os_.homedir)(), ".cursor");
}
function getDataDir() {
  // Allow explicit override
  const override = process.env.CURSOR_DATA_DIR;
  if (override === null || override === void 0 ? void 0 : override.trim()) return override;
  // Default: ~/.cursor
  return (0, external_node_path_.join)((0, external_node_os_.homedir)(), ".cursor");
}
function getProjectsDir() {
  return (0, external_node_path_.join)(getDataDir(), "projects");
}
function getProjectDir(projectPath) {
  return (0, external_node_path_.join)(getProjectsDir(), (0, utils_dist /* slugifyPath */.r_)(projectPath));
}
const HASH_LENGTH = 7; // SHA-256 first 7 characters
const MAX_SOCKET_PATH_LENGTH = 104; // max socket path length on MacOS
const WINDOWS_SOCK_LENGTH = "worker.sock".length;
const MAX_PREFIX_LENGTH_BEFORE_HASH = MAX_SOCKET_PATH_LENGTH - 1 - HASH_LENGTH - 1 - WINDOWS_SOCK_LENGTH; // full socket path = prefix + "-" + hash + "/" + "worker.sock"
const MAX_FULL_PATH_LENGTH = MAX_SOCKET_PATH_LENGTH - WINDOWS_SOCK_LENGTH - 1; // need to apped "/worker.sock" to the path
function getProjectDirForSocketPath(projectPath) {
  let projectsDir = getProjectsDir();
  if (projectsDir.length > MAX_PREFIX_LENGTH_BEFORE_HASH) {
    // Fall back to ~/.cursor so we don't truncate the project directory
    projectsDir = getDataDir();
    if (projectsDir.length > MAX_PREFIX_LENGTH_BEFORE_HASH) {
      // wtf, this person's home directory is super long!
      // Just try to write to /tmp/.cursor I guess
      // This will probably (almost) never happen
      projectsDir = "/tmp/.cursor";
    }
  }
  const fullPath = (0, external_node_path_.join)(projectsDir, (0, utils_dist /* slugifyPath */.r_)(projectPath));
  if (fullPath.length > MAX_FULL_PATH_LENGTH) {
    const hash = (0, external_node_crypto_.createHash)("sha256").update(fullPath).digest("hex").substring(0, HASH_LENGTH);
    const prefix = fullPath.substring(0, Math.min(MAX_PREFIX_LENGTH_BEFORE_HASH, fullPath.length));
    return `${prefix}-${hash}`;
  }
  return fullPath;
}
function getConfigFilePath() {
  return (0, external_node_path_.join)(getConfigDir(), "cli-config.json");
}