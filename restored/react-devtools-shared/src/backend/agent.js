function agent_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    agent_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    agent_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return agent_typeof(obj);
}
function agent_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function agent_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function agent_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) agent_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) agent_defineProperties(Constructor, staticProps);
  return Constructor;
}
function agent_callSuper(_this, derived, args) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }
  derived = agent_getPrototypeOf(derived);
  return agent_possibleConstructorReturn(_this, isNativeReflectConstruct() ? Reflect.construct(derived, args || [], agent_getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
function agent_possibleConstructorReturn(self, call) {
  if (call && (agent_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return agent_assertThisInitialized(self);
}
function agent_assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function agent_getPrototypeOf(o) {
  agent_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return agent_getPrototypeOf(o);
}
function agent_inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) agent_setPrototypeOf(subClass, superClass);
}
function agent_setPrototypeOf(o, p) {
  agent_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return agent_setPrototypeOf(o, p);
}
function agent_defineProperty(obj, key, value) {
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

var debug = function debug(methodName) {
  if (__DEBUG__) {
    var _console;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    (_console = console).log.apply(_console, ["%cAgent %c".concat(methodName), 'color: purple; font-weight: bold;', 'font-weight: bold;'].concat(args));
  }
};
var Agent = /*#__PURE__*/function (_EventEmitter) {
  function Agent(bridge) {
    var _this2;
    var isProfiling = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var onReloadAndProfile = arguments.length > 2 ? arguments[2] : undefined;
    agent_classCallCheck(this, Agent);
    _this2 = agent_callSuper(this, Agent);
    agent_defineProperty(_this2, "_isProfiling", false);
    agent_defineProperty(_this2, "_rendererInterfaces", {});
    agent_defineProperty(_this2, "_persistedSelection", null);
    agent_defineProperty(_this2, "_persistedSelectionMatch", null);
    agent_defineProperty(_this2, "_traceUpdatesEnabled", false);
    agent_defineProperty(_this2, "clearErrorsAndWarnings", function (_ref) {
      var rendererID = _ref.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\""));
      } else {
        renderer.clearErrorsAndWarnings();
      }
    });
    agent_defineProperty(_this2, "clearErrorsForElementID", function (_ref2) {
      var id = _ref2.id,
        rendererID = _ref2.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\""));
      } else {
        renderer.clearErrorsForElementID(id);
      }
    });
    agent_defineProperty(_this2, "clearWarningsForElementID", function (_ref3) {
      var id = _ref3.id,
        rendererID = _ref3.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\""));
      } else {
        renderer.clearWarningsForElementID(id);
      }
    });
    agent_defineProperty(_this2, "copyElementPath", function (_ref4) {
      var id = _ref4.id,
        path = _ref4.path,
        rendererID = _ref4.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        var value = renderer.getSerializedElementValueByPath(id, path);
        if (value != null) {
          _this2._bridge.send('saveToClipboard', value);
        } else {
          console.warn("Unable to obtain serialized value for element \"".concat(id, "\""));
        }
      }
    });
    agent_defineProperty(_this2, "deletePath", function (_ref5) {
      var hookID = _ref5.hookID,
        id = _ref5.id,
        path = _ref5.path,
        rendererID = _ref5.rendererID,
        type = _ref5.type;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        renderer.deletePath(type, id, hookID, path);
      }
    });
    agent_defineProperty(_this2, "getBackendVersion", function () {
      var version = "6.1.5-5d87cd2244";
      if (version) {
        _this2._bridge.send('backendVersion', version);
      }
    });
    agent_defineProperty(_this2, "getBridgeProtocol", function () {
      _this2._bridge.send('bridgeProtocol', currentBridgeProtocol);
    });
    agent_defineProperty(_this2, "getProfilingData", function (_ref6) {
      var rendererID = _ref6.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\""));
      }
      _this2._bridge.send('profilingData', renderer.getProfilingData());
    });
    agent_defineProperty(_this2, "getProfilingStatus", function () {
      _this2._bridge.send('profilingStatus', _this2._isProfiling);
    });
    agent_defineProperty(_this2, "getOwnersList", function (_ref7) {
      var id = _ref7.id,
        rendererID = _ref7.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        var owners = renderer.getOwnersList(id);
        _this2._bridge.send('ownersList', {
          id: id,
          owners: owners
        });
      }
    });
    agent_defineProperty(_this2, "inspectElement", function (_ref8) {
      var forceFullData = _ref8.forceFullData,
        id = _ref8.id,
        path = _ref8.path,
        rendererID = _ref8.rendererID,
        requestID = _ref8.requestID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        _this2._bridge.send('inspectedElement', renderer.inspectElement(requestID, id, path, forceFullData)); // When user selects an element, stop trying to restore the selection,
        // and instead remember the current selection for the next reload.

        if (_this2._persistedSelectionMatch === null || _this2._persistedSelectionMatch.id !== id) {
          _this2._persistedSelection = null;
          _this2._persistedSelectionMatch = null;
          renderer.setTrackedPath(null); // Throttle persisting the selection.

          _this2._lastSelectedElementID = id;
          _this2._lastSelectedRendererID = rendererID;
          if (!_this2._persistSelectionTimerScheduled) {
            _this2._persistSelectionTimerScheduled = true;
            setTimeout(_this2._persistSelection, 1000);
          }
        } // TODO: If there was a way to change the selected DOM element
        // in built-in Elements tab without forcing a switch to it, we'd do it here.
        // For now, it doesn't seem like there is a way to do that:
        // https://github.com/bvaughn/react-devtools-experimental/issues/102
        // (Setting $0 doesn't work, and calling inspect() switches the tab.)
      }
    });
    agent_defineProperty(_this2, "logElementToConsole", function (_ref9) {
      var id = _ref9.id,
        rendererID = _ref9.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        renderer.logElementToConsole(id);
      }
    });
    agent_defineProperty(_this2, "overrideError", function (_ref10) {
      var id = _ref10.id,
        rendererID = _ref10.rendererID,
        forceError = _ref10.forceError;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        renderer.overrideError(id, forceError);
      }
    });
    agent_defineProperty(_this2, "overrideSuspense", function (_ref11) {
      var id = _ref11.id,
        rendererID = _ref11.rendererID,
        forceFallback = _ref11.forceFallback;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        renderer.overrideSuspense(id, forceFallback);
      }
    });
    agent_defineProperty(_this2, "overrideValueAtPath", function (_ref12) {
      var hookID = _ref12.hookID,
        id = _ref12.id,
        path = _ref12.path,
        rendererID = _ref12.rendererID,
        type = _ref12.type,
        value = _ref12.value;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        renderer.overrideValueAtPath(type, id, hookID, path, value);
      }
    });
    agent_defineProperty(_this2, "overrideContext", function (_ref13) {
      var id = _ref13.id,
        path = _ref13.path,
        rendererID = _ref13.rendererID,
        wasForwarded = _ref13.wasForwarded,
        value = _ref13.value;

      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        _this2.overrideValueAtPath({
          id: id,
          path: path,
          rendererID: rendererID,
          type: 'context',
          value: value
        });
      }
    });
    agent_defineProperty(_this2, "overrideHookState", function (_ref14) {
      var id = _ref14.id,
        hookID = _ref14.hookID,
        path = _ref14.path,
        rendererID = _ref14.rendererID,
        wasForwarded = _ref14.wasForwarded,
        value = _ref14.value;

      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        _this2.overrideValueAtPath({
          id: id,
          path: path,
          rendererID: rendererID,
          type: 'hooks',
          value: value
        });
      }
    });
    agent_defineProperty(_this2, "overrideProps", function (_ref15) {
      var id = _ref15.id,
        path = _ref15.path,
        rendererID = _ref15.rendererID,
        wasForwarded = _ref15.wasForwarded,
        value = _ref15.value;

      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        _this2.overrideValueAtPath({
          id: id,
          path: path,
          rendererID: rendererID,
          type: 'props',
          value: value
        });
      }
    });
    agent_defineProperty(_this2, "overrideState", function (_ref16) {
      var id = _ref16.id,
        path = _ref16.path,
        rendererID = _ref16.rendererID,
        wasForwarded = _ref16.wasForwarded,
        value = _ref16.value;

      // Don't forward a message that's already been forwarded by the front-end Bridge.
      // We only need to process the override command once!
      if (!wasForwarded) {
        _this2.overrideValueAtPath({
          id: id,
          path: path,
          rendererID: rendererID,
          type: 'state',
          value: value
        });
      }
    });
    agent_defineProperty(_this2, "onReloadAndProfileSupportedByHost", function () {
      _this2._bridge.send('isReloadAndProfileSupportedByBackend', true);
    });
    agent_defineProperty(_this2, "reloadAndProfile", function (_ref17) {
      var recordChangeDescriptions = _ref17.recordChangeDescriptions,
        recordTimeline = _ref17.recordTimeline;
      if (typeof _this2._onReloadAndProfile === 'function') {
        _this2._onReloadAndProfile(recordChangeDescriptions, recordTimeline);
      } // This code path should only be hit if the shell has explicitly told the Store that it supports profiling.
      // In that case, the shell must also listen for this specific message to know when it needs to reload the app.
      // The agent can't do this in a way that is renderer agnostic.

      _this2._bridge.send('reloadAppForProfiling');
    });
    agent_defineProperty(_this2, "renamePath", function (_ref18) {
      var hookID = _ref18.hookID,
        id = _ref18.id,
        newPath = _ref18.newPath,
        oldPath = _ref18.oldPath,
        rendererID = _ref18.rendererID,
        type = _ref18.type;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        renderer.renamePath(type, id, hookID, oldPath, newPath);
      }
    });
    agent_defineProperty(_this2, "setTraceUpdatesEnabled", function (traceUpdatesEnabled) {
      _this2._traceUpdatesEnabled = traceUpdatesEnabled;
      toggleEnabled(traceUpdatesEnabled);
      for (var rendererID in _this2._rendererInterfaces) {
        var renderer = _this2._rendererInterfaces[rendererID];
        renderer.setTraceUpdatesEnabled(traceUpdatesEnabled);
      }
    });
    agent_defineProperty(_this2, "syncSelectionFromBuiltinElementsPanel", function () {
      var target = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.$0;
      if (target == null) {
        return;
      }
      _this2.selectNode(target);
    });
    agent_defineProperty(_this2, "shutdown", function () {
      // Clean up the overlay if visible, and associated events.
      _this2.emit('shutdown');
      _this2._bridge.removeAllListeners();
      _this2.removeAllListeners();
    });
    agent_defineProperty(_this2, "startProfiling", function (_ref19) {
      var recordChangeDescriptions = _ref19.recordChangeDescriptions,
        recordTimeline = _ref19.recordTimeline;
      _this2._isProfiling = true;
      for (var rendererID in _this2._rendererInterfaces) {
        var renderer = _this2._rendererInterfaces[rendererID];
        renderer.startProfiling(recordChangeDescriptions, recordTimeline);
      }
      _this2._bridge.send('profilingStatus', _this2._isProfiling);
    });
    agent_defineProperty(_this2, "stopProfiling", function () {
      _this2._isProfiling = false;
      for (var rendererID in _this2._rendererInterfaces) {
        var renderer = _this2._rendererInterfaces[rendererID];
        renderer.stopProfiling();
      }
      _this2._bridge.send('profilingStatus', _this2._isProfiling);
    });
    agent_defineProperty(_this2, "stopInspectingNative", function (selected) {
      _this2._bridge.send('stopInspectingHost', selected);
    });
    agent_defineProperty(_this2, "storeAsGlobal", function (_ref20) {
      var count = _ref20.count,
        id = _ref20.id,
        path = _ref20.path,
        rendererID = _ref20.rendererID;
      var renderer = _this2._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\" for element \"").concat(id, "\""));
      } else {
        renderer.storeAsGlobal(id, path, count);
      }
    });
    agent_defineProperty(_this2, "updateHookSettings", function (settings) {
      // Propagate the settings, so Backend can subscribe to it and modify hook
      _this2.emit('updateHookSettings', settings);
    });
    agent_defineProperty(_this2, "getHookSettings", function () {
      _this2.emit('getHookSettings');
    });
    agent_defineProperty(_this2, "onHookSettings", function (settings) {
      _this2._bridge.send('hookSettings', settings);
    });
    agent_defineProperty(_this2, "updateComponentFilters", function (componentFilters) {
      for (var rendererIDString in _this2._rendererInterfaces) {
        var rendererID = +rendererIDString;
        var renderer = _this2._rendererInterfaces[rendererID];
        if (_this2._lastSelectedRendererID === rendererID) {
          // Changing component filters will unmount and remount the DevTools tree.
          // Track the last selection's path so we can restore the selection.
          var path = renderer.getPathForElement(_this2._lastSelectedElementID);
          if (path !== null) {
            renderer.setTrackedPath(path);
            _this2._persistedSelection = {
              rendererID: rendererID,
              path: path
            };
          }
        }
        renderer.updateComponentFilters(componentFilters);
      }
    });
    agent_defineProperty(_this2, "getEnvironmentNames", function () {
      var accumulatedNames = null;
      for (var rendererID in _this2._rendererInterfaces) {
        var renderer = _this2._rendererInterfaces[+rendererID];
        var names = renderer.getEnvironmentNames();
        if (accumulatedNames === null) {
          accumulatedNames = names;
        } else {
          for (var i = 0; i < names.length; i++) {
            if (accumulatedNames.indexOf(names[i]) === -1) {
              accumulatedNames.push(names[i]);
            }
          }
        }
      }
      _this2._bridge.send('environmentNames', accumulatedNames || []);
    });
    agent_defineProperty(_this2, "onTraceUpdates", function (nodes) {
      _this2.emit('traceUpdates', nodes);
    });
    agent_defineProperty(_this2, "onFastRefreshScheduled", function () {
      if (__DEBUG__) {
        debug('onFastRefreshScheduled');
      }
      _this2._bridge.send('fastRefreshScheduled');
    });
    agent_defineProperty(_this2, "onHookOperations", function (operations) {
      if (__DEBUG__) {
        debug('onHookOperations', "(".concat(operations.length, ") [").concat(operations.join(', '), "]"));
      } // TODO:
      // The chrome.runtime does not currently support transferables; it forces JSON serialization.
      // See bug https://bugs.chromium.org/p/chromium/issues/detail?id=927134
      //
      // Regarding transferables, the postMessage doc states:
      // If the ownership of an object is transferred, it becomes unusable (neutered)
      // in the context it was sent from and becomes available only to the worker it was sent to.
      //
      // Even though Chrome is eventually JSON serializing the array buffer,
      // using the transferable approach also sometimes causes it to throw:
      //   DOMException: Failed to execute 'postMessage' on 'Window': ArrayBuffer at index 0 is already neutered.
      //
      // See bug https://github.com/bvaughn/react-devtools-experimental/issues/25
      //
      // The Store has a fallback in place that parses the message as JSON if the type isn't an array.
      // For now the simplest fix seems to be to not transfer the array.
      // This will negatively impact performance on Firefox so it's unfortunate,
      // but until we're able to fix the Chrome error mentioned above, it seems necessary.
      //
      // this._bridge.send('operations', operations, [operations.buffer]);

      _this2._bridge.send('operations', operations);
      if (_this2._persistedSelection !== null) {
        var rendererID = operations[0];
        if (_this2._persistedSelection.rendererID === rendererID) {
          // Check if we can select a deeper match for the persisted selection.
          var renderer = _this2._rendererInterfaces[rendererID];
          if (renderer == null) {
            console.warn("Invalid renderer id \"".concat(rendererID, "\""));
          } else {
            var prevMatch = _this2._persistedSelectionMatch;
            var nextMatch = renderer.getBestMatchForTrackedPath();
            _this2._persistedSelectionMatch = nextMatch;
            var prevMatchID = prevMatch !== null ? prevMatch.id : null;
            var nextMatchID = nextMatch !== null ? nextMatch.id : null;
            if (prevMatchID !== nextMatchID) {
              if (nextMatchID !== null) {
                // We moved forward, unlocking a deeper node.
                _this2._bridge.send('selectElement', nextMatchID);
              }
            }
            if (nextMatch !== null && nextMatch.isFullMatch) {
              // We've just unlocked the innermost selected node.
              // There's no point tracking it further.
              _this2._persistedSelection = null;
              _this2._persistedSelectionMatch = null;
              renderer.setTrackedPath(null);
            }
          }
        }
      }
    });
    agent_defineProperty(_this2, "getIfHasUnsupportedRendererVersion", function () {
      _this2.emit('getIfHasUnsupportedRendererVersion');
    });
    agent_defineProperty(_this2, "_persistSelectionTimerScheduled", false);
    agent_defineProperty(_this2, "_lastSelectedRendererID", -1);
    agent_defineProperty(_this2, "_lastSelectedElementID", -1);
    agent_defineProperty(_this2, "_persistSelection", function () {
      _this2._persistSelectionTimerScheduled = false;
      var rendererID = _this2._lastSelectedRendererID;
      var id = _this2._lastSelectedElementID; // This is throttled, so both renderer and selected ID
      // might not be available by the time we read them.
      // This is why we need the defensive checks here.

      var renderer = _this2._rendererInterfaces[rendererID];
      var path = renderer != null ? renderer.getPathForElement(id) : null;
      if (path !== null) {
        storage_sessionStorageSetItem(SESSION_STORAGE_LAST_SELECTION_KEY, JSON.stringify({
          rendererID: rendererID,
          path: path
        }));
      } else {
        storage_sessionStorageRemoveItem(SESSION_STORAGE_LAST_SELECTION_KEY);
      }
    });
    _this2._isProfiling = isProfiling;
    _this2._onReloadAndProfile = onReloadAndProfile;
    var persistedSelectionString = storage_sessionStorageGetItem(SESSION_STORAGE_LAST_SELECTION_KEY);
    if (persistedSelectionString != null) {
      _this2._persistedSelection = JSON.parse(persistedSelectionString);
    }
    _this2._bridge = bridge;
    bridge.addListener('clearErrorsAndWarnings', _this2.clearErrorsAndWarnings);
    bridge.addListener('clearErrorsForElementID', _this2.clearErrorsForElementID);
    bridge.addListener('clearWarningsForElementID', _this2.clearWarningsForElementID);
    bridge.addListener('copyElementPath', _this2.copyElementPath);
    bridge.addListener('deletePath', _this2.deletePath);
    bridge.addListener('getBackendVersion', _this2.getBackendVersion);
    bridge.addListener('getBridgeProtocol', _this2.getBridgeProtocol);
    bridge.addListener('getProfilingData', _this2.getProfilingData);
    bridge.addListener('getProfilingStatus', _this2.getProfilingStatus);
    bridge.addListener('getOwnersList', _this2.getOwnersList);
    bridge.addListener('inspectElement', _this2.inspectElement);
    bridge.addListener('logElementToConsole', _this2.logElementToConsole);
    bridge.addListener('overrideError', _this2.overrideError);
    bridge.addListener('overrideSuspense', _this2.overrideSuspense);
    bridge.addListener('overrideValueAtPath', _this2.overrideValueAtPath);
    bridge.addListener('reloadAndProfile', _this2.reloadAndProfile);
    bridge.addListener('renamePath', _this2.renamePath);
    bridge.addListener('setTraceUpdatesEnabled', _this2.setTraceUpdatesEnabled);
    bridge.addListener('startProfiling', _this2.startProfiling);
    bridge.addListener('stopProfiling', _this2.stopProfiling);
    bridge.addListener('storeAsGlobal', _this2.storeAsGlobal);
    bridge.addListener('syncSelectionFromBuiltinElementsPanel', _this2.syncSelectionFromBuiltinElementsPanel);
    bridge.addListener('shutdown', _this2.shutdown);
    bridge.addListener('updateHookSettings', _this2.updateHookSettings);
    bridge.addListener('getHookSettings', _this2.getHookSettings);
    bridge.addListener('updateComponentFilters', _this2.updateComponentFilters);
    bridge.addListener('getEnvironmentNames', _this2.getEnvironmentNames);
    bridge.addListener('getIfHasUnsupportedRendererVersion', _this2.getIfHasUnsupportedRendererVersion); // Temporarily support older standalone front-ends sending commands to newer embedded backends.
    // We do this because React Native embeds the React DevTools backend,
    // but cannot control which version of the frontend users use.

    bridge.addListener('overrideContext', _this2.overrideContext);
    bridge.addListener('overrideHookState', _this2.overrideHookState);
    bridge.addListener('overrideProps', _this2.overrideProps);
    bridge.addListener('overrideState', _this2.overrideState);
    setupHighlighter(bridge, _this2);
    TraceUpdates_initialize(_this2); // By this time, Store should already be initialized and intercept events

    bridge.send('backendInitialized');
    if (_this2._isProfiling) {
      bridge.send('profilingStatus', true);
    }
    return _this2;
  }
  agent_inherits(Agent, _EventEmitter);
  return agent_createClass(Agent, [{
    key: "rendererInterfaces",
    get: function get() {
      return this._rendererInterfaces;
    }
  }, {
    key: "getInstanceAndStyle",
    value: function getInstanceAndStyle(_ref21) {
      var id = _ref21.id,
        rendererID = _ref21.rendererID;
      var renderer = this._rendererInterfaces[rendererID];
      if (renderer == null) {
        console.warn("Invalid renderer id \"".concat(rendererID, "\""));
        return null;
      }
      return renderer.getInstanceAndStyle(id);
    }
  }, {
    key: "getIDForHostInstance",
    value: function getIDForHostInstance(target) {
      if (isReactNativeEnvironment() || typeof target.nodeType !== 'number') {
        // In React Native or non-DOM we simply pick any renderer that has a match.
        for (var rendererID in this._rendererInterfaces) {
          var renderer = this._rendererInterfaces[rendererID];
          try {
            var match = renderer.getElementIDForHostInstance(target);
            if (match != null) {
              return match;
            }
          } catch (error) {// Some old React versions might throw if they can't find a match.
            // If so we should ignore it...
          }
        }
        return null;
      } else {
        // In the DOM we use a smarter mechanism to find the deepest a DOM node
        // that is registered if there isn't an exact match.
        var bestMatch = null;
        var bestRenderer = null; // Find the nearest ancestor which is mounted by a React.

        for (var _rendererID in this._rendererInterfaces) {
          var _renderer = this._rendererInterfaces[_rendererID];
          var nearestNode = _renderer.getNearestMountedDOMNode(target);
          if (nearestNode !== null) {
            if (nearestNode === target) {
              // Exact match we can exit early.
              bestMatch = nearestNode;
              bestRenderer = _renderer;
              break;
            }
            if (bestMatch === null || bestMatch.contains(nearestNode)) {
              // If this is the first match or the previous match contains the new match,
              // so the new match is a deeper and therefore better match.
              bestMatch = nearestNode;
              bestRenderer = _renderer;
            }
          }
        }
        if (bestRenderer != null && bestMatch != null) {
          try {
            return bestRenderer.getElementIDForHostInstance(bestMatch);
          } catch (error) {// Some old React versions might throw if they can't find a match.
            // If so we should ignore it...
          }
        }
        return null;
      }
    }
  }, {
    key: "getComponentNameForHostInstance",
    value: function getComponentNameForHostInstance(target) {
      // We duplicate this code from getIDForHostInstance to avoid an object allocation.
      if (isReactNativeEnvironment() || typeof target.nodeType !== 'number') {
        // In React Native or non-DOM we simply pick any renderer that has a match.
        for (var rendererID in this._rendererInterfaces) {
          var renderer = this._rendererInterfaces[rendererID];
          try {
            var id = renderer.getElementIDForHostInstance(target);
            if (id) {
              return renderer.getDisplayNameForElementID(id);
            }
          } catch (error) {// Some old React versions might throw if they can't find a match.
            // If so we should ignore it...
          }
        }
        return null;
      } else {
        // In the DOM we use a smarter mechanism to find the deepest a DOM node
        // that is registered if there isn't an exact match.
        var bestMatch = null;
        var bestRenderer = null; // Find the nearest ancestor which is mounted by a React.

        for (var _rendererID2 in this._rendererInterfaces) {
          var _renderer2 = this._rendererInterfaces[_rendererID2];
          var nearestNode = _renderer2.getNearestMountedDOMNode(target);
          if (nearestNode !== null) {
            if (nearestNode === target) {
              // Exact match we can exit early.
              bestMatch = nearestNode;
              bestRenderer = _renderer2;
              break;
            }
            if (bestMatch === null || bestMatch.contains(nearestNode)) {
              // If this is the first match or the previous match contains the new match,
              // so the new match is a deeper and therefore better match.
              bestMatch = nearestNode;
              bestRenderer = _renderer2;
            }
          }
        }
        if (bestRenderer != null && bestMatch != null) {
          try {
            var _id = bestRenderer.getElementIDForHostInstance(bestMatch);
            if (_id) {
              return bestRenderer.getDisplayNameForElementID(_id);
            }
          } catch (error) {// Some old React versions might throw if they can't find a match.
            // If so we should ignore it...
          }
        }
        return null;
      }
    } // Temporarily support older standalone front-ends by forwarding the older message types
    // to the new "overrideValueAtPath" command the backend is now listening to.
    // Temporarily support older standalone front-ends by forwarding the older message types
    // to the new "overrideValueAtPath" command the backend is now listening to.
    // Temporarily support older standalone front-ends by forwarding the older message types
    // to the new "overrideValueAtPath" command the backend is now listening to.
    // Temporarily support older standalone front-ends by forwarding the older message types
    // to the new "overrideValueAtPath" command the backend is now listening to.
  }, {
    key: "selectNode",
    value: function selectNode(target) {
      var id = this.getIDForHostInstance(target);
      if (id !== null) {
        this._bridge.send('selectElement', id);
      }
    }
  }, {
    key: "registerRendererInterface",
    value: function registerRendererInterface(rendererID, rendererInterface) {
      this._rendererInterfaces[rendererID] = rendererInterface;
      rendererInterface.setTraceUpdatesEnabled(this._traceUpdatesEnabled); // When the renderer is attached, we need to tell it whether
      // we remember the previous selection that we'd like to restore.
      // It'll start tracking mounts for matches to the last selection path.

      var selection = this._persistedSelection;
      if (selection !== null && selection.rendererID === rendererID) {
        rendererInterface.setTrackedPath(selection.path);
      }
    }
  }, {
    key: "onUnsupportedRenderer",
    value: function onUnsupportedRenderer() {
      this._bridge.send('unsupportedRendererVersion');
    }
  }]);
}(EventEmitter);