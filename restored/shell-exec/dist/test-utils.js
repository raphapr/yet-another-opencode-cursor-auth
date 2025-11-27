// Type assertion to help TypeScript understand the ignore module
const test_utils_ignore = ignore;
// Helper function to collect all events from an async iterable
async function collectEvents(iterable) {
  const events = [];
  for await (const event of iterable) {
    events.push(event);
  }
  return events;
}
// Helper function to check if a shell is available
function isShellAvailable(shell) {
  try {
    const {
      execFileSync
    } = require("node:child_process");
    execFileSync("which", [shell], {
      stdio: "ignore"
    });
    return true;
  } catch {
    return false;
  }
}
// Helper to skip test if shell is not available
function skipIfShellUnavailable(shell) {
  if (!isShellAvailable(shell)) {
    console.log(`Skipping test - ${shell} not available`);
    return;
  }
}
/**
 * Helper function to create an IgnoreMapping from gitignore-style patterns
 * @param patterns Array of gitignore-style patterns
 * @param baseDir Base directory to apply the patterns to
 * @returns IgnoreMapping with the patterns applied to the base directory
 */
function createIgnoreMapping(patterns, baseDir) {
  if (!patterns || patterns.length === 0) {
    return {};
  }
  // Filter out empty strings, whitespace-only strings, and comments
  const validPatterns = patterns.map(pattern => pattern.trim()).filter(pattern => pattern !== "" && !pattern.startsWith("#"));
  if (validPatterns.length === 0) {
    return {};
  }
  // Create an ignore instance with the patterns
  const ignoreInstance = test_utils_ignore().add(validPatterns);
  return {
    [baseDir]: ignoreInstance
  };
}
//# sourceMappingURL=test-utils.js.map