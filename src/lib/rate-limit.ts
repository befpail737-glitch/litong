import { NextRequest } from 'next/server';

export interface RateLimitConfig {
  limit: number // requests per window
  window: number // window duration in milliseconds
  keyGenerator?: (request: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  enableInMemoryStore?: boolean
  enableRedisStore?: boolean
  redisUrl?: string
  customHeaders?: Record<string, string>
  onLimitReached?: (key: string, request: NextRequest) => void
  whitelist?: string[] // IP addresses or user IDs to whitelist
  blacklist?: string[] // IP addresses or user IDs to blacklist
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
  error?: string
}

export interface RateLimitEntry {
  count: number
  windowStart: number
  requests: Array<{
    timestamp: number
    path: string
    method: string
    status?: number
  }>
}

// In-memory store for development
class InMemoryRateLimitStore {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, entry: RateLimitEntry, ttl?: number): Promise<void> {
    this.store.set(key, entry);

    // Auto-expire entries if TTL is provided
    if (ttl) {
      setTimeout(() => {
        this.store.delete(key);
      }, ttl);
    }
  }

  async increment(key: string, window: number): Promise<RateLimitEntry> {
    const now = Date.now();
    const windowStart = Math.floor(now / window) * window;
    const existing = this.store.get(key);

    if (!existing || existing.windowStart < windowStart) {
      // New window or expired window
      const newEntry: RateLimitEntry = {
        count: 1,
        windowStart,
        requests: [{
          timestamp: now,
          path: '',
          method: ''
        }]
      };
      this.store.set(key, newEntry);
      return newEntry;
    } else {
      // Same window - increment
      existing.count++;
      existing.requests.push({
        timestamp: now,
        path: '',
        method: ''
      });
      this.store.set(key, existing);
      return existing;
    }
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredThreshold = now - (60 * 60 * 1000); // 1 hour ago

    for (const [key, entry] of this.store.entries()) {
      if (entry.windowStart < expiredThreshold) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Redis store for production (implementation would require redis client)
class RedisRateLimitStore {
  private redisClient: any; // Would be actual Redis client

  constructor(redisUrl: string) {
    // Initialize Redis client
    console.log(`Redis rate limit store initialized with URL: ${redisUrl}`);
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    // Implement Redis get
    return null;
  }

  async set(key: string, entry: RateLimitEntry, ttl?: number): Promise<void> {
    // Implement Redis set with TTL
  }

  async increment(key: string, window: number): Promise<RateLimitEntry> {
    // Implement Redis increment using Lua script for atomicity
    const now = Date.now();
    const windowStart = Math.floor(now / window) * window;

    // This would be implemented with a Lua script in Redis
    return {
      count: 1,
      windowStart,
      requests: []
    };
  }

  async reset(key: string): Promise<void> {
    // Implement Redis delete
  }
}

// Rate limiter class
class RateLimiter {
  private config: Required<RateLimitConfig>;
  private store: InMemoryRateLimitStore | RedisRateLimitStore;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: this.defaultKeyGenerator,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      enableInMemoryStore: true,
      enableRedisStore: false,
      customHeaders: {},
      onLimitReached: () => {},
      whitelist: [],
      blacklist: [],
      ...config
    };

    // Initialize store
    if (this.config.enableRedisStore && this.config.redisUrl) {
      this.store = new RedisRateLimitStore(this.config.redisUrl);
    } else {
      this.store = new InMemoryRateLimitStore();
    }
  }

  private defaultKeyGenerator(request: NextRequest): string {
    // Try to get IP from various headers
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Create a composite key for better rate limiting
    const baseKey = `${ip}:${userAgent.substring(0, 50)}`;

    return `rate_limit:${Buffer.from(baseKey).toString('base64').substring(0, 32)}`;
  }

  private getClientIP(request: NextRequest): string {
    // Check various headers for the real IP
    const headers = [
      'cf-connecting-ip', // Cloudflare
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'x-forwarded',
      'forwarded-for',
      'forwarded'
    ];

    for (const header of headers) {
      const value = request.headers.get(header);
      if (value) {
        // Handle comma-separated IPs (take the first one)
        return value.split(',')[0].trim();
      }
    }

    // Fallback to request IP if available
    return request.ip || '127.0.0.1';
  }

  async checkLimit(request: NextRequest): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(request);
    const clientIP = this.getClientIP(request);

    // Check blacklist
    if (this.config.blacklist.includes(clientIP) || this.config.blacklist.includes(key)) {
      return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: Date.now() + this.config.window,
        retryAfter: this.config.window,
        error: 'IP or client is blacklisted'
      };
    }

    // Check whitelist
    if (this.config.whitelist.includes(clientIP) || this.config.whitelist.includes(key)) {
      return {
        success: true,
        limit: this.config.limit,
        remaining: this.config.limit,
        reset: Date.now() + this.config.window
      };
    }

    try {
      const entry = await this.store.increment(key, this.config.window);
      const now = Date.now();
      const windowEnd = entry.windowStart + this.config.window;
      const remaining = Math.max(0, this.config.limit - entry.count);

      if (entry.count > this.config.limit) {
        // Rate limit exceeded
        const retryAfter = windowEnd - now;

        // Call the limit reached callback
        this.config.onLimitReached(key, request);

        return {
          success: false,
          limit: this.config.limit,
          remaining: 0,
          reset: windowEnd,
          retryAfter,
          error: 'Rate limit exceeded'
        };
      }

      return {
        success: true,
        limit: this.config.limit,
        remaining,
        reset: windowEnd
      };
    } catch (error) {
      // If rate limiting fails, allow the request but log the error
      console.error('Rate limiting error:', error);
      return {
        success: true,
        limit: this.config.limit,
        remaining: this.config.limit,
        reset: Date.now() + this.config.window,
        error: 'Rate limiting service unavailable'
      };
    }
  }

  async resetLimit(request: NextRequest): Promise<void> {
    const key = this.config.keyGenerator(request);
    await this.store.reset(key);
  }

  async getStats(request: NextRequest): Promise<{
    key: string
    entry: RateLimitEntry | null
    remaining: number
    resetTime: number
  }> {
    const key = this.config.keyGenerator(request);
    const entry = await this.store.get(key);

    if (!entry) {
      return {
        key,
        entry: null,
        remaining: this.config.limit,
        resetTime: Date.now() + this.config.window
      };
    }

    const remaining = Math.max(0, this.config.limit - entry.count);
    const resetTime = entry.windowStart + this.config.window;

    return {
      key,
      entry,
      remaining,
      resetTime
    };
  }
}

// Global rate limiter instances
const rateLimiters = new Map<string, RateLimiter>();

// Main rate limit function
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): Promise<RateLimitResult> {
  const key = identifier || `${config.limit}:${config.window}`;

  if (!rateLimiters.has(key)) {
    rateLimiters.set(key, new RateLimiter(config));
  }

  const limiter = rateLimiters.get(key)!;
  return await limiter.checkLimit(request);
}

// Predefined rate limit configurations
export const RateLimitPresets = {
  // API rate limits
  API_STRICT: { limit: 10, window: 60000 }, // 10 requests per minute
  API_MODERATE: { limit: 100, window: 60000 }, // 100 requests per minute
  API_LENIENT: { limit: 1000, window: 60000 }, // 1000 requests per minute

  // Authentication rate limits
  LOGIN_ATTEMPTS: { limit: 5, window: 300000 }, // 5 attempts per 5 minutes
  PASSWORD_RESET: { limit: 3, window: 3600000 }, // 3 attempts per hour
  REGISTRATION: { limit: 3, window: 300000 }, // 3 registrations per 5 minutes

  // Search and browsing
  SEARCH_QUERIES: { limit: 100, window: 60000 }, // 100 searches per minute
  FILE_DOWNLOADS: { limit: 50, window: 300000 }, // 50 downloads per 5 minutes

  // Contact and inquiries
  INQUIRY_SUBMISSION: { limit: 5, window: 3600000 }, // 5 inquiries per hour
  CONTACT_FORM: { limit: 3, window: 3600000 }, // 3 contact forms per hour

  // Administrative
  ADMIN_ACTIONS: { limit: 200, window: 60000 }, // 200 admin actions per minute
  BULK_OPERATIONS: { limit: 10, window: 300000 } // 10 bulk operations per 5 minutes
};

// Middleware helper
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return async (request: NextRequest) => {
    const result = await rateLimit(request, config);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: result.error || 'Too many requests',
          retryAfter: result.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil((result.retryAfter || 0) / 1000).toString(),
            ...config.customHeaders
          }
        }
      );
    }

    // Add rate limit headers to successful responses
    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString()
    };

    return { success: true, headers };
  };
}

// IP-based rate limiting
export async function rateLimitByIP(
  request: NextRequest,
  config: Omit<RateLimitConfig, 'keyGenerator'>
): Promise<RateLimitResult> {
  return rateLimit(request, {
    ...config,
    keyGenerator: (req) => `ip:${req.ip || '127.0.0.1'}`
  });
}

// User-based rate limiting
export async function rateLimitByUser(
  request: NextRequest,
  userId: string,
  config: Omit<RateLimitConfig, 'keyGenerator'>
): Promise<RateLimitResult> {
  return rateLimit(request, {
    ...config,
    keyGenerator: () => `user:${userId}`
  });
}

// API key-based rate limiting
export async function rateLimitByAPIKey(
  request: NextRequest,
  apiKey: string,
  config: Omit<RateLimitConfig, 'keyGenerator'>
): Promise<RateLimitResult> {
  return rateLimit(request, {
    ...config,
    keyGenerator: () => `api_key:${apiKey}`
  });
}

// Endpoint-specific rate limiting
export async function rateLimitByEndpoint(
  request: NextRequest,
  endpoint: string,
  config: Omit<RateLimitConfig, 'keyGenerator'>
): Promise<RateLimitResult> {
  const ip = request.ip || '127.0.0.1';
  return rateLimit(request, {
    ...config,
    keyGenerator: () => `endpoint:${endpoint}:${ip}`
  });
}

// Geographic rate limiting (would require IP geolocation service)
export async function rateLimitByCountry(
  request: NextRequest,
  country: string,
  config: Omit<RateLimitConfig, 'keyGenerator'>
): Promise<RateLimitResult> {
  return rateLimit(request, {
    ...config,
    keyGenerator: () => `country:${country}`
  });
}

// Cleanup function for graceful shutdown
export function cleanupRateLimiters(): void {
  for (const [, limiter] of rateLimiters.entries()) {
    if (limiter['store'] instanceof InMemoryRateLimitStore) {
      limiter['store'].destroy();
    }
  }
  rateLimiters.clear();
}
