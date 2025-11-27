var reference_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class Writeable {}
class EagerReference {
  constructor(serde, blobStore, value) {
    this.serde = serde;
    this.blobStore = blobStore;
    this.lastWrittenValue = undefined;
    this.value = value;
  }
  get(_ctx) {
    return Promise.resolve(this.value);
  }
  set(value) {
    this.value = value;
  }
  writeToBlobStore(ctx) {
    return reference_awaiter(this, void 0, void 0, function* () {
      var _a;
      if (this.value instanceof Writeable) {
        return this.value.writeToBlobStore(ctx);
      }
      if (this.value === ((_a = this.lastWrittenValue) === null || _a === void 0 ? void 0 : _a.value)) {
        return this.lastWrittenValue.blobId;
      }
      const serialized = this.serde.serialize(this.value);
      const blobId = yield getBlobId(serialized);
      yield this.blobStore.setBlob(ctx, blobId, serialized);
      this.lastWrittenValue = {
        value: this.value,
        blobId
      };
      return blobId;
    });
  }
}
class LazyReference {
  constructor(serde, blobStore, blobId) {
    this.serde = serde;
    this.blobStore = blobStore;
    this.blobId = blobId;
    this.valuePromise = undefined;
    this.lastWrittenValue = undefined;
  }
  get(ctx) {
    return reference_awaiter(this, void 0, void 0, function* () {
      if (this.valuePromise === undefined) {
        this.valuePromise = this.blobStore.getBlob(ctx, this.blobId).then(blob => {
          if (blob === undefined) {
            throw new Error(`Blob not found: ${this.blobId}`);
          }
          return this.serde.deserialize(blob);
        });
        this.valuePromise.then(value => {
          this.lastWrittenValue = value;
        });
      }
      return this.valuePromise;
    });
  }
  set(value) {
    this.valuePromise = Promise.resolve(value);
  }
  writeToBlobStore(ctx) {
    return reference_awaiter(this, void 0, void 0, function* () {
      if (this.valuePromise === undefined) {
        // if it hasn't been initialized, then it hasn't changed
        return this.blobId;
      }
      const value = yield this.get(ctx);
      if (value instanceof Writeable) {
        return value.writeToBlobStore(ctx);
      }
      if (value === this.lastWrittenValue) {
        // if it hasn't changed, then it hasn't changed
        return this.blobId;
      }
      const serialized = this.serde.serialize(value);
      const blobId = yield getBlobId(serialized);
      yield this.blobStore.setBlob(ctx, blobId, serialized);
      this.lastWrittenValue = value;
      this.blobId = blobId;
      return blobId;
    });
  }
}