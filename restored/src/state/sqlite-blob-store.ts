/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ SQLiteBlobStoreWithMetadata)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../agent-kv/dist/index.js");
/* harmony import */ var _anysphere_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../utils/dist/index.js");
/* harmony import */ var sqlite3__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/sqlite3@5.1.7_patch_hash=wpoum7zjk6ojzyl25zadce3uda/node_modules/sqlite3/lib/sqlite3.js");
/* harmony import */ var sqlite3__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(sqlite3__WEBPACK_IMPORTED_MODULE_4__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





const agentMetadataSerde = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .AgentMetadataSerde */ .aY();
class SqliteDatabase extends (sqlite3__WEBPACK_IMPORTED_MODULE_4___default().Database) {
}
class SQLiteBlobStoreWithMetadata extends _anysphere_utils__WEBPACK_IMPORTED_MODULE_3__/* .Disposable */ .jG {
    static initAndLoad(dbPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = new SQLiteBlobStoreWithMetadata(dbPath);
            yield store.getDb();
            return store;
        });
    }
    constructor(dbPath) {
        super();
        this.dbPath = dbPath;
        this.listeners = {
            agentId: new Set(),
            latestRootBlobId: new Set(),
            name: new Set(),
            createdAt: new Set(),
            mode: new Set(),
            lastUsedModel: new Set(),
        };
        // Serialize persistence to avoid re-entrant stacks
        this.isPersisting = false;
        this.persistQueued = false;
        const agentId = (0,node_path__WEBPACK_IMPORTED_MODULE_1__.basename)((0,node_path__WEBPACK_IMPORTED_MODULE_1__.dirname)(this.dbPath));
        this.metadata = (0,_anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .getDefaultAgentMetadata */ .sh)(agentId);
    }
    getDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dbPromise) {
                return this.dbPromise;
            }
            this.dbPromise = new Promise((resolve, reject) => {
                const dir = (0,node_path__WEBPACK_IMPORTED_MODULE_1__.dirname)(this.dbPath);
                if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(dir)) {
                    (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.mkdirSync)(dir, { recursive: true });
                }
                const db = new SqliteDatabase(this.dbPath, err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    // Set up the database with proper configuration
                    db.serialize(() => {
                        db.run("PRAGMA journal_mode = WAL");
                        db.run("PRAGMA synchronous = NORMAL");
                        db.run("PRAGMA user_version = 1");
                        db.run("CREATE TABLE IF NOT EXISTS blobs (id TEXT PRIMARY KEY, data BLOB)");
                        db.run("CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)", err => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            // Load metadata
                            db.get("SELECT value FROM meta WHERE key = ?", "0", (err, row) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                if (row === null || row === void 0 ? void 0 : row.value) {
                                    const id = (0,_anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .fromHex */ .aD)(row.value);
                                    this.metadata = agentMetadataSerde.deserialize(id);
                                }
                                else {
                                    // Save initial metadata
                                    const serialized = agentMetadataSerde.serialize(this.metadata);
                                    const id = (0,_anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .toHex */ .nj)(serialized);
                                    db.run("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)", "0", id);
                                }
                                resolve(db);
                            });
                        });
                    });
                });
            });
            return this.dbPromise;
        });
    }
    getBlob(_ctx, blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            const id = (0,_anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .toHex */ .nj)(blobId);
            return new Promise((resolve, reject) => {
                db.get("SELECT data FROM blobs WHERE id = ?", id, (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!row || row.data == null) {
                        resolve(undefined);
                        return;
                    }
                    // sqlite3 returns Buffer objects for BLOB columns
                    resolve(new Uint8Array(row.data));
                });
            });
        });
    }
    setBlob(_ctx, blobId, blobData) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            const id = (0,_anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .toHex */ .nj)(blobId);
            return new Promise((resolve, reject) => {
                db.run("INSERT OR REPLACE INTO blobs (id, data) VALUES (?, ?)", id, Buffer.from(blobData), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    flush(_ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    get(key) {
        return this.metadata[key];
    }
    valuesEqual(key, a, b) {
        if (key === "latestRootBlobId") {
            const ua = a;
            const ub = b;
            if (ua === ub)
                return true;
            if (!ua || !ub)
                return false;
            if (ua.length !== ub.length)
                return false;
            for (let i = 0; i < ua.length; i++) {
                if (ua[i] !== ub[i])
                    return false;
            }
            return true;
        }
        return a === b;
    }
    schedulePersist() {
        if (!this.dbPromise)
            return;
        if (this.isPersisting) {
            this.persistQueued = true;
            return;
        }
        this.isPersisting = true;
        void this.persistMetadata().finally(() => {
            this.isPersisting = false;
            if (this.persistQueued) {
                this.persistQueued = false;
                this.schedulePersist();
            }
        });
    }
    set(key, value) {
        const current = this.metadata[key];
        if (this.valuesEqual(key, current, value)) {
            // No-op on identical values to avoid redundant notifications/persistence
            return;
        }
        this.metadata = Object.assign(Object.assign({}, this.metadata), { [key]: value });
        // if we already have a db, lets persist our metadata (fire and forget, serialized)
        if (this.dbPromise) {
            this.schedulePersist();
        }
        // notify listeners of the specific key (defer to break synchronous recursion)
        const listenerSet = this.listeners[key];
        if (listenerSet && listenerSet.size > 0) {
            queueMicrotask(() => {
                listenerSet.forEach(l => {
                    l();
                });
            });
        }
    }
    persistMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            const serialized = agentMetadataSerde.serialize(this.metadata);
            const id = (0,_anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .toHex */ .nj)(serialized);
            return new Promise((resolve, reject) => {
                db.run("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)", "0", id, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    subscribe(key, listener) {
        const set = this.listeners[key];
        if (set) {
            set.add(listener);
            return () => set.delete(listener);
        }
        return () => { };
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbPromise) {
                return;
            }
            yield this.cleanup();
            this.dbPromise = undefined;
        });
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbPromise) {
                return;
            }
            const db = yield this.dbPromise;
            const row = yield new Promise((resolve, reject) => {
                db.get("SELECT value FROM meta WHERE key = ?", "0", (err, r) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(r);
                });
            });
            let latestLen = 0;
            if (row === null || row === void 0 ? void 0 : row.value) {
                const id = (0,_anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__/* .fromHex */ .aD)(row.value);
                const md = agentMetadataSerde.deserialize(id);
                latestLen = md.latestRootBlobId.length;
            }
            yield new Promise(resolve => {
                db.close(() => resolve());
            });
            if (latestLen === 0) {
                this.dbPromise = undefined;
                const dir = (0,node_path__WEBPACK_IMPORTED_MODULE_1__.dirname)(this.dbPath);
                try {
                    (0,node_fs__WEBPACK_IMPORTED_MODULE_0__.rmSync)(dir, { recursive: true, force: true });
                }
                catch (_a) {
                    // ignore
                }
                return;
            }
        });
    }
}


/***/ })

};
;