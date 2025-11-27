var read_only_file_based_permissions_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class ReadOnlyFileBasedPermissionsProvider {
  constructor(permissions) {
    this.permissions = permissions;
  }
  /**
   * Load permissions from a file at the given path.
   * Returns undefined if the file doesn't exist or doesn't have valid permissions.
   */
  static loadFromPath(path) {
    return read_only_file_based_permissions_provider_awaiter(this, void 0, void 0, function* () {
      if (!(0, external_node_fs_.existsSync)(path)) {
        return undefined;
      }
      try {
        const raw = yield (0, promises_.readFile)(path, "utf8");
        const parsed = JSON.parse(raw);
        // We only care about the permissions field, but allow other fields
        const result = BaseConfigSchema.passthrough().safeParse(parsed);
        if (!result.success) {
          return undefined;
        }
        return new ReadOnlyFileBasedPermissionsProvider(Object.assign(Object.assign({}, result.data.permissions), {
          approvalMode: "allowlist"
        }));
      } catch (_error) {
        return undefined;
      }
    });
  }
  getPermissions() {
    return read_only_file_based_permissions_provider_awaiter(this, void 0, void 0, function* () {
      return Object.assign(Object.assign({}, this.permissions), {
        approvalMode: "unrestricted",
        userConfiguredPolicy: {
          type: "insecure_none"
        }
      });
    });
  }
  updatePermissions(transformer) {
    return read_only_file_based_permissions_provider_awaiter(this, void 0, void 0, function* () {
      // No-op for read-only provider
      void transformer;
    });
  }
}