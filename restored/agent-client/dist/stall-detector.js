const logger = (0, dist /* createLogger */.h)("@anysphere/agent-client:stall-detector");
const streamStallCount = (0, metrics_dist /* createCounter */.Pu)("agent_client.stream.stall.count", {
  description: "Number of bidirectional stream stalls detected",
  labelNames: ["activity_type", "message_type"]
});
const streamStallDuration = (0, metrics_dist /* createHistogram */.v5)("agent_client.stream.stall.duration_ms", {
  description: "Duration of stream stalls in milliseconds",
  labelNames: ["activity_type"]
});
const streamDidStall = (0, metrics_dist /* createCounter */.Pu)("agent_client.stream.did_stall", {
  description: "Number of streams that experienced at least one stall"
});
const streamTotal = (0, metrics_dist /* createCounter */.Pu)("agent_client.stream.total", {
  description: "Total number of streams monitored"
});
/**
 * Detects when a bidirectional stream has no activity for a specified threshold.
 * Implements Disposable for automatic cleanup with the 'using' keyword.
 *
 * The detector uses a single timer that resets on ANY stream activity (inbound or outbound),
 * detecting true "stream stall" rather than directional issues.
 */
class StallDetector {
  constructor(ctx, thresholdMs) {
    this.ctx = ctx;
    this.thresholdMs = thresholdMs;
    this.hasLogged = false;
    this.hasEverStalled = false;
    this.activities = [];
    this.lastActivityTime = Date.now();
    this.startTimer();
    // Track that we started monitoring a stream
    streamTotal.increment(this.ctx, 1);
    ctx.signal.addEventListener("abort", () => {
      this.trackActivity("ctx.signal", "abort");
      this.abortedAt = Date.now();
    });
  }
  trackActivity(activityType, messageType) {
    var _a;
    const last = this.activities.at(-1);
    if ((last === null || last === void 0 ? void 0 : last.type) === activityType && last.messageType === messageType) {
      last.times = ((_a = last.times) !== null && _a !== void 0 ? _a : 1) + 1;
    } else {
      this.activities.push({
        type: activityType,
        messageType
      });
    }
  }
  /**
   * Reset the stall timer. Call this on ANY stream activity.
   * @param activityType Type of activity for debugging
   * @param messageType Message type (e.g., "interactionUpdate" for inbound, "runRequest" for outbound)
   */
  reset(activityType = "inbound_message", messageType) {
    const now = Date.now();
    const wasStalled = this.hasLogged;
    // Calculate stall duration before updating lastActivityTime
    const stallDurationMs = wasStalled ? now - this.lastActivityTime : 0;
    this.lastActivityTime = now;
    this.trackActivity(activityType, messageType);
    // If we had logged a stall and now have activity, log recovery
    if (wasStalled) {
      this.hasLogged = false;
      this.logRecovery(activityType, stallDurationMs);
    }
    // Restart the timer
    this.startTimer();
  }
  startTimer() {
    // Clear existing timer
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    // Start new timer
    this.timer = setTimeout(() => {
      this.onStallDetected();
    }, this.thresholdMs);
  }
  buildLogMetadata(stallFields) {
    var _a;
    const metadata = this.ctx.get(agentStreamMetadata);
    const stall = Object.assign({}, stallFields);
    if ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.modelDetails) === null || _a === void 0 ? void 0 : _a.displayName) {
      stall.model_name = metadata.modelDetails.displayName;
    }
    if (this.abortedAt) {
      stall.aborted_ago_ms = Date.now() - this.abortedAt;
    }
    const activitiesLines = [];
    let lastType;
    for (const {
      type,
      messageType,
      times
    } of this.activities.splice(0).reverse()) {
      if (lastType !== type) {
        if (!lastType) {
          activitiesLines.push(`[${type}] (MOST RECENT)`);
        } else {
          activitiesLines.push(`[${type}]`);
        }
        lastType = type;
      }
      activitiesLines.push(`${messageType}${times ? ` (x${times})` : ""}`);
    }
    stall.activities = activitiesLines.join("\n");
    return {
      reqId: metadata === null || metadata === void 0 ? void 0 : metadata.requestId,
      stall
    };
  }
  onStallDetected() {
    var _a, _b;
    // Only log once per stall period
    if (this.hasLogged) {
      return;
    }
    this.hasLogged = true;
    // Get before buildLogMetadata splices.
    const lastActivity = this.activities.at(-1);
    try {
      const now = Date.now();
      const durationMs = now - this.lastActivityTime;
      const logMetadata = this.buildLogMetadata({
        duration_ms: durationMs,
        threshold_ms: this.thresholdMs
      });
      // Structured logging
      logger.warn(this.ctx, "[NAL client stall detector] Bidirectional stream stall detected - no activity for threshold period", logMetadata);
      // Emit counter metric on detection with labels
      // Note: histogram is emitted on recovery to capture actual stall duration
      streamStallCount.increment(this.ctx, 1, {
        activity_type: (_a = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.type) !== null && _a !== void 0 ? _a : "unknown",
        message_type: (_b = lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity.messageType) !== null && _b !== void 0 ? _b : "unknown"
      });
      // Track if this is the first stall for this stream
      if (!this.hasEverStalled) {
        this.hasEverStalled = true;
        streamDidStall.increment(this.ctx, 1);
      }
    } catch (error) {
      // Stall detection should never crash the stream
      console.error("Error in stall detection:", error);
    }
  }
  logRecovery(activityType, stallDurationMs) {
    try {
      const logMetadata = this.buildLogMetadata({
        duration_ms: stallDurationMs
      });
      // Structured logging for recovery
      logger.info(this.ctx, "[NAL client stall detector] Stream activity resumed after stall", logMetadata);
      // Emit histogram metric with actual stall duration and activity type label
      streamStallDuration.histogram(this.ctx, stallDurationMs, {
        activity_type: activityType
      });
    } catch (error) {
      // Recovery logging should never crash the stream
      console.error("Error logging stream recovery:", error);
    }
  }
  /**
   * Cleanup - called automatically when using 'using' keyword
   */
  [Symbol.dispose]() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}