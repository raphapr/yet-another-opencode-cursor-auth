__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export TurnFileChanges */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _utils_path_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/path-utils.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const calculateLineChanges = change => {
      const before = change.before || "";
      const after = change.after || "";
      if (change.before === undefined) {
        // New file - all lines are added
        const afterLines = after.split("\n");
        // Don't count empty files as having 1 line
        const linesAdded = after.trim() === "" ? 0 : afterLines.length;
        return {
          added: linesAdded,
          removed: 0,
          total: linesAdded
        };
      }
      if (change.after === undefined) {
        // Deleted file - all lines are removed
        const beforeLines = before.split("\n");
        // Don't count empty files as having 1 line
        const linesRemoved = before.trim() === "" ? 0 : beforeLines.length;
        return {
          added: 0,
          removed: linesRemoved,
          total: linesRemoved
        };
      }
      // Modified file - use proper diff algorithm
      const beforeLines = before.split("\n");
      const afterLines = after.split("\n");
      let added = 0;
      let removed = 0;
      let beforeIndex = 0;
      let afterIndex = 0;
      const isCommon = (aIndex, bIndex) => {
        return beforeLines[aIndex] === afterLines[bIndex];
      };
      const foundSubsequence = (nCommon, aCommon, bCommon) => {
        // Count removed lines (lines that exist in before but not in after)
        for (let i = beforeIndex; i < aCommon; i++) {
          removed++;
        }
        // Count added lines (lines that exist in after but not in before)
        for (let i = afterIndex; i < bCommon; i++) {
          added++;
        }
        // Skip the common lines
        beforeIndex = aCommon + nCommon;
        afterIndex = bCommon + nCommon;
      };
      // Run the diff algorithm
      diffSequences(beforeLines.length, afterLines.length, isCommon, foundSubsequence);
      // Handle remaining lines at the end
      for (let i = beforeIndex; i < beforeLines.length; i++) {
        removed++;
      }
      for (let i = afterIndex; i < afterLines.length; i++) {
        added++;
      }
      return {
        added,
        removed,
        total: added + removed
      };
    };
    const TurnFileChanges = ({
      fileChanges,
      compact = false
    }) => {
      if (!fileChanges || fileChanges.length === 0) {
        return null;
      }
      const getChangeType = change => {
        if (change.before === undefined) return "created";
        if (change.after === undefined) return "deleted";
        return "modified";
      };
      const getChangeColor = change => {
        if (change.before === undefined) return "green";
        if (change.after === undefined) return "red";
        return "yellow";
      };
      const getChangeIcon = change => {
        if (change.before === undefined) return "+";
        if (change.after === undefined) return "-";
        return "~";
      };
      if (compact) {
        return _jsx(Box, {
          flexDirection: "column",
          children: fileChanges.map(change => {
            const lineChanges = calculateLineChanges(change);
            const changeType = getChangeType(change);
            const relativePath = toRelativePath(change.path);
            const formatLineChanges = () => {
              if (changeType === "created") {
                return `+${lineChanges.added}`;
              }
              if (changeType === "deleted") {
                return `-${lineChanges.removed}`;
              }
              // Modified file
              if (lineChanges.added === 0 && lineChanges.removed === 0) {
                return "0";
              }
              if (lineChanges.added === 0) {
                return `-${lineChanges.removed}`;
              }
              if (lineChanges.removed === 0) {
                return `+${lineChanges.added}`;
              }
              return `+${lineChanges.added}/-${lineChanges.removed}`;
            };
            return _jsx(Box, {
              children: _jsxs(Text, {
                children: [_jsx(Text, {
                  color: getChangeColor(change),
                  dimColor: true,
                  children: getChangeIcon(change)
                }), _jsxs(Text, {
                  children: [" ", relativePath]
                }), _jsxs(Text, {
                  dimColor: true,
                  children: [" (", formatLineChanges(), ")"]
                })]
              })
            }, change.path);
          })
        });
      }
      return _jsxs(Box, {
        flexDirection: "column",
        marginTop: 1,
        children: [_jsxs(Text, {
          color: "gray",
          dimColor: true,
          children: ["Files changed (", fileChanges.length, "):"]
        }), fileChanges.map(change => {
          const relativePath = toRelativePath(change.path);
          return _jsxs(Box, {
            marginLeft: 1,
            children: [_jsxs(Text, {
              color: getChangeColor(change),
              dimColor: true,
              children: [getChangeIcon(change), " [", getChangeType(change), "]"]
            }), _jsxs(Text, {
              children: [" ", relativePath]
            })]
          }, change.path);
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/