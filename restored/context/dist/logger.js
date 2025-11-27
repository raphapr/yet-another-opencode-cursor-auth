/**
 * Structured logging module that integrates with the context system
 */

const defaultLoggerBackend = {
  log: (_ctx, {
    level,
    message,
    metadata,
    error
  }) => {
    const elements = [level, message, metadata, error].filter(x => x !== undefined);
    if (level === "error") {
      console.error(...elements);
    } else {
      console.log(...elements);
    }
  }
};
/**
 * Context key for storing the logger
 */
const loggerKey = createKey(Symbol("loggerBackend"), defaultLoggerBackend);
function getLoggerBackend(ctx) {
  return ctx.get(loggerKey);
}
function createLogger(_name) {
  function log(ctx, entry) {
    const timestamp = new Date();
    const logger = getLoggerBackend(ctx);
    logger.log(ctx, Object.assign(Object.assign({}, entry), {
      timestamp
    }));
  }
  return {
    debug: (ctx, message, metadata) => {
      log(ctx, {
        level: "debug",
        message,
        context: ctx,
        metadata
      });
    },
    info: (ctx, message, metadata) => {
      log(ctx, {
        level: "info",
        message,
        context: ctx,
        metadata
      });
    },
    warn: (ctx, message, metadata) => {
      log(ctx, {
        level: "warn",
        message,
        context: ctx,
        metadata
      });
    },
    error: (ctx, message, error, metadata) => {
      log(ctx, {
        level: "error",
        message,
        context: ctx,
        error,
        metadata
      });
    }
  };
}