__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export BackgroundComposerSelection */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _background_composer_status_displays_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/background-composer-status-displays.tsx");
    /* harmony import */
    var _base_composer_item_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/base-composer-item.tsx");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _background_composer_status_displays_js__WEBPACK_IMPORTED_MODULE_3__, _base_composer_item_js__WEBPACK_IMPORTED_MODULE_4__]);
    [_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__, _background_composer_status_displays_js__WEBPACK_IMPORTED_MODULE_3__, _base_composer_item_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const BackgroundComposerSelection = ({
      status,
      composers,
      error,
      onSelect
    }) => {
      const [selectedIndex, setSelectedIndex] = useState(0);
      // Handle keyboard input for navigation and selection
      useInput((input, key) => {
        if (status !== "success") return;
        if (key.upArrow && selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1);
        } else if (key.downArrow && selectedIndex < composers.length - 1) {
          setSelectedIndex(selectedIndex + 1);
        } else if (key.return && onSelect && composers[selectedIndex]) {
          onSelect(composers[selectedIndex].bcId);
        } else if (input >= "1" && input <= "9") {
          const index = parseInt(input, 10) - 1;
          if (index >= 0 && index < composers.length) {
            setSelectedIndex(index);
          }
        } else if (key.return && selectedIndex >= 0 && selectedIndex < composers.length && onSelect) {
          onSelect(composers[selectedIndex].bcId);
        }
      });
      // Reset selection when composers change
      useEffect(() => {
        setSelectedIndex(0);
      }, []);
      if (status === "loading") {
        return _jsx(LoadingDisplay, {});
      }
      if (status === "error") {
        return _jsx(SimpleErrorDisplay, {
          error: error
        });
      }
      if (composers.length === 0) {
        return _jsx(EmptyDisplay, {});
      }
      return _jsxs(Box, {
        flexDirection: "column",
        padding: 1,
        children: [_jsx(Box, {
          marginBottom: 1,
          children: _jsx(Text, {
            bold: true,
            color: "foreground",
            children: "Select a background composer to attach to:"
          })
        }), composers.map((composer, index) => _jsx(BaseComposerItem, {
          composer: composer,
          index: index,
          isSelected: index === selectedIndex,
          showIndex: true,
          variant: "selection"
        }, composer.bcId)), _jsx(Box, {
          marginTop: 1,
          children: _jsx(Text, {
            color: "gray",
            children: "Use \u2191/\u2193 arrow keys or numbers 1-9 to select, Enter to attach"
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