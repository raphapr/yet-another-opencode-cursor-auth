/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
  /* harmony export */
});
/* harmony import */
var ansi_escapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/ansi-escapes@7.0.0/node_modules/ansi-escapes/base.js");
/* harmony import */
var cli_cursor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/cli-cursor@4.0.0/node_modules/cli-cursor/index.js");
const create = (stream, {
  showCursor = false
} = {}) => {
  let previousOutput = '';
  let hasHiddenCursor = false;
  const render = str => {
    if (!showCursor && !hasHiddenCursor) {
      cli_cursor__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.A.hide();
      hasHiddenCursor = true;
    }
    const output = str + '\n';
    if (output === previousOutput) {
      return;
    }
    const newLines = output.split('\n');
    const oldLines = previousOutput.split('\n');
    // Find the first line that differs
    let firstDifferentLine = -1;
    const minLength = Math.min(newLines.length, oldLines.length);
    for (let i = 0; i < minLength; i++) {
      if (newLines[i] !== oldLines[i]) {
        firstDifferentLine = i;
        break;
      }
    }
    // If all compared lines are the same but counts differ
    if (firstDifferentLine === -1 && newLines.length !== oldLines.length) {
      firstDifferentLine = minLength;
    }
    // If everything is identical, nothing to do
    if (firstDifferentLine === -1) {
      previousOutput = output;
      return;
    }
    const linesToErase = oldLines.length - firstDifferentLine;
    let outputToWrite = '';
    if (linesToErase > process.stdout.rows) {
      outputToWrite += ansi_escapes__WEBPACK_IMPORTED_MODULE_1__ /* .clearTerminal */.Ik;
      outputToWrite += newLines.join('\n');
    } else {
      if (linesToErase > 0) {
        outputToWrite += ansi_escapes__WEBPACK_IMPORTED_MODULE_1__ /* .eraseLines */._W(linesToErase);
      }
      outputToWrite += newLines.slice(firstDifferentLine).join('\n');
    }
    stream.write(outputToWrite);
    previousOutput = output;
  };
  render.clear = () => {
    stream.write(ansi_escapes__WEBPACK_IMPORTED_MODULE_1__ /* .eraseLines */._W(previousOutput.split('\n').length));
    previousOutput = '';
  };
  render.done = () => {
    previousOutput = '';
    if (!showCursor) {
      cli_cursor__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.A.show();
      hasHiddenCursor = false;
    }
  };
  return render;
};
const logUpdate = {
  create
};
/* harmony default export */
const __WEBPACK_DEFAULT_EXPORT__ = logUpdate;
//# sourceMappingURL=log-update.js.map

/***/