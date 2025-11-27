var model_manager_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class ModelManager {
  constructor() {
    this.availableModels = [];
    this.aliasMap = new Map();
    this.listeners = new Set();
    // Model will be set asynchronously
  }
  static init(aiServerClient, options) {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      const manager = new ModelManager();
      manager.models = manager.initializeModels(aiServerClient, options);
      // If user explicitly provided a model, block until it's initialized, since we want to throw if invalid name.
      if (options.initialModel) {
        yield manager.models;
      }
      return manager;
    });
  }
  initializeModels(aiServerClient, options) {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      const {
        availableModels,
        defaultModel
      } = yield fetchModelData(aiServerClient);
      if (availableModels) {
        this.availableModels = availableModels;
        this.buildAliasMap(availableModels);
      }
      const selectedModel = yield this.selectModel({
        options,
        defaultModel,
        availableModels: this.availableModels
      });
      if (!selectedModel) {
        throw new Error("No model found. Please check your model settings.");
      }
      this.currentModel = selectedModel;
      this.notifyListeners();
      return selectedModel;
    });
  }
  selectModel(params) {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      var _a;
      const {
        options,
        defaultModel,
        availableModels
      } = params;
      const config = options.configProvider.get();
      if (options.initialModel) {
        return this.handleInitialModel(options.initialModel, options.configProvider);
      }
      if (!defaultModel) {
        return config.model;
      }
      // User has never changed the default or their model matches default, jic some info has changed
      if (!config.hasChangedDefaultModel || ((_a = config.model) === null || _a === void 0 ? void 0 : _a.modelId) === defaultModel.modelId) {
        yield this.updateConfig(options.configProvider, defaultModel, false);
        return defaultModel;
      }
      const isCurrentModelValid = availableModels.some(m => {
        var _a;
        return m.modelId === ((_a = config.model) === null || _a === void 0 ? void 0 : _a.modelId);
      });
      if (isCurrentModelValid) {
        return config.model;
      }
      // User's previous choice is no longer valid, fall back to default
      yield this.updateConfig(options.configProvider, defaultModel, false);
      return defaultModel;
    });
  }
  handleInitialModel(initialModel, configProvider) {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      const userModel = this.normalizeModelId(initialModel);
      if (!userModel) {
        (0, console_io /* exitWithMessage */.uQ)(1, `Cannot use this model: ${initialModel}. Available models: ${this.availableModels.map(m => m.displayModelId).join(", ")}`);
      }
      yield this.updateConfig(configProvider, userModel, true);
      return userModel;
    });
  }
  updateConfig(configProvider, model, hasChangedDefaultModel) {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      yield configProvider.transform(cfg => Object.assign(Object.assign({}, cfg), {
        model,
        hasChangedDefaultModel
      }));
    });
  }
  setCurrentModel(model, configProvider) {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      yield this.awaitCurrentModel();
      if (!this.availableModels.some(m => m.modelId === model.modelId)) {
        return;
      }
      yield configProvider.transform(config => Object.assign(Object.assign({}, config), {
        model,
        hasChangedDefaultModel: true
      }));
      this.currentModel = model;
      this.notifyListeners();
    });
  }
  getCurrentModel() {
    return this.currentModel;
  }
  awaitCurrentModel() {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      if (this.models) {
        yield this.models;
      }
      if (!this.currentModel) {
        throw new Error("We had an issue initializing the model. Please try again.");
      }
      return this.currentModel;
    });
  }
  getAvailableModels() {
    return [...this.availableModels];
  }
  awaitAvailableModels() {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      yield this.awaitCurrentModel();
      return [...this.availableModels];
    });
  }
  normalizeModelId(raw) {
    return this.aliasMap.get(raw.toLowerCase());
  }
  // Simple setter for testing/UI
  setCurrentModelWithoutPersistence(model) {
    this.currentModel = model;
    this.notifyListeners();
  }
  // Set model from a stored model ID (e.g., when resuming)
  setModelFromStoredId(modelId, configProvider) {
    return model_manager_awaiter(this, void 0, void 0, function* () {
      if (!modelId || typeof modelId !== "string") {
        (0, debug.debugLog)("No stored model ID to restore");
        return false;
      }
      const availableModels = yield this.awaitAvailableModels();
      const matchingModel = availableModels.find(m => m.modelId === modelId);
      if (matchingModel) {
        yield this.setCurrentModel(matchingModel, configProvider);
        return true;
      }
      (0, debug.debugLog)(`Could not find model with ID: ${modelId} in available models`);
      return false;
    });
  }
  buildAliasMap(models) {
    var _a;
    const modelMap = new Map();
    for (const model of models) {
      if (!model.modelId) continue;
      modelMap.set(model.modelId.toLowerCase(), model);
      modelMap.set(model.displayModelId.toLowerCase(), model);
      for (const alias of (_a = model.aliases) !== null && _a !== void 0 ? _a : []) {
        modelMap.set(alias.toLowerCase(), model);
      }
    }
    this.aliasMap = modelMap;
  }
  // Listeners
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.currentModel);
    return () => {
      this.listeners.delete(listener);
    };
  }
  notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.currentModel);
    }
  }
  static createForTesting() {
    const manager = new ModelManager();
    manager.models = Promise.resolve(undefined);
    return manager;
  }
}