/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */Kr: () => (/* binding */getPathDisplay),
  /* harmony export */RZ: () => (/* binding */truncatePathByFoldersLeft),
  /* harmony export */fw: () => (/* binding */toRelativePath),
  /* harmony export */me: () => (/* binding */formatLineNote),
  /* harmony export */rR: () => (/* binding */findGitDir),
  /* harmony export */tk: () => (/* binding */truncatePathMiddle)
  /* harmony export */
});
/* unused harmony exports toRelativePaths, truncateStart */
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var _anysphere_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../utils/dist/index.js");
/* harmony import */
var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/constants.ts");

/**
 * Convert an absolute path to a relative path from the current working directory
 * @param absolutePath The absolute path to convert
 * @returns The relative path from the current working directory
 */
function toRelativePath(absolutePath) {
  const cwd = process.cwd();
  const relativePath = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.relative)(cwd, absolutePath);
  // Only use a relative path if the target is within the workspace (cwd)
  // A path is within cwd if the relative path does not start with ".." and is not absolute
  const isWithinWorkspace = !relativePath.startsWith("..") && !(0, node_path__WEBPACK_IMPORTED_MODULE_1__.isAbsolute)(relativePath);
  if (!isWithinWorkspace) {
    return absolutePath;
  }
  // If the relative path is empty (same as cwd), return '.'
  if (relativePath === "") {
    return ".";
  }
  return relativePath;
}
/**
 * Convert multiple absolute paths to relative paths
 * @param absolutePaths Array of absolute paths to convert
 * @returns Array of relative paths from the current working directory
 */
function toRelativePaths(absolutePaths) {
  return absolutePaths.map(toRelativePath);
}
/**
 * Truncate a string to a maximum length by removing characters from the start,
 * prefixing with an ellipsis. Intended for path display where the tail is most
 * informative.
 */
function truncateStart(input, maxLength = 25) {
  if (maxLength <= 0) return "";
  if (input.length <= maxLength) return input;
  if (maxLength <= 3) return input.slice(-maxLength);
  return `...${input.slice(-(maxLength - 3))}`;
}
/**
 * Intelligently truncates a path by preserving both the beginning and end,
 * and truncating the middle with "..."
 */
function truncatePathMiddle(inputPath, maxLength) {
  if (inputPath.length <= maxLength) {
    return inputPath;
  }
  const ellipsis = "...";
  const ellipsisLength = ellipsis.length;
  const availableLength = maxLength - ellipsisLength;
  // Split the path into segments
  const segments = inputPath.split(/[\\/]/);
  // If we only have 1 or 2 segments, just truncate the end
  if (segments.length <= 2) {
    return inputPath.length > maxLength ? inputPath.substring(0, maxLength - ellipsisLength) + ellipsis : inputPath;
  }
  // Calculate how much space we can allocate to beginning and end
  // We'll try to keep roughly 40% for the beginning and 60% for the end
  const beginningLength = Math.floor(availableLength * 0.4);
  const endLength = availableLength - beginningLength;
  // Build the beginning part
  const beginningSegments = [];
  let beginningCurrentLength = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const segmentLength = segment.length + (beginningSegments.length > 0 ? 1 : 0); // +1 for "/"
    if (beginningCurrentLength + segmentLength <= beginningLength) {
      beginningSegments.push(segment);
      beginningCurrentLength += segmentLength;
    } else {
      break;
    }
  }
  // Build the end part (starting from the last segment)
  const endSegments = [];
  let endCurrentLength = 0;
  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i];
    const segmentLength = segment.length + (endSegments.length > 0 ? 1 : 0); // +1 for "/"
    if (endCurrentLength + segmentLength <= endLength) {
      endSegments.unshift(segment);
      endCurrentLength += segmentLength;
    } else {
      break;
    }
  }
  // If we can't fit both beginning and end, prioritize the end
  if (beginningSegments.length === 0 && endSegments.length > 0) {
    return ellipsis + node_path__WEBPACK_IMPORTED_MODULE_1___default().sep + endSegments.join(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep);
  }
  // Combine the parts
  const beginning = beginningSegments.join(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep);
  const end = endSegments.join(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep);
  if (beginning && end) {
    return beginning + node_path__WEBPACK_IMPORTED_MODULE_1___default().sep + ellipsis + node_path__WEBPACK_IMPORTED_MODULE_1___default().sep + end;
  } else if (beginning) {
    return beginning + node_path__WEBPACK_IMPORTED_MODULE_1___default().sep + ellipsis;
  } else if (end) {
    return ellipsis + node_path__WEBPACK_IMPORTED_MODULE_1___default().sep + end;
  } else {
    return ellipsis;
  }
}
function getPathDisplay(path, maxLength = _constants_js__WEBPACK_IMPORTED_MODULE_3__ /* .PATH_DISPLAY_MAX_LENGTH */.rY) {
  // Check if this is an agent tool output file and show friendly name
  if ((0, _anysphere_utils__WEBPACK_IMPORTED_MODULE_2__ /* .isAgentToolOutputFile */.JD)(path)) {
    return "tool output";
  }
  const rel = toRelativePath(path || "");
  return truncateStart(rel, maxLength);
}
/**
 * Truncate a path by dropping whole leading folders until it fits.
 * Keeps the right-most segments intact and prefixes with an ellipsis marker
 * when any leading folders are removed. Falls back to trimming the last
 * segment by characters if needed to satisfy the limit.
 */
function truncatePathByFoldersLeft(inputPath, maxLength, opts = {}) {
  var _a, _b;
  const ellipsis = (_a = opts.ellipsis) !== null && _a !== void 0 ? _a : "⋯";
  if (maxLength <= 0) return "";
  if (inputPath.length <= maxLength) return inputPath;
  const segments = inputPath.split(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep);
  if (segments.length === 0) return inputPath.slice(-maxLength);
  // Try to keep as many trailing segments as possible, removing from the left
  const prefix = `${ellipsis}${node_path__WEBPACK_IMPORTED_MODULE_1___default().sep}`;
  const keepMaxLen = n => {
    const kept = segments.slice(segments.length - n);
    const joined = kept.join(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep);
    const needsPrefix = n < segments.length;
    const candidate = (needsPrefix ? prefix : "") + joined;
    return candidate.length;
  };
  let low = 1;
  let high = Math.max(1, segments.length);
  let best = 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const len = keepMaxLen(mid);
    if (len <= maxLength) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  const needsPrefix = best < segments.length;
  const keptSegments = segments.slice(segments.length - best);
  const out = (needsPrefix ? prefix : "") + keptSegments.join(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep);
  if (out.length <= maxLength) return out;
  // If still too long, trim from the start of the last segment by characters
  const lastIdx = keptSegments.length - 1;
  const last = (_b = keptSegments[lastIdx]) !== null && _b !== void 0 ? _b : "";
  const head = (needsPrefix ? prefix : "") + keptSegments.slice(0, Math.max(0, lastIdx)).join(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep);
  const headPlusSep = head.length > 0 ? head + (head.endsWith(node_path__WEBPACK_IMPORTED_MODULE_1___default().sep) ? "" : node_path__WEBPACK_IMPORTED_MODULE_1___default().sep) : needsPrefix ? prefix : "";
  const remaining = Math.max(0, maxLength - headPlusSep.length);
  if (remaining <= 0) return (needsPrefix ? ellipsis : "").slice(0, maxLength);
  const trimmedLast = last.length <= remaining ? last : last.slice(-remaining);
  return headPlusSep + trimmedLast;
}
function formatLineNote(offset, limit) {
  if (typeof offset === "number") {
    const start = Math.max(1, offset + 1);
    if (typeof limit === "number" && limit > 0) {
      if (limit === 1) return `line ${start}`;
      const end = start + limit - 1;
      return `lines ${start}-${end}`;
    }
    return `line ${start}`;
  }
  return undefined;
}
function findGitDir(startPath) {
  let currentPath = startPath;
  while (currentPath !== node_path__WEBPACK_IMPORTED_MODULE_1___default().parse(currentPath).root) {
    const gitPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(currentPath, ".git");
    if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(gitPath)) {
      return gitPath;
    }
    currentPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().dirname(currentPath);
  }
  // Check root directory as well
  const rootGitPath = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(currentPath, ".git");
  if (node_fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(rootGitPath)) {
    return rootGitPath;
  }
  return null;
}

/***/