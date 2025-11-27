var update_core_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function checkForUpdate(dashboardClient, channel) {
  return update_core_awaiter(this, void 0, void 0, function* () {
    // Map prod-stable-internal to prod for the API call (client-only concept)
    // prod-stable-internal is an internal alias for prod to avoid auto-update of devs to staging channel
    const apiChannel = channel === "prod-stable-internal" ? "prod" : channel;
    // Get the latest CLI download information from the server
    const response = yield dashboardClient.getCliDownloadUrl({
      channel: apiChannel
    });
    if (!response.url || !response.version) {
      throw new Error("Invalid response from server: missing URL or version information");
    }
    return {
      version: response.version,
      url: response.url
    };
  });
}
function updateCursorAgent(options) {
  return update_core_awaiter(this, void 0, void 0, function* () {
    var _a, _b;
    const {
      dashboardClient,
      showProgress = true
    } = options;
    if (showProgress) {
      (0, console_io /* intentionallyWriteToStderr */.p2)("Checking for updates...");
    }
    const updateInfo = yield checkForUpdate(dashboardClient, options.channel);
    if (updateInfo.version === "2025.11.25-d5b3271") {
      if (showProgress) {
        (0, console_io /* intentionallyWriteToStderr */.p2)("Already up to date");
      }
      return;
    }
    if (showProgress) {
      (0, console_io /* intentionallyWriteToStderr */.p2)(`Latest version available: ${updateInfo.version}`);
    }
    // Use the install command with the version and URL prefix from the server
    if (false)
      // removed by dead control flow
      {} else {
      yield (0, install_core_posix /* installCursorAgent */.BV)({
        version: updateInfo.version,
        urlPrefix: updateInfo.url,
        showProgress
      });
    }
    if (showProgress) {
      (0, console_io /* intentionallyWriteToStderr */.p2)("Done");
    }
  });
}