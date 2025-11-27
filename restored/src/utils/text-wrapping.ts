/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */F: () => (/* binding */clampTextToLines)
  /* harmony export */
});
/* unused harmony export wrapParagraphToWidth */
function wrapParagraphToWidth(paragraph, maxWidth) {
  const lines = [];
  if (maxWidth <= 0) {
    return [""];
  }
  const words = paragraph.split(/\s+/).filter(word => word.length > 0);
  let currentLine = "";
  const pushCurrentLine = () => {
    lines.push(currentLine);
    currentLine = "";
  };
  const breakLongWord = word => {
    for (let startIndex = 0; startIndex < word.length; startIndex += maxWidth) {
      const chunk = word.slice(startIndex, startIndex + maxWidth);
      if (chunk.length === maxWidth) {
        lines.push(chunk);
      } else {
        if (currentLine.length === 0) {
          currentLine = chunk;
        } else if (currentLine.length + 1 + chunk.length <= maxWidth) {
          currentLine = `${currentLine} ${chunk}`;
        } else {
          pushCurrentLine();
          currentLine = chunk;
        }
      }
    }
  };
  for (const word of words) {
    if (word.length > maxWidth) {
      if (currentLine.length > 0) {
        pushCurrentLine();
      }
      breakLongWord(word);
      continue;
    }
    if (currentLine.length === 0) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxWidth) {
      currentLine = `${currentLine} ${word}`;
    } else {
      pushCurrentLine();
      currentLine = word;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  if (lines.length === 0) {
    lines.push("");
  }
  return lines;
}
function clampTextToLines(text, maxLines, maxWidth) {
  var _a, _b, _c;
  if (maxLines <= 0 || maxWidth <= 0) {
    return "";
  }
  const paragraphs = text.replaceAll("\r\n", "\n").split("\n");
  const wrappedLines = [];
  for (let i = 0; i < paragraphs.length; i += 1) {
    const paragraph = (_a = paragraphs[i]) !== null && _a !== void 0 ? _a : "";
    // Preserve leading indentation for each original line
    const leadingWhitespaceMatch = paragraph.match(/^[ \t]+/);
    const leadingWhitespace = (_b = leadingWhitespaceMatch === null || leadingWhitespaceMatch === void 0 ? void 0 : leadingWhitespaceMatch[0]) !== null && _b !== void 0 ? _b : "";
    const contentWithoutIndent = paragraph.slice(leadingWhitespace.length);
    const availableWidth = Math.max(0, maxWidth - leadingWhitespace.length);
    if (availableWidth <= 0) {
      // Nothing but indentation fits on this line
      wrappedLines.push(leadingWhitespace.slice(0, maxWidth));
      if (wrappedLines.length >= maxLines + 1) {
        break;
      }
      continue;
    }
    const wrappedContent = wrapParagraphToWidth(contentWithoutIndent, availableWidth);
    for (const contentLine of wrappedContent) {
      const lineWithIndent = `${leadingWhitespace}${contentLine}`;
      wrappedLines.push(lineWithIndent);
      if (wrappedLines.length >= maxLines + 1) {
        break;
      }
    }
    if (wrappedLines.length >= maxLines + 1) {
      break;
    }
  }
  const ellipsis = "…";
  if (wrappedLines.length <= maxLines) {
    return wrappedLines.join("\n");
  }
  const limited = wrappedLines.slice(0, maxLines);
  const lastIndex = maxLines - 1;
  const lastLine = (_c = limited[lastIndex]) !== null && _c !== void 0 ? _c : "";
  if (lastLine.length >= maxWidth) {
    limited[lastIndex] = `${lastLine.slice(0, Math.max(0, maxWidth - 1))}${ellipsis}`;
  } else {
    limited[lastIndex] = `${lastLine}${ellipsis}`;
  }
  return limited.join("\n");
}

/***/