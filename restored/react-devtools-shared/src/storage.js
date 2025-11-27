/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function storage_localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function localStorageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {}
}
function storage_localStorageSetItem(key, value) {
  try {
    return localStorage.setItem(key, value);
  } catch (error) {}
}
function storage_sessionStorageGetItem(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
}
function storage_sessionStorageRemoveItem(key) {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {}
}
function storage_sessionStorageSetItem(key, value) {
  try {
    return sessionStorage.setItem(key, value);
  } catch (error) {}
}