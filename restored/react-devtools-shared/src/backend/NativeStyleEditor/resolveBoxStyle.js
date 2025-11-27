/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

/**
 * This mirrors react-native/Libraries/Inspector/resolveBoxStyle.js (but without RTL support).
 *
 * Resolve a style property into it's component parts, e.g.
 *
 * resolveBoxStyle('margin', {margin: 5, marginBottom: 10})
 * -> {top: 5, left: 5, right: 5, bottom: 10}
 */
function resolveBoxStyle(prefix, style) {
  var hasParts = false;
  var result = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  };
  var styleForAll = style[prefix];
  if (styleForAll != null) {
    // eslint-disable-next-line no-for-of-loops/no-for-of-loops
    for (var _i = 0, _Object$keys = Object.keys(result); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      result[key] = styleForAll;
    }
    hasParts = true;
  }
  var styleForHorizontal = style[prefix + 'Horizontal'];
  if (styleForHorizontal != null) {
    result.left = styleForHorizontal;
    result.right = styleForHorizontal;
    hasParts = true;
  } else {
    var styleForLeft = style[prefix + 'Left'];
    if (styleForLeft != null) {
      result.left = styleForLeft;
      hasParts = true;
    }
    var styleForRight = style[prefix + 'Right'];
    if (styleForRight != null) {
      result.right = styleForRight;
      hasParts = true;
    }
    var styleForEnd = style[prefix + 'End'];
    if (styleForEnd != null) {
      // TODO RTL support
      result.right = styleForEnd;
      hasParts = true;
    }
    var styleForStart = style[prefix + 'Start'];
    if (styleForStart != null) {
      // TODO RTL support
      result.left = styleForStart;
      hasParts = true;
    }
  }
  var styleForVertical = style[prefix + 'Vertical'];
  if (styleForVertical != null) {
    result.bottom = styleForVertical;
    result.top = styleForVertical;
    hasParts = true;
  } else {
    var styleForBottom = style[prefix + 'Bottom'];
    if (styleForBottom != null) {
      result.bottom = styleForBottom;
      hasParts = true;
    }
    var styleForTop = style[prefix + 'Top'];
    if (styleForTop != null) {
      result.top = styleForTop;
      hasParts = true;
    }
  }
  return hasParts ? result : null;
}