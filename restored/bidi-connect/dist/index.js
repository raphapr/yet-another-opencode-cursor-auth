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
var __asyncValues = undefined && undefined.__asyncValues || function (o) {
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
function getRequestId(header) {
  var _a;
  const requestId = header instanceof Headers ? header.get("x-request-id") : Array.isArray(header) ? (_a = header.find(([key]) => key === "x-request-id")) === null || _a === void 0 ? void 0 : _a[1] : header === null || header === void 0 ? void 0 : header["x-request-id"];
  if (typeof requestId === "string") {
    return requestId;
  }
  const id = (0, external_node_crypto_.randomUUID)();
  // Add it to the header
  if (header instanceof Headers) {
    header.set("x-request-id", id);
  } else if (Array.isArray(header)) {
    header.push(["x-request-id", id]);
  } else if (typeof header === "object" && header !== null) {
    header["x-request-id"] = id;
  }
  return id;
}
class BidiSseTransport {
  constructor(mapper, bidiClient, innerTransport, onError) {
    this.mapper = mapper;
    this.bidiClient = bidiClient;
    this.innerTransport = innerTransport;
    this.onError = onError;
  }
  unary(service, method, signal, timeoutMs, header, input, contextValues) {
    return this.innerTransport.unary(service, method, signal, timeoutMs, header, input, contextValues);
  }
  stream(service, method, signal, timeoutMs, header, input, contextValues) {
    return __awaiter(this, void 0, void 0, function* () {
      if (method.kind !== service_type /* MethodKind */.I.BiDiStreaming) {
        return this.innerTransport.stream(service, method, signal, timeoutMs, header, input, contextValues);
      }
      const mappedMethod = this.mapper.map(method);
      const requestId = getRequestId(header);
      // Create an async iterable with just the request ID for the SSE stream
      const requestIdObj = new BidiRequestId({
        requestId
      });
      const sseInput = (0, async_iterable /* createAsyncIterable */.T$)([requestIdObj]);
      // Start the SSE stream with the mapped server-streaming method
      const streamResponse = this.innerTransport.stream(service, mappedMethod, signal, timeoutMs, header, sseInput, contextValues);
      // Start pushing client inputs through BidiAppend in the background
      // Pass headers so idempotency key reaches bidiAppend calls
      this.startAppendingInputs(requestId, input, signal, timeoutMs, header);
      return Object.assign(Object.assign({}, yield streamResponse), {
        method
      });
    });
  }
  startAppendingInputs(requestId, input, signal, timeoutMs, headers) {
    // Run in background without blocking
    Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      let appendSeqno = 0;
      const pendingAppends = [];
      const maxConcurrentAppends = 16; // Configurable limit for concurrent requests
      try {
        try {
          for (var _d = true, input_1 = __asyncValues(input), input_1_1; input_1_1 = yield input_1.next(), _a = input_1_1.done, !_a; _d = true) {
            _c = input_1_1.value;
            _d = false;
            const message = _c;
            if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
              break;
            }
            const currentSeqno = appendSeqno++;
            const requestIdObj = new BidiRequestId({
              requestId
            });
            // Create the append promise
            // Pass headers so x-idempotency-key reaches the server for proper stream routing
            const appendPromise = this.bidiClient.bidiAppend({
              requestId: requestIdObj,
              appendSeqno: BigInt(currentSeqno),
              data: Buffer.from(message.toBinary()).toString("hex")
            }, {
              signal,
              timeoutMs,
              headers
            }).then(() => {
              // Remove completed promise from pending list
              const index = pendingAppends.indexOf(appendPromise);
              if (index > -1) {
                pendingAppends.splice(index, 1);
              }
            }, error => {
              // Remove failed promise from pending list and propagate error
              const index = pendingAppends.indexOf(appendPromise);
              if (index > -1) {
                pendingAppends.splice(index, 1);
              }
              throw error;
            });
            pendingAppends.push(appendPromise);
            // If we've reached the max concurrent limit, wait for at least one to complete
            if (pendingAppends.length >= maxConcurrentAppends) {
              yield Promise.race(pendingAppends);
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = input_1.return)) yield _b.call(input_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        // Wait for all remaining appends to complete
        yield Promise.all(pendingAppends);
      } catch (error) {
        // Log error but don't throw - this is a background operation
        this.onError(error);
      }
    }));
  }
}