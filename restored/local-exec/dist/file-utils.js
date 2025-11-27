var LineEnding;
(function (LineEnding) {
  LineEnding["CRLF"] = "CRLF";
  LineEnding["LF"] = "LF";
})(LineEnding || (LineEnding = {}));
// File extensions that indicate binary files
const BINARY_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp", ".svg", ".pdf", ".zip", ".tar", ".gz", ".exe", ".dll", ".so", ".dylib", ".bin"]);
// File extensions that indicate image files (subset of binary extensions)
const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|ico|bmp|svg)$/i;
/**
 * Gets the file extension from a file path in lowercase.
 */
function getFileExtension(filePath) {
  return filePath.toLowerCase().substring(filePath.lastIndexOf("."));
}
/**
 * Creates a ContentFormat for a binary file based on its extension.
 */
function getFormatFromFileExtension(filePath) {
  const ext = getFileExtension(filePath);
  return {
    encoding: "binary",
    lineEnding: LineEnding.LF,
    isBinaryFile: true,
    isImageFile: IMAGE_EXTENSIONS.test(ext)
  };
}
async function readText(file) {
  const buf = await (0, promises_.readFile)(file);
  const format = getFormatForBuffer(buf);
  const str = lib.decode(buf, format.encoding, {
    stripBOM: true,
    defaultEncoding: "utf8"
  });
  if (format.lineEnding === LineEnding.CRLF) {
    return str.replaceAll("\r\n", "\n");
  }
  return str;
}
async function writeText(file, content, workspaceRoot) {
  const {
    buffer
  } = await getBufferForWrite(file, content, workspaceRoot);
  await (0, promises_.writeFile)(file, buffer);
}
async function getBufferForWrite(file, content, workspaceRoot) {
  let format;
  try {
    if (workspaceRoot) {
      format = await getBestFormatForPath(file, workspaceRoot);
    } else {
      format = await getFormatForFile(file);
    }
  } catch {
    // Check if file extension indicates a binary file before falling back to default
    const ext = getFileExtension(file);
    if (BINARY_EXTENSIONS.has(ext)) {
      format = getFormatFromFileExtension(file);
    } else {
      format = getDefaultTextFormatForOS();
    }
  }
  const lines = countLines(content);
  if (format.lineEnding === LineEnding.CRLF) {
    content = content.replaceAll("\n", "\r\n");
  }
  // For binary files, check if content is base64-encoded and decode it
  // This handles cases where binary data is passed as base64 to avoid
  // corruption through protobuf string serialization (which uses UTF-8)
  // NOTE: we need this because we use protobuf string for file content,
  // which uses UTF-8 encoding. For binary files (like images), without
  // base64 decoding, the file content will be corrupted.
  if (format.encoding === "binary") {
    const buffer = decodeBinaryContent(content);
    return {
      lines,
      buffer,
      format
    };
  }
  return {
    lines,
    buffer: lib.encode(content, format.encoding, {
      defaultEncoding: "utf8"
    }),
    format
  };
}
async function getBestFormatForPath(possiblePath, workspaceRoot) {
  try {
    return await getFormatForFile(possiblePath);
  } catch {
    // Didn't work keep going
  }
  // Check if file extension indicates a binary file (images, etc.)
  const ext = getFileExtension(possiblePath);
  if (BINARY_EXTENSIONS.has(ext)) {
    return getFormatFromFileExtension(possiblePath);
  }
  try {
    return await getFormatForWorkspace(workspaceRoot);
  } catch {
    return getDefaultTextFormatForOS();
  }
}
async function getFormatForFile(file) {
  const header = await readFirstBytes(file);
  return getFormatForBuffer(header);
}
function countLines(data) {
  if (data === "") return 1;
  let lines = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === "\n") {
      lines++;
    }
  }
  return lines;
}
function getFormatForBuffer(header) {
  // Handle empty buffers explicitly
  if (header.length === 0) {
    return getDefaultTextFormatForOS();
  }
  // Detect UTF-16 encodings first (which contain null bytes as part of encoding)
  const utf16Encoding = detectUTF16Encoding(header);
  if (utf16Encoding) {
    return {
      encoding: utf16Encoding,
      lineEnding: determineLineEndingsForBuffer(header),
      isBinaryFile: false,
      isImageFile: false
    };
  }
  // Detect UTF-32 encodings which jschardet often misidentifies
  const utf32Encoding = detectUTF32Encoding(header);
  if (utf32Encoding) {
    return {
      encoding: utf32Encoding,
      lineEnding: determineLineEndingsForBuffer(header),
      isBinaryFile: false,
      isImageFile: false
    };
  }
  // Now check if it's binary (after checking for multi-byte text encodings)
  const isBinaryFile = !isBufferText(header);
  if (isBinaryFile) {
    return {
      encoding: "binary",
      lineEnding: LineEnding.LF,
      isBinaryFile: true,
      isImageFile: isBufferAnImage(header)
    };
  }
  const detect = jschardet.detect(header);
  let enc = detect.confidence > 0.7 ? detect.encoding : "utf-8";
  if (enc === "ascii") {
    enc = "utf-8";
  }
  return {
    encoding: enc ?? "utf-8",
    lineEnding: determineLineEndingsForBuffer(header),
    isBinaryFile: false,
    isImageFile: false
  };
}
async function getFormatForWorkspace(workspaceRoot) {
  // Iterate through files until we find at least three text files that have
  // the same encoding and line ending format
  // Track format combinations: key is "encoding:lineEnding", value is count
  const formatCounts = new Map();
  let filesProcessed = 0;
  const MAX_FILES_TO_CHECK = 100; // Limit to avoid spending too long
  for await (const filePath of walkDirectory(workspaceRoot)) {
    if (filesProcessed >= MAX_FILES_TO_CHECK) {
      break;
    }
    try {
      const format = await getFormatForFile(filePath);
      // Only count text files
      if (!format.isBinaryFile) {
        const key = `${format.encoding}:${format.lineEnding}`;
        const existing = formatCounts.get(key);
        if (existing) {
          existing.count++;
          if (existing.count >= 3) {
            // Found at least 3 files with the same format
            return existing.format;
          }
        } else {
          formatCounts.set(key, {
            format,
            count: 1
          });
        }
      }
      filesProcessed++;
    } catch (_error) {}
  }
  // If we didn't find 3 matching files, return the most common format
  let mostCommon;
  for (const entry of formatCounts.values()) {
    if (!mostCommon || entry.count > mostCommon.count) {
      mostCommon = entry;
    }
  }
  if (mostCommon) {
    return mostCommon.format;
  }
  // Fallback: UTF-8 with LF (most common for modern projects)
  return getDefaultTextFormatForOS();
}
function determineLineEndingsForBuffer(buffer) {
  // Use statistical analysis to determine what percentage of line endings are CRLF
  let crlfCount = 0;
  let lfOnlyCount = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0x0a) {
      // Found LF (\n)
      if (i > 0 && buffer[i - 1] === 0x0d) {
        // Preceded by CR (\r), so this is CRLF
        crlfCount++;
      } else {
        // LF without preceding CR
        lfOnlyCount++;
      }
    }
  }
  // If we have no line endings at all, default to LF
  if (crlfCount === 0 && lfOnlyCount === 0) {
    return LineEnding.LF;
  }
  // Return CRLF if at least 5% of line endings are CRLF, otherwise LF
  const totalLineEndings = crlfCount + lfOnlyCount;
  const crlfPercentage = crlfCount / totalLineEndings * 100;
  return crlfPercentage >= 5 ? LineEnding.CRLF : LineEnding.LF;
}
function isBufferText(buffer) {
  const len = Math.min(4096, buffer.length);
  // Empty buffers are treated as text
  if (len === 0) {
    return true;
  }
  // Null bytes are a strong indicator of binary content
  for (let i = 0; i < len; i++) {
    if (buffer[i] === 0x00) {
      return false;
    }
  }
  // Count non-printable characters (excluding common whitespace)
  let nonPrintableCount = 0;
  for (let i = 0; i < len; i++) {
    const byte = buffer[i];
    // Allow common whitespace: tab (0x09), LF (0x0a), CR (0x0d)
    // Allow printable ASCII: 0x20-0x7E
    // Allow extended ASCII/UTF-8: >= 0x80
    if (byte < 0x20 && byte !== 0x09 && byte !== 0x0a && byte !== 0x0d) {
      nonPrintableCount++;
    }
  }
  // If more than 5% are non-printable control characters, likely binary
  const nonPrintablePercentage = nonPrintableCount / len * 100;
  return nonPrintablePercentage < 5;
}
function isBufferAnImage(buffer) {
  // Detect WebP, JPEG, PNG header formats
  if (buffer.length < 4) {
    return false;
  }
  // Check for PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a) {
    return true;
  }
  // Check for JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }
  // Check for WebP: RIFF....WEBP
  if (buffer.length >= 12 && buffer[0] === 0x52 &&
  // R
  buffer[1] === 0x49 &&
  // I
  buffer[2] === 0x46 &&
  // F
  buffer[3] === 0x46 &&
  // F
  buffer[8] === 0x57 &&
  // W
  buffer[9] === 0x45 &&
  // E
  buffer[10] === 0x42 &&
  // B
  buffer[11] === 0x50 // P
  ) {
    return true;
  }
  // Check for GIF: GIF8
  if (buffer.length >= 6 && buffer[0] === 0x47 &&
  // G
  buffer[1] === 0x49 &&
  // I
  buffer[2] === 0x46 &&
  // F
  buffer[3] === 0x38 && (
  // 8
  buffer[4] === 0x37 || buffer[4] === 0x39) &&
  // 7 or 9
  buffer[5] === 0x61 // a
  ) {
    return true;
  }
  return false;
}
async function readFirstBytes(file) {
  const fileHandle = await (0, promises_.open)(file, "r");
  try {
    // NB: It's "unsafe" because it doesn't zero the buffer. We don't care
    // because we're about to overwrite it anyways
    const buffer = Buffer.allocUnsafe(8192);
    const {
      bytesRead
    } = await fileHandle.read(buffer, 0, 8192, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await fileHandle.close();
  }
}
async function* walkDirectory(dir) {
  // NB: This isn't Ideal but we can't guarantee that we have a git repo
  const IGNORED_DIRS = new Set(["node_modules", ".git", ".svn", ".hg", "dist", "build", "out", ".next", ".cache", "coverage", "__pycache__", ".venv", "venv", ".turbo"]);
  try {
    const entries = await (0, promises_.readdir)(dir, {
      withFileTypes: true
    });
    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".gitignore") {
        continue; // Skip hidden files/dirs except .gitignore
      }
      const fullPath = (0, external_node_path_.join)(dir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) {
          yield* walkDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        yield fullPath;
      }
    }
  } catch (_error) {
    // Ignore permission errors or unreadable directories
    return;
  }
}
function getDefaultTextFormatForOS() {
  return {
    encoding: "utf8",
    lineEnding: false ? 0 : LineEnding.LF,
    isBinaryFile: false,
    isImageFile: false
  };
}
function detectUTF16Encoding(buffer) {
  if (buffer.length < 4) {
    return null;
  }
  // Check for UTF-16 BOM
  // UTF-16LE BOM: FF FE
  if (buffer[0] === 0xff && buffer[1] === 0xfe && !(buffer[2] === 0x00 && buffer[3] === 0x00)) {
    return "UTF-16LE";
  }
  // UTF-16BE BOM: FE FF
  if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    return "UTF-16BE";
  }
  // Check for UTF-16LE pattern: XX 00 where XX is printable ASCII
  let utf16LEMatches = 0;
  let utf16BEMatches = 0;
  const samplesToCheck = Math.min(50, Math.floor(buffer.length / 2));
  for (let i = 0; i < samplesToCheck * 2; i += 2) {
    if (i + 1 >= buffer.length) break;
    // UTF-16LE pattern: XX 00 (for basic ASCII)
    if (buffer[i + 1] === 0x00) {
      const char = buffer[i];
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf16LEMatches++;
      }
    }
    // UTF-16BE pattern: 00 XX (for basic ASCII)
    if (buffer[i] === 0x00) {
      const char = buffer[i + 1];
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf16BEMatches++;
      }
    }
  }
  // If more than 80% of the samples match UTF-16LE pattern, it's likely UTF-16LE
  if (utf16LEMatches > samplesToCheck * 0.8) {
    return "UTF-16LE";
  }
  // If more than 80% of the samples match UTF-16BE pattern, it's likely UTF-16BE
  if (utf16BEMatches > samplesToCheck * 0.8) {
    return "UTF-16BE";
  }
  return null;
}
function detectUTF32Encoding(buffer) {
  if (buffer.length < 8) {
    return null;
  }
  // Check for UTF-32 BOM
  // UTF-32BE BOM: 00 00 FE FF
  if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0xfe && buffer[3] === 0xff) {
    return "UTF-32BE";
  }
  // UTF-32LE BOM: FF FE 00 00
  if (buffer[0] === 0xff && buffer[1] === 0xfe && buffer[2] === 0x00 && buffer[3] === 0x00) {
    return "UTF-32LE";
  }
  // Check for UTF-32BE pattern: 00 00 00 XX where XX is printable ASCII
  // Count how many 4-byte sequences match the UTF-32BE pattern
  let utf32BEMatches = 0;
  let utf32LEMatches = 0;
  const samplesToCheck = Math.min(50, Math.floor(buffer.length / 4));
  for (let i = 0; i < samplesToCheck * 4; i += 4) {
    if (i + 3 >= buffer.length) break;
    // UTF-32BE pattern: 00 00 00 XX (for basic ASCII)
    if (buffer[i] === 0x00 && buffer[i + 1] === 0x00 && buffer[i + 2] === 0x00) {
      const char = buffer[i + 3];
      // Check if it's a printable ASCII or common whitespace
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf32BEMatches++;
      }
    }
    // UTF-32LE pattern: XX 00 00 00 (for basic ASCII)
    if (buffer[i + 1] === 0x00 && buffer[i + 2] === 0x00 && buffer[i + 3] === 0x00) {
      const char = buffer[i];
      // Check if it's a printable ASCII or common whitespace
      if (char >= 0x20 && char <= 0x7e || char === 0x09 || char === 0x0a || char === 0x0d) {
        utf32LEMatches++;
      }
    }
  }
  // If more than 80% of the samples match UTF-32BE pattern, it's likely UTF-32BE
  if (utf32BEMatches > samplesToCheck * 0.8) {
    return "UTF-32BE";
  }
  // If more than 80% of the samples match UTF-32LE pattern, it's likely UTF-32LE
  if (utf32LEMatches > samplesToCheck * 0.8) {
    return "UTF-32LE";
  }
  return null;
}
/**
 * Decodes binary content that may be base64-encoded or latin1-encoded.
 * This handles cases where binary data is passed as base64 to avoid
 * corruption through protobuf string serialization (which uses UTF-8).
 */
function decodeBinaryContent(content) {
  // Remove any whitespace that might have been introduced
  const cleanedContent = content.trim().replace(/\s/g, "");
  // Try base64 decoding first (most common case for binary data passed through protobuf)
  // Base64 strings contain only alphanumeric, +, /, = characters and are typically long
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  const MIN_BASE64_LENGTH = 50;
  const MIN_DECODED_RATIO = 0.5; // At least 50% of base64 length to account for padding
  if (cleanedContent.length > MIN_BASE64_LENGTH && base64Pattern.test(cleanedContent)) {
    try {
      const decoded = Buffer.from(cleanedContent, "base64");
      // Verify it decoded successfully and produced reasonable output
      // Base64 is ~4/3 the size of original, so decoded should be ~3/4 of base64 length
      if (decoded.length > 0) {
        const minExpectedLength = Math.floor(cleanedContent.length * MIN_DECODED_RATIO);
        if (decoded.length >= minExpectedLength) {
          return decoded;
        }
      }
    } catch {
      // If decoding fails, fall through to latin1 conversion
    }
  }
  // Fallback: convert latin1 string directly to buffer
  // (latin1 preserves byte values 0-255 exactly)
  // This handles cases where binary data was passed as latin1 string
  return Buffer.from(content, "latin1");
}
//# sourceMappingURL=file-utils.js.map