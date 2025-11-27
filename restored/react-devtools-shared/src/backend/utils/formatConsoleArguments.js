function formatConsoleArguments_toConsumableArray(arr) {
  return formatConsoleArguments_arrayWithoutHoles(arr) || formatConsoleArguments_iterableToArray(arr) || formatConsoleArguments_unsupportedIterableToArray(arr) || formatConsoleArguments_nonIterableSpread();
}
function formatConsoleArguments_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function formatConsoleArguments_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function formatConsoleArguments_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return formatConsoleArguments_arrayLikeToArray(arr);
}
function formatConsoleArguments_slicedToArray(arr, i) {
  return formatConsoleArguments_arrayWithHoles(arr) || formatConsoleArguments_iterableToArrayLimit(arr, i) || formatConsoleArguments_unsupportedIterableToArray(arr, i) || formatConsoleArguments_nonIterableRest();
}
function formatConsoleArguments_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function formatConsoleArguments_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return formatConsoleArguments_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return formatConsoleArguments_arrayLikeToArray(o, minLen);
}
function formatConsoleArguments_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function formatConsoleArguments_iterableToArrayLimit(arr, i) {
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
function formatConsoleArguments_arrayWithHoles(arr) {
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
// Do not add / import anything to this file.
// This function could be used from multiple places, including hook.
// Skips CSS and object arguments, inlines other in the first argument as a template string
function formatConsoleArguments(maybeMessage) {
  for (var _len = arguments.length, inputArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    inputArgs[_key - 1] = arguments[_key];
  }
  if (inputArgs.length === 0 || typeof maybeMessage !== 'string') {
    return [maybeMessage].concat(inputArgs);
  }
  var args = inputArgs.slice();
  var template = '';
  var argumentsPointer = 0;
  for (var i = 0; i < maybeMessage.length; ++i) {
    var currentChar = maybeMessage[i];
    if (currentChar !== '%') {
      template += currentChar;
      continue;
    }
    var nextChar = maybeMessage[i + 1];
    ++i; // Only keep CSS and objects, inline other arguments

    switch (nextChar) {
      case 'c':
      case 'O':
      case 'o':
        {
          ++argumentsPointer;
          template += "%".concat(nextChar);
          break;
        }
      case 'd':
      case 'i':
        {
          var _args$splice = args.splice(argumentsPointer, 1),
            _args$splice2 = formatConsoleArguments_slicedToArray(_args$splice, 1),
            arg = _args$splice2[0];
          template += parseInt(arg, 10).toString();
          break;
        }
      case 'f':
        {
          var _args$splice3 = args.splice(argumentsPointer, 1),
            _args$splice4 = formatConsoleArguments_slicedToArray(_args$splice3, 1),
            _arg = _args$splice4[0];
          template += parseFloat(_arg).toString();
          break;
        }
      case 's':
        {
          var _args$splice5 = args.splice(argumentsPointer, 1),
            _args$splice6 = formatConsoleArguments_slicedToArray(_args$splice5, 1),
            _arg2 = _args$splice6[0];
          template += String(_arg2);
          break;
        }
      default:
        template += "%".concat(nextChar);
    }
  }
  return [template].concat(formatConsoleArguments_toConsumableArray(args));
}