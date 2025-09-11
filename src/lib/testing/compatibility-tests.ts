export interface CompatibilityTestConfig {
  browsers?: BrowserConfig[]
  devices?: DeviceConfig[]
  viewports?: ViewportConfig[]
  features?: FeatureTest[]
  timeout?: number
  retries?: number
  screenshots?: boolean
  enableCrossBrowserTesting?: boolean
  enableAccessibilityTesting?: boolean
  parallel?: boolean
}

export interface BrowserConfig {
  name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'ie'
  versions: string[]
  platform?: 'windows' | 'mac' | 'linux'
  mobile?: boolean
}

export interface DeviceConfig {
  name: string
  type: 'mobile' | 'tablet' | 'desktop'
  userAgent: string
  viewport: { width: number; height: number }
  touchEnabled: boolean
  pixelRatio: number
}

export interface ViewportConfig {
  name: string
  width: number
  height: number
  deviceScaleFactor: number
}

export interface FeatureTest {
  name: string
  feature: string
  test: () => Promise<boolean> | boolean
  fallback?: () => Promise<void> | void
}

export interface CompatibilityResult {
  browser: string
  version: string
  platform: string
  device?: string
  viewport?: string
  passed: boolean
  issues: string[]
  features: Array<{
    name: string
    supported: boolean
    fallbackUsed: boolean
  }>
  performanceMetrics?: {
    loadTime: number
    renderTime: number
    interactivityTime: number
  }
}

export interface CompatibilityReport {
  timestamp: number
  totalTests: number
  passedTests: number
  failedTests: number
  supportMatrix: Record<string, Record<string, boolean>>
  criticalIssues: string[]
  recommendations: string[]
  results: CompatibilityResult[]
}

// Compatibility testing framework
export class CompatibilityTester {
  private config: Required<CompatibilityTestConfig>;
  private results: CompatibilityResult[] = [];
  private currentBrowser: any;
  private currentPage: any;

  constructor(config: CompatibilityTestConfig = {}) {
    this.config = {
      browsers: [
        {
          name: 'chrome',
          versions: ['latest', '90', '89'],
          platform: 'windows'
        },
        {
          name: 'firefox',
          versions: ['latest', '88', '87'],
          platform: 'windows'
        },
        {
          name: 'safari',
          versions: ['14', '13'],
          platform: 'mac'
        },
        {
          name: 'edge',
          versions: ['latest', '90'],
          platform: 'windows'
        }
      ],
      devices: [
        {
          name: 'iPhone 12',
          type: 'mobile',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
          viewport: { width: 390, height: 844 },
          touchEnabled: true,
          pixelRatio: 3
        },
        {
          name: 'iPad Pro',
          type: 'tablet',
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
          viewport: { width: 1024, height: 1366 },
          touchEnabled: true,
          pixelRatio: 2
        },
        {
          name: 'Samsung Galaxy S21',
          type: 'mobile',
          userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
          viewport: { width: 360, height: 800 },
          touchEnabled: true,
          pixelRatio: 3
        }
      ],
      viewports: [
        { name: 'Mobile Portrait', width: 375, height: 667, deviceScaleFactor: 2 },
        { name: 'Mobile Landscape', width: 667, height: 375, deviceScaleFactor: 2 },
        { name: 'Tablet Portrait', width: 768, height: 1024, deviceScaleFactor: 2 },
        { name: 'Tablet Landscape', width: 1024, height: 768, deviceScaleFactor: 2 },
        { name: 'Desktop Small', width: 1366, height: 768, deviceScaleFactor: 1 },
        { name: 'Desktop Large', width: 1920, height: 1080, deviceScaleFactor: 1 }
      ],
      features: [],
      timeout: 30000,
      retries: 2,
      screenshots: false,
      enableCrossBrowserTesting: true,
      enableAccessibilityTesting: false,
      parallel: false,
      ...config
    };

    this.initializeFeatureTests();
  }

  private initializeFeatureTests(): void {
    this.config.features = [
      {
        name: 'ES6 Support',
        feature: 'es6',
        test: () => {
          try {
            // Test arrow functions, let/const, template literals
            const test = (x) => `Hello ${x}`;
            const result = test('World');
            return result === 'Hello World';
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Flexbox Support',
        feature: 'flexbox',
        test: () => {
          const div = document.createElement('div');
          div.style.display = 'flex';
          return div.style.display === 'flex';
        }
      },
      {
        name: 'Grid Support',
        feature: 'grid',
        test: () => {
          const div = document.createElement('div');
          div.style.display = 'grid';
          return div.style.display === 'grid';
        }
      },
      {
        name: 'WebP Support',
        feature: 'webp',
        test: async () => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => resolve(img.height === 2);
            img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
          });
        }
      },
      {
        name: 'Touch Events',
        feature: 'touch',
        test: () => {
          return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
      },
      {
        name: 'Local Storage',
        feature: 'localStorage',
        test: () => {
          try {
            const test = '__test__';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            return true;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Service Worker',
        feature: 'serviceWorker',
        test: () => {
          return 'serviceWorker' in navigator;
        }
      },
      {
        name: 'Intersection Observer',
        feature: 'intersectionObserver',
        test: () => {
          return 'IntersectionObserver' in window;
        }
      }
    ];
  }

  // Main testing methods
  public async runCompatibilityTests(baseUrl: string = 'http://localhost:3000'): Promise<CompatibilityReport> {
    console.log('🔍 Starting compatibility testing...');

    const startTime = Date.now();

    if (this.config.parallel) {
      await this.runTestsInParallel(baseUrl);
    } else {
      await this.runTestsSequentially(baseUrl);
    }

    const endTime = Date.now();
    console.log(`Compatibility testing completed in ${endTime - startTime}ms`);

    return this.generateReport();
  }

  private async runTestsSequentially(baseUrl: string): Promise<void> {
    // Test each browser configuration
    for (const browserConfig of this.config.browsers) {
      for (const version of browserConfig.versions) {
        await this.testBrowserConfiguration(browserConfig, version, baseUrl);
      }
    }

    // Test device configurations
    for (const deviceConfig of this.config.devices) {
      await this.testDeviceConfiguration(deviceConfig, baseUrl);
    }

    // Test viewport configurations
    for (const viewportConfig of this.config.viewports) {
      await this.testViewportConfiguration(viewportConfig, baseUrl);
    }
  }

  private async runTestsInParallel(baseUrl: string): Promise<void> {
    const testPromises: Promise<void>[] = [];

    // Browser tests
    for (const browserConfig of this.config.browsers) {
      for (const version of browserConfig.versions) {
        testPromises.push(this.testBrowserConfiguration(browserConfig, version, baseUrl));
      }
    }

    // Device tests
    for (const deviceConfig of this.config.devices) {
      testPromises.push(this.testDeviceConfiguration(deviceConfig, baseUrl));
    }

    // Viewport tests
    for (const viewportConfig of this.config.viewports) {
      testPromises.push(this.testViewportConfiguration(viewportConfig, baseUrl));
    }

    await Promise.all(testPromises);
  }

  private async testBrowserConfiguration(
    browserConfig: BrowserConfig,
    version: string,
    baseUrl: string
  ): Promise<void> {
    const testName = `${browserConfig.name} ${version} on ${browserConfig.platform}`;
    console.log(`🧪 Testing ${testName}...`);

    const result: CompatibilityResult = {
      browser: browserConfig.name,
      version,
      platform: browserConfig.platform || 'unknown',
      passed: true,
      issues: [],
      features: []
    };

    try {
      // Initialize browser (mock implementation)
      this.currentBrowser = await this.initializeBrowser(browserConfig, version);
      this.currentPage = await this.currentBrowser.newPage();

      // Navigate to base URL
      await this.currentPage.goto(baseUrl, { timeout: this.config.timeout });

      // Test core functionality
      await this.testCoreFunctionality(result);

      // Test feature support
      await this.testFeatureSupport(result);

      // Test responsive behavior
      await this.testResponsiveBehavior(result);

      // Test performance
      await this.testPerformanceMetrics(result);

      // Take screenshot if enabled
      if (this.config.screenshots) {
        await this.takeScreenshot(`${browserConfig.name}-${version}-${Date.now()}`);
      }

    } catch (error) {
      result.passed = false;
      result.issues.push(`Browser test failed: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`❌ ${testName} failed:`, error);
    } finally {
      if (this.currentPage) {
        await this.currentPage.close();
      }
      if (this.currentBrowser) {
        await this.currentBrowser.close();
      }
    }

    this.results.push(result);
    console.log(`${result.passed ? '✅' : '❌'} ${testName} ${result.passed ? 'passed' : 'failed'}`);
  }

  private async testDeviceConfiguration(deviceConfig: DeviceConfig, baseUrl: string): Promise<void> {
    const testName = `Device: ${deviceConfig.name}`;
    console.log(`🧪 Testing ${testName}...`);

    const result: CompatibilityResult = {
      browser: 'mobile-browser',
      version: 'latest',
      platform: 'mobile',
      device: deviceConfig.name,
      passed: true,
      issues: [],
      features: []
    };

    try {
      // Initialize browser with device settings (mock implementation)
      this.currentBrowser = await this.initializeMobileBrowser(deviceConfig);
      this.currentPage = await this.currentBrowser.newPage();

      // Set viewport and user agent
      await this.currentPage.setViewportSize(deviceConfig.viewport);
      await this.currentPage.setUserAgent(deviceConfig.userAgent);

      // Navigate to base URL
      await this.currentPage.goto(baseUrl, { timeout: this.config.timeout });

      // Test mobile-specific functionality
      await this.testMobileFunctionality(result, deviceConfig);

      // Test touch interactions
      await this.testTouchInteractions(result, deviceConfig);

      // Test device-specific features
      await this.testDeviceFeatures(result, deviceConfig);

    } catch (error) {
      result.passed = false;
      result.issues.push(`Device test failed: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`❌ ${testName} failed:`, error);
    } finally {
      if (this.currentPage) {
        await this.currentPage.close();
      }
      if (this.currentBrowser) {
        await this.currentBrowser.close();
      }
    }

    this.results.push(result);
    console.log(`${result.passed ? '✅' : '❌'} ${testName} ${result.passed ? 'passed' : 'failed'}`);
  }

  private async testViewportConfiguration(viewportConfig: ViewportConfig, baseUrl: string): Promise<void> {
    const testName = `Viewport: ${viewportConfig.name}`;
    console.log(`🧪 Testing ${testName}...`);

    const result: CompatibilityResult = {
      browser: 'chrome',
      version: 'latest',
      platform: 'test',
      viewport: viewportConfig.name,
      passed: true,
      issues: [],
      features: []
    };

    try {
      // Initialize browser (mock implementation)
      this.currentBrowser = await this.initializeBrowser({ name: 'chrome', versions: ['latest'] }, 'latest');
      this.currentPage = await this.currentBrowser.newPage();

      // Set viewport
      await this.currentPage.setViewportSize({
        width: viewportConfig.width,
        height: viewportConfig.height
      });

      // Navigate to base URL
      await this.currentPage.goto(baseUrl, { timeout: this.config.timeout });

      // Test layout at this viewport
      await this.testViewportLayout(result, viewportConfig);

      // Test responsive elements
      await this.testResponsiveElements(result, viewportConfig);

    } catch (error) {
      result.passed = false;
      result.issues.push(`Viewport test failed: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`❌ ${testName} failed:`, error);
    } finally {
      if (this.currentPage) {
        await this.currentPage.close();
      }
      if (this.currentBrowser) {
        await this.currentBrowser.close();
      }
    }

    this.results.push(result);
    console.log(`${result.passed ? '✅' : '❌'} ${testName} ${result.passed ? 'passed' : 'failed'}`);
  }

  // Core testing methods
  private async testCoreFunctionality(result: CompatibilityResult): Promise<void> {
    try {
      // Test page loading
      const title = await this.currentPage.title();
      if (!title) {
        result.issues.push('Page title not loaded');
      }

      // Test basic DOM elements
      const hasNavigation = await this.currentPage.$('nav, .navigation');
      const hasMainContent = await this.currentPage.$('main, .main-content');
      const hasFooter = await this.currentPage.$('footer');

      if (!hasNavigation) result.issues.push('Navigation not found');
      if (!hasMainContent) result.issues.push('Main content not found');
      if (!hasFooter) result.issues.push('Footer not found');

      // Test JavaScript execution
      const jsWorking = await this.currentPage.evaluate(() => {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
      });

      if (!jsWorking) {
        result.issues.push('JavaScript not executing properly');
      }

      // Test CSS loading
      const hasStyles = await this.currentPage.evaluate(() => {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        return computedStyle.margin !== '' || computedStyle.padding !== '';
      });

      if (!hasStyles) {
        result.issues.push('CSS styles not loaded');
      }

    } catch (error) {
      result.issues.push(`Core functionality test error: ${error}`);
    }
  }

  private async testFeatureSupport(result: CompatibilityResult): Promise<void> {
    for (const featureTest of this.config.features) {
      try {
        const supported = await this.currentPage.evaluate(featureTest.test);
        let fallbackUsed = false;

        if (!supported && featureTest.fallback) {
          await featureTest.fallback();
          fallbackUsed = true;
        }

        result.features.push({
          name: featureTest.name,
          supported,
          fallbackUsed
        });

        if (!supported && !featureTest.fallback) {
          result.issues.push(`Feature not supported: ${featureTest.name}`);
        }

      } catch (error) {
        result.features.push({
          name: featureTest.name,
          supported: false,
          fallbackUsed: false
        });
        result.issues.push(`Feature test failed: ${featureTest.name}`);
      }
    }
  }

  private async testResponsiveBehavior(result: CompatibilityResult): Promise<void> {
    try {
      const viewports = [
        { width: 375, height: 667 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];

      for (const viewport of viewports) {
        await this.currentPage.setViewportSize(viewport);
        await this.currentPage.waitForTimeout(1000); // Allow layout to settle

        // Check if navigation adapts
        const navigation = await this.currentPage.$('nav, .navigation');
        if (navigation) {
          const isVisible = await this.currentPage.isVisible('nav, .navigation');
          if (!isVisible && viewport.width < 768) {
            // Mobile navigation should have a toggle
            const hasToggle = await this.currentPage.$('.menu-toggle, .nav-toggle, .hamburger');
            if (!hasToggle) {
              result.issues.push(`Missing mobile navigation toggle at ${viewport.width}px`);
            }
          }
        }

        // Check content overflow
        const hasHorizontalScroll = await this.currentPage.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasHorizontalScroll) {
          result.issues.push(`Horizontal scroll detected at ${viewport.width}px`);
        }
      }

    } catch (error) {
      result.issues.push(`Responsive behavior test error: ${error}`);
    }
  }

  private async testPerformanceMetrics(result: CompatibilityResult): Promise<void> {
    try {
      const performanceMetrics = await this.currentPage.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        return {
          loadTime: navigation.loadEventEnd - navigation.navigationStart,
          renderTime: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          interactivityTime: navigation.domInteractive - navigation.navigationStart
        };
      });

      result.performanceMetrics = performanceMetrics;

      // Check performance thresholds
      if (performanceMetrics.loadTime > 5000) {
        result.issues.push(`Slow page load time: ${performanceMetrics.loadTime}ms`);
      }

      if (performanceMetrics.renderTime > 3000) {
        result.issues.push(`Slow render time: ${performanceMetrics.renderTime}ms`);
      }

    } catch (error) {
      result.issues.push(`Performance metrics test error: ${error}`);
    }
  }

  private async testMobileFunctionality(result: CompatibilityResult, deviceConfig: DeviceConfig): Promise<void> {
    try {
      // Test viewport meta tag
      const hasViewportMeta = await this.currentPage.$('meta[name="viewport"]');
      if (!hasViewportMeta) {
        result.issues.push('Missing viewport meta tag for mobile');
      }

      // Test mobile navigation
      const hasHamburger = await this.currentPage.$('.menu-toggle, .nav-toggle, .hamburger');
      if (deviceConfig.type === 'mobile' && !hasHamburger) {
        result.issues.push('Missing mobile navigation menu');
      }

      // Test tap targets size
      const buttons = await this.currentPage.$$('button, a');
      for (const button of buttons) {
        const box = await button.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          result.issues.push('Touch targets too small (minimum 44px recommended)');
          break;
        }
      }

    } catch (error) {
      result.issues.push(`Mobile functionality test error: ${error}`);
    }
  }

  private async testTouchInteractions(result: CompatibilityResult, deviceConfig: DeviceConfig): Promise<void> {
    if (!deviceConfig.touchEnabled) return;

    try {
      // Test touch events
      const touchEventsSupported = await this.currentPage.evaluate(() => {
        return 'ontouchstart' in window;
      });

      if (!touchEventsSupported) {
        result.issues.push('Touch events not supported');
      }

      // Test swipe gestures (if implemented)
      const carousel = await this.currentPage.$('.carousel, .slider');
      if (carousel) {
        // Simulate touch swipe
        await this.currentPage.touchscreen.tap(500, 300);
        // More complex touch gesture testing would go here
      }

    } catch (error) {
      result.issues.push(`Touch interaction test error: ${error}`);
    }
  }

  private async testDeviceFeatures(result: CompatibilityResult, deviceConfig: DeviceConfig): Promise<void> {
    try {
      // Test pixel ratio
      const actualPixelRatio = await this.currentPage.evaluate(() => window.devicePixelRatio);
      if (Math.abs(actualPixelRatio - deviceConfig.pixelRatio) > 0.1) {
        result.issues.push(`Pixel ratio mismatch: expected ${deviceConfig.pixelRatio}, got ${actualPixelRatio}`);
      }

      // Test orientation (for mobile/tablet)
      if (deviceConfig.type !== 'desktop') {
        const orientation = await this.currentPage.evaluate(() =>
          screen.orientation ? screen.orientation.type : 'unknown'
        );

        if (orientation === 'unknown') {
          result.issues.push('Screen orientation API not supported');
        }
      }

    } catch (error) {
      result.issues.push(`Device features test error: ${error}`);
    }
  }

  private async testViewportLayout(result: CompatibilityResult, viewportConfig: ViewportConfig): Promise<void> {
    try {
      // Test if content fits in viewport
      const contentBounds = await this.currentPage.evaluate(() => {
        const body = document.body;
        return {
          width: body.scrollWidth,
          height: body.scrollHeight,
          clientWidth: body.clientWidth,
          clientHeight: body.clientHeight
        };
      });

      if (contentBounds.width > viewportConfig.width * 1.05) { // 5% tolerance
        result.issues.push(`Content width exceeds viewport at ${viewportConfig.name}`);
      }

      // Test element positioning
      const importantElements = await this.currentPage.$$('header, nav, main, footer');
      for (const element of importantElements) {
        const box = await element.boundingBox();
        if (box && box.x < 0) {
          result.issues.push(`Element positioned outside viewport at ${viewportConfig.name}`);
        }
      }

    } catch (error) {
      result.issues.push(`Viewport layout test error: ${error}`);
    }
  }

  private async testResponsiveElements(result: CompatibilityResult, viewportConfig: ViewportConfig): Promise<void> {
    try {
      // Test grid layouts
      const grids = await this.currentPage.$$('.grid, .product-grid, [style*="display: grid"]');
      for (const grid of grids) {
        const gridInfo = await grid.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            display: style.display,
            gridTemplateColumns: style.gridTemplateColumns
          };
        });

        if (gridInfo.display === 'grid' && viewportConfig.width < 768) {
          // On mobile, grid should adapt
          if (gridInfo.gridTemplateColumns.includes('repeat')) {
            result.issues.push(`Grid layout may not be mobile-optimized at ${viewportConfig.name}`);
          }
        }
      }

      // Test image responsiveness
      const images = await this.currentPage.$$('img');
      for (const img of images) {
        const imgSize = await img.evaluate((el: HTMLImageElement) => ({
          naturalWidth: el.naturalWidth,
          clientWidth: el.clientWidth
        }));

        if (imgSize.clientWidth > viewportConfig.width) {
          result.issues.push(`Image exceeds viewport width at ${viewportConfig.name}`);
        }
      }

    } catch (error) {
      result.issues.push(`Responsive elements test error: ${error}`);
    }
  }

  // Browser initialization methods (mock implementations)
  private async initializeBrowser(browserConfig: BrowserConfig, version: string): Promise<any> {
    // Mock browser initialization
    return {
      newPage: async () => ({
        goto: async (url: string) => console.log(`Navigate to ${url}`),
        title: async () => 'Test Page',
        $: async (selector: string) => ({ selector }),
        $$: async (selector: string) => [{ selector }],
        evaluate: async (fn: Function) => fn(),
        setViewportSize: async (size: any) => console.log(`Set viewport: ${size.width}x${size.height}`),
        setUserAgent: async (ua: string) => console.log(`Set user agent: ${ua}`),
        waitForTimeout: async (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
        isVisible: async (selector: string) => true,
        touchscreen: {
          tap: async (x: number, y: number) => console.log(`Tap at ${x}, ${y}`)
        },
        screenshot: async (options: any) => console.log('Screenshot taken'),
        close: async () => console.log('Page closed')
      }),
      close: async () => console.log('Browser closed')
    };
  }

  private async initializeMobileBrowser(deviceConfig: DeviceConfig): Promise<any> {
    // Mock mobile browser initialization
    return this.initializeBrowser({ name: 'chrome', versions: ['latest'] }, 'latest');
  }

  private async takeScreenshot(filename: string): Promise<void> {
    try {
      await this.currentPage.screenshot({
        path: `screenshots/${filename}.png`,
        fullPage: true
      });
      console.log(`📸 Screenshot saved: ${filename}.png`);
    } catch (error) {
      console.warn('Screenshot failed:', error);
    }
  }

  // Report generation
  private generateReport(): CompatibilityReport {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    // Build support matrix
    const supportMatrix: Record<string, Record<string, boolean>> = {};
    this.results.forEach(result => {
      const key = `${result.browser} ${result.version}`;
      if (!supportMatrix[key]) {
        supportMatrix[key] = {};
      }
      supportMatrix[key][result.platform] = result.passed;
    });

    // Identify critical issues
    const criticalIssues = this.identifyCriticalIssues();

    // Generate recommendations
    const recommendations = this.generateRecommendations();

    return {
      timestamp: Date.now(),
      totalTests,
      passedTests,
      failedTests,
      supportMatrix,
      criticalIssues,
      recommendations,
      results: this.results
    };
  }

  private identifyCriticalIssues(): string[] {
    const criticalIssues: string[] = [];
    const issueCount = new Map<string, number>();

    // Count frequency of issues
    this.results.forEach(result => {
      result.issues.forEach(issue => {
        const count = issueCount.get(issue) || 0;
        issueCount.set(issue, count + 1);
      });
    });

    // Issues that appear in multiple browsers/devices are critical
    issueCount.forEach((count, issue) => {
      if (count >= Math.ceil(this.results.length * 0.5)) { // 50% or more
        criticalIssues.push(issue);
      }
    });

    return criticalIssues;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Analyze common issues and provide recommendations
    const allIssues = this.results.flatMap(r => r.issues);

    if (allIssues.some(issue => issue.includes('mobile navigation'))) {
      recommendations.push('Implement responsive mobile navigation menu');
    }

    if (allIssues.some(issue => issue.includes('viewport width'))) {
      recommendations.push('Review responsive design and implement proper breakpoints');
    }

    if (allIssues.some(issue => issue.includes('Touch targets'))) {
      recommendations.push('Increase touch target sizes to minimum 44px for mobile accessibility');
    }

    if (allIssues.some(issue => issue.includes('JavaScript'))) {
      recommendations.push('Add polyfills for better browser compatibility');
    }

    if (allIssues.some(issue => issue.includes('load time'))) {
      recommendations.push('Optimize performance with code splitting and lazy loading');
    }

    // Feature support recommendations
    const unsupportedFeatures = this.results.flatMap(r =>
      r.features.filter(f => !f.supported).map(f => f.name)
    );

    if (unsupportedFeatures.includes('WebP Support')) {
      recommendations.push('Provide fallback image formats for browsers without WebP support');
    }

    if (unsupportedFeatures.includes('Grid Support')) {
      recommendations.push('Implement flexbox fallbacks for CSS Grid layouts');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  public getResults(): CompatibilityResult[] {
    return [...this.results];
  }

  public printReport(): void {
    const report = this.generateReport();

    console.log('\n📊 Compatibility Test Report:');
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   Passed: ${report.passedTests}`);
    console.log(`   Failed: ${report.failedTests}`);
    console.log(`   Success Rate: ${((report.passedTests / report.totalTests) * 100).toFixed(1)}%`);

    if (report.criticalIssues.length > 0) {
      console.log('\n🚨 Critical Issues:');
      report.criticalIssues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }

    console.log('\n🌐 Browser Support Matrix:');
    Object.entries(report.supportMatrix).forEach(([browser, platforms]) => {
      console.log(`   ${browser}:`);
      Object.entries(platforms).forEach(([platform, supported]) => {
        console.log(`     ${platform}: ${supported ? '✅' : '❌'}`);
      });
    });
  }
}

export default CompatibilityTester;
