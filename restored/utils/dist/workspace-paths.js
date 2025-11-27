/** Base directory for project-specific files: .cursor/projects */
const CURSOR_PROJECTS_DIR = ".cursor/projects";
/** Slugify a path: /Users/wilson/my-project -> Users-wilson-my-project */
function slugifyPath(path) {
  return path.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
/** Get full project directory path: ~/.cursor/projects/{slug}/ */
function getProjectPath(homeDir, workspacePath) {
  const dirName = slugifyPath(workspacePath);
  return `${homeDir}/${CURSOR_PROJECTS_DIR}/${dirName}`;
}
//# sourceMappingURL=workspace-paths.js.map