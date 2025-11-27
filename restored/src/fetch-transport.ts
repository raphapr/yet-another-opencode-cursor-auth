var fetch_transport_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var fetch_transport_asyncValues = undefined && undefined.__asyncValues || function (o) {
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
var __await = undefined && undefined.__await || function (v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
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
class FetchTransport {
  constructor(options) {
    this.options = options;
  }
  get interceptors() {
    return this.options.interceptors || [];
  }
  get baseUrl() {
    return this.options.baseUrl;
  }
  unary(service, method, signal, timeoutMs, header, input, contextValues) {
    return fetch_transport_awaiter(this, void 0, void 0, function* () {
      return yield (0, run_call /* runUnaryCall */.L)({
        interceptors: this.interceptors,
        signal,
        timeoutMs,
        req: {
          stream: false,
          service,
          method,
          url: `${this.baseUrl}/${service.typeName}/${method.name}`,
          init: {},
          header: new Headers(header),
          contextValues: contextValues !== null && contextValues !== void 0 ? contextValues : (0, context_values /* createContextValues */.k)(),
          message: input
        },
        next: req => fetch_transport_awaiter(this, void 0, void 0, function* () {
          // Convert headers to plain object
          const headerObj = {
            "Content-Type": "application/json"
          };
          req.header.forEach((value, key) => {
            headerObj[key] = value;
          });
          const response = yield fetch(req.url, {
            method: "POST",
            body: JSON.stringify(req.message),
            headers: headerObj,
            signal: req.signal
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return {
            stream: false,
            service,
            method,
            header: response.headers,
            trailer: new Headers(),
            message: method.O.fromJson(yield response.json())
          };
        })
      });
    });
  }
  stream(service, method, signal, timeoutMs, header, input, contextValues) {
    return fetch_transport_awaiter(this, void 0, void 0, function* () {
      return yield (0, run_call /* runStreamingCall */.u)({
        interceptors: this.interceptors,
        signal,
        timeoutMs,
        req: {
          stream: true,
          service,
          method,
          url: `${this.baseUrl}/${service.typeName}/${method.name}`,
          init: {
            method: "POST",
            redirect: "error",
            mode: "cors"
          },
          header: (() => {
            const headers = new Headers({
              "Content-Type": "application/connect+json"
            });
            if (header) {
              const inputHeaders = new Headers(header);
              inputHeaders.forEach((value, key) => {
                headers.set(key, value);
              });
            }
            return headers;
          })(),
          contextValues: contextValues !== null && contextValues !== void 0 ? contextValues : (0, context_values /* createContextValues */.k)(),
          message: input
        },
        next: req => fetch_transport_awaiter(this, void 0, void 0, function* () {
          // Convert the async iterable of messages to the Connect streaming format
          const requestBody = this.createConnectStreamingBody(req.message, method);
          // Convert headers to plain object
          const headerObj = {};
          req.header.forEach((value, key) => {
            headerObj[key] = value;
          });
          const response = yield fetch(req.url, {
            method: "POST",
            body: requestBody,
            headers: headerObj,
            signal: req.signal
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return {
            stream: true,
            service,
            method,
            header: response.headers,
            trailer: new Headers(),
            message: this.parseConnectStreamingResponse(response, method)
          };
        })
      });
    });
  }
  createConnectStreamingBody(input,
  // biome-ignore lint/suspicious/noExplicitAny: any hard to avoid with connect
  method) {
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        return fetch_transport_awaiter(this, void 0, void 0, function* () {
          var _a, e_1, _b, _c;
          try {
            try {
              for (var _d = true, input_1 = fetch_transport_asyncValues(input), input_1_1; input_1_1 = yield input_1.next(), _a = input_1_1.done, !_a; _d = true) {
                _c = input_1_1.value;
                _d = false;
                const message = _c;
                // Serialize the message to JSON
                const normalizedMessage = new method.I(message);
                const jsonMessage = normalizedMessage.toJson();
                const messageBytes = encoder.encode(JSON.stringify(jsonMessage));
                // Create Connect streaming envelope
                // Format: [flags: 1 byte][length: 4 bytes][data: length bytes]
                const envelope = new Uint8Array(5 + messageBytes.length);
                envelope[0] = 0; // flags: 0 for regular message
                // Length in big-endian format
                const length = messageBytes.length;
                envelope[1] = length >>> 24 & 0xff;
                envelope[2] = length >>> 16 & 0xff;
                envelope[3] = length >>> 8 & 0xff;
                envelope[4] = length & 0xff;
                // Copy message data
                envelope.set(messageBytes, 5);
                controller.enqueue(envelope);
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
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        });
      }
    });
  }
  parseConnectStreamingResponse(response,
  // biome-ignore lint/suspicious/noExplicitAny: any hard to avoid with connect
  method) {
    const decoder = new TextDecoder();
    return {
      [Symbol.asyncIterator]() {
        return __asyncGenerator(this, arguments, function* _a() {
          if (!response.body) {
            throw new Error("No response body");
          }
          const reader = response.body.getReader();
          let buffer = new Uint8Array(0);
          try {
            while (true) {
              const {
                done,
                value
              } = yield __await(reader.read());
              if (done) break;
              // Append new data to buffer
              const newBuffer = new Uint8Array(buffer.length + value.length);
              newBuffer.set(buffer);
              newBuffer.set(value, buffer.length);
              buffer = newBuffer;
              // Process complete envelopes from buffer
              while (buffer.length >= 5) {
                // Read envelope header (1 byte flags + 4 bytes length)
                const flags = buffer[0];
                const length = buffer[1] << 24 | buffer[2] << 16 | buffer[3] << 8 | buffer[4];
                // Check if we have the complete message
                if (buffer.length < 5 + length) {
                  break; // Wait for more data
                }
                // Extract message data
                const messageData = buffer.slice(5, 5 + length);
                buffer = buffer.slice(5 + length);
                // Check if this is an end-stream message
                if (flags & 0x02) {
                  // End stream flag
                  // Parse end-stream message
                  const endStreamData = JSON.parse(decoder.decode(messageData));
                  if (endStreamData.error) {
                    const error = new Error(endStreamData.error.message || "Stream error");
                    if (typeof endStreamData.error.code !== "undefined") {
                      error.code = endStreamData.error.code;
                    }
                    throw error;
                  }
                  return yield __await(void 0); // End of stream
                } else {
                  // Regular message - parse and yield
                  const jsonData = JSON.parse(decoder.decode(messageData));
                  const message = method.O.fromJson(jsonData);
                  yield yield __await(message);
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        });
      }
    };
  }
}