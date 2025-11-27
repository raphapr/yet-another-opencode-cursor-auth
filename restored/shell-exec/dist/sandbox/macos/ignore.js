/**
 * Converts ignore patterns to Apple Seatbelt policy rules.
 *
 * This module extracts regex patterns from the `ignore` library and converts them
 * to Seatbelt policy format for macOS sandboxing.
 *
 * Key features:
 * - Handles negation correctly: !pattern becomes allow rules, pattern becomes deny rules
 * - Converts JavaScript regex syntax to Seatbelt regex syntax
 * - Supports common gitignore patterns like *, **, ?, etc.
 *
 * Example:
 * ```typescript
 * import ignore from 'ignore';
 * const ig = (ignore as any)().add(['*.js', 'node_modules/', '!important.js']);
 * const rules = convertIgnoreToSeatbeltRule('/path/to/repo', ig);
 * // Results in:
 * // (deny file-read-data (regex "^.*\.js$"))
 * // (deny file-read-data (regex "^.*node_modules/.*$"))
 * // (allow file-read-data (regex "^.*important\.js$"))
 * ```
 */
// Serialize a cursorignore mapping to a list of blocked paths
// workspacePaths: allowed workspace directories to scope allow rules for security
function convertCursorIgnoreToBlockedPathsList(cursorIgnoreMapping, workspacePaths = [], emitComments = false) {
  const allAllowRules = [];
  const allDenyRules = [];
  for (const [path, ignore] of Object.entries(cursorIgnoreMapping)) {
    // Skip NoIgnore entries
    if ("__noIgnore" in ignore) {
      continue;
    }
    // Convert file:// URIs to file system paths
    const fsPath = path.startsWith("file://") ? ignore_uriToFsPath(path) : path;
    const {
      allowRules,
      denyRules
    } = convertIgnoreToSeatbeltRule(fsPath, ignore, workspacePaths, emitComments);
    allAllowRules.push(...allowRules);
    allDenyRules.push(...denyRules);
    // For root-relative patterns, also add rules for the canonical path if different
    const canonicalPath = tryGetCanonicalPath(fsPath);
    if (canonicalPath !== fsPath) {
      const {
        allowRules: canonicalAllowRules,
        denyRules: canonicalDenyRules
      } = convertIgnoreToSeatbeltRule(canonicalPath, ignore, workspacePaths, emitComments);
      allAllowRules.push(...canonicalAllowRules);
      allDenyRules.push(...canonicalDenyRules);
    }
  }
  return {
    allowRules: allAllowRules,
    denyRules: allDenyRules
  };
}
function tryGetCanonicalPath(p) {
  try {
    const {
      realpathSync
    } = require("node:fs");
    return realpathSync(p);
  } catch {
    return p;
  }
}
// Convert file:// URI to file system path
function ignore_uriToFsPath(uri) {
  // Remove file:// prefix
  let path = uri.replace(/^file:\/\//, "");
  // Decode URI encoding (e.g., %20 -> space)
  path = decodeURIComponent(path);
  // Remove trailing slash if present (except for root)
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}
// Converts a single ignore rule to a form ready to be added to a seatbelt policy.
// This is the difference between gitignore format and either path or regex format used by seatbelt.
// workspacePaths: allowed workspace directories to scope allow rules for security
function convertIgnoreToSeatbeltRule(dirPath, ignoreInstance, workspacePaths = [], emitComments = false) {
  const rules = extractRegexesFromIgnore(ignoreInstance);
  const allowRules = [];
  const denyRules = [];
  for (const rule of rules) {
    // Convert the regex to Seatbelt format (relative paths -> absolute paths)
    const seatbeltRegex = convertRegexToSeatbeltFormat(rule.ignoreRegexString, dirPath);
    // Skip degenerate transforms that yield no meaningful path pattern
    if (!seatbeltRegex) {
      if (emitComments) {
        const invalidComment = `; invalid ignore: ${rule.originalPattern}`;
        const action = rule.isNegative ? "allow" : "deny";
        if (action === "allow") {
          allowRules.push(invalidComment);
        } else {
          denyRules.push(invalidComment);
        }
      }
      continue;
    }
    // Handle negation: negative rules become allow rules, positive rules become deny rules
    const action = rule.isNegative ? "allow" : "deny";
    const comment = emitComments ? `; ignore: ${rule.originalPattern}` : "";
    if (action === "allow") {
      // SECURITY: Scope allow rules to workspace paths only
      // This prevents negation patterns like "!important.js" from allowing writes outside workspace
      if (workspacePaths.length > 0) {
        // Create workspace path conditions (using OR to match any workspace)
        const workspaceConditions = workspacePaths.map(wsPath => {
          // Escape special regex characters in the path
          const escapedPath = wsPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return `(regex "^${escapedPath}(/.*)?$")`;
        }).join("\n    ");
        // Wrap allow rules with require-all to ensure they only apply within workspace
        const readRule = `${comment ? `${comment}\n` : ""}(allow file-read-data\n  (require-all\n    (regex "${seatbeltRegex}")\n    (require-any\n    ${workspaceConditions}\n    )\n  )\n)`;
        const writeRule = `${comment ? `${comment}\n` : ""}(allow file-write*\n  (require-all\n    (regex "${seatbeltRegex}")\n    (require-any\n    ${workspaceConditions}\n    )\n  )\n)`;
        allowRules.push(readRule);
        allowRules.push(writeRule);
      } else {
        // No workspace paths provided - fallback to unscoped (for backward compatibility in tests)
        const readRule = `${comment ? `${comment}\n` : ""}(allow file-read-data (regex "${seatbeltRegex}"))`;
        const writeRule = `${comment ? `${comment}\n` : ""}(allow file-write* (regex "${seatbeltRegex}"))`;
        allowRules.push(readRule);
        allowRules.push(writeRule);
      }
    } else {
      // Deny rules don't need workspace scoping - denying outside workspace is fine
      const readRule = `${comment ? `${comment}\n` : ""}(deny file-read-data (regex "${seatbeltRegex}"))`;
      const writeRule = `${comment ? `${comment}\n` : ""}(deny file-write* (regex "${seatbeltRegex}"))`;
      denyRules.push(readRule);
      denyRules.push(writeRule);
    }
  }
  return {
    allowRules,
    denyRules
  };
}
// Extract regexes from an Ignore instance by accessing its internal structure
function extractRegexesFromIgnore(ignoreInstance) {
  const results = [];
  let rulesArray;
  // Need to use any here because of differences in the ignore library's internal structure
  // between different versions.
  // biome-ignore lint/suspicious/noExplicitAny: We're accessing the internal rules array
  const rulesProperty = ignoreInstance._rules;
  if (Array.isArray(rulesProperty)) {
    // New structure: _rules is the array directly
    rulesArray = rulesProperty;
  } else if (rulesProperty && Array.isArray(rulesProperty._rules)) {
    // Old structure: _rules is an object with a _rules property that is the array
    rulesArray = rulesProperty._rules;
  }
  if (!rulesArray || rulesArray.length === 0) {
    return results;
  }
  // Get all rules
  // This is somewhat an abuse of the ignore library's API,
  // so be careful when upgrading the ignore library.
  // biome-ignore lint/suspicious/noExplicitAny: We're accessing the internal rules array
  rulesArray.forEach((rule, _index) => {
    const regex = rule.regex;
    results.push({
      originalPattern: rule.pattern,
      patternBody: rule.body,
      isNegative: rule.negative,
      ignoreRegexString: regex.source
    });
  });
  return results;
}
// Convert ignore library regex (for relative paths) to Seatbelt regex (for absolute paths)
function convertRegexToSeatbeltFormat(regexString, baseDir) {
  // Check for invalid empty character class which sandbox-exec rejects
  if (containsEmptyCharacterClass(regexString)) {
    return null;
  }
  // Escape the base directory for regex
  const escapedBaseDir = baseDir.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Handle directory patterns: (?:^|\/)dirname\/$
  // These should match the directory and everything inside it
  // Note: In gitignore, trailing slash means "only match directories"
  if (regexString.startsWith("(?:^|\\/)") && regexString.endsWith("\\/$")) {
    // Extract the directory name
    const pattern = regexString.substring("(?:^|\\/)".length, regexString.length - "\\/$".length);
    if (pattern.length === 0) return null;
    // Use the suffix-style pattern to match the directory and its contents
    // Pattern: /dirname($ or /anything) to match both the directory itself and its contents
    // The $ allows matching "dirname" as a directory, while /.* matches contents
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Handle directory patterns that start with ^: ^path/to/dir\/$
  // These are nested directory patterns (e.g., blocked/nested/)
  if (regexString.startsWith("^") && regexString.endsWith("\\/$")) {
    // Extract the directory path
    const pattern = regexString.substring(1, regexString.length - "\\/$".length);
    if (pattern.length === 0) return null;
    // Use the suffix-style pattern to match the directory and its contents
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Handle globstar patterns: ^(?:.*\/)?pattern...(?=$|\/$)
  // These are patterns like **/src/**/*.tsx or **/*.key or **/cache/**
  if (regexString.startsWith("^(?:") && regexString.includes("(?=$|\\/$)")) {
    // Remove the anchor and lookahead, keep the core pattern
    let pattern = regexString;
    // Remove ^(?:.*\/)? prefix if present - this allows matching at any depth
    if (pattern.startsWith("^(?:.*\\/)?")) {
      pattern = pattern.substring("^(?:.*\\/)?".length);
    } else if (pattern.startsWith("^")) {
      pattern = pattern.substring(1);
    }
    // Remove (?=$|\/$) suffix
    const suffix = "(?=$|\\/$)";
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // For complex patterns like src(?:\/[^\/]+)*\/[^\/]*\.tsx, simplify to src\/.*\.tsx
    // This converts "src" + "zero or more dirs" + "file.tsx" to just "src/...any path.../file.tsx"
    // The regex (?:\/[^\/]+)* means "zero or more directory segments", which we can replace with \/.*
    pattern = pattern.replace(/\(\?:\\\/\[\^\\\/\]\+\)\*/g, "\\/.*");
    // Use the suffix-style pattern: ^.*/ prefix to match anywhere, with ($|/.*) suffix for files/dirs
    if (pattern.length === 0) return null;
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Handle patterns that start with ^ but contain globstar: ^a(?:\/[^\/]+)*\/pattern
  // These are patterns like a/**/b.txt
  if (regexString.startsWith("^") && regexString.includes("(?:\\/[^\\/]+)*") && regexString.includes("(?=$|\\/$)")) {
    // This is a globstar pattern anchored to the base directory
    let pattern = regexString.substring(1); // Remove ^
    const suffix = "(?=$|\\/$)";
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // Simplify the globstar pattern: (?:\/[^\/]+)*\/
    // This means zero or more "/dirname" followed by "/"
    // We need to convert it to something Seatbelt can handle
    // Using alternation: (\/.*\/|\/) means either "/stuff/" or just "/"
    // This avoids the optional group with nested greedy quantifier which might not backtrack well
    pattern = pattern.replace(/\(\?:\\\/\[\^\\\/\]\+\)\*\\\//g, "(\\/.*\\/|\\/)");
    // Anchor to base directory with simplified globstar
    if (pattern.length === 0) return null;
    const result = `^${escapedBaseDir}/${pattern}$`;
    return result;
  }
  // Handle root-relative patterns: ^pattern(?=$|\/$) (without (?:^|\/) or (?:.*\/)? prefix or globstar)
  // These are patterns like /hello.txt that should only match at the base directory root
  if (regexString.startsWith("^") && !regexString.startsWith("^(?:") && regexString.includes("(?=$|\\/$)")) {
    // Remove the anchor and lookahead
    let pattern = regexString.substring(1); // Remove ^
    const suffix = "(?=$|\\/$)";
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // For root-relative patterns, anchor to the base directory
    if (pattern.length === 0) return null;
    const result = `^${escapedBaseDir}/${pattern}$`;
    return result;
  }
  // For patterns that result in (?:^|/)pattern(?=$|/$)
  // Convert this to match the suffix pattern style: ^.*/pattern...
  // This matches the working .vscode pattern: ^.*/\.vscode($|/.*)
  if (regexString.startsWith("(?:^|\\/)") && regexString.includes("(?=$|\\/$)")) {
    // Remove the prefix and suffix
    let pattern = regexString;
    const prefix = "(?:^|\\/)";
    const suffix = "(?=$|\\/$)";
    if (pattern.startsWith(prefix)) {
      pattern = pattern.substring(prefix.length);
    }
    const suffixIndex = pattern.lastIndexOf(suffix);
    if (suffixIndex !== -1) {
      pattern = pattern.substring(0, suffixIndex);
    }
    // Use the suffix-style pattern: ^.*/ prefix to match anywhere, with ($|/.*) suffix for files/dirs
    // This ensures the pattern works the same way as the verified-working .vscode blocking
    if (pattern.length === 0) return null;
    const result = `^.*/${pattern}($|/.*)`;
    return result;
  }
  // Fallback: just make sure it's anchored and prefix with base directory
  let seatbeltRegex = regexString;
  if (!seatbeltRegex.startsWith("^")) {
    seatbeltRegex = `^${escapedBaseDir}/${seatbeltRegex}`;
  } else {
    seatbeltRegex = `^${escapedBaseDir}/${seatbeltRegex.substring(1)}`;
  }
  if (!seatbeltRegex.endsWith("$")) {
    seatbeltRegex = `${seatbeltRegex}$`;
  }
  // Check final pattern for empty character class before returning
  if (containsEmptyCharacterClass(seatbeltRegex)) {
    return null;
  }
  // Fallback result
  return seatbeltRegex;
}
// Detect empty character class [] which is invalid for sandbox-exec regex engine
function containsEmptyCharacterClass(pattern) {
  // Scan for occurrences of [] and ensure '[' is not escaped by an odd number of backslashes
  // Examples that should match: [] , \\[] , \\\\[]
  // Examples that should NOT match: \[] , \\\[]
  for (let i = 0; i < pattern.length - 1; i++) {
    if (pattern.charCodeAt(i) === 91 /* '[' */ && pattern.charCodeAt(i + 1) === 93 /* ']' */) {
      let backslashCount = 0;
      for (let j = i - 1; j >= 0 && pattern.charCodeAt(j) === 92 /* '\\' */; j--) {
        backslashCount++;
      }
      if (backslashCount % 2 === 0) {
        return true;
      }
    }
  }
  return false;
}
//# sourceMappingURL=ignore.js.map