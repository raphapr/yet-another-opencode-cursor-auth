/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => (/* binding */AnysphereStatic)
  /* harmony export */
});
/* harmony import */
var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");
function AnysphereStatic(props) {
  const {
    items,
    children: render
  } = props;
  const [index, setIndex] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const itemsToRender = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    return items.slice(index);
  }, [items, index]);
  (0, react__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(() => {
    setIndex(items.length);
  }, [items.length]);
  const children = itemsToRender.map((item, itemIndex) => {
    return render(item, index + itemIndex);
  });
  return (
    // @ts-expect-error - ink-box is a custom element
    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ink-box", {
      internal_static: true,
      style: {
        position: "absolute",
        flexDirection: "column"
      },
      children: children
    })
  );
}

/***/