// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  debugLog: () => (/* binding */debugLog),
  debugLogJSON: () => (/* binding */debugLogJSON),
  debugTrace: () => (/* binding */debugTrace),
  getDebugSession: () => (/* binding */getDebugSession),
  initDebug: () => (/* binding */initDebug),
  isDebugEnabled: () => (/* binding */isDebugEnabled),
  pushDebugLogLine: () => (/* binding */pushDebugLogLine)
});

// EXTERNAL MODULE: external "node:events"
var external_node_events_ = __webpack_require__("node:events");
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__("node:fs");
// EXTERNAL MODULE: external "node:http"
var external_node_http_ = __webpack_require__("node:http");
// EXTERNAL MODULE: external "node:os"
var external_node_os_ = __webpack_require__("node:os");
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__("node:path");
; // ./src/debug-page-html.ts
// Exported debug page HTML as a string constant to keep debug.ts lean.
// Pure HTML + inline JS (no TypeScript in the embedded script).
// Escaped form: all literal newlines converted to \n and all backslashes doubled so this is safe to embed/serialize.
const DEBUG_PAGE_HTML = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset='utf-8'/>\n<title>Cursor Agent Debug</title>\n<style>\n  html,body { height:100%; }\n  body { font-family: monospace; background:#111; color:#eee; margin:0; padding:0; overflow-y:scroll; }\n  /* Global scrollbar styling */\n  html { scrollbar-color:#333 #111; scrollbar-width:thin; }\n  ::-webkit-scrollbar { width:10px; background:#111; }\n  ::-webkit-scrollbar-track { background:#111; }\n  ::-webkit-scrollbar-thumb { background:#333; border-radius:4px; }\n  ::-webkit-scrollbar-thumb:hover { background:#444; }\n  #log { font-size:12px; line-height:1.35; padding:12px; font-family: SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace; white-space:pre-wrap; }\n  header { background:#222; padding:6px 12px; font-size:13px; color:#9cf; border-bottom:1px solid #333; display:flex; gap:12px; align-items:center; position:sticky; top:0; z-index:10; }\n  button, select { background:#333; color:#eee; border:1px solid #444; padding:4px 8px; cursor:pointer; font-size:12px; }\n  button:hover, select:hover { background:#444; }\n  .status { font-size:11px; color:#888; margin-left:8px; }\n  #log .row { font-size:12px; line-height:1.3; white-space:normal; border-left:3px solid #222; padding:4px 6px 6px 6px; margin:0 0 6px 0; background:#121212; }\n  #log .row.collapsed { border-color:#333; }\n  #log .row .meta { color:#666; display:flex; gap:6px; align-items:center; }\n  #log .row .t { color:#666; }\n  #log .row .lvl { font-weight:600; padding:0 2px; border-radius:2px; }\n  #log .row .lvl-info { color:#9cf; }\n  #log .row .lvl-warn { color:#f8d66b; }\n  #log .row .lvl-error { color:#ff6b6b; }\n  #log .row .lvl-debug { color:#888; }\n  #log .row pre.json { margin:4px 0 0 0; padding:4px 6px; background:#1c1c1c; border:1px solid #262626; overflow:auto; }\n  #log .row.collapsed pre.json { display:none; }\n  #log .row .single-line { display:none; }\n  #log .row.collapsed .single-line { display:inline; color:#bbb; }\n  #log .hint { display:none; }\n</style>\n</head>\n<body>\n<header>\n  <div>Cursor Agent Debug Session</div>\n  <div class='status' id='status'>connecting…</div>\n  <div style='flex:1'></div>\n  <button onclick='window.download()'>Download</button>\n  <button onclick='window.clearLog()'>Clear (view)</button>\n</header>\n<div id='log'></div>\n<script>(function(){'use strict';var logEl=document.getElementById('log');var statusEl=document.getElementById('status');var headerEl=document.querySelector('header');var controls=document.createElement('div');controls.style.display='flex';controls.style.gap='8px';controls.style.alignItems='center';var modeBtn=document.createElement('button');modeBtn.textContent='Raw';var levelSel=document.createElement('select');['ALL','INFO','WARN','ERROR','DEBUG'].forEach(function(l){var o=document.createElement('option');o.value=l;o.textContent=l;levelSel.appendChild(o);});controls.appendChild(modeBtn);controls.appendChild(levelSel);if(headerEl&&headerEl.children.length>=2){headerEl.insertBefore(controls,headerEl.children[headerEl.children.length-2]);}var prettyMode=true;var levelFilter='ALL';var lines=[];function atBottom(){return(window.innerHeight+window.scrollY)>=(document.body.offsetHeight-4);}function classify(raw){var pl={raw:raw,obj:undefined,ts:undefined,level:undefined,msg:undefined};var o;try{o=JSON.parse(raw);if(o&&typeof o==='object'&&o.data!==undefined&&(o.event||o.level)){pl.obj=o.data;pl.level=String(o.level||'').toUpperCase();pl.msg=o.event||'';pl.ts=new Date().toISOString();}else{pl.obj=o;pl.level=String(o.logLevelName||o.level||'').toUpperCase();pl.ts=o.date||o.time||o.timestamp||o.ts;if(!pl.ts){var m=raw.match(/\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3,}Z/);if(m)pl.ts=m[0];}if(Array.isArray(o.argumentsArray)&&o.argumentsArray.length){pl.msg=o.argumentsArray.map(function(a){if(typeof a==='string')return a;try{return JSON.stringify(a);}catch{return String(a);}}).join(' ');}else if(o.event){pl.msg=o.event;}}}catch{var m2=raw.match(/^\\[(\\d{4}-\\d{2}-\\d{2}T[^\\]]+)\\]\\s*(.*)$/);if(m2){pl.ts=m2[1];pl.msg=m2[2];}}if(!pl.msg)pl.msg=raw;return pl;}function oneLineJSON(obj){try{return JSON.stringify(obj);}catch(e){return String(obj);}}function render(){if(!prettyMode){logEl.textContent=lines.map(function(l){return l.raw;}).join('\\n');return;}logEl.innerHTML='';for(var i=0;i<lines.length;i++){var pl=lines[i];if(levelFilter!=='ALL'&&(pl.level||'')!==levelFilter)continue;var row=document.createElement('div');row.className='row';var meta=document.createElement('div');meta.className='meta';var t=document.createElement('span');t.className='t';t.textContent=pl.ts?pl.ts.replace(/Z$/,''):'';var lvl=document.createElement('span');lvl.className='lvl '+(pl.level?('lvl-'+pl.level.toLowerCase()):'lvl-unknown');lvl.textContent=pl.level||'';var hint=document.createElement('span');hint.className='hint';hint.textContent='(click to collapse)';meta.appendChild(t);meta.appendChild(document.createTextNode(' '));meta.appendChild(lvl);row.appendChild(meta);if(pl.obj){if(pl.msg){meta.appendChild(document.createTextNode(' '));var msgSpan=document.createElement('span');msgSpan.textContent=pl.msg;msgSpan.style.color='#bbb';meta.appendChild(msgSpan);}var pre=document.createElement('pre');pre.className='json';pre.textContent=JSON.stringify(pl.obj,null,2);var single=document.createElement('span');single.className='single-line';single.textContent=oneLineJSON(pl.obj);row.appendChild(pre);row.appendChild(single);}else{var msg=document.createElement('span');msg.className='msg';msg.textContent=pl.msg||pl.raw;row.appendChild(msg);}logEl.appendChild(row);} }function add(rawLine){var stick=atBottom();lines.push(classify(rawLine));render();if(stick)window.scrollTo(0,document.body.scrollHeight);}modeBtn.onclick=function(){prettyMode=!prettyMode;modeBtn.textContent=prettyMode?'Raw':'Pretty';render();};levelSel.onchange=function(){levelFilter=levelSel.value;render();};async function fetchFull(){try{var r=await fetch('log',{cache:'no-store'});if(r.ok){var txt=await r.text();lines.length=0;txt.split(/\\r?\\n/).filter(Boolean).forEach(function(l){lines.push(classify(l));});render();window.scrollTo(0,document.body.scrollHeight);}}catch(e){add('[fetchFull error] '+(e&&e.message?e.message:String(e)));}}fetchFull();var evt=new EventSource('events');evt.onopen=function(){if(statusEl)statusEl.textContent='live';};evt.onmessage=function(e){try{var line=JSON.parse(e.data);add(typeof line==='string'?line.trimEnd():line);}catch{add(e.data);}};evt.onerror=function(){if(statusEl)statusEl.textContent='error (retrying)';};window.download=function(){window.open('log','_blank');};window.clearLog=function(){lines.length=0;render();};})();</script>\n</body>\n</html>";
; // ./src/debug.ts
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

/***/