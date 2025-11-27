var permissions_adapter_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class ConfigPermissionsAdapter {
  constructor(configProvider) {
    this.configProvider = configProvider;
  }
  getPermissions() {
    return permissions_adapter_awaiter(this, void 0, void 0, function* () {
      var _a;
      const config = this.configProvider.get();
      return Object.assign(Object.assign({}, config.permissions), {
        approvalMode: (_a = config.approvalMode) !== null && _a !== void 0 ? _a : "allowlist",
        userConfiguredPolicy: {
          type: "insecure_none"
        }
      });
    });
  }
  updatePermissions(transformer) {
    return permissions_adapter_awaiter(this, void 0, void 0, function* () {
      yield this.configProvider.transform(c => Object.assign(Object.assign({}, c), {
        permissions: transformer(c.permissions)
      }));
    });
  }
}