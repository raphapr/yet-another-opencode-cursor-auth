var KnownShellExecutor;
(function (KnownShellExecutor) {
  KnownShellExecutor["Zsh"] = "zsh";
  KnownShellExecutor["ZshLight"] = "zsh-light";
  KnownShellExecutor["Bash"] = "bash";
  KnownShellExecutor["PowerShell"] = "powershell";
  KnownShellExecutor["Naive"] = "naive";
})(KnownShellExecutor || (KnownShellExecutor = {}));
/**
 * Standard environment overrides for shell execution to ensure consistent behavior:
 * - TERM=dumb: Prevents ANSI color codes and interactive features, also prevents SSH MOTD
 * - NO_COLOR=1: Explicitly disables color output in tools that respect this standard
 * - FORCE_COLOR=0: Disables color for tools that use this convention (like some npm packages)
 */
const types_SHELL_ENV_OVERRIDES = {
  TERM: "dumb",
  NO_COLOR: "1",
  FORCE_COLOR: "0",
  _ZO_DOCTOR: "0"
};
//# sourceMappingURL=types.js.map