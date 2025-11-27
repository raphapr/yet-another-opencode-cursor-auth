const backend = {
  log: (ctx, entry) => {
    if (!(0, debug.isDebugEnabled)()) return;
    try {
      (0, debug.debugLog)("console.backend", {
        level: entry.level,
        message: entry.message,
        contextPath: ctx.getPath(),
        metadata: entry.metadata,
        error: entry.error
      });
    } catch (_a) {
      /* ignore */
    }
  }
};
const consoleCtx = (0, dist /* createContext */.q6)().withName("console").with(dist /* loggerKey */._O, backend);
const logger = (0, dist /* createLogger */.h)("console");
function makeHandler(level, source) {
  return (...args) => {
    try {
      let message;
      if (args.length === 0) {
        message = "";
      } else if (typeof args[0] === "string") {
        message = (0, external_node_util_.format)(args[0], ...args.slice(1));
      } else {
        message = args.map(a => (0, external_node_util_.inspect)(a, {
          depth: 6,
          breakLength: Infinity,
          compact: true
        })).join(" ");
      }
      const meta = {
        source
      };
      switch (level) {
        case "debug":
          logger.debug(consoleCtx, message, meta);
          break;
        case "info":
          logger.info(consoleCtx, message, meta);
          break;
        case "warn":
          logger.warn(consoleCtx, message, meta);
          break;
        case "error":
          logger.error(consoleCtx, message, undefined, meta);
          break;
      }
    } catch (_a) {
      /* never throw from console */
    }
  };
}
const shim = {
  log: makeHandler("info", "console.log"),
  info: makeHandler("info", "console.info"),
  warn: makeHandler("warn", "console.warn"),
  error: makeHandler("error", "console.error"),
  debug: makeHandler("debug", "console.debug"),
  trace: makeHandler("debug", "console.trace"),
  clear: () => {}
};
Object.assign(globalThis.console, shim);