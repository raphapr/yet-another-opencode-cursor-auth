/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => (/* binding */Output)
  /* harmony export */
});
/* harmony import */
var slice_ansi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/slice-ansi@7.1.0/node_modules/slice-ansi/index.js");
/* harmony import */
var string_width__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/string-width@8.1.0/node_modules/string-width/index.js");
/* harmony import */
var widest_line__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/widest-line@5.0.0/node_modules/widest-line/index.js");
/* harmony import */
var _alcalzone_ansi_tokenize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/@alcalzone+ansi-tokenize@0.2.0/node_modules/@alcalzone/ansi-tokenize/build/index.js");
class Output {
  width;
  height;
  operations = [];
  constructor(options) {
    const {
      width,
      height
    } = options;
    this.width = width;
    this.height = height;
  }
  write(x, y, text, options) {
    const {
      transformers
    } = options;
    if (!text) {
      return;
    }
    this.operations.push({
      type: 'write',
      x,
      y,
      text,
      transformers
    });
  }
  clip(clip) {
    this.operations.push({
      type: 'clip',
      clip
    });
  }
  unclip() {
    this.operations.push({
      type: 'unclip'
    });
  }
  get() {
    // Initialize output array with a specific set of rows, so that margin/padding at the bottom is preserved
    const output = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push({
          type: 'char',
          value: ' ',
          fullWidth: false,
          styles: []
        });
      }
      output.push(row);
    }
    const clips = [];
    for (const operation of this.operations) {
      if (operation.type === 'clip') {
        clips.push(operation.clip);
      }
      if (operation.type === 'unclip') {
        clips.pop();
      }
      if (operation.type === 'write') {
        const {
          text,
          transformers
        } = operation;
        let {
          x,
          y
        } = operation;
        let lines = text.split('\n');
        const clip = clips.at(-1);
        if (clip) {
          const clipHorizontally = typeof clip?.x1 === 'number' && typeof clip?.x2 === 'number';
          const clipVertically = typeof clip?.y1 === 'number' && typeof clip?.y2 === 'number';
          // If text is positioned outside of clipping area altogether,
          // skip to the next operation to avoid unnecessary calculations
          if (clipHorizontally) {
            const width = (0, widest_line__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A)(text);
            if (x + width < clip.x1 || x > clip.x2) {
              continue;
            }
          }
          if (clipVertically) {
            const height = lines.length;
            if (y + height < clip.y1 || y > clip.y2) {
              continue;
            }
          }
          if (clipHorizontally) {
            lines = lines.map(line => {
              const from = x < clip.x1 ? clip.x1 - x : 0;
              const width = (0, string_width__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A)(line);
              const to = x + width > clip.x2 ? clip.x2 - x : width;
              return (0, slice_ansi__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.A)(line, from, to);
            });
            if (x < clip.x1) {
              x = clip.x1;
            }
          }
          if (clipVertically) {
            const from = y < clip.y1 ? clip.y1 - y : 0;
            const height = lines.length;
            const to = y + height > clip.y2 ? clip.y2 - y : height;
            lines = lines.slice(from, to);
            if (y < clip.y1) {
              y = clip.y1;
            }
          }
        }
        let offsetY = 0;
        for (let [index, line] of lines.entries()) {
          const currentLine = output[y + offsetY];
          // Line can be missing if `text` is taller than height of pre-initialized `this.output`
          if (!currentLine) {
            continue;
          }
          for (const transformer of transformers) {
            line = transformer(line, index);
          }
          const characters = (0, _alcalzone_ansi_tokenize__WEBPACK_IMPORTED_MODULE_1__ /* .styledCharsFromTokens */.P1)((0, _alcalzone_ansi_tokenize__WEBPACK_IMPORTED_MODULE_1__ /* .tokenize */.qw)(line));
          let offsetX = x;
          for (const character of characters) {
            currentLine[offsetX] = character;
            // Determine printed width using string-width to align with measurement
            const characterWidth = Math.max(1, (0, string_width__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A)(character.value));
            // For multi-column characters, clear following cells to avoid stray spaces/artifacts
            if (characterWidth > 1) {
              for (let index = 1; index < characterWidth; index++) {
                currentLine[offsetX + index] = {
                  type: 'char',
                  value: '',
                  fullWidth: false,
                  styles: character.styles
                };
              }
            }
            offsetX += characterWidth;
          }
          offsetY++;
        }
      }
    }
    const generatedOutput = output.map(line => {
      // See https://github.com/vadimdemedes/ink/pull/564#issuecomment-1637022742
      const lineWithoutEmptyItems = line.filter(item => item !== undefined);
      return (0, _alcalzone_ansi_tokenize__WEBPACK_IMPORTED_MODULE_1__ /* .styledCharsToString */.b2)(lineWithoutEmptyItems).trimEnd();
    }).join('\n');
    return {
      output: generatedOutput,
      height: output.length
    };
  }
}
//# sourceMappingURL=output.js.map

/***/