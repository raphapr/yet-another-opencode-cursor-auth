__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
      /* harmony export */handleStatus: () => (/* binding */handleStatus)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../proto/dist/generated/aiserver/v1/dashboard_pb.js");
    /* harmony import */
    var _components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/login-ui.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    function handleStatus(credentialManager, dashboardClient) {
      return __awaiter(this, void 0, void 0, function* () {
        // Render the status component
        const {
          waitUntilExit,
          rerender
        } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LoginStatus */.a, {
          status: "starting"
        }));
        try {
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
            children: "Checking authentication status..."
          }));
          const accessToken = yield credentialManager.getAccessToken();
          const refreshToken = yield credentialManager.getRefreshToken();
          if (accessToken && refreshToken) {
            // Fetch user information
            try {
              const response = yield dashboardClient.getMe(new _anysphere_proto_aiserver_v1_dashboard_pb_js__WEBPACK_IMPORTED_MODULE_2__ /* .GetMeRequest */.Ewt({}));
              if (response.email) {
                rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LoginStatus */.a, {
                  status: "success",
                  userInfo: {
                    email: response.email,
                    userId: response.userId,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    teamId: response.teamId,
                    createdAt: response.createdAt
                  }
                }));
              } else {
                rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LoginStatus */.a, {
                  status: "success",
                  message: "Logged in (user details not available)"
                }));
              }
            } catch (_a) {
              // If we can't fetch detailed info, at least show we're logged in
              rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LoginStatus */.a, {
                status: "success",
                message: "Logged in (unable to fetch user details)"
              }));
            }
          } else if (accessToken) {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LoginStatus */.a, {
              status: "error",
              message: `Partially authenticated (missing refresh token)`
            }));
          } else {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LoginStatus */.a, {
              status: "error",
              message: "Not logged in"
            }));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LoginStatus */.a, {
            status: "error",
            message: `Status check error: ${errorMessage}`
          }));
          process.exit(1);
        }
        yield waitUntilExit();
        process.exit(0);
      });
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/