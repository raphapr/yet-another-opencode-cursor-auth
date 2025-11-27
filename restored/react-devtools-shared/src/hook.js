function hook_createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = hook_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
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
        e: function e(_e) {
          throw _e;
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
    e: function e(_e2) {
      didErr = true;
      err = _e2;
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
function hook_toConsumableArray(arr) {
  return hook_arrayWithoutHoles(arr) || hook_iterableToArray(arr) || hook_unsupportedIterableToArray(arr) || hook_nonIterableSpread();
}
function hook_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function hook_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return hook_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return hook_arrayLikeToArray(o, minLen);
}
function hook_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function hook_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return hook_arrayLikeToArray(arr);
}
function hook_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

/**
 * Install the hook on window, which is an event emitter.
 * Note: this global hook __REACT_DEVTOOLS_GLOBAL_HOOK__ is a de facto public API.
 * It's especially important to avoid creating direct dependency on the DevTools Backend.
 * That's why we still inline the whole event emitter implementation,
 * the string format implementation, and part of the console implementation here.
 *
 * 
 */

// React's custom built component stack strings match "\s{4}in"
// Chrome's prefix matches "\s{4}at"

var PREFIX_REGEX = /\s{4}(in|at)\s{1}/; // Firefox and Safari have no prefix ("")
// but we can fallback to looking for location info (e.g. "foo.js:12:345")

var ROW_COLUMN_NUMBER_REGEX = /:\d+:\d+(\n|$)/;
function isStringComponentStack(text) {
  return PREFIX_REGEX.test(text) || ROW_COLUMN_NUMBER_REGEX.test(text);
} // We add a suffix to some frames that older versions of React didn't do.
// To compare if it's equivalent we strip out the suffix to see if they're
// still equivalent. Similarly, we sometimes use [] and sometimes () so we
// strip them to for the comparison.

var frameDiffs = / \(\<anonymous\>\)$|\@unknown\:0\:0$|\(|\)|\[|\]/gm;
function areStackTracesEqual(a, b) {
  return a.replace(frameDiffs, '') === b.replace(frameDiffs, '');
}
var targetConsole = console;
var defaultProfilingSettings = {
  recordChangeDescriptions: false,
  recordTimeline: false
};
function installHook(target, maybeSettingsOrSettingsPromise) {
  var shouldStartProfilingNow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var profilingSettings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultProfilingSettings;
  if (target.hasOwnProperty('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
    return null;
  }
  function detectReactBuildType(renderer) {
    try {
      if (typeof renderer.version === 'string') {
        // React DOM Fiber (16+)
        if (renderer.bundleType > 0) {
          // This is not a production build.
          // We are currently only using 0 (PROD) and 1 (DEV)
          // but might add 2 (PROFILE) in the future.
          return 'development';
        } // React 16 uses flat bundles. If we report the bundle as production
        // version, it means we also minified and envified it ourselves.

        return 'production'; // Note: There is still a risk that the CommonJS entry point has not
        // been envified or uglified. In this case the user would have *both*
        // development and production bundle, but only the prod one would run.
        // This would be really bad. We have a separate check for this because
        // it happens *outside* of the renderer injection. See `checkDCE` below.
      } // $FlowFixMe[method-unbinding]

      var _toString = Function.prototype.toString;
      if (renderer.Mount && renderer.Mount._renderNewRootComponent) {
        // React DOM Stack
        var renderRootCode = _toString.call(renderer.Mount._renderNewRootComponent); // Filter out bad results (if that is even possible):

        if (renderRootCode.indexOf('function') !== 0) {
          // Hope for the best if we're not sure.
          return 'production';
        } // Check for React DOM Stack < 15.1.0 in development.
        // If it contains "storedMeasure" call, it's wrapped in ReactPerf (DEV only).
        // This would be true even if it's minified, as method name still matches.

        if (renderRootCode.indexOf('storedMeasure') !== -1) {
          return 'development';
        } // For other versions (and configurations) it's not so easy.
        // Let's quickly exclude proper production builds.
        // If it contains a warning message, it's either a DEV build,
        // or an PROD build without proper dead code elimination.

        if (renderRootCode.indexOf('should be a pure function') !== -1) {
          // Now how do we tell a DEV build from a bad PROD build?
          // If we see NODE_ENV, we're going to assume this is a dev build
          // because most likely it is referring to an empty shim.
          if (renderRootCode.indexOf('NODE_ENV') !== -1) {
            return 'development';
          } // If we see "development", we're dealing with an envified DEV build
          // (such as the official React DEV UMD).

          if (renderRootCode.indexOf('development') !== -1) {
            return 'development';
          } // I've seen process.env.NODE_ENV !== 'production' being smartly
          // replaced by `true` in DEV by Webpack. I don't know how that
          // works but we can safely guard against it because `true` was
          // never used in the function source since it was written.

          if (renderRootCode.indexOf('true') !== -1) {
            return 'development';
          } // By now either it is a production build that has not been minified,
          // or (worse) this is a minified development build using non-standard
          // environment (e.g. "staging"). We're going to look at whether
          // the function argument name is mangled:

          if (
          // 0.13 to 15
          renderRootCode.indexOf('nextElement') !== -1 ||
          // 0.12
          renderRootCode.indexOf('nextComponent') !== -1) {
            // We can't be certain whether this is a development build or not,
            // but it is definitely unminified.
            return 'unminified';
          } else {
            // This is likely a minified development build.
            return 'development';
          }
        } // By now we know that it's envified and dead code elimination worked,
        // but what if it's still not minified? (Is this even possible?)
        // Let's check matches for the first argument name.

        if (
        // 0.13 to 15
        renderRootCode.indexOf('nextElement') !== -1 ||
        // 0.12
        renderRootCode.indexOf('nextComponent') !== -1) {
          return 'unminified';
        } // Seems like we're using the production version.
        // However, the branch above is Stack-only so this is 15 or earlier.

        return 'outdated';
      }
    } catch (err) {// Weird environments may exist.
      // This code needs a higher fault tolerance
      // because it runs even with closed DevTools.
      // TODO: should we catch errors in all injected code, and not just this part?
    }
    return 'production';
  }
  function checkDCE(fn) {
    // This runs for production versions of React.
    // Needs to be super safe.
    try {
      // $FlowFixMe[method-unbinding]
      var _toString2 = Function.prototype.toString;
      var code = _toString2.call(fn); // This is a string embedded in the passed function under DEV-only
      // condition. However the function executes only in PROD. Therefore,
      // if we see it, dead code elimination did not work.

      if (code.indexOf('^_^') > -1) {
        // Remember to report during next injection.
        hasDetectedBadDCE = true; // Bonus: throw an exception hoping that it gets picked up by a reporting system.
        // Not synchronously so that it doesn't break the calling code.

        setTimeout(function () {
          throw new Error('React is running in production mode, but dead code ' + 'elimination has not been applied. Read how to correctly ' + 'configure React for production: ' + 'https://react.dev/link/perf-use-production-build');
        });
      }
    } catch (err) {}
  } // TODO: isProfiling should be stateful, and we should update it once profiling is finished

  var isProfiling = shouldStartProfilingNow;
  var uidCounter = 0;
  function inject(renderer) {
    var id = ++uidCounter;
    renderers.set(id, renderer);
    var reactBuildType = hasDetectedBadDCE ? 'deadcode' : detectReactBuildType(renderer);
    hook.emit('renderer', {
      id: id,
      renderer: renderer,
      reactBuildType: reactBuildType
    });
    var rendererInterface = attachRenderer(hook, id, renderer, target, isProfiling, profilingSettings);
    if (rendererInterface != null) {
      hook.rendererInterfaces.set(id, rendererInterface);
      hook.emit('renderer-attached', {
        id: id,
        rendererInterface: rendererInterface
      });
    } else {
      hook.hasUnsupportedRendererAttached = true;
      hook.emit('unsupported-renderer-version');
    }
    return id;
  }
  var hasDetectedBadDCE = false;
  function sub(event, fn) {
    hook.on(event, fn);
    return function () {
      return hook.off(event, fn);
    };
  }
  function on(event, fn) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(fn);
  }
  function off(event, fn) {
    if (!listeners[event]) {
      return;
    }
    var index = listeners[event].indexOf(fn);
    if (index !== -1) {
      listeners[event].splice(index, 1);
    }
    if (!listeners[event].length) {
      delete listeners[event];
    }
  }
  function emit(event, data) {
    if (listeners[event]) {
      listeners[event].map(function (fn) {
        return fn(data);
      });
    }
  }
  function getFiberRoots(rendererID) {
    var roots = fiberRoots;
    if (!roots[rendererID]) {
      roots[rendererID] = new Set();
    }
    return roots[rendererID];
  }
  function onCommitFiberUnmount(rendererID, fiber) {
    var rendererInterface = rendererInterfaces.get(rendererID);
    if (rendererInterface != null) {
      rendererInterface.handleCommitFiberUnmount(fiber);
    }
  }
  function onCommitFiberRoot(rendererID, root, priorityLevel) {
    var mountedRoots = hook.getFiberRoots(rendererID);
    var current = root.current;
    var isKnownRoot = mountedRoots.has(root);
    var isUnmounting = current.memoizedState == null || current.memoizedState.element == null; // Keep track of mounted roots so we can hydrate when DevTools connect.

    if (!isKnownRoot && !isUnmounting) {
      mountedRoots.add(root);
    } else if (isKnownRoot && isUnmounting) {
      mountedRoots.delete(root);
    }
    var rendererInterface = rendererInterfaces.get(rendererID);
    if (rendererInterface != null) {
      rendererInterface.handleCommitFiberRoot(root, priorityLevel);
    }
  }
  function onPostCommitFiberRoot(rendererID, root) {
    var rendererInterface = rendererInterfaces.get(rendererID);
    if (rendererInterface != null) {
      rendererInterface.handlePostCommitFiberRoot(root);
    }
  }
  var isRunningDuringStrictModeInvocation = false;
  function setStrictMode(rendererID, isStrictMode) {
    isRunningDuringStrictModeInvocation = isStrictMode;
    if (isStrictMode) {
      patchConsoleForStrictMode();
    } else {
      unpatchConsoleForStrictMode();
    }
  }
  var unpatchConsoleCallbacks = []; // For StrictMode we patch console once we are running in StrictMode and unpatch right after it
  // So patching could happen multiple times during the runtime
  // Notice how we don't patch error or warn methods, because they are already patched in patchConsoleForErrorsAndWarnings
  // This will only happen once, when hook is installed

  function patchConsoleForStrictMode() {
    // Don't patch console in case settings were not injected
    if (!hook.settings) {
      return;
    } // Don't patch twice

    if (unpatchConsoleCallbacks.length > 0) {
      return;
    } // At this point 'error', 'warn', and 'trace' methods are already patched
    // by React DevTools hook to append component stacks and other possible features.

    var consoleMethodsToOverrideForStrictMode = ['group', 'groupCollapsed', 'info', 'log']; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

    var _loop = function _loop() {
      var method = _consoleMethodsToOver[_i];
      var originalMethod = targetConsole[method];
      var overrideMethod = function overrideMethod() {
        var settings = hook.settings; // Something unexpected happened, fallback to just printing the console message.

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (settings == null) {
          originalMethod.apply(void 0, args);
          return;
        }
        if (settings.hideConsoleLogsInStrictMode) {
          return;
        } // Dim the text color of the double logs if we're not hiding them.
        // Firefox doesn't support ANSI escape sequences

        if (false)
          // removed by dead control flow
          {} else {
          originalMethod.apply(void 0, [ANSI_STYLE_DIMMING_TEMPLATE].concat(hook_toConsumableArray(formatConsoleArguments.apply(void 0, args))));
        }
      };
      targetConsole[method] = overrideMethod;
      unpatchConsoleCallbacks.push(function () {
        targetConsole[method] = originalMethod;
      });
    };
    for (var _i = 0, _consoleMethodsToOver = consoleMethodsToOverrideForStrictMode; _i < _consoleMethodsToOver.length; _i++) {
      _loop();
    }
  }
  function unpatchConsoleForStrictMode() {
    unpatchConsoleCallbacks.forEach(function (callback) {
      return callback();
    });
    unpatchConsoleCallbacks.length = 0;
  }
  var openModuleRangesStack = [];
  var moduleRanges = [];
  function getTopStackFrameString(error) {
    var frames = error.stack.split('\n');
    var frame = frames.length > 1 ? frames[1] : null;
    return frame;
  }
  function getInternalModuleRanges() {
    return moduleRanges;
  }
  function registerInternalModuleStart(error) {
    var startStackFrame = getTopStackFrameString(error);
    if (startStackFrame !== null) {
      openModuleRangesStack.push(startStackFrame);
    }
  }
  function registerInternalModuleStop(error) {
    if (openModuleRangesStack.length > 0) {
      var startStackFrame = openModuleRangesStack.pop();
      var stopStackFrame = getTopStackFrameString(error);
      if (stopStackFrame !== null) {
        // $FlowFixMe[incompatible-call]
        moduleRanges.push([startStackFrame, stopStackFrame]);
      }
    }
  } // For Errors and Warnings we only patch console once

  function patchConsoleForErrorsAndWarnings() {
    // Don't patch console in case settings were not injected
    if (!hook.settings) {
      return;
    }
    var consoleMethodsToOverrideForErrorsAndWarnings = ['error', 'trace', 'warn']; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

    var _loop2 = function _loop2() {
      var method = _consoleMethodsToOver2[_i2];
      var originalMethod = targetConsole[method];
      var overrideMethod = function overrideMethod() {
        var settings = hook.settings; // Something unexpected happened, fallback to just printing the console message.

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        if (settings == null) {
          originalMethod.apply(void 0, args);
          return;
        }
        if (isRunningDuringStrictModeInvocation && settings.hideConsoleLogsInStrictMode) {
          return;
        }
        var injectedComponentStackAsFakeError = false;
        var alreadyHasComponentStack = false;
        if (settings.appendComponentStack) {
          var lastArg = args.length > 0 ? args[args.length - 1] : null;
          alreadyHasComponentStack = typeof lastArg === 'string' && isStringComponentStack(lastArg); // The last argument should be a component stack.
        }
        var shouldShowInlineWarningsAndErrors = settings.showInlineWarningsAndErrors && (method === 'error' || method === 'warn'); // Search for the first renderer that has a current Fiber.
        // We don't handle the edge case of stacks for more than one (e.g. interleaved renderers?)
        // eslint-disable-next-line no-for-of-loops/no-for-of-loops

        var _iterator = hook_createForOfIteratorHelper(hook.rendererInterfaces.values()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var rendererInterface = _step.value;
            var onErrorOrWarning = rendererInterface.onErrorOrWarning,
              getComponentStack = rendererInterface.getComponentStack;
            try {
              if (shouldShowInlineWarningsAndErrors) {
                // patch() is called by two places: (1) the hook and (2) the renderer backend.
                // The backend is what implements a message queue, so it's the only one that injects onErrorOrWarning.
                if (onErrorOrWarning != null) {
                  onErrorOrWarning(method, args.slice());
                }
              }
            } catch (error) {
              // Don't let a DevTools or React internal error interfere with logging.
              setTimeout(function () {
                throw error;
              }, 0);
            }
            try {
              if (settings.appendComponentStack && getComponentStack != null) {
                // This needs to be directly in the wrapper so we can pop exactly one frame.
                var topFrame = Error('react-stack-top-frame');
                var match = getComponentStack(topFrame);
                if (match !== null) {
                  var enableOwnerStacks = match.enableOwnerStacks,
                    componentStack = match.componentStack; // Empty string means we have a match but no component stack.
                  // We don't need to look in other renderers but we also don't add anything.

                  if (componentStack !== '') {
                    // Create a fake Error so that when we print it we get native source maps. Every
                    // browser will print the .stack property of the error and then parse it back for source
                    // mapping. Rather than print the internal slot. So it doesn't matter that the internal
                    // slot doesn't line up.
                    var fakeError = new Error(''); // In Chromium, only the stack property is printed but in Firefox the <name>:<message>
                    // gets printed so to make the colon make sense, we name it so we print Stack:
                    // and similarly Safari leave an expandable slot.

                    if (false)
                      // removed by dead control flow
                      {} else {
                      fakeError.name = enableOwnerStacks ? 'Stack' : 'Component Stack'; // This gets printed
                    } // In Chromium, the stack property needs to start with ^[\w.]*Error\b to trigger stack
                    // formatting. Otherwise it is left alone. So we prefix it. Otherwise we just override it
                    // to our own stack.

                    fakeError.stack = true ? (enableOwnerStacks ? 'Error Stack:' : 'Error Component Stack:') + componentStack : 0;
                    if (alreadyHasComponentStack) {
                      // Only modify the component stack if it matches what we would've added anyway.
                      // Otherwise we assume it was a non-React stack.
                      if (areStackTracesEqual(args[args.length - 1], componentStack)) {
                        var firstArg = args[0];
                        if (args.length > 1 && typeof firstArg === 'string' && firstArg.endsWith('%s')) {
                          args[0] = firstArg.slice(0, firstArg.length - 2); // Strip the %s param
                        }
                        args[args.length - 1] = fakeError;
                        injectedComponentStackAsFakeError = true;
                      }
                    } else {
                      args.push(fakeError);
                      injectedComponentStackAsFakeError = true;
                    }
                  } // Don't add stacks from other renderers.

                  break;
                }
              }
            } catch (error) {
              // Don't let a DevTools or React internal error interfere with logging.
              setTimeout(function () {
                throw error;
              }, 0);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (settings.breakOnConsoleErrors) {
          // --- Welcome to debugging with React DevTools ---
          // This debugger statement means that you've enabled the "break on warnings" feature.
          // Use the browser's Call Stack panel to step out of this override function
          // to where the original warning or error was logged.
          // eslint-disable-next-line no-debugger
          debugger;
        }
        if (isRunningDuringStrictModeInvocation) {
          // Dim the text color of the double logs if we're not hiding them.
          // Firefox doesn't support ANSI escape sequences
          if (false)
            // removed by dead control flow
            {
              var argsWithCSSStyles;
            } else {
            originalMethod.apply(void 0, [injectedComponentStackAsFakeError ? ANSI_STYLE_DIMMING_TEMPLATE_WITH_COMPONENT_STACK : ANSI_STYLE_DIMMING_TEMPLATE].concat(hook_toConsumableArray(formatConsoleArguments.apply(void 0, args))));
          }
        } else {
          originalMethod.apply(void 0, args);
        }
      };
      targetConsole[method] = overrideMethod;
    };
    for (var _i2 = 0, _consoleMethodsToOver2 = consoleMethodsToOverrideForErrorsAndWarnings; _i2 < _consoleMethodsToOver2.length; _i2++) {
      _loop2();
    }
  } // TODO: More meaningful names for "rendererInterfaces" and "renderers".

  var fiberRoots = {};
  var rendererInterfaces = new Map();
  var listeners = {};
  var renderers = new Map();
  var backends = new Map();
  var hook = {
    rendererInterfaces: rendererInterfaces,
    listeners: listeners,
    backends: backends,
    // Fast Refresh for web relies on this.
    renderers: renderers,
    hasUnsupportedRendererAttached: false,
    emit: emit,
    getFiberRoots: getFiberRoots,
    inject: inject,
    on: on,
    off: off,
    sub: sub,
    // This is a legacy flag.
    // React v16 checks the hook for this to ensure DevTools is new enough.
    supportsFiber: true,
    // React Flight Client checks the hook for this to ensure DevTools is new enough.
    supportsFlight: true,
    // React calls these methods.
    checkDCE: checkDCE,
    onCommitFiberUnmount: onCommitFiberUnmount,
    onCommitFiberRoot: onCommitFiberRoot,
    // React v18.0+
    onPostCommitFiberRoot: onPostCommitFiberRoot,
    setStrictMode: setStrictMode,
    // Schedule Profiler runtime helpers.
    // These internal React modules to report their own boundaries
    // which in turn enables the profiler to dim or filter internal frames.
    getInternalModuleRanges: getInternalModuleRanges,
    registerInternalModuleStart: registerInternalModuleStart,
    registerInternalModuleStop: registerInternalModuleStop
  };
  if (maybeSettingsOrSettingsPromise == null) {
    // Set default settings
    hook.settings = {
      appendComponentStack: true,
      breakOnConsoleErrors: false,
      showInlineWarningsAndErrors: true,
      hideConsoleLogsInStrictMode: false
    };
    patchConsoleForErrorsAndWarnings();
  } else {
    Promise.resolve(maybeSettingsOrSettingsPromise).then(function (settings) {
      hook.settings = settings;
      hook.emit('settingsInitialized', settings);
      patchConsoleForErrorsAndWarnings();
    }).catch(function () {
      targetConsole.error("React DevTools failed to get Console Patching settings. Console won't be patched and some console features will not work.");
    });
  }
  Object.defineProperty(target, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    // This property needs to be configurable for the test environment,
    // else we won't be able to delete and recreate it between tests.
    configurable: false,
    enumerable: false,
    get: function get() {
      return hook;
    }
  });
  return hook;
}