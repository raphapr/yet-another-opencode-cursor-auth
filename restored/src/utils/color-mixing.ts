/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */E2: () => (/* binding */hexToRgb),
  /* harmony export */LQ: () => (/* binding */rgbToAnsi256),
  /* harmony export */LR: () => (/* binding */ansi256IndexToHex),
  /* harmony export */Lh: () => (/* binding */mixColors),
  /* harmony export */Ob: () => (/* binding */rgbToHex),
  /* harmony export */PT: () => (/* binding */getColorMode)
  /* harmony export */
});
/* unused harmony export applyTint */
/* harmony import */
var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:process");
/* harmony import */
var node_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_process__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Get the terminal's color support level
 */
function getColorMode() {
  var _a, _b;
  const depth = (_b = (_a = node_process__WEBPACK_IMPORTED_MODULE_0__.stdout === null || node_process__WEBPACK_IMPORTED_MODULE_0__.stdout === void 0 ? void 0 : node_process__WEBPACK_IMPORTED_MODULE_0__.stdout.getColorDepth) === null || _a === void 0 ? void 0 : _a.call(node_process__WEBPACK_IMPORTED_MODULE_0__.stdout)) !== null && _b !== void 0 ? _b : 1;
  if (depth >= 24) return "truecolor";
  if (depth >= 8) return "ansi256";
  if (depth >= 4) return "basic";
  return "none";
}
/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
}
/**
 * Convert RGB to hex color
 */
function rgbToHex(rgb) {
  const toHex = n => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
/**
 * Mix two colors together with specified ratios
 */
function mixColors(base, tint, baseRatio = 0.8) {
  const tintRatio = 1 - baseRatio;
  return {
    r: Math.round(base.r * baseRatio + tint.r * tintRatio),
    g: Math.round(base.g * baseRatio + tint.g * tintRatio),
    b: Math.round(base.b * baseRatio + tint.b * tintRatio)
  };
}
/**
 * Apply tint to a base color and return appropriate color format for Ink
 */
function applyTint(baseHex, tintHex, options = {}) {
  var _a;
  const colorMode = getColorMode();
  // For basic color mode, return the tint color directly
  if (colorMode === "basic" || colorMode === "none") {
    return tintHex;
  }
  const tintRgb = hexToRgb(tintHex);
  if (!tintRgb) return tintHex;
  // Use provided base color or theme default
  const baseRgb = baseHex ? hexToRgb(baseHex) || {
    r: 0,
    g: 0,
    b: 0
  } : options.isLightTheme ? {
    r: 255,
    g: 255,
    b: 255
  } : {
    r: 0,
    g: 0,
    b: 0
  };
  // Use different mixing ratios for light vs dark themes
  const ratio = (_a = options.baseRatio) !== null && _a !== void 0 ? _a : options.isLightTheme ? 0.78 : 0.8;
  const mixed = mixColors(baseRgb, tintRgb, ratio);
  // Return appropriate format based on color support
  if (colorMode === "truecolor") {
    return `rgb(${mixed.r},${mixed.g},${mixed.b})`;
  }
  if (colorMode === "ansi256") {
    // Convert to ANSI 256 color (simplified conversion)
    const ansi256 = rgbToAnsi256(mixed.r, mixed.g, mixed.b);
    return `ansi256(${ansi256})`;
  }
  // Fallback to hex
  return rgbToHex(mixed);
}
/**
 * Convert RGB to ANSI 256 color index
 */
function rgbToAnsi256(r, g, b) {
  // Grayscale detection
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round((r - 8) / 247 * 24) + 232;
  }
  // Color cube (6x6x6)
  const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
  return ansi;
}
/**
 * Convert an ANSI-256 color index to a hex string using the standard xterm table.
 */
function ansi256IndexToHex(index) {
  var _a, _b, _c, _d;
  // 0-15: basic/system colors per xterm palette
  // Use widely accepted approximations for consistency across terminals
  if (index >= 0 && index <= 15) {
    const basic = ["#000000",
    // 0: black
    "#800000",
    // 1: red (dark)
    "#008000",
    // 2: green (dark)
    "#808000",
    // 3: yellow (dark)
    "#000080",
    // 4: blue (dark)
    "#800080",
    // 5: magenta (dark)
    "#008080",
    // 6: cyan (dark)
    "#c0c0c0",
    // 7: white (light gray)
    "#808080",
    // 8: bright black (gray)
    "#ff0000",
    // 9: bright red
    "#00ff00",
    // 10: bright green
    "#ffff00",
    // 11: bright yellow
    "#0000ff",
    // 12: bright blue
    "#ff00ff",
    // 13: bright magenta
    "#00ffff",
    // 14: bright cyan
    "#ffffff" // 15: bright white
    ];
    return (_a = basic[index]) !== null && _a !== void 0 ? _a : "#000000";
  }
  // 16-231: 6x6x6 color cube
  if (index >= 16 && index <= 231) {
    const n = index - 16;
    const rIdx = Math.floor(n / 36);
    const gIdx = Math.floor(n % 36 / 6);
    const bIdx = n % 6;
    const step = [0, 95, 135, 175, 215, 255];
    const rr = (_b = step[rIdx]) !== null && _b !== void 0 ? _b : 0;
    const gg = (_c = step[gIdx]) !== null && _c !== void 0 ? _c : 0;
    const bb = (_d = step[bIdx]) !== null && _d !== void 0 ? _d : 0;
    const toHex = v => v.toString(16).padStart(2, "0");
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
  }
  // 232-255: grayscale from near-black to near-white
  if (index >= 232 && index <= 255) {
    const level = 8 + (index - 232) * 10;
    const v = Math.max(0, Math.min(255, level));
    const toHex = x => x.toString(16).padStart(2, "0");
    return `#${toHex(v)}${toHex(v)}${toHex(v)}`;
  }
  // Out-of-range fallback to a readable neutral
  return "#808080";
}

/***/