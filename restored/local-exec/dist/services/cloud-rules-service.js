var cloud_rules_service_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var cloud_rules_service_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
class LocalCloudRulesService {
  constructor(ctx, rootDirectory, fileWatcher) {
    this.rootDirectory = rootDirectory;
    this.loadTraceId = undefined;
    this.cloudRule = this.load(ctx).catch(error => {
      (0, external_node_util_.debuglog)("Failed to load cloud rules:", error);
      return null;
    });
    if (fileWatcher) {
      const patterns = [".cursor/CLOUD.md"];
      this.unsubscribeWatcher = fileWatcher.subscribe(this.rootDirectory, patterns, changedPath => {
        const env_1 = {
          stack: [],
          error: void 0,
          hasError: false
        };
        try {
          const reloadCtx = (0, dist /* createContext */.q6)();
          const span = cloud_rules_service_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(reloadCtx.withName("LocalCloudRulesService.fileWatcher.subscribe")), false);
          this.reloadAtPath(span.ctx, changedPath);
        } catch (e_1) {
          env_1.error = e_1;
          env_1.hasError = true;
        } finally {
          cloud_rules_service_disposeResources(env_1);
        }
      });
    }
  }
  reload(ctx) {
    this.cloudRule = this.load(ctx).catch(error => {
      (0, external_node_util_.debuglog)("Failed to load cloud rules:", error);
      return null;
    });
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }
  reloadAtPath(ctx, _path) {
    const env_2 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cloud_rules_service_addDisposableResource(env_2, (0, dist /* createSpan */.VI)(ctx.withName("LocalCloudRulesService.reloadAtPath")), false);
      this.cloudRule = this.load(span.ctx).catch(error => {
        (0, external_node_util_.debuglog)("Failed to load cloud rules at path:", error);
        return null;
      });
      if (this.onChangeCallback) {
        this.onChangeCallback();
      }
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      cloud_rules_service_disposeResources(env_2);
    }
  }
  onDidChangeRule(callback) {
    this.onChangeCallback = callback;
  }
  dispose() {
    if (this.unsubscribeWatcher) {
      this.unsubscribeWatcher();
      this.unsubscribeWatcher = undefined;
    }
  }
  async getCloudRule(ctx) {
    const env_3 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cloud_rules_service_addDisposableResource(env_3, (0, dist /* createSpan */.VI)(ctx.withName("LocalCloudRulesService.getCloudRule")), false);
      span.span.setAttribute("cacheTraceId", this.loadTraceId ?? "undefined");
      return await this.cloudRule;
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      cloud_rules_service_disposeResources(env_3);
    }
  }
  async load(ctx) {
    const env_4 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const span = cloud_rules_service_addDisposableResource(env_4, (0, dist /* createSpan */.VI)(ctx.withName("LocalCloudRulesService.load")), false);
      this.loadTraceId = span.span.spanContext().traceId;
      const workspaceRoot = (0, external_node_path_.resolve)(this.rootDirectory);
      const cloudRulesPath = (0, external_node_path_.join)(workspaceRoot, ".cursor", "CLOUD.md");
      try {
        const fileStats = await (0, promises_.stat)(cloudRulesPath);
        if (!fileStats.isFile()) {
          return null;
        }
      } catch {
        return null;
      }
      try {
        const content = await readText(cloudRulesPath);
        if (content.trim().length === 0) {
          return null;
        }
        const filename = (0, external_node_path_.basename)(cloudRulesPath);
        span.span.setAttribute("cloudRulesFilename", filename);
        return content;
      } catch (error) {
        (0, external_node_util_.debuglog)("Failed to read CLOUD.md:", error);
        return null;
      }
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      cloud_rules_service_disposeResources(env_4);
    }
  }
}
//# sourceMappingURL=cloud-rules-service.js.map