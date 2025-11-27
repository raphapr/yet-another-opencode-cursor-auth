__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */W: () => (/* binding */UnifiedListPager)
      /* harmony export */
    });
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
    /* harmony import */
    var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../agent-kv/dist/index.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../proto/dist/generated/aiserver/v1/background_composer_pb.js");
    /* harmony import */
    var chalk__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../../node_modules/.pnpm/chalk@5.4.1/node_modules/chalk/source/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/hooks/use-screen-size.ts");
    /* harmony import */
    var _state_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/state/index.ts");
    /* harmony import */
    var _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/state/sqlite-blob-store.ts");
    /* harmony import */
    var _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/utils/characters.ts");
    /* harmony import */
    var _utils_git_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/utils/git.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_7__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
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

    // Note: avoid animation ticks here to prevent flicker
    // and keep the UI static except for selection changes

    const calculateDiffStatsFromOptimized = detailed => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      if (!detailed) return undefined;
      let totalAdded = 0;
      let totalRemoved = 0;
      // Top-level diffs
      const topLevelDiffs = (_b = (_a = detailed.diff) === null || _a === void 0 ? void 0 : _a.diffs) !== null && _b !== void 0 ? _b : [];
      for (const fd of topLevelDiffs) {
        totalAdded += Math.max(0, (_c = fd.added) !== null && _c !== void 0 ? _c : 0);
        totalRemoved += Math.max(0, (_d = fd.removed) !== null && _d !== void 0 ? _d : 0);
      }
      // Submodule diffs
      const submoduleDiffs = (_e = detailed.submoduleDiffs) !== null && _e !== void 0 ? _e : [];
      for (const sm of submoduleDiffs) {
        if (sm.errored) continue;
        const sdiffs = (_g = (_f = sm.diff) === null || _f === void 0 ? void 0 : _f.diffs) !== null && _g !== void 0 ? _g : [];
        for (const fd of sdiffs) {
          totalAdded += Math.max(0, (_h = fd.added) !== null && _h !== void 0 ? _h : 0);
          totalRemoved += Math.max(0, (_j = fd.removed) !== null && _j !== void 0 ? _j : 0);
        }
      }
      return totalAdded > 0 || totalRemoved > 0 ? {
        totalAdded,
        totalRemoved
      } : undefined;
    };
    const normalizeTimestampMs = ts => {
      const n = typeof ts === "number" ? ts : 0;
      if (n <= 0 || !Number.isFinite(n)) return 0;
      // Heuristics:
      // < 1e11: seconds
      // 1e11..1e14: milliseconds
      // 1e14..1e17: microseconds
      // >= 1e17: nanoseconds
      if (n < 1e11) return Math.floor(n * 1000); // seconds -> ms
      if (n >= 1e14 && n < 1e17) return Math.floor(n / 1000); // microseconds -> ms
      if (n >= 1e17) return Math.floor(n / 1000000); // nanoseconds -> ms
      return Math.floor(n); // milliseconds already
    };
    const UnifiedListPager = ({
      client,
      onClose,
      onSelectChat,
      onSelectBackground
    }) => {
      var _a, _b, _c, _d;
      const DIFF_STATS_TIMEOUT_MS = 10000;
      // repo filters now provided by util
      const fetchDiffStatsWithTimeout = (0, react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(bcId => __awaiter(void 0, void 0, void 0, function* () {
        if (!client) return undefined;
        let timeoutId;
        const timeoutPromise = new Promise(resolve => {
          timeoutId = setTimeout(() => resolve(undefined), DIFF_STATS_TIMEOUT_MS);
        });
        const detailsPromise = (() => __awaiter(void 0, void 0, void 0, function* () {
          try {
            return yield client.getOptimizedDiffDetails({
              bcId
            });
          } catch (_a) {
            return undefined;
          }
        }))();
        const winner = yield Promise.race([detailsPromise, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);
        if (!winner) return undefined;
        return calculateDiffStatsFromOptimized(winner);
      }), [client]);
      const [items, setItems] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
      const [active, setActive] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
      const [scrollTop, setScrollTop] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
      const [loading, setLoading] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(true);
      // Numeric prefix buffer for motions (e.g., 5j / 10↓ / 2Ctrl-F)
      const [commandBuffer, setCommandBuffer] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)("");
      // Deletion confirmation state
      const [confirmActive, setConfirmActive] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
      const [confirmIndex, setConfirmIndex] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(0); // 0 = continue, 1 = cancel
      const [confirmTitle, setConfirmTitle] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)("");
      const [confirmDetail, setConfirmDetail] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(undefined);
      const [continueLabel, setContinueLabel] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)("Continue");
      const [cancelLabel, setCancelLabel] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)("Cancel");
      const [pendingDelete, setPendingDelete] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(null);
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .useStdout */.t$)();
      const screen = (0, _hooks_use_screen_size_js__WEBPACK_IMPORTED_MODULE_7__ /* .useScreenSize */.l)();
      (0, react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
        if (!stdout) return;
        try {
          stdout.write("\x1b[?1049h\x1b[?7l\x1b[?1h\x1b=");
        } catch (_a) {
          // ignore terminal control errors
        }
        return () => {
          try {
            stdout.write("\x1b[?1l\x1b>\x1b[?7h\x1b[?1049l");
          } catch (_a) {
            // ignore terminal control errors
          }
        };
      }, [stdout]);
      (0, react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
        let cancelled = false;
        void (() => __awaiter(void 0, void 0, void 0, function* () {
          var _a;
          try {
            // Load background composers (feature gated)
            let backgrounds = [];
            if (client && _constants_js__WEBPACK_IMPORTED_MODULE_6__ /* .BACKGROUND_ENABLED */.xZ) {
              try {
                const filters = (0, _utils_git_js__WEBPACK_IMPORTED_MODULE_10__ /* .getRepoUrlFilters */.X)();
                const resp = yield client.listBackgroundComposers({
                  n: 32,
                  includeStatus: true,
                  preferredRepoUrl: filters.preferredRepoUrl,
                  additionalRepoUrls: filters.additionalRepoUrls
                });
                const rawBackgrounds = ((_a = resp.composers) !== null && _a !== void 0 ? _a : []).map(c => {
                  var _a, _b, _c, _d, _e, _f, _g;
                  return {
                    kind: "background",
                    id: (_a = c.bcId) !== null && _a !== void 0 ? _a : "",
                    name: c.name || "Background Agent",
                    repoUrl: (_b = c.repoUrl) !== null && _b !== void 0 ? _b : "",
                    branch: (_c = c.branchName) !== null && _c !== void 0 ? _c : "",
                    status: (_d = c.status) !== null && _d !== void 0 ? _d : _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .BackgroundComposerStatus */.R6.UNSPECIFIED,
                    // Prefer createdAt for background agents per request; fallback to updatedAt
                    updatedAtMs: normalizeTimestampMs((_f = (_e = c.createdAtMs) !== null && _e !== void 0 ? _e : c.updatedAtMs) !== null && _f !== void 0 ? _f : 0),
                    isArchived: (_g = c.isArchived) !== null && _g !== void 0 ? _g : false
                  };
                }).filter(r => r.id.length > 0 && !r.isArchived);
                // Do not block on diff stats; set base backgrounds first
                backgrounds = rawBackgrounds;
              } catch (_b) {
                backgrounds = [];
              }
            }
            // Load chat sessions
            let chats = [];
            try {
              const root = (0, _state_index_js__WEBPACK_IMPORTED_MODULE_8__ /* .getChatsRootDir */.r)();
              const entries = (0, node_fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync)(root, {
                withFileTypes: true
              });
              const infos = yield Promise.all(entries.filter(e => e.isDirectory()).map(e => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                try {
                  const chatPath = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)(root, e.name);
                  const dbPath = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)(chatPath, "store.db");
                  // Determine createdAt for chats. Prefer metadata.createdAt; fall back to FS birth times.
                  let createdAtFsMs = Number.MAX_SAFE_INTEGER;
                  try {
                    const dbStat = (0, node_fs__WEBPACK_IMPORTED_MODULE_0__.statSync)(dbPath);
                    const dbBirthOrMod = Math.floor(dbStat.birthtimeMs || dbStat.mtimeMs);
                    if (dbBirthOrMod > 0) {
                      createdAtFsMs = Math.min(createdAtFsMs, dbBirthOrMod);
                    }
                  } catch (_c) {
                    void 0;
                  }
                  try {
                    const dirStat = (0, node_fs__WEBPACK_IMPORTED_MODULE_0__.statSync)(chatPath);
                    const dirBirthOrMod = Math.floor(dirStat.birthtimeMs || dirStat.mtimeMs);
                    if (dirBirthOrMod > 0) {
                      createdAtFsMs = Math.min(createdAtFsMs, dirBirthOrMod);
                    }
                  } catch (_d) {
                    void 0;
                  }
                  if (createdAtFsMs === Number.MAX_SAFE_INTEGER) {
                    createdAtFsMs = 0;
                  }
                  // Now open DB to get name/metadata
                  const sqlite = yield _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_9__ /* .SQLiteBlobStoreWithMetadata */.M.initAndLoad(dbPath);
                  const name = (_a = sqlite.get("name")) !== null && _a !== void 0 ? _a : (0, _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ /* .getDefaultAgentMetadata */.sh)().name;
                  const latestRootBlobId = sqlite.get("latestRootBlobId");
                  if (!latestRootBlobId || latestRootBlobId.length === 0) {
                    return null;
                  }
                  // Prefer DB metadata createdAt if present
                  let createdAtMs = normalizeTimestampMs((_b = sqlite.get("createdAt")) !== null && _b !== void 0 ? _b : 0);
                  if (!createdAtMs) {
                    createdAtMs = normalizeTimestampMs(createdAtFsMs);
                  }
                  const item = {
                    kind: "chat",
                    id: e.name,
                    name,
                    // We store createdAt in the unified timestamp field for sorting/display
                    updatedAtMs: createdAtMs
                  };
                  return item;
                } catch (_e) {
                  return null;
                }
              })));
              const nonNullInfos = infos.filter(x => x !== null);
              chats = nonNullInfos;
            } catch (_c) {
              chats = [];
            }
            const combined = [...backgrounds, ...chats].sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0));
            if (!cancelled) {
              setItems(combined);
            }
            // Fetch diff stats asynchronously and merge results (feature gated)
            if (client && _constants_js__WEBPACK_IMPORTED_MODULE_6__ /* .BACKGROUND_ENABLED */.xZ) {
              void (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                  const bgItems = combined.filter(it => it.kind === "background");
                  if (bgItems.length === 0) return;
                  const results = yield Promise.allSettled(bgItems.map(bg => __awaiter(void 0, void 0, void 0, function* () {
                    const stats = yield fetchDiffStatsWithTimeout(bg.id);
                    return {
                      id: bg.id,
                      stats
                    };
                  })));
                  if (cancelled) return;
                  const idToStats = new Map();
                  for (const r of results) {
                    if (r.status === "fulfilled") {
                      idToStats.set(r.value.id, r.value.stats);
                    }
                  }
                  setItems(prev => prev.map(it => {
                    if (it.kind !== "background") return it;
                    const s = idToStats.get(it.id);
                    if (!s) return it;
                    return Object.assign(Object.assign({}, it), {
                      totalAdded: s.totalAdded,
                      totalRemoved: s.totalRemoved
                    });
                  }));
                } catch (_a) {
                  // ignore
                }
              }))();
            }
          } finally {
            if (!cancelled) setLoading(false);
          }
        }))();
        return () => {
          cancelled = true;
        };
      }, [client, fetchDiffStatsWithTimeout]);
      const termWidth = (_b = (_a = screen === null || screen === void 0 ? void 0 : screen.width) !== null && _a !== void 0 ? _a : stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _b !== void 0 ? _b : 80;
      const termHeight = (_d = (_c = screen === null || screen === void 0 ? void 0 : screen.height) !== null && _c !== void 0 ? _c : stdout === null || stdout === void 0 ? void 0 : stdout.rows) !== null && _d !== void 0 ? _d : 24;
      // Match ChatPicker layout: 3-line header + 2-line footer
      const listStartRow = 4;
      const contentHeight = Math.max(1, termHeight - 6);
      // Clamp selection/scroll when items load or screen size changes
      (0, react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
        if (items.length === 0) {
          // Always reset to sane defaults when empty
          setActive(0);
          setScrollTop(0);
          return;
        }
        setActive(a => Math.max(0, Math.min(a, items.length - 1)));
        setScrollTop(s => {
          const maxTop = Math.max(0, items.length - contentHeight);
          return Math.max(0, Math.min(s, maxTop));
        });
      }, [items.length, contentHeight]);
      (0, react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
        if (active < scrollTop) setScrollTop(active);else if (active >= scrollTop + contentHeight) setScrollTop(Math.max(0, active - contentHeight + 1));
      }, [active, contentHeight, scrollTop]);
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .useInput */.Ge)((input, key) => {
        // Handle confirmation modal interactions first
        if (confirmActive) {
          if (key.downArrow || input === "j" || input === "J") {
            setConfirmIndex(i => Math.min(1, i + 1));
            return;
          }
          if (key.upArrow || input === "k" || input === "K") {
            setConfirmIndex(i => Math.max(0, i - 1));
            return;
          }
          if (key.ctrl && input === "d") {
            onClose();
            return;
          }
          if (key.escape || key.ctrl && input === "c" || input === "n" || input === "N" || input === "q" || input === "Q") {
            setConfirmActive(false);
            setPendingDelete(null);
            setConfirmIndex(0);
            return;
          }
          if (key.return || input === "y" || input === "Y") {
            const accept = confirmIndex === 0 || input === "y" || input === "Y";
            const target = pendingDelete;
            setConfirmActive(false);
            setPendingDelete(null);
            setConfirmIndex(0);
            if (accept && target) {
              const {
                index,
                item
              } = target;
              if (item.kind === "chat") {
                try {
                  const dir = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)((0, _state_index_js__WEBPACK_IMPORTED_MODULE_8__ /* .getChatsRootDir */.r)(), item.id);
                  (0, node_fs__WEBPACK_IMPORTED_MODULE_0__.rmSync)(dir, {
                    recursive: true,
                    force: true
                  });
                } catch (_a) {
                  // ignore deletion errors
                }
                setItems(prev => prev.filter((_, i) => i !== index));
              } else {
                // background: optimistic remove, then archive via client
                setItems(prev => prev.filter((_, i) => i !== index));
                void (() => __awaiter(void 0, void 0, void 0, function* () {
                  var _a;
                  try {
                    yield (_a = client === null || client === void 0 ? void 0 : client.archiveBackgroundComposer) === null || _a === void 0 ? void 0 : _a.call(client, {
                      bcId: item.id
                    });
                  } catch (_b) {
                    // ignore errors; item already removed optimistically
                  }
                }))();
              }
            }
            return;
          }
          // consume other keys while active
          return;
        }
        if (key.ctrl && input === "d" || key.ctrl && input === "c" || key.escape || input === "q") {
          setCommandBuffer("");
          onClose();
          return;
        }
        // Build count from numeric prefix (default 1)
        if (/^[0-9]$/.test(input)) {
          setCommandBuffer(prev => (prev + input).replace(/^0+/, ""));
          return;
        }
        if (key.backspace || key.delete) {
          if (commandBuffer.length > 0) {
            setCommandBuffer(prev => prev.slice(0, -1));
            return;
          }
          // Initiate delete for selected item
          const listReady = items.length > 0 && !loading;
          if (!listReady) return;
          const target = items[active];
          if (!target) return;
          setConfirmIndex(0);
          if (target.kind === "chat") {
            setConfirmTitle("Delete session?");
            setConfirmDetail(`This will permanently remove the local session “${target.name}”.`);
            setContinueLabel("Delete");
            setCancelLabel("Cancel");
          } else {
            setConfirmTitle("Delete background agent?");
            setConfirmDetail(`This will remove “${target.name}” from the list.`);
            setContinueLabel("Delete");
            setCancelLabel("Cancel");
          }
          setPendingDelete({
            index: active,
            item: target
          });
          setConfirmActive(true);
          return;
        }
        const getCount = () => {
          const n = parseInt(commandBuffer || "1", 10);
          return Number.isFinite(n) && n > 0 ? n : 1;
        };
        const clearCount = () => setCommandBuffer("");
        // If list isn't ready, ignore navigation keys to avoid invalid state
        const listReady = items.length > 0 && !loading;
        if (key.upArrow || input === "k") {
          if (!listReady) return;
          const count = getCount();
          clearCount();
          setActive(a => Math.max(0, a - count));
          return;
        }
        if (key.downArrow || input === "j") {
          if (!listReady) return;
          const count = getCount();
          clearCount();
          setActive(a => Math.min(items.length - 1, a + count));
          return;
        }
        // Page navigation (ctrl-f / ctrl-b)
        if (key.ctrl && input === "f") {
          if (!listReady) return;
          const count = getCount();
          clearCount();
          const delta = count * Math.max(1, contentHeight - 1);
          setActive(a => Math.min(items.length - 1, a + delta));
          setScrollTop(s => Math.min(Math.max(0, items.length - contentHeight), s + delta));
          return;
        }
        if (key.ctrl && input === "b") {
          if (!listReady) return;
          const count = getCount();
          clearCount();
          const delta = count * Math.max(1, contentHeight - 1);
          setActive(a => Math.max(0, a - delta));
          setScrollTop(s => Math.max(0, s - delta));
          return;
        }
        // Home / End (g / G)
        if (input === "g") {
          if (!listReady) return;
          clearCount();
          setActive(0);
          setScrollTop(0);
          return;
        }
        if (input === "G") {
          if (!listReady) return;
          const hadBuffer = commandBuffer.length > 0;
          const count = getCount();
          clearCount();
          if (hadBuffer) {
            const target = Math.max(0, Math.min(items.length - 1, count - 1));
            setActive(target);
            setScrollTop(_s => {
              const maxTop = Math.max(0, items.length - contentHeight);
              return Math.max(0, Math.min(maxTop, target - Math.floor(contentHeight / 2)));
            });
          } else {
            const lastIndex = Math.max(0, items.length - 1);
            setActive(lastIndex);
            setScrollTop(Math.max(0, items.length - contentHeight));
          }
          return;
        }
        // PageUp/PageDown with count if available
        const kpd = key;
        if (kpd.pageDown) {
          if (!listReady) return;
          const count = getCount();
          clearCount();
          const delta = count * Math.max(1, contentHeight - 1);
          setActive(a => Math.min(items.length - 1, a + delta));
          setScrollTop(s => Math.min(Math.max(0, items.length - contentHeight), s + delta));
          return;
        }
        if (kpd.pageUp) {
          if (!listReady) return;
          const count = getCount();
          clearCount();
          const delta = count * Math.max(1, contentHeight - 1);
          setActive(a => Math.max(0, a - delta));
          setScrollTop(s => Math.max(0, s - delta));
          return;
        }
        if (key.return) {
          clearCount();
          const picked = items[active];
          if (!picked) return;
          if (picked.kind === "chat") onSelectChat === null || onSelectChat === void 0 ? void 0 : onSelectChat(picked.id);else onSelectBackground === null || onSelectBackground === void 0 ? void 0 : onSelectBackground(picked.id);
          return;
        }
      });
      (0, react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f;
        if (!stdout) return;
        // Use chalk for color; it respects terminal capabilities
        const visibleLength = text => (0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(text).length;
        const truncateEndPlain = (text, width) => {
          const t = text.trim();
          if (width <= 0) return "";
          if (t.length <= width) return t;
          if (width <= 3) return t.slice(0, width);
          return `${t.slice(0, Math.max(0, width - 3))}...`;
        };
        const firstLine = text => {
          const s = typeof text === "string" ? text : "";
          const idx = s.indexOf("\n");
          if (idx === -1) return s.replace(/\r/g, "");
          return s.slice(0, idx).replace(/\r/g, "");
        };
        // If a confirmation modal is active, draw only the modal to reduce flicker and return
        if (confirmActive) {
          const title = confirmTitle;
          const detail = confirmDetail;
          const options = [{
            label: continueLabel,
            hint: "y"
          }, {
            label: cancelLabel,
            hint: "esc/n"
          }];
          const maxWidth = Math.max(28, Math.min(60, termWidth - 12));
          // inner content area excludes 2 borders + 2 side paddings
          const contentWidth = Math.max(8, maxWidth - 4);
          const trunc = t => {
            const s = (t !== null && t !== void 0 ? t : "").trim();
            if (visibleLength(s) <= contentWidth) return s;
            return `${(0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(s).slice(0, Math.max(0, contentWidth - 3))}...`;
          };
          const titleLine = trunc(title);
          const detailLine = detail ? trunc(detail) : undefined;
          const optionLines = options.map((opt, idx) => {
            const isActiveRow = idx === confirmIndex;
            const arrowChar = isActiveRow ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white("→") : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(" ");
            const availableTextCols = Math.max(0, contentWidth - 2); // arrow(1) + space(1)
            const raw = `${opt.label}${opt.hint ? ` ${opt.hint}` : ""}`;
            const plain = (0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(raw);
            const truncated = plain.length > availableTextCols ? `${plain.slice(0, Math.max(0, availableTextCols - 3))}...` : plain;
            const labelLen = opt.label.length;
            const truncLabel = truncated.slice(0, Math.min(labelLen, truncated.length));
            const truncHint = truncated.slice(truncLabel.length);
            const coloredLabel = isActiveRow ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white.bold(truncLabel) : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(truncLabel);
            const coloredHint = truncHint.length > 0 ? isActiveRow ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white.dim(truncHint) : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(truncHint) : "";
            const content = `${arrowChar} ${coloredLabel}${coloredHint}`;
            return content;
          });
          const contentLines = [chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white.bold(titleLine), ...(detailLine ? [chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(detailLine)] : []), ...optionLines];
          const borderColor = chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray.dim;
          const overlayHeight = 2 + contentLines.length;
          const startRow = listStartRow + Math.max(0, Math.floor((contentHeight - overlayHeight) / 2));
          const colStart = Math.max(1, Math.floor((termWidth - maxWidth) / 2) + 1);
          // Borders (dimmed)
          const top = `${borderColor("┌")}${borderColor("─".repeat(maxWidth - 2))}${borderColor("┐")}`;
          stdout.write(`\x1b[${startRow};${colStart}H${top}`);
          for (let i = 0; i < contentLines.length; i++) {
            const row = startRow + 1 + i;
            const line = contentLines[i];
            // Left border
            stdout.write(`\x1b[${row};${colStart}H${borderColor("│")}`);
            // Left padding
            stdout.write(" ");
            // Write content padded to content width to avoid lingering artifacts
            const lineLen = visibleLength((0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(line));
            const pad = Math.max(0, contentWidth - lineLen);
            stdout.write(`${line}${" ".repeat(pad)}`);
            // Right padding
            stdout.write(" ");
            // Right border
            const rightCol = colStart + maxWidth - 1;
            stdout.write(`\x1b[${row};${rightCol}H${borderColor("│")}`);
          }
          const bottom = `${borderColor("└")}${borderColor("─".repeat(maxWidth - 2))}${borderColor("┘")}`;
          stdout.write(`\x1b[${startRow + overlayHeight - 1};${colStart}H${bottom}`);
          return; // do not redraw header/list/footer while modal is active
        }
        // Header (rows 1-3) — black & white only
        const headerText = "Sessions and Cloud Agents";
        const headerPadding = Math.max(0, Math.floor((termWidth - headerText.length) / 2));
        const headerLine = "─".repeat(termWidth);
        // Clear and render header
        stdout.write(`\x1b[1;1H\x1b[2K${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(headerLine)}`);
        stdout.write(`\x1b[2;1H\x1b[2K${" ".repeat(headerPadding)}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.bold(headerText)}`);
        stdout.write(`\x1b[3;1H\x1b[2K${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(headerLine)}`);
        // When loading (initial)
        if (loading) {
          const centerRow = Math.floor(termHeight / 2);
          const loadingMsg1 = "Loading sessions and background agents...";
          const loadingMsg2 = "Press Ctrl-D, q or ESC to cancel";
          stdout.write(`\x1b[${centerRow};1H\x1b[2K${" ".repeat(Math.max(0, Math.floor((termWidth - loadingMsg1.length) / 2)))}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(loadingMsg1)}`);
          stdout.write(`\x1b[${centerRow + 2};1H\x1b[2K${" ".repeat(Math.max(0, Math.floor((termWidth - loadingMsg2.length) / 2)))}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(loadingMsg2)}`);
          // Clear remaining lines below header and above footer
          for (let row = listStartRow; row <= termHeight - 2; row++) {
            if (row !== centerRow && row !== centerRow + 2) stdout.write(`\x1b[${row};1H\x1b[2K`);
          }
        }
        // When empty and not loading
        else if (items.length === 0) {
          const centerRow = Math.floor(termHeight / 2);
          const emptyMsg1 = "No sessions or background agents found.";
          const emptyMsg2 = "Press Ctrl-D, q or ESC to go back";
          stdout.write(`\x1b[${centerRow};1H\x1b[2K${" ".repeat(Math.max(0, Math.floor((termWidth - emptyMsg1.length) / 2)))}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(emptyMsg1)}`);
          stdout.write(`\x1b[${centerRow + 2};1H\x1b[2K${" ".repeat(Math.max(0, Math.floor((termWidth - emptyMsg2.length) / 2)))}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(emptyMsg2)}`);
          // Clear remaining lines below header and above footer
          for (let row = listStartRow; row <= termHeight - 2; row++) {
            if (row !== centerRow && row !== centerRow + 2) stdout.write(`\x1b[${row};1H\x1b[2K`);
          }
        } else {
          // Render list
          const start = scrollTop;
          const end = Math.min(items.length, start + contentHeight);
          const slice = items.slice(start, end);
          // If a confirmation modal is active, compute its vertical span to avoid overwriting
          let modalStartRow = null;
          let modalEndRow = null;
          if (confirmActive) {
            const _maxWidth = Math.max(30, Math.min(72, termWidth - 8));
            const innerHeight = 2 + (confirmDetail ? 1 : 0) + 2; // top+bottom + optional detail + 2 options
            const overlayHeight = innerHeight;
            modalStartRow = listStartRow + Math.max(0, Math.floor((contentHeight - overlayHeight) / 2));
            modalEndRow = modalStartRow + overlayHeight - 1;
          }
          for (let i = 0; i < contentHeight; i++) {
            const row = i + listStartRow; // rows 4..(termHeight-2)
            // Skip drawing rows covered by the modal to reduce flicker
            if (confirmActive && modalStartRow !== null && modalEndRow !== null && row >= modalStartRow && row <= modalEndRow) {
              continue;
            }
            const it = slice[i];
            if (!it) {
              stdout.write(`\x1b[${row};1H\x1b[2K`);
              continue;
            }
            const globalIndex = start + i;
            const isSelected = globalIndex === active;
            // Time string similar to ChatPicker
            const dt = new Date(Math.max(0, it.updatedAtMs || 0));
            const now = new Date();
            const daysAgo = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) / (1000 * 60 * 60 * 24));
            const timeStr = dt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            });
            let dateStr;
            if (daysAgo <= 0) dateStr = `Today ${timeStr}`;else if (daysAgo === 1) dateStr = `Yesterday ${timeStr}`;else if (daysAgo < 7) dateStr = `${daysAgo} days ago`;else dateStr = `${dt.toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "numeric"
            })} ${timeStr}`;
            // Compose left content with fixed icon slot for consistent alignment
            const prefix = isSelected ? "  ▶ " : "    ";
            const iconPlain = it.kind === "background" ? "⬢ " : "  ";
            const iconVisible = visibleLength(iconPlain);
            const statusIcon = s => {
              switch (s) {
                case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .BackgroundComposerStatus */.R6.ERROR:
                  return chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.red("⬢ ");
                case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .BackgroundComposerStatus */.R6.FINISHED:
                  return chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.green("⬢ ");
                case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .BackgroundComposerStatus */.R6.RUNNING:
                case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .BackgroundComposerStatus */.R6.CREATING:
                  // In-progress states are yellow
                  return chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.yellow("⬢ ");
                default:
                  return chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray("⬢ ");
              }
            };
            const icon = it.kind === "background" ? statusIcon(it.status) : iconPlain;
            const dateStyled = isSelected ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(dateStr) : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(dateStr);
            // Source (for background only)
            const formatSource = (_repoUrl, branchName) => {
              const b = (branchName || "").trim();
              return b; // show branch only; empty string if none
            };
            const sourceText = it.kind === "background" ? formatSource(it.repoUrl, it.branch) : "";
            // Determine available width for the main text area (name + optional source)
            const rightPad = prefix.length;
            const leftVisible = prefix.length + iconVisible; // prefix arrow + icon slot
            const reserved = leftVisible + 1 + dateStr.length + rightPad; // +1 for space before date
            const maxMainWidth = Math.max(1, termWidth - reserved);
            const namePlain = firstLine(it.name).trim();
            if (it.kind === "background") {
              // Split budget between name and source for stability
              const sepPlain = sourceText ? " " : "";
              const sepVisible = visibleLength(sepPlain);
              const sepDecorated = sourceText ? isSelected ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(sepPlain) : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(sepPlain) : "";
              // Prepare optional diff stats suffix like "  +12 -3"
              const bg = it;
              const hasStats = typeof bg.totalAdded === "number" && typeof bg.totalRemoved === "number" && (((_a = bg.totalAdded) !== null && _a !== void 0 ? _a : 0) > 0 || ((_b = bg.totalRemoved) !== null && _b !== void 0 ? _b : 0) > 0);
              const diffSuffixPlain = hasStats ? `  +${Math.max(0, (_c = bg.totalAdded) !== null && _c !== void 0 ? _c : 0)} -${Math.max(0, (_d = bg.totalRemoved) !== null && _d !== void 0 ? _d : 0)}` : "";
              const diffSuffixVisible = visibleLength(diffSuffixPlain);
              const minName = Math.min(24, Math.max(10, Math.floor(maxMainWidth * 0.35)));
              const minSource = Math.min(22, Math.max(8, Math.floor(maxMainWidth * 0.25)));
              const availableForMain = Math.max(1, maxMainWidth - diffSuffixVisible);
              let nameBudget = Math.floor(availableForMain * 0.6);
              let sourceBudget = availableForMain - nameBudget - sepVisible;
              if (sourceBudget < minSource) {
                const deficit = minSource - sourceBudget;
                nameBudget = Math.max(minName, nameBudget - deficit);
                sourceBudget = availableForMain - nameBudget - sepVisible;
              }
              if (nameBudget < minName) {
                const deficit = minName - nameBudget;
                sourceBudget = Math.max(minSource, sourceBudget - deficit);
                nameBudget = availableForMain - sourceBudget - sepVisible;
              }
              nameBudget = Math.max(1, nameBudget);
              sourceBudget = Math.max(0, sourceBudget);
              const nameTrunc = truncateEndPlain(namePlain, nameBudget);
              const sourceTrunc = truncateEndPlain(sourceText, sourceBudget);
              const nameDecorated = isSelected ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.bold(chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(nameTrunc)) : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(nameTrunc);
              const sourceDecorated = isSelected ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(sourceTrunc) : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(sourceTrunc);
              const mainDecorated = sourceTrunc ? `${nameDecorated}${sepDecorated}${sourceDecorated}` : `${nameDecorated}`;
              const addedText = `+${Math.max(0, (_e = bg.totalAdded) !== null && _e !== void 0 ? _e : 0)}`;
              const removedText = `-${Math.max(0, (_f = bg.totalRemoved) !== null && _f !== void 0 ? _f : 0)}`;
              const coloredDiff = `  ${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.green(addedText)} ${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.red(removedText)}`;
              const diffDecorated = hasStats ? isSelected ? coloredDiff : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.dim(coloredDiff) : "";
              const spaces = Math.max(0, termWidth - rightPad - leftVisible - visibleLength(mainDecorated + diffSuffixPlain) - 1 - dateStr.length);
              const line = `${prefix}${icon}${mainDecorated}${diffDecorated}${" ".repeat(spaces)} ${dateStyled}${" ".repeat(rightPad)}`;
              stdout.write(`\x1b[${row};1H\x1b[2K${line}`);
            } else {
              // Chat items: no " - local" suffix
              const nameBudget = maxMainWidth;
              const nameTrunc = truncateEndPlain(namePlain, nameBudget);
              const mainDecorated = isSelected ? chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.bold(chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(nameTrunc)) : chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(nameTrunc);
              const spaces = Math.max(0, termWidth - rightPad - leftVisible - visibleLength(mainDecorated) - 1 - dateStr.length);
              const line = `${prefix}${icon}${mainDecorated}${" ".repeat(spaces)} ${dateStyled}${" ".repeat(rightPad)}`;
              stdout.write(`\x1b[${row};1H\x1b[2K${line}`);
            }
          }
        }
        // Footer (last 2 rows)
        const footerRow1 = termHeight - 1;
        const footerRow2 = termHeight;
        const footerLine = "─".repeat(termWidth);
        stdout.write(`\x1b[${footerRow1};1H\x1b[2K${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(footerLine)}`);
        if (items.length > 0) {
          const navText = `${Math.min(active + 1, items.length)}/${items.length}`;
          const helpText = "↑↓/jk: navigate • Enter: select • Backspace: delete • Ctrl-D/q/ESC: back";
          const combined = `${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.bold(navText)} ${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray("•")} ${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(helpText)}`;
          const padding = Math.max(0, Math.floor((termWidth - (navText.length + 3 + helpText.length)) / 2));
          stdout.write(`\x1b[${footerRow2};1H\x1b[2K${" ".repeat(padding)}${combined}`);
        } else {
          const helpText = "Ctrl-D/q/ESC: back";
          const padding = Math.max(0, Math.floor((termWidth - helpText.length) / 2));
          stdout.write(`\x1b[${footerRow2};1H\x1b[2K${" ".repeat(padding)}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(helpText)}`);
        }
        // Confirmation modal overlay (centered, yellow border, max width)
        if (confirmActive) {
          const title = confirmTitle;
          const detail = confirmDetail;
          const options = [{
            label: continueLabel,
            hint: "y"
          }, {
            label: cancelLabel,
            hint: "esc/n"
          }];
          const maxWidth = Math.max(30, Math.min(72, termWidth - 8));
          // Compute content lines (truncate to fit inner width)
          const innerWidth = Math.max(10, maxWidth - 2);
          const trunc = t => {
            const s = (t !== null && t !== void 0 ? t : "").trim();
            if (visibleLength(s) <= innerWidth - 2) return s; // account for left padding
            return `${(0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(s).slice(0, Math.max(0, innerWidth - 5))}...`;
          };
          const titleLine = trunc(title);
          const detailLine = detail ? trunc(detail) : undefined;
          const optionLines = options.map((opt, idx) => {
            const isActiveRow = idx === confirmIndex;
            const arrow = isActiveRow ? "→ " : "  ";
            const hintText = opt.hint ? ` ${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(opt.hint)}` : "";
            const labelRaw = opt.label;
            const base = `${arrow}${labelRaw}${(0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(hintText) ? ` ${opt.hint}` : ""}`;
            const rawTrunc = (0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(base).length > innerWidth - 2 ? `${(0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(base).slice(0, Math.max(0, innerWidth - 5))}...` : base;
            const styled = isActiveRow ? `${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white("→ ")}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.black.bgYellow(labelRaw)}` + (opt.hint ? ` ${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(opt.hint)}` : "") : `${"  "}${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(labelRaw)}` + (opt.hint ? ` ${chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(opt.hint)}` : "");
            // If styling may change width, fall back to plain when overflowing
            const final = visibleLength(styled) > innerWidth - 2 ? (0, _utils_characters_js__WEBPACK_IMPORTED_MODULE_11__ /* .stripAnsi */.aJ)(rawTrunc) : styled;
            return final;
          });
          const contentLines = [chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.white(titleLine), ...(detailLine ? [chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.gray(detailLine)] : []), ...optionLines];
          const borderColor = chalk__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.Ay.yellow;
          const overlayHeight = 2 + contentLines.length; // top+bottom borders
          const startRow = listStartRow + Math.max(0, Math.floor((contentHeight - overlayHeight) / 2));
          const colStart = Math.max(1, Math.floor((termWidth - maxWidth) / 2) + 1);
          // Draw top border
          const top = `${borderColor("┌")}${borderColor("─".repeat(maxWidth - 2))}${borderColor("┐")}`;
          stdout.write(`\x1b[${startRow};${colStart}H${top}`);
          // Draw content rows with side borders and padding
          for (let i = 0; i < contentLines.length; i++) {
            const row = startRow + 1 + i;
            const line = contentLines[i];
            // Left border
            stdout.write(`\x1b[${row};${colStart}H${borderColor("│")}`);
            // Space + content (no right padding to preserve underlying text)
            stdout.write(` ${line}`);
            // Right border at fixed column
            const rightCol = colStart + maxWidth - 1;
            stdout.write(`\x1b[${row};${rightCol}H${borderColor("│")}`);
          }
          // Bottom border
          const bottom = `${borderColor("└")}${borderColor("─".repeat(maxWidth - 2))}${borderColor("┘")}`;
          stdout.write(`\x1b[${startRow + overlayHeight - 1};${colStart}H${bottom}`);
        }
      }, [stdout, items, active, scrollTop, contentHeight, termWidth, termHeight, loading, confirmActive, confirmIndex, confirmTitle, confirmDetail, continueLabel, cancelLabel]);
      return null;
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/