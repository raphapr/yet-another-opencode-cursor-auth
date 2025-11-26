/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */nH: () => (/* binding */isTokenExpiringSoon),
  /* harmony export */uX: () => (/* binding */getValidAccessToken)
  /* harmony export */
});
/* unused harmony export refreshTokenWithApiKey */
/* harmony import */
var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../cursor-config/dist/index.js");
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

// We don't check sig, so ONLY use for expiration check
function decodeJwt_ONLY_FOR_EXPIRATION_CHECK(token) {
  const base64Payload = token.split(".")[1];
  const payloadBuffer = Buffer.from(base64Payload, "base64");
  return JSON.parse(payloadBuffer.toString());
}
function isTokenExpiringSoon(token) {
  try {
    const decoded = decodeJwt_ONLY_FOR_EXPIRATION_CHECK(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    // Token expires in less than 5 minutes (300 seconds)
    return expirationTime - currentTime < 300;
  } catch (_a) {
    // If we can't decode the token, consider it expired
    return true;
  }
}
function refreshTokenWithApiKey(credentialManager, endpoint) {
  return __awaiter(this, void 0, void 0, function* () {
    const apiKey = yield credentialManager.getApiKey();
    if (!apiKey) {
      return null;
    }
    const loginManager = new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_0__ /* .LoginManager */.Pl();
    const authResult = yield loginManager.loginWithApiKey(apiKey, {
      endpoint
    });
    if ((authResult === null || authResult === void 0 ? void 0 : authResult.accessToken) && authResult.refreshToken) {
      // Update stored tokens
      yield credentialManager.setAuthentication(authResult.accessToken, authResult.refreshToken, apiKey);
      return authResult.accessToken;
    }
    return null;
  });
}
/**
 * Gets a valid access token, refreshing if necessary.
 */
function getValidAccessToken(credentialManager, endpoint) {
  return __awaiter(this, void 0, void 0, function* () {
    const currentToken = yield credentialManager.getAccessToken();
    if (!currentToken) {
      return null;
    }
    if (!isTokenExpiringSoon(currentToken)) {
      return currentToken;
    }
    // TODO: Make sure to redirect the user to login if they're logged in without an API key and their token is expiring
    // We have 2 months!
    const apiKey = yield credentialManager.getApiKey();
    if (apiKey) {
      const newToken = yield refreshTokenWithApiKey(credentialManager, endpoint);
      if (newToken) {
        return newToken;
      }
    }
    return currentToken;
  });
}

/***/