var team_admin_settings_service_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function fetchTeamAdminSettings(dashboardClient) {
  return team_admin_settings_service_awaiter(this, void 0, void 0, function* () {
    try {
      const response = yield dashboardClient.getTeamAdminSettings(new GetTeamAdminSettingsRequest({}));
      return response;
    } catch (error) {
      debugLogJSON("team.fetchTeamAdminSettings.error", extractErrorInfo(error), "ERROR");
      return undefined;
    }
  });
}
function setupTeamSettingsService(credentialManager, endpoint, configProvider) {
  const backendUrl = (0, api_endpoint /* getApiEndpoint */.G6)(endpoint);
  const dashboardClient = (0, cursor_config_dist /* createDashboardClient */.Vi)({
    credentialManager,
    endpoint: backendUrl,
    configProvider
  });
  const teamSettingsService = new local_exec_dist.ConnectTeamSettingsService(dashboardClient);
  return teamSettingsService;
}