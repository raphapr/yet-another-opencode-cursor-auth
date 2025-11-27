/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */GD: () => (/* binding */getLineEndExclusive),
  /* harmony export */Jh: () => (/* binding */getLineStart),
  /* harmony export */V: () => (/* binding */insertNewlineAbove),
  /* harmony export */Vs: () => (/* binding */insertNewlineBelow),
  /* harmony export */cs: () => (/* binding */getLineEnd),
  /* harmony export */kC: () => (/* binding */moveDownOneLine),
  /* harmony export */q5: () => (/* binding */isAtLastLine),
  /* harmony export */te: () => (/* binding */moveUpOneLine)
  /* harmony export */
});
function isAtLastLine(text, offset) {
  const cur = Math.min(Math.max(0, offset), text.length);
  return text.indexOf("\n", cur) === -1;
}
function moveUpOneLine(text, offset) {
  if (text.indexOf("\n") === -1) return null;
  const cur = Math.min(Math.max(0, offset), text.length);
  // Find newline strictly before caret; treat cur===0 as having no previous newline
  const prevNL = cur <= 0 ? -1 : text.lastIndexOf("\n", cur - 1);
  if (prevNL === -1) return null;
  const prevPrevNL = text.lastIndexOf("\n", Math.max(0, prevNL - 1));
  const prevLineStart = prevPrevNL === -1 ? 0 : prevPrevNL + 1;
  const curColumn = cur - (prevNL + 1);
  const prevLineLen = prevNL - prevLineStart;
  return prevLineStart + Math.min(curColumn, prevLineLen);
}
function moveDownOneLine(text, offset) {
  if (text.indexOf("\n") === -1) return null;
  const cur = Math.min(Math.max(0, offset), text.length);
  const nextNL = text.indexOf("\n", cur);
  if (nextNL === -1) return null;
  // Find newline strictly before caret to determine current line start
  const prevNL = cur <= 0 ? -1 : text.lastIndexOf("\n", cur - 1);
  const lineStart = prevNL === -1 ? 0 : prevNL + 1;
  const curColumn = cur - lineStart;
  const nextLineStart = nextNL + 1;
  const nextLineEndNL = text.indexOf("\n", nextLineStart);
  const nextLineEnd = nextLineEndNL === -1 ? text.length : nextLineEndNL;
  const nextLineLen = nextLineEnd - nextLineStart;
  return nextLineStart + Math.min(curColumn, nextLineLen);
}
function insertNewlineBelow(text, offset) {
  const cur = Math.min(Math.max(0, offset), text.length === 0 ? 0 : text.length - 1);
  const nextNL = text.indexOf("\n", Math.max(0, cur));
  const insertPos = nextNL === -1 ? text.length : nextNL + 1;
  const value = `${text.slice(0, insertPos)}\n${text.slice(insertPos)}`;
  // Place caret at the start of the newly opened line (after the inserted \n)
  const newOffset = insertPos + 1;
  return {
    value,
    newOffset
  };
}
function insertNewlineAbove(text, offset) {
  const cur = Math.min(Math.max(0, offset), Math.max(0, text.length));
  const lineStart = getLineStart(text, cur);
  const insertPos = lineStart;
  const value = `${text.slice(0, insertPos)}\n${text.slice(insertPos)}`;
  const newOffset = insertPos;
  return {
    value,
    newOffset
  };
}
// Returns the offset of the first character in the current line.
function getLineStart(text, offset) {
  const cur = Math.min(Math.max(0, offset), Math.max(0, text.length));
  // Treat caret at position 0 as first line start; otherwise search strictly before caret
  if (cur <= 0) return 0;
  const prevNL = text.lastIndexOf("\n", cur - 1);
  return prevNL === -1 ? 0 : prevNL + 1;
}
// Returns the offset of the last character in the current line.
// If the line is empty, returns the line start (which equals the next newline or text end).
function getLineEnd(text, offset) {
  const cur = Math.min(Math.max(0, offset), Math.max(0, text.length));
  const lineStart = getLineStart(text, cur);
  const nextNL = text.indexOf("\n", Math.max(0, lineStart));
  const lineEndExclusive = nextNL === -1 ? text.length : nextNL;
  const lineLen = Math.max(0, lineEndExclusive - lineStart);
  if (lineLen === 0) return lineStart;
  return Math.min(Math.max(0, lineEndExclusive - 1), Math.max(0, text.length - 1));
}
// Returns the exclusive end offset of the current line (i.e., one past the
// last character on the line, or the index of the newline if present).
// Useful for editors operating with insertion-point semantics, such as
// implementing Ctrl+E behavior.
function getLineEndExclusive(text, offset) {
  const cur = Math.min(Math.max(0, offset), Math.max(0, text.length));
  const lineStart = getLineStart(text, cur);
  const nextNL = text.indexOf("\n", Math.max(0, lineStart));
  const lineEndExclusive = nextNL === -1 ? text.length : nextNL;
  return Math.max(0, Math.min(text.length, lineEndExclusive));
}

/***/