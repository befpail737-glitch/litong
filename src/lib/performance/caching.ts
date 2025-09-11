export interface CacheConfig {
  defaultTTL?: number
  maxSize?: number
  enableCompression?: boolean
  enablePersistence?: boolean
  enableAnalytics?: boolean
  compressionThreshold?: number
  persistenceKey?: string
  debug?: boolean
}

export interface CacheEntry<T = any> {
  value: T
  timestamp: number
  ttl: number
  hits: number
  size: number
  compressed?: boolean
}

export interface CacheStats {
  size: number
  maxSize: number
  hitRatio: number
  totalHits: number
  totalMisses: number
  totalSets: number
  memoryUsage: number
  compressionRatio: number
}

export interface CacheOptions {
  ttl?: number
  compress?: boolean
  tags?: string[]
}

// Multi-level cache system
export class CacheManager {
  private config: Required<CacheConfig>;
  private memory = new Map<string, CacheEntry>();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    evictions: 0
  };
  private tags = new Map<string, Set<string>>();
  private compressionWorker: Worker | null = null;

  constructor(config: CacheConfig = {}) {
    this.config = {
      defaultTTL: 300000, // 5 minutes
      maxSize: 1000,
      enableCompression: true,
      enablePersistence: false,
      enableAnalytics: true,
      compressionThreshold: 1024, // 1KB
      persistenceKey: 'app_cache',
      debug: process.env.NODE_ENV === 'development',
      ...config
    };

    if (this.config.enableCompression && typeof Worker !== 'undefined') {
      this.setupCompressionWorker();
    }

    if (this.config.enablePersistence && typeof localStorage !== 'undefined') {
      this.loadFromPersistence();
    }

    // Setup periodic cleanup
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  // Core cache operations
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.config.defaultTTL;
    const timestamp = Date.now();

    let processedValue = value;
    let compressed = false;
    let size = this.estimateSize(value);

    // Compress large values if enabled
    if (this.config.enableCompression &&
        size > this.config.compressionThreshold &&
        options.compress !== false) {
      try {
        processedValue = await this.compressValue(value);
        compressed = true;
        size = this.estimateSize(processedValue);
      } catch (error) {
        if (this.config.debug) {
          console.warn('Compression failed for key:', key, error);
        }
      }
    }

    const entry: CacheEntry<T> = {
      value: processedValue,
      timestamp,
      ttl,
      hits: 0,
      size,
      compressed
    };

    // Check size limits and evict if necessary
    await this.ensureCapacity(size);

    this.memory.set(key, entry);
    this.stats.sets++;

    // Handle tags
    if (options.tags) {
      this.addTags(key, options.tags);
    }

    // Persist if enabled
    if (this.config.enablePersistence) {
      this.persistToStorage();
    }

    if (this.config.debug) {
      console.log(`Cache SET: ${key} (${compressed ? 'compressed' : 'uncompressed'}, ${size} bytes)`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.memory.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update hit count
    entry.hits++;
    this.stats.hits++;

    let value = entry.value;

    // Decompress if necessary
    if (entry.compressed) {
      try {
        value = await this.decompressValue(entry.value);
      } catch (error) {
        if (this.config.debug) {
          console.warn('Decompression failed for key:', key, error);
        }
        this.delete(key);
        return null;
      }
    }

    if (this.config.debug) {
      console.log(`Cache HIT: ${key} (hits: ${entry.hits})`);
    }

    return value;
  }

  has(key: string): boolean {
    const entry = this.memory.get(key);
    if (!entry) return false;

    // Check expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.memory.delete(key);

    if (deleted) {
      this.removeFromTags(key);

      if (this.config.enablePersistence) {
        this.persistToStorage();
      }
    }

    return deleted;
  }

  clear(): void {
    this.memory.clear();
    this.tags.clear();
    this.resetStats();

    if (this.config.enablePersistence) {
      this.clearPersistence();
    }
  }

  // Advanced operations
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  async mget<T>(keys: string[]): Promise<Map<string, T>> {
    const results = new Map<string, T>();

    await Promise.all(
      keys.map(async (key) => {
        const value = await this.get<T>(key);
        if (value !== null) {
          results.set(key, value);
        }
      })
    );

    return results;
  }

  async mset<T>(entries: Array<{ key: string; value: T; options?: CacheOptions }>): Promise<void> {
    await Promise.all(
      entries.map(({ key, value, options = {} }) =>
        this.set(key, value, options)
      )
    );
  }

  // Tag-based operations
  private addTags(key: string, tagList: string[]): void {
    tagList.forEach(tag => {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)!.add(key);
    });
  }

  private removeFromTags(key: string): void {
    for (const [tag, keys] of this.tags.entries()) {
      keys.delete(key);
      if (keys.size === 0) {
        this.tags.delete(tag);
      }
    }
  }

  deleteByTag(tag: string): number {
    const keys = this.tags.get(tag);
    if (!keys) return 0;

    let deleted = 0;
    keys.forEach(key => {
      if (this.delete(key)) {
        deleted++;
      }
    });

    this.tags.delete(tag);
    return deleted;
  }

  getKeysByTag(tag: string): string[] {
    const keys = this.tags.get(tag);
    return keys ? Array.from(keys) : [];
  }

  // TTL operations
  expire(key: string, ttl: number): boolean {
    const entry = this.memory.get(key);
    if (!entry) return false;

    entry.ttl = ttl;
    entry.timestamp = Date.now();
    return true;
  }

  ttl(key: string): number {
    const entry = this.memory.get(key);
    if (!entry) return -2; // Key doesn't exist

    const remaining = entry.ttl - (Date.now() - entry.timestamp);
    return remaining > 0 ? remaining : -1; // Expired
  }

  // Compression
  private setupCompressionWorker(): void {
    if (typeof Worker === 'undefined') return;

    const workerScript = `
      self.onmessage = function(e) {
        const { action, data, id } = e.data;
        
        try {
          if (action === 'compress') {
            // Simple compression using JSON + deflate simulation
            const compressed = JSON.stringify(data);
            self.postMessage({ id, result: compressed, error: null });
          } else if (action === 'decompress') {
            // Simple decompression
            const decompressed = JSON.parse(data);
            self.postMessage({ id, result: decompressed, error: null });
          }
        } catch (error) {
          self.postMessage({ id, result: null, error: error.message });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    this.compressionWorker = new Worker(URL.createObjectURL(blob));
  }

  private async compressValue<T>(value: T): Promise<T> {
    if (!this.compressionWorker) {
      // Fallback to JSON stringify as simple compression
      return JSON.parse(JSON.stringify(value));
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substr(2, 9);

      const timeout = setTimeout(() => {
        reject(new Error('Compression timeout'));
      }, 5000);

      const handler = (e: MessageEvent) => {
        if (e.data.id === id) {
          clearTimeout(timeout);
          this.compressionWorker!.removeEventListener('message', handler);

          if (e.data.error) {
            reject(new Error(e.data.error));
          } else {
            resolve(e.data.result);
          }
        }
      };

      this.compressionWorker.addEventListener('message', handler);
      this.compressionWorker.postMessage({ action: 'compress', data: value, id });
    });
  }

  private async decompressValue<T>(value: T): Promise<T> {
    if (!this.compressionWorker) {
      return value; // No compression was applied
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substr(2, 9);

      const timeout = setTimeout(() => {
        reject(new Error('Decompression timeout'));
      }, 5000);

      const handler = (e: MessageEvent) => {
        if (e.data.id === id) {
          clearTimeout(timeout);
          this.compressionWorker!.removeEventListener('message', handler);

          if (e.data.error) {
            reject(new Error(e.data.error));
          } else {
            resolve(e.data.result);
          }
        }
      };

      this.compressionWorker.addEventListener('message', handler);
      this.compressionWorker.postMessage({ action: 'decompress', data: value, id });
    });
  }

  // Memory management
  private async ensureCapacity(newEntrySize: number): Promise<void> {
    while (this.memory.size >= this.config.maxSize) {
      const evicted = this.evictLRU();
      if (!evicted) break;
    }
  }

  private evictLRU(): boolean {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    let lowestHits = Infinity;

    for (const [key, entry] of this.memory.entries()) {
      // Prioritize by last access time and hit count
      const score = entry.timestamp + (entry.hits * 60000); // 1 hit = 1 minute of extra life

      if (score < oldestTime || (score === oldestTime && entry.hits < lowestHits)) {
        oldestTime = score;
        lowestHits = entry.hits;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;

      if (this.config.debug) {
        console.log(`Cache evicted LRU key: ${oldestKey}`);
      }

      return true;
    }

    return false;
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.memory.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));

    if (keysToDelete.length > 0 && this.config.debug) {
      console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
    }
  }

  // Persistence
  private loadFromPersistence(): void {
    try {
      const stored = localStorage.getItem(this.config.persistenceKey);
      if (!stored) return;

      const data = JSON.parse(stored);
      const now = Date.now();

      for (const [key, entry] of Object.entries(data.entries || {})) {
        const cacheEntry = entry as CacheEntry;

        // Skip expired entries
        if (now - cacheEntry.timestamp <= cacheEntry.ttl) {
          this.memory.set(key, cacheEntry);
        }
      }

      // Restore tags
      if (data.tags) {
        for (const [tag, keys] of Object.entries(data.tags)) {
          this.tags.set(tag, new Set(keys as string[]));
        }
      }

      if (this.config.debug) {
        console.log(`Cache loaded ${this.memory.size} entries from persistence`);
      }
    } catch (error) {
      if (this.config.debug) {
        console.warn('Failed to load cache from persistence:', error);
      }
    }
  }

  private persistToStorage(): void {
    try {
      const data = {
        entries: Object.fromEntries(this.memory.entries()),
        tags: Object.fromEntries(
          Array.from(this.tags.entries()).map(([tag, keys]) => [tag, Array.from(keys)])
        ),
        timestamp: Date.now()
      };

      localStorage.setItem(this.config.persistenceKey, JSON.stringify(data));
    } catch (error) {
      if (this.config.debug) {
        console.warn('Failed to persist cache to storage:', error);
      }
    }
  }

  private clearPersistence(): void {
    try {
      localStorage.removeItem(this.config.persistenceKey);
    } catch (error) {
      if (this.config.debug) {
        console.warn('Failed to clear cache persistence:', error);
      }
    }
  }

  // Analytics and utilities
  private estimateSize(value: any): number {
    return JSON.stringify(value).length * 2; // Rough estimation in bytes
  }

  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
  }

  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    let memoryUsage = 0;
    let compressedSize = 0;
    let totalSize = 0;

    for (const entry of this.memory.values()) {
      memoryUsage += entry.size;

      if (entry.compressed) {
        compressedSize += entry.size;
      }
      totalSize += entry.size;
    }

    return {
      size: this.memory.size,
      maxSize: this.config.maxSize,
      hitRatio: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      totalSets: this.stats.sets,
      memoryUsage,
      compressionRatio: totalSize > 0 ? compressedSize / totalSize : 0
    };
  }

  keys(): string[] {
    return Array.from(this.memory.keys());
  }

  values(): any[] {
    return Array.from(this.memory.values()).map(entry => entry.value);
  }

  entries(): Array<[string, any]> {
    return Array.from(this.memory.entries()).map(([key, entry]) => [key, entry.value]);
  }

  size(): number {
    return this.memory.size;
  }

  destroy(): void {
    this.clear();

    if (this.compressionWorker) {
      this.compressionWorker.terminate();
      this.compressionWorker = null;
    }
  }
}

// Specialized cache implementations
export class LRUCache<T> extends CacheManager {
  constructor(maxSize: number, defaultTTL: number = 300000) {
    super({
      maxSize,
      defaultTTL,
      enablePersistence: false
    });
  }
}

export class TTLCache<T> extends CacheManager {
  constructor(defaultTTL: number = 300000) {
    super({
      defaultTTL,
      maxSize: Number.MAX_SAFE_INTEGER,
      enablePersistence: false
    });
  }
}

// Global cache instances
const globalCaches = new Map<string, CacheManager>();

export function getCache(name: string = 'default', config?: CacheConfig): CacheManager {
  if (!globalCaches.has(name)) {
    globalCaches.set(name, new CacheManager(config));
  }
  return globalCaches.get(name)!;
}

export function createCache(name: string, config?: CacheConfig): CacheManager {
  const cache = new CacheManager(config);
  globalCaches.set(name, cache);
  return cache;
}

export function destroyCache(name: string): boolean {
  const cache = globalCaches.get(name);
  if (cache) {
    cache.destroy();
    globalCaches.delete(name);
    return true;
  }
  return false;
}

// Utility decorators and functions
export function cached(ttl: number = 300000, keyPrefix: string = '') {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = getCache(`method_${target.constructor.name}_${propertyName}`);

    descriptor.value = async function(...args: any[]) {
      const key = `${keyPrefix}${propertyName}_${JSON.stringify(args)}`;

      return await cache.getOrSet(key, () => originalMethod.apply(this, args), { ttl });
    };

    return descriptor;
  };
}

export async function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string,
  ttl: number = 300000
): Promise<T> {
  const cache = getCache(`memoize_${fn.name || 'anonymous'}`);

  return (async (...args: Parameters<T>) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    return await cache.getOrSet(key, () => fn(...args), { ttl });
  }) as T;
}

export default CacheManager;
