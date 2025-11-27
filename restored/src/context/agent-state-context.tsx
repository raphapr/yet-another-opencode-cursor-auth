/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */C9: () => (/* binding */useAgentState),
  /* harmony export */oG: () => (/* binding */AgentStateProvider),
  /* harmony export */tO: () => (/* binding */useIsCompact)
  /* harmony export */
});
/* harmony import */
var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
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
const AgentStateContext = (0, react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);
const AgentStateProvider = ({
  children,
  fileChangeTracker,
  pendingDecisionStore,
  configProvider,
  initialViewMode = "chat",
  initialInputValue = "",
  initialIsCompact = true,
  initialAgentStore,
  modelManager
}) => {
  const [changedFiles, setChangedFiles] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(() => fileChangeTracker.getChanges());
  const [viewMode, setViewMode] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialViewMode);
  const [currentModel, setCurrentModelState] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(modelManager.getCurrentModel());
  const [inputValue, setInputValue] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialInputValue);
  const [pendingDecisions, setPendingDecisions] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(pendingDecisionStore.getPendingDecisions());
  const [queuedMessage, setQueuedMessage] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
  const [reviewSelectedIndex, setReviewSelectedIndex] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const [agentStore, setAgentStore] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialAgentStore);
  const [isGenerating, setIsGenerating] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isSummarizing, setIsSummarizing] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isCompact, setIsCompact] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialIsCompact);
  const [agentMetadataMode, setAgentMetadataMode] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(() => agentStore.getMetadata("mode"));
  const [conversationTokensUsed, setConversationTokensUsed] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [conversationMaxTokens, setConversationMaxTokens] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const [conversationTokenPercent, setConversationTokenPercent] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const setCurrentModel = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(model => __awaiter(void 0, void 0, void 0, function* () {
    if (configProvider) {
      yield modelManager.setCurrentModel(model, configProvider);
    } else {
      modelManager.setCurrentModelWithoutPersistence(model);
    }
  }), [configProvider, modelManager]);
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const unsubscribe = fileChangeTracker.subscribe(() => {
      setChangedFiles(fileChangeTracker.getChanges());
    });
    setChangedFiles(fileChangeTracker.getChanges());
    return unsubscribe;
  }, [fileChangeTracker]);
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const unsubscribe = pendingDecisionStore.subscribe(decisions => {
      setPendingDecisions(decisions);
    });
    setPendingDecisions(pendingDecisionStore.getPendingDecisions());
    return unsubscribe;
  }, [pendingDecisionStore]);
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const unsubscribe = agentStore.subscribeToMetadata("mode", mode => {
      setAgentMetadataMode(mode);
    });
    setAgentMetadataMode(agentStore.getMetadata("mode"));
    return unsubscribe;
  }, [agentStore]);
  // Subscribe to conversation checkpoints and compute token percent solely
  // from the conversation state's tokenDetails.
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const computeFromConversation = () => {
      const struct = agentStore.getConversationStateStructure();
      const td = struct === null || struct === void 0 ? void 0 : struct.tokenDetails;
      const used = typeof (td === null || td === void 0 ? void 0 : td.usedTokens) === "number" && Number.isFinite(td.usedTokens) ? td.usedTokens : null;
      const max = typeof (td === null || td === void 0 ? void 0 : td.maxTokens) === "number" && Number.isFinite(td.maxTokens) ? td.maxTokens : null;
      setConversationTokensUsed(used);
      setConversationMaxTokens(max);
      if (used != null && max != null && max > 0) {
        const percentUsed = Math.max(0, Math.min(100, Math.round(used / max * 100 * 10) / 10));
        setConversationTokenPercent(percentUsed);
      } else {
        setConversationTokenPercent(null);
      }
    };
    const unsubs = [];
    unsubs.push(agentStore.subscribeToMetadata("latestRootBlobId", () => {
      computeFromConversation();
    }));
    // Initial compute
    computeFromConversation();
    return () => {
      for (const u of unsubs) {
        try {
          u();
        } catch (_a) {}
      }
    };
  }, [agentStore]);
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const unsubscribe = modelManager.subscribe(newModel => {
      setCurrentModelState(newModel);
    });
    return unsubscribe;
  }, [modelManager]);
  const approvePendingDecision = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(id => {
    pendingDecisionStore.approveDecision(id);
  }, [pendingDecisionStore]);
  const rejectPendingDecision = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((id, reason) => {
    pendingDecisionStore.rejectDecision(id, reason);
  }, [pendingDecisionStore]);
  const requestApproval = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(operation => {
    return pendingDecisionStore.requestApproval(operation);
  }, [pendingDecisionStore]);
  return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AgentStateContext.Provider, {
    value: {
      changedFiles,
      viewMode,
      setViewMode,
      mode: agentMetadataMode,
      currentModel,
      setCurrentModel,
      inputValue,
      setInputValue,
      pendingDecisions,
      approvePendingDecision,
      rejectPendingDecision,
      requestApproval,
      queuedMessage,
      setQueuedMessage,
      reviewSelectedIndex,
      setReviewSelectedIndex,
      agentStore,
      setAgentStore,
      modelManager,
      isGenerating,
      setIsGenerating,
      isSummarizing,
      setIsSummarizing,
      isCompact,
      setIsCompact,
      conversationTokensUsed,
      conversationMaxTokens,
      conversationTokenPercent
    },
    children: children
  });
};
const useAgentState = () => {
  const ctx = (0, react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AgentStateContext);
  if (!ctx) {
    throw new Error("useAgentState must be used within an AgentStateProvider");
  }
  return ctx;
};
const useIsCompact = () => {
  return useAgentState().isCompact;
};

/***/