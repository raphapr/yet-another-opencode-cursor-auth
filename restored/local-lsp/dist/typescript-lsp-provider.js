var typescript_lsp_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const typescript_lsp_provider_logger = (0, dist /* createLogger */.h)("@anysphere/local-lsp:typescript-provider");
/**
 * Factory class implementing LspProviderFactory for TypeScript
 */
class TypescriptLspProviderFactory {
  constructor(ctx, debounceTimeout = 3000) {
    this.ctx = ctx;
    this.debounceTimeout = debounceTimeout;
  }
  create(workspacePath) {
    return typescript_lsp_provider_awaiter(this, void 0, void 0, function* () {
      // Check if npx is available and use it to run typescript-language-server
      let npxResult;
      try {
        // Use the established pattern from the codebase for finding executables
        npxResult = (0, utils_dist /* findActualExecutable */.Ef)("npx", []);
        if (npxResult.cmd === "npx") {
          // npx not found
          typescript_lsp_provider_logger.error(this.ctx, "npx not found in PATH", {
            cmd: npxResult.cmd
          });
          return null;
        }
      } catch (err) {
        typescript_lsp_provider_logger.error(this.ctx, "npx not found in PATH", err);
        return null;
      }
      typescript_lsp_provider_logger.debug(this.ctx, "Starting typescript-language-server", {
        npxPath: npxResult.cmd
      });
      const command = npxResult.cmd;
      const spawnArgs = ["-y", "typescript-language-server", "--stdio"];
      const spawnOptions = {
        env: process.env,
        cwd: workspacePath,
        windowsHide: true,
        detached: false
      };
      const childProcess = (0, external_node_child_process_.spawn)(command, spawnArgs, Object.assign(Object.assign({}, spawnOptions), {
        stdio: ["pipe", "pipe", "pipe"]
      }));
      typescript_lsp_provider_logger.debug(this.ctx, `Child Typescript LSP process spawned with PID: ${childProcess.pid}`);
      // Log spawn errors
      childProcess.on("error", err => {
        typescript_lsp_provider_logger.error(this.ctx, "Failed to spawn TypeScript LSP process", {
          error: err.message,
          code: err.code,
          errno: err.errno,
          syscall: err.syscall,
          path: err.path
        });
      });
      childProcess.on("exit", (code, signal) => {
        typescript_lsp_provider_logger.info(this.ctx, `Child process exited with code: ${code}, signal: ${signal}`);
      });
      // Log stderr output for debugging (only log errors, not chunks)
      if (childProcess.stderr) {
        childProcess.stderr.on("data", data => {
          const chunk = data.toString();
          typescript_lsp_provider_logger.error(this.ctx, "TypeScript Server stderr chunk:", {
            stderr: chunk
          });
        });
      }
      if (!childProcess.stdout || !childProcess.stdin) {
        throw new Error("Failed to create stdio streams");
      }
      /*
      // Note: This pattern is very useful for getting debug logs.
      // Create a transform stream for logging stdout
      const stdoutLogger = new Transform({
        transform: (chunk, _encoding, callback) => {
          logger.info(this.ctx, "TypeScript Server stdout:", {
            stdout: chunk.toString(),
          });
          callback(null, chunk);
        },
      });
      // Pipe stdout through the logger
      childProcess.stdout.pipe(stdoutLogger);
      */
      // Create protocol connection using the logged stream
      const connection = (0, node.createProtocolConnection)(new node.StreamMessageReader(childProcess.stdout), new node.StreamMessageWriter(childProcess.stdin));
      try {
        return yield GenericRuntimeLspProvider.createAndInitialize(this.ctx, workspacePath, connection, this.debounceTimeout);
      } catch (error) {
        typescript_lsp_provider_logger.debug(this.ctx, "did not initialize LSP provider", {
          error: error instanceof Error ? error.message : "unknown error"
        });
        return null;
      }
    });
  }
}
//# sourceMappingURL=typescript-lsp-provider.js.map