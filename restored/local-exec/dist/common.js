function untildify(path) {
  return path.replace(/^~(?=$|\/|\\)/, (0, external_node_os_.homedir)());
}
const resolvePath = (path, basePath) => {
  const untildified = untildify(path);
  // If a base path is provided and the path is not absolute, resolve relative to base path
  if (basePath && !(0, external_node_path_.isAbsolute)(untildified)) {
    return (0, external_node_path_.resolve)(basePath, untildified);
  }
  return (0, external_node_path_.resolve)(untildified);
};
/**
 * Resolve a path to its real path, following symlinks.
 * Falls back to the resolved path if realpath fails (e.g., broken symlink, permission denied).
 */
const resolveRealPath = async path => {
  const resolved = resolvePath(path);
  try {
    return await (0, promises_.realpath)(resolved);
  } catch {
    // If realpath fails (broken symlink, permission denied, etc.), fall back to resolved path
    return resolved;
  }
};
//# sourceMappingURL=common.js.map