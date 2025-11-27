/**
 * Creates a cached version of a stream executor that caches results based on execId.
 * Only caches when ExecOptions with execId is provided.
 */
function createCachedStreamExecutor(executor, cacheOptions) {
  const cache = new LRUCache({
    max: cacheOptions?.max ?? 10,
    ttl: cacheOptions?.ttl
  });
  return {
    async *execute(ctx, args, options) {
      // No caching if no options or no execId
      if (!options?.execId) {
        yield* executor.execute(ctx, args, options);
        return;
      }
      const cacheKey = options.execId;
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached) {
        yield* cached.fork();
        return;
      }
      // Execute and cache
      const stream = executor.execute(ctx, args, options);
      const forkable = new utils_dist /* ForkableIterable */.dV(stream);
      cache.set(cacheKey, forkable);
      yield* forkable.fork();
    }
  };
}
/**
 * Creates a cached version of a promise-based executor that caches results based on execId.
 * Only caches when ExecOptions with execId is provided.
 */
function createCachedExecutor(executor, cacheOptions) {
  const cache = new LRUCache({
    max: cacheOptions?.max ?? 10,
    ttl: cacheOptions?.ttl
  });
  return {
    async execute(ctx, args, options) {
      // No caching if no options or no execId
      if (!options?.execId) {
        return executor.execute(ctx, args, options);
      }
      const cacheKey = options.execId;
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
      // Execute and cache
      const result = await executor.execute(ctx, args, options);
      cache.set(cacheKey, result);
      return result;
    }
  };
}
//# sourceMappingURL=caching-wrapper.js.map