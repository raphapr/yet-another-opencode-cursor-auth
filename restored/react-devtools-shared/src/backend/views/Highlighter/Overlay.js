function Overlay_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function Overlay_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function Overlay_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) Overlay_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) Overlay_defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var Overlay_assign = Object.assign; // Note that the Overlay components are not affected by the active Theme,
// because they highlight elements in the main Chrome window (outside of devtools).
// The colors below were chosen to roughly match those used by Chrome devtools.

var OverlayRect = /*#__PURE__*/function () {
  function OverlayRect(doc, container) {
    Overlay_classCallCheck(this, OverlayRect);
    this.node = doc.createElement('div');
    this.border = doc.createElement('div');
    this.padding = doc.createElement('div');
    this.content = doc.createElement('div');
    this.border.style.borderColor = overlayStyles.border;
    this.padding.style.borderColor = overlayStyles.padding;
    this.content.style.backgroundColor = overlayStyles.background;
    Overlay_assign(this.node.style, {
      borderColor: overlayStyles.margin,
      pointerEvents: 'none',
      position: 'fixed'
    });
    this.node.style.zIndex = '10000000';
    this.node.appendChild(this.border);
    this.border.appendChild(this.padding);
    this.padding.appendChild(this.content);
    container.appendChild(this.node);
  }
  return Overlay_createClass(OverlayRect, [{
    key: "remove",
    value: function remove() {
      if (this.node.parentNode) {
        this.node.parentNode.removeChild(this.node);
      }
    }
  }, {
    key: "update",
    value: function update(box, dims) {
      boxWrap(dims, 'margin', this.node);
      boxWrap(dims, 'border', this.border);
      boxWrap(dims, 'padding', this.padding);
      Overlay_assign(this.content.style, {
        height: box.height - dims.borderTop - dims.borderBottom - dims.paddingTop - dims.paddingBottom + 'px',
        width: box.width - dims.borderLeft - dims.borderRight - dims.paddingLeft - dims.paddingRight + 'px'
      });
      Overlay_assign(this.node.style, {
        top: box.top - dims.marginTop + 'px',
        left: box.left - dims.marginLeft + 'px'
      });
    }
  }]);
}();
var OverlayTip = /*#__PURE__*/function () {
  function OverlayTip(doc, container) {
    Overlay_classCallCheck(this, OverlayTip);
    this.tip = doc.createElement('div');
    Overlay_assign(this.tip.style, {
      display: 'flex',
      flexFlow: 'row nowrap',
      backgroundColor: '#333740',
      borderRadius: '2px',
      fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
      fontWeight: 'bold',
      padding: '3px 5px',
      pointerEvents: 'none',
      position: 'fixed',
      fontSize: '12px',
      whiteSpace: 'nowrap'
    });
    this.nameSpan = doc.createElement('span');
    this.tip.appendChild(this.nameSpan);
    Overlay_assign(this.nameSpan.style, {
      color: '#ee78e6',
      borderRight: '1px solid #aaaaaa',
      paddingRight: '0.5rem',
      marginRight: '0.5rem'
    });
    this.dimSpan = doc.createElement('span');
    this.tip.appendChild(this.dimSpan);
    Overlay_assign(this.dimSpan.style, {
      color: '#d7d7d7'
    });
    this.tip.style.zIndex = '10000000';
    container.appendChild(this.tip);
  }
  return Overlay_createClass(OverlayTip, [{
    key: "remove",
    value: function remove() {
      if (this.tip.parentNode) {
        this.tip.parentNode.removeChild(this.tip);
      }
    }
  }, {
    key: "updateText",
    value: function updateText(name, width, height) {
      this.nameSpan.textContent = name;
      this.dimSpan.textContent = Math.round(width) + 'px × ' + Math.round(height) + 'px';
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(dims, bounds) {
      var tipRect = this.tip.getBoundingClientRect();
      var tipPos = findTipPos(dims, bounds, {
        width: tipRect.width,
        height: tipRect.height
      });
      Overlay_assign(this.tip.style, tipPos.style);
    }
  }]);
}();
var Overlay = /*#__PURE__*/function () {
  function Overlay(agent) {
    Overlay_classCallCheck(this, Overlay);

    // Find the root window, because overlays are positioned relative to it.
    var currentWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;
    this.window = currentWindow; // When opened in shells/dev, the tooltip should be bound by the app iframe, not by the topmost window.

    var tipBoundsWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;
    this.tipBoundsWindow = tipBoundsWindow;
    var doc = currentWindow.document;
    this.container = doc.createElement('div');
    this.container.style.zIndex = '10000000';
    this.tip = new OverlayTip(doc, this.container);
    this.rects = [];
    this.agent = agent;
    doc.body.appendChild(this.container);
  }
  return Overlay_createClass(Overlay, [{
    key: "remove",
    value: function remove() {
      this.tip.remove();
      this.rects.forEach(function (rect) {
        rect.remove();
      });
      this.rects.length = 0;
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  }, {
    key: "inspect",
    value: function inspect(nodes, name) {
      var _this = this;

      // We can't get the size of text nodes or comment nodes. React as of v15
      // heavily uses comment nodes to delimit text.
      var elements = nodes.filter(function (node) {
        return node.nodeType === Node.ELEMENT_NODE;
      });
      while (this.rects.length > elements.length) {
        var rect = this.rects.pop(); // $FlowFixMe[incompatible-use]

        rect.remove();
      }
      if (elements.length === 0) {
        return;
      }
      while (this.rects.length < elements.length) {
        this.rects.push(new OverlayRect(this.window.document, this.container));
      }
      var outerBox = {
        top: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
        left: Number.POSITIVE_INFINITY
      };
      elements.forEach(function (element, index) {
        var box = getNestedBoundingClientRect(element, _this.window);
        var dims = getElementDimensions(element);
        outerBox.top = Math.min(outerBox.top, box.top - dims.marginTop);
        outerBox.right = Math.max(outerBox.right, box.left + box.width + dims.marginRight);
        outerBox.bottom = Math.max(outerBox.bottom, box.top + box.height + dims.marginBottom);
        outerBox.left = Math.min(outerBox.left, box.left - dims.marginLeft);
        var rect = _this.rects[index];
        rect.update(box, dims);
      });
      if (!name) {
        name = elements[0].nodeName.toLowerCase();
        var node = elements[0];
        var ownerName = this.agent.getComponentNameForHostInstance(node);
        if (ownerName) {
          name += ' (in ' + ownerName + ')';
        }
      }
      this.tip.updateText(name, outerBox.right - outerBox.left, outerBox.bottom - outerBox.top);
      var tipBounds = getNestedBoundingClientRect(this.tipBoundsWindow.document.documentElement, this.window);
      this.tip.updatePosition({
        top: outerBox.top,
        left: outerBox.left,
        height: outerBox.bottom - outerBox.top,
        width: outerBox.right - outerBox.left
      }, {
        top: tipBounds.top + this.tipBoundsWindow.scrollY,
        left: tipBounds.left + this.tipBoundsWindow.scrollX,
        height: this.tipBoundsWindow.innerHeight,
        width: this.tipBoundsWindow.innerWidth
      });
    }
  }]);
}();
function findTipPos(dims, bounds, tipSize) {
  var tipHeight = Math.max(tipSize.height, 20);
  var tipWidth = Math.max(tipSize.width, 60);
  var margin = 5;
  var top;
  if (dims.top + dims.height + tipHeight <= bounds.top + bounds.height) {
    if (dims.top + dims.height < bounds.top + 0) {
      top = bounds.top + margin;
    } else {
      top = dims.top + dims.height + margin;
    }
  } else if (dims.top - tipHeight <= bounds.top + bounds.height) {
    if (dims.top - tipHeight - margin < bounds.top + margin) {
      top = bounds.top + margin;
    } else {
      top = dims.top - tipHeight - margin;
    }
  } else {
    top = bounds.top + bounds.height - tipHeight - margin;
  }
  var left = dims.left + margin;
  if (dims.left < bounds.left) {
    left = bounds.left + margin;
  }
  if (dims.left + tipWidth > bounds.left + bounds.width) {
    left = bounds.left + bounds.width - tipWidth - margin;
  }
  top += 'px';
  left += 'px';
  return {
    style: {
      top: top,
      left: left
    }
  };
}
function boxWrap(dims, what, node) {
  Overlay_assign(node.style, {
    borderTopWidth: dims[what + 'Top'] + 'px',
    borderLeftWidth: dims[what + 'Left'] + 'px',
    borderRightWidth: dims[what + 'Right'] + 'px',
    borderBottomWidth: dims[what + 'Bottom'] + 'px',
    borderStyle: 'solid'
  });
}
var overlayStyles = {
  background: 'rgba(120, 170, 210, 0.7)',
  padding: 'rgba(77, 200, 0, 0.3)',
  margin: 'rgba(255, 155, 0, 0.3)',
  border: 'rgba(255, 200, 50, 0.3)'
};