__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */K: () => (/* binding */runExecutionModeApproval)
      /* harmony export */
    });
    /* harmony import */
    var _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/components/approval-dialog.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_0__]);
    _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
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

    // Returns true if the user quit, false if the user approved the execution mode
    function runExecutionModeApproval(configProvider) {
      return __awaiter(this, void 0, void 0, function* () {
        const config = configProvider.get();
        const showSandboxIntro = config.showSandboxIntro === true;
        // Only show prompts if the intro flag is set
        if (!showSandboxIntro) {
          return false;
        }
        const allowlistForMode = {
          auto: "allowlist",
          manual: "allowlist",
          unrestricted: "unrestricted",
          quit: "allowlist"
        };
        const sandboxModeForMode = {
          auto: "enabled",
          manual: "disabled",
          unrestricted: "disabled",
          quit: "disabled"
        };
        const options = [{
          key: "a",
          label: "Auto - Commands run in sandbox automatically with configurable network access",
          value: "auto"
        }, {
          key: "m",
          label: "Manual - All commands require approval (allowlist mode)",
          value: "manual"
        }, {
          key: "u",
          label: "Unrestricted - All commands run unsandboxed without approval",
          value: "unrestricted"
        }, {
          key: "q",
          label: "Quit",
          value: "quit"
        }];
        const result = yield (0, _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_0__ /* .runApprovalDialog */.b)({
          title: "Command Execution",
          description: ["Cursor can execute commands safely in a sandbox. \nChoose how commands should be executed:"],
          options,
          onAction: () => __awaiter(this, void 0, void 0, function* () {
            // This will be called after the user selects an option
          }),
          variant: "info"
        });
        if (!result || result === "quit") {
          return true;
        }
        // For auto mode, ask about network access
        // For unrestricted mode, skip network access prompt since we can't restrict network access without sandbox
        let networkResult;
        if (result === "auto") {
          const networkOptions = [{
            key: "y",
            label: "Yes - Enable network access in sandbox",
            value: "yes"
          }, {
            key: "n",
            label: "No - Disable network access in sandbox (allowlist only)",
            value: "no"
          }, {
            key: "q",
            label: "Quit",
            value: "quit"
          }];
          networkResult = yield (0, _components_approval_dialog_js__WEBPACK_IMPORTED_MODULE_0__ /* .runApprovalDialog */.b)({
            title: "Network Access Configuration",
            description: ["Choose network access policy:"],
            options: networkOptions,
            onAction: () => __awaiter(this, void 0, void 0, function* () {
              // This will be called after the user selects an option
            }),
            variant: "info"
          });
          if (!networkResult || networkResult === "quit") {
            return true;
          }
        }
        const sandboxMode = sandboxModeForMode[result];
        const approvalMode = allowlistForMode[result];
        const networkAccess = networkResult === "yes" ? "enabled" : "allowlist";
        // Mark intro as shown and update config
        yield configProvider.transform(cfg => Object.assign(Object.assign({}, cfg), {
          showSandboxIntro: false,
          approvalMode: approvalMode,
          sandbox: Object.assign(Object.assign({}, cfg.sandbox), {
            mode: sandboxMode,
            networkAccess: networkAccess
          })
        }));
        return false;
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/