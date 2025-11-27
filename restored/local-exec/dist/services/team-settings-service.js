const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
class ConnectTeamSettingsService {
  constructor(dashboardClient) {
    this.dashboardClient = dashboardClient;
    this.lastFetchTime = 0;
    this.lastReposFetchTime = 0;
    this.settingsPromise = this.fetchSettings();
  }
  async fetchSettings() {
    this.lastFetchTime = Date.now();
    try {
      const settings = await this.dashboardClient.getTeamAdminSettingsOrEmptyIfNotInTeam(new dashboard_pb /* GetTeamAdminSettingsRequest */.Byz({}));
      return settings;
    } catch (_error) {
      return undefined;
    }
  }
  async getTeamAdminSettings() {
    const now = Date.now();
    const isExpired = now - this.lastFetchTime > CACHE_EXPIRY_MS;
    if (isExpired || (await this.settingsPromise) === undefined) {
      this.settingsPromise = this.fetchSettings();
    }
    return this.settingsPromise;
  }
  async getDotCursorProtection() {
    const settings = await this.getTeamAdminSettings();
    return settings?.dotCursorProtection ?? true;
  }
  async getShouldBlockMcp() {
    const settings = await this.getTeamAdminSettings();
    if (settings?.autoRunControls?.enabled && settings?.autoRunControls?.disableMcpAutoRun) {
      return true;
    }
    return false;
  }
  async getDeleteFileProtection() {
    const settings = await this.getTeamAdminSettings();
    if (settings?.autoRunControls?.enabled && settings?.autoRunControls?.deleteFileProtection) {
      return true;
    }
    return false;
  }
  async isServerBlocked(server) {
    const settings = await this.getTeamAdminSettings();
    const allowedMCPConfig = settings?.allowedMcpConfiguration;
    if (!allowedMCPConfig) return false;
    if (allowedMCPConfig.disableAll === true) return true;
    const allowedMcpServers = allowedMCPConfig.allowedMcpServers;
    if (!allowedMcpServers || allowedMcpServers.length === 0) return false;
    const matchesWildcard = (pattern, stringToMatch) => {
      if (!pattern.includes("*")) {
        return pattern === stringToMatch;
      }
      // Escape special regex characters except *
      const escapedPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
      // Replace * with .* (matches any sequence of characters)
      const regexPattern = escapedPattern.replace(/\*/g, ".*");
      // Create regex that matches the entire string
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(stringToMatch);
    };
    return !allowedMcpServers.some(s => {
      if (s.command && server.command) {
        return matchesWildcard(s.command, server.command);
      } else if (s.serverUrl && server.url) {
        return matchesWildcard(s.serverUrl, server.url);
      }
      return false;
    });
  }
  async getAutoRunControls() {
    const settings = await this.getTeamAdminSettings();
    if (!settings?.autoRunControls) {
      return undefined;
    }
    return {
      enabled: settings.autoRunControls.enabled ?? false,
      allowed: settings.autoRunControls.allowed ?? [],
      blocked: settings.autoRunControls.blocked ?? []
    };
  }
  async getTeamRepos() {
    const now = Date.now();
    if (!this.teamReposPromise || now - this.lastReposFetchTime > CACHE_EXPIRY_MS) {
      this.teamReposPromise = this.fetchTeamRepos();
      this.lastReposFetchTime = now;
    }
    return this.teamReposPromise;
  }
  async fetchTeamRepos() {
    return this.dashboardClient.getTeamReposOrEmptyIfNotInTeam(new dashboard_pb /* GetTeamReposRequest */.aYW({})).catch(_e => {
      // this is fine, it just means the team does not have repo blocklist enabled
      return undefined;
    });
  }
}
//# sourceMappingURL=team-settings-service.js.map