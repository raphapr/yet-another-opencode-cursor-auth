__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var yoga_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/yoga-layout@3.2.1/node_modules/yoga-layout/dist/src/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([yoga_layout__WEBPACK_IMPORTED_MODULE_0__]);
    yoga_layout__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const getMaxWidth = yogaNode => {
      return yogaNode.getComputedWidth() - yogaNode.getComputedPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_LEFT) - yogaNode.getComputedPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_RIGHT) - yogaNode.getComputedBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_LEFT) - yogaNode.getComputedBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_RIGHT);
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = getMaxWidth;
    //# sourceMappingURL=get-max-width.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/