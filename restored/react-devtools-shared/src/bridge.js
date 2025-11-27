function bridge_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    bridge_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    bridge_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return bridge_typeof(obj);
}
function bridge_toConsumableArray(arr) {
  return bridge_arrayWithoutHoles(arr) || bridge_iterableToArray(arr) || bridge_unsupportedIterableToArray(arr) || bridge_nonIterableSpread();
}
function bridge_nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function bridge_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return bridge_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return bridge_arrayLikeToArray(o, minLen);
}
function bridge_iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function bridge_arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return bridge_arrayLikeToArray(arr);
}
function bridge_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function bridge_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function bridge_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function bridge_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) bridge_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) bridge_defineProperties(Constructor, staticProps);
  return Constructor;
}
function _callSuper(_this, derived, args) {
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
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, isNativeReflectConstruct() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
function _possibleConstructorReturn(self, call) {
  if (call && (bridge_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
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
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function bridge_defineProperty(obj, key, value) {
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
// This message specifies the version of the DevTools protocol currently supported by the backend,
// as well as the earliest NPM version (e.g. "4.13.0") that protocol is supported by on the frontend.
// This enables an older frontend to display an upgrade message to users for a newer, unsupported backend.

// Bump protocol version whenever a backwards breaking change is made
// in the messages sent between BackendBridge and FrontendBridge.
// This mapping is embedded in both frontend and backend builds.
//
// The backend protocol will always be the latest entry in the BRIDGE_PROTOCOL array.
//
// When an older frontend connects to a newer backend,
// the backend can send the minNpmVersion and the frontend can display an NPM upgrade prompt.
//
// When a newer frontend connects with an older protocol version,
// the frontend can use the embedded minNpmVersion/maxNpmVersion values to display a downgrade prompt.
var BRIDGE_PROTOCOL = [
// This version technically never existed,
// but a backwards breaking change was added in 4.11,
// so the safest guess to downgrade the frontend would be to version 4.10.
{
  version: 0,
  minNpmVersion: '"<4.11.0"',
  maxNpmVersion: '"<4.11.0"'
},
// Versions 4.11.x – 4.12.x contained the backwards breaking change,
// but we didn't add the "fix" of checking the protocol version until 4.13,
// so we don't recommend downgrading to 4.11 or 4.12.
{
  version: 1,
  minNpmVersion: '4.13.0',
  maxNpmVersion: '4.21.0'
},
// Version 2 adds a StrictMode-enabled and supports-StrictMode bits to add-root operation.
{
  version: 2,
  minNpmVersion: '4.22.0',
  maxNpmVersion: null
}];
var currentBridgeProtocol = BRIDGE_PROTOCOL[BRIDGE_PROTOCOL.length - 1];
var Bridge = /*#__PURE__*/function (_EventEmitter) {
  function Bridge(wall) {
    var _this2;
    bridge_classCallCheck(this, Bridge);
    _this2 = _callSuper(this, Bridge);
    bridge_defineProperty(_this2, "_isShutdown", false);
    bridge_defineProperty(_this2, "_messageQueue", []);
    bridge_defineProperty(_this2, "_scheduledFlush", false);
    bridge_defineProperty(_this2, "_wallUnlisten", null);
    bridge_defineProperty(_this2, "_flush", function () {
      // This method is used after the bridge is marked as destroyed in shutdown sequence,
      // so we do not bail out if the bridge marked as destroyed.
      // It is a private method that the bridge ensures is only called at the right times.
      try {
        if (_this2._messageQueue.length) {
          for (var i = 0; i < _this2._messageQueue.length; i += 2) {
            var _this2$_wall;
            (_this2$_wall = _this2._wall).send.apply(_this2$_wall, [_this2._messageQueue[i]].concat(bridge_toConsumableArray(_this2._messageQueue[i + 1])));
          }
          _this2._messageQueue.length = 0;
        }
      } finally {
        // We set this at the end in case new messages are added synchronously above.
        // They're already handled so they shouldn't queue more flushes.
        _this2._scheduledFlush = false;
      }
    });
    bridge_defineProperty(_this2, "overrideValueAtPath", function (_ref) {
      var id = _ref.id,
        path = _ref.path,
        rendererID = _ref.rendererID,
        type = _ref.type,
        value = _ref.value;
      switch (type) {
        case 'context':
          _this2.send('overrideContext', {
            id: id,
            path: path,
            rendererID: rendererID,
            wasForwarded: true,
            value: value
          });
          break;
        case 'hooks':
          _this2.send('overrideHookState', {
            id: id,
            path: path,
            rendererID: rendererID,
            wasForwarded: true,
            value: value
          });
          break;
        case 'props':
          _this2.send('overrideProps', {
            id: id,
            path: path,
            rendererID: rendererID,
            wasForwarded: true,
            value: value
          });
          break;
        case 'state':
          _this2.send('overrideState', {
            id: id,
            path: path,
            rendererID: rendererID,
            wasForwarded: true,
            value: value
          });
          break;
      }
    });
    _this2._wall = wall;
    _this2._wallUnlisten = wall.listen(function (message) {
      if (message && message.event) {
        _this2.emit(message.event, message.payload);
      }
    }) || null; // Temporarily support older standalone front-ends sending commands to newer embedded backends.
    // We do this because React Native embeds the React DevTools backend,
    // but cannot control which version of the frontend users use.

    _this2.addListener('overrideValueAtPath', _this2.overrideValueAtPath);
    return _this2;
  } // Listening directly to the wall isn't advised.
  // It can be used to listen for legacy (v3) messages (since they use a different format).

  _inherits(Bridge, _EventEmitter);
  return bridge_createClass(Bridge, [{
    key: "wall",
    get: function get() {
      return this._wall;
    }
  }, {
    key: "send",
    value: function send(event) {
      if (this._isShutdown) {
        console.warn("Cannot send message \"".concat(event, "\" through a Bridge that has been shutdown."));
        return;
      } // When we receive a message:
      // - we add it to our queue of messages to be sent
      // - if there hasn't been a message recently, we set a timer for 0 ms in
      //   the future, allowing all messages created in the same tick to be sent
      //   together
      // - if there *has* been a message flushed in the last BATCH_DURATION ms
      //   (or we're waiting for our setTimeout-0 to fire), then _timeoutID will
      //   be set, and we'll simply add to the queue and wait for that

      for (var _len = arguments.length, payload = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        payload[_key - 1] = arguments[_key];
      }
      this._messageQueue.push(event, payload);
      if (!this._scheduledFlush) {
        this._scheduledFlush = true; // $FlowFixMe

        if (typeof devtoolsJestTestScheduler === 'function') {
          // This exists just for our own jest tests.
          // They're written in such a way that we can neither mock queueMicrotask
          // because then we break React DOM and we can't not mock it because then
          // we can't synchronously flush it. So they need to be rewritten.
          // $FlowFixMe
          devtoolsJestTestScheduler(this._flush); // eslint-disable-line no-undef
        } else {
          queueMicrotask(this._flush);
        }
      }
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      if (this._isShutdown) {
        console.warn('Bridge was already shutdown.');
        return;
      } // Queue the shutdown outgoing message for subscribers.

      this.emit('shutdown');
      this.send('shutdown'); // Mark this bridge as destroyed, i.e. disable its public API.

      this._isShutdown = true; // Disable the API inherited from EventEmitter that can add more listeners and send more messages.
      // $FlowFixMe[cannot-write] This property is not writable.

      this.addListener = function () {}; // $FlowFixMe[cannot-write] This property is not writable.

      this.emit = function () {}; // NOTE: There's also EventEmitter API like `on` and `prependListener` that we didn't add to our Flow type of EventEmitter.
      // Unsubscribe this bridge incoming message listeners to be sure, and so they don't have to do that.

      this.removeAllListeners(); // Stop accepting and emitting incoming messages from the wall.

      var wallUnlisten = this._wallUnlisten;
      if (wallUnlisten) {
        wallUnlisten();
      } // Synchronously flush all queued outgoing messages.
      // At this step the subscribers' code may run in this call stack.

      do {
        this._flush();
      } while (this._messageQueue.length);
    } // Temporarily support older standalone backends by forwarding "overrideValueAtPath" commands
    // to the older message types they may be listening to.
  }]);
}(EventEmitter);

/* harmony default export */
const src_bridge = Bridge;