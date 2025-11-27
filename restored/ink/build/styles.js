__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
  try {
    /* harmony export */__webpack_require__.d(__webpack_exports__, {
      /* harmony export */A: () => __WEBPACK_DEFAULT_EXPORT__
      /* harmony export */
    });
    /* harmony import */
    var yoga_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/yoga-layout@3.2.1/node_modules/yoga-layout/dist/src/index.js");
    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([yoga_layout__WEBPACK_IMPORTED_MODULE_0__]);
    yoga_layout__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
    const applyPositionStyles = (node, style) => {
      if ('position' in style) {
        node.setPositionType(style.position === 'absolute' ? yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.POSITION_TYPE_ABSOLUTE : yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.POSITION_TYPE_RELATIVE);
      }
    };
    const applyMarginStyles = (node, style) => {
      if ('margin' in style) {
        node.setMargin(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_ALL, style.margin ?? 0);
      }
      if ('marginX' in style) {
        node.setMargin(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_HORIZONTAL, style.marginX ?? 0);
      }
      if ('marginY' in style) {
        node.setMargin(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_VERTICAL, style.marginY ?? 0);
      }
      if ('marginLeft' in style) {
        node.setMargin(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_START, style.marginLeft || 0);
      }
      if ('marginRight' in style) {
        node.setMargin(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_END, style.marginRight || 0);
      }
      if ('marginTop' in style) {
        node.setMargin(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_TOP, style.marginTop || 0);
      }
      if ('marginBottom' in style) {
        node.setMargin(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_BOTTOM, style.marginBottom || 0);
      }
    };
    const applyPaddingStyles = (node, style) => {
      if ('padding' in style) {
        node.setPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_ALL, style.padding ?? 0);
      }
      if ('paddingX' in style) {
        node.setPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_HORIZONTAL, style.paddingX ?? 0);
      }
      if ('paddingY' in style) {
        node.setPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_VERTICAL, style.paddingY ?? 0);
      }
      if ('paddingLeft' in style) {
        node.setPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_LEFT, style.paddingLeft || 0);
      }
      if ('paddingRight' in style) {
        node.setPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_RIGHT, style.paddingRight || 0);
      }
      if ('paddingTop' in style) {
        node.setPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_TOP, style.paddingTop || 0);
      }
      if ('paddingBottom' in style) {
        node.setPadding(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_BOTTOM, style.paddingBottom || 0);
      }
    };
    const applyFlexStyles = (node, style) => {
      if ('flexGrow' in style) {
        node.setFlexGrow(style.flexGrow ?? 0);
      }
      if ('flexShrink' in style) {
        node.setFlexShrink(typeof style.flexShrink === 'number' ? style.flexShrink : 1);
      }
      if ('flexWrap' in style) {
        if (style.flexWrap === 'nowrap') {
          node.setFlexWrap(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.WRAP_NO_WRAP);
        }
        if (style.flexWrap === 'wrap') {
          node.setFlexWrap(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.WRAP_WRAP);
        }
        if (style.flexWrap === 'wrap-reverse') {
          node.setFlexWrap(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.WRAP_WRAP_REVERSE);
        }
      }
      if ('flexDirection' in style) {
        if (style.flexDirection === 'row') {
          node.setFlexDirection(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.FLEX_DIRECTION_ROW);
        }
        if (style.flexDirection === 'row-reverse') {
          node.setFlexDirection(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.FLEX_DIRECTION_ROW_REVERSE);
        }
        if (style.flexDirection === 'column') {
          node.setFlexDirection(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.FLEX_DIRECTION_COLUMN);
        }
        if (style.flexDirection === 'column-reverse') {
          node.setFlexDirection(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.FLEX_DIRECTION_COLUMN_REVERSE);
        }
      }
      if ('flexBasis' in style) {
        if (typeof style.flexBasis === 'number') {
          node.setFlexBasis(style.flexBasis);
        } else if (typeof style.flexBasis === 'string') {
          node.setFlexBasisPercent(Number.parseInt(style.flexBasis, 10));
        } else {
          // This should be replaced with node.setFlexBasisAuto() when new Yoga release is out
          node.setFlexBasis(Number.NaN);
        }
      }
      if ('alignItems' in style) {
        if (style.alignItems === 'stretch' || !style.alignItems) {
          node.setAlignItems(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_STRETCH);
        }
        if (style.alignItems === 'flex-start') {
          node.setAlignItems(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_FLEX_START);
        }
        if (style.alignItems === 'center') {
          node.setAlignItems(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_CENTER);
        }
        if (style.alignItems === 'flex-end') {
          node.setAlignItems(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_FLEX_END);
        }
      }
      if ('alignSelf' in style) {
        if (style.alignSelf === 'auto' || !style.alignSelf) {
          node.setAlignSelf(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_AUTO);
        }
        if (style.alignSelf === 'flex-start') {
          node.setAlignSelf(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_FLEX_START);
        }
        if (style.alignSelf === 'center') {
          node.setAlignSelf(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_CENTER);
        }
        if (style.alignSelf === 'flex-end') {
          node.setAlignSelf(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.ALIGN_FLEX_END);
        }
      }
      if ('justifyContent' in style) {
        if (style.justifyContent === 'flex-start' || !style.justifyContent) {
          node.setJustifyContent(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.JUSTIFY_FLEX_START);
        }
        if (style.justifyContent === 'center') {
          node.setJustifyContent(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.JUSTIFY_CENTER);
        }
        if (style.justifyContent === 'flex-end') {
          node.setJustifyContent(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.JUSTIFY_FLEX_END);
        }
        if (style.justifyContent === 'space-between') {
          node.setJustifyContent(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.JUSTIFY_SPACE_BETWEEN);
        }
        if (style.justifyContent === 'space-around') {
          node.setJustifyContent(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.JUSTIFY_SPACE_AROUND);
        }
        if (style.justifyContent === 'space-evenly') {
          node.setJustifyContent(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.JUSTIFY_SPACE_EVENLY);
        }
      }
    };
    const applyDimensionStyles = (node, style) => {
      if ('width' in style) {
        if (typeof style.width === 'number') {
          node.setWidth(style.width);
        } else if (typeof style.width === 'string') {
          node.setWidthPercent(Number.parseInt(style.width, 10));
        } else {
          node.setWidthAuto();
        }
      }
      if ('height' in style) {
        if (typeof style.height === 'number') {
          node.setHeight(style.height);
        } else if (typeof style.height === 'string') {
          node.setHeightPercent(Number.parseInt(style.height, 10));
        } else {
          node.setHeightAuto();
        }
      }
      if ('minWidth' in style) {
        if (typeof style.minWidth === 'string') {
          node.setMinWidthPercent(Number.parseInt(style.minWidth, 10));
        } else {
          node.setMinWidth(style.minWidth ?? 0);
        }
      }
      if ('minHeight' in style) {
        if (typeof style.minHeight === 'string') {
          node.setMinHeightPercent(Number.parseInt(style.minHeight, 10));
        } else {
          node.setMinHeight(style.minHeight ?? 0);
        }
      }
    };
    const applyDisplayStyles = (node, style) => {
      if ('display' in style) {
        node.setDisplay(style.display === 'flex' ? yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.DISPLAY_FLEX : yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.DISPLAY_NONE);
      }
    };
    const applyBorderStyles = (node, style) => {
      if ('borderStyle' in style) {
        const borderWidth = style.borderStyle ? 1 : 0;
        if (style.borderTop !== false) {
          node.setBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_TOP, borderWidth);
        }
        if (style.borderBottom !== false) {
          node.setBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_BOTTOM, borderWidth);
        }
        if (style.borderLeft !== false) {
          node.setBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_LEFT, borderWidth);
        }
        if (style.borderRight !== false) {
          node.setBorder(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.EDGE_RIGHT, borderWidth);
        }
      }
    };
    const applyGapStyles = (node, style) => {
      if ('gap' in style) {
        node.setGap(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.GUTTER_ALL, style.gap ?? 0);
      }
      if ('columnGap' in style) {
        node.setGap(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.GUTTER_COLUMN, style.columnGap ?? 0);
      }
      if ('rowGap' in style) {
        node.setGap(yoga_layout__WEBPACK_IMPORTED_MODULE_0__ /* ["default"] */.Ay.GUTTER_ROW, style.rowGap ?? 0);
      }
    };
    const styles = (node, style = {}) => {
      applyPositionStyles(node, style);
      applyMarginStyles(node, style);
      applyPaddingStyles(node, style);
      applyFlexStyles(node, style);
      applyDimensionStyles(node, style);
      applyDisplayStyles(node, style);
      applyBorderStyles(node, style);
      applyGapStyles(node, style);
    };
    /* harmony default export */
    const __WEBPACK_DEFAULT_EXPORT__ = styles;
    //# sourceMappingURL=styles.js.map
    __webpack_async_result__();
  } catch (e) {
    __webpack_async_result__(e);
  }
});

/***/