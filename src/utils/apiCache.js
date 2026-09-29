/**
 * In-memory client-side API cache with TTL and request deduplication.
 * Speeds up repetitive page visits and prevents duplicate concurrent requests.
 */

class ApiCache {
  constructor() {
    this.cache = new Map();
    this.inFlight = new Map();
  }

  /**
   * Store data in cache with a TTL (in milliseconds)
   */
  set(key, data, ttlMs = 30000) {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Retrieve valid cached data or null if expired/absent
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Invalidate entries matching a prefix, substring, or regex
   */
  invalidate(pattern) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string' && key.includes(pattern)) {
        this.cache.delete(key);
      } else if (pattern instanceof RegExp && pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Execute an async fetcher with caching and in-flight deduplication.
   * If a request with the same cacheKey is already in flight, reuses the promise.
   */
  async cachedGet(cacheKey, fetcher, ttlMs = 30000) {
    // 1. Check existing fresh cache
    const cached = this.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // 2. Check if identical request is currently in-flight
    if (this.inFlight.has(cacheKey)) {
      return this.inFlight.get(cacheKey);
    }

    // 3. Initiate request and deduplicate
    const promise = (async () => {
      try {
        const result = await fetcher();
        if (result && result.success) {
          this.set(cacheKey, result, ttlMs);
        }
        return result;
      } finally {
        this.inFlight.delete(cacheKey);
      }
    })();

    this.inFlight.set(cacheKey, promise);
    return promise;
  }

  /**
   * Completely clear cache
   */
  clear() {
    this.cache.clear();
    this.inFlight.clear();
  }
}

export const apiCache = new ApiCache();
export default apiCache;
