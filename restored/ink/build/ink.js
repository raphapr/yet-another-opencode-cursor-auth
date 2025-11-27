__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => (/* binding */Ink)
      /* harmony export */
    });
    /* harmony import */
    var ansi_escapes__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("../../node_modules/.pnpm/ansi-escapes@7.0.0/node_modules/ansi-escapes/base.js");
    /* harmony import */
    var auto_bind__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("../../node_modules/.pnpm/auto-bind@5.0.1/node_modules/auto-bind/index.js");
    /* harmony import */
    var es_toolkit_compat__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/compat/function/throttle.mjs");
    /* harmony import */
    var is_in_ci__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("../../node_modules/.pnpm/is-in-ci@2.0.0/node_modules/is-in-ci/index.js");
    /* harmony import */
    var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:process");
    /* harmony import */
    var patch_console__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/patch-console@2.0.0/node_modules/patch-console/dist/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var react_reconciler_constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/.pnpm/react-reconciler@0.32.0_react@19.1.0/node_modules/react-reconciler/constants.js");
    /* harmony import */
    var signal_exit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/index.js");
    /* harmony import */
    var wrap_ansi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../../node_modules/.pnpm/wrap-ansi@9.0.0/node_modules/wrap-ansi/index.js");
    /* harmony import */
    var yoga_layout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../../node_modules/.pnpm/yoga-layout@3.2.1/node_modules/yoga-layout/dist/src/index.js");
    /* harmony import */
    var _components_AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../ink/build/components/AccessibilityContext.js");
    /* harmony import */
    var _components_App_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../ink/build/components/App.js");
    /* harmony import */
    var _dom_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../ink/build/dom.js");
    /* harmony import */
    var _instances_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../ink/build/instances.js");
    /* harmony import */
    var _log_update_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../ink/build/log-update.js");
    /* harmony import */
    var _reconciler_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../ink/build/reconciler.js");
    /* harmony import */
    var _renderer_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("../ink/build/renderer.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([yoga_layout__WEBPACK_IMPORTED_MODULE_6__, _dom_js__WEBPACK_IMPORTED_MODULE_9__, _reconciler_js__WEBPACK_IMPORTED_MODULE_12__, _renderer_js__WEBPACK_IMPORTED_MODULE_13__]);
    [yoga_layout__WEBPACK_IMPORTED_MODULE_6__, _dom_js__WEBPACK_IMPORTED_MODULE_9__, _reconciler_js__WEBPACK_IMPORTED_MODULE_12__, _renderer_js__WEBPACK_IMPORTED_MODULE_13__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__;
    const noop = () => {};
    class Ink {
      options;
      log;
      throttledLog;
      isScreenReaderEnabled;
      // Ignore last render after unmounting a tree to prevent empty output before exit
      isUnmounted;
      lastOutput;
      lastOutputHeight;
      container;
      rootNode;
      // This variable is used only in debug mode to store full static output
      // so that it's rerendered every time, not just new static parts, like in non-debug mode
      fullStaticOutput;
      exitPromise;
      restoreConsole;
      unsubscribeResize;
      constructor(options) {
        (0, auto_bind__WEBPACK_IMPORTED_MODULE_14__ /* ["default"] */.A)(this);
        this.options = options;
        this.rootNode = _dom_js__WEBPACK_IMPORTED_MODULE_9__ /* .createNode */.RM('ink-root');
        this.rootNode.onComputeLayout = this.calculateLayout;
        this.isScreenReaderEnabled = options.isScreenReaderEnabled ?? node_process__WEBPACK_IMPORTED_MODULE_0__.env['INK_SCREEN_READER'] === 'true';
        const unthrottled = options.debug || this.isScreenReaderEnabled;
        this.rootNode.onRender = unthrottled ? this.onRender : (0, es_toolkit_compat__WEBPACK_IMPORTED_MODULE_15__ /* .throttle */.n)(this.onRender, 32, {
          leading: true,
          trailing: true
        });
        this.rootNode.onImmediateRender = this.onRender;
        this.log = _log_update_js__WEBPACK_IMPORTED_MODULE_11__ /* ["default"] */.A.create(options.stdout);
        this.throttledLog = unthrottled ? this.log : (0, es_toolkit_compat__WEBPACK_IMPORTED_MODULE_15__ /* .throttle */.n)(this.log, undefined, {
          leading: true,
          trailing: true
        });
        // Ignore last render after unmounting a tree to prevent empty output before exit
        this.isUnmounted = false;
        // Store last output to only rerender when needed
        this.lastOutput = '';
        this.lastOutputHeight = 0;
        // This variable is used only in debug mode to store full static output
        // so that it's rerendered every time, not just new static parts, like in non-debug mode
        this.fullStaticOutput = '';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.container = _reconciler_js__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.A.createContainer(this.rootNode, react_reconciler_constants_js__WEBPACK_IMPORTED_MODULE_3__.LegacyRoot, null, false, null, 'id', () => {}, () => {},
        // @ts-expect-error the types for `react-reconciler` are not up to date with the library.
        // See https://github.com/facebook/react/blob/c0464aedb16b1c970d717651bba8d1c66c578729/packages/react-reconciler/src/ReactFiberReconciler.js#L236-L259
        () => {}, () => {}, null);
        // Unmount when process exits
        this.unsubscribeExit = signal_exit__WEBPACK_IMPORTED_MODULE_4__(this.unmount, {
          alwaysLast: false
        });
        if (node_process__WEBPACK_IMPORTED_MODULE_0__.env['DEV'] === 'true') {
          _reconciler_js__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.A.injectIntoDevTools({
            bundleType: 0,
            // Reporting React DOM's version, not Ink's
            // See https://github.com/facebook/react/issues/16666#issuecomment-532639905
            version: '16.13.1',
            rendererPackageName: 'ink'
          });
        }
        if (options.patchConsole) {
          this.patchConsole();
        }
        if (!is_in_ci__WEBPACK_IMPORTED_MODULE_16__ /* ["default"] */.A) {
          options.stdout.on('resize', this.resized);
          this.unsubscribeResize = () => {
            options.stdout.off('resize', this.resized);
          };
        }
      }
      resized = () => {
        this.calculateLayout();
        this.onRender();
      };
      resolveExitPromise = () => {};
      rejectExitPromise = () => {};
      unsubscribeExit = () => {};
      calculateLayout = () => {
        // The 'columns' property can be undefined or 0 when not using a TTY.
        // In that case we fall back to 80.
        const terminalWidth = this.options.stdout.columns || 80;
        this.rootNode.yogaNode.setWidth(terminalWidth);
        this.rootNode.yogaNode.calculateLayout(undefined, undefined, yoga_layout__WEBPACK_IMPORTED_MODULE_6__ /* ["default"] */.Ay.DIRECTION_LTR);
      };
      onRender = () => {
        if (this.isUnmounted) {
          return;
        }
        const {
          output,
          outputHeight,
          staticOutput
        } = (0, _renderer_js__WEBPACK_IMPORTED_MODULE_13__ /* ["default"] */.A)(this.rootNode, this.isScreenReaderEnabled);
        // If <Static> output isn't empty, it means new children have been added to it
        const hasStaticOutput = staticOutput && staticOutput !== '\n';
        if (this.options.debug) {
          if (hasStaticOutput) {
            this.fullStaticOutput += staticOutput;
          }
          this.options.stdout.write(this.fullStaticOutput + output);
          return;
        }
        if (is_in_ci__WEBPACK_IMPORTED_MODULE_16__ /* ["default"] */.A) {
          if (hasStaticOutput) {
            this.options.stdout.write(staticOutput);
          }
          this.lastOutput = output;
          this.lastOutputHeight = outputHeight;
          return;
        }
        if (this.isScreenReaderEnabled) {
          if (hasStaticOutput) {
            // We need to erase the main output before writing new static output
            const erase = this.lastOutputHeight > 0 ? ansi_escapes__WEBPACK_IMPORTED_MODULE_17__ /* .eraseLines */._W(this.lastOutputHeight) : '';
            this.options.stdout.write(erase + staticOutput);
            // After erasing, the last output is gone, so we should reset its height
            this.lastOutputHeight = 0;
          }
          if (output === this.lastOutput && !hasStaticOutput) {
            return;
          }
          const terminalWidth = this.options.stdout.columns || 80;
          const wrappedOutput = (0, wrap_ansi__WEBPACK_IMPORTED_MODULE_5__ /* ["default"] */.A)(output, terminalWidth, {
            trim: false,
            hard: true
          });
          // If we haven't erased yet, do it now.
          if (hasStaticOutput) {
            this.options.stdout.write(wrappedOutput);
          } else {
            const erase = this.lastOutputHeight > 0 ? ansi_escapes__WEBPACK_IMPORTED_MODULE_17__ /* .eraseLines */._W(this.lastOutputHeight) : '';
            this.options.stdout.write(erase + wrappedOutput);
          }
          this.lastOutput = output;
          this.lastOutputHeight = wrappedOutput === '' ? 0 : wrappedOutput.split('\n').length;
          return;
        }
        if (hasStaticOutput) {
          this.fullStaticOutput += staticOutput;
        }
        if (hasStaticOutput || output !== this.lastOutput) {
          this.throttledLog(this.fullStaticOutput + output);
        }
        this.lastOutput = output;
        this.lastOutputHeight = outputHeight;
      };
      render(node) {
        const tree = react__WEBPACK_IMPORTED_MODULE_2__.createElement(_components_AccessibilityContext_js__WEBPACK_IMPORTED_MODULE_7__ /* .accessibilityContext */.E.Provider, {
          value: {
            isScreenReaderEnabled: this.isScreenReaderEnabled
          }
        }, react__WEBPACK_IMPORTED_MODULE_2__.createElement(_components_App_js__WEBPACK_IMPORTED_MODULE_8__ /* ["default"] */.A, {
          stdin: this.options.stdin,
          stdout: this.options.stdout,
          stderr: this.options.stderr,
          writeToStdout: this.writeToStdout,
          writeToStderr: this.writeToStderr,
          exitOnCtrlC: this.options.exitOnCtrlC,
          onExit: this.unmount
        }, node));
        // @ts-expect-error the types for `react-reconciler` are not up to date with the library.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        _reconciler_js__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.A.updateContainerSync(tree, this.container, null, noop);
        // @ts-expect-error the types for `react-reconciler` are not up to date with the library.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        _reconciler_js__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.A.flushSyncWork();
      }
      writeToStdout(data) {
        if (this.isUnmounted) {
          return;
        }
        if (this.options.debug) {
          this.options.stdout.write(data + this.fullStaticOutput + this.lastOutput);
          return;
        }
        if (is_in_ci__WEBPACK_IMPORTED_MODULE_16__ /* ["default"] */.A) {
          this.options.stdout.write(data);
          return;
        }
        this.log.clear();
        this.options.stdout.write(data);
        this.log(this.lastOutput);
      }
      writeToStderr(data) {
        if (this.isUnmounted) {
          return;
        }
        if (this.options.debug) {
          this.options.stderr.write(data);
          this.options.stdout.write(this.fullStaticOutput + this.lastOutput);
          return;
        }
        if (is_in_ci__WEBPACK_IMPORTED_MODULE_16__ /* ["default"] */.A) {
          this.options.stderr.write(data);
          return;
        }
        this.log.clear();
        this.options.stderr.write(data);
        this.log(this.lastOutput);
      }
      // eslint-disable-next-line @typescript-eslint/ban-types
      unmount(error) {
        if (this.isUnmounted) {
          return;
        }
        this.calculateLayout();
        this.onRender();
        this.unsubscribeExit();
        if (typeof this.restoreConsole === 'function') {
          this.restoreConsole();
        }
        if (typeof this.unsubscribeResize === 'function') {
          this.unsubscribeResize();
        }
        // CIs don't handle erasing ansi escapes well, so it's better to
        // only render last frame of non-static output
        if (is_in_ci__WEBPACK_IMPORTED_MODULE_16__ /* ["default"] */.A) {
          this.options.stdout.write(this.lastOutput + '\n');
        } else if (!this.options.debug) {
          this.log.done();
        }
        this.isUnmounted = true;
        // @ts-expect-error the types for `react-reconciler` are not up to date with the library.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        _reconciler_js__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.A.updateContainerSync(null, this.container, null, noop);
        // @ts-expect-error the types for `react-reconciler` are not up to date with the library.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        _reconciler_js__WEBPACK_IMPORTED_MODULE_12__ /* ["default"] */.A.flushSyncWork();
        _instances_js__WEBPACK_IMPORTED_MODULE_10__ /* ["default"] */.A.delete(this.options.stdout);
        if (error instanceof Error) {
          this.rejectExitPromise(error);
        } else {
          this.resolveExitPromise();
        }
      }
      async waitUntilExit() {
        this.exitPromise ||= new Promise((resolve, reject) => {
          this.resolveExitPromise = resolve;
          this.rejectExitPromise = reject;
        });
        return this.exitPromise;
      }
      clear() {
        if (!is_in_ci__WEBPACK_IMPORTED_MODULE_16__ /* ["default"] */.A && !this.options.debug) {
          this.log.clear();
        }
      }
      patchConsole() {
        if (this.options.debug) {
          return;
        }
        this.restoreConsole = (0, patch_console__WEBPACK_IMPORTED_MODULE_1__ /* ["default"] */.A)((stream, data) => {
          if (stream === 'stdout') {
            this.writeToStdout(data);
          }
          if (stream === 'stderr') {
            const isReactMessage = data.startsWith('The above error occurred');
            if (!isReactMessage) {
              this.writeToStderr(data);
            }
          }
        });
      }
    }
    //# sourceMappingURL=ink.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/