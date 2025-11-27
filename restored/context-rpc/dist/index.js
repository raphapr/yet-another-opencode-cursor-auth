/**
 * Context-aware wrappers for Connect RPC clients and servers.
 * Automatically injects trace headers stored in @anysphere/context for clients,
 * and extracts trace context for servers.
 *
 * @example Client usage:
 * ```typescript
 * import { createContextPropagatingClient } from "@anysphere/context-rpc";
 * import { createContext } from "@anysphere/context";
 * import { MyService } from "./generated/service_connect";
 * import { createConnectTransport } from "@connectrpc/connect-node";
 *
 * const transport = createConnectTransport({ baseUrl: "https://api.example.com" });
 * const client = createContextPropagatingClient(MyService, transport);
 *
 * const ctx = createContext();
 * const response = await client.myMethod(ctx, { message: "hello" });
 * ```
 *
 * @example Server usage:
 * ```typescript
 * import { createContextExtractingService } from "@anysphere/context-rpc";
 * import { MyService } from "./generated/service_connect";
 * import type { ContextServiceImpl } from "@anysphere/context-rpc";
 *
 * const implementation: Partial<ContextServiceImpl<typeof MyService>> = {
 *   myMethod: async (ctx, request) => {
 *     // ctx is automatically created from incoming request headers
 *     // including revived span context for tracing
 *     return { response: "hello world" };
 *   }
 * };
 *
 * const wrappedImplementation = createContextExtractingService(implementation);
 * // Use wrappedImplementation with your Connect router
 * ```
 */

/* ──────────────────────────────────────── helpers ─────────────────────────────────────── */
/**
 * Parse W3C traceparent header to extract span context information.
 * Format: version-trace_id-span_id-trace_flags
 */
function parseTraceparentHeader(traceparent) {
  const parts = traceparent.split("-");
  if (parts.length !== 4) return null;
  const [version, traceId, spanId, flags] = parts;
  // Only support version 00
  if (version !== "00") return null;
  // Validate format
  if (traceId.length !== 32 || spanId.length !== 16 || flags.length !== 2) return null;
  const traceFlags = parseInt(flags, 16);
  if (Number.isNaN(traceFlags)) return null;
  return {
    traceId,
    spanId,
    traceFlags
  };
}
/**
 * Revive span context from incoming request headers and create a context with the span.
 */
function reviveSpanFromHeaders(headers) {
  let ctx = createContext();
  try {
    // Check for traceparent header
    const traceparent = headers.get("traceparent") || headers.get("backend-traceparent");
    if (traceparent) {
      const parsed = parseTraceparentHeader(traceparent);
      if (parsed) {
        // Create a span context from the parsed headers
        const spanContext = {
          traceId: parsed.traceId,
          spanId: parsed.spanId,
          traceFlags: parsed.traceFlags,
          isRemote: true
        };
        const tracer = getTracer();
        // Create an OpenTelemetry context with the remote span context
        const otelCtx = trace.setSpanContext(otelContext.active(), spanContext);
        // Start a new span with the remote context as parent
        const span = tracer.startSpan("rpc.incoming", {
          kind: SpanKind.SERVER
        }, otelCtx);
        // Create our context with the span
        ctx = withSpan(ctx, {
          kind: SpanKind.SERVER
        });
        // Replace the auto-generated span with our properly parented span
        ctx = ctx.with(SPAN_KEY, span);
      }
    }
  } catch (_err) {
    // Don't fail RPC calls because of tracing problems
  }
  return ctx;
}
function extractTraceHeaders(ctx) {
  var _a, _b;
  const headers = new Headers();
  try {
    // `getSpan` can throw if tracing is disabled – swallow errors.
    const span = (0, context_dist /* getSpan */.fU)(ctx);
    const spanContext = (_a = span === null || span === void 0 ? void 0 : span.spanContext) === null || _a === void 0 ? void 0 : _a.call(span);
    if ((spanContext === null || spanContext === void 0 ? void 0 : spanContext.traceId) && spanContext.spanId) {
      const traceFlags = (_b = spanContext.traceFlags) !== null && _b !== void 0 ? _b : 0;
      const headerValue = `00-${spanContext.traceId}-${spanContext.spanId}-${traceFlags.toString(16).padStart(2, "0")}`;
      headers.set("traceparent", headerValue);
      // Our backend only respects backend-traceparent.
      headers.set("backend-traceparent", headerValue);
      if (spanContext.traceState) {
        const traceState = typeof spanContext.traceState.serialize === "function" ? spanContext.traceState.serialize() : String(spanContext.traceState);
        headers.set("tracestate", traceState);
      }
    }
  } catch (_err) {
    // Do not fail RPC calls because of tracing problems.
  }
  return headers;
}
function mergeHeaders(...sources) {
  const merged = new Headers();
  for (const src of sources) {
    if (!src) continue;
    if (src instanceof Headers) {
      src.forEach((v, k) => {
        merged.set(k, v);
      });
    } else {
      Object.entries(src).forEach(([k, v]) => {
        merged.set(k, v);
      });
    }
  }
  return merged;
}
/**
 * Internal helper shared by the two public APIs.
 */
function addContextPropagation(client, options) {
  const {
    injectTraceHeaders = true,
    extractHeaders
  } = options;
  return new Proxy(client, {
    get(target, prop) {
      const original = target[prop];
      if (typeof original !== "function") return original;
      return (ctx, input, callOptions = {}) => {
        // Create a span for the RPC call and add to context for propagation
        const spanCtx = (0, context_dist /* withSpan */.fR)(ctx.withName(`rpc.${String(prop)}`), {
          kind: span_kind /* SpanKind */.v.CLIENT,
          attributes: {
            "rpc.method": String(prop),
            "rpc.system": "connect"
          }
        });
        const span = (0, context_dist /* getSpan */.fU)(spanCtx);
        let cleanupSignalListener;
        try {
          let contextHeaders;
          if (injectTraceHeaders) {
            contextHeaders = extractTraceHeaders(spanCtx);
          }
          if (extractHeaders) {
            const extra = extractHeaders(spanCtx);
            if (extra) contextHeaders = mergeHeaders(contextHeaders, extra);
          }
          const finalHeaders = mergeHeaders(callOptions.headers, contextHeaders);
          // Check config to determine if signal should be enabled
          const {
            signal,
            cleanup
          } = options.enableAbortSignal === true ? mergeContextSignal(spanCtx.signal, callOptions.signal) : {
            signal: callOptions.signal,
            cleanup: undefined
          };
          cleanupSignalListener = cleanup;
          const enhancedOptions = Object.assign(Object.assign({}, callOptions), {
            headers: finalHeaders,
            signal
          });
          const result = original.call(target, input, enhancedOptions);
          // Handle both sync and async results
          if (result && typeof result.then === "function") {
            return result.then(res => {
              span === null || span === void 0 ? void 0 : span.setStatus({
                code: trace_status /* SpanStatusCode */.s.OK
              });
              return res;
            }).catch(error => {
              span === null || span === void 0 ? void 0 : span.recordException(error instanceof Error ? error : new Error(String(error)));
              span === null || span === void 0 ? void 0 : span.setStatus({
                code: trace_status /* SpanStatusCode */.s.ERROR,
                message: error instanceof Error ? error.message : "RPC call failed"
              });
              throw error;
            }).finally(() => {
              span === null || span === void 0 ? void 0 : span.end();
              cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
            });
          } else {
            // Synchronous result
            span === null || span === void 0 ? void 0 : span.setStatus({
              code: trace_status /* SpanStatusCode */.s.OK
            });
            span === null || span === void 0 ? void 0 : span.end();
            cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
            return result;
          }
        } catch (error) {
          span === null || span === void 0 ? void 0 : span.recordException(error instanceof Error ? error : new Error(String(error)));
          span === null || span === void 0 ? void 0 : span.setStatus({
            code: trace_status /* SpanStatusCode */.s.ERROR,
            message: error instanceof Error ? error.message : "RPC call failed"
          });
          span === null || span === void 0 ? void 0 : span.end();
          cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
          throw error;
        }
      };
    }
  });
}
/**
 * Internal helper for wrapping server implementations.
 */
function addContextExtraction(implementation, options) {
  const {
    extractTraceHeaders = true,
    extractContext
  } = options;
  const wrappedImplementation = {};
  for (const [methodName, methodImpl] of Object.entries(implementation)) {
    if (typeof methodImpl !== "function") {
      wrappedImplementation[methodName] = methodImpl;
      continue;
    }
    wrappedImplementation[methodName] = (input, handlerContext) => {
      let ctx;
      try {
        // Create base context
        if (extractContext) {
          ctx = extractContext(handlerContext.requestHeader, handlerContext);
        } else {
          ctx = createContext();
        }
        // Extract trace headers if enabled
        if (extractTraceHeaders) {
          const spanCtx = reviveSpanFromHeaders(handlerContext.requestHeader);
          // Merge the span context with the base context
          const span = getSpan(spanCtx);
          if (span) {
            ctx = withSpan(ctx.withName(`rpc.${methodName}`), {
              kind: SpanKind.SERVER,
              attributes: {
                "rpc.method": methodName,
                "rpc.system": "connect",
                "rpc.protocol": handlerContext.protocolName
              }
            });
          }
        }
        // Call the original implementation with context as first parameter
        const contextAwareImpl = methodImpl;
        const result = contextAwareImpl(ctx, input, handlerContext);
        // Handle span completion for successful calls
        const span = getSpan(ctx);
        if (span) {
          span.setStatus({
            code: SpanStatusCode.OK
          });
          // Note: Don't end the span here for streaming methods - let the implementation handle it
          if (!result || typeof result !== "object" || !(Symbol.asyncIterator in result)) {
            span.end();
          }
        }
        return result;
      } catch (error) {
        // Handle span completion for failed calls
        const span = getSpan(ctx);
        if (span) {
          span.recordException(error instanceof Error ? error : new Error(String(error)));
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : "RPC call failed"
          });
          span.end();
        }
        throw error;
      }
    };
  }
  return wrappedImplementation;
}
function mergeContextSignal(ctxSignal, providedSignal) {
  if (providedSignal === undefined || providedSignal === ctxSignal) {
    return {
      signal: ctxSignal
    };
  }
  const controller = new AbortController();
  const abortFromContext = () => {
    controller.abort(ctxSignal.reason);
  };
  const abortFromProvided = () => {
    controller.abort(providedSignal.reason);
  };
  ctxSignal.addEventListener("abort", abortFromContext, {
    once: true
  });
  providedSignal.addEventListener("abort", abortFromProvided, {
    once: true
  });
  if (ctxSignal.aborted) {
    abortFromContext();
  } else if (providedSignal.aborted) {
    abortFromProvided();
  }
  const cleanup = () => {
    ctxSignal.removeEventListener("abort", abortFromContext);
    providedSignal.removeEventListener("abort", abortFromProvided);
  };
  return {
    signal: controller.signal,
    cleanup
  };
}
/* ──────────────────────────────────────── public API ──────────────────────────────────── */
function createContextPropagatingClient(service, transport, options = {}) {
  const base = (0, promise_client /* createClient */.UU)(service, transport);
  return addContextPropagation(base, options);
}
/**
 * Wraps a service implementation to automatically extract context from incoming requests.
 * The wrapped implementation will receive a Context as its first parameter.
 */
function createContextExtractingService(implementation, options = {}) {
  // Cast the context-aware implementation to regular implementation for wrapping
  const regularImpl = implementation;
  return addContextExtraction(regularImpl, options);
}