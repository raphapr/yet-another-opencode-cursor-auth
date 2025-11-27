/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */E: () => (/* binding */SlashCommandProvider),
  /* harmony export */x: () => (/* binding */useSlashCommandRegistry)
  /* harmony export */
});
/* harmony import */
var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
const SlashCommandContext = (0, react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);
const SlashCommandProvider = ({
  children
}) => {
  const [dynamicCommands, setDynamicCommands] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  const registerCommand = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(command => {
    setDynamicCommands(prev => {
      const filtered = prev.filter(cmd => cmd.id !== command.id);
      return [...filtered, command];
    });
  }, []);
  const unregisterCommand = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(commandId => {
    setDynamicCommands(prev => prev.filter(cmd => cmd.id !== commandId));
  }, []);
  return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SlashCommandContext.Provider, {
    value: {
      dynamicCommands,
      registerCommand,
      unregisterCommand
    },
    children: children
  });
};
const useSlashCommandRegistry = () => {
  const context = (0, react__WEBPACK_IMPORTED_MODULE_1__.useContext)(SlashCommandContext);
  if (!context) {
    throw new Error("useSlashCommandRegistry must be used within SlashCommandProvider");
  }
  return context;
};

/***/