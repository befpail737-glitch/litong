'use client'

import { WebVitalsTracker, getWebVitalsTracker } from './web-vitals'
import { getResourceOptimizer } from './resource-optimization'
import { getQueryOptimizer } from './database-optimization'
import { getCache } from './caching'

export interface MonitoringConfig {
  enableRealTimeMonitoring?: boolean
  enableAlerting?: boolean
  enableReporting?: boolean
  alertThresholds?: AlertThresholds
  reportingInterval?: number
  maxLogSize?: number
  enableUserSessionTracking?: boolean
  enableErrorTracking?: boolean
  enableCustomMetrics?: boolean
  apiEndpoint?: string
  debug?: boolean
}

export interface AlertThresholds {
  lcp?: number
  fid?: number
  cls?: number
  errorRate?: number
  slowQueryTime?: number
  cacheHitRatio?: number
  memoryUsage?: number
  responseTime?: number
}

export interface PerformanceAlert {
  id: string
  type: 'performance' | 'error' | 'resource' | 'database'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  metric: string
  value: number
  threshold: number
  timestamp: number
  resolved: boolean
  metadata?: any
}

export interface UserSession {
  sessionId: string
  userId?: string
  startTime: number
  endTime?: number
  pageViews: Array<{
    url: string
    timestamp: number
    loadTime: number
    webVitals?: any
  }>
  userAgent: string
  deviceInfo: {
    deviceType: 'mobile' | 'tablet' | 'desktop'
    screenSize: string
    connection?: string
  }
  errors: Array<{
    message: string
    stack?: string
    timestamp: number
    url: string
  }>
  customEvents: Array<{
    name: string
    data: any
    timestamp: number
  }>
}

export interface PerformanceReport {
  timestamp: number
  timeRange: { start: number; end: number }
  webVitals: {
    lcp: { avg: number; p95: number; samples: number }
    fid: { avg: number; p95: number; samples: number }
    cls: { avg: number; p95: number; samples: number }
    fcp: { avg: number; p95: number; samples: number }
    ttfb: { avg: number; p95: number; samples: number }
  }
  resources: {
    totalRequests: number
    avgLoadTime: number
    slowRequests: number
    cacheHitRatio: number
    compressionRatio: number
  }
  database: {
    totalQueries: number
    avgQueryTime: number
    slowQueries: number
    cacheHitRatio: number
    connectionPoolStats: any
  }
  errors: {
    totalErrors: number
    errorRate: number
    topErrors: Array<{ message: string; count: number }>
  }
  userSessions: {
    totalSessions: number
    avgSessionDuration: number
    topPages: Array<{ url: string; views: number }>
    deviceBreakdown: Record<string, number>
  }
  alerts: {
    active: number
    resolved: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
  }
  recommendations: string[]
}

// Performance monitoring system
export class PerformanceMonitor {
  private config: Required<MonitoringConfig>
  private webVitalsTracker: WebVitalsTracker | null = null
  private alerts: PerformanceAlert[] = []
  private userSessions = new Map<string, UserSession>()
  private currentSessionId: string | null = null
  private customMetrics = new Map<string, Array<{ value: number; timestamp: number }>>()
  private errorLog: Array<{ error: Error; timestamp: number; metadata?: any }> = []
  private reportingTimer: NodeJS.Timeout | null = null
  private observers: Array<PerformanceObserver | MutationObserver> = []

  constructor(config: MonitoringConfig = {}) {
    this.config = {
      enableRealTimeMonitoring: true,
      enableAlerting: true,
      enableReporting: true,
      alertThresholds: {
        lcp: 4000,
        fid: 300,
        cls: 0.25,
        errorRate: 0.05,
        slowQueryTime: 2000,
        cacheHitRatio: 0.7,
        memoryUsage: 0.8,
        responseTime: 3000
      },
      reportingInterval: 300000, // 5 minutes
      maxLogSize: 10000,
      enableUserSessionTracking: true,
      enableErrorTracking: true,
      enableCustomMetrics: true,
      debug: process.env.NODE_ENV === 'development',
      ...config,
      alertThresholds: {
        lcp: 4000,
        fid: 300,
        cls: 0.25,
        errorRate: 0.05,
        slowQueryTime: 2000,
        cacheHitRatio: 0.7,
        memoryUsage: 0.8,
        responseTime: 3000,
        ...config.alertThresholds
      }
    }

    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize(): void {
    // Initialize Web Vitals tracking
    if (this.config.enableRealTimeMonitoring) {
      this.initializeWebVitalsTracking()
    }

    // Setup error tracking
    if (this.config.enableErrorTracking) {
      this.setupErrorTracking()
    }

    // Setup user session tracking
    if (this.config.enableUserSessionTracking) {
      this.setupUserSessionTracking()
    }

    // Setup performance observers
    this.setupPerformanceObservers()

    // Start reporting if enabled
    if (this.config.enableReporting) {
      this.startPeriodicReporting()
    }

    // Setup page visibility tracking
    this.setupPageVisibilityTracking()
  }

  private initializeWebVitalsTracking(): void {
    this.webVitalsTracker = getWebVitalsTracker()
    
    if (!this.webVitalsTracker) {
      // Initialize if not already created
      const { initWebVitalsTracking } = require('./web-vitals')
      this.webVitalsTracker = initWebVitalsTracking({
        enableAnalytics: true,
        debug: this.config.debug
      })
    }

    // Monitor Web Vitals and create alerts
    this.monitorWebVitalsAlerts()
  }

  private monitorWebVitalsAlerts(): void {
    if (!this.webVitalsTracker) return

    // Check metrics periodically
    setInterval(() => {
      const metrics = this.webVitalsTracker!.getMetrics()
      
      // Check LCP
      if (metrics.lcp && metrics.lcp > this.config.alertThresholds.lcp!) {
        this.createAlert('performance', 'high', 'LCP threshold exceeded', 'lcp', metrics.lcp, this.config.alertThresholds.lcp!)
      }

      // Check FID
      if (metrics.fid && metrics.fid > this.config.alertThresholds.fid!) {
        this.createAlert('performance', 'high', 'FID threshold exceeded', 'fid', metrics.fid, this.config.alertThresholds.fid!)
      }

      // Check CLS
      if (metrics.cls && metrics.cls > this.config.alertThresholds.cls!) {
        this.createAlert('performance', 'medium', 'CLS threshold exceeded', 'cls', metrics.cls, this.config.alertThresholds.cls!)
      }
    }, 30000) // Check every 30 seconds
  }

  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        url: window.location.href
      })
    })

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandled-promise-rejection',
        url: window.location.href
      })
    })

    // Network error tracking
    this.setupNetworkErrorTracking()
  }

  private setupNetworkErrorTracking(): void {
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      const startTime = performance.now()
      
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const responseTime = endTime - startTime

        // Track slow responses
        if (responseTime > this.config.alertThresholds.responseTime!) {
          this.createAlert('performance', 'medium', 'Slow API response detected', 'response_time', responseTime, this.config.alertThresholds.responseTime!)
        }

        // Track HTTP errors
        if (!response.ok) {
          this.trackError(new Error(`HTTP ${response.status}: ${response.statusText}`), {
            url: args[0] as string,
            status: response.status,
            responseTime
          })
        }

        return response
      } catch (error) {
        const endTime = performance.now()
        this.trackError(error as Error, {
          url: args[0] as string,
          responseTime: endTime - startTime,
          type: 'network-error'
        })
        throw error
      }
    }
  }

  private setupUserSessionTracking(): void {
    this.currentSessionId = this.generateSessionId()
    
    const session: UserSession = {
      sessionId: this.currentSessionId,
      startTime: Date.now(),
      pageViews: [],
      userAgent: navigator.userAgent,
      deviceInfo: {
        deviceType: this.detectDeviceType(),
        screenSize: `${screen.width}x${screen.height}`,
        connection: this.getConnectionInfo()
      },
      errors: [],
      customEvents: []
    }

    this.userSessions.set(this.currentSessionId, session)

    // Track page views
    this.trackPageView()

    // Track page navigation
    window.addEventListener('beforeunload', () => {
      this.endCurrentSession()
    })

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession()
      } else {
        this.resumeSession()
      }
    })
  }

  private setupPerformanceObservers(): void {
    // Navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceNavigationTiming[]
        entries.forEach(entry => this.analyzeNavigationTiming(entry))
      })
      
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)

      // Long task observer
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.duration > 50) {
            this.createAlert('performance', 'medium', 'Long task detected', 'long_task', entry.duration, 50, {
              name: entry.name,
              startTime: entry.startTime
            })
          }
        })
      })

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.push(longTaskObserver)
      } catch (e) {
        // Long task API not supported
      }
    }

    // Memory usage monitoring
    this.setupMemoryMonitoring()
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit

        if (usageRatio > this.config.alertThresholds.memoryUsage!) {
          this.createAlert('resource', 'high', 'High memory usage detected', 'memory_usage', usageRatio, this.config.alertThresholds.memoryUsage!, {
            usedHeapSize: memory.usedJSHeapSize,
            totalHeapSize: memory.totalJSHeapSize,
            heapSizeLimit: memory.jsHeapSizeLimit
          })
        }
      }, 60000) // Check every minute
    }
  }

  private setupPageVisibilityTracking(): void {
    let visibilityStart = Date.now()

    document.addEventListener('visibilitychange', () => {
      const now = Date.now()
      
      if (document.hidden) {
        // Page became hidden
        const visibleTime = now - visibilityStart
        this.trackCustomMetric('page_visibility_time', visibleTime)
      } else {
        // Page became visible
        visibilityStart = now
      }
    })
  }

  // Core monitoring methods
  public trackError(error: Error, metadata?: any): void {
    const errorEntry = {
      error,
      timestamp: Date.now(),
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...metadata
      }
    }

    this.errorLog.push(errorEntry)

    // Add to current session
    if (this.currentSessionId) {
      const session = this.userSessions.get(this.currentSessionId)
      if (session) {
        session.errors.push({
          message: error.message,
          stack: error.stack,
          timestamp: Date.now(),
          url: window.location.href
        })
      }
    }

    // Check error rate
    this.checkErrorRate()

    // Limit log size
    if (this.errorLog.length > this.config.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.config.maxLogSize / 2)
    }

    if (this.config.debug) {
      console.error('Tracked error:', error, metadata)
    }
  }

  public trackCustomMetric(name: string, value: number, metadata?: any): void {
    if (!this.config.enableCustomMetrics) return

    if (!this.customMetrics.has(name)) {
      this.customMetrics.set(name, [])
    }

    const metrics = this.customMetrics.get(name)!
    metrics.push({ value, timestamp: Date.now() })

    // Keep only recent metrics
    const oneHourAgo = Date.now() - 3600000
    const recentMetrics = metrics.filter(m => m.timestamp > oneHourAgo)
    this.customMetrics.set(name, recentMetrics)

    // Track in current session
    if (this.currentSessionId) {
      const session = this.userSessions.get(this.currentSessionId)
      if (session) {
        session.customEvents.push({
          name,
          data: { value, metadata },
          timestamp: Date.now()
        })
      }
    }
  }

  public trackPageView(url: string = window.location.href): void {
    const startTime = performance.now()

    // Add to current session
    if (this.currentSessionId) {
      const session = this.userSessions.get(this.currentSessionId)
      if (session) {
        session.pageViews.push({
          url,
          timestamp: Date.now(),
          loadTime: startTime,
          webVitals: this.webVitalsTracker?.getMetrics()
        })
      }
    }
  }

  private createAlert(
    type: PerformanceAlert['type'],
    severity: PerformanceAlert['severity'],
    message: string,
    metric: string,
    value: number,
    threshold: number,
    metadata?: any
  ): void {
    if (!this.config.enableAlerting) return

    // Check if similar alert already exists
    const existingAlert = this.alerts.find(a => 
      a.metric === metric && 
      a.type === type && 
      !a.resolved &&
      Math.abs(a.value - value) < threshold * 0.1 // Within 10% of threshold
    )

    if (existingAlert) {
      // Update existing alert
      existingAlert.value = value
      existingAlert.timestamp = Date.now()
      return
    }

    const alert: PerformanceAlert = {
      id: this.generateAlertId(),
      type,
      severity,
      message,
      metric,
      value,
      threshold,
      timestamp: Date.now(),
      resolved: false,
      metadata
    }

    this.alerts.push(alert)

    // Limit alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-500)
    }

    // Trigger alert callback or notification
    this.handleAlert(alert)

    if (this.config.debug) {
      console.warn('Performance alert:', alert)
    }
  }

  private handleAlert(alert: PerformanceAlert): void {
    // Auto-resolve alerts after a certain time
    setTimeout(() => {
      this.resolveAlert(alert.id)
    }, 300000) // Auto-resolve after 5 minutes

    // Send to external monitoring service
    this.sendAlertToService(alert)
  }

  private async sendAlertToService(alert: PerformanceAlert): Promise<void> {
    if (!this.config.apiEndpoint) return

    try {
      await fetch(`${this.config.apiEndpoint}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      })
    } catch (error) {
      if (this.config.debug) {
        console.warn('Failed to send alert to monitoring service:', error)
      }
    }
  }

  private checkErrorRate(): void {
    const oneHourAgo = Date.now() - 3600000
    const recentErrors = this.errorLog.filter(e => e.timestamp > oneHourAgo)
    
    // Assuming some baseline request count
    const estimatedRequests = Math.max(100, recentErrors.length * 10)
    const errorRate = recentErrors.length / estimatedRequests

    if (errorRate > this.config.alertThresholds.errorRate!) {
      this.createAlert('error', 'critical', 'High error rate detected', 'error_rate', errorRate, this.config.alertThresholds.errorRate!)
    }
  }

  private analyzeNavigationTiming(entry: PerformanceNavigationTiming): void {
    const metrics = {
      dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcpConnect: entry.connectEnd - entry.connectStart,
      serverResponse: entry.responseEnd - entry.requestStart,
      domParsing: entry.domContentLoadedEventEnd - entry.responseEnd,
      resourceLoading: entry.loadEventStart - entry.domContentLoadedEventEnd
    }

    // Track slow navigation phases
    Object.entries(metrics).forEach(([phase, duration]) => {
      if (duration > 1000) {
        this.createAlert('performance', 'medium', `Slow ${phase} detected`, phase, duration, 1000)
      }
    })
  }

  // Session management
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      if (/iPad/i.test(userAgent) || (screen.width >= 768 && screen.width <= 1024)) {
        return 'tablet'
      }
      return 'mobile'
    }
    
    return 'desktop'
  }

  private getConnectionInfo(): string {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      return conn?.effectiveType || 'unknown'
    }
    return 'unknown'
  }

  private endCurrentSession(): void {
    if (this.currentSessionId) {
      const session = this.userSessions.get(this.currentSessionId)
      if (session) {
        session.endTime = Date.now()
      }
    }
  }

  private pauseSession(): void {
    // Implementation for pausing session tracking
  }

  private resumeSession(): void {
    // Implementation for resuming session tracking
  }

  // Reporting
  private startPeriodicReporting(): void {
    this.reportingTimer = setInterval(() => {
      this.generateAndSendReport()
    }, this.config.reportingInterval)
  }

  private async generateAndSendReport(): Promise<void> {
    const report = this.generateReport()
    
    if (this.config.apiEndpoint) {
      try {
        await fetch(`${this.config.apiEndpoint}/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report)
        })
      } catch (error) {
        if (this.config.debug) {
          console.warn('Failed to send performance report:', error)
        }
      }
    }

    // Store locally
    this.storeReportLocally(report)
  }

  private storeReportLocally(report: PerformanceReport): void {
    try {
      const key = 'performance_reports'
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.push(report)
      
      // Keep only last 50 reports
      if (existing.length > 50) {
        existing.splice(0, existing.length - 50)
      }
      
      localStorage.setItem(key, JSON.stringify(existing))
    } catch (error) {
      // Storage failed, ignore
    }
  }

  // Public methods
  public generateReport(timeRange?: { start: number; end: number }): PerformanceReport {
    const now = Date.now()
    const range = timeRange || { start: now - 3600000, end: now } // Last hour

    // Collect Web Vitals data
    const webVitalsData = this.webVitalsTracker?.getMetrics() || {}
    
    // Collect resource data
    const resourceOptimizer = getResourceOptimizer()
    const resourceData = resourceOptimizer?.getMetrics()

    // Collect database data
    const queryOptimizer = getQueryOptimizer()
    const dbStats = queryOptimizer?.analyzeQueries()

    // Collect cache data
    const cache = getCache()
    const cacheStats = cache.getStats()

    // Process user sessions
    const sessionsInRange = Array.from(this.userSessions.values())
      .filter(s => s.startTime >= range.start && s.startTime <= range.end)

    // Process errors
    const errorsInRange = this.errorLog
      .filter(e => e.timestamp >= range.start && e.timestamp <= range.end)

    // Process alerts
    const alertsInRange = this.alerts
      .filter(a => a.timestamp >= range.start && a.timestamp <= range.end)

    const report: PerformanceReport = {
      timestamp: now,
      timeRange: range,
      webVitals: {
        lcp: { avg: webVitalsData.lcp || 0, p95: webVitalsData.lcp || 0, samples: 1 },
        fid: { avg: webVitalsData.fid || 0, p95: webVitalsData.fid || 0, samples: 1 },
        cls: { avg: webVitalsData.cls || 0, p95: webVitalsData.cls || 0, samples: 1 },
        fcp: { avg: webVitalsData.fcp || 0, p95: webVitalsData.fcp || 0, samples: 1 },
        ttfb: { avg: webVitalsData.ttfb || 0, p95: webVitalsData.ttfb || 0, samples: 1 }
      },
      resources: {
        totalRequests: resourceData?.resources?.length || 0,
        avgLoadTime: resourceData ? resourceData.loadTime / (resourceData.resources?.length || 1) : 0,
        slowRequests: resourceData?.resources?.filter(r => r.loadTime > 1000).length || 0,
        cacheHitRatio: resourceData?.cacheHitRatio || 0,
        compressionRatio: 0.7 // Placeholder
      },
      database: {
        totalQueries: dbStats?.slowQueries.length || 0,
        avgQueryTime: dbStats?.averageQueryTime || 0,
        slowQueries: dbStats?.slowQueries.length || 0,
        cacheHitRatio: dbStats?.cacheHitRatio || 0,
        connectionPoolStats: queryOptimizer?.getConnectionStats()
      },
      errors: {
        totalErrors: errorsInRange.length,
        errorRate: errorsInRange.length / Math.max(100, errorsInRange.length * 10),
        topErrors: this.getTopErrors(errorsInRange)
      },
      userSessions: {
        totalSessions: sessionsInRange.length,
        avgSessionDuration: this.calculateAvgSessionDuration(sessionsInRange),
        topPages: this.getTopPages(sessionsInRange),
        deviceBreakdown: this.getDeviceBreakdown(sessionsInRange)
      },
      alerts: {
        active: this.alerts.filter(a => !a.resolved).length,
        resolved: this.alerts.filter(a => a.resolved).length,
        byType: this.getAlertsByType(alertsInRange),
        bySeverity: this.getAlertsBySeverity(alertsInRange)
      },
      recommendations: this.generateRecommendations()
    }

    return report
  }

  private getTopErrors(errors: typeof this.errorLog): Array<{ message: string; count: number }> {
    const errorCounts = new Map<string, number>()
    
    errors.forEach(e => {
      const message = e.error.message
      errorCounts.set(message, (errorCounts.get(message) || 0) + 1)
    })

    return Array.from(errorCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private calculateAvgSessionDuration(sessions: UserSession[]): number {
    const completedSessions = sessions.filter(s => s.endTime)
    if (completedSessions.length === 0) return 0

    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.endTime! - s.startTime), 0)
    return totalDuration / completedSessions.length
  }

  private getTopPages(sessions: UserSession[]): Array<{ url: string; views: number }> {
    const pageCounts = new Map<string, number>()
    
    sessions.forEach(s => {
      s.pageViews.forEach(p => {
        pageCounts.set(p.url, (pageCounts.get(p.url) || 0) + 1)
      })
    })

    return Array.from(pageCounts.entries())
      .map(([url, views]) => ({ url, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
  }

  private getDeviceBreakdown(sessions: UserSession[]): Record<string, number> {
    const deviceCounts: Record<string, number> = {}
    
    sessions.forEach(s => {
      const device = s.deviceInfo.deviceType
      deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })

    return deviceCounts
  }

  private getAlertsByType(alerts: PerformanceAlert[]): Record<string, number> {
    const typeCounts: Record<string, number> = {}
    
    alerts.forEach(a => {
      typeCounts[a.type] = (typeCounts[a.type] || 0) + 1
    })

    return typeCounts
  }

  private getAlertsBySeverity(alerts: PerformanceAlert[]): Record<string, number> {
    const severityCounts: Record<string, number> = {}
    
    alerts.forEach(a => {
      severityCounts[a.severity] = (severityCounts[a.severity] || 0) + 1
    })

    return severityCounts
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    
    // Add recommendations based on current state
    const activeAlerts = this.alerts.filter(a => !a.resolved)
    
    if (activeAlerts.some(a => a.metric === 'lcp')) {
      recommendations.push('Optimize images and enable lazy loading to improve LCP')
    }
    
    if (activeAlerts.some(a => a.metric === 'fid')) {
      recommendations.push('Reduce JavaScript execution time and implement code splitting')
    }
    
    if (activeAlerts.some(a => a.type === 'error' && a.severity === 'critical')) {
      recommendations.push('Investigate and fix critical errors affecting user experience')
    }

    return recommendations
  }

  // Alert management
  public getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(a => !a.resolved)
  }

  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      return true
    }
    return false
  }

  public getCustomMetrics(): Map<string, Array<{ value: number; timestamp: number }>> {
    return new Map(this.customMetrics)
  }

  public getUserSessions(): UserSession[] {
    return Array.from(this.userSessions.values())
  }

  public getErrorLog(): typeof this.errorLog {
    return [...this.errorLog]
  }

  public destroy(): void {
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []

    // Clear reporting timer
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer)
      this.reportingTimer = null
    }

    // Clear data
    this.alerts = []
    this.userSessions.clear()
    this.customMetrics.clear()
    this.errorLog = []

    // Destroy other systems
    this.webVitalsTracker?.destroy()
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null

export function getPerformanceMonitor(config?: MonitoringConfig): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor(config)
  }
  return performanceMonitor!
}

export function initPerformanceMonitoring(config?: MonitoringConfig): PerformanceMonitor {
  return getPerformanceMonitor(config)
}

export default PerformanceMonitor