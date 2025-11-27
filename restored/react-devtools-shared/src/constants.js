/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var CHROME_WEBSTORE_EXTENSION_ID = 'fmkadmapgofadopljbjfkapdkoienihi';
var INTERNAL_EXTENSION_ID = 'dnjnjgbfilfphmojnmhliehogmojhclc';
var LOCAL_EXTENSION_ID = 'ikiahnapldjmdmpkmfhjdjilojjhgcbf'; // Flip this flag to true to enable verbose console debug logging.

var __DEBUG__ = false; // Flip this flag to true to enable performance.mark() and performance.measure() timings.

var __PERFORMANCE_PROFILE__ = false;
var TREE_OPERATION_ADD = 1;
var TREE_OPERATION_REMOVE = 2;
var TREE_OPERATION_REORDER_CHILDREN = 3;
var TREE_OPERATION_UPDATE_TREE_BASE_DURATION = 4;
var TREE_OPERATION_UPDATE_ERRORS_OR_WARNINGS = 5;
var TREE_OPERATION_REMOVE_ROOT = 6;
var TREE_OPERATION_SET_SUBTREE_MODE = 7;
var PROFILING_FLAG_BASIC_SUPPORT = 1;
var PROFILING_FLAG_TIMELINE_SUPPORT = 2;
var LOCAL_STORAGE_DEFAULT_TAB_KEY = 'React::DevTools::defaultTab';
var constants_LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY = 'React::DevTools::componentFilters';
var SESSION_STORAGE_LAST_SELECTION_KEY = 'React::DevTools::lastSelection';
var constants_LOCAL_STORAGE_OPEN_IN_EDITOR_URL = 'React::DevTools::openInEditorUrl';
var LOCAL_STORAGE_OPEN_IN_EDITOR_URL_PRESET = 'React::DevTools::openInEditorUrlPreset';
var LOCAL_STORAGE_PARSE_HOOK_NAMES_KEY = 'React::DevTools::parseHookNames';
var constants_SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY = 'React::DevTools::recordChangeDescriptions';
var constants_SESSION_STORAGE_RECORD_TIMELINE_KEY = 'React::DevTools::recordTimeline';
var constants_SESSION_STORAGE_RELOAD_AND_PROFILE_KEY = 'React::DevTools::reloadAndProfile';
var LOCAL_STORAGE_BROWSER_THEME = 'React::DevTools::theme';
var LOCAL_STORAGE_TRACE_UPDATES_ENABLED_KEY = 'React::DevTools::traceUpdatesEnabled';
var LOCAL_STORAGE_SUPPORTS_PROFILING_KEY = 'React::DevTools::supportsProfiling';
var PROFILER_EXPORT_VERSION = 5;
var FIREFOX_CONSOLE_DIMMING_COLOR = 'color: rgba(124, 124, 124, 0.75)';
var ANSI_STYLE_DIMMING_TEMPLATE = '\x1b[2;38;2;124;124;124m%s\x1b[0m';
var ANSI_STYLE_DIMMING_TEMPLATE_WITH_COMPONENT_STACK = '\x1b[2;38;2;124;124;124m%s %o\x1b[0m';