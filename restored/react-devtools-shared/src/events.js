function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _defineProperty(obj, key, value) {
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
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
    _defineProperty(this, "listenersMap", new Map());
  }
  return _createClass(EventEmitter, [{
    key: "addListener",
    value: function addListener(event, listener) {
      var listeners = this.listenersMap.get(event);
      if (listeners === undefined) {
        this.listenersMap.set(event, [listener]);
      } else {
        var index = listeners.indexOf(listener);
        if (index < 0) {
          listeners.push(listener);
        }
      }
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var listeners = this.listenersMap.get(event);
      if (listeners !== undefined) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        if (listeners.length === 1) {
          // No need to clone or try/catch
          var listener = listeners[0];
          listener.apply(null, args);
        } else {
          var didThrow = false;
          var caughtError = null;
          var clonedListeners = Array.from(listeners);
          for (var i = 0; i < clonedListeners.length; i++) {
            var _listener = clonedListeners[i];
            try {
              _listener.apply(null, args);
            } catch (error) {
              if (caughtError === null) {
                didThrow = true;
                caughtError = error;
              }
            }
          }
          if (didThrow) {
            throw caughtError;
          }
        }
      }
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners() {
      this.listenersMap.clear();
    }
  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      var listeners = this.listenersMap.get(event);
      if (listeners !== undefined) {
        var index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      }
    }
  }]);
}();