__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export BackgroundComposerConversation */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../proto/dist/generated/aiserver/v1/background_composer_pb.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_chat_pb_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../proto/dist/generated/aiserver/v1/chat_pb.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _message_input_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/message-input.tsx");
    /* harmony import */
    var _user_message_ui_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/components/user-message-ui.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _message_input_js__WEBPACK_IMPORTED_MODULE_5__, _user_message_ui_js__WEBPACK_IMPORTED_MODULE_6__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _message_input_js__WEBPACK_IMPORTED_MODULE_5__, _user_message_ui_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    const BackgroundComposerConversation = ({
      client,
      composerId
    }) => {
      const [conversation, setConversation] = useState([]);
      const [currentMessage, setCurrentMessage] = useState(null);
      const [messages, setMessages] = useState([]);
      const [lastProcessedIndex, setLastProcessedIndex] = useState(-1);
      const [isAttaching, setIsAttached] = useState(true);
      const [error, setError] = useState();
      const [inputValue, setInputValue] = useState("");
      const [isSendingMessage, setIsSendingMessage] = useState(false);
      // Attach to the composer when component mounts
      useEffect(() => {
        const abortController = new AbortController();
        const attachToComposer = () => __awaiter(void 0, void 0, void 0, function* () {
          var _a, e_1, _b, _c;
          try {
            const attachRequest = new AttachBackgroundComposerRequest({
              bcId: composerId
            });
            const attachResponse = client.attachBackgroundComposer(attachRequest, {
              signal: abortController.signal
            });
            try {
              // Handle the streaming response
              for (var _d = true, attachResponse_1 = __asyncValues(attachResponse), attachResponse_1_1; attachResponse_1_1 = yield attachResponse_1.next(), _a = attachResponse_1_1.done, !_a; _d = true) {
                _c = attachResponse_1_1.value;
                _d = false;
                const message = _c;
                setMessages(prev => [...prev, message]);
              }
            } catch (e_1_1) {
              e_1 = {
                error: e_1_1
              };
            } finally {
              try {
                if (!_d && !_a && (_b = attachResponse_1.return)) yield _b.call(attachResponse_1);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
            setIsAttached(false);
          } catch (attachError) {
            setError(`Failed to attach: ${attachError}`);
            setIsAttached(false);
          }
        });
        attachToComposer();
        return () => {
          abortController.abort();
        };
      }, [client, composerId]);
      const processHeadlessResponse = useCallback(response => {
        setCurrentMessage(prevMessage => {
          // Start a new message if we don't have one
          let workingMessage = prevMessage;
          if (!workingMessage) {
            workingMessage = {
              id: `msg-current`,
              steps: []
            };
          }
          // Process different types of responses
          if (response.text) {
            const lastStep = workingMessage.steps[workingMessage.steps.length - 1];
            if (lastStep && lastStep.type === "text") {
              // Append to existing text step
              lastStep.content += response.text;
              workingMessage = Object.assign(Object.assign({}, workingMessage), {
                steps: [...workingMessage.steps.slice(0, -1), lastStep]
              });
            } else {
              // Create new text step
              workingMessage = Object.assign(Object.assign({}, workingMessage), {
                steps: [...workingMessage.steps, {
                  type: "text",
                  content: response.text
                }]
              });
            }
          }
          if (response.toolCall) {
            workingMessage = Object.assign(Object.assign({}, workingMessage), {
              steps: [...workingMessage.steps, {
                type: "tool-call",
                id: response.toolCall.toolCallId,
                call: response.toolCall,
                completed: false
              }]
            });
          }
          if (response.finalToolResult) {
            const updatedSteps = workingMessage.steps.map(step => {
              if (step.type === "tool-call" && step.id === response.finalToolResult.toolCallId) {
                return Object.assign(Object.assign({}, step), {
                  result: response.finalToolResult.result,
                  completed: true
                });
              }
              return step;
            });
            workingMessage = Object.assign(Object.assign({}, workingMessage), {
              steps: updatedSteps
            });
          }
          if (response.thinking) {
            workingMessage = Object.assign(Object.assign({}, workingMessage), {
              steps: [...workingMessage.steps, {
                type: "thinking",
                content: response.thinking.text || ""
              }]
            });
          }
          if (response.thinkingDurationMs && response.thinkingDurationMs > 0) {
            const lastStep = workingMessage.steps[workingMessage.steps.length - 1];
            if (lastStep && lastStep.type === "thinking") {
              lastStep.durationMs = response.thinkingDurationMs;
              workingMessage = Object.assign(Object.assign({}, workingMessage), {
                steps: [...workingMessage.steps.slice(0, -1), lastStep]
              });
            }
          }
          if (response.humanMessage) {
            workingMessage = Object.assign(Object.assign({}, workingMessage), {
              steps: [...workingMessage.steps, {
                type: "user",
                content: response.humanMessage.text || "",
                richContent: response.humanMessage.richText
              }]
            });
          }
          if (response.status) {
            workingMessage = Object.assign(Object.assign({}, workingMessage), {
              steps: [...workingMessage.steps, {
                type: "status",
                message: response.status.message,
                statusType: response.status.type.toString(),
                isComplete: response.status.isComplete
              }]
            });
          }
          if (response.error) {
            workingMessage = Object.assign(Object.assign({}, workingMessage), {
              steps: [...workingMessage.steps, {
                type: "error",
                message: response.error.message
              }]
            });
          }
          return workingMessage;
        });
        // If message is done, add it to conversation and reset current message
        if (response.isMessageDone) {
          setCurrentMessage(msg => {
            if (msg) {
              setConversation(prev => [...prev, msg]);
            }
            return null;
          });
        }
      }, []);
      // Process incoming messages whenever they change
      useEffect(() => {
        // Only process one new message at a time to avoid state racing
        if (lastProcessedIndex + 1 < messages.length) {
          const message = messages[lastProcessedIndex + 1];
          const response = message.headlessAgenticComposerResponse;
          if (response) {
            processHeadlessResponse(response);
          }
          setLastProcessedIndex(lastProcessedIndex + 1);
        }
      }, [messages, lastProcessedIndex, processHeadlessResponse]);
      const _updateCurrentMessage = updater => {
        setCurrentMessage(prev => prev ? updater(prev) : null);
      };
      const renderToolCall = step => {
        const _tool = step.call.tool;
        const _params = step.call.params;
        const _result = step.result;
        return null;
      };
      const renderStep = (step, index) => {
        switch (step.type) {
          case "text":
            return _jsx(Box, {
              borderStyle: "single",
              borderColor: "gray",
              borderLeft: true,
              borderRight: false,
              borderTop: false,
              borderBottom: false,
              paddingLeft: 1,
              marginBottom: 1,
              children: _jsx(Text, {
                children: step.content
              })
            }, index);
          case "tool-call":
            return renderToolCall(step);
          case "thinking":
            return null;
          case "user":
            return _jsx(UserMessageUI, {
              content: step.content
            }, index);
          case "status":
            return _jsx(Box, {
              paddingLeft: 1,
              children: _jsxs(Text, {
                color: "blue",
                children: [step.message, step.isComplete && " ✓"]
              })
            }, index);
          case "error":
            return _jsx(Box, {
              paddingLeft: 1,
              children: _jsxs(Text, {
                color: "red",
                children: ["\u274C Error: ", step.message]
              })
            }, index);
          default:
            return null;
        }
      };
      const renderMessage = (message, index) => {
        return _jsx(Box, {
          flexDirection: "column",
          children: message.steps.map((step, stepIndex) => renderStep(step, stepIndex))
        }, index);
      };
      const renderToolCallSummary = toolCallCount => {
        if (toolCallCount === 0) return null;
        return _jsx(Box, {
          paddingLeft: 1,
          marginY: 1,
          children: _jsxs(Text, {
            color: "gray",
            dimColor: true,
            children: ["Called ", toolCallCount, " tool", toolCallCount === 1 ? "" : "s"]
          })
        });
      };
      const handleInputSubmit = value => __awaiter(void 0, void 0, void 0, function* () {
        if (value.trim() && !isSendingMessage) {
          setIsSendingMessage(true);
          setError(undefined);
          try {
            // Create a conversation message for the follow-up
            const followupMessage = new ConversationMessage({
              text: value.trim()
            });
            // Send synchronous follow-up
            const followupRequest = new AddAsyncFollowupBackgroundComposerRequest({
              bcId: composerId,
              followupMessage,
              synchronous: true,
              followupSource: BackgroundComposerSource.EDITOR
            });
            yield client.addAsyncFollowupBackgroundComposer(followupRequest);
            setInputValue("");
          } catch (followupError) {
            setError(`Failed to send message: ${followupError}`);
          } finally {
            setIsSendingMessage(false);
          }
        }
      });
      if (error) {
        return _jsx(Box, {
          paddingLeft: 1,
          children: _jsxs(Text, {
            color: "red",
            children: ["\u274C ", error]
          })
        });
      }
      if (isAttaching && messages.length === 0) {
        return _jsx(Box, {
          paddingLeft: 1,
          children: _jsx(Text, {
            color: "yellow",
            children: "\uD83D\uDD04 Attaching to composer..."
          })
        });
      }
      return _jsxs(Box, {
        flexDirection: "column",
        paddingY: 1,
        children: [conversation.map((message, index) => {
          const hasTextResponse = message.steps.some(step => step.type === "text");
          // Count tool calls since last user message
          let toolCallCount = 0;
          for (let i = index; i >= 0; i--) {
            const msg = conversation[i];
            const hasUserMessage = msg.steps.some(step => step.type === "user");
            if (hasUserMessage && i < index) break; // Stop at previous user message
            toolCallCount += msg.steps.filter(step => step.type === "tool-call" || step.type === "thinking").length;
          }
          return _jsxs(React.Fragment, {
            children: [hasTextResponse && toolCallCount > 0 && renderToolCallSummary(toolCallCount), renderMessage(message, index)]
          }, message.id);
        }), currentMessage && _jsxs(_Fragment, {
          children: [(() => {
            const hasTextResponse = currentMessage.steps.some(step => step.type === "text");
            // Count tool calls since last user message (including current message)
            let toolCallCount = 0;
            // Count from current message
            toolCallCount += currentMessage.steps.filter(step => step.type === "tool-call" || step.type === "thinking").length;
            // Count from conversation messages back to last user message
            for (let i = conversation.length - 1; i >= 0; i--) {
              const msg = conversation[i];
              const hasUserMessage = msg.steps.some(step => step.type === "user");
              if (hasUserMessage) break; // Stop at last user message
              toolCallCount += msg.steps.filter(step => step.type === "tool-call" || step.type === "thinking").length;
            }
            return hasTextResponse && toolCallCount > 0 ? renderToolCallSummary(toolCallCount) : null;
          })(), renderMessage(currentMessage, conversation.length)]
        }), messages.length === 0 && _jsx(Box, {
          paddingLeft: 1,
          children: _jsx(Text, {
            color: "gray",
            children: "No messages yet..."
          })
        }), _jsx(MessageInput, {
          value: inputValue,
          onChange: setInputValue,
          onSubmit: handleInputSubmit,
          isDisabled: !!error || isSendingMessage
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/