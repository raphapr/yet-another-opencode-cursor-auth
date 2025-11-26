/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */B5: () => (/* binding */trackCancelAndFlush),
  /* harmony export */Bu: () => (/* binding */initAnalytics),
  /* harmony export */sx: () => (/* binding */trackEvent)
  /* harmony export */
});
/* unused harmony export flushAnalytics */
/* harmony import */
var _anysphere_proto_aiserver_v1_analytics_pb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../proto/dist/generated/aiserver/v1/analytics_pb.js");
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/debug.ts");
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
const DEFAULT_BUFFER_LIMIT = 200;
const DEFAULT_FLUSH_INTERVAL_MS = 3000;
const DEFAULT_NORMAL_FLUSH_TIMEOUT_MS = 2500;
function toEventData(props) {
  const out = {};
  if (!props) return out;
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === "string") out[k] = new _anysphere_proto_aiserver_v1_analytics_pb_js__WEBPACK_IMPORTED_MODULE_0__ /* .EventData */.RV({
      data: {
        case: "stringValue",
        value: v
      }
    });else if (typeof v === "number") out[k] = new _anysphere_proto_aiserver_v1_analytics_pb_js__WEBPACK_IMPORTED_MODULE_0__ /* .EventData */.RV({
      data: {
        case: "doubleValue",
        value: v
      }
    });else if (typeof v === "boolean") out[k] = new _anysphere_proto_aiserver_v1_analytics_pb_js__WEBPACK_IMPORTED_MODULE_0__ /* .EventData */.RV({
      data: {
        case: "boolValue",
        value: v
      }
    });else if (typeof v === "bigint") out[k] = new _anysphere_proto_aiserver_v1_analytics_pb_js__WEBPACK_IMPORTED_MODULE_0__ /* .EventData */.RV({
      data: {
        case: "intValue",
        value: v
      }
    });
  }
  return out;
}
class AnalyticsBuffer {
  constructor(client, credentialManager) {
    this.client = client;
    this.credentialManager = credentialManager;
    this.buffer = [];
    this.flushTimer = null;
    this.flushing = false;
    this.bufferLimit = DEFAULT_BUFFER_LIMIT;
    this.flushIntervalMs = DEFAULT_FLUSH_INTERVAL_MS;
    this.normalFlushTimeoutMs = DEFAULT_NORMAL_FLUSH_TIMEOUT_MS;
  }
  track(eventName, props, timestamp) {
    const ts = typeof timestamp === "number" ? BigInt(timestamp) : BigInt(Date.now());
    const event = new _anysphere_proto_aiserver_v1_analytics_pb_js__WEBPACK_IMPORTED_MODULE_0__ /* .AnalyticsEvent */.XN({
      eventName,
      eventData: toEventData(props),
      timestamp: ts
    });
    this.buffer.push(event);
    if (this.buffer.length >= this.bufferLimit) this.flushInBackground();else this.scheduleFlush();
  }
  flush(timeoutMs) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (this.flushing || this.buffer.length === 0) return;
      // Check if we have valid credentials before attempting to send
      try {
        const token = yield this.credentialManager.getAccessToken();
        if (!token) {
          return; // Defer flush until we have credentials
        }
      } catch (err) {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("analytics.flush.deferred", {
          reason: "token_check_failed",
          error: err,
          count: this.buffer.length
        });
        return; // Defer flush on credential check error
      }
      const toSend = this.buffer.slice();
      if (toSend.length === 0) return;
      this.flushing = true;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      (_a = timeout.unref) === null || _a === void 0 ? void 0 : _a.call(timeout);
      try {
        yield this.client.trackEvents(new _anysphere_proto_aiserver_v1_analytics_pb_js__WEBPACK_IMPORTED_MODULE_0__ /* .TrackEventsRequest */.cg({
          events: toSend
        }), {
          signal: controller.signal
        });
        // Success: clear any events we just sent
        this.buffer.splice(0, toSend.length);
      } catch (err) {
        (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("analytics.flush.error", {
          error: err
        });
        // On failure, keep the newest N events within limit
        if (this.buffer.length > this.bufferLimit) {
          this.buffer.splice(0, this.buffer.length - this.bufferLimit);
        }
      } finally {
        clearTimeout(timeout);
        this.flushing = false;
      }
    });
  }
  scheduleFlush() {
    var _a, _b;
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flushInBackground();
    }, this.flushIntervalMs);
    (_b = (_a = this.flushTimer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
  }
  flushInBackground() {
    // Fire and forget; do not await
    void this.flush(this.normalFlushTimeoutMs);
  }
}
let instance = null;
// Simple buffer that just stores events until real analytics is initialized
class DeferredAnalyticsBuffer {
  constructor() {
    this.events = [];
  }
  track(eventName, props, timestamp) {
    this.events.push({
      eventName,
      props,
      timestamp
    });
  }
  flush() {
    return __awaiter(this, void 0, void 0, function* () {
      // No-op for deferred buffer
    });
  }
  getEvents() {
    return this.events;
  }
  clear() {
    this.events = [];
  }
}
// Initialize with deferred buffer immediately
if (!instance) {
  instance = {
    buffer: new DeferredAnalyticsBuffer()
  };
}
function initAnalytics(client, credentialManager) {
  if (!instance) return; // shouldn't happen
  // Create real buffer
  const realBuffer = new AnalyticsBuffer(client, credentialManager);
  // Replay any deferred events
  if (instance.buffer instanceof DeferredAnalyticsBuffer) {
    const deferredEvents = instance.buffer.getEvents();
    for (const event of deferredEvents) {
      realBuffer.track(event.eventName, event.props, event.timestamp);
    }
    instance.buffer.clear();
  }
  // Replace with real buffer
  instance.buffer = realBuffer;
}
function trackEvent(eventName, props, timestamp) {
  try {
    // instance is always available now (initialized with deferred buffer)
    instance.buffer.track(eventName, props, timestamp);
  } catch (err) {
    try {
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("analytics.track.error", {
        eventName,
        error: String(err)
      });
    } catch (_a) {}
  }
}
function flushAnalytics() {
  return __awaiter(this, void 0, void 0, function* () {
    if (!instance) return;
    yield instance.buffer.flush(DEFAULT_NORMAL_FLUSH_TIMEOUT_MS);
  });
}
function trackCancelAndFlush() {
  try {
    if (!instance) return;
    instance.buffer.track("cli.cancel_maybe_quit");
    // Only flush if we have a real buffer (not deferred)
    if (instance.buffer instanceof AnalyticsBuffer) {
      void instance.buffer.flush(300); // we don't actually wait for this, it's best effort
    }
  } catch (err) {
    try {
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_1__.debugLog)("analytics.cancel.flush.error", {
        error: String(err)
      });
    } catch (_a) {
      // we do NOT want to block cancellation
    }
  }
}

/***/