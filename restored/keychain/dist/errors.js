/**
 * Custom error classes for keychain operations
 */
/**
 * Base class for all keychain-related errors
 */
class KeychainError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = this.constructor.name;
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
/**
 * Thrown when attempting to use keychain operations on unsupported platforms
 */
class UnsupportedPlatformError extends KeychainError {
  constructor(platform) {
    super(`Keychain operations are only supported on macOS, got: ${platform}`);
    this.code = "UNSUPPORTED_PLATFORM";
  }
}
/**
 * Thrown when required account parameter is missing
 */
class NoAccountProvidedError extends KeychainError {
  constructor() {
    super("An account is required for keychain operations");
    this.code = "NO_ACCOUNT_PROVIDED";
  }
}
/**
 * Thrown when required service parameter is missing
 */
class NoServiceProvidedError extends KeychainError {
  constructor() {
    super("A service is required for keychain operations");
    this.code = "NO_SERVICE_PROVIDED";
  }
}
/**
 * Thrown when required password parameter is missing
 */
class NoPasswordProvidedError extends KeychainError {
  constructor() {
    super("A password is required for this keychain operation");
    this.code = "NO_PASSWORD_PROVIDED";
  }
}
/**
 * Thrown when required keychain name parameter is missing
 */
class NoKeychainNameProvidedError extends KeychainError {
  constructor() {
    super("A keychain name is required for this operation");
    this.code = "NO_KEYCHAIN_NAME_PROVIDED";
  }
}
/**
 * Thrown when the security command fails to execute
 */
class SecurityCommandError extends KeychainError {
  constructor(message, exitCode, cause) {
    super(`Security command failed: ${message}`, cause);
    this.exitCode = exitCode;
    this.code = "SECURITY_COMMAND_ERROR";
    this.exitCode = exitCode;
  }
}
/**
 * Thrown when a password is not found in the keychain
 */
class PasswordNotFoundError extends KeychainError {
  constructor(account, service) {
    super(`Password not found for account '${account}' and service '${service}'`);
    this.code = "PASSWORD_NOT_FOUND";
  }
}
/**
 * Thrown when keychain operation times out
 */
class KeychainTimeoutError extends KeychainError {
  constructor(timeoutMs) {
    super(`Keychain operation timed out after ${timeoutMs}ms`);
    this.code = "KEYCHAIN_TIMEOUT";
  }
}
/**
 * Thrown when password parsing fails
 */
class PasswordParsingError extends KeychainError {
  constructor(rawOutput) {
    super(`Failed to parse password from security command output: ${rawOutput}`);
    this.code = "PASSWORD_PARSING_ERROR";
  }
}