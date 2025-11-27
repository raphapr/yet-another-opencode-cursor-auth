/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var cachedStyleNameToValueMap = new Map();
function getStyleXData(data) {
  var sources = new Set();
  var resolvedStyles = {};
  crawlData(data, sources, resolvedStyles);
  return {
    sources: Array.from(sources).sort(),
    resolvedStyles: resolvedStyles
  };
}
function crawlData(data, sources, resolvedStyles) {
  if (data == null) {
    return;
  }
  if (src_isArray(data)) {
    data.forEach(function (entry) {
      if (entry == null) {
        return;
      }
      if (src_isArray(entry)) {
        crawlData(entry, sources, resolvedStyles);
      } else {
        crawlObjectProperties(entry, sources, resolvedStyles);
      }
    });
  } else {
    crawlObjectProperties(data, sources, resolvedStyles);
  }
  resolvedStyles = Object.fromEntries(Object.entries(resolvedStyles).sort());
}
function crawlObjectProperties(entry, sources, resolvedStyles) {
  var keys = Object.keys(entry);
  keys.forEach(function (key) {
    var value = entry[key];
    if (typeof value === 'string') {
      if (key === value) {
        // Special case; this key is the name of the style's source/file/module.
        sources.add(key);
      } else {
        var propertyValue = getPropertyValueForStyleName(value);
        if (propertyValue != null) {
          resolvedStyles[key] = propertyValue;
        }
      }
    } else {
      var nestedStyle = {};
      resolvedStyles[key] = nestedStyle;
      crawlData([value], sources, nestedStyle);
    }
  });
}
function getPropertyValueForStyleName(styleName) {
  if (cachedStyleNameToValueMap.has(styleName)) {
    return cachedStyleNameToValueMap.get(styleName);
  }
  for (var styleSheetIndex = 0; styleSheetIndex < document.styleSheets.length; styleSheetIndex++) {
    var styleSheet = document.styleSheets[styleSheetIndex];
    var rules = null; // this might throw if CORS rules are enforced https://www.w3.org/TR/cssom-1/#the-cssstylesheet-interface

    try {
      rules = styleSheet.cssRules;
    } catch (_e) {
      continue;
    }
    for (var ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
      if (!(rules[ruleIndex] instanceof CSSStyleRule)) {
        continue;
      }
      var rule = rules[ruleIndex];
      var cssText = rule.cssText,
        selectorText = rule.selectorText,
        style = rule.style;
      if (selectorText != null) {
        if (selectorText.startsWith(".".concat(styleName))) {
          var match = cssText.match(/{ *([a-z\-]+):/);
          if (match !== null) {
            var property = match[1];
            var value = style.getPropertyValue(property);
            cachedStyleNameToValueMap.set(styleName, value);
            return value;
          } else {
            return null;
          }
        }
      }
    }
  }
  return null;
}