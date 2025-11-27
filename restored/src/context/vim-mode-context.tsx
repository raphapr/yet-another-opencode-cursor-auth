/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */l: () => (/* binding */VimModeProvider),
  /* harmony export */v: () => (/* binding */useVimMode)
  /* harmony export */
});
/* harmony import */
var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
const VimModeContext = (0, react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
const VimModeProvider = ({
  children,
  configProvider
}) => {
  const [mode, setMode] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)("insert");
  const [vimEnabled, setVimEnabled] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(configProvider.get().editor.vimMode);
  const toggleMode = () => {
    setMode(current => current === "normal" ? "insert" : "normal");
  };
  const toggleVimEnabled = () => {
    setVimEnabled(prev => {
      const next = !prev;
      try {
        configProvider.transform(config => Object.assign(Object.assign({}, config), {
          editor: Object.assign(Object.assign({}, config.editor), {
            vimMode: next
          })
        })).catch(() => {
          // ignore
        });
      } catch (_a) {
        /* ignore */
      }
      if (!next) {
        // Reset to insert mode when disabling vim to avoid stuck normal mode
        setMode("insert");
      }
      return next;
    });
  };
  return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(VimModeContext.Provider, {
    value: {
      mode,
      setMode,
      toggleMode,
      vimEnabled,
      toggleVimEnabled
    },
    children: children
  });
};
const useVimMode = () => {
  const context = (0, react__WEBPACK_IMPORTED_MODULE_1__.useContext)(VimModeContext);
  if (context === undefined) {
    throw new Error("useVimMode must be used within a VimModeProvider");
  }
  return context;
};

/***/