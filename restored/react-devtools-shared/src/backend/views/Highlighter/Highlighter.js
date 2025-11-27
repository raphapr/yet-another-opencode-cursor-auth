/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var SHOW_DURATION = 2000;
var timeoutID = null;
var overlay = null;
function hideOverlayNative(agent) {
  agent.emit('hideNativeHighlight');
}
function hideOverlayWeb() {
  timeoutID = null;
  if (overlay !== null) {
    overlay.remove();
    overlay = null;
  }
}
function hideOverlay(agent) {
  return isReactNativeEnvironment() ? hideOverlayNative(agent) : hideOverlayWeb();
}
function showOverlayNative(elements, agent) {
  agent.emit('showNativeHighlight', elements);
}
function showOverlayWeb(elements, componentName, agent, hideAfterTimeout) {
  if (timeoutID !== null) {
    clearTimeout(timeoutID);
  }
  if (overlay === null) {
    overlay = new Overlay(agent);
  }
  overlay.inspect(elements, componentName);
  if (hideAfterTimeout) {
    timeoutID = setTimeout(function () {
      return hideOverlay(agent);
    }, SHOW_DURATION);
  }
}
function showOverlay(elements, componentName, agent, hideAfterTimeout) {
  return isReactNativeEnvironment() ? showOverlayNative(elements, agent) : showOverlayWeb(elements, componentName, agent, hideAfterTimeout);
}