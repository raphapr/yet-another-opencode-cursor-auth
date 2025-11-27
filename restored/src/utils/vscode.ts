var vscode_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class SqliteDatabase extends sqlite3_default().Database {}
function getUserDataPath() {
  const home = external_node_os_default().homedir();
  if (isMacintosh) {
    return (0, external_node_path_.join)(home, "Library", "Application Support", "Cursor");
  } else if (isLinux) {
    return (0, external_node_path_.join)(process.env.XDG_CONFIG_HOME || external_node_path_default().join(home, ".config"), "cursor");
  } else if (isWindows) {
    // Windows: Use APPDATA environment variable or fallback to AppData\Roaming
    const appData = process.env.APPDATA || (0, external_node_path_.join)(home, "AppData", "Roaming");
    return (0, external_node_path_.join)(appData, "Cursor");
  } else {
    return undefined;
  }
}
function getAppSettingsHome() {
  const userDataPath = getUserDataPath();
  if (!userDataPath) {
    return undefined;
  }
  return (0, external_node_path_.join)(userDataPath, "User");
}
function getWorkspaceStorageHome() {
  const appSettingsHome = getAppSettingsHome();
  if (!appSettingsHome) {
    return undefined;
  }
  return (0, external_node_path_.join)(appSettingsHome, "workspaceStorage");
}
const isLinux = external_node_os_default().platform() === "linux";
const isMacintosh = external_node_os_default().platform() === "darwin";
const isWindows = external_node_os_default().platform() === "win32";
function getFolderId(folderPath, folderStat) {
  // Local: we use the ctime as extra salt to the
  // identifier so that folders getting recreated
  // result in a different identifier. However, if
  // the stat is not provided we return `undefined`
  // to ensure identifiers are stable for the given
  // URI.
  let ctime;
  if (isLinux) {
    ctime = folderStat.ino; // Linux: birthtime is ctime, so we cannot use it! We use the ino instead!
  } else if (isMacintosh) {
    ctime = folderStat.birthtime.getTime();
  } else if (isWindows) {
    if (typeof folderStat.birthtimeMs === "number") {
      ctime = Math.floor(folderStat.birthtimeMs); // Windows: fix precision issue in node.js 8.x to get 7.x results (see https://github.com/nodejs/node/issues/19897)
    } else {
      ctime = folderStat.birthtime.getTime();
    }
  }
  const r = (0, external_node_crypto_.createHash)("md5").update(folderPath).update(ctime ? String(ctime) : "").digest("hex"); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
  return r;
}
function getWorkspaceStorage(workspaceId) {
  const workspaceStorageHome = getWorkspaceStorageHome();
  if (!workspaceStorageHome) {
    return undefined;
  }
  return (0, external_node_path_.join)(workspaceStorageHome, workspaceId);
}
function getStateVscdbPath(workspaceId) {
  const workspaceStorage = getWorkspaceStorage(workspaceId);
  if (!workspaceStorage) {
    return undefined;
  }
  return (0, external_node_path_.join)(workspaceStorage, "state.vscdb");
}
class SqliteKvStore {
  constructor(db) {
    this.db = db;
  }
  get(key) {
    return vscode_awaiter(this, void 0, void 0, function* () {
      const value = yield new Promise((resolve, reject) => {
        this.db.get("SELECT value FROM ItemTable WHERE key = ?", [key], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      return value === null || value === void 0 ? void 0 : value.value;
    });
  }
}
function getWorkspaceKvStore(workspacePath) {
  return vscode_awaiter(this, void 0, void 0, function* () {
    let workspaceStat;
    try {
      workspaceStat = yield (0, promises_.stat)(workspacePath);
    } catch (_) {
      return undefined;
    }
    const workspaceId = getFolderId(workspacePath, workspaceStat);
    const stateVscdb = getStateVscdbPath(workspaceId);
    if (!stateVscdb) {
      return undefined;
    }
    if (!(0, external_node_fs_.existsSync)(stateVscdb)) {
      return undefined;
    }
    const db = new SqliteDatabase(stateVscdb);
    const kvStore = new SqliteKvStore(db);
    return kvStore;
  });
}
function getHash(str) {
  const hash = (0, external_node_crypto_.createHash)("sha256");
  hash.update(str);
  return hash.digest("hex");
}
function getLegacyRepoName(workspaceRoots) {
  // MUST NOT CHANGE WITHOUT A MIGRATION, EVER.
  // IT CHANGES THE KEY OF THE STATE THAT WE ARE STORING....
  // this is difficult to change because we don't want to force people to re-index all at once
  const sortedUris = workspaceRoots.sort((a, b) => a.fsPath.localeCompare(b.fsPath));
  const folderNames = sortedUris.map(root => external_node_path_default().basename(root.fsPath)).join("-");
  return `${getHash(sortedUris.map(root => root.fsPath).join("-"))}-${folderNames}`;
}