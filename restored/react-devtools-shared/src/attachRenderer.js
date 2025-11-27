/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

// this is the backend that is compatible with all older React versions

function isMatchingRender(version) {
  return !hasAssignedBackend(version);
}
function attachRenderer(hook, id, renderer, global, shouldStartProfilingNow, profilingSettings) {
  // only attach if the renderer is compatible with the current version of the backend
  if (!isMatchingRender(renderer.reconcilerVersion || renderer.version)) {
    return;
  }
  var rendererInterface = hook.rendererInterfaces.get(id); // Inject any not-yet-injected renderers (if we didn't reload-and-profile)

  if (rendererInterface == null) {
    if (typeof renderer.getCurrentComponentInfo === 'function') {
      // react-flight/client
      rendererInterface = attach(hook, id, renderer, global);
    } else if (
    // v16-19
    typeof renderer.findFiberByHostInstance === 'function' ||
    // v16.8+
    renderer.currentDispatcherRef != null) {
      // react-reconciler v16+
      rendererInterface = renderer_attach(hook, id, renderer, global, shouldStartProfilingNow, profilingSettings);
    } else if (renderer.ComponentTree) {
      // react-dom v15
      rendererInterface = legacy_renderer_attach(hook, id, renderer, global);
    } else {// Older react-dom or other unsupported renderer version
    }
  }
  return rendererInterface;
}