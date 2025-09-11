import { QueryOptions, QueryResult, ConnectionConfig } from '@/types/database';

export interface DatabaseOptimizationConfig {
  enableQueryAnalysis?: boolean
  enableConnectionPooling?: boolean
  enableQueryCaching?: boolean
  enableSlowQueryLogging?: boolean
  slowQueryThreshold?: number
  maxConnections?: number
  connectionTimeout?: number
  queryTimeout?: number
  cacheSize?: number
  cacheTTL?: number
  debug?: boolean
}

export interface QueryAnalytics {
  query: string
  executionTime: number
  rowsAffected: number
  cached: boolean
  timestamp: number
  parameters?: any[]
  stackTrace?: string
}

export interface ConnectionPoolStats {
  totalConnections: number
  activeConnections: number
  idleConnections: number
  waitingRequests: number
  totalQueries: number
  averageQueryTime: number
}

// Query optimizer
export class QueryOptimizer {
  private config: Required<DatabaseOptimizationConfig>;
  private queryCache = new Map<string, { result: any; timestamp: number; ttl: number }>();
  private queryAnalytics: QueryAnalytics[] = [];
  private connectionPool: ConnectionPool | null = null;

  constructor(config: DatabaseOptimizationConfig = {}) {
    this.config = {
      enableQueryAnalysis: true,
      enableConnectionPooling: true,
      enableQueryCaching: true,
      enableSlowQueryLogging: true,
      slowQueryThreshold: 1000,
      maxConnections: 20,
      connectionTimeout: 30000,
      queryTimeout: 60000,
      cacheSize: 1000,
      cacheTTL: 300000, // 5 minutes
      debug: process.env.NODE_ENV === 'development',
      ...config
    };

    if (this.config.enableConnectionPooling) {
      this.connectionPool = new ConnectionPool({
        maxConnections: this.config.maxConnections,
        connectionTimeout: this.config.connectionTimeout,
        debug: this.config.debug
      });
    }
  }

  // Execute optimized query
  async executeQuery<T = any>(
    query: string,
    parameters?: any[],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const startTime = performance.now();
    const cacheKey = this.generateCacheKey(query, parameters);

    try {
      // Check cache first
      if (this.config.enableQueryCaching && options.useCache !== false) {
        const cached = this.getCachedResult<T>(cacheKey);
        if (cached) {
          this.recordQuery(query, performance.now() - startTime, 0, true, parameters);
          return cached;
        }
      }

      // Optimize query before execution
      const optimizedQuery = this.optimizeQuery(query);

      // Execute query
      const result = await this.executeRawQuery<T>(optimizedQuery, parameters, options);

      const executionTime = performance.now() - startTime;

      // Cache result if cacheable
      if (this.config.enableQueryCaching && this.isCacheable(optimizedQuery, options)) {
        this.cacheResult(cacheKey, result, options.cacheTTL || this.config.cacheTTL);
      }

      // Record analytics
      this.recordQuery(optimizedQuery, executionTime, result.rowCount || 0, false, parameters);

      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      this.recordQuery(query, executionTime, 0, false, parameters, error as Error);
      throw error;
    }
  }

  private async executeRawQuery<T>(
    query: string,
    parameters?: any[],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    if (this.connectionPool) {
      return await this.connectionPool.executeQuery<T>(query, parameters, options);
    }

    // Fallback to direct execution (implementation would depend on database driver)
    throw new Error('Connection pool not initialized and no fallback implementation provided');
  }

  // Query optimization strategies
  private optimizeQuery(query: string): string {
    let optimized = query.trim();

    // Remove unnecessary whitespace
    optimized = optimized.replace(/\s+/g, ' ');

    // Optimize SELECT queries
    if (optimized.toLowerCase().startsWith('select')) {
      optimized = this.optimizeSelectQuery(optimized);
    }

    // Optimize JOIN queries
    if (optimized.toLowerCase().includes('join')) {
      optimized = this.optimizeJoinQuery(optimized);
    }

    // Optimize WHERE clauses
    if (optimized.toLowerCase().includes('where')) {
      optimized = this.optimizeWhereClause(optimized);
    }

    return optimized;
  }

  private optimizeSelectQuery(query: string): string {
    // Suggest specific columns instead of SELECT *
    if (query.includes('SELECT *')) {
      if (this.config.debug) {
        console.warn('Query optimization: Consider selecting specific columns instead of *');
      }
    }

    // Add LIMIT if not present for potentially large result sets
    if (!query.toLowerCase().includes('limit') && !query.toLowerCase().includes('count(')) {
      if (this.config.debug) {
        console.warn('Query optimization: Consider adding LIMIT clause for large result sets');
      }
    }

    return query;
  }

  private optimizeJoinQuery(query: string): string {
    // Suggest proper JOIN order (smaller tables first)
    if (this.config.debug) {
      console.log('Query optimization: Ensure proper JOIN order for better performance');
    }

    return query;
  }

  private optimizeWhereClause(query: string): string {
    // Check for indexed columns in WHERE clause
    if (this.config.debug) {
      console.log('Query optimization: Ensure WHERE clause uses indexed columns');
    }

    return query;
  }

  // Caching methods
  private generateCacheKey(query: string, parameters?: any[]): string {
    const paramString = parameters ? JSON.stringify(parameters) : '';
    return Buffer.from(`${query}${paramString}`).toString('base64');
  }

  private getCachedResult<T>(cacheKey: string): QueryResult<T> | null {
    const cached = this.queryCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.result;
    }

    if (cached) {
      this.queryCache.delete(cacheKey);
    }

    return null;
  }

  private cacheResult<T>(cacheKey: string, result: QueryResult<T>, ttl: number): void {
    // Implement LRU eviction if cache is full
    if (this.queryCache.size >= this.config.cacheSize) {
      const oldestKey = this.queryCache.keys().next().value;
      this.queryCache.delete(oldestKey);
    }

    this.queryCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
      ttl
    });
  }

  private isCacheable(query: string, options: QueryOptions): boolean {
    const lowerQuery = query.toLowerCase().trim();

    // Don't cache write operations
    if (lowerQuery.startsWith('insert') ||
        lowerQuery.startsWith('update') ||
        lowerQuery.startsWith('delete')) {
      return false;
    }

    // Don't cache if explicitly disabled
    if (options.useCache === false) {
      return false;
    }

    // Don't cache queries with NOW(), RAND(), etc.
    const nonCacheableFunctions = ['now()', 'rand()', 'random()', 'current_timestamp'];
    return !nonCacheableFunctions.some(fn => lowerQuery.includes(fn));
  }

  // Analytics and monitoring
  private recordQuery(
    query: string,
    executionTime: number,
    rowsAffected: number,
    cached: boolean,
    parameters?: any[],
    error?: Error
  ): void {
    const analytics: QueryAnalytics = {
      query: query.substring(0, 500), // Limit length
      executionTime,
      rowsAffected,
      cached,
      timestamp: Date.now(),
      parameters: parameters?.slice(0, 10), // Limit parameters
      stackTrace: error ? error.stack?.substring(0, 1000) : undefined
    };

    this.queryAnalytics.push(analytics);

    // Keep only recent analytics
    if (this.queryAnalytics.length > 10000) {
      this.queryAnalytics = this.queryAnalytics.slice(-5000);
    }

    // Log slow queries
    if (this.config.enableSlowQueryLogging && executionTime > this.config.slowQueryThreshold) {
      console.warn(`Slow query detected (${executionTime.toFixed(2)}ms):`, query.substring(0, 200));
    }

    // Log errors
    if (error && this.config.debug) {
      console.error('Query error:', error.message, 'Query:', query.substring(0, 200));
    }
  }

  // Index suggestions
  public analyzeQueries(): {
    slowQueries: QueryAnalytics[]
    indexSuggestions: string[]
    cacheHitRatio: number
    averageQueryTime: number
  } {
    const slowQueries = this.queryAnalytics
      .filter(q => q.executionTime > this.config.slowQueryThreshold)
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, 20);

    const indexSuggestions: string[] = [];
    const totalQueries = this.queryAnalytics.length;
    const cachedQueries = this.queryAnalytics.filter(q => q.cached).length;
    const totalTime = this.queryAnalytics.reduce((sum, q) => sum + q.executionTime, 0);

    // Analyze for index suggestions
    slowQueries.forEach(query => {
      const suggestions = this.suggestIndexes(query.query);
      indexSuggestions.push(...suggestions);
    });

    return {
      slowQueries,
      indexSuggestions: [...new Set(indexSuggestions)], // Remove duplicates
      cacheHitRatio: totalQueries > 0 ? cachedQueries / totalQueries : 0,
      averageQueryTime: totalQueries > 0 ? totalTime / totalQueries : 0
    };
  }

  private suggestIndexes(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Extract table names and WHERE conditions
    const tableMatch = lowerQuery.match(/from\s+(\w+)/i);
    const whereMatch = lowerQuery.match(/where\s+(.+?)(?:\s+order|\s+group|\s+limit|$)/i);

    if (tableMatch && whereMatch) {
      const table = tableMatch[1];
      const whereClause = whereMatch[1];

      // Extract column names from WHERE clause
      const columnMatches = whereClause.match(/(\w+)\s*[=<>]/g);
      if (columnMatches) {
        columnMatches.forEach(match => {
          const column = match.replace(/\s*[=<>].*/, '').trim();
          suggestions.push(`CREATE INDEX idx_${table}_${column} ON ${table} (${column});`);
        });
      }
    }

    return suggestions;
  }

  // Public methods
  public getCacheStats(): {
    size: number
    hitRatio: number
    memoryUsage: number
  } {
    const totalRequests = this.queryAnalytics.length;
    const cacheHits = this.queryAnalytics.filter(q => q.cached).length;

    return {
      size: this.queryCache.size,
      hitRatio: totalRequests > 0 ? cacheHits / totalRequests : 0,
      memoryUsage: this.estimateCacheMemoryUsage()
    };
  }

  private estimateCacheMemoryUsage(): number {
    let size = 0;
    this.queryCache.forEach(cached => {
      size += JSON.stringify(cached.result).length * 2; // Rough estimation
    });
    return size;
  }

  public clearCache(): void {
    this.queryCache.clear();
  }

  public getConnectionStats(): ConnectionPoolStats | null {
    return this.connectionPool?.getStats() || null;
  }

  public async warmUpCache(queries: Array<{ query: string; parameters?: any[] }>): Promise<void> {
    for (const { query, parameters } of queries) {
      try {
        await this.executeQuery(query, parameters, { useCache: false });
      } catch (error) {
        if (this.config.debug) {
          console.warn('Cache warm-up failed for query:', query, error);
        }
      }
    }
  }

  public destroy(): void {
    this.queryCache.clear();
    this.queryAnalytics = [];
    this.connectionPool?.destroy();
  }
}

// Connection pool implementation
class ConnectionPool {
  private maxConnections: number;
  private connectionTimeout: number;
  private debug: boolean;
  private connections: Connection[] = [];
  private waitingRequests: Array<{ resolve: (conn: Connection) => void; reject: (error: Error) => void }> = [];
  private stats = {
    totalQueries: 0,
    totalQueryTime: 0
  };

  constructor(config: { maxConnections: number; connectionTimeout: number; debug: boolean }) {
    this.maxConnections = config.maxConnections;
    this.connectionTimeout = config.connectionTimeout;
    this.debug = config.debug;
  }

  async executeQuery<T>(
    query: string,
    parameters?: any[],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const connection = await this.getConnection();
    const startTime = performance.now();

    try {
      const result = await connection.execute<T>(query, parameters, options);
      const executionTime = performance.now() - startTime;

      this.stats.totalQueries++;
      this.stats.totalQueryTime += executionTime;

      return result;
    } finally {
      this.releaseConnection(connection);
    }
  }

  private async getConnection(): Promise<Connection> {
    // Find available connection
    for (const conn of this.connections) {
      if (!conn.inUse) {
        conn.inUse = true;
        return conn;
      }
    }

    // Create new connection if under limit
    if (this.connections.length < this.maxConnections) {
      const conn = new Connection();
      await conn.connect();
      conn.inUse = true;
      this.connections.push(conn);
      return conn;
    }

    // Wait for available connection
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingRequests.findIndex(req => req.resolve === resolve);
        if (index !== -1) {
          this.waitingRequests.splice(index, 1);
        }
        reject(new Error('Connection pool timeout'));
      }, this.connectionTimeout);

      this.waitingRequests.push({
        resolve: (conn) => {
          clearTimeout(timeout);
          resolve(conn);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });
    });
  }

  private releaseConnection(connection: Connection): void {
    connection.inUse = false;

    // Process waiting requests
    if (this.waitingRequests.length > 0) {
      const request = this.waitingRequests.shift()!;
      connection.inUse = true;
      request.resolve(connection);
    }
  }

  getStats(): ConnectionPoolStats {
    const activeConnections = this.connections.filter(c => c.inUse).length;
    const idleConnections = this.connections.filter(c => !c.inUse).length;

    return {
      totalConnections: this.connections.length,
      activeConnections,
      idleConnections,
      waitingRequests: this.waitingRequests.length,
      totalQueries: this.stats.totalQueries,
      averageQueryTime: this.stats.totalQueries > 0 ?
        this.stats.totalQueryTime / this.stats.totalQueries : 0
    };
  }

  async destroy(): Promise<void> {
    // Reject all waiting requests
    this.waitingRequests.forEach(req => {
      req.reject(new Error('Connection pool destroyed'));
    });
    this.waitingRequests = [];

    // Close all connections
    await Promise.all(this.connections.map(conn => conn.disconnect()));
    this.connections = [];
  }
}

// Mock connection class (implementation would depend on database driver)
class Connection {
  public inUse = false;
  private connected = false;

  async connect(): Promise<void> {
    // Implementation would connect to actual database
    this.connected = true;
  }

  async execute<T>(
    query: string,
    parameters?: any[],
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    if (!this.connected) {
      throw new Error('Connection not established');
    }

    // Mock implementation - replace with actual database driver
    return {
      rows: [] as T[],
      rowCount: 0,
      fields: [],
      command: query.split(' ')[0].toUpperCase(),
      duration: 0
    };
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }
}

// Singleton instance
let queryOptimizer: QueryOptimizer | null = null;

export function getQueryOptimizer(config?: DatabaseOptimizationConfig): QueryOptimizer {
  if (!queryOptimizer) {
    queryOptimizer = new QueryOptimizer(config);
  }
  return queryOptimizer;
}

export function initDatabaseOptimization(config?: DatabaseOptimizationConfig): QueryOptimizer {
  return getQueryOptimizer(config);
}

// Utility functions
export function createOptimizedQuery(baseQuery: string, filters: Record<string, any>): string {
  let query = baseQuery;
  const conditions: string[] = [];
  const parameters: any[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = ?`);
      parameters.push(value);
    }
  });

  if (conditions.length > 0) {
    const whereKeyword = query.toLowerCase().includes('where') ? 'AND' : 'WHERE';
    query += ` ${whereKeyword} ${conditions.join(' AND ')}`;
  }

  return query;
}

export function buildPaginatedQuery(
  baseQuery: string,
  page: number = 1,
  limit: number = 20,
  orderBy?: string
): { query: string; offset: number } {
  let query = baseQuery;

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  const offset = (page - 1) * limit;
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  return { query, offset };
}

export default QueryOptimizer;
