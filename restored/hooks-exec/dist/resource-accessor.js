/**
 * A ResourceAccessor that wraps another ResourceAccessor and applies hooks
 * to shell, shellstream, and write operations.
 *
 * This acts as middleware, intercepting resource access and wrapping the
 * executors with hook-aware versions.
 */
class HooksResourceAccessor {
  constructor(innerAccessor, hookExecutor, baseHookRequestExtractor) {
    this.innerAccessor = innerAccessor;
    this.hookExecutor = hookExecutor;
    this.baseHookRequestExtractor = baseHookRequestExtractor;
  }
  get(resource) {
    const innerImpl = this.innerAccessor.get(resource);
    // Wrap shell executor with hooks
    if (resource.symbol === shellExecutorResource.symbol) {
      return new ShellExecutorWithHooks(innerImpl, this.hookExecutor, this.baseHookRequestExtractor);
    }
    // Wrap shell stream executor with hooks
    if (resource.symbol === shellStreamExecutorResource.symbol) {
      return new ShellStreamExecutorWithHooks(innerImpl, this.hookExecutor, this.baseHookRequestExtractor);
    }
    // Wrap write executor with hooks
    if (resource.symbol === writeExecutorResource.symbol) {
      return new WriteExecutorWithHooks(innerImpl, this.hookExecutor, this.baseHookRequestExtractor);
    }
    // For all other resources, return the inner implementation as-is
    return innerImpl;
  }
}
/**
 * A ListableResourceAccessor that wraps another ListableResourceAccessor and applies hooks
 * to shell, shellstream, and write operations.
 *
 * This acts as middleware, intercepting resource access and wrapping the
 * executors with hook-aware versions, while also providing the ability to
 * enumerate all resources.
 */
class ListableHooksResourceAccessor {
  constructor(innerAccessor, hookExecutor, baseHookRequestExtractor) {
    this.innerAccessor = innerAccessor;
    this.hookExecutor = hookExecutor;
    this.baseHookRequestExtractor = baseHookRequestExtractor;
  }
  get(resource) {
    const innerImpl = this.innerAccessor.get(resource);
    // Wrap shell executor with hooks
    if (resource.symbol === agent_exec_dist /* shellExecutorResource */.qk.symbol) {
      return new shell_ShellExecutorWithHooks(innerImpl, this.hookExecutor, this.baseHookRequestExtractor);
    }
    // Wrap shell stream executor with hooks
    if (resource.symbol === agent_exec_dist /* shellStreamExecutorResource */.wv.symbol) {
      return new shell_stream_ShellStreamExecutorWithHooks(innerImpl, this.hookExecutor, this.baseHookRequestExtractor);
    }
    // Wrap write executor with hooks
    if (resource.symbol === agent_exec_dist /* writeExecutorResource */.Ln.symbol) {
      return new write_WriteExecutorWithHooks(innerImpl, this.hookExecutor, this.baseHookRequestExtractor);
    }
    // For all other resources, return the inner implementation as-is
    return innerImpl;
  }
  *entries() {
    // Iterate through all entries from the inner accessor
    for (const [resource, implementation] of this.innerAccessor.entries()) {
      // Wrap the implementation if it's one of the hooked resources
      if (resource.symbol === agent_exec_dist /* shellExecutorResource */.qk.symbol) {
        yield [resource, new shell_ShellExecutorWithHooks(implementation, this.hookExecutor, this.baseHookRequestExtractor)];
      } else if (resource.symbol === agent_exec_dist /* shellStreamExecutorResource */.wv.symbol) {
        yield [resource, new shell_stream_ShellStreamExecutorWithHooks(implementation, this.hookExecutor, this.baseHookRequestExtractor)];
      } else if (resource.symbol === agent_exec_dist /* writeExecutorResource */.Ln.symbol) {
        yield [resource, new write_WriteExecutorWithHooks(implementation, this.hookExecutor, this.baseHookRequestExtractor)];
      } else {
        // For all other resources, yield the inner implementation as-is
        yield [resource, implementation];
      }
    }
  }
}