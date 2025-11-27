var resource_provider_await = undefined && undefined.__await || function (v) {
  return this instanceof resource_provider_await ? (this.v = v, this) : new resource_provider_await(v);
};
var resource_provider_asyncValues = undefined && undefined.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};
var resource_provider_asyncGenerator = undefined && undefined.__asyncGenerator || function (thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
    i,
    q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;
  function awaitReturn(f) {
    return function (v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function (v) {
        return new Promise(function (a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof resource_provider_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
};
class LazyRemoteExecManager {
  constructor(promise) {
    this.promise = promise;
  }
  createExecInstance(ctx, argsSerializer) {
    return resource_provider_asyncGenerator(this, arguments, function* createExecInstance_1() {
      var _a, e_1, _b, _c;
      const remoteExecManager = yield resource_provider_await(this.promise);
      try {
        for (var _d = true, _e = resource_provider_asyncValues(remoteExecManager.createExecInstance(ctx, argsSerializer)), _f; _f = yield resource_provider_await(_e.next()), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const message = _c;
          yield yield resource_provider_await(message);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield resource_provider_await(_b.call(_e));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
}
function createResource(remoteImplementation, controlledImplementation) {
  return {
    symbol: Symbol(),
    remoteImplementation,
    registerControlledImplementation: controlledImplementation
  };
}
class RemoteResourceAccessor {
  constructor(remoteExecManager) {
    this.remoteExecManager = remoteExecManager;
  }
  get(resource) {
    return resource.remoteImplementation(this.remoteExecManager);
  }
}
class ListableRemoteResourceAccessor {
  constructor(remoteExecManager, resources) {
    this.resourceEntries = new Map();
    for (const resource of resources) {
      this.resourceEntries.set(resource, resource.remoteImplementation(remoteExecManager));
    }
  }
  get(resource) {
    return this.resourceEntries.get(resource);
  }
  entries() {
    return this.resourceEntries.entries();
  }
}
class ResourceDescriptor {
  constructor(resource, value) {
    this.resource = resource;
    this.value = value;
  }
}
class RegistryResourceAccessor {
  constructor() {
    this.resources = new Map();
  }
  register(resource, value) {
    this.resources.set(resource.symbol, new ResourceDescriptor(resource, value));
  }
  get(resource) {
    var _a;
    return (_a = this.resources.get(resource.symbol)) === null || _a === void 0 ? void 0 : _a.value;
  }
  entries() {
    return Array.from(this.resources.values()).map(value => [value.resource, value.value]);
  }
}
/**
 * Combines remote and local resource accessors into a single ListableResourceAccessor.
 * This allows us to have some resources implemented locally (browser-side) and others
 * implemented remotely (extension-side).
 */
class CombinedResourceAccessor {
  constructor(remoteAccessor, localResourceEntries) {
    this.remoteAccessor = remoteAccessor;
    this.localResources = new Map();
    // Register local resources
    for (const [resource, implementation] of localResourceEntries) {
      this.localResources.set(resource.symbol, {
        resource,
        implementation
      });
    }
  }
  get(resource) {
    // Check if it's a local resource first
    const localEntry = this.localResources.get(resource.symbol);
    if (localEntry) {
      return localEntry.implementation;
    }
    // Otherwise, get it from the remote accessor
    return this.remoteAccessor.get(resource);
  }
  *entries() {
    // First yield all local resources
    for (const {
      resource,
      implementation
    } of this.localResources.values()) {
      yield [resource, implementation];
    }
    // Then yield all remote resources
    for (const entry of this.remoteAccessor.entries()) {
      // Only yield remote resources that aren't overridden locally
      if (!this.localResources.has(entry[0].symbol)) {
        yield entry;
      }
    }
  }
}