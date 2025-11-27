__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
      /* harmony export */handleDevLogin: () => (/* binding */handleDevLogin)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/login-ui.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    function handleDevLogin(credentialManager_1) {
      return __awaiter(this, arguments, void 0, function* (credentialManager, options = {}) {
        // Render the status component
        const {
          rerender
        } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .LoginStatus */.a, {
          status: "starting"
        }));
        // Store original TLS setting
        const originalTlsRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        try {
          const backendBaseUrl = options.endpoint || "https://localhost:8000";
          const endpoint = `${backendBaseUrl}/auth/cursor_dev_session_token${options.trial ? "?trial=true" : ""}`;
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .LoginStatus */.a, {
            status: "in-progress",
            message: `Authenticating with dev backend at ${backendBaseUrl}...`
          }));
          // Disable TLS certificate validation if insecure flag is set
          if (options.insecure && backendBaseUrl.startsWith("https:")) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          }
          const response = yield fetch(endpoint);
          if (!response.ok) {
            const errorText = yield response.text();
            throw new Error(`Dev authentication failed (${response.status}): ${errorText}`);
          }
          const authResult = yield response.json();
          if (authResult === null || authResult === void 0 ? void 0 : authResult.accessToken) {
            try {
              yield credentialManager.setAuthentication(authResult.accessToken, authResult.refreshToken);
              const membershipType = options.trial ? "free trial" : "pro";
              const insecureNote = options.insecure ? " (insecure SSL)" : "";
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .LoginStatus */.a, {
                status: "success",
                message: `Dev authentication successful!${insecureNote} Logged in with ${membershipType} account.\nAuth ID: ${authResult.authId}`
              }));
            } catch (_error) {
              const message = `Failed to store dev authentication tokens.\nAccess token: ${authResult.accessToken}`;
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .LoginStatus */.a, {
                status: "error",
                message: message
              }));
            }
          } else {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .LoginStatus */.a, {
              status: "error",
              message: "Dev login failed - invalid response from server."
            }));
            process.exit(1);
          }
        } catch (error) {
          const isNetworkError = error instanceof TypeError && error.message.includes("fetch");
          const isCertError = error instanceof Error && (error.message.includes("certificate") || error.message.includes("self signed") || error.message.includes("unable to verify"));
          let errorMessage;
          if (isCertError && !options.insecure) {
            errorMessage = `SSL certificate error. Try using the -k flag to ignore certificate validation: ${error}`;
          } else if (isNetworkError) {
            errorMessage = `Failed to connect to dev backend. Make sure the development server is running at ${options.endpoint || "https://localhost:8000"}.`;
          } else {
            errorMessage = `Dev login error: ${error}`;
          }
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_2__ /* .LoginStatus */.a, {
            status: "error",
            message: errorMessage
          }));
          process.exit(1);
        } finally {
          // Restore original TLS setting
          if (originalTlsRejectUnauthorized !== undefined) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTlsRejectUnauthorized;
          } else {
            delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
          }
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