__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var _render_node_to_output_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../ink/build/render-node-to-output.js");
    /* harmony import */
    var _output_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/output.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_render_node_to_output_js__WEBPACK_IMPORTED_MODULE_0__]);
    _render_node_to_output_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const renderer = (node, isScreenReaderEnabled) => {
      if (node.yogaNode) {
        if (isScreenReaderEnabled) {
          const output = (0, _render_node_to_output_js__WEBPACK_IMPORTED_MODULE_0__ /* .renderNodeToScreenReaderOutput */.K)(node, {
            skipStaticElements: true
          });
          const outputHeight = output === '' ? 0 : output.split('\n').length;
          let staticOutput = '';
          if (node.staticNode) {
            staticOutput = (0, _render_node_to_output_js__WEBPACK_IMPORTED_MODULE_0__ /* .renderNodeToScreenReaderOutput */.K)(node.staticNode, {
              skipStaticElements: false
            });
          }
          return {
            output,
            outputHeight,
            staticOutput: staticOutput ? `${staticOutput}\n` : ''
          };
        }
        const output = new _output_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A({
          width: node.yogaNode.getComputedWidth(),
          height: node.yogaNode.getComputedHeight()
        });
        (0, _render_node_to_output_js__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.A)(node, output, {
          skipStaticElements: true
        });
        let staticOutput;
        if (node.staticNode?.yogaNode) {
          staticOutput = new _output_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A({
            width: node.staticNode.yogaNode.getComputedWidth(),
            height: node.staticNode.yogaNode.getComputedHeight()
          });
          (0, _render_node_to_output_js__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.A)(node.staticNode, staticOutput, {
            skipStaticElements: false
          });
        }
        const {
          output: generatedOutput,
          height: outputHeight
        } = output.get();
        return {
          output: generatedOutput,
          outputHeight,
          // Newline at the end is needed, because static output doesn't have one, so
          // interactive output will override last line of static output
          staticOutput: staticOutput ? `${staticOutput.get().output}\n` : ''
        };
      }
      return {
        output: '',
        outputHeight: 0,
        staticOutput: ''
      };
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = renderer;
    //# sourceMappingURL=renderer.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/