import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

export interface WebVitalsMetrics {
  cls?: number
  fid?: number
  fcp?: number
  lcp?: number
  ttfb?: number
  timestamp: number
  url: string
  userAgent: string
  connection?: {
    effectiveType: string
    downlink?: number
    rtt?: number
  }
  deviceInfo?: {
    deviceMemory?: number
    hardwareConcurrency?: number
    deviceType: 'mobile' | 'tablet' | 'desktop'
  }
}

export interface PerformanceConfig {
  enableAnalytics: boolean
  sampleRate: number
  endpoint?: string
  debug: boolean
  thresholds: {
    lcp: { good: number; needsImprovement: number }
    fid: { good: number; needsImprovement: number }
    cls: { good: number; needsImprovement: number }
    fcp: { good: number; needsImprovement: number }
    ttfb: { good: number; needsImprovement: number }
  }
}

const defaultConfig: PerformanceConfig = {
  enableAnalytics: true,
  sampleRate: 1.0, // 100% sampling in development
  debug: process.env.NODE_ENV === 'development',
  thresholds: {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 }
  }
};

export class WebVitalsTracker {
  private config: PerformanceConfig;
  private metrics: Partial<WebVitalsMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private reportTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };

    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  private initializeTracking(): void {
    // Initialize base metrics
    this.metrics = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      deviceInfo: this.getDeviceInfo()
    };

    // Track Core Web Vitals
    this.trackCoreWebVitals();

    // Track additional performance metrics
    this.trackResourceTiming();
    this.trackNavigationTiming();
    this.trackLongTasks();

    // Set up periodic reporting
    if (this.config.enableAnalytics) {
      this.startPeriodicReporting();
    }
  }

  private trackCoreWebVitals(): void {
    // Largest Contentful Paint
    getLCP((metric: Metric) => {
      this.metrics.lcp = metric.value;
      this.logMetric('LCP', metric.value, this.config.thresholds.lcp);
      this.reportMetric('lcp', metric.value);
    });

    // First Input Delay
    getFID((metric: Metric) => {
      this.metrics.fid = metric.value;
      this.logMetric('FID', metric.value, this.config.thresholds.fid);
      this.reportMetric('fid', metric.value);
    });

    // Cumulative Layout Shift
    getCLS((metric: Metric) => {
      this.metrics.cls = metric.value;
      this.logMetric('CLS', metric.value, this.config.thresholds.cls);
      this.reportMetric('cls', metric.value);
    });

    // First Contentful Paint
    getFCP((metric: Metric) => {
      this.metrics.fcp = metric.value;
      this.logMetric('FCP', metric.value, this.config.thresholds.fcp);
      this.reportMetric('fcp', metric.value);
    });

    // Time to First Byte
    getTTFB((metric: Metric) => {
      this.metrics.ttfb = metric.value;
      this.logMetric('TTFB', metric.value, this.config.thresholds.ttfb);
      this.reportMetric('ttfb', metric.value);
    });
  }

  private trackResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.analyzeResourcePerformance(entries as PerformanceResourceTiming[]);
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  private trackNavigationTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.analyzeNavigationPerformance(entries as PerformanceNavigationTiming[]);
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  private trackLongTasks(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.analyzeLongTasks(entries);
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.push(observer);
      } catch (e) {
        // Long task API not supported
        if (this.config.debug) {
          console.warn('Long task API not supported');
        }
      }
    }
  }

  private analyzeResourcePerformance(entries: PerformanceResourceTiming[]): void {
    const slowResources = entries.filter(entry => entry.duration > 1000);
    const largeResources = entries.filter(entry => entry.transferSize && entry.transferSize > 1024 * 1024); // > 1MB

    if (slowResources.length > 0) {
      this.reportIssue('slow-resources', {
        count: slowResources.length,
        resources: slowResources.map(r => ({
          name: r.name,
          duration: r.duration,
          size: r.transferSize
        }))
      });
    }

    if (largeResources.length > 0) {
      this.reportIssue('large-resources', {
        count: largeResources.length,
        resources: largeResources.map(r => ({
          name: r.name,
          size: r.transferSize,
          duration: r.duration
        }))
      });
    }
  }

  private analyzeNavigationPerformance(entries: PerformanceNavigationTiming[]): void {
    entries.forEach(entry => {
      const metrics = {
        dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
        tcpConnect: entry.connectEnd - entry.connectStart,
        serverResponse: entry.responseEnd - entry.requestStart,
        domParsing: entry.domContentLoadedEventEnd - entry.responseEnd,
        resourceLoading: entry.loadEventStart - entry.domContentLoadedEventEnd
      };

      // Report slow navigation phases
      Object.entries(metrics).forEach(([phase, duration]) => {
        if (duration > 1000) { // > 1 second
          this.reportIssue('slow-navigation-phase', {
            phase,
            duration,
            url: entry.name
          });
        }
      });
    });
  }

  private analyzeLongTasks(entries: PerformanceEntry[]): void {
    entries.forEach(entry => {
      if (entry.duration > 50) { // Tasks longer than 50ms
        this.reportIssue('long-task', {
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name
        });
      }
    });
  }

  private getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      if (conn) {
        return {
          effectiveType: conn.effectiveType || 'unknown',
          downlink: conn.downlink,
          rtt: conn.rtt
        };
      }
    }

    return { effectiveType: 'unknown' };
  }

  private getDeviceInfo() {
    return {
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceType: this.detectDeviceType()
    };
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      if (/iPad/i.test(userAgent) || (screen.width >= 768 && screen.width <= 1024)) {
        return 'tablet';
      }
      return 'mobile';
    }

    return 'desktop';
  }

  private logMetric(name: string, value: number, thresholds: { good: number; needsImprovement: number }): void {
    if (!this.config.debug) return;

    let status = 'poor';
    let color = '#ff4444';

    if (value <= thresholds.good) {
      status = 'good';
      color = '#44ff44';
    } else if (value <= thresholds.needsImprovement) {
      status = 'needs improvement';
      color = '#ffaa44';
    }

    console.log(
      `%c${name}: ${value.toFixed(2)} (${status})`,
      `color: ${color}; font-weight: bold;`
    );
  }

  private reportMetric(metricName: string, value: number): void {
    if (!this.shouldReport()) return;

    const data = {
      metric: metricName,
      value,
      ...this.metrics,
      timestamp: Date.now()
    };

    this.sendToAnalytics('web-vitals', data);
  }

  private reportIssue(issueType: string, details: any): void {
    if (!this.shouldReport()) return;

    const data = {
      type: 'performance-issue',
      issueType,
      details,
      ...this.metrics,
      timestamp: Date.now()
    };

    this.sendToAnalytics('performance-issues', data);

    if (this.config.debug) {
      console.warn(`Performance Issue - ${issueType}:`, details);
    }
  }

  private shouldReport(): boolean {
    return this.config.enableAnalytics && Math.random() < this.config.sampleRate;
  }

  private async sendToAnalytics(endpoint: string, data: any): Promise<void> {
    if (!this.config.endpoint) {
      // Store locally or use default endpoint
      this.storeLocally(endpoint, data);
      return;
    }

    try {
      await fetch(`${this.config.endpoint}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        keepalive: true
      });
    } catch (error) {
      if (this.config.debug) {
        console.error('Failed to send analytics:', error);
      }
      // Fallback to local storage
      this.storeLocally(endpoint, data);
    }
  }

  private storeLocally(endpoint: string, data: any): void {
    try {
      const key = `webvitals_${endpoint}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);

      // Keep only last 100 entries
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }

      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      // Local storage not available or full
    }
  }

  private startPeriodicReporting(): void {
    // Report current metrics every 30 seconds
    this.reportTimer = setInterval(() => {
      if (Object.keys(this.metrics).length > 3) { // Has more than just base info
        this.sendToAnalytics('periodic-metrics', { ...this.metrics, timestamp: Date.now() });
      }
    }, 30000);
  }

  // Public methods
  public getMetrics(): WebVitalsMetrics {
    return this.metrics as WebVitalsMetrics;
  }

  public getScore(): {
    overall: 'good' | 'needs-improvement' | 'poor'
    scores: Record<string, 'good' | 'needs-improvement' | 'poor'>
  } {
    const scores: Record<string, 'good' | 'needs-improvement' | 'poor'> = {};
    let goodCount = 0;
    let totalCount = 0;

    // Evaluate each metric
    Object.entries(this.config.thresholds).forEach(([metric, thresholds]) => {
      const value = this.metrics[metric as keyof WebVitalsMetrics] as number;

      if (value !== undefined) {
        totalCount++;

        if (value <= thresholds.good) {
          scores[metric] = 'good';
          goodCount++;
        } else if (value <= thresholds.needsImprovement) {
          scores[metric] = 'needs-improvement';
        } else {
          scores[metric] = 'poor';
        }
      }
    });

    // Calculate overall score
    let overall: 'good' | 'needs-improvement' | 'poor' = 'poor';
    if (totalCount > 0) {
      const goodPercentage = goodCount / totalCount;
      if (goodPercentage >= 0.75) {
        overall = 'good';
      } else if (goodPercentage >= 0.5) {
        overall = 'needs-improvement';
      }
    }

    return { overall, scores };
  }

  public generateReport(): {
    metrics: WebVitalsMetrics
    score: ReturnType<typeof this.getScore>
    recommendations: string[]
  } {
    const metrics = this.getMetrics();
    const score = this.getScore();
    const recommendations: string[] = [];

    // Generate recommendations based on poor scores
    Object.entries(score.scores).forEach(([metric, rating]) => {
      if (rating === 'poor') {
        switch (metric) {
          case 'lcp':
            recommendations.push('Optimize images and enable lazy loading to improve LCP');
            recommendations.push('Use a CDN and optimize server response times');
            break;
          case 'fid':
            recommendations.push('Minimize JavaScript execution time and use code splitting');
            recommendations.push('Remove unused JavaScript and optimize event handlers');
            break;
          case 'cls':
            recommendations.push('Set explicit dimensions for images and ads');
            recommendations.push('Avoid dynamically injected content above existing content');
            break;
          case 'fcp':
            recommendations.push('Optimize critical rendering path and inline critical CSS');
            recommendations.push('Reduce server response time and optimize resource loading');
            break;
          case 'ttfb':
            recommendations.push('Optimize server performance and use edge caching');
            recommendations.push('Minimize redirect chains and optimize DNS lookup');
            break;
        }
      }
    });

    return { metrics, score, recommendations };
  }

  public destroy(): void {
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // Clear reporting timer
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
  }
}

// Singleton instance
let webVitalsTracker: WebVitalsTracker | null = null;

export function initWebVitalsTracking(config?: Partial<PerformanceConfig>): WebVitalsTracker {
  if (!webVitalsTracker && typeof window !== 'undefined') {
    webVitalsTracker = new WebVitalsTracker(config);
  }
  return webVitalsTracker!;
}

export function getWebVitalsTracker(): WebVitalsTracker | null {
  return webVitalsTracker;
}

// Utility functions for performance optimization
export function optimizeImageLoading(): void {
  // Implement lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

export function preloadCriticalResources(resources: string[]): void {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;

    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(woff2?|ttf|eot)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
  });
}

export function optimizeFontLoading(): void {
  // Use font-display: swap for better FCP
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'optimized-font';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

export { WebVitalsMetrics, PerformanceConfig };
