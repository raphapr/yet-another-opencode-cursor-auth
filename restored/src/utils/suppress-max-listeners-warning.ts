/**
 * Suppress MaxListenersExceededWarning for process stdio and globally.
 *
 * Sets the global default max listeners for all EventEmitters to unlimited and
 * also updates the existing stdio streams (stdout, stderr, stdin) so that
 * resize or data listeners won't trigger warnings.
 */
function suppressEventEmitterMaxListenersWarnings() {
  try {
    (0, external_node_events_.setMaxListeners)(0);
  } catch (_a) {
    // intentionally ignore
  }
  // Back-compat: some code paths still consult EventEmitter.defaultMaxListeners
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    external_node_events_.EventEmitter.defaultMaxListeners = 0;
  } catch (_b) {
    // intentionally ignore
  }
  const maybeSetUnlimited = emitter => {
    try {
      const ee = emitter;
      if (typeof (ee === null || ee === void 0 ? void 0 : ee.setMaxListeners) === "function") {
        ee.setMaxListeners(0);
      }
    } catch (_a) {
      // intentionally ignore
    }
  };
  maybeSetUnlimited(process.stdout);
  maybeSetUnlimited(process.stderr);
  maybeSetUnlimited(process.stdin);
}