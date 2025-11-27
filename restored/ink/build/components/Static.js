/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */A: () => (/* binding */Static)
  /* harmony export */
});
/* harmony import */
var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/index.js");

/**
 * `<Static>` component permanently renders its output above everything else.
 * It's useful for displaying activity like completed tasks or logs - things that
 * are not changing after they're rendered (hence the name "Static").
 *
 * It's preferred to use `<Static>` for use cases like these, when you can't know
 * or control the amount of items that need to be rendered.
 *
 * For example, [Tap](https://github.com/tapjs/node-tap) uses `<Static>` to display
 * a list of completed tests. [Gatsby](https://github.com/gatsbyjs/gatsby) uses it
 * to display a list of generated pages, while still displaying a live progress bar.
 */
function Static(props) {
  const {
    items,
    children: render,
    style: customStyle
  } = props;
  const [index, setIndex] = (0, react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const itemsToRender = (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return items.slice(index);
  }, [items, index]);
  (0, react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    setIndex(items.length);
  }, [items.length]);
  const children = itemsToRender.map((item, itemIndex) => {
    return render(item, index + itemIndex);
  });
  const style = (0, react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    position: 'absolute',
    flexDirection: 'column',
    ...customStyle
  }), [customStyle]);
  return react__WEBPACK_IMPORTED_MODULE_0__.createElement("ink-box", {
    internal_static: true,
    style: style
  }, children);
}
//# sourceMappingURL=Static.js.map

/***/