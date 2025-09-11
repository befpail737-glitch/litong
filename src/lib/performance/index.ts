// Performance optimization and monitoring exports

// Web Vitals
export {
  WebVitalsTracker,
  initWebVitalsTracking,
  getWebVitalsTracker,
  optimizeImageLoading,
  preloadCriticalResources,
  optimizeFontLoading,
  type WebVitalsMetrics,
  type PerformanceConfig
} from './web-vitals'

// Optimized Image Component
export {
  default as OptimizedImage,
  ImageGallery,
  useProgressiveImage,
  type OptimizedImageProps,
  type ImageGalleryProps
} from './optimized-image'

// Code Splitting
export {
  CodeSplittingManager,
  getCodeSplittingManager,
  createLazyComponent,
  preloadChunk,
  preloadRouteChunks,
  useChunkPreloader,
  withRoutePreloading,
  type CodeSplittingConfig,
  type LazyComponentOptions
} from './code-splitting'

// Resource Optimization
export {
  ResourceOptimizer,
  getResourceOptimizer,
  initResourceOptimization,
  preloadResource,
  loadCSSAsync,
  loadScriptAsync,
  type ResourceOptimizationConfig,
  type ResourceMetrics,
  type FontLoadingOptions
} from './resource-optimization'

// Database Optimization
export {
  QueryOptimizer,
  getQueryOptimizer,
  initDatabaseOptimization,
  createOptimizedQuery,
  buildPaginatedQuery,
  type DatabaseOptimizationConfig,
  type QueryAnalytics,
  type ConnectionPoolStats
} from './database-optimization'

// Caching
export {
  CacheManager,
  LRUCache,
  TTLCache,
  getCache,
  createCache,
  destroyCache,
  cached,
  memoize,
  type CacheConfig,
  type CacheEntry,
  type CacheStats,
  type CacheOptions
} from './caching'

// Performance Monitoring
export {
  PerformanceMonitor,
  getPerformanceMonitor,
  initPerformanceMonitoring,
  type MonitoringConfig,
  type AlertThresholds,
  type PerformanceAlert,
  type UserSession,
  type PerformanceReport
} from './monitoring'

// Utility functions for comprehensive performance initialization
export function initializePerformanceStack(config: {
  webVitals?: import('./web-vitals').PerformanceConfig
  codeSplitting?: import('./code-splitting').CodeSplittingConfig
  resourceOptimization?: import('./resource-optimization').ResourceOptimizationConfig
  databaseOptimization?: import('./database-optimization').DatabaseOptimizationConfig
  caching?: import('./caching').CacheConfig
  monitoring?: import('./monitoring').MonitoringConfig
} = {}) {
  if (typeof window === 'undefined') {
    // Server-side: only initialize database and caching
    const { getQueryOptimizer } = require('./database-optimization')
    const { getCache } = require('./caching')
    
    return {
      queryOptimizer: getQueryOptimizer(config.databaseOptimization),
      cache: getCache('default', config.caching),
      webVitalsTracker: null,
      codeSplittingManager: null,
      resourceOptimizer: null,
      performanceMonitor: null
    }
  }

  // Client-side: initialize all systems
  const { initWebVitalsTracking } = require('./web-vitals')
  const { getCodeSplittingManager } = require('./code-splitting')
  const { initResourceOptimization } = require('./resource-optimization')
  const { getQueryOptimizer } = require('./database-optimization')
  const { getCache } = require('./caching')
  const { initPerformanceMonitoring } = require('./monitoring')

  const webVitalsTracker = initWebVitalsTracking(config.webVitals)
  const codeSplittingManager = getCodeSplittingManager(config.codeSplitting)
  const resourceOptimizer = initResourceOptimization(config.resourceOptimization)
  const queryOptimizer = getQueryOptimizer(config.databaseOptimization)
  const cache = getCache('default', config.caching)
  const performanceMonitor = initPerformanceMonitoring(config.monitoring)

  // Enable cross-system integrations
  setupCrossSystemIntegrations({
    webVitalsTracker,
    codeSplittingManager,
    resourceOptimizer,
    queryOptimizer,
    cache,
    performanceMonitor
  })

  return {
    webVitalsTracker,
    codeSplittingManager,
    resourceOptimizer,
    queryOptimizer,
    cache,
    performanceMonitor
  }
}

function setupCrossSystemIntegrations(systems: {
  webVitalsTracker: import('./web-vitals').WebVitalsTracker
  codeSplittingManager: import('./code-splitting').CodeSplittingManager
  resourceOptimizer: import('./resource-optimization').ResourceOptimizer
  queryOptimizer: import('./database-optimization').QueryOptimizer
  cache: import('./caching').CacheManager
  performanceMonitor: import('./monitoring').PerformanceMonitor
}) {
  // Integration logic could be added here
  // For example: sharing metrics between systems, coordinated optimization strategies, etc.
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance stack initialized with all systems')
  }
}

// Performance budgets and thresholds
export const PERFORMANCE_BUDGETS = {
  // Web Vitals thresholds
  LCP_GOOD: 2500,
  LCP_NEEDS_IMPROVEMENT: 4000,
  FID_GOOD: 100,
  FID_NEEDS_IMPROVEMENT: 300,
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25,
  FCP_GOOD: 1800,
  FCP_NEEDS_IMPROVEMENT: 3000,
  TTFB_GOOD: 800,
  TTFB_NEEDS_IMPROVEMENT: 1800,

  // Resource budgets
  JS_BUNDLE_SIZE: 250 * 1024, // 250KB
  CSS_BUNDLE_SIZE: 100 * 1024, // 100KB
  IMAGE_SIZE: 500 * 1024, // 500KB
  FONT_SIZE: 100 * 1024, // 100KB per font

  // Performance budgets
  MAX_REQUESTS: 50,
  MAX_LOAD_TIME: 3000,
  MAX_FIRST_PAINT: 1000,
  MAX_FIRST_CONTENTFUL_PAINT: 1500,

  // Database performance
  MAX_QUERY_TIME: 1000,
  MAX_CONNECTION_COUNT: 20,
  CACHE_HIT_RATIO_MIN: 0.8,

  // Memory budgets
  MAX_HEAP_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_CACHE_SIZE: 10 * 1024 * 1024, // 10MB
} as const

// Performance scoring
export function calculatePerformanceScore(metrics: {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
}): {
  overall: number
  scores: Record<string, number>
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
} {
  const scores: Record<string, number> = {}
  let totalScore = 0
  let metricCount = 0

  // Score each metric (0-100 scale)
  if (metrics.lcp !== undefined) {
    scores.lcp = Math.max(0, Math.min(100, 100 - ((metrics.lcp - PERFORMANCE_BUDGETS.LCP_GOOD) / PERFORMANCE_BUDGETS.LCP_GOOD) * 100))
    totalScore += scores.lcp
    metricCount++
  }

  if (metrics.fid !== undefined) {
    scores.fid = Math.max(0, Math.min(100, 100 - ((metrics.fid - PERFORMANCE_BUDGETS.FID_GOOD) / PERFORMANCE_BUDGETS.FID_GOOD) * 100))
    totalScore += scores.fid
    metricCount++
  }

  if (metrics.cls !== undefined) {
    scores.cls = Math.max(0, Math.min(100, 100 - ((metrics.cls - PERFORMANCE_BUDGETS.CLS_GOOD) / PERFORMANCE_BUDGETS.CLS_GOOD) * 100))
    totalScore += scores.cls
    metricCount++
  }

  if (metrics.fcp !== undefined) {
    scores.fcp = Math.max(0, Math.min(100, 100 - ((metrics.fcp - PERFORMANCE_BUDGETS.FCP_GOOD) / PERFORMANCE_BUDGETS.FCP_GOOD) * 100))
    totalScore += scores.fcp
    metricCount++
  }

  if (metrics.ttfb !== undefined) {
    scores.ttfb = Math.max(0, Math.min(100, 100 - ((metrics.ttfb - PERFORMANCE_BUDGETS.TTFB_GOOD) / PERFORMANCE_BUDGETS.TTFB_GOOD) * 100))
    totalScore += scores.ttfb
    metricCount++
  }

  const overall = metricCount > 0 ? totalScore / metricCount : 0

  // Assign grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F'
  if (overall >= 90) grade = 'A'
  else if (overall >= 80) grade = 'B'
  else if (overall >= 70) grade = 'C'
  else if (overall >= 60) grade = 'D'
  else grade = 'F'

  return { overall, scores, grade }
}

// Performance recommendations engine
export function generatePerformanceRecommendations(metrics: {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
  resourceCount?: number
  bundleSize?: number
  cacheHitRatio?: number
}): {
  critical: string[]
  important: string[]
  suggested: string[]
} {
  const critical: string[] = []
  const important: string[] = []
  const suggested: string[] = []

  // Critical recommendations
  if (metrics.lcp && metrics.lcp > PERFORMANCE_BUDGETS.LCP_NEEDS_IMPROVEMENT) {
    critical.push('LCP is critically slow - optimize largest contentful paint elements')
    critical.push('Consider image optimization, lazy loading, and CDN implementation')
  }

  if (metrics.fid && metrics.fid > PERFORMANCE_BUDGETS.FID_NEEDS_IMPROVEMENT) {
    critical.push('FID is critically slow - reduce JavaScript execution time')
    critical.push('Implement code splitting and remove unused JavaScript')
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_BUDGETS.CLS_NEEDS_IMPROVEMENT) {
    critical.push('CLS is critically high - fix layout shifts')
    critical.push('Set explicit dimensions for images and avoid dynamic content injection')
  }

  // Important recommendations
  if (metrics.fcp && metrics.fcp > PERFORMANCE_BUDGETS.FCP_NEEDS_IMPROVEMENT) {
    important.push('FCP is slow - optimize critical rendering path')
    important.push('Inline critical CSS and optimize font loading')
  }

  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_BUDGETS.TTFB_NEEDS_IMPROVEMENT) {
    important.push('TTFB is slow - optimize server response time')
    important.push('Consider edge caching and server-side optimization')
  }

  if (metrics.bundleSize && metrics.bundleSize > PERFORMANCE_BUDGETS.JS_BUNDLE_SIZE) {
    important.push('JavaScript bundle is too large - implement code splitting')
    important.push('Remove unused dependencies and optimize imports')
  }

  // Suggested improvements
  if (metrics.resourceCount && metrics.resourceCount > PERFORMANCE_BUDGETS.MAX_REQUESTS) {
    suggested.push('Consider reducing the number of HTTP requests')
    suggested.push('Combine CSS/JS files and use sprite sheets for images')
  }

  if (metrics.cacheHitRatio && metrics.cacheHitRatio < PERFORMANCE_BUDGETS.CACHE_HIT_RATIO_MIN) {
    suggested.push('Improve caching strategy for better performance')
    suggested.push('Implement proper HTTP caching headers and service worker caching')
  }

  // General suggestions
  if (suggested.length === 0 && important.length === 0 && critical.length === 0) {
    suggested.push('Performance looks good - consider implementing advanced optimizations')
    suggested.push('Monitor performance continuously and set up alerts for regressions')
  }

  return { critical, important, suggested }
}

// Export default initialization function
export default initializePerformanceStack