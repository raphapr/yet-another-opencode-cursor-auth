/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */







var savedComponentFilters = getDefaultComponentFilters();

function backend_debug(methodName) {
  if (__DEBUG__) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_console = console).log.apply(_console, ["%c[core/backend] %c".concat(methodName), 'color: teal; font-weight: bold;', 'font-weight: bold;'].concat(args));
  }
}

function backend_initialize(maybeSettingsOrSettingsPromise) {
  var shouldStartProfilingNow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var profilingSettings = arguments.length > 2 ? arguments[2] : undefined;
  installHook(window, maybeSettingsOrSettingsPromise, shouldStartProfilingNow, profilingSettings);
}
function connectToDevTools(options) {
  var hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (hook == null) {
    // DevTools didn't get injected into this page (maybe b'c of the contentType).
    return;
  }

  var _ref = options || {},
      _ref$host = _ref.host,
      host = _ref$host === void 0 ? 'localhost' : _ref$host,
      nativeStyleEditorValidAttributes = _ref.nativeStyleEditorValidAttributes,
      _ref$useHttps = _ref.useHttps,
      useHttps = _ref$useHttps === void 0 ? false : _ref$useHttps,
      _ref$port = _ref.port,
      port = _ref$port === void 0 ? 8097 : _ref$port,
      websocket = _ref.websocket,
      _ref$resolveRNStyle = _ref.resolveRNStyle,
      resolveRNStyle = _ref$resolveRNStyle === void 0 ? null : _ref$resolveRNStyle,
      _ref$retryConnectionD = _ref.retryConnectionDelay,
      retryConnectionDelay = _ref$retryConnectionD === void 0 ? 2000 : _ref$retryConnectionD,
      _ref$isAppActive = _ref.isAppActive,
      isAppActive = _ref$isAppActive === void 0 ? function () {
    return true;
  } : _ref$isAppActive,
      onSettingsUpdated = _ref.onSettingsUpdated,
      _ref$isReloadAndProfi = _ref.isReloadAndProfileSupported,
      isReloadAndProfileSupported = _ref$isReloadAndProfi === void 0 ? getIsReloadAndProfileSupported() : _ref$isReloadAndProfi,
      isProfiling = _ref.isProfiling,
      onReloadAndProfile = _ref.onReloadAndProfile,
      onReloadAndProfileFlagsReset = _ref.onReloadAndProfileFlagsReset;

  var protocol = useHttps ? 'wss' : 'ws';
  var retryTimeoutID = null;

  function scheduleRetry() {
    if (retryTimeoutID === null) {
      // Two seconds because RN had issues with quick retries.
      retryTimeoutID = setTimeout(function () {
        return connectToDevTools(options);
      }, retryConnectionDelay);
    }
  }

  if (!isAppActive()) {
    // If the app is in background, maybe retry later.
    // Don't actually attempt to connect until we're in foreground.
    scheduleRetry();
    return;
  }

  var bridge = null;
  var messageListeners = [];
  var uri = protocol + '://' + host + ':' + port; // If existing websocket is passed, use it.
  // This is necessary to support our custom integrations.
  // See D6251744.

  var ws = websocket ? websocket : new window.WebSocket(uri);
  ws.onclose = handleClose;
  ws.onerror = handleFailed;
  ws.onmessage = handleMessage;

  ws.onopen = function () {
    bridge = new src_bridge({
      listen: function listen(fn) {
        messageListeners.push(fn);
        return function () {
          var index = messageListeners.indexOf(fn);

          if (index >= 0) {
            messageListeners.splice(index, 1);
          }
        };
      },
      send: function send(event, payload, transferable) {
        if (ws.readyState === ws.OPEN) {
          if (__DEBUG__) {
            backend_debug('wall.send()', event, payload);
          }

          ws.send(JSON.stringify({
            event: event,
            payload: payload
          }));
        } else {
          if (__DEBUG__) {
            backend_debug('wall.send()', 'Shutting down bridge because of closed WebSocket connection');
          }

          if (bridge !== null) {
            bridge.shutdown();
          }

          scheduleRetry();
        }
      }
    });
    bridge.addListener('updateComponentFilters', function (componentFilters) {
      // Save filter changes in memory, in case DevTools is reloaded.
      // In that case, the renderer will already be using the updated values.
      // We'll lose these in between backend reloads but that can't be helped.
      savedComponentFilters = componentFilters;
    }); // The renderer interface doesn't read saved component filters directly,
    // because they are generally stored in localStorage within the context of the extension.
    // Because of this it relies on the extension to pass filters.
    // In the case of the standalone DevTools being used with a website,
    // saved filters are injected along with the backend script tag so we shouldn't override them here.
    // This injection strategy doesn't work for React Native though.
    // Ideally the backend would save the filters itself, but RN doesn't provide a sync storage solution.
    // So for now we just fall back to using the default filters...

    if (window.__REACT_DEVTOOLS_COMPONENT_FILTERS__ == null) {
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      bridge.send('overrideComponentFilters', savedComponentFilters);
    } // TODO (npm-packages) Warn if "isBackendStorageAPISupported"
    // $FlowFixMe[incompatible-call] found when upgrading Flow


    var agent = new Agent(bridge, isProfiling, onReloadAndProfile);

    if (typeof onReloadAndProfileFlagsReset === 'function') {
      onReloadAndProfileFlagsReset();
    }

    if (onSettingsUpdated != null) {
      agent.addListener('updateHookSettings', onSettingsUpdated);
    }

    agent.addListener('shutdown', function () {
      if (onSettingsUpdated != null) {
        agent.removeListener('updateHookSettings', onSettingsUpdated);
      } // If we received 'shutdown' from `agent`, we assume the `bridge` is already shutting down,
      // and that caused the 'shutdown' event on the `agent`, so we don't need to call `bridge.shutdown()` here.


      hook.emit('shutdown');
    });
    initBackend(hook, agent, window, isReloadAndProfileSupported); // Setup React Native style editor if the environment supports it.

    if (resolveRNStyle != null || hook.resolveRNStyle != null) {
      setupNativeStyleEditor( // $FlowFixMe[incompatible-call] found when upgrading Flow
      bridge, agent, resolveRNStyle || hook.resolveRNStyle, nativeStyleEditorValidAttributes || hook.nativeStyleEditorValidAttributes || null);
    } else {
      // Otherwise listen to detect if the environment later supports it.
      // For example, Flipper does not eagerly inject these values.
      // Instead it relies on the React Native Inspector to lazily inject them.
      var lazyResolveRNStyle;
      var lazyNativeStyleEditorValidAttributes;

      var initAfterTick = function initAfterTick() {
        if (bridge !== null) {
          setupNativeStyleEditor(bridge, agent, lazyResolveRNStyle, lazyNativeStyleEditorValidAttributes);
        }
      };

      if (!hook.hasOwnProperty('resolveRNStyle')) {
        Object.defineProperty(hook, 'resolveRNStyle', {
          enumerable: false,
          get: function get() {
            return lazyResolveRNStyle;
          },
          set: function set(value) {
            lazyResolveRNStyle = value;
            initAfterTick();
          }
        });
      }

      if (!hook.hasOwnProperty('nativeStyleEditorValidAttributes')) {
        Object.defineProperty(hook, 'nativeStyleEditorValidAttributes', {
          enumerable: false,
          get: function get() {
            return lazyNativeStyleEditorValidAttributes;
          },
          set: function set(value) {
            lazyNativeStyleEditorValidAttributes = value;
            initAfterTick();
          }
        });
      }
    }
  };

  function handleClose() {
    if (__DEBUG__) {
      backend_debug('WebSocket.onclose');
    }

    if (bridge !== null) {
      bridge.emit('shutdown');
    }

    scheduleRetry();
  }

  function handleFailed() {
    if (__DEBUG__) {
      backend_debug('WebSocket.onerror');
    }

    scheduleRetry();
  }

  function handleMessage(event) {
    var data;

    try {
      if (typeof event.data === 'string') {
        data = JSON.parse(event.data);

        if (__DEBUG__) {
          backend_debug('WebSocket.onmessage', data);
        }
      } else {
        throw Error();
      }
    } catch (e) {
      console.error('[React DevTools] Failed to parse JSON: ' + event.data);
      return;
    }

    messageListeners.forEach(function (fn) {
      try {
        fn(data);
      } catch (error) {
        // jsc doesn't play so well with tracebacks that go into eval'd code,
        // so the stack trace here will stop at the `eval()` call. Getting the
        // message that caused the error is the best we can do for now.
        console.log('[React DevTools] Error calling listener', data);
        console.log('error:', error);
        throw error;
      }
    });
  }
}
function connectWithCustomMessagingProtocol(_ref2) {
  var onSubscribe = _ref2.onSubscribe,
      onUnsubscribe = _ref2.onUnsubscribe,
      onMessage = _ref2.onMessage,
      nativeStyleEditorValidAttributes = _ref2.nativeStyleEditorValidAttributes,
      resolveRNStyle = _ref2.resolveRNStyle,
      onSettingsUpdated = _ref2.onSettingsUpdated,
      _ref2$isReloadAndProf = _ref2.isReloadAndProfileSupported,
      isReloadAndProfileSupported = _ref2$isReloadAndProf === void 0 ? getIsReloadAndProfileSupported() : _ref2$isReloadAndProf,
      isProfiling = _ref2.isProfiling,
      onReloadAndProfile = _ref2.onReloadAndProfile,
      onReloadAndProfileFlagsReset = _ref2.onReloadAndProfileFlagsReset;
  var hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (hook == null) {
    // DevTools didn't get injected into this page (maybe b'c of the contentType).
    return;
  }

  var wall = {
    listen: function listen(fn) {
      onSubscribe(fn);
      return function () {
        onUnsubscribe(fn);
      };
    },
    send: function send(event, payload) {
      onMessage(event, payload);
    }
  };
  var bridge = new src_bridge(wall);
  bridge.addListener('updateComponentFilters', function (componentFilters) {
    // Save filter changes in memory, in case DevTools is reloaded.
    // In that case, the renderer will already be using the updated values.
    // We'll lose these in between backend reloads but that can't be helped.
    savedComponentFilters = componentFilters;
  });

  if (window.__REACT_DEVTOOLS_COMPONENT_FILTERS__ == null) {
    bridge.send('overrideComponentFilters', savedComponentFilters);
  }

  var agent = new Agent(bridge, isProfiling, onReloadAndProfile);

  if (typeof onReloadAndProfileFlagsReset === 'function') {
    onReloadAndProfileFlagsReset();
  }

  if (onSettingsUpdated != null) {
    agent.addListener('updateHookSettings', onSettingsUpdated);
  }

  agent.addListener('shutdown', function () {
    if (onSettingsUpdated != null) {
      agent.removeListener('updateHookSettings', onSettingsUpdated);
    } // If we received 'shutdown' from `agent`, we assume the `bridge` is already shutting down,
    // and that caused the 'shutdown' event on the `agent`, so we don't need to call `bridge.shutdown()` here.


    hook.emit('shutdown');
  });
  var unsubscribeBackend = initBackend(hook, agent, window, isReloadAndProfileSupported);
  var nativeStyleResolver = resolveRNStyle || hook.resolveRNStyle;

  if (nativeStyleResolver != null) {
    var validAttributes = nativeStyleEditorValidAttributes || hook.nativeStyleEditorValidAttributes || null;
    setupNativeStyleEditor(bridge, agent, nativeStyleResolver, validAttributes);
  }

  return unsubscribeBackend;
}
})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=backend.js.map