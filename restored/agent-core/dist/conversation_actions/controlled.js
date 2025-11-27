var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};
class ControlledConversationActionManager {
  get signal() {
    return this.abortController.signal;
  }
  constructor() {
    this.abortCallbacks = [];
    this.abortController = new AbortController();
    this.unprocessedUserMessages = [];
    this.clientStream = (0, dist /* createWritableIterable */.Jt)();
  }
  addAbortCallback(callback) {
    this.abortCallbacks.push(callback);
  }
  abort() {
    return __awaiter(this, void 0, void 0, function* () {
      this.abortController.abort();
      for (const callback of this.abortCallbacks) {
        callback();
      }
      this.abortCallbacks.length = 0;
      this.submitConversationAction(new agent_pb /* ConversationAction */.QF({
        action: {
          case: "cancelAction",
          value: new agent_pb /* CancelAction */.TT({})
        }
      }));
    });
  }
  // Adds tracking if the action is a user message with message_id
  submitConversationAction(conversationAction) {
    return __awaiter(this, void 0, void 0, function* () {
      // Track user messages for potential resubmission
      if (conversationAction.action.case === "userMessageAction") {
        const userMessage = conversationAction.action.value.userMessage;
        if (userMessage) {
          this.unprocessedUserMessages.push(userMessage);
        }
      }
      yield this.clientStream.write(conversationAction);
    });
  }
  /**
   * Mark a user message as processed (acknowledged by backend).
   * Can be overridden by subclasses to add additional behavior.
   */
  markMessageAsProcessed(userMessage) {
    this.unprocessedUserMessages = this.unprocessedUserMessages.filter(msg => msg.messageId !== userMessage.messageId);
  }
  /**
   * Get all unprocessed user messages
   */
  getUnprocessedUserMessages() {
    return [...this.unprocessedUserMessages];
  }
  /**
   * Check if there are any unprocessed user messages
   */
  hasUnprocessedMessages() {
    return this.unprocessedUserMessages.length > 0;
  }
  close() {
    var _a;
    (_a = this.clientStream) === null || _a === void 0 ? void 0 : _a.close();
  }
  resetStream() {
    var _a;
    (_a = this.clientStream) === null || _a === void 0 ? void 0 : _a.close();
    this.clientStream = (0, dist /* createWritableIterable */.Jt)();
    this.abortController = new AbortController();
    for (const userMessage of this.unprocessedUserMessages) {
      void this.clientStream.write(new agent_pb /* ConversationAction */.QF({
        action: {
          case: "userMessageAction",
          value: new agent_pb /* UserMessageAction */.Vt({
            userMessage: userMessage
          })
        }
      }));
    }
  }
  run(outputStream) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_1, _b, _c;
      try {
        for (var _d = true, _e = __asyncValues(this.clientStream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const action = _c;
          try {
            yield outputStream.write(action);
          } catch (error) {
            console.error("error", error);
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
  dispose() {}
}