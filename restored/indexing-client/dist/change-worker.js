var change_worker_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
var __asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};
const change_worker_logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:changeWorker");
function applyChanges(ctx, encryptionScheme, changes, basePath, updater) {
  return change_worker_awaiter(this, void 0, void 0, function* () {
    const fileUpdatePromises = [];
    for (const change of changes.items) {
      if (change instanceof AddChange) {
        change_worker_logger.info(ctx, "Applying change", {
          type: "add",
          relativePath: change.relativePath
        });
        const absolutePath = external_node_path_.join(basePath, change.relativePath);
        const contents = promises_.readFile(absolutePath, "utf-8");
        const encryptedRelativePath = encryptPath(change.relativePath, encryptionScheme);
        fileUpdatePromises.push(contents.then(contents => ({
          updateType: repository_pb /* FastUpdateFileV2Request_UpdateType */.dr.ADD,
          ancestorSpline: getAncestorSpline(encryptedRelativePath),
          partialPath: {
            case: "localFile",
            value: {
              unencryptedRelativeWorkspacePath: change.relativePath,
              hash: external_node_crypto_.createHash("sha256").update(contents).digest("hex"),
              file: {
                relativeWorkspacePath: encryptedRelativePath,
                contents
              }
            }
          }
        })));
      } else if (change instanceof DeleteChange) {
        fileUpdatePromises.push(Promise.resolve({
          updateType: repository_pb /* FastUpdateFileV2Request_UpdateType */.dr.DELETE,
          ancestorSpline: getAncestorSpline(change.encryptedRelativePath),
          partialPath: {
            case: "directory",
            value: {
              relativeWorkspacePath: change.encryptedRelativePath
            }
          }
        }));
      } else {
        throw new Error("Unknown change type");
      }
    }
    const fileUpdates = yield Promise.all(fileUpdatePromises);
    for (const fileUpdate of fileUpdates) {
      change_worker_logger.info(ctx, "Updating file", fileUpdate);
    }
    yield updater(ctx, fileUpdates);
  });
}
function changeWorker(ctx, asyncQueue, handler, batcher) {
  return change_worker_awaiter(this, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
      for (var _d = true, _e = __asyncValues(asyncQueue.createConsumer(batcher)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
        _c = _f.value;
        _d = false;
        const batch = _c;
        yield handler(ctx, batch);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  });
}