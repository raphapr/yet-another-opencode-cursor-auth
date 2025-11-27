/** biome-ignore-all lint/correctness/useHookAtTopLevel: We disable based on a constant but Biome can't see that */
var use_at_palette_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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

// Trigger when '@' is at start-of-line or preceded by a non-path character.
// "Non-path" excludes characters that are allowed inside the path fragment
// after '@' (letters, digits, '.', '_', '-', '/'). This lets patterns like
// "(@" or '"@' trigger, while avoiding mid-token cases like 'foo@bar'.
// Group 1 captures the optional preceding delimiter (or empty at start),
// Group 2 captures the fragment after '@'.
const AT_REGEX = /(^|[^A-Za-z0-9._\-/])@([A-Za-z0-9._\-/]*)$/;
const DEBOUNCE_MS = 200;
function useAtPaletteDisabled() {
  return {
    active: false,
    suggestions: [],
    index: 0,
    windowStart: 0,
    next: () => {},
    prev: () => {},
    reset: () => {},
    acceptExpansion: () => null,
    hide: () => {},
    suppress: () => {}
  };
}
function useAtPaletteEnabled(value, opts) {
  const [suggestions, setSuggestions] = (0, react.useState)([]);
  const [active, setActive] = (0, react.useState)(false);
  const [suppressed, setSuppressed] = (0, react.useState)(false);
  const lastValueRef = (0, react.useRef)(value);
  // Track the latest computation request to prevent race conditions
  const computationIdRef = (0, react.useRef)(0);
  const nav = (0, use_windowed_nav /* useWindowedNav */.m)(6);
  (0, react.useEffect)(() => {
    const changed = value !== lastValueRef.current;
    lastValueRef.current = value;
    // Reset suppression when pattern disappears or user starts a slash command
    if (!AT_REGEX.test(value) || value.startsWith("/")) {
      if (suppressed) setSuppressed(false);
    }
    const match = value.match(AT_REGEX);
    if (!match) {
      setActive(prev => prev ? false : prev);
      if (suggestions.length !== 0) setSuggestions([]);
      nav.setLength(0);
      return;
    }
    if (suppressed) {
      setActive(prev => prev ? false : prev);
      if (suggestions.length !== 0) setSuggestions([]);
      nav.setLength(0);
      return;
    }
    const fragment = match[2];
    // Compute suggestions immediately on first activation; debounce while active
    const compute = () => use_at_palette_awaiter(this, void 0, void 0, function* () {
      // Increment computation ID to track this request
      const currentComputationId = ++computationIdRef.current;
      // Ensure index uses the provided rgPath if supplied
      if (opts === null || opts === void 0 ? void 0 : opts.rgPath) {
        yield ensureFileIndex({
          rgPath: opts.rgPath
        });
      } else {
        yield ensureFileIndex();
      }
      // Check if this computation is still the latest one before proceeding
      if (currentComputationId !== computationIdRef.current) {
        // A newer computation has started, discard these results
        return;
      }
      const res = (yield getAtFileSuggestions(fragment)).map(s => s.path);
      // Final staleness check before applying state updates
      if (currentComputationId !== computationIdRef.current) {
        // A newer computation has started, discard these results
        return;
      }
      if (res.length !== suggestions.length || res.some((p, i) => p !== suggestions[i])) {
        setSuggestions(res);
      }
      nav.setLength(res.length);
      const visible = res.length > 0;
      setActive(prev => prev !== visible ? visible : prev);
      if (visible && changed) {
        nav.reset();
      }
    });
    if (!active) {
      void compute().catch(() => {
        /* ignore errors */
      });
      return;
    }
    const t = setTimeout(() => void compute().catch(() => {
      /* ignore errors */
    }), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, suppressed, active, nav.reset, nav.setLength, opts === null || opts === void 0 ? void 0 : opts.rgPath, suggestions]);
  const acceptExpansion = (0, react.useCallback)(input => {
    if (!active || suggestions.length === 0) return null;
    const chosen = suggestions[nav.index];
    if (!chosen) return null;
    const append = chosen.endsWith("/") ? `@${chosen}` : `@${chosen} `;
    const rebuilt = input.replace(AT_REGEX, (_m, g1) => `${g1}${append}`);
    return rebuilt;
  }, [active, suggestions, nav.index]);
  const hide = (0, react.useCallback)(() => {
    setActive(false);
  }, []);
  const suppress = (0, react.useCallback)(() => {
    setSuppressed(true);
    setActive(false);
  }, []);
  return (0, react.useMemo)(() => ({
    active,
    suggestions,
    index: nav.index,
    windowStart: nav.windowStart,
    next: nav.next,
    prev: nav.prev,
    reset: nav.reset,
    acceptExpansion,
    hide,
    suppress
  }), [active, suggestions, nav.index, nav.windowStart, nav.next, nav.prev, nav.reset, acceptExpansion, hide, suppress]);
}
function useAtPalette(value, opts) {
  if (!constants /* AT_PALETTE_ENABLED */.KD) {
    return useAtPaletteDisabled();
  }
  return useAtPaletteEnabled(value, opts);
}