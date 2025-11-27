function canvas_toConsumableArray(arr) {
  return canvas_arrayWithoutHoles(arr) || canvas_iterableToArray(arr) || canvas_unsupportedIterableToArray(arr) || canvas_nonIterableSpread();
}
function canvas_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function canvas_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return canvas_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return canvas_arrayLikeToArray(o, minLen);
}
function canvas_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function canvas_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return canvas_arrayLikeToArray(arr);
}
function canvas_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// Note these colors are in sync with DevTools Profiler chart colors.

var COLORS = ['#37afa9', '#63b19e', '#80b393', '#97b488', '#abb67d', '#beb771', '#cfb965', '#dfba57', '#efbb49', '#febc38'];
var canvas = null;
function drawNative(nodeToData, agent) {
  var nodesToDraw = [];
  iterateNodes(nodeToData, function (_ref) {
    var color = _ref.color,
      node = _ref.node;
    nodesToDraw.push({
      node: node,
      color: color
    });
  });
  agent.emit('drawTraceUpdates', nodesToDraw);
  var mergedNodes = groupAndSortNodes(nodeToData);
  agent.emit('drawGroupedTraceUpdatesWithNames', mergedNodes);
}
function drawWeb(nodeToData) {
  if (canvas === null) {
    initialize();
  }
  var dpr = window.devicePixelRatio || 1;
  var canvasFlow = canvas;
  canvasFlow.width = window.innerWidth * dpr;
  canvasFlow.height = window.innerHeight * dpr;
  canvasFlow.style.width = "".concat(window.innerWidth, "px");
  canvasFlow.style.height = "".concat(window.innerHeight, "px");
  var context = canvasFlow.getContext('2d');
  context.scale(dpr, dpr);
  context.clearRect(0, 0, canvasFlow.width / dpr, canvasFlow.height / dpr);
  var mergedNodes = groupAndSortNodes(nodeToData);
  mergedNodes.forEach(function (group) {
    drawGroupBorders(context, group);
    drawGroupLabel(context, group);
  });
  if (canvas !== null) {
    if (nodeToData.size === 0 && canvas.matches(':popover-open')) {
      // $FlowFixMe[prop-missing]: Flow doesn't recognize Popover API
      // $FlowFixMe[incompatible-use]: Flow doesn't recognize Popover API
      canvas.hidePopover();
      return;
    } // $FlowFixMe[incompatible-use]: Flow doesn't recognize Popover API

    if (canvas.matches(':popover-open')) {
      // $FlowFixMe[prop-missing]: Flow doesn't recognize Popover API
      // $FlowFixMe[incompatible-use]: Flow doesn't recognize Popover API
      canvas.hidePopover();
    } // $FlowFixMe[prop-missing]: Flow doesn't recognize Popover API
    // $FlowFixMe[incompatible-use]: Flow doesn't recognize Popover API

    canvas.showPopover();
  }
}
function groupAndSortNodes(nodeToData) {
  var positionGroups = new Map();
  iterateNodes(nodeToData, function (_ref2) {
    var _positionGroups$get;
    var rect = _ref2.rect,
      color = _ref2.color,
      displayName = _ref2.displayName,
      count = _ref2.count;
    if (!rect) return;
    var key = "".concat(rect.left, ",").concat(rect.top);
    if (!positionGroups.has(key)) positionGroups.set(key, []);
    (_positionGroups$get = positionGroups.get(key)) === null || _positionGroups$get === void 0 ? void 0 : _positionGroups$get.push({
      rect: rect,
      color: color,
      displayName: displayName,
      count: count
    });
  });
  return Array.from(positionGroups.values()).sort(function (groupA, groupB) {
    var maxCountA = Math.max.apply(Math, canvas_toConsumableArray(groupA.map(function (item) {
      return item.count;
    })));
    var maxCountB = Math.max.apply(Math, canvas_toConsumableArray(groupB.map(function (item) {
      return item.count;
    })));
    return maxCountA - maxCountB;
  });
}
function drawGroupBorders(context, group) {
  group.forEach(function (_ref3) {
    var color = _ref3.color,
      rect = _ref3.rect;
    context.beginPath();
    context.strokeStyle = color;
    context.rect(rect.left, rect.top, rect.width - 1, rect.height - 1);
    context.stroke();
  });
}
function drawGroupLabel(context, group) {
  var mergedName = group.map(function (_ref4) {
    var displayName = _ref4.displayName,
      count = _ref4.count;
    return displayName ? "".concat(displayName).concat(count > 1 ? " x".concat(count) : '') : '';
  }).filter(Boolean).join(', ');
  if (mergedName) {
    drawLabel(context, group[0].rect, mergedName, group[0].color);
  }
}
function draw(nodeToData, agent) {
  return isReactNativeEnvironment() ? drawNative(nodeToData, agent) : drawWeb(nodeToData);
}
function iterateNodes(nodeToData, execute) {
  nodeToData.forEach(function (data, node) {
    var colorIndex = Math.min(COLORS.length - 1, data.count - 1);
    var color = COLORS[colorIndex];
    execute({
      color: color,
      node: node,
      count: data.count,
      displayName: data.displayName,
      expirationTime: data.expirationTime,
      lastMeasuredAt: data.lastMeasuredAt,
      rect: data.rect
    });
  });
}
function drawLabel(context, rect, text, color) {
  var left = rect.left,
    top = rect.top;
  context.font = '10px monospace';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  var padding = 2;
  var textHeight = 14;
  var metrics = context.measureText(text);
  var backgroundWidth = metrics.width + padding * 2;
  var backgroundHeight = textHeight;
  var labelX = left;
  var labelY = top - backgroundHeight;
  context.fillStyle = color;
  context.fillRect(labelX, labelY, backgroundWidth, backgroundHeight);
  context.fillStyle = '#000000';
  context.fillText(text, labelX + backgroundWidth / 2, labelY + backgroundHeight / 2);
}
function destroyNative(agent) {
  agent.emit('disableTraceUpdates');
}
function destroyWeb() {
  if (canvas !== null) {
    if (canvas.matches(':popover-open')) {
      // $FlowFixMe[prop-missing]: Flow doesn't recognize Popover API
      // $FlowFixMe[incompatible-use]: Flow doesn't recognize Popover API
      canvas.hidePopover();
    } // $FlowFixMe[incompatible-use]: Flow doesn't recognize Popover API and loses canvas nullability tracking

    if (canvas.parentNode != null) {
      // $FlowFixMe[incompatible-call]: Flow doesn't track that canvas is non-null here
      canvas.parentNode.removeChild(canvas);
    }
    canvas = null;
  }
}
function destroy(agent) {
  return isReactNativeEnvironment() ? destroyNative(agent) : destroyWeb();
}
function initialize() {
  canvas = window.document.createElement('canvas');
  canvas.setAttribute('popover', 'manual'); // $FlowFixMe[incompatible-use]: Flow doesn't recognize Popover API

  canvas.style.cssText = "\n    xx-background-color: red;\n    xx-opacity: 0.5;\n    bottom: 0;\n    left: 0;\n    pointer-events: none;\n    position: fixed;\n    right: 0;\n    top: 0;\n    background-color: transparent;\n    outline: none;\n    box-shadow: none;\n    border: none;\n  ";
  var root = window.document.documentElement;
  root.insertBefore(canvas, root.firstChild);
}