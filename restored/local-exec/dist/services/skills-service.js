var skills_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var skills_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
class LocalSkillsService {
  constructor(ctx, rootDirectory, fileWatcher) {
    this.rootDirectory = rootDirectory;
    this.loadTraceId = undefined;
    this.onChangeCallbacks = new Set();
    this.loadSkills = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load skills:", err);
      return [];
    });
    // If file watcher provided, subscribe to reload on file changes
    if (fileWatcher && this.rootDirectory) {
      const patterns = [".cursor/skills/**/SKILL.md", ".cursor/skills/*/SKILL.md"];
      this.unsubscribeWatcher = fileWatcher.subscribe(this.rootDirectory, patterns, path => {
        const env_1 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const reloadCtx = (0, dist /* createContext */.q6)();
          const span = skills_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(reloadCtx.withName("LocalSkillsService.fileWatcher.subscribe")), false);
          this.reloadAtPath(span.ctx, path);
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          skills_service_disposeResources(env_1);
        }
      });
    }
  }
  /**
   * Reload skills (e.g., when settings change)
   */
  reload(ctx) {
    this.loadSkills = this.load(ctx).catch(err => {
      (0, external_node_util_.debuglog)("Failed to load skills:", err);
      return [];
    });
    // Notify all callbacks that skills have changed
    for (const callback of this.onChangeCallbacks) {
      callback();
    }
  }
  reloadAtPath(ctx, path) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.reloadAtPath")), false);
      const previousSkills = this.loadSkills;
      this.loadSkills = (async () => {
        // Extract the skill directory from the path
        const skillDirMatch = path.match(/\.cursor\/skills\/([^/]+)\/SKILL\.md$/);
        if (!skillDirMatch) {
          // If path doesn't match expected pattern, just reload all
          return this.load(span.ctx);
        }
        const skillId = skillDirMatch[1];
        const previousSkillsArray = await previousSkills;
        const otherSkills = previousSkillsArray.filter(s => !s.folderPath.endsWith(`/skills/${skillId}`));
        if (!this.rootDirectory) {
          return otherSkills;
        }
        // Reload just this skill
        const skillDir = (0, external_node_path_.join)(this.rootDirectory, ".cursor", "skills", skillId);
        const parseResult = await this.parseSkillDirectory(span.ctx, skillDir, skillId);
        if (parseResult) {
          // Only include the skill if it's enabled
          return [...otherSkills, this.toSkillDescriptor(parseResult)];
        } else {
          // If parsing failed, return just the other skills
          return otherSkills;
        }
      })().catch(err => {
        (0, external_node_util_.debuglog)("Failed to load skills at path:", err);
        return [];
      });
      // Notify all callbacks that skills have changed
      for (const callback of this.onChangeCallbacks) {
        callback();
      }
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      skills_service_disposeResources(env_2);
    }
  }
  onDidChangeSkills(callback) {
    this.onChangeCallbacks.add(callback);
    return () => {
      this.onChangeCallbacks.delete(callback);
    };
  }
  dispose() {
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
  }
  async getSkills(ctx) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.getSkills")), false);
      span.span.setAttribute("cacheTraceId", this.loadTraceId ?? "undefined");
      return await this.loadSkills;
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      skills_service_disposeResources(env_3);
    }
  }
  async load(ctx) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.load")), false);
      this.loadTraceId = span.span.spanContext().traceId;
      if (!this.rootDirectory) {
        return [];
      }
      const skillsDir = (0, external_node_path_.join)(this.rootDirectory, ".cursor", "skills");
      // Read all subdirectories in the skills folder
      const skills = [];
      try {
        const dirContents = await (0, promises_.readdir)(skillsDir, {
          withFileTypes: true
        });
        const directories = dirContents.filter(dirent => dirent.isDirectory());
        const parseResults = await Promise.all(directories.map(async dirent => {
          const skillDir = (0, external_node_path_.join)(skillsDir, dirent.name);
          const parseResult = await this.parseSkillDirectory(span.ctx, skillDir, dirent.name);
          return {
            dirent,
            parseResult
          };
        }));
        for (const {
          parseResult
        } of parseResults) {
          if (parseResult) {
            skills.push(parseResult);
          }
        }
      } catch (err) {
        console.error("Failed to read skills directory:", err);
      }
      span.span.setAttribute("skills.total", skills.length);
      // Filter to only return enabled skills
      const enabledSkills = skills.filter(skill => skill.enabled);
      span.span.setAttribute("skills.enabled", enabledSkills.length);
      return enabledSkills.map(skill => this.toSkillDescriptor(skill));
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      skills_service_disposeResources(env_4);
    }
  }
  async parseSkillDirectory(ctx, skillDir, skillId) {
    const env_5 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = skills_service_addDisposableResource(env_5, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.parseSkillDirectory")), false);
      try {
        const skillFilePath = (0, external_node_path_.join)(skillDir, "SKILL.md");
        // Parse the SKILL.md file
        return await this.parseSkillFile(span.ctx, skillFilePath, skillId);
      } catch (err) {
        (0, external_node_util_.debuglog)(`Failed to parse skill directory ${skillDir}: ${err}`);
        return undefined;
      }
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      skills_service_disposeResources(env_5);
    }
  }
  async parseSkillFile(ctx, skillFilePath, skillId) {
    const env_6 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = skills_service_addDisposableResource(env_6, (0, dist /* createSpan */.VI)(ctx.withName("LocalSkillsService.parseSkillFile")), false);
      try {
        // Read file content
        const content = await readText(skillFilePath);
        // Parse frontmatter using gray-matter
        const parsed = gray_matter(content);
        // Check if frontmatter exists
        if (!parsed.data || Object.keys(parsed.data).length === 0) {
          (0, external_node_util_.debuglog)(`Invalid SKILL.md format: missing YAML frontmatter in ${skillFilePath}`);
          return undefined;
        }
        const yamlData = parsed.data;
        // Check for required fields
        if (!yamlData.description) {
          (0, external_node_util_.debuglog)(`Missing required "description" field in YAML frontmatter in ${skillFilePath}`);
          return undefined;
        }
        // Format skill name from ID if not provided
        const skillName = yamlData.title || yamlData.name;
        // Check if skill is enabled (default to true if not specified)
        const enabled = yamlData.enabled !== false;
        // Create skill object
        const skill = {
          id: skillId,
          name: skillName,
          description: String(yamlData.description),
          filePath: skillFilePath,
          dirPath: (0, external_node_path_.dirname)(skillFilePath),
          // Parent directory
          enabled: enabled
        };
        return skill;
      } catch (error) {
        (0, external_node_util_.debuglog)(`Failed to parse skill file ${skillFilePath}: ${error}`);
        return undefined;
      }
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      skills_service_disposeResources(env_6);
    }
  }
  toSkillDescriptor(skill) {
    return new request_context_exec_pb /* SkillDescriptor */.ng({
      name: skill.name,
      description: skill.description,
      folderPath: skill.dirPath
    });
  }
}
//# sourceMappingURL=skills-service.js.map