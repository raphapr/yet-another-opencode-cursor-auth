function hydration_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function hydration_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      hydration_ownKeys(Object(source), true).forEach(function (key) {
        hydration_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      hydration_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function hydration_defineProperty(obj, key, value) {
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
function hydration_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    hydration_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    hydration_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return hydration_typeof(obj);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var meta = {
  inspectable: Symbol('inspectable'),
  inspected: Symbol('inspected'),
  name: Symbol('name'),
  preview_long: Symbol('preview_long'),
  preview_short: Symbol('preview_short'),
  readonly: Symbol('readonly'),
  size: Symbol('size'),
  type: Symbol('type'),
  unserializable: Symbol('unserializable')
}; // Typed arrays, other complex iteratable objects (e.g. Map, Set, ImmutableJS) or Promises need special handling.
// These objects can't be serialized without losing type information,
// so a "Unserializable" type wrapper is used (with meta-data keys) to send nested values-
// while preserving the original type and name.

// This threshold determines the depth at which the bridge "dehydrates" nested data.
// Dehydration means that we don't serialize the data for e.g. postMessage or stringify,
// unless the frontend explicitly requests it (e.g. a user clicks to expand a props object).
//
// Reducing this threshold will improve the speed of initial component inspection,
// but may decrease the responsiveness of expanding objects/arrays to inspect further.
var LEVEL_THRESHOLD = 2;
/**
 * Generate the dehydrated metadata for complex object instances
 */

function createDehydrated(type, inspectable, data, cleaned, path) {
  cleaned.push(path);
  var dehydrated = {
    inspectable: inspectable,
    type: type,
    preview_long: formatDataForPreview(data, true),
    preview_short: formatDataForPreview(data, false),
    name: typeof data.constructor !== 'function' || typeof data.constructor.name !== 'string' || data.constructor.name === 'Object' ? '' : data.constructor.name
  };
  if (type === 'array' || type === 'typed_array') {
    dehydrated.size = data.length;
  } else if (type === 'object') {
    dehydrated.size = Object.keys(data).length;
  }
  if (type === 'iterator' || type === 'typed_array') {
    dehydrated.readonly = true;
  }
  return dehydrated;
}
/**
 * Strip out complex data (instances, functions, and data nested > LEVEL_THRESHOLD levels deep).
 * The paths of the stripped out objects are appended to the `cleaned` list.
 * On the other side of the barrier, the cleaned list is used to "re-hydrate" the cleaned representation into
 * an object with symbols as attributes, so that a sanitized object can be distinguished from a normal object.
 *
 * Input: {"some": {"attr": fn()}, "other": AnInstance}
 * Output: {
 *   "some": {
 *     "attr": {"name": the fn.name, type: "function"}
 *   },
 *   "other": {
 *     "name": "AnInstance",
 *     "type": "object",
 *   },
 * }
 * and cleaned = [["some", "attr"], ["other"]]
 */

function dehydrate(data, cleaned, unserializable, path, isPathAllowed) {
  var level = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var type = getDataType(data);
  var isPathAllowedCheck;
  switch (type) {
    case 'html_element':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.tagName,
        type: type
      };
    case 'function':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: typeof data.name === 'function' || !data.name ? 'function' : data.name,
        type: type
      };
    case 'string':
      isPathAllowedCheck = isPathAllowed(path);
      if (isPathAllowedCheck) {
        return data;
      } else {
        return data.length <= 500 ? data : data.slice(0, 500) + '...';
      }
    case 'bigint':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type: type
      };
    case 'symbol':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type: type
      };
    // React Elements aren't very inspector-friendly,
    // and often contain private fields or circular references.

    case 'react_element':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: getDisplayNameForReactElement(data) || 'Unknown',
        type: type
      };
    // ArrayBuffers error if you try to inspect them.

    case 'array_buffer':
    case 'data_view':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: type === 'data_view' ? 'DataView' : 'ArrayBuffer',
        size: data.byteLength,
        type: type
      };
    case 'array':
      isPathAllowedCheck = isPathAllowed(path);
      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return createDehydrated(type, true, data, cleaned, path);
      }
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        arr[i] = dehydrateKey(data, i, cleaned, unserializable, path.concat([i]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
      }
      return arr;
    case 'html_all_collection':
    case 'typed_array':
    case 'iterator':
      isPathAllowedCheck = isPathAllowed(path);
      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return createDehydrated(type, true, data, cleaned, path);
      } else {
        var unserializableValue = {
          unserializable: true,
          type: type,
          readonly: true,
          size: type === 'typed_array' ? data.length : undefined,
          preview_short: formatDataForPreview(data, false),
          preview_long: formatDataForPreview(data, true),
          name: typeof data.constructor !== 'function' || typeof data.constructor.name !== 'string' || data.constructor.name === 'Object' ? '' : data.constructor.name
        }; // TRICKY
        // Don't use [...spread] syntax for this purpose.
        // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
        // Other types (e.g. typed arrays, Sets) will not spread correctly.

        Array.from(data).forEach(function (item, i) {
          return unserializableValue[i] = dehydrate(item, cleaned, unserializable, path.concat([i]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        });
        unserializable.push(path);
        return unserializableValue;
      }
    case 'opaque_iterator':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data[Symbol.toStringTag],
        type: type
      };
    case 'date':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type: type
      };
    case 'regexp':
      cleaned.push(path);
      return {
        inspectable: false,
        preview_short: formatDataForPreview(data, false),
        preview_long: formatDataForPreview(data, true),
        name: data.toString(),
        type: type
      };
    case 'thenable':
      isPathAllowedCheck = isPathAllowed(path);
      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return {
          inspectable: data.status === 'fulfilled' || data.status === 'rejected',
          preview_short: formatDataForPreview(data, false),
          preview_long: formatDataForPreview(data, true),
          name: data.toString(),
          type: type
        };
      }
      switch (data.status) {
        case 'fulfilled':
          {
            var _unserializableValue = {
              unserializable: true,
              type: type,
              preview_short: formatDataForPreview(data, false),
              preview_long: formatDataForPreview(data, true),
              name: 'fulfilled Thenable'
            };
            _unserializableValue.value = dehydrate(data.value, cleaned, unserializable, path.concat(['value']), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
            unserializable.push(path);
            return _unserializableValue;
          }
        case 'rejected':
          {
            var _unserializableValue2 = {
              unserializable: true,
              type: type,
              preview_short: formatDataForPreview(data, false),
              preview_long: formatDataForPreview(data, true),
              name: 'rejected Thenable'
            };
            _unserializableValue2.reason = dehydrate(data.reason, cleaned, unserializable, path.concat(['reason']), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
            unserializable.push(path);
            return _unserializableValue2;
          }
        default:
          cleaned.push(path);
          return {
            inspectable: false,
            preview_short: formatDataForPreview(data, false),
            preview_long: formatDataForPreview(data, true),
            name: data.toString(),
            type: type
          };
      }
    case 'object':
      isPathAllowedCheck = isPathAllowed(path);
      if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
        return createDehydrated(type, true, data, cleaned, path);
      } else {
        var object = {};
        getAllEnumerableKeys(data).forEach(function (key) {
          var name = key.toString();
          object[name] = dehydrateKey(data, key, cleaned, unserializable, path.concat([name]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        });
        return object;
      }
    case 'class_instance':
      {
        isPathAllowedCheck = isPathAllowed(path);
        if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
          return createDehydrated(type, true, data, cleaned, path);
        }
        var value = {
          unserializable: true,
          type: type,
          readonly: true,
          preview_short: formatDataForPreview(data, false),
          preview_long: formatDataForPreview(data, true),
          name: typeof data.constructor !== 'function' || typeof data.constructor.name !== 'string' ? '' : data.constructor.name
        };
        getAllEnumerableKeys(data).forEach(function (key) {
          var keyAsString = key.toString();
          value[keyAsString] = dehydrate(data[key], cleaned, unserializable, path.concat([keyAsString]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        });
        unserializable.push(path);
        return value;
      }
    case 'error':
      {
        isPathAllowedCheck = isPathAllowed(path);
        if (level >= LEVEL_THRESHOLD && !isPathAllowedCheck) {
          return createDehydrated(type, true, data, cleaned, path);
        }
        var _value = {
          unserializable: true,
          type: type,
          readonly: true,
          preview_short: formatDataForPreview(data, false),
          preview_long: formatDataForPreview(data, true),
          name: data.name
        }; // name, message, stack and cause are not enumerable yet still interesting.

        _value.message = dehydrate(data.message, cleaned, unserializable, path.concat(['message']), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        _value.stack = dehydrate(data.stack, cleaned, unserializable, path.concat(['stack']), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        if ('cause' in data) {
          _value.cause = dehydrate(data.cause, cleaned, unserializable, path.concat(['cause']), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        }
        getAllEnumerableKeys(data).forEach(function (key) {
          var keyAsString = key.toString();
          _value[keyAsString] = dehydrate(data[key], cleaned, unserializable, path.concat([keyAsString]), isPathAllowed, isPathAllowedCheck ? 1 : level + 1);
        });
        unserializable.push(path);
        return _value;
      }
    case 'infinity':
    case 'nan':
    case 'undefined':
      // Some values are lossy when sent through a WebSocket.
      // We dehydrate+rehydrate them to preserve their type.
      cleaned.push(path);
      return {
        type: type
      };
    default:
      return data;
  }
}
function dehydrateKey(parent, key, cleaned, unserializable, path, isPathAllowed) {
  var level = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  try {
    return dehydrate(parent[key], cleaned, unserializable, path, isPathAllowed, level);
  } catch (error) {
    var preview = '';
    if (hydration_typeof(error) === 'object' && error !== null && typeof error.stack === 'string') {
      preview = error.stack;
    } else if (typeof error === 'string') {
      preview = error;
    }
    cleaned.push(path);
    return {
      inspectable: false,
      preview_short: '[Exception]',
      preview_long: preview ? '[Exception: ' + preview + ']' : '[Exception]',
      name: preview,
      type: 'unknown'
    };
  }
}
function fillInPath(object, data, path, value) {
  var target = getInObject(object, path);
  if (target != null) {
    if (!target[meta.unserializable]) {
      delete target[meta.inspectable];
      delete target[meta.inspected];
      delete target[meta.name];
      delete target[meta.preview_long];
      delete target[meta.preview_short];
      delete target[meta.readonly];
      delete target[meta.size];
      delete target[meta.type];
    }
  }
  if (value !== null && data.unserializable.length > 0) {
    var unserializablePath = data.unserializable[0];
    var isMatch = unserializablePath.length === path.length;
    for (var i = 0; i < path.length; i++) {
      if (path[i] !== unserializablePath[i]) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      upgradeUnserializable(value, value);
    }
  }
  setInObject(object, path, value);
}
function hydrate(object, cleaned, unserializable) {
  cleaned.forEach(function (path) {
    var length = path.length;
    var last = path[length - 1];
    var parent = getInObject(object, path.slice(0, length - 1));
    if (!parent || !parent.hasOwnProperty(last)) {
      return;
    }
    var value = parent[last];
    if (!value) {
      return;
    } else if (value.type === 'infinity') {
      parent[last] = Infinity;
    } else if (value.type === 'nan') {
      parent[last] = NaN;
    } else if (value.type === 'undefined') {
      parent[last] = undefined;
    } else {
      // Replace the string keys with Symbols so they're non-enumerable.
      var replaced = {};
      replaced[meta.inspectable] = !!value.inspectable;
      replaced[meta.inspected] = false;
      replaced[meta.name] = value.name;
      replaced[meta.preview_long] = value.preview_long;
      replaced[meta.preview_short] = value.preview_short;
      replaced[meta.size] = value.size;
      replaced[meta.readonly] = !!value.readonly;
      replaced[meta.type] = value.type;
      parent[last] = replaced;
    }
  });
  unserializable.forEach(function (path) {
    var length = path.length;
    var last = path[length - 1];
    var parent = getInObject(object, path.slice(0, length - 1));
    if (!parent || !parent.hasOwnProperty(last)) {
      return;
    }
    var node = parent[last];
    var replacement = hydration_objectSpread({}, node);
    upgradeUnserializable(replacement, node);
    parent[last] = replacement;
  });
  return object;
}
function upgradeUnserializable(destination, source) {
  var _Object$definePropert;
  Object.defineProperties(destination, (_Object$definePropert = {}, hydration_defineProperty(_Object$definePropert, meta.inspected, {
    configurable: true,
    enumerable: false,
    value: !!source.inspected
  }), hydration_defineProperty(_Object$definePropert, meta.name, {
    configurable: true,
    enumerable: false,
    value: source.name
  }), hydration_defineProperty(_Object$definePropert, meta.preview_long, {
    configurable: true,
    enumerable: false,
    value: source.preview_long
  }), hydration_defineProperty(_Object$definePropert, meta.preview_short, {
    configurable: true,
    enumerable: false,
    value: source.preview_short
  }), hydration_defineProperty(_Object$definePropert, meta.size, {
    configurable: true,
    enumerable: false,
    value: source.size
  }), hydration_defineProperty(_Object$definePropert, meta.readonly, {
    configurable: true,
    enumerable: false,
    value: !!source.readonly
  }), hydration_defineProperty(_Object$definePropert, meta.type, {
    configurable: true,
    enumerable: false,
    value: source.type
  }), hydration_defineProperty(_Object$definePropert, meta.unserializable, {
    configurable: true,
    enumerable: false,
    value: !!source.unserializable
  }), _Object$definePropert));
  delete destination.inspected;
  delete destination.name;
  delete destination.preview_long;
  delete destination.preview_short;
  delete destination.size;
  delete destination.readonly;
  delete destination.type;
  delete destination.unserializable;
}