var src_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
// V V V V DO NOT REORDER THIS IMPORT, IT MUST BE FIRST

// ^ ^ ^ ^ DO NOT REORDER THIS IMPORT, IT MUST BE FIRST

function src_extractErrorInfo(err) {
  if (err instanceof Error) return {
    message: err.message || String(err),
    stack: err.stack
  };
  if (typeof err === "string") return {
    message: err
  };
  try {
    return {
      message: JSON.stringify(err)
    };
  } catch (_a) {
    return {
      message: String(err)
    };
  }
}
const src_isWindows = "darwin" === "win32";
function configureLinuxSandboxHelper() {
  if (true) {
    return;
  }
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
  // removed by dead control flow
  {}
}
configureLinuxSandboxHelper();
function logToDebug(event, err) {
  return src_awaiter(this, void 0, void 0, function* () {
    try {
      const {
        message,
        stack
      } = src_extractErrorInfo(err);
      (0, debug.debugLogJSON)(event, {
        message,
        stack
      }, "ERROR");
      (0, debug.debugTrace)(event, {
        message,
        stack
      });
    } catch (_a) {}
  });
}
function main() {
  return src_awaiter(this, void 0, void 0, function* () {
    console.log("🚀 Agent CLI starting up...");
    // Suppress EventEmitter MaxListeners warnings globally and for stdio
    suppressEventEmitterMaxListenersWarnings();
    // Resolve ripgrep path preferring a binary co-located with the entry script
    function rgPathFactory() {
      const scriptPath = process.argv[1];
      const colocatedRg = (0, external_node_path_.join)((0, external_node_path_.dirname)(scriptPath), "rg");
      if ((0, external_node_fs_.existsSync)(colocatedRg)) {
        return colocatedRg;
      }
      if (false)
        // removed by dead control flow
        {}
      try {
        const cmd = (0, utils_dist /* findActualExecutable */.Ef)("rg", []).cmd;
        if (cmd === "rg") {
          throw new Error("rg is not installed");
        }
        return cmd;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        (0, debug.debugLogJSON)("rg.missing", {
          message: "Could not find ripgrep (rg) binary. Please install ripgrep."
        }, "ERROR");
        (0, console_io /* exitWithMessage */.uQ)(1, "Could not find ripgrep (rg) binary. Please install ripgrep. Error: " + errorMessage);
      }
    }
    const localWorkerClientFactory = (options, workspacePath) => {
      const repoRoot = (0, git /* findGitRoot */.k)(workspacePath);
      const socketPath = getProjectSocketPathForWorkspace(repoRoot);
      if (!src_isWindows) {
        (0, external_node_fs_.mkdirSync)((0, external_node_path_.dirname)(socketPath), {
          recursive: true
        });
      }
      return (0, local_worker_dist.createClient)(spawnLocalWorker(repoRoot, socketPath, getProjectLogPath(repoRoot), options), socketPath);
    };
    yield setupCLI({
      rgPathFactory,
      localWorkerClientFactory
    });
  });
}
main().catch(error => src_awaiter(void 0, void 0, void 0, function* () {
  // We only every initialize Sentry if the user is not in ghost mode
  //Sentry.captureException(error);
  yield logToDebug("global.main.promiseCatch", error);
  process.exit(1);
}));