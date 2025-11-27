__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:process");
    /* harmony import */
    var react_reconciler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react-reconciler@0.32.0_react@19.1.0/node_modules/react-reconciler/index.js");
    /* harmony import */
    var react_reconciler_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react-reconciler@0.32.0_react@19.1.0/node_modules/react-reconciler/constants.js");
    /* harmony import */
    var yoga_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/yoga-layout@3.2.1/node_modules/yoga-layout/dist/src/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _dom_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../ink/build/dom.js");
    /* harmony import */
    var _styles_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../ink/build/styles.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([yoga_layout__WEBPACK_IMPORTED_MODULE_3__, _dom_js__WEBPACK_IMPORTED_MODULE_5__, _styles_js__WEBPACK_IMPORTED_MODULE_6__]);
    [yoga_layout__WEBPACK_IMPORTED_MODULE_3__, _dom_js__WEBPACK_IMPORTED_MODULE_5__, _styles_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;

    // We need to conditionally perform devtools connection to avoid
    // accidentally breaking other third-party code.
    // See https://github.com/vadimdemedes/ink/issues/384
    if (node_process__WEBPACK_IMPORTED_MODULE_0__.env['DEV'] === 'true') {
      try {
        await Promise.all(/* import() */[__webpack_require__.e(3448), __webpack_require__.e(5357)]).then(__webpack_require__.bind(__webpack_require__, "../ink/build/devtools.js"));
      } catch (error) {
        if (error.code === 'ERR_MODULE_NOT_FOUND') {
          console.warn(`
The environment variable DEV is set to true, so Ink tried to import \`react-devtools-core\`,
but this failed as it was not installed. Debugging with React Devtools requires it.

To install use this command:

$ npm install --save-dev react-devtools-core
				`.trim() + '\n');
        } else {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw error;
        }
      }
    }
    const diff = (before, after) => {
      if (before === after) {
        return;
      }
      if (!before) {
        return after;
      }
      const changed = {};
      let isChanged = false;
      for (const key of Object.keys(before)) {
        const isDeleted = after ? !Object.hasOwn(after, key) : true;
        if (isDeleted) {
          changed[key] = undefined;
          isChanged = true;
        }
      }
      if (after) {
        for (const key of Object.keys(after)) {
          if (after[key] !== before[key]) {
            changed[key] = after[key];
            isChanged = true;
          }
        }
      }
      return isChanged ? changed : undefined;
    };
    const cleanupYogaNode = node => {
      node?.unsetMeasureFunc();
      node?.freeRecursive();
    };
    let currentUpdatePriority = react_reconciler_constants_js__WEBPACK_IMPORTED_MODULE_2__.NoEventPriority;
    let currentRootNode;
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = react_reconciler__WEBPACK_IMPORTED_MODULE_1__({
      getRootHostContext: () => ({
        isInsideText: false
      }),
      prepareForCommit: () => null,
      preparePortalMount: () => null,
      clearContainer: () => false,
      resetAfterCommit(rootNode) {
        if (typeof rootNode.onComputeLayout === 'function') {
          rootNode.onComputeLayout();
        }
        // Since renders are throttled at the instance level and <Static> component children
        // are rendered only once and then get deleted, we need an escape hatch to
        // trigger an immediate render to ensure <Static> children are written to output before they get erased
        if (rootNode.isStaticDirty) {
          rootNode.isStaticDirty = false;
          if (typeof rootNode.onImmediateRender === 'function') {
            rootNode.onImmediateRender();
          }
          return;
        }
        if (typeof rootNode.onRender === 'function') {
          rootNode.onRender();
        }
      },
      getChildHostContext(parentHostContext, type) {
        const previousIsInsideText = parentHostContext.isInsideText;
        const isInsideText = type === 'ink-text' || type === 'ink-virtual-text';
        if (previousIsInsideText === isInsideText) {
          return parentHostContext;
        }
        return {
          isInsideText
        };
      },
      shouldSetTextContent: () => false,
      createInstance(originalType, newProps, rootNode, hostContext) {
        if (hostContext.isInsideText && originalType === 'ink-box') {
          throw new Error(`<Box> can’t be nested inside <Text> component`);
        }
        const type = originalType === 'ink-text' && hostContext.isInsideText ? 'ink-virtual-text' : originalType;
        const node = (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .createNode */.RM)(type);
        for (const [key, value] of Object.entries(newProps)) {
          if (key === 'children') {
            continue;
          }
          if (key === 'style') {
            (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .setStyle */.eC)(node, value);
            if (node.yogaNode) {
              (0, _styles_js__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.A)(node.yogaNode, value);
            }
            continue;
          }
          if (key === 'internal_transform') {
            node.internal_transform = value;
            continue;
          }
          if (key === 'internal_static') {
            currentRootNode = rootNode;
            node.internal_static = true;
            rootNode.isStaticDirty = true;
            // Save reference to <Static> node to skip traversal of entire
            // node tree to find it
            rootNode.staticNode = node;
            continue;
          }
          (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .setAttribute */.Bq)(node, key, value);
        }
        return node;
      },
      createTextInstance(text, _root, hostContext) {
        if (!hostContext.isInsideText) {
          throw new Error(`Text string "${text}" must be rendered inside <Text> component`);
        }
        return (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .createTextNode */.Mq)(text);
      },
      resetTextContent() {},
      hideTextInstance(node) {
        (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .setTextNodeValue */.x6)(node, '');
      },
      unhideTextInstance(node, text) {
        (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .setTextNodeValue */.x6)(node, text);
      },
      getPublicInstance: instance => instance,
      hideInstance(node) {
        node.yogaNode?.setDisplay(yoga_layout__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.DISPLAY_NONE);
      },
      unhideInstance(node) {
        node.yogaNode?.setDisplay(yoga_layout__WEBPACK_IMPORTED_MODULE_3__ /* ["default"] */.Ay.DISPLAY_FLEX);
      },
      appendInitialChild: _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .appendChildNode */.V6,
      appendChild: _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .appendChildNode */.V6,
      insertBefore: _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .insertBeforeNode */.bC,
      finalizeInitialChildren() {
        return false;
      },
      isPrimaryRenderer: true,
      supportsMutation: true,
      supportsPersistence: false,
      supportsHydration: false,
      scheduleTimeout: setTimeout,
      cancelTimeout: clearTimeout,
      noTimeout: -1,
      beforeActiveInstanceBlur() {},
      afterActiveInstanceBlur() {},
      detachDeletedInstance() {},
      getInstanceFromNode: () => null,
      prepareScopeUpdate() {},
      getInstanceFromScope: () => null,
      appendChildToContainer: _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .appendChildNode */.V6,
      insertInContainerBefore: _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .insertBeforeNode */.bC,
      removeChildFromContainer(node, removeNode) {
        (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .removeChildNode */.V8)(node, removeNode);
        cleanupYogaNode(removeNode.yogaNode);
      },
      commitUpdate(node, _type, oldProps, newProps) {
        if (currentRootNode && node.internal_static) {
          currentRootNode.isStaticDirty = true;
        }
        const props = diff(oldProps, newProps);
        const style = diff(oldProps['style'], newProps['style']);
        if (!props && !style) {
          return;
        }
        if (props) {
          for (const [key, value] of Object.entries(props)) {
            if (key === 'style') {
              (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .setStyle */.eC)(node, value);
              continue;
            }
            if (key === 'internal_transform') {
              node.internal_transform = value;
              continue;
            }
            if (key === 'internal_static') {
              node.internal_static = true;
              continue;
            }
            (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .setAttribute */.Bq)(node, key, value);
          }
        }
        if (style && node.yogaNode) {
          (0, _styles_js__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.A)(node.yogaNode, style);
        }
      },
      commitTextUpdate(node, _oldText, newText) {
        (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .setTextNodeValue */.x6)(node, newText);
      },
      removeChild(node, removeNode) {
        (0, _dom_js__WEBPACK_IMPORTED_MODULE_5__ /* .removeChildNode */.V8)(node, removeNode);
        cleanupYogaNode(removeNode.yogaNode);
      },
      setCurrentUpdatePriority(newPriority) {
        currentUpdatePriority = newPriority;
      },
      getCurrentUpdatePriority: () => currentUpdatePriority,
      resolveUpdatePriority() {
        if (currentUpdatePriority !== react_reconciler_constants_js__WEBPACK_IMPORTED_MODULE_2__.NoEventPriority) {
          return currentUpdatePriority;
        }
        return react_reconciler_constants_js__WEBPACK_IMPORTED_MODULE_2__.DefaultEventPriority;
      },
      maySuspendCommit() {
        return false;
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      NotPendingTransition: undefined,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      HostTransitionContext: (0, react__WEBPACK_IMPORTED_MODULE_4__.createContext)(null),
      resetFormInstance() {},
      requestPostPaintCallback() {},
      shouldAttemptEagerTransition() {
        return false;
      },
      trackSchedulerEvent() {},
      resolveEventType() {
        return null;
      },
      resolveEventTimeStamp() {
        return -1.1;
      },
      preloadInstance() {
        return true;
      },
      startSuspendingCommit() {},
      suspendInstance() {},
      waitForCommitToBeReady() {
        return null;
      }
    });
    //# sourceMappingURL=reconciler.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
}, 1);

/***/