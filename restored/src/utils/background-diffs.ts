function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function _getStringField(obj, key) {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}
function _getFirstArray(obj, keys) {
  for (const k of keys) {
    const v = obj[k];
    if (Array.isArray(v)) return v;
  }
  return [];
}
/**
 * Convert Background Composer optimized diffs into the UI's FileChange[] shape.
 *
 * Notes (assumptions):
 * - Prefer a canonical shape of: { files: [{ path, before, after }] }
 * - Gracefully tolerate alternate field names that may appear in older/newer versions
 *   without guessing or coercing non-strings.
 */
function mapBackgroundDiffsToFileChanges(resp) {
  var _a, _b, _c, _d, _e;
  if (!isRecord(resp)) return [];
  // Collect top-level diffs (not in submodules)
  const topLevelDiffs = (_c = (_b = (_a = resp.diff) === null || _a === void 0 ? void 0 : _a.diffs) === null || _b === void 0 ? void 0 : _b.map(d => {
    var _a, _b, _c, _d;
    return {
      path: (_b = (_a = d.to) !== null && _a !== void 0 ? _a : d.from) !== null && _b !== void 0 ? _b : "",
      before: (_c = d.beforeFileContents) !== null && _c !== void 0 ? _c : undefined,
      after: (_d = d.afterFileContents) !== null && _d !== void 0 ? _d : undefined
    };
  })) !== null && _c !== void 0 ? _c : [];
  // Collect submodule diffs, prefixing with submodule relative path
  const submoduleDiffs = (_e = (_d = resp.submoduleDiffs) === null || _d === void 0 ? void 0 : _d.flatMap(submod => {
    var _a;
    if (!((_a = submod.diff) === null || _a === void 0 ? void 0 : _a.diffs) || typeof submod.relativePath !== "string" || submod.relativePath.length === 0) {
      return [];
    }
    return submod.diff.diffs.map(d => {
      var _a, _b, _c, _d;
      // Ensure no double slash, handle leading/trailing slashes
      const subPath = (_b = (_a = d.to) !== null && _a !== void 0 ? _a : d.from) !== null && _b !== void 0 ? _b : "";
      const prefix = submod.relativePath.replace(/\/+$/, "");
      const filePath = subPath.startsWith("/") ? `${prefix}${subPath}` : `${prefix}/${subPath}`;
      return {
        path: filePath,
        before: (_c = d.beforeFileContents) !== null && _c !== void 0 ? _c : undefined,
        after: (_d = d.afterFileContents) !== null && _d !== void 0 ? _d : undefined
      };
    });
  })) !== null && _e !== void 0 ? _e : [];
  return [...topLevelDiffs, ...submoduleDiffs];
}