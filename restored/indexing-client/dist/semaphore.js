var semaphore_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class Semaphore {
  constructor(permits) {
    this.waitingResolvers = [];
    if (!Number.isInteger(permits) || permits < 0) {
      throw new Error("Semaphore requires a non-negative integer number of permits");
    }
    this.permits = permits;
  }
  acquire() {
    return semaphore_awaiter(this, void 0, void 0, function* () {
      if (this.permits > 0) {
        this.permits -= 1;
        return Promise.resolve();
      }
      return new Promise(resolve => {
        this.waitingResolvers.push(resolve);
      });
    });
  }
  release() {
    const next = this.waitingResolvers.shift();
    if (next !== undefined) {
      // Hand off the permit directly to the next waiter
      next();
    } else {
      this.permits += 1;
    }
  }
}