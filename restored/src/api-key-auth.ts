/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */D: () => (/* binding */tryAuthTokenAuth),
  /* harmony export */T: () => (/* binding */tryApiKeyAuth)
  /* harmony export */
});
/* harmony import */
var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */
var _console_io_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/console-io.ts");
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
function tryApiKeyAuth(credentialManager, options) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    const apiKey = (_a = options.apiKey) !== null && _a !== void 0 ? _a : process.env.CURSOR_API_KEY;
    const usingApiKeyFromEnv = !options.apiKey && !!process.env.CURSOR_API_KEY;
    if (!apiKey) {
      return {
        isAuthenticated: false,
        usingApiKeyFromEnv: false
      };
    }
    const loginManager = new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_0__ /* .LoginManager */.Pl();
    const authResult = yield loginManager.loginWithApiKey(apiKey, {
      endpoint: options.endpoint
    });
    if ((authResult === null || authResult === void 0 ? void 0 : authResult.accessToken) && authResult.refreshToken) {
      yield credentialManager.setAuthentication(authResult.accessToken, authResult.refreshToken, apiKey);
      return {
        isAuthenticated: true,
        usingApiKeyFromEnv
      };
    } else {
      (0, _console_io_js__WEBPACK_IMPORTED_MODULE_1__ /* .intentionallyWriteToStderr */.p2)("\x1b[33m⚠ Warning: The provided API key is invalid.\x1b[0m\n" + (usingApiKeyFromEnv ? "The API key was loaded from the CURSOR_API_KEY environment variable.\n" : "") + "Please check you have the right key, create a new one, or authenticate without it.");
    }
    process.exit(1);
  });
}
function tryAuthTokenAuth(credentialManager, options) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    const authToken = (_a = options.authToken) !== null && _a !== void 0 ? _a : process.env.CURSOR_AUTH_TOKEN;
    const usingAuthTokenFromEnv = !options.authToken && !!process.env.CURSOR_AUTH_TOKEN;
    if (!authToken) {
      return {
        isAuthenticated: false,
        usingAuthTokenFromEnv: false
      };
    }
    yield credentialManager.setAuthentication(authToken, authToken);
    return {
      isAuthenticated: true,
      usingAuthTokenFromEnv
    };
  });
}

/***/