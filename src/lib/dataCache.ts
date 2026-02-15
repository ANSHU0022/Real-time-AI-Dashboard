// Simple in-memory cache with localStorage persistence for instant loading

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const CACHE_PREFIX = 'dashboard_cache_';
const DEFAULT_TTL = 60000; // 1 minute default TTL

class DataCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Persist to localStorage for instant load on refresh
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      // localStorage might be full or disabled
      console.warn('Failed to persist cache:', e);
    }
  }

  get<T>(key: string): T | null {
    // Try memory cache first (fastest)
    const memEntry = this.memoryCache.get(key);
    if (memEntry) {
      // Return cached data even if slightly stale (for instant display)
      return memEntry.data as T;
    }

    // Try localStorage
    try {
      const stored = localStorage.getItem(CACHE_PREFIX + key);
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored);
        // Store in memory for faster subsequent access
        this.memoryCache.set(key, entry);
        return entry.data;
      }
    } catch (e) {
      console.warn('Failed to read cache:', e);
    }

    return null;
  }

  isStale(key: string): boolean {
    const memEntry = this.memoryCache.get(key);
    if (memEntry) {
      return Date.now() - memEntry.timestamp > memEntry.ttl;
    }

    try {
      const stored = localStorage.getItem(CACHE_PREFIX + key);
      if (stored) {
        const entry: CacheEntry<any> = JSON.parse(stored);
        return Date.now() - entry.timestamp > entry.ttl;
      }
    } catch (e) {
      return true;
    }

    return true;
  }

  clear(key?: string): void {
    if (key) {
      this.memoryCache.delete(key);
      try {
        localStorage.removeItem(CACHE_PREFIX + key);
      } catch (e) {}
    } else {
      this.memoryCache.clear();
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(CACHE_PREFIX))
          .forEach(k => localStorage.removeItem(k));
      } catch (e) {}
    }
  }
}

export const dataCache = new DataCache();
