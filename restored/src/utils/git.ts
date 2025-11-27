/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: () => (/* binding */ getRepoUrlFilters),
/* harmony export */   k: () => (/* binding */ findGitRoot)
/* harmony export */ });
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../local-exec/dist/index.js");


/** Find the nearest ancestor directory that contains a .git folder. */
function findGitRoot(startPath) {
    try {
        const output = (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", ["rev-parse", "--show-toplevel"], {
            cwd: startPath,
            stdio: ["ignore", "pipe", "ignore"],
            encoding: "utf8",
        });
        return output.trim();
    }
    catch (_a) {
        return startPath;
    }
}
function execGit(args, cwd) {
    try {
        const output = (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", args, {
            cwd,
            stdio: ["ignore", "pipe", "ignore"],
            encoding: "utf8",
            maxBuffer: 1024 * 1024,
        });
        return output.trim();
    }
    catch (_a) {
        return undefined;
    }
}
/**
 * Compute repo URL filters for background composer listing based on the current repo.
 * Returns the preferred origin host path and any additional fetch remotes as host paths.
 */
function getRepoUrlFilters() {
    const cwd = process.cwd();
    const repoRoot = findGitRoot(cwd);
    const originUrlRaw = execGit(["config", "--get", "remote.origin.url"], repoRoot);
    const allRemotesRaw = execGit(["remote", "-v"], repoRoot);
    const hostPaths = [];
    if (allRemotesRaw) {
        for (const line of allRemotesRaw.split(/\r?\n/)) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 3 && parts[2] === "(fetch)") {
                hostPaths.push((0,_anysphere_local_exec__WEBPACK_IMPORTED_MODULE_1__.toHostPath)(parts[1]));
            }
        }
    }
    const uniqueHostPaths = Array.from(new Set(hostPaths.filter(p => p.length > 0)));
    const preferred = originUrlRaw
        ? (0,_anysphere_local_exec__WEBPACK_IMPORTED_MODULE_1__.toHostPath)(originUrlRaw)
        : uniqueHostPaths[0];
    const additional = uniqueHostPaths.filter(p => p !== preferred);
    return {
        preferredRepoUrl: preferred,
        additionalRepoUrls: additional,
    };
}


/***/ }),

/***/ "@lydell/node-pty":
/***/ ((module) => {

"use strict";
module.exports = require("@lydell/node-pty");

/***/ }),

/***/ "@opentelemetry/exporter-jaeger":
/***/ ((module) => {

"use strict";
module.exports = require("@opentelemetry/exporter-jaeger");

/***/ }),

/***/ "assert":
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "async_hooks":
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),

/***/ "buffer":
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "bufferutil":
/***/ ((module) => {

"use strict";
module.exports = require("bufferutil");

/***/ }),

/***/ "child_process":
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "constants":
/***/ ((module) => {

"use strict";
module.exports = require("constants");

/***/ }),

/***/ "crypto":
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "domain":
/***/ ((module) => {

"use strict";
module.exports = require("domain");

/***/ }),

/***/ "events":
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "http2":
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ "https":
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "inspector":
/***/ ((module) => {

"use strict";
module.exports = require("inspector");

/***/ }),

/***/ "module":
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ "net":
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "node:assert":
/***/ ((module) => {

"use strict";
module.exports = require("node:assert");

/***/ }),

/***/ "node:async_hooks":
/***/ ((module) => {

"use strict";
module.exports = require("node:async_hooks");

/***/ }),

/***/ "node:buffer":
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:child_process":
/***/ ((module) => {

"use strict";
module.exports = require("node:child_process");

/***/ }),

/***/ "node:console":
/***/ ((module) => {

"use strict";
module.exports = require("node:console");

/***/ }),

/***/ "node:crypto":
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ }),

/***/ "node:diagnostics_channel":
/***/ ((module) => {

"use strict";
module.exports = require("node:diagnostics_channel");

/***/ }),

/***/ "node:dns":
/***/ ((module) => {

"use strict";
module.exports = require("node:dns");

/***/ }),

/***/ "node:events":
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ "node:fs":
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:fs/promises":
/***/ ((module) => {

"use strict";
module.exports = require("node:fs/promises");

/***/ }),

/***/ "node:http":
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:http2":
/***/ ((module) => {

"use strict";
module.exports = require("node:http2");

/***/ }),

/***/ "node:net":
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ "node:os":
/***/ ((module) => {

"use strict";
module.exports = require("node:os");

/***/ }),

/***/ "node:path":
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:perf_hooks":
/***/ ((module) => {

"use strict";
module.exports = require("node:perf_hooks");

/***/ }),

/***/ "node:process":
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:querystring":
/***/ ((module) => {

"use strict";
module.exports = require("node:querystring");

/***/ }),

/***/ "node:sqlite":
/***/ ((module) => {

"use strict";
module.exports = require("node:sqlite");

/***/ }),

/***/ "node:stream":
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "node:tls":
/***/ ((module) => {

"use strict";
module.exports = require("node:tls");

/***/ }),

/***/ "node:tty":
/***/ ((module) => {

"use strict";
module.exports = require("node:tty");

/***/ }),

/***/ "node:url":
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:util/types":
/***/ ((module) => {

"use strict";
module.exports = require("node:util/types");

/***/ }),

/***/ "node:worker_threads":
/***/ ((module) => {

"use strict";
module.exports = require("node:worker_threads");

/***/ }),

/***/ "node:zlib":
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "perf_hooks":
/***/ ((module) => {

"use strict";
module.exports = require("perf_hooks");

/***/ }),

/***/ "process":
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "readline":
/***/ ((module) => {

"use strict";
module.exports = require("readline");

/***/ }),

/***/ "stream":
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "timers":
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ "tls":
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "utf-8-validate":
/***/ ((module) => {

"use strict";
module.exports = require("utf-8-validate");

/***/ }),

/***/ "util":
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			8792: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.tsx");
/******/ 	
/******/ })()
;