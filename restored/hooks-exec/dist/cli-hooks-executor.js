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
var __asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};

/**
 * CLI implementation of HookExecutor that executes shell scripts.
 *
 * This executor:
 * - Loads hooks configuration from multiple sources (user, project, enterprise)
 * - Executes hook scripts using TerminalExecutor
 * - Passes request data via stdin as JSON
 * - Parses and validates hook responses
 * - Handles timeouts and errors
 */
class CliHooksExecutor {
  constructor(config, workspacePath, globalContext, shellExecutor) {
    this.config = config;
    this.workspacePath = workspacePath;
    this.globalContext = globalContext;
    this.shellExecutor = shellExecutor;
  }
  executeHookForStep(step, request) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      // Add global context fields to the request
      const fullRequest = Object.assign(Object.assign({}, request), {
        hook_event_name: step,
        cursor_version: this.globalContext.cursor_version,
        workspace_roots: [this.workspacePath],
        user_email: this.globalContext.user_email
      });
      // If we've run a stop loop 5 times, don't allow it to loop anymore
      if (step === "stop") {
        const stopReq = fullRequest;
        const loopCount = stopReq.loop_count;
        if (typeof loopCount === "number" && loopCount >= 5) {
          return {};
        }
      }
      // Collect scripts from all configs with their source context
      // Priority order: project > user
      const scriptsToExecute = [];
      // Add project scripts (highest priority)
      if ((_a = this.config.projectHooks) === null || _a === void 0 ? void 0 : _a.hooks[step]) {
        const projectScripts = this.config.projectHooks.hooks[step];
        if (projectScripts) {
          for (const script of projectScripts) {
            // Project hooks run in the workspace root
            scriptsToExecute.push({
              script,
              cwd: this.workspacePath,
              source: "project"
            });
          }
        }
      }
      // Add user scripts (lowest priority)
      if ((_b = this.config.userHooks) === null || _b === void 0 ? void 0 : _b.hooks[step]) {
        const userScripts = this.config.userHooks.hooks[step];
        if (userScripts) {
          for (const script of userScripts) {
            // User hooks run in the workspace directory
            scriptsToExecute.push({
              script,
              cwd: this.workspacePath,
              source: "user"
            });
          }
        }
      }
      if (scriptsToExecute.length === 0) {
        return undefined;
      }
      // Execute scripts in order until one returns a valid response
      for (let i = 0; i < scriptsToExecute.length; i++) {
        const {
          script,
          cwd,
          source
        } = scriptsToExecute[i];
        try {
          const result = yield this.executeScript({
            script,
            cwd,
            request: fullRequest
          });
          // Parse the response
          const trimmedStdout = result.stdout.trim();
          if (!trimmedStdout) {
            // No output, continue to next script
            continue;
          }
          try {
            const rawResponse = JSON.parse(trimmedStdout);
            // Validate the response using the validator
            const validationResult = validateAndParseHookResponse(step, rawResponse);
            if (validationResult.success) {
              return validationResult.data;
            } else {
              // Validation failed, continue to next script
              console.error(`[hooks] Response validation failed for ${source} hook ${i + 1}:`, validationResult.errors);
            }
          } catch (parseError) {
            // JSON parse error, continue to next script
            console.error(`[hooks] Failed to parse JSON response from ${source} hook ${i + 1}:`, parseError);
          }
        } catch (error) {
          // Script execution error, continue to next script
          console.error(`[hooks] Failed to execute ${source} hook ${i + 1}:`, error);
        }
      }
      // No valid response from any script
      return undefined;
    });
  }
  /**
   * Execute a single hook script.
   */
  executeScript(options) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      const {
        script,
        cwd,
        request,
        timeout = 30000
      } = options;
      const startTime = Date.now();
      const jsonPayload = JSON.stringify(request);
      // Create an AbortController for timeout
      const abortController = new AbortController();
      const timeoutHandle = setTimeout(() => {
        abortController.abort();
      }, timeout);
      try {
        // Build a command that pipes JSON to the hook script
        // Use a heredoc to avoid any escaping issues
        const isWindows = "darwin" === "win32";
        let command;
        if (isWindows) {
          // On Windows with PowerShell, use a here-string
          // Escape single quotes in the JSON by doubling them
          const escapedJson = jsonPayload.replace(/'/g, "''");
          command = `@'\n${escapedJson}\n'@ | ${script.command}`;
        } else {
          // On Unix, use a heredoc
          command = `${script.command} <<'CURSOR_HOOK_EOF'\n${jsonPayload}\nCURSOR_HOOK_EOF`;
        }
        // Execute the command using the shell executor
        const ctx = (0, dist /* createContext */.q6)();
        let stdout = "";
        let stderr = "";
        let exitCode = null;
        try {
          for (var _d = true, _e = __asyncValues(this.shellExecutor.execute(ctx, command, {
              workingDirectory: cwd,
              signal: abortController.signal,
              sandboxPolicy: {
                type: "insecure_none"
              }
            })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const event = _c;
            switch (event.type) {
              case "stdout":
                stdout += event.data;
                break;
              case "stderr":
                stderr += event.data;
                break;
              case "exit":
                exitCode = event.code;
                break;
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        clearTimeout(timeoutHandle);
        const duration = Date.now() - startTime;
        return {
          stdout,
          stderr,
          exitCode,
          duration
        };
      } catch (error) {
        clearTimeout(timeoutHandle);
        const _duration = Date.now() - startTime;
        if (abortController.signal.aborted) {
          throw new Error(`Hook script timed out after ${timeout}ms`);
        }
        throw error;
      }
    });
  }
}