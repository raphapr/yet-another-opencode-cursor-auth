__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var node_stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:stream");
    /* harmony import */
    var node_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:process");
    /* harmony import */
    var _ink_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/ink.js");
    /* harmony import */
    var _instances_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/instances.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_ink_js__WEBPACK_IMPORTED_MODULE_2__]);
    _ink_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

    /**
     * Mount a component and render the output.
     */
    const render = (node, options) => {
      const inkOptions = {
        stdout: node_process__WEBPACK_IMPORTED_MODULE_1__.stdout,
        stdin: node_process__WEBPACK_IMPORTED_MODULE_1__.stdin,
        stderr: node_process__WEBPACK_IMPORTED_MODULE_1__.stderr,
        debug: false,
        exitOnCtrlC: true,
        patchConsole: true,
        ...getOptions(options)
      };
      const instance = getInstance(inkOptions.stdout, () => new _ink_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A(inkOptions));
      instance.render(node);
      return {
        rerender: instance.render,
        unmount() {
          instance.unmount();
        },
        waitUntilExit: instance.waitUntilExit,
        cleanup: () => _instances_js__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A.delete(inkOptions.stdout),
        clear: instance.clear
      };
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = render;
    const getOptions = (stdout = {}) => {
      if (stdout instanceof node_stream__WEBPACK_IMPORTED_MODULE_0__.Stream) {
        return {
          stdout,
          stdin: node_process__WEBPACK_IMPORTED_MODULE_1__.stdin
        };
      }
      return stdout;
    };
    const getInstance = (stdout, createInstance) => {
      let instance = _instances_js__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A.get(stdout);
      if (!instance) {
        instance = createInstance();
        _instances_js__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A.set(stdout, instance);
      }
      return instance;
    };
    //# sourceMappingURL=render.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/