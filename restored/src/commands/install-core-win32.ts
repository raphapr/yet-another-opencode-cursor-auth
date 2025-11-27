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
const prodUpdateUrl = "https://cursor.com";
function installCursorAgentWin32(currentVersion, channel, showProgress) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    // Build the PowerShell command to download and execute the installer script
    const ver = currentVersion ? `&version=${currentVersion}` : "";
    const base = (_a = process.env.AGENT_CLI_OVERRIDE_UPDATE_URL) !== null && _a !== void 0 ? _a : prodUpdateUrl;
    const url = `${base}/install?win32=true&update=true&channel=${channel}${ver}`;
    const command = `irm '${url}' | iex`;
    // Execute the PowerShell command
    yield new Promise((resolve, reject) => {
      const stdioMode = showProgress ? "inherit" : "ignore";
      const psProc = spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], {
        stdio: ["ignore", stdioMode, stdioMode],
        shell: false
      });
      psProc.on("error", err => {
        reject(new Error(`Failed to execute PowerShell: ${err instanceof Error ? err.message : String(err)}`));
      });
      psProc.on("close", code => {
        if (code !== 0) {
          reject(new Error(`Installation failed: PowerShell exited with code ${code !== null && code !== void 0 ? code : "unknown"}`));
          return;
        }
        resolve();
      });
    });
  });
}