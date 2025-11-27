__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */Bq: () => (/* binding */setAttribute),
      /* harmony export */Mq: () => (/* binding */createTextNode),
      /* harmony export */RM: () => (/* binding */createNode),
      /* harmony export */V6: () => (/* binding */appendChildNode),
      /* harmony export */V8: () => (/* binding */removeChildNode),
      /* harmony export */bC: () => (/* binding */insertBeforeNode),
      /* harmony export */eC: () => (/* binding */setStyle),
      /* harmony export */x6: () => (/* binding */setTextNodeValue)
      /* harmony export */
    });
    /* harmony import */
    var yoga_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/yoga-layout@3.2.1/node_modules/yoga-layout/dist/src/index.js");
    /* harmony import */
    var _measure_text_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/measure-text.js");
    /* harmony import */
    var _wrap_text_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../ink/build/wrap-text.js");
    /* harmony import */
    var _squash_text_nodes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/squash-text-nodes.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([yoga_layout__WEBPACK_IMPORTED_MODULE_0__]);
    yoga_layout__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const createNode = nodeName => {
      const node = {
        nodeName,
        style: {},
        attributes: {},
        childNodes: [],
        parentNode: undefined,
        yogaNode: nodeName === 'ink-virtual-text' ? undefined : yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.Node.create(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        internal_accessibility: {}
      };
      if (nodeName === 'ink-text') {
        node.yogaNode?.setMeasureFunc(measureTextNode.bind(null, node));
      }
      return node;
    };
    const appendChildNode = (node, childNode) => {
      if (childNode.parentNode) {
        removeChildNode(childNode.parentNode, childNode);
      }
      childNode.parentNode = node;
      node.childNodes.push(childNode);
      if (childNode.yogaNode) {
        node.yogaNode?.insertChild(childNode.yogaNode, node.yogaNode.getChildCount());
      }
      if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
        markNodeAsDirty(node);
      }
    };
    const insertBeforeNode = (node, newChildNode, beforeChildNode) => {
      if (newChildNode.parentNode) {
        removeChildNode(newChildNode.parentNode, newChildNode);
      }
      newChildNode.parentNode = node;
      const index = node.childNodes.indexOf(beforeChildNode);
      if (index >= 0) {
        node.childNodes.splice(index, 0, newChildNode);
        if (newChildNode.yogaNode) {
          node.yogaNode?.insertChild(newChildNode.yogaNode, index);
        }
        return;
      }
      node.childNodes.push(newChildNode);
      if (newChildNode.yogaNode) {
        node.yogaNode?.insertChild(newChildNode.yogaNode, node.yogaNode.getChildCount());
      }
      if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
        markNodeAsDirty(node);
      }
    };
    const removeChildNode = (node, removeNode) => {
      if (removeNode.yogaNode) {
        removeNode.parentNode?.yogaNode?.removeChild(removeNode.yogaNode);
      }
      removeNode.parentNode = undefined;
      const index = node.childNodes.indexOf(removeNode);
      if (index >= 0) {
        node.childNodes.splice(index, 1);
      }
      if (node.nodeName === 'ink-text' || node.nodeName === 'ink-virtual-text') {
        markNodeAsDirty(node);
      }
    };
    const setAttribute = (node, key, value) => {
      if (key === 'internal_accessibility') {
        node.internal_accessibility = value;
        return;
      }
      node.attributes[key] = value;
    };
    const setStyle = (node, style) => {
      node.style = style;
    };
    const createTextNode = text => {
      const node = {
        nodeName: '#text',
        nodeValue: text,
        yogaNode: undefined,
        parentNode: undefined,
        style: {}
      };
      setTextNodeValue(node, text);
      return node;
    };
    const measureTextNode = function (node, width) {
      const text = node.nodeName === '#text' ? node.nodeValue : (0, _squash_text_nodes_js__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.A)(node);
      const dimensions = (0, _measure_text_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)(text);
      const textWrap = node.style?.textWrap ?? 'wrap';
      // If no-wrap is specified, return dimensions as-is
      if (textWrap === 'no-wrap') {
        return dimensions;
      }
      // Text fits into container, no need to wrap
      if (dimensions.width <= width) {
        return dimensions;
      }
      // This is happening when <Box> is shrinking child nodes and Yoga asks
      // if we can fit this text node in a <1px space, so we just tell Yoga "no"
      if (dimensions.width >= 1 && width > 0 && width < 1) {
        return dimensions;
      }
      const wrappedText = (0, _wrap_text_js__WEBPACK_IMPORTED_MODULE_2__ /* ["default"] */.A)(text, width, textWrap);
      return (0, _measure_text_js__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)(wrappedText);
    };
    const findClosestYogaNode = node => {
      if (!node?.parentNode) {
        return undefined;
      }
      return node.yogaNode ?? findClosestYogaNode(node.parentNode);
    };
    const markNodeAsDirty = node => {
      // Mark closest Yoga node as dirty to measure text dimensions again
      const yogaNode = findClosestYogaNode(node);
      yogaNode?.markDirty();
    };
    const setTextNodeValue = (node, text) => {
      if (typeof text !== 'string') {
        text = String(text);
      }
      node.nodeValue = text;
      markNodeAsDirty(node);
    };
    //# sourceMappingURL=dom.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/