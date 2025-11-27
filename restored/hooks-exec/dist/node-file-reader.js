var node_file_reader_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

/**
 * Node.js implementation of FileReader using fs.promises.
 *
 * This implementation reads files from the local filesystem using Node.js APIs.
 */
class NodeFileReader {
  /**
   * Read a file and return its contents as a string.
   * Returns undefined if the file doesn't exist.
   */
  readFile(path) {
    return node_file_reader_awaiter(this, void 0, void 0, function* () {
      try {
        const content = yield promises_.readFile(path, "utf-8");
        return content;
      } catch (error) {
        // Return undefined if file doesn't exist
        if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
          return undefined;
        }
        // Re-throw other errors
        throw error;
      }
    });
  }
  /**
   * Check if a file exists at the given path.
   */
  exists(path) {
    return node_file_reader_awaiter(this, void 0, void 0, function* () {
      try {
        yield promises_.access(path);
        return true;
      } catch (_a) {
        return false;
      }
    });
  }
}