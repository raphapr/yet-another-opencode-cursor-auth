var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
let debugSession = null;
const lineEmitter = new external_node_events_.EventEmitter();
function htmlPage(_serverUrl) {
  return DEBUG_PAGE_HTML;
}
function initDebug() {
  return __awaiter(this, void 0, void 0, function* () {
    if (debugSession) return debugSession;
    const base = (0, external_node_path_.join)((0, external_node_os_.tmpdir)(), "cursor-agent-debug-");
    const directory = (0, external_node_fs_.mkdtempSync)(base);
    const logFile = (0, external_node_path_.join)(directory, "session.log");
    const basePortEnv = process.env.CURSOR_AGENT_DEBUG_PORT;
    const BASE_PORT = basePortEnv ? Number(basePortEnv) : 43111;
    const MAX_ATTEMPTS = 50;
    (0, external_node_fs_.writeFileSync)(logFile, `--- Cursor Agent Debug Session ${new Date().toISOString()} ---\n`);
    const server = (0, external_node_http_.createServer)((req, res) => {
      try {
        if (!req.url) {
          res.statusCode = 404;
          res.end();
          return;
        }
        if (req.url === "/" || req.url.startsWith("/index")) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(htmlPage(serverUrl()));
          return;
        }
        if (req.url === "/log") {
          try {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end((0, external_node_fs_.readFileSync)(logFile, "utf8"));
          } catch (e) {
            res.statusCode = 500;
            res.end(String(e));
          }
          return;
        }
        if (req.url === "/events") {
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*"
          });
          const listener = line => {
            res.write(`data: ${JSON.stringify(line)}\n\n`);
          };
          lineEmitter.on("line", listener);
          req.on("close", () => lineEmitter.off("line", listener));
          return;
        }
        res.statusCode = 404;
        res.end("Not found");
      } catch (e) {
        res.statusCode = 500;
        res.end(String(e));
      }
    });
    function serverUrl() {
      const addr = server.address();
      if (addr && typeof addr === "object" && "port" in addr) {
        return `http://127.0.0.1:${addr.port}`;
      }
      return "http://127.0.0.1:0";
    }
    const append = rawLine => {
      try {
        (0, external_node_fs_.appendFileSync)(logFile, rawLine.endsWith("\n") ? rawLine : `${rawLine}\n`, "utf8");
        lineEmitter.emit("line", rawLine);
      } catch (_a) {
        /* ignore */
      }
    };
    const log = (...args) => {
      const line = args.map(a => {
        if (typeof a === "string") return a;
        try {
          return JSON.stringify(a);
        } catch (_a) {
          return String(a);
        }
      }).join(" ");
      append(`[${new Date().toISOString()}] ${line}`);
    };
    let attemptCount = 0;
    let ephemeralFallback = false;
    const chosenPort = yield new Promise(resolve => {
      const tryListen = port => {
        server.once("error", err => {
          const code = err.code;
          if (code === "EADDRINUSE" && attemptCount < MAX_ATTEMPTS) {
            attemptCount++;
            tryListen(BASE_PORT + attemptCount);
          } else {
            // Fallback to ephemeral
            ephemeralFallback = true;
            server.removeAllListeners("listening");
            server.listen(0, "127.0.0.1");
            server.once("listening", () => resolve(server.address().port));
          }
        });
        server.once("listening", () => {
          resolve(server.address().port);
        });
        server.listen(port, "127.0.0.1");
      };
      tryListen(BASE_PORT);
    });
    debugSession = {
      enabled: true,
      directory,
      logFile,
      serverPort: chosenPort,
      get serverUrl() {
        return serverUrl();
      },
      append,
      log,
      stop: () => __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => server.close(() => resolve()));
      })
    };
    // Initial session metadata log (pure JSON for easy parsing)
    debugSession.append(JSON.stringify({
      event: "debug-session-start",
      port: chosenPort,
      basePort: BASE_PORT,
      attempts: attemptCount + 1,
      ephemeralFallback: ephemeralFallback,
      directory: directory,
      logFile: logFile,
      pid: process.pid,
      startTime: new Date().toISOString()
    }));
    const shutdown = () => {
      if (debugSession) {
        try {
          server.close();
        } catch (_a) {
          /* ignore */
        }
        debugSession = null;
      }
    };
    process.once("exit", shutdown);
    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
    return debugSession;
  });
}
function isDebugEnabled() {
  return !!debugSession;
}
function getDebugSession() {
  return debugSession;
}
function debugLog(...args) {
  if (debugSession) debugSession.log(...args);
}
function debugTrace(...args) {
  var _a;
  if (debugSession) {
    const message = args.map(a => {
      if (typeof a === "string") return a;
      try {
        return JSON.stringify(a);
      } catch (_a) {
        return String(a);
      }
    }).join(" ");
    const stack = ((_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split("\n").slice(1).join("\n")) || "No stack trace available";
    debugSession.append(`[${new Date().toISOString()}] ${message}\nStack trace:\n${stack}`);
  }
}
function pushDebugLogLine(line) {
  if (debugSession) debugSession.append(line);
}
function debugLogJSON(label, data, level = "DEBUG") {
  if (!debugSession) return;
  const payload = {
    event: label,
    level,
    data
  };
  try {
    debugSession.append(JSON.stringify(payload));
  } catch (e) {
    // Fallback to plain string if JSON serialization fails
    debugSession.append(`[${new Date().toISOString()}] ${label} ${String(e)}`);
  }
}