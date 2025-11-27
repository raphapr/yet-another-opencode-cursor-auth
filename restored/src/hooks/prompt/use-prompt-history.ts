var use_prompt_history_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function usePromptHistory() {
  const [items, setItems] = (0, react.useState)([]);
  const [index, setIndex] = (0, react.useState)(null);
  const draftRef = (0, react.useRef)("");
  (0, react.useEffect)(() => {
    (() => use_prompt_history_awaiter(this, void 0, void 0, function* () {
      try {
        const loaded = yield loadHistory();
        setItems(loaded);
      } catch (err) {
        debug.debugLog === null || debug.debugLog === void 0 ? void 0 : (0, debug.debugLog)("history.init.error", String(err));
      }
    }))();
  }, []);
  const begin = (0, react.useCallback)(currentValue => {
    if (items.length === 0) return null;
    if (index != null) return null;
    draftRef.current = currentValue;
    setIndex(0);
    const selected = items[0];
    return selected !== null && selected !== void 0 ? selected : null;
  }, [items, index]);
  const up = (0, react.useCallback)(() => {
    var _a;
    if (items.length === 0) return null;
    const next = Math.min(items.length - 1, (index !== null && index !== void 0 ? index : 0) + 1);
    setIndex(next);
    return (_a = items[next]) !== null && _a !== void 0 ? _a : null;
  }, [items, index]);
  const down = (0, react.useCallback)(currentValue => {
    var _a;
    if (index == null) return null;
    const next = index - 1;
    if (next >= 0) {
      setIndex(next);
      return {
        value: (_a = items[next]) !== null && _a !== void 0 ? _a : currentValue,
        exited: false
      };
    }
    setIndex(null);
    return {
      value: draftRef.current,
      exited: true
    };
  }, [index, items]);
  const record = (0, react.useCallback)(submitted => use_prompt_history_awaiter(this, void 0, void 0, function* () {
    try {
      const newItems = yield addToHistory(submitted);
      setItems(newItems);
      setIndex(null);
      draftRef.current = "";
    } catch (err) {
      debug.debugLog === null || debug.debugLog === void 0 ? void 0 : (0, debug.debugLog)("history.add.error", String(err));
    }
  }), []);
  const reset = (0, react.useCallback)(() => {
    setIndex(null);
    draftRef.current = "";
  }, []);
  const resetForSlash = (0, react.useCallback)(() => {
    setIndex(null);
    draftRef.current = "";
  }, []);
  const clearAllLocal = (0, react.useCallback)(() => {
    setItems([]);
    setIndex(null);
    draftRef.current = "";
  }, []);
  return (0, react.useMemo)(() => ({
    items,
    index,
    inHistory: index != null,
    draftBeforeHistory: draftRef.current,
    begin,
    up,
    down,
    record,
    reset,
    resetForSlash,
    clearAllLocal
  }), [items, index, begin, up, down, record, reset, resetForSlash, clearAllLocal]);
}