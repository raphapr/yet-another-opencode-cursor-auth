const isWindows = "darwin" === "win32";
const runDownPathCache = new LRUCache({
  max: 512
});
/**
 * stat a file but don't throw if it doesn't exist
 *
 * @param  {string} file The path to a file
 * @return {Stats}       The stats structure
 *
 * @private
 */
function statSyncNoException(file) {
  try {
    return external_node_fs_.statSync(file);
  } catch (_a) {
    return null;
  }
}
/**
 * Search PATH to see if a file exists in any of the path folders.
 *
 * @param  {string} exe The file to search for
 * @return {string}     A fully qualified path, or the original path if nothing
 *                      is found
 *
 * @private
 */
function runDownPath(exe, pathMustMatch) {
  // NB: Windows won't search PATH looking for executables in spawn like
  // Posix does
  // Files with any directory path don't get this applied
  if (exe.match(/[\\/]/)) {
    return exe;
  }
  const cacheKey = pathMustMatch ? `${exe}\0${pathMustMatch.source}\0${pathMustMatch.flags}` : exe;
  const cached = runDownPathCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }
  const target = external_node_path_.join(".", exe);
  if (statSyncNoException(target)) {
    // XXX: Some very Odd programs decide to use args[0] as a parameter
    // to determine what to do, and also symlink themselves, so we can't
    // use realpathSync here like we used to
    runDownPathCache.set(cacheKey, target);
    return target;
  }
  const haystack = process.env.PATH.split(isWindows ? ";" : ":");
  for (const p of haystack) {
    const needle = external_node_path_.join(p, exe);
    if (statSyncNoException(needle) && (!pathMustMatch || pathMustMatch.test(needle))) {
      // NB: Same deal as above
      runDownPathCache.set(cacheKey, needle);
      return needle;
    }
  }
  runDownPathCache.set(cacheKey, exe);
  return exe;
}
/**
 * Finds the actual executable and parameters to run on Windows. This method
 * mimics the POSIX behavior of being able to run scripts as executables by
 * replacing the passed-in executable with the script runner, for PowerShell,
 * CMD, and node scripts.
 *
 * This method also does the work of running down PATH, which spawn on Windows
 * also doesn't do, unlike on POSIX.
 *
 * @param  {string} exe           The executable to run
 * @param  {string[]} args   The arguments to run
 *
 * @return {Object}               The cmd and args to run
 * @property {string} cmd         The command to pass to spawn
 * @property {string[]} args The arguments to pass to spawn
 */
function findActualExecutable(exe, args, pathMustMatch) {
  // POSIX can just execute scripts directly, no need for silly goosery
  if (true) {
    return {
      cmd: runDownPath(exe),
      args: args
    };
  }
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // Dunno lol
  // removed by dead control flow
  {}
}
//# sourceMappingURL=find-executable.js.map