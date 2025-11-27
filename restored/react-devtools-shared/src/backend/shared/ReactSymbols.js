/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// This list should be kept updated to reflect additions to 'shared/ReactSymbols'.
// DevTools can't import symbols from 'shared/ReactSymbols' directly for two reasons:
// 1. DevTools requires symbols which may have been deleted in more recent versions (e.g. concurrent mode)
// 2. DevTools must support both Symbol and numeric forms of each symbol;
//    Since e.g. standalone DevTools runs in a separate process, it can't rely on its own ES capabilities.
var CONCURRENT_MODE_NUMBER = 0xeacf;
var CONCURRENT_MODE_SYMBOL_STRING = 'Symbol(react.concurrent_mode)';
var CONTEXT_NUMBER = 0xeace;
var CONTEXT_SYMBOL_STRING = 'Symbol(react.context)';
var SERVER_CONTEXT_SYMBOL_STRING = 'Symbol(react.server_context)';
var DEPRECATED_ASYNC_MODE_SYMBOL_STRING = 'Symbol(react.async_mode)';
var ELEMENT_SYMBOL_STRING = 'Symbol(react.transitional.element)';
var LEGACY_ELEMENT_NUMBER = 0xeac7;
var LEGACY_ELEMENT_SYMBOL_STRING = 'Symbol(react.element)';
var DEBUG_TRACING_MODE_NUMBER = 0xeae1;
var DEBUG_TRACING_MODE_SYMBOL_STRING = 'Symbol(react.debug_trace_mode)';
var FORWARD_REF_NUMBER = 0xead0;
var FORWARD_REF_SYMBOL_STRING = 'Symbol(react.forward_ref)';
var FRAGMENT_NUMBER = 0xeacb;
var FRAGMENT_SYMBOL_STRING = 'Symbol(react.fragment)';
var LAZY_NUMBER = 0xead4;
var LAZY_SYMBOL_STRING = 'Symbol(react.lazy)';
var MEMO_NUMBER = 0xead3;
var MEMO_SYMBOL_STRING = 'Symbol(react.memo)';
var PORTAL_NUMBER = 0xeaca;
var PORTAL_SYMBOL_STRING = 'Symbol(react.portal)';
var PROFILER_NUMBER = 0xead2;
var PROFILER_SYMBOL_STRING = 'Symbol(react.profiler)';
var PROVIDER_NUMBER = 0xeacd;
var PROVIDER_SYMBOL_STRING = 'Symbol(react.provider)';
var CONSUMER_SYMBOL_STRING = 'Symbol(react.consumer)';
var SCOPE_NUMBER = 0xead7;
var SCOPE_SYMBOL_STRING = 'Symbol(react.scope)';
var STRICT_MODE_NUMBER = 0xeacc;
var STRICT_MODE_SYMBOL_STRING = 'Symbol(react.strict_mode)';
var SUSPENSE_NUMBER = 0xead1;
var SUSPENSE_SYMBOL_STRING = 'Symbol(react.suspense)';
var SUSPENSE_LIST_NUMBER = 0xead8;
var SUSPENSE_LIST_SYMBOL_STRING = 'Symbol(react.suspense_list)';
var SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED_SYMBOL_STRING = 'Symbol(react.server_context.defaultValue)';
var ReactSymbols_REACT_MEMO_CACHE_SENTINEL = Symbol.for('react.memo_cache_sentinel');