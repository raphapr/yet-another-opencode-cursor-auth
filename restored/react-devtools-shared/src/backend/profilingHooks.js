function profilingHooks_slicedToArray(arr, i) {
  return profilingHooks_arrayWithHoles(arr) || profilingHooks_iterableToArrayLimit(arr, i) || profilingHooks_unsupportedIterableToArray(arr, i) || profilingHooks_nonIterableRest();
}
function profilingHooks_nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function profilingHooks_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return profilingHooks_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return profilingHooks_arrayLikeToArray(o, minLen);
}
function profilingHooks_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function profilingHooks_iterableToArrayLimit(arr, i) {
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
function profilingHooks_arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function profilingHooks_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    profilingHooks_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    profilingHooks_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return profilingHooks_typeof(obj);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

// Add padding to the start/stop time of the profile.
// This makes the UI nicer to use.

var TIME_OFFSET = 10;
var performanceTarget = null; // If performance exists and supports the subset of the User Timing API that we require.

var supportsUserTiming = typeof performance !== 'undefined' &&
// $FlowFixMe[method-unbinding]
typeof performance.mark === 'function' &&
// $FlowFixMe[method-unbinding]
typeof performance.clearMarks === 'function';
var supportsUserTimingV3 = false;
if (supportsUserTiming) {
  var CHECK_V3_MARK = '__v3';
  var markOptions = {};
  Object.defineProperty(markOptions, 'startTime', {
    get: function get() {
      supportsUserTimingV3 = true;
      return 0;
    },
    set: function set() {}
  });
  try {
    performance.mark(CHECK_V3_MARK, markOptions);
  } catch (error) {// Ignore
  } finally {
    performance.clearMarks(CHECK_V3_MARK);
  }
}
if (supportsUserTimingV3) {
  performanceTarget = performance;
} // Some environments (e.g. React Native / Hermes) don't support the performance API yet.

var profilingHooks_getCurrentTime =
// $FlowFixMe[method-unbinding]
(typeof performance === "undefined" ? "undefined" : profilingHooks_typeof(performance)) === 'object' && typeof performance.now === 'function' ? function () {
  return performance.now();
} : function () {
  return Date.now();
}; // Mocking the Performance Object (and User Timing APIs) for testing is fragile.
// This API allows tests to directly override the User Timing APIs.

function setPerformanceMock_ONLY_FOR_TESTING(performanceMock) {
  performanceTarget = performanceMock;
  supportsUserTiming = performanceMock !== null;
  supportsUserTimingV3 = performanceMock !== null;
}
function createProfilingHooks(_ref) {
  var getDisplayNameForFiber = _ref.getDisplayNameForFiber,
    getIsProfiling = _ref.getIsProfiling,
    getLaneLabelMap = _ref.getLaneLabelMap,
    workTagMap = _ref.workTagMap,
    currentDispatcherRef = _ref.currentDispatcherRef,
    reactVersion = _ref.reactVersion;
  var currentBatchUID = 0;
  var currentReactComponentMeasure = null;
  var currentReactMeasuresStack = [];
  var currentTimelineData = null;
  var currentFiberStacks = new Map();
  var isProfiling = false;
  var nextRenderShouldStartNewBatch = false;
  function getRelativeTime() {
    var currentTime = profilingHooks_getCurrentTime();
    if (currentTimelineData) {
      if (currentTimelineData.startTime === 0) {
        currentTimelineData.startTime = currentTime - TIME_OFFSET;
      }
      return currentTime - currentTimelineData.startTime;
    }
    return 0;
  }
  function getInternalModuleRanges() {
    /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.getInternalModuleRanges === 'function') {
      // Ask the DevTools hook for module ranges that may have been reported by the current renderer(s).
      // Don't do this eagerly like the laneToLabelMap,
      // because some modules might not yet have registered their boundaries when the renderer is injected.
      var ranges = __REACT_DEVTOOLS_GLOBAL_HOOK__.getInternalModuleRanges(); // This check would not be required,
      // except that it's possible for things to override __REACT_DEVTOOLS_GLOBAL_HOOK__.

      if (shared_isArray(ranges)) {
        return ranges;
      }
    }
    return null;
  }
  function getTimelineData() {
    return currentTimelineData;
  }
  function laneToLanesArray(lanes) {
    var lanesArray = [];
    var lane = 1;
    for (var index = 0; index < REACT_TOTAL_NUM_LANES; index++) {
      if (lane & lanes) {
        lanesArray.push(lane);
      }
      lane *= 2;
    }
    return lanesArray;
  }
  var laneToLabelMap = typeof getLaneLabelMap === 'function' ? getLaneLabelMap() : null;
  function markMetadata() {
    markAndClear("--react-version-".concat(reactVersion));
    markAndClear("--profiler-version-".concat(SCHEDULING_PROFILER_VERSION));
    var ranges = getInternalModuleRanges();
    if (ranges) {
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (shared_isArray(range) && range.length === 2) {
          var _ranges$i = profilingHooks_slicedToArray(ranges[i], 2),
            startStackFrame = _ranges$i[0],
            stopStackFrame = _ranges$i[1];
          markAndClear("--react-internal-module-start-".concat(startStackFrame));
          markAndClear("--react-internal-module-stop-".concat(stopStackFrame));
        }
      }
    }
    if (laneToLabelMap != null) {
      var labels = Array.from(laneToLabelMap.values()).join(',');
      markAndClear("--react-lane-labels-".concat(labels));
    }
  }
  function markAndClear(markName) {
    // This method won't be called unless these functions are defined, so we can skip the extra typeof check.
    performanceTarget.mark(markName);
    performanceTarget.clearMarks(markName);
  }
  function recordReactMeasureStarted(type, lanes) {
    // Decide what depth thi work should be rendered at, based on what's on the top of the stack.
    // It's okay to render over top of "idle" work but everything else should be on its own row.
    var depth = 0;
    if (currentReactMeasuresStack.length > 0) {
      var top = currentReactMeasuresStack[currentReactMeasuresStack.length - 1];
      depth = top.type === 'render-idle' ? top.depth : top.depth + 1;
    }
    var lanesArray = laneToLanesArray(lanes);
    var reactMeasure = {
      type: type,
      batchUID: currentBatchUID,
      depth: depth,
      lanes: lanesArray,
      timestamp: getRelativeTime(),
      duration: 0
    };
    currentReactMeasuresStack.push(reactMeasure);
    if (currentTimelineData) {
      var _currentTimelineData = currentTimelineData,
        batchUIDToMeasuresMap = _currentTimelineData.batchUIDToMeasuresMap,
        laneToReactMeasureMap = _currentTimelineData.laneToReactMeasureMap;
      var reactMeasures = batchUIDToMeasuresMap.get(currentBatchUID);
      if (reactMeasures != null) {
        reactMeasures.push(reactMeasure);
      } else {
        batchUIDToMeasuresMap.set(currentBatchUID, [reactMeasure]);
      }
      lanesArray.forEach(function (lane) {
        reactMeasures = laneToReactMeasureMap.get(lane);
        if (reactMeasures) {
          reactMeasures.push(reactMeasure);
        }
      });
    }
  }
  function recordReactMeasureCompleted(type) {
    var currentTime = getRelativeTime();
    if (currentReactMeasuresStack.length === 0) {
      console.error('Unexpected type "%s" completed at %sms while currentReactMeasuresStack is empty.', type, currentTime); // Ignore work "completion" user timing mark that doesn't complete anything

      return;
    }
    var top = currentReactMeasuresStack.pop(); // $FlowFixMe[incompatible-type]

    if (top.type !== type) {
      console.error('Unexpected type "%s" completed at %sms before "%s" completed.', type, currentTime,
      // $FlowFixMe[incompatible-use]
      top.type);
    } // $FlowFixMe[cannot-write] This property should not be writable outside of this function.
    // $FlowFixMe[incompatible-use]

    top.duration = currentTime - top.timestamp;
    if (currentTimelineData) {
      currentTimelineData.duration = getRelativeTime() + TIME_OFFSET;
    }
  }
  function markCommitStarted(lanes) {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureStarted('commit', lanes); // TODO (timeline) Re-think this approach to "batching"; I don't think it works for Suspense or pre-rendering.
    // This issue applies to the User Timing data also.

    nextRenderShouldStartNewBatch = true;
    if (supportsUserTimingV3) {
      markAndClear("--commit-start-".concat(lanes)); // Some metadata only needs to be logged once per session,
      // but if profiling information is being recorded via the Performance tab,
      // DevTools has no way of knowing when the recording starts.
      // Because of that, we log thie type of data periodically (once per commit).

      markMetadata();
    }
  }
  function markCommitStopped() {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureCompleted('commit');
    recordReactMeasureCompleted('render-idle');
    if (supportsUserTimingV3) {
      markAndClear('--commit-stop');
    }
  }
  function markComponentRenderStarted(fiber) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown'; // TODO (timeline) Record and cache component stack

    currentReactComponentMeasure = {
      componentName: componentName,
      duration: 0,
      timestamp: getRelativeTime(),
      type: 'render',
      warning: null
    };
    if (supportsUserTimingV3) {
      markAndClear("--component-render-start-".concat(componentName));
    }
  }
  function markComponentRenderStopped() {
    if (!isProfiling) {
      return;
    }
    if (currentReactComponentMeasure) {
      if (currentTimelineData) {
        currentTimelineData.componentMeasures.push(currentReactComponentMeasure);
      } // $FlowFixMe[incompatible-use] found when upgrading Flow

      currentReactComponentMeasure.duration =
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      getRelativeTime() - currentReactComponentMeasure.timestamp;
      currentReactComponentMeasure = null;
    }
    if (supportsUserTimingV3) {
      markAndClear('--component-render-stop');
    }
  }
  function markComponentLayoutEffectMountStarted(fiber) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown'; // TODO (timeline) Record and cache component stack

    currentReactComponentMeasure = {
      componentName: componentName,
      duration: 0,
      timestamp: getRelativeTime(),
      type: 'layout-effect-mount',
      warning: null
    };
    if (supportsUserTimingV3) {
      markAndClear("--component-layout-effect-mount-start-".concat(componentName));
    }
  }
  function markComponentLayoutEffectMountStopped() {
    if (!isProfiling) {
      return;
    }
    if (currentReactComponentMeasure) {
      if (currentTimelineData) {
        currentTimelineData.componentMeasures.push(currentReactComponentMeasure);
      } // $FlowFixMe[incompatible-use] found when upgrading Flow

      currentReactComponentMeasure.duration =
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      getRelativeTime() - currentReactComponentMeasure.timestamp;
      currentReactComponentMeasure = null;
    }
    if (supportsUserTimingV3) {
      markAndClear('--component-layout-effect-mount-stop');
    }
  }
  function markComponentLayoutEffectUnmountStarted(fiber) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown'; // TODO (timeline) Record and cache component stack

    currentReactComponentMeasure = {
      componentName: componentName,
      duration: 0,
      timestamp: getRelativeTime(),
      type: 'layout-effect-unmount',
      warning: null
    };
    if (supportsUserTimingV3) {
      markAndClear("--component-layout-effect-unmount-start-".concat(componentName));
    }
  }
  function markComponentLayoutEffectUnmountStopped() {
    if (!isProfiling) {
      return;
    }
    if (currentReactComponentMeasure) {
      if (currentTimelineData) {
        currentTimelineData.componentMeasures.push(currentReactComponentMeasure);
      } // $FlowFixMe[incompatible-use] found when upgrading Flow

      currentReactComponentMeasure.duration =
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      getRelativeTime() - currentReactComponentMeasure.timestamp;
      currentReactComponentMeasure = null;
    }
    if (supportsUserTimingV3) {
      markAndClear('--component-layout-effect-unmount-stop');
    }
  }
  function markComponentPassiveEffectMountStarted(fiber) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown'; // TODO (timeline) Record and cache component stack

    currentReactComponentMeasure = {
      componentName: componentName,
      duration: 0,
      timestamp: getRelativeTime(),
      type: 'passive-effect-mount',
      warning: null
    };
    if (supportsUserTimingV3) {
      markAndClear("--component-passive-effect-mount-start-".concat(componentName));
    }
  }
  function markComponentPassiveEffectMountStopped() {
    if (!isProfiling) {
      return;
    }
    if (currentReactComponentMeasure) {
      if (currentTimelineData) {
        currentTimelineData.componentMeasures.push(currentReactComponentMeasure);
      } // $FlowFixMe[incompatible-use] found when upgrading Flow

      currentReactComponentMeasure.duration =
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      getRelativeTime() - currentReactComponentMeasure.timestamp;
      currentReactComponentMeasure = null;
    }
    if (supportsUserTimingV3) {
      markAndClear('--component-passive-effect-mount-stop');
    }
  }
  function markComponentPassiveEffectUnmountStarted(fiber) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown'; // TODO (timeline) Record and cache component stack

    currentReactComponentMeasure = {
      componentName: componentName,
      duration: 0,
      timestamp: getRelativeTime(),
      type: 'passive-effect-unmount',
      warning: null
    };
    if (supportsUserTimingV3) {
      markAndClear("--component-passive-effect-unmount-start-".concat(componentName));
    }
  }
  function markComponentPassiveEffectUnmountStopped() {
    if (!isProfiling) {
      return;
    }
    if (currentReactComponentMeasure) {
      if (currentTimelineData) {
        currentTimelineData.componentMeasures.push(currentReactComponentMeasure);
      } // $FlowFixMe[incompatible-use] found when upgrading Flow

      currentReactComponentMeasure.duration =
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      getRelativeTime() - currentReactComponentMeasure.timestamp;
      currentReactComponentMeasure = null;
    }
    if (supportsUserTimingV3) {
      markAndClear('--component-passive-effect-unmount-stop');
    }
  }
  function markComponentErrored(fiber, thrownValue, lanes) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown';
    var phase = fiber.alternate === null ? 'mount' : 'update';
    var message = '';
    if (thrownValue !== null && profilingHooks_typeof(thrownValue) === 'object' && typeof thrownValue.message === 'string') {
      message = thrownValue.message;
    } else if (typeof thrownValue === 'string') {
      message = thrownValue;
    } // TODO (timeline) Record and cache component stack

    if (currentTimelineData) {
      currentTimelineData.thrownErrors.push({
        componentName: componentName,
        message: message,
        phase: phase,
        timestamp: getRelativeTime(),
        type: 'thrown-error'
      });
    }
    if (supportsUserTimingV3) {
      markAndClear("--error-".concat(componentName, "-").concat(phase, "-").concat(message));
    }
  }
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map; // $FlowFixMe[incompatible-type]: Flow cannot handle polymorphic WeakMaps

  var wakeableIDs = new PossiblyWeakMap();
  var wakeableID = 0;
  function getWakeableID(wakeable) {
    if (!wakeableIDs.has(wakeable)) {
      wakeableIDs.set(wakeable, wakeableID++);
    }
    return wakeableIDs.get(wakeable);
  }
  function markComponentSuspended(fiber, wakeable, lanes) {
    if (!isProfiling) {
      return;
    }
    var eventType = wakeableIDs.has(wakeable) ? 'resuspend' : 'suspend';
    var id = getWakeableID(wakeable);
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown';
    var phase = fiber.alternate === null ? 'mount' : 'update'; // Following the non-standard fn.displayName convention,
    // frameworks like Relay may also annotate Promises with a displayName,
    // describing what operation/data the thrown Promise is related to.
    // When this is available we should pass it along to the Timeline.

    var displayName = wakeable.displayName || '';
    var suspenseEvent = null; // TODO (timeline) Record and cache component stack

    suspenseEvent = {
      componentName: componentName,
      depth: 0,
      duration: 0,
      id: "".concat(id),
      phase: phase,
      promiseName: displayName,
      resolution: 'unresolved',
      timestamp: getRelativeTime(),
      type: 'suspense',
      warning: null
    };
    if (currentTimelineData) {
      currentTimelineData.suspenseEvents.push(suspenseEvent);
    }
    if (supportsUserTimingV3) {
      markAndClear("--suspense-".concat(eventType, "-").concat(id, "-").concat(componentName, "-").concat(phase, "-").concat(lanes, "-").concat(displayName));
      wakeable.then(function () {
        if (suspenseEvent) {
          suspenseEvent.duration = getRelativeTime() - suspenseEvent.timestamp;
          suspenseEvent.resolution = 'resolved';
        }
        if (supportsUserTimingV3) {
          markAndClear("--suspense-resolved-".concat(id, "-").concat(componentName));
        }
      }, function () {
        if (suspenseEvent) {
          suspenseEvent.duration = getRelativeTime() - suspenseEvent.timestamp;
          suspenseEvent.resolution = 'rejected';
        }
        if (supportsUserTimingV3) {
          markAndClear("--suspense-rejected-".concat(id, "-").concat(componentName));
        }
      });
    }
  }
  function markLayoutEffectsStarted(lanes) {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureStarted('layout-effects', lanes);
    if (supportsUserTimingV3) {
      markAndClear("--layout-effects-start-".concat(lanes));
    }
  }
  function markLayoutEffectsStopped() {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureCompleted('layout-effects');
    if (supportsUserTimingV3) {
      markAndClear('--layout-effects-stop');
    }
  }
  function markPassiveEffectsStarted(lanes) {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureStarted('passive-effects', lanes);
    if (supportsUserTimingV3) {
      markAndClear("--passive-effects-start-".concat(lanes));
    }
  }
  function markPassiveEffectsStopped() {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureCompleted('passive-effects');
    if (supportsUserTimingV3) {
      markAndClear('--passive-effects-stop');
    }
  }
  function markRenderStarted(lanes) {
    if (!isProfiling) {
      return;
    }
    if (nextRenderShouldStartNewBatch) {
      nextRenderShouldStartNewBatch = false;
      currentBatchUID++;
    } // If this is a new batch of work, wrap an "idle" measure around it.
    // Log it before the "render" measure to preserve the stack ordering.

    if (currentReactMeasuresStack.length === 0 || currentReactMeasuresStack[currentReactMeasuresStack.length - 1].type !== 'render-idle') {
      recordReactMeasureStarted('render-idle', lanes);
    }
    recordReactMeasureStarted('render', lanes);
    if (supportsUserTimingV3) {
      markAndClear("--render-start-".concat(lanes));
    }
  }
  function markRenderYielded() {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureCompleted('render');
    if (supportsUserTimingV3) {
      markAndClear('--render-yield');
    }
  }
  function markRenderStopped() {
    if (!isProfiling) {
      return;
    }
    recordReactMeasureCompleted('render');
    if (supportsUserTimingV3) {
      markAndClear('--render-stop');
    }
  }
  function markRenderScheduled(lane) {
    if (!isProfiling) {
      return;
    }
    if (currentTimelineData) {
      currentTimelineData.schedulingEvents.push({
        lanes: laneToLanesArray(lane),
        timestamp: getRelativeTime(),
        type: 'schedule-render',
        warning: null
      });
    }
    if (supportsUserTimingV3) {
      markAndClear("--schedule-render-".concat(lane));
    }
  }
  function markForceUpdateScheduled(fiber, lane) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown'; // TODO (timeline) Record and cache component stack

    if (currentTimelineData) {
      currentTimelineData.schedulingEvents.push({
        componentName: componentName,
        lanes: laneToLanesArray(lane),
        timestamp: getRelativeTime(),
        type: 'schedule-force-update',
        warning: null
      });
    }
    if (supportsUserTimingV3) {
      markAndClear("--schedule-forced-update-".concat(lane, "-").concat(componentName));
    }
  }
  function getParentFibers(fiber) {
    var parents = [];
    var parent = fiber;
    while (parent !== null) {
      parents.push(parent);
      parent = parent.return;
    }
    return parents;
  }
  function markStateUpdateScheduled(fiber, lane) {
    if (!isProfiling) {
      return;
    }
    var componentName = getDisplayNameForFiber(fiber) || 'Unknown'; // TODO (timeline) Record and cache component stack

    if (currentTimelineData) {
      var event = {
        componentName: componentName,
        // Store the parent fibers so we can post process
        // them after we finish profiling
        lanes: laneToLanesArray(lane),
        timestamp: getRelativeTime(),
        type: 'schedule-state-update',
        warning: null
      };
      currentFiberStacks.set(event, getParentFibers(fiber)); // $FlowFixMe[incompatible-use] found when upgrading Flow

      currentTimelineData.schedulingEvents.push(event);
    }
    if (supportsUserTimingV3) {
      markAndClear("--schedule-state-update-".concat(lane, "-").concat(componentName));
    }
  }
  function toggleProfilingStatus(value) {
    var recordTimeline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (isProfiling !== value) {
      isProfiling = value;
      if (isProfiling) {
        var internalModuleSourceToRanges = new Map();
        if (supportsUserTimingV3) {
          var ranges = getInternalModuleRanges();
          if (ranges) {
            for (var i = 0; i < ranges.length; i++) {
              var range = ranges[i];
              if (shared_isArray(range) && range.length === 2) {
                var _ranges$i2 = profilingHooks_slicedToArray(ranges[i], 2),
                  startStackFrame = _ranges$i2[0],
                  stopStackFrame = _ranges$i2[1];
                markAndClear("--react-internal-module-start-".concat(startStackFrame));
                markAndClear("--react-internal-module-stop-".concat(stopStackFrame));
              }
            }
          }
        }
        var laneToReactMeasureMap = new Map();
        var lane = 1;
        for (var index = 0; index < REACT_TOTAL_NUM_LANES; index++) {
          laneToReactMeasureMap.set(lane, []);
          lane *= 2;
        }
        currentBatchUID = 0;
        currentReactComponentMeasure = null;
        currentReactMeasuresStack = [];
        currentFiberStacks = new Map();
        if (recordTimeline) {
          currentTimelineData = {
            // Session wide metadata; only collected once.
            internalModuleSourceToRanges: internalModuleSourceToRanges,
            laneToLabelMap: laneToLabelMap || new Map(),
            reactVersion: reactVersion,
            // Data logged by React during profiling session.
            componentMeasures: [],
            schedulingEvents: [],
            suspenseEvents: [],
            thrownErrors: [],
            // Data inferred based on what React logs.
            batchUIDToMeasuresMap: new Map(),
            duration: 0,
            laneToReactMeasureMap: laneToReactMeasureMap,
            startTime: 0,
            // Data only available in Chrome profiles.
            flamechart: [],
            nativeEvents: [],
            networkMeasures: [],
            otherUserTimingMarks: [],
            snapshots: [],
            snapshotHeight: 0
          };
        }
        nextRenderShouldStartNewBatch = true;
      } else {
        // This is __EXPENSIVE__.
        // We could end up with hundreds of state updated, and for each one of them
        // would try to create a component stack with possibly hundreds of Fibers.
        // Creating a cache of component stacks won't help, generating a single stack is already expensive enough.
        // We should find a way to lazily generate component stacks on demand, when user inspects a specific event.
        // If we succeed with moving React DevTools Timeline Profiler to Performance panel, then Timeline Profiler would probably be removed.
        // Now that owner stacks are adopted, revisit this again and cache component stacks per Fiber,
        // but only return them when needed, sending hundreds of component stacks is beyond the Bridge's bandwidth.
        // Postprocess Profile data
        if (currentTimelineData !== null) {
          currentTimelineData.schedulingEvents.forEach(function (event) {
            if (event.type === 'schedule-state-update') {
              // TODO(luna): We can optimize this by creating a map of
              // fiber to component stack instead of generating the stack
              // for every fiber every time
              var fiberStack = currentFiberStacks.get(event);
              if (fiberStack && currentDispatcherRef != null) {
                event.componentStack = fiberStack.reduce(function (trace, fiber) {
                  return trace + describeFiber(workTagMap, fiber, currentDispatcherRef);
                }, '');
              }
            }
          });
        } // Clear the current fiber stacks so we don't hold onto the fibers
        // in memory after profiling finishes

        currentFiberStacks.clear();
      }
    }
  }
  return {
    getTimelineData: getTimelineData,
    profilingHooks: {
      markCommitStarted: markCommitStarted,
      markCommitStopped: markCommitStopped,
      markComponentRenderStarted: markComponentRenderStarted,
      markComponentRenderStopped: markComponentRenderStopped,
      markComponentPassiveEffectMountStarted: markComponentPassiveEffectMountStarted,
      markComponentPassiveEffectMountStopped: markComponentPassiveEffectMountStopped,
      markComponentPassiveEffectUnmountStarted: markComponentPassiveEffectUnmountStarted,
      markComponentPassiveEffectUnmountStopped: markComponentPassiveEffectUnmountStopped,
      markComponentLayoutEffectMountStarted: markComponentLayoutEffectMountStarted,
      markComponentLayoutEffectMountStopped: markComponentLayoutEffectMountStopped,
      markComponentLayoutEffectUnmountStarted: markComponentLayoutEffectUnmountStarted,
      markComponentLayoutEffectUnmountStopped: markComponentLayoutEffectUnmountStopped,
      markComponentErrored: markComponentErrored,
      markComponentSuspended: markComponentSuspended,
      markLayoutEffectsStarted: markLayoutEffectsStarted,
      markLayoutEffectsStopped: markLayoutEffectsStopped,
      markPassiveEffectsStarted: markPassiveEffectsStarted,
      markPassiveEffectsStopped: markPassiveEffectsStopped,
      markRenderStarted: markRenderStarted,
      markRenderYielded: markRenderYielded,
      markRenderStopped: markRenderStopped,
      markRenderScheduled: markRenderScheduled,
      markForceUpdateScheduled: markForceUpdateScheduled,
      markStateUpdateScheduled: markStateUpdateScheduled
    },
    toggleProfilingStatus: toggleProfilingStatus
  };
}