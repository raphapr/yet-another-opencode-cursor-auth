__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => (/* binding */useThemeDetection)
      /* harmony export */
    });
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _utils_terminal_theme_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/terminal-theme.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_0__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
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
    function useThemeDetection(options) {
      const ignoreEnvHint = (options === null || options === void 0 ? void 0 : options.ignoreEnvHint) === true;
      // Fast env-based hint to avoid probing when explicitly provided
      const envHint = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
        var _a, _b;
        if (ignoreEnvHint) return null;
        const tt = (_a = process.env.TERM_THEME) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const vs = (_b = process.env.VSCODE_THEME) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        const al = process.env.ANSI_LIGHT === "1";
        if (al) return true;
        if (tt === "light") return true;
        if (tt === "dark") return false;
        if (vs) {
          if (vs.includes("light")) return true;
          if (vs.includes("dark")) return false;
        }
        return null;
      }, [ignoreEnvHint]);
      const [isLightTheme, setIsLightTheme] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(envHint);
      const {
        stdin
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ /* .useStdin */.mT)();
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ /* .useStdout */.t$)();
      const isProbingRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
      const lastProbeAtRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0);
      const detectTheme = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((...args_1) => __awaiter(this, [...args_1], void 0, function* (forceIgnoreEnvHint = false) {
        if (isProbingRef.current) return;
        isProbingRef.current = true;
        try {
          const hint = forceIgnoreEnvHint ? null : envHint;
          if (hint != null) {
            setIsLightTheme(hint);
            return;
          }
          try {
            (0, _utils_terminal_theme_js__WEBPACK_IMPORTED_MODULE_2__ /* .resetTerminalThemeCache */.jf)();
          } catch (_a) {}
          const isSsh = (0, _utils_terminal_theme_js__WEBPACK_IMPORTED_MODULE_2__ /* .isLikelySshSession */.lf)();
          const isTmux = Boolean(process.env.TMUX);
          const timeout = isSsh || isTmux ? 300 : 100;
          const result = yield (0, _utils_terminal_theme_js__WEBPACK_IMPORTED_MODULE_2__ /* .detectTerminalIsLight */._J)(stdin, stdout, timeout);
          setIsLightTheme(result);
          lastProbeAtRef.current = Date.now();
        } catch (_b) {
          // Leave as null on error to indicate unknown
        } finally {
          isProbingRef.current = false;
        }
      }), [stdin, stdout, envHint]);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        let cancelled = false;
        (() => __awaiter(this, void 0, void 0, function* () {
          if (cancelled) return;
          yield detectTheme();
        }))();
        return () => {
          cancelled = true;
        };
      }, [detectTheme]);
      const sync = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        // When syncing explicitly, ignore env hints to force a real probe
        yield detectTheme(true);
      }), [detectTheme]);
      return {
        isLightTheme,
        sync
      };
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/