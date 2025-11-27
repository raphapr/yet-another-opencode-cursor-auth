/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _J: () => (/* binding */ detectTerminalIsLight),
/* harmony export */   jf: () => (/* binding */ resetTerminalThemeCache),
/* harmony export */   lf: () => (/* binding */ isLikelySshSession)
/* harmony export */ });
/* unused harmony exports disableTerminalThemeDetection, parseColorFgbgBackgroundRgb, computeLuma, detectTerminalBackgroundRgb */
/*
  Terminal theme detection using OSC 11 query.
  Based on xterm dynamic colors: query default background.
  Many terminals reply with: ESC ] 11;rgb:RRRR/GGGG/BBBB BEL|ST
*/
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cached = {
    rgb: undefined,
};
// Global kill-switch to avoid emitting OSC 11 queries in environments that
// visibly echo terminal responses (e.g., certain integrated terminals).
let detectionDisabled = false;
function disableTerminalThemeDetection() {
    detectionDisabled = true;
    // Ensure any waiting callers resolve quickly without side effects
    cached.rgb = null;
    cached.pending = undefined;
}
function resetTerminalThemeCache() {
    cached.rgb = undefined;
    cached.pending = undefined;
}
/**
 * Parse COLORFGBG environment variable to approximate background RGB.
 * Common formats: "fg;bg" or "fg;bg;..." where the last value is background.
 * Values are typically ANSI color indexes (0-15). This is a heuristic.
 */
function parseColorFgbgBackgroundRgb(env = process.env) {
    var _a;
    const value = env.COLORFGBG;
    if (!value)
        return null;
    const parts = value
        .split(";")
        .map(p => p.trim())
        .filter(Boolean);
    if (parts.length === 0)
        return null;
    const bgIndexStr = (_a = parts[parts.length - 1]) !== null && _a !== void 0 ? _a : "";
    const bgIndex = Number.parseInt(bgIndexStr, 10);
    if (!Number.isFinite(bgIndex))
        return null;
    // Map 0-15 ANSI colors to approximate sRGB values
    // 0: black, 7: light gray, 8: dark gray, 15: white, etc.
    const ansi16 = [
        { r: 0, g: 0, b: 0 }, // 0 black
        { r: 205, g: 0, b: 0 }, // 1 red
        { r: 0, g: 205, b: 0 }, // 2 green
        { r: 205, g: 205, b: 0 }, // 3 yellow
        { r: 0, g: 0, b: 238 }, // 4 blue
        { r: 205, g: 0, b: 205 }, // 5 magenta
        { r: 0, g: 205, b: 205 }, // 6 cyan
        { r: 229, g: 229, b: 229 }, // 7 light gray
        { r: 127, g: 127, b: 127 }, // 8 dark gray
        { r: 255, g: 0, b: 0 }, // 9 bright red
        { r: 0, g: 255, b: 0 }, // 10 bright green
        { r: 255, g: 255, b: 0 }, // 11 bright yellow
        { r: 92, g: 92, b: 255 }, // 12 bright blue
        { r: 255, g: 0, b: 255 }, // 13 bright magenta
        { r: 0, g: 255, b: 255 }, // 14 bright cyan
        { r: 255, g: 255, b: 255 }, // 15 white
    ];
    if (bgIndex >= 0 && bgIndex < ansi16.length) {
        return ansi16[bgIndex];
    }
    return null;
}
function to8bit(hex) {
    // 1-4 hex digits per channel possible; scale to 0-255
    const v = parseInt(hex, 16);
    const bits = hex.length * 4; // 4..16
    if (bits <= 8)
        return v & 0xff;
    // downscale 16->8 by >> 8
    return (v >> (bits - 8)) & 0xff;
}
function computeLuma(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    // Rec. 709 luma
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function detectTerminalBackgroundRgb(stdin_1, stdout_1) {
    return __awaiter(this, arguments, void 0, function* (stdin, stdout, timeoutMs = 60) {
        var _a;
        if (detectionDisabled)
            return null;
        if (cached.rgb !== undefined)
            return (_a = cached.rgb) !== null && _a !== void 0 ? _a : null;
        if (cached.pending)
            return cached.pending;
        cached.pending = new Promise(resolve => {
            if (!stdin.isTTY || !stdout.isTTY) {
                cached.rgb = null;
                resolve(null);
                return;
            }
            // Do not change raw mode; respect the host app's raw-mode management
            let buf = "";
            const onData = (chunk) => {
                buf += chunk.toString("utf8");
                // Parse OSC 11 response; examples:
                // \x1b]11;rgb:ffff/ffff/ffff\x07
                // \x1b]11;rgba:ffff/ffff/ffff/ffff\x07
                const m = /\x1b\]11;(?:rgba?):([0-9a-fA-F]{1,4})\/([0-9a-fA-F]{1,4})\/([0-9a-fA-F]{1,4})(?:\/[0-9a-fA-F]{1,4})?(?:\x07|\x1b\\)/i.exec(buf);
                if (m) {
                    stdin.off("data", onData);
                    const r = to8bit(m[1]);
                    const g = to8bit(m[2]);
                    const b = to8bit(m[3]);
                    const rgb = { r, g, b };
                    cached.rgb = rgb;
                    resolve(rgb);
                }
            };
            const cleanup = () => {
                stdin.off("data", onData);
            };
            stdin.on("data", onData);
            // Send OSC 11 query with BEL and ST terminators (maximize compat)
            try {
                const osc11Bel = "\x1b]11;?\x07";
                // Write only BEL-terminated variant to avoid stray visible characters
                stdout.write(osc11Bel);
            }
            catch (_a) { }
            setTimeout(() => {
                var _a;
                cleanup();
                if (cached.rgb === undefined) {
                    // Try environment-based fallback if OSC 11 is unavailable
                    const envRgb = parseColorFgbgBackgroundRgb();
                    cached.rgb = envRgb !== null && envRgb !== void 0 ? envRgb : null;
                }
                resolve((_a = cached.rgb) !== null && _a !== void 0 ? _a : null);
            }, timeoutMs);
        });
        const res = yield cached.pending;
        return res;
    });
}
function detectTerminalIsLight(stdin, stdout, timeoutMs) {
    return __awaiter(this, void 0, void 0, function* () {
        const rgb = yield detectTerminalBackgroundRgb(stdin, stdout, timeoutMs);
        if (!rgb) {
            // As a secondary fallback, attempt to infer from COLORFGBG
            const envRgb = parseColorFgbgBackgroundRgb();
            if (!envRgb)
                return null;
            const lumaEnv = computeLuma(envRgb);
            return lumaEnv > 0.6;
        }
        const luma = computeLuma(rgb);
        return luma > 0.6;
    });
}
const TRUTHY_VALUES = new Set(["1", "true", "yes", "y", "on"]);
const FALSY_VALUES = new Set(["0", "false", "no", "n", "off"]);
const OVERRIDE_ENV_VARS = [
    "CURSOR_AGENT_CLI_ASSUME_SSH",
    "CURSOR_AGENT_ASSUME_SSH",
    "CURSOR_CLI_ASSUME_SSH",
    "CURSOR_ASSUME_SSH",
    "CURSOR_AGENT_CLI_FORCE_SSH",
    "CURSOR_AGENT_FORCE_SSH",
    "CURSOR_CLI_FORCE_SSH",
    "CURSOR_FORCE_SSH",
];
const DIRECT_SSH_ENV_VARS = [
    "SSH_CONNECTION",
    "SSH_CLIENT",
    "SSH_TTY",
    "SSH2_CLIENT",
    "SSH2_TTY",
];
const MOSH_ENV_VARS = [
    "MOSH_CLIENT",
    "MOSH_SERVER",
    "MOSH_TTY",
    "MOSH_IP",
    "MOSH_PORT",
    "MOSH_PRESERVE_PROMPT",
];
const REMOTE_HINT_ENV_VARS = [
    "VSCODE_SSH_HOST",
    "VSCODE_SSH_SERVER",
];
const REMOTE_VALUE_MATCHERS = [
    { key: "VSCODE_IPC_HOOK_CLI", regex: /ssh/i },
    { key: "TERM", regex: /mosh/i },
];
function parseBooleanEnv(value) {
    if (value == null) {
        return undefined;
    }
    const normalized = value.trim().toLowerCase();
    if (TRUTHY_VALUES.has(normalized)) {
        return true;
    }
    if (FALSY_VALUES.has(normalized)) {
        return false;
    }
    return undefined;
}
function resolveOverride(env) {
    for (const key of OVERRIDE_ENV_VARS) {
        const parsed = parseBooleanEnv(env[key]);
        if (parsed !== undefined) {
            return parsed;
        }
    }
    return undefined;
}
function hasIndicator(env, keys) {
    return keys.some((key) => {
        const value = env[key];
        return value != null && value !== "";
    });
}
function matchesIndicatorRegex(env, matchers) {
    return matchers.some((matcher) => {
        const value = env[matcher.key];
        return typeof value === "string" && matcher.regex.test(value);
    });
}
/**
 * Best-effort detection of whether the current process is running inside an SSH
 * or SSH-like (e.g. mosh) remote session. Can be overridden via CURSOR_*_SSH env vars.
 */
function isLikelySshSession(env = process.env) {
    const override = resolveOverride(env);
    if (override !== undefined) {
        return override;
    }
    if (hasIndicator(env, DIRECT_SSH_ENV_VARS)) {
        return true;
    }
    if (hasIndicator(env, MOSH_ENV_VARS)) {
        return true;
    }
    if (hasIndicator(env, REMOTE_HINT_ENV_VARS)) {
        return true;
    }
    if (matchesIndicatorRegex(env, REMOTE_VALUE_MATCHERS)) {
        return true;
    }
    return false;
}


/***/ })

};
;