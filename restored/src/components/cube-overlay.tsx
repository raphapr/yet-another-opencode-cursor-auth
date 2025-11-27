__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */a: () => (/* binding */CubeOverlay)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _assets_ascii_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/assets/ascii.json");
    /* harmony import */
    var _ephemeral_bridge_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/ephemeral-bridge.ts");
    /* harmony import */
    var _onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/onboarding-ui.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const CubeOverlay = ({
      onClose
    }) => {
      var _a, _b;
      const frames = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => _assets_ascii_json__WEBPACK_IMPORTED_MODULE_3__, []);
      const [verticalScale] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0.6);
      const [horizontalScale] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(1);
      const [offsetColumns] = (0, react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
      // Compute left trim once to stabilize horizontal position across frames
      const trimLeftColumns = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0, _onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .computeLeftTrimColumns */.Wv)(frames), [frames]);
      (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useInput */.Ge)((input, key) => {
        if (key.escape || key.return || input === "q" || input === "Q" || key.ctrl && input === "c") {
          onClose();
        }
      });
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .useStdout */.t$)();
      // Use consistent terminal dimensions from useStdout hook for proper resizing
      const width = Math.max(1, (_a = stdout === null || stdout === void 0 ? void 0 : stdout.columns) !== null && _a !== void 0 ? _a : 80);
      const height = Math.max(1, (_b = stdout === null || stdout === void 0 ? void 0 : stdout.rows) !== null && _b !== void 0 ? _b : 24);
      // Pre-compute a stable bounding box to prevent residual glyphs.
      const asciiW = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0, _onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .computeAsciiWidth */.vY)(frames, horizontalScale, offsetColumns, trimLeftColumns), [frames, horizontalScale, offsetColumns, trimLeftColumns]);
      const asciiH = (0, react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0, _onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .computeAsciiHeight */.W7)(frames, verticalScale), [frames, verticalScale]);
      // Suppress global ephemeral error printing while overlay is visible to
      // prevent raw stderr writes from corrupting the alt screen drawing.
      (0, react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        const noop = () => {};
        (0, _ephemeral_bridge_js__WEBPACK_IMPORTED_MODULE_4__ /* .setEphemeralListener */.al)(noop);
        return () => (0, _ephemeral_bridge_js__WEBPACK_IMPORTED_MODULE_4__ /* .setEphemeralListener */.al)(null);
      }, []);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
        width: width,
        height: height,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Box */.az, {
          width: asciiW,
          height: asciiH,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_onboarding_ui_js__WEBPACK_IMPORTED_MODULE_5__ /* .AnimatedAscii */.Hk, {
            frames: frames,
            intervalMs: 50,
            verticalScale: verticalScale,
            horizontalScale: horizontalScale,
            offsetColumns: offsetColumns,
            trimLeftColumns: trimLeftColumns
          })
        })
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/