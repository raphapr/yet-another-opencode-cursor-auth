class LazyIgnoreService {
  constructor(rgPath, teamSettingsService, rootDirectories) {
    this.ignoreServicePromise = LocalIgnoreService.init(rootDirectories ?? [process.cwd()], rgPath, teamSettingsService);
  }
  isIgnoredByAny(filePath) {
    return this.ignoreServicePromise.then(x => x.isIgnoredByAny(filePath));
  }
  isGitIgnored(filePath) {
    return this.ignoreServicePromise.then(x => x.isGitIgnored(filePath));
  }
  isCursorIgnored(filePath) {
    return this.ignoreServicePromise.then(x => x.isCursorIgnored(filePath));
  }
  isRepoBlocked(filePath) {
    return this.ignoreServicePromise.then(x => x.isRepoBlocked(filePath));
  }
  listCursorIgnoreFilesByRoot(root) {
    return this.ignoreServicePromise.then(x => x.listCursorIgnoreFilesByRoot(root));
  }
  getCursorIgnoreMapping() {
    return this.ignoreServicePromise.then(x => x.getCursorIgnoreMapping());
  }
  getGitIgnoreMapping() {
    return this.ignoreServicePromise.then(x => x.getGitIgnoreMapping());
  }
}
// NB: Not exactly the best metric but it's a good approximation of
// how beefy their computer is - clamp between [1, NR_CPUS/2, 8]
const maxConcurrentSearches = Math.min(8, Math.max(1, Math.floor(external_node_os_.cpus().length / 2)));
class LocalIgnoreService {
  constructor(gitIgnoreMapping, cursorIgnoreMapping, teamSettingsService) {
    this.gitIgnoreMapping = gitIgnoreMapping;
    this.cursorIgnoreMapping = cursorIgnoreMapping;
    this.teamSettingsService = teamSettingsService;
    this.gitIgnoreCache = new utils_dist /* LRUCache */.qK({
      max: 2000
    });
    this.cursorIgnoreCache = new utils_dist /* LRUCache */.qK({
      max: 2000
    });
    this.gitRootCache = new utils_dist /* LRUCache */.qK({
      max: 1000
    });
    this.gitRemoteUrlCache = new utils_dist /* LRUCache */.qK({
      max: 200
    });
    this.hasGitDirCache = new utils_dist /* LRUCache */.qK({
      max: 1000
    });
    this.rootDirectory = process.cwd();
  }
  /**
   * Check if there are no workspace folders (indicated by empty ignore mappings).
   * When no workspace folders exist, the ignore mappings remain empty after initialization.
   */
  hasNoWorkspaceFolders() {
    return Object.keys(this.gitIgnoreMapping).length === 0 && Object.keys(this.cursorIgnoreMapping).length === 0;
  }
  static async init(rootDirectories, rgPath, teamSettingsService) {
    const gitIgnoreMapping = {};
    const cursorIgnoreMapping = {};
    // Only initialize if we're in a git repository (any parent directory has .git folder)
    const reposInGitRoots = await Promise.all(rootDirectories.map(root => findGitRoot(root))).then(roots => roots.filter(root => root !== null));
    if (reposInGitRoots.length > 0) {
      await Promise.all([teamSettingsService ? teamSettingsService.getTeamRepos() : Promise.resolve(undefined), LocalIgnoreService.initializeIgnoreMapping(reposInGitRoots, ".gitignore", gitIgnoreMapping, rgPath), LocalIgnoreService.initializeIgnoreMapping(reposInGitRoots, ".cursorignore", cursorIgnoreMapping, rgPath)]);
    }
    return new LocalIgnoreService(gitIgnoreMapping, cursorIgnoreMapping, teamSettingsService);
  }
  static async preloadHierarchy(startPath, ignoreFileName, mapping, processedDirs) {
    let currentPath = resolvePath(startPath);
    const rootPath = (0, external_node_path_.parse)(currentPath).root;
    // Walk up the directory tree from the workspace root
    while (currentPath !== rootPath) {
      // Skip if we've already processed this directory
      if (processedDirs?.has(currentPath)) {
        const parentPath = (0, external_node_path_.dirname)(currentPath);
        if (parentPath === currentPath) break; // Reached root
        currentPath = parentPath;
        continue;
      }
      if (mapping[currentPath] === undefined) {
        await LocalIgnoreService.handleHierarchyIgnore(currentPath, ignoreFileName, mapping);
      }
      // Mark as processed
      processedDirs?.add(currentPath);
      const parentPath = (0, external_node_path_.dirname)(currentPath);
      if (parentPath === currentPath) break; // Reached root
      currentPath = parentPath;
    }
  }
  static async handleHierarchyIgnore(dir, ignoreFileName, mapping) {
    const ignoreFilePath = (0, external_node_path_.join)(dir, ignoreFileName);
    try {
      await (0, promises_.access)(ignoreFilePath, promises_.constants.F_OK);
      const content = await readText(ignoreFilePath);
      const ignoreRules = LocalIgnoreService.parseIgnoreRules(content);
      mapping[dir] = ignore().add(ignoreRules);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, mark as checked so we don't check again
        mapping[dir] = {
          __noIgnore: true
        };
      } else {
        console.error(`Error reading ${ignoreFileName} file at ${ignoreFilePath}:`, error);
        mapping[dir] = {
          __noIgnore: true
        };
      }
    }
  }
  static async initializeIgnoreMapping(rootDirectories, ignoreFileName, mapping, rgPath) {
    try {
      // Dedupe root directories - remove any root that is inside another root
      const deduplicatedRoots = LocalIgnoreService.deduplicateRootDirectories(rootDirectories);
      // Find ignore files in all roots
      const ignoreFiles = await LocalIgnoreService.promiseQueue.enqueueList(deduplicatedRoots, root => LocalIgnoreService.findFilesWithRipgrep(root, ignoreFileName, rgPath));
      const allIgnoreFiles = Array.from(ignoreFiles.values()).flat();
      // Process all ignore files
      await Promise.all(allIgnoreFiles.map(async filePath => {
        try {
          const content = await readText(filePath);
          const ignoreRules = LocalIgnoreService.parseIgnoreRules(content);
          const ignorePath = (0, external_node_path_.dirname)(filePath);
          mapping[ignorePath] = ignore().add(ignoreRules);
        } catch (error) {
          console.error(`Error processing ${ignoreFileName} file at ${filePath}:`, error);
        }
      }));
      // Preload hierarchy for each root, avoiding duplicate work
      const processedDirs = new Set();
      for (const root of deduplicatedRoots) {
        await LocalIgnoreService.preloadHierarchy(root, ignoreFileName, mapping, processedDirs);
      }
    } catch (error) {
      console.error(`Error initializing ignore mapping for ${ignoreFileName}:`, error);
    }
  }
  static async findFilesWithRipgrep(rootDirectory, fileName, rgPath) {
    const files = [];
    for await (const path of ripwalk({
      rgPath,
      root: rootDirectory,
      includeGlobs: [`**/${fileName}`],
      excludeGlobs: DEFAULT_GLOB_IGNORE_DIRS
    })) {
      files.push((0, external_node_path_.join)(rootDirectory, path));
    }
    return files;
  }
  async handleManualLookupWhenNoWorkspaceDirs(absolutePath, ignoreFileName) {
    let cur = (0, external_node_path_.dirname)(absolutePath);
    while (true) {
      const ignoreFilePath = (0, external_node_path_.join)(cur, ignoreFileName);
      let ignoreRules;
      try {
        const content = await readText(ignoreFilePath);
        ignoreRules = ignore().add(LocalIgnoreService.parseIgnoreRules(content));
      } catch {}
      if (ignoreRules) {
        const testResult = ignoreRules.test((0, external_node_path_.relative)(cur, absolutePath));
        if (testResult.ignored) return true;
        if (testResult.unignored) return false;
      }
      const parentPath = (0, external_node_path_.dirname)(cur);
      if (parentPath === cur) break; // Reached root
      cur = parentPath;
    }
    return false;
  }
  async isIgnoredByAny(filePath) {
    const [gitIgnored, cursorIgnored, repoBlocked] = await Promise.all([this.isGitIgnored(filePath), this.isCursorIgnored(filePath), this.isRepoBlocked(filePath)]);
    return gitIgnored || cursorIgnored || repoBlocked;
  }
  async isGitIgnored(filePath) {
    const absolutePath = resolvePath(filePath);
    if (this.hasNoWorkspaceFolders()) {
      return this.handleManualLookupWhenNoWorkspaceDirs(absolutePath, ".gitignore");
    }
    // Check cache first
    const cached = this.gitIgnoreCache.get(absolutePath);
    if (cached !== undefined) {
      return cached;
    }
    // Check if we need to populate hierarchy for this path
    await this.populateHierarchyIfNeeded(absolutePath, ".gitignore", this.gitIgnoreMapping);
    const result = this.checkIgnored(absolutePath, this.gitIgnoreMapping);
    this.gitIgnoreCache.set(absolutePath, result);
    return result;
  }
  async isCursorIgnored(filePath) {
    const absolutePath = resolvePath(filePath);
    if (this.hasNoWorkspaceFolders()) {
      return this.handleManualLookupWhenNoWorkspaceDirs(absolutePath, ".cursorignore");
    }
    // Check cache first
    const cached = this.cursorIgnoreCache.get(absolutePath);
    if (cached !== undefined) {
      return cached;
    }
    // Check if we need to populate hierarchy for this path
    await this.populateHierarchyIfNeeded(absolutePath, ".cursorignore", this.cursorIgnoreMapping);
    const result = this.checkIgnored(absolutePath, this.cursorIgnoreMapping);
    this.cursorIgnoreCache.set(absolutePath, result);
    return result;
  }
  async populateHierarchyIfNeeded(filePath, ignoreFileName, mapping) {
    let currentPath = (0, external_node_path_.dirname)(resolvePath(filePath));
    const toAdd = [];
    const rootPath = (0, external_node_path_.parse)(currentPath).root;
    // Walk up the directory tree
    while (currentPath !== rootPath) {
      // Skip if we're still within the workspace
      if (currentPath.startsWith(this.rootDirectory)) {
        currentPath = (0, external_node_path_.dirname)(currentPath);
        continue;
      }
      // If already processed, we can stop
      if (mapping[currentPath] !== undefined) {
        break;
      }
      toAdd.push(currentPath);
      const parentPath = (0, external_node_path_.dirname)(currentPath);
      if (parentPath === currentPath) break; // Reached root
      currentPath = parentPath;
    }
    // Process any new directories we found
    if (toAdd.length > 0) {
      await LocalIgnoreService.promiseQueue.enqueueList(toAdd, dir => LocalIgnoreService.handleHierarchyIgnore(dir, ignoreFileName, mapping));
      // Clear the appropriate cache
      if (ignoreFileName === ".gitignore") {
        this.gitIgnoreCache.clear();
      } else {
        this.cursorIgnoreCache.clear();
      }
    }
  }
  checkIgnored(absolutePath, mapping) {
    // Check each ignore mapping to see if the file should be ignored
    for (const [ignorePath, ignoreInstance] of Object.entries(mapping)) {
      if (!absolutePath.startsWith(ignorePath)) {
        continue;
      }
      if (!this.isIgnoreInstance(ignoreInstance)) {
        continue;
      }
      const relativePath = (0, external_node_path_.relative)(ignorePath, absolutePath);
      // Skip if relativePath is empty (checking the directory that contains the ignore file itself)
      if (relativePath === "") {
        continue;
      }
      // The `ignore` library's test method tells us if the path is ignored
      const testResult = ignoreInstance.test(relativePath);
      if (testResult.ignored && !testResult.unignored) {
        return true;
      }
    }
    return false;
  }
  async listCursorIgnoreFilesByRoot(root) {
    const ignoreFiles = [];
    for (const [base, instance] of Object.entries(this.cursorIgnoreMapping)) {
      if (!this.isIgnoreInstance(instance)) {
        continue;
      }
      if (!base.startsWith(root)) {
        continue;
      }
      ignoreFiles.push((0, external_node_path_.join)(base, ".cursorignore"));
    }
    return ignoreFiles;
  }
  async getCursorIgnoreMapping() {
    // The mapping is already fully populated during initialization
    // since ignoreServicePromise waits for complete init() completion
    // Return a copy of the mapping to prevent external modifications
    return {
      ...this.cursorIgnoreMapping
    };
  }
  async getGitIgnoreMapping() {
    return {
      ...this.gitIgnoreMapping
    };
  }
  isIgnoreInstance(instance) {
    return "ignores" in instance && typeof instance.ignores === "function";
  }
  static deduplicateRootDirectories(roots) {
    // Resolve all paths to absolute paths
    const resolvedRoots = roots.map(root => resolvePath(root));
    // Sort by length (shorter paths first) to efficiently check containment
    const sortedRoots = [...resolvedRoots].sort((a, b) => a.length - b.length);
    const deduplicated = [];
    for (const root of sortedRoots) {
      // Check if this root is inside any already-added root
      const isContained = deduplicated.some(existing => root.startsWith(`${existing}/`) || root.startsWith(`${existing}\\`));
      if (!isContained) {
        deduplicated.push(root);
      }
    }
    return deduplicated;
  }
  static parseIgnoreRules(raw) {
    // Strip Windows line endings, leading whitespace and comment lines (starting with '#').
    return raw.split("\n").map(line => line.replace(/\r$/, "").trimStart()).filter(line => line !== "" && !line.startsWith("#"));
  }
  // Method to clear caches when files change
  clearCaches() {
    this.gitIgnoreCache.clear();
    this.cursorIgnoreCache.clear();
    this.gitRootCache.clear();
    this.gitRemoteUrlCache.clear();
    this.hasGitDirCache.clear();
  }
  async findGitRootsForFile(filePath) {
    const absolutePath = resolvePath(filePath);
    const directoryPath = (0, external_node_path_.dirname)(absolutePath);
    const cached = this.gitRootCache.get(directoryPath);
    if (cached !== undefined) {
      return cached;
    }
    const gitRoots = [];
    const pathsToCheck = [];
    const uncachedPaths = [];
    let currentPath = directoryPath;
    const rootPath = (0, external_node_path_.parse)(currentPath).root;
    while (currentPath !== rootPath) {
      pathsToCheck.push(currentPath);
      if (this.hasGitDirCache.get(currentPath) === undefined) {
        uncachedPaths.push(currentPath);
      }
      const parentPath = (0, external_node_path_.dirname)(currentPath);
      if (parentPath === currentPath) break;
      currentPath = parentPath;
    }
    if (uncachedPaths.length > 0) {
      const checkPromises = uncachedPaths.map(path => (0, promises_.access)((0, external_node_path_.join)(path, ".git"), promises_.constants.F_OK).then(() => [path, true]).catch(() => [path, false]));
      const results = await Promise.all(checkPromises);
      for (const [path, hasGit] of results) {
        this.hasGitDirCache.set(path, hasGit);
      }
    }
    for (const path of pathsToCheck) {
      const hasGit = this.hasGitDirCache.get(path);
      if (hasGit === true) {
        gitRoots.push(path);
      }
    }
    this.gitRootCache.set(directoryPath, gitRoots);
    return gitRoots;
  }
  async isRepoBlocked(filePath) {
    const absolutePath = resolvePath(filePath);
    const gitRoots = await this.findGitRootsForFile(filePath);
    if (gitRoots.length === 0) {
      return false;
    }
    // Cached for 5 mins
    const teamReposResponse = await this.teamSettingsService?.getTeamRepos();
    if (!teamReposResponse || !teamReposResponse.repos) {
      return false;
    }
    for (const gitRoot of gitRoots) {
      let repoUrl;
      if (this.gitRemoteUrlCache.has(gitRoot)) {
        repoUrl = this.gitRemoteUrlCache.get(gitRoot);
      } else {
        repoUrl = await getGitRemoteUrl(gitRoot);
        // Only cache if we got a URL (don't cache undefined)
        if (repoUrl !== undefined) {
          this.gitRemoteUrlCache.set(gitRoot, repoUrl);
        }
      }
      if (repoUrl === undefined) {
        continue;
      }
      // Find ALL matching repos (exact + glob patterns)
      const matchingBlockedRepos = teamReposResponse.repos.filter(repo => this.doesRepoUrlMatch(repo.url, repoUrl));
      if (matchingBlockedRepos.length === 0) {
        continue;
      }
      const relativePath = (0, external_node_path_.relative)(gitRoot, absolutePath);
      // Merge ALL patterns from matching repos and check if file matches any
      for (const repo of matchingBlockedRepos) {
        for (const pattern of repo.patterns || []) {
          if (this.matchGlob(pattern.pattern, relativePath)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  doesRepoUrlMatch(repoUrl1, repoUrl2) {
    // Check if repoUrl1 is a glob pattern (contains *)
    const isGlobPattern = repoUrl1.includes("*");
    if (isGlobPattern) {
      // Special case: single "*" matches all repos
      if (repoUrl1.trim() === "*") {
        return true;
      }
      // Use glob matching for pattern-based URLs
      const normalizedPattern = toHostPath(repoUrl1).toLowerCase();
      const normalizedUrl = toHostPath(repoUrl2).toLowerCase();
      return this.matchGlob(normalizedPattern, normalizedUrl);
    } else {
      // Use exact match for non-glob URLs
      return toHostPath(repoUrl1).toLowerCase() === toHostPath(repoUrl2).toLowerCase();
    }
  }
  matchGlob(pattern, value) {
    try {
      const isMatch = picomatch(pattern.trim());
      return isMatch(value);
    } catch {
      // Fallback to strict equality on invalid patterns
      return pattern.trim() === value;
    }
  }
}
LocalIgnoreService.promiseQueue = new utils_dist /* PromiseQueue */.TJ({
  max: maxConcurrentSearches
});
//# sourceMappingURL=ignore-service.js.map