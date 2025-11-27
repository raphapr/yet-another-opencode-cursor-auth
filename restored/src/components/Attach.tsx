__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export Attach */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _background_composer_conversation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/components/background-composer-conversation.tsx");
    /* harmony import */
    var _background_composer_selection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/background-composer-selection.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_background_composer_conversation_js__WEBPACK_IMPORTED_MODULE_2__, _background_composer_selection_js__WEBPACK_IMPORTED_MODULE_3__]);
    [_background_composer_conversation_js__WEBPACK_IMPORTED_MODULE_2__, _background_composer_selection_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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
    const Attach = ({
      client
    }) => {
      const [status, setStatus] = useState("loading");
      const [composers, setComposers] = useState([]);
      const [error, setError] = useState();
      const [selectedComposerId, setSelectedComposerId] = useState();
      // Load composers on mount
      useEffect(() => {
        const loadComposers = () => __awaiter(void 0, void 0, void 0, function* () {
          try {
            const response = yield client.listBackgroundComposers({
              n: 10,
              includeStatus: true
            });
            setComposers(response.composers);
            setStatus("success");
          } catch (err) {
            setError(`Failed to load composers: ${err}`);
            setStatus("error");
          }
        });
        loadComposers();
      }, [client]);
      const handleSelect = composerId => {
        setSelectedComposerId(composerId);
      };
      // If a composer is selected, show the conversation
      if (selectedComposerId) {
        return _jsx(BackgroundComposerConversation, {
          client: client,
          composerId: selectedComposerId
        });
      }
      return _jsx(BackgroundComposerSelection, {
        status: status,
        composers: composers,
        error: error,
        selectedComposerId: selectedComposerId,
        onSelect: handleSelect
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/