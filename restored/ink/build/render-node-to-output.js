__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__,
      /* harmony export */K: () => (/* binding */renderNodeToScreenReaderOutput)
      /* harmony export */
    });
    /* harmony import */
    var widest_line__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/.pnpm/widest-line@5.0.0/node_modules/widest-line/index.js");
    /* harmony import */
    var indent_string__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/indent-string@5.0.0/node_modules/indent-string/index.js");
    /* harmony import */
    var yoga_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/yoga-layout@3.2.1/node_modules/yoga-layout/dist/src/index.js");
    /* harmony import */
    var _wrap_text_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/wrap-text.js");
    /* harmony import */
    var _get_max_width_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/get-max-width.js");
    /* harmony import */
    var _squash_text_nodes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../ink/build/squash-text-nodes.js");
    /* harmony import */
    var _render_border_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/render-border.js");
    /* harmony import */
    var _render_background_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../ink/build/render-background.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([yoga_layout__WEBPACK_IMPORTED_MODULE_0__, _get_max_width_js__WEBPACK_IMPORTED_MODULE_2__]);
    [yoga_layout__WEBPACK_IMPORTED_MODULE_0__, _get_max_width_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;

    // If parent container is `<Box>`, text nodes will be treated as separate nodes in
    // the tree and will have their own coordinates in the layout.
    // To ensure text nodes are aligned correctly, take X and Y of the first text node
    // and use it as offset for the rest of the nodes
    // Only first node is taken into account, because other text nodes can't have margin or padding,
    // so their coordinates will be relative to the first node anyway
    const applyPaddingToText = (node, text) => {
      const yogaNode = node.childNodes[0]?.yogaNode;
      if (yogaNode) {
        const offsetX = yogaNode.getComputedLeft();
        const offsetY = yogaNode.getComputedTop();
        text = '\n'.repeat(offsetY) + (0, indent_string__WEBPACK_IMPORTED_MODULE_4__ /* ["default"] */.A)(text, offsetX);
      }
      return text;
    };
    const renderNodeToScreenReaderOutput = (node, options = {}) => {
      if (options.skipStaticElements && node.internal_static) {
        return '';
      }
      if (node.yogaNode?.getDisplay() === yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.DISPLAY_NONE) {
        return '';
      }
      let output = '';
      if (node.nodeName === 'ink-text') {
        output = (0, _squash_text_nodes_js__WEBPACK_IMPORTED_MODULE_5__ /* ["default"] */.A)(node);
      } else if (node.nodeName === 'ink-box' || node.nodeName === 'ink-root') {
        const separator = node.style.flexDirection === 'row' || node.style.flexDirection === 'row-reverse' ? ' ' : '\n';
        const childNodes = node.style.flexDirection === 'row-reverse' || node.style.flexDirection === 'column-reverse' ? [...node.childNodes].reverse() : [...node.childNodes];
        output = childNodes.map(childNode => {
          const screenReaderOutput = renderNodeToScreenReaderOutput(childNode, {
            parentRole: node.internal_accessibility?.role,
            skipStaticElements: options.skipStaticElements
          });
          // When a text node contains multiple lines, it's still a single text node.
          // We need to split it into lines and then join them with the separator.
          return screenReaderOutput.split('\n').join(separator);
        }).filter(Boolean).join(separator);
      }
      if (node.internal_accessibility) {
        const {
          role,
          state
        } = node.internal_accessibility;
        if (state) {
          const stateKeys = Object.keys(state);
          const stateDescription = stateKeys.filter(key => state[key]).join(', ');
          if (stateDescription) {
            output = `(${stateDescription}) ${output}`;
          }
        }
        if (role && role !== options.parentRole) {
          output = `${role}: ${output}`;
        }
      }
      return output;
    };
    // After nodes are laid out, render each to output object, which later gets rendered to terminal
    const renderNodeToOutput = (node, output, options) => {
      const {
        offsetX = 0,
        offsetY = 0,
        transformers = [],
        skipStaticElements
      } = options;
      if (skipStaticElements && node.internal_static) {
        return;
      }
      const {
        yogaNode
      } = node;
      if (yogaNode) {
        if (yogaNode.getDisplay() === yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.DISPLAY_NONE) {
          return;
        }
        // Left and top positions in Yoga are relative to their parent node
        const x = offsetX + yogaNode.getComputedLeft();
        const y = offsetY + yogaNode.getComputedTop();
        // Transformers are functions that transform final text output of each component
        // See Output class for logic that applies transformers
        let newTransformers = transformers;
        if (typeof node.internal_transform === 'function') {
          newTransformers = [node.internal_transform, ...transformers];
        }
        if (node.nodeName === 'ink-text') {
          let text = (0, _squash_text_nodes_js__WEBPACK_IMPORTED_MODULE_5__ /* ["default"] */.A)(node);
          if (text.length > 0) {
            const textWrap = node.style.textWrap ?? 'wrap';
            // Skip wrapping if no-wrap is specified
            if (textWrap !== 'no-wrap') {
              const currentWidth = (0, widest_line__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.A)(text);
              const maxWidth = (0, _get_max_width_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A)(yogaNode);
              if (currentWidth > maxWidth) {
                text = (0, _wrap_text_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)(text, maxWidth, textWrap);
              }
            }
            text = applyPaddingToText(node, text);
            output.write(x, y, text, {
              transformers: newTransformers
            });
          }
          return;
        }
        let clipped = false;
        if (node.nodeName === 'ink-box') {
          (0, _render_background_js__WEBPACK_IMPORTED_MODULE_7__ /* ["default"] */.A)(x, y, node, output);
          (0, _render_border_js__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A)(x, y, node, output);
          const clipHorizontally = node.style.overflowX === 'hidden' || node.style.overflow === 'hidden';
          const clipVertically = node.style.overflowY === 'hidden' || node.style.overflow === 'hidden';
          if (clipHorizontally || clipVertically) {
            const x1 = clipHorizontally ? x + yogaNode.getComputedBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_LEFT) : undefined;
            const x2 = clipHorizontally ? x + yogaNode.getComputedWidth() - yogaNode.getComputedBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_RIGHT) : undefined;
            const y1 = clipVertically ? y + yogaNode.getComputedBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_TOP) : undefined;
            const y2 = clipVertically ? y + yogaNode.getComputedHeight() - yogaNode.getComputedBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_BOTTOM) : undefined;
            output.clip({
              x1,
              x2,
              y1,
              y2
            });
            clipped = true;
          }
        }
        if (node.nodeName === 'ink-root' || node.nodeName === 'ink-box') {
          for (const childNode of node.childNodes) {
            renderNodeToOutput(childNode, output, {
              offsetX: x,
              offsetY: y,
              transformers: newTransformers,
              skipStaticElements
            });
          }
          if (clipped) {
            output.unclip();
          }
        }
      }
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = renderNodeToOutput;
    //# sourceMappingURL=render-node-to-output.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/