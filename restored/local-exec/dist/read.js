var read_addDisposableResource = undefined && undefined.__addDisposableResource || function (env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function () {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({
      value: value,
      dispose: dispose,
      async: async
    });
  } else if (async) {
    env.stack.push({
      async: true
    });
  }
  return value;
};
var read_disposeResources = undefined && undefined.__disposeResources || function (SuppressedError) {
  return function (env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r,
      s = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s |= 2, Promise.resolve(result).then(next, function (e) {
              fail(e);
              return next();
            });
          } else s |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
}(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
const MAX_IMAGE_DIMENSION = 2000;
async function resizeImageIfNeeded(path) {
  const buf = await (0, promises_.readFile)(path);
  const image = await esm /* Jimp */.dK.read(buf);
  const width = image.width;
  const height = image.height;
  // Check if resizing is needed
  if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
    return buf;
  }
  // Calculate new dimensions while maintaining aspect ratio
  let newWidth = width;
  let newHeight = height;
  if (width > height) {
    if (width > MAX_IMAGE_DIMENSION) {
      newWidth = MAX_IMAGE_DIMENSION;
      newHeight = Math.round(height * MAX_IMAGE_DIMENSION / width);
    }
  } else {
    if (height > MAX_IMAGE_DIMENSION) {
      newHeight = MAX_IMAGE_DIMENSION;
      newWidth = Math.round(width * MAX_IMAGE_DIMENSION / height);
    }
  }
  // Resize the image
  image.resize({
    w: newWidth,
    h: newHeight
  });
  let mimeType = "image/png";
  switch (image.mime) {
    case "image/png":
      mimeType = "image/png";
      break;
    case "image/bmp":
      mimeType = "image/bmp";
      break;
    case "image/tiff":
      mimeType = "image/tiff";
      break;
    case "image/x-ms-bmp":
      mimeType = "image/x-ms-bmp";
      break;
    case "image/gif":
      mimeType = "image/gif";
      break;
    case "image/jpeg":
      mimeType = "image/jpeg";
      break;
    default:
      mimeType = "image/png";
  }
  return await image.getBuffer(mimeType);
}
class LocalReadExecutor {
  constructor(permissionsService, workspacePath) {
    this.permissionsService = permissionsService;
    this.workspacePath = workspacePath;
  }
  async execute(ctx, args) {
    const env_1 = {
      stack: [],
      error: void 0,
      hasError: false
    };
    try {
      const _span = read_addDisposableResource(env_1, (0, dist /* createSpan */.VI)(ctx.withName("LocalReadExecutor.execute")), false);
      const filePath = args.path;
      const resolvedPath = resolvePath(filePath, this.workspacePath);
      const shouldBlock = await this.permissionsService.shouldBlockRead(resolvedPath);
      if (shouldBlock) {
        let message = `Read blocked by permissions settings`;
        switch (shouldBlock.type) {
          case "permissionsConfig":
            message = "Read blocked by permissions settings";
            break;
          case "cursorIgnore":
            message = `Read blocked by cursor ignore`;
            break;
          case "adminBlock":
            message = `Read blocked by admin repository block`;
            break;
        }
        return new read_exec_pb /* ReadResult */.sV({
          result: {
            case: "rejected",
            value: new read_exec_pb /* ReadRejected */.f4({
              path: resolvedPath,
              reason: message
            })
          }
        });
      }
      try {
        const stats = await (0, promises_.stat)(resolvedPath);
        if (stats.isDirectory()) {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "error",
              value: new read_exec_pb /* ReadError */.F_({
                path: resolvedPath,
                error: "Path is a directory, not a file"
              })
            }
          });
        }
        if (!stats.isFile()) {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "error",
              value: new read_exec_pb /* ReadError */.F_({
                path: resolvedPath,
                error: "Path is neither a file nor a directory"
              })
            }
          });
        }
        const contentInfo = await getFormatForFile(resolvedPath);
        // Check if the file is an image
        const isImage = contentInfo.isImageFile;
        if (isImage) {
          // Resize image if needed
          const resizedData = await resizeImageIfNeeded(resolvedPath);
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "success",
              value: new read_exec_pb /* ReadSuccess */.mE({
                path: resolvedPath,
                output: {
                  case: "data",
                  value: resizedData
                },
                totalLines: 0,
                fileSize: BigInt(stats.size),
                truncated: false
              })
            }
          });
        } else {
          // Read file as text
          const fullContent = await readText(resolvedPath);
          let content = fullContent;
          let truncated = false;
          // Truncate if content exceeds MAX_TEXT_SIZE
          if (content.length > MAX_TEXT_SIZE) {
            content = content.substring(0, MAX_TEXT_SIZE);
            truncated = true;
          }
          const totalLines = countLines(fullContent);
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "success",
              value: new read_exec_pb /* ReadSuccess */.mE({
                path: resolvedPath,
                output: {
                  case: "content",
                  value: content
                },
                totalLines: totalLines,
                fileSize: BigInt(stats.size),
                truncated: truncated
              })
            }
          });
        }
      } catch (error) {
        const err = error;
        if (err.code === "ENOENT") {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "fileNotFound",
              value: new read_exec_pb /* ReadFileNotFound */.Ko({
                path: resolvedPath
              })
            }
          });
        }
        if (err.code === "EACCES") {
          return new read_exec_pb /* ReadResult */.sV({
            result: {
              case: "permissionDenied",
              value: new read_exec_pb /* ReadPermissionDenied */.lW({
                path: resolvedPath
              })
            }
          });
        }
        return new read_exec_pb /* ReadResult */.sV({
          result: {
            case: "error",
            value: new read_exec_pb /* ReadError */.F_({
              path: resolvedPath,
              error: err instanceof Error ? err.message : "Unknown error occurred"
            })
          }
        });
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      read_disposeResources(env_1);
    }
  }
}
//# sourceMappingURL=read.js.map