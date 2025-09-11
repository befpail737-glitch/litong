'use client';

export interface ResourceOptimizationConfig {
  enablePrefetching?: boolean
  enableServiceWorker?: boolean
  enableResourceHints?: boolean
  enableFontOptimization?: boolean
  enableCSSOptimization?: boolean
  enableJSOptimization?: boolean
  compressionLevel?: 'low' | 'medium' | 'high'
  cacheStrategy?: 'aggressive' | 'moderate' | 'conservative'
  debug?: boolean
}

export interface ResourceMetrics {
  totalSize: number
  compressedSize: number
  loadTime: number
  cacheHitRatio: number
  resources: Array<{
    url: string
    type: string
    size: number
    loadTime: number
    cached: boolean
    compressed: boolean
  }>
}

export interface FontLoadingOptions {
  strategy?: 'swap' | 'fallback' | 'optional' | 'block'
  preload?: string[]
  fallback?: string
  unicode?: string
}

// Resource optimization manager
export class ResourceOptimizer {
  private config: Required<ResourceOptimizationConfig>;
  private metrics: Partial<ResourceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private prefetchedResources = new Set<string>();
  private fontCache = new Map<string, FontFace>();

  constructor(config: ResourceOptimizationConfig = {}) {
    this.config = {
      enablePrefetching: true,
      enableServiceWorker: false,
      enableResourceHints: true,
      enableFontOptimization: true,
      enableCSSOptimization: true,
      enableJSOptimization: true,
      compressionLevel: 'medium',
      cacheStrategy: 'moderate',
      debug: process.env.NODE_ENV === 'development',
      ...config
    };

    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private async initialize(): Promise<void> {
    // Initialize resource monitoring
    this.setupResourceMonitoring();

    // Setup font optimization
    if (this.config.enableFontOptimization) {
      this.optimizeFontLoading();
    }

    // Setup resource hints
    if (this.config.enableResourceHints) {
      this.addResourceHints();
    }

    // Setup service worker for caching
    if (this.config.enableServiceWorker && 'serviceWorker' in navigator) {
      this.registerServiceWorker();
    }

    // Setup prefetching
    if (this.config.enablePrefetching) {
      this.setupIntelligentPrefetching();
    }

    // Optimize CSS loading
    if (this.config.enableCSSOptimization) {
      this.optimizeCSSLoading();
    }

    // Optimize JS loading
    if (this.config.enableJSOptimization) {
      this.optimizeJSLoading();
    }
  }

  private setupResourceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[];
        this.analyzeResourcePerformance(entries);
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }

    // Monitor existing resources
    const existingEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    this.analyzeResourcePerformance(existingEntries);
  }

  private analyzeResourcePerformance(entries: PerformanceResourceTiming[]): void {
    let totalSize = 0;
    let compressedSize = 0;
    let totalLoadTime = 0;
    const resources: ResourceMetrics['resources'] = [];

    entries.forEach(entry => {
      const size = entry.transferSize || entry.decodedBodySize || 0;
      const loadTime = entry.responseEnd - entry.startTime;
      const compressed = (entry.encodedBodySize || 0) < (entry.decodedBodySize || 0);
      const cached = entry.transferSize === 0 && entry.decodedBodySize > 0;

      totalSize += entry.decodedBodySize || 0;
      compressedSize += entry.encodedBodySize || 0;
      totalLoadTime += loadTime;

      resources.push({
        url: entry.name,
        type: this.getResourceType(entry.name),
        size,
        loadTime,
        cached,
        compressed
      });

      // Log slow resources
      if (loadTime > 1000 && this.config.debug) {
        console.warn(`Slow resource detected: ${entry.name} (${loadTime.toFixed(2)}ms)`);
      }
    });

    // Update metrics
    this.metrics = {
      totalSize,
      compressedSize,
      loadTime: totalLoadTime,
      cacheHitRatio: resources.length > 0 ?
        resources.filter(r => r.cached).length / resources.length : 0,
      resources
    };

    // Send analytics
    this.sendResourceMetrics();
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(css)$/i)) return 'stylesheet';
    if (url.match(/\.(js)$/i)) return 'script';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/i)) return 'image';
    if (url.match(/\.(woff2?|ttf|eot)$/i)) return 'font';
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    return 'other';
  }

  // Font optimization
  private optimizeFontLoading(): void {
    // Add font-display: swap to existing fonts
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(styleElement);

    // Preload critical fonts
    this.preloadCriticalFonts();

    // Setup font loading optimization
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        this.logFontMetrics();
      });
    }
  }

  private preloadCriticalFonts(): void {
    const criticalFonts = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-var-latin.woff2'
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  public loadFontWithFallback(
    fontFamily: string,
    fontUrl: string,
    options: FontLoadingOptions = {}
  ): Promise<void> {
    const {
      strategy = 'swap',
      fallback = 'Arial, sans-serif',
      unicode = 'U+0020-007F'
    } = options;

    return new Promise((resolve, reject) => {
      if (this.fontCache.has(fontFamily)) {
        resolve();
        return;
      }

      const fontFace = new FontFace(fontFamily, `url(${fontUrl})`, {
        display: strategy,
        unicodeRange: unicode
      });

      const timeout = setTimeout(() => {
        reject(new Error(`Font loading timeout: ${fontFamily}`));
      }, 10000);

      fontFace.load()
        .then(loadedFont => {
          clearTimeout(timeout);
          document.fonts.add(loadedFont);
          this.fontCache.set(fontFamily, loadedFont);

          // Apply font with fallback
          const style = document.createElement('style');
          style.textContent = `
            .font-${fontFamily.toLowerCase().replace(/\s+/g, '-')} {
              font-family: "${fontFamily}", ${fallback};
            }
          `;
          document.head.appendChild(style);

          resolve();
        })
        .catch(error => {
          clearTimeout(timeout);
          console.warn(`Failed to load font ${fontFamily}:`, error);
          reject(error);
        });
    });
  }

  private logFontMetrics(): void {
    if (!this.config.debug) return;

    const fonts = Array.from(document.fonts);
    console.group('Font Loading Metrics');
    console.log(`Total fonts: ${fonts.length}`);
    fonts.forEach(font => {
      console.log(`${font.family}: ${font.status}`);
    });
    console.groupEnd();
  }

  // Resource hints
  private addResourceHints(): void {
    // DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdn.jsdelivr.net'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical domains
    const criticalDomains = [
      'https://api.litong.com',
      'https://cdn.litong.com'
    ];

    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  // Service worker registration
  private async registerServiceWorker(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                this.notifyServiceWorkerUpdate();
              }
            });
          }
        });

        if (this.config.debug) {
          console.log('Service Worker registered successfully');
        }
      }
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }

  private notifyServiceWorkerUpdate(): void {
    // Notify user about available update
    const event = new CustomEvent('sw-update-available');
    window.dispatchEvent(event);
  }

  // Intelligent prefetching
  private setupIntelligentPrefetching(): void {
    // Prefetch on hover
    this.setupHoverPrefetching();

    // Prefetch based on viewport
    this.setupViewportPrefetching();

    // Prefetch based on user behavior
    this.setupBehaviorPrefetching();
  }

  private setupHoverPrefetching(): void {
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link && this.shouldPrefetch(link.href)) {
        this.prefetchResource(link.href, 'navigation');
      }
    }, { passive: true });
  }

  private setupViewportPrefetching(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const href = element.getAttribute('href');

            if (href && this.shouldPrefetch(href)) {
              this.prefetchResource(href, 'viewport');
            }
          }
        });
      }, { rootMargin: '100px' });

      // Observe all links
      document.querySelectorAll('a[href]').forEach(link => {
        observer.observe(link);
      });
    }
  }

  private setupBehaviorPrefetching(): void {
    let idleTimeout: NodeJS.Timeout;

    const prefetchOnIdle = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        this.prefetchPopularRoutes();
      }, 2000);
    };

    document.addEventListener('scroll', prefetchOnIdle, { passive: true });
    document.addEventListener('mousemove', prefetchOnIdle, { passive: true });
  }

  private shouldPrefetch(url: string): boolean {
    if (this.prefetchedResources.has(url)) return false;
    if (url.startsWith('mailto:') || url.startsWith('tel:')) return false;
    if (url.includes('#')) return false;

    // Only prefetch same-origin URLs
    try {
      const urlObj = new URL(url, window.location.href);
      return urlObj.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  private prefetchResource(url: string, trigger: string): void {
    if (this.prefetchedResources.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.setAttribute('data-trigger', trigger);

    document.head.appendChild(link);
    this.prefetchedResources.add(url);

    if (this.config.debug) {
      console.log(`Prefetched: ${url} (trigger: ${trigger})`);
    }
  }

  private prefetchPopularRoutes(): void {
    const popularRoutes = [
      '/products',
      '/applications',
      '/solutions',
      '/contact'
    ];

    popularRoutes.forEach(route => {
      if (!this.prefetchedResources.has(route)) {
        this.prefetchResource(route, 'popular');
      }
    });
  }

  // CSS optimization
  private optimizeCSSLoading(): void {
    // Inline critical CSS (this would be done at build time)
    this.inlineCriticalCSS();

    // Load non-critical CSS asynchronously
    this.loadNonCriticalCSS();

    // Remove unused CSS (runtime detection)
    this.detectUnusedCSS();
  }

  private inlineCriticalCSS(): void {
    // This would typically be done at build time with tools like Critical
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      .header { background: #fff; border-bottom: 1px solid #eee; }
      .hero { min-height: 60vh; display: flex; align-items: center; }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);
  }

  private loadNonCriticalCSS(): void {
    const nonCriticalCSS = [
      '/css/components.css',
      '/css/utilities.css'
    ];

    nonCriticalCSS.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    });
  }

  private detectUnusedCSS(): void {
    // Simple runtime detection of unused CSS
    setTimeout(() => {
      const allElements = document.querySelectorAll('*');
      const usedClasses = new Set<string>();

      allElements.forEach(element => {
        element.classList.forEach(className => {
          usedClasses.add(className);
        });
      });

      if (this.config.debug) {
        console.log(`Used CSS classes: ${usedClasses.size}`);
      }
    }, 5000);
  }

  // JavaScript optimization
  private optimizeJSLoading(): void {
    // Defer non-critical JavaScript
    this.deferNonCriticalJS();

    // Load JavaScript modules efficiently
    this.optimizeModuleLoading();
  }

  private deferNonCriticalJS(): void {
    const scripts = document.querySelectorAll('script[src]:not([defer]):not([async])');

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !this.isCriticalScript(src)) {
        script.setAttribute('defer', '');
      }
    });
  }

  private isCriticalScript(src: string): boolean {
    const criticalPatterns = [
      /polyfill/,
      /runtime/,
      /vendor/,
      /main/
    ];

    return criticalPatterns.some(pattern => pattern.test(src));
  }

  private optimizeModuleLoading(): void {
    // Add modulepreload for ES modules
    const moduleScripts = document.querySelectorAll('script[type="module"]');

    moduleScripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = src;
        document.head.appendChild(link);
      }
    });
  }

  // Analytics and metrics
  private sendResourceMetrics(): void {
    if (!this.config.debug && !this.metrics.resources) return;

    const data = {
      type: 'resource-metrics',
      metrics: this.metrics,
      timestamp: Date.now(),
      url: window.location.href
    };

    // Store locally
    try {
      const key = 'resource_optimization_metrics';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);

      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }

      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      // Storage failed, ignore
    }
  }

  // Public methods
  public getMetrics(): ResourceMetrics | undefined {
    return this.metrics as ResourceMetrics;
  }

  public prefetch(url: string): void {
    this.prefetchResource(url, 'manual');
  }

  public loadFont(fontFamily: string, fontUrl: string, options?: FontLoadingOptions): Promise<void> {
    return this.loadFontWithFallback(fontFamily, fontUrl, options);
  }

  public generateReport(): {
    metrics: ResourceMetrics | undefined
    recommendations: string[]
    prefetchedResources: string[]
  } {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];

    if (metrics) {
      // Analyze metrics and generate recommendations
      const avgLoadTime = metrics.loadTime / (metrics.resources.length || 1);
      const compressionRatio = metrics.compressedSize / (metrics.totalSize || 1);

      if (avgLoadTime > 1000) {
        recommendations.push('Consider optimizing slow-loading resources');
      }

      if (compressionRatio > 0.8) {
        recommendations.push('Enable better compression for static assets');
      }

      if (metrics.cacheHitRatio < 0.5) {
        recommendations.push('Improve caching strategy for better performance');
      }
    }

    return {
      metrics,
      recommendations,
      prefetchedResources: Array.from(this.prefetchedResources)
    };
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.prefetchedResources.clear();
    this.fontCache.clear();
  }
}

// Singleton instance
let resourceOptimizer: ResourceOptimizer | null = null;

export function getResourceOptimizer(config?: ResourceOptimizationConfig): ResourceOptimizer {
  if (!resourceOptimizer && typeof window !== 'undefined') {
    resourceOptimizer = new ResourceOptimizer(config);
  }
  return resourceOptimizer!;
}

export function initResourceOptimization(config?: ResourceOptimizationConfig): ResourceOptimizer {
  return getResourceOptimizer(config);
}

// Utility functions
export function preloadResource(url: string, type: 'script' | 'style' | 'font' | 'image' = 'script'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;

  if (type === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

export function loadCSSAsync(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    document.head.appendChild(link);
  });
}

export function loadScriptAsync(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export default ResourceOptimizer;
