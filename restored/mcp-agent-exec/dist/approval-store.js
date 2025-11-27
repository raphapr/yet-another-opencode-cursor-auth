var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var __addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
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
var __disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
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
function generateApprovalKey(serverName, server, cwd) {
  const hashInput = {
    path: cwd,
    server: server
  };
  const hash = (0, external_node_crypto_.createHash)("sha256").update(JSON.stringify(hashInput)).digest("hex").substring(0, 16);
  return `${serverName}-${hash}`;
}
/**
 * Noop approval service that always approves everything.
 * This replaces the previous VsCodeMcpApprovalService to remove the dependency
 * on the browser-side MCP service for approval checking.
 */
class NoopMcpApprovalService {
  isServerApproved(_serverName, _server, _configPath) {
    return __awaiter(this, void 0, void 0, function* () {
      // Always approve everything
      return true;
    });
  }
}
/**
 * Middleware that requires approval for servers
 */
class ServerApprovalMiddleware {
  constructor(approvalService) {
    this.approvalService = approvalService;
  }
  load(ctx, serverName, server, configPath, next) {
    return __awaiter(this, void 0, void 0, function* () {
      const env_1 = {
        stack: [],
        error: void 0,
        hasError: false
      };
      try {
        const _span = __addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("ServerApprovalMiddleware.load")), false);
        const isApproved = yield this.approvalService.isServerApproved(serverName, server, configPath);
        if (!isApproved) {
          throw new Error(`MCP server "${serverName}" has not been approved. Please approve it before loading.`);
        }
        return yield next(ctx, server);
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources(env_1);
      }
    });
  }
}
class FileBasedMcpApprovalStore {
  constructor(approvalsPath, cwd) {
    this.approvalsPath = approvalsPath;
    this.cwd = cwd;
    this.approvalsPromise = this.loadApprovals();
  }
  isServerApproved(serverName, server, _configPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvalKey = generateApprovalKey(serverName, server, this.cwd);
      const approvals = yield this.getApprovals();
      return approvals.includes(approvalKey);
    });
  }
  loadApprovals() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const approvalsContent = yield (0, promises_.readFile)(this.approvalsPath, "utf8");
        const parsed = JSON.parse(approvalsContent);
        // Ensure the parsed data is actually an array
        if (!Array.isArray(parsed)) {
          // Invalid format - reset approvals to empty array
          yield this.saveApprovalsToFile([]); // Clear invalid format in the file
          return [];
        }
        return parsed;
      } catch (e) {
        if (e instanceof Error && e.message.includes("ENOENT")) {
          // File doesn't exist yet, return empty array
          return [];
        }
        throw e;
      }
    });
  }
  getApprovals() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.approvalsPromise;
    });
  }
  addApproval(approvalKey) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      if (!approvals.includes(approvalKey)) {
        approvals.push(approvalKey);
        yield this.saveApprovals(approvals);
      }
    });
  }
  addApprovals(approvalKeys) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      const newKeys = approvalKeys.filter(key => !approvals.includes(key));
      if (newKeys.length > 0) {
        approvals.push(...newKeys);
        yield this.saveApprovals(approvals);
      }
    });
  }
  removeApproval(approvalKey) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      const filtered = approvals.filter(key => key !== approvalKey);
      if (filtered.length !== approvals.length) {
        yield this.saveApprovals(filtered);
      }
    });
  }
  clearApprovals(filter) {
    return __awaiter(this, void 0, void 0, function* () {
      const approvals = yield this.approvalsPromise;
      const filtered = filter ? approvals.filter(key => !filter(key)) : [];
      if (filtered.length !== approvals.length) {
        yield this.saveApprovals(filtered);
      }
    });
  }
  saveApprovalsToFile(approvals) {
    return __awaiter(this, void 0, void 0, function* () {
      yield (0, promises_.mkdir)(external_node_path_.dirname(this.approvalsPath), {
        recursive: true
      });
      yield (0, promises_.writeFile)(this.approvalsPath, JSON.stringify(approvals, null, 2));
    });
  }
  saveApprovals(approvals) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.saveApprovalsToFile(approvals);
      this.approvalsPromise = Promise.resolve(approvals);
    });
  }
}
//# sourceMappingURL=approval-store.js.map