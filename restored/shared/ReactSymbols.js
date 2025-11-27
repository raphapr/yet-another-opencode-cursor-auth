function ReactSymbols_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    ReactSymbols_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    ReactSymbols_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return ReactSymbols_typeof(obj);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.

var REACT_LEGACY_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_ELEMENT_TYPE = renameElementSymbol ? Symbol.for('react.transitional.element') : REACT_LEGACY_ELEMENT_TYPE;
var REACT_PORTAL_TYPE = Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
var REACT_CONSUMER_TYPE = Symbol.for('react.consumer');
var REACT_CONTEXT_TYPE = Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = Symbol.for('react.memo');
var REACT_LAZY_TYPE = Symbol.for('react.lazy');
var REACT_SCOPE_TYPE = Symbol.for('react.scope');
var REACT_ACTIVITY_TYPE = Symbol.for('react.activity');
var REACT_LEGACY_HIDDEN_TYPE = Symbol.for('react.legacy_hidden');
var REACT_TRACING_MARKER_TYPE = Symbol.for('react.tracing_marker');
var REACT_MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel');
var REACT_POSTPONE_TYPE = Symbol.for('react.postpone');
var REACT_VIEW_TRANSITION_TYPE = Symbol.for('react.view_transition');
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || ReactSymbols_typeof(maybeIterable) !== 'object') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}
var ASYNC_ITERATOR = Symbol.asyncIterator;