function renderer_toConsumableArray(arr) {
  return renderer_arrayWithoutHoles(arr) || renderer_iterableToArray(arr) || renderer_unsupportedIterableToArray(arr) || renderer_nonIterableSpread();
}
function renderer_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function renderer_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return renderer_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return renderer_arrayLikeToArray(o, minLen);
}
function renderer_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function renderer_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return renderer_arrayLikeToArray(arr);
}
function renderer_arrayLikeToArray(arr, len) {
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

function supportsConsoleTasks(componentInfo) {
  // If this ReactComponentInfo supports native console.createTask then we are already running
  // inside a native async stack trace if it's active - meaning the DevTools is open.
  // Ideally we'd detect if this task was created while the DevTools was open or not.
  return !!componentInfo.debugTask;
}
function attach(hook, rendererID, renderer, global) {
  var getCurrentComponentInfo = renderer.getCurrentComponentInfo;
  function getComponentStack(topFrame) {
    if (getCurrentComponentInfo === undefined) {
      // Expected this to be part of the renderer. Ignore.
      return null;
    }
    var current = getCurrentComponentInfo();
    if (current === null) {
      // Outside of our render scope.
      return null;
    }
    if (supportsConsoleTasks(current)) {
      // This will be handled natively by console.createTask. No need for
      // DevTools to add it.
      return null;
    }
    var enableOwnerStacks = current.debugStack != null;
    var componentStack = '';
    if (enableOwnerStacks) {
      // Prefix the owner stack with the current stack. I.e. what called
      // console.error. While this will also be part of the native stack,
      // it is hidden and not presented alongside this argument so we print
      // them all together.
      var topStackFrames = formatOwnerStack(topFrame);
      if (topStackFrames) {
        componentStack += '\n' + topStackFrames;
      }
      componentStack += getOwnerStackByComponentInfoInDev(current);
    }
    return {
      enableOwnerStacks: enableOwnerStacks,
      componentStack: componentStack
    };
  } // Called when an error or warning is logged during render, commit, or passive (including unmount functions).

  function onErrorOrWarning(type, args) {
    if (getCurrentComponentInfo === undefined) {
      // Expected this to be part of the renderer. Ignore.
      return;
    }
    var componentInfo = getCurrentComponentInfo();
    if (componentInfo === null) {
      // Outside of our render scope.
      return;
    }
    if (args.length > 3 && typeof args[0] === 'string' && args[0].startsWith('%c%s%c ') && typeof args[1] === 'string' && typeof args[2] === 'string' && typeof args[3] === 'string') {
      // This looks like the badge we prefixed to the log. Our UI doesn't support formatted logs.
      // We remove the formatting. If the environment of the log is the same as the environment of
      // the component (the common case) we remove the badge completely otherwise leave it plain
      var format = args[0].slice(7);
      var env = args[2].trim();
      args = args.slice(4);
      if (env !== componentInfo.env) {
        args.unshift('[' + env + '] ' + format);
      } else {
        args.unshift(format);
      }
    } // We can't really use this message as a unique key, since we can't distinguish
    // different objects in this implementation. We have to delegate displaying of the objects
    // to the environment, the browser console, for example, so this is why this should be kept
    // as an array of arguments, instead of the plain string.
    // [Warning: %o, {...}] and [Warning: %o, {...}] will be considered as the same message,
    // even if objects are different

    var message = formatConsoleArgumentsToSingleString.apply(void 0, renderer_toConsumableArray(args)); // Track the warning/error for later.

    var componentLogsEntry = componentInfoToComponentLogsMap.get(componentInfo);
    if (componentLogsEntry === undefined) {
      componentLogsEntry = {
        errors: new Map(),
        errorsCount: 0,
        warnings: new Map(),
        warningsCount: 0
      };
      componentInfoToComponentLogsMap.set(componentInfo, componentLogsEntry);
    }
    var messageMap = type === 'error' ? componentLogsEntry.errors : componentLogsEntry.warnings;
    var count = messageMap.get(message) || 0;
    messageMap.set(message, count + 1);
    if (type === 'error') {
      componentLogsEntry.errorsCount++;
    } else {
      componentLogsEntry.warningsCount++;
    } // The changes will be flushed later when we commit this tree to Fiber.
  }
  return {
    cleanup: function cleanup() {},
    clearErrorsAndWarnings: function clearErrorsAndWarnings() {},
    clearErrorsForElementID: function clearErrorsForElementID() {},
    clearWarningsForElementID: function clearWarningsForElementID() {},
    getSerializedElementValueByPath: function getSerializedElementValueByPath() {},
    deletePath: function deletePath() {},
    findHostInstancesForElementID: function findHostInstancesForElementID() {
      return null;
    },
    flushInitialOperations: function flushInitialOperations() {},
    getBestMatchForTrackedPath: function getBestMatchForTrackedPath() {
      return null;
    },
    getComponentStack: getComponentStack,
    getDisplayNameForElementID: function getDisplayNameForElementID() {
      return null;
    },
    getNearestMountedDOMNode: function getNearestMountedDOMNode() {
      return null;
    },
    getElementIDForHostInstance: function getElementIDForHostInstance() {
      return null;
    },
    getInstanceAndStyle: function getInstanceAndStyle() {
      return {
        instance: null,
        style: null
      };
    },
    getOwnersList: function getOwnersList() {
      return null;
    },
    getPathForElement: function getPathForElement() {
      return null;
    },
    getProfilingData: function getProfilingData() {
      throw new Error('getProfilingData not supported by this renderer');
    },
    handleCommitFiberRoot: function handleCommitFiberRoot() {},
    handleCommitFiberUnmount: function handleCommitFiberUnmount() {},
    handlePostCommitFiberRoot: function handlePostCommitFiberRoot() {},
    hasElementWithId: function hasElementWithId() {
      return false;
    },
    inspectElement: function inspectElement(requestID, id, path) {
      return {
        id: id,
        responseID: requestID,
        type: 'not-found'
      };
    },
    logElementToConsole: function logElementToConsole() {},
    getElementAttributeByPath: function getElementAttributeByPath() {},
    getElementSourceFunctionById: function getElementSourceFunctionById() {},
    onErrorOrWarning: onErrorOrWarning,
    overrideError: function overrideError() {},
    overrideSuspense: function overrideSuspense() {},
    overrideValueAtPath: function overrideValueAtPath() {},
    renamePath: function renamePath() {},
    renderer: renderer,
    setTraceUpdatesEnabled: function setTraceUpdatesEnabled() {},
    setTrackedPath: function setTrackedPath() {},
    startProfiling: function startProfiling() {},
    stopProfiling: function stopProfiling() {},
    storeAsGlobal: function storeAsGlobal() {},
    updateComponentFilters: function updateComponentFilters() {},
    getEnvironmentNames: function getEnvironmentNames() {
      return [];
    }
  };
}