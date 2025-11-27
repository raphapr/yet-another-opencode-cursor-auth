__webpack_require__.r(__webpack_exports__);
/* harmony export */
__webpack_require__.d(__webpack_exports__, {
  /* harmony export */handleCreateChat: () => (/* binding */handleCreateChat)
  /* harmony export */
});
/* harmony import */
var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:crypto");
/* harmony import */
var node_crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../agent-kv/dist/index.js");
/* harmony import */
var _console_io_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/console-io.ts");
/* harmony import */
var _state_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/state/index.ts");
/* harmony import */
var _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/state/sqlite-blob-store.ts");
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
function handleCreateChat() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      // Generate a new UUID for the chat
      const chatId = node_crypto__WEBPACK_IMPORTED_MODULE_0___default().randomUUID();
      // Create the chat directory structure
      const chatsRoot = (0, _state_index_js__WEBPACK_IMPORTED_MODULE_3__ /* .getChatsRootDir */.r)();
      const chatDir = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)(chatsRoot, chatId);
      const dbPath = (0, node_path__WEBPACK_IMPORTED_MODULE_1__.join)(chatDir, "store.db");
      // Create the SQLite store and AgentStore
      const sqliteStore = new _state_sqlite_blob_store_js__WEBPACK_IMPORTED_MODULE_4__ /* .SQLiteBlobStoreWithMetadata */.M(dbPath);
      const agentStore = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_2__ /* .AgentStore */.pH(sqliteStore, sqliteStore);
      // Set the agent ID in the store
      sqliteStore.set("agentId", chatId);
      // Get the ID from the agent store to confirm it was created
      const createdId = agentStore.getId();
      // Output the chat ID to stdout
      (0, _console_io_js__WEBPACK_IMPORTED_MODULE_5__ /* .intentionallyWriteToStdout */.OT)(createdId);
      // Clean up resources
      yield agentStore.dispose();
    } catch (error) {
      (0, _console_io_js__WEBPACK_IMPORTED_MODULE_5__ /* .intentionallyWriteToStderr */.p2)(`Failed to create chat: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });
}

/***/