/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */Pu: () => (/* binding */createCounter),
  /* harmony export */v5: () => (/* binding */createHistogram)
  /* harmony export */
});
/* unused harmony exports metricsKey, createGauge */
/* harmony import */
var _anysphere_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../context/dist/index.js");
/**
 * Metrics module that integrates with the context system
 * Allows defining metrics globally, with behavior configured through context
 */

// Export label middleware

/**
 * Default metrics backend that does nothing (no-op)
 */
const defaultMetricsBackend = {
  record: () => {
    // No-op - metrics are discarded if no backend is configured
  },
  increment: () => {
    // No-op
  },
  gauge: () => {
    // No-op
  },
  histogram: () => {
    // No-op
  }
};
/**
 * Context key for storing the metrics backend
 */
const metricsKey = (0, _anysphere_context__WEBPACK_IMPORTED_MODULE_0__ /* .createKey */.cF)(Symbol("metricsBackend"), defaultMetricsBackend);
/**
 * Get the metrics backend from context
 */
function getMetricsBackend(ctx) {
  return ctx.get(metricsKey);
}
/**
 * Create a counter metric
 * Counters track increasing values and should only be incremented.
 *
 * @param name - Unique name for the metric
 * @param options - Optional configuration
 * @returns A counter metric handle with strongly typed labels
 *
 * @example
 * ```typescript
 * const requestsTotal = createCounter("http_requests_total", {
 *   description: "Total number of HTTP requests",
 *   labelNames: ["method", "status_code"] as const
 * });
 *
 * // Later, increment using context - labels are strongly typed!
 * requestsTotal.increment(ctx, 1, { method: "GET", status_code: "200" });
 * ```
 */
function createCounter(name, options) {
  const handle = {
    name,
    type: "counter",
    description: options === null || options === void 0 ? void 0 : options.description,
    labelNames: options === null || options === void 0 ? void 0 : options.labelNames
  };
  return {
    increment: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.increment(ctx, handle, value !== null && value !== void 0 ? value : 1, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}
/**
 * Create a gauge metric
 * Gauges track values that can go up or down.
 *
 * @param name - Unique name for the metric
 * @param options - Optional configuration
 * @returns A gauge metric handle with strongly typed labels
 *
 * @example
 * ```typescript
 * const activeConnections = createGauge("active_connections", {
 *   description: "Number of active connections",
 *   labelNames: ["server"] as const
 * });
 *
 * // Later, set value using context - labels are strongly typed!
 * activeConnections.gauge(ctx, 42, { server: "api-1" });
 * ```
 */
function createGauge(name, options) {
  const handle = {
    name,
    type: "gauge",
    description: options === null || options === void 0 ? void 0 : options.description,
    labelNames: options === null || options === void 0 ? void 0 : options.labelNames
  };
  return {
    gauge: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.gauge(ctx, handle, value, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}
/**
 * Create a histogram metric
 * Histograms track the distribution of values over time.
 *
 * @param name - Unique name for the metric
 * @param options - Optional configuration
 * @returns A histogram metric handle with strongly typed labels
 *
 * @example
 * ```typescript
 * const requestDuration = createHistogram("http_request_duration_seconds", {
 *   description: "HTTP request duration in seconds",
 *   labelNames: ["method", "status_code"] as const
 * });
 *
 * // Later, record a value using context - labels are strongly typed!
 * requestDuration.histogram(ctx, 0.123, { method: "GET", status_code: "200" });
 * ```
 */
function createHistogram(name, options) {
  const handle = {
    name,
    type: "histogram",
    description: options === null || options === void 0 ? void 0 : options.description,
    labelNames: options === null || options === void 0 ? void 0 : options.labelNames
  };
  return {
    histogram: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.histogram(ctx, handle, value, labels);
    },
    record: (ctx, value, labels) => {
      const backend = getMetricsBackend(ctx);
      backend.record(ctx, handle, value, labels);
    }
  };
}

/***/