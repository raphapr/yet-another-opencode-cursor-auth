/**
 * TypeScript context implementation based on AbortController
 * Provides cancellation, deadlines, and typed value propagation
 */
var core_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
 * Create a new context key with type information
 */
function createKey(name, defaultValue) {
  return {
    symbol: name,
    defaultValue
  };
}
/**
 * Internal context implementation
 */
class ContextImpl {
  constructor(parent, controller, values, name, detached) {
    this.parent = parent;
    this.controller = controller || new AbortController();
    this.values = values || new Map();
    this.name = name;
    // Propagate parent cancellation
    if (parent && !detached) {
      if (parent.signal.aborted) {
        this.controller.abort(parent.signal.reason);
      } else {
        // Use { once: true } to auto-remove listener after it fires
        // This prevents accumulation of listeners on long-lived parents
        parent.signal.addEventListener("abort", () => {
          this.controller.abort(parent.signal.reason);
        }, {
          once: true
        });
      }
    }
  }
  get signal() {
    return this.controller.signal;
  }
  get canceled() {
    return this.signal.aborted;
  }
  get reason() {
    return this.signal.reason;
  }
  get(key) {
    // Check own values first
    if (this.values.has(key.symbol)) {
      return this.values.get(key.symbol);
    }
    // Check parent values
    if (this.parent) {
      return this.parent.get(key);
    }
    // Return default value if specified
    return key.defaultValue;
  }
  with(key, value) {
    const newValues = new Map(this.values);
    newValues.set(key.symbol, value);
    return new ContextImpl(this, undefined, newValues);
  }
  withCancel() {
    const controller = new AbortController();
    const ctx = new ContextImpl(this, controller);
    return [ctx, () => controller.abort()];
  }
  withTimeout(ms) {
    const controller = new AbortController();
    const ctx = new ContextImpl(this, controller);
    const timeoutId = setTimeout(() => {
      controller.abort(new Error("context deadline exceeded"));
    }, ms);
    // Clear timeout if context is canceled early
    controller.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
    }, {
      once: true
    });
    return ctx;
  }
  withDeadline(deadline) {
    const ms = deadline.getTime() - Date.now();
    if (ms <= 0) {
      // Already expired
      const controller = new AbortController();
      controller.abort(new Error("context deadline exceeded"));
      return new ContextImpl(this, controller);
    }
    return this.withTimeout(ms);
  }
  /**
   * Create a child context with both a timeout and manual cancellation
   * Properly cleans up the timeout when cancel() is called early
   */
  withTimeoutAndCancel(ms) {
    const [cancelCtx, cancel] = this.withCancel();
    const timeoutCtx = cancelCtx.withTimeout(ms);
    return [timeoutCtx, cancel];
  }
  withName(name) {
    return new ContextImpl(this, undefined, undefined, name);
  }
  withDetached() {
    return new ContextImpl(this, undefined, undefined, undefined, true);
  }
  getParent() {
    return this.parent;
  }
  getPath() {
    const path = [];
    let current = this;
    while (current) {
      if (current.name) {
        path.unshift(current.name);
      }
      current = current.getParent();
    }
    return path;
  }
}
/**
 * Create a new root context
 */
function core_createContext() {
  return new ContextImpl();
}
/**
 * Run an async function with context cancellation support
 */
function run(ctx, fn) {
  return core_awaiter(this, void 0, void 0, function* () {
    if (ctx.canceled) {
      throw ctx.reason || new Error("context canceled");
    }
    return new Promise((resolve, reject) => {
      // Handle context cancellation
      const onAbort = () => {
        reject(ctx.reason || new Error("context canceled"));
      };
      if (ctx.signal.aborted) {
        onAbort();
        return;
      }
      ctx.signal.addEventListener("abort", onAbort);
      // Run the function
      fn(ctx).then(resolve).catch(reject).finally(() => {
        ctx.signal.removeEventListener("abort", onAbort);
      });
    });
  });
}
/**
 * Wait for context cancellation
 */
function wait(ctx) {
  return new Promise(resolve => {
    if (ctx.canceled) {
      resolve();
      return;
    }
    ctx.signal.addEventListener("abort", () => resolve(), {
      once: true
    });
  });
}
/**
 * Example usage:
 *
 * const ctx = build()
 *   .value(keys.traceId, '123')
 *   .value(keys.userId, 'user-456')
 *   .timeout(5000)
 *   .build();
 *
 * const [childCtx, cancel] = ctx.withCancel();
 *
 * await run(childCtx, async (ctx) => {
 *   const traceId = ctx.get(keys.traceId);
 *   // Do work...
 * });
 */