__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */f4: () => (/* binding */runOnboarding),
      /* harmony export */h4: () => (/* binding */checkAuthenticationStatus),
      /* harmony export */hT: () => (/* binding */AuthType)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../cursor-config/dist/index.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../proto/dist/generated/aiserver/v1/dashboard_pb.js");
    /* harmony import */
    var _auth_refresh_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/auth-refresh.ts");
    /* harmony import */
    var _components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/onboarding-ui.tsx");
    /* harmony import */
    var _privacy_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/privacy.ts");
    /* harmony import */
    var _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/utils/open-browser.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    function runOnboarding(credentialManager, configProvider, dashboardClient) {
      return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
          var _a;
          let currentStatus = "welcome";
          let cleanupResizeListener = null;
          const handleLoginRequest = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Stop listening to terminal resizes once we leave the welcome screen
            if (cleanupResizeListener) {
              cleanupResizeListener();
              cleanupResizeListener = null;
            }
            currentStatus = "progress";
            try {
              const loginManager = new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_1__ /* .LoginManager */.Pl();
              const {
                metadata,
                loginUrl
              } = loginManager.startLogin();
              if ((0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_7__ /* .isLikelyToOpenBrowser */.g)(loginUrl)) {
                rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
                  type: "browser",
                  message: "Signing in with the browser...",
                  loginUrl: loginUrl
                }));
                try {
                  yield (0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_7__ /* .openBrowser */.p)(loginUrl);
                } catch (_b) {
                  // ignore, likely in ssh session
                }
              } else {
                rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
                  type: "browser",
                  message: "Signing in",
                  loginUrl: loginUrl
                }));
              }
              const authResult = yield loginManager.waitForResult(metadata);
              if (authResult === null || authResult === void 0 ? void 0 : authResult.accessToken) {
                try {
                  rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
                    type: "waiting",
                    message: "Signing in..."
                  }));
                  yield credentialManager.setAuthentication(authResult.accessToken, authResult.refreshToken);
                  // Reset privacy cache like we do in logout if configProvider is available
                  if (configProvider) {
                    yield configProvider.transform(c => Object.assign(Object.assign({}, c), {
                      privacyCache: undefined
                    }));
                  }
                  // Pre-emptively refresh privacy cache in background, does not block.
                  if (configProvider) {
                    (0, _privacy_js__WEBPACK_IMPORTED_MODULE_6__ /* .maybeRefreshPrivacyCacheInBackground */.H)({
                      credentialManager,
                      baseUrl: "https://api2.cursor.sh",
                      // fine since it doesn't write to cache on failure, and it will try with the correct endpoint next time they do something
                      configProvider
                    });
                  }
                  // Check if user has @anysphere.co email and auto-configure staging channel
                  if (dashboardClient && configProvider) {
                    try {
                      const response = yield dashboardClient.getMe(new _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .GetMeRequest */.Ewt({}));
                      // Auto-configure staging channel for @anysphere.co users
                      // Opt-in devs on all channels except 'lab', 'static', and 'prod-stable-internal'
                      const currentChannel = configProvider.get().channel;
                      if (((_a = response.email) === null || _a === void 0 ? void 0 : _a.endsWith("@anysphere.co")) && currentChannel !== "lab" && currentChannel !== "static" && currentChannel !== "prod-stable-internal") {
                        yield configProvider.transform(c => Object.assign(Object.assign({}, c), {
                          channel: "staging"
                        }));
                      }
                    } catch (_c) {
                      // Ignore errors getting user info - don't block onboarding success
                    }
                  }
                  rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
                    type: "success",
                    message: "Authentication tokens stored securely."
                  }));
                  // Give user a moment to see success message
                  setTimeout(() => {
                    resolve(true);
                  }, 1500);
                } catch (error) {
                  const message = `Failed to store authentication tokens: ${error instanceof Error ? error.message : String(error)}`;
                  rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
                    type: "error",
                    message: message
                  }));
                  setTimeout(() => {
                    resolve(false);
                  }, 3000);
                }
              } else {
                rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
                  type: "error",
                  message: "Login failed or timed out."
                }));
                setTimeout(() => {
                  resolve(false);
                }, 3000);
              }
            } catch (error) {
              const message = `Login error: ${error instanceof Error ? error.message : String(error)}`;
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
                type: "error",
                message: message
              }));
              setTimeout(() => {
                resolve(false);
              }, 3000);
            }
          });
          const cursorAgentAscii = ["░█▀▀░█░█░█▀▄░█▀▀░█▀█░█▀▄░░░█▀█░█▀▀░█▀▀░█▀█░▀█▀", "░█░░░█░█░█▀▄░▀▀█░█░█░█▀▄░░░█▀█░█░█░█▀▀░█░█░░█░", "░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░░░▀░▀░▀▀▀░▀▀▀░▀░▀░░▀░"].join("\n");
          // If the terminal is too narrow, fall back to a simple title instead of ASCII
          const NARROW_BREAKPOINT_COLS = 110;
          const terminalColumns = typeof ((_a = process.stdout) === null || _a === void 0 ? void 0 : _a.columns) === "number" ? process.stdout.columns : 80;
          const welcomeMessage = terminalColumns < NARROW_BREAKPOINT_COLS ? "Cursor Agent" : cursorAgentAscii;
          const {
            rerender,
            waitUntilExit
          } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_2__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
            type: "welcome",
            message: welcomeMessage
          }));
          // Dynamically update the welcome message when terminal size changes
          const recomputeWelcomeMessage = () => {
            var _a;
            const cols = typeof ((_a = process.stdout) === null || _a === void 0 ? void 0 : _a.columns) === "number" ? process.stdout.columns : 80;
            return cols < NARROW_BREAKPOINT_COLS ? "Cursor Agent" : cursorAgentAscii;
          };
          const handleResize = () => {
            if (currentStatus !== "welcome") return;
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .OnboardingScreen */.oz, {
              type: "welcome",
              message: recomputeWelcomeMessage()
            }));
          };
          if (process.stdout && typeof process.stdout.on === "function") {
            process.stdout.on("resize", handleResize);
            cleanupResizeListener = () => {
              if (process.stdout && typeof process.stdout.off === "function") {
                process.stdout.off("resize", handleResize);
              }
            };
          }
          // Handle any key press to continue
          process.stdin.setRawMode(true);
          process.stdin.resume();
          process.stdin.on("data", data => {
            // Only handle the first keypress when in welcome mode
            if (currentStatus === "welcome") {
              process.stdin.setRawMode(false);
              process.stdin.pause();
              // ctrl+c or ctrl+z should exit
              const byte = data[0];
              if (byte === 0x03 || byte === 0x1a) {
                process.exit(0);
              }
              void handleLoginRequest();
            }
          });
          // Also handle the case where the UI exits
          void waitUntilExit().then(() => {
            resolve(false);
          }).catch(() => {
            resolve(false);
          });
        });
      });
    }
    var AuthType;
    (function (AuthType) {
      AuthType["API_KEY"] = "api-key";
      AuthType["LOGIN"] = "login";
    })(AuthType || (AuthType = {}));
    function checkAuthenticationStatus(credentialManager, restrictToAuthType) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const {
            accessToken,
            refreshToken,
            apiKey
          } = yield credentialManager.getAllCredentials();
          if (accessToken && (0, _auth_refresh_js__WEBPACK_IMPORTED_MODULE_4__ /* .isTokenExpiringSoon */.nH)(accessToken)) {
            return false;
          }
          // If we are only checking for login, and the user still has credentials from an api key, then they are not authenticated
          if (restrictToAuthType === AuthType.LOGIN && apiKey) {
            yield credentialManager.clearAuthentication();
            return false;
          }
          return !!(accessToken && refreshToken);
        } catch (_a) {
          return false;
        }
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/