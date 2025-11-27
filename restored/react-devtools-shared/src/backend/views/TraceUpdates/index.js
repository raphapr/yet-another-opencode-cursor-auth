function TraceUpdates_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    TraceUpdates_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    TraceUpdates_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return TraceUpdates_typeof(obj);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

// How long the rect should be shown for?
var DISPLAY_DURATION = 250; // What's the longest we are willing to show the overlay for?
// This can be important if we're getting a flurry of events (e.g. scroll update).

var MAX_DISPLAY_DURATION = 3000; // How long should a rect be considered valid for?

var REMEASUREMENT_AFTER_DURATION = 250; // Markers for different types of HOCs

var HOC_MARKERS = new Map([['Forget', '✨'], ['Memo', '🧠']]); // Some environments (e.g. React Native / Hermes) don't support the performance API yet.

var getCurrentTime =
// $FlowFixMe[method-unbinding]
(typeof performance === "undefined" ? "undefined" : TraceUpdates_typeof(performance)) === 'object' && typeof performance.now === 'function' ? function () {
  return performance.now();
} : function () {
  return Date.now();
};
var nodeToData = new Map();
var agent = null;
var drawAnimationFrameID = null;
var isEnabled = false;
var redrawTimeoutID = null;
function TraceUpdates_initialize(injectedAgent) {
  agent = injectedAgent;
  agent.addListener('traceUpdates', traceUpdates);
}
function toggleEnabled(value) {
  isEnabled = value;
  if (!isEnabled) {
    nodeToData.clear();
    if (drawAnimationFrameID !== null) {
      cancelAnimationFrame(drawAnimationFrameID);
      drawAnimationFrameID = null;
    }
    if (redrawTimeoutID !== null) {
      clearTimeout(redrawTimeoutID);
      redrawTimeoutID = null;
    }
    destroy(agent);
  }
}
function traceUpdates(nodes) {
  if (!isEnabled) return;
  nodes.forEach(function (node) {
    var data = nodeToData.get(node);
    var now = getCurrentTime();
    var lastMeasuredAt = data != null ? data.lastMeasuredAt : 0;
    var rect = data != null ? data.rect : null;
    if (rect === null || lastMeasuredAt + REMEASUREMENT_AFTER_DURATION < now) {
      lastMeasuredAt = now;
      rect = measureNode(node);
    }
    var displayName = agent.getComponentNameForHostInstance(node);
    if (displayName) {
      var _extractHOCNames = extractHOCNames(displayName),
        baseComponentName = _extractHOCNames.baseComponentName,
        hocNames = _extractHOCNames.hocNames;
      var markers = hocNames.map(function (hoc) {
        return HOC_MARKERS.get(hoc) || '';
      }).join('');
      var enhancedDisplayName = markers ? "".concat(markers).concat(baseComponentName) : baseComponentName;
      displayName = enhancedDisplayName;
    }
    nodeToData.set(node, {
      count: data != null ? data.count + 1 : 1,
      expirationTime: data != null ? Math.min(now + MAX_DISPLAY_DURATION, data.expirationTime + DISPLAY_DURATION) : now + DISPLAY_DURATION,
      lastMeasuredAt: lastMeasuredAt,
      rect: rect,
      displayName: displayName
    });
  });
  if (redrawTimeoutID !== null) {
    clearTimeout(redrawTimeoutID);
    redrawTimeoutID = null;
  }
  if (drawAnimationFrameID === null) {
    drawAnimationFrameID = requestAnimationFrame(prepareToDraw);
  }
}
function prepareToDraw() {
  drawAnimationFrameID = null;
  redrawTimeoutID = null;
  var now = getCurrentTime();
  var earliestExpiration = Number.MAX_VALUE; // Remove any items that have already expired.

  nodeToData.forEach(function (data, node) {
    if (data.expirationTime < now) {
      nodeToData.delete(node);
    } else {
      earliestExpiration = Math.min(earliestExpiration, data.expirationTime);
    }
  });
  draw(nodeToData, agent);
  if (earliestExpiration !== Number.MAX_VALUE) {
    redrawTimeoutID = setTimeout(prepareToDraw, earliestExpiration - now);
  }
}
function measureNode(node) {
  if (!node || typeof node.getBoundingClientRect !== 'function') {
    return null;
  }
  var currentWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;
  return getNestedBoundingClientRect(node, currentWindow);
}