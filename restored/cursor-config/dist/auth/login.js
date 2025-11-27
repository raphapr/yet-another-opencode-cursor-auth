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

// Configuration
const CURSOR_WEBSITE_URL = "https://cursor.com";
const CURSOR_API_BASE_URL = "https://api2.cursor.sh";
const POLLING_ENDPOINT = `${CURSOR_API_BASE_URL}/auth/poll`;
/**
 * Base64 URL encode a buffer
 * @param {Buffer} buffer
 * @returns {string}
 */
function base64URLEncode(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
/**
 * Generate a SHA-256 hash of the input string
 * @param {string} data
 * @returns {Buffer}
 */
function sha256(data) {
  return external_node_crypto_.createHash("sha256").update(data).digest();
}
/**
 * Generate a UUID v4
 * @returns {string}
 */
function generateUuid() {
  return external_node_crypto_.randomUUID();
}
/**
 * Generate authentication parameters
 * @returns {Promise<AuthParams>}
 */
function generateAuthParams() {
  // Generate a 32-byte random verifier
  const verifierArray = external_node_crypto_.randomBytes(32);
  const verifier = base64URLEncode(verifierArray);
  // Generate challenge by SHA-256 hashing the verifier
  const challengeHash = sha256(verifier);
  const challenge = base64URLEncode(challengeHash);
  // Generate a UUID
  const uuid = generateUuid();
  // Construct the login URL
  const loginUrl = `${CURSOR_WEBSITE_URL}/loginDeepControl?challenge=${challenge}&uuid=${uuid}&mode=login&redirectTarget=cli`;
  return {
    uuid,
    challenge,
    verifier,
    // You'll need this for the polling endpoint
    loginUrl
  };
}
function exchangeApiKeyForTokens(apiKey, options) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    const baseUrl = (_a = options === null || options === void 0 ? void 0 : options.endpoint) !== null && _a !== void 0 ? _a : CURSOR_API_BASE_URL;
    try {
      const response = yield fetch(`${baseUrl}/auth/exchange_user_api_key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({})
      });
      if (!response.ok) return null;
      const authResult = yield response.json();
      if (typeof authResult === "object" && authResult !== null && "accessToken" in authResult && "refreshToken" in authResult) {
        return authResult;
      }
    } catch (_b) {}
    return null;
  });
}
/**
 * Poll for authentication status
 * @param {string} uuid
 * @param {string} verifier
 * @returns {Promise<AuthResult | null>}
 */
function pollAuthenticationStatus(uuid, verifier) {
  return __awaiter(this, void 0, void 0, function* () {
    const maxAttempts = 150; // Maximum number of attempts
    const baseDelay = 1000; // 1 second base delay
    const maxDelay = 10000; // 10 seconds maximum delay
    const backoffMultiplier = 1.2; // Gentle exponential backoff
    const maxConsecutiveErrors = 3; // Stop after 3 consecutive non-404 errors
    let consecutiveErrors = 0;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = yield fetch(`${POLLING_ENDPOINT}?uuid=${uuid}&verifier=${verifier}`, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        // 404 means authentication is still pending
        if (response.status === 404) {
          // Reset error counter on 404 (pending authentication is expected)
          consecutiveErrors = 0;
          // Calculate delay with exponential backoff
          const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
          yield new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        // Check for other error statuses
        if (!response.ok) {
          consecutiveErrors++;
          if (consecutiveErrors >= maxConsecutiveErrors) {
            return null; // Stop retrying after 3 consecutive non-404 errors
          }
          // Calculate delay with exponential backoff even on error
          const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
          yield new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        // Success case - reset error counter
        consecutiveErrors = 0;
        const authResult = yield response.json();
        if (typeof authResult === "object" && authResult !== null && "accessToken" in authResult && "refreshToken" in authResult) {
          return authResult;
        }
        return null;
      } catch (_error) {
        consecutiveErrors++;
        if (consecutiveErrors >= maxConsecutiveErrors) {
          return null; // Stop retrying after 3 consecutive non-404 errors
        }
        // Calculate delay with exponential backoff otherwise
        const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay);
        yield new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return null; // Timeout after max attempts
  });
}
class LoginManager {
  startLogin() {
    const authParams = generateAuthParams();
    return {
      metadata: {
        uuid: authParams.uuid,
        verifier: authParams.verifier
      },
      loginUrl: authParams.loginUrl
    };
  }
  waitForResult(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
      return pollAuthenticationStatus(metadata.uuid, metadata.verifier);
    });
  }
  loginWithApiKey(apiKey, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return exchangeApiKeyForTokens(apiKey, options);
    });
  }
  login(linkHandler) {
    return __awaiter(this, void 0, void 0, function* () {
      const {
        metadata,
        loginUrl
      } = this.startLogin();
      yield linkHandler.openUrl(loginUrl);
      return this.waitForResult(metadata);
    });
  }
}