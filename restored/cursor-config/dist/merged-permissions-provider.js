var merged_permissions_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class MergedPermissionsProvider {
  constructor(providers) {
    this.providers = providers;
    if (providers.length === 0) {
      throw new Error("MergedPermissionsProvider requires at least one provider");
    }
  }
  getPermissions() {
    return merged_permissions_provider_awaiter(this, void 0, void 0, function* () {
      const mergedAllow = new Set();
      const mergedDeny = new Set();
      let mostRestrictiveMode = "unrestricted";
      let userConfiguredPolicy = {
        type: "insecure_none"
      };
      // Collect all permissions from all providers
      for (const provider of this.providers) {
        const perms = yield provider.getPermissions();
        for (const allowed of perms.allow) {
          mergedAllow.add(allowed);
        }
        for (const denied of perms.deny) {
          mergedDeny.add(denied);
        }
        // Take the most restrictive approval mode
        if (perms.approvalMode === "allowlist") {
          mostRestrictiveMode = "allowlist";
        }
        // Take the first non-insecure_none policy, or the last policy
        if (perms.userConfiguredPolicy.type !== "insecure_none") {
          userConfiguredPolicy = perms.userConfiguredPolicy;
        }
      }
      return {
        allow: Array.from(mergedAllow),
        deny: Array.from(mergedDeny),
        approvalMode: mostRestrictiveMode,
        userConfiguredPolicy
      };
    });
  }
  updatePermissions(transformer) {
    return merged_permissions_provider_awaiter(this, void 0, void 0, function* () {
      // Apply updates to all providers in parallel
      yield Promise.all(this.providers.map(provider => provider.updatePermissions(transformer)));
    });
  }
}