__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* unused harmony export BaseComposerItem */
    /* harmony import */var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var _utils_background_composer_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/utils/background-composer-utils.ts");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const BaseComposerItem = ({
      composer,
      isSelected = false,
      showIndex = false,
      index,
      variant = "list"
    }) => {
      const timeAgo = formatTimestamp(composer.createdAtMs);
      const statusIcon = getStatusIcon(composer.status);
      const statusColor = getStatusColor(composer.status);
      const repoName = extractRepoName(composer.repoUrl);
      const borderColor = isSelected ? "blue" : variant === "selection" ? "black" : undefined;
      const titleColor = isSelected && variant === "selection" ? "white" : undefined;
      return _jsxs(Box, {
        flexDirection: "column",
        marginBottom: 1,
        borderLeft: variant === "list" ? isSelected : true,
        borderRight: false,
        borderTop: false,
        borderBottom: false,
        borderStyle: variant === "selection" ? "single" : undefined,
        borderColor: borderColor,
        paddingLeft: variant === "list" && isSelected ? 1 : variant === "selection" ? 1 : 0,
        children: [_jsx(Box, {
          flexDirection: "row",
          justifyContent: "space-between",
          children: _jsxs(Box, {
            flexDirection: "row",
            alignItems: "center",
            children: [showIndex && typeof index === "number" && _jsxs(Text, {
              color: "gray",
              children: ["[", index + 1, "]"]
            }), _jsx(Box, {
              marginLeft: showIndex ? 1 : 0,
              children: _jsx(Text, {
                color: statusColor,
                children: statusIcon
              })
            }), _jsx(Box, {
              marginLeft: 1,
              children: _jsx(Text, {
                bold: true,
                color: titleColor,
                children: truncateText(composer.name, variant === "selection" ? 40 : 45)
              })
            }), composer.isUnread && _jsxs(Text, {
              color: "blue",
              bold: true,
              children: [" ", "\u2022"]
            }), _jsx(Box, {
              marginLeft: 1,
              children: _jsxs(Text, {
                color: "gray",
                children: ["(", timeAgo, ")"]
              })
            })]
          })
        }), _jsxs(Box, {
          flexDirection: "row",
          marginLeft: showIndex ? 4 : 2,
          children: [variant === "list" && _jsxs(Text, {
            color: "gray",
            children: [timeAgo, " \u2022 "]
          }), _jsx(Text, {
            color: "cyan",
            children: truncateText(repoName, 32)
          }), _jsx(Text, {
            color: "gray",
            children: " \u2022 "
          }), _jsx(Text, {
            color: "cyan",
            children: truncateText(composer.branchName, 64)
          })]
        }), _jsx(Box, {
          flexDirection: "row",
          marginLeft: showIndex ? 4 : 2,
          children: _jsx(Text, {
            color: "gray",
            dimColor: true,
            children: composer.bcId
          })
        })]
      });
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/