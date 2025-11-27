/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */x: () => (/* binding */handleToggleLineNumbers)
  /* harmony export */
});
/* unused harmony export handleSetLineNumbers */
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
function handleSetLineNumbers(configProvider, showLineNumbers) {
  return __awaiter(this, void 0, void 0, function* () {
    yield configProvider.transform(config => Object.assign(Object.assign({}, config), {
      display: Object.assign(Object.assign({}, config.display), {
        showLineNumbers
      })
    }));
  });
}
function handleToggleLineNumbers(configProvider) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b;
    const currentConfig = configProvider.get();
    const currentValue = (_b = (_a = currentConfig.display) === null || _a === void 0 ? void 0 : _a.showLineNumbers) !== null && _b !== void 0 ? _b : true;
    const newValue = !currentValue;
    yield handleSetLineNumbers(configProvider, newValue);
    return newValue;
  });
}

/***/