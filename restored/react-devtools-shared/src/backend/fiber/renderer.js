function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function renderer_ownKeys(object, enumerableOnly) {
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
function renderer_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      renderer_ownKeys(Object(source), true).forEach(function (key) {
        renderer_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      renderer_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function renderer_defineProperty(obj, key, value) {
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
function fiber_renderer_toConsumableArray(arr) {
  return fiber_renderer_arrayWithoutHoles(arr) || fiber_renderer_iterableToArray(arr) || fiber_renderer_unsupportedIterableToArray(arr) || fiber_renderer_nonIterableSpread();
}
function fiber_renderer_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function fiber_renderer_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function fiber_renderer_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return fiber_renderer_arrayLikeToArray(arr);
}
function renderer_createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = fiber_renderer_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
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
function fiber_renderer_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return fiber_renderer_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return fiber_renderer_arrayLikeToArray(o, minLen);
}
function fiber_renderer_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function renderer_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    renderer_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    renderer_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return renderer_typeof(obj);
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

var renderer_toString = Object.prototype.toString;
function renderer_isError(object) {
  return renderer_toString.call(object) === '[object Error]';
}

// Kinds

var FIBER_INSTANCE = 0;
var VIRTUAL_INSTANCE = 1;
var FILTERED_FIBER_INSTANCE = 2; // This type represents a stateful instance of a Client Component i.e. a Fiber pair.
// These instances also let us track stateful DevTools meta data like id and warnings.

function createFiberInstance(fiber) {
  return {
    kind: FIBER_INSTANCE,
    id: getUID(),
    parent: null,
    firstChild: null,
    nextSibling: null,
    source: null,
    logCount: 0,
    treeBaseDuration: 0,
    data: fiber
  };
}

// This is used to represent a filtered Fiber but still lets us find its host instance.
function createFilteredFiberInstance(fiber) {
  return {
    kind: FILTERED_FIBER_INSTANCE,
    id: 0,
    parent: null,
    firstChild: null,
    nextSibling: null,
    source: null,
    logCount: 0,
    treeBaseDuration: 0,
    data: fiber
  };
} // This type represents a stateful instance of a Server Component or a Component
// that gets optimized away - e.g. call-through without creating a Fiber.
// It's basically a virtual Fiber. This is not a semantic concept in React.
// It only exists as a virtual concept to let the same Element in the DevTools
// persist. To be selectable separately from all ReactComponentInfo and overtime.

function createVirtualInstance(debugEntry) {
  return {
    kind: VIRTUAL_INSTANCE,
    id: getUID(),
    parent: null,
    firstChild: null,
    nextSibling: null,
    source: null,
    logCount: 0,
    treeBaseDuration: 0,
    data: debugEntry
  };
}
function getDispatcherRef(renderer) {
  if (renderer.currentDispatcherRef === undefined) {
    return undefined;
  }
  var injectedRef = renderer.currentDispatcherRef;
  if (typeof injectedRef.H === 'undefined' && typeof injectedRef.current !== 'undefined') {
    // We got a legacy dispatcher injected, let's create a wrapper proxy to translate.
    return {
      get H() {
        return injectedRef.current;
      },
      set H(value) {
        injectedRef.current = value;
      }
    };
  }
  return injectedRef;
}
function getFiberFlags(fiber) {
  // The name of this field changed from "effectTag" to "flags"
  return fiber.flags !== undefined ? fiber.flags : fiber.effectTag;
} // Some environments (e.g. React Native / Hermes) don't support the performance API yet.

var renderer_getCurrentTime =
// $FlowFixMe[method-unbinding]
(typeof performance === "undefined" ? "undefined" : renderer_typeof(performance)) === 'object' && typeof performance.now === 'function' ? function () {
  return performance.now();
} : function () {
  return Date.now();
};
function getInternalReactConstants(version) {
  // **********************************************************
  // The section below is copied from files in React repo.
  // Keep it in sync, and add version guards if it changes.
  //
  // Technically these priority levels are invalid for versions before 16.9,
  // but 16.9 is the first version to report priority level to DevTools,
  // so we can avoid checking for earlier versions and support pre-16.9 canary releases in the process.
  var ReactPriorityLevels = {
    ImmediatePriority: 99,
    UserBlockingPriority: 98,
    NormalPriority: 97,
    LowPriority: 96,
    IdlePriority: 95,
    NoPriority: 90
  };
  if (gt(version, '17.0.2')) {
    ReactPriorityLevels = {
      ImmediatePriority: 1,
      UserBlockingPriority: 2,
      NormalPriority: 3,
      LowPriority: 4,
      IdlePriority: 5,
      NoPriority: 0
    };
  }
  var StrictModeBits = 0;
  if (gte(version, '18.0.0-alpha')) {
    // 18+
    StrictModeBits = 24;
  } else if (gte(version, '16.9.0')) {
    // 16.9 - 17
    StrictModeBits = 1;
  } else if (gte(version, '16.3.0')) {
    // 16.3 - 16.8
    StrictModeBits = 2;
  }
  var ReactTypeOfWork = null; // **********************************************************
  // The section below is copied from files in React repo.
  // Keep it in sync, and add version guards if it changes.
  //
  // TODO Update the gt() check below to be gte() whichever the next version number is.
  // Currently the version in Git is 17.0.2 (but that version has not been/may not end up being released).

  if (gt(version, '17.0.1')) {
    ReactTypeOfWork = {
      CacheComponent: 24,
      // Experimental
      ClassComponent: 1,
      ContextConsumer: 9,
      ContextProvider: 10,
      CoroutineComponent: -1,
      // Removed
      CoroutineHandlerPhase: -1,
      // Removed
      DehydratedSuspenseComponent: 18,
      // Behind a flag
      ForwardRef: 11,
      Fragment: 7,
      FunctionComponent: 0,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostHoistable: 26,
      // In reality, 18.2+. But doesn't hurt to include it here
      HostSingleton: 27,
      // Same as above
      HostText: 6,
      IncompleteClassComponent: 17,
      IncompleteFunctionComponent: 28,
      IndeterminateComponent: 2,
      // removed in 19.0.0
      LazyComponent: 16,
      LegacyHiddenComponent: 23,
      MemoComponent: 14,
      Mode: 8,
      OffscreenComponent: 22,
      // Experimental
      Profiler: 12,
      ScopeComponent: 21,
      // Experimental
      SimpleMemoComponent: 15,
      SuspenseComponent: 13,
      SuspenseListComponent: 19,
      // Experimental
      TracingMarkerComponent: 25,
      // Experimental - This is technically in 18 but we don't
      // want to fork again so we're adding it here instead
      YieldComponent: -1,
      // Removed
      Throw: 29,
      ViewTransitionComponent: 30,
      // Experimental
      ActivityComponent: 31
    };
  } else if (gte(version, '17.0.0-alpha')) {
    ReactTypeOfWork = {
      CacheComponent: -1,
      // Doesn't exist yet
      ClassComponent: 1,
      ContextConsumer: 9,
      ContextProvider: 10,
      CoroutineComponent: -1,
      // Removed
      CoroutineHandlerPhase: -1,
      // Removed
      DehydratedSuspenseComponent: 18,
      // Behind a flag
      ForwardRef: 11,
      Fragment: 7,
      FunctionComponent: 0,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostHoistable: -1,
      // Doesn't exist yet
      HostSingleton: -1,
      // Doesn't exist yet
      HostText: 6,
      IncompleteClassComponent: 17,
      IncompleteFunctionComponent: -1,
      // Doesn't exist yet
      IndeterminateComponent: 2,
      LazyComponent: 16,
      LegacyHiddenComponent: 24,
      MemoComponent: 14,
      Mode: 8,
      OffscreenComponent: 23,
      // Experimental
      Profiler: 12,
      ScopeComponent: 21,
      // Experimental
      SimpleMemoComponent: 15,
      SuspenseComponent: 13,
      SuspenseListComponent: 19,
      // Experimental
      TracingMarkerComponent: -1,
      // Doesn't exist yet
      YieldComponent: -1,
      // Removed
      Throw: -1,
      // Doesn't exist yet
      ViewTransitionComponent: -1,
      // Doesn't exist yet
      ActivityComponent: -1 // Doesn't exist yet
    };
  } else if (gte(version, '16.6.0-beta.0')) {
    ReactTypeOfWork = {
      CacheComponent: -1,
      // Doesn't exist yet
      ClassComponent: 1,
      ContextConsumer: 9,
      ContextProvider: 10,
      CoroutineComponent: -1,
      // Removed
      CoroutineHandlerPhase: -1,
      // Removed
      DehydratedSuspenseComponent: 18,
      // Behind a flag
      ForwardRef: 11,
      Fragment: 7,
      FunctionComponent: 0,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostHoistable: -1,
      // Doesn't exist yet
      HostSingleton: -1,
      // Doesn't exist yet
      HostText: 6,
      IncompleteClassComponent: 17,
      IncompleteFunctionComponent: -1,
      // Doesn't exist yet
      IndeterminateComponent: 2,
      LazyComponent: 16,
      LegacyHiddenComponent: -1,
      MemoComponent: 14,
      Mode: 8,
      OffscreenComponent: -1,
      // Experimental
      Profiler: 12,
      ScopeComponent: -1,
      // Experimental
      SimpleMemoComponent: 15,
      SuspenseComponent: 13,
      SuspenseListComponent: 19,
      // Experimental
      TracingMarkerComponent: -1,
      // Doesn't exist yet
      YieldComponent: -1,
      // Removed
      Throw: -1,
      // Doesn't exist yet
      ViewTransitionComponent: -1,
      // Doesn't exist yet
      ActivityComponent: -1 // Doesn't exist yet
    };
  } else if (gte(version, '16.4.3-alpha')) {
    ReactTypeOfWork = {
      CacheComponent: -1,
      // Doesn't exist yet
      ClassComponent: 2,
      ContextConsumer: 11,
      ContextProvider: 12,
      CoroutineComponent: -1,
      // Removed
      CoroutineHandlerPhase: -1,
      // Removed
      DehydratedSuspenseComponent: -1,
      // Doesn't exist yet
      ForwardRef: 13,
      Fragment: 9,
      FunctionComponent: 0,
      HostComponent: 7,
      HostPortal: 6,
      HostRoot: 5,
      HostHoistable: -1,
      // Doesn't exist yet
      HostSingleton: -1,
      // Doesn't exist yet
      HostText: 8,
      IncompleteClassComponent: -1,
      // Doesn't exist yet
      IncompleteFunctionComponent: -1,
      // Doesn't exist yet
      IndeterminateComponent: 4,
      LazyComponent: -1,
      // Doesn't exist yet
      LegacyHiddenComponent: -1,
      MemoComponent: -1,
      // Doesn't exist yet
      Mode: 10,
      OffscreenComponent: -1,
      // Experimental
      Profiler: 15,
      ScopeComponent: -1,
      // Experimental
      SimpleMemoComponent: -1,
      // Doesn't exist yet
      SuspenseComponent: 16,
      SuspenseListComponent: -1,
      // Doesn't exist yet
      TracingMarkerComponent: -1,
      // Doesn't exist yet
      YieldComponent: -1,
      // Removed
      Throw: -1,
      // Doesn't exist yet
      ViewTransitionComponent: -1,
      // Doesn't exist yet
      ActivityComponent: -1 // Doesn't exist yet
    };
  } else {
    ReactTypeOfWork = {
      CacheComponent: -1,
      // Doesn't exist yet
      ClassComponent: 2,
      ContextConsumer: 12,
      ContextProvider: 13,
      CoroutineComponent: 7,
      CoroutineHandlerPhase: 8,
      DehydratedSuspenseComponent: -1,
      // Doesn't exist yet
      ForwardRef: 14,
      Fragment: 10,
      FunctionComponent: 1,
      HostComponent: 5,
      HostPortal: 4,
      HostRoot: 3,
      HostHoistable: -1,
      // Doesn't exist yet
      HostSingleton: -1,
      // Doesn't exist yet
      HostText: 6,
      IncompleteClassComponent: -1,
      // Doesn't exist yet
      IncompleteFunctionComponent: -1,
      // Doesn't exist yet
      IndeterminateComponent: 0,
      LazyComponent: -1,
      // Doesn't exist yet
      LegacyHiddenComponent: -1,
      MemoComponent: -1,
      // Doesn't exist yet
      Mode: 11,
      OffscreenComponent: -1,
      // Experimental
      Profiler: 15,
      ScopeComponent: -1,
      // Experimental
      SimpleMemoComponent: -1,
      // Doesn't exist yet
      SuspenseComponent: 16,
      SuspenseListComponent: -1,
      // Doesn't exist yet
      TracingMarkerComponent: -1,
      // Doesn't exist yet
      YieldComponent: 9,
      Throw: -1,
      // Doesn't exist yet
      ViewTransitionComponent: -1,
      // Doesn't exist yet
      ActivityComponent: -1 // Doesn't exist yet
    };
  } // **********************************************************
  // End of copied code.
  // **********************************************************

  function getTypeSymbol(type) {
    var symbolOrNumber = renderer_typeof(type) === 'object' && type !== null ? type.$$typeof : type;
    return renderer_typeof(symbolOrNumber) === 'symbol' ? symbolOrNumber.toString() : symbolOrNumber;
  }
  var _ReactTypeOfWork = ReactTypeOfWork,
    CacheComponent = _ReactTypeOfWork.CacheComponent,
    ClassComponent = _ReactTypeOfWork.ClassComponent,
    IncompleteClassComponent = _ReactTypeOfWork.IncompleteClassComponent,
    IncompleteFunctionComponent = _ReactTypeOfWork.IncompleteFunctionComponent,
    FunctionComponent = _ReactTypeOfWork.FunctionComponent,
    IndeterminateComponent = _ReactTypeOfWork.IndeterminateComponent,
    ForwardRef = _ReactTypeOfWork.ForwardRef,
    HostRoot = _ReactTypeOfWork.HostRoot,
    HostHoistable = _ReactTypeOfWork.HostHoistable,
    HostSingleton = _ReactTypeOfWork.HostSingleton,
    HostComponent = _ReactTypeOfWork.HostComponent,
    HostPortal = _ReactTypeOfWork.HostPortal,
    HostText = _ReactTypeOfWork.HostText,
    Fragment = _ReactTypeOfWork.Fragment,
    LazyComponent = _ReactTypeOfWork.LazyComponent,
    LegacyHiddenComponent = _ReactTypeOfWork.LegacyHiddenComponent,
    MemoComponent = _ReactTypeOfWork.MemoComponent,
    OffscreenComponent = _ReactTypeOfWork.OffscreenComponent,
    Profiler = _ReactTypeOfWork.Profiler,
    ScopeComponent = _ReactTypeOfWork.ScopeComponent,
    SimpleMemoComponent = _ReactTypeOfWork.SimpleMemoComponent,
    SuspenseComponent = _ReactTypeOfWork.SuspenseComponent,
    SuspenseListComponent = _ReactTypeOfWork.SuspenseListComponent,
    TracingMarkerComponent = _ReactTypeOfWork.TracingMarkerComponent,
    Throw = _ReactTypeOfWork.Throw,
    ViewTransitionComponent = _ReactTypeOfWork.ViewTransitionComponent,
    ActivityComponent = _ReactTypeOfWork.ActivityComponent;
  function resolveFiberType(type) {
    var typeSymbol = getTypeSymbol(type);
    switch (typeSymbol) {
      case MEMO_NUMBER:
      case MEMO_SYMBOL_STRING:
        // recursively resolving memo type in case of memo(forwardRef(Component))
        return resolveFiberType(type.type);
      case FORWARD_REF_NUMBER:
      case FORWARD_REF_SYMBOL_STRING:
        return type.render;
      default:
        return type;
    }
  } // NOTICE Keep in sync with shouldFilterFiber() and other get*ForFiber methods

  function getDisplayNameForFiber(fiber) {
    var _fiber$updateQueue, _fiber$memoizedState, _fiber$memoizedState$, _fiber$memoizedState2, _fiber$memoizedState3;
    var shouldSkipForgetCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var elementType = fiber.elementType,
      type = fiber.type,
      tag = fiber.tag;
    var resolvedType = type;
    if (renderer_typeof(type) === 'object' && type !== null) {
      resolvedType = resolveFiberType(type);
    }
    var resolvedContext = null;
    if (!shouldSkipForgetCheck && (
    // $FlowFixMe[incompatible-type] fiber.updateQueue is mixed
    ((_fiber$updateQueue = fiber.updateQueue) === null || _fiber$updateQueue === void 0 ? void 0 : _fiber$updateQueue.memoCache) != null || Array.isArray((_fiber$memoizedState = fiber.memoizedState) === null || _fiber$memoizedState === void 0 ? void 0 : _fiber$memoizedState.memoizedState) && ((_fiber$memoizedState$ = fiber.memoizedState.memoizedState[0]) === null || _fiber$memoizedState$ === void 0 ? void 0 : _fiber$memoizedState$[ReactSymbols_REACT_MEMO_CACHE_SENTINEL]) || ((_fiber$memoizedState2 = fiber.memoizedState) === null || _fiber$memoizedState2 === void 0 ? void 0 : (_fiber$memoizedState3 = _fiber$memoizedState2.memoizedState) === null || _fiber$memoizedState3 === void 0 ? void 0 : _fiber$memoizedState3[ReactSymbols_REACT_MEMO_CACHE_SENTINEL]))) {
      var displayNameWithoutForgetWrapper = getDisplayNameForFiber(fiber, true);
      if (displayNameWithoutForgetWrapper == null) {
        return null;
      }
      return "Forget(".concat(displayNameWithoutForgetWrapper, ")");
    }
    switch (tag) {
      case ActivityComponent:
        return 'Activity';
      case CacheComponent:
        return 'Cache';
      case ClassComponent:
      case IncompleteClassComponent:
      case IncompleteFunctionComponent:
      case FunctionComponent:
      case IndeterminateComponent:
        return getDisplayName(resolvedType);
      case ForwardRef:
        return getWrappedDisplayName(elementType, resolvedType, 'ForwardRef', 'Anonymous');
      case HostRoot:
        var fiberRoot = fiber.stateNode;
        if (fiberRoot != null && fiberRoot._debugRootType !== null) {
          return fiberRoot._debugRootType;
        }
        return null;
      case HostComponent:
      case HostSingleton:
      case HostHoistable:
        return type;
      case HostPortal:
      case HostText:
        return null;
      case Fragment:
        return 'Fragment';
      case LazyComponent:
        // This display name will not be user visible.
        // Once a Lazy component loads its inner component, React replaces the tag and type.
        // This display name will only show up in console logs when DevTools DEBUG mode is on.
        return 'Lazy';
      case MemoComponent:
      case SimpleMemoComponent:
        // Display name in React does not use `Memo` as a wrapper but fallback name.
        return getWrappedDisplayName(elementType, resolvedType, 'Memo', 'Anonymous');
      case SuspenseComponent:
        return 'Suspense';
      case LegacyHiddenComponent:
        return 'LegacyHidden';
      case OffscreenComponent:
        return 'Offscreen';
      case ScopeComponent:
        return 'Scope';
      case SuspenseListComponent:
        return 'SuspenseList';
      case Profiler:
        return 'Profiler';
      case TracingMarkerComponent:
        return 'TracingMarker';
      case ViewTransitionComponent:
        return 'ViewTransition';
      case Throw:
        // This should really never be visible.
        return 'Error';
      default:
        var typeSymbol = getTypeSymbol(type);
        switch (typeSymbol) {
          case CONCURRENT_MODE_NUMBER:
          case CONCURRENT_MODE_SYMBOL_STRING:
          case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
            return null;
          case PROVIDER_NUMBER:
          case PROVIDER_SYMBOL_STRING:
            // 16.3.0 exposed the context object as "context"
            // PR #12501 changed it to "_context" for 16.3.1+
            // NOTE Keep in sync with inspectElementRaw()
            resolvedContext = fiber.type._context || fiber.type.context;
            return "".concat(resolvedContext.displayName || 'Context', ".Provider");
          case CONTEXT_NUMBER:
          case CONTEXT_SYMBOL_STRING:
          case SERVER_CONTEXT_SYMBOL_STRING:
            if (fiber.type._context === undefined && fiber.type.Provider === fiber.type) {
              // In 19+, Context.Provider === Context, so this is a provider.
              resolvedContext = fiber.type;
              return "".concat(resolvedContext.displayName || 'Context', ".Provider");
            } // 16.3-16.5 read from "type" because the Consumer is the actual context object.
            // 16.6+ should read from "type._context" because Consumer can be different (in DEV).
            // NOTE Keep in sync with inspectElementRaw()

            resolvedContext = fiber.type._context || fiber.type; // NOTE: TraceUpdatesBackendManager depends on the name ending in '.Consumer'
            // If you change the name, figure out a more resilient way to detect it.

            return "".concat(resolvedContext.displayName || 'Context', ".Consumer");
          case CONSUMER_SYMBOL_STRING:
            // 19+
            resolvedContext = fiber.type._context;
            return "".concat(resolvedContext.displayName || 'Context', ".Consumer");
          case STRICT_MODE_NUMBER:
          case STRICT_MODE_SYMBOL_STRING:
            return null;
          case PROFILER_NUMBER:
          case PROFILER_SYMBOL_STRING:
            return "Profiler(".concat(fiber.memoizedProps.id, ")");
          case SCOPE_NUMBER:
          case SCOPE_SYMBOL_STRING:
            return 'Scope';
          default:
            // Unknown element type.
            // This may mean a new element type that has not yet been added to DevTools.
            return null;
        }
    }
  }
  return {
    getDisplayNameForFiber: getDisplayNameForFiber,
    getTypeSymbol: getTypeSymbol,
    ReactPriorityLevels: ReactPriorityLevels,
    ReactTypeOfWork: ReactTypeOfWork,
    StrictModeBits: StrictModeBits
  };
} // All environment names we've seen so far. This lets us create a list of filters to apply.
// This should ideally include env of filtered Components too so that you can add those as
// filters at the same time as removing some other filter.

var knownEnvironmentNames = new Set(); // Map of FiberRoot to their root FiberInstance.

var rootToFiberInstanceMap = new Map(); // Map of id to FiberInstance or VirtualInstance.
// This Map is used to e.g. get the display name for a Fiber or schedule an update,
// operations that should be the same whether the current and work-in-progress Fiber is used.

var idToDevToolsInstanceMap = new Map(); // Map of canonical HostInstances to the nearest parent DevToolsInstance.

var publicInstanceToDevToolsInstanceMap = new Map(); // Map of resource DOM nodes to all the nearest DevToolsInstances that depend on it.

var hostResourceToDevToolsInstanceMap = new Map(); // Ideally, this should be injected from Reconciler config

function getPublicInstance(instance) {
  // Typically the PublicInstance and HostInstance is the same thing but not in Fabric.
  // So we need to detect this and use that as the public instance.
  // React Native. Modern. Fabric.
  if (renderer_typeof(instance) === 'object' && instance !== null) {
    if (renderer_typeof(instance.canonical) === 'object' && instance.canonical !== null) {
      if (renderer_typeof(instance.canonical.publicInstance) === 'object' && instance.canonical.publicInstance !== null) {
        return instance.canonical.publicInstance;
      }
    } // React Native. Legacy. Paper.

    if (typeof instance._nativeTag === 'number') {
      return instance._nativeTag;
    }
  } // React Web. Usually a DOM element.

  return instance;
}
function getNativeTag(instance) {
  if (renderer_typeof(instance) !== 'object' || instance === null) {
    return null;
  } // Modern. Fabric.

  if (instance.canonical != null && typeof instance.canonical.nativeTag === 'number') {
    return instance.canonical.nativeTag;
  } // Legacy.  Paper.

  if (typeof instance._nativeTag === 'number') {
    return instance._nativeTag;
  }
  return null;
}
function aquireHostInstance(nearestInstance, hostInstance) {
  var publicInstance = getPublicInstance(hostInstance);
  publicInstanceToDevToolsInstanceMap.set(publicInstance, nearestInstance);
}
function releaseHostInstance(nearestInstance, hostInstance) {
  var publicInstance = getPublicInstance(hostInstance);
  if (publicInstanceToDevToolsInstanceMap.get(publicInstance) === nearestInstance) {
    publicInstanceToDevToolsInstanceMap.delete(publicInstance);
  }
}
function aquireHostResource(nearestInstance, resource) {
  var hostInstance = resource && resource.instance;
  if (hostInstance) {
    var publicInstance = getPublicInstance(hostInstance);
    var resourceInstances = hostResourceToDevToolsInstanceMap.get(publicInstance);
    if (resourceInstances === undefined) {
      resourceInstances = new Set();
      hostResourceToDevToolsInstanceMap.set(publicInstance, resourceInstances); // Store the first match in the main map for quick access when selecting DOM node.

      publicInstanceToDevToolsInstanceMap.set(publicInstance, nearestInstance);
    }
    resourceInstances.add(nearestInstance);
  }
}
function releaseHostResource(nearestInstance, resource) {
  var hostInstance = resource && resource.instance;
  if (hostInstance) {
    var publicInstance = getPublicInstance(hostInstance);
    var resourceInstances = hostResourceToDevToolsInstanceMap.get(publicInstance);
    if (resourceInstances !== undefined) {
      resourceInstances.delete(nearestInstance);
      if (resourceInstances.size === 0) {
        hostResourceToDevToolsInstanceMap.delete(publicInstance);
        publicInstanceToDevToolsInstanceMap.delete(publicInstance);
      } else if (publicInstanceToDevToolsInstanceMap.get(publicInstance) === nearestInstance) {
        // This was the first one. Store the next first one in the main map for easy access.
        // eslint-disable-next-line no-for-of-loops/no-for-of-loops
        var _iterator = renderer_createForOfIteratorHelper(resourceInstances),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var firstInstance = _step.value;
            publicInstanceToDevToolsInstanceMap.set(firstInstance, nearestInstance);
            break;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }
}
function renderer_attach(hook, rendererID, renderer, global, shouldStartProfilingNow, profilingSettings) {
  // Newer versions of the reconciler package also specific reconciler version.
  // If that version number is present, use it.
  // Third party renderer versions may not match the reconciler version,
  // and the latter is what's important in terms of tags and symbols.
  var version = renderer.reconcilerVersion || renderer.version;
  var _getInternalReactCons = getInternalReactConstants(version),
    getDisplayNameForFiber = _getInternalReactCons.getDisplayNameForFiber,
    getTypeSymbol = _getInternalReactCons.getTypeSymbol,
    ReactPriorityLevels = _getInternalReactCons.ReactPriorityLevels,
    ReactTypeOfWork = _getInternalReactCons.ReactTypeOfWork,
    StrictModeBits = _getInternalReactCons.StrictModeBits;
  var ActivityComponent = ReactTypeOfWork.ActivityComponent,
    CacheComponent = ReactTypeOfWork.CacheComponent,
    ClassComponent = ReactTypeOfWork.ClassComponent,
    ContextConsumer = ReactTypeOfWork.ContextConsumer,
    DehydratedSuspenseComponent = ReactTypeOfWork.DehydratedSuspenseComponent,
    ForwardRef = ReactTypeOfWork.ForwardRef,
    Fragment = ReactTypeOfWork.Fragment,
    FunctionComponent = ReactTypeOfWork.FunctionComponent,
    HostRoot = ReactTypeOfWork.HostRoot,
    HostHoistable = ReactTypeOfWork.HostHoistable,
    HostSingleton = ReactTypeOfWork.HostSingleton,
    HostPortal = ReactTypeOfWork.HostPortal,
    HostComponent = ReactTypeOfWork.HostComponent,
    HostText = ReactTypeOfWork.HostText,
    IncompleteClassComponent = ReactTypeOfWork.IncompleteClassComponent,
    IncompleteFunctionComponent = ReactTypeOfWork.IncompleteFunctionComponent,
    IndeterminateComponent = ReactTypeOfWork.IndeterminateComponent,
    LegacyHiddenComponent = ReactTypeOfWork.LegacyHiddenComponent,
    MemoComponent = ReactTypeOfWork.MemoComponent,
    OffscreenComponent = ReactTypeOfWork.OffscreenComponent,
    SimpleMemoComponent = ReactTypeOfWork.SimpleMemoComponent,
    SuspenseComponent = ReactTypeOfWork.SuspenseComponent,
    SuspenseListComponent = ReactTypeOfWork.SuspenseListComponent,
    TracingMarkerComponent = ReactTypeOfWork.TracingMarkerComponent,
    Throw = ReactTypeOfWork.Throw,
    ViewTransitionComponent = ReactTypeOfWork.ViewTransitionComponent;
  var ImmediatePriority = ReactPriorityLevels.ImmediatePriority,
    UserBlockingPriority = ReactPriorityLevels.UserBlockingPriority,
    NormalPriority = ReactPriorityLevels.NormalPriority,
    LowPriority = ReactPriorityLevels.LowPriority,
    IdlePriority = ReactPriorityLevels.IdlePriority,
    NoPriority = ReactPriorityLevels.NoPriority;
  var getLaneLabelMap = renderer.getLaneLabelMap,
    injectProfilingHooks = renderer.injectProfilingHooks,
    overrideHookState = renderer.overrideHookState,
    overrideHookStateDeletePath = renderer.overrideHookStateDeletePath,
    overrideHookStateRenamePath = renderer.overrideHookStateRenamePath,
    overrideProps = renderer.overrideProps,
    overridePropsDeletePath = renderer.overridePropsDeletePath,
    overridePropsRenamePath = renderer.overridePropsRenamePath,
    scheduleRefresh = renderer.scheduleRefresh,
    setErrorHandler = renderer.setErrorHandler,
    setSuspenseHandler = renderer.setSuspenseHandler,
    scheduleUpdate = renderer.scheduleUpdate,
    getCurrentFiber = renderer.getCurrentFiber;
  var supportsTogglingError = typeof setErrorHandler === 'function' && typeof scheduleUpdate === 'function';
  var supportsTogglingSuspense = typeof setSuspenseHandler === 'function' && typeof scheduleUpdate === 'function';
  if (typeof scheduleRefresh === 'function') {
    // When Fast Refresh updates a component, the frontend may need to purge cached information.
    // For example, ASTs cached for the component (for named hooks) may no longer be valid.
    // Send a signal to the frontend to purge this cached information.
    // The "fastRefreshScheduled" dispatched is global (not Fiber or even Renderer specific).
    // This is less effecient since it means the front-end will need to purge the entire cache,
    // but this is probably an okay trade off in order to reduce coupling between the DevTools and Fast Refresh.
    renderer.scheduleRefresh = function () {
      try {
        hook.emit('fastRefreshScheduled');
      } finally {
        return scheduleRefresh.apply(void 0, arguments);
      }
    };
  }
  var getTimelineData = null;
  var toggleProfilingStatus = null;
  if (typeof injectProfilingHooks === 'function') {
    var response = createProfilingHooks({
      getDisplayNameForFiber: getDisplayNameForFiber,
      getIsProfiling: function getIsProfiling() {
        return isProfiling;
      },
      getLaneLabelMap: getLaneLabelMap,
      currentDispatcherRef: getDispatcherRef(renderer),
      workTagMap: ReactTypeOfWork,
      reactVersion: version
    }); // Pass the Profiling hooks to the reconciler for it to call during render.

    injectProfilingHooks(response.profilingHooks); // Hang onto this toggle so we can notify the external methods of profiling status changes.

    getTimelineData = response.getTimelineData;
    toggleProfilingStatus = response.toggleProfilingStatus;
  }

  // Tracks Errors/Warnings logs added to a Fiber. They are added before the commit and get
  // picked up a FiberInstance. This keeps it around as long as the Fiber is alive which
  // lets the Fiber get reparented/remounted and still observe the previous errors/warnings.
  // Unless we explicitly clear the logs from a Fiber.
  var fiberToComponentLogsMap = new WeakMap(); // Tracks whether we've performed a commit since the last log. This is used to know
  // whether we received any new logs between the commit and post commit phases. I.e.
  // if any passive effects called console.warn / console.error.

  var needsToFlushComponentLogs = false;
  function bruteForceFlushErrorsAndWarnings() {
    // Refresh error/warning count for all mounted unfiltered Fibers.
    var hasChanges = false; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

    var _iterator2 = renderer_createForOfIteratorHelper(idToDevToolsInstanceMap.values()),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var devtoolsInstance = _step2.value;
        if (devtoolsInstance.kind === FIBER_INSTANCE) {
          var _fiber = devtoolsInstance.data;
          var componentLogsEntry = fiberToComponentLogsMap.get(_fiber);
          var changed = recordConsoleLogs(devtoolsInstance, componentLogsEntry);
          if (changed) {
            hasChanges = true;
            updateMostRecentlyInspectedElementIfNecessary(devtoolsInstance.id);
          }
        } else {// Virtual Instances cannot log in passive effects and so never appear here.
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (hasChanges) {
      flushPendingEvents();
    }
  }
  function clearErrorsAndWarnings() {
    // Note, this only clears logs for Fibers that have instances. If they're filtered
    // and then mount, the logs are there. Ensuring we only clear what you've seen.
    // If we wanted to clear the whole set, we'd replace fiberToComponentLogsMap with a
    // new WeakMap. It's unclear whether we should clear componentInfoToComponentLogsMap
    // since it's shared by other renderers but presumably it would.
    // eslint-disable-next-line no-for-of-loops/no-for-of-loops
    var _iterator3 = renderer_createForOfIteratorHelper(idToDevToolsInstanceMap.values()),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var devtoolsInstance = _step3.value;
        if (devtoolsInstance.kind === FIBER_INSTANCE) {
          var _fiber2 = devtoolsInstance.data;
          fiberToComponentLogsMap.delete(_fiber2);
          if (_fiber2.alternate) {
            fiberToComponentLogsMap.delete(_fiber2.alternate);
          }
        } else {
          componentInfoToComponentLogsMap["delete"](devtoolsInstance.data);
        }
        var changed = recordConsoleLogs(devtoolsInstance, undefined);
        if (changed) {
          updateMostRecentlyInspectedElementIfNecessary(devtoolsInstance.id);
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    flushPendingEvents();
  }
  function clearConsoleLogsHelper(instanceID, type) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(instanceID);
    if (devtoolsInstance !== undefined) {
      var componentLogsEntry;
      if (devtoolsInstance.kind === FIBER_INSTANCE) {
        var _fiber3 = devtoolsInstance.data;
        componentLogsEntry = fiberToComponentLogsMap.get(_fiber3);
        if (componentLogsEntry === undefined && _fiber3.alternate !== null) {
          componentLogsEntry = fiberToComponentLogsMap.get(_fiber3.alternate);
        }
      } else {
        var componentInfo = devtoolsInstance.data;
        componentLogsEntry = componentInfoToComponentLogsMap.get(componentInfo);
      }
      if (componentLogsEntry !== undefined) {
        if (type === 'error') {
          componentLogsEntry.errors.clear();
          componentLogsEntry.errorsCount = 0;
        } else {
          componentLogsEntry.warnings.clear();
          componentLogsEntry.warningsCount = 0;
        }
        var changed = recordConsoleLogs(devtoolsInstance, componentLogsEntry);
        if (changed) {
          flushPendingEvents();
          updateMostRecentlyInspectedElementIfNecessary(devtoolsInstance.id);
        }
      }
    }
  }
  function clearErrorsForElementID(instanceID) {
    clearConsoleLogsHelper(instanceID, 'error');
  }
  function clearWarningsForElementID(instanceID) {
    clearConsoleLogsHelper(instanceID, 'warn');
  }
  function updateMostRecentlyInspectedElementIfNecessary(fiberID) {
    if (mostRecentlyInspectedElement !== null && mostRecentlyInspectedElement.id === fiberID) {
      hasElementUpdatedSinceLastInspected = true;
    }
  }
  function getComponentStack(topFrame) {
    if (getCurrentFiber == null) {
      // Expected this to be part of the renderer. Ignore.
      return null;
    }
    var current = getCurrentFiber();
    if (current === null) {
      // Outside of our render scope.
      return null;
    }
    if (DevToolsFiberComponentStack_supportsConsoleTasks(current)) {
      // This will be handled natively by console.createTask. No need for
      // DevTools to add it.
      return null;
    }
    var dispatcherRef = getDispatcherRef(renderer);
    if (dispatcherRef === undefined) {
      return null;
    }
    var enableOwnerStacks = supportsOwnerStacks(current);
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
      componentStack += getOwnerStackByFiberInDev(ReactTypeOfWork, current, dispatcherRef);
    } else {
      componentStack = getStackByFiberInDevAndProd(ReactTypeOfWork, current, dispatcherRef);
    }
    return {
      enableOwnerStacks: enableOwnerStacks,
      componentStack: componentStack
    };
  } // Called when an error or warning is logged during render, commit, or passive (including unmount functions).

  function onErrorOrWarning(type, args) {
    if (getCurrentFiber == null) {
      // Expected this to be part of the renderer. Ignore.
      return;
    }
    var fiber = getCurrentFiber();
    if (fiber === null) {
      // Outside of our render scope.
      return;
    }
    if (type === 'error') {
      // if this is an error simulated by us to trigger error boundary, ignore
      if (forceErrorForFibers.get(fiber) === true || fiber.alternate !== null && forceErrorForFibers.get(fiber.alternate) === true) {
        return;
      }
    } // We can't really use this message as a unique key, since we can't distinguish
    // different objects in this implementation. We have to delegate displaying of the objects
    // to the environment, the browser console, for example, so this is why this should be kept
    // as an array of arguments, instead of the plain string.
    // [Warning: %o, {...}] and [Warning: %o, {...}] will be considered as the same message,
    // even if objects are different

    var message = formatConsoleArgumentsToSingleString.apply(void 0, fiber_renderer_toConsumableArray(args)); // Track the warning/error for later.

    var componentLogsEntry = fiberToComponentLogsMap.get(fiber);
    if (componentLogsEntry === undefined && fiber.alternate !== null) {
      componentLogsEntry = fiberToComponentLogsMap.get(fiber.alternate);
      if (componentLogsEntry !== undefined) {
        // Use the same set for both Fibers.
        fiberToComponentLogsMap.set(fiber, componentLogsEntry);
      }
    }
    if (componentLogsEntry === undefined) {
      componentLogsEntry = {
        errors: new Map(),
        errorsCount: 0,
        warnings: new Map(),
        warningsCount: 0
      };
      fiberToComponentLogsMap.set(fiber, componentLogsEntry);
    }
    var messageMap = type === 'error' ? componentLogsEntry.errors : componentLogsEntry.warnings;
    var count = messageMap.get(message) || 0;
    messageMap.set(message, count + 1);
    if (type === 'error') {
      componentLogsEntry.errorsCount++;
    } else {
      componentLogsEntry.warningsCount++;
    } // The changes will be flushed later when we commit.
    // If the log happened in a passive effect, then this happens after we've
    // already committed the new tree so the change won't show up until we rerender
    // that component again. We need to visit a Component with passive effects in
    // handlePostCommitFiberRoot again to ensure that we flush the changes after passive.

    needsToFlushComponentLogs = true;
  }
  function debug(name, instance, parentInstance) {
    var extraString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    if (__DEBUG__) {
      var displayName = instance.kind === VIRTUAL_INSTANCE ? instance.data.name || 'null' : instance.data.tag + ':' + (getDisplayNameForFiber(instance.data) || 'null');
      var maybeID = instance.kind === FILTERED_FIBER_INSTANCE ? '<no id>' : instance.id;
      var parentDisplayName = parentInstance === null ? '' : parentInstance.kind === VIRTUAL_INSTANCE ? parentInstance.data.name || 'null' : parentInstance.data.tag + ':' + (getDisplayNameForFiber(parentInstance.data) || 'null');
      var maybeParentID = parentInstance === null || parentInstance.kind === FILTERED_FIBER_INSTANCE ? '<no id>' : parentInstance.id;
      console.groupCollapsed("[renderer] %c".concat(name, " %c").concat(displayName, " (").concat(maybeID, ") %c").concat(parentInstance ? "".concat(parentDisplayName, " (").concat(maybeParentID, ")") : '', " %c").concat(extraString), 'color: red; font-weight: bold;', 'color: blue;', 'color: purple;', 'color: black;');
      console.log(new Error().stack.split('\n').slice(1).join('\n'));
      console.groupEnd();
    }
  } // eslint-disable-next-line no-unused-vars

  function debugTree(instance) {
    var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (__DEBUG__) {
      var name = (instance.kind !== VIRTUAL_INSTANCE ? getDisplayNameForFiber(instance.data) : instance.data.name) || '';
      console.log('  '.repeat(indent) + '- ' + (instance.kind === FILTERED_FIBER_INSTANCE ? 0 : instance.id) + ' (' + name + ')', 'parent', instance.parent === null ? ' ' : instance.parent.kind === FILTERED_FIBER_INSTANCE ? 0 : instance.parent.id, 'next', instance.nextSibling === null ? ' ' : instance.nextSibling.id);
      var child = instance.firstChild;
      while (child !== null) {
        debugTree(child, indent + 1);
        child = child.nextSibling;
      }
    }
  } // Configurable Components tree filters.

  var hideElementsWithDisplayNames = new Set();
  var hideElementsWithPaths = new Set();
  var hideElementsWithTypes = new Set();
  var hideElementsWithEnvs = new Set(); // Highlight updates

  var traceUpdatesEnabled = false;
  var traceUpdatesForNodes = new Set();
  function applyComponentFilters(componentFilters) {
    hideElementsWithTypes.clear();
    hideElementsWithDisplayNames.clear();
    hideElementsWithPaths.clear();
    hideElementsWithEnvs.clear();
    componentFilters.forEach(function (componentFilter) {
      if (!componentFilter.isEnabled) {
        return;
      }
      switch (componentFilter.type) {
        case ComponentFilterDisplayName:
          if (componentFilter.isValid && componentFilter.value !== '') {
            hideElementsWithDisplayNames.add(new RegExp(componentFilter.value, 'i'));
          }
          break;
        case ComponentFilterElementType:
          hideElementsWithTypes.add(componentFilter.value);
          break;
        case ComponentFilterLocation:
          if (componentFilter.isValid && componentFilter.value !== '') {
            hideElementsWithPaths.add(new RegExp(componentFilter.value, 'i'));
          }
          break;
        case ComponentFilterHOC:
          hideElementsWithDisplayNames.add(new RegExp('\\('));
          break;
        case ComponentFilterEnvironmentName:
          hideElementsWithEnvs.add(componentFilter.value);
          break;
        default:
          console.warn("Invalid component filter type \"".concat(componentFilter.type, "\""));
          break;
      }
    });
  } // The renderer interface can't read saved component filters directly,
  // because they are stored in localStorage within the context of the extension.
  // Instead it relies on the extension to pass filters through.

  if (window.__REACT_DEVTOOLS_COMPONENT_FILTERS__ != null) {
    var componentFiltersWithoutLocationBasedOnes = filterOutLocationComponentFilters(window.__REACT_DEVTOOLS_COMPONENT_FILTERS__);
    applyComponentFilters(componentFiltersWithoutLocationBasedOnes);
  } else {
    // Unfortunately this feature is not expected to work for React Native for now.
    // It would be annoying for us to spam YellowBox warnings with unactionable stuff,
    // so for now just skip this message...
    //console.warn('⚛ DevTools: Could not locate saved component filters');
    // Fallback to assuming the default filters in this case.
    applyComponentFilters(getDefaultComponentFilters());
  } // If necessary, we can revisit optimizing this operation.
  // For example, we could add a new recursive unmount tree operation.
  // The unmount operations are already significantly smaller than mount operations though.
  // This is something to keep in mind for later.

  function updateComponentFilters(componentFilters) {
    if (isProfiling) {
      // Re-mounting a tree while profiling is in progress might break a lot of assumptions.
      // If necessary, we could support this- but it doesn't seem like a necessary use case.
      throw Error('Cannot modify filter preferences while profiling');
    } // Recursively unmount all roots.

    hook.getFiberRoots(rendererID).forEach(function (root) {
      var rootInstance = rootToFiberInstanceMap.get(root);
      if (rootInstance === undefined) {
        throw new Error('Expected the root instance to already exist when applying filters');
      }
      currentRoot = rootInstance;
      unmountInstanceRecursively(rootInstance);
      rootToFiberInstanceMap.delete(root);
      flushPendingEvents(root);
      currentRoot = null;
    });
    applyComponentFilters(componentFilters); // Reset pseudo counters so that new path selections will be persisted.

    rootDisplayNameCounter.clear(); // Recursively re-mount all roots with new filter criteria applied.

    hook.getFiberRoots(rendererID).forEach(function (root) {
      var current = root.current;
      var newRoot = createFiberInstance(current);
      rootToFiberInstanceMap.set(root, newRoot);
      idToDevToolsInstanceMap.set(newRoot.id, newRoot); // Before the traversals, remember to start tracking
      // our path in case we have selection to restore.

      if (trackedPath !== null) {
        mightBeOnTrackedPath = true;
      }
      currentRoot = newRoot;
      setRootPseudoKey(currentRoot.id, root.current);
      mountFiberRecursively(root.current, false);
      flushPendingEvents(root);
      currentRoot = null;
    });
    flushPendingEvents();
    needsToFlushComponentLogs = false;
  }
  function getEnvironmentNames() {
    return Array.from(knownEnvironmentNames);
  }
  function shouldFilterVirtual(data, secondaryEnv) {
    // For purposes of filtering Server Components are always Function Components.
    // Environment will be used to filter Server vs Client.
    // Technically they can be forwardRef and memo too but those filters will go away
    // as those become just plain user space function components like any HoC.
    if (hideElementsWithTypes.has(types_ElementTypeFunction)) {
      return true;
    }
    if (hideElementsWithDisplayNames.size > 0) {
      var displayName = data.name;
      if (displayName != null) {
        // eslint-disable-next-line no-for-of-loops/no-for-of-loops
        var _iterator4 = renderer_createForOfIteratorHelper(hideElementsWithDisplayNames),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var displayNameRegExp = _step4.value;
            if (displayNameRegExp.test(displayName)) {
              return true;
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
    if ((data.env == null || hideElementsWithEnvs.has(data.env)) && (secondaryEnv === null || hideElementsWithEnvs.has(secondaryEnv))) {
      // If a Component has two environments, you have to filter both for it not to appear.
      return true;
    }
    return false;
  } // NOTICE Keep in sync with get*ForFiber methods

  function shouldFilterFiber(fiber) {
    var tag = fiber.tag,
      type = fiber.type,
      key = fiber.key;
    switch (tag) {
      case DehydratedSuspenseComponent:
        // TODO: ideally we would show dehydrated Suspense immediately.
        // However, it has some special behavior (like disconnecting
        // an alternate and turning into real Suspense) which breaks DevTools.
        // For now, ignore it, and only show it once it gets hydrated.
        // https://github.com/bvaughn/react-devtools-experimental/issues/197
        return true;
      case HostPortal:
      case HostText:
      case LegacyHiddenComponent:
      case OffscreenComponent:
      case Throw:
        return true;
      case HostRoot:
        // It is never valid to filter the root element.
        return false;
      case Fragment:
        return key === null;
      default:
        var typeSymbol = getTypeSymbol(type);
        switch (typeSymbol) {
          case CONCURRENT_MODE_NUMBER:
          case CONCURRENT_MODE_SYMBOL_STRING:
          case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
          case STRICT_MODE_NUMBER:
          case STRICT_MODE_SYMBOL_STRING:
            return true;
          default:
            break;
        }
    }
    var elementType = getElementTypeForFiber(fiber);
    if (hideElementsWithTypes.has(elementType)) {
      return true;
    }
    if (hideElementsWithDisplayNames.size > 0) {
      var displayName = getDisplayNameForFiber(fiber);
      if (displayName != null) {
        // eslint-disable-next-line no-for-of-loops/no-for-of-loops
        var _iterator5 = renderer_createForOfIteratorHelper(hideElementsWithDisplayNames),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var displayNameRegExp = _step5.value;
            if (displayNameRegExp.test(displayName)) {
              return true;
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    }
    if (hideElementsWithEnvs.has('Client')) {
      // If we're filtering out the Client environment we should filter out all
      // "Client Components". Technically that also includes the built-ins but
      // since that doesn't actually include any additional code loading it's
      // useful to not filter out the built-ins. Those can be filtered separately.
      // There's no other way to filter out just Function components on the Client.
      // Therefore, this only filters Class and Function components.
      switch (tag) {
        case ClassComponent:
        case IncompleteClassComponent:
        case IncompleteFunctionComponent:
        case FunctionComponent:
        case IndeterminateComponent:
        case ForwardRef:
        case MemoComponent:
        case SimpleMemoComponent:
          return true;
      }
    }
    /* DISABLED: https://github.com/facebook/react/pull/28417
    if (hideElementsWithPaths.size > 0) {
      const source = getSourceForFiber(fiber);
       if (source != null) {
        const {fileName} = source;
        // eslint-disable-next-line no-for-of-loops/no-for-of-loops
        for (const pathRegExp of hideElementsWithPaths) {
          if (pathRegExp.test(fileName)) {
            return true;
          }
        }
      }
    }
    */

    return false;
  } // NOTICE Keep in sync with shouldFilterFiber() and other get*ForFiber methods

  function getElementTypeForFiber(fiber) {
    var type = fiber.type,
      tag = fiber.tag;
    switch (tag) {
      case ActivityComponent:
        return ElementTypeActivity;
      case ClassComponent:
      case IncompleteClassComponent:
        return types_ElementTypeClass;
      case IncompleteFunctionComponent:
      case FunctionComponent:
      case IndeterminateComponent:
        return types_ElementTypeFunction;
      case ForwardRef:
        return types_ElementTypeForwardRef;
      case HostRoot:
        return ElementTypeRoot;
      case HostComponent:
      case HostHoistable:
      case HostSingleton:
        return ElementTypeHostComponent;
      case HostPortal:
      case HostText:
      case Fragment:
        return ElementTypeOtherOrUnknown;
      case MemoComponent:
      case SimpleMemoComponent:
        return types_ElementTypeMemo;
      case SuspenseComponent:
        return ElementTypeSuspense;
      case SuspenseListComponent:
        return ElementTypeSuspenseList;
      case TracingMarkerComponent:
        return ElementTypeTracingMarker;
      case ViewTransitionComponent:
        return ElementTypeViewTransition;
      default:
        var typeSymbol = getTypeSymbol(type);
        switch (typeSymbol) {
          case CONCURRENT_MODE_NUMBER:
          case CONCURRENT_MODE_SYMBOL_STRING:
          case DEPRECATED_ASYNC_MODE_SYMBOL_STRING:
            return ElementTypeOtherOrUnknown;
          case PROVIDER_NUMBER:
          case PROVIDER_SYMBOL_STRING:
            return ElementTypeContext;
          case CONTEXT_NUMBER:
          case CONTEXT_SYMBOL_STRING:
            return ElementTypeContext;
          case STRICT_MODE_NUMBER:
          case STRICT_MODE_SYMBOL_STRING:
            return ElementTypeOtherOrUnknown;
          case PROFILER_NUMBER:
          case PROFILER_SYMBOL_STRING:
            return ElementTypeProfiler;
          default:
            return ElementTypeOtherOrUnknown;
        }
    }
  } // When a mount or update is in progress, this value tracks the root that is being operated on.

  var currentRoot = null; // Removes a Fiber (and its alternate) from the Maps used to track their id.
  // This method should always be called when a Fiber is unmounting.

  function untrackFiber(nearestInstance, fiber) {
    if (forceErrorForFibers.size > 0) {
      forceErrorForFibers.delete(fiber);
      if (fiber.alternate) {
        forceErrorForFibers.delete(fiber.alternate);
      }
      if (forceErrorForFibers.size === 0 && setErrorHandler != null) {
        setErrorHandler(shouldErrorFiberAlwaysNull);
      }
    }
    if (forceFallbackForFibers.size > 0) {
      forceFallbackForFibers.delete(fiber);
      if (fiber.alternate) {
        forceFallbackForFibers.delete(fiber.alternate);
      }
      if (forceFallbackForFibers.size === 0 && setSuspenseHandler != null) {
        setSuspenseHandler(shouldSuspendFiberAlwaysFalse);
      }
    } // TODO: Consider using a WeakMap instead. The only thing where that doesn't work
    // is React Native Paper which tracks tags but that support is eventually going away
    // and can use the old findFiberByHostInstance strategy.

    if (fiber.tag === HostHoistable) {
      releaseHostResource(nearestInstance, fiber.memoizedState);
    } else if (fiber.tag === HostComponent || fiber.tag === HostText || fiber.tag === HostSingleton) {
      releaseHostInstance(nearestInstance, fiber.stateNode);
    } // Recursively clean up any filtered Fibers below this one as well since
    // we won't recordUnmount on those.

    for (var child = fiber.child; child !== null; child = child.sibling) {
      if (shouldFilterFiber(child)) {
        untrackFiber(nearestInstance, child);
      }
    }
  }
  function getChangeDescription(prevFiber, nextFiber) {
    switch (nextFiber.tag) {
      case ClassComponent:
        if (prevFiber === null) {
          return {
            context: null,
            didHooksChange: false,
            isFirstMount: true,
            props: null,
            state: null
          };
        } else {
          var data = {
            context: getContextChanged(prevFiber, nextFiber),
            didHooksChange: false,
            isFirstMount: false,
            props: getChangedKeys(prevFiber.memoizedProps, nextFiber.memoizedProps),
            state: getChangedKeys(prevFiber.memoizedState, nextFiber.memoizedState)
          };
          return data;
        }
      case IncompleteFunctionComponent:
      case FunctionComponent:
      case IndeterminateComponent:
      case ForwardRef:
      case MemoComponent:
      case SimpleMemoComponent:
        if (prevFiber === null) {
          return {
            context: null,
            didHooksChange: false,
            isFirstMount: true,
            props: null,
            state: null
          };
        } else {
          var indices = getChangedHooksIndices(prevFiber.memoizedState, nextFiber.memoizedState);
          var _data = {
            context: getContextChanged(prevFiber, nextFiber),
            didHooksChange: indices !== null && indices.length > 0,
            isFirstMount: false,
            props: getChangedKeys(prevFiber.memoizedProps, nextFiber.memoizedProps),
            state: null,
            hooks: indices
          }; // Only traverse the hooks list once, depending on what info we're returning.

          return _data;
        }
      default:
        return null;
    }
  }
  function getContextChanged(prevFiber, nextFiber) {
    var prevContext = prevFiber.dependencies && prevFiber.dependencies.firstContext;
    var nextContext = nextFiber.dependencies && nextFiber.dependencies.firstContext;
    while (prevContext && nextContext) {
      // Note this only works for versions of React that support this key (e.v. 18+)
      // For older versions, there's no good way to read the current context value after render has completed.
      // This is because React maintains a stack of context values during render,
      // but by the time DevTools is called, render has finished and the stack is empty.
      if (prevContext.context !== nextContext.context) {
        // If the order of context has changed, then the later context values might have
        // changed too but the main reason it rerendered was earlier. Either an earlier
        // context changed value but then we would have exited already. If we end up here
        // it's because a state or props change caused the order of contexts used to change.
        // So the main cause is not the contexts themselves.
        return false;
      }
      if (!shared_objectIs(prevContext.memoizedValue, nextContext.memoizedValue)) {
        return true;
      }
      prevContext = prevContext.next;
      nextContext = nextContext.next;
    }
    return false;
  }
  function isHookThatCanScheduleUpdate(hookObject) {
    var queue = hookObject.queue;
    if (!queue) {
      return false;
    }
    var boundHasOwnProperty = shared_hasOwnProperty.bind(queue); // Detect the shape of useState() / useReducer() / useTransition()
    // using the attributes that are unique to these hooks
    // but also stable (e.g. not tied to current Lanes implementation)
    // We don't check for dispatch property, because useTransition doesn't have it

    if (boundHasOwnProperty('pending')) {
      return true;
    } // Detect useSyncExternalStore()

    return boundHasOwnProperty('value') && boundHasOwnProperty('getSnapshot') && typeof queue.getSnapshot === 'function';
  }
  function didStatefulHookChange(prev, next) {
    var prevMemoizedState = prev.memoizedState;
    var nextMemoizedState = next.memoizedState;
    if (isHookThatCanScheduleUpdate(prev)) {
      return prevMemoizedState !== nextMemoizedState;
    }
    return false;
  }
  function getChangedHooksIndices(prev, next) {
    if (prev == null || next == null) {
      return null;
    }
    var indices = [];
    var index = 0;
    while (next !== null) {
      if (didStatefulHookChange(prev, next)) {
        indices.push(index);
      }
      next = next.next;
      prev = prev.next;
      index++;
    }
    return indices;
  }
  function getChangedKeys(prev, next) {
    if (prev == null || next == null) {
      return null;
    }
    var keys = new Set([].concat(fiber_renderer_toConsumableArray(Object.keys(prev)), fiber_renderer_toConsumableArray(Object.keys(next))));
    var changedKeys = []; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

    var _iterator6 = renderer_createForOfIteratorHelper(keys),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var key = _step6.value;
        if (prev[key] !== next[key]) {
          changedKeys.push(key);
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return changedKeys;
  }
  function didFiberRender(prevFiber, nextFiber) {
    switch (nextFiber.tag) {
      case ClassComponent:
      case FunctionComponent:
      case ContextConsumer:
      case MemoComponent:
      case SimpleMemoComponent:
      case ForwardRef:
        // For types that execute user code, we check PerformedWork effect.
        // We don't reflect bailouts (either referential or sCU) in DevTools.
        // TODO: This flag is a leaked implementation detail. Once we start
        // releasing DevTools in lockstep with React, we should import a
        // function from the reconciler instead.
        var PerformedWork = 1;
        return (getFiberFlags(nextFiber) & PerformedWork) === PerformedWork;
      // Note: ContextConsumer only gets PerformedWork effect in 16.3.3+
      // so it won't get highlighted with React 16.3.0 to 16.3.2.

      default:
        // For host components and other types, we compare inputs
        // to determine whether something is an update.
        return prevFiber.memoizedProps !== nextFiber.memoizedProps || prevFiber.memoizedState !== nextFiber.memoizedState || prevFiber.ref !== nextFiber.ref;
    }
  }
  var pendingOperations = [];
  var pendingRealUnmountedIDs = [];
  var pendingOperationsQueue = [];
  var pendingStringTable = new Map();
  var pendingStringTableLength = 0;
  var pendingUnmountedRootID = null;
  function pushOperation(op) {
    if (false)
      // removed by dead control flow
      {}
    pendingOperations.push(op);
  }
  function shouldBailoutWithPendingOperations() {
    if (isProfiling) {
      if (currentCommitProfilingMetadata != null && currentCommitProfilingMetadata.durations.length > 0) {
        return false;
      }
    }
    return pendingOperations.length === 0 && pendingRealUnmountedIDs.length === 0 && pendingUnmountedRootID === null;
  }
  function flushOrQueueOperations(operations) {
    if (shouldBailoutWithPendingOperations()) {
      return;
    }
    if (pendingOperationsQueue !== null) {
      pendingOperationsQueue.push(operations);
    } else {
      hook.emit('operations', operations);
    }
  }
  function recordConsoleLogs(instance, componentLogsEntry) {
    if (componentLogsEntry === undefined) {
      if (instance.logCount === 0) {
        // Nothing has changed.
        return false;
      } // Reset to zero.

      instance.logCount = 0;
      pushOperation(TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS);
      pushOperation(instance.id);
      pushOperation(0);
      pushOperation(0);
      return true;
    } else {
      var totalCount = componentLogsEntry.errorsCount + componentLogsEntry.warningsCount;
      if (instance.logCount === totalCount) {
        // Nothing has changed.
        return false;
      } // Update counts.

      instance.logCount = totalCount;
      pushOperation(TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS);
      pushOperation(instance.id);
      pushOperation(componentLogsEntry.errorsCount);
      pushOperation(componentLogsEntry.warningsCount);
      return true;
    }
  }
  function flushPendingEvents(root) {
    if (shouldBailoutWithPendingOperations()) {
      // If we aren't profiling, we can just bail out here.
      // No use sending an empty update over the bridge.
      //
      // The Profiler stores metadata for each commit and reconstructs the app tree per commit using:
      // (1) an initial tree snapshot and
      // (2) the operations array for each commit
      // Because of this, it's important that the operations and metadata arrays align,
      // So it's important not to omit even empty operations while profiling is active.
      return;
    }
    var numUnmountIDs = pendingRealUnmountedIDs.length + (pendingUnmountedRootID === null ? 0 : 1);
    var operations = new Array(
    // Identify which renderer this update is coming from.
    2 +
    // [rendererID, rootFiberID]
    // How big is the string table?
    1 +
    // [stringTableLength]
    // Then goes the actual string table.
    pendingStringTableLength + (
    // All unmounts are batched in a single message.
    // [TREE_OPERATION_REMOVE, removedIDLength, ...ids]
    numUnmountIDs > 0 ? 2 + numUnmountIDs : 0) +
    // Regular operations
    pendingOperations.length); // Identify which renderer this update is coming from.
    // This enables roots to be mapped to renderers,
    // Which in turn enables fiber props, states, and hooks to be inspected.

    var i = 0;
    operations[i++] = rendererID;
    if (currentRoot === null) {
      // TODO: This is not always safe so this field is probably not needed.
      operations[i++] = -1;
    } else {
      operations[i++] = currentRoot.id;
    } // Now fill in the string table.
    // [stringTableLength, str1Length, ...str1, str2Length, ...str2, ...]

    operations[i++] = pendingStringTableLength;
    pendingStringTable.forEach(function (entry, stringKey) {
      var encodedString = entry.encodedString; // Don't use the string length.
      // It won't work for multibyte characters (like emoji).

      var length = encodedString.length;
      operations[i++] = length;
      for (var j = 0; j < length; j++) {
        operations[i + j] = encodedString[j];
      }
      i += length;
    });
    if (numUnmountIDs > 0) {
      // All unmounts except roots are batched in a single message.
      operations[i++] = TREE_OPERATION_REMOVE; // The first number is how many unmounted IDs we're gonna send.

      operations[i++] = numUnmountIDs; // Fill in the real unmounts in the reverse order.
      // They were inserted parents-first by React, but we want children-first.
      // So we traverse our array backwards.

      for (var j = 0; j < pendingRealUnmountedIDs.length; j++) {
        operations[i++] = pendingRealUnmountedIDs[j];
      } // The root ID should always be unmounted last.

      if (pendingUnmountedRootID !== null) {
        operations[i] = pendingUnmountedRootID;
        i++;
      }
    } // Fill in the rest of the operations.

    for (var _j = 0; _j < pendingOperations.length; _j++) {
      operations[i + _j] = pendingOperations[_j];
    }
    i += pendingOperations.length; // Let the frontend know about tree operations.

    flushOrQueueOperations(operations); // Reset all of the pending state now that we've told the frontend about it.

    pendingOperations.length = 0;
    pendingRealUnmountedIDs.length = 0;
    pendingUnmountedRootID = null;
    pendingStringTable.clear();
    pendingStringTableLength = 0;
  }
  function getStringID(string) {
    if (string === null) {
      return 0;
    }
    var existingEntry = pendingStringTable.get(string);
    if (existingEntry !== undefined) {
      return existingEntry.id;
    }
    var id = pendingStringTable.size + 1;
    var encodedString = utfEncodeString(string);
    pendingStringTable.set(string, {
      encodedString: encodedString,
      id: id
    }); // The string table total length needs to account both for the string length,
    // and for the array item that contains the length itself.
    //
    // Don't use string length for this table.
    // It won't work for multibyte characters (like emoji).

    pendingStringTableLength += encodedString.length + 1;
    return id;
  }
  function recordMount(fiber, parentInstance) {
    var isRoot = fiber.tag === HostRoot;
    var fiberInstance;
    if (isRoot) {
      var entry = rootToFiberInstanceMap.get(fiber.stateNode);
      if (entry === undefined) {
        throw new Error('The root should have been registered at this point');
      }
      fiberInstance = entry;
    } else {
      fiberInstance = createFiberInstance(fiber);
    }
    idToDevToolsInstanceMap.set(fiberInstance.id, fiberInstance);
    var id = fiberInstance.id;
    if (__DEBUG__) {
      debug('recordMount()', fiberInstance, parentInstance);
    }
    var isProfilingSupported = fiber.hasOwnProperty('treeBaseDuration');
    if (isRoot) {
      var hasOwnerMetadata = fiber.hasOwnProperty('_debugOwner'); // Adding a new field here would require a bridge protocol version bump (a backwads breaking change).
      // Instead let's re-purpose a pre-existing field to carry more information.

      var profilingFlags = 0;
      if (isProfilingSupported) {
        profilingFlags = PROFILING_FLAG_BASIC_SUPPORT;
        if (typeof injectProfilingHooks === 'function') {
          profilingFlags |= PROFILING_FLAG_TIMELINE_SUPPORT;
        }
      } // Set supportsStrictMode to false for production renderer builds

      var isProductionBuildOfRenderer = renderer.bundleType === 0;
      pushOperation(TREE_OPERATION_ADD);
      pushOperation(id);
      pushOperation(ElementTypeRoot);
      pushOperation((fiber.mode & StrictModeBits) !== 0 ? 1 : 0);
      pushOperation(profilingFlags);
      pushOperation(!isProductionBuildOfRenderer && StrictModeBits !== 0 ? 1 : 0);
      pushOperation(hasOwnerMetadata ? 1 : 0);
      if (isProfiling) {
        if (displayNamesByRootID !== null) {
          displayNamesByRootID.set(id, getDisplayNameForRoot(fiber));
        }
      }
    } else {
      var key = fiber.key;
      var displayName = getDisplayNameForFiber(fiber);
      var elementType = getElementTypeForFiber(fiber); // Finding the owner instance might require traversing the whole parent path which
      // doesn't have great big O notation. Ideally we'd lazily fetch the owner when we
      // need it but we have some synchronous operations in the front end like Alt+Left
      // which selects the owner immediately. Typically most owners are only a few parents
      // away so maybe it's not so bad.

      var debugOwner = getUnfilteredOwner(fiber);
      var ownerInstance = findNearestOwnerInstance(parentInstance, debugOwner);
      if (ownerInstance !== null && debugOwner === fiber._debugOwner && fiber._debugStack != null && ownerInstance.source === null) {
        // The new Fiber is directly owned by the ownerInstance. Therefore somewhere on
        // the debugStack will be a stack frame inside the ownerInstance's source.
        ownerInstance.source = fiber._debugStack;
      }
      var ownerID = ownerInstance === null ? 0 : ownerInstance.id;
      var parentID = parentInstance ? parentInstance.kind === FILTERED_FIBER_INSTANCE ?
      // A Filtered Fiber Instance will always have a Virtual Instance as a parent.
      parentInstance.parent.id : parentInstance.id : 0;
      var displayNameStringID = getStringID(displayName); // This check is a guard to handle a React element that has been modified
      // in such a way as to bypass the default stringification of the "key" property.

      var keyString = key === null ? null : String(key);
      var keyStringID = getStringID(keyString);
      pushOperation(TREE_OPERATION_ADD);
      pushOperation(id);
      pushOperation(elementType);
      pushOperation(parentID);
      pushOperation(ownerID);
      pushOperation(displayNameStringID);
      pushOperation(keyStringID); // If this subtree has a new mode, let the frontend know.

      if ((fiber.mode & StrictModeBits) !== 0) {
        var parentFiber = null;
        var parentFiberInstance = parentInstance;
        while (parentFiberInstance !== null) {
          if (parentFiberInstance.kind === FIBER_INSTANCE) {
            parentFiber = parentFiberInstance.data;
            break;
          }
          parentFiberInstance = parentFiberInstance.parent;
        }
        if (parentFiber === null || (parentFiber.mode & StrictModeBits) === 0) {
          pushOperation(TREE_OPERATION_SET_SUBTREE_MODE);
          pushOperation(id);
          pushOperation(StrictMode);
        }
      }
    }
    var componentLogsEntry = fiberToComponentLogsMap.get(fiber);
    if (componentLogsEntry === undefined && fiber.alternate !== null) {
      componentLogsEntry = fiberToComponentLogsMap.get(fiber.alternate);
    }
    recordConsoleLogs(fiberInstance, componentLogsEntry);
    if (isProfilingSupported) {
      recordProfilingDurations(fiberInstance, null);
    }
    return fiberInstance;
  }
  function recordVirtualMount(instance, parentInstance, secondaryEnv) {
    var id = instance.id;
    idToDevToolsInstanceMap.set(id, instance);
    var componentInfo = instance.data;
    var key = typeof componentInfo.key === 'string' ? componentInfo.key : null;
    var env = componentInfo.env;
    var displayName = componentInfo.name || '';
    if (typeof env === 'string') {
      // We model environment as an HoC name for now.
      if (secondaryEnv !== null) {
        displayName = secondaryEnv + '(' + displayName + ')';
      }
      displayName = env + '(' + displayName + ')';
    }
    var elementType = types_ElementTypeVirtual; // Finding the owner instance might require traversing the whole parent path which
    // doesn't have great big O notation. Ideally we'd lazily fetch the owner when we
    // need it but we have some synchronous operations in the front end like Alt+Left
    // which selects the owner immediately. Typically most owners are only a few parents
    // away so maybe it's not so bad.

    var debugOwner = getUnfilteredOwner(componentInfo);
    var ownerInstance = findNearestOwnerInstance(parentInstance, debugOwner);
    if (ownerInstance !== null && debugOwner === componentInfo.owner && componentInfo.debugStack != null && ownerInstance.source === null) {
      // The new Fiber is directly owned by the ownerInstance. Therefore somewhere on
      // the debugStack will be a stack frame inside the ownerInstance's source.
      ownerInstance.source = componentInfo.debugStack;
    }
    var ownerID = ownerInstance === null ? 0 : ownerInstance.id;
    var parentID = parentInstance ? parentInstance.kind === FILTERED_FIBER_INSTANCE ?
    // A Filtered Fiber Instance will always have a Virtual Instance as a parent.
    parentInstance.parent.id : parentInstance.id : 0;
    var displayNameStringID = getStringID(displayName); // This check is a guard to handle a React element that has been modified
    // in such a way as to bypass the default stringification of the "key" property.

    var keyString = key === null ? null : String(key);
    var keyStringID = getStringID(keyString);
    pushOperation(TREE_OPERATION_ADD);
    pushOperation(id);
    pushOperation(elementType);
    pushOperation(parentID);
    pushOperation(ownerID);
    pushOperation(displayNameStringID);
    pushOperation(keyStringID);
    var componentLogsEntry = componentInfoToComponentLogsMap.get(componentInfo);
    recordConsoleLogs(instance, componentLogsEntry);
  }
  function recordUnmount(fiberInstance) {
    var fiber = fiberInstance.data;
    if (__DEBUG__) {
      debug('recordUnmount()', fiberInstance, reconcilingParent);
    }
    if (trackedPathMatchInstance === fiberInstance) {
      // We're in the process of trying to restore previous selection.
      // If this fiber matched but is being unmounted, there's no use trying.
      // Reset the state so we don't keep holding onto it.
      setTrackedPath(null);
    }
    var id = fiberInstance.id;
    var isRoot = fiber.tag === HostRoot;
    if (isRoot) {
      // Roots must be removed only after all children have been removed.
      // So we track it separately.
      pendingUnmountedRootID = id;
    } else {
      // To maintain child-first ordering,
      // we'll push it into one of these queues,
      // and later arrange them in the correct order.
      pendingRealUnmountedIDs.push(id);
    }
    idToDevToolsInstanceMap.delete(fiberInstance.id);
    untrackFiber(fiberInstance, fiber);
  } // Running state of the remaining children from the previous version of this parent that
  // we haven't yet added back. This should be reset anytime we change parent.
  // Any remaining ones at the end will be deleted.

  var remainingReconcilingChildren = null; // The previously placed child.

  var previouslyReconciledSibling = null; // To save on stack allocation and ensure that they are updated as a pair, we also store
  // the current parent here as well.

  var reconcilingParent = null;
  function insertChild(instance) {
    var parentInstance = reconcilingParent;
    if (parentInstance === null) {
      // This instance is at the root.
      return;
    } // Place it in the parent.

    instance.parent = parentInstance;
    if (previouslyReconciledSibling === null) {
      previouslyReconciledSibling = instance;
      parentInstance.firstChild = instance;
    } else {
      previouslyReconciledSibling.nextSibling = instance;
      previouslyReconciledSibling = instance;
    }
    instance.nextSibling = null;
  }
  function moveChild(instance, previousSibling) {
    removeChild(instance, previousSibling);
    insertChild(instance);
  }
  function removeChild(instance, previousSibling) {
    if (instance.parent === null) {
      if (remainingReconcilingChildren === instance) {
        throw new Error('Remaining children should not have items with no parent');
      } else if (instance.nextSibling !== null) {
        throw new Error('A deleted instance should not have next siblings');
      } // Already deleted.

      return;
    }
    var parentInstance = reconcilingParent;
    if (parentInstance === null) {
      throw new Error('Should not have a parent if we are at the root');
    }
    if (instance.parent !== parentInstance) {
      throw new Error('Cannot remove a node from a different parent than is being reconciled.');
    } // Remove an existing child from its current position, which we assume is in the
    // remainingReconcilingChildren set.

    if (previousSibling === null) {
      // We're first in the remaining set. Remove us.
      if (remainingReconcilingChildren !== instance) {
        throw new Error('Expected a placed child to be moved from the remaining set.');
      }
      remainingReconcilingChildren = instance.nextSibling;
    } else {
      previousSibling.nextSibling = instance.nextSibling;
    }
    instance.nextSibling = null;
    instance.parent = null;
  }
  function unmountRemainingChildren() {
    var child = remainingReconcilingChildren;
    while (child !== null) {
      unmountInstanceRecursively(child);
      child = remainingReconcilingChildren;
    }
  }
  function mountVirtualInstanceRecursively(virtualInstance, firstChild, lastChild,
  // non-inclusive
  traceNearestHostComponentUpdate, virtualLevel // the nth level of virtual instances
  ) {
    // If we have the tree selection from previous reload, try to match this Instance.
    // Also remember whether to do the same for siblings.
    var mightSiblingsBeOnTrackedPath = updateVirtualTrackedPathStateBeforeMount(virtualInstance, reconcilingParent);
    var stashedParent = reconcilingParent;
    var stashedPrevious = previouslyReconciledSibling;
    var stashedRemaining = remainingReconcilingChildren; // Push a new DevTools instance parent while reconciling this subtree.

    reconcilingParent = virtualInstance;
    previouslyReconciledSibling = null;
    remainingReconcilingChildren = null;
    try {
      mountVirtualChildrenRecursively(firstChild, lastChild, traceNearestHostComponentUpdate, virtualLevel + 1); // Must be called after all children have been appended.

      recordVirtualProfilingDurations(virtualInstance);
    } finally {
      reconcilingParent = stashedParent;
      previouslyReconciledSibling = stashedPrevious;
      remainingReconcilingChildren = stashedRemaining;
      updateTrackedPathStateAfterMount(mightSiblingsBeOnTrackedPath);
    }
  }
  function recordVirtualUnmount(instance) {
    if (trackedPathMatchInstance === instance) {
      // We're in the process of trying to restore previous selection.
      // If this fiber matched but is being unmounted, there's no use trying.
      // Reset the state so we don't keep holding onto it.
      setTrackedPath(null);
    }
    var id = instance.id;
    pendingRealUnmountedIDs.push(id);
  }
  function getSecondaryEnvironmentName(debugInfo, index) {
    if (debugInfo != null) {
      var componentInfo = debugInfo[index];
      for (var i = index + 1; i < debugInfo.length; i++) {
        var debugEntry = debugInfo[i];
        if (typeof debugEntry.env === 'string') {
          // If the next environment is different then this component was the boundary
          // and it changed before entering the next component. So we assign this
          // component a secondary environment.
          return componentInfo.env !== debugEntry.env ? debugEntry.env : null;
        }
      }
    }
    return null;
  }
  function mountVirtualChildrenRecursively(firstChild, lastChild,
  // non-inclusive
  traceNearestHostComponentUpdate, virtualLevel // the nth level of virtual instances
  ) {
    // Iterate over siblings rather than recursing.
    // This reduces the chance of stack overflow for wide trees (e.g. lists with many items).
    var fiber = firstChild;
    var previousVirtualInstance = null;
    var previousVirtualInstanceFirstFiber = firstChild;
    while (fiber !== null && fiber !== lastChild) {
      var level = 0;
      if (fiber._debugInfo) {
        for (var i = 0; i < fiber._debugInfo.length; i++) {
          var debugEntry = fiber._debugInfo[i];
          if (typeof debugEntry.name !== 'string') {
            // Not a Component. Some other Debug Info.
            continue;
          } // Scan up until the next Component to see if this component changed environment.

          var componentInfo = debugEntry;
          var secondaryEnv = getSecondaryEnvironmentName(fiber._debugInfo, i);
          if (componentInfo.env != null) {
            knownEnvironmentNames.add(componentInfo.env);
          }
          if (secondaryEnv !== null) {
            knownEnvironmentNames.add(secondaryEnv);
          }
          if (shouldFilterVirtual(componentInfo, secondaryEnv)) {
            // Skip.
            continue;
          }
          if (level === virtualLevel) {
            if (previousVirtualInstance === null ||
            // Consecutive children with the same debug entry as a parent gets
            // treated as if they share the same virtual instance.
            previousVirtualInstance.data !== debugEntry) {
              if (previousVirtualInstance !== null) {
                // Mount any previous children that should go into the previous parent.
                mountVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceFirstFiber, fiber, traceNearestHostComponentUpdate, virtualLevel);
              }
              previousVirtualInstance = createVirtualInstance(componentInfo);
              recordVirtualMount(previousVirtualInstance, reconcilingParent, secondaryEnv);
              insertChild(previousVirtualInstance);
              previousVirtualInstanceFirstFiber = fiber;
            }
            level++;
            break;
          } else {
            level++;
          }
        }
      }
      if (level === virtualLevel) {
        if (previousVirtualInstance !== null) {
          // If we were working on a virtual instance and this is not a virtual
          // instance, then we end the sequence and mount any previous children
          // that should go into the previous virtual instance.
          mountVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceFirstFiber, fiber, traceNearestHostComponentUpdate, virtualLevel);
          previousVirtualInstance = null;
        } // We've reached the end of the virtual levels, but not beyond,
        // and now continue with the regular fiber.

        mountFiberRecursively(fiber, traceNearestHostComponentUpdate);
      }
      fiber = fiber.sibling;
    }
    if (previousVirtualInstance !== null) {
      // Mount any previous children that should go into the previous parent.
      mountVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceFirstFiber, null, traceNearestHostComponentUpdate, virtualLevel);
    }
  }
  function mountChildrenRecursively(firstChild, traceNearestHostComponentUpdate) {
    mountVirtualChildrenRecursively(firstChild, null, traceNearestHostComponentUpdate, 0 // first level
    );
  }
  function mountFiberRecursively(fiber, traceNearestHostComponentUpdate) {
    var shouldIncludeInTree = !shouldFilterFiber(fiber);
    var newInstance = null;
    if (shouldIncludeInTree) {
      newInstance = recordMount(fiber, reconcilingParent);
      insertChild(newInstance);
      if (__DEBUG__) {
        debug('mountFiberRecursively()', newInstance, reconcilingParent);
      }
    } else if (reconcilingParent !== null && reconcilingParent.kind === VIRTUAL_INSTANCE) {
      // If the parent is a Virtual Instance and we filtered this Fiber we include a
      // hidden node.
      if (reconcilingParent.data === fiber._debugOwner && fiber._debugStack != null && reconcilingParent.source === null) {
        // The new Fiber is directly owned by the parent. Therefore somewhere on the
        // debugStack will be a stack frame inside parent that we can use as its soruce.
        reconcilingParent.source = fiber._debugStack;
      }
      newInstance = createFilteredFiberInstance(fiber);
      insertChild(newInstance);
      if (__DEBUG__) {
        debug('mountFiberRecursively()', newInstance, reconcilingParent);
      }
    } // If we have the tree selection from previous reload, try to match this Fiber.
    // Also remember whether to do the same for siblings.

    var mightSiblingsBeOnTrackedPath = updateTrackedPathStateBeforeMount(fiber, newInstance);
    var stashedParent = reconcilingParent;
    var stashedPrevious = previouslyReconciledSibling;
    var stashedRemaining = remainingReconcilingChildren;
    if (newInstance !== null) {
      // Push a new DevTools instance parent while reconciling this subtree.
      reconcilingParent = newInstance;
      previouslyReconciledSibling = null;
      remainingReconcilingChildren = null;
    }
    try {
      if (traceUpdatesEnabled) {
        if (traceNearestHostComponentUpdate) {
          var elementType = getElementTypeForFiber(fiber); // If an ancestor updated, we should mark the nearest host nodes for highlighting.

          if (elementType === ElementTypeHostComponent) {
            traceUpdatesForNodes.add(fiber.stateNode);
            traceNearestHostComponentUpdate = false;
          }
        } // We intentionally do not re-enable the traceNearestHostComponentUpdate flag in this branch,
        // because we don't want to highlight every host node inside of a newly mounted subtree.
      }
      if (fiber.tag === HostHoistable) {
        var nearestInstance = reconcilingParent;
        if (nearestInstance === null) {
          throw new Error('Did not expect a host hoistable to be the root');
        }
        aquireHostResource(nearestInstance, fiber.memoizedState);
      } else if (fiber.tag === HostComponent || fiber.tag === HostText || fiber.tag === HostSingleton) {
        var _nearestInstance = reconcilingParent;
        if (_nearestInstance === null) {
          throw new Error('Did not expect a host hoistable to be the root');
        }
        aquireHostInstance(_nearestInstance, fiber.stateNode);
      }
      if (fiber.tag === SuspenseComponent) {
        var isTimedOut = fiber.memoizedState !== null;
        if (isTimedOut) {
          // Special case: if Suspense mounts in a timed-out state,
          // get the fallback child from the inner fragment and mount
          // it as if it was our own child. Updates handle this too.
          var primaryChildFragment = fiber.child;
          var fallbackChildFragment = primaryChildFragment ? primaryChildFragment.sibling : null;
          if (fallbackChildFragment) {
            var fallbackChild = fallbackChildFragment.child;
            if (fallbackChild !== null) {
              updateTrackedPathStateBeforeMount(fallbackChildFragment, null);
              mountChildrenRecursively(fallbackChild, traceNearestHostComponentUpdate);
            }
          }
        } else {
          var primaryChild = null;
          var areSuspenseChildrenConditionallyWrapped = OffscreenComponent === -1;
          if (areSuspenseChildrenConditionallyWrapped) {
            primaryChild = fiber.child;
          } else if (fiber.child !== null) {
            primaryChild = fiber.child.child;
            updateTrackedPathStateBeforeMount(fiber.child, null);
          }
          if (primaryChild !== null) {
            mountChildrenRecursively(primaryChild, traceNearestHostComponentUpdate);
          }
        }
      } else {
        if (fiber.child !== null) {
          mountChildrenRecursively(fiber.child, traceNearestHostComponentUpdate);
        }
      }
    } finally {
      if (newInstance !== null) {
        reconcilingParent = stashedParent;
        previouslyReconciledSibling = stashedPrevious;
        remainingReconcilingChildren = stashedRemaining;
      }
    } // We're exiting this Fiber now, and entering its siblings.
    // If we have selection to restore, we might need to re-activate tracking.

    updateTrackedPathStateAfterMount(mightSiblingsBeOnTrackedPath);
  } // We use this to simulate unmounting for Suspense trees
  // when we switch from primary to fallback, or deleting a subtree.

  function unmountInstanceRecursively(instance) {
    if (__DEBUG__) {
      debug('unmountInstanceRecursively()', instance, reconcilingParent);
    }
    var stashedParent = reconcilingParent;
    var stashedPrevious = previouslyReconciledSibling;
    var stashedRemaining = remainingReconcilingChildren; // Push a new DevTools instance parent while reconciling this subtree.

    reconcilingParent = instance;
    previouslyReconciledSibling = null; // Move all the children of this instance to the remaining set.

    remainingReconcilingChildren = instance.firstChild;
    instance.firstChild = null;
    try {
      // Unmount the remaining set.
      unmountRemainingChildren();
    } finally {
      reconcilingParent = stashedParent;
      previouslyReconciledSibling = stashedPrevious;
      remainingReconcilingChildren = stashedRemaining;
    }
    if (instance.kind === FIBER_INSTANCE) {
      recordUnmount(instance);
    } else if (instance.kind === VIRTUAL_INSTANCE) {
      recordVirtualUnmount(instance);
    } else {
      untrackFiber(instance, instance.data);
    }
    removeChild(instance, null);
  }
  function recordProfilingDurations(fiberInstance, prevFiber) {
    var id = fiberInstance.id;
    var fiber = fiberInstance.data;
    var actualDuration = fiber.actualDuration,
      treeBaseDuration = fiber.treeBaseDuration;
    fiberInstance.treeBaseDuration = treeBaseDuration || 0;
    if (isProfiling) {
      // It's important to update treeBaseDuration even if the current Fiber did not render,
      // because it's possible that one of its descendants did.
      if (prevFiber == null || treeBaseDuration !== prevFiber.treeBaseDuration) {
        // Tree base duration updates are included in the operations typed array.
        // So we have to convert them from milliseconds to microseconds so we can send them as ints.
        var convertedTreeBaseDuration = Math.floor((treeBaseDuration || 0) * 1000);
        pushOperation(TREE_OPERATION_UPDATE_TREE_BASE_DURATION);
        pushOperation(id);
        pushOperation(convertedTreeBaseDuration);
      }
      if (prevFiber == null || didFiberRender(prevFiber, fiber)) {
        if (actualDuration != null) {
          // The actual duration reported by React includes time spent working on children.
          // This is useful information, but it's also useful to be able to exclude child durations.
          // The frontend can't compute this, since the immediate children may have been filtered out.
          // So we need to do this on the backend.
          // Note that this calculated self duration is not the same thing as the base duration.
          // The two are calculated differently (tree duration does not accumulate).
          var selfDuration = actualDuration;
          var child = fiber.child;
          while (child !== null) {
            selfDuration -= child.actualDuration || 0;
            child = child.sibling;
          } // If profiling is active, store durations for elements that were rendered during the commit.
          // Note that we should do this for any fiber we performed work on, regardless of its actualDuration value.
          // In some cases actualDuration might be 0 for fibers we worked on (particularly if we're using Date.now)
          // In other cases (e.g. Memo) actualDuration might be greater than 0 even if we "bailed out".

          var metadata = currentCommitProfilingMetadata;
          metadata.durations.push(id, actualDuration, selfDuration);
          metadata.maxActualDuration = Math.max(metadata.maxActualDuration, actualDuration);
          if (recordChangeDescriptions) {
            var changeDescription = getChangeDescription(prevFiber, fiber);
            if (changeDescription !== null) {
              if (metadata.changeDescriptions !== null) {
                metadata.changeDescriptions.set(id, changeDescription);
              }
            }
          }
        }
      } // If this Fiber was in the set of memoizedUpdaters we need to record
      // it to be included in the description of the commit.

      var fiberRoot = currentRoot.data.stateNode;
      var updaters = fiberRoot.memoizedUpdaters;
      if (updaters != null && (updaters.has(fiber) ||
      // We check the alternate here because we're matching identity and
      // prevFiber might be same as fiber.
      fiber.alternate !== null && updaters.has(fiber.alternate))) {
        var _metadata = currentCommitProfilingMetadata;
        if (_metadata.updaters === null) {
          _metadata.updaters = [];
        }
        _metadata.updaters.push(instanceToSerializedElement(fiberInstance));
      }
    }
  }
  function recordVirtualProfilingDurations(virtualInstance) {
    var id = virtualInstance.id;
    var treeBaseDuration = 0; // Add up the base duration of the child instances. The virtual base duration
    // will be the same as children's duration since we don't take up any render
    // time in the virtual instance.

    for (var child = virtualInstance.firstChild; child !== null; child = child.nextSibling) {
      treeBaseDuration += child.treeBaseDuration;
    }
    if (isProfiling) {
      var previousTreeBaseDuration = virtualInstance.treeBaseDuration;
      if (treeBaseDuration !== previousTreeBaseDuration) {
        // Tree base duration updates are included in the operations typed array.
        // So we have to convert them from milliseconds to microseconds so we can send them as ints.
        var convertedTreeBaseDuration = Math.floor((treeBaseDuration || 0) * 1000);
        pushOperation(TREE_OPERATION_UPDATE_TREE_BASE_DURATION);
        pushOperation(id);
        pushOperation(convertedTreeBaseDuration);
      }
    }
    virtualInstance.treeBaseDuration = treeBaseDuration;
  }
  function recordResetChildren(parentInstance) {
    if (__DEBUG__) {
      if (parentInstance.firstChild !== null) {
        debug('recordResetChildren()', parentInstance.firstChild, parentInstance);
      }
    } // The frontend only really cares about the displayName, key, and children.
    // The first two don't really change, so we are only concerned with the order of children here.
    // This is trickier than a simple comparison though, since certain types of fibers are filtered.

    var nextChildren = [];
    var child = parentInstance.firstChild;
    while (child !== null) {
      if (child.kind === FILTERED_FIBER_INSTANCE) {
        for (var innerChild = parentInstance.firstChild; innerChild !== null; innerChild = innerChild.nextSibling) {
          nextChildren.push(innerChild.id);
        }
      } else {
        nextChildren.push(child.id);
      }
      child = child.nextSibling;
    }
    var numChildren = nextChildren.length;
    if (numChildren < 2) {
      // No need to reorder.
      return;
    }
    pushOperation(TREE_OPERATION_REORDER_CHILDREN);
    pushOperation(parentInstance.id);
    pushOperation(numChildren);
    for (var i = 0; i < nextChildren.length; i++) {
      pushOperation(nextChildren[i]);
    }
  }
  function updateVirtualInstanceRecursively(virtualInstance, nextFirstChild, nextLastChild,
  // non-inclusive
  prevFirstChild, traceNearestHostComponentUpdate, virtualLevel // the nth level of virtual instances
  ) {
    var stashedParent = reconcilingParent;
    var stashedPrevious = previouslyReconciledSibling;
    var stashedRemaining = remainingReconcilingChildren; // Push a new DevTools instance parent while reconciling this subtree.

    reconcilingParent = virtualInstance;
    previouslyReconciledSibling = null; // Move all the children of this instance to the remaining set.
    // We'll move them back one by one, and anything that remains is deleted.

    remainingReconcilingChildren = virtualInstance.firstChild;
    virtualInstance.firstChild = null;
    try {
      if (updateVirtualChildrenRecursively(nextFirstChild, nextLastChild, prevFirstChild, traceNearestHostComponentUpdate, virtualLevel + 1)) {
        recordResetChildren(virtualInstance);
      } // Update the errors/warnings count. If this Instance has switched to a different
      // ReactComponentInfo instance, such as when refreshing Server Components, then
      // we replace all the previous logs with the ones associated with the new ones rather
      // than merging. Because deduping is expected to happen at the request level.

      var componentLogsEntry = componentInfoToComponentLogsMap.get(virtualInstance.data);
      recordConsoleLogs(virtualInstance, componentLogsEntry); // Must be called after all children have been appended.

      recordVirtualProfilingDurations(virtualInstance);
    } finally {
      unmountRemainingChildren();
      reconcilingParent = stashedParent;
      previouslyReconciledSibling = stashedPrevious;
      remainingReconcilingChildren = stashedRemaining;
    }
  }
  function updateVirtualChildrenRecursively(nextFirstChild, nextLastChild,
  // non-inclusive
  prevFirstChild, traceNearestHostComponentUpdate, virtualLevel // the nth level of virtual instances
  ) {
    var shouldResetChildren = false; // If the first child is different, we need to traverse them.
    // Each next child will be either a new child (mount) or an alternate (update).

    var nextChild = nextFirstChild;
    var prevChildAtSameIndex = prevFirstChild;
    var previousVirtualInstance = null;
    var previousVirtualInstanceWasMount = false;
    var previousVirtualInstanceNextFirstFiber = nextFirstChild;
    var previousVirtualInstancePrevFirstFiber = prevFirstChild;
    while (nextChild !== null && nextChild !== nextLastChild) {
      var level = 0;
      if (nextChild._debugInfo) {
        for (var i = 0; i < nextChild._debugInfo.length; i++) {
          var debugEntry = nextChild._debugInfo[i];
          if (typeof debugEntry.name !== 'string') {
            // Not a Component. Some other Debug Info.
            continue;
          }
          var componentInfo = debugEntry;
          var secondaryEnv = getSecondaryEnvironmentName(nextChild._debugInfo, i);
          if (componentInfo.env != null) {
            knownEnvironmentNames.add(componentInfo.env);
          }
          if (secondaryEnv !== null) {
            knownEnvironmentNames.add(secondaryEnv);
          }
          if (shouldFilterVirtual(componentInfo, secondaryEnv)) {
            continue;
          }
          if (level === virtualLevel) {
            if (previousVirtualInstance === null ||
            // Consecutive children with the same debug entry as a parent gets
            // treated as if they share the same virtual instance.
            previousVirtualInstance.data !== componentInfo) {
              if (previousVirtualInstance !== null) {
                // Mount any previous children that should go into the previous parent.
                if (previousVirtualInstanceWasMount) {
                  mountVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceNextFirstFiber, nextChild, traceNearestHostComponentUpdate, virtualLevel);
                } else {
                  updateVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceNextFirstFiber, nextChild, previousVirtualInstancePrevFirstFiber, traceNearestHostComponentUpdate, virtualLevel);
                }
              }
              var previousSiblingOfBestMatch = null;
              var bestMatch = remainingReconcilingChildren;
              if (componentInfo.key != null) {
                // If there is a key try to find a matching key in the set.
                bestMatch = remainingReconcilingChildren;
                while (bestMatch !== null) {
                  if (bestMatch.kind === VIRTUAL_INSTANCE && bestMatch.data.key === componentInfo.key) {
                    break;
                  }
                  previousSiblingOfBestMatch = bestMatch;
                  bestMatch = bestMatch.nextSibling;
                }
              }
              if (bestMatch !== null && bestMatch.kind === VIRTUAL_INSTANCE && bestMatch.data.name === componentInfo.name && bestMatch.data.env === componentInfo.env && bestMatch.data.key === componentInfo.key) {
                // If the previous children had a virtual instance in the same slot
                // with the same name, then we claim it and reuse it for this update.
                // Update it with the latest entry.
                bestMatch.data = componentInfo;
                moveChild(bestMatch, previousSiblingOfBestMatch);
                previousVirtualInstance = bestMatch;
                previousVirtualInstanceWasMount = false;
              } else {
                // Otherwise we create a new instance.
                var newVirtualInstance = createVirtualInstance(componentInfo);
                recordVirtualMount(newVirtualInstance, reconcilingParent, secondaryEnv);
                insertChild(newVirtualInstance);
                previousVirtualInstance = newVirtualInstance;
                previousVirtualInstanceWasMount = true;
                shouldResetChildren = true;
              } // Existing children might be reparented into this new virtual instance.
              // TODO: This will cause the front end to error which needs to be fixed.

              previousVirtualInstanceNextFirstFiber = nextChild;
              previousVirtualInstancePrevFirstFiber = prevChildAtSameIndex;
            }
            level++;
            break;
          } else {
            level++;
          }
        }
      }
      if (level === virtualLevel) {
        if (previousVirtualInstance !== null) {
          // If we were working on a virtual instance and this is not a virtual
          // instance, then we end the sequence and update any previous children
          // that should go into the previous virtual instance.
          if (previousVirtualInstanceWasMount) {
            mountVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceNextFirstFiber, nextChild, traceNearestHostComponentUpdate, virtualLevel);
          } else {
            updateVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceNextFirstFiber, nextChild, previousVirtualInstancePrevFirstFiber, traceNearestHostComponentUpdate, virtualLevel);
          }
          previousVirtualInstance = null;
        } // We've reached the end of the virtual levels, but not beyond,
        // and now continue with the regular fiber.
        // Do a fast pass over the remaining children to find the previous instance.
        // TODO: This doesn't have the best O(n) for a large set of children that are
        // reordered. Consider using a temporary map if it's not the very next one.

        var prevChild = void 0;
        if (prevChildAtSameIndex === nextChild) {
          // This set is unchanged. We're just going through it to place all the
          // children again.
          prevChild = nextChild;
        } else {
          // We don't actually need to rely on the alternate here. We could also
          // reconcile against stateNode, key or whatever. Doesn't have to be same
          // Fiber pair.
          prevChild = nextChild.alternate;
        }
        var previousSiblingOfExistingInstance = null;
        var existingInstance = null;
        if (prevChild !== null) {
          existingInstance = remainingReconcilingChildren;
          while (existingInstance !== null) {
            if (existingInstance.data === prevChild) {
              break;
            }
            previousSiblingOfExistingInstance = existingInstance;
            existingInstance = existingInstance.nextSibling;
          }
        }
        if (existingInstance !== null) {
          // Common case. Match in the same parent.
          var fiberInstance = existingInstance; // Only matches if it's a Fiber.
          // We keep track if the order of the children matches the previous order.
          // They are always different referentially, but if the instances line up
          // conceptually we'll want to know that.

          if (prevChild !== prevChildAtSameIndex) {
            shouldResetChildren = true;
          }
          moveChild(fiberInstance, previousSiblingOfExistingInstance);
          if (updateFiberRecursively(fiberInstance, nextChild, prevChild, traceNearestHostComponentUpdate)) {
            // If a nested tree child order changed but it can't handle its own
            // child order invalidation (e.g. because it's filtered out like host nodes),
            // propagate the need to reset child order upwards to this Fiber.
            shouldResetChildren = true;
          }
        } else if (prevChild !== null && shouldFilterFiber(nextChild)) {
          // If this Fiber should be filtered, we need to still update its children.
          // This relies on an alternate since we don't have an Instance with the previous
          // child on it. Ideally, the reconciliation wouldn't need previous Fibers that
          // are filtered from the tree.
          if (updateFiberRecursively(null, nextChild, prevChild, traceNearestHostComponentUpdate)) {
            shouldResetChildren = true;
          }
        } else {
          // It's possible for a FiberInstance to be reparented when virtual parents
          // get their sequence split or change structure with the same render result.
          // In this case we unmount the and remount the FiberInstances.
          // This might cause us to lose the selection but it's an edge case.
          // We let the previous instance remain in the "remaining queue" it is
          // in to be deleted at the end since it'll have no match.
          mountFiberRecursively(nextChild, traceNearestHostComponentUpdate); // Need to mark the parent set to remount the new instance.

          shouldResetChildren = true;
        }
      } // Try the next child.

      nextChild = nextChild.sibling; // Advance the pointer in the previous list so that we can
      // keep comparing if they line up.

      if (!shouldResetChildren && prevChildAtSameIndex !== null) {
        prevChildAtSameIndex = prevChildAtSameIndex.sibling;
      }
    }
    if (previousVirtualInstance !== null) {
      if (previousVirtualInstanceWasMount) {
        mountVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceNextFirstFiber, null, traceNearestHostComponentUpdate, virtualLevel);
      } else {
        updateVirtualInstanceRecursively(previousVirtualInstance, previousVirtualInstanceNextFirstFiber, null, previousVirtualInstancePrevFirstFiber, traceNearestHostComponentUpdate, virtualLevel);
      }
    } // If we have no more children, but used to, they don't line up.

    if (prevChildAtSameIndex !== null) {
      shouldResetChildren = true;
    }
    return shouldResetChildren;
  } // Returns whether closest unfiltered fiber parent needs to reset its child list.

  function updateChildrenRecursively(nextFirstChild, prevFirstChild, traceNearestHostComponentUpdate) {
    if (nextFirstChild === null) {
      return prevFirstChild !== null;
    }
    return updateVirtualChildrenRecursively(nextFirstChild, null, prevFirstChild, traceNearestHostComponentUpdate, 0);
  } // Returns whether closest unfiltered fiber parent needs to reset its child list.

  function updateFiberRecursively(fiberInstance,
  // null if this should be filtered
  nextFiber, prevFiber, traceNearestHostComponentUpdate) {
    if (__DEBUG__) {
      if (fiberInstance !== null) {
        debug('updateFiberRecursively()', fiberInstance, reconcilingParent);
      }
    }
    if (traceUpdatesEnabled) {
      var elementType = getElementTypeForFiber(nextFiber);
      if (traceNearestHostComponentUpdate) {
        // If an ancestor updated, we should mark the nearest host nodes for highlighting.
        if (elementType === ElementTypeHostComponent) {
          traceUpdatesForNodes.add(nextFiber.stateNode);
          traceNearestHostComponentUpdate = false;
        }
      } else {
        if (elementType === types_ElementTypeFunction || elementType === types_ElementTypeClass || elementType === ElementTypeContext || elementType === types_ElementTypeMemo || elementType === types_ElementTypeForwardRef) {
          // Otherwise if this is a traced ancestor, flag for the nearest host descendant(s).
          traceNearestHostComponentUpdate = didFiberRender(prevFiber, nextFiber);
        }
      }
    }
    var stashedParent = reconcilingParent;
    var stashedPrevious = previouslyReconciledSibling;
    var stashedRemaining = remainingReconcilingChildren;
    if (fiberInstance !== null) {
      // Update the Fiber so we that we always keep the current Fiber on the data.
      fiberInstance.data = nextFiber;
      if (mostRecentlyInspectedElement !== null && mostRecentlyInspectedElement.id === fiberInstance.id && didFiberRender(prevFiber, nextFiber)) {
        // If this Fiber has updated, clear cached inspected data.
        // If it is inspected again, it may need to be re-run to obtain updated hooks values.
        hasElementUpdatedSinceLastInspected = true;
      } // Push a new DevTools instance parent while reconciling this subtree.

      reconcilingParent = fiberInstance;
      previouslyReconciledSibling = null; // Move all the children of this instance to the remaining set.
      // We'll move them back one by one, and anything that remains is deleted.

      remainingReconcilingChildren = fiberInstance.firstChild;
      fiberInstance.firstChild = null;
    }
    try {
      if (nextFiber.tag === HostHoistable && prevFiber.memoizedState !== nextFiber.memoizedState) {
        var nearestInstance = reconcilingParent;
        if (nearestInstance === null) {
          throw new Error('Did not expect a host hoistable to be the root');
        }
        releaseHostResource(nearestInstance, prevFiber.memoizedState);
        aquireHostResource(nearestInstance, nextFiber.memoizedState);
      } else if ((nextFiber.tag === HostComponent || nextFiber.tag === HostText || nextFiber.tag === HostSingleton) && prevFiber.stateNode !== nextFiber.stateNode) {
        // In persistent mode, it's possible for the stateNode to update with
        // a new clone. In that case we need to release the old one and aquire
        // new one instead.
        var _nearestInstance2 = reconcilingParent;
        if (_nearestInstance2 === null) {
          throw new Error('Did not expect a host hoistable to be the root');
        }
        releaseHostInstance(_nearestInstance2, prevFiber.stateNode);
        aquireHostInstance(_nearestInstance2, nextFiber.stateNode);
      }
      var isSuspense = nextFiber.tag === SuspenseComponent;
      var shouldResetChildren = false; // The behavior of timed-out Suspense trees is unique.
      // Rather than unmount the timed out content (and possibly lose important state),
      // React re-parents this content within a hidden Fragment while the fallback is showing.
      // This behavior doesn't need to be observable in the DevTools though.
      // It might even result in a bad user experience for e.g. node selection in the Elements panel.
      // The easiest fix is to strip out the intermediate Fragment fibers,
      // so the Elements panel and Profiler don't need to special case them.
      // Suspense components only have a non-null memoizedState if they're timed-out.

      var prevDidTimeout = isSuspense && prevFiber.memoizedState !== null;
      var nextDidTimeOut = isSuspense && nextFiber.memoizedState !== null; // The logic below is inspired by the code paths in updateSuspenseComponent()
      // inside ReactFiberBeginWork in the React source code.

      if (prevDidTimeout && nextDidTimeOut) {
        // Fallback -> Fallback:
        // 1. Reconcile fallback set.
        var nextFiberChild = nextFiber.child;
        var nextFallbackChildSet = nextFiberChild ? nextFiberChild.sibling : null; // Note: We can't use nextFiber.child.sibling.alternate
        // because the set is special and alternate may not exist.

        var prevFiberChild = prevFiber.child;
        var prevFallbackChildSet = prevFiberChild ? prevFiberChild.sibling : null;
        if (prevFallbackChildSet == null && nextFallbackChildSet != null) {
          mountChildrenRecursively(nextFallbackChildSet, traceNearestHostComponentUpdate);
          shouldResetChildren = true;
        }
        if (nextFallbackChildSet != null && prevFallbackChildSet != null && updateChildrenRecursively(nextFallbackChildSet, prevFallbackChildSet, traceNearestHostComponentUpdate)) {
          shouldResetChildren = true;
        }
      } else if (prevDidTimeout && !nextDidTimeOut) {
        // Fallback -> Primary:
        // 1. Unmount fallback set
        // Note: don't emulate fallback unmount because React actually did it.
        // 2. Mount primary set
        var nextPrimaryChildSet = nextFiber.child;
        if (nextPrimaryChildSet !== null) {
          mountChildrenRecursively(nextPrimaryChildSet, traceNearestHostComponentUpdate);
        }
        shouldResetChildren = true;
      } else if (!prevDidTimeout && nextDidTimeOut) {
        // Primary -> Fallback:
        // 1. Hide primary set
        // We simply don't re-add the fallback children and let
        // unmountRemainingChildren() handle it.
        // 2. Mount fallback set
        var _nextFiberChild = nextFiber.child;
        var _nextFallbackChildSet = _nextFiberChild ? _nextFiberChild.sibling : null;
        if (_nextFallbackChildSet != null) {
          mountChildrenRecursively(_nextFallbackChildSet, traceNearestHostComponentUpdate);
          shouldResetChildren = true;
        }
      } else {
        // Common case: Primary -> Primary.
        // This is the same code path as for non-Suspense fibers.
        if (nextFiber.child !== prevFiber.child) {
          if (updateChildrenRecursively(nextFiber.child, prevFiber.child, traceNearestHostComponentUpdate)) {
            shouldResetChildren = true;
          }
        } else {
          // Children are unchanged.
          if (fiberInstance !== null) {
            // All the remaining children will be children of this same fiber so we can just reuse them.
            // I.e. we just restore them by undoing what we did above.
            fiberInstance.firstChild = remainingReconcilingChildren;
            remainingReconcilingChildren = null;
            if (traceUpdatesEnabled) {
              // If we're tracing updates and we've bailed out before reaching a host node,
              // we should fall back to recursively marking the nearest host descendants for highlight.
              if (traceNearestHostComponentUpdate) {
                var hostInstances = findAllCurrentHostInstances(fiberInstance);
                hostInstances.forEach(function (hostInstance) {
                  traceUpdatesForNodes.add(hostInstance);
                });
              }
            }
          } else {
            // If this fiber is filtered there might be changes to this set elsewhere so we have
            // to visit each child to place it back in the set. We let the child bail out instead.
            if (updateChildrenRecursively(nextFiber.child, prevFiber.child, false)) {
              throw new Error('The children should not have changed if we pass in the same set.');
            }
          }
        }
      }
      if (fiberInstance !== null) {
        var componentLogsEntry = fiberToComponentLogsMap.get(fiberInstance.data);
        if (componentLogsEntry === undefined && fiberInstance.data.alternate) {
          componentLogsEntry = fiberToComponentLogsMap.get(fiberInstance.data.alternate);
        }
        recordConsoleLogs(fiberInstance, componentLogsEntry);
        var isProfilingSupported = nextFiber.hasOwnProperty('treeBaseDuration');
        if (isProfilingSupported) {
          recordProfilingDurations(fiberInstance, prevFiber);
        }
      }
      if (shouldResetChildren) {
        // We need to crawl the subtree for closest non-filtered Fibers
        // so that we can display them in a flat children set.
        if (fiberInstance !== null) {
          recordResetChildren(fiberInstance); // We've handled the child order change for this Fiber.
          // Since it's included, there's no need to invalidate parent child order.

          return false;
        } else {
          // Let the closest unfiltered parent Fiber reset its child order instead.
          return true;
        }
      } else {
        return false;
      }
    } finally {
      if (fiberInstance !== null) {
        unmountRemainingChildren();
        reconcilingParent = stashedParent;
        previouslyReconciledSibling = stashedPrevious;
        remainingReconcilingChildren = stashedRemaining;
      }
    }
  }
  function cleanup() {
    isProfiling = false;
  }
  function rootSupportsProfiling(root) {
    if (root.memoizedInteractions != null) {
      // v16 builds include this field for the scheduler/tracing API.
      return true;
    } else if (root.current != null && root.current.hasOwnProperty('treeBaseDuration')) {
      // The scheduler/tracing API was removed in v17 though
      // so we need to check a non-root Fiber.
      return true;
    } else {
      return false;
    }
  }
  function flushInitialOperations() {
    var localPendingOperationsQueue = pendingOperationsQueue;
    pendingOperationsQueue = null;
    if (localPendingOperationsQueue !== null && localPendingOperationsQueue.length > 0) {
      // We may have already queued up some operations before the frontend connected
      // If so, let the frontend know about them.
      localPendingOperationsQueue.forEach(function (operations) {
        hook.emit('operations', operations);
      });
    } else {
      // Before the traversals, remember to start tracking
      // our path in case we have selection to restore.
      if (trackedPath !== null) {
        mightBeOnTrackedPath = true;
      } // If we have not been profiling, then we can just walk the tree and build up its current state as-is.

      hook.getFiberRoots(rendererID).forEach(function (root) {
        var current = root.current;
        var newRoot = createFiberInstance(current);
        rootToFiberInstanceMap.set(root, newRoot);
        idToDevToolsInstanceMap.set(newRoot.id, newRoot);
        currentRoot = newRoot;
        setRootPseudoKey(currentRoot.id, root.current); // Handle multi-renderer edge-case where only some v16 renderers support profiling.

        if (isProfiling && rootSupportsProfiling(root)) {
          // If profiling is active, store commit time and duration.
          // The frontend may request this information after profiling has stopped.
          currentCommitProfilingMetadata = {
            changeDescriptions: recordChangeDescriptions ? new Map() : null,
            durations: [],
            commitTime: renderer_getCurrentTime() - profilingStartTime,
            maxActualDuration: 0,
            priorityLevel: null,
            updaters: null,
            effectDuration: null,
            passiveEffectDuration: null
          };
        }
        mountFiberRecursively(root.current, false);
        flushPendingEvents(root);
        needsToFlushComponentLogs = false;
        currentRoot = null;
      });
    }
  }
  function handleCommitFiberUnmount(fiber) {// This Hook is no longer used. After having shipped DevTools everywhere it is
    // safe to stop calling it from Fiber.
  }
  function handlePostCommitFiberRoot(root) {
    if (isProfiling && rootSupportsProfiling(root)) {
      if (currentCommitProfilingMetadata !== null) {
        var _getEffectDurations = getEffectDurations(root),
          effectDuration = _getEffectDurations.effectDuration,
          passiveEffectDuration = _getEffectDurations.passiveEffectDuration; // $FlowFixMe[incompatible-use] found when upgrading Flow

        currentCommitProfilingMetadata.effectDuration = effectDuration; // $FlowFixMe[incompatible-use] found when upgrading Flow

        currentCommitProfilingMetadata.passiveEffectDuration = passiveEffectDuration;
      }
    }
    if (needsToFlushComponentLogs) {
      // We received new logs after commit. I.e. in a passive effect. We need to
      // traverse the tree to find the affected ones. If we just moved the whole
      // tree traversal from handleCommitFiberRoot to handlePostCommitFiberRoot
      // this wouldn't be needed. For now we just brute force check all instances.
      // This is not that common of a case.
      bruteForceFlushErrorsAndWarnings();
    }
  }
  function handleCommitFiberRoot(root, priorityLevel) {
    var current = root.current;
    var prevFiber = null;
    var rootInstance = rootToFiberInstanceMap.get(root);
    if (!rootInstance) {
      rootInstance = createFiberInstance(current);
      rootToFiberInstanceMap.set(root, rootInstance);
      idToDevToolsInstanceMap.set(rootInstance.id, rootInstance);
    } else {
      prevFiber = rootInstance.data;
    }
    currentRoot = rootInstance; // Before the traversals, remember to start tracking
    // our path in case we have selection to restore.

    if (trackedPath !== null) {
      mightBeOnTrackedPath = true;
    }
    if (traceUpdatesEnabled) {
      traceUpdatesForNodes.clear();
    } // Handle multi-renderer edge-case where only some v16 renderers support profiling.

    var isProfilingSupported = rootSupportsProfiling(root);
    if (isProfiling && isProfilingSupported) {
      // If profiling is active, store commit time and duration.
      // The frontend may request this information after profiling has stopped.
      currentCommitProfilingMetadata = {
        changeDescriptions: recordChangeDescriptions ? new Map() : null,
        durations: [],
        commitTime: renderer_getCurrentTime() - profilingStartTime,
        maxActualDuration: 0,
        priorityLevel: priorityLevel == null ? null : formatPriorityLevel(priorityLevel),
        updaters: null,
        // Initialize to null; if new enough React version is running,
        // these values will be read during separate handlePostCommitFiberRoot() call.
        effectDuration: null,
        passiveEffectDuration: null
      };
    }
    if (prevFiber !== null) {
      // TODO: relying on this seems a bit fishy.
      var wasMounted = prevFiber.memoizedState != null && prevFiber.memoizedState.element != null &&
      // A dehydrated root is not considered mounted
      prevFiber.memoizedState.isDehydrated !== true;
      var isMounted = current.memoizedState != null && current.memoizedState.element != null &&
      // A dehydrated root is not considered mounted
      current.memoizedState.isDehydrated !== true;
      if (!wasMounted && isMounted) {
        // Mount a new root.
        setRootPseudoKey(currentRoot.id, current);
        mountFiberRecursively(current, false);
      } else if (wasMounted && isMounted) {
        // Update an existing root.
        updateFiberRecursively(rootInstance, current, prevFiber, false);
      } else if (wasMounted && !isMounted) {
        // Unmount an existing root.
        unmountInstanceRecursively(rootInstance);
        removeRootPseudoKey(currentRoot.id);
        rootToFiberInstanceMap.delete(root);
      }
    } else {
      // Mount a new root.
      setRootPseudoKey(currentRoot.id, current);
      mountFiberRecursively(current, false);
    }
    if (isProfiling && isProfilingSupported) {
      if (!shouldBailoutWithPendingOperations()) {
        var commitProfilingMetadata = rootToCommitProfilingMetadataMap.get(currentRoot.id);
        if (commitProfilingMetadata != null) {
          commitProfilingMetadata.push(currentCommitProfilingMetadata);
        } else {
          rootToCommitProfilingMetadataMap.set(currentRoot.id, [currentCommitProfilingMetadata]);
        }
      }
    } // We're done here.

    flushPendingEvents(root);
    needsToFlushComponentLogs = false;
    if (traceUpdatesEnabled) {
      hook.emit('traceUpdates', traceUpdatesForNodes);
    }
    currentRoot = null;
  }
  function getResourceInstance(fiber) {
    if (fiber.tag === HostHoistable) {
      var resource = fiber.memoizedState; // Feature Detect a DOM Specific Instance of a Resource

      if (renderer_typeof(resource) === 'object' && resource !== null && resource.instance != null) {
        return resource.instance;
      }
    }
    return null;
  }
  function appendHostInstancesByDevToolsInstance(devtoolsInstance, hostInstances) {
    if (devtoolsInstance.kind !== VIRTUAL_INSTANCE) {
      var _fiber4 = devtoolsInstance.data;
      appendHostInstancesByFiber(_fiber4, hostInstances);
      return;
    } // Search the tree for the nearest child Fiber and add all its host instances.
    // TODO: If the true nearest Fiber is filtered, we might skip it and instead include all
    // the children below it. In the extreme case, searching the whole tree.

    for (var child = devtoolsInstance.firstChild; child !== null; child = child.nextSibling) {
      appendHostInstancesByDevToolsInstance(child, hostInstances);
    }
  }
  function appendHostInstancesByFiber(fiber, hostInstances) {
    // Next we'll drill down this component to find all HostComponent/Text.
    var node = fiber;
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText || node.tag === HostSingleton || node.tag === HostHoistable) {
        var hostInstance = node.stateNode || getResourceInstance(node);
        if (hostInstance) {
          hostInstances.push(hostInstance);
        }
      } else if (node.child) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === fiber) {
        return;
      }
      while (!node.sibling) {
        if (!node.return || node.return === fiber) {
          return;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
  function findAllCurrentHostInstances(devtoolsInstance) {
    var hostInstances = [];
    appendHostInstancesByDevToolsInstance(devtoolsInstance, hostInstances);
    return hostInstances;
  }
  function findHostInstancesForElementID(id) {
    try {
      var devtoolsInstance = idToDevToolsInstanceMap.get(id);
      if (devtoolsInstance === undefined) {
        console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
        return null;
      }
      return findAllCurrentHostInstances(devtoolsInstance);
    } catch (err) {
      // The fiber might have unmounted by now.
      return null;
    }
  }
  function getDisplayNameForElementID(id) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      return null;
    }
    if (devtoolsInstance.kind === FIBER_INSTANCE) {
      return getDisplayNameForFiber(devtoolsInstance.data);
    } else {
      return devtoolsInstance.data.name || '';
    }
  }
  function getNearestMountedDOMNode(publicInstance) {
    var domNode = publicInstance;
    while (domNode && !publicInstanceToDevToolsInstanceMap.has(domNode)) {
      // $FlowFixMe: In practice this is either null or Element.
      domNode = domNode.parentNode;
    }
    return domNode;
  }
  function getElementIDForHostInstance(publicInstance) {
    var instance = publicInstanceToDevToolsInstanceMap.get(publicInstance);
    if (instance !== undefined) {
      if (instance.kind === FILTERED_FIBER_INSTANCE) {
        // A Filtered Fiber Instance will always have a Virtual Instance as a parent.
        return instance.parent.id;
      }
      return instance.id;
    }
    return null;
  }
  function getElementAttributeByPath(id, path) {
    if (isMostRecentlyInspectedElement(id)) {
      return utils_getInObject(mostRecentlyInspectedElement, path);
    }
    return undefined;
  }
  function getElementSourceFunctionById(id) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return null;
    }
    if (devtoolsInstance.kind !== FIBER_INSTANCE) {
      // TODO: Handle VirtualInstance.
      return null;
    }
    var fiber = devtoolsInstance.data;
    var elementType = fiber.elementType,
      tag = fiber.tag,
      type = fiber.type;
    switch (tag) {
      case ClassComponent:
      case IncompleteClassComponent:
      case IncompleteFunctionComponent:
      case IndeterminateComponent:
      case FunctionComponent:
        return type;
      case ForwardRef:
        return type.render;
      case MemoComponent:
      case SimpleMemoComponent:
        return elementType != null && elementType.type != null ? elementType.type : type;
      default:
        return null;
    }
  }
  function instanceToSerializedElement(instance) {
    if (instance.kind === FIBER_INSTANCE) {
      var _fiber5 = instance.data;
      return {
        displayName: getDisplayNameForFiber(_fiber5) || 'Anonymous',
        id: instance.id,
        key: _fiber5.key,
        type: getElementTypeForFiber(_fiber5)
      };
    } else {
      var componentInfo = instance.data;
      return {
        displayName: componentInfo.name || 'Anonymous',
        id: instance.id,
        key: componentInfo.key == null ? null : componentInfo.key,
        type: types_ElementTypeVirtual
      };
    }
  }
  function getOwnersList(id) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return null;
    }
    var self = instanceToSerializedElement(devtoolsInstance);
    var owners = getOwnersListFromInstance(devtoolsInstance); // This is particular API is prefixed with the current instance too for some reason.

    if (owners === null) {
      return [self];
    }
    owners.unshift(self);
    owners.reverse();
    return owners;
  }
  function getOwnersListFromInstance(instance) {
    var owner = getUnfilteredOwner(instance.data);
    if (owner === null) {
      return null;
    }
    var owners = [];
    var parentInstance = instance.parent;
    while (parentInstance !== null && owner !== null) {
      var ownerInstance = findNearestOwnerInstance(parentInstance, owner);
      if (ownerInstance !== null) {
        owners.push(instanceToSerializedElement(ownerInstance)); // Get the next owner and keep searching from the previous match.

        owner = getUnfilteredOwner(owner);
        parentInstance = ownerInstance.parent;
      } else {
        break;
      }
    }
    return owners;
  }
  function getUnfilteredOwner(owner) {
    if (owner == null) {
      return null;
    }
    if (typeof owner.tag === 'number') {
      var ownerFiber = owner; // Refined

      owner = ownerFiber._debugOwner;
    } else {
      var ownerInfo = owner; // Refined

      owner = ownerInfo.owner;
    }
    while (owner) {
      if (typeof owner.tag === 'number') {
        var _ownerFiber = owner; // Refined

        if (!shouldFilterFiber(_ownerFiber)) {
          return _ownerFiber;
        }
        owner = _ownerFiber._debugOwner;
      } else {
        var _ownerInfo = owner; // Refined

        if (!shouldFilterVirtual(_ownerInfo, null)) {
          return _ownerInfo;
        }
        owner = _ownerInfo.owner;
      }
    }
    return null;
  }
  function findNearestOwnerInstance(parentInstance, owner) {
    if (owner == null) {
      return null;
    } // Search the parent path for any instance that matches this kind of owner.

    while (parentInstance !== null) {
      if (parentInstance.data === owner ||
      // Typically both owner and instance.data would refer to the current version of a Fiber
      // but it is possible for memoization to ignore the owner on the JSX. Then the new Fiber
      // isn't propagated down as the new owner. In that case we might match the alternate
      // instead. This is a bit hacky but the fastest check since type casting owner to a Fiber
      // needs a duck type check anyway.
      parentInstance.data === owner.alternate) {
        if (parentInstance.kind === FILTERED_FIBER_INSTANCE) {
          return null;
        }
        return parentInstance;
      }
      parentInstance = parentInstance.parent;
    } // It is technically possible to create an element and render it in a different parent
    // but this is a weird edge case and it is worth not having to scan the tree or keep
    // a register for every fiber/component info.

    return null;
  } // Fast path props lookup for React Native style editor.
  // Could use inspectElementRaw() but that would require shallow rendering hooks components,
  // and could also mess with memoization.

  function getInstanceAndStyle(id) {
    var instance = null;
    var style = null;
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return {
        instance: instance,
        style: style
      };
    }
    if (devtoolsInstance.kind !== FIBER_INSTANCE) {
      // TODO: Handle VirtualInstance.
      return {
        instance: instance,
        style: style
      };
    }
    var fiber = devtoolsInstance.data;
    if (fiber !== null) {
      instance = fiber.stateNode;
      if (fiber.memoizedProps !== null) {
        style = fiber.memoizedProps.style;
      }
    }
    return {
      instance: instance,
      style: style
    };
  }
  function isErrorBoundary(fiber) {
    var tag = fiber.tag,
      type = fiber.type;
    switch (tag) {
      case ClassComponent:
      case IncompleteClassComponent:
        var instance = fiber.stateNode;
        return typeof type.getDerivedStateFromError === 'function' || instance !== null && typeof instance.componentDidCatch === 'function';
      default:
        return false;
    }
  }
  function inspectElementRaw(id) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return null;
    }
    if (devtoolsInstance.kind === VIRTUAL_INSTANCE) {
      return inspectVirtualInstanceRaw(devtoolsInstance);
    }
    if (devtoolsInstance.kind === FIBER_INSTANCE) {
      return inspectFiberInstanceRaw(devtoolsInstance);
    }
    devtoolsInstance; // assert exhaustive

    throw new Error('Unsupported instance kind');
  }
  function inspectFiberInstanceRaw(fiberInstance) {
    var fiber = fiberInstance.data;
    if (fiber == null) {
      return null;
    }
    var stateNode = fiber.stateNode,
      key = fiber.key,
      memoizedProps = fiber.memoizedProps,
      memoizedState = fiber.memoizedState,
      dependencies = fiber.dependencies,
      tag = fiber.tag,
      type = fiber.type;
    var elementType = getElementTypeForFiber(fiber);
    var usesHooks = (tag === FunctionComponent || tag === SimpleMemoComponent || tag === ForwardRef) && (!!memoizedState || !!dependencies); // TODO Show custom UI for Cache like we do for Suspense
    // For now, just hide state data entirely since it's not meant to be inspected.

    var showState = !usesHooks && tag !== CacheComponent;
    var typeSymbol = getTypeSymbol(type);
    var canViewSource = false;
    var context = null;
    if (tag === ClassComponent || tag === FunctionComponent || tag === IncompleteClassComponent || tag === IncompleteFunctionComponent || tag === IndeterminateComponent || tag === MemoComponent || tag === ForwardRef || tag === SimpleMemoComponent) {
      canViewSource = true;
      if (stateNode && stateNode.context != null) {
        // Don't show an empty context object for class components that don't use the context API.
        var shouldHideContext = elementType === types_ElementTypeClass && !(type.contextTypes || type.contextType);
        if (!shouldHideContext) {
          context = stateNode.context;
        }
      }
    } else if (
    // Detect pre-19 Context Consumers
    (typeSymbol === CONTEXT_NUMBER || typeSymbol === CONTEXT_SYMBOL_STRING) && !(
    // In 19+, CONTEXT_SYMBOL_STRING means a Provider instead.
    // It will be handled in a different branch below.
    // Eventually, this entire branch can be removed.
    type._context === undefined && type.Provider === type)) {
      // 16.3-16.5 read from "type" because the Consumer is the actual context object.
      // 16.6+ should read from "type._context" because Consumer can be different (in DEV).
      // NOTE Keep in sync with getDisplayNameForFiber()
      var consumerResolvedContext = type._context || type; // Global context value.

      context = consumerResolvedContext._currentValue || null; // Look for overridden value.

      var _current = fiber.return;
      while (_current !== null) {
        var currentType = _current.type;
        var currentTypeSymbol = getTypeSymbol(currentType);
        if (currentTypeSymbol === PROVIDER_NUMBER || currentTypeSymbol === PROVIDER_SYMBOL_STRING) {
          // 16.3.0 exposed the context object as "context"
          // PR #12501 changed it to "_context" for 16.3.1+
          // NOTE Keep in sync with getDisplayNameForFiber()
          var providerResolvedContext = currentType._context || currentType.context;
          if (providerResolvedContext === consumerResolvedContext) {
            context = _current.memoizedProps.value;
            break;
          }
        }
        _current = _current.return;
      }
    } else if (
    // Detect 19+ Context Consumers
    typeSymbol === CONSUMER_SYMBOL_STRING) {
      // This branch is 19+ only, where Context.Provider === Context.
      // NOTE Keep in sync with getDisplayNameForFiber()
      var _consumerResolvedContext = type._context; // Global context value.

      context = _consumerResolvedContext._currentValue || null; // Look for overridden value.

      var _current2 = fiber.return;
      while (_current2 !== null) {
        var _currentType = _current2.type;
        var _currentTypeSymbol = getTypeSymbol(_currentType);
        if (
        // In 19+, these are Context Providers
        _currentTypeSymbol === CONTEXT_SYMBOL_STRING) {
          var _providerResolvedContext = _currentType;
          if (_providerResolvedContext === _consumerResolvedContext) {
            context = _current2.memoizedProps.value;
            break;
          }
        }
        _current2 = _current2.return;
      }
    }
    var hasLegacyContext = false;
    if (context !== null) {
      hasLegacyContext = !!type.contextTypes; // To simplify hydration and display logic for context, wrap in a value object.
      // Otherwise simple values (e.g. strings, booleans) become harder to handle.

      context = {
        value: context
      };
    }
    var owners = getOwnersListFromInstance(fiberInstance);
    var hooks = null;
    if (usesHooks) {
      var originalConsoleMethods = {}; // Temporarily disable all console logging before re-running the hook.

      for (var method in console) {
        try {
          // $FlowFixMe[invalid-computed-prop]
          originalConsoleMethods[method] = console[method]; // $FlowFixMe[prop-missing]

          console[method] = function () {};
        } catch (error) {}
      }
      try {
        hooks = (0, react_debug_tools.inspectHooksOfFiber)(fiber, getDispatcherRef(renderer));
      } finally {
        // Restore original console functionality.
        for (var _method in originalConsoleMethods) {
          try {
            // $FlowFixMe[prop-missing]
            console[_method] = originalConsoleMethods[_method];
          } catch (error) {}
        }
      }
    }
    var rootType = null;
    var current = fiber;
    var hasErrorBoundary = false;
    var hasSuspenseBoundary = false;
    while (current.return !== null) {
      var temp = current;
      current = current.return;
      if (temp.tag === SuspenseComponent) {
        hasSuspenseBoundary = true;
      } else if (isErrorBoundary(temp)) {
        hasErrorBoundary = true;
      }
    }
    var fiberRoot = current.stateNode;
    if (fiberRoot != null && fiberRoot._debugRootType !== null) {
      rootType = fiberRoot._debugRootType;
    }
    var isTimedOutSuspense = tag === SuspenseComponent && memoizedState !== null;
    var isErrored = false;
    if (isErrorBoundary(fiber)) {
      // if the current inspected element is an error boundary,
      // either that we want to use it to toggle off error state
      // or that we allow to force error state on it if it's within another
      // error boundary
      //
      // TODO: This flag is a leaked implementation detail. Once we start
      // releasing DevTools in lockstep with React, we should import a function
      // from the reconciler instead.
      var DidCapture = 128;
      isErrored = (fiber.flags & DidCapture) !== 0 || forceErrorForFibers.get(fiber) === true || fiber.alternate !== null && forceErrorForFibers.get(fiber.alternate) === true;
    }
    var plugins = {
      stylex: null
    };
    if (enableStyleXFeatures) {
      if (memoizedProps != null && memoizedProps.hasOwnProperty('xstyle')) {
        plugins.stylex = getStyleXData(memoizedProps.xstyle);
      }
    }
    var source = null;
    if (canViewSource) {
      source = getSourceForFiberInstance(fiberInstance);
    }
    var componentLogsEntry = fiberToComponentLogsMap.get(fiber);
    if (componentLogsEntry === undefined && fiber.alternate !== null) {
      componentLogsEntry = fiberToComponentLogsMap.get(fiber.alternate);
    }
    var nativeTag = null;
    if (elementType === ElementTypeHostComponent) {
      nativeTag = getNativeTag(fiber.stateNode);
    }
    return {
      id: fiberInstance.id,
      // Does the current renderer support editable hooks and function props?
      canEditHooks: typeof overrideHookState === 'function',
      canEditFunctionProps: typeof overrideProps === 'function',
      // Does the current renderer support advanced editing interface?
      canEditHooksAndDeletePaths: typeof overrideHookStateDeletePath === 'function',
      canEditHooksAndRenamePaths: typeof overrideHookStateRenamePath === 'function',
      canEditFunctionPropsDeletePaths: typeof overridePropsDeletePath === 'function',
      canEditFunctionPropsRenamePaths: typeof overridePropsRenamePath === 'function',
      canToggleError: supportsTogglingError && hasErrorBoundary,
      // Is this error boundary in error state.
      isErrored: isErrored,
      canToggleSuspense: supportsTogglingSuspense && hasSuspenseBoundary && (
      // If it's showing the real content, we can always flip fallback.
      !isTimedOutSuspense ||
      // If it's showing fallback because we previously forced it to,
      // allow toggling it back to remove the fallback override.
      forceFallbackForFibers.has(fiber) || fiber.alternate !== null && forceFallbackForFibers.has(fiber.alternate)),
      // Can view component source location.
      canViewSource: canViewSource,
      source: source,
      // Does the component have legacy context attached to it.
      hasLegacyContext: hasLegacyContext,
      key: key != null ? key : null,
      type: elementType,
      // Inspectable properties.
      // TODO Review sanitization approach for the below inspectable values.
      context: context,
      hooks: hooks,
      props: memoizedProps,
      state: showState ? memoizedState : null,
      errors: componentLogsEntry === undefined ? [] : Array.from(componentLogsEntry.errors.entries()),
      warnings: componentLogsEntry === undefined ? [] : Array.from(componentLogsEntry.warnings.entries()),
      // List of owners
      owners: owners,
      rootType: rootType,
      rendererPackageName: renderer.rendererPackageName,
      rendererVersion: renderer.version,
      plugins: plugins,
      nativeTag: nativeTag
    };
  }
  function inspectVirtualInstanceRaw(virtualInstance) {
    var canViewSource = true;
    var source = getSourceForInstance(virtualInstance);
    var componentInfo = virtualInstance.data;
    var key = typeof componentInfo.key === 'string' ? componentInfo.key : null;
    var props = componentInfo.props == null ? null : componentInfo.props;
    var owners = getOwnersListFromInstance(virtualInstance);
    var rootType = null;
    var hasErrorBoundary = false;
    var hasSuspenseBoundary = false;
    var nearestFiber = getNearestFiber(virtualInstance);
    if (nearestFiber !== null) {
      var current = nearestFiber;
      while (current.return !== null) {
        var temp = current;
        current = current.return;
        if (temp.tag === SuspenseComponent) {
          hasSuspenseBoundary = true;
        } else if (isErrorBoundary(temp)) {
          hasErrorBoundary = true;
        }
      }
      var fiberRoot = current.stateNode;
      if (fiberRoot != null && fiberRoot._debugRootType !== null) {
        rootType = fiberRoot._debugRootType;
      }
    }
    var plugins = {
      stylex: null
    };
    var componentLogsEntry = componentInfoToComponentLogsMap.get(componentInfo);
    return {
      id: virtualInstance.id,
      canEditHooks: false,
      canEditFunctionProps: false,
      canEditHooksAndDeletePaths: false,
      canEditHooksAndRenamePaths: false,
      canEditFunctionPropsDeletePaths: false,
      canEditFunctionPropsRenamePaths: false,
      canToggleError: supportsTogglingError && hasErrorBoundary,
      isErrored: false,
      canToggleSuspense: supportsTogglingSuspense && hasSuspenseBoundary,
      // Can view component source location.
      canViewSource: canViewSource,
      source: source,
      // Does the component have legacy context attached to it.
      hasLegacyContext: false,
      key: key,
      type: types_ElementTypeVirtual,
      // Inspectable properties.
      // TODO Review sanitization approach for the below inspectable values.
      context: null,
      hooks: null,
      props: props,
      state: null,
      errors: componentLogsEntry === undefined ? [] : Array.from(componentLogsEntry.errors.entries()),
      warnings: componentLogsEntry === undefined ? [] : Array.from(componentLogsEntry.warnings.entries()),
      // List of owners
      owners: owners,
      rootType: rootType,
      rendererPackageName: renderer.rendererPackageName,
      rendererVersion: renderer.version,
      plugins: plugins,
      nativeTag: null
    };
  }
  var mostRecentlyInspectedElement = null;
  var hasElementUpdatedSinceLastInspected = false;
  var currentlyInspectedPaths = {};
  function isMostRecentlyInspectedElement(id) {
    return mostRecentlyInspectedElement !== null && mostRecentlyInspectedElement.id === id;
  }
  function isMostRecentlyInspectedElementCurrent(id) {
    return isMostRecentlyInspectedElement(id) && !hasElementUpdatedSinceLastInspected;
  } // Track the intersection of currently inspected paths,
  // so that we can send their data along if the element is re-rendered.

  function mergeInspectedPaths(path) {
    var current = currentlyInspectedPaths;
    path.forEach(function (key) {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    });
  }
  function createIsPathAllowed(key, secondaryCategory) {
    // This function helps prevent previously-inspected paths from being dehydrated in updates.
    // This is important to avoid a bad user experience where expanded toggles collapse on update.
    return function isPathAllowed(path) {
      switch (secondaryCategory) {
        case 'hooks':
          if (path.length === 1) {
            // Never dehydrate the "hooks" object at the top levels.
            return true;
          }
          if (path[path.length - 2] === 'hookSource' && path[path.length - 1] === 'fileName') {
            // It's important to preserve the full file name (URL) for hook sources
            // in case the user has enabled the named hooks feature.
            // Otherwise the frontend may end up with a partial URL which it can't load.
            return true;
          }
          if (path[path.length - 1] === 'subHooks' || path[path.length - 2] === 'subHooks') {
            // Dehydrating the 'subHooks' property makes the HooksTree UI a lot more complicated,
            // so it's easiest for now if we just don't break on this boundary.
            // We can always dehydrate a level deeper (in the value object).
            return true;
          }
          break;
        default:
          break;
      }
      var current = key === null ? currentlyInspectedPaths : currentlyInspectedPaths[key];
      if (!current) {
        return false;
      }
      for (var i = 0; i < path.length; i++) {
        current = current[path[i]];
        if (!current) {
          return false;
        }
      }
      return true;
    };
  }
  function updateSelectedElement(inspectedElement) {
    var hooks = inspectedElement.hooks,
      id = inspectedElement.id,
      props = inspectedElement.props;
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return;
    }
    if (devtoolsInstance.kind !== FIBER_INSTANCE) {
      // TODO: Handle VirtualInstance.
      return;
    }
    var fiber = devtoolsInstance.data;
    var elementType = fiber.elementType,
      stateNode = fiber.stateNode,
      tag = fiber.tag,
      type = fiber.type;
    switch (tag) {
      case ClassComponent:
      case IncompleteClassComponent:
      case IndeterminateComponent:
        global.$r = stateNode;
        break;
      case IncompleteFunctionComponent:
      case FunctionComponent:
        global.$r = {
          hooks: hooks,
          props: props,
          type: type
        };
        break;
      case ForwardRef:
        global.$r = {
          hooks: hooks,
          props: props,
          type: type.render
        };
        break;
      case MemoComponent:
      case SimpleMemoComponent:
        global.$r = {
          hooks: hooks,
          props: props,
          type: elementType != null && elementType.type != null ? elementType.type : type
        };
        break;
      default:
        global.$r = null;
        break;
    }
  }
  function storeAsGlobal(id, path, count) {
    if (isMostRecentlyInspectedElement(id)) {
      var value = utils_getInObject(mostRecentlyInspectedElement, path);
      var key = "$reactTemp".concat(count);
      window[key] = value;
      console.log(key);
      console.log(value);
    }
  }
  function getSerializedElementValueByPath(id, path) {
    if (isMostRecentlyInspectedElement(id)) {
      var valueToCopy = utils_getInObject(mostRecentlyInspectedElement, path);
      return serializeToString(valueToCopy);
    }
  }
  function inspectElement(requestID, id, path, forceFullData) {
    if (path !== null) {
      mergeInspectedPaths(path);
    }
    if (isMostRecentlyInspectedElement(id) && !forceFullData) {
      if (!hasElementUpdatedSinceLastInspected) {
        if (path !== null) {
          var secondaryCategory = null;
          if (path[0] === 'hooks') {
            secondaryCategory = 'hooks';
          } // If this element has not been updated since it was last inspected,
          // we can just return the subset of data in the newly-inspected path.

          return {
            id: id,
            responseID: requestID,
            type: 'hydrated-path',
            path: path,
            value: cleanForBridge(utils_getInObject(mostRecentlyInspectedElement, path), createIsPathAllowed(null, secondaryCategory), path)
          };
        } else {
          // If this element has not been updated since it was last inspected, we don't need to return it.
          // Instead we can just return the ID to indicate that it has not changed.
          return {
            id: id,
            responseID: requestID,
            type: 'no-change'
          };
        }
      }
    } else {
      currentlyInspectedPaths = {};
    }
    hasElementUpdatedSinceLastInspected = false;
    try {
      mostRecentlyInspectedElement = inspectElementRaw(id);
    } catch (error) {
      // the error name is synced with ReactDebugHooks
      if (error.name === 'ReactDebugToolsRenderError') {
        var message = 'Error rendering inspected element.';
        var stack; // Log error & cause for user to debug

        console.error(message + '\n\n', error);
        if (error.cause != null) {
          var componentName = getDisplayNameForElementID(id);
          console.error('React DevTools encountered an error while trying to inspect hooks. ' + 'This is most likely caused by an error in current inspected component' + (componentName != null ? ": \"".concat(componentName, "\".") : '.') + '\nThe error thrown in the component is: \n\n', error.cause);
          if (error.cause instanceof Error) {
            message = error.cause.message || message;
            stack = error.cause.stack;
          }
        }
        return {
          type: 'error',
          errorType: 'user',
          id: id,
          responseID: requestID,
          message: message,
          stack: stack
        };
      } // the error name is synced with ReactDebugHooks

      if (error.name === 'ReactDebugToolsUnsupportedHookError') {
        return {
          type: 'error',
          errorType: 'unknown-hook',
          id: id,
          responseID: requestID,
          message: 'Unsupported hook in the react-debug-tools package: ' + error.message
        };
      } // Log Uncaught Error

      console.error('Error inspecting element.\n\n', error);
      return {
        type: 'error',
        errorType: 'uncaught',
        id: id,
        responseID: requestID,
        message: error.message,
        stack: error.stack
      };
    }
    if (mostRecentlyInspectedElement === null) {
      return {
        id: id,
        responseID: requestID,
        type: 'not-found'
      };
    } // Any time an inspected element has an update,
    // we should update the selected $r value as wel.
    // Do this before dehydration (cleanForBridge).

    updateSelectedElement(mostRecentlyInspectedElement); // Clone before cleaning so that we preserve the full data.
    // This will enable us to send patches without re-inspecting if hydrated paths are requested.
    // (Reducing how often we shallow-render is a better DX for function components that use hooks.)

    var cleanedInspectedElement = renderer_objectSpread({}, mostRecentlyInspectedElement); // $FlowFixMe[prop-missing] found when upgrading Flow

    cleanedInspectedElement.context = cleanForBridge(cleanedInspectedElement.context, createIsPathAllowed('context', null)); // $FlowFixMe[prop-missing] found when upgrading Flow

    cleanedInspectedElement.hooks = cleanForBridge(cleanedInspectedElement.hooks, createIsPathAllowed('hooks', 'hooks')); // $FlowFixMe[prop-missing] found when upgrading Flow

    cleanedInspectedElement.props = cleanForBridge(cleanedInspectedElement.props, createIsPathAllowed('props', null)); // $FlowFixMe[prop-missing] found when upgrading Flow

    cleanedInspectedElement.state = cleanForBridge(cleanedInspectedElement.state, createIsPathAllowed('state', null));
    return {
      id: id,
      responseID: requestID,
      type: 'full-data',
      // $FlowFixMe[prop-missing] found when upgrading Flow
      value: cleanedInspectedElement
    };
  }
  function logElementToConsole(id) {
    var result = isMostRecentlyInspectedElementCurrent(id) ? mostRecentlyInspectedElement : inspectElementRaw(id);
    if (result === null) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return;
    }
    var displayName = getDisplayNameForElementID(id);
    var supportsGroup = typeof console.groupCollapsed === 'function';
    if (supportsGroup) {
      console.groupCollapsed("[Click to expand] %c<".concat(displayName || 'Component', " />"),
      // --dom-tag-name-color is the CSS variable Chrome styles HTML elements with in the console.
      'color: var(--dom-tag-name-color); font-weight: normal;');
    }
    if (result.props !== null) {
      console.log('Props:', result.props);
    }
    if (result.state !== null) {
      console.log('State:', result.state);
    }
    if (result.hooks !== null) {
      console.log('Hooks:', result.hooks);
    }
    var hostInstances = findHostInstancesForElementID(id);
    if (hostInstances !== null) {
      console.log('Nodes:', hostInstances);
    }
    if (window.chrome || /firefox/i.test(navigator.userAgent)) {
      console.log('Right-click any value to save it as a global variable for further inspection.');
    }
    if (supportsGroup) {
      console.groupEnd();
    }
  }
  function deletePath(type, id, hookID, path) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return;
    }
    if (devtoolsInstance.kind !== FIBER_INSTANCE) {
      // TODO: Handle VirtualInstance.
      return;
    }
    var fiber = devtoolsInstance.data;
    if (fiber !== null) {
      var instance = fiber.stateNode;
      switch (type) {
        case 'context':
          // To simplify hydration and display of primitive context values (e.g. number, string)
          // the inspectElement() method wraps context in a {value: ...} object.
          // We need to remove the first part of the path (the "value") before continuing.
          path = path.slice(1);
          switch (fiber.tag) {
            case ClassComponent:
              if (path.length === 0) {// Simple context value (noop)
              } else {
                deletePathInObject(instance.context, path);
              }
              instance.forceUpdate();
              break;
            case FunctionComponent:
              // Function components using legacy context are not editable
              // because there's no instance on which to create a cloned, mutated context.
              break;
          }
          break;
        case 'hooks':
          if (typeof overrideHookStateDeletePath === 'function') {
            overrideHookStateDeletePath(fiber, hookID, path);
          }
          break;
        case 'props':
          if (instance === null) {
            if (typeof overridePropsDeletePath === 'function') {
              overridePropsDeletePath(fiber, path);
            }
          } else {
            fiber.pendingProps = copyWithDelete(instance.props, path);
            instance.forceUpdate();
          }
          break;
        case 'state':
          deletePathInObject(instance.state, path);
          instance.forceUpdate();
          break;
      }
    }
  }
  function renamePath(type, id, hookID, oldPath, newPath) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return;
    }
    if (devtoolsInstance.kind !== FIBER_INSTANCE) {
      // TODO: Handle VirtualInstance.
      return;
    }
    var fiber = devtoolsInstance.data;
    if (fiber !== null) {
      var instance = fiber.stateNode;
      switch (type) {
        case 'context':
          // To simplify hydration and display of primitive context values (e.g. number, string)
          // the inspectElement() method wraps context in a {value: ...} object.
          // We need to remove the first part of the path (the "value") before continuing.
          oldPath = oldPath.slice(1);
          newPath = newPath.slice(1);
          switch (fiber.tag) {
            case ClassComponent:
              if (oldPath.length === 0) {// Simple context value (noop)
              } else {
                renamePathInObject(instance.context, oldPath, newPath);
              }
              instance.forceUpdate();
              break;
            case FunctionComponent:
              // Function components using legacy context are not editable
              // because there's no instance on which to create a cloned, mutated context.
              break;
          }
          break;
        case 'hooks':
          if (typeof overrideHookStateRenamePath === 'function') {
            overrideHookStateRenamePath(fiber, hookID, oldPath, newPath);
          }
          break;
        case 'props':
          if (instance === null) {
            if (typeof overridePropsRenamePath === 'function') {
              overridePropsRenamePath(fiber, oldPath, newPath);
            }
          } else {
            fiber.pendingProps = copyWithRename(instance.props, oldPath, newPath);
            instance.forceUpdate();
          }
          break;
        case 'state':
          renamePathInObject(instance.state, oldPath, newPath);
          instance.forceUpdate();
          break;
      }
    }
  }
  function overrideValueAtPath(type, id, hookID, path, value) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      console.warn("Could not find DevToolsInstance with id \"".concat(id, "\""));
      return;
    }
    if (devtoolsInstance.kind !== FIBER_INSTANCE) {
      // TODO: Handle VirtualInstance.
      return;
    }
    var fiber = devtoolsInstance.data;
    if (fiber !== null) {
      var instance = fiber.stateNode;
      switch (type) {
        case 'context':
          // To simplify hydration and display of primitive context values (e.g. number, string)
          // the inspectElement() method wraps context in a {value: ...} object.
          // We need to remove the first part of the path (the "value") before continuing.
          path = path.slice(1);
          switch (fiber.tag) {
            case ClassComponent:
              if (path.length === 0) {
                // Simple context value
                instance.context = value;
              } else {
                utils_setInObject(instance.context, path, value);
              }
              instance.forceUpdate();
              break;
            case FunctionComponent:
              // Function components using legacy context are not editable
              // because there's no instance on which to create a cloned, mutated context.
              break;
          }
          break;
        case 'hooks':
          if (typeof overrideHookState === 'function') {
            overrideHookState(fiber, hookID, path, value);
          }
          break;
        case 'props':
          switch (fiber.tag) {
            case ClassComponent:
              fiber.pendingProps = copyWithSet(instance.props, path, value);
              instance.forceUpdate();
              break;
            default:
              if (typeof overrideProps === 'function') {
                overrideProps(fiber, path, value);
              }
              break;
          }
          break;
        case 'state':
          switch (fiber.tag) {
            case ClassComponent:
              utils_setInObject(instance.state, path, value);
              instance.forceUpdate();
              break;
          }
          break;
      }
    }
  }
  var currentCommitProfilingMetadata = null;
  var displayNamesByRootID = null;
  var initialTreeBaseDurationsMap = null;
  var isProfiling = false;
  var profilingStartTime = 0;
  var recordChangeDescriptions = false;
  var recordTimeline = false;
  var rootToCommitProfilingMetadataMap = null;
  function getProfilingData() {
    var dataForRoots = [];
    if (rootToCommitProfilingMetadataMap === null) {
      throw Error('getProfilingData() called before any profiling data was recorded');
    }
    rootToCommitProfilingMetadataMap.forEach(function (commitProfilingMetadata, rootID) {
      var commitData = [];
      var displayName = displayNamesByRootID !== null && displayNamesByRootID.get(rootID) || 'Unknown';
      var initialTreeBaseDurations = initialTreeBaseDurationsMap !== null && initialTreeBaseDurationsMap.get(rootID) || [];
      commitProfilingMetadata.forEach(function (commitProfilingData, commitIndex) {
        var changeDescriptions = commitProfilingData.changeDescriptions,
          durations = commitProfilingData.durations,
          effectDuration = commitProfilingData.effectDuration,
          maxActualDuration = commitProfilingData.maxActualDuration,
          passiveEffectDuration = commitProfilingData.passiveEffectDuration,
          priorityLevel = commitProfilingData.priorityLevel,
          commitTime = commitProfilingData.commitTime,
          updaters = commitProfilingData.updaters;
        var fiberActualDurations = [];
        var fiberSelfDurations = [];
        for (var i = 0; i < durations.length; i += 3) {
          var fiberID = durations[i];
          fiberActualDurations.push([fiberID, formatDurationToMicrosecondsGranularity(durations[i + 1])]);
          fiberSelfDurations.push([fiberID, formatDurationToMicrosecondsGranularity(durations[i + 2])]);
        }
        commitData.push({
          changeDescriptions: changeDescriptions !== null ? Array.from(changeDescriptions.entries()) : null,
          duration: formatDurationToMicrosecondsGranularity(maxActualDuration),
          effectDuration: effectDuration !== null ? formatDurationToMicrosecondsGranularity(effectDuration) : null,
          fiberActualDurations: fiberActualDurations,
          fiberSelfDurations: fiberSelfDurations,
          passiveEffectDuration: passiveEffectDuration !== null ? formatDurationToMicrosecondsGranularity(passiveEffectDuration) : null,
          priorityLevel: priorityLevel,
          timestamp: commitTime,
          updaters: updaters
        });
      });
      dataForRoots.push({
        commitData: commitData,
        displayName: displayName,
        initialTreeBaseDurations: initialTreeBaseDurations,
        rootID: rootID
      });
    });
    var timelineData = null;
    if (typeof getTimelineData === 'function') {
      var currentTimelineData = getTimelineData();
      if (currentTimelineData) {
        var batchUIDToMeasuresMap = currentTimelineData.batchUIDToMeasuresMap,
          internalModuleSourceToRanges = currentTimelineData.internalModuleSourceToRanges,
          laneToLabelMap = currentTimelineData.laneToLabelMap,
          laneToReactMeasureMap = currentTimelineData.laneToReactMeasureMap,
          rest = _objectWithoutProperties(currentTimelineData, ["batchUIDToMeasuresMap", "internalModuleSourceToRanges", "laneToLabelMap", "laneToReactMeasureMap"]);
        timelineData = renderer_objectSpread(renderer_objectSpread({}, rest), {}, {
          // Most of the data is safe to parse as-is,
          // but we need to convert the nested Arrays back to Maps.
          // Most of the data is safe to serialize as-is,
          // but we need to convert the Maps to nested Arrays.
          batchUIDToMeasuresKeyValueArray: Array.from(batchUIDToMeasuresMap.entries()),
          internalModuleSourceToRanges: Array.from(internalModuleSourceToRanges.entries()),
          laneToLabelKeyValueArray: Array.from(laneToLabelMap.entries()),
          laneToReactMeasureKeyValueArray: Array.from(laneToReactMeasureMap.entries())
        });
      }
    }
    return {
      dataForRoots: dataForRoots,
      rendererID: rendererID,
      timelineData: timelineData
    };
  }
  function snapshotTreeBaseDurations(instance, target) {
    // We don't need to convert milliseconds to microseconds in this case,
    // because the profiling summary is JSON serialized.
    if (instance.kind !== FILTERED_FIBER_INSTANCE) {
      target.push([instance.id, instance.treeBaseDuration]);
    }
    for (var child = instance.firstChild; child !== null; child = child.nextSibling) {
      snapshotTreeBaseDurations(child, target);
    }
  }
  function startProfiling(shouldRecordChangeDescriptions, shouldRecordTimeline) {
    if (isProfiling) {
      return;
    }
    recordChangeDescriptions = shouldRecordChangeDescriptions;
    recordTimeline = shouldRecordTimeline; // Capture initial values as of the time profiling starts.
    // It's important we snapshot both the durations and the id-to-root map,
    // since either of these may change during the profiling session
    // (e.g. when a fiber is re-rendered or when a fiber gets removed).

    displayNamesByRootID = new Map();
    initialTreeBaseDurationsMap = new Map();
    hook.getFiberRoots(rendererID).forEach(function (root) {
      var rootInstance = rootToFiberInstanceMap.get(root);
      if (rootInstance === undefined) {
        throw new Error('Expected the root instance to already exist when starting profiling');
      }
      var rootID = rootInstance.id;
      displayNamesByRootID.set(rootID, getDisplayNameForRoot(root.current));
      var initialTreeBaseDurations = [];
      snapshotTreeBaseDurations(rootInstance, initialTreeBaseDurations);
      initialTreeBaseDurationsMap.set(rootID, initialTreeBaseDurations);
    });
    isProfiling = true;
    profilingStartTime = renderer_getCurrentTime();
    rootToCommitProfilingMetadataMap = new Map();
    if (toggleProfilingStatus !== null) {
      toggleProfilingStatus(true, recordTimeline);
    }
  }
  function stopProfiling() {
    isProfiling = false;
    recordChangeDescriptions = false;
    if (toggleProfilingStatus !== null) {
      toggleProfilingStatus(false, recordTimeline);
    }
    recordTimeline = false;
  } // Automatically start profiling so that we don't miss timing info from initial "mount".

  if (shouldStartProfilingNow) {
    startProfiling(profilingSettings.recordChangeDescriptions, profilingSettings.recordTimeline);
  }
  function getNearestFiber(devtoolsInstance) {
    if (devtoolsInstance.kind === VIRTUAL_INSTANCE) {
      var inst = devtoolsInstance;
      while (inst.kind === VIRTUAL_INSTANCE) {
        // For virtual instances, we search deeper until we find a Fiber instance.
        // Then we search upwards from that Fiber. That's because Virtual Instances
        // will always have an Fiber child filtered or not. If we searched its parents
        // we might skip through a filtered Error Boundary before we hit a FiberInstance.
        if (inst.firstChild === null) {
          return null;
        }
        inst = inst.firstChild;
      }
      return inst.data.return;
    } else {
      return devtoolsInstance.data;
    }
  } // React will switch between these implementations depending on whether
  // we have any manually suspended/errored-out Fibers or not.

  function shouldErrorFiberAlwaysNull() {
    return null;
  } // Map of Fiber and its force error status: true (error), false (toggled off)

  var forceErrorForFibers = new Map();
  function shouldErrorFiberAccordingToMap(fiber) {
    if (typeof setErrorHandler !== 'function') {
      throw new Error('Expected overrideError() to not get called for earlier React versions.');
    }
    var status = forceErrorForFibers.get(fiber);
    if (status === false) {
      // TRICKY overrideError adds entries to this Map,
      // so ideally it would be the method that clears them too,
      // but that would break the functionality of the feature,
      // since DevTools needs to tell React to act differently than it normally would
      // (don't just re-render the failed boundary, but reset its errored state too).
      // So we can only clear it after telling React to reset the state.
      // Technically this is premature and we should schedule it for later,
      // since the render could always fail without committing the updated error boundary,
      // but since this is a DEV-only feature, the simplicity is worth the trade off.
      forceErrorForFibers.delete(fiber);
      if (forceErrorForFibers.size === 0) {
        // Last override is gone. Switch React back to fast path.
        setErrorHandler(shouldErrorFiberAlwaysNull);
      }
      return false;
    }
    if (status === undefined && fiber.alternate !== null) {
      status = forceErrorForFibers.get(fiber.alternate);
      if (status === false) {
        forceErrorForFibers.delete(fiber.alternate);
        if (forceErrorForFibers.size === 0) {
          // Last override is gone. Switch React back to fast path.
          setErrorHandler(shouldErrorFiberAlwaysNull);
        }
      }
    }
    if (status === undefined) {
      return false;
    }
    return status;
  }
  function overrideError(id, forceError) {
    if (typeof setErrorHandler !== 'function' || typeof scheduleUpdate !== 'function') {
      throw new Error('Expected overrideError() to not get called for earlier React versions.');
    }
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      return;
    }
    var nearestFiber = getNearestFiber(devtoolsInstance);
    if (nearestFiber === null) {
      return;
    }
    var fiber = nearestFiber;
    while (!isErrorBoundary(fiber)) {
      if (fiber.return === null) {
        return;
      }
      fiber = fiber.return;
    }
    forceErrorForFibers.set(fiber, forceError);
    if (fiber.alternate !== null) {
      // We only need one of the Fibers in the set.
      forceErrorForFibers.delete(fiber.alternate);
    }
    if (forceErrorForFibers.size === 1) {
      // First override is added. Switch React to slower path.
      setErrorHandler(shouldErrorFiberAccordingToMap);
    }
    scheduleUpdate(fiber);
  }
  function shouldSuspendFiberAlwaysFalse() {
    return false;
  }
  var forceFallbackForFibers = new Set();
  function shouldSuspendFiberAccordingToSet(fiber) {
    return forceFallbackForFibers.has(fiber) || fiber.alternate !== null && forceFallbackForFibers.has(fiber.alternate);
  }
  function overrideSuspense(id, forceFallback) {
    if (typeof setSuspenseHandler !== 'function' || typeof scheduleUpdate !== 'function') {
      throw new Error('Expected overrideSuspense() to not get called for earlier React versions.');
    }
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      return;
    }
    var nearestFiber = getNearestFiber(devtoolsInstance);
    if (nearestFiber === null) {
      return;
    }
    var fiber = nearestFiber;
    while (fiber.tag !== SuspenseComponent) {
      if (fiber.return === null) {
        return;
      }
      fiber = fiber.return;
    }
    if (fiber.alternate !== null) {
      // We only need one of the Fibers in the set.
      forceFallbackForFibers.delete(fiber.alternate);
    }
    if (forceFallback) {
      forceFallbackForFibers.add(fiber);
      if (forceFallbackForFibers.size === 1) {
        // First override is added. Switch React to slower path.
        setSuspenseHandler(shouldSuspendFiberAccordingToSet);
      }
    } else {
      forceFallbackForFibers.delete(fiber);
      if (forceFallbackForFibers.size === 0) {
        // Last override is gone. Switch React back to fast path.
        setSuspenseHandler(shouldSuspendFiberAlwaysFalse);
      }
    }
    scheduleUpdate(fiber);
  } // Remember if we're trying to restore the selection after reload.
  // In that case, we'll do some extra checks for matching mounts.

  var trackedPath = null;
  var trackedPathMatchFiber = null; // This is the deepest unfiltered match of a Fiber.

  var trackedPathMatchInstance = null; // This is the deepest matched filtered Instance.

  var trackedPathMatchDepth = -1;
  var mightBeOnTrackedPath = false;
  function setTrackedPath(path) {
    if (path === null) {
      trackedPathMatchFiber = null;
      trackedPathMatchInstance = null;
      trackedPathMatchDepth = -1;
      mightBeOnTrackedPath = false;
    }
    trackedPath = path;
  } // We call this before traversing a new mount.
  // It remembers whether this Fiber is the next best match for tracked path.
  // The return value signals whether we should keep matching siblings or not.

  function updateTrackedPathStateBeforeMount(fiber, fiberInstance) {
    if (trackedPath === null || !mightBeOnTrackedPath) {
      // Fast path: there's nothing to track so do nothing and ignore siblings.
      return false;
    }
    var returnFiber = fiber.return;
    var returnAlternate = returnFiber !== null ? returnFiber.alternate : null; // By now we know there's some selection to restore, and this is a new Fiber.
    // Is this newly mounted Fiber a direct child of the current best match?
    // (This will also be true for new roots if we haven't matched anything yet.)

    if (trackedPathMatchFiber === returnFiber || trackedPathMatchFiber === returnAlternate && returnAlternate !== null) {
      // Is this the next Fiber we should select? Let's compare the frames.
      var actualFrame = getPathFrame(fiber); // $FlowFixMe[incompatible-use] found when upgrading Flow

      var expectedFrame = trackedPath[trackedPathMatchDepth + 1];
      if (expectedFrame === undefined) {
        throw new Error('Expected to see a frame at the next depth.');
      }
      if (actualFrame.index === expectedFrame.index && actualFrame.key === expectedFrame.key && actualFrame.displayName === expectedFrame.displayName) {
        // We have our next match.
        trackedPathMatchFiber = fiber;
        if (fiberInstance !== null && fiberInstance.kind === FIBER_INSTANCE) {
          trackedPathMatchInstance = fiberInstance;
        }
        trackedPathMatchDepth++; // Are we out of frames to match?
        // $FlowFixMe[incompatible-use] found when upgrading Flow

        if (trackedPathMatchDepth === trackedPath.length - 1) {
          // There's nothing that can possibly match afterwards.
          // Don't check the children.
          mightBeOnTrackedPath = false;
        } else {
          // Check the children, as they might reveal the next match.
          mightBeOnTrackedPath = true;
        } // In either case, since we have a match, we don't need
        // to check the siblings. They'll never match.

        return false;
      }
    }
    if (trackedPathMatchFiber === null && fiberInstance === null) {
      // We're now looking for a Virtual Instance. It might be inside filtered Fibers
      // so we keep looking below.
      return true;
    } // This Fiber's parent is on the path, but this Fiber itself isn't.
    // There's no need to check its children--they won't be on the path either.

    mightBeOnTrackedPath = false; // However, one of its siblings may be on the path so keep searching.

    return true;
  }
  function updateVirtualTrackedPathStateBeforeMount(virtualInstance, parentInstance) {
    if (trackedPath === null || !mightBeOnTrackedPath) {
      // Fast path: there's nothing to track so do nothing and ignore siblings.
      return false;
    } // Check if we've matched our nearest unfiltered parent so far.

    if (trackedPathMatchInstance === parentInstance) {
      var actualFrame = getVirtualPathFrame(virtualInstance); // $FlowFixMe[incompatible-use] found when upgrading Flow

      var expectedFrame = trackedPath[trackedPathMatchDepth + 1];
      if (expectedFrame === undefined) {
        throw new Error('Expected to see a frame at the next depth.');
      }
      if (actualFrame.index === expectedFrame.index && actualFrame.key === expectedFrame.key && actualFrame.displayName === expectedFrame.displayName) {
        // We have our next match.
        trackedPathMatchFiber = null; // Don't bother looking in Fibers anymore. We're deeper now.

        trackedPathMatchInstance = virtualInstance;
        trackedPathMatchDepth++; // Are we out of frames to match?
        // $FlowFixMe[incompatible-use] found when upgrading Flow

        if (trackedPathMatchDepth === trackedPath.length - 1) {
          // There's nothing that can possibly match afterwards.
          // Don't check the children.
          mightBeOnTrackedPath = false;
        } else {
          // Check the children, as they might reveal the next match.
          mightBeOnTrackedPath = true;
        } // In either case, since we have a match, we don't need
        // to check the siblings. They'll never match.

        return false;
      }
    }
    if (trackedPathMatchFiber !== null) {
      // We're still looking for a Fiber which might be underneath this instance.
      return true;
    } // This Instance's parent is on the path, but this Instance itself isn't.
    // There's no need to check its children--they won't be on the path either.

    mightBeOnTrackedPath = false; // However, one of its siblings may be on the path so keep searching.

    return true;
  }
  function updateTrackedPathStateAfterMount(mightSiblingsBeOnTrackedPath) {
    // updateTrackedPathStateBeforeMount() told us whether to match siblings.
    // Now that we're entering siblings, let's use that information.
    mightBeOnTrackedPath = mightSiblingsBeOnTrackedPath;
  } // Roots don't have a real persistent identity.
  // A root's "pseudo key" is "childDisplayName:indexWithThatName".
  // For example, "App:0" or, in case of similar roots, "Story:0", "Story:1", etc.
  // We will use this to try to disambiguate roots when restoring selection between reloads.

  var rootPseudoKeys = new Map();
  var rootDisplayNameCounter = new Map();
  function setRootPseudoKey(id, fiber) {
    var name = getDisplayNameForRoot(fiber);
    var counter = rootDisplayNameCounter.get(name) || 0;
    rootDisplayNameCounter.set(name, counter + 1);
    var pseudoKey = "".concat(name, ":").concat(counter);
    rootPseudoKeys.set(id, pseudoKey);
  }
  function removeRootPseudoKey(id) {
    var pseudoKey = rootPseudoKeys.get(id);
    if (pseudoKey === undefined) {
      throw new Error('Expected root pseudo key to be known.');
    }
    var name = pseudoKey.slice(0, pseudoKey.lastIndexOf(':'));
    var counter = rootDisplayNameCounter.get(name);
    if (counter === undefined) {
      throw new Error('Expected counter to be known.');
    }
    if (counter > 1) {
      rootDisplayNameCounter.set(name, counter - 1);
    } else {
      rootDisplayNameCounter.delete(name);
    }
    rootPseudoKeys.delete(id);
  }
  function getDisplayNameForRoot(fiber) {
    var preferredDisplayName = null;
    var fallbackDisplayName = null;
    var child = fiber.child; // Go at most three levels deep into direct children
    // while searching for a child that has a displayName.

    for (var i = 0; i < 3; i++) {
      if (child === null) {
        break;
      }
      var displayName = getDisplayNameForFiber(child);
      if (displayName !== null) {
        // Prefer display names that we get from user-defined components.
        // We want to avoid using e.g. 'Suspense' unless we find nothing else.
        if (typeof child.type === 'function') {
          // There's a few user-defined tags, but we'll prefer the ones
          // that are usually explicitly named (function or class components).
          preferredDisplayName = displayName;
        } else if (fallbackDisplayName === null) {
          fallbackDisplayName = displayName;
        }
      }
      if (preferredDisplayName !== null) {
        break;
      }
      child = child.child;
    }
    return preferredDisplayName || fallbackDisplayName || 'Anonymous';
  }
  function getPathFrame(fiber) {
    var key = fiber.key;
    var displayName = getDisplayNameForFiber(fiber);
    var index = fiber.index;
    switch (fiber.tag) {
      case HostRoot:
        // Roots don't have a real displayName, index, or key.
        // Instead, we'll use the pseudo key (childDisplayName:indexWithThatName).
        var rootInstance = rootToFiberInstanceMap.get(fiber.stateNode);
        if (rootInstance === undefined) {
          throw new Error('Expected the root instance to exist when computing a path');
        }
        var pseudoKey = rootPseudoKeys.get(rootInstance.id);
        if (pseudoKey === undefined) {
          throw new Error('Expected mounted root to have known pseudo key.');
        }
        displayName = pseudoKey;
        break;
      case HostComponent:
        displayName = fiber.type;
        break;
      default:
        break;
    }
    return {
      displayName: displayName,
      key: key,
      index: index
    };
  }
  function getVirtualPathFrame(virtualInstance) {
    return {
      displayName: virtualInstance.data.name || '',
      key: virtualInstance.data.key == null ? null : virtualInstance.data.key,
      index: -1 // We use -1 to indicate that this is a virtual path frame.
    };
  } // Produces a serializable representation that does a best effort
  // of identifying a particular Fiber between page reloads.
  // The return path will contain Fibers that are "invisible" to the store
  // because their keys and indexes are important to restoring the selection.

  function getPathForElement(id) {
    var devtoolsInstance = idToDevToolsInstanceMap.get(id);
    if (devtoolsInstance === undefined) {
      return null;
    }
    var keyPath = [];
    var inst = devtoolsInstance;
    while (inst.kind === VIRTUAL_INSTANCE) {
      keyPath.push(getVirtualPathFrame(inst));
      if (inst.parent === null) {
        // This is a bug but non-essential. We should've found a root instance.
        return null;
      }
      inst = inst.parent;
    }
    var fiber = inst.data;
    while (fiber !== null) {
      // $FlowFixMe[incompatible-call] found when upgrading Flow
      keyPath.push(getPathFrame(fiber)); // $FlowFixMe[incompatible-use] found when upgrading Flow

      fiber = fiber.return;
    }
    keyPath.reverse();
    return keyPath;
  }
  function getBestMatchForTrackedPath() {
    if (trackedPath === null) {
      // Nothing to match.
      return null;
    }
    if (trackedPathMatchInstance === null) {
      // We didn't find anything.
      return null;
    }
    return {
      id: trackedPathMatchInstance.id,
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      isFullMatch: trackedPathMatchDepth === trackedPath.length - 1
    };
  }
  var formatPriorityLevel = function formatPriorityLevel(priorityLevel) {
    if (priorityLevel == null) {
      return 'Unknown';
    }
    switch (priorityLevel) {
      case ImmediatePriority:
        return 'Immediate';
      case UserBlockingPriority:
        return 'User-Blocking';
      case NormalPriority:
        return 'Normal';
      case LowPriority:
        return 'Low';
      case IdlePriority:
        return 'Idle';
      case NoPriority:
      default:
        return 'Unknown';
    }
  };
  function setTraceUpdatesEnabled(isEnabled) {
    traceUpdatesEnabled = isEnabled;
  }
  function hasElementWithId(id) {
    return idToDevToolsInstanceMap.has(id);
  }
  function getSourceForFiberInstance(fiberInstance) {
    // Favor the owner source if we have one.
    var ownerSource = getSourceForInstance(fiberInstance);
    if (ownerSource !== null) {
      return ownerSource;
    } // Otherwise fallback to the throwing trick.

    var dispatcherRef = getDispatcherRef(renderer);
    var stackFrame = dispatcherRef == null ? null : getSourceLocationByFiber(ReactTypeOfWork, fiberInstance.data, dispatcherRef);
    if (stackFrame === null) {
      return null;
    }
    var source = parseSourceFromComponentStack(stackFrame);
    fiberInstance.source = source;
    return source;
  }
  function getSourceForInstance(instance) {
    var unresolvedSource = instance.source;
    if (unresolvedSource === null) {
      // We don't have any source yet. We can try again later in case an owned child mounts later.
      // TODO: We won't have any information here if the child is filtered.
      return null;
    }
    if (instance.kind === VIRTUAL_INSTANCE) {
      // We might have found one on the virtual instance.
      var debugLocation = instance.data.debugLocation;
      if (debugLocation != null) {
        unresolvedSource = debugLocation;
      }
    } // If we have the debug stack (the creation stack of the JSX) for any owned child of this
    // component, then at the bottom of that stack will be a stack frame that is somewhere within
    // the component's function body. Typically it would be the callsite of the JSX unless there's
    // any intermediate utility functions. This won't point to the top of the component function
    // but it's at least somewhere within it.

    if (renderer_isError(unresolvedSource)) {
      return instance.source = parseSourceFromOwnerStack(unresolvedSource);
    }
    if (typeof unresolvedSource === 'string') {
      var idx = unresolvedSource.lastIndexOf('\n');
      var lastLine = idx === -1 ? unresolvedSource : unresolvedSource.slice(idx + 1);
      return instance.source = parseSourceFromComponentStack(lastLine);
    } // $FlowFixMe: refined.

    return unresolvedSource;
  }
  var internalMcpFunctions = {};
  if (false)
    // removed by dead control flow
    {}
  return renderer_objectSpread({
    cleanup: cleanup,
    clearErrorsAndWarnings: clearErrorsAndWarnings,
    clearErrorsForElementID: clearErrorsForElementID,
    clearWarningsForElementID: clearWarningsForElementID,
    getSerializedElementValueByPath: getSerializedElementValueByPath,
    deletePath: deletePath,
    findHostInstancesForElementID: findHostInstancesForElementID,
    flushInitialOperations: flushInitialOperations,
    getBestMatchForTrackedPath: getBestMatchForTrackedPath,
    getDisplayNameForElementID: getDisplayNameForElementID,
    getNearestMountedDOMNode: getNearestMountedDOMNode,
    getElementIDForHostInstance: getElementIDForHostInstance,
    getInstanceAndStyle: getInstanceAndStyle,
    getOwnersList: getOwnersList,
    getPathForElement: getPathForElement,
    getProfilingData: getProfilingData,
    handleCommitFiberRoot: handleCommitFiberRoot,
    handleCommitFiberUnmount: handleCommitFiberUnmount,
    handlePostCommitFiberRoot: handlePostCommitFiberRoot,
    hasElementWithId: hasElementWithId,
    inspectElement: inspectElement,
    logElementToConsole: logElementToConsole,
    getComponentStack: getComponentStack,
    getElementAttributeByPath: getElementAttributeByPath,
    getElementSourceFunctionById: getElementSourceFunctionById,
    onErrorOrWarning: onErrorOrWarning,
    overrideError: overrideError,
    overrideSuspense: overrideSuspense,
    overrideValueAtPath: overrideValueAtPath,
    renamePath: renamePath,
    renderer: renderer,
    setTraceUpdatesEnabled: setTraceUpdatesEnabled,
    setTrackedPath: setTrackedPath,
    startProfiling: startProfiling,
    stopProfiling: stopProfiling,
    storeAsGlobal: storeAsGlobal,
    updateComponentFilters: updateComponentFilters,
    getEnvironmentNames: getEnvironmentNames
  }, internalMcpFunctions);
}