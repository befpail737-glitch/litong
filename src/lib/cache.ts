export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
}

export interface CacheEntry<T> {
  value: T
  timestamp: number
  ttl: number
}

export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private readonly maxSize: number
  private readonly defaultTtl: number

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000
    this.defaultTtl = options.ttl || 5 * 60 * 1000 // 5 minutes default
  }

  set(key: string, value: T, ttl?: number): void {
    // Remove expired entries before adding new one
    this.cleanup()
    
    // If at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl
    }

    this.cache.set(key, entry)
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return undefined
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    this.cleanup()
    return this.cache.size
  }

  private cleanup(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Default cache instance
export const cache = new MemoryCache<any>()

// Helper functions for common use cases
export const getCached = <T>(key: string): T | undefined => {
  return cache.get(key) as T | undefined
}

export const setCached = <T>(key: string, value: T, ttl?: number): void => {
  cache.set(key, value, ttl)
}

export const deleteCached = (key: string): boolean => {
  return cache.delete(key)
}

export async function cacheResponse<T>(
  key: string, 
  data?: T, 
  ttlSeconds?: number
): Promise<T | null> {
  if (data === undefined) {
    // Getter mode - retrieve cached data
    return getCached<T>(key) || null
  }
  
  if (data === null) {
    // Delete mode - clear cache entry
    deleteCached(key)
    return null
  }
  
  // Setter mode - store data in cache
  const ttlMs = ttlSeconds ? ttlSeconds * 1000 : undefined
  setCached(key, data, ttlMs)
  return data
}

export default cache