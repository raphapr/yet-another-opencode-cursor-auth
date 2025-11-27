/**
 * @anysphere/keychain - Modern TypeScript library for macOS Keychain access
 *
 * This library provides a modern, well-typed interface for accessing the macOS Keychain
 * using the system's `security` command-line tool.
 *
 * @example
 * ```typescript
 * import { KeychainAccess } from '@anysphere/keychain';
 *
 * const keychain = new KeychainAccess();
 *
 * // Store a password
 * await keychain.setPassword({
 *   account: 'user@example.com',
 *   service: 'MyApp',
 *   password: 'secret123' // pragma: allowlist secret
 * });
 *
 * // Retrieve a password
 * const password = await keychain.getPassword({
 *   account: 'user@example.com',
 *   service: 'MyApp'
 * });
 *
 * // Delete a password
 * await keychain.deletePassword({
 *   account: 'user@example.com',
 *   service: 'MyApp'
 * });
 * ```
 */
// Errors

// Main class