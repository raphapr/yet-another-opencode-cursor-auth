function views_utils_slicedToArray(arr, i) {
  return views_utils_arrayWithHoles(arr) || views_utils_iterableToArrayLimit(arr, i) || views_utils_unsupportedIterableToArray(arr, i) || views_utils_nonIterableRest();
}
function views_utils_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function views_utils_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return views_utils_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return views_utils_arrayLikeToArray(o, minLen);
}
function views_utils_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function views_utils_iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function views_utils_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// Get the window object for the document that a node belongs to,
// or return null if it cannot be found (node not attached to DOM,
// etc).
function getOwnerWindow(node) {
  if (!node.ownerDocument) {
    return null;
  }
  return node.ownerDocument.defaultView;
} // Get the iframe containing a node, or return null if it cannot
// be found (node not within iframe, etc).

function getOwnerIframe(node) {
  var nodeWindow = getOwnerWindow(node);
  if (nodeWindow) {
    return nodeWindow.frameElement;
  }
  return null;
} // Get a bounding client rect for a node, with an
// offset added to compensate for its border.

function getBoundingClientRectWithBorderOffset(node) {
  var dimensions = getElementDimensions(node);
  return mergeRectOffsets([node.getBoundingClientRect(), {
    top: dimensions.borderTop,
    left: dimensions.borderLeft,
    bottom: dimensions.borderBottom,
    right: dimensions.borderRight,
    // This width and height won't get used by mergeRectOffsets (since this
    // is not the first rect in the array), but we set them so that this
    // object type checks as a ClientRect.
    width: 0,
    height: 0
  }]);
} // Add together the top, left, bottom, and right properties of
// each ClientRect, but keep the width and height of the first one.

function mergeRectOffsets(rects) {
  return rects.reduce(function (previousRect, rect) {
    if (previousRect == null) {
      return rect;
    }
    return {
      top: previousRect.top + rect.top,
      left: previousRect.left + rect.left,
      width: previousRect.width,
      height: previousRect.height,
      bottom: previousRect.bottom + rect.bottom,
      right: previousRect.right + rect.right
    };
  });
} // Calculate a boundingClientRect for a node relative to boundaryWindow,
// taking into account any offsets caused by intermediate iframes.

function getNestedBoundingClientRect(node, boundaryWindow) {
  var ownerIframe = getOwnerIframe(node);
  if (ownerIframe && ownerIframe !== boundaryWindow) {
    var rects = [node.getBoundingClientRect()];
    var currentIframe = ownerIframe;
    var onlyOneMore = false;
    while (currentIframe) {
      var rect = getBoundingClientRectWithBorderOffset(currentIframe);
      rects.push(rect);
      currentIframe = getOwnerIframe(currentIframe);
      if (onlyOneMore) {
        break;
      } // We don't want to calculate iframe offsets upwards beyond
      // the iframe containing the boundaryWindow, but we
      // need to calculate the offset relative to the boundaryWindow.

      if (currentIframe && getOwnerWindow(currentIframe) === boundaryWindow) {
        onlyOneMore = true;
      }
    }
    return mergeRectOffsets(rects);
  } else {
    return node.getBoundingClientRect();
  }
}
function getElementDimensions(domElement) {
  var calculatedStyle = window.getComputedStyle(domElement);
  return {
    borderLeft: parseInt(calculatedStyle.borderLeftWidth, 10),
    borderRight: parseInt(calculatedStyle.borderRightWidth, 10),
    borderTop: parseInt(calculatedStyle.borderTopWidth, 10),
    borderBottom: parseInt(calculatedStyle.borderBottomWidth, 10),
    marginLeft: parseInt(calculatedStyle.marginLeft, 10),
    marginRight: parseInt(calculatedStyle.marginRight, 10),
    marginTop: parseInt(calculatedStyle.marginTop, 10),
    marginBottom: parseInt(calculatedStyle.marginBottom, 10),
    paddingLeft: parseInt(calculatedStyle.paddingLeft, 10),
    paddingRight: parseInt(calculatedStyle.paddingRight, 10),
    paddingTop: parseInt(calculatedStyle.paddingTop, 10),
    paddingBottom: parseInt(calculatedStyle.paddingBottom, 10)
  };
}
function extractHOCNames(displayName) {
  if (!displayName) return {
    baseComponentName: '',
    hocNames: []
  };
  var hocRegex = /([A-Z][a-zA-Z0-9]*?)\((.*)\)/g;
  var hocNames = [];
  var baseComponentName = displayName;
  var match;
  while ((match = hocRegex.exec(baseComponentName)) != null) {
    if (Array.isArray(match)) {
      var _match = match,
        _match2 = views_utils_slicedToArray(_match, 3),
        hocName = _match2[1],
        inner = _match2[2];
      hocNames.push(hocName);
      baseComponentName = inner;
    }
  }
  return {
    baseComponentName: baseComponentName,
    hocNames: hocNames
  };
}