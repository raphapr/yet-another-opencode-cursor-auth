const execFilePromise = (0, external_node_util_.promisify)(external_node_child_process_.execFile);
/**
 * Finds the root directory of the git repository containing the given path.
 * Returns null if not in a git repository.
 */
async function findGitRoot(startPath) {
  try {
    const {
      stdout
    } = await execFilePromise("git", ["rev-parse", "--show-toplevel"], {
      cwd: startPath
    });
    return stdout.trim();
  } catch (_error) {
    // Not in a git repository or git command failed
    return null;
  }
}
/**
 * Gets the remote origin URL for a git repository.
 * Returns undefined if no remote origin is configured.
 */
async function getGitRemoteUrl(gitRoot) {
  try {
    const {
      stdout
    } = await execFilePromise("git", ["config", "--get", "remote.origin.url"], {
      cwd: gitRoot
    });
    return stdout.trim();
  } catch (_error) {
    // No remote origin configured or git command failed
    return undefined;
  }
}
/**
 * Normalize a remote URL into a stable host/path form, e.g. github.com/owner/repo
 * Handles both URL-style and SCP-style git remotes.
 */
function toHostPath(rawUrl) {
  let url = rawUrl.trim();
  if (url.startsWith("git@")) {
    url = url.replace(/^git@/, "").replace(":", "/");
  }
  if (url.startsWith("ssh://git@")) {
    url = url.replace(/^ssh:\/\/git@/, "");
  }
  url = url.replace(/^https?:\/\//i, "");
  url = url.replace(/\.git$/i, "");
  return url;
}
// Globs to skip when scanning for .gitignore / .cursorignore files.
// Mirrors common heavy or tool-generated directories similar to DIRS_TO_SKIP in the VS Code service.
const DEFAULT_GLOB_IGNORE_DIRS = ["**/node_modules/**", "**/.git/**", "**/.turbo/**", "**/.next/**", "**/.cache/**", "**/.pnpm/**", "**/.yarn/**", "**/dist/**", "**/build/**", "**/out/**", "**/target/**", "**/.vscode/**", "**/.idea/**", "**/venv/**", "**/__pycache__/**", "**/logs/**", "**/tmp/**", "**/temp/**"];
//# sourceMappingURL=common.js.map