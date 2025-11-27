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
function useAttachBackgroundComposer(client, bcId) {
  const [responses, setResponses] = (0, react.useState)({
    bubbles: []
  });
  const [status, setStatus] = (0, react.useState)(background_composer_pb /* BackgroundComposerStatus */.R6.UNSPECIFIED);
  const [isAttached, setIsAttached] = (0, react.useState)(false);
  const [isLoadingConversation, setIsLoadingConversation] = (0, react.useState)(false);
  const [error, setError] = (0, react.useState)(undefined);
  const [modelDetails, setModelDetails] = (0, react.useState)(undefined);
  const [branchName, setBranchName] = (0, react.useState)(undefined);
  const [repoUrl, setRepoUrl] = (0, react.useState)(undefined);
  const currentHash = (0, react.useRef)(undefined);
  const [diffs, setDiffs] = (0, react.useState)(undefined);
  // Start with loading=false; only show when we actually fetch diffs
  const [isLoadingDiffs, setIsLoadingDiffs] = (0, react.useState)(false);
  const hasLoadedDiffsRef = (0, react.useRef)(false);
  // Only begin fetching diffs after we observe an edit tool
  const shouldFetchDiffsRef = (0, react.useRef)(false);
  const abortControllerRef = (0, react.useRef)(null);
  const isRunningRef = (0, react.useRef)(false);
  // Track current status and polling state for periodic status pulls
  const statusRef = (0, react.useRef)(background_composer_pb /* BackgroundComposerStatus */.R6.UNSPECIFIED);
  const isPollingRef = (0, react.useRef)(false);
  const isPollingDiffsRef = (0, react.useRef)(false);
  const fetchDiffs = (0, react.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
    if (!bcId) {
      // Ensure loading state is not stuck when bcId is missing
      return;
    }
    try {
      if (!hasLoadedDiffsRef.current) setIsLoadingDiffs(true);
      const resp = yield client.getOptimizedDiffDetails({
        bcId
      });
      const mappedDiffs = mapBackgroundDiffsToFileChanges(resp);
      setDiffs(mappedDiffs);
      hasLoadedDiffsRef.current = true;
    } catch (e) {
      (0, debug.debugLog)("Error fetching diffs", e);
    } finally {
      // We attempted a fetch; turn off loading indicator regardless of result
      setIsLoadingDiffs(false);
    }
  }), [client, bcId]);
  const fetchHashAndMaybeUpdateDiffs = (0, react.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
    if (!bcId) {
      // Ensure loading state is not stuck when bcId is missing
      return;
    }
    // Do not fetch diffs until we have seen an edit operation
    if (!shouldFetchDiffsRef.current) {
      setIsLoadingDiffs(false);
      return;
    }
    try {
      const newHash = yield client.getBackgroundComposerChangesHash({
        bcId
      });
      if (newHash.hash !== currentHash.current) {
        currentHash.current = newHash.hash;
        yield fetchDiffs();
      }
    } finally {
      // First hash poll counts as an attempt; disable loading spinner
      setIsLoadingDiffs(false);
    }
  }), [client, bcId, fetchDiffs]);
  (0, react.useEffect)(() => {
    if (!bcId) return;
    const id = setInterval(() => {
      if (isPollingDiffsRef.current) return;
      isPollingDiffsRef.current = true;
      void fetchHashAndMaybeUpdateDiffs().finally(() => {
        isPollingDiffsRef.current = false;
      });
    }, constants /* BACKGROUND_COMPOSER_DIFFS_POLL_INTERVAL_MS */.Ep);
    return () => clearInterval(id);
  }, [fetchHashAndMaybeUpdateDiffs, bcId]);
  const attach = (0, react.useCallback)(bcId => __awaiter(this, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setError(undefined);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    try {
      let startIndex = 0;
      // Fetch existing conversation and details in parallel
      try {
        setIsLoadingConversation(true);
        const [fetchedRes, detailedRes] = yield Promise.allSettled([client.fetchBackgroundComposer({
          bcId
        }), client.listDetailedBackgroundComposers({
          bcId,
          n: 1
        })]);
        const fetched = fetchedRes.status === "fulfilled" ? fetchedRes.value : undefined;
        const detailed = detailedRes.status === "fulfilled" ? detailedRes.value : undefined;
        if (detailedRes.status === "rejected") {
          (0, debug.debugLog)("Failed to fetch detailed background composers", bcId);
        } else {
          (0, debug.debugLogJSON)("detailed", detailed);
          const first = (_d = detailed === null || detailed === void 0 ? void 0 : detailed.composers) === null || _d === void 0 ? void 0 : _d[0];
          if (first) {
            setModelDetails(first.modelDetails);
            setBranchName((_e = first.composer) === null || _e === void 0 ? void 0 : _e.branchName);
            setRepoUrl((_f = first.composer) === null || _f === void 0 ? void 0 : _f.repoUrl);
          }
        }
        setResponses({
          bubbles: []
        });
        if (((_h = (_g = detailed === null || detailed === void 0 ? void 0 : detailed.composers) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.prompt) && fetched && !((_k = (_j = fetched.responses) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.humanMessage)) {
          setResponses({
            bubbles: [{
              type: "user",
              isDone: true,
              text: detailed.composers[0].prompt.text,
              richText: detailed.composers[0].prompt.richText,
              isOptimistic: false
            }]
          });
        }
        if ((fetched === null || fetched === void 0 ? void 0 : fetched.responses) && fetched.responses.length > 0) {
          // Process sequentially to preserve chunk semantics
          for (const r of fetched.responses) {
            // refetch diffs if tool = edit
            const tool = (_l = r.toolCall) === null || _l === void 0 ? void 0 : _l.tool;
            if (tool === tools_pb /* ClientSideToolV2 */.XaY.EDIT_FILE || tool === tools_pb /* ClientSideToolV2 */.XaY.EDIT_FILE_V2) {
              // Enable diff fetching only after we observe an edit
              shouldFetchDiffsRef.current = true;
              void fetchHashAndMaybeUpdateDiffs();
            }
            handleChunk(r, setResponses);
          }
          startIndex = fetched.responses.length;
        }
      } catch (_o) {
        // Non-fatal; proceed to attach
        (0, debug.debugLog)("Failed to fetch background composer", bcId);
      } finally {
        setIsLoadingConversation(false);
      }
      setIsAttached(true);
      const request = new background_composer_pb /* AttachBackgroundComposerRequest */.R3({
        bcId,
        startingIndex: startIndex
      });
      const stream = client.attachBackgroundComposer(request, {
        signal: abortController.signal
      });
      try {
        for (var _p = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _p = true) {
          _c = stream_1_1.value;
          _p = false;
          const message = _c;
          if (message.statusUpdate !== undefined && message.statusUpdate !== background_composer_pb /* BackgroundComposerStatus */.R6.UNSPECIFIED) {
            setStatus(message.statusUpdate);
          }
          if (message.headlessAgenticComposerResponse) {
            const tool = (_m = message.headlessAgenticComposerResponse.toolCall) === null || _m === void 0 ? void 0 : _m.tool;
            if (tool === tools_pb /* ClientSideToolV2 */.XaY.EDIT_FILE || tool === tools_pb /* ClientSideToolV2 */.XaY.EDIT_FILE_V2) {
              // Enable diff fetching only after we observe an edit
              shouldFetchDiffsRef.current = true;
              void fetchHashAndMaybeUpdateDiffs();
            }
            handleChunk(message.headlessAgenticComposerResponse, setResponses);
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_p && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      (0, debug.debugLog)("Error attaching background composer", bcId, message);
      setError(message);
    } finally {
      setIsAttached(false);
      isRunningRef.current = false;
    }
  }), [client, fetchHashAndMaybeUpdateDiffs]);
  // Auto attach on mount and bcId changes
  (0, react.useEffect)(() => {
    // Reset state when bcId changes (including clearing to null)
    setResponses({
      bubbles: []
    });
    setStatus(background_composer_pb /* BackgroundComposerStatus */.R6.UNSPECIFIED);
    setIsAttached(false);
    setError(undefined);
    setDiffs(undefined);
    hasLoadedDiffsRef.current = false;
    currentHash.current = undefined;
    // Reset diff loading state; do not show a spinner by default
    setIsLoadingDiffs(false);
    // Do not fetch diffs until we observe an edit operation
    shouldFetchDiffsRef.current = false;
    if (!bcId) return;
    void attach(bcId);
    // Defer diff fetching until an edit is observed
    return () => {
      var _a;
      (_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.abort();
      isRunningRef.current = false;
    };
  }, [attach, bcId]);
  const reconnect = (0, react.useCallback)(() => {
    var _a;
    if (!bcId) return;
    (_a = abortControllerRef.current) === null || _a === void 0 ? void 0 : _a.abort();
    isRunningRef.current = false;
    void attach(bcId);
  }, [attach, bcId]);
  // Keep statusRef in sync with state
  (0, react.useEffect)(() => {
    statusRef.current = status;
  }, [status]);
  // Periodically poll background composer status (best-effort) in addition to stream updates
  (0, react.useEffect)(() => {
    if (!bcId) return;
    let cancelled = false;
    const pollOnce = () => __awaiter(this, void 0, void 0, function* () {
      if (isPollingRef.current || cancelled) return;
      // Avoid polling when in terminal state
      if (statusRef.current === background_composer_pb /* BackgroundComposerStatus */.R6.FINISHED || statusRef.current === background_composer_pb /* BackgroundComposerStatus */.R6.ERROR || statusRef.current === background_composer_pb /* BackgroundComposerStatus */.R6.EXPIRED) {
        return;
      }
      isPollingRef.current = true;
      try {
        const resp = yield client.getBackgroundComposerStatus({
          bcId
        });
        if (!cancelled && resp && resp.status !== undefined) {
          setStatus(resp.status);
        }
      } catch (_a) {
        // ignore polling errors
      } finally {
        isPollingRef.current = false;
      }
    });
    // Initial poll shortly after mount/attach
    void pollOnce();
    const id = setInterval(() => {
      void pollOnce();
    }, constants /* BACKGROUND_COMPOSER_STATUS_POLL_INTERVAL_MS */.kh);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [client, bcId]);
  const addOptimisticFollowup = (0, react.useCallback)((text, richText) => {
    const bubbleId = (0, external_node_crypto_.randomUUID)();
    setResponses(prev => ({
      bubbles: [...prev.bubbles, {
        type: "user",
        text,
        richText: richText !== null && richText !== void 0 ? richText : text,
        isDone: false,
        isOptimistic: true,
        bubbleId
      }]
    }));
    return bubbleId;
  }, []);
  const removeOptimisticFollowup = (0, react.useCallback)(bubbleId => {
    setResponses(prev => {
      const bubbles = prev.bubbles;
      if (bubbleId) {
        const idx = bubbles.findIndex(b => b.type === "user" && b.isOptimistic && b.bubbleId === bubbleId);
        if (idx !== -1) {
          return {
            bubbles: [...bubbles.slice(0, idx), ...bubbles.slice(idx + 1)]
          };
        }
        return prev;
      }
      // Fallback: remove the last trailing optimistic user bubble
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (b.type === "user" && b.isOptimistic) {
          return {
            bubbles: [...bubbles.slice(0, i), ...bubbles.slice(i + 1)]
          };
        }
      }
      return prev;
    });
  }, []);
  return (0, react.useMemo)(() => ({
    responses,
    status,
    isAttached,
    isLoadingConversation,
    isLoadingDiffs,
    error,
    reconnect,
    addOptimisticFollowup,
    removeOptimisticFollowup,
    modelDetails,
    branchName,
    repoUrl,
    diffs
  }), [responses, status, isAttached, isLoadingConversation, isLoadingDiffs, error, reconnect, addOptimisticFollowup, removeOptimisticFollowup, modelDetails, branchName, repoUrl, diffs]);
}
function getEffectiveLength(bubbles) {
  // Ignore trailing optimistic user bubbles when inserting server updates
  let effectiveLength = bubbles.length;
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if (b.type === "user" && b.isOptimistic) {
      effectiveLength = i;
    } else {
      break;
    }
  }
  return effectiveLength;
}
function handleChunk(chunk, setResponses) {
  var _a, _b;
  // Helper to compute effective end excluding optimistic user bubbles
  const computeEffective = b => getEffectiveLength(b);
  // Append or insert a new bubble at effective end
  const addNewBubble = newBubble => {
    setResponses(prev => {
      const effectiveLength = computeEffective(prev.bubbles);
      if (effectiveLength === prev.bubbles.length) {
        return {
          bubbles: [...prev.bubbles, newBubble]
        };
      }
      return {
        bubbles: [...prev.bubbles.slice(0, effectiveLength), newBubble, ...prev.bubbles.slice(effectiveLength)]
      };
    });
  };
  // Thinking stream
  if (chunk.thinking) {
    setResponses(prev => {
      var _a, _b, _c, _d;
      const effectiveLength = computeEffective(prev.bubbles);
      const last = effectiveLength > 0 ? prev.bubbles[effectiveLength - 1] : undefined;
      if (last && last.type === "thinking" && !last.isDone) {
        const updated = Object.assign(Object.assign({}, last), {
          text: last.text + ((_b = (_a = chunk.thinking) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "")
        });
        return {
          bubbles: [...prev.bubbles.slice(0, effectiveLength - 1), updated, ...prev.bubbles.slice(effectiveLength)]
        };
      }
      // create new thinking bubble
      const newBubble = {
        type: "thinking",
        text: (_d = (_c = chunk.thinking) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : "",
        isDone: false,
        thinkingDurationMs: 0
      };
      if (effectiveLength === prev.bubbles.length) {
        return {
          bubbles: [...prev.bubbles, newBubble]
        };
      }
      return {
        bubbles: [...prev.bubbles.slice(0, effectiveLength), newBubble, ...prev.bubbles.slice(effectiveLength)]
      };
    });
  }
  // Thinking duration close-out
  if (chunk.thinkingDurationMs !== undefined) {
    setResponses(prev => {
      var _a;
      const effectiveLength = computeEffective(prev.bubbles);
      let lastThinkingIndex = -1;
      for (let i = effectiveLength - 1; i >= 0; i--) {
        if (((_a = prev.bubbles[i]) === null || _a === void 0 ? void 0 : _a.type) === "thinking") {
          lastThinkingIndex = i;
          break;
        }
      }
      if (lastThinkingIndex === -1) return prev;
      const updated = Object.assign(Object.assign({}, prev.bubbles[lastThinkingIndex]), {
        thinkingDurationMs: Number(chunk.thinkingDurationMs),
        isDone: true
      });
      return {
        bubbles: [...prev.bubbles.slice(0, lastThinkingIndex), updated, ...prev.bubbles.slice(lastThinkingIndex + 1)]
      };
    });
  }
  // If we had an unfinished thinking and now see non-thinking, mark it done
  if (!chunk.thinking && chunk.thinkingDurationMs === undefined) {
    setResponses(prev => {
      const effectiveLength = computeEffective(prev.bubbles);
      if (effectiveLength === 0) return prev;
      const last = prev.bubbles[effectiveLength - 1];
      if (!(last && last.type === "thinking" && !last.isDone)) return prev;
      const updated = Object.assign(Object.assign({}, last), {
        isDone: true
      });
      return {
        bubbles: [...prev.bubbles.slice(0, effectiveLength - 1), updated, ...prev.bubbles.slice(effectiveLength)]
      };
    });
  }
  // Status messages
  if (chunk.status) {
    setResponses(prev => {
      const effectiveLength = computeEffective(prev.bubbles);
      const last = effectiveLength > 0 ? prev.bubbles[effectiveLength - 1] : undefined;
      const cs = chunk.status;
      if (!cs) return prev;
      if (!cs.isComplete && (last === null || last === void 0 ? void 0 : last.type) !== "status") {
        const newBubble = {
          type: "status",
          statusType: cs.type,
          message: cs.message,
          isDone: cs.isComplete,
          isVisible: true
        };
        if (effectiveLength === prev.bubbles.length) {
          return {
            bubbles: [...prev.bubbles, newBubble]
          };
        }
        return {
          bubbles: [...prev.bubbles.slice(0, effectiveLength), newBubble, ...prev.bubbles.slice(effectiveLength)]
        };
      } else if ((last === null || last === void 0 ? void 0 : last.type) === "status") {
        // Update status completion and potential visibility
        const updated = Object.assign(Object.assign({}, last), {
          isDone: cs.isComplete
        });
        const bubblesAfterDone = [...prev.bubbles.slice(0, effectiveLength - 1), updated, ...prev.bubbles.slice(effectiveLength)];
        // For INDEX_SYNC, hide when done
        if (cs.type === background_composer_pb /* HeadlessAgenticComposerResponse_Status_StatusType */.yw.INDEX_SYNC) {
          const hidden = Object.assign(Object.assign({}, updated), {
            isVisible: false
          });
          return {
            bubbles: [...prev.bubbles.slice(0, effectiveLength - 1), hidden, ...prev.bubbles.slice(effectiveLength)]
          };
        }
        // For GENERIC complete, also add an explicit completed status bubble (as per Solid behavior)
        if (cs.isComplete && cs.type === background_composer_pb /* HeadlessAgenticComposerResponse_Status_StatusType */.yw.GENERIC) {
          return {
            bubbles: [...bubblesAfterDone, {
              type: "status",
              statusType: cs.type,
              message: cs.message,
              isDone: true,
              isVisible: true
            }]
          };
        }
        return {
          bubbles: bubblesAfterDone
        };
      }
      return prev;
    });
  }
  // Auto-hide transient status when a subsequent non-status chunk arrives
  if (!chunk.status) {
    setResponses(prev => {
      const effectiveLength = computeEffective(prev.bubbles);
      if (effectiveLength === 0) return prev;
      const last = prev.bubbles[effectiveLength - 1];
      if (!last || last.type !== "status") return prev;
      if (last.statusType !== background_composer_pb /* HeadlessAgenticComposerResponse_Status_StatusType */.yw.INDEX_SYNC) return prev;
      const updated = Object.assign(Object.assign({}, last), {
        isDone: true,
        isVisible: false
      });
      return {
        bubbles: [...prev.bubbles.slice(0, effectiveLength - 1), updated, ...prev.bubbles.slice(effectiveLength)]
      };
    });
  }
  // Text stream
  if (chunk.text) {
    setResponses(prev => {
      const effectiveLength = computeEffective(prev.bubbles);
      const last = effectiveLength > 0 ? prev.bubbles[effectiveLength - 1] : undefined;
      if (last && last.type === "text" && !last.isDone) {
        const updated = Object.assign(Object.assign({}, last), {
          text: last.text + chunk.text
        });
        return {
          bubbles: [...prev.bubbles.slice(0, effectiveLength - 1), updated, ...prev.bubbles.slice(effectiveLength)]
        };
      }
      const newBubble = {
        type: "text",
        text: chunk.text,
        isDone: !!chunk.isMessageDone
      };
      if (effectiveLength === prev.bubbles.length) return {
        bubbles: [...prev.bubbles, newBubble]
      };
      return {
        bubbles: [...prev.bubbles.slice(0, effectiveLength), newBubble, ...prev.bubbles.slice(effectiveLength)]
      };
    });
  }
  // Tool call streaming
  if (chunk.toolCall) {
    const toolCall = chunk.toolCall;
    setResponses(prev => {
      const index = prev.bubbles.findIndex(b => b.type === "tool" && b.toolCall.toolCallId === toolCall.toolCallId);
      if (index === -1) {
        return {
          bubbles: [...prev.bubbles, {
            type: "tool",
            toolCall,
            toolResult: undefined
          }]
        };
      }
      const prevTool = prev.bubbles[index];
      const updated = Object.assign(Object.assign({}, prevTool), {
        toolCall
      });
      return {
        bubbles: [...prev.bubbles.slice(0, index), updated, ...prev.bubbles.slice(index + 1)]
      };
    });
  }
  // Tool result finalization
  if (chunk.finalToolResult) {
    setResponses(prev => {
      const ftr = chunk.finalToolResult;
      if (!ftr) return prev;
      const index = prev.bubbles.findIndex(b => b.type === "tool" && b.toolCall.toolCallId === ftr.toolCallId);
      if (index === -1) return prev;
      const prevTool = prev.bubbles[index];
      const updated = Object.assign(Object.assign({}, prevTool), {
        toolResult: ftr.result
      });
      return {
        bubbles: [...prev.bubbles.slice(0, index), updated, ...prev.bubbles.slice(index + 1)]
      };
    });
  }
  // Human message
  if (chunk.humanMessage) {
    const hm = chunk.humanMessage;
    const bubbleId = hm.bubbleId;
    // First update existing optimistic bubble by bubbleId if present; otherwise append
    setResponses(prev => {
      var _a, _b;
      const existingIndex = bubbleId ? prev.bubbles.findIndex(b => b.type === "user" && b.bubbleId === bubbleId) : -1;
      if (existingIndex !== -1) {
        const prevUser = prev.bubbles[existingIndex];
        const updated = Object.assign(Object.assign({}, prevUser), {
          text: hm.text,
          richText: (_a = hm.richText) !== null && _a !== void 0 ? _a : "",
          isOptimistic: false
        });
        return {
          bubbles: [...prev.bubbles.slice(0, existingIndex), updated, ...prev.bubbles.slice(existingIndex + 1)]
        };
      } else {
        // Append at the end
        const newBubble = {
          type: "user",
          text: hm.text,
          richText: (_b = hm.richText) !== null && _b !== void 0 ? _b : "",
          isDone: !!chunk.isMessageDone,
          isOptimistic: false,
          bubbleId
        };
        return {
          bubbles: [...prev.bubbles, newBubble]
        };
      }
    });
    // After incorporating server message, drop one trailing optimistic placeholder if any
    setResponses(prev => {
      const bubbles = prev.bubbles;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (b.type === "user" && b.isOptimistic) {
          return {
            bubbles: [...bubbles.slice(0, i), ...bubbles.slice(i + 1)]
          };
        }
      }
      return prev;
    });
  }
  // Close out the message
  if (chunk.isMessageDone) {
    setResponses(prev => {
      const effectiveLength = computeEffective(prev.bubbles);
      if (effectiveLength === 0) return prev;
      const last = prev.bubbles[effectiveLength - 1];
      if (!last || last.type !== "text" && last.type !== "user" && last.type !== "thinking") return prev;
      const updated = Object.assign(Object.assign({}, last), {
        isDone: true
      });
      return {
        bubbles: [...prev.bubbles.slice(0, effectiveLength - 1), updated, ...prev.bubbles.slice(effectiveLength)]
      };
    });
  }
  // Error bubble
  if (chunk.error) {
    addNewBubble({
      type: "error",
      message: ((_a = chunk.error) === null || _a === void 0 ? void 0 : _a.message) || "An unknown error occurred",
      errorDetails: (_b = chunk.error) === null || _b === void 0 ? void 0 : _b.errorDetails
    });
  }
}