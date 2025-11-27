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

/**
 * Default timeout for keychain operations (30 seconds)
 */
const DEFAULT_TIMEOUT_MS = 30000;
/**
 * Modern TypeScript interface for macOS Keychain access
 */
class KeychainAccess {
  constructor(config = {}) {
    var _a, _b;
    this.executablePath = (_a = config.executablePath) !== null && _a !== void 0 ? _a : "/usr/bin/security";
    this.timeoutMs = (_b = config.timeoutMs) !== null && _b !== void 0 ? _b : DEFAULT_TIMEOUT_MS;
    // Validate platform on construction
    if (false)
      // removed by dead control flow
      {}
  }
  /**
   * Retrieve a password from the keychain
   */
  getPassword(options) {
    return __awaiter(this, void 0, void 0, function* () {
      this.validateGetPasswordOptions(options);
      const {
        account,
        service,
        type = "generic"
      } = options;
      const args = [`find-${type}-password`, "-a", account, "-s", service, "-g"];
      try {
        const {
          stderr
        } = yield this.executeSecurityCommand(args);
        return this.parsePassword(stderr, account, service);
      } catch (error) {
        if (error instanceof SecurityCommandError && error.exitCode !== 0) {
          throw new PasswordNotFoundError(account, service);
        }
        throw error;
      }
    });
  }
  /**
   * Set/update a password in the keychain
   */
  setPassword(options) {
    return __awaiter(this, void 0, void 0, function* () {
      this.validateSetPasswordOptions(options);
      const {
        account,
        service,
        password,
        type = "generic"
      } = options;
      const args = [`add-${type}-password`, "-a", account, "-s", service, "-w", password];
      try {
        yield this.executeSecurityCommand(args);
      } catch (error) {
        if (error instanceof SecurityCommandError && error.exitCode === 45) {
          // Password already exists, delete and retry
          yield this.deletePassword({
            account,
            service,
            type
          });
          yield this.executeSecurityCommand(args);
        } else {
          throw error;
        }
      }
    });
  }
  /**
   * Delete a password from the keychain
   */
  deletePassword(options) {
    return __awaiter(this, void 0, void 0, function* () {
      this.validateDeletePasswordOptions(options);
      const {
        account,
        service,
        type = "generic"
      } = options;
      const args = [`delete-${type}-password`, "-a", account, "-s", service];
      try {
        yield this.executeSecurityCommand(args);
      } catch (error) {
        if (error instanceof SecurityCommandError && error.exitCode !== 0) {
          throw new PasswordNotFoundError(account, service);
        }
        throw error;
      }
    });
  }
  /**
   * Create a new keychain
   */
  createKeychain(options) {
    return __awaiter(this, void 0, void 0, function* () {
      this.validateCreateKeychainOptions(options);
      const {
        keychainName,
        password
      } = options;
      const args = ["create-keychain", "-p", password, keychainName];
      yield this.executeSecurityCommand(args);
    });
  }
  /**
   * Delete a keychain
   */
  deleteKeychain(options) {
    return __awaiter(this, void 0, void 0, function* () {
      this.validateDeleteKeychainOptions(options);
      const {
        keychainName
      } = options;
      const args = ["delete-keychain", keychainName];
      yield this.executeSecurityCommand(args);
    });
  }
  /**
   * Set the default keychain
   */
  setDefaultKeychain(options) {
    return __awaiter(this, void 0, void 0, function* () {
      this.validateSetDefaultKeychainOptions(options);
      const {
        keychainName
      } = options;
      const args = ["default-keychain", "-s", keychainName];
      yield this.executeSecurityCommand(args);
    });
  }
  /**
   * Execute a security command with proper error handling and timeout
   */
  executeSecurityCommand(args) {
    return new Promise((resolve, reject) => {
      var _a, _b;
      const child = (0, external_node_child_process_.spawn)(this.executablePath, args);
      let stdout = "";
      let stderr = "";
      let isResolved = false;
      // Set up timeout
      const timeout = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          child.kill("SIGTERM");
          reject(new KeychainTimeoutError(this.timeoutMs));
        }
      }, this.timeoutMs);
      (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", data => {
        stdout += data.toString();
      });
      (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", data => {
        stderr += data.toString();
      });
      child.on("error", error => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeout);
          reject(new SecurityCommandError(`Failed to spawn security process: ${error.message}`, undefined, error));
        }
      });
      child.on("close", (code, signal) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeout);
          if (signal) {
            reject(new SecurityCommandError(`Security process was killed with signal: ${signal}`));
          } else if (code !== 0) {
            reject(new SecurityCommandError(`Security process exited with code: ${code}`, code !== null && code !== void 0 ? code : undefined));
          } else {
            resolve({
              stdout,
              stderr
            });
          }
        }
      });
    });
  }
  /**
   * Parse password from security command output
   */
  parsePassword(output, account, service) {
    if (!output.includes("password")) {
      throw new PasswordNotFoundError(account, service);
    }
    // Handle hex-encoded passwords
    const hexMatch = output.match(/^password: 0x([0-9a-fA-F]+)/);
    if (hexMatch) {
      try {
        return Buffer.from(hexMatch[1], "hex").toString("utf8");
      } catch (_error) {
        throw new PasswordParsingError(output);
      }
    }
    // Handle quoted passwords
    const quotedMatch = output.match(/"(.*)"/);
    if (quotedMatch) {
      return quotedMatch[1];
    }
    throw new PasswordParsingError(output);
  }
  // Validation methods
  validateGetPasswordOptions(options) {
    if (!options.account) {
      throw new NoAccountProvidedError();
    }
    if (!options.service) {
      throw new NoServiceProvidedError();
    }
  }
  validateSetPasswordOptions(options) {
    if (!options.account) {
      throw new NoAccountProvidedError();
    }
    if (!options.service) {
      throw new NoServiceProvidedError();
    }
    if (!options.password) {
      throw new NoPasswordProvidedError();
    }
  }
  validateDeletePasswordOptions(options) {
    if (!options.account) {
      throw new NoAccountProvidedError();
    }
    if (!options.service) {
      throw new NoServiceProvidedError();
    }
  }
  validateCreateKeychainOptions(options) {
    if (!options.keychainName) {
      throw new NoKeychainNameProvidedError();
    }
    if (!options.password) {
      throw new NoPasswordProvidedError();
    }
  }
  validateDeleteKeychainOptions(options) {
    if (!options.keychainName) {
      throw new NoKeychainNameProvidedError();
    }
  }
  validateSetDefaultKeychainOptions(options) {
    if (!options.keychainName) {
      throw new NoKeychainNameProvidedError();
    }
  }
}