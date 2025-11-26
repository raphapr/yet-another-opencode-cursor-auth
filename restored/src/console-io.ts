/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */OT: () => (/* binding */intentionallyWriteToStdout),
  /* harmony export */p2: () => (/* binding */intentionallyWriteToStderr),
  /* harmony export */uQ: () => (/* binding */exitWithMessage)
  /* harmony export */
});
// Centralized, explicit terminal writes for the few places we want to print
// without going through Ink rendering or the context logger.
// Only use if you _must_.
function intentionallyWriteToStdout(text) {
  try {
    process.stdout.write(ensureNewline(text));
  } catch (_a) {
    /* ignore */
  }
}
function intentionallyWriteToStderr(text) {
  try {
    process.stderr.write(ensureNewline(text));
  } catch (_a) {
    /* ignore */
  }
}
function ensureNewline(s) {
  return s.endsWith("\n") ? s : `${s}\n`;
}
function exitWithMessage(code, message) {
  try {
    intentionallyWriteToStderr(message);
  } finally {
    // Ensure process termination regardless of write success
    process.exit(code);
  }
}

/***/