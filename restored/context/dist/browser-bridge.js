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