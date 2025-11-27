/**
 * A wrapper around file:/// URLs that provides serialization/deserialization
 * and convenient conversion between file paths and file URLs.
 */
class FileURL {
  /**
   * Creates a FileUrl instance from a file path or file:// URL string
   */
  constructor(pathOrUrl) {
    if (pathOrUrl.startsWith("file://")) {
      // Validate that this is actually a file:// URL
      if (!this.isValidFileUrl(pathOrUrl)) {
        throw new Error(`Invalid file URL: ${pathOrUrl}`);
      }
      this.urlString = pathOrUrl;
    } else {
      // Convert file path to file:// URL
      const absolutePath = this.resolvePath(pathOrUrl);
      this.urlString = this.pathToFileUrl(absolutePath);
    }
  }
  /**
   * Validates that a string is a proper file:// URL
   */
  isValidFileUrl(str) {
    try {
      const url = new URL(str);
      return url.protocol === "file:";
    } catch (_a) {
      return false;
    }
  }
  /**
   * Resolves a relative path to an absolute path
   */
  resolvePath(path) {
    // Handle Windows paths
    if (path.includes("\\")) {
      path = path.replace(/\\/g, "/");
    }
    // If already absolute on Windows (starts with drive letter) or Unix (starts with /)
    if (/^[a-zA-Z]:\//.test(path) || /^\//.test(path)) {
      return path;
    }
    // For relative paths, we'll assume they're relative to current directory
    // This is a simplified resolution that doesn't handle complex cases
    // but avoids Node.js dependency
    const parts = path.split("/");
    const resolved = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === "..") {
        resolved.pop();
      } else if (part !== "." && part !== "") {
        resolved.push(part);
      }
    }
    if (resolved.length === 0) {
      return ".";
    }
    return `/${resolved.join("/")}`;
  }
  /**
   * Converts a file path to file:// URL
   */
  pathToFileUrl(filePath) {
    // Handle Windows paths
    if (/^[a-zA-Z]:\//.test(filePath)) {
      // Windows path like "C:/path/to/file"
      const drive = filePath.charAt(0).toLowerCase();
      const path = filePath.substring(2).replace(/\\/g, "/");
      return `file:///${drive}:${path}`;
    }
    // Unix-like path
    if (!filePath.startsWith("/")) {
      filePath = `/${filePath}`;
    }
    // Encode special characters, but keep the path structure
    const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, "/");
    return `file://${encodedPath}`;
  }
  /**
   * Converts file:// URL to file path
   */
  fileUrlToPath(urlString) {
    try {
      const url = new URL(urlString);
      // Handle Windows paths
      if (url.pathname.startsWith("/") && /^\/[a-zA-Z]:\//.test(url.pathname)) {
        // Windows path in URL like file:///c:/path/to/file
        const drive = url.pathname[1].toUpperCase();
        const pathPart = url.pathname.substring(3); // Remove "/c:" part
        return `${drive}:${pathPart}`;
      }
      // Unix-like path
      const path = decodeURIComponent(url.pathname);
      // Unix paths should already have the leading slash from pathname
      return path;
    } catch (_a) {
      throw new Error(`Invalid file URL format: ${urlString}`);
    }
  }
  get fsPath() {
    return this.toPath();
  }
  /**
   * Creates a FileUrl from a file path
   */
  static fromPath(filePath) {
    return new FileURL(filePath);
  }
  /**
   * Creates a FileUrl from a file:// URL string
   */
  static fromUrl(fileUrl) {
    if (!fileUrl.startsWith("file://")) {
      throw new Error(`Expected file:// URL, got: ${fileUrl}`);
    }
    return new FileURL(fileUrl);
  }
  /**
   * Deserializes a FileUrl from a string (same as constructor)
   */
  static fromString(str) {
    return new FileURL(str);
  }
  /**
   * Returns the file path (without file:// protocol)
   */
  toPath() {
    return this.fileUrlToPath(this.urlString);
  }
  /**
   * Returns the full file:// URL as a string
   */
  toString() {
    return this.urlString;
  }
  /**
   * Serializes to string (same as toString)
   */
  serialize() {
    return this.toString();
  }
  /**
   * Returns the underlying URL object
   */
  toURL() {
    try {
      return new URL(this.urlString);
    } catch (_a) {
      throw new Error(`Invalid URL format: ${this.urlString}`);
    }
  }
  /**
   * Returns the filename (last segment of the path)
   */
  getFilename() {
    const path = this.toPath();
    const pathSeparator = path.includes("\\") ? "\\" : "/";
    return path.split(pathSeparator).pop() || "";
  }
  /**
   * Returns the directory path
   */
  getDirectory() {
    const path = this.toPath();
    const pathSeparator = path.includes("\\") ? "\\" : "/";
    const lastSeparatorIndex = path.lastIndexOf(pathSeparator);
    if (lastSeparatorIndex === -1) {
      return path;
    }
    return path.substring(0, lastSeparatorIndex);
  }
  /**
   * Checks if two FileUrl instances are equal
   */
  equals(other) {
    return this.urlString === other.urlString;
  }
  /**
   * JSON serialization support
   */
  toJSON() {
    return this.toString();
  }
}
/**
 * Utility functions for working with file URLs
 */
const fileUrlUtils = {
  /**
   * Checks if a string is a valid file:// URL
   */
  isFileUrl(str) {
    return str.startsWith("file://");
  },
  /**
   * Converts a file path to file:// URL string
   */
  pathToUrl(filePath) {
    return new FileURL(filePath).toString();
  },
  /**
   * Converts a file:// URL string to file path
   */
  urlToPath(fileUrl) {
    return new FileURL(fileUrl).toPath();
  }
};
//# sourceMappingURL=file-url.js.map