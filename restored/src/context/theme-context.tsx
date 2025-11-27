__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */NP: () => (/* binding */ThemeProvider),
      /* harmony export */cb: () => (/* binding */useSyncTheme),
      /* harmony export */pW: () => (/* binding */useIsLightTheme)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _hooks_use_theme_detection_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/hooks/use-theme-detection.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_hooks_use_theme_detection_js__WEBPACK_IMPORTED_MODULE_2__]);
    _hooks_use_theme_detection_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
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
    const ThemeContext = (0, react__WEBPACK_IMPORTED_MODULE_1__.createContext)({
      isLightTheme: false,
      syncTheme: () => __awaiter(void 0, void 0, void 0, function* () {})
    });
    const ThemeProvider = ({
      children,
      detection
    }) => {
      const {
        isLightTheme,
        sync
      } = (0, _hooks_use_theme_detection_js__WEBPACK_IMPORTED_MODULE_2__ /* .useThemeDetection */.A)(Object.assign({}, detection));
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ThemeContext.Provider, {
        value: {
          isLightTheme: isLightTheme !== null && isLightTheme !== void 0 ? isLightTheme : false,
          syncTheme: sync
        },
        children: children
      });
    };
    const useIsLightTheme = () => {
      const {
        isLightTheme
      } = (0, react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);
      return isLightTheme;
    };
    const useSyncTheme = () => {
      const {
        syncTheme
      } = (0, react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);
      return syncTheme;
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/