var mock_transport_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var __await = undefined && undefined.__await || function (v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
};
var mock_transport_asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};
var __asyncGenerator = undefined && undefined.__asyncGenerator || function (thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
    i,
    q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;
  function awaitReturn(f) {
    return function (v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function (v) {
        return new Promise(function (a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
};

/**
 * MockAgentTransport is a test-only transport for AgentConnectClient that
 * allows scripting AgentServerMessage streams without a real backend.
 *
 * It reads the first runRequest from the client stream, extracts conversationId
 * and requestId, and delegates to a provider callback to get a mock stream.
 *
 * This transport is only intended for use in smoke tests when enableSmokeTestDriver
 * is true. It should never be used in production.
 *
 * Key behaviors:
 * - If the provider returns a mock stream, it yields from that stream
 * - If the provider returns undefined, it throws a clear error (no silent fallback to real backend)
 * - This ensures all agent runs in smoke tests are explicitly mocked or fail fast
 */
class MockAgentTransport {
  constructor(provider) {
    this.provider = provider;
  }
  run(_ctx, req, options) {
    return __asyncGenerator(this, arguments, function* run_1() {
      // Read the first message to extract conversationId and requestId
      let firstMessage;
      const reqIterator = req[Symbol.asyncIterator]();
      const firstResult = yield __await(reqIterator.next());
      if (firstResult.done) {
        throw new Error("[MockAgentTransport] No messages received from client stream");
      }
      firstMessage = firstResult.value;
      if (firstMessage.message.case !== "runRequest") {
        throw new Error(`[MockAgentTransport] Expected first message to be runRequest, got ${firstMessage.message.case}`);
      }
      const runRequest = firstMessage.message.value;
      const conversationIdRaw = runRequest.conversationId;
      const requestIdHeader = options.headers["x-request-id"];
      if (!conversationIdRaw) {
        throw new Error("[MockAgentTransport] conversationId is required in runRequest");
      }
      if (!requestIdHeader) {
        throw new Error("[MockAgentTransport] x-request-id header is required");
      }
      const conversationId = conversationIdRaw;
      const requestId = requestIdHeader;
      // Ask the provider for a mock stream
      const mockStream = this.provider({
        conversationId,
        requestId,
        runRequest,
        signal: options.signal
      });
      if (!mockStream) {
        throw new Error(`[MockAgentTransport] No mock stream configured for conversationId=${conversationId}; requestId=${requestId}`);
      }
      // Track pending exec results with promises
      const pendingExecs = new Map();
      // Consume the request stream to detect exec results and resolve pending promises
      const execResults = createWritableIterable();
      const consumeRequestStream = () => mock_transport_awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          // Manually iterate using .next() since reqIterator is AsyncIterator not AsyncIterable
          while (true) {
            const result = yield reqIterator.next();
            if (result.done) {
              break;
            }
            const message = result.value;
            // When we receive an ExecClientMessage, find the matching pending exec
            if (message.message.case === "execClientMessage") {
              const execMessage = message.message.value;
              const resultCase = (_a = execMessage.message) === null || _a === void 0 ? void 0 : _a.case;
              // Find the matching tool call by checking exec result types and populate the result
              let matchingCallId;
              let matchingToolCall;
              for (const [callId, pending] of pendingExecs.entries()) {
                const toolCase = pending.toolCall.tool.case;
                // Match exec results to tool types and convert exec result to tool result
                if (toolCase === "readToolCall" && resultCase === "readResult") {
                  matchingCallId = callId;
                  // Convert ReadResult (exec) to ReadToolResult (tool)
                  // The backend converts all error cases to a single "error" case
                  const readExecResult = execMessage.message.value;
                  let toolResult;
                  if (readExecResult.result.case === "success") {
                    // Success case - convert exec result to tool result
                    const readSuccess = readExecResult.result.value;
                    toolResult = new ReadToolResult({
                      result: {
                        case: "success",
                        value: {
                          output: readSuccess.output,
                          isEmpty: false,
                          exceededLimit: readSuccess.truncated,
                          totalLines: readSuccess.totalLines,
                          fileSize: Number(readSuccess.fileSize),
                          path: readSuccess.path
                        }
                      }
                    });
                  } else {
                    // Convert all error cases (fileNotFound, permissionDenied, rejected, error) to tool error
                    let errorMessage;
                    switch (readExecResult.result.case) {
                      case "error":
                        errorMessage = readExecResult.result.value.error;
                        break;
                      case "fileNotFound":
                        errorMessage = "File not found";
                        break;
                      case "permissionDenied":
                        errorMessage = "Permission denied";
                        break;
                      case "rejected":
                        errorMessage = readExecResult.result.value.reason || "Read operation rejected";
                        break;
                      default:
                        errorMessage = "Unknown error";
                    }
                    toolResult = new ReadToolResult({
                      result: {
                        case: "error",
                        value: new ReadToolError({
                          errorMessage
                        })
                      }
                    });
                  }
                  const updatedReadToolCall = new ReadToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: toolResult
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "readToolCall",
                      value: updatedReadToolCall
                    }
                  });
                  break;
                } else if (toolCase === "lsToolCall" && resultCase === "lsResult") {
                  matchingCallId = callId;
                  const updatedLsToolCall = new LsToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "lsToolCall",
                      value: updatedLsToolCall
                    }
                  });
                  break;
                } else if (toolCase === "grepToolCall" && resultCase === "grepResult") {
                  matchingCallId = callId;
                  const updatedGrepToolCall = new GrepToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "grepToolCall",
                      value: updatedGrepToolCall
                    }
                  });
                  break;
                } else if (toolCase === "deleteToolCall" && resultCase === "deleteResult") {
                  matchingCallId = callId;
                  const updatedDeleteToolCall = new DeleteToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "deleteToolCall",
                      value: updatedDeleteToolCall
                    }
                  });
                  break;
                } else if (toolCase === "shellToolCall" && resultCase === "shellResult") {
                  matchingCallId = callId;
                  const updatedShellToolCall = new ShellToolCall({
                    args: pending.toolCall.tool.value.args,
                    result: execMessage.message.value
                  });
                  matchingToolCall = new ToolCall({
                    tool: {
                      case: "shellToolCall",
                      value: updatedShellToolCall
                    }
                  });
                  break;
                }
              }
              if (matchingCallId && matchingToolCall) {
                yield execResults.write({
                  callId: matchingCallId,
                  toolCall: matchingToolCall
                });
              }
            }
          }
        } catch (_error) {
          // Request stream closed or errored
        } finally {
          execResults.close();
        }
      });
      // Start consuming request stream in background
      consumeRequestStream().catch(() => {});
      const _execResultsIterator = execResults[Symbol.asyncIterator]();
      // Process exec results in a background task and yield them as tool-call-completed events
      const processExecResults = function () {
        return __asyncGenerator(this, arguments, function* () {
          var _a, e_1, _b, _c;
          try {
            try {
              for (var _d = true, execResults_1 = mock_transport_asyncValues(execResults), execResults_1_1; execResults_1_1 = yield __await(execResults_1.next()), _a = execResults_1_1.done, !_a; _d = true) {
                _c = execResults_1_1.value;
                _d = false;
                const result = _c;
                const pending = pendingExecs.get(result.callId);
                if (pending) {
                  // Emit tool-call-completed update
                  const completedUpdate = new ToolCallCompletedUpdate({
                    callId: result.callId,
                    toolCall: result.toolCall,
                    modelCallId: pending.modelCallId
                  });
                  const interactionUpdate = new InteractionUpdate({
                    message: {
                      case: "toolCallCompleted",
                      value: completedUpdate
                    }
                  });
                  yield yield __await(new AgentServerMessage({
                    message: {
                      case: "interactionUpdate",
                      value: interactionUpdate
                    }
                  }));
                  pendingExecs.delete(result.callId);
                }
              }
            } catch (e_1_1) {
              e_1 = {
                error: e_1_1
              };
            } finally {
              try {
                if (!_d && !_a && (_b = execResults_1.return)) yield __await(_b.call(execResults_1));
              } finally {
                if (e_1) throw e_1.error;
              }
            }
          } catch (_err) {
            // Exec results stream closed
          }
        });
      }();
      // Merge mockStream and execResults - yield from both without blocking
      const mockStreamIterator = mockStream[Symbol.asyncIterator]();
      const execResultsGen = processExecResults[Symbol.asyncIterator]();
      let mockDone = false;
      let execDone = false;
      let pendingExecCount = 0; // Track how many execs we're waiting for
      let bufferedTurnEnded = null; // Buffer turn-ended until execs complete
      // Pending promises that haven't resolved yet
      let mockPromise = null;
      let execPromise = null;
      while (!mockDone || !execDone) {
        // Start both iterators if not already started and not done
        if (!mockDone && !mockPromise) {
          mockPromise = mockStreamIterator.next().then(result => ({
            source: "mock",
            result
          }));
        }
        if (!execDone && !execPromise) {
          execPromise = execResultsGen.next().then(result => ({
            source: "exec",
            result
          }));
        }
        // Wait for whichever completes first
        const promises = [];
        if (mockPromise) promises.push(mockPromise);
        if (execPromise) promises.push(execPromise);
        if (promises.length === 0) break;
        const {
          source,
          result
        } = yield __await(Promise.race(promises));
        // Clear the resolved promise so we can start a new one
        if (source === "mock") mockPromise = null;
        if (source === "exec") execPromise = null;
        if (result.done) {
          if (source === "mock") mockDone = true;
          if (source === "exec") execDone = true;
          continue;
        }
        // Track tool calls from mock stream
        if (source === "mock" && result.value.message.case === "interactionUpdate") {
          const update = result.value.message.value;
          if (update.message.case === "toolCallStarted") {
            const startedUpdate = update.message.value;
            if (startedUpdate.toolCall) {
              pendingExecs.set(startedUpdate.callId, {
                resolve: () => {},
                reject: () => {},
                toolCall: startedUpdate.toolCall,
                modelCallId: startedUpdate.modelCallId
              });
            }
          } else if (update.message.case === "partialToolCall") {
            const partialUpdate = update.message.value;
            if (partialUpdate.toolCall) {
              pendingExecs.set(partialUpdate.callId, {
                resolve: () => {},
                reject: () => {},
                toolCall: partialUpdate.toolCall,
                modelCallId: partialUpdate.modelCallId
              });
            }
          }
        } else if (source === "mock" && result.value.message.case === "execServerMessage") {
          // Track that we're expecting an exec result
          pendingExecCount++;
        } else if (source === "exec" && result.value.message.case === "interactionUpdate") {
          const update = result.value.message.value;
          if (update.message.case === "toolCallCompleted") {
            // We got a completion, decrement counter
            pendingExecCount--;
            // If mock is done and no more pending execs, close execResults to signal completion
            if (mockDone && pendingExecCount === 0) {
              execResults.close();
            }
            // If we have a buffered turn-ended and all execs are done, yield it now
            if (bufferedTurnEnded && pendingExecCount === 0) {
              yield yield __await(bufferedTurnEnded);
              bufferedTurnEnded = null;
            }
          }
        }
        // Check if this is a turn-ended message and we have pending execs
        if (source === "mock" && result.value.message.case === "interactionUpdate") {
          const update = result.value.message.value;
          if (update.message.case === "turnEnded" && pendingExecCount > 0) {
            // Buffer turn-ended until all execs complete
            bufferedTurnEnded = result.value;
          } else {
            yield yield __await(result.value);
          }
        } else {
          yield yield __await(result.value);
        }
      }
      // If we still have a buffered turn-ended, yield it now (shouldn't happen, but safety net)
      if (bufferedTurnEnded) {
        yield yield __await(bufferedTurnEnded);
      }
    });
  }
}