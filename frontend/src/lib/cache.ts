// In-Memory Request Cache and Deduplication Utility for Cloche

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const memoryCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();

const DEFAULT_TTL_MS = 3 * 60 * 1000; // 3 minutes default TTL

/**
 * Fetch with in-memory caching and request deduplication.
 * Prevents identical concurrent API requests from executing twice.
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  // Deduplicate ongoing requests
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  const promise = fetcher()
    .then((data) => {
      memoryCache.set(key, { data, timestamp: Date.now() });
      pendingRequests.delete(key);
      return data;
    })
    .catch((err) => {
      pendingRequests.delete(key);
      throw err;
    });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Manually invalidate a cached item or pattern.
 */
export function invalidateCache(keyOrPrefix?: string) {
  if (!keyOrPrefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(keyOrPrefix)) {
      memoryCache.delete(key);
    }
  }
}
