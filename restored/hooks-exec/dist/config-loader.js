var config_loader_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class HooksConfigLoader {
  constructor(fileReader, paths) {
    this.fileReader = fileReader;
    this.paths = paths;
  }
  load() {
    return config_loader_awaiter(this, arguments, void 0, function* (options = {}) {
      const {
        loadProjectHooks = true
      } = options;
      const result = {
        errors: []
      };
      if (this.paths.userConfigPath) {
        try {
          const exists = yield this.fileReader.exists(this.paths.userConfigPath);
          if (exists) {
            const content = yield this.fileReader.readFile(this.paths.userConfigPath);
            if (content) {
              const {
                config,
                error
              } = this.parseAndValidate(content, "user");
              if (config) {
                result.userHooks = config;
              } else if (error) {
                result.errors.push({
                  source: "user",
                  message: `User hooks.json at ${this.paths.userConfigPath}: ${error}`
                });
              }
            }
          }
        } catch (error) {
          result.errors.push({
            source: "user",
            message: `Error accessing user config file: ${String(error)}`
          });
        }
      }
      if (loadProjectHooks && this.paths.projectConfigPath) {
        try {
          const exists = yield this.fileReader.exists(this.paths.projectConfigPath);
          if (exists) {
            const content = yield this.fileReader.readFile(this.paths.projectConfigPath);
            if (content) {
              const {
                config,
                error
              } = this.parseAndValidate(content, "project");
              if (config) {
                result.projectHooks = config;
              } else if (error) {
                result.errors.push({
                  source: "project",
                  message: `Project hooks.json at ${this.paths.projectConfigPath}: ${error}`
                });
              }
            }
          }
        } catch (error) {
          result.errors.push({
            source: "project",
            message: `Error accessing project config file: ${String(error)}`
          });
        }
      }
      return result;
    });
  }
  parseAndValidate(configText, source) {
    try {
      const config = this.parseJSONC(configText);
      const validation = validateHooksConfig(config);
      if (!validation.isValid) {
        const message = `Invalid ${source} config: ${validation.errors.join("; ")}`;
        return {
          error: message
        };
      }
      const hasHooks = !!(config === null || config === void 0 ? void 0 : config.hooks);
      if (!hasHooks) {
        const message = `Invalid ${source} config: missing 'hooks' property`;
        return {
          error: message
        };
      }
      return {
        config: config
      };
    } catch (parseError) {
      const message = `Failed to parse ${source} config JSON: ${String(parseError)}`;
      return {
        error: message
      };
    }
  }
  parseJSONC(text) {
    const singleLineCommentRegex = /\/\/.*$/gm;
    let cleaned = text.replace(singleLineCommentRegex, "");
    const multiLineCommentRegex = /\/\*[\s\S]*?\*\//g;
    cleaned = cleaned.replace(multiLineCommentRegex, "");
    return JSON.parse(cleaned);
  }
  static getConfiguredSteps(config) {
    var _a, _b;
    const steps = new Set();
    if ((_a = config.projectHooks) === null || _a === void 0 ? void 0 : _a.hooks) {
      for (const step of Object.keys(config.projectHooks.hooks)) {
        steps.add(step);
      }
    }
    if ((_b = config.userHooks) === null || _b === void 0 ? void 0 : _b.hooks) {
      for (const step of Object.keys(config.userHooks.hooks)) {
        steps.add(step);
      }
    }
    return steps;
  }
}