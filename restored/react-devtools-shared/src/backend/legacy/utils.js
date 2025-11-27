/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function decorate(object, attr, fn) {
  var old = object[attr]; // $FlowFixMe[missing-this-annot] webpack config needs to be updated to allow `this` type annotations

  object[attr] = function (instance) {
    return fn.call(this, old, arguments);
  };
  return old;
}
function decorateMany(source, fns) {
  var olds = {};
  for (var name in fns) {
    olds[name] = decorate(source, name, fns[name]);
  }
  return olds;
}
function restoreMany(source, olds) {
  for (var name in olds) {
    source[name] = olds[name];
  }
} // $FlowFixMe[missing-this-annot] webpack config needs to be updated to allow `this` type annotations

function forceUpdate(instance) {
  if (typeof instance.forceUpdate === 'function') {
    instance.forceUpdate();
  } else if (instance.updater != null && typeof instance.updater.enqueueForceUpdate === 'function') {
    instance.updater.enqueueForceUpdate(this, function () {}, 'forceUpdate');
  }
}