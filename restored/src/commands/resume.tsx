__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */$0: () => (/* binding */getLatestChatId),
      /* harmony export */oh: () => (/* binding */handleResume),
      /* harmony export */xT: () => (/* binding */getNthRecentChatId)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs");
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/unified-list-pager.tsx");
    /* harmony import */
    var _state_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/state/index.ts");
    /* harmony import */
    var _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/state/sqlite-blob-store.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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

    // import { ChatPicker } from "../components/ChatPicker.js";

    function handleResume(client) {
      return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
          const handleSelectChat = chatName => {
            app.unmount();
            resolve({
              kind: "chat",
              id: chatName
            });
          };
          const handleSelectBackground = bcId => {
            app.unmount();
            resolve({
              kind: "background",
              id: bcId
            });
          };
          const handleExit = () => {
            app.unmount();
            resolve(null);
          };
          const app = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .render */.XX)((0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_unified_list_pager_js__WEBPACK_IMPORTED_MODULE_4__ /* .UnifiedListPager */.W, {
            client: client,
            onClose: handleExit,
            onSelectChat: handleSelectChat,
            onSelectBackground: handleSelectBackground
          }));
        });
      });
    }
    function getLatestChatId() {
      return __awaiter(this, void 0, void 0, function* () {
        const id = yield getNthRecentChatId(1);
        return id;
      });
    }
    /**
     * Returns the nth most recent chat id (1 = latest), sorted by creation time.
     * Creation time is determined similarly to UnifiedListPager:
     * - Prefer DB metadata `createdAt` if present
     * - Otherwise fall back to the earliest of directory/db birthtime (or mtime if birthtime missing)
     */
    function getNthRecentChatId(n) {
      return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
          if (!Number.isFinite(n) || n <= 0) return null;
          const root = (0, _state_index_js__WEBPACK_IMPORTED_MODULE_5__ /* .getChatsRootDir */.r)();
          const entries = (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.readdirSync)(root, {
            withFileTypes: true
          });
          const infos = yield Promise.all(entries.filter(e => e.isDirectory()).map(e => __awaiter(this, void 0, void 0, function* () {
            const chatPath = (0, node_path__WEBPACK_IMPORTED_MODULE_2__.join)(root, e.name);
            try {
              const dbPath = (0, node_path__WEBPACK_IMPORTED_MODULE_2__.join)(chatPath, "store.db");
              // Compute FS-based createdAt as the minimum of db file and dir birth/mod times
              let createdAtFsMs = Number.MAX_SAFE_INTEGER;
              try {
                const dbStat = (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.statSync)(dbPath);
                const dbBirthOrMod = Math.floor(dbStat.birthtimeMs || dbStat.mtimeMs);
                if (dbBirthOrMod > 0) {
                  createdAtFsMs = Math.min(createdAtFsMs, dbBirthOrMod);
                }
              } catch (_a) {
                /* ignore */
              }
              try {
                const dirStat = (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.statSync)(chatPath);
                const dirBirthOrMod = Math.floor(dirStat.birthtimeMs || dirStat.mtimeMs);
                if (dirBirthOrMod > 0) {
                  createdAtFsMs = Math.min(createdAtFsMs, dirBirthOrMod);
                }
              } catch (_b) {
                /* ignore */
              }
              if (createdAtFsMs === Number.MAX_SAFE_INTEGER) createdAtFsMs = 0;
              // Check DB metadata and validity (non-empty latestRootBlobId)
              const sqlite = yield _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_6__ /* .SQLiteBlobStoreWithMetadata */.M.initAndLoad(dbPath);
              const latestRootBlobId = sqlite.get("latestRootBlobId");
              if (!latestRootBlobId || latestRootBlobId.length === 0) return null;
              const createdAtMeta = sqlite.get("createdAt");
              const createdAtMs = normalizeTimestampToMs(createdAtMeta && Number.isFinite(createdAtMeta) ? createdAtMeta : createdAtFsMs);
              return {
                name: e.name,
                createdAtMs
              };
            } catch (_c) {
              return null;
            }
          })));
          const valid = infos.filter(x => x !== null);
          valid.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
          const idx = Math.max(0, Math.min(valid.length - 1, n - 1));
          return (_b = (_a = valid[idx]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
        } catch (_c) {
          return null;
        }
      });
    }
    const normalizeTimestampToMs = n => {
      const v = typeof n === "number" ? n : 0;
      if (!(v > 0) || !Number.isFinite(v)) return 0;
      if (v < 1e11) return Math.floor(v * 1000); // seconds -> ms
      if (v >= 1e14 && v < 1e17) return Math.floor(v / 1000); // microseconds -> ms
      if (v >= 1e17) return Math.floor(v / 1000000); // nanoseconds -> ms
      return Math.floor(v); // milliseconds
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/