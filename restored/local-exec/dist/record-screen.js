var record_screen_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var record_screen_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
const execFileAsync = (0, external_node_util_.promisify)(external_node_child_process_.execFile);
const RECORDINGS_DIR = "/opt/cursor/artifacts/";
const DISPLAY = ":1.0";
class LocalRecordScreenExecutor {
  constructor() {
    // Single global recording - there can only be one active recording at a time
    this.activeRecording = null;
  }
  /**
   * Sanitize tool_call_id for use in file paths
   */
  sanitizeToolCallId(toolCallId) {
    // Replace non-alphanumeric and non-underscore/non-hyphen characters with underscore
    return toolCallId.replace(/[^a-zA-Z0-9_-]/g, "_");
  }
  /**
   * Ensure the recordings directory exists
   */
  async ensureRecordingDirectoryExists() {
    await promises_.mkdir(RECORDINGS_DIR, {
      recursive: true
    });
  }
  /**
   * Build a unique output path for a recording
   */
  buildOutputPath(toolCallId) {
    const sanitized = this.sanitizeToolCallId(toolCallId);
    const timestamp = Date.now();
    const filename = `${sanitized}-${timestamp}.mp4`;
    return external_node_path_.join(RECORDINGS_DIR, filename);
  }
  /**
   * Detect screen resolution using xrandr
   */
  async detectResolution() {
    try {
      const {
        stdout
      } = await execFileAsync("xrandr", []);
      const lines = stdout.split("\n");
      // Find the first line containing '*'
      for (const line of lines) {
        if (line.includes("*")) {
          // Extract the first whitespace-separated token (e.g., "1920x1080")
          const match = line.trim().match(/^(\S+)/);
          if (match?.[1]) {
            return match[1];
          }
        }
      }
      throw new Error("No active display found in xrandr output");
    } catch (error) {
      throw new Error(`Failed to detect screen resolution via xrandr: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /**
   * Start an ffmpeg recording process
   */
  async startFfmpegRecording(resolution, outputPath) {
    return new Promise((resolve, reject) => {
      const args = ["-video_size", resolution, "-framerate", "30", "-f", "x11grab", "-i", DISPLAY, "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23", outputPath];
      const child = (0, external_node_child_process_.spawn)("ffmpeg", args, {
        stdio: ["ignore", "pipe", "pipe"]
      });
      let hasResolved = false;
      let errorOccurred = false;
      // Check for immediate errors (e.g., ffmpeg not found)
      child.once("error", error => {
        if (!hasResolved) {
          hasResolved = true;
          errorOccurred = true;
          reject(new Error(`Failed to start ffmpeg: ${error.message}`));
        }
      });
      // Wait a short time to detect immediate failures, then consider it started
      const startTimeout = setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          // Check if process is still alive
          if (child.killed || errorOccurred) {
            reject(new Error("ffmpeg process exited immediately"));
          } else {
            resolve(child);
          }
        }
      }, 500); // 500ms should be enough to detect immediate failures
      // If process exits quickly, treat it as a failure (recording should run continuously)
      child.once("exit", (code, signal) => {
        clearTimeout(startTimeout);
        if (!hasResolved) {
          hasResolved = true;
          // Any early exit is a failure - ffmpeg should keep running until we stop it
          if (code !== null && code !== 0) {
            reject(new Error(`ffmpeg exited with code ${code}${signal ? ` and signal ${signal}` : ""}`));
          } else if (signal !== null) {
            reject(new Error(`ffmpeg was killed by signal ${signal}`));
          } else {
            // code === 0 or code === null with no signal - unexpected early exit
            reject(new Error("ffmpeg exited unexpectedly"));
          }
        }
      });
    });
  }
  /**
   * Stop an ffmpeg recording process gracefully
   */
  async stopFfmpegRecording(state) {
    const {
      childProcess
    } = state;
    if (childProcess.killed || !childProcess.pid) {
      // Process already stopped
      return;
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Force kill if graceful shutdown fails
        try {
          if (childProcess.pid) {
            childProcess.kill("SIGKILL");
          }
          reject(new Error("Timeout waiting for ffmpeg to stop"));
        } catch (error) {
          reject(new Error(`Failed to force kill ffmpeg: ${error instanceof Error ? error.message : String(error)}`));
        }
      }, 5000); // 5 second timeout
      // Send SIGINT to gracefully stop ffmpeg (allows it to finalize the file)
      try {
        childProcess.kill("SIGINT");
      } catch (error) {
        clearTimeout(timeout);
        reject(new Error(`Failed to send SIGINT to ffmpeg: ${error instanceof Error ? error.message : String(error)}`));
        return;
      }
      childProcess.once("exit", (code, _signal) => {
        clearTimeout(timeout);
        // SIGINT exit is expected (ffmpeg should exit with code 0 or 255 after SIGINT)
        if (code === null) {
          // Process was killed by signal, that's fine
          resolve();
        } else {
          resolve();
        }
      });
      childProcess.once("error", error => {
        clearTimeout(timeout);
        reject(new Error(`Error stopping ffmpeg: ${error.message}`));
      });
    });
  }
  async execute(parentCtx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = record_screen_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(parentCtx.withName("LocalRecordScreenExecutor.execute")), false);
      // Ensure recordings directory exists
      await this.ensureRecordingDirectoryExists();
      // Handle UNSPECIFIED mode
      if (args.mode === record_screen_exec_pb /* RecordingMode */.$u.UNSPECIFIED) {
        return new record_screen_exec_pb /* RecordScreenResult */.Tj({
          result: {
            case: "failure",
            value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
              error: "Mode must be one of START_RECORDING, SAVE_RECORDING, DISCARD_RECORDING"
            })
          }
        });
      }
      switch (args.mode) {
        case record_screen_exec_pb /* RecordingMode */.$u.START_RECORDING:
          {
            // Cancel existing recording if one is in progress
            let wasPriorRecordingCancelled = false;
            if (this.activeRecording) {
              wasPriorRecordingCancelled = true;
              try {
                // Stop recording if still running
                if (!this.activeRecording.childProcess.killed && this.activeRecording.childProcess.pid) {
                  await this.stopFfmpegRecording(this.activeRecording);
                }
                // Delete the old file
                try {
                  await promises_.rm(this.activeRecording.outputPath, {
                    force: true
                  });
                } catch (rmError) {
                  // Ignore ENOENT errors (file already deleted)
                  const error = rmError instanceof Error ? rmError : new Error(String(rmError));
                  // @ts-expect-error - code might not exist on all errors
                  if (error.code !== "ENOENT") {
                    // Log but don't fail - we'll start a new recording anyway
                  }
                }
                // Clear active recording
                this.activeRecording = null;
              } catch (_cancelError) {
                // Log but continue - we'll try to start a new recording anyway
                // Clear state to avoid stale state
                this.activeRecording = null;
              }
            }
            try {
              // Build output path (use tool_call_id for unique filename if provided)
              const outputPath = this.buildOutputPath(args.toolCallId || "recording");
              // Detect resolution
              const resolution = await this.detectResolution();
              // Start ffmpeg
              const childProcess = await this.startFfmpegRecording(resolution, outputPath);
              // Store recording state with start time
              const startTime = Date.now();
              this.activeRecording = {
                childProcess,
                outputPath,
                startTime
              };
              // Clean up on process exit
              childProcess.once("exit", () => {
                // Optionally clear state if exited unexpectedly
                // For now, we'll leave it so SAVE/DISCARD can detect it's done
              });
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "startSuccess",
                  value: new record_screen_exec_pb /* RecordScreenStartSuccess */.T4({
                    wasPriorRecordingCancelled
                  })
                }
              });
            } catch (error) {
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: error instanceof Error ? error.message : String(error)
                  })
                }
              });
            }
          }
        case record_screen_exec_pb /* RecordingMode */.$u.SAVE_RECORDING:
          {
            if (!this.activeRecording) {
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: "No active recording to save"
                  })
                }
              });
            }
            const state = this.activeRecording;
            try {
              // Stop recording if still running
              if (!state.childProcess.killed && state.childProcess.pid) {
                await this.stopFfmpegRecording(state);
              }
              // Verify file exists and is accessible
              try {
                await promises_.access(state.outputPath, promises_.constants.R_OK);
              } catch (_accessError) {
                // File might not exist or not accessible - clear state since recording is lost
                this.activeRecording = null;
                return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                  result: {
                    case: "failure",
                    value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                      error: `Recording file not accessible at ${state.outputPath}`
                    })
                  }
                });
              }
              const outputPath = state.outputPath;
              // Calculate recording duration
              const recordingDurationMs = Date.now() - state.startTime;
              // Clear active recording
              this.activeRecording = null;
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "saveSuccess",
                  value: new record_screen_exec_pb /* RecordScreenSaveSuccess */.ol({
                    path: outputPath,
                    recordingDurationMs: proto_int64 /* protoInt64 */.M.parse(recordingDurationMs.toString())
                  })
                }
              });
            } catch (error) {
              // Clear state even on error
              this.activeRecording = null;
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: error instanceof Error ? error.message : String(error)
                  })
                }
              });
            }
          }
        case record_screen_exec_pb /* RecordingMode */.$u.DISCARD_RECORDING:
          {
            if (!this.activeRecording) {
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: "No active recording to discard"
                  })
                }
              });
            }
            const state = this.activeRecording;
            try {
              // Stop recording if still running
              if (!state.childProcess.killed && state.childProcess.pid) {
                await this.stopFfmpegRecording(state);
              }
              // Delete the file
              try {
                await promises_.rm(state.outputPath, {
                  force: true
                });
              } catch (rmError) {
                // If file doesn't exist (ENOENT), that's fine - consider it discarded
                const error = rmError instanceof Error ? rmError : new Error(String(rmError));
                // @ts-expect-error - code might not exist on all errors
                if (error.code !== "ENOENT") {
                  // Only fail if it's not a "file not found" error
                  throw error;
                }
              }
              // Clear active recording
              this.activeRecording = null;
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "discardSuccess",
                  value: new record_screen_exec_pb /* RecordScreenDiscardSuccess */.N8()
                }
              });
            } catch (error) {
              // Capture the file path before clearing state
              const filePath = state.outputPath;
              // Clear state even on error
              this.activeRecording = null;
              const errorMessage = error instanceof Error ? error.message : String(error);
              return new record_screen_exec_pb /* RecordScreenResult */.Tj({
                result: {
                  case: "failure",
                  value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                    error: `Failed to discard recording: ${errorMessage}.\nRecording file may not have been deleted: ${filePath}`
                  })
                }
              });
            }
          }
        default:
          {
            // Exhaustive check for TypeScript
            const _exhaustiveCheck = args.mode;
            return new record_screen_exec_pb /* RecordScreenResult */.Tj({
              result: {
                case: "failure",
                value: new record_screen_exec_pb /* RecordScreenFailure */.yH({
                  error: `Unhandled recording mode: ${_exhaustiveCheck}`
                })
              }
            });
          }
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      record_screen_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=record-screen.js.map