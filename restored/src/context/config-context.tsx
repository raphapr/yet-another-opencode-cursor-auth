/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */$i: () => (/* binding */useShowLineNumbers),
  /* harmony export */t1: () => (/* binding */ConfigContextProvider)
  /* harmony export */
});
/* unused harmony export useConfig */
/* harmony import */
var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
const ConfigContext = (0, react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
const ConfigContextProvider = ({
  children,
  configProvider
}) => {
  const config = configProvider.get();
  return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ConfigContext.Provider, {
    value: {
      config,
      configProvider
    },
    children: children
  });
};
const useConfig = () => {
  const context = (0, react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigContextProvider");
  }
  return context;
};
const useShowLineNumbers = () => {
  var _a, _b;
  const {
    config
  } = useConfig();
  return (_b = (_a = config.display) === null || _a === void 0 ? void 0 : _a.showLineNumbers) !== null && _b !== void 0 ? _b : true;
};

/***/