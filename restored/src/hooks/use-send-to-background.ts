/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */$: () => (/* binding */useSendToBackground)
  /* harmony export */
});
/* unused harmony export findGitRoot */
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs");
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */
var _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../proto/dist/generated/aiserver/v1/background_composer_pb.js");
/* harmony import */
var _anysphere_proto_aiserver_v1_chat_pb_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../proto/dist/generated/aiserver/v1/chat_pb.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
/* harmony import */
var _debug_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/debug.ts");
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
function execGit(args, cwd) {
  try {
    const output = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", args, {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    });
    return output.trim();
  } catch (_a) {
    return undefined;
  }
}
/** Resolve the repository root (nearest ancestor with a .git folder); fallback to start path */
function findGitRoot(startPath) {
  let currentPath = startPath;
  const parsed = node_path__WEBPACK_IMPORTED_MODULE_2___default().parse(startPath);
  while (true) {
    const gitDirPath = node_path__WEBPACK_IMPORTED_MODULE_2___default().join(currentPath, ".git");
    try {
      if ((0, node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(gitDirPath)) return currentPath;
    } catch (_a) {
      // ignore
    }
    const parent = node_path__WEBPACK_IMPORTED_MODULE_2___default().dirname(currentPath);
    if (parent === currentPath || parent === parsed.root) break;
    currentPath = parent;
  }
  return startPath;
}
function normalizeRemoteUrl(rawUrl) {
  let httpsUrl = rawUrl;
  if (rawUrl.startsWith("git@github.com:")) {
    const rest = rawUrl.slice("git@github.com:".length).replace(/\.git$/i, "");
    httpsUrl = `https://github.com/${rest}`;
  }
  if (rawUrl.startsWith("ssh://git@github.com/")) {
    const rest = rawUrl.slice("ssh://git@github.com/".length).replace(/\.git$/i, "");
    httpsUrl = `https://github.com/${rest}`;
  }
  if (rawUrl.startsWith("git://github.com/")) {
    const rest = rawUrl.slice("git://github.com/".length).replace(/\.git$/i, "");
    httpsUrl = `https://github.com/${rest}`;
  }
  httpsUrl = httpsUrl.replace(/\.git$/i, "");
  const withoutProtocol = httpsUrl.replace(/^https?:\/\//i, "");
  return {
    httpsUrl,
    hostPath: withoutProtocol
  };
}
function useSendToBackground(backgroundComposerClient) {
  const [isSubmitting, setIsSubmitting] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [isSubmittingFollowup, setIsSubmittingFollowup] = (0, react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const sendToBackground = (0, react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(rawPrompt => __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c;
    const trimmed = rawPrompt.trim();
    if (trimmed.length === 0) {
      return {
        type: "error",
        message: "Prompt is empty",
        timestampMs: Date.now()
      };
    }
    setIsSubmitting(true);
    try {
      const cwd = process.cwd();
      const repoRoot = findGitRoot(cwd);
      const remoteUrlRaw = (_a = execGit(["config", "--get", "remote.origin.url"], repoRoot)) !== null && _a !== void 0 ? _a : (() => {
        var _a;
        const remotes = execGit(["remote", "-v"], repoRoot);
        if (!remotes) return undefined;
        const firstLine = (_a = remotes.split(/\r?\n/).find(l => l.includes("(fetch)"))) !== null && _a !== void 0 ? _a : remotes.split(/\r?\n/)[0];
        const parts = firstLine === null || firstLine === void 0 ? void 0 : firstLine.split(/\s+/);
        return parts === null || parts === void 0 ? void 0 : parts[1];
      })();
      const branch = (_b = execGit(["rev-parse", "--abbrev-ref", "HEAD"], repoRoot)) !== null && _b !== void 0 ? _b : "main";
      if (!remoteUrlRaw) {
        return {
          type: "error",
          message: "Background Agent requires a Git remote. Add a GitHub remote and try again.",
          timestampMs: Date.now()
        };
      }
      const {
        httpsUrl,
        hostPath
      } = normalizeRemoteUrl(remoteUrlRaw);
      let modelName;
      try {
        const settings = yield backgroundComposerClient.getBackgroundComposerUserSettings({});
        modelName = settings.modelName;
      } catch (_d) {
        // best-effort
      }
      const response = yield backgroundComposerClient.startBackgroundComposerFromSnapshot({
        snapshotNameOrId: hostPath,
        snapshotWorkspaceRootPath: repoRoot,
        devcontainerStartingPoint: {
          url: httpsUrl,
          ref: branch,
          cursorServerCommit: "",
          userExtensions: [],
          environmentJsonOverride: "",
          dontAllowReadingEnvironmentJsonFromDatabase: false,
          skipBuildCaches: false
        },
        repoUrl: hostPath,
        autoBranch: true,
        returnImmediately: true,
        source: _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .BackgroundComposerSource */._b.EDITOR,
        modelDetails: modelName ? {
          modelName,
          maxMode: true
        } : {},
        additionalModelDetails: [],
        repositoryInfo: {
          repositoryInfo: undefined,
          pathEncryptionKey: "",
          shouldSyncIndex: false,
          repositoryInfoShouldQueryStaging: false,
          repositoryInfoShouldQueryProd: false,
          repoQueryAuthToken: "",
          queryOnlyRepoAccess: undefined
        },
        conversationHistory: [{
          text: trimmed,
          richText: trimmed,
          capabilityContexts: [],
          type: _anysphere_proto_aiserver_v1_chat_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .ConversationMessage_MessageType */.Jc.HUMAN,
          images: []
        }]
      });
      const bcId = (_c = response.composer) === null || _c === void 0 ? void 0 : _c.bcId;
      let statusText;
      if (bcId) {
        try {
          const statusResp = yield backgroundComposerClient.getBackgroundComposerStatus({
            bcId
          });
          statusText = (() => {
            switch (statusResp.status) {
              case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .BackgroundComposerStatus */.R6.CREATING:
                return "CREATING";
              case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .BackgroundComposerStatus */.R6.RUNNING:
                return "RUNNING";
              case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .BackgroundComposerStatus */.R6.FINISHED:
                return "FINISHED";
              case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .BackgroundComposerStatus */.R6.ERROR:
                return "ERROR";
              case _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .BackgroundComposerStatus */.R6.EXPIRED:
                return "EXPIRED";
              default:
                return "UNKNOWN";
            }
          })();
        } catch (_e) {
          // ignore
        }
      }
      if (!bcId) {
        return {
          type: "error",
          message: "Failed to start Background Agent",
          timestampMs: Date.now()
        };
      }
      return {
        type: "success",
        bcId,
        repoHostPath: hostPath,
        branch,
        statusText,
        timestampMs: Date.now()
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        type: "error",
        message: `Failed to start Background Agent: ${message}`,
        timestampMs: Date.now()
      };
    } finally {
      setIsSubmitting(false);
    }
  }), [backgroundComposerClient]);
  const sendFollowupToBackground = (0, react__WEBPACK_IMPORTED_MODULE_5__.useCallback)((bcId, rawPrompt, options) => __awaiter(this, void 0, void 0, function* () {
    var _a, _b;
    const trimmed = rawPrompt.trim();
    if (!bcId || !trimmed) {
      return {
        type: "error",
        message: !bcId ? "Background composer ID is required" : "Follow-up message is empty",
        timestampMs: Date.now()
      };
    }
    setIsSubmittingFollowup(true);
    try {
      const followupMessage = new _anysphere_proto_aiserver_v1_chat_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .ConversationMessage */.hS({
        text: trimmed,
        richText: trimmed,
        capabilityContexts: [],
        type: _anysphere_proto_aiserver_v1_chat_pb_js__WEBPACK_IMPORTED_MODULE_4__ /* .ConversationMessage_MessageType */.Jc.HUMAN,
        images: []
      });
      if (options === null || options === void 0 ? void 0 : options.bubbleId) {
        followupMessage.bubbleId = options.bubbleId;
      }
      const request = new _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .AddAsyncFollowupBackgroundComposerRequest */.FF({
        bcId,
        followupMessage,
        synchronous: (_a = options === null || options === void 0 ? void 0 : options.synchronous) !== null && _a !== void 0 ? _a : false,
        followupSource: (_b = options === null || options === void 0 ? void 0 : options.source) !== null && _b !== void 0 ? _b : _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_3__ /* .BackgroundComposerSource */._b.CLI
      });
      yield backgroundComposerClient.addAsyncFollowupBackgroundComposer(request);
      return {
        type: "success",
        bcId,
        timestampMs: Date.now()
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      (0, _debug_js__WEBPACK_IMPORTED_MODULE_6__.debugLog)(`Failed to send follow-up: ${message}`);
      return {
        type: "error",
        message: `Failed to send follow-up: ${message}`,
        timestampMs: Date.now()
      };
    } finally {
      setIsSubmittingFollowup(false);
    }
  }), [backgroundComposerClient]);
  return (0, react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(() => ({
    isSubmitting,
    isSubmittingFollowup,
    sendToBackground,
    sendFollowupToBackground
  }), [isSubmitting, isSubmittingFollowup, sendToBackground, sendFollowupToBackground]);
}

/***/