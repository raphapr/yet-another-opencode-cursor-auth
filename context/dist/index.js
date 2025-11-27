// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  r2: () => (/* reexport */DisposableSpan),
  q6: () => (/* reexport */core_createContext),
  V5: () => (/* reexport */createContextFromSpanContext),
  cF: () => (/* reexport */createKey),
  h: () => (/* reexport */createLogger),
  VI: () => (/* reexport */createSpan),
  fU: () => (/* reexport */getSpan),
  _O: () => (/* reexport */loggerKey),
  HF: () => (/* reexport */reportEvent),
  eF: () => (/* reexport */run),
  uk: () => (/* reexport */wait),
  fR: () => (/* reexport */withSpan)
});

// UNUSED EXPORTS: ROOT_SPAN_KEY, ROOT_SPAN_START_MS_KEY, SPAN_KEY, autoTrace, createContextFromSpan, createTracedContext, forceFlush, getTracer, initializeBrowserBridge, runWithSpan, shutdown, traced, updateSampleRate

; // ../context/dist/browser-bridge.js
/** biome-ignore-all lint/suspicious/noExplicitAny: spans love any */
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
/**
 * Browser-specific bridge for routing OpenTelemetry spans to a collector callback.
 * This module can import OpenTelemetry packages since it's part of @anysphere/context.
 *
 * The bridge sets up a global TracerProvider that @anysphere/context's span creation
 * functions (withSpan, createSpan, etc.) will automatically use. When spans end,
 * they are converted to ExportableSpan format and passed to the collector callback.
 *
 * This allows browser code (which cannot import OpenTelemetry packages due to eslint
 * restrictions) to capture OTEL spans by simply providing a collector callback.
 *
 * Note: This implementation uses only @opentelemetry/api (which is available in browser)
 * and implements a minimal TracerProvider without depending on SDK packages.
 */

let providerInstance;
let collectorCallback;
let currentSampleRate = 0.01;
/**
 * Generate random hex string for IDs
 */
function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
}
/**
 * Minimal Span implementation that captures data and calls collector on end
 */
class CollectorSpan {
  constructor(name, options, traceId, parentSpanId) {
    this._attributes = {};
    this._status = {
      code: SpanStatusCode.UNSET
    };
    this._ended = false;
    this._name = name;
    this._traceId = traceId;
    this._spanId = randomHex(8); // 64-bit span ID
    this._parentSpanId = parentSpanId;
    this._kind = options.kind || SpanKind.INTERNAL;
    this._startTime = Date.now();
    // Set initial attributes
    if (options.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        this._attributes[key] = String(value);
      }
    }
  }
  spanContext() {
    return {
      traceId: this._traceId,
      spanId: this._spanId,
      traceFlags: 1,
      // sampled
      isRemote: false
    };
  }
  setAttribute(key, value) {
    if (!this._ended) {
      this._attributes[key] = String(value);
    }
    return this;
  }
  setAttributes(attributes) {
    if (!this._ended) {
      for (const [key, value] of Object.entries(attributes)) {
        this._attributes[key] = String(value);
      }
    }
    return this;
  }
  addEvent() {
    return this;
  }
  addLink() {
    return this;
  }
  addLinks() {
    return this;
  }
  setStatus(status) {
    if (!this._ended) {
      this._status = status;
    }
    return this;
  }
  updateName(name) {
    if (!this._ended) {
      this._name = name;
    }
    return this;
  }
  end() {
    if (this._ended) {
      return;
    }
    this._ended = true;
    this._endTime = Date.now();
    // Call collector callback
    if (collectorCallback) {
      try {
        collectorCallback({
          traceId: this._traceId,
          spanId: this._spanId,
          parentSpanId: this._parentSpanId,
          name: this._name,
          startTime: this._startTime,
          endTime: this._endTime,
          attributes: Object.assign({}, this._attributes),
          error: this._status.code === SpanStatusCode.ERROR,
          flags: 1,
          // sampled
          kind: this._kind,
          statusCode: this._status.code,
          statusMessage: this._status.message,
          links: []
        });
      } catch (error) {
        console.error("[browser-bridge] Error in collector callback", error);
      }
    }
  }
  isRecording() {
    return !this._ended;
  }
  recordException() {
    return this;
  }
}
/**
 * Minimal Tracer implementation
 */
class CollectorTracer {
  startSpan(name, options, ctx) {
    // Check sampling
    if (Math.random() >= currentSampleRate) {
      // Return no-op span
      return trace.wrapSpanContext({
        traceId: "",
        spanId: "",
        traceFlags: 0
      });
    }
    // Get parent span from context
    const parentSpan = ctx ? trace.getSpan(ctx) : trace.getActiveSpan();
    const parentContext = parentSpan === null || parentSpan === void 0 ? void 0 : parentSpan.spanContext();
    let traceId;
    let parentSpanId;
    if (parentContext === null || parentContext === void 0 ? void 0 : parentContext.traceId) {
      traceId = parentContext.traceId;
      parentSpanId = parentContext.spanId;
    } else {
      traceId = randomHex(16); // 128-bit trace ID
    }
    return new CollectorSpan(name, options || {}, traceId, parentSpanId);
  }
  startActiveSpan(name, ...args) {
    let options = {};
    let ctx;
    let fn;
    if (args.length === 1) {
      fn = args[0];
    } else if (args.length === 2) {
      options = args[0];
      fn = args[1];
    } else {
      options = args[0];
      ctx = args[1];
      fn = args[2];
    }
    const span = this.startSpan(name, options, ctx);
    const newContext = trace.setSpan(ctx || context.active(), span);
    return context.with(newContext, () => {
      try {
        const result = fn(span);
        if (result && typeof result.then === "function") {
          return result.then(value => {
            span.end();
            return value;
          }, error => {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error === null || error === void 0 ? void 0 : error.message
            });
            span.end();
            throw error;
          });
        }
        span.end();
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error === null || error === void 0 ? void 0 : error.message
        });
        span.end();
        throw error;
      }
    });
  }
}
/**
 * Minimal TracerProvider implementation
 */
class CollectorTracerProvider {
  constructor() {
    this.tracer = new CollectorTracer();
  }
  getTracer() {
    return this.tracer;
  }
}
/**
 * Initialize the browser OTEL provider with a collector callback
 */
function initializeBrowserBridge(collector, sampleRate) {
  if (providerInstance) {
    return; // Already initialized
  }
  collectorCallback = collector;
  currentSampleRate = sampleRate;
  try {
    providerInstance = new CollectorTracerProvider();
    // Register as global tracer provider so context package picks it up
    trace.setGlobalTracerProvider(providerInstance);
    console.debug("[browser-bridge] Initialized OTEL provider with collector callback");
  } catch (error) {
    console.error("[browser-bridge] Failed to initialize OTEL provider", error);
  }
}
/**
 * Update the sample rate
 */
function updateSampleRate(sampleRate) {
  currentSampleRate = sampleRate;
}
/**
 * Force flush any pending spans (no-op for our implementation)
 */
function forceFlush() {
  return __awaiter(this, void 0, void 0, function* () {
    // No-op: spans are immediately sent to collector on end()
  });
}
/**
 * Shutdown the provider
 */
function shutdown() {
  return __awaiter(this, void 0, void 0, function* () {
    if (providerInstance) {
      providerInstance = undefined;
      collectorCallback = undefined;
    }
  });
}
; // ../context/dist/core.js
/**
 * TypeScript context implementation based on AbortController
 * Provides cancellation, deadlines, and typed value propagation
 */
var core_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
/**
 * Create a new context key with type information
 */
function createKey(name, defaultValue) {
  return {
    symbol: name,
    defaultValue
  };
}
/**
 * Internal context implementation
 */
class ContextImpl {
  constructor(parent, controller, values, name, detached) {
    this.parent = parent;
    this.controller = controller || new AbortController();
    this.values = values || new Map();
    this.name = name;
    // Propagate parent cancellation
    if (parent && !detached) {
      if (parent.signal.aborted) {
        this.controller.abort(parent.signal.reason);
      } else {
        // Use { once: true } to auto-remove listener after it fires
        // This prevents accumulation of listeners on long-lived parents
        parent.signal.addEventListener("abort", () => {
          this.controller.abort(parent.signal.reason);
        }, {
          once: true
        });
      }
    }
  }
  get signal() {
    return this.controller.signal;
  }
  get canceled() {
    return this.signal.aborted;
  }
  get reason() {
    return this.signal.reason;
  }
  get(key) {
    // Check own values first
    if (this.values.has(key.symbol)) {
      return this.values.get(key.symbol);
    }
    // Check parent values
    if (this.parent) {
      return this.parent.get(key);
    }
    // Return default value if specified
    return key.defaultValue;
  }
  with(key, value) {
    const newValues = new Map(this.values);
    newValues.set(key.symbol, value);
    return new ContextImpl(this, undefined, newValues);
  }
  withCancel() {
    const controller = new AbortController();
    const ctx = new ContextImpl(this, controller);
    return [ctx, () => controller.abort()];
  }
  withTimeout(ms) {
    const controller = new AbortController();
    const ctx = new ContextImpl(this, controller);
    const timeoutId = setTimeout(() => {
      controller.abort(new Error("context deadline exceeded"));
    }, ms);
    // Clear timeout if context is canceled early
    controller.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
    }, {
      once: true
    });
    return ctx;
  }
  withDeadline(deadline) {
    const ms = deadline.getTime() - Date.now();
    if (ms <= 0) {
      // Already expired
      const controller = new AbortController();
      controller.abort(new Error("context deadline exceeded"));
      return new ContextImpl(this, controller);
    }
    return this.withTimeout(ms);
  }
  /**
   * Create a child context with both a timeout and manual cancellation
   * Properly cleans up the timeout when cancel() is called early
   */
  withTimeoutAndCancel(ms) {
    const [cancelCtx, cancel] = this.withCancel();
    const timeoutCtx = cancelCtx.withTimeout(ms);
    return [timeoutCtx, cancel];
  }
  withName(name) {
    return new ContextImpl(this, undefined, undefined, name);
  }
  withDetached() {
    return new ContextImpl(this, undefined, undefined, undefined, true);
  }
  getParent() {
    return this.parent;
  }
  getPath() {
    const path = [];
    let current = this;
    while (current) {
      if (current.name) {
        path.unshift(current.name);
      }
      current = current.getParent();
    }
    return path;
  }
}
/**
 * Create a new root context
 */
function core_createContext() {
  return new ContextImpl();
}
/**
 * Run an async function with context cancellation support
 */
function run(ctx, fn) {
  return core_awaiter(this, void 0, void 0, function* () {
    if (ctx.canceled) {
      throw ctx.reason || new Error("context canceled");
    }
    return new Promise((resolve, reject) => {
      // Handle context cancellation
      const onAbort = () => {
        reject(ctx.reason || new Error("context canceled"));
      };
      if (ctx.signal.aborted) {
        onAbort();
        return;
      }
      ctx.signal.addEventListener("abort", onAbort);
      // Run the function
      fn(ctx).then(resolve).catch(reject).finally(() => {
        ctx.signal.removeEventListener("abort", onAbort);
      });
    });
  });
}
/**
 * Wait for context cancellation
 */
function wait(ctx) {
  return new Promise(resolve => {
    if (ctx.canceled) {
      resolve();
      return;
    }
    ctx.signal.addEventListener("abort", () => resolve(), {
      once: true
    });
  });
}
/**
 * Example usage:
 *
 * const ctx = build()
 *   .value(keys.traceId, '123')
 *   .value(keys.userId, 'user-456')
 *   .timeout(5000)
 *   .build();
 *
 * const [childCtx, cancel] = ctx.withCancel();
 *
 * await run(childCtx, async (ctx) => {
 *   const traceId = ctx.get(keys.traceId);
 *   // Do work...
 * });
 */

; // ../context/dist/logger.js
/**
 * Structured logging module that integrates with the context system
 */

const defaultLoggerBackend = {
  log: (_ctx, {
    level,
    message,
    metadata,
    error
  }) => {
    const elements = [level, message, metadata, error].filter(x => x !== undefined);
    if (level === "error") {
      console.error(...elements);
    } else {
      console.log(...elements);
    }
  }
};
/**
 * Context key for storing the logger
 */
const loggerKey = createKey(Symbol("loggerBackend"), defaultLoggerBackend);
function getLoggerBackend(ctx) {
  return ctx.get(loggerKey);
}
function createLogger(_name) {
  function log(ctx, entry) {
    const timestamp = new Date();
    const logger = getLoggerBackend(ctx);
    logger.log(ctx, Object.assign(Object.assign({}, entry), {
      timestamp
    }));
  }
  return {
    debug: (ctx, message, metadata) => {
      log(ctx, {
        level: "debug",
        message,
        context: ctx,
        metadata
      });
    },
    info: (ctx, message, metadata) => {
      log(ctx, {
        level: "info",
        message,
        context: ctx,
        metadata
      });
    },
    warn: (ctx, message, metadata) => {
      log(ctx, {
        level: "warn",
        message,
        context: ctx,
        metadata
      });
    },
    error: (ctx, message, error, metadata) => {
      log(ctx, {
        level: "error",
        message,
        context: ctx,
        error,
        metadata
      });
    }
  };
}

// EXTERNAL MODULE: ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace-api.js + 1 modules
var trace_api = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace-api.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context-api.js
var context_api = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/context-api.js");
// EXTERNAL MODULE: ../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
var span_kind = __webpack_require__("../../node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/trace/span_kind.js");
; // ../context/dist/otel.js
/**
 * Minimal OpenTelemetry integration for Context
 * Uses context values to propagate spans through the hierarchy
 */
var otel_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

/**
 * Context key for storing the current span
 */
const SPAN_KEY = createKey(Symbol("otel.span"), undefined);
/** Marks the root span (top-most) for the current logical trace */
const ROOT_SPAN_KEY = createKey(Symbol("otel.root_span"), undefined);
/** Start time (ms since epoch) when the root span started */
const ROOT_SPAN_START_MS_KEY = createKey(Symbol("otel.root_start_ms"), undefined);
/**
 * Get or create a tracer
 */
function getTracer(name = "context-tracer") {
  return trace_api /* trace */.u.getTracer(name);
}
/**
 * Start a span for a context, using the context's name and parent span
 */
function withSpan(ctx, options) {
  const tracer = getTracer();
  // Get parent span from parent context if available
  const parentSpan = ctx.get(SPAN_KEY);
  // Use context name or generate one
  const spanName = ctx.name || "anonymous-context";
  // Create span; if a parent exists, start the span within that context
  let span;
  if (parentSpan) {
    const parentCtx = trace_api /* trace */.u.setSpan(context_api /* context */._.active(), parentSpan);
    span = tracer.startSpan(spanName, options, parentCtx);
  } else {
    span = tracer.startSpan(spanName, options);
  }
  // Return context with span attached
  const startMs = Date.now();
  let ctxWith = ctx.with(SPAN_KEY, span);
  if (!parentSpan) {
    // First span in this logical chain; record as root
    ctxWith = ctxWith.with(ROOT_SPAN_KEY, span).with(ROOT_SPAN_START_MS_KEY, startMs);
  }
  return ctxWith;
}
/**
 * Get the current span from context
 */
function getSpan(ctx) {
  return ctx.get(SPAN_KEY);
}
/**
 * Run a function with automatic span creation and management
 */
function runWithSpan(ctx, fn, options) {
  return otel_awaiter(this, void 0, void 0, function* () {
    const ctxWithSpan = withSpan(ctx, options);
    const span = getSpan(ctxWithSpan);
    try {
      const result = yield fn(ctxWithSpan, span);
      span.setStatus({
        code: 1
      }); // SUCCESS
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: 2,
        message: error === null || error === void 0 ? void 0 : error.toString()
      }); // ERROR
      throw error;
    } finally {
      span.end();
    }
  });
}
/**
 * Report an instantaneous event as a zero-length span parented to the current span.
 * Also records the relative time (ms since root start) on both the root span and the event span
 * under attribute key `event.${name}`.
 */
function reportEvent(ctx, name) {
  var _a;
  try {
    const tracer = getTracer();
    const parentSpan = getSpan(ctx);
    if (!parentSpan) {
      return;
    }
    // Start the event span within the parent span's context
    const parentCtx = trace_api /* trace */.u.setSpan(context_api /* context */._.active(), parentSpan);
    const eventSpan = tracer.startSpan(name, undefined, parentCtx);
    const now = Date.now();
    const rootStart = ctx.get(ROOT_SPAN_START_MS_KEY);
    const delta = typeof rootStart === "number" ? now - rootStart : 0;
    // Attribute on both the root span and the event span
    const attrKey = `event.${name}`;
    const rootSpan = (_a = ctx.get(ROOT_SPAN_KEY)) !== null && _a !== void 0 ? _a : parentSpan;
    rootSpan.setAttribute(attrKey, delta);
    eventSpan.setAttribute(attrKey, delta);
    eventSpan.end();
  } catch (_b) {
    // Swallow errors to avoid disrupting the main flow
  }
}
/**
 * Create a traced context builder that automatically adds spans
 */
function traced(ctx) {
  return withSpan(ctx);
}
/**
 * Wrap the context withName method to automatically add spans
 * This allows transparent tracing of all named contexts
 */
function autoTrace(ctx) {
  const originalWithName = ctx.withName.bind(ctx);
  // Create a proxy that intercepts withName calls
  return new Proxy(ctx, {
    get(target, prop) {
      if (prop === "withName") {
        return name => {
          const namedCtx = originalWithName(name);
          // Automatically add a span for any named context
          return withSpan(namedCtx);
        };
      }
      return target[prop];
    }
  });
}
/**
 * Create a root context with automatic tracing enabled
 */
function createTracedContext() {
  return autoTrace(createContext());
}
/**
 * Create a context from a parent span. This is useful for bridging between
 * different tracing systems (e.g., VSCode's Ctx to @anysphere/context's Context).
 *
 * @param parentSpan The parent span to link the new context to
 * @param name Optional name for the context
 * @returns A new context with a span parented to the provided span
 */
function createContextFromSpan(parentSpan, name) {
  const ctx = name ? createContext().withName(name) : createContext();
  return ctx.with(SPAN_KEY, parentSpan);
}
/**
 * Create a context from a span context (traceId, spanId, etc.) without a parent span object.
 * This creates a new OpenTelemetry span that is a child of the remote span context.
 *
 * @param spanContext An object with traceId, spanId, and traceFlags
 * @param name Optional name for the context
 * @returns A new context with a span parented to the provided span context
 */
function createContextFromSpanContext(spanContext, name, existingContext) {
  const tracer = getTracer();
  // Create an OpenTelemetry span context from the provided context
  const remoteSpanContext = {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    traceFlags: spanContext.traceFlags,
    isRemote: true
  };
  // Create an OpenTelemetry context with the remote span context
  const otelCtx = trace_api /* trace */.u.setSpanContext(context_api /* context */._.active(), remoteSpanContext);
  // Start a new span with the remote context as parent
  const spanName = name || "child.span";
  const span = tracer.startSpan(spanName, {
    kind: span_kind /* SpanKind */.v.INTERNAL
  }, otelCtx);
  // Create our context with the span
  const parentCtx = existingContext !== null && existingContext !== void 0 ? existingContext : core_createContext();
  const ctx = name ? parentCtx.withName(name) : parentCtx;
  return ctx.with(SPAN_KEY, span);
}
/**
 * Disposable span wrapper that implements Symbol.dispose
 */
class DisposableSpan {
  constructor(ctx, span) {
    this.ctx = ctx;
    this.span = span;
  }
  [Symbol.dispose]() {
    this.span.end();
  }
}
/**
 * Create a disposable span for use with the 'using' keyword
 */
function createSpan(ctx, options) {
  const ctxWithSpan = withSpan(ctx, options);
  const span = getSpan(ctxWithSpan);
  return new DisposableSpan(ctxWithSpan, span);
}
; // ../context/dist/index.js
// Export the logger and debug modules

/***/