/**
 * Path matching utilities for checking "is this a X file?" patterns.
 * All functions handle both Windows and Unix paths by operating on path component arrays.
 *
 * New structure: ~/.cursor/projects/{workspaceId}/terminals|agent-tools|agent-notes/
 */
/**
 * Check if a path is absolute on any platform.
 * Handles Windows drive letters even when running on macOS/Linux (e.g., SSH to Windows).
 *
 * @param filePath - Path to check
 * @returns true if the path is absolute on any platform
 *
 * Examples:
 * - `/usr/local` -> true (Unix)
 * - `C:/Users/file.txt` -> true (Windows)
 * - `c:\Windows\System32` -> true (Windows)
 * - `\\server\share` -> true (Windows UNC)
 * - `./relative/path` -> false
 * - `C:` -> false (no slash, not absolute)
 */
function isAbsolutePath(filePath) {
  // Unix absolute paths: start with /
  if (filePath.startsWith("/")) {
    return true;
  }
  // Windows absolute paths: single drive letter + colon + slash
  if (/^[a-zA-Z]:[\\/]/.test(filePath)) {
    return true;
  }
  // Windows UNC paths: \\server\share
  if (filePath.startsWith("\\\\")) {
    return true;
  }
  return false;
}
/**
 * Split a path into components, handling both / and \ separators.
 * Removes empty components (from leading/trailing slashes or double slashes).
 */
function splitPath(path) {
  return path.split(/[/\\]/).filter(c => c);
}
/**
 * Check if path contains the pattern: .cursor/projects/{workspaceId}/targetDir
 * Returns match info including workspace ID and remaining path, or null if not found.
 */
function matchProjectSubdir(path, targetDir) {
  const parts = splitPath(path);
  // Look for .cursor/projects/{workspaceId}/targetDir pattern
  for (let i = 0; i < parts.length - 2; i++) {
    if (parts[i] === ".cursor" && parts[i + 1] === "projects" && parts[i + 3] === targetDir) {
      return {
        workspaceId: parts[i + 2],
        remainingPath: parts.slice(i + 4)
      };
    }
  }
  return null;
}
/**
 * Check if path is within a Cursor project terminals directory.
 * Path must end with ~/.cursor/projects/{workspaceId}/terminals/
 */
function isCursorTerminalsDirectory(path) {
  const match = matchProjectSubdir(path, "terminals");
  return match !== null && match.remainingPath.length === 0;
}
/**
 * Check if this is an agent tool output file.
 * Must be a .txt file directly in ~/.cursor/projects/{workspaceId}/agent-tools/ directory.
 */
function isAgentToolOutputFile(filePath) {
  const match = matchProjectSubdir(filePath, "agent-tools");
  // Must be direct child (only one component after agent-tools) and end with .txt
  return match !== null && match.remainingPath.length === 1 && match.remainingPath[0].endsWith(".txt");
}
/**
 * Extract the terminal ID from any terminal file path (internal or external).
 * Returns an object with the ID, isExternal, and isInternal flags.
 * Returns null if the path is not a valid terminal file.
 *
 * Example:
 * - `~/.cursor/projects/{workspaceId}/terminals/123.txt` → { id: 123, isExternal: false, isInternal: true }
 * - `~/.cursor/projects/{workspaceId}/terminals/ext-456.txt` → { id: 456, isExternal: true, isInternal: false }
 * - `other/file.txt` → null
 */
function extractTerminalId(filePath) {
  const match = matchProjectSubdir(filePath, "terminals");
  // Must be direct child of terminals directory
  if (!match || match.remainingPath.length !== 1) {
    return null;
  }
  const fileName = match.remainingPath[0];
  // Match: (ext-)?(\d+).txt
  const fileMatch = /^(ext-)?(\d+)\.txt$/.exec(fileName);
  if (!fileMatch) return null;
  const isExternal = fileMatch[1] !== undefined;
  const id = Number.parseInt(fileMatch[2], 10);
  if (Number.isNaN(id)) return null;
  return {
    id,
    isExternal,
    isInternal: !isExternal
  };
}
//# sourceMappingURL=path-matchers.js.map