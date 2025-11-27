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
function fetchModelData(aiServerClient) {
  return __awaiter(this, void 0, void 0, function* () {
    const [modelsResult, defaultResult] = yield Promise.allSettled([fetchUsableModels(aiServerClient), fetchDefaultModel(aiServerClient)]);
    const result = {};
    if (modelsResult.status === "fulfilled" && modelsResult.value) {
      result.availableModels = modelsResult.value;
    } else if (modelsResult.status === "rejected") {
      (0, debug.debugLogJSON)("models.fetchUsableModels.error", (0, error_info /* extractErrorInfo */.q)(modelsResult.reason), "ERROR");
    }
    if (defaultResult.status === "fulfilled" && defaultResult.value) {
      result.defaultModel = defaultResult.value;
    } else if (defaultResult.status === "rejected") {
      (0, debug.debugLogJSON)("models.fetchDefaultModel.error", (0, error_info /* extractErrorInfo */.q)(defaultResult.reason), "ERROR");
    }
    return result;
  });
}
function fetchUsableModels(aiServerClient) {
  return __awaiter(this, void 0, void 0, function* () {
    const {
      models
    } = yield aiServerClient.getUsableModels(new agent_service_pb /* GetUsableModelsRequest */.KD({}));
    return models.length > 0 ? models : undefined;
  });
}
function fetchDefaultModel(aiServerClient) {
  return __awaiter(this, void 0, void 0, function* () {
    const {
      model
    } = yield aiServerClient.getDefaultModelForCli(new agent_service_pb /* GetDefaultModelForCliRequest */.Tu({}));
    return model;
  });
}