/**
 * Filters out ELECTRON_RUN_AS_NODE from the environment to prevent issues with dependencies like Cypress.
 * This environment variable is set by Electron/VSCode and can break tools that detect if they're
 * running under Node.js vs Electron (e.g., Cypress tests fail when this is set).
 *
 * @param env - The environment object to filter. If undefined, uses process.env
 * @returns A new environment object without ELECTRON_RUN_AS_NODE
 */
function filterElectronEnv(env) {
  const sourceEnv = env || process.env;
  // biome-ignore lint/correctness/noUnusedVariables: We're destructuring to strip this env var
  const {
    ELECTRON_RUN_AS_NODE,
    ...filteredEnv
  } = sourceEnv;
  return filteredEnv;
}
//# sourceMappingURL=env-filter.js.map