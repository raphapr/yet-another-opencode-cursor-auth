function DevToolsConsolePatching_ownKeys(object, enumerableOnly) {
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
function DevToolsConsolePatching_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      DevToolsConsolePatching_ownKeys(Object(source), true).forEach(function (key) {
        DevToolsConsolePatching_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      DevToolsConsolePatching_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function DevToolsConsolePatching_defineProperty(obj, key, value) {
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
// This is a DevTools fork of shared/ConsolePatchingDev.
// The shared console patching code is DEV-only.
// We can't use it since DevTools only ships production builds.
// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;
function disabledLog() {}
disabledLog.__reactDisabledLog = true;
function disableLogs() {
  if (disabledDepth === 0) {
    prevLog = console.log;
    prevInfo = console.info;
    prevWarn = console.warn;
    prevError = console.error;
    prevGroup = console.group;
    prevGroupCollapsed = console.groupCollapsed;
    prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

    var props = {
      configurable: true,
      enumerable: true,
      value: disabledLog,
      writable: true
    }; // $FlowFixMe[cannot-write] Flow thinks console is immutable.

    Object.defineProperties(console, {
      info: props,
      log: props,
      warn: props,
      error: props,
      group: props,
      groupCollapsed: props,
      groupEnd: props
    });
    /* eslint-enable react-internal/no-production-logging */
  }
  disabledDepth++;
}
function reenableLogs() {
  disabledDepth--;
  if (disabledDepth === 0) {
    var props = {
      configurable: true,
      enumerable: true,
      writable: true
    }; // $FlowFixMe[cannot-write] Flow thinks console is immutable.

    Object.defineProperties(console, {
      log: DevToolsConsolePatching_objectSpread(DevToolsConsolePatching_objectSpread({}, props), {}, {
        value: prevLog
      }),
      info: DevToolsConsolePatching_objectSpread(DevToolsConsolePatching_objectSpread({}, props), {}, {
        value: prevInfo
      }),
      warn: DevToolsConsolePatching_objectSpread(DevToolsConsolePatching_objectSpread({}, props), {}, {
        value: prevWarn
      }),
      error: DevToolsConsolePatching_objectSpread(DevToolsConsolePatching_objectSpread({}, props), {}, {
        value: prevError
      }),
      group: DevToolsConsolePatching_objectSpread(DevToolsConsolePatching_objectSpread({}, props), {}, {
        value: prevGroup
      }),
      groupCollapsed: DevToolsConsolePatching_objectSpread(DevToolsConsolePatching_objectSpread({}, props), {}, {
        value: prevGroupCollapsed
      }),
      groupEnd: DevToolsConsolePatching_objectSpread(DevToolsConsolePatching_objectSpread({}, props), {}, {
        value: prevGroupEnd
      })
    });
    /* eslint-enable react-internal/no-production-logging */
  }
  if (disabledDepth < 0) {
    console.error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
  }
}