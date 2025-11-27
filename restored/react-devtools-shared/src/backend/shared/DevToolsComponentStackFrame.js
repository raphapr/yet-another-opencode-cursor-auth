function DevToolsComponentStackFrame_slicedToArray(arr, i) {
  return DevToolsComponentStackFrame_arrayWithHoles(arr) || DevToolsComponentStackFrame_iterableToArrayLimit(arr, i) || DevToolsComponentStackFrame_unsupportedIterableToArray(arr, i) || DevToolsComponentStackFrame_nonIterableRest();
}
function DevToolsComponentStackFrame_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function DevToolsComponentStackFrame_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return DevToolsComponentStackFrame_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DevToolsComponentStackFrame_arrayLikeToArray(o, minLen);
}
function DevToolsComponentStackFrame_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function DevToolsComponentStackFrame_iterableToArrayLimit(arr, i) {
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
function DevToolsComponentStackFrame_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function DevToolsComponentStackFrame_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    DevToolsComponentStackFrame_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    DevToolsComponentStackFrame_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return DevToolsComponentStackFrame_typeof(obj);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// This is a DevTools fork of ReactComponentStackFrame.
// This fork enables DevTools to use the same "native" component stack format,
// while still maintaining support for multiple renderer versions
// (which use different values for ReactTypeOfWork).
// The shared console patching code is DEV-only.
// We can't use it since DevTools only ships production builds.

var prefix;
function describeBuiltInComponentFrame(name) {
  if (prefix === undefined) {
    // Extract the VM specific prefix used by each line.
    try {
      throw Error();
    } catch (x) {
      var match = x.stack.trim().match(/\n( *(at )?)/);
      prefix = match && match[1] || '';
    }
  }
  var suffix = '';
  if (true) {
    suffix = ' (<anonymous>)';
  } else
    // removed by dead control flow
    {} // We use the prefix to ensure our stacks line up with native stack frames.
  // We use a suffix to ensure it gets parsed natively.

  return '\n' + prefix + name + suffix;
}
function describeDebugInfoFrame(name, env) {
  return describeBuiltInComponentFrame(name + (env ? ' [' + env + ']' : ''));
}
var reentry = false;
var componentFrameCache;
if (false)
  // removed by dead control flow
  {
    var PossiblyWeakMap;
  }
function describeNativeComponentFrame(fn, construct, currentDispatcherRef) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if (!fn || reentry) {
    return '';
  }
  if (false)
    // removed by dead control flow
    {
      var frame;
    }
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe[incompatible-type] It does accept undefined.

  Error.prepareStackTrace = undefined;
  reentry = true; // Override the dispatcher so effects scheduled by this shallow render are thrown away.
  //
  // Note that unlike the code this was forked from (in ReactComponentStackFrame)
  // DevTools should override the dispatcher even when DevTools is compiled in production mode,
  // because the app itself may be in development mode and log errors/warnings.

  var previousDispatcher = currentDispatcherRef.H;
  currentDispatcherRef.H = null;
  disableLogs();
  try {
    // NOTE: keep in sync with the implementation in ReactComponentStackFrame

    /**
     * Finding a common stack frame between sample and control errors can be
     * tricky given the different types and levels of stack trace truncation from
     * different JS VMs. So instead we'll attempt to control what that common
     * frame should be through this object method:
     * Having both the sample and control errors be in the function under the
     * `DescribeNativeComponentFrameRoot` property, + setting the `name` and
     * `displayName` properties of the function ensures that a stack
     * frame exists that has the method name `DescribeNativeComponentFrameRoot` in
     * it for both control and sample stacks.
     */
    var RunInRootFrame = {
      DetermineComponentFrameRoot: function DetermineComponentFrameRoot() {
        var control;
        try {
          // This should throw.
          if (construct) {
            // Something should be setting the props in the constructor.
            var Fake = function Fake() {
              throw Error();
            }; // $FlowFixMe[prop-missing]

            Object.defineProperty(Fake.prototype, 'props', {
              set: function set() {
                // We use a throwing setter instead of frozen or non-writable props
                // because that won't throw in a non-strict mode function.
                throw Error();
              }
            });
            if ((typeof Reflect === "undefined" ? "undefined" : DevToolsComponentStackFrame_typeof(Reflect)) === 'object' && Reflect.construct) {
              // We construct a different control for this case to include any extra
              // frames added by the construct call.
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x) {
                control = x;
              } // $FlowFixMe[prop-missing] found when upgrading Flow

              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              control = x;
            } // TODO(luna): This will currently only throw if the function component
            // tries to access React/ReactDOM/props. We should probably make this throw
            // in simple components too

            var maybePromise = fn(); // If the function component returns a promise, it's likely an async
            // component, which we don't yet support. Attach a noop catch handler to
            // silence the error.
            // TODO: Implement component stacks for async client components?

            if (maybePromise && typeof maybePromise.catch === 'function') {
              maybePromise.catch(function () {});
            }
          }
        } catch (sample) {
          // This is inlined manually because closure doesn't do it for us.
          if (sample && control && typeof sample.stack === 'string') {
            return [sample.stack, control.stack];
          }
        }
        return [null, null];
      }
    }; // $FlowFixMe[prop-missing]

    RunInRootFrame.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
    var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, 'name'); // Before ES6, the `name` property was not configurable.

    if (namePropDescriptor && namePropDescriptor.configurable) {
      // V8 utilizes a function's `name` property when generating a stack trace.
      Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot,
      // Configurable properties can be updated even if its writable descriptor
      // is set to `false`.
      // $FlowFixMe[cannot-write]
      'name', {
        value: 'DetermineComponentFrameRoot'
      });
    }
    var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
      _RunInRootFrame$Deter2 = DevToolsComponentStackFrame_slicedToArray(_RunInRootFrame$Deter, 2),
      sampleStack = _RunInRootFrame$Deter2[0],
      controlStack = _RunInRootFrame$Deter2[1];
    if (sampleStack && controlStack) {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sampleStack.split('\n');
      var controlLines = controlStack.split('\n');
      var s = 0;
      var c = 0;
      while (s < sampleLines.length && !sampleLines[s].includes('DetermineComponentFrameRoot')) {
        s++;
      }
      while (c < controlLines.length && !controlLines[c].includes('DetermineComponentFrameRoot')) {
        c++;
      } // We couldn't find our intentionally injected common root frame, attempt
      // to find another common root frame by search from the bottom of the
      // control stack...

      if (s === sampleLines.length || c === controlLines.length) {
        s = sampleLines.length - 1;
        c = controlLines.length - 1;
        while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
          // We expect at least one stack frame to be shared.
          // Typically this will be the root most one. However, stack frames may be
          // cut off due to maximum stack limits. In this case, one maybe cut off
          // earlier than the other. We assume that the sample is longer or the same
          // and there for cut off earlier. So we should find the root most frame in
          // the sample somewhere in the control.
          c--;
        }
      }
      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.

                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }
                if (false)
                  // removed by dead control flow
                  {} // Return the line we found.

                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }
          break;
        }
      }
    }
  } finally {
    reentry = false;
    Error.prepareStackTrace = previousPrepareStackTrace;
    currentDispatcherRef.H = previousDispatcher;
    reenableLogs();
  } // Fallback to just using the name if we couldn't make it throw.

  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';
  if (false)
    // removed by dead control flow
    {}
  return syntheticFrame;
}
function describeClassComponentFrame(ctor, currentDispatcherRef) {
  return describeNativeComponentFrame(ctor, true, currentDispatcherRef);
}
function describeFunctionComponentFrame(fn, currentDispatcherRef) {
  return describeNativeComponentFrame(fn, false, currentDispatcherRef);
}