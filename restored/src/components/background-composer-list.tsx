__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export BackgroundComposerList */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _utils_background_composer_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/background-composer-utils.ts");
    /* harmony import */
    var _background_composer_status_displays_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/background-composer-status-displays.tsx");
    /* harmony import */
    var _base_composer_item_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/base-composer-item.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _background_composer_status_displays_js__WEBPACK_IMPORTED_MODULE_3__, _base_composer_item_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _background_composer_status_displays_js__WEBPACK_IMPORTED_MODULE_3__, _base_composer_item_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const ComposerGroup = ({
      title,
      composers,
      count,
      selectedComposerId,
      onSelectComposer
    }) => {
      if (composers.length === 0) return null;
      return _jsxs(Box, {
        flexDirection: "column",
        marginBottom: 1,
        children: [_jsxs(Box, {
          marginBottom: 1,
          children: [_jsxs(Text, {
            bold: true,
            color: "foreground",
            children: [title, " "]
          }), _jsx(Text, {
            color: "gray",
            children: count
          })]
        }), composers.map(composer => _jsx(BaseComposerItem, {
          composer: composer,
          isSelected: selectedComposerId === composer.bcId,
          onSelect: onSelectComposer,
          variant: "list"
        }, composer.bcId))]
      });
    };
    const BackgroundComposerList = ({
      status,
      composers,
      error,
      selectedComposerId,
      onSelectComposer
    }) => {
      if (status === "error") {
        return _jsx(ErrorDisplay, {
          error: error
        });
      }
      if (composers.length === 0) {
        return _jsx(EmptyDisplay, {});
      }
      // Group composers by time
      const today = composers.filter(c => getTimeCategory(c.createdAtMs) === "Today");
      const thisWeek = composers.filter(c => getTimeCategory(c.createdAtMs) === "This Week");
      const older = composers.filter(c => getTimeCategory(c.createdAtMs) === "Older");
      return _jsxs(Box, {
        flexDirection: "column",
        padding: 1,
        children: [today.length > 0 && _jsx(ComposerGroup, {
          title: "Today",
          composers: today,
          count: today.length,
          selectedComposerId: selectedComposerId,
          onSelectComposer: onSelectComposer
        }), thisWeek.length > 0 && _jsx(ComposerGroup, {
          title: "This Week",
          composers: thisWeek,
          count: thisWeek.length,
          selectedComposerId: selectedComposerId,
          onSelectComposer: onSelectComposer
        }), older.length > 0 && _jsx(ComposerGroup, {
          title: "Older",
          composers: older,
          count: older.length,
          selectedComposerId: selectedComposerId,
          onSelectComposer: onSelectComposer
        }), onSelectComposer && _jsx(Box, {
          children: _jsx(Text, {
            color: "gray",
            children: "Tip: Use 'cursor chat' to start an interactive session"
          })
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/