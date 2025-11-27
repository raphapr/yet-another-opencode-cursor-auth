__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
      /* harmony export */handleLogin: () => (/* binding */handleLogin)
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
    var _components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/login-ui.tsx");
    /* harmony import */
    var _privacy_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/privacy.ts");
    /* harmony import */
    var _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/utils/open-browser.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_2__, _components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    function handleLogin(credentialManager, configProvider, dashboardClient) {
      return __awaiter(this, void 0, void 0, function* () {
        // Render the status component
        const {
          rerender
        } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_2__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .LoginStatus */.a, {
          status: "starting"
        }));
        try {
          const loginManager = new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_1__ /* .LoginManager */.Pl();
          const {
            metadata,
            loginUrl
          } = loginManager.startLogin();
          if ((0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_6__ /* .isLikelyToOpenBrowser */.g)(loginUrl)) {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .LoginStatus */.a, {
              status: "in-progress",
              message: `Waiting for browser authentication...\nIf your browser didn't open, use this link:\n${loginUrl}`
            }));
            try {
              yield (0, _utils_open_browser_js__WEBPACK_IMPORTED_MODULE_6__ /* .openBrowser */.p)(loginUrl);
            } catch (_a) {
              // ignore, likely in ssh session
            }
          } else {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .LoginStatus */.a, {
              status: "in-progress",
              message: `Waiting for browser authentication...\nOpen a browser and navigate to this link: ${loginUrl}`
            }));
          }
          const authResult = yield loginManager.waitForResult(metadata);
          if (authResult === null || authResult === void 0 ? void 0 : authResult.accessToken) {
            try {
              yield credentialManager.setAuthentication(authResult.accessToken, authResult.refreshToken);
              // Reset privacy cache like we do in logout
              yield configProvider.transform(c => Object.assign(Object.assign({}, c), {
                privacyCache: undefined
              }));
              // Pre-emptively refresh privacy cache in background, does not block.
              (0, _privacy_js__WEBPACK_IMPORTED_MODULE_5__ /* .maybeRefreshPrivacyCacheInBackground */.H)({
                credentialManager,
                baseUrl: "https://api2.cursor.sh",
                // fine since it doesn't write to cache on failure, and it will try with the correct endpoint next time they do something
                configProvider
              });
              // Check if user has @anysphere.co email and auto-configure staging channel
              let userEmail;
              let stagingChannelConfigured = false;
              if (dashboardClient) {
                try {
                  const response = yield dashboardClient.getMe(new _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .GetMeRequest */.Ewt({}));
                  userEmail = response.email;
                  // Auto-configure staging channel for @anysphere.co users
                  // Opt-in devs on all channels except 'lab', 'static', and 'prod-stable-internal'
                  const currentChannel = configProvider.get().channel;
                  if ((userEmail === null || userEmail === void 0 ? void 0 : userEmail.endsWith("@anysphere.co")) && currentChannel !== "lab" && currentChannel !== "static" && currentChannel !== "prod-stable-internal") {
                    yield configProvider.transform(c => Object.assign(Object.assign({}, c), {
                      channel: "staging"
                    }));
                    stagingChannelConfigured = true;
                  }
                } catch (_b) {
                  // Ignore errors getting user info - don't block login success
                }
              }
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .LoginStatus */.a, {
                status: "success",
                message: `Authentication tokens stored securely.${stagingChannelConfigured ? " cursor-agent automatically configured to use staging channel." : ""}`,
                userInfo: userEmail ? {
                  email: userEmail
                } : undefined
              }));
            } catch (_c) {
              const message = `Failed to store authentication tokens.\nAccess token: ${authResult.accessToken}`;
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .LoginStatus */.a, {
                status: "error",
                message: message
              }));
            }
          } else {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .LoginStatus */.a, {
              status: "error",
              message: "Login failed or timed out."
            }));
            process.exit(1);
          }
        } catch (error) {
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_4__ /* .LoginStatus */.a, {
            status: "error",
            message: `Login error: ${error}`
          }));
          process.exit(1);
        }
        process.exit(0);
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/