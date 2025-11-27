function setupNativeStyleEditor_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    setupNativeStyleEditor_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    setupNativeStyleEditor_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return setupNativeStyleEditor_typeof(obj);
}
function setupNativeStyleEditor_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function setupNativeStyleEditor(bridge, agent, resolveNativeStyle, validAttributes) {
  bridge.addListener('NativeStyleEditor_measure', function (_ref) {
    var id = _ref.id,
      rendererID = _ref.rendererID;
    measureStyle(agent, bridge, resolveNativeStyle, id, rendererID);
  });
  bridge.addListener('NativeStyleEditor_renameAttribute', function (_ref2) {
    var id = _ref2.id,
      rendererID = _ref2.rendererID,
      oldName = _ref2.oldName,
      newName = _ref2.newName,
      value = _ref2.value;
    renameStyle(agent, id, rendererID, oldName, newName, value);
    setTimeout(function () {
      return measureStyle(agent, bridge, resolveNativeStyle, id, rendererID);
    });
  });
  bridge.addListener('NativeStyleEditor_setValue', function (_ref3) {
    var id = _ref3.id,
      rendererID = _ref3.rendererID,
      name = _ref3.name,
      value = _ref3.value;
    setStyle(agent, id, rendererID, name, value);
    setTimeout(function () {
      return measureStyle(agent, bridge, resolveNativeStyle, id, rendererID);
    });
  });
  bridge.send('isNativeStyleEditorSupported', {
    isSupported: true,
    validAttributes: validAttributes
  });
}
var EMPTY_BOX_STYLE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};
var componentIDToStyleOverrides = new Map();
function measureStyle(agent, bridge, resolveNativeStyle, id, rendererID) {
  var data = agent.getInstanceAndStyle({
    id: id,
    rendererID: rendererID
  });
  if (!data || !data.style) {
    bridge.send('NativeStyleEditor_styleAndLayout', {
      id: id,
      layout: null,
      style: null
    });
    return;
  }
  var instance = data.instance,
    style = data.style;
  var resolvedStyle = resolveNativeStyle(style); // If it's a host component we edited before, amend styles.

  var styleOverrides = componentIDToStyleOverrides.get(id);
  if (styleOverrides != null) {
    resolvedStyle = Object.assign({}, resolvedStyle, styleOverrides);
  }
  if (!instance || typeof instance.measure !== 'function') {
    bridge.send('NativeStyleEditor_styleAndLayout', {
      id: id,
      layout: null,
      style: resolvedStyle || null
    });
    return;
  }
  instance.measure(function (x, y, width, height, left, top) {
    // RN Android sometimes returns undefined here. Don't send measurements in this case.
    // https://github.com/jhen0409/react-native-debugger/issues/84#issuecomment-304611817
    if (typeof x !== 'number') {
      bridge.send('NativeStyleEditor_styleAndLayout', {
        id: id,
        layout: null,
        style: resolvedStyle || null
      });
      return;
    }
    var margin = resolvedStyle != null && resolveBoxStyle('margin', resolvedStyle) || EMPTY_BOX_STYLE;
    var padding = resolvedStyle != null && resolveBoxStyle('padding', resolvedStyle) || EMPTY_BOX_STYLE;
    bridge.send('NativeStyleEditor_styleAndLayout', {
      id: id,
      layout: {
        x: x,
        y: y,
        width: width,
        height: height,
        left: left,
        top: top,
        margin: margin,
        padding: padding
      },
      style: resolvedStyle || null
    });
  });
}
function shallowClone(object) {
  var cloned = {};
  for (var n in object) {
    cloned[n] = object[n];
  }
  return cloned;
}
function renameStyle(agent, id, rendererID, oldName, newName, value) {
  var _ref4;
  var data = agent.getInstanceAndStyle({
    id: id,
    rendererID: rendererID
  });
  if (!data || !data.style) {
    return;
  }
  var instance = data.instance,
    style = data.style;
  var newStyle = newName ? (_ref4 = {}, setupNativeStyleEditor_defineProperty(_ref4, oldName, undefined), setupNativeStyleEditor_defineProperty(_ref4, newName, value), _ref4) : setupNativeStyleEditor_defineProperty({}, oldName, undefined);
  var customStyle; // TODO It would be nice if the renderer interface abstracted this away somehow.

  if (instance !== null && typeof instance.setNativeProps === 'function') {
    // In the case of a host component, we need to use setNativeProps().
    // Remember to "correct" resolved styles when we read them next time.
    var styleOverrides = componentIDToStyleOverrides.get(id);
    if (!styleOverrides) {
      componentIDToStyleOverrides.set(id, newStyle);
    } else {
      Object.assign(styleOverrides, newStyle);
    } // TODO Fabric does not support setNativeProps; chat with Sebastian or Eli

    instance.setNativeProps({
      style: newStyle
    });
  } else if (src_isArray(style)) {
    var lastIndex = style.length - 1;
    if (setupNativeStyleEditor_typeof(style[lastIndex]) === 'object' && !src_isArray(style[lastIndex])) {
      customStyle = shallowClone(style[lastIndex]);
      delete customStyle[oldName];
      if (newName) {
        customStyle[newName] = value;
      } else {
        customStyle[oldName] = undefined;
      }
      agent.overrideValueAtPath({
        type: 'props',
        id: id,
        rendererID: rendererID,
        path: ['style', lastIndex],
        value: customStyle
      });
    } else {
      agent.overrideValueAtPath({
        type: 'props',
        id: id,
        rendererID: rendererID,
        path: ['style'],
        value: style.concat([newStyle])
      });
    }
  } else if (setupNativeStyleEditor_typeof(style) === 'object') {
    customStyle = shallowClone(style);
    delete customStyle[oldName];
    if (newName) {
      customStyle[newName] = value;
    } else {
      customStyle[oldName] = undefined;
    }
    agent.overrideValueAtPath({
      type: 'props',
      id: id,
      rendererID: rendererID,
      path: ['style'],
      value: customStyle
    });
  } else {
    agent.overrideValueAtPath({
      type: 'props',
      id: id,
      rendererID: rendererID,
      path: ['style'],
      value: [style, newStyle]
    });
  }
  agent.emit('hideNativeHighlight');
}
function setStyle(agent, id, rendererID, name, value) {
  var data = agent.getInstanceAndStyle({
    id: id,
    rendererID: rendererID
  });
  if (!data || !data.style) {
    return;
  }
  var instance = data.instance,
    style = data.style;
  var newStyle = setupNativeStyleEditor_defineProperty({}, name, value); // TODO It would be nice if the renderer interface abstracted this away somehow.

  if (instance !== null && typeof instance.setNativeProps === 'function') {
    // In the case of a host component, we need to use setNativeProps().
    // Remember to "correct" resolved styles when we read them next time.
    var styleOverrides = componentIDToStyleOverrides.get(id);
    if (!styleOverrides) {
      componentIDToStyleOverrides.set(id, newStyle);
    } else {
      Object.assign(styleOverrides, newStyle);
    } // TODO Fabric does not support setNativeProps; chat with Sebastian or Eli

    instance.setNativeProps({
      style: newStyle
    });
  } else if (src_isArray(style)) {
    var lastLength = style.length - 1;
    if (setupNativeStyleEditor_typeof(style[lastLength]) === 'object' && !src_isArray(style[lastLength])) {
      agent.overrideValueAtPath({
        type: 'props',
        id: id,
        rendererID: rendererID,
        path: ['style', lastLength, name],
        value: value
      });
    } else {
      agent.overrideValueAtPath({
        type: 'props',
        id: id,
        rendererID: rendererID,
        path: ['style'],
        value: style.concat([newStyle])
      });
    }
  } else {
    agent.overrideValueAtPath({
      type: 'props',
      id: id,
      rendererID: rendererID,
      path: ['style'],
      value: [style, newStyle]
    });
  }
  agent.emit('hideNativeHighlight');
}