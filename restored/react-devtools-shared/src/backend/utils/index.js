function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = backend_utils_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e2) {
          throw _e2;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e3) {
      didErr = true;
      err = _e3;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function utils_slicedToArray(arr, i) {
  return utils_arrayWithHoles(arr) || utils_iterableToArrayLimit(arr, i) || backend_utils_unsupportedIterableToArray(arr, i) || utils_nonIterableRest();
}
function utils_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function backend_utils_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return backend_utils_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return backend_utils_arrayLikeToArray(o, minLen);
}
function backend_utils_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function utils_iterableToArrayLimit(arr, i) {
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
function utils_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function backend_utils_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    backend_utils_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    backend_utils_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return backend_utils_typeof(obj);
}
function utils_ownKeys(object, enumerableOnly) {
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
function utils_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      utils_ownKeys(Object(source), true).forEach(function (key) {
        backend_utils_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      utils_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function backend_utils_defineProperty(obj, key, value) {
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
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

// TODO: update this to the first React version that has a corresponding DevTools backend

var FIRST_DEVTOOLS_BACKEND_LOCKSTEP_VER = '999.9.9';
function hasAssignedBackend(version) {
  if (version == null || version === '') {
    return false;
  }
  return gte(version, FIRST_DEVTOOLS_BACKEND_LOCKSTEP_VER);
}
function cleanForBridge(data, isPathAllowed) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (data !== null) {
    var cleanedPaths = [];
    var unserializablePaths = [];
    var cleanedData = dehydrate(data, cleanedPaths, unserializablePaths, path, isPathAllowed);
    return {
      data: cleanedData,
      cleaned: cleanedPaths,
      unserializable: unserializablePaths
    };
  } else {
    return null;
  }
}
function copyWithDelete(obj, path) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var key = path[index];
  var updated = shared_isArray(obj) ? obj.slice() : utils_objectSpread({}, obj);
  if (index + 1 === path.length) {
    if (shared_isArray(updated)) {
      updated.splice(key, 1);
    } else {
      delete updated[key];
    }
  } else {
    // $FlowFixMe[incompatible-use] number or string is fine here
    updated[key] = copyWithDelete(obj[key], path, index + 1);
  }
  return updated;
} // This function expects paths to be the same except for the final value.
// e.g. ['path', 'to', 'foo'] and ['path', 'to', 'bar']

function copyWithRename(obj, oldPath, newPath) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var oldKey = oldPath[index];
  var updated = shared_isArray(obj) ? obj.slice() : utils_objectSpread({}, obj);
  if (index + 1 === oldPath.length) {
    var newKey = newPath[index]; // $FlowFixMe[incompatible-use] number or string is fine here

    updated[newKey] = updated[oldKey];
    if (shared_isArray(updated)) {
      updated.splice(oldKey, 1);
    } else {
      delete updated[oldKey];
    }
  } else {
    // $FlowFixMe[incompatible-use] number or string is fine here
    updated[oldKey] = copyWithRename(obj[oldKey], oldPath, newPath, index + 1);
  }
  return updated;
}
function copyWithSet(obj, path, value) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (index >= path.length) {
    return value;
  }
  var key = path[index];
  var updated = shared_isArray(obj) ? obj.slice() : utils_objectSpread({}, obj); // $FlowFixMe[incompatible-use] number or string is fine here

  updated[key] = copyWithSet(obj[key], path, value, index + 1);
  return updated;
}
function getEffectDurations(root) {
  // Profiling durations are only available for certain builds.
  // If available, they'll be stored on the HostRoot.
  var effectDuration = null;
  var passiveEffectDuration = null;
  var hostRoot = root.current;
  if (hostRoot != null) {
    var stateNode = hostRoot.stateNode;
    if (stateNode != null) {
      effectDuration = stateNode.effectDuration != null ? stateNode.effectDuration : null;
      passiveEffectDuration = stateNode.passiveEffectDuration != null ? stateNode.passiveEffectDuration : null;
    }
  }
  return {
    effectDuration: effectDuration,
    passiveEffectDuration: passiveEffectDuration
  };
}
function serializeToString(data) {
  if (data === undefined) {
    return 'undefined';
  }
  if (typeof data === 'function') {
    return data.toString();
  }
  var cache = new Set(); // Use a custom replacer function to protect against circular references.

  return JSON.stringify(data, function (key, value) {
    if (backend_utils_typeof(value) === 'object' && value !== null) {
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    return value;
  }, 2);
}
function safeToString(val) {
  try {
    return String(val);
  } catch (err) {
    if (backend_utils_typeof(val) === 'object') {
      // An object with no prototype and no `[Symbol.toPrimitive]()`, `toString()`, and `valueOf()` methods would throw.
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion
      return '[object Object]';
    }
    throw err;
  }
} // based on https://github.com/tmpfs/format-util/blob/0e62d430efb0a1c51448709abd3e2406c14d8401/format.js#L1
// based on https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions
// Implements s, d, i and f placeholders

function formatConsoleArgumentsToSingleString(maybeMessage) {
  for (var _len = arguments.length, inputArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    inputArgs[_key - 1] = arguments[_key];
  }
  var args = inputArgs.slice();
  var formatted = safeToString(maybeMessage); // If the first argument is a string, check for substitutions.

  if (typeof maybeMessage === 'string') {
    if (args.length) {
      var REGEXP = /(%?)(%([jds]))/g; // $FlowFixMe[incompatible-call]

      formatted = formatted.replace(REGEXP, function (match, escaped, ptn, flag) {
        var arg = args.shift();
        switch (flag) {
          case 's':
            // $FlowFixMe[unsafe-addition]
            arg += '';
            break;
          case 'd':
          case 'i':
            arg = parseInt(arg, 10).toString();
            break;
          case 'f':
            arg = parseFloat(arg).toString();
            break;
        }
        if (!escaped) {
          return arg;
        }
        args.unshift(arg);
        return match;
      });
    }
  } // Arguments that remain after formatting.

  if (args.length) {
    for (var i = 0; i < args.length; i++) {
      formatted += ' ' + safeToString(args[i]);
    }
  } // Update escaped %% values.

  formatted = formatted.replace(/%{2,2}/g, '%');
  return String(formatted);
}
function isSynchronousXHRSupported() {
  return !!(window.document && window.document.featurePolicy && window.document.featurePolicy.allowsFeature('sync-xhr'));
}
function gt() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return compareVersions(a, b) === 1;
}
function gte() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return compareVersions(a, b) > -1;
}
var isReactNativeEnvironment = function isReactNativeEnvironment() {
  // We've been relying on this for such a long time
  // We should probably define the client for DevTools on the backend side and share it with the frontend
  return window.document == null;
};
function extractLocation(url) {
  if (url.indexOf(':') === -1) {
    return null;
  } // remove any parentheses from start and end

  var withoutParentheses = url.replace(/^\(+/, '').replace(/\)+$/, '');
  var locationParts = /(at )?(.+?)(?::(\d+))?(?::(\d+))?$/.exec(withoutParentheses);
  if (locationParts == null) {
    return null;
  }
  var _locationParts = utils_slicedToArray(locationParts, 5),
    sourceURL = _locationParts[2],
    line = _locationParts[3],
    column = _locationParts[4];
  return {
    sourceURL: sourceURL,
    line: line,
    column: column
  };
}
var CHROME_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
function parseSourceFromChromeStack(stack) {
  var frames = stack.split('\n'); // eslint-disable-next-line no-for-of-loops/no-for-of-loops

  var _iterator = _createForOfIteratorHelper(frames),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var frame = _step.value;
      var sanitizedFrame = frame.trim();
      var locationInParenthesesMatch = sanitizedFrame.match(/ (\(.+\)$)/);
      var possibleLocation = locationInParenthesesMatch ? locationInParenthesesMatch[1] : sanitizedFrame;
      var location = extractLocation(possibleLocation); // Continue the search until at least sourceURL is found

      if (location == null) {
        continue;
      }
      var sourceURL = location.sourceURL,
        _location$line = location.line,
        line = _location$line === void 0 ? '1' : _location$line,
        _location$column = location.column,
        column = _location$column === void 0 ? '1' : _location$column;
      return {
        sourceURL: sourceURL,
        line: parseInt(line, 10),
        column: parseInt(column, 10)
      };
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return null;
}
function parseSourceFromFirefoxStack(stack) {
  var frames = stack.split('\n'); // eslint-disable-next-line no-for-of-loops/no-for-of-loops

  var _iterator2 = _createForOfIteratorHelper(frames),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var frame = _step2.value;
      var sanitizedFrame = frame.trim();
      var frameWithoutFunctionName = sanitizedFrame.replace(/((.*".+"[^@]*)?[^@]*)(?:@)/, '');
      var location = extractLocation(frameWithoutFunctionName); // Continue the search until at least sourceURL is found

      if (location == null) {
        continue;
      }
      var sourceURL = location.sourceURL,
        _location$line2 = location.line,
        line = _location$line2 === void 0 ? '1' : _location$line2,
        _location$column2 = location.column,
        column = _location$column2 === void 0 ? '1' : _location$column2;
      return {
        sourceURL: sourceURL,
        line: parseInt(line, 10),
        column: parseInt(column, 10)
      };
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return null;
}
function parseSourceFromComponentStack(componentStack) {
  if (componentStack.match(CHROME_STACK_REGEXP)) {
    return parseSourceFromChromeStack(componentStack);
  }
  return parseSourceFromFirefoxStack(componentStack);
}
var collectedLocation = null;
function collectStackTrace(error, structuredStackTrace) {
  var result = null; // Collect structured stack traces from the callsites.
  // We mirror how V8 serializes stack frames and how we later parse them.

  for (var i = 0; i < structuredStackTrace.length; i++) {
    var callSite = structuredStackTrace[i];
    var _name = callSite.getFunctionName();
    if (_name != null && (_name.includes('react_stack_bottom_frame') || _name.includes('react-stack-bottom-frame'))) {
      // We pick the last frame that matches before the bottom frame since
      // that will be immediately inside the component as opposed to some helper.
      // If we don't find a bottom frame then we bail to string parsing.
      collectedLocation = result; // Skip everything after the bottom frame since it'll be internals.

      break;
    } else {
      var sourceURL = callSite.getScriptNameOrSourceURL();
      var line =
      // $FlowFixMe[prop-missing]
      typeof callSite.getEnclosingLineNumber === 'function' ? callSite.getEnclosingLineNumber() : callSite.getLineNumber();
      var col =
      // $FlowFixMe[prop-missing]
      typeof callSite.getEnclosingColumnNumber === 'function' ? callSite.getEnclosingColumnNumber() : callSite.getColumnNumber();
      if (!sourceURL || !line || !col) {
        // Skip eval etc. without source url. They don't have location.
        continue;
      }
      result = {
        sourceURL: sourceURL,
        line: line,
        column: col
      };
    }
  } // At the same time we generate a string stack trace just in case someone
  // else reads it.

  var name = error.name || 'Error';
  var message = error.message || '';
  var stack = name + ': ' + message;
  for (var _i2 = 0; _i2 < structuredStackTrace.length; _i2++) {
    stack += '\n    at ' + structuredStackTrace[_i2].toString();
  }
  return stack;
}
function parseSourceFromOwnerStack(error) {
  // First attempt to collected the structured data using prepareStackTrace.
  collectedLocation = null;
  var previousPrepare = Error.prepareStackTrace;
  Error.prepareStackTrace = collectStackTrace;
  var stack;
  try {
    stack = error.stack;
  } catch (e) {
    // $FlowFixMe[incompatible-type] It does accept undefined.
    Error.prepareStackTrace = undefined;
    stack = error.stack;
  } finally {
    Error.prepareStackTrace = previousPrepare;
  }
  if (collectedLocation !== null) {
    return collectedLocation;
  }
  if (stack == null) {
    return null;
  } // Fallback to parsing the string form.

  var componentStack = formatOwnerStackString(stack);
  return parseSourceFromComponentStack(componentStack);
} // 0.123456789 => 0.123
// Expects high-resolution timestamp in milliseconds, like from performance.now()
// Mainly used for optimizing the size of serialized profiling payload

function formatDurationToMicrosecondsGranularity(duration) {
  return Math.round(duration * 1000) / 1000;
}