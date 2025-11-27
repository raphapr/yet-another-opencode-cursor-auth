__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */j: () => (/* binding */AppHeader)
      /* harmony export */
    });
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var node_os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:os");
    /* harmony import */
    var node_os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
    /* harmony import */
    var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    /* harmony import */
    var _constants_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/constants.ts");
    /* harmony import */
    var _hooks_use_current_branch_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./src/hooks/use-current-branch.ts");
    /* harmony import */
    var _hooks_use_git_root_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./src/hooks/use-git-root.ts");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./src/utils/path-utils.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const AppHeader = ({
      debugInfo,
      isRepository,
      folderMode = "cwd",
      badge,
      locationDisplayOverride,
      branchDisplayOverride,
      isBackground
    }) => {
      const baseFolderInfo = (0, react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
        const root = process.cwd();
        const home = node_os__WEBPACK_IMPORTED_MODULE_1___default().homedir();
        const displayPath = root.startsWith(home) ? `~${root.slice(home.length)}` : root;
        const name = node_path__WEBPACK_IMPORTED_MODULE_2___default().basename(root) || root;
        return {
          root,
          displayPath,
          name
        };
      }, []);
      const currentBranch = (0, _hooks_use_current_branch_js__WEBPACK_IMPORTED_MODULE_6__ /* .useCurrentBranch */.h)(baseFolderInfo);
      const gitRoot = (0, _hooks_use_git_root_js__WEBPACK_IMPORTED_MODULE_7__ /* .useGitRoot */._)(baseFolderInfo);
      const gitDisplayPath = (0, react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
        if (!gitRoot) return "";
        const home = node_os__WEBPACK_IMPORTED_MODULE_1___default().homedir();
        return gitRoot.startsWith(home) ? `~${gitRoot.slice(home.length)}` : gitRoot;
      }, [gitRoot]);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Box */.az, {
        flexDirection: "column",
        children: [debugInfo && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Box */.az, {
          marginX: 1,
          marginBottom: 1,
          paddingX: 1,
          children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Box */.az, {
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
              color: "gray",
              bold: true,
              children: "DEBUG MODE"
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
              color: "gray",
              children: "\u2022"
            }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
              color: "yellow",
              children: debugInfo.serverUrl
            })]
          })
        }), process.env.AGENT_CLI_HIDE_HEADER !== "true" && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Box */.az, {
          marginX: 1,
          paddingX: 1,
          flexDirection: "column",
          flexGrow: 1,
          marginTop: !debugInfo ? 1 : 0,
          borderLeft: true,
          children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
            color: "foreground",
            children: [isBackground ? "Cursor Background Agent" : "Cursor Agent", badge ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
              children: [" ", badge]
            }) : null]
          }), (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
            color: "foreground",
            dimColor: true,
            children: [(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
              wrap: "truncate-start",
              children: (0, _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_8__ /* .truncatePathMiddle */.tk)(locationDisplayOverride !== null && locationDisplayOverride !== void 0 ? locationDisplayOverride : folderMode === "cwd" ? baseFolderInfo.displayPath : gitDisplayPath, _constants_js__WEBPACK_IMPORTED_MODULE_5__ /* .MAX_DIRECTORY_DISPLAY_LENGTH */.DN)
            }), (branchDisplayOverride !== null && branchDisplayOverride !== void 0 ? branchDisplayOverride : currentBranch) ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
              children: [" \u00B7 ", branchDisplayOverride !== null && branchDisplayOverride !== void 0 ? branchDisplayOverride : currentBranch]
            }) : null]
          }), isRepository ? null : (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ /* .Text */.EY, {
            color: "gray",
            children: "(cwd is not a git repository, cursor rules and ignore files don't apply)"
          })]
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/