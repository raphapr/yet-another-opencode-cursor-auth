var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const MAX_HISTORY_LENGTH = 500;
// Sanitization helpers are shared from ../utils/characters.ts
function getHistoryFilePath() {
  const currentPlatform = (0, external_node_os_.platform)();
  switch (currentPlatform) {
    case "win32":
      {
        const appData = process.env.APPDATA || (0, external_node_path_.join)((0, external_node_os_.homedir)(), "AppData", "Roaming");
        return (0, external_node_path_.join)(appData, "Cursor", "prompt_history.json");
      }
    case "darwin":
      return (0, external_node_path_.join)((0, external_node_os_.homedir)(), ".cursor", "prompt_history.json");
    default:
      {
        const configDir = process.env.XDG_CONFIG_HOME || (0, external_node_path_.join)((0, external_node_os_.homedir)(), ".config");
        return (0, external_node_path_.join)(configDir, "cursor", "prompt_history.json");
      }
  }
}
function ensureDirExists(filePath) {
  return __awaiter(this, void 0, void 0, function* () {
    const dir = (0, external_node_path_.dirname)(filePath);
    try {
      yield external_node_fs_.promises.mkdir(dir, {
        recursive: true
      });
    } catch (_err) {
      // ignore
    }
  });
}
function loadHistory() {
  return __awaiter(this, void 0, void 0, function* () {
    const path = getHistoryFilePath();
    try {
      const data = yield external_node_fs_.promises.readFile(path, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const listRaw = parsed.filter(v => typeof v === "string");
        const seen = new Set();
        const sanitized = [];
        for (const item of listRaw) {
          const clean = (0, characters /* sanitizeForHistory */.p3)(item);
          if (clean.length === 0) continue;
          if (seen.has(clean)) continue;
          seen.add(clean);
          sanitized.push(clean);
        }
        return sanitized.slice(0, MAX_HISTORY_LENGTH);
      }
      return [];
    } catch (_err) {
      return [];
    }
  });
}
function saveHistory(items) {
  return __awaiter(this, void 0, void 0, function* () {
    const path = getHistoryFilePath();
    yield ensureDirExists(path);
    // Ensure all items are sanitized before persisting
    const seen = new Set();
    const list = [];
    for (const item of items) {
      const clean = (0, characters /* sanitizeForHistory */.p3)(item);
      if (clean.length === 0) continue;
      if (seen.has(clean)) continue;
      seen.add(clean);
      list.push(clean);
      if (list.length >= MAX_HISTORY_LENGTH) break;
    }
    const payload = JSON.stringify(list, null, 2);
    yield external_node_fs_.promises.writeFile(path, payload, "utf8");
  });
}
function addToHistory(entryRaw) {
  return __awaiter(this, void 0, void 0, function* () {
    const entry = (0, characters /* sanitizeForHistory */.p3)(entryRaw);
    if (entry.length === 0) return yield loadHistory();
    let items = yield loadHistory();
    // Remove existing occurrences (dedup), then unshift to front (MRU order)
    items = items.filter(e => e !== entry);
    items.unshift(entry);
    if (items.length > MAX_HISTORY_LENGTH) items = items.slice(0, MAX_HISTORY_LENGTH);
    yield saveHistory(items);
    return items;
  });
}
function clearHistory() {
  return __awaiter(this, void 0, void 0, function* () {
    const before = yield loadHistory();
    yield saveHistory([]);
    return before.length;
  });
}