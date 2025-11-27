function createCredentialManager(domain) {
  // Use keychain on macOS, file-based storage on other platforms
  if ((0, external_node_os_.platform)() === "darwin") {
    return new KeychainCredentialManager(domain);
  }
  return new FileCredentialManager(domain);
}