function legacy_renderer_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function legacy_renderer_objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      legacy_renderer_ownKeys(Object(source), true).forEach(function (key) {
        legacy_renderer_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      legacy_renderer_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function legacy_renderer_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function legacy_renderer_typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    legacy_renderer_typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    legacy_renderer_typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return legacy_renderer_typeof(obj);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function getData(internalInstance) {
  var displayName = null;
  var key = null; // != used deliberately here to catch undefined and null

  if (internalInstance._currentElement != null) {
    if (internalInstance._currentElement.key) {
      key = String(internalInstance._currentElement.key);
    }
    var elementType = internalInstance._currentElement.type;
    if (typeof elementType === 'string') {
      displayName = elementType;
    } else if (typeof elementType === 'function') {
      displayName = getDisplayName(elementType);
    }
  }
  return {
    displayName: displayName,
    key: key
  };
}
function getElementType(internalInstance) {
  // != used deliberately here to catch undefined and null
  if (internalInstance._currentElement != null) {
    var elementType = internalInstance._currentElement.type;
    if (typeof elementType === 'function') {
      var publicInstance = internalInstance.getPublicInstance();
      if (publicInstance !== null) {
        return types_ElementTypeClass;
      } else {
        return types_ElementTypeFunction;
      }
    } else if (typeof elementType === 'string') {
      return ElementTypeHostComponent;
    }
  }
  return ElementTypeOtherOrUnknown;
}
function getChildren(internalInstance) {
  var children = []; // If the parent is a native node without rendered children, but with
  // multiple string children, then the `element` that gets passed in here is
  // a plain value -- a string or number.

  if (legacy_renderer_typeof(internalInstance) !== 'object') {// No children
  } else if (internalInstance._currentElement === null || internalInstance._currentElement === false) {// No children
  } else if (internalInstance._renderedComponent) {
    var child = internalInstance._renderedComponent;
    if (getElementType(child) !== ElementTypeOtherOrUnknown) {
      children.push(child);
    }
  } else if (internalInstance._renderedChildren) {
    var renderedChildren = internalInstance._renderedChildren;
    for (var name in renderedChildren) {
      var _child = renderedChildren[name];
      if (getElementType(_child) !== ElementTypeOtherOrUnknown) {
        children.push(_child);
      }
    }
  } // Note: we skip the case where children are just strings or numbers
  // because the new DevTools skips over host text nodes anyway.

  return children;
}
function legacy_renderer_attach(hook, rendererID, renderer, global) {
  var idToInternalInstanceMap = new Map();
  var internalInstanceToIDMap = new WeakMap();
  var internalInstanceToRootIDMap = new WeakMap();
  var getElementIDForHostInstance = null;
  var findHostInstanceForInternalID;
  var getNearestMountedDOMNode = function getNearestMountedDOMNode(node) {
    // Not implemented.
    return null;
  };
  if (renderer.ComponentTree) {
    getElementIDForHostInstance = function getElementIDForHostInstance(node) {
      var internalInstance = renderer.ComponentTree.getClosestInstanceFromNode(node);
      return internalInstanceToIDMap.get(internalInstance) || null;
    };
    findHostInstanceForInternalID = function findHostInstanceForInternalID(id) {
      var internalInstance = idToInternalInstanceMap.get(id);
      return renderer.ComponentTree.getNodeFromInstance(internalInstance);
    };
    getNearestMountedDOMNode = function getNearestMountedDOMNode(node) {
      var internalInstance = renderer.ComponentTree.getClosestInstanceFromNode(node);
      if (internalInstance != null) {
        return renderer.ComponentTree.getNodeFromInstance(internalInstance);
      }
      return null;
    };
  } else if (renderer.Mount.getID && renderer.Mount.getNode) {
    getElementIDForHostInstance = function getElementIDForHostInstance(node) {
      // Not implemented.
      return null;
    };
    findHostInstanceForInternalID = function findHostInstanceForInternalID(id) {
      // Not implemented.
      return null;
    };
  }
  function getDisplayNameForElementID(id) {
    var internalInstance = idToInternalInstanceMap.get(id);
    return internalInstance ? getData(internalInstance).displayName : null;
  }
  function getID(internalInstance) {
    if (legacy_renderer_typeof(internalInstance) !== 'object' || internalInstance === null) {
      throw new Error('Invalid internal instance: ' + internalInstance);
    }
    if (!internalInstanceToIDMap.has(internalInstance)) {
      var _id = getUID();
      internalInstanceToIDMap.set(internalInstance, _id);
      idToInternalInstanceMap.set(_id, internalInstance);
    }
    return internalInstanceToIDMap.get(internalInstance);
  }
  function areEqualArrays(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  } // This is shared mutable state that lets us keep track of where we are.

  var parentIDStack = [];
  var oldReconcilerMethods = null;
  if (renderer.Reconciler) {
    // React 15
    oldReconcilerMethods = decorateMany(renderer.Reconciler, {
      mountComponent: function mountComponent(fn, args) {
        var internalInstance = args[0];
        var hostContainerInfo = args[3];
        if (getElementType(internalInstance) === ElementTypeOtherOrUnknown) {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          return fn.apply(this, args);
        }
        if (hostContainerInfo._topLevelWrapper === undefined) {
          // SSR
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          return fn.apply(this, args);
        }
        var id = getID(internalInstance); // Push the operation.

        var parentID = parentIDStack.length > 0 ? parentIDStack[parentIDStack.length - 1] : 0;
        recordMount(internalInstance, id, parentID);
        parentIDStack.push(id); // Remember the root.

        internalInstanceToRootIDMap.set(internalInstance, getID(hostContainerInfo._topLevelWrapper));
        try {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          var result = fn.apply(this, args);
          parentIDStack.pop();
          return result;
        } catch (err) {
          parentIDStack = [];
          throw err;
        } finally {
          if (parentIDStack.length === 0) {
            var rootID = internalInstanceToRootIDMap.get(internalInstance);
            if (rootID === undefined) {
              throw new Error('Expected to find root ID.');
            }
            flushPendingEvents(rootID);
          }
        }
      },
      performUpdateIfNecessary: function performUpdateIfNecessary(fn, args) {
        var internalInstance = args[0];
        if (getElementType(internalInstance) === ElementTypeOtherOrUnknown) {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          return fn.apply(this, args);
        }
        var id = getID(internalInstance);
        parentIDStack.push(id);
        var prevChildren = getChildren(internalInstance);
        try {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          var result = fn.apply(this, args);
          var nextChildren = getChildren(internalInstance);
          if (!areEqualArrays(prevChildren, nextChildren)) {
            // Push the operation
            recordReorder(internalInstance, id, nextChildren);
          }
          parentIDStack.pop();
          return result;
        } catch (err) {
          parentIDStack = [];
          throw err;
        } finally {
          if (parentIDStack.length === 0) {
            var rootID = internalInstanceToRootIDMap.get(internalInstance);
            if (rootID === undefined) {
              throw new Error('Expected to find root ID.');
            }
            flushPendingEvents(rootID);
          }
        }
      },
      receiveComponent: function receiveComponent(fn, args) {
        var internalInstance = args[0];
        if (getElementType(internalInstance) === ElementTypeOtherOrUnknown) {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          return fn.apply(this, args);
        }
        var id = getID(internalInstance);
        parentIDStack.push(id);
        var prevChildren = getChildren(internalInstance);
        try {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          var result = fn.apply(this, args);
          var nextChildren = getChildren(internalInstance);
          if (!areEqualArrays(prevChildren, nextChildren)) {
            // Push the operation
            recordReorder(internalInstance, id, nextChildren);
          }
          parentIDStack.pop();
          return result;
        } catch (err) {
          parentIDStack = [];
          throw err;
        } finally {
          if (parentIDStack.length === 0) {
            var rootID = internalInstanceToRootIDMap.get(internalInstance);
            if (rootID === undefined) {
              throw new Error('Expected to find root ID.');
            }
            flushPendingEvents(rootID);
          }
        }
      },
      unmountComponent: function unmountComponent(fn, args) {
        var internalInstance = args[0];
        if (getElementType(internalInstance) === ElementTypeOtherOrUnknown) {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          return fn.apply(this, args);
        }
        var id = getID(internalInstance);
        parentIDStack.push(id);
        try {
          // $FlowFixMe[object-this-reference] found when upgrading Flow
          var result = fn.apply(this, args);
          parentIDStack.pop(); // Push the operation.

          recordUnmount(internalInstance, id);
          return result;
        } catch (err) {
          parentIDStack = [];
          throw err;
        } finally {
          if (parentIDStack.length === 0) {
            var rootID = internalInstanceToRootIDMap.get(internalInstance);
            if (rootID === undefined) {
              throw new Error('Expected to find root ID.');
            }
            flushPendingEvents(rootID);
          }
        }
      }
    });
  }
  function cleanup() {
    if (oldReconcilerMethods !== null) {
      if (renderer.Component) {
        restoreMany(renderer.Component.Mixin, oldReconcilerMethods);
      } else {
        restoreMany(renderer.Reconciler, oldReconcilerMethods);
      }
    }
    oldReconcilerMethods = null;
  }
  function recordMount(internalInstance, id, parentID) {
    var isRoot = parentID === 0;
    if (__DEBUG__) {
      console.log('%crecordMount()', 'color: green; font-weight: bold;', id, getData(internalInstance).displayName);
    }
    if (isRoot) {
      // TODO Is this right? For all versions?
      var hasOwnerMetadata = internalInstance._currentElement != null && internalInstance._currentElement._owner != null;
      pushOperation(TREE_OPERATION_ADD);
      pushOperation(id);
      pushOperation(ElementTypeRoot);
      pushOperation(0); // StrictMode compliant?

      pushOperation(0); // Profiling flag

      pushOperation(0); // StrictMode supported?

      pushOperation(hasOwnerMetadata ? 1 : 0);
    } else {
      var type = getElementType(internalInstance);
      var _getData = getData(internalInstance),
        displayName = _getData.displayName,
        key = _getData.key;
      var ownerID = internalInstance._currentElement != null && internalInstance._currentElement._owner != null ? getID(internalInstance._currentElement._owner) : 0;
      var displayNameStringID = getStringID(displayName);
      var keyStringID = getStringID(key);
      pushOperation(TREE_OPERATION_ADD);
      pushOperation(id);
      pushOperation(type);
      pushOperation(parentID);
      pushOperation(ownerID);
      pushOperation(displayNameStringID);
      pushOperation(keyStringID);
    }
  }
  function recordReorder(internalInstance, id, nextChildren) {
    pushOperation(TREE_OPERATION_REORDER_CHILDREN);
    pushOperation(id);
    var nextChildIDs = nextChildren.map(getID);
    pushOperation(nextChildIDs.length);
    for (var i = 0; i < nextChildIDs.length; i++) {
      pushOperation(nextChildIDs[i]);
    }
  }
  function recordUnmount(internalInstance, id) {
    pendingUnmountedIDs.push(id);
    idToInternalInstanceMap.delete(id);
  }
  function crawlAndRecordInitialMounts(id, parentID, rootID) {
    if (__DEBUG__) {
      console.group('crawlAndRecordInitialMounts() id:', id);
    }
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance != null) {
      internalInstanceToRootIDMap.set(internalInstance, rootID);
      recordMount(internalInstance, id, parentID);
      getChildren(internalInstance).forEach(function (child) {
        return crawlAndRecordInitialMounts(getID(child), id, rootID);
      });
    }
    if (__DEBUG__) {
      console.groupEnd();
    }
  }
  function flushInitialOperations() {
    // Crawl roots though and register any nodes that mounted before we were injected.
    var roots = renderer.Mount._instancesByReactRootID || renderer.Mount._instancesByContainerID;
    for (var key in roots) {
      var internalInstance = roots[key];
      var _id2 = getID(internalInstance);
      crawlAndRecordInitialMounts(_id2, 0, _id2);
      flushPendingEvents(_id2);
    }
  }
  var pendingOperations = [];
  var pendingStringTable = new Map();
  var pendingUnmountedIDs = [];
  var pendingStringTableLength = 0;
  var pendingUnmountedRootID = null;
  function flushPendingEvents(rootID) {
    if (pendingOperations.length === 0 && pendingUnmountedIDs.length === 0 && pendingUnmountedRootID === null) {
      return;
    }
    var numUnmountIDs = pendingUnmountedIDs.length + (pendingUnmountedRootID === null ? 0 : 1);
    var operations = new Array(
    // Identify which renderer this update is coming from.
    2 +
    // [rendererID, rootFiberID]
    // How big is the string table?
    1 +
    // [stringTableLength]
    // Then goes the actual string table.
    pendingStringTableLength + (
    // All unmounts are batched in a single message.
    // [TREE_OPERATION_REMOVE, removedIDLength, ...ids]
    numUnmountIDs > 0 ? 2 + numUnmountIDs : 0) +
    // Mount operations
    pendingOperations.length); // Identify which renderer this update is coming from.
    // This enables roots to be mapped to renderers,
    // Which in turn enables fiber properations, states, and hooks to be inspected.

    var i = 0;
    operations[i++] = rendererID;
    operations[i++] = rootID; // Now fill in the string table.
    // [stringTableLength, str1Length, ...str1, str2Length, ...str2, ...]

    operations[i++] = pendingStringTableLength;
    pendingStringTable.forEach(function (value, key) {
      operations[i++] = key.length;
      var encodedKey = utfEncodeString(key);
      for (var j = 0; j < encodedKey.length; j++) {
        operations[i + j] = encodedKey[j];
      }
      i += key.length;
    });
    if (numUnmountIDs > 0) {
      // All unmounts except roots are batched in a single message.
      operations[i++] = TREE_OPERATION_REMOVE; // The first number is how many unmounted IDs we're gonna send.

      operations[i++] = numUnmountIDs; // Fill in the unmounts

      for (var j = 0; j < pendingUnmountedIDs.length; j++) {
        operations[i++] = pendingUnmountedIDs[j];
      } // The root ID should always be unmounted last.

      if (pendingUnmountedRootID !== null) {
        operations[i] = pendingUnmountedRootID;
        i++;
      }
    } // Fill in the rest of the operations.

    for (var _j = 0; _j < pendingOperations.length; _j++) {
      operations[i + _j] = pendingOperations[_j];
    }
    i += pendingOperations.length;
    if (__DEBUG__) {
      printOperationsArray(operations);
    } // If we've already connected to the frontend, just pass the operations through.

    hook.emit('operations', operations);
    pendingOperations.length = 0;
    pendingUnmountedIDs = [];
    pendingUnmountedRootID = null;
    pendingStringTable.clear();
    pendingStringTableLength = 0;
  }
  function pushOperation(op) {
    if (false)
      // removed by dead control flow
      {}
    pendingOperations.push(op);
  }
  function getStringID(str) {
    if (str === null) {
      return 0;
    }
    var existingID = pendingStringTable.get(str);
    if (existingID !== undefined) {
      return existingID;
    }
    var stringID = pendingStringTable.size + 1;
    pendingStringTable.set(str, stringID); // The string table total length needs to account
    // both for the string length, and for the array item
    // that contains the length itself. Hence + 1.

    pendingStringTableLength += str.length + 1;
    return stringID;
  }
  var currentlyInspectedElementID = null;
  var currentlyInspectedPaths = {}; // Track the intersection of currently inspected paths,
  // so that we can send their data along if the element is re-rendered.

  function mergeInspectedPaths(path) {
    var current = currentlyInspectedPaths;
    path.forEach(function (key) {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    });
  }
  function createIsPathAllowed(key) {
    // This function helps prevent previously-inspected paths from being dehydrated in updates.
    // This is important to avoid a bad user experience where expanded toggles collapse on update.
    return function isPathAllowed(path) {
      var current = currentlyInspectedPaths[key];
      if (!current) {
        return false;
      }
      for (var i = 0; i < path.length; i++) {
        current = current[path[i]];
        if (!current) {
          return false;
        }
      }
      return true;
    };
  } // Fast path props lookup for React Native style editor.

  function getInstanceAndStyle(id) {
    var instance = null;
    var style = null;
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance != null) {
      instance = internalInstance._instance || null;
      var element = internalInstance._currentElement;
      if (element != null && element.props != null) {
        style = element.props.style || null;
      }
    }
    return {
      instance: instance,
      style: style
    };
  }
  function updateSelectedElement(id) {
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance == null) {
      console.warn("Could not find instance with id \"".concat(id, "\""));
      return;
    }
    switch (getElementType(internalInstance)) {
      case types_ElementTypeClass:
        global.$r = internalInstance._instance;
        break;
      case types_ElementTypeFunction:
        var element = internalInstance._currentElement;
        if (element == null) {
          console.warn("Could not find element with id \"".concat(id, "\""));
          return;
        }
        global.$r = {
          props: element.props,
          type: element.type
        };
        break;
      default:
        global.$r = null;
        break;
    }
  }
  function storeAsGlobal(id, path, count) {
    var inspectedElement = inspectElementRaw(id);
    if (inspectedElement !== null) {
      var value = utils_getInObject(inspectedElement, path);
      var key = "$reactTemp".concat(count);
      window[key] = value;
      console.log(key);
      console.log(value);
    }
  }
  function getSerializedElementValueByPath(id, path) {
    var inspectedElement = inspectElementRaw(id);
    if (inspectedElement !== null) {
      var valueToCopy = utils_getInObject(inspectedElement, path);
      return serializeToString(valueToCopy);
    }
  }
  function inspectElement(requestID, id, path, forceFullData) {
    if (forceFullData || currentlyInspectedElementID !== id) {
      currentlyInspectedElementID = id;
      currentlyInspectedPaths = {};
    }
    var inspectedElement = inspectElementRaw(id);
    if (inspectedElement === null) {
      return {
        id: id,
        responseID: requestID,
        type: 'not-found'
      };
    }
    if (path !== null) {
      mergeInspectedPaths(path);
    } // Any time an inspected element has an update,
    // we should update the selected $r value as wel.
    // Do this before dehydration (cleanForBridge).

    updateSelectedElement(id);
    inspectedElement.context = cleanForBridge(inspectedElement.context, createIsPathAllowed('context'));
    inspectedElement.props = cleanForBridge(inspectedElement.props, createIsPathAllowed('props'));
    inspectedElement.state = cleanForBridge(inspectedElement.state, createIsPathAllowed('state'));
    return {
      id: id,
      responseID: requestID,
      type: 'full-data',
      value: inspectedElement
    };
  }
  function inspectElementRaw(id) {
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance == null) {
      return null;
    }
    var _getData2 = getData(internalInstance),
      key = _getData2.key;
    var type = getElementType(internalInstance);
    var context = null;
    var owners = null;
    var props = null;
    var state = null;
    var element = internalInstance._currentElement;
    if (element !== null) {
      props = element.props;
      var owner = element._owner;
      if (owner) {
        owners = [];
        while (owner != null) {
          owners.push({
            displayName: getData(owner).displayName || 'Unknown',
            id: getID(owner),
            key: element.key,
            type: getElementType(owner)
          });
          if (owner._currentElement) {
            owner = owner._currentElement._owner;
          }
        }
      }
    }
    var publicInstance = internalInstance._instance;
    if (publicInstance != null) {
      context = publicInstance.context || null;
      state = publicInstance.state || null;
    } // Not implemented

    var errors = [];
    var warnings = [];
    return {
      id: id,
      // Does the current renderer support editable hooks and function props?
      canEditHooks: false,
      canEditFunctionProps: false,
      // Does the current renderer support advanced editing interface?
      canEditHooksAndDeletePaths: false,
      canEditHooksAndRenamePaths: false,
      canEditFunctionPropsDeletePaths: false,
      canEditFunctionPropsRenamePaths: false,
      // Toggle error boundary did not exist in legacy versions
      canToggleError: false,
      isErrored: false,
      // Suspense did not exist in legacy versions
      canToggleSuspense: false,
      // Can view component source location.
      canViewSource: type === types_ElementTypeClass || type === types_ElementTypeFunction,
      source: null,
      // Only legacy context exists in legacy versions.
      hasLegacyContext: true,
      type: type,
      key: key != null ? key : null,
      // Inspectable properties.
      context: context,
      hooks: null,
      props: props,
      state: state,
      errors: errors,
      warnings: warnings,
      // List of owners
      owners: owners,
      rootType: null,
      rendererPackageName: null,
      rendererVersion: null,
      plugins: {
        stylex: null
      },
      nativeTag: null
    };
  }
  function logElementToConsole(id) {
    var result = inspectElementRaw(id);
    if (result === null) {
      console.warn("Could not find element with id \"".concat(id, "\""));
      return;
    }
    var displayName = getDisplayNameForElementID(id);
    var supportsGroup = typeof console.groupCollapsed === 'function';
    if (supportsGroup) {
      console.groupCollapsed("[Click to expand] %c<".concat(displayName || 'Component', " />"),
      // --dom-tag-name-color is the CSS variable Chrome styles HTML elements with in the console.
      'color: var(--dom-tag-name-color); font-weight: normal;');
    }
    if (result.props !== null) {
      console.log('Props:', result.props);
    }
    if (result.state !== null) {
      console.log('State:', result.state);
    }
    if (result.context !== null) {
      console.log('Context:', result.context);
    }
    var hostInstance = findHostInstanceForInternalID(id);
    if (hostInstance !== null) {
      console.log('Node:', hostInstance);
    }
    if (window.chrome || /firefox/i.test(navigator.userAgent)) {
      console.log('Right-click any value to save it as a global variable for further inspection.');
    }
    if (supportsGroup) {
      console.groupEnd();
    }
  }
  function getElementAttributeByPath(id, path) {
    var inspectedElement = inspectElementRaw(id);
    if (inspectedElement !== null) {
      return utils_getInObject(inspectedElement, path);
    }
    return undefined;
  }
  function getElementSourceFunctionById(id) {
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance == null) {
      console.warn("Could not find instance with id \"".concat(id, "\""));
      return null;
    }
    var element = internalInstance._currentElement;
    if (element == null) {
      console.warn("Could not find element with id \"".concat(id, "\""));
      return null;
    }
    return element.type;
  }
  function deletePath(type, id, hookID, path) {
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance != null) {
      var publicInstance = internalInstance._instance;
      if (publicInstance != null) {
        switch (type) {
          case 'context':
            deletePathInObject(publicInstance.context, path);
            forceUpdate(publicInstance);
            break;
          case 'hooks':
            throw new Error('Hooks not supported by this renderer');
          case 'props':
            var element = internalInstance._currentElement;
            internalInstance._currentElement = legacy_renderer_objectSpread(legacy_renderer_objectSpread({}, element), {}, {
              props: copyWithDelete(element.props, path)
            });
            forceUpdate(publicInstance);
            break;
          case 'state':
            deletePathInObject(publicInstance.state, path);
            forceUpdate(publicInstance);
            break;
        }
      }
    }
  }
  function renamePath(type, id, hookID, oldPath, newPath) {
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance != null) {
      var publicInstance = internalInstance._instance;
      if (publicInstance != null) {
        switch (type) {
          case 'context':
            renamePathInObject(publicInstance.context, oldPath, newPath);
            forceUpdate(publicInstance);
            break;
          case 'hooks':
            throw new Error('Hooks not supported by this renderer');
          case 'props':
            var element = internalInstance._currentElement;
            internalInstance._currentElement = legacy_renderer_objectSpread(legacy_renderer_objectSpread({}, element), {}, {
              props: copyWithRename(element.props, oldPath, newPath)
            });
            forceUpdate(publicInstance);
            break;
          case 'state':
            renamePathInObject(publicInstance.state, oldPath, newPath);
            forceUpdate(publicInstance);
            break;
        }
      }
    }
  }
  function overrideValueAtPath(type, id, hookID, path, value) {
    var internalInstance = idToInternalInstanceMap.get(id);
    if (internalInstance != null) {
      var publicInstance = internalInstance._instance;
      if (publicInstance != null) {
        switch (type) {
          case 'context':
            utils_setInObject(publicInstance.context, path, value);
            forceUpdate(publicInstance);
            break;
          case 'hooks':
            throw new Error('Hooks not supported by this renderer');
          case 'props':
            var element = internalInstance._currentElement;
            internalInstance._currentElement = legacy_renderer_objectSpread(legacy_renderer_objectSpread({}, element), {}, {
              props: copyWithSet(element.props, path, value)
            });
            forceUpdate(publicInstance);
            break;
          case 'state':
            utils_setInObject(publicInstance.state, path, value);
            forceUpdate(publicInstance);
            break;
        }
      }
    }
  } // v16+ only features

  var getProfilingData = function getProfilingData() {
    throw new Error('getProfilingData not supported by this renderer');
  };
  var handleCommitFiberRoot = function handleCommitFiberRoot() {
    throw new Error('handleCommitFiberRoot not supported by this renderer');
  };
  var handleCommitFiberUnmount = function handleCommitFiberUnmount() {
    throw new Error('handleCommitFiberUnmount not supported by this renderer');
  };
  var handlePostCommitFiberRoot = function handlePostCommitFiberRoot() {
    throw new Error('handlePostCommitFiberRoot not supported by this renderer');
  };
  var overrideError = function overrideError() {
    throw new Error('overrideError not supported by this renderer');
  };
  var overrideSuspense = function overrideSuspense() {
    throw new Error('overrideSuspense not supported by this renderer');
  };
  var startProfiling = function startProfiling() {// Do not throw, since this would break a multi-root scenario where v15 and v16 were both present.
  };
  var stopProfiling = function stopProfiling() {// Do not throw, since this would break a multi-root scenario where v15 and v16 were both present.
  };
  function getBestMatchForTrackedPath() {
    // Not implemented.
    return null;
  }
  function getPathForElement(id) {
    // Not implemented.
    return null;
  }
  function updateComponentFilters(componentFilters) {// Not implemented.
  }
  function getEnvironmentNames() {
    // No RSC support.
    return [];
  }
  function setTraceUpdatesEnabled(enabled) {// Not implemented.
  }
  function setTrackedPath(path) {// Not implemented.
  }
  function getOwnersList(id) {
    // Not implemented.
    return null;
  }
  function clearErrorsAndWarnings() {// Not implemented
  }
  function clearErrorsForElementID(id) {// Not implemented
  }
  function clearWarningsForElementID(id) {// Not implemented
  }
  function hasElementWithId(id) {
    return idToInternalInstanceMap.has(id);
  }
  return {
    clearErrorsAndWarnings: clearErrorsAndWarnings,
    clearErrorsForElementID: clearErrorsForElementID,
    clearWarningsForElementID: clearWarningsForElementID,
    cleanup: cleanup,
    getSerializedElementValueByPath: getSerializedElementValueByPath,
    deletePath: deletePath,
    flushInitialOperations: flushInitialOperations,
    getBestMatchForTrackedPath: getBestMatchForTrackedPath,
    getDisplayNameForElementID: getDisplayNameForElementID,
    getNearestMountedDOMNode: getNearestMountedDOMNode,
    getElementIDForHostInstance: getElementIDForHostInstance,
    getInstanceAndStyle: getInstanceAndStyle,
    findHostInstancesForElementID: function findHostInstancesForElementID(id) {
      var hostInstance = findHostInstanceForInternalID(id);
      return hostInstance == null ? null : [hostInstance];
    },
    getOwnersList: getOwnersList,
    getPathForElement: getPathForElement,
    getProfilingData: getProfilingData,
    handleCommitFiberRoot: handleCommitFiberRoot,
    handleCommitFiberUnmount: handleCommitFiberUnmount,
    handlePostCommitFiberRoot: handlePostCommitFiberRoot,
    hasElementWithId: hasElementWithId,
    inspectElement: inspectElement,
    logElementToConsole: logElementToConsole,
    overrideError: overrideError,
    overrideSuspense: overrideSuspense,
    overrideValueAtPath: overrideValueAtPath,
    renamePath: renamePath,
    getElementAttributeByPath: getElementAttributeByPath,
    getElementSourceFunctionById: getElementSourceFunctionById,
    renderer: renderer,
    setTraceUpdatesEnabled: setTraceUpdatesEnabled,
    setTrackedPath: setTrackedPath,
    startProfiling: startProfiling,
    stopProfiling: stopProfiling,
    storeAsGlobal: storeAsGlobal,
    updateComponentFilters: updateComponentFilters,
    getEnvironmentNames: getEnvironmentNames
  };
}