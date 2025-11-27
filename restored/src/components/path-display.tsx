__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */g: () => (/* binding */PathDisplay)
      /* harmony export */
    });
    /* unused harmony export formatPath */
    /* harmony import */
    var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
    /* harmony import */
    var _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../ink/build/index.js");
    /* harmony import */
    var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__]);
    _anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

    /**
     * Intelligently truncates a path to fit within maxLength while preserving
     * the most important parts (especially the filename)
     */
    function truncatePath(path, maxLength) {
      // Detect the path separator used in this path
      const separator = path.includes("\\") ? "\\" : "/";
      if (path.length <= maxLength) {
        return {
          segments: path.split(separator),
          separator
        };
      }
      const segments = path.split(separator);
      const ellipsis = "...";
      const ellipsisLength = ellipsis.length;
      // Always try to keep the last segment (filename) intact
      const lastSegment = segments[segments.length - 1];
      // If even the filename alone is too long, truncate it
      if (lastSegment.length + ellipsisLength > maxLength) {
        const truncatedFilename = lastSegment.substring(0, maxLength - ellipsisLength);
        return {
          segments: [ellipsis, truncatedFilename],
          ellipsisIndex: 0,
          separator
        };
      }
      // Calculate how much space we have for the path excluding the filename
      const separatorLength = separator.length;
      const availableSpace = maxLength - lastSegment.length - ellipsisLength;
      // Try to fit as much of the beginning path as possible
      let currentLength = 0;
      const keptSegments = [];
      let ellipsisPosition = -1;
      // Keep segments from the beginning
      for (let i = 0; i < segments.length - 1; i++) {
        const segmentLength = segments[i].length + (i > 0 ? separatorLength : 0);
        if (currentLength + segmentLength <= availableSpace) {
          keptSegments.push(segments[i]);
          currentLength += segmentLength;
        } else {
          // We need to truncate here
          ellipsisPosition = keptSegments.length;
          break;
        }
      }
      // If we truncated, insert ellipsis
      if (ellipsisPosition !== -1) {
        keptSegments.splice(ellipsisPosition, 0, ellipsis);
        keptSegments.push(lastSegment);
        return {
          segments: keptSegments,
          ellipsisIndex: ellipsisPosition,
          separator
        };
      }
      return {
        segments,
        separator
      };
    }
    const PathDisplay = ({
      path,
      maxLength = 50,
      separatorColor = "#aaaaaa",
      segmentColor,
      ellipsisColor = "#aaaaaa",
      dimSeparators = true
    }) => {
      const {
        segments,
        ellipsisIndex,
        separator
      } = truncatePath(path, maxLength);
      return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
        children: segments.map((segment, index) => {
          const isEllipsis = index === ellipsisIndex;
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: [index > 0 && !isEllipsis && (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: separatorColor,
              dimColor: dimSeparators,
              children: separator
            }), isEllipsis ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: ellipsisColor,
              dimColor: true,
              children: segment
            }) : (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_1__ /* .Text */.EY, {
              color: segmentColor,
              children: segment
            })]
          }, segment);
        })
      });
    };
    // Export a convenience function for simple usage
    const formatPath = (path, maxLength = 50) => {
      const {
        segments,
        separator
      } = truncatePath(path, maxLength);
      // Join segments and handle ellipsis properly
      let result = "";
      segments.forEach((segment, index) => {
        if (index > 0 && segment !== "...") {
          result += separator;
        }
        result += segment;
      });
      return result;
    };
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/