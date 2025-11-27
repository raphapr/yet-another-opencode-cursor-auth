__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */
    __webpack_require__.d(__webpack_exports__, {
      /* harmony export */handleLogout: () => (/* binding */handleLogout)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_keychain__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../keychain/dist/index.js");
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
    function handleLogout(credentialManager, configProvider) {
      return __awaiter(this, void 0, void 0, function* () {
        // Render the status component
        const {
          rerender
        } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LogoutStatus */.L, {
          status: "starting"
        }));
        try {
          const accessToken = yield credentialManager.getAccessToken();
          if (!accessToken) {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LogoutStatus */.L, {
              status: "success",
              message: "Authentication tokens removed."
            }));
            process.exit(0);
          }
        } catch (error) {
          if (error instanceof _anysphere_keychain__WEBPACK_IMPORTED_MODULE_2__ /* .PasswordNotFoundError */.fI) {
            rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LogoutStatus */.L, {
              status: "success",
              message: "Authentication tokens removed."
            }));
            process.exit(0);
          }
        }
        try {
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LogoutStatus */.L, {
            status: "in-progress"
          }));
          yield credentialManager.clearAuthentication();
          yield configProvider.transform(c => Object.assign(Object.assign({}, c), {
            privacyCache: undefined
          }));
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LogoutStatus */.L, {
            status: "success",
            message: "Authentication tokens removed."
          }));
        } catch (error) {
          rerender((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_login_ui_js__WEBPACK_IMPORTED_MODULE_3__ /* .LogoutStatus */.L, {
            status: "error",
            message: `Failed to remove authentication tokens: ${error}`
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