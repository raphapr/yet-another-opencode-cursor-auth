// Re-export core functionality

/**
 * Checks if a command exists in the PATH.
 */
function commandExists(command) {
  try {
    return (0, dist /* findActualExecutable */.Ef)(command, []).cmd !== command;
  } catch (_e) {
    return false;
  }
}
function getSuggestedShell(userTerminalHint) {
  if (userTerminalHint === KnownShellExecutor.ZshLight) {
    return KnownShellExecutor.ZshLight;
  }
  const shell = userTerminalHint || process.env.SHELL || "";
  const isWindows = "darwin" === "win32";
  // NB: We normally would not want to support this, but Git Bash is quite popular
  // so we'll try to make it work anyways. We don't support more obscure
  // variants of Bash like Cygwin.
  const isGitBash = /git.*bash\.exe$/i.test(shell) || /program.*git.*bin.*bash\.exe$/i.test(shell);
  const bashIsOkay = !isWindows || isGitBash;
  // Check if user's shell is a specific type
  if (shell.includes("zsh")) {
    return KnownShellExecutor.Zsh;
  } else if (shell.includes("bash") && bashIsOkay) {
    return KnownShellExecutor.Bash;
  } else if (shell.includes("pwsh") || shell.includes("powershell")) {
    return KnownShellExecutor.PowerShell;
  } else {
    // On Windows, prefer PowerShell
    if (isWindows) {
      if (commandExists("pwsh") || commandExists("powershell")) {
        return KnownShellExecutor.PowerShell;
      }
    }
    // Check if shells are available in PATH
    if (commandExists("zsh")) {
      return KnownShellExecutor.Zsh;
    } else if (commandExists("bash") && bashIsOkay) {
      return KnownShellExecutor.Bash;
    } else if (commandExists("pwsh") || commandExists("powershell")) {
      return KnownShellExecutor.PowerShell;
    } else {
      // Fall back to naive executor
      return KnownShellExecutor.Naive;
    }
  }
}
/**
 * Creates a default terminal executor based on the user's shell.
 * If the user's shell is zsh, returns a LazyTerminalExecutor with zsh state.
 * If the user's shell is bash, returns a LazyTerminalExecutor with bash state.
 * Otherwise, checks if zsh or bash are available in PATH before falling back to NaiveTerminalExecutor.
 *
 * Policies are provided per-execution via options; the default executor is policy-agnostic.
 */
function createDefaultTerminalExecutor(options) {
  const suggestedShell = getSuggestedShell(options?.userTerminalHint ?? "");
  switch (suggestedShell) {
    case KnownShellExecutor.Zsh:
      return new LazyTerminalExecutor(initZshState(options));
    case KnownShellExecutor.Bash:
      return new LazyTerminalExecutor(initBashState(options));
    case KnownShellExecutor.PowerShell:
      return new LazyTerminalExecutor(initPowerShellState());
    case KnownShellExecutor.ZshLight:
      return new LazyTerminalExecutor(initZshLightState(options));
    default:
      return createNaiveTerminalExecutor(options);
  }
}
//# sourceMappingURL=index.js.map