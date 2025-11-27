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