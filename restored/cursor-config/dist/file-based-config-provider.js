var file_based_config_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const file_based_config_provider_DEFAULT_CONFIG = {
  version: 1,
  editor: {
    vimMode: false
  },
  hasChangedDefaultModel: false,
  permissions: {
    allow: ["Shell(ls)"],
    deny: []
  },
  approvalMode: "allowlist",
  sandbox: {
    mode: "disabled",
    networkAccess: "allowlist"
  },
  privacyCache: undefined,
  network: {
    useHttp1ForAgent: false
  }
};
class FileBasedConfigProvider {
  constructor(config, configFilePath, projectConfigFilePaths, options) {
    this.projectConfigFilePaths = [];
    this.transformLock = Promise.resolve();
    this.config = config;
    this.configFilePath = configFilePath;
    if (projectConfigFilePaths && projectConfigFilePaths.length > 0) {
      this.projectConfigFilePaths = [...projectConfigFilePaths];
    }
    this.options = options !== null && options !== void 0 ? options : {};
  }
  debugLog(...args) {
    var _a, _b;
    (_b = (_a = this.options).onDebugLog) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
  }
  exitWithError(code, message) {
    if (this.options.onError) {
      return this.options.onError(code, message);
    }
    throw new Error(message);
  }
  /**
   * Asynchronously load configuration from defaults and file system.
   * Creates a new FileBasedConfigProvider instance.
   */
  static loadFromDefaults(options) {
    return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
      var _a;
      const configFilePath = getConfigFilePath();
      const configDir = getConfigDir();
      // Determine project override files (hierarchical): <dir>/.cursor/cli.json for every dir from root->cwd
      const gitRoot = yield (0, dist.findGitRoot)(process.cwd());
      const projectRoot = gitRoot !== null && gitRoot !== void 0 ? gitRoot : process.cwd();
      const projectConfigFilePaths = collectProjectConfigPaths(projectRoot, process.cwd());
      try {
        // Ensure config directory exists
        yield (0, promises_.mkdir)(configDir, {
          recursive: true
        });
        // Try to read existing config
        if ((0, external_node_fs_.existsSync)(configFilePath)) {
          const {
            config: hydratedConfig,
            repaired
          } = yield readLatestConfigFromDisk(configFilePath);
          // If we had to repair the config, persist the repaired version
          if (repaired) {
            yield (0, promises_.writeFile)(configFilePath, `${JSON.stringify(hydratedConfig, null, 2)}\n`, "utf8");
          }
          // Merge project-level overrides if present (closer to CWD takes precedence)
          const mergedWithLocal = yield mergeWithProjectOverridesList(hydratedConfig, projectConfigFilePaths, options);
          return new FileBasedConfigProvider(mergedWithLocal, configFilePath, projectConfigFilePaths, options);
        }
        // Create default config if file doesn't exist
        yield (0, promises_.writeFile)(configFilePath, `${JSON.stringify(file_based_config_provider_DEFAULT_CONFIG, null, 2)}\n`, "utf8");
        // Merge project-level overrides if present (closer to CWD takes precedence)
        const mergedWithLocal = yield mergeWithProjectOverridesList(file_based_config_provider_DEFAULT_CONFIG, projectConfigFilePaths, options);
        return new FileBasedConfigProvider(mergedWithLocal, configFilePath, projectConfigFilePaths, options);
      } catch (error) {
        (_a = options === null || options === void 0 ? void 0 : options.onDebugLog) === null || _a === void 0 ? void 0 : _a.call(options, "FileBasedConfigProvider: failed to load, backing up and regenerating", String(error));
        // Try to backup bad config
        try {
          if ((0, external_node_fs_.existsSync)(configFilePath)) {
            const backupPath = `${configFilePath}.bad`;
            yield (0, promises_.rename)(configFilePath, backupPath);
          }
        } catch (_b) {
          /* ignore backup errors */
        }
        // Create fresh config
        try {
          yield (0, promises_.mkdir)(configDir, {
            recursive: true
          });
          yield (0, promises_.writeFile)(configFilePath, `${JSON.stringify(file_based_config_provider_DEFAULT_CONFIG, null, 2)}\n`, "utf8");
        } catch (_c) {
          /* ignore write errors, use in-memory default */
        }
        // Merge project-level overrides if present (closer to CWD takes precedence)
        const mergedWithLocal = yield mergeWithProjectOverridesList(file_based_config_provider_DEFAULT_CONFIG, projectConfigFilePaths, options);
        return new FileBasedConfigProvider(mergedWithLocal, configFilePath, projectConfigFilePaths, options);
      }
    });
  }
  /**
   * Synchronously get the current configuration.
   * This returns the in-memory cached configuration.
   */
  get() {
    return this.config;
  }
  /**
   * Asynchronously transform the configuration.
   * Applies the transformation atomically and persists to disk.
   */
  transform(transformer) {
    return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
      // Queue this transform operation behind any existing ones
      const previousLock = this.transformLock;
      let releaseLock = () => {};
      // Create a new lock for this operation
      this.transformLock = new Promise(resolve => {
        releaseLock = resolve;
      });
      try {
        // Wait for any previous transform to complete
        yield previousLock;
        // Read latest HOME config from disk and validate/repair (do not write back here)
        const {
          config: baseHomeConfig
        } = yield readLatestConfigFromDisk(this.configFilePath);
        // Apply transformation based on HOME config only to avoid persisting local overrides into HOME
        const newHomeConfig = transformer(baseHomeConfig);
        // Write atomically using a temp file
        const configDir = getConfigDir();
        yield (0, promises_.mkdir)(configDir, {
          recursive: true
        });
        const tmpPath = `${this.configFilePath}.tmp`;
        yield (0, promises_.writeFile)(tmpPath, `${JSON.stringify(newHomeConfig, null, 2)}\n`, "utf8");
        yield (0, promises_.rename)(tmpPath, this.configFilePath);
        // Update in-memory config by re-merging project overrides (if any)
        this.config = yield mergeWithProjectOverridesList(newHomeConfig, this.projectConfigFilePaths, this.options);
        return this.config;
      } catch (error) {
        this.debugLog("FileBasedConfigProvider: failed to transform config", String(error));
        throw error;
      } finally {
        // Always release the lock so next operations can proceed
        releaseLock();
      }
    });
  }
}
function readLatestConfigFromDisk(configFilePath) {
  return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
    const raw = yield (0, promises_.readFile)(configFilePath, "utf8");
    const parsed = JSON.parse(raw);
    const parsedValidation = CursorConfigSchema.safeParse(parsed);
    if (parsedValidation.success) {
      return {
        config: parsedValidation.data,
        repaired: false
      };
    }
    const merged = deepMerge(file_based_config_provider_DEFAULT_CONFIG, parsed);
    const mergedValidation = CursorConfigSchema.safeParse(merged);
    if (!mergedValidation.success) {
      throw new Error(`Invalid config: ${mergedValidation.error.message}`);
    }
    return {
      config: mergedValidation.data,
      repaired: true
    };
  });
}
function deepMerge(base, overrides) {
  const out = Object.assign({}, base);
  for (const [k, v] of Object.entries(overrides)) {
    const key = k;
    if (v && typeof v === "object" && !Array.isArray(v) && key in out && typeof out[key] === "object" && !Array.isArray(out[key])) {
      out[key] = deepMerge(out[key], v);
    } else {
      out[key] = v;
    }
  }
  return out;
}
/**
 * Read project overrides from `<projectRoot>/.cursor/cli.json` (if present)
 * and merge them over the provided base config. Validates the merged result; if
 * invalid, returns the base config unchanged.
 */
function mergeWithProjectOverridesList(baseConfig, projectConfigFilePaths, options) {
  return file_based_config_provider_awaiter(this, void 0, void 0, function* () {
    let mergedConfig = baseConfig;
    // Apply shallower paths first (root), deepest paths last (closest to CWD wins)
    for (let i = 0; i < projectConfigFilePaths.length; i++) {
      const p = projectConfigFilePaths[i];
      try {
        if (!(0, external_node_fs_.existsSync)(p)) continue;
        const raw = yield (0, promises_.readFile)(p, "utf8");
        const json = JSON.parse(raw);
        const parsed = ProjectConfigSchema.partial().safeParse(json);
        if (!parsed.success) {
          const message = `Invalid project config at ${p}: schema validation failed. ${String(parsed.error)}`;
          if (options === null || options === void 0 ? void 0 : options.onError) {
            options.onError(1, message);
          } else {
            throw new Error(message);
          }
        }
        const localParsed = parsed.data;
        const candidate = deepMerge(mergedConfig, localParsed);
        const check = CursorConfigSchema.safeParse(candidate);
        if (check.success) {
          mergedConfig = check.data;
        } else {
          const message = `Invalid project config at ${p}: merged configuration failed validation. ${String(check.error)}`;
          if (options === null || options === void 0 ? void 0 : options.onError) {
            options.onError(1, message);
          } else {
            throw new Error(message);
          }
        }
      } catch (err) {
        const message = `Failed reading project .cursor/cli.json at ${p}: ${String(err)}`;
        if (options === null || options === void 0 ? void 0 : options.onError) {
          options.onError(1, message);
        } else {
          throw new Error(message);
        }
      }
    }
    return mergedConfig;
  });
}
function collectProjectConfigPaths(projectRoot, cwd) {
  const paths = [];
  // Build list of directories from root to cwd
  const rel = (0, external_node_path_.relative)(projectRoot, cwd);
  const segments = rel.split(external_node_path_.sep).filter(Boolean);
  let current = projectRoot;
  const dirs = [projectRoot];
  for (const seg of segments) {
    current = (0, external_node_path_.join)(current, seg);
    dirs.push(current);
  }
  // For each directory along the path, if .cursor/cli.json exists, add it.
  for (const dir of dirs) {
    const p = (0, external_node_path_.join)(dir, ".cursor", "cli.json");
    if ((0, external_node_fs_.existsSync)(p)) paths.push(p);
  }
  // paths are in root->cwd order
  return Array.from(new Set(paths));
}