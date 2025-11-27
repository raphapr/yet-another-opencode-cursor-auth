__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */l: () => (/* binding */useScreenSize)
      /* harmony export */
    });
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_0__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    function useScreenSize() {
      const {
        stdout
      } = (0, _anysphere_ink__WEBPACK_IMPORTED_MODULE_0__ /* .useStdout */.t$)();
      const getSize = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => ({
        height: stdout.rows,
        width: stdout.columns
      }), [stdout]);
      const [size, setSize] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(getSize);
      (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        function onResize() {
          setSize(getSize());
        }
        stdout.on("resize", onResize);
        return () => {
          stdout.off("resize", onResize);
        };
      }, [stdout, getSize]);
      return size;
    }
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/