var types_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/**
 * Mock implementation of RuntimeLspProvider when none are available
 */
class MockRuntimeLspProvider {
  open(_ctx, _uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      // No-op for mock
    });
  }
  getDiagnostics(_ctx, _uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      return [];
    });
  }
  shutdown(_ctx) {
    return types_awaiter(this, void 0, void 0, function* () {
      // No-op for mock
    });
  }
}
class LazyRuntimeLspProvider {
  constructor(provider) {
    this.provider = provider;
  }
  getProvider(ctx) {
    return types_awaiter(this, void 0, void 0, function* () {
      const provider = yield (0, dist /* run */.eF)(ctx.withName("lsp-provider-init"), () => this.provider);
      if (provider !== null) {
        return provider;
      }
      return new MockRuntimeLspProvider();
    });
  }
  open(ctx, uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      return (yield this.getProvider(ctx)).open(ctx, uri);
    });
  }
  getDiagnostics(ctx, uri) {
    return types_awaiter(this, void 0, void 0, function* () {
      return (yield this.getProvider(ctx)).getDiagnostics(ctx, uri);
    });
  }
  shutdown(ctx) {
    return types_awaiter(this, void 0, void 0, function* () {
      return (yield this.getProvider(ctx)).shutdown(ctx);
    });
  }
}
//# sourceMappingURL=types.js.map