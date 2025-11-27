/* provided dependency */var process = __nested_webpack_require_84681__(169);
function ownKeys(object, enumerableOnly) {
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
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        utils_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function utils_defineProperty(obj, key, value) {
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
function utils_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    utils_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    utils_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return utils_typeof(obj);
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || utils_unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function utils_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return utils_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return utils_arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return utils_arrayLikeToArray(arr);
}
function utils_arrayLikeToArray(arr, len) {
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

// $FlowFixMe[method-unbinding]

var utils_hasOwnProperty = Object.prototype.hasOwnProperty;
var cachedDisplayNames = new WeakMap(); // On large trees, encoding takes significant time.
// Try to reuse the already encoded strings.

var encodedStringCache = new (lru_cache_default())({
  max: 1000
}); // Previously, the type of `Context.Provider`.

var LEGACY_REACT_PROVIDER_TYPE = Symbol.for('react.provider');
function alphaSortKeys(a, b) {
  if (a.toString() > b.toString()) {
    return 1;
  } else if (b.toString() > a.toString()) {
    return -1;
  } else {
    return 0;
  }
}
function getAllEnumerableKeys(obj) {
  var keys = new Set();
  var current = obj;
  var _loop = function _loop() {
    var currentKeys = [].concat(_toConsumableArray(Object.keys(current)), _toConsumableArray(Object.getOwnPropertySymbols(current)));
    var descriptors = Object.getOwnPropertyDescriptors(current);
    currentKeys.forEach(function (key) {
      // $FlowFixMe[incompatible-type]: key can be a Symbol https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
      if (descriptors[key].enumerable) {
        keys.add(key);
      }
    });
    current = Object.getPrototypeOf(current);
  };
  while (current != null) {
    _loop();
  }
  return keys;
} // Mirror https://github.com/facebook/react/blob/7c21bf72ace77094fd1910cc350a548287ef8350/packages/shared/getComponentName.js#L27-L37

function getWrappedDisplayName(outerType, innerType, wrapperName, fallbackName) {
  var displayName = outerType === null || outerType === void 0 ? void 0 : outerType.displayName;
  return displayName || "".concat(wrapperName, "(").concat(getDisplayName(innerType, fallbackName), ")");
}
function getDisplayName(type) {
  var fallbackName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Anonymous';
  var nameFromCache = cachedDisplayNames.get(type);
  if (nameFromCache != null) {
    return nameFromCache;
  }
  var displayName = fallbackName; // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803

  if (typeof type.displayName === 'string') {
    displayName = type.displayName;
  } else if (typeof type.name === 'string' && type.name !== '') {
    displayName = type.name;
  }
  cachedDisplayNames.set(type, displayName);
  return displayName;
}
var uidCounter = 0;
function getUID() {
  return ++uidCounter;
}
function utfDecodeStringWithRanges(array, left, right) {
  var string = '';
  for (var i = left; i <= right; i++) {
    string += String.fromCodePoint(array[i]);
  }
  return string;
}
function surrogatePairToCodePoint(charCode1, charCode2) {
  return ((charCode1 & 0x3ff) << 10) + (charCode2 & 0x3ff) + 0x10000;
} // Credit for this encoding approach goes to Tim Down:
// https://stackoverflow.com/questions/4877326/how-can-i-tell-if-a-string-contains-multibyte-characters-in-javascript

function utfEncodeString(string) {
  var cached = encodedStringCache.get(string);
  if (cached !== undefined) {
    return cached;
  }
  var encoded = [];
  var i = 0;
  var charCode;
  while (i < string.length) {
    charCode = string.charCodeAt(i); // Handle multibyte unicode characters (like emoji).

    if ((charCode & 0xf800) === 0xd800) {
      encoded.push(surrogatePairToCodePoint(charCode, string.charCodeAt(++i)));
    } else {
      encoded.push(charCode);
    }
    ++i;
  }
  encodedStringCache.set(string, encoded);
  return encoded;
}
function printOperationsArray(operations) {
  // The first two values are always rendererID and rootID
  var rendererID = operations[0];
  var rootID = operations[1];
  var logs = ["operations for renderer:".concat(rendererID, " and root:").concat(rootID)];
  var i = 2; // Reassemble the string table.

  var stringTable = [null // ID = 0 corresponds to the null string.
  ];
  var stringTableSize = operations[i++];
  var stringTableEnd = i + stringTableSize;
  while (i < stringTableEnd) {
    var nextLength = operations[i++];
    var nextString = utfDecodeStringWithRanges(operations, i, i + nextLength - 1);
    stringTable.push(nextString);
    i += nextLength;
  }
  while (i < operations.length) {
    var operation = operations[i];
    switch (operation) {
      case TREE_OPERATION_ADD:
        {
          var _id = operations[i + 1];
          var type = operations[i + 2];
          i += 3;
          if (type === ElementTypeRoot) {
            logs.push("Add new root node ".concat(_id));
            i++; // isStrictModeCompliant

            i++; // supportsProfiling

            i++; // supportsStrictMode

            i++; // hasOwnerMetadata
          } else {
            var parentID = operations[i];
            i++;
            i++; // ownerID

            var displayNameStringID = operations[i];
            var displayName = stringTable[displayNameStringID];
            i++;
            i++; // key

            logs.push("Add node ".concat(_id, " (").concat(displayName || 'null', ") as child of ").concat(parentID));
          }
          break;
        }
      case TREE_OPERATION_REMOVE:
        {
          var removeLength = operations[i + 1];
          i += 2;
          for (var removeIndex = 0; removeIndex < removeLength; removeIndex++) {
            var _id2 = operations[i];
            i += 1;
            logs.push("Remove node ".concat(_id2));
          }
          break;
        }
      case TREE_OPERATION_REMOVE_ROOT:
        {
          i += 1;
          logs.push("Remove root ".concat(rootID));
          break;
        }
      case TREE_OPERATION_SET_SUBTREE_MODE:
        {
          var _id3 = operations[i + 1];
          var mode = operations[i + 1];
          i += 3;
          logs.push("Mode ".concat(mode, " set for subtree with root ").concat(_id3));
          break;
        }
      case TREE_OPERATION_REORDER_CHILDREN:
        {
          var _id4 = operations[i + 1];
          var numChildren = operations[i + 2];
          i += 3;
          var children = operations.slice(i, i + numChildren);
          i += numChildren;
          logs.push("Re-order node ".concat(_id4, " children ").concat(children.join(',')));
          break;
        }
      case TREE_OPERATION_UPDATE_TREE_BASE_DURATION:
        // Base duration updates are only sent while profiling is in progress.
        // We can ignore them at this point.
        // The profiler UI uses them lazily in order to generate the tree.
        i += 3;
        break;
      case TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS:
        var id = operations[i + 1];
        var numErrors = operations[i + 2];
        var numWarnings = operations[i + 3];
        i += 4;
        logs.push("Node ".concat(id, " has ").concat(numErrors, " errors and ").concat(numWarnings, " warnings"));
        break;
      default:
        throw Error("Unsupported Bridge operation \"".concat(operation, "\""));
    }
  }
  console.log(logs.join('\n  '));
}
function getDefaultComponentFilters() {
  return [{
    type: ComponentFilterElementType,
    value: ElementTypeHostComponent,
    isEnabled: true
  }];
}
function getSavedComponentFilters() {
  try {
    var raw = localStorageGetItem(LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY);
    if (raw != null) {
      var parsedFilters = JSON.parse(raw);
      return filterOutLocationComponentFilters(parsedFilters);
    }
  } catch (error) {}
  return getDefaultComponentFilters();
}
function setSavedComponentFilters(componentFilters) {
  localStorageSetItem(LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY, JSON.stringify(filterOutLocationComponentFilters(componentFilters)));
} // Following __debugSource removal from Fiber, the new approach for finding the source location
// of a component, represented by the Fiber, is based on lazily generating and parsing component stack frames
// To find the original location, React DevTools will perform symbolication, source maps are required for that.
// In order to start filtering Fibers, we need to find location for all of them, which can't be done lazily.
// Eager symbolication can become quite expensive for large applications.

function filterOutLocationComponentFilters(componentFilters) {
  // This is just an additional check to preserve the previous state
  // Filters can be stored on the backend side or in user land (in a window object)
  if (!Array.isArray(componentFilters)) {
    return componentFilters;
  }
  return componentFilters.filter(function (f) {
    return f.type !== ComponentFilterLocation;
  });
}
function getDefaultOpenInEditorURL() {
  return typeof process.env.EDITOR_URL === 'string' ? process.env.EDITOR_URL : '';
}
function getOpenInEditorURL() {
  try {
    var raw = localStorageGetItem(LOCAL_STORAGE_OPEN_IN_EDITOR_URL);
    if (raw != null) {
      return JSON.parse(raw);
    }
  } catch (error) {}
  return getDefaultOpenInEditorURL();
}
function parseElementDisplayNameFromBackend(displayName, type) {
  if (displayName === null) {
    return {
      formattedDisplayName: null,
      hocDisplayNames: null,
      compiledWithForget: false
    };
  }
  if (displayName.startsWith('Forget(')) {
    var displayNameWithoutForgetWrapper = displayName.slice(7, displayName.length - 1);
    var _parseElementDisplayN = parseElementDisplayNameFromBackend(displayNameWithoutForgetWrapper, type),
      formattedDisplayName = _parseElementDisplayN.formattedDisplayName,
      _hocDisplayNames = _parseElementDisplayN.hocDisplayNames;
    return {
      formattedDisplayName: formattedDisplayName,
      hocDisplayNames: _hocDisplayNames,
      compiledWithForget: true
    };
  }
  var hocDisplayNames = null;
  switch (type) {
    case ElementTypeClass:
    case ElementTypeForwardRef:
    case ElementTypeFunction:
    case ElementTypeMemo:
    case ElementTypeVirtual:
      if (displayName.indexOf('(') >= 0) {
        var matches = displayName.match(/[^()]+/g);
        if (matches != null) {
          // $FlowFixMe[incompatible-type]
          displayName = matches.pop();
          hocDisplayNames = matches;
        }
      }
      break;
    default:
      break;
  }
  return {
    // $FlowFixMe[incompatible-return]
    formattedDisplayName: displayName,
    hocDisplayNames: hocDisplayNames,
    compiledWithForget: false
  };
} // Pulled from react-compat
// https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349

function shallowDiffers(prev, next) {
  for (var attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }
  for (var _attribute in next) {
    if (prev[_attribute] !== next[_attribute]) {
      return true;
    }
  }
  return false;
}
function utils_getInObject(object, path) {
  return path.reduce(function (reduced, attr) {
    if (reduced) {
      if (utils_hasOwnProperty.call(reduced, attr)) {
        return reduced[attr];
      }
      if (typeof reduced[Symbol.iterator] === 'function') {
        // Convert iterable to array and return array[index]
        //
        // TRICKY
        // Don't use [...spread] syntax for this purpose.
        // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
        // Other types (e.g. typed arrays, Sets) will not spread correctly.
        return Array.from(reduced)[attr];
      }
    }
    return null;
  }, object);
}
function deletePathInObject(object, path) {
  var length = path.length;
  var last = path[length - 1];
  if (object != null) {
    var parent = utils_getInObject(object, path.slice(0, length - 1));
    if (parent) {
      if (src_isArray(parent)) {
        parent.splice(last, 1);
      } else {
        delete parent[last];
      }
    }
  }
}
function renamePathInObject(object, oldPath, newPath) {
  var length = oldPath.length;
  if (object != null) {
    var parent = utils_getInObject(object, oldPath.slice(0, length - 1));
    if (parent) {
      var lastOld = oldPath[length - 1];
      var lastNew = newPath[length - 1];
      parent[lastNew] = parent[lastOld];
      if (src_isArray(parent)) {
        parent.splice(lastOld, 1);
      } else {
        delete parent[lastOld];
      }
    }
  }
}
function utils_setInObject(object, path, value) {
  var length = path.length;
  var last = path[length - 1];
  if (object != null) {
    var parent = utils_getInObject(object, path.slice(0, length - 1));
    if (parent) {
      parent[last] = value;
    }
  }
}
function isError(data) {
  // If it doesn't event look like an error, it won't be an actual error.
  if ('name' in data && 'message' in data) {
    while (data) {
      // $FlowFixMe[method-unbinding]
      if (Object.prototype.toString.call(data) === '[object Error]') {
        return true;
      }
      data = Object.getPrototypeOf(data);
    }
  }
  return false;
}
/**
 * Get a enhanced/artificial type string based on the object instance
 */

function getDataType(data) {
  if (data === null) {
    return 'null';
  } else if (data === undefined) {
    return 'undefined';
  }
  if (typeof HTMLElement !== 'undefined' && data instanceof HTMLElement) {
    return 'html_element';
  }
  var type = utils_typeof(data);
  switch (type) {
    case 'bigint':
      return 'bigint';
    case 'boolean':
      return 'boolean';
    case 'function':
      return 'function';
    case 'number':
      if (Number.isNaN(data)) {
        return 'nan';
      } else if (!Number.isFinite(data)) {
        return 'infinity';
      } else {
        return 'number';
      }
    case 'object':
      if (data.$$typeof === REACT_ELEMENT_TYPE || data.$$typeof === REACT_LEGACY_ELEMENT_TYPE) {
        return 'react_element';
      }
      if (src_isArray(data)) {
        return 'array';
      } else if (ArrayBuffer.isView(data)) {
        return utils_hasOwnProperty.call(data.constructor, 'BYTES_PER_ELEMENT') ? 'typed_array' : 'data_view';
      } else if (data.constructor && data.constructor.name === 'ArrayBuffer') {
        // HACK This ArrayBuffer check is gross; is there a better way?
        // We could try to create a new DataView with the value.
        // If it doesn't error, we know it's an ArrayBuffer,
        // but this seems kind of awkward and expensive.
        return 'array_buffer';
      } else if (typeof data[Symbol.iterator] === 'function') {
        var iterator = data[Symbol.iterator]();
        if (!iterator) {// Proxies might break assumptoins about iterators.
          // See github.com/facebook/react/issues/21654
        } else {
          return iterator === data ? 'opaque_iterator' : 'iterator';
        }
      } else if (data.constructor && data.constructor.name === 'RegExp') {
        return 'regexp';
      } else if (typeof data.then === 'function') {
        return 'thenable';
      } else if (isError(data)) {
        return 'error';
      } else {
        // $FlowFixMe[method-unbinding]
        var toStringValue = Object.prototype.toString.call(data);
        if (toStringValue === '[object Date]') {
          return 'date';
        } else if (toStringValue === '[object HTMLAllCollection]') {
          return 'html_all_collection';
        }
      }
      if (!isPlainObject(data)) {
        return 'class_instance';
      }
      return 'object';
    case 'string':
      return 'string';
    case 'symbol':
      return 'symbol';
    case 'undefined':
      if (
      // $FlowFixMe[method-unbinding]
      Object.prototype.toString.call(data) === '[object HTMLAllCollection]') {
        return 'html_all_collection';
      }
      return 'undefined';
    default:
      return 'unknown';
  }
} // Fork of packages/react-is/src/ReactIs.js:30, but with legacy element type
// Which has been changed in https://github.com/facebook/react/pull/28813

function typeOfWithLegacyElementSymbol(object) {
  if (utils_typeof(object) === 'object' && object !== null) {
    var $$typeof = object.$$typeof;
    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
      case REACT_LEGACY_ELEMENT_TYPE:
        var type = object.type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
          case REACT_SUSPENSE_LIST_TYPE:
          case REACT_VIEW_TRANSITION_TYPE:
            return type;
          default:
            var $$typeofType = type && type.$$typeof;
            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
                return $$typeofType;
              case REACT_CONSUMER_TYPE:
                return $$typeofType;
              // Fall through

              default:
                return $$typeof;
            }
        }
      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }
  return undefined;
}
function getDisplayNameForReactElement(element) {
  var elementType = typeOfWithLegacyElementSymbol(element);
  switch (elementType) {
    case REACT_CONSUMER_TYPE:
      return 'ContextConsumer';
    case LEGACY_REACT_PROVIDER_TYPE:
      return 'ContextProvider';
    case REACT_CONTEXT_TYPE:
      return 'Context';
    case REACT_FORWARD_REF_TYPE:
      return 'ForwardRef';
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';
    case REACT_LAZY_TYPE:
      return 'Lazy';
    case REACT_MEMO_TYPE:
      return 'Memo';
    case REACT_PORTAL_TYPE:
      return 'Portal';
    case REACT_PROFILER_TYPE:
      return 'Profiler';
    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';
    case REACT_SUSPENSE_TYPE:
      return 'Suspense';
    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';
    case REACT_VIEW_TRANSITION_TYPE:
      return 'ViewTransition';
    case REACT_TRACING_MARKER_TYPE:
      return 'TracingMarker';
    default:
      var type = element.type;
      if (typeof type === 'string') {
        return type;
      } else if (typeof type === 'function') {
        return getDisplayName(type, 'Anonymous');
      } else if (type != null) {
        return 'NotImplementedInDevtools';
      } else {
        return 'Element';
      }
  }
}
var MAX_PREVIEW_STRING_LENGTH = 50;
function truncateForDisplay(string) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_PREVIEW_STRING_LENGTH;
  if (string.length > length) {
    return string.slice(0, length) + '…';
  } else {
    return string;
  }
} // Attempts to mimic Chrome's inline preview for values.
// For example, the following value...
//   {
//      foo: 123,
//      bar: "abc",
//      baz: [true, false],
//      qux: { ab: 1, cd: 2 }
//   };
//
// Would show a preview of...
//   {foo: 123, bar: "abc", baz: Array(2), qux: {…}}
//
// And the following value...
//   [
//     123,
//     "abc",
//     [true, false],
//     { foo: 123, bar: "abc" }
//   ];
//
// Would show a preview of...
//   [123, "abc", Array(2), {…}]

function formatDataForPreview(data, showFormattedValue) {
  if (data != null && utils_hasOwnProperty.call(data, meta.type)) {
    return showFormattedValue ? data[meta.preview_long] : data[meta.preview_short];
  }
  var type = getDataType(data);
  switch (type) {
    case 'html_element':
      return "<".concat(truncateForDisplay(data.tagName.toLowerCase()), " />");
    case 'function':
      if (typeof data.name === 'function' || data.name === '') {
        return '() => {}';
      }
      return "".concat(truncateForDisplay(data.name), "() {}");
    case 'string':
      return "\"".concat(data, "\"");
    case 'bigint':
      return truncateForDisplay(data.toString() + 'n');
    case 'regexp':
      return truncateForDisplay(data.toString());
    case 'symbol':
      return truncateForDisplay(data.toString());
    case 'react_element':
      return "<".concat(truncateForDisplay(getDisplayNameForReactElement(data) || 'Unknown'), " />");
    case 'array_buffer':
      return "ArrayBuffer(".concat(data.byteLength, ")");
    case 'data_view':
      return "DataView(".concat(data.buffer.byteLength, ")");
    case 'array':
      if (showFormattedValue) {
        var formatted = '';
        for (var i = 0; i < data.length; i++) {
          if (i > 0) {
            formatted += ', ';
          }
          formatted += formatDataForPreview(data[i], false);
          if (formatted.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }
        return "[".concat(truncateForDisplay(formatted), "]");
      } else {
        var length = utils_hasOwnProperty.call(data, meta.size) ? data[meta.size] : data.length;
        return "Array(".concat(length, ")");
      }
    case 'typed_array':
      var shortName = "".concat(data.constructor.name, "(").concat(data.length, ")");
      if (showFormattedValue) {
        var _formatted = '';
        for (var _i = 0; _i < data.length; _i++) {
          if (_i > 0) {
            _formatted += ', ';
          }
          _formatted += data[_i];
          if (_formatted.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }
        return "".concat(shortName, " [").concat(truncateForDisplay(_formatted), "]");
      } else {
        return shortName;
      }
    case 'iterator':
      var name = data.constructor.name;
      if (showFormattedValue) {
        // TRICKY
        // Don't use [...spread] syntax for this purpose.
        // This project uses @babel/plugin-transform-spread in "loose" mode which only works with Array values.
        // Other types (e.g. typed arrays, Sets) will not spread correctly.
        var array = Array.from(data);
        var _formatted2 = '';
        for (var _i2 = 0; _i2 < array.length; _i2++) {
          var entryOrEntries = array[_i2];
          if (_i2 > 0) {
            _formatted2 += ', ';
          } // TRICKY
          // Browsers display Maps and Sets differently.
          // To mimic their behavior, detect if we've been given an entries tuple.
          //   Map(2) {"abc" => 123, "def" => 123}
          //   Set(2) {"abc", 123}

          if (src_isArray(entryOrEntries)) {
            var key = formatDataForPreview(entryOrEntries[0], true);
            var value = formatDataForPreview(entryOrEntries[1], false);
            _formatted2 += "".concat(key, " => ").concat(value);
          } else {
            _formatted2 += formatDataForPreview(entryOrEntries, false);
          }
          if (_formatted2.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }
        return "".concat(name, "(").concat(data.size, ") {").concat(truncateForDisplay(_formatted2), "}");
      } else {
        return "".concat(name, "(").concat(data.size, ")");
      }
    case 'opaque_iterator':
      {
        return data[Symbol.toStringTag];
      }
    case 'date':
      return data.toString();
    case 'class_instance':
      try {
        var resolvedConstructorName = data.constructor.name;
        if (typeof resolvedConstructorName === 'string') {
          return resolvedConstructorName;
        }
        resolvedConstructorName = Object.getPrototypeOf(data).constructor.name;
        if (typeof resolvedConstructorName === 'string') {
          return resolvedConstructorName;
        }
        try {
          return truncateForDisplay(String(data));
        } catch (error) {
          return 'unserializable';
        }
      } catch (error) {
        return 'unserializable';
      }
    case 'thenable':
      var displayName;
      if (isPlainObject(data)) {
        displayName = 'Thenable';
      } else {
        var _resolvedConstructorName = data.constructor.name;
        if (typeof _resolvedConstructorName !== 'string') {
          _resolvedConstructorName = Object.getPrototypeOf(data).constructor.name;
        }
        if (typeof _resolvedConstructorName === 'string') {
          displayName = _resolvedConstructorName;
        } else {
          displayName = 'Thenable';
        }
      }
      switch (data.status) {
        case 'pending':
          return "pending ".concat(displayName);
        case 'fulfilled':
          if (showFormattedValue) {
            var _formatted3 = formatDataForPreview(data.value, false);
            return "fulfilled ".concat(displayName, " {").concat(truncateForDisplay(_formatted3), "}");
          } else {
            return "fulfilled ".concat(displayName, " {\u2026}");
          }
        case 'rejected':
          if (showFormattedValue) {
            var _formatted4 = formatDataForPreview(data.reason, false);
            return "rejected ".concat(displayName, " {").concat(truncateForDisplay(_formatted4), "}");
          } else {
            return "rejected ".concat(displayName, " {\u2026}");
          }
        default:
          return displayName;
      }
    case 'object':
      if (showFormattedValue) {
        var keys = Array.from(getAllEnumerableKeys(data)).sort(alphaSortKeys);
        var _formatted5 = '';
        for (var _i3 = 0; _i3 < keys.length; _i3++) {
          var _key = keys[_i3];
          if (_i3 > 0) {
            _formatted5 += ', ';
          }
          _formatted5 += "".concat(_key.toString(), ": ").concat(formatDataForPreview(data[_key], false));
          if (_formatted5.length > MAX_PREVIEW_STRING_LENGTH) {
            // Prevent doing a lot of unnecessary iteration...
            break;
          }
        }
        return "{".concat(truncateForDisplay(_formatted5), "}");
      } else {
        return '{…}';
      }
    case 'error':
      return truncateForDisplay(String(data));
    case 'boolean':
    case 'number':
    case 'infinity':
    case 'nan':
    case 'null':
    case 'undefined':
      return String(data);
    default:
      try {
        return truncateForDisplay(String(data));
      } catch (error) {
        return 'unserializable';
      }
  }
} // Basically checking that the object only has Object in its prototype chain

var isPlainObject = function isPlainObject(object) {
  var objectPrototype = Object.getPrototypeOf(object);
  if (!objectPrototype) return true;
  var objectParentPrototype = Object.getPrototypeOf(objectPrototype);
  return !objectParentPrototype;
};
function backendToFrontendSerializedElementMapper(element) {
  var _parseElementDisplayN2 = parseElementDisplayNameFromBackend(element.displayName, element.type),
    formattedDisplayName = _parseElementDisplayN2.formattedDisplayName,
    hocDisplayNames = _parseElementDisplayN2.hocDisplayNames,
    compiledWithForget = _parseElementDisplayN2.compiledWithForget;
  return _objectSpread(_objectSpread({}, element), {}, {
    displayName: formattedDisplayName,
    hocDisplayNames: hocDisplayNames,
    compiledWithForget: compiledWithForget
  });
}
/**
 * Should be used when treating url as a Chrome Resource URL.
 */

function normalizeUrlIfValid(url) {
  try {
    // TODO: Chrome will use the basepath to create a Resource URL.
    return new URL(url).toString();
  } catch (_unused) {
    // Giving up if it's not a valid URL without basepath
    return url;
  }
}
function getIsReloadAndProfileSupported() {
  // Notify the frontend if the backend supports the Storage API (e.g. localStorage).
  // If not, features like reload-and-profile will not work correctly and must be disabled.
  var isBackendStorageAPISupported = false;
  try {
    localStorage.getItem('test');
    isBackendStorageAPISupported = true;
  } catch (error) {}
  return isBackendStorageAPISupported && isSynchronousXHRSupported();
} // Expected to be used only by browser extension and react-devtools-inline

function getIfReloadedAndProfiling() {
  return sessionStorageGetItem(SESSION_STORAGE_RELOAD_AND_PROFILE_KEY) === 'true';
}
function getProfilingSettings() {
  return {
    recordChangeDescriptions: sessionStorageGetItem(SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY) === 'true',
    recordTimeline: sessionStorageGetItem(SESSION_STORAGE_RECORD_TIMELINE_KEY) === 'true'
  };
}
function onReloadAndProfile(recordChangeDescriptions, recordTimeline) {
  sessionStorageSetItem(SESSION_STORAGE_RELOAD_AND_PROFILE_KEY, 'true');
  sessionStorageSetItem(SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY, recordChangeDescriptions ? 'true' : 'false');
  sessionStorageSetItem(SESSION_STORAGE_RECORD_TIMELINE_KEY, recordTimeline ? 'true' : 'false');
}
function onReloadAndProfileFlagsReset() {
  sessionStorageRemoveItem(SESSION_STORAGE_RELOAD_AND_PROFILE_KEY);
  sessionStorageRemoveItem(SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY);
  sessionStorageRemoveItem(SESSION_STORAGE_RECORD_TIMELINE_KEY);
}